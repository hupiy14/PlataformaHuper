import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { connect } from 'react-redux';

const data = {
    labels: [
        'Red',
        'Green',
        'Yellow'
    ],
    datasets: [{
        data: [300, 50, 100],
        backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
        ],
        hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
        ]
    }]
};



class dinamicExample extends React.Component {
    render() {
        return (
            <div>
                <h2>Doughnut Example</h2>
                <Doughnut data={data} />
            </div>
        )
    };
};

export default connect(null)(dinamicExample);