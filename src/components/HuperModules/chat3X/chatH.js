import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import './chat.scss';
import texture1e from '../../../images/texture3.jpg';
import boule from '../../../images/boule.DAE';
import eye from '../../../images/eye.png';


const getRandom = (min, max) => Math.random() * (max - min + 1) + min;
const timeoutLength = 100;
class chatH extends React.Component {
state = {
    flag: null,
};

    componentDidMount()
    {
            this.windowWidth = window.innerWidth /6;
            this.windowHeight = window.innerHeight ;
    
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
    
            // BINDINGS
            //////////////////////////////////////////
            this.onWindowResize = this.onWindowResize.bind(this);
            this.onMouseMove = this.onMouseMove.bind(this);
     
         // EVENTS
            //////////////////////////////////////////
            window.addEventListener('resize', this.onWindowResize);
            window.addEventListener('mousemove', this.onMouseMove);
           
            this.init();
            this.start();
            this.render = this.renderScene.bind(this);
    }
       


    componentWillUnmount(){
      this.stop()
      this.mount.removeChild(this.renderer.domElement)
    }
  start = () => {
      if (!this.frameId) {
        this.frameId = requestAnimationFrame(this.render);
      }
    }
  stop = () => {
      cancelAnimationFrame(this.frameId)
    }
        /**
      * Init functions.
      */
        init() {
          
       
    
            this.scene = new window.THREE.Scene();
            this.mouse = new window.THREE.Vector2(window.innerWidth, window.innerWidth);
    
            this.newRenderer();
            this.newCamera();
            this.newLight();
            this.newGround();
            this.newRobot();
           // this.newGui();
            this.renderScene();
        
        }
        /**
      * New renderer.
      */
        newRenderer() {
            this.renderer = new window.THREE.WebGLRenderer({ alpha: true, antialias: true });
            this.renderer.setSize(this.windowWidth, this.windowHeight);
            this.renderer.setClearColor(0xfafdfc);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = window.THREE.PCFSoftShadowMap;
            this.mount.appendChild(this.renderer.domElement)
        }
    
        /**
      * New camera.
      */
        newCamera() {
            const aspect = this.windowWidth / this.windowHeight;
            const fieldOfView = 45;
            const near = .1;
            const far = 1000;
            this.camera = new window.THREE.PerspectiveCamera(fieldOfView, aspect, near, far);
            this.camera.position.set(0, 1, 27);
        }
    
        /**
      * New lights.
      */
        newLight() {
            const ambientLight = new window.THREE.AmbientLight(0xe9e9e9, 1);
            ambientLight.position.set(0, 100, 0);
            this.scene.add(ambientLight);
    
            const directionalLight = new window.THREE.DirectionalLight(0xffffff, .1);
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
            const geometry = new window.THREE.PlaneGeometry(45, 45);
            const material = new window.THREE.MeshLambertMaterial({ color: 0xfafdfc });
            this.ground = new window.THREE.Mesh(geometry, material);
            this.ground.rotation.x = window.THREE.Math.degToRad(-90);
            this.ground.position.y = -7;
            this.ground.receiveShadow = true;
            this.scene.add(this.ground);
        }
    
        /**
      * Texture Loader.
      * @param  {int} number of textures
      */
        textureLoader(numberOfTextures) {
            this.textureLoader = {
                loader: new window.THREE.TextureLoader(),
                total: numberOfTextures,
                loaded: 0,
                loadedComplete: false,
                textureLoaded() {
                    this.loaded++;
                    if (this.loaded == this.total) {
                        this.loadedComplete = true;
                    }
                    console.log(`${ this.loaded }/${ this.total } texture(s) loaded`);
                }
            };
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
            const loader = new window.THREE.ColladaLoader();
            loader.load(url.object, collada => {
                // Init texture rendering
                this.dataTexture = [url.texture1, url.texture2];
                this.textureLoader(this.dataTexture.length);
    
                // Robot model
                this.models = collada.scene;
                this.models.rotation.y = window.THREE.Math.degToRad(-90); // Rotate robot in front direction
    
                // Set a pivot point
                this.mesh = new window.THREE.Object3D();
                this.box = new window.THREE.Box3().setFromObject(this.models);
                this.box.center(this.models.position);
                this.models.position.multiplyScalar(-1);
    
                this.mesh.add(this.models);
                this.scene.add(this.mesh);
    
                // Eye
                this.eye = this.models.getObjectByName("Eye", true);
    
                // Eyelid
                this.eyelidTop = this.models.getObjectByName("Eyelid-top", true);
                this.eyelidBottom = this.models.getObjectByName("Eyelid-bottom", true);
                this.eyelidTop.rotation.x = window.THREE.Math.degToRad(-88); // -65 = Open; -88 = closed; 
                this.eyelidBottom.rotation.x = window.THREE.Math.degToRad(-85); // -115= Open; -85 = closed;
    
                // Lens
                const lens = this.models.getObjectByName("Lens", true);
                lens.material.map = this.textureLoader.loader.load(this.dataTexture[0], this.textureLoader.textureLoaded());
                lens.material.map.minFilter = window.THREE.LinearFilter;
    
                const pointLight = new window.THREE.PointLight(0xffffff, 0.5, 1);
                pointLight.position.z = 30;
                lens.add(pointLight);
    
                const tl = new window.TimelineMax({ repeat: -1, yoyo: true });
                tl.from(pointLight, 1, { intensity: 5 });
    
                // Body
                this.body = this.models.getObjectByName("Body", true);
                this.body.children[0].material.map = this.textureLoader.loader.load(this.dataTexture[1], this.textureLoader.textureLoaded());
                this.body.children[0].material.map.minFilter = window.THREE.LinearFilter;
                this.body.children[3].castShadow = true;
                this.camera.lookAt(this.models.position);
    
                this.parameters = {
                    lunchIntro: true,
                    introComplete: false,
                    coef: 0,
                    height: this.models.position.y
                };
    
                // Remove loading message
                window.TweenMax.to(document.getElementById('loading'), .5, {opacity: 0});
            });
        }
    
