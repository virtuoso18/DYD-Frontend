<template>
  <div v-if="!glbUrl || glbUrl === ''" >
    <div style="text-align:center;color:#666;">
      <img :src="this.baseImageUrl" alt="" style="max-width:850px;max-height:540px;margin:auto">
    </div>
  </div>
  <div v-else style="display: flex;justify-content: center;align-items: center;">
    <div class="main-canvas" ref="canvasContainer">
      <!-- Loading Overlay -->
      <div v-if="isLoading" class="scanning-loading-overlay">
        <div class="loading-screen" >
          <div class="wave-overlay"></div>
          <div class="loading-text">
            <div class="process-text">{{ loadingText }}</div>
          </div>
        </div>
      </div>

      <!-- 3D Viewer Container -->
      <div id="viewer" ref="viewer"></div>
    </div>
  </div>
  
  <div class="action-buttons" style="display:flex;justify-content: space-between;padding-left:10px;padding-right:10px;background: white;">
    <div style="padding-top:5px;"></div>
    <div>
      <div style="padding-top:5px;display:flex;gap:10px;">
        <a-button @click="reset_entire_room" :disabled="isLoading">Reset</a-button>
      </div>
    </div>
    <div style="padding-top:10px;">
      <a-button type="primary" @click="$emit('Apply-Changes', 'item-replacement-3d-renderer')" :disabled="isLoading">
        Apply Changes
      </a-button>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

