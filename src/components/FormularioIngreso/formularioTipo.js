import React from 'react';
import { Button, Form, Icon, Modal, Segment, Dimmer, Loader, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { nuevoUsuarios } from '../../components/modules/chatBot/actions';
import { slackApis } from '../../actions/index';
import { signOut, usuarioDetails } from '../../actions';
import history from '../../history';
import firebase from 'firebase';

const opciones = [
    { key: 'H', text: 'Huper', value: 'Huper' },
    { key: 'G', text: 'Gestor', value: 'Gestor' },
    { key: 'O', text: 'Observador', value: 'Observador' },
];


class FomrularioTipo extends React.Component {

    state = { tipo: null, errorTipo: null }

    render() {
        return (
            <Form error={this.state.formError}>

                <Form.Select label='Que rol tienes' options={opciones} placeholder='Selecciona un rol'
                    value={this.props.tipo}
                    onChange={(e, { value }) => this.setState({ tipo: value })}
                    error={this.state.errorTipo}
                />
                <Message
                    error
                    header='Error al seleccionar el rol del usuario'
                    content='Debes seleccionar un rol para continuar'
                />

            </Form>
        );
    }

}
export default FomrularioTipo;