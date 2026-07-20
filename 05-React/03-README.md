# JSX Rules, Styling & Tailwind CSS

---

## Why Component Names Must Start with a Capital Letter

In React, JSX uses the first letter of a tag to decide what it is:

- **Lowercase** → treated as a native HTML element (`<div>`, `<button>`, `<p>`)
- **Uppercase** → treated as a React component (`<MyButton>`, `<Navbar>`)

```jsx
<button>    ← HTML button element
<Button>    ← Your custom React component
```

If you name a component with a lowercase letter, React silently renders it as an HTML tag and your component never shows up. No error, just nothing — which makes it hard to debug.

**Always start component names with a capital letter.**

---

## File Name vs Component Name

If you accidentally create a file with a lowercase name (e.g., `mybutton.jsx`) and run `rafce`, the generated component name will also be lowercase. When you try to use it in `App.jsx`, VS Code won't suggest it in the autocomplete popup because React won't recognize it as a component.

**Fix:** Don't rename the file. Just rename the component function inside the code to start with a capital letter.

```jsx
// Inside mybutton.jsx — just fix the function name
const MyButton = () => { ... }   // ✅ Capital M
export default MyButton
```

If you rename the file instead, the import path in every file that uses it breaks. Rename the function, not the file.

---

## One Root Element Per Component

A React component can only return **one root element**. Everything must be wrapped.

```jsx
// ❌ Breaks — two root elements
return (
  <h1>Title</h1>
  <p>Paragraph</p>
)

// ✅ Use a fragment (invisible wrapper)
return (
  <>
    <h1>Title</h1>
    <p>Paragraph</p>
  </>
)

// ✅ Or a div (but adds an extra DOM element)
return (
  <div>
    <h1>Title</h1>
    <p>Paragraph</p>
  </div>
)
```

Use a fragment `<></>` when you don't want an extra wrapper element in the DOM.

---

## JSX Differences from HTML

### `className` instead of `class`

`class` is a reserved keyword in JavaScript. Since JSX is JavaScript, you must use `className`.

```jsx
// ❌ HTML way
<h1 class="title">Hello</h1>

// ✅ JSX way
<h1 className="title">Hello</h1>
```

### Inline Styling

In HTML, inline styles are strings. In JSX, they are **JavaScript objects** with camelCase property names.

```jsx
// ❌ HTML way
<h1 style="color: red; font-size: 24px;">Hello</h1>

// ✅ JSX way — double curly braces: outer = JS expression, inner = object
<h1 style={{ color: 'red', fontSize: '24px' }}>Hello</h1>
```

The outer `{}` tells JSX "this is JavaScript". The inner `{}` is the actual style object.

---

## Adding CSS Libraries

### Bootstrap (quick way)

Just paste the CDN link into `index.html` inside `<head>`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
```

No npm install needed. But for a more utility-first approach, use Tailwind.

---

## Setting Up Tailwind CSS in Vite + React

Tailwind takes a different approach — instead of pre-built components, it gives you small utility classes you compose directly in your JSX.

### Step 1 — Install

```bash
npm install tailwindcss @tailwindcss/vite
```

### Step 2 — Add to Vite config

In `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### Step 3 — Import in CSS

In `index.css` (or `App.css`), replace everything with:

```css
@import "tailwindcss";
```

Tailwind is now ready to use.

---

## Using Tailwind in JSX

Tailwind classes go directly in `className`:

```jsx
<h1 className='text-red-700 bg-slate-300 text-sm p-7'>Hello</h1>
```

### Key Tailwind Concepts

**Colors** — scale from 50 (lightest) to 950 (darkest):
```
text-red-100    ← very light red
text-red-700    ← dark red
bg-slate-300    ← light slate background
```

**Text sizes:**
```
text-sm → text-base → text-lg → text-xl → text-2xl → ... → text-9xl
```

**Spacing (padding/margin):**
```
p-4     → padding all sides
px-4    → padding left & right
py-2    → padding top & bottom
m-4     → margin all sides
```

**Pseudo-classes:**
```jsx
hover:bg-slate-200      ← on hover
active:text-red-300     ← on click
```

**Responsive breakpoints** (mobile-first):
```jsx
text-sm md:text-2xl xl:text-3xl
```
Starts small, gets bigger on wider screens.

---

## The Problem with Inline Tailwind Classes

Writing 15 classes on every element gets messy fast. Two better approaches:

### 1. Use `@apply` in CSS

```css
/* In App.css */
.my-button {
  @apply bg-green-500 text-white px-5 py-2 text-center 
         inline-block text-xl cursor-pointer;
}
```

Then in JSX:

```jsx
<button className="my-button">Click Me</button>
```

`@apply` lets you bundle Tailwind utilities under a single class name — cleaner and reusable.

### 2. Make a Dedicated Component

Create a separate file just for the button:

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

Use it in `App.jsx`:

```jsx
import MyButton from './components/MyButton'

function App() {
  return (
    <>
      <MyButton btnClass="bg-green-500 text-white px-5 py-2" text="Click Me" />
    </>
  )
}
```

---

## Props — Passing Data into Components

The `{ btnClass, text }` inside the component function is **destructuring props**.

Props are how you pass data from a parent component into a child component — just like passing arguments to a function.

```jsx
// Parent passes data
<MyButton btnClass="bg-red-500" text="Delete" />

// Child receives it
const MyButton = ({ btnClass, text }) => {
  return <button className={btnClass}>{text}</button>
}
```

- `{btnClass}` inside `className={btnClass}` — the outer `{}` means "this is a JS expression", and `btnClass` is the variable passed from the parent.
- `{text}` inside the button — renders the text string passed from the parent.

This is what makes components reusable — same component, different data each time.

---

## Quick Reference

| HTML | JSX Equivalent |
|------|----------------|
| `class="..."` | `className="..."` |
| `style="color: red"` | `style={{ color: 'red' }}` |
| `for="input"` | `htmlFor="input"` |
| `<!-- comment -->` | `{/* comment */}` |