import React from 'react';
import { connect } from 'react-redux';
import './timer.css';
import { sendMessage, popupBot } from '../../../actions';
import moment from 'moment';
import { numeroTareasTs } from '../../modules/chatBot/actions';
import { dataBaseManager } from '../../../lib/utils';

let timeoutLength = 5000;
let timeoutLength3 = 5000;

class timerClock extends React.Component {

    state = {
        actividades: null, tiempos: 0, horamaxima: 8, primero: null, aux: null
        , index: 0, delay: .02, mensaje: null, actualD: false,

    }
    
    componentDatabase(tipo, path, objectIn, mensaje, mensajeError) {
        let men = dataBaseManager(tipo, path, objectIn, mensaje, mensajeError);
        if (men && men.mensaje)
            this.props.popupBot({ mensaje: men.mensaje });
        return men;
    }

    componentDidMount() {


        let stopMusicButton = window.$("#btn-stop-music");
        stopMusicButton.prop('disabled', true);
        this.sessionTime = 1500;
        this.props.sendMessage(1500);
        this.view = false;
        this.sessionWasRunning = false;
        this.isSessionStop = false;
        this.isBreakStop = true;
        this.press = null;
        this.actividad = 0;
        this.envioMensa = 0;
        this.resetSession = 1500;
        this.resetBreak = 300;
        this.timepoAnt = 0;
        //user choice of session and break time


        this.breakTime = 300;

        this.sessionOverMusic = new window.Howl({
            //edit this to the music you want to play

            onend: function () {
                stopMusicButton.prop('disabled', false);
            }
        });
        /*
            let breakOverMusic = new Howl({
                //edit this to the music you want to play
                src: ['music/bensound-anewbeginning.mp3'],
                onend: function () {
                    stopMusicButton.disabled = true;
                }
            });
            */

        this.actual();
        this.actual2();
        this.timerChangeTop();
        this.timerChange();
    }


    renderConsulta() {
        this.queryConsulta = `Usuario-Task/${this.props.userId}/${moment().format("YYYYMMDD")}`;
        const starCountRef3 = this.componentDatabase('get', this.queryConsulta);
        this.press = true;
        if (this.timepoTask === undefined)
            starCountRef3.on('value', (snapshot) => {
                if (snapshot.val() !== null && snapshot.val().estado === 'completo') {
                    this.timepoTask = snapshot.val();
                }
            });

    }


    actual2() {
        this.breakClock = window.$('.break-clock').FlipClock(this.breakTime, {
            clockFace: 'MinuteCounter',

            countdown: true,
            autoStart: false,

            callbacks: {
                interval: () => {
                    var breakTime = this.breakClock.getTime().time;

                    if (breakTime === 0) {

                        //set time again to offset the one second difference
                        this.sessionClock.setTime(this.sessionTime + 1);
                        this.sessionClock.start();
                        this.isSessionStop = false;
                        this.sessionWasRunning = true;

                        this.isBreakStop = true;

                        this.playBreakOverMusic();

                    } else if (this.sessionTime === 0 && this.isSessionStop) {

                        //set time for display
                        this.sessionClock.setTime(this.sessionTime);
                    }
                }
            }
        });

    }

    actual() {

        this.sessionClock = window.$('.session-clock').FlipClock(this.sessionTime, {
            clockFace: 'MinuteCounter',

            countdown: true,
            autoStart: false,

            callbacks: {
                interval: () => {
                    var sessionTime = this.sessionClock.getTime().time;
                    if (sessionTime === 0) {
                        //set time again to offset the one second difference
                        //  this.breakClock.setTime(this.breakTime + 1);
                        //this.breakClock.start();
                        this.isBreakStop = false;

                        this.isSessionStop = true;
                        this.sessionWasRunning = false;
                        // this.playSessionOverMusic();

                    } else if (this.breakTime === 0 && this.isBreakStop) {

                        //set time for display
                        this.breakClock.setTime(this.breakTime);
                    }
                }
            }


        });
    }
    changeSessionTime(time) {
        if ((this.sessionTime + time >= 600) && (this.sessionTime + time <= 5600)) {
            this.stopAllClocks();
            this.sessionTime += time;
            this.props.sendMessage(this.sessionTime);
            this.sessionClock.setTime(this.sessionTime);
        }

    }


