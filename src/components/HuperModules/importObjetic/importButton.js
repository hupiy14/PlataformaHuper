import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Image, Popup } from 'semantic-ui-react';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, pasoOnboardings, estadochats, MensajeIvilys } from '../../modules/chatBot/actions';
import './importBut.scss';
import trello from '../../../images/trello.png';
import asana from '../../../images/asana.png';
import googleSheet from '../../../images/googleSheet.png';
import clickup from '../../../images/clickup.png';
import asanaH from '../../../apis/asana';
import { clientIdAsana, clientSecrectAsana } from '../../../apis/stringConnection';
import axios from 'axios';
import { popupBot } from '../../../actions';
var Trello = require("trello");

class importButton extends React.Component {


    state = { asana: null }

    renderActivitisAsana() {
        if (this.props.usuarioDetail.usuario.asana) {
            const starCountRef = firebase.database().ref().child(`Usuario-Asana/${this.props.usuarioDetail.idUsuario}`);
            starCountRef.on('value', (snapshot) => {
                if (snapshot.val()) {
                    this.setState({ asana: snapshot.val() });
                    this.setState({ projectsIdAsana: snapshot.val().project ? snapshot.val().project : null })
                    this.setState({ sectionsAsana: snapshot.val().section ? snapshot.val().section : null })
                    axios.post(`https://cors-anywhere.herokuapp.com/https://app.asana.com/-/oauth_token`, null, {
                        params: {
                            grant_type: 'refresh_token',
                            client_id: clientIdAsana, 'client_secret': clientSecrectAsana,
                            redirect_uri: window.location.origin, code: snapshot.val().code, 'refresh_token': snapshot.val().rToken
                        }
                    }).then(res => {
                        asanaH.get('/api/1.0/sections/' + this.state.asana.section.value + '/tasks', { headers: { Authorization: 'Bearer ' + res.data.access_token }, params: { opt_fields: 'name,completed,created_at' } }).then((res2) => {

                            console.log(res2);
                            let listObj = res2.data.data;
                            let list = [];
                            Object.keys(listObj).map((key, index) => {
                                if (!listObj[key].completed) {
                                    let obj = [];
                                    obj['concepto'] = listObj[key].name;
                                    obj['dificultad'] = '3';
                                    obj['estado'] = 'activo';
                                    obj['fecha'] = listObj[key].created_at;
                                    obj['impacto'] = '1';
                                    obj['keyResult1'] = 'Migrado de Asana 2';
                                    obj['keyResult2'] = '';
                                    obj['tipologia'] = '1';
                                    obj['tipo'] = 'asana';
                                    list[listObj[key].gid] = obj;
                                }
                                return listObj[key];
                            });

                            const starCountRef2 = firebase.database().ref().child(`Usuario-OKR/${this.props.usuarioDetail.idUsuario}`);
                            starCountRef2.on('value', (snapshot) => {
                                if (snapshot.val()) {

                                    list = { ...snapshot.val(), ...list };
                                    console.log(list);
                                    firebase.database().ref(`Usuario-OKR/${this.props.usuarioDetail.idUsuario}`).set({ ...list });
                                }
                            });
                            this.props.popupBot({ mensaje: 'He cargado tus nuevos objetivos de Asana' });

                        }).catch(err => { this.props.popupBot({ mensaje: 'He tenido un probema !!!' }); });
                    }
                    ).catch(err => { this.props.popupBot({ mensaje: 'He tenido un probema  en confimar tu usuario!!!' }); })

                }
                else {
                    this.props.popupBot({ mensaje: 'Aun nos falta configurar tu Asana' });
                }

            });
        }
        else {
            this.props.popupBot({ mensaje: 'Aun nos falta configurar tu Asana' });
        }
    }


