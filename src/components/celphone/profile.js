import React from 'react';
import { connect } from 'react-redux';
import '../../components/styles/ingresoHupity.css';
import { chatOn, chatOff, mensajeAsanas, popupBot } from '../../actions';
import { Image, Button, Form, Message } from 'semantic-ui-react';
import history from '../../history';
import zonaEspana from '../../components/utilidades/zonaEspana';
import axios from 'axios';
import drive from '../../images/drive.png';
import calendar from '../../images/calendar.png';
import slack from '../../images/slack.png';
import trelloImg from '../../images/trello.png';
import asana from '../../images/asana.png';
import clickup from '../../images/clickup.png';
import asanaH from '../../apis/asana';
import { clientIdAsana, clientSecrectAsana, clientSlack } from '../../apis/stringConnection';
import { dataBaseManager, selectStyle } from '../../lib/utils';
import Select from 'react-select';
import chroma from 'chroma-js';


let timelenght = 20000;
//const Asana = require('asana');
let Trello = require("trello");
let trello = null;// new Trello("bb3cab1a303c7bf996d56bb46db2a46f", "136434ae14c54519e4af94ed7f48ec43d710e777bb1bbe0b06cdda6368f1d44e");



///pantalla de  perfil del usuario
//limpiar variables
const nivel = [
    { key: 1, label: 'Normal', value: '105' },
    { key: 2, label: 'Competitivo', value: '115' },
    { key: 3, label: 'Altamente Competitivo', value: '125' },

]
const Semana = [
    { key: 1, label: 'Viernes', value: 5 },
    { key: 2, label: 'Sabado', value: 6 },
    { key: 3, label: 'Domingo', value: 7 },
]
class Profile extends React.Component {

    state = {
        open: null, listaEmpresas: {}, formError: false, openImagen: false, entro: false, mensajeCodigo: null,
        tipo: null, empresa: null, nombreUsuario: null, cargo: null, listaEquipos: {}, area: null, lugar: null, telefono: null, equipo: null, codigo: null, acepto: null,
        errorTipo: null, errorNombreUsuario: null, errorCargo: null, errorArea: null, errorTelefono: null, errorLugar: null, errorEmpresa: null, errorEquipo: null, errorCodigo: null, errorAcepto: null, idCalendar: null,
        codigoUsSlack: null, tokenUsSlack: null, tokenBotUsSlack: null, canalGestorSlack: null, canalEquipoSlack: null, canalReportesSlack: null, canalNotifiacionesSlack: null,
        codigoWSdrive: null, activo: false, listaCanales_Slack: null, usuarioTrello: null, trelloListaDashBoard: null, trelloLista: null, trelloDashboard: null, errorDashboard: null,
        nivelEquipo: null, diaSemana: null, liscalendars: null,

        trelloIn: '100%', slackIn: '100%', driveIn: '0%', calendarIn: '100%',

        trelloApi: null, tokenTrello: null, listaObjetivostoDO: null, listaOBjetivosDone: null, listaObjetivosTheEnd: null, imagenMostrar: null, imagenFondo: null, imagenPerfil: null,
        asana: null, projectsIdAsana: null, sectionsAsana: null, collAsanaProyects: null, collsectionsAsana: null, asanaIn: 1

    }

    componentDatabase(tipo, path, objectIn, mensaje, mensajeError) {
        let men = dataBaseManager(tipo, path, objectIn, mensaje, mensajeError);
        if (men && men.mensaje)
            this.props.popupBot({ mensaje: men.mensaje });
        return men;
    }

    componentWillMount() {
        if (!this.props.isSignedIn || !this.props.usuarioDetail) {
            history.push('/dashboard');
            return;
        }
    }
    componentDidMount() {

        //se consulta todas las empresas

        if (!this.props.isSignedIn || !this.props.usuarioDetail) {
            history.push('/dashboard');
            return;
        }

        const starCountRef = this.componentDatabase('get', 'empresa');
        starCountRef.on('value', (snapshot) => {
            this.setState({ listaEmpresas: snapshot.val() })
        });

        //herramientas usuario
        if (this.props.usuarioDetail.usuario.asana)
            this.setState({ asanaIn: 0 });
        if (this.props.usuarioDetail.usuario.trello)
            this.setState({ trelloIn: 0 });
        if (this.props.usuarioDetail.usuario.calendar)
            this.setState({ calendarIn: 0 });
        if (this.props.usuarioDetail.usuario.slack)
            this.setState({ slackIn: 0 });

        if (this.props.mensajeAsana === 'Slack') {
            this.setState({ open: 'slack' });
            this.renderCargar('slack');
        }
        else if (this.props.mensajeAsana === 'Asana') {

            this.setState({ open: 'asana' });
            this.renderCargar('asana');
        }
        this.props.mensajeAsanas();


    }

