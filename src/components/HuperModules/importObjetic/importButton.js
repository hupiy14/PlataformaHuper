import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Image, Icon, Popup } from 'semantic-ui-react';
import { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, pasoOnboardings, estadochats, MensajeIvilys } from '../../modules/chatBot/actions';
import moment from 'moment';
import './importBut.scss';
import trello from  '../../../images/trello.png';
import asana from  '../../../images/asana.png';
import googleSheet from  '../../../images/googleSheet.png';
import clickup from  '../../../images/clickup.png';

class importButton extends React.Component {



    render() {
        return (

   
            <Popup style={{ top: '80px', left: '300px'}}
            trigger={
                <div>
                <nav className="menus" style={{
                    position: 'relative',
                    top: '70px'
                }}> 
                    <input type="checkbox" href="#" className="menus-open" name="menus-open" id="menus-open" />
                    <label className="menus-open-button" for="menus-open">
                        <span className="liness lines-1"></span>
                        <span className="liness lines-2"></span>
                        <span className="liness lines-3"></span>
                    </label>
    
                    <a href="#" className="menus-item blue">   <Image src={trello} size="mini" style={{ top: '20px', left: '22px'}}></Image> </a>
                    <a href="#" className="menus-item red"> <Image src={asana} size="mini" style={{ top: '20px', left: '22px'}}></Image> </a>
                    <a href="#" className="menus-item gray"> <Image src={googleSheet} size="mini" style={{ top: '20px', left: '22px', filter: 'grayscale(1)'}}></Image> </a>
                    <a href="#" className="menus-item gray"> <Image src={clickup} size="mini" style={{ top: '20px', left: '22px', filter: 'grayscale(1)'}}></Image></a>
                  
                </nav>
                </div>}
                >
            <Popup.Content >
                <h5 >Importa tus objetivos</h5>
            </Popup.Content>
        </Popup>




            
        );
    }
};

const mapAppStateToProps = (state) => (
    {
        numeroTareasTerminadas: state.chatReducer.numeroTareasTerminadas,
        popupDetalle: state.chatReducer.popupDetalle,
        listaObjetivo: state.chatReducer.listaObjetivo,
        prioridadObj: state.chatReducer.prioridadObj,
        usuarioDetail: state.chatReducer.usuarioDetail,
        selObjetivo: state.chatReducer.selObjetivo,
        MensajeIvily: state.chatReducer.MensajeIvily,
        userId: state.auth.userId,

    });


export default connect(mapAppStateToProps, { listaObjetivos, prioridadObjs, popupDetalles, numeroTareasTs, estadochats, pasoOnboardings, MensajeIvilys })(importButton);