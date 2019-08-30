import React from 'react';
import { connect } from 'react-redux';
import '../components/styles/ingresoHupity.css';
import ChatHup from './modules/chatBot/paginaInicio';
import firebase from 'firebase';
import moment from 'moment';
import { Image } from 'semantic-ui-react'
import chat from '../images/chat2.png';
import { MensajeIvilys, estadochats, datoCloses } from './modules/chatBot/actions';
import { chatOn, chatOff, } from '../actions';


const timeoutLength = 500;


class MenuChat extends React.Component {


    state = { inicio: "chatGestorAni4", lat: null, errorMessage: '', long: null, inicio: false, colorC: '#ffac0000', efecto: null, estadoAnterior: null, colorPausa: '#f5deb3' }


    componentDidMount() {
        window.navigator.geolocation.getCurrentPosition(
            position => { this.setState({ lat: position.coords.latitude }); this.setState({ long: position.coords.longitude }); },
            err => this.setState({ errorMessage: err.message })
        );

        this.setState({ inicio: window.screen.width <= 500 ? 'chatGestorAni4Cel' : 'chatGestorAni4' });
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
           
            this.props.datoCloses(true);     
            this.props.chatOff();
           

            if (this.state.inicio === "chatGestorAni" || this.state.inicio === "chatGestorAniCel")
                this.setState({ inicio: window.screen.width <= 500 ? 'chatGestorAni2Cel' : 'chatGestorAni2' })
            else
                this.setState({ inicio: window.screen.width <= 500 ? 'chatGestorAniCel' : 'chatGestorAni' })

        } else {

            if (!this.props.usuarioDetail) return;
            this.setState({ efecto: null });
            let dateF = new Date();
            if (this.props.usuarioDetail && this.props.usuarioDetail.usuario.fechaPlan)
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
            const maxdia = this.props.usuarioDetail && this.props.usuarioDetail.usuario.diaSemana ? this.props.usuarioDetail.usuario.diaSemana : 5;

            if (moment(diaS).day() > maxdia) {
                diaS = diaS.add('days', new Date(diaS.format('YYYY,MM,DD')).getDay() - (this.props.usuarioDetail.usuario.diaSemana ? this.props.usuarioDetail.usuario.diaSemana - 1 : 4));
            }

            if (moment(moment(diaS).format('YYYY-MM-DD')) < moment())
                diaS = moment();
          //  console.log(diaS.format('YYYY-MM-DD'));

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
        if (this.props.isSignedIn && this.props.celPerf != 'menu') {


            let btChat =
                <div className={"foot-chat"} >
                    <button onClick={()=>{this.onChat()}} style={{ background: this.state.colorC, transform: 'scale(0.25)' }} className={"massive ui  tiny circular lightbulb outline icon button " + this.state.inicio}>
                        <Image size="medium" style={{ transform: 'scale(1.5)', position: 'relative', top: '19px' }}
                            src={chat} id='2' />
                    </button>

                </div>;



            ///configuracion responsiv

            if (window.screen.width <= 500) {
                btChat =
                    <div style={{

                        position: 'fixed', left: '82%', width: '8em', bottom: '-8%', transform: 'scale(1.5)', 'z-index': '6'
                    }}>
                        <button onClick={()=>{this.onChat()}}  style={{ background: this.state.colorC, transform: 'scale(0.5)', left: ' -1.1em', top: '-1em', position: 'relative' }} className={"massive ui  tiny circular lightbulb outline icon button " + this.state.inicio}>

                            <Image size="medium" style={{ transform: 'scale(1.8)', position: 'relative' }}
                                src={chat} id='2' />
                        </button>

                    </div>

            }



            return (
                <div>
                    {btChat}
                    {this.renderAuthButton()}
                </div>
            );
        }
    }

    pausaProceso() {
        if (this.props.MensajeIvily && this.props.MensajeIvily.inicio && this.props.estadochat !== 'pausa') {
            let dateF = new Date();
            if (this.props.usuarioDetail.usuario.fechaPlan)
                dateF = moment(this.props.usuarioDetail.usuario.fechaPlan, 'YYYY/MM/DD').format('YYYY,MM,DD')
            const hoy = new Date(dateF);
            const diaS = moment(hoy).add('days', hoy.getDay() > 5 ? hoy.getDay() - 4 : this.props.usuarioDetail.usuario.fechaPlan && new Date().getDay() !== hoy.getDay() ? 1 : 0);
            const tiempo = new Date().getTime();
            let ant = moment(new Date(this.props.MensajeIvily.horaActivacion ? this.props.MensajeIvily.horaActivacion : this.props.MensajeIvily.inicio));
            let hora = moment().add('minutes', -ant.minutes()).add('hours', -ant.hours());
            if (this.props.MensajeIvily.horaActivacion) {
                hora = moment(this.props.MensajeIvily.tiempoTrabajado, 'HH:mm').add('hours', parseInt(moment(hora).format('HH'))).add('minutes', parseInt(moment(hora).format('mm')));
            }


            firebase.database().ref(`Usuario-Inicio/${this.props.userId}/${diaS.format('YYYY')}/${diaS.format('MM')}/${diaS.format('DD')}`).set({
                ...this.props.MensajeIvily,
                horaPausa: tiempo,
                tiempoTrabajado: hora.format('HH:mm'),
                estado: 'pausa'
            });
            this.props.estadochats('pausa');
            this.handleCloseChat();
        }
    }
    handleCloseChat = () => {
        this.timeout = setTimeout(() => {
            this.props.chatOff();
         
        }, timeoutLength)
    }

    render() {

        let pausabt = null;

        if (this.props.tipoPregunta !== 'Diaria' && this.props.tipoPregunta && this.props.MensajeIvily && this.props.MensajeIvily.inicio) {
            pausabt = <button onClick={() => { this.pausaProceso() }}
                style={{ background: 'linear-gradient(to right, rgb(239, 163, 26) 10%, rgb(243, 130, 38) 80%)', position: 'fixed', color: this.props.estadochat === 'pausa' ? '#593b03' : '#f5deb3', left: window.screen.width > 500 ? '97.5%' : '90%', bottom: '8%', 'z-index': '6' }}
                className='ui button circular pause circle outline icon' >
                <i className=" ui pause circle outline icon" style={{ transform: 'scale(2.4)' }}></i>
            </button>
        }



        return (

            <div>
                {pausabt}
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
        tipoPregunta: state.chatReducer.tipoPregunta,
        celPerf: state.chatReducer.celPerf,

    };
};


export default connect(mapStateToProps, { chatOn, chatOff, datoCloses, MensajeIvilys, estadochats })(MenuChat);
