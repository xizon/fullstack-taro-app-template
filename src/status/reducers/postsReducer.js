import { GET_POSTS } from '@/status/constants/postsActionTypes';

//initialize state
const initialState = {
    items: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_POSTS:
            return { 
                ...state,
                items: action.payload 
            };
        default:
            return state
    }
};

