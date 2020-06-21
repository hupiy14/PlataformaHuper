import React from 'react';
import { connect } from 'react-redux';
import { inputDinamicos } from './chatBot/actions';




class InputDinamico extends React.Component {

    state = { inputDinamicoState: null, valorAnterior: null }
    componentDidMount() {
        this.setState({ inputDinamicoState: this.props.valorInputDinamico });
    }

    renderInput(id, valor, label) {

        let listaX = this.props.inputdinamico;
        let listaNew = [];
        if (listaX) {
            Object.keys(listaX).map((key, index) => {
                if (listaX[key].id.toString() !== id) {
                    listaNew = [...listaNew, listaX[key]];
                }
                return listaX[key];
            });
            this.props.inputDinamicos([...listaNew, { id, valor, label }]);
        }
    }

    componentDidUpdate() {
        if (this.props.valorInputDinamico !== this.state.valorAnterior) {
            this.setState({ valorAnterior: this.props.valorInputDinamico });
            this.setState({ inputDinamicoState: this.props.valorInputDinamico });

        }
    }


    render() {
        return (

            <div class="ui labeled input" >
                <div class="ui label" style={{ background: 'linear-gradient(to right, rgb(255, 241, 217) 40%, rgba(243, 130, 38, 0.97) 150%)', 'border-radius': '5px' }}>
                    {this.props.labelDinamico + " ..."}
                </div>
                <input type="text" style={{ 'border-radius': '5px', width: '40%' }} placeholder="Contacto, Diseño o Investigación" key={this.props.keyDinamico}

                    value={this.state.inputDinamicoState}
                    onChange={e => { this.renderInput(this.props.keyDinamico.toString(), e.target.value, this.props.labelDinamico); this.setState({ inputDinamicoState: e.target.value }) }} />


            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        inputdinamico: state.chatReducer.inputdinamico,
    };
};

export default connect(mapStateToProps, { inputDinamicos })(InputDinamico);