import React from 'react';
import { connect } from 'react-redux';
import '../HuperModules/efectText/efect.scss';
import acAnimated from "../HuperModules/efectText/splitText";
import { ApiAiClient } from 'api-ai-javascript';
import { sendMessage, chatOff, endChatMes, popupBot, mensajeChat } from '../../actions';
import { consultas } from '../modules/chatBot/actions';
import TimerClock from '../HuperModules/timerClock/timerr';
import moment from 'moment';
import asanaH from '../../apis/asana';
import { clientIdAsana, clientSecrectAsana } from '../../apis/stringConnection';
import axios from 'axios';
import { listTemporalObject, listTemporalOpciones, rutaHupperSingle, randomMessage, dataBaseManager, selectStyle } from '../../lib/utils';

let Trello = require("trello");
const timeoutLength = 1500;
const timeoutLengthHelp = 12000;
const timeoutLength2 = 1000;
const timeoutLength3 = 2000;
const sleepTime = 480;

acAnimated.randomNumber = function (min, max) {
    var num = min + Math.floor(Math.random() * (max - (min - 1)));
    return num;
}
acAnimated.randomDirection = function (number) {
    var direction = Math.floor(Math.random() * 2);
    if (direction === 0) number = 0 - number;
    return number;
}
acAnimated.animateChar = function (char) {
    var timeline = new window.TimelineMax({});
    timeline.from(char, acAnimated.randomNumber(3, 5) / 10, { top: acAnimated.randomDirection(acAnimated.randomNumber(10, 50)), rotationZ: acAnimated.randomDirection(acAnimated.randomNumber(90, 360)), rotationX: acAnimated.randomDirection(acAnimated.randomNumber(90, 360)), opacity: 0 });
    return timeline;
}
acAnimated.animateWord = function (word) {
    var timeline = new window.TimelineMax({});
    timeline.from(word, acAnimated.randomNumber(3, 5) / 10, { top: acAnimated.randomDirection(acAnimated.randomNumber(10, 50)), rotationX: acAnimated.randomDirection(acAnimated.randomNumber(90, 360)), opacity: 0 });
    return timeline;
}

class listActividades extends React.Component {


    state = {
        actividades: null, tiempos: 0, horamaxima: 8, primero: null, aux: null
        , index: 0, delay: .02, mensaje: null, messages: [], inputC: null, flag: false, response: null, tipoIn: 1, flagTiempo: false, textAux: null, opciones: null,
        consulta: null, criteria: null, parametros: null, mensajeUs: null, propertieBD: null, registro: [], opcionValue: [], nivel: null, addProperties: null, nuevoParam: null,
        paso: null, nivelAnt: null, stay: null, property: null, stayValue: null, pasoFlujo: 1, flujo: null, etapa: null, consultaParams: null, optionSelect: null, options: null,
        opcionesDB: null, keyNivel: '', flujoAux: null, pendingOk: null, pendingConsulta: null, onlyOptions: null, workFlow: null, passflow: 0, objTask: null, carpeta: null,
        otherFlow: null, objetoX: null, objetoP: null, pasoAux: null, btAux: null, vartemp: null, varstemp: [], acumTalento: null, acumImpacto: null, acumCompromiso: null, acumYo: null, acumEquipo: null, acumOrg: null, sleep: null,
        helpMessage: null,

    }

    componentDatabase(tipo, path, objectIn, mensaje, mensajeError) {
        let men = dataBaseManager(tipo, path, objectIn, mensaje, mensajeError);
        this.efectoPass = false;
        if (men && men.mensaje)
            this.props.popupBot({ mensaje: men.mensaje });
        return men;
    }

    componentWillMount() {
        this.secondsAcum = 0;
        this.stateAnt = null;
        this.pasoAnt = null;
        this.primeraV = false;
        this.ndescansos = 0;
        this.acumTask = 0;
        this.paramAnt = [];
        this.addAct = 0;
        this.st = selectStyle();
        if (this.mensaje === undefined || this.props.mensajeChatBot === null || (this.props.mensajeChatBot && this.mensaje !== this.props.mensajeChatBot.mensaje))
            this.chatBotSfot();
    }


    chatBotSfot() {
        this.props.consultas({ ...this.props.consultax, currentId: this.props.userId, hoy: moment().format("YYYYMMDD"), util: 'prioridad' });
        this.setState({ registro: { ...this.state.registro, 'etapa': 0 } });
        //this.props.mensajeChat({ mensaje: 'prueba', agent: 'task' });
        let etapa = null;
        //     console.log(this.props.mensajeChatBot)


        ///tareas

        if (this.props.mensajeChatBot && this.props.mensajeChatBot.agent === 'soft') {
            this.queryConsulta = `Usuario-Soft/${this.props.userId}/${moment().format("YYYYMM")}/${moment().format("DD")}`;
            this.client = new ApiAiClient({
                accessToken: '7ad0665ad3b64ec2b59721cb7fa53e07'
            });
        }
        else {
            this.client = new ApiAiClient({
                accessToken: 'dfd956d241004b8b87e1c293399dabf6'
            });

            if (this.props.mensajeChatBot && this.props.mensajeChatBot.agent === 'OKR') {
                this.queryConsulta = `Usuario-OKR/${this.props.userId}`;
            }
            else {
                this.queryConsulta = `Usuario-Task/${this.props.userId}/${moment().format("YYYYMMDD")}`;
                const starCountRef3 = this.componentDatabase('get', this.queryConsulta);
                let ttiempo = 0;

                starCountRef3.on('value', (snapshot) => {
                    if (snapshot.val() !== null && snapshot.val().estado !== 'completo') {
                        //etapa = snapshot.val().etapa ;
                        this.setState({ etapa: snapshot.val().etapa });
                        Object.keys(snapshot.val()).map((key, index) => {
                            if (snapshot.val()[key].duracion)
                                ttiempo = snapshot.val()[key].duracion + ttiempo;
                            return snapshot.val()[key];
                        });
                    }
                    else if (snapshot.val() !== null && snapshot.val().estado === 'completo') {
                        this.setState({ objTask: snapshot.val() });
                    }
                });
                this.secondsAcum = ttiempo;



            }
            //consulta pendientes
            this.pendingC();


        }

        this.ActualizacionPaso(etapa);
        /*
                if (this.state.etapa) {
                    this.state.registro["etapa"] = this.state.etapa;
                    this.client.textRequest('Continuar planificando mi día', { sessionId: 'test' }).then(this.onResponse, this);
                }
                else {
                    this.mensaje = this.props.mensajeChatBot && this.props.mensajeChatBot.mensaje ? this.props.mensajeChatBot.mensaje : 'hola';
                    ///this.props.mensajeChatBot
                    console.log('trabajo');
                    console.log(this.mensaje);
                    this.client.textRequest(this.mensaje, { sessionId: 'test' }).then(this.onResponse, this);
        
                }
        
                // this.client.eventRequest("hola").then(this.onResponse, this);
                this.handlePaso();
                this.text2();
                this.setState({ response: null });
        */

    }


