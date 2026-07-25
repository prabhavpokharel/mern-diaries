import { MyContextProvider } from '../context/MyContext'
import './App.css'
// import First from './components/First'
// import Second from './components/Second'
import MyRoutes from './MyRoutes'
// import MyFirst, { Second, Third } from './MyFirst'
import './myStyle.css'

function App() {

  return (
    <>
      {/* <h1>Hello World!</h1> */}
      {/* <MyFirst></MyFirst> */}
      {/* <MyFirst/> */}

      {/* <Second/>
      <Third/> */}

      {/* <First/>
      <Second/> */}

      <MyContextProvider>
        <MyRoutes/>
      </MyContextProvider>
    </>
  )
}

export default App
