import React from 'react';
import image from '../images/hupityNewlogo.png';
import { Link } from 'react-router-dom';
import SlackA from '../apis/slackApi';


class ingresoPlataforma extends React.Component {
    componentDidMount() {
        this.onSearchXpress();
    }
    onSearchXpress = async () => {
        const response = await SlackA.get('/authorize', {
            params: {
                scope: 'identity.basic',
                client_id: '482555533539.532672221010',

            },

        });
        console.log('entro');
        console.log(response);
        //  this.setState({ avatares: response.data.lowResGifs })

    }
    render() {
        return (

            <div className="ui placeholder segment icon-right">
                <br></br>
                <br></br>
                <div className="inline center">
                    <img className="ui medium rounded image" src={image} />

                </div>
                <div className="inline center">
                    <br></br>
                    <Link to="/login" className="ui big button">Ingresar</Link>
                </div>

            </div>


        );
    }
};

export default ingresoPlataforma; 