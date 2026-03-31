<template>
<!-- {{ CAM_FOV_H }}   -->
  <!-- {{ colors_available_for_3d_model }} -->
  <!-- {{ isLoading }}-->
  <!-- {{ internalLoading }}  -->
<!-- {{ switched_color }}    -->
<!-- ✅ Pure Tailwind Instruction Modal -->
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
            title="Close"
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
          <div v-if="internalLoading" class="scanning-loading-overlay" style="pointer-events: all; z-index: 10;">
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
  position: absolute;
  z-index: 5;
  line-height: 1.4;
  bottom: 10px;
  left: 10px;
">
  <div style="display: flex; gap: 10px; align-items: center;">

    <!-- ✅ Edit button only if resizable -->
     <div style="display: flex;flex-direction: column;gap:5px;">

       <a-button 
       v-if="is_resizable" 
       @click="show_inline_dims_editor = !show_inline_dims_editor" 
       type="primary" 
       size="small" 
       shape="circle" 
       style="display: flex; justify-content: center; align-items: center; flex-shrink: 0;"
       >
       <EditOutlined v-if="!show_inline_dims_editor" />
       <CloseCircleOutlined v-if="show_inline_dims_editor"  />
      </a-button>
      <a-button 
      v-if="show_inline_dims_editor" 
      @click="reset_targtet_dims"
      type="primary" 
      size="small" 
      shape="circle" 
      style="display: flex; justify-content: center; align-items: center; flex-shrink: 0;"
      >
      
      <ReloadOutlined  v-if="show_inline_dims_editor"  />
    </a-button>
  </div>

    <!-- ✅ Static dims display (always visible) -->
    <div v-if="!show_inline_dims_editor" style="
      display: flex; justify-content: center; align-items: center;
      background: white;
      border-radius: 5px;
      padding-left: 5px;
      padding-right: 5px;
      font-size: 12px;
      font-weight: 600;
    ">
      W-{{ TARGET_DIMS?.width }}m X H-{{ TARGET_DIMS?.height }}m X D-{{ TARGET_DIMS?.depth }}m
    </div>

    <!-- ✅ Inline +/- editor (only when edit clicked AND is_resizable) -->
    <div v-if="show_inline_dims_editor && is_resizable" style="
      display: flex;
      flex-direction: column;
      gap: 4px;
      background: white;
      border-radius: 8px;
      padding: 6px 8px;
      font-size: 11px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    ">
      <!-- Width -->
      <div style="display: flex; align-items: center; gap: 6px;">
        <span style="width: 14px; color: #666;">W</span>
        <button @click="adjustDim('width', -0.1)" style="width:20px;height:20px;border:1px solid #ddd;border-radius:4px;background:#f5f5f5;cursor:pointer;font-size:14px;line-height:1;display:flex;align-items:center;justify-content:center;padding:0;">−</button>
        <span style="min-width: 38px; text-align: center;">{{ formatDim(TARGET_DIMS?.width) }}m</span>
        <button @click="adjustDim('width', +0.1)" style="width:20px;height:20px;border:1px solid #ddd;border-radius:4px;background:#f5f5f5;cursor:pointer;font-size:14px;line-height:1;display:flex;align-items:center;justify-content:center;padding:0;">+</button>
      </div>

      <!-- Height -->
      <div style="display: flex; align-items: center; gap: 6px;">
        <span style="width: 14px; color: #666;">H</span>
        <button @click="adjustDim('height', -0.1)" style="width:20px;height:20px;border:1px solid #ddd;border-radius:4px;background:#f5f5f5;cursor:pointer;font-size:14px;line-height:1;display:flex;align-items:center;justify-content:center;padding:0;">−</button>
        <span style="min-width: 38px; text-align: center;">{{ formatDim(TARGET_DIMS?.height) }}m</span>
        <button @click="adjustDim('height', +0.1)" style="width:20px;height:20px;border:1px solid #ddd;border-radius:4px;background:#f5f5f5;cursor:pointer;font-size:14px;line-height:1;display:flex;align-items:center;justify-content:center;padding:0;">+</button>
      </div>

      <!-- Depth -->
      <div style="display: flex; align-items: center; gap: 6px;">
        <span style="width: 14px; color: #666;">D</span>
        <button @click="adjustDim('depth', -0.1)" style="width:20px;height:20px;border:1px solid #ddd;border-radius:4px;background:#f5f5f5;cursor:pointer;font-size:14px;line-height:1;display:flex;align-items:center;justify-content:center;padding:0;">−</button>
        <span style="min-width: 38px; text-align: center;">{{ formatDim(TARGET_DIMS?.depth) }}m</span>
        <button @click="adjustDim('depth', +0.1)" style="width:20px;height:20px;border:1px solid #ddd;border-radius:4px;background:#f5f5f5;cursor:pointer;font-size:14px;line-height:1;display:flex;align-items:center;justify-content:center;padding:0;">+</button>
      </div>
    </div>
  </div>
</span>

        
      <a-button type="primary" @click="$emit('unselect-object', true)"
        style=" 
          border-radius: 5px;
          padding-left: 15px;
          padding-right: 15px;
          font-size: 12px;
          font-weight: 600;
          position: absolute;
          z-index: 5;
          line-height: 1.4;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);

            background: red;
           border:none;
            color: white;
            font-weight: bold;
          pointer-events: all;display: flex;justify-content: center;align-items: center;"
        
      >
        <CloseCircleOutlined style="font-size: 18px;;"/> Unselect Object
      </a-button>
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

      <div  class="block sm:hidden">
        <div style="display: flex;gap:10px;margin-top:10px;">

          <div :key="color.id" v-for="color in colors_available_for_3d_model" >
            <!-- {{ color.is_primary }} -->
            <div @click="changeColorModel(color)" class="color-switch" :style="'background:'+color.color" v-if="color.model_file_colored_product">
            </div>
            <div  class="color-switch" :style="'background:'+color.color" style="border:2px solid red" v-else @click="No3dModelAvailableWithThisColor"> 
            </div>
          </div>
</div>
</div>

      <div class="flex justify-between items-center py-2 px-2 bg-white w-full gap-2">
        <div>
          <button
          @click="resetChairPosition"
          :disabled="!chairLoaded || !planeReady"
          style="font-family:Poppins;font-weight:500;font-size:14px;line-height:20px;letter-spacing:0%;text-align:center;background:#e5e7eb;padding:4px 24px;border-radius:6px;"
          >
          Recenter
        </button>
      </div>
