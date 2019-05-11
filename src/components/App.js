import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';



import MenuChat from './MenuChat';
import Header from './Header';
//formulario de ingreso
import FomularioGlobal from './FormularioIngreso/formularioGlobal';
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
import Onboard from './PruebaP';
import Profile from './profileHuper';
import Exito from './continuarProceso';
import ContinuarProceso from './continuarProceso';
import ModalFormValidacion from './gestorModules/formularioValidacionObj';
//configuracion de flujo

import  FLujoCreate from './modules/newFlowWork';



//PruebaG



///otra forma de link   <Route path="/" exact render={()=> <StreamList />}  />


class App extends React.Component {


    renderMenuChat() {
        if (this.props.userRol === '2' || (this.props.usuarioDetail && this.props.usuarioDetail.usuario && this.props.usuarioDetail.usuario.onboarding)) {
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
                                            <Route path="/onboarding" exact component={Onboard} />
                                            <Route path="/profile" exact component={Profile} />
                                            <Route path="/proceso/exito" exact component={Exito} />
                                            <Route path="/formulario/validacion" exact component={ModalFormValidacion} />
                                            <Route path="/formulario" exact component={FomularioGlobal} />
                                            <Route path="/formulario/empresa" exact component={FomularioEmp} />
                                            <Route path="/formulario/equipo" exact component={FormularioEquipo} />
                                            <Route path="/formulario/codigo" exact component={FormularioCodigo} />
                                           
                                            <Route path="/newworkflow" exact component={FLujoCreate} />
                                            


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