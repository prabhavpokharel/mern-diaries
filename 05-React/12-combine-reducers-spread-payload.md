# React.js — Day 11: Multiple Reducers, combineReducers & the Spread Operator

---

## Can You Have Multiple Reducers?

Redux has one store — but one store doesn't mean one reducer. As your app grows, putting all state logic in a single reducer file becomes unmanageable. Redux solves this with `combineReducers`, which lets you split state into separate reducers by domain and then merge them into one root reducer.

```
One store
  └── rootReducer (combined)
        ├── counterStore → counterReducer
        └── personStore  → PersonReducer
```

Each reducer manages its own slice of state independently. The store holds all of them under one roof.

---

## `combineReducers` — Merging Reducers

```jsx
// src/redux/store.jsx
import { combineReducers, createStore } from "redux"
import { counterReducer } from "./counterReducer"
import { PersonReducer } from "./PersonReducer"
import { Provider } from "react-redux"

const rootReducer = combineReducers({
  counterStore: counterReducer,
  personStore: PersonReducer,
})

export const myStore = createStore(rootReducer)

export const MyStoreProvider = ({ children }) => {
  return (
    <Provider store={myStore}>
      {children}
    </Provider>
  )
}
```

The keys you choose in `combineReducers` (`counterStore`, `personStore`) become the namespaces for each slice in the store. The store's state now looks like:

```js
{
  counterStore: { count: 0 },
  personStore: { name: 'Ram', age: 32 }
}
```

### How This Changes Your Selectors

Before `combineReducers`, the counter selector was:

```jsx
const count = useSelector(store => store.count)
```

After combining, the counter state lives under `counterStore`:

```jsx
const count = useSelector(store => store.counterStore.count)
```

**This is the most common mistake when adding `combineReducers` to an existing project** — forgetting to update all existing selectors. If a component suddenly shows `undefined` after combining reducers, a stale selector path is almost certainly the reason.

---

## The Spread Operator in Reducers

The notes called this the "rest operator" — but the `...` in `{ ...state, name: action.payload }` is the **spread operator**. They use the same syntax but do opposite things:

| | Syntax | What it does |
|---|---|---|
| **Spread** | `{ ...obj }` | Expands an object's properties into a new object |
| **Rest** | `function({ a, ...rest })` | Collects remaining properties into a new object |

In reducers, you use **spread** to copy existing state into a new object and then override only the fields that changed:

```jsx
// state = { name: 'Ram', age: 32 }

return { ...state, name: action.payload }
// equivalent to: { name: action.payload, age: 32 }
// → copies all fields from state, then overrides name
```

**Why this matters:** Redux requires immutability — you never modify the existing state object, you return a new one. The spread operator is the standard way to do this cleanly. Without it, you'd have to manually list every field:

```jsx
// Manual — error-prone as fields grow
return { name: action.payload, age: state.age }

// Spread — safe, scales automatically
return { ...state, name: action.payload }
```

If you add a new field (`email`) to the state later, the spread version handles it automatically. The manual version silently drops it.

---

## PersonReducer — With `payload`

```jsx
// src/redux/PersonReducer.jsx

const initialData = {
  name: 'Ram',
  age: 32
}

export const PersonReducer = (state = initialData, action) => {
  switch (action.type) {
    case "UPDATE_NAME":
      return { ...state, name: action.payload }
    case "UPDATE_AGE":
      return { ...state, age: action.payload }   // ✅ use spread consistently
    default:
      return state
  }
}
```

**Note on the original `UPDATE_AGE`:** The original code was:
```jsx
case "UPDATE_AGE":
  return { age: action.payload, name: state.name }
```

This manually lists every field instead of spreading. With only two fields it works, but it's the wrong habit — if you add a third field later, this case silently drops it. The spread version is always correct.

### `action.payload`

When an action needs to carry data (not just describe what happened), the data goes in `action.payload`:

```jsx
// Dispatching with payload
dispatch({ type: 'UPDATE_NAME', payload: 'Sita' })

// Reducer reads it
case "UPDATE_NAME":
  return { ...state, name: action.payload }  // action.payload = 'Sita'
```

`payload` is the conventional property name — it's not enforced by Redux but it's the universal standard. Using it consistently makes your code readable to anyone who knows Redux.

---

## Person Component — Three Ways to Select

The Person component demonstrates three valid ways to read from a combined store. They're not all equivalent:

```jsx
// Option 1 — select the whole personStore slice, then destructure
let personStore = useSelector(store => store.personStore)
let { name, age } = personStore
// Re-renders when ANYTHING in personStore changes

// Option 2 — select individual fields (one useSelector per field)
let name = useSelector(store => store.personStore.name)
let age = useSelector(store => store.personStore.age)
// Each re-renders only when its specific field changes

// Option 3 — select the entire store root (don't do this)
let { name, age } = useSelector(store => store)
// Re-renders on ANY change to ANY slice — very inefficient
```

**Which to use:** Option 2 is the most efficient — each `useSelector` only triggers a re-render when its specific value changes. Option 1 is fine for small slices. Option 3 should be avoided — it subscribes to the entire store and causes unnecessary re-renders whenever any part of any reducer updates.

---

## Dispatching with Payload

```jsx
// In Person.jsx

const [nameValue, setName] = useState('')
const [ageValue, setAge] = useState(0)
const dispatch = useDispatch()

// Update name
<input onChange={e => setName(e.target.value)} />
<button onClick={() => dispatch({ type: 'UPDATE_NAME', payload: nameValue })}>
  Update Name
</button>

// Update age
<input onChange={e => setAge(e.target.value)} />
<button onClick={() => dispatch({ type: 'UPDATE_AGE', payload: ageValue })}>
  Update Age
</button>
```

Local `useState` captures what the user typed. On button click, that value is dispatched as `payload` to the Redux store. The reducer reads `action.payload` and returns the new state. This is the pattern for any Redux update that requires user input.

---

## Full Data Flow with Combined Reducers

```
User types "Sita" in the name input
  → setName('Sita') updates local state

User clicks "Update Name"
  → dispatch({ type: 'UPDATE_NAME', payload: 'Sita' })
  → Redux routes action to ALL reducers
      → counterReducer sees 'UPDATE_NAME' → hits default → returns state unchanged
      → PersonReducer sees 'UPDATE_NAME' → returns { ...state, name: 'Sita' }
  → store updates personStore.name to 'Sita'
  → useSelector in Person detects change → component re-renders
  → Name: Sita displayed
```

Every action is sent to every reducer. Each reducer decides whether to handle it or return state unchanged via the `default` case. This is why `default: return state` is mandatory.

---

## Updated File Structure

```
src/
├── redux/
│   ├── counterReducer.jsx
│   ├── PersonReducer.jsx      ← new
│   └── store.jsx              ← updated with combineReducers
├── pages/
│   ├── CounterRedux.jsx       ← selector updated: store.counterStore.count
│   └── Person.jsx             ← new
```

---

## Summary

| Concept | Key Point |
|---------|-----------|
| `combineReducers` | Merges multiple reducers into one root reducer |
| Namespace keys | The keys in `combineReducers` define the selector paths (`store.counterStore`, `store.personStore`) |
| Existing selectors break | After combining, `store.count` becomes `store.counterStore.count` — update all selectors |
| Spread operator `...state` | Copies existing state into a new object — not the same as the rest operator |
| Spread in reducers | `{ ...state, name: action.payload }` — immutable update pattern |
| `action.payload` | Conventional property for carrying data with an action |
| `useSelector` efficiency | Select specific fields, not entire slices or the whole store |
| Every action hits every reducer | The `default` case is what prevents reducers from returning `undefined` |