<!-- {{ colors_available_for_3d_model }} -->
  <div  class="md:block hidden ">

    <div style="display: flex;gap:10px;">
    <div :key="color.id" v-for="color in colors_available_for_3d_model" >
      <!-- {{ color.is_primary }} -->
      <div @click="changeColorModel(color)" class="color-switch" :style="'background:'+color.color" v-if="color.model_file_colored_product">
      </div>
      <div  class="color-switch" :style="'background:'+color.color" style="border:2px solid red" v-else @click="No3dModelAvailableWithThisColor"> 
      </div>
    </div>
    </div>
  </div>
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
     <div class="flex justify-end items-center py-2 px-2 bg-white w-full gap-2" v-show="!CHAIR_MODEL && CHAIR_MODEL === ''">
        
        <a-button
          type="primary"
          @click="$emit('Apply-Changes', 'item-replacement-3d-renderer')"
          :disabled="!planeReady"
          style="padding:4px 12px;border-radius:6px;"
        >
          Finalise Changes
        </a-button>
      </div>
  </div>
</template>


<script>
import { markRaw } from 'vue'
import * as THREE from 'three'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

import { EditOutlined,CloseCircleOutlined,ReloadOutlined } from '@ant-design/icons-vue';

import TapToSelect from "@/assets/icons/tap.png";
import DragToMove from "@/assets/icons/tapAndMove.png";
import threetapnove from "@/assets/icons/threetapnove.png";

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
    CAM_FOV_H: Object,
    POINTCLOUD: Object,
    CHAIR_MODEL: Object,
    FLOOR_MASK: Object,
    BASE_ROOT_MAIN_IMAGE: Object,
    TARGET_DIMS: Object,
    debug: Boolean,
    product_id: { type: String, required: true },
    colors_available_for_3d_model:Object,
    switched_color:Object,
    primary_model_3d_url:String,
    is_resizable:Boolean
  },

  data() {
    return {
      _isReloading: false,
      _pendingReload: false,
          _isRendering: false,   // ← add this


      show_inline_dims_editor: false,
update_dimensions: {
      width: 0,
      height: 0,
      depth: 0
    },
      // ✅ FIX 1 OF 4: _spinAngleRad is the ONLY source of truth for spin.
      // alignChairToFloor READS this — never overwrites it.
      // Only updateChairRotation() and pointer handlers WRITE to it.
      _spinAngleRad: 0,
      // ✅ FIX 4 OF 4: blocks chairRotation watcher during renderItem
      _renderLock: false,

      isShowInstructionModal: false,
      instructionConfig: [
        { key: "Tap to select a product", value: TapToSelect },
        { key: "Drag to move 3D Furniture", value: DragToMove },
        { key: "Two finger swipe left or right to Rotate the Furniture", value: threetapnove },
      ],

      loadingText: 'Initializing...',
      modelLoadProgress: 0,
      modelLoading: false,
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

      isDraggingRef: false,
      isRotatingRef: false,

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

      rotationRing: null,
      rotationArrows: [],
      showRotationRing: true,

      lastKnownPos: null,
      lastKnownQuat: null,
      lastKnownScale: null,
      _pendingTransformRestore: null,

      _worldUp: null,
      _tiltQ: null,
      _fn: null,
      _spinQ: null,
      _spinAxis: null,

      _twoFingerRafId: null,
      _twoFingerPending: null,
      _twoFingerNewRotRad: null,
      _finger0Y: null,
      _finger1Y: null,
      _finger0Id: null,
      _finger1Id: null,
    }
  },

  emits: [
    'update:isLoading',
    'insufficient-credits',
    'add-3d-furniture-to-room-start-polling',
    'rendered-comfyui-workflow',
    'Apply-Changes',
    'update-dimensions',

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
    this._worldUp  = markRaw(new THREE.Vector3(0, 1, 0))
    this._tiltQ    = markRaw(new THREE.Quaternion())
    this._fn       = markRaw(new THREE.Vector3())
    this._spinQ    = markRaw(new THREE.Quaternion())
    this._spinAxis = markRaw(new THREE.Vector3())

    this._twoFingerRafId     = null
    this._twoFingerPending   = false
    this._twoFingerNewRotRad = 0

    this._finger0Y  = 0
    this._finger1Y  = 0
    this._finger0Id = -1
    this._finger1Id = -1

    this.floorNormal3   = markRaw(new THREE.Vector3(0, 1, 0))
    this.floorCentroid3 = markRaw(new THREE.Vector3())

    this.isDragging          = false
    this.dragOffset          = markRaw(new THREE.Vector3())
    this.raycaster           = markRaw(new THREE.Raycaster())
    this.mouse               = markRaw(new THREE.Vector2())

    this.isRotating          = false
    this.rotationStartAngle  = 0
    this.rotationStartMouseX = 0

    this.twoFingerPointers   = new Map()
    this.twoFingerStartAngle = 0
    this.twoFingerStartAvgY  = 0
    this.isTwoFingerRotating = false

    this.lastKnownPos   = null
    this.lastKnownQuat  = null
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
      }
    })
  },

  beforeUnmount() {
    this.cleanup()
  },
