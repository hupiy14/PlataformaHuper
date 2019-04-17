import React from 'react';
import { Button, Form, Icon, Modal, Segment, Input, Dimmer, Loader, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { inputDinamicos } from './chatBot/actions';
import { slackApis } from '../../actions/index';
import { signOut, usuarioDetails } from '../../actions';
import history from '../../history';
import firebase from 'firebase';

//input dinamico
import InputDinamico from './inputDinamico';
import { object } from 'prop-types';







class newFlowWork extends React.Component {

    state = { inputs: [], idInput: 0 }

    componentDidMount() {

        if (!this.props.usuarioDetail) {
            history.push('/dashboard');
            return;
        }

        this.props.inputDinamicos([]);
        this.setState({ inputs: [...this.state.inputs, { label: 'Empieza en', id: this.state.idInput }] });
        this.setState({ idInput: this.state.idInput + 1 });

        const nameRef2 = firebase.database().ref().child(`Usuario-Flujo-Trabajo/${this.props.usuarioDetail.idUsuario}`);
        nameRef2.on('value', (snapshot2) => {
            if (snapshot2.val()) {
                const listaX = snapshot2.val().fases;
                let nuevoLista = [];
                Object.keys(listaX).map(function (key, index) {
                    let label = 'Continuar con';
                    if (key === '0')
                        label = 'Empezar en';

                    nuevoLista = [...nuevoLista, { label, valor: listaX[key].label, id: key }];
                });


                this.props.inputDinamicos(nuevoLista);
                this.setState({ inputs: nuevoLista });
                this.setState({ idInput: nuevoLista.length })
            }
        });

    }

    renderBorrarDato(objetoborrar) {
        let listaX = this.state.inputs;
        if (!listaX)
            return;

        let contador = 0;
        let contadorBuscar = null;

        Object.keys(listaX).map(function (key, index) {
            if (listaX[key].id === objetoborrar.toString()) {
                contadorBuscar = contador;
            }
            contador++;
        });


        listaX = this.props.inputdinamico;
        let nuevoListaProps = [];

        Object.keys(listaX).map(function (key, index) {

            if (contadorBuscar.toString() !== key) {
                nuevoListaProps = [...nuevoListaProps, { ...listaX[key] }];
            }
        });

        this.props.inputDinamicos(nuevoListaProps);
        this.setState({ inputs: nuevoListaProps });

        return;

    }

    renderInputs(the) {
        const listaX = this.state.inputs;
        if (!listaX)
            return;

        const opciones = Object.keys(listaX).map(function (key, index) {
            let bt = null;
            if (key > 0)
                bt = <Button icon="trash alternate outline" circular color="teal" size="medium" style={{
                    left: '20%',
                    position: 'relative'
                }} onClick={() => { the.renderBorrarDato(listaX[key].id) }}></Button>

            return (<div>
                <InputDinamico labelDinamico={listaX[key].label} valorInputDinamico={listaX[key].valor ? listaX[key].valor : null} keyDinamico={listaX[key].id} />
                {bt}
                <br />
                <br />
            </div>
            );
        });
        return opciones;
    }

    renderAgregarNuevoInput() {
        this.setState({ inputs: [...this.state.inputs, { label: 'Continua con', id: this.state.idInput }] });
        this.setState({ idInput: this.state.idInput + 1 });
    }

    renderGuardarFlujo() {

        const fases = Object.keys(this.props.inputdinamico).length;

        const listaX = this.props.inputdinamico;
        let nuevoLista = [];
        const colorFases = ['rgba(2, 245, 211, 0.92)', 'rgb(0, 255, 196)', 'rgb(0, 253, 148)', '#19ec21e8', 'rgba(244, 251, 71, 0.91)', 'rgba(220, 236, 14, 0.9)', 'rgb(246, 164, 28)', 'rgba(249, 96, 7, 0.87)', 'rgba(247, 60, 1, 0.97)', 'rgba(241, 4, 4, 0.79)', '#ad0eceed'];
        let contador = 0;
        if (!listaX)
            return;
        let aumento = Math.round(colorFases.length / listaX.length); 
        if (listaX.length > colorFases.length)
            aumento = 1;
        Object.keys(listaX).map(function (key, index) {
           
            console.log(listaX[key].valor);
            nuevoLista = [...nuevoLista, { label: listaX[key].valor, color: colorFases[contador] }];
            contador = contador + aumento;
            
            if (contador > colorFases.length - 1)
            contador = 0;

        });

        firebase.database().ref(`Usuario-Flujo-Trabajo/${this.props.usuarioDetail.idUsuario}`).set({
            fechaCreado: new Date().toString(),
            cantidadFases: fases,
            fases: nuevoLista,
        });
    }

    render() {

        return (

            <Form style={{
                'margin-left': '10%',
                background: 'rgba(253, 242, 208, 0.26)',
                width: '50%', 'border-radius': '20px',
            }} >
                <br />
                <div className=" center menu">
                    <h3 style={{ 'margin-left': '50px' }}>Describe el flujo de trabajo de tus actividades</h3>
                    {this.renderInputs(this)}
                    <Button icon="plus" circular color="purple" size="medium" style={{
                        top: '-30px',
                        left: '90%',
                        position: 'relative'
                    }} onClick={() => { this.renderAgregarNuevoInput() }}></Button>
                </div>

                <br />
                <Button content="Guardar" icon="save" color="teal" style={{
                    top: '-40px',
                    left: '40%',
                    position: 'relative'
                }} onClick={() => { this.renderGuardarFlujo(); }}></Button>
            </Form>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        inputdinamico: state.chatReducer.inputdinamico,
        usuarioDetail: state.chatReducer.usuarioDetail,
    };
};

export default connect(mapStateToProps, { inputDinamicos })(newFlowWork);