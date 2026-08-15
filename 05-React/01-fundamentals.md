# React.js Fundamentals — Day 1

---

## What is React?

React is a **JavaScript library** for building user interfaces. It was created by **Jordan Walke** at Meta (Facebook), first used internally in 2011, and open-sourced in 2013.

**The problem it solves:** In a complex app like Facebook, data changes constantly — likes, comments, messages. Manually updating the DOM for every change gets messy fast. React solves this by letting you describe *what the UI should look like* for the current data, and it figures out *how* to update only what changed.

> You say: "Given this data, my UI should look like this."
> React handles the rest.

### How React Actually Does This — The Virtual DOM

React keeps a lightweight copy of the DOM in memory called the **Virtual DOM**. When state changes, React:

1. Builds a new Virtual DOM tree reflecting the updated state
2. **Diffs** it against the previous Virtual DOM (compares the two)
3. Calculates the minimum set of changes needed
4. Applies only those changes to the real DOM

This is why React is fast. Instead of re-rendering the entire page on every change, it surgically updates only what actually changed. This process is called **reconciliation**.

---

## What is Node.js?

JavaScript was originally built to run only inside a browser. **Node.js** is a runtime that lets JavaScript run *outside* the browser — on your computer or a server.

It was built by **Ryan Dahl in 2009** using Google Chrome's **V8 engine** (the same engine that runs JS in Chrome). He extracted that engine and made it run standalone.

**Why it matters:** Before Node.js, you needed JavaScript for the frontend and a completely different language (PHP, Python, Ruby) for the backend. Node.js made it possible to use JavaScript everywhere — one language, full stack.

Node.js is **not a framework or a language**. It's just an environment where JS can run with access to the file system, network, databases, etc.

---

## What is npm?

**npm (Node Package Manager)** is a tool that comes bundled with Node.js. It lets you install, manage, and share reusable JavaScript code (called **packages** or **libraries**).

Instead of building everything from scratch, you install a package someone already wrote:

```bash
npm install axios
```

npm downloads it into `node_modules/` and records it in `package.json`. Anyone else cloning your project just runs `npm install` and gets the same setup — no need to share `node_modules/`.

**Relation to Node.js:** Node.js runs your code. npm manages the libraries that code depends on. They always come together — installing Node.js installs npm automatically.

---

## What is Vite?

**Vite** (French for "fast", pronounced *"veet"*) is a **build tool and development server** for modern JS apps. It is NOT part of React — it's the environment that makes running a React project fast and easy.

React uses JSX — which browsers don't understand natively. Something needs to:

- Convert JSX → plain JavaScript
- Bundle multiple files together
- Start a local dev server
- Auto-reload the browser when you save

Vite does all of this.

### Why not Create React App (CRA)?

CRA was the old official way to start React projects. Its problem: it bundled your *entire* app before showing anything in the browser — painfully slow for large projects.

Vite only processes files when they're actually needed, giving near-instant startup and updates. The React team no longer recommends CRA. Vite is now the standard starting point.

### Alternatives to Vite

| Tool | Best For |
| ------ | ---------- |
| **Vite** | Most React projects, learning, small-medium apps |
| **Next.js** | Full-stack React, server-side rendering, SEO-focused sites |
| **Remix** | Data-driven apps with modern routing |
| **Parcel** | Zero-config projects |
| **Webpack** | Legacy codebases, highly custom setups |

Note: Next.js and Remix are more than build tools — they're full React frameworks with routing, data fetching, and server-side capabilities built in. For learning React itself, start with Vite.

---

## Creating a React Project with Vite

### The Command

```bash
npm create vite@latest
```

This scaffolds (generates) a new project. You'll be asked a few questions:

```text
Project name:   my-react-app
Framework:      React
Variant:        JavaScript + SWC
Linter:         ESLint
Start now?:     No
```

Then:

```bash
cd my-react-app
npm install
npm run dev
```

Your app runs at `http://localhost:5173`

---

### Project Name Rules

**Allowed:**

- Lowercase letters → `myproject`
- Hyphens → `my-react-app`
- Numbers → `react2025`

**Not Allowed:**

