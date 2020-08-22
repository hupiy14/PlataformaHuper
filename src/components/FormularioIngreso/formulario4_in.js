import React from 'react';
import { Button, Form, Icon, Modal, Segment, Dimmer, Loader, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { nuevoUsuarios, detailUsNews } from '../../components/modules/chatBot/actions';
import { slackApis } from '../../actions/index';
import { signOut, usuarioDetails, popupBot } from '../../actions';
import history from '../../history';
import { dataBaseManager } from '../../lib/utils';

const opciones = [
    { key: 'H', text: 'Huper', value: 'Huper' },
    { key: 'G', text: 'Gestor', value: 'Gestor' },
    { key: 'O', text: 'Observador', value: 'Observador' },
];


class FomrularioGlobal extends React.Component {

    state = { errorTipo: null, tipo: null, formError: null, momento: null, errorCodigo: null, codigo: null, errorAcepto: null, acepto: null, errorEquipo: null, open: true, errorSlack: null }





    componentDatabase(tipo, path, objectIn, mensaje, mensajeError) {
        let men = dataBaseManager(tipo, path, objectIn, mensaje, mensajeError);
        if (men && men.mensaje)
            this.props.popupBot({ mensaje: men.mensaje });
        return men;
    }

    componentDidMount() {
        if (this.props.detailUsNew && this.props.detailUsNew.recupero) {
            this.continuar();
        }
    }

    // recupera los datos del navegador despues de la autorizacion del slack




    cancelar = () => {
        this.close();
        this.props.signOut();
        this.props.nuevoUsuarios(false);
        history.push('/');
        //history.push('/login');
    }
    continuar() {
        let error = false;



        if (!this.props.detailUsNew.codeSlack) {
            this.setState({ errorSlack: true });
            error = true;
            console.log(this.props.detailUsNew);
        }
        else {
            this.setState({ errorSlack: false });
        }

        this.setState({ formError: error });

        if (!error)
            history.push('/formulario/termcond');
        //   console.log(this.state.tipo);
        // this.setState({ momento: 1 });
    }


    clickGuardarTemporal = () => {
        const variale = this.props.detailUsNew;
        this.componentDatabase('insert', `Usuario-Temporal/${this.props.usuarioDetail.usuarioNuevo.id}`, { ...variale })

    }
    close = () => this.setState({ open: false })
    render() {
        //  console.log(this.props.detailUsNew);
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



            <Modal size='tiny' open={this.state.open} >
                <Modal.Header>Bienvenido a hupity</Modal.Header>
                <Modal.Content image>
                    <div className="ui form" >
                        <div className="ui grid">
                            <Modal.Description style={{ width: '38em' }}>
                                <Form error={this.state.formError}>

                                    <h3>Sincronizate con las herramientas</h3>
                                    <a onClick={this.clickGuardarTemporal} href={`https://slack.com/oauth/authorize?scope=bot&redirect_uri=https://app.hupity.com&client_id=482555533539.532672221010`}><img src="https://api.slack.com/img/sign_in_with_slack.png" /></a>
                                    <Message
                                        error
                                        header={this.state.mensajeCodigo ? this.state.mensajeCodigo.titulo : 'Falta campos por llenar'}
                                        content={this.state.mensajeCodigo ? this.state.mensajeCodigo.detalle : 'Debes diligenciar todos los campos'}
                                    />
                                </Form>
                            </Modal.Description>
                        </div>
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='grey' onClick={this.cancelar}>
                        Cancelar
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

export default connect(mapStateToProps, { nuevoUsuarios, signOut, usuarioDetails, slackApis, detailUsNews, popupBot })(FomrularioGlobal);