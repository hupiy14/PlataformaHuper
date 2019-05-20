import React from 'react';
import ChatHuper from './connecteApp';


class chat extends React.Component {
    render() {

        let ubicacionChat = "container foot-chatH";
        if (window.screen.width < 500) {

            ubicacionChat = "container foot-chatHX1";
        }
        return (
            <div className={ubicacionChat} style={{ background:'#ffb516'}} >
                <ChatHuper />
            </div>
        );
    }
};

export default chat;

