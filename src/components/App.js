import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';

import MenuChat from './HuperModules/chat3X/chatZ';
//import MenuChat from './MenuChat';

import Header from './Header';


// formulario 
import FomularioGlobal from './Login/formInicioCod';
import FomularioInicio from './Login/formEmpEquip';
import FomularioHerramientas from './Login/formUsaSlack';
import FomularioTerm from './Login/formTermCond';

import hupityIngreso from './ingresoApp';
import ingreso from './modules/ingreso';
import dashboard from './Dashboard/Dash1';
//import dashboard from './HuperModules/timerClock/timerr';
import Hupps from './modules/Hupps';
import { connect } from 'react-redux';
import './modules/chatBot/chatHupApp.css';
import Feedback from '../components/feedbackHupity';
import Onboard from './PruebaP';
import Profile from './profileHuper';
import Exito from './continuarProceso';
import ContinuarProceso from './continuarProceso';

import MenuCel from './celphone/menuCel';
import ModalFormValidacion from './gestorModules/formularioValidacionObj';
//configuracion de flujo

import FLujoCreate from './HuperModules/pointWork';
import { celChats } from '../components/modules/chatBot/actions';
import equipoDash from './gestorModules/equipoData';

//celular

import HeaderC from './celphone/HeaderC';
import DashBoardC from './celphone/DashboardC';
import MenuEditObj from './celphone/menuEditO';
import FormacionesObjC from './celphone/formacionesC';
import CalendarioC from './utilidades/calendar2';
import ProfileC from './celphone/profileC';
import NewFlujoC from './celphone/Nflow';
import ProgresoC from './celphone/progreso';

import { hotjar } from 'react-hotjar';

hotjar.initialize(1412405, 6);




///otra forma de link   <Route path="/" exact render={()=> <StreamList />}  />


class App extends React.Component {


    renderMenuChat() {

        if (this.props.usuarioDetail && this.props.usuarioDetail.rol !== '2') {
            if ((this.props.MensajeIvily && this.props.MensajeIvily.nActIVi && this.props.MensajeIvily.nActIVi < 6) || !this.props.listaObjetivo || !this.props.listaObjetivo.objetivos || this.props.usuarioDetail && !this.props.usuarioDetail.usuario.onboarding) {

            }
            else
                return <MenuChat />;
        }
        else {
            if (this.props.usuarioDetail && !this.props.usuarioDetail.usuario.onboarding) {

            }
            else
                return <MenuChat />;
        }



    }

    renderMenuChatC() {

        if (this.props.usuarioDetail && this.props.usuarioDetail.rol !== '2') {
            if ((this.props.MensajeIvily && this.props.MensajeIvily.nActIVi && this.props.MensajeIvily.nActIVi < 6) || this.props.estadochat === "dimmer Plan") {
            }
            else {

                if (this.props.celPerf !== "menu") { }
                return <MenuChat />;
            }

        }
        else { }
        return <MenuChat />;
    }


    render() {
     
        let apps = null;
        if (window.screen.width <= 500 || (window.screen.height <= 500 && window.screen.width <= 800)) {

            apps =
                <div onTouchMove={() => {

                    this.props.celChats(false);
                    if (window.scrollY > 2) this.props.celChats(true);



                }} id="pageIntt" >
                    <div className="ui container " >
                        <div className="ui items ">
                            <div className="item  ">
                                <div className="content  ">


                                    <Router history={history}>
                                        <div>
                                            <HeaderC />

                                            <Switch>
                                                <Route path="/" exact component={hupityIngreso} />
                                                <Route path="/login" exact component={ingreso} />
                                                <Route path="/profile" exact component={ProfileC} />
                                                <Route path="/proceso/exito" exact component={Exito} />
                                                <Route path="/formulario/validacion" exact component={ModalFormValidacion} />
                                                <Route path="/formulario" exact component={FomularioGlobal} />
                                                <Route path="/formulario/inicio" exact component={FomularioInicio} />
                                                <Route path="/formulario/herramientas" exact component={FomularioHerramientas} />
                                                <Route path="/formulario/termcond" exact component={FomularioTerm} />
                                                <Route path="/dashboard" component={DashBoardC} />
                                                <Route path="/editObj" component={MenuEditObj} />                                             
                                                <Route path="/newworkflow" exact component={NewFlujoC} />
                                                <Route path="/menucel" exact component={MenuCel} />
                                                <Route path="/formacionesC" exact component={FormacionesObjC} />
                                                <Route path="/calendarioC" exact component={CalendarioC} />
                                                <Route path="/progreso" exact component={ProgresoC} />


                                            </Switch>



                                        </div>

                                    </Router>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pie-Pagina">
                        {this.renderMenuChatC()}
                    </div>

                </div >

        }
        else {
            apps = <div  style={{height: window.screen.height}} >
                    <div className="ui container " style={{height:'100%'}}  >
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
                                                <Route path="/equipoData" exact component={equipoDash} />
                                                <Route path="/proceso/exito" exact component={Exito} />
                                                <Route path="/formulario/validacion" exact component={ModalFormValidacion} />
                                               
                                                <Route path="/formulario" exact component={FomularioGlobal} />
                                                <Route path="/formulario/inicio" exact component={FomularioInicio} />
                                                <Route path="/formulario/herramientas" exact component={FomularioHerramientas} />
                                                <Route path="/formulario/termcond" exact component={FomularioTerm} />
                                                <Route path="/newworkflow" exact component={FLujoCreate} />



                                            </Switch>



                                        </div>
                                    </Router>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pie-Pagina">
                      <MenuChat></MenuChat>
                    </div>

                </div >
        }


        return apps;
    }
};

const mapStateToProps = (state) => {
    return {
        usuarioDetail: state.chatReducer.usuarioDetail,
        pasoOnboarding: state.chatReducer.pasoOnboarding,
        MensajeIvily: state.chatReducer.MensajeIvily,
        listaObjetivo: state.chatReducer.listaObjetivo,
        estadochat: state.chatReducer.estadochat,
        celPerf: state.chatReducer.celPerf,
        celChat: state.chatReducer.celChat,
    };
};

export default connect(mapStateToProps, { celChats })(App); 