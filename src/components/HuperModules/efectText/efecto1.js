import React from 'react';
import { connect } from 'react-redux';
import './efect.scss';
import acAnimated from "./splitText";
import { ApiAiClient } from 'api-ai-javascript';
import { sendMessage, chatOff, endChatMes } from '../../../actions';
import { consultas } from '../../modules/chatBot/actions';
import TimerClock from '../timerClock/timerr';
import firebase from 'firebase';
import moment from 'moment';

const timeoutLength = 1500;
const timeoutLength2 = 3000;
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

class listActividades extends React.Component {


    state = {
        actividades: null, tiempos: 0, horamaxima: 8, primero: null, aux: null
        , index: 0, delay: .02, mensaje: null, messages: [], inputC: null, flag: false, response: null, tipoIn: 1, flagTiempo: false, textAux: null, opciones: null,
        consulta: null, criteria: null, parametros: null, mensajeUs: null, propertieBD: null, registro: [], opcionValue: [], nivel: null, addProperties: null, nuevoParam: null,
        paso: null, nivelAnt: null, stay: null, property: null, stayValue: null, pasoFlujo: 1, flujo: null, etapa: null, consultaParams: null,
        opcionesDB: null, keyNivel: '', flujoAux: null, pendingOk: null, pendingConsulta: null, onlyOptions: null
    }

