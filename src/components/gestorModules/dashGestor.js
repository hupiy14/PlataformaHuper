import React from 'react';
import { connect } from 'react-redux';
import { createStream } from '../../actions';//from '   ../actions';
import ListFormacion from './listaFormacionesEquipo';
import '../styles/ingresoHupity.css';
import randomScalingFactor from '../../lib/randomScalingFactor'
import ListaObjetivosE from '../../components/gestorModules/listaObjetivosEquipo';
import ListaPersonasEquipo from '../utilidades/listaPersonasEquipo';
import {
    Button,
    Checkbox,
    Grid,
    Header,
    Icon,
    Image,
    Label,
    Menu,
    Segment,
    Sidebar,
    Radio,
    MessageHeader,
}
    from 'semantic-ui-react';
import PropTypes from 'prop-types'

import GraficaG1 from '../gestorModules/CrearGraficaGestor';
import GraficaG2 from '../gestorModules/CreargraficaHistorico';
import GraficaG3 from '../gestorModules/GraficoTICgestos';
import GraficaG4 from '../gestorModules/CrearGraficaProductividad';
import firebase from 'firebase';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, equipoConsultas, verEquipos } from '../modules/chatBot/actions';
import moment from 'moment';

const timeoutLength = 3000;
const timeoutLength2 = 500;
const timeoutLength3 = 1200;
let labelsMonths = [];
const HorizontalSidebar = ({ animation, direction, visible, equipo }) => (
    <Sidebar as={Segment} animation={animation} direction={direction} visible={visible}>
        <Grid textAlign='center'>
            <Grid.Row columns={1}>
                <Grid.Column>
                    {equipo}

                </Grid.Column>
            </Grid.Row>

        </Grid>
    </Sidebar>
)



class DashBoard extends React.Component {
    state = {
        percent: 15, activeItem: 'semana',

        consultaTareas: {}, titulo: null,
        listaPersonas: null, equipo: null,
        avatares: null, colorSeleccion: {}, diateletrabajo: {},
        valueH: false, slide: null, seleccion: null, ObjsFactors: [],
        grafica: null, numeroO: 0, UtilFactors: null, selEq: null,
        semanasP: [], facSemana: null, nivelEquipo: null, productividadobj: [],
        valorSlide: 0, actDif: [], calidadSubjetiva: null, factorCalidad: null,
    };

    handleVariables = (x) => {
        this.timeout = setTimeout(() => {
            this.calculoDeAvance();
            this.calcularAvancePorMes(this.state.ObjsFactors);
            this.setState({ valueH: false });
            this.setState({
                grafica: <div>
                    <Checkbox checked={this.state.valueH} className="historico-padding" label='Consultar Histórico' onChange={this.handleDimmedChange} toggle />
                    <GraficaG1 tope={100} datosAvance={this.calcularAvancePorDia(this.state.ObjsFactors, this.state.factorSemana)} />
                </div>
            });

        }, timeoutLength3)
    }


    handleSlide = (x) => {
        this.timeout = setTimeout(() => {
            this.setState({ valorSlide: x });
            if (x === 0)
                this.setState({ slide: this.renderListadoEquipo() });

            else if (x === 1)
                this.setState({ slide: this.renderListaObjetivo() });

            else if (x === 2)
                this.setState({ slide: this.renderListaFormaciones() })


        }, timeoutLength2)
    }

    handleOpen = () => {
        this.timeout = setTimeout(() => {

            if (this.state.numeroO === 10)
                this.setState({ numeroO: 0 });
            else
                this.setState({ numeroO: this.state.numeroO + 1 });
            //  this.handleOpen2();
        }, timeoutLength)
    }

    getWeekNumber(date) {
        var d = new Date(date);  //Creamos un nuevo Date con la fecha de "this".
        d.setHours(0, 0, 0, 0);   //Nos aseguramos de limpiar la hora.
        d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Recorremos los días para asegurarnos de estar "dentro de la semana"
        //Finalmente, calculamos redondeando y ajustando por la naturaleza de los números en JS:
        return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
    };

    consultaProductivad(year, Nsemana, puntos, puntosP, fPP, fE, nsemanaMes, mes, tipo) {
        const fecha = new Date();
        let valido = false;
        const list = this.state.semanasP;
        if (list) {
            Object.keys(list).map((key, index) => {
                const listaY = list[key];
                Object.keys(listaY).map((key2, index) => {
                    if (year === key && Nsemana === key2)
                        valido = true;
                });
            });
        }

        if (valido === false) {
            firebase.database().ref(`Equipo-Puntospro/${tipo}/${year}/${Nsemana}`).set({
                fechaCreado: moment(new Date).format('YYYY-MM-DD'),
                unidadesTrabajadas: puntos,
                unidadesPlan: puntosP,
                productividadPropia: fPP,
                productividadEsperada: fE,
                mes,
                nsemanaMest: nsemanaMes
            });

        }
    }

