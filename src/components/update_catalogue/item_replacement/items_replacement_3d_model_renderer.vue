<template>
<!--  <div v-if="!glbUrl || glbUrl === ''" class="no-product-state" style="display:flex;justify-content: center;align-items: center;height:100%;width:100%;min-height:400px;background:#f5f5f5;border-radius:8px;">
    <div style="text-align:center;color:#666;">
      <div style="font-size:48px;margin-bottom:16px;">📦</div>
      <div style="font-size:18px;font-weight:500;">Please select a Product</div>
      <div style="font-size:14px;margin-top:8px;">Choose any product to get replacement visualization</div>
    </div>
  </div> -->
  <div v-if="!glbUrl || glbUrl === ''" >
    <div style="text-align:center;color:#666;">
      
      <img :src="this.baseImageUrl" alt="" style="max-width:850px;margin:auto">
    </div>
  </div>
  <div v-else style="display: flex;justify-content: center;align-items: center;">
    <!-- roll = {{roll}} ||  &nbsp; pitch = {{pitch}} ||  &nbsp; yaw = {{yaw}} -->
      
    
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
        
      <!-- Action Buttons -->
      
    </div>
    
  </div>
  <div v-if="!isLoading" class="action-buttons" style="display:flex;justify-content: space-between;padding-left:10px;padding-right:10px;background: white;">
     
  <div style="padding-top:5px;">
<div style="display:flex;gap:5px;padding-top:5px;">
    <a-button size="medium" @click="renderItem"type='primary'>Render 3D Item</a-button>
</div>
</div>
<div>
  
<div style="padding-top:5px;display:flex;gap:10px;">

  <a-button   @click="reset_entire_room">
    Before
  </a-button>
  <a-button type="primary"  @click="reset_entire_room">
    After
  </a-button>
</div>
      </div>
      <div style="padding-top:10px;">
        <a-button type="primary"  @click="reset_entire_room">
          Apply Changes
        </a-button>
      </div>
    </div>

