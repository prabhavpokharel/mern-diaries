# React.js — Day 9: Axios, Pagination, Loading State & useParams

---

## Axios

```bash
npm install axios
```

Axios is an HTTP client library — it does the same job as `fetch` but with a cleaner API and better defaults.

### fetch vs axios

| | `fetch` | `axios` |
|---|---------|---------|
| Built-in? | Yes — no install needed | No — requires `npm install` |
| Response parsing | Must call `.json()` manually | Parsed automatically — data is in `res.data` |
| Error on HTTP errors? | No — must check `res.ok` manually | Yes — throws on 4xx/5xx automatically |
| Request cancellation | Requires `AbortController` | Built-in support |
| Timeout support | Manual | Built-in |

```jsx
// fetch — manual JSON parsing, manual error checking
fetch(url)
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
    return res.json()
  })
  .then(data => console.log(data))

// axios — automatic JSON parsing, throws on HTTP errors
axios.get(url)
  .then(res => console.log(res.data))
```

For learning and small projects, `fetch` is fine. Axios is the more common choice in real codebases because of the automatic error handling and cleaner syntax. Know both.

---

## npm Messages to Stop Worrying About

### `npm fund`

```
39 packages are looking for funding
run `npm fund` for details
```

Package maintainers asking for donations. Has nothing to do with your code. Ignore it entirely.

### `npm audit` vulnerabilities

```
5 vulnerabilities (1 moderate, 4 high)
To address all issues, run: npm audit fix
```

`npm audit` scans your dependencies for known security issues. In practice:

- Vulnerabilities in **dev dependencies** (Vite, ESLint, test tools) almost never affect your running app — they're only used during development, not shipped to users
- Vulnerabilities in **dependencies** (packages that ship with your app) matter more and should be addressed
- Run `npm audit fix` when you want to auto-fix what's fixable. `npm audit fix --force` is more aggressive but can break things — read what it's about to do first

Don't panic every time you see audit warnings. Check whether the affected package is a `devDependency` or `dependency` first.

---

## Pagination with State

Instead of fetching a different page from the API, this pattern fetches all data once and controls how much of it is displayed using a `length` state variable.

```jsx
const DataFetch = () => {
  const [posts, setPosts] = useState([])
  const [length, setLength] = useState(20)

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(res => res.json())
      .then(data => setPosts(data.slice(0, length)))
  }, [length])

  return (
    <div className="p-5 shadow-lg">
      {posts.map((post, i) => (
        <div key={i}>
          <h3>
            <Link to={`/post/${post.id}`}>
              {post.id}. {post.title}
            </Link>
          </h3>
        </div>
      ))}

      {length >= 100 ? (
        <p>All data loaded.</p>
      ) : (
        <button className="btn btn-primary" onClick={() => setLength(length + 20)}>
          Show More
        </button>
      )}

      {length > 20 && (
        <button className="btn btn-danger" onClick={() => setLength(length - 20)}>
          Show Less
        </button>
      )}
    </div>
  )
}
```

**How it works:** `length` is in the dependency array of `useEffect`. Every time the user clicks Show More or Show Less, `length` changes, the effect re-runs, and `data.slice(0, length)` cuts the fetched array to the new size. No additional network requests — the full dataset is already in memory.

**Note on the original code:** The original conditional had the logic inverted — it showed "All data loaded" and the Show More button together when length was below 100 (meaning there was still more to show), and the disabled button when length was 100+. The corrected version above shows "All data loaded" only when all data actually is loaded (`length >= 100`).

**Note on `key`:** The original uses `index` (`i`) as key. This is acceptable here because the list is append-only — items are never reordered or removed mid-list. If items could be deleted or reordered, use `post.id` instead.

---

## Loading State — Pattern and Component

Whenever you're waiting for async data, you need a loading state to avoid showing broken or empty UI while the request is in flight.

### The Pattern

```jsx
const [data, setData] = useState(null)
const [loading, setLoading] = useState(false)

useEffect(() => {
  setLoading(true)           // start loading before the request
  fetch(url)
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.error(err))
    .finally(() => setLoading(false))  // stop loading regardless of outcome
}, [])
```

**What `.finally()` does:** Runs after the promise either resolves or rejects — guaranteed. This is the right place to set `setLoading(false)` because it fires whether the fetch succeeded or failed. If you put `setLoading(false)` only in `.then()`, a failed request would leave the loading spinner on forever.

