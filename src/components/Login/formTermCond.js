/**Formulario de aceptar terminos y condiciones de la plataforma, 
 * recupera token slack y guarda el nuevo usuario */
import React from 'react';
import { Button, Form, Modal, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { nuevoUsuarios, detailUsNews } from '../modules/chatBot/actions';
import { signOut, popupBot } from '../../actions';
import history from '../../history';
import firebase from 'firebase';
import axios from 'axios';
import moment from 'moment';
import { dataBaseManager } from '../../lib/utils';

const timeoutLength = 1500;
class FomrularioGlobal extends React.Component {

    state = {
        formError: null, codigo: null, errorAcepto: null, prueba: null,
        acepto: null, open: true, calendar: null, id: null, cod: null,
        mensajeCodigo: { titulo: 'Falta campos por llenar', detalle: 'Debes diligenciar todos los campos' }
    }

    componentDidMount() {
        if (!this.props.usuarioDetail) {
            history.push('/');
            return;
        }
        this.renderDriveCarpeta();
        //recuperar datos slack
        const client = "482555533539.532672221010";
        const clientSecret = "18c94d458dbe66c7f7fc0d3f2684e63f";
        const code = this.props.detailUsNew.codeSlack;
        this.setState({ id: this.props.usuarioDetail.usuarioNuevo.id })
        axios.get(`https://slack.com/api/oauth.access?client_id=${client}&redirect_uri=https://app.hupity.com&client_secret=${clientSecret}&code=${code}`)
            .then((res, tres) => {
                if (res.data.bot)
                    this.props.detailUsNews({ ...this.props.detailUsNew, tokenSlack: res.data.access_token, tokenBot: res.data.bot.bot_access_token, userSlack: res.data.user_id });
            });

        const starCountRef = firebase.database().ref().child(`Codigo-Acceso/${this.props.detailUsNew.codigo}`);
        starCountRef.on('value', (snapshot) => {
            const cod = snapshot.val();
            if (cod && this.state.prueba == null) {
                this.setState({ prueba: cod.usuarios + 1 });
                this.setState({ cod });

            }
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
            },
                function (err) { console.error("Execute error", err); });
        }
    }

    componentDatabase(tipo, path, objectIn, mensaje, mensajeError) {
        let men = dataBaseManager(tipo, path, objectIn, mensaje, mensajeError);
        if (men && men.mensaje)
            this.props.popupBot({ mensaje: men.mensaje });
        return men;
    }

    ingreso = () => {
        let error = false;
        if (this.props.detailUsNew.acepto === false) {
            this.setState({ errorAcepto: true });
            error = true;
        }
        else
            this.setState({ errorAcepto: false });

        this.setState({ formError: error });

        if (!error) {
            if (this.state.cod && this.state.prueba != null) {
                this.setState({ prueba: true });
                this.close();

                let objectId = { email: this.props.usuarioDetail.usuarioNuevo.email, ID: this.props.usuarioDetail.usuarioNuevo.userId };
                console.log(objectId);
                alert("155555");

                this.componentDatabase("create", null, objectId);
                this.componentDatabase("login", null, objectId);
                this.renderCrearUsuario(this.state.cod, this.state.prueba);
                history.push('/');
                window.location.replace('');
               

                return;
            }
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
                    this.setState({ calendar: response.result.id })
                    //calendario google
                    firebase.database().ref(`Usuario-CalendarGoogle/${firebase.auth().currentUser.uid}`).set({
                        idCalendar: response.result.id,
                        estado: 'activo',
                    });
                },
                    function (err) { console.error("Execute error", err); });
        }
    }

    renderCrearUsuario(cod, numUs) {
        //configuracion calendar window
        window.gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
            .then(() => {
                this.crearCalendario();
            },
                function (err) { console.error("Error loading GAPI client for API", err); });

        const keyEquipoEmp = this.props.detailUsNew.rol === '3' ? firebase.database().ref().child('Empresa-Equipo').push().key : cod.kequipo;
        const keyEmpresa = this.props.detailUsNew.rol === '3' ? firebase.database().ref().child('empresa').push().key : cod.empresa;
        //Crea una nueva empresa
        console.log(this.props.detailUsNew);
        alert('nnnnnn')
        if (this.props.detailUsNew.rol === '3') {
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
            firebase.database().ref(`Usuario-Perfil/3/${firebase.auth().currentUser.uid}`).set({
                estado: 'activo',
            });
            //crear usuario rol
            firebase.database().ref(`Usuario-Rol/${firebase.auth().currentUser.uid}`).set({
                Rol: '3',
            });
        }

        //crea el espacio de trabajo

        if (this.props.detailUsNew.codigoWSdrive) {
            firebase.database().ref(`Usuario-WS/${keyEmpresa}/${keyEquipoEmp}/${firebase.auth().currentUser.uid}`).set({
                fechaCreado: new Date().toString(),
                linkWs: this.props.detailUsNew.codigoWSdrive,
                // usuarioSlack: this.props.detailUsNew.userSlack,
                usuario: this.props.detailUsNew.nombreUsuario,
            });
        }
        //crea el usuario slack
        /*
         firebase.database().ref(`Usuario-Slack/${this.state.id}`).set({
             tokenP: this.props.detailUsNew.tokenSlack,
             tokenB: this.props.detailUsNew.tokenBot,
             usuarioSlack: this.props.detailUsNew.userSlack,
             fechaCreado: new Date().toString(),
         });
 
         */

        //crear usuario perfil
        if (this.props.detailUsNew.rol === '2') {
            firebase.database().ref(`Usuario-Perfil/1/${firebase.auth().currentUser.uid}`).set({
                estado: 'activo',
            });
            //crear usuario rol

            firebase.database().ref(`Usuario-Rol/${firebase.auth().currentUser.uid}`).set({
                Rol: '2',
            });
        }

        //crear empresa- usuario
        firebase.database().ref(`empresa-Usuario/${keyEmpresa}/${firebase.auth().currentUser.uid}`).set({
            estado: 'activo',
        });

        //crea usuario
        firebase.database().ref(`Usuario/${firebase.auth().currentUser.uid}`).set({
            //    area: this.props.detailUsNew.rol === '3' ? this.props.detailUsNew.area : cod.area,
            cargo: this.props.detailUsNew.cargo,
            // canalSlack: this.props.detailUsNew.userSlack,
            email: this.props.usuarioDetail.usuarioNuevo.email,
            empresa: keyEmpresa,
            equipo: keyEquipoEmp,
            usuario: this.props.detailUsNew.nombreUsuario,
            wsCompartida: this.props.detailUsNew.codigoWSdrive ? this.props.detailUsNew.codigoWSdrive : null,
            fechaCreado: new Date().toString(),
            codigo: this.props.detailUsNew.codigo,
            estado: 'activo',
            sleep: 1500,
            id: this.props.usuarioDetail.usuarioNuevo.userId,
            onboarding: false,
        });

        // gener  la primera formacion 
        firebase.database().ref(`Usuario-Formcion/${firebase.auth().currentUser.uid}/-LYWrWd_8M174-vlIkwv`).set({
            fecha: new Date().toString(),
            concepto: "El método de la Caja de Eisenhower para impulsar tu productividad",
            detalle: "Aprende a diferencias tus actividades urgentes de las importantes",
            estado: 'activo',
            link: "mfN_JVLHlbQ",
        });
        //         area: this.props.detailUsNew.rol === '3' ? this.props.detailUsNew.area ? this.props.detailUsNew.area : "" : cod.area ? cod.area : ""


        firebase.database().ref(`Codigo-Acceso/${this.props.detailUsNew.codigo}`).set({
            ...cod,
            usuarios: numUs,
            estado: "usado",
            fechaUso: moment().format('YYYY-MM-DD'),
            kequipo: keyEquipoEmp,
            empresa: keyEmpresa,
        })

        firebase.database().ref(`Usuario-CodeTemporal/${firebase.auth().currentUser.uid}`).remove();
        firebase.database().ref(`Usuario-Temporal/${firebase.auth().currentUser.uid}`).remove();
    }

    cancelar = () => {
        this.props.signOutObj.signOut();
        this.close();
        this.props.signOut();
        this.props.nuevoUsuarios(false);
        history.push('/');
    }

    close = () => this.setState({ open: false })
    render() {

        return (
            <Modal size='tiny' open={this.state.open} >
                <Modal.Header>Queremos conocerte</Modal.Header>
                <Modal.Content >
                    <Modal.Description >
                        <Form error={this.state.formError}>
                            <Form.Input label='¿Como te llamas?' placeholder='Como te gustaría que te llamaran'
                                value={this.props.detailUsNew ? this.props.detailUsNew.nombreUsuario : null}
                                onChange={e => this.props.detailUsNews({ ...this.props.detailUsNew, nombreUsuario: e.target.value })}
                                error={this.state.errorNombreUsuario}
                            />
                            <Form.Input label='¿Que cargo tienes?' placeholder='Escribe el cargo'
                                value={this.props.detailUsNew ? this.props.detailUsNew.cargo : null}
                                onChange={e => this.props.detailUsNews({ ...this.props.detailUsNew, cargo: e.target.value })}
                                error={this.state.errorCargo}
                            />
                            <Form.Checkbox label='Esta de acuedo con los terminos y condiciones'
                                error={this.state.errorAcepto}
                                value={this.props.detailUsNew ? this.props.detailUsNew.acepto : null}
                                onChange={(e, { checked }) => this.props.detailUsNews({ ...this.props.detailUsNew, acepto: checked })}
                            />
                            <a onClick={this.clickGuardarTemporal}
                                href={`https://www.hupity.com/home/terms-and-conditions/`}>Consulta Terminos y Condiciones</a>
                            <Message
                                error
                                header={this.state.mensajeCodigo.titulo}
                                content={this.state.mensajeCodigo.detalle}
                            />
                        </Form>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button style={{ background: "#d5d6d5" }} onClick={this.cancelar}>
                        Cancelar
                     </Button>
                    <Button
                        style={{ background: '#fe10bd', color: "aliceblue" }}
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
        signOutObj: state.chatReducer.signOutObj,
        usuarioDetail: state.chatReducer.usuarioDetail,
        detailUsNew: state.chatReducer.detailUsNew,
        nuevoUsuario: state.chatReducer.nuevoUsuario,
    };
};

export default connect(mapStateToProps, { nuevoUsuarios, signOut, detailUsNews, popupBot })(FomrularioGlobal);