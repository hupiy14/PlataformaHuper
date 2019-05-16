import React from 'react';
import { Radar } from 'react-chartjs-2';
import { connect } from 'react-redux';
import randomColor from '../../lib/randomColor';
import { Responsive, Segment } from 'semantic-ui-react';
const randonStyle = require('../../lib/randonStyle')

class legenExample extends React.Component {



    render() {

        const data = {
            labels: this.props.labelsX,
            datasets: this.props.datos,
        }

        const options = {
            responsive: true,
            title: {
                display: true,
                text: this.props.titleGrafica
            },
            tooltips: {
                mode: 'label'
            },
            hover: {
                mode: 'dataset'
            },
            borderJoinStyle: 'miter',
            legend: {
                display: true,
                position: 'bottom',
                reverse: true,
            }


        }

        let style = randonStyle();

        const base = 0.15 + this.props.fuerza ? this.props.fuerza : 0;
        for (let dataset of data.datasets) {

            dataset.borderColor = randomColor(0.4, style)
            dataset.backgroundColor = randomColor(base, style)
            dataset.pointBorderColor = randomColor(0.7, style)
            dataset.pointBackgroundColor = randomColor(0.5, style)
            dataset.pointBorderWidth = 2
            style = style + 1;
            if (style === 4)
                style = 1;
        }

        let largo = 60;
        let ancho = 100;
        if (window.screen.width < 500) {

            largo = 250;
            ancho = 160;
        }





        return (
            <Segment.Group>
                <Responsive as={Segment}>

                    <React.Fragment>
                        <h3 className="center">{this.props.TituloGrafica}</h3>
                        <div >
                            <Radar data={data} width={ancho}
                                height={largo} options={options} />
                        </div>
                    </React.Fragment>

                </Responsive>
            </Segment.Group>

        )
    };
};

export default connect(null)(legenExample);