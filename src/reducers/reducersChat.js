import {
    SET_ACTIVE_CHAT,
    START_CHAT,
    END_CHAT,
    SUBMIT_MESSAGE, 
    UPDATE_FILTER,
    SET_THEME
    
} from '../components/modules/chatBot/types';
import { defaultUser } from '../components/modules/chatBot/dummyData';


export const user = (user = defaultUser, action) => {
    const {
        activeChat,
        userChats,
        userID,
        contacts
    } = user;

    switch (action.type) {
        case SET_ACTIVE_CHAT:
            if (action.participants === activeChat.participants) {
                return user;
            } else {
                return Object.assign({}, user, {
                    activeChat: userChats.filter((c) => (
                        c.participants === action.participants
                    ))[0]
                });
            }
        case SUBMIT_MESSAGE:
            return Object.assign({}, user, {
                userChats: userChats.map((c) => {
                    if (c.chatID === action.chatID) {
                        return Object.assign({}, c, {
                            thread: c.thread.concat({
                                text: action.text,
                                from: userID
                            })
                        })
                    } else { return c; }
                })
            });
        case START_CHAT:
            return Object.assign({}, user, {
                userChats: userChats.concat({
                    chatID: action.chatID,
                    thread: [],
                    participants: action.participants
                })
            });
        case END_CHAT:
            var aP = activeChat.participants;

            // if only one chat is open, simply return empty containers
            if (userChats.length === 1) {
                return Object.assign({}, user, {
                    activeChat: {},
                    userChats: []
                });
            }
            // if ending current active chat, re-assign active chat then end target chat
            if (action.participants === aP) {

                const newActive = userChats.filter((c) => (
                    c.participants !== aP
                ))[0].participants;

                return Object.assign({}, user, {
                    activeChat: userChats.filter((c) => (
                        c.participants === newActive
                    ))[0],
                    userChats: userChats.filter((c) => (
                        c.participants !== action.participants
                    ))
                });
            }
            // end target chat
            return Object.assign({}, user, {
                userChats: userChats.filter((c) => (
                    c.participants !== action.participants
                ))
            });
        default:
            return user;
    }
}

//contacts page reducer
export const contactsPage = (
    contactsPage = {
        filterString: ""
    },
    action
) => {
    switch (action.type) {
        case UPDATE_FILTER:
            return Object.assign({}, contactsPage, {
                filterString: action.filterString
            })
        default:
            return contactsPage
    }
}

//settings reducer
export const settings = (settings = { theme: "yellow" }, action) => {
    switch (action.type) {
        case SET_THEME:
            return Object.assign({}, settings, {
                theme: action.theme
            });
        default:
            return settings;
    }
}







