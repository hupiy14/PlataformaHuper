import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';



import MenuChat from './MenuChat';
import Header from './Header';

import hupityIngreso from './hupityIngreso';
import ingreso from './modules/ingreso';
import dashboard from './DashBoard';
import Hupps from './modules/Hupps';

import ChatHuper from './modules/chatBot/connecteApp';
import connectedHome from './modules/chatBot/homePage';
import connectedProfile from './modules/chatBot/profilePage';
import connectedContacts from './modules/chatBot/contactsPage';
import chatHuper from './modules/chatBot/paginaInicio';

import './modules/chatBot/chatHupApp.css';




///otra forma de link   <Route path="/" exact render={()=> <StreamList />}  />


class App extends React.Component {


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

                        
                                        </Switch>



                                    </div>
                                </Router>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="pie-Pagina">
                    <MenuChat />
                </div>

            </div>









        );
    }
};

export default App; 