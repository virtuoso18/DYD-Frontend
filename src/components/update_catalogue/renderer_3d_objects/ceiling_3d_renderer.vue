<template>
    roll = {{roll}} ||  &nbsp; pitch = {{pitch}} ||  &nbsp; yaw = {{yaw}}
  <div class="main-canvas" ref="canvasContainer">
  
    <div id="viewer" ref="viewer">
      <div id="loading" v-if="loading">Loading 3D model and ceiling data...</div>
      </div>
  <button @click="generateBinaryMask" class="action-btn" style="">Generate Binary Mask</button>
  </div>

</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, reactive,watch} from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const props = defineProps({
  glbUrl: { type: String, required: true },
  baseImageUrl: { type: String, required: true },
  ceilingMaskUrl: { type: String, required: true }, // Changed from floorMaskUrl
  roll: { type: Number, default: 0 },
  pitch: { type: Number, default: 0 },
  yaw: { type: Number, default: 0 },
  ceilingHeight: { type: Number, default:1-0 }, // New prop for ceiling height
});

// Add watchers for props that should trigger reloads
watch(() => props.glbUrl, (newUrl, oldUrl) => {
  if (newUrl !== oldUrl && newUrl) {
    console.log('GLB URL changed, reloading model:', newUrl);
    loading.value = true;
    loadModel();
  }
});

watch(() => props.baseImageUrl, (newUrl, oldUrl) => {
  if (newUrl !== oldUrl && newUrl) {
    console.log('Base image URL changed, reloading background:', newUrl);
    initializeBackground();
  }
});

watch(() => props.ceilingMaskUrl, (newUrl, oldUrl) => {
  if (newUrl !== oldUrl && newUrl) {
    console.log('Ceiling mask URL changed, reloading mask:', newUrl);
    loadCeilingMask();
  }
});

// Watch for angle changes and update ceiling orientation
watch([() => props.roll, () => props.pitch, () => props.yaw], ([newRoll, newPitch, newYaw]) => {
  ceilingAngles.roll = newRoll - 10;
  ceilingAngles.pitch = newPitch - 20;
  ceilingAngles.yaw = newYaw + 30;
  
  if (ceilingPlane) {
    createCeilingPlaneWithEulerAngles();
  }
  if (ceilingMaskMesh) {
    createCeilingMaskVisualization();
  }
  if (gridHelper) {
    createVisualGrid();
  }
});

watch(() => props.ceilingHeight, (newHeight) => {
  currentCeilingHeight.value = newHeight + 40;
  
  // Update lighting position
  if (scene) {
    const dirLight = scene.children.find(child => 
      child instanceof THREE.DirectionalLight && child.position.y > newHeight
    );
    if (dirLight) {
      dirLight.position.y = newHeight + 5;
    }
  }
  
  // Update model position if loaded
  if (model) {
    updateModelPositionOnCeiling();
  }
  
  // Recreate ceiling elements
  if (ceilingPlane) {
    createCeilingPlaneWithEulerAngles();
  }
  if (ceilingMaskMesh) {
    createCeilingMaskVisualization();
  }
  if (gridHelper) {
    createVisualGrid();
  }
});

const viewer = ref(null);
const canvasContainer = ref(null);
const loading = ref(true);
const modelLoaded = ref(false);
const ceilingMaskLoaded = ref(false); // Changed from floorMaskLoaded
const showGrid = ref(false);
const showRotationControls = ref(true);
const showCeilingMask = ref(false); // Changed from showFloorMask
const isDragging = ref(false);
const isRotating = ref(false);
const isOnValidCeiling = ref(true); // Changed from isOnValidFloor

const modelPosition = reactive({ x: 0, y: 0 });
const modelRotation = reactive({ y: 0 });

// Use props for ceiling angles - matching Python output exactly for exact output
const ceilingAngles = reactive({ 
  roll: props.roll-10, 
  pitch: props.pitch-20,
  yaw: props.yaw +30
});

// code which will performs the great for ;look it looks like ceiling is hanging to the top border of image canvas
// const ceilingAngles = reactive({ 
//   roll: -10, 
//   pitch: -20,
//   yaw: 30
// });


const gridSize = ref(0.3);
const currentCeilingHeight = ref(props.ceilingHeight+40); // Changed from currentFloorHeight