- Spaces → ~~`My React App`~~
- Capital letters → ~~`MyReactApp`~~
- Special characters → ~~`my@app`~~
- Reserved names → ~~`react`, `npm`, `vite`~~

Good names: `portfolio`, `weather-app`, `expense-tracker`, `02-myproject`

---

### Framework

Choose **React**. Other options (Vue, Svelte, Solid) are for different UI libraries entirely.

### Variant

| Option | Meaning |
| -------- | --------- |
| JavaScript | Plain JS with Babel compiler |
| JavaScript + SWC | Plain JS with faster Rust-based compiler |
| TypeScript | Adds static type checking |
| TypeScript + SWC | TypeScript with faster compiler |

**Use `JavaScript + SWC` from day one.** SWC is strictly faster than the default Babel compiler and doesn't change how you write code at all. There's no reason to pick plain `JavaScript` unless a specific plugin you need isn't SWC-compatible yet — which is rare.

### Linter (ESLint)

A linter reads your code *before* running it and flags:

- Typos (`nam` instead of `name`)
- Unused variables
- Bad practices

ESLint is the standard in the JS ecosystem. Keep it enabled — it catches real bugs and builds good habits early.

---

## Understanding `package.json`

```json
{
  "name": "02-myproject",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "vite": "^8.1.1",
    "eslint": "^10.6.0"
  }
}
```

| Field | What it does |
| ------- | ------------- |
| `name` | Project name used by npm |
| `version` | Your app's version |
| `type: "module"` | Enables ES module syntax (`import`/`export`) |
| `scripts` | Shortcuts for terminal commands |
| `dependencies` | Packages needed to *run* the app in production |
| `devDependencies` | Packages needed only during *development* |

**Scripts you'll use constantly:**

```bash
npm run dev      # Start the dev server
npm run build    # Create a production-ready bundle
npm run preview  # Preview the production build locally
npm run lint     # Check code for errors
```

You generally don't need to edit `package.json` manually — npm updates it automatically when you install packages.

---

## Project Folder Structure

```text
my-react-app/
│
├── public/          ← Static files served directly, no processing
├── src/             ← All your React code lives here
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
│
├── index.html       ← The one and only HTML file
├── package.json
├── vite.config.js
├── eslint.config.js
├── .gitignore
└── node_modules/    ← All installed packages — never touch manually
```

---

## The `public/` Directory

Static assets placed here are served *as-is* directly from the root URL — Vite does not process or optimize them.

```text
public/
├── favicon.svg
├── wallpaper.png
└── resume.pdf
```

Accessible via:

```text
http://localhost:5173/wallpaper.png
http://localhost:5173/resume.pdf
```

`public` does NOT appear in the URL. Vite maps the contents of `public/` directly to `/`.

**`public/` vs `src/assets/`:**

| Use `public/` when | Use `src/assets/` when |
| --- | --- |
| File needs a permanent, direct URL | File is imported inside a component |
| No processing needed (PDF, robots.txt, favicon) | You want Vite to optimize and hash it |
| Filename must never change | It's part of the React app itself |

---

## The `src/` Directory

This is where you spend 99% of your time. Everything inside here is processed by Vite.

Key files:

- `main.jsx` — Entry point. Mounts your app into the HTML. Rarely needs touching.
- `App.jsx` — Your main component. This is where you start building.
- `index.css` — Global styles. Don't delete the file — just clear its contents and write your own.
- `App.css` — Styles scoped to the App component.

---

## `.gitignore`

`.gitignore` tells Git which files and folders to never track or push to GitHub.

| Entry | Why it's ignored |
| ------- | ----------------- |
| `node_modules/` | Massive folder — recreated by `npm install`. Never commit it. |
| `dist/` | Production build output from `npm run build`. Not source code. |
| `*.local` | Local environment files containing secrets like API keys. Never commit. |
| Log files | Auto-generated debug output. Not useful in a repo. |

**Rule of thumb:** If a file can be *regenerated*, or contains *secrets*, it belongs in `.gitignore`.

---

## `index.html` — The Only HTML File

React is a **Single Page Application (SPA)** — there's one HTML file, and JavaScript renders everything inside it.

```html
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
```

The `root` div starts empty. React fills it dynamically at runtime.

### View Page Source vs DevTools

