import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Image, Icon, Step } from 'semantic-ui-react';
import './efect5.css';
import { gsap, Power1, TweenLite } from "gsap/all";




class listActividades extends React.Component {

    state = {
        actividades: null, tiempos: 0, horamaxima: 8, primero: null, aux: null
        , index: 0, delay: .02, mensaje: null
    }





    render() {


        return (
            <div className='sp-containerE1'>
                <div className='bodyFlash'>
                    <div className='divFlash'>
                     
                            Escape
                   
                    </div>
                    <div className='divFlash'>
                        <span >
                    
                                into amazing experiences
                    
                        </span>
                    </div >
                    <p>a css3 animation demo</p>
                </div>
            </div>




        );
    }
};

const mapAppStateToProps = (state) => (
    {
        numeroTareasTerminadas: state.chatReducer.numeroTareasTerminadas,
        usuarioDetail: state.chatReducer.usuarioDetail,
        selObjetivo: state.chatReducer.selObjetivo,
        userId: state.auth.userId,

    });


export default connect(mapAppStateToProps, {})(listActividades);