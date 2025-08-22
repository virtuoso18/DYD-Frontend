<template>
  <button @click="generateBinaryMask" class="action-btn">Generate Binary Mask</button>
  <div id="canvas-container" ref="canvasContainer">
    <div id="viewer" ref="viewer">
      <div id="loading" v-if="loading">Loading 3D model and floor data...</div>
      
      <!-- Controls Panel -->
      <div id="controls" class="controls-panel">
        <div class="control-group">
          <label>Model Position:</label>
          <div class="position-inputs">
            <div class="position-input">
              <label>X Position:</label>
              <input 
                v-model.number="modelPosition.x" 
                @input="updateModelPosition" 
                type="number" 
                step="0.1"
              />
            </div>
            <div class="position-input">
              <label>Y Position:</label>
              <input 
                v-model.number="modelPosition.y" 
                @input="updateModelPosition" 
                type="number" 
                step="0.1"
              />
            </div>
          </div>
          <button @click="resetModelPosition">Reset Model Position</button>
          <div class="drag-info">
            <p><strong>Drag Controls:</strong> Left-click and drag the model to move it on floor surface</p>
            <p class="floor-status" :class="{ 'valid': isOnValidFloor, 'invalid': !isOnValidFloor }">
              Floor Status: {{ isOnValidFloor ? 'Valid Floor' : 'Invalid Area' }}
            </p>
          </div>
        </div>

        <div class="control-group">
          <label>Model Rotation:</label>
          <div class="angle-inputs">
            <div class="angle-input">
              <label>Y Rotation:</label>
              <input 
                v-model.number="modelRotation.y" 
                @input="updateModelRotation" 
                type="number" 
                step="1" 
                min="-180" 
                max="180"
              />
            </div>
          </div>
          <button @click="resetModelRotation">Reset Model Rotation</button>
        </div>

        <div class="control-group">
          <label>Floor Configuration:</label>
          <div class="angle-inputs">
            <div class="angle-input">
              <label>Floor Roll:</label>
              <span>{{ floorAngles.roll.toFixed(2) }}°</span>
            </div>
            <div class="angle-input">
              <label>Floor Pitch:</label>
              <span>{{ floorAngles.pitch.toFixed(2) }}°</span>
            </div>
            <div class="angle-input">
              <label>Floor Yaw:</label>
              <span>{{ floorAngles.yaw.toFixed(2) }}°</span>
            </div>
          </div>
        </div>
        
        <div class="control-group">
          <label>Grid Settings:</label>
          <div class="grid-controls">
            <div>
              <input type="checkbox" v-model="showGrid" @change="toggleGrid" id="showGrid" />
              <label for="showGrid">Show Grid</label>
            </div>
            <div>
              <input type="checkbox" v-model="showRotationControls" @change="toggleRotationControls" id="showRotationControls" />
              <label for="showRotationControls">Show Rotation Controls</label>
            </div>
            <div>
              <input type="checkbox" v-model="showFloorMask" @change="toggleFloorMask" id="showFloorMask" />
              <label for="showFloorMask">Show Floor Mask</label>
            </div>
            <div class="grid-size">
              <label>Grid Size:</label>
              <input 
                v-model.number="gridSize" 
                @input="updateGridSize" 
                type="number" 
                min="0.1" 
                max="5" 
                step="0.1"
              />
              <span>units</span>
            </div>
          </div>
        </div>
        
        <div class="control-group">
          <label>View Controls:</label>
          <button @click="resetCamera">Reset Camera</button>
          <button @click="topView">Top View</button>
          <button @click="sideView">Side View</button>
        </div>
        
        <div class="info">
          <p>Model: {{ modelLoaded ? 'Loaded' : 'Loading...' }}</p>
          <p>Floor Mask: {{ floorMaskLoaded ? 'Loaded' : 'Loading...' }}</p>
          <p>Model Position: ({{ modelPosition.x.toFixed(1) }}, {{ modelPosition.y.toFixed(1) }})</p>
          <p>Floor Height: {{ currentFloorHeight.toFixed(2) }}</p>
          <p>Model Rotation: Y={{ modelRotation.y.toFixed(1) }}°</p>
          <p v-if="isDragging" class="drag-status">🖱️ Dragging Model</p>
          <p v-if="isRotating" class="drag-status">🔄 Rotating Model</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, reactive } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";



