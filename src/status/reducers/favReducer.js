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

            const _old = state.ids;
            const _index = state.ids.findIndex((v) => v == action.id);
            _old.splice(_index, 1)

            return {
                ...state,
                ids: _old
            }
        default:
            return state
    }
};

