/**Formulario de ingreso del codigo de seguridad*/
import React from 'react';
import { Button, Form, Icon, Modal, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { detailUsNews, nuevoUsuarios } from '../modules/chatBot/actions';
import { signOut } from '../../actions';
import history from '../../history';
import firebase from 'firebase';

class FomrularioGlobal extends React.Component {

    state = {
        formError: null, errorCodigo: null,
        codigo: null, open: true,
        mensajeCodigo: { titulo: 'Falta campos por llenar', detalle: 'Debes diligenciar todos los campos' }
    }

    continuar = () => {
        const starCountRef = firebase.database().ref().child(`Codigo-Acceso/${this.props.detailUsNew? this.props.detailUsNew.codigo: null}`);
        starCountRef.on('value', (snapshot) => {
            const cod = snapshot.val();
            if (cod) {
                if (cod.estado !== 'activo' && cod.usuarios < cod.equipo) {
                    //codigo usado
                    history.push('/formulario/termcond');
                    this.props.detailUsNews({ ...this.props.detailUsNew, rol: '2' })
                }
                else if (cod.estado !== 'activo' && cod.usuarios >= cod.equipo) {
                    //codigo usado
                    this.setState({ errorCodigo: true });
                    this.setState({ formError: true });
                    this.setState({ mensajeCodigo: { titulo: 'Codigo incorrecto', detalle: 'El codigo ya ha sido utilizado' } });
                }
                else {
                    history.push('/formulario/inicio');
                    this.props.detailUsNews({ ...this.props.detailUsNew, rol: '3' })
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
    componentDidMount() {
        if (!this.props.usuarioDetail) {
            history.push('/');
            return;
        }
    }
    close = () => this.setState({ open: false })
    render() {
      
        return (
            <Modal size='tiny' open={true} >
                <Modal.Header>Bienvenido a Hupity</Modal.Header>
                <Modal.Content >
                    <Modal.Description >
                        <Form error={this.state.formError}>
                            <Form.Input label='Intruduce tu codigo de acceso' fluid placeholder='Escribe aqui el codigo de acceso dado por Hupity' error={this.state.errorCodigo}
                                value={this.props.detailUsNew ? this.props.detailUsNew.codigo : null}
                                onChange={(e, { value }) => this.props.detailUsNews({ ...this.props.detailUsNew, codigo: value })}
                            />
                            <Message  size="small"
                                error
                                header={this.state.mensajeCodigo.titulo}
                                content={this.state.mensajeCodigo.detalle}
                            />
                        </Form>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions >
                    <Button style={{background: "#d5d6d5"}} onClick={this.cancelar}>
                        Cancelar
                    </Button>
                    <Button style={{ background: '#fe10bd', color: "aliceblue"}} onClick={this.continuar}>
                        Continuemos  <Icon name="arrow right"> </Icon>
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        detailUsNew: state.chatReducer.detailUsNew,
        usuarioDetail: state.chatReducer.usuarioDetail,
    };
};

export default connect(mapStateToProps, { signOut, detailUsNews, nuevoUsuarios })(FomrularioGlobal);