// Ceiling mask data (changed from floor mask)
let ceilingMaskTexture = null;
let ceilingMaskCanvas = null;
let ceilingMaskContext = null;
let ceilingMaskImageData = null;

let isDraggingModel = false;
let isRotatingModel = false;
let dragStartMouse = new THREE.Vector2();
let dragStartPosition = new THREE.Vector2();
let rotationStartMouse = new THREE.Vector2();
let rotationStartAngle = 0;
let dragPlane = new THREE.Plane();
let raycaster = new THREE.Raycaster();
let ceilingNormal = new THREE.Vector3(); // Changed from floorNormal

let scene, camera, renderer, controls, animationId;
let backgroundScene, backgroundCamera, bgMesh;
let gridGroup, gridHelper, ceilingPlane; // Changed from floorPlane
let model, modelBoundingBox, modelCenter, modelSize;
let rotationControlsGroup, rotationCircle, rotationArrows;
let currentBackgroundTexture = null;
let ceilingMaskMesh = null; // Changed from floorMaskMesh

onMounted(() => {
  const container = viewer.value;
  initializeScene(container);
  initializeBackground();
  initializeLighting();
  loadCeilingMask(); // Changed from loadFloorMask
  initializeEnhancedGrid();
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
    props.baseImageUrl,
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

  const bgWidth = currentBackgroundTexture.image.width;
  const bgHeight = currentBackgroundTexture.image.height;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = bgWidth;
  tempCanvas.height = bgHeight;
  
  const tempRenderer = new THREE.WebGLRenderer({ 
    canvas: tempCanvas, 
    antialias: true, 
    preserveDrawingBuffer: true 
  });
  tempRenderer.setSize(bgWidth, bgHeight);
  tempRenderer.setClearColor(0x000000, 1);

  const tempScene = new THREE.Scene();
  const modelClone = model.clone();
  tempScene.add(modelClone);

  tempScene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 1.0));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
  dirLight.position.set(10, 15, 5);
  tempScene.add(dirLight);

  const tempCamera = camera.clone();
  tempCamera.aspect = bgWidth / bgHeight;
  tempCamera.updateProjectionMatrix();

  modelClone.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    }
  });

  tempRenderer.render(tempScene, tempCamera);

  const dataURL = tempCanvas.toDataURL('image/png');
  
  const link = document.createElement('a');
  link.download = `ceiling_model_binary_mask_${Date.now()}.png`;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  tempRenderer.dispose();
  
  console.log(`Binary mask generated with dimensions: ${bgWidth}x${bgHeight}`);
}

function adjustCanvasToImageAspectRatio(texture) {
  if (!texture.image || !canvasContainer.value) return;
  
  const imgAspect = texture.image.width / texture.image.height;
  const maxWidth = 800;
  const maxHeight = 550;
  
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

function loadCeilingMask() { // Changed from loadFloorMask
  const loader = new THREE.TextureLoader();
  loader.load(
    props.ceilingMaskUrl, // Changed from floorMaskUrl
    (texture) => {
      ceilingMaskTexture = texture;
      
      ceilingMaskCanvas = document.createElement('canvas');
      ceilingMaskCanvas.width = texture.image.width;
      ceilingMaskCanvas.height = texture.image.height;
      ceilingMaskContext = ceilingMaskCanvas.getContext('2d');
      ceilingMaskContext.drawImage(texture.image, 0, 0);
      ceilingMaskImageData = ceilingMaskContext.getImageData(0, 0, ceilingMaskCanvas.width, ceilingMaskCanvas.height);
      
      ceilingMaskLoaded.value = true;
      createCeilingMaskVisualization();
      console.log("Ceiling mask loaded:", ceilingMaskCanvas.width, "x", ceilingMaskCanvas.height);
    },
    undefined,
    (error) => {
      console.error("Failed to load ceiling mask:", error);
      ceilingMaskLoaded.value = false;
    }
  );
}

function createCeilingMaskVisualization() { // Changed from createFloorMaskVisualization
  if (!ceilingMaskTexture) return;
  
  const geometry = new THREE.PlaneGeometry(10, 10);
  const material = new THREE.MeshBasicMaterial({
    map: ceilingMaskTexture,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  });
  
  if (ceilingMaskMesh) scene.remove(ceilingMaskMesh);
  ceilingMaskMesh = new THREE.Mesh(geometry, material);
  
  // Apply ceiling angles using corrected rotation order
  const euler = new THREE.Euler(
    THREE.MathUtils.degToRad(-ceilingAngles.pitch), // Negative pitch
    THREE.MathUtils.degToRad(ceilingAngles.yaw),
    THREE.MathUtils.degToRad(ceilingAngles.roll),
    'XYZ' // Changed rotation order
  );
  ceilingMaskMesh.setRotationFromEuler(euler);
  
  // Position at top area height
  const topAreaHeight = props.ceilingHeight + 1.5;
  ceilingMaskMesh.position.y = topAreaHeight;
  ceilingMaskMesh.visible = showCeilingMask.value;
  scene.add(ceilingMaskMesh);
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


  // Adjust lighting for ceiling-mounted objects
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.9));

  const dirLight = new THREE.DirectionalLight(0xffffff, 8);
  dirLight.position.set(10, props.ceilingHeight + 5, 5); // Position above ceiling
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

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
  fillLight.position.set(-10, props.ceilingHeight - 2, -5); // Position below ceiling
  scene.add(fillLight);

  
  // Add additional key light from different angle
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
  keyLight.position.set(5, 10, 10);
  scene.add(keyLight);

  // Add subtle rim light for better edge definition
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
  rimLight.position.set(-5, 5, -10);
  scene.add(rimLight);


}

