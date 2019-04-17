import React from 'react';
import image from '../images/hupityNewlogo.png';
import { Link } from 'react-router-dom';



class ContinuarProceso extends React.Component {

    render() {
        return (

            <div className="ui placeholder segment icon-right">

                <br></br>
                <div className="inline center">
                    <img className="ui medium rounded image" src={image} />

                </div>

                <div className="inline center">
                    <br></br>
                    <h3>Proceso realizado con exito</h3>
                    <br></br>
                    <div className="ui big button" onClick={()=>{window.close();}}>Continuar</div>
                 
                </div>

            </div>


        );
    }
};

export default ContinuarProceso; 