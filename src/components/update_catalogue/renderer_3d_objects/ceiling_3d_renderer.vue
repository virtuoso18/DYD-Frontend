<template>
  <Teleport to="body">
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="isShowInstructionModal"
      class="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      @keydown.esc="closeInstructionModal"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="closeInstructionModal"
      />

      <!-- Modal Panel -->
      <div class="relative z-10 w-full max-w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden">

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 class="text-[15px] font-semibold text-gray-800 tracking-wide">
            Instructions
          </h3>
          <button
            @click="closeInstructionModal"
            class="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-2 divide-y divide-gray-100">
          <div
            v-for="item in instructionConfig"
            :key="item.key"
            class="flex items-center justify-between py-4"
          >
            <span class="text-sm font-medium text-gray-700 flex-1 leading-snug">
              {{ item?.key }}
            </span>
            <img
              :src="item?.value"
              alt="gesture"
              class="w-10 h-10 object-contain ml-6 shrink-0 select-none"
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            @click="closeInstructionModal"
            class="px-5 py-[7px] bg-blue-500 hover:bg-blue-600 active:scale-95 !text-white text-sm font-medium rounded-lg transition-all duration-150 shadow-sm"
          >
            OK
          </button>
        </div>

      </div>
    </div>
  </Transition>
</Teleport>


  <div>
    <!-- ✅ NO-MODEL fallback -->
    <div
      v-if="!glbUrl || glbUrl === ''"
      class="text-center flex items-center h-full justify-center text-gray-600"
    >
      <img :src="baseImageUrl" alt="" class="max-w-full max-h-[54vh] md:max-h-[83vh] mx-auto" />
    </div>

    <!-- ✅ 3D EDITOR -->
    <div class="editor-wrapper" v-show="glbUrl && glbUrl !== ''">
      <div class="room-container">
        <!-- Instruction icon -->
        <img
          class="absolute top-[5px] right-[10px] md:hidden cursor-pointer z-[9] w-[25px]"
          src="../../../assets/icons/informationIcon.svg"
          alt="instruction"
          @click="showInstructionModal"
          title="see instruction"
        />

        <!-- LOADING OVERLAY -->
        <div v-if="internalLoading" class="scanning-loading-overlay">
          <div
            class="loading-screen"
            :style="{ backgroundImage: baseImageUrl ? `url(${baseImageUrl})` : 'none' }"
          >
            <div class="wave-overlay"></div>
            <div class="loading-text">
              <div class="process-text">{{ internalLoadingText }}</div>
              <div v-if="modelLoadProgress > 0 && modelLoadProgress < 100" style="margin-top:16px;">
                <div style="width:220px;height:6px;background:rgba(255,255,255,0.2);border-radius:99px;overflow:hidden;">
                  <div :style="{ width: modelLoadProgress + '%', height: '100%', background: '#3b82f6', borderRadius: '99px', transition: 'width 0.2s ease' }"></div>
                </div>
                <div style="margin-top:8px;font-size:13px;opacity:0.8;">{{ modelLoadProgress }}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Room background image -->
        <img ref="roomImage" :src="baseImageUrl" class="room-image" @load="initThree" />

        <!-- Mask debug overlay -->
        <canvas
          ref="maskOverlayCanvas"
          class="mask-overlay"
          :style="{ opacity: maskOverlayOpacity, display: debugMask ? 'block' : 'none' }"
        ></canvas>

        <!-- Three.js canvas layer -->
        <div ref="threeContainer" class="three-layer"></div>

        <!-- Status badge while fitting -->
        <div class="status-badge" v-if="!planeReady && !internalLoading">
          {{ plyReady && maskReady ? '🔄 Fitting ceiling plane…' : '⏳ Loading assets…' }}
        </div>

        <!-- Dimension label -->
        <span class="dim-label">
          W-{{ TARGET_DIMS?.width }}m × H-{{ TARGET_DIMS?.height }}m × D-{{ TARGET_DIMS?.depth }}m
        </span>
      </div>

      <!-- ── DEBUG PANEL ── -->
      <div class="debug-panel" v-if="debug">
        <div class="debug-title">🔧 Debug — Ceiling Plane</div>

        <!-- Mask Overlay row with inline opacity slider -->
        <div class="debug-row-group">
          <label class="debug-row">
            <span>Mask Overlay</span>
            <input type="checkbox" v-model="debugMask" />
            <span class="badge" :class="debugMask ? 'on' : 'off'">{{ debugMask ? 'ON' : 'OFF' }}</span>
          </label>
          <label class="debug-row sub-row" v-if="debugMask">
            <span>Opacity</span>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              v-model.number="maskOverlayOpacity"
              style="width:90px"
            />
            <span class="val">{{ Math.round(maskOverlayOpacity * 100) }}%</span>
          </label>
        </div>
        <label class="debug-row">
          <span>Point Cloud</span>
          <input type="checkbox" v-model="debugPointCloud" @change="togglePointCloud" />
          <span class="badge" :class="debugPointCloud ? 'on' : 'off'">{{ debugPointCloud ? 'ON' : 'OFF' }}</span>
        </label>
        <label class="debug-row">
          <span>Ceiling Mesh</span>
          <input type="checkbox" v-model="debugCeilingMesh" @change="toggleCeilingMesh" />
          <span class="badge" :class="debugCeilingMesh ? 'on' : 'off'">{{ debugCeilingMesh ? 'ON' : 'OFF' }}</span>
        </label>
        <label class="debug-row">
          <span>Light Rotation</span>
          <input type="range" min="0" max="360" step="1" v-model.number="lightRotation" />
          <span class="val">{{ lightRotation }}°</span>
        </label>
        <div class="debug-status">
          <div class="status-row"><span>Mask:</span>
            <span :class="maskReady ? 'ok' : 'err'">{{ maskReady ? '✅ ready' : '⏳…' }}</span></div>
          <div class="status-row"><span>Point cloud:</span>
            <span :class="plyReady ? 'ok' : 'err'">{{ plyReady ? '✅ ready' : '⏳…' }}</span></div>
          <div class="status-row"><span>Ceiling plane:</span>
            <span :class="planeReady ? 'ok' : 'err'">{{ planeReady ? '✅ fitted' : '⏳…' }}</span></div>
          <div class="status-row"><span>Light model:</span>
            <span :class="lightLoaded ? 'ok' : 'err'">{{ lightLoaded ? '✅ yes' : '⏳…' }}</span></div>
          <div class="status-row"><span>Ceiling pts used:</span>
            <span class="coord">{{ ceilingPtCount }}</span></div>
          <div class="status-row"><span>Ceiling Y (centroid):</span>
            <span class="coord">{{ ceilingCentroidY.toFixed(4) }} m</span></div>
          <div class="status-row"><span>Ceiling normal:</span>
            <span class="coord">({{ _ceilNX.toFixed(3) }}, {{ _ceilNY.toFixed(3) }}, {{ _ceilNZ.toFixed(3) }})</span></div>
          <div class="status-row"><span>Tilt angle:</span>
            <span class="coord">{{ tiltAngleDeg.toFixed(2) }}°</span></div>
          <div class="status-row"><span>Roll / Pitch:</span>
            <span class="coord">{{ adjustRoll }}° / {{ adjustPitch }}°</span></div>
          <div class="status-row"><span>Size scale:</span>
            <span class="coord">{{ modelSizeScale }}×</span></div>
        </div>
      </div>

        <!-- BOTTOM ACTION BAR -->
        <!-- BOTTOM ACTION BAR -->
