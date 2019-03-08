import React from 'react';
import { connect } from 'react-redux';
import '../components/styles/ingresoHupity.css';
import { chatOn, chatOff } from '../actions';
import { Card, Icon, Image, Button, Form, Message, Segment, Dimmer, Loader, Modal, Header, Input } from 'semantic-ui-react'
import history from '../history';
import firebase from 'firebase';
import zonaEspana from '../components/utilidades/zonaEspana';

var Trello = require("trello");
var trello = new Trello("bb3cab1a303c7bf996d56bb46db2a46f", "136434ae14c54519e4af94ed7f48ec43d710e777bb1bbe0b06cdda6368f1d44e");



///pantalla de  perfil del usuario
//limpiar variables

class Profile extends React.Component {

    state = {
        open: null, listaEmpresas: {}, formError: false, openImagen: false, entro: false, mensajeCodigo: null,
        tipo: null, empresa: null, nombreUsuario: null, cargo: null, listaEquipos: {}, area: null, lugar: null, telefono: null, equipo: null, codigo: null, acepto: null,
        errorTipo: null, errorNombreUsuario: null, errorCargo: null, errorArea: null, errorTelefono: null, errorLugar: null, errorEmpresa: null, errorEquipo: null, errorCodigo: null, errorAcepto: null, calendar: null,
        codigoUsSlack: null, tokenUsSlack: null, tokenBotUsSlack: null, canalGestorSlack: null, canalEquipoSlack: null, canalReportesSlack: null, canalNotifiacionesSlack: null,
        codigoWSdrive: null, activo: false,


        trelloApi: null, tokenTrello: null, listaObjetivostoDO: null, listaOBjetivosDone: null, listaObjetivosTheEnd: null, imagenMostrar: null, imagenFondo: null, imagenPerfil: null,
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
        let lista = {};
        const opciones = Object.keys(listaX).map(function (key, index) {
            lista = { ...lista, key: key, text: listaX[key], value: listaX[key] };
            return lista;
        });
        return opciones;


    }

    renderUsuarioSlack() {
        let visible = false;
        if (this.props.userRol === '3')
            visible = true;
        return (
            <div>
                <Form >
                    <Form.Input label='Codigo de Usuario Slack' placeholder='UEA8D0S...'
                        value={this.state.codigoUsSlack}
                        onChange={e => this.setState({ codigoUsSlack: e.target.value })}
                    />
                    <Form.Input label='Token Usuario Slack' placeholder='xoxp-482555533539-486285033681...'
                        value={this.state.tokenUsSlack}
                        onChange={e => this.setState({ tokenUsSlack: e.target.value })}
                    />
                    <Form.Input label='Token bot Usuario Slack' placeholder='xoxb-482555533539-532878166725...'
                        value={this.state.tokenBotUsSlack}
                        onChange={e => this.setState({ tokenBotUsSlack: e.target.value })}
                    />
                    <Form.Input label='Canal del Gestor' placeholder='CE61KKZ...'
                        value={this.state.canalGestorSlack}
                        onChange={e => this.setState({ canalGestorSlack: e.target.value })}
                        disabled={visible}
                    />
                    <h3>Añade otros canales que uses </h3>
                    <Form.Input label='Canal del Equipo' placeholder='CE61KKZ...'
                        value={this.state.canalEquipoSlack}
                        onChange={e => this.setState({ canalEquipoSlack: e.target.value })}
                    />
                    <Form.Input label='Canal del Reportes' placeholder='CE61KKZ...'
                        value={this.state.canalReportesSlack}
                        onChange={e => this.setState({ canalReportesSlack: e.target.value })}
                    />
                    <Form.Input label='Canal del Notificaciones' placeholder='CE61KKZ...'
                        value={this.state.canalNotifiacionesSlack}
                        onChange={e => this.setState({ canalNotifiacionesSlack: e.target.value })}
                    />

                </Form>
                <br />
                <Button color="yellow" icon='save' disabled={this.state.activo} style={{ left: '45%' }} labelPosition='right' content='Guardar' onClick={() => { this.renderGuardar() }} />
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
                <Button color="yellow" icon='save' disabled={this.state.activo} style={{ left: '45%' }} labelPosition='right' content='Guardar' onClick={() => { this.renderGuardar() }} />
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
                        value={this.state.calendar}
                        onChange={e => this.setState({ calendar: e.target.value })}
                    />
                </Form >
                <br />
                <Button color="yellow" icon='save' disabled={this.state.activo} style={{ left: '45%' }} labelPosition='right' content='Guardar' onClick={() => { this.renderGuardar() }} />
            </div>

        );
    }

