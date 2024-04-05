import * as THREE from 'three';
import {scene,renderer,camera,aspect,gui} from "./settings.js";
import { createCube } from './createCube.js';

let gameStart = false;
let stack = [];
let cubeHeight = 10;
const originalBoxSize = 5;
let speed = 0.3;
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
  let initialHue = getRandomNumber(0.0,1.0);
  let initialSaturation = getRandomNumber(0.6,0.9);
  let initialValue = getRandomNumber(0.3,0.6)
let currentColour = {
    color:new THREE.Color().setHSL(initialHue,initialSaturation, initialValue)
}


addLayer(0,0,originalBoxSize,originalBoxSize);
addLayer(-10,0,originalBoxSize,originalBoxSize,"x");

renderer.render(scene, camera);
renderer.setAnimationLoop(animation);
// window.addEventListener("click",addLayer);
function addLayer(x,z,width,depth,direction){
    let posY = cubeHeight*stack.length;
    const cube = generateCube(x,posY,z,width,depth)
    cube.direction =direction;
    stack.push(cube);
}

function generateCube(x,y,z,width,depth){
    const cubeGeometry = new THREE.BoxGeometry(width,cubeHeight,depth);
    const cubeMaterial = new THREE.MeshLambertMaterial({color:currentColour.color});
   
      
      // Example usage:
      initialHue = initialHue+0.03;
      initialSaturation = initialSaturation+Math.random(0.05,0.09);
        let nextValue = getRandomNumber(0.3,0.6);
     
      
    console.log(currentColour.color);
    currentColour.color.setHSL(initialHue,initialSaturation,0.5)
    const mesh = new THREE.Mesh(cubeGeometry,cubeMaterial);
    mesh.position.set(x,y,z);
    scene.add(mesh);
    return {
        threejs:mesh,
        width,
        depth
    }
}
const audioPlayer = document.getElementById('audioPlayer');
const audioPlayer2 = document.getElementById('audioPlayer2');
window.addEventListener("click",()=>{
        if(!gameStart){
            gameStart=true;
            audioPlayer2.play();
            audioPlayer2.loop = true;
            audioPlayer2.volume = 0.5;
        }
        
        const topLayer = stack[stack.length-1];
        const direction = topLayer.direction;
        //Next Layer's
        const nextX = direction === 'x'?0:-10;
        const nextZ = direction ==='z'?0:-10;
        const newWidth = originalBoxSize;
        const newHeight = originalBoxSize;
        const nextDirection = direction ==="x"?"z":"x";
        addLayer(nextX,nextZ,newWidth,newHeight,nextDirection);
        audioPlayer.volume = 1;
        audioPlayer.currentTime = 0;
        audioPlayer.play();
       
         
})


function animation(){
    
    let topLayer = stack[stack.length-1];
    if(topLayer.threejs.position[topLayer.direction] > 10){
        speed = speed *-1;
    }else if(topLayer.threejs.position[topLayer.direction] < -10){
        speed = speed*-1;
    }
    topLayer.threejs.position[topLayer.direction] += speed;


    if(camera.position.y < cubeHeight*(stack.length-2)+100){
        camera.position.y +=1;
    }
    renderer.render(scene,camera);
}

