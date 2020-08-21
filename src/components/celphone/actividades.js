import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Image, Icon, Step } from 'semantic-ui-react';
import { actividadPrincipal, actividadProgramas } from '../../actions';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, pasoOnboardings, estadochats, MensajeIvilys } from '../modules/chatBot/actions';
import moment from 'moment';
import task from '../../images/task.svg';
import history from '../../history';
import '../styles/styleLoader.css';


const timeoutLength = 900000;
let timeoutLength2 = 500;
let timeoutLength4 = 500;
let timeoutLength3 = 500;
let timeoutLength5 = 1300;
class listActividades extends React.Component {

    state = { actividades: null, tiempos: 0, horamaxima: 8, primero: null, aux: null, contenido: null }

    componentDidMount() {

        if (!this.props.isSignedIn) {
            history.push('/');
            return;
        }

        this.props.actividadPrincipal(null);
        this.flag = true;
        if (this.props.usuarioDetail) {
            window.gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
                .then(() => {
                    const starCountRef2 = firebase.database().ref().child(`Usuario-CalendarGoogle/${this.props.usuarioDetail.idUsuario}`);
                    starCountRef2.on('value', (snapshot) => {
                        this.Calendar = snapshot.val();
                        if (snapshot.val()) {
                            window.gapi.client.calendar.events.list({ calendarId: this.Calendar.idCalendar.value, }).then((response) => {
                                this.eventCalendar = response;
                            }, (err) => { console.error("Execute error", err); });
                        }
                    });
                }, function (err) { console.error("Error loading GAPI client for API", err); });
            this.actividadesTrabajoActividades();
        }

        this.props.actividadPrincipal(

            <div className="user-profile">
                <img src={task} style={{ left: '-15%', transform: 'scale(0.8)' }} />
                <div className="user-details">
                    <h2>Planifica tu actividad</h2>
                    <p style={{ color: 'White' }}>Es hora de tener el control de nuestro tiempo</p>
                </div>
            </div>

        );

        this.consultaTiempo();
    }


    actividadesTrabajoActividades = () => {

        this.timeout = setTimeout(() => {
            let flagFirst = false;
            const starCountRef = firebase.database().ref().child(`Usuario-Task/${this.props.usuarioDetail.idUsuario}/${moment().format("YYYYMMDD")}`);
            starCountRef.on('value', (snapshot2) => {
                this.setState({ actividades: snapshot2.val() });
                let act = snapshot2.val();

                if (act && act.estado !== undefined) {
                    Object.keys(act).map((key, index) => {

                        let flag = true;
                        if (this.eventCalendar) {
                            Object.keys(this.eventCalendar.result.items).map((key2, index) => {
                                if (this.eventCalendar.result.items[key2].summary === act[key].concepto && this.eventCalendar.result.items[key2].description === key)
                                    flag = false;
                                return this.eventCalendar.result.items[key2];
                            });

                            if (flag && act[key].concepto !== undefined && act[key].synCalendar === undefined && ((this.calendarAcum !== undefined && !this.calendarAcum.includes(key)) || this.calendarAcum === undefined)) {
                                console.log(act[key]);

                                let event = {
                                    'summary': act[key].concepto,
                                    'description': key,
                                    'start': {
                                        'dateTime': moment(act[key]['h-inicio'], 'h:mm:ss a'),
                                        'timeZone': 'America/Los_Angeles'
                                    },
                                    'end': {
                                        'dateTime': moment(act[key]['h-fin'], 'h:mm:ss a'),
                                        'timeZone': 'America/Los_Angeles'
                                    },
                                    'attendees': [],
                                    'reminders': {
                                        'useDefault': false,
                                        'overrides': [
                                            { 'method': 'popup', 'minutes': 10 }
                                        ]
                                    }
                                };
                                if (this.calendarAcum === undefined) {
                                    this.calendarAcum = [];
                                    this.calendarL = [];
                                }
                                this.calendarAcum[key] = act[key].concepto;
                                this.calendarL[key] = event;
                                firebase.database().ref(`Usuario-Task/${this.props.usuarioDetail.idUsuario}/${moment().format("YYYYMMDD")}/${key}`).update({
                                    synCalendar: true
                                });
                                if (flagFirst === false)
                                    this.createEventTrabajo(this.Calendar.idCalendar.value, 0);
                                flagFirst = true;
                            }
                            return act[key];
                        }
                    });

                }
            });
        }, timeoutLength4)
    }


