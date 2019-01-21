import React from 'react';
import { connect } from 'react-redux';


class ListEjemplo extends React.Component {

   
    componentDidMount() {
        // console.log(this.example2);

    }

    render() {
        const valor = 70;
        return (

            
            <div className="ui relaxed divided list">
                <h3>{this.props.titulo}</h3>
                <div className="item">
                    <i className={`large middle ${this.props.icono} aligned icon`}></i>
                    <div className="content">



                        <div className="ui top attached progress " id="example2" value={valor} >
                            <div className="bar"></div>
                        </div>
                        <div className="header">{this.props.title}</div>
                        <div className="description">{this.props.description}</div>
                        <div className="ui bottom attached progress">
                            <div className="bar"></div>
                        </div>
                      

                    </div>
                </div>
                <div className="item">
                    <i className={`large middle ${this.props.icono} aligned icon`}></i>
                    <div className="content">
                        <div className="header">{this.props.title2}</div>
                        <div className="description">{this.props.description2}</div>
                    </div>
                </div>
            </div>








        )
    };
};




export default connect(null)(ListEjemplo);




