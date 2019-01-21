import {
    SET_ACTIVE_CHAT,
    START_CHAT,
    END_CHAT,
    SUBMIT_MESSAGE, 
    UPDATE_FILTER,
    SET_THEME,
    CHAT_UBI,
    COLOR_THEME,
    IDCHAT,
    CONSULTA_PREGUNTA,
    NUMERO_PREGUNTA,
    VALOR_INPUT,
    MENSAJE_ENTRADA,
    CONSULTA_PREG_CONTROL,
    BORRAR_CHAT,
    CONSULTA_DB,
    TIPO_PREGUNTA
    
} from './types';

export const consultaPreguntaControls = (consultaPreguntaControl) => {

  return {
      type: CONSULTA_PREG_CONTROL,
      payload: consultaPreguntaControl
  };
};
export const tipoPreguntas = (tipoPreguntas) => {

  return {
      type: TIPO_PREGUNTA,
      payload: tipoPreguntas
  };
};


export const consultas = (consulta) => {

  return {
      type: CONSULTA_DB,
      payload: consulta
  };
};

export const borrarChats = (participants) => async dispatch => {
 
  dispatch({
  type: BORRAR_CHAT,
  participants: participants});
};

export const consultaChats = (consultaPregunta) => {

  return {
      type: CONSULTA_PREGUNTA,
      payload: consultaPregunta
  };
};

export const chatIdentifiador = (idChat) => {

  return {
      type: IDCHAT,
      payload: idChat
  };
};

export const mensajeEntradas = (mensajeEntrada) => {

  return {
      type: MENSAJE_ENTRADA,
      payload: mensajeEntrada
  };
};

export const valorInputs = (valorInput) => {

  return {
      type: VALOR_INPUT,
      payload: valorInput
  };
};
export const numeroPreguntas = (numeroPregunta) => {

  return {
      type: NUMERO_PREGUNTA,
      payload: numeroPregunta
  };
};


export const setActiveChat = (contactID) => async dispatch => {
  console.log('active chat');
  dispatch({ 
    type: SET_ACTIVE_CHAT,
    participants: contactID} );
  };
  
  export const submitMessage = (text, chatID, userID) => async dispatch => {

    dispatch({ 
    type: SUBMIT_MESSAGE,
    text: text,
    chatID: chatID,
    userID: userID
   });
  };
  
  export const startChat = (participants) => async dispatch => {
    const id = "" + new Date().getTime();
    console.log('mira chat');
    console.log(participants);


    dispatch({
      type: START_CHAT,
      participants: participants,
      chatID: id
    })
  };
  
  export const endChat = (participants) => async dispatch => {
    console.log('mira termino');
    console.log(participants);
    dispatch({
    type: END_CHAT,
    participants: participants});
  };
  
  export const updateFilter = (filterString) => async dispatch => {
    dispatch({ type: UPDATE_FILTER,
    filterString: filterString });
  };
  
  

  export const setTheme = theme => async dispatch => {  
    dispatch({ type: SET_THEME, theme });
  
};

export const setUbicacion = ubicacion => async dispatch => { 
  
  dispatch({ type: CHAT_UBI, payload: ubicacion });

};

export const setColorTheme = Color => async dispatch => { 
  
  dispatch({ type: COLOR_THEME, payload: Color });

};