import React from 'react';
import { connect } from 'react-redux';
import '../modules/chatBot/chatHupApp.css';
import history from '../../history';
import perfil from '../../images/perfil.png';
import ListFormacion from './listaFormacionesEquipo';
//import randomScalingFactor from '../../lib/randomScalingFactor'
import ListaObjetivosE from '../../components/gestorModules/listaObjetivosEquipo';
import ListaPersonasEquipo from '../utilidades/listaPersonasEquipo';
import {
  Image,
}
  from 'semantic-ui-react';
//import PropTypes from 'prop-types'
import GraficaG1 from '../gestorModules/CrearGraficaGestor';
import GraficaG2 from '../gestorModules/CreargraficaHistorico';
import GraficaG3 from '../gestorModules/GraficoTICgestos';
import GraficaG4 from '../gestorModules/CrearGraficaProductividad';
import { listaObjetivos, equipoConsultas, verEquipos } from '../modules/chatBot/actions';
import moment from 'moment';
//import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button2 from '@material-ui/core/Button';
import { dataBaseManager } from '../../lib/utils';
import { popupBot } from '../../actions';
const timeoutLength3 = 1200;
let labelsMonths = [];

class hupData extends React.Component {





  state = {
    percent: 15, activeItem: 'semana',
    consultaTareas: {}, titulo: null,
    listaPersonas: null, equipo: null,
    avatares: null, colorSeleccion: {}, diateletrabajo: {},
    valueH: false, slide: null, seleccion: null, ObjsFactors: [],
    grafica: null, numeroO: 0, UtilFactors: null, selEq: null,
    semanasP: [], facSemana: null, nivelEquipo: null, productividadobj: [],
    valorSlide: 0, actDif: [], calidadSubjetiva: null, factorCalidad: null,
    grafica2: null,
    activeStep: 0,
    activeEquipo: 0,

    slides: (() => {
      let slides = [];
      for (let i = 0; i < 600; i += 1) {
        slides.push('Slide ' + (i + 1));
      }
      return slides;
    }),
    virtualData: {
      slides: [],
    },
  }

  componentDatabase(tipo, path, objectIn, mensaje, mensajeError) {
    let men = dataBaseManager(tipo, path, objectIn, mensaje, mensajeError);
    if (men && men.mensaje)
      this.props.popupBot({ mensaje: men.mensaje });
    return men;
  }
  renderGraficaGestorStep(step, idUs) {
    let graficaG;
    let graficaG2;
    let datos = [];

    const arrEq = this.renderEquipoGD();
    const keyTrabajo = arrEq[idUs].key ? arrEq[idUs].key : 0;
    let factorsObj = this.calculoDeAvance();
    let dat = this.calcularAvancePorMes(factorsObj);

    switch (step) {
      case 0:
        // console.log(this.calcularAvancePorDia(this.state.ObjsFactors, this.state.factorSemana));
        graficaG = <GraficaG1 key='1' tope={100} equipoGra={true} datosAvance={this.calcularAvancePorDia(factorsObj, this.state.factorSemana)} />
        factorsObj = this.calculoDeAvance(keyTrabajo);
        graficaG2 = <GraficaG1 key='2' tope={100} datosAvance={this.calcularAvancePorDia(factorsObj, this.state.factorSemana)} />
        break;
      case 1:

        let trab = this.ticArregloEquipo();
        datos = trab.datos;
        graficaG = <GraficaG3 equipoGra={true} labelsX={trab.arrL}
          datos={datos}
          titleGrafica={"Medida MIT (Progreso)"}
          TituloGrafica={"Motivacion, Impacto, Talento (MIT)"}
        />;
        trab = this.ticArregloEquipo(keyTrabajo);
        console.log(trab);
        datos = trab.datos;
        graficaG2 = <GraficaG3 labelsX={trab.arrL}
          datos={datos}
          titleGrafica={"Medida MIT (Progreso)"}
          TituloGrafica={"Motivacion, Impacto, Talento (MIT)"}
        />;
        break;
      case 2:
        graficaG = <GraficaG4 equipoGra={true} prod={dat.productividadobj} cal={dat.factorCalidad} />;
        factorsObj = this.calculoDeAvance(keyTrabajo);
        console.log(factorsObj)
        dat = this.calcularAvancePorMes(factorsObj, keyTrabajo);
        graficaG2 = <GraficaG4 prod={dat.productividadobj} cal={dat.factorCalidad} />;

        break;
      case 3:
        graficaG = <GraficaG2 equipoGra={true} datoPlanificar={dat.factorPlan} datoTrabajo={dat.factorTrab} labelsMonths={labelsMonths} />
        factorsObj = this.calculoDeAvance(keyTrabajo);
        dat = this.calcularAvancePorMes(factorsObj, keyTrabajo);
        graficaG2 = <GraficaG2 datoPlanificar={dat.factorPlan} datoTrabajo={dat.factorTrab} labelsMonths={labelsMonths} />
        break;

      default:
        break;
    }
    this.setState({ grafica: graficaG })
    this.setState({ grafica2: graficaG2 })
  }

