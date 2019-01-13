import React from 'react';
import { Link } from 'react-router-dom';
import { createStore } from 'redux';
import { connect } from 'react-redux';
import { setActiveChat, submitMessage } from './actions';



const Home = ({user , dispatch }) => {
    const {
      activeChat, 
      userChats, 
      userID, 
      contacts 
    } = user;
  
    let input;
    
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
                dispatch(setActiveChat(c.userID))
              )} 
              key={c.userID}
              > 
              <div  key="123" className={ activeChat.participants === c.userID 
                      ? "active-thumb-ch contact-thumbnail-ch"  
                      : "contact-thumbnail-ch not-active-thumb-ch"}
                > 
                {c.userName.slice(0,1)}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="active-chat-ch" key="12345" >
          <div className="active-name" key="12346"  >{activeName}</div>
          <ul  > {thread.map((message, i) => (
              <div  key={i}
                className={message.from === userID 
                  ? "user-message" 
                  : "contact-message" }
               >
                <div className="thread-thumbnail-ch">
                  <span>
                    {contacts.filter((c) => (c.userID === message.from)).map(c => c.userName.slice(0,1))}
                  </span>
                </div>
                <li className={i > 0 
                      ? thread[i - 1].from === message.from 
                        ? "group" 
                        : ""
                      : "" }
                > {message.text}
                </li>
              </div>
            ))}
          </ul>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!input.value.trim()) { return }
            dispatch(submitMessage(
              input.value, 
              activeChat.chatID
            ))
            input.value = ''
          }}
        >
          <textarea 
            className="message-input-ch"  
            placeholder="message"
            rows={10}
            cols={30}
            ref={node => { input = node }}
          />
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
    );
  };
  const mapHomeStateToProps = (state) => ({
    user: state.user
  });
  export default connect(
    mapHomeStateToProps
  )(Home);
  