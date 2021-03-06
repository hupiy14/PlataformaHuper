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
  TIPO_PREGUNTA,
  LISTA_FORMACIONES,
  LISTA_OBJETIVOS,
  PRIORIDAD_OBJ,
  POPUP_DETALLE,
  NUMERO_TAREASTERMINADAS,
  CONSULTA_MENSAJES,
  CONSULTA_CANALES,
  EQUIPO_CONSULTA,
  NUEVO_USUARIO,
  PASO_ONBOARDING,
  VER_EQUIPO,
  SELEC_OBJETIVO,
  AVATARES,
  PREGUNTA_FANTASMA,
  DETAIL_US_NEW,
  INPUT_DINAMICO,
  PRIMERA_VEZ,
  VALOR_TEXT,
  INPUT_SLACK,
  MENSAJESL,
  MENSAJEVIELY,
  ESTADO_CHAT,
  OBJ_TIM,
  DATO_CLOSE,
  CEL_CHAT,
  CEL_PERF,
  DATOS_EDIT_CEL,

} from './types';

export const datosEditCels = (datosEditCel) => {
  return {
    type: DATOS_EDIT_CEL,
    payload: datosEditCel
  };
};
export const datoCloses = (datoClose) => {
  return {
    type: DATO_CLOSE,
    payload: datoClose
  };
};
export const celPerfs = (celPerf) => {
  return {
    type: CEL_PERF,
    payload: celPerf
  };
};
export const celChats = (celChat) => {
  return {
    type: CEL_CHAT,
    payload: celChat
  };
};
export const objTIMs = (objTIM) => {
  return {
    type: OBJ_TIM,
    payload: objTIM
  };
};
export const estadochats = (estadochat) => {
  return {
    type: ESTADO_CHAT,
    payload: estadochat
  };
};
export const MensajeIvilys = (MensajeIvily) => {
  return {
    type: MENSAJEVIELY,
    payload: MensajeIvily
  };
};

export const Mslacks = (Mslack) => {
  return {
    type: MENSAJESL,
    payload: Mslack
  };
};

export const inputSlacks = (inputSlack) => {
  return {
    type: INPUT_SLACK,
    payload: inputSlack
  };
};

export const ValorTextos = (ValorTexto) => {
  return {
    type: VALOR_TEXT,
    payload: ValorTexto
  };
};

export const primeraVs = (primeraV) => {
  return {
    type: PRIMERA_VEZ,
    payload: primeraV
  };
};

export const inputDinamicos = (inputDinamico) => {
  return {
    type: INPUT_DINAMICO,
    payload: inputDinamico
  };
};

export const detailUsNews = (detailUsNew) => {
  return {
    type: DETAIL_US_NEW,
    payload: detailUsNew
  };
};
export const verEquipos = (verEquipo) => {
  return {
    type: VER_EQUIPO,
    payload: verEquipo
  };
};
export const avatares = (avatar) => {
  return {
    type: AVATARES,
    payload: avatar
  };
};

export const pregFantasmas = (pregFantasma) => {
  return {
    type: PREGUNTA_FANTASMA,
    payload: pregFantasma
  };
};
export const selObjetivos = (selObjetivo) => {
  return {
    type: SELEC_OBJETIVO,
    payload: selObjetivo
  };
};
export const pasoOnboardings = (pasoOnboarding) => {

  return {
    type: PASO_ONBOARDING,
    payload: pasoOnboarding
  };
};
export const nuevoUsuarios = (nuevoUsuario) => {

  return {
    type: NUEVO_USUARIO,
    payload: nuevoUsuario
  };
};

export const equipoConsultas = (equipoConsulta) => {

  return {
    type: EQUIPO_CONSULTA,
    payload: equipoConsulta
  };
};

export const consultaCanales = (consultaCanal) => {

  return {
    type: CONSULTA_CANALES,
    payload: consultaCanal
  };
};
export const consultaMensajes = (consultaMensaje) => {

  return {
    type: CONSULTA_MENSAJES,
    payload: consultaMensaje
  };
};

export const consultaPreguntaControls = (consultaPreguntaControl) => {

  return {
    type: CONSULTA_PREG_CONTROL,
    payload: consultaPreguntaControl
  };
};

export const numeroTareasTs = (numeroTareasT) => {

  return {
    type: NUMERO_TAREASTERMINADAS,
    payload: numeroTareasT
  };
};


export const popupDetalles = (popupDetalle) => {

  return {
    type: POPUP_DETALLE,
    payload: popupDetalle
  };
};
export const prioridadObjs = (prioridadObj) => {

  return {
    type: PRIORIDAD_OBJ,
    payload: prioridadObj
  };
};
export const listaObjetivos = (listaObjetivo) => {

  return {
    type: LISTA_OBJETIVOS,
    payload: listaObjetivo
  };
};
export const listaFormaciones = (listaFormacion) => {

  return {
    type: LISTA_FORMACIONES,
    payload: listaFormacion
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
    participants: participants
  });
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
  dispatch({
    type: SET_ACTIVE_CHAT,
    participants: contactID
  });
};

export const submitMessage = (text, chatID, userID) => async dispatch => {


  dispatch({
    type: SUBMIT_MESSAGE,
    text: text,
    chatID: chatID,
    userID: userID
  });
};

export const startChat = (participants, chatId) => async dispatch => {
  //  const id = "Hup" + new Date().getTime();

  dispatch({
    type: START_CHAT,
    participants: participants,
    chatID: chatId
  })
};

export const endChat = (participants) => async dispatch => {
  dispatch({
    type: END_CHAT,
    participants: participants
  });
};

export const updateFilter = (filterString) => async dispatch => {
  dispatch({
    type: UPDATE_FILTER,
    filterString: filterString
  });
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