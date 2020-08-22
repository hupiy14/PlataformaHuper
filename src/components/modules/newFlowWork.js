import React from 'react';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { inputDinamicos } from './chatBot/actions';
import history from '../../history';
import InputDinamico from './inputDinamico';
import { VerticalTimeline } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { dataBaseManager } from '../../lib/utils';
import { popupBot } from '../../actions';

class newFlowWork extends React.Component {


    state = { inputs: [], idInput: 0, objetosF: null }

    componentDatabase(tipo, path, objectIn, mensaje, mensajeError) {
        let men = dataBaseManager(tipo, path, objectIn, mensaje, mensajeError);
        if (men && men.mensaje)
            this.props.popupBot({ mensaje: men.mensaje });
        return men;
    }

    componentDidMount() {

        if (!this.props.usuarioDetail) {
            history.push('/dashboard');
            return;
        }


        this.setState({
            objetosF: <VerticalTimeline>
                <pointW nombreFase="primera etapa" tipofase="0" tituloFase=" trabajo con clientes" detalleFase="primer contacto con los clientes en sus trabajos" />
                <pointW nombreFase="segunda etapa" tipofase="1" tituloFase=" trabajo con clientes" detalleFase="primer contacto con los clientes en sus trabajos" />
                <pointW nombreFase="tercera etapa" tipofase="1" tituloFase=" trabajo con clientes" detalleFase="primer contacto con los clientes en sus trabajos" />

            </VerticalTimeline>
        })

        this.props.inputDinamicos([]);
        this.setState({ inputs: [...this.state.inputs, { label: 'Empieza en', id: this.state.idInput }] });
        this.setState({ idInput: this.state.idInput + 1 });

        const nameRef2 = this.componentDatabase('get', `Usuario-Flujo-Trabajo/${this.props.usuarioDetail.idUsuario}`);
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
                bt = <Button icon="trash alternate outline" circular size="medium" style={{
                    background: 'linear-gradient(to top, rgb(247, 203, 122) 0.5%, rgb(255, 255, 255) 0.6%, rgb(245, 242, 224) 200%)',
                    left: '-20%',
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

        this.componentDatabase('insert', `Usuario-Flujo-Trabajo/${this.props.usuarioDetail.idUsuario}`, {
            fechaCreado: new Date().toString(),
            cantidadFases: fases,
            fases: nuevoLista,
        });
    }

    render() {

        return (
            this.state.objetosF

        );
    }

}

const mapStateToProps = (state) => {
    return {
        inputdinamico: state.chatReducer.inputdinamico,
        usuarioDetail: state.chatReducer.usuarioDetail,
    };
};

export default connect(mapStateToProps, { inputDinamicos, popupBot })(newFlowWork);