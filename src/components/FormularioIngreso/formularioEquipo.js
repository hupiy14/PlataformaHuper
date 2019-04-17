import React from 'react';
import { Button, Form, Icon, Modal, Segment, Dimmer, Loader, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { nuevoUsuarios, detailUsNews } from '../../components/modules/chatBot/actions';
import { slackApis } from '../../actions/index';
import { signOut, usuarioDetails } from '../../actions';
import history from '../../history';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import { relativeTimeRounding } from 'moment';

const opciones = [
    { key: 'H', text: 'Huper', value: 'Huper' },
    { key: 'G', text: 'Gestor', value: 'Gestor' },
    { key: 'O', text: 'Observador', value: 'Observador' },
];


class FomrularioGlobal extends React.Component {

    state = { errorTipo: null, tipo: null, formError: null, momento: null, errorCodigo: null, codigo: null, errorAcepto: null, acepto: null, errorEquipo: null, open: true, errorSlack: null }







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
        history.push('/login');
    }
    continuar() {
        let error = false;

       
        if (!this.props.detailUsNew.equipo) {
            this.setState({ errorEquipo: true });
            error = true;
        }
        else {
            this.setState({ errorEquipo: false });
        }
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
            history.push('/formulario/codigo');
        //   console.log(this.state.tipo);
        // this.setState({ momento: 1 });
    }
    renderOpcionesEmpresaEquipo() {
        if (!this.props.detailUsNew)
            return;
        const listaX = this.props.detailUsNew.listaEquipos;
        let lista = {};
      //  console.log(listaX);
        if (!this.props.detailUsNew.listaEquipos) return;
        const opciones = Object.keys(listaX).map(function (key, index) {
            //  console.log(listaX[key]);
            lista = { ...lista, key: key, text: listaX[key].nombreTeam, value: listaX[key].nombreTeam };
            return lista;
            //return cconsulta[key].concepto;
        });
        console.log(opciones);
        return opciones;

    }

    clickGuardarTemporal = () => {
        const variale = this.props.detailUsNew;
        firebase.database().ref(`Usuario-Temporal/${this.props.usuarioDetail.usuarioNuevo.id}`).set({
            ...variale
        });

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

        const equipo = <Form.Select label='Equipo de Trabajo' options={this.renderOpcionesEmpresaEquipo()} placeholder='Cual es tu equipo de trabajo en la empresa selecciona'
            search
            allowAdditions={activado}
            onAddItem={propiedad}
            value={this.props.detailUsNew ? this.props.detailUsNew.equipo : null}
            onChange={(e, { value }) => this.props.detailUsNews({ ...this.props.detailUsNew, equipo: value })}
            error={this.state.errorEquipo}

        />
        return (

            <div>

                <Modal size='tiny' open={this.state.open} onClose={this.close}>
                    <Modal.Header>Bienvenido a hupity</Modal.Header>
                    <Modal.Content image>
                        <Modal.Description>
                            <Form error={this.state.formError}>
                                {equipo}

                                <h3>Sincronizate con las herramientas</h3>
                                <a onClick={this.clickGuardarTemporal} href={`https://slack.com/oauth/authorize?scope=bot&client_id=482555533539.532672221010`}><img src="https://api.slack.com/img/sign_in_with_slack.png" /></a>
                                <Message
                                    error
                                    header={this.state.mensajeCodigo ? this.state.mensajeCodigo.titulo : 'Falta campos por llenar'}
                                    content={this.state.mensajeCodigo ? this.state.mensajeCodigo.detalle : 'Debes diligenciar todos los campos'}
                                />
                            </Form>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='grey' onClick={this.cancelar}>
                            Cancelar
                        </Button>



                    </Modal.Actions>
                </Modal>
            </div>

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