import * as THREE from 'three';
import { scene } from './settings.js';

const cubeMaterial = new THREE.MeshLambertMaterial({color:0xffff00});
function createCube(dimensions,position){
const cube = new THREE.Mesh(new THREE.BoxGeometry(dimensions.x,dimensions.y,dimensions.z),cubeMaterial);
scene.add(cube);
cube.position.set(position.x,position.y,position.z);
return cube;
}

export {createCube};