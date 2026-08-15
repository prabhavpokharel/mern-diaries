# React.js — Day 6: Hooks, useState & Conditional Rendering

---

## What Are Hooks?

Hooks are special functions React provides that let your components do things plain JavaScript can't — like remembering values between renders, running code in response to changes, or reading shared data from context.

The ones you'll use constantly:

- `useState` — remember and update values
- `useEffect` — run code when something changes
- `useRef`, `useContext`, `useReducer` — covered in later sessions

All hooks start with `use`. That's the convention, and it matters — React enforces rules around hooks specifically for functions that follow this naming pattern.

---

## Why a Regular Variable Doesn't Work

In plain JavaScript:

```js
let count = 0
count++  // works fine
```

In React, changing a plain variable does nothing to the screen. When a component renders, it runs top to bottom like a function call. React has no mechanism to watch plain variables — if you change one, React doesn't know, so it never re-renders.

```jsx
// ❌ This does nothing visible
let count = 0
const increase = () => {
  count++  // count changes in memory, screen stays the same
}
```

**State solves this.** When you update state through the setter, React knows something changed and schedules a re-render with the new value.

> Regular variable → React is blind to it.
> State variable → React watches it and re-renders when it changes.

---

## useState — Syntax and How It Works

```jsx
import { useState } from 'react'

const [count, setCount] = useState(0)
```

Full pattern:

```jsx
const [variableName, setterFunction] = useState(initialValue)
```

| Part | Role |
|------|------|
| `variableName` | The current value — read this in your JSX |
| `setterFunction` | Call this to update the value — triggers a re-render |
| `useState(initialValue)` | The starting value on the first render only |

### Initial values by data type

```jsx
useState(0)       // number
useState('')      // string
useState(true)    // boolean
useState([])      // array
useState({})      // object
```

### The one rule you cannot break

Never modify the state variable directly. Always go through the setter.

```jsx
count = count + 1        // ❌ React doesn't see this — no re-render
setCount(count + 1)      // ✅ React re-renders with the new value
```

---

## `setCount(++count)` vs `setCount(count++)` vs `setCount(count + 1)`

This comes up because of how JavaScript's pre- and post-increment operators work.

```jsx
setCount(++count)   // pre-increment: count becomes 6 first, then setCount(6)
setCount(count++)   // post-increment: setCount(5), then count becomes 6 — but that change is discarded
```

With `count = 5`:
- `++count` → passes `6` to setCount ✅
- `count++` → passes `5` to setCount, the increment is thrown away ❌

**The right habit is neither.** Use the functional update form:

```jsx
setCount(prev => prev + 1)   // ✅ always reads the latest value
```

This matters because React can batch state updates. If you read `count` from the outer scope inside a setter, it might be stale by the time the setter runs. The functional form receives the guaranteed latest value as `prev` — no stale closure risk.

For simple cases `setCount(count + 1)` works fine. But `prev => prev + 1` is the correct habit and you should use it consistently.

---

## Inline Arrow Functions in `onClick`

For simple one-liners, you don't need a named function:

```jsx
// Named function — use when logic is more than one line
const reset = () => setCount(0)
<button onClick={reset}>Reset</button>

// Inline arrow — fine for simple one-liners
<button onClick={() => setCount(0)}>Reset</button>
```

Both are identical in behaviour. The inline version saves declaring a function for something trivial.

---

## Conditional Rendering

Conditional rendering is showing or hiding elements based on state. React has two patterns for this in JSX.

### Pattern 1: `&&` — show this or nothing

```jsx
{count < 20 && <button onClick={increase}>+</button>}
```

If `count < 20` is `true` → renders the button.
If `false` → renders nothing.

**Important gotcha:** If the left side of `&&` evaluates to `0`, React renders the number `0` — not nothing.

```jsx
{count && <button>+</button>}        // ❌ renders "0" when count is 0
{count > 0 && <button>+</button>}    // ✅ renders nothing when count is 0
```

Always use a proper boolean expression on the left side of `&&`. Never a raw number, length, or any value that could be `0`.

### Pattern 2: Ternary `? :` — show this OR show that

```jsx
{count === 0
  ? <button className="disabled">RESET</button>
  : <button onClick={() => setCount(0)}>RESET</button>
}
```

If `count === 0` → disabled button. Otherwise → active reset button.

Use ternary when you need to choose between two different things. Use `&&` when you're choosing between something and nothing.

### Combined — the counter example

```jsx
{/* + button: only when count hasn't hit the limit */}
{count < 20 && <button onClick={() => setCount(prev => prev + 1)}>+</button>}

{/* RESET: disabled at 0, active otherwise */}
{count === 0
  ? <button className="disabled">RESET</button>
  : <button onClick={() => setCount(0)}>RESET</button>
}

{/* - button: only when count is above 0 */}
{count > 0 && <button onClick={() => setCount(prev => prev - 1)}>-</button>}
```

The UI self-updates based on state. You describe the rules — React applies them on every render.

---

## Multiple State Variables

One component can have as many state variables as it needs:

```jsx
const [count, setCount] = useState(0)
const [data, setData] = useState(1000)
```

They are completely independent. Updating `count` does not affect `data`. Each variable has its own setter and its own re-render cycle.

---

## One Root Element Per Component

A component must return exactly one root element. Put everything inside a single parent or a fragment.

```jsx
// ❌ Breaks — two root elements
return (
  <div>...</div>
  <p>Outside</p>
)

// ✅ Fragment — invisible wrapper, no extra DOM element
return (
  <>
    <div>...</div>
    <p>Inside</p>
  </>
)
```

---

## How Re-rendering Works — The Mental Model

```
First render:
  count = 0
  → + button visible (0 < 20 ✅)
  → - button hidden (0 > 0 ❌)
  → RESET shows disabled version (count === 0 ✅)

User clicks +:
  → setCount(prev => prev + 1) → count = 1
  → React re-renders
  → - button now visible (1 > 0 ✅)
  → RESET shows active version (count !== 0)

User clicks RESET:
  → setCount(0) → count = 0
  → React re-renders
  → - button hidden again
  → RESET back to disabled version
```

Every state change triggers a fresh render. React diffs the new output against the previous one (Virtual DOM) and updates only what actually changed in the real DOM.

---

## Summary

| Concept | Key Point |
|---------|-----------|
| Hooks | Special React functions — all start with `use` |
| `useState` | Gives React a value to watch — re-renders on change |
| Never mutate directly | Always use the setter function |
| Functional update form | `setCount(prev => prev + 1)` — always reads latest value |
| `&&` | Show something or nothing — never put a raw number on the left |
| `? :` | Show this or show that |
| Multiple states | Each `useState` call is independent |
| One root element | Everything inside a single parent or fragment |
