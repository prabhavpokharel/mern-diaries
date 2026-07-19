# React Basics & Project Setup — Notes

## What is React? Who made it? How does it work?

React is a **JavaScript library for building user interfaces**, specifically for building things out of reusable pieces called *components*. It was built by **Jordan Walke**, an engineer at **Facebook (Meta)**, and released publicly in 2013.

**Why it exists:** Before React, updating a web page usually meant manually finding an element (`document.getElementById(...)`) and mutating it — the "direct DOM manipulation" style. This gets messy fast: as an app grows, you lose track of what part of the UI depends on what data, and keeping everything in sync becomes error-prone. React solves this by flipping the model: instead of *telling the browser how to update*, you *describe what the UI should look like for a given state*, and React figures out the DOM updates for you.

**How it works, conceptually:** You write your UI as a tree of components, each returning a description of what it should render (JSX). When data (state) changes, React doesn't immediately touch the real DOM. It first builds a lightweight in-memory representation of the UI (the **Virtual DOM**), compares ("diffs") the new version against the previous one, and then applies only the minimal set of real DOM changes needed. This is why React feels declarative: you say "when count is 5, show 5" rather than "increment the text node's value."

Think of it like a chef re-plating a dish: instead of rebuilding the whole plate from scratch every time an ingredient changes, they compare the new plate to the old one and only swap what's different.

- React = library for building UIs from components.
- Created by Jordan Walke at Facebook, released 2013.
- Solves the problem of manually syncing UI with changing data.
- Uses a Virtual DOM to compute and apply only necessary real DOM changes.

---

## What is Node.js? Why was it created? Why is it needed?

Node.js is a **JavaScript runtime environment** that lets you run JavaScript **outside the browser** — on your computer or a server.

**Why it exists:** Originally, JavaScript could only run inside a browser, because it needed the browser's engine (like Chrome's V8) to execute. Around 2009, **Ryan Dahl** took Chrome's V8 engine and built a program that could run JS directly on a machine, outside any browser, and gave it the ability to do things browsers normally block for security — like reading files, opening network ports, and talking to a file system. That combination is Node.js.

