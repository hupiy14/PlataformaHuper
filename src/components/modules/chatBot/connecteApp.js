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
    tipoPreguntas, endChat, startChat, borrarChats, pasoOnboardings
} from './actions';
import firebase from 'firebase';
import _ from 'lodash';
import Avatar from '../../../apis/xpress';



const timeoutLength = 500;

class App extends React.Component {

    state = { avatares: null, }
 

    // habilita el primer paso
    handlePaso = () => {
        this.timeout = setTimeout(() => {
            this.props.pasoOnboardings(1);
        }, timeoutLength)
    }


    componentDidMount() {
        //primer paso del onboarding de la herramienta
        if (!this.props.usuarioDetail.usuario.onboarding && this.props.pasoOnboarding === 0)
            this.handlePaso();
        this.props.consultaPreguntaControls(1);
        this.props.borrarChats(this.props.user.activeChat.participants);
        //this.props.endChat('6');
        //this.props.startChat('6');
        this.props.chatIdentifiador('6');
        const chatID = '13';
        if (this.props.mensajeEnt) {

            const nameRef2 = firebase.database().ref().child('Mensaje-ChatBot').child('Saludo').child('1');
            nameRef2.on('value', (snapshot2) => {
                const mensaje = snapshot2.val().concepto;
                const result = _.replace(mensaje, /@nombre/g, this.props.nombreUser);
                //    const imf = <Image src='https://xpresso2.mobigraph.co/xpresso/v2/media/1bfaLcimzkhPQ2w9jwolG3qxXUqmdjw-1/7d140000.gif' size='small' />;
                this.props.submitMessage(result, chatID, '6');
                this.props.mensajeEntradas(false);

            });
        }
        else {
            this.props.submitMessage('@<Hola Huper@<', chatID, '6');
        }
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
            });
*/

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
        if (this.props.userRol === '3') {

            /*
                              //Mensaje de Salida
                              this.props.tipoPreguntas('Despedida');
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
                              });
   
                              */

            if (this.props.pasoOnboarding === 0 || this.props.usuarioDetail.usuario.onboarding)
               // this.rendeSeguimientoTrabajo(chatID);
                this.rendeTalentoImpCom(chatID);
               // this.renderTareaDiaria(chatID);
            else if (this.props.isChat === false || this.props.pasoOnboarding === 1)
                //    this.rendeSeguimientoTrabajo(chatID);
                this.renderTareaDiaria(chatID);
            else if (this.props.pasoOnboarding === 3)
                this.renderRealizarTIC_EXP(chatID);


        }
        // this.props.mensajeEntradas(false);


        ///Crear objetivo Gestor 
        /*
                    const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LXtZVCN7-52d44THkXP');
                    starCountRef.on('value', (snapshot) => {
                        this.props.consultaChats(snapshot.val());
        
                        this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
                        // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
                    });
        
        */


        ///Crear Feedback Exporadico Gestor
        /*
                    const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LXt_CrEJFXvUlEN_tp5');
                    starCountRef.on('value', (snapshot) => {
                        this.props.consultaChats(snapshot.val());
        
                        this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
                        // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
                    });
        
        
        */

        ///Consultar trabajo del huper
        /*
                    const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LXt_NqMTxrwo-Ap7UTR');
                    starCountRef.on('value', (snapshot) => {
                        this.props.consultaChats(snapshot.val());
        
                        this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
                        // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
                    });
        
        
        */

        //Consulta opciones fase 1 Gestor
        else if (this.props.userRol === '2') {
            this.props.tipoPreguntas('Consulta Gestor');
            const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LXt_TDJQilcvBxWh955');
            starCountRef.on('value', (snapshot) => {
                this.props.consultaChats(snapshot.val());

                this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
                // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
            });
        }

    }



    //Pregunta TIC
    rendeTalentoImpCom(chatID) {
        this.props.tipoPreguntas('TIC');
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LekIihkesH_WPL9f624');
        starCountRef.on('value', (snapshot) => {
            this.props.consultaChats(snapshot.val());
            this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
            // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
        });
    }




    //Seguimiento
    rendeSeguimientoTrabajo(chatID) {
        this.props.tipoPreguntas('Seguimiento');
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LWk8_7EYCjLe-twidsN');
        starCountRef.on('value', (snapshot) => {
            this.props.consultaChats(snapshot.val());
            this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
            // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
        });
    }




    renderTareaDiaria(chatID) {
        this.props.tipoPreguntas('Diaria');
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LWGFo3s87SjzppL7hoF');
        starCountRef.on('value', (snapshot) => {
            this.props.consultaChats(snapshot.val());
            //   console.log(trabajo);
            this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
            // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
        });
    }

    renderRealizarTIC_EXP(chatID) {
        this.props.tipoPreguntas('TIC Quincenal');
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LWhSUV5slo2cbIxl5go');
        starCountRef.on('value', (snapshot) => {
            this.props.consultaChats(snapshot.val());

            this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
            // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
        });
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
        //  if (this.state.avatares)
        //    console.log(this.state.avatares[1]);

        const content = this.props.children
            ? this.props.children
            : <Home user={this.props.user} />



        const y = window.screen.height * 0.48;
        const x2 = 1700 / window.screen.width;
        const x = window.screen.width * 0.17 * x2;


        const wrapper = {
            width: '350px',
            height: '65%',
            position: 'fixed',
            overflow: 'hidden',
            bottom: '8%',
            right: '3%',
            'z-index': '8000',
            'border-radius': '30px',
            'box-shadow': '10px 10px 10px -8px rgba(0, 0, 0, 0.35)',
            'margin-top:': '3%',
            'margin-left': '5%',
            '-webkit-transform': 'scale(0.9)',
            'transform': 'scale(0.9)',
            background: '#fffae7b3',
        }


        ///configuracion responsive
        let tamañoForm = `${this.props.theme} right floated `;

        if (window.screen.width > 500 && window.screen.height < 800) {
            const y = window.screen.height * 0.63;
            wrapper.bottom = '12%';
            //   wrapper.width = '22%';
            wrapper.height = y;
        }
        if (window.screen.width < 500) {
            //  const y = window.screen.height * 0.72;
            wrapper.width = '80%';
            wrapper.bottom = '12%';
            wrapper.height = '90%';
            tamañoForm = ` ${this.props.theme} right floated`;
        }


        return (
            <div className="ui grid" >

                <div className={tamañoForm} style={wrapper} >
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
        userRol: state.chatReducer.userRol,
        isChatUbi: state.chatReducer.isChatUbi,
        usuarioDetail: state.chatReducer.usuarioDetail,
        pasoOnboarding: state.chatReducer.pasoOnboarding,
        isChat: state.chatReducer.isChat,
    });



export default connect(mapAppStateToProps, {
    submitMessage, consultaChats, tipoPreguntas, mensajeEntradas, borrarChats, pasoOnboardings,
    chatIdentifiador, numeroPreguntas, consultaPreguntaControls, endChat, startChat
})(App);
















