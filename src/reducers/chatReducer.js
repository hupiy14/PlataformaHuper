import {
    CHAT_ON,
    CHAT_OFF,
    CHAT_UBI,
    COLOR_THEME,
    USER_ROL,
    NOMBRE_USER,
    NUMERO_PREGUNTA,
    IDCHAT,
    CONSULTA_PREGUNTA,
    VALOR_INPUT,
    MENSAJE_ENTRADA,
    CONSULTA_PREG_CONTROL,
    CONSULTA_DB,
    TIPO_PREGUNTA

} from '../components/modules/chatBot/types';
import firebase from 'firebase';
import { config } from '../apis/huperDB';

const INITIAL_STATE = {
    isChat: null,
    isChatUbi: null,
    isColorTheme: null,
    userRol: null,
    nombreUser: null,
    numeroPregunta: 1,
    idChatUser: null,
    consultaPregunta: null,
    valorInput: null,
    mensajeEnt: true,
    consultaPreguntaControl: 1,
    consultax: null,
    tipoPregunta: null
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
        case NOMBRE_USER:
            return { ...state, nombreUser: action.payload };
        case NUMERO_PREGUNTA:
            return { ...state, numeroPregunta: action.payload };
        case CONSULTA_PREGUNTA:
            return { ...state, consultaPregunta: action.payload };
        case IDCHAT:
            return { ...state, idChatUser: action.payload };
        case VALOR_INPUT:
            return { ...state, valorInput: action.payload };
        case MENSAJE_ENTRADA:
            return { ...state, mensajeEnt: action.payload };
        case CONSULTA_PREG_CONTROL:
            return { ...state, consultaPreguntaControl: action.payload };
        case CONSULTA_DB:
            return { ...state, consultax: action.payload };
        case TIPO_PREGUNTA:
            return { ...state, tipoPregunta: action.payload };

        default:
            return state;

    }
};