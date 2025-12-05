<template>
  <div class="ar-app" ref="containerRef">
    <div class="bottom-sheet-wrapper">
      <!-- Drag Handle -->
      <div
        v-if="isSessionStarted && !fullScreenMode"
        class="drag-handle"
        @touchstart="startDrag"
        @touchmove="onDrag"
        @touchend="endDrag"
      >
        <div class="handle-bar">
          <div class="handle-har-icon"></div>
          <div style="padding: 10px; width: 100%">
            <a-row>
              <a-col :span="16">
                <h1 style="font-size:18px">$ {{ProductDetails.pricing.price}}</h1>
                <h3 style="max-width: 20ch; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                {{ProductDetails.name}}
              </h3>
              </a-col>
              <a-col :span="8">
                <div style="display: flex; gap: 10px;justify-content: end;">
                  <a-button shape="circle" size="large" type="primary" style="display:flex;justify-content: center;align-items: center;" @click="addToCart"
                    ><ShoppingCartOutlined style="font-size:24px"
                  /></a-button>
                  <a-button
                    @click="toggleFullscreen"
                     style="display:flex;justify-content: center;align-items: center;"
                    shape="circle"
                    size="large"
                    type="default"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class=""
                      :class="{ active: mode === 'zoom' }"
                      title="Zoom out"
                      v-if="!fullScreenMode"
                    >
                      <path
                        d="M8.57101 3.31865C8.57101 3.31865 4.32145 2.93738 3.6294 3.62942C2.93734 4.32146 3.31868 8.57101 3.31868 8.57101"
                        stroke="#1A1A1A"
                        stroke-width="1.60714"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.57101 22.3949C8.57101 22.3949 4.32145 22.7763 3.6294 22.0842C2.93734 21.3921 3.31868 17.1426 3.31868 17.1426"
                        stroke="#1A1A1A"
                        stroke-width="1.60714"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M17.1436 3.31865C17.1436 3.31865 21.3932 2.93738 22.0852 3.62942C22.7772 4.32146 22.3959 8.57101 22.3959 8.57101"
                        stroke="#1A1A1A"
                        stroke-width="1.60714"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M17.1436 22.3949C17.1436 22.3949 21.3932 22.7763 22.0852 22.0842C22.7772 21.3921 22.3959 17.1426 22.3959 17.1426"
                        stroke="#1A1A1A"
                        stroke-width="1.60714"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.0117 10.7115L21.4957 4.22754"
                        stroke="#1A1A1A"
                        stroke-width="1.60714"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M10.7118 15.0039L3.90039 21.8378"
                        stroke="#1A1A1A"
                        stroke-width="1.60714"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M10.7111 10.7171L4.12012 4.13477"
                        stroke="#1A1A1A"
                        stroke-width="1.60714"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14.9775 15.0039L21.9937 21.9638"
                        stroke="#1A1A1A"
                        stroke-width="1.60714"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </a-button>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
      <!-- Ant Design Drawer -->
      <a-drawer
      v-if="ProductDetails"
        placement="bottom"
        height="380"
        :open="isOpen"
        @close="isOpen = false"
        :closable="true"
        :getContainer="false"
        :mask="false"
        :class="[{ peek: !isOpen }, 'bottom-sheet']"
        style="position: relative; left: -16px; height: 104%;color:black"
      >
      <template #extra>
<a-row>

  <a-col :span="12" style="padding-left:4px;padding-right:4px;">
    <a-button size="large" shape="circle" type="primary" style="font-size:20px;;display: flex;justify-content: center;align-items:center;"
        @click="addToCart"
    :loading="cartLoading"
    >
    <div style="display:flex;gap:10px">
      <!-- <template #icon> -->
        <ShoppingCartOutlined style="font-size:24px"/>
      <!-- </template> -->
      
    </div>
  </a-button>