    consultaProductivadPersonal(year, Nsemana, puntos, puntosP, fPP, fE, fEq, nsemanaMes, mes, tipo) {
        const fecha = new Date();
        let valido = false;
        const list = this.state.semanasP;
        if (list) {
            Object.keys(list).map((key, index) => {
                const listaY = list[key];
                Object.keys(listaY).map((key2, index) => {
                    if (year === key && Nsemana === key2)
                        valido = true;
                });
            });
        }

        if (valido === false) {
            firebase.database().ref(`Usuario-Puntospro/${tipo}/${year}/${Nsemana}`).set({
                fechaCreado: moment(new Date).format('YYYY-MM-DD'),
                unidadesTrabajadas: puntos,
                unidadesPlan: puntosP,
                productividadPropia: fPP,
                productividadEsperada: fE,
                productividadEquipo: fEq,
                mes,
                nsemanaMest: nsemanaMes
            });

        }
    }







    actualizarequipoConsulta() {

        const starCountRef = firebase.database().ref().child(`Usuario-WS/${this.props.usuarioDetail.usuario.empresa}/${this.props.usuarioDetail.usuario.equipo}`);
        starCountRef.on('value', (snapshot) => {

            const equipo = snapshot.val();
            this.setState({ equipo });
            let usuariosCompletos = [];

            //carga todos los usuarios
            const starCountRef2 = firebase.database().ref().child(`Usuario`);
            starCountRef2.on('value', (snapshot2) => {
                const consulta = snapshot2.val();
                let variable = [];

                ///Recupera el rol del usuario
                Object.keys(consulta).map((key, index) => {


                    //tareas de cada persona
                    const starCountRef2 = firebase.database().ref().child(`Usuario-Tareas/${key}`);
                    starCountRef2.on('value', (snapshot) => {
                        const valor = snapshot.val();
                        if (!valor)
                            return
                        variable[key] = valor
                        this.props.listaObjetivos({ ...this.props.listaObjetivo, ...variable });
                    });

                    //rol de cada persona
                    const starCountRef3 = firebase.database().ref().child(`Usuario-Rol/${key}`);
                    starCountRef3.on('value', (snapshot3) => {
                        const rol = snapshot3.val();
                        usuariosCompletos[key] = { ...consulta[key], ...rol };
                        this.setState({ ...this.props.equipoConsulta, listaPersonas: { ...usuariosCompletos } });
                        this.props.equipoConsultas({ ...this.props.equipoConsulta, listaPersonas: { ...usuariosCompletos } });
                    });
                });

            });


            const fecha = new Date();
            const cal = this.getWeekNumber(fecha);

            if (!equipo)
                return;
            Object.keys(equipo).map((key, index) => {
                const starCountRef2 = firebase.database().ref().child(`Usuario-DiaTeletrabajo/${key}/${fecha.getFullYear()}/${cal}`);
                starCountRef2.on('value', (snapshot2) => {
                    //dia = snapshot2.val().dia;

                    if (snapshot2.val()) {
                        var usuariodia = {};
                        usuariodia[key] = { dia: snapshot2.val().dia, mes: snapshot2.val().mes };
                        const objetos = { ...this.state.diateletrabajo, ...usuariodia }
                        this.setState({ diateletrabajo: objetos })
                    }

                });

                // console.log(key)

                const starCountRef3 = firebase.database().ref().child(`Usuario-Objetivos/${key}`);
                starCountRef3.on('value', (snapshot2) => {
                    const objetivo = snapshot2.val();
                    let objetivoT = [];
                    const lista = { ...objetivo };

                    Object.keys(lista).map((key2, index) => {
                        objetivoT[key2] = { ...lista[key2], idUsuario: key };
                    })

                    const objetos = { ...this.props.equipoConsulta, ...objetivoT };
                    this.props.equipoConsultas({ ...this.props.equipoConsulta, ...objetos });

                });



            });

        });


    }
    componentDidUpdate() {
        if (this.props.equipoConsulta && this.props.equipoConsulta.sell && this.props.equipoConsulta.sell !== 0 && (this.state.selEq === null || this.state.selEq !== this.props.equipoConsulta.sell)) {
            this.setState({ selEq: this.props.equipoConsulta.sell });
            this.handleVariables();
        }
        else if (this.props.equipoConsulta && this.props.equipoConsulta.sell === 0 && (this.state.selEq === null || this.state.selEq !== this.props.equipoConsulta.sell)) {
            this.setState({ selEq: this.props.equipoConsulta.sell });
            this.handleVariables();
        }

    }


