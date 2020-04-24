import React from 'react';
import { connect } from 'react-redux';
import '../components/styles/ingresoHupity.css';
import { chatOn, chatOff } from '../actions';
import { Card, Icon, Image, Button, Form, Message, Segment, Dimmer, Loader, Modal, Header, Input } from 'semantic-ui-react'
import history from '../history';
import firebase from 'firebase';
import zonaEspana from '../components/utilidades/zonaEspana';
import axios from 'axios';
import drive from '../images/drive.png';
import calendar from '../images/calendar.png';
import slack from '../images/slack.png';
import trelloImg from '../images/trello.png';


var Trello = require("trello");
var trello = null;// new Trello("bb3cab1a303c7bf996d56bb46db2a46f", "136434ae14c54519e4af94ed7f48ec43d710e777bb1bbe0b06cdda6368f1d44e");



///pantalla de  perfil del usuario
//limpiar variables
const nivel = [
    { key: 1, text: 'Normal', value: '105' },
    { key: 2, text: 'Competitivo', value: '115' },
    { key: 3, text: 'Altamente Competitivo', value: '125' },

]
const Semana = [
    { key: 1, text: 'Viernes', value: 5 },
    { key: 2, text: 'Sabado', value: 6 },
    { key: 3, text: 'Domingo', value: 7 },

]
class Profile extends React.Component {

    state = {
        open: null, listaEmpresas: {}, formError: false, openImagen: false, entro: false, mensajeCodigo: null,
        tipo: null, empresa: null, nombreUsuario: null, cargo: null, listaEquipos: {}, area: null, lugar: null, telefono: null, equipo: null, codigo: null, acepto: null,
        errorTipo: null, errorNombreUsuario: null, errorCargo: null, errorArea: null, errorTelefono: null, errorLugar: null, errorEmpresa: null, errorEquipo: null, errorCodigo: null, errorAcepto: null, idCalendar: null,
        codigoUsSlack: null, tokenUsSlack: null, tokenBotUsSlack: null, canalGestorSlack: null, canalEquipoSlack: null, canalReportesSlack: null, canalNotifiacionesSlack: null,
        codigoWSdrive: null, activo: false, listaCanales_Slack: null, usuarioTrello: null, trelloListaDashBoard: null, trelloLista: null, trelloDashboard: null, errorDashboard: null,
        nivelEquipo: null, diaSemana: null,

        trelloIn: '100%', slackIn: '100%', driveIn: '0%', calendarIn: '100%',

        trelloApi: null, tokenTrello: null, listaObjetivostoDO: null, listaOBjetivosDone: null, listaObjetivosTheEnd: null, imagenMostrar: null, imagenFondo: null, imagenPerfil: null,
    }

   
    componentWillMount(){
        if(!this.props.isSignedIn || !this.props.usuarioDetail)
        {
            history.push('/dashboard');
            return;
        } 
    }
    componentDidMount() {

        //se consulta todas las empresas
        
        const starCountRef = firebase.database().ref().child('empresa');
        starCountRef.on('value', (snapshot) => {
            this.setState({ listaEmpresas: snapshot.val() })
        });
    }

    renderOpcionesEmpresa() {
       
        const listaX = this.state.listaEmpresas;
        let lista = {};
        const opciones = Object.keys(listaX).map(function (key, index) {
            lista = { ...lista, key: key, text: listaX[key].industria, value: listaX[key].industria };
            return lista;
        });
        return opciones;
    }


    renderOpcionesZona() {

        const listaX = zonaEspana();
        let entro = null;
        Object.keys(listaX).map(function (key, index) {
            if (listaX[key].name === ' ')
                entro = true;
        });

        if (!entro) {
            listaX.unshift(' ');
        }

        let lista = {};
        const opciones = Object.keys(listaX).map(function (key, index) {
            lista = { ...lista, key: key, text: listaX[key], value: listaX[key] };
            return lista;
        });
        return opciones;


    }


    renderCanaleSlack() {
        const listaX = this.state.listaCanales_Slack;
        let lista = {};
        if (listaX) {
            const opciones = Object.keys(listaX).map(function (key, index) {
                lista = { ...lista, key: key, text: listaX[key].name, value: listaX[key].id };
                return lista;
            });


            return opciones;
        }
        return;
    }



