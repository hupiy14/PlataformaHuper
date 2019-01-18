import React from 'react';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

import randomColor from '../../lib/randomColor';
import randomScalingFactor from '../../lib/randomScalingFactor'


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

        for (let dataset of data.datasets) {
            dataset.borderColor = randomColor(0.4)
            dataset.backgroundColor = randomColor(0.5)
            dataset.pointBorderColor = randomColor(0.7)
            dataset.pointBackgroundColor = randomColor(0.5)
            dataset.pointBorderWidth = 1
        }


        return (
            <React.Fragment>
                <h3 className="center">{this.props.TituloGrafica}</h3>
                <Line data={data} options={options} />
            </React.Fragment>
        )
    };
};

export default connect(null)(legenExample);