import React from 'react';
import { connect } from 'react-redux';
import { signIn, signOut, userRolIn, nombreUsuario } from '../actions';
import DashBoard from './DashBoard';
import { Link } from 'react-router-dom';
import history from '../history';

import '../components/styles/ingresoHupity.css';
import firebase from 'firebase';

class GoogleAuth extends React.Component {

    componentDidMount() {
        window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
                clientId: '114346141609-03hh8319khfkq8o3fc6m2o02vr4v14m3.apps.googleusercontent.com',
                scope: 'email'

            }).then(() => {
                this.auth = window.gapi.auth2.getAuthInstance();

                this.onAuthChange(this.auth.isSignedIn.get());
                this.auth.isSignedIn.listen(this.onAuthChange);
                //   console.log(this.auth.currentUser.get().getId());
            });
        });
    }

    onAuthChange = isSignedIn => {
        if (this.auth.currentUser.get().w3)
            this.props.nombreUsuario(this.auth.currentUser.get().w3.ofa);
        //console.log(this.auth.currentUser.get().w3.ig);

        let x;

        if (isSignedIn) {

            const nameRef = firebase.database().ref().child('Usuario').child(this.auth.currentUser.get().getId());
            nameRef.on('value', (snapshot) => {

                if (snapshot.val()) {

                    const nameRef2 = firebase.database().ref().child('Usuario-Rol').child(this.auth.currentUser.get().getId());
                    nameRef2.on('value', (snapshot2) => {

                        this.props.userRolIn(snapshot2.val().Rol);
                    });
                }
                else {
                    this.auth.signOut();
                }
                /*  if()
                  else
                  {}
    */

            })


            this.props.signIn(this.auth.currentUser.get().getId());
        } else {
            this.props.signOut();
        }


        if (x)
            this.props.signOut();



        /*   if (isSignedIn) {        
               this.props.signIn(this.auth.currentUser.get().getId());
           } else {
               this.props.signOut();
           }*/
    };







    onSignInClick = () => {
        this.auth.signIn();
    };
    onSignOutClick = () => {
        this.auth.signOut();
    };

    renderAuthButton() {

        if (this.props.isSignedIn === null) {
            return null;
        } else if (this.props.isSignedIn) {
            history.push('/dashboard');
            return (
                <button onClick={this.onSignOutClick} className="ui red google button bar-top">
                    <i className="google icon" />
                    Sing Out
            </button>
            );
        } else {
            history.push('/login');
            return (
                <button onClick={this.onSignInClick} className="ui red google button">
                    <i className="google icon" />
                    Sing In with Google
          </button>

            );
        }
    }


    render() {
        return <div>{this.renderAuthButton()}</div>
    }
};

const mapStateToProps = (state) => {
    return {
        isSignedIn: state.auth.isSignedIn
    };
};

export default connect(mapStateToProps, { signIn, signOut, userRolIn, nombreUsuario })(GoogleAuth);