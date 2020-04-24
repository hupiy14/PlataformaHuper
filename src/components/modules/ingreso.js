import React from 'react';
import ReactDOM from 'react-dom';
import GoogleAuth from '../loginGoogle/GoogleAuth';
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
                <div onClick={(e) => e.stopPropagation()} style={{ width: window.screen.width <= 500 ? '100%' : '30%' }} className="ui standard modal visible active">

                    <div className="header center">
                        <div style={{ top: '40px', position: 'relative' }}>
                            <h2 style={{ left: window.screen.width <= 500 ? '15px' :'40px', position: 'relative' }}>
                                Bienvenido a
                            </h2>
                        </div>
                        <img style={{ position: 'relative', left:  window.screen.width <= 500 ? '160px':'200px', top: '-1em' }} className="ui small rounded image" src={image} />
                    </div>







                    <div className="content">
                        <h3>
                            Ingresa tu correo para entrar.
                        </h3>
                        <GoogleAuth />
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