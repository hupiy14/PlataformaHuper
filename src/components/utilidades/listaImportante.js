import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { chatOn, chatOff } from '../../actions';
import { Button, Popup, Grid, Input, Header, Modal, Image, Form, Progress, Segment, Label, Divider, Icon, Card } from 'semantic-ui-react';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, pasoOnboardings, selObjetivos, estadochats, objTIMs } from '../modules/chatBot/actions';
import unsplash from '../../apis/unsplash';



var fs = require('fs');

const timeoutLength = 150000;
const timeoutLength2 = 1000;
const timeoutLength3 = 60000;

class listImportante extends React.Component {
    state = {
        images: [], buscar: ['company', 'business', 'worker', 'formal',], ver: false, objetivoS: {}, detalleO: null, prioridadOk: true, guardar: false, cambio: 0, percent: 15, factor: 10, ntareas: 1,
        consultaTareas: {}, titulo: null, selectedFile: null, loaded: 0, WorkFlow: null, files: null, keyF: null,
        prioridadx: [{ prio: 'inmediato', color: 'red' }, { prio: 'urgente', color: 'yellow' }, { prio: 'normal', color: 'olive' }], activiadesObj: null, comentariosObj: null, adjuntosObj: null,

        factores: null, UtilFactors: null,
        modalOpen: false, comentario: null, modalOpen2: null,
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
                        if (snapshot.val()) {
                            const resultado2 = { ...ObjTrabajo[key2], avancePadre: snapshot.val().avance }
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

        const starCountRef33 = firebase.database().ref().child(`Utilidades-Valoraciones`);
        starCountRef33.on('value', (snapshot) => {
            this.setState({ UtilFactors: snapshot.val() });
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



    calculoDeAvance() {
        const objs = this.props.listaObjetivo.objetivos;
        let factorEqHup = [];
        //Encontrar factor
        this.setState({ ObjsFactors: [] });
        if (objs)
            Object.keys(objs).map((key, index) => {

                if (!objs[key] || !objs[key].concepto)
                    return;

                let facPrioridad = 1;
                let facDificultad = 1;
                let facRepeticiones = 1;
                let facTipo = 1;
                let facCompartido = objs[key].compartidoEquipo ? objs[key].porcentajeResp * 0.01 : 1;
                let facCalidad = 1;
                let facValidacion = 1;
                let facProductividad = 1;
                let nTareasFinalizados = 0;
                let nTareas = 0;

                //Object.keys(this.state.UtilFactors.Calidad).map((key2, index) =>{});
                Object.keys(this.state.UtilFactors.Dificultad).map((key2, index) => {
                    if (objs[key].dificultad === this.state.UtilFactors.Dificultad[key2].concepto)
                        facDificultad = this.state.UtilFactors.Dificultad[key2].valor;
                });
                Object.keys(this.state.UtilFactors.Prioridad).map((key2, index) => {
                    if (objs[key].prioridad === key2)
                        facPrioridad = this.state.UtilFactors.Prioridad[key2];
                });
                Object.keys(this.state.UtilFactors.Tipo).map((key2, index) => {
                    if (objs[key].tipo === this.state.UtilFactors.Tipo[key2].concepto)
                        facTipo = this.state.UtilFactors.Tipo[key2].valor;
                });
                Object.keys(this.state.UtilFactors.ValidacionGestor).map((key2, index) => {
                    if (objs[key].estado === this.state.UtilFactors.ValidacionGestor[key2].concepto)
                        facValidacion = this.state.UtilFactors.ValidacionGestor[key2].valor;
                });
                //algoritmo de medicion del trabajo
                const puntos = ((1 + facPrioridad + facTipo) * facRepeticiones * facDificultad) * facCompartido * facCalidad * facValidacion * facProductividad;
                factorEqHup.push({ key, puntos, usuario: objs[key].idUsuario })

            });

        this.setState({ factores: factorEqHup })
    }



    guardarDetalle() {

        if (this.state.comentario) {
            const usuario = this.props.nombreUser;
            const newPostKey2 = firebase.database().ref().child(`Usuario-Objetivos/${this.props.userId}/${this.state.keyF}`).push().key;
            firebase.database().ref(`Usuario-Objetivos/${this.props.userId}/${this.state.keyF}/comentarios/${newPostKey2}`).set({
                usuario,
                tipo: 'responder',
                concepto: this.state.comentario
            });
            this.setState({ comentario: null });
            return;
        }

        const tarea = { ...this.state.objetivoS, detalle: this.state.detalleO ? this.state.detalleO : null, prioridad: this.state.prioridadx[this.props.prioridadObj].prio };
        firebase.database().ref(`Usuario-Objetivos/${this.props.userId}/${this.state.keyF}`).set({
            ...tarea
        });


        this.setState({ detalleO: '' });  // this.setState({ prioridadO: true });
    }

    onVideoSelect(objetivo, key) {
        if (this.state.objetivoS) {
            this.setState({ objetivoS: objetivo });
            this.setState({ keyF: key });
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
            this.calculoDeAvance();
            this.setState({ ver: false });
        }, timeoutLength2)
    }
    TIMOBJ = () => {
        this.timeout = setTimeout(() => {
            this.props.chatOn();

        }, timeoutLength3)
    }

    componentDidUpdate() {
        if (this.state.guardar) {
            this.setState({ guardar: false });
            this.guardarDetalle(this);
        }

    }

    renderEliminarArchivo(idArchivo) {
        //   console.log(idArchivo);

        window.gapi.client.drive.files.delete({
            'fileId': idArchivo
            //  "supportsTeamDrives": false
        })
            .then((response) => {
                // Handle the results here (response.result has the parsed body).
                // console.log("Response", response);
                this.setState({ modalOpen2: false });
            },
                function (err) { console.error("Execute error", err); });


        const objetivo = { ...this.state.objetivoS, numeroAdjuntos: this.state.objetivoS.numeroAdjuntos - 1 };
        let updates = {};
        updates[`Usuario-Objetivos/${this.props.userId}/${this.state.keyF}`] = objetivo;
        firebase.database().ref().update(updates);
    }


    renderAdjuntos() {

        const carpeta = this.state.objetivoS.carpeta;
        window.gapi.client.drive.files.list({
            // 'corpus': 'domain',
            'q': `'${carpeta}' in parents`,
            'pageSize': 10,
            'fields': "nextPageToken, files(id, name, mimeType)"
        }).then((response) => {

            var files = response.result.files;
            let imprimir = [];
            if (files && files.length > 0) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    //        console.log(file);
                    const filesID = file.id;
                    imprimir.push(<div key={i} ><p> <i key={i} className="share icon" /> "  {file.name} "  <a onClick={() => { this.renderEliminarArchivo(`${filesID}`) }} className="ui  tiny green tag label">Eliminar</a>  </p><br /></div>);
                    //  console.log(imprimir);
                }

            } else {
                console.log('No files found.');
            }
            //         console.log(imprimir);
            this.setState({ files: imprimir });

            const objetivo = { ...this.state.objetivoS, numeroAdjuntos: files.length };
            let updates = {};
            updates[`Usuario-Objetivos/${this.props.userId}/${this.state.keyF}`] = objetivo;
            firebase.database().ref().update(updates);

        });
    }
    //Consultar espacio de trabajo
    renderConsultarEW() {
        if (this.state.objetivoS.carpeta)
            window.open(`https://drive.google.com/drive/folders/${this.state.objetivoS.carpeta}`);
    }

    handleOpen = () => {
        this.setState({ modalOpen: true });
    }

    handleOpen2 = () => {
        this.setState({ modalOpen2: true });
    }

    renderTareas() {
        let x = 0;
        if (!this.props.listaObjetivo || !this.props.listaObjetivo.tareas)
            return;

        const ttareas = this.props.listaObjetivo.tareas;
        const opciones = Object.keys(ttareas).map((key, index) => {
            const tareas = ttareas[key];
            const opciones2 = Object.keys(tareas).map((key3, index) => {
                //    console.log(tareas[key3]);

                if (this.state.keyF !== key)
                    return;
                let color = 'violet';
                if (tareas[key3].estado === 'finalizado')
                    color = 'purple'
                else if (tareas[key3].estado === 'anulado')
                    color = '#fbfbfb'
                x++;
                const className = `ui ${color} ribbon  label`;
                return (
                    <div key={key3}>

                        <div className={className} key={key3}>

                            <i className="address book large outline icon"> </i> Tarea numero  {x} :
                        <h5>"{tareas[key3].concepto} "</h5>
                            <p>Tiempo estimado :    {tareas[key3].tiempoEstimado}
                                Tiempo real :    {tareas[key3].tiempoReal} </p>
                        </div>

                        <br></br>
                        <br></br>
                    </div>

                );
                //}
            });
            return opciones2;
        });
        //    console.log(opciones);

        return opciones;

    }

    renderComentarios() {

        if (this.state.objetivoS && this.state.objetivoS.comentarios) {
            let numero = 0;
            const opciones = Object.keys(this.state.objetivoS.comentarios).map((key3, index) => {
                //    console.log(tareas[key3]);
                numero = numero + 1;
                let color = 'olive';
                if (this.state.objetivoS.comentarios[key3].tipo === 'feedback')
                    color = 'green'

                const className = `ui ${color} ribbon  label`;
                return (
                    <div key={key3}>

                        <div className={className} key={key3}>

                            <i className="quote left icon"> </i>  {this.state.objetivoS.comentarios[key3].usuario} :
                            <Card color={color}
                                description={this.state.objetivoS.comentarios[key3].concepto}
                            />

                        </div>

                        <br></br>
                        <br></br>
                    </div>

                );

                //}
            });
            const objetivo = { ...this.state.objetivoS, numeroComentarios: numero };
            let updates = {};
            updates[`Usuario-Objetivos/${this.props.userId}/${this.state.keyF}`] = objetivo;
            firebase.database().ref().update(updates);
            return opciones;
        }

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
                const objetivo = cconsulta[key2];
                const factorObjetivo = cconsulta[key2].numeroTareas;
                let factor = {};
                //  const detalleOO =  cconsulta[key2].estado ? cconsulta[key2].estado : '';
                let tareasCompleta = 0;
                let resultado = 0;

                let backgroundTar = ' linear-gradient(to top, rgb(255, 255, 255) 70%, rgb(250, 144, 4) 100%)';
                //the.setState( { listAll : this.state.listAll + 1 });
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

                        });

                    }


                    if (this.props.listaObjetivo.tareas) {
                        Object.keys(this.props.listaObjetivo.tareas).map((key3, index) => {

                            const consultaTareaTT = this.props.listaObjetivo.tareas[key3];
                            Object.keys(consultaTareaTT).map((key33, index) => {
                                if (key3 === key2) {
                                    if (consultaTareaTT[key33].estado === 'finalizado') {
                                        tareasCompleta = tareasCompleta + 1;
                                    }
                                }
                            });

                            const horasAtrabajar = 40;
                            const horasObj = horasAtrabajar * (factorObjetivo / factorSemana);
                            const atrabajo = Math.round(horasObj) / 3;
                            const atrabajo2 = ((Math.round(horasObj) * 0.35) / 2) + 1;
                            let resul = 15;


                            if (atrabajo < tareasCompleta) {
                                const ob = (tareasCompleta - atrabajo) / atrabajo2 > 1 ? 1 : (tareasCompleta - atrabajo) / atrabajo2;
                                resul = 65 + Math.round(ob * 35);
                            }

                            else
                                resul = Math.round((tareasCompleta / atrabajo) * 65);

                            factor = { factor: factorObjetivo, numero: tareasCompleta };
                            resultado = cconsulta[key2].avance ? resultado : resul;

                            // console.log(resultado);
                            if (resultado === 100 && !cconsulta[key2].estadoTIM && this.props.estadochat !== 'TIM objetivo') {
                                this.props.estadochats('TIM objetivo');
                                this.props.objTIMs({ obj: cconsulta[key2], key: key2 });
                                this.TIMOBJ();
                            }



                        });
                        if (resultado < 100)
                            flagObjetivosTerminados = false;
                        else if (resultado >= 100) {
                            backgroundTar = null;
                            flagObjetivosTerminados = true;

                        }
                    }
                    //color de la seleccion      
                    let style = {
                        borderRadius: '250px 300px 300px 900px',
                        height: '160px',
                        position: 'relative',
                        left: '30px',
                        top: '-170px',
                        width: '95%',
                        'box-shadow': this.props.selObjetivo === key2 ? 'rgba(23, 22, 20, 0.58) 1.5px 1.5px 5px 1.5px' : '#fbbd0894 0.5px 0.5px 5px 0.5px',
                        background: this.props.selObjetivo === key2 ? 'linear-gradient(to right, rgb(255, 255, 255) 85%, rgb(240, 166, 253) 110%)' : backgroundTar,
                    };


                    //objetivo pasado
                    if (objetivo.fechafin) {

                        const fec = new Date(objetivo.fechafin);

                        if (fec < new Date()) {
                            style = {
                                background: this.props.selObjetivo === key2 ? 'linear-gradient(to right, rgb(255, 255, 255) 85%, rgb(240, 166, 253) 110%)' : 'linear-gradient(to top, rgb(255, 255, 255) 70%, rgb(250, 80, 0) 100%)',
                                borderRadius: '250px 300px 300px 900px',
                                height: '160px',
                                position: 'relative',
                                left: '30px',
                                top: '-170px',
                                width: '95%',
                                'box-shadow': this.props.selObjetivo === key2 ? 'rgba(23, 22, 20, 0.58) 1.5px 1.5px 5px 1.5px' : '#fbbd0894 0.5px 0.5px 5px 0.5px',

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
                        position: 'absolute',
                        left: '90%',
                        top: '28%'
                    };



                    //Impacto de las activiadades
                    let iconoImpacto;
                    let colorImpacto;
                    if (cconsulta[key2].impacto === "Negocío") { iconoImpacto = "money bill alternate"; colorImpacto = "green"; }
                    else if (cconsulta[key2].impacto === "Proceso") { iconoImpacto = "cogs"; colorImpacto = "blue"; }
                    else if (cconsulta[key2].impacto === "Organización") { iconoImpacto = "boxes"; colorImpacto = "purple"; }
                    else if (cconsulta[key2].impacto === "Ventas") { iconoImpacto = "hospital outline"; colorImpacto = "yellow"; }

                    //Flujo de trabajo
                    let listaX = this.state.WorkFlow;
                    let colorFase = null;
                    let labelFase = null;
                    let numFase = null;
                    let flujoActivo = null;
                    let iconoObjetivo = this.props.icono;
                    let avancePadre = null;

                    //grafica el avance del objetivo compartido




                    if (cconsulta[key2].tipo === "Es parte de mi flujo de trabajo") {
                        iconoObjetivo = "th";
                        numFase = cconsulta[key2].fase;
                        colorFase = "rgba(212, 179, 20, 0.42)";
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




                            flujoActivo = <Label as='a' style={{ background: colorFase, 'z-index': '100', position: 'relative', 'top': '-320px', 'border': '0.5px solid', 'left': '28%', border: '2px #f39010' }} ribbon="right">
                                {labelFase ? labelFase : '<"Por definir">'}
                            </Label>



                        }


                    }
                    const tAvanceTitulo = Math.round((cconsulta[key2].concepto.length + 9) / 40);

                    if (cconsulta[key2].compartidoEquipo) {
                        iconoObjetivo = "users";
                        const topLabel = 10 - ((Math.round((cconsulta[key2].detalle ? cconsulta[key2].detalle.length : 0 + 18) / 32) + tAvanceTitulo) * 9);
                        const topProgress = -10 - ((Math.round((cconsulta[key2].detalle ? cconsulta[key2].detalle.length : 0 + 18) / 32) + tAvanceTitulo) * 10);
                        avancePadre =

                            <div style={{ left: '28%', position: 'relative' }}>
                                <h6 style={{ top: topLabel, position: 'relative' }}>Avance del equipo:</h6>
                                <Progress percent={cconsulta[key2].avancePadre >= 100 ? 100 : cconsulta[key2].avancePadre === 0 ? 15 : cconsulta[key2].avancePadre} inverted size='small' indicating progress
                                    style={{ top: topProgress, width: '58%', position: 'relative' }} />
                            </div>

                    }


                    const topAvance = 92 - ((Math.round((cconsulta[key2].detalle ? cconsulta[key2].detalle.length : 0 + 9) / 40) + tAvanceTitulo) * 15);

                    if (!cconsulta[key2].avanceObjetivo || resultado !== cconsulta[key2].avanceObjetivo)
                        firebase.database().ref(`Usuario-Objetivos/${this.props.userId}/${key2}`).set({
                            ...cconsulta[key2], avanceObjetivo: resultado ? resultado : 0
                        });

                    return (


                        <div className="item segment" key={key2} style={{ height: '15em' }} >
                            <div  >
                                <img src={this.state.images[y - 1] ? this.state.images[y - 1].urls.regular : ''} style={{
                                    height: '120px', with: '100px', top: '50px',
                                    'border-radius': '55px 15px 55px 8px',
                                    'position': 'relative', 'box-shadow': 'rgba(251, 189, 8, 0.51) 2px 2px 5px 1px', 'z-index': '100',

                                }} />
                            </div>

                            <Modal trigger={



                                <Popup
                                    trigger={<button className="ui button search plus icon " style={{
                                        color: '#080807',
                                        background: 'linear-gradient(to right, rgba(255, 255, 255, 0.63) 35%, rgba(243, 234, 221, 0) 110%)', transform: 'scale(1.2)',
                                        'border-radius': '10px',
                                        left: '90%', 'z-index': '100'
                                    }} onClick={() => {
                                        this.handleOpen2();
                                        this.onVideoSelect(cconsulta[key2], key2);
                                        this.setState({ objetivoS: cconsulta[key2] })
                                        this.setState({ titulo: cconsulta[key2].concepto });
                                        this.setState({ activiadesObj: this.renderTareas() })
                                        this.setState({ comentariosObj: this.renderComentarios() })
                                        this.setState({ adjuntosObj: this.renderAdjuntos() })
                                    }}>
                                        <i className="search plus icon " > </i>
                                    </button>}
                                    content='Conoce tu objetivo'
                                    on='hover'
                                />

                            }
                                open={this.state.modalOpen2}
                                basic
                                size='small'

                            >
                                <Modal.Header>Detalle del Objetivo " {this.state.titulo} "</Modal.Header>
                                <Modal.Content image scrolling>
                                    <div className="ui form">
                                        <div className="ui grid">
                                            <div className="five wide column">
                                                <Image size='medium' src={images[1] ? images[this.state.cambio].urls.regular : ''} wrapped />
                                            </div>
                                            <div className="eleven wide column">
                                                <Modal.Description >
                                                    <Header>{this.state.titulo}</Header>
                                                    <h2>{this.state.titulo}</h2>
                                                    <p> <i className="share icon" />Detalle del objetivo:  " <a> {this.state.objetivoS.detalle}</a>  "</p>
                                                    <p> <i className="share icon" />Prioridad:  " <a>   {this.state.objetivoS.prioridad} </a> "</p>
                                                    <p> <i className="share icon" />Estado :  " <a>  {this.state.objetivoS.estado}</a>  "</p>
                                                    <p> <i className="share icon" />Fecha de finalizado el objetivo:  " <a>  {this.state.objetivoS.fechafin} </a>  "</p>
                                                    <p> <i className="share icon" />Numero de conmentarios :   " <a>  {this.state.objetivoS.numeroComentarios}</a>  "</p>
                                                    <p> <i className="share icon" />Numero de tareas hechas:  " <a>  {this.state.objetivoS.numeroTareas} </a>  "</p>
                                                    <p> <i className="share icon" />Numero de archivos adjuntos: " <a>  {this.state.objetivoS.numeroAdjuntos}</a>  "</p>
                                                    <br />
                                                    <h3>Comentarios:</h3>
                                                    {this.state.comentariosObj}
                                                    <h3>Tareas Realizadas:</h3>
                                                    {this.state.activiadesObj}
                                                    <h3>Archivos Adjuntos:</h3>
                                                    {this.state.files ? this.state.files : this.state.adjuntosObj}

                                                </Modal.Description>
                                            </div>
                                        </div>




                                    </div>
                                </Modal.Content>

                                <Modal.Actions>

                                    <Button color='red' onClick={() => { this.setState({ modalOpen2: false }) }} inverted>
                                        <Icon name='close' /> Atras
                                           </Button>

                                </Modal.Actions>
                            </Modal>


                            <i className={`large ${iconoObjetivo} aligned icon`} style={{
                                color: '#ffcd32', position: 'relative', top: '-15px', transform: 'scale(0.8)',
                                left: '1%', 'z-index': '100'
                            }} ></i>
                            <div className=" content"   ></div>


                            <Segment style={style} onClick={() => { this.props.selObjetivo === key2 ? this.props.selObjetivos(null) : this.props.selObjetivos(key2); }} >
                                <div className="header" style={{ left: '28%', width: '40%', 'font-size': 'unset', position: 'relative' }}  >{cconsulta[key2].concepto}</div>
                                <div className="description" id="desOb" style={{
                                    width: '60%',
                                    top: '10px',
                                    left: '28%',
                                    'font-size': 'smaller',
                                    position: 'relative'
                                }}  >{cconsulta[key2].detalle ? cconsulta[key2].detalle : ''}</div>


                                <div style={{ color: cconsulta[key2].prioridad === 'normal' ? '#12c3c3' : cconsulta[key2].prioridad === 'inmediato' ? 'purple' : '#dc6117', left: '87%', position: 'absolute', top: '10%', 'font-weight': 'bolder' }}>
                                    {cconsulta[key2].prioridad}
                                </div>



                                <div style={{ color: colorImpacto, left: '67%', position: 'absolute', transform: 'scale(0.9)', top: '10%' }}>
                                    {cconsulta[key2].impacto}
                                    <Icon name={iconoImpacto} style={{ left: '10px', position: 'relative' }} />
                                </div>

                                <br />
                                <div style={styleD}>

                                    <Modal
                                        trigger={

                                            <Popup
                                                trigger={<Button style={{
                                                    background: 'linear-gradient(to right, rgba(255, 255, 255, 0.63) 35%, rgba(243, 234, 221, 0) 110%)', transform: 'scale(1.2)',
                                                    'border-radius': '10px',
                                                    color: '#080807',
                                                }} icon='edit outline'
                                                    onClick={() => {

                                                        if (!this.props.usuarioDetail.usuario.onboarding)
                                                            this.handlePaso();

                                                        this.setState({ cambio: Math.round(Math.random() * 6) });
                                                        //this.onVideoSelect(objetivo, key2);
                                                        this.setState({ ver: !this.state.ver });
                                                        this.setState({ titulo: cconsulta[key2].concepto });
                                                        this.setState({ detalleO: cconsulta[key2].detalle });
                                                        this.setState({ objetivoS: cconsulta[key2] });
                                                        this.setState({ keyF: key2 });


                                                        Object.keys(this.state.prioridadx).map((key, index) => {
                                                            if (objetivo.prioridad === this.state.prioridadx[key].prio)
                                                                this.props.prioridadObjs(key);
                                                        });

                                                    }}
                                                />}
                                                content='Edita tu objetivo'
                                                on='hover'
                                            />

                                        }
                                        open={this.state.ver}

                                    >

                                        <Modal.Header>Detalle de objetivo: " {this.state.titulo} "</Modal.Header>
                                        <Modal.Content image scrolling>
                                            <div className="ui form">
                                                <div className="ui grid">
                                                    <div className="eight wide column">
                                                        <Image wrapped size='medium' style={{ width: '30em', position: 'relative', height: '25em' }} src={images[1] ? images[this.state.cambio].urls.regular : ''} />
                                                    </div>
                                                    <div className="eight wide column">
                                                        <Modal.Description>
                                                            <Header>Instrucciones</Header>
                                                            <p>Podrás cambiar fácilmente alguna caracterisitica o adjuntar archivo al objetivo.</p>


                                                            <Header as='h5'>Describe el detalle :</Header>
                                                            <Input fluid value={this.state.detalleO}
                                                                key={key2}
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


                                                            <Modal
                                                                trigger={
                                                                    <button className="ui basic  yellow button  comment alternate outline icon" circular
                                                                        style={{ transform: 'scale(1.2)', top: '13px', 'border-radius': '30px', position: 'fixed', left: '93%' }}
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

                                                            <br></br>

                                                            <br></br>


                                                            < Button className="ui basic purple button" content="Consultar espacio de trabajo" icon='google drive' fluid
                                                                onClick={() => { this.renderConsultarEW(cconsulta[key2].carpeta) }}
                                                            >
                                                            </Button>


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
                                                            this.setState({ ver: !this.state.ver });
                                                        }} > Cancelar</button>

                                                </div>
                                                <div className="column">


                                                    < Button color='purple' content="Guardar" icon='save' fluid
                                                        onClick={() => {
                                                            this.setState({ ver: !this.state.ver });
                                                            this.guardarDetalle(this);
                                                        }}
                                                    >
                                                    </Button>

                                                </div>
                                            </div>


                                        </Modal.Actions>


                                    </Modal>





















                                </div>
                                <div style={{ position: 'relative', top: topAvance, left: '28%' }}>
                                    <Progress percent={resultado >= 100 ? 100 : resultado === 0 ? 15 : resultado} inverted size='small' indicating progress style={{ width: '62%' }} />
                                </div>


                                {avancePadre}

                            </Segment>
                            {flujoActivo}

                        </div>


                    );
                }
            });
            if (flagObjetivosTerminados === true)
                this.props.estadochats('Objetivos Terminados');
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
                        {this.renderConstruirObj(this.state.images)}
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
        nombreUser: state.chatReducer.nombreUser,
        estadochat: state.chatReducer.estadochat,
        userId: state.auth.userId,

    });


export default connect(mapAppStateToProps, { listaObjetivos, estadochats, prioridadObjs, popupDetalles, numeroTareasTs, pasoOnboardings, selObjetivos, chatOn, chatOff, objTIMs })(listImportante);