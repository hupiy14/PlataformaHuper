import React from 'react';
import { Button, Form, Icon, Modal, Segment, Dimmer, Loader, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { nuevoUsuarios, detailUsNews } from '../../components/modules/chatBot/actions';
import { slackApis } from '../../actions/index';
import { signOut, usuarioDetails } from '../../actions';
import history from '../../history';
import firebase from 'firebase';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
const timeoutLength = 3000;


class FomrularioGlobal extends React.Component {

    state = { errorTipo: null, tipo: null, formError: null, momento: null, errorCodigo: null, codigo: null, errorAcepto: null, acepto: null, open: true, calendar: null }


    continuar = () => {

        const starCountRef = firebase.database().ref().child(`Codigo-Acceso/${this.props.detailUsNew.codigo}`);
        starCountRef.on('value', (snapshot) => {
            const cod = snapshot.val();
            if (cod) {
                if (cod.estado !== 'activo' && cod.usuarios < cod.equipo) {
                    //codigo usado
                    history.push('/formulario/trabajador');
                }
                else if (cod.estado !== 'activo' && cod.usuarios >= cod.equipo) {
                    //codigo usado
                    this.setState({ errorCodigo: true });
                    this.setState({ formError: true });
                    this.setState({ mensajeCodigo: { titulo: 'Codigo incorrecto', detalle: 'El codigo ya ha sido utilizado' } });            
                }
                else {
                    history.push('/formulario/inicio');
                }

            }
            else {
                //codigo que no existe
                this.setState({ errorCodigo: true });
                this.setState({ formError: true });
                this.setState({ mensajeCodigo: { titulo: 'Codigo incorrecto', detalle: 'No se tiene ninguna concidencia con el codigo escrito' } });

            }
        });

    }


    cancelar = () => {
        this.close();
        this.props.signOut();
        this.props.nuevoUsuarios(false);
        history.push('/');
        
    }

    close = () => this.setState({ open: false })
    render() {
        const { open2, open3, open4 } = this.state
        if (this.props.slackApi)
            console.log(this.props.slackApi);
        let propiedad;
        let activado = false;
        if (this.state.tipo === 'Gestor') {
            propiedad = this.handleAddition;
            activado = true;
        }

        return (

            <Modal size='tiny' open={true} >
                <Modal.Header>Bienvenido a Hupity</Modal.Header>
                <Modal.Content image>
                    <div className="ui form" >
                        <div className="ui grid">
                            <Modal.Description style={{ width: '38em' }}>
                                <Form error={this.state.formError}>

                                    <Form.Input label='Codigo de accesos' fluid placeholder='Escribe el codigo de acceso dado por Hupity' error={this.state.errorCodigo}
                                        value={this.props.detailUsNew ? this.props.detailUsNew.codigo : null}
                                        onChange={(e, { value }) => this.props.detailUsNews({ ...this.props.detailUsNew, codigo: value })}
                                    />

                                    <Message
                                        error
                                        header={this.state.mensajeCodigo ? this.state.mensajeCodigo.titulo : 'Falta campos por llenar'}
                                        content={this.state.mensajeCodigo ? this.state.mensajeCodigo.detalle : 'Debes diligenciar todos los campos'}
                                    />
                                </Form>
                            </Modal.Description>
                        </div></div>
                </Modal.Content>
                <Modal.Actions style={{position: 'relative', top: '100px'}}>
                    <Button color='grey' onClick={this.cancelar}>
                        Cancelar
                    </Button>
                    <Button style={{ background: 'linear-gradient(to right, #fce64d -30%, rgb(255, 106, 0)100%)' }} onClick={this.continuar}>
                        Bienvenido continuemos  <Icon name="arrow right"> </Icon>
                    </Button>
                </Modal.Actions>
            </Modal>

        );
    }

}

const mapStateToProps = (state) => {
    return {
        //   usuarioDetail: state.chatReducer.usuarioDetail,
        usuarioDetail: state.chatReducer.usuarioDetail,
        isSignedIn: state.auth.isSignedIn,
        detailUsNew: state.chatReducer.detailUsNew,
        nuevoUsuario: state.chatReducer.nuevoUsuario,
        slackApi: state.auth.slackApi,
    };
};

export default connect(mapStateToProps, { nuevoUsuarios, signOut, usuarioDetails, slackApis, detailUsNews })(FomrularioGlobal);