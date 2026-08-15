# React.js — Day 10: State Management & Redux

---

## The Problem — When State and Context Are Not Enough

So far you've used two tools for sharing data:

- **`useState`** — local state inside one component. Can't be used anywhere else without passing it as props.
- **Context** — solves prop drilling, but comes with its own problems:
  - Every component that consumes a context re-renders when that context's value changes — even if it only needs one small piece of it
  - Managing multiple contexts gets messy as the app grows
  - No standardised pattern for complex state updates (like "increase count only if under 100")

**State management libraries** like Redux exist to solve this at scale — a single, predictable store for your entire app's state, with a strict pattern for how state can be updated.

---

## Redux vs Zustand

| | Redux | Zustand |
|---|---|---|
| Learning curve | Steep — more boilerplate, strict patterns | Gentle — minimal setup |
| Best for | Large teams, complex apps, needs strict structure | Smaller apps, faster setup |
| DevTools | Excellent Redux DevTools extension | Good but less mature |
| Industry adoption | Long-established standard | Growing rapidly |

**Recommendation:** Learn Redux first — the concepts (store, reducer, dispatch, actions) are foundational and show up across the ecosystem. Zustand uses the same ideas with less ceremony. Once you understand Redux, Zustand takes an hour to pick up.

---

## Core Redux Concepts

Before touching code, understand the four pieces:

### Store
The single source of truth. One JavaScript object that holds your entire app's state. Every component that needs state reads from here.

### Reducer
A pure function that takes the current state and an action, and returns the new state. It's the only place state can change. Never mutates the existing state — always returns a new object.

```
(currentState, action) => newState
```

### Action
A plain JavaScript object describing what happened. Must have a `type` property. Can carry additional data.

```js
{ type: 'INCREASE_COUNT' }
{ type: 'SET_USER', payload: { name: 'Ram' } }
```

### Dispatch
The function you call to send an action to the store. The store passes it to the reducer, the reducer returns new state, and React re-renders components that use that state.

**The flow:**
```
User interaction
  → dispatch(action)
    → reducer(currentState, action) → newState
      → store updates
        → components re-render with new state
```

---

## Installation

```bash
npm install redux react-redux
```

- `redux` — the core state management library
- `react-redux` — the bindings that connect Redux to React components

---

## File Structure

```
src/
├── redux/
│   ├── counterReducer.jsx
│   └── store.jsx
├── pages/
│   └── CounterRedux.jsx
```

Files in `redux/` are not React components — they don't need to start with a capital letter. However, `MyStoreProvider` in `store.jsx` must start with a capital letter because it's used as a JSX component in other files — VS Code's auto-import and autocomplete won't suggest it otherwise.

---

## Step 1 — The Reducer

```jsx
// src/redux/counterReducer.jsx

const initialData = { count: 0 }

export const counterReducer = (state = initialData, action) => {
  switch (action.type) {
    case 'INCREASE_COUNT':
      return { count: state.count + 1 }   // ✅ new object, don't mutate
    case 'DECREASE_COUNT':
      return { count: state.count - 1 }
    case 'RESET_COUNT':
      return { count: 0 }
    default:
      return state
  }
}
```

**What each part does:**

- `state = initialData` — default parameter. On the first call, Redux passes `undefined` for state. This default gives the reducer its starting value.
- `action` — the dispatched action object. Always has a `type`. May have a `payload` for additional data.
- `switch (action.type)` — matches the action type to the right state update
- Every `case` returns a **new object** — never modify `state` directly
- `default: return state` — if the action type isn't recognised, return state unchanged. Required — without it Redux would get `undefined` back.

**Why `state.count + 1` not `++state.count`:**

`++state.count` modifies `state.count` in place before returning. Redux state must be treated as immutable — you never change the existing state object, you return a new one. `state.count + 1` creates a new value without touching the original.

---

## Step 2 — The Store and Provider

```jsx
// src/redux/store.jsx
import { createStore } from "redux"
import { counterReducer } from "./counterReducer"
import { Provider } from "react-redux"

export const myStore = createStore(counterReducer)

export const MyStoreProvider = ({ children }) => {
  return (
    <Provider store={myStore}>
      {children}
    </Provider>
  )
}
```

