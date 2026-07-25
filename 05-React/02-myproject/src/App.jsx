import { MyContextProvider } from '../context/MyContext'
import { MyThemeContextProvider } from '../context/MyThemeContext'
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

      <MyThemeContextProvider>
        <MyContextProvider>
          <MyRoutes/>
        </MyContextProvider>
      </MyThemeContextProvider>

    </>
  )
}

export default App
