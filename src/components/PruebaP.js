
import React from 'react';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

import randomColor from '../lib/randomColor';
import randomScalingFactor from '../lib/randomScalingFactor';
import { Responsive, Segment } from 'semantic-ui-react';
const randonStyle = require('../lib/randonStyle')
/*
const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};
*/


class LineDemo extends React.Component {

    render() {

        const data = {
            labels: this.props.labelsX,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            datasets: [
                {
                    //   label: this.props.label1,
                    data: this.props.datos1,
                    //  fill: false,
                    // borderDash: [5, 5]
                }, {
                    hidden: true,
                    //label: this.props.label2,
                    data: this.props.datos2
                }, {
                    // label: this.props.label3,
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



        return (
            <div>
                <h2>Line Example</h2>
                <Line ref="chart" data={data}    width={100}
                    height={120} />
            </div>
        );
    }

    componentDidMount() {
        const { datasets } = this.refs.chart.chartInstance.data
        console.log(datasets[0].data);
    }
}

export default LineDemo;