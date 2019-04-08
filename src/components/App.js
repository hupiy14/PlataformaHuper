import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';



import MenuChat from './MenuChat';
import Header from './Header';

import FomularioGlobal from './FormularioIngreso/formularioGlobal';
import FomularioTipo from './FormularioIngreso/formularioTipo';
import FomularioEmp from './FormularioIngreso/formularioEmp';
import FormularioEquipo from './FormularioIngreso/formularioEquipo';
import FormularioCodigo from './FormularioIngreso/formularioCodigo';

import hupityIngreso from './ingresoApp';
import ingreso from './modules/ingreso';
import dashboard from './DashBoard';
import Hupps from './modules/Hupps';
import { connect } from 'react-redux';
import './modules/chatBot/chatHupApp.css';
import Feedback from '../components/feedbackHupity';
import IngresosHuper from './ingresarUsuarioNuevo';
import Onboard from './PruebaP';
import Profile from './profileHuper';



//PruebaG



///otra forma de link   <Route path="/" exact render={()=> <StreamList />}  />


class App extends React.Component {


    renderMenuChat() {
        if (this.props.userRol=== '2' ||(this.props.usuarioDetail && this.props.usuarioDetail.usuario && this.props.usuarioDetail.usuario.onboarding)) {
            return <MenuChat />;
        }
        return;
    }

    render() {



        return (





            <div>
                <div className="ui container ">
                    <div className="ui items ">
                        <div className="item  ">
                            <div className="content  ">


                                <Router history={history}>
                                    <div>
                                        <Header />


                                        <Switch>
                                            <Route path="/" exact component={hupityIngreso} />
                                            <Route path="/login" exact component={ingreso} />
                                            <Route path="/dashboard" component={dashboard} />
                                            <Route path="/hupps" exact component={Hupps} />
                                            <Route path="/newuser" exact component={IngresosHuper} />
                                            <Route path="/onboarding" exact component={Onboard} />
                                            <Route path="/profile" exact component={Profile} />

                                            <Route path="/formulario" exact component={FomularioGlobal} />
                                            <Route path="/formulario/tipo" exact component={FomularioTipo} />
                                            <Route path="/formulario/empresa" exact component={FomularioEmp} />
                                            <Route path="/formulario/equipo" exact component={FormularioEquipo} />
                                            <Route path="/formulario/codigo" exact component={FormularioCodigo} />
                                            
                                            
                                        </Switch>



                                    </div>
                                </Router>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="pie-Pagina">

                    <Feedback />
                    {this.renderMenuChat()}
                </div>

            </div >


        );
    }
};

const mapStateToProps = (state) => {
    return {
        usuarioDetail: state.chatReducer.usuarioDetail,
        userRol: state.chatReducer.userRol,
        pasoOnboarding: state.chatReducer.pasoOnboarding
    };
};

export default connect(mapStateToProps)(App); 