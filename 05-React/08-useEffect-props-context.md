# React.js — Day 7: useEffect, Props & Context

---

## useEffect

`useEffect` lets you run code in response to something changing — a state variable, a prop, or just the component mounting for the first time. These are called **side effects**: things that happen *because of* a render, not directly caused by a user interaction.

**Real-world example:** On Amazon, adjusting the price slider or selecting a brand filter changes state. The product list on the right updates in response. The filter state triggers a data reload — that's `useEffect` in action.

### Syntax

```jsx
import { useEffect } from 'react'

useEffect(() => {
  // side effect code here
}, [dependencyArray])
```

### Three forms

```jsx
// 1. Runs on first load AND whenever a, b, or c changes
useEffect(() => {
  // runs when component mounts and when a, b, or c updates
}, [a, b, c])

// 2. Runs ONLY on first load — empty array means no dependencies
useEffect(() => {
  // runs once when component mounts
}, [])

// 3. No dependency array — runs on every single render
useEffect(() => {
  // runs after every render — usually not what you want
})
```

Form 3 fires on every state change in the component — including the ones triggered by the effect itself. This causes infinite loops in most real scenarios. Avoid it unless you have a specific reason.

### Example

```jsx
useEffect(() => {
  alert("Value updated")
}, [count, data])
```

The alert fires when `count` or `data` changes. Both are watched via the dependency array.

---

## useEffect Cleanup

`useEffect` can optionally return a **cleanup function**. React calls it before running the effect again (when dependencies change) and when the component unmounts.

Without cleanup, things like intervals, event listeners, and subscriptions stack up on every render and cause memory leaks.

```jsx
useEffect(() => {
  const interval = setInterval(() => {
    console.log('tick')
  }, 1000)

  // return the cleanup function
  return () => clearInterval(interval)
}, [])
```

You haven't needed this yet, but you will the moment you use `setInterval`, `addEventListener`, or any external subscription inside `useEffect`. Always return a cleanup function for these.

---

## Why the Effect Fires Twice in Development

If you see `useEffect` running twice on page load, it's because of **StrictMode** in `main.jsx`:

```jsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

StrictMode intentionally mounts → unmounts → remounts components in development to surface bugs — particularly effects that don't clean up properly after themselves. If your effect causes a problem when it runs twice, the problem is in your code, not in StrictMode.

**Do not remove StrictMode** to silence the double-fire. The correct fix is to write effects that handle being run twice safely — which usually means returning a proper cleanup function. StrictMode only does this in development; in production each effect runs exactly once.

---

## Props — Passing Data Between Components

**Props** (short for *properties*) are how you pass data from a parent component into a child — the same concept as function arguments.

```jsx
// Parent passes data as attributes
<PersonCard name="Ram" age="32" phone="9812345678" />

// Child receives all attributes as a single object
const PersonCard = (props) => {
  return <div>Name: {props.name}</div>
}
```

React automatically assembles whatever attributes you put on a component tag into a single `props` object.

### Destructuring Props

Accessing `props.name`, `props.age` everywhere gets verbose. Destructure directly in the function signature instead:

```jsx
// Raw props object
const PersonCard = (props) => {
  return <div>{props.name} {props.age}</div>
}

// Destructured in the parameter — the standard React style
const PersonCard = ({ name, age, phone }) => {
  return <div>{name} {age} {phone}</div>
}

