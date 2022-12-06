import { ADD, REMOVE } from '@/status/constants/favActionTypes';

//initialize state
const initialState = {
    ids: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD:

            state.ids.push(action.id);

            return {
                ...state,
                ids: Array.from(new Set(state.ids))
            }
        case REMOVE:

            state.ids = state.ids.filter( item => item != action.id);

            return {
                ...state,
                ids: state.ids
            }
        default:
            return state
    }
};

