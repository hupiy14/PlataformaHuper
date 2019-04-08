import {
    SIGN_IN,
    SIGN_OUT,
    SLACKAPI,

} from '../actions/types';

const INITIAL_STATE = {
    isSignedIn: null,
    userId: null,
    slackApi: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SIGN_IN:
            return { ...state, isSignedIn: true, userId: action.payload };
        case SIGN_OUT:
            return { ...state, isSignedIn: false, userId: null };
        case SLACKAPI:
            return { ...state, slackApi: action.payload };
        default:
            return state;

    }
};