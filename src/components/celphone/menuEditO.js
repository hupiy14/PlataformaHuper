import React from 'react';
import { Link } from 'react-router-dom';
import GoogleAuth from '../GoogleAuth';
import image from '../../images/logo.png';
import { Image, Header, Button, Input, Label, Modal, Icon } from 'semantic-ui-react'
import '../styles/ingresoHupity.css';
import procolombia from '../../images/procolombia.png';
import { connect } from 'react-redux';
import { relative } from 'path';
import { prioridadObjs, datosEditCels } from '../modules/chatBot/actions';
import perfil from '../../images/perfil.png';
import firebase from 'firebase';
import history from '../../history';

const timeoutLength2 = 2000;
class HeadersC extends React.Component {

    state = {

        detalleO: null, prioridadx: [{ prio: 'inmediato', color: 'red' }, { prio: 'urgente', color: 'yellow' }, { prio: 'normal', color: 'olive' }], modalOpen: false, comentario: null,
        ver: false,
    };

    componentWillMount() {
        console.log(this.props.datosEditCel)

        if (!this.props.datosEditCel)
            history.push("/dashboard");
        return;
    }
    componentDidMount() {
        if (!this.props.datosEditCel)
            history.push("/dashboard");
        return;
    }

    handleOpen = () => {
        this.setState({ modalOpen: true });

    }

    guardarDetalle() {

        if (this.state.comentario) {
            const usuario = this.props.nombreUser;
            const newPostKey2 = firebase.database().ref().child(`Usuario-Objetivos/${this.props.userId}/${this.props.datosEditCel.keyFirsth}`).push().key;
            firebase.database().ref(`Usuario-Objetivos/${this.props.userId}/${this.props.datosEditCel.keyFirsth}/comentarios/${newPostKey2}`).set({
                usuario,
                tipo: 'responder',
                concepto: this.state.comentario
            });
            this.setState({ comentario: null });
            return;
        }

        const tarea = { ...this.props.datosEditCel.objetivoK, detalle: this.props.detalleO ? this.state.detalleO : null, prioridad: this.state.prioridadx[this.props.prioridadObj].prio };
        firebase.database().ref(`Usuario-Objetivos/${this.props.userId}/${this.props.datosEditCel.keyFirsth}`).set({
            ...tarea
        });


        this.setState({ detalleO: '' });  // this.setState({ prioridadO: true });
    }


    //Consultar espacio de trabajo
    renderConsultarEW() {
        if (this.props.datosEditCel.objetivoK.carpeta)
            window.open(`https://drive.google.com/drive/folders/${this.props.datosEditCel.objetivoK.carpeta}`);
    }
    render() {

        if (this.props.datosEditCel)
            return (
                <div className="ui form">
                    <div className="ui grid">
                        <div className="sixteen wide column">

                            <Modal
                                trigger={
                                    <button className="ui basic  yellow button  comment alternate outline icon" circular
                                        style={{ transform: 'scale(1.2)', top: '10px', 'border-radius': '30px', position: 'relative', left: '80%' }}
                                        onClick={() => { this.handleOpen(); this.setState({ comentario: null }); }}>
                                        <i className="comment alternate outline icon "></i>
                                    </button>
                                }
                                open={this.state.modalOpen}
                                basic
                                size='small'
                            >

                                <Modal.Content>
                                    <h2>Agrega un nuevo comentario a tu objetivo</h2>
                                    <br />
                                    <Input fluid value={this.state.comentario}
                                        onChange={e => this.setState({ comentario: e.target.value })}>
                                    </Input>

                                    <h4>"Los hombres sabios hablan porque tienen algo que decir; los necios porque tienen que decir algo".</h4><h6>-Platón</h6>
                                </Modal.Content>

                                <Modal.Actions>
                                    <Button color='red' onClick={() => { this.setState({ modalOpen: false }) }} inverted>
                                        <Icon name='close' /> Cancelar</Button>
                                    <Button color='green' onClick={() => { this.setState({ modalOpen: false }); this.guardarDetalle(this); }} inverted>
                                        <Icon name='checkmark' /> Agregar</Button>
                                </Modal.Actions>
                            </Modal>
                            <div style={{ position: "relative", top: "-20px" }}>
                                <Header>Instrucciones</Header>
                                <p>Podrás cambiar fácilmente alguna caracterisitica o adjuntar archivo al objetivo.</p>
                                <Image wrapped size='medium' style={{ width: '30em', position: 'relative', height: '18em' }} src={this.props.datosEditCel.imageEdit[this.props.datosEditCel.indexImage].urls.regular} />

                                <Header as='h5'>Describe el detalle :</Header>
                                <Input fluid value={this.props.datosEditCel.detalleObjetivo}
                                    placeholder='Detalla el objetivo a realizar...'
                                    onChange={e => this.setState({ detalleO: e.target.value })}>
                                </Input>

                                <Header as='h5'>Cambia la prioridad del objetivo:</Header>
                                < Button className="ui basic purple button" content="Cambiar" icon='id badge'
                                    onClick={() => {

                                        let valorP = parseInt(this.props.prioridadObj);
                                        valorP++;
                                        if (valorP > 2)
                                            valorP = 0;
                                        this.props.prioridadObjs(valorP);

                                    }}
                                >
                                </Button>

                                <Label as='a' color={this.state.prioridadx[this.props.prioridadObj].color} basic style={{ left: '20px', position: 'relative', top: '-6px' }}>
                                    {this.state.prioridadx[this.props.prioridadObj].prio}
                                </Label>



                                <br></br>

                                <br></br>


                                < Button className="ui basic purple button" content="Consultar espacio de trabajo" icon='google drive' fluid
                                    onClick={() => { this.renderConsultarEW() }}
                                >
                                </Button>



                            </div>


                        </div>
                    </div>



                    <div className="two column stackable ui grid">
                        <div className="column">
                            <Link to="/dashboard"  >
                                <button className='ui button grey fluid'
                                    onClick={() => {
                                        this.props.datosEditCels(null);
                                    }} > Cancelar</button>
                            </Link>
                        </div>
                        <div className="column">


                            < Button color='purple' content="Guardar" icon='save' fluid
                                onClick={() => {
                                    this.guardarDetalle(this);
                                }}
                            >
                            </Button>

                        </div>
                    </div>
                </div>





            );

        else
            return <div>Cargando...</div>;
    }
};



const mapStateToProps = (state) => {
    return {
        usuarioDetail: state.chatReducer.usuarioDetail,
        userRol: state.chatReducer.userRol,
        pasoOnboarding: state.chatReducer.pasoOnboarding,
        celPerf: state.chatReducer.celPerf,
        prioridadObj: state.chatReducer.prioridadObj,
        nombreUser: state.chatReducer.nombreUser,
        datosEditCel: state.chatReducer.datosEditCel,
        userId: state.auth.userId,
    };
};

export default connect(mapStateToProps, { prioridadObjs, datosEditCels })(HeadersC);

