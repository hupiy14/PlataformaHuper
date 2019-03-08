import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Button, Popup, Grid, Input, Header, Modal, Image, Form, Progress, Segment, Label, Divider, Icon, Step } from 'semantic-ui-react';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, pasoOnboardings, } from '../modules/chatBot/actions';
import moment from 'moment';




const timeoutLength = 150000;

class listActividades extends React.Component {
    state = { actividades: null }

    componentDidMount() {
        if (this.props.usuarioDetail) {
            const starCountRef = firebase.database().ref().child(`Usuario-Tareas/${this.props.usuarioDetail.idUsuario}`);
            starCountRef.on('value', (snapshot2) => {
                this.setState({ actividades: snapshot2.val() });
            });
        }
    }

    renderActividadXactividad(the) {
        const ObjetivosU = this.state.actividades;
        let x = 0;
        const opciones = Object.keys(ObjetivosU).map(function (key, index) {
            const actividadesU = ObjetivosU[key];

            if (the.props.selObjetivo === null || the.props.selObjetivo === key) {
                const opciones2 = Object.keys(actividadesU).map(function (key2, index) {

                    const tiempo = 'hora de Inicio: ' + actividadesU[key2].horaPlanificada;
                    const tiempo2 = 'hora a Terminar: ' + actividadesU[key2].horaEstimada;

                    let actividadT = { completed: true, active: false, colorf: null, backgroundf: null }
                    let anima = null;
                    if (actividadesU[key2].estado === "activo") {
                        actividadT = { completed: false, active: true, color: "#820bea", background: "rgba(251, 189, 8, 0.06)" }
                        if (x === 0)
                            anima = 'actividadInmediata';
                        x++;
                    }

                    return (
                        <Step completed={actividadT.completed} className={anima} active={actividadT.active} style={{ background: actividadT.background }}>
                            <Icon name='id badge' />
                            <Step.Content>
                                <Step.Title style={{ color: actividadT.color }}>{actividadesU[key2].concepto}</Step.Title>
                                <Step.Description>{tiempo}</Step.Description>
                                <Step.Description>{tiempo2}</Step.Description>
                            </Step.Content>
                        </Step>
                    );
                });
                return opciones2;
            }
        });

        return opciones;
    }

    renderActividades(the) {
        return (<Step.Group vertical>
            {this.renderActividadXactividad(the)}
        </Step.Group>);
    }

    render() {


        // console.log( moment().add('hours', 2).format('HH:mm')); // 13:23:41
        let contenido;
        if (this.state.actividades)
            contenido = this.renderActividades(this);


        return (<div>
            <h3>{this.props.titulo}</h3>
            <div className=" maximo-list">
                <div className="ui relaxed divided animated list ">
                    {contenido}
                </div>
            </div>
        </div>
        );
    }
};

const mapAppStateToProps = (state) => (
    {
        numeroTareasTerminadas: state.chatReducer.numeroTareasTerminadas,
        popupDetalle: state.chatReducer.popupDetalle,
        listaObjetivo: state.chatReducer.listaObjetivo,
        prioridadObj: state.chatReducer.prioridadObj,
        usuarioDetail: state.chatReducer.usuarioDetail,
        selObjetivo: state.chatReducer.selObjetivo,
        userId: state.auth.userId,

    });


export default connect(mapAppStateToProps, { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, pasoOnboardings })(listActividades);