**Why it's needed (for you, right now):** You don't write React apps by hand-typing every file into a browser. You need tools to:
- install packages (React itself is a package),
- bundle and transform your code (JSX isn't valid browser JS on its own),
- run a local development server that reloads your app as you edit.

All of these tools (npm, Vite, ESLint, etc.) are themselves JavaScript programs. To run *them*, your computer needs a JS runtime outside the browser — that's Node.js. So Node isn't something your React app runs *in* when deployed to users; it's the engine your *development tools* run on.

- Node.js = JavaScript runtime for running JS outside the browser.
- Built by Ryan Dahl using Chrome's V8 engine.
- Gives JS access to the file system, network, etc.
- Needed because your dev tools (npm, Vite, ESLint) are JS programs that need something to run on.

---

## What is npm? What's its significance? Relation to Node?

npm stands for **Node Package Manager**. It's a tool that comes bundled with Node.js, and it does two main jobs: it's a **registry** (a giant public library of reusable JavaScript packages) and a **command-line tool** to install, update, remove, and run those packages in your project.

**Why it exists:** Without a package manager, if you wanted to use someone else's code (like React), you'd have to manually download files, place them correctly, and manage version updates yourself — for every single dependency, including the dependencies *those* dependencies need. npm automates all of that: it reads a manifest file (`package.json`), downloads the exact versions needed, and organizes them in a `node_modules` folder.

**Relation to Node:** npm is installed automatically when you install Node.js — they ship together. But conceptually they're separate: Node is the *runtime* that executes JS code; npm is the *package manager* that fetches and organizes the code you want to run. You could technically use a different package manager (like `yarn` or `pnpm`) on top of the same Node runtime.

**Significance:** npm is what makes the entire modern JS ecosystem "pluggable" — instead of writing everything from scratch, you install battle-tested packages (React, Vite, ESLint...) with one command, and npm tracks exactly which versions your project depends on so it works the same on any machine.

- npm = Node Package Manager: registry + CLI tool.
- Solves the problem of manually managing external code and its versions.
- Ships with Node.js but is a distinct tool.
- Reads/writes `package.json` to track dependencies.

---

## What is Vite? Why did Create React App (CRA) fall out of favor? Alternatives?

Vite (French for "fast") is a **build tool and development server** for modern web projects. It does two things: serves your app instantly during development, and bundles/optimizes it for production when you're ready to ship.

**Why it exists / what problem it solves:** Older tools like Create React App (built on **Webpack**) worked by bundling your *entire* app before the dev server could even start, and re-bundling large chunks of it on every save. As a project grows to hundreds of files, this becomes slow — you'd wait seconds (sometimes longer) just to see a one-line change. Vite solves this using two ideas:
1. **Native ES modules in development** — modern browsers can import JS modules directly. Vite serves your source files almost as-is over native `import`, only transforming what's actually requested, so the dev server starts near-instantly regardless of project size.
2. **esbuild/Rollup for bundling** — for production builds, Vite uses highly optimized bundlers written in fast languages, producing smaller, more optimized output than Webpack typically did, in less time.

**Why CRA became unavailable/discouraged:** CRA hadn't been meaningfully maintained by the React team, and it was officially deprecated — the React docs stopped recommending it in favor of frameworks/tools like Vite (and Next.js, Remix) that offer faster dev experience and are actively maintained.

**Alternatives to Vite:** Yes — Webpack (older, more configurable but slower), Parcel (zero-config bundler), esbuild/Rollup used directly, or full frameworks like **Next.js** (adds routing, server-side rendering) if you need more than "just React." For learning React itself, Vite is preferred because it's fast and minimal — it doesn't hide React behind extra framework conventions.

- Vite = fast dev server + build tool, using native ES modules in dev.
- Solves the "slow startup/reload on large projects" problem of older bundlers.
- CRA was deprecated/unmaintained; React docs now point elsewhere.
- Alternatives: Webpack, Parcel, Next.js, Remix.

---

## Creating a React app with Vite: command, project naming, and prompts

**Command:**
```
npm create vite@latest
```
This tells npm to fetch and run the `create-vite` scaffolding tool (you don't install it permanently — `create` runs it once via `npx` under the hood, which is why you see `npx create-vite` in the output).

**Project naming rules:** The project name becomes a folder name and (by default) the `name` field in `package.json`. npm package names must be:
- lowercase only,
- no spaces (use `-` instead),
- no special characters other than `-` and `_`,
- can't start with `.` or `_`.

So `02-myproject` is valid; something like `My Project!` would not be.

**The prompts, explained:**
- **Framework** — which UI library/tool the template is for (React, Vue, Svelte, Vanilla, etc.). This decides which starter files Vite scaffolds for you.
- **Variant** — which flavor of that framework: plain **JavaScript**, or **TypeScript** (adds type-checking), and sometimes an SWC-compiled variant for faster builds.
- **Linter (ESLint)** — a tool that analyzes your code *without running it* to catch likely bugs and enforce consistent style (e.g., unused variables, missing dependencies in hooks). It doesn't fix your code automatically by default; it flags issues as you write. Choosing it here just scaffolds the config file so it's ready to use.
- **"Install with npm and start now?"** — whether Vite should immediately run `npm install` and start the dev server for you. Choosing "No" just means you'll run `npm install` and `npm run dev` manually afterward (as the output shows).

- `npm create vite@latest` scaffolds a new project via npx.
- Project names must be lowercase, hyphen-separated, no spaces/special chars.
- Framework/variant prompts choose your starter template (React + JS/TS).
- ESLint prompt just pre-configures a code-quality linter for you.

---

## Understanding your `package.json`

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
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.3",
    "eslint": "^10.6.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.3",
    "globals": "^17.7.0",
    "vite": "^8.1.1"
  }
}
```

This file is your project's **identity card + instruction manual** — it tells npm what your project is called, what commands it supports, and exactly which packages (and versions) it needs to run.

- **`name`** — the project's package name (matches folder name by default). You can rename this safely.
- **`private: true`** — prevents this project from accidentally being published to the public npm registry. Since this is a personal app, not a library, leave it `true`.
- **`version`** — your project's version number. Irrelevant for a personal learning project; change it only if you start versioning releases.
- **`type: "module"`** — tells Node to treat `.js` files as **ES Modules** (`import`/`export` syntax) instead of the older CommonJS (`require`). Vite relies on this.
- **`scripts`** — shortcuts you run via `npm run <name>` (e.g. `npm run dev`). `dev` starts the local server, `build` creates an optimized production bundle, `lint` runs ESLint over your code, `preview` lets you locally preview the production build.
- **`dependencies`** — packages your app *needs at runtime* to actually work: React and ReactDOM (the library that lets React talk to the actual browser DOM).
- **`devDependencies`** — packages only needed *while developing*, not shipped to users: Vite itself, the React plugin for Vite, ESLint and its plugins, and TypeScript type definitions (even in a JS project, these help your editor autocomplete/understand React's shape).

**What you'd typically change:** `name` (to something meaningful), and `version` if you care about tracking it. You generally don't hand-edit the dependency lists — npm updates those automatically when you `npm install`/`npm uninstall` packages.

- `package.json` = project metadata + dependency list + command shortcuts.
- `dependencies` = needed in production; `devDependencies` = needed only while building/developing.
- Scripts are just aliases so you don't type long commands.
- You rarely hand-edit dependency versions — let npm manage that.

---

## The `public` directory

The `public` folder holds **static assets that should be served exactly as-is**, without being processed, transformed, or bundled by Vite. That's the whole point of it.

**Why it exists:** Most files you import into your components (images, CSS) get processed by Vite — it might rename them with a hash, optimize them, or bundle them into your JS output. But some files *shouldn't* be touched: a `favicon.svg`, `robots.txt`, or a file you want available at a fixed, predictable URL. Vite copies everything in `public/` directly into the final build output, unchanged, at the same relative path.

That's exactly why `localhost:5173/wallpaper.png` works if you drop `wallpaper.png` into `public/`: Vite's dev server maps the root URL (`/`) directly to the `public` folder's contents. So `public/wallpaper.png` becomes reachable at `/wallpaper.png`. No import statement needed — it's just a file being served, like a tiny built-in file server.

**Rule of thumb:** if a file needs to be referenced by a fixed URL path (favicons, `robots.txt`, files linked from `index.html`), put it in `public`. If it's used *inside* your components (an image shown in a card, an icon used in JSX), importing it from `src` is usually better, since Vite can then optimize it and catch broken references at build time.

- `public/` = static files served as-is, unprocessed, at their exact path.
- Explains why `public/wallpaper.png` → `localhost:5173/wallpaper.png` works.
- Use it for favicons, robots.txt, and fixed-URL assets.
- Prefer importing assets from `src` when used inside components.

---

## The `src` directory

`src` (short for "source") is where **all your actual application code lives** — components, styles you write, hooks, logic. Yes, in a Vite React project, essentially everything you build goes here.

**Why it's separated like this:** Splitting `src` (your code) from `public` (static files) and config files (root-level `vite.config.js`, `package.json`, etc.) keeps concerns distinct: Vite knows to process and bundle anything imported from `src`, while leaving `public` untouched and reading config files separately for build behavior. It also makes tooling simpler — linters, bundlers, and type-checkers can be told "only look inside `src`."

As your app grows, you'll organize `src` further — folders like `components/`, `hooks/`, `assets/` — but at the start, it just holds `main.jsx`, `App.jsx`, and their CSS files.

- `src/` = where you write all component/app code.
- Kept separate from `public/` (static files) and root config files.
- This separation lets tools apply different rules to code vs. static assets.

---

## `.gitignore`, and what `dist`, `*.local`, and log files mean

`.gitignore` is a plain text file that tells **Git** (the version control system) which files or folders to *never track or commit* to your repository.

**Why it's useful:** Some files shouldn't be in version control at all:
- They're **regenerable** — like `node_modules` (all your installed packages) or `dist` (the production build output). Committing these bloats your repo for no benefit; anyone can regenerate them from `package.json` and your source code.
- They're **machine-specific or secret** — like `.env.local` (local environment variables, often containing API keys) or editor-specific files.
- They're **noise** — like log files, which are just debug output, not meaningful project history.

**Breaking down the common entries:**
- **`dist`** — the folder Vite creates when you run `npm run build`; it contains the final, optimized HTML/CSS/JS meant for deployment. It's generated output, not source — so it's ignored.
- **`*.local`** — a wildcard pattern matching any file ending in `.local` (like `.env.local`), typically used for machine-specific overrides or secrets you don't want shared or committed.
- **Log files** (e.g. `*.log`, `npm-debug.log`) — output from tools when something goes wrong; useful for local debugging only, not for the repo.

Think of `.gitignore` as a bouncer at the door of your repository: it decides what's allowed to "check in" and what gets turned away, keeping the repo focused on things that actually represent your project's source of truth.

- `.gitignore` = tells Git which files/folders to never track.
- Ignored because they're regenerable (`dist`, `node_modules`), machine-specific/secret (`*.local`), or just noise (logs).
- Keeps your repository clean and focused on actual source code.

---

## Why `index.html` is the only HTML file — and how the app still shows on screen

Yes — in a Vite React project, `index.html` (at the project root) is the **only** HTML file, and that's intentional. React apps are typically **SPAs (Single Page Applications)**: instead of navigating between separate HTML pages, one HTML file loads once, and JavaScript takes over rendering everything inside it — swapping content in and out as needed, without full page reloads.

**Can you "View Source" to see your code?** If you right-click → "View Page Source," you'll see almost nothing — just the bare `index.html` with an empty `<div id="root"></div>` and a `<script>` tag. That's because View Source shows the *original HTML file as delivered by the server*, before any JavaScript has run. It does **not** re-render the page or execute scripts.

**How you actually see the real DOM:** Use **"Inspect" / DevTools → Elements tab** instead. This shows the **live, current DOM** — the actual state of the page after React (via JavaScript) has injected all your components into that `<div id="root">`. This is the fundamental difference: View Source = static file as sent by the server; Inspect/Elements = what the browser + JavaScript have built at this moment.

- `index.html` is the app's single, static entry point (SPA model).
- View Source shows the raw file *before* JS runs — looks nearly empty.
- DevTools → Elements shows the *live DOM* after React renders into it.

---

## App flow: `index.html` → `main.jsx` → `App.jsx`

The rendering flow works like a chain of hand-offs, each one setting up for the next:

1. **`index.html`** contains one meaningful element: `<div id="root"></div>`. This is just an empty container — a mounting point. It also loads `/src/main.jsx` via a `<script type="module">` tag.
2. **`main.jsx`** is the true entry point of your React code. It grabs that `root` div from the DOM, tells React "render my app starting here," and renders the `App` component into it (using `ReactDOM.createRoot(...).render(<App />)`).
3. **`App.jsx`** is where your actual UI is defined — it's the top-level component, and everything else you build (other components) gets nested inside it.

So the ownership boundary is: `index.html` sets up the empty stage, `main.jsx` is the stagehand that brings the actors on, and `App.jsx` (plus whatever you build inside it) is the actual performance.

**Why you're told not to touch `main.jsx` unless necessary:** it's boilerplate — its job (mount `App` into `root`) rarely needs to change. Almost all of your actual work — UI, logic, state — belongs in `App.jsx` and the components you create alongside it. Editing `main.jsx` unnecessarily risks breaking the one thing that gets your whole app on screen.

- `index.html` → empty `#root` div + loads `main.jsx`.
- `main.jsx` → mounts `<App />` into that `#root` div.
- `App.jsx` → where you actually build your UI.
- Leave `main.jsx` alone; build almost everything inside `App.jsx` and its child components.

