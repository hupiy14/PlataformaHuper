import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Image, Progress, Segment } from 'semantic-ui-react';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, equipoConsultas } from '../modules/chatBot/actions';
import Avatar from '../../apis/xpress';



class listPersonasEquipo extends React.Component {
    state = {
        percent: 15,
        consultaTareas: {}, titulo: null,
        avatares: null, colorSeleccion: {}, diateletrabajo: {},

    };




    //vairble x aumento n cantidad terminada n*x
    //fotos d


    onSearchXpress = async () => {
        const response = await Avatar.get('/xpresso/v1/search', {
            params: {
                apiKey: '6hSjEEYWVHTmSUUwvwjJzTpX8_zq8noEYq2-_r5ABnkq98vSw1jvHFKncRlYUA-C',
                query: "user"
            },

        });
        //     console.log(response.data);
        this.setState({ avatares: response.data.lowResGifs })

    }
    componentDidMount() {
        this.onSearchXpress();

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

        if (this.props.diateletrabajo && Object.keys(this.props.diateletrabajo).length > 0) {
            const dias = this.props.diateletrabajo;
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

            //            console.log(this.state.avatares[x]);
            const direccion = this.state.avatares[x]
            return (
                <Image circular src={direccion} />
            );
        }

    }

    renderSel(key) {
        // valida si ya esta selecionado
        let seleccion = {};
        if (this.state.colorSeleccion.key) {
            const key2 = this.state.colorSeleccion.key;
            let sel = true;
            if (key2 === key) {
                sel = false;
                key = 0;
            }

            seleccion = { key, sel }

        }
        else {
            seleccion = { key, sel: true };
        }
        this.setState({ colorSeleccion: seleccion });
        this.props.equipoConsultas({ ...this.props.equipoConsulta, sell: key });

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
        if (this.props.listaPersonas && this.props.equipox && this.props.diateletrabajo) {
            //  console.log('Cambio');
            const cconsulta = this.props.listaPersonas;
            const consultaEq = this.props.equipox;
            const opciones = Object.keys(consultaEq).map((key, index) => {
                if (Object.keys(cconsulta).find((key2, index) => key2 === key)) {

                    if (key === this.props.userId) {
                        return;
                    }
                   
                    const resultado = 100;

                    return (
                        <div className="item " key={key} onClick={() => { this.renderSel(key) }} >
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

        equipoConsulta: state.chatReducer.equipoConsulta,
        numeroTareasTerminadas: state.chatReducer.numeroTareasTerminadas,
        popupDetalle: state.chatReducer.popupDetalle,
        listaObjetivo: state.chatReducer.listaObjetivo,
        prioridadObj: state.chatReducer.prioridadObj,
        userId: state.auth.userId,

    });


export default connect(mapAppStateToProps, { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, equipoConsultas })(listPersonasEquipo);