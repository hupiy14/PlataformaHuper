import React from 'react';
import { connect } from 'react-redux';
import Calendar from 'react-calendar';
import firebase from 'firebase';
import { Popup } from 'semantic-ui-react';

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


    componentDidMount() {

        const fecha = new Date();

        const nameRef2 = firebase.database().ref().child(`Usuario-DiaTeletrabajo/${this.props.userId}/${fecha.getFullYear()}/${this.getWeekNumber(fecha)}`)
        nameRef2.on('value', (snapshot2) => {
            if (snapshot2.val()) {
                this.setState({ date: new Date(snapshot2.val().year, snapshot2.val().mes, snapshot2.val().dia )} );

            }


        });
    }


    SelecionarDiaTeletrabajo = () => {

        const diat = this.state.date;

        firebase.database().ref(`Usuario-DiaTeletrabajo/${this.props.userId}/${diat.getFullYear()}/${this.getWeekNumber(diat)}`).set({
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


        return (
            <div className="ui column">
                <h3>Seleccciona tu dia de Teletrabajo</h3>
                <Calendar
                    minDate={this.validarFechaSemana()}
                    maxDate={this.validarFechaSemanaMax()}
                    onChange={this.onChange}
                    value={this.state.date}
                />
                <br></br>

                <Popup trigger={<button className="ui button center yellow  calendarioF" onClick={this.SelecionarDiaTeletrabajo}>
                    <i className="calendar check outline icon"></i>
                    Seleccionar </button>}

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

export default connect(mapAppStateToProps)(CalendarApp);