---

## Why the default page has a dark background and centered text (CSS imports)

When you scaffold a Vite + React app, two CSS files come pre-linked:
- **`index.css`** — imported in `main.jsx`, applies global, app-wide styles (body background, default fonts, box-sizing resets, etc.).
- **`App.css`** — imported directly in `App.jsx` via `import './App.css'`, applies styles scoped to what's rendered inside `App`.

Even after you delete all the JSX content inside `App.jsx` and just render `<h1>Hello World!</h1>`, the dark background and centered layout persist — because those styles live in `index.css` (loaded globally through `main.jsx`) and in `App.css`'s body/container rules, not in the JSX markup itself. Removing JSX doesn't remove CSS; they're separate files, separately linked.

**Why delete the *contents* of the CSS files rather than the files themselves:** the `import './App.css'` and `import './index.css'` statements still exist in your JS files. If you delete the actual `.css` files but leave the import statements, Vite will throw a "failed to resolve import" error, since it can't find a file that no longer exists. Emptying the file's *contents* (leaving an empty but existing file) avoids that — the import still resolves successfully, it just imports nothing. This gives you a clean visual slate without breaking the project's file references.

- Two CSS files are pre-linked: `index.css` (global, via `main.jsx`) and `App.css` (via `App.jsx`).
- Deleting JSX doesn't remove styling — CSS is separate and still applied.
- Delete CSS file *contents*, not the files themselves, to avoid breaking `import` statements.
- This is how you get a true "blank slate" to start styling from scratch.