const props = defineProps({
  glbUrl: { type: String, required: true },
  baseImageUrl: { type: String, required: true },
  floorMaskUrl: { type: String, required: true },
  roll: { type: Number, default: 0 },
  pitch: { type: Number, default: 0 },
  yaw: { type: Number, default: 0 },
});



const viewer = ref(null);
const canvasContainer = ref(null);
const loading = ref(true);
const modelLoaded = ref(false);
const floorMaskLoaded = ref(false);
const showGrid = ref(true);
const showRotationControls = ref(true);
const showFloorMask = ref(false);
const isDragging = ref(false);
const isRotating = ref(false);
const isOnValidFloor = ref(true);

const modelPosition = reactive({ x: 0, y: 12 });
const modelRotation = reactive({ y: 0 });
const floorAngles = reactive({ 
  roll: props.roll, 
  pitch: props.pitch, 
  yaw: props.yaw 
});
const gridSize = ref(0.3);
const currentFloorHeight = ref(0);

// Floor mask data
let floorMaskTexture = null;
let floorMaskCanvas = null;
let floorMaskContext = null;
let floorMaskImageData = null;

let isDraggingModel = false;
let isRotatingModel = false;
let dragStartMouse = new THREE.Vector2();
let dragStartPosition = new THREE.Vector2();
let rotationStartMouse = new THREE.Vector2();
let rotationStartAngle = 0;
let dragPlane = new THREE.Plane();
let raycaster = new THREE.Raycaster();

let scene, camera, renderer, controls, animationId;
let backgroundScene, backgroundCamera, bgMesh;
let gridGroup, gridHelper, floorPlane;
let model, modelBoundingBox, modelCenter, modelSize;
let rotationControlsGroup, rotationCircle, rotationArrows;
let currentBackgroundTexture = null;
let floorMaskMesh = null;

onMounted(() => {
  const container = viewer.value;
  initializeScene(container);
  initializeBackground();
  initializeLighting();
  loadFloorMask();
  initializeGrid();
  initializeRotationControls();
  initializeControls();
  initializeDragControls();
  loadModel();
  
  window.addEventListener("resize", onWindowResize);
  animate();
});

function initializeScene(container) {
  scene = new THREE.Scene();
  backgroundScene = new THREE.Scene();
  backgroundCamera = new THREE.Camera();

  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
}

function initializeBackground() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, '#f5f5f5');
  gradient.addColorStop(1, '#e0e0e0');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);
  
  const fallbackTexture = new THREE.CanvasTexture(canvas);
  
  new THREE.TextureLoader().load(
    // "http://127.0.0.1:8000/media/rooms/images/cleaned_20250820_143130_754.png",

        props.baseImageUrl,  // ✅ from parent

    (texture) => {
      currentBackgroundTexture = texture;
      adjustCanvasToImageAspectRatio(texture);
      updateBackground(texture);
    },
    undefined,
    (error) => {
      console.warn("Background image failed to load, using fallback");
      currentBackgroundTexture = fallbackTexture;
      updateBackground(fallbackTexture);
    }
  );
}

