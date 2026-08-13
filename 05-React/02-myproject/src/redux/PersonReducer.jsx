const initialData = {
    name: 'Ram',
    age: 32
}

export const PersonReducer = (state = initialData, action) => {
    switch(action.type){
        case "UPDATE_NAME":
            return { ...state, name: action.payload }

        case "UPDATE_AGE":
            return { age: action.payload, name: state.name }

        default:
            return state
    }
}