import React from 'react';
import { connect } from 'react-redux';
import './efect.scss';
import acAnimated from "./splitText";
import { ApiAiClient } from 'api-ai-javascript';
import { sendMessage, chatOff, endChatMes, popupBot, mensajeChat } from '../../../actions';
import { consultas } from '../../modules/chatBot/actions';
import TimerClock from '../timerClock/timerr';
import moment from 'moment';
import { dataBaseManager } from '../../../lib/utils';

const timeoutLength = 2000;
const timeoutLength2 = 2000;
const timeoutLength3 = 5000;
acAnimated.randomNumber = function (min, max) {
    var num = min + Math.floor(Math.random() * (max - (min - 1)));
    return num;
}
acAnimated.randomDirection = function (number) {
    var direction = Math.floor(Math.random() * 2);
    if (direction == 0) number = 0 - number;
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

class efectText extends React.Component {
    state = {
        actividades: null, tiempos: 0, horamaxima: 8, primero: null, aux: null
        , index: 0, delay: .02, mensaje: null, messages: [], inputC: null, flag: false, response: null, tipoIn: 1, flagTiempo: false, textAux: null, opciones: null,
        consulta: null, criteria: null, parametros: null, mensajeUs: null, propertieBD: null, registro: [], opcionValue: [], nivel: null, addProperties: null, nuevoParam: null,
        paso: null, nivelAnt: null, stay: null, property: null, stayValue: null, pasoFlujo: 1, flujo: null, etapa: null, consultaParams: null,
        opcionesDB: null, keyNivel: '', flujoAux: null, pendingOk: null, pendingConsulta: null, onlyOptions: null, workFlow: null, passflow: 0, objTask: null, carpeta: null, etapa: null
    }


    componentDatabase(tipo, path, objectIn, mensaje, mensajeError) {
        let men = dataBaseManager(tipo, path, objectIn, mensaje, mensajeError);
        if (men && men.mensaje)
            this.props.popupBot({ mensaje: men.mensaje });
        return men;
    }

    componentWillMount() {
        this.secondsAcum = 0;
        this.stateAnt = null;
        this.in = 0;
        this.pasoAnt = null;
        if (this.mensaje === undefined || this.props.mensajeChatBot === null || (this.props.mensajeChatBot && this.mensaje !== this.props.mensajeChatBot.mensaje))
            this.chatBotSfot();
    }



    chatBotSfot() {
        this.props.consultas({ ...this.props.consultax, currentId: this.props.userId, hoy: moment().format("YYYYMMDD"), util: 'prioridad' });
        this.state.registro["etapa"] = 0;
        this.borrarDatos();
        this.etapa = null;
        console.log(this.props.mensajeChatBot)
        if (this.props.mensajeChatBot && this.props.mensajeChatBot.agent === 'soft') {
            this.queryConsulta = `Usuario-Soft/${this.props.userId}/${moment().format("YYYYMM")}/${moment().format("DD")}`;
            this.client = new ApiAiClient({ accessToken: '7ad0665ad3b64ec2b59721cb7fa53e07' });
        }
        else {
            this.client = new ApiAiClient({ accessToken: 'dfd956d241004b8b87e1c293399dabf6' });
            if (this.props.mensajeChatBot && this.props.mensajeChatBot.agent === 'task') {


                this.queryConsulta = `Usuario-Task/${this.props.userId}/${moment().format("YYYYMMDD")}`;
                const consultaTask = this.componentDatabase('get', this.queryConsulta);
                this.consultaTareas(consultaTask);
            }
            else {
                this.queryConsulta = `Usuario-OKR/${this.props.userId}`;
            }
            //consulta pendientes
            this.pendingConsulta = `Usuario-Pendiente/${this.props.userId}`;
            const consultaPending = this.componentDatabase('get', this.pendingConsulta);
            let pending = null;
            consultaPending.on('value', (snapshot) => {
                if (snapshot.val() !== null) {
                    pending = snapshot.val();
                }
            });
            this.validarPending(pending);
        }
        this.ActualizacionPaso(this.etapa);
    }

    consultaTareas(consultaTask) {
        this.secondsAcum = 0;
        consultaTask.on('value', (snapshot) => {
            if (snapshot.val() !== null && snapshot.val().estado !== 'completo') {
                this.etapa = snapshot.val().etapa;
                this.setState({ etapa: this.etapa });
                Object.keys(snapshot.val()).map((key, index) => {
                    if (snapshot.val()[key].duracion)
                        this.secondsAcum = snapshot.val()[key].duracion + this.secondsAcum;
                });
            }
            else if (snapshot.val() !== null && snapshot.val().estado === 'completo') {
                this.setState({ objTask: snapshot.val() });
            }
        });
    }

    ActualizacionPaso = () => {
        this.timeout = setTimeout(() => {
            this.props.mensajeChat(null);
            if (this.etapa) {
                this.state.registro["etapa"] = this.etapa;
                this.client.textRequest('Continuar planificando mi día', { sessionId: 'test' }).then(this.onResponse, this);
            }
            else {
                this.mensaje = this.props.mensajeChatBot && this.props.mensajeChatBot.mensaje ? this.props.mensajeChatBot.mensaje : 'hola';
                this.client.textRequest(this.mensaje, { sessionId: 'test' }).then(this.onResponse, this);
            }

            // this.client.eventRequest("hola").then(this.onResponse, this);
            this.handlePaso(this.flagT);
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
                    this.state.registro[key] = { ...this.state.registro[key], ...registro }
                    pending[key].estado = 'completo';
                    this.setState({ pendingOk: pending[key] });
                    this.adelantar(pending[key].flujoAux);
                    return;
                }
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
        let index = 0;
        activity.result.fulfillment.messages.forEach((element) => {
            //            console.log(element);

            if (element.payload !== undefined && index === 0) {
                let nuevo = element.payload;
                index++;
                //  console.log(that.state.pasoFlujo);
                //console.log(nuevo);
                if (this.state.pasoFlujo > 1 && this.state.pasoFlujo <= this.state.etapa && this.state.etapa != null) {
                    this.borrarDatos();
                    this.adelantar(this.state.flujo);

                }
                else {
                    if (nuevo.tipo === "flujo") {
                        this.setState({ flujo: nuevo.flujo });
                        this.adelantar(nuevo.flujo);

                    }
                    else if (nuevo.tipo === "workFlow") {
                        this.setState({ workflow: nuevo.workFlow });
                        this.setState({ passflow: 2 });
                        this.validateWork(nuevo.workFlow, "1");


                    }
                    else if (nuevo.tipo === "consulta") {
                        this.setState({ pasoFlujo: null });
                        this.setState({ consulta: nuevo.consulta });
                        this.setState({ flujoAux: nuevo.flujoAux });
                        this.validarNivel(nuevo.nivel, nuevo.ChangeLevel);
                        this.setState({ addProperties: nuevo.add });
                        this.setState({ criteria: nuevo.criteria });
                        this.setState({ parametros: this.organizarConsulta(nuevo.parametros !== undefined ? nuevo.parametros.split(',') : '') });
                        this.setState({ mensajeUs: nuevo.mensaje.replace("@nombre", this.props.nombreUser) });
                        this.setState({ propertieBD: nuevo.bd });
                        this.setState({ property: nuevo.property });
                        this.setState({ stay: nuevo.stay });
                        this.setState({ paso: nuevo.paso });
                        this.setState({ onlyOptions: nuevo.onlyOptions });
                        this.setState({ consultParam: nuevo.consultParam });
                        this.setState({ tipoIn: 3 });
                        this.urlBsaseDatos(nuevo.structure);
                        if (nuevo.carpeta)
                            this.crearCarpeta();
                    }

                    else if (nuevo.tipo === "mensaje") {
                        this.setState({ pasoFlujo: null });
                        this.validarNivel(nuevo.nivel, nuevo.ChangeLevel);
                        this.setState({ nivelAnt: nuevo.nivelAnt });
                        this.setState({ property: nuevo.property });
                        this.setState({ stay: nuevo.stay });
                        this.setState({ addProperties: nuevo.add });
                        this.setState({ mensajeUs: nuevo.mensaje.replace("@nombre", this.props.nombreUser) });
                        this.setState({ textAux: nuevo.labelAux });
                        this.setState({ paso: nuevo.paso });
                        this.setState({ flagTiempo: nuevo.tiempo });
                        this.setState({ propertieBD: nuevo.bd });
                        this.urlBsaseDatos(nuevo.structure);
                        if (nuevo.carpeta)
                            this.crearCarpeta();
                    }
                    else if (nuevo.tipo === "tiempo") {
                        this.setState({ pasoFlujo: null });
                        this.validarNivel(nuevo.nivel, nuevo.ChangeLevel);
                        this.setState({ nivelAnt: nuevo.nivelAnt });
                        this.setState({ property: nuevo.property });
                        this.setState({ stay: nuevo.stay });
                        this.setState({ addProperties: nuevo.add });
                        this.setState({ mensajeUs: nuevo.mensaje.replace("@nombre", this.props.nombreUser) });
                        this.setState({ flagTiempo: nuevo.tiempo });
                        this.setState({ propertieBD: nuevo.bd });
                        this.setState({ paso: nuevo.paso });
                        this.setState({ tipoIn: 4 });
                    }
                    else if (nuevo.tipo === "opciones") {

                        this.setState({ consultParam: nuevo.consultParam });
                        this.setState({ mensajeUs: nuevo.mensaje.replace("@nombre", this.props.nombreUser) });
                        this.setState({ tipoIn: 2 });
                        this.setState({ paso: nuevo.paso });
                        this.setState({ opciones: nuevo.opciones });

                    }
                    else {
                        this.setState({ mensajeUs: nuevo.mensaje.replace("@nombre", this.props.nombreUser) });
                        this.Cerrar();
                    }
                }
            }
        });
    }

    validarOpciones(value) {
        let opciones = this.state.opcionValue;
        let flag = true;
        Object.keys(opciones).map((key, index) => {
            if (value === opciones[key]) {
                flag = false;
            }
        });
        return flag;
    }

    crearCarpeta() {
        let folderId = this.props.usuarioDetail.usuario.wsCompartida;
        alert(folderId)
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

    addNewMessage = (event) => {
        if (event.key === "Enter" || event.key === "13") {
            let value = this.state.inputC;
            if (value !== null) {
                if (this.state.onlyOptions && this.validarOpciones(value)) { return; }
                if (this.state.propertieBD) {
                    let registro = [];
                    registro[this.state.propertieBD] = value;
                    registro["facha"] = moment().format("MMM Do YY");

                    if (this.state.flagTiempo) {
                        registro["duracion"] = this.props.onMessage;
                        registro["h-inicio"] = moment().add('seconds', this.secondsAcum).format('h:mm:ss a');
                        registro["h-fin"] = moment().add('seconds', this.secondsAcum).add('seconds', this.props.onMessage).format('h:mm:ss a');
                        registro["facha"] = moment().format("MMM Do YY");
                        if (this.stateAnt !== this.state.nivel) {
                            this.secondsAcum = this.secondsAcum + this.props.onMessage;
                            this.stateAnt = this.state.nivel;
                        }
                    }

                    if (this.state.nivelAnt !== null && this.state.nivelAnt !== undefined) {
                        let registroAnt = [];
                        for (const prop2 in this.state.addProperties) {
                            registroAnt[prop2] = this.state.addProperties[prop2];
                        }
                        this.state.registro[this.state.nivelAnt] = { ...this.state.registro[this.state.nivelAnt], ...registroAnt };
                    }
                    else {
                        for (const prop2 in this.state.addProperties) {
                            registro[prop2] = this.state.addProperties[prop2];
                        }
                    }

                    if (this.state.nuevoParam === value) {
                        let newPostKey2 = this.componentDatabase('key', 'Usario-Pendiente');
                        registro[this.state.propertieBD] = newPostKey2;

                        this.componentDatabase('update', `Usuario-Pendiente/${this.props.userId}/${newPostKey2}`, { "concepto": value, "id": newPostKey2, flujoAux: this.state.flujoAux, "estado": "activo", "tipo": this.state.propertieBD });
                    }
                    if (this.state.stay !== null) {
                        this.setState({ stayValue: registro[this.state.propertieBD] });
                    }
                    if (this.state.property !== null && this.state.property !== undefined) {
                        registro[this.state.property] = this.state.stayValue;
                    }
                    if (this.state.carpeta !== null) {
                        registro["carpeta"] = this.state.carpeta;
                        this.setState({ carpeta: null })
                    }
                    if (this.state.nivel !== null) {
                        if (this.state.registro.hasOwnProperty(this.state.nivel))
                            this.state.registro[this.state.nivel] = { ...this.state.registro[this.state.nivel], ...registro };
                        else
                            this.state.registro[this.state.nivel] = registro;
                    }
                    else {
                        this.state.registro = { ...this.state.registro, ...registro }
                    }

                    this.state.registro["etapa"] = this.state.registro["etapa"] + 1;
                    let consultP = this.state.consultaParams === null || this.state.consultaParams === undefined ? '' : this.state.consultaParams;
                    if (this.state.consultaParams) {

                        this.componentDatabase('insert', this.queryConsulta + consultP + '/' + this.state.propertieBD, registro[this.state.propertieBD]);
                    }
                    else {

                        this.componentDatabase('update', this.queryConsulta, { ... this.state.registro });
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


    CambioEstado = () => {
        this.timeout6 = setImmediate(() => {
            this.flagT = true;
        }, timeoutLength)
    }

    handlePaso = (flagT) => {
        if (flagT === true)
            this.timeout2 = setTimeout(() => {
                console.log('entro')
                //this.flagT = false;
                //this.CambioEstado();
                let text = document.body.querySelector(".text");
                const split = acAnimated.Plugins.SplitText(text, { words: 1, chars: 1, spacing: 10 });
                let timeline = null;
                switch (this.props.tipo) {
                    case 0:
                        timeline = new window.TimelineMax({ repeat: -1, repeatDelay: 0 });
                        for (var i = 0; i <= split.chars.length - 1; i++) {
                            var char = split.chars[i];
                            timeline.add("animated_char_" + String(i), acAnimated.randomNumber(1, 20) / 10);
                            timeline.add(acAnimated.animateChar(char), "animated_char_" + String(i));
                        }
                        timeline.to(text, 3, {}).to(text, 1, { opacity: 0 });
                        break;
                    case 1:
                        timeline = new window.TimelineMax({ repeat: -1, repeatDelay: 0 });
                        for (var i = 0; i <= split.words.length - 1; i++) {
                            var word = split.words[i];
                            timeline
                                .add("animated_word_" + String(i), acAnimated.randomNumber(1, 20) / 10)
                                .add(acAnimated.animateWord(word), "animated_word_" + String(i));
                        }
                        timeline.to(text, 3, {}).to(text, 1, { opacity: 0 });
                        break;
                    case 2:
                        for (var i = 0; i <= split.chars.length - 1; i++) {
                            window.TweenMax.from(split.chars[i], 2.5, {
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

                        for (var i = 0; i <= split.words.length - 1; i++) {
                            window.TweenMax.from(split.words[i], 2.5, {
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

            }, timeoutLength * 2)
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

            const starCountRef3 = this.componentDatabase('key', consulta);
            return starCountRef3.on('value', (snapshot) => {
                let objetos = snapshot.val();

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
                });
                this.setState({
                    opcionesDB: <datalist id='opciones'>
                        {opciones}
                    </datalist>
                });

            });

        }

    }


    opcionesLoad = () => {
        this.timeout3 = setTimeout(() => {

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
                t2: <div className="Wrapper">
                    <div className="ui container" style={{ top: '80px', height: '180px', width: '50%' }}>
                        {opciones}
                    </div>
                </div>
            });

        }, 1000)
    }

    Cambio = () => {
        this.timeout4 = setTimeout(() => {
            if (this.state.flag === true) {
                this.handlePaso(this.flagT);
                this.text2();
            }
            this.setState({ flag: false });
        }, timeoutLength2)
    }

    Cerrar = () => {
        this.timeout10 = setTimeout(() => {
            if (this.state.pendingOk !== null) {
                this.componentDatabase('update', this.pendingConsulta, { ...this.state.pendingOk });
            }
            this.state.registro["etapa"] = this.state.registro["etapa"] + 1;
            this.state.registro["estado"] = "completo";
            if (this.state.consultaParams === null || this.state.consultaParams === undefined) {
                this.componentDatabase('update', this.queryConsulta, { ...this.state.registro });
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
        });
        if (flagNuevo === true) {
            this.setState({ nuevoParam: event.target.value });
            this.setState({ inputC: event.target.value });
        }
    };


    text2 = () => {
        this.timeout5 = setTimeout(() => {
            if (!this.state.t2 && this.state.response === null) {

                let tiempo = null;
                let topTiempo = '4em';
                if (this.state.flagTiempo) {
                    topTiempo = '20em';
                    tiempo = <TimerClock programa={true}></TimerClock>
                }
                let opciones = null;
                if (this.state.tipoIn === 1) {
                    this.setState({
                        t2: <div className="Wrapper">
                            <div className="ui container" style={{ top: '80px', height: topTiempo, width: '40%' }}>
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
                        t2: <div className="Wrapper">
                            <div className="ui container" style={{ top: '80px', height: topTiempo, width: '40%' }}>

                                {tiempo}
                                <a href="#" style={{
                                    position: 'relative',
                                    top: '30px',
                                    width: '70%',
                                    left: '13%'
                                }} className="action-button animate purple" key={1} onClick={() => { this.clickOpcion('') }}>Continuar</a>
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
                        opciones = Object.keys(cCon).map((key, index) => {

                            return <a href="#" className="action-button animate purple" key={cCon[key]} onClick={() => { this.clickOpcion(cCon[key]) }}>{cCon[key]}</a>

                        });
                        //   this.props.sendMessage(this.state.opciones.title);

                        this.setState({
                            t2: <div className="Wrapper">
                                {opciones}
                            </div>
                        });
                    }


                }
            }
        }, timeoutLength)
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

        console.log(pass + " " + opcion);
        this.client.textRequest(pass + opcion).then(this.onResponse, this);

        this.setState({ opciones: null });
        this.setState({ tipoIn: 1 });
        this.setState({ t2: null })
        this.setState({ inputC: null })
        this.setState({ flag: true })
    }

    render() {

        let t1 = null;
        let t2 = null;

        if (this.state.flag === true) {
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
                <p className="split" style={{ opacity: '1', fontSize: '50px', color: '#e8f5e8', position: 'relative', top: '-0.4em', height: '2em' }} >
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
        nombreUser: state.chatReducer.nombreUser,
        ValorTexto: state.chatReducer.ValorTexto,
        inputSlack: state.chatReducer.inputSlack,
        user: state.user
    });


export default connect(mapAppStateToProps, { sendMessage, chatOff, endChatMes, consultas, popupBot, mensajeChat })(efectText);