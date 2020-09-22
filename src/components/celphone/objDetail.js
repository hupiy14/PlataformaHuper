import React from 'react';
import { connect } from 'react-redux';
import { chatOn, chatOff, actividadPrincipal, imagenOKRs, popupBot } from '../../actions';
import { Button, Popup, Input, Modal, Progress, Icon, Image } from 'semantic-ui-react';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, pasoOnboardings, selObjetivos, estadochats, objTIMs } from '../modules/chatBot/actions';
import unsplash from '../../apis/unsplash';
import ImagenObj from '../HuperModules/objPrincipal';
import '../HuperModules/objetivodet.css';
import '../styles/styleLoader.css';
import perfil from '../../images/perfil.png';
import { avanceOKR, dataBaseManager } from '../../lib/utils';

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


        selectCurrent: null, selectLast: null
    };


    //vairble x aumento n cantidad terminada n*x
    //fotos de la tarjetas
    onSearchSubmit = async () => {

        const response = await unsplash.get('/search/photos', {
            params: { query: this.state.buscar[this.props.prioridadObj] },
        });
        this.setState({ images: response.data.results })
    }

    componentDatabase(tipo, path, objectIn, mensaje, mensajeError) {
        let men = dataBaseManager(tipo, path, objectIn, mensaje, mensajeError);
        if (men && men.mensaje)
            this.props.popupBot({ mensaje: men.mensaje });
        return men;
    }

    componentDidMount() {

        this.onSearchSubmit()
        let variable = {};
        this.selectCurrent = null;
        let impactoFlujo = this.componentDatabase('get', `Utils/Impacto-Objetivo`);
        impactoFlujo.on('value', (snapshot) => {
            this.setState({ impactoUtils: snapshot.val() })
        });
        const starCountRef = this.componentDatabase('get', `Usuario-OKR/${this.props.userId}`);
        starCountRef.on('value', (snapshot) => {

            const ObjTrabajo = snapshot.val();
            let objetivos = [];
            if (!snapshot.val()) return;
            Object.keys(ObjTrabajo).map((key2, index) => {
                /*  if (ObjTrabajo[key2].tipologia === '3') {
                      const starCountRef =  this.componentDatabase('get',`Usuario-OKR/${ObjTrabajo[key2].idUsuarioGestor}/${ObjTrabajo[key2].objetivoPadre` );
                      starCountRef.on('value', (snapshot) => {
                          if (snapshot.val()) {
                              const resultado2 = { ...ObjTrabajo[key2], avancePadre: snapshot.val().avance }
                              objetivos[key2] = { ...resultado2 };
                          }
                      });
                  }
                  else {
                      */
                objetivos[key2] = { ...ObjTrabajo[key2] };
                //       }
                return ObjTrabajo[key2];
            });
            variable = { ...variable, objetivos }
            this.props.listaObjetivos(variable);
        });

        const starCountRef33 = this.componentDatabase('get', `Utilidades-Valoraciones`);
        starCountRef33.on('value', (snapshot) => {
            this.setState({ UtilFactors: snapshot.val() });
        });

        const starCountRef2 = this.componentDatabase('get', `Usuario-Task/${this.props.userId}`);
        starCountRef2.on('value', (snapshot) => {
            variable = { ...variable, tareas: snapshot.val() }
            this.props.listaObjetivos(variable);
        });

        const starCountRef3 = this.componentDatabase('get', `Usuario-Flujo-Trabajo/${this.props.userId}`);
        starCountRef3.on('value', (snapshot) => {
            this.setState({ WorkFlow: snapshot.val() });
        });

        //   this.handleActualizar();
    }

    calculoDeAvance() {
        if (this.props.listaObjetivo == null)
            return;
        const objs = this.props.listaObjetivo.objetivos;
        let factorEqHup = [];
        //Encontrar factor
        this.setState({ ObjsFactors: [] });
        if (objs)
            Object.keys(objs).map((key, index) => {
                if (!objs[key] || !objs[key].concepto)
                    return null;
                let facPrioridad = 1;
                let facDificultad = 1;
                let facRepeticiones = 1;
                let facTipo = 1;
                let facCompartido = objs[key].tipologia === '3' ? objs[key].porcentajeResp ? objs[key].porcentajeResp * 0.01 : 1 : 1;
                let facCalidad = 1;
                let facValidacion = 1;
                let facProductividad = 1;
                //Object.keys(this.state.UtilFactors.Calidad).map((key2, index) =>{});
                Object.keys(this.state.UtilFactors.Dificultad).map((key2, index) => {
                    if (objs[key].dificultad === this.state.UtilFactors.Dificultad[key2].concepto)
                        facDificultad = this.state.UtilFactors.Dificultad[key2].valor;
                    return this.state.UtilFactors.Dificultad[key2];
                });
                Object.keys(this.state.UtilFactors.Prioridad).map((key2, index) => {
                    if (objs[key].prioridad === key2)
                        facPrioridad = this.state.UtilFactors.Prioridad[key2];
                    return this.state.UtilFactors.Prioridad[key2];
                });
                Object.keys(this.state.UtilFactors.Tipo).map((key2, index) => {
                    if (objs[key].tipo === this.state.UtilFactors.Tipo[key2].concepto)
                        facTipo = this.state.UtilFactors.Tipo[key2].valor;
                    return this.state.UtilFactors.Tipo[key2];
                });
                Object.keys(this.state.UtilFactors.ValidacionGestor).map((key2, index) => {
                    if (objs[key].estado === this.state.UtilFactors.ValidacionGestor[key2].concepto)
                        facValidacion = this.state.UtilFactors.ValidacionGestor[key2].valor;
                    return this.state.UtilFactors.ValidacionGestor[key2];
                });
                //algoritmo de medicion del trabajo
                const puntos = ((1 + facPrioridad + facTipo) * facRepeticiones * facDificultad) * facCompartido * facCalidad * facValidacion * facProductividad;
                factorEqHup.push({ key, puntos, usuario: objs[key].idUsuario })
                return null;
            });
        this.setState({ factores: factorEqHup })
    }

    guardarDetalle() {

        if (this.state.comentario) {

            const newPostKey2 = this.componentDatabase('key', `Usuario-OKR/${this.props.userId}/${this.state.keyF}`);
            if (this.state.keyF != null)
                this.componentDatabase('insert', `Usuario-OKR/${this.props.userId}/${this.state.keyF}/comentarios/${newPostKey2}`, {
                    usuario: this.props.usuarioDetail.usuario.usuario,
                    tipo: 'responder',
                    concepto: this.state.comentario,
                    imagen: this.props.usuarioDetail.usuario.imagenPerfil ? this.props.usuarioDetail.usuario.imagenPerfil : ''
                });

            this.setState({ comentario: null });
            return;
        }

        let objAux = this.state.resultRoot ? this.state.resultRoot : this.state.objetivoS;
        const tarea = { ...objAux, detalle: this.state.detalleO ? this.state.detalleO : null, prioridad: this.state.prioridadx[this.props.prioridadObj].prio };
        if (this.state.keyF != null)
            this.componentDatabase('insert', `Usuario-OKR/${this.props.userId}/${this.state.keyF}`, {
                ...tarea
            });
        this.setState({ detalleO: '' });  // this.setState({ prioridadO: true });
    }

    handleActualizar = () => {
        this.timeout = setTimeout(() => {
            this.calculoDeAvance();
            this.setState({ ver: false });
        }, timeoutLength2)
    }

    TIMOBJ = () => {
        this.timeout = setTimeout(() => {
            this.props.chatOn();
        }, timeoutLength3)
    }

    //Consultar espacio de trabajo
    renderConsultarEW(carpeta) {
        if (carpeta)
            window.open(`https://drive.google.com/drive/folders/${carpeta}`);
    }

    handleOpen = () => {
        this.setState({ modalOpen: true });
        //this.modalO = true;
    }

    renderTareas(tareas) {

        if (!tareas)
            return;
        //tareas.sort((obj1, obj2) => { return parseInt(obj1.horaActivo) > parseInt(obj2.horaActivo) ? obj1.horaActivo : obj2.horaActivo });
        const opciones = Object.keys(tareas).map((key3, index) => {
            if (!tareas[key3].concepto)
                return null;
            let colorTask = null;
            let iconoTask = null;

            if (tareas[key3].estado === 'finalizado') {
                colorTask = '#afafaf';
                iconoTask = 'check circle';
            }
            else if (tareas[key3].estado === 'activo') {
                colorTask = 'purple';
                iconoTask = 'arrow alternate circle right';
            }
            else
                return null;
            return (

                <div className="item">
                    <i className={`large ${iconoTask} middle aligned icon`}></i>
                    <div className="content">
                        <div className="header" style={{ color: colorTask }}>{tareas[key3].concepto}</div>
                        <div className="description">{tareas[key3].tiempoReal ? tareas[key3].tiempoReal : tareas[key3].tiempoEstimado} horas</div>
                    </div>
                </div>

            );
        });
        return opciones;
    }


    renderComentarios() {

        if (this.state.objetivoS && this.state.objetivoS.comentarios) {
            let numero = 0;
            const opciones = Object.keys(this.state.objetivoS.comentarios).map((key3, index) => {

                numero = numero + 1;

                let recbox = '15px 20px 15px 5px';
                let comentarioT = 'Propio';
                let color = '#f21b888c';
                if (this.state.objetivoS.comentarios[key3].tipo === 'feedback') {

                    recbox = '15px 20px 3px 20px';
                    comentarioT = 'Gestor';
                    color = null;
                }

                let imagenComen = this.state.objetivoS.comentarios[key3].imagen ? this.state.objetivoS.comentarios[key3].imagen : perfil;

                return (
                    <div className="ui cards" style={{ left: '38%', borderRadius: recbox, position: 'relative' }}>
                        <div className="card" style={{ background: color }}>
                            <div className="content">
                                <img alt='tus comentarios en tus objetivos' className="right floated circular mini ui image" src={imagenComen} />
                                <div className="header">{this.state.objetivoS.comentarios[key3].usuario}</div>
                                <div className="meta">{comentarioT}</div>
                                <div className="description">{this.state.objetivoS.comentarios[key3].concepto}</div>

                            </div>
                        </div>
                    </div>
                );
            });
            return opciones;
        }
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



    renderObjetivoPrincipalApp(objPrincipal, imgy, iconoImpacto, colorImpacto, key2, visiKresult, resultado, avancePadre) {

        this.props.imagenOKRs(this.state.images[imgy] ? this.state.images[imgy].urls.small : '');
        let heightHup = objPrincipal.concepto.length > 17 ? '-12em' : '-12em';
        return (
            <div className="user-profile" style={{ height: '2.5em', top: '-3.0em', position: 'relative' }}>
                {avancePadre}
                <div style={{ position: 'relative', top: '-4.7em', zIndex: 3, visibility: visiKresult }}>
                    <Progress percent={resultado >= 100 ? 100 : resultado === 0 ? 15 : resultado} inverted size='small' indicating progress style={{ width: '90%' }} />
                </div>
                <h4 style={{ position: 'relative','font-weight': '800',  top: '-6em', left: '1em', width: '80%', transform: 'scale(1.2)' }}>{objPrincipal.concepto}</h4>
                <div className="user-details" style={{ top: heightHup }}>
                    <h5 style={{ color: '#dbf4d6', top: '5.5em', width: '17em', textAlign: 'center', position: 'relative' }}>{objPrincipal.keyResult1}</h5>
                    <h5 style={{ color: '#dbf4d6', top: '4em', width: '17em', textAlign: 'center', position: 'relative' }}>{objPrincipal.keyResult2}</h5>
                </div>
                <div style={{ color: colorImpacto, top: '-7.2em', position: 'relative', transform: 'scale(1.4)' }}>
                    <Icon name={iconoImpacto} style={{ left: '3%', position: 'relative' }} />
                </div>
                <Modal
                    trigger={
                        <button className="ui basic  button comment alternate outline icon" circular="true"
                            style={{ top: '-14em', borderRadius: '2em', zIndex: 5, position: 'relative', left: '-8.5em' }}

                            onClick={(e, s) => {
                                this.setState({ keyF: key2 });
                                this.setState({ objetivoS: objPrincipal });
                                this.setState({ comentariosObj: this.renderComentarios() });
                                this.setState({ comentario: null });
                                this.handleOpen();

                            }}>
                            <i style={{ color: 'white' }} className="comment alternate outline icon "></i>
                        </button>
                    }

                    open={this.state.modalOpen}
                    basic
                    size='small'>
                    <Modal.Content>
                        <h2 style={{ 'text-align': 'center' }} >Agrega un nuevo comentario a tu objetivo</h2>
                        <br />
                        <div style={{ 'text-align': 'center' }}>
                            <div style={{ height: '21em', overflow: 'auto' }}>
                                {this.renderComentarios()}
                            </div>
                            <br></br>
                            <Input style={{ width: '90%' }} value={this.state.comentario}
                                onChange={e => this.setState({ comentario: e.target.value })}>
                            </Input>
                        </div>
                        <h4 style={{ 'text-align': 'center' }}>"Los hombres sabios hablan porque tienen algo que decir;<br></br>los necios porque tienen que decir algo".</h4>
                        <h6 style={{ 'text-align': 'center' }}>-Platón</h6>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='pink' onClick={() => { this.setState({ modalOpen: false }) }} inverted>
                            <Icon name='close' /> Cancelar</Button>
                        <Button color='teal' onClick={() => { this.setState({ modalOpen: false }); this.guardarDetalle(this); }} inverted>
                            <Icon name='checkmark' /> Agregar</Button>
                    </Modal.Actions>
                </Modal>
                <div style={{ left: '1.6%', position: 'relative', zIndex: 5, transform: 'scale(0.9)', top: '-19.5em' }} onClick={() => { this.renderConsultarEW(objPrincipal.carpeta) }}>
                    <Popup
                        trigger={<Icon name="paperclip" style={{ left: '-11.5em', position: 'relative', top: '8.2em', transform: 'scale(1.2)' }} />}
                        content='Consulta tus archivos'
                        on='hover' />
                </div>
                <div style={{ left: '1.5%', position: 'relative', zIndex: 5, transform: 'scale(0.9)', top: '-6.2em' }} onClick={() => { this.setState({ objetivoS: objPrincipal }); }}>
                    <Popup
                        trigger={<Icon name="telegram" style={{ transform: 'scale(1.7)', left: '-2em', position: 'relative', top: '-6.5em' }} />}
                        on='hover'>
                        <Popup.Content>
                            <h5>trabajando en ello</h5>
                            <div className="ui relaxed divided list">
                                {this.renderTareas(objPrincipal.tasks)}
                            </div>
                        </Popup.Content>
                    </Popup>
                </div>
            </div>);
    }

    renderConstruirObj(images) {
        if (this.props.listaObjetivo && this.props.listaObjetivo.objetivos) {
            let flagObjetivosTerminados = null;
            const cconsulta = this.props.listaObjetivo.objetivos;
            let y = 0;
            const opciones = Object.keys(cconsulta).map((key2, index) => {
                y++;
                if (y > this.state.images.length)
                    y = 1;
                let tareasCompleta = 0;
                let resultado = 0;
                if (cconsulta[key2].estado === 'activo' || cconsulta[key2].estado === 'validar') {


                    //factor de progreso por horas 
                    let factorSemana = 0;
                    let factorObjetivo = 0;
                    if (this.state.factores !== null) {
                        Object.keys(this.state.factores).map((keyfac, index) => {
                            if (cconsulta[key2].idUsuario === this.state.factores[keyfac].usuario)
                                factorSemana = factorSemana + this.state.factores[keyfac].puntos;

                            if (key2 === this.state.factores[keyfac].key)
                                factorObjetivo = this.state.factores[keyfac].puntos;
                            return this.state.factores[keyfac];
                        });

                    }

                    if (this.props.listaObjetivo.tareas) {

                        resultado = avanceOKR(cconsulta[key2], key2, this.props.listaObjetivo.tareas);
                        // console.log(resultado);
                        /*     if (resultado === 100 && !cconsulta[key2].estadoTIM && this.props.estadochat !== 'TIM objetivo') {
                                 this.props.estadochats('TIM objetivo');
                                 this.props.objTIMs({ obj: cconsulta[key2], key: key2 });
                                 this.TIMOBJ();
                             }
                      */
                        if (resultado < 100)
                            flagObjetivosTerminados = false;
                        else if (resultado >= 100) {
                            flagObjetivosTerminados = true;

                        }
                    }


                    //Impacto de las activiadades
                    let iconoImpacto;
                    let colorImpacto;


                    if (cconsulta[key2].impacto === "1") { iconoImpacto = "money bill alternate"; colorImpacto = "green"; }
                    else if (cconsulta[key2].impacto === "2") { iconoImpacto = "cogs"; colorImpacto = "blue"; }
                    else if (cconsulta[key2].impacto === "4") { iconoImpacto = "boxes"; colorImpacto = "purple"; }
                    else if (cconsulta[key2].impacto === "3") { iconoImpacto = "hospital outline"; colorImpacto = "yellow"; }

                    //Flujo de trabajo
                    let avancePadre = null;

                    //grafica el avance del objetivo compartido
                    const tAvanceTitulo = Math.round((cconsulta[key2].concepto.length + 9) / 40);
                    let imageComp = null;
                    let objPrincipal = cconsulta[key2];
                    let topkeyResult = '-4em';
                    let topkeyResult2 = '-5.5em';
                    let topObjKey = '0em';
                    if (objPrincipal.tipologia === '3') {
                        imageComp =
                            <div style={{
                                transform: 'scale(0.35)',
                                position: 'relative',
                                top: '3.1em',
                                left: '-21%',
                                filter: 'opacity(0.4)',
                                height: '0.2em'
                            }}>
                                <ImagenObj imageXV={this.state.images[y] ? this.state.images[y].urls.thumb : ''} />
                            </div>;

                        avancePadre =
                            <div style={{ left: '5em', position: 'absolute', top: '-6.2em', transform: 'scale(0.7)' }}>
                                <h5 style={{ top: '-1.5em', left: '-4em', position: 'relative' }}>Avance del equipo:</h5>
                                <Progress percent={objPrincipal.avancePadre >= 100 ? 100 : objPrincipal.avancePadre === 0 ? 15 : objPrincipal.avancePadre} inverted size='small' indicating progress
                                    style={{ top: '-2.5em', width: '100%', position: 'relative' }} />
                            </div>
                    }
                    else if (objPrincipal.tipologia === '2') {

                        if (this.state.resultRoot && this.state.resultCurrent !== this.state.resultRoot)
                            objPrincipal = this.state.resultRoot;
                        else
                            objPrincipal = this.state.objStateObj ? this.state.objStateObj : objPrincipal;
                        let imgyAux = this.state.objStateObj === objPrincipal ? y - 1 : y;
                        imageComp =
                            <div style={{
                                transform: 'scale(0.7)',
                                position: 'relative',
                                top: '4em',
                                filter: 'opacity(0.4)',
                                height: '1em'
                            }} onClick={() => { this.changeObj(objPrincipal) }}>
                                <ImagenObj imageXV={this.state.images[imgyAux] ? this.state.images[imgyAux].urls.thumb : ''} />
                            </div>;
                        topkeyResult = '-3.5em';
                        topkeyResult2 = '-5em';
                        topObjKey = '-3.3em';
                    }

                    let imgy = this.state.objStateObj === objPrincipal ? y : y - 1;
                    let kresultx = null;
                    let visiKresult = 'visible';
                    if (this.state.objSelResul === key2) {
                        visiKresult = 'hidden';
                        kresultx = <div>
                            <h5 style={{ top: topkeyResult, position: 'relative', left: '15%' }}> ○ {objPrincipal.keyResult1}</h5>
                            <h5 style={{ top: topkeyResult2, position: 'relative', left: '15%' }}> ○ {objPrincipal.keyResult2}</h5>
                        </div>
                    }
                    let fontS = objPrincipal.concepto.length <= 20 ? 25 : 25 - (Math.round((objPrincipal.concepto.length - 20) / 3));

                    if (objPrincipal.concepto) {
                        if (this.selectCurrent === null || key2 === this.props.actividadPrin) {
                            this.selectCurrent = this.props.actividadPrin;
                            return this.renderObjetivoPrincipalApp(objPrincipal, imgy, iconoImpacto, colorImpacto, key2, visiKresult, resultado, avancePadre);
                        }
                    }
                    if (flagObjetivosTerminados === true)
                        this.props.popupBot({ mensaje: 'hemos terminado el objetivo  ' + objPrincipal.concepto, sleep: 35000 });
                }


                return null;

            });

            return opciones;

        }


        return (
            <div style={{ height: '20em' }}></div>
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