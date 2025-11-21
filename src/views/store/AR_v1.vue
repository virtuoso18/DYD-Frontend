<template>
  <div class="ar-root" :data-mode="mode">
    <!-- Controls top -->
    <div class="controls top">
      <div class="ar_sec_navbar">
        <span @click="goBack" class="back-button">
          <svg
            width="6"
            height="10"
            viewBox="0 0 6 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="ar_sec_back_icon"
          >
            <path
              d="M4.75 0.75L0.75 4.75L4.75 8.75"
              stroke="#1A1A1A"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Back
        </span>
      </div>

      <button ref="startBtn" class="btn start">Start AR</button>

      <div class="right" v-if="placedModel">
        <label class="sr-only">Scale</label>
        <input
          type="range"
          min="0.2"
          max="3"
          step="0.01"
          v-model.number="scale"
          @input="applyScale"
          aria-label="Scale model"
        />
      </div>
    </div>

    <!-- Messages -->
    <div v-if="!isSecure" class="status error">
      Page must be served over HTTPS or localhost for AR.
    </div>
    <div v-else-if="!xrSupported" class="status error">
      WebXR immersive-ar not supported on this device/browser. Showing 3D
      preview.
    </div>
    <div v-else-if="!hitTestSupported" class="status warning">
      ⚠️ Hit-test not supported — AR placement limited.
    </div>
    <div v-else-if="loadingProduct" class="status loading">
      ⏳ Loading product...
    </div>
    <div v-else-if="loadingModel" class="status loading">
      ⏳ Loading 3D model...
    </div>
    <div v-else-if="statusMessage" class="status info">{{ statusMessage }}</div>

    <!-- Footer mode buttons -->
    <div class="footer-controls">
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :class="{ active: mode === 'move' }"
        @click="setMode('move')"
        title="Move: tap reticle to move"
      >
        <path
          d="M7.57365 9.72704L4.46408 12.8086C4.04948 13.2017 3.30954 14.2273 3.22025 15.1668C3.12635 16.1547 4.09309 17.572 4.46408 18.1146C5.43111 19.5287 5.82048 20.3134 6.95174 21.6518C7.56609 22.3786 9.22561 23.8274 11.9271 24.01C13.9437 24.1462 15.9511 24.1335 16.9024 24.01C17.5555 23.9251 19.1412 23.6562 20.6338 22.2413C22.1265 20.8265 22.4996 18.5076 22.4996 17.525V8.09236C22.4996 7.50282 22.1265 6.32374 20.6338 6.32374C19.1412 6.32374 18.7681 7.50282 18.7681 8.09236V12.2192M7.57365 15.1668V5.7342C7.57365 5.14466 7.9468 3.96558 9.4394 3.96558C10.9319 3.96558 11.3052 5.14466 11.3052 5.7342M11.3052 5.7342V11.04M11.3052 5.7342V3.37604C11.3052 2.7865 11.6782 1.60742 13.1709 1.60742C14.6635 1.60742 15.0366 2.7865 15.0366 3.37604V5.7342M15.0366 5.7342V11.04M15.0366 5.7342C15.0366 5.14466 15.4098 3.96558 16.9024 3.96558C18.3949 3.96558 18.7681 5.14466 18.7681 5.7342V8.6819"
          stroke="#1A1A1A"
          stroke-width="1.60714"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <svg
        width="24"
        height="21"
        viewBox="0 0 24 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :class="{ active: mode === 'rotate' }"
        @click="toggleRotateMode"
        title="Rotate: when active rotates Y only"
      >
        <path
          d="M20.5577 10.9888C23.7557 5.09219 22.2981 1.08962 16.8267 0.803711C12.8501 0.879632 8.74804 3.02224 5.47376 6.33692C2.72594 9.11864 0.0204015 13.1026 1.01361 16.8944C1.23292 17.7316 1.66052 18.3021 2.33602 18.8389C4.15129 20.2813 5.93307 20.4083 9.36476 19.5658C12.84 18.5098 14.9946 16.9189 16.8113 15.2912M16.8113 15.2912C16.8131 15.2895 16.815 15.2878 16.817 15.2861C16.8204 15.2831 16.8181 15.2773 16.8135 15.2773C16.8101 15.2773 16.8076 15.2809 16.8088 15.2841C16.8097 15.2865 16.8104 15.2889 16.8113 15.2912ZM16.8113 15.2912C17.2081 16.4647 16.9568 17.512 16.2735 19.5658"
          stroke="#1A1A1A"
          stroke-width="1.60714"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :class="{ active: mode === 'zoom' }"
        @click="toggleFullScreen"
        title="Fullscreen"
      >
        <path
          d="M8.57101 3.31865C8.57101 3.31865 4.32145 2.93738 3.6294 3.62942C2.93734 4.32146 3.31868 8.57101 3.31868 8.57101"
          stroke="#1A1A1A"
          stroke-width="1.60714"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8.57101 22.3949C8.57101 22.3949 4.32145 22.7763 3.6294 22.0842C2.93734 21.3921 3.31868 17.1426 3.31868 17.1426"
          stroke="#1A1A1A"
          stroke-width="1.60714"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M17.1436 3.31865C17.1436 3.31865 21.3932 2.93738 22.0852 3.62942C22.7772 4.32146 22.3959 8.57101 22.3959 8.57101"
          stroke="#1A1A1A"
          stroke-width="1.60714"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M17.1436 22.3949C17.1436 22.3949 21.3932 22.7763 22.0852 22.0842C22.7772 21.3921 22.3959 17.1426 22.3959 17.1426"
          stroke="#1A1A1A"
          stroke-width="1.60714"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <!-- Fallback 3D viewer -->
    <div v-if="!xrSupported || fallback" class="fallback" aria-hidden="false">
      <canvas ref="fallbackCanvas" class="fallback-canvas"></canvas>
      <div class="fallback-hint">Use mouse to rotate / wheel to zoom</div>
    </div>

    <!-- Invisible overlay for interaction -->
    <div
      class="interaction-layer"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @click="onClickLayer"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ARButton } from "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/webxr/ARButton.js";
