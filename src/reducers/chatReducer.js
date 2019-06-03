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
    TIPO_PREGUNTA,
    LISTA_FORMACIONES,
    LISTA_OBJETIVOS,
    PRIORIDAD_OBJ,
    POPUP_DETALLE,
    NUMERO_TAREASTERMINADAS,
    USUARIO_DETAIL,
    CONSULTA_MENSAJES,
    CONSULTA_CANALES,
    EQUIPO_CONSULTA,
    NUEVO_USUARIO,
    PASO_ONBOARDING,
    VER_EQUIPO,
    SELEC_OBJETIVO,
    AVATARES,
    DETAIL_US_NEW,
    PREGUNTA_FANTASMA,
    INPUT_DINAMICO,
    PRIMERA_VEZ,
    VALOR_TEXT,
    INPUT_SLACK,
    MENSAJESL,
    ESTADO_CHAT,
    MENSAJEVIELY,
    OBJ_TIM,

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
    tipoPregunta: null,
    listaFormacion: null,
    listaObjetivo: null,
    prioridadObj: 0,
    popupDetalle: null,
    numeroTareasTerminadas: 0,
    usuarioDetail: null,
    consultaMensaje: [],
    consultaCanal: null,
    equipoConsulta: null,
    nuevoUsuario: null,
    pasoOnboarding: 0,
    verEquipo: false,
    selObjetivo: null,
    avatar: null,
    pregFantasma: null,
    detailUsNew: null,
    inputdinamico: null,
    primeraV: null,
    ValorTexto: [],
    inputSlack: null,
    Mslack: null,
    estadochat: null,
    MensajeIvily: null,
    objTIM: null,

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
        case LISTA_FORMACIONES:
            return { ...state, listaFormacion: action.payload };
        case LISTA_OBJETIVOS:
            return { ...state, listaObjetivo: action.payload };
        case PRIORIDAD_OBJ:
            return { ...state, prioridadObj: action.payload };
        case POPUP_DETALLE:
            return { ...state, popupDetalle: action.payload };
        case NUMERO_TAREASTERMINADAS:
            return { ...state, numeroTareasTerminadas: action.payload };
        case USUARIO_DETAIL:
            return { ...state, usuarioDetail: action.payload };
        case CONSULTA_MENSAJES:
            return { ...state, consultaMensaje: action.payload };
        case CONSULTA_CANALES:
            return { ...state, consultaCanal: action.payload };
        case EQUIPO_CONSULTA:
            return { ...state, equipoConsulta: action.payload };
        case NUEVO_USUARIO:
            return { ...state, nuevoUsuario: action.payload };
        case PASO_ONBOARDING:
            return { ...state, pasoOnboarding: action.payload };
        case VER_EQUIPO:
            return { ...state, verEquipo: action.payload };
        case SELEC_OBJETIVO:
            return { ...state, selObjetivo: action.payload };
        case AVATARES:
            return { ...state, avatar: action.payload };
        case PREGUNTA_FANTASMA:
            return { ...state, pregFantasma: action.payload };
        case DETAIL_US_NEW:
            return { ...state, detailUsNew: action.payload };
        case INPUT_DINAMICO:
            return { ...state, inputdinamico: action.payload };
        case INPUT_SLACK:
            return { ...state, inputSlack: action.payload };
        case VALOR_TEXT:
            return { ...state, ValorTexto: action.payload };
        case MENSAJESL:
            return { ...state, Mslack: action.payload };
        case ESTADO_CHAT:
            return { ...state, estadochat: action.payload };
        case MENSAJEVIELY:
            return { ...state, MensajeIvily: action.payload };
        case OBJ_TIM:
            return { ...state, objTIM: action.payload };
        case PRIMERA_VEZ:
            return { ...state, primeraV: action.payload };
        default:
            return state;

    }
};