    renderUsuarioSlack() {

        ///valores que por seguridad no se muestran 
        /*
        <Form.Input label='Codigo de Usuario Slack' placeholder='UEA8D0S...'
        value={this.state.codigoUsSlack}
        onChange={e => this.setState({ codigoUsSlack: e.target.value })}
        />
        
        
        <Form.Input label='Token Usuario Slack'  placeholder='xoxp-482555533539-486285033681...'
        value={this.state.tokenUsSlack}
        onChange={e => this.setState({ tokenUsSlack: e.target.value })}
        
        />
        
        
        <Form.Input label='Token bot Usuario Slack' placeholder='xoxb-482555533539-532878166725...'
        value={this.state.tokenBotUsSlack}
        onChange={e => this.setState({ tokenBotUsSlack: e.target.value })}
        />
        

        /// Este canal se debera crear interno a la hora en que se registre el gestor
           <Form.Input label='Canal del Gestor' placeholder='CE61KKZ...'
                        value={this.state.canalGestorSlack}
                        onChange={e => this.setState({ canalGestorSlack: e.target.value })}
                        disabled={visible}
                    />
                 
        */




        let visible = false;
        if (this.props.usuarioDetail.rol === '3')
            visible = true;
        return (
            <div>
                <Form >
                    <Form.Select label='Canal del Equipo' options={this.renderCanaleSlack()} 
                        search
                        onChange={(e, { value }) => { this.setState({ canalEquipoSlack: value }) }}
                        value={this.state.canalEquipoSlack}
                    />
                    <Form.Select label='Canal del Reportes' options={this.renderCanaleSlack()} 
                        search
                        onChange={(e, { value }) => { this.setState({ canalReportesSlack: value }) }}
                        value={this.state.canalReportesSlack}
                    />
                    <Form.Select label='Canal del Notificaciones' options={this.renderCanaleSlack()} 
                        search
                        onChange={(e, { value }) => { this.setState({ canalNotifiacionesSlack: value }) }}
                        value={this.state.canalNotifiacionesSlack}
                    />
                </Form>
                <br />
                <Button icon='save' disabled={this.state.activo} style={{ left: '52%', background: 'linear-gradient(to right, #fe10bd 20%, #f0bbe1 50% ,#fe10bd 100%)' }} labelPosition='right' content='Guardar' onClick={() => { this.renderGuardar() }} />
            </div>

        );
    }


    renderForm() {
        if (this.state.open === 'slack')
            return (this.renderUsuarioSlack());
        else if (this.state.open === 'drive')
            return (this.renderDrive());
        else if (this.state.open === 'calendar')
            return (this.renderCalendar());
        else if (this.state.open === 'trello')
            return (this.renderTrello());
        else
            return (this.renderUsuario());
    }


    renderDrive() {
        return (
            <div>
                <Form >

                    <Form.Input label='Codigo de tu espacio de trabajo (carpeta)' placeholder='1J45vud1Mkb6mxfWYrVjHki_AO21...'
                        value={this.state.codigoWSdrive}
                        onChange={e => this.setState({ codigoWSdrive: e.target.value })}
                    />

                </Form>
                <br />
                <Button  icon='save' disabled={this.state.activo} style={{ left: '52%', background:'linear-gradient(to right, #fe10bd 20%, #f0bbe1 50% ,#fe10bd 100%)' }} labelPosition='right' content='Guardar' onClick={() => { this.renderGuardar() }} />
            </div>

        );
    }

    renderCalendar() {
        var event = {
            'summary': 'Google I/O 2015',
            'location': '800 Howard St., San Francisco, CA 94103',
            'description': 'A chance to hear more about Google\'s developer products.',
            'start': {
                'dateTime': '2019-03-06T09:00:00-07:00',
                'timeZone': 'America/Los_Angeles'
            },
            'end': {
                'dateTime': '2019-03-06T10:00:00-07:00',
                'timeZone': 'America/Los_Angeles'
            },
            //   'recurrence': [
            //     'RRULE:FREQ=DAILY;COUNT=2'
            // ],
            'attendees': [
                { 'email': 'lpage@example.com' },
                { 'email': 'sbrin@example.com' }
            ],
            'reminders': {
                'useDefault': false,
                'overrides': [
                    { 'method': 'email', 'minutes': 24 * 60 },
                    { 'method': 'popup', 'minutes': 10 }
                ]
            }
        };



        window.gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
            .then(function () { console.log("GAPI client loaded for API"); },
                function (err) { console.error("Error loading GAPI client for API", err); });


        /*
        //Crear un evento
                window.gapi.client.calendar.events.insert({
                    'calendarId': 'primary',
                    'resource': event
                })
                    .then(function (response) {
                        // Handle the results here (response.result has the parsed body).
                        console.log("Response", response);
                    },
                        function (err) { console.error("Execute error", err); });
        
        
        */

        /*
        Crear un calendario
        
                window.gapi.client.calendar.calendars.insert({
                    "resource": {
                        "summary": "hupity 2"
                    }
                })
                    .then(function (response) {
                        // Handle the results here (response.result has the parsed body).
                        console.log("Response", response);
                    },
                        function (err) { console.error("Execute error", err); });*/

        return (
            <div>
                <Form >
                    <Form.Input label='Id de tu calendario de Google' placeholder='...@group.calendar.google.com'
                        value={this.state.idCalendar}
                        onChange={e => this.setState({ idCalendar: e.target.value })}
                    />
                </Form >
                <br />
                <Button  icon='save' disabled={this.state.activo} style={{ left: '52%', background: 'linear-gradient(to right, #fe10bd 20%, #f0bbe1 50% ,#fe10bd 100%)' }} labelPosition='right' content='Guardar'

                    onClick={() => { this.renderGuardar() }}
                />
            </div>

        );
    }





