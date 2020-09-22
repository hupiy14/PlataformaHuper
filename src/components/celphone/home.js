import React from 'react';
import image from '../../images/logo.png';
import { connect } from 'react-redux';
import history from '../../history';
import { screenWH } from '../../actions';
import '../styles/styleLoader.css';
import GoogleAuth from '../loginGoogle/GoogleAuth';

let timeoutLength2 = 4000;
class ingresoPlataforma extends React.Component {


    timerIn = () => {
        this.timeout = setTimeout(() => {
            if (this.props.usuarioDetail.usuario)
                history.push('/dashboard');
        }, timeoutLength2)
    }

    componentDidMount() {
        this.props.screenWH(window.innerWidth);
        this.timerIn();
    }

    render() {
        return (

            <div className="box" style={{ position: 'relative', top: window.innerHeight * 0.35, width: '15em' }}>
                <h1>Vamos a comenzar...</h1>
                <div className="loader9"></div>
                <br></br>
                <GoogleAuth googleIn={true} />
            </div >

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

export default connect(mapStateToProps, { screenWH })(ingresoPlataforma);





