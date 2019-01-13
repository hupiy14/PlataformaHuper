import {
    CHAT_ON,
    CHAT_OFF,
    CHAT_UBI
} from '../components/modules/chatBot/types';


const INITIAL_STATE = {
    isChat: null,
    isChatUbi: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHAT_ON:
            return { ...state, isChat: true };
        case CHAT_OFF:
            return { ...state, isChat: false };
        case CHAT_UBI:
            return { ...state, isChatUbi: action.payload };
        default:
            return state;

    }
};