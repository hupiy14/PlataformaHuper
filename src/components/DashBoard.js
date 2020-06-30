import React from 'react';
import { connect } from 'react-redux';
import { chatOff, chatOn } from '../actions';
import ListImportan from './utilidades/listaImportante';
import ListEjemplo from './utilidades/ListaEjemplo';
import Calendario2 from './utilidades/calendar2';
import CrearGrafica from './utilidades/CrearGrafica';
import CrearGrafica2 from './utilidades/CrearGrafica2';
import './styles/ingresoHupity.css';
import randomScalingFactor from '../lib/randomScalingFactor';
import { Line } from 'react-chartjs-2';
import ListaActividades from './HuperModules/actividadesHuper';
import DashGestor from './gestorModules/dashboardG';
import Hupps from './modules/Hupps';
import firebase from 'firebase';
import moment from 'moment';
import history from '../history';

import { signOut } from '../actions';



import { Grid, Modal, Menu, Segment, Button, Dimmer, Header, Icon, Image, Portal, Step, Label, Checkbox } from 'semantic-ui-react';
import MenuChat from './MenuChat';
import { pasoOnboardings, listaFormaciones, estadochats } from './modules/chatBot/actions';


var ReactRotatingText = require('react-rotating-text');
const timeoutLength = 1800;
const timeoutLength2 = 2000;
const timeoutLength3 = 100000;
const timeoutLength4 = 500;
const timeoutLength5 = 5000;
const timeoutLength6 = 200;


const labelsDias = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado"
];

let labelsMonths = [];