export default {
  name: 'ItemReplacementRenderer',

  props: {
    glbUrl: { type: String, required: true },
    product_id: { type: String, required: true },
    baseImageUrl: { type: String, required: true },
    modelDimensions: { 
      type: Object, 
      default: () => ({ width: 0.9, height: 0.8, depth: 1.2 }) 
    }
  },

  emits: ['rendered-comfyui-workflow', 'Apply-Changes'],

  data() {
    return {
      isLoading: false,
      loadingText: 'Initializing...',
      modelLoaded: false,
      viewerInitialized: false,
      showGrid: false,
      floorShadow_area_opacity:0,
      showRotationRing: true,
      isDragging: false,
      isRotating: false,
      isOnValidFloor: true,
      modelPosition: { x: 0, y: 0 },
      modelRotation: { y: 0 },
      
      // Floor data from JSON
      floorData:{
  "floor_plane": {
    "equation": [
      -0.0027889964792225043,
      0.9993083797076013,
      0.03708077324986048,
      1.2519466635349292
    ],
    "normal": [
      -0.0027889964792225043,
      0.9993083797076013,
      0.03708077324986048
    ],
    "center": [
      1.0360246896743774,
      -1.1511072516441345,
      -2.711461067199707
    ],
    "height": -1.1685267984867096,
    "image_position": {
      "y_normalized": 0.9052376087853088,
      "y_pixel": 614.6563363652247
    }
  },
  "floor_mesh": {
    "vertices": [
      [
        -1.243166446685791,
        -1.1115527865412407,
        -3.900399684906006
      ],
      [
        7.598013401031494,
        -0.860837903554806,
        -9.992059707641602
      ],
      [
        7.350536346435547,
        -0.9002761947346882,
        -8.947831153869629
      ],
      [
        7.091396808624268,
        -0.9175170599897552,
        -8.502689361572266
      ],
      [
        6.592052936553955,
        -0.9438553097227717,
        -7.8304443359375
      ],
      [
        2.4236505031585693,
        -1.1396169722873388,
        -2.8682875633239746
      ],
      [
        2.0216026306152344,
        -1.158394541334771,
        -2.3924810886383057
      ],
      [
        1.9148337841033936,
        -1.1633811597743613,
        -2.266124725341797
      ],
      [
        1.8532164096832275,
        -1.1662589780760908,
        -2.1932034492492676
      ],
      [
        1.460288643836975,
        -1.1678100829324956,
        -2.180955648422241
      ],
      [
        0.06335186958312988,
        -1.1715063175684852,
        -2.186413288116455
      ],
      [
        -1.774940848350525,
        -1.1763513872667244,
        -2.1941065788269043
      ],
      [
        -1.8527677059173584,
        -1.176470732315746,
        -2.196743965148926
      ],
      [
        -1.8905893564224243,
        -1.175066483971377,
        -2.2374324798583984
      ],
      [
        -2.243551254272461,
        -1.1605516479746087,
        -2.6551477909088135
      ],
      [
        -2.306842088699341,
        -1.157760819872636,
        -2.735119581222534
      ],
      [
        -2.309152364730835,
        -1.1567134911792052,
        -2.7635183334350586
      ],
      [
        -2.1211955547332764,
        -1.1451639556489885,
        -3.060635566711426
      ],
      [
        -1.9270164966583252,
        -1.1375730384131113,
        -3.2506020069122314
      ],
      [
        -1.3555147647857666,
        -1.1154347692713682,
        -3.804232358932495
      ],
      [
        -1.28656005859375,
        -1.1129657051588724,
        -3.865586042404175
      ]
    ],
    "faces": [
      [
        10,
        0,
        9
      ],
      [
        10,
        20,
        0
      ],
      [
        4,
        0,
        1
      ],
      [
        0,
        5,
        9
      ],
      [
        4,
        5,
        0
      ],
      [
        5,
        6,
        9
      ],
      [
        19,
        11,
        18
      ],
      [
        10,
        19,
        20
      ],
      [
        11,
        19,
        10
      ],
      [
        3,
        4,
        1
      ],
      [
        2,
        3,
        1
      ],
      [
        7,
        8,
        9
      ],
      [
        6,
        7,
        9
      ],
      [
        14,
        15,
        16
      ],
      [
        17,
        14,
        16
      ],
      [
        11,
        13,
        18
      ],
      [
        13,
        17,
        18
      ],
      [
        13,
        14,
        17
      ],
      [
        13,
        11,
        12
      ]
    ]
  },
  "grid_lines": [
    {
      "start": [
        -2.309152364730835,
        -0.8881934414592357,
        -10.0
      ],
      "end": [
        7.598013401031494,
        -0.8605432675981202,
        -10.0
      ]
    },
    {
      "start": [
        -2.309152364730835,
        -0.9067466598665057,
        -9.5
      ],
      "end": [
        7.598013401031494,
        -0.8790964860053903,
        -9.5
      ]
    },
    {
      "start": [
        -2.309152364730835,
        -0.9252998782737757,
        -9.0
      ],
      "end": [
        7.598013401031494,
        -0.8976497044126601,
        -9.0
      ]
    },
    {
      "start": [
        -2.309152364730835,
        -0.9438530966810458,
        -8.5
      ],
      "end": [
        7.598013401031494,
        -0.9162029228199301,
        -8.5
      ]
    },
    {
      "start": [
        -2.309152364730835,
        -0.9624063150883158,
        -8.0
      ],
      "end": [
        7.598013401031494,
        -0.9347561412272002,
        -8.0
      ]
    },
    {
      "start": [
        -2.309152364730835,
        -0.9809595334955857,
        -7.5
      ],
      "end": [
        7.598013401031494,
        -0.9533093596344703,
        -7.5
      ]
    },
    {
      "start": [
        -2.309152364730835,
        -0.9995127519028558,
        -7.0
      ],
      "end": [
        7.598013401031494,
        -0.9718625780417403,
        -7.0
      ]
    },
    {
      "start": [
        -2.309152364730835,
        -1.0180659703101258,
        -6.5
      ],
      "end": [
        7.598013401031494,
        -0.9904157964490101,
        -6.5
      ]
    },
    {
      "start": [
        -2.309152364730835,
        -1.0366191887173957,
        -6.0
      ],
      "end": [
        7.598013401031494,
        -1.0089690148562802,
        -6.0
      ]
    },
    {
      "start": [
        -2.309152364730835,
        -1.0551724071246658,
        -5.5
      ],
      "end": [
        7.598013401031494,
        -1.0275222332635503,
        -5.5
      ]
    },
    {
      "start": [
        -2.309152364730835,
        -1.0737256255319358,
        -5.0
      ],
      "end": [
        7.598013401031494,
        -1.0460754516708202,
        -5.0
      ]
    },
    {
      "start": [
        -2.309152364730835,
        -1.092278843939206,
        -4.5
      ],
      "end": [
        7.598013401031494,
        -1.0646286700780903,
        -4.5
      ]
    },
    {
      "start": [
        -2.309152364730835,
        -1.1108320623464758,
        -4.0
      ],
      "end": [
        7.598013401031494,
        -1.0831818884853603,
        -4.0
      ]
    },
    {
      "start": [
        -2.309152364730835,
        -1.129385280753746,
        -3.5
      ],
      "end": [
        7.598013401031494,
        -1.1017351068926304,
        -3.5
      ]
    },
    {
      "start": [
        -2.309152364730835,
        -1.1479384991610158,
        -3.0
      ],
      "end": [
        7.598013401031494,
        -1.1202883252999003,
        -3.0
      ]
    },
    {
      "start": [
        -2.309152364730835,
        -1.1664917175682858,
        -2.5
      ],
      "end": [
        7.598013401031494,
        -1.1388415437071702,
        -2.5
      ]
    },
    {
      "start": [
        -2.309152364730835,
        -1.1850449359755557,
        -2.0
      ],
      "end": [
        7.598013401031494,
        -1.1573947621144403,
        -2.0
      ]
    },
    {
      "start": [
        -2.5,
        -0.889020719184611,
        -9.992059707641602
      ],
      "end": [
        -2.5,
        -1.1788629584098314,
        -2.180955648422241
      ]
    },
    {
      "start": [
        -2.0,
        -0.8876252558142155,
        -9.992059707641602
      ],
      "end": [
        -2.0,
        -1.177467495039436,
        -2.180955648422241
      ]
    },
    {
      "start": [
        -1.5,
        -0.88622979244382,
        -9.992059707641602
      ],
      "end": [
        -1.5,
        -1.17607203166904,
        -2.180955648422241
      ]
    },
    {
      "start": [
        -1.0,
        -0.8848343290734245,
        -9.992059707641602
      ],
      "end": [
        -1.0,
        -1.1746765682986446,
        -2.180955648422241
      ]
    },
    {
      "start": [
        -0.5,
        -0.883438865703029,
        -9.992059707641602
      ],
      "end": [
        -0.5,
        -1.1732811049282492,
        -2.180955648422241
      ]
    },
    {
      "start": [
        0.0,
        -0.8820434023326335,
        -9.992059707641602
      ],
      "end": [
        0.0,
        -1.1718856415578536,
        -2.180955648422241
      ]
    },
    {
      "start": [
        0.5,
        -0.880647938962238,
        -9.992059707641602
      ],
      "end": [
        0.5,
        -1.1704901781874582,
        -2.180955648422241
      ]
    },
    {
      "start": [
        1.0,
        -0.8792524755918425,
        -9.992059707641602
      ],
      "end": [
        1.0,
        -1.1690947148170627,
        -2.180955648422241
      ]
    },
    {
      "start": [
        1.5,
        -0.8778570122214469,
        -9.992059707641602
      ],
      "end": [
        1.5,
        -1.167699251446667,
        -2.180955648422241
      ]
    },
    {
      "start": [
        2.0,
        -0.8764615488510513,
        -9.992059707641602
      ],
      "end": [
        2.0,
        -1.1663037880762717,
        -2.180955648422241
      ]
    },
    {
      "start": [
        2.5,
        -0.8750660854806559,
        -9.992059707641602
      ],
      "end": [
        2.5,
        -1.164908324705876,
        -2.180955648422241
      ]
    },
    {
      "start": [
        3.0,
        -0.8736706221102604,
        -9.992059707641602
      ],
      "end": [
        3.0,
        -1.1635128613354806,
        -2.180955648422241
      ]
    },
    {
      "start": [
        3.5,
        -0.8722751587398648,
        -9.992059707641602
      ],
      "end": [
        3.5,
        -1.1621173979650852,
        -2.180955648422241
      ]
    },
    {
      "start": [
        4.0,
        -0.8708796953694692,
        -9.992059707641602
      ],
      "end": [
        4.0,
        -1.1607219345946895,
        -2.180955648422241
      ]
    },
    {
      "start": [
        4.5,
        -0.8694842319990738,
        -9.992059707641602
      ],
      "end": [
        4.5,
        -1.159326471224294,
        -2.180955648422241
      ]
    },
    {
      "start": [
        5.0,
        -0.8680887686286782,
        -9.992059707641602
      ],
      "end": [
        5.0,
        -1.1579310078538985,
        -2.180955648422241
      ]
    },
    {
      "start": [
        5.5,
        -0.8666933052582827,
        -9.992059707641602
      ],
      "end": [
        5.5,
        -1.156535544483503,
        -2.180955648422241
      ]
    },
    {
      "start": [
        6.0,
        -0.8652978418878872,
        -9.992059707641602
      ],
      "end": [
        6.0,
        -1.1551400811131076,
        -2.180955648422241
      ]
    },
    {
      "start": [
        6.5,
        -0.8639023785174916,
        -9.992059707641602
      ],
      "end": [
        6.5,
        -1.153744617742712,
        -2.180955648422241
      ]
    },
    {
      "start": [
        7.0,
        -0.8625069151470962,
        -9.992059707641602
      ],
      "end": [
        7.0,
        -1.1523491543723166,
        -2.180955648422241
      ]
    },
    {
      "start": [
        7.5,
        -0.8611114517767007,
        -9.992059707641602
      ],
      "end": [
        7.5,
        -1.1509536910019211,
        -2.180955648422241
      ]
    },
    {
      "start": [
        8.0,
        -0.8597159884063051,
        -9.992059707641602
      ],
      "end": [
        8.0,
        -1.1495582276315255,
        -2.180955648422241
      ]
    }
  ],
  "floor_bounds": {
    "min": [
      -2.309152364730835,
      -1.181203842163086,
      -9.992059707641602
    ],
    "max": [
      7.598013401031494,
      -0.8244654536247253,
      -2.180955648422241
    ]
  },
  "camera": {
    "position": [
      0.0,
      0.3314732015132904,
      0.0
    ],
    "fov": 56.0,
    "fov_horizontal": 80.4,
    "fov_vertical": 56.0,
    "intrinsics": {
      "fx": 638.47548,
      "fy": 638.4754670699999,
      "cx": 540.0,
      "cy": 339.5
    }
  },
  "image_dimensions": {
    "width": 1080,
    "height": 679
  }
},
    };
  },

  created() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.animationId = null;
    this.backgroundScene = null;
    this.backgroundCamera = null;
    this.bgMesh = null;
    this.gridGroup = null;
    this.gridHelper = null;
    this.floorPlane = null;
    this.floorMeshPlane = null;
    this.model = null;
    this.modelBoundingBox = null;
    this.modelSize = null;
    this.currentBackgroundTexture = null;
    
    // Rotation ring controls
    this.rotationRing = null;
    this.rotationArrows = [];
    
    this.isDraggingModel = false;
    this.isRotatingModel = false;
    this.dragStartMouse = new THREE.Vector2();
    this.dragStartPosition = new THREE.Vector2();
    this.rotationStartMouse = new THREE.Vector2();
    this.rotationStartAngle = 0;
    this.dragPlane = new THREE.Plane();
    this.raycaster = new THREE.Raycaster();
    this.floorNormal = new THREE.Vector3();
    this.floorPoint = new THREE.Vector3();
    
    // Parsed floor data
    this.planeEquation = null;
    this.floorBoundary = null;
    this.floorBounds = null;
    this.baseModelScale = 1.0;
  },

  watch: {
    glbUrl: {
      handler(newUrl, oldUrl) {
        if (newUrl && newUrl !== '' && newUrl !== oldUrl) {
          this.$nextTick(() => {
            this.handleGlbUrlChange();
          });
        }
      },
      immediate: false
    },
    baseImageUrl: {
      handler(newUrl, oldUrl) {
        if (newUrl && newUrl !== oldUrl && this.viewerInitialized) {
          this.initializeBackground();
        }
      }
    }
  },

  mounted() {
    if (this.glbUrl && this.glbUrl !== '') {
      this.$nextTick(() => {
        this.handleGlbUrlChange();
      });
    }
  },

  beforeUnmount() {
    this.cleanup();
  },

  methods: {
    async handleGlbUrlChange() {
      try {
        this.resetComponentState();
        this.isLoading = true;
        this.loadingText = 'Initializing 3D Viewer...';
        await this.$nextTick();
        
        if (!this.viewerInitialized) {
          await this.initializeViewer();
        } else {
          await this.reinitializeWithNewModel();
        }
      } catch (error) {
        console.error('Error handling glbUrl change:', error);
        this.showErrorState();
      }
    },

    resetComponentState() {
      this.modelLoaded = false;
      this.modelPosition = { x: 0, y: 0 };
      this.modelRotation = { y: 0 };
      
      if (this.model && this.scene) {
        this.scene.remove(this.model);
        this.model = null;
        this.modelBoundingBox = null;
        this.modelSize = null;
      }
      
      if (this.rotationRing && this.scene) {
        this.scene.remove(this.rotationRing);
        this.rotationRing = null;
        this.rotationArrows = [];
      }
    },

    async reinitializeWithNewModel() {
      this.loadingText = 'Loading new model...';
      await this.loadModel();
      this.fitCameraToModel();
      this.isLoading = false;
    },

    async initializeViewer() {
      await this.$nextTick();
      const container = this.$refs.viewer;
      
      if (!container) {
        await new Promise(resolve => setTimeout(resolve, 100));
        return this.initializeViewer();
      }
      
      try {
        this.isLoading = true;
        this.loadingText = 'Setting up 3D environment...';

        this.parseFloorData();
        this.initializeScene(container);
        this.initializeBackground();
        this.initializeLighting();
        
        this.loadingText = 'Creating floor...';
        this.createFloorFromJSON();
        this.createVisualGrid();
        
        this.initializeControls();
        this.initializeDragControls();
        this.createRotationRing();
        
        this.loadingText = 'Loading 3D model...';
        await this.loadModel();

        window.addEventListener("resize", this.onWindowResize);
        this.animate();
        this.viewerInitialized = true;
      } catch (error) {
        console.error('Error initializing viewer:', error);
        this.showErrorState();
      }
    },

    parseFloorData() {
  const fd = this.floorData;
  
  this.planeEquation = {
    a: fd.floor_plane.equation[0],
    b: fd.floor_plane.equation[1],
    c: fd.floor_plane.equation[2],
    d: fd.floor_plane.equation[3]
  };
  
  this.floorNormal.set(
    fd.floor_plane.normal[0],
    fd.floor_plane.normal[1],
    fd.floor_plane.normal[2]
  );
  
  this.floorPoint.set(
    fd.floor_plane.center[0],
    fd.floor_plane.center[1],
    fd.floor_plane.center[2]
  );
  
  this.floorBounds = {
    min: new THREE.Vector3(...fd.floor_bounds.min),
    max: new THREE.Vector3(...fd.floor_bounds.max)
  };
  
  // FIX: Handle missing floor_boundary
  if (fd.floor_boundary) {
    this.floorBoundary = fd.floor_boundary.map(p => new THREE.Vector3(p[0], p[1], p[2]));
  } else if (fd.floor_mesh && fd.floor_mesh.vertices) {
    // Use floor mesh vertices as boundary if no explicit boundary provided
    this.floorBoundary = fd.floor_mesh.vertices.map(v => new THREE.Vector3(v[0], v[1], v[2]));
  } else {
    this.floorBoundary = [];
  }
  
  console.log('Floor data parsed:');
  console.log('  Normal:', this.floorNormal);
  console.log('  Center:', this.floorPoint);
  console.log('  Height:', fd.floor_plane.height);
},

    initializeScene(container) {
      this.scene = new THREE.Scene();
      this.backgroundScene = new THREE.Scene();
      this.backgroundCamera = new THREE.Camera();

      const fov = this.floorData.camera.fov;
      
      this.camera = new THREE.PerspectiveCamera(
        fov,
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
      );

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      
      container.appendChild(this.renderer.domElement);
    },

    initializeBackground() {
      if (!this.baseImageUrl) return;
      
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
        this.baseImageUrl,
        (texture) => {
          this.currentBackgroundTexture = texture;
          this.adjustCanvasToImageAspectRatio(texture);
          this.updateBackground(texture);
        },
        undefined,
        (error) => {
          console.warn("Background image failed to load, using fallback");
          this.currentBackgroundTexture = fallbackTexture;
          this.updateBackground(fallbackTexture);
        }
      );
    },

    initializeLighting() {
  // Ambient light for overall brightness
  this.scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.9));

  // Main directional light
  const dirLight = new THREE.DirectionalLight(0xffffff, 8);
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
  this.scene.add(dirLight);

  // Fill light
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
  fillLight.position.set(-10, 5, -5);
  this.scene.add(fillLight);

  // Key light from different angle
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
  keyLight.position.set(5, 10, 10);
  this.scene.add(keyLight);

  // Rim light for edge definition
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
  rimLight.position.set(-5, 5, -10);
  this.scene.add(rimLight);
},

   initializeControls() {
  this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  this.controls.enableRotate = false;
  this.controls.enableZoom = false;
  this.controls.enablePan = false;
  
  // FIX: Calculate proper camera height
  const floorHeight = this.floorData.floor_plane.height;
  const cameraHeight = 1.5; // Typical eye height in meters
  const cameraY = floorHeight + cameraHeight;
  
  this.camera.position.set(0, cameraY, 0);
  
  // Point camera at a spot on the floor ahead
  const lookAtPoint = new THREE.Vector3(
    this.floorPoint.x,
    floorHeight,
    this.floorPoint.z - 10  // Look 3 meters ahead
  );
  
  this.controls.target.copy(lookAtPoint);
  this.controls.update();
},

    initializeDragControls() {
      const canvas = this.renderer.domElement;
      canvas.addEventListener('mousedown', this.onMouseDown);
      canvas.addEventListener('mousemove', this.onMouseMove);
      canvas.addEventListener('mouseup', this.onMouseUp);
      canvas.addEventListener('mouseleave', this.onMouseUp);
    },

    createFloorFromJSON() {
  this.gridGroup = new THREE.Group();
  this.scene.add(this.gridGroup);
  
  // Create floor mesh from backend data
  if (this.floorData.floor_mesh) {
    const vertices = this.floorData.floor_mesh.vertices;
    const faces = this.floorData.floor_mesh.faces;
    
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    
    faces.forEach(face => {
      const v1 = vertices[face[0]];
      const v2 = vertices[face[1]];
      const v3 = vertices[face[2]];
      
      positions.push(v1[0], v1[1], v1[2]);
      positions.push(v2[0], v2[1], v2[2]);
      positions.push(v3[0], v3[1], v3[2]);
    });
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    
    const floorMaterial = new THREE.MeshLambertMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: this.floorShadow_area_opacity,
      side: THREE.DoubleSide
    });
    
    this.floorPlane = new THREE.Mesh(geometry, floorMaterial);
    this.floorPlane.name = 'dragFloor';
    this.gridGroup.add(this.floorPlane);
  } else {
    // Fallback to plane
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshLambertMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide
    });
    
    this.floorPlane = new THREE.Mesh(floorGeometry, floorMaterial);
    
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, this.floorNormal);
    this.floorPlane.quaternion.copy(quaternion);
    this.floorPlane.position.copy(this.floorPoint);
    this.floorPlane.name = 'dragFloor';
    this.gridGroup.add(this.floorPlane);
  }
  
  this.dragPlane.setFromNormalAndCoplanarPoint(this.floorNormal, this.floorPoint);
}
,

    // Replace your createVisualGrid method with this:
