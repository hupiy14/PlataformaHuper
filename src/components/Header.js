import React from 'react';
import { Link } from 'react-router-dom';
import GoogleAuth from './GoogleAuth';
import image from '../images/logo.png';
import { Image, Header, Button, Popup, Divider, List, Icon } from 'semantic-ui-react'
import '../components/styles/ingresoHupity.css';
import procolombia from '../images/procolombia.png';
import { connect } from 'react-redux';
import { relative } from 'path';

import perfil from '../images/perfil.png';
const timeoutLength2 = 2000;
class Headers extends React.Component {

    state = {
        opcion: null, close: false, menu: null
    };
 

   


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
            opcion = <Link to="/equipoData" className="item" style={{left:'70%', position: 'absolute'}}>
                <h3 style={{color: ' rgb(208, 99, 39)'}}>Equipo</h3>
            </Link>




        return (
            <div className="ui secondary pointing menu" style={{ 'box-shadow': '0px 1.5px 0px 0px #fbbd08' }}>
                <Link to="/dashboard" className="item">
                    <img className="ui tiny rounded image" src={image} id='1' />
                </Link>

                <div className="right menu">
                    {opcion}
                    {this.state.menu}

                    <Popup trigger={

                        <Image src={this.props.usuarioDetail ? this.props.usuarioDetail.usuario?  this.props.usuarioDetail.usuario.imagenPerfil? this.props.usuarioDetail.usuario.imagenPerfil: perfil: perfil: perfil} circular

                            style={{
                                width: '100px', position: 'absolute', top: '-2%', height: '100px', left: '75%',
                                transform: 'scale(0.5)'
                            }}></Image>

                    }
                  
                    
                        style={{ background: 'linear-gradient(to top,  #f7b800 5%, #ffffff 2%', 'border-color': '#fbbd08', 'box-shadow': '1px 1px 7px 1px #fbbd08' }}
                        flowing hoverable>
                        <List selection animated verticalAlign='middle' style={{ width: '12em' }}>

                            <div style={{ height: '6em' }}>
                                <div style={{ height: '3.5em' }}>
                                    <Image src={this.props.usuarioDetail ? this.props.usuarioDetail.usuario? this.props.usuarioDetail.usuario.imagenPerfil? this.props.usuarioDetail.usuario.imagenPerfil: perfil: perfil : perfil} circular
                                        style={{
                                            width: '100px', height: '100px', position: 'relative', top: '-1.5em', left: '-1em',
                                            transform: 'scale(0.5)'
                                        }}></Image>

                                    <h2 style={{ top: '-5em', left: this.props.usuarioDetail ? '3.5em' : '3em', position: 'relative' }} >{this.props.usuarioDetail &&  this.props.usuarioDetail.usuario? this.props.usuarioDetail.usuario.usuario : 'loading...'}</h2>
                                    <h4 style={{ top: '-9.5em', left: '5em', position: 'relative' }} >{this.props.usuarioDetail &&  this.props.usuarioDetail.usuario?  this.props.usuarioDetail.usuario.cargo : null}</h4>

                                </div>
                                <Divider horizontal style={{ top: '-9em', color: '#fbbd08' }}> - </Divider>
                            </div>

                            <List.Item >
                                <Icon style={{ position: 'relative' }} name="user circle outline"></Icon>
                                <List.Content>
                                    <Link to="/profile" className="item">
                                        <List.Header>Detalle del perfil</List.Header>
                                    </Link>

                                </List.Content>
                            </List.Item>
                            <List.Item >
                                <GoogleAuth googleIn={true} />
                            </List.Item>

                        </List>
                    </Popup>










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

export default connect(mapStateToProps, {})(Headers);

