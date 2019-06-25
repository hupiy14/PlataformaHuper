import React from 'react';
import { connect } from 'react-redux';
import '../modules/chatBot/chatHupApp.css';
import Swiper from 'swiper';
const timeoutLength2 = 2000;


class Hup extends React.Component {

    state = {
        slides: (function () {
            var slides = [];
            for (var i = 0; i < 600; i += 1) {
                slides.push('Slide ' + (i + 1));
            }
            return slides;
        }()),
        // virtual data
        virtualData: {
            slides: [],
        },
    };

    componentDidMount() {
        const self = this;
        const swiper =new Swiper('.swiper-container', {
            effect: 'flip',
            grabCursor: true,
            pagination: {
              el: '.swiper-pagination',
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
          });
    }
    render() {
        return (
            <div className="swiper-container">
            <div className="swiper-wrapper">
              <div className="swiper-slide" 
              > <h1>Hola</h1></div>
             <div className="swiper-slide" 
              > <h1>Hola 2</h1></div>  
              <div className="swiper-slide" 
              > <h1>Hola 3</h1></div>
             
             
            </div>
        
          
            <div className="swiper-pagination"></div>
        
         
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </div>
           
            );

    }

}
export default connect()(Hup);
