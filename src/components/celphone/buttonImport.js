import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Image, Popup } from 'semantic-ui-react';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, pasoOnboardings, estadochats, MensajeIvilys } from '../modules/chatBot/actions';
import trello from '../../images/trello.png';
import asana from '../../images/asana.png';
import googleSheet from '../../images/googleSheet.png';
import clickup from '../../images/clickup.png';
import asanaH from '../../apis/asana';
import { clientIdAsana, clientSecrectAsana } from '../../apis/stringConnection';
import axios from 'axios';
import { popupBot } from '../../actions';
var Trello = require("trello");

class importButton extends React.Component {


    state = { asana: null }
    componentDidMount() {

        window.$('#all').click(function () {
            window.$('ul.tasks li').slideDown(300);
        });

        window.$('#one').click(function () {
            window.$('.tasks li:not(.one)').slideUp(300, function () {
                window.$('.one').slideDown(300);

            });
        });

        window.$('#two').click(function () {
            window.$('.tasks li:not(.two)').slideUp(300, function () {
                window.$('.two').slideDown(300);

            });
        });
        window.$('#three').click(function () {
            window.$('.tasks li:not(.three)').slideUp(300, function () {
                window.$('.three').slideDown(300);

            });
        });
    }

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

        //   let tpasana = this.props.usuarioDetail.usuario.asana ? 'red' : 'gray';
        let tpasanaImg = this.props.usuarioDetail.usuario.asana ? '0' : '1';
        let tpTrelloImg = this.props.usuarioDetail.usuario.trello ? '0' : '1';
        //  let tpTrello = this.props.usuarioDetail.usuario.trello ? 'blue' : 'gray';


        return (

            <div className="filter-btn2" style={{ position: 'relative', left: '15%', top: '5.5em' }} >
                <a onClick={() => {  window.$('.filter-btn2').removeClass('open'); this.setState({ tipo: 'OKR' }); this.renderActivitisTrello(); }} id="one" href="#one"><Image alt='sincroniza trello' src={trello} size="mini" style={{ transform: 'scale(0.7)', filter: 'grayscale(' + tpTrelloImg + ')' }}></Image></a>
                <a onClick={() => {  window.$('.filter-btn2').removeClass('open'); this.setState({ tipo: 'Task' }); this.renderActivitisAsana(); }} id="two" href="#two"><Image alt='sincroniza asana' src={asana} size="mini" style={{ transform: 'scale(0.7)', filter: 'grayscale(' + tpasanaImg + ')' }}></Image></a>
                <a onClick={() => {  window.$('.filter-btn2').removeClass('open'); this.setState({ tipo: 'Flow' }); }} id="three" href="#three"><Image alt='sincroniza googleSheet' src={googleSheet} size="mini" style={{ transform: 'scale(0.7)', filter: 'grayscale(1)' }}></Image></a>
                <a onClick={() => {  window.$('.filter-btn2').removeClass('open'); this.setState({ tipo: 'Profile' }); }} id="all" href="#all"><Image alt='sincroniza clickup' src={clickup} size="mini" style={{ transform: 'scale(0.7)', filter: 'grayscale(1)' }}></Image></a>
                <span className="toggle-btn ion-android-upload" onClick={() => { window.$('.filter-btn2').toggleClass('open'); }}></span>
            </div>


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