createVisualGrid() {
  if (this.gridHelper) this.gridGroup.remove(this.gridHelper);
  
  // Create grid lines from backend data
  if (this.floorData.grid_lines && this.floorData.grid_lines.length > 0) {
    const gridGeometry = new THREE.BufferGeometry();
    const gridVertices = [];
    
    this.floorData.grid_lines.forEach(line => {
      gridVertices.push(
        line.start[0], line.start[1], line.start[2],
        line.end[0], line.end[1], line.end[2]
      );
    });
    
    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridVertices, 3));
    const gridMaterial = new THREE.LineBasicMaterial({ 
      color: 0x888888, 
      transparent: true, 
      opacity: 0.4 
    });
    
    this.gridHelper = new THREE.LineSegments(gridGeometry, gridMaterial);
    this.gridHelper.visible = this.showGrid;
    this.gridGroup.add(this.gridHelper);
  }
},

    createRotationRing() {
    this.rotationRing = new THREE.Group();
  this.rotationRing.name = 'rotationRing';
  
  const ringGeometry = new THREE.RingGeometry(0.8, 0.85, 64);
  const ringMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x00ffff, 
    transparent: true, 
    opacity: 0.8,
    side: THREE.DoubleSide,
    depthTest: true,  // ← Change from false to true
    depthWrite: true  // ← Add this
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = -Math.PI / 2;
  ring.name = 'rotationRingMesh';
  this.rotationRing.add(ring);
  
  // Create 4 rotation arrows
  const arrowPositions = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
  
  arrowPositions.forEach((angle, index) => {
    const arrowGroup = this.createRotationArrow(angle, index);
    this.rotationRing.add(arrowGroup);
    this.rotationArrows.push(arrowGroup);
  });
  
  this.rotationRing.visible = this.showRotationRing;
  this.rotationRing.renderOrder = 999;  // Render on top
  this.scene.add(this.rotationRing);
},

    createRotationArrow(angle, index) {
      const arrowGroup = new THREE.Group();
      
      const arrowGeometry = new THREE.ConeGeometry(0.06, 0.15, 8);
      const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      
      const radius = 0.825;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      arrow.position.set(x, 0, z);
      arrow.rotation.x = -Math.PI / 2;
      arrow.rotation.z = angle + Math.PI / 2;
      
      arrow.userData = {
        isRotationArrow: true,
        index: index,
        originalColor: 0x00ff88
      };
      
      arrowGroup.add(arrow);
      return arrowGroup;
    },

    // FIXED: Update rotation ring to maintain circular shape
