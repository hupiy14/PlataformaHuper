import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Button, Popup, Grid, Input, Icon, Header, Modal, Image, Message, Form, Progress, Segment } from 'semantic-ui-react';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, equipoConsultas } from '../modules/chatBot/actions';
import unsplash from '../../apis/unsplash';
import MaskedInput from 'react-text-mask';
import perfil from '../../images/perfil.png';
import { relative } from 'path';
import history from '../../history';

const timeoutLength = 1500;
class ListaObjetivosEquipo extends React.Component {

    state = {
        images: [], buscar: ['company', 'business', 'worker', 'formal',], ver: false, detalleO: null, prioridadOk: true, guardar: false, cambio: 0, percent: 15, factor: 10, ntareas: 1,
        consultaTareas: {}, titulo: null, selectedFile: null, loaded: 0, iconoG: 'assistive listening systems icon', colorIconnoG: 'teal', usuarioG: 0, porInputs: [], inP: null, error: false,
        mensajeCodigo: null, files: null, estadoSel: null, comenatrios: null, actividadesObj: null, actividadesObjs: null, comenatrioss: null, ImageEqp: null, espacios: null, comentario: null, modalOpen: null,
        prioridadx: [{ prio: 'inmediato', color: 'red' }, { prio: 'urgente', color: 'yellow' }, { prio: 'normal', color: 'olive' }],
        factores: null,

    };



    componentDidUpdate() {
        if (!this.state.factores && this.props.equipoConsulta.factorProgreso) {
            this.setState({ factores: this.props.equipoConsulta.factorProgreso });
        }
    }