// Enhanced grid initialization with proper ceiling plane
function initializeEnhancedGrid() {
  gridGroup = new THREE.Group();
  scene.add(gridGroup);
  createCeilingPlaneWithEulerAngles(); // Changed from createFloorPlaneWithEulerAngles
  createVisualGrid();
}

// Create ceiling plane using exact Python rotation order
function createCeilingPlaneWithEulerAngles() { // Changed from createFloorPlaneWithEulerAngles
  if (ceilingPlane) gridGroup.remove(ceilingPlane);
  
  // Calculate ceiling normal using same method as Python but inverted for ceiling
  ceilingNormal = getCeilingNormalFromEulerAngles();
  
  // Create invisible ceiling plane for dragging
  const ceilingGeometry = new THREE.PlaneGeometry(20, 20);
  const ceilingMaterial = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: 0,
    color: 0x888888,
    side: THREE.DoubleSide
  });
  
  ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  
  // Apply rotation using corrected order for ceiling alignment
  const euler = new THREE.Euler(
    THREE.MathUtils.degToRad(-ceilingAngles.pitch), // Negative pitch
    THREE.MathUtils.degToRad(ceilingAngles.yaw),
    THREE.MathUtils.degToRad(ceilingAngles.roll),
    'XYZ' // Changed rotation order
  );
  ceilingPlane.setRotationFromEuler(euler);
  
  // Position at top area for proper ceiling representation
  const topAreaHeight = props.ceilingHeight + 1.5;
  ceilingPlane.position.set(0, topAreaHeight, 0);
  ceilingPlane.name = 'dragCeiling';
  gridGroup.add(ceilingPlane);
  
  // Update drag plane for intersection calculations
  updateDragPlane();
}

// Calculate ceiling normal from Euler angles (inverted from floor normal)
function getCeilingNormalFromEulerAngles() { // Changed from getFloorNormalFromEulerAngles
  // Start with down vector (0, -1, 0) for ceiling
  const normal = new THREE.Vector3(0, -1, 0);
  
  // Apply rotations with corrected order for proper ceiling alignment
  const euler = new THREE.Euler(
    THREE.MathUtils.degToRad(-ceilingAngles.pitch), // Negative pitch
    THREE.MathUtils.degToRad(ceilingAngles.yaw),
    THREE.MathUtils.degToRad(ceilingAngles.roll),
    'XYZ' // Changed rotation order for ceiling
  );
  normal.applyEuler(euler);
  
  return normal;
}

// Update drag plane for proper intersection
function updateDragPlane() {
  const topAreaHeight = props.ceilingHeight + 1.5;
  const ceilingPoint = new THREE.Vector3(0, topAreaHeight, 0);
  dragPlane.setFromNormalAndCoplanarPoint(ceilingNormal, ceilingPoint);
}

