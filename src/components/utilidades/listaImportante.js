import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Button, Popup, Grid, Input, Header, Modal, Image, Form, Progress, Segment, Label, Divider, Icon } from 'semantic-ui-react';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, pasoOnboardings, selObjetivos } from '../modules/chatBot/actions';
import unsplash from '../../apis/unsplash';





var fs = require('fs');

const timeoutLength = 150000;
const timeoutLength2 = 600;

class listImportante extends React.Component {
    state = {
        images: [], buscar: ['company', 'business', 'worker', 'formal',], ver: false, objetivoS: {}, detalleO: null, prioridadOk: true, guardar: false, cambio: 0, percent: 15, factor: 10, ntareas: 1,
        consultaTareas: {}, titulo: null, selectedFile: null, loaded: 0, WorkFlow: null,
        prioridadx: [{ prio: 'inmediato', color: 'red' }, { prio: 'urgente', color: 'yellow' }, { prio: 'normal', color: 'olive' }]
    };


    //vairble x aumento n cantidad terminada n*x
    //fotos de la tarjetas
    onSearchSubmit = async () => {
        const response = await unsplash.get('/search/photos', {
            params: { query: this.state.buscar[this.props.prioridadObj] },

        });
        this.setState({ images: response.data.results })
        // console.log(this.state.images);
    }
    componentDidMount() {
        this.onSearchSubmit()
        // console.log(this.example2);
        let variable = {};
        const starCountRef = firebase.database().ref().child(`Usuario-Objetivos/${this.props.userId}`);
        starCountRef.on('value', (snapshot) => {

            const ObjTrabajo = snapshot.val();
            let objetivos = [];
            if (!snapshot.val()) return;
            Object.keys(ObjTrabajo).map(function (key2, index) {
                if (ObjTrabajo[key2].compartidoEquipo) {
                    const starCountRef = firebase.database().ref().child(`Usuario-Objetivos/${ObjTrabajo[key2].idUsuarioGestor}/${ObjTrabajo[key2].objetivoPadre}`);
                    starCountRef.on('value', (snapshot) => {
                        if(snapshot.val()){
                        const resultado2 = { ...ObjTrabajo[key2], avancePadre:   snapshot.val().avance }
                        objetivos[key2] = { ...resultado2 };
                        }
                    });

                }
                else {
                    objetivos[key2] = { ...ObjTrabajo[key2] };
                }

            });

            variable = { ...variable, objetivos }
            this.props.listaObjetivos(variable);
        });

        const starCountRef2 = firebase.database().ref().child(`Usuario-Tareas/${this.props.userId}`);
        starCountRef2.on('value', (snapshot) => {
            variable = { ...variable, tareas: snapshot.val() }
            this.props.listaObjetivos(variable);
        });

        const starCountRef3 = firebase.database().ref().child(`Usuario-Flujo-Trabajo/${this.props.userId}`);
        starCountRef3.on('value', (snapshot) => {
            this.setState({ WorkFlow: snapshot.val() });
        });

        this.handleActualizar();

    }

    guardarDetalle(the) {
        var updates = {};
        let idObjetivo;


        const cconsulta = this.props.listaObjetivo.objetivos;
        Object.keys(cconsulta).map(function (key2, index) {
            if (cconsulta[key2].estado === 'activo' || cconsulta[key2].estado === 'validar')
                if (cconsulta[key2].concepto === the.state.objetivoS.concepto) {
                    idObjetivo = key2;
                    //  console.log(key2);
                }
        });
        updates = {};

        const tarea = { ...this.state.objetivoS, detalle: this.state.detalleO !== '' && this.state.detalleO !== null ? this.state.detalleO : this.state.objetivoS.detalle ? this.state.objetivoS.detalle : '' };
        //  console.log(tarea);

        tarea.prioridad = the.state.prioridadOk ? tarea.prioridad : tarea.prioridad === the.state.prioridadx[the.props.prioridadObj].prio ? tarea.prioridad : the.state.prioridadx[the.props.prioridadObj].prio;
        updates[`Usuario-Objetivos/${this.props.userId}/${idObjetivo}`] = tarea;
        firebase.database().ref().update(updates);
        this.setState({ detalleO: '' });  // this.setState({ prioridadO: true });
    }

