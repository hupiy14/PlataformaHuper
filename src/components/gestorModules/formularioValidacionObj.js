import React from 'react';
import { Button, Modal, Form, Message, Dropdown, Rating } from 'semantic-ui-react';
import moment from 'moment';
import firebase from 'firebase';
import { connect } from 'react-redux';
import history from '../../history';
import { equipoConsultas } from '../modules/chatBot/actions';


const ajustarRespuesta = [
    { key: 1, text: 'Completamente', value: '0', icon: { name: 'thumbs up outline', style: { 'color': '#06ff00' } } },
    { key: 2, text: 'Puedo considerarlo', value: '1', icon: { name: 'thumbs up outline', style: { 'color': '#ddad06' } } },
    { key: 3, text: 'No se ajusta', value: '2', icon: { name: 'thumbs up outline', style: { 'color': '#dd3f06' } } },
];


class modalFormValidacion extends React.Component {
    state = {
        open: true, error: null, formError: null, mensajeCodigo: null, dificultad: null, errorDifultad: null, tiempo: null, errorTiempo: null, impacto: null, errorImpacto: null,
        feedback: null, errorFeedback: null, calificacion: null, errorCalificacion: null, rank: 3,
    }

    componentDidMount() {
        if (!this.props.equipoConsulta || !this.props.equipoConsulta.trabajo)
            history.push('/dashboard')
    }
    ConcluirObjetivo(objetivox, user, key) {
        let objetivo = objetivox;
        objetivo.estado = 'finalizado';
        let updates = {};
        updates[`Usuario-Objetivos/${user}/${key}`] = { ...objetivo, dateEnd: moment().format('YYYY-MM-DD'), dificultadA: this.state.dificultad, tiempoA: this.state.tiempo, impactoA: this.state.impacto, feedback: this.state.feedback, calificacion: this.state.rank };
        //console.log(updates);
        firebase.database().ref().update(updates);
        this.props.equipoConsultas(this.props.equipoConsulta);
    }



    guardar() {
        this.setState({ formError: false, error: false, errorDifultad: false, errorTiempo: false, errorImpacto: false, errorFeedback: false })
        if (!this.state.dificultad)
            this.setState({ errorDifultad: true });
        if (!this.state.tiempo)
            this.setState({ errorTiempo: true });
        if (!this.state.impacto)
            this.setState({ errorImpacto: true });
        if (this.state.errorDifultad === true || this.state.errorTiempo === true ||
            this.state.errorImpacto === true) {
            this.setState({ formError: true, error: true })
        }
        this.ConcluirObjetivo(this.props.equipoConsulta.trabajo.objetivox, this.props.equipoConsulta.trabajo.user, this.props.equipoConsulta.trabajo.key);
    }

    render() {
        return (
            <div>
                <Modal size='tiny' open={this.state.open}  >
                    <Modal.Header style={{ 'border-color': 'yellow', background: '#f4a45617' }}>Formulario de validación "{this.props.equipoConsulta ? this.props.equipoConsulta.trabajo.objetivox.concepto : null} "</Modal.Header>
                    <Modal.Content image>
                        <Modal.Description>
                            <Form error={this.state.formError}>

                                <h3>Califica a tu colabordor:</h3>

                                <Form.Field>
                                    <label>La difultad se ajusto "{this.props.equipoConsulta ? this.props.equipoConsulta.trabajo.objetivox.dificultad : null}"</label>
                                    <Dropdown

                                        options={ajustarRespuesta} placeholder='Selecciona una respuesta'
                                        search selection fluid
                                        onChange={(e, { value }) => this.setState({ dificultad: value })}
                                        value={this.state.dificultad}
                                        error={this.state.errorDifultad}
                                    />
                                </Form.Field>


                                <Form.Field>
                                    <label>El tiempo dedicado al objetivo se ajusto </label>
                                    <Dropdown
                                        options={ajustarRespuesta} placeholder='Selecciona una respuesta'
                                        search selection fluid
                                        onChange={(e, { value }) => this.setState({ tiempo: value })}
                                        value={this.state.tiempo}
                                        error={this.state.errorTiempo}
                                    />

                                </Form.Field>

                                <Form.Field>
                                    <label>El impacto "{this.props.equipoConsulta ? this.props.equipoConsulta.trabajo.objetivox.impacto : null}" se ajusto</label>
                                    <Dropdown options={ajustarRespuesta} placeholder='Selecciona una respuesta'
                                        search selection fluid
                                        onChange={(e, { value }) => this.setState({ impacto: value })}
                                        value={this.state.impacto}
                                        error={this.state.errorImpacto}
                                    />
                                </Form.Field>


                                <Form.Input label='Tienes un feedback' fluid placeholder='Escribe lo que te gusto, lo que esperas, y lo que piensas'
                                    value={this.state.feedback}
                                    onChange={(e, { value }) => this.setState({ feedback: value })}
                                />

                                <Form.Field >
                                    <label>Califica el trabajo realizado </label>
                                    <Rating icon='star' size="huge" defaultRating={3} maxRating={5}
                                        rating={this.state.rank}
                                        onRate={(e, { rating }) => { this.setState({ rank: rating }) }}

                                        style={{ transform: 'scale(2)', top: '18px', position: 'relative', 'margin-left': '35%' }} />
                                </Form.Field>

                                <Message
                                    error
                                    header={this.state.mensajeCodigo ? this.state.mensajeCodigo.titulo : 'Falta campos por llenar'}
                                    content={this.state.mensajeCodigo ? this.state.mensajeCodigo.detalle : 'Debes diligenciar todos los campos'}
                                />
                            </Form>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions style={{ background: '#f4a45617' }}>
                        <Button color='grey' style={{ background: '#0000001f' }} onClick={() => { this.setState({ open: false }); history.push('/dashboard') }}>
                            Cancelar
                     </Button>
                        <Button

                            color="purple"
                            icon='arrow right'
                            labelPosition='right'
                            content="Completar Validación"
                            onClick={() => { this.guardar(); history.push('/dashboard'); }}
                        />


                    </Modal.Actions>
                </Modal>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        //   usuarioDetail: state.chatReducer.usuarioDetail,
        equipoConsulta: state.chatReducer.equipoConsulta,
        usuarioDetail: state.chatReducer.usuarioDetail,
        isSignedIn: state.auth.isSignedIn,
        detailUsNew: state.chatReducer.detailUsNew,
        nuevoUsuario: state.chatReducer.nuevoUsuario,
        slackApi: state.auth.slackApi,
    };
};

export default connect(mapStateToProps, { equipoConsultas })(modalFormValidacion);
