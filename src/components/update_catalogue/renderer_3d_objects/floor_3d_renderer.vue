<template>
    roll = {{roll}} ||  &nbsp; pitch = {{pitch}} ||  &nbsp; yaw = {{yaw}}
  <div         class="main-canvas"
  ref="canvasContainer">
  
    <div id="viewer" ref="viewer">
      <div id="loading" v-if="loading">Loading 3D model and floor data...</div>
      </div>
  <button @click="generateBinaryMask" class="action-btn" style="">Generate Binary Mask</button>
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
const showGrid = ref(false);
const showRotationControls = ref(true);
const showFloorMask = ref(false);
const isDragging = ref(false);
const isRotating = ref(false);
const isOnValidFloor = ref(true);

const modelPosition = reactive({ x: 0, y: 0 });
const modelRotation = reactive({ y: 0 });

// Use props for floor angles - matching Python output exactly
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
let floorNormal = new THREE.Vector3();

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
  link.download = `model_binary_mask_${Date.now()}.png`;
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

function loadFloorMask() {
  const loader = new THREE.TextureLoader();
  loader.load(
    props.floorMaskUrl,
    (texture) => {
      floorMaskTexture = texture;
      
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
  
  const geometry = new THREE.PlaneGeometry(10, 10);
  const material = new THREE.MeshBasicMaterial({
    map: floorMaskTexture,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  });
  
  if (floorMaskMesh) scene.remove(floorMaskMesh);
  floorMaskMesh = new THREE.Mesh(geometry, material);
  
  // Apply floor angles using proper Euler order (ZYX = Rz * Ry * Rx)
  const euler = new THREE.Euler(
    THREE.MathUtils.degToRad(floorAngles.roll),
    THREE.MathUtils.degToRad(floorAngles.yaw),
    THREE.MathUtils.degToRad(-floorAngles.pitch),
    'ZYX'
  );
  floorMaskMesh.setRotationFromEuler(euler);
  
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

// Enhanced grid initialization with proper floor plane
function initializeEnhancedGrid() {
  gridGroup = new THREE.Group();
  scene.add(gridGroup);
  createFloorPlaneWithEulerAngles();
  createVisualGrid();
}

// Create floor plane using exact Python rotation order
function createFloorPlaneWithEulerAngles() {
  if (floorPlane) gridGroup.remove(floorPlane);
  
  // Calculate floor normal using same method as Python
  floorNormal = getFloorNormalFromEulerAngles();
  
  // Create invisible floor plane for dragging
  const floorGeometry = new THREE.PlaneGeometry(20, 20);
  const floorMaterial = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: 0,
    color: 0x888888,
    side: THREE.DoubleSide
  });
  
  floorPlane = new THREE.Mesh(floorGeometry, floorMaterial);
  
  // Apply rotation using same order as Python: Rz * Ry * Rx
  const euler = new THREE.Euler(
    THREE.MathUtils.degToRad(floorAngles.roll),
    THREE.MathUtils.degToRad(floorAngles.yaw),
    THREE.MathUtils.degToRad(-floorAngles.pitch),
    'ZYX'
  );
  floorPlane.setRotationFromEuler(euler);
  
  floorPlane.position.y = 0;
  floorPlane.name = 'dragFloor';
  gridGroup.add(floorPlane);
  
  // Update drag plane for intersection calculations
  updateDragPlane();
}

// Calculate floor normal from Euler angles (matching Python logic)
function getFloorNormalFromEulerAngles() {
  // Start with up vector (0, 1, 0)
  const normal = new THREE.Vector3(0, 1, 0);
  
  // Apply rotations in same order as Python: Rz * Ry * Rx
  const euler = new THREE.Euler(
    THREE.MathUtils.degToRad(floorAngles.roll),
    THREE.MathUtils.degToRad(floorAngles.yaw),
    THREE.MathUtils.degToRad(-floorAngles.pitch),
    'ZYX'
  );
  normal.applyEuler(euler);
  
  return normal;
}

// Update drag plane for proper intersection
function updateDragPlane() {
  const floorPoint = new THREE.Vector3(0, 0, 0);
  dragPlane.setFromNormalAndCoplanarPoint(floorNormal, floorPoint);
}

// Create visual grid aligned with floor plane
function createVisualGrid() {
  if (gridHelper) gridGroup.remove(gridHelper);
  
  // Create custom grid that follows the floor plane
  const gridSize = 10;
  const divisions = 20;
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
    color: 0x888888, 
    transparent: true, 
    opacity: 0.5 
  });
  
  gridHelper = new THREE.LineSegments(gridGeometry, gridMaterial);
  
  // Apply the same transformation as the floor plane
  const euler = new THREE.Euler(
    THREE.MathUtils.degToRad(floorAngles.roll),
    THREE.MathUtils.degToRad(floorAngles.yaw),
    THREE.MathUtils.degToRad(-floorAngles.pitch),
    'ZYX'
  );
  gridHelper.setRotationFromEuler(euler);
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
  rotationCircle.rotation.x = -Math.PI / 2;
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
  
  controls.enableRotate = false;
  controls.enableZoom = false;
  controls.enablePan = false;

  camera.position.set(10, 10, 10);
  controls.target.set(0, 0, 0);
  controls.update();
}