    renderTrello() {
        //https://www.npmjs.com/package/trello
        let visible = true;
        if (this.props.userRol === '3')
            visible = false;

        console.log(trello.getCardsOnList('5c7cd5acc6508624e93549d6'));
        return (
            <div>
                <Form >
                    <Form.Input label='Trello Api Key' placeholder='bb3cab1a303c7bf996d5...'
                        value={this.state.trelloApi}
                        onChange={e => this.setState({ trelloApi: e.target.value })}
                    />
                    <Form.Input label='Token Trello' placeholder='136434ae14c54519e4af94ed...'
                        value={this.state.tokenTrello}
                        onChange={e => this.setState({ tokenTrello: e.target.value })}
                    />
                    <Form.Input label='Lista Objetivos por trabajar' placeholder='136434ae14c54519e4af94ed...'
                        value={this.state.listaObjetivostoDO}
                        onChange={e => this.setState({ listaObjetivostoDO: e.target.value })}
                    />
                    <Form.Input label='Lista objetivos terminados' placeholder='136434ae14c54519e4af94ed...'
                        value={this.state.listaOBjetivosDone}
                        onChange={e => this.setState({ listaOBjetivosDone: e.target.value })}
                    />
                    <h3>Si eres gestor agrega lo siguiente: </h3>
                    <Form.Input label='Lista Objetivos validados' placeholder='136434ae14c54519e4af94ed...'
                        value={this.state.listaObjetivosTheEnd}
                        onChange={e => this.setState({ listaObjetivosTheEnd: e.target.value })}
                        disabled={visible}
                    />

                </Form>
                <br />
                <Button color="yellow" icon='save' disabled={this.state.activo} style={{ left: '45%' }} labelPosition='right' content='Guardar' onClick={() => { this.renderGuardar() }} />
            </div>

        );
    }

    renderUsuario() {

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

                    <Form.Input label='Teléfono' placeholder='¿Dondé te podemos contactar? '
                        value={this.state.telefono}
                        onChange={e => this.setState({ telefono: e.target.value })}
                        error={this.state.errorTelefono}
                    />

                    <Form.Select label='Lugar de residencia' options={this.renderOpcionesZona()} placeholder='En que lugar vives?'
                        search
                        onChange={(e, { value }) => this.setState({ lugar: value })}
                        value={this.state.lugar}
                        error={this.state.errorLugar}
                    />



                    <Message
                        error
                        header='Falta campos por llenar'
                        content='Debes diligenciar todos los campos'
                    />
                </Form>

                <Button color="yellow" icon='save' disabled={this.state.activo} style={{ left: '45%' }} labelPosition='right' content='Guardar' onClick={() => { this.renderGuardar() }} />
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
            firebase.database().ref(`Usuario-Slack/${this.props.usuarioDetail.idUsuario}`).set({
                usuarioSlack: this.state.codigoUsSlack,
                token: this.state.tokenUsSlack,
                tokenB: this.state.tokenBotUsSlack,
                gestor: this.state.canalGestorSlack,
                notifiacaiones: this.state.canalNotifiacionesSlack,
                reporting: this.state.canalReportesSlack,
                equipo: this.state.canalEquipoSlack,
            });
        }
        else if (this.state.open === 'drive') {
            firebase.database().ref(`Usuario-WS/${this.props.usuarioDetail.usuario.empresa}/${this.props.usuarioDetail.usuario.equipo}/${this.props.usuarioDetail.idUsuario}`).set({
                linkWs: this.state.codigoWSdrive,
                fechaCreado: new Date(),
            });

        }