<div class="flex flex-wrap justify-between items-center py-2 px-2 bg-white w-full gap-2">

  <!-- Controls row -->
  <div class="flex flex-wrap gap-4 items-center  " >

    <!-- Roll -->
    <div class="flex flex-col md:flex-row md:items-center gap-1 flex-shrink-0">
      <label class="text-[10px] font-bold whitespace-nowrap">Roll</label>
      <div class="flex md:hidden items-center gap-1">
        <button type="button" @click="adjustRoll = Math.max(-45, adjustRoll - 1)" :disabled="adjustRoll <= -45" class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-md disabled:opacity-50">
          <span class="text-sm font-bold">−</span>
        </button>
        <span class="text-[10px] min-w-[35px] text-center font-semibold">{{ adjustRoll }}°</span>
        <button type="button" @click="adjustRoll = Math.min(45, adjustRoll + 1)" :disabled="adjustRoll >= 45" class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-md disabled:opacity-50">
          <span class="text-sm font-bold">+</span>
        </button>
      </div>
      <div class="hidden md:flex items-center gap-1">
        <a-slider v-model:value="adjustRoll" :min="-45" :max="45" :step="1" :tooltip-formatter="v => `${v}°`" style="width:120px" />
        <span style="font-size:9px;min-width:25px;text-align:center">{{ adjustRoll }}°</span>
      </div>
    </div>

    <!-- Pitch -->
    <div class="flex flex-col md:flex-row md:items-center gap-1 flex-shrink-0">
      <label class="text-[10px] font-bold whitespace-nowrap">Pitch</label>
      <div class="flex md:hidden items-center gap-1">
        <button type="button" @click="adjustPitch = Math.max(-45, adjustPitch - 1)" :disabled="adjustPitch <= -45" class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-md disabled:opacity-50">
          <span class="text-sm font-bold">−</span>
        </button>
        <span class="text-[10px] min-w-[35px] text-center font-semibold">{{ adjustPitch }}°</span>
        <button type="button" @click="adjustPitch = Math.min(45, adjustPitch + 1)" :disabled="adjustPitch >= 45" class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-md disabled:opacity-50">
          <span class="text-sm font-bold">+</span>
        </button>
      </div>
      <div class="hidden md:flex items-center gap-1">
        <a-slider v-model:value="adjustPitch" :min="-45" :max="45" :step="1" :tooltip-formatter="v => `${v}°`" style="width:120px" />
        <span style="font-size:9px;min-width:25px;text-align:center">{{ adjustPitch }}°</span>
      </div>
    </div>

    <!-- Size -->
    <!-- <div class="flex flex-col md:flex-row md:items-center gap-1 flex-shrink-0">
      <label class="text-[10px] font-bold whitespace-nowrap">Size</label>
      <div class="flex md:hidden items-center gap-1">
        <button type="button" @click="modelSizeScale = Math.max(0.5, parseFloat((modelSizeScale - 0.1).toFixed(1)))" :disabled="modelSizeScale <= 0.5" class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-md disabled:opacity-50">
          <span class="text-sm font-bold">−</span>
        </button>
        <span class="text-[10px] min-w-[35px] text-center font-semibold">{{ modelSizeScale }}x</span>
        <button type="button" @click="modelSizeScale = Math.min(4.0, parseFloat((modelSizeScale + 0.1).toFixed(1)))" :disabled="modelSizeScale >= 4.0" class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-md disabled:opacity-50">
          <span class="text-sm font-bold">+</span>
        </button>
      </div>
      <div class="hidden md:flex items-center gap-1">
        <a-slider v-model:value="modelSizeScale" :min="0.5" :max="4.0" :step="0.1" :tooltip-formatter="v => `${v}x`" style="width:120px" />
        <span style="font-size:9px;min-width:25px;text-align:center">{{ modelSizeScale }}x</span>
      </div>
    </div> -->

  </div>

  <!-- Action buttons -->
  <div class="flex gap-2 flex-shrink-0 w-full justify-between md:w-auto">
    <button
      @click="resetLightPosition"
      :disabled="!lightLoaded || !planeReady"
      style="font-family:Poppins;font-weight:500;font-size:14px;line-height:20px;background:#e5e7eb;padding:4px 16px;border-radius:6px;"
    >
      Recenter
    </button>
    <a-button
      type="primary"
      @click="$emit('Apply-Changes', '3d-ceiling-light-Renerer')"
      :disabled="!lightLoaded || !planeReady || isLoading"
      style="padding:4px 12px;border-radius:6px;"
    >
      Finalise Changes
    </a-button>
  </div>

</div>
    </div>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import * as THREE from 'three'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import ZoomInIcon  from '@/assets/icons/zoomout.png'
import ZoomOutIcon from '@/assets/icons/zoomin.png'
import TapToSelect from '@/assets/icons/tap.png'
import DragToMove from '@/assets/icons/tapAndMove.png'
import threetapnove  from '@/assets/icons/threetapnove.png'


