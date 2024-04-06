import * as THREE from 'three';
import {scene,renderer,camera,aspect} from "./settings.js";

let gameStart = false;
let stack = [];
let cubeHeight = 15;
const originalBoxSize = 10;
let speed = 0.6;
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
  let initialHue = getRandomNumber(0.0,1.0);
  let initialSaturation = getRandomNumber(0.6,0.7);
  let initialValue = getRandomNumber(0.3,0.6)
let currentColour = {
    color:new THREE.Color().setHSL(initialHue,initialSaturation, initialValue)
}

let gameOver = false;
let distance = 20;
addLayer(0,0,originalBoxSize,originalBoxSize);
addLayer(-distance,0,originalBoxSize,originalBoxSize,"x");

function updateMobileCamera() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const cameraSize = 40; // Adjust camera size as needed

    // Calculate new camera dimensions based on aspect ratio
    let cameraWidth, cameraHeight;
    if (aspectRatio > 1) {
        cameraWidth = cameraSize * aspectRatio;
        cameraHeight = cameraSize;
    } else {
        cameraWidth = cameraSize;
        cameraHeight = cameraSize / aspectRatio;
    }

    // Set orthographic camera parameters
    camera.left = -cameraWidth / 2;
    camera.right = cameraWidth / 2;
    camera.top = cameraHeight / 2;
    camera.bottom = -cameraHeight / 2;
    camera.updateProjectionMatrix();
}
window.addEventListener("resize",()=>{
  
    aspect.width = window.innerWidth;
    aspect.height = window.innerHeight;

    camera.aspect = aspect.width/aspect.height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(aspect.width,aspect.height);
});
renderer.render(scene, camera);
renderer.setAnimationLoop(animation);
// window.addEventListener("click",addLayer);
function addLayer(x,z,width,depth,direction){
    let posY = (cubeHeight*stack.length)-20;
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

function gameRestart(){
    window.setTimeout(()=>{
        location.reload();
    },1000)
}

let scoreDisplay = document.querySelector(".score");
const audioPlayer = document.getElementById('audioPlayer');
const audioPlayer2 = document.getElementById('audioPlayer2');
const audioPlayer3 = document.getElementById('audioPlayer3');
window.addEventListener("click",()=>{
        if(!gameStart){
            gameStart=true;
            audioPlayer2.play();
            audioPlayer2.loop = true;
            audioPlayer2.volume = 0.6;
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
        if(!gameOver){
            scoreDisplay.innerText = `${stack.length-1}`;
        }
        
        
        let newDep;
        let newWid;

        //Inbound Check
        if(topLayer.direction ==='x'){
            if((topPosX - topWidth/2) > (prevPosX +prevWidth/2) ){
                gameOver = true;
                gameRestart()
            }else if((topPosX + topWidth/2) < (prevPosX -prevWidth/2)){
                gameOver = true;
                gameRestart()
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
                gameOver = true;
                gameRestart()
            }else if((topPosZ + topDepth/2) < (prevPosZ -prevDepth/2)){
                gameOver = true;
                gameRestart()
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
        const direction = topLayer.direction;
        //Next Layer's
        const nextX = direction === 'x'?topLayer.threejs.position.x:-distance;
        const nextZ = direction ==='z'?topLayer.threejs.position.z:-distance;
        const nextDirection = direction ==="x"?"z":"x";
        addLayer(nextX,nextZ,newWid,newDep,nextDirection);
        if(!gameOver){
            audioPlayer.volume = 1.0;
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        }else if(gameOver){
            audioPlayer3.volume =1;
            audioPlayer3.play();
        }
});

function disposeStack() {
    for (let i = 0; i < stack.length; i++) {
        const mesh = stack[i].threejs;
        scene.remove(mesh); // Remove the mesh from the scene
        mesh.geometry.dispose(); // Dispose of the mesh's geometry
        mesh.material.dispose(); // Dispose of the mesh's material
    }
    console.log('hi');
    stack = []; // Clear the stack array
}



function animation(){
    if (window.innerWidth <= 768) {
        updateMobileCamera();
    }
    if(!gameOver){
        let topLayer = stack[stack.length-1];
        if(topLayer.threejs.position[topLayer.direction] > distance){
            speed = speed *-1;
        }else if(topLayer.threejs.position[topLayer.direction] < -distance){
            speed = speed*-1;
        }
        topLayer.threejs.position[topLayer.direction] += speed;
        if(camera.position.y < cubeHeight*(stack.length-2)+100){
            camera.position.y +=2;
        }
        renderer.render(scene,camera);
    }else{
        if(stack.length-2 >0){
            audioPlayer.pause();
            audioPlayer2.pause();
        }
        disposeStack();
    
      
            scoreDisplay.innerText = `Game Over : ${stack.length-3}`;
        renderer.setAnimationLoop(null);
    }

   
}

