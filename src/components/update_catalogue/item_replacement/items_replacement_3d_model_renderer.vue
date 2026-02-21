<template>
  <!-- {{ isLoading }} -->
<a-modal
    v-model:open="isShowInstructionModal"
    title="Instructions"
    @ok="closeInstructionModal"
    :width="500"
  >
    <div class="instruction-item" v-for="item in instructionConfig" :key="item">
      <span class="instruction">{{ item?.key }}</span>
      <img :src="item?.value" alt="gesture" class="gesture-icon" />
    </div>
  </a-modal>


  <div>
    
    <!-- ✅ NO-MODEL fallback -->
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

    <!-- ✅ 3D EDITOR -->
    <div class="editor-wrapper" v-show="CHAIR_MODEL && CHAIR_MODEL !== ''">
     
      <div class="room-container">
 <img
        class="absolute top-[5px] right-[10px] md:hidden cursor-pointer z-9 w-[25px]"
        src="../../../assets/icons/informationIcon.svg"
        alt="instruction"
        @click="showInstructionModal"
        title="see instruction"
      />
        <!-- ✅ LOADING OVERLAY -->
        <div v-if="internalLoading" class="scanning-loading-overlay">
          <div
            class="loading-screen"
            :style="{ backgroundImage: BASE_ROOT_MAIN_IMAGE ? `url(${BASE_ROOT_MAIN_IMAGE})` : 'none' }"
          >
            <div class="wave-overlay"></div>
            <div class="loading-text">
              <div class="process-text">
                {{ internalLoadingText }}
              </div>
              <div v-if="modelLoadProgress > 0 && modelLoadProgress < 100" style="margin-top: 16px;">
                <div style="width:220px;height:6px;background:rgba(255,255,255,0.2);border-radius:99px;overflow:hidden;">
                  <div :style="{width: modelLoadProgress+'%',height:'100%',background:'#3b82f6',borderRadius:'99px',transition:'width 0.2s ease'}"></div>
                </div>
                <div style="margin-top:8px;font-size:13px;opacity:0.8;">{{ modelLoadProgress }}%</div>
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

        <div class="status-badge" v-if="!planeReady && !internalLoading">
          {{ plyReady && maskReady ? '🔄 Fitting floor plane…' : '⏳ Loading assets…' }}
        </div>

        <span style="
          background: white;
          border-radius: 5px;
          padding-left: 5px;
          padding-right: 5px;
          font-size: 12px;
          font-weight: 600;
          position: absolute;
          z-index: 5;
          line-height: 1.4;
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
          <span class="badge" :class="debugPointCloud ? 'on' : 'off'">{{ debugPointCloud ? 'ON' : 'OFF' }}</span>
        </label>
        <label class="debug-row">
          <span>Floor Plane 3D</span>
          <input type="checkbox" v-model="debugFloorMesh" @change="toggleFloorMesh" />
          <span class="badge" :class="debugFloorMesh ? 'on' : 'off'">{{ debugFloorMesh ? 'ON' : 'OFF' }}</span>
        </label>
        <label class="debug-row">
          <span>Chair Rotation</span>
          <input type="range" min="0" max="360" step="1" v-model.number="chairRotation" @input="updateChairRotation" />
          <span class="val">{{ chairRotation }}°</span>
        </label>
        <label class="debug-row">
          <span>Mask Opacity</span>
          <input type="range" min="0.1" max="1" step="0.05" v-model.number="maskOpacity" :disabled="!debugMask" />
          <span class="val">{{ Math.round(maskOpacity * 100) }}%</span>
        </label>
        <div class="debug-status">
          <div class="status-row"><span>Mask:</span><span :class="maskReady ? 'ok' : 'err'">{{ maskReady ? '✅ ready' : '⏳…' }}</span></div>
          <div class="status-row"><span>Point cloud:</span><span :class="plyReady ? 'ok' : 'err'">{{ plyReady ? '✅ ready' : '⏳…' }}</span></div>
          <div class="status-row"><span>Floor plane:</span><span :class="planeReady ? 'ok' : 'err'">{{ planeReady ? '✅ fitted' : '⏳…' }}</span></div>
          <div class="status-row"><span>Chair:</span><span :class="chairLoaded ? 'ok' : 'err'">{{ chairLoaded ? '✅ yes' : '⏳…' }}</span></div>
          <div class="status-row"><span>Floor pts used:</span><span class="coord">{{ floorPtCount }}</span></div>
          <div class="status-row"><span>Floor Y (centroid):</span><span class="coord">{{ floorCentroidY.toFixed(4) }} m</span></div>
          <div class="status-row"><span>Floor normal:</span><span class="coord">{{ floorNormalDisplay }}</span></div>
          <div class="status-row"><span>Tilt angle:</span><span class="coord">{{ tiltAngleDeg.toFixed(2) }}°</span></div>
          <div class="status-row" v-if="lastHit">
            <span>Drag hit:</span>
            <span class="coord">x:{{ lastHit.x }} y:{{ lastHit.y }} z:{{ lastHit.z }}</span>
          </div>
        </div>
      </div>

      <!-- ── BOTTOM ACTION BAR ── -->
      <!-- <a-row>
        <a-col :lg="0" :md="0" :sm="24" :xs="24">
          <label style="display:flex;gap:5px;">
            <span>Furniture Rotation</span>
            <input type="range" min="0" max="360" step="1" v-model.number="chairRotation" @input="updateChairRotation" />
            <span style="display:flex;gap:5px;">{{ chairRotation }}°</span>
          </label>
        </a-col>
      </a-row> -->

      <div class="flex justify-between items-center py-2 px-2 bg-white w-full gap-2">
        <button
          @click="resetChairPosition"
          :disabled="!chairLoaded || !planeReady"
          style="font-family:Poppins;font-weight:500;font-size:14px;line-height:20px;letter-spacing:0%;text-align:center;background:#e5e7eb;padding:4px 24px;border-radius:6px;"
        >
          Recenter
        </button>

        <!-- <a-row>
          <a-col :lg="24" :md="24" :sm="0" :xs="0">
            <label style="display:flex;gap:5px;">
              <span>Furniture Rotation</span>
              <input type="range" min="0" max="360" step="1" v-model.number="chairRotation" @input="updateChairRotation" />
              <span style="display:flex;gap:5px;">{{ chairRotation }}°</span>
            </label>
          </a-col>
        </a-row> -->

        <a-button
          type="primary"
          @click="$emit('Apply-Changes', 'item-replacement-3d-renderer')"
          :disabled="!chairLoaded || !planeReady"
          style="padding:4px 12px;border-radius:6px;"
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


