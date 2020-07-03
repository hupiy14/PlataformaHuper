import React from 'react';
import { connect } from 'react-redux';
import './efect.scss';
import acAnimated from "./splitText";
import { ApiAiClient } from 'api-ai-javascript';
import { sendMessage, chatOff, endChatMes, popupBot, mensajeChat } from '../../../actions';
import { consultas } from '../../modules/chatBot/actions';
import TimerClock from '../timerClock/timerr';
import firebase from 'firebase';
import moment from 'moment';
import asanaH from '../../../apis/asana';
import { clientIdAsana, clientSecrectAsana } from '../../../apis/stringConnection';
import axios from 'axios';
import chroma from 'chroma-js';
let Trello = require("trello");
const timeoutLength = 1500;
const timeoutLength2 = 2000;
const timeoutLength3 = 3000;

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
        opcionesDB: null, keyNivel: '', flujoAux: null, pendingOk: null, pendingConsulta: null, onlyOptions: null, workFlow: null, passflow: 0, objTask: null, carpeta: null
    }

    componentWillMount() {
        this.secondsAcum = 0;
        this.stateAnt = null;
        this.pasoAnt = null;
        this.paramAnt = [];
        this.st = this.renderStyles();
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
                const starCountRef3 = firebase.database().ref().child(this.queryConsulta);
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
            const starCountRef4 = firebase.database().ref().child(this.pendingConsulta);
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
                ///this.props.mensajeChatBot
                console.log('trabajo');
                console.log(this.mensaje);
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
                    let registro = []
                    for (const prop2 in pending[key]) {
                        if (prop2 !== 'flujoAux' && prop2 !== 'id') {
                            registro[prop2] = pending[key][prop2];
                        }
                    }
                    let reg = [];
                    reg[key] = { ...this.state.registro[key], ...registro };
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
        console.log(flujo);
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
            let newPostKey2 = firebase.database().ref().child(this.queryConsulta).push().key;
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
        console.log(men)
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
        let ind = 0;
        activity.result.fulfillment.messages.forEach(function (element) {
            console.log(element);

            if (ind === 0)
                if (element.payload !== undefined) {
                    ind++;
                    let nuevo = element.payload;

                    if (that.state.pasoFlujo > 1 && that.state.pasoFlujo - 1 <= that.state.etapa && that.state.etapa != null) {
                        that.borrarDatos();
                        that.adelantar(that.state.flujo);
                    }
                    else {
                        console.log(nuevo);
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
                            that.setState({ mensajeUs: nuevo.mensaje.replace("@nombre", that.props.usuarioDetail.usuario.usuario) });
                            that.setState({ propertieBD: nuevo.bd });
                            that.setState({ property: nuevo.property });
                            that.setState({ stay: nuevo.stay });
                            that.setState({ paso: nuevo.paso });
                            that.setState({ onlyOptions: nuevo.onlyOptions });
                            that.setState({ consultParam: nuevo.consultParam });
                            that.setState({ tipoIn: 3 });
                            that.urlBsaseDatos(nuevo.structure);
                            if (nuevo.carpeta)
                                that.crearCarpeta();
                        }

                        else if (nuevo.tipo === "mensaje") {
                            that.setState({ pasoFlujo: null });
                            that.validarNivel(nuevo.nivel, nuevo.ChangeLevel);
                            that.setState({ nivelAnt: nuevo.nivelAnt });
                            that.setState({ property: nuevo.property });
                            that.setState({ stay: nuevo.stay });
                            that.setState({ addProperties: nuevo.add });
                            that.setState({ mensajeUs: nuevo.mensaje.replace("@nombre", that.props.usuarioDetail.usuario.usuario) });
                            that.setState({ textAux: nuevo.labelAux });
                            that.setState({ paso: nuevo.paso });
                            that.setState({ flagTiempo: nuevo.tiempo });
                            that.setState({ propertieBD: nuevo.bd });
                            that.urlBsaseDatos(nuevo.structure);
                            if (nuevo.carpeta)
                                that.crearCarpeta();
                        }
                        else if (nuevo.tipo === "tiempo") {
                            that.setState({ pasoFlujo: null });
                            that.validarNivel(nuevo.nivel, nuevo.ChangeLevel);
                            that.setState({ nivelAnt: nuevo.nivelAnt });
                            that.setState({ property: nuevo.property });
                            that.setState({ stay: nuevo.stay });
                            that.setState({ addProperties: nuevo.add });
                            that.setState({ mensajeUs: nuevo.mensaje.replace("@nombre", that.props.usuarioDetail.usuario.usuario) });
                            that.setState({ flagTiempo: nuevo.tiempo });
                            that.setState({ propertieBD: nuevo.bd });
                            that.setState({ paso: nuevo.paso });
                            that.setState({ tipoIn: 4 });
                        }
                        else if (nuevo.tipo === "opciones") {

                            that.setState({ consultParam: nuevo.consultParam });
                            that.setState({ mensajeUs: nuevo.mensaje.replace("@nombre", that.props.usuarioDetail.usuario.usuario) });
                            that.setState({ tipoIn: 2 });
                            that.setState({ paso: nuevo.paso });
                            that.setState({ opciones: nuevo.opciones });

                        }
                        else {
                            that.setState({ mensajeUs: nuevo.mensaje.replace("@nombre", that.props.usuarioDetail.usuario.usuario) });
                            that.Cerrar();
                        }
                    }
                }

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
            console.log(id);
            const starCountRef2 = firebase.database().ref().child(queryConsulta);
            starCountRef2.on('value', (snapshot2) => {
                if (snapshot2.val() && snapshot2.val().tipo) {
                    switch (snapshot2.val().tipo) {
                        case 'asana':
                            const starCountRef = firebase.database().ref().child(`Usuario-Asana/${this.props.usuarioDetail.idUsuario}`);
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

                                            console.log('bien');
                                        }).catch(err => { this.props.popupBot({ mensaje: 'He tenido un probema !!!' }); });
                                }
                                ).catch(err => { this.props.popupBot({ mensaje: 'He tenido un probema  en confimar tu usuario!!!' }); })
                            });

                            break;
                        case 'trello':
                            const starCountRef2 = firebase.database().ref().child(`Usuario-Trello/${this.props.usuarioDetail.idUsuario}`);
                            starCountRef2.on('value', (snapshot) => {

                                let trelloClient = snapshot.val();
                                let trello = new Trello(trelloClient.trelloApi, trelloClient.tokenTrello);
                                trello.makeRequest('put', '/1/cards/' + id, { webhooks: true, idList: trelloClient.listaOBjetivosDone.value }).then((res) => {
                                    console.log(res);
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



    renderStyles() {

        let dot = (color = '#ccc') => ({
            alignItems: 'center',
            display: 'flex',

            ':before': {
                backgroundColor: '#48f70f',
                borderRadius: 10,
                content: '" "',
                display: 'block',
                marginRight: 8,
                height: 10,
                width: 10,
            },
        });



        let st = {
            control: styles => ({ ...styles, backgroundColor: 'white' }),

            option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                const color = chroma('#48f70f');
                return {
                    ...styles,
                    backgroundColor: isDisabled
                        ? null
                        : isSelected
                            ? data.color
                            : isFocused
                                ? color.alpha(0.1).css()
                                : null,
                    color: isDisabled
                        ? '#ccc'
                        : isSelected
                            ? chroma.contrast(color, 'white') > 2
                                ? 'white'
                                : 'black'
                            : data.color,
                    cursor: isDisabled ? 'not-allowed' : 'default',

                    ':active': {
                        ...styles[':active'],
                        backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
                    },
                };
            },
            input: styles => ({ ...styles, ...dot }),
            placeholder: styles => ({ ...styles, ...dot }),
            singleValue: (styles, { data }) => ({ ...styles, ...dot('#48f70f') }),
        };

        return st;
    }


    addNewMessage = (event) => {
        console.log(event);
        if (event.key === "Enter" || event.key === "13") {
            let value = this.state.inputC;

            if (value !== null) {
                let reg = this.state.registro;
                if (this.state.onlyOptions && this.validarOpciones(value)) { return; }

                if (this.state.propertieBD) {
                    let registro = [];
                    registro[this.state.propertieBD] = value;
                    registro["facha"] = moment().format("MMM Do YY");

                    if (this.state.flagTiempo) {
                        this.secondsAcum = this.secondsAcum ? this.secondsAcum : 180;
                        registro["duracion"] = this.props.onMessage;
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

                        let newPostKey2 = firebase.database().ref().child('Usario-Pendiente').push().key;
                        registro[this.state.propertieBD] = newPostKey2;
                        this.paramAnt.push({ key: newPostKey2, value });
                        alert(newPostKey2);
                        firebase.database().ref(`Usuario-Pendiente/${this.props.userId}/${newPostKey2}`).update({
                            "concepto": value, "id": newPostKey2, flujoAux: this.state.flujoAux, "estado": "activo", "tipo": this.state.propertieBD
                        });

                    }
                    if (this.paramAnt.find(element => element.value === value)) {
                        Object.keys(this.paramAnt).map((key, index) => {
                            if (this.paramAnt[key].value === value){
                                registro[this.state.propertieBD] = this.paramAnt[key].key;
                                alert(value);
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
                        firebase.database().ref(this.queryConsulta + consultP + '/' + this.state.propertieBD).set(registro[this.state.propertieBD]);
                    }
                    else {

                        firebase.database().ref(this.queryConsulta).update({
                            ...reg
                        });
                    }


                }
                else {

                    if (this.state.consultParam !== undefined)
                        this.setState({ consultaParams: "/" + value });
                }

                let pass = this.state.paso !== undefined && this.state.paso !== null ? this.state.paso : '';


                if (this.state.workflow !== undefined && this.state.workflow !== null) {
                    this.validateWork(this.state.workflow, this.state.passflow.toString());
                    this.setState({ passflow: this.state.passflow + 1 });
                }
                else

                    this.client.textRequest(pass + " " + value).then(this.onResponse, this);
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
        this.setState({ nivelAnt: null });
        this.setState({ consultParam: null });
        this.setState({ opcionesDB: null });
        this.setState({ onlyOptions: null });
        this.setState({ flag: true });
        this.setState({ textAux: true });
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
            let text = document.body.querySelector(".text");
            const split = acAnimated.Plugins.SplitText(text, { words: 1, chars: 1, spacing: 10 });
            let timeline = null;
            let i;
            switch (this.props.tipo) {
                case 0:
                    timeline = new window.TimelineMax({ repeat: -1, repeatDelay: 0 });
                    for (i = 0; i <= split.chars.length - 1; i++) {
                        var char = split.chars[i];
                        timeline.add("animated_char_" + String(i), acAnimated.randomNumber(1, 20) / 10);
                        timeline.add(acAnimated.animateChar(char), "animated_char_" + String(i));
                    }
                    timeline.to(text, 3, {}).to(text, 1, { opacity: 0 });
                    break;
                case 1:
                    timeline = new window.TimelineMax({ repeat: -1, repeatDelay: 0 });
                    for (i = 0; i <= split.words.length - 1; i++) {
                        var word = split.words[i];
                        timeline
                            .add("animated_word_" + String(i), acAnimated.randomNumber(1, 20) / 10)
                            .add(acAnimated.animateWord(word), "animated_word_" + String(i));
                    }
                    timeline.to(text, 3, {}).to(text, 1, { opacity: 0 });
                    break;
                case 2:
                    for (i = 0; i <= split.chars.length - 1; i++) {
                        window.TweenMax.from(split.chars[i], 1.8, {
                            opacity: 0,
                            x: this.randomMax(-100, 100),
                            y: this.randomMax(-100, 100),
                            z: this.randomMax(-100, 100),
                            scale: .1,
                            delay: i * .02,
                            yoyo: true,
                            repeat: -1,
                            repeatDelay: 10
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
                            delay: i * .02,
                            yoyo: true,
                            repeat: -1,
                            repeatDelay: 10
                        });
                    };
                    break;

                default:
                    break;
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

            const starCountRef3 = firebase.database().ref().child(consulta);
            return starCountRef3.on('value', (snapshot) => {
                let objetos = snapshot.val();
                if (snapshot.val()) {
                    opciones = Object.keys(objetos).map((key, index) => {
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
                            this.setState({ opcionValue: opciones })
                            return <option value={objeto.concepto} key={key} />
                        }

                        return null;
                    });
                    this.setState({
                        opcionesDB: <datalist id='opciones'>
                            {opciones}
                        </datalist>
                    });
                }
            });

        }

    }


    opcionesLoad = () => {
        this.timeout = setTimeout(() => {

            let opciones = <React.Fragment  >
                <input
                    value={this.state.inputC}

                    onChange={this.onInputChange}
                    onKeyPress={(e) => { this.addNewMessage(e) }}
                    list='opciones' placeholder='Escoge una Opcion...'
                    className='select'
                    style={{ top: '25%', position: 'relative', width: '100%' }}
                />
                {this.state.opcionesDB}

            </React.Fragment >
            this.setState({
                t2: <div className="Wrapper" style={{ top: window.innerHeight * 0.7 }}>
                    <div className="ui container" style={{ height: '5em', width: '50%' }}>
                        {opciones}
                    </div>
                </div>
            });

        }, 1000)
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

    Cerrar = () => {
        this.timeout = setTimeout(() => {

            if (this.state.pendingOk !== null) {
                this.pendingConsulta = this.pendingConsulta + '/' + this.state.nivel;
                firebase.database().ref(this.pendingConsulta).set({});
            }
            let reg = this.state.registro;
            reg["etapa"] = reg["etapa"] + 1;
            reg["estado"] = "completo";
            if (this.state.consultaParams === null || this.state.consultaParams === undefined) {
                firebase.database().ref(this.queryConsulta).update({
                    ...reg
                });
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
                let topTiempo = '4em';
                if (this.state.flagTiempo) {
                    topTiempo = '20em';
                    tiempo = <TimerClock programa={true}></TimerClock>
                }

                let opciones = null;

                /*
                  
                       <a href="#" className="action-button  animate blue">Hello</a>
                            <a href="#" className="action-button  animate red">How</a>
                            <a href="#" className="action-button  animate green">Are</a>
                            <a href="#" className="action-button  animate yellow">You?</a>
                */

                if (this.state.tipoIn === 1) {
                    this.setState({
                        t2: <div className="Wrapper" style={{ top: window.innerHeight * 0.5, height: '19em' }}>
                            <div className="ui container" style={{ height: topTiempo, width: '40%' }}>

                                <div className="Input" style={{ top: '25%' }}>
                                    <input type="text" id="input" className="Input-text"
                                        value={this.state.inputC}
                                        onChange={(event) => this.setState({ inputC: event.target.value })}
                                        onKeyPress={(e) => { this.addNewMessage(e) }} placeholder="Escribe tu respuesta" />
                                    <label className="Input-label">{this.state.textAux}</label>
                                </div>

                                {tiempo}
                            </div>
                        </div>
                    });
                }
                else if (this.state.tipoIn === 4) {
                    this.setState({
                        t2: <div className="Wrapper" style={{ top: window.innerHeight * 0.5, height: '18em' }}>
                            <div className="ui container" style={{ height: topTiempo, width: '40%' }}>

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
                            tabla.push(<div style={{ width: '110%', paddingLeft: '15%' }}>
                                <h5 href="#" className="action-button animate purple" key={cCon[key]} onClick={() => { this.clickOpcion(cCon[key]) }}>{cCon[key]}</h5>
                            </div>)

                            let tabla2 = tabla;
                            if ((index !== 0 && (index + 1) % 3 === 0) || Object.keys(cCon).length - 1 === index) {
                                tabla = [];

                                let pad = '13em';
                                if ((index + 1) % 3 === 0)
                                    pad = '0.4em';

                                return <div className="Wrapper" style={{ top: window.innerHeight * 0.6, paddingLeft: pad }}  >
                                    {tabla2}
                                </div>
                            }
                            return null;
                        });
                        //   this.props.sendMessage(this.state.opciones.title);

                        this.setState({
                            t2: <div style={{ left: '-2%', position: 'relative' }} >
                                {opciones}
                            </div>
                        });
                    }


                }
            }
        }, timeoutLength * 3)
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

            firebase.database().ref(this.queryConsulta + consultP).update(
                { ...registro });

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
            t1 = <div className='text' id='text' style={{ opacity: '1' }}>
                <p className="split" style={{ opacity: '1', fontSize: '1.8em', color: '#e8f5e8', position: 'relative', top: '-0.4em', height: '2em' }} >
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