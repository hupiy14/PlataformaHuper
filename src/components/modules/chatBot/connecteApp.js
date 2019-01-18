import React from 'react';
import { connect } from 'react-redux';
import Home from './homePage';
import Menu from './menuChat';
import './chatHupApp.css';
import Contacts from './contactsPage';
import Profile from './profilePage';
import { settings as Senttings } from './settingsPage';
import { submitMessage, consultaChats, chatIdentifiador, numeroPreguntas, mensajeEntradas, consultaPreguntaControls, endChat, startChat, borrarChats } from './actions';
import firebase from 'firebase';
import _ from 'lodash';





class App extends React.Component {

    componentDidMount() {
        this.props.consultaPreguntaControls(1);
        this.props.borrarChats(this.props.user.activeChat.participants);
        //this.props.endChat('6');
        //this.props.startChat('6');
      
        if (this.props.mensajeEnt) {
            const chatID = '13';
            const nameRef2 = firebase.database().ref().child('Mensaje-ChatBot').child('Saludo').child('1');
            nameRef2.on('value', (snapshot2) => {


                const mensaje = snapshot2.val().concepto;
                const result = _.replace(mensaje, /@nombre/g, this.props.nombreUser);
                this.props.submitMessage(result, chatID, '6');
                this.props.chatIdentifiador('6');

            });
            const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LWGFo3s87SjzppL7hoF');
            starCountRef.on('value', (snapshot) => {
                this.props.consultaChats(snapshot.val());
            
                this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
               // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
            });
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



export default connect(mapAppStateToProps, { submitMessage, consultaChats, mensajeEntradas, borrarChats,
     chatIdentifiador, numeroPreguntas, consultaPreguntaControls, endChat, startChat })(App);
















