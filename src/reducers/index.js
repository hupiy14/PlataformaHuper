import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import streamReducer from './streamReducer';
import chatReducer from './chatReducer';
import { user, contactsPage, settings } from './reducersChat';

export default combineReducers({
    auth: authReducer,
    form: formReducer,
    streams: streamReducer,
    user,
    contactsPage,
    settings,
    chatReducer
});


