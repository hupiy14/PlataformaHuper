import React from 'react';
import { Link } from 'react-router-dom';
import GoogleAuth from '../loginGoogle/GoogleAuth';
import image from '../../images/logo.png';
import { Image, Header, Button, Popup, Divider, List, Icon } from 'semantic-ui-react'
import '../styles/ingresoHupity.css';
import procolombia from '../../images/procolombia.png';
import { connect } from 'react-redux';
import { relative } from 'path';
import { celPerfs } from '../modules/chatBot/actions';
import Objetivos from '../../images/objs.png';
import Progreso from '../../images/goal.png';
import Calendar from '../../images/calendar2.png';
import Formacion from '../../images/books.png';
import Perfil from '../../images/user.png';
import Logout from '../../images/logout.png';
import { signOut } from '../../actions';

const timeoutLength2 = 2000;
class MenuCel extends React.Component {

    state = {
        opcion: null, close: false, menu: null
    };


    componentDidMount() {
        this.props.celPerfs('menu');
    }

    componentWillMount() {
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

        if (this.props.usuarioDetail.rol === "2")
            opcion = <Link to="/hupps" className="item" style={{ left: '70%', position: 'absolute' }}>
                <h3>Entregas</h3>
            </Link>


        return (
            <div className="ui form">
                <Link to="/dashboard" onClick={() => { this.props.signOut(); }}  >
                    <img src={Logout} className="tiny" style={{ transform: 'scale(0.14,0.13)', left: '11.5em', top: '-190px', position: 'relative' }} ></img>
                    <h5 style={{
                        left: '32em', position: 'relative', top: '-346px', color: '#9fae0c', 'font-size': 'xx-small'
                    }}>Logout</h5>
                </Link>

                <div style={{ position: 'relative', top: '-25em' }}>
                    <div className="ui two cards" style={{ height: '20em', position: 'relative', top: '5em' }}>
                        <a className="olive card" style={{ height: '8em', 'text-align': 'center', 'align-items': 'center' }}>
                            <Link to="/progreso"  >
                                <img src={Progreso} className="tiny" style={{ transform: 'scale(0.2)', top: '-95px', position: 'relative' }} ></img>
                                <h5 style={{ position: 'relative', top: '-232px', color: '#9fae0c' }}>Progreso</h5>
                            </Link>
                        </a>
                        <a className="olive card" style={{ height: '8em', 'text-align': 'center', 'align-items': 'center' }}>
                            <Link to="/formacionesC"  >
                                <img src={Formacion} className="tiny" style={{ transform: 'scale(0.20)', top: '-60px', position: 'relative' }} ></img>
                                <h5 style={{ position: 'relative', top: '-186px', color: '#9fae0c' }}>Formaciones</h5>
                            </Link>
                        </a>
                        <a className="olive card" style={{ height: '8em', 'text-align': 'center', 'align-items': 'center' }}>
                            <Link to="/profile"  >
                                <img src={Perfil} className="tiny" style={{ transform: 'scale(0.20,0.19)', top: '-70px', position: 'relative' }} ></img>
                                <h5 style={{ position: 'relative', top: '-185px', color: '#9fae0c' }}>Perfil</h5>
                            </Link>
                        </a>
                        <a className="olive card" style={{ height: '8em', 'text-align': 'center', 'align-items': 'center' }}>
                            <Link to="/calendarioC"  >
                                <img src={Calendar} className="tiny" style={{ transform: 'scale(0.18)', top: '-80px', position: 'relative' }} ></img>
                                <h5 style={{ position: 'relative', top: '-212px', color: '#9fae0c' }}>Teletrabajo</h5>
                            </Link>
                        </a>


                    </div>
                </div>

            </div>
        );
    }
};



const mapStateToProps = (state) => {
    return {
        usuarioDetail: state.chatReducer.usuarioDetail,
        pasoOnboarding: state.chatReducer.pasoOnboarding
    };
};

export default connect(mapStateToProps, { celPerfs, signOut })(MenuCel);

