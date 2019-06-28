import React from 'react';
import { connect } from 'react-redux';
import { signIn, signOut, userRolIn, nombreUsuario, usuarioDetails, chatOn, chatOff } from '../actions';
import history from '../history';
import { nuevoUsuarios, detailUsNews, MensajeIvilys } from '../components/modules/chatBot/actions';
import '../components/styles/ingresoHupity.css';
import firebase from 'firebase';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { List, Icon } from 'semantic-ui-react'
import SlackA from '../apis/slackApi';

const timeoutLength = 3000;

const timeoutLength2 = 5000;


class GoogleAuth extends React.Component {
    state = { selectedFile: null, loaded: 0, codigo: null, usuario: null, direccion: null, tokenTrello: false, }



    componentDidMount() {


        //Conectar a google  con el drive --- auth,
        window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
                clientId: '114346141609-03hh8319khfkq8o3fc6m2o02vr4v14m3.apps.googleusercontent.com',
                //scope: 'email'
                apiKey: 'AIzaSyBc8xwjAd9W_52aa26QpuztTx3BXjHFKsM',
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
                //discoveryDocs: ["https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest"],

                // scope: 'https://www.googleapis.com/auth/drive',
                scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/drive"
            }).then(() => {
                this.auth = window.gapi.auth2.getAuthInstance();

                this.onAuthChange(this.auth.isSignedIn.get());

                this.auth.isSignedIn.listen(this.onAuthChange);
                //   console.log(this.auth.currentUser.get().getId());
            });
        });

    }


    handleOpen2 = (Usuario) => {
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

        }, timeoutLength2)
    }




    onAuthChange = isSignedIn => {
        console.log(this.auth.currentUser.get());
        if (this.auth.currentUser.get().w3)
            this.props.nombreUsuario(this.auth.currentUser.get().w3.ofa);
        //console.log(this.auth.currentUser.get().w3.ig);

        //let x;

        if (isSignedIn) {


            //recupera codigo de acceso de slack
            let dir = window.location.search;
            this.recuperarDatos(dir);

            //recupera el token trello
            dir = window.location.href;
            this.recuperarDatos2(dir);


            this.props.nuevoUsuarios(true);
            //Encuentra el Rol,
            const nameRef = firebase.database().ref().child('Usuario').child(this.auth.currentUser.get().getId());
            nameRef.on('value', (snapshot) => {




                if (snapshot.val()) {

                    //invalida codifo de acceso
                    const Usuario = snapshot.val();
                    if (Usuario.codigo) {

                        if (Usuario.estado === 'activo') {
                            this.setState({ usuario: Usuario })
                            this.handleOpen2(Usuario);
                        }
                        else ///puedo hacer la reactivacion dependiendo. ****************Importante
                        {
                            this.auth.signOut();
                        }
                    }
                    //        console.log(this.auth.currentUser.get().getId());

                    let slack = null;
                    //obtien la configuracion de slack
                    const nameRef4 = firebase.database().ref().child(`Usuario-Slack/${this.auth.currentUser.get().getId()}`)
                    nameRef4.on('value', (snapshot3) => {
                        if (snapshot3.val())
                            slack = snapshot3.val();
                    });

                    const nameRef3 = firebase.database().ref().child(`Usuario-WS/${Usuario.empresa}/${Usuario.equipo}/${this.auth.currentUser.get().getId()}`)
                    nameRef3.on('value', (snapshot3) => {
                        //           console.log(snapshot3.val());
                        if (snapshot3.val())
                            this.props.usuarioDetails({ usuario: Usuario, idUsuario: this.auth.currentUser.get().getId(), linkws: snapshot3.val().linkWs, slack });
                    });





                    const nameRef2 = firebase.database().ref().child('Usuario-Rol').child(this.auth.currentUser.get().getId());
                    nameRef2.on('value', (snapshot2) => {
                        //      console.log(snapshot2.val());
                        this.props.userRolIn(snapshot2.val().Rol);
                    });

                    /// onboarding de la plataforma
                    if (!Usuario.onboarding) {
                        firebase.database().ref(`Usuario/${this.auth.currentUser.get().getId()}`).set({
                            ...Usuario,
                            onboarding: true,
                        })
                        history.push('/onboarding');
                    }



                }
                else {
                    //  if (this.props.nuevoUsuario !== true) {
                    //  this.auth.signOut();
                    let direccion = '/formulario';
                    const usuarioNuevo = { nombre: this.auth.currentUser.get().w3.ig, correo: this.auth.currentUser.get().w3.U3, id: this.auth.currentUser.get().w3.Eea };
                    this.props.usuarioDetails({ usuarioNuevo });

                    let code = null;

                    if (this.props.detailUsNew && this.props.detailUsNew.slackCode) {
                        code = this.props.detailUsNew.slackCode;
                        console.log(this.props.detailUsNew.slackCode);
                    }


                    const starCountRef = firebase.database().ref().child(`Usuario-Temporal/${this.auth.currentUser.get().w3.Eea}`);
                    starCountRef.on('value', (snapshot) => {
                        if (snapshot.val()) {

                            const starCountRef2 = firebase.database().ref().child(`Usuario-CodeTemporal/${this.auth.currentUser.get().w3.Eea}`);
                            starCountRef2.on('value', (snapshot2) => {
                                if (snapshot2.val()) {
                                    this.props.detailUsNews({ ...snapshot.val(), recupero: true, codeSlack: snapshot2.val().code });
                                    direccion = '/formulario/equipo';
                                    history.push(direccion);
                                }
                            });
                        }
                        history.push(direccion);
                    });




                }

            })


            this.props.signIn(this.auth.currentUser.get().getId());
        } else {


            this.props.signOut();
        }


        //  if (x)
        //    this.props.signOut();






    };


    recuperarDatos(direccion) {

        if (!direccion.includes('code'))
            return null;
        const vars = direccion.split("?")[1].split("&");
        let code = null;

        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");

            if (pair[0] === 'code') {
                code = pair[1];
                firebase.database().ref(`Usuario-CodeTemporal/${this.auth.currentUser.get().getId()}`).set({
                    code
                });
            }
        }
        return code;
    }

    recuperarDatos2(direccion) {

        if (!direccion.includes('token'))
            return null;
        const vars = direccion.split("#");
        let token = null;

        for (var i = 1; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] === 'token') {

                token = pair[1];
                firebase.database().ref(`Usuario-TokenTrelloTemp/${this.auth.currentUser.get().getId()}`).set({
                    token

                });
                this.setState({ tokenTrello: true })

            }
        }
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
    };

    renderAuthButton() {
        //click entra o sale
        if (this.props.isSignedIn === null) {
            return null;
        } else if (this.props.isSignedIn) {

            if (this.state.tokenTrello === true)
                history.push('/proceso/exito');

            else if (!this.props.equipoConsulta || !this.props.equipoConsulta.trabajo) {
                history.push('/dashboard');


            }
            
            return (
                <div style={{ height: '1.2em' }}>
                    <Icon style={{ position: 'relative' }} name="google icon"></Icon>
                    <List.Content style={{ top: '-15px', left: '25px', position: 'relative' }} onClick={this.onSignOutClick}>
                        <List.Header> Sign Out</List.Header>
                    </List.Content>
                </div>

            );
        } else {
            history.push('/login');


            if (this.props.googleIn) {
                return (<div style={{ height: '1.2em' }}>
                    <Icon style={{ position: 'relative' }} name="google icon"></Icon>
                    <List.Content style={{ top: '-15px', left: '25px', position: 'relative' }}>
                        <List.Header> Tu cuenta Google</List.Header>
                    </List.Content>
                </div>
                );
            }
            else {


                return (
                    <button style={{
                        position: 'relative',
                        left: '30%'
                    }} onClick={this.onSignInClick} className="ui red google button">
                        <i className="google icon" />
                        Tu cuenta Google
                   </button>

                );
            }
        }
    }



    render() {
        return <div>

            {this.renderAuthButton()}</div>
    }
};

const mapStateToProps = (state) => {
    return {
        //   usuarioDetail: state.chatReducer.usuarioDetail,

        isSignedIn: state.auth.isSignedIn,
        nuevoUsuario: state.chatReducer.nuevoUsuario,
        equipoConsulta: state.chatReducer.equipoConsulta,
        usuarioDetail: state.chatReducer.usuarioDetail,
        MensajeIvily: state.chatReducer.MensajeIvily,



    };
};

export default connect(mapStateToProps, { signIn, signOut, userRolIn, MensajeIvilys, nombreUsuario, usuarioDetails, chatOn, chatOff, nuevoUsuarios, detailUsNews })(GoogleAuth);