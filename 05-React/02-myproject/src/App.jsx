import './App.css'
import MyFirst, { Second, Third } from './MyFirst'

function App() {

  return (
    <>
      <h1>Hello World!</h1>
      <MyFirst></MyFirst>
      {/* <MyFirst/> */}

      <Second/>
      <Third/>
    </>
  )
}

export default App
