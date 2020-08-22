import React from 'react';
import { connect } from 'react-redux';
import history from '../history';
import './styles/styleLoader.css';
import GoogleAuth from './loginGoogle/GoogleAuth'; 

let timeoutLength2 = 2500;
class giroPlataforma extends React.Component {


    timerIn = () => {
        this.timeout = setTimeout(() => {
            history.push('/dashboard');
        }, timeoutLength2)
    }

    componentDidMount() {
        this.timerIn();
     }

    render() {
        return (

            <div className="box" style={{ position: 'relative', top: "5em", width: '15em' }}>
                <h1>Vamos a iniciar...</h1>
                <div className="loader9"></div>
                <br></br>
                <GoogleAuth />
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





