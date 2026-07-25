# Icons, useState & Responsive Navbar

---

## react-icons

```bash
npm install react-icons
```

`react-icons` bundles multiple popular icon libraries into one package. You import only what you need from the specific sub-library:

| Import path | Library |
| --- | --- |
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

Each icon is just a component — drop it anywhere in JSX like `<GoSignIn />`. You can style it with Tailwind like any other element (`text-2xl`, `text-red-500`, etc.).

The commented-out `FaSignInAlt` line is a good reminder — multiple icons from different libraries can do the same job. Pick whichever looks best.

---

## useState — Your First React Hook

```jsx
import { useState } from "react"

let [isMenuOpen, setMenuOpen] = useState(false)
```

**What it does:** `useState` lets a component remember a value between renders. When that value changes, React re-renders the component automatically.

**Syntax breakdown:**

- `useState(false)` — initial value is `false`
- `isMenuOpen` — the current value (read this)
- `setMenuOpen` — the function to update it (never modify `isMenuOpen` directly)

**The rule:** You can never do `isMenuOpen = true`. Always go through the setter: `setMenuOpen(true)`. This is what tells React "something changed, re-render."

---

## Toggle Pattern

```jsx
const toggleMenu = () => {
  setMenuOpen(!isMenuOpen)
}
```

`!isMenuOpen` flips the boolean. If it was `false`, it becomes `true`. If `true`, becomes `false`. One function, handles both directions. This is the standard toggle pattern in React.

---

## Conditional Class with Template Literal

```jsx
className={`... ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
```

This is where state drives the UI. When `isMenuOpen` is `true`, the menu slides in (`translate-x-0`). When `false`, it slides out (`translate-x-full` — pushed fully off-screen to the right).

The backtick string (template literal) lets you mix fixed classes with dynamic ones cleanly.

---

## Responsive Navbar Logic

The header has two nav bars — one for desktop, one for mobile — and CSS handles which one is visible:

```jsx
{/* Desktop nav — hidden on mobile, flex on md+ */}
<div className="md:flex justify-evenly bg-slate-700 text-white py-1 hidden">
  ...
</div>

{/* Mobile menu trigger — visible on mobile, hidden on md+ */}
<div className="py-2 bg-slate-100 md:hidden" onClick={toggleMenu}>
  MENU
</div>

{/* Mobile slide-in menu — hidden on md+ */}
<div className={`... md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`} onClick={toggleMenu}>
  ...
</div>
```

| Class | Meaning |
| --- | --- |
| `hidden` | `display: none` always |
| `md:flex` | `display: flex` on medium screens and up |
| `md:hidden` | `display: none` on medium screens and up |
| `fixed` | Positioned relative to the viewport (stays in place on scroll) |
| `h-[50vh]` | Custom height — 50% of viewport height |
| `w-full` | Full width |
| `top-0` | Anchored to the top of the screen |
| `translate-x-full` | Shifts element 100% off screen to the right |
| `translate-x-0` | Back in its normal position |
| `transition-all duration-500` | Smooth animation over 500ms |

The mobile menu is `fixed` so it overlays everything when open. Clicking anywhere on it (the `onClick={toggleMenu}` on the wrapper div) closes it — so clicking a link also closes the menu.

---

## Key Concepts from This Session

**State drives the UI.** You don't manually show/hide elements with JavaScript DOM manipulation. You update state, and React re-renders with the right classes applied. The Tailwind translate classes do the actual sliding — React just toggles which one is active.

**One component, two responsibilities.** The Header handles both the top bar (logo, search, icons) and the navigation (desktop nav + mobile hamburger). This is fine for a small project. In larger apps you'd split these further.

**`onClick` on a wrapper div.** Clicking the mobile menu div (not just the links) triggers `toggleMenu`. Since the links are children of that div, clicking a link bubbles up and also triggers the toggle — closing the menu automatically after navigation.

---

## Summary — What useState Does Here

```text
Initial state: isMenuOpen = false
  → mobile menu has class translate-x-full (off-screen)

User clicks "MENU":
  → toggleMenu() runs
  → setMenuOpen(!false) → setMenuOpen(true)
  → React re-renders Header
  → mobile menu now has class translate-x-0 (on-screen)
  → CSS transition animates the slide

User clicks anywhere on the menu (or a link):
  → toggleMenu() runs again
  → setMenuOpen(false)
  → menu slides back off-screen
```
