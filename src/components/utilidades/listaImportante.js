import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Button, Popup, Grid, Input, Header, Modal, Image, Form, Progress, Segment } from 'semantic-ui-react';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs } from '../modules/chatBot/actions';
import unsplash from '../../apis/unsplash';

var fs = require('fs');



class listImportante extends React.Component {
    state = {
        images: [], buscar: ['company', 'business', 'worker', 'formal',], ver: false, objetivoS: {}, detalleO: null, prioridadOk: true, guardar: false, cambio: 0, percent: 15, factor: 10, ntareas: 1,
        consultaTareas: {}, titulo: null, selectedFile: null, loaded: 0,
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
            variable = { ...variable, objetivos: snapshot.val() }
            this.props.listaObjetivos(variable);

        });

        const starCountRef2 = firebase.database().ref().child(`Usuario-Tareas/${this.props.userId}`);
        starCountRef2.on('value', (snapshot) => {
            variable = { ...variable, tareas: snapshot.val() }
            this.props.listaObjetivos(variable);
        });

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
                        resultado = factor.factor * tareasCompleta;
                        // console.log(resultado);

                    });

                    let style = {
                        borderRadius: 0.5,
                    };

                    if (objetivo.fechafin) {
                        console.log(objetivo.fechafin);
                        const fec = new Date(objetivo.fechafin);

                        if (fec < new Date()) {

                            style = {
                                borderRadius: 0.5,
                                background: '#f9333340',

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


                    return (
                        <div className="item" key={key2}>
                            <i className={`large middle ${the.props.icono} aligned icon`}  ></i>
                            <div className="content"   >


                                <Segment style={style} >
                                    <Progress percent={resultado >= 100 ? 100 : resultado === 0 ? 15 : resultado} indicating size='medium' attached='top' />
                                    <div className="header"  >{cconsulta[key2].concepto}</div>
                                    <div className="description"  >{cconsulta[key2].detalle ? cconsulta[key2].detalle : ''}</div>


                                    <br />
                                    <div className="right aling-Derecha">

                                        <Popup trigger={<Button icon='id badge' color='yellow' onClick={() => {
                                            the.onVideoSelect(objetivo);
                                            //  the.props.prioridadObjs(0); 
                                            the.setState({ prioridadOk: true });
                                        }}

                                        />} on='click' flowing hoverable>
                                            <Grid centered divided columns={1}>
                                                <Grid.Column textAlign='center'>
                                                    <Header as='h4'>Prioridad:</Header>
                                                    <p>
                                                        <div className={`ui green horizontal label`}>
                                                            {the.state.prioridadOk ? cconsulta[key2].prioridad : cconsulta[key2].prioridad === the.state.prioridadx[the.props.prioridadObj].prio ? cconsulta[key2].prioridad : the.state.prioridadx[the.props.prioridadObj].prio}</div>

                                                    </p>
                                                    <Button color='purple' key={key2} fluid
                                                        onClick={() => {
                                                            the.setState({ prioridadOk: false });
                                                            the.props.prioridadObjs(the.props.prioridadObj + 1 > 2 ? 0 : the.props.prioridadObj + 1);
                                                            the.setState({ guardar: true });


                                                        }}
                                                    >Cambiar</Button>

                                                </Grid.Column>

                                            </Grid>
                                        </Popup>
                                        <Modal
                                            trigger={<Button color='purple' icon='edit outline'
                                                onClick={() => {
                                                    the.setState({ cambio: Math.round(Math.random() * 6) });
                                                    the.onVideoSelect(objetivo);
                                                    the.setState({ ver: !the.state.ver });
                                                    the.setState({ titulo: cconsulta[key2].concepto });
                                                    the.setState({ detalleO: cconsulta[key2].detalle });
                                                }}
                                            />}
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
                                    <Progress percent={resultado >= 100 ? 100 : resultado === 0 ? 15 : resultado} indicating size='small' attached='top' attached='bottom' />
                                </Segment>

                            </div>
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
        userId: state.auth.userId,

    });


export default connect(mapAppStateToProps, { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs })(listImportante);