import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Button, Popup, Grid, Input, Header, Modal, Image, Message, Form, Progress, Segment } from 'semantic-ui-react';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, equipoConsultas } from '../modules/chatBot/actions';
import unsplash from '../../apis/unsplash';
import MaskedInput from 'react-text-mask';



class ListaObjetivosEquipo extends React.Component {

    state = {
        images: [], buscar: ['company', 'business', 'worker', 'formal',], ver: false, detalleO: null, prioridadOk: true, guardar: false, cambio: 0, percent: 15, factor: 10, ntareas: 1,
        consultaTareas: {}, titulo: null, selectedFile: null, loaded: 0, iconoG: 'assistive listening systems icon', colorIconnoG: 'teal', usuarioG: 0, porInputs: [], inP: null, error: false,
        mensajeCodigo: null,
        prioridadx: [{ prio: 'inmediato', color: 'red' }, { prio: 'urgente', color: 'yellow' }, { prio: 'normal', color: 'olive' }]
    };




    componentDidMount() {
        this.onSearchSubmit();
        // console.log(this.example2);
        // this.renderObtenerInformacionEquipo();
    }


    //vairble x aumento n cantidad terminada n*x
    //fotos de la tarjetas
    onSearchSubmit = async () => {
        const response = await unsplash.get('/search/photos', {
            params: { query: this.state.buscar[this.props.prioridadObj] },

        });
        this.setState({ images: response.data.results })
        // console.log(this.state.images);
    }



    guardarDetalle(key, estado) {
        if (key === 0) return;
        var updates = {};

        const cconsulta = this.props.equipoConsulta;
        updates = {};
        let det = '';
        if (this.state.detalleO && this.state.detalleO.detalle && this.state.detalleO.detalle !== '')
            det = this.state.detalleO.detalle

        let max = 0;
        if (this.state.porInputs) {
            Object.keys(this.state.porInputs).map((key, index) => {
                max = max + this.state.porInputs[key].por;

                Object.keys(cconsulta).map((key3, index) => {
                    if (this.state.porInputs[key].key === key3) {
                        const data = { ...cconsulta[key3], porcentajeResp: this.state.porInputs[key].por }
                       firebase.database().ref(`Usuario-Objetivos/${this.state.porInputs[key].idUsuario}/${this.state.porInputs[key].key}`).set({
                            ...data
                        });
                    }
                });
            });
        }

        if (max > 100 && this.state.detalleO.detalleO.personasInvolucradas) {
            this.setState({ mensajeCodigo: { titulo: 'Error la distribución del objetivo', detalle: 'La suma parcial de cada persona del equipo, supera el 100% del objetivo' } })
            this.setState({ error: true })
            return;
        }
        else if (max < 100 && this.state.detalleO.personasInvolucradas) {
            this.setState({ mensajeCodigo: { titulo: 'Error la distribución del objetivo', detalle: 'La suma parcial de cada persona del equipo, no suma el 100% del objetivo' } })
            this.setState({ error: true })
            return;
        }

        let tarea = {
            ...this.state.detalleO, detalle: det, personasInvolucradas: this.state.porInputs ? this.state.porInputs : null
        };

        const x = this.props.prioridadObj + 1 > 2 ? 0 : this.props.prioridadObj + 1;
        tarea.prioridad = this.state.prioridadx[x].prio;

        if (estado)
            tarea.estado = 'activo';
        updates[`Usuario-Objetivos/${key}/${this.state.detalleO.idObjetivo}`] = tarea;
        firebase.database().ref().update(updates);
        this.setState({ mensajeCodigo: null });
        this.setState({ error: null });
        this.setState({ ver: false });
        // this.setState({ detalleO: null });  // this.setState({ prioridadO: true });
    }

    handleUpload = () => {
        //data
        const data = new FormData()
        data.append('file', this.state.selectedFile, this.state.selectedFile.name)
        //  console.log(this.state.selectedFile);

    }

