import React from 'react';
import { connect } from 'react-redux';
import {
  setActiveChat, submitMessage, numeroPreguntas, valorInputs, consultaPreguntaControls, pregFantasmas, primeraVs,
  tipoPreguntas, mensajeEntradas, borrarChats, consultaChats, consultaCanales, pasoOnboardings, avatares,
} from './actions';
import { chatOff, chatOn } from '../../../actions';
import BoxDianmico from './boxDinamico';
import firebase from 'firebase';
import { Emoji } from 'emoji-mart';
import randomColor from '../../../lib/randomColor'
import { Image, Breadcrumb, } from 'semantic-ui-react';
import moment from 'moment';
import randon from '../../../lib/randonImage';
import Avatar from '../../../apis/xpress';
import { object } from 'prop-types';




let timeoutLength = 2500;
let timeoutLength2 = 300;
class Home extends React.Component {

  state = { carpeta: null, updates: null, color: [], client2: null, avataresN: null, avatarX: 0, avatarY: 0, ultimaTarea: null, mensajeEnviado: false, personasInv: [], }

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
        q: 'hello',
      },
    });
    //  console.log(response);
    this.props.avatares(response.data.data);

  }

  handleOpen = (valorInput, chatID, userID) => {
    //valida si ya se contesto si no se espera
    timeoutLength2 = 800;
   if (userID === '1') {
      timeoutLength2 = 100;
      if (this.state.mensajeEnviado === true)
        timeoutLength2 = 300;
    }
    this.setState({ mensajeEnviado: true });
    this.timeout = setTimeout(() => {
      this.setState({ mensajeEnviado: false });
      if (Array.isArray(valorInput))
        this.props.submitMessage(
          valorInput,
          chatID,
          userID
        );
      else {
        if (valorInput.trim() !== '')
          this.props.submitMessage(
            valorInput,
            chatID,
            userID
          );
      }
    }, timeoutLength2)
  }


  componentDidMount() {
    this.renderConsultarUltimaTarea();
    this.setState({ avatarX: 1 });
    const { SlackOAuthClient } = require('messaging-api-slack')
    this.setState({
      client2: SlackOAuthClient.connect(
        'xoxb-482555533539-532878166725-FYre7QYksxMHhIRnQeWzSR1a'
      )
    });

    const nameRef2 = firebase.database().ref().child(`Usuario-Slack/${this.props.userId}`)
    nameRef2.on('value', (snapshot2) => {
      this.props.consultaCanales(snapshot2.val());
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


  ///paso numero 4 del onboarding
  handlePaso4 = () => {
    this.timeout = setTimeout(() => {
      this.props.chatOff();
      this.props.pasoOnboardings(4);
    }, timeoutLength)
  }

  cerrarChat = () => {
    this.timeout = setTimeout(() => {
      this.props.chatOff();
    }, timeoutLength)
  }
  //Envio a slack el mensaje 
  renderEnvioSlack(activeChat, userID) {

    if (this.props.valorInput.trim() === '') return;
    this.handleOpen(this.props.valorInput, activeChat.chatID, userID);


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
  renderTextoEmoji(textos) {
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
          return (<React.Fragment key={y}>
            <iframe src={this.props.avatar[this.state.avataresN ? this.state.avataresN : 0].embed_url} style={{ width: '160px', height: '90px' }} key={y}></iframe>
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
      const valRepetido = this.props.valorInput;
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

  onSubmit = (activeChat, userID) => {



    if (!Array.isArray(this.props.valorInput))
      if (this.props.valorInput.trim() === '') return;
    this.handleOpen(this.props.valorInput, activeChat.chatID, userID);



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


        this.handleOpen(`Nombre de la tarea: ${valorConsulta.concepto}`, activeChat.chatID, this.props.idChatUser)
        this.handleOpen(`Prioriodad de la tarea: ${valorConsulta.prioridad}`, activeChat.chatID, this.props.idChatUser);
        this.handleOpen(`Tiempo Estimado: ${valorConsulta.tiempoEstimado}`, activeChat.chatID, this.props.idChatUser);


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
          this.handleOpen(mensaje, activeChat.chatID, this.props.idChatUser);
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
          this.handleOpen(mensaje, activeChat.chatID, this.props.idChatUser);
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
          this.handleOpen(mensaje, activeChat.chatID, this.props.idChatUser);
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


    if (this.props.pregFantasma && !this.props.pregFantasma.sel) {
      const opcione = this.props.pregFantasma;
      const sel = this.props.valorInput;
      const opcionw = { ...opcione, sel }
      this.props.pregFantasmas(opcionw)
    }


    if (this.props.pregFantasma && this.props.pregFantasma.sel && !this.props.pregFantasma.reload) {
      let pasar = false;
      Object.keys(this.props.pregFantasma.consultaOp).map((key, index) => {
        if (this.props.pregFantasma.consultaOp[key] === this.props.pregFantasma.sel) {
          pasar = true;
        }
      });

      if (pasar === false) {

        valorNPregunta = 0;
        const starCountRef = firebase.database().ref().child('Preguntas-Chat/-L_gZJBmlV7v-wUeF3Tr');
        starCountRef.on('value', (snapshot) => {
          this.props.consultaChats(snapshot.val());
          consultaBD = snapshot.val();

          //   console.log(consultaBD);
          const opcione = this.props.pregFantasma;
          const reload = true;
          const opcionw = { ...opcione, reload };
          this.props.pregFantasmas(opcionw);

          if (!this.props.primeraV) {
            valorNPregunta++;
            const mensaje = consultaBD[valorNPregunta].concepto;
            this.handleOpen(mensaje, activeChat.chatID, this.props.idChatUser);
            this.props.primeraVs(true);
          }
        });
      }

    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///valida para reescribir la pregunta.
    if (valorNPregunta < consultaBD.length - 1) {

      this.props.numeroPreguntas(valorNPregunta + 1);
      const chatTrazo = this.props.user.userChats[0].thread;

      if (chatTrazo[1].text !== consultaBD[valorNPregunta + 1].concepto) {
        let mensaje = consultaBD[valorNPregunta + 1].concepto;
        consultaBD = this.PreguntasRepEspecial(consultaBD[valorNPregunta + 1].tipoPregunta, mensaje, consultaBD, valorNPregunta + 1);
        mensaje = consultaBD[valorNPregunta + 1].concepto;
        this.handleOpen(mensaje, activeChat.chatID, this.props.idChatUser);
      }
      // console.log(valorNPregunta);
    }

    else {
      //cerrar despues de realizado
      timeoutLength = 1500;
      this.cerrarChat();

      const chatTrazo = this.props.user.userChats[0].thread;
      const tipPrgutna = this.props.tipoPregunta;
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
              consultaObj[key2].numeroTareas = 1 + consultaObj[key2].numeroTareas;
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
            fechafin: moment(this.validarFechaSemanaMax()).format('YYYY-MM-DD'),
            impacto: chatTrazo[8].text,
            dificultad: chatTrazo[10].text,
            repeticiones: chatTrazo[12].text,
            tipo: this.props.valorInput,
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
        let hora;
        if (this.props.valorInput.trim() === '1 hora')
          hora = 1;
        else if (this.props.valorInput.trim() === '2 horas')
          hora = 2;
        else

          hora = 3;
        //Restar fechas
        // moment.duration(lunch - breakfast).humanize()
        //recupera la ultima tarea


        const diat = new Date();
        if (!this.state.ultimaTarea) {
          firebase.database().ref(`Usuario-UltimaTarea/${this.props.userId}/${diat.getFullYear()}/${this.getWeekNumber(diat)}/${diat.getDate()}`).set({
            tarea: newPostKey3,
            horaPlanificada: moment().format('HH:mm'),
            horaEstimada: moment().add('hours', hora).format('HH:mm'),
          });
        }

        firebase.database().ref(`Usuario-Tareas/${this.props.userId}/${newPostKey2}/${newPostKey3}`).set({
          concepto: chatTrazo[2].text,
          estado: 'activo',
          dateStart: moment().format('YYYY-MM-DD'),
          prioridad: postData.prioridad,
          tiempoEstimado: this.props.valorInput,
          horaPlanificada: this.state.ultimaTarea ? this.state.ultimaTarea.horaEstimada : moment().format('HH:mm'),
          horaEstimada: this.state.ultimaTarea ? moment(this.state.ultimaTarea.horaEstimada, 'HH:mm').add('hours', hora).format('HH:mm') : moment().add('hours', hora).format('HH:mm'),
        });

        firebase.database().ref(`Usuario-UltimaTarea/${this.props.userId}/${diat.getFullYear()}/${this.getWeekNumber(diat)}/${diat.getDate()}`).set({
          tarea: newPostKey3,
          dateStart: moment().format('YYYY-MM-DD'),
          horaPlanificada: this.state.ultimaTarea ? this.state.ultimaTarea.horaEstimada : moment().format('HH:mm'),
          horaEstimada: this.state.ultimaTarea ? moment(this.state.ultimaTarea.horaEstimada, 'HH:mm').add('hours', hora).format('HH:mm') : moment().add('hours', hora).format('HH:mm'),
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
        Object.keys(cconsulta).map((key2, index) => {
          const ccconsulta = cconsulta[key2];
          Object.keys(ccconsulta).map((key, index) => {
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
              //Actualiza el objetivo conjunto
              const objs = this.props.listaObjetivo.objetivos;
              if (tarea.estado === 'activo') {
                Object.keys(objs).map((key3, index) => {
                  if (key3 === key2 && objs[key3].compartidoEquipo) {

                    let avanceObjGlobal = Math.round(parseInt(objs[key3].porcentajeResp) * ((100 / Object.keys(cconsulta[key2]).length) * 0.01));
                    let objetivoPadre = null;
                    //busca el objetivo padre
                    const starCountRef = firebase.database().ref().child(`Usuario-Objetivos/${objs[key3].idUsuarioGestor}/${objs[key3].objetivoPadre}`);
                    starCountRef.on('value', (snapshot) => {
                      objetivoPadre = snapshot.val();
                      let devolver = objetivoPadre.avance;
                      if (objs[key3].avancePadre) {
                        devolver = devolver - ((objs[key3].avancePadre) * (objs[key3].nTareas));
                      }

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
              updates[`Usuario-Tareas/${userIDs}/${key2}/${key}`] = { ...tarea, dateEnd: moment().format('YYYY-MM-DD') };
              firebase.database().ref().update(updates);
              this.renderHistoricoHuper(this.props.userId, `Ha terminado : ${ultimoValor}`, 'trabajo');


            }

          });
        });

      }

      /////Preguntas Gestor ......
      else if (tipPrgutna === 'Crear Objetivo Gestor') {

        let x = 0;
        const equipo = this.props.equipoConsulta;
        const usuario = chatTrazo[10].text;
        let usuarioGT;
        let keyUsuarioGT;
        let personaEquipo = 0;
        const newPostKey = firebase.database().ref().child(`Usuario-Objetivos/${this.props.userId}`).push().key;

        //Crea objetivo centralizado


        this.setState({ personasInv: [] });
        Object.keys(usuario).map((key3, index) => {
          x = 0;
          Object.keys(equipo).map((key2, index) => {
            if (x === 0) {
              x = x + 1;
              const cconsulta2 = equipo[key2];
              Object.keys(cconsulta2).map((key, index) => {
                if (usuario[key3] === cconsulta2[key].usuario) {
                  personaEquipo++;
                  usuarioGT = cconsulta2[key];
                  keyUsuarioGT = key;
                  //              console.log(keyUsuarioGT);
                  this.GuardarObjetivoGestor(usuarioGT, keyUsuarioGT, chatTrazo, personaEquipo, usuario.length, newPostKey, usuario[key3]);
                }
              });
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

    }
    //<option value={chatTrazo[key].concepto} key={key} />

    // });
    //console.log(this.props.valorInput);
    // }
    this.props.consultaPreguntaControls(valorNPregunta + 1);

    this.props.valorInputs(vacio);
    // inputX.value = '';
  }

  GuardarObjetivoGestor(usuarioGT, keyUsuarioGT, chatTrazo, personCont, personEquipo, clavePadre, nombreUsuario) {

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
      detalle: personEquipo > 1 ? personCont < personEquipo ? chatTrazo[10 + (2 * personCont)].text : this.props.valorInput : this.props.valorInput,
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
      height: '39.5px',
      width: '40px',
      position: 'fixed',
      'z-index': '4000',
      top: '82.1%',
      left: '89%',
      'font-size': '20px',
      'text-align': 'center',
      'border-radius': '5%',
      border: '0 none',
      color: 'rgba(0, 0, 0, 0.4)',
      background: 'white',
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
        <div className="active-chat-ch" key="12345" id="chatHup" >
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
  pregFantasma: state.chatReducer.pregFantasma,
  primeraV: state.chatReducer.primeraV,
  numeroPregunta: state.chatReducer.numeroPregunta,
  usuarioDetail: state.chatReducer.usuarioDetail,
  listaObjetivo: state.chatReducer.listaObjetivo,
  avatar: state.chatReducer.avatar,
  user: state.user,
});
export default connect(mapHomeStateToProps, {
  submitMessage, setActiveChat, numeroPreguntas, mensajeEntradas, consultaCanales, chatOff, avatares, pregFantasmas,
  consultaPreguntaControls, valorInputs, borrarChats, tipoPreguntas, consultaChats, pasoOnboardings, primeraVs
})(Home);
