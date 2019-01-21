import React from 'react';
import { connect } from 'react-redux';
import Home from './homePage';
import Menu from './menuChat';
import './chatHupApp.css';
import Contacts from './contactsPage';
import Profile from './profilePage';
import { settings as Senttings } from './settingsPage';
import {
    submitMessage, consultaChats, chatIdentifiador, numeroPreguntas, mensajeEntradas, consultaPreguntaControls,
    tipoPreguntas, endChat, startChat, borrarChats
} from './actions';
import firebase from 'firebase';
import _ from 'lodash';





class App extends React.Component {

    componentDidMount() {
        this.props.consultaPreguntaControls(1);
        this.props.borrarChats(this.props.user.activeChat.participants);
        //this.props.endChat('6');
        //this.props.startChat('6');
        this.props.chatIdentifiador('6');
        if (this.props.mensajeEnt) {
            const chatID = '13';
            this.props.tipoPreguntas('Notificaion');
            /*
            const nameRef2 = firebase.database().ref().child('Mensaje-ChatBot').child('Saludo').child('1');
            nameRef2.on('value', (snapshot2) => {


                const mensaje = snapshot2.val().concepto;
                const result = _.replace(mensaje, /@nombre/g, this.props.nombreUser);
                this.props.submitMessage(result, chatID, '6');


            });*/

            //Notificaciones
            /*
            const nameRef2 = firebase.database().ref().child('Notificaciones/108587547313274842109/-LWlp6LbqCPoZ9XBipaG')
            nameRef2.on('value', (snapshot2) => {
                // console.log(snapshot2.val());
                let mensaje = snapshot2.val().concepto;
                if (snapshot2.val().estado === 'activo') {
                    if (snapshot2.val().notificaciones === 'Feedback') {
                        mensaje = `${mensaje} , Atte: ${snapshot2.val().persona}`;
                    }
                    else if (snapshot2.val().notificaciones === 'Documento') {
                        mensaje = `${mensaje} , Atte: ${snapshot2.val().persona}`;
                    }
                    else if (snapshot2.val().notificaciones === 'Motivacion Huper') {
                        mensaje = `${mensaje}  ${snapshot2.val().link}`;
                    }
                    this.props.submitMessage(mensaje, chatID, '6');

                }

            });
            */

            //Mensaje de Salida
            /*    
                const starCountRef3 = firebase.database().ref().child('Mensaje-ChatBot/Despedida Huper/1');
                starCountRef3.on('value', (snapshot) => {
                    const result = _.replace(snapshot.val().concepto, /@nombre/g, this.props.nombreUser);
                    this.props.submitMessage(result, chatID, this.props.idChatUser);
                    //this.props.numeroPreguntas(this.props.numeroPregunta + 1);
                });
    
                const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LWl1r4nhd8kxizVeVWv');
                starCountRef.on('value', (snapshot) => {
                    this.props.consultaChats(snapshot.val());
                  
                    this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
                    // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
                });*/
            //Seguimiento
            /*
            const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LWk8_7EYCjLe-twidsN');
            starCountRef.on('value', (snapshot) => {
                this.props.consultaChats(snapshot.val());

                this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
                // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
            });*/
            //TIC OBJETIVO

            /*      const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LWjnHE5W8YLaEYaDWGd');
                  starCountRef.on('value', (snapshot) => {
                      this.props.consultaChats(snapshot.val());
      
                      this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
                      // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
                  });
      */
            //TIC
            /*
                        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LWhSUV5slo2cbIxl5go');
                        starCountRef.on('value', (snapshot) => {
                            this.props.consultaChats(snapshot.val());
                        
                            this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
                           // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
                        });
                        */
            /*
                        //consultar y editar tarea
                        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LWekXxzIhU5ezBWot-t');
                        starCountRef.on('value', (snapshot) => {
                            this.props.consultaChats(snapshot.val());
                        
                            this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
                           // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
                        });
                      
            */
            //Pregunta Diaria (Listo)
            /*
             const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LWGFo3s87SjzppL7hoF');
             starCountRef.on('value', (snapshot) => {
                 this.props.consultaChats(snapshot.val());
             
                 this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
                // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
             });
             */
            // this.props.mensajeEntradas(false);
        }
    }





    componentDidUpdate() {
        // console.log('paso');

    }

    renderChatButton() {


        if (this.props.isChatUbi === 'contacs') {
            return <Contacts />;
        }
        else if (this.props.isChatUbi === 'profile') {
            return <Profile />;
        }
        else if (this.props.isChatUbi === 'settings') {
            return <Senttings />;
        }
        else if (this.props.children) {
            return this.props.children;
        }
        else {
            return <Home user={this.props.user} />;
        }


    }





    render() {

        const content = this.props.children
            ? this.props.children
            : <Home user={this.props.user} />


        return (
            <div className="ui grid">

                <div className={"app-wrapper " + this.props.theme + " right floated five wide column"}>
                    {this.renderChatButton()}
                    <Menu />
                </div>
            </div>
            // set home to default route initiall
        )
    };
};

const mapAppStateToProps = (state) => (
    {
        consultaPreguntaControl: state.chatReducer.consultaPreguntaControl,
        mensajeEnt: state.chatReducer.mensajeEnt,
        idChatUser: state.chatReducer.idChatUser,
        flagPregunta: state.chatReducer.flagPregunta,
        numeroPregunta: state.chatReducer.numeroPregunta,
        consultaPregunta: state.chatReducer.consultaPregunta,
        nombreUser: state.chatReducer.nombreUser,
        user: state.user,
        theme: state.settings.theme,
        isChatUbi: state.chatReducer.isChatUbi
    });



export default connect(mapAppStateToProps, {
    submitMessage, consultaChats, tipoPreguntas, mensajeEntradas, borrarChats,
    chatIdentifiador, numeroPreguntas, consultaPreguntaControls, endChat, startChat
})(App);
















