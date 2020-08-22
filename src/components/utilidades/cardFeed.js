import React from 'react';
import { connect } from 'react-redux';
import '../styles/ingresoHupity.css';
import { Button, Header, Icon, Modal, Input, Image, Card } from 'semantic-ui-react';
import { equipoConsultas, pasoOnboardings } from '../modules/chatBot/actions';
import history from '../../history';
import { popupBot } from '../../actions';
import { dataBaseManager } from '../../lib/utils';

const timeoutLength = 150000;


class ListEjemplo extends React.Component {

    constructor(props) {
        super(props);
        this.state = { spans: 0, modalOpen: false, modalOpen2: false, comentario: '', guardar: false, files: null, valueR: false };
        this.imageRef = React.createRef();
    }

    onChange = valueR => this.setState({ valueR: !this.state.valueR })

    componentDatabase(tipo, path, objectIn, mensaje, mensajeError) {
        let men = dataBaseManager(tipo, path, objectIn, mensaje, mensajeError);
        if (men && men.mensaje)
            this.props.popupBot({ mensaje: men.mensaje });
        return men;
    }

    componentDidMount() {
        if (this.props.objetivoF.resaltar)
            this.setState({ valueR: this.props.objetivoF.resaltar });
        else
            this.setState({ valueR: false });
        // this.imageRef.current.addEventListener('load', this.setSpans);
    }

    handleOpen = () => {
        this.handlePaso7();
        this.setState({ modalOpen: true });
    }

    handleClose(guardar, key) {
        if (!this.state)
            return;
        if (guardar && this.props) {
            let comentariosEnvio = {};
            const usuario = this.props.nombreUser;
            const newPostKey2 = this.componentDatabase('key', `Usuario-Objetivos/${this.props.objetivoF.idUsuario ? this.props.objetivoF.idUsuario : this.propss.userId}/${key}/comentarios`);
            const tipologia = this.props.responsableX ? 'feedback' : 'responder';
            comentariosEnvio = { usuario, tipo: tipologia, concepto: this.state.comentario }
            const usuarioD = this.props.objetivoF.idUsuario ? this.props.objetivoF.idUsuario : this.props.userId;
            let updates = {};
            updates[`Usuario-Objetivos/${this.props.usuarioGesto ? this.props.usuarioGesto : this.props.userId}/${key}/comentarios/${newPostKey2}`] = comentariosEnvio;

            this.componentDatabase('insert', `Usuario-Objetivos/${usuarioD}/${key}/comentarios/${newPostKey2}`, {
                usuario,
                tipo: tipologia,
                concepto: this.state.comentario
            });

            this.componentDatabase('update', `Usuario-Objetivos/${this.props.usuarioGesto ? this.props.usuarioGesto : this.props.userId}/${key}/comentarios/${newPostKey2}`, comentariosEnvio);
            this.setState({ guardar: false })
            if (this.props.usuarioGesto) {
                let variableF = {};
                variableF[newPostKey2] = comentariosEnvio;
                this.props.objetivoF.comentarios = { ...this.props.objetivoF.comentarios, ...variableF };
            }
        }
        // = {...objetio.comentarios, {} :  }

        this.setState({ comentario: '' })
        this.setState({ modalOpen: false });
    }
    handleOpen2 = () => {
        this.handlePaso7();
        this.setState({ modalOpen2: true });
    }

    handleClose2 = () => this.setState({ modalOpen2: false })