    renderOpcionesTrello(listaOpciones) {

        let listaX = listaOpciones;
        let entro = null;
        //console.log(listaX);
        let lista = {};
        if (!listaX)
            return;

        Object.keys(listaX).map(function (key, index) {
            if (listaX[key].name === 'Ninguno')
                entro = true;
        });

        if (!entro) {
            listaX.unshift({ name: 'Ninguno', id: '' });
        }

        //  console.log(listaX);
        const opciones = Object.keys(listaX).map(function (key, index) {
            //  console.log(listaX[key]);
            lista = { ...lista, key: key, text: listaX[key].name, value: listaX[key].id };
            return lista;
            //return cconsulta[key].concepto;
        });
        //  console.log(opciones);
        return opciones;

    }

    componentDidUpdate() {
        if (this.state.trelloApi && !this.state.tokenTrello) {
            const starCountRef2 = firebase.database().ref().child(`Usuario-TokenTrelloTemp/${this.props.usuarioDetail.idUsuario}`);
            starCountRef2.on('value', (snapshot2) => {

                if (snapshot2.val()) {
                    this.setState({ tokenTrello: snapshot2.val().token });
                    trello = new Trello(this.state.trelloApi, snapshot2.val().token);
                    trello.makeRequest('get', '/1/members/me/tokens', { webhooks: true }).then((res) => {
                        //    console.log(res[0].idMember)
                        this.setState({ usuarioTrello: res[0].idMember });
                        trello.getBoards(res[0].idMember).then((Response) => { this.setState({ trelloListaDashBoard: Response }) })
                    });
                }


            });
        }
    }
    renderConsultaApiKeyTrello(valor) {
        window.open(`https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Server%20Token&key=${valor}&return_url=http://${window.location.host}`);
    }

    renderFiltroTrello(valor) {
        if (valor !== '') {
            trello.getListsOnBoard(valor).then((Response) => { this.setState({ trelloLista: Response }); });
        }

    }

    renderTrello() {
        //https://www.npmjs.com/package/trello


        /// el token  lo debo recuperar axios
        /*<Form.Input label='Token Trello' placeholder='136434ae14c54519e4af94ed...'
        value={this.state.tokenTrello}
        onChange={e => this.setState({ tokenTrello: e.target.value })}
    />*/
        let visible = true;
        if (this.props.usuarioDetail.rol === '3')
            visible = false;



        let contruir = <Form >
            <Form.Input label='Trello Api Key' placeholder='bb3cab1a303c7bf996d5...'
                value={this.state.trelloApi}
                onChange={e => { this.setState({ trelloApi: e.target.value }); this.renderConsultaApiKeyTrello(e.target.value); }}
            />
            <div className="inline">
                <Button color="blue"  style={{height: '37px'}} icon='trello' labelPosition='center' content='Generar' onClick={() => { window.open('https://trello.com/app-key/'); }} />
            </div>
        </Form>

        if (this.state.trelloApi && this.state.tokenTrello) {
            contruir =
                <div>
                    <Form >

                        <Form.Select label='Selecciona Dashboard' options={this.renderOpcionesTrello(this.state.trelloListaDashBoard)} placeholder='Escogé un tablero'
                            search
                            value={this.state.trelloDashboard}
                            onChange={(e, { value }) => {
                                this.setState({ trelloDashboard: value });
                                this.renderFiltroTrello(value);
                            }
                            }
                            error={this.state.errorDashboard}
                        />

                        <Form.Select label='Lista Objetivos por trabajar' options={this.renderOpcionesTrello(this.state.trelloLista)} placeholder='Escogé una lista'
                            search
                            value={this.state.listaObjetivostoDO}
                            onChange={(e, { value }) => this.setState({ listaObjetivostoDO: value })}
                        />
                        <Form.Select label='Lista objetivos terminados' options={this.renderOpcionesTrello(this.state.trelloLista)} placeholder='Escogé una lista'
                            search
                            value={this.state.listaOBjetivosDone}
                            onChange={(e, { value }) => this.setState({ listaOBjetivosDone: value })}
                        />

                        <h3>Si eres gestor agrega lo siguiente: </h3>
                        <Form.Select label='Lista Objetivos validados' options={this.renderOpcionesTrello(this.state.trelloLista)} placeholder='Escogé una lista'
                            search
                            value={this.state.listaObjetivosTheEnd}

                            onChange={(e, { value }) => this.setState({ listaObjetivosTheEnd: value })}
                            visible
                        />
                    </Form>
                    <br />
                    <Button  icon='save' disabled={this.state.activo} style={{ left: '52%' , background: 'linear-gradient(to right, #fe10bd 20%, #f0bbe1 50% ,#fe10bd 100%)' }} labelPosition='right' content='Guardar'
                        disabled={this.state.trelloDashboard && (this.state.listaObjetivostoDO && this.state.listaObjetivostoDO !== '' ||
                            this.state.listaOBjetivosDone && this.state.listaOBjetivosDone !== '' ||
                            this.state.listaObjetivosTheEnd && this.state.listaObjetivosTheEnd !== '') ? false : true}
                        onClick={() => { firebase.database().ref().child(`Usuario-TokenTrelloTemp/${this.props.usuarioDetail.idUsuario}`).remove(); this.renderGuardar() }} />

                </div>
        }



        // 
        return (
            <div>
                {contruir}
            </div>

        );
    }