    calcularAvancePorDia(arreglo, factorTotal) {
        let actividadesDia = [];
        Object.keys(arreglo).map((key3, index) => {
            const arr = arreglo[key3].actividades;

            Object.keys(arr).map((key, index) => {
                let entro = false;
                Object.keys(actividadesDia).map((key2, index) => {
                    if (actividadesDia[key2].fecha === arr[key].fecha) {
                        entro = true;
                        actividadesDia[key2] = { fecha: actividadesDia[key2].fecha, avance: actividadesDia[key2].avance + (arr[key].cantidad * arreglo[key3].avance * arreglo[key3].factor) }
                    }
                });
                if (entro === false)
                    actividadesDia.push({ fecha: arr[key].fecha, avance: arr[key].cantidad * arreglo[key3].avance * arreglo[key3].factor });
            });
        });
        let datos = [];
        let fechas = this.arregloFechaSemana();
        let acumulado = 100;
        Object.keys(fechas).map((key0, index) => {
            let flagRegistro = false;
            Object.keys(actividadesDia).map((key, index) => {
                if (fechas[key0] === actividadesDia[key].fecha) {
                    acumulado = acumulado - Math.round(100 * (actividadesDia[key].avance / factorTotal));
                    datos.push(acumulado);
                    flagRegistro = true;
                }
            });
            if (flagRegistro === false)
                datos.push(acumulado);
        });
        return datos;
    }



    calculoDeAvance() {
        //  const objs = this.props.listaObjetivo;
        // const per = this.props.equipoConsulta;
        const tareas = this.props.listaObjetivo;
        const objs = this.props.equipoConsulta;
        let factorSemana = 0;
        //Encontrar factor
        this.setState({ ObjsFactors: [] });
        Object.keys(objs).map((key, index) => {


            if (this.props.userId === objs[key].idUsuario)
                return;
            if (!objs[key].concepto)
                return;
            if (this.props.equipoConsulta.sell && this.props.equipoConsulta.sell !== objs[key].idUsuario)
                return;
            let facPrioridad = 1;
            let facDificultad = 1;
            let facRepeticiones = 1;
            let facTipo = 1;
            let facCompartido = objs[key].compartidoEquipo ? objs[key].porcentajeResp * 0.01 : 1;
            let facCalidad = 1;
            let facValidacion = 1;
            let facProductividad = 1;
            let nTareasFinalizados = 0;
            let nTareas = 0;

            //Object.keys(this.state.UtilFactors.Calidad).map((key2, index) =>{});
            Object.keys(this.state.UtilFactors.Dificultad).map((key2, index) => {
                if (objs[key].dificultad === this.state.UtilFactors.Dificultad[key2].concepto)
                    facDificultad = this.state.UtilFactors.Dificultad[key2].valor;
            });
            Object.keys(this.state.UtilFactors.Prioridad).map((key2, index) => {
                if (objs[key].prioridad === key2)
                    facPrioridad = this.state.UtilFactors.Prioridad[key2];
            });
            Object.keys(this.state.UtilFactors.Tipo).map((key2, index) => {
                if (objs[key].tipo === this.state.UtilFactors.Tipo[key2].concepto)
                    facTipo = this.state.UtilFactors.Tipo[key2].valor;
            });
            Object.keys(this.state.UtilFactors.ValidacionGestor).map((key2, index) => {
                if (objs[key].estado === this.state.UtilFactors.ValidacionGestor[key2].concepto)
                    facValidacion = this.state.UtilFactors.ValidacionGestor[key2].valor;
            });
            //algoritmo de medicion del trabajo
            const puntos = ((1 + facPrioridad + facTipo) * facRepeticiones * facDificultad) * facCompartido * facCalidad * facValidacion * facProductividad;

            //            console.log(puntos);
            let actividades = [];
            let tiempo = 0;
            let tiempoMM = 0;
            if (!tareas)
                return;
            Object.keys(tareas).map((key5, index) => {
                let tar = tareas[key5];
                Object.keys(tar).map((key2, index) => {
                    if (key2 === key) {
                        const ttareas = tar[key2];
                        nTareas = Object.keys(ttareas).length;
                        Object.keys(ttareas).map((key3, index) => {

                            if (ttareas[key3].estado === 'finalizado') {
                                let entro = false;
                                Object.keys(actividades).map((key4, index) => {
                                    if (actividades[key4].fecha === ttareas[key3].dateEnd) {
                                        entro = true;
                                        actividades[key4] = { fecha: actividades[key4].fecha, cantidad: actividades[key4].cantidad + 1 }


                                        const ho = parseInt(moment(ttareas[key3].horaPlanificada, 'hh:mm').format('hh'));
                                        const mo = parseInt(moment(ttareas[key3].horaPlanificada, 'hh:mm').format('mm'));
                                        const valMinutos = moment(ttareas[key3].horaEstimada, 'hh:mm').subtract('minutes', mo);
                                        const valhoras = moment(ttareas[key3].horaEstimada, 'hh:mm').subtract('hour', ho);
                                        tiempo = tiempo + parseInt(moment(valhoras).format('hh'));
                                        tiempoMM = tiempoMM + parseInt(moment(valMinutos).format('mm'));



                                    }
                                });
                                if (entro === false) {
                                    actividades.push({ fecha: ttareas[key3].dateEnd, cantidad: 1 });
                                }
                                nTareasFinalizados++;
                            }
                        });
                    }
                });
            });
            const fact = this.state.ObjsFactors;
            fact[key] = {
                factor: Math.round(puntos),
                obj: objs[key],
                avance: nTareas === 0 ? 0 : 1 / nTareas, actividades,
                fechafin: moment(objs[key].fechafin).format('YYYY-MM-DD'),
                tiempo: parseInt(tiempo * 60 + tiempoMM),
                dateEnd: objs[key].dateEnd ? objs[key].dateEnd : null
            };
            this.setState({ ObjsFactors: fact });
            factorSemana = factorSemana + Math.round(puntos);
        });

        this.setState({ factorSemana });
    }

