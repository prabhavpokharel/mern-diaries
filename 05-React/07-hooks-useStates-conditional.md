# Hooks, useState & Conditional Rendering

---

## What Are Hooks?

Hooks are special functions React provides that let your components do things plain JavaScript can't — like remembering values, running side effects, or accessing context.

The key ones you'll use constantly:

- `useState` — remember and update values
- `useEffect` — run code when something changes
- `useRef`, `useContext`, `useReducer` — covered later

All hooks start with `use`. That's the convention.

---

## Why You Can't Just Use a Regular Variable

In JavaScript you'd naturally do:

```js
let count = 0
count++
```

In React, **this doesn't work for the UI.** Here's why:

When a component renders, it runs top to bottom like a function. If you change a plain variable, React has no idea it changed — so it never re-renders. The value updates in memory but the screen stays the same.

**State solves this.** When you update state through the setter function, React knows something changed and re-renders the component with the new value.

> Regular variable = React is blind to it.
> State variable = React watches it and re-renders when it changes.

---

## useState — Syntax & How It Works

```jsx
import { useState } from 'react'

let [count, setCount] = useState(0)
```

Full pattern:

```jsx
let [variableName, functionToUpdateIt] = useState(initialValue)
```

| Part | Purpose |
| ------ | --------- |
| `variableName` | Read the current value |
| `functionToUpdateIt` | Call this to change the value — triggers re-render |
| `useState(initialValue)` | Sets the starting value on first render |

### Initial values by data type

```jsx
useState(0)       // number
useState('')      // string
useState(true)    // boolean
useState([])      // array
useState({})      // object
```

### The golden rule

**Never modify state directly.** Always go through the setter.

```jsx
count = count + 1       // ❌ React doesn't see this
setCount(count + 1)     // ✅ React re-renders with new value
```

---

## `setCount(++count)` vs `setCount(count++)`

This is a classic JS pre/post increment question that matters a lot in React.

```jsx
setCount(++count)   // Pre-increment: increments FIRST, then passes value
setCount(count++)   // Post-increment: passes value FIRST, then increments
```

**Example with count = 5:**

```jsx
setCount(++count)
// ++count → count becomes 6 first
// setCount(6) → state updates to 6 ✅

setCount(count++)
// count++ → passes 5 to setCount
// count becomes 6 after, but that change is discarded
// setCount(5) → state stays at 5 ❌ (no visible change)
```

**Use `++count` (pre-increment) or better: `setCount(count + 1)`**

The safest and clearest way:

```jsx
setCount(count + 1)   // ✅ Most readable, no confusion
```

---

## Inline Arrow Functions in onClick

For small, one-line operations you don't need a separate function:

```jsx
// Instead of writing a function separately:
const reset = () => setCount(0)
<button onClick={reset}>Reset</button>

// Just inline it:
<button onClick={() => setCount(0)}>Reset</button>
```

Both are identical. Use inline for simple one-liners, named functions for anything more complex.

---

## Conditional Rendering

Conditional rendering means showing or hiding elements based on state or data. React gives you two clean patterns for this in JSX:

### Pattern 1: `&&` (show or show nothing)

```jsx
{count < 20 && <button onClick={increase}>+</button>}
```

If `count < 20` is `true` → renders the button.
If `false` → renders nothing.

Use this when you either show something or show nothing at all.

### Pattern 2: Ternary `? :` (show this OR show that)

```jsx
{count === 0
  ? <button className="disabled">RESET</button>
  : <button onClick={() => setCount(0)}>RESET</button>
}
```

If `count === 0` → shows disabled button.
Otherwise → shows active reset button.

Use this when you need to choose between two different things.

### Combined in the Counter example

```jsx
{/* + button: only show if count hasn't hit 20 */}
{count < 20 && <button onClick={increase}>+</button>}

{/* RESET: disabled if count is 0, active otherwise */}
{count === 0
  ? <button className="disabled">RESET</button>
  : <button onClick={() => setCount(0)}>RESET</button>
}

{/* - button: only show if count is above 0 */}
{count > 0 && <button onClick={() => setCount(--count)}>-</button>}
```

The UI self-updates based on state. You don't manually show/hide — you describe the rules, React applies them on every render.

---

## Multiple State Variables

One component can have as many state variables as it needs:

```jsx
let [count, setCount] = useState(0)
let [data, setData] = useState(1000)
```

They're completely independent. Updating `count` doesn't affect `data` and vice versa. Each has its own setter.

---

## Important JSX Rule

**Never put elements outside the parent (root) element of a component.**

```jsx
// ❌ Breaks
const Counter = () => {
  return (
    <div>...</div>
    <p>Outside the root</p>   // Can't be here
  )
}

// ✅ Everything inside one root
const Counter = () => {
  return (
    <>
      <div>...</div>
      <p>Inside the fragment</p>
    </>
  )
}
```

A component must return exactly one root element. Use a fragment `<></>` to group multiple elements without adding extra HTML.

---

## How Re-rendering Works — The Mental Model

1. Component renders for the first time
   → count = 0, data = 1000
   → JSX evaluates: + button visible (0 < 20 ✅), - button hidden (0 > 0 ❌)

2. User clicks +
   → increase() runs → setCount(++count) → setCount(1)
   → React sees state changed → re-renders component
   → count = 1 now
   → JSX re-evaluates: + button still visible, - button now visible (1 > 0 ✅)

3. User clicks RESET
   → setCount(0)
   → Re-render → count = 0
   → - button disappears again

Every state change triggers a fresh render. React is very fast at this — it only updates what actually changed in the DOM.

---

## Summary

| Concept | Key Point |
| --------- | ----------- |
| Hooks | Special React functions. All start with `use`. |
| `useState` | Makes React watch a value and re-render when it changes |
| Never mutate directly | Always use the setter function |
| `++count` vs `count++` | Use `count + 1` to be safe |
| `&&` | Show this, or nothing |
| `? :` | Show this, or show that |
| Multiple states | Each `useState` call is independent |
| One root element | Everything inside a single parent or fragment |
