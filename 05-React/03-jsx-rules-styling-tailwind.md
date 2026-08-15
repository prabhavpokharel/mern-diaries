# React.js — Day 2: JSX Rules, Styling & Tailwind CSS

---

## Why Component Names Must Start with a Capital Letter

In React, JSX uses the first letter of a tag to decide what it is:

- **Lowercase** → treated as a native HTML element (`<div>`, `<button>`, `<p>`)
- **Uppercase** → treated as a React component (`<MyButton>`, `<Navbar>`)

```jsx
<button />   // HTML button element
<Button />   // Your custom React component
```

If you name a component with a lowercase letter, React silently treats it as an unknown HTML tag and your component never renders. No error thrown — just nothing on screen, which makes it genuinely hard to debug.

**Always start component names with a capital letter.**

---

## File Name vs Component Name

If you accidentally create a file with a lowercase name (e.g., `mybutton.jsx`) and run `rafce`, the generated component name will also be lowercase. When you try to use it in `App.jsx`, VS Code won't suggest it in autocomplete because React won't recognize it as a component.

**Fix:** Don't rename the file. Just rename the component function inside the code to start with a capital letter.

```jsx
// Inside mybutton.jsx — fix only the function name
const MyButton = () => { ... }
export default MyButton
```

VS Code can auto-update imports when you rename a file, but the better habit is to name files correctly from the start. Your file name and component name should always match — `MyButton.jsx` exports `MyButton`, `Navbar.jsx` exports `Navbar`. Keeping them in sync prevents confusion as the project grows.

---

## One Root Element Per Component

A React component can only return one root element. Everything must be wrapped inside it.

```jsx
// ❌ Breaks — two root elements
return (
  <h1>Title</h1>
  <p>Paragraph</p>
)

// ✅ Fragment — invisible wrapper, no extra DOM element
return (
  <>
    <h1>Title</h1>
    <p>Paragraph</p>
  </>
)

// ✅ div — works but adds an extra element to the DOM
return (
  <div>
    <h1>Title</h1>
    <p>Paragraph</p>
  </div>
)
```

Prefer a fragment `<></>` when you don't need the wrapper `div` in the actual HTML output.

---

## JSX Differences from HTML

JSX looks like HTML but compiles down to JavaScript. A few attributes work differently:

| HTML | JSX Equivalent |
| ------ | ---------------- |
| `class="..."` | `className="..."` |
| `style="color: red"` | `style={{ color: 'red' }}` |
| `for="input"` | `htmlFor="input"` |
| `<!-- comment -->` | `{/* comment */}` |

### `className` instead of `class`

`class` is a reserved keyword in JavaScript. Since JSX is JavaScript under the hood, you must use `className`.

```jsx
// ❌
<h1 class="title">Hello</h1>

// ✅
<h1 className="title">Hello</h1>
```

### Inline Styling

In HTML, inline styles are plain strings. In JSX, they are JavaScript objects with camelCase property names.

```jsx
// ❌ HTML syntax — doesn't work in JSX
<h1 style="color: red; font-size: 24px;">Hello</h1>

// ✅ JSX syntax
<h1 style={{ color: 'red', fontSize: '24px' }}>Hello</h1>
```

The outer `{}` tells JSX "this is a JavaScript expression". The inner `{}` is the actual style object. Property names are camelCase: `fontSize` not `font-size`, `backgroundColor` not `background-color`.

---

## Adding CSS Libraries

### Bootstrap via CDN

Paste the CDN links into `index.html`:

```html
<!-- In <head> — CSS loads first -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">

<!-- Before </body> — JS loads last -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
```

CSS in `<head>`, JS before `</body>`. This is standard — CSS loads first so there's no flash of unstyled content; JS loads last so it doesn't block page rendering.

No npm install needed. But if you're using Tailwind alongside Bootstrap, their global styles will conflict — be ready to override specific things with inline styles or more specific utility classes.

---

## Setting Up Tailwind CSS in Vite + React

Tailwind is a utility-first CSS framework — instead of pre-built components, it gives you small single-purpose classes you compose directly in JSX. No pre-written `<Card>` or `<Modal>` components — you build exactly what you need.

### Step 1 — Install

```bash
npm install tailwindcss @tailwindcss/vite
```

### Step 2 — Add to Vite config

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### Step 3 — Import in CSS

In `index.css`, replace everything with:

