import React from 'react';
import { Link } from 'react-router-dom';
import GoogleAuth from '../loginGoogle/GoogleAuth';
import image from '../../images/logo.png';
import { Image, Header, Button, Popup, Divider, List, Icon } from 'semantic-ui-react'
import '../styles/ingresoHupity.css';
import procolombia from '../../images/procolombia.png';
import { connect } from 'react-redux';
import { relative } from 'path';

import perfil from '../../images/perfil.png';
const timeoutLength2 = 2000;
class HeadersC extends React.Component {

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
        let perfilCel = null;
        let opcion = null;

        if (this.props.usuarioDetail && this.props.usuarioDetail.rol === "2")
            opcion = <Link to="/hupps" className="item" style={{ left: '70%', position: 'absolute' }}>
                <h3>Entregas</h3>
            </Link>


        if (this.props.celPerf === "perfil")
            perfilCel =
                <div>
                    <Image src={this.props.usuarioDetail ? this.props.usuarioDetail.usuario ? this.props.usuarioDetail.usuario.imagenPerfil ? this.props.usuarioDetail.usuario.imagenPerfil : perfil : perfil : perfil} circular

                        style={{
                            width: '100px', position: 'absolute', top: '8em', height: '100px', left: '40%',
                            transform: 'scale(0.6)',
                            'box-shadow': 'rgba(251, 189, 8, 0.51) 5px 2px 5px 5px'
                        }}></Image>


                    <h2 style={{ top: '120%', left: '-30%', position: 'relative' }} >{this.props.usuarioDetail && this.props.usuarioDetail.usuario ? this.props.usuarioDetail.usuario.usuario : 'loading...'}</h2>
                    <h5 style={{ top: '80%', left: '-46%', position: 'relative' }} >{this.props.usuarioDetail && this.props.usuarioDetail.usuario ? this.props.usuarioDetail.usuario.cargo : null}</h5>




                    <div className="right menu">
                        {opcion}
                        {this.state.menu}

                        <Link to="/menucel" >
                            < Icon name='th large' circular

                                style={{
                                    position: 'absolute',
                                    left: '84%',
                                    top: '45px',
                                    color: '#f3cc00',
                                    transform: 'scale(1.1)',
                                }
                                }></Icon >
                        </Link>


                    </div>
                </div>
        if (this.props.datosEditCel)
            perfilCel = <div>

                <div className="right menu">
                    {opcion}
                    {this.state.menu}

                    <Link to="/menucel" >
                        < Icon name='th large' circular

                            style={{
                                position: 'absolute',
                                left: '84%',
                                top: '45px',
                                color: '#f3cc00',
                                transform: 'scale(1.1)',
                            }
                            }></Icon >
                    </Link>


                </div>
            </div>


        return (
            <div className="ui secondary pointing menu" style={{ 'box-shadow': '0px 1.5px 0px 0px #fbbd08', height: '5em' }}>
                <Link to="/dashboard" className="item">
                    <img className="ui tiny rounded image" src={image} id='1' />
                </Link>
                {perfilCel}
            </div>
        );
    }
};



const mapStateToProps = (state) => {
    return {
        usuarioDetail: state.chatReducer.usuarioDetail,
        pasoOnboarding: state.chatReducer.pasoOnboarding,
        celPerf: state.chatReducer.celPerf,
        datosEditCel: state.chatReducer.datosEditCel,
    };
};

export default connect(mapStateToProps, {})(HeadersC);

