import React from 'react';
import { connect } from 'react-redux';
import CardFeedback from '../utilidades/cardFeed';
//import image from '../../images/hupityNewlogo.png';
import unsplash from '../../apis/unsplash';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs } from '../modules/chatBot/actions';


class Hupps extends React.Component {
    state = { images: [], modalOpen: false };

    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => this.setState({ modalOpen: false })

    componentDidMount() {
        this.onSearchSubmit()
    }

    onSearchSubmit = async () => {
        const response = await unsplash.get('/search/photos', {
            params: { query: 'business' },

        });
        this.setState({ images: response.data.results })
        console.log(this.state.images);
    }

    renderGrafico(the) {

        return (
            <div className="four column stackable ui grid">
                {this.renderGrafico2(the)}
            </div>
        );
    }
    renderGrafico2(the) {
        if (the.state.images[0]) {
            if (the.props.listaObjetivo && the.props.listaObjetivo.objetivos && the.props.listaObjetivo.tareas) {
                const cconsulta = this.props.listaObjetivo.objetivos;
                let x = 0;

                const opciones = Object.keys(cconsulta).map(function (key2, index) {

                    x = x + 1;
                    let tareas = {};
                    const tareaO = the.props.listaObjetivo.tareas;

                    Object.keys(tareaO).map(function (key3, index) {
                        if (key3 === key2)
                            tareas = tareaO[key3];
                    })

                    return (
                        <div className="column  " key={key2}>
                            <CardFeedback image={the.state.images[x].urls.regular}
                                title={cconsulta[key2].concepto}
                                descripcion={cconsulta[key2].detalle}
                                fechaFin={cconsulta[key2].dateFinalizado ? cconsulta[key2].dateFinalizado : ''}
                                numeroTareas={cconsulta[key2].numeroTareas}
                                prioridad={cconsulta[key2].prioridad}
                                estadox={cconsulta[key2].estado}
                                tareas={tareas}
                                objetivoF={cconsulta[key2]}
                                keyF={key2}
                               

                                numeroAdjuntos={cconsulta[key2].numeroAdjuntos ? cconsulta[key2].numeroAdjuntos : ''}
                                numeroComentarios={cconsulta[key2].numeroComentarios ? cconsulta[key2].numeroComentarios : ''}
                            />
                        </div>

                    );


                })
                return opciones;
            }
            else {
                return (
                    <div className="ui form loaderOBJ3">
                        <div className="ui segment loaderOBJ3">
                            <div className="ui active inverted dimmer">
                                <div className="ui text loader">
                                <h4> No tienes ningun objetivo para ver</h4>
                               
                                </div>
                            </div>
                            <p></p>
                        </div>
                    </div>

                );
            }

        }
    }

    render() {

        return (

            <div> {this.renderGrafico(this)}
            </div>
        );

    }

};

const mapAppStateToProps = (state) => (
    {

        numeroTareasTerminadas: state.chatReducer.numeroTareasTerminadas,
        popupDetalle: state.chatReducer.popupDetalle,
        listaObjetivo: state.chatReducer.listaObjetivo,
        prioridadObj: state.chatReducer.prioridadObj,
        userId: state.auth.userId,

    });

export default connect(mapAppStateToProps, { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs })(Hupps);