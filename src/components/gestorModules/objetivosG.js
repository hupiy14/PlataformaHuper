import React from 'react';
import { connect } from 'react-redux';
import { Image, Progress, Segment } from 'semantic-ui-react';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, equipoConsultas, selObjetivos } from '../modules/chatBot/actions';
import unsplash from '../../apis/unsplash';
import MaskedInput from 'react-text-mask';
import { dataBaseManager } from '../../lib/utils';
import { popupBot } from '../../actions';
const timeoutLength = 1000;

class ListaObjetivosEquipo extends React.Component {

    state = {
        images: [], buscar: ['company', 'business', 'worker', 'formal',], ver: false, detalleO: null, prioridadOk: true, guardar: false, cambio: 0, percent: 15, factor: 10, ntareas: 1,
        consultaTareas: {}, titulo: null, selectedFile: null, loaded: 0, iconoG: 'assistive listening systems icon', colorIconnoG: 'teal', usuarioG: 0, porInputs: [], inP: null, error: false,
        mensajeCodigo: null, factores: null, est: null,
        prioridadx: [{ prio: 'inmediato', color: 'red' }, { prio: 'urgente', color: 'yellow' }, { prio: 'normal', color: 'olive' }],
        imageO: null,
    };


    componentDatabase(tipo, path, objectIn, mensaje, mensajeError) {
        let men = dataBaseManager(tipo, path, objectIn, mensaje, mensajeError);
        if (men && men.mensaje)
            this.props.popupBot({ mensaje: men.mensaje });
        return men;
    }

    componentDidMount() {
        this.onSearchSubmit();
        const starCountRef = this.componentDatabase('get', `Usuario-Flujo-Trabajo`);
        starCountRef.on('value', (snapshot) => {
            this.props.equipoConsultas({ ...this.props.equipoConsulta, flujo: snapshot.val() })
        });
    }


    handleSeleccionar = (key2, imagenT) => {
        this.timeout = setTimeout(() => {
            this.expandirObjetivo(key2, imagenT);
        }, timeoutLength)
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
                        this.componentDatabase('update', `Usuario-Objetivos/${this.state.porInputs[key].idUsuario}/${this.state.porInputs[key].key}`, { ...data });
                    }

