<template>

  <!-- <br>
  <br>
  <br>
  {{CHAIR_MODEL}}<br>
  <br> -->
 <!-- {{FLOOR_MASK}}<br> -->
<!-- {{BASE_ROOT_MAIN_IMAGE}}<br> -->
<!-- {{TARGET_DIMS}} <br> -->
<!-- {{ POINTCLOUD }} -->
  <div>

    
    <!-- ✅ NO-MODEL fallback — just the image, no 3D controls -->
    <div
      v-if="!CHAIR_MODEL || CHAIR_MODEL === ''"
      class="text-center flex items-center h-full justify-center text-gray-600"
    >
      <img
        :src="BASE_ROOT_MAIN_IMAGE"
        alt=""
        class="max-w-full max-h-[54vh] md:max-h-[83vh] mx-auto"
      />
    </div>

    <!-- ✅ 3D EDITOR — always rendered so refs stay alive, just hidden when no model -->
    <div class="editor-wrapper" v-show="CHAIR_MODEL && CHAIR_MODEL !== ''">
    
    <!-- ── END DEBUG PANEL ── -->

    <div class="room-container">
    <!-- ✅ LOADING OVERLAY -->
    <!-- ✅ LOADING OVERLAY -->
<div v-if="isLoading || modelLoading" class="scanning-loading-overlay">
  <div
    class="loading-screen"
    :style="{ backgroundImage: BASE_ROOT_MAIN_IMAGE ? `url(${BASE_ROOT_MAIN_IMAGE})` : 'none' }"
  >
    <div class="wave-overlay"></div>
    <div class="loading-text">
      <div class="process-text">
        {{ modelLoading ? 'Loading 3D Model...' : loadingText }}
      </div>

      <!-- ✅ Progress bar — only shown during model load -->
      <div v-if="modelLoading" style="margin-top: 16px;">
        <div style="
          width: 220px;
          height: 6px;
          background: rgba(255,255,255,0.2);
          border-radius: 99px;
          overflow: hidden;
        ">
          <div :style="{
            width: modelLoadProgress + '%',
            height: '100%',
            background: '#3b82f6',
            borderRadius: '99px',
            transition: 'width 0.2s ease'
          }"></div>
        </div>
        <div style="margin-top: 8px; font-size: 13px; opacity: 0.8;">
          {{ modelLoadProgress }}%
        </div>
      </div>

    </div>
  </div>
</div>
      <img ref="roomImage" :src="BASE_ROOT_MAIN_IMAGE" class="room-image" @load="initThree" />
      <canvas
        ref="maskOverlayCanvas"
        class="mask-overlay"
        :style="{ opacity: maskOpacity, display: debugMask ? 'block' : 'none' }"
      ></canvas>
      <div ref="threeContainer" class="three-layer"></div>
      <!-- <div class="hint" v-if="chairLoaded && !isDraggingRef">
        🖱 Click &amp; drag the chair to reposition it on the floor
      </div> -->
      <div class="status-badge" v-if="!planeReady">
        {{ plyReady && maskReady ? '🔄 Fitting floor plane…' : '⏳ Loading assets…' }}
      </div>
      
      <span   style="
            background: white;
            border-radius: 5px;
            padding-left: 5px;
            padding-right: 5px;
            font-size: 12px;
            font-weight: 600;
            position: absolute;
            z-index: 5;        /* ✅ ADD THIS — sits above the three-layer canvas */
  line-height: 1.4;  /* ✅ ADD THIS — fixes text clipping at top */
            bottom: 10px;
            left: 10px;
  ">
        
        W-{{ TARGET_DIMS?.width }}m X H-{{TARGET_DIMS?.height}}m X D-{{ TARGET_DIMS?.depth }}m
      </span>
    </div>
    <!-- ── DEBUG PANEL ── -->
    <div class="debug-panel" v-if="debug">
      <div class="debug-title">🔧 Debug Toggles & Status</div>

      <label class="debug-row">
        <span>Floor Mask Overlay</span>
        <input type="checkbox" v-model="debugMask" @change="toggleMaskOverlay" />
        <span class="badge" :class="debugMask ? 'on' : 'off'">{{ debugMask ? 'ON' : 'OFF' }}</span>
      </label>

      <label class="debug-row">
        <span>Point Cloud</span>
        <input type="checkbox" v-model="debugPointCloud" @change="togglePointCloud" />
        <span class="badge" :class="debugPointCloud ? 'on' : 'off'">{{
          debugPointCloud ? 'ON' : 'OFF'
        }}</span>
      </label>

      <label class="debug-row">
        <span>Floor Plane 3D</span>
        <input type="checkbox" v-model="debugFloorMesh" @change="toggleFloorMesh" />
        <span class="badge" :class="debugFloorMesh ? 'on' : 'off'">{{
          debugFloorMesh ? 'ON' : 'OFF'
        }}</span>
      </label>

      <label class="debug-row">
        <span>Chair Rotation</span>
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          v-model.number="chairRotation"
          @input="updateChairRotation"
        />
        <span class="val">{{ chairRotation }}°</span>
      </label>

      <label class="debug-row">
        <span>Mask Opacity</span>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          v-model.number="maskOpacity"
          :disabled="!debugMask"
        />
        <span class="val">{{ Math.round(maskOpacity * 100) }}%</span>
      </label>

      <div class="debug-status">
        <div class="status-row">
          <span>Mask:</span>
          <span :class="maskReady ? 'ok' : 'err'">{{ maskReady ? '✅ ready' : '⏳…' }}</span>
        </div>
        <div class="status-row">
          <span>Point cloud:</span>
          <span :class="plyReady ? 'ok' : 'err'">{{ plyReady ? '✅ ready' : '⏳…' }}</span>
        </div>
        <div class="status-row">
          <span>Floor plane:</span>
          <span :class="planeReady ? 'ok' : 'err'">{{ planeReady ? '✅ fitted' : '⏳…' }}</span>
        </div>
        <div class="status-row">
          <span>Chair:</span>
          <span :class="chairLoaded ? 'ok' : 'err'">{{ chairLoaded ? '✅ yes' : '⏳…' }}</span>
        </div>
        <div class="status-row">
          <span>Floor pts used:</span>
          <span class="coord">{{ floorPtCount }}</span>
        </div>
        <div class="status-row">
          <span>Floor Y (centroid):</span>
          <span class="coord">{{ floorCentroidY.toFixed(4) }} m</span>
        </div>
        <div class="status-row">
          <span>Floor normal:</span>
          <span class="coord">{{ floorNormalDisplay }}</span>
        </div>
        <div class="status-row">
          <span>Tilt angle:</span>
          <span class="coord">{{ tiltAngleDeg.toFixed(2) }}°</span>
        </div>
        <div class="status-row" v-if="lastHit">
          <span>Drag hit:</span>
          <span class="coord">x:{{ lastHit.x }} y:{{ lastHit.y }} z:{{ lastHit.z }}</span>
        </div>
        <div class="status-row" v-if="lastHit">
          <span>Mask check:</span>
          <span :class="lastMaskResult ? 'ok' : 'err'">{{
            lastMaskResult ? '✅ on floor' : '🚫 off floor'
          }}</span>
        </div>
      </div>
    </div>
    <!-- ── BOTTOM ACTION BAR ── -->
     
    <a-row>
      <a-col :lg="0" :md="0" :sm="24" :xs="24">
      <label class="" style="display:flex;gap:5px;" >
          <span>Furniture Rotation</span>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            v-model.number="chairRotation"
            @input="updateChairRotation"
          />
          <span style="display:flex;gap:5px;">{{ chairRotation }}°</span>
        </label>
      </a-col>

    </a-row>
      

  <div class="flex justify-between items-center py-2 px-2 bg-white w-full gap-2">
    
    <!-- Left: Recenter -->
    <button
      @click="resetChairPosition"
      :disabled="!chairLoaded || !planeReady"
      style="
        font-family: Poppins;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0%;
        text-align: center;
        background: #e5e7eb;
        padding: 4px 24px;
        border-radius: 6px;
      "
    >
      Recenter
    </button>
 
    <a-row>
      <a-col :lg="24" :md="24" :sm="0" :xs="0">
<label class="" style="display:flex;gap:5px;" >
          <span>Furniture Rotation</span>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            v-model.number="chairRotation"
            @input="updateChairRotation"
          />
          <span style="display:flex;gap:5px;">{{ chairRotation }}°</span>
        </label>
      </a-col>

    </a-row>
    <!-- Right: Finalise Changes -->
    <a-button
      type="primary"
      @click="$emit('Apply-Changes', 'item-replacement-3d-renderer')"
      :disabled="!chairLoaded || !planeReady"
      style="padding: 4px 12px; border-radius: 6px;"
    >
      Finalise Changes
    </a-button>
  </div>
  </div>
  </div>

</template>

