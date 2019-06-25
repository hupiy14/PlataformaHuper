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
    tipoPreguntas, endChat, startChat, borrarChats, pasoOnboardings, MensajeIvilys, consultas, estadochats, setUbicacion
} from './actions';
import firebase from 'firebase';
import _ from 'lodash';
import moment from 'moment';
import Avatar from '../../../apis/xpress';



const timeoutLength = 20;
const TIM_Sem = ['-LekIihkesH_WPL9f624', '-LekJr_nu74fVLVahibh', '-LekJMj3-rwVXgPFojaK'] //2
const TIM_Med = ['-LekKwo9EJUp9fVE5Yex', '-LekKv_Vsij6ttgXmttU', '-LekI_vYF1zGvglusBXr'] //4
const TIM_Obj = ['-LekL3NOrjyYW8PsT-Vq', '-LekISO8phY6r4v3EYRD', '-LeknuHNolKbHgs7Visj'] //3

class App extends React.Component {

    state = { avatares: null, horaMax: 8, mensajeInicio: null }


    // habilita el primer paso
    handlePaso = (chatID) => {
        this.timeout = setTimeout(() => {

            if (this.props.listaObjetivo && this.props.listaObjetivo.tareas) {
                let valTl = 0;
                const arrayObj = this.props.listaObjetivo.tareas;
                Object.keys(arrayObj).map((key, index) => {
                    const arrayAct = arrayObj[key];
                    Object.keys(arrayAct).map((key2, index) => {
                        if (arrayAct[key2].estado === 'trabajando')
                            valTl++;
                    });
                });
                if (valTl === 0)
                    this.props.estadochats('Seguimiento Inicio');
            }


            if (this.props.userRol === '3') {
                if (this.props.usuarioDetail.usuario.fechaPlan === moment(new Date()).format('YYYY/MM/DD')) {

                    if (this.props.MensajeIvily.inicio) { ///comienza el dia 

                        console.log(1);
                        if (this.props.MensajeIvily.nActIVi < 6) { /// no tiene todas las actividades
                            if (!this.props.listaObjetivo || !this.props.listaObjetivo.objetivos)
                                this.renderTareaDiariaDU(chatID);
                            else
                                this.renderTareaDiariaD(chatID);
                            console.log(2);
                            return;
                        }
                        if (this.props.estadochat === 'pausa') { // se encuentra en pauda
                            this.renderContinuarTrabajo(chatID);
                            console.log(3);
                            return;
                        }
                        else if (this.props.estadochat === 'seguimienT' || this.props.estadochat === 'seguimiento') { // se encuentra en seguimiento
                            this.rendeSeguimientoTrabajo(chatID);
                            console.log(4);
                            return;
                        }
                        else if (this.props.estadochat === 'TIM objetivo') { // Validacion TIM del Objetivo
                            this.rendeTalentoImpCom(chatID, 0)
                            console.log(5);
                            return;
                        }
                        else if (this.props.estadochat === 'TIM Media') { // Validacion TIM de la mitad Semana
                            this.rendeTalentoImpCom(chatID, 1)
                            console.log(6);
                            return;
                        }
                        else if (this.props.estadochat === 'Seguimiento Inicio') { // Validacion TIM de la mitad Semana
                            this.rendeSeguimientoTrabajoU(chatID, 1)
                            console.log(16);
                            return;
                        }
                        else if (this.props.estadochat === 'TIM Semana') { // Validacion TIM fin de semana
                            this.rendeTalentoImpCom(chatID, 2)
                            console.log(7);
                            return;
                        }

                        else if (this.props.estadochat === 'Objetivos Terminados') {
                            // this.renderFinalizarTrabajo(chatID);
                            this.renderTareaDiariaD(chatID);
                            console.log(8);
                            return;
                        }
                        else if (this.props.estadochat === 'Termino dia') ///Planificacion para el dia siguiente
                        {
                            this.renderFinalizarTrabajo(chatID);
                            this.props.estadochats('Despedida')
                            console.log(9);
                            return;
                        }
                        else if (this.props.estadochat === 'Despedida') ///Planificacion para el dia siguiente
                        {

                            const nameRef2 = firebase.database().ref().child('Mensaje-ChatBot').child(`DespedidaPlan`);
                            nameRef2.on('value', (snapshot2) => {
                                const mensaje = snapshot2.val().concepto;
                                const result = _.replace(mensaje, /@nombre/g, this.props.nombreUser);
                                this.props.submitMessage(result, chatID, '6');
                            });

                            this.setState({ mensajeInicio: true });
                            this.renderTareaDiaria(chatID);
                            console.log(10);
                            return;
                        }
                        this.renderConsultaTrabajo(chatID);// exporadico




                    }
                    else {

                        if (this.props.MensajeIvily.nActIVi < 6) { /// no tiene todas las actividades

                            if (!this.state.mensajeInicio) {
                                const nameRef2 = firebase.database().ref().child('Mensaje-ChatBot').child(`SaludoPlan`);
                                nameRef2.on('value', (snapshot2) => {
                                    const mensaje = snapshot2.val().concepto;
                                    const result = _.replace(mensaje, /@n/g, this.props.MensajeIvily.nActIVi);
                                    this.props.submitMessage(result, chatID, '6');
                                });
                            }
                            this.setState({ mensajeInicio: true });

                            if (!this.props.listaObjetivo || !this.props.listaObjetivo.objetivos)
                                this.renderTareaDiariaDU(chatID);
                            else
                                this.renderTareaDiariaD(chatID);
                            console.log(11);
                        }
                        else {


                            if (this.props.estadochat === 'Seguimiento Inicio') { // Validacion TIM de la mitad Semana
                                this.rendeSeguimientoTrabajoU(chatID, 1)
                                console.log(16);
                                return;
                            }

                            this.rendeSeguimientoTrabajo(chatID);
                            console.log(12);
                        }
                    }



                }
                else {
                    if (this.props.MensajeIvily && this.props.MensajeIvily.nActIVi < 6) { /// no tiene todas las actividades

                        if (!this.state.mensajeInicio) {
                            const nameRef2 = firebase.database().ref().child('Mensaje-ChatBot').child(`SaludoPlan`);
                            nameRef2.on('value', (snapshot2) => {
                                const mensaje = snapshot2.val().concepto;
                                const result = _.replace(mensaje, /@n/g, this.props.MensajeIvily.nActIVi);
                                this.props.submitMessage(result, chatID, '6');
                            });
                        }
                        this.setState({ mensajeInicio: true });
                        if (!this.props.listaObjetivo || !this.props.listaObjetivo.objetivos)
                            this.renderTareaDiariaUD(chatID);
                        else
                            this.renderTareaDiariaD(chatID);

                        console.log(13);
                    }
                    else {
                        console.log(14);

                        if (this.props.MensajeIvily && this.props.MensajeIvily.tiempoTrabajado && parseInt(moment(this.props.MensajeIvily.tiempoTrabajado, 'HH:mm').format('HH')) < 8)
                            this.rendeSeguimientoTrabajo(chatID);
                        //Mensaje de no trabajo
                    }
                }
            }
            else if (this.props.userRol === '2') {
                this.props.tipoPreguntas('Consulta Gestor');
                const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LXt_TDJQilcvBxWh955');
                starCountRef.on('value', (snapshot) => {
                    this.props.consultaChats(snapshot.val());

                    this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
                    // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
                });
            }
            if (!this.state.mensajeInicio)
                this.props.submitMessage('@<Hola Huper@<', chatID, '6');
            this.setState({ mensajeInicio: null });
        }, timeoutLength)
    }




