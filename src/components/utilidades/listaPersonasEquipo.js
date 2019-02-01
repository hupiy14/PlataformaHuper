import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Button, Popup, Grid, Input, Header, Modal, Image, Form, Progress, Segment } from 'semantic-ui-react';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs } from '../modules/chatBot/actions';
import unsplash from '../../apis/unsplash';
import Avatar from '../../apis/xpress';
var fs = require('fs');



class listPersonasEquipo extends React.Component {
    state = {
        images: [], buscar: ['company', 'business', 'worker', 'formal',], ver: false, objetivoS: {}, detalleO: null, prioridadOk: true, guardar: false, cambio: 0, percent: 15, factor: 10, ntareas: 1,
        consultaTareas: {}, titulo: null, selectedFile: null, loaded: 0,
        listaPersonas: null, equipo: null, Cambio: true,
        avatares: null, colorSeleccion: {}, diateletrabajo: {},

        prioridadx: [{ prio: 'inmediato', color: 'red' }, { prio: 'urgente', color: 'yellow' }, { prio: 'normal', color: 'olive' }]
    };




    //vairble x aumento n cantidad terminada n*x
    //fotos de la tarjetas
    onSearchSubmit = async () => {
        const response = await unsplash.get('/search/photos', {
            params: { query: this.state.buscar[this.props.prioridadObj], },

        });

        this.setState({ images: response.data.results })
        // console.log(this.state.images);
    }


    onSearchXpress = async () => {
        const response = await Avatar.get('/xpresso/v1/search', {
            params: {
                apiKey: '6hSjEEYWVHTmSUUwvwjJzTpX8_zq8noEYq2-_r5ABnkq98vSw1jvHFKncRlYUA-C',
                query: "user"
            },

        });
        console.log(response.data);
        this.setState({ avatares: response.data.lowResGifs })

    }
    componentDidMount() {
        this.onSearchSubmit();
        this.onSearchXpress();
        // console.log(this.example2);

        //busca el euipo en el espacio de trabajo
        const starCountRef = firebase.database().ref().child(`Usuario-WS/${this.props.empresa}/${this.props.equipo}`);
        starCountRef.on('value', (snapshot) => {

            const equipo = snapshot.val();
            this.setState({ equipo });

            //carga todos los usuarios
            const starCountRef2 = firebase.database().ref().child(`Usuario`);
            starCountRef2.on('value', (snapshot2) => {
                const consulta = snapshot2.val();
                this.setState({ listaPersonas: consulta });
            });

            const fecha = new Date();
            const cal = this.getWeekNumber(fecha);
            let x = 0;
            Object.keys(this.state.equipo).map((key, index) => {
                const starCountRef2 = firebase.database().ref().child(`Usuario-DiaTeletrabajo/${key}/${fecha.getFullYear()}/${cal}`);
                starCountRef2.on('value', (snapshot2) => {
                    //dia = snapshot2.val().dia;

                    if (snapshot2.val()) {
                        var usuariodia = {};
                        usuariodia[key] = { dia: snapshot2.val().dia, mes: snapshot2.val().mes };
                        const objetos = { ...this.state.diateletrabajo, ...usuariodia }
                        this.setState({ diateletrabajo: objetos })

                    }


                });
            });

        });



    }


    getWeekNumber(date) {
        var d = new Date(date);  //Creamos un nuevo Date con la fecha de "this".
        d.setHours(0, 0, 0, 0);   //Nos aseguramos de limpiar la hora.
        d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Recorremos los días para asegurarnos de estar "dentro de la semana"
        //Finalmente, calculamos redondeando y ajustando por la naturaleza de los números en JS:
        return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
    };

    ///obtner dia de la semana
    renderDiaSemnana(dia) {
        switch (dia) {
            case 1: return 'Lumes';
            case 2: return 'Martes';
            case 3: return 'Miercoles';
            case 4: return 'Jueves';
            case 5: return 'Viernes';
            case 6: return 'Sabado';
            case 7: return 'Domingo';

            default: break;


        }
    }
    /// muestra el dia de teletrabjao antes, durante y despues
    renderCalendario(key) {

        let dia = {};
        let colorAviso = 'teal';
        let classNames = null;
        let fechaM;

        if (this.state.diateletrabajo && Object.keys(this.state.diateletrabajo).length > 0) {
            const dias = this.state.diateletrabajo;
            Object.keys(dias).find(function (element) {

                if (element === key) {
                    dia = dias[element];
                    return;
                }

            });

            const fecha = new Date();

            if (fecha.getDate() === dia.dia) {
                colorAviso = 'red';
            }
            else if (fecha.getMonth() > dia.mes || fecha.getDate() > dia.dia) {
                colorAviso = 'grey';
            }

            classNames = `floating ui ${colorAviso} label`;
            if (!dia.dia) { return; }
            const diaSemana = new Date(2019, dia.mes, dia.dia).getDay();
            fechaM = this.renderDiaSemnana(diaSemana) + " " + dia.dia + "/" + (dia.mes + 1);


        }
        return (
            <div className="ui compact menu">
                <a className="item">
                    <i className="calendar alternate outline icon"></i> Dia de teletrabajo
                    <div className={classNames}>{fechaM}</div>
                </a>

            </div>
        );

    }



