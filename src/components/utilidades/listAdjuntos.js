import React from 'react';
import { connect } from 'react-redux';

class listAdjuntos extends React.Component {
    render() {
        return (

            <div>
                <h3>Archivos Compartidos</h3>
                <div className="ui list">
                    <div className="item">
                        <i className="file alternate icon" />
                        <div className="content">
                            <a className="header">Rachel</a>
                            <div className="description">Estrategia de desarrollo App web <a><b>Arrested Development</b></a> just now.</div>
                        </div>
                    </div>
                    <div className="item">
                        <i className="file alternate icon" />
                        <div className="content">
                            <a className="header">Pablo</a>
                            <div className="description">Cronograma de desarrollo <a><b>Arrested Development</b></a> just now.</div>
                        </div>
                    </div>
                    <div className="item">
                        <i className="file alternate icon" />
                        <div className="content">
                            <a className="header">Luis</a>
                            <div className="description">CVs Actualizados <a><b>Arrested Development</b></a> just now.</div>
                        </div>
                    </div>
                    <div className="item">
                        <i className="file alternate icon" />
                        <div className="content">
                            <a className="header">Rachel</a>
                            <div className="description">Cambio Parametros de diseño <a><b>Arrested Development</b></a> just now.</div>
                        </div>
                    </div>
                </div>


            </div>



        )
    };
};

export default connect(null)(listAdjuntos);