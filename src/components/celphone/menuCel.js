import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ingresoHupity.css';
import { connect } from 'react-redux';
import { celPerfs } from '../modules/chatBot/actions';
import Progreso from '../../images/goal.png';
import Calendar from '../../images/calendar2.png';
import Formacion from '../../images/books.png';
import Perfil from '../../images/user.png';
import Logout from '../../images/logout.png';
import { signOut } from '../../actions';

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




        return (
            <div className="ui form">
                <Link to="/dashboard" onClick={() => { this.props.signOut(); }}  >
                    <img src={Logout}  alt= 'Logout' className="tiny" style={{ transform: 'scale(0.14,0.13)', left: '11.5em', top: '-190px', position: 'relative' }} ></img>
                    <h5 style={{
                        left: '32em', position: 'relative', top: '-346px', color: '#9fae0c', 'font-size': 'xx-small'
                    }}>Logout</h5>
                </Link>

                <div style={{ position: 'relative', top: '-25em' }}>
                    <div className="ui two cards" style={{ height: '20em', position: 'relative', top: '5em' }}>
                        <h5 className="olive card" style={{ height: '8em', 'text-align': 'center', 'align-items': 'center' }}>
                            <Link to="/progreso"  >
                                <img src={Progreso} className="tiny" alt= 'Progreso' style={{ transform: 'scale(0.2)', top: '-95px', position: 'relative' }} ></img>
                                <h5 style={{ position: 'relative', top: '-232px', color: '#9fae0c' }}>Progreso</h5>
                            </Link>
                        </h5>
                        <h5 className="olive card" style={{ height: '8em', 'text-align': 'center', 'align-items': 'center' }}>
                            <Link to="/formacionesC"  >
                                <img src={Formacion} className="tiny" alt= 'Formacion' style={{ transform: 'scale(0.20)', top: '-60px', position: 'relative' }} ></img>
                                <h5 style={{ position: 'relative', top: '-186px', color: '#9fae0c' }}>Formaciones</h5>
                            </Link>
                        </h5>
                        <h5 className="olive card" style={{ height: '8em', 'text-align': 'center', 'align-items': 'center' }}>
                            <Link to="/profile"  >
                                <img src={Perfil} className="tiny" alt= 'Perfil' style={{ transform: 'scale(0.20,0.19)', top: '-70px', position: 'relative' }} ></img>
                                <h5 style={{ position: 'relative', top: '-185px', color: '#9fae0c' }}>Perfil</h5>
                            </Link>
                        </h5>
                        <h5 className="olive card" style={{ height: '8em', 'text-align': 'center', 'align-items': 'center' }}>
                            <Link to="/calendarioC"  >
                                <img src={Calendar} className="tiny" alt= 'Calendar' style={{ transform: 'scale(0.18)', top: '-80px', position: 'relative' }} ></img>
                                <h5 style={{ position: 'relative', top: '-212px', color: '#9fae0c' }}>Teletrabajo</h5>
                            </Link>
                        </h5>


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

