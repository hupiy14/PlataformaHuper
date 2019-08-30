import React from 'react';
import {
    valorInputs,
    consultaPreguntaControls,
    submitMessage,
    mensajeEntradas,
    numeroPreguntas,
    consultas,
    ValorTextos,
    pregFantasmas,
    inputSlacks,
} from './actions';
import { connect } from 'react-redux';
import _ from 'lodash';
import firebase from 'firebase';
import randon from '../../../lib/randonImage';
import { Emoji } from 'emoji-mart';
import { Image, Dropdown, Input } from 'semantic-ui-react';




let tagOptions = [];


let timelength = 700;

class boxDinaminco extends React.Component {

    state = { term: '', flag: false, consultaY: null, nPreg: null, formmessage: 'message-input-ch', style: {} };

    renderConstruir() {
        let x = 0;
        //  console.log(this.props.user.userChats[0].thread[6]);
        if (!this.props.user.userChats[0].thread[6]) return;
        if (this.props.user.userChats[0].thread[6].text === 'Importancia') {
            const opciones = this.props.consultaPregunta[this.props.consultaPreguntaControl].opciones3.split(',').map((consulta) => {
                //  console.log(consulta);
                x++;
                return (
                    <option value={consulta} key={x} />
                );
            });

            return opciones;
        }
        else if (this.props.user.userChats[0].thread[6].text === 'Tiempo Estimado') {
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
                text: values.split('☼').length > 1 ? values.split('☼')[0] : values,
                value: values.split('☼').length > 1 ? values.split('☼')[1] : values,


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
        if (!this.props.consultax && this.state.nPreg !== this.props.consultaPreguntaControl) {
            let complemento = this.props.userId;
            if (this.props.consultaPregunta[this.props.consultaPreguntaControl].filtro)
                complemento = `${this.props.usuarioDetail.usuario.empresa}/${this.props.usuarioDetail.usuario.equipo}`

            const starCountRef = firebase.database().ref().child(`${this.props.consultaPregunta[this.props.consultaPreguntaControl].opciones}/${complemento}`);
            starCountRef.on('value', (snapshot) => {
                this.props.consultas(snapshot.val());
                this.setState({ consultaY: snapshot.val() });
                this.setState({ nPreg: this.props.consultaPreguntaControl });
            });
        }

    }



    renderOpcionesDB4() {

        if (this.props.consultax) {
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
            const cconsulta = this.props.equipoConsulta.listaPersonas;
            const usuario = this.props.userId;
            const consultaW = this.state.consultaY;
            if (consultaW) {
                Object.keys(consultaW).map((keyW, index) => {

                    Object.keys(cconsulta).map((key, index) => {
                        if (keyW !== key)
                            return;
                        if (usuario === key)
                            return;
                        if (cconsulta[key].Rol === '2')
                            return;

                        tagOptions = [...tagOptions, {
                            key: x,
                            icon: iconO,
                            value: cconsulta[key].usuario.split('☼').length > 1 ? cconsulta[key].usuario.split('☼')[1] : cconsulta[key].usuario,
                            text: cconsulta[key].usuario.split('☼').length > 1 ? cconsulta[key].usuario.split('☼')[0] : cconsulta[key].usuario,

                        }]

                    });
                });
            }
        }

        else if (this.props.consultax) {
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
                                text: ccconsulta[key].concepto.split('☼').length > 1 ? ccconsulta[key].concepto.split('☼')[0] : ccconsulta[key].concepto,
                                value: ccconsulta[key].concepto.split('☼').length > 1 ? ccconsulta[key].concepto.split('☼')[1] : ccconsulta[key].concepto,
                            }]
                        }
                    });
                }
                else if (cconsulta[key].estado === 'activo') {
                    tagOptions = [...tagOptions,
                    {
                        key: key,
                        icon: iconO,
                        text: cconsulta[key].concepto.split('☼').length > 1 ? cconsulta[key].concepto.split('☼')[0] : cconsulta[key].concepto,
                        value: cconsulta[key].concepto.split('☼').length > 1 ? cconsulta[key].concepto.split('☼')[1] : cconsulta[key].concepto,
                    }]
                }
            });
        }

    }


    renderOpcionesDB2() {

        if (this.props.equipoConsulta) {
            console.log(this.props.equipoConsulta);
            let x = 0;

            const cconsulta = this.props.equipoConsulta.listaPersonas;
            const usuario = this.props.userId;
            const consultaW = this.state.consultaY;
            if (consultaW) {
                const opciones2 = Object.keys(consultaW).map((keyW, index) => {

                    const opciones = Object.keys(cconsulta).map((key, index) => {
                        if (keyW !== key)
                            return;
                        if (usuario === key)
                            return;

                        return (
                            <option value={cconsulta[key].usuario} key={key} />
                        );
                    });
                    return opciones;
                });

                return (
                    <datalist id='opciones'>
                        {opciones2}
                    </datalist>
                );
            }
        }


        else if (this.props.consultax) {
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
            opciones.push(<option value={'Ninguno'} key={100} />)

            return (
                <datalist id='opciones'>
                    {opciones}
                </datalist>
            );
        }


    }

    renderOpcionesDB3() {
        if (this.props.consultax) {

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


        if (!this.props.consultaPregunta || this.props.inputSlack === true) {

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
            const messages = document.getElementById('chatInt');


            return (


                <div class="ui labeled input" style={{ 'margin-left': '20px' }}>
                    <div class="ui label" className={this.state.formmessage}



                        style={{
                            visibility: this.props.consultaPregunta[this.props.consultaPreguntaControl].label ? 'visible' : 'hidden', background: '#ffbb006e',

                            top: !messages ? '565px' : messages.offsetHeight * 0.87, left: '-10px', 'z-index': 5, 'border-radius': '20px 20px 20px 5px', width: '70%'
                        }}>
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
                    list='opciones' placeholder='Escoge una Opcion...'
                    className={this.state.formmessage}
                    style={this.state.style}
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
            //no ha cargado el ultimo dato del chat

            if (!this.props.user.userChats[0].thread[6]) return;
            let texto;
            if (this.props.user.userChats[0].thread[6].text === 'Importancia') {

                texto = this.props.consultaPregunta[this.props.consultaPreguntaControl].opciones3.replace(/,/g, '|');
            }
            else if (this.props.user.userChats[0].thread[6].text === 'Tiempo Estimado') {
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
                <div style={{ overflow: 'auto' }}>
                    <Dropdown
                        style={{ position: 'fixed', top: '92%', width: '80%', 'z-index': '100', height: '41px', 'border-radius': '20px' }}

                        placeholder='Select Friend'
                        fluid
                        // search
                        selection
                        clearable
                        pointing="bottom"
                        direction="left"
                        onChange={(e, { value }) => {

                            let text = null;
                            Object.keys(tagOptions).map((key, index) => {
                                if (tagOptions[key].value === value) {
                                    text = tagOptions[key].text;
                                }
                            });

                            const arr = this.props.ValorTexto;
                            arr[value.substring(0, 3)] = { value, text };
                            this.props.ValorTextos(arr);
                            this.onInputChange(e, value, text)
                        }}
                        value={this.state.term}
                        options={tagOptions}
                    />
                </div>
            );
        }
        else if (this.props.consultaPregunta[this.props.consultaPreguntaControl].tipoPregunta === '9') {
            //Crea una lista con diferentes imagenes  con seleccion multiple
            this.renderOpcionesDB(); //obtiene la informacion de la base de datos
            this.renderOpcionesDBMultiple(); //organiza la informacion  en el arreglo
            //filtro/detalle/
            return (
                <div style={{ overflow: 'auto' }}>
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
                        style={{ position: 'fixed', top: '92%', width: '80%', 'z-index': '100', height: '41px', 'border-radius': '20px' }}

                        value={this.state.term}
                        options={tagOptions}
                    />
                </div>

            );
        }

    }



    onInputChange = (event, value = null, text = null) => {

        if (!event) {
            this.setState({ term: '' });
        }
        else {


            if (value) {
                this.props.valorInputs({ value, text });
                this.setState({ term: value });
            }
            else {
                this.props.valorInputs({ value: event.target.value, text });
                this.setState({ term: this.props.valorInput });
            }
        }

    };


    renderMensajeSalida() {
        if (this.state.flag) {
            if (this.props.consultaPreguntaControl === 1) { this.setState({ flag: false }); }
            else {
                this.setState({ flag: null });
                const x = Math.round(Math.random() * (2)) + 1;
                const nameRef2 = firebase.database().ref().child('Mensaje-ChatBot').child(`Despedida/${x}`);
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
            top: '92%',
            width: '85%',
            left: '5px',
            'border-radius': '20px',
            'z-index': '100',
        }

        if (window.screen.width > 500 && window.screen.height < 800) {
            //  mensajeY.top = '80%';
        }


        if (window.screen.width < 500) {
            //  mensajeY.top = '78%';
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
        ValorTexto: state.chatReducer.ValorTexto,
        inputSlack: state.chatReducer.inputSlack,
        usuarioDetail: state.chatReducer.usuarioDetail,
        user: state.user

    });


export default connect(mapAppStateToProps, { valorInputs, consultaPreguntaControls, pregFantasmas, ValorTextos, submitMessage, mensajeEntradas, numeroPreguntas, consultas, inputSlacks })(boxDinaminco);