<script>
import { markRaw } from 'vue'
import * as THREE from 'three'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default {
  name: 'itemre_placement_renderer_3d_ptcld',
  props: {
    isLoading: { type: Boolean, default: false },

    // Camera intrinsics
    CAM_IMG_W: Object, // : 1600,
    CAM_IMG_H: Object, // : 1200,
    CAM_FX: Object, // : 1.3832 * 1600,
    CAM_FY: Object, // : 1.8443 * 1200,
    CAM_CX: Object, // : 0.5 * 1600,
    CAM_CY: Object, // : 0.5 * 1200,
    CAM_Z_SIGN: Object, // : -1,
    MASK_ERODE_PX: Object, // : 10,

    CAM_FOV_V: Object, // : 30.0,
    // Asset paths
    POINTCLOUD: Object, // : 'pointcloud_voxel_0_1m.ply',
    CHAIR_MODEL: Object, // : 'sofa_1.glb',
    FLOOR_MASK: Object, // : 'floor_mask.png',
    
    BASE_ROOT_MAIN_IMAGE: Object, // : '/room.jpg',
    // Chair target dimensions
    TARGET_DIMS: Object, // : { width: 0.63, height: 0.94, depth: 0.57 },

    debug: Boolean,
    product_id: { type: String, required: true },
  },

  data() {
    return {
      loadingText: 'Initializing...',
      // isLoading: false,
      modelLoadProgress: 0,    // 0–100
      modelLoading: false,     // separate from API isLoading

      // Template refs
      animationFrameId: null,

      roomImage: null,
      threeContainer: null,
      maskOverlayCanvas: null,

      // UI state
      debugMask: false,
      debugPointCloud: false,
      debugFloorMesh: false,
      maskOpacity: 0.5,
      maskReady: false,
      plyReady: false,
      planeReady: false,
      chairLoaded: false,
      isDraggingRef: false,
      chairRotation: 0,
      lastHit: null,
      lastMaskResult: false,
      floorPtCount: 0,
      floorCentroidY: 0,

      //   // Camera intrinsics
      //   CAM_IMG_W: 1600,
      //   CAM_IMG_H: 1200,
      //   CAM_FX: 1.3832 * 1600,
      //   CAM_FY: 1.8443 * 1200,
      //   CAM_CX: 0.5 * 1600,
      //   CAM_CY: 0.5 * 1200,
      //   CAM_Z_SIGN: -1,
      //   MASK_ERODE_PX: 10,

      //   CAM_FOV_V: 30.0,
      //   // Asset paths
      //   POINTCLOUD: 'pointcloud_voxel_0_1m.ply',
      //   CHAIR_MODEL: 'sofa_1.glb',
      //   FLOOR_MASK: 'floor_mask.png',
      //   BASE_ROOT_MAIN_IMAGE: '/room.jpg',

      //   // Chair target dimensions
      //   TARGET_DIMS: { width: 0.63, height: 0.94, depth: 0.57 },
      CHAIR_SCALE_FACTOR: 1.0,

      // Three.js objects - scales
      chairBaseScaleX: 1,
      chairBaseScaleY: 1,
      chairBaseScaleZ: 1,

      // Floor normal display
      _floorNX: 0,
      _floorNY: 1,
      _floorNZ: 0,

      // THREE.JS OBJECTS — initialize as null, wrap with markRaw() in setup
      scene: null,
      camera: null,
      renderer: null,
      pointCloudObj: null,
      chair: null,
      chairHalfH: 0,
      floorPlaneMesh: null,
      floorMesh3D: null,
      sofaSpotLight: null,
      sofaSpotTarget: null,
      chairSpotLight: null,
      chairSpotTarget: null,
      shadowReceiverMesh: null,

      // Floor plane data
      floorPlaneTHREE: null,
      floorNormal3: null,
      floorCentroid3: null,

      // PLY raw data
      plyPositions: null,
      plyPointCount: 0,

      // Mask data
      maskCanvas: null,
      maskCtx: null,
      erodedMask: null,

      // Drag state
      isDragging: false,
      dragOffset: null,
      raycaster: null,
      mouse: null,
    }
  },
emits: ['update:isLoading', 'insufficient-credits', 'add-3d-furniture-to-room-start-polling', 'rendered-comfyui-workflow'],

  computed: {
   loadingProxy: {
  get() { return this.isLoading },
  set(val) { this.$emit('update:isLoading', val) }
},

    floorNormalDisplay() {
      return `(${this._floorNX.toFixed(4)}, ${this._floorNY.toFixed(4)}, ${this._floorNZ.toFixed(4)})`
    },
    tiltAngleDeg() {
      const dot = this._floorNY
      return (Math.acos(Math.min(1, Math.abs(dot))) * 180) / Math.PI
    },
  },

  created() {
    // Initialize THREE.js objects with markRaw() in created hook
    this.floorNormal3 = markRaw(new THREE.Vector3(0, 1, 0))
    this.floorCentroid3 = markRaw(new THREE.Vector3())
    this.dragOffset = markRaw(new THREE.Vector3())
    this.raycaster = markRaw(new THREE.Raycaster())
    this.mouse = markRaw(new THREE.Vector2())
  },
  mounted() {
    this.$nextTick(() => {
      this.roomImage = this.$refs.roomImage
      this.threeContainer = this.$refs.threeContainer
      this.maskOverlayCanvas = this.$refs.maskOverlayCanvas

      if (this.roomImage) {
        if (this.roomImage.complete && this.roomImage.naturalWidth > 0) {
          // Image already cached/loaded
          this.initThree()
        }
        // else: @load="initThree" on the <img> will fire
      }
    })
  },

  methods: {
   resolveModelUrl(url) {
  if (!url) return url
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  
  const base = this.$store.state.root_media_api
  const resolved = `${base}${url}`
  console.log('🔗 Resolved model URL:', resolved)  // ✅ Add this to debug
  return resolved
},
   reloadChair() {
   // ✅ Safety guard — scene must exist
  if (!this.scene) {
    console.warn('⚠️ reloadChair called but scene is null — aborting')
    return
  }

  this.isDragging = false
  this.isDraggingRef = false
  this.chairLoaded = false

  if (this.chair) {
    this.scene.remove(this.chair)
    this.chair.traverse((child) => {
      if (child.geometry) child.geometry.dispose()
      if (child.material) {
        Array.isArray(child.material)
          ? child.material.forEach(m => m.dispose())
          : child.material.dispose()
      }
    })
    this.chair = null
  }

  this.chairLoaded = false
  this.chairRotation = 0
  this.modelLoadProgress = 0
  this.modelLoading = true

  const modelUrl = this.resolveModelUrl(this.CHAIR_MODEL)

  new GLTFLoader().load(
    modelUrl,
    (gltf) => {
      const innerMesh = gltf.scene

      innerMesh.traverse((n) => {
        if (n.isMesh) { n.castShadow = true; n.receiveShadow = true }
      })

      innerMesh.position.set(0, 0, 0)
      innerMesh.rotation.set(0, 0, 0)
      innerMesh.scale.set(1, 1, 1)
      innerMesh.updateMatrixWorld(true)

      const flippedBox = new THREE.Box3().setFromObject(innerMesh)
      const flippedSize = new THREE.Vector3()
      flippedBox.getSize(flippedSize)

      const fovRad = (this.CAM_FOV_V * Math.PI) / 180
      const fy_threejs = this.CAM_IMG_H / 2 / Math.tan(fovRad / 2)
      const focalCorrection = this.CAM_FY / fy_threejs

      const sx = flippedSize.x > 0 ? (this.TARGET_DIMS.width  * this.CHAIR_SCALE_FACTOR * focalCorrection) / flippedSize.x : 1
      const sy = flippedSize.y > 0 ? (this.TARGET_DIMS.height * this.CHAIR_SCALE_FACTOR * focalCorrection) / flippedSize.y : 1
      const sz = flippedSize.z > 0 ? (this.TARGET_DIMS.depth  * this.CHAIR_SCALE_FACTOR * focalCorrection) / flippedSize.z : 1
      innerMesh.scale.set(sx, sy, sz)
      innerMesh.updateMatrixWorld(true)

      this.chairBaseScaleX = sx
      this.chairBaseScaleY = sy
      this.chairBaseScaleZ = sz

      const pivotGroup = new THREE.Group()
      pivotGroup.add(innerMesh)
      this.scene.add(pivotGroup)

      // ✅ FIX: bottom-align the mesh inside the pivot (was missing)
      const scaledBox = new THREE.Box3().setFromObject(pivotGroup)
      innerMesh.position.y -= scaledBox.min.y
      innerMesh.updateMatrixWorld(true)

      this.chairHalfH = 0.001
      this.chair = markRaw(pivotGroup)
      this.chairLoaded = true

      this.modelLoadProgress = 100
      this.modelLoading = false

      if (this.planeReady) {
        this.placeChairOnFloor()
      }
      console.log('✅ Chair swapped:', this.CHAIR_MODEL)
    },
    (xhr) => {
      if (xhr.total > 0) {
        this.modelLoadProgress = Math.round((xhr.loaded / xhr.total) * 100)
      }
    },
    (err) => {
      console.error('❌ Chair reload failed:', err)
      this.modelLoading = false
    }
  )
},
    getRenderedImageRect() {
      const img = this.$refs.roomImage;
      if (!img) return { width: 0, height: 0, offsetX: 0, offsetY: 0 };

      const containerW = img.clientWidth;
      const containerH = img.clientHeight;
      const naturalW   = img.naturalWidth;
      const naturalH   = img.naturalHeight;

      if (!naturalW || !naturalH) return { width: containerW, height: containerH, offsetX: 0, offsetY: 0 };

      const imgAspect       = naturalW / naturalH;
      const containerAspect = containerW / containerH;

      let renderedW, renderedH, offsetX, offsetY;

      if (imgAspect > containerAspect) {
        // Image is wider than container — letterboxed top/bottom
        renderedW = containerW;
        renderedH = containerW / imgAspect;
        offsetX   = 0;
        offsetY   = (containerH - renderedH) / 2;
      } else {
        // Image is taller than container — pillarboxed left/right
        renderedH = containerH;
        renderedW = containerH * imgAspect;
        offsetX   = (containerW - renderedW) / 2;
        offsetY   = 0;
      }

      return {
        width:   Math.round(renderedW),
        height:  Math.round(renderedH),
        offsetX: Math.round(offsetX),
        offsetY: Math.round(offsetY),
      };
    },
    
    resetChairPosition() {
  if (!this.chair || !this.planeReady) return;

  // Reset user rotation
  this.chairRotation = 0;

  // Place chair back at floor centroid
  this.placeChairOnFloor(
    this.floorCentroid3.x,
    this.floorCentroid3.z
  );

  console.log('✅ Chair recentered to floor centroid');
},

 downloadImages(compositeBlob, maskBlob) {

    // ---- Download Composite Image ----
    const compositeUrl = URL.createObjectURL(compositeBlob);
    const compositeLink = document.createElement('a');
    compositeLink.href = compositeUrl;
    compositeLink.download = 'composite_image.png';
    document.body.appendChild(compositeLink);
    compositeLink.click();
    document.body.removeChild(compositeLink);
    URL.revokeObjectURL(compositeUrl);


    // ---- Download Binary Mask ----
    const maskUrl = URL.createObjectURL(maskBlob);
    const maskLink = document.createElement('a');
    maskLink.href = maskUrl;
    maskLink.download = 'binary_mask.png';
    document.body.appendChild(maskLink);
    maskLink.click();
    document.body.removeChild(maskLink);
    URL.revokeObjectURL(maskUrl);
  },
    async renderItem() {
  if (!this.chair || !this.renderer || !this.scene || !this.camera) {
    console.warn('Model or scene not ready');
    return;
  }

  try {
    // Capture current chair transform before anything changes
    let currentPosition = this.chair.position.clone();
    let currentRotation = this.chair.rotation.clone();
    let currentScale    = this.chair.scale.clone();

    console.log(`📸 CAPTURED chair state - Position: x=${currentPosition.x.toFixed(2)}, y=${currentPosition.y.toFixed(2)}, z=${currentPosition.z.toFixed(2)}`);
    console.log(`📸 CAPTURED chair state - Rotation Y: ${currentRotation.y.toFixed(2)} rad (${THREE.MathUtils.radToDeg(currentRotation.y).toFixed(2)}°)`);

    // Force a render cycle
    await this.$nextTick();
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }

    // Restore in case $nextTick disturbed anything
    this.chair.position.copy(currentPosition);
    this.chair.rotation.copy(currentRotation);
    this.chair.scale.copy(currentScale);

    this.isDraggingRef = false;
    this.loadingProxy = true;
    this.loadingText  = 'Rendering Item...';

    const roomId  = this.$route.params.id;
    const prod_id = this.product_id;
    const url     = `${this.$store.state.root_api}engine/inpaint-item-ref/`;

    // Use the Three.js canvas dimensions
    const canvas      = this.renderer.domElement;
    let   renderWidth  = canvas.width;
    let   renderHeight = canvas.height;

    if (renderWidth === 0 || renderHeight === 0) {
      console.warn('Canvas not properly sized, falling back to room image dimensions');
      const img = this.$refs.roomImage;
      renderWidth  = img ? img.naturalWidth  || img.clientWidth  || 800 : 800;
      renderHeight = img ? img.naturalHeight || img.clientHeight || 600 : 600;
    }

    console.log(`Rendering at dimensions: ${renderWidth}x${renderHeight}`);

    this.loadingText = 'Creating composite image...';
    const compositeBlob = await this.createCompositeImageBlob(renderWidth, renderHeight, currentPosition, currentRotation, currentScale);

    if (!compositeBlob || compositeBlob.size === 0) {
      throw new Error('Failed to create composite image blob');
    }

    this.loadingText = 'Creating binary mask...';
    const maskBlob = await this.createBinaryMaskBlob(renderWidth, renderHeight, currentPosition, currentRotation, currentScale);

    if (!maskBlob || maskBlob.size === 0) {
      throw new Error('Failed to create mask blob');
    }

    console.log(`✅ Composite blob: ${compositeBlob.size} bytes`);
    console.log(`✅ Mask blob:      ${maskBlob.size} bytes`);

    // this.downloadImages(compositeBlob, maskBlob);
    // return 
    const formData = new FormData();
    formData.append('composite_image', compositeBlob, 'composite_image.png');
    formData.append('binary_mask',     maskBlob,      'binary_mask.png');
    formData.append('room_id',  roomId);
    formData.append('prod_id',  prod_id);

    this.loadingText = 'Adding Product to Your Room...';

    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      body: formData,
    });

    if (response.status === 402) {
      const result = await response.json();
      this.$emit('insufficient-credits', result.msg, result.buid);
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API result:', result);

    if (result.renderer_id) {
      // Hide chair from scene after successful submit
      if (this.chair) this.chair.visible = false;
      this.$emit('add-3d-furniture-to-room-start-polling', result.renderer_id);
    }

    console.log(`Images generated at dimensions: ${renderWidth}x${renderHeight}`);
    return result;

  } catch (error) {
    console.error('Error rendering item:', error);
    this.loadingProxy = false;
    throw error;
  }
},