function initializeDragControls() {
  const canvas = renderer.domElement;
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('mouseleave', onMouseUp);
}

// Enhanced floor position validation with proper coordinate mapping
function isPositionOnFloor(worldPos) {
  if (!floorMaskImageData || !currentBackgroundTexture) return true; // Allow movement if no mask
  
  // Convert world position to normalized coordinates (-1 to 1)
  const normalizedX = worldPos.x / 5;
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
  return red > 128;
}

// Calculate floor height at any world position using the tilted plane
function getFloorHeightAtWorldPosition(worldPos) {
  // Use the floor normal to calculate height
  // Plane equation: normal.dot(point - planePoint) = 0
  // Solving for Y: y = -(normal.x * x + normal.z * z) / normal.y
  
  if (Math.abs(floorNormal.y) < 0.001) return 0; // Avoid division by zero
  
  return -(floorNormal.x * worldPos.x + floorNormal.z * worldPos.z) / floorNormal.y;
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

// Enhanced mouse move with proper floor plane constraint
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
      
      // Apply movement constraints (free movement in XZ on tilted plane)
      const newWorldPos = intersection.clone();
      
      // Update model position
      modelPosition.x = newWorldPos.x;
      modelPosition.y = newWorldPos.z; // Note: modelPosition.y represents Z in world space
      
      // Validate position is on floor mask
      isOnValidFloor.value = isPositionOnFloor(newWorldPos);
      
      updateModelPositionOnFloor();
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
    props.glbUrl, // Use prop instead of hardcoded URL
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
      
      // Position model on floor surface using proper calculation
      const initialPos = new THREE.Vector3(0, 0, 0);
      const floorHeight = getFloorHeightAtWorldPosition(initialPos);
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
  
  const distance = Math.max(fitHeightDistance, fitWidthDistance) * 5.0;

  camera.position.set(distance * 0.5, distance * 0.4, distance * 0.8);
  
  const modelWorldY = model.position.y + modelSize.y * 0.5;
  controls.target.copy(new THREE.Vector3(0, modelWorldY, 0));
  controls.update();
}

// Enhanced model position update with proper floor projection
function updateModelPositionOnFloor() {
  if (!model) return;
  
  // Update XZ position
  model.position.x = modelPosition.x;
  model.position.z = modelPosition.y;
  
  // Calculate height based on floor surface using proper plane equation
  const worldPos = new THREE.Vector3(modelPosition.x, 0, modelPosition.y);
  const floorHeight = getFloorHeightAtWorldPosition(worldPos);
  currentFloorHeight.value = floorHeight;
  
  // Position model on floor surface
  if (modelBoundingBox) {
    model.position.y = floorHeight - modelBoundingBox.min.y;
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
  /* top: 10px; */
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


.main-canvas {
    display: block;
    margin:auto;
    width:100%;
    height:100vh;;
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