    createEventTrabajo = (calendar, indC) => {

        let event = null;
        Object.keys(this.calendarL).map((key, index) => {
            if (index === indC)
                event = this.calendarL[key];
            return this.calendarL[key];
        });
        if (event !== null) {
            this.timeout = setTimeout(() => {
                window.gapi.client.calendar.events.insert({
                    'calendarId': calendar,
                    'resource': event
                }).then((response) => {
                    console.log("Response", response);
                    this.createEventTrabajo(calendar, indC + 1);
                }, function (err) { console.error("Execute error", err); });
            }, 2000)
        }
    }


    timerTrabajo = () => {
        this.timeout = setTimeout(() => {
            this.setState({ aux: null });
        }, timeoutLength2)
    }

    loaderTask = () => {
        this.timeout = setTimeout(() => {
            if (this.state.actividades) {
                this.renderActividades();
            }
            else
                this.setState({ contenido: this.actividadesEmpty(5, 0, []) });
        }, timeoutLength5)
    }

    consultaTiempo = () => {
        this.timeout = setTimeout(() => {
            this.renderConsultarTiempoTrabajado();
            this.consultaTiempo();
        }, timeoutLength)
    }

    //validar logica
    renderConsultarTiempoTrabajado() {
        //this.renderTiempo();
        if (!this.props.MensajeIvily) return;
        let ant = moment(new Date(this.props.MensajeIvily.horaActivacion ? this.props.MensajeIvily.horaActivacion : this.props.MensajeIvily.inicio));
        let hora = moment().add('minutes', -ant.minutes()).add('hours', -ant.hours());
        if (this.props.MensajeIvily.horaActivacion) {
            hora = moment(this.props.MensajeIvily.tiempoTrabajado, 'HH:mm').add('hours', parseInt(moment(hora).format('HH'))).add('minutes', parseInt(moment(hora).format('mm')));
        }

        let tt = parseFloat(hora.format('HH')) + parseFloat(hora.format('mm')) / 60;
        tt = Math.round(tt * 10) / 10;
        if (tt > this.state.tiempos) {
            this.props.estadochats('seguimiento');
        }

        if (tt > 4 && !this.props.MensajeIvily.estadoTIMS && (new Date().getDay() === 2 || new Date().getDay() === 4)) {
            this.props.estadochats('TIM Media');
        }
        if (tt > 4 && !this.props.MensajeIvily.estadoTIMS && (new Date().getDay() === 3 || new Date().getDay() === 5)) {
            this.props.estadochats('TIM Semana');
        }
        if (tt > this.state.horamaxima && this.props.estadochat !== "Despedida") { this.props.estadochats('Termino dia') }
    }


    renderTiempo() {
        const actividadesU = this.state.actividades;
        let x = 0;
        let enProceso = 0;
        let arrayT = [];
        Object.keys(actividadesU).map((key, index) => {
            const objTar = { ...actividadesU[key], key: key }
            arrayT.push(objTar);
            return actividadesU[key];
        });

        arrayT.sort((obj1, obj2) => { return obj1.dificultad.localeCompare(obj2.dificultad); });
        let tiempos = 0;
        Object.keys(arrayT).map((key3, index) => {
            Object.keys(actividadesU).map((key2, index) => {
                if (arrayT[key3].key !== key2) return null;
                if (moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD') > moment(actividadesU[key2].dateStart, 'YYYY-MM-DD')) {
                    if (actividadesU[key2].estado === 'activo')
                        actividadesU[key2].estado = 'anulado';
                    return null;
                }
                if (actividadesU[key2].estado === "activo") {
                    if (x === 0)
                        tiempos = parseInt(actividadesU[key2].tiempoEstimado.substring(0, 2)) + tiempos;
                    x++;
                }
                else if (actividadesU[key2].estado === "trabajando") {
                    if (x === 0)
                        tiempos = parseInt(actividadesU[key2].tiempoEstimado.substring(0, 2)) + tiempos;
                    x++;
                    enProceso++;
                }
                else if (actividadesU[key2].estado === "finalizado") {
                    const ti = moment(new Date(actividadesU[key2].fechaInicio));
                    const tf = moment(new Date(actividadesU[key2].fechaFin));
                    const td = tf.add('hours', -ti.hours('HH')).add('minutes', -tf.minutes);
                    let tt = parseFloat(td.format('HH')) + parseFloat(td.format('mm')) / 60;
                    tt = Math.round(tt * 10) / 10;
                    if (!actividadesU[key2].fechaInicio)
                        tt = 1;
                    tiempos = parseInt(tt + tiempos);
                }
                return null;
            });
            return null;
        });

        if (enProceso === 0)
            this.props.estadochats('Seguimiento Inicio');

        this.setState({ tiempos })
    }

