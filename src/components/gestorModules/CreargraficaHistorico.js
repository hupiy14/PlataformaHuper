import React from 'react';
import CrearGrafica from '../utilidades/CrearGrafica';


const datosG1 = [
    100,
    80,
    70,
    75,
    60,
    40,
    35,
];


class CrearGraficaHistorico extends React.Component {
    render() {

        let datos = [];
      //  datos.push({ label: "MIT equipo", data: datosG111,  hidden: true, });
        datos.push({ label: "Trabajo planificado", data: this.props.datoPlanificar });
        datos.push({ label: "Trabajo realizado ", data: this.props.datoTrabajo });
   
      
        return (

            <CrearGrafica labelsX={this.props.labelsMonths}
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








