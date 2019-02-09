import React from 'react';
import { connect } from 'react-redux';
import { createStream } from '../../actions';//from '   ../actions';
import ListFormacion from './listaFormacionesEquipo';
import '../styles/ingresoHupity.css';
import randomScalingFactor from '../../lib/randomScalingFactor'
import ListaObjetivosE from '../../components/gestorModules/listaObjetivosEquipo';
import ListaPersonasEquipo from '../utilidades/listaPersonasEquipo';
import { Menu, Segment } from 'semantic-ui-react';
import GraficaG1 from '../gestorModules/CrearGraficaGestor';
import GraficaG2 from '../gestorModules/CreargraficaHistorico';
import GraficaG3 from '../gestorModules/GraficoTICgestos';
import firebase from 'firebase';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, equipoConsultas } from '../modules/chatBot/actions';

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
    state = {
        percent: 15, activeItem: 'semana', grafica: <GraficaG1 />,
        consultaTareas: {}, titulo: null,
        listaPersonas: null, equipo: null,
        avatares: null, colorSeleccion: {}, diateletrabajo: {},

    };

    actualizarequipoConsulta() {

        const starCountRef = firebase.database().ref().child(`Usuario-WS/${this.props.usuarioDetail.usuario.empresa}/${this.props.usuarioDetail.usuario.equipo}`);
        starCountRef.on('value', (snapshot) => {

            const equipo = snapshot.val();
            this.setState({ equipo });

            //carga todos los usuarios
            const starCountRef2 = firebase.database().ref().child(`Usuario`);
            starCountRef2.on('value', (snapshot2) => {
                const consulta = snapshot2.val();
                this.setState({ listaPersonas: consulta });
                this.props.equipoConsultas({ listaPersonas: consulta });
            });

            const fecha = new Date();
            const cal = this.getWeekNumber(fecha);


            if (!equipo)
                return;
            Object.keys(equipo).map((key, index) => {
                const starCountRef2 = firebase.database().ref().child(`Usuario-DiaTeletrabajo/${key}/${fecha.getFullYear()}/${cal}`);
                starCountRef2.on('value', (snapshot2) => {
                    //dia = snapshot2.val().dia;

                    if (snapshot2.val()) {
                        var usuariodia = {};
                        usuariodia[key] = { dia: snapshot2.val().dia, mes: snapshot2.val().mes };
                        const objetos = { ...this.state.diateletrabajo, ...usuariodia }
                        this.setState({ diateletrabajo: objetos })

                    }


                });

                // console.log(key)

                const starCountRef3 = firebase.database().ref().child(`Usuario-Objetivos/${key}`);
                starCountRef3.on('value', (snapshot2) => {
                    const objetivo = snapshot2.val();
                    const objetos = { ...this.props.equipoConsulta, ...objetivo };
                    this.props.equipoConsultas({ ...this.props.equipoConsulta, ...objetos });
                    //      console.log(objetos)

                });



            });

        });
    }


    componentDidMount() {

        this.actualizarequipoConsulta();


    }

    getWeekNumber(date) {
        var d = new Date(date);  //Creamos un nuevo Date con la fecha de "this".
        d.setHours(0, 0, 0, 0);   //Nos aseguramos de limpiar la hora.
        d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Recorremos los días para asegurarnos de estar "dentro de la semana"
        //Finalmente, calculamos redondeando y ajustando por la naturaleza de los números en JS:
        return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
    };

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
        else if (name === 'MIT') {
            const graficaG = <GraficaG3 />;
            this.setState({ grafica: graficaG })

        }
    }

    renderTituloObjetivo() {
        if (this.props.equipoConsulta && this.props.equipoConsulta.sell && this.props.equipoConsulta.sell !== 0)
            return 'Lista de Objetivos Huper';
        else
            return 'Lista de Objetivos';
    }

    renderTituloFormacion() {
        if (this.props.equipoConsulta && this.props.equipoConsulta.sell && this.props.equipoConsulta.sell !== 0)
            return 'Lista Formacion Huper';
        else
            return 'Lista Formaciones';
    }

    renderAcrhivosSubidos() {

        let carpeta = this.props.usuarioDetail.linkws;

        if (this.props.equipoConsulta && this.props.equipoConsulta.sell && this.props.equipoConsulta.sell !== 0) {
            Object.keys(this.state.equipo).map((key, index) => {

                if (key === this.props.equipoConsulta.sell)
                    carpeta = this.state.equipo[key].linkWs;
            });
        }
        return carpeta;
    }




    renderGestor() {

        if (this.state.listaPersonas && this.state.equipo && this.state.diateletrabajo) {

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
                                            active={this.state.activeItem === 'historico'}
                                            onClick={this.handleItemClick}
                                        />
                                        <Menu.Item
                                            name='MIT'
                                            active={this.state.activeItem === 'MIT'}
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
                                        diateletrabajo={this.state.diateletrabajo}
                                        equipox={this.state.equipo}
                                        listaPersonas={this.state.listaPersonas}
                                        empresa={this.props.usuarioDetail.usuario.empresa}
                                        equipo={this.props.usuarioDetail.usuario.equipo}
                                        icono={'user outline'}

                                    />

                                </div>
                            </div>




                            <div className="column six wide">
                                <div className="ui segment">

                                    <ListaObjetivosE
                                        titulo={this.renderTituloObjetivo()}
                                        icono={'copy outline'}
                                        equipox={this.state.equipo}

                                    />

                                </div>
                            </div>

                            <div className="column five wide ">
                                <div className="ui segment Cambioo2">

                                    <h3>Tu espacio de trabajo</h3>
                                    <div className="ui embed " >

                                        <iframe className="yellow4" src={`https://drive.google.com/embeddedfolderview?id=${this.renderAcrhivosSubidos()}`} />

                                    </div>


                                </div>
                            </div>

                            <div className="column five wide">
                                <div className="ui segment">

                                    <ListFormacion
                                        equipox={this.state.equipo}
                                        titulo={this.renderTituloFormacion()}
                                        iconos={'leanpub'}

                                    />

                                </div>
                            </div>




                        </div>
                    </div >
                </div >
            );
        }
    }

    render() {
        return (
            <div> {this.renderGestor()}</div>
        );

    }
};

const mapStateToProps = (state) => {
    return {
        equipoConsulta: state.chatReducer.equipoConsulta,
        usuarioDetail: state.chatReducer.usuarioDetail,
        listaObjetivo: state.chatReducer.listaObjetivo,
        userRol: state.chatReducer.userRol
    };
};
export default connect(mapStateToProps, { createStream, equipoConsultas, listaObjetivos })(DashBoard);

///<ListAdjuntos />