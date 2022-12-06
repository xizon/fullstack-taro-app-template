import { ADD, REMOVE } from '@/status/constants/favActionTypes';

//The Redux store has a method called `store.dispatch({ type: '...' })`.

export function add(id) {
    return {
        type: ADD,
        id: id
    }
}
export function remove(id) {
    return {
        type: REMOVE,
        id: id
    }
}
