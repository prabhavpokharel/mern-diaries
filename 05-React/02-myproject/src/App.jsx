import './App.css'
import First from './components/First'
import Second from './components/Second'
// import MyFirst, { Second, Third } from './MyFirst'
import './myStyle.css'

function App() {

  return (
    <>
      <h1>Hello World!</h1>
      {/* <MyFirst></MyFirst> */}
      {/* <MyFirst/> */}

      {/* <Second/>
      <Third/> */}

      <First/>
      <Second/>
    </>
  )
}

export default App
