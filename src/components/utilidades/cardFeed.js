import React from 'react';
import { connect } from 'react-redux';
import '../styles/ingresoHupity.css';


class ListEjemplo extends React.Component {

    constructor(props) {
        super(props);
        this.state = { spans: 0 };
        this.imageRef = React.createRef();
    }

    componentDidMount() {
        this.imageRef.current.addEventListener('load', this.setSpans);
    }

    setSpans = () => {
        const height = this.imageRef.current.clientHeight;
        const spans = Math.ceil(height / 10 );
        this.setState({spans});
    };
   

    render() {

        return (


            <div className="ui card">
                <div className="image big tamaño-Imagen" >
                    <img ref= {this.imageRef} src={this.props.image} />
                </div>
                <div className="content">
                    <div className="header">{this.props.title}</div>
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