    guardarDetalle(objetivo, key) {
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

        if (max > 100 && objetivo.compartidoEquipo && !objetivo.idUsuarioGestor) {
            this.setState({ mensajeCodigo: { titulo: 'Error la distribución del objetivo', detalle: 'La suma parcial de cada persona del equipo, supera el 100% del objetivo' } })
            this.setState({ error: true })
            return;
        }
        else if (max < 100 && objetivo.compartidoEquipo && !objetivo.idUsuarioGestor) {
            this.setState({ mensajeCodigo: { titulo: 'Error la distribución del objetivo', detalle: 'La suma parcial de cada persona del equipo, no suma el 100% del objetivo' } })
            this.setState({ error: true })
            return;
        }

        let tarea = {
            ...objetivo, detalle: det, personasInvolucradas: this.state.porInputs ? this.state.porInputs : null
        };


        const x = this.props.prioridadObj + 1 > 2 ? 0 : this.props.prioridadObj + 1;
        tarea.prioridad = this.state.prioridadx[x].prio;


        updates[`Usuario-Objetivos/${objetivo.idUsuario}/${key}`] = tarea;
        firebase.database().ref().update(updates);
        this.setState({ mensajeCodigo: null });
        this.setState({ error: null });

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
    renderConsultarEW(objetivo) {
        if (objetivo.carpeta)
            window.open(`https://drive.google.com/drive/folders/${objetivo.carpeta}`);
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

        this.renderObtenerInformacionEquipo();

        firebase.database().ref(`Usuario-Objetivos/${key}/${idObjetivo}`).remove()
        firebase.database().ref(`Usuario-Tareas/${key}/${idObjetivo}`).remove()
    }

    renderInputsProcentaje(objetivo) {

        if (objetivo.personasInvolucradas && objetivo.gestor === true) {

            const per = objetivo.personasInvolucradas;
            let porcentaje = 0;
            let aux = -10;
            let title = <h5>Equipo y porcentaje de reponsabilidad en el objetivo</h5>
            let inputsed = Object.keys(per).map((key, index) => {
                if (key > 0)
                    title = null;


                porcentaje = per[key].por ? per[key].por : !per[key].porcentaje ? Math.round(100 / objetivo.personasInvolucradas.length) : Math.round(per[key].porcentaje);
                let arr = this.state.porInputs;
                arr[key] = { por: porcentaje, nombre: per[key].nombre, key: per[key].key, idUsuario: per[key].idUsuario };
                this.setState({ porInputs: arr })
                aux = aux - 10;

                return (
                    <div style={{ top: '-140px', position: 'relative' }} >

                        {title}
                        <div style={{ height: '35px', position: 'relative' }}>
                            <label>{!per[key].nombre ? per[key] : per[key].nombre}</label>
                            <MaskedInput mask={[/[0-9]/, /[0-9]/]}

                                value={this.state.porInputs ? this.state.porInputs[key].por ? this.state.porInputs[key].por : porcentaje : porcentaje}
                                style={{
                                    width: '80px',
                                    position: 'absolute',
                                    left: '100px',
                                    height: '30px'
                                }}
                                onChange={(e) => {
                                    let arr = this.state.porInputs;
                                    arr[key] = { por: parseInt(e.target.value.replace(/_/g, '')), nombre: per[key].nombre, key: per[key].key, idUsuario: per[key].idUsuario };
                                    this.setState({ porInputs: arr })
                                }}
                            />
                            <div class="ui horizontal label" style={{
                                'font-size': 'initial', background: '#d0674f',
                                left: '150px', position: 'absolute',
                                color: 'white'
                            }} >%</div>
                        </div>

                    </div>
                )
            })

            this.setState({ inP: inputsed });
            return inputsed;
        }
        this.setState({
            inP: null
        });


    }

    renderFoto(keyT, idUsuario, Usuarios) {

        const equipo = this.props.equipoConsulta.listaPersonas;
        let hEquipo = [];
        let aux = 0;
        Object.keys(equipo).map((key, index) => {
            if (!idUsuario) {

                Object.keys(Usuarios).map((key2, index) => {
                    if (Usuarios[key2].idUsuario === key) {

                        let trabajo = null;
                        let progreso = 0;
                        let progresoGlobal = 0;
                        const listaEOB = this.props.listaObjetivo;



                        Object.keys(listaEOB).map((key4, index) => {
                            const listaEOBT = listaEOB[key4];
                            if (!listaEOBT) return;
                            if (Usuarios[key2].idUsuario === key4) {
                                //    console.log(listaEOBT)
                                Object.keys(listaEOBT).map((key3, index) => {
                                    const consultaTareaTT = listaEOBT[key3];
                                    if (!consultaTareaTT) return;
                                    Object.keys(consultaTareaTT).map((key33, index) => {
                                        if (key3 === Usuarios[key2].key) {

                                            if (consultaTareaTT[key33].estado === 'activo' && !trabajo) {
                                                trabajo = consultaTareaTT[key33].concepto;
                                                progresoGlobal++;
                                            }
                                            else if (consultaTareaTT[key33].estado === 'trabajando') {
                                                trabajo = consultaTareaTT[key33].concepto;
                                                progresoGlobal++;
                                            }
                                            else if (consultaTareaTT[key33].estado === 'finalizado') {
                                                progreso++;
                                                progresoGlobal++;
                                            }



                                        }

                                    });
                                });
                            }
                        });





                        aux = aux + 20;
                        hEquipo.push(
                            <Popup
                                /// x icon
                                trigger={<Image src={equipo[key].imagenPerfil ? equipo[key].imagenPerfil : perfil} circular
                                    style={{
                                        'box-shadow': '#fbbd0894 0.8px 0.8px 5px 1.5px',
                                        width: '100px', position: 'absolute', top: '-10%', height: '100px', left: 220 + aux,
                                        transform: 'scale(0.5)'
                                    }}></Image>}
                                inverted
                            >
                                <h3 style={{ left: '10%', position: 'relative' }}>{equipo[key].usuario}</h3>
                                <h5 >Trabajando en : <b style={{ color: '#fbbd08' }}>{!trabajo ? '-' : trabajo} </b></h5>
                                <h5 style={{ left: '10%', position: 'relative' }}> Progreso : <b style={{ color: '#fbbd08' }}>{progresoGlobal === 0 ? 15 : Math.round((progreso / progresoGlobal) * 100)} % </b> </h5>
                            </Popup>
                        );
                    }
                });

            }
            else if (idUsuario === key) {


                let trabajo = null;
                let progreso = 0;
                let progresoGlobal = 0;
                const listaEOB = this.props.listaObjetivo;
                Object.keys(listaEOB).map((key4, index) => {
                    const listaEOBT = listaEOB[key4];
                    if (!listaEOBT) return;
                    if (idUsuario === key4) {
                        //    console.log(listaEOBT)
                        Object.keys(listaEOBT).map((key3, index) => {
                            const consultaTareaTT = listaEOBT[key3];
                            if (!consultaTareaTT) return;
                            Object.keys(consultaTareaTT).map((key33, index) => {
                                if (key3 === keyT) {

                                    if (consultaTareaTT[key33].estado === 'activo' && !trabajo) {
                                        trabajo = consultaTareaTT[key33].concepto;
                                        progresoGlobal++;
                                    }
                                    else if (consultaTareaTT[key33].estado === 'trabajando') {
                                        trabajo = consultaTareaTT[key33].concepto;
                                        progresoGlobal++;
                                    }
                                    else if (consultaTareaTT[key33].estado === 'finalizado') {
                                        progreso++;
                                        progresoGlobal++;
                                    }


                                }

                            });
                        });
                    }
                });





                hEquipo.push(


                    <Popup
                        /// x icon
                        trigger={<Image src={equipo[key].imagenPerfil ? equipo[key].imagenPerfil : perfil} circular
                            style={{

                                'box-shadow': '#fbbd0894 0.8px 0.8px 5px 1.5px',
                                width: '100px', position: 'absolute', top: '-10%', height: '100px', left: '50%',
                                transform: 'scale(0.5)'
                            }}></Image>}
                        inverted
                    >
                        <h3 style={{ left: '10%', position: 'relative' }}>{equipo[key].usuario}</h3>
                        <h5 >Trabajando en : <b style={{ color: '#fbbd08' }}>{!trabajo ? '-' : trabajo} </b></h5>
                        <h5 style={{ left: '10%', position: 'relative' }}> Progreso : <b style={{ color: '#fbbd08' }}>{progresoGlobal === 0 ? 15 : Math.round((progreso / progresoGlobal) * 100)} % </b> </h5>
                    </Popup>
                );
            }
        });

        this.setState({ ImageEqp: hEquipo });
    }

    renderAdjuntos(objetivo, equipo) {
        let imprimir = [];
        if (!equipo) {
            console.log('tres');
            const carpeta = objetivo.carpeta;
            window.gapi.client.drive.files.list({
                // 'corpus': 'domain',
                'q': `'${carpeta}' in parents`,
                'pageSize': 10,
                'fields': "nextPageToken, files(id, name, mimeType)"
            }).then((response) => {
                var files = response.result.files;

                if (files && files.length > 0) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        const filesID = file.id;
                        imprimir.push(<div key={i} style={{
                            top: '-170px',
                            left: '50px',
                            position: 'relative',
                        }} ><p> <i key={i} className="share icon" /> "  {file.name} "  <a onClick={() => { this.renderEliminarArchivo(`${filesID}`) }} style={{ background: 'linear-gradient(to right, rgb(239, 163, 26) 10%, rgb(243, 130, 38) 80%)' }} className="ui  tiny tag label">Eliminar</a>  </p><br /></div>);
                        //  console.log(imprimir);
                    }
                    this.setState({ files: imprimir });

                } else {
                    console.log('No files found.');
                }

                const objetivo = { ...this.props.objetivoF, numeroAdjuntos: files.length };
                let updates = {};
                updates[`Usuario-Objetivos/${this.props.objetivoF.idUsuario ? this.props.objetivoF.idUsuario : this.props.userId}/${this.props.keyF}`] = objetivo;
                firebase.database().ref().update(updates);

            });

        }
        else {

            const equipoC = this.props.equipoConsulta;
            Object.keys(equipo).map((key, index) => {

                Object.keys(equipoC).map((key2, index) => {


                    if (equipo[key].key === key2) {

                        const carpeta = equipoC[key2].carpeta;
                        window.gapi.client.drive.files.list({
                            // 'corpus': 'domain',
                            'q': `'${carpeta}' in parents`,
                            'pageSize': 10,
                            'fields': "nextPageToken, files(id, name, mimeType)"
                        }).then((response) => {
                            var files = response.result.files;

                            if (files && files.length > 0) {
                                for (var i = 0; i < files.length; i++) {
                                    var file = files[i];
                                    const filesID = file.id;
                                    imprimir.push(<div key={i} style={{
                                        top: '-170px',
                                        left: '50px',
                                        position: 'relative',
                                    }} ><p> <i key={i} className="share icon" /> "  {file.name} "  <a onClick={() => { this.renderEliminarArchivo(`${filesID}`) }} style={{ background: 'linear-gradient(to right, rgb(239, 163, 26) 10%, rgb(243, 130, 38) 80%)' }} className="ui  tiny tag label">Eliminar</a>  </p><br /></div>);
                                    //  console.log(imprimir);
                                }
                                this.setState({ files: imprimir });

                            } else {
                                console.log('No files found.');
                            }


                        });

                    }

                });

            });

        }




    }

    renderComentarios(tareas, equipo) {
        this.setState({ comenatrios: null });
        this.setState({ comenatrioss: null });
        if (!equipo) {
            if (tareas.comentarios) {

                let numero = 0;

                const opciones = Object.keys(tareas.comentarios).map(function (key3, index) {
                    //    console.log(tareas[key3]);
                    numero = numero + 1;
                    let color = 'linear-gradient(to top, #ffffff00 14%, #fda12a 105%)';
                    let pos = '30px 30px 30px 0px ';
                    if (tareas.comentarios[key3].tipo === 'feedback') {
                        color = 'linear-gradient(to top, #ffffff00 14%, rgb(203, 78, 232) 105%)';
                        pos = '30px 30px 0px 30px ';
                    }

                    return (
                        <Segment style={{ background: color, 'border-radius': pos, width: '80%' }}>
                            <p style={{ position: 'relative', width: '60%' }}>" {tareas.comentarios[key3].concepto} "<b style={{
                                'font-size': 'xx-small',
                                left: '75%',
                                position: 'relative',
                                top: '-10px',
                                color: '#7c5102',
                            }}> {tareas.comentarios[key3].usuario} </b></p>
                        </Segment>

                    );


                });
                const objetivo = { ...this.props.objetivoF, numeroComentarios: numero };
                let updates = {};
                updates[`Usuario-Objetivos/${tareas.idUsuario ? tareas.idUsuario : this.props.userId}/${this.props.keyF}`] = objetivo;
                firebase.database().ref().update(updates);
                const com = <div style={{ height: '8em', top: '-200px', overflow: 'auto', position: 'relative' }}>
                    {opciones}
                </div>

                this.setState({ comenatrios: opciones.length === 0 ? null : com });
                this.setState({ comenatrioss: opciones });
            }
        }
        else {
            const equipoC = this.props.equipoConsulta;
            let comEquipo = [];


            Object.keys(tareas.comentarios).map((key3, index) => {
                let color = 'linear-gradient(to top, #ffffff00 14%, #fda12a 105%)';
                let pos = '30px 30px 30px 0px ';
                if (tareas.comentarios[key3].tipo === 'feedback') {
                    color = 'linear-gradient(to top, #ffffff00 14%, rgb(203, 78, 232) 105%)';
                    pos = '30px 30px 0px 30px ';
                }
                return (
                    comEquipo.push(<Segment style={{ background: color, 'border-radius': pos, width: '80%' }}>
                        <p style={{ position: 'relative', width: '60%' }}>" {tareas.comentarios[key3].concepto} "<b style={{
                            'font-size': 'xx-small',
                            left: '75%',
                            position: 'relative',
                            top: '-10px',
                            color: '#7c5102',
                        }}> {tareas.comentarios[key3].usuario} </b></p>
                    </Segment>)
                );
            });



            Object.keys(equipo).map((key, index) => {
                Object.keys(equipoC).map((key2, index) => {

                    if (equipo[key].key === key2) {
                        if (equipoC[key2].comentarios) {

                            Object.keys(equipoC[key2].comentarios).map(function (key3, index) {
                                //    console.log(tareas[key3]);
                                if (!equipoC[key2].comentarios[key3].equipo) {
                                    let pos = '30px 30px 30px 0px ';
                                    let color = 'linear-gradient(to top, #ffffff00 14%, #fda12a 105%)';
                                    if (equipoC[key2].comentarios[key3].tipo === 'feedback') {
                                        color = 'linear-gradient(to top, #ffffff00 14%, rgb(203, 78, 232) 105%)';
                                        pos = '30px 30px 0px 30px ';
                                    }

                                    comEquipo.push(<Segment style={{ background: color, 'border-radius': pos, width: '80%' }}>
                                        <p style={{ position: 'relative', width: '60%' }}>" {equipoC[key2].comentarios[key3].concepto} "<b style={{
                                            'font-size': 'xx-small',
                                            left: '75%',
                                            position: 'relative',
                                            top: '-10px',
                                            color: '#7c5102',
                                        }}> {equipoC[key2].comentarios[key3].usuario} </b></p>
                                    </Segment>);
                                }
                            });
                        }
                    }
                });
            });
            const com = <div style={{ height: '8em', top: '-200px', overflow: 'auto', position: 'relative' }}>
                {comEquipo}
            </div>
            this.setState({ comenatrios: comEquipo.length === 0 ? null : com });
            this.setState({ comenatrioss: comEquipo });
        }

    }

    renderActividades(key2, IdUsuario, equipo) {

        if (!equipo) {

            const listaEOB = this.props.listaObjetivo;
            let imprimir = [];
            Object.keys(listaEOB).map((key4, index) => {
                const listaEOBT = listaEOB[key4];
                if (!listaEOBT) return;
                if (IdUsuario === key4) {
                    //    console.log(listaEOBT)
                    Object.keys(listaEOBT).map((key3, index) => {
                        const consultaTareaTT = listaEOBT[key3];
                        //      console.log(consultaTareaTT)
                        if (!consultaTareaTT) return;
                        Object.keys(consultaTareaTT).map((key33, index) => {
                            if (key3 === key2) {

                                let icono = "pencil alternate  icon";
                                let col = '#d56327';
                                if (consultaTareaTT[key33].estado === 'activo') {
                                    col = '#ff9c34';
                                    icono = "tasks icon";
                                }
                                else if (consultaTareaTT[key33].estado === 'finalizado') {
                                    icono = "check icon";
                                    col = '#c64e07';

                                }
                                else if (consultaTareaTT[key33].estado === 'anulado') {
                                    icono = "trash icon";
                                    col = '#beb3ad';
                                }



                                imprimir.push(<div key={key33}  ><p> <i key={key33} className={icono} /> <b style={{ width: '60%', color: col }}>{consultaTareaTT[key33].concepto}</b>  </p><br /></div>);
                            }

                        });

                    });
                }
            });

            const actImp = <Segment style={{
                height: '10em', top: '-200px', width: '80%',
                left: '40px',
                overflow: 'auto',
                position: 'relative',
                background: '#faebd700',
                'border-color': '#f3ad2600',
            }}>
                {imprimir}
            </Segment>

            this.setState({ actividadesObjs: imprimir });
            this.setState({ actividadesObj: imprimir.length === 0 ? null : actImp });

        }
        else {
            let imprimir = [];

            Object.keys(equipo).map((key, index) => {
                const listaEOB = this.props.listaObjetivo;

                Object.keys(listaEOB).map((key4, index) => {
                    const listaEOBT = listaEOB[key4];
                    if (!listaEOBT) return;
                    Object.keys(listaEOBT).map((key3, index) => {
                        const consultaTareaTT = listaEOBT[key3];
                        if (!consultaTareaTT) return;
                        Object.keys(consultaTareaTT).map((key33, index) => {
                            if (key3 === equipo[key].key) {

                                let icono = "pencil alternate  icon";
                                let col = '#d56327';
                                if (consultaTareaTT[key33].estado === 'activo') {
                                    col = '#ff9c34';
                                    icono = "tasks icon";
                                }
                                else if (consultaTareaTT[key33].estado === 'finalizado') {
                                    icono = "check icon";
                                    col = '#c64e07';

                                }
                                else if (consultaTareaTT[key33].estado === 'anulado') {
                                    icono = "trash icon";
                                    col = '#beb3ad';
                                }



                                imprimir.push(<div key={key33}  ><p> <i key={key33} className={icono} /> <b style={{ width: '60%', color: col }}>{consultaTareaTT[key33].concepto}</b>  </p><br /></div>);
                            }

                        });

                    });

                });



            });
            const actImp = <Segment style={{
                height: '10em', top: '-200px', width: '80%',
                left: '40px',
                overflow: 'auto',
                position: 'relative',
                background: '#faebd700',
                'border-color': '#f3ad2600',
            }}>
                {imprimir}
            </Segment>

            this.setState({ actividadesObjs: imprimir });
            this.setState({ actividadesObj: imprimir.length === 0 ? null : actImp });

        }
    }

    renderEspacioTrabajo(obj, equipo) {
        let esp = [];
        if (!equipo) {
            esp.push(<button className="ui button google drive icon  fluid" style={{
                top: '-190px', position: 'relative',
                color: 'rgb(27, 25, 20)',
                background: 'linear-gradient(to right, rgba(255, 255, 255, 0.98) 20%, rgb(255, 156, 0) 70%, rgba(255, 255, 255, 0.98) 88%)',
            }} onClick={() => { this.renderConsultarEW(obj); }}>Consultar espacio de trabajo
                <i className="google drive icon prueba-xx"> </i>
            </button>);
        }
        else {
            const equipoC = this.props.equipoConsulta;
            let aux = 0;
            Object.keys(equipo).map((key, index) => {

                Object.keys(equipoC).map((key2, index) => {


                    if (equipo[key].key === key2) {
                        aux = aux + 5;
                        esp.push(<button className="ui button google drive icon  fluid" style={{
                            top: -190 + aux, position: 'relative',

                            color: 'rgb(27, 25, 20)',
                            background: 'linear-gradient(to right, rgba(255, 255, 255, 0.98) 20%, rgb(255, 156, 0) 70%, rgba(255, 255, 255, 0.98) 88%)',

                        }} onClick={() => { this.renderConsultarEW(equipoC[key2]); }}>Consultar espacio de trabajo {equipo[key].nombre}
                            <i className="google drive icon prueba-xx"> </i>
                        </button>);
                    }
                });
            });
        }
        this.setState({ espacios: esp })
    }

    handleActualizar = (objetivo) => {
        this.timeout = setTimeout(() => {
            this.renderComentarios(objetivo, objetivo.compartidoEquipo && !objetivo.idUsuarioGestor ? objetivo.personasInvolucradas : null);
        }, timeoutLength)
    }

    handleOpen = () => {
        this.setState({ modalOpen: true });
    }

    guardarDetalleComentarios(key, objetivo) {

        if (this.state.comentario) {
            const usuario = this.props.nombreUser;
            let newPostKey2 = firebase.database().ref().child(`Usuario-Objetivos/${objetivo.idUsuario}/${key}`).push().key;
            firebase.database().ref(`Usuario-Objetivos/${objetivo.idUsuario}/${key}/comentarios/${newPostKey2}`).set({
                usuario,
                tipo: 'feedback',
                concepto: this.state.comentario
            });


            if (objetivo.compartidoEquipo && !objetivo.idUsuarioGestor) {
                const listaEOB = this.props.equipoConsulta;
                const equipo = objetivo.personasInvolucradas;
                Object.keys(equipo).map((key, index) => {

                    Object.keys(listaEOB).map((key3, index) => {

                        if (key3 === equipo[key].key) {


                            newPostKey2 = firebase.database().ref().child(`Usuario-Objetivos/${listaEOB[key3].idUsuario}/${key3}`).push().key;
                            firebase.database().ref(`Usuario-Objetivos/${listaEOB[key3].idUsuario}/${key3}/comentarios/${newPostKey2}`).set({
                                usuario,
                                tipo: 'feedback',
                                equipo: true,
                                concepto: this.state.comentario
                            });

                        }
                    });
                });

            }


            this.setState({ comentario: null });

        }


        this.handleActualizar(objetivo);
        this.setState({ detalleO: '' });
    }


    ConcluirObjetivo(objetivox, user, key) {
        this.props.equipoConsultas({ ...this.props.equipoConsulta, trabajo: { objetivox, user, key } })
        history.push('/formulario/validacion');

    }

    renderConstruirObj() {
        //  console.log(the.props.equipoConsulta);
        //    console.log(the.props.listaObjetivo);
        if (this.props.listaObjetivo && this.props.equipoConsulta) {

            const cconsulta = this.props.equipoConsulta;
            //console.log(the.props.equipoConsulta.sell);
            const opciones = Object.keys(cconsulta).map((key2, index) => {

                if (!cconsulta[key2])
                    return;
                //muestra los objetivos propios del gestor y compartidos
                if (cconsulta[key2].gestor) {
                    if (!cconsulta[key2].propio && !cconsulta[key2].compartidoEquipo)
                        return;
                }

                if (this.props.equipoConsulta.sell !== key2) return;

                const objetivo = cconsulta[key2];
                let factor = {};
                let tareasCompleta = 0;
                let resultado = cconsulta[key2].avance ? cconsulta[key2].avance : 0;
                let iconGetor = 'assistive listening systems';
                let boolGestor = false;
                const usuarioIF = cconsulta[key2].idUsuario;

                let iconoObjetivo = 'Objetivo personal';
                if (cconsulta[key2].tipo === "Es parte de mi flujo de trabajo")
                    iconoObjetivo = "Objetivo de flujo de trabajo";
                if (cconsulta[key2].compartidoEquipo)
                    iconoObjetivo = "Objetivo de equipo";



                if (cconsulta[key2].estado === 'activo' || cconsulta[key2].estado === 'validar') {
                    const listaEOB = this.props.listaObjetivo;

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

                        });
                    });
                    if (cconsulta[key2].estado === 'activo') {
                        iconGetor = 'user times';
                        boolGestor = true;
                    }


                    let style = {
                        borderRadius: '35px',
                        background: 'linear-gradient(to top, rgb(255, 255, 255) 80%, rgb(255, 157, 29) 105%)',
                        height: '40em',
                        top: '12em',

                        width: '60%',
                        left: '20%',
                        'box-shadow': 'rgba(23, 22, 20, 0.58) 1.5px 1.5px 5px 1.5px',
                    };
                    if (objetivo.fechafin) {
                        // console.log(objetivo.fechafin);
                        const fec = new Date(objetivo.fechafin);
                        if (fec < new Date()) {
                            style = {
                                borderRadius: '35px',
                                background: 'linear-gradient(to top, rgb(255, 255, 255) 80%, #e85e4e 105%)',
                                height: '40em',
                                top: '12em',

                                width: '60%',
                                left: '20%',
                                'box-shadow': 'rgba(23, 22, 20, 0.58) 1.5px 1.5px 5px 1.5px',
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


                    let flujo = this.props.equipoConsulta.flujo;
                    let fase = 'No tiene ninguna fase relacionada';
                    if (this.props.equipoConsulta.flujo) {
                        Object.keys(flujo).map((keyF, index) => {
                            if (keyF === cconsulta[key2].idUsuario) {
                                const flujoF = flujo[keyF].fases;
                                Object.keys(flujoF).map((keyFf, index) => {
                                    if (parseInt(keyFf) === cconsulta[key2].fase && cconsulta[key2].tipo !== 'Unico') {
                                        fase = flujoF[keyFf].label;
                                    }
                                });
                            }
                        });
                    }
                    if (this.state.estadoSel !== this.props.equipoConsulta.sell) {
                        this.setState({ detalleO: null });
                        this.setState({ Nadj: null, files: null });
                        this.renderAdjuntos(cconsulta[key2], cconsulta[key2].compartidoEquipo && !cconsulta[key2].idUsuarioGestor ? cconsulta[key2].personasInvolucradas : null);
                        this.renderComentarios(cconsulta[key2], cconsulta[key2].compartidoEquipo && !cconsulta[key2].idUsuarioGestor ? cconsulta[key2].personasInvolucradas : null);
                        this.renderActividades(key2, cconsulta[key2].idUsuario, cconsulta[key2].compartidoEquipo && !cconsulta[key2].idUsuarioGestor ? cconsulta[key2].personasInvolucradas : null);
                        this.renderFoto(key2, cconsulta[key2].idUsuarioGestor || !cconsulta[key2].compartidoEquipo ? cconsulta[key2].idUsuario : null, cconsulta[key2].personasInvolucradas);
                        this.renderEspacioTrabajo(cconsulta[key2], cconsulta[key2].compartidoEquipo && !cconsulta[key2].idUsuarioGestor ? cconsulta[key2].personasInvolucradas : null);
                        this.renderInputsProcentaje(cconsulta[key2]);
                        this.setState({ estadoSel: this.props.equipoConsulta.sell });

                    }

                    const Nadj = this.state.files ? this.state.files.length : 0;
                    const Ncom = this.state.comenatrioss ? this.state.comenatrioss.length : 0;
                    const Nact = this.state.actividadesObjs ? this.state.actividadesObjs.length : 0;



                    return (
                        <div className="item" key={key2} style={{ height: '25em' }}>
                            <div className="content">
                                <Segment style={style}>

                                    <Image wrapped style={{
                                        width: '250px',
                                        top: '-120px',
                                        left: '-130px',
                                        height: '160px',
                                        overflow: 'hidden',
                                        'border-radius': '50px 10px 60px 15px',
                                        transform: 'scale(1.15,1)',
                                        'box-shadow': '#fbbd0894 0.8px 0.8px 5px 1.5px',

                                    }} src={this.props.equipoConsulta.Isell} />
                                    <h3 style={{ top: '-170px', left: '160px', font: 'bolder', position: 'relative', width: '70%' }}>{cconsulta[key2].concepto}</h3>
                                    <h3 style={{ top: '-180px', position: 'relative' }}>Avance del objetivo:</h3>
                                    <Progress percent={resultado >= 100 ? 100 : resultado === 0 ? 15 : resultado} inverted size='small' indicating progress style={{ top: '-190px' }} />


                                    {this.state.ImageEqp}

                                    <Popup
                                        /// x icon
                                        trigger={< Icon name="trash alternate outline" style={{
                                            top: '-310px',
                                            position: 'relative',
                                            transform: 'scale(1.3)',
                                            color: '#a90707',
                                            left: '88%',
                                        }}
                                            onClick={() => {
                                                this.eliminarObjetivo(cconsulta[key2].idUsuario);
                                            }}
                                        />}
                                        content='Quieres eliminar el objetivo, recuerda perderás toda la información relacionada.'
                                        position='top center'
                                        size='tiny'
                                        inverted
                                    />


                                    <Popup
                                        trigger={<Icon name="checkmark" style={{
                                            top: '-310px',
                                            position: 'relative',
                                            transform: 'scale(1.3)',
                                            color: 'rgb(120, 255, 0)',
                                            left: '90%',
                                        }}
                                            onClick={() => {
                                                this.ConcluirObjetivo(cconsulta[key2], cconsulta[key2].idUsuario, key2);
                                            }}
                                        />}
                                        content='Valida el objetivo realizado.'
                                        position='top center'
                                        size='tiny'
                                        inverted
                                    />



                                    <Form error={this.state.error} style={{ height: '31em', top: '-220px', overflow: 'auto' }}>
                                        <div style={{ height: '55em' }}>
                                            <h5 style={{ top: '6px', position: 'relative' }}>Tipo de objetivo:  <b style={{ color: '#d06327' }}>{iconoObjetivo}</b></h5>
                                            <h5 style={{ top: '-12px', position: 'relative' }}>Fase del objetivo:   <b style={{ color: '#d06327' }}>{fase}</b></h5>
                                            <h5 style={{ top: '-30px', position: 'relative' }}>Prioridad del objetivo:  <b style={{ color: '#d06327' }}>{this.state.prioridadOk ? cconsulta[key2].prioridad : cconsulta[key2].prioridad === this.state.prioridadx[this.props.prioridadObj].prio ? cconsulta[key2].prioridad : this.state.prioridadx[this.props.prioridadObj].prio}</b></h5>

                                            <Button key={key2} style={{
                                                top: '-70px',
                                                left: '210px',
                                                position: 'relative',
                                                'font-size': 'smaller',
                                                color: '#ffdf7d',
                                                background: 'linear-gradient(to right, rgba(255, 255, 255, 0.63) 35%, rgba(243, 234, 221, 0) 110%)',
                                            }}
                                                onClick={() => {

                                                    this.setState({ prioridadOk: false });
                                                    this.props.prioridadObjs(this.props.prioridadObj + 1 > 2 ? 0 : this.props.prioridadObj + 1);
                                                }}
                                            >Cambiar</Button>
                                            <h5 style={{ top: '-92px', position: 'relative' }}>Impacto del objetivo en la organizacion:  <b style={{ color: '#d06327' }}>{cconsulta[key2].impacto}</b></h5>
                                            <h5 style={{ top: '-110px', position: 'relative' }}>Dificultad del objetivo:  <b style={{ color: '#d06327' }}>{cconsulta[key2].dificultad}</b></h5>
                                            <h5 style={{ top: '-128px', position: 'relative' }}>Numero de veces a realizar en la semana:  <b style={{ color: '#d06327' }}>{cconsulta[key2].repeticiones}</b></h5>

                                            <h5 style={{ top: '-146px', position: 'relative' }}>Detalle del objetivo:  </h5>
                                            <Input fluid value={this.state.detalleO ? this.state.detalleO.detalle ? this.state.detalleO.detalle : cconsulta[key2].detalle : cconsulta[key2].detalle}
                                                placeholder='Detalla el objetivo a realizar...'
                                                onChange={e => this.setState({ detalleO: { ...this.state.detalleO, detalle: e.target.value } })}
                                                style={{ top: '-158px', position: 'relative', background: 'rgba(247, 234, 167, 0.37)' }}
                                            >
                                            </Input>

                                            {this.state.inP}
                                            <h5 style={{ top: '-170px', position: 'relative' }}>Archivos adjuntos :  <b style={{ color: '#d06327' }}>{Nadj + ' adjuntos'}</b></h5>

                                            {this.state.files}
                                            <h5 style={{ top: '-170px', position: 'relative' }}>Comentarios realizados :  <b style={{ color: '#d06327' }}>{Ncom + ' comentarios'}</b></h5>

                                            <Modal
                                                trigger={
                                                    <button className="ui basic  yellow button  comment alternate outline icon" circular
                                                        style={{ transform: 'scale(0.8)', top: '-210px', 'border-radius': '30px', position: 'relative', left: '60%' }}
                                                        onClick={() => { this.handleOpen(); this.setState({ comentario: null }); }}> +
                                                    <i className="comment alternate outline icon "> </i>
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
                                                    <Button color='green' onClick={() => { this.setState({ modalOpen: false }); this.guardarDetalleComentarios(key2, cconsulta[key2]); }} inverted>
                                                        <Icon name='checkmark' /> Agregar</Button>
                                                </Modal.Actions>
                                            </Modal>

                                            {this.state.comenatrios}

                                            <h5 style={{ top: '-200px', position: 'relative' }}>Actividades realizadas :  <b style={{ color: '#d06327' }}>{Nact + ' actividades'}</b></h5>

                                            {this.state.actividadesObj}
                                            {this.state.espacios}


                                            < Button color='purple' content="Guardar" icon='save' fluid style={{
                                                background: 'linear-gradient(to right, rgba(255, 255, 255, 0.98) 10%, rgb(171, 17, 228) 50%, rgba(255, 255, 255, 0.98) 85%)',
                                                position: 'relative', top: '-170px'
                                            }}
                                                onClick={() => {
                                                    this.guardarDetalle(cconsulta[key2], key2);
                                                }}
                                            >
                                            </Button>


                                            <Message
                                                error={this.state.error}
                                                style={{ visibility: this.state.error ? '' : 'hidden', top: '-210px' }}
                                                header={this.state.mensajeCodigo ? this.state.mensajeCodigo.titulo : null}
                                                content={this.state.mensajeCodigo ? this.state.mensajeCodigo.detalle : null}
                                            />

                                        </div>
                                    </Form>

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
        return (
            <div>
                <div className="maximo-listEObj">

                    <div className="ui relaxed divided animated list ">

                        {this.renderConstruirObj()}

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
        nombreUser: state.chatReducer.nombreUser,

        userId: state.auth.userId,

    });


export default connect(mapAppStateToProps, { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, equipoConsultas })(ListaObjetivosEquipo);



