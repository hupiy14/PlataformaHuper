import React from 'react';
import {
    valorInputs,
    consultaPreguntaControls,
    submitMessage,
    mensajeEntradas,
    numeroPreguntas,
    consultas,
    pregFantasmas,
} from './actions';
import { connect } from 'react-redux';
import _ from 'lodash';
import firebase from 'firebase';
import randon from '../../../lib/randonImage';
import { Emoji } from 'emoji-mart';
import { Image, Dropdown, Input, } from 'semantic-ui-react';





let tagOptions = [];


let timelength = 700;

class boxDinaminco extends React.Component {

    state = { term: '', flag: false, consultaY: true, formmessage: 'message-input-ch', style: {} };

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



    handleMensaje = (valorInput, chatID, userID) => {
        this.timeout = setTimeout(() => {
            this.props.submitMessage(
                valorInput,
                chatID,
                userID
            );

        }, timelength)
    }

    renderOpcionesImage() {

        //contruye respuestas en lista opciones con imagenes y colores
        //label, icono, imagen
        //ejemplo
        //opcion>https$negro
        let x = 0;
        tagOptions = [];
        this.props.consultaPregunta[this.props.consultaPreguntaControl].opciones.split(',').map((consulta) => {
            x++;
            const consultaO = consulta.split('>');
            const values = consultaO[0];
            const detalle = consultaO[1].split('$');
            const tipoOb = detalle[0];
            const colorOb = detalle[1];
            const ObjetoT = this.props.consultaPregunta[this.props.consultaPreguntaControl].objeto;

            let labelO = null;
            let iconO = null;
            let imageO = null;
            if (ObjetoT === 'label') {
                labelO = { style: { 'background': colorOb.toString() }, empty: true, circular: true };
            }
            else if (ObjetoT === 'icon') {
                iconO = { name: tipoOb, style: { 'color': colorOb } };
            }
            else if (ObjetoT === 'image') {
                imageO = { avatar: true, src: tipoOb }
            }

            tagOptions = [...tagOptions,
            {
                key: x,
                label: labelO,
                icon: iconO,
                image: imageO,
                text: values,
                value: values,
            }]
        });

        //   console.log(tagOptions);
        return tagOptions;
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



    renderOpcionesDB4() {
        if (this.props.consultax && this.state.consultaY) {
            const cconsulta = this.props.consultax;
            let consultaOp = [];
            const input = this.props.user.userChats[0].thread[2] ? this.props.user.userChats[0].thread[2].text : '';
            const opciones = Object.keys(cconsulta).map(function (key, index) {

                if (!cconsulta[key].estado) {
                    const opcion = cconsulta[key].concepto;
                    consultaOp = [...consultaOp, opcion];
                    const ccconsulta = cconsulta[key];
                    const opciones2 = Object.keys(ccconsulta).map(function (key, index) {

                        if (ccconsulta[key].concepto !== input && (ccconsulta[key].estado === 'activo' || ccconsulta[key].estado === 'trabajando')) {
                            return (
                                <option value={ccconsulta[key].concepto} key={key} />
                            );
                        }

                    });
                    return opciones2;
                }
                else if (cconsulta[key].estado === 'activo') {
                    const opcion = cconsulta[key].concepto;
                    consultaOp = [...consultaOp, opcion];
                    return (
                        <option value={cconsulta[key].concepto} key={key} />
                    );
                }

            });

            if (!this.props.pregFantasma || (this.props.pregFantasma && this.props.pregFantasma.consultaOp === "Nada"))
                this.props.pregFantasmas({ key: 1, consultaOp });
            return (
                <datalist id='opciones'>
                    {opciones}
                </datalist>
            );
        }
        else {
            if (!this.props.pregFantasma)
                this.props.pregFantasmas({ key: 1, consultaOp: 'Nada' });

        }

    }

    renderOpcionesDBMultiple() {
        tagOptions = [];
        const iconO = { name: 'hand point right4 p', style: { 'color': '#e2d117' } };
        if (this.props.equipoConsulta) {
            let x = 0;
            const cconsulta = this.props.equipoConsulta;
            const usuario = this.props.userId;
            Object.keys(cconsulta).map(function (key2, index) {
                if (x === 0) {
                    x++;
                    let cconsulta2 = cconsulta[key2];
                    Object.keys(cconsulta2).map(function (key, index) {
                        if (usuario === key)
                            return;
                        if (cconsulta2[key].Rol === '2')
                            return;
                        tagOptions = [...tagOptions, {
                            key: x,
                            icon: iconO,
                            text: cconsulta2[key].usuario,
                            value: cconsulta2[key].usuario,
                        }]
                    });
                }
            });
        }

        else if (this.props.consultax && this.state.consultaY) {
            const cconsulta = this.props.consultax;
            const input = this.props.user.userChats[0].thread[2] ? this.props.user.userChats[0].thread[2].text : '';
            Object.keys(cconsulta).map(function (key, index) {
                if (!cconsulta[key].estado) {
                    const ccconsulta = cconsulta[key];
                    Object.keys(ccconsulta).map(function (key, index) {
                        if (ccconsulta[key].concepto !== input && (ccconsulta[key].estado === 'activo' || ccconsulta[key].estado === 'trabajando')) {
                            tagOptions = [...tagOptions,
                            {
                                key: key,
                                icon: iconO,
                                text: ccconsulta[key].concepto,
                                value: ccconsulta[key].concepto,
                            }]
                        }
                    });
                }
                else if (cconsulta[key].estado === 'activo') {
                    tagOptions = [...tagOptions,
                    {
                        key: key,
                        icon: iconO,
                        text: cconsulta[key].concepto,
                        value: cconsulta[key].concepto,
                    }]
                }
            });

        }

    }


    renderOpcionesDB2() {

        if (this.props.equipoConsulta) {
            let x = 0;

            const cconsulta = this.props.equipoConsulta;
            let cconsulta2;
            const usuario = this.props.userId;

            const opciones2 = Object.keys(cconsulta).map(function (key2, index) {
                if (x === 0) {
                    x = x + 1;
                    const cconsulta2 = cconsulta[key2];
                    const opciones = Object.keys(cconsulta2).map(function (key, index) {
                        if (usuario === key)
                            return;

                        return (
                            <option value={cconsulta2[key].usuario} key={key} />
                        );
                    });
                    return opciones;
                }


            });

            return (
                <datalist id='opciones'>
                    {opciones2}
                </datalist>
            );

        }


        else if (this.props.consultax && this.state.consultaY) {
            //  console.log(this.props.consultax);
            const cconsulta = this.props.consultax;

            const input = this.props.user.userChats[0].thread[2] ? this.props.user.userChats[0].thread[2].text : '';

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

            return (
                <input
                    value={this.props.valorInput === ' ' ? '' : this.props.term}
                    onChange={this.onInputChange}
                    className={this.state.formmessage}
                    style={this.state.style}
                    placeholder="message"
                //   rows={10}
                //  cols={30}

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

            return (


                <div class="ui labeled input" style={{ 'margin-left': '20px' }}>
                    <div class="ui label" className={this.state.formmessage} style={{ visibility: this.props.consultaPregunta[this.props.consultaPreguntaControl].label ? 'visible' : 'hidden', background: 'rgb(255, 251, 240)', top: '420px', left: '-33px', 'z-index': 5, 'border-radius': '5px' }}>
                        {this.props.consultaPregunta[this.props.consultaPreguntaControl].label ? this.props.consultaPregunta[this.props.consultaPreguntaControl].label : null}
                    </div>
                    <input type="text" placeholder="message" key={this.props.keyDinamico}
                        value={this.props.valorInput === ' ' ? '' : this.props.term}
                        onChange={this.onInputChange}
                        className={this.state.formmessage}
                        style={this.state.style}
                        placeholder="message"
                    ></input>

                </div>

            );
        }
        else if (this.props.consultaPregunta[this.props.consultaPreguntaControl].tipoPregunta === '1') {


            ///Lista de opciones normales sin graficos
            const texto = this.props.consultaPregunta[this.props.consultaPreguntaControl].opciones.replace(/,/g, '|');
            return (<React.Fragment>
                <input
                    value={this.props.valorInput === ' ' || this.props.valorInput === 'x' ? '' : this.props.term}
                    onChange={this.onInputChange}
                    pattern={texto}
                    list='opciones' placeholder='Escoge una Opcion...'
                    className={this.state.formmessage}
                    style={this.state.style}
                //   rows={10}
                //   cols={30}

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
                    className={this.state.formmessage}
                    style={this.state.style}
                //   rows={10}
                //    cols={30}

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
                    className={this.state.formmessage}
                    style={this.state.style}
                //  rows={10}
                //  cols={30}

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
                    className={this.state.formmessage}
                    style={this.state.style}
                //   rows={10}
                //   cols={30}

                />
                <datalist id='opciones'>
                    {this.renderConstruir()}
                </datalist>
            </React.Fragment>);
        }
        else if (this.props.consultaPregunta[this.props.consultaPreguntaControl].tipoPregunta === '7') {
            this.renderOpcionesDB()
            return (<React.Fragment>
                <input
                    value={this.props.valorInput === ' ' ? '' : this.props.term}
                    onChange={this.onInputChange}
                    list='opciones' placeholder='Escoge una Opcion...'
                    className={this.state.formmessage}
                    style={this.state.style}
                />
                {this.renderOpcionesDB4()}

            </React.Fragment >);
        }
        else if (this.props.consultaPregunta[this.props.consultaPreguntaControl].tipoPregunta === '8') {
            //Crea una lista con diferentes imagenes  con seleccion unica
            this.renderOpcionesImage();
            return (
                <Dropdown
                    style={{ position: 'fixed', top: '82%', width: '90%', left: '-0.5px', height: '7.5%' }}
                    placeholder='Select Friend'
                    fluid
                    // search
                    selection
                    clearable
                    pointing="bottom"
                    direction="left"
                    onChange={(e, { value }) => {
                        console.log(value);
                        this.onInputChange(e, value)
                    }}
                    value={this.state.term}
                    options={tagOptions}
                />
            );
        }
        else if (this.props.consultaPregunta[this.props.consultaPreguntaControl].tipoPregunta === '9') {
            //Crea una lista con diferentes imagenes  con seleccion multiple
            this.renderOpcionesDB(); //obtiene la informacion de la base de datos
            this.renderOpcionesDBMultiple(); //organiza la informacion  en el arreglo
            //filtro/detalle/
            return (
                <Dropdown
                    placeholder='Select Friend'
                    fluid
                    search
                    multiple
                    selection
                    clearable
                    pointing="bottom"
                    openOnFocus={true}
                    direction="left"
                    onChange={(e, { value }) => {
                        this.onInputChange(e, value)
                    }}
                    style={{ position: 'fixed', top: '82%', width: '90%', left: '-0.5px', height: '7.5%', 'font-size': 'xx-small' }}

                    value={this.state.term}
                    options={tagOptions}
                />
            );
        }

    }



    onInputChange = (event, value = null) => {

        if (!event) {
            this.setState({ term: '' });
        }
        else {
            if (value) {
                this.props.valorInputs(value);
                this.setState({ term: value });
            }
            else {
                this.props.valorInputs(event.target.value);
                this.setState({ term: this.props.valorInput });
            }
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
                    this.handleMensaje(result, this.props.user.activeChat.chatID, this.props.idChatUser);


                });
            }
        }
    }

    componentDidMount() {
        this.props.pregFantasmas(null);
        const y = window.screen.height * 0.39;
        let mensajeY = {
            position: 'fixed',
            top: '82%',
            width: '90%',
        }

        if (window.screen.width > 500 && window.screen.height < 800) {
            mensajeY.top = '80%';
        }


        if (window.screen.width < 500) {
            mensajeY.top = '78%';
            this.setState({ formmessage: 'message-input-chX1' })
        }
        this.setState({ style: mensajeY })
    }

    render() {

        return (
            <div>

                <div className="field"  >
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
        equipoConsulta: state.chatReducer.equipoConsulta,
        consultax: state.chatReducer.consultax,
        pregFantasma: state.chatReducer.pregFantasma,
        mensajeEnt: state.chatReducer.mensajeEnt,
        consultaPreguntaControl: state.chatReducer.consultaPreguntaControl,
        valorInput: state.chatReducer.valorInput,
        numeroPregunta: state.chatReducer.numeroPregunta,
        consultaPregunta: state.chatReducer.consultaPregunta,
        idChatUser: state.chatReducer.idChatUser,
        nombreUser: state.chatReducer.nombreUser,
        user: state.user

    });


export default connect(mapAppStateToProps, { valorInputs, consultaPreguntaControls, pregFantasmas, submitMessage, mensajeEntradas, numeroPreguntas, consultas })(boxDinaminco);