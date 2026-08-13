import {createStore} from "redux";
import {counterReducer} from "./counterReducer";
import { Provider } from "react-redux";

export const myStore = createStore(counterReducer)

export const MyStoreProvider = ({ children }) => {
    return <Provider store = {myStore}>
        {children}
    </Provider>
}