let datosPlanificados = [];

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
        activeItem: 'semana',
        avatares: null,
        activo: null,
        activo2: true,
        pasoActivo: null,
        pasoActivof: 1,
        comenzo: false,
        estadoCel: false,
        grafica: null,
        checked: false,
        open: false,
        open2: false,
        open3: false,
        UtilFactors: null,
        ObjsFactors: [],
        ObjsFactorsM: [],
        TareasObjs: null,
        factorSemana: null,
        ticUsuario: [],
        activeItem2: null,
    }

    handleOpenMenu = () => {
        this.setState({ open: true })
    }

    handleOpenMenu2 = () => {
        this.setState({ open2: true })
    }

    handleOpenMenu3 = () => {
        this.setState({ open3: true })
    }
    handleCloseMenu = () => {
        this.setState({ open: false })
        this.setState({ open2: false })
        this.setState({ open3: false })
    }


    componentDidMount() {


        if (!this.props.isSignedIn)
            history.push('/');
        //    history.push('/login');

        const starCountRef3 = firebase.database().ref().child(`Utilidades-Valoraciones`);
        starCountRef3.on('value', (snapshot) => {
            this.setState({ UtilFactors: snapshot.val() });
        });




        //carga el limite que las empresas definan
        datosPlanificados = [];
        const factorInicial = 100;
        const avanceInicial = 20;
        for (var i = 0; i < 6; i++)
            datosPlanificados.push(factorInicial - (i * avanceInicial));
    }


    handleTareas = () => {
        this.timeout = setTimeout(() => {

            const starCountRef3 = firebase.database().ref().child(`Usuario-Tareas/${this.props.userId}`);
            starCountRef3.on('value', (snapshot) => {
                this.setState({ TareasObjs: snapshot.val() });
            });

            const diat = new Date();
            const nameRef3 = firebase.database().ref().child(`Usuario-TIC/${this.props.userId}/${diat.getFullYear()}`)
            nameRef3.on('value', (snapshot2) => {
                console.log(snapshot2.val());
                this.setState({ ticUsuario: snapshot2.val() ? snapshot2.val() : [] })
            });


            this.calculoDeAvance();
            this.renderGraficaSemana();
            this.setState({ open: true });
        }, timeoutLength6)
    }


    // habilita el tercer paso
    handlePaso = () => {
        this.timeout = setTimeout(() => {
            this.props.pasoOnboardings(3);
        }, timeoutLength3)
    }




    arregloFechaSemana() {
        var fecahMinima = new Date();
        const diferencia = fecahMinima.getDay() - 1;
        fecahMinima.setDate(fecahMinima.getDate() + (-(diferencia)));
        let fechas = [];
        for (var i = 0; i < 6; i++)
            fechas.push(moment(fecahMinima).add(i, 'days').format('YYYY-MM-DD'));
        return fechas;
    }

    arregloFechaMes() {
        var fecahMinima = new Date();
        labelsMonths = [];
        const diferencia = fecahMinima.getDay() - 1;
        fecahMinima.setDate(fecahMinima.getDate() + (-(diferencia)));
        let fechas = [];
        for (var i = -6; i < 2; i++) {
            fechas.push(moment(fecahMinima).add(i, 'months').format('MM'));
            labelsMonths.push(moment(fecahMinima).add(i, 'months').format('MMMM'));
        }
        return fechas;
    }
    //agrupa los datos y multiplica por su factor
    calcularAvancePorDia(arreglo, factorTotal) {
        let actividadesDia = [];
        Object.keys(arreglo).map((key3, index) => {
            const arr = arreglo[key3].actividades;

            Object.keys(arr).map((key, index) => {
                let entro = false;
                Object.keys(actividadesDia).map((key2, index) => {
                    if (actividadesDia[key2].fecha === arr[key].fecha) {
                        entro = true;
                        actividadesDia[key2] = { fecha: actividadesDia[key2].fecha, avance: actividadesDia[key2].avance + (arr[key].cantidad * arreglo[key3].avance * arreglo[key3].factor) }
                    }
                });
                if (entro === false)
                    actividadesDia.push({ fecha: arr[key].fecha, avance: arr[key].cantidad * arreglo[key3].avance * arreglo[key3].factor });
            });
        });
        let datos = [];
        let fechas = this.arregloFechaSemana();
        let acumulado = 100;
        Object.keys(fechas).map((key0, index) => {
            let flagRegistro = false;
            Object.keys(actividadesDia).map((key, index) => {
                if (fechas[key0] === actividadesDia[key].fecha) {
                    acumulado = acumulado - Math.round(100 * (actividadesDia[key].avance / factorTotal));
                    datos.push(acumulado);
                    flagRegistro = true;
                }
            });
            if (flagRegistro === false)
                datos.push(acumulado);
        });
        return datos;
    }

    calculoDeAvance() {
        const objs = this.props.listaObjetivo.objetivos;
        let factorSemana = 0;
        //Encontrar factor
        this.setState({ ObjsFactors: [] });
        Object.keys(objs).map((key, index) => {

            let facPrioridad = 1;
            let facDificultad = 1;
            let facRepeticiones = 1;
            let facTipo = 1;
            let facCompartido = objs[key].compartidoEquipo ? objs[key].porcentajeResp * 0.01 : 1;
            let facCalidad = 1;
            let facValidacion = 1;
            let facProductividad = 1;
            let nTareasFinalizados = 0;
            let nTareas = 0;

            //Object.keys(this.state.UtilFactors.Calidad).map((key2, index) =>{});
            Object.keys(this.state.UtilFactors.Dificultad).map((key2, index) => {
                if (objs[key].dificultad === this.state.UtilFactors.Dificultad[key2].concepto)
                    facDificultad = this.state.UtilFactors.Dificultad[key2].valor;
            });
            Object.keys(this.state.UtilFactors.Prioridad).map((key2, index) => {
                if (objs[key].prioridad === key2)
                    facPrioridad = this.state.UtilFactors.Prioridad[key2];
            });
            Object.keys(this.state.UtilFactors.Tipo).map((key2, index) => {
                if (objs[key].tipo === this.state.UtilFactors.Tipo[key2].concepto)
                    facTipo = this.state.UtilFactors.Tipo[key2].valor;
            });
            Object.keys(this.state.UtilFactors.ValidacionGestor).map((key2, index) => {
                if (objs[key].estado === this.state.UtilFactors.ValidacionGestor[key2].concepto)
                    facValidacion = this.state.UtilFactors.ValidacionGestor[key2].valor;
            });
            //algoritmo de medicion del trabajo
            const puntos = ((1 + facPrioridad + facTipo) * facRepeticiones * facDificultad) * facCompartido * facCalidad * facValidacion * facProductividad;

            let actividades = [];
            if (!this.state.TareasObjs)
                return;
            Object.keys(this.state.TareasObjs).map((key2, index) => {
                if (key2 === key) {
                    const ttareas = this.state.TareasObjs[key2];
                    nTareas = Object.keys(ttareas).length;
                    Object.keys(ttareas).map((key3, index) => {
                        if (ttareas[key3].estado === 'finalizado') {
                            let entro = false;
                            Object.keys(actividades).map((key4, index) => {
                                if (actividades[key4].fecha === ttareas[key3].dateEnd) {
                                    entro = true;
                                    actividades[key4] = { fecha: actividades[key4].fecha, cantidad: actividades[key4].cantidad + 1 }
                                }
                            });
                            if (entro === false) {
                                actividades.push({ fecha: ttareas[key3].dateEnd, cantidad: 1 });
                            }
                            nTareasFinalizados++;
                        }
                    });
                }
            });
            const fact = this.state.ObjsFactors;
            fact[key] = { factor: Math.round(puntos), avance: nTareas === 0 ? 0 : 1 / nTareas, actividades, fechafin: objs[key].fechafin, dateEnd: objs[key].dateEnd };
            this.setState({ ObjsFactors: fact })
            factorSemana = factorSemana + Math.round(puntos);
        });
        this.setState({ factorSemana });
    }

    calcularAvancePorMes(arreglo) {
        let factorPlan = [];
        let factorTrab = [];
        const fechas = this.arregloFechaMes();
        Object.keys(fechas).map((key2, index) => {
            let factorP = 0;
            let factorT = 0;
            Object.keys(arreglo).map((key, index) => {
                if (fechas[key2] === moment(arreglo[key].fechafin, "YYYY-MM-DD").format("MM"))
                    factorP = factorP + arreglo[key].factor;
                if (fechas[key2] === moment(arreglo[key].dateEnd, "YYYY-MM-DD").format("MM"))
                    factorT = factorT + arreglo[key].factor;
            });
            factorPlan.push(factorP);
            factorTrab.push(factorT);
        });

        return ({ factorPlan, factorTrab });

    }

    renderGraficaSemana() {
        let datos = [];
        datosPlanificados = [];
        const factorInicial = 100;
        const avanceInicial = 20;
        for (var i = 0; i < 6; i++)
            datosPlanificados.push(factorInicial - (i * avanceInicial));

        datos.push({ label: "Trabajo planificado", data: datosPlanificados, });
        datos.push({ label: "Progreso del trabajo", data: this.calcularAvancePorDia(this.state.ObjsFactors, this.state.factorSemana), hidden: true, });
        this.setState({
            grafica: <div>
                <Checkbox checked={false} className="historico-padding" label='Consultar Histórico' onChange={(e, { checked }) => { this.handleDimmedChange(checked); }} toggle />
                <CrearGrafica labelsX={labelsDias}
                    datos={datos}
                    titleGrafica={"Trabajo (Actividades) vs Dias"}
                    numeroGrafica={'2'}
                    maxLen={'140'}
                    TituloGrafica={"Avance de la semana"}
                />
            </div>
        });
    }



    renderGraficaMeses() {
        let datos = [];

        let dat = this.calcularAvancePorMes(this.state.ObjsFactors);
        datos.push({ label: "Trabajo planificado", data: dat.factorPlan, hidden: true, });
        datos.push({ label: "Trabajo realizado", data: dat.factorTrab });
        this.setState({
            grafica: <div>
                <Checkbox checked={true} className="historico-padding" label='Consultar Histórico' onChange={(e, { checked }) => { this.handleDimmedChange(checked); }} toggle />
                <CrearGrafica labelsX={labelsMonths}
                    datos={datos}
                    titleGrafica={"Objetivo vs Meses"}
                    maxLen={'140'}
                    TituloGrafica={"Avance de tu trabajo Historico"}
                />
            </div>
        });
    }



    renderGestor() {
        return (<DashGestor />);
    }

    handleDimmedChange(checked) {

        this.calculoDeAvance();
        if (checked)
            this.renderGraficaMeses();


        else {
            this.setState({ valueH: false });
            this.renderGraficaSemana();
        }


    }


    arregloSemana() {
        const diat = new Date();
        const ns = this.getWeekNumber(diat);
        let datos = [];
        const arrL = ['Talneto en tus actividades', 'Impacto de mis actividades', 'Responsabilidad en tus actividades', 'Talento grupal', 'Impacto en tu equipo', 'Motivacion en tu equipo', 'Mi talento', 'Mi impacto', 'Mi compromiso'];
        let inicio = 0;
        let limite = 2;
        let valores = [];

        if (ns - 3 > 0) {
            inicio = ns - 2;
            limite = ns + 1;
        }
        for (let index = inicio; index < limite; index++) {
            const an = (new Date).getFullYear() + "-01-01";
            const mm = (moment(an, "YYYY-MM-DD").add('days', index * 7).week() - (moment(an, "YYYY-MM-DD").add('days', index * 7).month() * 4));
            Object.keys(this.state.ticUsuario).map((key, index2) => {
                const valores = [];

                if (parseInt(key) === index) {
                    valores.push(this.state.ticUsuario[key].talentoE ? this.state.ticUsuario[key].talentoE.valorC * 20 : 10);
                    valores.push(this.state.ticUsuario[key].talentoT ? this.state.ticUsuario[key].talentoT.valorC * 20 : 10);
                    valores.push(this.state.ticUsuario[key].talentoF ? this.state.ticUsuario[key].talentoF.valorC * 20 : 10);

                    valores.push(this.state.ticUsuario[key].impactoT ? this.state.ticUsuario[key].impactoT.valorC * 20 : 10);
                    valores.push(this.state.ticUsuario[key].impactoE ? this.state.ticUsuario[key].impactoE.valorC * 20 : 10);
                    valores.push(this.state.ticUsuario[key].impactoF ? this.state.ticUsuario[key].impactoF.valorC * 20 : 10);

                    valores.push(this.state.ticUsuario[key].compromisoF ? this.state.ticUsuario[key].compromisoF.valorC * 20 : 10);
                    valores.push(this.state.ticUsuario[key].compromisoE ? this.state.ticUsuario[key].compromisoE.valorC * 20 : 10);
                    valores.push(this.state.ticUsuario[key].compromisoT ? this.state.ticUsuario[key].compromisoT.valorC * 20 : 10);

                    const lab = 'Sen ' + (mm - 2) + '. ' + moment(an, "YYYY-MM-DD").add('days', index * 7).format('MMMM');
                    datos.push({ label: "MIT " + lab, data: valores });
                }
            });

        }
        return { arrL, datos };
    }

    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name })
        this.calculoDeAvance();
        console.log(name);
        if (name === 'semana') {
            this.renderGraficaSemana();
        }

        else if (name === 'MIT') {
            let datos = [];
            const trab = this.arregloSemana();
            datos = trab.datos;

            const graficaG = <CrearGrafica2 labelsX={trab.arrL}
                datos={datos}
                titleGrafica={"Medida MIT (Progreso)"}
                TituloGrafica={"Motivacion, Impacto, Talento (MIT)"}

            />;
            this.setState({ grafica: graficaG })

        }

    }

    getWeekNumber(date) {
        var d = new Date(date);  //Creamos un nuevo Date con la fecha de "this".
        d.setHours(0, 0, 0, 0);   //Nos aseguramos de limpiar la hora.
        d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Recorremos los días para asegurarnos de estar "dentro de la semana"
        //Finalmente, calculamos redondeando y ajustando por la naturaleza de los números en JS:
        return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
    };

    renderProgresoTrabajo() {
        return (<div style={{ width: '100%' }}>
            <Menu pointing secondary>
                <Menu.Item name='semana' active={this.state.activeItem === 'semana'} onClick={this.handleItemClick} />
                <Menu.Item
                    name='MIT'
                    active={this.state.activeItem === 'MIT'}
                    onClick={this.handleItemClick}
                />
            </Menu>
            <Segment attached='bottom'>

                {this.state.grafica}
            </Segment>
        </div>)
    }

    renderListaObjetivos(aling) {

        return (
            <ListImportan
                titulo={'Lista de tus objetivos de la semana'}
                icono={'thumbtack'}
                alingD={aling}
            />
        );
    }

    renderListaActividades(aling) {

        return (
            <ListaActividades
                titulo={'Lista de las actividades del día'}
                icono={'thumbtack'}
                alingD={aling}
            />
        );
    }

    renderGraficaTIC() {
        let datos = [];
        datos.push({ label: "Motivacion", data: datosG3, hidden: true, });
        datos.push({ label: "Impacto", data: datosG33 });
        datos.push({ label: "Talento", data: datosG333 });

        return (
            <CrearGrafica2 labelsX={labelsMonths}
                datos={datos}
                fuerza={0.25}
                titleGrafica={"MIT vs Progreso"}
                maxLen={'140'}
                TituloGrafica={"Motivacion, Impacto, Talento (MIT)"}
            />
        );
    }

    renderformaciones() {
        return (
            <ListEjemplo
                titulo={'Listado de formaciones'}
                icono={'leanpub'}

            />
        );
    }
    handleItemClick2 = (e, { name }) => this.setState({ activeItem: name })
    renderTeletrabajador() {
        //   <iframe className="yellow4" title="Ultimos archivos subidos" src={this.props.usuarioDetail ? `https://drive.google.com/embeddedfolderview?id=${this.props.usuarioDetail.linkws}#grid` : null}

        return (

            <div>

                <div className="ui form">
                    <div className="two column stackable ui grid">
                        <div className="column two wide">
                            <div className="ui segment" style={{ width: "11em", background: 'linear-gradient(to top, rgb(247, 203, 122) 0.5%, rgb(255, 255, 255) 0.6%, rgb(245, 242, 224) 200%)' }}>


                                <Menu text vertical style={{ width: "11em" }}>
                                    <Menu.Item header>Recuros</Menu.Item>


                                    <Modal trigger={<div>
                                        <Menu.Item
                                            name='Progreso'
                                            active={this.state.activeItem2 === 'Progreso'}
                                            onClick={(e, { name }) => { this.handleTareas(); this.handleItemClick2(e, name); }}
                                        >
                                            <Icon name="line graph"></Icon>
                                            Progreso
                                    </Menu.Item>

                                    </div>

                                    }
                                        open={this.state.open}
                                    >
                                        <Modal.Content image style={{ height: '740px' }}>
                                            {this.renderProgresoTrabajo()}
                                        </Modal.Content>
                                        <Modal.Actions>
                                            <Button onClick={() => { this.setState({ open: false }) }} negative>
                                                Salir
                                         </Button>
                                        </Modal.Actions>
                                    </Modal>
                                    <Modal trigger={<div>
                                        <Menu.Item
                                            name='Formacíon'
                                            active={this.state.activeItem2 === 'Formacíon'}
                                            onClick={(e, name) => { this.handleItemClick2(e, name); this.setState({ open2: true }); }}
                                        >
                                            <Icon name="book"></Icon>
                                            Formacion
                                        </Menu.Item>
                                        <Label style={{ position: 'absolute', color: 'rgb(80, 0, 99)', top: '85px', left: '120px', background: 'linear-gradient(to top, rgb(253, 205, 98) 5%, rgb(255, 255, 255) 20%)' }}>
                                            {this.props.listaFormacion ? Object.keys(this.props.listaFormacion).length : 0}
                                        </Label>
                                    </div>
                                    }
                                        open={this.state.open2}
                                        style={{ width: '350px' }}
                                    >
                                        <Modal.Content image style={{ height: '510px' }}>
                                            {this.renderformaciones()}
                                        </Modal.Content>
                                        <Modal.Actions>
                                            <Button onClick={() => { this.setState({ open2: false }) }} negative>
                                                Salir
                                         </Button>
                                        </Modal.Actions>
                                    </Modal>


                                    <Modal trigger={<div>
                                        <Menu.Item
                                            name='Calendario'
                                            active={this.state.activeItem2 === 'Calendario'}
                                            onClick={(e, name) => { this.handleItemClick2(e, name); this.setState({ open3: true }); }}
                                        >
                                            <Icon name="calendar alternate"></Icon>
                                            Calendario
                                        </Menu.Item>

                                    </div>
                                    }
                                        open={this.state.open3}
                                        style={{ width: '390px' }}
                                    >
                                        <Modal.Content image style={{ height: '400px' }}>
                                            <Calendario2 className="tamaño-Calendario" />
                                        </Modal.Content>
                                        <Modal.Actions>
                                            <Button onClick={() => { this.setState({ open3: false }) }} negative>
                                                Salir
                                         </Button>
                                        </Modal.Actions>
                                    </Modal>
                                </Menu>

                            </div>
                        </div>
                        <div className="column nine wide" style={{ left: '20px' }} >
                            <div className="ui segment" style={{ position : 'relative', top: '150px' }}>
                                {this.renderListaObjetivos()}
                            </div>
                        </div>
                        <div className="column five wide">
                            <div className="ui segment" style={{ position: 'relative', height: '54.8em', 'background': 'linear-gradient(to top, rgb(247, 203, 122) 0.5%, rgb(255, 255, 255) 0.6%, rgb(245, 242, 224) 200%)' }}  >
                                {this.renderListaActividades()}
                            </div>
                        </div>


                    </div>
                </div >
            </div >

        );
    }


    handleClose = () => {
        this.timeout = setTimeout(() => {
            this.props.chatOff();
        }, timeoutLength)
    }

    handlePaso2 = () => {
        this.timeout = setTimeout(() => {
            this.setState({ activo: true });
        }, timeoutLength2)
    }

    handlePaso3 = () => {
        this.timeout = setTimeout(() => {
            // this.props.chatOn();
            this.setState({ activo: null });
        }, timeoutLength2)
    }

    handlePaso5 = () => {
        this.timeout = setTimeout(() => {
            this.setState({ comenzo: false });
            this.setState({ activo: true });
        }, timeoutLength4)
    }

    handleFinal = () => {
        this.timeout = setTimeout(() => {
            this.props.pasoOnboardings(null);

            var updates = {};
            const postData = {
                ...this.props.usuarioDetail.usuario,
                onboarding: true,
            };
            updates[`Usuario/${this.props.usuarioDetail.idUsuario}`] = postData;
            firebase.database().ref().update(updates);

        }, timeoutLength5)
    }






    render() {
        let varriable
        let onboarding = null;
        let styleS = {
            position: 'fixed',
            margin: '0.5em',
            bottom: '10%',
            right: '40%',
            'z-index': '6',
        }

        let bt;





        if (this.props.usuarioDetail && this.props.usuarioDetail.rol === '3') {



            let pageActivi = null;
            let pageAux0 = null;
            let pageAux = null;

            if (this.props.usuarioDetail.usuario.onboarding === false) {

                const tOn = "Hola " + this.props.usuarioDetail.usuario.usuario + " soy huper, ";
                const tOn2 = "te apoyare en el trabajo que debas realizar ";
                const tOn3 = "para comenzar... ";

                const tOn4 = "Nuestra metodología es basada en Ivy lee ";
                const tOn5 = "Empecemos...";
                const tOn6 = "'Muéstrame el camino para hacer más cosas' -- Ivy lee";
                const tOn7 = "Cada día antes de terminar, Planifica";
                const tOn8 = "Las actividades más importantes del día siguiente. ";
                const tOn9 = "...Recuerda solo 6 ";
                const tOn10 = "Prioriza las actividades de acuerdo con su importancia real. ";
                const tOn11 = "Te quedan 6 actividades por planificar, Animo...!";
                const tOn12 = "Así de fácil es crear una actividad.";
                const tOn13 = "Quisiéramos conocerte más...";
                const tOn14 = "Por ultimo.";
                const tOn15 = "En el menú lateral, tendrás todos los recursos para ti";
                const tOn16 = "Queremos que siempre te sigas actualizando.";
                const tOn17 = "Eso es todo " + this.props.usuarioDetail.usuario.usuario;
                const tOn18 = "a trabajar...";



                if (!this.props.pasoOnboarding || this.props.pasoOnboarding < 5) {
                    pageAux0 = <div style={{ transform: 'scale(3)' }}>
                        <ReactRotatingText onTypingEnd={() => {
                            const paso = this.props.pasoOnboarding ? this.props.pasoOnboarding : 0;
                            this.props.pasoOnboardings(paso + 1)

                        }} pause={2000} items={[tOn, tOn2, tOn3, tOn4, tOn5]} />
                    </div>


                    if (this.props.pasoOnboarding === 4) {

                        pageAux = <div style={{ transform: 'scale(1.2)', 'font-style': 'italic', top: '100px', position: 'relative' }}>
                            <ReactRotatingText onTypingEnd={() => {
                            }} items={[tOn6]} />
                        </div>
                    }

                }


                else if (this.props.pasoOnboarding >= 5 && this.props.pasoOnboarding < 10) {

                    let pausa = 4000;
                    pageAux0 = <div style={{ transform: 'scale(3)' }}>
                        <ReactRotatingText onTypingEnd={() => {
                            const paso = this.props.pasoOnboarding ? this.props.pasoOnboarding : 0;
                            this.props.pasoOnboardings(paso + 1)

                        }}
                            pause={pausa} items={[tOn7, tOn8, tOn9, tOn11, "   "]} />

                    </div>

                    if (this.props.pasoOnboarding === 8) {
                        pageAux = <div style={{ transform: 'scale(1.2)', 'font-style': 'italic', top: '100px', position: 'relative' }}>
                            <ReactRotatingText items={[tOn10]} />
                        </div>
                    }

                }



                if (this.props.pasoOnboarding === 10) {
                  
                     pageAux = <div style={{ transform: 'scale(1.3)', height: '700px', width: '1000px' }}>
                        <MenuChat />
                    </div>
                }



                else if (this.props.pasoOnboarding >= 11 && this.props.pasoOnboarding < 14) {
                    let pausa = 5000;
                    pageAux0 = <div style={{ transform: 'scale(3)' }}>
                        <ReactRotatingText onTypingEnd={() => {
                            const paso = this.props.pasoOnboarding ? this.props.pasoOnboarding : 0;
                            this.props.pasoOnboardings(paso + 1)

                        }}
                            pause={pausa} items={[tOn12, tOn13, "   "]} />
                    </div>
                }

                if (this.props.pasoOnboarding === 14) {
                    pageAux = <div style={{ transform: 'scale(1.3)', height: '700px', width: '1000px' }}>
                        <MenuChat />
                    </div>
                }


                else if (this.props.pasoOnboarding >= 15 && this.props.pasoOnboarding < 21) {

                    let pausa = 5000;
                    pageAux0 = <div style={{ transform: 'scale(3)' }}>
                        <ReactRotatingText onTypingEnd={() => {
                            const paso = this.props.pasoOnboarding ? this.props.pasoOnboarding : 0;
                            this.props.pasoOnboardings(paso + 1)

                        }}
                            pause={pausa} items={[tOn14, tOn15, tOn16, tOn17, tOn18, "   "]} />
                    </div>
                }

                if (this.props.pasoOnboarding === 21) {
                    firebase.database().ref(`Usuario/${this.props.usuarioDetail.idUsuario}`).set({
                        ...this.props.usuarioDetail.usuario, onboarding: true
                    })
                }

                pageActivi = <Dimmer active={true} page>

                    {pageAux0}
                    {pageAux}

                </Dimmer >

            }
            else if (!this.props.MensajeIvily && !this.props.listaObjetivo) {
                pageActivi = <Dimmer active={true} page>
                    <h1>Bienvenido</h1>

                </Dimmer>
            }
            else if ((this.props.MensajeIvily && this.props.MensajeIvily.nActIVi && this.props.MensajeIvily.nActIVi < 6) || !this.props.listaObjetivo || !this.props.listaObjetivo.objetivos) {
                let xAct = 6
                this.props.estadochats('dimmer Plan');
                if (this.props.MensajeIvily && this.props.MensajeIvily.nActIVi)
                    xAct = 6 - this.props.MensajeIvily.nActIVi;
                pageActivi = <Dimmer active={true} page>
                    <h2>Te quedan {xAct} actividades por planificar</h2>
                    <h1>¡Animo!</h1>
                    <MenuChat />
                </Dimmer>
            }

            varriable = <div>
                {pageActivi}
                {this.renderTeletrabajador()}
            </div>







        }
        else if (this.props.usuarioDetail && this.props.usuarioDetail.rol === '2') {


            let pageActivi = null;
            let pageAux0 = null;
            let pageAux = null;

            if (this.props.usuarioDetail.usuario.onboarding === false) {

                const tOn = "Hola " + this.props.usuarioDetail.usuario.usuario + " soy huper, ";
                const tOn2 = "te apoyare en gestionar a tu equipo ";
                const tOn3 = "para comenzar... ";
                const tOn4 = "Nuestra metodología es basada en Ivy lee ";
                const tOn5 = "Empecemos...";
                const tOn6 = "'Muéstrame el camino para hacer más cosas' -- Ivy lee";
                const tOn7 = "Conmigo podrás, crear objetivos para tu equipo en menos 30 segundos,";
                const tOn8 = "Dar feedback a tus colaboradores";
                const tOn9 = "y seguir su trabajo de una forma mas cercana";
                const tOn10 = "Empecemos creando un objetivo...";
                const tOn11 = "Así de fácil es crear un objetivo para tu equipo,";
                const tOn12 = "podrás visualizar el avance y detalle del trabajo,";
                const tOn13 = "O mirar y validar el progreso de tu equipo";
                const tOn14 = "Por ultimo.";
                const tOn15 = "No solo podrás ver los indicadores,";
                const tOn16 = "Tendrás a la mano formaciones personalizadas para tus colaboradores";
                const tOn17 = "Eso es todo " + this.props.usuarioDetail.usuario.usuario;
                const tOn18 = "a trabajar...";



                if (!this.props.pasoOnboarding || this.props.pasoOnboarding < 5) {
                    pageAux0 = <div style={{ transform: 'scale(3)' }}>
                        <ReactRotatingText onTypingEnd={() => {
                            const paso = this.props.pasoOnboarding ? this.props.pasoOnboarding : 0;
                            this.props.pasoOnboardings(paso + 1)

                        }} pause={2000} items={[tOn, tOn2, tOn3, tOn4, tOn5]} />
                    </div>


                    if (this.props.pasoOnboarding === 4) {

                        pageAux = <div style={{ transform: 'scale(1.2)', 'font-style': 'italic', top: '100px', position: 'relative' }}>
                            <ReactRotatingText onTypingEnd={() => {
                            }} items={[tOn6]} />
                        </div>
                    }

                }


                else if (this.props.pasoOnboarding >= 5 && this.props.pasoOnboarding < 10) {

                    let pausa = 4000;
                    pageAux0 = <div style={{ transform: 'scale(3)' }}>
                        <ReactRotatingText onTypingEnd={() => {
                            const paso = this.props.pasoOnboarding ? this.props.pasoOnboarding : 0;
                            this.props.pasoOnboardings(paso + 1)

                        }}
                            pause={pausa} items={[tOn7, tOn8, tOn9, tOn10, "   "]} />

                    </div>

                }



                if (this.props.pasoOnboarding === 10) {
                    pageAux = <div style={{ transform: 'scale(1.3)', height: '700px', width: '1000px' }}>
                        <MenuChat />
                    </div>
                }



                else if (this.props.pasoOnboarding >= 11 && this.props.pasoOnboarding < 20) {
                    let pausa = 5000;
                    pageAux0 = <div style={{ transform: 'scale(3)' }}>
                        <ReactRotatingText onTypingEnd={() => {
                            const paso = this.props.pasoOnboarding ? this.props.pasoOnboarding : 0;
                            this.props.pasoOnboardings(paso + 1)

                        }}
                            pause={pausa} items={[tOn11, tOn12, tOn13, tOn14, tOn15, tOn16, tOn17, tOn18, "   "]} />
                    </div>
                }



                if (this.props.pasoOnboarding === 20) {
                    firebase.database().ref(`Usuario/${this.props.usuarioDetail.idUsuario}`).set({
                        ...this.props.usuarioDetail.usuario, onboarding: true
                    })
                }

                pageActivi = <Dimmer active={true} page>

                    {pageAux0}
                    {pageAux}

                </Dimmer >

            }


            varriable = <div>
                {pageActivi}
                {this.renderGestor()}
            </div>









        }






        return (
            <div> {varriable}

            </div >

        );

    }
};

const mapStateToProps = (state) => {
    return {
        userId: state.auth.userId,
        pasoOnboarding: state.chatReducer.pasoOnboarding,
        listaFormacion: state.chatReducer.listaFormacion,
        listaObjetivo: state.chatReducer.listaObjetivo,
        usuarioDetail: state.chatReducer.usuarioDetail,
        MensajeIvily: state.chatReducer.MensajeIvily,
        isSignedIn: state.auth.isSignedIn,

    };
};
export default connect(mapStateToProps, { signOut, pasoOnboardings, chatOff, chatOn, listaFormaciones, estadochats })(DashBoard);

///<ListAdjuntos />