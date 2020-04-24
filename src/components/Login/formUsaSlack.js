/**Formulario de datos del nuevo usuario y oauth slack*/
import React from 'react';
import { Button, Form, Modal, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { nuevoUsuarios, detailUsNews } from '../modules/chatBot/actions';
import { signOut } from '../../actions';
import history from '../../history';
import firebase from 'firebase';

class FomrularioGlobal extends React.Component {

    state = {
        formError: null, open: true, errorSlack: null,
        mensajeCodigo: { titulo: 'Te falta campos por llenar', detalle: 'Debes diligenciar todos los campos' }
    }

    componentDidMount() {
        if (!this.props.usuarioDetail) {
            history.push('/');
            return;
        }
        if (this.props.detailUsNew && this.props.detailUsNew.recupero) {
            this.continuar();
        }
    }

    cancelar = () => {
        this.close();
        this.props.signOut();
        this.props.nuevoUsuarios(false);
        history.push('/');
    }

    continuar() {
        let error = false;
        if (!this.props.detailUsNew.codeSlack) {
            this.setState({ errorSlack: true });
            error = true;
        }
        else {
            this.setState({ errorSlack: false });
        }
        this.setState({ formError: error });

        if (!error)
            history.push('/formulario/termcond');
    }

    clickGuardarTemporal = () => {
        firebase.database().ref(`Usuario-Temporal/${this.props.usuarioDetail.usuarioNuevo.id}`).set({
            ...this.props.detailUsNew
        });
    }

    close = () => this.setState({ open: false })

    render() {
        let styleSlack = {
            'pointer-events': 'none',
            filter: 'grayscale(1)',
        };

        if (this.props.detailUsNew && this.props.detailUsNew.nombreUsuario && this.props.detailUsNew.cargo)
        {
            styleSlack = null;
        }           

        return (
            <Modal size='tiny' open={this.state.open} >
                <Modal.Header>Comienza tu experiencia</Modal.Header>
                <Modal.Content image>
                    <Modal.Description >
                        <Form error={this.state.formError}>
                            <Form.Input label='¿Como te llamas?' placeholder='Como te gustaría que te llamaran'
                                value={this.props.detailUsNew ? this.props.detailUsNew.nombreUsuario : null}
                                onChange={e => this.props.detailUsNews({ ...this.props.detailUsNew, nombreUsuario: e.target.value })}
                                error={this.state.errorNombreUsuario}
                            />
                            <Form.Input label='¿Que cargo tienes?' placeholder='Escribe el cargo'
                                value={this.props.detailUsNew ? this.props.detailUsNew.cargo : null}
                                onChange={e => this.props.detailUsNews({ ...this.props.detailUsNew, cargo: e.target.value })}
                                error={this.state.errorCargo}
                            />
                            <h3>Sincronizate tus herramientas para continuar</h3>
                            <a  style={styleSlack}
                                href={`https://slack.com/oauth/authorize?scope=bot&redirect_uri=https://app.hupity.com&client_id=482555533539.532672221010`}>
                                <img src="https://api.slack.com/img/sign_in_with_slack.png"  onClick={this.clickGuardarTemporal} alt="sincroniza oauth slack" /></a>
                            <Message
                                error
                                header={this.state.mensajeCodigo.titulo}
                                content={this.state.mensajeCodigo.detalle}
                            />
                        </Form>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button style={{background: "#d5d6d5"}} onClick={this.cancelar}>
                        Cancelar
                        </Button>
                </Modal.Actions>
            </Modal >

        );
    }

}

const mapStateToProps = (state) => {
    return {
        detailUsNew: state.chatReducer.detailUsNew,
        usuarioDetail: state.chatReducer.usuarioDetail,
        nuevoUsuario: state.chatReducer.nuevoUsuario,
    };
};

export default connect(mapStateToProps, {nuevoUsuarios, signOut, detailUsNews})(FomrularioGlobal);