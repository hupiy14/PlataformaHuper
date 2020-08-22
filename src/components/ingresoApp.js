import React from 'react';
import image from '../images/logo.png';
import GoogleAuth from '../components/loginGoogle/GoogleAuth';
import { connect } from 'react-redux';
import history from '../history';
import packageJson from '../../package.json';
import { popupBot } from '../actions';
import { dataBaseManager } from '../lib/utils';

class ingresoPlataforma extends React.Component {


    componentDatabase(tipo, path, objectIn, mensaje, mensajeError) {
        let men = dataBaseManager(tipo, path, objectIn, mensaje, mensajeError);
        if (men && men.mensaje)
            this.props.popupBot({ mensaje: men.mensaje });
    }

    componentDidUpdate() {

        if (this.props.isSignedIn) {
            history.push('/home');
            return;
        }
    }
    render() {


        return (
            <div className="ui placeholder segment icon-right" style={{ borderColor: '#e03997', height: '100%', background: "#fffffF" }}>
                <br></br>
                <br></br>
                <div className="inline center">
                    <img alt='hupity tu compañero en el trabajo' className="ui medium rounded image" src={image} />
                </div>
                <div className="inline center" >
                    <br></br>
                    <GoogleAuth />
                </div>
                <div style={{ left: '30%', position: 'relative' }} >
                    <br></br>
                    Version :  {packageJson.version}
                </div>
            </div>
        );
    }
};


const mapStateToProps = (state) => {
    return {
        usuarioDetail: state.chatReducer.usuarioDetail,
        pasoOnboarding: state.chatReducer.pasoOnboarding,
        isSignedIn: state.auth.isSignedIn,
        userId: state.auth.userId,
    };
};

export default connect(mapStateToProps, { popupBot })(ingresoPlataforma);





