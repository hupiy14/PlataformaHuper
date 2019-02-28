import React from 'react';
import { connect } from 'react-redux';
import {
  setActiveChat, submitMessage, numeroPreguntas, valorInputs, consultaPreguntaControls,
  tipoPreguntas, mensajeEntradas, borrarChats, consultaChats, consultaCanales, pasoOnboardings
} from './actions';
import { chatOff, chatOn } from '../../../actions';
import BoxDianmico from './boxDinamico';
import { IconGroup } from 'semantic-ui-react';
import firebase from 'firebase';

import { Emoji } from 'emoji-mart';
import randomColor from '../../../lib/randomColor'
import { reduxReactFirebase } from 'react-redux-firebase';

import { Image, } from 'semantic-ui-react';

import moment from 'moment';
import randon from '../../../lib/randonImage';
import Avatar from '../../../apis/xpress';
import { object } from 'prop-types';



const timeoutLength = 2500;


class Home extends React.Component {

  state = { carpeta: null, updates: null, color: [], client2: null, avatares: null, avatarX: 0, avatarY: 0 }



  onSearchXpress = async (text) => {
    if (this.state.avatarX === this.state.avatarY) return;
    this.setState({ avatarY: this.state.avatarY + 1 });
    const response = await Avatar.get('/xpresso/v1/search', {
      params: {
        apiKey: '6hSjEEYWVHTmSUUwvwjJzTpX8_zq8noEYq2-_r5ABnkq98vSw1jvHFKncRlYUA-C',
        query: text
      },

    });
    //     console.log(response.data);
    this.setState({ avatares: response.data.lowResGifs })
  }



  componentDidMount() {
    // this.onSearchXpress('user');
    this.setState({ avatarX: 1 });
    const { SlackOAuthClient } = require('messaging-api-slack')
    this.setState({
      client2: SlackOAuthClient.connect(
        // 'xoxp-482555533539-486285033681-535707706853-443780a32ce31f5f3c8b9b6684e2ad96'

        // 'xoxb-482555533539-532878166725-SImPnsMh0QvM2osXpUnMy7Wa'

        'xoxb-482555533539-532878166725-FYre7QYksxMHhIRnQeWzSR1a'
      )
    });

    const nameRef2 = firebase.database().ref().child(`Usuario-Slack/${this.props.userId}`)
    nameRef2.on('value', (snapshot2) => {
      this.props.consultaCanales(snapshot2.val());
    });


  }
  ///paso numero 4 del onboarding
  handlePaso4 = () => {
    this.timeout = setTimeout(() => {
      this.props.chatOff();
      this.props.pasoOnboardings(4);
    }, timeoutLength)
  }

