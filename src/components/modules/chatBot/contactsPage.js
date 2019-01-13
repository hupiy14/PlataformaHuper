import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { startChat, updateFilter, endChat } from './actions';

const Contacts = ({
    activeChat,
    contacts,
    userChats,
    filterString, 
    dispatch
  }) => {
    let input;
  
    // all chats
    const chatters = userChats.reduce((prev, next) => {
      prev.push(next.participants)
      return prev;
    }, []);
    
    // check if user is chatting-ch with contact
    const chatting = (c) => (
      chatters.indexOf(c.userID) !== -1
    );
    
    // contact sort function
    const compare = (a,b) => {
      if (a.userName < b.userName) { return -1; }
      if (a.userName > b.userName) { return  1; }
      return 0;
    }
    
    // search bar filter cb 
    const searchFilter = (c) => {
      if (filterString.length < 1) { return true; } 
      return (
        c.userName
              .slice(0, filterString.length)
         .toLowerCase() 
        === filterString.toLowerCase()
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
            dispatch(updateFilter(input.value))
          }}
        /> 
        <ul className="contact-list-ch">
          {contacts
            .filter(searchFilter)
            .sort(compare)
            .map((c) => (
            <li key={c.userID} >
          
              <div  className={chatting(c)
                     ? "contact-thumbnail-ch"
                     : "contact-thumbnail-ch flat"}
              > {c.userName.slice(0,1)}
                 
              </div>
              <i className={chatting(c)
                   ? "spinner icon   chatting-ch"
                   : "hide-ch"} 
                 aria-hidden="true"
              ></i>
              <button 
                className="contact-name"
                onClick={
                  chatting(c) 
                    ? () => {dispatch(endChat(c.userID))}
                    : () => {dispatch(startChat(c.userID))}}
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
    )
  };
  const mapContactsStateToProps = (state) => ({
    activeChat: state.user.activeChat,
    contacts: state.user.contacts,
    userChats: state.user.userChats,
    filterString: state.contactsPage.filterString
  });
  const mapContactsDispatchToProps = () => ({
    startChat 
  })
  export default connect(
    mapContactsStateToProps
  )(Contacts);