export default {
  name: 'ceiling_light_renderer_3d_ptcld',

  props: {
    isLoading:       { type: Boolean, default: false },
    glbUrl:          { type: String,  required: true },
    baseImageUrl:    { type: String,  required: true },
    ceilingMaskUrl:  { type: String,  required: true },
    selectedlightuuid: { type: String, required: true },
    CAM_IMG_W:    { type: Number, required: true },
    CAM_IMG_H:    { type: Number, required: true },
    CAM_FX:       { type: Number, required: true },
    CAM_FY:       { type: Number, required: true },
    CAM_CX:       { type: Number, required: true },
    CAM_CY:       { type: Number, required: true },
    CAM_Z_SIGN:   { type: Number, default: 1 },
    CAM_FOV_V:    { type: Number, required: true },
    MASK_ERODE_PX:{ type: Number, default: 10 },
    POINTCLOUD:   { type: String, required: true },
    TARGET_DIMS:  { type: Object, default: () => ({ width: 0.5, height: 0.3, depth: 0.5 }) },
    debug: Boolean,
  },

  emits: [
    'update:isLoading',
    'model-3d-light-added',
    'insufficient-credits',
    'Apply-Changes',
  ],

  data() {
    return {
      isShowInstructionModal: false,
      instructionConfig: [
        // { key: 'Pinch out to zoom', value: ZoomInIcon },
        // { key: 'Pinch in to zoom',  value: ZoomOutIcon },
        { key: 'Tap to select',     value: TapToSelect },
        { key: 'Drag to move', value: DragToMove },
                { key: "Two finger swipe left or right to Rotate the Furniture", value: threetapnove },

      ],
      internalLoading:     true,
      internalLoadingText: 'Loading assets…',
      modelLoadProgress:   0,
      animationFrameId:    null,
      maskReady:   false,
      plyReady:    false,
      planeReady:  false,
      lightLoaded: false,
      adjustRoll:     0,
      adjustPitch:    0,
      modelSizeScale: 1.0,
      lightRotation:  0,
      debugMask:          false,
      maskOverlayOpacity: 0.5,
      debugPointCloud:    false,
      debugCeilingMesh:   false,
      currentBgTexture: null,
      ceilingDebugMesh: null,
      scene:     null,
      camera:    null,
      renderer:  null,
      bgScene:   null,
      bgCamera:  null,
      bgMesh:    null,
      light:         null,
      lightHalfH:    0,
      originalScale: 1,
      ceilingPlaneTHREE: null,
      ceilingNormal3:    null,
      ceilingCentroid3:  null,
      rotationRing:  null,
      rotationArrows: [],
      pointCloudObj: null,
      plyPositions:  null,
      plyPointCount: 0,
      maskCanvas: null,
      maskCtx:    null,
      erodedMask: null,
      maskOverlayCanvas: null,
      ceilingPtCount:  0,
      ceilingCentroidY: 0,
      _ceilNX: 0, _ceilNY: -1, _ceilNZ: 0,
      isDraggingRef:  false,
      isRotatingRef:  false,
      twoFingerPointers:   null,
      twoFingerStartAngle: 0,
      twoFingerStartAvgY:  0,
      isTwoFingerRotating: false,

      // ── last-known transform saved on every pointerUp ──
      lastKnownPos:   null,
      lastKnownQuat:  null,
      lastKnownScale: null,
      // ── stores the render resolution used by the live camera ──
      _liveRenderW: 0,
      _liveRenderH: 0,
    }
  },

  computed: {
    tiltAngleDeg() {
      return (Math.acos(Math.min(1, Math.abs(this._ceilNY))) * 180) / Math.PI
    },
  },

  created() {
    this.ceilingNormal3   = markRaw(new THREE.Vector3(0, -1, 0))
    this.ceilingCentroid3 = markRaw(new THREE.Vector3())
    this.isDragging          = false
    this.isRotating          = false
    this.dragOffset          = markRaw(new THREE.Vector3())
    this.raycaster           = markRaw(new THREE.Raycaster())
    this.mouse               = markRaw(new THREE.Vector2())
    this.rotationStartAngle  = 0
    this.rotationStartMouseX = 0
    this._rawBinaryMask          = null
    this._computeRetryScheduled  = false
    this.twoFingerPointers   = new Map()
    this.twoFingerStartAngle = 0
    this.twoFingerStartAvgY  = 0
    this.isTwoFingerRotating = false
    this._lastDragHit       = null
    this._dragSmoothX       = 0
    this._dragSmoothZ       = 0
    this.DRAG_SMOOTH        = 0.15
    this.twoFingerStartAvgX = 0
    this.lastKnownPos   = null
    this.lastKnownQuat  = null
    this.lastKnownScale = null
    this._liveRenderW   = 0
    this._liveRenderH   = 0
  },

  mounted() {
    this.$nextTick(() => {
      this.roomImage         = this.$refs.roomImage
      this.threeContainer    = this.$refs.threeContainer
      this.maskOverlayCanvas = this.$refs.maskOverlayCanvas
      if (this.roomImage?.complete && this.roomImage.naturalWidth > 0) {
        this.initThree()
      }
    })
  },

  beforeUnmount() {
    this.cleanup()
  },

  watch: {
    glbUrl(newVal, oldVal) {
      if (newVal && newVal !== oldVal && this.scene) this.reloadLight()
    },
    baseImageUrl(newUrl, oldUrl) {
      if (!newUrl || newUrl === oldUrl || !this.bgScene) return
      new THREE.TextureLoader().load(newUrl, (tex) => {
        tex.minFilter = THREE.LinearFilter
        tex.magFilter = THREE.LinearFilter
        tex.colorSpace = THREE.SRGBColorSpace
        if (this.currentBgTexture) this.currentBgTexture.dispose()
        this.currentBgTexture = tex
        if (this.bgMesh) {
          this.bgMesh.material.map = tex
          this.bgMesh.material.needsUpdate = true
        } else {
          const bgGeo = new THREE.PlaneGeometry(2, 2)
          const bgMat = new THREE.MeshBasicMaterial({ map: tex, depthTest: false })
          this.bgMesh = markRaw(new THREE.Mesh(bgGeo, bgMat))
          this.bgMesh.position.z = -1
          this.bgScene.add(this.bgMesh)
        }
      })
    },
    adjustRoll()       { this._applyModelOrientation() },
    adjustPitch()      { this._applyModelOrientation() },
    modelSizeScale()   { this._applyModelScale() },
    lightRotation()    { this._applyModelOrientation() },
    debugPointCloud()  { this.togglePointCloud() },
    debugCeilingMesh() { this.toggleCeilingMesh() },
    debugMask(val)     { if (val) this.drawMaskOverlay() },
  },

  methods: {

    showInstructionModal()  { this.isShowInstructionModal = true  },
    closeInstructionModal() { this.isShowInstructionModal = false },

    resolveModelUrl(url) {
      if (!url) return url
      if (url.startsWith('http://') || url.startsWith('https://')) return url
      return `${this.$store.state.root_media_api}${url}`
    },

    _eventToNDC(clientX, clientY) {
      const el   = this.renderer.domElement
      const rect = el.getBoundingClientRect()
      const relX = (clientX - rect.left) / rect.width
      const relY = (clientY - rect.top)  / rect.height
      const clampedX = Math.max(0, Math.min(1, relX))
      const clampedY = Math.max(0, Math.min(1, relY))
      return {
        ndcX:  clampedX * 2 - 1,
        ndcY: -(clampedY * 2 - 1),
        sx: clientX - rect.left,
        sy: clientY - rect.top,
      }
    },

    _getClient(event) {
      if (event.touches?.length > 0)
        return { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY }
      if (event.changedTouches?.length > 0)
        return { clientX: event.changedTouches[0].clientX, clientY: event.changedTouches[0].clientY }
      return { clientX: event.clientX, clientY: event.clientY }
    },

    // ─────────────────────────────────────────────────────
    // INIT
    // ─────────────────────────────────────────────────────

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

      // ── Store the EXACT resolution the live camera is built with ──
      // This is used later in downloadCurrentSceneImage to build a matching
      // offscreen camera. On mobile, naturalWidth may differ from CAM_IMG_W.
      this._liveRenderW = renderW
      this._liveRenderH = renderH
      console.log(`[ceiling initThree] live camera resolution: ${renderW}×${renderH}`)

      this.bgScene  = markRaw(new THREE.Scene())
      this.bgCamera = markRaw(new THREE.Camera())

      const bgTex = markRaw(new THREE.TextureLoader())
      bgTex.load(this.baseImageUrl, (tex) => {
        tex.minFilter = THREE.LinearFilter
        tex.magFilter = THREE.LinearFilter
        tex.colorSpace = THREE.SRGBColorSpace
        this.currentBgTexture = tex
        const bgGeo = new THREE.PlaneGeometry(2, 2)
        const bgMat = new THREE.MeshBasicMaterial({ map: tex, depthTest: false })
        this.bgMesh = markRaw(new THREE.Mesh(bgGeo, bgMat))
        this.bgMesh.position.z = -1
        this.bgScene.add(this.bgMesh)
      })

      this.scene = markRaw(new THREE.Scene())
      this.camera = markRaw(new THREE.PerspectiveCamera(this.CAM_FOV_V, renderW / renderH, 0.01, 200))
      this.camera.position.set(0, 0, 0)
      this.camera.lookAt(0, 0, -1)
      this.camera.updateProjectionMatrix()

      this.renderer = markRaw(new THREE.WebGLRenderer({ antialias: true, alpha: true }))
      this.renderer.setSize(renderW, renderH, false)
      this.renderer.setPixelRatio(1)
      this.renderer.outputColorSpace  = THREE.SRGBColorSpace
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type    = THREE.PCFSoftShadowMap
      this.renderer.autoClear = false

      this.threeContainer.appendChild(this.renderer.domElement)

      this.maskOverlayCanvas.width  = renderW
      this.maskOverlayCanvas.height = renderH

      this.adjustCanvasToAspectRatio()

      this.scene.add(new THREE.AmbientLight(0xfff4e0, 1.4))
      const sun = new THREE.DirectionalLight(0xfff5e8, 2.0)
      sun.position.set(1.5, -5, -3)
      sun.castShadow = true
      sun.shadow.mapSize.set(2048, 2048)
      sun.shadow.camera.near = 0.1; sun.shadow.camera.far = 20
      sun.shadow.camera.left = sun.shadow.camera.bottom = -6
      sun.shadow.camera.right = sun.shadow.camera.top  =  6
      sun.shadow.bias = -0.001; sun.shadow.normalBias = 0.02
      this.scene.add(sun)
      const fill = new THREE.DirectionalLight(0xd0e8ff, 1.8)
      fill.position.set(-2, -3, 2)
      this.scene.add(fill)
      const back = new THREE.DirectionalLight(0xfff8e8, 0.5)
      back.position.set(0, -2, 4)
      this.scene.add(back)

      this.loadMask()
      this.loadPointCloud()
      this.loadLight()
      this.animate()

      const el = this.renderer.domElement
      // el.style.touchAction = 'pan-y'
      el.style.touchAction = 'none'
      el.addEventListener('pointerdown',   this.onPointerDown)
      el.addEventListener('pointermove',   this.onPointerMove)
      el.addEventListener('pointerup',     this.onPointerUp)
      el.addEventListener('pointercancel', this.onPointerUp)
      window.addEventListener('resize', this.adjustCanvasToAspectRatio)
    },

    adjustCanvasToAspectRatio() {
      if (!this.renderer || !this.roomImage) return
      const container = this.$refs.threeContainer
      if (!container) return
      const rect = container.getBoundingClientRect()
      const availW = Math.floor(rect.width)
      const availH = Math.floor(rect.height)
      if (availW === 0 || availH === 0) return
      const imgAspect = (this.roomImage.naturalWidth  || this.CAM_IMG_W) /
                        (this.roomImage.naturalHeight || this.CAM_IMG_H)
      let cssW = availW
      let cssH = Math.round(cssW / imgAspect)
      if (cssH > availH) { cssH = availH; cssW = Math.round(cssH * imgAspect) }
      this.renderer.domElement.style.width  = `${cssW}px`
      this.renderer.domElement.style.height = `${cssH}px`
      this.maskOverlayCanvas.style.width    = `${cssW}px`
      this.maskOverlayCanvas.style.height   = `${cssH}px`
      if (this.rotationRing) this._fitRingToCanvas()
    },

    // ─────────────────────────────────────────────────────
    // POINTER EVENTS
    // ─────────────────────────────────────────────────────

    onPointerDown(event) {
      if (!this.light || !this.ceilingPlaneTHREE) return

      if (event.pointerType === 'touch') {
        this.twoFingerPointers.set(event.pointerId, {
          clientX: event.clientX,
          clientY: event.clientY,
        })
        if (this.twoFingerPointers.size === 2) {
          this.isDragging = false; this.isDraggingRef = false
          this.isRotating = false; this.isRotatingRef = false
          const vals = Array.from(this.twoFingerPointers.values())
          this.twoFingerStartAvgX  = (vals[0].clientX + vals[1].clientX) / 2
          this.twoFingerStartAvgY  = (vals[0].clientY + vals[1].clientY) / 2
          this.twoFingerStartAngle = this.light.rotation.y
          this.isTwoFingerRotating = true
          event.preventDefault(); return
        }
        if (this.isTwoFingerRotating) { event.preventDefault(); return }
      }

      if (this.isTwoFingerRotating) return

      const el   = this.renderer.domElement
      const rect = el.getBoundingClientRect()
      const relX = (event.clientX - rect.left) / rect.width
      const relY = (event.clientY - rect.top)  / rect.height
      const ndcX =  Math.max(0, Math.min(1, relX)) * 2 - 1
      const ndcY = -(Math.max(0, Math.min(1, relY)) * 2 - 1)

      this.mouse.set(ndcX, ndcY)
      this.raycaster.setFromCamera(this.mouse, this.camera)

      if (this.rotationRing) {
        const arrowHits = this.raycaster.intersectObject(this.rotationRing, true)
        const arrowHit  = arrowHits.find(h => h.object.userData.isRotationArrow)
        if (arrowHit) {
          const visMesh = arrowHit.object.userData.visMesh
          if (visMesh) visMesh.material.color.setHex(0xff6600)
          this.isRotating = true; this.isRotatingRef = true
          this.rotationStartAngle  = this.light.rotation.y
          this.rotationStartMouseX = ndcX
          this.renderer.domElement.setPointerCapture(event.pointerId)
          event.preventDefault(); return
        }
      }

      const hits = this.raycaster.intersectObject(this.light, true)
      if (hits.length === 0) return

      this.light.visible = false
      const ceilHit = this.raycastCeiling()
      this.light.visible = true
      if (!ceilHit) return

      this.dragOffset.set(
        this.light.position.x - ceilHit.x,
        0,
        this.light.position.z - ceilHit.z,
      )
      this._dragSmoothX = this.light.position.x
      this._dragSmoothZ = this.light.position.z
      this._lastDragHit = ceilHit.clone()

      this.isDragging = true; this.isDraggingRef = true
      this.renderer.domElement.setPointerCapture(event.pointerId)
      event.preventDefault()
    },

   onPointerMove(event) {
  if (event.pointerType === 'touch' && this.isTwoFingerRotating) {
    if (!this.twoFingerPointers.has(event.pointerId)) return
    this.twoFingerPointers.set(event.pointerId, {
      clientX: event.clientX,
      clientY: event.clientY,
    })
    if (this.twoFingerPointers.size === 2) {
      const vals = Array.from(this.twoFingerPointers.values())
      const avgX = (vals[0].clientX + vals[1].clientX) / 2
      const deltaX = avgX - this.twoFingerStartAvgX
      const deltaRad = (deltaX / 300) * Math.PI
      const newRotY = this.twoFingerStartAngle + deltaRad
      this.light.rotation.y = newRotY
      this.lightRotation = ((THREE.MathUtils.radToDeg(newRotY) % 360) + 360) % 360
      this._snapRingToLight()
    }
    event.preventDefault(); return
  }

  if (event.pointerType === 'touch' && !event.isPrimary) return
  if (!this.isDragging && !this.isRotating) return

  const el   = this.renderer.domElement
  const rect = el.getBoundingClientRect()
  const relX = (event.clientX - rect.left)  / rect.width
  const relY = (event.clientY - rect.top)   / rect.height
  const clampedRelX = Math.max(0, Math.min(1, relX))
  const clampedRelY = Math.max(0, Math.min(1, relY))
  const ndcX =  clampedRelX * 2 - 1
  const ndcY = -clampedRelY * 2 + 1

  this.mouse.set(ndcX, ndcY)

  if (this.isRotating) {
    const deltaX  = ndcX - this.rotationStartMouseX
    const newRotY = this.rotationStartAngle + deltaX * Math.PI
    this.light.rotation.y = newRotY
    this.lightRotation = ((THREE.MathUtils.radToDeg(newRotY) % 360) + 360) % 360
    this._snapRingToLight()
    event.preventDefault(); return
  }

  if (this.isDragging) {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    this.light.visible = false
    const ceilHit = this.raycastCeiling()
    this.light.visible = true

    const hit = ceilHit || this._lastDragHit
    if (!hit) return
    if (ceilHit) this._lastDragHit = ceilHit.clone()

    const rawX = hit.x + this.dragOffset.x
    const rawZ = hit.z + this.dragOffset.z

    // ✅ FIX: Use appropriate smoothing for touch vs mouse
    // touch = 0.85 (smooth, responsive)
    // mouse = 0.15 (more direct)
    const S = event.pointerType === 'touch' ? 0.85 : 0.15
    this._dragSmoothX += (rawX - this._dragSmoothX) * S
    this._dragSmoothZ += (rawZ - this._dragSmoothZ) * S

    const newX = this._dragSmoothX
    const newZ = this._dragSmoothZ

    const n = this.ceilingNormal3
    const d = this.ceilingPlaneTHREE.constant
    let newY = this.ceilingCentroid3.y
    if (Math.abs(n.y) > 1e-6) {
      newY = (-d - n.x * newX - n.z * newZ) / n.y
    }

    this.light.position.set(newX, newY, newZ)
    this._snapRingToLight()
    event.preventDefault()
  }
},

    onPointerUp(event) {
      if (event.pointerType === 'touch') {
        this.twoFingerPointers.delete(event.pointerId)
        if (this.twoFingerPointers.size < 2 && this.isTwoFingerRotating) {
          this.isTwoFingerRotating = false
          if (this.twoFingerPointers.size === 1) {
            const rem = Array.from(this.twoFingerPointers.values())[0]
            this.twoFingerStartAngle = this.light ? this.light.rotation.y : 0
            this.twoFingerStartAvgX  = rem.clientX
            this.twoFingerStartAvgY  = rem.clientY
          }
          if (this.light) this._saveLastKnownTransform()
          return
        }
        if (this.isTwoFingerRotating) return
      }

      if (this.isRotating && this.rotationRing) {
        this.rotationRing.traverse((child) => {
          if (child.userData?.visMesh) {
            child.userData.visMesh.material.color.setHex(child.userData.originalColor)
          }
        })
      }

      this.isDragging = false; this.isDraggingRef = false
      this.isRotating = false; this.isRotatingRef = false
      this._lastDragHit = null

      if (this.light) this._saveLastKnownTransform()

      try { this.renderer.domElement.releasePointerCapture(event.pointerId) } catch (_) {}
    },

    _saveLastKnownTransform() {
      // Store plain numbers — NOT proxy refs — so they survive Vue's nextTick flush
      this.lastKnownPos   = {
        x: this.light.position.x,
        y: this.light.position.y,
        z: this.light.position.z,
      }
      this.lastKnownQuat  = {
        x: this.light.quaternion.x,
        y: this.light.quaternion.y,
        z: this.light.quaternion.z,
        w: this.light.quaternion.w,
      }
      this.lastKnownScale = {
        x: this.light.scale.x,
        y: this.light.scale.y,
        z: this.light.scale.z,
      }
      console.log('[ceiling] lastKnown saved:', JSON.stringify(this.lastKnownPos))
    },

    // ─────────────────────────────────────────────────────
    // CEILING RAYCAST
    // ─────────────────────────────────────────────────────

    raycastCeiling() {
      if (this.ceilingPlaneTHREE) {
        const pt = new THREE.Vector3()
        if (this.raycaster.ray.intersectPlane(this.ceilingPlaneTHREE, pt)) return pt
      }
      const yPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), this.ceilingCentroid3.y)
      const pt = new THREE.Vector3()
      if (this.raycaster.ray.intersectPlane(yPlane, pt)) return pt
      return null
    },

    // ─────────────────────────────────────────────────────
    // READY CHECK
    // ─────────────────────────────────────────────────────

    _checkAllReady() {
      if (this.planeReady && this.lightLoaded) {
        this.internalLoading     = false
        this.internalLoadingText = ''
        this.$emit('update:isLoading', false)
      } else if (!this.lightLoaded && !this.planeReady) {
        this.internalLoadingText = 'Loading assets…'
      } else if (!this.planeReady) {
        this.internalLoadingText = 'Fitting ceiling plane…'
      } else {
        this.internalLoadingText = 'Loading 3D model…'
      }
    },

    // ─────────────────────────────────────────────────────
    // MASK
    // ─────────────────────────────────────────────────────

    loadMask() {
      const img = new Image()
      img.src = this.ceilingMaskUrl
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
        this._rawBinaryMask = binary
        this.erodedMask = this.erodeBinaryMask(binary, this.CAM_IMG_W, this.CAM_IMG_H, this.MASK_ERODE_PX)
        this.maskReady  = true
        this.internalLoadingText = 'Analysing ceiling…'
        this.$nextTick(() => this.drawMaskOverlay())
        this.tryComputeCeiling()
      }
      img.onerror = () => {
        this.erodedMask = new Uint8Array(this.CAM_IMG_W * this.CAM_IMG_H).fill(1)
        this.maskReady  = true
        this.internalLoadingText = 'Analysing ceiling…'
        this.tryComputeCeiling()
      }
    },

    erodeBinaryMask(binary, W, H, radius) {
      const tmp = new Uint8Array(W * H)
      for (let y = 0; y < H; y++) {
        const prefix = new Int32Array(W + 1)
        for (let x = 0; x < W; x++) prefix[x+1] = prefix[x] + binary[y*W+x]
        for (let x = 0; x < W; x++) {
          const lo = Math.max(0, x-radius), hi = Math.min(W-1, x+radius)
          tmp[y*W+x] = prefix[hi+1] - prefix[lo] === hi-lo+1 ? 1 : 0
        }
      }
      const out = new Uint8Array(W * H)
      for (let x = 0; x < W; x++) {
        const prefix = new Int32Array(H + 1)
        for (let y = 0; y < H; y++) prefix[y+1] = prefix[y] + tmp[y*W+x]
        for (let y = 0; y < H; y++) {
          const lo = Math.max(0, y-radius), hi = Math.min(H-1, y+radius)
          out[y*W+x] = prefix[hi+1] - prefix[lo] === hi-lo+1 ? 1 : 0
        }
      }
      return out
    },

    // ─────────────────────────────────────────────────────
    // POINT CLOUD
    // ─────────────────────────────────────────────────────

    loadPointCloud() {
      new PLYLoader().load(this.resolveModelUrl(this.POINTCLOUD), (geo) => {
        const posAttr = geo.getAttribute('position')
        this.plyPositions  = posAttr.array
        this.plyPointCount = posAttr.count
        const hasColor = geo.hasAttribute('color')
        const mat = new THREE.PointsMaterial({ size: 0.02, vertexColors: hasColor, color: hasColor ? undefined : 0x00ccff })
        this.pointCloudObj = markRaw(new THREE.Points(geo, mat))
        this.pointCloudObj.visible = false
        this.scene.add(this.pointCloudObj)
        this.plyReady = true
        this.internalLoadingText = 'Fitting ceiling plane…'
        this.tryComputeCeiling()
      })
    },

    // ─────────────────────────────────────────────────────
    // CEILING PLANE FITTING
    // ─────────────────────────────────────────────────────

    projectToPixel(x, y, z) {
      const depth = this.CAM_Z_SIGN * z
      if (depth < 1e-4) return null
      const u = Math.round(this.CAM_FX * (x / depth) + this.CAM_CX)
      const v = Math.round(this.CAM_FY * (-y / depth) + this.CAM_CY)
      if (u < 0 || u >= this.CAM_IMG_W || v < 0 || v >= this.CAM_IMG_H) return null
      return { u, v }
    },

    tryComputeCeiling() {
      if (!this.plyReady || !this.maskReady || !this.erodedMask) return
      if (this.planeReady) return
      const result = this._attemptCeilingFit(this.erodedMask)
      if (result) { this._applyFitResult(result); return }
      console.warn('⚠️ Too few ceiling points with full erosion — retrying at half radius…')
      const halfEroded = this.erodeBinaryMask(
        this._rawBinaryMask, this.CAM_IMG_W, this.CAM_IMG_H,
        Math.max(1, Math.round(this.MASK_ERODE_PX / 2)),
      )
      const result2 = this._attemptCeilingFit(halfEroded)
      if (result2) { this._applyFitResult(result2); return }
      console.warn('⚠️ Still too few points — retrying with no erosion…')
      const result3 = this._attemptCeilingFit(this._rawBinaryMask)
      if (result3) { this._applyFitResult(result3); return }
      if (!this._computeRetryScheduled) {
        this._computeRetryScheduled = true
        setTimeout(() => {
          this._computeRetryScheduled = false
          if (!this.planeReady) {
            console.warn('⏳ Retrying ceiling fit after 500ms…')
            this.tryComputeCeiling()
          }
        }, 500)
      } else {
        console.error(`❌ Ceiling plane fit failed after all fallbacks (${this.plyPointCount} cloud pts)`)
      }
    },

    _attemptCeilingFit(mask) {
      if (!mask || !this.plyPositions) return null
      const ceilPts = []
      for (let i = 0; i < this.plyPointCount; i++) {
        const x = this.plyPositions[i * 3 + 0]
        const y = this.plyPositions[i * 3 + 1]
        const z = this.plyPositions[i * 3 + 2]
        const px = this.projectToPixel(x, y, z)
        if (!px) continue
        if (mask[px.v * this.CAM_IMG_W + px.u] === 1) ceilPts.push([x, y, z])
      }
      if (ceilPts.length < 10) {
        console.warn(`  → ${ceilPts.length} ceiling points (need ≥ 10)`)
        return null
      }
      let cx = 0, cy = 0, cz = 0
      for (const [x, y, z] of ceilPts) { cx += x; cy += y; cz += z }
      cx /= ceilPts.length; cy /= ceilPts.length; cz /= ceilPts.length
      const fit = this.fitPlane(ceilPts)
      if (!fit) return null
      return { normal: fit.normal, centroid: { x: cx, y: cy, z: cz }, count: ceilPts.length }
    },

    _applyFitResult(result) {
      const { normal, centroid, count } = result
      this.ceilingPtCount = count
      this.ceilingCentroid3.set(centroid.x, centroid.y, centroid.z)
      this.ceilingCentroidY = centroid.y
      this.ceilingNormal3.copy(normal)
      if (this.ceilingNormal3.y > 0) this.ceilingNormal3.negate()
      const tiltDeg = (Math.acos(Math.min(1, Math.abs(this.ceilingNormal3.y))) * 180) / Math.PI
      if (tiltDeg > 20) {
        console.warn(`⚠️ Ceiling tilt ${tiltDeg.toFixed(1)}° too large — using flat ceiling`)
        this.ceilingNormal3.set(0, -1, 0)
      }
      this._ceilNX = this.ceilingNormal3.x
      this._ceilNY = this.ceilingNormal3.y
      this._ceilNZ = this.ceilingNormal3.z
      this.ceilingPlaneTHREE = markRaw(new THREE.Plane())
      this.ceilingPlaneTHREE.setFromNormalAndCoplanarPoint(this.ceilingNormal3, this.ceilingCentroid3)
      this.planeReady = true
      console.log(`✅ Ceiling plane fitted — ${count} pts, centroid Y: ${centroid.y.toFixed(3)}, normal: (${this._ceilNX.toFixed(3)}, ${this._ceilNY.toFixed(3)}, ${this._ceilNZ.toFixed(3)})`)
      this._buildCeilingDebugMesh()
      if (this.light) {
        this.placeLightOnCeiling()
        this.createRotationRing()
        this._snapRingToLight()
      }
      this._checkAllReady()
    },

    fitPlane(pts) {
      const N = pts.length
      if (N < 3) return null
      let sx2=0, sxz=0, sx=0, sz2=0, sz=0, sxy=0, szy=0, sy=0
      for (const [x, y, z] of pts) {
        sx2+=x*x; sxz+=x*z; sx+=x; sz2+=z*z; sz+=z; sxy+=x*y; szy+=z*y; sy+=y
      }
      const M = [[sx2,sxz,sx],[sxz,sz2,sz],[sx,sz,N]]
      const b = [sxy, szy, sy]
      const coeffs = this.gaussElim3(M, b)
      if (!coeffs) return null
      const [a, bC] = coeffs
      const nx = a, ny = -1, nz = bC
      const len = Math.sqrt(nx*nx + ny*ny + nz*nz)
      return { normal: new THREE.Vector3(nx/len, ny/len, nz/len) }
    },

    gaussElim3(M, b) {
      const A = M.map((r, i) => [...r, b[i]])
      for (let col = 0; col < 3; col++) {
        let maxRow = col, maxVal = Math.abs(A[col][col])
        for (let row = col+1; row < 3; row++) {
          if (Math.abs(A[row][col]) > maxVal) { maxVal = Math.abs(A[row][col]); maxRow = row }
        }
        ;[A[col], A[maxRow]] = [A[maxRow], A[col]]
        if (Math.abs(A[col][col]) < 1e-12) return null
        for (let row = col+1; row < 3; row++) {
          const f = A[row][col] / A[col][col]
          for (let k = col; k <= 3; k++) A[row][k] -= f * A[col][k]
        }
      }
      const x = [0, 0, 0]
      for (let i = 2; i >= 0; i--) {
        x[i] = A[i][3]
        for (let j = i+1; j < 3; j++) x[i] -= A[i][j] * x[j]
        x[i] /= A[i][i]
      }
      return x
    },

    // ─────────────────────────────────────────────────────
    // ROTATION RING
    // ─────────────────────────────────────────────────────

    createRotationRing() {
      this._disposeRotationRing()
      const ring = new THREE.Group()
      ring.name = 'rotationRing'
      const RADIUS     = 1.0
      const SEGMENTS   = 128
      const LINE_COLOR = 0xffffff
      const ARR_COLOR  = 0x00e5ff
      const ARR_ANGLES = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5]
      const circlePoints = []
      for (let i = 0; i <= SEGMENTS; i++) {
        const a = (i / SEGMENTS) * Math.PI * 2
        circlePoints.push(new THREE.Vector3(Math.cos(a) * RADIUS, 0, Math.sin(a) * RADIUS))
      }
      ring.add(new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(circlePoints),
        new THREE.LineBasicMaterial({ color: LINE_COLOR, linewidth: 2 }),
      ))
      this.rotationArrows = []
      const AW = 0.13, AH = 0.22, HIT_R = 0.32
      ARR_ANGLES.forEach((angle) => {
        const tx =  Math.sin(angle), tz = -Math.cos(angle)
        const nx = -Math.cos(angle), nz = -Math.sin(angle)
        const cx = Math.cos(angle) * RADIUS, cz = Math.sin(angle) * RADIUS
        const visGeo = new THREE.BufferGeometry()
        visGeo.setAttribute('position', new THREE.Float32BufferAttribute([
          cx + tx * AH, 0, cz + tz * AH,
          cx + nx * AW, 0, cz + nz * AW,
          cx - nx * AW, 0, cz - nz * AW,
        ], 3))
        visGeo.setIndex([0, 1, 2])
        visGeo.computeVertexNormals()
        const visMesh = new THREE.Mesh(
          visGeo,
          new THREE.MeshBasicMaterial({ color: ARR_COLOR, side: THREE.DoubleSide }),
        )
        visMesh.raycast = () => {}
        ring.add(visMesh)
        const hitMesh = new THREE.Mesh(
          new THREE.CircleGeometry(HIT_R, 20),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }),
        )
        hitMesh.rotation.x = -Math.PI / 2
        hitMesh.position.set(cx, 0.002, cz)
        hitMesh.userData = { isRotationArrow: true, originalColor: ARR_COLOR, visMesh }
        ring.add(hitMesh)
        this.rotationArrows.push(hitMesh)
      })
      this.rotationRing = markRaw(ring)
      this.scene.add(ring)
    },

    _snapRingToLight() {
      if (!this.rotationRing || !this.light) return
      this.rotationRing.position.copy(this.light.position)
      this.rotationRing.position.addScaledVector(this.ceilingNormal3, 0.012)
      const worldUp = new THREE.Vector3(0, 1, 0)
      const fn = this.ceilingNormal3.clone().normalize().negate()
      const tiltQ = new THREE.Quaternion().setFromUnitVectors(worldUp, fn)
      this.rotationRing.quaternion.copy(tiltQ)
      this._fitRingToCanvas()
    },

    _fitRingToCanvas() {
      if (!this.rotationRing || !this.renderer || !this.light || !this.camera) return
      let footprintHalf = 0.6
      if (this.TARGET_DIMS?.width) {
        footprintHalf = (parseFloat(this.TARGET_DIMS.width) / 2) * 1.35
      }
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

    // ─────────────────────────────────────────────────────
    // LIGHT MODEL LOAD / RELOAD
    // ─────────────────────────────────────────────────────

    loadLight() {
      const modelUrl = this.resolveModelUrl(this.glbUrl)
      if (!modelUrl) { console.warn('⚠️ loadLight: no model URL'); return }
      this._loadGLTF(modelUrl)
    },

    reloadLight() {
      if (!this.scene) return
      this.isDragging = false; this.isDraggingRef = false
      this.isRotating = false; this.isRotatingRef = false
      this.lightLoaded = false
      this.internalLoading     = true
      this.internalLoadingText = 'Loading 3D model…'
      this._disposeRotationRing()
      if (this.light) {
        this.scene.remove(this.light)
        this.light.traverse((child) => {
          if (child.geometry) child.geometry.dispose()
          if (child.material) {
            Array.isArray(child.material) ? child.material.forEach(m => m.dispose()) : child.material.dispose()
          }
        })
        this.light = null
      }
      this.lightRotation    = 0
      this.adjustRoll       = 0
      this.adjustPitch      = 0
      this.modelLoadProgress = 0
      this._loadGLTF(this.resolveModelUrl(this.glbUrl))
    },

    _loadGLTF(modelUrl) {
      new GLTFLoader().load(
        modelUrl,
        (gltf) => {
          const innerMesh = gltf.scene
          innerMesh.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
          innerMesh.position.set(0, 0, 0)
          innerMesh.rotation.set(0, 0, 0)
          innerMesh.scale.set(1, 1, 1)
          innerMesh.updateMatrixWorld(true)

          const rawBox  = new THREE.Box3().setFromObject(innerMesh)
          const rawSize = new THREE.Vector3()
          rawBox.getSize(rawSize)

          const fovRad         = (this.CAM_FOV_V * Math.PI) / 180
          const fy_threejs     = this.CAM_IMG_H / 2 / Math.tan(fovRad / 2)
          const focalCorrection = this.CAM_FY / fy_threejs

          const sx = rawSize.x > 0 ? (this.TARGET_DIMS.width  * focalCorrection) / rawSize.x : 1
          const sy = rawSize.y > 0 ? (this.TARGET_DIMS.height * focalCorrection) / rawSize.y : 1
          const sz = rawSize.z > 0 ? (this.TARGET_DIMS.depth  * focalCorrection) / rawSize.z : 1

          innerMesh.scale.set(sx, sy, sz)
          innerMesh.updateMatrixWorld(true)
          this.originalScale = Math.min(sx, sy, sz)

          const scaledBox = new THREE.Box3().setFromObject(innerMesh)
          innerMesh.position.y -= scaledBox.max.y
          innerMesh.updateMatrixWorld(true)

          const finalBox = new THREE.Box3().setFromObject(innerMesh)
          this.lightHalfH = Math.abs(finalBox.min.y) / 2

          const pivotGroup = new THREE.Group()
          pivotGroup.add(innerMesh)
          this.scene.add(pivotGroup)

          this.light       = markRaw(pivotGroup)
          this.lightLoaded = true
          this.modelLoadProgress = 100

          if (this.planeReady) {
            this.placeLightOnCeiling()
            this.createRotationRing()
            this._snapRingToLight()
          }
          this._checkAllReady()
        },
        xhr => { if (xhr.total > 0) this.modelLoadProgress = Math.round((xhr.loaded / xhr.total) * 100) },
        err => { console.error('❌ Light load failed:', err); this._checkAllReady() },
      )
    },

    // ─────────────────────────────────────────────────────
    // PLACEMENT
    // ─────────────────────────────────────────────────────

    placeLightOnCeiling(worldX = null, worldZ = null) {
      if (!this.light || !this.ceilingPlaneTHREE) return
      const x = worldX ?? this.ceilingCentroid3.x
      const z = worldZ ?? this.ceilingCentroid3.z
      const n = this.ceilingNormal3
      const d = this.ceilingPlaneTHREE.constant
      let y   = this.ceilingCentroid3.y
      if (Math.abs(n.y) > 1e-6) y = (-d - n.x * x - n.z * z) / n.y
      this.light.position.set(x, y, z)
      this._applyModelOrientation()
    },

    resetLightPosition() {
      if (!this.light || !this.planeReady) return
      this.lightRotation = 0
      this.adjustRoll    = 0
      this.adjustPitch   = 0
      this.placeLightOnCeiling(this.ceilingCentroid3.x, this.ceilingCentroid3.z)
      if (this.rotationRing) this._snapRingToLight()
    },

    // ─────────────────────────────────────────────────────
    // MODEL ORIENTATION / SCALE
    // ─────────────────────────────────────────────────────

    _applyModelOrientation() {
      if (!this.light || !this.planeReady) return
      const worldDown = new THREE.Vector3(0, -1, 0)
      const fn        = this.ceilingNormal3.clone().normalize()
      const tiltQ     = new THREE.Quaternion().setFromUnitVectors(worldDown, fn)
      const spinQ = new THREE.Quaternion().setFromAxisAngle(fn, THREE.MathUtils.degToRad(this.lightRotation))
      const rollQ  = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(this.adjustRoll))
      const pitchQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(this.adjustPitch))
      const combined = new THREE.Quaternion().multiplyQuaternions(spinQ, tiltQ)
      combined.multiplyQuaternions(rollQ, combined)
      combined.multiplyQuaternions(pitchQ, combined)
      this.light.quaternion.copy(combined)
      if (this.rotationRing) this._snapRingToLight()
    },

    _applyModelScale() {
      if (!this.light) return
      const inner = this.light.children[0]
      if (!inner) return
      inner.scale.setScalar(this.originalScale * this.modelSizeScale)
      inner.updateMatrixWorld(true)
      const box = new THREE.Box3().setFromObject(inner)
      inner.position.y = -box.max.y
      inner.updateMatrixWorld(true)
      const finalBox = new THREE.Box3().setFromObject(inner)
      this.lightHalfH = Math.abs(finalBox.min.y) / 2
      this.placeLightOnCeiling(this.light.position.x, this.light.position.z)
    },

    // ─────────────────────────────────────────────────────
    // EXPORT  ← THE FIXED METHOD
    // ─────────────────────────────────────────────────────
      _removeLight3DAndRing() {
        console.log('[ceiling] Removing 3D light and rotation ring from canvas')
        
        // Remove rotation ring
        if (this.rotationRing) {
          this._disposeRotationRing()
        }
        
        // Remove light from scene
        if (this.light && this.scene) {
          this.scene.remove(this.light)
          this.light.traverse((child) => {
            if (child.geometry) child.geometry.dispose()
            if (child.material) {
              Array.isArray(child.material) 
                ? child.material.forEach(m => m.dispose()) 
                : child.material.dispose()
            }
          })
        }
        
        // Reset states
        this.light = null
        this.rotationRing = null
        this.lightLoaded = false
        this.lightRotation = 0
        this.adjustRoll = 0
        this.adjustPitch = 0
        
        console.log('[ceiling] ✅ Light and ring removed')
      },
    async downloadCurrentSceneImage() {
      if (!this.renderer || !this.scene || !this.camera || !this.currentBgTexture || !this.light) {
        console.warn('Required components not available'); return
      }

      
      // ── STEP 1: Snapshot ──────────────────────────────────────────────────
      this.light.updateMatrixWorld(true)
      const snapPos   = { x: this.light.position.x,   y: this.light.position.y,   z: this.light.position.z   }
      const snapQuat  = { x: this.light.quaternion.x, y: this.light.quaternion.y, z: this.light.quaternion.z, w: this.light.quaternion.w }
      const snapScale = { x: this.light.scale.x,      y: this.light.scale.y,      z: this.light.scale.z      }
      console.log('[ceiling export] snapPos:', JSON.stringify(snapPos))

      // ── STEP 2: Hide UI ───────────────────────────────────────────────────
      const wasRingVisible        = this.rotationRing     ? this.rotationRing.visible     : false
      const wasPointCloudVisible  = this.pointCloudObj    ? this.pointCloudObj.visible    : false
      const wasCeilingMeshVisible = this.ceilingDebugMesh ? this.ceilingDebugMesh.visible : false
      if (this.rotationRing)     this.rotationRing.visible     = false
      if (this.pointCloudObj)    this.pointCloudObj.visible    = false
      if (this.ceilingDebugMesh) this.ceilingDebugMesh.visible = false

      // ── STEP 3: nextTick → re-apply snapshot ─────────────────────────────
      await this.$nextTick()
      this.light.position.set(snapPos.x, snapPos.y, snapPos.z)
      this.light.quaternion.set(snapQuat.x, snapQuat.y, snapQuat.z, snapQuat.w)
      this.light.scale.set(snapScale.x, snapScale.y, snapScale.z)
      this.light.updateMatrixWorld(true)
      console.log('[ceiling export] pos after re-apply:', this.light.position.x.toFixed(3), this.light.position.z.toFixed(3))

      // ── STEP 4: Use the EXACT resolution the live camera was built with ───
      // _liveRenderW/_liveRenderH are saved during initThree() from
      // roomImage.naturalWidth/naturalHeight — the same values used to create
      // this.camera. Any other value (CAM_IMG_W, clientWidth) risks a different
      // aspect ratio, which shifts the model in the export.
      const exportW = this._liveRenderW || this.renderer.domElement.width
      const exportH = this._liveRenderH || this.renderer.domElement.height
      console.log(`[ceiling export] ${exportW}×${exportH}  (live camera res)`)

      try {
        // ── STEP 5: Offscreen render ──────────────────────────────────────
        const offCanvas = document.createElement('canvas')
        offCanvas.width  = exportW
        offCanvas.height = exportH

        const offRenderer = new THREE.WebGLRenderer({
          canvas: offCanvas, antialias: true,
          preserveDrawingBuffer: true, alpha: true, precision: 'highp',
        })
        offRenderer.setSize(exportW, exportH)
        offRenderer.setPixelRatio(1)
        offRenderer.outputColorSpace  = THREE.SRGBColorSpace
        offRenderer.setClearColor(0x000000, 0)
        offRenderer.shadowMap.enabled = true
        offRenderer.shadowMap.type    = THREE.PCFShadowMap
        offRenderer.autoClear = true

        const offScene = new THREE.Scene()

        // Clone model at the confirmed dragged position
        const lightClone = this.light.clone(true)
        lightClone.position.copy(this.light.position)
        lightClone.quaternion.copy(this.light.quaternion)
        lightClone.scale.copy(this.light.scale)
        lightClone.updateMatrixWorld(true)
        console.log(`[ceiling export] clone x=${lightClone.position.x.toFixed(3)}, z=${lightClone.position.z.toFixed(3)}`)
        offScene.add(lightClone)

        // Same lighting as initThree()
        offScene.add(new THREE.AmbientLight(0xfff4e0, 1.4))
        const sun = new THREE.DirectionalLight(0xfff5e8, 2.0)
        sun.position.set(1.5, -5, -3)
        sun.castShadow = true
        sun.shadow.mapSize.set(2048, 2048)
        sun.shadow.camera.near = 0.1; sun.shadow.camera.far   = 20
        sun.shadow.camera.left = -6;  sun.shadow.camera.right  = 6
        sun.shadow.camera.bottom = -6; sun.shadow.camera.top   = 6
        sun.shadow.bias = -0.001; sun.shadow.normalBias = 0.02
        offScene.add(sun)
        const fill = new THREE.DirectionalLight(0xd0e8ff, 1.8); fill.position.set(-2, -3, 2); offScene.add(fill)
        const back = new THREE.DirectionalLight(0xfff8e8, 0.5); back.position.set(0, -2, 4); offScene.add(back)

        // Camera with IDENTICAL aspect to the live camera
        const offCamera = new THREE.PerspectiveCamera(this.CAM_FOV_V, exportW / exportH, 0.01, 200)
        offCamera.position.set(0, 0, 0)
        offCamera.lookAt(0, 0, -1)
        offCamera.updateProjectionMatrix()
        offCamera.updateMatrixWorld(true)

        offRenderer.render(offScene, offCamera)

        // ── STEP 6: Composite bg + model ─────────────────────────────────
        const bgImg = this.currentBgTexture.image
        const compositeCanvas = document.createElement('canvas')
        compositeCanvas.width  = exportW
        compositeCanvas.height = exportH
        const ctx = compositeCanvas.getContext('2d')
        ctx.drawImage(bgImg, 0, 0, exportW, exportH)

        const finalDataURL = await new Promise((resolve) => {
          const modelImg = new Image()
          modelImg.onload = () => {
            ctx.globalCompositeOperation = 'source-over'
            ctx.drawImage(modelImg, 0, 0, exportW, exportH)
            resolve(compositeCanvas.toDataURL('image/png', 0.95))
          }
          modelImg.onerror = () => resolve(null)
          modelImg.src = offCanvas.toDataURL('image/png')
        })

        offRenderer.dispose()
      

        if (!finalDataURL) {
          console.error('[ceiling export] Failed to generate composite image')
          return
        }

        // ── STEP 7: POST to server — payload unchanged ───────────────────
        const response = await fetch(
          `${this.$store.state.root_api}engine/added-3d-light-to-room/`,
          {
            method:  'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              image:      finalDataURL,
              room_id:    this.$route.params.id,
              product_id: this.selectedlightuuid,
              timestamp:  Date.now(),
              metadata: {
                modelPosition: {
                  x: this.light.position.x,
                  y: this.light.position.z,
                  rotation: this.lightRotation,
                },
                ceilingPlane: {
                  normalX:   this._ceilNX,
                  normalY:   this._ceilNY,
                  normalZ:   this._ceilNZ,
                  centroidY: this.ceilingCentroidY,
                },
                adjustRoll:     this.adjustRoll,
                adjustPitch:    this.adjustPitch,
                modelSizeScale: this.modelSizeScale,
                dimensions:     { width: exportW, height: exportH },
              },
            }),
          }
        )

        if (response.status === 402) {
          const result = await response.json()
          this.$emit('insufficient-credits', result.msg, result.buid)
          return
        }
        if (response.ok) {
          const result = await response.json()
          console.log('[ceiling export] ✅ sent:', result)
          this.$emit('model-3d-light-added', result)
        } else {
          console.error('[ceiling export] Server error:', response.status, response.statusText)
          const link = document.createElement('a')
          link.download = `ceiling_light_composite_${Date.now()}.png`
          link.href = finalDataURL
          document.body.appendChild(link); link.click(); document.body.removeChild(link)
        }
      } catch (error) {
        console.error('[ceiling export] Error:', error)
      } finally {
        if (this.rotationRing)     this.rotationRing.visible     = wasRingVisible
        if (this.pointCloudObj)    this.pointCloudObj.visible    = wasPointCloudVisible
        if (this.ceilingDebugMesh) this.ceilingDebugMesh.visible = wasCeilingMeshVisible
        
        this._removeLight3DAndRing()
      }
    },

    // ─────────────────────────────────────────────────────
    // DEBUG HELPERS
    // ─────────────────────────────────────────────────────

    _restoreRendererState(bgMeshVisible, clearColor, clearAlpha) {
      if (this.bgMesh) this.bgMesh.visible = bgMeshVisible
      if (this.renderer) {
        this.renderer.setClearColor(clearColor, clearAlpha)
        this.renderer.autoClear = true
        this.renderer.clear()
        if (this.bgScene && this.bgCamera) this.renderer.render(this.bgScene, this.bgCamera)
        this.renderer.render(this.scene, this.camera)
      }
    },

    _restoreUIState(ringVisible, pointCloudVisible, ceilingMeshVisible) {
      if (this.rotationRing)    this.rotationRing.visible    = ringVisible
      if (this.pointCloudObj)   this.pointCloudObj.visible   = pointCloudVisible
      if (this.ceilingDebugMesh) this.ceilingDebugMesh.visible = ceilingMeshVisible
    },

    _buildCeilingDebugMesh() {
      if (this.ceilingDebugMesh) { this.scene.remove(this.ceilingDebugMesh); this.ceilingDebugMesh = null }
      const geo = new THREE.PlaneGeometry(12, 12)
      const mat = new THREE.MeshStandardMaterial({
        color: 0x00aaff, emissive: 0x001133, transparent: true, opacity: 0.35, side: THREE.DoubleSide,
      })
      this.ceilingDebugMesh = markRaw(new THREE.Mesh(geo, mat))
      const worldZ = new THREE.Vector3(0, 0, 1)
      const q = new THREE.Quaternion().setFromUnitVectors(worldZ, this.ceilingNormal3.clone().normalize())
      this.ceilingDebugMesh.applyQuaternion(q)
      this.ceilingDebugMesh.position.copy(this.ceilingCentroid3)
      this.ceilingDebugMesh.visible = this.debugCeilingMesh
      this.scene.add(this.ceilingDebugMesh)
    },

    togglePointCloud()  { if (this.pointCloudObj)   this.pointCloudObj.visible   = this.debugPointCloud  },
    toggleCeilingMesh() { if (this.ceilingDebugMesh) this.ceilingDebugMesh.visible = this.debugCeilingMesh },

    // ─────────────────────────────────────────────────────
    // MASK OVERLAY
    // ─────────────────────────────────────────────────────

    drawMaskOverlay() {
      const canvas = this.$refs.maskOverlayCanvas
      if (!canvas) return
      const W = this.CAM_IMG_W
      const H = this.CAM_IMG_H
      canvas.width  = W
      canvas.height = H
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, W, H)
      if (!this.erodedMask) return
      const imgData = ctx.createImageData(W, H)
      const d = imgData.data
      const raw    = this._rawBinaryMask
      const eroded = this.erodedMask
      for (let i = 0; i < W * H; i++) {
        const px = i * 4
        if (eroded[i] === 1) {
          d[px+0]=0; d[px+1]=220; d[px+2]=255; d[px+3]=180
        } else if (raw && raw[i] === 1) {
          d[px+0]=255; d[px+1]=60; d[px+2]=60; d[px+3]=140
        } else {
          d[px+3]=0
        }
      }
      ctx.putImageData(imgData, 0, 0)
    },

    // ─────────────────────────────────────────────────────
    // ANIMATE
    // ─────────────────────────────────────────────────────

    animate() {
      this.animationFrameId = requestAnimationFrame(this.animate)
      if (!this.renderer || !this.scene || !this.camera) return
      this.renderer.autoClear = false
      this.renderer.clear()
      if (this.bgScene && this.bgCamera) this.renderer.render(this.bgScene, this.bgCamera)
      this.renderer.render(this.scene, this.camera)
    },

    // ─────────────────────────────────────────────────────
    // CLEANUP
    // ─────────────────────────────────────────────────────

    cleanup() {
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId)
      if (this.renderer?.domElement) {
        const el = this.renderer.domElement
        el.removeEventListener('pointerdown',   this.onPointerDown)
        el.removeEventListener('pointermove',   this.onPointerMove)
        el.removeEventListener('pointerup',     this.onPointerUp)
        el.removeEventListener('pointercancel', this.onPointerUp)
      }
      window.removeEventListener('resize', this.adjustCanvasToAspectRatio)
      this._disposeRotationRing()
      if (this.renderer) {
        this.renderer.dispose()
        this.renderer.domElement?.parentNode?.removeChild(this.renderer.domElement)
      }
      if (this.scene) {
        this.scene.traverse(child => {
          if (child.geometry) child.geometry.dispose()
          if (child.material) {
            Array.isArray(child.material) ? child.material.forEach(m => m.dispose()) : child.material.dispose()
          }
        })
      }
      this.scene = null; this.renderer = null; this.camera = null
      this.light = null; this.pointCloudObj = null
      this.planeReady = false; this.lightLoaded = false
      this.maskReady  = false; this.plyReady    = false
      this.isDragging = false; this.isRotating  = false
      this.isTwoFingerRotating = false
      this.twoFingerPointers.clear()
      this.ceilingPlaneTHREE = null
      this.ceilingNormal3   = markRaw(new THREE.Vector3(0, -1, 0))
      this.ceilingCentroid3 = markRaw(new THREE.Vector3())
      this._liveRenderW = 0
      this._liveRenderH = 0
    },
  },
}
</script>
<style scoped>
.editor-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* padding: 12px 0; */
  min-height: 100%;
}

