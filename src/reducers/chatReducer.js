import {
    CHAT_ON,
    CHAT_OFF,
    CHAT_UBI,
    COLOR_THEME,
    USER_ROL
} from '../components/modules/chatBot/types';
import firebase from 'firebase';
import { config } from '../apis/huperDB';

const INITIAL_STATE = {
    isChat: null,
    isChatUbi: null,
    isColorTheme: null,
    userRol: null
};


firebase.initializeApp(config);

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHAT_ON:
            return { ...state, isChat: true };
        case CHAT_OFF:
            return { ...state, isChat: false };
        case CHAT_UBI:
            return { ...state, isChatUbi: action.payload };
        case COLOR_THEME:
            return { ...state, isColorTheme: action.payload };
        case USER_ROL:
            return { ...state, userRol: action.payload };

        default:
            return state;

    }
};