import { RoomEnvironment } from "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/environments/RoomEnvironment.js";

// ============================================
// ROUTER & STORE
// ============================================
const route = useRoute();
const router = useRouter();
const store = useStore();

// ============================================
// REFS
// ============================================
const startBtn = ref(null);
const fallbackCanvas = ref(null);
const loadingModel = ref(false);
const loadingProduct = ref(false);
const statusMessage = ref("");
const xrSupported = ref(true);
const hitTestSupported = ref(true);
const fallback = ref(false);
const isSecure = ref(window.isSecureContext === true);

const placedModel = ref(null);
const scale = ref(1.0);
const mode = ref("rotateFree");

const productData = ref(null);
const modelDimensions = ref({
  width: 0.7,
  height: 1.2,
  depth: 0.6
});

// ============================================
// THREE.JS VARIABLES
// ============================================
let MODEL_PATH = "";
let ARbtn, bottomControl, renderer, scene, camera, reticle, shadowPlane, pivot, controller;
let hitTestSource, referenceSpace, cachedGLTF;

// Pointer tracking
let pointerDown = false;
let lastPointer = null;

// ============================================
// HELPER: Fix Material Encoding
// ============================================
function fixMaterialEncoding(mat) {
  if (!mat) return;
  if (Array.isArray(mat)) return mat.forEach(fixMaterialEncoding);
  if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
  if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
}

// ============================================
// HELPER: Warm URL (Preload)
// ============================================
async function warmUrl(url) {
  try {
    await fetch(url, { method: "GET", mode: "cors", cache: "force-cache" });
  } catch (e) {
    console.warn('Could not warm URL:', e);
  }
}

// ============================================
// HELPER: Create Placeholder Model
// ============================================
function createPlaceholderModel() {
  const g = new THREE.Group();
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.8 })
  );
  mesh.castShadow = mesh.receiveShadow = true;
  g.add(mesh);
  return g;
}