    renderUsuario() {
        let nnivel = null;
        if (this.props.usuarioDetail.rol === '2') {
            nnivel = <Form.Select label='Define el nivel de competitividad de tu equipo' options={nivel} placeholder='Selecciona uno'
                search
                onChange={(e, { value }) => this.setState({ nivelEquipo: { ...this.state.nivelEquipo, nivel: value } })}
                value={this.state.nivelEquipo ? this.state.nivelEquipo.nivel : 105}

            />
        }


        return (


            <div>
                <Form error={this.state.formError}>

                    <Form.Input label='Nombre Usuario' placeholder='Cual es tu nombre?'
                        value={this.state.nombreUsuario}
                        onChange={e => this.setState({ nombreUsuario: e.target.value })}
                        error={this.state.errorNombreUsuario}
                    />
                    <Form.Select label='Empresa' options={this.renderOpcionesEmpresa()} placeholder='Cual es tu Empresa?'
                        search
                        onChange={(e, { value }) => this.setState({ empresa: value })}
                        value={this.state.empresa}
                        error={this.state.errorEmpresa}
                        disabled={true}
                    />
                    <Form.Input label='Cargo' placeholder='Que cargo tienes?'
                        value={this.state.cargo}
                        onChange={e => this.setState({ cargo: e.target.value })}
                        error={this.state.errorCargo}
                    />

                    <Form.Input label='Area' placeholder='¿En qué departamento de la empresa laboras? '
                        value={this.state.area}
                        onChange={e => this.setState({ area: e.target.value })}
                        error={this.state.errorArea}
                    />

                    <Form.Select label='En que dia termina tu semana' options={Semana} 
                        search
                        onChange={(e, { value }) => this.setState({ diaSemana: value })}
                        value={this.state.diaSemana}

                    />

                    <Form.Select label='Lugar de residencia' options={this.renderOpcionesZona()} 
                        search
                        onChange={(e, { value }) => this.setState({ lugar: value })}
                        value={this.state.lugar}
                        error={this.state.errorLugar}
                    />

                    <Form.Input label='Teléfono' placeholder='¿Dondé te podemos contactar? '
                        value={this.state.telefono}
                        onChange={e => this.setState({ telefono: e.target.value })}
                        error={this.state.errorTelefono}
                    />

                    {nnivel}

                    <Message
                        error
                        header='Falta campos por llenar'
                        content='Debes diligenciar todos los campos'
                    />
                </Form>

                <Button  icon='save' disabled={this.state.activo} style={{ left: '52%', background: 'linear-gradient(to right, #fe10bd 20%, #f0bbe1 50% ,#fe10bd 100%)' }} labelPosition='right' content='Guardar' onClick={() => { this.renderGuardar() }} />
            </div>
        );
    }

    renderCargarImagen(imagen) {
        if (imagen)
            this.setState({ imagenMostrar: imagen })
        // https://react.semantic-ui.com/images/avatar/large/matthew.png
    }

    renderCambiarImagenPerfil() {
        if (this.props.usuarioDetail.usuario.imagenFondo)
            this.setState({ imagenFondo: this.props.usuarioDetail.usuario.imagenFondo })
        if (this.props.usuarioDetail.usuario.imagenPerfil)
            this.setState({ imagenFondo: this.props.usuarioDetail.usuario.imagenPerfil })
        this.setState({ openImagen: true })
    }