### Loading Component

```jsx
const Loading = () => {
  return (
    <div className="w-screen h-screen fixed top-0 left-0 z-50 flex justify-center items-center opacity-80 bg-blue-300">
      <div
        className="spinner-border"
        style={{ width: "6rem", height: "6rem" }}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}
```

`fixed top-0 left-0 w-screen h-screen` makes it cover the entire viewport. `z-50` puts it on top of everything else. The Bootstrap `spinner-border` class provides the spinning animation — this requires Bootstrap CSS to be loaded.

### Using It

```jsx
return loading ? <Loading /> : <div>...your actual content...</div>
```

A simple ternary: show the spinner while loading, show content when done.

---

## useParams — Reading URL Parameters

`useParams` is a React Router hook that reads dynamic segments from the current URL.

### Setup — the route must define the parameter

```jsx
<Route path='/post/:id' element={<Post />} />
```

The `:id` part is a **URL parameter** — a named placeholder that matches any value in that position. `/post/1`, `/post/42`, `/post/anything` all match this route.

### Reading the parameter in the component

```jsx
import { useParams } from 'react-router-dom'

const Post = () => {
  const params = useParams()
  const id = params.id

  // shorthand — same result
  const { id } = useParams()
}
```

`useParams()` returns an object where each key is a parameter name from the route definition. If your route is `/post/:id`, you get `{ id: "42" }` when the URL is `/post/42`.

**Important:** URL parameters are always strings. If you need a number, convert it: `Number(id)` or `parseInt(id)`.

### Using it with Axios to fetch a specific item

```jsx
const Post = () => {
  const { id } = useParams()
  const [post, setPost] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios
      .get(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return loading ? (
    <Loading />
  ) : (
    <div className="w-1/2 p-5 mx-auto my-5 shadow-lg">
      <h2>Post ID: {id}</h2>
      <h2>Title: {post.title}</h2>
      <p>{post.body}</p>
    </div>
  )
}
```

Notice `res.data` instead of calling `.json()` — that's axios automatically parsing the response.

---

## POST Requests and External APIs

The image generation component demonstrates making a POST request with custom headers and a JSON body — the pattern for calling most real-world APIs.

```jsx
const handleSubmit = (e) => {
  e.preventDefault()   // prevents form submission from reloading the page
  setLoading(true)

  const url = "https://chatgpt-42.p.rapidapi.com/texttoimage"
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": "YOUR_KEY_HERE",
      "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: { prompt },
      width: 512,
      height: 512,
    }),
  }

  fetch(url, options)
    .then(res => res.json())
    .then(data => setOutput(data.generated_image))
    .catch(err => console.error(err))
    .finally(() => setLoading(false))
}
```

`JSON.stringify()` converts the JavaScript object to a JSON string for the request body. `"Content-Type": "application/json"` tells the server what format you're sending.

### API Keys Do Not Belong in Source Code

The original code has the RapidAPI key hardcoded directly in the component. **This is a security problem.** Anyone who sees your code — including anyone who views your GitHub repo — can use that key and run up charges on your account.

API keys belong in environment variables:

```bash
# .env file in your project root
VITE_RAPIDAPI_KEY=your_actual_key_here
```

```jsx
// In your component
const apiKey = import.meta.env.VITE_RAPIDAPI_KEY
```

Vite exposes any environment variable prefixed with `VITE_` to your frontend code. The `.env` file goes in `.gitignore` — it never gets committed.

---

## Controlled Input — `onChange` Pattern

```jsx
const [prompt, setPrompt] = useState("")

<input
  type="text"
  onChange={(e) => setPrompt(e.target.value)}
  placeholder="Enter your text here"
/>
```

`e.target.value` is the current text in the input field. Every keystroke fires `onChange`, which updates state with the latest value. This is a **controlled input** — React state is the single source of truth for what's in the field. When you submit, `prompt` already holds whatever the user typed.

---

## Conditional Rendering — `output && <img />`

```jsx
{output && <img src={output} alt="" className="w-full" />}
```

`output` starts as `null`. When the API returns an image URL and `setOutput` is called, `output` becomes a string. Since a non-empty string is truthy, the `&&` evaluates the right side and renders the image. Before the API responds, `output` is `null` (falsy) and nothing renders.

This is the standard pattern for rendering something only after data exists.