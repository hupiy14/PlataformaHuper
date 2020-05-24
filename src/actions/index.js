/**actions  formulario usuario login */
import SlackApiss from '../apis/slackApi';
import {
    SIGN_IN,
    SIGN_OUT,
    SLACKAPI,
    ON_MESSAGE,
    END_CHAT,
    POPUP_MENSAJE,
    MENSAJE_CHAT
} from './types';

import {
    CHAT_ON,
    CHAT_OFF,
    NOMBRE_USER,
    USUARIO_DETAIL,

} from '../components/modules/chatBot/types';
import firebase from 'firebase';


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
    escribirUsuario(userId);
    return {
        type: SIGN_IN,
        payload: userId
    };
};

export const slackApis = () => async dispatch => {
    const response = await SlackApiss.get().then((response) => { console.log(response); });
    // const response = await SlackApis.get();
    // console.log(response);
    // dispatch({ type: SLACKAPI, payload: response.data });
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

const escribirUsuario = (userId) => {
    var newPostKey2 = firebase.database().ref().child('Preguntas-Chat').push().key; 
    const starCountRef = firebase.database().ref().child(`Preguntas-Chat/-LXt_TDJQilcvBxWh955`);
    starCountRef.on('value', (snapshot) => {
    });
}