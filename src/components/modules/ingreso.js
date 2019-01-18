import React from 'react';
import ReactDOM from 'react-dom';
import GoogleAuth from '../GoogleAuth';
import image from '../../images/hupityNewlogo.png';
import { reactReduxFirebase } from 'react-redux-firebase';


class ingreso extends React.Component {
    render() {
        return ReactDOM.createPortal(
            <div onClick={this.props.onDismiss} className="ui dimmer modals visible active">
                <div onClick={(e) => e.stopPropagation()} className="ui standard modal visible active">

                    <div className="header center">
                        Bienvenido a
                    <img className="ui small rounded image" src={image} />

                    </div>




                    <div className="content">Ingresa el correo para entrar.</div>
                    <div className="ui secondary pointing menu">
                        <div className="item"></div>
                        <div className="right menu"> <GoogleAuth /> </div>

                    </div>


                </div>
            </div >,
            document.querySelector('#modal')
        );
    }
};

export default ingreso;