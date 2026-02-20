<template>
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
              <div v-if="modelLoading" style="margin-top: 16px;">
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

        <div class="status-badge" v-if="!planeReady">
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
      <a-row>
        <a-col :lg="0" :md="0" :sm="24" :xs="24">
          <label style="display:flex;gap:5px;">
            <span>Furniture Rotation</span>
            <input type="range" min="0" max="360" step="1" v-model.number="chairRotation" @input="updateChairRotation" />
            <span style="display:flex;gap:5px;">{{ chairRotation }}°</span>
          </label>
        </a-col>
      </a-row>

      <div class="flex justify-between items-center py-2 px-2 bg-white w-full gap-2">
        <button
          @click="resetChairPosition"
          :disabled="!chairLoaded || !planeReady"
          style="font-family:Poppins;font-weight:500;font-size:14px;line-height:20px;letter-spacing:0%;text-align:center;background:#e5e7eb;padding:4px 24px;border-radius:6px;"
        >
          Recenter
        </button>

        <a-row>
          <a-col :lg="24" :md="24" :sm="0" :xs="0">
            <label style="display:flex;gap:5px;">
              <span>Furniture Rotation</span>
              <input type="range" min="0" max="360" step="1" v-model.number="chairRotation" @input="updateChairRotation" />
              <span style="display:flex;gap:5px;">{{ chairRotation }}°</span>
            </label>
          </a-col>
        </a-row>

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
      loadingText: 'Initializing...',
      modelLoadProgress: 0,
      modelLoading: false,
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

      // ─── DRAG STATE ───────────────────────────────────────────
      // true while a pointer (mouse or touch) is held down on the chair
      isDraggingRef: false,

      chairRotation: 0,
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

      // ─── INTERNAL DRAG STATE (not reactive, set in created) ───
      // isDragging, dragOffset, hitOffsetOnFloor, raycaster, mouse
      // are assigned in created() via this.xxx = markRaw(...)
    }
  },

  emits: [
    'update:isLoading',
    'insufficient-credits',
    'add-3d-furniture-to-room-start-polling',
    'rendered-comfyui-workflow',
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
    this.floorNormal3   = markRaw(new THREE.Vector3(0, 1, 0))
    this.floorCentroid3 = markRaw(new THREE.Vector3())
    this.dragOffset     = markRaw(new THREE.Vector3())   // world-space grab offset
    this.raycaster      = markRaw(new THREE.Raycaster())
    this.mouse          = markRaw(new THREE.Vector2())
    this.isDragging     = false   // internal (non-reactive) flag
  },

  mounted() {
    this.$nextTick(() => {
      this.roomImage        = this.$refs.roomImage
      this.threeContainer   = this.$refs.threeContainer
      this.maskOverlayCanvas = this.$refs.maskOverlayCanvas

      if (this.roomImage) {
        if (this.roomImage.complete && this.roomImage.naturalWidth > 0) {
          this.initThree()
        }
        // else @load="initThree" fires
      }
    })
  },

  // ─────────────────────────────────────────────────────────────
  methods: {

    // ── HELPERS ─────────────────────────────────────────────────

    resolveModelUrl(url) {
      if (!url) return url
      if (url.startsWith('http://') || url.startsWith('https://')) return url
      const base = this.$store.state.root_media_api
      return `${base}${url}`
    },

    /**
     * Convert a DOM pointer event OR a Touch object into normalised NDC
     * coordinates [-1, 1] that THREE.Raycaster understands.
     * Also returns raw canvas-space {sx, sy} for mask checks.
     */
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

    /**
     * Extract {clientX, clientY} from either a MouseEvent or a TouchEvent.
     * Returns null when there are no active touches.
     */
    _getClient(event) {
      if (event.touches && event.touches.length > 0) {
        return { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY }
      }
      if (event.changedTouches && event.changedTouches.length > 0) {
        return { clientX: event.changedTouches[0].clientX, clientY: event.changedTouches[0].clientY }
      }
      return { clientX: event.clientX, clientY: event.clientY }
    },

    // ── INIT ────────────────────────────────────────────────────

    initThree() {
      if (this.renderer) return

      this.roomImage        = this.$refs.roomImage
      this.threeContainer   = this.$refs.threeContainer
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

      this.adjustCanvasToAspectRatio()

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

      // ── POINTER / TOUCH EVENTS ───────────────────────────────
      // We register ONE unified handler for both mouse and touch.
      const el = this.renderer.domElement
      el.style.touchAction = 'none'   // prevent browser scroll hijacking

      el.addEventListener('pointerdown',  this.onPointerDown)
      el.addEventListener('pointermove',  this.onPointerMove)
      el.addEventListener('pointerup',    this.onPointerUp)
      el.addEventListener('pointercancel',this.onPointerUp)

      window.addEventListener('resize', this.adjustCanvasToAspectRatio)
    },

    adjustCanvasToAspectRatio() {
      if (!this.renderer || !this.roomImage) return
      const container = this.$refs.threeContainer
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const availableW    = Math.floor(containerRect.width)
      const availableH    = Math.floor(containerRect.height)
      if (availableW === 0 || availableH === 0) return

      const imgAspect = (this.roomImage.naturalWidth  || this.CAM_IMG_W) /
                        (this.roomImage.naturalHeight || this.CAM_IMG_H)

      let cssW = availableW
      let cssH = Math.round(cssW / imgAspect)
      if (cssH > availableH) {
        cssH = availableH
        cssW = Math.round(cssH * imgAspect)
      }

      this.renderer.domElement.style.width  = `${cssW}px`
      this.renderer.domElement.style.height = `${cssH}px`
      this.maskOverlayCanvas.style.width    = `${cssW}px`
      this.maskOverlayCanvas.style.height   = `${cssH}px`
    },

    // ── POINTER EVENTS (unified mouse + touch via Pointer Events API) ──

    onPointerDown(event) {
      if (!this.chair || !this.floorPlaneTHREE) return

      // Only respond to the first finger / left mouse button
      if (event.pointerType === 'touch' && event.isPrimary === false) return

      const { clientX, clientY } = event
      const { ndcX, ndcY } = this._eventToNDC(clientX, clientY)

      this.mouse.set(ndcX, ndcY)
      this.raycaster.setFromCamera(this.mouse, this.camera)

      // 1. Did the ray hit the chair?
      const hits = this.raycaster.intersectObject(this.chair, true)
      if (hits.length === 0) return

      // 2. Find where on the floor plane the same ray lands
      //    (hide chair first so it doesn't occlude the floor mesh)
      this.chair.visible = false
      const floorHit = this.raycastFloor()
      this.chair.visible = true
      if (!floorHit) return

      // 3. Compute the grab offset: difference between the chair's XZ
      //    position and where the floor ray landed.
      //    This keeps the chair exactly under the grab point forever.
      this.dragOffset.set(
        this.chair.position.x - floorHit.x,
        0,
        this.chair.position.z - floorHit.z,
      )

      this.isDragging    = true
      this.isDraggingRef = true   // reactive – for UI hints

      // Capture pointer so we receive move/up even outside the canvas
      this.renderer.domElement.setPointerCapture(event.pointerId)

      event.preventDefault()
    },

    onPointerMove(event) {
      if (!this.isDragging || !this.chair || !this.floorPlaneTHREE) return
      if (event.pointerType === 'touch' && event.isPrimary === false) return

      const { clientX, clientY } = event
      const { ndcX, ndcY, sx, sy } = this._eventToNDC(clientX, clientY)

      this.mouse.set(ndcX, ndcY)
      this.raycaster.setFromCamera(this.mouse, this.camera)

      // Hide chair so raycast hits the floor plane, not the chair mesh
      this.chair.visible = false
      const floorHit = this.raycastFloor()
      this.chair.visible = true
      if (!floorHit) return

      // Optional mask debug info
      this.lastHit = {
        x: floorHit.x.toFixed(3),
        y: floorHit.y.toFixed(3),
        z: floorHit.z.toFixed(3),
      }
      this.lastMaskResult = this.isOnFloorMask(sx, sy)

      // Apply the grab offset so the model sticks to the grab point
      const newX = floorHit.x + this.dragOffset.x
      const newZ = floorHit.z + this.dragOffset.z

      // Recompute Y from the fitted floor plane equation at (newX, newZ)
      const n = this.floorNormal3
      const d = this.floorPlaneTHREE.constant
      let newY = this.floorCentroid3.y
      if (Math.abs(n.y) > 1e-6) {
        newY = (-d - n.x * newX - n.z * newZ) / n.y
      }

      this.chair.position.set(newX, newY + this.chairHalfH * n.y, newZ)
      this.chair.position.addScaledVector(n, this.chairHalfH)
      this.snapLightToChair()

      event.preventDefault()
    },

    onPointerUp(event) {
      if (!this.isDragging) return
      if (event.pointerType === 'touch' && event.isPrimary === false) return

      this.isDragging    = false
      this.isDraggingRef = false

      try {
        this.renderer.domElement.releasePointerCapture(event.pointerId)
      } catch (_) {}
    },

    // ── FLOOR RAYCAST ───────────────────────────────────────────

    raycastFloor() {
      if (this.floorPlaneTHREE) {
        const pt = new THREE.Vector3()
        if (this.raycaster.ray.intersectPlane(this.floorPlaneTHREE, pt)) return pt
      }
      // Fallback: horizontal plane at centroid Y
      const yPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -this.floorCentroid3.y)
      const pt = new THREE.Vector3()
      if (this.raycaster.ray.intersectPlane(yPlane, pt)) return pt
      return null
    },

    // ── CHAIR LOAD / RELOAD ─────────────────────────────────────

    reloadChair() {
      if (!this.scene) { console.warn('⚠️ reloadChair: scene not ready'); return }

      this.isDragging    = false
      this.isDraggingRef = false
      this.chairLoaded   = false

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

          this.chairHalfH = 0.001
          this.chair      = markRaw(pivotGroup)
          this.chairLoaded = true
          this.modelLoadProgress = 100
          this.modelLoading      = false

          if (this.planeReady) this.placeChairOnFloor()
        },
        xhr => { if (xhr.total > 0) this.modelLoadProgress = Math.round((xhr.loaded / xhr.total) * 100) },
        err => { console.error('❌ Chair reload failed:', err); this.modelLoading = false },
      )
    },

    loadChair() {
      new GLTFLoader().load(
        this.CHAIR_MODEL,
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
            this.loadingProxy = false
            this.loadingText  = ''
          }
        },
        xhr => { if (xhr.total > 0) console.log(`Loading: ${Math.round((xhr.loaded / xhr.total) * 100)}%`) },
        err => { console.error('❌ Chair load failed:', err) },
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
        if (this.debugMask) this.drawMaskOverlay()
        this.tryComputeFloor()
      }
      img.onerror = () => {
        this.erodedMask = new Uint8Array(this.CAM_IMG_W * this.CAM_IMG_H).fill(1)
        this.maskReady  = true
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
        this.loadingProxy = false
        this.loadingText  = ''
      }
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

    async renderItem() {
      if (!this.chair || !this.renderer || !this.scene || !this.camera) { console.warn('Not ready'); return }
      try {
        const currentPosition = this.chair.position.clone()
        const currentRotation = this.chair.rotation.clone()
        const currentScale    = this.chair.scale.clone()

        await this.$nextTick()
        if (this.renderer && this.scene && this.camera) this.renderer.render(this.scene, this.camera)

        this.chair.position.copy(currentPosition)
        this.chair.rotation.copy(currentRotation)
        this.chair.scale.copy(currentScale)

        this.isDraggingRef = false
        this.loadingProxy  = true
        this.loadingText   = 'Rendering Item...'

        const canvas = this.renderer.domElement
        let renderWidth  = canvas.width
        let renderHeight = canvas.height
        if (renderWidth===0||renderHeight===0) {
          const img = this.$refs.roomImage
          renderWidth  = img ? img.naturalWidth  || img.clientWidth  || 800 : 800
          renderHeight = img ? img.naturalHeight || img.clientHeight || 600 : 600
        }

        this.loadingText = 'Creating composite image...'
        const compositeBlob = await this.createCompositeImageBlob(renderWidth, renderHeight, currentPosition, currentRotation, currentScale)
        if (!compositeBlob || compositeBlob.size===0) throw new Error('Failed to create composite')

        this.loadingText = 'Creating binary mask...'
        const maskBlob = await this.createBinaryMaskBlob(renderWidth, renderHeight, currentPosition, currentRotation, currentScale)
        if (!maskBlob || maskBlob.size===0) throw new Error('Failed to create mask')

        const formData = new FormData()
        formData.append('composite_image', compositeBlob, 'composite_image.png')
        formData.append('binary_mask',     maskBlob,      'binary_mask.png')
        formData.append('room_id',  this.$route.params.id)
        formData.append('prod_id',  this.product_id)

        this.loadingText = 'Adding Product to Your Room...'
        const url      = `${this.$store.state.root_api}engine/inpaint-item-ref/`
        const response = await fetch(url, {
          method: 'POST',
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
          body: formData,
        })

        if (response.status===402) { const r=await response.json(); this.$emit('insufficient-credits',r.msg,r.buid); return }
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const result = await response.json()
        if (result.renderer_id) {
          if (this.chair) this.chair.visible = false
          this.$emit('add-3d-furniture-to-room-start-polling', result.renderer_id)
        }
        return result
      } catch (error) {
        console.error('Error rendering item:', error)
        this.loadingProxy = false
        throw error
      }
    },

    async createCompositeImageBlob(bgWidth, bgHeight, position, rotation, scale) {
      const objectCanvas = document.createElement('canvas')
      objectCanvas.width = bgWidth ; objectCanvas.height = bgHeight
      const objectRenderer = new THREE.WebGLRenderer({ canvas:objectCanvas, antialias:true, preserveDrawingBuffer:true, alpha:true, precision:'highp' })
      objectRenderer.setSize(bgWidth, bgHeight) ; objectRenderer.setPixelRatio(1)
      objectRenderer.outputColorSpace = THREE.SRGBColorSpace
      objectRenderer.setClearColor(0x000000,0)
      objectRenderer.shadowMap.enabled = true ; objectRenderer.shadowMap.type = THREE.PCFShadowMap

      const objectScene  = new THREE.Scene()
      const chairClone   = this.chair.clone(true)
      chairClone.position.copy(position) ; chairClone.rotation.copy(rotation) ; chairClone.scale.copy(scale)
      chairClone.updateMatrix()
      objectScene.add(chairClone)

      objectScene.add(new THREE.AmbientLight(0xfff4e0,1.2))
      const sun = new THREE.DirectionalLight(0xfff5e8,2.0) ; sun.position.set(1.5,5,-3) ; sun.castShadow=true ; sun.shadow.mapSize.set(2048,2048) ; objectScene.add(sun)
      const f1  = new THREE.DirectionalLight(0xd0e8ff,0.8) ; f1.position.set(-2,3,2)  ; objectScene.add(f1)
      const f2  = new THREE.DirectionalLight(0xe8f0ff,0.6) ; f2.position.set(3,2,1)   ; objectScene.add(f2)
      const bk  = new THREE.DirectionalLight(0xfff8e8,0.5) ; bk.position.set(0,2,4)   ; objectScene.add(bk)

      const objectCamera = this.camera.clone()
      objectCamera.aspect = bgWidth/bgHeight ; objectCamera.updateProjectionMatrix()
      objectRenderer.render(objectScene, objectCamera)

      const blob = await new Promise(resolve => objectCanvas.toBlob(resolve,'image/png'))
      objectRenderer.dispose()
      return blob
    },

    async createBinaryMaskBlob(bgWidth, bgHeight, position, rotation, scale) {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = bgWidth ; tempCanvas.height = bgHeight
      const tempRenderer = new THREE.WebGLRenderer({ canvas:tempCanvas, antialias:true, preserveDrawingBuffer:true })
      tempRenderer.setSize(bgWidth,bgHeight) ; tempRenderer.setPixelRatio(1)
      tempRenderer.setClearColor(0x000000,1)

      const tempScene   = new THREE.Scene()
      const chairClone  = this.chair.clone(true)
      chairClone.position.copy(position) ; chairClone.rotation.copy(rotation) ; chairClone.scale.copy(scale)
      chairClone.updateMatrix()
      chairClone.traverse(child => { if (child.isMesh) child.material = new THREE.MeshBasicMaterial({color:0xffffff}) })
      tempScene.add(chairClone)
      tempScene.add(new THREE.HemisphereLight(0xffffff,0xffffff,1.0))

      const tempCamera = this.camera.clone()
      tempCamera.aspect = bgWidth/bgHeight ; tempCamera.updateProjectionMatrix()
      tempRenderer.render(tempScene, tempCamera)

      const blob = await new Promise(resolve => tempCanvas.toBlob(resolve,'image/png'))
      tempRenderer.dispose()
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
  /* gap: 12px; */
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

.room-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 140px);
  min-height: 400px;
  max-height: calc(100vh - 140px);
  line-height: 0;
  border-radius: 6px;
  overflow: hidden;
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
.three-layer canvas { display:block; }

/* Loading overlay */
.scanning-loading-overlay { position:absolute;top:0;left:0;width:100%;height:100%;z-index:10;overflow:hidden; }
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