updateRotationRingPosition() {
  if (!this.rotationRing || !this.model || !this.modelSize) return;
  
  // Position at model center
  this.rotationRing.position.copy(this.model.position);
  
  // Calculate scale based on model size (larger models = larger ring)
  const avgSize = (this.modelSize.x + this.modelSize.z) / 2;
  const baseScale = Math.max(0.8, avgSize * 1.2);
  this.rotationRing.scale.setScalar(baseScale);
  
  // Keep ring horizontal (don't tilt with floor)
  // This ensures it stays circular in screen space
  this.rotationRing.rotation.set(0, 0, 0);
  
  // Offset ring slightly above model
  const offset = this.modelSize.y * 0.05;
  this.rotationRing.position.y += offset;
}
,

    async loadModel() {
      if (!this.glbUrl || this.glbUrl === '') {
        console.warn('No glbUrl provided');
        return Promise.resolve();
      }
      
      return new Promise((resolve, reject) => {
        this.loadingText = 'Loading 3D Model...';
        
        const loader = new GLTFLoader();
        loader.setMeshoptDecoder(MeshoptDecoder)
        loader.load(
          this.glbUrl,
          (gltf) => {
            if (this.model) this.scene.remove(this.model);

            this.model = gltf.scene;

            this.model.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.userData.draggable = true;
              }
            });

            this.setupModelBounds();
            this.positionModelOnFloor();
            
            this.scene.add(this.model);
            this.updateRotationRingPosition();
            this.fitCameraToModel();

            this.isLoading = false;
            this.modelLoaded = true;
            console.log('Model loaded successfully');
            resolve();
          },
          (progress) => {
            if (progress.total > 0) {
              const percentage = Math.round((progress.loaded / progress.total) * 100);
              this.loadingText = `Loading Model... ${percentage}%`;
            }
          },
          (error) => {
            console.error("Failed to load model", error);
            this.isLoading = false;
            this.modelLoaded = false;
            reject(error);
          }
        );
      });
    },

   setupModelBounds() {
  const bbox = new THREE.Box3().setFromObject(this.model);
  const size = bbox.getSize(new THREE.Vector3());
  const center = bbox.getCenter(new THREE.Vector3());

  const dims = this.modelDimensions;
  const targetSize = Math.max(dims.width, dims.height, dims.depth);
  const currentMaxDim = Math.max(size.x, size.y, size.z);
  this.baseModelScale = targetSize / currentMaxDim;
  
  this.model.scale.setScalar(this.baseModelScale);

  // BEFORE centering - get the bounding box
  const scaledBox = new THREE.Box3().setFromObject(this.model);
  this.modelSize = scaledBox.getSize(new THREE.Vector3());
  
  // Center the model at origin first
  const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
  this.model.position.sub(scaledCenter);
  
  // NOW get bounding box in LOCAL space (centered at origin)
  this.modelBoundingBox = new THREE.Box3().setFromObject(this.model);
  
  console.log('=== MODEL SETUP DEBUG ===');
  console.log('Model size:', this.modelSize);
  console.log('Model bounds:', this.modelBoundingBox);
  console.log('Model bounds min.y:', this.modelBoundingBox.min.y);
  console.log('Model bounds max.y:', this.modelBoundingBox.max.y);
  console.log('Model position after centering:', this.model.position);
},
positionModelOnFloor() {
  if (!this.model) return;
  
  const floorY = this.floorData.floor_plane.height;
  
  // Place model 3-4 meters in front of camera
  this.model.position.x = 0;
  this.model.position.z = -3.5;  // Negative Z = in front of camera
  
  const modelBottom = this.modelBoundingBox.min.y * this.baseModelScale;
  this.model.position.y = floorY - modelBottom;
  
  console.log('Model positioned at:', this.model.position);
  console.log('Floor height:', floorY);
  console.log('Camera height:', this.camera.position.y);
},
screenToWorld(screenX, screenY) {
  // screenX, screenY are normalized (0 to 1)
  // Convert to Three.js NDC space (-1 to 1)
  const mouse = new THREE.Vector2(
    screenX * 2 - 1,
    -(screenY * 2 - 1)  // Flip Y axis
  );
  
  this.raycaster.setFromCamera(mouse, this.camera);
  
  const intersection = new THREE.Vector3();
  if (this.raycaster.ray.intersectPlane(this.dragPlane, intersection)) {
    return intersection;
  }
  
  return null;
},
    applyPerspectiveScaling() {
  if (!this.model) return;
  
  const cameraPos = new THREE.Vector3(...this.floorData.camera.position);
  const modelPos = this.model.position.clone();
  const distance = cameraPos.distanceTo(modelPos);
  const refDistance = cameraPos.distanceTo(this.floorPoint);
  
  // OPTION 1: Disable perspective scaling entirely (recommended)
  // Just keep the base scale constant
  this.model.scale.setScalar(this.baseModelScale);
  
  /* OPTION 2: If you really want perspective scaling, use smoother approach
  const scaleFactor = Math.pow(refDistance / distance, 0.05);  // Very subtle
  const clampedScale = Math.max(0.95, Math.min(1.05, scaleFactor));
  const finalScale = this.baseModelScale * clampedScale;
  this.model.scale.setScalar(finalScale);
  */
  
  // IMPORTANT: Only update bounding box when scale actually changes
  const currentScale = this.model.scale.x;
  if (Math.abs(currentScale - this.lastAppliedScale) > 0.001) {
    this.modelBoundingBox.setFromObject(this.model);
    this.modelSize = this.modelBoundingBox.getSize(new THREE.Vector3());
    this.lastAppliedScale = currentScale;
  }
},

    getFloorHeightAtPosition(worldPos) {
      const { a, b, c, d } = this.planeEquation;
      
      if (Math.abs(b) < 0.001) return this.floorPoint.y;
      
      return -(a * worldPos.x + c * worldPos.z + d) / b;
    },

    isPositionOnFloor(worldPos) {
      if (worldPos.x < this.floorBounds.min.x || worldPos.x > this.floorBounds.max.x) {
        return false;
      }
      if (worldPos.z < this.floorBounds.min.z || worldPos.z > this.floorBounds.max.z) {
        return false;
      }
      
      return true;
    },

    onMouseDown(event) {
      event.preventDefault();
      
      const mouse = new THREE.Vector2();
      const rect = this.renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      this.raycaster.setFromCamera(mouse, this.camera);
      
      // Check rotation arrows first
      if (this.rotationRing && this.showRotationRing) {
        const arrowIntersects = this.raycaster.intersectObject(this.rotationRing, true);
        
        if (arrowIntersects.length > 0) {
          const intersected = arrowIntersects[0].object;
          if (intersected.userData.isRotationArrow) {
            this.controls.enabled = false;
            this.isRotatingModel = true;
            this.isRotating = true;
            
            this.rotationStartMouse.copy(mouse);
            this.rotationStartAngle = this.modelRotation.y;
            
            intersected.material.color.setHex(0xff6600);
            return;
          }
        }
      }
      
      // Check model for dragging
      if (this.model) {
        const intersects = this.raycaster.intersectObject(this.model, true);
        
        if (intersects.length > 0) {
          this.controls.enabled = false;
          this.isDraggingModel = true;
          this.isDragging = true;
          
          this.dragStartMouse.copy(mouse);
          this.dragStartPosition.set(this.model.position.x, this.model.position.z);
        }
      }
    },

   onMouseMove(event) {
  if (!this.isDraggingModel && !this.isRotatingModel) return;
  
  event.preventDefault();
  
  const mouse = new THREE.Vector2();
  const rect = this.renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
  if (this.isDraggingModel) {
    this.raycaster.setFromCamera(mouse, this.camera);
    
    const intersection = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(this.dragPlane, intersection)) {
      if (this.isPositionOnFloor(intersection)) {
        // Update X and Z position
        this.model.position.x = intersection.x;
        this.model.position.z = intersection.z;
        
        // Calculate floor Y at this NEW position using plane equation
        const { a, b, c, d } = this.planeEquation;
        let floorY;
        
        if (Math.abs(b) > 0.001) {
          floorY = -(a * intersection.x + c * intersection.z + d) / b;
        } else {
          floorY = this.floorData.floor_plane.height;
        }
        
        // Account for current scale when calculating model bottom
        const currentScale = this.model.scale.x / this.baseModelScale;
        // const modelBottom = this.modelBoundingBox.min.y * currentScale;
        const modelBottom = this.modelBoundingBox.min.y * this.baseModelScale;
        
        // Position model bottom on floor at this position
        this.model.position.y = floorY - modelBottom;
        
        this.updateRotationRingPosition();
        this.isOnValidFloor = true;
      } else {
        this.isOnValidFloor = false;
      }
    }
  } else if (this.isRotatingModel) {
    const deltaX = mouse.x - this.rotationStartMouse.x;
    this.modelRotation.y = this.rotationStartAngle + (deltaX * 180);
    this.model.rotation.y = THREE.MathUtils.degToRad(this.modelRotation.y);
  }
},

    onMouseUp(event) {
      if (this.isDraggingModel) {
        this.controls.enabled = true;
        this.isDraggingModel = false;
        this.isDragging = false;
      }
      
      if (this.isRotatingModel) {
        this.controls.enabled = true;
        this.isRotatingModel = false;
        this.isRotating = false;
        
        this.rotationArrows.forEach(group => {
          group.children.forEach(arrow => {
            if (arrow.userData.isRotationArrow) {
              arrow.material.color.setHex(arrow.userData.originalColor);
            }
          });
        });
      }
    },

    fitCameraToModel() {
      // Keep camera position fixed to match background image
      // Don't move camera to fit model
      return;
    },

    adjustCanvasToImageAspectRatio(texture) {
      if (!texture.image || !this.$refs.canvasContainer) return;
      
      const containerRect = this.$refs.canvasContainer.getBoundingClientRect();
      const availableWidth = Math.floor(containerRect.width);
      const availableHeight = Math.floor(containerRect.height);
      
      const maxWidth = Math.min(availableWidth, 900);
      const maxHeight = Math.min(availableHeight, 600);
      
      const imgAspect = texture.image.width / texture.image.height;
      const maxAspect = maxWidth / maxHeight;
      
      let canvasWidth, canvasHeight;
      
      if (imgAspect > maxAspect) {
        canvasWidth = maxWidth;
        canvasHeight = Math.round(maxWidth / imgAspect);
      } else {
        canvasHeight = maxHeight;
        canvasWidth = Math.round(maxHeight * imgAspect);
      }
      
      this.renderer.setSize(canvasWidth, canvasHeight);
      this.camera.aspect = canvasWidth / canvasHeight;
      this.camera.updateProjectionMatrix();
    },

    updateBackground(texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
      
      const bgGeo = new THREE.PlaneGeometry(2, 2);
      const bgMat = new THREE.MeshBasicMaterial({ map: texture, depthTest: false });

      if (this.bgMesh) this.backgroundScene.remove(this.bgMesh);
      
      this.bgMesh = new THREE.Mesh(bgGeo, bgMat);
      this.bgMesh.position.z = -1;
      this.backgroundScene.add(this.bgMesh);
    },

    reset_entire_room() {
      if (!this.model) return;
      
      const initialPos = this.floorPoint.clone();
      this.model.position.x = initialPos.x;
      this.model.position.z = initialPos.z;
      
      const floorY = this.getFloorHeightAtPosition(initialPos);
      // const modelBottom = this.modelBoundingBox.min.y;
      const modelBottom = this.modelBoundingBox.min.y * this.baseModelScale;

      this.model.position.y = floorY - modelBottom;
      
      this.modelRotation.y = 0;
      this.model.rotation.y = 0;
      
      this.applyPerspectiveScaling();
      this.updateRotationRingPosition();
    },

    animate() {
      this.animationId = requestAnimationFrame(this.animate);
      
      if (this.controls) {
        this.controls.update();
      }
      
      if (this.renderer && this.backgroundScene && this.backgroundCamera && this.scene && this.camera) {
        this.renderer.autoClear = false;
        this.renderer.clear();
        this.renderer.render(this.backgroundScene, this.backgroundCamera);
        this.renderer.render(this.scene, this.camera);
      }
    },

    onWindowResize() {
      if (!this.currentBackgroundTexture) return;
      
      this.adjustCanvasToImageAspectRatio(this.currentBackgroundTexture);
      this.updateBackground(this.currentBackgroundTexture);
    },

    showErrorState() {
      this.isLoading = false;
      this.loadingText = 'Error loading model';
      this.modelLoaded = false;
      console.error('An error occurred in the 3D viewer');
    },

    cleanup() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      
      window.removeEventListener("resize", this.onWindowResize);
      
      if (this.renderer) {
        const canvas = this.renderer.domElement;
        canvas.removeEventListener('mousedown', this.onMouseDown);
        canvas.removeEventListener('mousemove', this.onMouseMove);
        canvas.removeEventListener('mouseup', this.onMouseUp);
        canvas.removeEventListener('mouseleave', this.onMouseUp);
        
        this.renderer.dispose();
        
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
      
      if (this.scene) {
        this.scene.clear();
      }
      
      this.viewerInitialized = false;
      this.modelLoaded = false;
      this.isLoading = false;
    }
  }
};
</script>

<style scoped>
.main-canvas {
  display: block;
  margin: 0 auto;
  width: 100%;
  height: 76vh;
  position: relative;
  text-align: center;
}

#viewer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.action-buttons {
  bottom: 20px;
  right: 20px;
  display: flex;
  background: rgb(255, 255, 255);
  height: 8vh;
  gap: 10px;
  z-index: 5;
}

.scanning-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  border-radius: 10px;
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
  border-radius: 10px;
}

.loading-screen::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
    rgba(0,102,255,1) 0%,
    rgba(0,102,255,0.4) 20%,
    rgba(0,102,255,0.3) 30%,
    rgba(0,102,255,0.2) 35%,
    rgba(0,102,255,0.15) 40%,
    rgba(0,102,255,0.10) 50%,
    rgba(0,102,255,0.0) 100%
  );
  animation: moveWaveLeftToRight 3s linear infinite,
             waveFade 3s ease-in-out infinite;
  z-index: 2;
}

@keyframes moveWaveLeftToRight {
  from { transform: translateX(-100%); }
  to   { transform: translateX(50%); }
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
  text-shadow: 0 2px 6px rgba(0,0,0,0.6);
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
</style>