    renderActivitisTrello() {
        if (this.props.usuarioDetail.usuario.trello) {

            const starCountRef = firebase.database().ref().child(`Usuario-Trello/${this.props.usuarioDetail.idUsuario}`);
            starCountRef.on('value', (snapshot) => {
                if (snapshot.val()) {

                    let trelloClient = snapshot.val();

                    let trello = new Trello(trelloClient.trelloApi, trelloClient.tokenTrello);
                    trello.makeRequest('get', '/1/lists/' + trelloClient.listaObjetivostoDO.value + '/cards', { webhooks: true }).then((res) => {
                        console.log(res);


                        let listObj = res;
                        let list = [];
                        Object.keys(listObj).map((key, index) => {
                            if (!listObj[key].completed) {
                                let obj = [];
                                obj['concepto'] = listObj[key].name;
                                obj['dificultad'] = '3';
                                obj['estado'] = 'activo';
                                obj['fecha'] = listObj[key].dateLastActivity;
                                obj['impacto'] = '1';
                                obj['keyResult1'] = 'Migrado de Trello';
                                obj['keyResult2'] = '';
                                obj['tipologia'] = '1';
                                obj['tipo'] = 'trello';
                                list[listObj[key].id] = obj;
                            }
                            return listObj[key];
                        });

                        const starCountRef2 = firebase.database().ref().child(`Usuario-OKR/${this.props.usuarioDetail.idUsuario}`);
                        starCountRef2.on('value', (snapshot) => {
                            if (snapshot.val()) {

                                list = { ...snapshot.val(), ...list };
                                console.log(list);
                                firebase.database().ref(`Usuario-OKR/${this.props.usuarioDetail.idUsuario}`).set({ ...list });
                            }
                        });
                        this.props.popupBot({ mensaje: 'He cargado tus nuevos objetivos de Asana' });
                    }).catch(err => { this.props.popupBot({ mensaje: 'He tenido un probema !!!' }); });


                }
                else {
                    this.props.popupBot({ mensaje: 'Aun nos falta configurar tu Trello' });
                }
            })
        }
        else {
            this.props.popupBot({ mensaje: 'Aun nos falta configurar tu Asana' });
        }
    }




    notificationOther = (list) => {
        this.timeout = setTimeout((list) => {

        }, 5000)
    }
    render() {

        let tpasana = this.props.usuarioDetail.usuario.asana ? 'red' : 'gray';
        let tpasanaImg = this.props.usuarioDetail.usuario.asana ? '0' : '1';
        let tpTrelloImg = this.props.usuarioDetail.usuario.trello ? '0' : '1';
        let tpTrello = this.props.usuarioDetail.usuario.trello ? 'blue' : 'gray';


        return (


            <Popup style={{ top: '2em', left: '300px' }}
                trigger={
                    <div>
                        <nav className="menus" style={{
                            position: 'relative',
                            top: '2em',
                            transform: 'rotate(90deg) scale(1.1)',
                            zIndex: '1',
                            left: '-7%'


                        }}>
                            <input type="checkbox" href="1" className="menus-open" name="menus-open" id="menus-open" />
                            <label className="menus-open-button" htmlFor="menus-open">
                                <span className="liness lines-1"></span>
                                <span className="liness lines-2"></span>
                                <span className="liness lines-3"></span>
                            </label>

                            <a href="#" onClick={() => { this.renderActivitisTrello() }} className={`menus-item ${tpTrello}`}> <Image alt='sincroniza trello' src={trello} size="mini" style={{ top: '1.6em', left: '1.6em', transform: 'rotate(-90deg)', filter: 'grayscale(' + tpTrelloImg + ')' }}></Image> </a>
                            <a href="#" onClick={() => { this.renderActivitisAsana() }} className={`menus-item ${tpasana}`}> <Image alt='sincroniza asana' src={asana} size="mini" style={{ top: '1.6em', left: '1.6em', transform: 'rotate(-90deg)', filter: 'grayscale(' + tpasanaImg + ')' }}></Image> </a>
                            <a href="#" className="menus-item gray"> <Image alt='sincroniza googleSheet' src={googleSheet} size="mini" style={{ top: '1.6em', left: '1.6em', transform: 'rotate(-90deg)', filter: 'grayscale(1)' }}></Image> </a>
                            <a href="#" className="menus-item gray"> <Image alt='sincroniza clickup' src={clickup} size="mini" style={{ top: '1.6em', left: '1.6em', transform: 'rotate(-90deg)', filter: 'grayscale(1)' }}></Image></a>

                        </nav>
                    </div>}
            >
                <Popup.Content >
                    <h5 >Importa tus objetivos</h5>
                </Popup.Content>
            </Popup>





        );
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


export default connect(mapAppStateToProps, { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, estadochats, pasoOnboardings, MensajeIvilys, popupBot })(importButton);