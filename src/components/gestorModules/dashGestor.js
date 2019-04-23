import React from 'react';
import { connect } from 'react-redux';
import { createStream } from '../../actions';//from '   ../actions';
import ListFormacion from './listaFormacionesEquipo';
import '../styles/ingresoHupity.css';
import randomScalingFactor from '../../lib/randomScalingFactor'
import ListaObjetivosE from '../../components/gestorModules/listaObjetivosEquipo';
import ListaPersonasEquipo from '../utilidades/listaPersonasEquipo';
import {
    Button,
    Checkbox,
    Grid,
    Header,
    Icon,
    Image,
    Label,
    Menu,
    Segment,
    Sidebar,
    Radio,
}
    from 'semantic-ui-react';
import PropTypes from 'prop-types'

import GraficaG1 from '../gestorModules/CrearGraficaGestor';
import GraficaG2 from '../gestorModules/CreargraficaHistorico';
import GraficaG3 from '../gestorModules/GraficoTICgestos';
import GraficaG4 from '../gestorModules/CrearGraficaProductividad';
import firebase from 'firebase';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, equipoConsultas, verEquipos } from '../modules/chatBot/actions';
const timeoutLength = 3000;
const timeoutLength2 = 500;

const HorizontalSidebar = ({ animation, direction, visible, equipo }) => (
    <Sidebar as={Segment} animation={animation} direction={direction} visible={visible}>
        <Grid textAlign='center'>
            <Grid.Row columns={1}>
                <Grid.Column>
                    {equipo}

                </Grid.Column>
            </Grid.Row>

        </Grid>
    </Sidebar>
)



class DashBoard extends React.Component {
    state = {
        percent: 15, activeItem: 'semana',

        consultaTareas: {}, titulo: null,
        listaPersonas: null, equipo: null,
        avatares: null, colorSeleccion: {}, diateletrabajo: {},
        valueH: false, slide: null, seleccion: null,
        grafica: null, numeroO: 0,

    };


    handleSlide = (x) => {
        this.timeout = setTimeout(() => {

            if (x === 0)
                this.setState({ slide: this.renderListadoEquipo() });

            else if (x === 1)
                this.setState({ slide: this.renderListaObjetivo() });

            else if (x === 2)
                this.setState({ slide: this.renderListaFormaciones() })


        }, timeoutLength2)
    }

    handleOpen = () => {
        this.timeout = setTimeout(() => {

            if (this.state.numeroO === 10)
                this.setState({ numeroO: 0 });
            else
                this.setState({ numeroO: this.state.numeroO + 1 });
            //  this.handleOpen2();
        }, timeoutLength)
    }