async createCompositeImageBlob(bgWidth, bgHeight, position, rotation, scale) {
  const objectCanvas = document.createElement('canvas');
  objectCanvas.width  = bgWidth;
  objectCanvas.height = bgHeight;

  const objectRenderer = new THREE.WebGLRenderer({
    canvas: objectCanvas,
    antialias: true,
    preserveDrawingBuffer: true,
    alpha: true,
    precision: 'highp',
  });
  objectRenderer.setSize(bgWidth, bgHeight);
  objectRenderer.setPixelRatio(1);
  objectRenderer.outputColorSpace = THREE.SRGBColorSpace;
  objectRenderer.setClearColor(0x000000, 0); // transparent
  objectRenderer.shadowMap.enabled = true;
  objectRenderer.shadowMap.type = THREE.PCFShadowMap;

  const objectScene = new THREE.Scene();

  // Clone chair and apply exact captured transform
  const chairClone = this.chair.clone(true);
  chairClone.position.copy(position);
  chairClone.rotation.copy(rotation);
  chairClone.scale.copy(scale);
  chairClone.updateMatrix();
  objectScene.add(chairClone);

  // Match lighting from initThree()
  objectScene.add(new THREE.AmbientLight(0xfff4e0, 1.2));

  const sun = new THREE.DirectionalLight(0xfff5e8, 2.0);
  sun.position.set(1.5, 5, -3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  objectScene.add(sun);

  const fill1 = new THREE.DirectionalLight(0xd0e8ff, 0.8);
  fill1.position.set(-2, 3, 2);
  objectScene.add(fill1);

  const fill2 = new THREE.DirectionalLight(0xe8f0ff, 0.6);
  fill2.position.set(3, 2, 1);
  objectScene.add(fill2);

  const backLight = new THREE.DirectionalLight(0xfff8e8, 0.5);
  backLight.position.set(0, 2, 4);
  objectScene.add(backLight);

  // Use same camera
  const objectCamera = this.camera.clone();
  objectCamera.aspect = bgWidth / bgHeight;
  objectCamera.updateProjectionMatrix();

  objectRenderer.render(objectScene, objectCamera);

  const blob = await new Promise((resolve) => {
    objectCanvas.toBlob(resolve, 'image/png');
  });

  objectRenderer.dispose();
  return blob;
},

async createBinaryMaskBlob(bgWidth, bgHeight, position, rotation, scale) {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width  = bgWidth;
  tempCanvas.height = bgHeight;

  const tempRenderer = new THREE.WebGLRenderer({
    canvas: tempCanvas,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  tempRenderer.setSize(bgWidth, bgHeight);
  tempRenderer.setPixelRatio(1);
  tempRenderer.setClearColor(0x000000, 1); // black background

  const tempScene = new THREE.Scene();

  // Clone chair with captured transform
  const chairClone = this.chair.clone(true);
  chairClone.position.copy(position);
  chairClone.rotation.copy(rotation);
  chairClone.scale.copy(scale);
  chairClone.updateMatrix();

  // White material for mask
  chairClone.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    }
  });

  tempScene.add(chairClone);
  tempScene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 1.0));

  const tempCamera = this.camera.clone();
  tempCamera.aspect = bgWidth / bgHeight;
  tempCamera.updateProjectionMatrix();

  tempRenderer.render(tempScene, tempCamera);

  const blob = await new Promise((resolve) => {
    tempCanvas.toBlob(resolve, 'image/png');
  });

  tempRenderer.dispose();
  return blob;
},