// ============================================
// FETCH PRODUCT DETAILS FROM API
// ============================================
async function fetchProductDetails() {
  loadingProduct.value = true;
  statusMessage.value = "Loading product...";
  
  try {
    const productId = route.params?.product_id;
    
    if (!productId) {
      throw new Error('Product ID not found in route parameters');
    }

    let token = localStorage.getItem('token') || 
               localStorage.getItem('authToken') || 
               sessionStorage.getItem('token') ||
               (store?.state?.auth?.token) ||
               (store?.state?.token);

    const apiUrl = `${store.state.root_api}product/api/product-details/${productId}/`;
    
    console.log('📡 Fetching from:', apiUrl);

    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: headers,
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to fetch product details');
    }

    // Extract dimensions
    const dimensions = result.data.dimensions || {};
    
    modelDimensions.value = {
      width: parseFloat(dimensions.width) || 0.7,
      height: parseFloat(dimensions.height) || 1.2,
      depth: parseFloat(dimensions.depth || dimensions.length) || 0.6
    };

    console.log('✅ Product Dimensions (meters):', modelDimensions.value);

    // Extract 3D model URL
    let modelUrl = null;
    
    if (result.data['3d_model']) {
      modelUrl = `${store.state.root_media_api}${result.data['3d_model']}`;
    } else if (result.data.glb_file) {
      modelUrl = result.data.glb_file;
    } else if (result.data.model_url) {
      modelUrl = result.data.model_url;
    } else if (result.data.file) {
      modelUrl = result.data.file;
    }

    if (!modelUrl) {
      throw new Error('No 3D model URL found in product data');
    }

    MODEL_PATH = modelUrl;
    productData.value = result.data;

    console.log('✅ Model URL:', MODEL_PATH);
    console.log('✅ Product Data Loaded');

    statusMessage.value = "";

  } catch (error) {
    console.error('❌ Error loading product details:', error);
    statusMessage.value = error.message || 'Failed to load product. Please try again.';
    MODEL_PATH = "https://kg45h2yp3w7qrn-8000.proxy.runpod.net/media/products/3d_models/c3.glb";
    
  } finally {
    loadingProduct.value = false;
  }
}

// ============================================
// CALCULATE MODEL SCALE BASED ON DIMENSIONS
// ============================================
function calculateModelScale(modelGeometry) {
  const box = new THREE.Box3().setFromObject(modelGeometry);
  const modelSize = box.getSize(new THREE.Vector3());

  if (modelSize.x === 0 || modelSize.y === 0 || modelSize.z === 0) {
    console.warn('⚠️ Invalid model geometry size');
    return { x: 1, y: 1, z: 1 };
  }

  const scaleFactors = {
    x: modelDimensions.value.width / modelSize.x,
    y: modelDimensions.value.height / modelSize.y,
    z: modelDimensions.value.depth / modelSize.z
  };

  console.log('📏 Model geometry size:', modelSize);
  console.log('📐 Scale factors:', scaleFactors);

  return scaleFactors;
}

// ============================================
// PRELOAD GLTF
// ============================================
async function preloadGLTF(url) {
  loadingModel.value = true;
  try {
    await warmUrl(url);
    const loader = new GLTFLoader();
    loader.setCrossOrigin("anonymous");
    
    const gltf = await new Promise((resolve, reject) =>
      loader.load(url, resolve, undefined, reject)
    );

    gltf.scene.traverse(
      (c) => c.isMesh && c.material && fixMaterialEncoding(c.material)
    );

    cachedGLTF = gltf;
    console.log('✅ GLTF loaded successfully');
    return gltf;

  } catch (error) {
    console.error('❌ Error loading GLTF:', error);
    throw error;
  } finally {
    loadingModel.value = false;
  }
}

// ============================================
// INITIALIZE THREE.JS
// ============================================
function initThree(domCanvas) {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: domCanvas || undefined,
  });
  renderer.xr.enabled = true;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    40
  );

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  pivot = new THREE.Group();
  scene.add(pivot);

  shadowPlane = new THREE.Mesh(
    new THREE.CircleGeometry(0.35, 64).rotateX(-Math.PI / 2),
    new THREE.ShadowMaterial({ opacity: 0.45 })
  );
  shadowPlane.receiveShadow = true;
  shadowPlane.visible = false;
  scene.add(shadowPlane);

  reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.08, 0.12, 64).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({
      color: 0x00ff66,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
    })
  );
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  reticle.position.set(0, 0, 0);
  scene.add(reticle);
  scene.add(camera);

  console.log('✅ Three.js initialized');
}