**View Page Source** shows the raw HTML the server sent — just an empty `<div id="root">`. The content doesn't exist yet because JavaScript hasn't run.

To see the actual rendered output, use **DevTools → Elements** tab. React has already injected the full component tree there.

---

## How React Renders — The Flow

```text
index.html
  └── <div id="root">
  └── loads main.jsx

main.jsx
  └── mounts App component into #root

App.jsx
  └── your actual UI — built from components
```

`main.jsx` is the bridge between the HTML file and your React code. You don't need to touch it unless you're wrapping the app in a Provider (covered in context).

---

## Starting from Scratch — Clean App.jsx

After clearing all default content:

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

If you still see dark background or centered text after clearing `App.jsx`, check `index.css` and `App.css` — they still have the default Vite styles. Clear their contents too, don't delete the files.

---

## A Note on `import React from 'react'`

You'll see this at the top of older React files and tutorials:

```jsx
import React from 'react'
```

Since React 17, **you don't need this anymore**. The JSX transform handles it automatically. Vite + React projects don't require it. If you see it, it's either old habit or legacy code — not wrong, just unnecessary. Don't add it to new files.

---

## ES7+ React/Redux Snippets Extension

Install this VS Code extension. It generates component boilerplate from short shortcuts.

| Shortcut | What it generates |
| ---------- | ------------------- |
| `rafce` | Arrow function component with default export |
| `rfce` | Regular function component with default export |
| `rfc` | Regular function component, no export |
| `rafc` | Arrow function component, no export |

**Use `rafce`** for everything. It's the most common pattern in modern React — arrow function + default export in one shot. Works exactly like `!` in HTML.

Also: type a component name or filename in VS Code and press Enter — it auto-imports at the top of the file. Use this constantly.

---

## Everything in React is a Component

A component is a **JavaScript function that returns JSX**.

- A button → component
- A navbar → component
- A page → component made of smaller components
- The whole app → one root component containing everything else

Think of components like LEGO bricks. Build small, reusable ones and compose them into bigger ones.

---

## JSX Rules

### Self-closing vs Open-closing Tags

```jsx
// Self-closing — elements with no children
<img src="photo.jpg" />
<input type="text" />
<br />

// Open-closing — elements with children
<div>content here</div>
<h1>Title</h1>
```

### One Root Element Per Component

A component can only return one root element. If you need multiple elements, wrap them:

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
```

A **React Fragment** (`<></>`) groups elements without adding anything to the actual HTML output. Use it whenever you need to return multiple elements but don't want an unnecessary `<div>` in the DOM.

### `className` instead of `class`

`class` is a reserved keyword in JavaScript. In JSX, use `className`:

```jsx
<h1 className="title">Hello</h1>
```

### Inline Styles are Objects

```jsx
// ❌ HTML syntax — doesn't work in JSX
<h1 style="color: red; font-size: 24px;">Hello</h1>

// ✅ JSX syntax — style takes a JS object
<h1 style={{ color: 'red', fontSize: '24px' }}>Hello</h1>
```

Outer `{}` = JS expression inside JSX. Inner `{}` = the actual object. Property names are camelCase (`fontSize`, not `font-size`).

---

## Exports — Default vs Named

| | Default Export | Named Export |
| --- | --- | --- |
| Export syntax | `export default App` | `export { Navbar }` or `export function Navbar()` |
| Import syntax | `import App from './App'` | `import { Navbar } from './Navbar'` |
| Curly braces on import? | No | Yes |
| Can rename on import? | Yes — any name works | No — must use exact name |
| How many per file? | Only one | Multiple allowed |

```jsx
// Default export — import with any name you like
import HELLO from './App'   // works
import App from './App'     // also works

// Named export — must use the exact exported name
import { Navbar } from './Navbar'
import { Footer } from './Footer'
```

One default export per file. As many named exports as you need.

---

## How It All Connects

```text
npm
  └── installs React, Vite, and other packages

Vite
  └── converts JSX → JavaScript
  └── starts dev server at localhost:5173
  └── hot-reloads on save

index.html
  └── <div id="root"> (empty)
  └── loads main.jsx

main.jsx
  └── mounts App into #root

App.jsx
  └── your code lives here
  └── composed of components
  └── components are imported and nested inside each other
```
