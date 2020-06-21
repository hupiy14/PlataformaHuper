import React from 'react';
import CrearGrafica from '../utilidades/CrearGrafica';

class CrearGraficaHistorico extends React.Component {
    render() {

        let datos = [];
      //  datos.push({ label: "MIT equipo", data: datosG111,  hidden: true, });
        datos.push({ label: "Trabajo planificado", data: this.props.datoPlanificar });
        datos.push({ label: "Trabajo realizado ", data: this.props.datoTrabajo });
   
      
        return (

            <CrearGrafica labelsX={this.props.labelsMonths}
                datos={datos}
                equipoGrafica={this.props.equipoGra}
                titleGrafica={"Trabajo (WU) vs Meses"}
                numeroGrafica={'2'}
                maxLen={'140'}
                TituloGrafica={"Historico de trabajo "}

            />
        );
    }
}

export default CrearGraficaHistorico;