// Create visual grid aligned with ceiling plane
function createVisualGrid() {
  if (gridHelper) gridGroup.remove(gridHelper);
  
  // Create custom grid that follows the ceiling plane
  const gridSize = 8; // Reduced size for better visual alignment
  const divisions = 16; // Adjusted divisions
  const step = gridSize / divisions;
  
  const gridGeometry = new THREE.BufferGeometry();
  const gridVertices = [];
  
  // Create grid lines
  for (let i = 0; i <= divisions; i++) {
    const pos = -gridSize / 2 + i * step;
    
    // Horizontal lines
    gridVertices.push(-gridSize / 2, 0, pos);
    gridVertices.push(gridSize / 2, 0, pos);
    
    // Vertical lines
    gridVertices.push(pos, 0, -gridSize / 2);
    gridVertices.push(pos, 0, gridSize / 2);
  }
  
  gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridVertices, 3));
  
  const gridMaterial = new THREE.LineBasicMaterial({ 
    color: 0x4a90e2, // Changed to blue for better ceiling visibility
    transparent: true, 
    opacity: 0.7 
  });
  
  gridHelper = new THREE.LineSegments(gridGeometry, gridMaterial);
  
  // Position grid at top area of the scene (higher than ceiling)
  const topAreaHeight = props.ceilingHeight + 2;
  
  // Apply rotations with corrected order and values for proper ceiling alignment
  const euler = new THREE.Euler(
    THREE.MathUtils.degToRad(-ceilingAngles.pitch), // Negative pitch for correct orientation
    THREE.MathUtils.degToRad(ceilingAngles.yaw),
    THREE.MathUtils.degToRad(ceilingAngles.roll),
    'XYZ' // Changed rotation order for better ceiling alignment
  );
  gridHelper.setRotationFromEuler(euler);
  gridHelper.position.set(0, topAreaHeight, 0); // Position at top area
  gridHelper.visible = showGrid.value;
  
  gridGroup.add(gridHelper);
}

function initializeRotationControls() {
  rotationControlsGroup = new THREE.Group();
  rotationControlsGroup.name = 'rotationControls';
  
  const circleGeometry = new THREE.RingGeometry(1.5, 1.6, 64);
  const circleMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x00ffff, 
    transparent: true, 
    opacity: 0.8,
    side: THREE.DoubleSide 
  });
  rotationCircle = new THREE.Mesh(circleGeometry, circleMaterial);
  rotationCircle.rotation.x = Math.PI / 2; // Flip for ceiling orientation
  rotationCircle.name = 'rotationCircle';
  rotationControlsGroup.add(rotationCircle);
  
  rotationArrows = new THREE.Group();
  rotationArrows.name = 'rotationArrows';
  
  const arrowPositions = [
    { angle: 0, axis: 'y', id: 0 },
    { angle: Math.PI / 2, axis: 'y', id: 1 },
    { angle: Math.PI, axis: 'y', id: 2 },
    { angle: (3 * Math.PI) / 2, axis: 'y', id: 3 }
  ];
  
  arrowPositions.forEach((pos) => {
    const arrowGroup = createRotationArrow(pos.angle, pos.axis, pos.id);
    rotationArrows.add(arrowGroup);
  });
  
  rotationControlsGroup.add(rotationArrows);
  rotationControlsGroup.visible = showRotationControls.value;
  scene.add(rotationControlsGroup);
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
  arrow.rotation.x = Math.PI / 2; // Flip for ceiling orientation
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
  // Position controls above the hanging model
  rotationControlsGroup.position.y += modelSize ? modelSize.y * 0.6 : 1;
  
  let scale = 1;
  if (modelSize) {
    const avgSize = (modelSize.x + modelSize.z) / 2;
    scale = Math.max(0.5, avgSize * 0.8);
  }
  rotationControlsGroup.scale.setScalar(scale);
}

// function initializeControls() {
//   controls = new OrbitControls(camera, renderer.domElement);
  
//   controls.enableRotate = false;
//   controls.enableZoom = false;
//   controls.enablePan = false;

//   // Position camera to view ceiling-mounted objects
//   camera.position.set(10, props.ceilingHeight - 5, 10);
//   controls.target.set(0, props.ceilingHeight - 2, 0);
//   controls.update();
// }
function initializeControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  
  controls.enableRotate = false;
  controls.enableZoom = false;
  controls.enablePan = false;

  // NEW: Position camera to view top area of canvas
  const topAreaY = props.ceilingHeight + 3; // Higher Y position
  camera.position.set(8, topAreaY - 1, 8); // Slightly below the top area
  controls.target.set(0, topAreaY, 0); // Look at the top area
  controls.update();
}