        /**
      * animation: Introduction.
      */
        introAnimation() {
            const delayTurnOff = 1000;
            const delayTurnOn = 3000;
            window.TweenMax.set(this.mesh.position, { y: 15 });
            window.TweenMax.set(this.mesh.rotation, { y: window.THREE.Math.degToRad(720), z: window.THREE.Math.degToRad(720) });
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
                x: window.THREE.Math.degToRad(getRandom(-20, 0)),
                y: window.THREE.Math.degToRad(getRandom(-30, 30)),
                z: window.THREE.Math.degToRad(getRandom(-20, 20)),
                ease: window.Power2.easeOut
            });
        }
    
        /**
      * animation: Turn on.
      */
        turnOnAnimation() {
            window.TweenMax.to(this.mesh.position, 1.5, { y: this.animation.flyingHeight, ease: window.Power2.easeOut });
            window.TweenMax.to(this.mesh.rotation, 1, { x: 0, y: 0, z: 0, ease: window.Power2.easeOut });
            window.TweenMax.to(this.eyelidTop.rotation, .5, { x: window.THREE.Math.degToRad(-75), ease: window.Power2.easeOut }, 1.5);
            window.TweenMax.to(this.eyelidBottom.rotation, .5, { x: window.THREE.Math.degToRad(-100), ease: window.Power2.easeOut, onStart: () => {
                    this.parameters.introComplete = true;
                } }, 1.5);
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
      * animation: Mouse interaction.
      */
        mouseAnimation() {
            window.TweenMax.to(this.eye.rotation, this.animation.speed, { x: this.mouse.y / 5, y: this.mouse.x / 3, delay: this.animation.reactionTime });
            window.TweenMax.to(this.mesh.rotation, this.animation.speed, { y: this.mouse.x / 2, x: -(this.mouse.y / 5), delay: this.animation.reactionTime });
            window.TweenMax.to(this.eyelidTop.rotation, this.animation.speed, { y: this.mouse.x / 4, x: window.THREE.Math.degToRad(-75 + this.animation.eyelidsOpening) + (this.mouse.y - Math.abs(this.mouse.x)) / 10, delay: this.animation.reactionTime });
            window.TweenMax.to(this.eyelidBottom.rotation, this.animation.speed, { y: this.mouse.x / 4, x: window.THREE.Math.degToRad(-100 - this.animation.eyelidsOpening) + (this.mouse.y + Math.abs(this.mouse.x)) / 10, delay: this.animation.reactionTime });
        }
    
        /**
      * Update robot, only when textures and 3D models are loaded.
      */
        updateRobot() {
            if (this.models !== undefined && this.textureLoader.loadedComplete === true) {
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
      * Mouse update.
      */
        mouseUpdate() {
            if(this.parameters === null || this.parameters.introComplete === null)
            return;
            if (this.parameters.introComplete) {
                this.mouseAnimation();
            }
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
      * EVENT: On window resize, update parameters.
      */
        onWindowResize() {
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;
            this.renderer.setSize(this.windowWidth, this.windowHeight);
            this.camera.aspect = this.windowWidth / this.windowHeight;
            this.camera.updateProjectionMatrix();
        }
    
        /**
      * dat.GUI, display animation parameters.
      */
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
            f2.add(this.animation, 'eyelidsOpening', 0, 10).name('eyelids opening');
        }
    
        /**
      * Render.
      */
     renderScene() {
            this.updateRobot();
            this.renderer.render(this.scene, this.camera);
        }



        handlePaso = () => {
          this.timeout = setTimeout(() => {
          this.init();
            this.setState({flag: true});
          
          }, timeoutLength)
      }



    render() {
         return <div style={{ width: '400px', height: '400px', position: 'fixed', left: '80%', bottom: '40%',  zIndex: '6'}} ref={(mount) => { this.mount = mount }}></div>;
         
      }
    
}
const mapAppStateToProps = (state) => (
    {
        numeroTareasTerminadas: state.chatReducer.numeroTareasTerminadas,
        usuarioDetail: state.chatReducer.usuarioDetail,
        selObjetivo: state.chatReducer.selObjetivo,
        userId: state.auth.userId,

    });


export default connect(mapAppStateToProps, {})(chatH);