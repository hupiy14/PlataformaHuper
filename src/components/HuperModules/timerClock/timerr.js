import React from 'react';
import { connect } from 'react-redux';
import './timer.css';
import music from '../../../images/bensound-goinghigher.mp3';
import { sendMessage } from '../../../actions';



class timerClock extends React.Component {

    state = {
        actividades: null, tiempos: 0, horamaxima: 8, primero: null, aux: null
        , index: 0, delay: .02, mensaje: null,






    }

    componentDidMount() {


        let stopMusicButton = window.$("#btn-stop-music");
        stopMusicButton.prop('disabled', true);
        this.sessionTime = 1500;
        this.props.sendMessage(this.sessionTime);
        this.sessionWasRunning = true;
        
        this.isSessionStop = true;
        this.isBreakStop = true;

        this.resetSession = 1500;
        this.resetBreak = 300;

        //user choice of session and break time


        this.breakTime = 300;

        this.sessionOverMusic = new window.Howl({
            //edit this to the music you want to play
            src: [music],
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

        this.sessionClock = window.$('.session-clock').FlipClock(this.sessionTime, {
            clockFace: 'MinuteCounter',

            countdown: true,
            autoStart: false,

            callbacks: {
                interval: () => {
                    var sessionTime = this.sessionClock.getTime().time;
                    if (sessionTime == 0) {
                        //set time again to offset the one second difference
                        this.breakClock.setTime(this.breakTime + 1);
                        this.breakClock.start();
                        this.isBreakStop = false;

                        this.isSessionStop = true;
                        this.sessionWasRunning = false;

                        this.playSessionOverMusic();

                    } else if (this.breakTime == 0 && this.isBreakStop) {

                        //set time for display
                        this.breakClock.setTime(this.breakTime);
                    }
                }
            }


        });


        this.breakClock = window.$('.break-clock').FlipClock(this.breakTime, {
            clockFace: 'MinuteCounter',

            countdown: true,
            autoStart: false,

            callbacks: {
                interval: () => {
                    var breakTime = this.breakClock.getTime().time;

                    if (breakTime == 0) {

                        //set time again to offset the one second difference
                        this.sessionClock.setTime(this.sessionTime + 1);
                        this.sessionClock.start();
                        this.isSessionStop = false;
                        this.sessionWasRunning = true;

                        this.isBreakStop = true;

                        this.playBreakOverMusic();

                    } else if (this.sessionTime == 0 && this.isSessionStop) {

                        //set time for display
                        this.sessionClock.setTime(this.sessionTime);
                    }
                }
            }
        });


    }









    changeSessionTime(time) {
        if ((this.sessionTime + time >= 0) && (this.sessionTime + time <= 5400)) {
            this.stopAllClocks();
            this.sessionTime += time;
            this.props.sendMessage(this.sessionTime);
            this.sessionClock.setTime(this.sessionTime);
        }
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







    render() {

        let planCurrent = null;
        let titulo = null;
      //  let style ={  top: '-30%', left: '-20%', position: 'fixed' };
      let style ={  top: '82%', position: 'fixed', transform: 'scale(0.3)', left:  0.62 * window.innerWidth };
        
      if (this.props.programa) {
            style ={ top: '100px', transform: 'scale(0.78)' };
            planCurrent = <div style={{ top: '-64px', position: 'relative', left: '-100px' }}>
                <button type="button" onClick={() => { this.changeSessionTime(-900); }} className="btn btn-lg btn-edit" id="btn-reduce-session-minute">-</button>
                <button type="button" onClick={() => { this.changeSessionTime(900); }} style={{ position: 'relative', left: '210px' }} className="btn btn-lg btn-edit" id="btn-increase-session-minute">+</button>
            </div>
            titulo = "¿Cuanto tiempo esperas demorarte?";
        }   
     
        /*
         top: '-30%', left: '-20%', position: 'fixed'
      let btPrueba =  <div>
            <button type="button" onClick={() => { this.startButton() }} className="btn btn-lg btn-edit" id="btn-reduce-session-minute">-</button>
        </div>
        */
        return (
            <div className="ui container" style={style}>
                <div className="col-md-5">
                    <h1 className="clock-title">{titulo}</h1>
                    <div className="clock session-clock"></div>
                    {planCurrent}

                </div>
            </div>

        );
    }
};

const mapAppStateToProps = (state) => (
    {
        numeroTareasTerminadas: state.chatReducer.numeroTareasTerminadas,
        usuarioDetail: state.chatReducer.usuarioDetail,
        selObjetivo: state.chatReducer.selObjetivo,
        userId: state.auth.userId,

    });


export default connect(mapAppStateToProps, {sendMessage})(timerClock);