import React from 'react';
import { connect } from 'react-redux';
import '../components/styles/ingresoHupity.css';
import ChatHup from './modules/chatBot/paginaInicio';
import firebase from 'firebase';

import moment from 'moment';

import { chatOn, chatOff } from '../actions';


class MenuChat extends React.Component {


    state = { inicio: "chatGestorAni", lat: null, errorMessage: '', long: null, inicio: false }


    componentDidMount() {
        window.navigator.geolocation.getCurrentPosition(
            position => { this.setState({ lat: position.coords.latitude }); this.setState({ long: position.coords.longitude }); },
            err => this.setState({ errorMessage: err.message })
        );

    }


    componentDidUpdate() {

        if (this.state.lat && this.state.long && !this.state.inicio) {
            const dia = new Date();
            this.setState({inicio: true})
            var newPostKey2 = firebase.database().ref().child('Rol-Tipologia-Pregunta').push().key;
            firebase.database().ref(`Usuario-Ubicacion/${this.props.usuarioDetail.idUsuario}/${dia.getFullYear()}/${dia.getMonth()}/${dia.getDate()}/${newPostKey2}`).set({
                fecha: moment().format('HH:mm'),
                laitude: this.state.lat,
                longitud: this.state.long
            });
        }
    }

    renderAuthButton() {
        if (this.props.isChat) {
            return (
                <ChatHup />
            );
        }
    }


    onChat = () => {
        if (this.props.isChat) {
            this.props.chatOff();
            if (this.state.inicio === "chatGestorAni")
                this.setState({ inicio: "chatGestorAni2" })
            else
                this.setState({ inicio: "chatGestorAni" })

        } else {
            this.props.chatOn();

        }
    };

    renderMenu() {
        if (this.props.isSignedIn) {


            ///configuracion responsive
         //   console.log(this.state.inicio);
            let ubicacionChat = "foot-chat";
            let className = "massive ui yellow large circular lightbulb outline icon icon button " + this.state.inicio;
            let className2 = "lightbulb outline icon large icon";
            if (window.screen.width < 500) {

                ubicacionChat = "foot-chatX1";
                className2 = "lightbulb outline small icon";
                className = "massive ui yellow tiny circular lightbulb outline  icon button";
            }



            return (<div>
                <div className={ubicacionChat} >
                    <button onClick={this.onChat} style={{ background:'#eca100d4'}}  className={className}>
                        <i className={className2}></i>
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

    };
};


export default connect(mapStateToProps, { chatOn, chatOff })(MenuChat);
