import React from 'react';
import { Button, Form, Icon, Modal, Segment, Dimmer, Loader, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { nuevoUsuarios, detailUsNews } from '../../components/modules/chatBot/actions';
import { slackApis } from '../../actions/index';
import { signOut, usuarioDetails } from '../../actions';
import history from '../../history';
import firebase from 'firebase';
import { Link } from 'react-router-dom';

const opciones = [
    { key: 'H', text: 'Huper', value: 'Huper' },
    { key: 'G', text: 'Gestor', value: 'Gestor' },
    //  { key: 'O', text: 'Observador', value: 'Observador' },
];


class FomrularioGlobal extends React.Component {

    state = { errorTipo: null, tipo: null, formError: null, momento: null, open: true }

    componentDidMount() {
        this.props.detailUsNews({ ...this.props.detailUsNew, tipo: '' })
    }
    close = () => this.setState({ open: false })

    cancelar = () => {
     
        this.close();
        this.props.signOut();
        this.props.nuevoUsuarios(false);
        history.push('/login');
    }
    continuar = (e) => {
        e.preventDefault();
        let error = false;
        if (!this.state.tipo) {
            this.setState({ errorTipo: true });
            error = true;
        }
        else {
            this.setState({ errorTipo: false });
        }
        this.setState({ formError: error });
        console.log(this.state.tipo);
        history.push('/formulario/empresa');
    }
    render() {
        return (

            <Modal size='tiny' open={this.state.open} >
                <Modal.Header>Bienvenido a hupity</Modal.Header>
                <Modal.Content image >
                    <div className="ui form" >
                        <div className="ui grid">
                            <Modal.Description style={{width: '38em'}}>
                                <Form error={this.state.formError}>

                                    <Form.Select label='Que rol tienes' fluid options={opciones} placeholder='Selecciona un rol'
                                        value={this.props.detailUsNew ? this.props.detailUsNew.tipo : null}
                                        onChange={(e, { value }) => this.props.detailUsNews({ ...this.props.detailUsNew, tipo: value })}
                                        error={this.state.errorTipo}
                                    />
                                    <Message
                                        error
                                        header='Error al seleccionar el rol del usuario'
                                        content='Debes seleccionar un rol para continuar'
                                    />

                                </Form>
                            </Modal.Description>
                        </div>
                    </div>
                </Modal.Content>
                <Modal.Actions>

                    <Button color='grey' onClick={this.cancelar}>
                        Cancelar</Button>

                    <Button

                        color="purple"
                        icon='arrow right'
                        labelPosition='right'
                        content="Comenzar"
                        onClick={this.continuar}
                        disabled={this.props.detailUsNew ? this.props.detailUsNew.tipo ? false : true : true}
                    />


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