---

## The "ES7+ React/Redux/React-Native Snippets" VS Code extension

This is a **VS Code editor extension** (not part of React itself) that provides **code snippets** — short keyboard shortcuts that expand into common React boilerplate code, similar to how typing `!` in an HTML file and pressing Tab expands into a full HTML skeleton (via Emmet).

**Why it's recommended:** Writing a React component by hand every time — the import statement, the function definition, the return statement, the export — is repetitive boilerplate that doesn't require thought, just typing. This extension lets you type a short trigger (like `rafce`) and instantly generates that structure, so you can focus your typing effort on the actual logic/UI rather than retyping the same skeleton dozens of times a day. It's purely a productivity tool — it doesn't change how React works, it just saves keystrokes.

- It's a VS Code extension providing React boilerplate snippets.
- Works like Emmet's `!` shortcut, but for React component structure.
- Purely a productivity aid — doesn't affect React's actual behavior.

---

## "Everything in React is a component"

A **component** is simply a reusable, self-contained piece of UI — described as a JavaScript function that returns what should be displayed (JSX).

**Why this framing matters:** React's core mental model is compositional — small pieces combine into bigger pieces, which combine into even bigger pieces, all the way up. A single button can be a component. A form built from several inputs and that button is also a component. A whole page containing that form, a header, and a sidebar is *also* just a component — it's just a component that happens to render other components inside it.

