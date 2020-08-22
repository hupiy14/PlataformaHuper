import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';
import dashboardCel from './celPhone/task';
import HomeCel from './celPhone/home';
import HomeChange from './celPhone/dashboardgi';
//import MenuChat from './HuperModules/chat3X/chatZ';
import MenuChat from './HuperModules/chat3X/chatZ';
import MenuChat2 from './celPhone/chatz';
import Header from './Header';
import Header2 from './celPhone/header';
import inttroApp from './introAppPc';

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
//import Feedback from '../components/feedbackHupity';
import Onboard from './PruebaP';
import Profile from './profileHuper';
import Exito from './continuarProceso';
import ModalFormValidacion from './gestorModules/formularioValidacionObj';


import FLujoCreate from './HuperModules/pointWork';
import { celChats } from '../components/modules/chatBot/actions';
import equipoDash from './gestorModules/equipoData';





///otra forma de link   <Route path="/" exact render={()=> <StreamList />}  />


class App extends React.Component {

    componentDidMount() {

        this.innerWidth = window.innerWidth;
    }

    renderMenuChat() {

        if (this.props.usuarioDetail && this.props.usuarioDetail.rol !== '2') {
            if (((this.props.MensajeIvily && this.props.MensajeIvily.nActIVi < 6) || !this.props.listaObjetivo || !this.props.listaObjetivo.objetivos || this.props.usuarioDetail) && !this.props.usuarioDetail.usuario.onboarding) {

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

        let menuC = null;



        //  let menuC = <MenuChat></MenuChat>;

     
        if (this.props.isSignedIn)
            menuC = <MenuChat></MenuChat>;
        let apps = null;
        if (window.innerWidth < 450 || (window.innerWidth < 850 && window.innerHeight < 450)) {


            menuC = <MenuChat2 />;
            apps = <div  >
                <div className="ui container " style={{ height: window.innerHeight, overflow: 'auto' }} id="AppH"  >
                    <div className="ui items ">
                        <div className="item  ">
                            <div className="content" >
                                <Router history={history}>
                                    <div>
                                        <Header2 />
                                        <Switch>
                                            <Route path="/" exact component={hupityIngreso} />
                                            <Route path="/home" exact component={HomeCel} />
                                            <Route path="/dashboardgi" exact component={HomeChange} />
                                            <Route path="/login" exact component={ingreso} />
                                            <Route path="/dashboard" component={dashboardCel} />
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

                {menuC}

            </div >
            // {menuC}
        }

        else {
            apps = <div  >
                <div className="ui container " style={{ height: window.innerHeight, overflow: 'auto' }} >
                    <div className="ui items ">
                        <div className="item  ">
                            <div className="content  ">
                                <Router history={history}>
                                    <div>
                                        <Header />
                                        <Switch>
                                            <Route path="/" exact component={hupityIngreso} />
                                            <Route path="/home" exact component={inttroApp} />
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

                {menuC}


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
        isSignedIn: state.auth.isSignedIn,
    };
};

export default connect(mapStateToProps, { celChats })(App); 