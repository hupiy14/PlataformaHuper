import React from 'react';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

import randomColor from '../../lib/randomColor';
import randomScalingFactor from '../../lib/randomScalingFactor'

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

const data = {
    labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July"
    ],
    datasets: [
        {
            label: "My First dataset",
            data: [
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor()
            ],
            fill: false,
            borderDash: [5, 5]
        }, {
            hidden: true,
            label: 'hidden dataset',
            data: [
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor()
            ]
        }, {
            label: "My Second dataset",
            data: [
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor()
            ]
        }
    ]
}

const options = {
    responsive: true,
    title: {
        display: true,
        text: 'Chart.js Line Chart'
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
                    suggestedMax: 250
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

class legenExample extends React.Component {
    render() {
        return (
            <React.Fragment>
             
                <Line data={data} options={options} />
            </React.Fragment>
        )
    };
};

export default connect(null)(legenExample);