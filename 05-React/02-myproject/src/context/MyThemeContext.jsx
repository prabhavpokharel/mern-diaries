import React, { createContext, useState } from 'react'

export const MyThemeContext = createContext()

export const MyThemeContextProvider = ({children}) => {
    let [theme, setTheme] = useState('light')
  return (
    <MyThemeContext.Provider value={{theme, setTheme}}>
        {children}
    </MyThemeContext.Provider>
  )
}