import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { listaFormaciones, pasoOnboardings } from '../modules/chatBot/actions';
import { Progress, Segment, Modal, Header, Button, Icon } from 'semantic-ui-react';
const timeoutLength = 100000;

class ListEjemplo extends React.Component {
    state = { modalOpen: false, videoSrc0: 'r9SI6-yKCpA', videoSrc: '', typeform: null }

    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => this.setState({ modalOpen: false })

    componentDidMount() {
        // console.log(this.example2);
        const starCountRef = firebase.database().ref().child(`Usuario-Formcion/${this.props.userId}`);
        starCountRef.on('value', (snapshot) => {
            this.props.listaFormaciones(snapshot.val());
        });

    }



    renderbuttton(formacion) {

        let typeformOb;
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

    renderConstruirObj(iconos, the) {

        if (the.props.listaFormacion) {

            const cconsulta = the.props.listaFormacion
            const opciones = Object.keys(cconsulta).map(function (key2, index) {
                if (cconsulta[key2].estado === 'activo') {
                    const styleBt = {
                        position: 'relative',
                        left: '80%',
                    }
                    if (!the.props.usuarioDetail.usuario.onboarding)
                        styleBt.left = '40%'
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

                                            <Progress percent={50} color='yellow' attached='top' />
                                            <div className="header">{cconsulta[key2].concepto}</div>
                                            <div className="description">{cconsulta[key2].detalle ? cconsulta[key2].detalle : ''}</div>
                                            <Button style={styleBt} icon='eye' color='teal' />
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
                }
            });
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
                <div className="tamanoFormaciones">

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
        listaFormacion: state.chatReducer.listaFormacion,
        userId: state.auth.userId,
        usuarioDetail: state.chatReducer.usuarioDetail,

    });


export default connect(mapAppStateToProps, { listaFormaciones, pasoOnboardings })(ListEjemplo);




