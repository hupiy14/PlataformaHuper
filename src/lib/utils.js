import firebase from 'firebase';
import React from 'react';
import moment from 'moment';
import { popupBot } from '../actions';
import { connect } from 'react-redux';

export const listTemporalObject = (tipo, list, consulta) => {

    if (consulta) {
        const starCountRef = firebase.database().ref().child(consulta);
        starCountRef.on('value', (snapshot) => {
            if (snapshot.val()) {
                let objects = snapshot.val();
                Object.keys(objects).map((key, index) => {
                    if (tipo === objects[key].tipo)
                        list.push(<option value={objects[key].concepto} key={key} />)
                    return objects[key]
                })
            }
        });
    }
    return list;

};


export const listTemporalOpciones = (tipo, opciones, consulta) => {
    if (consulta) {
        const starCountRef = firebase.database().ref().child(consulta);
        starCountRef.on('value', (snapshot) => {
            if (snapshot.val()) {
                let objects = snapshot.val();
                Object.keys(objects).map((key, index) => {
                    if (tipo === objects[key].tipo) {
                        opciones[objects[key].concepto] = key;
                    }
                    return objects[key]
                })
            }
        });
    }
    return opciones;
};


export const rutaHupper = (etapa) => {

    const posiblesRespuestas = 3; // posibles respuestas por cada etapa
    let wd = Math.round(Math.random() * (posiblesRespuestas - 1));
    wd = wd === 0 && Number(etapa) > 1 ? 1 + (posiblesRespuestas * (Number(etapa) - 1)) : wd + (posiblesRespuestas * (Number(etapa) - 1));
    wd = wd < 0 ? wd = 0 : wd;

    return wd;
};

export const rutaHupperSingle = (etapa) => {

    const posiblesRespuestas = 3; // posibles respuestas por cada etapa
    let wd = Math.round(Math.random() * (posiblesRespuestas - 1));
    return wd;
};


export const randomMessage = (message, indexR) => {

    let mes = "Upps !! hemos tenido un problema";
    Object.keys(message).map((key, index) => {
        if (indexR === index)
            mes = message[key];
    });
    return mes;
};

export const etapaHupper = (usuario, idUsuario, consulta) => {

    let etapa = 0;
    if (consulta) {
        const starCountRef = firebase.database().ref().child(consulta);
        starCountRef.on('value', (snapshot) => {
            if (snapshot.val()) {
                let objects = snapshot.val();

                Object.keys(objects).map((key, index) => {
                    let e = 0;
                    let talento = usuario.acumTalento ? usuario.acumTalento : 0;

                    let compromiso = usuario.acumCompromiso ? usuario.acumCompromiso : 0;

                    let impacto = usuario.acumImpacto ? usuario.acumImpacto : 0;

                    if (talento >= objects[key].talentoMin && talento <= objects[key].talentoMax)
                        e++;
                    if (impacto >= objects[key].impactoMin && impacto <= objects[key].impactoMax)
                        e++;
                    if (compromiso >= objects[key].compromisoMin && compromiso <= objects[key].compromisoMax)
                        e++;
                    if (e === 3) {
                        etapa = key;
                    }
                    return objects[key]
                })
            }
        });
    }
    let usProp = [];
    usProp["etapa"] = etapa === 0 && usuario.etapa ? usuario.etapa : etapa;
    firebase.database().ref(`Usuario/${idUsuario}`).update({
        ...usProp
    });

    return etapa;

};

export const avanceOKR = (objetivo, keyObjetivo, Tasks) => {

    let vImpacto = 0.25;
    let vTipologia = 0.1;
    let tiempoActividad = 60000 // tiempo en segundos
    let defaultV = 2;
    let nTareas = Math.round((objetivo.dificultad ? objetivo.dificultad : defaultV * ((objetivo.impacto * vImpacto) + 1)) * (vTipologia * objetivo.tipologia ? objetivo.tipologia : defaultV));
    let nTareasCompletas = 0;
    let nTiempoTrabajo = 0;


    Object.keys(Tasks).map((key2, index) => {


        if (moment(key2, "ww") >= moment().format('ww') - 2) {

            let Task = Tasks[key2];
            Object.keys(Task).map((key, index) => {
                if (keyObjetivo === Task[key].objetivo && Task[key].estado === 'finalizado') {
                    nTareasCompletas++;
                    nTiempoTrabajo = nTiempoTrabajo + Task[key].duracion;
                }
                return Task[key]
            });
        }
        return Tasks[key2];
    });

    let porTiempo = nTiempoTrabajo === 0 ? 7 : nTiempoTrabajo > nTareas * tiempoActividad ? 50 : Math.round((nTiempoTrabajo / (nTareas * tiempoActividad)) * 50);
    let porActividad = nTareasCompletas === 0 ? 8 : nTareasCompletas > nTareas ? 50 : Math.round((nTareasCompletas / nTareas) * 50);


    return porTiempo + porActividad;
}



export const dataBaseManager = (tipo, path, objectIn, mensaje, mensajeError) => {

    let men = null;
    let uid = null;
    let menajeok = mensaje && mensaje !== "default" ? mensaje : mensaje !== "default" ? "Hemos guardado tus datos correctamente" : null;
    let menajeer = mensajeError && mensajeError !== "default" ? mensajeError : mensajeError !== "default" ? "Uppss !!He tenido un probema al guardar estos datos." : null;
    switch (tipo) {
        case "insert":
            firebase.database().ref(path).set({
                ...objectIn
            }).then(
                () => {
                    if (menajeok)
                        men = menajeok;
                }).catch(err => {
                    if (menajeer)
                        men = menajeer;
                })

            break;
        case "update":

            firebase.database().ref(path).update({
                ...objectIn
            }).then(
                () => {
                    if (menajeok)
                        men = menajeok;
                }).catch(err => {
                    if (menajeer)
                        men = menajeer;
                })

            break;
        case "get":
            return firebase.database().ref().child(path);
        case "state":

              firebase.auth().onAuthStateChanged((user, men) => {
                if (user) {
                    men = menajeok;
                    uid= user.uid;
                    alert(uid)
                    return {mensaje: men, uid};
                    // User is signed in.
                } else {
                    alert('no')
                    men = menajeer;
                    return {mensaje: men, uid};
                    // No user is signed in.
                }
            })

            break;
        case "create":
            firebase.auth().createUserWithEmailAndPassword(objectIn.email, objectIn.ID);
            break;
        case "login":
            firebase.auth().signInWithEmailAndPassword(objectIn.email, objectIn.ID);
            break;
        case "logout":
            firebase.auth().signOut();
            break;
        default:
            break;

        
    }
  
    return {mensaje: men, uid};
}