                    return cconsulta[key3];
                });

                return this.state.porInputs[key];
            });
        }

        if (max > 100 && this.state.detalleO.personasInvolucradas) {
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
        this.componentDatabase('update', `Usuario-Objetivos/${key}/${this.state.detalleO.idObjetivo}`, tarea);
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

        let idObjetivo;
        const cconsulta = this.props.equipoConsulta;
        Object.keys(cconsulta).map((key2, index) => {
            if (cconsulta[key2].estado === 'activo' || cconsulta[key2].estado === 'validar')
                if (cconsulta[key2].concepto === this.state.detalleO.concepto) {
                    idObjetivo = key2;
                    //  console.log(key2);
                }
            return cconsulta[key2];
        });


        const obj = this.props.equipoConsulta;
        Object.keys(obj).map((key2, index) => {

            if (key2 === idObjetivo) {
                obj[key2] = undefined;
                return null;
            }
            return obj[key2];
        });

        this.props.equipoConsultas(this.props.equipoConsulta);
        this.renderObtenerInformacionEquipo();
        this.componentDatabase('delete', `Usuario-Objetivos/${key}/${idObjetivo}`);
        this.componentDatabase('delete', `Usuario-Tareas/${key}/${idObjetivo}`);
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

    componentDidUpdate() {
        if (!this.state.factores && this.props.equipoConsulta.factorProgreso) {
            this.setState({ factores: this.props.equipoConsulta.factorProgreso });
        }
    }
    expandirObjetivo(key2, imagenT) {
        if (this.props.equipoConsulta.sell === key2) {
            this.props.equipoConsultas({ ...this.props.equipoConsulta, sell: null, Isell: null });

        }
        else {
            this.props.equipoConsultas({ ...this.props.equipoConsulta, sell: key2, Isell: imagenT })
        }

    }

    renderConstruirObj(images) {
        //  console.log(the.props.equipoConsulta);
        //    console.log(the.props.listaObjetivo);

        let y = 0;
        let nObj = 0;
        if (this.props.listaObjetivo && this.props.equipoConsulta) {

            const cconsulta = this.props.equipoConsulta;
            //console.log(the.props.equipoConsulta.sell);
            const opciones = Object.keys(cconsulta).map((key2, index) => {

                if (!cconsulta[key2])
                    return null;
                //muestra los objetivos propios del gestor y compartidos
                if (cconsulta[key2].gestor) {
                    if (!cconsulta[key2].propio && !cconsulta[key2].compartidoEquipo)
                        return null;
                }
                else if (cconsulta[key2].compartidoEquipo && !cconsulta[key2].gestor)
                    return null;
                if (cconsulta[key2].compartidoEquipo && !cconsulta[key2].gestor && (!this.props.equipoConsulta.sell || this.props.equipoConsulta.sell === 0)) {
                    return null;
                }


                const objetivo = cconsulta[key2];
                let tareasCompleta = 0;
                let resultado = cconsulta[key2].avance ? cconsulta[key2].avance : 0;

                let iconoObjetivo = this.props.icono;
                if (cconsulta[key2].tipo === "Es parte de mi flujo de trabajo")
                    iconoObjetivo = "th";
                if (cconsulta[key2].compartidoEquipo)
                    iconoObjetivo = "users";



                if (cconsulta[key2].estado === 'activo' || cconsulta[key2].estado === 'validar') {
                    const listaEOB = this.props.listaObjetivo;

                    //factor de progreso por horas 
                    let factorSemana = 0;
                    let factorObjetivo = 0;
                    if (this.state.factores !== null)
                        Object.keys(this.state.factores).map((keyfac, index) => {
                            if (cconsulta[key2].idUsuario === this.state.factores[keyfac].usuario)
                                factorSemana = factorSemana + this.state.factores[keyfac].puntos;

                            if (key2 === this.state.factores[keyfac].key)
                                factorObjetivo = this.state.factores[keyfac].puntos;
                            return this.state.factores[keyfac];
                        });



                    Object.keys(listaEOB).map((key4, index) => {
                        const listaEOBT = listaEOB[key4];
                        if (!listaEOBT) return null;
                        //    console.log(listaEOBT)
                        Object.keys(listaEOBT).map((key3, index) => {

                            const consultaTareaTT = listaEOBT[key3];
                            //      console.log(consultaTareaTT)
                            if (!consultaTareaTT) return null;
                            Object.keys(consultaTareaTT).map((key33, index) => {
                                if (key3 === key2) {
                                    if (consultaTareaTT[key33].estado === 'finalizado') {
                                        tareasCompleta = tareasCompleta + 1;
                                    }
                                }
                                return consultaTareaTT[key33];
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

                            resultado = cconsulta[key2].avance ? resultado : resul;


                            return listaEOBT[key3];
                        });
                        return listaEOB[key4];
                    });

                    ///configuracion responsive
                    let style = {
                        borderRadius: '10px',
                        background: this.props.equipoConsulta.sell === key2 ? 'linear-gradient(to top, rgb(255, 255, 255) 35%, rgb(196, 24, 214) 120%)' : 'linear-gradient(to top, rgb(255, 255, 255) 70%, rgb(250, 144, 4) 180%)',
                        left: '25px',
                        height: '6em',
                        width: '234px',
                        top: '25px',
                        'box-shadow': this.props.equipoConsulta.sell === key2 ? 'rgba(23, 22, 20, 0.58) 1.5px 1.5px 5px 1.5px' : '#fbbd0894 0.5px 0.5px 5px 0.5px',
                    };
                    if (objetivo.fechafin) {
                        // console.log(objetivo.fechafin);
                        const fec = new Date(objetivo.fechafin);
                        if (fec < new Date()) {
                            style = {
                                borderRadius: '10px',
                                background: this.props.equipoConsulta.sell === key2 ? 'linear-gradient(to top, rgb(255, 255, 255) 35%, rgb(196, 24, 214) 120%)' : 'linear-gradient(to top, rgb(255, 255, 255) 70%, rgb(250, 80, 0) 180%)',
                                left: '25px',
                                height: '6em',
                                top: '25px',
                                width: '234px',
                                'box-shadow': this.props.equipoConsulta.sell === key2 ? 'rgba(23, 22, 20, 0.58) 1.5px 1.5px 5px 1.5px' : '#fbbd0894 0.5px 0.5px 5px 0.5px',
                            };
                        }
                    }

                    ///mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                    y++;
                    if (y > 7)
                        y = 0;


                    let topA = -(Math.round((cconsulta[key2].concepto.length + 6) / 15) * 15) - 20;
                    if (!images[y]) return null;
                    let imagenT = images[y] ? images[y].urls.thumb : null;

                    if (nObj === 0 && !this.props.equipoConsulta.sell && !this.state.est) {
                        this.setState({ est: true });
                        this.handleSeleccionar(key2, imagenT);
                    }

                    nObj++;
                    return (
                        <div className="item" style={{ height: '9em' }} key={key2} onClick={() => { this.expandirObjetivo(key2, imagenT); }}>
                            <i className={`large middle ${iconoObjetivo} aligned icon`} style={{
                                color: '#c64e07',
                                position: 'relative',
                                'z-index': '7',
                                top: '17px',
                                left: '260px',
                                transform: 'scale(0.7)',
                            }}  ></i>
                            <div className="content">
                                <Segment style={style}>
                                    <Image wrapped style={{
                                        width: '100px',
                                        top: '-25px',
                                        left: '-35px',
                                        height: '67px',
                                        overflow: 'hidden',
                                        transform: 'scale(1.15,1)',
                                        'border-radius': '55px 15px 55px 8px',
                                        'box-shadow': '#fbbd0894 0.8px 0.8px 5px 1.5px',
                                    }} src={images[1] ? images[y].urls.thumb : ''} />
                                    <div className="header" style={{
                                        top: '-76px',
                                        position: 'relative',
                                        color: '#99460a',
                                        left: '82px',
                                        width: '60%'
                                    }}  >{cconsulta[key2].concepto}</div>

                                    <Progress percent={resultado >= 100 ? 100 : resultado === 0 ? 15 : resultado} inverted size='small' indicating progress style={{ top: topA, position: 'relative' }} />

                                </Segment>

                            </div>
                        </div >
                    );
                }
                return null;
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
        return (
            <div>
                <div className="maximo-listEObj" >
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
        selObjetivo: state.chatReducer.selObjetivo,
        userId: state.auth.userId,

    });


export default connect(mapAppStateToProps, { listaObjetivos, prioridadObjs, selObjetivos, popupDetalles, numeroTareasTs, equipoConsultas, popupBot })(ListaObjetivosEquipo);