import ZoomInIcon from "@/assets/icons/zoomout.png";
import ZoomOutIcon from "@/assets/icons/zoomin.png";
import TapToSelect from "@/assets/icons/tap.png";
import DragToMove from "@/assets/icons/tapAndMove.png";
export default {
  name: 'itemre_placement_renderer_3d_ptcld',
  props: {
    isLoading: { type: Boolean, default: false },
    CAM_IMG_W: Object,
    CAM_IMG_H: Object,
    CAM_FX: Object,
    CAM_FY: Object,
    CAM_CX: Object,
    CAM_CY: Object,
    CAM_Z_SIGN: Object,
    MASK_ERODE_PX: Object,
    CAM_FOV_V: Object,
    POINTCLOUD: Object,
    CHAIR_MODEL: Object,
    FLOOR_MASK: Object,
    BASE_ROOT_MAIN_IMAGE: Object,
    TARGET_DIMS: Object,
    debug: Boolean,
    product_id: { type: String, required: true },
  },

  data() {
    return {

      isShowInstructionModal: false,
      instructionConfig: [
        {
          key: "Pinch out zoom out",
          value: ZoomInIcon,
        },
        { key: "Pinch in to zoom", value: ZoomOutIcon },
        {
          key: "Tap to select",
          value: TapToSelect,
        },
        {
          key: "Drag to move",
          value: DragToMove,
        }
      ],


      loadingText: 'Initializing...',
      modelLoadProgress: 0,
      modelLoading: false,
      // Internal loading state — true from mount until BOTH floor AND chair ready
      internalLoading: true,
      internalLoadingText: 'Loading assets…',
      animationFrameId: null,
      roomImage: null,
      threeContainer: null,
      maskOverlayCanvas: null,
      debugMask: false,
      debugPointCloud: false,
      debugFloorMesh: false,
      maskOpacity: 0.5,
      maskReady: false,
      plyReady: false,
      planeReady: false,
      chairLoaded: false,

      // ─── DRAG / ROTATE STATE (reactive for UI) ────────────────
      isDraggingRef: false,
      isRotatingRef: false,

      chairRotation: 0,        // degrees – kept in sync with ring drag
      lastHit: null,
      lastMaskResult: false,
      floorPtCount: 0,
      floorCentroidY: 0,
      CHAIR_SCALE_FACTOR: 1.0,
      chairBaseScaleX: 1,
      chairBaseScaleY: 1,
      chairBaseScaleZ: 1,
      _floorNX: 0,
      _floorNY: 1,
      _floorNZ: 0,

      // THREE.JS OBJECTS
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
      shadowReceiverMesh: null,
      floorPlaneTHREE: null,
      floorNormal3: null,
      floorCentroid3: null,
      plyPositions: null,
      plyPointCount: 0,
      maskCanvas: null,
      maskCtx: null,
      erodedMask: null,

      // ─── ROTATION RING ────────────────────────────────────────
      rotationRing: null,
      rotationArrows: [],
      showRotationRing: true,


      lastKnownPos:null,
      lastKnownQuat:null,
      lastKnownScale:null,
      _pendingTransformRestore:null,
    }
  },

  emits: [
    'update:isLoading',
    'insufficient-credits',
    'add-3d-furniture-to-room-start-polling',
    'rendered-comfyui-workflow',
    'Apply-Changes',
  ],

  computed: {
    loadingProxy: {
      get() { return this.isLoading },
      set(val) { this.$emit('update:isLoading', val) },
    },
    floorNormalDisplay() {
      return `(${this._floorNX.toFixed(4)}, ${this._floorNY.toFixed(4)}, ${this._floorNZ.toFixed(4)})`
    },
    tiltAngleDeg() {
      return (Math.acos(Math.min(1, Math.abs(this._floorNY))) * 180) / Math.PI
    },
  },

  created() {
    // ── Non-reactive internal state ──────────────────────────────
    this.floorNormal3        = markRaw(new THREE.Vector3(0, 1, 0))
    this.floorCentroid3      = markRaw(new THREE.Vector3())

    // Drag state
    this.isDragging          = false
    this.dragOffset          = markRaw(new THREE.Vector3())
    this.raycaster           = markRaw(new THREE.Raycaster())
    this.mouse               = markRaw(new THREE.Vector2())

    // Rotation-ring state
    this.isRotating          = false
    this.rotationStartAngle  = 0
    this.rotationStartMouseX = 0

    // ── Two-finger vertical swipe → rotate (mobile only) ─────
    // We track exactly 2 active pointer IDs. While both are held down,
    // vertical movement of their average Y position drives Y rotation.
    this.twoFingerPointers   = new Map()  // pointerId → clientY
    this.twoFingerStartAngle = 0          // chair.rotation.y when gesture began
    this.twoFingerStartAvgY  = 0          // avg clientY of both fingers at start
    this.isTwoFingerRotating = false


    this.lastKnownPos  = null
this.lastKnownQuat = null
this.lastKnownScale = null
this._pendingTransformRestore = null
  },

  mounted() {
    
    this.$nextTick(() => {
      this.roomImage         = this.$refs.roomImage
      this.threeContainer    = this.$refs.threeContainer
      this.maskOverlayCanvas = this.$refs.maskOverlayCanvas

      if (this.roomImage) {
        if (this.roomImage.complete && this.roomImage.naturalWidth > 0) {
          this.initThree()
        }
        // else @load="initThree" fires
      }
    })
  },

  beforeUnmount() {
    this.cleanup()
  },

  // ─────────────────────────────────────────────────────────────
  methods: {
 showInstructionModal() {
      this.isShowInstructionModal = true;
    },
    closeInstructionModal() {
      this.isShowInstructionModal = false;
    },
    // ── HELPERS ─────────────────────────────────────────────────

    resolveModelUrl(url) {
      if (!url) return url
      if (url.startsWith('http://') || url.startsWith('https://')) return url
      const base = this.$store.state.root_media_api
      return `${base}${url}`
    },

    _eventToNDC(clientX, clientY) {
      const el   = this.renderer.domElement
      const rect = el.getBoundingClientRect()
      const sx   = clientX - rect.left
      const sy   = clientY - rect.top
      return {
        ndcX:  (sx / rect.width)  *  2 - 1,
        ndcY: -(sy / rect.height) *  2 + 1,
        sx,
        sy,
      }
    },

    _getClient(event) {
      if (event.touches && event.touches.length > 0)
        return { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY }
      if (event.changedTouches && event.changedTouches.length > 0)
        return { clientX: event.changedTouches[0].clientX, clientY: event.changedTouches[0].clientY }
      return { clientX: event.clientX, clientY: event.clientY }
    },

    // ── INIT ────────────────────────────────────────────────────

    // initThree() {
    //   if (this.renderer) return

    //   // Signal parent and show internal overlay immediately
    //   this.$emit('update:isLoading', true)
    //   this.internalLoading     = true
    //   this.internalLoadingText = 'Loading room assets…'

    //   this.roomImage         = this.$refs.roomImage
    //   this.threeContainer    = this.$refs.threeContainer
    //   this.maskOverlayCanvas = this.$refs.maskOverlayCanvas

    //   if (!this.roomImage || !this.threeContainer) return

    //   const renderW = this.roomImage.naturalWidth  || this.CAM_IMG_W
    //   const renderH = this.roomImage.naturalHeight || this.CAM_IMG_H
    //   if (renderW === 0 || renderH === 0) return

    //   this.scene  = markRaw(new THREE.Scene())
    //   this.camera = markRaw(new THREE.PerspectiveCamera(this.CAM_FOV_V, renderW / renderH, 0.01, 200))
    //   this.camera.position.set(0, 0, 0)
    //   this.camera.lookAt(0, 0, -1)
    //   this.camera.updateProjectionMatrix()

    //   this.renderer = markRaw(new THREE.WebGLRenderer({ antialias: true, alpha: true }))
    //   this.renderer.setSize(renderW, renderH, false)
    //   this.renderer.setPixelRatio(1)
    //   this.renderer.outputColorSpace = THREE.SRGBColorSpace
    //   this.renderer.shadowMap.enabled = true
    //   this.renderer.shadowMap.type    = THREE.PCFSoftShadowMap

    //   this.threeContainer.appendChild(this.renderer.domElement)

    //   this.maskOverlayCanvas.width  = renderW
    //   this.maskOverlayCanvas.height = renderH

    //   this.adjustCanvasToAspectRatio()

    //   // ── LIGHTING ────────────────────────────────────────────
    //   this.scene.add(new THREE.AmbientLight(0xfff4e0, 1.2))

    //   const sun = new THREE.DirectionalLight(0xfff5e8, 2.0)
    //   sun.position.set(1.5, 5, -3)
    //   sun.castShadow = true
    //   sun.shadow.mapSize.set(2048, 2048)
    //   sun.shadow.camera.near = 0.1 ; sun.shadow.camera.far = 20
    //   sun.shadow.camera.left = sun.shadow.camera.bottom = -6
    //   sun.shadow.camera.right = sun.shadow.camera.top  =  6
    //   sun.shadow.bias       = -0.001
    //   sun.shadow.normalBias =  0.02
    //   this.scene.add(sun)

    //   const fill1 = new THREE.DirectionalLight(0xd0e8ff, 2.8)
    //   fill1.position.set(-2, 3, 2)
    //   this.scene.add(fill1)

    //   const fill2 = new THREE.DirectionalLight(0xe8f0ff, 0.6)
    //   fill2.position.set(3, 2, 1)
    //   this.scene.add(fill2)

    //   const back = new THREE.DirectionalLight(0xfff8e8, 0.5)
    //   back.position.set(0, 2, 4)
    //   this.scene.add(back)

    //   this.sofaSpotTarget = markRaw(new THREE.Object3D())
    //   this.sofaSpotTarget.position.set(-0.29, -1, -5.89)
    //   this.scene.add(this.sofaSpotTarget)

    //   this.sofaSpotLight = markRaw(new THREE.SpotLight(0xfff2cc, 2.0))
    //   this.sofaSpotLight.angle    = Math.PI / 6
    //   this.sofaSpotLight.penumbra = 0.6
    //   this.sofaSpotLight.decay    = 1.8
    //   this.sofaSpotLight.distance = 6
    //   this.sofaSpotLight.castShadow = true
    //   this.sofaSpotLight.shadow.mapSize.set(1024, 1024)
    //   this.sofaSpotLight.shadow.camera.near = 0.2
    //   this.sofaSpotLight.shadow.camera.far  = 8
    //   this.sofaSpotLight.shadow.bias = -0.001
    //   this.sofaSpotLight.target   = this.sofaSpotTarget
    //   this.sofaSpotLight.position.set(-0.29, 1.5, -5.89)
    //   this.scene.add(this.sofaSpotLight)

    //   // ── ASSETS + EVENTS ─────────────────────────────────────
    //   this.loadMask()
    //   this.loadPointCloud()
    //   this.loadChair()
    //   this.animate()

    //   // ── POINTER EVENTS ───────────────────────────────────────
    //   const el = this.renderer.domElement
    //   el.style.touchAction = 'none'

    //   el.addEventListener('pointerdown',   this.onPointerDown)
    //   el.addEventListener('pointermove',   this.onPointerMove)
    //   el.addEventListener('pointerup',     this.onPointerUp)
    //   el.addEventListener('pointercancel', this.onPointerUp)

    //   window.addEventListener('resize', this.adjustCanvasToAspectRatio)
    // },

    
    initThree() {
  if (this.renderer) return

  this.$emit('update:isLoading', true)
  this.internalLoading     = true
  this.internalLoadingText = 'Loading room assets…'

  this.roomImage         = this.$refs.roomImage
  this.threeContainer    = this.$refs.threeContainer
  this.maskOverlayCanvas = this.$refs.maskOverlayCanvas

  if (!this.roomImage || !this.threeContainer) return

  const renderW = this.roomImage.naturalWidth  || this.CAM_IMG_W
  const renderH = this.roomImage.naturalHeight || this.CAM_IMG_H
  if (renderW === 0 || renderH === 0) return

  this.scene  = markRaw(new THREE.Scene())
  this.camera = markRaw(new THREE.PerspectiveCamera(this.CAM_FOV_V, renderW / renderH, 0.01, 200))
  this.camera.position.set(0, 0, 0)
  this.camera.lookAt(0, 0, -1)
  this.camera.updateProjectionMatrix()

  this.renderer = markRaw(new THREE.WebGLRenderer({ antialias: true, alpha: true }))
  this.renderer.setSize(renderW, renderH, false)
  this.renderer.setPixelRatio(1)
  this.renderer.outputColorSpace = THREE.SRGBColorSpace
  this.renderer.shadowMap.enabled = true
  this.renderer.shadowMap.type    = THREE.PCFSoftShadowMap

  this.threeContainer.appendChild(this.renderer.domElement)

  this.maskOverlayCanvas.width  = renderW
  this.maskOverlayCanvas.height = renderH

  // ── LIGHTING ────────────────────────────────────────────
  this.scene.add(new THREE.AmbientLight(0xfff4e0, 1.2))

  const sun = new THREE.DirectionalLight(0xfff5e8, 2.0)
  sun.position.set(1.5, 5, -3)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.near = 0.1 ; sun.shadow.camera.far = 20
  sun.shadow.camera.left = sun.shadow.camera.bottom = -6
  sun.shadow.camera.right = sun.shadow.camera.top  =  6
  sun.shadow.bias       = -0.001
  sun.shadow.normalBias =  0.02
  this.scene.add(sun)

  const fill1 = new THREE.DirectionalLight(0xd0e8ff, 2.8)
  fill1.position.set(-2, 3, 2)
  this.scene.add(fill1)

  const fill2 = new THREE.DirectionalLight(0xe8f0ff, 0.6)
  fill2.position.set(3, 2, 1)
  this.scene.add(fill2)

  const back = new THREE.DirectionalLight(0xfff8e8, 0.5)
  back.position.set(0, 2, 4)
  this.scene.add(back)

  this.sofaSpotTarget = markRaw(new THREE.Object3D())
  this.sofaSpotTarget.position.set(-0.29, -1, -5.89)
  this.scene.add(this.sofaSpotTarget)

  this.sofaSpotLight = markRaw(new THREE.SpotLight(0xfff2cc, 2.0))
  this.sofaSpotLight.angle    = Math.PI / 6
  this.sofaSpotLight.penumbra = 0.6
  this.sofaSpotLight.decay    = 1.8
  this.sofaSpotLight.distance = 6
  this.sofaSpotLight.castShadow = true
  this.sofaSpotLight.shadow.mapSize.set(1024, 1024)
  this.sofaSpotLight.shadow.camera.near = 0.2
  this.sofaSpotLight.shadow.camera.far  = 8
  this.sofaSpotLight.shadow.bias = -0.001
  this.sofaSpotLight.target   = this.sofaSpotTarget
  this.sofaSpotLight.position.set(-0.29, 1.5, -5.89)
  this.scene.add(this.sofaSpotLight)

  // ── ASSETS + EVENTS ─────────────────────────────────────
  this.loadMask()
  this.loadPointCloud()
  this.loadChair()
  this.animate()

  // ── POINTER EVENTS ───────────────────────────────────────
  const el = this.renderer.domElement
// 'pan-y' lets the browser scroll vertically when the pointer lands
// on empty space; we call preventDefault only when hitting the model or ring.
el.style.touchAction = 'pan-y'

  el.addEventListener('pointerdown',   this.onPointerDown)
  el.addEventListener('pointermove',   this.onPointerMove)
  el.addEventListener('pointerup',     this.onPointerUp)
  el.addEventListener('pointercancel', this.onPointerUp)

  window.addEventListener('resize', this.adjustCanvasToAspectRatio)

  // ── CRITICAL FIX: defer sizing so DOM is fully laid out ──
  // Without this, cached images trigger initThree before the
  // container has non-zero getBoundingClientRect dimensions,
  // causing the canvas to be sized incorrectly and bleed out.
  this.$nextTick(() => {
    this.adjustCanvasToAspectRatio()
    // Second pass for stubborn cached-image edge cases
    setTimeout(() => this.adjustCanvasToAspectRatio(), 150)
  })
},
    // adjustCanvasToAspectRatio() {
    //   if (!this.renderer || !this.roomImage) return
    //   const container = this.$refs.threeContainer
    //   if (!container) return

    //   const containerRect = container.getBoundingClientRect()
    //   const availableW    = Math.floor(containerRect.width)
    //   const availableH    = Math.floor(containerRect.height)
    //   if (availableW === 0 || availableH === 0) return

    //   const imgAspect = (this.roomImage.naturalWidth  || this.CAM_IMG_W) /
    //                     (this.roomImage.naturalHeight || this.CAM_IMG_H)

    //   let cssW = availableW
    //   let cssH = Math.round(cssW / imgAspect)
    //   if (cssH > availableH) {
    //     cssH = availableH
    //     cssW = Math.round(cssH * imgAspect)
    //   }

    //   this.renderer.domElement.style.width  = `${cssW}px`
    //   this.renderer.domElement.style.height = `${cssH}px`
    //   this.maskOverlayCanvas.style.width    = `${cssW}px`
    //   this.maskOverlayCanvas.style.height   = `${cssH}px`

    //   // Refit ring whenever canvas resizes
    //   if (this.rotationRing) this._fitRingToCanvas()
    // },

  adjustCanvasToAspectRatio() {
  if (!this.renderer || !this.roomImage) return
  const container = this.$refs.threeContainer
  if (!container) return

  const containerRect = container.getBoundingClientRect()
  const availableW    = Math.floor(containerRect.width)
  const availableH    = Math.floor(containerRect.height)

  if (availableW === 0 || availableH === 0) {
    setTimeout(() => this.adjustCanvasToAspectRatio(), 100)
    return
  }

  const naturalW = this.roomImage.naturalWidth  || this.CAM_IMG_W
  const naturalH = this.roomImage.naturalHeight || this.CAM_IMG_H

  if (!naturalW || !naturalH) {
    setTimeout(() => this.adjustCanvasToAspectRatio(), 100)
    return
  }

  const imgAspect = naturalW / naturalH

  let cssW = availableW
  let cssH = Math.round(cssW / imgAspect)
  if (cssH > availableH) {
    cssH = availableH
    cssW = Math.round(cssH * imgAspect)
  }

  // Clamp
  cssW = Math.min(cssW, availableW)
  cssH = Math.min(cssH, availableH)

  // ── CRITICAL FIX: compute centering offsets ──────────────
  // .three-layer centers the canvas via flexbox, but mask-overlay
  // is position:absolute top:0 left:0 — it must be manually offset
  // to align exactly with the displayed image (object-fit:contain).
  const offsetX = Math.round((availableW - cssW) / 2)
  const offsetY = Math.round((availableH - cssH) / 2)

  // Three.js canvas — centered by flexbox, just set size
  this.renderer.domElement.style.width  = `${cssW}px`
  this.renderer.domElement.style.height = `${cssH}px`

  // Mask overlay — must be manually positioned to match image
  this.maskOverlayCanvas.style.width  = `${cssW}px`
  this.maskOverlayCanvas.style.height = `${cssH}px`
  this.maskOverlayCanvas.style.left   = `${offsetX}px`
  this.maskOverlayCanvas.style.top    = `${offsetY}px`

  if (this.rotationRing) this._fitRingToCanvas()
},
    // ── POINTER EVENTS ──────────────────────────────────────────
    //
    // Three mutually-exclusive gestures:
    //   A) Single pointer on ring arrow  → ring-arrow rotation
    //   B) Single pointer on model body  → drag/translate
    //   C) Two fingers anywhere (mobile) → two-finger vertical swipe rotation
    //
    // (C) is detected via the Pointer Events API: we track all active touch
    // pointers in this.twoFingerPointers. As soon as a 2nd touch lands we
    // cancel any in-progress drag/arrow-rotation and start swipe-rotation.

    onPointerDown(event) {
      if (!this.chair || !this.floorPlaneTHREE) return

      // ── Track all touch pointers for two-finger gesture ─────
      if (event.pointerType === 'touch') {
        this.twoFingerPointers.set(event.pointerId, event.clientY)

        // When the 2nd finger lands → switch to two-finger rotation
        if (this.twoFingerPointers.size === 2) {
          // Cancel any single-finger action that was in progress
          this.isDragging    = false
          this.isDraggingRef = false
          this.isRotating    = false
          this.isRotatingRef = false

          // Snapshot start state
          const vals = Array.from(this.twoFingerPointers.values())
          this.twoFingerStartAvgY  = (vals[0] + vals[1]) / 2
          this.twoFingerStartAngle = this.chair.rotation.y
          this.isTwoFingerRotating = true

          event.preventDefault()
          return
        }

        // If a 2-finger gesture is already running, just update and return
        if (this.isTwoFingerRotating) {
          event.preventDefault()
          return
        }
      }

      // ── Single-pointer path (mouse or first touch finger) ────
      // Block if a 2-finger gesture is active
      if (this.isTwoFingerRotating) return

      const { clientX, clientY } = event
      const { ndcX, ndcY } = this._eventToNDC(clientX, clientY)
      this.mouse.set(ndcX, ndcY)
      this.raycaster.setFromCamera(this.mouse, this.camera)

      // 1. Check rotation ring arrows first
      if (this.rotationRing && this.showRotationRing) {
        const arrowHits = this.raycaster.intersectObject(this.rotationRing, true)
        const arrowHit  = arrowHits.find(h => h.object.userData.isRotationArrow)

        if (arrowHit) {
          const visMesh = arrowHit.object.userData.visMesh
          if (visMesh) visMesh.material.color.setHex(0xff6600)

          this.isRotating          = true
          this.isRotatingRef       = true
          this.rotationStartAngle  = this.chair.rotation.y
          this.rotationStartMouseX = ndcX

          this.renderer.domElement.setPointerCapture(event.pointerId)
          event.preventDefault()
          return
        }
      }

      // 2. Check model body for dragging
      const hits = this.raycaster.intersectObject(this.chair, true)
      if (hits.length === 0) return

      this.chair.visible = false
      const floorHit = this.raycastFloor()
      this.chair.visible = true
      if (!floorHit) return

      this.dragOffset.set(
        this.chair.position.x - floorHit.x,
        0,
        this.chair.position.z - floorHit.z,
      )

      this.isDragging    = true
      this.isDraggingRef = true

      this.renderer.domElement.setPointerCapture(event.pointerId)
      event.preventDefault()
    },

    onPointerMove(event) {
      // ── Two-finger rotation (mobile) ─────────────────────────
      if (event.pointerType === 'touch' && this.isTwoFingerRotating) {
        if (!this.twoFingerPointers.has(event.pointerId)) return

        // Update the moved finger's Y
        this.twoFingerPointers.set(event.pointerId, event.clientY)

        if (this.twoFingerPointers.size === 2) {
          const vals   = Array.from(this.twoFingerPointers.values())
          const avgY   = (vals[0] + vals[1]) / 2
          const deltaY = avgY - this.twoFingerStartAvgY

          // Sensitivity: dragging the full canvas height (screenH px) = 360°
          const screenH  = this.renderer.domElement.clientHeight || window.innerHeight
          const deltaRad = (deltaY / screenH) * Math.PI * 2   // ↓ swipe = positive rotation

          const newRotY = this.twoFingerStartAngle + deltaRad
          this.chair.rotation.y = newRotY
          this.chairRotation = ((THREE.MathUtils.radToDeg(newRotY) % 360) + 360) % 360
          this._snapRingToChair()
        }

        event.preventDefault()
        return
      }

      // ── Single-pointer path ──────────────────────────────────
      if (event.pointerType === 'touch' && event.isPrimary === false) return
      if (!this.isDragging && !this.isRotating) return

      const { clientX, clientY } = event
      const { ndcX, ndcY, sx, sy } = this._eventToNDC(clientX, clientY)
      this.mouse.set(ndcX, ndcY)

      // Arrow rotation
      if (this.isRotating) {
        const deltaX  = ndcX - this.rotationStartMouseX
        const newRotY = this.rotationStartAngle + deltaX * Math.PI * 2
        this.chair.rotation.y = newRotY
        this.chairRotation = ((THREE.MathUtils.radToDeg(newRotY) % 360) + 360) % 360
        this._snapRingToChair()
        event.preventDefault()
        return
      }

      // Model drag
      if (this.isDragging) {
        this.raycaster.setFromCamera(this.mouse, this.camera)

        this.chair.visible = false
        const floorHit = this.raycastFloor()
        this.chair.visible = true
        if (!floorHit) return

        this.lastHit = {
          x: floorHit.x.toFixed(3),
          y: floorHit.y.toFixed(3),
          z: floorHit.z.toFixed(3),
        }
        this.lastMaskResult = this.isOnFloorMask(sx, sy)

        const newX = floorHit.x + this.dragOffset.x
        const newZ = floorHit.z + this.dragOffset.z

        const n = this.floorNormal3
        const d = this.floorPlaneTHREE.constant
        let newY = this.floorCentroid3.y
        if (Math.abs(n.y) > 1e-6) {
          newY = (-d - n.x * newX - n.z * newZ) / n.y
        }

        this.chair.position.set(newX, newY + this.chairHalfH * n.y, newZ)
        this.chair.position.addScaledVector(n, this.chairHalfH)
        this._snapRingToChair()
        this.snapLightToChair()

        event.preventDefault()
      }
    },

// ── STEP 3: Add _saveLastKnownTransform helper ───────────────────────────────
// Reads raw numeric values from the chair — no Vector3 references, no proxies.
_saveLastKnownTransform() {
  if (!this.chair) return

  this.lastKnownPos = {
    x: this.chair.position.x,
    y: this.chair.position.y,
    z: this.chair.position.z,
  }
  this.lastKnownQuat = {
    x: this.chair.quaternion.x,
    y: this.chair.quaternion.y,
    z: this.chair.quaternion.z,
    w: this.chair.quaternion.w,
  }
  this.lastKnownScale = {
    x: this.chair.scale.x,
    y: this.chair.scale.y,
    z: this.chair.scale.z,
  }

  console.log('[lastKnown saved] pos:', this.lastKnownPos,
              'rot.y:', THREE.MathUtils.radToDeg(this.chair.rotation.y).toFixed(1) + '°')
},

// ── STEP 2: Replace onPointerUp entirely ──────────────────────────────────────
onPointerUp(event) {
  // ── Two-finger gesture cleanup ─────────────────────────────────────────────
  if (event.pointerType === 'touch') {
    this.twoFingerPointers.delete(event.pointerId)

    if (this.twoFingerPointers.size < 2 && this.isTwoFingerRotating) {
      this.isTwoFingerRotating = false
      // ✅ Save transform after two-finger rotation ends
      this._saveLastKnownTransform()
      this._emitTransformUpdate()
      return
    }
    if (this.isTwoFingerRotating) return
  }

  // Restore highlighted arrow colour
  if (this.isRotating && this.rotationRing) {
    this.rotationRing.traverse((child) => {
      if (child.userData && child.userData.visMesh) {
        child.userData.visMesh.material.color.setHex(child.userData.originalColor)
      }
      if (child.userData && child.userData.isRotationArrow && child.material && child.material.color) {
        child.material.color.setHex(child.userData.originalColor)
      }
    })
  }

  this.isDragging    = false
  this.isDraggingRef = false
  this.isRotating    = false
  this.isRotatingRef = false

  try { this.renderer.domElement.releasePointerCapture(event.pointerId) } catch (_) {}

  // ✅ Save transform after every drag/rotate ends
  this._saveLastKnownTransform()
  this._emitTransformUpdate()
},
    // ── READY CHECK ─────────────────────────────────────────────
    // Called whenever floor OR chair finishes loading.
    // Only hides the overlay once BOTH are ready together.
    _checkAllReady() {
      if (this.planeReady && this.chairLoaded) {
        this.internalLoading     = false
        this.internalLoadingText = ''
        this.$emit('update:isLoading', false)
      } else if (!this.chairLoaded && !this.planeReady) {
        this.internalLoadingText = 'Loading assets…'
      } else if (!this.planeReady) {
        this.internalLoadingText = 'Fitting floor plane…'
      } else {
        this.internalLoadingText = 'Loading 3D model…'
      }
    },

    // ── FLOOR RAYCAST ───────────────────────────────────────────

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

    // ── ROTATION RING ───────────────────────────────────────────

    /**
     * Builds a thin white circle LINE with 4 flat cyan triangle arrowheads.
     * Each arrow also gets a large INVISIBLE hit-disc behind it so the
     * raycaster can detect clicks/touches reliably regardless of camera angle.
     *
     * Ring lies flat in XZ (Y=0 local). _snapRingToChair() tilts the whole
     * group to align with the fitted floor normal.
     */
    createRotationRing() {
      this._disposeRotationRing()

      const ring = new THREE.Group()
      ring.name  = 'rotationRing'

      const RADIUS       = 1.0
      const SEGMENTS     = 128
      const LINE_COLOR   = 0xffffff  // white ring line
      const ARROW_COLOR  = 0x00e5ff  // cyan arrowheads
      const ARROW_ANGLES = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5]

      // ── 1. Thin white circle outline ────────────────────────
      const circlePoints = []
      for (let i = 0; i <= SEGMENTS; i++) {
        const a = (i / SEGMENTS) * Math.PI * 2
        circlePoints.push(new THREE.Vector3(Math.cos(a) * RADIUS, 0, Math.sin(a) * RADIUS))
      }
      const circleLine = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(circlePoints),
        new THREE.LineBasicMaterial({ color: LINE_COLOR, linewidth: 2 }),
      )
      ring.add(circleLine)

      // ── 2. Per-arrow: visible triangle + invisible hit disc ──
      this.rotationArrows = []

      const AW    = 0.13  // arrowhead half-width
      const AH    = 0.22  // arrowhead length
      const HIT_R = 0.32  // invisible hit-disc radius (generous for easy touch)

      ARROW_ANGLES.forEach((angle) => {
        // Clockwise tangent direction in XZ at this angle
        const tx =  Math.sin(angle)
        const tz = -Math.cos(angle)
        // Radially-inward direction (spreads the arrowhead base)
        const nx = -Math.cos(angle)
        const nz = -Math.sin(angle)

        const cx = Math.cos(angle) * RADIUS  // centre X on ring
        const cz = Math.sin(angle) * RADIUS  // centre Z on ring

        // ── Visible cyan triangle ─────────────────────────────
        const visGeo = new THREE.BufferGeometry()
        visGeo.setAttribute('position', new THREE.Float32BufferAttribute([
          cx + tx * AH,  0, cz + tz * AH,   // tip
          cx + nx * AW,  0, cz + nz * AW,   // base left
          cx - nx * AW,  0, cz - nz * AW,   // base right
        ], 3))
        visGeo.setIndex([0, 1, 2])
        visGeo.computeVertexNormals()

        const visMesh = new THREE.Mesh(
          visGeo,
          new THREE.MeshBasicMaterial({ color: ARROW_COLOR, side: THREE.DoubleSide }),
        )
        // Disable raycasting on the visual mesh — the hit disc handles it
        visMesh.raycast = () => {}
        ring.add(visMesh)

        // ── Invisible hit-disc ────────────────────────────────
        // CircleGeometry lies in XY; rotate -90° around X to lay flat in XZ.
        // This gives a fat, camera-ray-friendly hit target around each arrow.
        const hitMesh = new THREE.Mesh(
          new THREE.CircleGeometry(HIT_R, 20),
          new THREE.MeshBasicMaterial({
            transparent: true,
            opacity:     0,           // fully invisible
            side:        THREE.DoubleSide,
            depthWrite:  false,
          }),
        )
        hitMesh.rotation.x  = -Math.PI / 2   // XY → XZ
        hitMesh.position.set(cx, 0.002, cz)  // tiny Y lift avoids z-fighting
        hitMesh.userData = {
          isRotationArrow: true,
          originalColor:   ARROW_COLOR,
          visMesh,                    // ref to highlight the visible arrow on drag
        }
        ring.add(hitMesh)
        this.rotationArrows.push(hitMesh)  // raycaster targets these
      })

      ring.visible      = this.showRotationRing
      this.rotationRing = markRaw(ring)
      this.scene.add(ring)
    },

    /** Snap ring position + tilt to match floor normal under the chair. */
    _snapRingToChair() {
      if (!this.rotationRing || !this.chair) return

      // Sit just above the floor surface to avoid z-fighting
      this.rotationRing.position.copy(this.chair.position)
      this.rotationRing.position.addScaledVector(this.floorNormal3, 0.012)

      // Tilt the flat XZ ring so it aligns with the actual floor plane normal
      const worldUp = new THREE.Vector3(0, 1, 0)
      const fn      = this.floorNormal3.clone().normalize()
      const tiltQ   = new THREE.Quaternion().setFromUnitVectors(worldUp, fn)
      this.rotationRing.quaternion.copy(tiltQ)

      this._fitRingToCanvas()
    },

    /**
     * Scale the ring group so the circle appears roughly the same
     * pixel size regardless of how far away the model is.
     * We project the chair centre to screen space and compute a
     * scale that makes the ring diameter ≈ 110 % of the model's
     * screen-space bounding width, similar to the reference UI.
     */
    _fitRingToCanvas() {
      if (!this.rotationRing || !this.renderer || !this.chair || !this.camera) return

      // Project chair world position to NDC, then derive a world-space scale
      // that makes the ring fill a sensible portion of the view.
      //
      // Strategy: measure the model's approximate world-space footprint width
      // (TARGET_DIMS.width or fallback) and set ring radius to 60 % larger.
      let footprintHalf = 0.6   // fallback half-width in world units
      if (this.TARGET_DIMS && this.TARGET_DIMS.width) {
        footprintHalf = (parseFloat(this.TARGET_DIMS.width) / 2) * 1.35
      }

      // Ring geometry was built with radius = 1.0, so scale = desired radius
      const desiredRadius = Math.max(0.25, footprintHalf)
      this.rotationRing.scale.setScalar(desiredRadius)
    },

    _disposeRotationRing() {
      if (!this.rotationRing) return
      this.scene.remove(this.rotationRing)
      this.rotationRing.traverse((child) => {
        if (child.geometry) child.geometry.dispose()
        if (child.material) child.material.dispose()
      })
      this.rotationRing  = null
      this.rotationArrows = []
    },

    // ── CHAIR LOAD / RELOAD ─────────────────────────────────────

    reloadChair() {
      if (!this.scene) { console.warn('⚠️ reloadChair: scene not ready'); return }

      this.isDragging          = false
      this.isDraggingRef       = false
      this.isRotating          = false
      this.isRotatingRef       = false
      this.chairLoaded         = false
      this.internalLoading     = true
      this.internalLoadingText = 'Loading 3D model…'

      // Remove old ring
      this._disposeRotationRing()

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

      this.chairRotation    = 0
      this.modelLoadProgress = 0
      this.modelLoading     = true

      const modelUrl = this.resolveModelUrl(this.CHAIR_MODEL)

      new GLTFLoader().load(
        modelUrl,
        (gltf) => {
          const innerMesh = gltf.scene
          innerMesh.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
          innerMesh.position.set(0, 0, 0)
          innerMesh.rotation.set(0, 0, 0)
          innerMesh.scale.set(1, 1, 1)
          innerMesh.updateMatrixWorld(true)

          const flippedBox  = new THREE.Box3().setFromObject(innerMesh)
          const flippedSize = new THREE.Vector3()
          flippedBox.getSize(flippedSize)

          const fovRad = (this.CAM_FOV_V * Math.PI) / 180
          const fy_threejs        = this.CAM_IMG_H / 2 / Math.tan(fovRad / 2)
          const focalCorrection   = this.CAM_FY / fy_threejs

          const sx = flippedSize.x > 0 ? (this.TARGET_DIMS.width  * this.CHAIR_SCALE_FACTOR * focalCorrection) / flippedSize.x : 1
          const sy = flippedSize.y > 0 ? (this.TARGET_DIMS.height * this.CHAIR_SCALE_FACTOR * focalCorrection) / flippedSize.y : 1
          const sz = flippedSize.z > 0 ? (this.TARGET_DIMS.depth  * this.CHAIR_SCALE_FACTOR * focalCorrection) / flippedSize.z : 1
          innerMesh.scale.set(sx, sy, sz)
          innerMesh.updateMatrixWorld(true)

          this.chairBaseScaleX = sx ; this.chairBaseScaleY = sy ; this.chairBaseScaleZ = sz

          const pivotGroup = new THREE.Group()
          pivotGroup.add(innerMesh)
          this.scene.add(pivotGroup)

          const scaledBox = new THREE.Box3().setFromObject(pivotGroup)
          innerMesh.position.y -= scaledBox.min.y
          innerMesh.updateMatrixWorld(true)

          this.chairHalfH        = 0.001
          this.chair             = markRaw(pivotGroup)
          this.chairLoaded       = true
          this.modelLoadProgress = 100
          this.modelLoading      = false

         if (this.planeReady) {
            this.placeChairOnFloor()
            this.createRotationRing()
            this._snapRingToChair()

            // ✅ Restore previous drag position if parent preserved it
            if (this._pendingTransformRestore) {
              this._applyPendingTransform()
            }
          }
          this._checkAllReady()
        },
        xhr => { if (xhr.total > 0) this.modelLoadProgress = Math.round((xhr.loaded / xhr.total) * 100) },
        err => { console.error('❌ Chair reload failed:', err); this.modelLoading = false; this._checkAllReady() },
      )
    },

    loadChair() {
      const modelUrl = this.resolveModelUrl(this.CHAIR_MODEL)
      if (!modelUrl) { console.warn('⚠️ loadChair: no model URL'); return }
      new GLTFLoader().load(
        modelUrl,
        (gltf) => {
          const innerMesh = gltf.scene
          innerMesh.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
          innerMesh.position.set(0, 0, 0)
          innerMesh.rotation.set(0, 0, 0)
          innerMesh.scale.set(1, 1, 1)
          innerMesh.updateMatrixWorld(true)

          const flippedBox  = new THREE.Box3().setFromObject(innerMesh)
          const flippedSize = new THREE.Vector3()
          flippedBox.getSize(flippedSize)

          const fovRad = (this.CAM_FOV_V * Math.PI) / 180
          const fy_threejs      = this.CAM_IMG_H / 2 / Math.tan(fovRad / 2)
          const focalCorrection = this.CAM_FY / fy_threejs

          const sx = flippedSize.x > 0 ? (this.TARGET_DIMS.width  * this.CHAIR_SCALE_FACTOR * focalCorrection) / flippedSize.x : 1
          const sy = flippedSize.y > 0 ? (this.TARGET_DIMS.height * this.CHAIR_SCALE_FACTOR * focalCorrection) / flippedSize.y : 1
          const sz = flippedSize.z > 0 ? (this.TARGET_DIMS.depth  * this.CHAIR_SCALE_FACTOR * focalCorrection) / flippedSize.z : 1
          innerMesh.scale.set(sx, sy, sz)
          innerMesh.updateMatrixWorld(true)

          this.chairBaseScaleX = sx ; this.chairBaseScaleY = sy ; this.chairBaseScaleZ = sz

          const pivotGroup = new THREE.Group()
          pivotGroup.add(innerMesh)
          this.scene.add(pivotGroup)

          const scaledBox = new THREE.Box3().setFromObject(pivotGroup)
          innerMesh.position.y -= scaledBox.min.y
          innerMesh.updateMatrixWorld(true)

          this.chairHalfH  = 0.001
          this.chair       = markRaw(pivotGroup)
          this.chairLoaded = true

          if (this.planeReady) {
            this.placeChairOnFloor()
            this.createRotationRing()
            this._snapRingToChair()
          }
          this._checkAllReady()
        },
        xhr => { if (xhr.total > 0) console.log(`Loading: ${Math.round((xhr.loaded / xhr.total) * 100)}%`) },
        err => { console.error('❌ Chair load failed:', err); this._checkAllReady() },
      )
    },

    // ── PLACEMENT ───────────────────────────────────────────────

    placeChairOnFloor(worldX = null, worldZ = null) {
      if (!this.chair || !this.floorPlaneTHREE) return

      const x = worldX ?? this.floorCentroid3.x
      const z = worldZ ?? this.floorCentroid3.z

      const n = this.floorNormal3
      const d = this.floorPlaneTHREE.constant
      let y   = this.floorCentroid3.y
      if (Math.abs(n.y) > 1e-6) y = (-d - n.x * x - n.z * z) / n.y

      this.chair.position.set(x, y, z)
      this.chair.position.addScaledVector(n, this.chairHalfH)

      this.alignChairToFloor()
      this.snapLightToChair()
    },

    resetChairPosition() {
      if (!this.chair || !this.planeReady) return
      this.chairRotation = 0
      this.placeChairOnFloor(this.floorCentroid3.x, this.floorCentroid3.z)
      if (this.rotationRing) this._snapRingToChair()
    },

    alignChairToFloor() {
      if (!this.chair) return
      const worldUp = new THREE.Vector3(0, 1, 0)
      const fn      = this.floorNormal3.clone().normalize()
      const tiltQ   = new THREE.Quaternion().setFromUnitVectors(worldUp, fn)
      const spinQ   = new THREE.Quaternion().setFromAxisAngle(fn, (this.chairRotation * Math.PI) / 180)
      this.chair.quaternion.multiplyQuaternions(spinQ, tiltQ)
    },

    updateChairRotation() {
      if (this.chair && this.planeReady) {
        this.alignChairToFloor()
        if (this.rotationRing) this._snapRingToChair()
      }
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

    // ── MASK ────────────────────────────────────────────────────

    loadMask() {
      const img = new Image()
      img.src = this.FLOOR_MASK
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        this.maskCanvas = document.createElement('canvas')
        this.maskCanvas.width  = this.CAM_IMG_W
        this.maskCanvas.height = this.CAM_IMG_H
        this.maskCtx = this.maskCanvas.getContext('2d')
        this.maskCtx.drawImage(img, 0, 0, this.CAM_IMG_W, this.CAM_IMG_H)
        const raw    = this.maskCtx.getImageData(0, 0, this.CAM_IMG_W, this.CAM_IMG_H).data
        const binary = new Uint8Array(this.CAM_IMG_W * this.CAM_IMG_H)
        for (let i = 0; i < this.CAM_IMG_W * this.CAM_IMG_H; i++) binary[i] = raw[i * 4] > 127 ? 1 : 0
        this.erodedMask = this.erodeBinaryMask(binary, this.CAM_IMG_W, this.CAM_IMG_H, this.MASK_ERODE_PX)
        this.maskReady  = true
        this.internalLoadingText = 'Analysing floor…'
        if (this.debugMask) this.drawMaskOverlay()
        this.tryComputeFloor()
      }
      img.onerror = () => {
        this.erodedMask = new Uint8Array(this.CAM_IMG_W * this.CAM_IMG_H).fill(1)
        this.maskReady  = true
        this.internalLoadingText = 'Analysing floor…'
        this.tryComputeFloor()
      }
    },

    isOnFloorMask(screenX, screenY) {
      if (!this.maskCtx) return true
      const cx = Math.round((screenX / this.maskOverlayCanvas.clientWidth)  * this.CAM_IMG_W)
      const cy = Math.round((screenY / this.maskOverlayCanvas.clientHeight) * this.CAM_IMG_H)
      const d  = this.maskCtx.getImageData(
        Math.max(0, Math.min(this.CAM_IMG_W - 1, cx)),
        Math.max(0, Math.min(this.CAM_IMG_H - 1, cy)),
        1, 1,
      ).data
      return d[0] > 127
    },

    drawMaskOverlay() {
      if (!this.maskCtx || !this.maskOverlayCanvas) return
      const ovCtx = this.maskOverlayCanvas.getContext('2d')
      ovCtx.clearRect(0, 0, this.maskOverlayCanvas.width, this.maskOverlayCanvas.height)
      const src = this.maskCtx.getImageData(0, 0, this.CAM_IMG_W, this.CAM_IMG_H)
      const dst = new ImageData(this.CAM_IMG_W, this.CAM_IMG_H)
      const W   = this.CAM_IMG_W
      for (let i = 0; i < W * this.CAM_IMG_H; i++) {
        const floor  = src.data[i * 4] > 127
        const eroded = this.erodedMask ? this.erodedMask[i] : floor
        if (floor && eroded)       { dst.data[i*4]=0;   dst.data[i*4+1]=210; dst.data[i*4+2]=90;  dst.data[i*4+3]=160 }
        else if (floor && !eroded) { dst.data[i*4]=255; dst.data[i*4+1]=200; dst.data[i*4+2]=0;   dst.data[i*4+3]=130 }
        else                       { dst.data[i*4]=220; dst.data[i*4+1]=40;  dst.data[i*4+2]=40;  dst.data[i*4+3]=70  }
      }
      const tmp = document.createElement('canvas')
      tmp.width = this.CAM_IMG_W ; tmp.height = this.CAM_IMG_H
      tmp.getContext('2d').putImageData(dst, 0, 0)
      ovCtx.drawImage(tmp, 0, 0, this.maskOverlayCanvas.width, this.maskOverlayCanvas.height)
    },

    clearMaskOverlay() {
      if (!this.maskOverlayCanvas) return
      this.maskOverlayCanvas.getContext('2d').clearRect(0, 0, this.maskOverlayCanvas.width, this.maskOverlayCanvas.height)
    },

    // ── POINT CLOUD ─────────────────────────────────────────────

    loadPointCloud() {
      new PLYLoader().load(this.POINTCLOUD, (geo) => {
        const posAttr = geo.getAttribute('position')
        this.plyPositions  = posAttr.array
        this.plyPointCount = posAttr.count
        const hasColor = geo.hasAttribute('color')
        const mat = new THREE.PointsMaterial({ size: 0.025, vertexColors: hasColor, color: hasColor ? undefined : 0x00ccff })
        this.pointCloudObj = markRaw(new THREE.Points(geo, mat))
        this.pointCloudObj.visible = this.debugPointCloud
        this.scene.add(this.pointCloudObj)
        this.plyReady = true
        this.internalLoadingText = 'Fitting floor plane…'
        this.tryComputeFloor()
      })
    },

    // ── FLOOR FITTING ────────────────────────────────────────────

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
        for (let x = 0; x < W; x++) prefix[x+1] = prefix[x] + binary[y*W+x]
        for (let x = 0; x < W; x++) {
          const lo = Math.max(0, x-radius); const hi = Math.min(W-1, x+radius)
          tmp[y*W+x] = prefix[hi+1]-prefix[lo] === hi-lo+1 ? 1 : 0
        }
      }
      const out = new Uint8Array(W * H)
      for (let x = 0; x < W; x++) {
        const prefix = new Int32Array(H + 1)
        for (let y = 0; y < H; y++) prefix[y+1] = prefix[y] + tmp[y*W+x]
        for (let y = 0; y < H; y++) {
          const lo = Math.max(0, y-radius); const hi = Math.min(H-1, y+radius)
          out[y*W+x] = prefix[hi+1]-prefix[lo] === hi-lo+1 ? 1 : 0
        }
      }
      return out
    },

    fitFloorPlane(pts) {
      const N = pts.length
      if (N < 3) return null
      let sx2=0,sxz=0,sx=0,sz2=0,sz=0,sxy=0,szy=0,sy=0
      for (const [x,y,z] of pts) { sx2+=x*x;sxz+=x*z;sx+=x;sz2+=z*z;sz+=z;sxy+=x*y;szy+=z*y;sy+=y }
      const M = [[sx2,sxz,sx],[sxz,sz2,sz],[sx,sz,N]]
      const b = [sxy,szy,sy]
      const coeffs = this.gaussElim3(M, b)
      if (!coeffs) return null
      const [a,bCoeff,c] = coeffs
      const nx=a,ny=-1,nz=bCoeff
      const len = Math.sqrt(nx*nx+ny*ny+nz*nz)
      const sign=-1
      return { normal: new THREE.Vector3(sign*nx/len,sign*ny/len,sign*nz/len), a, b:bCoeff, c }
    },

    gaussElim3(M, b) {
      const A = M.map((r,i) => [...r, b[i]])
      for (let col=0;col<3;col++) {
        let maxRow=col,maxVal=Math.abs(A[col][col])
        for (let row=col+1;row<3;row++) { if (Math.abs(A[row][col])>maxVal) { maxVal=Math.abs(A[row][col]);maxRow=row } }
        ;[A[col],A[maxRow]]=[A[maxRow],A[col]]
        if (Math.abs(A[col][col])<1e-12) return null
        for (let row=col+1;row<3;row++) { const f=A[row][col]/A[col][col]; for (let k=col;k<=3;k++) A[row][k]-=f*A[col][k] }
      }
      const x=[0,0,0]
      for (let i=2;i>=0;i--) { x[i]=A[i][3]; for (let j=i+1;j<3;j++) x[i]-=A[i][j]*x[j]; x[i]/=A[i][i] }
      return x
    },

    tryComputeFloor() {
      if (!this.plyReady || !this.maskReady) return
      const floorPts = []
      for (let i=0;i<this.plyPointCount;i++) {
        const x=this.plyPositions[i*3+0],y=this.plyPositions[i*3+1],z=this.plyPositions[i*3+2]
        const px=this.projectToPixel(x,y,z)
        if (!px) continue
        if (this.erodedMask[px.v*this.CAM_IMG_W+px.u]===1) floorPts.push([x,y,z])
      }
      this.floorPtCount = floorPts.length
      if (floorPts.length < 10) { console.error('❌ Too few floor points'); return }

      let cx=0,cy=0,cz=0
      for (const [x,y,z] of floorPts) { cx+=x;cy+=y;cz+=z }
      cx/=floorPts.length; cy/=floorPts.length; cz/=floorPts.length
      this.floorCentroid3.set(cx,cy,cz)
      this.floorCentroidY=cy

      const fit = this.fitFloorPlane(floorPts)
      if (!fit) { console.error('❌ Plane fit failed'); return }

      this.floorNormal3.copy(fit.normal)
      if (this.floorNormal3.y < 0) this.floorNormal3.negate()
      const tiltDeg=(Math.acos(Math.min(1,this.floorNormal3.y))*180)/Math.PI
      if (tiltDeg > 20) this.floorNormal3.set(0,1,0)

      this._floorNX=fit.normal.x; this._floorNY=fit.normal.y; this._floorNZ=fit.normal.z

      this.floorPlaneTHREE = markRaw(new THREE.Plane())
      this.floorPlaneTHREE.setFromNormalAndCoplanarPoint(this.floorNormal3, this.floorCentroid3)

      this.buildFloorDebugMesh(floorPts)
      this.buildShadowReceiver()
      this.planeReady = true

      if (this.chair) {
        this.placeChairOnFloor()
        // Create ring now that the floor is known
        this.createRotationRing()
        this._snapRingToChair()
      }
      this._checkAllReady()
    },

    restoreModelTransform(transform) {
  if (!transform) return

  // ✅ Store as pending — chair may still be loading when this is called.
  // reloadChair() will apply this after placeChairOnFloor() completes.
  this._pendingTransformRestore = {
    position: { x: transform.position.x, y: transform.position.y, z: transform.position.z },
    rotation: { x: transform.rotation.x, y: transform.rotation.y, z: transform.rotation.z },
    scale:    { x: transform.scale.x,    y: transform.scale.y,    z: transform.scale.z },
  }

  console.log('[restoreModelTransform] stored pending restore:', this._pendingTransformRestore)

  // Also update lastKnown so renderItem uses it
  this.lastKnownPos = { ...this._pendingTransformRestore.position }
  this.lastKnownQuat = null  // will be rebuilt from Euler in _applyPendingTransform
  this.lastKnownScale = { ...this._pendingTransformRestore.scale }

  // If chair is already loaded, apply immediately
  if (this.chair && this.planeReady) {
    this._applyPendingTransform()
  }
},