    componentDidMount() {

        this.props.numeroPreguntas(1); ///borra el chat    
        this.props.consultaPreguntaControls(1);
        this.props.consultaChats(null);
        this.props.consultas(null);
        this.props.borrarChats(this.props.user.activeChat.participants);
        //this.props.endChat('6');
        //this.props.startChat('6');
        this.props.chatIdentifiador('6');
        const chatID = '13';
        if (this.props.mensajeEnt) {
            const x = Math.round(Math.random() * (2)) + 1;
            const nameRef2 = firebase.database().ref().child('Mensaje-ChatBot').child(`Saludo/${x}`);
            nameRef2.on('value', (snapshot2) => {
                const mensaje = snapshot2.val().concepto;
                const result = _.replace(mensaje, /@nombre/g, this.props.nombreUser);
                //    const imf = <Image src='https://xpresso2.mobigraph.co/xpresso/v2/media/1bfaLcimzkhPQ2w9jwolG3qxXUqmdjw-1/7d140000.gif' size='small' />;
                this.props.submitMessage(result, chatID, '6');
                this.props.mensajeEntradas(false);
            });
            this.setState({ mensajeInicio: true });
        }

        this.handlePaso(chatID);
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

            //   if (this.props.pasoOnboarding === 0 || this.props.usuarioDetail.usuario.onboarding) {
            // this.rendeSeguimientoTrabajo(chatID);
            // this.rendeTalentoImpCom(chatID);
            // if (this.props.MensajeIvily && this.props.MensajeIvily.nActIVi > 5)
            //   this.rendeSeguimientoTrabajo(chatID);
            // else
            // this.renderTareaDiaria(chatID);




            //******************************************************************************************************** */
            //Primera Regla si no se ha planificado el dia anterior se debe planificar el dia de inicio




            //******************************************************************************************************* */





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

        }

    }

    renderContinuarTrabajo(chatID) {
        this.props.tipoPreguntas('ContinuarTrabajo');
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-Lg7m_frD1fsRs_0db-N');
        starCountRef.on('value', (snapshot) => {
            this.props.consultaChats(snapshot.val());
            this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
        });

    }

    renderConsultaTrabajo(chatID) {
        this.props.tipoPreguntas('Editar');
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LWekXxzIhU5ezBWot-t');
        starCountRef.on('value', (snapshot) => {
            this.props.consultaChats(snapshot.val());
            this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
            // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
        });

    }

    renderFinalizarTrabajo(chatID) {
        this.props.tipoPreguntas('Despedida');
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LWl1r4nhd8kxizVeVWv');
        starCountRef.on('value', (snapshot) => {
            this.props.consultaChats(snapshot.val());
            const mensaje = snapshot.val()[this.props.numeroPregunta].concepto;
            let result = _.replace(mensaje, /@nombre/g, this.props.nombreUser);
            result = _.replace(result, /@n/g, this.props.MensajeIvily.nActIVi);

            this.props.submitMessage(result, chatID, this.props.idChatUser);
            // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
        });

    }



    //Pregunta TIC
    rendeTalentoImpCom(chatID, tipo) {
        this.props.tipoPreguntas('TIC');
        const x = Math.round(Math.random() * (2));
        let arrayTIC = [];
        if (tipo === 0)
            arrayTIC = TIM_Obj;
        else if (tipo === 1)
            arrayTIC = TIM_Med;
        else if (tipo === 2)
            arrayTIC = TIM_Sem;

        const starCountRef = firebase.database().ref().child(`Preguntas-Chat/${arrayTIC[x]}`);
        starCountRef.on('value', (snapshot) => {

            const mensaje = snapshot.val()[this.props.numeroPregunta].concepto;
            const result = _.replace(mensaje, /@n/g, this.props.MensajeIvily.nActIVi);
            this.props.consultaChats(snapshot.val());
            this.props.submitMessage(result, chatID, this.props.idChatUser);
            // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
        });
    }




    //Seguimiento
    rendeSeguimientoTrabajoU(chatID) {
        this.props.tipoPreguntas('Seguimiento Inicio');
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LgfcxXGdxcQUnESu34r');
        starCountRef.on('value', (snapshot) => {
            this.props.consultaChats(snapshot.val());
            this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
            // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
        });
    }
    rendeSeguimientoTrabajo(chatID) {
        this.props.tipoPreguntas('Seguimiento');
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LWk8_7EYCjLe-twidsN');
        starCountRef.on('value', (snapshot) => {
            this.props.consultaChats(snapshot.val());
            this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto, chatID, this.props.idChatUser);
            // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
        });
    }


    renderTareaDiariaD(chatID) {
        this.props.tipoPreguntas('Diaria');
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LgWkJYCoe1SyY4rDqWO');
        starCountRef.on('value', (snapshot) => {
            this.props.consultaChats(snapshot.val());
            //   console.log(trabajo);
            this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto + ', ¡Recuerda planificar solo 6 actividades al día!', chatID, this.props.idChatUser);
            // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
        });
    }
    renderTareaDiariaUD(chatID) {
        this.props.tipoPreguntas('Diaria');
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LgWkPpwDzR9otHnn92I');
        starCountRef.on('value', (snapshot) => {
            this.props.consultaChats(snapshot.val());
            //   console.log(trabajo);
            this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto + ', ¡Recuerda planificar solo 6 actividades al día!', chatID, this.props.idChatUser);
            // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
        });
    }
    renderTareaDiariaU(chatID) {
        this.props.tipoPreguntas('Diaria');
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LgWjtj5b2vHVj1fPnm6');
        starCountRef.on('value', (snapshot) => {
            this.props.consultaChats(snapshot.val());
            //   console.log(trabajo);
            this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto + ', ¡Recuerda planificar solo 6 actividades al día!', chatID, this.props.idChatUser);
            // this.props.numeroPreguntas(this.props.numeroPregunta + 1);
        });
    }

    renderTareaDiaria(chatID) {
        this.props.tipoPreguntas('Diaria');
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LWGFo3s87SjzppL7hoF');
        starCountRef.on('value', (snapshot) => {
            this.props.consultaChats(snapshot.val());
            //   console.log(trabajo);
            this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto + ', ¡Recuerda planificar solo 6 actividades al día!', chatID, this.props.idChatUser);
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
            height: '650px',
            position: 'fixed',
            overflow: 'hidden',
            bottom: '8%',
            right: '3%',
            'z-index': '100000',
            'border-radius': '30px',
            'box-shadow': 'rgb(241, 230, 190) -3px 3px 20px 8px',
            'margin-top:': '3%',
            'margin-left': '5%',
            '-webkit-transform': 'scale(0.9)',
            'transform': 'scale(0.9)',
            background: '#fffae7b3',
        }


        ///configuracion responsive
        let tamañoForm = `${this.props.theme} right floated `;


        if (window.screen.width <= 500) {
            //  const y = window.screen.height * 0.72;


            // console.log(messages.scrollHeight);
            //console.log( messages.scrollTop);
            // messages.scrollTop = messages.scrollHeight; 

            wrapper.width = window.screen.width;

            wrapper.bottom = "-3%";
            wrapper.height = window.screen.height - 30;
            if (this.props.celChat === true) {
                wrapper.height = window.screen.height + 25 ;
                wrapper.bottom = "-4%";
            }

            wrapper.right = '0%';

            wrapper.background = "#fffbee";
            //   wrapper.bottom = '12%';

            tamañoForm = `  ${this.props.theme} right floated `;
        }


        return (
            <div className="ui grid" >

                <div className={tamañoForm + 'animationIntro'} id="chatInt" style={wrapper} >
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
        MensajeIvily: state.chatReducer.MensajeIvily,
        listaObjetivo: state.chatReducer.listaObjetivo,
        estadochat: state.chatReducer.estadochat,
        isChat: state.chatReducer.isChat,
        celChat: state.chatReducer.celChat,
    });



export default connect(mapAppStateToProps, {
    submitMessage, consultaChats, tipoPreguntas, mensajeEntradas, borrarChats, consultas, pasoOnboardings, setUbicacion,
    chatIdentifiador, numeroPreguntas, consultaPreguntaControls, endChat, startChat, MensajeIvilys, estadochats
})(App);
















