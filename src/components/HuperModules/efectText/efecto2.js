import React from 'react';
import { connect } from 'react-redux';
import './efect2.css';


class listActividades extends React.Component {

    state = {
        actividades: null, tiempos: 0, horamaxima: 8, primero: null, aux: null
        , index: 0, delay: .02, mensaje: null
    }





    renderClick() {



        let ST = new window.SplitText("#quote", { type: "words,chars" }), chars = ST.chars, l = ST.chars.length;
        // gsap.from("#instructions", {duration: 0.4, autoAlpha: 0});

        window.TweenMax.staggerFrom(chars, 1, { y: 100, opacity: 0, cycle: { delay: function (i) { return Math.abs(Math.floor(l / 2) - i) * 0.1 } }, ease: window.Back.easeOut });

    }


    render() {


        return (
            <div className="sp-container">
                <div className="sp-content">
                    <div className="sp-globe"></div>
                    <h2 className="frame-1">PRODUCTIVIDAD</h2>
                    <h2 className="frame-2">MAS TIEMPO LIBRE</h2>
                    <h2 className="frame-3">EFICIENCIA</h2>
                    <h2 className="frame-4">CON TU COMPAÑERO EN EL TRBAJO!</h2>
                    <h2 className="frame-5">
                        <span>DESCUBRELO,</span>
                        <span>INNOVA,</span>
                        <span>TRANSFORMA.</span>
                        <span>   <div className= "ui button" >hola</div></span>
                     
                    </h2>
                  
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