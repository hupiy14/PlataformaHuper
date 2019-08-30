import React from 'react';
import { Button, Form, Icon, Modal, Segment, Dimmer, Loader, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { nuevoUsuarios, detailUsNews } from '../../components/modules/chatBot/actions';
import { slackApis } from '../../actions/index';
import { signOut, usuarioDetails } from '../../actions';
import history from '../../history';
import firebase from 'firebase';
import axios from 'axios';
import moment from 'moment';

class FomrularioGlobal extends React.Component {

    state = { errorTipo: null, tipo: null, formError: null, momento: null, errorCodigo: null, codigo: null, errorAcepto: null, acepto: null, open: true, calendar: null, id: null }

    componentDidMount() {
        this.renderDriveCarpeta();
        const client = "482555533539.532672221010";
        const clientSecret = "18c94d458dbe66c7f7fc0d3f2684e63f";
        const code = this.props.detailUsNew.codeSlack;
        this.setState({ id: this.props.usuarioDetail.usuarioNuevo.id })
        axios.get(`https://slack.com/api/oauth.access?client_id=${client}&redirect_uri=https://app.hupity.com&client_secret=${clientSecret}&code=${code}`)
            .then((res, tres) => {
                if (res.data.bot)
                    this.props.detailUsNews({ ...this.props.detailUsNew, tokenSlack: res.data.access_token, tokenBot: res.data.bot.bot_access_token, userSlack: res.data.user_id });
            });
    }

    renderDriveCarpeta() {
        if (window.gapi.client) {
            window.gapi.client.drive.files.create({
                name: "Hupity",
                mimeType: 'application/vnd.google-apps.folder',
                //fields: 'id'
            }).then((response) => {
                //devuelve lo de la carpeta
                this.props.detailUsNews({ ...this.props.detailUsNew, codigoWSdrive: response.result.id });
                // this.RelacionarCarpetaObjetivo(this.state.updates, response.result.id);
            },
                function (err) { console.error("Execute error", err); });
        }
    }

    ingreso = () => {
        let error = false;
        if (this.props.detailUsNew.acepto === false) {
            this.setState({ errorAcepto: true });
            error = true;
        }
        else {
            this.setState({ errorAcepto: false });
        }

        this.setState({ formError: error });

        if (!error) {
            const starCountRef = firebase.database().ref().child(`Codigo-Acceso/${this.props.detailUsNew.codigo}`);
            starCountRef.on('value', (snapshot) => {
                const cod = snapshot.val();
                if (cod) {
                    this.close();
                    this.renderCrearUsuario(cod);
                    return;
                }
            });
        }

    }

    crearCalendario = () => {
        //Carga la otra configurcion de gmail
        if (window.gapi.client.calendar) {
            window.gapi.client.calendar.calendars.insert({
                "resource": {
                    "summary": "hupity"
                }
            })
                .then((response) => {
                    // alert(response.result.id);
                    // Handle the results here (response.result has the parsed body).
                    this.setState({ calendar: response.result.id })
                    //calendario google
                    //  console.log(response.result);
                    firebase.database().ref(`Usuario-CalendarGoogle/${this.state.id}`).set({
                        idCalendar: response.result.id,
                        estado: 'activo',
                    });
                },
                    function (err) { console.error("Execute error", err); });
        }
    }

    renderCrearUsuario(cod) {
        window.gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
            .then(() => {
                this.crearCalendario();
            },
                function (err) { console.error("Error loading GAPI client for API", err); });

        const keyEquipoEmp = firebase.database().ref().child('Empresa-Equipo').push().key;
        const keyEmpresa = firebase.database().ref().child('empresa').push().key;
        //Crea una nueva empresa
        firebase.database().ref(`empresa/${keyEmpresa}`).set({
            empresa: this.props.detailUsNew.empresa,
            industria: this.props.detailUsNew.sector,
            nEquipos: 1
        });

        //Crea una nueva empresa
        firebase.database().ref(`Empresa-Equipo/${keyEmpresa}/${keyEquipoEmp}`).set({
            empresa: this.props.detailUsNew.empresa,
            cargo: this.props.detailUsNew.cargo,
            nombreTeam: this.props.detailUsNew.equipo,
        });

        //crea el espacio de trabajo
        if (this.props.detailUsNew.codigoWSdrive) {
            firebase.database().ref(`Usuario-WS/${keyEmpresa}/${keyEquipoEmp}/${this.state.id}`).set({
                fechaCreado: new Date().toString(),
                linkWs: this.props.detailUsNew.codigoWSdrive,
                usuarioSlack: this.props.detailUsNew.userSlack,
                usuario: this.props.detailUsNew.nombreUsuario,
            });
        }
        //crea el usuario slack
        firebase.database().ref(`Usuario-Slack/${this.state.id}`).set({
            tokenP: this.props.detailUsNew.tokenSlack,
            tokenB: this.props.detailUsNew.tokenBot,
            usuarioSlack: this.props.detailUsNew.userSlack,
            fechaCreado: new Date().toString(),
        });

        //crear usuario perfil
        if (this.props.detailUsNew.tipo === 'Huper') {
            firebase.database().ref(`Usuario-Perfil/1/${this.state.id}`).set({
                estado: 'activo',
            });
            //crear usuario rol
            firebase.database().ref(`Usuario-Rol/${this.state.id}`).set({
                Rol: '3',
            });
        }
        else if (this.props.detailUsNew.tipo === 'Gestor') {
            firebase.database().ref(`Usuario-Perfil/3/${this.state.id}`).set({
                estado: 'activo',
            });
            //crear usuario rol
            firebase.database().ref(`Usuario-Rol/${this.state.id}`).set({
                Rol: '2',
            });
        }

        //crear empresa- usuario
        firebase.database().ref(`empresa-Usuario/${keyEmpresa}/${this.state.id}`).set({
            estado: 'activo',
        });

        //crea usuario
        firebase.database().ref(`Usuario/${this.state.id}`).set({
            area: this.props.detailUsNew.area,
            cargo: this.props.detailUsNew.cargo,
            canalSlack: this.props.detailUsNew.userSlack,
            email: this.props.usuarioDetail.usuarioNuevo.correo,
            empresa: keyEmpresa,
            equipo: keyEquipoEmp,
            usuario: this.props.detailUsNew.nombreUsuario,
            wsCompartida: this.props.detailUsNew.codigoWSdrive ? this.props.detailUsNew.codigoWSdrive : null,
            fechaCreado: new Date().toString(),
            codigo: this.props.detailUsNew.codigo,
            estado: 'activo',
            onboarding: false,
        });

        // gener  la primera formacion 
        firebase.database().ref(`Usuario-Formcion/${this.state.id}/-LYWrWd_8M174-vlIkwv`).set({
            fecha: new Date().toString(),
            concepto: "El método de la Caja de Eisenhower para impulsar tu productividad",
            detalle: "Aprende a diferencias tus actividades urgentes de las importantes",
            estado: 'activo',
            link: "mfN_JVLHlbQ",
        });

        cod.estado = 'usado';
        cod.usuarios = cod.usuarios + 1;

        firebase.database().ref(`Codigo-Acceso/${this.props.detailUsNew.codigo}`).set({
            ...cod,
            fechaUso: moment().format('YYYY-MM-DD'),
        })

        firebase.database().ref(`Usuario-CodeTemporal/${this.state.id}`).remove();
        firebase.database().ref(`Usuario-Temporal/${this.state.id}`).remove();
        history.push('/');

    }

    cancelar = () => {
        this.close();
        this.props.signOut();
        this.props.nuevoUsuarios(false);
        history.push('/');
    }

    close = () => this.setState({ open: false })
    render() {
        const { open2, open3, open4 } = this.state
        if (this.props.slackApi)
            console.log(this.props.slackApi);
        let propiedad;
        let activado = false;
        if (this.state.tipo === 'Gestor') {
            propiedad = this.handleAddition;
            activado = true;
        }

        return (
            <Modal size='tiny' open={this.state.open} >
                <Modal.Header>Bienvenido a hupity</Modal.Header>
                <Modal.Content image>
                    <div className="ui form" >
                        <div className="ui grid">
                            <Modal.Description style={{ width: '38em' }}>
                                <Form error={this.state.formError}>

                                    <Form.Checkbox label='Esta de acuedo con los terminos y condiciones'
                                        error={this.state.errorAcepto}
                                        value={this.props.detailUsNew ? this.props.detailUsNew.acepto : null}
                                        onChange={(e, { checked }) => this.props.detailUsNews({ ...this.props.detailUsNew, acepto: checked })}
                                    />

                                    <Message
                                        error
                                        header={this.state.mensajeCodigo ? this.state.mensajeCodigo.titulo : 'Falta campos por llenar'}
                                        content={this.state.mensajeCodigo ? this.state.mensajeCodigo.detalle : 'Debes diligenciar todos los campos'}
                                    />
                                </Form>
                            </Modal.Description>
                        </div></div>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='grey' onClick={this.cancelar}>
                        Cancelar
                     </Button>
                    <Button
                        style={{ background: 'linear-gradient(to right, #fce64d -30%, rgb(255, 106, 0)100%)' }}
                        icon='arrow right'
                        labelPosition='right'
                        content="Comenzar"
                        onClick={this.ingreso}
                        disabled=
                        {
                            this.props.usuarioDetail && !this.props.detailUsNew.acepto
                        }
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        usuarioDetail: state.chatReducer.usuarioDetail,
        isSignedIn: state.auth.isSignedIn,
        detailUsNew: state.chatReducer.detailUsNew,
        nuevoUsuario: state.chatReducer.nuevoUsuario,
        slackApi: state.auth.slackApi,
    };
};

export default connect(mapStateToProps, { nuevoUsuarios, signOut, usuarioDetails, slackApis, detailUsNews })(FomrularioGlobal);