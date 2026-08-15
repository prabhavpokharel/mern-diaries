# React.js — Day 5: Images, Carousels & Mixing CSS Libraries

---

## Three Ways to Use Images in React

Where an image file lives determines how you reference it. Get this wrong and you'll get a broken image or a 404 with no obvious error.

### 1. `public/` folder — reference by URL string

```jsx
<img src="/pexels-nana-llj-38667937.jpg" />
```

Files in `public/` are served directly from the root URL with no processing by Vite. No import needed — just a string path.

**Always use a leading `/`.** Without it, the path is relative to the current route. If you're on `/about/team`, the browser looks for `about/team/pexels-nana-llj-38667937.jpg` and gets a 404. With the leading slash, it always resolves from the root regardless of which route you're on.

### 2. `src/assets/` — import first, then use as a variable

```jsx
import img1 from '../assets/hero.png'

<img src={img1} />
```

Files inside `src/` are part of your app bundle. Vite processes and optimizes them at build time — hashing filenames for cache busting, compressing where possible. Because Vite needs to know about them at build time, you cannot reference them with a plain string path. You import them at the top of the file, and Vite resolves the import to the correct hashed URL. Use the imported variable as `src`.

**The rule:**

- `public/` → string path with leading `/`
- `src/assets/` → import at top, use variable in JSX

### 3. External URL — paste it directly

```jsx
<img src="https://images.pexels.com/photos/32885186/pexels-photo-32885186.jpeg" />
```

No import, no local file. Works exactly as it does in HTML.

---

## react-responsive-carousel

```bash
npm i react-responsive-carousel
```

```jsx
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from "react-responsive-carousel"
```

The CSS import is mandatory — without it the carousel has no styling at all. This is a pattern you'll see with many third-party UI packages: installing via npm gives you the JavaScript, but the package's own CSS must be imported explicitly.

Each slide is a `<div>` containing an `<img>` and optionally a `<p className="legend">` for a caption:

```jsx
<Carousel infiniteLoop dynamicHeight>
  <div>
    <img src="/pexels-nana-llj-38667937.jpg" />
    <p className="legend">Caption here</p>
  </div>
  <div>
    <img src={img1} />
    <p className="legend">Hero Image</p>
  </div>
</Carousel>
```

**Props:**

- `infiniteLoop` — loops back to the first slide after the last
- `dynamicHeight` — adjusts the carousel height to match each image

### A note on carousel libraries

`react-responsive-carousel` works fine for learning purposes, but it's not the current industry standard. **Swiper** (`swiper/react`) is what most production React projects use — more actively maintained, better mobile touch support, more flexible API. Worth knowing when you're choosing a carousel for a real project.

---

## Mixing Bootstrap and Tailwind

### Adding Bootstrap via CDN

```html
<!-- In <head> — CSS loads first -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">

<!-- Before </body> — JS loads last -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
```

CSS in `<head>` so there's no flash of unstyled content. JS before `</body>` so it doesn't block page rendering.

### The honest advice on mixing the two

Bootstrap and Tailwind can technically coexist, but in practice it's a constant battle. Both set global styles — Bootstrap resets, link colors, heading margins, form styles. Tailwind's preflight does the same thing differently. They fight each other and you spend time patching conflicts instead of building features.

**For new projects: pick one and commit to it.** Tailwind is the better long-term choice for React — it's utility-first, which pairs naturally with component-based development. Bootstrap is pre-built components, which works against how React is designed to be used.

The only legitimate reason to mix them is if you're migrating an existing Bootstrap codebase to Tailwind incrementally and need both during the transition.

### When you do mix them — handling conflicts

Bootstrap adds underlines and colors to links and headings that look wrong on a dark Tailwind layout. Override with Tailwind utilities or inline styles:

```jsx
// Tailwind utility reset
<a className="no-underline text-white">Link</a>

// Inline style override as a last resort
<div style={{ textDecoration: 'none', color: 'inherit' }}>...</div>
```

### Pasting Bootstrap components into JSX

Bootstrap component HTML copied from the docs won't work without the CDN already linked — the class names are just strings that mean nothing without Bootstrap's CSS loaded. Beyond that, JSX has two attribute differences to fix manually every time you paste:

```jsx
// ❌ HTML
<label for="floatingInput">Email</label>
<div class="form-floating">...</div>

// ✅ JSX
<label htmlFor="floatingInput">Email</label>
<div className="form-floating">...</div>
```

`for` is a reserved keyword in JavaScript — use `htmlFor`. `class` is also reserved — use `className`. These are the two you'll fix most often when converting HTML to JSX.

---

## Inline Style in JSX

```jsx
<div className="overflow-hidden" style={{ maxHeight: "30vh" }}>
```

Use inline styles when a Bootstrap class isn't giving you what you need, or when you need a specific value that Tailwind doesn't have a utility for. The double curly braces: outer `{}` is a JSX expression, inner `{}` is the JavaScript style object. Property names are camelCase: `maxHeight` not `max-height`.

---

## Key Rules to Take Away

**Image paths:** Is the file in `public/` or `src/assets/`? That's the only question. `public/` gets a string with a leading `/`. `src/assets/` gets an import.

**Third-party CSS:** If a package ships its own stylesheet, you must import it explicitly — npm install alone doesn't load CSS.

**Library conflicts:** Bootstrap and Tailwind both touch global styles. In a new project, pick one. In a mixed setup, expect to override things manually.
