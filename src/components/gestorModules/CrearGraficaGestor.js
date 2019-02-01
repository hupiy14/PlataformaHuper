import React from 'react';
import CrearGrafica from '../utilidades/CrearGrafica';
import randomScalingFactor from '../../lib/randomScalingFactor';



const labelsDias = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado"
];

const labelsMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July"
];


const datosG1 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];
const datosG11 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];
const datosG111 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];
const datosG2 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];
const datosG22 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];
const datosG222 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];
const datosG3 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];
const datosG33 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];
const datosG333 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];



class CrearGraficaGestor extends React.Component{
    render(){
        return(

            <CrearGrafica labelsX={labelsDias}
            label1={"Planificación de la semana"}
            label2={"TIC"}
            label3={"Trabajo Realizado"}
            titleGrafica={"Trabajo (Tareas) vs Dias"}
            datos1={datosG1}
            datos2={datosG11}
            datos3={datosG111}
            numeroGrafica={'2'}
            maxLen={'150'}
            TituloGrafica={"Avance Semanal"}

        />
        );
    }
}

export default CrearGraficaGestor;








                              