import React from 'react';
import image from '../images/hupityNewlogo.png';
import { Link } from 'react-router-dom';


const ingresoPlataforma = () => {

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
};

export default ingresoPlataforma; 