async switchFurniture() {
  if (!this.chair) {
    console.warn('No chair loaded');
    return;
  }

  try {
    this.loadingProxy = true;
    this.loadingText  = 'Switching Product...';

    // Hide chair immediately
    if (this.chair) this.chair.visible = false;

    const roomId  = this.$route.params.id;
    const prod_id = this.product_id;
    const url     = `${this.$store.state.root_api}engine/switch-furniture-ref/`;

    const formData = new FormData();
    formData.append('room_id',  roomId);
    formData.append('prod_id',  prod_id);

    this.loadingText = 'Switching Product of Your Room...';

    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      body: formData,
    });

    if (response.status === 402) {
      const result = await response.json();
      this.$emit('insufficient-credits', result.msg);
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('switchFurniture result:', result);

    if (result?.renderer_id) {
      this.$emit('add-3d-furniture-to-room-start-polling', result.renderer_id);
    }

    this.$emit('rendered-comfyui-workflow', result.final_output);
    return result;

  } catch (error) {
    console.error('Error switching furniture:', error);
    this.loadingProxy = false;
    throw error;
  }
},
    cleanup() {
      // Stop animation loop
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId)
      }

      // Dispose renderer
      if (this.renderer) {
        this.renderer.dispose()
        if (this.renderer.domElement && this.renderer.domElement.parentNode) {
          this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
        }
      }

      // Dispose scene resources
      if (this.scene) {
        this.scene.traverse((child) => {
          if (child.geometry) {
            child.geometry.dispose()
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose())
            } else {
              child.material.dispose()
            }
          }
        })
      }

      // Remove event listeners
      if (this.renderer && this.renderer.domElement) {
        this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown)
        this.renderer.domElement.removeEventListener('pointermove', this.onPointerMove)
        this.renderer.domElement.removeEventListener('pointerup', this.onPointerUp)
        this.renderer.domElement.removeEventListener('pointerleave', this.onPointerUp)
      }

      // Reset all state
      this.scene = null
      this.renderer = null
      this.camera = null
      this.chair = null
      this.pointCloudObj = null
      this.floorMesh3D = null
      this.shadowReceiverMesh = null
      this.sofaSpotLight = null
      this.sofaSpotTarget = null

      this.planeReady = false
      this.chairLoaded = false
      this.maskReady = false
      this.plyReady = false
      this.isDragging = false
      this.isDraggingRef = false

      this.floorPlaneTHREE = null
      this.floorNormal3 = markRaw(new THREE.Vector3(0, 1, 0))
      this.floorCentroid3 = markRaw(new THREE.Vector3())

      // Inside cleanup(), add:
