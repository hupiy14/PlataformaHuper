import React from 'react';
import { Form, Message } from 'semantic-ui-react';

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