// ============================================
// SESSION START
// ============================================
async function onSessionStart() {
  const session = renderer.xr.getSession();
  try {
    referenceSpace = await session.requestReferenceSpace("local-floor");
  } catch {
    referenceSpace = await session.requestReferenceSpace("local");
  }

  renderer.xr.setReferenceSpace(referenceSpace);

  try {
    const viewer = await session.requestReferenceSpace("viewer");
    hitTestSource = await session.requestHitTestSource({ space: viewer });
    hitTestSupported.value = !!hitTestSource;
  } catch {
    hitTestSource = null;
    hitTestSupported.value = false;
  }

  controller = renderer.xr.getController(0);
  controller.addEventListener("select", onSelectTap);
  
  bottomControl = document.getElementsByClassName("footer-controls")[0];
  if (bottomControl) {
    bottomControl.style.setProperty("display", "flex");
  }
  
  scene.add(controller);
  
  if (ARbtn) {
    ARbtn.style.setProperty("display", "none", "important");
    ARbtn.style.setProperty("opacity", "0", "important");
    ARbtn.style.setProperty("visibility", "hidden", "important");
    ARbtn.style.setProperty("pointer-events", "none", "important");
  }

  console.log('✅ AR Session started');
}

// ============================================
// MODEL PLACEMENT
// ============================================
async function onSelectTap() {
  if (!cachedGLTF) {
    try {
      await preloadGLTF(MODEL_PATH);
    } catch {
      cachedGLTF = { scene: createPlaceholderModel() };
    }
  }
  if (!placedModel.value) await placeModelFromReticle();
}

async function placeModelFromReticle() {
  loadingModel.value = true;
  
  try {
    if (!cachedGLTF) {
      try {
        await preloadGLTF(MODEL_PATH);
      } catch {
        console.warn('Failed to load GLB, using placeholder');
        cachedGLTF = { scene: createPlaceholderModel() };
      }
    }

    const modelGroup = cachedGLTF?.scene?.clone(true) || createPlaceholderModel();
    
    if (cachedGLTF?.scene) {
      const scaleFactors = calculateModelScale(cachedGLTF.scene);
      modelGroup.scale.set(scaleFactors.x, scaleFactors.y, scaleFactors.z);
      console.log('✅ Applied dimension-based scaling:', modelGroup.scale);
    } else {
      modelGroup.scale.setScalar(scale.value);
    }

    modelGroup.position.set(0, 0, 0);
    modelGroup.rotation.set(0, 0, 0);

    while (pivot.children.length) {
      pivot.remove(pivot.children[0]);
    }
    pivot.add(modelGroup);

    movePivotToReticle(true);
    placedModel.value = modelGroup;
    shadowPlane.visible = true;

    console.log('✅ Model placed with dimensions:', modelDimensions.value);

  } catch (error) {
    console.error('❌ Error placing model:', error);
    statusMessage.value = 'Failed to place model';
  } finally {
    loadingModel.value = false;
  }
}

// ============================================
// MOVE PIVOT TO RETICLE
// ============================================
function movePivotToReticle(forceApprox = false) {
  if (!reticle.userData.worldMatrix) {
    console.warn('⚠️ No reticle world matrix available');
    return;
  }

  const wm = reticle.userData.worldMatrix;
  
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  
  wm.decompose(position, quaternion, scale);
  
  pivot.position.copy(position);
  pivot.quaternion.copy(quaternion);
  pivot.scale.copy(scale);

  if (placedModel.value) {
    let minY = Infinity;

    placedModel.value.traverse((child) => {
      if (child.isMesh) {
        const geometry = child.geometry;
        if (!geometry) return;

        const pos = geometry.attributes.position;
        if (!pos) return;

        for (let i = 0; i < pos.count; i++) {
          const vertex = new THREE.Vector3().fromBufferAttribute(pos, i);
          vertex.applyMatrix4(child.matrixWorld);
          if (vertex.y < minY) minY = vertex.y;
        }
      }
    });

    if (minY !== Infinity) {
      pivot.position.y -= minY;
      pivot.position.y += 0.001;
      
      console.log('📍 Model positioned - Min Y:', minY);
    }
  }

  shadowPlane.position.copy(pivot.position);
  shadowPlane.position.y = pivot.position.y - 0.002;
  shadowPlane.visible = true;

  console.log('✅ Pivot moved to reticle:', pivot.position);
}

// ============================================
// POINTER EVENTS
// ============================================
function onPointerDown(e) {
  pointerDown = true;
  lastPointer = { x: e.clientX, y: e.clientY };
}