</a-col>
          
          <a-col :span="12" style="padding-left:4px;padding-right:4px;display: flex;justify-content: end;">
            <a-button  size="large" shape="circle" style="font-size:20px;;display: flex;justify-content: center;align-items:center;"><HeartOutlined/> </a-button>
          </a-col>
          
        </a-row>
      </template>
      <h1 style="font-size:18px">$ {{ProductDetails.pricing.price}}</h1>
                <h3 style="max-width: 20ch; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                {{ProductDetails.name}}
              </h3>
              <p>Type: {{ProductDetails.furniture_type}}</p>

          <h2>Product Dimensions</h2>
          <p><span> {{ProductDetails.dimensions.width}}m</span> Width X <span>{{ProductDetails.dimensions.height}}m </span> Height X <span>{{ProductDetails.dimensions.length}}m </span> Depth</p>

        <a-row class="add-to-cart-sec">
          <a-col :span="24" style="padding-right:4px;">
            <a-button type="primary" @click="goto_product_Route(ProductDetails)" block   size="large" style="font-size:20px;;display: flex;justify-content: center;align-items:center; width:100%"><IssuesCloseOutlined />See Product </a-button>
          </a-col>
         
        </a-row>
      
        <a-row class="product-size-sec">
        </a-row>
      </a-drawer>
    </div>
    <div v-if="stage > 1 && stage < 4 && !isSessionStarted" class="stageview">
      <StageView :currentStage="stage" @start-ar="startARSession" />
    </div>
    <div v-else-if="stage === 1" class="stage1_sec">
      <div
        class="step1"
        style="
          position: relative;
          width: 100%;
          height: 100vh;
          padding: 0;
          margin: 0;
          background: white;
          overflow: hidden;
        "
      >
        <!-- Full Screen Canvas -->
         
        <div

          style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
          ">
          <canvas_3d_model_renderer
            :glbModelUrl="modelUrl"
            :Model_instance_id="'12345678'"
            :isLoading="isLoading"
            style="
              width: 100% !important;
              height: 100% !important;
              min-height: 100% !important;
              max-height: 100% !important;
              display: block;
              border-radius: 0;
              margin: 0;
              padding: 0;
            "
          />
        </div>
        <!-- Floating Back Button (Top Left) -->
        <div
          style="
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            width: 90%;
          "
        >
          <a-row>
            <a-col :span="4">
              <a-button
                shape="circle"
                type="primary"
                size="large"
                aria-label="Go Back"
                @click="this.$router.back()"

                style="display:flex;justify-content: center;align-items: center;"
              >
                <template #icon>
                  <ArrowLeftOutlined />
                </template>
              </a-button>
            </a-col>
            <a-col :span="20">
              <a-alert
                message="Pinch to zoom • Drag to rotate"
                type="info"
                show-icon
                :closable="false"
              />
            </a-col>
            
          </a-row>
          
        </div>
        <!-- Floating Next Button (Bottom Center) -->
        <div
          style="
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
          "
        >
          <a-button type="primary" size="large" @click="startARSession">
            Try in AR →
          </a-button>
        </div>
      </div>
    </div>
    <div v-if="isSessionStarted && !fullScreenMode" class="ar_sec_navbar">
      <!-- <span class="back-button-sec" @click="endARSession">
      </span> -->
        <a-button @click="endARSession"
                shape="circle"
                type="primary"
                size="large"
                aria-label="Go Back"
                style="display:flex;justify-content: center;align-items: center;"
              >
                <template #icon>
                  <ArrowLeftOutlined />
                </template>
              </a-button>
    </div>
    <!-- Loading State -->
    <div v-if="stage === 3" v-show="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>{{ loadingMessage }}</p>
      <p
        style="
          font-size: 12px;
          margin-top: 20px;
          color: rgba(255, 255, 255, 0.7);
        "
      >
        Status: {{ debugStatus }}
      </p>
    </div>

    <!-- AR View -->
    <div v-show="!isLoading" class="ar-container">
      <!-- A-Frame Scene Container -->
      <div id="ar-scene-container" class="ar-scene"></div>

      <!-- Status Indicators -->
      <div v-if="shouldShowStatus" class="status-indicator">
        <div class="ar-status">{{ arStatus }}</div>
        <!-- <div class="floor-detection">{{ floorDetection }}</div> -->
      </div>
      <!-- Error Message -->
      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="error = null" class="close-error">×</button>
      </div>
    </div>
    
    <div
      v-if="isSessionStarted && fullScreenMode"
      @click="existFullScreen"
      class="exitFullScreen_sec"
    >
      <a-button v-if="fullScreenMode" class="exit-full-screen" shape="circle" size="large"  style="display:flex;justify-content: center;align-items: center;">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.29289 3.29289C3.68342 2.90237 4.31658 2.90237 4.70711 3.29289L8 6.58579V5C8 4.44772 8.44772 4 9 4C9.55228 4 10 4.44772 10 5V9C10 9.55228 9.55228 10 9 10H5C4.44772 10 4 9.55228 4 9C4 8.44772 4.44772 8 5 8H6.58579L3.29289 4.70711C2.90237 4.31658 2.90237 3.68342 3.29289 3.29289ZM19.2929 3.29289C19.6834 2.90237 20.3166 2.90237 20.7071 3.29289C21.0976 3.68342 21.0976 4.31658 20.7071 4.70711L17.4142 8H19C19.5523 8 20 8.44772 20 9C20 9.55228 19.5523 10 19 10H15C14.4477 10 14 9.55228 14 9V5C14 4.44772 14.4477 4 15 4C15.5523 4 16 4.44772 16 5V6.58579L19.2929 3.29289ZM4 15C4 14.4477 4.44772 14 5 14H9C9.55228 14 10 14.4477 10 15V19C10 19.5523 9.55228 20 9 20C8.44772 20 8 19.5523 8 19V17.4142L4.70711 20.7071C4.31658 21.0976 3.68342 21.0976 3.29289 20.7071C2.90237 20.3166 2.90237 19.6834 3.29289 19.2929L6.58579 16H5C4.44772 16 4 15.5523 4 15ZM14 15C14 14.4477 14.4477 14 15 14H19C19.5523 14 20 14.4477 20 15C20 15.5523 19.5523 16 19 16H17.4142L20.7071 19.2929C21.0976 19.6834 21.0976 20.3166 20.7071 20.7071C20.3166 21.0976 19.6834 21.0976 19.2929 20.7071L16 17.4142V19C16 19.5523 15.5523 20 15 20C14.4477 20 14 19.5523 14 19V15Z"
            fill="#000000"
          />
        </svg>
      </a-button>
    </div>
  </div>
  <div class="footer-stepper">
    <a-button
      v-if="stage >= 1 && stage <= 2"
      class="step-continue-button"
      type="primary"
      size="large"
      @click="IncreasesStage"
    >
      Continue
    </a-button>
  </div>
