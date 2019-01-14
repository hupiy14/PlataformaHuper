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
                            <a className="header">Rachel</a>
                            <div className="description">Estrategia de desarrollo App web <a><b>Puedes consultarlo con un click</b></a> justo ahora.</div>
                        </div>
                    </div>
                    <div className="item">
                        <i className="file alternate icon" />
                        <div className="content">
                            <a className="header">Pablo</a>
                            <div className="description">Cronograma de desarrollo <a><b>Puedes consultarlo con un click</b></a> justo ahora.</div>
                        </div>
                    </div>
                    <div className="item">
                        <i className="file alternate icon" />
                        <div className="content">
                            <a className="header">Luis</a>
                            <div className="description">CVs Actualizados <a><b>Puedes consultarlo con un click</b></a> justo ahora.</div>
                        </div>
                    </div>
                    <div className="item">
                        <i className="file alternate icon" />
                        <div className="content">
                            <a className="header">Rachel</a>
                            <div className="description">Cambio Parametros de diseño <a><b>Puedes consultarlo con un click</b></a> justo ahora.</div>
                        </div>
                    </div>
                </div>


            </div>



        )
    };
};

export default connect(null)(listAdjuntos);