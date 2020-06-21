import React from 'react';
import CrearGrafica from '../utilidades/CrearGrafica';
import moment from 'moment';
//productividad sera el resultado de las entregas de cada objetivo sumado la dificultad
//calidad medida subjetiva del jefe


let calData = [];
let prodData = [];
class CrearGraficaProd extends React.Component {

    render() {

        let datos = [];
        let labelsDias = [];
        prodData = [];
        calData = [];
        let fecha = null;
        //  console.log(this.props.prod)
        //console.log(this.props.cal)

        Object.keys(this.props.prod).map((key, index) => {
            if (this.props.prod.length > 6) {
                if (index => (this.props.prod.length - 6)) {
                    labelsDias.push(key);
                    prodData.push(this.props.prod[key].valor * 100);
                    fecha = this.props.prod[key].fecha;
                    calData.push(this.props.cal[key] ? this.props.cal[key].calidad * 100 : null);

                }
            }
            else {
                labelsDias.push(key);
                prodData.push(this.props.prod[key].valor * 100);
                calData.push(this.props.cal[key] ? this.props.cal[key].calidad * 100 : null);
                fecha = this.props.prod[key].fecha;
            }
            return this.props.prod[key];
        });
        if (labelsDias.length < 6) {
            for (let index = 0; index < 8 - labelsDias.length; index++) {
                fecha = moment(fecha, "YYYY-MM-DD").add(7, 'days');
                const mm = (moment(fecha, "YYYY-MM-DD").week() - (moment(fecha, "YYYY-MM-DD").month() * 4));
                const mes = moment(fecha, "YYYY-MM-DD").format('MMMM');
                labelsDias.push('sem.' + mm + ' ' + mes);
            }
        }

        datos.push({ label: "Calidad", data: calData, hidden: true, });
        datos.push({ label: "Productividad", data: prodData });
        //    datos.push({ label: "Semana Anterior", data: datosG1 });


        return (

            <CrearGrafica labelsX={labelsDias}
                datos={datos}
                equipoGrafica={this.props.equipoGra}
                titleGrafica={"Valoración en las ultimas 5 semnanas"}
                numeroGrafica={'2'}
                maxLen={'140'}
                TituloGrafica={"Productividad vs Calidad"}

            />
        );
    }
}

export default CrearGraficaProd;
