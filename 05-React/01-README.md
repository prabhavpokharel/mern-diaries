# React + Vite: The Complete Picture

## 1. The Four Pieces That Make This Work

Four different tools, four different jobs. Confusing them is the #1 beginner mistake.

| Tool | What it actually is | Job |
|---|---|---|
| **React** | A JS *library* | Describes **what the UI should look like** for given data |
| **Node.js** | A JS *runtime* | Lets JS run **outside the browser** (on your machine) |
| **npm** | A *package manager* | Installs/shares reusable code (comes bundled with Node) |
| **Vite** | A *build tool / dev server* | Converts JSX → JS, serves your app, bundles it for production |

**Why it matters:** React never runs on its own. You need Node to execute JS on your computer, npm to pull in React itself, and Vite to translate JSX and serve the result to a browser. Remove any one piece and nothing starts.

Vite replaced **Create React App (CRA)** because CRA bundled your *entire* app before showing anything — slow. Vite serves files on-demand and only rebuilds what changed — near-instant.

---

## 2. Creating a Project — What Each Question Means

```bash
npm create vite@latest
```

- **Project name** → becomes the folder name *and* the `package.json` name → must be lowercase, hyphens only, no spaces/symbols (npm package-naming rules).
- **Framework** → React (vs Vue, Svelte, etc.)
- **Variant** → JavaScript vs TypeScript, plain vs **SWC**.
  - *SWC* = a Rust-based compiler that replaces Babel to transform JSX faster. `+ SWC` = faster dev builds, nothing else changes conceptually.
- **Linter (ESLint)** → doesn't run your code, just *reads* it and flags typos, unused vars, and style issues before you hit a runtime bug. Worth keeping on even as a beginner — it builds good habits.

Then:
```bash
cd project-name
npm install   # reads package.json, downloads packages into node_modules/
npm run dev   # starts local dev server, e.g. localhost:5173
npm run build # produces the optimized production version → outputs to /dist
```

---

## 3. Project Anatomy

```
my-project/
├── node_modules/     ← downloaded packages (huge, never edit/commit)
├── public/           ← static files, served as-is
├── src/               ← ALL your actual work happens here
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html         ← the ONLY html file
├── package.json        ← project identity + dependency list
├── package-lock.json    ← exact locked versions (for consistency across machines)
├── vite.config.js        ← Vite's settings
├── eslint.config.js       ← linter rules
└── .gitignore
```

### `src/` — yes, this is where you live
Everything you write — components, styles, assets you `import` — goes in `src`. Vite *processes* everything here: it optimizes images, hashes filenames for caching, bundles JS, and strips unused code.

### `public/` vs `src/assets`
| Use `public/` when... | Use `src/assets` when... |
|---|---|
| File must be reachable by a fixed URL (`/favicon.ico`, `/resume.pdf`) | File is used *inside* a component via `import` |
| You never want the filename to change | You want Vite to optimize/hash/bundle it |

The `public` folder name **never appears in the URL** — Vite maps its contents straight to the site root (`public/logo.png` → `/logo.png`).

### `.gitignore`
A plain text file listing what **Git should not track**. Common entries:
```
node_modules/     # huge, regenerable via npm install — never commit it
dist/             # build output — regenerated, not source code
*.log             # npm-debug.log, error logs — noise, not useful history
.env.local, *.local  # machine-specific / secret config — shouldn't be shared publicly
```
**Why it matters:** keeps your repo small, avoids leaking secrets, and avoids committing files that are automatically regenerated anyway.

### `dist/`
Only appears after `npm run build`. It's the final, optimized, production-ready bundle of HTML/CSS/JS you'd actually deploy — not something you edit.

*(Note: "solution files" like `.sln` are a Visual Studio/.NET concept — not a thing in Vite/React projects. Not relevant here.)*

---

## 4. `index.html` — Why There's Only One

Yes — a React app is a **Single Page Application (SPA)**. One real HTML file exists:

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

Everything else is generated dynamically by JavaScript at runtime and injected into that one `#root` div.

### So can I "View Source" to see my code?
**No — and that's the point.** "View Page Source" shows the raw HTML Vite/React sent originally: an empty `<div id="root">` and a `<script>` tag. It never re-runs JS, so it can't show you what React *built*.

