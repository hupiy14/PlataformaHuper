import React from 'react';
import { connect } from 'react-redux';
import { createStream, chatOff, chatOn, signOut } from '../../actions';
import ListImportan from '../utilidades/listaImportante';
import ListEjemplo from '../utilidades/ListaEjemplo';
import CrearGrafica from '../celphone/grafica';
import CrearGraficaH from '../celphone/graficaHc';
import CrearGraficaTIM from '../celphone/graficaMITC';
import '../styles/ingresoHupity.css';
import ListaActividades from '../HuperModules/actividadesHuper';
import DashGestor from '../gestorModules/dashboardG';
import Hupps from '../modules/Hupps';
import firebase from 'firebase';
import moment from 'moment';
import history from '../../history';
import { Grid, Modal, Menu, Segment, Button, Dimmer, Header, Icon, Image, Portal, Step, Label, Checkbox } from 'semantic-ui-react';
import MenuChat from '../MenuChat';
import { pasoOnboardings, listaFormaciones, estadochats } from '../modules/chatBot/actions';


var ReactRotatingText = require('react-rotating-text');

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
        this.handleTareas();
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
                this.setState({ ticUsuario: snapshot2.val() ? snapshot2.val() : [] })
            });
            this.calculoDeAvance();
            this.renderGraficaSemana();
            this.setState({ open: true });
        }, timeoutLength6)
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
        let acumulado = 0;
        Object.keys(fechas).map((key0, index) => {
            let flagRegistro = false;
            Object.keys(actividadesDia).map((key, index) => {
                if (fechas[key0] === actividadesDia[key].fecha) {
                    acumulado = acumulado + Math.round(100 * (actividadesDia[key].avance / factorTotal));
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

        datos.push({ name: "Trabajo planificado", data: datosPlanificados, });
        datos.push({ name: "Progreso del trabajo", data: this.calcularAvancePorDia(this.state.ObjsFactors, this.state.factorSemana), hidden: true, });
        this.setState({
            grafica: <div style={{ height: '34em'}}>
                <Checkbox style={{ left: '-130px' }} checked={false} className="historico-padding" label='Histórico' onChange={(e, { checked }) => { this.handleDimmedChange(checked); }} toggle />
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
        datos.push({ name: "Trabajo planificado", data: dat.factorPlan, hidden: true, });
        datos.push({ name: "Trabajo realizado", data: dat.factorTrab });
        this.setState({
            grafica: <div style={{ height: '34em'}}>
                <Checkbox style={{ left: '-130px' }} checked={true} className="historico-padding" label='Histórico' onChange={(e, { checked }) => { this.handleDimmedChange(checked); }} toggle />
                <CrearGraficaH labelsX={labelsMonths}
                    datos={datos}
                    titleGrafica={"Objetivo vs Meses"}
                    maxLen={'140'}
                    TituloGrafica={"Avance de tu trabajo Historico"}
                />
            </div>
        });
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
        const arrI = ['T. Actividad', 'I. Actividad', 'M. Actividad', 'T. equipo', 'I. equipo', 'M. equipo', 'Talento', 'Impacto', 'Compromiso'];
       
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
                    datos.push({ name: "MIT " + lab, data: valores });
                }
            });

        }
        return { arrL, arrI, datos };
    }

    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name })
        this.calculoDeAvance();
        if (name === 'semana') 
            this.renderGraficaSemana();
        
        else if (name === 'MIT') {
            let datos = [];
            const trab = this.arregloSemana();
            datos = trab.datos;
            const graficaG = <CrearGraficaTIM labelsX={trab.arrI}
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


    renderTeletrabajador() {
        return (
             <div>
                <div className="ui form">
                    <div className="two column stackable ui grid">
                        <div className="column two wide">
                            <div className="ui segment" style={{ width: "100%",  height:'44em', background: 'linear-gradient(to top, rgb(247, 203, 122) 0.5%, rgb(255, 255, 255) 0.6%, rgb(245, 242, 224) 200%)' }}>
                                {this.renderProgresoTrabajo()}
                            </div>
                        </div>

                    </div>
                </div >
            </div >
        );
    }

    render() {
        return (<div> {this.renderTeletrabajador()}</div >);
    }
};

const mapStateToProps = (state) => {
    return {
        userId: state.auth.userId,
        listaObjetivo: state.chatReducer.listaObjetivo,
        usuarioDetail: state.chatReducer.usuarioDetail,
        isSignedIn: state.auth.isSignedIn,

    };
};
export default connect(mapStateToProps, { signOut, createStream, pasoOnboardings, chatOff, chatOn, listaFormaciones, estadochats })(DashBoard);