    pendingC = () => {
        this.timeout = setTimeout(() => {
            this.pendingConsulta = `Usuario-Pendiente/${this.props.userId}`;
            const starCountRef4 = this.componentDatabase('get', this.pendingConsulta);
            let pending = null;
            starCountRef4.on('value', (snapshot) => {
                if (snapshot.val() !== null && this.state.etapa === null) {
                    this.queryConsulta = `Usuario-OKR/${this.props.userId}`;
                    pending = snapshot.val();
                    this.validarPending(pending);
                }
            });
        }, 500)
    }

    ActualizacionPaso = etapa => {
        this.timeout = setTimeout(() => {

            this.props.mensajeChat(null);
            if (this.state.etapa) {
                this.setState({ registro: { ...this.state.registro, 'etapa': this.state.etapa } })
                this.client.textRequest('Continuar planificando mi día', { sessionId: 'test' }).then(this.onResponse, this);
            }
            else {
                this.mensaje = this.props.mensajeChatBot && this.props.mensajeChatBot.mensaje ? this.props.mensajeChatBot.mensaje : 'hola';
                console.log(this.props.usuarioDetail);
                if (!this.props.usuarioDetail.usuario.task || this.props.usuarioDetail.usuario.task !== moment().format("YYYYMMDD")) {
                    // this.client.textRequest('Quiero planificar mi día', { sessionId: 'test' }).then(this.onResponse, this);
                    if (this.props.usuarioDetail.usuario.etapa > 10) {
                        this.client.textRequest('Inicio con mis actividades dos', { sessionId: 'test' }).then(this.onResponse, this);
                        this.addAct = 10;
                    }
                    else {
                        this.client.textRequest('Inicio con mis actividades', { sessionId: 'test' }).then(this.onResponse, this);
                        this.addAct = 0;
                    }


                }
                else
                    this.client.textRequest(this.mensaje, { sessionId: 'test' }).then(this.onResponse, this);

            }

            // this.client.eventRequest("hola").then(this.onResponse, this);
            this.handlePaso();
            this.text2();
            this.setState({ response: null });
        }, 500)
    }

    validarPending(pending) {
        if (pending !== null) {
            let flag = false;
            Object.keys(pending).map((key, index) => {
                if (pending[key].estado === 'activo' && flag === false) {
                    flag = true;
                    this.setState({ flujo: pending[key].flujoAux });
                    this.setState({ nivel: key });
                    this.setState({ keyNivel: key });
                    this.setState({ etapa: 1 });
                    let varTemporales = this.state.varstemp;
                    varTemporales['concepto'] = pending[key].concepto;
                    this.setState({ varstemp: varTemporales });

                    let registro = []
                    for (const prop2 in pending[key]) {
                        if (prop2 !== 'flujoAux' && prop2 !== 'id') {
                            registro[prop2] = pending[key][prop2];
                        }
                    }
                    let reg = [];
                    reg[key] = { ...this.state.registro[key] ? this.state.registro[key] : null, ...registro };
                    this.setState({ registro: { ...this.state.registro, ...reg } });
                    pending[key].estado = 'completo';
                    this.setState({ pendingOk: pending[key] });
                    this.adelantar(pending[key].flujoAux);
                    return null;
                }
                return null;
            });
        }
    }

    randomMax(min, max) {
        return (Math.random() * (max - min)) + min;
    }

    adelantar(flujo) {
        let men = null;
        let etapa = 0;
        for (const prop2 in flujo) {
            if (this.state.pasoFlujo === parseInt(prop2, 16)) {
                men = flujo[prop2];
                etapa++;
            }
        }
        this.setState({ pasoFlujo: this.state.pasoFlujo + etapa });
        if (men !== null)
            this.client.textRequest(men, { sessionId: 'test' }).then(this.onResponse, this);
    }



    validarNivel(nivel, cambio) {

        let keyN = this.state.keyNivel;
        if (cambio)
            keyN = null;

        if (nivel !== 'key')
            this.setState({ nivel });
        else if (nivel === 'key' && keyN !== this.state.nivel) {
            let newPostKey2 = this.componentDatabase('key', this.queryConsulta);
            this.setState({ keyNivel: newPostKey2 });
            this.setState({ nivel: newPostKey2 });
        }


    }




    validateWork(workflow, parameter) {
        let men = "";
        for (const prop2 in workflow) {
            if (parameter === prop2) {
                men = workflow[prop2];
            }
        }
        this.client.textRequest(men, { sessionId: 'test' }).then(this.onResponse, this);
    }

    urlBsaseDatos(tipo) {
        if (tipo === 'task') {
            this.queryConsulta = `Usuario-Task/${this.props.userId}/${moment().format("YYYYMMDD")}`;
        }
        else if (tipo === 'OKR') {
            this.queryConsulta = `Usuario-OKR/${this.props.userId}`;
        }

    }

