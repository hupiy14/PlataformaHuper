import React from 'react';
import { connect } from 'react-redux';
import Chart from "react-apexcharts";

const randonStyle = require('../../lib/randonStyle')


class legenExample extends React.Component {



    render() {

        let box = 'rgb(189, 93, 26)  6px 11px 12px 0px';
        let t = <h3 style={{ 'text-align': 'center','top': '10px', position: 'relative', color: '#d05600' }}>{this.props.TituloGrafica}</h3>


        if (this.props.equipoGrafica) {
            box = '#ab778e -13px 17px 12px 0px';
            t = <h2 style={{ 'text-align': 'center', 'top': '10px', position: 'relative', color: '#d05600' }}>{this.props.TituloGrafica}</h2>
        }


        return (

            <div>
                {t}
                <div >
                    <Chart
                        options={{
                            chart: {
                                id: "basic-bar"
                            },
                            xaxis: {
                                categories: this.props.labelsX
                            },
                            yaxis: {
                                max: 100,
                                show: false,
                            },
                            theme: {
                                mode: 'light', 
                                palette: 'palette8', 
                                shadeIntensity: 1,
                                monochrome: {
                                    enabled: false,
                                    color: '#255aee',
                                    shadeTo: 'light',
                                    shadeIntensity: 0.65
                                },
                            }

                        }}
                        
                        responsive={[
                            {
                                breakpoint: 1000,
                                options: {
                                    plotOptions: {
                                        bar: {
                                            horizontal: false
                                        }
                                    },
                                    legend: {
                                        position: "bottom"
                                    }
                                }
                            }
                        ]}
                        grid= {{
                            position: 'front'
                          }}
                        series={this.props.datos}
                        type="radar"
                        width="100%"
                        height="420px"
                        
                    />
                </div>
            </div>

        )
    };
};

export default connect(null)(legenExample);