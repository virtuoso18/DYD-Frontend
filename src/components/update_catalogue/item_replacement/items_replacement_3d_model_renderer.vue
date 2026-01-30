<template>
  <!-- {{ isLoading }} -->

  <div
    class="main-canvas max-h-[300px] md:max-h-[95vh] mx-auto"
    ref="canvasContainer"
  >
    <!-- ✅ LOADING OVERLAY - Always rendered on top when isLoading=true -->
    <div v-if="isLoading" class="scanning-loading-overlay">
      <div
        class="loading-screen"
        :style="{
          backgroundImage: baseImageUrl ? `url(${baseImageUrl})` : 'none',
        }"
      >
        <div class="wave-overlay"></div>
        <div class="loading-text">
          <div class="process-text">{{ loadingText }}</div>
        </div>
      </div>
    </div>

    <!-- ✅ CONTENT AREA - Show based on state -->
    <div v-show="!isLoading" class="content-area">
      <!-- Show background image when no GLB -->
      <div
        v-if="!glbUrl || glbUrl === ''"
        class="text-center flex items-center justify-center text-gray-600"
      >
        <img
          :src="baseImageUrl"
          alt=""
          class="max-w-full max-h-[54vh] md:max-h-[83vh] mx-auto"
        />
      </div>

      <!-- 3D Viewer Container -->
      <div id="viewer" ref="viewer" v-show="glbUrl && glbUrl !== ''"></div>

      <span
        style="
          background: white;
          border-radius: 5px;
          padding-left: 5px;
          padding-right: 5px;
          font-size: 12px;
          font-weight: 600;
          position: absolute;
          bottom: 10px;
          left: 10px;
        "
        >W-{{ currentModelDimensions.width }}m X H-{{
          currentModelDimensions.height
        }}m X D-{{ currentModelDimensions.depth }}m</span
      >
    </div>
  </div>

  <div
    class="flex justify-between items-center py-2 px-2 bg-white w-full gap-2"
  >
    <!-- Left: Reset -->
    <button
      className="bg-gray-300 px-6 py-1 rounded-md"
      @click="reset_entire_room"
      :disabled="glbUrl && isLoading"
      style="
        font-family: Poppins;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0%;
        text-align: center;
      "
    >
      Reset
    </button>

    <!-- Center: Scale Controls -->
    <div class="flex items-center gap-2" v-show="is_resizable">
      <!-- Minus Button -->
      <button
        className="bg-red-100 hover:bg-red-200 !text-black px-3 py-1 rounded-md"
        @click="scaleDown"
        :disabled="isLoading || !modelLoaded"
        style="
          font-family: Poppins;
          font-weight: 600;
          font-size: 16px;
          line-height: 20px;
          text-align: center;
          min-width: 40px;
        "
      >
        −
      </button>

      <!-- Scale Display -->
      <div
        class="bg-gray-100 px-3 py-1 rounded-md text-center"
        style="
          font-family: Poppins;
          font-weight: 500;
          font-size: 12px;
          min-width: 60px;
        "
      >
        {{ (modelScale * 100).toFixed(0) }}%
      </div>

      <!-- Plus Button -->
      <button
        className="bg-green-100 hover:bg-green-200 !text-black px-3 py-1 rounded-md"
        @click="scaleUp"
        :disabled="isLoading || !modelLoaded"
        style="
          font-family: Poppins;
          font-weight: 600;
          font-size: 16px;
          line-height: 20px;
          text-align: center;
          min-width: 40px;
        "
      >
        +
      </button>
    </div>

    <!-- Right: Apply Changes -->
    <a-button
      className="pt-[10px] !text-white px-2  bg-blue-500 rounded-md py-1"
      type="primary"
      @click="$emit('Apply-Changes', 'item-replacement-3d-renderer')"
      :disabled="isLoading"
    >
      Finalise Changes
    </a-button>
  </div>

  <!-- <div class="apply-section md:hidden">
    <a-button
      type="primary"
      size="large"
      block
      @click="$emit('trigger-render-3d-object')"
      style="
        font-family: Poppins;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0%;
        text-align: center;
      "
    >
      Apply
    </a-button>
  </div> -->
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default {
  name: "ItemReplacementRenderer",

  props: {
    glbUrl: { type: String, required: true },
    product_id: { type: String, required: true },
    baseImageUrl: { type: String, required: true },
    is_resizable: { type: Boolean, required: true },
    isLoading: {
      type: Boolean,
      required: true,
    },
    floorData: Object,
    modelDimensions: {
      type: Object,
      default: () => ({ width: 1.4, height: 1.2, depth: 1.5 }),
    },
  },
  computed: {
    loadingProxy: {
      get() {
        return this.isLoading;
      },
      set(val) {
        this.$emit("update:isLoading", val);
      },
    },
  },
  emits: ["rendered-comfyui-workflow", "Apply-Changes", "update:isLoading"],

  data() {
    return {
      // isLoading: false,
      loadingText: "Initializing...",
      modelLoaded: false,
      viewerInitialized: false,
      showGrid: false,
      floorShadow_area_opacity: 0.0,
      showRotationRing: true,
      isDragging: false,
      isRotating: false,
      isOnValidFloor: true,
      modelPosition: { x: 0, y: 0 },
      modelRotation: { y: 0 },

      // Floor data from JSON
      // floorData: {}
      // ... your existing data ...
      modelScale: 1.0, // Track current scale multiplier
      minScale: 0.5, // Minimum scale (50%)
      maxScale: 3.0, // Maximum scale (300%)
      scaleStep: 0.02, // Step size for +/- buttons (10%)

      // Store the base dimensions separately
      currentModelDimensions: {
        width: 0,
        height: 0,
        depth: 0,
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
  // CORRECT PLACEMENT - Replace your entire watch section with this:

  watch: {
    glbUrl: {
      handler(newUrl, oldUrl) {
        if (newUrl && newUrl !== "" && newUrl !== oldUrl) {
          this.$nextTick(() => {
            this.handleGlbUrlChange();
          });
        }
      },
      immediate: false,
    },
    baseImageUrl: {
      handler(newUrl, oldUrl) {
        if (newUrl && newUrl !== oldUrl && this.viewerInitialized) {
          this.initializeBackground();
        }
      },
    },
    modelDimensions: {
      handler(newDimensions, oldDimensions) {
        if (newDimensions && newDimensions !== oldDimensions) {
          // Update currentModelDimensions with the new prop values, scaled by current modelScale
          this.currentModelDimensions.width = parseFloat(
            (newDimensions.width * this.modelScale).toFixed(2),
          );
          this.currentModelDimensions.height = parseFloat(
            (newDimensions.height * this.modelScale).toFixed(2),
          );
          this.currentModelDimensions.depth = parseFloat(
            (newDimensions.depth * this.modelScale).toFixed(2),
          );

          console.log("ModelDimensions updated:", this.currentModelDimensions);

          // If model is loaded, recalculate scale based on new dimensions
          if (this.model && this.modelBoundingBox) {
            this.setupModelBounds();
            this.applyModelScale();
          }
        }
      },
      deep: true,
    },
  },
  mounted() {
    if (this.glbUrl && this.glbUrl !== "") {
      // Initialize currentModelDimensions from props
      this.currentModelDimensions = {
        width: parseFloat(this.modelDimensions.width),
        height: parseFloat(this.modelDimensions.height),
        depth: parseFloat(this.modelDimensions.depth),
      };

      this.$nextTick(() => {
        this.handleGlbUrlChange();
        this.load_the_fileData();
      });
    }
  },

  beforeUnmount() {
    this.cleanup();
  },

  methods: {
    scaleUp() {
      if (!this.model || this.modelScale >= this.maxScale) return;
      this.modelScale = Math.min(
        this.maxScale,
        this.modelScale + this.scaleStep,
      );

      // Update the dimension display
      this.currentModelDimensions.width = (
        this.modelDimensions.width * this.modelScale
      ).toFixed(2);
      this.currentModelDimensions.height = (
        this.modelDimensions.height * this.modelScale
      ).toFixed(2);
      this.currentModelDimensions.depth = (
        this.modelDimensions.depth * this.modelScale
      ).toFixed(2);

      this.applyModelScale();
    },

    scaleDown() {
      if (!this.model || this.modelScale <= this.minScale) return;
      this.modelScale = Math.max(
        this.minScale,
        this.modelScale - this.scaleStep,
      );

      // Update the dimension display
      this.currentModelDimensions.width = (
        this.modelDimensions.width * this.modelScale
      ).toFixed(2);
      this.currentModelDimensions.height = (
        this.modelDimensions.height * this.modelScale
      ).toFixed(2);
      this.currentModelDimensions.depth = (
        this.modelDimensions.depth * this.modelScale
      ).toFixed(2);

      this.applyModelScale();
    },

    applyModelScale() {
      if (!this.model || !this.modelBoundingBox) return;

      // Apply the combined scale (base scale * user scale)
      const finalScale = this.baseModelScale * this.modelScale;
      this.model.scale.setScalar(finalScale);

      // Get the current world position before we recalculate
      const currentWorldPos = this.model.position.clone();

      // Update bounding box for accurate positioning
      this.modelBoundingBox.setFromObject(this.model);
      this.modelSize = this.modelBoundingBox.getSize(new THREE.Vector3());

      // IMPORTANT: Calculate the model's bottom in LOCAL space (before scaling affected it)
      // The bounding box min.y is in local space, so we need to account for the actual scale
      const modelBottomLocal = this.modelBoundingBox.min.y;

      // Get the floor height at the model's current X, Z position
      const floorY = this.getFloorHeightAtPosition(currentWorldPos);

      // Position the model so its bottom touches the floor
      // We place the model's origin at: floorHeight - (modelBottomLocal * finalScale)
      // This ensures the actual bottom of the scaled model sits on the floor
      const modelBottomWorldOffset = modelBottomLocal * finalScale;
      this.model.position.y = floorY - modelBottomWorldOffset;

      // Keep X and Z positions unchanged
      this.model.position.x = currentWorldPos.x;
      this.model.position.z = currentWorldPos.z;

      // Update rotation ring size
      this.updateRotationRingPosition();
    },

    async load_the_fileData() {
      try {
        const response = await fetch(this.floor_3d_model_grid);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.floorData = await response.json();
      } catch (error) {
        console.error("Error loading floor data:", error);
      }
    },

    // // Replace your existing renderItem method with this:
    // async renderItem() {
    //   if (!this.model || !this.currentBackgroundTexture) {
    //     console.warn("Model or background not loaded");
    //     return;
    //   }

    //   try {
    //     this.loadingProxy= true;
    //     this.loadingText = 'Rendering Item...';

    //     const roomId = this.$route.params.id;
    //     const prod_id = this.product_id;
    //     const url = `${this.$store.state.root_api}engine/inpaint-item-ref/`;

    //     // Use original background image dimensions
    //     const bgWidth = this.currentBackgroundTexture.image.width;
    //     const bgHeight = this.currentBackgroundTexture.image.height;

    //     console.log(`Rendering at dimensions: ${bgWidth}x${bgHeight}`);

    //     this.loadingText = 'Creating composite image...';
    //     // Create composite by rendering 3D object and blending with background
    //     const compositeBlob = await this.createCompositeImageBlob(bgWidth, bgHeight);

    //     this.loadingText = 'Creating binary mask...';
    //     // Create binary mask at same resolution
    //     const maskBlob = await this.createBinaryMaskBlob(bgWidth, bgHeight);

    //     // Prepare form data with BOTH images
    //     const formData = new FormData();
    //     formData.append('composite_image', compositeBlob, 'composite_image.png');
    //     formData.append('binary_mask', maskBlob, 'binary_mask.png');
    //     formData.append('room_id', roomId);
    //     formData.append('prod_id', prod_id);

    //     this.loadingText = 'Adding Product to Your Room...';

    //     const response = await fetch(url, {
    //       method: 'POST',
    //       headers: {
    //         'Authorization': `Token ${localStorage.getItem('token')}`,
    //       },
    //       body: formData
    //     });

    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }

    //     const result = await response.json();
    //     this.$emit('rendered-comfyui-workflow', result.final_output);

    //     console.log('Composite image and binary mask sent successfully:', result);
    //     console.log(`Images generated with dimensions: ${bgWidth}x${bgHeight}`);

    //     return result;

    //   } catch (error) {
    //     console.error('Error rendering item:', error);
    //     throw error;
    //   } finally {
    //     this.loadingProxy= false;
    //   }
    // },
    remove3DObjectFromScene() {
      if (!this.scene) return;

      // Remove model
      if (this.model) {
        this.scene.remove(this.model);
        this.model.traverse((child) => {
          if (child.isMesh) {
            child.geometry?.dispose();
            if (child.material?.map) child.material.map.dispose();
            child.material?.dispose();
          }
        });
        this.model = null;
      }

      // Remove rotation ring
      if (this.rotationRing) {
        this.scene.remove(this.rotationRing);
        this.rotationRing = null;
        this.rotationArrows = [];
      }

      // Optional: hide grid
      if (this.gridHelper) {
        this.gridHelper.visible = false;
      }

      this.modelLoaded = false;

      console.log("✅ 3D object removed from scene");
    },

    // Replace your existing renderItem method with this:
    async renderItem() {
      if (!this.model || !this.currentBackgroundTexture) {
        console.warn("Model or background not loaded");
        return;
      }

      try {
        this.$emit("update:isLoading", true);

        this.loadingText = "Rendering Item...";

        const roomId = this.$route.params.id;
        const prod_id = this.product_id;
        const url = `${this.$store.state.root_api}engine/inpaint-item-ref/`;

        // Use original background image dimensions
        const bgWidth = this.currentBackgroundTexture.image.width;
        const bgHeight = this.currentBackgroundTexture.image.height;

        console.log(`Rendering at dimensions: ${bgWidth}x${bgHeight}`);

        this.loadingText = "Creating composite image...";
        // Create composite by rendering 3D object and blending with background
        const compositeBlob = await this.createCompositeImageBlob(
          bgWidth,
          bgHeight,
        );

        this.loadingText = "Creating binary mask...";
        // Create binary mask at same resolution
        const maskBlob = await this.createBinaryMaskBlob(bgWidth, bgHeight);

        // Prepare form data with BOTH images
        const formData = new FormData();
        formData.append(
          "composite_image",
          compositeBlob,
          "composite_image.png",
        );
        formData.append("binary_mask", maskBlob, "binary_mask.png");
        formData.append("room_id", roomId);
        formData.append("prod_id", prod_id);

        this.loadingText = "Adding Product to Your Room...";

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        if (response.status == 402) {
          const result = await response.json();
          this.$emit("insufficient-credits", result.msg);
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("====================================");
        console.log(result);
        console.log("====================================");
        if (result.renderer_id) {
          this.remove3DObjectFromScene();
          this.$emit(
            "add-3d-furniture-to-room-start-polling",
            result.renderer_id,
          );
        }

        // 🔥 REMOVE 3D OBJECT AFTER SUCCESSFUL RENDER

        console.log(
          "Composite image and binary mask sent successfully:",
          result,
        );
        console.log(`Images generated with dimensions: ${bgWidth}x${bgHeight}`);

        return result;
      } catch (error) {
        console.error("Error rendering item:", error);
        throw error;
      }
      // finally {
      //   this.$emit('update:isLoading', false);
      // }
    },

    // Replace your existing renderItem method with this:
    async switchFurniture() {
      if (!this.model || !this.currentBackgroundTexture) {
        console.warn("Model or background not loaded");
        return;
      }
      try {
        this.$emit("update:isLoading", true);

        this.remove3DObjectFromScene();

        this.loadingText = "Rendering Item...";

        const roomId = this.$route.params.id;
        const prod_id = this.product_id;
        const url = `${this.$store.state.root_api}engine/switch-furniture-ref/`;

        // Prepare form data with BOTH images
        const formData = new FormData();
        formData.append("room_id", roomId);
        formData.append("prod_id", prod_id);

        this.loadingText = "Switching Product of Your Room...";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: formData,
        });
        this.remove3DObjectFromScene();
        if (response.status == 402) {
          const result = await response.json();
          this.$emit("insufficient-credits", result.msg);
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result?.renderer_id) {
          this.$emit('add-3d-furniture-to-room-start-polling', result.renderer_id);
        }

        this.$emit("rendered-comfyui-workflow", result.final_output);

        // console.log(
        //   "Composite image and binary mask sent successfully:",
        //   result,
        // );
        // console.log(`Images generated with dimensions: ${bgWidth}x${bgHeight}`);

        return result;
      } catch (error) {
        console.error("Error rendering item:", error);
        throw error;
      } finally {
        // this.$emit("update:isLoading", false);
      }
    },

    // NEW METHOD: Create composite with 3D object and transparent background
    async createCompositeImageBlob(bgWidth, bgHeight) {
      // Create canvas for 3D object rendering (transparent background)
      const objectCanvas = document.createElement("canvas");
      objectCanvas.width = bgWidth;
      objectCanvas.height = bgHeight;

      const objectRenderer = new THREE.WebGLRenderer({
        canvas: objectCanvas,
        antialias: true,
        preserveDrawingBuffer: true,
        alpha: true,
        precision: "highp", // Better quality
      });
      objectRenderer.setSize(bgWidth, bgHeight);
      objectRenderer.setPixelRatio(1);
      objectRenderer.outputColorSpace = THREE.SRGBColorSpace;
      objectRenderer.setClearColor(0x000000, 0); // Transparent background
      objectRenderer.shadowMap.enabled = true;
      objectRenderer.shadowMap.type = THREE.PCFShadowMap;

      // Create scene with only the 3D model
      const objectScene = new THREE.Scene();

      // Clone the model
      const modelClone = this.model.clone();
      objectScene.add(modelClone);

      // Enhanced lighting for more brightness and clarity (matching initializeLighting)
      const hemisphereLight = new THREE.HemisphereLight(
        0xffffff,
        0x444444,
        1.9,
      );
      objectScene.add(hemisphereLight);

      // Main directional light - BRIGHTER
      const dirLight = new THREE.DirectionalLight(0xffffff, 9);
      dirLight.position.set(10, 15, 5);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 4096;
      dirLight.shadow.mapSize.height = 4096;
      dirLight.shadow.camera.near = 0.1;
      dirLight.shadow.camera.far = 50;
      dirLight.shadow.camera.left = -30;
      dirLight.shadow.camera.right = 30;
      dirLight.shadow.camera.top = 30;
      dirLight.shadow.camera.bottom = -30;
      objectScene.add(dirLight);

      // Fill light - BRIGHTER
      const fillLight = new THREE.DirectionalLight(0xffffff, 1.8);
      fillLight.position.set(-10, 5, -5);
      objectScene.add(fillLight);

      // Key light from different angle - BRIGHTER
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
      keyLight.position.set(5, 10, 10);
      objectScene.add(keyLight);

      // Rim light for edge definition - BRIGHTER
      const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
      rimLight.position.set(-5, 5, -10);
      objectScene.add(rimLight);

      // Additional bright fill light for extra brightness
      const extraFillLight = new THREE.DirectionalLight(0xffffff, 1.2);
      extraFillLight.position.set(8, 8, 8);
      objectScene.add(extraFillLight);

      // Point light for close-range illumination
      const pointLight = new THREE.PointLight(0xffffff, 1.5, 150);
      pointLight.position.set(12, 12, 12);
      objectScene.add(pointLight);

      // Use exact camera from viewer
      const objectCamera = this.camera.clone();
      objectCamera.aspect = bgWidth / bgHeight;
      objectCamera.updateProjectionMatrix();

      // Render the 3D object with transparent background
      objectRenderer.render(objectScene, objectCamera);

      // Get image data and convert to PNG blob directly
      const blob = await new Promise((resolve) => {
        objectCanvas.toBlob(resolve, "image/png");
      });

      objectRenderer.dispose();
      return blob;
    },

    // UPDATED: Create binary mask at original dimensions
    async createBinaryMaskBlob(bgWidth, bgHeight) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = bgWidth;
      tempCanvas.height = bgHeight;

      const tempRenderer = new THREE.WebGLRenderer({
        canvas: tempCanvas,
        antialias: true,
        preserveDrawingBuffer: true,
      });
      tempRenderer.setSize(bgWidth, bgHeight);
      tempRenderer.setPixelRatio(1); // Don't use device pixel ratio
      tempRenderer.setClearColor(0x000000, 1); // Black background

      const tempScene = new THREE.Scene();

      // Clone the model for mask
      const modelClone = this.model.clone();
      tempScene.add(modelClone);

      // Add basic lighting
      tempScene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 1.0));
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
      dirLight.position.set(10, 15, 5);
      tempScene.add(dirLight);

      // Create white material for all meshes
      modelClone.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        }
      });

      // Use same camera
      const tempCamera = this.camera.clone();
      tempCamera.aspect = bgWidth / bgHeight;
      tempCamera.updateProjectionMatrix();

      tempRenderer.render(tempScene, tempCamera);

      const blob = await new Promise((resolve) => {
        tempCanvas.toBlob(resolve, "image/png");
      });

      tempRenderer.dispose();
      return blob;
    },
    async handleGlbUrlChange() {
      try {
        this.resetComponentState();
        this.$emit("update:isLoading", true);
        this.loadingText = "Initializing 3D Viewer...";
        await this.$nextTick();

        if (!this.viewerInitialized) {
          await this.initializeViewer();
        } else {
          await this.reinitializeWithNewModel();
        }
      } catch (error) {
        console.error("Error handling glbUrl change:", error);
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
      this.loadingText = "Loading new model...";
      this.$emit("update:isLoading", false);
      await this.loadModel();
      this.fitCameraToModel();
      // Recreate rotation ring for new model
      this.createRotationRing();
      this.updateRotationRingPosition();

      this.fitCameraToModel();
      this.$emit("update:isLoading", false);
    },

    async initializeViewer() {
      await this.$nextTick();
      const container = this.$refs.viewer;

      if (!container) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return this.initializeViewer();
      }

      try {
        this.$emit("update:isLoading", true);
        this.loadingText = "Setting up 3D environment...";

        this.parseFloorData();
        this.initializeScene(container);
        this.initializeBackground();
        this.initializeLighting();

        this.loadingText = "Creating floor...";
        this.createFloorFromJSON();
        this.createVisualGrid();

        this.initializeControls();
        this.initializeDragControls();
        this.createRotationRing();

        this.loadingText = "Loading 3D model...";
        await this.loadModel();

        window.addEventListener("resize", this.onWindowResize);
        this.animate();
        this.viewerInitialized = true;
      } catch (error) {
        console.error("Error initializing viewer:", error);
        this.showErrorState();
      }
    },

    parseFloorData() {
      const fd = this.floorData;

      this.planeEquation = {
        a: fd.floor_plane.equation[0],
        b: fd.floor_plane.equation[1],
        c: fd.floor_plane.equation[2],
        d: fd.floor_plane.equation[3],
      };

      this.floorNormal.set(
        fd.floor_plane.normal[0],
        fd.floor_plane.normal[1],
        fd.floor_plane.normal[2],
      );

      this.floorPoint.set(
        fd.floor_plane.center[0],
        fd.floor_plane.center[1],
        fd.floor_plane.center[2],
      );

      this.floorBounds = {
        min: new THREE.Vector3(...fd.floor_bounds.min),
        max: new THREE.Vector3(...fd.floor_bounds.max),
      };

      // FIX: Handle missing floor_boundary
      if (fd.floor_boundary) {
        this.floorBoundary = fd.floor_boundary.map(
          (p) => new THREE.Vector3(p[0], p[1], p[2]),
        );
      } else if (fd.floor_mesh && fd.floor_mesh.vertices) {
        // Use floor mesh vertices as boundary if no explicit boundary provided
        this.floorBoundary = fd.floor_mesh.vertices.map(
          (v) => new THREE.Vector3(v[0], v[1], v[2]),
        );
      } else {
        this.floorBoundary = [];
      }

      console.log("Floor data parsed:");
      console.log("  Normal:", this.floorNormal);
      console.log("  Center:", this.floorPoint);
      console.log("  Height:", fd.floor_plane.height);
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
        1000,
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

      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      const ctx = canvas.getContext("2d");

      const gradient = ctx.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(0, "#f5f5f5");
      gradient.addColorStop(1, "#e0e0e0");
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
        },
      );
    },

    initializeLighting() {
      // Ambient light for overall brightness
      this.scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.9));

      // Main directional light
      const dirLight = new THREE.DirectionalLight(0xffffff, 9);
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
      const fillLight = new THREE.DirectionalLight(0xffffff, 1.8);
      fillLight.position.set(-10, 5, -5);
      this.scene.add(fillLight);

      // Key light from different angle
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
      keyLight.position.set(5, 10, 10);
      this.scene.add(keyLight);

      // Rim light for edge definition
      const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
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
        this.floorPoint.z - 20, // Look 3 meters ahead
      );

      this.controls.target.copy(lookAtPoint);
      this.controls.update();
    },

    initializeDragControls() {
      const canvas = this.renderer.domElement;
      // Mouse Events
      canvas.addEventListener("mousedown", this.onMouseDown);
      canvas.addEventListener("mousemove", this.onMouseMove);
      canvas.addEventListener("mouseup", this.onMouseUp);
      canvas.addEventListener("mouseleave", this.onMouseUp);
      // Touch Events (MOBILE SUPPORT)
      canvas.addEventListener("touchstart", this.onMouseDown, {
        passive: false,
      });
      canvas.addEventListener("touchmove", this.onMouseMove, {
        passive: false,
      });
      canvas.addEventListener("touchend", this.onMouseUp);
      canvas.addEventListener("touchcancel", this.onMouseUp);
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

        faces.forEach((face) => {
          const v1 = vertices[face[0]];
          const v2 = vertices[face[1]];
          const v3 = vertices[face[2]];

          positions.push(v1[0], v1[1], v1[2]);
          positions.push(v2[0], v2[1], v2[2]);
          positions.push(v3[0], v3[1], v3[2]);
        });

        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(positions, 3),
        );
        geometry.computeVertexNormals();

        const floorMaterial = new THREE.MeshLambertMaterial({
          color: 0xcccccc,
          transparent: true,
          opacity: this.floorShadow_area_opacity,
          side: THREE.DoubleSide,
        });

        this.floorPlane = new THREE.Mesh(geometry, floorMaterial);
        this.floorPlane.name = "dragFloor";
        this.gridGroup.add(this.floorPlane);
      } else {
        // Fallback to plane
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floorMaterial = new THREE.MeshLambertMaterial({
          color: 0xcccccc,
          transparent: true,
          opacity: 0.0,
          side: THREE.DoubleSide,
        });

        this.floorPlane = new THREE.Mesh(floorGeometry, floorMaterial);

        const up = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          up,
          this.floorNormal,
        );
        this.floorPlane.quaternion.copy(quaternion);
        this.floorPlane.position.copy(this.floorPoint);
        this.floorPlane.name = "dragFloor";
        this.gridGroup.add(this.floorPlane);
      }

      this.dragPlane.setFromNormalAndCoplanarPoint(
        this.floorNormal,
        this.floorPoint,
      );
    },
    // Replace your createVisualGrid method with this:
    createVisualGrid() {
      if (this.gridHelper) this.gridGroup.remove(this.gridHelper);

      // Create grid lines from backend data
      if (this.floorData.grid_lines && this.floorData.grid_lines.length > 0) {
        const gridGeometry = new THREE.BufferGeometry();
        const gridVertices = [];

        this.floorData.grid_lines.forEach((line) => {
          gridVertices.push(
            line.start[0],
            line.start[1],
            line.start[2],
            line.end[0],
            line.end[1],
            line.end[2],
          );
        });

        gridGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(gridVertices, 3),
        );
        const gridMaterial = new THREE.LineBasicMaterial({
          color: 0x888888,
          transparent: true,
          opacity: 0.4,
        });

        this.gridHelper = new THREE.LineSegments(gridGeometry, gridMaterial);
        this.gridHelper.visible = this.showGrid;
        this.gridGroup.add(this.gridHelper);
      }
    },

    createRotationRing() {
      this.rotationRing = new THREE.Group();
      this.rotationRing.name = "rotationRing";

      const ringGeometry = new THREE.RingGeometry(0.8, 0.85, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        depthTest: true, // ← Change from false to true
        depthWrite: true, // ← Add this
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = -Math.PI / 2;
      ring.name = "rotationRingMesh";
      this.rotationRing.add(ring);

      // Create 4 rotation arrows
      const arrowPositions = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

      arrowPositions.forEach((angle, index) => {
        const arrowGroup = this.createRotationArrow(angle, index);
        this.rotationRing.add(arrowGroup);
        this.rotationArrows.push(arrowGroup);
      });

      this.rotationRing.visible = this.showRotationRing;
      this.rotationRing.renderOrder = 999; // Render on top
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
        originalColor: 0x00ff88,
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
    },
    async loadModel() {
      if (!this.glbUrl || this.glbUrl === "") {
        console.warn("No glbUrl provided");
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        this.loadingText = "Loading 3D Model...";

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
            this.updateRotationRingPosition();
            this.fitCameraToModel();

            this.$emit("update:isLoading", false);
            this.modelLoaded = true;
            console.log("Model loaded successfully");
            resolve();
          },
          (progress) => {
            if (progress.total > 0) {
              const percentage = Math.round(
                (progress.loaded / progress.total) * 100,
              );
              this.loadingText = `Loading Model... ${percentage}%`;
            }
          },
          (error) => {
            console.error("Failed to load model", error);
            this.$emit("update:isLoading", false);
            this.modelLoaded = false;
            reject(error);
          },
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

      // console.log('=== MODEL SETUP DEBUG ===');
      // console.log('Model size:', this.modelSize);
      // console.log('Model bounds:', this.modelBoundingBox);
      // console.log('Model bounds min.y:', this.modelBoundingBox.min.y);
      // console.log('Model bounds max.y:', this.modelBoundingBox.max.y);
      // console.log('Model position after centering:', this.model.position);
    },
    positionModelOnFloor() {
      if (!this.model) return;

      const floorY = this.floorData.floor_plane.height;

      // Place model 3-4 meters in front of camera
      this.model.position.x = 0;
      this.model.position.z = -3.5; // Negative Z = in front of camera

      const modelBottom = this.modelBoundingBox.min.y * this.baseModelScale;
      this.model.position.y = floorY - modelBottom;

      console.log("Model positioned at:", this.model.position);
      console.log("Floor height:", floorY);
      console.log("Camera height:", this.camera.position.y);
    },
    screenToWorld(screenX, screenY) {
      // screenX, screenY are normalized (0 to 1)
      // Convert to Three.js NDC space (-1 to 1)
      const mouse = new THREE.Vector2(
        screenX * 2 - 1,
        -(screenY * 2 - 1), // Flip Y axis
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
      if (
        worldPos.x < this.floorBounds.min.x ||
        worldPos.x > this.floorBounds.max.x
      ) {
        return false;
      }
      if (
        worldPos.z < this.floorBounds.min.z ||
        worldPos.z > this.floorBounds.max.z
      ) {
        return false;
      }

      return true;
    },

    onMouseDown(event) {
      event.preventDefault();
      let clientX, clientY;
      if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }
      const mouse = new THREE.Vector2();
      const rect = this.renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(mouse, this.camera);
      // -----------------------------------------------
      // ROTATION ARROWS
      // -----------------------------------------------
      if (this.rotationRing && this.showRotationRing) {
        const arrowIntersects = this.raycaster.intersectObject(
          this.rotationRing,
          true,
        );
        if (arrowIntersects.length > 0) {
          const hitPoint = arrowIntersects[0].point.clone();
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
      // -----------------------------------------------
      // MODEL DRAGGING
      // -----------------------------------------------
      if (this.model) {
        const intersects = this.raycaster.intersectObject(this.model, true);
        if (intersects.length > 0) {
          this.controls.enabled = false;
          this.isDraggingModel = true;
          this.isDragging = true;
          this.dragStartMouse.copy(mouse);
          this.dragStartPosition.set(
            this.model.position.x,
            this.model.position.z,
          );
          // -----------------------------------------------
          // :white_check_mark: FIX: Keep pointer coordinate locked to same spot
          // -----------------------------------------------
          const hitPoint = intersects[0].point.clone();
          // Ground plane for drag
          this.dragPlane = new THREE.Plane();
          this.dragPlane.setFromNormalAndCoplanarPoint(
            new THREE.Vector3(0, 1, 0),
            hitPoint,
          );
          // Store offset between model origin & hit point
          this.dragOffset = new THREE.Vector3().subVectors(
            hitPoint,
            this.model.position,
          );
          // -----------------------------------------------
          return;
        }
      }
    },
    onMouseMove(event) {
      if (!this.isDraggingModel && !this.isRotatingModel) return;
      event.preventDefault();
      // READ POINTER (mouse / touch)
      let clientX, clientY;
      if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }
      const mouse = new THREE.Vector2();
      const rect = this.renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      // MODEL DRAGGING

      if (this.isDraggingModel) {
        this.raycaster.setFromCamera(mouse, this.camera);
        const worldPoint = new THREE.Vector3();

        if (this.raycaster.ray.intersectPlane(this.dragPlane, worldPoint)) {
          worldPoint.sub(this.dragOffset);

          this.model.position.x = worldPoint.x;
          this.model.position.z = worldPoint.z;

          // FIXED: Use the same calculation as applyModelScale
          const { a, b, c, d } = this.planeEquation;
          let floorY;
          if (Math.abs(b) > 0.001) {
            floorY = -(a * worldPoint.x + c * worldPoint.z + d) / b;
          } else {
            floorY = this.floorData.floor_plane.height;
          }

          // FIXED: Account for current model scale when positioning
          const finalScale = this.baseModelScale * this.modelScale;
          const modelBottomWorldOffset =
            this.modelBoundingBox.min.y * finalScale;
          this.model.position.y = floorY - modelBottomWorldOffset;

          this.updateRotationRingPosition();
          this.isOnValidFloor = true;
        }
      }

      // ------------------------------------------------------------
      // MODEL ROTATION
      // ------------------------------------------------------------
      else if (this.isRotatingModel) {
        const deltaX = mouse.x - this.rotationStartMouse.x;
        this.modelRotation.y = this.rotationStartAngle + deltaX * 180;
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

        this.rotationArrows.forEach((group) => {
          group.children.forEach((arrow) => {
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
      const bgMat = new THREE.MeshBasicMaterial({
        map: texture,
        depthTest: false,
      });

      if (this.bgMesh) this.backgroundScene.remove(this.bgMesh);

      this.bgMesh = new THREE.Mesh(bgGeo, bgMat);
      this.bgMesh.position.z = -1;
      this.backgroundScene.add(this.bgMesh);
    },

    reset_entire_room() {
      if (!this.model) return;

      // Reset scale
      this.modelScale = 1.0;

      // Reset dimensions to original
      this.currentModelDimensions = {
        width: this.modelDimensions.width,
        height: this.modelDimensions.height,
        depth: this.modelDimensions.depth,
      };

      const initialPos = this.floorPoint.clone();
      this.model.position.x = initialPos.x;
      this.model.position.z = initialPos.z;

      const floorY = this.getFloorHeightAtPosition(initialPos);

      const finalScale = this.baseModelScale * this.modelScale;
      const modelBottomWorldOffset = this.modelBoundingBox.min.y * finalScale;
      this.model.position.y = floorY - modelBottomWorldOffset;

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

      if (
        this.renderer &&
        this.backgroundScene &&
        this.backgroundCamera &&
        this.scene &&
        this.camera
      ) {
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
      this.$emit("update:isLoading", false);
      this.loadingText = "Error loading model";
      this.modelLoaded = false;
      console.error("An error occurred in the 3D viewer");
    },

    cleanup() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }

      window.removeEventListener("resize", this.onWindowResize);

      if (this.renderer) {
        const canvas = this.renderer.domElement;
        canvas.removeEventListener("mousedown", this.onMouseDown);
        canvas.removeEventListener("mousemove", this.onMouseMove);
        canvas.removeEventListener("mouseup", this.onMouseUp);
        canvas.removeEventListener("mouseleave", this.onMouseUp);

        canvas.removeEventListener("touchstart", this.onMouseDown);
        canvas.removeEventListener("touchmove", this.onMouseMove);
        canvas.removeEventListener("touchend", this.onMouseUp);
        canvas.removeEventListener("touchcancel", this.onMouseUp);

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
      // this.$emit('update:isLoading', false);
    },
  },
};
</script>

<style scoped>
.content-area {
  width: 100%;
  height: 100%;
  position: relative;
}
.main-canvas {
  display: block;
  margin: 0 auto;
  width: 100%;
  height: 82vh;
  position: relative;
  text-align: center;
}

#viewer {
  position: relative;
  top: 0;
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
  content: "";
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
    rgba(0, 102, 255, 1) 0%,
    rgba(0, 102, 255, 0.4) 20%,
    rgba(0, 102, 255, 0.3) 30%,
    rgba(0, 102, 255, 0.2) 35%,
    rgba(0, 102, 255, 0.15) 40%,
    rgba(0, 102, 255, 0.1) 50%,
    rgba(0, 102, 255, 0) 100%
  );
  animation:
    moveWaveLeftToRight 3s linear infinite,
    waveFade 3s ease-in-out infinite;
  z-index: 2;
}

@keyframes moveWaveLeftToRight {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(50%);
  }
}

@keyframes waveFade {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
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
@media screen and (min-width: 768px) {
  #viewer {
    height: 100%;
  }
}
</style>
