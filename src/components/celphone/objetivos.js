import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { chatOn, chatOff, actividadPrincipal, imagenOKRs, popupBot } from '../../actions';
import {  Image } from 'semantic-ui-react';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, pasoOnboardings, selObjetivos, estadochats, objTIMs } from '../modules/chatBot/actions';
import unsplash from '../../apis/unsplash';
import '../HuperModules/objetivodet.css';
import '../styles/styleLoader.css';


const timeoutLength2 = 1000;
const timeoutLength3 = 60000;

class listImportante extends React.Component {

    state = {
        images: [], buscar: ['company', 'business', 'worker', 'formal',], ver: false, detalleO: null, percent: 15, factor: 10,
        titulo: null, selectedFile: null, loaded: 0, WorkFlow: null, files: null, keyF: null,
        prioridadx: [{ prio: 'inmediato', color: 'red' }, { prio: 'urgente', color: 'yellow' }, { prio: 'normal', color: 'olive' }], activiadesObj: null, comentariosObj: null, adjuntosObj: null,
        factores: null, UtilFactors: null, objStateObj: null, objInicial: null,
        comentario: null, modalOpen2: null, modalOpen: false,

        resultRoot: null, resultCurrent: null, shResult: null, objSelResul: null, impactoUtils: null,
        objAnterior: null,

    };


    //vairble x aumento n cantidad terminada n*x
    //fotos de la tarjetas
    onSearchSubmit = async () => {

        const response = await unsplash.get('/search/photos', {
            params: { query: this.state.buscar[this.props.prioridadObj] },
        });
        this.setState({ images: response.data.results })
    }


    componentDidMount() {

        this.onSearchSubmit()
        let variable = {};

        let impactoFlujo = firebase.database().ref().child(`Utils/Impacto-Objetivo`);
        impactoFlujo.on('value', (snapshot) => {
            this.setState({ impactoUtils: snapshot.val() })
        });
        const starCountRef = firebase.database().ref().child(`Usuario-OKR/${this.props.userId}`);
        starCountRef.on('value', (snapshot) => {

            const ObjTrabajo = snapshot.val();
            let objetivos = [];
            if (!snapshot.val()) return;
            Object.keys(ObjTrabajo).map((key2, index) => {
                objetivos[key2] = { ...ObjTrabajo[key2] };
                return ObjTrabajo[key2];
            });
            variable = { ...variable, objetivos }
            this.props.listaObjetivos(variable);
        });

        const starCountRef33 = firebase.database().ref().child(`Utilidades-Valoraciones`);
        starCountRef33.on('value', (snapshot) => {
            this.setState({ UtilFactors: snapshot.val() });
        });

        const starCountRef2 = firebase.database().ref().child(`Usuario-OKR/${this.props.userId}`);
        starCountRef2.on('value', (snapshot) => {
            variable = { ...variable, tareas: snapshot.val() }
            this.props.listaObjetivos(variable);
        });

        const starCountRef3 = firebase.database().ref().child(`Usuario-Flujo-Trabajo/${this.props.userId}`);
        starCountRef3.on('value', (snapshot) => {
            this.setState({ WorkFlow: snapshot.val() });
        });

        //   this.handleActualizar();
    }

    TIMOBJ = () => {
        this.timeout = setTimeout(() => {
            this.props.chatOn();
        }, timeoutLength3)
    }


    changeObj(objetivo) {
        if (!this.state.resultRoot && objetivo.objetivos) {
            this.setState({ resultRoot: objetivo });
            Object.keys(objetivo.objetivos).map((key, index) => {
                if (Object.keys(objetivo.objetivos) - 1 === index)
                    this.setState({ objStateObj: objetivo.objetivos[key] });
                return objetivo.objetivos[key];
            });
        }
        this.setState({ resultCurrent: objetivo });
    }


    renderConstruirObj(images) {
        if (this.props.listaObjetivo && this.props.listaObjetivo.objetivos) {
            let flagObjetivosTerminados = null;
            const cconsulta = this.props.listaObjetivo.objetivos;
            let y = 0;
            const opciones = Object.keys(cconsulta).map((key2, index) => {
                y++;
                if (y >= this.state.images.length)
                    y = 1;
                let tareasCompleta = 0;
                let resultado = 0;
                if (cconsulta[key2].estado === 'activo' || cconsulta[key2].estado === 'validar') {

                    let objPrincipal = cconsulta[key2];
                    if (objPrincipal.concepto) {
                        if (!this.props.actividadPrin) {
                            this.props.actividadPrincipal(key2);
                        }
                        else {
                            resultado = 45;

                            if (this.state.objAnterior !== key2) {
                                let avanceOKR = objPrincipal.concepto.length > 43 ? 'one red4' : 'one red3';
                                if (resultado >= 30 && resultado < 75)
                                    avanceOKR = objPrincipal.concepto.length > 43 ? 'one yellow4m' : 'one yellow3m';
                                if (resultado >= 75 && resultado <= 100)
                                    avanceOKR = objPrincipal.concepto.length > 43 ? 'one green4' : 'one green3';



                                let styleSel = { top: '-2em', position: 'relative', width: '20em', left: '2em' };
                                if (this.props.actividadPrin === key2) {
                                    styleSel = { top: '-2em', position: 'relative', width: '20em', left: '2em', color: '#c13292', fontWeight: 'bold' };
                                    avanceOKR = objPrincipal.concepto.length > 43 ? 'one sel2' : 'one sel';
                                }

                                return (
                                    <li className={avanceOKR} style={{ height: '4em' }} onClick={() => { this.props.actividadPrincipal(key2); }} >
                                        <Image style={{ height: '3em' }} src={this.state.images[y] ? this.state.images[y].urls.thumb : ''} size="mini" circular alt='task hupper'></Image>
                                        <span className="task-title" style={styleSel}>{objPrincipal.concepto} </span>
                                        <span className="task-time" style={{ top: '-2em', position: 'relative', width: '23em' }}>{objPrincipal.keyResult1} </span>
                                    </li>

                                );
                            }
                        }
                    }
                }
                return null;
            });
            if (flagObjetivosTerminados === true)
                this.props.estadochats('Objetivos Terminados');
            return opciones;

        }
        return (
            <div className="box">
                <div className="loader9"></div>
                <p style={{
                    height: '3em',
                    borderRadius: '3em'
                }}>A la espera de tus Objetivos</p>
            </div >
        );
    }

    render() {
        const titulo = `${this.props.titulo}`;
        return (this.renderConstruirObj(this.state.images)

        )
    };
};

const mapAppStateToProps = (state) => (
    {
        popupDetalle: state.chatReducer.popupDetalle,
        actividadPrin: state.chatReducer.actividadPrin,
        listaObjetivo: state.chatReducer.listaObjetivo,
        prioridadObj: state.chatReducer.prioridadObj,
        selObjetivo: state.chatReducer.selObjetivo,
        usuarioDetail: state.chatReducer.usuarioDetail,
        nombreUser: state.chatReducer.nombreUser,
        estadochat: state.chatReducer.estadochat,
        userId: state.auth.userId,
    });

export default connect(mapAppStateToProps, { imagenOKRs, actividadPrincipal, listaObjetivos, estadochats, prioridadObjs, popupDetalles, numeroTareasTs, pasoOnboardings, selObjetivos, chatOn, chatOff, objTIMs, popupBot })(listImportante);