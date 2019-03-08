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

//productividad sera el resultado de las entregas de cada objetivo sumado la dificultad
//calidad medida subjetiva del jefe


const datosG1 = [
    20,
    45,
    80,
    35,
    70,
    15,
];
const datosG11 = [
    40,
    55,
    60,
    45,
    50,
    5,
];
const datosG111 = [
    80, 80, 60, 80, 60, 80
];





class CrearGraficaProd extends React.Component {

    render() {

        let datos = [];
        datos.push({ label: "Calidad Actual", data: datosG111, hidden: true, });
        datos.push({ label: "Semana Actual", data: datosG11, hidden: true, });
        datos.push({ label: "Semana Anterior", data: datosG1 });
      
    
        return (

            <CrearGrafica labelsX={labelsDias}
                datos={datos}
                titleGrafica={"Trabajo (Actividades) vs Dias"}
                numeroGrafica={'2'}
                maxLen={'140'}
                TituloGrafica={"Productividad vs Calidad"}

            />
        );
    }
}

export default CrearGraficaProd;