</template>

<script>
import StageView from "@/components/AR/starting_instruction_ar.vue";
import canvas_3d_model_renderer from "@/components/AR/canvas_3d_model_renderer.vue";
import { ArrowLeftOutlined, HeartOutlined, IssuesCloseOutlined, ShoppingCartOutlined } from "@ant-design/icons-vue";

export default {
  name: "ARSpinosaurs",
  data() {
    return {
      isOpen: false,
      startY: 0,
      currentY: 0,
      dragAmount: 0,
      isLoading: false,
      loadingMessage: "Initializing AR...",
      stage: 1,
      debugStatus: "Ready",
      arStatus: "AR Ready",
      isSessionStarted: false,
      fullScreenMode: false,
      shouldShowStatus: true,
      modelUrl: "",
      ProductDetails: null,
      scene: null,
      dino: null,
      modelPlaced: false,
      fixedModelPosition: null,
      cartLoading: false,
      error: null,
    };
  },

  mounted() {
    console.log("✓ Component mounted");
    this.fetchProductDetails();
  },

  beforeUnmount() {
    if (this.scene) {
      this.scene.pause();
    }
  },

  methods: {
    // ============================================
    // 🚀 START AR SESSION
    // ============================================
    async startARSession() {
      console.log("🚀 Starting AR Session...");
      this.loadingMessage = "Loading AR...";
      this.isLoading = true;
      this.error = null;

      if (!this.modelUrl) {
        try {
          await this.fetchProductDetails();
        } catch (err) {
          console.error("❌ Failed to load product:", err);
          this.isLoading = false;
          return;
        }
      }

      this.stage = 3;

      setTimeout(() => {
        this.loadARFramework();
      }, 100);
    },

    // ============================================
    // 📦 LOAD A-FRAME
    // ============================================
    async loadARFramework() {
      // Check if already loaded
      const w = window;
      if (w.AFRAME && w.AFRAME.version) {
        console.log("✓ A-Frame already loaded");
        this.setupARScene();
        return;
      }

      // Load A-Frame script
      const script = document.createElement("script");
      script.src = "https://aframe.io/releases/1.4.0/aframe.min.js";
      script.async = true;

      script.onload = () => {
        console.log("✓ A-Frame loaded");
        setTimeout(() => this.setupARScene(), 500);
      };

      script.onerror = () => {
        console.error("❌ Failed to load A-Frame");
        this.isLoading = false;
        this.error = "Failed to load AR framework";
      };

      document.head.appendChild(script);
    },

    // ============================================
    // 🎬 SETUP AR SCENE
    // ============================================
    setupARScene() {
      this.$nextTick(() => {
        const container = document.getElementById("ar-scene-container");
        if (!container) {
          console.error("❌ AR container not found");
          this.error = "AR container not found";
          this.isLoading = false;
          return;
        }
        this.createARScene(container);
      });
    },

    // ============================================
    // 🎨 CREATE AR SCENE
    // ============================================
    createARScene(container) {
      console.log("🎨 Creating AR scene with model:", this.modelUrl);

      const sceneHTML = `
        <a-scene
          webxr="requiredFeatures: hit-test,local-floor; optionalFeatures: dom-overlay; overlayElement: .ar-app;"
          renderer="colorManagement: true; physicallyCorrectLights: true;"
        >
          <a-assets>
            <a-asset-item id="model" src="${this.modelUrl}" response-type="arraybuffer" crossorigin="anonymous"></a-asset-item>
          </a-assets>

          <a-camera position="0 1.2 0"></a-camera>

          <!-- Reticle Marker for Floor -->
          <a-entity 
            id="reticle-marker" 
            position="0 -0.5 -2" 
            visible="false"
          >
            <a-cylinder position="0 0 0" radius="0.15" height="0.001" color="#4CAF50" opacity="0.7"></a-cylinder>
          </a-entity>

          <!-- 3D Model Container -->
          <a-entity 
            id="dino" 
            position="0 -2 -5" 
            scale="0.8 0.8 0.8"
            visible="false"
          >
            <a-entity gltf-model="#model" animation-mixer shadow="cast: true; receive: false"></a-entity>
          </a-entity>

          <!-- Shadow Plane -->
          <a-plane 
            id="shadowPlane" 
            height="100" 
            width="100" 
            rotation="-90 0 0" 
            position="0 0 0" 
            shadow="receive: true; cast: false" 
            material="color: #ffffff; transparent: true; opacity: 0.001;"
          ></a-plane>

          <!-- Lighting -->
          <a-light type="hemisphere" intensity="1.2" color="#ffffff"></a-light>
          <a-light 
            type="directional" 
            position="5 8 5" 
            intensity="1.5" 
            light="castShadow: true; shadowMapHeight: 2048; shadowMapWidth: 2048;"
          ></a-light>
          <a-light type="directional" position="-5 6 -3" intensity="0.6"></a-light>
        </a-scene>
      `;

      try {
        container.innerHTML = sceneHTML;
        console.log("✓ AR Scene HTML created");

        // Wait for A-Frame to initialize
        setTimeout(() => {
          this.scene = document.querySelector("a-scene");
          this.dino = document.getElementById("dino");

          if (this.scene) {
            console.log("✓ A-Frame scene initialized");
            
            // Wait for WebXR session to start
            this.scene.addEventListener("enter-ar", () => {
              console.log("✓ AR session started");
              this.isSessionStarted = true;
              
              // Show reticle when AR starts
              const reticle = document.getElementById("reticle-marker");
              if (reticle) {
                reticle.setAttribute("visible", true);
              }

              // Handle click to place model
              this.scene.addEventListener("click", () => {
                if (this.dino && !this.modelPlaced) {
                  const reticlePos = reticle?.getAttribute("position") || { x: 0, y: 0, z: -2 };
                  this.dino.setAttribute("position", reticlePos);
                  this.dino.setAttribute("visible", true);
                  this.modelPlaced = true;
                  console.log("✓ Model placed at:", reticlePos);
                }
              });
            });

            this.isLoading = false;
            this.debugStatus = "AR Ready!";
            this.arStatus = "✓ Point at floor";
            console.log("✓ AR Ready - Point your phone at the floor");
          }
        }, 1500);
      } catch (err) {
        console.error("❌ Error creating scene:", err);
        this.error = "Error creating AR scene: " + err.message;
        this.isLoading = false;
      }
    },

    // ============================================
    // 🛑 END AR SESSION
    // ============================================
    async endARSession() {
      try {
        console.log("🛑 Ending AR Session...");

        // Stop XR session
        const scene = document.querySelector("a-scene");
        if (scene) {
          const w = window;
          if (w.AFRAME && w.AFRAME.scenes && w.AFRAME.scenes.length > 0) {
            try {
              await scene.xrSession?.end();
              console.log("✓ XR session ended");
            } catch (err) {
              console.warn("XR session end error:", err);
            }
          }
        }

        // Stop camera/video
        const videoEl = document.querySelector("video");
        if (videoEl?.srcObject) {
          const tracks = videoEl.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
          videoEl.srcObject = null;
          console.log("✓ Camera stopped");
        }

        // Clear AR container
        const container = document.getElementById("ar-scene-container");
        if (container) {
          container.innerHTML = "";
        }

        // Reset state
        this.isSessionStarted = false;
        this.stage = 1;
        this.modelPlaced = false;
        this.scene = null;
        this.dino = null;

        console.log("✓ AR cleanup complete");
      } catch (error) {
        console.error("❌ Cleanup error:", error);
      }
    },

    // ============================================
    // 📦 FETCH PRODUCT
    // ============================================
    async fetchProductDetails() {
      try {
        const productId = this.$route.params.product_id;
        if (!productId) throw new Error("Product ID not found");

        const token = localStorage.getItem("token");
        const apiUrl = `${this.$store.state.root_api}product/api/product-details/${productId}/`;

        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Token ${token}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers,
          credentials: "omit",
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const result = await response.json();
        if (!result.success || !result.data) throw new Error(result.message);

        this.ProductDetails = result.data;
        this.modelUrl = `${this.$store.state.root_media_api}${result.data["3d_model"]}`;

        console.log("✅ Product loaded:", this.modelUrl);
      } catch (error) {
        console.error("❌ Error:", error);
        this.$message.error("Failed to load product");
      }
    },

    // ============================================
    // 🛒 ADD TO CART
    // ============================================
    async addToCart() {
      if (!this.ProductDetails?.id) {
        this.$message.error("Product not found");
        return;
      }

      this.cartLoading = true;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${this.$store.state.root_api}cart/add/`, {
          method: "POST",
          headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_type: this.ProductDetails.is_ceiling_light_product
              ? "light"
              : "furniture",
            product_id: this.ProductDetails.id,
            quantity: 1,
          }),
        });

        const result = await response.json();
        if (response.ok) {
          this.$message.success("Added to cart!");
        } else {
          this.$message.error(result.error || "Failed to add to cart");
        }
      } catch (error) {
        this.$message.error("Error adding to cart");
      } finally {
        this.cartLoading = false;
      }
    },

    // ============================================
    // 🧭 UI UTILITIES
    // ============================================
    IncreasesStage() {
      if (this.stage > 0 && this.stage < 4) {
        this.stage = Number(this.stage) + 1;
      }
    },

    startDrag(e) {
      this.startY = e.touches[0].clientY;
    },

    onDrag(e) {
      this.currentY = e.touches[0].clientY;
      this.dragAmount = this.currentY - this.startY;

      if (this.dragAmount > 50) this.isOpen = false;
      if (this.dragAmount < -50) this.isOpen = true;
    },

    endDrag() {
      this.startY = 0;
      this.currentY = 0;
      this.dragAmount = 0;
    },

    toggleFullscreen() {
      this.fullScreenMode = !this.fullScreenMode;
    },

    existFullScreen() {
      this.fullScreenMode = false;
    },

    goto_product_Route(product) {
      this.$router
        .push({
          name: "buisness_product",
          params: {
            buisness_name: product.business_slug,
            product_type: "product",
            product_id: product.id,
          },
        })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          console.error("Navigation failed:", err);
        });
    },
  },

  components: {
    StageView,
    canvas_3d_model_renderer,
    ArrowLeftOutlined,
    HeartOutlined,
    IssuesCloseOutlined,
    ShoppingCartOutlined,
  },
};
</script>
<style scoped>
.ar_sec_navbar {
  width: 100%;
  padding: 50px 20px;
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: white;
  justify-content: center;
  cursor: pointer;
  z-index: 1000 !important;
}

.loading-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 30%;
  bottom: 100px;
}

.status-indicator {
  position: fixed;
  text-align: center;
  bottom: 130px;
  left: 40%;
}

#ar-scene-container {
  position: relative;
  z-index: 0;
}
.footer-controls {
  position: fixed;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 9;
  background-color: white;
  height: 80px;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.exitFullScreen_sec {
  position: fixed;
  bottom: 10px;
  right: 10px;
}

.stageview {
  padding: 10px;
}
.footer-stepper {
  width: 100%;
  position: fixed;
  bottom: 10px;
  /* : 13px 10px; */
  display: flex;
  justify-content: center;
  align-items: center;
}

.ant-drawer-wrapper-body {
  position: relative;
  left: -16px;
}
.bottom-sheet-wrapper {
  position: fixed;
  bottom: 20px;
  width: 100%;
  z-index: 9;
  /* background-color: rgb(57, 245, 19); */
}

.drag-handle {
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  touch-action: none;
}

.handle-bar {
  width: 100%;
  color:black;
  /* height: 150px; */
  padding: 10px;
  background: white;
  border-radius: 5px;
  position: relative;
  left: -16px;
  bottom: -50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.handle-har-icon {
  width: 50px;
  height: 3px;
  background-color: #c4c4c4;
  border-radius: 5px;
  text-align: center;
  position: relative;
  top: -8px;
}

.bottom-sheet.peek {
  transform: translateY(calc(100% - 5vh)) !important; /* Show 5% */
}

.bottom-sheet .ant-drawer-content-wrapper {
  border-radius: 16px 16px 0 0;
}

.price-details {
  height: 33px;
}

.add-to-cart-sec {
  padding: 8px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.product-title-sec {
  padding: 10px 0px;
}

.product-size-sec > h2 {
  width: 100%;
}

.exit-full-screen {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: white;
}
.back-button-sec{
  cursor: pointer;
}
</style>