    updateTime() {
        let task = this.timepoTask;
        let acum = 0;
        if (task !== undefined) {
            Object.keys(task).map((key, index) => {
                if (task[key].estado === 'activo') {

                    task[key]["duracion"] = this.props.onMessage + acum;
                    task[key]["h-inicio"] = moment().add('seconds', acum).format('h:mm:ss a');
                    task[key]["h-fin"] = moment().add('seconds', this.props.onMessage + acum).format('h:mm:ss a');
                    acum = this.props.onMessage + acum;

                }
                return task[key];
            });
            if (this.timepoAnt !== acum) {

                this.componentDatabase('update', this.queryConsulta, { ...this.task });
                this.timepoAnt = acum;
            }
        }

    }

    timerChangeTop = () => {
        this.timeout = setTimeout(() => {
            let timeU = this.sessionClock.getTime().time;
            if (timeU <= 0) {

                let men = this.actividad === 0 ? '' : this.actividad;
                if (this.envioMensa < 3) {
                    this.props.popupBot({ mensaje: 'hemos terminado nuestra ' + men + ' actividad', sleep: 35000 });
                    this.envioMensa = this.envioMensa + 1;
                    this.sessionClock.setTime(0);
                }
                else if (this.envioMensa === 3) {
                    this.renderTiempoTrabajo()
                }
                else {
                    this.envioMensa = 0;
                }
                this.timepoTask = undefined;
                this.sessionClock.setTime(0);
                this.timerChange();
            }
            else {

                if (timeU < 30) {
                    this.sessionClock.setTime(0);
                    timeoutLength3 = 10000;
                }

                else
                    timeoutLength3 = (timeU * 1000) / 2;
            }
            this.timerChangeTop();
        }, timeoutLength3)
    }

    timerChange = () => {

        this.timeout = setTimeout(() => {
            if (this.timepoTask === undefined) {
                if (this.press === null) {
                    this.renderConsulta();
                    this.view = true;
                }
            }
            if (this.renderTiempoTrabajo() === false) {
                this.timerChange();
                this.updateTime();
            }
        }, timeoutLength)

    }

    /* End Edit Time Section */

    startButton() {
        if (this.sessionWasRunning && this.isSessionStop) {
            this.sessionClock.start();
            this.sessionOverMusic.play();
            //startButton.text("Stop");

            this.isSessionStop = false;
        } else if (!this.sessionWasRunning && this.isBreakStop) {
            this.breakClock.start();
            //startButton.text("Stop");

            this.isBreakStop = false;
        } else if (!this.isSessionStop) {
            this.sessionClock.stop();
            this.sessionOverMusic.stop();
            //startButton.text("Start");

            this.isSessionStop = true;
            this.sessionWasRunning = true;
        } else if (!this.isBreakStop) {
            this.breakClock.stop();
            //  startButton.text("Start");

            this.isBreakStop = true;
            this.sessionWasRunning = false;
        } else {

        }

    }

    /*
         resetButton.click(function () {
             //stop the countdown when reset is clicked
     
             stopAllClocks();
     
             sessionTime = resetSession;
             breakTime = resetBreak;
     
             sessionClock.setTime(sessionTime);
             breakClock.setTime(breakTime);
         });
     */

    stopMusicButton() {
        this.sessionOverMusic.stop();
        this.breakOverMusic.stop();

    };



