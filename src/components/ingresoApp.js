import React from 'react';
import image from '../images/hupityNewlogo.png';
import { Link } from 'react-router-dom';



class ingresoPlataforma extends React.Component {
  
    render() {
        return (

            <div className="ui placeholder segment icon-right" style={{ 'border-color': '#fcd45e', 'height': '100%'}}>
                <br></br>
                <br></br>
                <div className="inline center">
                    <img className="ui medium rounded image" src={image} />

                </div>
                <div className="inline center">
                    <br></br>
                    <Link to="/login" style={{background: '#fde19e' }} className="ui big button">Ingresar</Link>
                </div>

            </div>


        );
    }
};

export default ingresoPlataforma; 