function onPointerMove(e) {
  if (!pointerDown || !placedModel.value) return;
  const dx = e.clientX - lastPointer.x;
  lastPointer.x = e.clientX;
  lastPointer.y = e.clientY;

  const rotSensitivity = 0.0052;
  placedModel.value.rotation.y += dx * rotSensitivity;
}

function onPointerUp() {
  pointerDown = false;
  lastPointer = null;
}

function onClickLayer(e) {
  if (!reticle.visible) return;
  if (!reticle.userData.worldMatrix) return;

  const canvas = renderer.domElement;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const mouse = new THREE.Vector2(
    (x / canvas.clientWidth) * 2 - 1,
    -(y / canvas.clientHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  
  const intersects = raycaster.intersectObject(reticle);
  
  if (intersects.length > 0) {
    console.log('✅ Reticle clicked - Placing/Moving model');
    if (placedModel.value) {
      movePivotToReticle(true);
    } else {
      onSelectTap();
    }
  }
}

// ============================================
// RENDER LOOP
// ============================================
function startRenderLoop() {
  renderer.setAnimationLoop((time, frame) => {
    if (frame) {
      const session = renderer.xr.getSession();
      const xrRef = renderer.xr.getReferenceSpace();
      let found = false;
      
      try {
        if (session && xrRef && hitTestSource) {
          const hits = frame.getHitTestResults(hitTestSource);
          
          if (hits?.length > 0) {
            const hit = hits[0];
            const pose = hit.getPose(xrRef);
            
            if (pose) {
              const mat = new THREE.Matrix4().fromArray(pose.transform.matrix);
              
              reticle.matrix.copy(mat);
              reticle.matrixAutoUpdate = false;
              reticle.updateMatrixWorld();
              
              reticle.userData.worldMatrix = mat;
              reticle.visible = true;
              
              shadowPlane.position.setFromMatrixPosition(mat);
              shadowPlane.rotation.x = -Math.PI / 2;
              shadowPlane.visible = true;
              
              found = true;
            }
          }
        }
      } catch (e) {
        console.warn('Hit test error:', e);
      }

      if (!found) {
        reticle.visible = false;
        shadowPlane.visible = false;
        if (reticle.userData.worldMatrix) {
          delete reticle.userData.worldMatrix;
        }
      }
    }

    renderer.render(scene, camera);
  });
}

// ============================================
// SCALE APPLICATION
// ============================================
function applyScale() {
  if (placedModel.value && cachedGLTF?.scene) {
    try {
      const baseScale = calculateModelScale(cachedGLTF.scene);

      placedModel.value.scale.set(
        baseScale.x * scale.value,
        baseScale.y * scale.value,
        baseScale.z * scale.value
      );

      console.log('✅ Scale applied:', scale.value);
    } catch (error) {
      console.error('❌ Error applying scale:', error);
    }
  }
}

// ============================================
// MODE FUNCTIONS
// ============================================
function setMode(newMode) {
  mode.value = newMode;
  console.log('Mode set to:', newMode);
}

function toggleRotateMode() {
  mode.value = mode.value === 'rotate' ? 'rotateFree' : 'rotate';
}

function toggleFullScreen() {
  if (bottomControl) {
    const isHidden = bottomControl.style.display === 'none';
    bottomControl.style.setProperty("display", isHidden ? "flex" : "none");
  }
}

function goBack() {
  try {
    router.back();
  } catch {
    window.history.back();
  }
}

// ============================================
// CLEANUP
// ============================================
function cleanup() {
  try {
    renderer?.xr?.getSession()?.end();
  } catch {}
  if (controller) controller.removeEventListener("select", onSelectTap);
  try {
    if (renderer?.domElement && renderer.domElement.parentNode)
      renderer.domElement.parentNode.removeChild(renderer.domElement);
  } catch {}
  renderer?.setAnimationLoop(null);
  renderer?.dispose?.();
  if (scene)
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose?.();
      if (obj.material) {
        Array.isArray(obj.material)
          ? obj.material.forEach((m) => m.dispose?.())
          : obj.material.dispose?.();
      }
    });
}

