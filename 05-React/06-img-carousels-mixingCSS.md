# Images, Carousels & Mixing CSS Libraries

---

## Three Ways to Use Images in React

This is one of the most confusing things for beginners. The rule comes down to **where the file lives**.

### 1. Public folder — reference by URL string

```jsx
<img src="pexels-nana-llj-38667937.jpg" />
```

Files in `public/` are served directly from the root URL. No import needed. Just use the filename as a string. Vite doesn't process these — they go straight to the browser as-is.

### 2. src/assets — must import first

```jsx
import img1 from '../assets/hero.png'

<img src={img1} />
```

Files in `src/assets/` are part of your app bundle. Vite processes and optimizes them. But because of this, you **cannot** reference them with a plain string path — Vite needs to know about them at build time. So you import them at the top of the file first, and then use the imported variable as the `src`.

**The rule:** `public/` → string path. `src/assets/` → import first, then use variable.

### 3. External URL — just paste the URL

```jsx
<img src="https://images.pexels.com/photos/32885186/pexels-photo-32885186.jpeg" />
```

No imports, no local file needed.

---

## react-responsive-carousel

```bash
npm i react-responsive-carousel
```

```jsx
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from "react-responsive-carousel"
```

The CSS import is required — without it the carousel has no styling. Each slide is a `<div>` containing an `<img>` and optionally a `<p className="legend">` for a caption.

Props used:

- `infiniteLoop` — loops back to the first slide after the last
- `dynamicHeight` — adjusts height to match each image

---

## Mixing Bootstrap and Tailwind

You can use both in the same project — add the Bootstrap CDN to `index.html`:

```html
<!-- In <head> -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">

<!-- Before </body> -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
```

CSS CDN goes in `<head>`, JS CDN goes at the bottom of `<body>`. This is the standard pattern — CSS loads first so there's no flash of unstyled content, JS loads last so it doesn't block page rendering.

### The Conflict Problem

Bootstrap and Tailwind both set global styles. Bootstrap adds underlines and colors to links and headings. On top of a dark Tailwind layout this looks wrong.

**Fix:** Use inline styles to override where needed, or prefix specific elements with Tailwind's reset utilities (`no-underline`, `text-inherit`, etc.).

### Pasting Bootstrap Components

Copying a Bootstrap component's HTML directly into a JSX file won't fully work unless the Bootstrap CSS CDN is already linked. The classes are just strings — if Bootstrap isn't loaded, none of them do anything. The CDN is what gives those class names their meaning.

---

## JSX Differences When Using Bootstrap Components

Bootstrap uses regular HTML attributes. JSX has some differences to watch for:

```jsx
// ❌ HTML
<label for="floatingInput">Email</label>

// ✅ JSX
<label htmlFor="floatingInput">Email</label>
```

`for` is a reserved JS keyword, so JSX uses `htmlFor`. Same reason `class` becomes `className`. When pasting Bootstrap HTML into JSX, these need to be changed manually.

---

## Inline Style in JSX (Mixed with Bootstrap)

```jsx
<div className="overflow-hidden" style={{ maxHeight: "30vh" }}>
```

When Bootstrap classes alone aren't enough (or when you need a value Tailwind doesn't have a class for), mix in an inline style. The double curly braces: outer `{}` = JS expression in JSX, inner `{}` = the style object.

---

## Key Takeaways

**Image paths:** Always ask — is this file in `public/` or `src/assets/`? That determines whether you use a string or an import.

**Third-party components:** Installing a package via npm is not enough if it ships its own CSS. You must also import that CSS file explicitly (like the carousel's `carousel.min.css`).

**Mixing libraries:** Bootstrap and Tailwind can coexist, but global styles will clash. Be ready to override with inline styles or more specific Tailwind utilities.

**CDN in React:** It works — just treat `index.html` exactly like you would in a plain HTML project. CSS in `<head>`, JS before `</body>`.
