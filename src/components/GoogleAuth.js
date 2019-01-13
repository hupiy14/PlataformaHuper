import React from 'react';
import { connect } from 'react-redux';
import { signIn, signOut } from '../actions';
import DashBoard from './DashBoard';
import { Link } from 'react-router-dom';
import history from '../history';

import '../components/styles/ingresoHupity.css';

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
            });
        });
    }

    onAuthChange = isSignedIn => {
        if (isSignedIn) {
            this.props.signIn(this.auth.currentUser.get().getId());
        } else {
            this.props.signOut();
        }
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
                    <i className="google icom" />
                    Sing Out
            </button>
            );
        } else {
            history.push('/login');
            return (
                <button onClick={this.onSignInClick} className="ui red google button">
                    <i className="google icom" />
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
    return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);