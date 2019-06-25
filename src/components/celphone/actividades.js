import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Button, Popup, Grid, Input, Header, Modal, Image, Form, Progress, Segment, Label, Divider, Icon, Step } from 'semantic-ui-react';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, pasoOnboardings, estadochats, MensajeIvilys, celPerfs } from '../modules/chatBot/actions';
import moment from 'moment';




const timeoutLength = 900000; //900000

class listActividades extends React.Component {
    state = { actividades: null, tiempos: 0, horamaxima: 8 }

    componentDidMount() {
        if (this.props.usuarioDetail) {
            const starCountRef = firebase.database().ref().child(`Usuario-Tareas/${this.props.usuarioDetail.idUsuario}`);
            starCountRef.on('value', (snapshot2) => {
                this.setState({ actividades: snapshot2.val() });

            });
        }
        this.consultaTiempo();

        this.props.celPerfs('perfil');
    }

    consultaTiempo = () => {
        this.timeout = setTimeout(() => {
            this.renderConsultarTiempoTrabajado();
            this.consultaTiempo();
        }, timeoutLength)
    }

    renderConsultarTiempoTrabajado() {
        this.renderTiempo();
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

        const ObjetivosU = this.state.actividades;
        let x = 0;
        let y = 0;
        let enProceso = 0;
        let arrayT = [];
        Object.keys(ObjetivosU).map((key, index) => {
            const actividadesU = ObjetivosU[key];
            Object.keys(actividadesU).map((key, index) => {
                const objTar = { ...actividadesU[key], key: key }
                arrayT.push(objTar);
            });
        });

        arrayT.sort((obj1, obj2) => { return parseInt(obj1.dificultad) - parseInt(obj2.dificultad); });
        let tiempos = 0;
        Object.keys(arrayT).map((key3, index) => {
            Object.keys(ObjetivosU).map((key, index) => {
                const actividadesU = ObjetivosU[key];
                Object.keys(actividadesU).map((key2, index) => {
                    if (arrayT[key3].key !== key2) return;
                    if (moment().format('YYYY-MM-DD') !== actividadesU[key2].dateStart) {
                        if (actividadesU[key2].estado === 'activo')
                            actividadesU[key2].estado = 'anulado';
                        return;
                    }
                    if (actividadesU[key2].estado === "activo") {
                        if (x === 0) {
                            tiempos = parseInt(actividadesU[key2].tiempoEstimado.substring(0, 2)) + tiempos;
                        }
                        x++;
                    }
                    else if (actividadesU[key2].estado === "trabajando") {
                        if (x === 0)
                            tiempos = parseInt(actividadesU[key2].tiempoEstimado.substring(0, 2)) + tiempos;
                        x++;

                        enProceso++;
                    }
                    else if (actividadesU[key2].estado === "finalizado") {
                        y++;
                        const ti = moment(new Date(actividadesU[key2].fechaInicio));
                        const tf = moment(new Date(actividadesU[key2].fechaFin));
                        const td = tf.add('hours', -ti.hours('HH')).add('minutes', -tf.minutes);
                        let tt = parseFloat(td.format('HH')) + parseFloat(td.format('mm')) / 60;
                        tt = Math.round(tt * 10) / 10;
                        if (!actividadesU[key2].fechaInicio)
                            tt = 1;
                        tiempos = parseInt(tt + tiempos);
                    }
                });

            });

        });

        if (enProceso === 0)
            this.props.estadochats('Seguimiento Inicio');

        this.setState({ tiempos })
    }






