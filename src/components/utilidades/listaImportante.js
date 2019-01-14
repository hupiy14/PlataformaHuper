import React from 'react';
import { connect } from 'react-redux';

class listImportante extends React.Component {
    render() {
        return (

       
            <div className="ui relaxed divided list">
               <h3>{this.props.titulo}</h3>
                <div className="item">
                    <i className={`large middle ${this.props.icono} aligned icon`}></i>
                    <div className="content">
                        <a className="header">{this.props.title}</a>
                        <div className="description">{this.props.description}</div>
                        <div className="ui indicating progress" data-value="100" data-total="200">
                            <div className="bar">
                                <div className="progress"></div>
                            </div>
                       
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