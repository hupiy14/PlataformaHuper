import React from 'react';
import { Link } from 'react-router-dom';
import GoogleAuth from '../GoogleAuth';
import image from '../../images/logo.png';
import { Image, Header, Button, Popup, Divider, List, Icon } from 'semantic-ui-react'
import '../styles/ingresoHupity.css';
import procolombia from '../../images/procolombia.png';
import { connect } from 'react-redux';
import { relative } from 'path';
import {  celPerfs } from '../modules/chatBot/actions';
import Objetivos from '../../images/objs.png';
import Progreso from '../../images/goal.png';
import Calendar from '../../images/calendar2.png';
import Formacion from '../../images/books.png';
import Perfil from '../../images/user.png';
import Logout from '../../images/logout.png';

const timeoutLength2 = 2000;
class MenuCel extends React.Component {

    state = {
        opcion: null, close: false, menu: null
    };


componentDidMount(){
    this.props.celPerfs('menu');
}


    render() {


        /*
            <Image size="medium" style={{
                    transform: 'scale(0.3)',
                    position: 'fixed',
                    top: '-35px'
                }} src={sanitas} id='2' />


        */
        let opcion = null;

        if (this.props.userRol === "2")
            opcion = <Link to="/hupps" className="item" style={{ left: '70%', position: 'absolute' }}>
                <h3>Entregas</h3>
            </Link>




        return (
            <div >
                <div className="ui two cards" style={{ height: '20em', position: 'relative', top: '5em' }}>
                    <a className="olive card" style={{ height: '8em' }}>
                        <img src={Objetivos} className="tiny" style={{ transform: 'scale(0.2)', top: '-80px', position: 'relative' }} ></img>
                        <h5 style={{left: '35%', position: 'relative', top: '-204px', color: '#9fae0c'}}>Objetivos</h5>
                    </a>
                    <a className="olive card" style={{ height: '8em' }}>
                        <img src={Formacion} className="tiny" style={{ transform: 'scale(0.25)', top: '-70px', position: 'relative' }} ></img>
                        <h5 style={{left: '30%', position: 'relative', top: '-186px', color: '#9fae0c'}}>Formaciones</h5>
                    </a>
                    <a className="olive card" style={{ height: '8em' }}>
                        <img src={Progreso} className="tiny" style={{ transform: 'scale(0.21,0.17)', top: '-90px', position: 'relative' }} ></img>
                        <h5 style={{left: '35%', position: 'relative', top: '-230px', color: '#9fae0c'}}>Progreso</h5>
                    </a>
                    <a className="olive card" style={{ height: '8em' }}>
                        <img src={Calendar} className="tiny" style={{ transform: 'scale(0.22, 0.17)', top: '-85px', position: 'relative' }} ></img>
                        <h5 style={{left: '30%', position: 'relative', top: '-212px', color: '#9fae0c'}}>Teletrabajo</h5>
                    </a>
                    <a className="olive card" style={{ height: '8em' }}>
                        <img src={Perfil} className="tiny" style={{ transform: 'scale(0.25,0.19)', top: '-70px', position: 'relative' }} ></img>
                        <h5 style={{left: '40%', position: 'relative', top: '-185px', color: '#9fae0c'}}>Perfil</h5>
                    </a>
                    <a className="olive card" style={{ height: '8em' }}>
                        <img src={Logout} className="tiny" style={{ transform: 'scale(0.20,0.16)', top: '-85px', position: 'relative' }} ></img>
                        <h5 style={{left: '36%', position: 'relative', top: '-222px', color: '#9fae0c'}}>Logout</h5>
                    </a>
                </div>
            </div>
        );
    }
};



const mapStateToProps = (state) => {
    return {
        usuarioDetail: state.chatReducer.usuarioDetail,
        userRol: state.chatReducer.userRol,
        pasoOnboarding: state.chatReducer.pasoOnboarding
    };
};

export default connect(mapStateToProps, {celPerfs})(MenuCel);