    onResponse = (activity) => {
        let that = this;
        let ind = 1;

        let wd = rutaHupperSingle(this.props.usuarioDetail.usuario.etapa);
        //  let wd = 0;
        this.efectoPass = false;

        activity.result.fulfillment.messages.forEach(function (element) {
            if (ind + that.addAct === Number(that.props.usuarioDetail.usuario.etapa) || activity.result.fulfillment.messages.length === 1)
                if (element.payload !== undefined) {

                    let nuevo = element.payload;
                    if (that.state.pasoFlujo > 1 && that.state.pasoFlujo - 1 <= that.state.etapa && that.state.etapa != null) {
                        that.borrarDatos();
                        that.adelantar(that.state.flujo);
                    }
                    else {

                        if (nuevo.mensaje && wd > Object.keys(nuevo.mensaje).length)
                            wd = 0;

                        if (nuevo.tipo === "flujo") {
                            that.setState({ flujo: nuevo.flujo });
                            that.adelantar(nuevo.flujo);

                        }
                        else if (nuevo.tipo === "workFlow") {
                            that.setState({ workflow: nuevo.workFlow });
                            that.setState({ passflow: 2 });
                            that.validateWork(nuevo.workFlow, "1");
                        }
                        else if (nuevo.tipo === "consulta") {


                            that.setState({ pasoFlujo: null });
                            that.setState({ consulta: nuevo.consulta });
                            that.setState({ flujoAux: nuevo.flujoAux });
                            that.validarNivel(nuevo.nivel, nuevo.ChangeLevel);
                            that.setState({ addProperties: nuevo.add });
                            that.setState({ criteria: nuevo.criteria });
                            that.setState({ parametros: that.organizarConsulta(nuevo.parametros !== undefined ? nuevo.parametros.split(',') : '') });
                            that.setState({ mensajeUs: randomMessage(nuevo.mensaje, wd).replace("@nombre", that.props.usuarioDetail.usuario.usuario).replace("?" + nuevo.variablesT, that.state.varstemp[nuevo.variablesT]) });
                            that.setState({ propertieBD: nuevo.bd });
                            that.setState({ property: nuevo.property });
                            that.setState({ stay: nuevo.stay });
                            that.setState({ btAux: nuevo.btAux });
                            that.setState({ pasoAux: nuevo.pasoAux });
                            that.setState({ objetoX: nuevo.objeto });
                            that.setState({ paso: nuevo.paso });
                            that.setState({ usProperty: nuevo.usProperty });
                            that.setState({ onlyOptions: nuevo.onlyOptions });
                            that.setState({ consultParam: nuevo.consultParam });
                            that.setState({ tipoIn: 3 });
                            that.setState({ vartemp: nuevo.vartemp });
                            that.setState({ helpMessage: nuevo.helpMessage });
                            that.setState({ acumTalento: nuevo.acumTalento });
                            that.setState({ acumCompromiso: nuevo.acumCompromiso });
                            that.setState({ acumImpacto: nuevo.acumImpacto });
                            that.setState({ acumYo: nuevo.acumYo });
                            that.setState({ acumEquipo: nuevo.acumEquipo });
                            that.setState({ acumOrg: nuevo.acumOrg });

                            that.urlBsaseDatos(nuevo.structure);

                            if (nuevo.carpeta)
                                that.crearCarpeta();
                        }

                        else if (nuevo.tipo === "mensaje") {
                            that.setState({ pasoFlujo: null });
                            that.validarNivel(nuevo.nivel, nuevo.ChangeLevel);
                            that.setState({ nivelAnt: nuevo.nivelAnt });
                            that.setState({ property: nuevo.property });
                            that.setState({ usProperty: nuevo.usProperty });
                            that.setState({ stay: nuevo.stay });
                            that.setState({ addProperties: nuevo.add });
                            that.setState({ btAux: nuevo.btAux });
                            that.setState({ pasoAux: nuevo.pasoAux });
                            that.setState({ mensajeUs: randomMessage(nuevo.mensaje, wd).replace("@nombre", that.props.usuarioDetail.usuario.usuario).replace("?" + nuevo.vairablesT, that.state.varstemp[nuevo.vairablesT]) });
                            that.setState({ textAux: nuevo.labelAux });
                            that.setState({ paso: nuevo.paso });
                            that.setState({ flagTiempo: nuevo.tiempo });
                            that.setState({ propertieBD: nuevo.bd });
                            that.setState({ vartemp: nuevo.vartemp });
                            that.setState({ acumTalento: nuevo.acumTalento });
                            that.setState({ acumCompromiso: nuevo.acumCompromiso });
                            that.setState({ acumImpacto: nuevo.acumImpacto });
                            that.setState({ acumYo: nuevo.acumYo });
                            that.setState({ acumEquipo: nuevo.acumEquipo });
                            that.setState({ helpMessage: nuevo.helpMessage });
                            that.setState({ acumOrg: nuevo.acumOrg });
                            that.urlBsaseDatos(nuevo.structure);
                            if (nuevo.carpeta)
                                that.crearCarpeta();
                        }
                        else if (nuevo.tipo === "tiempo") {
                            that.setState({ pasoFlujo: null });
                            that.setState({ usProperty: nuevo.usProperty });
                            that.validarNivel(nuevo.nivel, nuevo.ChangeLevel);
                            that.setState({ nivelAnt: nuevo.nivelAnt });
                            that.setState({ property: nuevo.property });
                            that.setState({ stay: nuevo.stay });
                            that.setState({ addProperties: nuevo.add });
                            that.setState({ mensajeUs: randomMessage(nuevo.mensaje, wd).replace("@nombre", that.props.usuarioDetail.usuario.usuario).replace("?" + nuevo.vairablesT, that.state.varstemp[nuevo.vairablesT]) });
                            that.setState({ flagTiempo: nuevo.tiempo });
                            that.setState({ propertieBD: nuevo.bd });
                            that.setState({ paso: nuevo.paso });
                            that.setState({ acumTalento: nuevo.acumTalento });
                            that.setState({ acumCompromiso: nuevo.acumCompromiso });
                            that.setState({ acumImpacto: nuevo.acumImpacto });
                            that.setState({ acumYo: nuevo.acumYo });
                            that.setState({ helpMessage: nuevo.helpMessage });
                            that.setState({ acumEquipo: nuevo.acumEquipo });
                            that.setState({ acumOrg: nuevo.acumOrg });
                            that.setState({ tipoIn: 4 });
                        }
                        else if (nuevo.tipo === "opciones") {

                            that.setState({ consultParam: nuevo.consultParam });
                            that.setState({ mensajeUs: randomMessage(nuevo.mensaje, wd).replace("@nombre", that.props.usuarioDetail.usuario.usuario).replace("?" + nuevo.vairablesT, that.state.varstemp[nuevo.vairablesT]) });
                            that.setState({ tipoIn: 2 });
                            that.setState({ paso: nuevo.paso });
                            that.setState({ helpMessage: nuevo.helpMessage });
                            that.setState({ otherFlow: nuevo.otherFlow });
                            that.setState({ opciones: nuevo.opciones });

                        }
                        else if (nuevo.tipo === "intro") {

                            that.setState({ mensajeUs: randomMessage(nuevo.mensaje, wd).replace("@nombre", that.props.usuarioDetail.usuario.usuario).replace("?" + nuevo.vairablesT, that.state.varstemp[nuevo.vairablesT]) });
                            that.setState({ tipoIn: 0 });
                            that.setState({ sleep: nuevo.timeSleep });
                            that.setState({ paso: nuevo.paso });
                        }
                        else {
                            that.setState({ tipoIn: 99 });
                            that.setState({ mensajeUs: randomMessage(nuevo.mensaje, wd).replace("@nombre", that.props.usuarioDetail.usuario.usuario).replace("?" + nuevo.vairablesT, that.state.varstemp[nuevo.vairablesT]) });
                            that.Cerrar();
                        }
                    }
                }
            ind++;

            /*    newMessage = {
                    text: messageN,
                    author: that.bot,
                    //  timestamp: new Date(activity.timestamp),
                    //   suggestedActions: element.replies ? element.replies.map(x => { return { type: "reply", title: x, value: x };}) : []
                };
                that.setState((prevState) => {
                    return { messages: [...prevState.messages, newMessage] };
                });*/
        });
    }