function generateBinaryMask() {
  if (!model || !currentBackgroundTexture) {
    console.warn("Model or background not loaded");
    return;
  }

  // Get background image dimensions
  const bgWidth = currentBackgroundTexture.image.width;
  const bgHeight = currentBackgroundTexture.image.height;

  // Create a temporary canvas with background image dimensions
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = bgWidth;
  tempCanvas.height = bgHeight;
  
  // Create temporary renderer with background dimensions
  const tempRenderer = new THREE.WebGLRenderer({ 
    canvas: tempCanvas, 
    antialias: true, 
    preserveDrawingBuffer: true 
  });
  tempRenderer.setSize(bgWidth, bgHeight);
  tempRenderer.setClearColor(0x000000, 1); // Black background

  // Create temporary scene with only the model
  const tempScene = new THREE.Scene();
  
  // Clone the model
  const modelClone = model.clone();
  tempScene.add(modelClone);

  // Add lighting to temp scene
  tempScene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 1.0));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
  dirLight.position.set(10, 15, 5);
  tempScene.add(dirLight);

  // Create temporary camera with same settings but adjusted for background dimensions
  const tempCamera = camera.clone();
  tempCamera.aspect = bgWidth / bgHeight;
  tempCamera.updateProjectionMatrix();

  // Make model white for binary mask
  modelClone.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    }
  });

  // Render the mask
  tempRenderer.render(tempScene, tempCamera);

  // Convert to binary mask and download
  const dataURL = tempCanvas.toDataURL('image/png');
  
  // Create download link
  const link = document.createElement('a');
  link.download = `model_binary_mask_${Date.now()}.png`;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Cleanup
  tempRenderer.dispose();
  
  console.log(`Binary mask generated with dimensions: ${bgWidth}x${bgHeight}`);
}
function adjustCanvasToImageAspectRatio(texture) {
  if (!texture.image || !canvasContainer.value) return;
  
  const imgAspect = texture.image.width / texture.image.height;
  const maxWidth = 1200;
  const maxHeight = 800;
  
  let canvasWidth, canvasHeight;
  
  if (imgAspect > maxWidth / maxHeight) {
    canvasWidth = maxWidth;
    canvasHeight = maxWidth / imgAspect;
  } else {
    canvasHeight = maxHeight;
    canvasWidth = maxHeight * imgAspect;
  }
  
  canvasContainer.value.style.width = `${canvasWidth}px`;
  canvasContainer.value.style.height = `${canvasHeight}px`;
  
  renderer.setSize(canvasWidth, canvasHeight);
  camera.aspect = canvasWidth / canvasHeight;
  camera.updateProjectionMatrix();
}

function loadFloorMask() {
  const loader = new THREE.TextureLoader();
  loader.load(

    // "http://127.0.0.1:8000/media/Room_Layout/21e0e47d-06ba-4c30-9cd6-75cfcd5ae32d/objects_removed_results/result_20250811_150513.png_floor_mask_segformer.png",
    props.floorMaskUrl,   // ✅ from parent

    
    (texture) => {
      floorMaskTexture = texture;
      
      // Create canvas for pixel data access
      floorMaskCanvas = document.createElement('canvas');
      floorMaskCanvas.width = texture.image.width;
      floorMaskCanvas.height = texture.image.height;
      floorMaskContext = floorMaskCanvas.getContext('2d');
      floorMaskContext.drawImage(texture.image, 0, 0);
      floorMaskImageData = floorMaskContext.getImageData(0, 0, floorMaskCanvas.width, floorMaskCanvas.height);
      
      floorMaskLoaded.value = true;
      createFloorMaskVisualization();
      console.log("Floor mask loaded:", floorMaskCanvas.width, "x", floorMaskCanvas.height);
    },
    undefined,
    (error) => {
      console.error("Failed to load floor mask:", error);
      floorMaskLoaded.value = false;
    }
  );
}

function createFloorMaskVisualization() {
  if (!floorMaskTexture) return;
  
  // Create a plane to visualize the floor mask
  const geometry = new THREE.PlaneGeometry(10, 10);
  const material = new THREE.MeshBasicMaterial({
    map: floorMaskTexture,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  });
  
  if (floorMaskMesh) scene.remove(floorMaskMesh);
  floorMaskMesh = new THREE.Mesh(geometry, material);
  
  // Apply floor angles
  floorMaskMesh.rotation.x = THREE.MathUtils.degToRad(-90 + floorAngles.pitch);
  floorMaskMesh.rotation.y = THREE.MathUtils.degToRad(floorAngles.yaw);
  floorMaskMesh.rotation.z = THREE.MathUtils.degToRad(floorAngles.roll);
  
  floorMaskMesh.position.y = 0;
  floorMaskMesh.visible = showFloorMask.value;
  scene.add(floorMaskMesh);
}

function updateBackground(texture) {
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  
  const bgGeo = new THREE.PlaneGeometry(2, 2);
  const bgMat = new THREE.MeshBasicMaterial({ map: texture, depthTest: false });

  if (bgMesh) backgroundScene.remove(bgMesh);
  
  bgMesh = new THREE.Mesh(bgGeo, bgMat);
  bgMesh.position.z = -1;
  backgroundScene.add(bgMesh);
}

function initializeLighting() {
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.6));

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(10, 15, 5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 50;
  dirLight.shadow.camera.left = -20;
  dirLight.shadow.camera.right = 20;
  dirLight.shadow.camera.top = 20;
  dirLight.shadow.camera.bottom = -20;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
  fillLight.position.set(-10, 5, -5);
  scene.add(fillLight);
}

