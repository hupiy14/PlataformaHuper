import React from 'react';
import { connect } from 'react-redux';
import {
  setActiveChat, submitMessage, numeroPreguntas, valorInputs, consultaPreguntaControls, pregFantasmas, primeraVs, estadochats, MensajeIvilys,
  tipoPreguntas, mensajeEntradas, Mslacks, borrarChats, consultaChats, consultaCanales, pasoOnboardings, avatares, inputSlacks, objTIMs, datoCloses,
} from './actions';
import { chatOff, chatOn } from '../../../actions';
import BoxDianmico from './boxDinamico';
import firebase from 'firebase';
import { Emoji } from 'emoji-mart';
import randomColor from '../../../lib/randomColor'
import { Image, Breadcrumb, Label } from 'semantic-ui-react';
import moment from 'moment';
import randon from '../../../lib/randonImage';
import Avatar from '../../../apis/xpress';
import { object, string } from 'prop-types';
import info from '../../../images/info.png';
import report from '../../../images/report.png';
import huper from '../../../images/huper.png';
import equipo from '../../../images/equipo.png';
import perfil from '../../../images/perfil.png';
import _ from 'lodash';


let Tic_T = require('../tic_trabajo').default;
const { SlackOAuthClient } = require('messaging-api-slack')


let timeoutLength = 4000;
let timeoutLength3 = 10500;
let timeoutLength4 = 1000;
let timeoutLength2 = 300;
class Home extends React.Component {

  state = {
    carpeta: null, updates: null, color: [], client: null, count: 20,
    client2: null, avataresN: null, avatarX: 0, valoresTIC: null,
    avatarY: 0, ultimaTarea: null, mensajeEnviado: false, ticUsuario: null,
    personasInv: [], flagConsulta: true, actividadesIvi: null, nActIVi: 0,
  }

  onSearchXpress = async (text) => {
    if (this.state.avatarX === this.state.avatarY) return;
    this.setState({ avatarY: this.state.avatarY + 1 });

    const response = await Avatar.get('/gifs/search', {
      params: {
        api_key: 'oXZ3mfKZT6Qcv8B768ozo6OjMO312KN5',
        offset: 0,
        limit: 25,
        rating: 'G',
        lang: 'en',
        q: text ? text : 'hello',
      },
    });
    //  console.log(response);
    this.props.avatares(response.data.data);

  }

  handleOpen = (valorInput, chatID, userID) => {
    //valida si ya se contesto si no se espera
    timeoutLength2 = 700;
    if (userID === '1') {
      timeoutLength2 = 300;
      if (this.state.mensajeEnviado === true)
        timeoutLength2 = 600;
    }
    this.setState({ mensajeEnviado: true });
    this.timeout = setTimeout(() => {
      this.setState({ mensajeEnviado: false });
      if (Array.isArray(valorInput))
        this.props.submitMessage(
          _.replace(valorInput, /@nombre/g, this.props.nombreUser),
          chatID,
          userID
        );
      else {
        if (valorInput.trim() !== '')
          this.props.submitMessage(
            _.replace(valorInput, /@nombre/g, this.props.nombreUser),
            chatID,
            userID
          );
      }
    }, timeoutLength2)
  }


  componentDidMount() {
    this.renderConsultarUltimaTarea();

    this.setState({ avatarX: 1 });

    if ((this.props.estadochat && this.props.estadochat === 'pausa')) {
      this.setState({ colorPausa: '#593b03' });
      this.props.estadochats('pausa');
    }



    const nameRef2 = firebase.database().ref().child(`Usuario-Slack/${this.props.userId}`)
    nameRef2.on('value', (snapshot2) => {
      this.setState({
        client2: SlackOAuthClient.connect(snapshot2.val().tokenB)
      });
      this.setState({
        client: SlackOAuthClient.connect(snapshot2.val().tokenP)
      });
      this.props.consultaCanales(snapshot2.val());
    });

    const nameRef = firebase.database().ref().child(`Categorias-TIC`)
    nameRef.on('value', (snapshot2) => {
      this.setState({ valoresTIC: snapshot2.val() })
    });
    const diat = new Date();
    const nameRef3 = firebase.database().ref().child(`Usuario-TIC/${this.props.userId}/${diat.getFullYear()}/${this.getWeekNumber(diat)}`)
    nameRef3.on('value', (snapshot2) => {
      this.setState({ ticUsuario: snapshot2.val() })
    });

  }

  componentDidUpdate() {
    const messages = document.getElementById('chatHup');
    // console.log(messages.scrollHeight);
    messages.scrollTop = messages.scrollHeight;

  }

  getWeekNumber(date) {
    var d = new Date(date);  //Creamos un nuevo Date con la fecha de "this".
    d.setHours(0, 0, 0, 0);   //Nos aseguramos de limpiar la hora.
    d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Recorremos los días para asegurarnos de estar "dentro de la semana"
    //Finalmente, calculamos redondeando y ajustando por la naturaleza de los números en JS:
    return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
  };

  renderConsultarUltimaTarea() {
    const diat = new Date();
    const nameRef2 = firebase.database().ref().child(`Usuario-UltimaTarea/${this.props.userId}/${diat.getFullYear()}/${this.getWeekNumber(diat)}/${diat.getDate()}`)
    nameRef2.on('value', (snapshot2) => {
      this.setState({ ultimaTarea: snapshot2.val() });
    });
  }




  cerrarChat = () => {
    this.timeout = setTimeout(() => {
      console.log(this.props.datoClose);
      if (this.props.datoClose === false)
        this.props.chatOff();
      else
        this.props.datoCloses(false);
    }, timeoutLength)
  }


  //Envio a slack el mensaje 
  renderEnvioSlack(activeChat, userID) {

    const valor = this.props.valorInput.text ? this.props.valorInput.text : this.props.valorInput.value;
    if (valor.trim() === '') return;
    this.handleOpen(valor, activeChat.chatID, userID);


    if (activeChat.participants !== '6') {
      let canal = null;
      if (activeChat.participants === '2') {
        canal = this.props.consultaCanal.notificaciones;
      }
      else if (activeChat.participants === '3') {
        canal = this.props.consultaCanal.equipo;
      }

      else if (activeChat.participants === '4') {
        canal = this.props.consultaCanal.reporting;
      }
      this.state.client2.postMessage(
        canal,
        {
          username: this.props.usuarioDetail.usuario.canalSlack,
          text: valor,
          attachments: [
            {
              text: this.props.nombreUser,
              username: this.props.usuarioDetail.usuario.canalSlack,
              callback_id: 'wopr_game',
              color: '#FFA303',
              attachment_type: 'default',
              /* actions: [
                 {
                   name: 'game',
                   text: 'Chess',
                   type: 'button',
                   value: 'chess',
                 }
               ]*/
            },
          ]
        }

      );
    }
    this.props.valorInputs(' ');
  }


  //Envio a slack el mensaje 
  renderEnvioSlackGestor(chatTrazo, canalS) {
    /// Envia el feedback directamente al canal del slack

    let canal = canalS;

    let mensaje = chatTrazo[2].text === 'Dar un Feedback' ? chatTrazo[4].text : chatTrazo[2].text; //this.props.valorInput
    this.state.client2.postMessage(
      canal,
      {
        text: this.props.nombreUser,
        username: this.props.usuarioDetail.usuario.canalSlack,
        attachments: [
          {
            text: mensaje,
            //   fallback: 'You are unable to choose a game',
            callback_id: 'wopr_game',
            color: '#ffB600',
            attachment_type: 'default',
            actions: [
              {
                name: 'game',
                text: 'Feedback',
                type: 'button',
                value: 'chess',
              }
            ]
          },
        ]
      }

    );


    //this.props.valorInputs(' ');
  }



  renderHistoricoHuper(usuario, conceptoT, Tipo) {

    const fecha = new Date();

    firebase.database().ref(`Usuario-Historico/${usuario}/${fecha.getFullYear()}/${fecha.getMonth()}/${fecha.getDate()}/${fecha.getTime()}`).set({
      concepto: conceptoT,
      tipo: Tipo
    });


  }


