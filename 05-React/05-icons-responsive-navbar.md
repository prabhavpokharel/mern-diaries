# React.js — Day 4: Icons, useState & Responsive Navbar

---

## react-icons

```bash
npm install react-icons
```

`react-icons` bundles multiple popular icon libraries into one package. You import only what you need from the specific sub-library — nothing extra is loaded.

| Import path | Library |
| ------------- | --------- |
| `react-icons/fa` | Font Awesome |
| `react-icons/bs` | Bootstrap Icons |
| `react-icons/bi` | Box Icons |
| `react-icons/go` | GitHub Octicons |
| `react-icons/md` | Material Design Icons |
| `react-icons/ai` | Ant Design Icons |

```jsx
import { GoSignIn } from "react-icons/go"
import { BsPersonPlus } from "react-icons/bs"
import { BiCart } from "react-icons/bi"
```

Each icon is a component — use it anywhere in JSX like `<GoSignIn />`. Style it with Tailwind exactly like any other element (`text-2xl`, `text-red-500`, etc.). Multiple libraries often have icons that do the same job — pick whichever looks right for your design.

---

## useState — Remembering Values Between Renders

In plain JavaScript, if you change a variable, nothing on screen updates. React doesn't know the variable changed, so it never re-renders.

`useState` solves this. It gives you a variable that React watches — when it changes, React re-renders the component automatically.

```jsx
import { useState } from "react"

const [isMenuOpen, setMenuOpen] = useState(false)
```

**Syntax breakdown:**

| Part | Role |
| ------ | ------ |
| `useState(false)` | Sets the initial value — `false` on first render |
| `isMenuOpen` | The current value — read this in your JSX |
| `setMenuOpen` | The setter — call this to update the value |

**The rule you cannot break:** Never modify the state variable directly.

```jsx
isMenuOpen = true        // ❌ React doesn't see this — no re-render
setMenuOpen(true)        // ✅ React re-renders with the new value
```

Direct assignment bypasses React entirely. Always go through the setter.

---

## Toggle Pattern

```jsx
const toggleMenu = () => {
  setMenuOpen(prev => !prev)
}
```

`prev => !prev` is the **functional update form**. Instead of reading `isMenuOpen` from the outer scope (which can be stale if multiple updates happen quickly), you pass a function that receives the guaranteed latest value and returns what the new state should be.

For a simple menu toggle, `setMenuOpen(!isMenuOpen)` won't cause a visible bug — but `prev => !prev` is the correct habit. Use it consistently.

---

## Conditional Class with Template Literal

```jsx
className={`transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
```

This is state driving the UI directly. When `isMenuOpen` is `true`, the menu has class `translate-x-0` — on screen. When `false`, it has `translate-x-full` — pushed 100% off screen to the right. The CSS transition animates between the two.

The backtick template literal lets you mix static classes with the dynamic conditional cleanly in one string.

---

## Responsive Navbar — The Pattern

The header renders two different nav structures and uses Tailwind's responsive prefixes to show only the right one per screen size:

```jsx
{/* Desktop nav — hidden by default, shown as flex on md+ */}
<div className="md:flex justify-evenly bg-slate-700 text-white py-1 hidden">
  <Link to="/">Home</Link>
  <Link to="/products">Products</Link>
  {/* ... */}
</div>

{/* Mobile trigger — shown by default, hidden on md+ */}
<div className="py-2 bg-slate-100 md:hidden" onClick={toggleMenu}>
  MENU
</div>

{/* Mobile slide-in menu — shown by default, hidden on md+ */}
<div
  className={`transition-all duration-500 md:hidden flex flex-col fixed h-[50vh] w-full top-0 bg-slate-700 text-white ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
  onClick={toggleMenu}
>
  <Link to="/">Home</Link>
  <Link to="/products">Products</Link>
  {/* ... */}
</div>
```

### Tailwind classes used here

| Class | What it does |
| ------- | ------------- |
| `hidden` | `display: none` — hides the element |
| `md:flex` | `display: flex` on screens 768px and wider |
| `md:hidden` | `display: none` on screens 768px and wider |
| `fixed` | Positioned relative to the viewport — stays put on scroll |
| `top-0` | Anchored to the top of the screen |
| `w-full` | Full viewport width |
| `h-[50vh]` | 50% of viewport height (arbitrary value) |
| `translate-x-0` | Element in its normal position |
| `translate-x-full` | Element shifted 100% of its width off-screen to the right |
| `transition-all duration-500` | Animate all property changes over 500ms |

### How the show/hide works

- On desktop (`md+`): the desktop nav is `md:flex` (visible), the mobile trigger and slide menu are `md:hidden` (hidden).
- On mobile: the desktop nav is `hidden` (invisible), the mobile trigger is visible, and the slide menu is visible but pushed off-screen via `translate-x-full` until `isMenuOpen` flips it to `translate-x-0`.

No JavaScript show/hide logic. State controls which Tailwind class is applied — CSS does the actual rendering.

---

## Event Bubbling — Feature and Footgun

The mobile menu wrapper div has `onClick={toggleMenu}`. Because `<Link>` elements are children of that div, clicking any link **bubbles up** to the wrapper and triggers `toggleMenu` — closing the menu automatically after navigation. Convenient.

The trade-off: any element you add inside that div will also trigger the close, whether you want it to or not. If you later add a dropdown, a label, or any non-navigation element inside the mobile menu, clicking it will close the whole menu unexpectedly.

The more explicit approach is to add `onClick={toggleMenu}` directly to each `<Link>`:

```jsx
<Link to="/" onClick={toggleMenu}>Home</Link>
```

This gives you precise control over what closes the menu versus what doesn't. Slightly more verbose, but no surprise behaviour.

---

## Key Concepts

**State drives the UI — not direct DOM manipulation.** You don't call `document.getElementById` and set `display: none`. You update state, React re-renders, and the new class string gets applied. The browser handles the visual change.

**Two navbars, CSS decides which shows.** This is a common responsive pattern — render both versions, use breakpoint classes to show only the right one. No JavaScript media query logic needed.

---

## What useState Does in This Component — End to End

```text
Initial render:
  isMenuOpen = false
  → mobile menu className includes "translate-x-full" (off-screen)

User clicks "MENU":
  → toggleMenu() runs
  → setMenuOpen(prev => !prev) → setMenuOpen(true)
  → React re-renders Header
  → mobile menu className now includes "translate-x-0" (on-screen)
  → transition-all animates the slide in over 500ms

User clicks a Link (or anywhere on the menu div):
  → toggleMenu() runs again
  → setMenuOpen(false)
  → mobile menu slides back off-screen
  → React Router handles the navigation
```