    componentDidMount() {

        this.props.consultas({ ...this.props.consultax, currentId: this.props.userId, hoy: moment().format("YYYYMMDD"), util: 'prioridad' });
        this.state.registro["etapa"] = 0;
        this.props.sendMessage([]);
        this.client = new ApiAiClient({
            accessToken: 'dfd956d241004b8b87e1c293399dabf6'
        });
        this.client.textRequest('hola', { sessionId: 'test' }).then(this.onResponse, this);
        // this.client.eventRequest("hola").then(this.onResponse, this);
        this.handlePaso();
        this.text2();
        this.setState({ response: null });
          this.queryConsulta = `Usuario-Task/${this.props.userId}/${moment().format("YYYYMMDD")}`;
        //this.queryConsulta = `Usuario-OKR/${this.props.userId}`;
        this.pendingConsulta = `Usuario-Pendiente/${this.props.userId}`;
        let etapa = null;
        const starCountRef3 = firebase.database().ref().child(this.queryConsulta);
        /*
        starCountRef3.on('value', (snapshot) => {
            if (snapshot.val() !== null && snapshot.val().estado !== 'completo') {
                etapa = snapshot.val().etapa;
            }
        });
         if (etapa) {
            this.setState({ etapa });
            this.state.registro["etapa"] = etapa;
            this.client.textRequest('Continuar planificando mi día', { sessionId: 'test' }).then(this.onResponse, this);
        }
        */
        //consulta pendientes
        const starCountRef4 = firebase.database().ref().child(this.pendingConsulta);

        let pending = null;
        starCountRef4.on('value', (snapshot) => {
            if (snapshot.val() !== null) {
                let pending = snapshot.val();
            }
        });
        this.validarPending(pending);

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
        console.log(men);
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
            let newPostKey2 = firebase.database().ref().child(this.queryConsulta).push().key;
            this.setState({ keyNivel: newPostKey2 });
            this.setState({ nivel: newPostKey2 });
        }


    }



    onResponse = (activity) => {
        let that = this;
        activity.result.fulfillment.messages.forEach(function (element) {
            //       console.log(element);
            if (element.payload !== undefined) {
                let nuevo = element.payload;
                console.log(that.state.pasoFlujo);
                console.log(that.state.etapa);
                if (that.state.pasoFlujo > 1 && that.state.pasoFlujo - 1 <= that.state.etapa && that.state.etapa != null) {
                    that.borrarDatos();
                    that.adelantar(that.state.flujo);
                    console.log(1);
                }
                else {

                    if (nuevo.tipo === "flujo") {
                        that.setState({ flujo: nuevo.flujo });
                        that.adelantar(nuevo.flujo);

                    }
                    else if (nuevo.tipo === "consulta") {
                        that.setState({ pasoFlujo: null });
                        that.setState({ consulta: nuevo.consulta });
                        that.setState({ flujoAux: nuevo.flujoAux });
                        that.validarNivel(nuevo.nivel, nuevo.ChangeLevel);
                        that.setState({ addProperties: nuevo.add });
                        that.setState({ criteria: nuevo.criteria });
                        that.setState({ parametros: that.organizarConsulta(nuevo.parametros !== undefined ? nuevo.parametros.split(',') : '') });
                        that.setState({ mensajeUs: nuevo.mensaje.replace("@nombre", that.props.nombreUser) });
                        that.setState({ propertieBD: nuevo.bd });
                        that.setState({ property: nuevo.property });
                        that.setState({ stay: nuevo.stay });
                        that.setState({ paso: nuevo.paso });
                        that.setState({ onlyOptions: nuevo.onlyOptions });
                        that.setState({ consultParam: nuevo.consultParam });
                        that.setState({ tipoIn: 3 });
                    }

                    else if (nuevo.tipo === "mensaje") {
                        that.setState({ pasoFlujo: null });
                        that.validarNivel(nuevo.nivel, nuevo.ChangeLevel);
                        that.setState({ nivelAnt: nuevo.nivelAnt });
                        that.setState({ property: nuevo.property });
                        that.setState({ stay: nuevo.stay });
                        that.setState({ addProperties: nuevo.add });
                        that.setState({ mensajeUs: nuevo.mensaje.replace("@nombre", that.props.nombreUser) });
                        that.setState({ textAux: nuevo.labelAux });
                        that.setState({ paso: nuevo.paso });
                        that.setState({ flagTiempo: nuevo.tiempo });
                        that.setState({ propertieBD: nuevo.bd });
                    }
                    else if (nuevo.tipo === "tiempo") {
                        that.setState({ pasoFlujo: null });
                        that.validarNivel(nuevo.nivel, nuevo.ChangeLevel);
                        that.setState({ nivelAnt: nuevo.nivelAnt });
                        that.setState({ property: nuevo.property });
                        that.setState({ stay: nuevo.stay });
                        that.setState({ addProperties: nuevo.add });
                        that.setState({ mensajeUs: nuevo.mensaje.replace("@nombre", that.props.nombreUser) });
                        that.setState({ flagTiempo: nuevo.tiempo });
                        that.setState({ propertieBD: nuevo.bd });
                        that.setState({ paso: nuevo.paso });
                        that.setState({ tipoIn: 4 });
                    }
                    else if (nuevo.tipo === "opciones") {

                        that.setState({ consultParam: nuevo.consultParam });
                        that.setState({ mensajeUs: nuevo.mensaje.replace("@nombre", that.props.nombreUser) });
                        that.setState({ tipoIn: 2 });
                        that.setState({ paso: nuevo.paso });
                        that.setState({ opciones: nuevo.opciones });

                    }
                    else {
                        that.setState({ mensajeUs: nuevo.mensaje.replace("@nombre", that.props.nombreUser) });
                        //  that.setState({ response: element.speech });
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
        });
        return flag;
    }

    addNewMessage = (event) => {
        if (event.key === "Enter" || event.key === "13") {
            let value = this.state.inputC;

            if (value !== null) {
                if (this.state.onlyOptions && this.validarOpciones(value)) { return; }

                if (this.state.propertieBD) {
                    let registro = [];
                    registro[this.state.propertieBD] = value;


                    if (this.state.flagTiempo) {
                        registro["duracion"] = this.props.onMessage;
                        registro["h-inicio"] = moment().format('h:mm:ss a');
                        registro["h-fin"] = moment().add('seconds', this.props.onMessage).format('h:mm:ss a');
                        registro["facha"] = moment().format("MMM Do YY");
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

                        console.log(value);

                        let newPostKey2 = firebase.database().ref().child('Usario-Pendiente').push().key;
                        registro[this.state.propertieBD] = newPostKey2;
                        firebase.database().ref(`Usuario-Pendiente/${this.props.userId}/${newPostKey2}`).update({
                            "concepto": value, "id": newPostKey2, flujoAux: this.state.flujoAux, "estado": "activo", "tipo": this.state.propertieBD
                        });

                    }
                    if (this.state.stay !== null) {
                        this.setState({ stayValue: registro[this.state.propertieBD] });
                    }

                    if (this.state.property !== null && this.state.property !== undefined) {

                        registro[this.state.property] = this.state.stayValue;
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
                        firebase.database().ref(this.queryConsulta + consultP + '/' + this.state.propertieBD).set(registro[this.state.propertieBD]);
                    }
                    else {
                        firebase.database().ref(this.queryConsulta).update({
                            ... this.state.registro
                        });
                    }


                }
                else {

                    if (this.state.consultParam !== undefined)
                        this.setState({ consultaParams: "/" + value });
                    console.log(value);
                }

                let pass = this.state.paso !== null ? this.state.paso : '';
                console.log(pass + " " + value)
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
            let strF = 3;
            let timeline = null
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
                            x: this.randomMax(-500, 500),
                            y: this.randomMax(-500, 500),
                            z: this.randomMax(-500, 500),
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
                            x: this.randomMax(-500, 500),
                            y: this.randomMax(-500, 500),
                            z: this.randomMax(-500, 500),
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
            /*
                      var timeline = new window.TimelineMax({repeat: -1, repeatDelay: 0});
                      /*for (var i=0; i<=split.chars.length-1; i++) {
                          var char = split.chars[i];
                          timeline.add("animated_char_" + String(i), acAnimated.randomNumber(1, 20)/ 10);
                          timeline.add(acAnimated.animateChar(char), "animated_char_" + String(i));
                      }*/
            /*
            for (var i=0; i<=split.words.length-1; i++) {
                var word = split.words[i];
                timeline
                .add("animated_word_" + String(i), acAnimated.randomNumber(1, 20)/ 10)
                .add(acAnimated.animateWord(word), "animated_word_" + String(i));
            }
            timeline.to(text, 3, {}).to(text, 1, {opacity: 0});
     
            */




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
            console.log(consulta);

            const starCountRef3 = firebase.database().ref().child(consulta);
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
                t2: <div className="Wrapper">
                    <div className="ui container" style={{ top: '80px', height: '180px', width: '50%' }}>
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
                firebase.database().ref(this.pendingConsulta + `${this.props.pendingOk.id}`).update({
                    ... this.state.pendingOk
                });
            }


            this.state.registro["etapa"] = this.state.registro["etapa"] + 1;
            this.state.registro["estado"] = "completo";
            if (this.state.consultaParams === null || this.state.consultaParams === undefined) {
                firebase.database().ref(this.queryConsulta).update({
                    ... this.state.registro
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
                let topTiempo = '180px';
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
        }, timeoutLength * 3)
    }

    clickOpcion(opcion) {

        let pass = this.state.paso !== null ? this.state.paso : '';
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

        console.log(pass + " " + opcion);
        this.client.textRequest(pass + " " + opcion).then(this.onResponse, this);

        this.setState({ opciones: null });
        this.setState({ tipoIn: 1 });
        this.setState({ t2: null })
        this.setState({ inputC: null })
        this.setState({ flag: true })
    }

    render() {

        let t1 = null;
        let t2 = null;

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
                <p className="split" style={{ opacity: '1', fontSize: '50px', color: '#e8f5e8' }} >
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



        /*  return (
              <div className="sp-containerE1">
                  <div className='text' id='text' style={{ opacity: '1' }}>
                      <p className="split" style={{ opacity: '1', fontSize: '50px' }} >
                          {this.props.onMessage}
                      </p>
                  </div>
                  <div class="Wrapper">
                      <div className="Input">
                          <input type="text" id="input" className="Input-text"
     
                              value={this.state.inputC}
                              onChange={(event) => this.setState({ inputC: event.target.value })}
                              onKeyPress={(e) => { this.addNewMessage(e) }} placeholder="..." />
                          <label for="input" className="Input-label">Hooy estoy</label>
     
                      </div>
                  </div>
              </div>
     
          );
    */
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


export default connect(mapAppStateToProps, { sendMessage, chatOff, endChatMes, consultas })(listActividades);