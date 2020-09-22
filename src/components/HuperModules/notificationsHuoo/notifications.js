import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { popupBot } from '../../../actions';
import { ApiAiClient } from 'api-ai-javascript';
import { dataBaseManager } from '../../../lib/utils';

let timeoutLength = 10000;
let timeoutLengthG = 10000;
class notifiactions extends React.Component {

    state = { dia: [], etapa: 1, mensajes: null }

    componentDatabase(tipo, path, objectIn, mensaje, mensajeError) {
        let men = dataBaseManager(tipo, path, objectIn, mensaje, mensajeError);
        if (men && men.mensaje)
            this.props.popupBot({ mensaje: men.mensaje });
        return men;
    }

    notificationPriority = () => {
        this.timeout = setTimeout(() => {
               timeoutLength = 90000;

            if (Object.keys(this.dia).length > 0) {
                this.dia['ultimaConexion'] = moment().format('x');
                this.dia['cantIn'] = this.dia.cantIn + 1;
                let ahora = moment().format('x');
                let dif = ahora - this.dia.entrada;
                this.obtenerPaso(dif);
                this.consultarMensajes(this.state.mensajes, dif);
                this.notificationPriority();
            }
            else {
                this.dia['entrada'] = moment().format('x');
                this.dia['cantIn'] = 0;
                console.log(this.dia);
                timeoutLength = timeoutLengthG;
                this.notificationPriority();

            }

            this.componentDatabase('update', `Usuario-Dia/${this.props.userId}/${moment().format("YYYYMMDD")}`, {
                ...this.dia
            });


        }, timeoutLength)
    }


    organizarMensajes(mensajes) {

        Object.keys(mensajes).sort((a, b) => (a.tiempo - b.tiempo));
        Object.keys(mensajes).map((key, index) => {

            this.etapas[mensajes[key].tiempo] = key;
            return mensajes[key];
        });

    }

    obtenerPaso(dif) {

        let flag = true;
        Object.keys(this.etapas).map((key, index) => {

            if (dif <= parseFloat(key) + 6000 && flag) {
                flag = false;
                this.setState({ etapa: this.etapas[key] })
            }
            return this.etapas[key];
        });
    }

    consultarMensajes(mensajes, dif) {
        if (mensajes)
            Object.keys(mensajes).map((key, index) => {
                // console.log(key);
                if (key === this.state.etapa.toString()) {
                    if (dif <= parseFloat(mensajes[key].tiempo) + 6000 && dif >= parseFloat(mensajes[key].tiempo) - 6000) {
                        console.log(mensajes[key].mensaje)
                        this.dia['etapa'] = this.state.etapa;
                        this.dia['etapas'] = this.dia['etapas'] !== undefined ? this.state.etapa + this.dia['etapas'] : this.state.etapa;

                        let men = [];
                        men["mensaje"] = mensajes[key].mensaje;
                        men["header"] = mensajes[key].header ? mensajes[key].header : null;
                        men["sleep"] = mensajes[key].sleep ? mensajes[key].sleep : null;
                        men["dormir"] = mensajes[key].dormir ? mensajes[key].dormir : null;
                        men["activate"] = mensajes[key].activate ? mensajes[key].activate : null;
                        men["chat"] = mensajes[key].chat ? mensajes[key].chat : null;
                        men["agent"] = mensajes[key].agent ? mensajes[key].agent : null;
                        men["previous"] = mensajes[key].previous ? mensajes[key].previous : null;
                        men["music"] = mensajes[key].music ? mensajes[key].music : null;
                        if (mensajes[key].video) {
                            men["link"] = mensajes[key].video;
                            men["video"] = true;
                            men["lection"] = mensajes[key].lection;

                        }
                        this.props.popupBot({ ...men });

                        // this.setState({ etapa: this.state.etapa + 1 });
                    }
                }
                return mensajes[key];
            });
    }

    componentWillMount() {
        this.notificationPriority();
        this.dia = [];
        this.etapas = [];
        this.client = new ApiAiClient({
            accessToken: '4cbf623fd1fc4e2d8ef3d48658a82030 '
        });
        this.client.textRequest('Dame un apoyo hupp', { sessionId: 'test' }).then(this.onResponse);
        const nameRef = this.componentDatabase('get', `Usuario-Dia/${this.props.userId}/${moment().format("YYYYMMDD")}`);
        nameRef.on('value', (snapshot2) => {
            if (snapshot2.val() !== null) {
                this.dia = snapshot2.val();
                this.setState({ etapa: snapshot2.val().etapa ? snapshot2.val().etapa : 1 });
            }

        });


    }

    onResponse = (activity) => {
        activity.result.fulfillment.messages.forEach((element) => {
            if (element.payload !== undefined) {
                let nuevo = element.payload;
                this.setState({ mensajes: nuevo });
                this.organizarMensajes(nuevo);
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