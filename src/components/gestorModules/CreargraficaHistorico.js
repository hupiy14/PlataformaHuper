import React from 'react';
import CrearGrafica from '../utilidades/CrearGrafica';
import randomScalingFactor from '../../lib/randomScalingFactor';




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
    70,
    75,
    60,
    40,
    35,
];
const datosG11 = [
    100,
    83,
    65,
    80,
    60,
    47,
    38,
];
const datosG111 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];



class CrearGraficaHistorico extends React.Component {
    render() {

        let datos = [];
        datos.push({ label: "MIT equipo", data: datosG111,  hidden: true, });
        datos.push({ label: "Trabajo realizado", data: datosG11 });
        datos.push({ label: "Trabajo planificado", data: datosG1 });
   
      
        return (

            <CrearGrafica labelsX={labelsMonths}
                datos={datos}
                titleGrafica={"Trabajo vs Meses"}
                numeroGrafica={'2'}
                maxLen={'140'}
                TituloGrafica={"Historico"}

            />
        );
    }
}

export default CrearGraficaHistorico;








