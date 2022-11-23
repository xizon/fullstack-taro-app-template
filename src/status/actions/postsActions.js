
import { GET_POSTS } from '@/status/constants/postsActionTypes';

//The Redux store has a method called `store.dispatch({ type: '...' })`.

export function getPosts() {

    return {
        type: GET_POSTS
    }

}
