import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { popupBot } from '../../../actions';


let timeoutLength = 30000;
let timeoutLength2 = 30000;
let timeoutLength3 = 30000;
const slack = require('slack')
let token = null;

class notifiactions extends React.Component {

    state = { canales: null, ultimoMensaje: [], numdif: null, primerControl: 0 }


    notificationPriority = () => {
        this.timeout = setTimeout(() => {
            timeoutLength = 900000;
            if (this.state.canales && this.state.canales.reporting)
                this.renderActualizarCanales(this.state.canales.reporting.value, true);
            this.notificationPriority();
        }, timeoutLength)
    }

    notificationEquipo = () => {
        this.timeout = setTimeout(() => {
            timeoutLength2 = 300000;
            if (this.state.canales && this.state.canales.equipo)
                this.renderActualizarCanales(this.state.canales.equipo.value, false);
            this.notificationEquipo();
        }, timeoutLength2)
    }
    notificationOther = () => {
        this.timeout = setTimeout(() => {
            timeoutLength3 = 600000;
            if (this.state.canales && this.state.canales.notifiacaiones)
                this.renderActualizarCanales(this.state.canales.notifiacaiones.value, false);
            this.notificationOther();
        }, timeoutLength3)
    }
    componentWillMount() {
        const nameRef2 = firebase.database().ref().child(`Usuario-Slack/${this.props.userId}`)
        nameRef2.on('value', (snapshot2) => {
            /*this.setState({
              client: SlackOAuthClient.connect(snapshot2.val().tokenB)
            });*/
            /* this.setState({
                 client: SlackOAuthClient.connect(snapshot2.val().tokenP)
             });*/
            if (snapshot2.val()) {
                this.setState({ canales: snapshot2.val() });
                token = snapshot2.val().tokenSlack;
                //console.log(snapshot2.val());
            }
        });

        this.notificationPriority();
        this.notificationEquipo();
        this.notificationOther();
    }



    renderActualizarCanales(channel, Priority) {
        //obtiene el historico y envia el mensaje

        slack.conversations.history({ token, channel, count: 10 }).then(res => {
            res.messages.sort((a, b) => (a.ts + b.ts))
            let mensajeUltimo = null;
            let NumMensajes = 0;
            let flagEnc = false;
            let user = null;
            //recorro todos los mensajes
            //console.log(res.messages);
            Object.keys(res.messages).map((key, index) => {
                //en la primera pregunto si son distintos
                if (index === 0) {
                    //actualizo auxi
                    if (this.state.ultimoMensaje[channel] !== res.messages[key].text) {
                        mensajeUltimo = res.messages[key].text;
                        user = res.messages[key].user;
                    }
                    else
                        flagEnc = true;
                }
                else {
                    if (this.state.ultimoMensaje[channel] === res.messages[key].text) {
                        flagEnc = true;
                    }
                    if (flagEnc === false)
                        NumMensajes++;

                }
                return res.messages[key];

            });

            if (mensajeUltimo !== null && user != null && user !== this.state.canales.usuarioSlackl) {

                slack.users.info({ token, user }).then(res2 => {
                    let numero = NumMensajes > 0 ? NumMensajes : null;
                    let ultimo = this.state.ultimoMensaje;
                    ultimo[channel] = mensajeUltimo;
                    this.setState({ ultimoMensaje: ultimo })
                    console.log(user)
                    if (mensajeUltimo.includes('<@'))
                        mensajeUltimo = mensajeUltimo.replace('<@' + user + '>', res2.user.real_name);
                    if (this.state.primerControl > 2)
                        this.props.popupBot({ header: res2.user.real_name, mensaje: mensajeUltimo, numero, link: 'https://app.slack.com/client/', Priority });
                    else
                        this.setState({ primerControl: this.state.primerControl + 1 })
                });


            }

        });

    }

    render() {
        return (<div>
        </div>);
    }
};

const mapAppStateToProps = (state) => (
    {
        numeroTareasTerminadas: state.chatReducer.numeroTareasTerminadas,
        popupDetalle: state.chatReducer.popupDetalle,
        listaObjetivo: state.chatReducer.listaObjetivo,
        prioridadObj: state.chatReducer.prioridadObj,
        usuarioDetail: state.chatReducer.usuarioDetail,
        selObjetivo: state.chatReducer.selObjetivo,
        MensajeIvily: state.chatReducer.MensajeIvily,
        userId: state.auth.userId,

    });


export default connect(mapAppStateToProps, { popupBot })(notifiactions);