    arregloFechaSemana() {
        var fecahMinima = new Date();
        const diferencia = fecahMinima.getDay() - 1;
        fecahMinima = moment(fecahMinima).add(-7, 'days').format('YYYY-MM-DD');
        //fecahMinima.setDate(fecahMinima.getDate() + (-(diferencia)));
        let fechas = [];
        for (var i = 0; i < 6; i++)
            fechas.push(moment(fecahMinima).add(i, 'days').format('YYYY-MM-DD'));
        return fechas;
    }

    arregloFechaMes() {
        var fecahMinima = new Date();
        labelsMonths = [];
        const diferencia = fecahMinima.getDay() - 1;
        fecahMinima = moment(fecahMinima).add(-7, 'days').format('YYYY-MM-DD');
        //   fecahMinima.setDate(fecahMinima.getDate() + (-(diferencia)));
        let fechas = [];
        for (var i = -6; i < 2; i++) {
            fechas.push(moment(fecahMinima).add(i, 'months').format('MM'));
            labelsMonths.push(moment(fecahMinima).add(i, 'months').format('MMMM'));
        }
        return fechas;
    }

    componentDidMount() {

        window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/drive/v3/rest")
            .then(function () { console.log("GAPI client loaded for API"); },
                function (err) { console.error("Error loading GAPI client for API", err); });
        this.actualizarequipoConsulta();
        const starCountRef2 = firebase.database().ref(`Equipo-Esfuerzo/${this.props.usuarioDetail.usuario.equipo}`);
        starCountRef2.on('value', (snapshot) => {
            this.setState({ nivelEquipo: snapshot.val() })
            if (!snapshot.val()) {
                firebase.database().ref(`Equipo-Esfuerzo/${this.props.usuarioDetail.usuario.equipo}`).set({
                    nivel: 90,
                });
                this.setState({ nivelEquipo: { nivel: 90 } })
            }
        });



        this.handleOpen();
        const starCountRef3 = firebase.database().ref().child(`Utilidades-Valoraciones`);
        starCountRef3.on('value', (snapshot) => {
            this.setState({ UtilFactors: snapshot.val() });
        });


        const starCountRef = firebase.database().ref().child(`Equipo-Puntospro/${this.props.usuarioDetail.idUsuario}`);
        starCountRef.on('value', (snapshot) => {
            this.setState({ semanasP: snapshot.val() });
        });


        const starCountRef4 = firebase.database().ref().child(`Equipo-Act-Dif/${this.props.usuarioDetail.usuario.equipo}`);
        starCountRef4.on('value', (snapshot) => {
            if (snapshot.val()) {
                this.setState({ actDif: snapshot.val() });
            }
        });
        this.setState({ slide: this.renderListadoEquipo() });
        this.props.verEquipos(false);
        this.handleVariables();
    }

    getWeekNumber(date) {
        var d = new Date(date);  //Creamos un nuevo Date con la fecha de "this".
        d.setHours(0, 0, 0, 0);   //Nos aseguramos de limpiar la hora.
        d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Recorremos los días para asegurarnos de estar "dentro de la semana"
        //Finalmente, calculamos redondeando y ajustando por la naturaleza de los números en JS:
        return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
    };

