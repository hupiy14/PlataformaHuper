import React from 'react';
import { Button, Form} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { inputDinamicos } from '../modules/chatBot/actions';

import history from '../../history';
import firebase from 'firebase';

//input dinamico
import InputDinamico from '../modules/inputDinamico';


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

            if (contadorBuscar) {
                if (contadorBuscar.toString() !== key) {
                    nuevoListaProps = [...nuevoListaProps, { ...listaX[key] }];
                }
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
                bt = <Button icon="trash alternate outline" circular  size="medium" style={{
                    left: '2%',
                    background: 'linear-gradient(to top, rgb(247, 203, 122) 0.5%, rgb(255, 255, 255) 0.6%, rgb(245, 242, 224) 200%)',
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
        const colorFases = ['#FFFDE7', '#FFF9C4', '#FFF59D', '#FFF176', '#FFEE58', '#FFEB3B', '#FDD835', '#FBC02D', '#F9A825', '#F57F17', '#FFD600'];
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
                'text-align': 'center',
                background: 'linear-gradient(to top, rgb(247, 203, 122) 0.5%, rgb(255, 255, 255) 0.6%, rgb(245, 242, 224) 200%)',
                'border-radius': '20px',
            }} >
                <br />
                <div className=" center menu">
                    <h3 style={{'text-align': 'center' }}>Describe el flujo de trabajo de tus actividades</h3>
                    {this.renderInputs(this)}
                    <Button icon="plus" circular  size="medium" style={{
                        top: '-5px',
                        left: '40%',
                        background: 'linear-gradient(to top, rgb(247, 203, 122) 0.5%, rgb(255, 255, 255) 70.6%, rgb(236, 206, 31) 200%)',
                        transform: 'scale(1.3)',
                        position: 'relative'
                    }} onClick={() => { this.renderAgregarNuevoInput() }}></Button>
                </div>

                <br />
                <Button content="Guardar" icon="save"  style={{
                    top: '-40px',
                    position: 'relative',
                    background: 'linear-gradient(to right, rgb(239, 163, 26) 10%, rgb(243, 130, 38) 80%)'
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