</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default {
  name: 'ItemReplacementRenderer',

  // ===========================
  // PROPS
  // ===========================
  props: {
    glbUrl: { type: String, required: true },
    product_id: { type: String, required: true },
    baseImageUrl: { type: String, required: true },
    floorMaskUrl: { type: String, required: true },
    roll: { type: Number, default: 0 },
    pitch: { type: Number, default: 0 },
    yaw: { type: Number, default: 0 },
  },

  // ===========================
  // EMITS
  // ===========================
  emits: ['rendered-comfyui-workflow'],

  // ===========================
  // DATA
  // ===========================
  data() {
    return {
      // Loading states
      isLoading: false,
      loadingText: 'Initializing...',
      modelLoaded: false,
      floorMaskLoaded: false,
      viewerInitialized: false,

      // UI states
      showGrid: false,
      showRotationControls: true,
      showFloorMask: false,
      isDragging: false,
      isRotating: false,
      isOnValidFloor: true,

      // Model positioning
      modelPosition: { x: 0, y: 0 },
      modelRotation: { y: 0 },

      // Floor configuration
      floorAngles: { 
        roll: this.roll, 
        pitch: this.pitch,
        yaw: this.yaw
      },

      // Grid settings
      gridSize: 0.3,
      currentFloorHeight: 0,
    };
  },

  // ===========================
  // NON-REACTIVE DATA
  // ===========================
  created() {
    // Three.js variables (non-reactive to avoid proxy issues)
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
    this.model = null;
    this.modelBoundingBox = null;
    this.modelCenter = null;
    this.modelSize = null;
    this.rotationControlsGroup = null;
    this.rotationCircle = null;
    this.rotationArrows = null;
    this.currentBackgroundTexture = null;
    this.floorMaskMesh = null;

    // Floor mask data (non-reactive)
    this.floorMaskTexture = null;
    this.floorMaskCanvas = null;
    this.floorMaskContext = null;
    this.floorMaskImageData = null;

    // Interaction variables (non-reactive)
    this.isDraggingModel = false;
    this.isRotatingModel = false;
    this.dragStartMouse = new THREE.Vector2();
    this.dragStartPosition = new THREE.Vector2();
    this.rotationStartMouse = new THREE.Vector2();
    this.rotationStartAngle = 0;
    this.dragPlane = new THREE.Plane();
    this.raycaster = new THREE.Raycaster();
    this.floorNormal = new THREE.Vector3();
  },

  // ===========================
  // WATCHERS
  // ===========================
  watch: {
    glbUrl: {
      handler(newUrl, oldUrl) {
        console.log('glbUrl changed:', { newUrl, oldUrl });
        
        // If URL changes from empty to valid or from one URL to another
        if (newUrl && newUrl !== '' && newUrl !== oldUrl) {
          // Use nextTick to ensure DOM is ready
          this.$nextTick(() => {
            this.handleGlbUrlChange();
          });
        }
      },
      immediate: false // Don't trigger on component creation
    },
    baseImageUrl: {
      handler(newUrl, oldUrl) {
        if (newUrl && newUrl !== oldUrl && this.viewerInitialized) {
          this.initializeBackground();
        }
      }
    },
    floorMaskUrl: {
      handler(newUrl, oldUrl) {
        if (newUrl && newUrl !== oldUrl && this.viewerInitialized) {
          this.loadFloorMask();
        }
      }
    },
    roll(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.floorAngles.roll = newVal;
        if (this.viewerInitialized) {
          this.updateFloorAngles();
        }
      }
    },
    pitch(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.floorAngles.pitch = newVal;
        if (this.viewerInitialized) {
          this.updateFloorAngles();
        }
      }
    },
    yaw(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.floorAngles.yaw = newVal;
        if (this.viewerInitialized) {
          this.updateFloorAngles();
        }
      }
    }
  },

  // ===========================
  // LIFECYCLE HOOKS
  // ===========================
  mounted() {
    console.log('Component mounted with glbUrl:', this.glbUrl);
    
    // Only initialize if glbUrl is provided and DOM is ready
    if (this.glbUrl && this.glbUrl !== '') {
      this.$nextTick(() => {
        this.handleGlbUrlChange();
      });
    }
  },

  beforeUnmount() {
    this.cleanup();
  },

  // ===========================
  // METHODS
  // ===========================
  methods: {
    // ===================
    // URL CHANGE HANDLER
    // ===================

    async handleGlbUrlChange() {
      console.log('Handling glbUrl change:', this.glbUrl);
      
      try {
        // Reset states
        this.resetComponentState();
        
        // Start loading
        this.isLoading = true;
        this.loadingText = 'Initializing 3D Viewer...';
        
        // Wait for DOM to update after v-if change
        await this.$nextTick();
        
        // Initialize or reinitialize viewer
        if (!this.viewerInitialized) {
          await this.initializeViewer();
        } else {
          await this.reinitializeWithNewModel();
        }
        
        console.log('Model loaded successfully');
        
      } catch (error) {
        console.error('Error handling glbUrl change:', error);
        this.showErrorState();
      }
    },

    resetComponentState() {
      // Reset data states
      this.modelLoaded = false;
      this.modelPosition = { x: 0, y: 0 };
      this.modelRotation = { y: 0 };
      this.currentFloorHeight = 0;
      
      // Clear previous model from scene
      if (this.model && this.scene) {
        this.scene.remove(this.model);
        this.model = null;
        this.modelBoundingBox = null;
        this.modelCenter = null;
        this.modelSize = null;
      }
      
      // Reset rotation controls position
      if (this.rotationControlsGroup) {
        this.rotationControlsGroup.position.set(0, 0, 0);
        this.rotationControlsGroup.scale.setScalar(1);
      }
    },

    async reinitializeWithNewModel() {
      this.loadingText = 'Loading new model...';
      
      // Load new model
      await this.loadModel();
      
      // Update camera fit for new model
      this.fitCameraToModel();
      
      this.isLoading = false;
    },

    updateFloorAngles() {
      this.createFloorPlaneWithEulerAngles();
      this.createVisualGrid();
      this.createFloorMaskVisualization();
      this.updateModelPositionOnFloor();
    },

    // ===================
    // INITIALIZATION METHODS
    // ===================

    async initializeViewer() {
      // Wait for the DOM to be ready
      await this.$nextTick();
      
      const container = this.$refs.viewer;
      
      if (!container) {
        console.error('Viewer container not found - waiting for DOM...');
        // Try again after a short delay
        await new Promise(resolve => setTimeout(resolve, 100));
        return this.initializeViewer();
      }
      
      try {
        this.isLoading = true;
        this.loadingText = 'Setting up 3D environment...';

        this.initializeScene(container);
        this.initializeBackground();
        this.initializeLighting();
        
        this.loadingText = 'Loading floor data...';
        await this.loadFloorMask();
        
        this.loadingText = 'Preparing workspace...';
        this.initializeEnhancedGrid();
        this.initializeRotationControls();
        this.initializeControls();
        this.initializeDragControls();
        
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

    initializeScene(container) {
      this.scene = new THREE.Scene();
      this.backgroundScene = new THREE.Scene();
      this.backgroundCamera = new THREE.Camera();

      this.camera = new THREE.PerspectiveCamera(
        45, 
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
  // Increase ambient light for overall brightness
  this.scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.9)); // Increased from 0.6 to 0.8

  // Main directional light - increased intensity
  const dirLight = new THREE.DirectionalLight(0xffffff, 8); // Increased from 0.8 to 1.2
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

  // Fill light - increased intensity and repositioned
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.8); // Increased from 0.3 to 0.6
  fillLight.position.set(-10, 5, -5);
  this.scene.add(fillLight);

  // Add additional key light from different angle
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
  keyLight.position.set(5, 10, 10);
  this.scene.add(keyLight);

  // Add subtle rim light for better edge definition
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
  rimLight.position.set(-5, 5, -10);
  this.scene.add(rimLight);
},

    initializeControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      
      this.controls.enableRotate = false;
      this.controls.enableZoom = false;
      this.controls.enablePan = false;

      this.camera.position.set(10, 10, 10);
      this.controls.target.set(0, 0, 0);
      this.controls.update();
    },

    initializeDragControls() {
      const canvas = this.renderer.domElement;
      canvas.addEventListener('mousedown', this.onMouseDown);
      canvas.addEventListener('mousemove', this.onMouseMove);
      canvas.addEventListener('mouseup', this.onMouseUp);
      canvas.addEventListener('mouseleave', this.onMouseUp);
    },

    // ===================
    // GRID & FLOOR METHODS
    // ===================

    initializeEnhancedGrid() {
      this.gridGroup = new THREE.Group();
      this.scene.add(this.gridGroup);
      this.createFloorPlaneWithEulerAngles();
      this.createVisualGrid();
    },

    createFloorPlaneWithEulerAngles() {
      if (this.floorPlane) this.gridGroup.remove(this.floorPlane);
      
      this.floorNormal = this.getFloorNormalFromEulerAngles();
      
      const floorGeometry = new THREE.PlaneGeometry(20, 20);
      const floorMaterial = new THREE.MeshLambertMaterial({
        transparent: true,
        opacity: 0,
        color: 0x888888,
        side: THREE.DoubleSide
      });
      
      this.floorPlane = new THREE.Mesh(floorGeometry, floorMaterial);
      
      const euler = new THREE.Euler(
        THREE.MathUtils.degToRad(this.floorAngles.roll),
        THREE.MathUtils.degToRad(this.floorAngles.yaw),
        THREE.MathUtils.degToRad(-this.floorAngles.pitch),
        'ZYX'
      );
      this.floorPlane.setRotationFromEuler(euler);
      
      this.floorPlane.position.y = 0;
      this.floorPlane.name = 'dragFloor';
      this.gridGroup.add(this.floorPlane);
      
      this.updateDragPlane();
    },

    createVisualGrid() {
      if (this.gridHelper) this.gridGroup.remove(this.gridHelper);
      
      const gridSize = 10;
      const divisions = 20;
      const step = gridSize / divisions;
      
      const gridGeometry = new THREE.BufferGeometry();
      const gridVertices = [];
      
      for (let i = 0; i <= divisions; i++) {
        const pos = -gridSize / 2 + i * step;
        
        gridVertices.push(-gridSize / 2, 0, pos);
        gridVertices.push(gridSize / 2, 0, pos);
        
        gridVertices.push(pos, 0, -gridSize / 2);
        gridVertices.push(pos, 0, gridSize / 2);
      }
      
      gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridVertices, 3));
      
      const gridMaterial = new THREE.LineBasicMaterial({ 
        color: 0x888888, 
        transparent: true, 
        opacity: 0.5 
      });
      
      this.gridHelper = new THREE.LineSegments(gridGeometry, gridMaterial);
      
      const euler = new THREE.Euler(
        THREE.MathUtils.degToRad(this.floorAngles.roll),
        THREE.MathUtils.degToRad(this.floorAngles.yaw),
        THREE.MathUtils.degToRad(-this.floorAngles.pitch),
        'ZYX'
      );
      this.gridHelper.setRotationFromEuler(euler);
      this.gridHelper.visible = this.showGrid;
      
      this.gridGroup.add(this.gridHelper);
    },

    // ===================
    // FLOOR MASK METHODS
    // ===================

    async loadFloorMask() {
      if (!this.floorMaskUrl) return Promise.resolve();
      
      return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();
        loader.load(
          this.floorMaskUrl,
          (texture) => {
            this.floorMaskTexture = texture;
            
            this.floorMaskCanvas = document.createElement('canvas');
            this.floorMaskCanvas.width = texture.image.width;
            this.floorMaskCanvas.height = texture.image.height;
            this.floorMaskContext = this.floorMaskCanvas.getContext('2d');
            this.floorMaskContext.drawImage(texture.image, 0, 0);
            this.floorMaskImageData = this.floorMaskContext.getImageData(
              0, 0, 
              this.floorMaskCanvas.width, 
              this.floorMaskCanvas.height
            );
            
            this.floorMaskLoaded = true;
            this.createFloorMaskVisualization();
            console.log("Floor mask loaded:", this.floorMaskCanvas.width, "x", this.floorMaskCanvas.height);
            resolve();
          },
          undefined,
          (error) => {
            console.error("Failed to load floor mask:", error);
            this.floorMaskLoaded = false;
            resolve(); // Don't reject to allow component to continue
          }
        );
      });
    },

    createFloorMaskVisualization() {
      if (!this.floorMaskTexture) return;
      
      const geometry = new THREE.PlaneGeometry(10, 10);
      const material = new THREE.MeshBasicMaterial({
        map: this.floorMaskTexture,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      
      if (this.floorMaskMesh) this.scene.remove(this.floorMaskMesh);
      this.floorMaskMesh = new THREE.Mesh(geometry, material);
      
      const euler = new THREE.Euler(
        THREE.MathUtils.degToRad(this.floorAngles.roll),
        THREE.MathUtils.degToRad(this.floorAngles.yaw),
        THREE.MathUtils.degToRad(-this.floorAngles.pitch),
        'ZYX'
      );
      this.floorMaskMesh.setRotationFromEuler(euler);
      
      this.floorMaskMesh.position.y = 0;
      this.floorMaskMesh.visible = this.showFloorMask;
      this.scene.add(this.floorMaskMesh);
    },

    // ===================
    // ROTATION CONTROLS METHODS
    // ===================

    initializeRotationControls() {
      this.rotationControlsGroup = new THREE.Group();
      this.rotationControlsGroup.name = 'rotationControls';
      
      const circleGeometry = new THREE.RingGeometry(1.5, 1.6, 64);
      const circleMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ffff, 
        transparent: true, 
        opacity: 0.8,
        side: THREE.DoubleSide 
      });
      this.rotationCircle = new THREE.Mesh(circleGeometry, circleMaterial);
      this.rotationCircle.rotation.x = -Math.PI / 2;
      this.rotationCircle.name = 'rotationCircle';
      this.rotationControlsGroup.add(this.rotationCircle);
      
      this.rotationArrows = new THREE.Group();
      this.rotationArrows.name = 'rotationArrows';
      
      const arrowPositions = [
        { angle: 0, axis: 'y', id: 0 },
        { angle: Math.PI / 2, axis: 'y', id: 1 },
        { angle: Math.PI, axis: 'y', id: 2 },
        { angle: (3 * Math.PI) / 2, axis: 'y', id: 3 }
      ];
      
      arrowPositions.forEach((pos) => {
        const arrowGroup = this.createRotationArrow(pos.angle, pos.axis, pos.id);
        this.rotationArrows.add(arrowGroup);
      });
      
      this.rotationControlsGroup.add(this.rotationArrows);
      this.rotationControlsGroup.visible = this.showRotationControls;
      this.scene.add(this.rotationControlsGroup);
    },

    createRotationArrow(angle, axis, index) {
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
    },

    // ===================
    // MODEL LOADING METHODS
    // ===================

    async loadModel() {
      if (!this.glbUrl || this.glbUrl === '') {
        console.warn('No glbUrl provided');
        return Promise.resolve();
      }
      
      return new Promise((resolve, reject) => {
        this.loadingText = 'Loading 3D Model...';
        
        const loader = new GLTFLoader();
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
            this.updateRotationControlsPosition();
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
      this.modelBoundingBox = new THREE.Box3().setFromObject(this.model);
      this.modelSize = this.modelBoundingBox.getSize(new THREE.Vector3());
      this.modelCenter = this.modelBoundingBox.getCenter(new THREE.Vector3());

      const maxDim = Math.max(this.modelSize.x, this.modelSize.y, this.modelSize.z);
      const desiredSize = 2;
      const scaleFactor = desiredSize / maxDim;
      this.model.scale.setScalar(scaleFactor);

      this.modelBoundingBox = new THREE.Box3().setFromObject(this.model);
      this.modelSize = this.modelBoundingBox.getSize(new THREE.Vector3());
      this.modelCenter = this.modelBoundingBox.getCenter(new THREE.Vector3());

      this.model.position.sub(this.modelCenter);
    },

    positionModelOnFloor() {
      const initialPos = new THREE.Vector3(0, 0, 0);
      const floorHeight = this.getFloorHeightAtWorldPosition(initialPos);
      this.model.position.y = floorHeight - this.modelBoundingBox.min.y;
      this.currentFloorHeight = floorHeight;
    },

    // ===================
    // INTERACTION METHODS
    // ===================

    onMouseDown(event) {
      event.preventDefault();
      
      const mouse = new THREE.Vector2();
      const rect = this.renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      this.raycaster.setFromCamera(mouse, this.camera);
      
      if (this.rotationArrows && this.showRotationControls) {
        const arrowIntersects = this.raycaster.intersectObject(this.rotationArrows, true);
        
        if (arrowIntersects.length > 0) {
          const intersectedArrow = arrowIntersects[0].object;
          if (intersectedArrow.userData.isRotationArrow) {
            this.controls.enabled = false;
            this.isRotatingModel = true;
            this.isRotating = true;
            
            this.rotationStartMouse.copy(mouse);
            this.rotationStartAngle = this.modelRotation.y;
            
            intersectedArrow.material.color.setHex(0xff6600);
            return;
          }
        }
      }
      
      if (this.model) {
        const intersects = this.raycaster.intersectObject(this.model, true);
        
        if (intersects.length > 0) {
          this.controls.enabled = false;
          this.isDraggingModel = true;
          this.isDragging = true;
          
          this.dragStartMouse.copy(mouse);
          this.dragStartPosition.set(this.modelPosition.x, this.modelPosition.y);
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
          const newWorldPos = intersection.clone();
          
          this.modelPosition.x = newWorldPos.x;
          this.modelPosition.y = newWorldPos.z;
          
          this.isOnValidFloor = this.isPositionOnFloor(newWorldPos);
          this.updateModelPositionOnFloor();
        }
      } else if (this.isRotatingModel) {
        const deltaX = mouse.x - this.rotationStartMouse.x;
        this.modelRotation.y = this.rotationStartAngle + (deltaX * 180);
        this.modelRotation.y = Math.max(-180, Math.min(180, this.modelRotation.y));
        this.updateModelRotation();
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
        
        if (this.rotationArrows) {
          this.rotationArrows.traverse((child) => {
            if (child.userData && child.userData.isRotationArrow) {
              child.material.color.setHex(child.userData.originalColor);
            }
          });
        }
      }
    },

    // ===================
    // UTILITY METHODS
    // ===================

    getFloorNormalFromEulerAngles() {
      const normal = new THREE.Vector3(0, 1, 0);
      
      const euler = new THREE.Euler(
        THREE.MathUtils.degToRad(this.floorAngles.roll),
        THREE.MathUtils.degToRad(this.floorAngles.yaw),
        THREE.MathUtils.degToRad(-this.floorAngles.pitch),
        'ZYX'
      );
      normal.applyEuler(euler);
      
      return normal;
    },

    updateDragPlane() {
      const floorPoint = new THREE.Vector3(0, 0, 0);
      this.dragPlane.setFromNormalAndCoplanarPoint(this.floorNormal, floorPoint);
    },

    isPositionOnFloor(worldPos) {
      if (!this.floorMaskImageData || !this.currentBackgroundTexture) return true;
      
      const normalizedX = worldPos.x / 5;
      const normalizedZ = worldPos.z / 5;
      
      const imgX = Math.floor((normalizedX + 1) * 0.5 * this.floorMaskCanvas.width);
      const imgY = Math.floor((1 - (normalizedZ + 1) * 0.5) * this.floorMaskCanvas.height);
      
      if (imgX < 0 || imgX >= this.floorMaskCanvas.width || 
          imgY < 0 || imgY >= this.floorMaskCanvas.height) {
        return false;
      }
      
      const pixelIndex = (imgY * this.floorMaskCanvas.width + imgX) * 4;
      const red = this.floorMaskImageData.data[pixelIndex];
      
      return red > 128;
    },

    getFloorHeightAtWorldPosition(worldPos) {
      if (Math.abs(this.floorNormal.y) < 0.001) return 0;
      
      return -(this.floorNormal.x * worldPos.x + this.floorNormal.z * worldPos.z) / this.floorNormal.y;
    },

    updateModelPositionOnFloor() {
      if (!this.model) return;
      
      this.model.position.x = this.modelPosition.x;
      this.model.position.z = this.modelPosition.y;
      
      const worldPos = new THREE.Vector3(this.modelPosition.x, 0, this.modelPosition.y);
      const floorHeight = this.getFloorHeightAtWorldPosition(worldPos);
      this.currentFloorHeight = floorHeight;
      
      if (this.modelBoundingBox) {
        this.model.position.y = floorHeight - this.modelBoundingBox.min.y;
      }
      
      this.updateRotationControlsPosition();
    },

    updateModelRotation() {
      if (!this.model) return;
      this.model.rotation.y = THREE.MathUtils.degToRad(this.modelRotation.y);
    },

    updateRotationControlsPosition() {
      if (!this.rotationControlsGroup || !this.model) return;
      
      this.rotationControlsGroup.position.copy(this.model.position);
      
      let scale = 1;
      if (this.modelSize) {
        const avgSize = (this.modelSize.x + this.modelSize.z) / 2;
        scale = Math.max(0.5, avgSize * 0.8);
      }
      this.rotationControlsGroup.scale.setScalar(scale);
    },

    fitCameraToModel() {
      if (!this.model || !this.modelSize) return;
      
      const maxDim = Math.max(this.modelSize.x, this.modelSize.y, this.modelSize.z);
      const fov = this.camera.fov * (Math.PI / 180);
      const fitHeightDistance = maxDim / (2 * Math.tan(fov / 2));
      const fitWidthDistance = fitHeightDistance / this.camera.aspect;
      
      const distance = Math.max(fitHeightDistance, fitWidthDistance) * 5.0;

      this.camera.position.set(distance * 0.5, distance * 0.4, distance * 0.8);
      
      const modelWorldY = this.model.position.y + this.modelSize.y * 0.5;
      this.controls.target.copy(new THREE.Vector3(0, modelWorldY, 0));
      this.controls.update();
    },

adjustCanvasToImageAspectRatio(texture) {
  if (!texture.image || !this.$refs.canvasContainer) return;
  
  // Get available container space
  const containerRect = this.$refs.canvasContainer.getBoundingClientRect();
  const availableWidth = Math.floor(containerRect.width);
  const availableHeight = Math.floor(containerRect.height);
  
  // Apply your maximum constraints
  const maxWidth = Math.min(availableWidth, 900);
  const maxHeight = Math.min(availableHeight, 600);
  
  const imgAspect = texture.image.width / texture.image.height;
  const maxAspect = maxWidth / maxHeight;
  
  let canvasWidth, canvasHeight;
  
  if (imgAspect > maxAspect) {
    // Image is wider - constrain by width
    canvasWidth = maxWidth;
    canvasHeight = Math.round(maxWidth / imgAspect);
  } else {
    // Image is taller - constrain by height
    canvasHeight = maxHeight;
    canvasWidth = Math.round(maxHeight * imgAspect);
  }
  
  // this.$refs.canvasContainer.style.width = `${canvasWidth}px`;
  // this.$refs.canvasContainer.style.height = `${canvasHeight}px`;
  
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

    // ===================
    // ACTION METHODS
    // ===================

    generateBinaryMask() {
      if (!this.model || !this.currentBackgroundTexture) {
        console.warn("Model or background not loaded");
        return;
      }

      const bgWidth = this.currentBackgroundTexture.image.width;
      const bgHeight = this.currentBackgroundTexture.image.height;

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
      const modelClone = this.model.clone();
      tempScene.add(modelClone);

      tempScene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 1.0));
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
      dirLight.position.set(10, 15, 5);
      tempScene.add(dirLight);

      const tempCamera = this.camera.clone();
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
    },

    async renderItem() {
      if (!this.model || !this.currentBackgroundTexture) {
        console.warn("Model or background not loaded");
        return;
      }

      try {
        this.isLoading = true;
        this.loadingText = 'Rendering Item...';

        const roomId = this.$route.params.id;
        const prod_id = this.product_id;
        const url = `${this.$store.state.root_api}engine/inpaint-item-ref/`;

        const bgWidth = this.currentBackgroundTexture.image.width;
        const bgHeight = this.currentBackgroundTexture.image.height;

        // Create binary mask
        const blob = await this.createBinaryMaskBlob(bgWidth, bgHeight);

        // Prepare form data
        const formData = new FormData();
        formData.append('binary_mask', blob, 'binary_mask.png');
        formData.append('room_id', roomId);
        formData.append('prod_id', prod_id);

        this.loadingText = 'Adding Product to Your Room...';

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        this.$emit('rendered-comfyui-workflow', result.final_output);
        
        console.log('Binary mask sent successfully:', result);
        console.log(`Binary mask generated with dimensions: ${bgWidth}x${bgHeight}`);
        
        return result;

      } catch (error) {
        console.error('Error rendering item:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createBinaryMaskBlob(bgWidth, bgHeight) {
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
      const modelClone = this.model.clone();
      tempScene.add(modelClone);

      tempScene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 1.0));
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
      dirLight.position.set(10, 15, 5);
      tempScene.add(dirLight);

      const tempCamera = this.camera.clone();
      tempCamera.aspect = bgWidth / bgHeight;
      tempCamera.updateProjectionMatrix();

      modelClone.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        }
      });

      tempRenderer.render(tempScene, tempCamera);

      const blob = await new Promise(resolve => {
        tempCanvas.toBlob(resolve, 'image/png');
      });

      tempRenderer.dispose();
      return blob;
    },

    // ===================
    // ANIMATION & RENDER
    // ===================

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

    // ===================
    // EVENT HANDLERS
    // ===================

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

    // ===================
    // CLEANUP
    // ===================

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
        
        // Dispose of renderer and related resources
        this.renderer.dispose();
        
        // Remove canvas from DOM if it exists
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
      
      // Clear Three.js objects
      if (this.scene) {
        this.scene.clear();
      }
      
      // Reset state
      this.viewerInitialized = false;
      this.modelLoaded = false;
      this.isLoading = false;
    }
  }
};
</script>

<style scoped>
.controls-panel {
  display: none;
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
  margin: 0 auto;
  /* width: fit-content; */
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
  /* position: absolute; */
  bottom: 20px;
  right: 20px;
  display: flex;
  background:rgb(255, 255, 255);
  height:8vh;
  gap: 10px;
  z-index: 5;
}

.action-btn {
  background: #1890ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #40a9ff;
  transform: translateY(-2px);
}

.action-btn:active {
  transform: translateY(0);
}

/* Loading overlay styles */
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