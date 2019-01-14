import React from 'react';
import { connect } from 'react-redux';
import { createStream } from '../actions';
//import history from '../history';
//import Modal from './Modal';
//import { Link } from 'react-router-dom';
//import BarExample from './graficosChart/barExample';
//import LineExample from './graficosChart/lineExample';
import AreaExample from './graficosChart/legenOptionsExample';
import ListImportan from './utilidades/listaImportante';
import ListAdjuntos from './utilidades/listAdjuntos';
import Calendario from './utilidades/calendario';
import CrearGrafica from './utilidades/CrearGrafica';
import './styles/ingresoHupity.css'


import randomScalingFactor from '../lib/randomScalingFactor'
import { Line } from 'react-chartjs-2';


class DashBoard extends React.Component {

   


    renderTeletrabajo() {
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
        const datosG2 = [
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



        return (

            <div>
                <div className="ui form">
                    <div className="two column stackable ui grid">
                        <div className="column eleven wide">
                            <div className="ui segment ">

                                <CrearGrafica labelsX={labelsDias}
                                    label1={"Planeación de trabajo"}
                                    label2={"Correccón de trabajo"}
                                    label3={"Trabajo Realizado"}
                                    titleGrafica={"Trabajo (Tareas) vs Dias"}
                                    datos={datosG1}
                                    TituloGrafica={"Avance Semanal"}

                                />
                            </div>
                        </div>
                        <div className="column five wide">
                            <div className="ui segment">
                                <ListImportan
                                    titulo={'Listado de objetivos'}
                                    title={'Obejtivo de la Semana 1'}
                                    title2={'Obejtivo de la Semana 2'}
                                    title3={'Obejtivo de la Semana 3'}
                                    description={'Diseño de la plataforma'}
                                    description2={'Diseño de la plataforma 2'}
                                    description3={'Diseño de la plataforma 3'}
                                    icono={'copy outline'}
                                />

                            </div>
                        </div>
                        <div className="column eleven wide">
                            <div className="ui segment">

                                <CrearGrafica labelsX={labelsMonths}
                                    label1={"Planeación de trabajo"}
                                    label2={"Correccón de trabajo"}
                                    label3={"Trabajo Realizado"}
                                    titleGrafica={"Objetivo vs Dias"}
                                    datos={datosG2}
                                    TituloGrafica={"Avance de tu trabajo"}

                                />


                            </div>
                        </div>
                        <div className="column five wide">
                            <div className="ui segment">
                                <ListImportan
                                    titulo={'Listado de formaciones'}
                                    title={'Formacion de Timebloking'}
                                    title2={'Formacion de Importante-Urgente'}
                                    description={'Mide cada actividad en un espacio dado'}
                                    description2={'No todas las actividades son ahora'}
                                    icono={'leanpub'}

                                />

                                <Calendario className="tamaño-Calendario" />

                            </div>
                        </div>
                        <div className="column five wide">
                            <div className="ui segment">

                                <ListAdjuntos />

                            </div>
                        </div>
                        <div className="column eleven wide">
                            <div className="ui segment">

                                <CrearGrafica labelsX={labelsMonths}
                                    label1={"Talento"}
                                    label2={"Impacto"}
                                    label3={"Compromiso"}
                                    titleGrafica={"TIC vs Progreso"}
                                    datos={datosG3}
                                    TituloGrafica={"Talento, Impacto, Compromiso"}

                                />


                            </div>
                        </div>

                        <div className="column eight wide">
                            <div className="ui segment">


                            </div>
                        </div>

                    </div>


                </div >
            </div >

        );
    }
    render() {
        let varriable
        if (this.props.userRol === '3') {
            varriable = this.renderTeletrabajo();
            //    console.log('Teletrabajador');
        }

        return (
            <div>   {varriable}</div>

        );

    }
};

const mapStateToProps = (state) => {
    return { userRol: state.chatReducer.userRol };
};
export default connect(mapStateToProps, { createStream })(DashBoard);