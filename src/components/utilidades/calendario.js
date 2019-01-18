import React from 'react';
import {
    DateInput,
    TimeInput,
    DateTimeInput,
    DatesRangeInput
} from 'semantic-ui-calendar-react';


import '../styles/ingresoHupity.css';



class Calendar extends React.Component {



    handleChange = (event, { name, value }) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({ [name]: value });
        }
    }

    render() {



        return (
            <form  >
                <h3 className="center">Selecciona tu dia de teletrabajo</h3>
                <DateInput
                    className="color-Calendario"
                    inline
                    name='date'


                    clearIcon={<i name="remove" color="red" />}
                    minDate="14/01/2019"
                    maxDate="18/01/2019"
                    value="16/01/2019"
                />
            </form>
        );
    }
}

export default Calendar;