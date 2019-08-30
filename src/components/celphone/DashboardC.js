import React from 'react';
import { connect } from 'react-redux';
import { createStream, chatOff, chatOn } from '../../actions';
import ListImportan from '../utilidades/listaImportante';
import ListEjemplo from '../utilidades/ListaEjemplo';
import CrearGrafica from '../utilidades/CrearGrafica';
import CrearGrafica2 from '../utilidades/CrearGrafica2';
import '../styles/ingresoHupity.css';
import randomScalingFactor from '../../lib/randomScalingFactor';

import ListaActividades from './actividades';
import DashGestor from '../gestorModules/dashboardG';
import firebase from 'firebase';
import moment from 'moment';
import history from '../../history';
import construccion from '../../images/construccion.JPG'



import { Popup, Modal, Menu, Segment, Button, Dimmer, Header, Icon, Image, Input, Step, Label, Checkbox, List } from 'semantic-ui-react';
import MenuChat from '../MenuChat';
import { pasoOnboardings, listaFormaciones, prioridadObjs, estadochats, listaObjetivos, objTIMs, datosEditCels } from '../modules/chatBot/actions';
import unsplash from '../../apis/unsplash';


import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';
import { Link } from 'react-router-dom';

import { CircularProgressbar, buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import AnimatedProgressProvider from "./AnimatedProgressProvider";
import MenuEditObjeto from './menuEditO';

import { easeQuadInOut } from "d3-ease";

const timeoutLength3 = 100000;
const timeoutLength1 = 1000;
const timeoutLength6 = 3000;

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
        WorkFlow: null,
        images: null,
        buscar: ['company', 'business', 'worker', 'formal',],
        ubicacionT: 20,
        ubicacionTT: '12em',
        ver: null,
        titulo: null,
        detalleO: null,
        objetivoS: null,
        cambio: 0,
        factores: null,
    }



    handleCloseMenu = () => {
        this.setState({ open: false })
        this.setState({ open2: false })
        this.setState({ open3: false })
    }

    onSearchSubmit = async () => {
        const response = await unsplash.get('/search/photos', {
            params: { query: this.state.buscar[this.props.prioridadObj] },

        });
        this.setState({ images: response.data.results })
        // console.log(this.state.images);
    }

    componentDidMount() {
        if (!this.props.isSignedIn) {
            history.push('/');
            return;
        }

        this.onSearchSubmit()
        // console.log(this.example2);
        let variable = {};


        //    history.push('/login');

        const starCountRef4 = firebase.database().ref().child(`Utilidades-Valoraciones`);
        starCountRef4.on('value', (snapshot) => {
            this.setState({ UtilFactors: snapshot.val() });
        });


        const starCountRef = firebase.database().ref().child(`Usuario-Objetivos/${this.props.userId}`);
        starCountRef.on('value', (snapshot) => {

            const ObjTrabajo = snapshot.val();
            let objetivos = [];
            if (!snapshot.val()) return;
            Object.keys(ObjTrabajo).map(function (key2, index) {
                if (ObjTrabajo[key2].compartidoEquipo) {
                    const starCountRef = firebase.database().ref().child(`Usuario-Objetivos/${ObjTrabajo[key2].idUsuarioGestor}/${ObjTrabajo[key2].objetivoPadre}`);
                    starCountRef.on('value', (snapshot) => {
                        if (snapshot.val()) {
                            const resultado2 = { ...ObjTrabajo[key2], avancePadre: snapshot.val().avance }
                            objetivos[key2] = { ...resultado2 };
                        }
                    });

                }
                else {
                    objetivos[key2] = { ...ObjTrabajo[key2] };
                }

            });

            variable = { ...variable, objetivos }
            this.props.listaObjetivos(variable);
        });

        const starCountRef2 = firebase.database().ref().child(`Usuario-Tareas/${this.props.userId}`);
        starCountRef2.on('value', (snapshot) => {
            variable = { ...variable, tareas: snapshot.val() }
            this.props.listaObjetivos(variable);
        });

        const starCountRef3 = firebase.database().ref().child(`Usuario-Flujo-Trabajo/${this.props.userId}`);
        starCountRef3.on('value', (snapshot) => {
            this.setState({ WorkFlow: snapshot.val() });
        });

        //carga el limite que las empresas definan
        datosPlanificados = [];
        const factorInicial = 100;
        const avanceInicial = 20;
        for (var i = 0; i < 6; i++)
            datosPlanificados.push(factorInicial - (i * avanceInicial));

        this.handleActualizar();
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


    calculoDeAvance2() {
        if (!this.props.listaObjetivo) return;
        const objs = this.props.listaObjetivo.objetivos;
        let factorEqHup = [];
        //Encontrar factor
        this.setState({ ObjsFactors: [] });
        if (objs)
            Object.keys(objs).map((key, index) => {

                if (!objs[key] || !objs[key].concepto)
                    return;

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
                factorEqHup.push({ key, puntos, usuario: objs[key].idUsuario })

            });


        this.setState({ factores: factorEqHup })
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
                />
            </div>
        });
    }



    renderGestor() {
        return (<Image src={construccion}></Image>);
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
    consultarMenus() {
        const messages = document.getElementById('formScrol');
        //  messages.scrollTop = messages.scrollHeight;
        this.setState({ ubicacionTT: messages.scrollTop > 100 ? '30em' : '12em' })
        this.setState({ ubicacionT: messages.scrollTop > 100 ? -280 : 20 })
    }
    renderTeletrabajador() {
        //   <iframe className="yellow4" title="Ultimos archivos subidos" src={this.props.usuarioDetail ? `https://drive.google.com/embeddedfolderview?id=${this.props.usuarioDetail.linkws}#grid` : null}



        return (

            <div>
                <div className="ui form" onScrollCapture={() => { this.consultarMenus() }}>
                    <div className="two column stackable ui grid">
                        <div className="column five wide">
                            <div className="ui segment" id="formScrol" style={{
                                position: 'relative', width: '100%', overflow: 'auto',
                                top: this.state.ubicacionT, height: this.state.ubicacionTT, 'background': 'linear-gradient(to top, rgb(247, 203, 122) 1%, rgb(255, 255, 255) 5%, rgb(245, 242, 224) 2000%)'
                            }}  >
                                {this.renderListaActividades()}
                            </div>
                        </div>
                    </div>
                </div >
            </div >

        );
    }




    TIMOBJ = () => {
        this.timeout = setTimeout(() => {
            this.props.chatOn();
        }, timeoutLength1)
    }
    // habilita el tercer paso
    handleActualizar = () => {
        this.timeout = setTimeout(() => {
            this.calculoDeAvance2();
        }, timeoutLength1)
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
        if (window.screen.width < 450) {
            styleS.right = '35%';
            styleS.bottom = '2.5%';
        }

        if (this.state.comenzo)
            bt = <button className="ui button purple huge" style={styleS} onClick={() => {
                if (this.props.pasoOnboarding === 5) this.setState({ comenzo: false });
                if (!this.state.estadoCel)
                    this.props.pasoOnboardings(this.props.pasoOnboarding + 1);
            }} >Continuar</button>;


        if (this.props.userRol === '3') {


            let pageActivi = null
            if (!this.props.MensajeIvily && !this.props.listaObjetivo) {
                /*    pageActivi = <Dimmer active={true} page>
                        <h1>Bienvenido</h1>
                        <MenuChat />
                    </Dimmer>*/
            }
            else if ((this.props.MensajeIvily && this.props.MensajeIvily.nActIVi && this.props.MensajeIvily.nActIVi < 6)) {
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
        else if (this.props.userRol === '2') {
            varriable = this.renderGestor();
            varriable = <Image src={construccion}></Image>
            //    console.log('Teletrabajador');
        }



        //   <button>{item.button}</button>
        if (!this.state.images || !this.props.listaObjetivo || !this.props.listaObjetivo.objetivos || !this.props.listaObjetivo.tareas)
            return <div></div>;

        let content2 = this.props.listaObjetivo.objetivos;
        let indice = -1;
        let factor = {};
        //  const detalleOO =  cconsulta[key2].estado ? cconsulta[key2].estado : '';
        let tareasCompleta = 0;
        let resultado = 0;




        let percentage = 15;


        return (
            <div>
                <div style={{ width: '80%', left: '10%', position: 'relative', visibility: this.state.ubicacionT === -280 ? 'hidden' : 'visible' }}>
                    <Slider direction="horizontal" >

                        {

                            Object.keys(content2).map((key, index) => {

                                indice++;
                                if (indice > 7) indice = 0;

                                //Impacto de las activiadades
                                let iconoImpacto;
                                let colorImpacto;
                                let flagObjetivosTerminados;
                                if (content2[key].impacto === "Negocío") { iconoImpacto = "money bill alternate"; colorImpacto = "green"; }
                                else if (content2[key].impacto === "Proceso") { iconoImpacto = "cogs"; colorImpacto = "blue"; }
                                else if (content2[key].impacto === "Organización") { iconoImpacto = "boxes"; colorImpacto = "purple"; }
                                else if (content2[key].impacto === "Ventas") { iconoImpacto = "hospital outline"; colorImpacto = "yellow"; }


                                //factor de progreso por horas 
                                let factorSemana = 0;
                                let factorObjetivo = 0;

                                if (this.state.factores !== null) {
                                    Object.keys(this.state.factores).map((keyfac, index) => {
                                        if (content2[key].idUsuario === this.state.factores[keyfac].usuario)
                                            factorSemana = factorSemana + this.state.factores[keyfac].puntos;

                                        if (key === this.state.factores[keyfac].key)
                                            factorObjetivo = this.state.factores[keyfac].puntos;

                                    });

                                }


                                if (this.props.listaObjetivo.tareas) {

                                    Object.keys(this.props.listaObjetivo.tareas).map((key3, index) => {

                                        const consultaTareaTT = this.props.listaObjetivo.tareas[key3];
                                        Object.keys(consultaTareaTT).map((key33, index) => {
                                            if (key3 === key) {
                                                if (consultaTareaTT[key33].estado === 'finalizado') {
                                                    tareasCompleta = tareasCompleta + 1;
                                                }
                                            }
                                        });
                                        const horasAtrabajar = 40;
                                        const horasObj = horasAtrabajar * (factorObjetivo / factorSemana);
                                        const atrabajo = Math.round(horasObj) / 3;
                                        const atrabajo2 = ((Math.round(horasObj) * 0.35) / 2) + 1;
                                        let resul = 15;


                                        if (atrabajo < tareasCompleta) {
                                            const ob = (tareasCompleta - atrabajo) / atrabajo2 > 1 ? 1 : (tareasCompleta - atrabajo) / atrabajo2;
                                            resul = 65 + Math.round(ob * 35);
                                        }

                                        else
                                            resul = Math.round((tareasCompleta / atrabajo) * 65);

                                        factor = { factor: factorObjetivo, numero: tareasCompleta };
                                        resultado = content2[key].avance ? resultado : resul;

                                        if (resultado === 100 && !content2[key].estadoTIM && this.props.estadochat !== 'TIM objetivo') {
                                            this.props.estadochats('TIM objetivo');
                                            this.props.objTIMs({ obj: content2[key], key });
                                            //  this.TIMOBJ();
                                        }

                                        percentage = resultado;


                                    });
                                    if (resultado < 100)
                                        flagObjetivosTerminados = false;
                                    else if (resultado >= 100) {
                                        flagObjetivosTerminados = true;
                                    }

                                }

                                if (flagObjetivosTerminados === true)
                                    this.props.estadochats('Objetivos Terminados');

                                let verTres = null;

                                if (!isNaN(percentage)) {
                                    percentage = percentage < 10 ? 15 : percentage;
                                    verTres = <div>
                                        <div style={{ color: colorImpacto, left: '30%', position: 'absolute', transform: 'scale(1.1)', top: '44%' }}>
                                            {content2[key].impacto}
                                            <Icon name={iconoImpacto} style={{ left: '10px', position: 'relative' }} />
                                        </div>
                                        <div style={{
                                            transform: 'scale(0.3)', position: 'relative', left: '46%', top: !content2[key].detalle || Object.keys(content2[key].detalle).length < 40 ? Object.keys(content2[key].concepto).length < 20 ? '7em' : '5em' : '1em'
                                        }}>
                                            <AnimatedProgressProvider
                                                valueStart={0}
                                                valueEnd={percentage}
                                                duration={3.4}
                                                easingFunction={easeQuadInOut}

                                            >

                                                {value => {
                                                    const roundedValue = Math.round(value);
                                                    return (
                                                        <CircularProgressbar
                                                            value={value}
                                                            text={`${roundedValue}%`}
                                                            strokeWidth={15}
                                                            styles={buildStyles({
                                                                textColor: "#fdfded",
                                                                pathColor: colorImpacto,
                                                                trailColor: "#fdfded"
                                                            })}
                                                        /* This is important to include, because if you're fully managing the
                                                  animation yourself, you'll want to disable the CSS animation. */

                                                        />
                                                    );
                                                }}
                                            </AnimatedProgressProvider>


                                        </div>

                                        <Link to="/editObj"  >
                                            < Button content="Editar" fluid style={{
                                                position: 'relative', background: 'linear-gradient(to right, rgba(255, 255, 255, 0.63) 35%, rgba(243, 234, 221, 0) 110%)', transform: 'scale(1.2)', 'border-radius': '10px',
                                                color: '#080807', width: '60%', left: '20%', top: !content2[key].detalle || Object.keys(content2[key].detalle).length < 40 ? Object.keys(content2[key].concepto).length < 20 ? '-90px' : '-115px' : '-155px'
                                            }}
                                                icon='edit outline'
                                                onClick={() => {
                                                    this.props.datosEditCels({
                                                        imageEdit: this.state.images, indexImage: index > 7 ? 0 : index, detalleObjetivo: content2[key].detalle,
                                                        keyFirsth: key, objetivoK: content2[key]
                                                    })
                                                }}
                                            >
                                            </Button>
                                        </Link>
                                    </div>

                                }
                                return <div>
                                    <div
                                        key={index}
                                        style={{ height: '28em', filter: 'contrast(40%)', background: `url('${this.state.images[indice].urls.regular}') no-repeat center center` }}
                                    >
                                        <h3 style={{ 'text-align': 'center', color: 'black', top: '1em', position: 'relative' }}> Tus Objetivos Semanales</h3>

                                    </div>
                                    <div style={{ top: '-24em', position: 'relative', left: '14%', width: '75%' }}>
                                        <h2 style={{ color: "#fdfded", 'text-align': 'center' }}>{content2[key].concepto}</h2>
                                        <p style={{ color: "#fdfded", 'text-align': 'center' }}>{content2[key].detalle ? content2[key].detalle : 'no tiene ningun detalle relacionado'}</p>
                                        {verTres}


                                    </div>
                                </div>

                            })
                        }
                    </Slider>

                </div>

                {varriable}
                {onboarding}
            </div >

        );

    }
};

const mapStateToProps = (state) => {
    return {
        usuarioDetail: state.chatReducer.usuarioDetail,
        userRol: state.chatReducer.userRol,
        userId: state.auth.userId,
        pasoOnboarding: state.chatReducer.pasoOnboarding,
        listaFormacion: state.chatReducer.listaFormacion,
        listaObjetivo: state.chatReducer.listaObjetivo,
        usuarioDetail: state.chatReducer.usuarioDetail,
        MensajeIvily: state.chatReducer.MensajeIvily,
        prioridadObj: state.chatReducer.prioridadObj,
        nombreUser: state.chatReducer.nombreUser,
        isSignedIn: state.auth.isSignedIn,

    };
};
export default connect(mapStateToProps, { createStream, listaObjetivos, objTIMs, datosEditCels, estadochats, prioridadObjs, pasoOnboardings, chatOff, chatOn, listaFormaciones, estadochats })(DashBoard);

///<ListAdjuntos />