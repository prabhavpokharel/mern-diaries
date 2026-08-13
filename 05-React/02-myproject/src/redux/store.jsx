import {combineReducers, createStore} from "redux";
import {counterReducer} from "./counterReducer";
import { Provider } from "react-redux";
import { PersonReducer } from "./PersonReducer";

// export const myStore = createStore(counterReducer)
// export const myStore = createStore(PersonReducer)

const rootReducer = combineReducers({
    counterStore: counterReducer,
    personStore: PersonReducer
})

export const myStore = createStore(rootReducer)

export const MyStoreProvider = ({ children }) => {
    return <Provider store = {myStore}>
        {children}
    </Provider>
}