    validarOpciones(value) {
        let opciones = this.state.opcionValue;
        let flag = true;
        Object.keys(opciones).map((key, index) => {
            if (value === opciones[key]) {
                flag = false;
            }
            return opciones[key];
        });
        return flag;
    }


    crearCarpeta() {
        let folderId = this.props.usuarioDetail.usuario.wsCompartida;

        window.gapi.client.drive.files.create({
            name: "Nueva Carpeta",
            mimeType: 'application/vnd.google-apps.folder',
            parents: [folderId]
            //fields: 'id'
        }).then((response) => {
            this.setState({ carpeta: response.result.id });

        },
            function (err) { console.error("Execute error", err); });
    }

    renderUpdateApis(queryConsulta) {
        if (this.state.registro[undefined].estado && queryConsulta.includes('OKR')) {

            let id = queryConsulta.split('/')[2];
            const starCountRef2 = this.componentDatabase('get', queryConsulta);
            starCountRef2.on('value', (snapshot2) => {
                if (snapshot2.val() && snapshot2.val().tipo) {
                    switch (snapshot2.val().tipo) {
                        case 'asana':
                            const starCountRef = this.componentDatabase('get', `Usuario-Asana/${this.props.usuarioDetail.idUsuario}`);
                            starCountRef.on('value', (snapshot) => {

                                axios.post(`https://cors-anywhere.herokuapp.com/https://app.asana.com/-/oauth_token`, null, {
                                    params: {
                                        grant_type: 'refresh_token',
                                        client_id: clientIdAsana, 'client_secret': clientSecrectAsana,
                                        redirect_uri: window.location.origin, code: snapshot.val().code, 'refresh_token': snapshot.val().rToken
                                    }
                                }).then(res => {
                                    let body = {
                                        "data": {
                                            "completed": true
                                        }
                                    };
                                    asanaH.put('/api/1.0/tasks/' + id,
                                        body
                                        , { headers: { Authorization: 'Bearer ' + res.data.access_token, 'Accept': 'application/json', 'Content-Type': 'application/json' }, }).then((res2) => {


                                        }).catch(err => { this.props.popupBot({ mensaje: 'He tenido un probema !!!' }); });
                                }
                                ).catch(err => { this.props.popupBot({ mensaje: 'He tenido un probema  en confimar tu usuario!!!' }); })
                            });

                            break;
                        case 'trello':
                            const starCountRef2 = this.componentDatabase('get', `Usuario-Trello/${this.props.usuarioDetail.idUsuario}`);
                            starCountRef2.on('value', (snapshot) => {
                                let trelloClient = snapshot.val();
                                let trello = new Trello(trelloClient.trelloApi, trelloClient.tokenTrello);
                                trello.makeRequest('put', '/1/cards/' + id, { webhooks: true, idList: trelloClient.listaOBjetivosDone.value }).then((res) => {

                                }).catch(err => { this.props.popupBot({ mensaje: 'He tenido un probema !!!' }); });

                            });

                            break;
                        default:
                            break;

                    }
                }
            });
        }
    }