```css
@import "tailwindcss";
```

Tailwind is now active.

---

## Using Tailwind in JSX

Classes go directly in `className`:

```jsx
<h1 className="text-red-700 bg-slate-300 text-sm p-7 hover:bg-slate-200 md:text-2xl">
  Hello
</h1>
```

### Key Tailwind Patterns

**Colors** — numeric scale from 50 (lightest) to 950 (darkest):

```text
text-red-100    very light red text
text-red-700    dark red text
bg-slate-300    light slate background
```

**Text size:**

```text
text-sm  text-base  text-lg  text-xl  text-2xl  ...  text-9xl
```

**Spacing:**

```text
p-4     padding all sides
px-4    padding left & right
py-2    padding top & bottom
m-4     margin all sides
```

**Pseudo-classes:**

```text
hover:bg-slate-200    applies on mouse hover
active:text-red-300   applies on click
```

**Responsive breakpoints** (mobile-first — smaller screens get the base class, larger screens override):

```text
text-sm md:text-2xl xl:text-3xl
```

Tailwind's breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px).

---

## The Dynamic Class Name Gotcha

This will bite you at some point so know it upfront. Tailwind scans your source files at build time for complete class name strings and purges anything it doesn't find. If you build a class name dynamically using string interpolation, Tailwind can't detect it and the class won't exist in the final build.

```jsx
// ❌ Tailwind won't detect bg-light or bg-dark — they'll be missing in production
<div className={`bg-${theme}`}>

// ✅ Full class names are present as strings — Tailwind picks them up
<div className={theme === 'light' ? 'bg-slate-200' : 'bg-slate-800'}>
```

When you need dynamic styling based on state, always write out the full class names in a ternary or conditional — never construct them with string interpolation. If you genuinely need dynamic classes, define them in CSS with `@apply` and apply the CSS class name instead (covered below).

---

## Cleaning Up Inline Tailwind Classes

Writing 10+ classes on every element gets unreadable fast. Two approaches:

### 1. `@apply` in CSS

Bundle Tailwind utilities under a single CSS class name:

```css
/* In App.css */
.my-button {
  @apply bg-green-500 text-white px-5 py-2 text-center inline-block text-xl cursor-pointer;
}
```

```jsx
<button className="my-button">Click Me</button>
```

Use this when the same style pattern repeats across many elements, or when you need dynamic class names (see the gotcha above).

### 2. Dedicated Component

Extract the element into its own component:

```jsx
// src/components/MyButton.jsx
const MyButton = ({ btnClass, text }) => {
  return (
    <button className={btnClass}>
      {text}
    </button>
  )
}

export default MyButton
```

```jsx
// In App.jsx
import MyButton from './components/MyButton'

function App() {
  return (
    <MyButton btnClass="bg-green-500 text-white px-5 py-2" text="Click Me" />
  )
}
```

This is the React way — when a UI pattern repeats, make it a component.

---

## Props — Passing Data into Components

**Props** (short for properties) are how you pass data from a parent component into a child. Think of them as function arguments — you define what data the component needs, and the parent provides it.

```jsx
// Parent passes props as attributes
<MyButton btnClass="bg-red-500" text="Delete" />

// Child receives them as an object
const MyButton = (props) => {
  return <button className={props.btnClass}>{props.text}</button>
}
```

### Destructuring Props

Instead of `props.btnClass` and `props.text` everywhere, destructure directly in the function signature:

```jsx
const MyButton = ({ btnClass, text }) => {
  return <button className={btnClass}>{text}</button>
}
```

Both are identical — destructuring is just cleaner. It's the standard style in modern React.

### Default Props

If a parent doesn't pass a prop, the value is `undefined` — which silently breaks things. Set defaults to handle missing props gracefully:

```jsx
const MyButton = ({ btnClass = 'btn btn-primary', text = 'Click Me' }) => {
  return <button className={btnClass}>{text}</button>
}
```

Now if you use `<MyButton />` with no props, it still renders correctly with the fallback values.

### Using Props in JSX

Curly braces `{}` in JSX mean "evaluate this as JavaScript":

```jsx
// btnClass is a variable — use {} to render its value
<button className={btnClass}>{text}</button>

// Without {} it would literally render the string "btnClass"
<button className="btnClass">text</button>  // wrong
```

Props are what make components reusable. Same component, different data from the parent each time.
