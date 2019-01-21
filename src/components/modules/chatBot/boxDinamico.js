import React from 'react';
import {
    valorInputs,
    consultaPreguntaControls,
    submitMessage,
    mensajeEntradas,
    numeroPreguntas,
    consultas
} from './actions';
import { connect } from 'react-redux';
import _ from 'lodash';
import firebase from 'firebase';






class boxDinaminco extends React.Component {

    state = { term: '', flag: false, consultaY: true };

    renderConstruir() {
        let x = 0;
        //  console.log(this.props.user.userChats[0].thread[6]);

        if (this.props.user.userChats[0].thread[6].text === ' Prioridad') {
            const opciones = this.props.consultaPregunta[this.props.consultaPreguntaControl].opciones3.split(',').map((consulta) => {
                //  console.log(consulta);
                x++;
                return (
                    <option value={consulta} key={x} />
                );
            });

            return opciones;
        }
        else if (this.props.user.userChats[0].thread[6].text === ' Tiempo Estimado') {
            const opciones = this.props.consultaPregunta[this.props.consultaPreguntaControl].opciones2.split(',').map((consulta) => {
                //  console.log(consulta);
                x++;
                return (
                    <option value={consulta} key={x} />
                );
            });

            return opciones;
        }
        else if (this.props.user.userChats[0].thread[6].text === 'Eliminar') {
            this.props.consultaPreguntaControls(this.props.consultaPreguntaControl + 1);
            return;
        }
        else {
            return;
        }



    }
    renderOpciones() {
        let x = 0;
        const opciones = this.props.consultaPregunta[this.props.consultaPreguntaControl].opciones.split(',').map((consulta) => {

            x++;
            return (
                <option value={consulta} key={x} />
            );
        });

        return opciones;
    }


    renderOpcionesDB() {
        if (!this.props.consultax && this.state.consultaY) {

            const starCountRef = firebase.database().ref().child(`${this.props.consultaPregunta[this.props.consultaPreguntaControl].opciones}/${this.props.userId}`);
            starCountRef.on('value', (snapshot) => {


                this.props.consultas(snapshot.val());


            });

        }


    }


    renderOpcionesDB2() {
        if (this.props.consultax && this.state.consultaY) {
            //  console.log(this.props.consultax);
            const cconsulta = this.props.consultax;
            
            const input = this.props.user.userChats[0].thread[2]? this.props.user.userChats[0].thread[2].text: '';
           
            const opciones = Object.keys(cconsulta).map(function (key, index) {
                //   console.log(cconsulta[key]);
                if (!cconsulta[key].estado) {

                    const ccconsulta = cconsulta[key];
                    const opciones2 = Object.keys(ccconsulta).map(function (key, index) {
                        //            console.log(ccconsulta[key]);
                        if (ccconsulta[key].concepto !== input && (ccconsulta[key].estado === 'activo' || ccconsulta[key].estado === 'trabajando')) {
                            return (
                                <option value={ccconsulta[key].concepto} key={key} />
                            );
                        }

                    });
                    return opciones2;
                }
                else if (cconsulta[key].estado === 'activo') {
                    return (
                        <option value={cconsulta[key].concepto} key={key} />
                    );
                }

            });

            // this.setState({ consultaY: false });
            return (
                <datalist id='opciones'>
                    {opciones}
                </datalist>
            );
        }


    }

    renderOpcionesDB3() {
        if (this.props.consultax && this.state.consultaY) {

            const cconsulta = this.props.consultax;

            const opciones = Object.keys(cconsulta).map(function (key, index) {
                return cconsulta[key].concepto;
            });

            const limitacion = opciones.join().replace(/,/g, '|');
            //    console.log(limitacion);
            return (

                { limitacion }
            );
        }


    }

