import React from 'react';
import { connect } from 'react-redux';
import '../components/styles/ingresoHupity.css';
import ChatHup from './modules/chatBot/paginaInicio';

import { chatOn, chatOff } from '../actions';


class MenuChat extends React.Component {



    renderAuthButton() {
        if (this.props.isChat) {
            return (
                <ChatHup />
            );
        } 
    }


    onChat = () => {
        if (this.props.isChat) {        
                this.props.chatOff();
               
        } else {
            this.props.chatOn();
              
        }
    };



    render() {
        return (

            <div>
               
                <div className="foot-chat" >
                    <button onClick={this.onChat} className= "massive ui blue circular comment alternate outline icon button">
                        <i className="comment alternate outline icon"></i>
                    </button>

                </div>
                {this.renderAuthButton()}

            </div>

        );
    }
};

const mapStateToProps = (state) => {
    return { isChat: state.chatReducer.isChat };
};


export default connect(mapStateToProps, { chatOn, chatOff })(MenuChat);
