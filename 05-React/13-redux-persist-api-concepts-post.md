# React.js — Day 12: redux-persist, API Concepts & POST Requests

---

## The Problem — State Resets on Refresh

Every time the page reloads, Redux initialises from `initialData` in each reducer. Whatever the user changed — the counter value, the person's name — is gone. The store lives in memory, and memory is wiped on refresh.

**`redux-persist`** solves this by automatically saving the Redux store to `localStorage` (or another storage backend) after every change, and rehydrating it back into the store on page load.

---

## redux-persist

```bash
npm install redux-persist
```

### Setup in `store.jsx`

```jsx
import { combineReducers, createStore } from "redux"
import { counterReducer } from "./counterReducer"
import { PersonReducer } from "./PersonReducer"
import { Provider } from "react-redux"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"   // localStorage for web
import { PersistGate } from "redux-persist/integration/react"

const rootReducer = combineReducers({
  counterStore: counterReducer,
  personStore: PersonReducer,
})

const persistConfig = {
  key: "root",
  storage: storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const myStore = createStore(persistedReducer)
const persistor = persistStore(myStore)

export const MyStoreProvider = ({ children }) => {
  return (
    <Provider store={myStore}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
```

### What each part does

**`persistConfig`**

```jsx
const persistConfig = {
  key: "root",       // the key used in localStorage — stored as "persist:root"
  storage: storage,  // where to save — localStorage by default
}
```

You can also whitelist or blacklist specific reducers:

```jsx
const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["personStore"],   // only persist personStore, not counterStore
  // blacklist: ["counterStore"] // persist everything except counterStore
}
```

**`persistReducer(persistConfig, rootReducer)`**

Wraps your root reducer with persistence logic. Every time state changes, it serialises the new state and writes it to storage. On startup, it reads from storage and rehydrates the store before your app renders.

**`persistStore(myStore)`**

Creates the persistor object — manages the persistence lifecycle (loading, rehydrating, purging).

**`<PersistGate loading={null} persistor={persistor}>`**

Delays rendering your app until the stored state has been rehydrated into the store. Without this, components would render with the reducer's `initialData` for a split second before the persisted state loads — causing a flash of wrong content.

`loading={null}` renders nothing during rehydration. You can pass a loading component instead:

```jsx
<PersistGate loading={<div>Loading...</div>} persistor={persistor}>
```

### Import correction

The original code used:
```jsx
import localStorage from "redux-persist/es/storage"
```

The correct, documented import is:
```jsx
import storage from "redux-persist/lib/storage"
```

`lib/storage` is the stable path. The variable name `localStorage` in the original also shadows the browser's built-in `window.localStorage` — use `storage` to avoid confusion.

### What it looks like in the browser

Open DevTools → Application → Local Storage. You'll see a key called `persist:root` containing a JSON string of your entire Redux state. On refresh, `redux-persist` reads this and restores the store before React renders anything.

---

## API Concepts

### What is an API Key?

An **API key** is a unique identifier — a string — that you include with every request to a third-party API. It tells the API server who is making the request, so the provider can:

- Track your usage
- Enforce limits
- Bill you if you exceed the free tier
- Revoke access if you abuse the service

```js
headers: {
  "x-rapidapi-key": "your_key_here"
}
```

Without a valid key, the API returns a 401 (Unauthorized) or 403 (Forbidden) response.

**Free API tiers** typically come with restrictions:

| Restriction | Example |
|-------------|---------|
| Request limit | 100 requests per day |
| Rate limit | 5 requests per second |
| Feature limits | Only GET requests, no POST |
| Data limits | Truncated responses, fewer fields |

### What is a Request?

A **request** is one call to an API endpoint — one `fetch()` or `axios.get()`. Every time your code contacts the server, that's one request. If you fetch 50 posts and then fetch one post detail, that's 2 requests total.

### What is a Rate Limit?

A **rate limit** is a cap on how many requests you can make within a time window — distinct from a total request quota.

| Term | Meaning |
|------|---------|
| **Request quota** | Total requests allowed (e.g. 500/day) |
| **Rate limit** | Requests per time unit (e.g. 5/second, 100/minute) |

