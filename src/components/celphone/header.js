import React from 'react';
import { Link } from 'react-router-dom';
import GoogleAuth from '../../components/loginGoogle/GoogleAuth';
import image from '../../images/logo.png';
import { Image, Popup, Divider, List, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux';
import perfil from '../../images/perfil.png';
import Noti from '../HuperModules/slackNotifications/notifications';
import NotiHupp from '../HuperModules/notificationsHuoo/notifications';
import { homeApp } from '../../actions';

class Headers extends React.Component {

    state = {
        opcion: null, close: false, menu: null
    };


    render() {

        let opcion = null;
        let menuPerfil = null;
        let notifications = null;
        let notificationsHupp = null;
        if (this.props.isSignedIn) {
            notifications = <Noti />
            notificationsHupp = <NotiHupp />
            menuPerfil = <Popup trigger={
                <span className="ion-ios-more-outline" style={{ top: '3.5em', position: 'fixed', zIndex: '15', color: 'white', fontSize: 'larger', left: '88%' }}></span>
            }
                style={{ background: 'linear-gradient(to top,  #b5cc18 5%, #ffffff 2%', borderColor: '#fbbd08' }}
                flowing hoverable>
                <List selection animated verticalAlign='middle' style={{ width: '12em' }}>
                    <List.Item >
                        <GoogleAuth googleIn={true} />
                    </List.Item>
                </List>
            </Popup>;
        }
        if (this.props.usuarioDetail && this.props.usuarioDetail.rol === "2")
            opcion = <Link to="/equipoData" className="item" style={{ left: '70%', position: 'absolute' }}>
                <h3 style={{ color: ' rgb(208, 99, 39)' }}>Equipo</h3>
            </Link>

        /*
      {opcion}
                    {menuPerfil}
        */
        return (

            <div >
                <Link to="/dashboard" className="item">
                    <img src={image} onClick={() => { this.props.homeApp(true); }} style={{
                        zIndex: 10,
                        top: '-1em',
                        left: '-3.5em',
                        transform: 'scale(0.3)',
                        position: 'fixed'
                    }} />
                </Link>
                <div className="bottomLogo"></div>
                <div className="nav">
                    <p style={{ top: '3.5em', width: '50%', position: 'fixed', zIndex: '15', color: 'white', fontSize: 'larger', left: '6em' }}>Tu compañero en tu trabajo</p>
                    {menuPerfil}
                </div>

                <div >
                    {notifications}
                    {notificationsHupp}
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
    };
};

export default connect(mapStateToProps, { homeApp })(Headers);

