import React from 'react';
import { connect } from 'react-redux';
import { createStream } from '../actions';
//import history from '../history';
//import Modal from './Modal';
//import { Link } from 'react-router-dom';
//import BarExample from './graficosChart/barExample';
//import LineExample from './graficosChart/lineExample';
import AreaExample from './graficosChart/legenOptionsExample';
import ListImportan from './utilidades/listaImportante';
import ListAdjuntos from './utilidades/listAdjuntos';
import Calendario from './utilidades/calendario';






class DashBoard extends React.Component {
  
    render() {
       
        return (

            <div>
               
                <div className="ui form">



                    <div className="two column stackable ui grid">
                        <div className="column eleven wide">
                            <div className="ui segment ">
                                <AreaExample />
                            </div>
                        </div>
                        <div className="column five wide">
                            <div className="ui segment">
                         
                                <ListImportan />
                            </div>
                        </div>
                        <div className="column eleven wide">
                            <div className="ui segment">
                                <AreaExample />
                            </div>
                        </div>
                        <div className="column five wide">
                            <div className="ui segment">
                         
                                <ListImportan />
                            </div>
                        </div>
                        <div className="column five wide">
                            <div className="ui segment">
                         
                                <ListAdjuntos />
                            </div>
                        </div>
                        <div className="column eleven wide">
                            <div className="ui segment">
                         
                                <Calendario />
                            </div>
                        </div>
                        
                    </div>



















                </div >
            </div >

        );
    }
};
export default connect(null, { createStream })(DashBoard);