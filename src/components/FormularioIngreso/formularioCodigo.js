import React from 'react';
import { Button, Form, Icon, Modal, Segment, Dimmer, Loader, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { nuevoUsuarios, detailUsNews } from '../../components/modules/chatBot/actions';
import { slackApis } from '../../actions/index';
import { signOut, usuarioDetails, popupBot } from '../../actions';
import history from '../../history';
import axios from 'axios';
import moment from 'moment';
import { dataBaseManager } from '../../lib';
const timeoutLength = 3000;


class FomrularioGlobal extends React.Component {

    state = { errorTipo: null, tipo: null, formError: null, momento: null, errorCodigo: null, codigo: null, errorAcepto: null, acepto: null, open: true, calendar: null }

    componentDidMount() {
        this.renderDriveCarpeta();

        const client = "482555533539.532672221010";
        const clientSecret = "18c94d458dbe66c7f7fc0d3f2684e63f";
        const code = this.props.detailUsNew.codeSlack;
        axios.get(`https://slack.com/api/oauth.access?client_id=${client}&redirect_uri=https://app.hupity.com&client_secret=${clientSecret}&code=${code}`)
            .then((res, tres) => {
                if (res.data.bot)
                    this.props.detailUsNews({ ...this.props.detailUsNew, tokenSlack: res.data.access_token, tokenBot: res.data.bot.bot_access_token, userSlack: res.data.user_id });

            });
    }

    componentDatabase(tipo, path, objectIn, mensaje, mensajeError) {
        let men = dataBaseManager(tipo, path, objectIn, mensaje, mensajeError);
        if (men && men.mensaje)
            this.props.popupBot({ mensaje: men.mensaje });
        return men;
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


        console.log(this.props.detailUsNew);
        let error = false;
        if (this.props.detailUsNew.codigo.trim() === '') {
            this.setState({ errorCodigo: true });
            error = true;
        }
        else {
            this.setState({ errorCodigo: false });
        }

        if (this.props.detailUsNew.acepto === false) {
            this.setState({ errorAcepto: true });
            error = true;
        }
        else {
            this.setState({ errorAcepto: false });
        }


        this.setState({ formError: error });
        if (!error) {

            const starCountRef = this.componentDatabase('get', `Codigo-Acceso/${this.props.detailUsNew.codigo}`);
            starCountRef.on('value', (snapshot) => {
                const cod = snapshot.val();
                if (cod) {
                    if (cod.estado !== 'activo') {
                        //codigo usado
                        this.setState({ errorCodigo: true });
                        this.setState({ formError: true });
                        this.setState({ mensajeCodigo: { titulo: 'Codigo incorrecto', detalle: 'El codigo ya ha sido utilizado' } });

                    }
                    else {

                        this.close();
                        //this.props.signOut();
                        // this.props.nuevoUsuarios(false);
                        this.renderCrearUsuario(cod);
                        history.push('/dashboard');
                    }

                }
                else {
                    //codigo que no existe
                    this.setState({ errorCodigo: true });
                    this.setState({ formError: true });
                    this.setState({ mensajeCodigo: { titulo: 'Codigo incorrecto', detalle: 'No se tiene ninguna concidencia con el codigo escrito' } });

                }
            });
        }
    }

    handleOpen = () => {
        this.timeout = setTimeout(() => {

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
                        this.componentDatabase('insert', `Usuario-CalendarGoogle/${this.props.usuarioDetail.usuarioNuevo.id}`, {
                            idCalendar: response.result.id,
                            estado: 'activo',
                        });

                    },
                        function (err) { console.error("Execute error", err); });
            }
        }, timeoutLength)
    }

    renderCrearUsuario(cod) {

        let keyEquipo;

        window.gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
            .then(() => {

                console.log("GAPI client loaded for API");
            },
                function (err) { console.error("Error loading GAPI client for API", err); });

        this.handleOpen();
        const Empresas = this.props.detailUsNew.listaEmpresas;
        const sel = this.props.detailUsNew.empresa;

        Object.keys(Empresas).map(function (key, index) {
            if (Empresas[key].industria === sel)
                keyEquipo = key;
        });
        console.log(this.props.usuarioDetail);
        //Crea un nuevo equipo
        var newPostKey1 = this.componentDatabase('key', 'Empresa-Equipo');
        if (this.props.detailUsNew.listaEquipos.equipoNuevo && this.props.detailUsNew.listaEquipos.equipoNuevo.nombreTeam === this.props.detailUsNew.equipo) {

            this.componentDatabase('insert', `Empresa-Equipo/${keyEquipo}/${newPostKey1}`, {
                cargo: this.props.detailUsNew.cargo,
                fechaCreado: new Date().toString(),
                nombreTeam: this.props.detailUsNew.equipo,
                responsable: this.props.detailUsNew.nombreUsuario,
                idUsuario: this.props.usuarioDetail.usuarioNuevo.id,
                estado: 'activo',
            });
        }
        else {
            //Encuentra el identificador del equipo
            const Equipos = this.props.detailUsNew.listaEquipos;
            const sel = this.props.detailUsNew.equipo;
            Object.keys(Equipos).map(function (key, index) {
                if (Equipos[key].nombreTeam === sel)
                    newPostKey1 = key;
            });

        }

        //crea el espacio de trabajo
        console.log(this.props.detailUsNew);
        if (this.props.detailUsNew.codigoWSdrive) {

            this.componentDatabase('insert', `Usuario-WS/${keyEquipo}/${newPostKey1}/${this.props.usuarioDetail.usuarioNuevo.id}`, {
                fechaCreado: new Date().toString(),
                linkWs: this.props.detailUsNew.codigoWSdrive,
                usuarioSlack: this.props.detailUsNew.userSlack,
                usuario: this.props.detailUsNew.nombreUsuario,
            });
        }
        //crea el usuario slack
        //console.log(response);

        this.componentDatabase('insert', `Usuario-Slack/${this.props.usuarioDetail.usuarioNuevo.id}`, {
            tokenP: this.props.detailUsNew.tokenSlack,
            tokenB: this.props.detailUsNew.tokenBot,
            usuarioSlack: this.props.detailUsNew.userSlack,
            fechaCreado: new Date().toString(),
        });

        //crear usuario perfil
        if (this.props.detailUsNew.tipo === 'Huper') {
            this.componentDatabase('insert', `Usuario-Perfil/1/${this.props.usuarioDetail.usuarioNuevo.id}`, {
                estado: 'activo',
            });
            //crear usuario rol
            this.componentDatabase('insert', `Usuario-Rol/${this.props.usuarioDetail.usuarioNuevo.id}`, {
                Rol: '3',
            });
        }
        else if (this.props.detailUsNew.tipo === 'Gestor') {
            this.componentDatabase('insert',`Usuario-Perfil/3/${this.props.usuarioDetail.usuarioNuevo.id}`, {
                estado: 'activo',
            });
            this.componentDatabase('insert',`Usuario-Rol/${this.props.usuarioDetail.usuarioNuevo.id}`, {
                Rol: '2',
            });
            //crear usuario rol
          
        }





        //crear empresa- usuario

        this.componentDatabase('insert',`empresa-Usuario/${keyEquipo}/${this.props.usuarioDetail.usuarioNuevo.id}`, {
            estado: 'activo',
        });

        //crea usuario
        this.componentDatabase('insert',`Usuario/${this.props.usuarioDetail.usuarioNuevo.id}`, {
            area: this.props.detailUsNew.area,
            cargo: this.props.detailUsNew.cargo,
            canalSlack: this.props.detailUsNew.userSlack,
            email: this.props.usuarioDetail.usuarioNuevo.correo,
            empresa: keyEquipo,
            equipo: newPostKey1,
            usuario: this.props.detailUsNew.nombreUsuario,
            wsCompartida: this.props.detailUsNew.codigoWSdrive ? this.props.detailUsNew.codigoWSdrive : null,
            fechaCreado: new Date().toString(),
            codigo: this.props.detailUsNew.codigo,
            estado: 'activo',
        });
      

        // gener  la primera formacion 
        this.componentDatabase('insert',`Usuario-Formcion/${this.props.usuarioDetail.usuarioNuevo.id}/-LYWrWd_8M174-vlIkwv`, {
            fecha: new Date().toString(),
            concepto: "El método de la Caja de Eisenhower para impulsar tu productividad",
            detalle: "Aprende a diferencias tus actividades urgentes de las importantes",
            estado: 'activo',
            link: "mfN_JVLHlbQ",
        });
        

        cod.estado = 'usado';
        this.componentDatabase('insert',`Codigo-Acceso/${this.props.detailUsNew.codigo}`, {
            ...cod,
            fechaUso: moment().format('YYYY-MM-DD'),

        });

        this.componentDatabase('delete', `Usuario-CodeTemporal/${this.props.usuarioDetail.usuarioNuevo.id}`);
        this.componentDatabase('delete', `Usuario-Temporal/${this.props.usuarioDetail.usuarioNuevo.id}`);
    }







    cancelar = () => {
        this.close();
        this.props.signOut();
        this.props.nuevoUsuarios(false);
        history.push('/');
        //   history.push('/login');
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

                                    <Form.Input label='Codigo de acceso' fluid placeholder='Escribe el codigo de acceso dado por Hupity' error={this.state.errorCodigo}
                                        value={this.props.detailUsNew ? this.props.detailUsNew.codigo : null}
                                        onChange={(e, { value }) => this.props.detailUsNews({ ...this.props.detailUsNew, codigo: value })}
                                    />

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

                        color="purple"
                        icon='arrow right'
                        labelPosition='right'
                        content="Comenzar"
                        onClick={this.ingreso}
                        disabled=
                        {
                            this.props.usuarioDetail && (
                                !this.props.detailUsNew.codigo ||
                                !this.props.detailUsNew.acepto)
                        }
                    //  disabled={this.props.detailUsNew ? this.props.detailUsNew.tipo ? false : true : true}
                    />


                </Modal.Actions>
            </Modal>

        );
    }

}

const mapStateToProps = (state) => {
    return {
        //   usuarioDetail: state.chatReducer.usuarioDetail,
        usuarioDetail: state.chatReducer.usuarioDetail,
        isSignedIn: state.auth.isSignedIn,
        detailUsNew: state.chatReducer.detailUsNew,
        nuevoUsuario: state.chatReducer.nuevoUsuario,
        slackApi: state.auth.slackApi,
    };
};

export default connect(mapStateToProps, { nuevoUsuarios, signOut, usuarioDetails, slackApis, detailUsNews, popupBot })(FomrularioGlobal);