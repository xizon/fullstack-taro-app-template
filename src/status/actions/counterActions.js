import { ADD, MINUS } from '@/status/constants/counterActionTypes';

//The Redux store has a method called `store.dispatch({ type: '...' })`.

export function add() {
    return {
        type: ADD
    }
}
export function minus() {
    return {
        type: MINUS
    }
}