function initializeGrid() {
  gridGroup = new THREE.Group();
  scene.add(gridGroup);
  createFloorGrid();
}

function createFloorGrid() {
  if (gridHelper) gridGroup.remove(gridHelper);
  if (floorPlane) gridGroup.remove(floorPlane);
  
  // Create grid helper aligned with floor angles
  gridHelper = new THREE.GridHelper(10, 20, 0x888888, 0x888888);
  gridHelper.material.opacity = 0.8;
  gridHelper.material.transparent = true;
  gridHelper.visible = showGrid.value;
  
  // Apply floor rotation to grid
  gridHelper.rotation.x = THREE.MathUtils.degToRad(floorAngles.pitch);
  gridHelper.rotation.y = THREE.MathUtils.degToRad(floorAngles.yaw);
  gridHelper.rotation.z = THREE.MathUtils.degToRad(floorAngles.roll);
  
  gridGroup.add(gridHelper);
  
  // Create invisible floor plane for dragging with floor orientation
  const floorGeometry = new THREE.PlaneGeometry(20, 20);
  const floorMaterial = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: 0,
    color: 0x888888,
    side: THREE.DoubleSide
  });
  
  floorPlane = new THREE.Mesh(floorGeometry, floorMaterial);
  floorPlane.rotation.x = THREE.MathUtils.degToRad(-90 + floorAngles.pitch);
  floorPlane.rotation.y = THREE.MathUtils.degToRad(floorAngles.yaw);
  floorPlane.rotation.z = THREE.MathUtils.degToRad(floorAngles.roll);
  floorPlane.name = 'dragFloor';
  gridGroup.add(floorPlane);
}

function initializeRotationControls() {
  rotationControlsGroup = new THREE.Group();
  rotationControlsGroup.name = 'rotationControls';
  
  // --- Rotation Circle ---
  const circleGeometry = new THREE.RingGeometry(1.5, 1.6, 64);
  const circleMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x00ffff, 
    transparent: true, 
    opacity: 0.8,
    side: THREE.DoubleSide 
  });
  rotationCircle = new THREE.Mesh(circleGeometry, circleMaterial);
  rotationCircle.rotation.x = -Math.PI / 2;
  rotationCircle.name = 'rotationCircle';
  rotationControlsGroup.add(rotationCircle);
  
  // --- Rotation Arrows ---
  rotationArrows = new THREE.Group();
  rotationArrows.name = 'rotationArrows';
  
  // 4 arrow positions: N, E, S, W
  const arrowPositions = [
    { angle: 0, axis: 'y', id: 0 },              // North
    { angle: Math.PI / 2, axis: 'y', id: 1 },    // East
    { angle: Math.PI, axis: 'y', id: 2 },        // South
    { angle: (3 * Math.PI) / 2, axis: 'y', id: 3 } // West
  ];
  
  arrowPositions.forEach((pos) => {
    const arrowGroup = createRotationArrow(pos.angle, pos.axis, pos.id);
    rotationArrows.add(arrowGroup);
  });
  
  rotationControlsGroup.add(rotationArrows);
  rotationControlsGroup.visible = showRotationControls.value;
  scene.add(rotationControlsGroup);
  // selectedModel.add(rotationControlsGroup);

}



function createRotationArrow(angle, axis, index) {
  const arrowGroup = new THREE.Group();
  
  const arrowGeometry = new THREE.ConeGeometry(0.08, 0.2, 8);
  const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
  const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
  
  const radius = 1.55;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  
  arrow.position.set(x, 0, z);
  arrow.rotation.x = -Math.PI / 2;
  arrow.rotation.y = angle + Math.PI / 2;
  
  arrow.userData = {
    isRotationArrow: true,
    axis: axis,
    index: index,
    originalColor: 0x00ff88
  };
  
  arrowGroup.add(arrow);
  return arrowGroup;
}

function updateRotationControlsPosition() {
  if (!rotationControlsGroup || !model) return;
  
  rotationControlsGroup.position.copy(model.position);
  
  let scale = 1;
  if (modelSize) {
    const avgSize = (modelSize.x + modelSize.z) / 2;
    scale = Math.max(0.5, avgSize * 0.8);
  }
  rotationControlsGroup.scale.setScalar(scale);
}

function initializeControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  
  // Disable all user camera interactions
  controls.enableRotate = false;  // prevent orbiting
  controls.enableZoom = false;    // prevent zooming
  controls.enablePan = false;     // prevent panning

  // You can still set a fixed view
  camera.position.set(5, 5, 5);
  controls.target.set(0, 0, 0);
  controls.update();
}

// function initializeControls() {
//   controls = new OrbitControls(camera, renderer.domElement);
//   controls.enableDamping = true;
//   controls.dampingFactor = 0.1;
//   controls.maxPolarAngle = Math.PI * 0.48;
//   controls.minDistance = 1;
//   controls.maxDistance = 20;
  
//   camera.position.set(5, 5, 5);
//   controls.target.set(0, 0, 0);
//   controls.update();
// }

function initializeDragControls() {
  const canvas = renderer.domElement;
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('mouseleave', onMouseUp);
}

function isPositionOnFloor(worldPos) {
  if (!floorMaskImageData || !currentBackgroundTexture) return false;
  
  // Convert world position to normalized coordinates (-1 to 1)
  const normalizedX = worldPos.x / 5; // Assuming floor extends from -5 to 5
  const normalizedZ = worldPos.z / 5;
  
  // Convert to image coordinates
  const imgX = Math.floor((normalizedX + 1) * 0.5 * floorMaskCanvas.width);
  const imgY = Math.floor((1 - (normalizedZ + 1) * 0.5) * floorMaskCanvas.height);
  
  // Check bounds
  if (imgX < 0 || imgX >= floorMaskCanvas.width || imgY < 0 || imgY >= floorMaskCanvas.height) {
    return false;
  }
  
  // Get pixel data (RGBA)
  const pixelIndex = (imgY * floorMaskCanvas.width + imgX) * 4;
  const red = floorMaskImageData.data[pixelIndex];
  
  // White pixels (255) represent valid floor areas
  return red > 128; // Threshold for floor detection
}

function getFloorHeightAtPosition(worldPos) {
  // Calculate height based on floor plane equation with given angles
  const rollRad = THREE.MathUtils.degToRad(floorAngles.roll);
  const pitchRad = THREE.MathUtils.degToRad(floorAngles.pitch);
  
  // Simple height calculation based on floor angles
  const height = worldPos.x * Math.tan(rollRad) + worldPos.z * Math.tan(pitchRad);
  return height;
}

function onMouseDown(event) {
  event.preventDefault();
  
  const mouse = new THREE.Vector2();
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  
  if (rotationArrows && showRotationControls.value) {
    const arrowIntersects = raycaster.intersectObject(rotationArrows, true);
    
    if (arrowIntersects.length > 0) {
      const intersectedArrow = arrowIntersects[0].object;
      if (intersectedArrow.userData.isRotationArrow) {
        controls.enabled = false;
        isRotatingModel = true;
        isRotating.value = true;
        
        rotationStartMouse.copy(mouse);
        rotationStartAngle = modelRotation.y;
        
        intersectedArrow.material.color.setHex(0xff6600);
        return;
      }
    }
  }
  
  if (model) {
    const intersects = raycaster.intersectObject(model, true);
    
    if (intersects.length > 0) {
      controls.enabled = false;
      isDraggingModel = true;
      isDragging.value = true;
      
      dragStartMouse.copy(mouse);
      dragStartPosition.set(modelPosition.x, modelPosition.y);
      
      // Set drag plane to floor plane with correct orientation
      const floorNormal = new THREE.Vector3(0, 1, 0);
      floorNormal.applyEuler(new THREE.Euler(
        THREE.MathUtils.degToRad(floorAngles.pitch),
        THREE.MathUtils.degToRad(floorAngles.yaw),
        THREE.MathUtils.degToRad(floorAngles.roll)
      ));
      
      dragPlane.setFromNormalAndCoplanarPoint(floorNormal, new THREE.Vector3(0, 0, 0));
    }
  }
}

