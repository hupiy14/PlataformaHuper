import React from 'react';
import { connect } from 'react-redux';
import Calendar from 'react-calendar';
import { Popup, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { dataBaseManager } from '../../lib/utils';
import { popupBot } from '../../actions';

class CalendarApp extends React.Component {
    state = {
        date: new Date(2018, 0, 1),
        fechaMinima: null,
    }

    onChange = date => this.setState({ date })


    getWeekNumber(date) {
        var d = new Date(date);  //Creamos un nuevo Date con la fecha de "this".
        d.setHours(0, 0, 0, 0);   //Nos aseguramos de limpiar la hora.
        d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Recorremos los días para asegurarnos de estar "dentro de la semana"
        //Finalmente, calculamos redondeando y ajustando por la naturaleza de los números en JS:
        return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
    };

    componentDatabase(tipo, path, objectIn, mensaje, mensajeError) {
        let men = dataBaseManager(tipo, path, objectIn, mensaje, mensajeError);
        if (men && men.mensaje)
            this.props.popupBot({ mensaje: men.mensaje });
        return men;
    }

    componentDidMount() {

        const fecha = new Date();

        const nameRef2 = this.componentDatabase('get', `Usuario-DiaTeletrabajo/${this.props.userId}/${fecha.getFullYear()}/${this.getWeekNumber(fecha)}`);
        nameRef2.on('value', (snapshot2) => {
            if (snapshot2.val()) {
                this.setState({ date: new Date(snapshot2.val().year, snapshot2.val().mes, snapshot2.val().dia) });

            }


        });
    }


    SelecionarDiaTeletrabajo = () => {

        const diat = this.state.date;
        this.componentDatabase('insert', `Usuario-DiaTeletrabajo/${this.props.userId}/${diat.getFullYear()}/${this.getWeekNumber(diat)}`, {
            FecgaRegistro: new Date().toString(),
            dia: diat.getDate(),
            mes: diat.getMonth(),
            year: diat.getFullYear(),
        });

    }

    validarFechaSemana() {
        var fecahMinima = new Date();
        const diferencia = fecahMinima.getDay() - 1;
        fecahMinima.setDate(fecahMinima.getDate() + (-diferencia));
        return fecahMinima;


    }
    validarFechaSemanaMax() {
        var fecahMinima = new Date();
        const diferencia = fecahMinima.getDay() - 1;
        fecahMinima.setDate(fecahMinima.getDate() + (-(diferencia)));
        fecahMinima.setDate(fecahMinima.getDate() + 5);
        return new Date(fecahMinima)
    }



    render() {
        this.validarFechaSemana();
        let btAtras = null;
        if (window.screen.width <= 500 || (window.screen.height <= 500 && window.screen.width <= 800)) {
            btAtras = <Link to="/menucel"  >
                <Button content="Atras" style={{ position: 'relative', left: '20%' }} color="grey"></Button>
            </Link>
        }
        return (
            <div className="ui column">
                <h3>Seleccciona tu dia Importante</h3>
                <Calendar
                    minDate={this.validarFechaSemana()}
                    maxDate={this.validarFechaSemanaMax()}
                    onChange={this.onChange}
                    value={this.state.date}
                />
                <br></br>
                {btAtras}
                <Popup trigger={

                    <button className="ui button center yellow  calendarioF" onClick={this.SelecionarDiaTeletrabajo}>
                        <i className="calendar check outline icon"></i>
                            Seleccionar </button>
                }

                    on='click'
                    hideOnScroll
                    content={`Haz selecionado el dia ${this.state.date.getDate()}/${this.state.date.getMonth() + 1}/${this.state.date.getFullYear()} `} />



            </div>


        );
    }
}

const mapAppStateToProps = (state) => (
    {
        listaFormacion: state.chatReducer.listaFormacion,
        userId: state.auth.userId,

    });

export default connect(mapAppStateToProps, { popupBot })(CalendarApp);