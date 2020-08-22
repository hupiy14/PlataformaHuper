import React from 'react';
import texture1e from '../../images/texture.jpg';
import boule from '../../images/boule.DAE';
import eye from '../../images/eye.png';
import '../HuperModules/chat3X/chat.scss';
import { connect } from 'react-redux';
import { chatOn, chatOff, endChatMes, popupBot, mensajeChat } from '../../actions';
import ChatHup from './efecto1';
import ChatHup2 from '../HuperModules/efectText/efecto2';
//import ChatHup3 from './HuperModules/efectText/efecto3';
import ChatHup3 from '../HuperModules/efectText/efecto4';
import ChatHup4 from '../HuperModules/efectText/efecto5';
import '../../lib/colladaLoader2';
import { responseEmHeight } from '../../lib/responseUtils';
import { Popup, Icon, Modal, Button } from 'semantic-ui-react';
import moment from 'moment';
import '../HuperModules/timerClock/./timer.css';
import { dataBaseManager } from '../../lib/utils';
var THREE = require('three');

const getRandom = (min, max) => Math.random() * (max - min + 1) + min;
const timeoutLength = 5000;
let timeoutLength2 = 8000;
class THREEScene extends React.Component {
    state = { push: false, open: null }


    renderMusic(music) {
        let stopMusicButton = window.$("#btn-stop-music");
        stopMusicButton.prop('disabled', true);
        if (!music)
            music = 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-8.mp3';
        this.sessionOverMusic = new window.Howl({
            //edit this to the music you want to play
            src: [music],
            onend: function () {
                stopMusicButton.prop('disabled', false);
            }
        });
    }

    componentDatabase(tipo, path, objectIn, mensaje, mensajeError) {
        let men = dataBaseManager(tipo, path, objectIn, mensaje, mensajeError);
        console.log(men);
        if (men && men.mensaje)
            this.props.popupBot({ mensaje: men.mensaje });
        return men;
    }

    componentDidMount() {


        this.soundRep = 0;
        this.isSessionStop = false;


        this.windowWidth = window.innerWidth / 6;
        this.windowHeight = window.innerHeight / 3;
        this.Registro = [];
        this.sleepBot = 0;

        this.animation = {
            flyingHeight: 2,
            flyingW: 0,
            flyingFreq: 0.015,
            eyeAmplitude: 2,
            eyelidAmplitude: 1,
            modelsAmplitude: .3,
            reactionTime: .100,
            speed: .5,
            eyelidsOpening: 0,
            flying: true
        };
        this.mouse = new THREE.Vector2(window.innerWidth, window.innerWidth);


        // BINDINGS
        //////////////////////////////////////////
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        // EVENTS
        //////////////////////////////////////////
        window.addEventListener('resize', this.onWindowResize);
        window.addEventListener('mousemove', this.onMouseMove);




        //ADD SCENE
        this.scene = new THREE.Scene()
        //ADD CAMERA
        this.newCamera();
        //ADD RENDERER
        this.newRenderer();
        //ADD LIGHT
        this.newLight();
        //ADD GROUND
        this.newGround();
        //ADD CUBE
        //const geometry = new window.THREE.BoxGeometry(1, 1, 1)
        // const material = new window.THREE.MeshBasicMaterial({ color: '#433F81'     })
        // this.cube = new window.THREE.Mesh(geometry, material)
        //this.scene.add(this.cube)
        //this.newGui();

        this.newRobot();

        this.start();
        this.handleChat();

    }