    close = () => this.setState({ openImagen: false })


    renderGuardar() {




        let tamano = '37em';
        if (this.state.open === 'slack') {
            this.setState({ slackIn: '0%' });
            if (!this.state.canalEquipoSlack || this.state.canalEquipoSlack === '')
                this.setState({ slackIn: '100%' });

            firebase.database().ref(`Usuario-Slack/${this.props.usuarioDetail.idUsuario}`).set({
                usuarioSlack: this.state.codigoUsSlack,
                tokenP: this.state.tokenUsSlack,
                tokenB: this.state.tokenBotUsSlack,
                gestor: this.state.canalGestorSlack,
                notifiacaiones: this.state.canalNotifiacionesSlack,
                reporting: this.state.canalReportesSlack,
                equipo: this.state.canalEquipoSlack,
            });
        }
        else if (this.state.open === 'drive') {
            this.setState({ driveIn: '0%' });
            if (!this.state.codigoWSdrive || this.state.codigoWSdrive === '')
                this.setState({ driveIn: '100%' });

            firebase.database().ref(`Usuario-WS/${this.props.usuarioDetail.usuario.empresa}/${this.props.usuarioDetail.usuario.equipo}/${this.props.usuarioDetail.idUsuario}`).set({
                linkWs: this.state.codigoWSdrive,
                fechaCreado: new Date(),
            });

        }

        else if (this.state.open === 'calendar') {
            this.setState({ calendarIn: '0%' });
            if (!this.state.calendar || this.state.calendar === '')
                this.setState({ calendarIn: '100%' });

            firebase.database().ref(`Usuario-CalendarGoogle/${this.props.usuarioDetail.idUsuario}`).set({
                idCalendar: this.state.idCalendar,
                fechaCreado: new Date(),
            });
        }
        else if (this.state.open === 'trello') {
            this.setState({ trelloIn: '0%' });
            if (!this.state.trelloApi || this.state.trelloApi === '' || !this.state.trelloDashboard || this.state.trelloDashboard === '' || !this.state.listaObjetivostoDO || this.state.listaObjetivostoDO === '')
                this.setState({ trelloIn: '100%' });

            firebase.database().ref(`Usuario-Trello/${this.props.usuarioDetail.idUsuario}`).set({
                usuarioTrello: this.state.usuarioTrello,
                trelloApi: this.state.trelloApi,
                tokenTrello: this.state.tokenTrello,
                trelloDashboard: this.state.trelloDashboard,
                listaObjetivostoDO: this.state.listaObjetivostoDO ? this.state.listaObjetivostoDO : null,
                listaOBjetivosDone: this.state.listaOBjetivosDone ? this.state.listaOBjetivosDone : null,
                listaObjetivosTheEnd: this.state.listaObjetivosTheEnd ? this.state.listaObjetivosTheEnd : null,

            });
        }
        else {
            firebase.database().ref(`Usuario/${this.props.usuarioDetail.idUsuario}`).set({
                ...this.props.usuarioDetail.usuario,
                usuario: this.state.nombreUsuario,
                cargo: this.state.cargo,
                area: this.state.area,
                telefono: this.state.telefono,
                lugar: this.state.lugar,
                empresa: this.props.usuarioDetail.usuario.empresa,
                imagenFondo: this.state.imagenFondo,
                imagenPerfil: this.state.imagenPerfil,
                canalSlack: this.state.codigoUsSlack ? this.state.codigoUsSlack : this.props.usuarioDetail.usuario.canalSlack ? this.props.usuarioDetail.usuario.canalSlack : null,
                equipo: this.props.usuarioDetail.usuario.equipo,
                onboarding: this.props.usuarioDetail.usuario.onboarding ? this.props.usuarioDetail.usuario.onboarding : null,
                wsCompartida: this.state.codigoWSdrive ? this.state.codigoWSdrive : this.props.usuarioDetail.usuario.wsCompartida ? this.props.usuarioDetail.usuario.wsCompartida : null,
                diaSemana: this.state.diaSemana ? this.state.diaSemana : 0,
            });
            if (this.props.usuarioDetail.rol === '2')
                firebase.database().ref(`Equipo-Esfuerzo/${this.props.usuarioDetail.usuario.equipo}`).set({
                    ...this.state.nivelEquipo,
                    nivel: this.state.nivelEquipo.nivel,
                });

        }

        this.setState({ activo: true });
    }



