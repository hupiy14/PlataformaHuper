import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { listaFormaciones } from '../modules/chatBot/actions';
import { Progress, Segment, Modal, Header, Button, Icon } from 'semantic-ui-react';

class ListEjemplo extends React.Component {
    state = { modalOpen: false, videoSrc0: 'r9SI6-yKCpA', videoSrc: '' }

    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => this.setState({ modalOpen: false })

    componentDidMount() {
        // console.log(this.example2);
        const starCountRef = firebase.database().ref().child(`Usuario-Formcion/${this.props.userId}`);
        const consulta = starCountRef.on('value', (snapshot) => {
            this.props.listaFormaciones(snapshot.val());

        });

    }

    renderbuttton(videoSrc) {

        let src = `https://www.youtube.com/embed/${this.state.videoSrc0}`;
        if (videoSrc)
            src = `https://www.youtube.com/embed/${videoSrc}`;
        this.setState({ videoSrc: src });

    }

    renderConstruirObj(iconos, the) {

        console.log(the.props.listaFormacion);
        if (the.props.listaFormacion) {

            const cconsulta = the.props.listaFormacion
            const opciones = Object.keys(cconsulta).map(function (key2, index) {
                if (cconsulta[key2].estado === 'activo')
                    return (

                        <Modal key={key2}
                            trigger={
                                <div className="item" key={key2} onClick={() => {
                                    the.handleOpen()
                                    the.renderbuttton(cconsulta[key2].link);

                                }} >
                                    <i className={`large middle ${iconos} aligned icon`}></i>
                                    <div className="content">
                                        <Segment >

                                            <Progress percent={50} color='yellow' attached='top' />

                                            <div className="header">{cconsulta[key2].concepto}</div>
                                            <div className="description">{cconsulta[key2].detalle ? cconsulta[key2].detalle : ''}</div>
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
                                    <div className="sixteen wide column  ">
                                        <div className="ui segment  videoFormacion2">
                                            <div className="ui embed ">
                                                <iframe className="videoFormacion" title="video player" src={'https://lucho20.typeform.com/to/fmPU2P'} />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </Modal.Content>
                        </Modal >

                    );
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

    });


export default connect(mapAppStateToProps, { listaFormaciones })(ListEjemplo);