This is a deliberate design choice, not just a naming convention: because every level of your UI — from a tiny icon to an entire page — follows the exact same rules (props in, JSX out), you only need to learn *one* mental model to reason about your entire application, regardless of scale. It's like nesting boxes: a small box fits inside a bigger box, which fits inside an even bigger box, but they're all still just "boxes" following the same rules.

- A component = a function returning JSX; the basic unit of a React UI.
- Small components combine into larger ones, and larger ones into full pages.
- Same rules apply at every scale — one mental model for the whole app.

---

## Component snippet shortcuts: `rafce`, `rfce`, `rfc`, `rafc`

These are shorthand triggers from the snippets extension mentioned above. Each generates a slightly different component skeleton:

- **`rfc`** — **R**eact **F**unctional **C**omponent. Generates a named function component with a `export default` at the end (export written separately, after the function).
- **`rafc`** — **R**eact **A**rrow **F**unction **C**omponent. Same idea, but the component is written as an arrow function (`const App = () => {...}`) instead of a `function` declaration, with export at the end.
- **`rfce`** — Same as `rfc`, but the **e**xport is written *inline* at the point of function declaration (`export default function App() {...}`) rather than as a separate line at the bottom.
- **`rafce`** — Same as `rafc`, but again with the export written inline as part of the `const App = () => {...}` — this is the most commonly used one, combining arrow-function style with inline default export.

