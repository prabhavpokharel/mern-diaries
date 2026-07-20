# Module 6 — React.js Fundamentals

---

## What is React?

React is a **JavaScript library** for building user interfaces. It was created by **Jordan Walke** at Meta (Facebook), first used internally in 2011, and open-sourced in 2013.

**The problem it solves:** In a complex app like Facebook, data changes constantly — likes, comments, messages. Manually updating the DOM for every change gets messy fast. React solves this by letting you describe *what the UI should look like* for the current data, and it figures out *how* to update only what changed.

> You say: "Given this data, my UI should look like this."
> React handles the rest.

---

## What is Node.js?

JavaScript was originally built to run only inside a browser. **Node.js** is a runtime that lets JavaScript run *outside* the browser — on your computer or a server.

It was built by **Ryan Dahl in 2009** using Google Chrome's **V8 engine** (the same engine that runs JS in Chrome). He simply extracted that engine and made it run standalone.

**Why it matters for you:** Before Node.js, you needed JavaScript for the frontend and a completely different language (PHP, Python, Ruby) for the backend. Node.js made it possible to use JavaScript everywhere — one language, full stack.

Node.js is **not a framework or language**. It's just an environment where JS can run with access to the file system, network, databases, etc.

---

## What is npm?

**npm (Node Package Manager)** is a tool that comes with Node.js. It lets you install, manage, and share reusable JavaScript code (called **packages** or **libraries**).

Instead of building everything from scratch, you install a package someone already wrote:

```bash
npm install axios
```

npm downloads it into `node_modules/` and records it in `package.json`. Anyone else cloning your project just runs `npm install` and gets the same setup — no need to share `node_modules/`.

**Relation to Node.js:** Node.js runs your code. npm manages the libraries that code depends on. They always come together.

---

## What is Vite?

**Vite** (French for "fast", pronounced *"veet"*) is a **build tool and development server** for modern JS apps. It is NOT part of React — it's the environment that makes running a React project fast and easy.

React writes JSX — which browsers don't understand. Something needs to:
- Convert JSX → JavaScript
- Bundle files together
- Start a local dev server
- Auto-reload when you save

Vite does all of this.

### Why not Create React App (CRA)?

CRA was the old official way to start React projects. Its problem: it bundled your *entire* app before showing anything in the browser — painfully slow for large projects.

Vite only processes files when they're actually needed, giving near-instant startup and updates.

The React team no longer recommends CRA. Vite is now the go-to.

### Alternatives to Vite

| Tool | Best For |
|------|----------|
| **Vite** | Most React projects, learning, small-medium apps |
| **Next.js** | Full-stack React, SSR, SEO-focused sites |
| **Remix** | Data-driven apps with modern routing |
| **Parcel** | Zero-config projects |
| **Webpack** | Legacy codebases, highly custom setups |

---

## Creating a React Project with Vite

### The Command

```bash
npm create vite@latest
```

This scaffolds (generates) a new project. You'll be asked a few questions:

```
Project name:   my-react-app
Framework:      React
Variant:        JavaScript
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
|--------|---------|
| JavaScript | Plain JS — best for learning React |
| JavaScript + SWC | Same but with a faster Rust-based compiler |
| TypeScript | Adds static type checking — learn later |
| TypeScript + SWC | TypeScript + faster compiler |

**Recommendation:** Start with `JavaScript`. Graduate to `JavaScript + SWC` for real projects.

### Linter (ESLint)

A linter reads your code *before* running it and flags:
- Typos (`nam` instead of `name`)
- Unused variables
- Bad practices

ESLint is the standard in the JS ecosystem. Even as a beginner, keep it enabled — it builds good habits early.

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
|-------|-------------|
| `name` | Project name (used by npm) |
| `version` | Your app's version |
| `type: "module"` | Enables ES module syntax (`import/export`) |
| `scripts` | Shortcuts for commands you run often |
| `dependencies` | Packages needed to *run* your app (React) |
| `devDependencies` | Packages needed only during *development* (Vite, ESLint) |

**Scripts you'll use:**

```bash
npm run dev      # Start the dev server
npm run build    # Create a production-ready bundle
npm run preview  # Preview the production build locally
npm run lint     # Check code for errors
```

You generally don't need to edit `package.json` manually — npm updates it when you install packages.

---

## Project Folder Structure

```
my-react-app/
│
├── public/          ← Static files served directly
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
└── node_modules/    ← All installed packages (never touch manually)
```

---

## The `public/` Directory

Static assets placed here are served *as-is* directly from the root URL — no processing by Vite.

```
public/
├── favicon.svg
├── wallpaper.png
└── resume.pdf
```

Accessible via:
```
http://localhost:5173/wallpaper.png
http://localhost:5173/resume.pdf
```

Notice: `public` does NOT appear in the URL. Vite maps the contents of `public/` directly to `/`.

**`public/` vs `src/assets/`:**

| Use `public/` when | Use `src/assets/` when |
|---|---|
| File needs a permanent, direct URL | File is imported inside a component |
| No processing needed (PDF, robots.txt) | You want Vite to optimize it |
| Filename should never change | It belongs to the React app itself |

---

## The `src/` Directory

This is where you spend 99% of your time. Everything inside here is processed by Vite.

Key files:
- `main.jsx` — Entry point. Don't touch unless necessary.
- `App.jsx` — Your main component. This is where you start writing.
- `index.css` — Global styles. Don't delete the file; clear its contents instead.
- `App.css` — Styles for App component.

---

## `.gitignore`

`.gitignore` tells Git which files/folders to NOT track or push to GitHub.

Default entries and why they're ignored:

| Entry | Why |
|-------|-----|
| `node_modules/` | Huge folder. Recreated by `npm install` from `package.json`. Never commit it. |
| `dist/` | Production build output. Generated by `npm run build`. Not source code. |
| `*.local` | Local environment files with secrets (API keys, passwords). Never commit. |
| Log files | Auto-generated error/debug logs. Not useful in a repo. |

**Rule of thumb:** If a file can be *regenerated*, or contains *secrets*, it belongs in `.gitignore`.

---

## `index.html` — The Only HTML File

Yes, there's only one HTML file in the whole project. React is a **Single Page Application (SPA)** — all content is rendered by JavaScript.

```html
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
```

The `root` div is empty. React fills it with content dynamically.

### Can you see the source code in the browser?

**View Page Source** shows the HTML as the server sent it — just an empty `<div id="root">`. The actual content is injected by JavaScript at runtime. That's why React apps are called "client-side rendered" by default.

To inspect the actual rendered output, use **DevTools → Elements** tab (not View Source).

---

## How React Renders — The Flow

```
index.html
  └── <div id="root">
        └── main.jsx  (entry point — links React to the root div)
              └── App.jsx  (your actual UI code goes here)
