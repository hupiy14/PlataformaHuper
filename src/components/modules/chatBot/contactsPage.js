import React from 'react';
import { connect } from 'react-redux';
import { startChat, updateFilter, endChat, Mslacks, consultaMensajes, submitMessage, consultaCanales } from './actions';
import firebase from 'firebase';
import { IconGroup } from 'semantic-ui-react';
import { defaultUser } from '../../../components/modules/chatBot/dummyData';


const timeoutLength = 30000;

class Contacts extends React.Component {
  state = { canales: null, client: null, timeout: null, equipo: null, count: 20 };

  componentDidMount() {
    const { SlackOAuthClient } = require('messaging-api-slack')

    //consulta los canales confirugados alusuario
    const nameRef3 = firebase.database().ref().child(`Usuario-WS/${this.props.usuarioDetail.usuario.empresa}/${this.props.usuarioDetail.usuario.equipo}`)
    nameRef3.on('value', (snapshot2) => {
      this.setState({ equipo: snapshot2.val() });
    });

    //consulta los canales confirugados alusuario
    const nameRef2 = firebase.database().ref().child(`Usuario-Slack/${this.props.userId}`)
    nameRef2.on('value', (snapshot2) => {
      this.setState({ canales: snapshot2.val() });
      this.setState({
        client: SlackOAuthClient.connect(
          snapshot2.val().tokenP
        )
      });
      this.props.consultaCanales(snapshot2.val());
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
console.log(canal);

    if (this.state.client && canal) {

      //obtiene el historico y envia el mensaje
      this.state.client.callMethod('channels.history', { channel: canal, count: this.state.count }).then(res => {
        console.log(res.messages);
        this.props.Mslacks({ estado: true, canal: this.state.canales, client: this.state.client, equipo: this.state.equipo});
        res.messages.sort((a, b) => (a.ts - b.ts))
        Object.keys(res.messages).map((key2, index) => {
          const trab = this.state.equipo;
          let usuariox = 'x';
          Object.keys(trab).map((key3, index) => {
            if (res.messages[key2].user === trab[key3].usuarioSlack || res.messages[key2].username === trab[key3].usuarioSlack )
              usuariox = trab[key3].usuario;
          });

          let link = null;
          if(res.messages[key2].files)
            link =  '◘' + res.messages[key2].files[0].url_private_download;
          

          if (res.messages[key2].username === this.props.usuarioDetail.usuario.usuario || res.messages[key2].user === this.props.usuarioDetail.usuario.canalSlack || res.messages[key2].username === this.props.usuarioDetail.usuario.canalSlack)
            this.props.submitMessage(res.messages[key2].text  + link, chatId, '1');
          else {
            this.props.submitMessage(res.messages[key2].text  + link + ' •' + usuariox  , chatId, id);
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

                      this.props.endChat(c.userID);
                    
                      
                    }
                      : () => {
                        const chatId = "Hup" + new Date().getTime();
                        this.props.startChat(c.userID, chatId); this.renderChat(c.userID, c.userName, chatId);
                      
                        console.log('entroH');

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
  consultaMensaje: state.chatReducer.consultaMensaje,
  Mslack: state.chatReducer.Mslack,
  user: state.user,
  usuarioDetail: state.chatReducer.usuarioDetail,

});

export default connect(mapContactsStateToProps, { startChat, Mslacks, updateFilter, endChat, consultaMensajes, submitMessage, consultaCanales })(Contacts);


