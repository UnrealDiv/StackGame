import * as THREE from 'three';
import {scene,renderer,camera,aspect,gui} from "./settings.js";
import { createCube } from './createCube.js';

let gameStart = false;
let stack = [];
let cubeHeight = 15;
const originalBoxSize = 5;
let speed = 0.3;
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
  let initialHue = getRandomNumber(0.0,1.0);
  let initialSaturation = getRandomNumber(0.6,0.7);
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
        
        let topLayer = stack[stack.length-1];
        let previousLayer = stack[stack.length-2]
       
        let topWidth = topLayer.threejs.geometry.parameters.width;
        let prevWidth = topLayer.threejs.geometry.parameters.width;
        let topDepth = topLayer.threejs.geometry.parameters.depth;
        let prevDepth = topLayer.threejs.geometry.parameters.depth;
        let topPosX = topLayer.threejs.position.x;
        let topPosZ = topLayer.threejs.position.z;
        let prevPosX = previousLayer.threejs.position.x;
        let prevPosZ = previousLayer.threejs.position.z;

        let pLeftX = (prevPosX-prevWidth/2);
        let pRightX = (prevPosX+prevWidth/2);

        let tLeftX = (topPosX-topWidth/2);
        let tRightX = (topPosX+topWidth/2);

        let pFrontZ = (prevPosZ-prevDepth/2);
        let pBackZ = (prevPosZ+prevDepth/2);

        let tFrontZ = (topPosZ-topDepth/2);
        let tBackZ = (topPosZ+topDepth/2);
        
        // console.log(prevPosX);

        
        
        let newDep;
        let newWid

        //Inbound Check
        if(topLayer.direction ==='x'){
            if((topPosX - topWidth/2) > (prevPosX +prevWidth/2) ){
                console.log("gameOver");
            }else if((topPosX + topWidth/2) < (prevPosX -prevWidth/2)){
                console.log("gameOver");
            }else{
                
               
                if(tLeftX+ (topWidth/2) >=(pRightX-(prevWidth/2))){
                   newWid = pRightX-tLeftX;
                   newDep = pBackZ-tFrontZ;
                    const newGeometry = new THREE.BoxGeometry(newWid, cubeHeight, prevDepth);
                    topLayer.threejs.geometry.dispose(); // Dispose the old geometry to release memory
                    topLayer.threejs.geometry = newGeometry; // Replace the geometry of the mesh
                    topLayer.threejs.position.x = tLeftX + newWid/2;
                }else if(tLeftX+(topWidth/2) < pLeftX+(prevWidth/2)){
                 newWid = Math.abs(pLeftX-tRightX);
                 newDep = Math.abs(pFrontZ-tBackZ);
                 const newGeometry = new THREE.BoxGeometry(newWid, cubeHeight, prevDepth);
                    topLayer.threejs.geometry.dispose(); // Dispose the old geometry to release memory
                    topLayer.threejs.geometry = newGeometry; // Replace the geometry of the mesh
                    topLayer.threejs.position.x = tRightX - newWid/2;
                }
            }    
        }else  if(topLayer.direction ==='z'){
            if((topPosZ - topDepth/2) > (prevPosZ +prevDepth/2) ){
                console.log("gameOver");
            }else if((topPosZ + topDepth/2) < (prevPosZ -prevDepth/2)){
                console.log("gameOver");
            }else{
                
        
               
                if(tFrontZ+(topDepth/2) >=(pBackZ-(prevDepth/2))){
        
                     newDep = pBackZ-tFrontZ;
                     newWid = pRightX-tLeftX;
                    const newGeometry = new THREE.BoxGeometry(prevWidth, cubeHeight, newDep);
                    topLayer.threejs.geometry.dispose(); // Dispose the old geometry to release memory
                    topLayer.threejs.geometry = newGeometry; // Replace the geometry of the mesh
                    topLayer.threejs.position.z = tFrontZ + newDep/2;
                }else if(tFrontZ+(topDepth/2) < pFrontZ+(prevDepth/2)){
                newDep = Math.abs(pFrontZ-tBackZ);
                newWid = Math.abs(pLeftX-tRightX);
                 const newGeometry = new THREE.BoxGeometry(prevWidth, cubeHeight, newDep);
                    topLayer.threejs.geometry.dispose(); // Dispose the old geometry to release memory
                    topLayer.threejs.geometry = newGeometry; // Replace the geometry of the mesh
                    topLayer.threejs.position.z = tBackZ - newDep/2;
                }
            }    
        }
     

        //


        const direction = topLayer.direction;
        //Next Layer's
        const nextX = direction === 'x'?topLayer.threejs.position.x:-10;
        const nextZ = direction ==='z'?topLayer.threejs.position.z:-10;
        const newWidth = originalBoxSize;
        const newDepth = originalBoxSize;
        const nextDirection = direction ==="x"?"z":"x";
        addLayer(nextX,nextZ,newWid,newDep,nextDirection);
        audioPlayer.volume = 1;
        audioPlayer.currentTime = 0;
        audioPlayer.play();
       
         
});




function animation(){
    let topLayer = stack[stack.length-1];
    if(topLayer.threejs.position[topLayer.direction] > 10){
        speed = speed *-1;
    }else if(topLayer.threejs.position[topLayer.direction] < -10){
        speed = speed*-1;
    }
    topLayer.threejs.position[topLayer.direction] += speed;


    if(camera.position.y < cubeHeight*(stack.length-2)+100){
        camera.position.y +=2;
    }
    renderer.render(scene,camera);
}

