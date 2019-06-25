import React from 'react';
import { setUbicacion } from './actions';
import { connect } from 'react-redux';
import { Dropdown, Menu, Icon, List, Popup, Button } from 'semantic-ui-react';
import { chatOff, } from '../../../actions';

class Menus extends React.Component {


    onSlider = () => {
        this.props.setUbicacion('settings');
    };
    onHome = () => {
        this.props.setUbicacion('chats');
    };
    onUsers = () => {
        this.props.setUbicacion('contacs');
    };
    onEye = () => {
        this.props.setUbicacion('profile');
    };
    CerrarChatCel() {
        this.props.chatOff();
    }
    render() {

        let btCancelarCel = null
        if (window.screen.width <= 500) {
            btCancelarCel = < Icon name='cancel' circular
                onClick={() => { this.CerrarChatCel() }}
                style={{
                    position: 'absolute',
                    left: '88%',
                    top: '30px',
                    color: '#fffbee',
                    transform: 'scale(1.3)',
                }
                }></Icon >
        }

        let seguimientoUsuario = null;
        let styleUsers = null;
        if (this.props.userRol === '2') {
            seguimientoUsuario = <Dropdown.Item onClick={this.onEye} >
                <Icon name="eye icon"></Icon>
                Seguimiento</Dropdown.Item>

        }
        else if (this.props.userRol === '3') {
            styleUsers = { left: '-50px', position: 'relative' };
        }
        return (

            <div>
                {btCancelarCel}
                < Popup trigger={

                    < Icon name='ellipsis vertical' circular

                        style={{
                            position: 'absolute',
                            left: window.screen.width <= 500 ? '76%' : '86%',
                            top: '30px',
                            color: '#fffbee',
                            transform: 'scale(1.3)',
                        }
                        }></Icon >

                }
                    position='bottom right'
                    style={{ 'border-color': '#fbbd08', 'box-shadow': '1px 1px 7px 1px #fbbd08' }}
                    flowing hoverable >
                    <List selection animated verticalAlign='middle' style={{ width: '12em' }}>

                        <List.Item onClick={this.onUsers}>
                            <Icon style={{ position: 'relative' }} name="users icon"></Icon>
                            <List.Content >
                                <List.Header>Canales</List.Header>
                            </List.Content>
                        </List.Item>
                        <List.Item onClick={this.onHome}>
                            <Icon style={{ position: 'relative' }} name="home icon"></Icon>
                            <List.Content >
                                <List.Header>Conversaciones</List.Header>
                            </List.Content>
                        </List.Item>

                    </List>
                </Popup >
            </div>















        );
    }
};

/*

 <li>
                        <button>
                            <i className="plus icon"
                                aria-hidden="true"
                            ></i>
                        </button>
                    </li>
<li>
<i className="sliders icon" onClick={this.onSlider} />
</li>
*/
const mapStateToProps = (state) => {
    return {
        isChatUbi: state.chatReducer.isChatUbi,
        userRol: state.chatReducer.userRol,
    };
};

export default connect(mapStateToProps, { setUbicacion, chatOff })(Menus);

