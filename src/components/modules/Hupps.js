import React from 'react';
import { connect } from 'react-redux';
import CardFeedback from '../utilidades/cardFeeback';
import image from '../../images/hupityNewlogo.png';

class Hupps extends React.Component {

    render() {

        return (
            <div className="four column stackable ui grid">
                <div className="column  ">
                    <CardFeedback image={image} />
                </div>
                <div className="column ">
                    <CardFeedback image={image} />
                </div>
                <div className="column ">
                    <CardFeedback image={image} />
                </div>
                <div className="column ">
                    <CardFeedback image={image} />
                </div>
                <div className="column ">
                    <CardFeedback image={image} />
                </div>
                <div className="column ">
                    <CardFeedback image={image} />
                </div>
            </div>


        );

    }

};

export default connect(null)(Hupps);


