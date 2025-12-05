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
      <StageView :currentStage="stage" />
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
          <a-button type="primary" size="large" @click="IncreasesStage">
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
import { ArrowLeftOutlined, HeartOutlined,IssuesCloseOutlined , ShoppingCartOutlined } from "@ant-design/icons-vue";

export default {
  name: "ARSpinosaurs",
  data() {
    return {
      isOpen: false,
      startY: 0,
      currentY: 0,
      dragAmount: 0,
      isLoading: true,
      loadingMessage: "Initializing AR...",
      stage: 1,
      debugStatus: "Starting...",
      arStatus: "Checking AR support...",
      floorDetection: "Loading...",
      isSessionStarted: false,
      fullScreenMode: false,
      shouldShowStatus: true,
      modelObject: null,
      modelScale: 0.5,
      error: null,
      scene: null,
      dino: null,
      sizes: [
        { label: "Full (1x)", value: 1 },
        { label: "Medium (0.5x)", value: 0.5 },
        { label: "Small (0.0625x)", value: 0.0625 },
      ],
      diamensions: { width: 2.06, height: 1.4, depth: 0.7 },
      modelUrl:"",
      ProductDetails:null,
        // "https://rawcdn.githack.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb",
      light: null,
      sceneInitialized: false,
      modelPlaced: false,
      fixedModelPosition: null,
      // New properties for drag & rotate
      showMenu: false,
      dragMode: "rotate",
      modelRotation: 0,
      modelPosition: { x: 0, z: 0 },
      isDragging: false,
      dragStart: { x: 0, y: 0 },
      isFullscreen: false,

      // Reticle JSON data
      reticleJSON: {
        asset: {
          generator: "Khronos glTF Blender I/O v1.0.5",
          version: "2.0",
        },
        scene: 0,
        scenes: [{ name: "Scene", nodes: [0, 1, 2] }],
        nodes: [
          {
            name: "Light",
            rotation: [
              0.16907575726509094, 0.7558803558349609, -0.27217137813568115,
              0.570947527885437,
            ],
            translation: [
              4.076245307922363, 5.903861999511719, -1.0054539442062378,
            ],
          },
          {
            name: "Camera",
            rotation: [
              0.483536034822464, 0.33687159419059753, -0.20870360732078552,
              0.7804827094078064,
            ],
            translation: [
              7.358891487121582, 4.958309173583984, 6.925790786743164,
            ],
          },
          {
            mesh: 0,
            name: "Torus",
            scale: [0.7128448486328125, 0.7128448486328125, 0.7128448486328125],
          },
        ],
        materials: [
          {
            doubleSided: true,
            emissiveFactor: [0.27902206778526306, 0.5199682712554932, 1],
            name: "Material.001",
            pbrMetallicRoughness: {
              baseColorFactor: [
                0.05667726323008537, 0.5679765939712524, 0.8000000715255737, 1,
              ],
              metallicFactor: 0,
              roughnessFactor: 1,
            },
          },
        ],
        meshes: [
          {
            name: "Torus",
            primitives: [
              {
                attributes: { POSITION: 0, NORMAL: 1, TEXCOORD_0: 2 },
                indices: 3,
                material: 0,
              },
            ],
          },
        ],
        accessors: [
          {
            bufferView: 0,
            componentType: 5126,
            count: 150,
            max: [0.1961740255355835, 0.020665571093559265, 0.1961740255355835],
            min: [
              -0.1961740255355835, 0.0008523659780621529, -0.1961740255355835,
            ],
            type: "VEC3",
          },
          { bufferView: 1, componentType: 5126, count: 150, type: "VEC3" },
          { bufferView: 2, componentType: 5126, count: 150, type: "VEC2" },
          { bufferView: 3, componentType: 5123, count: 282, type: "SCALAR" },
        ],
        bufferViews: [
          { buffer: 0, byteLength: 1800, byteOffset: 0 },
          { buffer: 0, byteLength: 1800, byteOffset: 1800 },
          { buffer: 0, byteLength: 1200, byteOffset: 3600 },
          { buffer: 0, byteLength: 564, byteOffset: 4800 },
        ],
        buffers: [{ byteLength: 5364, uri: "/assets/reticle.bin" }],
      },
    };
  },

  // watch: {
  // '$route.params.product_id'(newVal, oldVal) {
  //   if (newVal !== oldVal) {
  //     window.location.reload()
  //   }
  // },
  // },
  mounted() {
    console.log("yaha tak:");
    // this.debugStatus = "Mounted, loading product...";
    this.fetchProductDetails()

    // this.fetchProductDetails()
    //   .then(() => {
    //     console.log("✅ Product loaded, model URL ready:", this.modelUrl);
    //     this.waitForAFrame();
    //   })
    //   .catch((err) => {
    //     console.error("❌ Failed to fetch product:", err);
    //     this.isLoading = false;
    //   });

    // // Wait until A-Frame scene exists before attaching listeners
    // this.waitForSceneAndBind();
  },

  beforeUnmount() {
    if (this.scene) {
      this.scene.pause();
    }
  },

  methods: {
    goto_product_Route(product) {
  this.$router.push({
    name: 'buisness_product',
    params: {
      buisness_name: product.business_slug,
      product_type: 'product',
      product_id: product.id
    }
  }).then(() => {
    // Reload AFTER navigation is done
    window.location.reload();
  }).catch(err => {
    console.error("Navigation failed:", err);
  });
},

  async addToCart() {
    if (!this.ProductDetails || !this.ProductDetails.id) {
      this.$message.error('Product not found');
      return;
    }

    this.cartLoading = true;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${this.$store.state.root_api}cart/add/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            product_type: this.ProductDetails.is_ceiling_light_product ? 'light' : 'furniture',
            product_id: this.ProductDetails.id,
            quantity: 1
          })
        }
      );
      
      const result = await response.json();
      
      if (response.ok) {
        this.$message.success('Added to cart!');
      } else {
        this.$message.error(result.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error:', error);
      this.$message.error('Error adding to cart');
    } finally {
      this.cartLoading = false;
    }
  },

    startDrag(e) {
      this.startY = e.touches[0].clientY;
    },

    onDrag(e) {
      this.currentY = e.touches[0].clientY;
      this.dragAmount = this.currentY - this.startY;

      // Swipe DOWN → close
      if (this.dragAmount > 50) {
        this.isOpen = false;
      }

      // Swipe UP → open
      if (this.dragAmount < -50) {
        this.isOpen = true;
      }
    },

    endDrag() {
      this.startY = 0;
      this.currentY = 0;
      this.dragAmount = 0;
    },
    //--------------
    initARView() {
      console.log("Startt exxxxxx");
      this.fetchProductDetails()
        .then(() => {
          console.log("✅ Product loaded, model URL ready:", this.modelUrl);
          this.waitForAFrame();
        })
        .catch((err) => {
          console.error("❌ Failed to fetch product:", err);
          this.isLoading = false;
        });

      // Wait until A-Frame scene exists before attaching listeners
      this.waitForSceneAndBind();
    },
    async endARSession() {
      try {
        console.log("Ending AR Session...");

        const scene = document.querySelector("a-scene");

        // -----------------------------
        // 1. End XR session cleanly
        // -----------------------------
        if (scene) {
          const xrSystem = scene.systems?.webxr;
          const session = xrSystem?.session;

          if (session) {
            try {
              await session.end();
              console.log("XR session terminated.");
            } catch (err) {
              console.warn("Error ending XR session:", err);
            }
          }
        }

        // -----------------------------
        // 2. Stop Camera Stream
        // -----------------------------
        const videoEl = document.querySelector("video");

        if (videoEl?.srcObject) {
          const tracks = videoEl.srcObject.getTracks();

          tracks.forEach((track) => {
            try {
              track.stop();
            } catch (err) {
              console.warn("Failed to stop track:", err);
            }
          });

          videoEl.srcObject = null;
          console.log("Camera stopped successfully.");
        }

        // -----------------------------
        // 3. Remove A-SCENE completely
        // -----------------------------
        await new Promise((resolve) => setTimeout(resolve, 50)); // small delay

        const arWrapper = document.getElementById("ar-wrapper");

        if (arWrapper) {
          arWrapper.innerHTML = ""; // removes <a-scene>, <canvas>, WebGL context
          console.log("A-Frame scene removed from DOM.");
        }

        // -----------------------------
        // 4. Clear WebGL Animation Loop
        // -----------------------------
        if (scene?.renderer?.setAnimationLoop) {
          scene.renderer.setAnimationLoop(null);
          console.log("Animation loop cleared.");
        }

        // -----------------------------
        // 6. Restore body overflow & UI
        // -----------------------------
        document.body.style.overflow = "auto";

        this.isSessionStarted = false;
        this.stage = 1;
        window.location.reload();
        console.log("AR cleanup complete.");
      } catch (error) {
        console.error("Fatal AR cleanup error:", error);
      }
    },

    IncreasesStage() {
      if (this.stage > 0 && this.stage < 4) {
        this.stage = Number(this.stage) + 1;
      }
      if (this.stage === 3) {
        this.initARView();
      }
    },
    DecreaseStage() {
      if (this.stage > 2 && this.stage <= 4) {
        this.stage += Number(this.stage) - 1;
      }
    },
    bindTouchRotation() {
      const scene = document.querySelector("a-scene");
      // Wait until WebXR canvas exists
      const canvas = scene?.renderer?.xr?.getSession
        ? scene.renderer.domElement
        : scene?.canvas;

      if (!canvas) {
        return setTimeout(() => this.bindTouchRotation(), 300);
      }
      canvas.addEventListener("touchstart", this.handleTouchStart, {
        passive: false,
      });
      canvas.addEventListener("touchmove", this.handleTouchMove, {
        passive: false,
      });
      canvas.addEventListener("touchend", this.handleTouchEnd);
    },
    waitForSceneAndBind() {
      // Try immediately
      let scene = document.querySelector("a-scene");

      if (scene) {
        console.log("📌 Scene found, waiting for load...");
        scene.addEventListener("loaded", () => {
          this.bindARListeners();
        });
        return;
      }

      // If scene not yet available, wait and retry
      setTimeout(() => {
        scene = document.querySelector("a-scene");
        if (scene) {
          scene.addEventListener("loaded", () => {
            this.bindARListeners();
          });
        }
      }, 300);
    },
    bindARListeners() {
      const scene = document.querySelector("a-scene");
      const canvas = scene?.canvas;

      if (!canvas) {
        return setTimeout(this.bindARListeners, 300);
      }

      canvas.addEventListener("touchstart", this.handleTouchStart, {
        passive: false,
      });
      canvas.addEventListener("touchmove", this.handleTouchMove, {
        passive: false,
      });
      canvas.addEventListener("touchend", this.handleTouchEnd);
    },
    enableTouchRotate() {
      const dino = document.getElementById("dino");
      if (!dino) return;

      let lastX = 0;
      let isDragging = false;

      dino.addEventListener("touchstart", (e) => {
        isDragging = true;
        lastX = e.touches[0].clientX;
      });

      dino.addEventListener("touchmove", (e) => {
        if (!isDragging) return;

        const currentX = e.touches[0].clientX;
        const deltaX = currentX - lastX;

        const rotation = dino.getAttribute("rotation");
        rotation.y += deltaX * 0.4; // adjust sensitivity

        dino.setAttribute("rotation", rotation);
        lastX = currentX;
      });

      dino.addEventListener("touchend", () => {
        isDragging = false;
      });
    },

    hideStartButton() {
      // Select the button using the class you styled
      const arButton = document.querySelector(".a-enter-ar-button");
      if (arButton) {
        arButton.style.setProperty("display", "none", "important");
      }
    },
    toggleFullscreen() {
      this.fullScreenMode = !this.fullScreenMode;
    },
    async existFullScreen() {
      this.fullScreenMode = false;
    },

    //methods for moving models
    handleTouchStart(e) {
      if (!this.dino) return;
      this.isDragging = true;
      this.startX = e.touches[0].clientX;
    },

    handleTouchMove(e) {
      if (!this.isDragging || !this.dino) return;

      const dx = e.touches[0].clientX - this.startX;
      this.startX = e.touches[0].clientX;

      // Rotate around model's own pivot
      this.dino.object3D.rotation.y += dx * 0.01;
    },

    handleTouchEnd() {
      this.isDragging = false;
    },

    async fetchProductDetails() {
      try {
        this.isLoading=true
        const productId = this.$route.params.product_id;
        if (!productId) {
          throw new Error('Product ID not found in route parameters');
        }

        let token = localStorage.getItem('token');
        const apiUrl = `${this.$store.state.root_api}product/api/product-details/${productId}/`;

        console.log('📡 Fetching from:', apiUrl);

        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Token ${token}`;
        }

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: headers,
          credentials: 'omit'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);

        if (!result.success || !result.data) {
          throw new Error(result.message || 'Failed to fetch product details');
        }
        this.ProductDetails=result.data
        const dimensions = result.data.dimensions || {};
        this.diamensions = {
          width: parseFloat(dimensions.width) || 0.7,
          height: parseFloat(dimensions.height) || 1.2,
          depth: parseFloat(dimensions.depth || dimensions.length) || 0.6
        };

        console.log('✅ Product Dimensions (meters):', this.diamensions);

        
        this.modelUrl=`${this.$store.state.root_media_api}${result.data['3d_model']}`;
        if (!this.modelUrl) {
          console.error('Available fields in result.data:', Object.keys(result.data));
          throw new Error('No 3D model URL found in product data');
        }

        // this.modelUrl = modelUrl;
        // this.modelUrl = "https://y5hhig196j7rwq-8000.proxy.runpod.net/media/products/3d_models/c3.glb";
        console.log('✅ Model URL:', this.modelUrl);
        console.log('✅ Product Data Loaded');
        
      } catch (error) {
        console.error('❌ Error loading product details:', error);
        this.error = error.message || 'Failed to load product. Please try again.';
      }
      this.isLoading=false
    },

    // async fetchProductDetails() {
    //   this.modelUrl =
    //     "https://rawcdn.githack.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb";
    // },
    waitForAFrame() {
      let attempts = 0;
      const maxAttempts = 50;
      console.log("wait for Arame:exxxxx");
      const checkAFrame = setInterval(() => {
        attempts++;
        this.debugStatus = `Checking A-Frame (${attempts}/${maxAttempts})...`;

        if (window.AFRAME && window.AFRAME.version) {
          clearInterval(checkAFrame);
          this.debugStatus = "A-Frame loaded!";
          console.log("✓ A-Frame loaded:", window.AFRAME.version);

          this.registerAFrameComponents();
          this.checkARSupport();

          setTimeout(() => {
            console.log("🎯 Creating scene with model URL:", this.modelUrl);
            this.createScene();
          }, 300);
        }

        if (attempts >= maxAttempts) {
          clearInterval(checkAFrame);
          this.error = "A-Frame failed to load. Make sure it is in index.html";
          this.isLoading = false;
          this.debugStatus = "ERROR: A-Frame not loaded";
          console.error("A-Frame not available");
        }
      }, 100);
    },

    async checkARSupport() {
      try {
        this.debugStatus = "Checking AR support...";
        if (navigator.xr) {
          const supported = await navigator.xr.isSessionSupported(
            "immersive-ar"
          );
          if (supported) {
            this.arStatus = "✓ AR Supported";
            console.log("✓ AR is supported");
          } else {
            this.arStatus = "⚠ AR Not Supported";
            console.warn("AR not supported on this device");
          }
        } else {
          this.arStatus = "⚠ WebXR Not Available";
          console.warn("WebXR not available");
        }
      } catch (err) {
        this.arStatus = "✗ Error checking AR";
        console.error("AR check error:", err);
      }
    },

    registerAFrameComponents() {
      if (!window.AFRAME) return;
      const self = this;

      if (!AFRAME.components["stable-floor-plane"]) {
        AFRAME.registerComponent("stable-floor-plane", {
          schema: { opacity: { default: 0.2 } },
          init: function () {
            this.el.sceneEl.addEventListener("enter-vr", (ev) => {
              if (this.el.sceneEl.is("ar-mode")) {
                this.el.setAttribute("visible", true);
                this.el.setAttribute("position", "0 -0.01 0");
              }
            });
            this.el.sceneEl.addEventListener("exit-vr", (ev) => {
              this.el.setAttribute("visible", false);
            });
          },
        });
      }

      if (!AFRAME.components["enhanced-ar-hit-test"]) {
        AFRAME.registerComponent("enhanced-ar-hit-test", {
          init: function () {
            this.xrHitTestSource = null;
            this.viewerSpace = null;
            this.refSpace = null;
            this.lastValidPosition = null;
            this.smoothingFactor = 0.7;

            this.el.sceneEl.renderer.xr.addEventListener(
              "sessionstart",
              (ev) => {
                let session = this.el.sceneEl.renderer.xr.getSession();
                let hitTestComponent = this;

                self.floorDetection = "Initializing floor detection...";
                self.debugStatus = "AR session started";
                self.isSessionStarted = true;
                self.shouldShowStatus = false;
                self.hideStartButton();
                session.addEventListener("select", function () {
                  let instruction = document.getElementById("tap-instruction");
                  if (!self.modelPlaced) {
                    let reticlePos = document
                      .getElementById("reticle-marker")
                      .getAttribute("position");
                    let dino = document.getElementById("dino");
                    let light = document.getElementById("light");

                    self.fixedModelPosition = { ...reticlePos };
                    self.modelPlaced = true;

                    if (dino) {
                      dino.setAttribute("position", reticlePos);
                      dino.setAttribute("visible", true);
                      if (instruction)
                        instruction.setAttribute("visible", false);
                    }
                    if (reticlePos) {
                      reticlePos.setAttribute("visible", true);
                    }

                    if (light) {
                      light.setAttribute("position", {
                        x: reticlePos.x - 2,
                        y: reticlePos.y + 4,
                        z: reticlePos.z + 2,
                      });
                    }

                    self.floorDetection =
                      "✓ Model FIXED at:\nX: " +
                      reticlePos.x.toFixed(2) +
                      "\nY: " +
                      reticlePos.y.toFixed(2) +
                      "\nZ: " +
                      reticlePos.z.toFixed(2) +
                      "\n\n[Tap again to reset]";
                  } else {
                    self.modelPlaced = false;
                    self.fixedModelPosition = null;
                    self.floorDetection =
                      "Scanning for floor...\nPoint at a flat surface";
                  }
                });

                session.requestReferenceSpace("viewer").then((space) => {
                  hitTestComponent.viewerSpace = space;
                  session
                    .requestHitTestSource({
                      space: hitTestComponent.viewerSpace,
                    })
                    .then((hitTestSource) => {
                      hitTestComponent.xrHitTestSource = hitTestSource;
                      self.floorDetection = "✓ Floor detection active";
                    })
                    .catch((err) => {
                      self.floorDetection = "✗ Hit test failed";
                    });
                });

                session
                  .requestReferenceSpace("local-floor")
                  .then((space) => {
                    hitTestComponent.refSpace = space;
                  })
                  .catch((err) => {
                    session.requestReferenceSpace("local").then((space) => {
                      hitTestComponent.refSpace = space;
                    });
                  });
              }
            );

            this.el.sceneEl.renderer.xr.addEventListener("sessionend", (ev) => {
              this.viewerSpace = null;
              this.refSpace = null;
              this.xrHitTestSource = null;
              self.floorDetection = "AR Session Ended";
            });
          },

          tick: function () {
            if (this.el.sceneEl.is("ar-mode")) {
              if (self.modelPlaced) {
                return;
              }

              if (!this.viewerSpace || !this.refSpace) return;

              let frame = this.el.sceneEl.frame;
              let xrViewerPose = frame.getViewerPose(this.refSpace);

              if (this.xrHitTestSource && xrViewerPose) {
                let hitTestResults = frame.getHitTestResults(
                  this.xrHitTestSource
                );

                if (hitTestResults.length > 0) {
                  let pose = hitTestResults[0].getPose(this.refSpace);
                  let inputMat = new THREE.Matrix4();
                  inputMat.fromArray(pose.transform.matrix);

                  let position = new THREE.Vector3();
                  position.setFromMatrixPosition(inputMat);

                  if (this.lastValidPosition) {
                    position.x = THREE.MathUtils.lerp(
                      this.lastValidPosition.x,
                      position.x,
                      1 - this.smoothingFactor
                    );
                    position.y = THREE.MathUtils.lerp(
                      this.lastValidPosition.y,
                      position.y,
                      1 - this.smoothingFactor
                    );
                    position.z = THREE.MathUtils.lerp(
                      this.lastValidPosition.z,
                      position.z,
                      1 - this.smoothingFactor
                    );
                  }
                  const cam = this.el.sceneEl.camera;
                  const dist = cam.position.distanceTo(position);

                  position.y = Math.max(position.y, 0.01);

                  this.el.setAttribute("position", position);
                  this.el.setAttribute("visible", "true");
                  this.lastValidPosition = position.clone();

                  self.floorDetection =
                    "Floor detected ✓\nX: " +
                    position.x.toFixed(2) +
                    " Y: " +
                    position.y.toFixed(2) +
                    " Z: " +
                    position.z.toFixed(2) +
                    "\n\n[Tap to place model]";
                } else {
                  self.floorDetection =
                    "Scanning for floor...\nPoint at a flat surface";
                  this.el.setAttribute("position", { x: 0, y: -0.5, z: -2 });
                  this.el.setAttribute("visible", "true");
                }
              }
            }
          },
        });
      }
    },

    createScene() {
      this.$nextTick(() => {
        const container = document.getElementById("ar-scene-container");
        if (!container) {
          console.log("Container not found, retrying...");
          setTimeout(() => this.createScene(), 500);
          return;
        }
        this.createSceneInContainer(container);
      });
    },

    createSceneInContainer(container) {
      this.debugStatus = "Creating A-Frame scene...";
      this.loadingMessage = "Creating 3D scene...";
      console.log("Model URL:", this.modelUrl);

      const reticleJSONUpdated = JSON.parse(JSON.stringify(this.reticleJSON));
      reticleJSONUpdated.buffers[0].uri =
        window.location.origin + "/assets/reticle.bin";

      const reticleJsonString = JSON.stringify(reticleJSONUpdated);
      const reticleDataUrl =
        "data:application/json;base64," + btoa(reticleJsonString);

      const sceneHTML = `
       <a-scene
  webxr="requiredFeatures: hit-test,local-floor; optionalFeatures: dom-overlay; overlayElement: .ar-app;"
  renderer="colorManagement: true; physicallyCorrectLights: true;"
>
          <a-assets>
            <a-asset-item id="spinosaurus" src="${this.modelUrl}" response-type="arraybuffer" crossorigin="anonymous"></a-asset-item>
            <a-asset-item id="info">Tap to place</a-asset-item>
            <a-asset-item id="reticle" src="${reticleDataUrl}" response-type="json" crossorigin="anonymous"></a-asset-item>
          </a-assets>

          <a-camera position="0 1.2 0"></a-camera>

          <a-entity id="reticle-marker" position="0 -0.5 -2" gltf-model="#reticle" scale="0.5 0.5 0.5" enhanced-ar-hit-test shadow="cast: false; receive: false" rotation="0 0 0" visible="false">
            <a-entity id="tap-instruction"
          position="0 1 0"
          visible="true"
          text="value: Tap to place; align: center; color: black; width: 2.5;"
          geometry="primitive: plane; width: 1.2; height: 0.3; radius: 15;"
          material="color: white; opacity: 0.85;"
          >
          </a-entity>
            <a-plane position="0 0 0" rotation="-90 0 0" width="0.5" height="0.5" material="color: cyan; opacity: 0.3; transparent: true;"></a-plane>
          </a-entity>

          <a-entity id="dino" position="0 -2 -5" scale="${this.modelScale+0.5} ${this.modelScale+0.5} ${this.modelScale+0.5}" shadow="cast: true; receive: false"  visible="false">
            <a-entity position="0 0 0" rotation="0 0 0" gltf-model="#spinosaurus" animation-mixer shadow="cast: true; receive: false"></a-entity>
          </a-entity>

          <a-plane id="shadowPlane" height="100" width="100" rotation="-90 0 0" position="0 0 0" shadow="receive: true; cast: false" material="color: #ffffff; transparent: true; opacity: 0.001;"></a-plane>

          <a-light type="hemisphere" intensity="1.2" color="#ffffff"></a-light>

          <a-light type="directional" id="light" target="dino" position="5 8 5" intensity="1.5" light="castShadow: true; shadowMapHeight: 2048; shadowMapWidth: 2048; shadowCameraLeft: -15; shadowCameraRight: 15; shadowCameraBottom: -15; shadowCameraTop: 15; shadowCameraFar: 30; shadowCameraNear: 0.1; shadowBias: -0.0001;"></a-light>

          <a-light type="directional" position="-5 6 -3" intensity="0.6"></a-light>
        </a-scene>
      `;

      try {
        container.innerHTML = sceneHTML;
        this.sceneInitialized = true;

        setTimeout(() => {
          this.scene = document.querySelector("a-scene");
          this.modelObject = document.querySelector("#dino a-entity");
          this.dino = document.getElementById("dino");
          this.enableTouchRotate();
          this.light = document.getElementById("light");
          this.bindTouchRotation();

          if (this.scene && this.scene.renderer) {
            this.scene.renderer.shadowMap.enabled = true;
            this.scene.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          }

          if (this.scene) {
            this.debugStatus = "Scene ready!";
            this.loadingMessage = "AR Ready...";
            this.isLoading = false;
            this.arStatus = "✓ AR Ready...";
            // this.floorDetection = "Point camera at floor...";
            console.log("✓ AR Scene initialized successfully");
          }
        }, 2000);
      } catch (err) {
        console.error("Error creating scene:", err);
        this.error = "Error: " + err.message;
        this.isLoading = false;
      }
    },

    setSize(scale) {
      this.modelScale = scale;
      if (this.dino) {
        this.dino.setAttribute("scale", { x: scale, y: scale, z: scale });
      }
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
