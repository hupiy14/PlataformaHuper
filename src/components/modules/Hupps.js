import React from 'react';
import { connect } from 'react-redux';
import CardFeedback from '../utilidades/cardFeed';
//import image from '../../images/hupityNewlogo.png';
import unsplash from '../../apis/unsplash';

class Hupps extends React.Component {
    state = { images: [] };
    componentDidMount() {
        this.onSearchSubmit()
    }

    onSearchSubmit = async () => {
        const response = await unsplash.get('/search/photos', {
            params: { query: 'business' },

        });
        this.setState({ images: response.data.results })
        console.log(this.state.images);
    }

    renderGrafico() {
        if (this.state.images[0]) {
            return (<div className="four column stackable ui grid">
                <div className="column  ">
                    <CardFeedback image={this.state.images[0].urls.regular} 
                    title={'Diseño branding Hupity'}
                    descripcion={'logos, colores y tipografia'}
                    
                    />
                </div>
                <div className="column ">
                    <CardFeedback image={this.state.images[1].urls.regular} 
                   title={'Landing Page'}
                   descripcion={'Diseño y contruccion de la pagina de bienvenida'}
                    
                    />
                </div>
                <div className="column ">
                    <CardFeedback image={this.state.images[2].urls.regular} 
                    title={'Elaboracion del plan financiero'}
                    descripcion={'Proyeccion de ingresos, gastos e inversion'}
                    />
                </div>
                <div className="column ">
                    <CardFeedback image={this.state.images[3].urls.regular}
                        title={'Redaccion de convenios becarios'}
                        descripcion={'Incorporacion de dos personas al equipo Hupity'} />
                </div>
                <div className="column ">
                    <CardFeedback image={this.state.images[4].urls.regular} 
                      title={'Automatizacion de los formularios'}
                      descripcion={'Recoleccion de CVs de los estudiantes'}
                     />
                </div>
                <div className="column ">
                    <CardFeedback image={this.state.images[5].urls.regular} 
                    title={'FeedBack '}
                    descripcion={'Descripcion detallada de la tarea a realizar'}
                    />
                </div>

            </div>);
        }
        else {
            return (<div></div>);
        }

    }

    render() {

        return (

            <div> {this.renderGrafico()}
            </div>
        );

    }

};

export default connect(null)(Hupps);


