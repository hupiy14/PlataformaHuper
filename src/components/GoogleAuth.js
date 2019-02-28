import React from 'react';
import { connect } from 'react-redux';
import { signIn, signOut, userRolIn, nombreUsuario, usuarioDetails, chatOn, chatOff } from '../actions';
import history from '../history';
import { nuevoUsuarios } from '../components/modules/chatBot/actions';
import '../components/styles/ingresoHupity.css';
import firebase from 'firebase';
const timeoutLength = 3000;

const timeoutLength2 = 600000;


class GoogleAuth extends React.Component {
    state = { selectedFile: null, loaded: 0, codigo: null, usuario: null }
    componentDidMount() {

        //Conectar a google  con el drive,
        window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
                clientId: '114346141609-03hh8319khfkq8o3fc6m2o02vr4v14m3.apps.googleusercontent.com',
                //scope: 'email'
                apiKey: 'AIzaSyBc8xwjAd9W_52aa26QpuztTx3BXjHFKsM',
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
                scope: 'https://www.googleapis.com/auth/drive'
            }).then(() => {
                this.auth = window.gapi.auth2.getAuthInstance();

                this.onAuthChange(this.auth.isSignedIn.get());

                this.auth.isSignedIn.listen(this.onAuthChange);
                //   console.log(this.auth.currentUser.get().getId());
            });
        });
    }


    handleOpen = () => {
        this.timeout = setTimeout(() => {
            this.props.chatOn();
        }, timeoutLength)
    }


    handleOpen2 = () => {
        this.timeout = setTimeout(() => {
            const starCountRef = firebase.database().ref().child(`Codigo-Acceso/${this.state.codigo}`);
            starCountRef.on('value', (snapshot) => {
                const cod = snapshot.val();
                if (cod) {
                    if (cod.estado !== 'activo' && cod.estado !== 'anulado' && cod.estado !== 'usado') {
                        cod.estado = 'usado';
                        const us = this.state.usuario;
                        us.estado = 'inactivo';

                        firebase.database().ref(`Codigo-Acceso/${this.state.codigo}`).set({
                            ...cod,
                            fechaTer: new Date().toString(),

                        })

                        firebase.database().ref(`Usuario/${this.auth.currentUser.get().getId()}`).set({
                            ...us,
                        })
                        this.auth.signOut();
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
            this.props.nuevoUsuarios(true);
            //Encuentra el Rol,
            const nameRef = firebase.database().ref().child('Usuario').child(this.auth.currentUser.get().getId());
            nameRef.on('value', (snapshot) => {


                // console.log(snapshot.val());

                if (snapshot.val()) {

                    //invalida codifo de acceso
                    const Usuario = snapshot.val();
                    if (Usuario.codigo) {

                        if (Usuario.estado === 'activo') {
                            console.log(Usuario.codigo);
                            this.setState({ codigo: Usuario.codigo })
                            this.setState({ usuario: Usuario })
                            this.handleOpen2();
                        }
                        else ///puedo hacer la reactivacion dependiendo. ****************Importante
                            this.auth.signOut();
                    }
                    //  console.log(Usuario.empresa);
                    // console.log(Usuario.equipo);
                    console.log(this.auth.currentUser.get().getId());
                    const nameRef3 = firebase.database().ref().child(`Usuario-WS/${Usuario.empresa}/${Usuario.equipo}/${this.auth.currentUser.get().getId()}`)
                    nameRef3.on('value', (snapshot3) => {
                        //        console.log(snapshot3.val());
                        if (snapshot3.val())
                            this.props.usuarioDetails({ usuario: Usuario, idUsuario: this.auth.currentUser.get().getId(), linkws: snapshot3.val().linkWs });
                    });


                    const nameRef2 = firebase.database().ref().child('Usuario-Rol').child(this.auth.currentUser.get().getId());
                    nameRef2.on('value', (snapshot2) => {
                        //      console.log(snapshot2.val());

                        this.props.userRolIn(snapshot2.val().Rol);
                        if (snapshot2.val().Rol === '3') {
                           
                            this.handleOpen();
                        }


                    });

                    /// onboarding de la plataforma
                    if(!Usuario.onboarding)
                    {/*
                        firebase.database().ref(`Usuario/${this.auth.currentUser.get().getId()}`).set({
                            ...Usuario,
                            onboarding: true,
                        })*/
                       // history.push('/onboarding');
                    }

                }
                else {

                    //  if (this.props.nuevoUsuario !== true) {
                    //  this.auth.signOut();
                    const usuarioNuevo = { nombre: this.auth.currentUser.get().w3.ig, correo: this.auth.currentUser.get().w3.U3, id: this.auth.currentUser.get().w3.Eea };
                    this.props.usuarioDetails({ usuarioNuevo });
                    //   if(this.props.isSignedIn === false)
                    history.push('/newuser');
                    //   this.props.signOut();


                }

            })


            this.props.signIn(this.auth.currentUser.get().getId());
        } else {


            this.props.signOut();
        }


        //  if (x)
        //    this.props.signOut();

    };



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


            history.push('/dashboard');
            return (
                <button onClick={this.onSignOutClick} className="ui red google button bar-top">
                    <i className="google icon" />
                    Sign Out
            </button>
            );
        } else {
            history.push('/login');
            return (
                <button onClick={this.onSignInClick} className="ui red google button">
                    <i className="google icon" />
                    Sign In with Google
          </button>

            );
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
    };
};

export default connect(mapStateToProps, { signIn, signOut, userRolIn, nombreUsuario, usuarioDetails, chatOn, chatOff, nuevoUsuarios })(GoogleAuth);