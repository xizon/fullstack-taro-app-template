import { ADD, MINUS } from '@/status/constants/counterActionTypes';

//initialize state
const initialState = {
    num: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD:
            return {
                ...state,
                num: state.num + 1
            }
        case MINUS:
            return {
                ...state,
                num: state.num - 1
            }
        default:
            return state
    }
};

