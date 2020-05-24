import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Image, Icon, Step } from 'semantic-ui-react';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, pasoOnboardings, estadochats, MensajeIvilys } from '../modules/chatBot/actions';
import moment from 'moment';
import task from '../../images/task.svg';
const timeoutLength = 900000;
let timeoutLength2 = 1000;
class listActividades extends React.Component {

    state = { actividades: null, tiempos: 0, horamaxima: 8, primero: null, aux: null }

    componentDidMount() {

        if (this.props.usuarioDetail) {
            const starCountRef = firebase.database().ref().child(`Usuario-Task/${this.props.usuarioDetail.idUsuario}/${moment().format("YYYYMMDD")}`);
            starCountRef.on('value', (snapshot2) => {
                this.setState({ actividades: snapshot2.val() });
            });
        }

        this.setState({
            primero: <div style={{ height: '7.5em' }}>
                <Step active={true} style={{ height: '8.5em', borderRadius: '10px' }}>
                    <Image src={task} size="mini" style={{ left: '10px', top: '60px' }}></Image>
                    <Step.Content style={{ left: '8%', width: '90%', top: '-60px', position: 'relative' }}>
                        <Step.Title style={{ width: '60%', color: '#947d0e', top: '100px', position: 'relative', transform: `scale(2.5)`, left: '50%' }}>Planifica tu actividad</Step.Title>
                    </Step.Content>
                </Step>
            </div>
        });



        this.consultaTiempo();
    }
    
