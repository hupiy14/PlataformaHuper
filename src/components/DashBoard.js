import React from 'react';
import { connect } from 'react-redux';
import { createStream, chatOff, chatOn } from '../actions';
import ListImportan from './utilidades/listaImportante';
import ListEjemplo from './utilidades/ListaEjemplo';
import Calendario2 from './utilidades/calendar2';
import CrearGrafica from './utilidades/CrearGrafica';
import './styles/ingresoHupity.css';
import randomScalingFactor from '../lib/randomScalingFactor';
import { Line } from 'react-chartjs-2';
import ListaActividades from './HuperModules/actividadesHuper';
import DashGestor from './gestorModules/dashGestor';
import Hupps from './modules/Hupps';
import firebase from 'firebase';

import Avatar from '../apis/xpress';




import { Grid, Modal, Menu, Segment, Button, Dimmer, Header, Icon, Image, Portal, Step, Label, Checkbox } from 'semantic-ui-react';
import MenuChat from './MenuChat';
import { pasoOnboardings, listaFormaciones } from './modules/chatBot/actions';
import { object } from 'prop-types';
const timeoutLength = 1800;
const timeoutLength2 = 2000;
const timeoutLength3 = 100000;
const timeoutLength4 = 500;
const timeoutLength5 = 5000;







const labelsDias = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado"
];

const labelsMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July"
];


const datosG1 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];
const datosG11 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];
const datosG111 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];
const datosG2 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];
const datosG22 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];
const datosG222 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];
const datosG3 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];
const datosG33 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];
const datosG333 = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];


class DashBoard extends React.Component {

    state = {
        activeItem: 'semana',
        avatares: null,
        activo: null,
        activo2: true,
        pasoActivo: null,
        pasoActivof: 1,
        comenzo: false,
        estadoCel: false,
        grafica: null,
        checked: false,
        open: false,
        open2: false,
        open3: false,

    }



    handleOpenMenu = () => {
        this.setState({ open: true })
    }

    handleOpenMenu2 = () => {
        this.setState({ open2: true })
    }

    handleOpenMenu3 = () => {
        this.setState({ open3: true })
    }
    handleCloseMenu = () => {
        this.setState({ open: false })
        this.setState({ open2: false })
        this.setState({ open3: false })
    }






    onSearchXpress = async (buscar) => {
        const response = await Avatar.get('/xpresso/v1/search', {
            params: {
                apiKey: '6hSjEEYWVHTmSUUwvwjJzTpX8_zq8noEYq2-_r5ABnkq98vSw1jvHFKncRlYUA-C',
                query: buscar
            },

        });
        //     console.log(response.data);
        this.setState({ avatares: response.data.lowResGifs })

    }

    // habilita el tercer paso
    handlePaso = () => {
        this.timeout = setTimeout(() => {
            this.props.pasoOnboardings(3);
        }, timeoutLength3)
    }


    componentDidMount() {
        this.onSearchXpress("hi");
        let datos = [];
        datos.push({ label: "Planificación de trabajo", data: datosG1, hidden: true, });
        datos.push({ label: "Correccón de trabajo", data: datosG11 });

        this.setState({

            grafica: <div>
                <Checkbox checked={this.state.checked} className="historico-padding" label='Consultar Histórico' onChange={this.handleDimmedChange} toggle />
                <CrearGrafica labelsX={labelsDias}
                    datos={datos}
                    titleGrafica={"Trabajo (Tareas) vs Dias"}
                    numeroGrafica={'2'}
                    maxLen={'140'}
                    TituloGrafica={"Avance Semanal"}
                />
            </div>

        });


      

    }
    renderGestor() {
        return (<DashGestor />);
    }

