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
    100,
    80,
    60,
    40,
    20,
    0
];
const datosG11 = [
    100,
    88,
    64,
    40,
    25,
    0
];




class CrearGraficaGestor extends React.Component {

    render() {

        let datos = [];
        datos.push({ label: "Trabajo Realizado", data: datosG11 });
        datos.push({ label: "Planificación de la semana", data: datosG1 });
      
        return (

            <CrearGrafica labelsX={labelsDias}
                datos={datos}
                titleGrafica={"Trabajo (Actividades) vs Dias"}
                numeroGrafica={'2'}
                maxLen={'140'}
                TituloGrafica={"Trabajo de la Semana"}

            />
        );
    }
}

export default CrearGraficaGestor;