    renderTareas(tareas) {
        let x = 0;


        const opciones = Object.keys(tareas).map(function (key3, index) {
            //    console.log(tareas[key3]);
            let color = 'violet';
            if (tareas[key3].estado === 'finalizado')
                color = 'purple'
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
        //    console.log(opciones);

        return opciones;

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


        const objetivo = { ...this.props.objetivoF, numeroAdjuntos: this.props.objetivoF.numeroAdjuntos - 1 };
        this.componentDatabase('update', `Usuario-Objetivos/${this.props.objetivoF.idUsuario ? this.props.objetivoF.idUsuario : this.props.userId}/${this.props.keyF}`, objetivo);
    }




    renderAdjuntos() {

        const carpeta = this.props.objetivoF.carpeta;
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
                    imprimir.push(<div key={i} ><p> <i key={i} className="share icon" /> "  {file.name} "  <h5 onClick={() => { this.renderEliminarArchivo(`${filesID}`) }} className="ui  tiny green tag label">Eliminar</h5>  </p><br /></div>);
                    //  console.log(imprimir);
                }

            } else {
                console.log('No files found.');
            }
            //         console.log(imprimir);
            this.setState({ files: imprimir });

            const objetivo = { ...this.props.objetivoF, numeroAdjuntos: files.length };
            this.componentDatabase('update', `Usuario-Objetivos/${this.props.objetivoF.idUsuario ? this.props.objetivoF.idUsuario : this.props.userId}/${this.props.keyF}`, objetivo);
        });
    }


    guardarResaltar(objetivox, user, key) {

        const objetivo = { ...objetivox, resaltar: this.state.valueR };
        this.componentDatabase('update', `Usuario-Objetivos/${user}/${key}`, objetivo);
    }


    ConcluirObjetivo(objetivox, user, key) {
        this.props.equipoConsultas({ ...this.props.equipoConsulta, trabajo: { objetivox, user, key } })
        history.push('/formulario/validacion');
    }




    renderComentarios(tareas) {

        if (tareas.comentarios) {


            let numero = 0;

            const opciones = Object.keys(tareas.comentarios).map(function (key3, index) {
                //    console.log(tareas[key3]);
                numero = numero + 1;
                let color = 'olive';
                if (tareas.comentarios[key3].tipo === 'feedback')
                    color = 'green'

                const className = `ui ${color} ribbon  label`;
                return (
                    <div key={key3}>

                        <div className={className} key={key3}>

                            <i className="quote left icon"> </i>  {tareas.comentarios[key3].usuario} :
                            <Card color={color}
                                description={tareas.comentarios[key3].concepto}
                            />

                        </div>

                        <br></br>
                        <br></br>
                    </div>

                );

                //}
            });
            const objetivo = { ...this.props.objetivoF, numeroComentarios: numero };
            this.componentDatabase('update', `Usuario-Objetivos/${tareas.idUsuario ? tareas.idUsuario : this.props.userId}/${this.props.keyF}`, objetivo);
            return opciones;
        }

    }


    renderResaltar() {

        if (this.props.objetivoF.resaltar) {
            //   this.setState({ valueR: this.props.objetivoF.resaltar });
            return (<h5 className="ui yellow right ribbon label">Destacado</h5>);
        }

    }

    //paso final del onboarding
    handlePaso7 = () => {
        this.timeout = setTimeout(() => {
            this.props.pasoOnboardings(6);
        }, timeoutLength)
    }

    render() {

        let btGuardar = <Button color='green' onClick={() => {
            this.guardarResaltar(this.props.objetivoF, this.props.userId, this.props.keyF); this.handleClose2();
        }
        }>Guardar
         <Icon name='chevron right' />
        </Button>

        if (this.props.usuarioGesto)

            btGuardar =
                <Button color='green' onClick={() => {
                    this.ConcluirObjetivo(this.props.objetivoF, this.props.usuarioGesto, this.props.keyF);
                }}>
                    Validar <Icon name='clipboard outline' />
                </Button>




        return (


            <div className="ui card ">
                <div className="image big tamaño-Imagen" >
                    <img alt='Objetivo descripcion imagen' ref={this.imageRef} style={{ height: '200px' }} src={this.props.image} />
                </div>

                <div className="content">
                    {this.renderResaltar()}


                    <div className="header">{this.props.title}</div>
                    <div className="meta">
                        <span className="date">{this.props.fechaFin}</span>
                    </div>
                    <div className="description">
                        {this.props.descripcion}
                        <br />
                        <h6>Responsable: {this.props.responsableX ? this.props.responsableX : this.props.nombreUser}</h6>
                    </div>
                </div>
                <div className="extra content ">
                    <Modal
                        trigger={
                            <button className="ui basic  yellow button espaciobbb " onClick={this.handleOpen}>
                                <i className="comment alternate outline icon "></i>
                                Comentar</button>
                        }
                        open={this.state.modalOpen}
                        onClose={this.handleClose}
                        basic
                        size='small'
                    >
                        <Header icon='pencil alternate' content='Escribe el comentario al objetivo realizado:' />
                        <Modal.Content>
                            <h2>{this.props.title}</h2>
                            <br />
                            <Input fluid value={this.state.comentario}
                                onChange={e => this.setState({ comentario: e.target.value })}>
                            </Input>

                            <h4>"Los hombres sabios hablan porque tienen algo que decir; los necios porque tienen que decir algo".</h4><h6>-Platón</h6>
                        </Modal.Content>

                        <Modal.Actions>
                            <Button color='red' onClick={() => { this.handleClose() }} inverted>
                                <Icon name='close' /> Cancelar
                          </Button>
                            <Button color='green' onClick={() => { this.setState({ guardar: true }); this.handleClose(true, this.props.keyF, this.props) }} inverted>
                                <Icon name='checkmark' /> Enviar
                          </Button>
                        </Modal.Actions>
                    </Modal>



                    <Modal trigger={
                        <button className="ui basic green button espaciobb" onClick={this.handleOpen2}>
                            <i className={this.props.usuarioGesto ? "check circle icon" : 'paperclip icon'} ></i>
                            {this.props.usuarioGesto ? 'Validar' : 'Detalle'}</button>
                    }
                        open={this.state.modalOpen2}
                        onClose={this.handleClose2}
                        basic
                        size='small'
                    >
                        <Modal.Header>Detalle del Objetivo " {this.props.title} "</Modal.Header>
                        <Modal.Content image scrolling>
                            <div className="ui form">
                                <div className="ui grid">
                                    <div className="five wide column">
                                        <Image size='medium' src={this.props.image} wrapped />

                                    </div>
                                    <div className="eleven wide column">
                                        <Modal.Description >
                                            <Header>{this.props.title}</Header>
                                            <h2>{this.props.title}</h2>
                                            <p> <i className="share icon" />Detalle del objetivo:  "  {this.props.descripcion} "</p>
                                            <p> <i className="share icon" />Prioridad:  "  {this.props.prioridad} "</p>
                                            <p> <i className="share icon" />Estado :  "  {this.props.estadox} "</p>
                                            <p> <i className="share icon" />Fecha de finalizado el objetivo:  "  {this.props.fechaFin} "</p>
                                            <p> <i className="share icon" />Numero de conmentarios :   "  {this.props.numeroComentarios} "</p>
                                            <p> <i className="share icon" />Numero de tareas hechas:  "  {this.props.numeroTareas} "</p>
                                            <p> <i className="share icon" />Numero de archivos adjuntos: "  {this.props.numeroAdjuntos} "</p>
                                            <br />
                                            <h3>Comentarios:</h3>
                                            {this.renderComentarios(this.props.objetivoF)}
                                            <h3>Tareas Realizadas:</h3>
                                            {this.renderTareas(this.props.tareas)}
                                            <h3>Archivos Adjuntos:</h3>
                                            {this.state.files ? this.state.files : this.renderAdjuntos()}


                                        </Modal.Description>
                                    </div>
                                </div>




                            </div>
                        </Modal.Content>

                        <Modal.Actions>
                            <div className="ui toggle checkbox ubicarCh">
                                <input type="checkbox"
                                    checked={this.state.valueR}
                                    onChange={this.onChange}
                                    disabled={this.props.usuarioGesto ? true : false}
                                    name="public" />
                                <label></label>
                            </div><h5>Resaltar</h5>
                            <Button color='red' onClick={() => { this.handleClose2() }} inverted>
                                <Icon name='close' /> Cancelar
                          </Button>
                            {btGuardar}
                        </Modal.Actions>
                    </Modal>



                </div>





            </div >


        )
    };



};


const mapAppStateToProps = (state) => (
    {
        equipoConsulta: state.chatReducer.equipoConsulta,
        listaFormacion: state.chatReducer.listaFormacion,
        userId: state.auth.userId,
        nombreUser: state.chatReducer.nombreUser,

    });

export default connect(mapAppStateToProps, { equipoConsultas, pasoOnboardings, popupBot })(ListEjemplo);