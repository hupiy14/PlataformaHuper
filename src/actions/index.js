/**actions  formulario usuario login */
import SlackApiss from '../apis/slackApi';
import {
    SIGN_IN,
    SIGN_OUT,
    ON_MESSAGE,
    END_CHAT,
    POPUP_MENSAJE,
    MENSAJE_CHAT, 
    ASANA,
    ACTIVIDAD_PRINCIPAL,
    ACTIVIDAD_PROGRAMA,
    IMAGEN_OKR,
    IMAGEN_FONDO, 
    HOME_APP, 
    SIGN_OUT_OBJ,
    W_SCREEN
} from './types';

import {
    CHAT_ON,
    CHAT_OFF,
    NOMBRE_USER,
    USUARIO_DETAIL,
} from '../components/modules/chatBot/types';

export const screenWH = (wh) =>(
    {
        type: W_SCREEN,
        payload: wh
    }
)

export const homeApp = (home) =>(
    {
        type: HOME_APP,
        payload: home
    }
)

export const changeImage = (changeI) =>(
    {
        type: IMAGEN_FONDO,
        payload: changeI
    }
)
export const endChatMes = (text) =>(
    {
        type: END_CHAT,
        payload: text
    }
)


export const sendMessage = (text) =>(
    {
        type: ON_MESSAGE,
        payload: text
    }
)


export const signIn = (userId) => {
  
    return {
        type: SIGN_IN,
        payload: userId
    };
};

export const slackApis = () => async dispatch => {
   return await SlackApiss.get().then((response) => { console.log(response); });
    // const response = await SlackApis.get();
    // console.log(response);
    // dispatch({ type: SLACKAPI, payload: response.data });
};

export const actividadProgramas = (actividad) => {

    return {
        type: ACTIVIDAD_PROGRAMA,
        payload: actividad
    };
};

export const actividadPrincipal = (actividad) => {

    return {
        type: ACTIVIDAD_PRINCIPAL,
        payload: actividad
    };
};

export const mensajeAsanas = (code) => {

    return {
        type: ASANA,
        payload: code
    };
};

export const imagenOKRs = (imagenOKR) => {

    return {
        type: IMAGEN_OKR,
        payload: imagenOKR
    };
};
export const usuarioDetails = (usuarioDetail) => {

    return {
        type: USUARIO_DETAIL,
        payload: usuarioDetail
    };
};

export const popupBot = (mensaje) => {

    return {
        type: POPUP_MENSAJE,
        payload: mensaje
    };
};


export const mensajeChat = (mensaje) => {

    return {
        type: MENSAJE_CHAT,
        payload: mensaje
    };
};

export const nombreUsuario = (nombreUser) => {

    return {
        type: NOMBRE_USER,
        payload: nombreUser
    };
};

export const signOut = () => {
    return {
        type: SIGN_OUT
    };
};

export const Singauth = (obj) => {
    return {
        type: SIGN_OUT_OBJ,
        payload: obj
    };
};

export const chatOn = () => {
    return {
        type: CHAT_ON
    };
};
export const chatOff = () => {
    return {
        type: CHAT_OFF
    };
};