.room-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 140px);
  min-height: 400px;
  max-height: calc(100vh - 140px);
  line-height: 0;
  /* border-radius: 6px; */
  overflow: hidden;
}

@media (min-width: 769px) {
  .room-container { height: calc(100vh - 140px); max-height: calc(100vh - 140px); max-width: 920px; margin: 0 auto; }
}
@media (min-width: 400px) and (max-width: 768px) {
  .room-container { height: calc(100vh - 180px); max-height: calc(100vh - 180px); }
}
@media (max-width: 399px) {
  .room-container { height: calc(100vh - 220px); max-height: calc(100vh - 220px); }
}
@media screen and (min-width: 768px) {
  .room-container { min-height: 83vh; }
}

.room-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-width: 920px;
  max-height: 80vh;
}

.mask-overlay { position: absolute; top: 0; left: 0; pointer-events: none; z-index:5 }
.three-layer  { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }
.three-layer canvas { display: block; }

.dim-label {
  background: white;
  border-radius: 5px;
  padding: 0 5px;
  font-size: 12px;
  font-weight: 600;
  position: absolute;
  z-index: 5;
  line-height: 1.4;
  bottom: 10px;
  left: 10px;
}

.status-badge {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.75);
  color: #facc15;
  font-size: 12px;
  padding: 5px 14px;
  border-radius: 20px;
  pointer-events: none;
  border: 1px solid #444;
  backdrop-filter: blur(4px);
}

