import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Image, Icon, Step } from 'semantic-ui-react';
import './efect4.scss';
import { gsap, Power1, TweenLite } from "gsap/all";




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
        let text = "Hupity tu compañero en el trabajo... esta  es la version 2.0.0"

        let letter = Object.keys(text).map((key, index) => {
            return <span className="letter"> {text[key]}</span>
        });



        return (
            <div className="sp-containerE1">
                <div className="wrapper">
                    <div className="letters">
                        {letter}
                        <p>Generate Random Text Transformation Using CSS Only</p>
                    </div>
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