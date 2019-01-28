//import huper from '../apis/huperDB';
//import history from '../history';
import {
    SIGN_IN,
    SIGN_OUT
    //   CREATE_STREAM
} from './types';

import {
    CHAT_ON,
    CHAT_OFF,
    USER_ROL,
    NOMBRE_USER,
    USUARIO_DETAIL,
   
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


export const usuarioDetails = (usuarioDetail) => {

    return {
        type: USUARIO_DETAIL,
        payload: usuarioDetail
    };
  };

export const nombreUsuario = (nombreUser) => {

    return {
        type: NOMBRE_USER,
        payload: nombreUser
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


    //escribir  108587547313274842109
    //console.log('envio');
    //remove()
    /*
    
    var newPostKey2 = firebase.database().ref().child('Empresa-Equipo/-LWBP-0bC5_TSsm79BjK').push().key;
    //var newPostKey2 = firebase.database().ref().child('Empresa-Equipo/114776566682864207914/-LWoWVihrbAnV5LqojH2').push().key;
    
    firebase.database().ref(`Usuario-WS/-LWBP-0bC5_TSsm79BjK/-LXIo5NrqllpsgJRlVZ4/114776566682864207914` ).set({
     linkWs: '1KW61ZJp-zEoBnvUD4_YcX_pxPbR6rh8o',
     fechaCreado: new Date().toString(),
    });

   */


    
    // opciones1: 'libre',
    // opciones2: '1 hora, 2 horas, 3 horas',    
     //opciones3: 'inmediata, urgente, normal',
     //tipoPregunta: '6'
    //  idTipologiaRol: newPostKey2
      //  concepto: 'Consulta Tareas',
      /*detalle: 'Practicas en teletrabajo',
     // numeroTareas: 0,
     // adjunto: {...'ninguno'},
   //   prioridad: 'Inmediata',
 //     estado: 'activo'

   

});

    



    //leer todos
   /* var starCountRef = firebase.database().ref('users');
    starCountRef.on('value', function (snapshot) {
        console.log(snapshot.val());
    });

*/

    // A post entry.
  /*  var postData = {
        title: 'titulos 3',
        cambio: 'res'
    };

    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('Rol').push().key;
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