  handleNext() {
    this.renderGraficaGestorStep(this.state.activeStep + 1, this.state.activeEquipo);
    this.setState({ activeStep: this.state.activeStep + 1 });

  }

  handleBack() {
    this.renderGraficaGestorStep(this.state.activeStep - 1, this.state.activeEquipo);
    this.setState({ activeStep: this.state.activeStep - 1 });

  }


  handleVariables = (x) => {
    this.timeout = setTimeout(() => {
      this.calculoDeAvance();
      this.calcularAvancePorMes(this.state.ObjsFactors);
      this.setState({ valueH: false });

      this.setState({
        grafica:
          <GraficaG1 tope={100} equipoGra={true} datosAvance={this.calcularAvancePorDia(this.state.ObjsFactors, this.state.factorSemana)} />
      });
      this.setState({
        grafica2:
          <GraficaG1 tope={100} datosAvance={this.calcularAvancePorDia(this.state.ObjsFactors, this.state.factorSemana)} />
      });

    }, timeoutLength3)
  }


  consultaProductivad(year, Nsemana, puntos, puntosP, fPP, fE, nsemanaMes, mes, tipo) {
    let valido = false;
    const list = this.state.semanasP;
    if (list) {
      Object.keys(list).map((key, index) => {
        const listaY = list[key];
        Object.keys(listaY).map((key2, index) => {
          if (year === key && Nsemana === key2)
            valido = true;
          return listaY[key2];
        });
        return list[key];
      });
    }


    if (valido === false) {
      this.componentDatabase('insert', `Equipo-Puntospro/${tipo}/${year}/${Nsemana}`, {
        fechaCreado: moment(new Date()).format('YYYY-MM-DD'),
        unidadesTrabajadas: puntos,
        unidadesPlan: puntosP ? puntosP : 0,
        productividadPropia: fPP,
        productividadEsperada: fE,
        mes,
        nsemanaMest: nsemanaMes
      });


    }
  }