// ✅ NEW helper — applies pending transform to chair
_applyPendingTransform() {
  if (!this._pendingTransformRestore || !this.chair) return

  const t = this._pendingTransformRestore

  this.chair.position.set(t.position.x, t.position.y, t.position.z)
  this.chair.rotation.set(t.rotation.x, t.rotation.y, t.rotation.z)
  this.chair.scale.set(t.scale.x, t.scale.y, t.scale.z)
  this.chair.updateMatrixWorld(true)

  // Sync reactive rotation degree tracker
  this.chairRotation = ((THREE.MathUtils.radToDeg(t.rotation.y) % 360) + 360) % 360

  // Update lastKnown with quaternion now that rotation is applied
  this.lastKnownPos  = { x: this.chair.position.x, y: this.chair.position.y, z: this.chair.position.z }
  this.lastKnownQuat = { x: this.chair.quaternion.x, y: this.chair.quaternion.y, z: this.chair.quaternion.z, w: this.chair.quaternion.w }
  this.lastKnownScale = { x: this.chair.scale.x, y: this.chair.scale.y, z: this.chair.scale.z }

  // Snap ring to new position
  if (this.rotationRing) this._snapRingToChair()
  this.snapLightToChair()

  console.log('[_applyPendingTransform] applied → pos:', this.chair.position.x.toFixed(3), this.chair.position.z.toFixed(3))

  this._pendingTransformRestore = null  // clear after applying
},