```

`main.jsx` takes your `App` component and "mounts" it into the `root` div. You rarely need to touch `main.jsx`.

**Your job is in `App.jsx`.**

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

If you see dark background or center-aligned text even after clearing `App.jsx`, it's because `index.css` and `App.css` still have styles. Don't delete these files — just clear their contents.

---

## ES7+ React/Redux Snippets Extension

Install this VS Code extension. It gives you shortcuts to generate React component boilerplate instantly.

| Shortcut | What it generates | Difference |
|----------|-------------------|-----------|
| `rafce` | Arrow function component with export | Arrow function + default export |
| `rfce` | Regular function component with export | Regular function + default export |
| `rfc` | Regular function component | No export included |
| `rafc` | Arrow function component | No export included |

**Use `rafce`** — it's the most common. Works exactly like `!` in HTML for boilerplate.

Also: if you type a component name or filename in VS Code and press Enter, it auto-imports it at the top. Use this constantly.

---

## Everything in React is a Component

A component is just a **JavaScript function that returns JSX** (HTML-like syntax).

- A button → component
- A navbar → component
- A page → component (made of smaller components)
- A whole app → one big component (made of pages)

Think of components like LEGO bricks. You build small ones and stack them to make bigger ones.

---

## JSX Rules to Remember

### Self-closing vs Open-closing tags

```jsx
// Self-closing (no children needed)
<img src="photo.jpg" />
<input type="text" />
<br />

// Open-closing (has children)
<div>content here</div>
<h1>Title</h1>
```

For pair tags, **no space is allowed between `</` and the tag name**, else you get an error.

### React Fragment `<></>`

React components can only return **one root element**. But you don't always want an extra `<div>`. That's where fragments come in:

```jsx
// ❌ This breaks (two root elements)
return (
  <h1>Title</h1>
  <p>Paragraph</p>
)

// ✅ Wrap in a fragment
return (
  <>
    <h1>Title</h1>
    <p>Paragraph</p>
  </>
)
```

A fragment is like an invisible wrapper — it groups elements without adding any extra HTML to the DOM.

---

## Exports — Default vs Named

| | Default Export | Named Export |
|---|---|---|
| Syntax (export) | `export default App` | `export { Navbar }` or `export function Navbar()` |
| Syntax (import) | `import App from './App'` | `import { Navbar } from './Navbar'` |
| Curly braces? | ❌ No | ✅ Yes |
| Rename on import? | ✅ Yes, any name works | ❌ Must use same name |
| How many per file? | **Only one** | **Multiple allowed** |

```jsx
// Default export — import with any name
import HELLO from './App'       // Works fine
import App from './App'         // Also works

// Named export — must use exact name
import { Navbar } from './Navbar'
import { Footer } from './Footer'
```

**Rule:** One default export per file. As many named exports as you want.

---

## Summary — How It All Connects

```
npm (manages packages)
  └── installs React + Vite

Vite (dev environment)
  └── converts JSX → JS
  └── starts dev server at localhost:5173

index.html
  └── has <div id="root">
  └── loads main.jsx

main.jsx
  └── mounts App into #root

App.jsx
  └── YOUR CODE LIVES HERE
  └── made of components
  └── components export themselves (default or named)
  └── other components import and use them
```