components:{
  EditOutlined,
  CloseCircleOutlined,
  ReloadOutlined
},
  methods: {
    reset_targtet_dims(){
this.show_inline_dims_editor=false
      this.$emit('reset_target_dimensions',true)
    },
adjustDim(axis, delta) {
  if (!this.TARGET_DIMS) return
  const current = parseFloat(this.TARGET_DIMS[axis]) || 0
  const updated = Math.max(0.01, parseFloat((current + delta).toFixed(2)))
  this.$emit('update-dimensions', {
    ...this.TARGET_DIMS,
    [axis]: updated,
  })
},

formatDim(val) {
  return val ? parseFloat(val).toFixed(2) : '0.00'
},
 
rescaleChair() {
  if (!this.chair) return
  const innerMesh = this.chair.children[0]
  if (!innerMesh) return

  const fovRad     = (this.CAM_FOV_V * Math.PI) / 180
  const fy_threejs = this.CAM_IMG_H / 2 / Math.tan(fovRad / 2)
  const focal      = this.CAM_FY / fy_threejs

  // Get original unscaled size by reversing current scale
  const origSizeX = innerMesh.scale.x > 0 ? (this.chairBaseScaleX > 0 ? innerMesh.scale.x / this.chairBaseScaleX : 1) : 1

  // Reset to base 1 to get natural size, then apply new dims
  innerMesh.scale.set(1, 1, 1)
  innerMesh.updateMatrixWorld(true)
  const box  = new THREE.Box3().setFromObject(innerMesh)
  const size = new THREE.Vector3()
  box.getSize(size)

  const sx = size.x > 0 ? (this.TARGET_DIMS.width  * this.CHAIR_SCALE_FACTOR * focal) / size.x : 1
  const sy = size.y > 0 ? (this.TARGET_DIMS.height * this.CHAIR_SCALE_FACTOR * focal) / size.y : 1
  const sz = size.z > 0 ? (this.TARGET_DIMS.depth  * this.CHAIR_SCALE_FACTOR * focal) / size.z : 1

  innerMesh.scale.set(sx, sy, sz)
  this.chairBaseScaleX = sx
  this.chairBaseScaleY = sy
  this.chairBaseScaleZ = sz
  innerMesh.updateMatrixWorld(true)

  // Re-seat on floor
  this.placeChairOnFloor(this.chair.position.x, this.chair.position.z)
  if (this.rotationRing) this._snapRingToChair()
},
    No3dModelAvailableWithThisColor(){
        this.$message.error('This color furniture 3D model is not available');
    },
    changeColorModel(color){
      if(color.is_primary){
        console.log('switch-to-original-primary-3d-model');
              this.$emit('switch-to-original-primary-3d-model',true)
    }
        else{ 
          this.loadChangeColorModel(color)
        }
    },
    async loadChangeColorModel(color){
      try {
        // const url = `${this.$store.state.root_api}product/api/product-details/${this.product_id}/`;
        const url = `${this.$store.state.root_api}product/api/load-product-different-color/${color.id}/`;

        console.log("📡 Fetching from:", url);

        const token = localStorage.getItem("token");
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        const data = result;
        console.log(data);

        this.$emit('switch-3d-model-change-color',data)

        
      } catch (error) {
        console.error("❌ Error loading product details:", error);
        throw error;
      }
    },

    showInstructionModal() { this.isShowInstructionModal = true },
    closeInstructionModal() { this.isShowInstructionModal = false },

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

      this.loadMask()
      this.loadPointCloud()
      this.loadChair()
      this.animate()

      const el = this.renderer.domElement
      el.style.touchAction = 'none'
      el.addEventListener('pointerdown',   this.onPointerDown)
      el.addEventListener('pointermove',   this.onPointerMove)
      el.addEventListener('pointerup',     this.onPointerUp)
      el.addEventListener('pointercancel', this.onPointerUp)

      window.addEventListener('resize', this.adjustCanvasToAspectRatio)

      this.$nextTick(() => {
        this.adjustCanvasToAspectRatio()
        setTimeout(() => this.adjustCanvasToAspectRatio(), 150)
      })
    },

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

      cssW = Math.min(cssW, availableW)
      cssH = Math.min(cssH, availableH)

      const offsetX = Math.round((availableW - cssW) / 2)
      const offsetY = Math.round((availableH - cssH) / 2)

      this.renderer.domElement.style.width  = `${cssW}px`
      this.renderer.domElement.style.height = `${cssH}px`

      this.maskOverlayCanvas.style.width  = `${cssW}px`
      this.maskOverlayCanvas.style.height = `${cssH}px`
      this.maskOverlayCanvas.style.left   = `${offsetX}px`
      this.maskOverlayCanvas.style.top    = `${offsetY}px`

      if (this.rotationRing) this._fitRingToCanvas()
    },

    onPointerDown(event) {
        if (this.internalLoading || this._renderLock) return

      if (!this.chair || !this.floorPlaneTHREE) return

      if (event.pointerType === 'touch') {
        this.twoFingerPointers.set(event.pointerId, event.clientY)

        if (this.twoFingerPointers.size === 2) {
          this.isDragging    = false
          this.isDraggingRef = false
          this.isRotating    = false
          this.isRotatingRef = false

          const ids = Array.from(this.twoFingerPointers.keys())
          this._finger0Id = ids[0]
          this._finger1Id = ids[1]
          this._finger0Y  = this.twoFingerPointers.get(ids[0])
          this._finger1Y  = this.twoFingerPointers.get(ids[1])

          this.twoFingerStartAvgY  = (this._finger0Y + this._finger1Y) / 2
          // ✅ FIX 2 OF 4: snapshot clean radian spin — NOT chair.rotation.y
          // chair.rotation.y is corrupted by tiltQ; only _spinAngleRad is clean
          this.twoFingerStartAngle = this._spinAngleRad
          this.isTwoFingerRotating = true

          if (this._twoFingerRafId) {
            cancelAnimationFrame(this._twoFingerRafId)
            this._twoFingerRafId = null
          }
          this._twoFingerPending = false

          event.preventDefault()
          return
        }

        if (this.isTwoFingerRotating) {
          event.preventDefault()
          return
        }
      }

      if (this.isTwoFingerRotating) return

      const { clientX, clientY } = event
      const { ndcX, ndcY } = this._eventToNDC(clientX, clientY)
      this.mouse.set(ndcX, ndcY)
      this.raycaster.setFromCamera(this.mouse, this.camera)

      if (this.rotationRing && this.showRotationRing) {
        const arrowHits = this.raycaster.intersectObject(this.rotationRing, true)
        const arrowHit  = arrowHits.find(h => h.object.userData.isRotationArrow)

        if (arrowHit) {
          const visMesh = arrowHit.object.userData.visMesh
          if (visMesh) visMesh.material.color.setHex(0xff6600)

          this.isRotating          = true
          this.isRotatingRef       = true
          // ✅ snapshot clean radian spin
          this.rotationStartAngle  = this._spinAngleRad
          this.rotationStartMouseX = ndcX

          this.renderer.domElement.setPointerCapture(event.pointerId)
          event.preventDefault()
          return
        }
      }

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

    _snapRingToChairFast() {
      if (!this.rotationRing || !this.chair) return
      this.rotationRing.position.copy(this.chair.position)
      this.rotationRing.position.addScaledVector(this.floorNormal3, 0.012)
      this._fn.copy(this.floorNormal3).normalize()
      this._tiltQ.setFromUnitVectors(this._worldUp, this._fn)
      this.rotationRing.quaternion.copy(this._tiltQ)
    },

    onPointerMove(event) {
      if (event.pointerType === 'touch' && this.isTwoFingerRotating) {
        if (!this.twoFingerPointers.has(event.pointerId)) return

        if (event.pointerId === this._finger0Id) {
          this._finger0Y = event.clientY
        } else if (event.pointerId === this._finger1Id) {
          this._finger1Y = event.clientY
        }
        this.twoFingerPointers.set(event.pointerId, event.clientY)

        if (this.twoFingerPointers.size === 2) {
          const avgY     = (this._finger0Y + this._finger1Y) * 0.5
          const deltaY   = avgY - this.twoFingerStartAvgY
          const deltaRad = (deltaY / 200) * Math.PI * 2
          // ✅ compute from clean radian baseline — no degree round-trip
          this._twoFingerNewRotRad = this.twoFingerStartAngle + deltaRad

          if (!this._twoFingerPending) {
            this._twoFingerPending = true
            this._twoFingerRafId = requestAnimationFrame(() => {
              this._twoFingerPending = false
              this._twoFingerRafId   = null
              if (!this.chair || !this.isTwoFingerRotating) return

              // ✅ Write to _spinAngleRad FIRST, then sync degrees for UI
              this._spinAngleRad = this._twoFingerNewRotRad
              this.chairRotation = ((THREE.MathUtils.radToDeg(this._spinAngleRad) % 360) + 360) % 360
              this.alignChairToFloor()
              this._snapRingToChairFast()
              this.snapLightToChair()
            })
          }
        }

        event.preventDefault()
        return
      }

      if (event.pointerType === 'touch' && event.isPrimary === false) return
      if (!this.isDragging && !this.isRotating) return

      const { clientX, clientY } = event
      const { ndcX, ndcY, sx, sy } = this._eventToNDC(clientX, clientY)
      this.mouse.set(ndcX, ndcY)

      if (this.isRotating) {
        const deltaX  = ndcX - this.rotationStartMouseX
        const newRotRad = this.rotationStartAngle + deltaX * Math.PI * 2

        // ✅ Write _spinAngleRad FIRST, then sync UI degrees
        this._spinAngleRad = newRotRad
        this.chairRotation = ((THREE.MathUtils.radToDeg(newRotRad) % 360) + 360) % 360

        this.alignChairToFloor()
        this._snapRingToChairFast()
        this.snapLightToChair()

        event.preventDefault()
        return
      }

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
        this._snapRingToChairFast()
        this.snapLightToChair()

        event.preventDefault()
      }
    },

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
    },

    onPointerUp(event) {
      if (event.pointerType === 'touch') {
        this.twoFingerPointers.delete(event.pointerId)

        if (this.twoFingerPointers.size < 2 && this.isTwoFingerRotating) {
          if (this._twoFingerRafId) {
            cancelAnimationFrame(this._twoFingerRafId)
            this._twoFingerRafId   = null
            this._twoFingerPending = false
          }
          this.isTwoFingerRotating = false
          // ✅ FIX 3 OF 4: sync degrees from _spinAngleRad — NOT from chair.rotation.y
          // After multiplyQuaternions(spinQ, tiltQ), euler.y is contaminated by tiltQ
          if (this.chair) {
            this.chairRotation = ((THREE.MathUtils.radToDeg(this._spinAngleRad) % 360) + 360) % 360
          }
          this._saveLastKnownTransform()
          return
        }
        if (this.isTwoFingerRotating) return
      }

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

      // ✅ FIX 3 OF 4 (single pointer path): same fix — read _spinAngleRad
      if (this.chair) {
        this.chairRotation = ((THREE.MathUtils.radToDeg(this._spinAngleRad) % 360) + 360) % 360
      }
      this._saveLastKnownTransform()
    },

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

    createRotationRing() {
      this._disposeRotationRing()

      const ring = new THREE.Group()
      ring.name  = 'rotationRing'

      const RADIUS       = 1.0
      const SEGMENTS     = 128
      const LINE_COLOR   = 0xffffff
      const ARROW_COLOR  = 0x00e5ff
      const ARROW_ANGLES = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5]

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

      this.rotationArrows = []

      const AW    = 0.13
      const AH    = 0.22
      const HIT_R = 0.32

      ARROW_ANGLES.forEach((angle) => {
        const tx =  Math.sin(angle)
        const tz = -Math.cos(angle)
        const nx = -Math.cos(angle)
        const nz = -Math.sin(angle)

        const cx = Math.cos(angle) * RADIUS
        const cz = Math.sin(angle) * RADIUS

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
          new THREE.MeshBasicMaterial({ color: ARROW_COLOR, side: THREE.DoubleSide }),
        )
        visMesh.raycast = () => {}
        ring.add(visMesh)

        const hitMesh = new THREE.Mesh(
          new THREE.CircleGeometry(HIT_R, 20),
          new THREE.MeshBasicMaterial({
            transparent: true,
            opacity:     0,
            side:        THREE.DoubleSide,
            depthWrite:  false,
          }),
        )
        hitMesh.rotation.x  = -Math.PI / 2
        hitMesh.position.set(cx, 0.002, cz)
        hitMesh.userData = {
          isRotationArrow: true,
          originalColor:   ARROW_COLOR,
          visMesh,
        }
        ring.add(hitMesh)
        this.rotationArrows.push(hitMesh)
      })

      ring.visible      = this.showRotationRing
      this.rotationRing = markRaw(ring)
      this.scene.add(ring)
    },

    _snapRingToChair() {
      this._snapRingToChairFast()
      this._fitRingToCanvas()
    },

    _fitRingToCanvas() {
      if (!this.rotationRing || !this.renderer || !this.chair || !this.camera) return
      let footprintHalf = 0.6
      if (this.TARGET_DIMS && this.TARGET_DIMS.width) {
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
      this.rotationRing   = null
      this.rotationArrows = []
    },

    // reloadChair() {
    //   if (!this.scene) { console.warn('⚠️ reloadChair: scene not ready'); return }
    //   // ✅ Clear the WebGL canvas immediately so old model doesn't ghost
      
    //   // ✅ Hide old chair from animate() loop IMMEDIATELY
    //   if (this.chair) this.chair.visible = false

    //   // ✅ Force one blank frame right now — clears the canvas visually
    //   if (this.renderer && this.scene && this.camera) {
    //     this.renderer.setClearColor(0x000000, 0)
    //     this.renderer.clear(true, true, true)
    //     this.renderer.render(this.scene, this.camera)
    //   }

    //   this.isDragging          = false
    //   this.isDraggingRef       = false
    //   this.isRotating          = false
    //   this.isRotatingRef       = false
    //   this.chairLoaded         = false
    //   this.internalLoading     = true
    //   this.internalLoadingText = 'Loading 3D model…'

    //   this._disposeRotationRing()

    //   if (this.chair) {
    //     this.scene.remove(this.chair)
    //     this.chair.traverse((child) => {
    //       if (child.geometry) child.geometry.dispose()
    //       if (child.material) {
    //         Array.isArray(child.material)
    //           ? child.material.forEach(m => m.dispose())
    //           : child.material.dispose()
    //       }
    //     })
    //     this.chair = null
    //   }

    //   // ✅ reset spin on reload
    //   this._spinAngleRad     = 0
    //   this.chairRotation     = 0
    //   this.modelLoadProgress = 0
    //   this.modelLoading      = true

    //   const modelUrl = this.resolveModelUrl(this.CHAIR_MODEL)

    //   new GLTFLoader().load(
    //     modelUrl,
    //     (gltf) => {
    //       const innerMesh = gltf.scene
    //       innerMesh.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
    //       innerMesh.position.set(0, 0, 0)
    //       innerMesh.rotation.set(0, 0, 0)
    //       innerMesh.scale.set(1, 1, 1)
    //       innerMesh.updateMatrixWorld(true)

    //       const flippedBox  = new THREE.Box3().setFromObject(innerMesh)
    //       const flippedSize = new THREE.Vector3()
    //       flippedBox.getSize(flippedSize)

    //       const fovRad          = (this.CAM_FOV_V * Math.PI) / 180
    //       const fy_threejs      = this.CAM_IMG_H / 2 / Math.tan(fovRad / 2)
    //       const focalCorrection = this.CAM_FY / fy_threejs

    //       const sx = flippedSize.x > 0 ? (this.TARGET_DIMS.width  * this.CHAIR_SCALE_FACTOR * focalCorrection) / flippedSize.x : 1
    //       const sy = flippedSize.y > 0 ? (this.TARGET_DIMS.height * this.CHAIR_SCALE_FACTOR * focalCorrection) / flippedSize.y : 1
    //       const sz = flippedSize.z > 0 ? (this.TARGET_DIMS.depth  * this.CHAIR_SCALE_FACTOR * focalCorrection) / flippedSize.z : 1
    //       innerMesh.scale.set(sx, sy, sz)
    //       innerMesh.updateMatrixWorld(true)

    //       this.chairBaseScaleX = sx ; this.chairBaseScaleY = sy ; this.chairBaseScaleZ = sz

    //       const pivotGroup = new THREE.Group()
    //       pivotGroup.add(innerMesh)
    //       this.scene.add(pivotGroup)

    //       const scaledBox = new THREE.Box3().setFromObject(pivotGroup)
    //       innerMesh.position.y -= scaledBox.min.y
    //       innerMesh.updateMatrixWorld(true)

    //       this.chairHalfH        = 0.001
    //       this.chair             = markRaw(pivotGroup)
    //       this.chairLoaded       = true
    //       this.modelLoadProgress = 100
    //       this.modelLoading      = false

    //       if (this.planeReady) {
    //         this.placeChairOnFloor()
    //         this.createRotationRing()
    //         this._snapRingToChair()

    //         if (this._pendingTransformRestore) {
    //           this._applyPendingTransform()
    //         }
    //       }
    //       this._checkAllReady()
    //     },
    //     xhr => { if (xhr.total > 0) this.modelLoadProgress = Math.round((xhr.loaded / xhr.total) * 100) },
    //     err => { console.error('❌ Chair reload failed:', err); this.modelLoading = false; this._checkAllReady() },
    //   )
    // },

    reloadChair() {
  if (!this.scene) { console.warn('⚠️ reloadChair: scene not ready'); return }
  if (this._isReloading) { this._pendingReload = true; return }

  // ✅ Prevent concurrent reloads (color spam clicking)
  if (this._isReloading) {
    console.warn('⚠️ reloadChair: already reloading, queuing...')
    this._pendingReload = true
    return
  }
  this._isReloading = true
    this._isRendering  = true   // ← pause animate() NOW, before any disposal

  this._pendingReload = false

  // ✅ Step 1: Immediately dispose OLD chair completely
  this._disposeRotationRing()

  if (this.chair) {
    this.chair.visible = false
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

  // ✅ Step 2: Force a blank render immediately to clear canvas
  if (this.renderer && this.scene && this.camera) {
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.clear(true, true, true)
    // this.renderer.render(this.scene, this.camera)
  }

  this.isDragging          = false
  this.isDraggingRef       = false
  this.isRotating          = false
  this.isRotatingRef       = false
  this.chairLoaded         = false
  this.internalLoading     = true
  this.internalLoadingText = 'Loading 3D model…'
  this._spinAngleRad       = 0
  this.chairRotation       = 0
  this.modelLoadProgress   = 0
  this.modelLoading        = true

  const modelUrl = this.resolveModelUrl(this.CHAIR_MODEL)

  const chairLoader = new GLTFLoader()
  chairLoader.setMeshoptDecoder(MeshoptDecoder)
  chairLoader.load(
    modelUrl,
    (gltf) => {
      // ✅ If another reload was queued while this was loading, abort this result
      if (this._pendingReload) {
        console.warn('⚠️ Newer reload queued, discarding this result')
        this._isReloading = false
          this._isRendering = false   // ← release before recursing

        this.reloadChair()
        return
      }

      // ✅ Safety: dispose any chair that might have snuck in
      if (this.chair) {
        this.chair.visible = false
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

      const innerMesh = gltf.scene
      innerMesh.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true } })
      innerMesh.position.set(0, 0, 0)
      innerMesh.rotation.set(0, 0, 0)
      innerMesh.scale.set(1, 1, 1)
      innerMesh.updateMatrixWorld(true)

      const flippedBox  = new THREE.Box3().setFromObject(innerMesh)
      const flippedSize = new THREE.Vector3()
      flippedBox.getSize(flippedSize)

      const fovRad          = (this.CAM_FOV_V * Math.PI) / 180
      const fy_threejs      = this.CAM_IMG_H / 2 / Math.tan(fovRad / 2)
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

      const scaledBox = new THREE.Box3().setFromObject(pivotGroup)
      innerMesh.position.y -= scaledBox.min.y
      innerMesh.updateMatrixWorld(true)

      this.chairHalfH        = 0.001
      this.chair             = markRaw(pivotGroup)
      this.chairLoaded       = true
      this.modelLoadProgress = 100
      this.modelLoading      = false
        this._isRendering = false   // ← release AFTER chair is set up

      this._isReloading      = false  // ✅ release lock

      if (this.planeReady) {
        this.placeChairOnFloor()
        this.createRotationRing()
        this._snapRingToChair()

        if (this._pendingTransformRestore) {
          this._applyPendingTransform()
        }
      }
      this._checkAllReady()
    },
    xhr => { if (xhr.total > 0) this.modelLoadProgress = Math.round((xhr.loaded / xhr.total) * 100) },
    err => {
      console.error('❌ Chair reload failed:', err)
      this.modelLoading  = false
      this._isReloading  = false  
      this._isRendering = false   

      this._checkAllReady()
    },
  )
},
    loadChair() {
      const modelUrl = this.resolveModelUrl(this.CHAIR_MODEL)
      if (!modelUrl) { console.warn('⚠️ loadChair: no model URL'); return }
        const chairLoader = new GLTFLoader()
        chairLoader.setMeshoptDecoder(MeshoptDecoder)
        chairLoader.load(
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

          const fovRad          = (this.CAM_FOV_V * Math.PI) / 180
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
      // ✅ reset both trackers
      this._spinAngleRad = 0
      this.chairRotation = 0
      this.placeChairOnFloor(this.floorCentroid3.x, this.floorCentroid3.z)
      if (this.rotationRing) this._snapRingToChair()
    },

    // ✅ FIX 1 OF 4: alignChairToFloor READS _spinAngleRad — never overwrites it.
    // The old version did: this._spinAngleRad = (this.chairRotation * Math.PI) / 180
    // That caused a degree→radian round-trip: 2.1rad → 120.321° → 2.09999rad (drift!)
    // Now _spinAngleRad is only ever written by:
    //   - updateChairRotation()    (slider / watcher)
    //   - onPointerMove isRotating (ring drag)
    //   - onPointerMove twoFinger  (two-finger swipe)
    //   - resetChairPosition()
    //   - reloadChair()
    alignChairToFloor() {
      if (!this.chair) return
      this._fn.copy(this.floorNormal3).normalize()
      this._tiltQ.setFromUnitVectors(this._worldUp, this._fn)
      // ✅ READ _spinAngleRad — do NOT recalculate from chairRotation
      this._spinQ.setFromAxisAngle(this._fn, this._spinAngleRad)
      this.chair.quaternion.multiplyQuaternions(this._spinQ, this._tiltQ)
    },

    updateChairRotation() {
      if (this.chair && this.planeReady) {
        // ✅ This is the ONE place that converts degrees → radians
        this._spinAngleRad = (this.chairRotation * Math.PI) / 180
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
      // console.log('🟩 Floor points under mask:', floorPts.length, floorPts)

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
        this.createRotationRing()
        this._snapRingToChair()
      }
      this._checkAllReady()
    },

    restoreModelTransform(transform) {
      if (!transform) return
      this._pendingTransformRestore = {
        position: { x: transform.position.x, y: transform.position.y, z: transform.position.z },
        rotation: { x: transform.rotation.x, y: transform.rotation.y, z: transform.rotation.z },
        scale:    { x: transform.scale.x,    y: transform.scale.y,    z: transform.scale.z },
      }
      this.lastKnownPos   = { ...this._pendingTransformRestore.position }
      this.lastKnownQuat  = null
      this.lastKnownScale = { ...this._pendingTransformRestore.scale }
      if (this.chair && this.planeReady) {
        this._applyPendingTransform()
      }
    },

    _applyPendingTransform() {
      if (!this._pendingTransformRestore || !this.chair) return
      const t = this._pendingTransformRestore
      this.chair.position.set(t.position.x, t.position.y, t.position.z)
      this.chair.scale.set(t.scale.x, t.scale.y, t.scale.z)
      // ✅ restore _spinAngleRad from saved rotation.y, then re-apply properly
      this._spinAngleRad = t.rotation.y
      this.chairRotation = ((THREE.MathUtils.radToDeg(t.rotation.y) % 360) + 360) % 360
      this.alignChairToFloor()
      this.chair.updateMatrixWorld(true)
      this.lastKnownPos   = { x: this.chair.position.x, y: this.chair.position.y, z: this.chair.position.z }
      this.lastKnownQuat  = { x: this.chair.quaternion.x, y: this.chair.quaternion.y, z: this.chair.quaternion.z, w: this.chair.quaternion.w }
      this.lastKnownScale = { x: this.chair.scale.x, y: this.chair.scale.y, z: this.chair.scale.z }
      if (this.rotationRing) this._snapRingToChair()
      this.snapLightToChair()
      this._pendingTransformRestore = null
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

    _getBgNativeSize() {
      const img = this.$refs.roomImage
      if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
        return { w: img.naturalWidth, h: img.naturalHeight }
      }
      const c = this.renderer?.domElement
      return { w: c?.width || 800, h: c?.height || 600 }
    },

    downloadImages(compositeBlob, maskBlob) {
      const compositeUrl  = URL.createObjectURL(compositeBlob)
      const compositeLink = document.createElement('a')
      compositeLink.href = compositeUrl
      compositeLink.download = 'composite_image.png'
      document.body.appendChild(compositeLink)
      compositeLink.click()
      document.body.removeChild(compositeLink)
      URL.revokeObjectURL(compositeUrl)

      const maskUrl  = URL.createObjectURL(maskBlob)
      const maskLink = document.createElement('a')
      maskLink.href = maskUrl
      maskLink.download = 'binary_mask.png'
      document.body.appendChild(maskLink)
      maskLink.click()
      document.body.removeChild(maskLink)
      URL.revokeObjectURL(maskUrl)
    },


    async renderItem() {
  if (!this.chair || !this.renderer || !this.scene || !this.camera) {
    console.warn('renderItem: not ready')
    return
  }
  this.$emit('update:isLoading', true)
  if (this.renderer?.domElement) {
    this.renderer.domElement.style.pointerEvents = 'none'
  }

  try {
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

    this._renderLock = true
    if (this.rotationRing) this.rotationRing.visible = false
    this.renderer.render(this.scene, this.camera)

    this.chair.position.set(snapPos.x, snapPos.y, snapPos.z)
    this.chair.quaternion.set(snapQuat.x, snapQuat.y, snapQuat.z, snapQuat.w)
    this.chair.scale.set(snapScale.x, snapScale.y, snapScale.z)
    this.chair.updateMatrixWorld(true)

    // ✅ FIX: declare roomImg before using it
    const roomImg = this.$refs.roomImage
    const exportW = (roomImg && roomImg.naturalWidth)  ? roomImg.naturalWidth  : (this.CAM_IMG_W || 800)
    const exportH = (roomImg && roomImg.naturalHeight) ? roomImg.naturalHeight : (this.CAM_IMG_H || 600)

    // ✅ Clone ONCE — frozen before any async work
    const frozenChairClone = this.chair.clone(true)
    frozenChairClone.position.set(snapPos.x, snapPos.y, snapPos.z)
    frozenChairClone.quaternion.set(snapQuat.x, snapQuat.y, snapQuat.z, snapQuat.w)
    frozenChairClone.scale.set(snapScale.x, snapScale.y, snapScale.z)
    frozenChairClone.updateMatrixWorld(true)

    this.internalLoadingText = 'Creating composite image...'
    const compositeBlob = await this.createCompositeImageBlob(exportW, exportH, snapPos, snapQuat, snapScale, frozenChairClone)
    if (!compositeBlob || compositeBlob.size === 0) throw new Error('Composite blob empty')

    this.internalLoadingText = 'Creating binary mask...'
    const maskBlob = await this.createBinaryMaskBlob(exportW, exportH, snapPos, snapQuat, snapScale, frozenChairClone)
    if (!maskBlob || maskBlob.size === 0) throw new Error('Mask blob empty')
    
    this.downloadImages(compositeBlob, maskBlob)
    // return 
    
    // ── release lock BEFORE reactive state changes ────────
    this._renderLock         = false
    this.internalLoading     = true
    this.internalLoadingText = 'Rendering Item...'
    this.isDraggingRef       = false
    this.loadingProxy        = true

    if (this.chair) this.chair.visible = false
    if (this.rotationRing) this.rotationRing.visible = false
    await this.$nextTick()

    const formData = new FormData()
    formData.append('composite_image', compositeBlob, 'composite_image.png')
    formData.append('binary_mask',     maskBlob,      'binary_mask.png')
    formData.append('room_id',  this.$route.params.id)

    if (this.switched_color) {
      formData.append('switch_model_color_id', this.switched_color?.product_color_id)
    }

    formData.append('prod_id', this.$route.query.product_id)

    this.internalLoadingText = 'Adding Product to Your Room...'
    const response = await fetch(
      `${this.$store.state.root_api}engine/inpaint-item-ref/`,
      {
        method:  'POST',
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        body:    formData,
      }
    )

    if (response.status === 402) {
      const r = await response.json()
      this.$emit('insufficient-credits', r.msg, r.buid)
      return
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const result = await response.json()
    if (result.renderer_id) {
      if (this.chair) this.chair.visible = false
      this.$emit('add-3d-furniture-to-room-start-polling', result.renderer_id)
    }

    this.$emit('update:isLoading', false)
    this.loadingProxy = false
    return result

  } catch (error) {
    console.error('renderItem error:', error)
    this._renderLock     = false
    this.internalLoading = false
    this.loadingProxy    = false
    if (this.rotationRing) this.rotationRing.visible = true
    throw error
  } finally {
    if (this.renderer?.domElement) {
      this.renderer.domElement.style.pointerEvents = 'auto'
    }
  }
},

    async createCompositeImageBlob(bgWidth, bgHeight, snapPos, snapQuat, snapScale, frozenChairClone) {
  const offCanvas = document.createElement('canvas')
  offCanvas.width  = bgWidth
  offCanvas.height = bgHeight

  const offRenderer = new THREE.WebGLRenderer({
    canvas: offCanvas, antialias: true,
    preserveDrawingBuffer: true, alpha: true, precision: 'highp',
  })
  offRenderer.setSize(bgWidth, bgHeight, false)
  offRenderer.setPixelRatio(1)
  offRenderer.outputColorSpace  = THREE.SRGBColorSpace
  offRenderer.setClearColor(0x000000, 0)
  offRenderer.shadowMap.enabled = true
  offRenderer.shadowMap.type    = THREE.PCFSoftShadowMap

  const offScene = new THREE.Scene()

  // ✅ Use the pre-frozen clone — no re-clone, no mutation risk
  offScene.add(frozenChairClone)

  // shadow plane, lights... (unchanged)
  const shadowGeo   = new THREE.PlaneGeometry(12, 12)
  const shadowMat   = new THREE.ShadowMaterial({ opacity: 0.08, transparent: true, depthWrite: false })
  const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat)
  shadowPlane.receiveShadow = true
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), this.floorNormal3)
  shadowPlane.applyQuaternion(q)
  shadowPlane.position.copy(this.floorCentroid3)
  shadowPlane.position.addScaledVector(this.floorNormal3, 0.005)
  offScene.add(shadowPlane)

  offScene.add(new THREE.AmbientLight(0xfff4e0, 1.2))
  const sun = new THREE.DirectionalLight(0xfff5e8, 2.0)
  sun.position.set(1.5, 5, -3)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.near = 0.1; sun.shadow.camera.far = 20
  sun.shadow.camera.left = -6;  sun.shadow.camera.right = 6
  sun.shadow.camera.bottom = -6; sun.shadow.camera.top = 6
  sun.shadow.bias = -0.001; sun.shadow.normalBias = 0.02
  offScene.add(sun)
  const f1 = new THREE.DirectionalLight(0xd0e8ff, 2.8); f1.position.set(-2, 3, 2); offScene.add(f1)
  const f2 = new THREE.DirectionalLight(0xe8f0ff, 0.6); f2.position.set( 3, 2, 1); offScene.add(f2)
  const bk = new THREE.DirectionalLight(0xfff8e8, 0.5); bk.position.set( 0, 2, 4); offScene.add(bk)

  const offCamera = this.camera.clone()
  offCamera.aspect = bgWidth / bgHeight
  offCamera.updateProjectionMatrix()
  offCamera.updateMatrixWorld(true)

  offRenderer.render(offScene, offCamera)
  const blob = await new Promise(resolve => offCanvas.toBlob(resolve, 'image/png'))
  
  // ✅ Remove clone from scene before mask render reuses it
  offScene.remove(frozenChairClone)
  offRenderer.dispose()
  return blob
},

