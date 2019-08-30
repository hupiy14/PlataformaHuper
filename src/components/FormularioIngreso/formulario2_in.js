import React from 'react';
import { Button, Form, Icon, Modal, Segment, Dimmer, Loader, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { slackApis } from '../../actions/index';
import { signOut, usuarioDetails } from '../../actions';
import history from '../../history';
import firebase from 'firebase';
import { nuevoUsuarios, detailUsNews } from '../../components/modules/chatBot/actions';
import { Link } from 'react-router-dom';

const AreasT = [
    { key: 1, text: 'Tecnología', value: 'Tecnología' },
    { key: 2, text: 'Ventas', value: 'Ventas' },
    { key: 3, text: 'Staff', value: 'Staff' },
    { key: 4, text: 'Comercial', value: 'Comercial' },
    { key: 5, text: 'RRHH', value: 'RRHH' },

]




class FomrularioGlobal extends React.Component {

    state = {
        listaEmpresas: {}, listaEquipos: {},
        errorTipo: null, tipo: null, formError: null, momento: null, nombreUsuario: null, errorNombreUsuario: null, open: true,
        cargo: null, error: null, errorEquipo: null, errorCargo: null, area: null, errorArea: null, empresa: null, errorEmpresa: null, errorSector: null
    }

    componentDidMount() {
        //se consulta todas las empresas
        const starCountRef = firebase.database().ref().child('empresa');
        starCountRef.on('value', (snapshot) => {
            this.setState({ listaEmpresas: snapshot.val() })
            this.props.detailUsNews({ ...this.props.detailUsNew, listaEmpresas: snapshot.val() });
        });
    }
    handleAddition = (e, { value }) => {
        //se agrega un nuevo equipo
        const equipoNuevo = { nombreTeam: value };

        this.setState({

            listaEquipos: { equipoNuevo, ...this.state.listaEquipos }
        })
        this.props.detailUsNews({ ...this.props.detailUsNew, listaEquipos: this.state.listaEquipos });
    }
    continuar2 = () => {

        let error = false;
        if (this.props.detailUsNew.nombreUsuario.trim() === '') {
            this.setState({ errorNombreUsuario: true });
            error = true;
        }
        else {
            this.setState({ errorNombreUsuario: false });
        }
        if (this.props.detailUsNew.area.trim() === '') {
            this.setState({ errorArea: true });
            error = true;
        }
        else {
            this.setState({ errorArea: false });
        }

        if (this.props.detailUsNew.cargo.trim() === '') {
            this.setState({ errorCargo: true });
            error = true;
        }
        else {
            this.setState({ errorCargo: false });
        }

        if (this.props.detailUsNew.equipo.trim() === '') {
            this.setState({ errorEquipo: true });
            error = true;
        }
        else {
            this.setState({ errorEquipo: false });
        }

        if (!this.props.detailUsNew.empresa) {
            this.setState({ errorEmpresa: true });
            error = true;
        }
        else {
            this.setState({ errorEmpresa: false });
        }

        if (!this.props.detailUsNew.sector) {
            this.setState({ errorSector: true });
            error = true;
        }
        else {
            this.setState({ errorSector: false });
        }

        this.setState({ formError: error });

        if (!error) {
            this.props.detailUsNews({ ...this.props.detailUsNew, tipo: 'Gestor' })
            history.push('/formulario/herramientas');
        }

    }
    close = () => this.setState({ open: false })

    renderOpcionesEmpresa() {
        const listaX = this.state.listaEmpresas;
        let lista = {};
        const opciones = Object.keys(listaX).map(function (key, index) {
            lista = { ...lista, key: key, text: listaX[key].industria, value: listaX[key].industria };
            return lista;
        });
        return opciones;

    }
    cancelar = () => {
        this.close();
        this.props.signOut();
        this.props.nuevoUsuarios(false);
        history.push('/');
    }

    render() {
        return (



            <Modal size='tiny' open={this.state.open} >
                <Modal.Header>Bienvenido a hupity</Modal.Header>
                <Modal.Content image>
                    <div className="ui form" >
                        <div className="ui grid">
                            <Modal.Description style={{ width: '38em' }} >
                                <Form error={this.state.formError} >

                                    <Form.Input label='Cual es tu empresa u organización:' placeholder='Cual es la razon social de la empresa'
                                        value={this.props.detailUsNew ? this.props.detailUsNew.empresa : null}
                                        onChange={e => this.props.detailUsNews({ ...this.props.detailUsNew, empresa: e.target.value })}
                                        error={this.state.errorEmpresa}
                                    />
                                    <Form.Input label='En que sector se desarrolla tu organización:' placeholder='Telecomunicaciones, Gestoria, Publicidad'
                                        value={this.props.detailUsNew ? this.props.detailUsNew.sector : null}
                                        onChange={e => this.props.detailUsNews({ ...this.props.detailUsNew, sector: e.target.value })}
                                        error={this.state.errorSector}
                                    />
                                    <Form.Input label='Nombra a tu equipo de trabajo:' placeholder='Escribe el nombre que los representara'
                                        value={this.props.detailUsNew ? this.props.detailUsNew.equipo : null}
                                        onChange={e => this.props.detailUsNews({ ...this.props.detailUsNew, equipo: e.target.value })}
                                        error={this.state.errorEquipo}
                                    />
                                    <Form.Select label='A que departamento de tu empresa pertenece tu equipo:' options={AreasT} placeholder='Escoge una opción'
                                        value={this.props.detailUsNew ? this.props.detailUsNew.area : null}
                                        onChange={(e, { value }) => this.props.detailUsNews({ ...this.props.detailUsNew, area: value })}
                                        error={this.state.errorArea}
                                    />

                                    <Form.Input label='¿Quien liderara tu equipo?:' placeholder='Escribe el nombre'
                                        value={this.props.detailUsNew ? this.props.detailUsNew.nombreUsuario : null}
                                        onChange={e => this.props.detailUsNews({ ...this.props.detailUsNew, nombreUsuario: e.target.value })}
                                        error={this.state.errorNombreUsuario}
                                    />

                                    <Form.Input label='¿Que cargo tiene?:' placeholder='Escribe el cargo'
                                        value={this.props.detailUsNew ? this.props.detailUsNew.cargo : null}
                                        onChange={e => this.props.detailUsNews({ ...this.props.detailUsNew, cargo: e.target.value })}
                                        error={this.state.errorCargo}
                                    />

                                    <Message
                                        error
                                        header='Falta campos por llenar'
                                        content='Debes diligenciar todos los campos'
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

                    <Button
                        icon='arrow right'
                        labelPosition='right'
                        content="Un paso Mas"
                        style={{ background: 'linear-gradient(to right, #fce64d -30%, rgb(255, 106, 0)100%)' }}
                        onClick={this.continuar2}
                        disabled=
                        {
                            this.props.usuarioDetail && (
                                !this.props.detailUsNew.nombreUsuario ||
                                !this.props.detailUsNew.empresa ||
                                !this.props.detailUsNew.sector ||
                                !this.props.detailUsNew.cargo ||
                                !this.props.detailUsNew.equipo ||
                                !this.props.detailUsNew.area)
                        }
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