    renderAcumUnd(value) {

        let usProp = [];
        if (this.state.acumTalento) {
            usProp[this.state.acumTalento] = this.props.usuarioDetail.usuario.acumTalento ? this.props.usuarioDetail.usuario.acumTalento : 0 + Number(value);
        }
        if (this.state.acumCompromiso) {
            usProp[this.state.acumCompromiso] = this.props.usuarioDetail.usuario.acumCompromiso ? this.props.usuarioDetail.usuario.acumCompromiso : 0 + Number(value);
        }
        if (this.state.acumImpacto) {
            usProp[this.state.acumImpacto] = this.props.usuarioDetail.usuario.acumImpacto ? this.props.usuarioDetail.usuario.acumImpacto : 0 + Number(value);
        }
        if (this.state.acumYo) {
            usProp[this.state.acumYo] = this.props.usuarioDetail.usuario.acumYo ? this.props.usuarioDetail.usuario.acumYo : 0 + Number(value);
        }
        if (this.state.acumEquipo) {
            usProp[this.state.acumEquipo] = this.props.usuarioDetail.usuario.acumEquipo ? this.props.usuarioDetail.usuario.acumEquipo : 0 + Number(value);
        }
        if (this.state.acumOrg) {
            usProp[this.state.acumOrg] = this.props.usuarioDetail.usuario.acumOrg ? this.props.usuarioDetail.usuario.acumOrg : 0 + Number(value);
        }

        this.componentDatabase('update', `Usuario/${this.props.usuarioDetail.idUsuario}`, { ...usProp });
    }

    addNewMessage = (event) => {
        if (event.key === "Enter" || event.key === "13" || event === 'btAux') {
            let value = this.state.inputC;

            if (value !== null) {
                let reg = this.state.registro;
                if (this.state.onlyOptions && this.validarOpciones(value)) { return; }

                if (this.state.propertieBD) {
                    let registro = [];
                    registro[this.state.propertieBD] = value;
                    registro['mensgFlow'] = this.state.mensajeUs;

                    this.renderAcumUnd(value);

                    if (this.state.vartemp) {
                        let varTemporales = this.state.varstemp;
                        varTemporales[this.state.vartemp] = value;
                        this.setState({ varstemp: varTemporales });
                    }

                    if (this.state.objetoX) {
                        Object.keys(this.state.objetoP).map((key, index) => {
                            if (key === value) {
                                let keyReg = [];
                                keyReg[this.state.objetoP[key].fase ? this.state.objetoP[key].fase + 1 : 1] = this.state.objetoP[key];
                                registro[this.state.propertieBD] = keyReg;
                                registro['fase'] = this.state.objetoP[key].fase ? this.state.objetoP[key].fase + 1 : 2;
                            }

                        });
                    }

                    registro["facha"] = moment().format("MMM Do YY");

                    if (this.state.flagTiempo) {
                        this.secondsAcum = this.secondsAcum ? this.secondsAcum : 180;
                        registro["duracion"] = this.props.onMessage;
                        this.acumTask = this.props.onMessage + this.acumTask;

                        if (this.ndescansos !== Math.round((this.acumTask / Number(this.props.usuarioDetail.usuario.descanso))) && (this.acumTask / Number(this.props.usuarioDetail.usuario.descanso)) > 1) {
                            this.secondsAcum = this.secondsAcum + sleepTime;
                            this.ndescansos = this.ndescansos + 1;
                        }
                        registro["h-inicio"] = moment().add('seconds', this.secondsAcum).format('h:mm:ss a');
                        registro["h-fin"] = moment().add('seconds', this.secondsAcum).add('seconds', this.props.onMessage).format('h:mm:ss a');

                        if (this.stateAnt !== this.state.nivel) {
                            this.secondsAcum = this.secondsAcum + this.props.onMessage;
                            this.stateAnt = this.state.nivel;
                        }

                        registro["facha"] = moment().format("MMM Do YY");
                    }

                    if (this.state.nivelAnt !== null && this.state.nivelAnt !== undefined) {
                        let registroAnt = [];
                        for (const prop2 in this.state.addProperties) {
                            registroAnt[prop2] = this.state.addProperties[prop2];
                        }

                        reg[this.state.nivelAnt] = { ...reg[this.state.nivelAnt], ...registroAnt };

                    }
                    else {
                        for (const prop2 in this.state.addProperties) {
                            registro[prop2] = this.state.addProperties[prop2];
                        }
                    }

                    if (this.state.nuevoParam === value && (this.paramAnt === null || !this.paramAnt.find(element => element.value === value))) {

                        let newPostKey2 = this.componentDatabase('key', 'Usario-Pendiente');
                        registro[this.state.propertieBD] = newPostKey2;
                        this.paramAnt.push({ key: newPostKey2, value });
                        this.componentDatabase('update', `Usuario-Pendiente/${this.props.userId}/${newPostKey2}`, {
                            "concepto": value, "id": newPostKey2, flujoAux: this.state.flujoAux, "estado": "activo", "tipo": this.state.propertieBD
                        });

                    }
                    if (this.paramAnt.find(element => element.value === value)) {
                        Object.keys(this.paramAnt).map((key, index) => {
                            if (this.paramAnt[key].value === value) {
                                registro[this.state.propertieBD] = this.paramAnt[key].key;
                            }
                            return this.paramAnt[key];
                        });
                    }

                    if (this.state.stay !== null) {
                        this.setState({ stayValue: registro[this.state.propertieBD] });
                    }

                    if (this.state.property !== null && this.state.property !== undefined) {

                        registro[this.state.property] = this.state.stayValue;
                    }
                    if (this.state.carpeta) {
                        registro["carpeta"] = this.state.carpeta;
                        this.setState({ carpeta: null })
                    }
                    if (this.state.nivel !== null) {
                        if (reg.hasOwnProperty(this.state.nivel))
                            reg[this.state.nivel] = { ...reg[this.state.nivel], ...registro };
                        else
                            reg[this.state.nivel] = registro;
                    }
                    else {
                        reg = { ...reg, ...registro }
                    }


                    reg["etapa"] = reg["etapa"] + 1;
                    let consultP = this.state.consultaParams === null || this.state.consultaParams === undefined ? '' : this.state.consultaParams;

                    if (this.state.consultaParams) {
                        this.renderUpdateApis(this.queryConsulta + consultP);
                        this.componentDatabase('insert', this.queryConsulta + consultP + '/' + this.state.propertieBD, registro[this.state.propertieBD]);
                    }
                    else {
                        this.componentDatabase('update', this.queryConsulta, { ...reg });
                    }




                }
                else {

                    if (this.state.consultParam !== undefined)
                        this.setState({ consultaParams: "/" + value });
                }

                let pass = this.state.paso !== undefined && this.state.paso !== null ? this.state.paso : '';
                pass = event === 'btAux' ? this.state.pasoAux : pass;
                if (this.state.otherFlow) {
                    Object.keys(this.state.otherFlow).map((key, index) => {
                        if (this.state.otherFlow[key] === value) {
                            alert(value);
                            pass = pass + value;
                        }
                        return null;
                    });
                }


                if (this.state.workflow !== undefined && this.state.workflow !== null) {
                    this.validateWork(this.state.workflow, this.state.passflow.toString());
                    this.setState({ passflow: this.state.passflow + 1 });
                }
                else

                    this.client.textRequest(pass + " " + value).then(this.onResponse, this);

                if (this.state.usProperty) {

                    let propType = [];

                    if (this.state.usProperty === 'task')
                        propType[this.state.usProperty] = moment().format("YYYYMMDD");

                    this.componentDatabase('update', `Usuario/${this.props.usuarioDetail.idUsuario}`, { ...propType });

                }



                this.borrarDatos();
                this.setState({ registro: reg });

            }
        }
    };

