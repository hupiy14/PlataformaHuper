import React from 'react';
import { connect } from 'react-redux';
import Home from './homePage';
import Menu from './menuChat';
import './chatHupApp.css';
import Contacts from './contactsPage';
import Profile from './profilePage';
import { settings as Senttings } from './settingsPage';




class App extends React.Component {
    renderChatButton() {

    
        if (this.props.isChatUbi === 'contacs') {
            return <Contacts  /> ;
        }
        else if (this.props.isChatUbi === 'profile') {
            return <Profile  /> ;
        }
        else if (this.props.isChatUbi === 'settings') {
            return <Senttings /> ;
        }
        else if (this.props.children) {
            return  this.props.children ;
        }
        else
        {
           return  <Home user={this.props.user} /> ;
        }

        
    }


  


    render() {

        const content = this.props.children
            ? this.props.children
            : <Home user={this.props.user} />


        return (
            <div className="ui grid">
               
                <div className={"app-wrapper " + this.props.theme + " right floated five wide column"}>
                {this.renderChatButton()}
                    <Menu />
                </div>
            </div>
            // set home to default route initiall
        )
    };
};

const mapAppStateToProps = (state) => (
    {
        user: state.user,
        theme: state.settings.theme,
        isChatUbi: state.chatReducer.isChatUbi
    });


export default connect(mapAppStateToProps)(App);
