    stopMusicButton() {
        //this.sessionOverMusic.stop();
        // this.breakOverMusic.stop();

    };
    componentWillUnmount() {
        this.stop()
        //  this.mount.removeChild(this.renderer.domElement)
    }
    // habilita el tercer paso  
    handleChat = () => {
        this.timeout = setTimeout(() => {
            this.standbyAnimation(false);
        }, timeoutLength)
    }

    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }
    stop = () => {
        cancelAnimationFrame(this.frameId)
    }

    animate = () => {
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }
    /**
   * New lights.
   */
    newLight() {
        const ambientLight = new THREE.AmbientLight(0xe9e9e9, 1);
        ambientLight.position.set(0, 100, 0);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, .1);
        directionalLight.position.set(0, 100, 20);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    /**
  * New ground.
  */
    newGround() {
        const geometry = new THREE.PlaneGeometry(45, 45);
        // const material = new window.THREE.MeshLambertMaterial({ color: 0xfafdfc });
        const material = new THREE.MeshLambertMaterial({ color: 0xfafdfc, opacity: 0.0, transparent: true });

        this.ground = new THREE.Mesh(geometry, material);
        this.ground.rotation.x = THREE.Math.degToRad(-90);
        this.ground.position.y = -7;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
    }
    /**
     * New robot.
     */
    newRobot() {
        const url = {
            //  object: 'https://cdn.rawgit.com/Verlangieri/robot-animation/master/app/obj/boule.DAE',
            //texture1: 'https://cdn.rawgit.com/Verlangieri/robot-animation/master/app/obj/face.jpg',
            // texture2: 'https://cdn.rawgit.com/Verlangieri/robot-animation/master/app/obj/texture.jpg'
            object: boule,
            texture1: eye,
            texture2: texture1e,

        }
        const loader = new THREE.ColladaLoader();
        loader.load(url.object, collada => {
            // Init texture rendering
            this.dataTexture = [url.texture1, url.texture2];
            this.textureLoader(this.dataTexture.length);

            // Robot model
            this.models = collada.scene;
            this.models.rotation.y = THREE.Math.degToRad(-90); // Rotate robot in front direction

            // Set a pivot point
            this.mesh = new THREE.Object3D();
            this.box = new THREE.Box3().setFromObject(this.models);
            this.box.getCenter(this.models.position);
            this.models.position.multiplyScalar(-1);

            this.mesh.add(this.models);

            this.scene.add(this.mesh);

            // Eye
            this.eye = this.models.getObjectByName("Eye", true);

            // Eyelid
            this.eyelidTop = this.models.getObjectByName("Eyelid-top", true);
            this.eyelidBottom = this.models.getObjectByName("Eyelid-bottom", true);
            this.eyelidTop.rotation.x = THREE.Math.degToRad(-88); // -65 = Open; -88 = closed; 
            this.eyelidBottom.rotation.x = THREE.Math.degToRad(-85); // -115= Open; -85 = closed;

            // Lens
            const lens = this.models.getObjectByName("Lens", true);
            lens.material.map = this.textureLoader.loader.load(this.dataTexture[0], this.textureLoader.textureLoaded());
            lens.material.map.minFilter = THREE.LinearFilter;

            const pointLight = new THREE.PointLight(0xffffff, 0.5, 1);
            pointLight.position.z = 5;
            lens.add(pointLight);

            const tl = new window.TimelineMax({ repeat: -1, yoyo: true });
            tl.from(pointLight, 1, { intensity: 5 });

            // Body
            this.body = this.models.getObjectByName("Body", true);
            this.body.children[0].material.map = this.textureLoader.loader.load(this.dataTexture[1], this.textureLoader.textureLoaded());
            this.body.children[0].material.map.minFilter = THREE.LinearFilter;
            this.body.children[3].castShadow = true;
            this.camera.lookAt(this.models.position);
            //  alert(this.models.position);

            this.parameters = {
                lunchIntro: true,
                introComplete: false,
                coef: 0,
                height: this.models.position.y
            };
            window.TweenMax.set(this.mesh.position, { z: 11 });
            // Remove loading message
            if (document.getElementById('loading'))
                window.TweenMax.to(document.getElementById('loading'), 0.5, { opacity: 0 });
        });
    }
    /**
* Update robot, only when textures and 3D models are loaded.
*/
    updateRobot() {
        if (this.models !== undefined && this.textureLoader.loadedComplete === true && this.parameters !== undefined) {
            // Introduction
            if (this.parameters.lunchIntro) {
                this.introAnimation();
                this.parameters.lunchIntro = false;
            }
            // Flying
            if (this.parameters.introComplete && this.animation.flying) {
                this.flyingAnimation();
            }
        }
    }
    /**
* animation: Introduction.
*/
    introAnimation() {
        const delayTurnOff = 1000;
        const delayTurnOn = 3000;
        window.TweenMax.set(this.mesh.position, { y: 15 });
        window.TweenMax.set(this.mesh.rotation, { y: THREE.Math.degToRad(720), z: THREE.Math.degToRad(720) });
        setTimeout(() => {
            this.turnOffAnimation();
        }, delayTurnOff);
        setTimeout(() => {
            this.turnOnAnimation();
        }, delayTurnOn);
    }

    /**
  * animation: Turn off.
  */
    turnOffAnimation() {
        window.TweenMax.to(this.mesh.position, 1.5, { y: this.ground.position.y + this.box.max.y / 2, ease: window.Bounce.easeOut });
        window.TweenMax.to(this.mesh.rotation, 2, {
            x: THREE.Math.degToRad(getRandom(-20, 0)),
            y: THREE.Math.degToRad(getRandom(-30, 30)),
            z: THREE.Math.degToRad(getRandom(-20, 20)),
            ease: window.Power2.easeOut
        });
    }

    /**
  * animation: Turn on.
  */
    turnOnAnimation() {
        window.TweenMax.to(this.mesh.position, 1.5, { y: this.animation.flyingHeight, ease: window.Power2.easeOut });
        window.TweenMax.to(this.mesh.rotation, 1, { x: 0, y: 0, z: 0, ease: window.Power2.easeOut });
        window.TweenMax.to(this.eyelidTop.rotation, .5, { x: THREE.Math.degToRad(-75), ease: window.Power2.easeOut }, 1.5);
        window.TweenMax.to(this.eyelidBottom.rotation, .5, {
            x: THREE.Math.degToRad(-100), ease: window.Power2.easeOut, onStart: () => {
                this.parameters.introComplete = true;
            }
        }, 1.5);
    }

    /**
  * animation: Flying effect.
  */
    flyingAnimation() {
        this.parameters.coef += this.animation.flyingFreq;
        const c = Math.sin(Math.PI * this.parameters.coef);
        this.eye.position.y = this.animation.eyeAmplitude * c;
        this.models.position.y = c * this.animation.modelsAmplitude + this.parameters.height;
        this.eyelidTop.position.y = this.eyelidBottom.position.y = this.animation.eyelidAmplitude * c;

    }

    /**
  * animation: Standby.
  */
    standbyAnimation(state) {
        if (!state) {
            this.turnOffAnimation();
            window.TweenMax.to(this.models.position, .5, { y: this.parameters.height }); // prevent ground collision
        } else if (state) {
            this.turnOnAnimation();
        }
    }
    /**
   * Texture Loader.
   * @param  {int} number of textures
   */
    textureLoader(numberOfTextures) {
        this.textureLoader = {
            loader: new THREE.TextureLoader(),
            total: numberOfTextures,
            loaded: 0,
            loadedComplete: false,
            textureLoaded() {
                this.loaded++;
                if (this.loaded === this.total) {
                    this.loadedComplete = true;
                }
                //    console.log(`${this.loaded}/${this.total} texture(s) loaded`);
            }
        };
    }
    /**
      * New camera.
      */
    newCamera() {
        const aspect = this.windowWidth / this.windowHeight;
        const fieldOfView = 45;
        const near = .1;
        const far = 1000;
        this.camera = new THREE.PerspectiveCamera(fieldOfView, aspect, near, far);
        this.camera.position.set(0, 1, 27);
    }
    /**
* New renderer.
*/
    newRenderer() {
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.windowWidth, this.windowHeight);
        //this.renderer.setClearColor(0xfafdfc);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.mount.appendChild(this.renderer.domElement)
    }

    /**
     * EVENT: On mouse move, set the mouse position and update mouseUpdate.
     */
    onMouseMove(event) {
        this.mouse.x = event.clientX / window.innerWidth * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.mouseUpdate();
    }

    /**
      * Mouse update.
      */
    mouseUpdate() {

        if (this.parameters !== undefined && this.parameters.introComplete !== undefined) {
            this.mouseAnimation();
        }
    }
    /**
       * animation: Mouse interaction.
       */
    mouseAnimation() {
        window.TweenMax.to(this.eye.rotation, this.animation.speed, { x: this.mouse.y / 5, y: this.mouse.x / 3, delay: this.animation.reactionTime });
        window.TweenMax.to(this.mesh.rotation, this.animation.speed, { y: this.mouse.x / 2, x: -(this.mouse.y / 5), delay: this.animation.reactionTime });
        window.TweenMax.to(this.eyelidTop.rotation, this.animation.speed, { y: this.mouse.x / 4, x: THREE.Math.degToRad(-75 + this.animation.eyelidsOpening) + (this.mouse.y - Math.abs(this.mouse.x)) / 10, delay: this.animation.reactionTime });
        window.TweenMax.to(this.eyelidBottom.rotation, this.animation.speed, { y: this.mouse.x / 4, x: THREE.Math.degToRad(-100 - this.animation.eyelidsOpening) + (this.mouse.y + Math.abs(this.mouse.x)) / 10, delay: this.animation.reactionTime });
    }

    /**
       * EVENT: On window resize, update parameters.
       */
    onWindowResize() {
        this.windowWidth = window.innerWidth / 6;
        this.windowHeight = window.innerHeight / 3;
        this.renderer.setSize(this.windowWidth, this.windowHeight);
        this.camera.aspect = this.windowWidth / this.windowHeight;
        this.camera.updateProjectionMatrix();
    }

    renderScene = () => {
        this.updateRobot();
        this.renderer.render(this.scene, this.camera)
    }


    cambioEstado() {
        if (this.props.isChat) {
            this.props.chatOff();
            this.standbyAnimation(!this.props.isChat);
        }
        else {
            this.setState({ efectos: Math.round(this.randomMax(1, 1)) });
            this.setState({ efectosAux: Math.round(this.randomMax(0, 3)) });
            this.props.popupBot(null)
            this.setState({ push: false });
            this.props.chatOn();
            this.standbyAnimation(!this.props.isChat);

        }

    }

    randomMax(min, max) {
        return Math.round((Math.random() * (max - min)) + min);
    }



    renderAuthButton() {
        if (this.props.isChat) {

            let chat = null;

            switch (this.state.efectos) {
                case 1:
                    chat = <ChatHup tipo={this.state.efectosAux} mensajeBot={'hola buenos dias'} />
                    break;
                case 2:
                    chat = <ChatHup2 />
                    break;
                case 3:
                    chat = <ChatHup3 />
                    break;
                case 4:
                    chat = <ChatHup4 />
                    break;

                default:
                    break;
            }

            return (
                chat
            );
        }
    }

    //

    componentDidUpdate() {
        if (this.props.popupMensaje !== null && this.state.push === false) {
            this.setState({ push: true });
            this.pushnotificationBotClose();

        }
        if (this.props.endChatMessage === true) {
            this.cambioEstado();
            this.props.endChatMes(false);
        }
    }


    renderAnimo = () => {
        this.timeout = setTimeout(() => {


            this.animation.flyingFreq = 0.035;
            this.animation.modelsAmplitude = 0.3;
            this.animation.eyelidsOpening = this.animation.eyelidsOpening * - 1;
            window.TweenMax.to(this.mesh.rotation, 1.5, {
                x: THREE.Math.degToRad(getRandom(-30, 20)),
                y: THREE.Math.degToRad(getRandom(-50, 50)),
                z: THREE.Math.degToRad(getRandom(-40, 20)),
                ease: window.Power2.easeOut
            });

            window.TweenMax.to(this.mesh.translateOnAxis, 1, {
                y: THREE.Math.degToRad(getRandom(-10, 80))
            });
            this.soundRep++;
            if (this.soundRep === 5) {
                this.sessionOverMusic.play();
                this.animation.eyelidsOpening = 6;
            }
            if (this.soundRep * 3000 <= this.sleepBot)
                this.renderAnimo();
            else {
                this.sessionOverMusic.stop();
                this.soundRep = 0;
                this.animation.flyingFreq = 0.015;
                this.animation.modelsAmplitude = 0.8;
                this.animation.eyelidsOpening = 0;
                this.sleepBot = 0;
                timeoutLength2 = 3000;
                this.props.popupBot({ mensaje: "Continuamos..." });
            }
            this.mouseAnimation();


        }, 2000);
    }

    renderDescansaFiveminuts = () => {
        this.timeout = setTimeout(() => {
            this.soundRep++;

            if (this.animation.eyelidsOpening >= -10 && this.soundRep * 1000 <= this.sleepBot) {
                this.animation.eyelidsOpening = this.animation.eyelidsOpening - 0.35;
                this.mouseAnimation();
                this.renderDescansaFiveminuts();
            }
            else {
                this.soundRep = 0;
                this.sleepBot = 0;
                this.animation.eyelidsOpening = 0;
                this.props.popupBot({ mensaje: "Continuamos..." });
            }

        }, 1000);
    }
    pushnotificationBotClose = () => {
        this.timeout = setTimeout(() => {
            timeoutLength2 = 8000;
            this.props.popupBot(null)
            this.setState({ push: false });

        }, timeoutLength2)
    }
    /*
        newGui() {
            const gui = new window.dat.GUI({ width: 270 });
    
            const f1 = gui.addFolder('Flying animation');
            f1.add(this.animation, 'flyingFreq', .01, .05).name('frequency');
            f1.add(this.animation, 'modelsAmplitude', 0, 1).name('robot amplitude');
            f1.add(this.animation, 'eyelidAmplitude', 0, 5).name('eyelid amplitude');
            f1.add(this.animation, 'eyeAmplitude', 0, 5).name('eye amplitude');
            f1.add(this.animation, 'flying').onChange(e => {
                this.standbyAnimation(e);
            });
    
            const f2 = gui.addFolder('Mouse interaction');
            f2.add(this.animation, 'reactionTime', 0, .5).name('reaction time');
            f2.add(this.animation, 'speed', .1, 1).name('slowness');
            f2.add(this.animation, 'eyelidsOpening', -10, 10).name('eyelids opening');
        }*/

    renderformaciones(video, music) {

        let src = `https://www.youtube.com/embed/${video}`;
        let styleMusic = null;
        let iiframe = <iframe style={{ display: 'grid', height: '32em', width: '100%' }} title="video player" src={src} />;
        if (music) {
            styleMusic = { height: '6em', top: '25em', position: 'relative' };
            iiframe = <iframe scrolling="no" frameborder="0" allowTransparency="true" src={`https://www.deezer.com/plugins/player?format=classic&autoplay=false&playlist=true&width=700&height=350&color=007FEB&layout=dark&size=medium&type=tracks&id=${music}&app_id=422762`} width="6em" height="1.2em"></iframe>;


        }
        return (
            <div className="ui grid " style={{ width: '100%' }}>
                <div className="sixteen wide column Black videoFormacion ">
                    <div className="ui embed " style={styleMusic}  >
                        {iiframe}
                    </div>
                </div>
            </div >
        );
    }

    renderControlVideo() {
        if (this.props.popupMensaje && this.props.popupMensaje.video) {
            return <Modal trigger={<div>
            </div>
            }
                basic
                size='small'
                open={this.state.open}
            >
                <Modal.Content image style={{ height: '600px', width: '100%', position: 'relative', top: '-1em' }}>
                    {this.renderformaciones(this.props.popupMensaje.link, this.props.popupMensaje.music)}
                </Modal.Content>
                <Modal.Actions>
                    <Button style={{ top: "-10em" }} onClick={() => {
                        this.renderGuardar();
                        this.setState({ open: false }); this.props.popupBot(null); this.setState({ push: false });
                    }} negative>
                        Salir
             </Button>
                </Modal.Actions>
            </Modal>
        }
        else
            return;
    }
    renderGuardar() {
        this.Registro["tiempoVisto"] = moment().format('x') - this.Registro["ver"];
        let query = `Usuario-Forma/${this.props.userId}/${moment().format("YYYYMM")}/${moment().format("DD")}/`;
        this.Registro["lection"] = this.props.popupMensaje.lection;
        let newPostKey2 = this.componentDatabase('key', query);
        this.componentDatabase('update', query + newPostKey2, { ...this.Registro });
        this.Registro = [];

    }
    renderControlNotification() {
        let styleBot = { top: '83%', color: '#ffffff', position: 'fixed', transform: 'scale(1)', left: 0.88 * window.innerWidth };
        let link = this.props.popupMensaje && this.props.popupMensaje.link ? this.props.popupMensaje.link : null;
        let color = 'green';
        if (this.props.popupMensaje && this.props.popupMensaje.Priority) { timeoutLength2 = 30000; color = 'pink'; }
        let numero = this.props.popupMensaje && this.props.popupMensaje.numero ? <div className={`ui ${color} floating label`} style={{ height: '30%' }}>{this.props.popupMensaje.numero}</div> : null;
        let video = null;
        if (this.props.popupMensaje && this.props.popupMensaje.video) {
            video = 'video';
            timeoutLength2 = this.props.popupMensaje.sleep ? this.props.popupMensaje.sleep : 300000;
        }
        if (this.props.popupMensaje && this.props.popupMensaje.chat) {
            this.props.mensajeChat({ mensaje: this.props.popupMensaje.chat, agent: this.props.popupMensaje.agent });
            timeoutLength2 = this.props.popupMensaje.sleep ? this.props.popupMensaje.sleep : 90000;
        }
        if (this.props.popupMensaje && this.props.popupMensaje.dormir) {
            this.sleepBot = this.props.popupMensaje.sleep;
            this.renderDescansaFiveminuts();
        }
        if (this.props.popupMensaje && this.props.popupMensaje.activate) {
            this.sleepBot = this.props.popupMensaje.sleep;
            this.renderMusic(this.props.popupMensaje.previous)
            this.renderAnimo();
        }

        return (<Popup
            trigger={<Icon style={styleBot} name='superpowers' />}
            position='top right'
            size='large'
            open={this.state.push}
            inverted
        >
            <h3>
                <a href={link} onClick={(e) => { e.preventDefault(); if (video !== null) { this.Registro["ver"] = moment().format('x'); this.setState({ open: true }); } if (link !== null && video === null) window.open(link, '', 'width=600,height=400,left=200,top=200'); }} >{this.props.popupMensaje ? this.props.popupMensaje.header : null}</a>
            </h3>
            {numero}
            {this.props.popupMensaje ? this.props.popupMensaje.mensaje : null}

        </Popup>);
    }




    render() {

        return (
            <div>
                {this.renderControlNotification()}
                <div style={{ width: '2em', height: '8em', position: 'fixed', left: '80%', bottom: '20%', zIndex: '6' }} ref={(mount) => { this.mount = mount }} onClick={() => { this.cambioEstado() }}></div>
                {this.renderAuthButton()}
                {this.renderControlVideo()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isSignedIn: state.auth.isSignedIn,
        isChat: state.chatReducer.isChat,
        endChatMessage: state.chatReducer.endChatMessage,
        popupMensaje: state.chatReducer.popupMensaje,
        userId: state.auth.userId,
        usuarioDetail: state.chatReducer.usuarioDetail,
        MensajeIvily: state.chatReducer.MensajeIvily,
        estadochat: state.chatReducer.estadochat,
        tipoPregunta: state.chatReducer.tipoPregunta,
        celPerf: state.chatReducer.celPerf,

    };
};


export default connect(mapStateToProps, { chatOn, chatOff, endChatMes, popupBot, mensajeChat })(THREEScene);