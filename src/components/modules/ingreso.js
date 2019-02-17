import React from 'react';
import ReactDOM from 'react-dom';
import GoogleAuth from '../GoogleAuth';
import image from '../../images/logo.png';
import { connect } from 'react-redux';
import { nuevoUsuarios } from '../modules/chatBot/actions';
import { Link } from 'react-router-dom';


class ingreso extends React.Component {
    componentDidMount() {
        //  if(this.props.nuevoUsuario !== true)
        // this.props.nuevoUsuarios(null);
    }

   
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

const mapStateToProps = (state) => {
    return {
        //   usuarioDetail: state.chatReducer.usuarioDetail,

        isSignedIn: state.auth.isSignedIn,
        nuevoUsuario: state.chatReducer.nuevoUsuario,
    };
};

export default connect(mapStateToProps, { nuevoUsuarios })(ingreso);