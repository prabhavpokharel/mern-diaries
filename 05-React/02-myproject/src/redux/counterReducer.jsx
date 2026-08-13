const initialData = { count: 0}

export const counterReducer = (state = initialData, action) => {
    // action = {type: 'INCREASE_COUNT'}
    switch(action.type){
        case 'INCREASE_COUNT':
            return {count: ++state.count}

        case 'DECREASE_COUNT':
            return {count: --state.count}

        case 'RESET_COUNT':
            return {count: 0}

        default:
            return state;
    }
    return state;
}