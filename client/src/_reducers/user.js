import { USER_AUTH } from '../_actions/types';


export default function (state = {}, action) {
    switch(action.type) {
        // ęśí íě¸
        case USER_AUTH:
            return { ...state, userData: action.payload }
        default:
            return state;
    }
}