// ============================================
// MOUNTED LIFECYCLE
// ============================================
onMounted(async () => {
  console.log('🚀 AR Component Mounted');
  isSecure.value = window.isSecureContext === true;

  if (!isSecure.value) {
    console.error('❌ Not secure context');
    return;
  }

  try {
    const supported =
      navigator.xr && (await navigator.xr.isSessionSupported("immersive-ar"));
    if (!supported) {
      xrSupported.value = false;
      fallback.value = true;
      console.warn('⚠️ WebXR immersive-ar not supported');
    }
  } catch (e) {
    xrSupported.value = false;
    fallback.value = true;
    console.warn('⚠️ WebXR check failed:', e);
  }

  // Initialize Three.js
  initThree(fallbackCanvas.value);

  // Fetch product details first
  await fetchProductDetails();

  // Then preload the model
  try {
    if (MODEL_PATH) {
      await preloadGLTF(MODEL_PATH);
    } else {
      console.warn('No model path available, using placeholder');
      cachedGLTF = { scene: createPlaceholderModel() };
    }
  } catch (error) {
    console.error('Error preloading GLTF:', error);
    cachedGLTF = { scene: createPlaceholderModel() };
  }

  // Setup AR button
  if (startBtn.value && typeof ARButton !== "undefined" && xrSupported.value) {
    ARbtn = ARButton.createButton(renderer, {
      requiredFeatures: ["hit-test"],
      optionalFeatures: [
        "dom-overlay",
        "local-floor",
        "transient-hit-test",
        "light-estimation",
      ],
      domOverlay: { root: document.body },
    });
    ARbtn.style = "";
    ARbtn.id = "ARButton";
    startBtn.value.replaceWith(ARbtn);
    console.log('✅ AR Button created');
  }

  renderer.xr.addEventListener("sessionstart", onSessionStart);
  startRenderLoop();

  window.addEventListener("resize", () => {
    if (renderer && camera) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  });

  console.log('✅ AR initialization complete');
});

// ============================================
// BEFORE UNMOUNT LIFECYCLE
// ============================================
onBeforeUnmount(() => {
  console.log('🛑 AR Component Unmounting');
  cleanup();
});
</script>

<style scoped>
.ar_sec_navbar {
  width: 100%;
  padding: 20px 20px;
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: white;
  justify-content: center;
  z-index: 10001;
}

.back-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-weight: 600;
  color: #1A1A1A;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background-color: #f0f0f0;
}

.ar_sec_back_icon {
  margin-right: 6px;
  transition: transform 0.2s ease;
}

.back-button:active .ar_sec_back_icon {
  transform: translateX(-2px);
}

.ar-root {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  touch-action: none;
  user-select: none;
}

.controls.top {
  position: fixed;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  z-index: 10001;
}

.btn {
  padding: 8px 12px;
  border-radius: 10px;
  background: #fff;
  border: 0;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  display: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);
}

.btn:active {
  transform: scale(0.98);
}

.right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.right input[type="range"] {
  width: 120px;
  height: 4px;
  border-radius: 2px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.right input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #00c16b;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.right input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #00c16b;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.status {
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  padding: 12px 18px;
  border-radius: 8px;
  font-weight: 600;
  color: white;
  max-width: 90%;
  text-align: center;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.status.info {
  background: rgba(0, 0, 0, 0.7);
}

.status.loading {
  background: rgba(0, 120, 212, 0.8);
}

.status.warning {
  background: rgba(255, 152, 0, 0.8);
}

.status.error {
  background: #ff4444;
}

.footer-controls {
  position: fixed;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
  z-index: 10003;
  background-color: white;
  height: 80px;
  width: 100%;
  justify-content: center;
  align-items: center;
  display: none;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.footer-controls svg {
  width: 26px;
  height: 26px;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 8px;
  border-radius: 8px;
  color: #1A1A1A;
}

.footer-controls svg:hover {
  background-color: #f0f0f0;
  transform: scale(1.1);
}

.footer-controls svg.active {
  background-color: rgba(0, 200, 100, 0.2);
  color: #00c16b;
}

.fallback {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: #000;
}

.fallback-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.fallback-hint {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  z-index: 10000;
  pointer-events: none;
  font-size: 14px;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.7);
  padding: 8px 16px;
  border-radius: 6px;
}

.interaction-layer {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: transparent;
  touch-action: none;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>