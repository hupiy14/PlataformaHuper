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
        this.onSearchSubmit('business')
        if (this.props.equipoConsulta) {
            //    console.log(this.props.equipoConsulta);
            this.props.listaObjetivos({ tareas: this.props.listaObjetivo, objetivos: this.props.equipoConsulta });
        }

        if (window.gapi.client)
            window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/drive/v3/rest")
                .then(function () { console.log("GAPI client loaded for API"); },
                    function (err) { console.error("Error loading GAPI client for API", err); });

    }

    onSearchSubmit = async (buscar) => {
        const response = await unsplash.get('/search/photos', {
            params: {
                query: buscar,
                "total_photos": 20,
            },

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


    construirTarjetaTT(the) {

        const cconsulta = this.props.listaObjetivo.objetivos;
        let x = 0;
        let y = 0;
        const opciones = Object.keys(cconsulta).map((key2, index) => {

            if (cconsulta[key2].estado === 'concluido') { return null; }
            x = x + 1;
            let tareas = {};
            const tareaO = the.props.listaObjetivo.tareas;

            Object.keys(tareaO).map((key3, index)=> {
                if (key3 === key2)
                    tareas = tareaO[key3];
                return tareaO[key3];
            })

            if (y > 8) {
                y = 0;
                // the.onSearchSubmit('company')
            }
            y = y + 1;
            return (
                <div className="column  " key={key2}>
                    <CardFeedback image={the.state.images[y].urls.thumb}
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

    construirTarjetaTG(the) {

        const cconsulta = this.props.listaObjetivo.objetivos;
        let x = 0;
        let y = 0;
        let usuario = null;
        let usuarioGesto = null;
        console.log(cconsulta);
        const opciones = Object.keys(cconsulta).map((key2, index) => {


            if (!cconsulta[key2].concepto) {
                return null;
            }

            if (cconsulta[key2].estado === 'finalizado') { return null; }

            x = x + 1;
            let tareas = {};
            usuarioGesto = cconsulta[key2].idUsuario;
            const personas = this.props.listaObjetivo.objetivos.listaPersonas;
            if (personas) {
                Object.keys(personas).map((key, index) => {
                    if (key === cconsulta[key2].idUsuario) {
                        usuario = personas[key].usuario;
                        console.log(usuario + '   ' + key);

                    }
                    return personas[key];
                });
            }

            if (y > 8) {
                y = 0;
            }

            y = y + 1;
            return (
                <div className="column  " key={key2}>
                    <CardFeedback image={the.state.images[y].urls.thumb}
                        title={cconsulta[key2].concepto}
                        descripcion={cconsulta[key2].detalle}
                        fechaFin={cconsulta[key2].dateFinalizado ? cconsulta[key2].dateFinalizado : ''}
                        numeroTareas={cconsulta[key2].numeroTareas}
                        prioridad={cconsulta[key2].prioridad}
                        estadox={cconsulta[key2].estado}
                        tareas={tareas}
                        objetivoF={cconsulta[key2]}
                        keyF={key2}
                        responsableX={usuario}
                        usuarioGesto={usuarioGesto}

                        numeroAdjuntos={cconsulta[key2].numeroAdjuntos ? cconsulta[key2].numeroAdjuntos : ''}
                        numeroComentarios={cconsulta[key2].numeroComentarios ? cconsulta[key2].numeroComentarios : ''}
                    />
                </div>

            );


        })
        return opciones;
    }

    renderGrafico2(the) {
        // console.log(the.state.images);
        if (the.state.images[1]) {
            if (the.props.listaObjetivo && the.props.listaObjetivo.objetivos && the.props.listaObjetivo.tareas) {

                if (this.props.equipoConsulta) {
                    return the.construirTarjetaTG(the);
                }
                else {
                    return the.construirTarjetaTT(the);
                }

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


            <div>
                {this.renderGrafico(this)}
            </div>
        );

    }

};

const mapAppStateToProps = (state) => (
    {

        numeroTareasTerminadas: state.chatReducer.numeroTareasTerminadas,
        popupDetalle: state.chatReducer.popupDetalle,
        equipoConsulta: state.chatReducer.equipoConsulta,
        listaObjetivo: state.chatReducer.listaObjetivo,
        prioridadObj: state.chatReducer.prioridadObj,
        userId: state.auth.userId,

    });

export default connect(mapAppStateToProps, { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs })(Hupps);