    renderavatarImage(x) {
        //   console.log(this.state.avatares[1])

        if (this.state.avatares) {

            console.log(this.state.avatares[x]);
            const direccion = this.state.avatares[x]
            return (
                <Image circular src={direccion} />
            );
        }

    }

    prueba(key) {
        // valida si ya esta selecionado
        let seleccion = {};
        if (this.state.colorSeleccion.key) {
            const key2 = this.state.colorSeleccion.key;
            let sel = true;
            if (key2 === key)
                sel = false;

            seleccion = { key, sel }
        }
        else {
            seleccion = { key, sel: true };
        }
        this.setState({ colorSeleccion: seleccion })

    }
    //Cambia la seleccion de la persona
    renderIconoEquipo(key) {

        if (this.state.colorSeleccion.key) {
           
            if (key === this.state.colorSeleccion.key && this.state.colorSeleccion.sel) {
                return <i className={`large middle ${this.props.icono} aligned yellow2 icon`}  ></i>;
            }
        }

        return <i className={` ui large middle ${this.props.icono} aligned teal icon`}  ></i>;

    }

    renderConstruirObj = (props) => {
        if (this.state.listaPersonas && this.state.equipo && this.state.diateletrabajo) {
            //  console.log('Cambio');
            const cconsulta = this.state.listaPersonas;
            const opciones = Object.keys(this.state.equipo).map((key, index) => {
                if (Object.keys(cconsulta).find((key2, index) => key2 === key)) {

                    if (key === this.props.userId) {
                        return;
                    }


                    const resultado = 100;

                    return (
                        <div className="item " key={key} onClick={() => { this.prueba(key) }} >
                            {this.renderIconoEquipo(key)}

                            <div className="content "   >


                                <Segment>
                                    <Progress percent={resultado >= 100 ? 100 : resultado === 0 ? 15 : resultado} color='purple' size='medium' attached='top' />
                                    <div className="ui header"   >{cconsulta[key].usuario}</div>
                                    <div className="description"   >{cconsulta[key].cargo ? cconsulta[key].cargo : ''}</div>
                                    {this.renderCalendario(key)}
                                    <Progress percent={resultado >= 100 ? 100 : resultado === 0 ? 15 : resultado} color='purple' size='small' attached='top' attached='bottom' />
                                </Segment>

                            </div>
                        </div >
                    );


                }

            });


            return opciones;
        }
        return (
            <div className="ui segment loaderTEAM" >
                <div className="ui active dimmer ">

                    <div className="ui text loader">A la espera de tu Equipo</div>
                </div>
                <br></br>
                <br></br>
            </div>
        );

    }

    componentDidUpdate() {
        /*  if (this.state.Cambio) {
              console.log('editar');
              //     this.setState({ Cambio: false });
             // console.log(this.state.diateletrabajo);
          }*/
    }

    render() {
        //  console.log(this.props.popupDetalle);
        // console.log( <RandomImage/>);
        const titulo = `${this.props.titulo}`;
        return (
            <div className="loaderTEAM">
                <h3>{titulo}</h3>
                <div className=" maximo-listE  ">

                    <div className="ui relaxed divided animated list  ">

                        {this.renderConstruirObj(this.props)}

                    </div>
                </div>
            </div>


        );
    }
}


const mapAppStateToProps = (state) => (
    {
        numeroTareasTerminadas: state.chatReducer.numeroTareasTerminadas,
        popupDetalle: state.chatReducer.popupDetalle,
        listaObjetivo: state.chatReducer.listaObjetivo,
        prioridadObj: state.chatReducer.prioridadObj,
        userId: state.auth.userId,

    });


export default connect(mapAppStateToProps, { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs })(listPersonasEquipo);