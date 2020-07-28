import firebase from 'firebase';
import React from 'react';
import moment from 'moment';

export const listTemporalObject = (tipo, list, consulta) => {

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
    return list;
};

export const listTemporalOpciones = (tipo, opciones, consulta) => {

    const starCountRef = firebase.database().ref().child(consulta);
    starCountRef.on('value', (snapshot) => {
        if (snapshot.val()) {
            let objects = snapshot.val();
            Object.keys(objects).map((key, index) => {
                if (tipo === objects[key].tipo)
                 {
                    opciones[objects[key].concepto] = key;
                 }
                return objects[key]
            })
        }
    });
    return opciones;
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

    console.log('>>>>>>>S>>>>>>S>>>>>>>S');
    console.log(objetivo.dificultad);
    
    console.log(objetivo.impacto);
    
    console.log(objetivo.tipologia);
    
    console.log('<<<d<<<d<<<<d<<<d<<<d<<d');
    let porTiempo = nTiempoTrabajo === 0 ? 7 : nTiempoTrabajo > nTareas * tiempoActividad ? 50 : Math.round((nTiempoTrabajo / (nTareas * tiempoActividad)) * 50);
    let porActividad = nTareasCompletas === 0 ? 8 : nTareasCompletas > nTareas ? 50 : Math.round((nTareasCompletas / nTareas) * 50);


    return porTiempo + porActividad;
}