// ─── ALSO ADD THIS: emit transform on every drag end so parent stays in sync ─
// Call this at the end of onPointerUp (after isDragging/isRotating cleared):
_emitTransformUpdate() {
  if (!this.chair) return;
  this.$emit('model-transform-updated', {
    position: {
      x: this.chair.position.x,
      y: this.chair.position.y,
      z: this.chair.position.z,
    },
    rotation: {
      x: this.chair.rotation.x,
      y: this.chair.rotation.y,
      z: this.chair.rotation.z,
    },
    scale: {
      x: this.chair.scale.x,
      y: this.chair.scale.y,
      z: this.chair.scale.z,
    },
  });
},
    buildShadowReceiver() {
      if (this.shadowReceiverMesh) { this.scene.remove(this.shadowReceiverMesh); this.shadowReceiverMesh=null }
      const geo = new THREE.PlaneGeometry(12,12)
      const mat = new THREE.ShadowMaterial({ opacity:0.08, transparent:true, depthWrite:false })
      this.shadowReceiverMesh = markRaw(new THREE.Mesh(geo, mat))
      this.shadowReceiverMesh.receiveShadow = true
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), this.floorNormal3)
      this.shadowReceiverMesh.applyQuaternion(q)
      this.shadowReceiverMesh.position.copy(this.floorCentroid3)
      this.shadowReceiverMesh.position.addScaledVector(this.floorNormal3, 0.005)
      this.scene.add(this.shadowReceiverMesh)
    },

    buildFloorDebugMesh(floorPts) {
      if (this.floorMesh3D) { this.scene.remove(this.floorMesh3D); this.floorMesh3D=null }
      const geo = new THREE.PlaneGeometry(12,12,1,1)
      const mat = new THREE.MeshStandardMaterial({ color:0x00cc55, emissive:0x002211, transparent:true, opacity:0.4, side:THREE.DoubleSide })
      this.floorMesh3D = markRaw(new THREE.Mesh(geo,mat))
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), this.floorNormal3)
      this.floorMesh3D.applyQuaternion(q)
      this.floorMesh3D.position.copy(this.floorCentroid3)
      this.floorMesh3D.visible = this.debugFloorMesh
      this.floorMesh3D.receiveShadow = true
      this.scene.add(this.floorMesh3D)
    },

    // ── RENDER / EXPORT ─────────────────────────────────────────