- `createStore(counterReducer)` — creates the Redux store, wired to your reducer
- `<Provider store={myStore}>` — makes the store available to every component inside it, using React context under the hood
- `{ children }` — must be destructured from props, otherwise nothing renders inside the provider

**Note on `createStore`:** This function is deprecated in newer versions of Redux — it still works but shows a warning. The current standard is `configureStore` from `@reduxjs/toolkit`. The concepts are identical; only the setup differs. Redux Toolkit is covered separately.

---

## Step 3 — Wrap Your App

```jsx
// App.jsx
import { MyStoreProvider } from './redux/store'

function App() {
  return (
    <MyStoreProvider>
      <MyThemeContextProvider>
        <MyRoutes />
      </MyThemeContextProvider>
    </MyStoreProvider>
  )
}
```

`MyStoreProvider` wraps the entire app so any component can access the Redux store.

---

## Step 4 — Add the Route

```jsx
// MyRoutes.jsx
<Route path='/redux/counter' element={<CounterRedux />} />
```

---

## Step 5 — The Component

```jsx
// src/pages/CounterRedux.jsx
import { useDispatch, useSelector } from "react-redux"

const CounterRedux = () => {
  const count = useSelector((store) => store.count)
  const dispatch = useDispatch()

  const increaseCount = () => {
    dispatch({ type: "INCREASE_COUNT" })
  }

  return (
    <div className="flex h-[80vh] justify-center items-center flex-col">
      <h2>Count: {count}</h2>
      <div className="btn-group">
        <button
          className="btn btn-warning"
          onClick={() => dispatch({ type: "DECREASE_COUNT" })}
        >
          -
        </button>
        <button
          className="btn btn-danger"
          onClick={() => dispatch({ type: "RESET_COUNT" })}
        >
          RESET
        </button>
        <button className="btn btn-success" onClick={increaseCount}>
          +
        </button>
      </div>
    </div>
  )
}

export default CounterRedux
```

### `useSelector`

```jsx
const count = useSelector((store) => store.count)
```

Reads a value from the Redux store. Takes a selector function — a function that receives the entire store state and returns the piece you want. The component automatically re-renders when that piece of state changes.

If your store had multiple pieces of state, you'd select only what you need:

```jsx
const count = useSelector(store => store.count)
const user = useSelector(store => store.user)
```

### `useDispatch`

```jsx
const dispatch = useDispatch()
dispatch({ type: "INCREASE_COUNT" })
```

Returns the dispatch function. Call it with an action object to trigger a state update. The action goes to the reducer, the reducer returns new state, the store updates, and `useSelector` causes a re-render.

---

## Full Data Flow — End to End

```
User clicks "+"
  → increaseCount() runs
  → dispatch({ type: "INCREASE_COUNT" })
  → Redux passes action to counterReducer
  → counterReducer matches 'INCREASE_COUNT'
  → returns { count: state.count + 1 }
  → store updates with new state
  → useSelector detects the change
  → CounterRedux re-renders with new count
```

---

## Why This Is Better Than Local useState for Shared State

The counter built with `useState` earlier lived inside one component. If another page needed the same count, you'd have to lift state up, pass props, or use context.

With Redux:
- The count lives in the store — accessible from any component in the app
- Any component can dispatch actions to change it
- Any component can read it with `useSelector`
- No prop drilling, no context conflicts, no re-render cascade

The trade-off is boilerplate — more files and more setup for simple cases. For a counter in a real app, `useState` is still the right tool. Redux earns its place when many unrelated components need to share and update the same state.

---

## Summary

| Concept | What it is |
|---------|-----------|
| Store | Single object holding all app state |
| Reducer | Pure function: `(state, action) => newState` — never mutates |
| Action | Plain object with a `type` describing what happened |
| Dispatch | Function that sends an action to the store |
| `createStore` | Creates the Redux store — deprecated, use `configureStore` in new projects |
| `<Provider>` | Makes the store available to all child components |
| `useSelector` | Reads a value from the store — re-renders on change |
| `useDispatch` | Returns the dispatch function for use in components |