  //Envio a slack el mensaje 
  renderEnvioSlack(activeChat, userID) {

    this.props.submitMessage(
      this.props.valorInput,
      activeChat.chatID,
      userID
    );


    if (activeChat.participants !== '6') {
      let canal = null;
      console.log(activeChat);
      if (activeChat.participants === '2') {
        canal = this.props.consultaCanal.gestor;
      }
      else if (activeChat.participants === '3') {
        canal = this.props.consultaCanal.equipo;
      }

      this.state.client2.postMessage(
        canal,
        {
          text: this.props.valorInput,
          attachments: [
            {
              text: this.props.nombreUser,
              //   fallback: 'You are unable to choose a game',
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
    console.log(canal);
    this.state.client2.postMessage(
      canal,
      {
        text: this.props.nombreUser,
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




  /// Identificador de usuario y color 
  renderUsuario(contacts, message) {
    if (message.from !== '1' && message.from !== '2' && message.from !== '4' && message.from !== '5' && message.from !== '6') {
      //    return <h3 className='red'> H</h3>; 
      let varc;
      let colorU;
      let col;

      if (this.state.color.find((colores) => (colores.user === message.from))) {
        colorU = this.state.color.find((colores) => (colores.user === message.from));

      }
      else {

        const colorx = this.state.color;
        colorU = { user: message.from, color: randomColor(0.7, 1) };
        colorx.push(colorU);
        this.setState({ color: colorx });

      }
      varc = colorU.user.slice(0, 1);
      col = ` ${colorU.color}`;
      return <h3 style={{ color: col }}>{varc}</h3>;
    }
    else
      return contacts.filter((c) => (c.userID === message.from)).map(c => c.userName.slice(0, 1));
  }


  ///Decodificar mensaje y poner los emojis


  renderTextoEmoji(texto) {

    let x = 0;
    let y = 0;
    let opciones = texto.split(':').map((consulta) => {
      y++;
      x++;
      console.log(consulta);
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
            return consulta2;
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
        return ':' + consulta;
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
        const indice = randon();
        if (this.state.avatares && this.state.avatares[1]) {

          return (<React.Fragment>
            <Image src={this.state.avatares[indice]} key={y} size="medium"></Image>
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




  //Relaciona la carpeta con el objetivo
  RelacionarCarpetaObjetivo = (datos, idcarpeta) => {
    console.log('debug');
    var updates = {};
    console.log(datos.datos);
    const dt = { ...datos.datos, carpeta: idcarpeta };
    console.log(dt);
    updates[datos.key] = dt;
    firebase.database().ref().update(updates);
    console.log('debug2');
  }

  onSubmit = (activeChat, userID) => {

    if (!this.props.valorInput.trim()) { return; }
    this.props.submitMessage(
      this.props.valorInput,
      activeChat.chatID,
      userID
    );

    let valorNPregunta = this.props.numeroPregunta;
    let consultaBD = this.props.consultaPregunta;
    let vacio = ' ';
    // console.log(this.props.consultaPregunta[this.props.numeroPregunta]);
    if (this.props.consultaPregunta[this.props.numeroPregunta].tipoPregunta === '3') {
      ///opciones de consulta 
      /// observa la seleccion y cambia la consulta dependiendo la actividad... cualquier cambiar los condicionales 
      console.log(this.props.valorInput);

      if (this.props.valorInput === 'Consultar') {
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

        this.props.submitMessage(`Nombre de la tarea: ${valorConsulta.concepto}`, activeChat.chatID, this.props.idChatUser)
        this.props.submitMessage(`Prioriodad de la tarea: ${valorConsulta.prioridad}`, activeChat.chatID, this.props.idChatUser);
        this.props.submitMessage(`Tiempo Estimado: ${valorConsulta.tiempoEstimado}`, activeChat.chatID, this.props.idChatUser);


      }
      else if (this.props.valorInput === 'Editar') {

        valorNPregunta = 0;
        this.props.tipoPreguntas('EditarTarea');
        vacio = 'x';
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LWgES6beV855nYSVLtM');
        starCountRef.on('value', (snapshot) => {
          this.props.consultaChats(snapshot.val());
          consultaBD = snapshot.val();
        });


      }
      else if (this.props.valorInput === 'Que esta haciendo mi huper') {

        valorNPregunta = 0;
        this.props.tipoPreguntas('Consultar Equipo Gestor');
        vacio = ' ';
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LXt_NqMTxrwo-Ap7UTR');
        starCountRef.on('value', (snapshot) => {
          this.props.consultaChats(snapshot.val());
          consultaBD = snapshot.val();
          const mensaje = consultaBD[1].concepto;
          this.props.submitMessage(mensaje, activeChat.chatID, this.props.idChatUser);
        });


      }

      else if (this.props.valorInput === 'Crear un Objetivo') {

        valorNPregunta = 0;
        this.props.tipoPreguntas('Crear Objetivo Gestor');
        vacio = 'x';
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LXtZVCN7-52d44THkXP');
        starCountRef.on('value', (snapshot) => {
          this.props.consultaChats(snapshot.val());
          consultaBD = snapshot.val();

          const mensaje = consultaBD[1].concepto;
          this.props.submitMessage(mensaje, activeChat.chatID, this.props.idChatUser);
        });

      }

      else if (this.props.valorInput === 'Dar un Feedback') {

        valorNPregunta = 0;
        this.props.tipoPreguntas('Crear Feedback Gestor');
        vacio = 'x';
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-LXt_CrEJFXvUlEN_tp5');
        starCountRef.on('value', (snapshot) => {
          this.props.consultaChats(snapshot.val());
          consultaBD = snapshot.val();

          const mensaje = consultaBD[1].concepto;
          this.props.submitMessage(mensaje, activeChat.chatID, this.props.idChatUser);
        });

      }
    }



    if (this.props.valorInput === 'Eliminar') {

      console.log('elimiar');
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
      this.renderHistoricoHuper(this.props.userId, `Elimino Tarea : ${chatTrazo[2].text}`, 'trabajo');
    }
    else if (this.props.valorInput === 'Ninguna') {
      valorNPregunta = valorNPregunta + 1;
      this.props.consultaPreguntaControls(valorNPregunta + 1);
    }

    ///valida para reescribir la pregunta.
    if (valorNPregunta < consultaBD.length - 1) {

      this.props.numeroPreguntas(valorNPregunta + 1);
      const chatTrazo = this.props.user.userChats[0].thread;

      if (chatTrazo[1].text !== consultaBD[valorNPregunta + 1].concepto) {
        const mensaje = consultaBD[valorNPregunta + 1].concepto;
        this.props.submitMessage(mensaje, activeChat.chatID, this.props.idChatUser);
      }
      // console.log(valorNPregunta);
    }
    else {

      //   console.log(this.props.user.userChats[0]);
      const chatTrazo = this.props.user.userChats[0].thread;
      const tipPrgutna = this.props.tipoPregunta;
      //  const consultaInicial = this.props.consultaPregunta;
      const consultaObj = this.props.consultax;
      // Object.keys(chatTrazo).map(function (key, index) {
      //if (chatTrazo[key].from !== '6') {
      //  console.log(tipPrgutna);
      if (tipPrgutna === 'Diaria') {


        //registro de horas Entrada
        const hoy = new Date();
        firebase.database().ref(`Usuario-Registro/${this.props.userId}/${hoy.getFullYear()}/${hoy.getMonth()}/${hoy.getDate()}`).set({
          horaInicio: hoy.getTime(),
        });


        let postData;
        let newPostKey2;
        // let numeroTareaObj = 0;
        if (consultaObj) {

          //Edita el objetivo
          Object.keys(consultaObj).map(function (key2, index) {

            if (consultaObj[key2].concepto === chatTrazo[4].text) {
              consultaObj[key2].numeroTareas = 1 + consultaObj[key2].numeroTareas

              postData = consultaObj[key2];
              newPostKey2 = key2;
            }

          });
        }

        //Crea el objetivo 
        if (!newPostKey2) {

          ///Crea la carpeta en donde se subiran los archivos adjuntos al objetivo
          //Crear espacio de trabajo para el objetio
          console.log(this.props.usuarioDetail.usuario.wsCompartida);
          var folderId = this.props.usuarioDetail.usuario.wsCompartida;
          window.gapi.client.drive.files.create({
            name: chatTrazo[4].text,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [folderId]
            //fields: 'id'
          }).then((response) => {
            //devuelve lo de la carpeta
            console.log("Response", response);
            this.RelacionarCarpetaObjetivo(this.state.updates, response.result.id);

          },
            function (err) { console.error("Execute error", err); });
          //   this.props.crearCarpetas(xx);
          newPostKey2 = firebase.database().ref().child(`Usuario-Objetivos/${this.props.userId}`).push().key;

          postData = {
            numeroTareas: 1,
            concepto: chatTrazo[4].text,
            estado: 'validar',
            carpeta: this.state.carpeta,
            prioridad: 'normal',
            fechafin: this.validarFechaSemanaMax()
          };
        }



        var updates = {};
        updates[`Usuario-Objetivos/${this.props.userId}/${newPostKey2}`] = postData;
        this.setState({ updates: { key: `Usuario-Objetivos/${this.props.userId}/${newPostKey2}`, datos: postData } });
        firebase.database().ref().update(updates);

        var newPostKey3 = firebase.database().ref().child('Usuario-Tareas').push().key;
        firebase.database().ref(`Usuario-Tareas/${this.props.userId}/${newPostKey2}/${newPostKey3}`).set({

          concepto: chatTrazo[2].text,
          estado: 'activo',
          prioridad: postData.prioridad,
          tiempoEstimado: this.props.valorInput

        });
        //aumenta el paso del onboarding al completar la primera actividad
        if (!this.props.usuarioDetail.usuario.onboarding)
          this.props.pasoOnboardings(2);

        this.renderHistoricoHuper(this.props.userId, `Creo Tarea : ${chatTrazo[2].text} `, 'trabajo');
        // console.log(chatTrazo[key].text);
      }
      else if (tipPrgutna === 'EditarTarea') {
        console.log(this.props.consultax);

        const cconsulta = this.props.consultax;
        let tarea = {};
        let idObjetivo = {};
        let idTarea = {};
        const ultimoValor = this.props.valorInput;
        Object.keys(cconsulta).map(function (key2, index) {
          const ccconsulta = cconsulta[key2];
          Object.keys(ccconsulta).map(function (key, index) {
            //            console.log(ccconsulta[key]);
            if (chatTrazo[2].text === ccconsulta[key].concepto) {
              tarea = ccconsulta[key];
              if (chatTrazo[6].text === ' Prioridad') {
                tarea.prioridad = ultimoValor;
              }
              else if (chatTrazo[6].text === ' Tiempo Estimado') {
                tarea.tiempoEstimado = ultimoValor;
              }
              else {
                tarea.concepto = ultimoValor;
              }
              idObjetivo = key2;
              idTarea = key;
            }

          });
        });

        var updates = {};
        updates[`Usuario-Tareas/${this.props.userId}/${idObjetivo}/${idTarea}`] = tarea;
        firebase.database().ref().update(updates);
        this.renderHistoricoHuper(this.props.userId, `Edito Tarea : ${chatTrazo[2].text} `, 'trabajo');

      }
      else if (tipPrgutna === 'TIC Quincenal') {
        const postData = {
          FechaTIC: new Date().toString(),
          Talento: chatTrazo[2].text,
          Impacto: chatTrazo[4].text,
          Compromiso: this.props.valorInput

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
          Compromiso: this.props.valorInput

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
          Recurso: chatTrazo[4] ? chatTrazo[4].text : this.props.valorInput,
          Descripcion: this.props.valorInput,
          // Compromiso: this.props.valorInput

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
        //eliminar tareas
        if (this.props.valorInput === 'Eliminar Tareas') {

          ///eliminar tareas 
          let cconsulta;
          var updates = {};
          let tarea = {};
          const usuario = this.props.userId;
          const starCountRef = firebase.database().ref().child(`Usuario-Tareas/${this.props.userId}`);
          starCountRef.on('value', (snapshot) => {
            cconsulta = snapshot.val();
            Object.keys(cconsulta).map(function (key2, index) {
              const ccconsulta = cconsulta[key2];
              Object.keys(ccconsulta).map(function (key, index) {
                if (ccconsulta[key].estado === 'activo') {

                  tarea = ccconsulta[key];
                  tarea.estado = 'desechadas';
                  updates[`Usuario-Tareas/${usuario}/${key2}/${key}`] = tarea;
                }

              });

            });

            firebase.database().ref().update(updates);
          });
        }
        //console.log(cconsulta);
        this.renderHistoricoHuper(this.props.userId, `Despedida del dia`, 'fin');

      }


      else if (tipPrgutna === 'Seguimiento') {

        const cconsulta = this.props.consultax;
        let tarea = {};
        const userIDs = this.props.userId;
        const ultimoValor = this.props.valorInput;
        Object.keys(cconsulta).map(function (key2, index) {
          const ccconsulta = cconsulta[key2];
          Object.keys(ccconsulta).map(function (key, index) {
            //            console.log(ccconsulta[key]);
            if (chatTrazo[2].text === ccconsulta[key].concepto) {
              tarea = ccconsulta[key];
              tarea.estado = 'trabajando';
              var updates = {};
              updates[`Usuario-Tareas/${userIDs}/${key2}/${key}`] = tarea;
              firebase.database().ref().update(updates);
              this.renderHistoricoHuper(this.props.userId, `Estas trabajando en ${chatTrazo[2].text}`, 'trabajo');
            }
            else if (ultimoValor === ccconsulta[key].concepto) {
              tarea = ccconsulta[key];
              tarea.estado = 'finalizado';
              var updates = {};
              updates[`Usuario-Tareas/${userIDs}/${key2}/${key}`] = tarea;
              firebase.database().ref().update(updates);
              this.renderHistoricoHuper(this.props.userId, `Ha terminado : ${ultimoValor}`, 'trabajo');
            }

          });
        });

      }

      /////Preguntas Gestor ......
      else if (tipPrgutna === 'Crear Objetivo Gestor') {


        let x = 0;
        const cconsulta = this.props.equipoConsulta;
        let cconsulta2;
        const usuario = this.props.valorInput;
        let usuarioGT;
        let keyUsuarioGT;
        const opciones2 = Object.keys(cconsulta).map(function (key2, index) {
          if (x === 0) {
            x = x + 1;
            const cconsulta2 = cconsulta[key2];
            console.log(cconsulta2);
            Object.keys(cconsulta2).map(function (key, index) {
              if (usuario === cconsulta2[key].usuario) {
                usuarioGT = cconsulta2[key];
                keyUsuarioGT = key;
              }

            });
          }
        });


        console.log(usuarioGT.wsCompartida);
        var folderId = usuarioGT.wsCompartida;
        window.gapi.client.drive.files.create({
          name: chatTrazo[2].text,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [folderId]
          //fields: 'id'
        }).then((response) => {
          //devuelve lo de la carpeta
          console.log("Response", response);
          this.RelacionarCarpetaObjetivo(this.state.updates, response.result.id);

        },
          function (err) { console.error("Execute error", err); });
        //   this.props.crearCarpetas(xx);
        const newPostKey2 = firebase.database().ref().child(`Usuario-Objetivos/${keyUsuarioGT}`).push().key;

        const postData = {
          numeroTareas: 0,
          concepto: chatTrazo[2].text === 'Crear un Objetivo' ? chatTrazo[4].text : chatTrazo[2].text,
          estado: 'activo',
          carpeta: this.state.carpeta,
          prioridad: 'urgente',
          fechafin: this.validarFechaSemanaMax()
        };

        this.setState({ updates: { key: `Usuario-Objetivos/${keyUsuarioGT}/${newPostKey2}`, datos: postData } });

        var updates = {};
        updates[`Usuario-Objetivos/${keyUsuarioGT}/${newPostKey2}`] = postData;


        firebase.database().ref().update(updates);


      }

      else if (tipPrgutna === 'Crear Feedback Gestor') {

        const chatTrazo = this.props.user.userChats[0].thread;

        let x = 0;
        const cconsulta = this.props.equipoConsulta;
        let cconsulta2;
        const usuario = this.props.valorInput;
        let usuarioGT;
        let keyUsuarioGT;
        const opciones2 = Object.keys(cconsulta).map(function (key2, index) {
          if (x === 0) {
            x = x + 1;
            const cconsulta2 = cconsulta[key2];
            console.log(cconsulta2);
            const opciones = Object.keys(cconsulta2).map(function (key, index) {
              if (usuario === cconsulta2[key].usuario) {
                usuarioGT = cconsulta2[key];
                keyUsuarioGT = key;
              }

            });
          }
        });

        this.renderEnvioSlackGestor(chatTrazo, usuarioGT.canalSlack);

      }



      else if (tipPrgutna === 'Consultar Equipo Gestor') {

        const chatTrazo = this.props.user.userChats[0].thread;
        const activeChat = this.props.user.activeChat;
        const userID = this.props.user.userID;
        let x = 0;
        const cconsulta = this.props.equipoConsulta;
        let cconsulta2;
        const usuario = this.props.valorInput;
        let usuarioGT;
        let keyUsuarioGT;
        const opciones2 = Object.keys(cconsulta).map(function (key2, index) {
          if (x === 0) {
            x = x + 1;
            const cconsulta2 = cconsulta[key2];
            console.log(cconsulta2);
            const opciones = Object.keys(cconsulta2).map(function (key, index) {
              if (usuario === cconsulta2[key].usuario) {
                usuarioGT = cconsulta2[key];
                keyUsuarioGT = key;
              }

            });
          }
        });


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
              this.props.submitMessage(
                intro,
                activeChat.chatID,
                userID
              );
              this.props.submitMessage(
                historico[key].concepto,
                activeChat.chatID,
                userID
              );

              this.props.submitMessage(
                fechaActividad = ':hourglass_flowing_sand: ' + fechaActividad + ':hourglass_flowing_sand:',
                activeChat.chatID,
                userID
              );



            }
          });


        });


      }

    }
    //<option value={chatTrazo[key].concepto} key={key} />

    // });
    //console.log(this.props.valorInput);
    // }
    this.props.consultaPreguntaControls(valorNPregunta + 1);

    this.props.valorInputs(vacio);
    // inputX.value = '';
  }

  validarFechaSemanaMax() {
    var fecahMinima = new Date();
    const diferencia = fecahMinima.getDay() - 1;
    fecahMinima.setDate(fecahMinima.getDate() + (-(diferencia)));
    fecahMinima.setDate(fecahMinima.getDate() + 5);
    return new Date(fecahMinima)
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




    // all chats
    const chatters = userChats.reduce((prev, next) => {
      prev.push(next.participants)
      return prev;
    }, []);

    let y = window.screen.height * 0.395;
    let ubicacionBt = {
      height: '30px',
      width: '30px',
      position: 'fixed',
      'z-index': '4000',
      top: '83%',
      left: '90%',
      'font-size': '20px',
      'text-align': 'center',
      'border-radius': '50%',
      border: '0 none',
      color: 'rgba(0, 0, 0, 0.4)',
      background: '0 none',
      cursor: 'pointer',
    };

    if (window.screen.width > 500 && window.screen.height < 800) {
      y = window.screen.height * 0.51;
      ubicacionBt.top = y;
    }

    if (window.screen.width < 500) {
      ubicacionBt.top = '79%';
      ubicacionBt.left = '85%';
      ubicacionBt.position = 'fixed';
    }


    return (
      <div>
        <div className="user-chats-ch">
          <ul>
            {contacts.filter((c) => (
              chatters.indexOf(c.userID) !== -1)).map((c) => (
                <li onClick={() => {
                  this.props.setActiveChat(c.userID)


                }}
                  key={c.userID}
                >
                  <div key="123" className={activeChat.participants === c.userID
                    ? "active-thumb-ch contact-thumbnail-ch"
                    : "contact-thumbnail-ch not-active-thumb-ch"}
                  >
                    {c.userName.slice(0, 1)}
                  </div>
                </li>
              ))}
          </ul>
        </div>
        <div className="active-chat-ch" key="12345" >
          <div className="active-name" key="12346"  >{activeName}</div>
          <ul  > {thread.map((message, i) => (
            <div key={i}
              className={message.from === userID
                ? "user-message"
                : "contact-message"}
            >
              <div className="thread-thumbnail-ch  background-color: black;">
                <span>

                  {this.renderUsuario(contacts, message)}
                </span>
              </div>
              <li className={i > 0
                ? thread[i - 1].from === message.from
                  ? "group"
                  : ""
                : ""}
              > {this.renderTextoEmoji(message.text)}












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
            <i className="chevron right icon"
              aria-hidden="true"
            ></i>
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
  numeroPregunta: state.chatReducer.numeroPregunta,
  usuarioDetail: state.chatReducer.usuarioDetail,
  user: state.user,
});
export default connect(mapHomeStateToProps, {
  submitMessage, setActiveChat, numeroPreguntas, mensajeEntradas, consultaCanales, chatOff,
  consultaPreguntaControls, valorInputs, borrarChats, tipoPreguntas, consultaChats, pasoOnboardings
})(Home);