window.removeEventListener('resize', this.adjustCanvasToAspectRatio)
    },
    // animate() {
    //   this.animationFrameId = requestAnimationFrame(this.animate)
    //   if (this.renderer && this.scene && this.camera) {
    //     this.renderer.render(this.scene, this.camera)
    //   }
    // },
   
    
    // initThree() {
    //   const w = this.roomImage.clientWidth
    //   const h = this.roomImage.clientHeight

    //   this.scene = markRaw(new THREE.Scene())

    //   this.camera = markRaw(new THREE.PerspectiveCamera(this.CAM_FOV_V, w / h, 0.01, 200))
    //   this.camera.position.set(0, 0, 0)
    //   this.camera.lookAt(0, 0, -1)
    //   this.camera.updateProjectionMatrix()

    //   this.renderer = markRaw(new THREE.WebGLRenderer({ antialias: true, alpha: true }))
    //   this.renderer.setSize(w, h, false)
    //   this.renderer.setPixelRatio(window.devicePixelRatio)
    //   this.renderer.outputColorSpace = THREE.SRGBColorSpace
    //   this.renderer.shadowMap.enabled = true
    //   this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    //   this.renderer.domElement.style.width = `${w}px`
    //   this.renderer.domElement.style.height = `${h}px`
    //   this.threeContainer.appendChild(this.renderer.domElement)

    //   this.maskOverlayCanvas.width = w
    //   this.maskOverlayCanvas.height = h

    //   // Lighting
    //   this.scene.add(new THREE.AmbientLight(0xfff4e0, 0.55))

    //   const sun = new THREE.DirectionalLight(0xfff5e8, 1.3)
    //   sun.position.set(1.5, 5, -3)
    //   sun.castShadow = true
    //   sun.shadow.mapSize.set(2048, 2048)
    //   sun.shadow.camera.near = 0.1
    //   sun.shadow.camera.far = 20
    //   sun.shadow.camera.left = sun.shadow.camera.bottom = -6
    //   sun.shadow.camera.right = sun.shadow.camera.top = 6
    //   this.scene.add(sun)

    //   const fill = new THREE.DirectionalLight(0xd0e8ff, 0.35)
    //   fill.position.set(-2, 2, -8)
    //   this.scene.add(fill)

    //   // Spot light
    //   this.sofaSpotTarget = markRaw(new THREE.Object3D())
    //   this.sofaSpotTarget.position.set(-0.29, -1, -5.89)
    //   this.scene.add(this.sofaSpotTarget)

    //   this.sofaSpotLight = markRaw(new THREE.SpotLight(0xfff2cc, 2.5))
    //   this.sofaSpotLight.angle = Math.PI / 7
    //   this.sofaSpotLight.penumbra = 0.45
    //   this.sofaSpotLight.decay = 1.8
    //   this.sofaSpotLight.distance = 6
    //   this.sofaSpotLight.castShadow = true
    //   this.sofaSpotLight.shadow.mapSize.set(1024, 1024)
    //   this.sofaSpotLight.shadow.camera.near = 0.2
    //   this.sofaSpotLight.shadow.camera.far = 8
    //   this.sofaSpotLight.target = this.sofaSpotTarget
    //   this.sofaSpotLight.position.set(-0.29, 1.5, -5.89)
    //   this.scene.add(this.sofaSpotLight)

    //   // Load assets
    //   this.loadMask()
    //   this.loadPointCloud()
    //   this.loadChair()
    //   this.animate()

    //   this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown)
    //   this.renderer.domElement.addEventListener('pointermove', this.onPointerMove)
    //   this.renderer.domElement.addEventListener('pointerup', this.onPointerUp)
    //   this.renderer.domElement.addEventListener('pointerleave', this.onPointerUp)
    // },

    initThree() {
  if (this.renderer) return

  this.roomImage = this.$refs.roomImage
  this.threeContainer = this.$refs.threeContainer
  this.maskOverlayCanvas = this.$refs.maskOverlayCanvas

  
  if (!this.roomImage || !this.threeContainer) return

  // ✅ Use natural image dimensions as the render buffer size
  const renderW = this.roomImage.naturalWidth || this.CAM_IMG_W
  const renderH = this.roomImage.naturalHeight || this.CAM_IMG_H

  if (renderW === 0 || renderH === 0) return

  this.scene = markRaw(new THREE.Scene())
  this.camera = markRaw(new THREE.PerspectiveCamera(this.CAM_FOV_V, renderW / renderH, 0.01, 200))
  this.camera.position.set(0, 0, 0)
  this.camera.lookAt(0, 0, -1)
  this.camera.updateProjectionMatrix()

  this.renderer = markRaw(new THREE.WebGLRenderer({ antialias: true, alpha: true }))
  this.renderer.setSize(renderW, renderH, false)
  this.renderer.setPixelRatio(1) // ✅ Always 1 — no device scaling, keeps buffer exact
  this.renderer.outputColorSpace = THREE.SRGBColorSpace
  this.renderer.shadowMap.enabled = true
  this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

  this.threeContainer.appendChild(this.renderer.domElement)

  // ✅ Size mask canvas to match render buffer
  this.maskOverlayCanvas.width = renderW
  this.maskOverlayCanvas.height = renderH

  // ✅ Fit CSS display size to container (like adjustCanvasToImageAspectRatio)
  this.adjustCanvasToAspectRatio()
      // ── IMPROVED LIGHTING ──────────────────────────────────────────────────────

      // Increased ambient light for overall brightness
      this.scene.add(new THREE.AmbientLight(0xfff4e0, 1.2)) // increased from 0.55 to 1.2

      // Main directional light (sun) - increased intensity
      const sun = new THREE.DirectionalLight(0xfff5e8, 2.0) // increased from 1.3 to 2.0
      sun.position.set(1.5, 5, -3)
      sun.castShadow = true
      sun.shadow.mapSize.set(2048, 2048)
      sun.shadow.camera.near = 0.1
      sun.shadow.camera.far = 20
      sun.shadow.camera.left = sun.shadow.camera.bottom = -6
      sun.shadow.camera.right = sun.shadow.camera.top = 6
      sun.shadow.bias = -0.001 // reduce shadow artifacts
      sun.shadow.normalBias = 0.02
      this.scene.add(sun)

      // Fill light 1 - increased intensity and repositioned
      const fill1 = new THREE.DirectionalLight(0xd0e8ff, 0.8) // increased from 0.35 to 0.8
      fill1.position.set(-2, 3, 2) // repositioned
      this.scene.add(fill1)

      // Fill light 2 - additional fill light for more detail
      const fill2 = new THREE.DirectionalLight(0xe8f0ff, 0.6)
      fill2.position.set(3, 2, 1)
      this.scene.add(fill2)

      // Back light - adds rim lighting to separate object from background
      const backLight = new THREE.DirectionalLight(0xfff8e8, 0.5)
      backLight.position.set(0, 2, 4) // behind the object
      this.scene.add(backLight)

      // ── SPOT LIGHT (kept for accent) ──────────────────────────────────────────
      this.sofaSpotTarget = markRaw(new THREE.Object3D())
      this.sofaSpotTarget.position.set(-0.29, -1, -5.89)
      this.scene.add(this.sofaSpotTarget)

      this.sofaSpotLight = markRaw(new THREE.SpotLight(0xfff2cc, 2.0)) // increased from 2.5 to 2.0 (can reduce shadow darkness)
      this.sofaSpotLight.angle = Math.PI / 6 // slightly wider angle
      this.sofaSpotLight.penumbra = 0.6 // increased from 0.45 for softer shadows
      this.sofaSpotLight.decay = 1.8
      this.sofaSpotLight.distance = 6
      this.sofaSpotLight.castShadow = true
      this.sofaSpotLight.shadow.mapSize.set(1024, 1024)
      this.sofaSpotLight.shadow.camera.near = 0.2
      this.sofaSpotLight.shadow.camera.far = 8
      this.sofaSpotLight.shadow.bias = -0.001
      this.sofaSpotLight.target = this.sofaSpotTarget
      this.sofaSpotLight.position.set(-0.29, 1.5, -5.89)
      this.scene.add(this.sofaSpotLight)

      // Load assets
      this.loadMask()
      this.loadPointCloud()
      this.loadChair()
      this.animate()

      this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown)
      this.renderer.domElement.addEventListener('pointermove', this.onPointerMove)
      this.renderer.domElement.addEventListener('pointerup', this.onPointerUp)
      this.renderer.domElement.addEventListener('pointerleave', this.onPointerUp)
    },
    adjustCanvasToAspectRatio() {
  if (!this.renderer || !this.roomImage) return

  const container = this.$refs.threeContainer
  if (!container) return

  const containerRect = container.getBoundingClientRect()
  const availableW = Math.floor(containerRect.width)
  const availableH = Math.floor(containerRect.height)

  if (availableW === 0 || availableH === 0) return

  const imgAspect = (this.roomImage.naturalWidth || this.CAM_IMG_W) /
                    (this.roomImage.naturalHeight || this.CAM_IMG_H)

  // Fit to width first
  let cssW = availableW
  let cssH = Math.round(cssW / imgAspect)

  // If too tall, fit to height instead
  if (cssH > availableH) {
    cssH = availableH
    cssW = Math.round(cssH * imgAspect)
  }

  // ✅ Only update CSS display size — buffer (renderW x renderH) stays unchanged
  this.renderer.domElement.style.width  = `${cssW}px`
  this.renderer.domElement.style.height = `${cssH}px`

  // ✅ Keep mask overlay in sync with CSS display size
  this.maskOverlayCanvas.style.width  = `${cssW}px`
  this.maskOverlayCanvas.style.height = `${cssH}px`
},
    loadMask() {
      const img = new Image()
      img.src = this.FLOOR_MASK
      img.crossOrigin = 'anonymous'  // ← ADD THIS

      img.onload = () => {
        this.maskCanvas = document.createElement('canvas')
        this.maskCanvas.width = this.CAM_IMG_W
        this.maskCanvas.height = this.CAM_IMG_H
        this.maskCtx = this.maskCanvas.getContext('2d')
        this.maskCtx.drawImage(img, 0, 0, this.CAM_IMG_W, this.CAM_IMG_H)

        const raw = this.maskCtx.getImageData(0, 0, this.CAM_IMG_W, this.CAM_IMG_H).data
        const binary = new Uint8Array(this.CAM_IMG_W * this.CAM_IMG_H)
        for (let i = 0; i < this.CAM_IMG_W * this.CAM_IMG_H; i++) {
          binary[i] = raw[i * 4] > 127 ? 1 : 0
        }

        this.erodedMask = this.erodeBinaryMask(
          binary,
          this.CAM_IMG_W,
          this.CAM_IMG_H,
          this.MASK_ERODE_PX,
        )

        this.maskReady = true
        console.log(`✅ Floor mask loaded + eroded by ${this.MASK_ERODE_PX}px`)
        if (this.debugMask) this.drawMaskOverlay()
        this.tryComputeFloor()
      }
      img.onerror = () => {
        console.warn('⚠ floor_mask.png not found — using full image as floor area')
        this.erodedMask = new Uint8Array(this.CAM_IMG_W * this.CAM_IMG_H).fill(1)
        this.maskReady = true
        this.tryComputeFloor()
      }
    },

    isOnFloorMask(screenX, screenY) {
      if (!this.maskCtx) return true
      const cx = Math.round((screenX / this.maskOverlayCanvas.width) * this.CAM_IMG_W)
      const cy = Math.round((screenY / this.maskOverlayCanvas.height) * this.CAM_IMG_H)
      const d = this.maskCtx.getImageData(
        Math.max(0, Math.min(this.CAM_IMG_W - 1, cx)),
        Math.max(0, Math.min(this.CAM_IMG_H - 1, cy)),
        1,
        1,
      ).data
      return d[0] > 127
    },

    drawMaskOverlay() {
      if (!this.maskCtx || !this.maskOverlayCanvas) return
      const ovCtx = this.maskOverlayCanvas.getContext('2d')
      ovCtx.clearRect(0, 0, this.maskOverlayCanvas.width, this.maskOverlayCanvas.height)
      const src = this.maskCtx.getImageData(0, 0, this.CAM_IMG_W, this.CAM_IMG_H)
      const dst = new ImageData(this.CAM_IMG_W, this.CAM_IMG_H)
      const W = this.CAM_IMG_W
      for (let i = 0; i < W * this.CAM_IMG_H; i++) {
        const floor = src.data[i * 4] > 127
        const eroded = this.erodedMask ? this.erodedMask[i] : floor
        if (floor && eroded) {
          dst.data[i * 4] = 0
          dst.data[i * 4 + 1] = 210
          dst.data[i * 4 + 2] = 90
          dst.data[i * 4 + 3] = 160
        } else if (floor && !eroded) {
          dst.data[i * 4] = 255
          dst.data[i * 4 + 1] = 200
          dst.data[i * 4 + 2] = 0
          dst.data[i * 4 + 3] = 130
        } else {
          dst.data[i * 4] = 220
          dst.data[i * 4 + 1] = 40
          dst.data[i * 4 + 2] = 40
          dst.data[i * 4 + 3] = 70
        }
      }
      const tmp = document.createElement('canvas')
      tmp.width = this.CAM_IMG_W
      tmp.height = this.CAM_IMG_H
      tmp.getContext('2d').putImageData(dst, 0, 0)
      ovCtx.drawImage(tmp, 0, 0, this.maskOverlayCanvas.width, this.maskOverlayCanvas.height)
    },

    clearMaskOverlay() {
      if (!this.maskOverlayCanvas) return
      this.maskOverlayCanvas
        .getContext('2d')
        .clearRect(0, 0, this.maskOverlayCanvas.width, this.maskOverlayCanvas.height)
    },

    loadPointCloud() {
      new PLYLoader().load(this.POINTCLOUD, (geo) => {
        const posAttr = geo.getAttribute('position')
        this.plyPositions = posAttr.array
        this.plyPointCount = posAttr.count

        const hasColor = geo.hasAttribute('color')
        const mat = new THREE.PointsMaterial({
          size: 0.025,
          vertexColors: hasColor,
          color: hasColor ? undefined : 0x00ccff,
        })
        this.pointCloudObj = markRaw(new THREE.Points(geo, mat))
        this.pointCloudObj.visible = this.debugPointCloud
        this.scene.add(this.pointCloudObj)

        this.plyReady = true
        console.log(`✅ PLY loaded — ${this.plyPointCount} points`)
        this.tryComputeFloor()
      })
    },

    projectToPixel(x, y, z) {
      const depth = this.CAM_Z_SIGN * z
      if (depth < 1e-4) return null
      const u = Math.round(this.CAM_FX * (x / depth) + this.CAM_CX)
      const v = Math.round(this.CAM_FY * (-y / depth) + this.CAM_CY)
      if (u < 0 || u >= this.CAM_IMG_W || v < 0 || v >= this.CAM_IMG_H) return null
      return { u, v }
    },

    erodeBinaryMask(binary, W, H, radius) {
      const tmp = new Uint8Array(W * H)
      for (let y = 0; y < H; y++) {
        const prefix = new Int32Array(W + 1)
        for (let x = 0; x < W; x++) prefix[x + 1] = prefix[x] + binary[y * W + x]
        for (let x = 0; x < W; x++) {
          const lo = Math.max(0, x - radius)
          const hi = Math.min(W - 1, x + radius)
          tmp[y * W + x] = prefix[hi + 1] - prefix[lo] === hi - lo + 1 ? 1 : 0
        }
      }
      const out = new Uint8Array(W * H)
      for (let x = 0; x < W; x++) {
        const prefix = new Int32Array(H + 1)
        for (let y = 0; y < H; y++) prefix[y + 1] = prefix[y] + tmp[y * W + x]
        for (let y = 0; y < H; y++) {
          const lo = Math.max(0, y - radius)
          const hi = Math.min(H - 1, y + radius)
          out[y * W + x] = prefix[hi + 1] - prefix[lo] === hi - lo + 1 ? 1 : 0
        }
      }
      return out
    },

    fitFloorPlane(pts) {
      const N = pts.length
      if (N < 3) return null

      let sx2 = 0,
        sxz = 0,
        sx = 0,
        sz2 = 0,
        sz = 0
      let sxy = 0,
        szy = 0,
        sy = 0
      for (const [x, y, z] of pts) {
        sx2 += x * x
        sxz += x * z
        sx += x
        sz2 += z * z
        sz += z
        sxy += x * y
        szy += z * y
        sy += y
      }

      const M = [
        [sx2, sxz, sx],
        [sxz, sz2, sz],
        [sx, sz, N],
      ]
      const b = [sxy, szy, sy]

      const coeffs = this.gaussElim3(M, b)
      if (!coeffs) return null

      const [a, bCoeff, c] = coeffs

      const nx = a,
        ny = -1,
        nz = bCoeff
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz)
      const sign = -1
      return {
        normal: new THREE.Vector3((sign * nx) / len, (sign * ny) / len, (sign * nz) / len),
        a,
        b: bCoeff,
        c,
      }
    },

    gaussElim3(M, b) {
      const A = M.map((r, i) => [...r, b[i]])
      for (let col = 0; col < 3; col++) {
        let maxRow = col
        let maxVal = Math.abs(A[col][col])
        for (let row = col + 1; row < 3; row++) {
          if (Math.abs(A[row][col]) > maxVal) {
            maxVal = Math.abs(A[row][col])
            maxRow = row
          }
        }
        ;[A[col], A[maxRow]] = [A[maxRow], A[col]]
        if (Math.abs(A[col][col]) < 1e-12) return null
        for (let row = col + 1; row < 3; row++) {
          const f = A[row][col] / A[col][col]
          for (let k = col; k <= 3; k++) A[row][k] -= f * A[col][k]
        }
      }
      const x = [0, 0, 0]
      for (let i = 2; i >= 0; i--) {
        x[i] = A[i][3]
        for (let j = i + 1; j < 3; j++) x[i] -= A[i][j] * x[j]
        x[i] /= A[i][i]
      }
      return x
    },

    tryComputeFloor() {
      if (!this.plyReady || !this.maskReady) return
      console.log('🔄 Computing floor plane from point cloud + mask…')

      const floorPts = []
      for (let i = 0; i < this.plyPointCount; i++) {
        const x = this.plyPositions[i * 3 + 0]
        const y = this.plyPositions[i * 3 + 1]
        const z = this.plyPositions[i * 3 + 2]
        const px = this.projectToPixel(x, y, z)
        if (!px) continue
        const idx = px.v * this.CAM_IMG_W + px.u
        if (this.erodedMask[idx] === 1) floorPts.push([x, y, z])
      }

      this.floorPtCount = floorPts.length
      console.log(`   Floor points inside eroded mask: ${floorPts.length}`)

      if (floorPts.length < 10) {
        console.error('❌ Too few floor points — check mask + PLY alignment')
        return
      }

      let cx = 0,
        cy = 0,
        cz = 0
      for (const [x, y, z] of floorPts) {
        cx += x
        cy += y
        cz += z
      }
      cx /= floorPts.length
      cy /= floorPts.length
      cz /= floorPts.length
      this.floorCentroid3.set(cx, cy, cz)
      this.floorCentroidY = cy
      console.log(`   Floor centroid: (${cx.toFixed(3)}, ${cy.toFixed(3)}, ${cz.toFixed(3)})`)

      const fit = this.fitFloorPlane(floorPts)
      if (!fit) {
        console.error('❌ Plane fit failed — degenerate points')
        return
      }

      this.floorNormal3.copy(fit.normal)

      if (this.floorNormal3.y < 0) {
        this.floorNormal3.negate()
        console.warn('   ⚠ Floor normal was pointing down — negated to point up')
      }
      const tiltDeg = (Math.acos(Math.min(1, this.floorNormal3.y)) * 180) / Math.PI
      if (tiltDeg > 20) {
        console.warn(`   ⚠ Floor tilt ${tiltDeg.toFixed(1)}° too extreme — clamping to vertical`)
        this.floorNormal3.set(0, 1, 0)
      }

      console.log(
        `   Floor normal: (${fit.normal.x.toFixed(4)}, ${fit.normal.y.toFixed(4)}, ${fit.normal.z.toFixed(4)})`,
      )
      console.log(
        `   Plane coeffs: y = ${fit.a.toFixed(4)}x + ${fit.b.toFixed(4)}z + ${fit.c.toFixed(4)}`,
      )

      this._floorNX = fit.normal.x
      this._floorNY = fit.normal.y
      this._floorNZ = fit.normal.z

      this.floorPlaneTHREE = markRaw(new THREE.Plane())
      this.floorPlaneTHREE.setFromNormalAndCoplanarPoint(this.floorNormal3, this.floorCentroid3)

      this.buildFloorDebugMesh(floorPts)
      this.buildShadowReceiver()
      this.planeReady = true
      console.log('✅ Floor plane ready')

      // if (this.chair) this.placeChairOnFloor()
      // With:
if (this.chair) {
  this.placeChairOnFloor()
  this.loadingProxy = false  // ✅ plane + chair both ready
  this.loadingText = ''
}
    },

    // buildShadowReceiver() {
    //   if (this.shadowReceiverMesh) {
    //     this.scene.remove(this.shadowReceiverMesh)
    //     this.shadowReceiverMesh = null
    //   }

    //   const geo = new THREE.PlaneGeometry(12, 12)
    //   const mat = new THREE.ShadowMaterial({
    //     opacity: 0.15,
    //     transparent: true,
    //     depthWrite: false,
    //   })

    //   this.shadowReceiverMesh = markRaw(new THREE.Mesh(geo, mat))
    //   this.shadowReceiverMesh.receiveShadow = true

    //   const defaultNorm = new THREE.Vector3(0, 0, 1)
    //   const q = new THREE.Quaternion().setFromUnitVectors(defaultNorm, this.floorNormal3)
    //   this.shadowReceiverMesh.applyQuaternion(q)
    //   this.shadowReceiverMesh.position.copy(this.floorCentroid3)

    //   this.shadowReceiverMesh.position.addScaledVector(this.floorNormal3, 0.005)

    //   this.scene.add(this.shadowReceiverMesh)
    // },
    buildShadowReceiver() {
      if (this.shadowReceiverMesh) {
        this.scene.remove(this.shadowReceiverMesh)
        this.shadowReceiverMesh = null
      }

      const geo = new THREE.PlaneGeometry(12, 12)
      const mat = new THREE.ShadowMaterial({
        opacity: 0.08, // reduced from 0.15 to make shadows lighter
        transparent: true,
        depthWrite: false,
      })

      this.shadowReceiverMesh = markRaw(new THREE.Mesh(geo, mat))
      this.shadowReceiverMesh.receiveShadow = true

      const defaultNorm = new THREE.Vector3(0, 0, 1)
      const q = new THREE.Quaternion().setFromUnitVectors(defaultNorm, this.floorNormal3)
      this.shadowReceiverMesh.applyQuaternion(q)
      this.shadowReceiverMesh.position.copy(this.floorCentroid3)

      this.shadowReceiverMesh.position.addScaledVector(this.floorNormal3, 0.005)

      this.scene.add(this.shadowReceiverMesh)
    },

    buildFloorDebugMesh(floorPts) {
      if (this.floorMesh3D) {
        this.scene.remove(this.floorMesh3D)
        this.floorMesh3D = null
      }

      const PLANE_SIZE = 12

      const geo = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, 1, 1)
      const mat = new THREE.MeshStandardMaterial({
        color: 0x00cc55,
        emissive: 0x002211,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        wireframe: false,
      })
      this.floorMesh3D = markRaw(new THREE.Mesh(geo, mat))

      const defaultNorm = new THREE.Vector3(0, 0, 1)
      const q = new THREE.Quaternion().setFromUnitVectors(defaultNorm, this.floorNormal3)
      this.floorMesh3D.applyQuaternion(q)

      this.floorMesh3D.position.copy(this.floorCentroid3)
      this.floorMesh3D.visible = this.debugFloorMesh
      this.floorMesh3D.receiveShadow = true
      this.scene.add(this.floorMesh3D)

      console.log(
        `✅ Debug floor mesh built (${PLANE_SIZE}m × ${PLANE_SIZE}m, centred at floor centroid)`,
      )
    },

    loadChair() {
      new GLTFLoader().load(
        this.CHAIR_MODEL,
        (gltf) => {
          const innerMesh = gltf.scene

          innerMesh.traverse((n) => {
            if (n.isMesh) {
              n.castShadow = true
              n.receiveShadow = true
            }
          })

          innerMesh.position.set(0, 0, 0)
          innerMesh.rotation.set(0, 0, 0)
          innerMesh.scale.set(1, 1, 1)
          innerMesh.updateMatrixWorld(true)

          const rawBox = new THREE.Box3().setFromObject(innerMesh)
          const rawSize = new THREE.Vector3()
          rawBox.getSize(rawSize)
          console.log(
            `   Raw size: ${rawSize.x.toFixed(3)}w × ${rawSize.y.toFixed(3)}h × ${rawSize.z.toFixed(3)}d`,
          )

          const MODEL_IS_ZUP_FLIPPED = false
          if (MODEL_IS_ZUP_FLIPPED) {
            innerMesh.rotation.x = Math.PI
            innerMesh.updateMatrixWorld(true)
          }

          const flippedBox = new THREE.Box3().setFromObject(innerMesh)
          const flippedSize = new THREE.Vector3()
          flippedBox.getSize(flippedSize)

          const fovRad = (this.CAM_FOV_V * Math.PI) / 180
          const fy_threejs = this.CAM_IMG_H / 2 / Math.tan(fovRad / 2)
          const focalCorrection = this.CAM_FY / fy_threejs
          console.log(
            `   Focal correction: CAM_FY=${this.CAM_FY.toFixed(1)} / fy_three=${fy_threejs.toFixed(1)} = ${focalCorrection.toFixed(4)}`,
          )

          const sx =
            flippedSize.x > 0
              ? (this.TARGET_DIMS.width * this.CHAIR_SCALE_FACTOR * focalCorrection) / flippedSize.x
              : 1
          const sy =
            flippedSize.y > 0
              ? (this.TARGET_DIMS.height * this.CHAIR_SCALE_FACTOR * focalCorrection) /
                flippedSize.y
              : 1
          const sz =
            flippedSize.z > 0
              ? (this.TARGET_DIMS.depth * this.CHAIR_SCALE_FACTOR * focalCorrection) / flippedSize.z
              : 1
          innerMesh.scale.set(sx, sy, sz)
          innerMesh.updateMatrixWorld(true)

          this.chairBaseScaleX = sx
          this.chairBaseScaleY = sy
          this.chairBaseScaleZ = sz

          console.log(`   Final scale: (${sx.toFixed(3)}, ${sy.toFixed(3)}, ${sz.toFixed(3)})`)

          const pivotGroup = new THREE.Group()
          pivotGroup.add(innerMesh)
          this.scene.add(pivotGroup)

          const scaledBox = new THREE.Box3().setFromObject(pivotGroup)
          const bottomY = scaledBox.min.y
          console.log(`   Bottom Y before correction: ${bottomY.toFixed(4)}`)

          innerMesh.position.y -= bottomY
          innerMesh.updateMatrixWorld(true)

          const verifyBox = new THREE.Box3().setFromObject(pivotGroup)
          console.log(`   Bottom Y after:  ${verifyBox.min.y.toFixed(4)} (target ~0.000)`)
          console.log(
            `   Top    Y after:  ${verifyBox.max.y.toFixed(4)} (target ~${(this.TARGET_DIMS.height * this.CHAIR_SCALE_FACTOR * focalCorrection).toFixed(3)})`,
          )

          this.chairHalfH = 0.001
          this.chair = markRaw(pivotGroup)
          this.chairLoaded = true
          console.log('✅ Chair ready')


          if (this.planeReady) {
            this.placeChairOnFloor()
            this.loadingProxy = false  // ✅ chair + plane both ready
            this.loadingText = ''
          }        
        },
        (xhr) => {
          if (xhr.total > 0)
            console.log(`   Loading: ${Math.round((xhr.loaded / xhr.total) * 100)}%`)
        },
        (err) => {
          console.error('❌ Chair load failed:', err)
        },
      )
    },

    placeChairOnFloor(worldX = null, worldZ = null) {
      if (!this.chair || !this.floorPlaneTHREE) return

      const x = worldX ?? this.floorCentroid3.x
      const z = worldZ ?? this.floorCentroid3.z

      const n = this.floorNormal3
      const d = this.floorPlaneTHREE.constant
      let y = this.floorCentroid3.y
      if (Math.abs(n.y) > 1e-6) {
        y = (-d - n.x * x - n.z * z) / n.y
      }

      console.log(
        `   Placing chair at (${x.toFixed(3)}, ${y.toFixed(3)}, ${z.toFixed(3)}) floor normal Y=${n.y.toFixed(4)}`,
      )

      this.chair.position.set(x, y, z)
      this.chair.position.addScaledVector(n, this.chairHalfH)

      this.alignChairToFloor()
      this.snapLightToChair()
    },

    updateChairScaleForDepth() {
      if (!this.chair) return

      const fy_real = this.CAM_FY
      const fovRad = (this.CAM_FOV_V * Math.PI) / 180
      const fy_threejs = this.CAM_IMG_H / 2 / Math.tan(fovRad / 2)
      const correction = fy_real / fy_threejs

      this.chair.scale.set(correction, correction, correction)

      console.log(
        `   fy_real=${fy_real.toFixed(1)}  fy_three=${fy_threejs.toFixed(1)}  correction=${correction.toFixed(4)}`,
      )
    },

    alignChairToFloor() {
      if (!this.chair) return
      const worldUp = new THREE.Vector3(0, 1, 0)
      const fn = this.floorNormal3.clone().normalize()
      const tiltQ = new THREE.Quaternion().setFromUnitVectors(worldUp, fn)
      const spinQ = new THREE.Quaternion().setFromAxisAngle(
        fn,
        (this.chairRotation * Math.PI) / 180,
      )
      this.chair.quaternion.multiplyQuaternions(spinQ, tiltQ)
    },

    updateChairRotation() {
      if (this.chair && this.planeReady) this.alignChairToFloor()
    },

    snapLightToChair() {
      if (!this.sofaSpotLight || !this.sofaSpotTarget || !this.chair) return
      this.sofaSpotLight.position.set(
        this.chair.position.x,
        this.chair.position.y + 1.8,
        this.chair.position.z,
      )
      this.sofaSpotTarget.position.copy(this.chair.position)
    },

    onPointerDown(event) {
      if (!this.chair || !this.floorPlaneTHREE) return
      this.updateMouse(event)
      this.raycaster.setFromCamera(this.mouse, this.camera)

      const hits = this.raycaster.intersectObject(this.chair, true)
      if (hits.length === 0) return

      this.chair.visible = false
      const floorHit = this.raycastFloor()
      this.chair.visible = true
      if (!floorHit) return

      this.dragOffset.set(
        this.chair.position.x - (floorHit.x + this.floorNormal3.x * this.chairHalfH),
        0,
        this.chair.position.z - (floorHit.z + this.floorNormal3.z * this.chairHalfH),
      )
      this.isDragging = true
      this.isDraggingRef = true
      this.renderer.domElement.setPointerCapture(event.pointerId)
    },

    onPointerMove(event) {
      if (!this.isDragging || !this.chair || !this.floorPlaneTHREE) return
      this.updateMouse(event)
      this.raycaster.setFromCamera(this.mouse, this.camera)

      this.chair.visible = false
      const floorHit = this.raycastFloor()
      this.chair.visible = true
      if (!floorHit) return

      const rect = this.renderer.domElement.getBoundingClientRect()
      const screenX = event.clientX - rect.left
      const screenY = event.clientY - rect.top
      const onMask = true
      this.lastMaskResult = this.isOnFloorMask(screenX, screenY)

      this.lastHit = {
        x: floorHit.x.toFixed(3),
        y: floorHit.y.toFixed(3),
        z: floorHit.z.toFixed(3),
      }
      this.lastMaskResult = onMask

      if (onMask) {
        const newX = floorHit.x + this.dragOffset.x
        const newZ = floorHit.z + this.dragOffset.z

        const n = this.floorNormal3
        const d = this.floorPlaneTHREE.constant
        let newY = this.floorCentroid3.y
        if (Math.abs(n.y) > 1e-6) {
          newY = (-d - n.x * newX - n.z * newZ) / n.y
        }

        this.chair.position.set(newX, newY, newZ)
        this.chair.position.addScaledVector(this.floorNormal3, this.chairHalfH)
        this.updateChairScaleForDepth()
        this.snapLightToChair()
      }
    },

    onPointerUp(event) {
      if (!this.isDragging) return
      this.isDragging = false
      this.isDraggingRef = false
      try {
        this.renderer.domElement.releasePointerCapture(event.pointerId)
      } catch (_) {}
    },

    raycastFloor() {
      if (this.floorPlaneTHREE) {
        const pt = new THREE.Vector3()
        if (this.raycaster.ray.intersectPlane(this.floorPlaneTHREE, pt)) return pt
      }
      const yPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -this.floorCentroid3.y)
      const pt = new THREE.Vector3()
      if (this.raycaster.ray.intersectPlane(yPlane, pt)) return pt
      return null
    },

    updateMouse(event) {
      const rect = this.renderer.domElement.getBoundingClientRect()
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    },

    toggleMaskOverlay() {
      if (this.debugMask) {
        if (this.maskReady) this.drawMaskOverlay()
      } else this.clearMaskOverlay()
    },

    togglePointCloud() {
      if (this.pointCloudObj) this.pointCloudObj.visible = this.debugPointCloud
    },

    toggleFloorMesh() {
      if (this.floorMesh3D) this.floorMesh3D.visible = this.debugFloorMesh
    },

    animate() {
  this.animationFrameId = requestAnimationFrame(this.animate)
  if (this.renderer && this.scene && this.camera) {
    this.renderer.render(this.scene, this.camera)
  }
},
  },

  watch: {
     CHAIR_MODEL(newVal, oldVal) {
    if (newVal && newVal !== oldVal) {
      // ✅ Guard: only reload if scene is ready
      if (!this.scene) {
        console.warn('⚠️ CHAIR_MODEL changed but scene not ready yet — skipping reloadChair')
        return
      }
      this.reloadChair()
    }
  },
    debugMask(newVal) {
      this.toggleMaskOverlay()
    },
    debugPointCloud(newVal) {
      this.togglePointCloud()
    },
    debugFloorMesh(newVal) {
      this.toggleFloorMesh()
    },
    chairRotation() {
      this.updateChairRotation()
    },

    // BASE_ROOT_MAIN_IMAGE(newVal, oldVal) {
    //   // When the image URL changes, reset and reinitialize
    //   if (newVal !== oldVal) {
    //     this.cleanup()
    //     this.$nextTick(() => {
    //       this.roomImage = this.$refs.roomImage
    //       if (this.roomImage && this.roomImage.complete) {
    //         this.initThree()
    //       }
    //     })
    //   }
    // },
  },
}
</script>
<style scoped>
/* ── EDITOR WRAPPER ─────────────────────────────────────────── */
.editor-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  /* font-family: 'JetBrains Mono', 'Fira Mono', monospace; */
  /* background: #080808; */
  min-height: 100%;
}