function initializeDragControls() {
  const canvas = renderer.domElement;
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('mouseleave', onMouseUp);
}

// Enhanced ceiling position validation with proper coordinate mapping
function isPositionOnCeiling(worldPos) { // Changed from isPositionOnFloor
  if (!ceilingMaskImageData || !currentBackgroundTexture) return true; // Allow movement if no mask
  
  // Convert world position to normalized coordinates (-1 to 1)
  const normalizedX = worldPos.x / 5;
  const normalizedZ = worldPos.z / 5;
  
  // Convert to image coordinates
  const imgX = Math.floor((normalizedX + 1) * 0.5 * ceilingMaskCanvas.width);
  const imgY = Math.floor((1 - (normalizedZ + 1) * 0.5) * ceilingMaskCanvas.height);
  
  // Check bounds
  if (imgX < 0 || imgX >= ceilingMaskCanvas.width || imgY < 0 || imgY >= ceilingMaskCanvas.height) {
    return false;
  }
  
  // Get pixel data (RGBA)
  const pixelIndex = (imgY * ceilingMaskCanvas.width + imgX) * 4;
  const red = ceilingMaskImageData.data[pixelIndex];
  
  // White pixels (255) represent valid ceiling areas
  return red > 128;
}

// Calculate ceiling height at any world position using the tilted plane
function getCeilingHeightAtWorldPosition(worldPos) { // Changed from getFloorHeightAtWorldPosition
  // Use the ceiling normal to calculate height
  // For ceiling at top area: plane equation adjusted for higher position
  if (Math.abs(ceilingNormal.y) < 0.001) return props.ceilingHeight + 1.5; // Avoid division by zero
  
  const topAreaHeight = props.ceilingHeight + 1.5;
  const planeConstant = ceilingNormal.y * topAreaHeight;
  return -(ceilingNormal.x * worldPos.x + ceilingNormal.z * worldPos.z - planeConstant) / ceilingNormal.y;
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
    }
  }
}

// Enhanced mouse move with proper ceiling plane constraint
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
      
      // Apply movement constraints (free movement in XZ on tilted ceiling plane)
      const newWorldPos = intersection.clone();
      
      // Update model position
      modelPosition.x = newWorldPos.x;
      modelPosition.y = newWorldPos.z; // Note: modelPosition.y represents Z in world space
      
      // Validate position is on ceiling mask
      isOnValidCeiling.value = isPositionOnCeiling(newWorldPos);
      
      updateModelPositionOnCeiling(); // Changed from updateModelPositionOnFloor
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