    renderCargar(pantalla) {
        this.setState({ activo: false });
        if (pantalla === 'slack') {
            const starCountRef = firebase.database().ref().child(`Usuario-Slack/${this.props.usuarioDetail.idUsuario}`);
            starCountRef.on('value', (snapshot) => {
                if (snapshot.val()) {
                    this.setState({ codigoUsSlack: snapshot.val().usuarioSlack ? snapshot.val().usuarioSlack : '' });
                    this.setState({ tokenUsSlack: snapshot.val().tokenP ? snapshot.val().tokenP : '' });
                    this.setState({ tokenBotUsSlack: snapshot.val().tokenB ? snapshot.val().tokenB : '' });
                    this.setState({ canalGestorSlack: snapshot.val().gestor ? snapshot.val().gestor : null });
                    this.setState({ canalNotifiacionesSlack: snapshot.val().notifiacaiones ? snapshot.val().notifiacaiones : '' });
                    this.setState({ canalReportesSlack: snapshot.val().reporting ? snapshot.val().reporting : '' });
                    this.setState({ canalEquipoSlack: snapshot.val().equipo ? snapshot.val().equipo : '' });




                    axios.get(` https://slack.com/api/channels.list?token=${snapshot.val().tokenB}&pretty=1`)
                        .then((res, tres) => {
                            // console.log(res.data);
                            this.setState({ listaCanales_Slack: res.data.channels });
                        });

                }
                else {
                    this.setState({ codigoUsSlack: '' });
                    this.setState({ tokenUsSlack: '' });
                    this.setState({ tokenBotUsSlack: '' });
                    this.setState({ canalGestorSlack: '' });
                    this.setState({ canalNotifiacionesSlack: '' });
                    this.setState({ canalReportesSlack: '' });
                    this.setState({ canalEquipoSlack: '' });
                }

                if (!snapshot.val() || !snapshot.val().equipo)
                    this.setState({ slackIn: '100%' });
                else
                    this.setState({ slackIn: '0%' });



            });
        }
        else if (pantalla === 'drive') {
            const starCountRef = firebase.database().ref().child(`Usuario-WS/${this.props.usuarioDetail.usuario.empresa}/${this.props.usuarioDetail.usuario.equipo}/${this.props.usuarioDetail.idUsuario}`);
            starCountRef.on('value', (snapshot) => {
                if (snapshot.val()) {
                    this.setState({ codigoWSdrive: snapshot.val().linkWs ? snapshot.val().linkWs : '' });
                }
                else {
                    this.setState({ codigoWSdrive: '' });
                }
                if (!snapshot.val() || !snapshot.val().linkWs)
                    this.setState({ driveIn: '100%' });
                else
                    this.setState({ driveIn: '0%' });
            });
        }

        else if (pantalla === 'calendar') {
            const starCountRef = firebase.database().ref().child(`Usuario-CalendarGoogle/${this.props.usuarioDetail.idUsuario}`);
            starCountRef.on('value', (snapshot) => {
                if (snapshot.val()) {
                    this.setState({ idCalendar: snapshot.val().idCalendar ? snapshot.val().idCalendar : '' });
                }
                else {
                    this.setState({ idCalendar: '' });
                }
                if (!snapshot.val() || !snapshot.val().idCalendar)
                    this.setState({ calendarIn: '100%' });
                else
                    this.setState({ calendarIn: '0%' });

            });
        }
        else if (pantalla === 'trello') {

            const starCountRef = firebase.database().ref().child(`Usuario-Trello/${this.props.usuarioDetail.idUsuario}`);
            starCountRef.on('value', (snapshot) => {
                if (snapshot.val()) {
                    this.setState({ trelloApi: snapshot.val().trelloApi ? snapshot.val().trelloApi : '' });
                    this.setState({ tokenTrello: snapshot.val().tokenTrello ? snapshot.val().tokenTrello : '' });
                    this.setState({ usuarioTrello: snapshot.val().usuarioTrello ? snapshot.val().usuarioTrello : '' });
                    this.setState({ trelloDashboard: snapshot.val().trelloDashboard ? snapshot.val().trelloDashboard : '' });
                    this.setState({ listaObjetivostoDO: snapshot.val().listaObjetivostoDO ? snapshot.val().listaObjetivostoDO : '' });
                    this.setState({ listaOBjetivosDone: snapshot.val().listaOBjetivosDone ? snapshot.val().listaOBjetivosDone : '' });
                    this.setState({ listaObjetivosTheEnd: snapshot.val().listaObjetivosTheEnd ? snapshot.val().listaObjetivosTheEnd : '' });
                    if (snapshot.val().trelloApi && snapshot.val().tokenTrello) {
                        trello = new Trello(snapshot.val().trelloApi, snapshot.val().tokenTrello);
                        trello.getBoards(snapshot.val().usuarioTrello).then((Response) => { this.setState({ trelloListaDashBoard: Response }) })
                        trello.getListsOnBoard(snapshot.val().trelloDashboard).then((Response) => { this.setState({ trelloLista: Response }); });
                    }
                }
                else {
                    this.setState({ trelloApi: '' });
                    this.setState({ tokenTrello: '' });
                    this.setState({ listaObjetivostoDO: '' });
                    this.setState({ listaOBjetivosDone: '' });
                    this.setState({ listaObjetivosTheEnd: '' });
                }
                if (!snapshot.val() || !snapshot.val().trelloApi || !snapshot.val().trelloDashboard || !snapshot.val().listaObjetivostoDO)
                    this.setState({ trelloIn: '100%' });
                else
                    this.setState({ trelloIn: '0%' });

            });

        }
        else {
            this.setState({ entro: true });
            this.setState({ nombreUsuario: this.props.usuarioDetail.usuario.usuario });
            // this.setState({ empresa: this.props.usuarioDetail.usuario.empresa });
            this.setState({ cargo: this.props.usuarioDetail.usuario.cargo });
            this.setState({ diaSemana: this.props.usuarioDetail.usuario.diaSemana ? this.props.usuarioDetail.usuario.diaSemana : null });
            this.setState({ area: this.props.usuarioDetail.usuario.area });
            this.setState({ imagenFondo: this.props.usuarioDetail.usuario.imagenFondo ? this.props.usuarioDetail.usuario.imagenFondo : null });
            this.setState({ imagenPerfil: this.props.usuarioDetail.usuario.imagenPerfil ? this.props.usuarioDetail.usuario.imagenPerfil : null });
            this.setState({ telefono: this.props.usuarioDetail.usuario.telefono ? this.props.usuarioDetail.usuario.telefono : null });
            this.setState({ lugar: this.props.usuarioDetail.usuario.lugar ? this.props.usuarioDetail.usuario.lugar : null });

            const starCountRef = firebase.database().ref().child(`empresa/${this.props.usuarioDetail.usuario.empresa}`);
            starCountRef.on('value', (snapshot) => {
                this.setState({ empresa: snapshot.val().industria })
            });

            if (this.props.usuarioDetail.rol === '2') {
                const starCountRef2 = firebase.database().ref(`Equipo-Esfuerzo/${this.props.usuarioDetail.usuario.equipo}`);
                starCountRef2.on('value', (snapshot) => {
                    if (snapshot.val())
                        this.setState({ nivelEquipo: snapshot.val() })
                });
            }
        }
    }

