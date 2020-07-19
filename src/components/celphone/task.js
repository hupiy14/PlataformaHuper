import React from 'react';
import { connect } from 'react-redux';
import '../styles/celHupp.css';
import Actividades from './actividades';
import unsplash from '../../apis/unsplash';
import history from '../../history';
import { actividadPrincipal, homeApp } from '../../actions';
import moment from 'moment';
import Objetivos from './objetivos';
import ObjetivoPrincial from './objDetail';
import ButtonImport from './buttonImport';
import FLujoCreate from './flow';
import Profile from './profile';
import Profile2 from './profile2';
import TimerClock from '../HuperModules/timerClock/timerr';

class listActividades extends React.Component {

    state = {
        actividades: null, tiempos: 0, horamaxima: 8, primero: null, aux: null
        , index: 0, delay: .02, mensaje: null,

        tipo: null, images: null, modalOpen: false,
    }


    onSearchSubmit = async () => {

        const response = await unsplash.get('/search/photos', {
            params: { query: 'Business' },
        });
        this.setState({ images: response.data.results })
    }

    componentWillMount() {
        if (!this.props.isSignedIn) {
            history.push('/');
            return;
        }
        this.setState({ tipo: 'Task' });
        this.onSearchSubmit();
        window.$('#all').click(function () {
            window.$('ul.tasks li').slideDown(300);
        });

        window.$('#one').click(function () {
            window.$('.tasks li:not(.one)').slideUp(300, function () {
                window.$('.one').slideDown(300);

            });
        });

        window.$('#two').click(function () {
            window.$('.tasks li:not(.two)').slideUp(300, function () {
                window.$('.two').slideDown(300);

            });
        });
        window.$('#three').click(function () {
            window.$('.tasks li:not(.three)').slideUp(300, function () {
                window.$('.three').slideDown(300);

            });
        });
    }