    renderControl() {


       // console.log(this.props.consultaPregunta);
        if (!this.props.consultaPregunta) {
            //    console.log('1');

            return (<input
                value={this.props.valorInput === ' ' ? '' : this.props.term}
                onChange={this.onInputChange}
                className="message-input-ch"
                placeholder="message"
                rows={10}
                cols={30}

            />);
        }

        else if (this.props.consultaPregunta.length - 1 < this.props.consultaPreguntaControl && this.props.valorInput === ' ') {

          //  console.log('entro');
            //console.log(this.props.user.userChats[0].thread);
            if (this.state.flag === false)
                this.setState({ flag: true });
            // console.log(this.state.flag);
            return (<div></div>);
        }

        else if (this.props.consultaPregunta[this.props.consultaPreguntaControl].tipoPregunta === '5') {
            // console.log('3');

            return (<input
                value={this.props.valorInput === ' ' ? '' : this.props.term}
                onChange={this.onInputChange}
                className="message-input-ch"
                placeholder="message"
                rows={10}
                cols={30}

            />);
        }
        else if (this.props.consultaPregunta[this.props.consultaPreguntaControl].tipoPregunta === '1') {
            //  console.log('4');
            const texto = this.props.consultaPregunta[this.props.consultaPreguntaControl].opciones.replace(/,/g, '|');
            return (<React.Fragment>
                <input
                    value={this.props.valorInput === ' ' || this.props.valorInput === 'x' ? '' : this.props.term}
                    onChange={this.onInputChange}
                    pattern={texto}
                    list='opciones' placeholder='Escoge una Opcion...'
                    className="message-input-ch"
                    rows={10}
                    cols={30}

                />
                <datalist id='opciones'>
                    {this.renderOpciones()}
                </datalist>
            </React.Fragment>);
        }
        else if (this.props.consultaPregunta[this.props.consultaPreguntaControl].tipoPregunta === '2') {
            //   console.log('5');
            /// const texto = this.props.consultaPregunta[this.props.consultaPreguntaControl].opciones.replace(/,/g, '|');

            this.renderOpcionesDB()
            return (<React.Fragment>
                <input
                    value={this.props.valorInput === ' ' ? '' : this.props.term}
                    onChange={this.onInputChange}
                    //   pattern={`'${this.renderOpcionesDB3()}'`}
                    list='opciones' placeholder='Escoge una Opcion...'
                    className="message-input-ch"
                    rows={10}
                    cols={30}

                />

                {this.renderOpcionesDB2()}

            </React.Fragment >);
        }
        else if (this.props.consultaPregunta[this.props.consultaPreguntaControl].tipoPregunta === '3') {
            //            console.log('6');

            return (<React.Fragment>
                <input

                    value={this.props.valorInput === ' ' ? '' : this.props.term}
                    onChange={this.onInputChange}
                    list='opciones' placeholder='Escoge una Opcion...'
                    className="message-input-ch"
                    rows={10}
                    cols={30}

                />
                <datalist id='opciones'>
                    {this.renderOpciones()}
                </datalist>
            </React.Fragment>);

        }
        else if (this.props.consultaPregunta[this.props.consultaPreguntaControl].tipoPregunta === '6') {
            //            console.log('6');
            let texto;
            if (this.props.user.userChats[0].thread[6].text === ' Prioridad') {

                texto = this.props.consultaPregunta[this.props.consultaPreguntaControl].opciones3.replace(/,/g, '|');
            }
            else if (this.props.user.userChats[0].thread[6].text === ' Tiempo Estimado') {
                texto = this.props.consultaPregunta[this.props.consultaPreguntaControl].opciones2.replace(/,/g, '|');
            }

            return (<React.Fragment>
                <input

                    value={this.props.valorInput === ' ' ? '' : this.props.term}
                    onChange={this.onInputChange}
                    pattern={texto}
                    list='opciones' placeholder='Escoge una Opcion...'
                    className="message-input-ch"
                    rows={10}
                    cols={30}

                />
                <datalist id='opciones'>
                    {this.renderConstruir()}
                </datalist>
            </React.Fragment>);
        }

    }



    onInputChange = event => {


        if (!event) { this.setState({ term: '' }); }
        else {

            this.props.valorInputs(event.target.value);
            this.setState({ term: this.props.valorInput });
        }

    };


    renderMensajeSalida() {
        if (this.state.flag) {
            if (this.props.consultaPreguntaControl === 1) { this.setState({ flag: false }); }
            else {
                this.setState({ flag: null });
                const nameRef2 = firebase.database().ref().child('Mensaje-ChatBot').child('Despedida').child('1');
                nameRef2.on('value', (snapshot2) => {


                    const mensaje = snapshot2.val().concepto;
                    const result = _.replace(mensaje, /@nombre/g, this.props.nombreUser);
                    //  console.log(result);

                    this.props.mensajeEntradas(true);

                    this.props.numeroPreguntas(1);
                    this.props.submitMessage(result, this.props.user.activeChat.chatID, this.props.idChatUser);


                });
            }
        }
    }


    render() {

        return (
            <div>

                <div className="field" >
                    {this.renderControl()}
                    {this.renderMensajeSalida()}
                </div>

            </div>


        );
    }
};

const mapAppStateToProps = (state) => (
    {
        userId: state.auth.userId,
        consultax: state.chatReducer.consultax,
        mensajeEnt: state.chatReducer.mensajeEnt,
        consultaPreguntaControl: state.chatReducer.consultaPreguntaControl,
        valorInput: state.chatReducer.valorInput,
        numeroPregunta: state.chatReducer.numeroPregunta,
        consultaPregunta: state.chatReducer.consultaPregunta,
        idChatUser: state.chatReducer.idChatUser,
        nombreUser: state.chatReducer.nombreUser,
        user: state.user

    });


export default connect(mapAppStateToProps, { valorInputs, consultaPreguntaControls, submitMessage, mensajeEntradas, numeroPreguntas, consultas })(boxDinaminco);