    renderActividadXactividad() {

        const actividadesU = this.state.actividades;
        let x = 0;
        let actNum = 0;
        let arrayT = [];

        Object.keys(actividadesU).map((key, index) => {
            const objTar = { ...actividadesU[key], key: key }
            arrayT.push(objTar);
            return actividadesU[key];
        });


        arrayT.sort((obj1, obj2) => {
            if (obj1.prioridad !== undefined)
                return obj1.prioridad.localeCompare(obj2.prioridad);
            return null;
        });

        let tiempoMin = '24:00';
        Object.keys(arrayT).map((key3, index) => {
            Object.keys(actividadesU).map((key2, index) => {
                if (arrayT[key3].key !== key2) return null;
                if (moment().format('YYYY-MM-DD') > moment(actividadesU[key2].dateStart, 'YYYY-MM-DD')) {
                    if (actividadesU[key2].estado === 'activo') {
                        actividadesU[key2].estado = 'anulado';
                    }
                    return null;
                }
                if (moment(tiempoMin, 'HH:mm') > moment(actividadesU[key2].horaPlanificada, 'HH:mm'))
                    tiempoMin = moment(actividadesU[key2].horaPlanificada, 'HH:mm');
                return null;
            });
            return null;
        });

        let f = null;
        let opcionesX = Object.keys(arrayT).map((key3, index) => {

            let opciones2 = Object.keys(actividadesU).map((key2, index) => {
                if (this.props.selObjetivo === null || this.props.selObjetivo === actividadesU[key2].objetivo) {

                    if (arrayT[key3].key !== key2) return null;
                    if (moment().format('YYYY-MM-DD') > moment(actividadesU[key2].dateStart, 'YYYY-MM-DD')) {
                        if (actividadesU[key2].estado === 'activo') {
                            actividadesU[key2].estado = 'anulado';
                        }
                        return null;

                    }
                    const tiempo = actividadesU[key2]['h-inicio'] + '  a  ' + actividadesU[key2]['h-fin'];
                    let actividadT = { completed: true, active: false, colorf: null, backgroundf: null }
                    let anima = null;

                    if (actividadesU[key2].estado === "activo") {
                        actividadT = { completed: false, active: true, color: "#cf6d10", background: "linear-gradient(to right, #fff7e6 10%, rgb(255, 255, 255) 15%, rgb(253, 245, 2)600%)" }
                        if (x === 0)
                            anima = 'actividadInmediata';
                        x++;
                    }
                    else if (actividadesU[key2].estado === "trabajando") {
                        actividadT = { completed: false, active: true, color: "#820bea", background: "linear-gradient(to right, rgb(220, 169, 247) 10%, rgb(255, 255, 255) 15%, rgb(184, 0, 245) 500%)" }
                        anima = 'actividadInmediata';
                        x++;
                    }
                    actNum++;

                    if (actividadesU[key2].concepto === undefined)
                        return null;

                    if (this.state.aux !== key2) {
                        if (this.state.aux == null && f == null && actividadesU[key2].estado === "activo" && actividadesU[key2].concepto !== undefined) {
                            f = '1';
                            let heightHup = actividadesU[key2].concepto.length > 17 ? '-12em' : '-10.5em';
                            this.setState({ aux: key2 });
                            this.props.actividadProgramas(1);

                            this.props.actividadPrincipal(
                                <div className="user-profile" style={{ height: '2.5em', top: heightHup }}>
                                    <img src={task} style={{ left: '-15%', top: '-8em' }} />
                                    <h3 style={{ top: '-4.7em', left: '-70%', position: 'relative' }} >  {actividadesU[key2].prioridad} </h3>
                                    <h2 style={{ position: 'relative', top: '-5.5em' }}>{actividadesU[key2].concepto}</h2>
                                    <div className="user-details">
                                        <p style={{ color: 'White', left: '25%', position: 'relative' }}>{tiempo}</p>
                                    </div>
                                </div>
                            );



                        }
                        else {
                            if (x !== 1 && actividadesU[key2].estado === "activo") {
                                this.props.actividadProgramas(1);
                                let topX = '-7%';
                                if (x === 2)
                                    topX = '5%';
                                return (
                                    <li className="one red2" style={{ height: '5.5em' }}>
                                        <h1 style={{ position: 'relative', top: topX, left: '-45%', transform: 'scale(1)' }}>{x}</h1>
                                        <span className="task-title" style={{ top: '-3em', position: 'relative', width: '13em' }}>{actividadesU[key2].concepto} </span>
                                        <span className="task-time" style={{ top: '-4em', position: 'relative', width: '100%' }}>{tiempo} </span>
                                        <span className="task-cat" style={{ top: '-7em', position: 'relative', width: '100%' }}>    <Image src={task} size="mini" style={{
                                            transform: 'scale(0.5)', left: '5em',
                                            top: '2em'
                                        }} alt='task hupper'></Image>
                                    Prioridad  {actividadesU[key2].prioridad}</span>
                                    </li>
                                );
                            }
                        }
                    }
                }
                return null;
            });
            return opciones2;

            /* if (flag === true)
                 firebase.database().ref(`Usuario-Tareas/${this.props.usuarioDetail.idUsuario}`).set({
                     ...ObjetivosU,
                 });*/
        });

        opcionesX = this.actividadesEmpty(6, actNum, opcionesX)
        return opcionesX;
    }



