<!-- Key fixes for touch device composite image rendering:

1. Added proper touch event handling with preventDefault
2. Force render update after touch interactions end
3. Ensure model position/rotation are applied before capturing composite
4. Added debounced position update to handle rapid touch movements
5. Fixed renderer size to match actual display dimensions

Changes marked with 🔧 comments -->

<template>
  <div
    class="main-canvas max-h-[300px] md:max-h-[95vh] mx-auto"
    ref="canvasContainer"
  >
    <!-- LOADING OVERLAY -->
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

    <!-- CONTENT AREA -->
    <div v-show="!isLoading" class="content-area">
      <!-- Show background image when no GLB -->
      <div
        v-if="!glbUrl || glbUrl === ''"
        class="text-center flex items-center justify-center text-gray-600"
      >
        <img
          :src="baseImageUrl"
          alt=""
          class="max-w-full max-h-[54vh] md:max-h-[80vh] mx-auto"/>
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
      " >
      Re-center
    </button>

    <!-- Center: Scale Controls -->
    <div class="flex items-center gap-2" v-show="is_resizable">
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
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

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
      modelScale: 1.0,
      // 🔧 NEW: Store actual 3D position/rotation for rendering
      lastKnownModelPosition: null,
      lastKnownModelRotation: null,
      lastKnownModelScale: null,
      minScale: 0.5,
      maxScale: 3.0,
      scaleStep: 0.02,
      currentModelDimensions: {
        width: 0,
        height: 0,
        depth: 0,
      },
      // 🔧 NEW: Track if we need to update rendering after touch interaction
      needsRenderUpdate: false,
      // 🔧 NEW: Debounce timer for position updates
      positionUpdateTimer: null,
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

    this.planeEquation = null;
    this.floorBoundary = null;
    this.floorBounds = null;
    this.baseModelScale = 1.0;
  },

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
          this.currentModelDimensions.width = parseFloat(
            (newDimensions.width * this.modelScale).toFixed(2),
          );
          this.currentModelDimensions.height = parseFloat(
            (newDimensions.height * this.modelScale).toFixed(2),
          );
          this.currentModelDimensions.depth = parseFloat(
            (newDimensions.depth * this.modelScale).toFixed(2),
          );

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
    // 🔧 Clear any pending timers
    if (this.positionUpdateTimer) {
      clearTimeout(this.positionUpdateTimer);
    }
    this.cleanup();
  },

  methods: {
    restoreModelTransform(transform) {
  if (!transform || !this.model) return;
  
  // Restore position
  this.lastKnownModelPosition = new THREE.Vector3(
    transform.position.x,
    transform.position.y,
    transform.position.z
  );
  
  // 🔧 Restore rotation with all axes
  this.lastKnownModelRotation = new THREE.Euler(
    transform.rotation.x,
    transform.rotation.y,
    transform.rotation.z
  );
  
  // Restore scale
  this.lastKnownModelScale = new THREE.Vector3(
    transform.scale.x,
    transform.scale.y,
    transform.scale.z
  );
  
  console.log('🔄 Restored transform from parent:');
  console.log('  Position:', transform.position);
  console.log('  Rotation (radians):', transform.rotation);
  console.log('  Rotation (degrees):', {
    x: THREE.MathUtils.radToDeg(transform.rotation.x).toFixed(2),
    y: THREE.MathUtils.radToDeg(transform.rotation.y).toFixed(2),
    z: THREE.MathUtils.radToDeg(transform.rotation.z).toFixed(2)
  });
  console.log('  Scale:', transform.scale);
},
    scaleUp() {
      if (!this.model || this.modelScale >= this.maxScale) return;
      this.modelScale = Math.min(
        this.maxScale,
        this.modelScale + this.scaleStep,
      );

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
      this.needsRenderUpdate = true; // 🔧 Mark for update
    },

    scaleDown() {
      if (!this.model || this.modelScale <= this.minScale) return;
      this.modelScale = Math.max(
        this.minScale,
        this.modelScale - this.scaleStep,
      );

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
      this.needsRenderUpdate = true; // 🔧 Mark for update
    },

    applyModelScale() {
      if (!this.model || !this.modelBoundingBox) return;

      const finalScale = this.baseModelScale * this.modelScale;
      this.model.scale.setScalar(finalScale);

      const currentWorldPos = this.model.position.clone();
      this.modelBoundingBox.setFromObject(this.model);
      this.modelSize = this.modelBoundingBox.getSize(new THREE.Vector3());

      const modelBottomLocal = this.modelBoundingBox.min.y;
      const floorY = this.getFloorHeightAtPosition(currentWorldPos);
      const modelBottomWorldOffset = modelBottomLocal * finalScale;
      this.model.position.y = floorY - modelBottomWorldOffset;
      this.model.position.x = currentWorldPos.x;
      this.model.position.z = currentWorldPos.z;

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

    remove3DObjectFromScene() {
      if (!this.scene) return;

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

      if (this.rotationRing) {
        this.scene.remove(this.rotationRing);
        this.rotationRing = null;
        this.rotationArrows = [];
      }

      if (this.gridHelper) {
        this.gridHelper.visible = false;
      }

      this.modelLoaded = false;
      console.log("✅ 3D object removed from scene");
    },

    // // 🔧 FIXED: Ensure model updates are applied before rendering
//     async renderItem() {
//       if (!this.model || !this.currentBackgroundTexture) {
//         console.warn("Model or background not loaded");
//         return;
//       }

//       try {
//         // 🔧 CRITICAL: Use last known position if available (from drag/rotate)
//         let currentPosition, currentRotation, currentScale;
        
//         if (this.lastKnownModelPosition && this.lastKnownModelRotation && this.lastKnownModelScale) {
//           console.log("🔄 Using LAST KNOWN position from drag/rotate");
//           currentPosition = this.lastKnownModelPosition.clone();
//           currentRotation = this.lastKnownModelRotation.clone();
//           currentScale = this.lastKnownModelScale.clone();
          
//           // 🔧 Apply the last known position to model (in case it was reset)
//           this.model.position.copy(currentPosition);
//           this.model.rotation.copy(currentRotation);
//           this.model.scale.copy(currentScale);
//         } else {
//           console.log("⚠️ No last known position, using current model state");
//           currentPosition = this.model.position.clone();
//           currentRotation = this.model.rotation.clone();
//           currentScale = this.model.scale.clone();
//         }
        
//         console.log(`📸 CAPTURED model state - Position: x=${currentPosition.x.toFixed(2)}, y=${currentPosition.y.toFixed(2)}, z=${currentPosition.z.toFixed(2)}`);
//         console.log(`📸 CAPTURED model state - Rotation: ${currentRotation.y.toFixed(2)} radians`);
        
//         // 🔧 Force a render cycle to ensure all updates are applied
//         await this.$nextTick();
//         if (this.renderer && this.scene && this.camera) {
//           this.renderer.render(this.scene, this.camera);
//         }

//         // 🔧 CRITICAL: Restore model state in case it changed during $nextTick
//         this.model.position.copy(currentPosition);
//         this.model.rotation.copy(currentRotation);
//         this.model.scale.copy(currentScale);

//         // 🔧 Get actual canvas dimensions - use clientWidth/clientHeight if canvas dimensions are 0
//         const canvas = this.renderer.domElement;
//         let renderWidth = canvas.width;
//         let renderHeight = canvas.height;

//         // Fallback to background texture dimensions if canvas is not properly sized
//         if (renderWidth === 0 || renderHeight === 0) {
//           console.warn("Canvas not properly sized, using background texture dimensions");
//           if (this.currentBackgroundTexture && this.currentBackgroundTexture.image) {
//             renderWidth = this.currentBackgroundTexture.image.width;
//             renderHeight = this.currentBackgroundTexture.image.height;
//           } else {
//             // Last resort: use container dimensions
//             const container = this.$refs.viewer;
//             if (container) {
//               renderWidth = container.clientWidth || 800;
//               renderHeight = container.clientHeight || 600;
//             } else {
//               renderWidth = 800;
//               renderHeight = 600;
//             }
//           }
//         }

//         console.log(`Rendering at dimensions: ${renderWidth}x${renderHeight}`);
//         console.log(`🔍 BEFORE RENDER - Model position: x=${this.model.position.x.toFixed(2)}, y=${this.model.position.y.toFixed(2)}, z=${this.model.position.z.toFixed(2)}`);
//         console.log(`🔍 BEFORE RENDER - Model rotation: ${this.model.rotation.y.toFixed(2)} radians (${THREE.MathUtils.radToDeg(this.model.rotation.y).toFixed(2)} degrees)`);
//         console.log(`🔍 BEFORE RENDER - Model scale: ${this.model.scale.x.toFixed(2)}`);

//         this.loadingText = "Creating composite image...";
//         const compositeBlob = await this.createCompositeImageBlob(
//           renderWidth,
//           renderHeight,
//         );

//         // 🔧 Validate blob before creating URL
//         if (!compositeBlob || compositeBlob.size === 0) {
//           throw new Error("Failed to create composite image blob");
//         }

//         // Download composite image
//         let downloadUrl = URL.createObjectURL(compositeBlob);
//         let a = document.createElement("a");
//         a.href = downloadUrl;
//         a.download = "composite_image.png";
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(downloadUrl);

//         this.loadingText = "Creating binary mask...";
//         const maskBlob = await this.createBinaryMaskBlob(renderWidth, renderHeight);

//         // 🔧 Validate mask blob before creating URL
//         if (!maskBlob || maskBlob.size === 0) {
//           throw new Error("Failed to create mask blob");
//         }

//         // Download mask
//         downloadUrl = URL.createObjectURL(maskBlob);
//         a = document.createElement("a");
//         a.href = downloadUrl;
//         a.download = "mask.png";
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(downloadUrl);

//         console.log("✅ Composite and mask generated successfully");

//       } catch (error) {
//         console.error("Error rendering item:", error);
//         throw error;
//       }
//     },

// async renderItem() {
//       if (!this.model || !this.currentBackgroundTexture) {
//         console.warn("Model or background not loaded");
//         return;
//       }

//       try {
//         this.$emit("update:isLoading", true);

//         this.loadingText = "Rendering Item...";

//         const roomId = this.$route.params.id;
//         const prod_id = this.product_id;
//         const url = `${this.$store.state.root_api}engine/inpaint-item-ref/`;

//         // Use original background image dimensions
//         const bgWidth = this.currentBackgroundTexture.image.width;
//         const bgHeight = this.currentBackgroundTexture.image.height;

//         console.log(`Rendering at dimensions: ${bgWidth}x${bgHeight}`);

//         this.loadingText = "Creating composite image...";
//         // Create composite by rendering 3D object and blending with background
//         const compositeBlob = await this.createCompositeImageBlob(
//           bgWidth,
//           bgHeight,
//         );

//         this.loadingText = "Creating binary mask...";
//         // Create binary mask at same resolution
//         const maskBlob = await this.createBinaryMaskBlob(bgWidth, bgHeight);

//         // Prepare form data with BOTH images
//         const formData = new FormData();
//         formData.append(
//           "composite_image",
//           compositeBlob,
//           "composite_image.png",
//         );
//         formData.append("binary_mask", maskBlob, "binary_mask.png");
//         formData.append("room_id", roomId);
//         formData.append("prod_id", prod_id);

//         this.loadingText = "Adding Product to Your Room...";

//         const response = await fetch(url, {
//           method: "POST",
//           headers: {
//             Authorization: `Token ${localStorage.getItem("token")}`,
//           },
//           body: formData,
//         });

//         if (response.status == 402) {
//           const result = await response.json();
//           this.$emit("insufficient-credits", result.msg,result.buid);
//           return;
//         }
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log("====================================");
//         console.log(result);
//         console.log("====================================");
//         if (result.renderer_id) {
//           this.remove3DObjectFromScene();
//           this.$emit(
//             "add-3d-furniture-to-room-start-polling",
//             result.renderer_id,
//           );
//         }

//         // 🔥 REMOVE 3D OBJECT AFTER SUCCESSFUL RENDER

//         console.log(
//           "Composite image and binary mask sent successfully:",
//           result,
//         );
//         console.log(`Images generated with dimensions: ${bgWidth}x${bgHeight}`);

//         return result;
//       } catch (error) {
//         console.error("Error rendering item:", error);
//         throw error;
//       }
//       // finally {
//       //   this.$emit('update:isLoading', false);
//       // }
//     },

async renderItem() {
  if (!this.model || !this.currentBackgroundTexture) {
    console.warn("Model or background not loaded");
    return;
  }

  try {
    // 🔧 CRITICAL: Use last known position if available (from drag/rotate)
    let currentPosition, currentRotation, currentScale;
    
    if (this.lastKnownModelPosition && this.lastKnownModelRotation && this.lastKnownModelScale) {
      console.log("🔄 Using LAST KNOWN transform from drag/rotate");
      currentPosition = this.lastKnownModelPosition.clone();
      currentRotation = this.lastKnownModelRotation.clone();
      currentScale = this.lastKnownModelScale.clone();
      
      // 🔧 Apply the last known transform to model (in case it was reset)
      this.model.position.copy(currentPosition);
      this.model.rotation.copy(currentRotation);
      this.model.scale.copy(currentScale);
    } else {
      console.log("⚠️ No last known position, using current model state");
      currentPosition = this.model.position.clone();
      currentRotation = this.model.rotation.clone();
      currentScale = this.model.scale.clone();
    }
    
    console.log(`📸 CAPTURED model state - Position: x=${currentPosition.x.toFixed(2)}, y=${currentPosition.y.toFixed(2)}, z=${currentPosition.z.toFixed(2)}`);
    console.log(`📸 CAPTURED model state - Rotation: ${currentRotation.y.toFixed(2)} radians (${THREE.MathUtils.radToDeg(currentRotation.y).toFixed(2)}°)`);
    
    // 🔧 Force a render cycle to ensure all updates are applied
    await this.$nextTick();
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }

    // 🔧 CRITICAL: Restore model state in case it changed during $nextTick
    this.model.position.copy(currentPosition);
    this.model.rotation.copy(currentRotation);
    this.model.scale.copy(currentScale);

    this.$emit("update:isLoading", true);
    this.loadingText = "Rendering Item...";

    const roomId = this.$route.params.id;
    const prod_id = this.product_id;
    const url = `${this.$store.state.root_api}engine/inpaint-item-ref/`;

    // 🔧 Get actual canvas dimensions (what's displayed on screen)
    const canvas = this.renderer.domElement;
    let renderWidth = canvas.width;
    let renderHeight = canvas.height;

    // Fallback to background texture dimensions if canvas is not properly sized
    if (renderWidth === 0 || renderHeight === 0) {
      console.warn("Canvas not properly sized, using background texture dimensions");
      if (this.currentBackgroundTexture && this.currentBackgroundTexture.image) {
        renderWidth = this.currentBackgroundTexture.image.width;
        renderHeight = this.currentBackgroundTexture.image.height;
      } else {
        // Last resort: use container dimensions
        const container = this.$refs.viewer;
        if (container) {
          renderWidth = container.clientWidth || 800;
          renderHeight = container.clientHeight || 600;
        } else {
          renderWidth = 800;
          renderHeight = 600;
        }
      }
    }

    console.log(`Rendering at dimensions: ${renderWidth}x${renderHeight}`);
    console.log(`🔍 BEFORE RENDER - Model position: x=${this.model.position.x.toFixed(2)}, y=${this.model.position.y.toFixed(2)}, z=${this.model.position.z.toFixed(2)}`);
    console.log(`🔍 BEFORE RENDER - Model rotation: ${this.model.rotation.y.toFixed(2)} radians (${THREE.MathUtils.radToDeg(this.model.rotation.y).toFixed(2)} degrees)`);
    console.log(`🔍 BEFORE RENDER - Model scale: ${this.model.scale.x.toFixed(2)}`);

    this.loadingText = "Creating composite image...";
    const compositeBlob = await this.createCompositeImageBlob(
      renderWidth,
      renderHeight,
    );

    // 🔧 Validate blob before creating URL
    if (!compositeBlob || compositeBlob.size === 0) {
      throw new Error("Failed to create composite image blob");
    }

    this.loadingText = "Creating binary mask...";
    const maskBlob = await this.createBinaryMaskBlob(renderWidth, renderHeight);

    // 🔧 Validate mask blob before creating URL
    if (!maskBlob || maskBlob.size === 0) {
      throw new Error("Failed to create mask blob");
    }

    console.log(`✅ Composite blob created: ${compositeBlob.size} bytes`);
    console.log(`✅ Mask blob created: ${maskBlob.size} bytes`);

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
      this.$emit("insufficient-credits", result.msg, result.buid);
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

    console.log(
      "Composite image and binary mask sent successfully:",
      result,
    );
    console.log(`Images generated with dimensions: ${renderWidth}x${renderHeight}`);

    return result;
  } catch (error) {
    console.error("Error rendering item:", error);
    this.$emit("update:isLoading", false);
    throw error;
  }
},
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
          this.$emit("insufficient-credits", result.msg, result.buid);
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
        return result;
      } catch (error) {
        console.error("Error rendering item:", error);
        throw error;
      }
    },

    async createCompositeImageBlob(bgWidth, bgHeight) {
      // 🔧 Validate dimensions
      if (!bgWidth || !bgHeight || bgWidth <= 0 || bgHeight <= 0) {
        console.error("Invalid dimensions for composite image:", bgWidth, bgHeight);
        throw new Error(`Invalid dimensions: ${bgWidth}x${bgHeight}`);
      }

      const objectCanvas = document.createElement("canvas");
      objectCanvas.width = bgWidth;
      objectCanvas.height = bgHeight;

      const objectRenderer = new THREE.WebGLRenderer({
        canvas: objectCanvas,
        antialias: true,
        preserveDrawingBuffer: true,
        alpha: true,
        precision: "highp",
      });
      objectRenderer.setSize(bgWidth, bgHeight);
      objectRenderer.setPixelRatio(1);
      objectRenderer.outputColorSpace = THREE.SRGBColorSpace;
      objectRenderer.setClearColor(0x000000, 0);
      objectRenderer.shadowMap.enabled = true;
      objectRenderer.shadowMap.type = THREE.PCFShadowMap;

      const objectScene = new THREE.Scene();
      
      // 🔧 FIX: Use deep clone and apply world matrix to preserve exact transform
      const modelClone = this.model.clone(true); // true = recursive clone
      
      // Copy world matrix to preserve exact position/rotation/scale
      this.model.updateWorldMatrix(true, true);
      modelClone.position.copy(this.model.position);
      modelClone.rotation.copy(this.model.rotation);
      modelClone.scale.copy(this.model.scale);
      modelClone.updateMatrix();
      
      console.log(`🎯 COMPOSITE - Cloning model at position: x=${modelClone.position.x.toFixed(2)}, y=${modelClone.position.y.toFixed(2)}, z=${modelClone.position.z.toFixed(2)}`);
      console.log(`🎯 COMPOSITE - Cloning model rotation: ${modelClone.rotation.y.toFixed(2)} radians (${THREE.MathUtils.radToDeg(modelClone.rotation.y).toFixed(2)}°)`);
      console.log(`🎯 COMPOSITE - Original model position: x=${this.model.position.x.toFixed(2)}, y=${this.model.position.y.toFixed(2)}, z=${this.model.position.z.toFixed(2)}`);
      
      objectScene.add(modelClone);

      const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.9);
      objectScene.add(hemisphereLight);

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

      const fillLight = new THREE.DirectionalLight(0xffffff, 1.8);
      fillLight.position.set(-10, 5, -5);
      objectScene.add(fillLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
      keyLight.position.set(5, 10, 10);
      objectScene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
      rimLight.position.set(-5, 5, -10);
      objectScene.add(rimLight);

      const extraFillLight = new THREE.DirectionalLight(0xffffff, 1.2);
      extraFillLight.position.set(8, 8, 8);
      objectScene.add(extraFillLight);

      const pointLight = new THREE.PointLight(0xffffff, 1.5, 150);
      pointLight.position.set(12, 12, 12);
      objectScene.add(pointLight);

      const objectCamera = this.camera.clone();
      objectCamera.aspect = bgWidth / bgHeight;
      objectCamera.updateProjectionMatrix();

      objectRenderer.render(objectScene, objectCamera);

      // 🔧 Create blob with error handling
      const blob = await new Promise((resolve, reject) => {
        objectCanvas.toBlob((blob) => {
          if (blob && blob.size > 0) {
            resolve(blob);
          } else {
            reject(new Error("Canvas.toBlob returned empty or null blob"));
          }
        }, "image/png");
      });

      objectRenderer.dispose();
      
      console.log(`✅ Composite blob created: ${blob.size} bytes`);
      return blob;
    },

    async createBinaryMaskBlob(bgWidth, bgHeight) {
      // 🔧 Validate dimensions
      if (!bgWidth || !bgHeight || bgWidth <= 0 || bgHeight <= 0) {
        console.error("Invalid dimensions for mask:", bgWidth, bgHeight);
        throw new Error(`Invalid mask dimensions: ${bgWidth}x${bgHeight}`);
      }

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = bgWidth;
      tempCanvas.height = bgHeight;

      const tempRenderer = new THREE.WebGLRenderer({
        canvas: tempCanvas,
        antialias: true,
        preserveDrawingBuffer: true,
      });
      tempRenderer.setSize(bgWidth, bgHeight);
      tempRenderer.setPixelRatio(1);
      tempRenderer.setClearColor(0x000000, 1);

      const tempScene = new THREE.Scene();
      
      // 🔧 FIX: Use deep clone and apply world matrix to preserve exact transform
      const modelClone = this.model.clone(true); // true = recursive clone
      
      // Copy world matrix to preserve exact position/rotation/scale
      this.model.updateWorldMatrix(true, true);
      modelClone.position.copy(this.model.position);
      modelClone.rotation.copy(this.model.rotation);
      modelClone.scale.copy(this.model.scale);
      modelClone.updateMatrix();
      
      console.log(`🎯 MASK - Cloning model at position: x=${modelClone.position.x.toFixed(2)}, y=${modelClone.position.y.toFixed(2)}, z=${modelClone.position.z.toFixed(2)}`);
      
      tempScene.add(modelClone);

      tempScene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 1.0));
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
      dirLight.position.set(10, 15, 5);
      tempScene.add(dirLight);

      modelClone.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        }
      });

      const tempCamera = this.camera.clone();
      tempCamera.aspect = bgWidth / bgHeight;
      tempCamera.updateProjectionMatrix();

      tempRenderer.render(tempScene, tempCamera);

      // 🔧 Create blob with error handling
      const blob = await new Promise((resolve, reject) => {
        tempCanvas.toBlob((blob) => {
          if (blob && blob.size > 0) {
            resolve(blob);
          } else {
            reject(new Error("Canvas.toBlob returned empty or null blob for mask"));
          }
        }, "image/png");
      });

      tempRenderer.dispose();
      
      console.log(`✅ Mask blob created: ${blob.size} bytes`);
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

    // resetComponentState() {
    //   this.modelLoaded = false;
    //   this.modelPosition = { x: 0, y: 0 };
    //   this.modelRotation = { y: 0 };

    //   if (this.model && this.scene) {
    //     this.scene.remove(this.model);
    //     this.model = null;
    //     this.modelBoundingBox = null;
    //     this.modelSize = null;
    //   }

    //   if (this.rotationRing && this.scene) {
    //     this.scene.remove(this.rotationRing);
    //     this.rotationRing = null;
    //     this.rotationArrows = [];
    //   }
    // },
     resetComponentState() {
        this.modelLoaded = false;
        this.modelPosition = { x: 0, y: 0 };
        this.modelRotation = { y: 0 };

        // 🔧 FIXED: Properly remove and cleanup rotation ring first
        this.removeRotationRing();

        if (this.model && this.scene) {
            this.scene.remove(this.model);
            this.model.traverse((child) => {
                if (child.isMesh) {
                    child.geometry?.dispose();
                    if (child.material?.map) child.material.map.dispose();
                    child.material?.dispose();
                }
            });
            this.model = null;
            this.modelBoundingBox = null;
            this.modelSize = null;
        }

        if (this.gridHelper) {
            this.gridHelper.visible = false;
        }
    },

    // 🔧 NEW: Dedicated method to remove rotation ring
    removeRotationRing() {
        if (this.rotationRing && this.scene) {
            this.scene.remove(this.rotationRing);
            
            // Dispose geometries and materials
            this.rotationRing.traverse((child) => {
                if (child.isMesh) {
                    child.geometry?.dispose();
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material?.dispose();
                    }
                }
            });
            
            this.rotationRing = null;
            this.rotationArrows = [];
            console.log("✅ Rotation ring removed");
        }
    },


    // async reinitializeWithNewModel() {
    //   this.loadingText = "Loading new model...";
    //   this.$emit("update:isLoading", false);
    //   await this.loadModel();
    //   this.fitCameraToModel();
    //   this.createRotationRing();
    //   this.updateRotationRingPosition();
    //   this.fitCameraToModel();
    //   this.$emit("update:isLoading", false);
    // },

    
    async reinitializeWithNewModel() {
        this.loadingText = "Loading new model...";
        this.$emit("update:isLoading", false);
        
        // 🔧 FIXED: Ensure rotation ring is removed before loading new model
        this.removeRotationRing();
        
        await this.loadModel();
        this.fitCameraToModel();
        
        // 🔧 FIXED: Only create ring if it doesn't exist
        if (!this.rotationRing) {
            this.createRotationRing();
        }
        
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

      if (fd.floor_boundary) {
        this.floorBoundary = fd.floor_boundary.map(
          (p) => new THREE.Vector3(p[0], p[1], p[2]),
        );
      } else if (fd.floor_mesh && fd.floor_mesh.vertices) {
        this.floorBoundary = fd.floor_mesh.vertices.map(
          (v) => new THREE.Vector3(v[0], v[1], v[2]),
        );
      } else {
        this.floorBoundary = [];
      }
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
      this.scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.9));

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

      const fillLight = new THREE.DirectionalLight(0xffffff, 1.8);
      fillLight.position.set(-10, 5, -5);
      this.scene.add(fillLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
      keyLight.position.set(5, 10, 10);
      this.scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
      rimLight.position.set(-5, 5, -10);
      this.scene.add(rimLight);
    },

    initializeControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableRotate = false;
      this.controls.enableZoom = false;
      this.controls.enablePan = false;

      const floorHeight = this.floorData.floor_plane.height;
      const cameraHeight = 1.5;
      const cameraY = floorHeight + cameraHeight;

      this.camera.position.set(0, cameraY, 0);

      const lookAtPoint = new THREE.Vector3(
        this.floorPoint.x,
        floorHeight,
        this.floorPoint.z - 20,
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
      
      // 🔧 FIXED: Touch Events with proper passive handling
      canvas.addEventListener("touchstart", this.onMouseDown, { passive: false });
      canvas.addEventListener("touchmove", this.onMouseMove, { passive: false });
      canvas.addEventListener("touchend", this.onMouseUp, { passive: false });
      canvas.addEventListener("touchcancel", this.onMouseUp, { passive: false });
    },

    createFloorFromJSON() {
      this.gridGroup = new THREE.Group();
      this.scene.add(this.gridGroup);

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

    createVisualGrid() {
      if (this.gridHelper) this.gridGroup.remove(this.gridHelper);

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
        depthTest: true,
        depthWrite: true,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = -Math.PI / 2;
      ring.name = "rotationRingMesh";
      this.rotationRing.add(ring);

      const arrowPositions = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

      arrowPositions.forEach((angle, index) => {
        const arrowGroup = this.createRotationArrow(angle, index);
        this.rotationRing.add(arrowGroup);
        this.rotationArrows.push(arrowGroup);
      });

      this.rotationRing.visible = this.showRotationRing;
      this.rotationRing.renderOrder = 999;
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

    updateRotationRingPosition() {
      if (!this.rotationRing || !this.model || !this.modelSize) return;

      this.rotationRing.position.copy(this.model.position);

      const avgSize = (this.modelSize.x + this.modelSize.z) / 2;
      const baseScale = Math.max(0.8, avgSize * 1.2);
      this.rotationRing.scale.setScalar(baseScale);

      this.rotationRing.rotation.set(0, 0, 0);

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

      const dims = this.modelDimensions;
      
      const scaleX = dims.width / size.x;
      const scaleY = dims.height / size.y;
      const scaleZ = dims.depth / size.z;
      
      this.baseModelScale = Math.min(scaleX, scaleY, scaleZ);
      this.baseModelScale = Math.max(0.001, Math.min(100, this.baseModelScale));

      this.model.scale.setScalar(this.baseModelScale);

      const scaledBox = new THREE.Box3().setFromObject(this.model);
      this.modelSize = scaledBox.getSize(new THREE.Vector3());

      const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
      this.model.position.sub(scaledCenter);

      this.modelBoundingBox = new THREE.Box3().setFromObject(this.model);
    },

    positionModelOnFloor() {
      if (!this.model) return;

      const floorY = this.floorData.floor_plane.height;

      this.model.position.x = 0;
      this.model.position.z = -3.5;

      const modelBottom = this.modelBoundingBox.min.y * this.baseModelScale;
      this.model.position.y = floorY - modelBottom;

      console.log("Model positioned at:", this.model.position);
    },

    screenToWorld(screenX, screenY) {
      const mouse = new THREE.Vector2(
        screenX * 2 - 1,
        -(screenY * 2 - 1),
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

      this.model.scale.setScalar(this.baseModelScale * this.modelScale);

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

    // 🔧 FIXED: Proper touch/mouse event handling
    onMouseDown(event) {
      event.preventDefault(); // 🔧 Prevent default touch behavior
      
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

      // Check rotation arrows
      if (this.rotationRing && this.showRotationRing) {
        const arrowIntersects = this.raycaster.intersectObject(
          this.rotationRing,
          true,
        );
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

      // Check model dragging
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

          const hitPoint = intersects[0].point.clone();
          this.dragPlane = new THREE.Plane();
          this.dragPlane.setFromNormalAndCoplanarPoint(
            new THREE.Vector3(0, 1, 0),
            hitPoint,
          );
          this.dragOffset = new THREE.Vector3().subVectors(
            hitPoint,
            this.model.position,
          );
          return;
        }
      }
    },

    // 🔧 FIXED: Handle touch movement with proper updates
    onMouseMove(event) {
      if (!this.isDraggingModel && !this.isRotatingModel) return;
      
      event.preventDefault(); // 🔧 Prevent scrolling during drag

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

      if (this.isDraggingModel) {
        this.raycaster.setFromCamera(mouse, this.camera);
        const worldPoint = new THREE.Vector3();

        if (this.raycaster.ray.intersectPlane(this.dragPlane, worldPoint)) {
          worldPoint.sub(this.dragOffset);

          this.model.position.x = worldPoint.x;
          this.model.position.z = worldPoint.z;

          const { a, b, c, d } = this.planeEquation;
          let floorY;
          if (Math.abs(b) > 0.001) {
            floorY = -(a * worldPoint.x + c * worldPoint.z + d) / b;
          } else {
            floorY = this.floorData.floor_plane.height;
          }

          const finalScale = this.baseModelScale * this.modelScale;
          const modelBottomWorldOffset = this.modelBoundingBox.min.y * finalScale;
          this.model.position.y = floorY - modelBottomWorldOffset;

          this.updateRotationRingPosition();
          this.isOnValidFloor = true;
          
          // 🔧 Mark that we need to update rendering
          this.needsRenderUpdate = true;
        }
      } else if (this.isRotatingModel) {
        const deltaX = mouse.x - this.rotationStartMouse.x;
        this.modelRotation.y = this.rotationStartAngle + deltaX * 180;
        this.model.rotation.y = THREE.MathUtils.degToRad(this.modelRotation.y);
        
        // 🔧 Mark that we need to update rendering
        this.needsRenderUpdate = true;
      }
    },

    // 🔧 FIXED: Handle touch end with position update
   // In onMouseUp method
onMouseUp(event) {
  const wasDragging = this.isDraggingModel;
  const wasRotating = this.isRotatingModel;

  if (this.isDraggingModel) {
    this.controls.enabled = true;
    this.isDraggingModel = false;
    this.isDragging = false;
    
    if (this.model) {
      this.modelPosition.x = this.model.position.x;
      this.modelPosition.y = this.model.position.z;
      
      this.lastKnownModelPosition = this.model.position.clone();
      this.lastKnownModelRotation = this.model.rotation.clone();
      this.lastKnownModelScale = this.model.scale.clone();
      
      console.log("✅ Position updated after drag:", {
        x: this.modelPosition.x.toFixed(2),
        z: this.modelPosition.y.toFixed(2)
      });
      console.log("✅ 3D Position stored:", {
        x: this.lastKnownModelPosition.x.toFixed(2),
        y: this.lastKnownModelPosition.y.toFixed(2),
        z: this.lastKnownModelPosition.z.toFixed(2)
      });
      
      // 🔧 EMIT to parent
      this.$emit('model-transform-updated', {
        position: {
          x: this.model.position.x,
          y: this.model.position.y,
          z: this.model.position.z
        },
        rotation: {
          x: this.model.rotation.x,
          y: this.model.rotation.y,
          z: this.model.rotation.z
        },
        scale: {
          x: this.model.scale.x,
          y: this.model.scale.y,
          z: this.model.scale.z
        }
      });
    }
  }

  if (this.isRotatingModel) {
    this.controls.enabled = true;
    this.isRotatingModel = false;
    this.isRotating = false;

    if (this.model) {
      this.modelRotation.y = THREE.MathUtils.radToDeg(this.model.rotation.y);
      
      this.lastKnownModelRotation = this.model.rotation.clone();
      this.lastKnownModelPosition = this.model.position.clone();
      this.lastKnownModelScale = this.model.scale.clone();
      
      console.log("✅ Rotation updated:", this.modelRotation.y.toFixed(2), "degrees");
      console.log("✅ Rotation stored (radians):", {
        x: this.lastKnownModelRotation.x.toFixed(2),
        y: this.lastKnownModelRotation.y.toFixed(2),
        z: this.lastKnownModelRotation.z.toFixed(2)
      });
      
      // 🔧 EMIT to parent after rotation
      this.$emit('model-transform-updated', {
        position: {
          x: this.model.position.x,
          y: this.model.position.y,
          z: this.model.position.z
        },
        rotation: {
          x: this.model.rotation.x,
          y: this.model.rotation.y,
          z: this.model.rotation.z
        },
        scale: {
          x: this.model.scale.x,
          y: this.model.scale.y,
          z: this.model.scale.z
        }
      });
    }

    this.rotationArrows.forEach((group) => {
      group.children.forEach((arrow) => {
        if (arrow.userData.isRotationArrow) {
          arrow.material.color.setHex(arrow.userData.originalColor);
        }
      });
    });
  }

  // Force a render update if interaction just ended
  if ((wasDragging || wasRotating) && this.needsRenderUpdate) {
    this.$nextTick(() => {
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
      this.needsRenderUpdate = false;
    });
  }
},

    fitCameraToModel() {
      return;
    },

    adjustCanvasToImageAspectRatio(texture) {
      if (!texture.image || !this.$refs.canvasContainer) return;

      const containerRect = this.$refs.canvasContainer.getBoundingClientRect();
      const availableWidth = Math.floor(containerRect.width);
      const availableHeight = Math.floor(containerRect.height);

      const imgAspect = texture.image.width / texture.image.height;

      let canvasWidth = availableWidth;
      let canvasHeight = Math.round(canvasWidth / imgAspect);

      if (canvasHeight > availableHeight) {
        canvasHeight = availableHeight;
        canvasWidth = Math.round(canvasHeight * imgAspect);
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

      this.modelScale = 1.0;

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
      
      // 🔧 Update stored values
      this.modelPosition.x = this.model.position.x;
      this.modelPosition.y = this.model.position.z;
      this.needsRenderUpdate = true;
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
      if (this.positionUpdateTimer) {
        clearTimeout(this.positionUpdateTimer);
      }

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
  height: calc(100vh - 140px);
  min-height: 400px;
  max-height: calc(100vh - 140px);
  position: relative;
  text-align: center;
  /* 🔧 Prevent touch scrolling on the canvas */
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
}

@media (min-width: 769px) {
  .main-canvas {
    height: calc(100vh - 140px);
    max-height: calc(100vh - 140px);
  }
}

@media (min-width: 400px) and (max-width: 768px) {
  .main-canvas {
    height: calc(100vh - 180px);
    max-height: calc(100vh - 180px);
  }
}

@media (max-width: 399px) {
  .main-canvas {
    height: calc(100vh - 220px);
    max-height: calc(100vh - 220px);
  }
}

#viewer {
  position: relative;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  /* 🔧 Prevent touch interactions from propagating */
  touch-action: none;
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
