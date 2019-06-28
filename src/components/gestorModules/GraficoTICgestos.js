import React from 'react';
import { Radar } from 'react-chartjs-2';
import { connect } from 'react-redux';
import randomColor from '../../lib/randomColor';
import { Responsive, Segment } from 'semantic-ui-react';
const randonStyle = require('../../lib/randonStyle')

class GraficaGestorTIC extends React.Component {

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
            yAxes: [
                {
                    display: false,

                }
            ],
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

     


        let box = 'rgb(189, 93, 26)  6px 11px 12px 0px';
        let t = <h3 style={{ left: '40%', position: 'relative', color: '#d05600' }}>{this.props.TituloGrafica}</h3>
        if (this.props.equipoGra) {
             box = '#ab778e -13px 17px 12px 0px';
             t = <h2 style={{ left: '35%', position: 'relative', color: '#d05600' }}>{this.props.TituloGrafica}</h2>
         
        } 


        return (
           <div >
              <h3 className="center">{t}</h3>
                     <div style={{ 'box-shadow': box }}>
                            <Radar data={data} 
                                options={options} />
                    </div>
              </div>
                      
                 

        )
    };
};

export default connect(null)(GraficaGestorTIC);