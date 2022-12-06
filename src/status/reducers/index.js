import { combineReducers } from 'redux';
import favReducer from '@/status/reducers/favReducer';
import postsReducer from '@/status/reducers/postsReducer';

const rootReducer = combineReducers({
    favReducer,
    postsReducer
});

export default rootReducer;