    actualizarequipoConsulta() {

        const starCountRef = firebase.database().ref().child(`Usuario-WS/${this.props.usuarioDetail.usuario.empresa}/${this.props.usuarioDetail.usuario.equipo}`);
        starCountRef.on('value', (snapshot) => {

            const equipo = snapshot.val();
            this.setState({ equipo });
            let usuariosCompletos = [];
            //carga todos los usuarios
            const starCountRef2 = firebase.database().ref().child(`Usuario`);
            starCountRef2.on('value', (snapshot2) => {
                const consulta = snapshot2.val();


                ///Recupera el rol del usuario
                Object.keys(consulta).map((key, index) => {
                    const starCountRef3 = firebase.database().ref().child(`Usuario-Rol/${key}`);
                    starCountRef3.on('value', (snapshot3) => {
                        const rol = snapshot3.val();
                        usuariosCompletos[key] = { ...consulta[key], ...rol };
                        this.setState({ ...this.props.equipoConsulta, listaPersonas: { ...usuariosCompletos } });
                        this.props.equipoConsultas({ ...this.props.equipoConsulta, listaPersonas: { ...usuariosCompletos } });
                    });
                });





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
                    let objetivoT = [];
                    const lista = { ...objetivo };

                    Object.keys(lista).map((key2, index) => {
                        objetivoT[key2] = { ...lista[key2], idUsuario: key };
                    })

                    const objetos = { ...this.props.equipoConsulta, ...objetivoT };
                    this.props.equipoConsultas({ ...this.props.equipoConsulta, ...objetos });
                    //      console.log(objetos)

                });



            });

        });
    }


    componentDidMount() {

        window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/drive/v3/rest")
            .then(function () { console.log("GAPI client loaded for API"); },
                function (err) { console.error("Error loading GAPI client for API", err); });
                
        this.actualizarequipoConsulta();
        this.handleOpen();
        this.setState({
            grafica: <div>
                <Checkbox checked={this.state.valueH} className="historico-padding" label='Consultar Histórico' onChange={this.handleDimmedChange} toggle />
                <GraficaG1 />
            </div>
        });

        this.setState({ slide: this.renderListadoEquipo() });
        this.props.verEquipos(false);
     
    }

    getWeekNumber(date) {
        var d = new Date(date);  //Creamos un nuevo Date con la fecha de "this".
        d.setHours(0, 0, 0, 0);   //Nos aseguramos de limpiar la hora.
        d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Recorremos los días para asegurarnos de estar "dentro de la semana"
        //Finalmente, calculamos redondeando y ajustando por la naturaleza de los números en JS:
        return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
    };

    handleDimmedChange = (e, { checked }) => {
        console.log(checked);
        this.setState({ valueH: checked });

        if (checked) {
            this.setState({
                grafica: <div>
                    <Checkbox checked={checked} className="historico-padding" label='Consultar Histórico' onChange={this.handleDimmedChange} toggle />
                    <GraficaG2 />
                </div>
            })
        }
        else {
            this.setState({
                grafica: <div>
                    <Checkbox checked={checked} className="historico-padding" label='Consultar Histórico' onChange={this.handleDimmedChange} toggle />
                    <GraficaG1 />
                </div>
            })
        }
    }



    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name })

        if (name === 'semana') {
            const graficaG =
                <div>
                    <Checkbox checked={this.state.valueH} className="historico-padding" label='Consultar Histórico' onChange={this.handleDimmedChange} toggle />
                    <GraficaG1 />
                </div>
            this.setState({ grafica: graficaG })

        }
        else if (name === 'MIT') {
            const graficaG = <GraficaG3 />;
            this.setState({ grafica: graficaG })

        }
        else if (name === 'Productividad vs Calidad') {
            const graficaG = <GraficaG4 />;
            this.setState({ grafica: graficaG })

        }

    }

    renderTituloObjetivo() {
        if (this.props.equipoConsulta && this.props.equipoConsulta.sell && this.props.equipoConsulta.sell !== 0) {
            let titulo;
            Object.keys(this.props.equipoConsulta.listaPersonas).map((key, index) => {
                if (key === this.props.equipoConsulta.sell)
                    titulo = this.props.equipoConsulta.listaPersonas[key].usuario;
            });
            this.setState({ seleccion: titulo });
            return 'Lista de Objetivos ' + titulo;

        }
        else {
            this.setState({ seleccion: null });
            return 'Lista de Objetivos';
        }
    }

    renderTituloFormacion() {
        if (this.props.equipoConsulta && this.props.equipoConsulta.sell && this.props.equipoConsulta.sell !== 0) {
            let titulo;
            Object.keys(this.props.equipoConsulta.listaPersonas).map((key, index) => {
                if (key === this.props.equipoConsulta.sell)
                    titulo = this.props.equipoConsulta.listaPersonas[key].usuario;
            });
            this.setState({ seleccion: titulo });
            return 'Lista de Formaciones ' + titulo;

        }
        else {
            this.setState({ seleccion: null });
            return 'Lista Formaciones';
        }
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

    renderListadoEquipo() {

        //envia la seleccion realizada
        let sel = null;
        if (this.props.equipoConsulta && this.props.equipoConsulta.sell && this.props.equipoConsulta.sell !== 0) {
            let titulo;
            sel = this.props.equipoConsulta.sell;
            Object.keys(this.props.equipoConsulta.listaPersonas).map((key, index) => {
                if (key === this.props.equipoConsulta.sell)
                    titulo = this.props.equipoConsulta.listaPersonas[key].usuario;


            });
            this.setState({ seleccion: titulo });
        }
        else {
            this.setState({ seleccion: null });
        }

        return (
            <ListaPersonasEquipo
                titulo={'Tu equipo'}
                diateletrabajo={this.state.diateletrabajo}
                equipox={this.state.equipo}
                listaPersonas={this.state.listaPersonas}
                empresa={this.props.usuarioDetail.usuario.empresa}
                equipo={this.props.usuarioDetail.usuario.equipo}
                seleccionUsuario={sel}
                icono={'user outline'} />

        );
    }

    renderListaObjetivo() {
        return (<ListaObjetivosE
            titulo={this.renderTituloObjetivo()}
            icono={'thumbtack'}
            equipox={this.state.equipo}

        />);

    }
    renderListaFormaciones() {
        return (
            <ListFormacion
                equipox={this.state.equipo}
                titulo={this.renderTituloFormacion()}
                iconos={'leanpub'} />
        );
    }


    renderGestor() {

        let porcentajeTexto = 0;
        let verUsuario = 'none';

        if (this.state.seleccion) {
            porcentajeTexto = this.state.seleccion.length * 8.5;
            verUsuario = 'block';
        }

        if (this.state.listaPersonas && this.state.equipo && this.state.diateletrabajo) {

            // console.log(this.props.usuarioDetail);
            return (

                <div>
                    <div className="ui form">
                        <div className="two column stackable ui grid">
                            <div className="column fifteen wide">
                                <div className="ui segment ">
                                    <Sidebar.Pushable as={Segment}>
                                        {
                                            <HorizontalSidebar animation="scale down" direction="right" visible={this.props.verEquipo} equipo={this.state.slide} />
                                        }
                                        <Sidebar.Pusher dimmed={this.props.verEquipo}>
                                            <Segment basic>
                                                <Menu pointing secondary>
                                                    <Menu.Item name='semana' active={this.state.activeItem === 'semana'} onClick={this.handleItemClick} />
                                                    <Menu.Item
                                                        name='MIT'
                                                        active={this.state.activeItem === 'MIT'}
                                                        onClick={this.handleItemClick}
                                                    />
                                                    <Menu.Item
                                                        name='Productividad vs Calidad'
                                                        active={this.state.activeItem === 'Productividad vs Calidad'}
                                                        onClick={this.handleItemClick}
                                                    />
                                                </Menu>

                                                <Segment attached='bottom'>
                                                    {this.state.grafica}
                                                </Segment>

                                            </Segment>
                                        </Sidebar.Pusher>
                                    </Sidebar.Pushable>
                                </div>
                            </div>

                            <div className="column one wide loaderTEAM">
                                <div className="ui segment ">
                                    <Button icon="users" className="opcionesGestor" label="Equipo" color="yellow" onClick={() => { this.handleSlide(0); this.props.verEquipos(!this.props.verEquipo); }} >

                                    </Button>
                                    <Label color='teal' floating style={{ width: `${porcentajeTexto}px`, left: '40px', display: `${verUsuario}`, 'z-index': '1' }}>
                                        {this.state.seleccion}
                                    </Label>
                                </div>
                                <div className="ui segment ">
                                    <Button icon="tasks" className="opcionesGestor" label="Objetivos" color="yellow" onClick={() => { this.handleSlide(1); this.props.verEquipos(!this.props.verEquipo); }} ></Button>
                                </div>
                                <div className="ui segment ">
                                    <Button icon="book" className="opcionesGestor" label="Formación" color="yellow" onClick={() => { this.handleSlide(2); this.props.verEquipos(!this.props.verEquipo); }} ></Button>
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
        verEquipo: state.chatReducer.verEquipo,
        userRol: state.chatReducer.userRol
    };
};
export default connect(mapStateToProps, { createStream, equipoConsultas, listaObjetivos, verEquipos })(DashBoard);

///<ListAdjuntos />