    timerTrabajo = () => {
        this.timeout = setTimeout(() => {
            this.setState({ aux: null });
        }, timeoutLength2)
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
        let y = 0;
        let enProceso = 0;
        let arrayT = [];
        Object.keys(actividadesU).map((key, index) => {
            const objTar = { ...actividadesU[key], key: key }
            arrayT.push(objTar);
        });

        arrayT.sort((obj1, obj2) => { return obj1.dificultad.localeCompare(obj2.dificultad); });
        let tiempos = 0;
        Object.keys(arrayT).map((key3, index) => {
            Object.keys(actividadesU).map((key2, index) => {
                if (arrayT[key3].key !== key2) return;
                if (moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD') > moment(actividadesU[key2].dateStart, 'YYYY-MM-DD')) {
                    if (actividadesU[key2].estado === 'activo')
                        actividadesU[key2].estado = 'anulado';
                    return;
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

        if (enProceso === 0)
            this.props.estadochats('Seguimiento Inicio');

        this.setState({ tiempos })
    }

    renderActividadXactividad() {

        const actividadesU = this.state.actividades;
        let flag = false;
        let x = 0;
        let actNum = 0;
        let actividadProceso = 0;
        let arrayT = [];

        Object.keys(actividadesU).map((key, index) => {
            const objTar = { ...actividadesU[key], key: key }
            arrayT.push(objTar);
        });


        arrayT.sort((obj1, obj2) => {
            if (obj1.prioridad !== undefined)
                return obj1.prioridad.localeCompare(obj2.prioridad);
        });

        let tiempoMin = '24:00';
        Object.keys(arrayT).map((key3, index) => {
            Object.keys(actividadesU).map((key2, index) => {
                if (arrayT[key3].key !== key2) return;
                if (moment().format('YYYY-MM-DD') > moment(actividadesU[key2].dateStart, 'YYYY-MM-DD')) {
                    if (actividadesU[key2].estado === 'activo') {
                        actividadesU[key2].estado = 'anulado';
                        flag = true;
                    }
                    return;
                }
                if (moment(tiempoMin, 'HH:mm') > moment(actividadesU[key2].horaPlanificada, 'HH:mm'))
                    tiempoMin = moment(actividadesU[key2].horaPlanificada, 'HH:mm');
            });
        });


        let fechaTrabajo = null;
        let f = null;
        let opcionesX = Object.keys(arrayT).map((key3, index) => {


            let opciones2 = Object.keys(actividadesU).map((key2, index) => {
                if (this.props.selObjetivo === null || this.props.selObjetivo === actividadesU[key2].objetivo) {

                    if (arrayT[key3].key !== key2) return;
                    if (moment().format('YYYY-MM-DD') > moment(actividadesU[key2].dateStart, 'YYYY-MM-DD')) {
                        if (actividadesU[key2].estado === 'activo') {
                            actividadesU[key2].estado = 'anulado';
                            flag = true;
                        }
                        return;

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
                        actividadProceso++;
                        x++;
                    }
                    actNum++;

                    if (actividadesU[key2].concepto === undefined)
                        return;

                    if (this.state.aux == null && f == null && actividadesU[key2].estado === "activo" && actividadesU[key2].concepto !== undefined) {
                        f = '1';
                        let titlelengt = actividadesU[key2].concepto.length > 20 ? '25%' : '30%';
                        let scalet = actividadesU[key2].concepto.length > 20 ? '1.5' : '3';
                        this.setState({ aux: 'primera' });
                        this.setState({
                            primero: <div style={{ height: '7.5em' }}>
                                <Step completed={actividadT.completed} className={anima} active={actividadT.active} style={{ height: '8.5em', boxShadow: '#fed510 0px 1.1px 0.2px 0.1px', borderRadius: '10px' }}>
                                    <h1 style={{ position: 'relative', top: '10%', left: '-35%', transform: 'scale(3)' }}>{actividadesU[key2].estado === "finalizado" ? '✓' : x}</h1>
                                    <Image src={task} size="mini" style={{ left: '18px', top: '20px' }}></Image>
                                    <div style={{ position: 'relative', top: '5px', left: '-120px', fontSize: 'medium', fontWeight: 'bolder', color: ' #fe10bd' }}> {actividadesU[key2].prioridad} </div>
                                    <Step.Content style={{ left: '8%', width: '90%', top: '-60px', position: 'relative' }}>
                                        <Step.Description style={{ position: 'relative', top: '4em', left: '20%', fontSize: 'smaller' }}>
                                            <Icon name="clock outline"></Icon>{tiempo}
                                        </Step.Description>
                                        <Step.Title style={{ width: '50%', color: '#947d0e', top: '-50px', position: 'relative', transform: `scale(${scalet})`, left: titlelengt }}>{actividadesU[key2].concepto}</Step.Title>
                                    </Step.Content>
                                </Step>
                            </div>
                        });

                    }
                    else {
                        if (x != 1 && actividadesU[key2].estado === "activo")
                            return (<div style={{ height: '7.5em', width: '80%', position: 'relative', left: '20%' }}>
                                <Step completed={actividadT.completed} className={anima} active={actividadT.active} style={{ height: '6.5em', background: '#fff6fb', boxShadow: '#fed510 0px 1.1px 0.2px 0.1px', borderRadius: '10px', 'z-index': '-1' }}>
                                    <h1 style={{ position: 'relative', top: '5%', left: '-5%', transform: 'scale(1.4)' }}>{actividadesU[key2].estado === "finalizado" ? '✓' : x}</h1>
                                    <Image src={task} size="mini" style={{ left: '-24px', top: '30px', transform: 'scale(0.75)' }}></Image>
                                    <div style={{ position: 'relative', top: '40px', left: '-42px', fontSize: 'medium', fontWeight: 'bolder', color: ' #fe10bd' }}> {actividadesU[key2].prioridad} </div>
                                    <Step.Content style={{ left: '8%', width: '90%', top: '-70px', position: 'relative' }}>
                                        <Step.Description style={{ position: 'relative', top: '6em', left: '25%', fontSize: 'smaller' }}>
                                            <Icon name="clock outline"></Icon>{tiempo}
                                        </Step.Description>
                                        <Step.Title style={{ color: '#947d0e', top: '10px', position: 'relative', left: '2%' }}>{actividadesU[key2].concepto}</Step.Title>
                                    </Step.Content>
                                </Step>
                            </div>);
                    }
                }
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
        for (let index = actNum; index < limite; index++) {
            x++;
            const element = <div key={index} style={{ height: '7.5em', width: '80%', position: 'relative', left: '20%', filter: 'grayscale(1)' }}>
                <Step completed={false} style={{ background: '#efefef', height: '6.5em', borderRadius: '20px' }}>
                    <h1 style={{ position: 'relative', top: '5%', left: '-40%', transform: 'scale(1.4)' }}>{x}</h1>
                    <Image src={task} size="mini" style={{ left: '1px', top: '-1px', transform: 'scale(0.75)' }}></Image>
                    <Step.Content style={{ left: '8%', width: '90%', top: '-70px', position: 'relative' }}>
                        <Step.Description style={{ position: 'relative', top: '50px', left: '25%', fontSize: 'smaller' }}>
                            <Icon name="clock outline"></Icon>00:00 a 00:00
                    </Step.Description>
                        <Step.Title style={{ color: '#947d0e', top: '-5px', position: 'relative', left: '2%' }}>Programa tu nueva actividad</Step.Title>
                    </Step.Content>
                </Step>
            </div>
            opcionesX.push(element);
        }
        return opcionesX;
    }

    renderActividades() {
        return (<Step.Group vertical style={{
            width: '100%', borderRadius: '10px',
            borderColor: 'cornsilk'
        }}>
            {this.renderActividadXactividad()}
        </Step.Group>);
    }


    render() {

        let contenido;
        if (this.state.actividades) {
            contenido = this.renderActividades();
            this.timerTrabajo();
        }
        else
            contenido = this.actividadesEmpty(6, 0, [])

        return (<div >
            <div style={{ position: 'relative', top: '-60px' }}>
                {this.state.primero}
            </div>
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


export default connect(mapAppStateToProps, { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, estadochats, pasoOnboardings, MensajeIvilys })(listActividades);