**Why the difference matters (a little):** it's mostly stylistic — function declarations vs. arrow functions behave slightly differently around `this` binding (irrelevant for typical function components) and hoisting, but for standard components, all four produce a working component; teams usually just pick one style (often `rafce`) and stay consistent.

- `rfc`/`rfce` = function declaration style; `rafc`/`rafce` = arrow function style.
- The `e` suffix = export written inline vs. as a separate line at the bottom.
- Functionally near-identical — mostly a style/consistency choice.

---

## Default vs. non-default (named) exports

A JS/JSX file can share code with other files using **exports** — and there are two kinds, with different rules.

**Default export** (`export default App`):
- Only **one** default export is allowed per file.
- When importing, you can name it **anything you want** — `import Hello from './App'` works exactly the same as `import App from './App'`, because there's no ambiguity about *which* thing you're importing (there's only one default).
- No curly braces used in the import: `import App from './App'`.

**Named (non-default) export** (`export const Button = ...`):
- A file can have **multiple** named exports.
- When importing, you must use the **exact same name** it was exported with (you can rename it using `as`, but by default it must match), because the import statement needs to know *which* of possibly several exported things you want.
- Requires curly braces in the import: `import { Button } from './Button'`.

**Why this distinction exists:** default exports signal "this file's main, singular thing" — useful for components where a file *is* essentially that one component. Named exports signal "this file offers several utilities/values," and forcing exact names (unless aliased) prevents confusion about which one you're pulling in.

**VS Code tip:** if you type a name that matches an exported component and press the auto-import suggestion, VS Code will automatically add the correct `import` line for you at the top of the file.

- Default export: one per file, import name is flexible, no `{}`.
- Named export: multiple per file, import name must match (or be aliased), needs `{}`.
- Default = "this file's one main thing"; named = "a bundle of specific exports."

---

## Self-closing vs. paired (open/close) tags in JSX

JSX borrows XML-like strictness that plain HTML doesn't always enforce.

- **Paired (open/close) tags** — used when a tag can contain children: `<div>content</div>`. It must always have a matching closing tag; you cannot leave it open.
- **Self-closing tags** — used for elements that don't wrap any children, like `<img />` or a custom component with no children: `<MyComponent />`. The slash at the end signals "this tag closes itself, no content follows."

**The spacing rule:** in a self-closing tag, there must be **no space** between the last attribute (or tag name) and the closing `/>` in a way that breaks the syntax — e.g., `<img src="x.png"/>` is fine, but malformed spacing/missing slash (like an unclosed `<img>` in JSX, which HTML tolerates but JSX does not) will cause a compile error. Unlike regular HTML — which is forgiving and lets browsers guess what you meant — **JSX is compiled by a strict parser (Babel/esbuild)**, so every tag must be explicitly and correctly closed, one way or another, or the build fails outright.

- Paired tags wrap children and must always have a closing tag.
- Self-closing tags (`<Tag />`) are for elements/components with no children.
- JSX is strict — unlike HTML, a missing/malformed closing tag is a hard error, not a browser guess.

---

## React Fragment (`<></>`)

A Fragment is a way to **group multiple elements together without adding an extra node to the DOM**. Written as `<></>` (shorthand) or explicitly as `<React.Fragment></React.Fragment>`.

**Why it exists:** React's rule is that a component's `return` statement must return a **single root element** — you can't return two sibling elements side-by-side with nothing wrapping them. The obvious fix is wrapping them in a `<div>`, but that adds a real, visible DOM node you didn't actually want — which can mess up styling (extra wrapper affecting CSS layout/flex/grid) or semantics. A Fragment satisfies React's "one root element" rule *without* inserting anything into the actual rendered HTML — it's invisible in the final DOM.

**Example:**
```jsx
function App() {
  return (
    <>
      <h1>Title</h1>
      <p>Some text</p>
    </>
  )
}
```
Here, `<h1>` and `<p>` are siblings grouped only for React's sake — in the actual browser DOM, there's no wrapping element around them at all.

- Fragments group sibling elements to satisfy React's "single root" rule.
- Shorthand syntax: `<></>`.
- Unlike a `<div>`, a Fragment adds nothing to the actual rendered DOM.