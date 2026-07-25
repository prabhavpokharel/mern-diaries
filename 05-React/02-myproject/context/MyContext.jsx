import { createContext } from "react";

export const MyContext = createContext()

export const MyContextProvider = ({children}) => {
    return <MyContext.Provider value={'Good Afternoon'}>
        {children}
    </MyContext.Provider>
}