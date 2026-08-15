# React.js — Day 8: Theme Context, Data Fetching & JSON

---

## Dark/Light Theme with Context

This is where everything from the last few sessions comes together — context, state, conditional rendering, and dynamic class names working as one system.

### Two Steps to Create Any Context

1. Create the context object with `createContext()`
2. Export a Provider component that holds the state and wraps children

```jsx
// context/MyThemeContext.jsx
import { createContext, useState } from 'react'

export const MyThemeContext = createContext()

export const MyThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')

  return (
    <MyThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </MyThemeContext.Provider>
  )
}
```

`value={{ theme, setTheme }}` passes both the current value and the setter. Any component inside the provider can read `theme` and call `setTheme` to change it — this is the correct pattern for context that needs to be both readable and updatable.

### Why String Values Instead of Boolean

You could use `true/false` for a toggle, but `'light'`/`'dark'` strings are better here for a concrete reason: you use these values directly in CSS class names:

```jsx
<div className={`bg-${theme}`}>      // bg-light or bg-dark
<Link className={`mylink-${theme}`}> // mylink-light or mylink-dark
```

`theme === 'light'` is also more readable in conditions than `theme === true`.

### Toggle Pattern

```jsx
const toggleTheme = () => {
  setTheme(prev => prev === 'light' ? 'dark' : 'light')
}
```

Uses the functional update form — reads the guaranteed latest value and flips it.

### Consuming in Any Component

```jsx
import { useContext } from 'react'
import { MyThemeContext } from '../context/MyThemeContext'

const Header = () => {
  const { theme, setTheme } = useContext(MyThemeContext)
  // use theme to apply classes, setTheme to toggle
}
```

### Theme Toggle Icon

```jsx
<span onClick={toggleTheme}>
  {theme === 'light' ? <BiMoon /> : <BiSun />}
</span>
```

Light mode → moon icon (clicking switches to dark). Dark mode → sun icon (clicking switches to light). Conditional rendering controlling which icon shows.

---

## Applying Theme with Dynamic Class Names

```jsx
<div className={`bg-${theme}`}>
<Link className={`mylink-${theme}`}>
<input className={`input-${theme}`} />
```

These produce class names like `bg-light`, `bg-dark`, `mylink-light`, `mylink-dark`. You define these in CSS using `@apply`:

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
  @apply bg-slate-600;
}
```

**Why not pure Tailwind utility classes?** Tailwind scans your source files at build time for complete class name strings. A dynamic string like `bg-${theme}` is never a complete class name in source — Tailwind can't detect it and the class won't exist in the build. Custom CSS classes applied via `@apply` sidestep this entirely. This is the standard workaround for dynamic Tailwind theming.

---

## Multiple Contexts — Nesting Providers

When you have multiple contexts, nest the providers in `App.jsx`:

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

Any component inside can access either context independently. This is the standard pattern for multiple global states — theme, auth, cart, language each get their own context.

---

## Fetching Data from an API

Until now all data was hardcoded. Real apps fetch data from external APIs.

### What is JSON?

**JSON (JavaScript Object Notation)** is a text format for exchanging data between systems. It looks like a JavaScript object but it's just a string — any language can parse it. When you fetch from an API, the response arrives as a JSON string. `.json()` parses it into a real JavaScript object you can work with.

```json
{
  "id": 1,
  "title": "Post title here",
  "body": "Post body content"
}
```

### Fetching with useEffect — The Pattern

The standard pattern: start with empty state, fetch once on mount, update state with the response.

```jsx
const DataFetch = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
        return res.json()
      })
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
      .catch(err => console.error('Fetch failed:', err))
  }, [])

  if (loading) return <div>Loading...</div>

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
|------|-------------|
| `useState([])` | Start with empty array — nothing renders in the list yet |
| `useState(true)` | Loading starts as true — show a loading indicator |
| `useEffect(..., [])` | Empty array = runs once on mount, never again |
| `fetch(url)` | Makes an HTTP GET request |
| `if (!res.ok) throw` | Catches HTTP errors (404, 500) — `fetch` doesn't throw on these automatically |
| `.then(res => res.json())` | Parses the raw response text into a JavaScript object |
| `setPosts(data)` | Puts data into state — triggers re-render with the list |
| `setLoading(false)` | Hides the loading indicator |
| `.catch(err => ...)` | Handles network failures |

**Why the empty `[]` dependency array matters:** Without it, `useEffect` runs after every render. `setPosts` triggers a render. That triggers the effect again. That triggers another `setPosts`. Infinite loop. The empty array ensures the fetch runs exactly once.

### The async/await Alternative

Most codebases today write this with `async/await` instead of `.then()` chains. Both do the same thing — you'll encounter both in real code:

```jsx
useEffect(() => {
  const fetchPosts = async () => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts")
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
      const data = await res.json()
      setPosts(data)
      setLoading(false)
    } catch (err) {
      console.error('Fetch failed:', err)
    }
  }

  fetchPosts()
}, [])
```

Note: you can't make the `useEffect` callback itself `async` — the callback must return either nothing or a cleanup function, not a Promise. The workaround is to define an async function inside the effect and call it immediately.

---

## The `key` Prop

When rendering a list with `.map()`, React needs a way to identify each item between renders so it knows what changed, what was added, and what was removed. Without `key`, React re-renders the entire list on any change.

```jsx
// ❌ Missing key — React warns and performance suffers
posts.map(post => <div>{post.title}</div>)

// ✅ Use a unique, stable id from the data
posts.map(post => <div key={post.id}>{post.title}</div>)

// ⚠️ Index as fallback — only acceptable for truly static lists
posts.map((post, index) => <div key={index}>{post.title}</div>)
```

**Why index is dangerous:** If items can be deleted, reordered, or inserted in the middle, React uses the index to match components to data. After a deletion, the indexes shift — React maps the wrong component to the wrong data and renders incorrect content in the wrong place. Only use index when the list is truly static and will never change.

`key` is internal to React — you can't read it as a prop inside the component.

---

## Summary

| Concept | Key Point |
|---------|-----------|
| Theme context | State + setter in `value` — consumers can both read and update |
| String vs boolean for theme | Strings work directly as class name suffixes |
| Dynamic Tailwind classes | Use `@apply` in CSS — Tailwind can't detect runtime string interpolation |
| Multiple contexts | Nest providers in `App.jsx` — each is independent |
| JSON | Text format that looks like a JS object — `.json()` parses it |
| `fetch` error handling | Check `res.ok` — fetch doesn't throw on 404/500 |
| Loading state | Always track it — prevents empty flash before data arrives |
| `useEffect + []` | Runs once on mount — prevents infinite loop with `setPosts` |
| `async/await` in useEffect | Define an inner async function and call it — don't make the callback itself async |
| `key` prop | Must be unique and stable — never use index for lists that can change |