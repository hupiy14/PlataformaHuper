import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { listaFormaciones } from '../modules/chatBot/actions';
import { Progress, Segment, Modal, Header, Button, Popup, List } from 'semantic-ui-react';

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
                return this.props.equipox[key];
            });
            return null;
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


    renderFormularioType() {
        if (this.state.typeform)
            return (
                <div className="sixteen wide column  ">
                    <div className="ui segment  videoFormacion2">
                        <div className="ui embed ">
                            <iframe className="videoFormacion" title="video player" src={this.state.typeform} />
                        </div>
                    </div>
                </div>
            );
    }

    renderFormacionesEquipoUsuario(iconos, cconsulta) {
        if (!cconsulta) return;
        const opciones = Object.keys(cconsulta).map((key2, index) => {
            if (cconsulta[key2].estado === 'activo')
                return (

                    <Modal key={key2}
                        trigger={
                            <div className="item" key={key2} onClick={() => {
                                this.handleOpen()
                                this.renderbuttton(cconsulta[key2]);

                            }} >
                                <div className="content">
                                    <i style={{ top: '18px', position: 'relative', 'left': '143px' }} className={`large middle ${iconos} aligned icon`}></i>
                                    <div style={{ width: '65%', 'font-size': 'xx-small', 'left': '23px', 'top': '4px', position: 'relative' }} className="header">{cconsulta[key2].concepto}</div>
                                </div>
                            </div>


                        }
                        open={this.state.modalOpen}
                        onClose={this.handleClose}
                        basic
                        size='small'
                    >
                        <Header icon='browser' content='Tips de formación Huper' />
                        <Modal.Content scrolling>
                            <div className="ui grid ">
                                <div className="sixteen wide column Black videoFormacion ">

                                    <div className="ui embed ">
                                        <iframe className="videoFormacion" title="video player" src={this.state.videoSrc} />
                                    </div>

                                </div>
                                {this.renderFormularioType(this)}


                            </div>
                        </Modal.Content>
                    </Modal >

                );
            return null;
        });


        return opciones;
    }

    renderFormacionesCompletas(iconos) {
        const cconsulta = this.state.listaFormaciones;
        // console.log(cconsulta);
        const opciones = Object.keys(cconsulta).map((key2, index) => {
            if (cconsulta[key2].estado === 'activo')
                return (

                    <Modal key={key2}
                        trigger={
                            <div className="item" key={key2} onClick={() => {
                                this.handleOpen()
                                this.renderbuttton(cconsulta[key2]);

                            }} >

                                <i className={`large middle ${iconos} aligned icon`}></i>
                                <div className="content">
                                    <Segment >

                                        <Progress percent={65} color='yellow' attached='top' />

                                        <div className="header">{cconsulta[key2].concepto}</div>
                                        <div className="description">{cconsulta[key2].detalle ? cconsulta[key2].detalle : ''}</div>
                                        <Button style={{ left: '80%', position: 'relative', background: '#f9d9c2db' }} icon='eye' circular />
                                        <Progress percent={65} color='yellow' attached='bottom' />
                                    </Segment >
                                </div>
                            </div>


                        }
                        open={this.state.modalOpen}
                        onClose={this.handleClose}
                        basic
                        size='small'
                    >
                        <Header icon='browser' content='Tips de formación Huper' />
                        <Modal.Content scrolling>
                            <div className="ui grid ">
                                <div className="sixteen wide column Black videoFormacion ">

                                    <div className="ui embed ">
                                        <iframe className="videoFormacion" title="video player" src={this.state.videoSrc} />
                                    </div>

                                </div>
                                {this.renderFormularioType()}

                            </div>
                        </Modal.Content>
                    </Modal >

                );
            return null;
        });

        return opciones;
    }


    AgregarFormacionHuper() {
        if (this.state.seleccion) {
            let updates = {};
            updates[`Usuario-Formcion/${this.props.keytrabajo}/${this.state.seleccion}`] = this.state.formacion;
            // console.log(updates);
            firebase.database().ref().update(updates);
            this.cargarInicio();

        }
    }

    ListaOpcionesFormacionA(iconos, cconsulta2) {
        //   console.log('opcioens');
        const cconsulta = this.state.listaFormaciones;
        let x = 0;
        let agregar = true;
        const opciones = Object.keys(cconsulta).map((key2, index) => {
            if (cconsulta[key2].estado === 'activo') {
                let encontro = false;

                if (cconsulta2) {
                    Object.keys(cconsulta2).find((element) => {

                        if (element === key2) {
                            encontro = true;
                        }
                        return null;
                    });
                }

                if (encontro) return null;

                if (x > 2) return null;
                x++;
                agregar = false;

                let colorRR;
                if (this.state.seleccion === key2)
                    colorRR = 'linear-gradient(to right, rgba(251, 227, 239, 0), rgb(240, 100, 0))';



                return (
                    <div style={{ background: colorRR, 'border-radius': '100px 500px 66px 88px' }} key={key2} onClick={() => {
                        if (this.state.seleccion === key2)
                            this.setState({ seleccion: null })
                        else
                            this.setState({ seleccion: key2, formacion: cconsulta[key2] })
                    }} >



                        <Modal key={key2}
                            trigger={
                                <div className="item" key={key2} onClick={() => {
                                    this.handleOpen()
                                    this.renderbuttton(cconsulta[key2]);

                                }} >

                                    <i className={`large middle ${iconos} aligned icon`}></i>
                                    <div className="content">
                                        <Segment >

                                            <Progress percent={65} color='yellow' attached='top' />

                                            <div className="header">{cconsulta[key2].concepto}</div>
                                            <div className="description">{cconsulta[key2].detalle ? cconsulta[key2].detalle : ''}</div>
                                            <Button style={{ left: '90%', position: 'relative', background: 'rgba(247, 221, 202, 0.33)' }} icon='eye' circular />
                                            <Progress percent={65} color='yellow' attached='bottom' />
                                        </Segment >
                                    </div>
                                </div>


                            }
                            open={this.state.modalOpen}
                            onClose={this.handleClose}
                            basic
                            size='small'
                        >
                            <Header icon='browser' content='Tips de formación Huper' />
                            <Modal.Content scrolling>
                                <div className="ui grid ">
                                    <div className="sixteen wide column Black videoFormacion ">

                                        <div className="ui embed ">
                                            <iframe className="videoFormacion" title="video player" src={this.state.videoSrc} />
                                        </div>

                                    </div>
                                    {this.renderFormularioType()}

                                </div>
                            </Modal.Content>
                        </Modal >

                    </div>

                );
            }
            return null;
        });
        return (
            <div  >
                <h3>Selecciona una de las formaciones para tu Huper</h3>
                {opciones}
                <br></br>
                <Button style={{ background: 'linear-gradient(to right, #efa31a 10%, #f38226 80%)' }} disabled={agregar} content='Agregar' fluid
                    onClick={() => {
                        this.AgregarFormacionHuper();
                        this.handleClose();
                        // the.guardarDetalle(the, usuarioIF, true);
                    }}

                />

            </div >);

    }
    renderAgregarFormacion(iconos, cconsulta) {
        return (

            <Popup wide trigger={<Button circular style={{ top: '90px', position: 'relative', left: '66px', transform: 'scale(0.7)' }} className=' foot-Informacion' icon='book' color='purple' size='large' />} on='click'>
                <Popup
                    trigger={

                        <List >
                            {this.ListaOpcionesFormacionA(this, iconos, cconsulta)}

                        </List>

                    }
                    open={this.state.modalOpen}
                    onClose={this.handleClose}
                    position='top center'
                    size='tiny'
                    inverted
                />

            </Popup>

        );
    }


    renderConstruirObj(iconos) {

        //  console.log(the.state.listaFormacionesEquipo);

        if (this.state.listaFormaciones) {

            const equipoConssulta = this.state.listaFormacionesEquipo
            let pasoVacio = false;
            let especial = true;

            let opciones = Object.keys(equipoConssulta).map((key3, index) => {
                const cconsulta = equipoConssulta[key3]

                Object.keys(equipoConssulta).find((element) => {
                    if (element === this.props.keytrabajo) {
                        especial = false;
                    }
                    return null;
                });

                if (this.props.keytrabajo === 0)
                    return null;

                if (!this.props.keytrabajo) {
                    if (pasoVacio) return null;
                    pasoVacio = true;
                    return this.renderFormacionesCompletas(iconos);

                }
                else if (this.props.keytrabajo === key3) {

                    return (<div key={key3} >
                        <div style={{ height: '6em', overflow: 'auto', position: 'relative', top: '7em' }}>
                            {this.renderFormacionesEquipoUsuario(iconos, cconsulta)}
                        </div>
                        {this.renderAgregarFormacion(iconos, cconsulta)}
                    </div>
                    );
                }
                if (especial) {
                    return (<div key={key3}>
                        <div style={{ height: '6em', overflow: 'auto', position: 'relative', top: '7em' }}>
                            {this.renderFormacionesEquipoUsuario(iconos, {})}
                        </div>

                        {this.renderAgregarFormacion(iconos, {})}
                    </div>
                    );
                }
                return null;

            });
            //  console.log(the.props.equipoConsulta);

            if (Object.keys(this.state.listaFormacionesEquipo).length === 0 && !this.props.keytrabajo) {
                //    console.log('entro');
                opciones = this.renderFormacionesCompletas(iconos);

            }
            else if (Object.keys(this.state.listaFormacionesEquipo).length === 0 && this.props.keytrabajo) {

                opciones = (<div key={1254}>
                    <div style={{ height: '6em', overflow: 'auto', position: 'relative', top: '7em' }}>
                        {this.renderFormacionesEquipoUsuario(iconos, null)}
                    </div>
                    {this.renderAgregarFormacion(iconos, null)}
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
                <h5 style={{ top: '120px', left: '100px', position: 'relative', color: 'white' }}>{this.props.titulo}.</h5>
                <div >

                    <div className="ui relaxed divided animated list">

                        {this.renderConstruirObj(this.props.iconos)}
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




