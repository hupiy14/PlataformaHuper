import React, { Component } from 'react';
import texture1e from '../../../images/texture.jpg';
import boule from '../../../images/boule.DAE';
import eye from '../../../images/eye.png';
import './chat.scss';
import { connect } from 'react-redux';
import { chatOn, chatOff, endChatMes } from '../../../actions';
import ChatHup from '../efectText/efecto1';
import ChatHup2 from '../efectText/efecto2';
//import ChatHup3 from './HuperModules/efectText/efecto3';
import ChatHup3 from '../efectText/efecto4';
import ChatHup4 from '../efectText/efecto5';
import  '../../../lib/colladaLoader2';
import  TimerClock from '../timerClock/timerr';
                   
var THREE = require('three');
//var THREE = require('../../../lib/three');

const getRandom = (min, max) => Math.random() * (max - min + 1) + min;
const timeoutLength = 5000;
class THREEScene extends Component {
    componentDidMount() {

        this.windowWidth =  window.innerWidth / 6;
        this.windowHeight =  window.innerHeight;

        this.animation = {
            flyingHeight: 2,
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
        this.newRobot();

        this.start();
        this.handleChat();
    }
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
            this.box.center(this.models.position);
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
            pointLight.position.z = 30;
            lens.add(pointLight);

            const tl = new window.TimelineMax({ repeat: -1, yoyo: true });
            tl.from(pointLight, 1, { intensity: 5 });

            // Body
            this.body = this.models.getObjectByName("Body", true);
            this.body.children[0].material.map = this.textureLoader.loader.load(this.dataTexture[1], this.textureLoader.textureLoaded());
            this.body.children[0].material.map.minFilter = THREE.LinearFilter;
            this.body.children[3].castShadow = true;
            this.camera.lookAt(this.models.position);

            this.parameters = {
                lunchIntro: true,
                introComplete: false,
                coef: 0,
                height: this.models.position.y
            };

            // Remove loading message
            window.TweenMax.to(document.getElementById('loading'), .5, { opacity: 0 });
        });
    }
    /**
* Update robot, only when textures and 3D models are loaded.
*/
    updateRobot() {
        if (this.models !== undefined && this.textureLoader.loadedComplete === true && this.parameters !== undefined ) {
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
                if (this.loaded == this.total) {
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
     
        if ( this.parameters  !== undefined && this.parameters.introComplete  !== undefined) {
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
        this.windowWidth = window.innerWidth /6;
        this.windowHeight = window.innerHeight;
        this.renderer.setSize(this.windowWidth, this.windowHeight);
        this.camera.aspect = this.windowWidth / this.windowHeight;
        this.camera.updateProjectionMatrix();
    }



    renderScene = () => {
        this.updateRobot();
        this.renderer.render(this.scene, this.camera)
    }

componentDidUpdate()
{
    if(this.props.endChatMessage === true)
    {
        this.cambioEstado();
        this.props.endChatMes(false);
    }
 
}

    cambioEstado() {
         if (this.props.isChat) {
            this.props.chatOff();
            this.standbyAnimation(!this.props.isChat);
        }
        else {
            this.setState({efectos:  Math.round(this.randomMax(1,1))});
            this.setState({efectosAux:  Math.round(this.randomMax(0,3))});
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
            console.log(this.state.efectos);

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
    render() {
        let tiempo = null;
        if (!this.props.isChat) 
            tiempo =    <TimerClock programa={false}></TimerClock>;
        return (
            <div>
                 <div style={{ width: '400px', height: '400px', position: 'fixed', left: '80%', bottom: '40%', zIndex: '6' }} ref={(mount) => { this.mount = mount }} onClick={() => { this.cambioEstado() }}></div>
                   {this.renderAuthButton()}
                   {tiempo}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isSignedIn: state.auth.isSignedIn,
        isChat: state.chatReducer.isChat,
        endChatMessage: state.chatReducer.endChatMessage,
        usuarioDetail: state.chatReducer.usuarioDetail,
        MensajeIvily: state.chatReducer.MensajeIvily,
        estadochat: state.chatReducer.estadochat,
        tipoPregunta: state.chatReducer.tipoPregunta,
        celPerf: state.chatReducer.celPerf,

    };
};


export default connect(mapStateToProps, { chatOn, chatOff, endChatMes })(THREEScene);