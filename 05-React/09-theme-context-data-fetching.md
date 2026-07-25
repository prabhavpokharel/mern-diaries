# Theme Context, Data Fetching & JSON

---

## Dark/Light Theme with Context

This is a practical application of everything learned so far — context + state + conditional rendering working together.

### Two Steps to Create Any Context

1. Create the context with `createContext()`
2. Export the Provider component that wraps children

```jsx
// context/MyThemeContext.jsx
import { createContext, useState } from 'react'

export const MyThemeContext = createContext()

export const MyThemeContextProvider = ({ children }) => {
  let [theme, setTheme] = useState('light')

  return (
    <MyThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </MyThemeContext.Provider>
  )
}
```

`value={{ theme, setTheme }}` passes both the current theme and the setter — so any child can read the theme *and* change it.

### Choosing the Initial Theme Value

For boolean-like toggles you could use `true/false`, but using `'light'`/`'dark'` strings is better here because:

- You use these strings directly in class names (`mylink-light`, `mylink-dark`, `bg-light`, `bg-dark`)
- Easier to read and debug — `theme === 'light'` is clearer than `theme === true`

### Toggle Pattern

```jsx
const toggleTheme = () => {
  theme === 'light' ? setTheme('dark') : setTheme('light')
}
```

A ternary that flips between two string values. Same concept as the boolean toggle from Day 6.

### Consuming in Components

```jsx
let { theme, setTheme } = useContext(MyThemeContext)
```

Destructure both values from context — read `theme` to apply classes, call `setTheme` to change it.

---

## Applying Theme with Dynamic Classes

The theme string is used directly in class names, making the pattern very clean:

```jsx
// Static part + dynamic theme suffix
<div className={`bg-${theme}`}>...</div>
<Link className={`mylink-${theme}`}>Home</Link>
<input className={`input-${theme}`} />
```

These classes (`bg-light`, `bg-dark`, `mylink-light`, `mylink-dark`) are defined in CSS using `@apply`:

```css
.mylink-light {
  @apply text-slate-900 no-underline;
}
.mylink-dark {
  @apply text-slate-200 no-underline;
}
.bg-light {
  @apply bg-slate-200;
}
.bg-dark {
  @apply bg-slate-600 !important;
}
```

**Why not pure Tailwind?** Tailwind generates classes at build time. Dynamic class names like `bg-${theme}` can't be detected by Tailwind's purge process — it doesn't know what string will be there at runtime. Using custom CSS classes with `@apply` solves this.

### Theme Toggle Icon

```jsx
<span onClick={toggleTheme}>
  {theme === 'light' ? <BiMoon /> : <BiSun />}
</span>
```

Light mode → show moon icon (click to go dark). Dark mode → show sun icon (click to go light). Conditional rendering with icons.

---

## Multiple Contexts — Nesting Providers

When you have multiple contexts, nest the providers in `App.jsx`. Order matters — the outermost provider is available to everything:

```jsx
function App() {
  return (
    <MyThemeContextProvider>
      <MyContextProvider>
        <MyRoutes />
      </MyContextProvider>
    </MyThemeContextProvider>
  )
}
```

Any component inside can access either context. This is the standard pattern for multiple global states (theme, auth, cart, language, etc.).

---

## Fetching Online Data

Until now, all data was hardcoded in the component. Real apps fetch data from APIs.

### What is JSON?

**JSON (JavaScript Object Notation)** is a data format for exchanging data between systems. It's not JavaScript — it's a text format that *looks like* a JavaScript object, making it easy to parse in JS. It works with any language (Python, PHP, etc.).

```json
{
  "id": 1,
  "title": "Post title here",
  "body": "Post body content"
}
```

---

### Fetching Data with useEffect + fetch

```jsx
const DataFetch = () => {
  let [posts, setPosts] = useState([])

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(res => res.json())
      .then(data => setPosts(data))
  }, [])

  return (
    <div>
      {posts.map(post => (
        <div key={post.id} className="p-5 shadow-lg">
          <h3>{post.title}</h3>
        </div>
      ))}
    </div>
  )
}
```

### Step by step

| Step | What happens |
| ------ | ------------- |
| `useState([])` | Start with empty array — nothing renders yet |
| `useEffect(..., [])` | Empty dependency array = runs once on page load only |
| `fetch(url)` | Makes an HTTP GET request to the API |
| `.then(res => res.json())` | Converts the raw response into a JavaScript object |
| `.then(data => setPosts(data))` | Puts the data into state → triggers re-render |
| `posts.map(...)` | Loops through the array and renders a card for each post |

The `[]` dependency array is critical here. Without it, every state change (like `setPosts`) would trigger the effect again — causing an infinite loop of fetch → set state → re-fetch.

---

## The `key` Prop Warning

When you render a list with `.map()`, React needs a way to track each item individually so it knows what changed when re-rendering. Without `key`, React has to re-render the entire list on any change — inefficient.

```jsx
// ❌ Warning: Each child in a list should have a unique "key" prop
posts.map(post => <div>{post.title}</div>)

// ✅ Correct — use a unique id
posts.map(post => <div key={post.id}>{post.title}</div>)

// ✅ Fallback — use array index (only if no id exists)
posts.map((post, index) => <div key={index}>{post.title}</div>)
```

`key` must be **unique within the list** and **stable** (doesn't change between renders). Using `index` as a key is acceptable when there's no unique id, but not ideal if the list can be reordered.

The `key` prop is not accessible inside the component — it's only used internally by React.

---

## Summary

| Concept | Key Point |
| --------- | ----------- |
| Theme context | Store `theme` string in context, use it to build class names |
| Dynamic class names | Use `bg-${theme}` with custom `@apply` classes — pure Tailwind can't resolve dynamic strings |
| Multiple contexts | Nest providers in App.jsx |
| JSON | Language-agnostic text data format, easy to parse in JS |
| `fetch()` | Built-in browser API for making HTTP requests |
| `useEffect + []` | Fetch on load once, not on every render |
| `key` prop | Required for list items — helps React track changes efficiently |
