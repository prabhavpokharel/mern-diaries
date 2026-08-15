# React.js — Day 3: React Router & Page Layouts

---

## Setup

Install the Tailwind CSS IntelliSense extension in VS Code — it gives you autocomplete for Tailwind classes as you type. Worth doing before anything else.

Install React Router:

```bash
npm install react-router-dom
```

React Router lets you create multiple "pages" in a React SPA without the browser ever actually loading a new HTML file. The URL changes, the content changes — but it's all the same single page running in the browser.

---

## Folder Structure

```text
src/
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Services.jsx
│   ├── Contact.jsx
│   └── NotFound.jsx
├── layout/
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── Layout.jsx
├── MyRoutes.jsx
├── App.jsx
└── main.jsx
```

Pages are just components that represent an entire screen. Use `rafce` boilerplate inside each one.

---

## Basic Routing — `MyRoutes.jsx`

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'

const MyRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/services' element={<Services />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}

export default MyRoutes
```

### What each part does

| Part | Meaning |
| ------ | --------- |
| `<BrowserRouter>` | Enables routing for everything inside it. Watches the browser's URL bar and passes location info down to child components. |
| `<Routes>` | Container for all route definitions. Looks at the current URL and renders the first `<Route>` that matches. |
| `<Route path='/' element={<Home />} />` | When the URL is exactly `/`, render `<Home />`. |
| `<Route path='/about' element={<About />} />` | When the URL is `/about`, render `<About />`. Same logic for the rest. |

The browser never actually navigates to a new page. React Router intercepts URL changes and swaps which component is displayed.

### Where to put `<BrowserRouter>`

The example above wraps it inside `MyRoutes.jsx`. That works fine. In real projects, the more common pattern is putting `<BrowserRouter>` in `main.jsx` wrapping the entire app — so routing context is available everywhere from the start:

```jsx
// main.jsx
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
```

Both approaches work. Knowing both helps when reading other people's code.

---

## `<Link>` vs `<NavLink>` — Client-Side Navigation

Never use a regular `<a href="...">` tag for internal navigation in React. It causes a full browser reload, which defeats the entire point of a SPA.

Use `<Link>` from React Router instead:

```jsx
import { Link } from 'react-router-dom'

<Link to='/about'>About</Link>   // ✅ No reload — swaps component instantly
<a href='/about'>About</a>       // ❌ Full page reload
```

### `<NavLink>` — for navigation menus

`<NavLink>` works exactly like `<Link>` but automatically applies an `active` class when its `to` matches the current URL. You need this the moment you want to highlight which nav item is currently selected.

```jsx
import { NavLink } from 'react-router-dom'

<NavLink
  to='/about'
  className={({ isActive }) => isActive ? 'text-white font-bold' : 'text-gray-400'}
>
  About
</NavLink>
```

`className` accepts a function that receives `{ isActive }` — use it to return different classes depending on whether the link is active. Use `<NavLink>` in headers and sidebars, `<Link>` everywhere else.

---

## 404 Page — `NotFound.jsx`

```jsx
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='flex flex-col justify-center items-center h-[80vh] text-2xl text-center'>
      <h1>404 - PAGE NOT FOUND</h1>
      <Link to='/' className='block mt-4 text-blue-500 hover:underline'>Go Home</Link>
    </div>
  )
}

export default NotFound
```

Registered with `path='*'` — matches any URL that didn't match a defined route. Must always be the **last route defined** (covered below).

**Tailwind note:** `h-[80vh]` uses an arbitrary value in square brackets — Tailwind lets you use any valid CSS value this way when no utility class exists for it.

---

## Layout Pattern — Header + Footer on Every Page

Instead of importing `<Header>` and `<Footer>` into every single page, you create one `Layout` component that wraps all pages. Header and Footer are defined once. Only the middle content changes per route.

### `Layout.jsx`

```jsx
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
      <Header />
      <div className="min-h-[80vh]">
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default Layout
```

### What is `<Outlet>`?

`<Outlet>` is a placeholder that tells React Router: *"render the matched child route's component here."*

Think of Layout as a picture frame. The Header and Footer are the frame. `<Outlet>` is the hole in the middle where each page's content appears. The frame never changes — only what's inside the hole does.

---

## Routes with Layout Applied

```jsx
<BrowserRouter>
  <Routes>
    <Route element={<Layout />}>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/services' element={<Services />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='*' element={<NotFound />} />
    </Route>
  </Routes>
</BrowserRouter>
```

`<Route element={<Layout />}>` has no `path`. It's not a URL rule — it's a wrapper. Every child route inside it renders within Layout's `<Outlet>`.

### Why `path='*'` must be last

React Router v6 matches routes in the order they're defined. If `path='*'` were listed first, it would match every URL and nothing else would ever render. Always put the catch-all last.

### What visiting `/about` actually renders

```text
<Layout>
  <Header />
  <div>
    <About />    ← Outlet renders this
  </div>
  <Footer />
</Layout>
```

---

## Nested Routes Go Deeper Than This

The layout pattern is the most common use of nesting, but it scales further. A `/products` route could have a `/products/:id` child route that renders a product detail view inside the products layout — the same `<Outlet>` mechanism handles it at any depth. You don't need this now, but the pattern is the same.

---

## Visual Flow

```text
URL: /about

BrowserRouter detects URL change
  → passes to Routes
  → Routes matches /about → <About />
  → /about is nested inside <Layout />

Layout renders:
  → <Header />
  → <Outlet />   ← <About /> renders here
  → <Footer />
```

---

## HTML Entities in JSX

JSX is strict about certain characters. `<` and `>` break JSX because they're used for tags. Use HTML entities for characters that would otherwise be parsed as JSX syntax:

| Character | Entity |
| ----------- | -------- |
| `<` | `&lt;` |
| `>` | `&gt;` |
| `&` | `&amp;` |
| `"` | `&quot;` |
| `©` | `&copy;` |
| `→` | `&rarr;` |

```jsx
<p>5 &lt; 10 and 10 &gt; 5</p>
// Renders as: 5 < 10 and 10 > 5
```

---

## How It All Connects

```text
App.jsx
  └── <MyRoutes />

MyRoutes.jsx
  └── <BrowserRouter>
        └── <Routes>
              └── <Route element={<Layout />}>   ← wrapper, no path
                    ├── path='/'         → <Home />
                    ├── path='/about'    → <About />
                    ├── path='/services' → <Services />
                    ├── path='/contact'  → <Contact />
                    └── path='*'         → <NotFound />  ← always last

Layout.jsx
  └── <Header />
  └── <Outlet />   ← matched page component renders here
  └── <Footer />
```

Header and Footer render once regardless of which route is active. Only the `<Outlet>` content changes. That's the layout pattern — define shared UI once, reuse it across every page.
