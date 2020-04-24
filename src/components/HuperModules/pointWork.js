import React from 'react';
import { Button, Form, Icon, Modal, Segment, Input, Dimmer, Loader, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { VerticalTimelineElement, VerticalTimeline } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import history from '../../history';
import firebase from 'firebase';

class pointWork extends React.Component {


    state = { point: null, tituloFase: null, detalleFase: null, inputFase: null }

    componentDidMount() {

        if (!this.props.usuarioDetail) {
            history.push('/dashboard');
            return;
        }

        const nameRef2 = firebase.database().ref().child(`Usuario-Flujo-Trabajo/${this.props.usuarioDetail.idUsuario}`);
        nameRef2.on('value', (snapshot2) => {
            if (snapshot2.val()) {
                const listaX = snapshot2.val().fases;
                this.setState({ inputFase: listaX });
            }
        });

    }

    renderguardarFase() {

        const fases = Object.keys(this.state.inputFase).length + 1;
        const listaX = this.state.inputFase;
        if (!listaX)
            return;
        listaX.push({ titulo: this.state.tituloFase, detalle: this.state.detalleFase, id: fases });
        firebase.database().ref(`Usuario-Flujo-Trabajo/${this.props.usuarioDetail.idUsuario}`).set({
            fechaCreado: new Date().toString(),
            cantidadFases: fases,
            fases: listaX,
        });
        this.setState({tituloFase: ""});
        this.setState({detalleFase: ""});
    }


    renderEliminarFase(ind){

        const listaX = this.state.inputFase;
        listaX.splice(ind, 1);
        const fases = Object.keys(listaX).length + 1;
        firebase.database().ref(`Usuario-Flujo-Trabajo/${this.props.usuarioDetail.idUsuario}`).set({
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
                icon={<div style={{ left: '20%', position: 'relative', top: '25%' }}>
                    <Icon name="thumbtack" size="big" />
                </div>
                }
            >
                <h3 className="vertical-timeline-element-title">{titulo}</h3>
                <h4 className="vertical-timeline-element-subtitle">{detalle}</h4>
            </VerticalTimelineElement>
            <Icon name="cancel" size="big" onClick={()=>{this.renderEliminarFase(0)}} style={{ position: 'relative', left: '50%', top: '-100px' }} />
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
                    <div style={{ left: '20%', position: 'relative', top: '25%' }}>
                        <Icon name="thumbtack" size="big" />
                    </div>}
            >
                <h3 className="vertical-timeline-element-title">{titulo}</h3>
                <h4 className="vertical-timeline-element-subtitle">{detalle}</h4>
            </VerticalTimelineElement>
            <Icon name="cancel" size="big" onClick={()=>{this.renderEliminarFase(item)}} style={{ position: 'relative', left: '50%', top: '-100px' }} />
        </div>;
    }


renderCrearFases(){

    const listaX = this.state.inputFase;
    if (!listaX)
    return;
    let mapFases = [];
      Object.keys(listaX).map( (key, index) => {
          if(index === 0)
          {
            mapFases.push(this.renderCrearComponentInicial((index + 1) + " fase", listaX[key].titulo, listaX[key].detalle));
          }
          else{
            mapFases.push(this.renderCrearComponenteNormal((index + 1) + " fase", listaX[key].titulo, listaX[key].detalle, index));
          }
          
    });
    mapFases.push( this.renderCrearComponenteFin());
    return mapFases;
}

    renderCrearComponenteFin() {

        return <div style={{ height: '12em' }}>
            <VerticalTimelineElement
                iconStyle={{ background: '#b5cc18', color: '#fff' }}
                icon={<div style={{ left: '20%', position: 'relative', top: '25%' }}>
                    <Icon name="trophy" size="big" />
                </div>
                }
            />
        </div>;
    }

    render() {


        return (
            <div >
                <h1 style={{ position: 'relative', left: '30%' }}>El flujo de trabajo para tus objetivos</h1>
                <VerticalTimeline>
                   {this.renderCrearFases()}
                </VerticalTimeline>
                <Form style={{ width: '50%', left: '25%', position: 'relative', top: '-100px' }}>

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
                <Button icon='save' disabled={this.state.activo} style={{ color: 'white', left: '52%', top: '-100px', background: 'linear-gradient(to right, #fe10bd 20%, #f0bbe1 50% ,#fe10bd 100%)' }} labelPosition='right' content='Agregar un nuevo fase' onClick={() => { this.renderguardarFase() }} />

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

export default connect(mapStateToProps, {})(pointWork);