async createBinaryMaskBlob(bgWidth, bgHeight, snapPos, snapQuat, snapScale, frozenChairClone) {
  const offCanvas = document.createElement('canvas')
  offCanvas.width  = bgWidth
  offCanvas.height = bgHeight

  const offRenderer = new THREE.WebGLRenderer({
    canvas: offCanvas, antialias: false,
    preserveDrawingBuffer: true, alpha: false,
  })
  offRenderer.setSize(bgWidth, bgHeight, false)
  offRenderer.setPixelRatio(1)
  offRenderer.setClearColor(0x000000, 1)

  const offScene = new THREE.Scene()

  // ✅ Reuse same frozen clone — swap materials to white only
  frozenChairClone.traverse(child => {
    if (child.isMesh) {
      child.material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: false,
        depthWrite: true,
      })
      child.castShadow    = false
      child.receiveShadow = false
    }
  })
  offScene.add(frozenChairClone)
  offScene.add(new THREE.AmbientLight(0xffffff, 1))

  // ✅ Identical camera to composite
  const offCamera = this.camera.clone()
  offCamera.aspect = bgWidth / bgHeight
  offCamera.updateProjectionMatrix()
  offCamera.updateMatrixWorld(true)

  offRenderer.render(offScene, offCamera)

  const gl = offRenderer.getContext()
  const pixels = new Uint8Array(bgWidth * bgHeight * 4)
  gl.readPixels(0, 0, bgWidth, bgHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

  offRenderer.dispose()

  // Flip vertically
  const flipped = new Uint8Array(bgWidth * bgHeight * 4)
  for (let y = 0; y < bgHeight; y++) {
    const srcRow = (bgHeight - 1 - y) * bgWidth * 4
    const dstRow = y * bgWidth * 4
    flipped.set(pixels.subarray(srcRow, srcRow + bgWidth * 4), dstRow)
  }

  // Threshold
  for (let i = 0; i < flipped.length; i += 4) {
    const isObject = flipped[i] > 10 || flipped[i + 1] > 10 || flipped[i + 2] > 10
    flipped[i]     = isObject ? 255 : 0
    flipped[i + 1] = isObject ? 255 : 0
    flipped[i + 2] = isObject ? 255 : 0
    flipped[i + 3] = 255
  }

  const maskCanvas = document.createElement('canvas')
  maskCanvas.width  = bgWidth
  maskCanvas.height = bgHeight
  const ctx = maskCanvas.getContext('2d')
  const imageData = ctx.createImageData(bgWidth, bgHeight)
  imageData.data.set(flipped)
  ctx.putImageData(imageData, 0, 0)

  return await new Promise(resolve => maskCanvas.toBlob(resolve, 'image/png'))
},
    

    async switchFurniture() {
      if (!this.chair) { console.warn('No chair loaded'); return }
      
      try {
        if (this.rotationRing) this.rotationRing.visible = false
        this.renderer.render(this.scene, this.camera)

        if (this.chair) this.chair.visible = false
        if (this.rotationRing) this.rotationRing.visible = false

        this.internalLoading     = true
        this.internalLoadingText = 'Rendering Item...'
        this.isDraggingRef       = false
        this.loadingProxy        = true

        await this.$nextTick()

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
        this.loadingProxy    = false
        this.internalLoading = false
        if (this.chair) this.chair.visible = false
        if (this.rotationRing) this.rotationRing.visible = false
        throw error
      }finally{
        this.$emit('unselect-object', true)
      }

    },

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
      this._spinAngleRad  = 0
      this._renderLock    = false
      this.floorNormal3   = markRaw(new THREE.Vector3(0,1,0))
      this.floorCentroid3 = markRaw(new THREE.Vector3())
    },

   animate() {
  this.animationFrameId = requestAnimationFrame(this.animate)
  if (this._isRendering) return              // ← add this guard
  if (this.renderer && this.scene && this.camera) {
    this.renderer.render(this.scene, this.camera)
  }
},
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
    TARGET_DIMS: {
    deep: true,
    handler() {
      if (!this.chair || !this.planeReady) return
      this.rescaleChair()
    }
  },
    // CHAIR_MODEL(newVal, oldVal) {
    //   if (newVal && newVal !== oldVal) {
    //     if (!this.scene) { console.warn('⚠️ CHAIR_MODEL changed but scene not ready'); return }
    //     this.reloadChair()
    //   }
    // },
     CHAIR_MODEL(newVal, oldVal) {
    if (newVal && newVal !== oldVal) {
      if (!this.scene) { console.warn('⚠️ CHAIR_MODEL changed but scene not ready'); return }
      // ✅ Hide immediately before async reload starts
      if (this.chair) this.chair.visible = false
      if (this.rotationRing) this.rotationRing.visible = false
      

      this.reloadChair()
    }
    },
    debugMask()       { this.toggleMaskOverlay() },
    debugPointCloud() { this.togglePointCloud() },
    debugFloorMesh()  { this.toggleFloorMesh() },
    // ✅ FIX 4 OF 4: _renderLock blocks this watcher during renderItem blob creation
    // Without the lock, setting internalLoading/loadingProxy triggers Vue flush
    // which fires this watcher → updateChairRotation → alignChairToFloor → angle drifts
    chairRotation() {
      if (this.isDraggingRef || this.isRotatingRef || this.isTwoFingerRotating || this._renderLock) return
      this.updateChairRotation()
    },
  },
}
</script>