    handleDimmedChange = (e, { checked }) => {
        console.log(checked);
        this.setState({ valueH: checked });


        if (checked) {
            let datos = [];
            datos.push({ label: "Planificación de trabajo", data: datosG2, hidden: true, });
            datos.push({ label: "Correccón de trabajo", data: datosG22 });

            this.setState({
                grafica: <div>
                    <Checkbox checked={checked} className="historico-padding" label='Consultar Histórico' onChange={this.handleDimmedChange} toggle />
                    <CrearGrafica labelsX={labelsMonths}
                        datos={datos}
                        titleGrafica={"Objetivo vs Meses"}
                        maxLen={'140'}
                        TituloGrafica={"Avance de tu trabajo"}
                    />
                </div>
            })
        }
        else {
            let datos = [];
            datos.push({ label: "Planificación de trabajo", data: datosG1, hidden: true, });
            datos.push({ label: "Correccón de trabajo", data: datosG11 });
            this.setState({
                grafica: <div>
                    <Checkbox checked={checked} className="historico-padding" label='Consultar Histórico' onChange={this.handleDimmedChange} toggle />
                    <CrearGrafica labelsX={labelsDias}
                        datos={datos}
                        titleGrafica={"Trabajo (Actividades) vs Dias"}
                        numeroGrafica={'2'}
                        maxLen={'140'}
                        TituloGrafica={"Avance Semanal"}
                    />
                </div>
            })
        }
    }

    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name })

        if (name === 'semana') {

            let datos = [];
            datos.push({ label: "Planificación de trabajo", data: datosG1, hidden: true, });
            datos.push({ label: "Correccón de trabajo", data: datosG11 });

            const graficaG = <div>
                <Checkbox checked={this.state.valueH} className="historico-padding" label='Consultar Histórico' onChange={this.handleDimmedChange} toggle />
                <CrearGrafica labelsX={labelsDias}
                    datos={datos}
                    titleGrafica={"Trabajo (Actividades) vs Dias"}
                    numeroGrafica={'2'}
                    maxLen={'140'}
                    TituloGrafica={"Avance Semanal"}

                />
            </div>
            this.setState({ grafica: graficaG })
        }

        else if (name === 'MIT') {

            let datos = [];
            datos.push({ label: "Motivacion", data: datosG3, hidden: true, });
            datos.push({ label: "Impacto", data: datosG33 });
            datos.push({ label: "Talento", data: datosG333 });
            const graficaG = <CrearGrafica labelsX={labelsMonths}
                datos={datos}
                titleGrafica={"MIT vs Progreso"}
                maxLen={'140'}
                TituloGrafica={"Motivacion, Impacto, Talento (MIT)"}

            />;
            this.setState({ grafica: graficaG })

        }

    }


    renderProgresoTrabajo() {
        return (<div style={{ width: '100%' }}>
            <Menu pointing secondary>
                <Menu.Item name='semana' active={this.state.activeItem === 'semana'} onClick={this.handleItemClick} />
                <Menu.Item
                    name='MIT'
                    active={this.state.activeItem === 'MIT'}
                    onClick={this.handleItemClick}
                />

            </Menu>

            <Segment attached='bottom'>
                {this.state.grafica}
            </Segment>
        </div>)
    }

    renderListaObjetivos(aling) {

        return (
            <ListImportan
                titulo={'Listado de objetivos'}
                icono={'copy outline'}
                alingD={aling}
            />
        );
    }

    renderListaActividades(aling) {

        return (
            <ListaActividades
                titulo={'Listado de Actividades'}
                icono={'copy outline'}
                alingD={aling}
            />
        );
    }

    renderGraficaTIC() {
        let datos = [];
        datos.push({ label: "Motivacion", data: datosG3, hidden: true, });
        datos.push({ label: "Impacto", data: datosG33 });
        datos.push({ label: "Talento", data: datosG333 });

        return (
            <CrearGrafica labelsX={labelsMonths}
                datos={datos}
                fuerza={0.25}
                titleGrafica={"MIT vs Progreso"}
                maxLen={'140'}
                TituloGrafica={"Motivacion, Impacto, Talento (MIT)"}
            />
        );
    }

    renderformaciones() {
        return (
            <ListEjemplo
                titulo={'Listado de formaciones'}
                icono={'leanpub'}

            />
        );
    }
    renderTeletrabajador() {
        //   <iframe className="yellow4" title="Ultimos archivos subidos" src={this.props.usuarioDetail ? `https://drive.google.com/embeddedfolderview?id=${this.props.usuarioDetail.linkws}#grid` : null}

        return (

            <div>

                <div className="ui form">
                    <div className="two column stackable ui grid">
                        <div className="column three wide">
                            <div className="ui segment">
                                <Modal trigger={<div>
                                    <Button icon="chart line" className="opcionesGestor" color={this.state.open ? "teal" : "yellow"}
                                        label={this.state.open ? 'MIT' : 'Progreso'} onClick={() => { this.setState({ open: true }) }}
                                    ></Button>

                                </div>

                                }
                                    open={this.state.open}
                                >
                                    <Modal.Content image style={{ height: '740px' }}>
                                        {this.renderProgresoTrabajo()}
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button onClick={() => { this.setState({ open: false }) }} negative>
                                            Salir
                                         </Button>
                                    </Modal.Actions>
                                </Modal>

                            </div>
                            <div className="ui segment ">

                                <Modal trigger={<div>
                                    <Button icon="chart line" className="opcionesGestor" color={this.state.open2 ? "teal" : "yellow"}
                                        label={this.state.open2 ? 'Formate' : 'Formación'} onClick={() => { this.setState({ open2: true }) }}
                                    ></Button>
                                    <Label color='teal' floating>
                                        {this.props.listaFormacion? Object.keys(this.props.listaFormacion).length: 0}
                                    </Label>
                                </div>
                                }
                                    open={this.state.open2}
                                    style={{ width: '350px' }}
                                >
                                    <Modal.Content image style={{ height: '510px' }}>
                                        {this.renderformaciones()}
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button onClick={() => { this.setState({ open2: false }) }} negative>
                                            Salir
                                         </Button>
                                    </Modal.Actions>
                                </Modal>

                            </div>
                            <div className="ui segment ">
                                <Modal trigger={<div>
                                    <Button icon="chart line" className="opcionesGestor" color={this.state.open3 ? "teal" : "yellow"}
                                        label={this.state.open3 ? 'Selecciona' : 'Día Teletrabajo'} onClick={() => { this.setState({ open3: true }) }}
                                    ></Button>
                                    <Label color='teal' floating>
                                        09/03
                                     </Label>
                                </div>
                                }
                                    open={this.state.open3}
                                    style={{ width: '390px' }}
                                >
                                    <Modal.Content image style={{ height: '400px' }}>
                                        <Calendario2 className="tamaño-Calendario" />
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button onClick={() => { this.setState({ open3: false }) }} negative>
                                            Salir
                                         </Button>
                                    </Modal.Actions>
                                </Modal>

                            </div>




                        </div>
                        <div className="column eight wide" style={{ left: '20px'}} >
                            <div className="ui segment">
                                {this.renderListaObjetivos()}
                            </div>
                        </div>
                        <div className="column five wide">
                            <div className="ui segment" style={{ position: 'relative', height: '55em' }} >
                                {this.renderListaActividades()}
                            </div>
                        </div>


                    </div>
                </div >
            </div >

        );
    }


    handleClose = () => {
        this.timeout = setTimeout(() => {
            this.props.chatOff();
        }, timeoutLength)
    }

    handlePaso2 = () => {
        this.timeout = setTimeout(() => {
            this.setState({ activo: true });
        }, timeoutLength2)
    }

    handlePaso3 = () => {
        this.timeout = setTimeout(() => {
            this.props.chatOn();
            this.setState({ activo: null });
        }, timeoutLength2)
    }

    handlePaso5 = () => {
        this.timeout = setTimeout(() => {
            this.setState({ comenzo: false });
            this.setState({ activo: true });
        }, timeoutLength4)
    }

    handleFinal = () => {
        this.timeout = setTimeout(() => {
            this.props.pasoOnboardings(null);

            var updates = {};
            const postData = {
                ...this.props.usuarioDetail.usuario,
                onboarding: true,
            };
            updates[`Usuario/${this.props.usuarioDetail.idUsuario}`] = postData;
            firebase.database().ref().update(updates);

        }, timeoutLength5)
    }
    renderPasosCEL(style, paso) {

        return (<Step.Group vertical style={style} >
            <Step active={true} style={paso.style}    >

                <Step.Content >
                    <Step.Title>{paso.title}</Step.Title>
                    <Step.Description>{paso.active}</Step.Description>
                    <Label color='purple' horizontal>
                        Empezar
                   </Label>
                </Step.Content>
            </Step>


        </Step.Group>);
    }


    renderPasos(style, paso1, paso2, paso3, paso4, paso5) {

        return (<Step.Group vertical style={style} >
            <Step completed={paso1.completed} active={paso1.active} style={paso1.style} className={paso1.class}  >
                <Icon name='pencil alternate' />
                <Step.Content >
                    <Step.Title>Crea tu Actividad</Step.Title>
                    <Step.Description>Crea tu actividad y describe lo que debes hacer el día de hoy. ¡Tu asistente de ayudara!.</Step.Description>
                </Step.Content>
            </Step>

            <Step completed={paso2.completed} active={paso2.active} style={paso2.style} className={paso2.class} >
                <Icon name='chart line' />
                <Step.Content>
                    <Step.Title>Tu rendimiento</Step.Title>
                    <Step.Description>Tus objetivos y su prioridad para realizar en la semana, junto al seguimiento de tu trabajo comparado con el planificado</Step.Description>
                </Step.Content>
            </Step>

            <Step completed={paso3.completed} active={paso3.active} style={paso3.style} className={paso3.class} >
                <Icon name='chart pie' />
                <Step.Content>
                    <Step.Title>Se consciente de ti</Step.Title>
                    <Step.Description>Observa el progreso y comportamiento que haz tenido, mide tu MIT con el Huper y valora tus habilidades</Step.Description>
                </Step.Content>
            </Step>

            <Step completed={paso4.completed} active={paso4.active} style={paso4.style} className={paso4.class} >
                <Icon name='paper plane outline' />
                <Step.Content>
                    <Step.Title>Formate</Step.Title>
                    <Step.Description>Mira los nuevos contenidos diseñados para ti, dale clic en la formación y prepárate para crear nuevos hábitos</Step.Description>
                </Step.Content>
            </Step>


            <Step completed={paso5.completed} active={paso5.active} style={paso5.style} className={paso5.class} >
                <Icon name='desktop' size='tiny' />
                <Step.Content>
                    <Step.Title>Tus trabajos</Step.Title>
                    <Step.Description>Centralizamos el detalle de cada objetivo y sus adjuntos en cada tarjeta, mira las opciones</Step.Description>
                </Step.Content>
            </Step>

        </Step.Group>);
    }


    renderOnboardingCEL() {

        let style = {
            width: '100%',
        }
        let stylePadre = {
            position: 'fixed',
            top: '-8.5em',
            'border-radius': '1.5em',
            'z-index': '100000',
            // height: '20.5em',
            overflow: 'auto',
            width: '90%',
            left: '5%',
        }

        let styleP = {
            position: 'relative',
            bottom: '-20%',
            height: '25em',
            width: '24em',
            overflow: 'scroll',


        }

        const styleAnt = { background: ' rgba(237, 237, 34, 0.24)' };
        const styleUso = { background: ' #fbbd08' };
        const styleDep = { background: ' rgba(255, 245, 192, 0.99)' };

        let paso = { title: null, active: null, icono: null, style: styleAnt };


        switch (this.props.pasoOnboarding) {
            case 0:
                if (this.state.avatares) {

                    return (
                        <div>
                            <Image src={this.state.avatares[1]} size="medium"></Image>
                            <Header as='h2' icon inverted>
                                Bienvenido a Hupity!
                        <Header.Subheader>Vamos a comenzar</Header.Subheader>
                            </Header>


                        </div>
                    );
                }
                break;
            case 1:

                if (this.state.comenzo === false)
                    this.setState({ comenzo: true });

                if (this.state.pasoActivof === 1) {
                    this.setState({ pasoActivof: this.state.pasoActivof + 1 });
                    this.setState({ pasoActivo: 'onboardingApp' });
                    this.setState({ estadoCel: true });

                }

                paso = { title: 'Crea tu Actividad', active: 'Crea tu actividad y describe lo que debes hacer el día de hoy. ¡Tu asistente de ayudara!.', icono: 'pencil alternate', style: styleAnt };

                return (
                    <div style={stylePadre} className={this.state.pasoActivo} onClick={() => { this.setState({ estadoCel: false }); this.setState({ pasoActivo: 'onboardingApp2' }); }} >
                        {this.renderPasosCEL(style, paso)}

                    </div>
                );
            case 2:

                this.handleClose();
                paso = { title: 'Tu rendimiento', active: 'Tus objetivos y su prioridad para realizar en la semana, junto al seguimiento de tu trabajo comparado con el planificado', icono: 'chart pie', style: styleAnt };
                this.handlePaso2();

                let modulo = null;
                if (this.state.activo) {

                    modulo =
                        <div style={styleP}>
                            <div className="ui segment " >
                                {this.renderProgresoTrabajo()}
                            </div>
                            <div>
                                {this.renderListaObjetivos(true)}
                            </div>
                        </div>


                    if (this.state.pasoActivof === 2) {
                        this.setState({ pasoActivof: this.state.pasoActivof + 1 });
                        this.setState({ pasoActivo: 'onboardingApp' });
                        this.setState({ estadoCel: true });
                    }
                }


                return (<div>
                    <div style={stylePadre} className={this.state.activo ? this.state.pasoActivo : null} onClick={() => { this.setState({ estadoCel: false }); this.setState({ pasoActivo: 'onboardingApp2' }); }}>
                        {this.renderPasosCEL(style, paso)}
                    </div>
                    {modulo}

                </div>

                );
                return;

            case 3:
                if (this.state.pasoActivof === 3) {
                    this.setState({ pasoActivof: this.state.pasoActivof + 1 });
                    this.setState({ pasoActivo: 'onboardingApp' });
                    this.setState({ estadoCel: true });
                }


                if (this.state.activo2 === true) {
                    this.handlePaso3();
                    this.setState({ activo2: false });
                }
                paso = { title: 'Se consciente de ti', active: 'Observa el progreso y comportamiento que haz tenido, mide tu MIT con el Huper y valora tus habilidades', icono: 'chart line', style: styleAnt };

                return (<div>
                    <div style={stylePadre} className={this.state.pasoActivo} onClick={() => { this.setState({ estadoCel: false }); this.setState({ pasoActivo: 'onboardingApp2' }); }}>
                        {this.renderPasosCEL(style, paso)}
                    </div>
                    <div style={styleP}>
                        {this.renderGraficaTIC()}
                    </div>
                </div>);

            case 4:


                if (this.state.pasoActivof === 4) {
                    this.setState({ pasoActivof: this.state.pasoActivof + 1 });
                    this.setState({ pasoActivo: 'onboardingApp' });
                    this.setState({ estadoCel: true });
                }

                if (this.state.activo2 === true) {
                    this.props.chatOff();
                    this.setState({ activo2: false });
                    this.handlePaso5();
                }
                if (this.state.pasoActivof === 4) {
                    this.setState({ pasoActivof: this.state.pasoActivof + 1 });
                    this.setState({ pasoActivo: 'onboardingApp' });
                }
                paso = { title: 'Formate', active: 'Mira los nuevos contenidos diseñados para ti, dale clic en la formación y prepárate para crear nuevos hábitos', icono: 'paper plane outline', style: styleAnt };
                styleP.width = "100%";
                styleP.left = "0";
                // styleP.bottom = '-7em';

                return (<div>
                    <div style={stylePadre} className={this.state.pasoActivo} onClick={() => { this.setState({ estadoCel: false }); this.setState({ pasoActivo: 'onboardingApp2' }); }}>
                        {this.renderPasosCEL(style, paso)}
                    </div>
                    <div style={styleP}>
                        {this.renderformaciones()}
                    </div>
                </div>
                );

            case 5:
                if (this.state.pasoActivof === 5) {
                    this.setState({ pasoActivof: this.state.pasoActivof + 1 });
                    this.setState({ pasoActivo: 'onboardingApp' });
                    this.setState({ estadoCel: true });
                }
                stylePadre.top = '0em';
                paso = { title: 'Tus trabajos', active: 'Centralizamos el detalle de cada objetivo y sus adjuntos en cada tarjeta, mira las opciones', icono: 'desktop', style: styleAnt };
                this.onSearchXpress("go");
                return (<div>
                    <div style={stylePadre} className={this.state.pasoActivo} onClick={() => { this.setState({ estadoCel: false }); this.setState({ pasoActivo: 'onboardingApp2' }); }}>
                        {this.renderPasosCEL(style, paso)}
                    </div>
                    <div style={styleP}>
                        <Hupps />
                    </div>

                </div>
                );
            case 6:
                this.handleFinal();
                return (<div>
                    <Image src={this.state.avatares[1]} size="medium"></Image>
                    <Header as='h2' icon inverted>
                        ¡Comencemos...!
                        <Header.Subheader>El gestor agile de productividad personal</Header.Subheader>
                    </Header>
                </div>
                );
            default:
                return;

        }

    }


    renderOnboarding() {

        let style = {
            position: 'relative',
            bottom: '0em',
            left: '-75%',
            width: '40%',

        }

        let styleP = {
            position: 'fixed',
            left: '35%',
            width: '40%',
            height: '60%',
            top: '10%',
            overflow: 'auto',

        }

        const styleAnt = { background: ' rgba(237, 237, 34, 0.24)' };
        const styleUso = { background: ' #fbbd08' };
        const styleDep = { background: ' rgba(255, 245, 192, 0.99)' };

        let paso1 = { completed: false, active: false, style: styleAnt, class: '' };
        let paso2 = { completed: false, active: false, style: styleAnt, class: '' };
        let paso3 = { completed: false, active: false, style: styleAnt, class: '' };
        let paso4 = { completed: false, active: false, style: styleAnt, class: '' };
        let paso5 = { completed: false, active: false, style: styleAnt, class: '' };

        switch (this.props.pasoOnboarding) {
            case 0:
                if (this.state.avatares) {

                    return (
                        <div>
                            <Image src={this.state.avatares[1]} size="medium"></Image>
                            <Header as='h2' icon inverted>
                                Bienvenido a Hupity!
                        <Header.Subheader>Vamos a comenzar</Header.Subheader>
                            </Header>


                        </div>
                    );
                }
                break;
            case 1:
                if (this.state.comenzo === false)
                    this.setState({ comenzo: true });
                paso1 = { completed: false, active: true, style: styleAnt, class: 'onboardingAppG1' };
                paso2 = { completed: false, active: false, style: styleAnt, class: '' };
                paso3 = { completed: false, active: false, style: styleAnt, class: '' };
                paso4 = { completed: false, active: false, style: styleAnt, class: '' };
                paso5 = { completed: false, active: false, style: styleAnt, class: '' };
                return (
                    <div>
                        {this.renderPasos(style, paso1, paso2, paso3, paso4, paso5)}

                    </div>
                );
            case 2:

                this.handleClose();
                paso1 = { completed: true, active: false, style: styleDep, class: '' };
                paso2 = { completed: false, active: true, style: styleAnt, class: 'onboardingAppG2' };
                paso3 = { completed: false, active: false, style: styleAnt, class: '' };
                paso4 = { completed: false, active: false, style: styleAnt, class: '' };
                paso5 = { completed: false, active: false, style: styleAnt, class: '' };
                this.handlePaso2();

                let modulo = null;
                if (this.state.activo) {

                    styleP.height = "52";
                    const styleO = {
                        position: 'fixed',
                        left: '78%',
                        width: '15%',
                    }
                    modulo = <div>
                        <div className="ui segment " style={styleP}>
                            {this.renderProgresoTrabajo()}
                        </div>
                        <div style={styleO}>
                            {this.renderListaObjetivos(true)}
                        </div>

                    </div>
                }
                return (<div>
                    {modulo}
                    {this.renderPasos(style, paso1, paso2, paso3, paso4, paso5)}
                </div>

                );
                return;

            case 3:
                if (this.state.activo2 === true) {
                    this.handlePaso3();
                    this.setState({ activo2: false });
                }
                paso1 = { completed: true, active: false, style: styleDep, class: '' };
                paso2 = { completed: true, active: false, style: styleDep, class: '' };
                paso3 = { completed: false, active: true, style: styleAnt, class: 'onboardingAppG3' };
                paso4 = { completed: false, active: false, style: styleAnt, class: '' };
                paso5 = { completed: false, active: false, style: styleAnt, class: '' };

                //    styleP.width = '50%';
                return (<div>
                    <div style={styleP}>
                        {this.renderGraficaTIC()}
                    </div>
                    {this.renderPasos(style, paso1, paso2, paso3, paso4, paso5)}
                </div>);

            case 4:
                if (this.state.activo2 === true) {
                    this.props.chatOff();
                    this.setState({ activo2: false });
                    this.handlePaso5();

                }
                paso1 = { completed: true, active: false, style: styleDep, class: '' };
                paso2 = { completed: true, active: false, style: styleDep, class: '' };
                paso3 = { completed: true, active: false, style: styleDep, class: '' };
                paso4 = { completed: false, active: true, style: styleAnt, class: 'onboardingAppG4' };
                paso5 = { completed: false, active: false, style: styleAnt, class: '' };
                styleP.width = "19%";
                styleP.left = "45%";

                return (<div>
                    <div style={styleP}>
                        {this.renderformaciones()}
                    </div>
                    {this.renderPasos(style, paso1, paso2, paso3, paso4, paso5)}
                </div>
                );

            case 5:
                paso1 = { completed: true, active: false, style: styleDep, class: '' };
                paso2 = { completed: true, active: false, style: styleDep, class: '' };
                paso3 = { completed: true, active: false, style: styleDep, class: '' };
                paso4 = { completed: true, active: false, style: styleDep, class: '' };
                paso5 = { completed: false, active: true, style: styleAnt, class: 'onboardingAppG5' };
                styleP.width = "50%";
                this.onSearchXpress("go");
                return (<div>
                    <div style={styleP}>
                        <Hupps />
                    </div>
                    {this.renderPasos(style, paso1, paso2, paso3, paso4, paso5)}
                </div>
                );
            case 6:
                this.handleFinal();
                return (<div>
                    <Image src={this.state.avatares[1]} size="medium"></Image>
                    <Header as='h2' icon inverted>
                        ¡Comencemos...!
                        <Header.Subheader>El gestor agile de productividad personal</Header.Subheader>

                    </Header>
                </div>
                );
            default:
                return;

        }



    }


    render() {
        let varriable
        let onboarding = null;
        let styleS = {
            position: 'fixed',
            margin: '0.5em',
            bottom: '10%',
            right: '40%',
            'z-index': '6',
        }

        let bt;
        if (window.screen.width < 450) {
            styleS.right = '35%';
            styleS.bottom = '2.5%';
        }

        if (this.state.comenzo)
            bt = <button className="ui button purple huge" style={styleS} onClick={() => {
                if (this.props.pasoOnboarding === 5) this.setState({ comenzo: false });
                if (!this.state.estadoCel)
                    this.props.pasoOnboardings(this.props.pasoOnboarding + 1);
            }} >Continuar</button>;


        if (this.props.userRol === '3') {
            varriable = this.renderTeletrabajador();


            if (!this.props.usuarioDetail || (this.props.usuarioDetail && this.props.usuarioDetail.usuario && !this.props.usuarioDetail.usuario.onboarding)) {
                if (window.screen.width < 450) {
                    onboarding = <Dimmer active={true} page>
                        {this.renderOnboardingCEL()}
                        <MenuChat />
                        {bt}
                    </Dimmer>

                }
                else {

                    onboarding = <Dimmer active={true} page>
                        {this.renderOnboarding()}
                        <MenuChat />
                        {bt}
                    </Dimmer>
                }
            }



        }
        else if (this.props.userRol === '2') {
            varriable = this.renderGestor();
            //    console.log('Teletrabajador');
        }






        return (
            <div> {varriable}
                {onboarding}
            </div >

        );

    }
};

const mapStateToProps = (state) => {
    return {
        usuarioDetail: state.chatReducer.usuarioDetail,
        userRol: state.chatReducer.userRol,
        pasoOnboarding: state.chatReducer.pasoOnboarding,
        listaFormacion: state.chatReducer.listaFormacion,
    };
};
export default connect(mapStateToProps, { createStream, pasoOnboardings, chatOff, chatOn, listaFormaciones })(DashBoard);

///<ListAdjuntos />