    borrarDatos() {
        this.setState({ t2: null });
        this.setState({ UtilFactors: null });
        this.setState({ nuevoParam: null });
        this.setState({ inputC: null });
        this.setState({ flagTiempo: null });
        this.setState({ addProperties: null });
        this.setState({ paso: null });
        this.setState({ otherFlow: null });
        this.setState({ nivelAnt: null });
        this.setState({ vartemp: null });

        this.setState({ objetoX: null });
        this.setState({ pasoAux: null });
        this.setState({ btAux: null });
        this.setState({ objetoP: null });
        this.setState({ consultParam: null });
        this.setState({ opcionesDB: null });
        this.setState({ onlyOptions: null });
        this.setState({ flag: true });
        this.setState({ textAux: true });
        this.setState({ helpMessage: null });
        this.setState({ acumOrg: null });
        this.setState({ acumImpacto: null });
        this.setState({ acumEquipo: null });
        this.setState({ acumCompromiso: null });
        this.setState({ acumYo: null });
        this.setState({ sleep: null });
        this.setState({ acumTalento: null });

        this.setState({ tipoIn: 1 });


    }
    /*
        parseText z= (event) => {
           
                if (event.action !== undefined) {
                    return event.action.value;
                } else if (event.value) {
                    return event.value;
                } else {
                    return event.message.text;
                }
            
        }
     
    */
    handlePaso = () => {
        this.timeout = setTimeout(() => {
            if (this.efectoPass === false && this.primeraV === false) {
                this.primeraV = true;
                this.efectoPass = true;
                let text = document.body.querySelector(".text");
                const split = acAnimated.Plugins.SplitText(text, { words: 1, chars: 1, spacing: 10 });
                let timeline = null;
                let i;
                console.log(this.props.tipo)
                switch (this.props.tipo) {
                    case 0:
                        console.log('entro ssda')
                        timeline = new window.TimelineMax({ repeat: -1, repeatDelay: 100, yoyo: true, });
                        for (i = 0; i <= split.chars.length - 1; i++) {
                            var char = split.chars[i];
                            timeline.add("animated_char_" + String(i), acAnimated.randomNumber(1, 20) / 10);
                            timeline.add(acAnimated.animateChar(char), "animated_char_" + String(i));
                        }
                        timeline.to(text, 3, {}).to(text, 1, { opacity: 0 });
                        timeline.duration(5);
                        break;
                    case 1:
                        timeline = new window.TimelineMax({ repeat: -1, repeatDelay: 100,  yoyo: true, });
                        for (i = 0; i <= split.words.length - 1; i++) {
                            var word = split.words[i];
                            timeline
                                .add("animated_word_" + String(i), acAnimated.randomNumber(1, 20) / 10)
                                .add(acAnimated.animateWord(word), "animated_word_" + String(i));
                        }
                        timeline.to(text, 3, {}).to(text, 1, { opacity: 0 });
                        timeline.duration(5)
                        break;
                    case 2:
                        for (i = 0; i <= split.chars.length - 1; i++) {
                            window.TweenMax.from(split.chars[i], 1.8, {
                                opacity: 0,
                                x: this.randomMax(-100, 100),
                                y: this.randomMax(-100, 100),
                                z: this.randomMax(-100, 100),
                                scale: .1,
                                delay: i * .03,
                                yoyo: false,
                                repeat: -1,
                                repeatDelay: 500
                            });
                        };
                        break;
                    case 3:
                        for (i = 0; i <= split.words.length - 1; i++) {
                            window.TweenMax.from(split.words[i], 1.8, {
                                opacity: 0,
                                x: this.randomMax(-100, 100),
                                y: this.randomMax(-100, 100),
                                z: this.randomMax(-100, 100),
                                scale: 1,
                                delay: i * .12,
                                yoyo: false,
                                repeat: -1,
                                repeatDelay: 500
                            });
                        };
                        break;

                    default:
                        break;
                }

            }
            else {
                this.efectoPass = false;
            }
        }, timeoutLength)
    }

    organizarConsulta(parametros) {
        let param = [];
        for (const prop2 in parametros) {
            param[parametros[prop2]] = this.props.consultax[parametros[prop2]];
        }

        return param;
    }