        else if (this.state.open === 'calendar') {
            firebase.database().ref(`Usuario-CalendarGoogle/${this.props.usuarioDetail.idUsuario}`).set({
                calendar: this.state.calendar,
                fechaCreado: new Date(),
            });
        }
        else if (this.state.open === 'trello') {
            firebase.database().ref(`Usuario-Trello/${this.props.usuarioDetail.idUsuario}`).set({

                trelloApi: this.state.trelloApi,
                tokenTrello: this.state.tokenTrello,
                listaObjetivostoDO: this.state.listaObjetivostoDO,
                listaOBjetivosDone: this.statlistaOBjetivosDone,
                listaObjetivosTheEnd: this.state.listaObjetivosTheEnd,

            });
        }
        else {
            firebase.database().ref(`Usuario/${this.props.usuarioDetail.idUsuario}`).set({
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
                    this.setState({ tokenUsSlack: snapshot.val().token ? snapshot.val().token : '' });
                    this.setState({ tokenBotUsSlack: snapshot.val().tokenB ? snapshot.val().tokenB : '' });
                    this.setState({ canalGestorSlack: snapshot.val().gestor ? snapshot.val().gestor : null });
                    this.setState({ canalNotifiacionesSlack: snapshot.val().notifiacaiones ? snapshot.val().notifiacaiones : '' });
                    this.setState({ canalReportesSlack: snapshot.val().reporting ? snapshot.val().reporting : '' });
                    this.setState({ canalEquipoSlack: snapshot.val().equipo ? snapshot.val().equipo : '' });
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

            });
        }