<style scoped>

.control-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  color: #333;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.control-btn:hover {
  background: rgba(255, 255, 255, 1);
  border-color: #1890ff;
  color: #1890ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.editor-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  height: calc(100vh - 16vh);
  min-height: 400px;
  max-height: calc(100vh - 16vh);
  object-position: center center;
  line-height: 0;
  overflow: hidden;
}
@media (min-width: 769px) {
  .room-container { height:calc(100vh - 16vh);max-height:calc(100vh - 16vh);max-width:920px;margin:0 auto; }
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
}
.mask-overlay  { position:absolute;top:0;left:0;pointer-events:none; }
.three-layer   { position:absolute;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center; }
.three-layer canvas {
  display: block;
  max-width: 100%;
  max-height: 100%;
}
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
  position: absolute;        /* ← was relative */
  top: 50%;                  /* ← center vertically */
  left: 50%;                 /* ← center horizontally */
  transform: translate(-50%, -50%); /* ← exact center */
  color: #fff;
  text-align: center;
  z-index: 3;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  background: rgba(0, 0, 0, 0.3);
  padding: 20px 16px;
  border-radius: 10px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 80%;
  max-width: 320px;
  box-sizing: border-box;
  word-break: break-word;
}

.process-text {
  font-size: 14px;
  opacity: 0.9;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: normal;
  word-break: break-word;
  line-height: 1.5;
}

@media (min-width: 768px) {
  .process-text {
    font-size: 18px;
  }
  .loading-text {
    max-width: 420px;
    padding: 20px 30px;
  }
}
.status-badge {
  position:absolute;top:12px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.75);
  color:#facc15;font-size:12px;padding:5px 14px;border-radius:20px;pointer-events:none;
  border:1px solid #444;backdrop-filter:blur(4px);
}
.color-switch{
  width:30px;
  height:30px;
  border-radius:100%;
  cursor:pointer
}

.color-switch:hover{
border:2px solid blue;
width:30px;
height:30px;
}
</style>