  renderUsuarioImagen(message) {

    let nombre = message;
    let image = perfil;
    if (message === 'Huper') {
      nombre = 'Huper';
      image = huper;
    }

    else if (message === 'Equipo') {
      nombre = 'Equipo';
      image = equipo;
    }

    else if (message === 'Reporting') {
      nombre = 'Report';
      image = report;
    }
    else if (message === 'Notifica') {
      nombre = 'Notifiaciones';
      image = info;
    }

    return (

      <div>
        <Image src={image} circular style={{ top: '20px', position: 'relative', transform: 'scale(0.18)' }}>
        </Image>
        <div style={{ height: "3em", width: "20em", top: '-150px', left: this.props.estadochat === "dimmer Plan" ? '120px' : '60%', position: 'relative' }}>

          <h2 >
            {nombre}
          </h2>
        </div>

      </div>
    );




  }



  /// Identificador de usuario y color 
  renderUsuario(contacts, message) {

    let nombre = "Hupp";
    let image = 'https://files.informabtl.com/uploads/2015/08/perfil.jpg';
    if (message.from === '6') {
      nombre = 'Huper';
      image = huper;
    }

    else if (message.from === '4') {
      nombre = 'Report';
      image = report;
    }

    else if (message.from === '5') {
      nombre = 'Info';
      image = info;
    }
    else {


      if (!Array.isArray(message.text))
        nombre = message.text.split('•');
      nombre = Array.isArray(nombre) ? nombre[1] === 'undefined' ? 'Hupp' : nombre[1] : 'Hupp';

    }

    return <Label as='a' content={nombre} image={

      {
        avatar: true,
        spaced: 'right',
        src: image,
        style: {
          transform: message.from === '6' ? 'scale(5,3)' : 'scale(1.8)',
          'position': 'relative',
          top: '-20px',
          left: '-10px',
        }
      }
    } style={{
      width: '50px',
      left: '-1px',
      position: 'relative',
      color: '#601565',
      'border-radius': '30px',
      'background-color': '#ffffff00',
      transform: 'scale(0.8)'
    }} />


  }

  ///Decodificar mensaje y poner los emojis
  renderTextoEmoji(textos) {
    //console.log(textos);
    if (Array.isArray(textos) === true) {
      const mensajes = Object.keys(textos).map((key, index) => {
        let separador = ', ';
        if ((textos.length - 1).toString() === key)
          separador = '';
        return this.renderTextoEmojis(textos[key] + separador);
      });
      return mensajes;
    }
    else {
      return this.renderTextoEmojis(textos);
    }
  }

  renderTextoEmojis(texto) {
    let x = 0;
    let y = 0;
    let opciones = texto.split(':').map((consulta) => {
      y++;
      x++;
      if (consulta === ' ')
        return consulta;
      if (consulta === '@')
        return;

      if (x === 1) {
        let x2 = 0;
        let y2 = 0;
        let opciones3 = consulta.split('@<').map((consulta2) => {
          y2++;
          x2++;
          if (x2 === 1) {
            x2++;

            return consulta2 === undefined ? '' : consulta2;
          }
          else
            return;
        });

        return opciones3;
      }
      else if (texto.split(':').length > 2 && x > 1) {
        x = 0;
        return (<Emoji key={y} emoji={{ id: consulta, skin: 3 }} size={19} />);
      }
      else
        return ':' + consulta === undefined ? '' : consulta;
    });

    x = 0;
    y = 0;
    let opciones2 = texto.split('@<').map((consulta) => {
      y++;
      x++;
      if (x === 1) {
        x++;
        return;
      }
      else {
        x = 0;
        this.onSearchXpress(consulta);
        if (!this.state.avataresN)
          this.setState({ avataresN: Math.round(Math.random() * 20) });
        //   console.log(this.props.avatar);

        if (this.props.avatar && this.props.avatar[1]) {
          const srcLink = this.props.avatar ? this.props.avatar[this.state.avataresN ? this.state.avataresN : 0] ? this.props.avatar[this.state.avataresN ? this.state.avataresN : 0].embed_url : null : null;
          return (<React.Fragment key={y}>
            <iframe src={srcLink} style={{ width: '160px', height: '90px' }} key={y}></iframe>
          </React.Fragment>);
        }
        else
          return;
      }

    });

    return (<React.Fragment>
      {opciones}
      {opciones2}
    </React.Fragment>);

  }


  PreguntasRepEspecial(tipo, mensaje, arreglo, indice) {
    let arry = arreglo;
    let indiceA = indice;
    if (tipo === '10') {
      const valor = this.props.valorInput.text ? this.props.valorInput.text : this.props.valorInput.value;
      const valRepetido = valor;
      Object.keys(valRepetido).map(function (key, index) {
        arry[indiceA] = { concepto: mensaje.replace('#>Nombre<#', valRepetido[key]), tipoPregunta: '5' };
        indiceA++;

      });
      this.props.consultaChats(arry);
      return arry;
    }
    else
      return arreglo;
  }



  //Relaciona la carpeta con el objetivo
  RelacionarCarpetaObjetivo = (datos, idcarpeta) => {

    var updates = {};
    const dt = { ...datos.datos, carpeta: idcarpeta };
    updates[datos.key] = dt;
    firebase.database().ref().update(updates);

  }

  renderActualizarActividades(cconsulta) {

    let arrayT = [];
    let array = [];
    const obj = cconsulta;
    Object.keys(obj).map((key2, index) => {
      let tar = obj[key2];
      Object.keys(tar).map((key, index) => {
        const objTar = { ...tar[key], key: key }
        arrayT.push(objTar);
      });
    });

    arrayT.sort((obj1, obj2) => { return parseInt(obj1.dificultad) - parseInt(obj2.dificultad); });

    let fechaTrabajo = '09:00';
    Object.keys(arrayT).map((key, index) => {
      if (arrayT[key].dateStart === moment(new Date()).format('YYYY-MM-DD')) {
        const h = parseInt(arrayT[key].tiempoEstimado.substring(0, 2));
        console.log(h)
        fechaTrabajo = arrayT[key].horaPlanificada;
        arrayT[key].horaPlanificada = fechaTrabajo;
        arrayT[key].horaEstimada = moment(fechaTrabajo, 'HH:mm').add('hours', h).format('HH:mm');
        fechaTrabajo = arrayT[key].horaEstimada;
        const valorTarea = { ...arrayT[key], key: null }
        array[arrayT[key].key] = valorTarea;
      }
    });

    Object.keys(cconsulta).map((key2, index) => {
      let tar = cconsulta[key2];
      Object.keys(tar).map((key, index) => {
        Object.keys(array).map((key3, index) => {
          if (key3 == key) {
            tar[key] = array[key3];
          }
        });
      });
    });

    return cconsulta;

  }


