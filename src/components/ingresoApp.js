import React from 'react';
import image from '../images/hupityNewlogo.png';
import { Link } from 'react-router-dom';



class ingresoPlataforma extends React.Component {

    render() {
        return (

            <div className="ui placeholder segment icon-right" style={{ 'border-color': '#fcd45e', 'height': '100%' }}>
                <br></br>
                <br></br>
                <div className="inline center">
                    <img className="ui medium rounded image" src={image} />

                </div>
                <div className="inline center">
                    <br></br>
                    <Link to="/login" style={{
                        background: 'linear-gradient(to right, #fce64d -30%, rgb(255, 106, 0)100%)',
                        'border-radius': '50px 15px', color:'#fffcfc'
                    }} className="ui big button">Ingresar</Link>
                </div>

            </div>


        );
    }
};

export default ingresoPlataforma; 