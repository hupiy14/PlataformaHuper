import React from 'react';
import { connect } from 'react-redux';

class listAdjuntos extends React.Component {
    render() {
        return (

            <div>
                <h3>Ultimos archivos compartidos</h3>
                <div className="ui list">
                    <div className="item">
                        <i className="file alternate icon" />
                        <div className="content">
                            <div className="header">Rachel</div>
                            <div className="description">Estrategia de desarrollo App web <div><b>Puedes consultarlo con un click</b></div> justo ahora.</div>
                        </div>
                    </div>
                    <div className="item">
                        <i className="file alternate icon" />
                        <div className="content">
                            <div className="header">Pablo</div>
                            <div className="description">Cronograma de desarrollo <div><b>Puedes consultarlo con un click</b></div> justo ahora.</div>
                        </div>
                    </div>
                    <div className="item">
                        <i className="file alternate icon" />
                        <div className="content">
                            <div className="header">Luis</div>
                            <div className="description">CVs Actualizados <div><b>Puedes consultarlo con un click</b></div> justo ahora.</div>
                        </div>
                    </div>
                    <div className="item">
                        <i className="file alternate icon" />
                        <div className="content">
                            <div className="header">Rachel</div>
                            <div className="description">Cambio Parametros de diseño <div><b>Puedes consultarlo con un click</b></div> justo ahora.</div>
                        </div>
                    </div>
                </div>


            </div>



        )
    };
};

export default connect(null)(listAdjuntos);