    actividadesEmpty(limite, actNum, opcionesX) {

        let x = 0;
        let margin = '-45%';
        if (this.props.actividadProg === 1)
            this.props.actividadProgramas(2);
        for (let index = actNum; index <= limite; index++) {
            x++;

            const element = <li className="one red2" key={index} style={{ height: '4em', filter: 'invert(0.8)' }}>
                <h1 style={{ position: 'relative', top: '5%', left: margin, transform: 'scale(1)' }}>{x}</h1>
                <span className="task-title" style={{ top: '-3em', position: 'relative' }}>Programa tu nueva actividad</span>
                <span className="task-time" style={{ top: '-3.5em', position: 'relative' }}>00:00 </span>
                <span className="task-cat" style={{ top: '-5.5em', position: 'relative' }}>    <Image src={task} size="mini" style={{
                    transform: 'scale(0.5)', left: '10%',
                    top: '2em'
                }} alt='task hupper'></Image>
                    Da un paso a tu libertad</span>

            </li>
            opcionesX.push(element);
        }
        return opcionesX;
    }

    renderActividades() {

        if (this.flag === true) {
            this.timeout = setTimeout(() => {
                timeoutLength3 = 1000;
                this.flag = true;
                this.timerTrabajo();
                this.setState({ contenido: this.renderActividadXactividad() });
            }, timeoutLength3);
        }
        this.flag = false;
    }


    render() {

        let contenido = <div className="box">
            <div className="loader9"></div>
            <p style={{
                height: '3em',
                borderRadius: '3em'
            }}>A la espera de tus Objetivos</p>
        </div >;

        this.loaderTask();
        let styleAjuste = { position: 'relative', top: '-5em' }

        if (this.state.actividades)
            styleAjuste = { position: 'relative', top: '-2em' }

        if (this.state.contenido)
            contenido = <ul className="tasks" style={styleAjuste}>
                {this.state.contenido}
            </ul>

        return (contenido);
    }
};

const mapAppStateToProps = (state) => (
    {
        numeroTareasTerminadas: state.chatReducer.numeroTareasTerminadas,
        isSignedIn: state.auth.isSignedIn,
        popupDetalle: state.chatReducer.popupDetalle,
        actividadPrin: state.chatReducer.actividadPrin,
        listaObjetivo: state.chatReducer.listaObjetivo,
        actividadProg: state.chatReducer.actividadProg,
        prioridadObj: state.chatReducer.prioridadObj,
        usuarioDetail: state.chatReducer.usuarioDetail,
        selObjetivo: state.chatReducer.selObjetivo,
        MensajeIvily: state.chatReducer.MensajeIvily,
        userId: state.auth.userId,

    });


export default connect(mapAppStateToProps, { actividadProgramas, actividadPrincipal, listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, estadochats, pasoOnboardings, MensajeIvilys })(listActividades);