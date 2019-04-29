import React from 'react';
import CrearGrafica from '../utilidades/CrearGrafica';

const labelsDias = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado"
];


let datosPlanificados = [];

class CrearGraficaGestor extends React.Component {

  
    render() {

        let datos = [];
        datosPlanificados = [];
        const factorInicial = this.props.tope;
        const avanceInicial = this.props.tope * 0.20;
        for (var i = 0; i < 6; i++)
            datosPlanificados.push(factorInicial - (i * avanceInicial));
        datos.push({ label: "Trabajo Realizado", data: this.props.datosAvance,  });
        datos.push({ label: "Planificación de la semana", data: datosPlanificados, hidden: true });

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