    render() {

        if (this.state.images) {
            /*
                            <li className="two green2">
                                <span className="task-title">Design Explorations</span>
                                <span className="task-time">2pm</span>
                                <span className="task-cat">Company Web site</span>
    
                            </li>
                            <li className="tow green2 hang">
                                <span className="task-title">Team Meeting</span>
                                <span className="task-time">2pm</span>
                                <span className="task-cat">Hangouts</span>
                                <img src="https://raw.githubusercontent.com/arjunamgain/FilterMenu/master/images/2.jpg" />
                                <img src="https://raw.githubusercontent.com/arjunamgain/FilterMenu/master/images/3.jpg" />
                                <img src="https://raw.githubusercontent.com/arjunamgain/FilterMenu/master/images/profile.jpg" />
                            </li>
                            <li className="three yellow2">
                                <span className="task-title">New Projects</span>
                                <span className="task-time">2pm</span>
                                <span className="task-cat">Starting</span>
                            </li>
    
                            <li className="three yellow2">
                                <span className="task-title">Lunch with Mary</span>
                                <span className="task-time">2pm</span>
                                <span className="task-cat">Grill House</span>
                            </li>
                            <li className="three yellow2">
                                <span className="task-title">Team Meeting</span>
                                <span className="task-time">2pm</span>
                                <span className="task-cat">Hangouts</span>
                            </li>
                     


                             <li className="two green2">
                        <span className="task-title">Design Explorations</span>
                        <span className="task-time">2pm</span>
                        <span className="task-cat">Company Web site</span>

                    </li>
                    <li className="tow green2 hang">
                        <span className="task-title">Team Meeting</span>
                        <span className="task-time">2pm</span>
                        <span className="task-cat">Hangouts</span>
                        <img src="https://raw.githubusercontent.com/arjunamgain/FilterMenu/master/images/2.jpg" />
                        <img src="https://raw.githubusercontent.com/arjunamgain/FilterMenu/master/images/3.jpg" />
                        <img src="https://raw.githubusercontent.com/arjunamgain/FilterMenu/master/images/profile.jpg" />
                    </li>
            */
            let extraComponent = null;
            let principal = null;
            let styleAjuste = null;
            let tiempo = null;
            console.log(this.props.homeApps);
            if (this.props.actividadPrin) {
                principal = this.props.actividadPrin;
                styleAjuste = { position: 'relative', top: '-5em' }
                if (this.props.actividadProg === 1)
                    styleAjuste = { position: 'relative', left: '-6em' }
                else if (this.props.actividadProg === 2)
                    styleAjuste = { position: 'relative', left: '3.5em', width: '13em' }

            }
            let item = null;
            let imageFondo = `url(https://images.unsplash.com/photo-1517764415784-a0a8e4e659e8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80)`;
            let title = 'My flow';
            if (this.state.tipo === 'OKR' && !this.props.homeApps) {
                styleAjuste = { position: 'relative', left: '6em', width: '11em' }
                item = <ul className="tasks">
                    <Objetivos />
                </ul>;
                title = 'Mis Objetivos';
                imageFondo = `url(${this.props.imagenOKR})`;
                principal = <ObjetivoPrincial />
                extraComponent = <ButtonImport />;
            }
            else if (this.state.tipo === 'Profile' && !this.props.homeApps) {
                imageFondo = `url(${this.props.imagef})`;
                styleAjuste = { position: 'relative', left: '-32%' }
                title = 'Mi perfil';
                principal = <Profile2 />
                item = <Profile />
            }
            else if (this.state.tipo === 'Flow' && !this.props.homeApps) {
                imageFondo = `url(https://cdn.pixabay.com/photo/2016/08/09/21/54/yellowstone-national-park-1581879_960_720.jpg)`;
                title = 'Mi flujo';
                principal = null;
                item = <FLujoCreate />

            }
            else {
                if (this.props.homeApps)
                    this.setState({ tipo: 'Task' });
                item = <Actividades />;
                imageFondo = `url( https://images.unsplash.com/photo-1586436008950-a483ec6447ad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=650&q=80)`;
                title = 'Mis tareas';
                if (!this.props.isChat)
                    tiempo = <TimerClock programa={false}></TimerClock>;
                this.props.homeApp();
            }

            /*
                <div className="overlay" style={{ background: `url(${this.state.images ? this.state.images[0].urls.regular : null})` }}></div>
                <div className="overlay" style={{ background: `url(https://images.unsplash.com/photo-1517764415784-a0a8e4e659e8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80)` }}></div>
                  <div className="overlay" style={{ background: `url(https://images.unsplash.com/photo-1517764415784-a0a8e4e659e8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80)` }}></div>
                                           
            */
            return (

                <div className="muck-up">


                    <div className="overlay" style={{ background: imageFondo }}></div>

                    <div className="top">
                        {tiempo}
                        {principal}
                    </div>
                    <div className="clearfix"></div>
                    <div className="filter-btn" >
                        <a onClick={() => { this.props.actividadPrincipal(); window.$('.filter-btn').removeClass('open'); this.setState({ tipo: 'OKR' }); }} id="one" href="#one"><i className="ion-ios-star-outline"></i></a>
                        <a onClick={() => { this.props.actividadPrincipal(); window.$('.filter-btn').removeClass('open'); this.setState({ tipo: 'Task' }); }} id="two" href="#two"><i className="ion-ios-checkmark-outline"></i></a>
                        <a onClick={() => { this.props.actividadPrincipal(); window.$('.filter-btn').removeClass('open'); this.setState({ tipo: 'Flow' }); }} id="three" href="#three"><i className="ion-ios-bookmarks-outline"></i></a>
                        <a onClick={() => { this.props.actividadPrincipal(); window.$('.filter-btn').removeClass('open'); this.setState({ tipo: 'Profile' }); }} id="all" href="#all"><i className="ion-ios-person-outline"></i></a>
                        <span className="toggle-btn ion-android-funnel" onClick={() => { window.$('.filter-btn').toggleClass('open'); }}></span>
                    </div>
                    {extraComponent}
                    <div className="clearfix"></div>
                    <div className="bottomCel">
                        <div className="title" style={styleAjuste}>
                            <h3>{title}</h3>
                            <small>{moment().format("ddd, Do")}</small>
                        </div>

                        {item}

                    </div>


                </div>

            );
        }
        else {
            return null;
        }

    }

};

const mapAppStateToProps = (state) => (
    {
        numeroTareasTerminadas: state.chatReducer.numeroTareasTerminadas,
        isChat: state.chatReducer.isChat,
        usuarioDetail: state.chatReducer.usuarioDetail,
        imagenOKR: state.chatReducer.imagenOKR,
        homeApps: state.chatReducer.homeApps,
        actividadPrin: state.chatReducer.actividadPrin,
        actividadProg: state.chatReducer.actividadProg,
        selObjetivo: state.chatReducer.selObjetivo,
        imagef: state.chatReducer.imagef,
        userId: state.auth.userId,
        isSignedIn: state.auth.isSignedIn,

    });


export default connect(mapAppStateToProps, { actividadPrincipal, homeApp })(listActividades);