    handleDimmedChange = (e, { checked }) => {
        console.log(checked);
        this.setState({ valueH: checked });

        if (checked) {
            let datos = [];
            let dat = this.calcularAvancePorMes(this.state.ObjsFactors);
            console.log(dat);
            this.setState({
                grafica: <div>
                    <Checkbox checked={checked} className="historico-padding" label='Consultar Histórico' onChange={this.handleDimmedChange} toggle />
                    <GraficaG2 datoPlanificar={dat.factorPlan} datoTrabajo={dat.factorTrab} labelsMonths={labelsMonths} />
                </div>
            })
        }
        else {
            this.setState({
                grafica: <div>
                    <Checkbox checked={checked} className="historico-padding" label='Consultar Histórico' onChange={this.handleDimmedChange} toggle />
                    <GraficaG1 tope={100} datosAvance={this.calcularAvancePorDia(this.state.ObjsFactors, this.state.factorSemana)} />
                </div>
            })
        }
    }



    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name })

        if (name === 'semana') {
            const graficaG =
                <div>
                    <Checkbox checked={this.state.valueH} className="historico-padding" label='Consultar Histórico' onChange={this.handleDimmedChange} toggle />
                    <GraficaG1 tope={100} datosAvance={this.calcularAvancePorDia(this.state.ObjsFactors, this.state.factorSemana)} />
                </div>
            this.setState({ grafica: graficaG })

        }
        else if (name === 'MIT') {
            const graficaG = <GraficaG3 />;
            this.setState({ grafica: graficaG })

        }
        else if (name === 'Productividad vs Calidad') {
            const graficaG = <GraficaG4 prod={this.state.productividadobj} cal={this.state.factorCalidad} />;
            this.setState({ grafica: graficaG })

        }

    }

    renderTituloObjetivo() {
        if (this.props.equipoConsulta && this.props.equipoConsulta.sell && this.props.equipoConsulta.sell !== 0) {
            let titulo;
            Object.keys(this.props.equipoConsulta.listaPersonas).map((key, index) => {
                if (key === this.props.equipoConsulta.sell)
                    titulo = this.props.equipoConsulta.listaPersonas[key].usuario;
            });
            this.setState({ seleccion: titulo });
            return 'Lista de Objetivos ' + titulo;

        }
        else {
            this.setState({ seleccion: null });
            return 'Lista de Objetivos';
        }
    }

    calcularCalidad(objCal) {
        //Algoritmo de calidad del trabajo
        const vFactor = 0.05;
        //Acontinacion las primeras cuatro medidas suman el 20%
        const valorSubjetivo = this.valorCalidadD(objCal.dificultadA, vFactor) + this.valorCalidadD(objCal.impactoA, vFactor) + this.valorCalidadD(objCal.tiempoA, vFactor);
        const valorSubjetivoF = objCal.dificultadA === '0' || objCal.impactoA === '0' || objCal.tiempoA === '0' ? !objCal.feedback ? 0 : vFactor * 1 / 2 : vFactor;
        //lA calificacion el 40%
        const valorCalificacion = (objCal.calificacion ? objCal.calificacion : 3 / 5) * 0.4;
        //Valor subjetivo
        const VS = valorSubjetivo + valorSubjetivoF + valorCalificacion;
        this.setState({ calidadSubjetiva: VS });
    }

    valorCalidadD(valor, por) {
        if (valor === '0')
            return por * 1;
        else if (valor === '1')
            return por * 1 / 2;
        else if (valor === '2')
            return por * 1 / 4;
        else
            return por;
    }

    guardarDifultad() {
        firebase.database().ref(`Equipo-Act-Dif/${this.props.usuarioDetail.usuario.equipo}`).set({
            ...this.state.actDif
        });
    }

    calcularAvancePorMes(arreglo) {
        let factorPlan = [];
        let factorTrab = [];
        let factorPlanS = [];
        let factorTrabS = [];
        const fechas = this.arregloFechaMes();
        Object.keys(fechas).map((key2, index) => {
            let factorP = 0;
            let factorT = 0;

            Object.keys(arreglo).map((key, index) => {

                if (fechas[key2] === moment(arreglo[key].fechafin, "YYYY-MM-DD").format("MM")) {
                    factorP = factorP + arreglo[key].factor;
                    const nw = this.getWeekNumber(arreglo[key].fechafin);
                    const ff = moment(arreglo[key].fechafin, "YYYY-MM-DD").format("YYYY");
                    const mm = (moment(arreglo[key].fechafin, "YYYY-MM-DD").week() - (moment(arreglo[key].fechafin, "YYYY-MM-DD").month() * 4));
                    const mes = moment(arreglo[key].fechafin, "YYYY-MM-DD").format('MMMM');

                    if (!factorPlanS[ff + nw.toString()])
                        factorPlanS[ff + nw.toString()] = { puntos: arreglo[key].factor, year: ff, semana: nw, nsemanMes: mm, mes, fecha: arreglo[key].fechafin, };
                    else
                        factorPlanS[ff + nw.toString()].puntos = factorPlanS[ff + nw.toString()].puntos + arreglo[key].factor;

                }
                if (fechas[key2] === moment(arreglo[key].dateEnd, "YYYY-MM-DD").format("MM")) {
                    factorT = factorT + arreglo[key].factor;
                    const nw = this.getWeekNumber(arreglo[key].dateEnd);
                    const ff = moment(arreglo[key].dateEnd, "YYYY-MM-DD").format("YYYY");
                    const mm = (moment(arreglo[key].dateEnd, "YYYY-MM-DD").week() - (moment(arreglo[key].dateEnd, "YYYY-MM-DD").month() * 4));
                    const mes = moment(arreglo[key].dateEnd, "YYYY-MM-DD").format('MMMM');
                    if (!factorTrabS[ff + nw.toString()])
                        factorTrabS[ff + nw.toString()] = {
                            puntos: arreglo[key].factor, year: ff, semana: nw, nsemanMes: mm, mes, fecha: arreglo[key].dateEnd,
                            comentarios: (arreglo[key].obj.comentarios ? arreglo[key].obj.comentarios.length : 1), act: (arreglo[key].actividades ? arreglo[key].actividades.length : 0)
                        };

                    else {
                        factorTrabS[ff + nw.toString()].puntos = factorTrabS[ff + nw.toString()].puntos + arreglo[key].factor;
                        factorTrabS[ff + nw.toString()].comentarios = factorTrabS[ff + nw.toString()].comentarios + (arreglo[key].obj.comentarios ? arreglo[key].obj.comentarios.length : 0);
                        factorTrabS[ff + nw.toString()].act = factorTrabS[ff + nw.toString()].act + (arreglo[key].actividades ? arreglo[key].actividades.length : 0);

                    }

                    //Agrega semanas cuando no se planifica
                    if (!factorPlanS[ff + nw.toString()])
                        factorPlanS[ff + nw.toString()] = { puntos: 0, year: ff, semana: nw, nsemanMes: mm, mes, fecha: arreglo[key].dateEnd, };



                }

            });

            factorPlan.push(factorP);
            factorTrab.push(factorT);
        });
        this.setState({ facSemana: { factorTrabS, factorPlanS } });

        this.setState({ factorCalidad: null });
        //Calidad por semana
        let calidadF = [];
        Object.keys(factorTrabS).map((keyP, index) => {
            let calidad = 0;
            Object.keys(arreglo).map((keyA, index) => {
                if (arreglo[keyA].dateEnd) {
                    const nw = this.getWeekNumber(arreglo[keyA].dateEnd);

                    if (nw === factorTrabS[keyP].semana) {

                        //cuando se selecciona una persona

                        this.calcularCalidad(arreglo[keyA].obj);
                        //Factor tiempo, tiempo estimado/tiempo trabajado
                        const tiempoE = Math.round((arreglo[keyA].factor / factorTrabS[keyP].puntos) * 40);
                        const tiempoW = tiempoE / (arreglo[keyA].tiempo === 0 ? tiempoE : (arreglo[keyA].tiempo / 60));
                        const facTiempo = (tiempoW > 2 ? 2 : tiempoW) * 0.1;

                        //factor comentarios
                        const comentariosE = ((factorTrabS[keyP].comentarios ? factorTrabS[keyP].comentarios : 1) / factorTrabS[keyP].puntos) * arreglo[keyA].factor;
                        const comentariosW = comentariosE / (arreglo[keyA].obj.comentarios ? arreglo[keyA].obj.comentarios.length : comentariosE);
                        const facComentarios = (comentariosW > 1.5 ? 1.5 : comentariosW) * 0.1;


                        //factor actividades por unidad
                        const actividadesE = (factorTrabS[keyP].act / factorTrabS[keyP].puntos) * arreglo[keyA].factor;
                        const actividadesW = (arreglo[keyA].actividades ? arreglo[keyA].actividades.length : actividadesE) / actividadesE;
                        const facActividades = (actividadesW > 2 ? 2 : actividadesW) * 0.1;

                        //factor actividades por dificultad
                        const dificultadA = (arreglo[keyA].actividades.length > 0 ? arreglo[keyA].actividades.length : 1);
                        const dificultadB = dificultadA;
                        let dicultadW = 1;

                        //
                        if (this.state.actDif.length > 0) {
                            const list = this.state.actDif;
                            Object.keys(list).map((keyD, index) => {
                                if (keyD === arreglo[keyA].obj.prioridad) {
                                    const list2 = list[keyD];
                                    Object.keys(list2).map((keyE, index) => {
                                        if (keyE === arreglo[keyA].obj.dificultad) {
                                            dificultadA = list2[keyE];
                                        }
                                    });
                                }
                            });
                            const lt = this.state.actDif;
                            if (dificultadB !== dificultadA) {
                                dicultadW = (((dificultadA + dificultadB) / 2) / dificultadB);
                                lt[arreglo[keyA].obj.prioridad] = { [arreglo[keyA].obj.dificultad]: (dificultadA + dificultadB) / 2 };
                            }
                            else { lt[arreglo[keyA].obj.prioridad] = { [arreglo[keyA].obj.dificultad]: dificultadA }; }
                            this.setState({ actDif: lt });

                        }
                        else {
                            const lt = this.state.actDif;
                            lt[arreglo[keyA].obj.prioridad] = { [arreglo[keyA].obj.dificultad]: dificultadA };
                            this.setState({ actDif: lt });
                        }
                        const facDificultad = (dicultadW > 2 ? 2 : dicultadW) * 0.1;
                        if (calidad === 0)
                            calidad = this.state.calidadSubjetiva + facDificultad + facActividades + facComentarios + facTiempo;
                        calidad = (calidad + this.state.calidadSubjetiva + facDificultad + facActividades + facComentarios + facTiempo) / 2;


                    }

                }
            });

            calidadF['sem.' + factorTrabS[keyP].nsemanMes + ' ' + factorTrabS[keyP].mes] = { calidad, fecha: factorTrabS[keyP].fecha };
        });
        this.setState({ factorCalidad: calidadF });
        this.guardarDifultad();


        /////////////////************************************************************
        /////////////////************************************************************ 

        //productividad por semana
        let productividadSemana = []
        let maxfT = 0;
        let afT = [];
        let numeroPersonas = 0;
        //numero de personas de equipo
        Object.keys(this.props.equipoConsulta.listaPersonas).map((key, index) => {
            if (this.props.equipoConsulta.listaPersonas[key].Rol === '3')
                numeroPersonas++;
        });


        if (factorPlanS.length > 0) {
            Object.keys(factorPlanS).map((key, index2) => {
                const fP = factorPlanS[key].puntos === 0 ? factorTrabS[key].puntos : factorPlanS[key].puntos;
                const fT = factorTrabS[key] !== undefined ? factorTrabS[key].puntos : 0;
                let fTE = fT;
                if (this.state.nivelEquipo) {
                    if (!this.state.nivelEquipo.unidades || index2 !== Object.keys(factorPlanS).length - 1)
                        fTE = fT * (this.state.nivelEquipo.nivel / 100);
                    else
                        fTE = this.state.nivelEquipo.unidades;
                }

                let fE = fT === 0 ? 1 : fT / fTE;
                maxfT = fT > maxfT ? fT : maxfT;

                if (this.props.equipoConsulta && this.props.equipoConsulta.sell && this.props.equipoConsulta.sell !== 0) {

                    let fEq = 0;
                    Object.keys(this.state.nivelEquipo.unidadesEquipo).map((key2, index) => {
                        if (key2 === factorPlanS[key].year) {
                            const arrayValores = this.state.nivelEquipo.unidadesEquipo[key2];
                            Object.keys(arrayValores).map((key3, index) => {
                                if (key3 === factorPlanS[key].semana.toString()) {

                                    fEq = arrayValores[key3].valor / numeroPersonas;
                                    fE = arrayValores[key3].valorEsperado / numeroPersonas;
                                }
                            });
                        }
                    });
                    //algortimo de productividad personas
                    const valor = (fT / fP) * 0.5 + (fT / fE) * 0.2 + (fEq === 0 ? 1 : fT / fEq) * 0.3;
                    productividadSemana['sem.' + factorPlanS[key].nsemanMes + ' ' + factorPlanS[key].mes] = { valor, fecha: factorPlanS[key].fecha };
                    this.consultaProductivadPersonal(factorPlanS[key].year, factorPlanS[key].semana, fT, fP, fT / fP, fE, fEq, factorPlanS[key].nsemanMes, factorPlanS[key].mes, this.props.equipoConsulta.sell);
                }
                else {
                    this.consultaProductivad(factorPlanS[key].year, factorPlanS[key].semana, fT, fP, fT / fP, fE, factorPlanS[key].nsemanMes, factorPlanS[key].mes, this.props.usuarioDetail.usuario.equipo);
                    //algortimo de productividad equipo
                    const valor = (fT / fP) * 0.6 + fE * 0.4;
                    productividadSemana['sem.' + factorPlanS[key].nsemanMes + ' ' + factorPlanS[key].mes] = { valor, fecha: factorPlanS[key].fecha };
                    afT[factorPlanS[key].year] = { ...afT[factorPlanS[key].year], [factorPlanS[key].semana]: { valor: fT, valorEsperado: fTE } }
                }
            });
        }
        else { ///si no tiene ningun valor
            const mm = moment().week() - (moment().month() * 4);
            const mes = moment().format('MMMM');
            productividadSemana['sem.' + mm + ' ' + mes] = { valor: 0, fecha: moment().format("YYYY-MM-DD") };

        }
        //actualiza la productividad
        if (!this.props.equipoConsulta || !this.props.equipoConsulta.sell || this.props.equipoConsulta.sell === 0) {
            firebase.database().ref(`Equipo-Esfuerzo/${this.props.usuarioDetail.usuario.equipo}`).set({
                ...this.state.nivelEquipo,
                unidades: maxfT * this.state.nivelEquipo.nivel * 0.01,
                unidadesEquipo: afT,
            });
        }

        this.setState({ productividadobj: productividadSemana });
        return ({ factorPlan, factorTrab });


    }


    renderTituloFormacion() {
        if (this.props.equipoConsulta && this.props.equipoConsulta.sell && this.props.equipoConsulta.sell !== 0) {
            let titulo;
            Object.keys(this.props.equipoConsulta.listaPersonas).map((key, index) => {
                if (key === this.props.equipoConsulta.sell)
                    titulo = this.props.equipoConsulta.listaPersonas[key].usuario;
            });
            this.setState({ seleccion: titulo });
            return 'Lista de Formaciones ' + titulo;

        }
        else {
            this.setState({ seleccion: null });
            return 'Lista Formaciones';
        }
    }

    renderAcrhivosSubidos() {

        let carpeta = this.props.usuarioDetail.linkws;

        if (this.props.equipoConsulta && this.props.equipoConsulta.sell && this.props.equipoConsulta.sell !== 0) {
            Object.keys(this.state.equipo).map((key, index) => {

                if (key === this.props.equipoConsulta.sell)
                    carpeta = this.state.equipo[key].linkWs;
            });
        }
        return carpeta;
    }

    renderListadoEquipo() {

        //envia la seleccion realizada
        let sel = null;
        if (this.props.equipoConsulta && this.props.equipoConsulta.sell && this.props.equipoConsulta.sell !== 0) {
            let titulo;
            sel = this.props.equipoConsulta.sell;
            Object.keys(this.props.equipoConsulta.listaPersonas).map((key, index) => {
                if (key === this.props.equipoConsulta.sell)
                    titulo = this.props.equipoConsulta.listaPersonas[key].usuario;

            });
            this.setState({ seleccion: titulo });
        }
        else {
            this.setState({ seleccion: null });
        }

        return (
            <ListaPersonasEquipo
                titulo={'Tu equipo'}
                diateletrabajo={this.state.diateletrabajo}
                equipox={this.state.equipo}
                listaPersonas={this.state.listaPersonas}
                empresa={this.props.usuarioDetail.usuario.empresa}
                equipo={this.props.usuarioDetail.usuario.equipo}
                seleccionUsuario={sel}
                icono={'user outline'} />

        );
    }

    renderListaObjetivo() {
        return (<ListaObjetivosE
            titulo={this.renderTituloObjetivo()}
            icono={'thumbtack'}
            equipox={this.state.equipo}

        />);

    }
    renderListaFormaciones() {
        return (
            <ListFormacion
                equipox={this.state.equipo}
                titulo={this.renderTituloFormacion()}
                iconos={'leanpub'} />
        );
    }


    renderGestor() {

        let porcentajeTexto = 0;
        let verUsuario = 'none';

        if (this.state.seleccion) {
            porcentajeTexto = this.state.seleccion.length * 8.5;
            verUsuario = 'block';
        }

        if (this.state.listaPersonas && this.state.equipo && this.state.diateletrabajo) {

            // console.log(this.props.usuarioDetail);
            return (

                <div>
                    <div className="ui form">
                        <div className="two column stackable ui grid">
                            <div className="column fifteen wide">
                                <div className="ui segment ">
                                    <Sidebar.Pushable as={Segment}>
                                        {
                                            <HorizontalSidebar animation="scale down" direction="right" visible={this.props.verEquipo} equipo={this.state.slide} />
                                        }
                                        <Sidebar.Pusher dimmed={this.props.verEquipo}>
                                            <Segment basic>
                                                <Menu pointing secondary>
                                                    <Menu.Item name='semana' active={this.state.activeItem === 'semana'} onClick={this.handleItemClick} />
                                                    <Menu.Item
                                                        name='MIT'
                                                        active={this.state.activeItem === 'MIT'}
                                                        onClick={this.handleItemClick}
                                                    />
                                                    <Menu.Item
                                                        name='Productividad vs Calidad'
                                                        active={this.state.activeItem === 'Productividad vs Calidad'}
                                                        onClick={this.handleItemClick}
                                                    />
                                                </Menu>

                                                <Segment attached='bottom'>
                                                    {this.state.grafica}
                                                </Segment>

                                            </Segment>
                                        </Sidebar.Pusher>
                                    </Sidebar.Pushable>
                                </div>
                            </div>

                            <div className="column one wide loaderTEAM">
                                <div className="ui segment ">
                                    <Button icon="users" className="opcionesGestor" label="Equipo" color="yellow" onClick={() => { this.handleSlide(0); this.props.verEquipos(!this.props.verEquipo); }} >

                                    </Button>
                                    <Label color='teal' floating style={{ width: `${porcentajeTexto}px`, left: '40px', display: `${verUsuario}`, 'z-index': '1' }}>
                                        {this.state.seleccion}
                                    </Label>
                                </div>
                                <div className="ui segment ">
                                    <Button icon="tasks" className="opcionesGestor" label="Objetivos" color="yellow" onClick={() => { this.handleSlide(1); this.props.verEquipos(!this.props.verEquipo); }} ></Button>
                                </div>
                                <div className="ui segment ">
                                    <Button icon="book" className="opcionesGestor" label="Formación" color="yellow" onClick={() => { this.handleSlide(2); this.props.verEquipos(!this.props.verEquipo); }} ></Button>
                                </div>
                                <div>
                                    <Button icon="arrow right" className="ocultarMenu" circular style={{ visibility: !this.props.verEquipo === true ? 'hidden' : null, position: 'relative', left: '-180px', top: '510px', background: 'purple', color: 'white' }}
                                        onClick={() => { this.props.verEquipos(!this.props.verEquipo); this.handleSlide(this.state.valorSlide); this.setState({ activeItem: 'semana' }) }}
                                    ></Button>
                                </div>

                            </div>

                        </div>
                    </div >
                </div >
            );
        }
    }

    render() {
        return (
            <div> {this.renderGestor()}</div>
        );

    }
};

const mapStateToProps = (state) => {
    return {
        equipoConsulta: state.chatReducer.equipoConsulta,
        usuarioDetail: state.chatReducer.usuarioDetail,
        listaObjetivo: state.chatReducer.listaObjetivo,
        verEquipo: state.chatReducer.verEquipo,
        userRol: state.chatReducer.userRol,
        userId: state.auth.userId,
    };
};
export default connect(mapStateToProps, { createStream, equipoConsultas, listaObjetivos, verEquipos })(DashBoard);

///<ListAdjuntos />