    onVideoSelect(objetivo) {

        if (this.state.objetivoS) {
            this.setState({ objetivoS: objetivo });
        }


    }


    handleUpload = () => {
        //data
        const data = new FormData()
        data.append('file', this.state.selectedFile, this.state.selectedFile.name)
    }

    handleselectedFile = event => {
        /// carga el objeto
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        })
    }

    handlePaso = () => {
        this.timeout = setTimeout(() => {
            this.props.pasoOnboardings(3);
        }, timeoutLength)
    }


    // habilita el tercer paso
    handleActualizar = () => {
        this.timeout = setTimeout(() => {
            this.setState({ ver: false });
        }, timeoutLength2)
    }

    componentDidUpdate() {
        if (this.state.guardar) {
            this.setState({ guardar: false });
            this.guardarDetalle(this);
        }

    }

    //Consultar espacio de trabajo
    renderConsultarEW() {
        if (this.state.objetivoS.carpeta)
            window.open(`https://drive.google.com/drive/folders/${this.state.objetivoS.carpeta}`);
    }

    renderConstruirObj(images, the) {
        if (the.props.listaObjetivo && the.props.listaObjetivo.objetivos && the.props.listaObjetivo.tareas) {

            const cconsulta = the.props.listaObjetivo.objetivos;

            const opciones = Object.keys(cconsulta).map(function (key2, index) {

                const objetivo = cconsulta[key2];
                const factorObjetivo = cconsulta[key2].numeroTareas;
                let factor = {};
                //  const detalleOO =  cconsulta[key2].estado ? cconsulta[key2].estado : '';
                let tareasCompleta = 0;
                let resultado = 0;

                //the.setState( { listAll : this.state.listAll + 1 });
                if (cconsulta[key2].estado === 'activo' || cconsulta[key2].estado === 'validar') {
                    Object.keys(the.props.listaObjetivo.tareas).map(function (key3, index) {

                        const consultaTareaTT = the.props.listaObjetivo.tareas[key3];
                        Object.keys(consultaTareaTT).map(function (key33, index) {
                            if (key3 === key2) {
                                if (consultaTareaTT[key33].estado === 'finalizado') {
                                    tareasCompleta = tareasCompleta + 1;
                                }
                            }
                        });
                        // the.increment(factorObjetivo, numeroTareasTs);
                        factor = { factor: (100 / factorObjetivo), numero: tareasCompleta };
                        resultado = Math.round(factor.factor * tareasCompleta);
                        // console.log(resultado);


                    });

                    //color de la seleccion      
                    let style = {
                        borderRadius: 0.5,
                        height: '100px',
                        background: the.props.selObjetivo === key2 ? '#fbe4ff' : null,
                    };


                    //objetivo pasado
                    if (objetivo.fechafin) {

                        const fec = new Date(objetivo.fechafin);

                        if (fec < new Date()) {
                            style = {
                                borderRadius: 0.5,
                                background: the.props.selObjetivo === key2 ? '#fbe4ff' : '#f9333340',
                                height: '100px',
                            };
                        }
                    }


                    //responsive
                    let style2 = {
                        borderRadius: 0.2,
                    };

                    if (window.screen.width < 500) {
                        style2 = {
                            overflow: 'auto',
                            height: '360px',
                        };
                    }

                    let styleD = {
                        position: 'relative',
                        left: '56%',
                        top: cconsulta[key2].detalle ? cconsulta[key2].detalle.length > 50 ? '-80px' : '-60px' : '-50px',
                    };

                    if (the.props.alingD) { styleD.left = '25%'; }


                    //Impacto de las activiadades
                    let iconoImpacto;
                    let colorImpacto;
                    if (cconsulta[key2].impacto === "Negocío") { iconoImpacto = "money bill alternate"; colorImpacto = "green"; }
                    else if (cconsulta[key2].impacto === "Proceso") { iconoImpacto = "cogs"; colorImpacto = "blue"; }
                    else if (cconsulta[key2].impacto === "Organización") { iconoImpacto = "boxes"; colorImpacto = "purple"; }
                    else if (cconsulta[key2].impacto === "Ventas") { iconoImpacto = "hospital outline"; colorImpacto = "yellow"; }

                    //Flujo de trabajo
                    let listaX = the.state.WorkFlow;
                    let colorFase = null;
                    let labelFase = null;
                    let numFase = null;
                    let flujoActivo = null;
                    let iconoObjetivo = the.props.icono;
                    let avancePadre = null;

                    //grafica el avance del objetivo compartido




                    if (cconsulta[key2].tipo === "Empieza en tu flujo de trabajo") {
                        iconoObjetivo = "th";
                        numFase = cconsulta[key2].fase;
                        colorFase = "rgba(212, 179, 20, 0.42)";
                        style = { ...style, height: '140px' };
                        if (listaX) {
                            listaX = listaX.fases;
                            Object.keys(listaX).map(function (key3, index) {
                                if (!cconsulta[key2].fase && !labelFase) {
                                    colorFase = listaX[key3].color;
                                    labelFase = listaX[key3].label;
                                }
                                else {
                                    if (cconsulta[key2].fase && cconsulta[key2].fase.toString() === key3) {
                                        colorFase = listaX[key3].color;
                                        labelFase = listaX[key3].label;
                                    }
                                }

                            });
                            flujoActivo = <Label as='a' style={{ background: colorFase }} image>
                                <Icon name="tasks" size="large" ></Icon>
                                <h5 color="white" style={{ top: '-20px', position: 'relative' }} >Fase {numFase}:</h5>
                                <Label.Detail style={{ top: '-27px', left: '-5px', position: 'relative' }}>{labelFase ? labelFase : '<"Por definir">'}</Label.Detail>
                            </Label>
                        }

                        //if(cconsulta[key2].tipo === "Empieza en tu flujo de trabajo") {}
                    }

                    let topAvance = '-10px';
                    if (cconsulta[key2].detalle) {
                        topAvance = '-23px';
                        if (cconsulta[key2].detalle.length > 10)
                            topAvance = '-40px';
                    }

                    if (cconsulta[key2].compartidoEquipo) {
                        topAvance = '-40px';
                        iconoObjetivo = "users";
                        style.height = cconsulta[key2].detalle.length > 30 ? cconsulta[key2].detalle.length > 80 ? '190px' : '160px' : '140px';
                        avancePadre =

                            <div>
                                <h5 style={{ top: '-70px', position: 'relative' }}>Avance del equipo:</h5>
                                <Progress percent={cconsulta[key2].avancePadre >= 100 ? 100 : cconsulta[key2].avancePadre === 0 ? 15 : cconsulta[key2].avancePadre} inverted size='small' indicating progress style={{ top: '-80px' }} />
                            </div>

                    }


                    return (
                        <div className="item segment" key={key2} >
                            <i className={`large ${iconoObjetivo} aligned icon`} style={{ color: '#fbbd087d' }} ></i>
                            <div className=" content"   >

                                <Segment style={style} onClick={() => { the.props.selObjetivo === key2 ? the.props.selObjetivos(null) : the.props.selObjetivos(key2); }} >
                                    <div className="header"  >{cconsulta[key2].concepto}</div>
                                    <div className="description" style={{ width: '55%' }}  >{cconsulta[key2].detalle ? cconsulta[key2].detalle : ''}</div>
                                    <Label as='a' color={cconsulta[key2].prioridad === 'normal' ? 'teal' : cconsulta[key2].prioridad === 'inmediato' ? 'purple' : 'yellow'} basic style={{ left: '84%', position: 'relative', top: cconsulta[key2].detalle ? cconsulta[key2].detalle.length > 50 ? '-52px' : '-28px' : '-22px' }}>
                                        {cconsulta[key2].prioridad}
                                    </Label>

                                    <Label as='a' color={colorImpacto} basic style={{ left: '63%', position: 'relative', top: cconsulta[key2].detalle ? cconsulta[key2].detalle.length > 50 ? '-17px' : '5px' : '12px' }} >
                                        {cconsulta[key2].impacto}
                                        <Icon name={iconoImpacto} style={{ left: '10px', position: 'relative' }} />
                                    </Label>
                                    <Divider vertical style={{ left: '75%' }}>:</Divider>


                                    <br />
                                    <div style={styleD}>


                                        <Popup
                                            trigger={<Button icon='id badge' color='yellow'
                                                onClick={() => {

                                                    if (!the.props.usuarioDetail.usuario.onboarding)
                                                        the.handlePaso();

                                                    the.onVideoSelect(objetivo);
                                                    //  the.props.prioridadObjs(0); 
                                                    the.setState({ prioridadOk: true });
                                                    the.setState({ prioridadOk: false });
                                                    the.props.prioridadObjs(the.props.prioridadObj + 1 > 2 ? 0 : the.props.prioridadObj + 1);
                                                    the.setState({ guardar: true });
                                                }}
                                            ></Button>}
                                            content='Cambiar Prioridad'
                                            on='hover'
                                        />


                                        <Modal
                                            trigger={

                                                <Popup
                                                    trigger={<Button color='purple' icon='edit outline'
                                                        onClick={() => {

                                                            if (!the.props.usuarioDetail.usuario.onboarding)
                                                                the.handlePaso();

                                                            the.setState({ cambio: Math.round(Math.random() * 6) });
                                                            the.onVideoSelect(objetivo);
                                                            the.setState({ ver: !the.state.ver });
                                                            the.setState({ titulo: cconsulta[key2].concepto });
                                                            the.setState({ detalleO: cconsulta[key2].detalle });
                                                        }}
                                                    />}
                                                    content='Detalle del Objetivo'
                                                    on='hover'
                                                />

                                            }
                                            open={the.state.ver}

                                        >

                                            <Modal.Header>Detalle de objetivo: " {the.state.titulo} "</Modal.Header>
                                            <Modal.Content image scrolling>
                                                <div className="ui form">
                                                    <div className="ui grid">
                                                        <div className="eight wide column">
                                                            <Image wrapped size='medium' src={images[1] ? images[the.state.cambio].urls.regular : ''} />
                                                        </div>
                                                        <div className="eight wide column">
                                                            <Modal.Description>
                                                                <Header>Instrucciones</Header>
                                                                <p>Podrás cambiar fácilmente el detalle o adjuntar archivo al objetivo.</p>


                                                                <Header as='h5'>Describe el detalle :</Header>
                                                                <Input fluid value={the.state.detalleO}
                                                                    key={key2}
                                                                    placeholder='Detalla el objetivo a realizar...'
                                                                    onChange={e => the.setState({ detalleO: e.target.value })}>
                                                                </Input>
                                                                <br></br>
                                                                <button className="ui button green google drive icon  fluid" onClick={() => { the.renderConsultarEW(cconsulta[key2].carpeta) }}>Consultar espacio de trabajo
                                                                <i className="google drive icon prueba-xx"> </i>
                                                                </button>
                                                            </Modal.Description>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Modal.Content>

                                            <Modal.Actions>

                                                <div className="two column stackable ui grid">
                                                    <div className="column">
                                                        <button className='ui button grey fluid'
                                                            key={key2}
                                                            onClick={() => {
                                                                the.setState({ ver: !the.state.ver });
                                                            }} > Cancelar</button>

                                                    </div>
                                                    <div className="column">
                                                        <button className='ui button purple fluid save icon'
                                                            key={key2}
                                                            onClick={() => {
                                                                the.setState({ ver: !the.state.ver });
                                                                the.guardarDetalle(the);
                                                            }} >
                                                            Guardar
                                                            <i className='large middle  save aligned icon aling-Derecha2 '>
                                                            </i>
                                                        </button>

                                                    </div>
                                                </div>


                                            </Modal.Actions>


                                        </Modal>

                                    </div>

                                    <Progress percent={resultado >= 100 ? 100 : resultado === 0 ? 15 : resultado} inverted size='small' indicating progress style={{ top: topAvance }} />

                                    {avancePadre}
                                </Segment>

                            </div>
                            {flujoActivo}
                        </div>
                    );
                }
            });
            return opciones;

        }
        return (
            <div className="ui segment loaderOBJ">
                <div className="ui active dimmer loaderOBJ">

                    <div className="ui text loader">A la espera de tus Objetivos</div>
                </div>
                <br></br>
                <br></br>
            </div>
        );

    }


    render() {
        //  console.log(this.props.popupDetalle);
        // console.log( <RandomImage/>);
        const titulo = `${this.props.titulo}`;
        return (
            <div>
                <h3>{titulo}</h3>
                <div className=" maximo-list">
                    <div className="ui relaxed divided animated list ">
                        {this.renderConstruirObj(this.state.images, this)}
                    </div>
                </div>
            </div>


        )
    };
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


export default connect(mapAppStateToProps, { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, pasoOnboardings, selObjetivos })(listImportante);