    render() {

    if(!this.props.usuarioDetail)
    return <div></div>;

        if (this.props.usuarioDetail && this.props.usuarioDetail.usuario && !this.state.entro)
            this.renderCargar();
        let tamano = '42em';
        if (this.props.usuarioDetail.rol === '2')
            tamano = '46em';
        if (this.state.open === 'slack') {
            tamano = '22em';
        }
        else if (this.state.open === 'drive')
            tamano = '10em';
        else if (this.state.open === 'calendar')
            tamano = '10em';
        else if (this.state.open === 'trello') {
            tamano = '10em';
            if (this.state.trelloApi && this.state.tokenTrello)
                tamano = '30em';
        }



        return (
            <div className="ui form">
                        <Card style={{ left: '10%', width: '80%' }}>
                            <Image src={this.state.imagenFondo ? this.state.imagenFondo : 'https://cdn.pixabay.com/photo/2016/08/09/21/54/yellowstone-national-park-1581879_960_720.jpg'} onClick={() => { this.setState({ open: null }); this.renderCambiarImagenPerfil(); }} style={{ height: '250px' }} />
                            <Card.Content style={{ height: '250px' }}>
                                <Image src={this.state.imagenPerfil ? this.state.imagenPerfil : 'https://files.informabtl.com/uploads/2015/08/perfil.jpg'} onClick={() => { this.setState({ open: null }); this.renderCambiarImagenPerfil(); }} circular size="small" style={{ left: '4%', height: '190px', position: 'relative', top: '-160px' }} />
                                <Image src={slack} onClick={() => { this.state.open === 'slack' ? this.setState({ open: null }) : this.setState({ open: 'slack' }); this.renderCargar('slack'); }} circular size="mini" style={{ filter: 'grayscale(' + this.state.slackIn + ')', background: this.state.open === 'slack' ? 'rgb(222, 181, 243)' : '#f7f7e3', left: '-14%', position: 'relative', top: '-55px' }} />
                                <Image src={drive} onClick={() => { this.state.open === 'drive' ? this.setState({ open: null }) : this.setState({ open: 'drive' }); this.renderCargar('drive'); }} circular size="mini" style={{ filter: 'grayscale(' + this.state.driveIn + ')', background: this.state.open === 'drive' ? 'rgb(222, 181, 243)' : '#f7f7e3', left: '-12%', position: 'relative', top: '-55px' }} />
                                <Image src={calendar} onClick={() => { this.state.open === 'calendar' ? this.setState({ open: null }) : this.setState({ open: 'calendar' }); this.renderCargar('calendar'); }} circular size="mini" style={{ filter: 'grayscale(' + this.state.calendarIn + ')', background: this.state.open === 'calendar' ? 'rgb(222, 181, 243)' : '#f7f7e3', left: '-10%', position: 'relative', top: '-55px' }} />
                                <Image src={trelloImg} onClick={() => { this.state.open === 'trello' ? this.setState({ open: null }) : this.setState({ open: 'trello' }); this.renderCargar('trello'); }} circular size="mini" style={{ filter: 'grayscale(' + this.state.trelloIn + ')', background: this.state.open === 'trello' ? 'rgb(222, 181, 243)' : '#f7f7e3', left: '-8%', position: 'relative', top: '-55px' }} />

                                <Button circular color="pink" style={{ position: 'relative', top: '-8em', left: '-15%' }} icon="image" onClick={() => { this.setState({ open: null }); this.renderCambiarImagenPerfil(); }}></Button>
                                <Button circular color="pink" style={{ position: 'relative', top: '-24.2em', left: '62%' }} icon="image" onClick={() => { this.setState({ open: null }); this.renderCambiarImagenPerfil(); }}></Button>

                            </Card.Content>

                        </Card>
                        <Button content="Crea tu propio flujo de trabajo" onClick={() => { history.push('/newworkflow'); }} style={{ width: '200px',top: '225px', left: '22%', background: 'linear-gradient(to right, #fe10bd 20%, #f0bbe1 50% ,#fe10bd 100%)' }} icon="object group outline"></Button>

                         <div className="ui segment" style={{ height: tamano, top: '-1.8em',left: '34%', width: '56%',  background: 'linear-gradient(to top, #e0399738 0.5%, rgb(255, 255, 255) 0.6%, rgba(245, 242, 224, 0) 200%)' }}>
                            <Modal open={this.state.openImagen}
                                closeOnEscape={false}
                                closeOnDimmerClick={true}
                                onClose={this.state.close}
                                style = {{height: '350px', top: '150px'}}
                            >
                                <Modal.Header>Tu imagén</Modal.Header>
                                <Modal.Content image>
                                    <Image wrapped size='medium' src={

                                        this.state.imagenMostrar ? this.state.imagenMostrar : 'https://react.semantic-ui.com/images/avatar/large/rachel.png'} />
                                    <Modal.Description fluid>
                                        <Header>Selecciona tu fondo</Header>
                                        <Input style={{ width: '300%' }} fluid label='Url de la imagen' placeholder='https://react.semantic-ui.com/images...'
                                            onClick={() => { this.renderCargarImagen(this.state.imagenFondo); }}
                                            value={this.state.imagenFondo}
                                            onChange={(e) => { this.setState({ imagenFondo: e.target.value }); this.renderCargarImagen(e.target.value); }}>
                                        </Input>
                                        <Header>Selecciona tu perfil</Header>
                                        <Input style={{ width: '300%' }} fluid label='Url de la imagen' placeholder='https://react.semantic-ui.com/images...'
                                            onClick={() => { this.renderCargarImagen(this.state.imagenPerfil); }}
                                            value={this.state.imagenPerfil}
                                            onChange={(e) => { this.setState({ imagenPerfil: e.target.value }); this.renderCargarImagen(e.target.value); }}>
                                        </Input>
                                    </Modal.Description>
                                </Modal.Content>
                                <Modal.Actions style= {{ top: '340px', position: 'relative'}}>
                                    <Button onClick={this.close} style = {{background: "grey", left: "-20px"}}>
                                        Cancelar
                                      </Button>
                                    <Button
                                        onClick={() => { this.close(); this.renderGuardar(); }}
                                        style= {{background: "linear-gradient(to right, #fe10bd 20%, #f0bbe1 50% ,#fe10bd 100%)", left: "-10px"}}
                                        labelPosition='right'
                                        icon='checkmark'
                                        content='Guardar'
                                    />
                                </Modal.Actions>

                            </Modal>
                            {this.renderForm()}
                        </div>
                    </div>

        );
    }
}
const mapStateToProps = (state) => {
    return {
        usuarioDetail: state.chatReducer.usuarioDetail,
        isSignedIn: state.auth.isSignedIn,
        isChat: state.chatReducer.isChat,
    };
};


export default connect(mapStateToProps, { chatOn, chatOff })(Profile);