// Destructured inside the function body — less common but identical
const PersonCard = (props) => {
  const { name, age, phone } = props
  return <div>{name} {age} {phone}</div>
}
```

All three produce the same result. Inline destructuring in the parameter is the most common pattern in modern React.

### Default Props

If a parent doesn't pass a prop, its value is `undefined` — which silently breaks rendering. Set defaults to handle missing props:

```jsx
const PersonCard = ({ name = 'N/A', age = 'N/A', phone = 'N/A' }) => {
  return (
    <div>
      Name: {name} <br/>
      Age: {age} <br/>
      Phone: {phone}
    </div>
  )
}
```

```jsx
<PersonCard name="Ram" age="32" phone="9812345678" />  // renders real data
<PersonCard />                                          // renders N/A for all
```

---

## Context — Shared State Without Prop Drilling

### The Problem

Imagine data that many components need — a logged-in user's name, the current theme, the cart count. To get that data from `App` down to a deeply nested component using props, you'd have to pass it through every component in between, even ones that don't use it at all. This is **prop drilling** — messy, hard to maintain, and it breaks the moment you restructure your component tree.

### What Context Solves

Context provides a way to put data in one central place and let any component in the tree read it directly — no intermediate passing required.

### Step 1 — Create the context

```jsx
// context/MyContext.jsx
import { createContext } from "react"

export const MyContext = createContext()

export const MyContextProvider = ({ children }) => {
  return (
    <MyContext.Provider value={'Good Afternoon'}>
      {children}
    </MyContext.Provider>
  )
}
```

- `createContext()` creates the context object
- `MyContextProvider` is a wrapper component that makes `value` available to everything inside it
- `{children}` renders whatever gets wrapped inside `<MyContextProvider>`

**Note on the `value` prop:** This example uses a static string to keep things simple. In real usage, `value` is almost always an object containing both state and its setter — so that consumers can read *and* update the shared data. The theme context from the next session (`{ theme, setTheme }`) is the more realistic pattern.

### Step 2 — Wrap your app in the provider

```jsx
// App.jsx
function App() {
  return (
    <MyContextProvider>
      <MyRoutes />
    </MyContextProvider>
  )
}
```

Everything inside `<MyContextProvider>` can now access the context value. The provider acts like a bubble — anything inside the bubble can read what the bubble holds.

### Step 3 — Consume the context with `useContext`

```jsx
import { useContext } from "react"
import { MyContext } from "../../context/MyContext"

const UserProfiles = () => {
  const msg = useContext(MyContext)

  return <div>{msg}</div>   // renders "Good Afternoon"
}
```

`useContext(MyContext)` reads whatever `value` was set on the nearest matching Provider above it in the tree. No props passed, no drilling.

---

## Props vs Context

| | Props | Context |
|---|---|---|
| **Use when** | Data flows from parent to direct child | Data needed across many components in the tree |
| **Best for** | Component-specific data: `name`, `onClick`, `className` | Global data: logged-in user, theme, cart, language |
| **Downside** | Becomes prop drilling when passed through many layers | Adds indirection — harder to trace where data comes from |

One app can have multiple contexts — one for auth, one for theme, one for cart. Each is independent.

---

## How It All Connects

```
App.jsx
  └── <MyContextProvider>                         ← provides "Good Afternoon" to everything inside
        └── <MyRoutes />
              └── <UserProfiles />
                    → useContext(MyContext)        ← reads "Good Afternoon" directly, no props
                    └── <PersonCard name="Ram" />
                          → props.name = "Ram"    ← explicit, passed from parent
```

Context flows invisibly down the tree to whoever asks for it. Props flow explicitly from one component directly to its children.

---

## Summary

| Hook / Concept | What it does |
|----------------|-------------|
| `useEffect(() => {}, [a, b])` | Run a side effect when `a` or `b` changes |
| `useEffect(() => {}, [])` | Run once when the component first mounts |
| Cleanup function | Return from `useEffect` to clear intervals, listeners, subscriptions |
| StrictMode double-fire | Expected in development — don't remove StrictMode, fix the effect |
| `props` | Object React builds from attributes on a component tag |
| Destructuring props | Extract values cleanly in the function parameter |
| Default props | Fallback values for missing props — prevents `undefined` errors |
| `createContext()` | Creates a context object |
| `<Context.Provider value={...}>` | Makes `value` available to all descendants |
| `useContext(MyContext)` | Reads context value from any component inside the provider |