  consultaProductivadPersonal(year, Nsemana, puntos, puntosP, fPP, fE, fEq, nsemanaMes, mes, tipo) {
    let valido = false;
    const list = this.state.semanasP;
    if (list) {
      Object.keys(list).map((key, index) => {
        const listaY = list[key];
        Object.keys(listaY).map((key2, index) => {
          if (year === key && Nsemana === key2)
            valido = true;
          return listaY[key2];
        });
        return list[key];
      });
    }
    if (valido === false) {
      this.componentDatabase('insert', `Usuario-Puntospro/${tipo}/${year}/${Nsemana}`, {
        fechaCreado: moment(new Date()).format('YYYY-MM-DD'),
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





  ticArregloEquipo(keyTrabajo) {
    const diat = new Date();
    const ticUsuarios = this.props.equipoConsulta.listaPersonas;
    const ns = this.getWeekNumber(diat);
    let datos = [];
    let datosA = [];
    let datos2 = [];
    const arrL = ['Talneto en tus actividades', 'Impacto de mis actividades', 'Responsabilidad en tus actividades', 'Talento grupal', 'Impacto en tu equipo', 'Motivacion en tu equipo', 'Mi talento', 'Mi impacto', 'Mi compromiso'];
    let inicio = 0;
    let limite = 2;

    if (keyTrabajo === 0) return { arrL, datos };
    if (ns - 3 > 0) {
      inicio = ns - 2;
      limite = ns + 1;
    }
    for (let index = inicio; index < limite; index++) {
      let an = (new Date()).getFullYear() + "-01-01";
      Object.keys(ticUsuarios).map((key2, index2) => {
        let ticUsuario = [];
        let ticEquipoEsta = false

        Object.keys(this.state.equipo).map((keyEq, index2) => {
          if (key2 === keyEq)
            ticEquipoEsta = true;
          return this.state.equipo[keyEq];
        });

        if (ticEquipoEsta === false)
          return null;

        if (ticUsuarios[key2].rol === '2')
          return null;
        if (keyTrabajo && key2 !== keyTrabajo) {
          return null;
        }

        ticUsuario = ticUsuarios[key2].tic ? ticUsuarios[key2].tic : [];
        Object.keys(ticUsuario).map((key, index2) => {
          let valores = [];
          if (parseInt(key) === index) {
            const lab = 'Sen ' + (moment(an, "YYYY-MM-DD").add('days', index * 7).month() * 4) + 'del Año ';
            const dat = datosA[lab] ? datosA[lab] : 0;
            valores['te'] = ticUsuario[key].talentoE ? ticUsuario[key].talentoE.valorC * 20 : 10 + dat.te ? dat.te : dat;
            valores['tt'] = ticUsuario[key].talentoT ? ticUsuario[key].talentoT.valorC * 20 : 10 + dat.tt ? dat.tt : dat;
            valores['tf'] = ticUsuario[key].talentoF ? ticUsuario[key].talentoF.valorC * 20 : 10 + dat.tf ? dat.tf : dat;

            valores['it'] = ticUsuario[key].impactoT ? ticUsuario[key].impactoT.valorC * 20 : 10 + dat.it ? dat.it : dat;
            valores['ie'] = ticUsuario[key].impactoE ? ticUsuario[key].impactoE.valorC * 20 : 10 + dat.ie ? dat.ie : dat;
            valores['if'] = ticUsuario[key].impactoF ? ticUsuario[key].impactoF.valorC * 20 : 10 + dat.if ? dat.if : dat;

            valores['cf'] = ticUsuario[key].compromisoF ? ticUsuario[key].compromisoF.valorC * 20 : 10 + dat.cf ? dat.cf : dat;
            valores['ce'] = ticUsuario[key].compromisoE ? ticUsuario[key].compromisoE.valorC * 20 : 10 + dat.ce ? dat.ce : dat;
            valores['ct'] = ticUsuario[key].compromisoT ? ticUsuario[key].compromisoT.valorC * 20 : 10 + dat.ct ? dat.ct : dat;
            //  console.log(valores);
            datosA[lab] = { ...valores };

            //   datos.push({ label: "MIT " + lab, data: valores });
          }
          return ticUsuario[key];
        });
        return ticUsuarios[key2];
      });


      Object.keys(datosA).map((key, index2) => {
        let dt = [];
        dt.push(datosA[key].te);
        dt.push(datosA[key].tt);
        dt.push(datosA[key].tf);
        dt.push(datosA[key].it);
        dt.push(datosA[key].ie);
        dt.push(datosA[key].if);
        dt.push(datosA[key].cf);
        dt.push(datosA[key].ce);
        dt.push(datosA[key].ct);
        datos2.push({ label: "MIT " + key, data: dt });
        return datosA[key];
      });


    }
    return { arrL, datos2 };
  }






  actualizarequipoConsulta() {

    const starCountRef = this.componentDatabase('get', `Usuario-WS/${this.props.usuarioDetail.usuario.empresa}/${this.props.usuarioDetail.usuario.equipo}`);
    starCountRef.on('value', (snapshot) => {

      const equipo = snapshot.val();
      this.setState({ equipo });
      let usuariosCompletos = [];

      //carga todos los usuarios
      const starCountRef2 = this.componentDatabase('get', `Usuario`);
      starCountRef2.on('value', (snapshot2) => {
        const consulta = snapshot2.val();
        let variable = [];



        ///Recupera el rol del usuario
        Object.keys(consulta).map((key, index) => {

          let flagEQ = false;
          Object.keys(equipo).map((keyEQ, index) => {
            if (keyEQ === key)
              flagEQ = true;
            return equipo[keyEQ];
          });
          if (flagEQ === false)
            return null;

          //tareas de cada persona
          const starCountRef2 = this.componentDatabase('get', `Usuario-Tareas/${key}`);
          starCountRef2.on('value', (snapshot) => {
            const valor = snapshot.val();
            if (!valor)
              return null;
            variable[key] = valor
            this.props.listaObjetivos({ ...this.props.listaObjetivo, ...variable });
          });

          //rol de cada persona
          const starCountRef3 = this.componentDatabase('get', `Usuario-Rol/${key}`);
          starCountRef3.on('value', (snapshot3) => {
            const rol = snapshot3.val();
            usuariosCompletos[key] = { ...consulta[key], ...rol };
            this.setState({ ...this.props.equipoConsulta, listaPersonas: { ...usuariosCompletos } });
            this.props.equipoConsultas({ ...this.props.equipoConsulta, listaPersonas: { ...usuariosCompletos } });
          });

          const diat = new Date();
          const nameRef3 = this.componentDatabase('get', `Usuario-TIC/${key}/${diat.getFullYear()}`);
          nameRef3.on('value', (snapshot2) => {
            const tic = snapshot2.val();
            const info = this.state.listaPersonas ? this.state.listaPersonas[key] : null

            usuariosCompletos[key] = { ...info, tic };

            this.setState({ ...this.props.equipoConsulta, listaPersonas: { ...usuariosCompletos } });
            this.props.equipoConsultas({ ...this.props.equipoConsulta, listaPersonas: { ...usuariosCompletos } });
          });
          return consulta[key];
        });
      });


      const fecha = new Date();
      const cal = this.getWeekNumber(fecha);

      if (!equipo)
        return;
      Object.keys(equipo).map((key, index) => {
        const starCountRef2 = this.componentDatabase('get', `Usuario-DiaTeletrabajo/${key}/${fecha.getFullYear()}/${cal}`);
        starCountRef2.on('value', (snapshot2) => {
          //dia = snapshot2.val().dia;

          if (snapshot2.val()) {
            var usuariodia = {};
            usuariodia[key] = { dia: snapshot2.val().dia, mes: snapshot2.val().mes };
            const objetos = { ...this.state.diateletrabajo, ...usuariodia }
            this.setState({ diateletrabajo: objetos })
          }
        });

        const starCountRef3 = this.componentDatabase('get', `Usuario-Objetivos/${key}`);
        starCountRef3.on('value', (snapshot2) => {
          const objetivo = snapshot2.val();
          let objetivoT = [];
          const lista = { ...objetivo };

          Object.keys(lista).map((key2, index) => {
            objetivoT[key2] = { ...lista[key2], idUsuario: key };
            return lista[key2];
          })

          const objetos = { ...this.props.equipoConsulta, ...objetivoT };
          this.props.equipoConsultas({ ...this.props.equipoConsulta, ...objetos });

        });
        return equipo[key];
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

  componentDidMount() {


    if (!window.gapi.client) {
      history.push('/dashboard');
      return;
    }

    window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/drive/v3/rest")
      .then(function () { console.log("GAPI client loaded for API"); },
        function (err) { console.error("Error loading GAPI client for API", err); });
    this.actualizarequipoConsulta();
    const starCountRef2 = this.componentDatabase('get', `Equipo-Esfuerzo/${this.props.usuarioDetail.usuario.equipo}`);
    starCountRef2.on('value', (snapshot) => {
      this.setState({ nivelEquipo: snapshot.val() })
      if (!snapshot.val()) {
        this.componentDatabase('insert', `Equipo-Esfuerzo/${this.props.usuarioDetail.usuario.equipo}`, {
          nivel: 90,
        });
        this.setState({ nivelEquipo: { nivel: 90 } })
      }
    });


    const starCountRef3 = this.componentDatabase('get', `Utilidades-Valoraciones`);
    starCountRef3.on('value', (snapshot) => {
      this.setState({ UtilFactors: snapshot.val() });
    });


    const starCountRef = this.componentDatabase('get', `Equipo-Puntospro/${this.props.usuarioDetail.idUsuario}`);
    starCountRef.on('value', (snapshot) => {
      this.setState({ semanasP: snapshot.val() });
    });


    const starCountRef4 = this.componentDatabase('get', `Equipo-Act-Dif/${this.props.usuarioDetail.usuario.equipo}`);
    starCountRef4.on('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({ actDif: snapshot.val() });
      }
    });
    this.setState({ slide: this.renderListadoEquipo() });
    this.props.verEquipos(false);
    this.handleVariables();
  }

  handleVariables = (x) => {
    this.timeout = setTimeout(() => {
      this.renderGraficaGestorStep(0, 0);
    }, timeoutLength3)
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
          return actividadesDia[key2];
        });
        if (entro === false)
          actividadesDia.push({ fecha: arr[key].fecha, avance: arr[key].cantidad * arreglo[key3].avance * arreglo[key3].factor });
        return arr[key];
      });
      return arreglo[key3];
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
        return actividadesDia[key];
      });
      if (flagRegistro === false)
        datos.push(acumulado);
      return fechas[key0];
    });
    return datos;
  }

  calculoDeAvance(keyTrabajo) {

    const tareas = this.props.listaObjetivo;
    const objs = this.props.equipoConsulta;
    let fact = [];
    let factorSemana = 0;
    //Encontrar factor
    this.setState({ ObjsFactors: [] });
    if (keyTrabajo === 0) return fact;
    Object.keys(objs).map((key, index) => {
      if (!objs[key]) return null;
      if (this.props.userId === objs[key].idUsuario)
        return null;
      if (!objs[key].concepto)
        return null;
      if (keyTrabajo && keyTrabajo !== objs[key].idUsuario) {
        return null;
      }


      let ticEquipoEsta = false
      Object.keys(this.state.equipo).map((keyEq, index2) => {
        if (objs[key].idUsuario === keyEq)
          ticEquipoEsta = true;
        return this.state.equipo[keyEq];
      });

      if (ticEquipoEsta === false)
        return null;

      let facPrioridad = 1;
      let facDificultad = 1;
      let facRepeticiones = 1;
      let facTipo = 1;
      let facCompartido = objs[key].compartidoEquipo ? objs[key].porcentajeResp * 0.01 : 1;
      let facCalidad = 1;
      let facValidacion = 1;
      let facProductividad = 1;
      let nTareas = 0;

      //Object.keys(this.state.UtilFactors.Calidad).map((key2, index) =>{});
      Object.keys(this.state.UtilFactors.Dificultad).map((key2, index) => {
        if (objs[key].dificultad === this.state.UtilFactors.Dificultad[key2].concepto)
          facDificultad = this.state.UtilFactors.Dificultad[key2].valor;
        return this.state.UtilFactors.Dificultad[key2];
      });
      Object.keys(this.state.UtilFactors.Prioridad).map((key2, index) => {
        if (objs[key].prioridad === key2)
          facPrioridad = this.state.UtilFactors.Prioridad[key2];
        return this.state.UtilFactors.Prioridad[key2];
      });
      Object.keys(this.state.UtilFactors.Tipo).map((key2, index) => {
        if (objs[key].tipo === this.state.UtilFactors.Tipo[key2].concepto)
          facTipo = this.state.UtilFactors.Tipo[key2].valor;
        return this.state.UtilFactors.Tipo[key2];
      });
      Object.keys(this.state.UtilFactors.ValidacionGestor).map((key2, index) => {
        if (objs[key].estado === this.state.UtilFactors.ValidacionGestor[key2].concepto)
          facValidacion = this.state.UtilFactors.ValidacionGestor[key2].valor;
        return this.state.UtilFactors.ValidacionGestor[key2];
      });
      //algoritmo de medicion del trabajo
      const puntos = ((1 + facPrioridad + facTipo) * facRepeticiones * facDificultad) * facCompartido * facCalidad * facValidacion * facProductividad;


      //            console.log(puntos);
      let actividades = [];
      let tiempo = 0;
      let tiempoMM = 0;
      if (!tareas)
        return null;
      Object.keys(tareas).map((key5, index) => {
        let tar = tareas[key5];
        if (tar) {
          Object.keys(tar).map((key2, index) => {
            if (key2 === key) {
              const ttareas = tar[key2];
              nTareas = Object.keys(ttareas).length; ///observar para un cambio futuro si es que solo se cuentan las tareas planificadas y realizadas
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
                    return actividades[key4];
                  });
                  if (entro === false) {
                    actividades.push({ fecha: ttareas[key3].dateEnd, cantidad: 1 });
                  }
                }
                return ttareas[key3];
              });
            }
            return tar[key2];
          });
        }
        return tareas[key5];
      });
      fact = this.state.ObjsFactors;


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
      return objs[key];
    });



    this.setState({ factorSemana });
    return fact;
  }
  arregloFechaSemana() {
    var fecahMinima = new Date();
    fecahMinima = moment(fecahMinima).add(-fecahMinima.getDay(), 'days').format('YYYY-MM-DD');
    let fechas = [];
    for (var i = 0; i < 6; i++)
      fechas.push(moment(fecahMinima).add(i, 'days').format('YYYY-MM-DD'));
    return fechas;
  }

  arregloFechaMes() {
    var fecahMinima = new Date();
    labelsMonths = [];
    fecahMinima = moment(fecahMinima).add(-7, 'days').format('YYYY-MM-DD');
    //   fecahMinima.setDate(fecahMinima.getDate() + (-(diferencia)));
    let fechas = [];
    for (var i = -6; i < 2; i++) {
      fechas.push(moment(fecahMinima).add(i, 'months').format('MM'));
      labelsMonths.push(moment(fecahMinima).add(i, 'months').format('MMMM'));
    }
    return fechas;
  }


  getWeekNumber(date) {
    var d = new Date(date);  //Creamos un nuevo Date con la fecha de "this".
    d.setHours(0, 0, 0, 0);   //Nos aseguramos de limpiar la hora.
    d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Recorremos los días para asegurarnos de estar "dentro de la semana"
    //Finalmente, calculamos redondeando y ajustando por la naturaleza de los números en JS:
    return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
  };





  renderTituloObjetivo() {
    if (this.props.equipoConsulta && this.props.equipoConsulta.sell && this.props.equipoConsulta.sell !== 0) {
      let titulo;
      Object.keys(this.props.equipoConsulta.listaPersonas).map((key, index) => {
        if (key === this.props.equipoConsulta.sell)
          titulo = this.props.equipoConsulta.listaPersonas[key].usuario;
        return this.props.equipoConsulta.listaPersonas[key];
      });
      this.setState({ seleccion: titulo });
      return 'Lista de Objetivos ' + titulo;

    }
    else {
      this.setState({ seleccion: null });
      return 'Lista de Objetivos de la semana';
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
    this.componentDatabase('insert', `Equipo-Act-Dif/${this.props.usuarioDetail.usuario.equipo}`, {
      ...this.state.actDif
    });

  }


  calcularAvancePorMes(arreglo, keyTrabajo) {
    let factorPlan = [];
    let factorTrab = [];
    let factorPlanS = [];
    let factorTrabS = [];
    let calidadF = [];
    const fechas = this.arregloFechaMes();
    if (keyTrabajo === 0) return ({ factorPlan, factorTrab, productividadobj: 0, factorCalidad: 0 });
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
        return arreglo[key];
      });

      factorPlan.push(factorP);
      factorTrab.push(factorT);
      return fechas[key2];
    });
    this.setState({ facSemana: { factorTrabS, factorPlanS } });

    this.setState({ factorCalidad: null });
    //Calidad por semana
    calidadF = [];
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
            let actividadesE = (factorTrabS[keyP].act / factorTrabS[keyP].puntos) * arreglo[keyA].factor;
            let actividadesW = (arreglo[keyA].actividades ? arreglo[keyA].actividades.length : actividadesE) / actividadesE;
            let facActividades = (actividadesW > 2 ? 2 : actividadesW) * 0.1;

            //factor actividades por dificultad
            let dificultadA = (arreglo[keyA].actividades.length > 0 ? arreglo[keyA].actividades.length : 1);
            let dificultadB = dificultadA;
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
                    return list2[keyE];
                  });
                }
                return list[keyD];
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
        return arreglo[keyA];
      });

      calidadF['sem.' + factorTrabS[keyP].nsemanMes + ' ' + factorTrabS[keyP].mes] = { calidad, fecha: factorTrabS[keyP].fecha };
      return factorTrabS[keyP];
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

      let ticEquipoEsta = false

      Object.keys(this.state.equipo).map((keyEq, index2) => {
        if (key === keyEq)
          ticEquipoEsta = true;
        return this.state.equipo[keyEq];
      });

      if (this.props.equipoConsulta.listaPersonas[key].Rol === '3' && ticEquipoEsta === true)
        numeroPersonas++;
      return this.props.equipoConsulta.listaPersonas[key];
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

        let fE = fT === 0 ? 1 : fT / (fTE === 0 ? 1 : fTE);
        maxfT = fT > maxfT ? fT : maxfT;


        console.log(keyTrabajo);
        if (this.props.equipoConsulta && keyTrabajo) {

          let fEq = 0;
          Object.keys(this.state.nivelEquipo.unidadesEquipo).map((key2, index) => {
            if (key2 === factorPlanS[key].year) {
              const arrayValores = this.state.nivelEquipo.unidadesEquipo[key2];
              Object.keys(arrayValores).map((key3, index) => {
                if (key3 === factorPlanS[key].semana.toString()) {

                  fEq = arrayValores[key3].valor / (!numeroPersonas ? 1 : numeroPersonas);
                  fE = arrayValores[key3].valorEsperado / (!numeroPersonas ? 1 : numeroPersonas);
                }
                return arrayValores[key3];
              });
            }
            return this.state.nivelEquipo.unidadesEquipo[key2];
          });
          //algortimo de productividad personas
          const FEq = fEq === 0 ? 1 : fT / fEq;
          const valor = (fT / fP) * 0.5 + (fT / fE) * 0.2 + FEq * 0.3;

          productividadSemana['sem.' + factorPlanS[key].nsemanMes + ' ' + factorPlanS[key].mes] = { valor, fecha: factorPlanS[key].fecha };
          this.consultaProductivadPersonal(factorPlanS[key].year, factorPlanS[key].semana, fT, fP, fT / fP, fE, fEq, factorPlanS[key].nsemanMes, factorPlanS[key].mes, keyTrabajo);
        }
        else {
          this.consultaProductivad(factorPlanS[key].year, factorPlanS[key].semana, fT, fP, fT / fP, fE, factorPlanS[key].nsemanMes, factorPlanS[key].mes, this.props.usuarioDetail.usuario.equipo);
          //algortimo de productividad equipo
          const valor = (fT / fP) * 0.6 + fE * 0.4;
          productividadSemana['sem.' + factorPlanS[key].nsemanMes + ' ' + factorPlanS[key].mes] = { valor, fecha: factorPlanS[key].fecha };
          afT[factorPlanS[key].year] = { ...afT[factorPlanS[key].year], [factorPlanS[key].semana]: { valor: fT, valorEsperado: fTE } }
        }
        return factorPlanS[key];
      });
    }
    else { ///si no tiene ningun valor
      const mm = moment().week() - (moment().month() * 4);
      const mes = moment().format('MMMM');
      productividadSemana['sem.' + mm + ' ' + mes] = { valor: 0, fecha: moment().format("YYYY-MM-DD") };

    }
    //actualiza la productividad
    if (!this.props.equipoConsulta || !keyTrabajo) {
      this.componentDatabase('insert', `Equipo-Esfuerzo/${this.props.usuarioDetail.usuario.equipo}`, {
        ...this.state.nivelEquipo,
        unidades: maxfT * this.state.nivelEquipo.nivel * 0.01,
        unidadesEquipo: afT,
      });

    }

    this.setState({ productividadobj: productividadSemana });
    return ({ factorPlan, factorTrab, productividadobj: productividadSemana, factorCalidad: calidadF });


  }


  renderTituloFormacion() {
    if (this.props.equipoConsulta && this.props.equipoConsulta.sell && this.props.equipoConsulta.sell !== 0) {
      let titulo;
      Object.keys(this.props.equipoConsulta.listaPersonas).map((key, index) => {
        if (key === this.props.equipoConsulta.sell)
          titulo = this.props.equipoConsulta.listaPersonas[key].usuario;
        return this.props.equipoConsulta.listaPersonas[key];
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
        return this.state.equipo[key];
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
        return this.props.equipoConsulta.listaPersonas[key];
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

  renderEquipoGD() {

    if (this.props.equipoConsulta && this.state.equipo && this.state.diateletrabajo) {
      //  console.log('Cambio');
      const cconsulta = this.props.equipoConsulta.listaPersonas;
      const consultaEq = this.state.equipo;
      ///    {this.renderCalendario(key)}
      //  console.log(cconsulta);
      const arregloEquipo = [];
      let y = 0;
      Object.keys(consultaEq).map((key, index) => {
        Object.keys(cconsulta).map((key2, index) => {
          if (key === key2) {
            if (key === this.props.userId) {
              return null;
            }
            if (cconsulta[key].Rol === '2') return null;
            arregloEquipo[y] = { nombre: cconsulta[key].usuario, cargo: cconsulta[key].cargo, foto: cconsulta[key].imagenPerfil ? cconsulta[key].imagenPerfil : perfil, key }
            y++;


          }
          return cconsulta[key2];
        });
        return consultaEq[key];
      });


      //console.log(arregloEquipo);

      for (let index = arregloEquipo.length; index < 6; index++) {
        arregloEquipo[index] = { nombre: 'Usuario', cargo: 'Por agregar', foto: perfil };
      }
      return arregloEquipo;


    }
  }

  render() {

    let equipoF = this.renderEquipoGD();
    if (!equipoF) {
      equipoF = [];
      for (let index = 0; index < 6; index++) {
        equipoF[index] = { nombre: 'Por agregar', cargo: 'Por agregar', foto: perfil };
      }
    }

    let forma = null;
    if (!equipoF[this.state.activeEquipo])
      return;

    if (this.state.equipo)    //console.log(equipoF)
      forma = <ListFormacion
        equipox={this.state.equipo}
        titulo="Formación"
        keytrabajo={equipoF[this.state.activeEquipo].key ? equipoF[this.state.activeEquipo].key : 0}
        //  titulo={this.renderTituloFormacion()}
        iconos={'leanpub'} />;


    return (

      <div>
        <div className="ui form">
          <div className="three column stackable ui grid">
            <div className="column sixteen wide" >
              <h1 style={{ left: '40%', position: 'relative', color: '#d06327' }}> Progreso del equipo</h1>
              {this.state.grafica}
            </div>

            <div className="column four wide">
              <div className="swiper-container" style={{ top: '50px', position: 'relative' }}>
                <div className="swiper-wrapper">
                  <div className='swiper-slide'>
                    <div style={{ 'background': 'linear-gradient(to right, #fbe026d1 5%, #fe6c04 60%)', height: '380px', 'border-radius': '35px 32px' }} onPointerOver={() => { this.setState({ activeEquipo: 0 }) }} >
                      <h2 style={{ color: '#ffe3d4', top: '166px', position: 'relative', 'z-index': '7', left: '22%', width: '60%' }}>{equipoF[0].nombre}</h2>
                      <h5 style={{ color: '#ffdecc', top: '137px', position: 'relative', 'z-index': 7, left: '46px', width: '60%' }}>{equipoF[0].cargo}</h5>
                      <Image src={equipoF[0].foto} circular
                        style={{
                          'box-shadow': 'rgba(251, 189, 8, 0.51) -2px 2px 5px 1px',
                          width: '100px', position: 'absolute', top: '13%', height: '100px', left: '21%',
                          transform: 'scale(1.5)'
                        }}></Image>

                      {forma}


                    </div>

                  </div>
                  <div className='swiper-slide'>
                    <div style={{ 'background': 'linear-gradient(to right, #fbe026d1 5%, #fe6c04 60%)', height: '380px', 'border-radius': '35px 32px' }} onPointerOver={() => { this.setState({ activeEquipo: 1 }) }}>

                      <h2 style={{ color: '#ffe3d4', top: '166px', position: 'relative', 'z-index': '7', left: '22%', width: '60%' }}>{equipoF[1].nombre}</h2>
                      <h5 style={{ color: '#ffdecc', top: '137px', position: 'relative', 'z-index': 7, left: '46px', width: '60%' }}>{equipoF[1].cargo}</h5>

                      <Image src={equipoF[1].foto} circular
                        style={{
                          'box-shadow': 'rgba(251, 189, 8, 0.51) -2px 2px 5px 1px',
                          width: '100px', position: 'absolute', top: '13%', height: '100px', left: '21%',
                          transform: 'scale(1.5)'
                        }}></Image>
                    </div>
                  </div>
                  <div className='swiper-slide'>
                    <div style={{ 'background': 'linear-gradient(to right, #fbe026d1 5%, #fe6c04 60%)', height: '380px', 'border-radius': '35px 32px' }} onPointerOver={() => { this.setState({ activeEquipo: 2 }) }}>

                      <h2 style={{ color: '#ffe3d4', top: '166px', position: 'relative', 'z-index': '7', left: '22%', width: '60%' }}>{equipoF[2].nombre}</h2>
                      <h5 style={{ color: '#ffdecc', top: '137px', position: 'relative', 'z-index': 7, left: '46px', width: '60%' }}>{equipoF[2].cargo}</h5>

                      <Image src={equipoF[2].foto} circular

                        style={{
                          'box-shadow': 'rgba(251, 189, 8, 0.51) -2px 2px 5px 1px',
                          width: '100px', position: 'absolute', top: '13%', height: '100px', left: '21%',
                          transform: 'scale(1.5)'
                        }}></Image>
                    </div>
                  </div>
                  <div className='swiper-slide'>
                    <div style={{ 'background': 'linear-gradient(to right, #fbe026d1 5%, #fe6c04 60%)', height: '380px', 'border-radius': '35px 32px' }} onPointerOver={() => { this.setState({ activeEquipo: 3 }) }}>

                      <h2 style={{ color: '#ffe3d4', top: '166px', position: 'relative', 'z-index': '7', left: '22%', width: '60%' }}>{equipoF[3].nombre}</h2>
                      <h5 style={{ color: '#ffdecc', top: '137px', position: 'relative', 'z-index': 7, left: '46px', width: '60%' }}>{equipoF[3].cargo}</h5>

                      <Image src={equipoF[3].foto} circular

                        style={{
                          'box-shadow': 'rgba(251, 189, 8, 0.51) -2px 2px 5px 1px',
                          width: '100px', position: 'absolute', top: '13%', height: '100px', left: '21%',
                          transform: 'scale(1.5)'
                        }}></Image>
                    </div>
                  </div>
                  <div className='swiper-slide'>
                    <div style={{ 'background': 'linear-gradient(to right, #fbe026d1 5%, #fe6c04 60%)', height: '380px', 'border-radius': '35px 32px' }} onPointerOver={() => { this.setState({ activeEquipo: 4 }) }}>

                      <h2 style={{ color: '#ffe3d4', top: '166px', position: 'relative', 'z-index': '7', left: '22%', width: '60%' }}>{equipoF[4].nombre}</h2>
                      <h5 style={{ color: '#ffdecc', top: '137px', position: 'relative', 'z-index': 7, left: '46px', width: '60%' }}>{equipoF[4].cargo}</h5>

                      <Image src={equipoF[4].foto} circular

                        style={{
                          'box-shadow': 'rgba(251, 189, 8, 0.51) -2px 2px 5px 1px',
                          width: '100px', position: 'absolute', top: '13%', height: '100px', left: '21%',
                          transform: 'scale(1.5)'
                        }}></Image>
                    </div>
                  </div>
                  <div className='swiper-slide'>
                    <div style={{ 'background': 'linear-gradient(to right, #fbe026d1 5%, #fe6c04 60%)', height: '380px', 'border-radius': '35px 32px' }} onPointerOver={() => { this.setState({ activeEquipo: 5 }) }}>

                      <h2 style={{ color: '#ffe3d4', top: '166px', position: 'relative', 'z-index': '7', left: '22%', width: '60%' }}>{equipoF[5].nombre}</h2>
                      <h5 style={{ color: '#ffdecc', top: '137px', position: 'relative', 'z-index': '7', left: '46px', width: '60%' }}>{equipoF[5].cargo}</h5>

                      <Image src={equipoF[5].foto} circular

                        style={{
                          'box-shadow': 'rgba(251, 189, 8, 0.51) -2px 2px 5px 1px',
                          width: '100px', position: 'absolute', top: '13%', height: '100px', left: '21%',
                          transform: 'scale(1.5)'
                        }}></Image>
                    </div>
                  </div>

                </div>
                <div className="swiper-pagination"></div>
                <div className="swiper-button-prev" onClick={() => { this.setState({ activeEquipo: this.state.activeEquipo - 1 }); this.renderGraficaGestorStep(this.state.activeStep, this.state.activeEquipo - 1); }}  ></div>
                <div className="swiper-button-next" onClick={() => { this.setState({ activeEquipo: this.state.activeEquipo + 1 }); this.renderGraficaGestorStep(this.state.activeStep, this.state.activeEquipo + 1); }} ></div>
              </div>
            </div>
            <div className="column one wide" style={{ height: '500px' }}></div>
            <div className="column eleven wide" style={{ height: '500px' }}>
              <h2 style={{ left: '-41%', position: 'relative', top: '50px', color: '#d66a1e' }}> Progreso individual</h2>

              {this.state.grafica2}
            </div>


            <MobileStepper
              variant="progress"
              steps={4}
              position="static"
              activeStep={this.state.activeStep}
              style={{
                maxWidth: '400', flexGrow: '1', 'background': 'linear-gradient(to right, #fce64d -30%, rgb(247, 244, 242)50%, rgb(255, 106, 0)100%)',
                top: '25px', position: 'relative', transform: 'scale(0.7)',
                'border-radius': '150px'
              }}
              nextButton={
                <Button2 size="small" onClick={() => { this.handleNext() }} disabled={this.state.activeStep === 3}>
                  Next
                  </Button2>
              }
              backButton={
                <Button2 size="small" onClick={() => { this.handleBack() }} disabled={this.state.activeStep === 0}>
                  Back
                 </Button2>
              }
            />
          </div>
        </div>
      </div>



    );


  }
}

const mapStateToProps = (state) => {
  return {
    equipoConsulta: state.chatReducer.equipoConsulta,
    usuarioDetail: state.chatReducer.usuarioDetail,
    listaObjetivo: state.chatReducer.listaObjetivo,
    verEquipo: state.chatReducer.verEquipo,
    userId: state.auth.userId,
  };
};
export default connect(mapStateToProps, { equipoConsultas, listaObjetivos, verEquipos, popupBot })(hupData);

