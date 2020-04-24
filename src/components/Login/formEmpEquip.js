/**Formulario de ingreso de datos empresa y equipo de trabajo */
import React from 'react';
import { Button, Form, Modal, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { signOut } from '../../actions';
import history from '../../history';
import { nuevoUsuarios, detailUsNews } from '../modules/chatBot/actions';

const AreasT = [
    { key: 1, text: 'Tecnología', value: 'Tecnología' },
    { key: 2, text: 'Ventas', value: 'Ventas' },
    { key: 3, text: 'Staff', value: 'Staff' },
    { key: 4, text: 'Comercial', value: 'Comercial' },
    { key: 5, text: 'RRHH', value: 'RRHH' },
]

class FomrularioGlobal extends React.Component {

    state = {
        formError: null, open: true,
        error: null, errorEquipo: null, area: null,
        errorArea: null, empresa: null, errorEmpresa: null,
        errorSector: null, mensajeCodigo: { titulo: 'Falta campos por llenar', detalle: 'Debes diligenciar todos los campos' }

    }
    componentWillMount() {
        if (!this.props.usuarioDetail)
            history.push('/');
    }
    continuar2 = () => {
        let error = false;
        if (this.props.detailUsNew.area.trim() === '') {
            this.setState({ errorArea: true });
            error = true;
        }
        else
            this.setState({ errorArea: false });


        if (this.props.detailUsNew.equipo.trim() === '') {
            this.setState({ errorEquipo: true });
            error = true;
        }
        else
            this.setState({ errorEquipo: false });


        if (!this.props.detailUsNew.empresa) {
            this.setState({ errorEmpresa: true });
            error = true;
        }
        else
            this.setState({ errorEmpresa: false });


        if (!this.props.detailUsNew.sector) {
            this.setState({ errorSector: true });
            error = true;
        }
        else
            this.setState({ errorSector: false });

        this.setState({ formError: error });
        if (!error) {
            this.props.detailUsNews({ ...this.props.detailUsNew, tipo: 'Gestor' })
            history.push('/formulario/termcond');
        }

    }
    close = () => this.setState({ open: false })
    cancelar = () => {
        this.close();
        this.props.signOut();
        this.props.nuevoUsuarios(false);
        history.push('/');
    }

    render() {
        return (
            <Modal size='tiny' open={this.state.open} >
                <Modal.Header>Bienvenido a hupity registrate</Modal.Header>
                <Modal.Content image>
                    <Modal.Description >
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
                    <Button
                        icon='arrow right'
                        labelPosition='right'
                        content="Un paso mas"
                        style={{ background: '#fe10bd', color: "aliceblue" }}
                        onClick={this.continuar2}
                        disabled=
                        {
                            this.props.usuarioDetail && (
                                !this.props.detailUsNew.empresa ||
                                !this.props.detailUsNew.sector ||
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
        usuarioDetail: state.chatReducer.usuarioDetail,
        detailUsNew: state.chatReducer.detailUsNew,
    };
};
export default connect(mapStateToProps, { nuevoUsuarios, signOut, detailUsNews })(FomrularioGlobal);