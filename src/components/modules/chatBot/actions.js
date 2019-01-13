import {
    SET_ACTIVE_CHAT,
    START_CHAT,
    END_CHAT,
    SUBMIT_MESSAGE, 
    UPDATE_FILTER,
    SET_THEME,
    CHAT_UBI
    
} from './types';

export const setActiveChat = (contactID) => ({
    type: SET_ACTIVE_CHAT,
    participants: contactID
  });
  
  export const submitMessage = (text, chatID) => ({
    type: SUBMIT_MESSAGE,
    text: text,
    chatID: chatID
  });
  
  export const startChat = (participants) => {
    const id = "" + new Date().getTime();
    return {
      type: START_CHAT,
      participants: participants,
      chatID: id
    }
  };
  
  export const endChat = (participants) => ({
    type: END_CHAT,
    participants: participants
  });
  
  export const updateFilter = (filterString) => ({
    type: UPDATE_FILTER,
    filterString: filterString
  });
  
  

  export const setTheme = theme => async dispatch => {  
    dispatch({ type: SET_THEME, theme });
  
};

export const setUbicacion = ubicacion => async dispatch => { 
  
  dispatch({ type: CHAT_UBI, payload: ubicacion });

};