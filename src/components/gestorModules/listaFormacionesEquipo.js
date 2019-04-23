import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { listaFormaciones } from '../modules/chatBot/actions';
import { Progress, Segment, Modal, Header, Button, Image, Popup, Grid, List } from 'semantic-ui-react';

class ListaFormacionEquipo extends React.Component {
    state = { modalOpen: false, videoSrc0: 'r9SI6-yKCpA', videoSrc: '', listaFormacionesEquipo: {}, listaFormaciones: {}, seleccion: null, formacion: null, typeform: null }

    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => this.setState({ modalOpen: false })


    cargarInicio() {
        let variable = [];
        Object.keys(this.props.equipox).map((key, index) => {
            const us = key;
            const starCountRef = firebase.database().ref().child(`Usuario-Formcion/${key}`);
            starCountRef.on('value', (snapshot) => {

                const valor = snapshot.val();
                if (!valor)
                    return
                variable[us] = valor
                this.setState({ listaFormacionesEquipo: { ...this.state.listaFormacionesEquipo, ...variable } });
            });
        });



        const starCountRef2 = firebase.database().ref().child(`Formacion`);
        starCountRef2.on('value', (snapshot) => {

            const valor = snapshot.val();

            this.setState({ listaFormaciones: valor });

        });
    }

    componentDidMount() {
        this.cargarInicio();
    }


    renderbuttton(formacion) {

        let typeformOb = null;
        let src = `https://www.youtube.com/embed/${this.state.videoSrc0}`;
        if (formacion.link)
            src = `https://www.youtube.com/embed/${formacion.link}`;
        if (formacion.typeform)
            typeformOb = formacion.typeform;


        this.setState({ videoSrc: src, typeform: typeformOb });


    }


    renderFormularioType(the) {
        if (the.state.typeform)
            return (
                <div className="sixteen wide column  ">
                    <div className="ui segment  videoFormacion2">
                        <div className="ui embed ">
                            <iframe className="videoFormacion" title="video player" src={the.state.typeform} />
                        </div>
                    </div>
                </div>
            );
    }

    renderFormacionesEquipoUsuario(the, iconos, cconsulta) {
        if (!cconsulta) return;
        const opciones = Object.keys(cconsulta).map(function (key2, index) {
            if (cconsulta[key2].estado === 'activo')
                return (

                    <Modal key={key2}
                        trigger={
                            <div className="item" key={key2} onClick={() => {
                                the.handleOpen()
                                the.renderbuttton(cconsulta[key2]);

                            }} >
                                <br className="tiny"></br>
                                <div className="content">


                                    <Segment >
                                        <Progress percent={50} color='yellow' attached='top' />
                                        <i className={`large middle ${iconos} aligned icon`}></i>
                                        <div className="header">{cconsulta[key2].concepto}</div>
                                        <div className="description">{cconsulta[key2].detalle ? cconsulta[key2].detalle : ''}</div>


                                        <Button className='alinVerFomacion' icon='eye' color='teal' />




                                        <Progress percent={50} color='yellow' attached='bottom' />
                                    </Segment >
                                </div>
                            </div>


                        }
                        open={the.state.modalOpen}
                        onClose={the.handleClose}
                        basic
                        size='small'
                    >
                        <Header icon='browser' content='Tips de formación Huper' />
                        <Modal.Content scrolling>
                            <div className="ui grid ">
                                <div className="sixteen wide column Black videoFormacion ">

                                    <div className="ui embed ">
                                        <iframe className="videoFormacion" title="video player" src={the.state.videoSrc} />
                                    </div>

                                </div>
                                {the.renderFormularioType(the)}


                            </div>
                        </Modal.Content>
                    </Modal >

                );
        });


        return opciones;
    }

    renderFormacionesCompletas(the, iconos) {
        const cconsulta = the.state.listaFormaciones;
       // console.log(cconsulta);
        const opciones = Object.keys(cconsulta).map(function (key2, index) {
            if (cconsulta[key2].estado === 'activo')
                return (

                    <Modal key={key2}
                        trigger={
                            <div className="item" key={key2} onClick={() => {
                                the.handleOpen()
                                the.renderbuttton(cconsulta[key2]);

                            }} >

                                <i className={`large middle ${iconos} aligned icon`}></i>
                                <div className="content">
                                    <Segment >

                                        <Progress percent={65} color='yellow' attached='top' />

                                        <div className="header">{cconsulta[key2].concepto}</div>
                                        <div className="description">{cconsulta[key2].detalle ? cconsulta[key2].detalle : ''}</div>
                                        <Button className='alinVerFomacion' icon='eye' color='teal' />
                                        <Progress percent={65} color='yellow' attached='bottom' />
                                    </Segment >
                                </div>
                            </div>


                        }
                        open={the.state.modalOpen}
                        onClose={the.handleClose}
                        basic
                        size='small'
                    >
                        <Header icon='browser' content='Tips de formación Huper' />
                        <Modal.Content scrolling>
                            <div className="ui grid ">
                                <div className="sixteen wide column Black videoFormacion ">

                                    <div className="ui embed ">
                                        <iframe className="videoFormacion" title="video player" src={the.state.videoSrc} />
                                    </div>

                                </div>
                                {the.renderFormularioType(the)}

                            </div>
                        </Modal.Content>
                    </Modal >

                );
        });

        return opciones;
    }


