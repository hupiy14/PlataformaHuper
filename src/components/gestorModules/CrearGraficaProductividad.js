import React from 'react';
import CrearGrafica from '../utilidades/CrearGrafica';
import randomScalingFactor from '../../lib/randomScalingFactor';
import moment from 'moment';



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
let prodData = [];
const datosG111 = [
    80, 80, 60, 80, 60, 80
];

let labelsDias = [];




class CrearGraficaProd extends React.Component {

    render() {

        let datos = [];
        labelsDias = [];
        prodData = [];
        let fecha = null;
        console.log(this.props.prod)

        Object.keys(this.props.prod).map((key, index) => {
            if (this.props.prod.length > 6) {
                if (index => (this.props.prod.length - 6)) {
                    labelsDias.push(this.props.prod[key].label);
                    prodData.push(this.props.prod[key].valor *100);
                    fecha = this.props.prod[key].fecha;
                  
                }
            }
            else {
                labelsDias.push(this.props.prod[key].label);
                prodData.push(this.props.prod[key].valor *100);
                fecha = this.props.prod[key].fecha;
            }
        });
        if (labelsDias.length < 6) {
            for (let index = 0; index < 8 - labelsDias.length; index++) {
                fecha = moment(fecha, "YYYY-MM-DD").add(7, 'days');
                const mm = (moment(fecha, "YYYY-MM-DD").week() - (moment(fecha, "YYYY-MM-DD").month() * 4));
                const mes = moment(fecha, "YYYY-MM-DD").format('MMMM');
                labelsDias.push('sem.' + mm + ' ' + mes);
            }
        }

        datos.push({ label: "Calidad Actual", data: datosG111, hidden: true, });
        datos.push({ label: "Productividad", data: prodData });
    //    datos.push({ label: "Semana Anterior", data: datosG1 });


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
