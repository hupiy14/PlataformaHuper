import React from 'react';
import { Link } from 'react-router-dom';
import GoogleAuth from '../components/loginGoogle/GoogleAuth';
import image from '../images/logo.png';
import { Image, Popup, Divider, List, Icon } from 'semantic-ui-react'
import '../components/styles/ingresoHupity.css';
import { connect } from 'react-redux';
import perfil from '../images/perfil.png';
import Noti from './HuperModules/slackNotifications/notifications';
import NotiHupp from './HuperModules/notificationsHuoo/notifications';

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
                <Image id="imagePerfilUs" src={this.props.usuarioDetail ? this.props.usuarioDetail.usuario && this.props.isSignedIn ? this.props.usuarioDetail.usuario.imagenPerfil ? this.props.usuarioDetail.usuario.imagenPerfil : perfil : perfil : perfil} circular
                    style={{
                        width: '7.2em', position: 'absolute', height: '7.2em', left: '91%',
                        transform: 'scale(0.6)'
                    }}></Image>
            }
                style={{ background: 'linear-gradient(to top,  #b5cc18 5%, #ffffff 2%', borderColor: '#fbbd08' }}
                flowing hoverable>
                <List selection animated verticalAlign='middle' style={{ width: '12em' }}>
                    <div style={{ height: '6em' }}>
                        <div style={{ height: '3.5em' }}>
                            <Image src={this.props.usuarioDetail ? this.props.usuarioDetail.usuario && this.props.isSignedIn ? this.props.usuarioDetail.usuario.imagenPerfil ? this.props.usuarioDetail.usuario.imagenPerfil : perfil : perfil : perfil} circular
                                style={{
                                    width: '7.2em', height: '7.2em', position: 'relative', top: '-1.5em', left: '-1em',
                                    transform: 'scale(0.5)'
                                }}></Image>

                            <h2 style={{ top: '-5em', left: this.props.usuarioDetail ? '3.5em' : '3em', position: 'relative' }} >{this.props.usuarioDetail && this.props.usuarioDetail.usuario && this.props.isSignedIn ? this.props.usuarioDetail.usuario.usuario : 'loading...'}</h2>
                            <h4 style={{ top: '-9.5em', left: '5em', position: 'relative' }} >{this.props.usuarioDetail && this.props.usuarioDetail.usuario && this.props.isSignedIn ? this.props.usuarioDetail.usuario.cargo : null}</h4>

                        </div>
                        <Divider horizontal style={{ top: '-9em', color: '#b5cc18' }}> - </Divider>
                    </div>

                    <List.Item >
                        <Icon style={{ position: 'relative' }} name="user circle outline"></Icon>
                        <List.Content>
                            <Link to={"/profile"} className="item">
                                <List.Header>Detalle del perfil</List.Header>
                            </Link>

                        </List.Content>
                    </List.Item>
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

        return (
            <div className="ui secondary pointing menu" style={{ boxShadow: '0px 1.5px 0px 0px #e03997' }}>
                <Link to="/dashboard" className="item">
                    <img className='ui tiny rounded image' style={{ transform: 'scale(0.85)' }} src={image} id='1' alt="hupity tu compañero en el trabajo" />
                </Link>

                <div className="right menu">
                    {opcion}
                    {menuPerfil}
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

export default connect(mapStateToProps, {})(Headers);