    renderOpcionesEmpresa() {

        const listaX = this.state.listaEmpresas;
        let lista = {};
        const opciones = Object.keys(listaX).map(function (key, index) {
            lista = { ...lista, key: key, label: listaX[key].industria, value: listaX[key].industria };
            return lista;
        });
        return opciones;
    }


    renderOpcionesZona() {

        const listaX = zonaEspana();
        let entro = null;
        Object.keys(listaX).map((key, index) => {
            if (listaX[key].name === ' ')
                entro = true;
            return listaX[key];

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


    renderCalendars(listaX) {

        let lista = {};
        if (listaX) {
            const opciones = Object.keys(listaX).map((key, index) => {
                lista = { ...lista, value: listaX[key].id, label: listaX[key].summary };
                this.canal = lista[0];
                return lista;
            });

            return opciones;
        }
        return;
    }


    renderCanaleSlack() {
        let listaX = this.state.listaCanales_Slack;

        let lista = {};
        if (listaX) {
            const opciones = Object.keys(listaX).map((key, index) => {


                lista = { ...lista, value: listaX[key].id, label: listaX[key].name };

                // if(index === 1)
                this.canal = lista[0];
                return lista;
            });


            return opciones;
        }
        return;
    }


    
    renderValidateSlack() {

        if (this.state.canalEquipoSlack === undefined && this.state.canalReportesSlack === undefined && this.state.canalNotifiacionesSlack === undefined) {
            this.setState({ activo: true });
        }

        else {
            this.setState({ activo: false });
        }

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


        let st = selectStyle();
        let op = this.renderCanaleSlack();
        let formSlack = <div>
            <Form  >
                <h3>Cual es el canal mas importante?</h3>
                <Select options={op}
                    search
                    value={this.state.canalReportesSlack}
                    styles={st}
                    onChange={(e, { value }) => { this.setState({ canalReportesSlack: e }); this.renderValidateSlack(); }}

                />
                <h3>Cual sera el canal de tu equipo?</h3>
                <Select options={op}
                    search
                    styles={st}
                    value={this.state.canalEquipoSlack}
                    onChange={(e, { value }) => { this.setState({ canalEquipoSlack: e }); this.renderValidateSlack(); }}

                />
                <h3>Menciona otro canal importante? </h3>
                <Select options={op}
                    search
                    styles={st}
                    value={this.state.canalNotifiacionesSlack}
                    onChange={(e) => { console.log(e); this.setState({ canalNotifiacionesSlack: e }); this.renderValidateSlack(); }}
                />
            </Form>
            <br />


            <button disabled={this.state.canalEquipoSlack ? false : true}
                onClick={() => { this.renderGuardar() }} className="ui pink button inverted " style={{ left: "25%" }}>
                <i class="save icon"></i>
                                Guardar
                            </button>
        </div>


        if (this.state.listaCanales_Slack === undefined || !this.state.listaCanales_Slack) {
            formSlack = <div>
                <Form  >
                    <a href={`https://slack.com/oauth/authorize?scope=bot&redirect_uri=${window.location.origin}&client_id=${clientSlack}`}><img src="https://api.slack.com/img/sign_in_with_slack.png" /></a>
                </Form>
                <br />
            </div>
        }

        return (
            formSlack
        );
    }


    renderForm() {
        if (this.state.open === 'slack')
            return (this.renderUsuarioSlack());
        else if (this.state.open === 'drive')
            return (this.renderDrive());
        else if (this.state.open === 'calendar')
            return (this.renderCalendar());
        else if (this.state.open === 'asana')
            return (this.renderAsana());
        else if (this.state.open === 'sheet')
            return (this.renderConstruccion());
        else if (this.state.open === 'clickup')
            return (this.renderConstruccion());
        else if (this.state.open === 'trello')
            return (this.renderTrello());
        else {
            return (this.renderUsuario());
        }
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

                <button disabled={this.state.codigoWSdrive ? false : true}
                    onClick={() => { this.renderGuardar() }} className="ui pink button inverted " style={{ left: "25%" }}>
                    <i class="save icon"></i>
                                Guardar
                            </button>
            </div>

        );
    }



    renderCalendar() {
        /*var event = {
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
        };*/
        if (!this.state.liscalendars) {
            window.gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
                .then(() => {
                    console.log("GAPI client loaded for API");
                    window.gapi.client.calendar.calendarList.list().then((res) => { console.log(res.result.items); this.setState({ liscalendars: res.result.items }); })
                },
                    function (err) { console.error("Error loading GAPI client for API", err); });

        }
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
        let st = selectStyle();
        return (
            <div>
                <Form >
                    <h3>Selecciona tu calendario de google</h3>
                    <Select options={this.renderCalendars(this.state.liscalendars)}
                        search
                        value={this.state.idCalendar}
                        styles={st}
                        onChange={(e, { value }) => { this.setState({ idCalendar: e }); }}
                    />
                </Form >
                <br />

                <button disabled={this.state.idCalendar ? false : true}
                    onClick={() => { this.renderGuardar() }} className="ui pink button inverted " style={{ left: "25%" }}>
                    <i class="save icon"></i>
                                Guardar
                            </button>

            </div>
        );
    }





    renderOpcionesTrello(listaOpciones) {

        let listaX = listaOpciones;
        let entro = null;

        let lista = {};
        if (!listaX)
            return;

        Object.keys(listaX).map((key, index) => {
            if (listaX[key].name === 'Ninguno')
                entro = true;
            return listaX[key];
        });

        if (!entro) {
            listaX.unshift({ name: 'Ninguno', id: '' });
        }

        //  console.log(listaX);
        const opciones = Object.keys(listaX).map(function (key, index) {
            //  console.log(listaX[key]);
            lista = { ...lista, label: listaX[key].name, value: listaX[key].id };
            return lista;
            //return cconsulta[key].concepto;
        });
        //  console.log(opciones);
        return opciones;

    }

    componentDidUpdate() {
        if (this.state.trelloApi && !this.state.tokenTrello) {
            const starCountRef2 = this.componentDatabase('get', `Usuario-TokenTrelloTemp/${this.props.usuarioDetail.idUsuario}`);
            starCountRef2.on('value', (snapshot2) => {

                if (snapshot2.val()) {
                    this.setState({ tokenTrello: snapshot2.val().token });
                    trello = new Trello(this.state.trelloApi, snapshot2.val().token);
                    trello.makeRequest('get', '/1/members/me/tokens', { webhooks: true }).then((res) => {
                        //    console.log(res[0].idMember)
                        this.setState({ usuarioTrello: res[0].idMember });
                        trello.getBoards(res[0].idMember).then((Response) => { this.setState({ trelloListaDashBoard: Response }) })

                        this.componentDatabase('insert', `Usuario-Trello/${this.props.usuarioDetail.idUsuario}`, {
                            usuarioTrello: res[0].idMember,
                            trelloApi: this.state.trelloApi,
                            tokenTrello: snapshot2.val().token
                        });

                        this.renderCloseTrello();
                        this.myWindow.close();
                    });
                }


            });
        }
    }
    renderConsultaApiKeyTrello(valor) {
        this.renderClose()
        this.myWindow = window.open(`https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Server%20Token&key=${valor}&return_url=${window.location.origin}`, '', 'width=650,height=650,left=200,top=200');
    }

    renderFiltroTrello(valor) {
        if (valor !== '') {
            trello.getListsOnBoard(valor).then((Response) => { this.setState({ trelloLista: Response }); });
        }

    }


    renderCloseTrello(myWindow) {
        this.timeout = setTimeout(() => {
            this.componentDatabase('insert', `Usuario-TokenTrelloTemp/${this.props.usuarioDetail.idUsuario}`, {});
        }, timelenght)
    }

    renderClose() {
        this.timeout = setTimeout(() => {
            console.log(this.myWindow2.document.getElementById("key").value)
            this.myWindow2.close();
        }, 2500)
    }






    renderTrello() {
        //https://www.npmjs.com/package/trello

        /*
        
                                <h3>Si eres gestor agrega lo siguiente: </h3>
                                <Form.Select label='Lista Objetivos validados' options={this.renderOpcionesTrello(this.state.trelloLista)} placeholder='Escogé una lista'
                                    search
                                    value={this.state.listaObjetivosTheEnd}
        
                                    onChange={(e, { value }) => this.setState({ listaObjetivosTheEnd: value })}
                                    visible
                                />
        
        */


        /// el token  lo debo recuperar axios
        /*<Form.Input label='Token Trello' placeholder='136434ae14c54519e4af94ed...'
        value={this.state.tokenTrello}
        onChange={e => this.setState({ tokenTrello: e.target.value })}
    />*/


        let contruir = <Form >
            <Form.Input label='Trello Api Key' placeholder='bb3cab1a303c7bf996d5...'
                value={this.state.trelloApi}
                onChange={e => { this.setState({ trelloApi: e.target.value }); this.renderConsultaApiKeyTrello(e.target.value); }}
            />
            <div className="inline">
                <Button basic color="blue" style={{ height: '3.3em', left: '25%', position: 'relative' }} icon='trello' labelPosition='center' content='Generar' onClick={() => {
                    this.myWindow2 = window.open('https://trello.com/app-key/', '', 'width=650,height=650,left=200,top=200');
                    this.props.popupBot({ mensaje: "copia el valor de tu 'key' en la caja de texto" });
                }} />
            </div>
        </Form>

        let st = selectStyle();
        if (this.state.trelloApi && this.state.tokenTrello) {
            contruir =
                <div>
                    <Form >

                        <h3>Selecciona Dashboard</h3>
                        <Select options={this.renderOpcionesTrello(this.state.trelloListaDashBoard)}
                            search
                            value={this.state.trelloDashboard}
                            styles={st}
                            onChange={(e, { value }) => { this.setState({ trelloDashboard: e }); this.renderFiltroTrello(e.value); }}

                        />
                        <h3>Lista Objetivos por trabajar</h3>
                        <Select options={this.renderOpcionesTrello(this.state.trelloLista)}
                            search
                            value={this.state.listaObjetivostoDO}
                            styles={st}
                            onChange={(e, { value }) => { this.setState({ listaObjetivostoDO: e }); }}

                        />
                        <h3>Lista Objetivos terminados</h3>
                        <Select options={this.renderOpcionesTrello(this.state.trelloLista)}
                            search
                            value={this.state.listaOBjetivosDone}
                            styles={st}
                            onChange={(e, { value }) => { this.setState({ listaOBjetivosDone: e }); }}

                        />
                    </Form>
                    <br />


                    <button disabled={this.state.trelloDashboard && ((this.state.listaObjetivostoDO && this.state.listaObjetivostoDO !== '') ||
                        (this.state.listaOBjetivosDone && this.state.listaOBjetivosDone !== '') ||
                        (this.state.listaObjetivosTheEnd && this.state.listaObjetivosTheEnd !== '')) ? false : true}
                        onClick={() => {
                            this.componentDatabase('delete', `Usuario-TokenTrelloTemp/${this.props.usuarioDetail.idUsuario}`);
                            this.renderGuardar()
                        }} className="ui pink button inverted " style={{ left: "25%" }}>
                        <i class="save icon"></i>
                                Guardar
                            </button>
                </div>
        }

        // 
        return (
            <div>
                {contruir}
            </div>

        );
    }



    renderConsultasAsana = (consulta, value) => {
        let response = null

        switch (consulta) {
            case 'projects':
                response = asanaH.get('/api/1.0/projects', { headers: { Authorization: 'Bearer ' + this.state.asana.token } }).then((res) => { this.setState({ collAsanaProyects: res.data.data }); }).catch(err => { this.setState({ asana: null }) });
                break;

            case 'sections':
                console.log(value.value)
                response = asanaH.get('/api/1.0/projects/' + value.value + '/sections', { headers: { Authorization: 'Bearer ' + this.state.asana.token } }).then((res) => this.setState({ collsectionsAsana: res.data.data }));
                break;
            default:
                break
        }

        return response;
    }


    renderOpcionesAsana(listaOpciones) {

        let listaX = listaOpciones;

        //console.log(listaX);
        let lista = {};
        if (!listaX)
            return;



        //  console.log(listaX);
        const opciones = Object.keys(listaX).map(function (key, index) {
            //  console.log(listaX[key]);
            lista = { ...lista, label: listaX[key].name, value: listaX[key].gid };
            return lista;
            //return cconsulta[key].concepto;
        });
        //  console.log(opciones);
        return opciones;

    }

    renderAsana() {

        let formAsana = <div style={{ height: '3.3em', top: '2.5em', left: '40%', position: 'relative' }}>
            <button class="ui red basic button " style={{ width: '17em', height: '4em' }}>
                <Image src={asana} circular size="mini" />
                <a style={{ top: '-1.6em', position: 'relative', left: '1.6em' }} href={`https://app.asana.com/-/oauth_authorize?client_id=${clientIdAsana}&redirect_uri=${window.location.origin}&response_type=code&state=asana_0.8wpnz8r4jj8kaspekwp`}>Authenticate with Asana</a>
            </button>
        </div>

        let st = selectStyle();
        if (this.state.asana) {
            formAsana =
                <div>

                    <h3>Lista de tus proyectos</h3>
                    <Select options={this.renderOpcionesAsana(this.state.collAsanaProyects)}
                        search
                        styles={st}
                        value={this.state.projectsIdAsana}
                        onChange={(e, { value }) => { this.setState({ projectsIdAsana: e }); if (e !== null) this.renderConsultasAsana('sections', e) }}

                    />
                    <h3>Lista de tus secciones</h3>
                    <Select options={this.renderOpcionesAsana(this.state.collsectionsAsana)}
                        search
                        styles={st}
                        value={this.state.sectionsAsana}
                        onChange={(e, { value }) => { this.setState({ sectionsAsana: e }); }}


                    />
                    <br></br>

                    <button disabled={this.state.sectionsAsana && this.state.projectsIdAsana ? false : true} onClick={() => { this.renderGuardar(); this.setState({ asanaIn: 0 }); }} className="ui pink button inverted " style={{ left: "25%" }}>
                        <i class="save icon"></i>
                                Guardar
                            </button>

                </div>
        }
        let contruir = <Form >
            {formAsana}
        </Form>
        return (
            <div>
                {contruir}
            </div>

        );

    }

    renderConstruccion() {
        let contruir = <Form >
            <div className="box" style={{ top: '2.2em' }}>
                <div className="loader9"></div>
                <p style={{
                    height: '3em',
                    borderRadius: '2.5em',
                    width: '14em',
                    top: '1em',
                    left: '-5em'
                }}>Lo estamos diseñando para ti</p>
            </div >
        </Form>
        return (
            <div>
                {contruir}
            </div>

        );
    }

    renderUsuario() {
        let nnivel = null;
        if (this.props.usuarioDetail.rol === '2') {
            nnivel = <div>
                <h3>Define el nivel de competitividad de tu equipo</h3>
                <Select options={nivel}
                    search
                    styles={st}
                    onChange={(e, { value }) => { this.setState({ nivelEquipo: e }); }}
                    value={this.state.nivelEquipo ? this.state.nivelEquipo.nivel : 105}

                />
            </div>

        }

        let st = selectStyle();
        return (


            <div>
                <Form error={this.state.formError}>

                    <Form.Input label='Nombre Usuario' placeholder='Cual es tu nombre?'
                        value={this.state.nombreUsuario}
                        onChange={e => this.setState({ nombreUsuario: e.target.value })}
                        error={this.state.errorNombreUsuario}
                    />



                    <Form.Input label='Cargo' placeholder='Que cargo tienes?'
                        value={this.state.cargo}
                        onChange={e => this.setState({ cargo: e.target.value })}
                        error={this.state.errorCargo}
                    />
                    <br></br>
                    <Form.Input label='Area' placeholder='¿En qué departamento de la empresa laboras? '
                        value={this.state.area}
                        onChange={e => this.setState({ area: e.target.value })}
                        error={this.state.errorArea}
                    />


                    <h5>En que dia termina tu semana</h5>
                    <Select options={Semana}
                        search
                        styles={st}
                        onChange={(e, { value }) => { this.setState({ diaSemana: e }); }}
                        value={this.state.diaSemana}

                    />

                    <br></br>
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
                <br></br>
                <button disabled={this.state.activo} onClick={() => { this.renderGuardar() }} className="ui pink button inverted " style={{ left: "25%" }}>
                    <i class="save icon"></i>
                                Guardar
                            </button>
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


        this.props.popupBot({ mensaje: 'Ya hemos guardado tu configuración' });

        if (this.state.open === 'slack') {
            this.setState({ slackIn: '0%' });
            if (!this.state.canalEquipoSlack || this.state.canalEquipoSlack === '')
                this.setState({ slackIn: '100%' });


            this.componentDatabase('update', `Usuario-Slack/${this.props.usuarioDetail.idUsuario}`, {
                gestor: this.state.canalGestorSlack,
                notifiacaiones: this.state.canalNotifiacionesSlack,
                reporting: this.state.canalReportesSlack,
                equipo: this.state.canalEquipoSlack
            });

            this.componentDatabase('update', `Usuario/${this.props.usuarioDetail.idUsuario}`, {
                slack: true,
            });
        }
        else if (this.state.open === 'drive') {
            this.setState({ driveIn: '0%' });
            if (!this.state.codigoWSdrive || this.state.codigoWSdrive === '')
                this.setState({ driveIn: '100%' });

            this.componentDatabase('insert', `Usuario-WS/${this.props.usuarioDetail.usuario.empresa}/${this.props.usuarioDetail.usuario.equipo}/${this.props.usuarioDetail.idUsuario}`, {
                linkWs: this.state.codigoWSdrive,
                fechaCreado: new Date(),
            });
        }

        else if (this.state.open === 'calendar') {
            this.setState({ calendarIn: '0%' });
            if (!this.state.calendar || this.state.calendar === '')
                this.setState({ calendarIn: '100%' });

            this.componentDatabase('insert', `Usuario-CalendarGoogle/${this.props.usuarioDetail.idUsuario}`, {
                idCalendar: this.state.idCalendar,
                fechaCreado: new Date(),
            });

            this.componentDatabase('update', `Usuario/${this.props.usuarioDetail.idUsuario}`, {
                calendar: true,
            });

        }
        else if (this.state.open === 'trello') {
            this.setState({ trelloIn: '0%' });
            if (!this.state.trelloApi || this.state.trelloApi === '' || !this.state.trelloDashboard || this.state.trelloDashboard === '' || !this.state.listaObjetivostoDO || this.state.listaObjetivostoDO === '')
                this.setState({ trelloIn: '100%' });

            this.componentDatabase('update', `Usuario-Trello/${this.props.usuarioDetail.idUsuario}`, {
                usuarioTrello: this.state.usuarioTrello,
                trelloApi: this.state.trelloApi,
                tokenTrello: this.state.tokenTrello,
                trelloDashboard: this.state.trelloDashboard,
                listaObjetivostoDO: this.state.listaObjetivostoDO ? this.state.listaObjetivostoDO : null,
                listaOBjetivosDone: this.state.listaOBjetivosDone ? this.state.listaOBjetivosDone : null,
                listaObjetivosTheEnd: this.state.listaObjetivosTheEnd ? this.state.listaObjetivosTheEnd : null,
            });

            this.componentDatabase('update', `Usuario/${this.props.usuarioDetail.idUsuario}`, {
                trello: true,
            });
        }

        else if (this.state.open === 'asana') {

            this.componentDatabase('update', `Usuario-Asana/${this.props.usuarioDetail.idUsuario}`, {
                project: this.state.projectsIdAsana,
                section: this.state.sectionsAsana,
            });

            this.componentDatabase('update', `Usuario/${this.props.usuarioDetail.idUsuario}`, {
                asana: true,
            });
        }
        else {
            this.componentDatabase('update', `Usuario/${this.props.usuarioDetail.idUsuario}`, {
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
                this.componentDatabase('insert', `Usuario/${this.props.usuarioDetail.idUsuario}`, {
                    ...this.state.nivelEquipo,
                    nivel: this.state.nivelEquipo.nivel,
                });


        }

        //  this.setState({ activo: true });
    }



    renderCargar(pantalla) {
        this.setState({ activo: false });
        if (pantalla === 'slack') {
            const starCountRef =   this.componentDatabase('get', `Usuario-Slack/${this.props.usuarioDetail.idUsuario}`);
            starCountRef.on('value', (snapshot) => {
                if (snapshot.val()) {
                    console.log(snapshot.val());
                    this.setState({ canalGestorSlack: snapshot.val().gestor ? snapshot.val().gestor : null });
                    this.setState({ canalNotifiacionesSlack: snapshot.val().notifiacaiones ? snapshot.val().notifiacaiones : '' });
                    this.setState({ canalReportesSlack: snapshot.val().reporting ? snapshot.val().reporting : '' });
                    this.setState({ canalEquipoSlack: snapshot.val().equipo ? snapshot.val().equipo : '' });

                    axios.get(` https://slack.com/api/channels.list?token=${snapshot.val().tokenBot}&pretty=1`)
                        .then((res, tres) => {
                            // console.log(res.data);
                            this.setState({ listaCanales_Slack: res.data.channels });
                        });

                }

                if (!snapshot.val() || !snapshot.val().equipo)
                    this.setState({ slackIn: '100%' });
                else
                    this.setState({ slackIn: '0%' });



            });
        }
        else if (pantalla === 'drive') {
            
            const starCountRef = this.componentDatabase('get', `Usuario-WS/${this.props.usuarioDetail.usuario.empresa}/${this.props.usuarioDetail.usuario.equipo}/${this.props.usuarioDetail.idUsuario}`);
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
            const starCountRef = this.componentDatabase('get', `Usuario-CalendarGoogle/${this.props.usuarioDetail.idUsuario}`);
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

        else if (pantalla === 'asana') {
            const starCountRef = this.componentDatabase('get', `Usuario-Asana/${this.props.usuarioDetail.idUsuario}`);
            starCountRef.on('value', (snapshot) => {
                if (snapshot.val()) {
                    this.setState({ asana: snapshot.val() });
                    this.setState({ projectsIdAsana: snapshot.val().project ? snapshot.val().project : null })
                    this.setState({ sectionsAsana: snapshot.val().section ? snapshot.val().section : null })
                    axios.post(`https://cors-anywhere.herokuapp.com/https://app.asana.com/-/oauth_token`, null, {
                        params: {
                            grant_type: 'refresh_token',
                            client_id: clientIdAsana, 'client_secret': clientSecrectAsana,
                            redirect_uri: window.location.origin, code: snapshot.val().code, 'refresh_token': snapshot.val().rToken
                        }
                    }).then(res => {
                        console.log(res);
                        this.setState({ asana: { ...this.state.asana, token: res.data.access_token } });
                        this.renderConsultasAsana('projects');
                    }
                    ).catch(err => { this.setState({ asana: null }); })

                }
                else {
                    this.setState({ asana: null });
                }

            });
        }
        else if (pantalla === 'trello') {
            const starCountRef = this.componentDatabase('get', `Usuario-Trello/${this.props.usuarioDetail.idUsuario}`);
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
            const starCountRef = this.componentDatabase('get', `empresa/${this.props.usuarioDetail.usuario.empresa}`);
            starCountRef.on('value', (snapshot) => {
                this.setState({ empresa: snapshot.val().industria })
            });

            if (this.props.usuarioDetail.rol === '2') {
                const starCountRef2 = this.componentDatabase('get', `Equipo-Esfuerzo/${this.props.usuarioDetail.usuario.equipo}`);
                starCountRef2.on('value', (snapshot) => {
                    if (snapshot.val())
                        this.setState({ nivelEquipo: snapshot.val() })
                });
            }
        }
    }

    loadFormalario() {

    }

    render() {

        if (!this.props.usuarioDetail)
            return <div></div>;

        if (this.props.usuarioDetail && this.props.usuarioDetail.usuario && !this.state.entro)
            this.renderCargar();
        let tamano = '45em';
        if (this.props.usuarioDetail.rol === '2')
            tamano = '46em';
        if (this.state.open === 'slack') {
            tamano = '32em';
        }
        else if (this.state.open === 'drive')
            tamano = '12em';
        else if (this.state.open === 'calendar')
            tamano = '13em';
        else if (this.state.open === 'asana') {
            tamano = '10em';
            if (this.state.asana)
                tamano = '20em';
        }
        else if (this.state.open === 'sheet')
            tamano = '10em';
        else if (this.state.open === 'clickup')
            tamano = '10em';
        else if (this.state.open === 'trello') {
            tamano = '10em';

            if (this.state.trelloApi && this.state.tokenTrello)
                tamano = '28em';
        }



        return (
            <div className="ui form">
                <div className="column sixteen wide" style={{ height: '2.5em' }}>
                    <div>
                        <Image alt='sincroniza slack' src={slack} onClick={() => { this.state.open === 'slack' ? this.setState({ open: null }) : this.setState({ open: 'slack' }); this.setState({ activo: false }); this.renderCargar('slack'); }} circular size="mini" style={{ filter: 'grayscale(' + this.state.slackIn + ')', background: this.state.open === 'slack' ? 'rgb(222, 181, 243)' : '#f7f7e3', left: '13%', position: 'absolute', top: '-1.2em' }} />
                    </div>
                    <div>
                        <Image alt='sincroniza drive' src={drive} onClick={() => { this.state.open === 'drive' ? this.setState({ open: null }) : this.setState({ open: 'drive' }); this.renderCargar('drive'); }} circular size="mini" style={{ filter: 'grayscale(' + this.state.driveIn + ')', background: this.state.open === 'drive' ? 'rgb(222, 181, 243)' : '#f7f7e3', left: '28%', position: 'absolute', top: '-1em' }} />
                    </div>
                    <div>
                        <Image alt='sincroniza calendar' src={calendar} onClick={() => { this.state.open === 'calendar' ? this.setState({ open: null }) : this.setState({ open: 'calendar' }); this.renderCargar('calendar'); }} circular size="mini" style={{ filter: 'grayscale(' + this.state.calendarIn + ')', background: this.state.open === 'calendar' ? 'rgb(222, 181, 243)' : '#f7f7e3', left: '45%', position: 'absolute', top: '-1em' }} />
                    </div>
                    <div>
                        <Image alt='sincroniza asana' src={asana} onClick={() => { this.state.open === 'asana' ? this.setState({ open: null }) : this.setState({ open: 'asana' }); this.renderCargar('asana'); }} circular size="mini" style={{ filter: 'grayscale(' + this.state.asanaIn + ')', background: this.state.open === 'trello' ? 'rgb(222, 181, 243)' : '#f7f7e3', left: '60%', top: '-1em', position: 'absolute' }} />
                    </div>
                </div>
                <div className="column sixteen wide" style={{ height: '4em' }}>
                    <div>
                        <Image alt='sincroniza trello' src={trelloImg} onClick={() => { this.state.open === 'trello' ? this.setState({ open: null }) : this.setState({ open: 'trello' }); this.renderCargar('trello'); }} circular size="mini" style={{ filter: 'grayscale(' + this.state.trelloIn + ')', background: this.state.open === 'trello' ? 'rgb(222, 181, 243)' : '#f7f7e3', left: '28%', position: 'absolute' }} />
                    </div>
                    <div>
                        <Image alt='sincroniza clickup' src={clickup} onClick={() => { this.state.open === 'clickup' ? this.setState({ open: null }) : this.setState({ open: 'clickup' }); this.renderCargar('clickup'); }} circular size="mini" style={{ filter: 'grayscale(1)', background: this.state.open === 'trello' ? 'rgb(222, 181, 243)' : '#f7f7e3', left: '45%', position: 'absolute' }} />
                    </div>
                </div>
                <div className="column sixteen wide">
                    <div className="ui segment" style={{ height: tamano, background: 'linear-gradient(to top, #e0399738 0.5%, rgb(255, 255, 255) 0.6%, rgba(245, 242, 224, 0) 200%)' }}>
                        {this.renderForm()}
                    </div>
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
        mensajeAsana: state.chatReducer.mensajeAsana,
    };
};


export default connect(mapStateToProps, { chatOn, chatOff, mensajeAsanas, popupBot })(Profile);