function onMouseMove(event) {
  if (!isDraggingModel && !isRotatingModel) return;
  
  event.preventDefault();
  
  const mouse = new THREE.Vector2();
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
  if (isDraggingModel) {
    raycaster.setFromCamera(mouse, camera);
    
    const intersection = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
      const newWorldPos = intersection.clone();
      
      // Check if position is on valid floor
      if (isPositionOnFloor(newWorldPos)) {
        modelPosition.x = intersection.x;
        modelPosition.y = intersection.z;
        isOnValidFloor.value = true;
      } else {
        isOnValidFloor.value = false;
        // Still allow movement but indicate invalid area
        modelPosition.x = intersection.x;
        modelPosition.y = intersection.z;
      }
      
      updateModelPosition();
    }
  } else if (isRotatingModel) {
    const deltaX = mouse.x - rotationStartMouse.x;
    modelRotation.y = rotationStartAngle + (deltaX * 180);
    modelRotation.y = Math.max(-180, Math.min(180, modelRotation.y));
    updateModelRotation();
  }
}

function onMouseUp(event) {
  if (isDraggingModel) {
    controls.enabled = true;
    isDraggingModel = false;
    isDragging.value = false;
  }
  
  if (isRotatingModel) {
    controls.enabled = true;
    isRotatingModel = false;
    isRotating.value = false;
    
    if (rotationArrows) {
      rotationArrows.traverse((child) => {
        if (child.userData && child.userData.isRotationArrow) {
          child.material.color.setHex(child.userData.originalColor);
        }
      });
    }
  }
}

function loadModel() {
  const loader = new GLTFLoader();
  loader.load(
    "http://127.0.0.1:8000/media/products/3d_models/046-cp7.glb",
    (gltf) => {
      if (model) scene.remove(model);

      model = gltf.scene;

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.userData.draggable = true;
        }
      });

      modelBoundingBox = new THREE.Box3().setFromObject(model);
      modelSize = modelBoundingBox.getSize(new THREE.Vector3());
      modelCenter = modelBoundingBox.getCenter(new THREE.Vector3());

      const maxDim = Math.max(modelSize.x, modelSize.y, modelSize.z);
      const desiredSize = 2;
      const scaleFactor = desiredSize / maxDim;
      model.scale.setScalar(scaleFactor);

      modelBoundingBox = new THREE.Box3().setFromObject(model);
      modelSize = modelBoundingBox.getSize(new THREE.Vector3());
      modelCenter = modelBoundingBox.getCenter(new THREE.Vector3());

      model.position.sub(modelCenter);
      
      // Position model on floor surface
      const floorHeight = getFloorHeightAtPosition(new THREE.Vector3(0, 0, 0));
      model.position.y = floorHeight - modelBoundingBox.min.y;
      
      currentFloorHeight.value = floorHeight;

      scene.add(model);
      updateRotationControlsPosition();
      fitCameraToModel();

      loading.value = false;
      modelLoaded.value = true;
    },
    (progress) => {
      console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
    },
    (error) => {
      console.error("Failed to load model", error);
      loading.value = false;
      modelLoaded.value = false;
    }
  );
}

function fitCameraToModel() {
  if (!model || !modelSize) return;
  
  const maxDim = Math.max(modelSize.x, modelSize.y, modelSize.z);
  const fov = camera.fov * (Math.PI / 180);
  const fitHeightDistance = maxDim / (2 * Math.tan(fov / 2));
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  const distance = Math.max(fitHeightDistance, fitWidthDistance) * 3.5;

  camera.position.set(distance * 0.5, distance * 0.4, distance * 0.8);
  
  const modelWorldY = model.position.y + modelSize.y * 0.5;
  controls.target.copy(new THREE.Vector3(0, modelWorldY, 0));
  controls.update();
}

function updateModelPosition() {
  if (!model) return;
  
  model.position.x = modelPosition.x;
  model.position.z = modelPosition.y;
  
  // Calculate height based on floor surface
  const worldPos = new THREE.Vector3(modelPosition.x, 0, modelPosition.y);
  const floorHeight = getFloorHeightAtPosition(worldPos);
  currentFloorHeight.value = floorHeight;
  
  if (modelBoundingBox) {
    model.position.y = floorHeight - modelBoundingBox.min.y;
  }
  
  // Check if position is valid
  isOnValidFloor.value = isPositionOnFloor(worldPos);
  
  updateRotationControlsPosition();
}

