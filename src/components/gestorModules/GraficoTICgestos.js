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



class CrearGraficaGestor extends React.Component{
    render(){

        let datos= [];
        datos.push({label:"MIT del equipo", data:datosG1,});
        datos.push({label:"MIT Personal", data:datosG11,});
        datos.push({label:"Trabajo Realizado", data:datosG111,});

        return(

            <CrearGrafica labelsX={labelsDias}
            datos={datos}
            fuerza={0.25}
            titleGrafica={"Trabajo (Tareas) vs Dias"}
            numeroGrafica={'2'}
            maxLen={'140'}
            TituloGrafica={"MIT del equipo"}

        />
        );
    }
}

export default CrearGraficaGestor;








                              