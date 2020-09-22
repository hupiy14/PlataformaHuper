/**Formulario de aceptar terminos y condiciones de la plataforma, 
 * recupera token slack y guarda el nuevo usuario */
import React from 'react';
import { Button, Form, Modal, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { nuevoUsuarios, detailUsNews } from '../modules/chatBot/actions';
import { signOut, popupBot } from '../../actions';
import history from '../../history';
import axios from 'axios';
import moment from 'moment';
import firebase from 'firebase';
import { dataBaseManager } from '../../lib/utils';
import { clientSlack, clientSecrectSlack } from '../../apis/stringConnection';

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
        const client = clientSlack;
        const clientSecret = clientSecrectSlack;
        const code = this.props.detailUsNew.codeSlack;
        this.setState({ id: this.props.usuarioDetail.usuarioNuevo.id })
        axios.get(`https://slack.com/api/oauth.access?client_id=${client}&redirect_uri=https://app.hupity.com&client_secret=${clientSecret}&code=${code}`)
            .then((res, tres) => {
                if (res.data.bot)
                    this.props.detailUsNews({ ...this.props.detailUsNew, tokenSlack: res.data.access_token, tokenBot: res.data.bot.bot_access_token, userSlack: res.data.user_id });
            });

        const starCountRef = this.componentDatabase('get', `Codigo-Acceso/${this.props.detailUsNew.codigo}`);
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
                this.close();

                let objectId = { email: this.props.usuarioDetail.usuarioNuevo.email, ID: this.props.usuarioDetail.usuarioNuevo.userId };
                this.componentDatabase("create", null, objectId);
                this.componentDatabase("login", null, objectId);
                firebase.auth().onAuthStateChanged((user) => {
                    if (user) {
                        this.renderCrearUsuario(this.state.cod, this.state.prueba, user.uid);
                        history.push('/');
                        window.location.replace('');
                    }
                    else {
                        this.props.popupBot({ mensaje: 'oohhh! hemos tenido un problema al registrar tu usuario.' });
                    }
                });



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
                    this.componentDatabase('insert', `Usuario-CalendarGoogle/${firebase.auth().currentUser.uid}`, {
                        idCalendar: response.result.id,
                        estado: 'activo'
                    })

                },
                    function (err) { console.error("Execute error", err); });
        }
    }

    renderCrearUsuario(cod, numUs, uid) {
        //configuracion calendar window
        window.gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
            .then(() => {
                this.crearCalendario();
            },
                function (err) { console.error("Error loading GAPI client for API", err); });

        const keyEquipoEmp = this.props.detailUsNew.rol === '2' ? this.componentDatabase('key', 'Empresa-Equipo') : cod.kequipo;
        const keyEmpresa = this.props.detailUsNew.rol === '2' ? this.componentDatabase('key', 'empresa') : cod.empresa;
        //Crea una nueva empresa
        if (this.props.detailUsNew.rol === '3') {

            this.componentDatabase('insert', `Usuario-Perfil/3/${uid}`, {
                estado: 'activo',
            });
            //crear usuario rol
            this.componentDatabase('insert', `Usuario-Rol/${uid}`, {
                Rol: '3',
            });

        }

        //crea el espacio de trabajo

        if (this.props.detailUsNew.codigoWSdrive) {

            this.componentDatabase('insert', `Usuario-WS/${keyEmpresa}/${keyEquipoEmp}/${uid}`, {
                fechaCreado: new Date().toString(),
                linkWs: this.props.detailUsNew.codigoWSdrive,
                usuario: this.props.detailUsNew.nombreUsuario,
            });

        }

        //crear usuario perfil
        if (this.props.detailUsNew.rol === '2') {

            this.componentDatabase('insert', `empresa/${keyEmpresa}`, {
                empresa: this.props.detailUsNew.empresa,
                industria: this.props.detailUsNew.sector,
                nEquipos: 1
            });

            //Crea una nueva empresa

            this.componentDatabase('insert', `Empresa-Equipo/${keyEmpresa}/${keyEquipoEmp}`, {
                empresa: this.props.detailUsNew.empresa,
                cargo: this.props.detailUsNew.cargo,
                nombreTeam: this.props.detailUsNew.equipo,
            });

            this.componentDatabase('insert', `Usuario-Perfil/1/${uid}`, {
                estado: 'activo',
            });

            //crear usuario rol
            this.componentDatabase('insert', `Usuario-Rol/${uid}`, {
               // Rol: '2',
                Rol: '3',
                RolOriginal: '2',
         
            });

        }

        //crear empresa- usuario
        this.componentDatabase('insert', `empresa-Usuario/${keyEmpresa}/${uid}`, {
            estado: 'activo',
        });

        //crea usuario
        this.componentDatabase('insert', `Usuario/${uid}`, {
            cargo: this.props.detailUsNew.cargo,
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
        this.componentDatabase('insert', `Usuario-Formcion/${uid}/-LYWrWd_8M174-vlIkwv`, {
            fecha: new Date().toString(),
            concepto: "El método de la Caja de Eisenhower para impulsar tu productividad",
            detalle: "Aprende a diferencias tus actividades urgentes de las importantes",
            estado: 'activo',
            link: "mfN_JVLHlbQ",
        });

        //         area: this.props.detailUsNew.rol === '3' ? this.props.detailUsNew.area ? this.props.detailUsNew.area : "" : cod.area ? cod.area : ""


        this.componentDatabase('insert', `Codigo-Acceso/${this.props.detailUsNew.codigo}`, {
            ...cod,
            usuarios: numUs,
            estado: "usado",
            fechaUso: moment().format('YYYY-MM-DD'),
            kequipo: keyEquipoEmp,
            empresa: keyEmpresa,
        });

        this.componentDatabase('delete', `Usuario-CodeTemporal/${uid}`)
        this.componentDatabase('delete', `Usuario-Temporal/${uid}`)
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