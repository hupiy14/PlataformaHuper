import React from 'react'
import { Button, Popup } from 'semantic-ui-react'



class Feed extends React.Component {

    render() {
        let ubicacionFeedbk = "anchoFF";
        let ancho = '28em';
        let largo = '45em';
        let ubicacion = `feedbackBT`;
        let salida = 'right bottom';
        
        if (window.screen.width < 500) {

            ubicacionFeedbk = "anchoFFX1";
            ancho = '20em';
            largo = '30em'
            ubicacion = 'feedbackBTX1';
            salida = 'bottom center';
        }
        const style = {
            borderRadius: 0,
            opacity: 0.95,
            padding: '2em',
            height: {largo},
            width: {ancho},
        };


        const className = `ui segment ${ubicacionFeedbk}`;
        const className2 = `ui embed ${ubicacionFeedbk}`;
        const className3 = `yellow4 ${ubicacionFeedbk}`;
     
       

        return (

            <Popup
                style={style}

                trigger={


                    <Button className={ubicacion} color='orange'  animated='fade'>
                        <Button.Content  visible>Danos tu Feedback</Button.Content>
                        <Button.Content  hidden>Diseña con Nosotros</Button.Content>
                    </Button>

                }
                content={


                    <div className={className}>
                        <div className={className2} >

                            <iframe className={className3} title="Ultimos archivos subidos" src={`https://lucho20.typeform.com/to/B9l6q6`} />

                        </div>


                    </div>


                }
                on='click'
                position={salida}
                inverted
            />
        );

    }


}

export default Feed;