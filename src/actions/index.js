//import huper from '../apis/huperDB';
import history from '../history';
import {
    SIGN_IN,
    SIGN_OUT
    //   CREATE_STREAM
} from './types';

import {
    CHAT_ON,
    CHAT_OFF,
    USER_ROL
} from '../components/modules/chatBot/types';
import firebase from 'firebase';


export const signIn = (userId) => {
    escribirUsuario(userId);
    console.log(userId);
    return {
        type: SIGN_IN,
        payload: userId
    };
};



export const userRolIn = (userRol) => {
    return {
        type: USER_ROL,
        payload: userRol
    };
};

export const signOut = () => {
    console.log('Salio');
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

const escribirUsuario = (userId) => {


    //escribir
    //console.log('envio');
    //var newPostKey2 = firebase.database().ref().child('Usuario').push().key;
    //firebase.database().ref(`Usuario-Perfil/1` ).set({
    //    userId

    //});
    //leer todos
    var starCountRef = firebase.database().ref('users');
    starCountRef.on('value', function (snapshot) {
        console.log(snapshot.val());
    });



    // A post entry.
    var postData = {
        title: 'titulos 3',
        cambio: 'res'
    };

    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('users').child('104639443634977843265').push().key;
    console.log(newPostKey);
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/users/104639443634977843265'] = postData;

     firebase.database().ref().update(updates);


  
//https://firebase.google.com/docs/database/web/lists-of-data?hl=es-419


    /* leer uno
      const nameRef = firebase.database().ref().child('objeto').child('name');
         console.log(nameRef);
         nameRef.on('value', (snapshot) => {
             this.setState({
                 name: snapshot.val()
             })
         })
    */
}



export const createStream = formValues => async (dispatch, getState) => {
    /*const { userId } = getState().auth;
    const response = await streams.post('/streams', {...formValues, userId });
    dispatch({ type: CREATE_STREAM, payload: response.data });
    history.push('/');*/
};

