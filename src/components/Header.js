import React from 'react';
import { Link } from 'react-router-dom';
import GoogleAuth from './GoogleAuth';
import image from '../images/logo.png';
import '../components/styles/ingresoHupity.css';

class Header extends React.Component {
    render() {
        return (
            <div className="ui secondary pointing menu">
                <Link to="/dashboard" className="item">
                    <img className="ui tiny rounded image" src={image} id='1' />
                </Link>
                <div className="right menu">
                    <Link to="/hupps" className="item">
                       <h3>Hupps</h3> 
                </Link>
                    <GoogleAuth />
                </div>
            </div>
        );
    }
};

export default Header;