        else if (pantalla === 'calendar') {
            const starCountRef = firebase.database().ref().child(`Usuario-CalendarGoogle/${this.props.usuarioDetail.idUsuario}`);
            starCountRef.on('value', (snapshot) => {
                if (snapshot.val()) {
                    this.setState({ calendar: snapshot.val().calendar ? snapshot.val().calendar : '' });
                }
                else {
                    this.setState({ calendar: '' });
                }

            });
        }
        else if (pantalla === 'trello') {

            const starCountRef = firebase.database().ref().child(`Usuario-Trello/${this.props.usuarioDetail.idUsuario}`);
            starCountRef.on('value', (snapshot) => {
                if (snapshot.val()) {
                    this.setState({ trelloApi: snapshot.val().trelloApi ? snapshot.val().trelloApi : '' });
                    this.setState({ tokenTrello: snapshot.val().tokenTrello ? snapshot.val().tokenTrello : '' });
                    this.setState({ listaObjetivostoDO: snapshot.val().listaObjetivostoDO ? snapshot.val().listaObjetivostoDO : '' });
                    this.setState({ listaOBjetivosDone: snapshot.val().listaOBjetivosDone ? snapshot.val().listaOBjetivosDone : '' });
                    this.setState({ listaObjetivosTheEnd: snapshot.val().listaObjetivosTheEnd ? snapshot.val().listaObjetivosTheEnd : '' });
                }
                else {
                    this.setState({ trelloApi: '' });
                    this.setState({ tokenTrello: '' });
                    this.setState({ listaObjetivostoDO: '' });
                    this.setState({ listaOBjetivosDone: '' });
                    this.setState({ listaObjetivosTheEnd: '' });
                }

            });

        }
        else {
            this.setState({ entro: true });
            this.setState({ nombreUsuario: this.props.usuarioDetail.usuario.usuario });
            // this.setState({ empresa: this.props.usuarioDetail.usuario.empresa });
            this.setState({ cargo: this.props.usuarioDetail.usuario.cargo });
            this.setState({ area: this.props.usuarioDetail.usuario.area });
            this.setState({ imagenFondo: this.props.usuarioDetail.usuario.imagenFondo ? this.props.usuarioDetail.usuario.imagenFondo : null });
            this.setState({ imagenPerfil: this.props.usuarioDetail.usuario.imagenPerfil ? this.props.usuarioDetail.usuario.imagenPerfil : null });
            this.setState({ telefono: this.props.usuarioDetail.usuario.telefono ? this.props.usuarioDetail.usuario.telefono : null });
            this.setState({ lugar: this.props.usuarioDetail.usuario.lugar ? this.props.usuarioDetail.usuario.lugar : null });

            const starCountRef = firebase.database().ref().child(`empresa/${this.props.usuarioDetail.usuario.empresa}`);
            starCountRef.on('value', (snapshot) => {
                this.setState({ empresa: snapshot.val().industria })
            });

        }
    }

    render() {



        if (this.props.usuarioDetail && this.props.usuarioDetail.usuario && !this.state.entro)
            this.renderCargar();

        let tamano = '37em';
        if (this.state.open === 'slack') {
            tamano = '47em';
        }
        else if (this.state.open === 'drive')
            tamano = '10em';
        else if (this.state.open === 'calendar')
            tamano = '10em';
        else if (this.state.open === 'trello')
            tamano = '35em';



        return (
            <div className="ui form">
                <div className="two column stackable ui grid">
                    <div className="column five wide">
                        <Card>
                            <Image src={this.state.imagenFondo ? this.state.imagenFondo : 'https://cdn.pixabay.com/photo/2016/08/09/21/54/yellowstone-national-park-1581879_960_720.jpg'} onClick={() => { this.setState({ open: null }); this.renderCambiarImagenPerfil(); }} />
                            <Card.Content style={{ height: '250px' }}>
                                <Image src={this.state.imagenPerfil ? this.state.imagenPerfil : 'https://files.informabtl.com/uploads/2015/08/perfil.jpg'} onClick={() => { this.setState({ open: null }); this.renderCambiarImagenPerfil(); }} circular size="small" style={{ left: '21%', position: 'relative', top: '-80px' }} />
                                <Card.Header style={{ top: '-65px', position: 'relative', 'padding-left': '35%' }}>Matthew</Card.Header>
                                <Card.Meta style={{ top: '-65px', position: 'relative', 'padding-left': '30%' }}>
                                    <span className='date'>Joined in 2015</span>
                                </Card.Meta>
                                <Card.Description style={{ top: '-65px', position: 'relative', 'padding-left': '5%' }}>Matthew is a musician living in Nashville.</Card.Description>
                                <Image src='https://cdn.icon-icons.com/icons2/923/PNG/512/slack_alt_icon-icons.com_72013.png' onClick={() => { this.state.open === 'slack' ? this.setState({ open: null }) : this.setState({ open: 'slack' }); this.renderCargar('slack'); }} circular size="mini" style={{ background: this.state.open === 'slack' ? 'rgb(222, 181, 243)' : '#f7f7e3', left: '5%', position: 'relative', top: '-50px' }} />
                                <Image src='https://cdn.icon-icons.com/icons2/1011/PNG/512/Google_Drive_icon-icons.com_75713.png' onClick={() => { this.state.open === 'drive' ? this.setState({ open: null }) : this.setState({ open: 'drive' }); this.renderCargar('drive'); }} circular size="mini" style={{ background: this.state.open === 'drive' ? 'rgb(222, 181, 243)' : '#f7f7e3', left: '15%', position: 'relative', top: '-50px' }} />
                                <Image src='https://cdn.icon-icons.com/icons2/220/PNG/512/google_calendar_25497.png' onClick={() => { this.state.open === 'calendar' ? this.setState({ open: null }) : this.setState({ open: 'calendar' }); this.renderCargar('calendar'); }} circular size="mini" style={{ background: this.state.open === 'calendar' ? 'rgb(222, 181, 243)' : '#f7f7e3', left: '25%', position: 'relative', top: '-50px' }} />
                                <Image src='https://cdn.icon-icons.com/icons2/836/PNG/512/Trello_icon-icons.com_66775.png' onClick={() => { this.state.open === 'trello' ? this.setState({ open: null }) : this.setState({ open: 'trello' }); this.renderCargar('trello'); }} circular size="mini" style={{ background: this.state.open === 'trello' ? 'rgb(222, 181, 243)' : '#f7f7e3', left: '35%', position: 'relative', top: '-50px' }} />


                            </Card.Content>

                        </Card>

                    </div>
                    <div className="column eleven wide">
                        <div className="ui segment" style={{ height: tamano, top: '1.5em' }}>
                            <Modal open={this.state.openImagen}
                                closeOnEscape={false}
                                closeOnDimmerClick={true}
                                onClose={this.state.close}
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
                                <Modal.Actions>
                                    <Button onClick={this.close} negative>
                                        Cancelar
                                      </Button>
                                    <Button
                                        onClick={() => { this.close(); this.renderGuardar(); }}
                                        positive
                                        labelPosition='right'
                                        icon='checkmark'
                                        content='Guardar'
                                    />
                                </Modal.Actions>

                            </Modal>
                            {this.renderForm()}
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}
const mapStateToProps = (state) => {
    return {
        usuarioDetail: state.chatReducer.usuarioDetail,
        isSignedIn: state.auth.isSignedIn,
        isChat: state.chatReducer.isChat,
        userRol: state.chatReducer.userRol,
    };
};


export default connect(mapStateToProps, { chatOn, chatOff })(Profile);