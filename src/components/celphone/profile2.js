import React from 'react';
import { connect } from 'react-redux';
import '../../components/styles/ingresoHupity.css';
import { chatOn, chatOff, mensajeAsanas, popupBot, changeImage } from '../../actions';
import { Image, Button, Form, Modal, Header, Input } from 'semantic-ui-react';
import history from '../../history';
import axios from 'axios';
import { clientIdAsana, clientSecrectAsana } from '../../apis/stringConnection';
import { dataBaseManager } from '../../lib/utils';
//const Asana = require('asana');
let Trello = require("trello");
let trello = null;// new Trello("bb3cab1a303c7bf996d56bb46db2a46f", "136434ae14c54519e4af94ed7f48ec43d710e777bb1bbe0b06cdda6368f1d44e");



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
        nivelEquipo: null, diaSemana: null, liscalendars: null,

        trelloIn: '100%', slackIn: '100%', driveIn: '0%', calendarIn: '100%',

        trelloApi: null, tokenTrello: null, listaObjetivostoDO: null, listaOBjetivosDone: null, listaObjetivosTheEnd: null, imagenMostrar: null, imagenFondo: null, imagenPerfil: null,
        asana: null, projectsIdAsana: null, sectionsAsana: null, collAsanaProyects: null, collsectionsAsana: null, asanaIn: 1

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
        else {

            this.setState({ open: 'asana' });
            this.renderCargar('asana');
        }
        this.props.mensajeAsanas();


    }



    componentDatabase(tipo, path, objectIn, mensaje, mensajeError) {
        let men = dataBaseManager(tipo, path, objectIn, mensaje, mensajeError);
        if (men && men.mensaje)
            this.props.popupBot({ mensaje: men.mensaje });
        return men;
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




    renderConstruccion() {
        let contruir = <Form >
            <div className="box" style={{ top: '2.2em' }}>
                <div className="loader9"></div>
                <p style={{
                    height: '3em',
                    borderRadius: '2.5em',
                    width: '14em'
                }}>Lo estamos diseñando para ti</p>
            </div >
        </Form>
        return (
            <div>
                {contruir}
            </div>

        );
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
                equipo: this.state.canalEquipoSlack,
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
                this.componentDatabase('update', `Equipo-Esfuerzo/${this.props.usuarioDetail.usuario.equipo}`, {
                    ...this.state.nivelEquipo,
                    nivel: this.state.nivelEquipo.nivel,
                });
        }
        //  this.setState({ activo: true });
    }



    renderCargar(pantalla) {
        this.setState({ activo: false });
        if (pantalla === 'slack') {
            const starCountRef =  this.componentDatabase('get', `Usuario-Slack/${this.props.usuarioDetail.idUsuario}`);
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
            const starCountRef =  this.componentDatabase('get', `Usuario-WS/${this.props.usuarioDetail.usuario.empresa}/${this.props.usuarioDetail.usuario.equipo}/${this.props.usuarioDetail.idUsuario}`);
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
        let tamano = '42em';
        if (this.props.usuarioDetail.rol === '2')
            tamano = '46em';
        if (this.state.open === 'slack') {
            tamano = '26em';
        }
        else if (this.state.open === 'drive')
            tamano = '10em';
        else if (this.state.open === 'calendar')
            tamano = '12em';
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


        this.props.changeImage(this.state.imagenFondo ? this.state.imagenFondo : 'https://cdn.pixabay.com/photo/2016/08/09/21/54/yellowstone-national-park-1581879_960_720.jpg');

        return (



            <div className="user-profile" style={{ height: '0.1em' }}>
                <h1 style={{ position: 'relative', top: '-6em', left: '5em', width: '60%', transform: 'scale(2)', font: 'inherit' }}>{this.state.nombreUsuario
                }</h1>
                <div className="user-details" style={{}}>
                    <p style={{ color: 'White', top: '4.5em', width: '13em', left: '5em', textAlign: 'center', position: 'relative' }}>{this.state.cargo}</p>
                </div>
                <Image alt='imagen perfil hupper' src={this.state.imagenPerfil ? this.state.imagenPerfil : 'https://files.informabtl.com/uploads/2015/08/perfil.jpg'} onClick={() => { this.setState({ open: null }); this.renderCambiarImagenPerfil(); }} circular size="small"
                    style={{
                        left: '-15%',
                        height: '9em',
                        width: '9em',
                        position: 'relative',
                        top: '-13em'
                    }} />
                <Button circular color="pink" style={{ position: 'relative', top: '-4.5em', left: '-48%' }} icon="image" onClick={() => { this.setState({ open: null }); this.renderCambiarImagenPerfil(); }}></Button>

                <div className="ui segment" style={{ height: tamano, top: '-1.8em', left: '34%', width: '56%', background: 'linear-gradient(to top, #e0399738 0.5%, rgb(255, 255, 255) 0.6%, rgba(245, 242, 224, 0) 200%)' }}>
                    <Modal open={this.state.openImagen}
                        closeOnEscape={false}
                        closeOnDimmerClick={true}
                        onClose={this.state.close}
                        style={{ height: '80%', overflow: 'auto' }}
                    >
                        <Modal.Header>Tu imagén</Modal.Header>
                        <Modal.Content >
                            <Image wrapped size='medium' src={

                                this.state.imagenMostrar ? this.state.imagenMostrar : 'https://react.semantic-ui.com/images/avatar/large/rachel.png'} />
                            <Modal.Description >
                                <Header>Selecciona tu fondo</Header>
                                <Input label='Url de la imagen' placeholder='https://react.semantic-ui.com/images...'
                                    onClick={() => { this.renderCargarImagen(this.state.imagenFondo); }}
                                    value={this.state.imagenFondo}
                                    onChange={(e) => { this.setState({ imagenFondo: e.target.value }); this.renderCargarImagen(e.target.value); }}>
                                </Input>
                                <Header>Selecciona tu perfil</Header>
                                <Input label='Url de la imagen' placeholder='https://react.semantic-ui.com/images...'
                                    onClick={() => { this.renderCargarImagen(this.state.imagenPerfil); }}
                                    value={this.state.imagenPerfil}
                                    onChange={(e) => { this.setState({ imagenPerfil: e.target.value }); this.renderCargarImagen(e.target.value); }}>
                                </Input>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions >
                            <Button onClick={this.close} style={{ background: "grey", left: "-1.2em" }}>
                                Cancelar
                                      </Button>

                            <button onClick={() => { this.close(); this.renderGuardar(); }} className="ui pink button inverted " style={{ left: "-0.5em" }}>
                                <i className="checkmark icon"></i>
                                Guardar
                            </button>

                        </Modal.Actions>

                    </Modal>

                </div>
            </div>

        );
    }
}
const mapStateToProps = (state) => {
    return {
        usuarioDetail: state.chatReducer.usuarioDetail,
        isSignedIn: state.auth.isSignedIn,
        imagef: state.chatReducer.imagef,
        isChat: state.chatReducer.isChat,
        mensajeAsana: state.chatReducer.mensajeAsana,
    };
};


export default connect(mapStateToProps, { changeImage, chatOn, chatOff, mensajeAsanas, popupBot })(Profile);