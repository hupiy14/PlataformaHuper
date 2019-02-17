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
            let className="massive ui yellow large circular comment alternate outline icon button";
            let className2="comment alternate outline large icon";
            if (window.screen.width < 500) {

                ubicacionChat = "foot-chatX1";
                className2="comment alternate outline small icon";
                className="massive ui yellow tiny circular comment alternate outline icon button";
            }



            return (<div>
                <div className={ubicacionChat} >
                    <button onClick={this.onChat} className={className}>
                        <i className={className2}></i>
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
