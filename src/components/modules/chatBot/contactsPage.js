import React from 'react';
import { connect } from 'react-redux';
import { startChat, updateFilter, endChat, consultaMensajes, submitMessage, consultaCanales } from './actions';
import firebase from 'firebase';
import { IconGroup } from 'semantic-ui-react';

const timeoutLength = 10000;

class Contacts extends React.Component {
  state = { canales: null, client: null, timeout: null };

  componentDidMount() {
    const { SlackOAuthClient } = require('messaging-api-slack')
    this.setState({

      client: SlackOAuthClient.connect(
        'xoxp-482555533539-486285033681-535707706853-443780a32ce31f5f3c8b9b6684e2ad96'
        //                'xoxb-482555533539-532878166725-SImPnsMh0QvM2osXpUnMy7Wa'
      )
    });

    //consulta los canales confirugados alusuario
    const nameRef2 = firebase.database().ref().child(`Usuario-Slack/${this.props.userId}`)
    nameRef2.on('value', (snapshot2) => {
      this.setState({ canales: snapshot2.val() });
      this.props.consultaCanales(snapshot2.val());
    });

  }



  handleOpen = () => {
    // this.setState({ isOpen: true })

    this.timeout = setTimeout(() => {
      this.renderActualizarCanales();
      console.log(this.props.user);
      //this.setState({ isOpen: false })
    }, timeoutLength)
  }


  renderActualizarCanales() {

    const chatCanal = this.props.user.userChats;
    let canal = null;
    Object.keys(chatCanal).map((key, index) => {

      if (chatCanal[key].chatID !== '13') {
        if (chatCanal[key].participants === '2') {
          canal = this.state.canales.gestor;
        }
        else if (chatCanal[key].participants === '3') {
          canal = this.state.canales.equipo;
        }
        else if (chatCanal[key].participants === '4') {
          canal = this.state.canales.reporting;
        }
        else if (chatCanal[key].participants === '5') {
          canal = this.state.canales.notificaicones;
        }


        if (this.state.client && canal) {
          //obtiene el historico y envia el mensaje
          this.state.client.callMethod('channels.history', { channel: canal, count: 10 }).then(res => {
            // this.props.consultaMensajes(res.messages);

            if (res.messages[0].text === chatCanal[key].thread[chatCanal[key].thread.length - 1].text)
              console.log('Cambio');
            //Insertar codigo de actualizacion del chat despues de 10 minutos,pensar que pasaria si hay mas de 10 mensajes y no coincide ninguno?
          });
        }

      }

    });
  }




  renderChat(id, usuario, chatId) {


    let canal = null;

    if (id === '2') {
      canal = this.state.canales.gestor;
    }
    else if (id === '3') {
      canal = this.state.canales.equipo;
    }
    else if (id === '4') {
      canal = this.state.canales.reporting;
    }
    else if (id === '5') {
      canal = this.state.canales.notificaicones;
    }


    if (this.state.client && canal) {

      //obtiene el historico y envia el mensaje
      this.state.client.callMethod('channels.history', { channel: canal, count: 10 }).then(res => {
        this.props.consultaMensajes(res.messages);

        res.messages.sort((a, b) => (a.ts - b.ts))
        Object.keys(res.messages).map((key2, index) => {


          if (res.messages[key2].username === this.state.canales.usuario || res.messages[key2].user === this.state.canales.usuarioSlack)
            this.props.submitMessage(res.messages[key2].text, chatId, '1');
          else {
            //     console.log(id);
            if (id === '3') {
              this.props.submitMessage(res.messages[key2].text, chatId, res.messages[key2].user);
            }
            else {
              this.props.submitMessage(res.messages[key2].text, chatId, id);
            }
          }

        });

      });
    }


  }







  render() {
    let input;

    // all chats
    const chatters = this.props.userChats.reduce((prev, next) => {
      prev.push(next.participants)
      return prev;
    }, []);

    // check if user is chatting-ch with contact
    const chatting = (c) => (
      chatters.indexOf(c.userID) !== -1
    );

    // contact sort function
    const compare = (a, b) => {
      if (a.userName < b.userName) { return -1; }
      if (a.userName > b.userName) { return 1; }
      return 0;
    }

    // search bar filter cb 
    const searchFilter = (c) => {
      if (this.props.filterString.length < 1) { return true; }
      return (
        c.userName
          .slice(0, this.props.filterString.length)
          .toLowerCase()
        === this.props.filterString.toLowerCase()
      );
    }

    return (
      <div className="contact-search-ch-wrapper-ch">
        <span className="search-icon-ch">
          <i className="search icon" />
        </span>
        <textarea
          className="contact-search-ch"
          placeholder="search..."
          rows={10}
          cols={30}
          ref={node => { input = node }}
          onKeyUp={(e) => {

            this.props.updateFilter(input.value)
          }}
        />
        <ul className="contact-list-ch">
          {this.props.contacts
            .filter(searchFilter)
            .sort(compare)
            .map((c) => (
              <li key={c.userID} >

                <div className={chatting(c)
                  ? "contact-thumbnail-ch"
                  : "contact-thumbnail-ch flat"}
                > {c.userName.slice(0, 1)}

                </div>
                <i className={chatting(c)
                  ? "spinner icon App-logo huge  chatting-ch"
                  : "hide-ch"}
                  aria-hidden="true"
                ></i>
                <button className="contact-name"
                  onClick={

                    chatting(c) ? () => {

                      clearTimeout(this.timeout);

                      this.props.endChat(c.userID)
                    }
                      : () => {
                        const chatId = "Hup" + new Date().getTime();
                        this.props.startChat(c.userID, chatId); this.renderChat(c.userID, c.userName, chatId);
                        this.handleOpen();

                      }}
                > {c.userName}
                  <i className={chatting(c)
                    ? "hide-ch"
                    : "plus icon"}
                    aria-hidden="true"
                  ></i>
                  <i className={chatting(c)
                    ? "minus icon"
                    : "hide-ch"}
                    aria-hidden="true"
                  ></i>
                </button>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}
const mapContactsStateToProps = (state) => ({
  userId: state.auth.userId,
  activeChat: state.user.activeChat,
  contacts: state.user.contacts,
  userChats: state.user.userChats,
  filterString: state.contactsPage.filterString,
  user: state.user,

});

export default connect(mapContactsStateToProps, { startChat, updateFilter, endChat, consultaMensajes, submitMessage, consultaCanales })(Contacts);


