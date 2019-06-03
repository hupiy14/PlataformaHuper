import React from 'react';
import { connect } from 'react-redux';
import '../components/styles/ingresoHupity.css';
import ChatHup from './modules/chatBot/paginaInicio';
import firebase from 'firebase';
import moment from 'moment';
import { Image } from 'semantic-ui-react'
import chat from '../images/chat.png';
import { MensajeIvilys, estadochats } from './modules/chatBot/actions';
import { chatOn, chatOff, } from '../actions';





const timeoutLength = 300;

class MenuChat extends React.Component {


    state = { inicio: "chatGestorAni", lat: null, errorMessage: '', long: null, inicio: false, colorC: '#ffac0000', efecto: null, estadoAnterior: null }


    componentDidMount() {
        window.navigator.geolocation.getCurrentPosition(
            position => { this.setState({ lat: position.coords.latitude }); this.setState({ long: position.coords.longitude }); },
            err => this.setState({ errorMessage: err.message })
        );

    }


    componentDidUpdate() {
        let col = '#edad253b';
        if (!this.props.isChat) {
            col = '#ffac0000';
        }

        if (this.props.estadochat) {
            if (this.props.estadochat === 'pausa')
                col = '#2185d0';
        }

        if (this.state.estadoAnterior !== this.props.isChat) {
            this.setState({ estadoAnterior: this.props.isChat });
            this.setState({ colorC: col });
        }


        if (this.state.lat && this.state.long && !this.state.inicio) {
            const dia = new Date();
            this.setState({ inicio: true })
            var newPostKey2 = firebase.database().ref().child('Rol-Tipologia-Pregunta').push().key;
            firebase.database().ref(`Usuario-Ubicacion/${this.props.usuarioDetail.idUsuario}/${dia.getFullYear()}/${dia.getMonth()}/${dia.getDate()}/${newPostKey2}`).set({
                fecha: moment().format('HH:mm'),
                laitude: this.state.lat,
                longitud: this.state.long
            });

            //Inicio Dia obtiene la hora de inicio




        }
    }

    renderAuthButton() {
        if (this.props.isChat) {
            return (
                <ChatHup />
            );
        }
    }


    handlePasoR = () => {
        this.timeout = setTimeout(() => {
            this.props.chatOn();
        }, timeoutLength)
    }
    onChat = () => {
        if (this.props.isChat) {
            this.props.chatOff();

            this.setState({ efecto: 'chatGestorAni3' });
            if (this.state.inicio === "chatGestorAni")
                this.setState({ inicio: "chatGestorAni2" })
            else
                this.setState({ inicio: "chatGestorAni" })

        } else {

            this.setState({ efecto: null });
            let dateF = new Date();
            if (this.props.usuarioDetail.usuario.fechaPlan)
                dateF = moment(this.props.usuarioDetail.usuario.fechaPlan, 'YYYY/MM/DD').format('YYYY,MM,DD')
            const hoy = new Date(dateF);

            //Reglas de planificacion
            let diaS = moment(hoy);
            if (this.props.MensajeIvily && this.props.MensajeIvily.nActIVi > 5 && this.props.estadochat === 'Despedida') {
                diaS = moment(hoy).add('days', 1);
            
            }
            else {
               
                if (hoy.getDate() < new Date().getDate()) { diaS = moment(hoy).add('days', 1); }
                else if (hoy.getDate() > new Date().getDate()) { diaS = moment(new Date()); }
            }
            const maxdia = this.props.usuarioDetail.usuario.diaSemana ? this.props.usuarioDetail.usuario.diaSemana : 5;
           
            if (moment(diaS).day() > maxdia) {
                diaS = diaS.add('days', new Date(diaS.format('YYYY,MM,DD')).getDay() - (this.props.usuarioDetail.usuario.diaSemana ? this.props.usuarioDetail.usuario.diaSemana - 1 : 4));
            }



          
            const ConsultaAct = firebase.database().ref().child(`Usuario-Activiades/${this.props.usuarioDetail.idUsuario}/${diaS.format('YYYY')}/${diaS.format('MM')}/${diaS.format('DD')}`);
            ConsultaAct.on('value', (snapshot) => {
                this.props.MensajeIvilys({ ...this.props.MensajeIvily, nActIVi: snapshot.val() ? snapshot.val().cantidad : 0 })

            });

            const ConsultaAct2 = firebase.database().ref().child(`Usuario-Inicio/${this.props.usuarioDetail.idUsuario}/${diaS.format('YYYY')}/${diaS.format('MM')}/${diaS.format('DD')}`);
            ConsultaAct2.on('value', (snapshot) => {
                if (snapshot.val())
                    this.props.MensajeIvilys({ ...this.props.MensajeIvily, ...snapshot.val() })
            });

            this.handlePasoR();
        }

    };

    renderMenu() {
        if (this.props.isSignedIn) {


            ///configuracion responsive
            //   console.log(this.state.inicio);
            let ubicacionChat = "foot-chat";
            let className = "massive ui  tiny circular lightbulb outline icon button " + this.state.inicio;
            let className2 = "lightbulb outline icon large icon";
            if (window.screen.width < 500) {

                ubicacionChat = "foot-chatX1";
                className2 = "lightbulb outline small icon";
                className = "massive ui  tiny circular lightbulb outline  icon button";
            }



            return (<div>
                <div className={ubicacionChat} >
                    <button onClick={this.onChat} style={{ background: this.state.colorC, transform: 'scale(0.25)' }} className={className}>
                        <Image size="medium" className={this.state.efecto} style={{ transform: 'scale(1.5)', position: 'relative', top: '19px' }}
                            src={chat} id='2' />
                    </button>

                </div>
                {this.renderAuthButton()}
            </div>);
        }
    }



    render() {



        return (

            <div>
                {this.renderMenu()}
            </div>



        );
    }
};

const mapStateToProps = (state) => {
    return {
        isSignedIn: state.auth.isSignedIn,
        isChat: state.chatReducer.isChat,
        usuarioDetail: state.chatReducer.usuarioDetail,
        MensajeIvily: state.chatReducer.MensajeIvily,
        estadochat: state.chatReducer.estadochat,

    };
};


export default connect(mapStateToProps, { chatOn, chatOff, MensajeIvilys, estadochats })(MenuChat);