To see the real, live DOM that React generated, use **DevTools → Inspect / Elements tab** — that reflects the current, JS-rendered state of the page, not the static file.

---

## 5. The Rendering Flow (this is the core mental model)

```
index.html  →  #root div + loads main.jsx
                        │
                        ▼
             main.jsx: ReactDOM.createRoot(#root).render(<App />)
                        │
                        ▼
                    App.jsx  ← you build your entire UI here
```

**Rule of thumb: don't touch `main.jsx` unless you genuinely need to** (e.g. adding a global Provider, Router, or StrictMode). All actual feature work happens inside `App.jsx` and the components it imports.

### Why the default page looks dark & centered
Vite's starter template ships `index.css` (global styles: dark background, centered layout) and `App.css` (component-specific styles), both `import`ed into their respective `.jsx` files. That's why deleting *code* from `App.jsx` didn't remove the styling — the CSS files were still linked and still had rules in them.

**Don't delete `index.css` entirely** — other things may reference it, and removing the file can break the import statement. Instead: **keep the file, empty out its contents, and write your own rules.** Same for `App.css`. Keeping `import './App.css'` in place means nothing errors even after you've cleared it out.

A genuinely "from scratch" starting point:
```jsx
import './App.css'

function App() {
  return (
    <>
      <h1>Hello World!</h1>
    </>
  )
}

export default App
```

---

## 6. Components — The One Idea Everything Else Builds On

> **Everything in React is a component.** A button is a component. A form is a component made of smaller components. A whole page is a component. Your `App` is just the top-level component that contains all the others.

This is *why* React scales: you build small, reusable, self-contained pieces and compose them into bigger ones — instead of one giant tangle of HTML/JS.

### Speeding up component creation: the ES7+ snippets extension
The **"ES7+ React/Redux/React-Native Snippets"** VS Code extension gives you typing shortcuts (like typing `!` for an HTML boilerplate) that instantly generate a component skeleton. Type the shortcut → press Tab/Enter → get a ready component.

| Shortcut | Style | What you get |
|---|---|---|
| `rfc` | Regular function | `function Name() {...}` + separate `export default` |
| `rfce` | Regular function | Same as `rfc`, export placed at the end |
| `rafc` | Arrow function | `const Name = () => {...}` + separate `export default` |
| `rafce` | Arrow function | Same as `rafc`, export combined at the end (most popular choice today) |

The pattern in the names: **`a` = arrow function** (vs. a plain `function` declaration), **`c` = component**, **`e` = export included in the snippet**. Functionally near-identical — pick one style and stay consistent.

### Auto-import trick
In VS Code, if you type a component/function name that exists elsewhere in the project and press Enter on the suggestion, VS Code **automatically adds the import statement** at the top of the file for you.

---

## 7. Exports — The Rule That Trips Everyone Up

| | Default export | Named (non-default) export |
|---|---|---|
| Count per file | **Only one** | Multiple allowed |
| Import syntax | `import Anything from './File'` (no braces) | `import { ExactName } from './File'` (**curly braces required**) |
| Rename on import? | Freely — call it whatever you want | Must match the exported name (unless using `as`) |

**Why it matters:** `{ }` isn't decoration — it's the signal that you're importing something by its *exact registered name* rather than "whatever this file exports by default."

---

## 8. JSX Syntax Details

**Self-closing vs. paired tags**
- No children → self-close: `<Component />`
- Has children → open and close: `<Component>...</Component>`
- Critical: the closing tag must be written as `</Component>` — **no space between `<` and `/`**. A stray space there is a syntax error.

**React Fragments — `<></>`**
JSX requires every `return` to have a **single root element**. If you don't want to wrap your content in an extra unnecessary `<div>` (which pollutes the real DOM), use a Fragment:
```jsx
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
)
```
This is shorthand for `<React.Fragment>...</React.Fragment>` — it groups elements *without* adding any actual node to the rendered page.

---

## The One-Paragraph Summary

Node lets JS run on your machine; npm fetches the packages you need (like React); Vite compiles your JSX and serves it fast during development. Your entire app is one `index.html` with a single `#root` div, into which `main.jsx` mounts your `App` component — and from there, everything is components inside components, exported one way or another, styled by CSS files you actually control, and scaffolded quickly with snippet shortcuts like `rafce`.