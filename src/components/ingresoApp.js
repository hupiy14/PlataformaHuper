import React from 'react';
import image from '../images/logo.png';
import GoogleAuth from '../components/loginGoogle/GoogleAuth';
import { connect } from 'react-redux';
import history from '../history';
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

   componentDidUpdate()
   {
       if (this.props.isSignedIn) {
           history.push('/dashboard');
           return;
       }
   }
    render() {

      
        return (
            <div className="ui placeholder segment icon-right" style={{ borderColor: '#e03997', height: '100%', background: "#fffffF" }}>
                <br></br>
                <br></br>
                <div className="inline center">
                    <img alt='hupity tu compañero en el trabajo' className="ui medium rounded image" src={image} />
                </div>
                <div className="inline center" >
                    <br></br>
                        <GoogleAuth />
                </div>
            </div>
        );
    }
};


const mapStateToProps = (state) => {
    return {
        usuarioDetail: state.chatReducer.usuarioDetail,
        pasoOnboarding: state.chatReducer.pasoOnboarding,
        isSignedIn: state.auth.isSignedIn,
        userId: state.auth.userId,
    };
};

export default connect(mapStateToProps, {})(ingresoPlataforma);