    playBreakOverMusic() {
        // this.stopMusicButton.prop('disabled',false);

        if (this.isBreakStop) {
            this.sessionOverMusic.stop();
            // breakOverMusic.play();
        }
    }
    playSessionOverMusic() {
        // this.stopMusicButton.prop('disabled',false);

        if (this.isSessionStop) {
            //  breakOverMusic.stop();
            this.sessionOverMusic.play();
        }
    }
    stopAllClocks() {
        this.sessionClock.stop();
        this.isSessionStop = true;

        this.breakClock.stop();
        this.isBreakStop = true;

        //startButton.text("Start");
    }





    renderTiempoTrabajo() {
        let task = this.timepoTask;
        if (task !== undefined) {
            this.sessionTime = 0;
            Object.keys(task).map((key, index) => {
                if (task[key].estado === 'activo') {

                    let tiempo = moment(task[key]['h-inicio'], 'h:mm:ss a').format('x');
                    let tiempof = moment(task[key]['h-fin'], 'h:mm:ss a').format('x');
                    let imTime = moment().format('x');
                    if (imTime > tiempo && imTime <= tiempof) {
                        this.sessionTime = (tiempof - imTime) / 1000;
                        this.actividad = (index - 1) + 1;
                    }
                    else if (imTime > tiempof) {
                        this.timepoTask[key].estado = 'finalizado';
                        this.props.numeroTareasTs(this.props.numeroTareasTerminadas + 1);
                    }

                }
                return task[key];
            });
            this.componentDatabase('update', this.queryConsulta, {  ...this.timepoTask });
            this.sessionClock.setTime(this.sessionTime);
            this.sessionClock.start();
            return true;

        }
        else
            return false;


    }


    render() {
        let planCurrent = null;
        let titulo = null;
        //  let style ={  top: '-30%', left: '-20%', position: 'fixed' };
        let style = { top: '82%', position: 'fixed', transform: 'scale(0.3)', left: '76%' };



        if (this.props.programa) {

            style = { top: '4.5em', transform: 'scale(0.78)' };
            planCurrent = <div style={{ top: '-3em', position: 'relative', left: '-4.25em' }}>
                <button type="button" onClick={() => { this.changeSessionTime(-600); }} className="btn btn-lg btn-edit" id="btn-reduce-session-minute">-</button>
                <button type="button" onClick={() => { this.changeSessionTime(600); }} style={{ position: 'relative', left: '6.5em' }} className="btn btn-lg btn-edit" id="btn-increase-session-minute">+</button>
            </div>
            titulo = "¿Cuanto tiempo esperas demorarte?";

        }

        let planCC = <div className="col-md-5">
            <h1 className="clock-title">{titulo}</h1>
            <div className="clock session-clock"></div>
            {planCurrent}
        </div>
        if (this.props.programa === 'PWA') {
            planCC = <div className='clock-PWA'>
                <h1 className="clock-title">{titulo}</h1>
                <div className="clock session-clock"></div>
                {planCurrent}
            </div>
        }
        else if (window.innerWidth < 600 || (window.innerHeight < 600)) {
            style = { top: '6%', position: 'absolute', transform: 'scale(0.25)', left: '25%', width: '25em', zIndex: '20', filter: 'opacity(0.7)' };

            planCC = <div >
                <h1 className="clock-title">{titulo}</h1>
                <div className="clock session-clock"></div>
                {planCurrent}
            </div>

        }

        // top: '-30%', left: '-20%', position: 'fixed'
        /*let btPrueba = <div>
            <button type="button" style={style} onClick={() => { this.startButton() }} className="btn btn-lg btn-edit" id="btn-reduce-session-minute">-</button>
        </div>
*/
        return (
            <div style={style}>
                {planCC}
            </div>

        );
    }
};

const mapAppStateToProps = (state) => (
    {
        numeroTareasTerminadas: state.chatReducer.numeroTareasTerminadas,
        usuarioDetail: state.chatReducer.usuarioDetail,
        selObjetivo: state.chatReducer.selObjetivo,
        isChat: state.chatReducer.isChat,
        userId: state.auth.userId,

    });


export default connect(mapAppStateToProps, { sendMessage, popupBot, numeroTareasTs })(timerClock);