function updateModelRotation() {
  if (!model) return;
  model.rotation.y = THREE.MathUtils.degToRad(modelRotation.y);
}

function resetModelPosition() {
  modelPosition.x = 0;
  modelPosition.y = 0;
  updateModelPosition();
}

function resetModelRotation() {
  modelRotation.y = 0;
  updateModelRotation();
}

function toggleGrid() {
  if (gridHelper) gridHelper.visible = showGrid.value;
}

function toggleRotationControls() {
  if (rotationControlsGroup) {
    rotationControlsGroup.visible = showRotationControls.value;
  }
}

function toggleFloorMask() {
  if (floorMaskMesh) {
    floorMaskMesh.visible = showFloorMask.value;
  }
}

function updateGridSize() {
  createFloorGrid();
}

function resetCamera() {
  if (model) {
    fitCameraToModel();
  } else {
    camera.position.set(5, 5, 5);
    controls.target.set(0, 0, 0);
    controls.update();
  }
}

function topView() {
  const distance = model ? Math.max(modelSize.x, modelSize.z) * 2 : 10;
  camera.position.set(0, distance, 0);
  controls.target.set(0, 0, 0);
  controls.update();
}

function sideView() {
  const distance = model ? modelSize.x * 2 : 10;
  camera.position.set(distance, distance * 0.5, 0);
  controls.target.set(0, model ? modelSize.y * 0.5 : 0, 0);
  controls.update();
}

function animate() {
  animationId = requestAnimationFrame(animate);
  controls.update();
  
  renderer.autoClear = false;
  renderer.clear();
  renderer.render(backgroundScene, backgroundCamera);
  renderer.render(scene, camera);
}

function onWindowResize() {
  if (!currentBackgroundTexture) return;
  
  adjustCanvasToImageAspectRatio(currentBackgroundTexture);
  updateBackground(currentBackgroundTexture);
}

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener("resize", onWindowResize);
  if (renderer) {
    const canvas = renderer.domElement;
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseup', onMouseUp);
    canvas.removeEventListener('mouseleave', onMouseUp);
    renderer.dispose();
  }
});
</script>

<style scoped>
.controls-panel {
  display: none;
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  font-size: 12px;
  max-width: 300px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  z-index: 1000;
}

.control-group {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #333;
}

.control-group:last-child {
  border-bottom: none;
}

.control-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #fff;
}

.position-inputs, .angle-inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}

.position-input, .angle-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.position-input label, .angle-input label {
  margin-bottom: 0;
  margin-right: 8px;
  font-weight: normal;
  min-width: 80px;
}

.position-input input, .angle-input input {
  width: 80px;
  padding: 4px;
  border: 1px solid #555;
  border-radius: 3px;
  background: #222;
  color: white;
}

.angle-input span {
  color: #ccc;
  min-width: 80px;
  text-align: right;
}

.grid-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.grid-controls > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.grid-controls input[type="checkbox"] {
  margin-right: 8px;
}

.grid-size, .grid-divisions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.grid-size input, .grid-divisions input {
  width: 60px;
  padding: 4px;
  border: 1px solid #555;
  border-radius: 3px;
  background: #222;
  color: white;
}

.grid-size span, .grid-divisions span {
  color: #ccc;
  font-size: 11px;
}

button {
  background: #444;
  color: white;
  border: 1px solid #666;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  margin: 2px;
}

button:hover {
  background: #555;
}

button:active {
  background: #333;
}

.drag-info {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #333;
}

.drag-info p {
  margin: 4px 0;
  font-size: 11px;
  color: #ccc;
}

.floor-status {
  padding: 4px 8px;
  border-radius: 3px;
  font-weight: bold;
  margin-top: 4px;
}

.floor-status.valid {
  background-color: rgba(0, 255, 0, 0.2);
  color: #00ff00;
}

.floor-status.invalid {
  background-color: rgba(255, 0, 0, 0.2);
  color: #ff4444;
}

.info {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #333;
}

.info p {
  margin: 3px 0;
  font-size: 11px;
  color: #ccc;
}

.drag-status {
  color: #00ff88 !important;
  font-weight: bold;
}

#canvas-container {
  position: relative;
  margin: 20px auto;
  border: 2px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

#viewer {
  position: relative;
  width: 100%;
  height: 100%;
}

#loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  z-index: 1000;
}
</style>