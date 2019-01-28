import React from 'react';
import { connect } from 'react-redux';
import {
  setActiveChat, submitMessage, numeroPreguntas, valorInputs, consultaPreguntaControls,
  tipoPreguntas, mensajeEntradas, borrarChats, consultaChats
} from './actions';
import BoxDianmico from './boxDinamico';
import { IconGroup } from 'semantic-ui-react';
import firebase from 'firebase';



class Home extends React.Component {

  state = { carpeta: null, updates: null }

  //Relaciona la carpeta con el objetivo
  RelacionarCarpetaObjetivo = (datos, idcarpeta) => {
    var updates = {};
    console.log(datos.datos);
    const dt = { ...datos.datos, carpeta: idcarpeta };
    console.log(dt);
    updates[datos.key] = dt;
    firebase.database().ref().update(updates);
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
      //    console.log(this.props.valorInput);
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

    }
    else if (this.props.valorInput === 'Ninguna') {
      valorNPregunta = valorNPregunta + 1;
      this.props.consultaPreguntaControls(valorNPregunta + 1);
    }

    if (valorNPregunta < consultaBD.length - 1) {

      this.props.numeroPreguntas(valorNPregunta + 1);
      console.log(valorNPregunta);
      const mensaje = consultaBD[valorNPregunta + 1].concepto;
      this.props.submitMessage(mensaje, activeChat.chatID, this.props.idChatUser);
      // console.log(valorNPregunta);
    }
    else {

      //   console.log(this.props.user.userChats[0]);
      const chatTrazo = this.props.user.userChats[0].thread
      const tipPrgutna = this.props.tipoPregunta;
    //  const consultaInicial = this.props.consultaPregunta;
      const consultaObj = this.props.consultax;
      // Object.keys(chatTrazo).map(function (key, index) {

      //if (chatTrazo[key].from !== '6') {
      console.log(tipPrgutna);
      if (tipPrgutna === 'Diaria') {

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
          window.gapi.client.drive.files.create({
            name: chatTrazo[4].text,
            mimeType: 'application/vnd.google-apps.folder'
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
      }

      else if (tipPrgutna === 'Despedida' && this.props.valorInput === 'Eliminar Tareas') {
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
        console.log(cconsulta);

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
            }
            else if (ultimoValor === ccconsulta[key].concepto) {
              tarea = ccconsulta[key];
              tarea.estado = 'finalizado';
              var updates = {};
              updates[`Usuario-Tareas/${userIDs}/${key2}/${key}`] = tarea;
              firebase.database().ref().update(updates);
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



    return (
      <div>
        <div className="user-chats-ch">
          <ul>
            {contacts.filter((c) => (
              chatters.indexOf(c.userID) !== -1)).map((c) => (
                <li onClick={() => (
                  this.props.setActiveChat(c.userID)
                )}
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
              <div className="thread-thumbnail-ch">
                <span>
                  {contacts.filter((c) => (c.userID === message.from)).map(c => c.userName.slice(0, 1))}
                </span>
              </div>
              <li className={i > 0
                ? thread[i - 1].from === message.from
                  ? "group"
                  : ""
                : ""}
              > {message.text}
              </li>
            </div>
          ))}
          </ul>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            this.onSubmit(activeChat, userID);
          }}

          className="ui form">

          <BoxDianmico />
          <button
            className="send-button-ch"
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
  consultax: state.chatReducer.consultax,
  mensajeEnt: state.chatReducer.mensajeEnt,
  tipoPregunta: state.chatReducer.tipoPregunta,
  consultaPreguntaControl: state.chatReducer.consultaPreguntaControl,
  valorInput: state.chatReducer.valorInput,
  consultaPregunta: state.chatReducer.consultaPregunta,
  idChatUser: state.chatReducer.idChatUser,
  numeroPregunta: state.chatReducer.numeroPregunta,
  user: state.user
});
export default connect(mapHomeStateToProps, {
  submitMessage, setActiveChat, numeroPreguntas, mensajeEntradas, 
  consultaPreguntaControls, valorInputs, borrarChats, tipoPreguntas, consultaChats
})(Home);