/* ── DEBUG PANEL ────────────────────────────────────────────── */
.debug-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 24px;
  background: #0d0d0d;
  border: 1px solid #222;
  border-radius: 8px;
  padding: 10px 16px;
  width: 100%;
  max-width: 920px;
  box-sizing: border-box;
}
.debug-title {
  width: 100%;
  font-size: 10px;
  font-weight: 700;
  color: #555;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.debug-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #999;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
}
.debug-row input[type='checkbox'] {
  accent-color: #4ade80;
  width: 15px;
  height: 15px;
  cursor: pointer;
}
.debug-row input[type='range'] {
  width: 80px;
  accent-color: #4ade80;
  cursor: pointer;
}
.debug-row input[type='range']:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.val {
  color: #4ade80;
  min-width: 36px;
  text-align: right;
}
.badge {
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.badge.on {
  background: #14532d;
  color: #4ade80;
}
.badge.off {
  background: #3f1515;
  color: #f87171;
}
.debug-status {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 20px;
  width: 100%;
  border-top: 1px solid #1a1a1a;
  padding-top: 8px;
}
.status-row {
  display: flex;
  gap: 6px;
  font-size: 11px;
  color: #555;
  align-items: center;
}
.ok   { color: #4ade80; }
.err  { color: #f87171; }
.coord { color: #60a5fa; letter-spacing: 0.03em; }

/* ── ROOM / CANVAS CONTAINER ────────────────────────────────── */
.room-container {
  position: relative;
  width: 100%;
  /* Responsive height — mirrors .main-canvas from ItemReplacementRenderer */
  height: calc(100vh - 140px);
  min-height: 400px;
  max-height: calc(100vh - 140px);
  line-height: 0;
  border-radius: 6px;
  overflow: hidden;
  /* box-shadow: 0 0 40px #000a; */
}

/* Desktop */
@media (min-width: 769px) {
  .room-container {
    height: calc(100vh - 140px);
    max-height: calc(100vh - 140px);
    max-width: 920px;
    margin: 0 auto;
  }
}

/* Tablet */
@media (min-width: 400px) and (max-width: 768px) {
  .room-container {
    height: calc(100vh - 180px);
    max-height: calc(100vh - 180px);
  }
}

/* Mobile */
@media (max-width: 399px) {
  .room-container {
    height: calc(100vh - 220px);
    max-height: calc(100vh - 220px);
  }
}

/* ── ROOM IMAGE ──────────────────────────────────────────────── */
.room-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-width: 920px;
  max-height: 80vh;
}

/* ── OVERLAY LAYERS ─────────────────────────────────────────── */
.mask-overlay {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.three-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.three-layer canvas {
  display: block;
}

/* ── LOADING OVERLAY ────────────────────────────────────────── */
.scanning-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  overflow: hidden;
}

.loading-screen {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.loading-screen::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(20, 20, 20, 0.55);
  backdrop-filter: blur(0.1px);
  z-index: 1;
}

.wave-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to left,
    rgba(0, 102, 255, 1)   0%,
    rgba(0, 102, 255, 0.4) 20%,
    rgba(0, 102, 255, 0.3) 30%,
    rgba(0, 102, 255, 0.2) 35%,
    rgba(0, 102, 255, 0.15) 40%,
    rgba(0, 102, 255, 0.1) 50%,
    rgba(0, 102, 255, 0)   100%
  );
  animation:
    moveWaveLeftToRight 3s linear infinite,
    waveFade 3s ease-in-out infinite;
  z-index: 2;
}

@keyframes moveWaveLeftToRight {
  from { transform: translateX(-100%); }
  to   { transform: translateX(50%);  }
}

@keyframes waveFade {
  0%   { opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { opacity: 0; }
}

.loading-text {
  position: relative;
  color: #fff;
  text-align: center;
  z-index: 3;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  background: rgba(0, 0, 0, 0.3);
  padding: 20px 30px;
  border-radius: 10px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.process-text {
  font-size: 18px;
  opacity: 0.9;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* ── HINT & STATUS BADGE ────────────────────────────────────── */
.hint {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.65);
  color: #ccc;
  font-size: 12px;
  font-family: inherit;
  padding: 5px 14px;
  border-radius: 20px;
  pointer-events: none;
  white-space: nowrap;
  border: 1px solid #333;
  backdrop-filter: blur(4px);
}

.status-badge {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: #facc15;
  font-size: 12px;
  font-family: inherit;
  padding: 5px 14px;
  border-radius: 20px;
  pointer-events: none;
  border: 1px solid #444;
  backdrop-filter: blur(4px);
}

/* ── INSTRUCTION MODAL ──────────────────────────────────────── */
.instruction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.instruction-item:last-child {
  border-bottom: none;
}
.instruction {
  font-weight: 500;
  color: #333;
  flex: 1;
}
.gesture-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-left: 20px;
}
</style>