    renderOpcionesDB(consulta, criteria, parametros) {

        if (consulta !== null && parametros !== null && criteria !== null) {
            let opciones = null;
            for (const prop in parametros) {
                consulta = consulta.replace(prop, parametros[prop]);
            }

            const starCountRef3 = this.componentDatabase('get', consulta);
            return starCountRef3.on('value', (snapshot) => {
                let objetos = snapshot.val();
                let opcionesCombo = [];
                let objetosOp = [];
                if (snapshot.val()) {
                    Object.keys(objetos).map((key, index) => {
                        let objeto = objetos[key];
                        this.setState({ UtilFactors: snapshot.val() });
                        let flagCriteria = 0;
                        let countCriteria = 0;
                        for (const cri in criteria) {
                            countCriteria++;
                            for (const propObj in objeto) {
                                if (propObj === cri) {

                                    if (objeto[propObj] === criteria[cri]) {
                                        flagCriteria++;
                                    }
                                }
                            }
                        }
                        if (flagCriteria === countCriteria) {
                            let opciones = this.state.opcionValue;

                            opciones[objeto.concepto] = key;
                            objetosOp[key] = objeto;

                            this.setState({ opcionValue: opciones })
                            opcionesCombo.push(<option value={objeto.concepto} key={key} />)
                        }

                        return null;
                    });


                }
                this.setState({ objetoP: objetosOp })
                opcionesCombo = listTemporalObject(this.state.propertieBD, opcionesCombo, this.pendingConsulta);
                this.setState({ opcionValue: listTemporalOpciones(this.state.propertieBD, this.state.opcionValue, this.pendingConsulta) })
                console.log(opcionesCombo)
                if (this.state.onlyOptions && Object.keys(opcionesCombo).length === 0) {

                    this.client.textRequest(this.state.paso).then(this.onResponse, this);
                }
                else {
                    this.setState({
                        opcionesDB: <datalist id='opciones'>
                            {opcionesCombo}
                        </datalist>
                    });
                }
            });

        }

    }


    opcionesLoad = () => {
        this.timeout = setTimeout(() => {
            let btAuxiliar = null;
            if (this.state.btAux) {
                btAuxiliar = <div style={{ width: '100%', top: '35%', position: 'relative' }}>
                    <h5 href="#" className="action-button animate purple" style={{ fontSize: 'smaller', width: window.innerWidth * 0.65, height: '3.5em' }} key={this.state.btAux} onClick={() => { this.addNewMessage('btAux') }}>{this.state.btAux}</h5>
                </div>
            }

            let opciones = <React.Fragment  >
                <input
                    value={this.state.inputC}
                    onChange={this.onInputChange}
                    onKeyPress={(e) => { this.addNewMessage(e) }}
                    list='opciones' placeholder='Escoge una Opcion...'
                    className='select'
                    style={{ top: '20%', position: 'relative', width: '100%', height: '2em' }}
                />
                {this.state.opcionesDB}
            </React.Fragment >
            this.setState({
                t2: <div className="Wrapper" style={{ top: this.state.mensajeUs.length > 50 ? "60%" : "50%", height: '10em' }}>
                    <div className="ui container" style={{ height: '10em', width: '50%' }}>
                        {opciones}
                        {btAuxiliar}
                    </div>
                </div>
            });

        }, 2000)
    }


    Cambio = () => {
        this.timeout = setTimeout(() => {
            if (this.state.flag === true) {
                this.handlePaso();
                this.text2();
            }
            this.setState({ flag: false });
        }, timeoutLength2)
    }


    MensajeIntro = () => {
        this.timeout = setTimeout(() => {
            this.client.textRequest(this.state.paso).then(this.onResponse, this);
            this.borrarDatos();
        }, this.state.sleep)
    }

    Cerrar = () => {
        this.timeout = setTimeout(() => {

            if (this.state.pendingOk !== null) {
                this.pendingConsulta = this.pendingConsulta + '/' + this.state.nivel;
                this.componentDatabase('insert', this.pendingConsulta, {});
            }
            let reg = this.state.registro;
            reg["etapa"] = reg["etapa"] ? reg["etapa"] : 0 + 1;
            reg["estado"] = "completo";
            if (this.state.consultaParams === null || this.state.consultaParams === undefined) {
                this.componentDatabase('update', this.queryConsulta, { ...reg });

            }
            this.setState({ registro: null })
            this.props.endChatMes(true);
            this.props.chatOff();
        }, timeoutLength3)
    }

    onInputChange = (event, text = null) => {
        let flagNuevo = true;
        let opciones = this.state.opcionValue;
        Object.keys(opciones).map((key, index) => {
            if (event.target.value === key) {
                this.setState({ inputC: opciones[key] });
                flagNuevo = false;
            }
            return opciones[key];
        });
        if (flagNuevo === true) {
            this.setState({ nuevoParam: event.target.value });
            this.setState({ inputC: event.target.value });
        }


    };


