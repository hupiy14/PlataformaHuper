import React from 'react';
import image from '../../images/logo.png';
import { connect } from 'react-redux';
import history from '../../history';
import '../styles/styleLoader.css';
import GoogleAuth from '../loginGoogle/GoogleAuth';

let timeoutLength2 = 30000;
let timeoutLength = 3000;
class giroPlataforma extends React.Component {


    timerIn = () => {
        this.timeout = setTimeout(() => {
            history.push('/dashboard');
        }, timeoutLength2)
    }
    timerGi = () => {
        this.timeout = setTimeout(() => {
            if (window.innerWidth < 600 && this.props.whScreen < 600) {
                history.push('/dashboard');
            }
            else
                this.timerGi();
        }, timeoutLength)
    }

    componentDidMount() {
       // this.timerIn();
     //   this.timerGi();
    }

    render() {
        return (

            <div className="box" style={{ position: 'relative', top: "5em", width: '15em' }}>
                <h1>Te recomendamos que gires tu pantalla...</h1>
                <div className="loader9"></div>
               
            </div >

        );
    }
};


const mapStateToProps = (state) => {
    return {
        usuarioDetail: state.chatReducer.usuarioDetail,
        pasoOnboarding: state.chatReducer.pasoOnboarding,
        whScreen: state.chatReducer.whScreen,
        isSignedIn: state.auth.isSignedIn,
        userId: state.auth.userId,
    };
};

export default connect(mapStateToProps, {})(giroPlataforma);





