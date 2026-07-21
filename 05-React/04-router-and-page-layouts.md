# React Router & Page Layouts

---

## Setup

Install the Tailwind CSS IntelliSense extension in VS Code — it gives you autocomplete for Tailwind classes as you type. Essential.

Install React Router:

```bash
npm install react-router-dom
```

React Router lets you create multiple "pages" in a React SPA without the browser ever actually loading a new HTML file. The URL changes, the content changes — but it's all the same single page.

---

## Folder Structure

```
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

Each page file gets a `rafce` boilerplate inside it. Think of pages as the big components that represent an entire screen.

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

### What each line means

| Part | Meaning |
|------|---------|
| `<BrowserRouter>` | Enables routing for everything inside it. Uses the browser's URL bar to track location. Wraps everything. |
| `<Routes>` | The container for all your route definitions. Only renders the first `<Route>` that matches the current URL. |
| `<Route path='/' element={<Home />} />` | When the URL is `/`, render the `Home` component. |
| `<Route path='/about' element={<About />} />` | When the URL is `/about`, render `About`. Same logic for others. |

The browser never actually navigates to a new page. React Router just swaps out which component is displayed based on the URL.

---

## The `Link` Component — Client-Side Navigation

Never use a regular `<a href="...">` tag for internal navigation in React. It causes a full browser reload, defeating the purpose of a SPA.

Use `<Link>` from React Router instead:

```jsx
import { Link } from 'react-router-dom'

<Link to='/about'>About</Link>         // ✅ No reload
<a href='/about'>About</a>             // ❌ Full page reload
```

`Link` updates the URL and swaps the component — instantly, no reload.

---

## 404 Page — `NotFound.jsx`

```jsx
import React from 'react'
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

This renders whenever someone visits a URL that doesn't match any defined route. Registered using `path='*'` which means "match anything not already matched."

**Tailwind note:** `h-[80vh]` uses a custom value in square brackets — Tailwind lets you use any arbitrary CSS value this way.

---

## Layout Pattern — Header + Footer on Every Page

Instead of importing `<Header>` and `<Footer>` into every single page component, you create one `Layout` component that wraps all pages. This is the standard approach.

### `Layout.jsx`

```jsx
import React from 'react'
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

`Outlet` is a placeholder. It says: *"wherever I am, render the child route's component here."*

Think of Layout as a picture frame — the Header and Footer are the frame, and `<Outlet>` is the hole in the middle where each page's content appears.

When you visit `/about`, the frame stays fixed and `<Outlet>` fills in with the `About` component. When you visit `/contact`, the same frame stays and `<Outlet>` shows `Contact`.

---

## Updated Routes with Layout

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

### How it works

`<Route element={<Layout />}>` has no `path`. It's not a URL rule — it's a wrapper. Every child route inside it gets rendered *inside* Layout's `<Outlet>`.

So visiting `/about` renders:

```
<Layout>
  <Header />
  <div>
    <About />     ← Outlet fills this in
  </div>
  <Footer />
</Layout>
```

And `path='*'` catches every URL that didn't match anything above it — that's your 404.

---

## Visual Flow

```
URL: /about

BrowserRouter detects URL → passes to Routes
Routes finds matching Route → /about → <About />
But /about is nested inside <Layout />
So Layout renders first:
  → <Header />
  → <Outlet />  ← About.jsx renders here
  → <Footer />
```

---

## HTML Entities in JSX

JSX is strict about certain characters. Symbols like `<` and `>` break JSX because they're used for tags. Use HTML entities instead:

| Character | Entity |
|-----------|--------|
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

## Summary — How It All Connects

```
App.jsx
  └── <MyRoutes />

MyRoutes.jsx
  └── <BrowserRouter>
        └── <Routes>
              └── <Route element={<Layout />}>   ← wrapper, no path
                    ├── path='/'        → <Home />
                    ├── path='/about'   → <About />
                    ├── path='/services'→ <Services />
                    ├── path='/contact' → <Contact />
                    └── path='*'        → <NotFound />

Layout.jsx
  └── <Header />
  └── <Outlet />   ← whichever page matches, renders here
  └── <Footer />
```

Header and Footer render once. Only the middle content swaps based on the URL. That's the Layout pattern.