    text2 = () => {
        this.timeout = setTimeout(() => {
            if (!this.state.t2 && this.state.response === null) {

                let tiempo = null;
                let btAuxiliar = null;

                if (this.state.btAux) {
                    btAuxiliar = <div style={{ width: '100%', top: '25%', position: 'relative' }}>
                        <h5 href="#" className="action-button animate purple" style={{ fontSize: 'smaller', width: window.innerWidth * 0.65, height: '5em' }} key={this.state.btAux} onClick={() => { this.addNewMessage('btAux') }}>{this.state.btAux}</h5>
                    </div>
                }
                let topTiempo = '10em';
                if (this.state.flagTiempo) {
                    topTiempo = '20em';
                    tiempo = <TimerClock programa={'PWA'}></TimerClock>
                }

                let opciones = null;
                if (this.state.tipoIn === 0) {
                    this.MensajeIntro();
                }
                else if (this.state.tipoIn === 99) {
                    
                }
                else if (this.state.tipoIn === 1) {
                    this.setState({
                        t2: <div className="Wrapper" style={{ top: '50%', height: '19em', transform: 'scale(0.85)', position: 'absolute' }}>
                            <div className="ui container" style={{ height: topTiempo, width: '100%' }}>

                                <div className="Input" style={{ top: '10%' }}>
                                    <input type="text" id="input" className="Input-text" style={{ height: '2em', top: '0.3em', position: 'relative' }}
                                        value={this.state.inputC}
                                        onChange={(event) => this.setState({ inputC: event.target.value })}
                                        onKeyPress={(e) => { this.addNewMessage(e) }} placeholder="Escribe tu respuesta" />
                                    <label className="Input-label" style={{ transform: 'scale(0.7)' }}>{this.state.textAux}</label>
                                </div>
                                {btAuxiliar}
                                {tiempo}
                            </div>
                        </div>
                    });
                }
                else if (this.state.tipoIn === 4) {
                    this.setState({
                        t2: <div className="Wrapper" style={{ top: '50%', height: '18em' }}>
                            <div className="ui container" style={{ height: topTiempo, width: '100%' }}>

                                {tiempo}
                                <h5 href="#" style={{
                                    position: 'relative',
                                    top: '1.3em',
                                    width: '70%',
                                    left: '13%'
                                }} className="action-button animate purple" key={1} onClick={() => { this.clickOpcion('') }}>Continuar</h5>
                            </div>
                        </div>
                    });
                }
                else if (this.state.tipoIn === 3) {
                    this.renderOpcionesDB(this.state.consulta, this.state.criteria, this.state.parametros);
                    this.opcionesLoad();
                }
                else {
                    //    console.log(this.state.opciones);
                    if (this.state.opciones !== undefined) {
                        let cCon = this.state.opciones;
                        let tabla = [];
                        opciones = Object.keys(cCon).map((key, index) => {
                            tabla.push(<div key={key} style={{ width: '100%' }}>
                                <h5 href="#" className="action-button animate purple" style={{ fontSize: 'small', width: window.innerWidth * 0.65 }} key={cCon[key]} onClick={() => { this.clickOpcion(cCon[key]) }}>{cCon[key]}</h5>
                                <br style={{ height: '2em' }}></br>
                            </div>)
                            return null;
                        });
                        //   this.props.sendMessage(this.state.opciones.title);

                        let menus = <div className="Wrapper" style={{ top: window.innerHeight * 0.60, height: '16em' }}  >
                            {tabla}
                        </div>

                        this.setState({
                            t2: <div style={{ left: '3%', position: 'relative' }} >
                                {menus}
                            </div>
                        });
                    }


                }
            }
        }, timeoutLength * 2)
    }


    clickOpcion(opcion) {

        let pass = this.state.paso !== null && this.state.paso !== undefined ? this.state.paso + ' ' : '';
        if (this.state.consultaParams) {
            let consultP = this.state.consultaParams === null || this.state.consultaParams === undefined ? '' : this.state.consultaParams;
            let registro = [];
            if (this.state.flagTiempo) {

                registro["duracion"] = this.props.onMessage;
                registro["h-inicio"] = moment().format('h:mm:ss a');
                registro["h-fin"] = moment().add('seconds', this.props.onMessage).format('h:mm:ss a');
                registro["facha"] = moment().format("MMM Do YY");
            }
            this.componentDatabase('update', this.queryConsulta + consultP, { ...registro });

        }

        else {
            if (opcion === '')
                if (this.state.consultParam !== undefined)
                    this.setState({ consultaParams: this.state.consultaParams + "/" + opcion });

        }

        this.client.textRequest(pass + opcion).then(this.onResponse, this);
        this.setState({ opciones: null });
        this.setState({ tipoIn: 1 });
        this.setState({ t2: null })
        this.setState({ inputC: null })
        this.setState({ flag: true })
    }


    Help = () => {
        this.timeout = setTimeout(() => {
            if (this.state.helpMessage)
                this.props.popupBot({ mensaje: this.state.helpMessage, sleep: 2000, onbot: true });
        }, timeoutLengthHelp)
    }


    render() {

        let t1 = null;

        if (this.state.flag) {
            this.Cambio();
            t1 = <div className="loader">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>


            </div>;
        }
        else {
            this.Help();
            let xLetter = this.state.mensajeUs && this.state.mensajeUs.length > 35 ? this.state.mensajeUs.length < 60 ? '1.5em' : '1.3em' : '1.8em';
            let x1Letter = this.state.mensajeUs && this.state.mensajeUs.length > 35 ? this.state.mensajeUs.length < 60 ? '-2.1em' : '-1.4em' : '-2.8em';
            let tLetter = this.state.mensajeUs && this.state.mensajeUs.length > 35 ? this.state.mensajeUs.length < 60 ? '-3.5em' : '-6em' : '-3em';
            t1 = <div className='text' id='text' style={{ opacity: '1.5' }}>
                <p className="split" style={{ opacity: '1', fontSize: xLetter, width: '10em', left: x1Letter, color: '#e8f5e8', position: 'relative', top: tLetter, height: '3em', transform: 'scale(0.75)' }} >
                    {this.state.mensajeUs}
                </p>
            </div>


        }

        return (
            <div className="sp-containerE1">
                {t1}
                {this.state.t2}

            </div>
        );

    }
};

const mapAppStateToProps = (state) => (
    {
        numeroTareasTerminadas: state.chatReducer.numeroTareasTerminadas,
        usuarioDetail: state.chatReducer.usuarioDetail,
        selObjetivo: state.chatReducer.selObjetivo,
        onMessage: state.auth.onMessage,
        listaObjetivo: state.chatReducer.listaObjetivo,
        consultax: state.chatReducer.consultax,
        nombreUser: state.chatReducer.nombreUser,
        mensajeChatBot: state.chatReducer.mensajeChatBot,
        userId: state.auth.userId,
        equipoConsulta: state.chatReducer.equipoConsulta,
        pregFantasma: state.chatReducer.pregFantasma,
        mensajeEnt: state.chatReducer.mensajeEnt,
        consultaPreguntaControl: state.chatReducer.consultaPreguntaControl,
        valorInput: state.chatReducer.valorInput,
        numeroPregunta: state.chatReducer.numeroPregunta,
        consultaPregunta: state.chatReducer.consultaPregunta,
        idChatUser: state.chatReducer.idChatUser,
        ValorTexto: state.chatReducer.ValorTexto,
        inputSlack: state.chatReducer.inputSlack,
        user: state.user
    });


export default connect(mapAppStateToProps, { sendMessage, chatOff, endChatMes, consultas, popupBot, mensajeChat })(listActividades);
