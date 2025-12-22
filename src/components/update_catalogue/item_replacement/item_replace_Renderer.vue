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
        <a-button @click="reset_entire_room" :disabled="isLoading">Before</a-button>
        <a-button type="primary" @click="reset_entire_room" :disabled="isLoading">After</a-button>
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

export default {
  name: 'ItemReplacementRenderer',

  props: {
    glbUrl: { type: String, required: true },
    product_id: { type: String, required: true },
    baseImageUrl: { type: String, required: true },
    floorMaskUrl: { type: String, required: true },
    depthMaskUrl: { type: String, required: true },
    roll: { type: Number, default: 0 },
    pitch: { type: Number, default: 0 },
    yaw: { type: Number, default: 0 },
  },

  emits: ['rendered-comfyui-workflow', 'Apply-Changes'],

  data() {
    return {
      isLoading: false,
      loadingText: 'Initializing...',
      modelLoaded: false,
      floorMaskLoaded: false,
      depthMaskLoaded: false,
      viewerInitialized: false,
      showGrid: true,
      showRotationControls: true,
      showFloorMask: false,
      isDragging: false,
      isRotating: false,
      isOnValidFloor: true,
      modelPosition: { x: 0, y: 0 },
      modelRotation: { y: 0 },
      floorAngles: { 
        roll: this.roll, 
        pitch: this.pitch,
        yaw: this.yaw
      },
      currentFloorHeight: 0,
      
      // Depth scaling properties - FIXED
      depthRange: { min: 0, max: 255 },
      nearDepth: 2.0,  // Camera near plane distance
      farDepth: 10.0,  // Camera far plane distance
      baseModelScale: 1.0,
      originalModelHeight: 0,
      currentDepth: 5.0,
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
    this.modelCenter = null;
    this.modelSize = null;
    this.rotationControlsGroup = null;
    this.rotationCircle = null;
    this.rotationArrows = null;
    this.currentBackgroundTexture = null;
    this.floorMaskMesh = null;
    this.floorMaskTexture = null;
    this.floorMaskCanvas = null;
    this.floorMaskContext = null;
    this.floorMaskImageData = null;
    
    this.depthMaskTexture = null;
    this.depthMaskCanvas = null;
    this.depthMaskContext = null;
    this.depthMaskImageData = null;
    
    this.isDraggingModel = false;
    this.isRotatingModel = false;
    this.dragStartMouse = new THREE.Vector2();
    this.dragStartPosition = new THREE.Vector2();
    this.rotationStartMouse = new THREE.Vector2();
    this.rotationStartAngle = 0;
    this.dragPlane = new THREE.Plane();
    this.raycaster = new THREE.Raycaster();
    this.floorNormal = new THREE.Vector3();
    
    // Store original bounds to prevent recalculation
    this.originalBoundingBox = null;
    this.originalSize = null;
    this.originalCenter = null;
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
    },
    floorMaskUrl: {
      handler(newUrl, oldUrl) {
        if (newUrl && newUrl !== oldUrl && this.viewerInitialized) {
          this.loadFloorMask();
        }
      }
    },
    depthMaskUrl: {
      handler(newUrl, oldUrl) {
        if (newUrl && newUrl !== oldUrl && this.viewerInitialized) {
          this.loadDepthMask();
        }
      }
    },
    roll(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.floorAngles.roll = newVal;
        if (this.viewerInitialized) this.updateFloorAngles();
      }
    },
    pitch(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.floorAngles.pitch = newVal;
        if (this.viewerInitialized) this.updateFloorAngles();
      }
    },
    yaw(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.floorAngles.yaw = newVal;
        if (this.viewerInitialized) this.updateFloorAngles();
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
      this.currentFloorHeight = 0;
      this.currentDepth = 5.0;
      
      if (this.model && this.scene) {
        this.scene.remove(this.model);
        this.model = null;
        this.modelBoundingBox = null;
        this.modelCenter = null;
        this.modelSize = null;
        this.originalBoundingBox = null;
        this.originalSize = null;
        this.originalCenter = null;
      }
      
      if (this.rotationControlsGroup) {
        this.rotationControlsGroup.position.set(0, 0, 0);
        this.rotationControlsGroup.scale.setScalar(1);
      }
    },

    async reinitializeWithNewModel() {
      this.loadingText = 'Loading new model...';
      await this.loadModel();
      this.fitCameraToModel();
      this.isLoading = false;
    },

    updateFloorAngles() {
      this.createFloorPlaneWithEulerAngles();
      this.createVisualGrid();
      this.createDepthMeshFloor();
      this.updateModelPositionOnFloor();
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

        this.initializeScene(container);
        this.initializeBackground();
        this.initializeLighting();
        
        this.loadingText = 'Loading floor mask...';
        await this.loadFloorMask();
        
        this.loadingText = 'Loading depth map...';
        await this.loadDepthMask();
        
        this.loadingText = 'Preparing workspace...';
        this.initializeEnhancedGrid();
        this.createDepthMeshFloor();
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
      this.scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.9));

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

      const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
      fillLight.position.set(-10, 5, -5);
      this.scene.add(fillLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
      keyLight.position.set(5, 10, 10);
      this.scene.add(keyLight);

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
        gridVertices.push(-gridSize / 2, 0, pos, gridSize / 2, 0, pos);
        gridVertices.push(pos, 0, -gridSize / 2, pos, 0, gridSize / 2);
      }
      
      gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridVertices, 3));
      const gridMaterial = new THREE.LineBasicMaterial({ 
        color: 0x888888, 
        transparent: true, 
        opacity: 0.3 
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

    createDepthMeshFloor() {
      if (!this.depthMaskImageData) return;
      
      if (this.floorMeshPlane) {
        this.scene.remove(this.floorMeshPlane);
      }
      
      const segments = 50;
      const size = 10;
      const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
      const positions = geometry.attributes.position.array;
      
      // Apply depth data to create 3D floor mesh
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 1];
        
        const depth = this.getDepthAtWorldPosition(new THREE.Vector3(x, 0, z));
        const realDepth = this.depthToRealDistance(depth);
        
        // Adjust Y position based on depth to create perspective floor
        positions[i + 2] = (realDepth - this.farDepth) * 0.1;
      }
      
      geometry.computeVertexNormals();
      
      const material = new THREE.MeshBasicMaterial({
        color: 0x88aaff,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });
      
      this.floorMeshPlane = new THREE.Mesh(geometry, material);
      this.floorMeshPlane.rotation.x = -Math.PI / 2;
      
      const euler = new THREE.Euler(
        THREE.MathUtils.degToRad(this.floorAngles.roll),
        THREE.MathUtils.degToRad(this.floorAngles.yaw),
        THREE.MathUtils.degToRad(-this.floorAngles.pitch),
        'ZYX'
      );
      this.floorMeshPlane.setRotationFromEuler(euler);
      this.floorMeshPlane.visible = false; // Hidden by default
      
      this.scene.add(this.floorMeshPlane);
    },

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
            console.log("Floor mask loaded:", this.floorMaskCanvas.width, "x", this.floorMaskCanvas.height);
            resolve();
          },
          undefined,
          (error) => {
            console.error("Failed to load floor mask:", error);
            this.floorMaskLoaded = false;
            resolve();
          }
        );
      });
    },

    async loadDepthMask() {
      if (!this.depthMaskUrl) return Promise.resolve();
      
      return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();
        loader.load(
          this.depthMaskUrl,
          (texture) => {
            this.depthMaskTexture = texture;
            
            this.depthMaskCanvas = document.createElement('canvas');
            this.depthMaskCanvas.width = texture.image.width;
            this.depthMaskCanvas.height = texture.image.height;
            this.depthMaskContext = this.depthMaskCanvas.getContext('2d');
            this.depthMaskContext.drawImage(texture.image, 0, 0);
            this.depthMaskImageData = this.depthMaskContext.getImageData(
              0, 0, 
              this.depthMaskCanvas.width, 
              this.depthMaskCanvas.height
            );
            
            this.calculateDepthRange();
            
            this.depthMaskLoaded = true;
            console.log("Depth mask loaded:", this.depthMaskCanvas.width, "x", this.depthMaskCanvas.height);
            console.log("Depth range:", this.depthRange);
            resolve();
          },
          undefined,
          (error) => {
            console.error("Failed to load depth mask:", error);
            this.depthMaskLoaded = false;
            resolve();
          }
        );
      });
    },

    calculateDepthRange() {
      const data = this.depthMaskImageData.data;
      let minDepth = 255;
      let maxDepth = 0;
      let validPixels = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        const depth = data[i];
        if (depth > 0) {
          minDepth = Math.min(minDepth, depth);
          maxDepth = Math.max(maxDepth, depth);
          validPixels++;
        }
      }
      
      if (validPixels > 0) {
        this.depthRange = { min: minDepth, max: maxDepth };
      } else {
        this.depthRange = { min: 0, max: 255 };
      }
    },

    getDepthAtWorldPosition(worldPos) {
      if (!this.depthMaskImageData) {
        return 0.5;
      }
      
      const normalizedX = worldPos.x / 5;
      const normalizedZ = worldPos.z / 5;
      
      const imgX = Math.floor((normalizedX + 1) * 0.5 * this.depthMaskCanvas.width);
      const imgY = Math.floor((1 - (normalizedZ + 1) * 0.5) * this.depthMaskCanvas.height);
      
      if (imgX < 0 || imgX >= this.depthMaskCanvas.width || 
          imgY < 0 || imgY >= this.depthMaskCanvas.height) {
        return 0.5;
      }
      
      const pixelIndex = (imgY * this.depthMaskCanvas.width + imgX) * 4;
      const depthValue = this.depthMaskImageData.data[pixelIndex];
      
      const range = this.depthRange.max - this.depthRange.min;
      if (range === 0) return 0.5;
      
      const normalizedDepth = (depthValue - this.depthRange.min) / range;
      
      return normalizedDepth;
    },

    depthToRealDistance(normalizedDepth) {
      // INVERTED: Higher depth values = closer to camera (darker in depth map)
      // Lower depth values = farther from camera (lighter in depth map)
      return this.nearDepth + ((1.0 - normalizedDepth) * (this.farDepth - this.nearDepth));
    },

    calculateScaleFromDepth(normalizedDepth) {
      const realDistance = this.depthToRealDistance(normalizedDepth);
      
      // Perspective scaling: closer objects appear larger
      // Scale inversely proportional to distance
      const referenceDistance = (this.nearDepth + this.farDepth) / 2;
      const scaleFactor = referenceDistance / realDistance;
      
      // Clamp to reasonable range
      return Math.max(0.3, Math.min(2.5, scaleFactor));
    },

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
      // Calculate original bounds ONCE
      this.originalBoundingBox = new THREE.Box3().setFromObject(this.model);
      this.originalSize = this.originalBoundingBox.getSize(new THREE.Vector3());
      this.originalCenter = this.originalBoundingBox.getCenter(new THREE.Vector3());

      // Scale to reasonable default size (1.5 meters)
      const maxDim = Math.max(this.originalSize.x, this.originalSize.y, this.originalSize.z);
      const desiredSize = 1.5;
      this.baseModelScale = desiredSize / maxDim;
      
      this.model.scale.setScalar(this.baseModelScale);

      // Recalculate after base scaling
      const scaledBox = new THREE.Box3().setFromObject(this.model);
      this.modelSize = scaledBox.getSize(new THREE.Vector3());
      this.modelCenter = scaledBox.getCenter(new THREE.Vector3());
      this.originalModelHeight = this.modelSize.y;

      // Center the model at origin
      this.model.position.sub(this.modelCenter);
      
      // Store reference bounding box (after centering)
      this.modelBoundingBox = new THREE.Box3().setFromObject(this.model);
    },

    positionModelOnFloor() {
      const initialPos = new THREE.Vector3(0, 0, 0);
      const floorHeight = this.getFloorHeightAtWorldPosition(initialPos);
      
      // Position model on floor using stored bounding box
      this.model.position.y = floorHeight - this.modelBoundingBox.min.y;
      this.currentFloorHeight = floorHeight;
      
      // Apply initial depth-based scaling
      const depth = this.getDepthAtWorldPosition(initialPos);
      this.currentDepth = this.depthToRealDistance(depth);
      this.applyDepthScaling(depth);
    },

    applyDepthScaling(normalizedDepth) {
      if (!this.model) return;
      
      const depthScaleFactor = this.calculateScaleFromDepth(normalizedDepth);
      const finalScale = this.baseModelScale * depthScaleFactor;
      
      // Apply scale WITHOUT recalculating bounding box
      this.model.scale.setScalar(finalScale);
      
      // Update size based on scale ratio (no box recalculation)
      const scaleRatio = finalScale / this.baseModelScale;
      this.modelSize.x = this.originalSize.x * this.baseModelScale * scaleRatio;
      this.modelSize.y = this.originalSize.y * this.baseModelScale * scaleRatio;
      this.modelSize.z = this.originalSize.z * this.baseModelScale * scaleRatio;
      
      console.log(`Depth: ${this.currentDepth.toFixed(2)}m, Scale: ${depthScaleFactor.toFixed(2)}x`);
    },

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
          
          // Check if on valid floor first
          if (this.isPositionOnFloor(newWorldPos)) {
            this.modelPosition.x = newWorldPos.x;
            this.modelPosition.y = newWorldPos.z;
            this.isOnValidFloor = true;
            this.updateModelPositionOnFloor();
          } else {
            this.isOnValidFloor = false;
          }
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
      if (!this.floorMaskImageData) return true;
      
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
      
      // Update XZ position
      this.model.position.x = this.modelPosition.x;
      this.model.position.z = this.modelPosition.y;
      
      const worldPos = new THREE.Vector3(this.modelPosition.x, 0, this.modelPosition.y);
      
      // Get depth and apply scaling
      const depth = this.getDepthAtWorldPosition(worldPos);
      this.currentDepth = this.depthToRealDistance(depth);
      this.applyDepthScaling(depth);
      
      // Calculate floor height
      const floorHeight = this.getFloorHeightAtWorldPosition(worldPos);
      this.currentFloorHeight = floorHeight;
      
      // Position model on floor using original bounding box minimum
      const currentScale = this.model.scale.x;
      const scaledMinY = this.modelBoundingBox.min.y * (currentScale / this.baseModelScale);
      this.model.position.y = floorHeight - scaledMinY;
      
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

    reset_entire_room() {
      this.modelPosition = { x: 0, y: 0 };
      this.modelRotation = { y: 0 };
      if (this.model) {
        this.updateModelPositionOnFloor();
        this.updateModelRotation();
      }
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
  background: rgba(20, 20, 20, 0.55);
  backdrop-filter: blur(0.1px); 
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