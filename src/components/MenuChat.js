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

    renderMenu() {
        if (this.props.isSignedIn) {

            ///configuracion responsive
            let ubicacionChat = "foot-chat";
            if (window.screen.width < 500) {

                ubicacionChat = "foot-chatX1";
            }

            return (<div>
                <div className={ubicacionChat} >
                    <button onClick={this.onChat} className="massive ui yellow large circular comment alternate outline icon button">
                        <i className="comment alternate outline large icon"></i>
                    </button>

                </div>
                {this.renderAuthButton()}
            </div>);
        }
    }



    render() {



        return (

            <div>
                {this.renderMenu()}
            </div>



        );
    }
};

const mapStateToProps = (state) => {
    return {
        isSignedIn: state.auth.isSignedIn,
        isChat: state.chatReducer.isChat,

    };
};


export default connect(mapStateToProps, { chatOn, chatOff })(MenuChat);
