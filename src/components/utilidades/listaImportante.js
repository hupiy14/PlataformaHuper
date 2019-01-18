import React from 'react';
import { connect } from 'react-redux';

class listImportante extends React.Component {
  
  componentDidMount(){
    
  }
  
    render() {


     

        return (


            <div className="ui relaxed divided list">
                <h3>{this.props.titulo}</h3>
                <div className="item">
                    <i className={`large middle ${this.props.icono} aligned icon`}></i>
                    <div className="content">

                        <div className="ui top attached progress"  model="34" >
                            <div className="bar"></div>
                        </div>
                        <a className="header">{this.props.title}</a>
                        <div className="description">{this.props.description}</div>
                        <div className="ui bottom attached progress">
                            <div className="bar"></div>
                        </div>




                    </div>
                </div>
                <div className="item">
                    <i className={`large middle ${this.props.icono} aligned icon`}></i>
                    <div className="content">
                        <a className="header">{this.props.title2}</a>
                        <div className="description">{this.props.description2}</div>
                    </div>
                </div>
                <div className="item">
                    <i className={`large middle ${this.props.icono} aligned icon`}></i>
                    <div className="content">
                        <a className="header">{this.props.title3}</a>
                        <div className="description">{this.props.description3}</div>
                    </div>
                </div>
            </div>








        )
    };
};

export default connect(null)(listImportante);