    AgregarFormacionHuper() {
        if (this.state.seleccion) {
            let updates = {};
            updates[`Usuario-Formcion/${this.props.equipoConsulta.sell}/${this.state.seleccion}`] = this.state.formacion;
            // console.log(updates);
            firebase.database().ref().update(updates);
            this.cargarInicio();

        }
    }

    ListaOpcionesFormacionA(the, iconos, cconsulta2) {
     //   console.log('opcioens');
        const cconsulta = the.state.listaFormaciones;
        let x = 0;
        let agregar = true;
        const opciones = Object.keys(cconsulta).map(function (key2, index) {
            if (cconsulta[key2].estado === 'activo') {
                let encontro = false;

                if (cconsulta2) {
                    Object.keys(cconsulta2).find(function (element) {

                        if (element === key2) {
                            encontro = true;
                            return;
                        }

                    });
                }

                if (encontro) return;

                if (x > 2) return;
                x++;
                agregar = false;

                let colorRR;
                if (the.state.seleccion === key2)
                    colorRR = 'yellow2';

                const className = `item ${colorRR}`;
                return (
                    <div className={className} key={key2} onClick={() => {
                        if (the.state.seleccion === key2)
                            the.setState({ seleccion: null })
                        else
                            the.setState({ seleccion: key2, formacion: cconsulta[key2] })
                    }} >
                        <br className="tiny"></br>
                        <div className="content">

                            <Segment >
                                <i className={`large middle ${iconos} aligned icon`} key={key2}></i>
                                <div className="header">{cconsulta[key2].concepto}</div>
                                <div className="description">{cconsulta[key2].detalle ? cconsulta[key2].detalle : ''}</div>

                            </Segment >
                        </div>
                    </div>

                );
            }
        });
        return (
            <div >
                {opciones}
                <br></br>
                <Button color='teal' disabled={agregar} content='Agregar' fluid
                    onClick={() => {
                        the.AgregarFormacionHuper();
                        the.handleClose();
                        // the.guardarDetalle(the, usuarioIF, true);
                    }}

                />

            </div >);

    }
    renderAgregarFormacion(the, iconos, cconsulta) {
        return (

            <Popup wide trigger={<Button circular className=' foot-Informacion' icon='book' color='purple' size='large' />} on='click'>
                <Grid>
                    <Grid.Column>
                        <Popup
                            trigger={

                                <List>
                                    {this.ListaOpcionesFormacionA(the, iconos, cconsulta)}

                                </List>

                            }
                            open={the.state.modalOpen}
                            onClose={the.handleClose}


                            content='Selecciona una de las formaciones para tu Huper'
                            position='top center'
                            size='tiny'
                            inverted
                        />
                    </Grid.Column>
                </Grid>
            </Popup>

        );
    }


    renderConstruirObj(iconos, the) {

        //  console.log(the.state.listaFormacionesEquipo);

        if (the.state.listaFormaciones) {

            const equipoConssulta = the.state.listaFormacionesEquipo
            let pasoVacio = false;
            let especial = true;

            let opciones = Object.keys(equipoConssulta).map(function (key3, index) {
                const cconsulta = equipoConssulta[key3]



                Object.keys(equipoConssulta).find(function (element) {
                    if (element === the.props.equipoConsulta.sell) {
                        especial = false;
                        return;
                    }
                });


                if (!the.props.equipoConsulta.sell || the.props.equipoConsulta.sell === 0) {
                    if (pasoVacio) return;
                    pasoVacio = true;
                    return the.renderFormacionesCompletas(the, iconos);

                }
                else if (the.props.equipoConsulta.sell === key3) {

                    return (<div key={key3}>
                        {the.renderFormacionesEquipoUsuario(the, iconos, cconsulta)}
                        {the.renderAgregarFormacion(the, iconos, cconsulta)}
                    </div>
                    );
                }
                if (especial) {
                    return (<div key={key3}>
                        {the.renderFormacionesEquipoUsuario(the, iconos, {})}
                        {the.renderAgregarFormacion(the, iconos, {})}
                    </div>
                    );
                }



            });
            //  console.log(the.props.equipoConsulta);

            if (Object.keys(the.state.listaFormacionesEquipo).length === 0 && the.props.equipoConsulta && !the.props.equipoConsulta.sell) {
            //    console.log('entro');
                opciones = the.renderFormacionesCompletas(the, iconos);

            }
            else if (Object.keys(the.state.listaFormacionesEquipo).length === 0 && the.props.equipoConsulta && the.props.equipoConsulta.sell) {

                opciones = (<div key={1254}>
                    {the.renderFormacionesEquipoUsuario(the, iconos, null)}
                    {the.renderAgregarFormacion(the, iconos, null)}
                </div>
                );
            }
            return opciones;
        }
        else {
            return (
                <div className="ui segment loaderOBJ2">
                    <div className="ui active dimmer loaderOBJ2">
                        <div className="ui text loader">Haz cumplido tus formaciones</div>
                    </div>
                    <br></br>
                    <br></br>
                </div>
            );
        }

    }




    render() {
        return (
            <div>
                <h3>{this.props.titulo}</h3>
                <div className="maximo-listEObj">

                    <div className="ui relaxed divided animated list">

                        {this.renderConstruirObj(this.props.iconos, this)}
                    </div>
                </div>
            </div>

        )
    };
};

const mapAppStateToProps = (state) => (
    {
        equipoConsulta: state.chatReducer.equipoConsulta,
        listaFormacion: state.chatReducer.listaFormacion,
        userId: state.auth.userId,

    });


export default connect(mapAppStateToProps, { listaFormaciones })(ListaFormacionEquipo);




