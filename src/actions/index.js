//import huper from '../apis/huperDB';
import history from '../history';
import {
    SIGN_IN,
    SIGN_OUT
 //   CREATE_STREAM
} from './types';

import {
    CHAT_ON,
    CHAT_OFF
} from '../components/modules/chatBot/types';
export const signIn = (userId) => {
    return {
        type: SIGN_IN,
        payload: userId
    };
};

export const signOut = () => {
    return {
        type: SIGN_OUT
    };
};

export const chatOn = () => {
 //   history.push('/dashboard');
    return {
        type: CHAT_ON
    };
};
export const chatOff = () => {
   // history.push('/dashboard');
    return {
        type: CHAT_OFF
    };
};
export const createStream = formValues => async (dispatch, getState) => {
    /*const { userId } = getState().auth;
    const response = await streams.post('/streams', {...formValues, userId });
    dispatch({ type: CREATE_STREAM, payload: response.data });
    history.push('/');*/
};

