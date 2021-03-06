import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import "./style.css";
import * as Stats from 'stats.js';

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const scoreEl = document.getElementById('score');
let score = 0;

const speedEl = document.getElementById('score');
let speed = 0;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const cameraDirection = new THREE.Vector3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
document.body.appendChild(renderer.domElement);

// const helper = new THREE.CameraHelper(camera);
// scene.add(helper);

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// var gridXZ = new THREE.GridHelper(100, 10);
// scene.add(gridXZ);



const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(0, 10, 5);
light.target.position.set(-5, 0, 0);
scene.add(light);
scene.add(light.target);

const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

const playerGeometry = new THREE.OctahedronGeometry();
const playerMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);

// const controls = new OrbitControls(camera, renderer.domElement);
// camera.position.set(0, 0, 0);
// controls.target = player.position;
// controls.maxDistance = 10;
// controls.update();

camera.position.y = 4;
camera.position.x = -10;
// camera.position.z = 5;
camera.lookAt(player.position)

let cubes = [];
let maxCubes = 500;
let cubeFieldSize = 300;
let cubeFieldOffsetX = 50;

const again = () => {
    const tween8 = new TWEEN.Tween(player.position)
        .easing(TWEEN.Easing.Linear.None)
        .to({ ...player.position, x: player.position.x + 50 }, 3000)
        .onComplete(() => again())
        .start()
    const tween9 = new TWEEN.Tween(camera.position)
        .easing(TWEEN.Easing.Quadratic.In)
        .to({ ...player.position, y: camera.position.y, x: player.position.x - 5 }, 1000)
        .start()
}
const tween8 = new TWEEN.Tween(player.position)
    .easing(TWEEN.Easing.Quadratic.In)
    .to({ ...player.position, x: player.position.x + 50 }, 3000)
    .start()
    .onComplete(() => again())
// const tween9 = new TWEEN.Tween(camera.position)
//     .easing(TWEEN.Easing.Quadratic.Out)
//     .to({ ...camera.position, z: camera.position.z + 50 }, 2000)
//     .start()


function animate() {
    stats.begin();
    while (cubes.length < maxCubes) {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({ color: 0xc10037 });
        const cube = new THREE.Mesh(geometry, material);

        cube.position.x -= (Math.random() * cubeFieldSize) - cubeFieldSize - cubeFieldOffsetX;
        // cube.position.y += (Math.random() * 10) - 5;
        cube.position.z -= (Math.random() * cubeFieldSize * 3) - (cubeFieldSize * 3 / 2);
        scene.add(cube);
        cubes.push(cube);
    }
    cubes.forEach((cube, i) => {
        cube.position.x -= 0.3;
        if (cube.position.x < -cubeFieldOffsetX) {
            scene.remove(cube);
            cubes.splice(i, 1);
        }
    })

    for (var vertexIndex = 0; vertexIndex < 6; vertexIndex++) {
        camera.getWorldDirection(cameraDirection);
        var ray = new THREE.Raycaster(player.position, cameraDirection);
        var collisionResults = ray.intersectObjects(cubes);
        if (collisionResults.length > 0 && collisionResults[0].distance < cameraDirection.length()) {
            score += 1;
            scoreEl.textContent = score;
        }
    }

    // player.position.x += 0.1;

    // controls.update();
    // light.position.set(cubes[0].position.x - 1, cubes[0].position.y - 1, cubes[0].position.z - 1);
    // light.target = cubes[0];

    // camera.position.addScaledVector(cameraDirection, speed);

    stats.end();
    requestAnimationFrame(animate);
    TWEEN.update()
    renderer.render(scene, camera);
}
requestAnimationFrame(animate)

let mouse = { x: 0, y: 0 }
document.addEventListener("mousemove", (e) => {
    e.preventDefault();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case 'w':
        case 'ArrowUp':
            player.position.x -= 0.1;
            break;
        case 'ArrowLeft':
        case 'a':
            // camera.rotateZ(10);
            const tween6 = new TWEEN.Tween(player.rotation)
                .easing(TWEEN.Easing.Quadratic.Out)
                .to({ x: player.rotation.x - 0.5, y: player.rotation.y, z: player.rotation.z }, 1000)
                .start()
            const tween = new TWEEN.Tween(camera.rotation)
                .easing(TWEEN.Easing.Quadratic.Out)
                .to({ x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z + 1 }, 1000)
                .onUpdate((pos) => console.log(pos))
                .start()
            console.log('go!', tween);
            // player.position.z -= 0.1;
            break;
        case 's':
        case 'ArrowDown':
            player.position.x += 0.1;
            break;
        case 'ArrowRight':
        case 'd':
            const tween4 = new TWEEN.Tween(player.rotation)
                .easing(TWEEN.Easing.Quadratic.Out)
                .to({ x: player.rotation.x + 0.5, y: player.rotation.y, z: player.rotation.z }, 1000)
                .start()
            const tween2 = new TWEEN.Tween(camera.rotation)
                .easing(TWEEN.Easing.Quadratic.Out)
                .to({ x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z - 1 }, 1000)
                .start()
            // player.position.z += 0.1;
            break; d
    }
}, false);
