import React from 'react';
import { Link } from 'react-router-dom';
import GoogleAuth from './GoogleAuth';
import image from '../images/logo.png';
import { Image } from 'semantic-ui-react'
import '../components/styles/ingresoHupity.css';
import sanitas from '../images/sanitas.png';

class Header extends React.Component {
    render() {

        /*
            <Image size="medium" style={{
                    transform: 'scale(0.3)',
                    position: 'fixed',
                    top: '-35px'
                }} src={sanitas} id='2' />
        */
        return (
            <div className="ui secondary pointing menu">
                <Link to="/dashboard" className="item">
                    <img className="ui tiny rounded image" src={image} id='1' />
                </Link>
            
                <div className="right menu">
                    <Link to="/hupps" className="item">
                        <h3>Hupps</h3>
                    </Link>
                    <Link to="/profile" className="item">
                        <h3>Perfil</h3>
                    </Link>
                    <GoogleAuth />
                </div>
            </div>
        );
    }
};

export default Header;

