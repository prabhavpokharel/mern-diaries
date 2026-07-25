# useEffect, Props & Context

---

## useEffect

`useEffect` lets you run code in response to something changing — a state variable, a prop, or just the component loading for the first time. These are called **side effects** — things that happen *because of* a state change, not as a direct result of user interaction.

**Real-world analogy:** On Amazon, when you adjust the price slider or select a brand filter (state changes), the product list on the right updates (the effect). The filter states trigger a data reload — that's `useEffect` in action.

### Syntax

```jsx
useEffect(() => {
  // side effect code here
}, [dependencyArray])
```

### Three forms

```jsx
// 1. Runs on load AND whenever a, b, or c changes
useEffect(() => { func }, [a, b, c])

// 2. Runs ONLY on first load (empty array = no dependencies)
useEffect(() => { func }, [])

// 3. Runs on load AND on every single state change (dangerous — avoid)
useEffect(() => { func })
```

### In the counter example

```jsx
useEffect(() => {
  alert("Value updated")
}, [count, data])
```

The alert fires whenever `count` or `data` changes. Both are in the dependency array.

---

## Why the Alert Fires Twice on Reload

If you're in development and see `useEffect` running twice on page load, it's because of **StrictMode** in `main.jsx`:

```jsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

StrictMode intentionally mounts, unmounts, and remounts components to help you catch bugs — so every effect runs twice in development. **This only happens in development, not in production.** It's not a bug in your code.

You can remove `<React.StrictMode>` during development to avoid the noise, but keep it in for catching real bugs.

---

## Props — Passing Data into Components

**Props** (short for *properties*) are how you pass data from a parent component into a child component — just like passing arguments into a function.

```jsx
// Parent passes data
<PersonCard name="Ram" age="32" phone="9812345678" />

// Child receives it
const PersonCard = (props) => {
  return <div>Name: {props.name}</div>
}
```

`props` is just a JavaScript object that React automatically creates from whatever attributes you put on the component tag.

### Destructuring Props

Instead of `props.name`, `props.age` everywhere, you destructure directly in the function signature:

```jsx
// Without destructuring
const PersonCard = (props) => {
  return <div>{props.name} {props.age}</div>
}

// With destructuring (cleaner)
const PersonCard = ({ name, age, phone }) => {
  return <div>{name} {age} {phone}</div>
}

// Alternative: destructure inside the function body
const PersonCard = (props) => {
  const { name, age, phone } = props
  return <div>{name} {age} {phone}</div>
}
```

All three are identical. The inline destructuring in the parameter is the most common React style.

### Default Props

You can set default values so the component doesn't break when a prop isn't passed:

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
<PersonCard name="Ram" age="32" phone="9812345678" />  // shows real data
<PersonCard />                                           // shows N/A for all
```

---

## Context — Global State Without Drilling

### The Problem Props Create

Imagine you have data that many components across the app need — like a logged-in user's name. To get it from `App` down to a deeply nested component, you'd have to pass it as a prop through every component in between, even ones that don't need it. This is called **prop drilling** and it's painful.

### What Context Solves

Context lets you put data in one central place and any component in the tree can access it directly — no drilling through layers.

### Creating Context

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
- `MyContextProvider` is a wrapper component that makes the value available to everything inside it
- `value={...}` is what gets shared — can be a string, object, array, anything
- `{children}` renders whatever is wrapped inside `<MyContextProvider>`

### Providing Context — wrap in App.jsx

```jsx
function App() {
  return (
    <MyContextProvider>
      <MyRoutes />
    </MyContextProvider>
  )
}
```

Everything inside `<MyContextProvider>` can now access the context value. Think of it like a bubble — anything inside the bubble can read the shared value.

### Consuming Context — useContext

```jsx
import { useContext } from "react"
import { MyContext } from "../../context/MyContext"

const UserProfiles = () => {
  const msg = useContext(MyContext)

  return <div>{msg}</div>   // renders "Good Afternoon"
}
```

`useContext(MyContext)` grabs whatever `value` was set on the Provider — no props passed, no drilling.

---

## Props vs Context — When to Use Which

| | Props | Context |
| --- | --- | --- |
| **Use when** | Data flows from parent to direct child | Data needed by many components across the tree |
| **Best for** | Component-specific data (name, onClick) | Global data (user info, theme, cart, language) |
| **Problem** | Prop drilling through many layers | Overhead for simple parent-child communication |

One app can have **multiple contexts** — one for user auth, one for cart, one for theme, etc.

---

## How It All Connects

```text
App.jsx
  └── <MyContextProvider value="Good Afternoon">
        └── <MyRoutes />
              └── ... routes ...
                    └── <UserProfiles />
                          → useContext(MyContext) → "Good Afternoon" ✅
                          └── <PersonCard name="Ram" age="32" />
                                → props.name = "Ram" ✅
```

- Context flows *down the tree invisibly* — no prop passing needed
- Props flow *explicitly* from parent to direct child

---

## Summary

| Hook/Concept | What it does |
| --- | --- |
| `useEffect(() => {}, [a,b])` | Run side effects when `a` or `b` changes |
| `useEffect(() => {}, [])` | Run once on load only |
| `props` | Object React creates from component attributes |
| Destructuring props | Extract values cleanly in the function signature |
| Default props | Fallback values when a prop isn't passed |
| `createContext()` | Creates a context object |
| `<Context.Provider value={...}>` | Makes value available to all children |
| `useContext(MyContext)` | Reads the context value from any component |