// Enhanced loadModel function with better cleanup
function loadModel() {
  const loader = new GLTFLoader();
  
  // Show loading state
  loading.value = true;
  modelLoaded.value = false;
  
  loader.load(
    props.glbUrl,
    (gltf) => {
      // Clean up existing model
      if (model) {
        scene.remove(model);
        // Dispose of geometries and materials to prevent memory leaks
        model.traverse((child) => {
          if (child.isMesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(material => material.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
      }

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
      
      // Position model hanging from ceiling surface using proper calculation
      const initialPos = new THREE.Vector3(0, 0, 0);
      const ceilingHeight = getCeilingHeightAtWorldPosition(initialPos);
      model.position.y = ceilingHeight - modelBoundingBox.max.y;
      
      currentCeilingHeight.value = ceilingHeight;

      scene.add(model);
      updateRotationControlsPosition();
      positionCameraForTopView();
      
      // Update loading states
      loading.value = false;
      modelLoaded.value = true;
      
      console.log('Model loaded successfully:', props.glbUrl);
    },
    (progress) => {
      console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
    },
    (error) => {
      console.error("Failed to load model:", error);
      loading.value = false;
      modelLoaded.value = false;
    }
  );
}

// Enhanced cleanup function
function cleanupResources() {
  if (model) {
    scene.remove(model);
    model.traverse((child) => {
      if (child.isMesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
  }
  
  if (ceilingMaskTexture) {
    ceilingMaskTexture.dispose();
  }
  
  if (currentBackgroundTexture) {
    currentBackgroundTexture.dispose();
  }
}
// function fitCameraToModel() {
//   if (!model || !modelSize) return;
  
//   const maxDim = Math.max(modelSize.x, modelSize.y, modelSize.z);
//   const fov = camera.fov * (Math.PI / 180);
//   const fitHeightDistance = maxDim / (2 * Math.tan(fov / 2));
//   const fitWidthDistance = fitHeightDistance / camera.aspect;
  
//   const distance = Math.max(fitHeightDistance, fitWidthDistance) * 5.0;

//   // Position camera below the ceiling-mounted model
//   camera.position.set(distance * 0.5, props.ceilingHeight - distance * 0.6, distance * 0.8);
  
//   const modelWorldY = model.position.y - modelSize.y * 0.5; // Look at bottom of hanging model
//   controls.target.copy(new THREE.Vector3(0, modelWorldY, 0));
//   controls.update();
// }


// 2. In fitCameraToModel() function - REPLACE the camera positioning section:
function fitCameraToModel() {
  if (!model || !modelSize) return;
  
  const maxDim = Math.max(modelSize.x, modelSize.y, modelSize.z);
  const fov = camera.fov * (Math.PI / 180);
  const fitHeightDistance = maxDim / (2 * Math.tan(fov / 2));
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  
  const distance = Math.max(fitHeightDistance, fitWidthDistance) * 3.0; // Reduced multiplier

  // NEW: Position camera to focus on top area
  const topAreaY = props.ceilingHeight + 0;
  camera.position.set(distance * 0.3, topAreaY - 0.5, distance * 0.5);
  controls.target.set(0, topAreaY, 0); // Target the top area
  controls.update();
}

// 3. OPTIONAL: If you want even more control, add this helper function:
function positionCameraForTopView() {
  const topAreaY = props.ceilingHeight -5;
  
  // Position camera at an angle to view the top area
  camera.position.set(8, topAreaY - 8, 20);
  controls.target.set(0, topAreaY, 0);
  
  // Adjust camera's up vector if needed for better orientation
  camera.up.set(0, 1, 0);
  camera.updateProjectionMatrix();
  controls.update();
}

// Enhanced model position update with proper ceiling projection
function updateModelPositionOnCeiling() { // Changed from updateModelPositionOnFloor
  if (!model) return;
  
  // Update XZ position
  model.position.x = modelPosition.x;
  model.position.z = modelPosition.y;
  
  // Calculate height based on ceiling surface using proper plane equation
  const worldPos = new THREE.Vector3(modelPosition.x, 0, modelPosition.y);
  const ceilingHeight = getCeilingHeightAtWorldPosition(worldPos);
  currentCeilingHeight.value = ceilingHeight;
  
  // Position model hanging from ceiling surface
  if (modelBoundingBox) {
    model.position.y = ceilingHeight - modelBoundingBox.max.y; // Hang from ceiling top
  }
  
  updateRotationControlsPosition();
}

function updateModelRotation() {
  if (!model) return;
  model.rotation.y = THREE.MathUtils.degToRad(modelRotation.y);
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


// Update the onBeforeUnmount to include resource cleanup
onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener("resize", onWindowResize);
  
  if (renderer) {
    const canvas = renderer.domElement;
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseup', onMouseUp);
    canvas.removeEventListener('mouseleave', onMouseUp);
  }
  
  // Clean up Three.js resources
  cleanupResources();
  
  if (renderer) {
    renderer.dispose();
  }
});
</script>

<style scoped>
.controls-panel {
  display: none;
  position: absolute;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  font-size: 12px;
  max-width: 300px;
  max-height: calc(100vh);
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

.ceiling-status { /* Changed from floor-status */
  padding: 4px 8px;
  border-radius: 3px;
  font-weight: bold;
  margin-top: 4px;
}

.ceiling-status.valid { /* Changed from floor-status.valid */
  background-color: rgba(0, 255, 0, 0.2);
  color: #00ff00;
}

.ceiling-status.invalid { /* Changed from floor-status.invalid */
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

.main-canvas {
    display: block;
    margin: auto;
    width: 100%;
    height: 100vh;
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

.action-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: #007acc;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  z-index: 1000;
  transition: background-color 0.3s ease;
}

.action-btn:hover {
  background: #005a99;
}

.action-btn:active {
  background: #004477;
}

/* Ceiling-specific visual indicators */
.ceiling-mount-indicator {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 123, 204, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  z-index: 1000;
}

.ceiling-mount-indicator::before {
  content: "⬆️ ";
  margin-right: 4px;
}
</style>