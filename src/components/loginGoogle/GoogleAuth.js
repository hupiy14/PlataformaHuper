import React from 'react';
import { connect } from 'react-redux';
import { signIn, signOut, nombreUsuario, usuarioDetails, chatOn, chatOff, mensajeAsanas, Singauth, popupBot } from '../../actions';
import history from '../../history';
import { nuevoUsuarios, detailUsNews } from '../../components/modules/chatBot/actions';
import '../../components/styles/ingresoHupity.css';
import firebase from 'firebase';
import axios from 'axios';
import moment from 'moment';
import { List } from 'semantic-ui-react'
import { clientIdGoogle, apiKeyGoogle } from '../../apis/stringConnection';
import { clientIdAsana, clientSecrectAsana, clientSlack, clientSecrectSlack } from '../../apis/stringConnection';
import { etapaHupper, dataBaseManager } from '../../lib/utils';


const timeoutLength = 5000;
const timeoutLength2 = 2000;
const timeoutLength3 = 2000;
class GoogleAuth extends React.Component {

    state = { selectedFile: null, loaded: 0, codigo: null, direccion: null, tokenTrello: false, uid: null }

    componentDidMount() {

        window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
                clientId: clientIdGoogle,
                apiKey: apiKeyGoogle,
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
                scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/drive"
            }).then(() => {

                this.auth = window.gapi.auth2.getAuthInstance();
                this.props.Singauth(this.auth);
                this.onAuthChange(this.auth.isSignedIn.get());
                this.auth.isSignedIn.listen(this.onAuthChange);

            });
        });
    }




    componentDatabase(tipo, path, objectIn, mensaje, mensajeError) {
        let men = dataBaseManager(tipo, path, objectIn, mensaje, mensajeError);
        console.log(men);
        if (men && men.mensaje)
            this.props.popupBot({ mensaje: men.mensaje });
        return men;
    }

    renderValidAsana = (Usuario) => {

        this.timeout = setTimeout(() => {

            const starCountRef = this.componentDatabase("get", `Usuario-CodeTemporal/${this.state.uid}`);
            let us = this.state.uid;
            starCountRef.on('value', (snapshot) => {
                const cod = snapshot.val();
                if (cod) {
                    let code = cod.code;
                    if (cod.asana) {
                        code = code.replace('%2F', '/').replace('%3A', ':');
                        axios.post(`https://cors-anywhere.herokuapp.com/https://app.asana.com/-/oauth_token`, null, {
                            params: {
                                'grant_type': 'authorization_code',
                                'client_id': clientIdAsana, 'client_secret': clientSecrectAsana,
                                'redirect_uri': window.location.origin, code
                            }
                        }).then(res => {

                            //  const starCountRef = 
                            let objectAr = {
                                token: res.data.access_token,
                                rToken: res.data.refresh_token,
                                code
                            }
                            this.componentDatabase("update", `Usuario-Asana/${this.state.uid}`, objectAr, 'Hemos actualizado correctamente tu usuario', 'default');
                            this.props.mensajeAsanas('Asana');
                            this.renderBorrarAsana(us);
                            history.push('/profile');

                        }
                        ).catch(err => console.log(err))
                    }
                    else {
                        axios.get(`https://slack.com/api/oauth.access?client_id=${clientSlack}&redirect_uri=${window.location.origin}&client_secret=${clientSecrectSlack}&code=${code}`)
                            .then((res, tres) => {
                                console.log(res);
                                if (res.data.bot) {

                                    let objectAr = {
                                        tokenSlack: res.data.access_token,
                                        tokenBot: res.data.bot.bot_access_token,
                                        userSlack: res.data.user_id
                                    }
                                    this.componentDatabase("insert", `Usuario-Slack/${this.state.uid}`, objectAr, 'Hemos actualizado correctamente tu usuario', 'default');
                                    objectAr = {
                                        userSlack: res.data.user_id
                                    }
                                    this.componentDatabase("update", `Usuario/${this.state.uid}`, objectAr, 'Hemos actualizado correctamente tu usuario', 'default');
                                    this.props.mensajeAsanas('Slack');
                                    history.push('/profile');
                                }
                            });
                    }
                }
            })
        }, timeoutLength2)
    }


    renderBorrarAsana = (Usuario) => {
        this.timeout = setTimeout(() => {
            this.componentDatabase("insert", `Usuario-CodeTemporal/${this.stateuid}`, {});
        }, timeoutLength)
    }

    validaCodigoAcc = (Usuario) => {
        this.timeout = setTimeout(() => {
            
            
            const starCountRef = this.componentDatabase("get", `Codigo-Acceso/${Usuario.codigo}`);
            starCountRef.on('value', (snapshot) => {
                const cod = snapshot.val();
                if (cod) {
                    if (cod.estado === 'usado') {
                        if (moment().diff(moment(cod.fechaUso, 'YYYY-MM-DD'), 'days') > 15) {
                            cod.estado = 'usado';
                            const us = Usuario;
                            us.estado = 'inactivo';
                            us.onboarding = true;

                            let objectAr = {
                                ...cod,
                                fechaTer: new Date().toString(),
                            }
                            this.componentDatabase("insert", `Codigo-Acceso/${Usuario.codigo}`, objectAr, 'Hemos actualizado correctamente tu usuario', 'default');
                            this.componentDatabase("insert", `Usuario/${this.state.uid}`, {us}, 'Hemos actualizado correctamente tu usuario', 'default');
                            this.auth.signOut();
                        }
                    }
                }
            })
        }, timeoutLength)
    }

    createUsuario() {
        let direccion = '/formulario';
        //   console.log(this.auth.currentUser.get().getBasicProfile().getEmail());
        let usuarioNuevo = { nombre: this.auth.currentUser.get().getBasicProfile().getName(), email: this.auth.currentUser.get().getBasicProfile().getEmail(), id: this.auth.currentUser.get().getId(), rol: '2', userId: this.auth.currentUser.get().getId() };
        this.props.usuarioDetails({ usuarioNuevo });

        const starCountRef = this.componentDatabase("get", `Usuario-Temporal/${this.state.uid}`);
        starCountRef.on('value', (snapshot) => {

            if (snapshot.val()) {
                const starCountRef2 =  this.componentDatabase("get", `Usuario-CodeTemporal/${this.state.uid}`); 
                starCountRef2.on('value', (snapshot2) => {

                    if (snapshot2.val()) {
                        this.props.detailUsNews({ ...snapshot.val(), recupero: true, codeSlack: snapshot2.val().code });
                        direccion = '/formulario/herramientas';
                        history.push(direccion);
                    }
                });
            }
            history.push(direccion);
        });
    }
    renderUsarioLogin(uid) {
        this.props.signIn(uid);
        const nameRef =  this.componentDatabase("get", `Usuario/${uid}`); 
        nameRef.on('value', (snapshot) => {
       
            const Usuario = snapshot.val();
            //invalida codigo de acceso
            let etapa = etapaHupper(Usuario, uid, `/Utils/Hupper`)
            if (Usuario.codigo) {
                if (Usuario.estado === 'activo')
                    this.validaCodigoAcc(Usuario);
                else ///puedo hacer la reactivacion dependiendo. ****************Importante                  
                    this.auth.signOut();
            }

            let slack = null;
            //obtien la configuracion de slack
            const nameRef4 = this.componentDatabase("get", `Usuario-Slack/${uid}`); 
            nameRef4.on('value', (snapshot3) => {
                if (snapshot3.val())
                    slack = snapshot3.val();
            });

            let calendar = null;
            const nameRef5 = this.componentDatabase("get", `Usuario-CalendarGoogle/${uid}`);
            nameRef5.on('value', (snapshot) => {
                if (snapshot.val()) {
                    calendar = snapshot.val().idCalendar.value;
                }
            });

            let rol = null;
            const nameRef2 = this.componentDatabase("get", `Usuario-Rol/${uid}`);
            nameRef2.on('value', (snapshot2) => {
                rol = snapshot2.val().Rol;
            });

            const nameRef3 = this.componentDatabase("get", `Usuario-WS/${Usuario.empresa}/${Usuario.equipo}/${uid}`);
            nameRef3.on('value', (snapshot3) => {
                if (snapshot3.val()) {

                    this.props.usuarioDetails({ usuario: Usuario, calendar, idUsuario: uid, id: this.auth.currentUser.get().getId(), linkws: snapshot3.val().linkWs, slack, rol, etapa });
                }
            });
        });
    }

    onAuthChange = isSignedIn => {
        //   console.log(this.auth.currentUser.get().getId());

        if (isSignedIn) {
            let objectId = { email: this.auth.currentUser.get().getBasicProfile().getEmail(), ID: this.auth.currentUser.get().getId() }
            this.componentDatabase("login", null, objectId);

            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    this.setState({ uid: user.uid });
                    this.props.nombreUsuario(this.auth.currentUser.get().getBasicProfile().getName());
                    //recupera codigo de acceso de slack
                    this.recuperarDatoSlack(window.location.search, user.uid);
                    //recupera el token trello
                    this.recuperarDatoToken(window.location.href, user.uid);
                    this.props.nuevoUsuarios(true);
                    //render valida si el usuario se ha creado en Asana
                    this.renderValidAsana();
                    //Encuentra el Rol,
                    this.renderUsarioLogin(user.uid);
                    // User is signed in.
                } else {
                    this.createUsuario();
                    this.props.popupBot({ mensaje: "vamos a comenzar crenado tu usuario" });
                    // No user is signed in.
                }
            })

        } else {
            this.props.signOut();
        }
    };

    recuperarDatoSlack(direccion, uid) {
        if (!direccion.includes('code'))
            return null;
        const vars = direccion.split("?")[1].split("&");
        let code = null;
        let asana = null;
        if (direccion.includes('asana')) {
            asana = true;
        }
        vars.forEach(e => {
            var pair = e.split("=");
            if (pair[0] === 'code') {
                code = pair[1];
                this.componentDatabase("insert", `Usuario-CodeTemporal/${uid}`, { code, asana});
            }
        });

        return code;
    }

    recuperarDatoToken(direccion, uid) {

        if (!direccion.includes('token'))
            return null;

        const vars = direccion.split("#");
        let token = null;

        vars.forEach(e => {
            var pair = e.split("=");
            if (pair[0] === 'token') {
                token = pair[1];
                this.componentDatabase("insert", `Usuario-TokenTrelloTemp/${uid}`, { token});
                this.setState({ tokenTrello: true })
            }
        });
        return token;
    }



    componentDidUpdate() {
        if (this.props.nuevoUsuario === false)
            this.auth.signOut();
    }

    onSignInClick = () => {
        this.auth.signIn();
    };
    onSignOutClick = () => {
        this.auth.signOut();
        history.push('/');
    };

    renderAuthButton() {

        //click entra o sale
        if (this.props.isSignedIn === null) {
            return null;
        }
        else if (this.props.isSignedIn) {

            if (this.state.tokenTrello === true)
                history.push('/proceso/exito');
            /*
                        else if (!this.props.equipoConsulta || !this.props.equipoConsulta.trabajo) {
                    
                            history.push('/dashboard');
                        }*/

            let leftLogo = '-0.2em';
            let leftSign = '2.5em';
            if (window.innerWidth < 450 || (window.innerWidth < 850 && window.innerHeight < 450)) {
                leftLogo = '-1.3em';
                leftSign = '1.2em';
            }

            return (
                <div style={{ height: '1.2em' }}>
                    <i style={{ left: leftLogo, position: 'relative' }} className="google icon"></i>
                    <List.Content style={{ top: '-15px', left: leftSign, position: 'relative' }} onClick={this.onSignOutClick}>
                        <List.Header> Sign Out</List.Header>
                    </List.Content>
                </div>
            );
        }
        else {

            history.push('/');
            if (this.props.googleIn) {
                return (
                    <div style={{ height: '1.2em' }}>
                        <i className="google icon"></i>
                        <List.Content style={{ top: '-15px', left: '1.2em', position: 'relative' }}>
                            <List.Header> Tu cuenta Google</List.Header>
                        </List.Content>
                    </div>
                );
            }
            else {

                return (
                    <button
                        onClick={() => { this.onSignInClick() }} className="ui google button" style={{ background: 'linear-gradient(to right, #fe10bd 20%, #f0bbe1 50% ,#fe10bd 100%)', position: 'relative', left: '50%', borderRadius: '20px', width: '220px', display: 'grid', height: '52px' }} >
                        <img style={{ left: '-14px', position: 'relative', top: '-5px', borderRadius: '20px' }}
                            width="40" height="40" alt="Google logo" src="https://cdn.goconqr.com/assets/social/google/btn_google_light_normal_ios_160-9ef927f3fdc8ade894b35a0eb01225e8602967d799a831565f9327840aaaf44c.png"></img>
                        <b style={{ top: '-32px', left: '20px', position: 'relative', fontSize: 'larger', color: 'white' }}> Ingresar con Google</b>
                    </button>
                );
            }
        }
    }

    render() {
        return <div>{this.renderAuthButton()}</div>
    }
};

const mapStateToProps = (state) => {
    return {
        isSignedIn: state.auth.isSignedIn,
        nuevoUsuario: state.chatReducer.nuevoUsuario,
        equipoConsulta: state.chatReducer.equipoConsulta,
        usuarioDetail: state.chatReducer.usuarioDetail,
    };
};

export default connect(mapStateToProps, { signIn, signOut, nombreUsuario, usuarioDetails, chatOn, chatOff, popupBot, nuevoUsuarios, detailUsNews, mensajeAsanas, Singauth })(GoogleAuth);