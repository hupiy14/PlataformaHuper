import React from 'react';
import { connect } from 'react-redux';
import { startChat, updateFilter, endChat } from './actions';

class Contacts extends React.Component {
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
                    chatting(c) ? () => { this.props.endChat(c.userID) }
                      : () => { this.props.startChat(c.userID) }}
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
  activeChat: state.user.activeChat,
  contacts: state.user.contacts,
  userChats: state.user.userChats,
  filterString: state.contactsPage.filterString
});

export default connect(mapContactsStateToProps, { startChat, updateFilter, endChat })(Contacts);