/* Loading overlay */
.scanning-loading-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; overflow: hidden; }
.loading-screen {
  position: relative; width: 100%; height: 100%;
  background-size: cover; background-position: center; background-repeat: no-repeat;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.loading-screen::before {
  content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(20,20,20,0.55); backdrop-filter: blur(0.1px); z-index: 1;
}
.wave-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to left, rgba(0,102,255,1) 0%, rgba(0,102,255,0.4) 20%,
    rgba(0,102,255,0.15) 40%, rgba(0,102,255,0) 100%);
  animation: moveWave 3s linear infinite, waveFade 3s ease-in-out infinite;
  z-index: 2;
}
@keyframes moveWave { from { transform: translateX(-100%) } to { transform: translateX(50%) } }
@keyframes waveFade { 0% { opacity: 0 } 10% { opacity: 1 } 90% { opacity: 1 } 100% { opacity: 0 } }
.loading-text {
  position: relative; color: #fff; text-align: center; z-index: 3;
  text-shadow: 0 2px 6px rgba(0,0,0,0.6);
  background: rgba(0,0,0,0.3); padding: 20px 30px; border-radius: 10px;
  backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1);
}
.process-text { font-size: 18px; opacity: 0.9; letter-spacing: 1px; text-transform: uppercase; }

/* Debug panel */
.debug-row-group { display: flex; flex-direction: column; gap: 4px; }
.sub-row { padding-left: 16px; opacity: 0.85; }
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
  margin-top: 6px;
}
.debug-title { width: 100%; font-size: 10px; font-weight: 700; color: #555; letter-spacing: .12em; text-transform: uppercase; }
.debug-row   { display: flex; align-items: center; gap: 8px; color: #999; font-size: 12px; cursor: pointer; user-select: none; }
.debug-row input[type='checkbox'] { accent-color: #4ade80; width: 15px; height: 15px; cursor: pointer; }
.debug-row input[type='range']    { width: 80px; accent-color: #4ade80; cursor: pointer; }
.val  { color: #4ade80; min-width: 36px; text-align: right; }
.badge { padding: 1px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; letter-spacing: .05em; }
.badge.on  { background: #14532d; color: #4ade80; }
.badge.off { background: #3f1515; color: #f87171; }
.debug-status { display: flex; flex-wrap: wrap; gap: 6px 20px; width: 100%; border-top: 1px solid #1a1a1a; padding-top: 8px; }
.status-row   { display: flex; gap: 6px; font-size: 11px; color: #555; align-items: center; }
.ok    { color: #4ade80; }
.err   { color: #f87171; }
.coord { color: #60a5fa; letter-spacing: .03em; }

/* Modal */
.instruction-item { display: flex; justify-content: space-between; align-items: center; }
.instruction      { font-weight: 500; color: #333; flex: 1; }
.gesture-icon     { width: 40px; height: 40px; object-fit: contain; margin-left: 20px; }
</style>