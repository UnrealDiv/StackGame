import * as THREE from 'three';
import {scene,renderer,camera,aspect,gui} from "./settings.js";
import { createCube } from './createCube.js';

let gameStart = false;
let stack = [];
let cubeHeight = 10;
const originalBoxSize = 5;
let speed = 0.3;

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
    console.log(posY);
}

function generateCube(x,y,z,width,depth){
    const cubeGeometry = new THREE.BoxGeometry(width,cubeHeight,depth);
    const cubeMaterial = new THREE.MeshLambertMaterial({color:0x00ff00});
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
        console.log(camera.position.y,'cam');
        camera.position.y +=1;
    }
    renderer.render(scene,camera);
}

