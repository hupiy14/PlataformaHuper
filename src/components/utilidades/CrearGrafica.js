import React from 'react';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

import randomColor from '../../lib/randomColor';
import randomScalingFactor from '../../lib/randomScalingFactor';
import { Responsive, Segment } from 'semantic-ui-react';
const randonStyle = require('../../lib/randonStyle')

class legenExample extends React.Component {

    render() {

        const data = {
            labels: this.props.labelsX,
            datasets: [
                {
                    label: this.props.label1,
                    data: this.props.datos1,
                    //  fill: false,
                    // borderDash: [5, 5]
                }, {
                    hidden: true,
                    label: this.props.label2,
                    data: this.props.datos2
                }, {
                    label: this.props.label3,
                    data: this.props.datos3
                }
            ]
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
            scales: {
                xAxes: [
                    {
                        display: true,
                        scaleLabel: {
                            show: true,
                            labelString: 'Month'
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        scaleLabel: {
                            show: true,
                            labelString: 'Value'
                        },
                        ticks: {
                            suggestedMin: -10,
                            suggestedMax: this.props.maxLen
                        }
                    }
                ]
            }
        }

        let style = randonStyle();

        for (let dataset of data.datasets) {

            dataset.borderColor = randomColor(0.4, style)
            dataset.backgroundColor = randomColor(0.5, style)
            dataset.pointBorderColor = randomColor(0.7, style)
            dataset.pointBackgroundColor = randomColor(0.5, style)
            dataset.pointBorderWidth = 1
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
                            <Line className="ui form" data={data} width={ancho}
                                height={largo} options={options} />
                        </div>
                    </React.Fragment>

                </Responsive>
            </Segment.Group>

        )
    };
};

export default connect(null)(legenExample);