    handleselectedFile = event => {
        /// carga el objeto
        //  console.log(event.target.files[0]);
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        })
    }




    //Consultar espacio de trabajo
    renderConsultarEW() {
        if (this.state.detalleO.carpeta)
            window.open(`https://drive.google.com/drive/folders/${this.state.detalleO.carpeta}`);
    }


    eliminarObjetivo(key) {
        var updates = {};
        let idObjetivo;


        const cconsulta = this.props.equipoConsulta;
        Object.keys(cconsulta).map((key2, index) => {
            if (cconsulta[key2].estado === 'activo' || cconsulta[key2].estado === 'validar')
                if (cconsulta[key2].concepto === this.state.detalleO.concepto) {
                    idObjetivo = key2;
                    //  console.log(key2);
                }
        });


        const obj = this.props.equipoConsulta;
        Object.keys(obj).map((key2, index) => {

            if (key2 === idObjetivo) {
                obj[key2] = undefined;
                return;
            }

        });

        this.props.equipoConsultas(this.props.equipoConsulta);
        this.renderObtenerInformacionEquipo();

        firebase.database().ref(`Usuario-Objetivos/${key}/${idObjetivo}`).remove()
        firebase.database().ref(`Usuario-Tareas/${key}/${idObjetivo}`).remove()
    }

    renderInputsProcentaje(objetivo) {

        if (objetivo.personasInvolucradas && objetivo.gestor === true) {

            const per = objetivo.personasInvolucradas;
            let porcentaje = 0;
            let title = <h4>Equipo y porcentaje de reponsabilidad en el objetivo</h4>
            let inputsed = Object.keys(per).map((key, index) => {
                if (key > 0)
                    title = null;


                porcentaje = per[key].por ? per[key].por : !per[key].porcentaje ? Math.round(100 / objetivo.personasInvolucradas.length) : Math.round(per[key].porcentaje);
                let arr = this.state.porInputs;
                arr[key] = { por: porcentaje, nombre: per[key].nombre, key: per[key].key, idUsuario: per[key].idUsuario };
                this.setState({ porInputs: arr })


                return (
                    <div class="ui two column ">
                        <br></br>
                        {title}
                        <label>{!per[key].nombre ? per[key] : per[key].nombre}</label>
                        <MaskedInput mask={[/[0-9]/, /[0-9]/]}

                            value={this.state.porInputs ? this.state.porInputs[key].por ? this.state.porInputs[key].por : porcentaje : porcentaje}
                            style={{
                                width: '80px',
                                position: 'relative',
                                left: '10px',
                                height: '30px'
                            }}
                            onChange={(e) => {
                                let arr = this.state.porInputs;
                                arr[key] = { por: parseInt(e.target.value.replace(/_/g, '')), nombre: per[key].nombre, key: per[key].key, idUsuario: per[key].idUsuario };
                                this.setState({ porInputs: arr })
                            }}
                        />
                        <div class="ui teal horizontal label" style={{ 'font-size': 'initial' }} >%</div>
                    </div>
                )
            })

            this.setState({ inP: inputsed });
            return inputsed;
        }

        else if (objetivo.personasInvolucradas && !objetivo.gestor) {
            this.setState({
                inP:
                    <div>
                        <br></br>
                        <h3>Porcentaje del objetivo asignado: {objetivo.porcentajeResp} %</h3>
                    </div>
            });
        }

    }



    renderConstruirObj(images) {
        //  console.log(the.props.equipoConsulta);
        //    console.log(the.props.listaObjetivo);
        if (this.props.listaObjetivo && this.props.equipoConsulta) {

            const cconsulta = this.props.equipoConsulta;
            //console.log(the.props.equipoConsulta.sell);
            const opciones = Object.keys(cconsulta).map((key2, index) => {

                if (!cconsulta[key2])
                    return;
                //muestra los objetivos propios del gestor y compartidos
             
                if (cconsulta[key2].compartidoEquipo && (!this.props.equipoConsulta.sell || this.props.equipoConsulta.sell === 0)) {
                    return;
                }
                else if (cconsulta[key2].compartidoEquipo && !cconsulta[key2].idUsuarioGestor)
                    return;

                const objetivo = cconsulta[key2];
                const factorObjetivo = cconsulta[key2].numeroTareas;
                let factor = {};
                let tareasCompleta = 0;
                let resultado = cconsulta[key2].avance ? cconsulta[key2].avance : 0;
                let iconGetor = 'assistive listening systems';
                let boolGestor = false;
                const usuarioIF = cconsulta[key2].idUsuario;

                let iconoObjetivo = this.props.icono;
                if (cconsulta[key2].tipo === "Es parte de mi flujo de trabajo")
                    iconoObjetivo = "th";
                if (cconsulta[key2].compartidoEquipo)
                    iconoObjetivo = "users";



                if (cconsulta[key2].estado === 'activo' || cconsulta[key2].estado === 'validar') {
                    const listaEOB = this.props.listaObjetivo;
                    Object.keys(listaEOB).map((key4, index) => {
                        const listaEOBT = listaEOB[key4];
                        if (!listaEOBT) return;
                        //    console.log(listaEOBT)
                        Object.keys(listaEOBT).map((key3, index) => {

                            const consultaTareaTT = listaEOBT[key3];
                            //      console.log(consultaTareaTT)
                            if (!consultaTareaTT) return;
                            Object.keys(consultaTareaTT).map((key33, index) => {
                                if (key3 === key2) {
                                    if (consultaTareaTT[key33].estado === 'finalizado') {
                                        tareasCompleta = tareasCompleta + 1;
                                    }
                                }
                            });
                            // the.increment(factorObjetivo, numeroTareasTs);
                            factor = { factor: (100 / factorObjetivo), numero: tareasCompleta };
                            resultado = cconsulta[key2].avance ? resultado : Math.round(factor.factor * tareasCompleta);
                            // console.log(resultado);
                        });
                    });
                    if (cconsulta[key2].estado === 'activo') {
                        iconGetor = 'user times';
                        boolGestor = true;
                    }
                    if (this.props.equipoConsulta.sell && this.props.equipoConsulta.sell !== 0 && this.props.equipoConsulta.sell !== usuarioIF) {
                        return;
                    }
                    ///configuracion responsive
                    let cssBotonesEdicion = `right aling-Derecha`;
                    if (window.screen.width < 500) {
                        cssBotonesEdicion = `right aling-DerechaX2`;
                    }

                    let style = {
                        borderRadius: 0.5,
                    };
                    if (objetivo.fechafin) {
                        // console.log(objetivo.fechafin);
                        const fec = new Date(objetivo.fechafin);
                        if (fec < new Date()) {
                            style = {
                                borderRadius: 0.5,
                                background: '#f9e63340',
                            };
                        }
                    }

                    let style2 = {
                        borderRadius: 0.2,
                    };

                    if (window.screen.width < 500) {
                        style2 = {
                            overflow: 'auto',
                            height: '360px',
                        };

                    }
                    ///mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}

                    return (
                        <div className="item" key={key2}>
                            <i className={`large middle ${iconoObjetivo} aligned icon`} style={{ color: '#fbbd087d' }}  ></i>
                            <div className="content">
                                <Segment style={style}>

                                    <div className="header"  >{cconsulta[key2].concepto}</div>
                                    <div className="description"  >{cconsulta[key2].detalle ? cconsulta[key2].detalle : ''}</div>
                                    <br />
                                    <div className={cssBotonesEdicion}>

                                        <Popup trigger={<Button icon='id badge' color='yellow' onClick={() => {
                                            this.setState({ detalleO: { ...cconsulta[key2], idObjetivo: key2 } });
                                            //  the.props.prioridadObjs(0);
                                            this.setState({ prioridadOk: true });
                                        }}

                                        />} on='click' flowing hoverable>
                                            <Grid centered divided columns={1}>
                                                <Grid.Column textAlign='center'>
                                                    <Header as='h4'>Prioridad:</Header>
                                                    <p>
                                                        <div className={`ui green horizontal label`}>
                                                            {this.state.prioridadOk ? cconsulta[key2].prioridad : cconsulta[key2].prioridad === this.state.prioridadx[this.props.prioridadObj].prio ? cconsulta[key2].prioridad : this.state.prioridadx[this.props.prioridadObj].prio}</div>

                                                    </p>
                                                    <Button color='purple' key={key2} fluid
                                                        onClick={() => {
                                                            this.setState({ prioridadOk: false });

                                                            this.props.prioridadObjs(this.props.prioridadObj + 1 > 2 ? 0 : this.props.prioridadObj + 1);
                                                            this.guardarDetalle(this.state.detalleO.idUsuario, null);
                                                        }}
                                                    >Cambiar</Button>
                                                </Grid.Column>
                                            </Grid>
                                        </Popup>
                                        <Modal
                                            trigger={<Button color='purple' icon='edit outline'
                                                onClick={() => {
                                                    this.setState({ cambio: Math.round(Math.random() * 6) });
                                                    this.setState({ ver: !this.state.ver });
                                                    this.setState({ titulo: cconsulta[key2].concepto });
                                                    this.setState({ detalleO: { ...cconsulta[key2], detalle: cconsulta[key2].detalle, idObjetivo: key2 } });
                                                    this.setState({ inP: null });
                                                    this.renderInputsProcentaje(cconsulta[key2]);
                                                }}
                                            />}
                                            open={this.state.ver}

                                        >

                                            <Modal.Header>Detalle de objetivo: " {this.state.titulo} "</Modal.Header>
                                            <Modal.Content image scrolling >
                                                <div className="ui form">
                                                    <div className="ui grid">
                                                        <div className="eight wide column">
                                                            <Image wrapped size='medium' src={images[1] ? images[this.state.cambio].urls.regular : ''} />
                                                        </div>
                                                        <div className="eight wide column">
                                                            <Modal.Description>
                                                                <Form error={this.state.error}>
                                                                    <Header>Instrucciones</Header>
                                                                    <p>Podrás cambiar fácilmente el detalle o adjuntar archivo al objetivo.</p>

                                                                    <Header as='h5'>Describe el detalle :</Header>
                                                                    <Input fluid value={this.state.detalleO ? this.state.detalleO.detalle ? this.state.detalleO.detalle : '' : ''}
                                                                        placeholder='Detalla el objetivo a realizar...'
                                                                        onChange={e => this.setState({ detalleO: { ...this.state.detalleO, detalle: e.target.value } })}>
                                                                    </Input>
                                                                    {this.state.inP}

                                                                    <br></br>
                                                                    <button className="ui button green google drive icon  fluid" onClick={() => { this.renderConsultarEW(); }}>Consultar espacio de trabajo
                                                                <i className="google drive icon prueba-xx"> </i>
                                                                    </button>

                                                                    <Message
                                                                        error={this.state.error}
                                                                        style={{ visibility: this.state.error ? '' : 'hidden' }}
                                                                        header={this.state.mensajeCodigo ? this.state.mensajeCodigo.titulo : null}
                                                                        content={this.state.mensajeCodigo ? this.state.mensajeCodigo.detalle : null}
                                                                    />
                                                                </Form>
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
                                                        <button className='ui button purple fluid save icon'
                                                            key={key2}
                                                            onClick={() => {

                                                                this.guardarDetalle(this.state.detalleO.idUsuario, null);
                                                            }} >
                                                            Guardar
                                                            <i className='large middle  save aligned icon aling-Derecha2 '>
                                                            </i>
                                                        </button>

                                                    </div>
                                                </div>


                                            </Modal.Actions>


                                        </Modal>
                                        <Popup wide trigger={<Button icon={iconGetor} color='teal'
                                            onClick={() => {
                                                this.setState({ detalleO: { ...cconsulta[key2], idObjetivo: key2 } });
                                            }}


                                        />} on='click'>
                                            <Grid divided columns='equal'>
                                                <Grid.Column>
                                                    <Popup
                                                        trigger={<Button color='teal' disabled={boolGestor} content='De acuerdo' fluid
                                                            onClick={() => {
                                                                this.guardarDetalle(this.state.detalleO.idUsuario, true);
                                                            }}

                                                        />}
                                                        content='Estas de acuerdo con el objetivo planteado por tu colaborador'
                                                        position='top center'
                                                        size='tiny'

                                                        inverted
                                                    />
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Popup
                                                        /// x icon
                                                        trigger={<Button color='red' content='Eliminar' fluid
                                                            onClick={() => {
                                                                this.eliminarObjetivo(cconsulta[key2].idUsuario);
                                                            }}


                                                        />}
                                                        content='Quieres eliminar el objetivo acordado, recuerda se perdera todo.'
                                                        position='top center'
                                                        size='tiny'
                                                        inverted
                                                    />
                                                </Grid.Column>
                                            </Grid>
                                        </Popup>

                                    </div>
                                    <Progress percent={resultado >= 100 ? 100 : resultado === 0 ? 15 : resultado} inverted size='small' indicating progress style={{ top: '5px' }} />

                                </Segment>

                            </div>
                        </div >
                    );
                }
            });
            return opciones;

        }
        return (
            <div className="ui segment loaderOBJG">
                <div className="ui active dimmer loaderOBJG">

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
                <div className="maximo-listEObj">

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
        equipoConsulta: state.chatReducer.equipoConsulta,
        numeroTareasTerminadas: state.chatReducer.numeroTareasTerminadas,
        popupDetalle: state.chatReducer.popupDetalle,
        listaObjetivo: state.chatReducer.listaObjetivo,
        prioridadObj: state.chatReducer.prioridadObj,
        userId: state.auth.userId,

    });


export default connect(mapAppStateToProps, { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, equipoConsultas })(ListaObjetivosEquipo);