// ── helper ───────────────────────────────────────────────────────────────────

_getBgNativeSize() {
  const img = this.$refs.roomImage;
  if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
    return { w: img.naturalWidth, h: img.naturalHeight };
  }
  const c = this.renderer?.domElement;
  return { w: c?.width || 800, h: c?.height || 600 };
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
    // async renderItem() {
    //   if (!this.chair || !this.renderer || !this.scene || !this.camera) { console.warn('Not ready'); return }
    //   try {
        
    //     const currentPosition = this.chair.position.clone()
    //     const currentRotation = this.chair.rotation.clone()
    //     const currentScale    = this.chair.scale.clone()

    //     await this.$nextTick()
    //     if (this.renderer && this.scene && this.camera) this.renderer.render(this.scene, this.camera)

    //     this.chair.position.copy(currentPosition)
    //     this.chair.rotation.copy(currentRotation)
    //     this.chair.scale.copy(currentScale)
    //     // ✅ Hide rotation ring
    //         if (this.rotationRing) {
    //           this.rotationRing.visible = false
    //         }
    //     this.internalLoading = true
    //     this.internalLoadingText = 'Rendering Item...'
    //     this.isDraggingRef = false
    //     this.loadingProxy  = true
    //     this.loadingText   = 'Rendering Item...'

    //     const canvas = this.renderer.domElement
    //     let renderWidth  = canvas.width
    //     let renderHeight = canvas.height
    //     if (renderWidth===0||renderHeight===0) {
    //       const img = this.$refs.roomImage
    //       renderWidth  = img ? img.naturalWidth  || img.clientWidth  || 800 : 800
    //       renderHeight = img ? img.naturalHeight || img.clientHeight || 600 : 600
    //     }

    //     this.loadingText = 'Creating composite image...'
    //     const compositeBlob = await this.createCompositeImageBlob(renderWidth, renderHeight, currentPosition, currentRotation, currentScale)
    //     if (!compositeBlob || compositeBlob.size===0) throw new Error('Failed to create composite')

    //     this.loadingText = 'Creating binary mask...'
    //     const maskBlob = await this.createBinaryMaskBlob(renderWidth, renderHeight, currentPosition, currentRotation, currentScale)
    //     if (!maskBlob || maskBlob.size===0) throw new Error('Failed to create mask')

    // this.downloadImages(compositeBlob, maskBlob);
    // return 
    //     const formData = new FormData()
    //     formData.append('composite_image', compositeBlob, 'composite_image.png')
    //     formData.append('binary_mask',     maskBlob,      'binary_mask.png')
    //     formData.append('room_id',  this.$route.params.id)
    //     formData.append('prod_id',  this.$route.query.product_id)

    //     this.loadingText = 'Adding Product to Your Room...'
    //     const url      = `${this.$store.state.root_api}engine/inpaint-item-ref/`
    //     const response = await fetch(url, {
    //       method: 'POST',
    //       headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    //       body: formData,
    //     })

    //     if (response.status===402) { const r=await response.json(); this.$emit('insufficient-credits',r.msg,r.buid); return }
    //     if (!response.ok) throw new Error(`HTTP ${response.status}`)

    //     const result = await response.json()
    //     if (result.renderer_id) {
    //       if (this.chair) this.chair.visible = false
    //       this.$emit('add-3d-furniture-to-room-start-polling', result.renderer_id)
    //     }
    //     return result
    //   } catch (error) {
    //     console.error('Error rendering item:', error)
    //     this.internalLoading = false  // ✅ clear on error
    //   this.loadingProxy = false
    //   if (this.rotationRing) {
    //           this.rotationRing.visible = false
    //         }
    //     throw error
    //   }
    // },

