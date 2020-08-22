import React from 'react';
import { Form, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { VerticalTimelineElement, VerticalTimeline } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import history from '../../history';
import { popupBot } from '../../actions';
import { dataBaseManager } from '../../lib/utils';

class pointWork extends React.Component {


    state = { point: null, tituloFase: null, detalleFase: null, inputFase: null }

    componentDidMount() {

        if (!this.props.usuarioDetail) {
            history.push('/dashboard');
            return;
        }

        const nameRef2 = this.componentDatabase('get', `Usuario-Flujo-Trabajo/${this.props.usuarioDetail.idUsuario}`);
        nameRef2.on('value', (snapshot2) => {
            if (snapshot2.val()) {
                const listaX = snapshot2.val().fases;
                this.setState({ inputFase: listaX });
            }
        });

    }
    componentDatabase(tipo, path, objectIn, mensaje, mensajeError) {
        let men = dataBaseManager(tipo, path, objectIn, mensaje, mensajeError);
        if (men && men.mensaje)
            this.props.popupBot({ mensaje: men.mensaje });
        return men;
    }

    renderguardarFase() {
        let listaX = this.state.inputFase;
        if (!listaX)
            listaX = [];
        const fases = Object.keys(listaX).length + 1;

        listaX.push({ titulo: this.state.tituloFase, detalle: this.state.detalleFase, id: fases });
        this.componentDatabase('insert', `Usuario-Flujo-Trabajo/${this.props.usuarioDetail.idUsuario}`, {
            fechaCreado: new Date().toString(),
            cantidadFases: fases,
            fases: listaX,
        });
        this.setState({ tituloFase: "" });
        this.setState({ detalleFase: "" });
    }


    renderEliminarFase(ind) {

        const listaX = this.state.inputFase;
        listaX.splice(ind, 1);
        const fases = Object.keys(listaX).length + 1;
        this.componentDatabase('insert', `Usuario-Flujo-Trabajo/${this.props.usuarioDetail.idUsuario}`, {
            fechaCreado: new Date().toString(),
            cantidadFases: fases,
            fases: listaX,
        });

    }

    renderCrearComponentInicial(nombre, titulo, detalle) {

        return <div style={{ height: '12em' }}>
            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                contentStyle={{ background: '#e03997', color: '#fff' }}
                contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                date={nombre}
                iconStyle={{ background: '#e03997', color: '#fff' }}
                icon={<div style={{ position: 'relative', top: '25%' }}>
                    <Icon name="thumbtack" size="big" />
                </div>
                }
            >
                <h3 className="vertical-timeline-element-title">{titulo}</h3>
                <h4 className="vertical-timeline-element-subtitle">{detalle}</h4>
            </VerticalTimelineElement>
            <Icon name="cancel" size="big" onClick={() => { this.renderEliminarFase(0) }} style={{ position: 'relative', left: '50%', top: '-7.2em' }} />
        </div>
            ;
    }

    renderCrearComponenteNormal(nombre, titulo, detalle, item) {

        return <div style={{ height: '12em' }}>
            <VerticalTimelineElement
                position={item % 2 === 1 ? "right" : "left"}
                className="vertical-timeline-element--work"
                date={nombre}
                iconStyle={{ background: '#e03997', color: '#fff' }}
                icon={
                    <div style={{ position: 'relative', top: '25%' }}>
                        <Icon name="thumbtack" size="big" />
                    </div>}
            >
                <h3 className="vertical-timeline-element-title">{titulo}</h3>
                <h4 className="vertical-timeline-element-subtitle">{detalle}</h4>
            </VerticalTimelineElement>
            <Icon name="cancel" size="big" onClick={() => { this.renderEliminarFase(item) }} style={{ position: 'relative', left: '50%', top: '-7.2em' }} />
        </div>;
    }


    renderCrearFases() {

        let listaX = this.state.inputFase;
        if (!listaX)
            listaX = [];
        let mapFases = [];
        Object.keys(listaX).map((key, index) => {
            if (index === 0) {
                mapFases.push(this.renderCrearComponentInicial((index + 1) + " fase", listaX[key].titulo, listaX[key].detalle));
            }
            else {
                mapFases.push(this.renderCrearComponenteNormal((index + 1) + " fase", listaX[key].titulo, listaX[key].detalle, index));
            }
            return listaX[key];
        });
        mapFases.push(this.renderCrearComponenteFin());
        return mapFases;
    }

    renderCrearComponenteFin() {

        return <div style={{ height: '12em', key: 15 }}>
            <VerticalTimelineElement
                iconStyle={{ background: '#b5cc18', color: '#fff' }}
                icon={<div style={{ position: 'relative', top: '25%' }}>
                    <Icon name="trophy" size="big" />
                </div>
                }
            />
        </div>;
    }

    render() {


        return (
            <div style={{ overflow: 'auto', height: window.innerHeight * 0.7 }}>
                <h1 style={{ position: 'relative', left: '2%' }}>El flujo de trabajo para tus objetivos</h1>
                <VerticalTimeline>
                    {this.renderCrearFases()}
                </VerticalTimeline>
                <Form style={{ width: '50%', left: '25%', position: 'relative', top: '1.2em' }}>

                    <Form.Input label='El nombre de la fase es' placeholder='Primer contacto con...'
                        value={this.state.tituloFase}
                        onChange={e => this.setState({ tituloFase: e.target.value })}
                    />
                    <Form.Input label='Una descripcion sencilla es'
                        value={this.state.detalleFase}
                        onChange={e => this.setState({ detalleFase: e.target.value })}
                    />

                </Form>
                <br />
                <br />
                <button disabled={!this.state.tituloFase}
                    onClick={() => { this.renderguardarFase() }} className="ui pink button inverted " style={{ left: "10%" }}>
                    <i class="save icon"></i>
                Agregar un nuevo fase
                            </button>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        inputdinamico: state.chatReducer.inputdinamico,
        usuarioDetail: state.chatReducer.usuarioDetail,
    };
};

export default connect(mapStateToProps, { popupBot })(pointWork);