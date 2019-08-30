import React from 'react';
import image from '../images/hupityNewlogo.png';
import { Link } from 'react-router-dom';
import GoogleAuth from './GoogleAuth';
import { connect } from 'react-redux';


// 'border-radius': '50px 15px'
class ingresoPlataforma extends React.Component {
    /*
      <Link to="" style={{
                            background: 'linear-gradient(to right, #fce64d -30%, rgb(255, 106, 0)100%)',
                            color:'#fffcfc', height: '52px', width:'8em',    
                            'border-radius': '20px',
                            top: '52px',
                            left: '-64px',
                            position: 'relative'
                        
                        }} className=" big button">
    
                            <b style={{ position: 'relative', left:'25px', top: '16px',  'font-size': 'large'}}> Ingresar</b>
                            
                            </Link>
    */

    componentDidMount() {
        console.log(this.props.userId);
    }
    render() {
        return (

            <div className="ui placeholder segment icon-right" style={{ 'border-color': '#fcd45e', 'height': '100%' }}>
                <br></br>
                <br></br>
                <div className="inline center">
                    <img className="ui medium rounded image" src={image} />

                </div>
                <div className="inline center" >
                    <br></br>
                    <div style={{ position: 'relative', left: '-70px' }}>
                        <GoogleAuth />
                    </div>

                </div>

            </div>


        );
    }
};


const mapStateToProps = (state) => {
    return {
        usuarioDetail: state.chatReducer.usuarioDetail,
        userRol: state.chatReducer.userRol,
        pasoOnboarding: state.chatReducer.pasoOnboarding,
        isSignedIn: state.auth.isSignedIn,
        userId: state.auth.userId,
    };
};

export default connect(mapStateToProps, {})(ingresoPlataforma);