// ── STEP 4: Replace renderItem() entirely ────────────────────────────────────
async renderItem() {
  if (!this.chair || !this.renderer || !this.scene || !this.camera) {
    console.warn('renderItem: not ready')
    return
  }
        this.$emit('update:isLoading', true)

  try {
    // ── STEP 1: Force matrix update & snapshot BEFORE any reactive changes ──
    this.chair.updateMatrixWorld(true)

    const snapPos = {
      x: this.chair.position.x,
      y: this.chair.position.y,
      z: this.chair.position.z,
    }
    const snapQuat = {
      x: this.chair.quaternion.x,
      y: this.chair.quaternion.y,
      z: this.chair.quaternion.z,
      w: this.chair.quaternion.w,
    }
    const snapScale = {
      x: this.chair.scale.x,
      y: this.chair.scale.y,
      z: this.chair.scale.z,
    }

    console.log('[renderItem] SNAPSHOT pos:', snapPos)
    console.log('[renderItem] floorCentroid:', {
      x: this.floorCentroid3.x.toFixed(3),
      z: this.floorCentroid3.z.toFixed(3)
    })
    console.log('[renderItem] was dragged from centroid?',
      Math.abs(snapPos.x - this.floorCentroid3.x) > 0.01 ||
      Math.abs(snapPos.z - this.floorCentroid3.z) > 0.01
    )

    // ── STEP 2: Hide ring & do live render BEFORE reactive state changes ──
    if (this.rotationRing) this.rotationRing.visible = false
    this.renderer.render(this.scene, this.camera)

    // ── STEP 3: NOW change reactive state (triggers Vue watchers/flush) ──
    this.internalLoading     = true
    this.internalLoadingText = 'Rendering Item...'
    this.isDraggingRef       = false
    this.loadingProxy        = true

    // ── STEP 4: await nextTick to let Vue reactivity flush fully ──
    await this.$nextTick()

    // ── STEP 5: CRITICAL re-apply — mirrors old component exactly ──
    // Vue watcher flush (chairRotation → alignChairToFloor) may have
    // silently changed chair.quaternion between steps 1 and here.
    // Re-applying from plain primitives (not Vector3 refs) is safe.
    this.chair.position.set(snapPos.x, snapPos.y, snapPos.z)
    this.chair.quaternion.set(snapQuat.x, snapQuat.y, snapQuat.z, snapQuat.w)
    this.chair.scale.set(snapScale.x, snapScale.y, snapScale.z)
    this.chair.updateMatrixWorld(true)

    console.log('[renderItem] POST-NEXTICK pos (should match snapshot):',
      this.chair.position.x.toFixed(3),
      this.chair.position.z.toFixed(3)
    )

    // ── STEP 6: Export dimensions — use CSS pixels (clientWidth), NOT canvas.width ──
    // canvas.width = renderW (native image size, e.g. 4032px)
    // canvas.clientWidth = CSS display size (e.g. 390px on mobile)
    // Camera was built with renderW/renderH aspect BUT the offscreen camera
    // is rebuilt fresh with bgWidth/bgHeight aspect — use clientWidth so
    // the aspect the user SEES is what we export at.
    const canvasEl = this.renderer.domElement
    const exportW = canvasEl.clientWidth  || canvasEl.width  || 800
    const exportH = canvasEl.clientHeight || canvasEl.height || 600
    console.log(`[renderItem] Exporting at ${exportW}×${exportH} (CSS pixels)`)

    // ── STEP 7: Create blobs — chair state is now guaranteed correct ──
    this.internalLoadingText = 'Creating composite image...'
    const compositeBlob = await this.createCompositeImageBlob(exportW, exportH)
    if (!compositeBlob || compositeBlob.size === 0) throw new Error('Composite blob empty')

    this.internalLoadingText = 'Creating binary mask...'
    const maskBlob = await this.createBinaryMaskBlob(exportW, exportH)
    if (!maskBlob || maskBlob.size === 0) throw new Error('Mask blob empty')

    // // ── DEBUG: remove these two lines when sending to backend ──
    // this.downloadImages(compositeBlob, maskBlob)
    // return

    // Backend upload
    const formData = new FormData();
    formData.append('composite_image', compositeBlob, 'composite_image.png');
    formData.append('binary_mask',     maskBlob,      'binary_mask.png');
    formData.append('room_id',  this.$route.params.id);
    formData.append('prod_id',  this.$route.query.product_id);

    this.internalLoadingText = 'Adding Product to Your Room...';
    const response = await fetch(
      `${this.$store.state.root_api}engine/inpaint-item-ref/`,
      {
        method:  'POST',
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        body:    formData,
      }
    );

    if (response.status === 402) {
      const r = await response.json();
      this.$emit('insufficient-credits', r.msg, r.buid);
      return;
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const result = await response.json();
    if (result.renderer_id) {
      if (this.chair) this.chair.visible = false;
      this.$emit('add-3d-furniture-to-room-start-polling', result.renderer_id);
    }
    this.$emit('update:isLoading', false)
    this.loadingProxy    = false;

    return result;

  } catch (error) {
    console.error('renderItem error:', error);
    this.internalLoading = false;
    this.loadingProxy    = false;
    if (this.rotationRing) this.rotationRing.visible = true;
    throw error;

  } finally {
    // Always restore ring visibility on completion/error
    if (this.rotationRing) this.rotationRing.visible = this.showRotationRing;
  }
},



// ─── UPDATED createCompositeImageBlob ────────────────────────────────────────
// Now accepts snapPos/snapQuat/snapScale as plain objects (not Three.js objects)
// to avoid any proxy/reference issues
async createCompositeImageBlob(bgWidth, bgHeight) {
  const offCanvas = document.createElement('canvas')
  offCanvas.width  = bgWidth
  offCanvas.height = bgHeight

  const offRenderer = new THREE.WebGLRenderer({
    canvas: offCanvas, antialias: true,
    preserveDrawingBuffer: true, alpha: true, precision: 'highp',
  })
  offRenderer.setSize(bgWidth, bgHeight)
  offRenderer.setPixelRatio(1)
  offRenderer.outputColorSpace  = THREE.SRGBColorSpace
  offRenderer.setClearColor(0x000000, 0)
  offRenderer.shadowMap.enabled = true
  offRenderer.shadowMap.type    = THREE.PCFShadowMap

  const offScene = new THREE.Scene()

  // ✅ Read from this.chair DIRECTLY at call time
  // renderItem() has already re-applied the snapshot, so this is the dragged position
  const chairClone = this.chair.clone(true)
  this.chair.updateMatrixWorld(true)
  chairClone.position.copy(this.chair.position)
  chairClone.quaternion.copy(this.chair.quaternion)
  chairClone.scale.copy(this.chair.scale)
  chairClone.updateMatrixWorld(true)

  console.log(`[composite] chair at x=${chairClone.position.x.toFixed(3)}, z=${chairClone.position.z.toFixed(3)}`)
  offScene.add(chairClone)

  offScene.add(new THREE.AmbientLight(0xfff4e0, 1.2))
  const sun = new THREE.DirectionalLight(0xfff5e8, 2.0)
  sun.position.set(1.5, 5, -3)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.near = 0.1; sun.shadow.camera.far   = 20
  sun.shadow.camera.left = -6;  sun.shadow.camera.right  = 6
  sun.shadow.camera.bottom = -6; sun.shadow.camera.top   = 6
  sun.shadow.bias = -0.001; sun.shadow.normalBias = 0.02
  offScene.add(sun)
  const f1 = new THREE.DirectionalLight(0xd0e8ff, 2.8); f1.position.set(-2, 3, 2); offScene.add(f1)
  const f2 = new THREE.DirectionalLight(0xe8f0ff, 0.6); f2.position.set( 3, 2, 1); offScene.add(f2)
  const bk = new THREE.DirectionalLight(0xfff8e8, 0.5); bk.position.set( 0, 2, 4); offScene.add(bk)

  // ✅ Fresh camera matching live camera exactly
  const offCamera = new THREE.PerspectiveCamera(this.CAM_FOV_V, bgWidth / bgHeight, 0.01, 200)
  offCamera.position.set(0, 0, 0)
  offCamera.lookAt(0, 0, -1)
  offCamera.updateProjectionMatrix()
  offCamera.updateMatrixWorld(true)

  offRenderer.render(offScene, offCamera)
  const blob = await new Promise(resolve => offCanvas.toBlob(resolve, 'image/png'))
  offRenderer.dispose()
  return blob
},

async createBinaryMaskBlob(bgWidth, bgHeight) {
  const offCanvas = document.createElement('canvas')
  offCanvas.width  = bgWidth
  offCanvas.height = bgHeight

  const offRenderer = new THREE.WebGLRenderer({
    canvas: offCanvas, antialias: false,
    preserveDrawingBuffer: true, alpha: false,
  })
  offRenderer.setSize(bgWidth, bgHeight)
  offRenderer.setPixelRatio(1)
  offRenderer.setClearColor(0x000000, 1)

  const offScene = new THREE.Scene()

  // ✅ Same direct-read pattern
  const chairClone = this.chair.clone(true)
  chairClone.position.copy(this.chair.position)
  chairClone.quaternion.copy(this.chair.quaternion)
  chairClone.scale.copy(this.chair.scale)
  chairClone.updateMatrixWorld(true)
  chairClone.traverse(child => {
    if (child.isMesh) {
      child.material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.FrontSide })
      child.castShadow = false; child.receiveShadow = false
    }
  })
  offScene.add(chairClone)
  offScene.add(new THREE.AmbientLight(0xffffff, 1))

  const offCamera = new THREE.PerspectiveCamera(this.CAM_FOV_V, bgWidth / bgHeight, 0.01, 200)
  offCamera.position.set(0, 0, 0)
  offCamera.lookAt(0, 0, -1)
  offCamera.updateProjectionMatrix()
  offCamera.updateMatrixWorld(true)

  offRenderer.render(offScene, offCamera)
  const blob = await new Promise(resolve => offCanvas.toBlob(resolve, 'image/png'))
  offRenderer.dispose()
  return blob
},



    async switchFurniture() {
      if (!this.chair) { console.warn('No chair loaded'); return }
      try {
        this.loadingProxy = true ; this.loadingText = 'Switching Product...'
        if (this.chair) this.chair.visible = false
        const formData = new FormData()
        formData.append('room_id', this.$route.params.id)
        formData.append('prod_id', this.product_id)
        const url      = `${this.$store.state.root_api}engine/switch-furniture-ref/`
        const response = await fetch(url, { method:'POST', headers:{ Authorization:`Token ${localStorage.getItem('token')}` }, body:formData })
        if (response.status===402) { const r=await response.json(); this.$emit('insufficient-credits',r.msg); return }
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const result = await response.json()
        if (result?.renderer_id) this.$emit('add-3d-furniture-to-room-start-polling', result.renderer_id)
        this.$emit('rendered-comfyui-workflow', result.final_output)
        return result
      } catch (error) {
        console.error('Error switching furniture:', error)
        this.loadingProxy = false
        throw error
      }
    },

    // ── CLEANUP ─────────────────────────────────────────────────

    cleanup() {
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId)

      if (this.renderer && this.renderer.domElement) {
        const el = this.renderer.domElement
        el.removeEventListener('pointerdown',   this.onPointerDown)
        el.removeEventListener('pointermove',   this.onPointerMove)
        el.removeEventListener('pointerup',     this.onPointerUp)
        el.removeEventListener('pointercancel', this.onPointerUp)
      }
      window.removeEventListener('resize', this.adjustCanvasToAspectRatio)

      // Dispose ring
      this._disposeRotationRing()

      if (this.renderer) {
        this.renderer.dispose()
        if (this.renderer.domElement?.parentNode) this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
      }
      if (this.scene) {
        this.scene.traverse(child => {
          if (child.geometry) child.geometry.dispose()
          if (child.material) { Array.isArray(child.material) ? child.material.forEach(m => m.dispose()) : child.material.dispose() }
        })
      }

      this.scene=null; this.renderer=null; this.camera=null; this.chair=null
      this.pointCloudObj=null; this.floorMesh3D=null; this.shadowReceiverMesh=null
      this.sofaSpotLight=null; this.sofaSpotTarget=null
      this.planeReady=false; this.chairLoaded=false; this.maskReady=false
      this.plyReady=false; this.isDragging=false; this.isDraggingRef=false
      this.isRotating=false; this.isRotatingRef=false
      this.isTwoFingerRotating=false; this.twoFingerPointers.clear()
      this.floorPlaneTHREE=null
      this.floorNormal3   = markRaw(new THREE.Vector3(0,1,0))
      this.floorCentroid3 = markRaw(new THREE.Vector3())
    },

    animate() {
      this.animationFrameId = requestAnimationFrame(this.animate)
      if (this.renderer && this.scene && this.camera) this.renderer.render(this.scene, this.camera)
    },

    // ── DEBUG TOGGLES ────────────────────────────────────────────

    toggleMaskOverlay()  { this.debugMask      ? (this.maskReady && this.drawMaskOverlay()) : this.clearMaskOverlay() },
    togglePointCloud()   { if (this.pointCloudObj) this.pointCloudObj.visible = this.debugPointCloud },
    toggleFloorMesh()    { if (this.floorMesh3D)   this.floorMesh3D.visible   = this.debugFloorMesh  },

    getRenderedImageRect() {
      const img = this.$refs.roomImage
      if (!img) return { width:0, height:0, offsetX:0, offsetY:0 }
      const containerW=img.clientWidth,containerH=img.clientHeight
      const naturalW=img.naturalWidth,naturalH=img.naturalHeight
      if (!naturalW||!naturalH) return { width:containerW, height:containerH, offsetX:0, offsetY:0 }
      const imgAspect=naturalW/naturalH, containerAspect=containerW/containerH
      let renderedW,renderedH,offsetX,offsetY
      if (imgAspect>containerAspect) { renderedW=containerW;renderedH=containerW/imgAspect;offsetX=0;offsetY=(containerH-renderedH)/2 }
      else { renderedH=containerH;renderedW=containerH*imgAspect;offsetX=(containerW-renderedW)/2;offsetY=0 }
      return { width:Math.round(renderedW),height:Math.round(renderedH),offsetX:Math.round(offsetX),offsetY:Math.round(offsetY) }
    },
  },

  watch: {
    CHAIR_MODEL(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        if (!this.scene) { console.warn('⚠️ CHAIR_MODEL changed but scene not ready'); return }
        this.reloadChair()
      }
    },
    debugMask()       { this.toggleMaskOverlay() },
    debugPointCloud() { this.togglePointCloud() },
    debugFloorMesh()  { this.toggleFloorMesh() },
    chairRotation()   { this.updateChairRotation() },
  },
}
</script>

