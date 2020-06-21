import React from 'react';
import { connect } from 'react-redux';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, pasoOnboardings, estadochats, MensajeIvilys } from '../modules/chatBot/actions';
import '../HuperModules/styleOBJ1.css';

class listActividades extends React.Component {

    constructor() {
        super()
        this.state = {
            imageNumber: 'image=881'
        }
        this.changeImage = this.changeImage.bind(this)
        this.chooseRandom = this.chooseRandom.bind(this)
    }

    imageName = (style) => {
        return {
           // ...style,
            backgroundImage: `url(${this.props.imageXV})`

        }
    }

    chooseRandom() {
        return (Math.floor(Math.random() * 1000) + 300)
    }

    changeImage() {
        this.setState({
            imageNumber: `image=${this.chooseRandom()}`
        })
    }

    render() {
        return (<div>
            <div className="card">
                <div className="shadow">
                    <div
                        className="shadowImage"
                        style={this.imageName()}
                    ></div>
                </div>
                <div
                    className="image"
                    style={this.imageName()}
                ></div>
            </div>
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


export default connect(mapAppStateToProps, { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, estadochats, pasoOnboardings, MensajeIvilys })(listActividades);