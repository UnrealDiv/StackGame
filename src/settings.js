import * as THREE from 'three';
import * as dat from 'dat.gui';


const aspect = {
    width:window.innerWidth,
    height:window.innerHeight
}
//Scene
const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(-20,20,20,-20,0.01,2000);

const canvas = document.querySelector(".draw");
const renderer = new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setSize(aspect.width,aspect.height);

const gui = new dat.GUI();
//Resize
window.addEventListener("resize",()=>{
    aspect.width = window.innerWidth;
    aspect.height = window.innerHeight;

    camera.aspect = aspect.width/aspect.height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(aspect.width,aspect.height);
});
renderer.render(scene,camera);


scene.add(camera);
camera.position.set(10,100,10);
camera.lookAt(0,0,0);

//Light

const ambientLight = new THREE.AmbientLight(0xffffff,2.0);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff,2.0);
scene.add(directionalLight);
directionalLight.position.set(-10,50,0);


export {scene,renderer,camera,aspect , gui};