You can have both. Even if you have 10,000 requests per day, hitting 100 per second might still get you temporarily blocked. When you exceed a rate limit, the API returns a **429 Too Many Requests** response.

### API keys do not belong in source code

The RapidAPI key is hardcoded in the component — same issue as Day 9. Anyone who sees your code can use that key. Move it to an environment variable:

```bash
# .env
VITE_RAPIDAPI_KEY=your_actual_key_here
```

```jsx
const apiKey = import.meta.env.VITE_RAPIDAPI_KEY
```

Add `.env` to `.gitignore`. Never commit it.

### Useful free APIs for practice

| API | What it provides |
|-----|-----------------|
| `jsonplaceholder.typicode.com` | Fake posts, users, todos — no key needed |
| `fakestoreapi.com` | Fake ecommerce products — no key needed |
| `dummyjson.com` | Products, users, carts, recipes — no key needed |
| `newsapi.org` | Real news headlines — free tier with key |
| RapidAPI marketplace | Hundreds of APIs — free tiers with key |

---

## Translate App — GET then POST

This component demonstrates two things together: fetching a list on load (GET) and submitting user input to an API (POST).

### Fetching the language list on mount

```jsx
useEffect(() => {
  const url = 'https://google-translate113.p.rapidapi.com/api/v1/translator/support-languages'
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
      'x-rapidapi-host': 'google-translate113.p.rapidapi.com',
    }
  }

  fetch(url, options)
    .then(res => res.json())
    .then(data => setLanguages(data))
    .catch(err => console.error(err))
}, [])
```

Empty dependency array — runs once on mount. The response is an array of objects like `{ code: 'ne', language: 'Nepali' }`. These are mapped into `<option>` elements in the dropdown.

### Translating on button click — POST request

```jsx
const handleTranslate = async () => {
  setLoading(true)
  const url = 'https://google-translate113.p.rapidapi.com/api/v1/translator/text'
  const options = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
      'x-rapidapi-host': 'google-translate113.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'en',
      to: language,
      text: inputText
    })
  }

  try {
    const response = await fetch(url, options)
    const result = await response.json()
    setTranslatedText(result.trans)
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false)
  }
}
```

**Key differences from a GET request:**

| Part | Purpose |
|------|---------|
| `method: 'POST'` | Tells the server you're sending data, not just requesting it |
| `'Content-Type': 'application/json'` | Tells the server the body is JSON |
| `body: JSON.stringify({...})` | The data you're sending — must be a string, not an object |

`JSON.stringify()` converts your JavaScript object into a JSON string. The server parses it back on the other end.

**Note on `loading` in the original:** `setLoading` was declared but never called in `handleTranslate`, so the loading indicator never actually showed. The corrected version above adds `setLoading(true)` before the request and `setLoading(false)` in `finally`.

### Rendering the language dropdown

```jsx
{languages.map(item => (
  <option key={item.code} value={item.code}>
    {item.language}
  </option>
))}
```

`item.code` is used as both the `key` (unique per item) and the `value` (what gets sent to the API). `item.language` is the human-readable label shown to the user. When the user selects a language, `onChange` updates the `language` state with the code — that code is what you pass to the API in `to: language`.

### Conditional output rendering

```jsx
{loading
  ? "Your text is loading. Please wait"
  : <p className="mb-0 text-secondary">{translatedText}</p>
}
```

Standard loading ternary — show a message while waiting, show the result when done.

---

## Complete State Summary for the Translate Component

```
languages: []        ← populated once on mount from GET request
inputText: ''        ← updated on every keystroke in the textarea
language: ''         ← updated when user selects from dropdown
translatedText: '...'← updated after POST request returns
loading: false       ← true during POST request, false otherwise
```

Five independent pieces of state, each with a clear responsibility. None of them go in Redux — they're local to this component and not needed anywhere else. This is the right call: Redux is for state that multiple components across the app need to share. Component-local state stays in `useState`.

---

## When to Use What — Final Summary

| Tool | Use when |
|------|----------|
| `useState` | State is local to one component |
| Context | Data needed across many components, changes infrequently |
| Redux | Complex shared state, many components read/write, predictable update patterns needed |
| `redux-persist` | Redux state needs to survive page refresh |