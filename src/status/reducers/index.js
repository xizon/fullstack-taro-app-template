import { combineReducers } from 'redux';
import counterReducer from '@/status/reducers/counterReducer';
import postsReducer from '@/status/reducers/postsReducer';

const rootReducer = combineReducers({
    counterReducer,
    postsReducer
});

export default rootReducer;