<style scoped>
.editor-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  min-height: 100%;
}
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
.debug-title { width:100%;font-size:10px;font-weight:700;color:#555;letter-spacing:.12em;text-transform:uppercase; }
.debug-row   { display:flex;align-items:center;gap:8px;color:#999;font-size:12px;cursor:pointer;user-select:none; }
.debug-row input[type='checkbox'] { accent-color:#4ade80;width:15px;height:15px;cursor:pointer; }
.debug-row input[type='range']    { width:80px;accent-color:#4ade80;cursor:pointer; }
.debug-row input[type='range']:disabled { opacity:.3;cursor:not-allowed; }
.val   { color:#4ade80;min-width:36px;text-align:right; }
.badge { padding:1px 8px;border-radius:4px;font-size:10px;font-weight:700;letter-spacing:.05em; }
.badge.on  { background:#14532d;color:#4ade80; }
.badge.off { background:#3f1515;color:#f87171; }
.debug-status { display:flex;flex-wrap:wrap;gap:6px 20px;width:100%;border-top:1px solid #1a1a1a;padding-top:8px; }
.status-row   { display:flex;gap:6px;font-size:11px;color:#555;align-items:center; }
.ok    { color:#4ade80; }
.err   { color:#f87171; }
.coord { color:#60a5fa;letter-spacing:.03em; }

/* Also ensure the container clips anything that slips through */
.room-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 140px);
  min-height: 400px;
  max-height: calc(100vh - 140px);
    object-position: center center; /* ← add this */

  line-height: 0;
  border-radius: 6px;
  overflow: hidden;  /* already present — keep this */
}
@media (min-width: 769px) {
  .room-container { height:calc(100vh - 140px);max-height:calc(100vh - 140px);max-width:920px;margin:0 auto; }
}
@media (min-width: 400px) and (max-width: 768px) {
  .room-container { height:calc(100vh - 180px);max-height:calc(100vh - 180px); }
}
@media (max-width: 399px) {
  .room-container { height:calc(100vh - 220px);max-height:calc(100vh - 220px); }
}

.room-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-width: 920px;
  max-height: 80vh;
}
.mask-overlay  { position:absolute;top:0;left:0;pointer-events:none; }
.three-layer   { position:absolute;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center; }
.three-layer canvas {
  display: block;
  max-width: 100%;   /* hard clamp — cannot bleed right */
  max-height: 100%;  /* hard clamp — cannot bleed down  */
}
/* Loading overlay */
.scanning-loading-overlay { position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;overflow:hidden; }
.loading-screen {
  position:relative;width:100%;height:100%;background-size:cover;background-position:center;background-repeat:no-repeat;
  display:flex;align-items:center;justify-content:center;overflow:hidden;
}
.loading-screen::before {
  content:'';position:absolute;top:0;left:0;width:100%;height:100%;
  background:rgba(20,20,20,.55);backdrop-filter:blur(.1px);z-index:1;
}
.wave-overlay {
  position:absolute;top:0;left:0;width:100%;height:100%;
  background:linear-gradient(to left,rgba(0,102,255,1) 0%,rgba(0,102,255,.4) 20%,rgba(0,102,255,.3) 30%,
    rgba(0,102,255,.2) 35%,rgba(0,102,255,.15) 40%,rgba(0,102,255,.1) 50%,rgba(0,102,255,0) 100%);
  animation:moveWaveLeftToRight 3s linear infinite,waveFade 3s ease-in-out infinite;
  z-index:2;
}
@keyframes moveWaveLeftToRight { from{transform:translateX(-100%)} to{transform:translateX(50%)} }
@keyframes waveFade { 0%{opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{opacity:0} }
.loading-text {
  position:relative;color:#fff;text-align:center;z-index:3;text-shadow:0 2px 6px rgba(0,0,0,.6);
  background:rgba(0,0,0,.3);padding:20px 30px;border-radius:10px;backdrop-filter:blur(8px);
  border:1px solid rgba(255,255,255,.1);
}
.process-text { font-size:18px;opacity:.9;letter-spacing:1px;text-transform:uppercase; }
.status-badge {
  position:absolute;top:12px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.75);
  color:#facc15;font-size:12px;padding:5px 14px;border-radius:20px;pointer-events:none;
  border:1px solid #444;backdrop-filter:blur(4px);
}
</style>