    renderActividadXactividad() {
        const ObjetivosU = this.state.actividades;
        let flag = false;
        let x = 0;
        let actNum = 0;
        let actividadProceso = 0;

        let arrayT = [];
        Object.keys(ObjetivosU).map((key, index) => {
            const actividadesU = ObjetivosU[key];
            Object.keys(actividadesU).map((key, index) => {
                const objTar = { ...actividadesU[key], key: key }
                arrayT.push(objTar);
            });
        });

        arrayT.sort((obj1, obj2) => { return parseInt(obj1.dificultad) - parseInt(obj2.dificultad); });

        let fechaTrabajo = null;
        const opcionesX = Object.keys(arrayT).map((key3, index) => {

            const opciones = Object.keys(ObjetivosU).map((key, index) => {
                const actividadesU = ObjetivosU[key];

                if (this.props.selObjetivo === null || this.props.selObjetivo === key) {
                    const opciones2 = Object.keys(actividadesU).map((key2, index) => {

                        if (arrayT[key3].key !== key2) return;

                        const h = parseInt(actividadesU[key2].tiempoEstimado.substring(0, 2));
                        actividadesU[key2].horaPlanificada = fechaTrabajo === null ? actividadesU[key2].horaEstimada : fechaTrabajo;
                        actividadesU[key2].horaEstimada = moment(actividadesU[key2].horaPlanificada, 'HH:mm').add('hours', h).format('HH:mm');
                        fechaTrabajo = actividadesU[key2].horaEstimada;

                        if (moment().format('YYYY-MM-DD') !== actividadesU[key2].dateStart) {
                            if (actividadesU[key2].estado === 'activo') {
                                actividadesU[key2].estado = 'anulado';
                                flag = true;
                            }
                            return;

                        }

                        const tiempo = actividadesU[key2].horaPlanificada + '  a  ' + actividadesU[key2].horaEstimada;
                        const tiempo2 = 'Hora a terminar: ' + actividadesU[key2].horaEstimada;
                        let icono = 'id badge';
                        let actividadT = { completed: true, active: false, colorf: null, backgroundf: null }
                        let anima = null;

                        if (actividadesU[key2].estado === "activo") {
                            actividadT = { completed: false, active: true, color: "#cf6d10", background: " linear-gradient(to right, rgb(255, 255, 255) 15%, rgb(255, 118, 1) 600%)" }
                            if (x === 0) {
                                anima = 'actividadInmediata';
                            }
                            x++;
                        }
                        else if (actividadesU[key2].estado === "trabajando") {
                            actividadT = { completed: false, active: true, color: "#820bea", background: "linear-gradient(to bottom, rgb(255, 255, 255) 50%, rgb(162, 21, 251) 150%)" }
                            anima = 'actividadInmediata';
                            icono = 'cog';
                            actividadProceso++;
                            x++;
                        }
                        actNum++;
                        return (
                            <div style={{ height: '7em' }}>
                                <Step completed={actividadT.completed} className={anima} active={actividadT.active} style={{
                                    height: '6.5em', 'box-shadow': actividadT.background ? '#fbbd0894 0.5px 0.5px 5px 0.5px' : 'rgba(43, 41, 34, 0.58) 0.5px 0.5px 5px 0.5px', 'border-radius': '5px',
                                    background: actividadT.background ? actividadT.background : 'linear-gradient(to right, rgb(218, 215, 215) 10%, rgb(255, 255, 255) 15%, rgb(243, 236, 226) 200%)'
                                }}>
                                    <h1 style={{ position: 'relative', top: '10%', left: '-20px', }}>{actividadesU[key2].estado === "finalizado" ? '✓' : x}</h1>
                                    <Icon name='star outline' style={{ transform: 'scale(0.5)', position: 'relative', left: '85%', top: '-15px', color: '#d39d00' }}> <div style={{ position: 'relative', top: '-35px', left: '-40px' }} > {actividadesU[key2].dificultad} </div>
                                    </Icon>
                                    <Step.Content style={{ left: '8%', width: '90%', top: '-5px', position: 'relative' }}>
                                        <Step.Description style={{
                                            position: 'relative',
                                            top: '-5px',
                                            left: '-35%',
                                            'font-size': 'smaller'
                                        }}>
                                            <Icon name="clock outline"></Icon>
                                            {tiempo}</Step.Description>
                                        <Step.Title style={{ color: actividadT.color, left: '-30%', top: '-1px', position: 'relative' }}>{actividadesU[key2].concepto}</Step.Title>

                                    </Step.Content>
                                </Step>

                            </div>

                        );
                    });

                    return opciones2;
                }
            });
            if (flag === true)
                firebase.database().ref(`Usuario-Tareas/${this.props.usuarioDetail.idUsuario}`).set({
                    ...ObjetivosU,
                });
            return opciones;
        });

        for (let index = actNum; index < 6; index++) {
            const element =
                <Step completed={false} style={{ background: '#f3f2ee17', height: '6em' }}>
                    <Icon name={'book'} style={{ color: '#b5b4ab4a', transform: 'scale(0.6)', top: '-20px', left: '-30px', position: 'relative' }} />
                    <Icon name='star outline' style={{ transform: 'scale(0.5)', position: 'relative', left: '65%', top: '-25px', color: '#b5b4ab4a' }}> <div style={{ position: 'relative', top: '-35px', left: '-40px' }} > {'3'} </div>
                    </Icon>
                    <Step.Content style={{ left: '-30%', position: 'relative' }}>
                        <Step.Title style={{ color: '#b5b4ab4a' }}>{'Por Completar'}</Step.Title>
                        <Step.Description style={{ color: '#b5b4ab4a' }}>>{'Hoara de Inicio : 2022-01-01'}</Step.Description>
                        <Step.Description style={{ color: '#b5b4ab4a' }}>>{'Hora de Fin: 2022-01-01'}</Step.Description>
                    </Step.Content>
                </Step>
            opcionesX.push(element);

        }


        return opcionesX;
    }

    renderActividades() {
        return (<Step.Group vertical style={{
            width: '100%', 'border-radius': '10px',
          
        }}>
            {this.renderActividadXactividad()}
        </Step.Group>);
    }

    render() {


        // console.log( moment().add('hours', 2).format('HH:mm')); // 13:23:41
        let contenido;
        if (this.state.actividades)
            contenido = this.renderActividades();


        return (<div >
            <h3>{this.props.titulo}</h3>
            <div className=" maximo-list">
                <div className="ui relaxed divided animated list ">
                    {contenido}
                </div>
            </div>
        </div>
        );
    }
};

const mapAppStateToProps = (state) => (
    {
        numeroTareasTerminadas: state.chatReducer.numeroTareasTerminadas,
        popupDetalle: state.chatReducer.popupDetalle,
        listaObjetivo: state.chatReducer.listaObjetivo,
        prioridadObj: state.chatReducer.prioridadObj,
        usuarioDetail: state.chatReducer.usuarioDetail,
        selObjetivo: state.chatReducer.selObjetivo,
        MensajeIvily: state.chatReducer.MensajeIvily,
        userId: state.auth.userId,

    });


export default connect(mapAppStateToProps, { listaObjetivos, prioridadObjs, popupDetalles, celPerfs, numeroTareasTs, estadochats, pasoOnboardings, MensajeIvilys })(listActividades);