  onSubmit = (activeChat, userID) => {


    if (!this.props.valorInput) return;
    const valor = this.props.valorInput.text ? this.props.valorInput.text : this.props.valorInput.value;
    if (!valor) return;
    if (!Array.isArray(valor))
      if (valor.trim() === '') return;
    this.handleOpen(valor, activeChat.chatID, userID);



    let valorNPregunta = this.props.numeroPregunta;
    let consultaBD = this.props.consultaPregunta;
    let vacio = ' ';
    // console.log(this.props.consultaPregunta[this.props.numeroPregunta]);
    if (this.props.consultaPregunta[this.props.numeroPregunta].tipoPregunta === '3') {
      ///opciones de consulta 
      /// observa la seleccion y cambia la consulta dependiendo la actividad... cualquier cambiar los condicionales 


      if (valor === 'Consultar') {
        this.props.tipoPreguntas('Consulta Detalle Tarea');
        const chatTrazo = this.props.user.userChats[0].thread
        const cconsulta = this.props.consultax;
        let valorConsulta = {};
        Object.keys(cconsulta).map(function (key, index) {
          //console.log(cconsulta[key]);
          const ccconsulta = cconsulta[key];
          Object.keys(ccconsulta).map(function (key, index) {
            if (ccconsulta[key].concepto === chatTrazo[2].text) {
              valorConsulta = ccconsulta[key];
              return ccconsulta[key];
            }

          });

        });

        let imp = 'Baja';
        if (parseInt(valorConsulta.dificultad) >= 0 && parseInt(valorConsulta.dificultad) < 3)
          imp = 'Alta';
        else if (parseInt(valorConsulta.dificultad) >= 3 && parseInt(valorConsulta.dificultad) < 6)
          imp = 'Media';
        this.handleOpen(`-> Nombre de la tarea:    ${valorConsulta.concepto}`, activeChat.chatID, this.props.idChatUser)
        this.handleOpen(`-> Prioriodad de la tarea:   ${valorConsulta.prioridad}`, activeChat.chatID, this.props.idChatUser);
        this.handleOpen(`-> Nivel de Importancia:   ${valorConsulta.dificultad}`, activeChat.chatID, this.props.idChatUser);
        this.handleOpen(`-> Tiempo Estimado:   ${imp}`, activeChat.chatID, this.props.idChatUser);
        timeoutLength = 10000;

      }
      else if (valor === 'Editar') {
        valorNPregunta = 0;
        this.props.tipoPreguntas('EditarTarea');
        vacio = 'x';
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LWgES6beV855nYSVLtM');
        starCountRef.on('value', (snapshot) => {
          this.props.consultaChats(snapshot.val());
          consultaBD = snapshot.val();
          if (!this.props.primeraV) {
            const mensaje = consultaBD[1].concepto;
            this.handleOpen(mensaje, activeChat.chatID, this.props.idChatUser);
            this.props.primeraVs(true);
          }
        });


      }
      else if (valor === 'Marcar como terminada') {
        const cconsulta = this.props.consultax;
        const chatTrazo = this.props.user.userChats[0].thread;
        let tarea = {};
        const userIDs = this.props.userId;
        const ultimoValor = chatTrazo[2].text;
        Object.keys(cconsulta).map((key2, index) => {
          const ccconsulta = cconsulta[key2];


          Object.keys(ccconsulta).map((key, index) => {
            if (ultimoValor === ccconsulta[key].concepto) {
              tarea = ccconsulta[key];
              //Actualiza el objetivo conjunto
              const objs = this.props.listaObjetivo.objetivos;
              if (tarea.estado === 'activo' || tarea.estado === 'trabajando') {
                Object.keys(objs).map((key3, index) => {
                  if (key3 === key2 && objs[key3].compartidoEquipo) {

                    let avanceObjGlobal = Math.round(parseInt(objs[key3].porcentajeResp) * objs[key3].avanceObjetivo);
                    let objetivoPadre = null;
                    //busca el objetivo padre
                    const starCountRef = firebase.database().ref().child(`Usuario-Objetivos/${objs[key3].idUsuarioGestor}/${objs[key3].objetivoPadre}`);
                    starCountRef.on('value', (snapshot) => {
                      objetivoPadre = snapshot.val();
                      let devolver = objetivoPadre.avance;
                      let devAnt = objs[key3].avancePadre;
                      devolver = devolver - devAnt;
                      objetivoPadre.avance = devolver + avanceObjGlobal;

                    })
                    if (objetivoPadre)
                      firebase.database().ref(`Usuario-Objetivos/${objs[key3].idUsuarioGestor}/${objs[key3].objetivoPadre}`).set({
                        ...objetivoPadre
                      });

                    firebase.database().ref(`Usuario-Objetivos/${this.props.userId}/${key3}`).set({
                      ...objs[key3], avancePadre: avanceObjGlobal, nTareas: Object.keys(cconsulta[key2]).length
                    });


                  }
                });
              }
              tarea.estado = 'finalizado';

              var updates = {};
              updates[`Usuario-Tareas/${userIDs}/${key2}/${key}`] = { ...tarea, dateEnd: moment().format('YYYY-MM-DD'), tiempoFin: new Date().getTime() };
              firebase.database().ref().update(updates);
              this.renderHistoricoHuper(this.props.userId, `Ha terminado : ${ultimoValor}`, 'trabajo');


            }

          });
        });

        this.props.estadochats('seguimienT');// Seguimiento por terminar la Actividad
      }
      else if (valor === 'Consultar el trabajo de mi colaborador') {

        valorNPregunta = 0;
        consultaBD = null;
        this.props.tipoPreguntas('Consultar Equipo Gestor');
        vacio = ' ';
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LXt_NqMTxrwo-Ap7UTR');
        starCountRef.on('value', (snapshot) => {


          this.props.consultaChats(snapshot.val());
          consultaBD = snapshot.val();
          console.log(consultaBD);
          if (!this.props.primeraV) {
            const mensaje = consultaBD[1].concepto;
            this.handleOpen(mensaje, activeChat.chatID, this.props.idChatUser);
            this.props.primeraVs(true);
          }
        });


      }

      else if (valor === 'Crear un Objetivo') {

        valorNPregunta = 0;
        consultaBD = null;
        this.props.tipoPreguntas('Crear Objetivo Gestor');
        vacio = 'x';
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LXtZVCN7-52d44THkXP');
        starCountRef.on('value', (snapshot) => {
          this.props.consultaChats(snapshot.val());
          consultaBD = snapshot.val();
          if (!this.props.primeraV) {
            const mensaje = consultaBD[1].concepto;
            this.handleOpen(mensaje, activeChat.chatID, this.props.idChatUser);
            this.props.primeraVs(true);
          }
        });

      }

      else if (valor === 'Dar un Feedback') {

        valorNPregunta = 0;
        consultaBD = null;
        this.props.tipoPreguntas('Crear Feedback Gestor');
        vacio = 'x';
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LXt_CrEJFXvUlEN_tp5');
        starCountRef.on('value', (snapshot) => {
          this.props.consultaChats(snapshot.val());
          consultaBD = snapshot.val();
          if (!this.props.primeraV) {
            const mensaje = consultaBD[1].concepto;
            this.handleOpen(mensaje, activeChat.chatID, this.props.idChatUser);
            this.props.primeraVs(true);
          }
        });

      }
    }

    let flagEliminar = false;

    if (valor === 'Eliminar') {
      flagEliminar = true;
      const chatTrazo = this.props.user.userChats[0].thread
      const cconsulta = this.props.consultax;
      let tarea = {};
      let idObjetivo = {};
      let idTarea = {};
      Object.keys(cconsulta).map(function (key2, index) {
        const ccconsulta = cconsulta[key2];
        Object.keys(ccconsulta).map(function (key, index) {
          //            console.log(ccconsulta[key]);
          if (chatTrazo[2].text === ccconsulta[key].concepto) {
            tarea = ccconsulta[key];
            idObjetivo = key2;
            idTarea = key;
          }

        });
      });
      valorNPregunta = valorNPregunta + 1;
      firebase.database().ref(`Usuario-Tareas/${this.props.userId}/${idObjetivo}/${idTarea}`).remove();

      const hoy = new Date();
      let diaS = moment(hoy).add('days', hoy.getDay() > 5 ? hoy.getDay() - 4 : 0);

      firebase.database().ref(`Usuario-Activiades/${this.props.userId}/${diaS.format('YYYY')}/${diaS.format('MM')}/${diaS.format('DD')}`).set({
        horaInicio: hoy.getTime(),
        cantidad: this.props.MensajeIvily.nActIVi - 1,
      });
      this.props.MensajeIvilys({ ...this.props.MensajeIvily.nActIVi, nActIVi: this.props.MensajeIvily.nActIVi - 1 });
      this.renderHistoricoHuper(this.props.userId, `Elimino Tarea : ${chatTrazo[2].text}`, 'trabajo');
    }
    else if (valor === 'Ninguna') {
      valorNPregunta = valorNPregunta + 1;
      this.props.consultaPreguntaControls(valorNPregunta + 1);
    }


    if (this.props.pregFantasma && !this.props.pregFantasma.sel) {
      const opcione = this.props.pregFantasma;
      const sel = valor;
      const opcionw = { ...opcione, sel }
      this.props.pregFantasmas(opcionw)
    }


    let saltar = false;
    if (this.props.pregFantasma && this.props.pregFantasma.sel && !this.props.pregFantasma.reload) {
      let pasar = false;
      Object.keys(this.props.pregFantasma.consultaOp).map((key, index) => {
        if (this.props.pregFantasma.consultaOp[key] === this.props.pregFantasma.sel) {
          pasar = true;
        }
      });

      if (pasar === false) {

        if (!this.props.primeraV)
          saltar = true;
        valorNPregunta = 0;
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-L_gZJBmlV7v-wUeF3Tr');
        starCountRef.on('value', (snapshot) => {
          this.props.consultaChats(snapshot.val());
          consultaBD = snapshot.val();
          const opcione = this.props.pregFantasma;
          const reload = true;
          const opcionw = { ...opcione, reload };
          this.props.pregFantasmas(opcionw);
          this.props.numeroPreguntas(1);

          if (!this.props.primeraV) {
            const mensaje = consultaBD[1].concepto;
            this.handleOpen(mensaje, activeChat.chatID, this.props.idChatUser);
            this.props.primeraVs(true);
          }
        });
      }

    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///valida para reescribir la pregunta.
    if (consultaBD === null) return;
    if (valorNPregunta < consultaBD.length - 1) {

      if (saltar === false) {
        this.props.numeroPreguntas(valorNPregunta + 1);
        const chatTrazo = this.props.user.userChats[0].thread;

        if (chatTrazo[1].text !== consultaBD[valorNPregunta + 1].concepto) {
          let mensaje = consultaBD[valorNPregunta + 1].concepto;
          consultaBD = this.PreguntasRepEspecial(consultaBD[valorNPregunta + 1].tipoPregunta, mensaje, consultaBD, valorNPregunta + 1);
          mensaje = consultaBD[valorNPregunta + 1].concepto;
          this.handleOpen(mensaje, activeChat.chatID, this.props.idChatUser);
        }
      }
      // console.log(valorNPregunta);
    }
    else {


      const chatTrazo = this.props.user.userChats[0].thread;
      const tipPrgutna = this.props.tipoPregunta;
      const consultaObj = this.props.consultax;

      if (tipPrgutna === 'Diaria') {


        //registro de horas Entrada
        const hoy = new Date();
        //si la fecha es el viernes
        const diamaximo = this.props.usuarioDetail.usuario.diaSemana ? this.props.usuarioDetail.usuario.diaSemana : 5;
        let diaS = moment(hoy).add('days', hoy.getDay() > diamaximo ? hoy.getDay() - (diamaximo - 1) : !this.props.MensajeIvily.inicio ? 0 : this.props.MensajeIvily.nActIVi < 6 ? 0 : 1);

        if (moment(moment(diaS).format('YYYY-MM-DD')) < moment())
          diaS = moment();

        firebase.database().ref(`Usuario-Activiades/${this.props.userId}/${diaS.format('YYYY')}/${diaS.format('MM')}/${diaS.format('DD')}`).set({
          horaInicio: hoy.getTime(),
          cantidad: this.props.MensajeIvily.nActIVi ? + 1 + this.props.MensajeIvily.nActIVi : 1
        });
        //graba el inicio del dia



        if (!this.props.MensajeIvily.fin && this.props.MensajeIvily.nActIVi >= 5) {
          //graba el ultimo dia planificado
          firebase.database().ref(`Usuario-Registro/${this.props.userId}/${hoy.getFullYear()}/${hoy.getMonth()}/${hoy.getDate()}`).set({
            horaInicio: hoy.getTime(),
          });
          firebase.database().ref(`Usuario/${this.props.userId}`).set({
            ...this.props.usuarioDetail.usuario, fechaPlan: diaS.format('YYYY/MM/DD'),
          });

          diaS = moment(hoy);
          if (this.props.MensajeIvily.inicio && this.props.estadochat === 'Despedida') {

            firebase.database().ref(`Usuario-Inicio/${this.props.userId}/${diaS.format('YYYY')}/${diaS.format('MM')}/${diaS.format('DD')}`).set({
              ...this.props.MensajeIvily,
              fin: hoy.getTime(),
            });

          }
        }

        //planificacion dia siguiente
        let cantidadActividades = this.props.MensajeIvily.nActIVi ? + 1 + this.props.MensajeIvily.nActIVi : 1;
        if (this.props.estadochat === 'Despedida') {


          if (moment(diaS).day() > diamaximo) {
            diaS = diaS.add('days', new Date(diaS.format('YYYY,MM,DD')).getDay() - (this.props.usuarioDetail.usuario.diaSemana ? this.props.usuarioDetail.usuario.diaSemana - 1 : 4));
          }
          if (moment(moment(diaS).format('YYYY-MM-DD')) < moment())
            diaS = moment();

          firebase.database().ref(`Usuario-Activiades/${this.props.userId}/${diaS.format('YYYY')}/${diaS.format('MM')}/${diaS.format('DD')}`).set({
            cantidad: cantidadActividades
          });

          if (this.props.MensajeIvily.nActIVi + 1 > 5)
            this.props.estadochat(null);
        }

        let postData;
        let newPostKey2;
        // let numeroTareaObj = 0;
        if (consultaObj) {

          //Edita el objetivo
          Object.keys(consultaObj).map(function (key2, index) {
            if (consultaObj[key2].concepto === chatTrazo[4].text) {
              consultaObj[key2].numeroTareas = 1 + consultaObj[key2].numeroTareas;
              postData = consultaObj[key2];
              newPostKey2 = key2;
            }
          });
        }

        //Crea el objetivo 
        let flagOb = false;
        if (!newPostKey2) {
          flagOb = true;
          ///Crea la carpeta en donde se subiran los archivos adjuntos al objetivo
          //Crear espacio de trabajo para el objetio
          var folderId = this.props.usuarioDetail.usuario.wsCompartida;
          window.gapi.client.drive.files.create({
            name: chatTrazo[4].text,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [folderId]
            //fields: 'id'
          }).then((response) => {
            this.RelacionarCarpetaObjetivo(this.state.updates, response.result.id);
          },
            function (err) { console.error("Execute error", err); });
          //   this.props.crearCarpetas(xx);
          newPostKey2 = firebase.database().ref().child(`Usuario-Objetivos/${this.props.userId}`).push().key;
          postData = {
            numeroTareas: 1,
            concepto: chatTrazo[4].text,
            //   estado: 'validar' preguntar a las personas,
            estado: 'activo',
            carpeta: this.state.carpeta,
            prioridad: 'normal',
            fechafin: moment(this.validarFechaSemanaMax()).format('YYYY-MM-DD'),
            impacto: chatTrazo[8].text,
            dificultad: chatTrazo[10].text,
            repeticiones: chatTrazo[12].text,
            tipo: valor,
            fase: 0,
            dateStart: moment().format('YYYY-MM-DD'),
          };
        }
        //Borrar variables
        this.props.pregFantasmas(null);

        var updates = {};
        updates[`Usuario-Objetivos/${this.props.userId}/${newPostKey2}`] = postData;
        this.setState({ updates: { key: `Usuario-Objetivos/${this.props.userId}/${newPostKey2}`, datos: postData } });
        firebase.database().ref().update(updates);

        var newPostKey3 = firebase.database().ref().child('Usuario-Tareas').push().key;

        ///distincion de horas
        let hora = parseInt(chatTrazo[6].text.substring(0, 2));
        //Restar fechas
        // moment.duration(lunch - breakfast).humanize()
        //recupera la ultima tarea

        //

        const diat = new Date();
        let inicioTarea = cantidadActividades === 1 ? moment().format('HH:mm') : this.state.ultimaTarea.horaEstimada;
        if (this.props.estadochat === 'Despedida')
          inicioTarea = cantidadActividades === 1 ? moment('8:00', 'HH:mm').format('HH:mm') : this.state.ultimaTarea.horaEstimada;


        if (!this.state.ultimaTarea) {
          firebase.database().ref(`Usuario-UltimaTarea/${this.props.userId}/${diat.getFullYear()}/${this.getWeekNumber(diat)}/${diat.getDate()}`).set({
            tarea: newPostKey3,
            horaPlanificada: inicioTarea,
            horaEstimada: moment(inicioTarea, 'HH:mm').add('hours', hora).format('HH:mm'),
          });
        }


        firebase.database().ref(`Usuario-Tareas/${this.props.userId}/${newPostKey2}/${newPostKey3}`).set({
          concepto: chatTrazo[2].text,
          estado: 'activo',
          dateStart: moment(diaS).format('YYYY-MM-DD'),
          prioridad: postData.prioridad,
          tiempoEstimado: chatTrazo[6].text,
          dificultad: flagOb === true ? '3' : Number.isInteger(parseInt(this.props.valorInput.value)) ? parseInt(this.props.valorInput.value) : '3',
          horaPlanificada: inicioTarea,
          horaEstimada: moment(inicioTarea, 'HH:mm').add('hours', hora).format('HH:mm')
        });




        //
        //Crear actividad en calendar





        var event = {
          'summary': chatTrazo[2].text,
          // 'location': '800 Howard St., San Francisco, CA 94103',
          'description': chatTrazo[4].text,
          'start': {
            'dateTime': moment(inicioTarea, 'HH:mm'),
            'timeZone': 'America/Los_Angeles'
          },
          'end': {
            'dateTime': moment(inicioTarea, 'HH:mm').add('hours', hora),
            'timeZone': 'America/Los_Angeles'
          },
          //   'recurrence': [
          //     'RRULE:FREQ=DAILY;COUNT=2'
          // ],
          'attendees': [
            //  { 'email': 'lpage@example.com' },
            //  { 'email': 'sbrin@example.com' }
          ],
          'reminders': {
            'useDefault': false,
            'overrides': [
              { 'method': 'email', 'minutes': 24 * 60 },
              { 'method': 'popup', 'minutes': 10 }
            ]
          }

        };

        const calendarZ = this.props.usuarioDetail.calendar;
        window.gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
          .then(function () {
            //  console.log("GAPI client loaded for API");
            //Crear un evento
            window.gapi.client.calendar.events.insert({
              'calendarId': calendarZ,
              'resource': event
            })
              .then(function (response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response /:" + response);
              },
                function (err) { console.error("Execute error", err); });
          },
            function (err) { console.error("Error loading GAPI client for API", err); });







        firebase.database().ref(`Usuario-UltimaTarea/${this.props.userId}/${diat.getFullYear()}/${this.getWeekNumber(diat)}/${diat.getDate()}`).set({
          tarea: newPostKey3,
          dateStart: moment().format('YYYY-MM-DD'),
          horaPlanificada: inicioTarea,
          horaEstimada: moment(inicioTarea, 'HH:mm').add('hours', hora).format('HH:mm'),
        });



        /// onboarding 

        if (this.props.pasoOnboarding === 10)
          this.props.pasoOnboardings(this.props.pasoOnboarding + 1);

        this.renderHistoricoHuper(this.props.userId, `Creo Tarea : ${chatTrazo[2].text} `, 'trabajo');


        /*
                if (this.props.MensajeIvily.nActIVi + 1 < 5) {
                  this.props.numeroPreguntas(1); ///borra el chat    
                  this.props.consultaPreguntaControls(1);
                  const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LgWkJYCoe1SyY4rDqWO');
                  starCountRef.on('value', (snapshot) => {
                    this.props.consultaChats(snapshot.val());
                    consultaBD = snapshot.val();
                    this.props.submitMessage(snapshot.val()[this.props.numeroPregunta].concepto + ', ¡Recuerda planificar solo 6 actividades al día!', activeChat.chatID, this.props.idChatUser);
                  });
                }
        
        */
      }
      else if (tipPrgutna === 'EditarTarea') {

        if (flagEliminar === false) {
          const cconsulta = this.props.consultax;
          let tarea = {};
          const ultimoValor = valor;
          Object.keys(cconsulta).map(function (key2, index) {
            const ccconsulta = cconsulta[key2];
            Object.keys(ccconsulta).map(function (key, index) {
              //            console.log(ccconsulta[key]);
              if (chatTrazo[2].text === ccconsulta[key].concepto) {
                tarea = ccconsulta[key];
                if (chatTrazo[6].text === 'Importancia') {
                  ccconsulta[key].dificultad = ultimoValor;
                }
                else if (chatTrazo[6].text === 'Tiempo Estimado') {
                  ccconsulta[key].tiempoEstimado = ultimoValor;
                  ccconsulta[key].horaEstimada = moment(ccconsulta[key].horaPlanificada, 'hh:mm').add('hours', parseInt(ultimoValor.substring(0, 2))).format('HH:mm')
                }
                else {
                  ccconsulta[key].concepto = ultimoValor;
                }
              }
            });
          });




          var updates = {};
          updates[`Usuario-Tareas/${this.props.userId}`] = this.renderActualizarActividades(cconsulta);
          firebase.database().ref().update(updates);
          this.renderHistoricoHuper(this.props.userId, `Edito Tarea : ${chatTrazo[2].text} `, 'trabajo');
        }
      }

      else if (tipPrgutna === 'TIC') {
        const diat = new Date;

        //Reglas de planificacion
        let diaS = moment(diat);

        firebase.database().ref(`Usuario-TIC/${this.props.userId}/${diat.getFullYear()}/${this.getWeekNumber(diat)}`).set({
          ...Tic_T(this.props.ValorTexto, this.state.valoresTIC, this.state.ticUsuario)

        });
        if (this.props.objTIM) {
          firebase.database().ref(`Usuario-Objetivos/${this.props.userId}/${this.props.objTIM.key}`).set({
            ...this.props.objTIM.obj, estadoTIM: true, estado: 'validar'
          });
        }
        if (this.props.estadochat === 'TIM Media') {
          firebase.database().ref(`Usuario-Inicio/${this.props.userId}/${diaS.format('YYYY')}/${diaS.format('MM')}/${diaS.format('DD')}`).set({
            ...this.props.MensajeIvily,
            estadoTIMS: true
          });
        }
        if (this.props.estadochat === 'TIM Semana') {
          firebase.database().ref(`Usuario-Inicio/${this.props.userId}/${diaS.format('YYYY')}/${diaS.format('MM')}/${diaS.format('DD')}`).set({
            ...this.props.MensajeIvily,
            estadoTIMF: true
          });
        }
        this.props.estadochats(null);
        this.props.objTIMs(null);
        if (this.props.pasoOnboarding === 14)
          this.props.pasoOnboardings(this.props.pasoOnboarding + 1);

      }
      else if (tipPrgutna === 'ContinuarTrabajo') {
        if (this.props.MensajeIvily.inicio && valor === 'Si') {
          let dateF = new Date();
          if (this.props.usuarioDetail.usuario.fechaPlan)
            dateF = moment(this.props.usuarioDetail.usuario.fechaPlan, 'YYYY/MM/DD').format('YYYY,MM,DD')
          const hoy = new Date(dateF);
          const tiempo = new Date().getTime();
          let ant = moment(new Date(this.props.MensajeIvily.inicio));

          //Reglas de planificacion
          let diaS = moment(hoy);
          if (this.props.MensajeIvily && this.props.MensajeIvily.nActIVi > 5 && this.props.estadochat === 'PlanSiguiente') {
            diaS = moment(hoy).add('days', 1);

          }
          else {
            if (hoy.getDate() < new Date().getDate()) { diaS = moment(hoy).add('days', 1); }
            else if (hoy.getDate() > new Date().getDate()) { diaS = moment(new Date()); }
          }
          const maxdia = this.props.usuarioDetail.usuario.diaSemana ? this.props.usuarioDetail.usuario.diaSemana : 5;
          if (moment(diaS).day() > maxdia) {
            diaS = diaS.add('days', new Date(diaS.format('YYYY,MM,DD')).getDay() - (this.props.usuarioDetail.usuario.diaSemana ? this.props.usuarioDetail.usuario.diaSemana - 1 : 4));
          }
          if (moment(moment(diaS).format('YYYY-MM-DD')) < moment())
            diaS = moment();

          firebase.database().ref(`Usuario-Inicio/${this.props.userId}/${diaS.format('YYYY')}/${diaS.format('MM')}/${diaS.format('DD')}`).set({
            ...this.props.MensajeIvily,
            horaActivacion: tiempo,
            estado: 'activo'
          });

          this.props.estadochats('activo');
        }

      }

      else if (tipPrgutna === 'TIC Quincenal') {
        const postData = {
          FechaTIC: new Date().toString(),
          Talento: chatTrazo[2].text,
          Impacto: chatTrazo[4].text,
          Compromiso: valor

        };
        var updates = {};
        const newPostKey2 = firebase.database().ref().child(`Usuario-TIC-EXP/${this.props.userId}`).push().key;
        updates[`Usuario-TIC-EXP/${this.props.userId}/${newPostKey2}`] = postData;
        firebase.database().ref().update(updates);
        this.renderHistoricoHuper(this.props.userId, `Realizo TIC Quincenal`, 'trabajo');

        if (!this.props.usuarioDetail.usuario.onboarding)
          this.handlePaso4();
      }
      else if (tipPrgutna === 'TIC Objetivos') {

        const cconsulta = this.props.consultax;
        let idObj;
        let objetivo;
        Object.keys(cconsulta).map(function (key, index) {
          if (cconsulta[key].concepto === chatTrazo[2].text) {
            idObj = key;
            objetivo = cconsulta[key];
          }

        });
        const postData = {
          FechaTIC: new Date().toString(),
          Talento: chatTrazo[4].text,
          Impacto: chatTrazo[6].text,
          IdObjetivo: idObj,
          Objetivo: chatTrazo[2].text,
          Compromiso: valor

        };

        objetivo.estado = 'finalizado';
        var updates = {};
        const newPostKey2 = firebase.database().ref().child(`Usuario-TIC-OBJETIVOS/${this.props.userId}`).push().key;
        updates[`Usuario-Objetivos/${this.props.userId}/${idObj}`] = objetivo;
        updates[`Usuario-TIC-OBJETIVOS/${this.props.userId}/${newPostKey2}`] = postData;
        firebase.database().ref().update(updates);
        this.renderHistoricoHuper(this.props.userId, `Realizo TIC Objetivos : ${chatTrazo[2].text} `, 'trabajo');
      }
      else if (tipPrgutna === 'Retrospectiva') {
        const postData = {
          FechaTIC: new Date().toString(),
          Obstaculo: chatTrazo[2].text,
          Recurso: chatTrazo[4] ? chatTrazo[4].text : valor,
          Descripcion: valor,

        };

        var updates = {};
        const newPostKey2 = firebase.database().ref().child(`Usuario-Retrospective/${this.props.userId}`).push().key;
        updates[`Usuario-Retrospective/${this.props.userId}/${newPostKey2}`] = postData;
        firebase.database().ref().update(updates);
        this.renderHistoricoHuper(this.props.userId, `Preguntas de la semana`, 'trabajo');
      }

      else if (tipPrgutna === 'Despedida') {
        //registro de hora de salida
        const hoy = new Date();
        let registro;
        const starCountRef5 = firebase.database().ref().child(`Usuario-Registro/${this.props.userId}/${hoy.getFullYear()}/${hoy.getMonth()}/${hoy.getDate()}`);
        starCountRef5.on('value', (snapshot) => {
          registro = snapshot.val();
          if (registro) {
            firebase.database().ref(`Usuario-Registro/${this.props.userId}/${hoy.getFullYear()}/${hoy.getMonth()}/${hoy.getDate()}`).set({
              ...registro,
              horaFin: hoy.getTime(),
              tiempoTrabajo: hoy.getTime() - registro.horaInicio,
            });
          }
        });


        ///eliminar tareas o dar para el siguiente dia 
        let cconsulta;
        var updates = {};
        let tarea = {};
        let tareasMan = 0;
        const diamaximo = this.props.usuarioDetail.usuario.diaSemana ? this.props.usuarioDetail.usuario.diaSemana : 5;
        let diaS = moment().add('days', 1);
        if (moment(diaS).day() > diamaximo) {
          diaS = diaS.add('days', new Date(diaS.format('YYYY,MM,DD')).getDay() - (this.props.usuarioDetail.usuario.diaSemana ? this.props.usuarioDetail.usuario.diaSemana - 1 : 4));
        }
        if (moment(moment(diaS).format('YYYY-MM-DD')) < moment())
          diaS = moment();

        const usuario = this.props.userId;
        const starCountRef = firebase.database().ref().child(`Usuario-Tareas/${this.props.userId}`);
        starCountRef.on('value', (snapshot) => {
          cconsulta = snapshot.val();
          Object.keys(cconsulta).map(function (key2, index) {
            const ccconsulta = cconsulta[key2];
            Object.keys(ccconsulta).map(function (key, index) {
              if (ccconsulta[key].estado === 'activo') {

                if (valor !== 'Eliminar Tareas')
                  tareasMan++;
                else
                  tarea.estado = 'anulado';
                tarea = ccconsulta[key];

                tarea.dateStart = moment(diaS).format('YYYY-MM-DD');
                updates[`Usuario-Tareas/${usuario}/${key2}/${key}`] = tarea;
              }

            });

          });

          firebase.database().ref().update(updates);
        });

        if (tareasMan > 0)
          firebase.database().ref(`Usuario-Activiades/${this.props.userId}/${diaS.format('YYYY')}/${diaS.format('MM')}/${diaS.format('DD')}`).set({
            cantidad: tareasMan
          });
        this.renderHistoricoHuper(this.props.userId, `Despedida del dia`, 'fin');

      }


      else if (tipPrgutna === 'Seguimiento' || tipPrgutna === 'Seguimiento Inicio') {

        const hoy = new Date();
        let diaS = moment(hoy);

        if (this.props.MensajeIvily && this.props.MensajeIvily.nActIVi > 5 && this.props.estadochat === 'PlanSiguiente') {
          diaS = moment(hoy).add('days', 1);
        }
        else {
          if (hoy.getDate() < new Date().getDate()) { diaS = moment(hoy).add('days', 1); }
          else if (hoy.getDate() > new Date().getDate()) { diaS = moment(new Date()); }
        }
        const maxdia = this.props.usuarioDetail.usuario.diaSemana ? this.props.usuarioDetail.usuario.diaSemana : 5;

        if (moment(diaS).day() > maxdia) {
          diaS = diaS.add('days', new Date(diaS.format('YYYY,MM,DD')).getDay() - (this.props.usuarioDetail.usuario.diaSemana ? this.props.usuarioDetail.usuario.diaSemana - 1 : 4));
        }
        if (moment(moment(diaS).format('YYYY-MM-DD')) < moment())
          diaS = moment();

        if (!this.props.MensajeIvily.inicio) {
          firebase.database().ref(`Usuario-Inicio/${this.props.userId}/${diaS.format('YYYY')}/${diaS.format('MM')}/${diaS.format('DD')}`).set({
            inicio: hoy.getTime(),
          });

          firebase.database().ref(`Usuario/${this.props.userId}`).set({
            ...this.props.usuarioDetail.usuario, fechaPlan: diaS.format('YYYY/MM/DD'),
          })
        }

        const cconsulta = this.props.consultax;
        let tarea = {};
        const userIDs = this.props.userId;
        const ultimoValor = valor;
        Object.keys(cconsulta).map((key2, index) => {
          const ccconsulta = cconsulta[key2];
          Object.keys(ccconsulta).map((key, index) => {
            const trab = tipPrgutna === 'Seguimiento Inicio' ? valor : chatTrazo[2].text;
            //            console.log(ccconsulta[key]);s
            if (trab === ccconsulta[key].concepto) {
              this.props.estadochats(null);
              tarea = ccconsulta[key];
              tarea.estado = 'trabajando';
              var updates = {};
              updates[`Usuario-Tareas/${userIDs}/${key2}/${key}`] = { ...tarea, tiempoInicio: new Date().getTime() };
              firebase.database().ref().update(updates);
              this.renderHistoricoHuper(this.props.userId, `Estas trabajando en ${trab}`, 'trabajo');
            }
            else if (ultimoValor === ccconsulta[key].concepto && tipPrgutna !== 'Seguimiento Inicio') {

              tarea = ccconsulta[key];
              //Actualiza el objetivo conjunto
              const objs = this.props.listaObjetivo.objetivos;
              if (tarea.estado === 'activo' || tarea.estado === 'trabajando') {
                Object.keys(objs).map((key3, index) => {
                  if (key3 === key2 && objs[key3].compartidoEquipo) {

                    let avanceObjGlobal = Math.round(parseInt(objs[key3].porcentajeResp) * objs[key3].avanceObjetivo);
                    let objetivoPadre = null;
                    //busca el objetivo padre
                    const starCountRef = firebase.database().ref().child(`Usuario-Objetivos/${objs[key3].idUsuarioGestor}/${objs[key3].objetivoPadre}`);
                    starCountRef.on('value', (snapshot) => {
                      objetivoPadre = snapshot.val();
                      let devolver = objetivoPadre.avance;
                      let devAnt = objs[key3].avancePadre;
                      devolver = devolver - devAnt;
                      objetivoPadre.avance = devolver + avanceObjGlobal;

                    })
                    if (objetivoPadre)
                      firebase.database().ref(`Usuario-Objetivos/${objs[key3].idUsuarioGestor}/${objs[key3].objetivoPadre}`).set({
                        ...objetivoPadre
                      });

                    firebase.database().ref(`Usuario-Objetivos/${this.props.userId}/${key3}`).set({
                      ...objs[key3], avancePadre: avanceObjGlobal, nTareas: Object.keys(cconsulta[key2]).length
                    });


                  }
                });
              }
              tarea.estado = 'finalizado';

              var updates = {};
              updates[`Usuario-Tareas/${userIDs}/${key2}/${key}`] = { ...tarea, dateEnd: moment().format('YYYY-MM-DD'), tiempoFin: new Date().getTime() };
              firebase.database().ref().update(updates);
              this.renderHistoricoHuper(this.props.userId, `Ha terminado : ${ultimoValor}`, 'trabajo');


            }

          });
        });

      }

      /////Preguntas Gestor ......
      else if (tipPrgutna === 'Crear Objetivo Gestor') {

        let x = 0;
        const equipo = this.props.equipoConsulta.listaPersonas;
        const usuario = chatTrazo[10].text.split(',');
        let usuarioGT;
        let keyUsuarioGT;
        let personaEquipo = 0;
        const newPostKey = firebase.database().ref().child(`Usuario-Objetivos/${this.props.userId}`).push().key;

        //Crea objetivo centralizado

        console.log(equipo);
        console.log(usuario);

        this.setState({ personasInv: [] });
        Object.keys(usuario).map((key3, index) => {
          console.log(usuario[key3])
          Object.keys(equipo).map((key2, index) => {
            if (usuario[key3] === equipo[key2].usuario) {
              personaEquipo++;
              usuarioGT = equipo[key2];
              keyUsuarioGT = key2;
              console.log(keyUsuarioGT);
              this.GuardarObjetivoGestor(usuarioGT, keyUsuarioGT, chatTrazo, personaEquipo, usuario.length, newPostKey, usuario[key3]);
            }


          });
        });

        if (chatTrazo[10].text.length > 1) {
          const postData = {
            concepto: chatTrazo[2].text === 'Crear un Objetivo' ? chatTrazo[4].text : chatTrazo[2].text,
            estado: 'activo',
            prioridad: 'urgente',
            fechafin: moment(this.validarFechaSemanaMax()).format('YYYY-MM-DD'),
            repeticiones: '1',
            dificultad: chatTrazo[8].text,
            personasInvolucradas: this.state.personasInv,
            impacto: chatTrazo[6].text,
            avance: 0,
            compartidoEquipo: true,
            gestor: true,
            dateStart: moment().format('YYYY-MM-DD')
          };

          firebase.database().ref(`Usuario-Objetivos/${this.props.userId}/${newPostKey}`).set({
            ...postData
          });
        }

        if (this.props.pasoOnboarding === 10)
          this.props.pasoOnboardings(this.props.pasoOnboarding + 1);
      }

      else if (tipPrgutna === 'Crear Feedback Gestor') {

        const chatTrazo = this.props.user.userChats[0].thread;
        const cconsulta = this.props.equipoConsulta.listaPersonas;
        const usuario = valor;
        let usuarioGT;
        Object.keys(cconsulta).map(function (key, index) {
          if (usuario === cconsulta[key].usuario) {
            usuarioGT = cconsulta[key];

          }
        });
        this.renderEnvioSlackGestor(chatTrazo, usuarioGT.canalSlack);
      }



      else if (tipPrgutna === 'Consultar Equipo Gestor') {

        const chatTrazo = this.props.user.userChats[0].thread;
        const activeChat = this.props.user.activeChat;
        const userID = this.props.user.userID;
        let x = 0;
        const cconsulta = this.props.equipoConsulta.listaPersonas;
        const usuario = valor;
        let usuarioGT;
        let keyUsuarioGT;
        const opciones2 = Object.keys(cconsulta).map((key, index) => {
          if (usuario === cconsulta[key].usuario) {
            usuarioGT = cconsulta[key];
            keyUsuarioGT = key;
          }
        });

        console.log(keyUsuarioGT);
        const fecha = new Date();

        const starCountRef = firebase.database().ref().child(`Usuario-Historico/${keyUsuarioGT}/${fecha.getFullYear()}/${fecha.getMonth()}/${fecha.getDate()}`);
        starCountRef.on('value', (snapshot) => {
          const historico = snapshot.val();

          if (!historico)
            return;
          const nunerso = Object.keys(historico).length - 1;
          const valore = Object.keys(historico).splice(nunerso);

          Object.keys(historico).map((key, index) => {
            if (valore[0] === key) {
              let fechaActividad = moment('2000-01-01 00:00:00').add(moment.duration(parseInt(key))).format('HH-mm-ss');
              const intro = ':thought_balloon: Su ultima actividad fue  ';
              this.handleOpen(
                intro,
                activeChat.chatID,
                userID
              );
              this.handleOpen(
                historico[key].concepto,
                activeChat.chatID,
                userID
              );

              this.handleOpen(
                fechaActividad = ':hourglass_flowing_sand: ' + fechaActividad + ':hourglass_flowing_sand:',
                activeChat.chatID,
                userID
              );
            }
          });


        });


      }
      //cerrar despues de realizado
      this.cerrarChat();

    }
    this.props.consultaPreguntaControls(valorNPregunta + 1);

    this.props.valorInputs(vacio);
    // inputX.value = '';
  }

  GuardarObjetivoGestor(usuarioGT, keyUsuarioGT, chatTrazo, personCont, personEquipo, clavePadre, nombreUsuario) {
    const valor = this.props.valorInput.text ? this.props.valorInput.text : this.props.valorInput.value;
    var folderId = usuarioGT.wsCompartida;
    window.gapi.client.drive.files.create({
      name: chatTrazo[2].text === 'Crear un Objetivo' ? chatTrazo[4].text : chatTrazo[2].text,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [folderId]
      //fields: 'id'
    }).then((response) => {
      //devuelve lo de la carpeta
      //  console.log("Response", response);
      this.RelacionarCarpetaObjetivo(this.state.updates, response.result.id);
    },
      function (err) { console.error("Execute error", err); });

    const newPostKey2 = firebase.database().ref().child(`Usuario-Objetivos/${keyUsuarioGT}`).push().key;
    let arr = this.state.personasInv;
    arr.push({ nombre: nombreUsuario, key: newPostKey2, idUsuario: keyUsuarioGT });
    this.setState({ personasInv: arr });
    const postData = {
      numeroTareas: 0,
      concepto: chatTrazo[2].text === 'Crear un Objetivo' ? chatTrazo[4].text : chatTrazo[2].text,
      estado: 'activo',
      carpeta: this.state.carpeta,
      prioridad: 'urgente',
      fechafin: moment(this.validarFechaSemanaMax()).format('YYYY-MM-DD'),
      compartidoEquipo: chatTrazo[10].text.length > 1 ? true : false,
      repeticiones: '1',
      dificultad: chatTrazo[8].text,
      personasInvolucradas: personEquipo > 1 ? chatTrazo[10].text : null,
      impacto: chatTrazo[6].text,
      detalle: personEquipo > 1 ? personCont < personEquipo ? chatTrazo[10 + (2 * personCont)].text : valor : valor,
      porcentajeResp: (100 / personEquipo),
      objetivoPadre: personEquipo > 1 ? clavePadre : null,
      idUsuarioGestor: this.props.userId,
      tipo: 'Unico',
      dateStart: moment().format('YYYY-MM-DD'),
    };

    this.setState({ updates: { key: `Usuario-Objetivos/${keyUsuarioGT}/${newPostKey2}`, datos: postData } });
    var updates = {};
    updates[`Usuario-Objetivos/${keyUsuarioGT}/${newPostKey2}`] = postData;
    firebase.database().ref().update(updates);

  }



  validarFechaSemanaMax() {
    var fecahMinima = new Date();
    const diferencia = fecahMinima.getDay() - 1;
    fecahMinima.setDate(fecahMinima.getDate() + (-(diferencia)));
    fecahMinima.setDate(fecahMinima.getDate() + 5);
    return new Date(fecahMinima)
  }




  handleSlckRecibir = () => {
    this.timeout = setTimeout(() => {
      this.renderActualizarCanales();
      this.props.Mslacks({ ...this.props.Mslack, estado: false });
      if (this.state.flagConsulta === false) {
        this.handleSlckRecibir();
      }

    }, timeoutLength3)
  }




  renderActualizarCanales() {

    const chatCanal = this.props.user.userChats;
    let canal = null;

    Object.keys(chatCanal).map((key, index) => {

      if (chatCanal[key].chatID !== '13') {
        if (chatCanal[key].participants === '2') {
          canal = this.props.Mslack.canal.gestor;
        }
        else if (chatCanal[key].participants === '3') {
          canal = this.props.Mslack.canal.equipo;
        }
        else if (chatCanal[key].participants === '4') {
          canal = this.props.Mslack.canal.reporting;
        }
        else if (chatCanal[key].participants === '5') {
          canal = this.props.Mslack.canal.notificaicones;
        }

        //    console.log('entro0');


        if (this.state.client && canal) {
          //obtiene el historico y envia el mensaje

          this.state.client.callMethod('channels.history', { channel: canal, count: this.state.count }).then(res => {
            const me = chatCanal[key].thread[chatCanal[key].thread.length - 1].text;
            let flagActualiza = false;
            console.log(res.messages);
            Object.keys(res.messages).map((key2, index) => {
              if (index === 0)
                if (res.messages[key2].text !== me)
                  flagActualiza = true;
            });

            if (flagActualiza) {
              res.messages.sort((a, b) => (a.ts - b.ts))
              let flag = false;
              Object.keys(res.messages).map((key2, index) => {
                const trab = this.props.Mslack.equipo;
                let usuariox = 'x';
                if (res.messages[key2].text === me && flag === false)
                  flag = true;
                if (flag === true && res.messages[key2].text !== me) {
                  Object.keys(trab).map((key3, index) => {
                    if (res.messages[key2].user === trab[key3].usuarioSlack || res.messages[key2].username === trab[key3].usuarioSlack)
                      usuariox = trab[key3].usuario;
                  });
                  if (res.messages[key2].username === this.props.usuarioDetail.usuario.usuario || res.messages[key2].user === this.props.usuarioDetail.usuario.canalSlack || res.messages[key2].username === this.props.usuarioDetail.usuario.canalSlack)
                    this.props.submitMessage(res.messages[key2].text, chatCanal[key].chatID, '1');
                  else {
                    this.props.submitMessage(res.messages[key2].text + ' •' + usuariox, chatCanal[key].chatID, chatCanal[key].participants);
                  }
                }
              });

            }

          });
        }
      }

    });

  }


  renderMensajedif(message) {

    let mr = message.text;
    if (!Array.isArray(message.text)) {
      mr = message.text.split('•')[0];

      if (mr.split('◘').length > 1) {
        return (
          <a href={Array.isArray(mr.split('◘') ? mr.split('◘')[1] : null)}>
            {this.renderTextoEmoji(mr.split('◘')[0])}
          </a>
        );
      }
      return (
        this.renderTextoEmoji(mr)
      );
    }
    return (
      this.renderTextoEmoji(mr)
    );
  }



  render() {
    const {
      activeChat,
      userChats,
      userID,
      contacts
    } = this.props.user;


    // chat header name
    let activeName = contacts.filter((c) => (
      c.userID === activeChat.participants
    ))[0];

    // message if no active chat
    activeName = activeName === undefined
      ? "You're not chatting-ch with anyone!"
      : activeName.userName;


    // chat thread
    let thread = userChats.filter((c) => (
      c.chatID === activeChat.chatID
    ))[0];

    // empty thread if no active chat
    thread = thread === undefined ? [] : thread.thread;
    if (this.props.Mslack && this.props.Mslack.estado === true && this.state.flagConsulta === true) {
      this.handleSlckRecibir();
      this.setState({ flagConsulta: false });
    }

    // all chats
    const chatters = userChats.reduce((prev, next) => {
      prev.push(next.participants)
      return prev;
    }, []);

    let y = window.screen.height * 0.395;
    let ubicacionBt = {
      height: '38px',
      width: '40px',
      position: 'fixed',
      'z-index': '8000',
      top: '92.1%',
      left: '87%',
      'font-size': '20px',
      'text-align': 'center',
      'border-radius': '50%',
      border: '0 none',
      color: 'rgba(251, 251, 251, 0.84)',
      background: 'linear-gradient(to right, #efa31a 10%, #f38226 80%)',
      cursor: 'pointer',
    };


    if (window.screen.width > 500 && window.screen.height < 800) {
      //  y = window.screen.height * 0.51;
      // ubicacionBt.top = y;
    }

    if (window.screen.width < 500) {
      //ubicacionBt.top = '79%';
      // ubicacionBt.left = '85%';
      // ubicacionBt.position = 'fixed';
    }

    let actLabel = null;



    return (
      <div>
        <div className="user-chats-ch">
          {actLabel}
          <ul>
            {contacts.filter((c) => (
              chatters.indexOf(c.userID) !== -1)).map((c) => (
                <li onClick={() => {
                  this.props.setActiveChat(c.userID)
                  this.props.inputSlacks(c.userID === '6' ? false : true);
                }}
                  key={c.userID}
                >

                  <div className={activeChat.participants === c.userID
                    ? "active-thumb-ch contact-thumbnail-ch"
                    : "contact-thumbnail-ch not-active-thumb-ch"}>
                    {activeChat.participants === c.userID ? this.renderUsuarioImagen(c.userName) : null}
                  </div>


                </li>
              ))}
          </ul>
        </div>

        <div className="active-chat-ch" key="12345" id="chatHup" >


          <ul  > {thread.map((message, i) => (
            <div key={i}
              className={message.from === userID
                ? "user-message"
                : "contact-message"}
            >


              <div className="thread-thumbnail-ch  background-color: black;">
                {message.from === '6' ? null : this.renderUsuario(contacts, message)}
              </div>
              <li

                style={{
                  'position': 'relative',
                  'border-radius': message.from === userID ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                  left: '20px'
                }} className={"animationIntro2 group"}
              >
                {this.renderMensajedif(message)}
              </li>
            </div>
          ))}
          </ul>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            this.setState({ avatarY: 0 });
            if (activeChat.chatID === '13')//solo para el bot o interno
              this.onSubmit(activeChat, userID);
            else this.renderEnvioSlack(activeChat, userID);
          }}

          className="ui form">

          <BoxDianmico />
          <button
            style={ubicacionBt}
            type="submit"
          >
            <h1 style={{
              position: 'relative',
              left: '3px',
              top: '-2px'
            }}   >▷</h1>
          </button>
        </form>
      </div>
    )
  };
};
const mapHomeStateToProps = (state) => ({

  userId: state.auth.userId,
  equipoConsulta: state.chatReducer.equipoConsulta,
  consultax: state.chatReducer.consultax,
  nombreUser: state.chatReducer.nombreUser,
  consultaCanal: state.chatReducer.consultaCanal,
  mensajeEnt: state.chatReducer.mensajeEnt,
  tipoPregunta: state.chatReducer.tipoPregunta,
  consultaPreguntaControl: state.chatReducer.consultaPreguntaControl,
  valorInput: state.chatReducer.valorInput,
  consultaPregunta: state.chatReducer.consultaPregunta,
  idChatUser: state.chatReducer.idChatUser,
  pregFantasma: state.chatReducer.pregFantasma,
  primeraV: state.chatReducer.primeraV,
  numeroPregunta: state.chatReducer.numeroPregunta,
  usuarioDetail: state.chatReducer.usuarioDetail,
  listaObjetivo: state.chatReducer.listaObjetivo,
  avatar: state.chatReducer.avatar,
  ValorTexto: state.chatReducer.ValorTexto,
  inputSlacks: state.chatReducer.inputSlacks,
  consultaMensaje: state.chatReducer.consultaMensaje,
  Mslack: state.chatReducer.Mslack,
  MensajeIvily: state.chatReducer.MensajeIvily,
  estadochat: state.chatReducer.estadochat,
  pasoOnboarding: state.chatReducer.pasoOnboarding,
  objTIM: state.chatReducer.objTIM,
  datoClose: state.chatReducer.datoClose,

  user: state.user,
});
export default connect(mapHomeStateToProps, {
  submitMessage, setActiveChat, numeroPreguntas, Mslacks, mensajeEntradas, consultaCanales, chatOff, avatares, pregFantasmas, inputSlacks, objTIMs,
  consultaPreguntaControls, valorInputs, borrarChats, tipoPreguntas, consultaChats, pasoOnboardings, primeraVs, estadochats, MensajeIvilys, datoCloses
})(Home);
