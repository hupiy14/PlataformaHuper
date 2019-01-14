import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import { config } from '../../apis/huperDB';



class comunicacionPrueba extends React.Component {
    constructor() {
        super()
        this.state = {
            name: 'Carlos'
        }
    }

    componentWillMount() {
        const nameRef = firebase.database().ref().child('objeto').child('name');
        console.log(nameRef);
        nameRef.on('value', (snapshot) => {
            this.setState({
                name: snapshot.val()
            })
        })
    }

    render() {
        return (
            <div>Hola {this.state.name}</div>
        );
    }
};

export default comunicacionPrueba;