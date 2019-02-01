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
import ListEjemplo from './utilidades/ListaEjemplo';
import ListAdjuntos from './utilidades/listAdjuntos';


import Calendario2 from './utilidades/calendar2';


import CrearGrafica from './utilidades/CrearGrafica';
import './styles/ingresoHupity.css'


import randomScalingFactor from '../lib/randomScalingFactor'
import { Line } from 'react-chartjs-2';



import ListaPersonasEquipo from './utilidades/listaPersonasEquipo';



import { Menu, Segment } from 'semantic-ui-react';


import GraficaG1 from './gestorModules/CrearGraficaGestor';
import GraficaG2 from './gestorModules/CreargraficaHistorico';


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
const datosG2 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];
const datosG22 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];
const datosG222 = [
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
const datosG33 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];
const datosG333 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];


class DashBoard extends React.Component {
    state = { activeItem: 'semana', grafica: <GraficaG1 /> }

    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name })
        if (name === 'historico') {

            const graficaG = <GraficaG2 />;
            this.setState({ grafica: graficaG })
        }
        else if (name === 'semana') {
            const graficaG = <GraficaG1 />;
            this.setState({ grafica: graficaG })

        }
    }



    renderGestor() {

        const { activeItem } = this.state
        // console.log(this.props.usuarioDetail);
        return (

            <div>
                <div className="ui form">
                    <div className="two column stackable ui grid">
                        <div className="column eleven wide">
                            <div className="ui segment ">


                                <Menu pointing secondary>
                                    <Menu.Item name='semana' active={activeItem === 'home'} onClick={this.handleItemClick} />
                                    <Menu.Item
                                        name='historico'
                                        active={activeItem === 'messages'}
                                        onClick={this.handleItemClick}
                                    /> 
                                
                                </Menu>

                                <Segment attached='bottom'>
                                    {this.state.grafica}
                                </Segment>

                            </div>
                        </div>

                        <div className="column five wide loaderTEAM">
                            <div className="ui segment loaderTEAM">



                                <ListaPersonasEquipo
                                    titulo={'Tu equipo'}
                                    empresa={this.props.usuarioDetail.usuario.empresa}
                                    equipo={this.props.usuarioDetail.usuario.equipo}
                                    icono={'user outline'}
                                />

                            </div>
                        </div>




                        <div className="column six wide">
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

                        <div className="column five wide">
                            <div className="ui segment Cambioo">

                                <div className="ui embed " >
                                    <iframe className="yellow2" title="Ultimos archivos subidos" src={`https://drive.google.com/embeddedfolderview?id=${this.props.usuarioDetail.linkws}`}

                                    />

                                </div>


                            </div>
                        </div>

                        <div className="column five wide">
                            <div className="ui segment">

                                <ListEjemplo
                                    titulo={'Listado de formaciones'}
                                    title={'Formacion de Timebloking'}
                                    title2={'Formacion de Importante-Urgente'}
                                    description={'Mide cada actividad en un espacio dado'}
                                    description2={'No todas las actividades son ahora'}
                                    icono={'leanpub'}

                                />

                            </div>
                        </div>




                    </div>
                </div >
            </div >
        );
    }

    renderTeletrabajador() {

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
                                    datos1={datosG1}
                                    datos2={datosG11}
                                    datos3={datosG111}
                                    numeroGrafica={'2'}
                                    maxLen={'150'}
                                    TituloGrafica={"Avance Semanal"}

                                />
                                <br />
                                <div className="ui divider"></div>


                                <CrearGrafica labelsX={labelsMonths}
                                    label1={"Talento"}
                                    label2={"Impacto"}
                                    label3={"Compromiso"}
                                    titleGrafica={"TIC vs Progreso"}
                                    datos1={datosG3}
                                    datos2={datosG33}
                                    datos3={datosG333}
                                    maxLen={'110'}
                                    TituloGrafica={"Talento, Impacto, Compromiso (TIC)"}

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
                                <br />
                                <div className="ui divider"></div>
                                <ListEjemplo
                                    titulo={'Listado de formaciones'}
                                    title={'Formacion de Timebloking'}
                                    title2={'Formacion de Importante-Urgente'}
                                    description={'Mide cada actividad en un espacio dado'}
                                    description2={'No todas las actividades son ahora'}
                                    icono={'leanpub'}

                                />
                                <br />
                                <div className="ui divider"></div>
                                <Calendario2 className="tamaño-Calendario" />


                            </div>
                        </div>

                        <div className="column five wide">
                            <div className="ui segment Cambioo">

                                <div className="ui embed " >
                                    <iframe className="yellow2" title="Ultimos archivos subidos" src={`https://drive.google.com/embeddedfolderview?id=${this.props.usuarioDetail.linkws}`}

                                    />

                                </div>


                            </div>
                        </div>
                        <div className="column eleven wide">
                            <div className="ui segment">


                                <CrearGrafica labelsX={labelsMonths}
                                    label1={"Planeación de trabajo"}
                                    label2={"Correccón de trabajo"}
                                    label3={"Trabajo Realizado"}
                                    titleGrafica={"Objetivo vs Meses"}
                                    datos1={datosG2}
                                    datos2={datosG22}
                                    datos3={datosG222}
                                    maxLen={'150'}
                                    TituloGrafica={"Avance de tu trabajo"}

                                />

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
            varriable = this.renderTeletrabajador();
            //    console.log('Teletrabajador');
        }
        else if (this.props.userRol === '2') {
            varriable = this.renderGestor();
            //    console.log('Teletrabajador');
        }

        return (
            <div>   {varriable}</div>

        );

    }
};

const mapStateToProps = (state) => {
    return {
        usuarioDetail: state.chatReducer.usuarioDetail,
        userRol: state.chatReducer.userRol
    };
};
export default connect(mapStateToProps, { createStream })(DashBoard);

///<ListAdjuntos />