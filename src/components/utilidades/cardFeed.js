import React from 'react';
import { connect } from 'react-redux';
import '../styles/ingresoHupity.css';


class ListEjemplo extends React.Component {


    componentDidMount() {
        // console.log(this.example2);

    }

    render() {

        return (


            <div className="ui card">
                <div className="image big tamaño-Imagen" >
                    <img src={this.props.image} />
                </div>
                <div className="content">
                    <a className="header">{this.props.title}</a>
                    <div className="meta">
                        <span className="date">Joined in 2013</span>
                    </div>
                    <div className="description">
                    {this.props.descripcion}
              </div>
                </div>
                <div className="extra content">
                    <button className="ui basic  yellow button">
                        <i className="comment alternate outline icon "></i>
                        Comentar</button>
                    <button className="ui basic green button">
                        <i className="check circle icon"></i>
                        Aprobar</button>
                  

                </div>

            </div>


        )
    };
};




export default connect(null)(ListEjemplo);