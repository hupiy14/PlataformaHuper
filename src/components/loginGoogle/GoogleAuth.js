import React from 'react';
import { connect } from 'react-redux';
import { signIn, signOut, nombreUsuario, usuarioDetails, chatOn, chatOff, mensajeAsanas } from '../../actions';
import history from '../../history';
import { nuevoUsuarios, detailUsNews } from '../../components/modules/chatBot/actions';
import '../../components/styles/ingresoHupity.css';
import firebase from 'firebase';
import axios from 'axios';
import moment from 'moment';
import { List } from 'semantic-ui-react'
import { clientIdGoogle, apiKeyGoogle } from '../../apis/stringConnection';
import { clientIdAsana, clientSecrectAsana, clientSlack, clientSecrectSlack } from '../../apis/stringConnection';

const timeoutLength = 5000;
const timeoutLength2 = 2000;
class GoogleAuth extends React.Component {

    state = { selectedFile: null, loaded: 0, codigo: null, direccion: null, tokenTrello: false, }

    componentDidMount() {

        window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
                clientId: clientIdGoogle,
                apiKey: apiKeyGoogle,
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
                scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/drive"
            }).then(() => {

                this.auth = window.gapi.auth2.getAuthInstance();
                this.onAuthChange(this.auth.isSignedIn.get());
                this.auth.isSignedIn.listen(this.onAuthChange);

            });
        });
    }



    renderValidAsana = (Usuario) => {
        this.timeout = setTimeout(() => {
            const starCountRef = firebase.database().ref().child(`Usuario-CodeTemporal/${this.auth.currentUser.get().getId()}`);
            let us = this.auth.currentUser.get().getId();
            starCountRef.on('value', (snapshot) => {
                const cod = snapshot.val();
                if (cod) {
                    let code = cod.code;
                    if (cod.asana) {
                        code = code.replace('%2F', '/').replace('%3A', ':');
                        console.log(window.location);
                        axios.post(`https://cors-anywhere.herokuapp.com/https://app.asana.com/-/oauth_token`, null, {
                            params: {
                                'grant_type': 'authorization_code',
                                'client_id': clientIdAsana, 'client_secret': clientSecrectAsana,
                                'redirect_uri': window.location.origin, code
                            }
                        }).then(res => {

                            firebase.database().ref(`Usuario-Asana/${us}`).update({
                                token: res.data.access_token,
                                rToken: res.data.refresh_token,
                                code
                            })
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
                                    firebase.database().ref(`Usuario-Slack/${us}`).set({
                                        tokenSlack: res.data.access_token,
                                        tokenBot: res.data.bot.bot_access_token,
                                        userSlack: res.data.user_id
                                    });
                                    firebase.database().ref(`Usuario/${us}`).update({
                                        userSlack: res.data.user_id
                                    });
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
            firebase.database().ref(`Usuario-CodeTemporal/${Usuario}`).set({});
        }, timeoutLength)
    }

    validaCodigoAcc = (Usuario) => {
        this.timeout = setTimeout(() => {
            const starCountRef = firebase.database().ref().child(`Codigo-Acceso/${Usuario.codigo}`);
            starCountRef.on('value', (snapshot) => {
                const cod = snapshot.val();
                if (cod) {
                    if (cod.estado === 'usado') {
                        if (moment().diff(moment(cod.fechaUso, 'YYYY-MM-DD'), 'days') > 15) {
                            cod.estado = 'usado';
                            const us = Usuario;
                            us.estado = 'inactivo';
                            us.onboarding = true;

                            firebase.database().ref(`Codigo-Acceso/${Usuario.codigo}`).set({
                                ...cod,
                                fechaTer: new Date().toString(),
                            })

                            firebase.database().ref(`Usuario/${this.auth.currentUser.get().getId()}`).set({
                                ...us,
                            })
                            this.auth.signOut();
                        }
                    }
                }
            })
        }, timeoutLength)
    }

    onAuthChange = isSignedIn => {
        console.log(this.auth.currentUser.get().getId());
        if (this.auth.currentUser.get().w3)
            this.props.nombreUsuario(this.auth.currentUser.get().w3.ofa);

        if (isSignedIn) {
            //Valida si se ha cerrado la session 
            //  if (isSignedIn && this.props.isSignedIn === false)
            //    return;

            //recupera codigo de acceso de slack
            this.recuperarDatoSlack(window.location.search);

            //recupera el token trello
            this.recuperarDatoToken(window.location.href);

            this.props.nuevoUsuarios(true);
            this.renderValidAsana();

            //Encuentra el Rol,
            const nameRef = firebase.database().ref().child('Usuario').child(this.auth.currentUser.get().getId());
            nameRef.on('value', (snapshot) => {
                console.log('ENtroooooo');
                const Usuario = snapshot.val();
                if (Usuario) {

                    //invalida codigo de acceso
                    if (Usuario.codigo) {
                        if (Usuario.estado === 'activo')
                            this.validaCodigoAcc(Usuario);
                        else ///puedo hacer la reactivacion dependiendo. ****************Importante                  
                            this.auth.signOut();
                    }

                    let slack = null;
                    //obtien la configuracion de slack
                    const nameRef4 = firebase.database().ref().child(`Usuario-Slack/${this.auth.currentUser.get().getId()}`)
                    nameRef4.on('value', (snapshot3) => {
                        if (snapshot3.val())
                            slack = snapshot3.val();
                    });

                    let calendar = null;
                    const nameRef5 = firebase.database().ref().child(`Usuario-CalendarGoogle/${this.auth.currentUser.get().getId()}`);
                    nameRef5.on('value', (snapshot) => {
                        if (snapshot.val()) {
                            calendar = snapshot.val().idCalendar.value;
                        }
                    });

                    let rol = null;
                    const nameRef2 = firebase.database().ref().child('Usuario-Rol').child(this.auth.currentUser.get().getId());
                    nameRef2.on('value', (snapshot2) => {
                        rol = snapshot2.val().Rol;
                    });

                    const nameRef3 = firebase.database().ref().child(`Usuario-WS/${Usuario.empresa}/${Usuario.equipo}/${this.auth.currentUser.get().getId()}`)
                    nameRef3.on('value', (snapshot3) => {
                        if (snapshot3.val())
                            this.props.usuarioDetails({ usuario: Usuario, calendar, idUsuario: this.auth.currentUser.get().getId(), linkws: snapshot3.val().linkWs, slack, rol });
                    });

                }
                else {

                    let direccion = '/formulario';
                    console.log(this.auth.currentUser.get());
                    let usuarioNuevo = { nombre: this.auth.currentUser.get().Qt.Bd, email: this.auth.currentUser.get().Qt.Au, id: this.auth.currentUser.get().getId(), rol: '2' };
                    this.props.usuarioDetails({ usuarioNuevo });

                    const starCountRef = firebase.database().ref().child(`Usuario-Temporal/${this.auth.currentUser.get().getId()}`);
                    starCountRef.on('value', (snapshot) => {

                        if (snapshot.val()) {
                            const starCountRef2 = firebase.database().ref().child(`Usuario-CodeTemporal/${this.auth.currentUser.get().getId()}`);
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
            });
            this.props.signIn(this.auth.currentUser.get().getId());
        } else {
            this.props.signOut();
        }
    };

    recuperarDatoSlack(direccion) {
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
                firebase.database().ref(`Usuario-CodeTemporal/${this.auth.currentUser.get().getId()}`).set({
                    code, asana
                });
            }
        });

        return code;
    }

    recuperarDatoToken(direccion) {

        if (!direccion.includes('token'))
            return null;
        const vars = direccion.split("#");
        let token = null;

        vars.forEach(e => {
            var pair = e.split("=");
            if (pair[0] === 'token') {
                token = pair[1];
                firebase.database().ref(`Usuario-TokenTrelloTemp/${this.auth.currentUser.get().getId()}`).set({
                    token
                });
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

            return (
                <div style={{ height: '1.2em' }}>
                    <i className="google icon"></i>
                    <List.Content style={{ top: '-15px', left: '25px', position: 'relative' }} onClick={this.onSignOutClick}>
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
                        <List.Content style={{ top: '-15px', left: '25px', position: 'relative' }}>
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

export default connect(mapStateToProps, { signIn, signOut, nombreUsuario, usuarioDetails, chatOn, chatOff, nuevoUsuarios, detailUsNews, mensajeAsanas })(GoogleAuth);