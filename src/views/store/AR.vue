<template>
  <div class="ar-app" ref="containerRef">
    <!-- Top Navigation Bar -->
    <div v-if="showNavbar" class="ar-navbar">
      <span class="back-button" @click="goBack">
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
          <path
            d="M4.75 0.75L0.75 4.75L4.75 8.75"
            stroke="#1A1A1A"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        Back
      </span>
      <div class="ar-status-badge">{{ statusMessage }}</div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- 3D Model Viewer with Occlusion Support -->
       
      <div class="model-viewer-container" v-if="ProductDetails">
        

<div style="padding:10px;width:100%" v-if="!isAuthenticated">
  <a-alert
message="Login required"
type="info"
closable
>
<!-- description="Info Description Info Description Info Description Info Description" -->
<template #action>
  <a-space direction="vertical">
    <a-button size="small" type="primary" @click.stop="this.$router.push('/login')">Login</a-button>
    <!-- <a-button size="small" danger type="ghost">Decline</a-button> -->
  </a-space>
</template>
</a-alert>

</div>
        <model-viewer
          ref="modelViewer"
          :src="this.$store.state.root_media_api+selected3DModelUrl"
          :ios-src="usdzModelUrl"
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          touch-action="pan-y"
          auto-rotate
          shadow-intensity="1"
          :alt="ProductDetails.name"
          :ar-scale="`fixed ${ProductDetails.dimensions.width}m ${ProductDetails.dimensions.height}m ${ProductDetails.dimensions.length}m`"
          environment-image="neutral"
          exposure="1"
          shadow-softness="1"
          class="model-viewer"
          @error="handleModelError"
          @ar-status="handleARStatus"
          @load="handleModelLoad"
        >
          <a-button
            slot="ar-button"
            size="medium"
            type="primary"
            class="ar-button-overlay"
            style="max-width:70%"
            @click="prepareARWithOcclusion"
          >
            <span>View in Your Space</span>
          </a-button>
          <!-- Loading -->
          <div slot="poster" class="model-loading">
            <div class="spinner"></div>
            <p>Loading 3D Model...</p>
          </div>

          <!-- Progress Bar -->
          <div slot="progress-bar" class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: loadingProgress + '%' }"
            ></div>
          </div>
        </model-viewer>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-toast">
      <div class="error-content">
        <strong>{{ error }}</strong>
        <p v-if="errorDetails">{{ errorDetails }}</p>
      </div>
      <button @click="dismissError" class="close-button">×</button>
    </div>

    <!-- AR Instructions Toast -->
    <div v-if="showARInstructions" class="ar-instructions-toast">
      <div class="instruction-content">
        <p>
          <strong>{{ arInstructionText }}</strong>
        </p>
        <p class="instruction-subtitle">{{ arInstructionSubtext }}</p>
      </div>
      <button @click="showARInstructions = false" class="close-button">
        ×
      </button>
    </div>

    <!-- Instruction Modal -->
    <div v-if="showInstructionModal" class="instruction-modal-overlay">
      <div class="instruction-modal">
        <!-- Back Button -->
        <button class="modal-back-button" @click="goToPreviousInstruction">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Back
        </button>

        <!-- Instruction Content -->
        <div class="instruction-modal-content">
          <!-- Step 1 -->
          <div v-if="step === 1" class="instruction-step">
            <div class="instruction-image">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                <rect width="200" height="200" rx="20" fill="#F0F4FF" />
                <circle cx="100" cy="80" r="30" fill="#667EEA" opacity="0.2" />
                <path d="M100 50L115 75H85L100 50Z" fill="#667EEA" />
                <path
                  d="M70 110H130V150H70V110Z"
                  fill="#667EEA"
                  opacity="0.6"
                />
                <circle cx="90" cy="130" r="5" fill="white" />
                <circle cx="110" cy="130" r="5" fill="white" />
                <path
                  d="M85 145H115"
                  stroke="white"
                  stroke-width="3"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <div class="instruction-text">
              <h4><b>Find a Flat Surface</b></h4>
              <p style="font-size:12px">
                Point your camera at a flat surface like a floor or table. Move
                your device slowly to help it detect the surface.
              </p>
            </div>
          </div>

          <!-- Step 2 -->
          <div v-if="step === 2" class="instruction-step">
            <div class="instruction-image">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                <rect width="200" height="200" rx="20" fill="#F0F4FF" />
                <circle cx="100" cy="100" r="60" fill="#667EEA" opacity="0.1" />
                <circle cx="100" cy="100" r="40" fill="#667EEA" opacity="0.2" />
                <path
                  d="M80 100L95 115L120 85"
                  stroke="#667EEA"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M50 100H70M130 100H150M100 50V70M100 130V150"
                  stroke="#667EEA"
                  stroke-width="3"
                  stroke-linecap="round"
                  opacity="0.4"
                />
              </svg>
            </div>
            <div class="instruction-text">
              <h4><b>Place & Interact</b></h4>
              <p style="font-size:12px">
                Tap on the screen to place the furniture. You can pinch to
                resize, and drag with one finger to rotate the item.
              </p>
            </div>
          </div>
        </div>

        <!-- Continue Button -->
        <div style="width:100%;display:flex;justify-content:center">
          <a-button type="primary" size="medium" style="margin:auto" @click="goToNextInstruction">
            {{ step === 2 ? "Start AR" : "Continue" }}
          </a-button>
        </div>
        <br><br>
      </div>
    </div>

    <!-- Draggable Bottom Drawer (Shown in AR Mode) -->
    <div
      v-if="!isFullScreen && ProductDetails"
      class="ar-drawer"
      :class="{
        'drawer-collapsed': drawerState === 'collapsed',
        'drawer-expanded': drawerState === 'expanded',
      }"
      :style="{
        transform: `translateY(calc(100% - ${currentDrawerHeight}px))`,
      }"
    >
      <!-- Drag Handle -->
      <div
        class="drawer-handle"
        @touchstart="handleDrawerTouchStart"
        @touchmove="handleDrawerTouchMove"
        @touchend="handleDrawerTouchEnd"
        @mousedown="handleDrawerMouseDown"
      >
        <div class="handle-bar"></div>
      </div>

      <!-- Drawer Content -->
      <div class="drawer-content" @click.stop>
        <div class="product-card">
          <div class="product-header">
            <div class="product-info">
              <h2>{{ ProductDetails.name }}</h2>
              <div class="price-section">
                <span class="current-price">${{ ProductDetails.pricing.current_price }}</span>
                <span v-if="ProductDetails.pricing.is_on_sale" class="discount">SALE</span>
              </div>

              <!-- Colors Section -->
              <a-col :span="24">
                <div style="margin-bottom: 8px; font-weight: 500;">Colors:</div>
                <a-alert 
                  v-if="showColorAlert"
                  type="warning"
                  :message="`No model associated with ${selectedColorHex} color. Hence showing model for primary color.`"
                  closable
                  @close="showColorAlert = false"
                  style="margin-bottom: 12px;"
                />
                <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                  <div v-for="(color, index) in ProductDetails.colors.available_colors"
                    :key="color.id"
                    @click="selectColor(index, color)"
                    :class="[
                      'w-6 h-6 rounded-full transition-all cursor-pointer',
                      color.model_file_colored_product 
                        ? 'border-2 hover:shadow-md' 
                        : 'outline outline-2 outline-red-500 outline-offset-2 hover:shadow-[0_0_8px_rgba(239,68,68,0.3)]',
                      selectedColorIndex === index ? 'border-blue-500 border-4' : 'border-gray-100'
                    ]"
                    :style="{ backgroundColor: color.color }"
                    :title="`${color.color}${!color.model_file_colored_product ? ' (No 3D model)' : ''}`"
                  ></div>
                </div>
              </a-col>
            </div>
        
            <div class="cart-controller-sec">
              <a-button
                type="primary"
                title="add to cart"
                class="cart-button"
                shape="circle"
                @click="addToCart"
                :disabled="!hasToken"
              >
                <ShoppingCartOutlined style="font-size: 20px" />
              </a-button>
              <a-button class="cart-button" title="fullscreen mode" type="primary" shape="circle" @click="toggleFullScreen">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M3 3H8M3 3V8M3 3L8 8"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17 3H12M17 3V8M17 3L12 8"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3 17H8M3 17V12M3 17L8 12"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17 17H12M17 17V12M17 17L12 12"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a-button>
            </div>
          </div>

          <!-- Product Details -->
          <div class="product-details">
            <h3>Product Details</h3>
            <div class="detail-section">
              <h4>Dimensions</h4>
              <p>Width: {{ProductDetails.dimensions.width}}" | Height: {{ProductDetails.dimensions.height}}" | Depth: {{ProductDetails.dimensions.length}}"</p>
            </div>
          </div>
 <!-- Action Buttons -->
          <div class="action-buttons">
            <a-button type="primary" @click="goto_product_Route(ProductDetails)" block size="large" style="font-size:20px;display: flex;justify-content: center;align-items:center; width:100%">
              <IssuesCloseOutlined />See Product
            </a-button>
          </div>
          <!-- Variants Section -->
          <div v-if="ProductDetails.variants && ProductDetails.variants.length > 0" class="variants-section">
            <h3>Available Variants</h3>
            <a-row>
              <a-col :span="12" 
              v-for="variant in ProductDetails.variants"
              :key="variant.id"
             style="border:1px solid rgba(0,0,0,0.2);padding:5px;border-radius:10px"
              :class="{ 'variant-selected': currentProduct.id === variant.id }"
              @click="selectVariant(variant)"
              >
              
                <div class="variant-image-wrapper">
                  <img 
                    v-if="variant.primary_image" 
                    :src="this.$store.state.root_media_api+variant.primary_image" 
                    :alt="variant.name"
                    class="variant-image"
                  />
                  <div v-else class="variant-image-placeholder">No Image</div>
                </div>
                <div class="variant-info">
                  <p class="variant-name">{{ variant.name }}</p>
                  
                  <a-row>
                    
                    <a-col :span="12" >Price</a-col>
                    <a-col :span="12" style="color:blue;font-weight:bold;text-align:end">${{ variant.pricing.current_price }}</a-col>

                    <a-col :span="12" >Color</a-col>
                    <a-col :span="12" style="display: flex;justify-content: end;">
                      <div style="width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #e8e8e8;" :style="{ backgroundColor: variant.primary_color }"></div>
                    </a-col>
                  </a-row>
                  
                  <!-- {{ variant }} -->
                </div>
                 
              </a-col>
              </a-row>
            </div>
          

         
        </div>
      </div>
    </div>

    <!-- Exit Full Screen Button (Bottom Right) -->
    <button
      v-if="isFullScreen"
      class="exit-fullscreen-button"
      @click="toggleFullScreen"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M8 3H3V8"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M3 3L9 9"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M16 3H21V8"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M21 3L15 9"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8 21H3V16"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M3 21L9 15"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M16 21H21V16"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M21 21L15 15"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<script>
import { ArrowLeftOutlined, HeartOutlined, IssuesCloseOutlined, ShoppingCartOutlined } from "@ant-design/icons-vue";

export default {
  name: "ARProductView",
  data() {
    return {
      step: 0,
      productName: "Modern Accent Chair",
      hasToken: '',
      
      // UI State
      showNavbar: false,
      statusMessage: "Ready",
      error: null,
      errorDetails: "",
      showARInstructions: false,
      arInstructionText: "",
      arInstructionSubtext: "",
      loadingProgress: 0,
      showInstructionModal: false,

      // AR Features
      occlusionSupported: false,
      depthSensingSupported: false,
      isARActive: false,
      isFullScreen: false,

      // Device Detection
      deviceInfo: "Detecting...",
      arSupportType: "Checking...",
      arStatusClass: "checking",
      isIOS: false,
      isAndroid: false,
      iosVersion: null,

      // Drawer State
      drawerState: "collapsed",
      collapsedHeight: 100,
      expandedHeight: 300,
      currentDrawerHeight: 100,
      isDragging: false,
      startY: 0,
      startHeight: 0,
      dragVelocity: 0,
      lastY: 0,
      lastTime: 0,
      
      // Product Data
      ProductDetails: null,
      currentProduct: null,
      glbModelUrl: "",
      usdzModelUrl: "",

      // Color Selection
      selectedColorIndex: null,
      selectedColorHex: null,
      showColorAlert: false,
    };
  },

  components: {
    ArrowLeftOutlined,
    HeartOutlined, 
    IssuesCloseOutlined,
    ShoppingCartOutlined,
  },

  computed: {
    windowHeight() {
      return window.innerHeight;
    },
      isAuthenticated() {
    return !!localStorage.getItem('token')
  },
    selected3DModelUrl() {
      if (this.selectedColorIndex !== null && 
          this.ProductDetails.colors && 
          this.ProductDetails.colors.available_colors[this.selectedColorIndex]) {
        
        const selectedColor = this.ProductDetails.colors.available_colors[this.selectedColorIndex];
        
        if (selectedColor.model_file_colored_product) {
          return selectedColor.model_file_colored_product;
        }
      }
      
      return this.ProductDetails['3d_model'];
    }
  },

  mounted() {
    this.hasToken = localStorage.getItem('token');
    this.detectDevice();
    this.loadModelViewer();
    this.checkOcclusionSupport();
    this.fetchProductDetails();
  },

  methods: {
    
     selectVariant(variant) {
      
      this.$router.push({
        name: this.$route.name,
        params: {
          ...this.$route.params,
          product_id: variant.id
        }
      }).then(() => {
        
        window.location.reload();
      }).catch(err => {
        console.error("Navigation failed:", err);
      });
    },

    goto_product_Route(product) {
      this.$router.push({
        name: 'buisness_product',
        params: {
          buisness_name: product.business_slug,
          product_type: 'product',
          product_id: product.id
        }
      }).then(() => {
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

    async fetchProductDetails() {
      try {
        this.isLoading = true;
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
        console.log('Product Details:', result);

        if (!result.success || !result.data) {
          throw new Error(result.message || 'Failed to fetch product details');
        }

        this.ProductDetails = result.data;
        this.currentProduct = result.data;
        
        const dimensions = result.data.dimensions || {};
        this.dimensions = {
          width: parseFloat(dimensions.width) || 0.7,
          height: parseFloat(dimensions.height) || 1.2,
          depth: parseFloat(dimensions.depth || dimensions.length) || 0.6
        };

        console.log('✅ Product Dimensions (meters):', this.dimensions);
        console.log('✅ Product Data Loaded with', result.data.variants.length, 'variants');
        
      } catch (error) {
        console.error('❌ Error loading product details:', error);
        this.error = error.message || 'Failed to load product. Please try again.';
      }
      this.isLoading = false;
    },

    async loadModelViewer() {
      if (!customElements.get("model-viewer")) {
        const script = document.createElement("script");
        script.type = "module";
        script.src =
          "https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js";

        script.onload = () => {
          console.log("✅ model-viewer loaded");
          this.checkModelViewerReady();
        };

        script.onerror = () => {
          this.error = "Failed to load 3D viewer";
          this.errorDetails = "Please refresh the page and try again.";
        };

        document.head.appendChild(script);
      } else {
        this.checkModelViewerReady();
      }
    },

    checkModelViewerReady() {
      const checkInterval = setInterval(() => {
        const viewer = this.$refs.modelViewer;
        if (viewer) {
          console.log("✅ model-viewer element ready");
          clearInterval(checkInterval);

          viewer.setAttribute("camera-orbit", "0deg 75deg 105%");
          viewer.setAttribute("min-camera-orbit", "auto auto 5%");
          viewer.setAttribute("max-camera-orbit", "auto auto 500%");
        }
      }, 100);

      setTimeout(() => clearInterval(checkInterval), 5000);
    },

    async checkOcclusionSupport() {
      if (navigator.xr) {
        try {
          const depthSupported = await navigator.xr.isSessionSupported(
            "immersive-ar"
          );

          if (depthSupported) {
            console.log("Checking depth-sensing support...");
            this.depthSensingSupported = true;

            if (this.isIOS && this.iosVersion >= 14) {
              this.occlusionSupported = true;
              console.log("✅ iOS occlusion supported via ARKit");
            } else if (this.isAndroid) {
              this.occlusionSupported = true;
              console.log("✅ Android occlusion supported via ARCore");
            }
          }
        } catch (err) {
          console.log("Occlusion check:", err.message);

          if (this.isAndroid || (this.isIOS && this.iosVersion >= 14)) {
            this.occlusionSupported = true;
            console.log("✅ Occlusion available via native AR");
          }
        }
      } else {
        if (this.isAndroid || (this.isIOS && this.iosVersion >= 14)) {
          this.occlusionSupported = true;
          console.log("✅ Occlusion available via native AR (no WebXR)");
        }
      }
    },

    detectDevice() {
      const ua = navigator.userAgent;

      this.isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

      if (this.isIOS) {
        const match = ua.match(/OS (\d+)_(\d+)_?(\d+)?/);
        if (match) {
          this.iosVersion = parseInt(match[1]);
        }

        this.deviceInfo = `iPhone/iPad (iOS ${this.iosVersion || "?"})`;

        if (this.iosVersion >= 14) {
          this.arSupportType = "✅ ARKit with Occlusion";
          this.arStatusClass = "supported";
        } else if (this.iosVersion >= 12) {
          this.arSupportType = "✅ AR Quick Look";
          this.arStatusClass = "supported";
        } else {
          this.arSupportType = "⚠️ iOS 12+ Required";
          this.arStatusClass = "unsupported";
        }
      } else if (/Android/.test(ua)) {
        this.isAndroid = true;
        this.deviceInfo = "Android Device";
        this.arSupportType = "✅ ARCore with Occlusion";
        this.arStatusClass = "supported";
      } else {
        this.deviceInfo = "Desktop Browser";
        this.arSupportType = "❌ Mobile Required";
        this.arStatusClass = "unsupported";
      }
    },

    prepareARWithOcclusion(event) {
      event.preventDefault();
      event.stopPropagation();

      this.step = 1;
      this.showInstructionModal = true;
    },

    goToNextInstruction() {
      if (this.step === 1) {
        this.step = 2;
      } else if (this.step === 2) {
        this.step = 3;
        this.showInstructionModal = false;
        this.launchAR();
      }
    },

    goToPreviousInstruction() {
      if (this.step === 1) {
        this.step = 0;
        this.showInstructionModal = false;
      } else if (this.step === 2) {
        this.step = 1;
      } else if (this.step === 3) {
        this.step = 0;
        this.showInstructionModal = false;
      }
    },

    launchAR() {
      console.log("Launching AR...");

      this.isARActive = true;
      this.drawerState = "collapsed";
      this.currentDrawerHeight = this.collapsedHeight;
      this.isFullScreen = false;

      if (this.occlusionSupported) {
        this.showARInstructions = true;
        this.arInstructionText = "Realistic AR Mode Active! ✨";
        this.arInstructionSubtext =
          "Real objects will naturally block the model. Move around to see the effect!";

        setTimeout(() => {
          this.showARInstructions = false;
        }, 4000);
      } else {
        this.showARInstructions = true;
        this.arInstructionText = "AR Mode";
        this.arInstructionSubtext =
          "Note: Model will appear on top of objects (occlusion not available on this device)";

        setTimeout(() => {
          this.showARInstructions = false;
        }, 3000);
      }

      const viewer = this.$refs.modelViewer;
      if (viewer && viewer.canActivateAR) {
        viewer.activateAR();
      }
    },

    toggleFullScreen() {
      this.isFullScreen = !this.isFullScreen;

      if (this.isFullScreen) {
        this.currentDrawerHeight = 0;
      } else {
        this.drawerState = "collapsed";
        this.currentDrawerHeight = this.collapsedHeight;
      }
    },

    handleDrawerTouchStart(e) {
      if (this.isFullScreen) return;

      this.isDragging = true;
      this.startY = e.touches[0].clientY;
      this.startHeight = this.currentDrawerHeight;
      this.lastY = e.touches[0].clientY;
      this.lastTime = Date.now();
      this.dragVelocity = 0;
    },

    handleDrawerTouchMove(e) {
      if (!this.isDragging || this.isFullScreen) return;

      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = this.startY - currentY;
      const currentTime = Date.now();
      const deltaTime = currentTime - this.lastTime;

      if (deltaTime > 0) {
        this.dragVelocity = (currentY - this.lastY) / deltaTime;
      }

      this.lastY = currentY;
      this.lastTime = currentTime;

      let newHeight = this.startHeight + deltaY;

      newHeight = Math.max(
        this.collapsedHeight,
        Math.min(this.expandedHeight, newHeight)
      );

      this.currentDrawerHeight = newHeight;
    },

    handleDrawerTouchEnd(e) {
      if (!this.isDragging || this.isFullScreen) return;

      this.isDragging = false;

      const midpoint = (this.collapsedHeight + this.expandedHeight) / 2;
      const threshold = 50;

      const hasVelocity = Math.abs(this.dragVelocity) > threshold;

      if (hasVelocity) {
        if (this.dragVelocity < 0) {
          this.expandDrawer();
        } else {
          this.collapseDrawer();
        }
      } else {
        if (this.currentDrawerHeight > midpoint) {
          this.expandDrawer();
        } else {
          this.collapseDrawer();
        }
      }
    },

    expandDrawer() {
      this.drawerState = "expanded";
      this.animateDrawerTo(this.expandedHeight);
    },

    collapseDrawer() {
      this.drawerState = "collapsed";
      this.animateDrawerTo(this.collapsedHeight);
    },

    animateDrawerTo(targetHeight) {
      const startHeight = this.currentDrawerHeight;
      const distance = targetHeight - startHeight;
      const duration = 300;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeProgress = 1 - Math.pow(1 - progress, 3);

        this.currentDrawerHeight = startHeight + distance * easeProgress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.currentDrawerHeight = targetHeight;
        }
      };

      requestAnimationFrame(animate);
    },

    handleDrawerMouseDown(e) {
      if (this.isFullScreen) return;

      this.isDragging = true;
      this.startY = e.clientY;
      this.startHeight = this.currentDrawerHeight;
      this.lastY = e.clientY;
      this.lastTime = Date.now();
      this.dragVelocity = 0;

      const handleMouseMove = (e) => {
        if (!this.isDragging) return;

        const currentY = e.clientY;
        const deltaY = this.startY - currentY;
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastTime;

        if (deltaTime > 0) {
          this.dragVelocity = (currentY - this.lastY) / deltaTime;
        }

        this.lastY = currentY;
        this.lastTime = currentTime;

        let newHeight = this.startHeight + deltaY;
        newHeight = Math.max(
          this.collapsedHeight,
          Math.min(this.expandedHeight, newHeight)
        );

        this.currentDrawerHeight = newHeight;
      };

      const handleMouseUp = () => {
        if (!this.isDragging) return;

        this.isDragging = false;

        const midpoint = (this.collapsedHeight + this.expandedHeight) / 2;
        const threshold = 50;

        const hasVelocity = Math.abs(this.dragVelocity) > threshold;

        if (hasVelocity) {
          if (this.dragVelocity < 0) {
            this.expandDrawer();
          } else {
            this.collapseDrawer();
          }
        } else {
          if (this.currentDrawerHeight > midpoint) {
            this.expandDrawer();
          } else {
            this.collapseDrawer();
          }
        }

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },

    handleModelLoad(event) {
      console.log("Model loaded successfully");
      this.loadingProgress = 100;

      // if (this.isIOS || this.isAndroid) {
      //   setTimeout(() => {
      //     this.showARInstructions = true;

      //     if (this.occlusionSupported) {
      //       this.arInstructionText = "Try Realistic AR! ✨";
      //       this.arInstructionSubtext =
      //         "Tap the AR button to see this product blend naturally with your space";
      //     } else {
      //       this.arInstructionText = "Try AR Now!";
      //       this.arInstructionSubtext =
      //         "Tap the AR button to place this product in your space";
      //     }

      //     setTimeout(() => {
      //       this.showARInstructions = false;
      //     }, 1000);
      //   }, 1000);
      // }
    },

    handleModelError(event) {
      console.error("Model loading error:", event);
      this.error = "Failed to load 3D model";
      this.errorDetails =
        "The 3D model could not be loaded. Please check your internet connection.";
    },

    handleARStatus(event) {
      console.log("AR Status:", event.detail);

      if (event.detail.status === "not-presenting") {
        console.log("AR session ended");
        this.statusMessage = "Ready";
        this.isARActive = false;
        this.isFullScreen = false;
      } else if (event.detail.status === "session-started") {
        console.log("AR session started");
        this.statusMessage = "AR Active";
        this.isARActive = true;
      } else if (event.detail.status === "failed") {
        this.error = "AR Failed";
        this.errorDetails = "Could not start AR session. Please try again.";
        this.isARActive = false;
        this.isFullScreen = false;
      }
    },

    goBack() {
      if (this.isARActive) {
        this.isARActive = false;
        this.isFullScreen = false;
      } else {
        window.history.back();
      }
    },

    dismissError() {
      this.error = null;
      this.errorDetails = "";
    },

    selectColor(index, color) {
      this.selectedColorIndex = index;
      
      if (!color.model_file_colored_product) {
        this.selectedColorHex = color.color;
        this.showColorAlert = true;
      } else {
        this.showColorAlert = false;
      }
      
      this.updateModelViewerSource();
    },

    updateModelViewerSource() {
      const viewer = this.$refs.modelViewer;
      if (viewer) {
        const newUrl = this.selected3DModelUrl;
        viewer.src = newUrl;
        console.log('✅ Model updated to:', newUrl);
      }
    },
  },
};
</script>

<style scoped>
.ar-app {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #f8f9fa;
  overflow-x: hidden;
}

.ar-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #1a1a1a;
}

.ar-status-badge {
  flex: 1;
  background: #e8f5e9;
  color: #2e7d32;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
}

.main-content {
  width: 100%;
  max-width: 100%;
}

.model-viewer-container {
  position: relative;
  width: 100%;
  height: 80vh;
  min-height: 400px;
}

.model-viewer {
  width: 100%;
  height: 100%;
  background: transparent;
}

.model-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  color: #666;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e0e0e0;
  border-top-color: #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.ar-button-overlay {
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  z-index: 10;
}

.ar-button-overlay:active {
  transform: translateX(-50%) scale(0.95);
}

.error-toast,
.ar-instructions-toast {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  padding: 16px 20px;
  border-radius: 12px;
  z-index: 2000;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  animation: slideUp 0.3s ease-out;
}

.error-toast {
  background: #ff4d4f;
  color: white;
  box-shadow: 0 8px 24px rgba(255, 77, 79, 0.4);
}

.ar-instructions-toast {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.error-content strong,
.instruction-content strong {
  display: block;
  margin-bottom: 6px;
  font-size: 15px;
}

.error-content p,
.instruction-content p {
  font-size: 13px;
  opacity: 0.95;
  margin: 0;
  line-height: 1.4;
}

.instruction-subtitle {
  font-size: 12px !important;
  margin-top: 4px !important;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  line-height: 1;
  opacity: 0.9;
}

.close-button:hover {
  opacity: 1;
}

.instruction-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.instruction-modal {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: slideInUp 0.4s ease;
  overflow: hidden;
}

@keyframes slideInUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.modal-back-button:hover {
  background: rgba(0, 0, 0, 0.1);
}

.modal-back-button:active {
  transform: scale(0.95);
}

.instruction-modal-content {
  flex: 1;
  /* overflow-y: auto; */
  padding: 80px 32px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.instruction-step {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.instruction-image {
  margin-bottom: 32px;
  animation: floatIn 0.6s ease;
}

@keyframes floatIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.instruction-text {
  width: 100%;
}

.instruction-text h3 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.instruction-text p {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin: 0 0 12px 0;
}

.instruction-tip {
  background: linear-gradient(135deg, #fff4e6 0%, #ffe7ba 100%);
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px !important;
  color: #d46b08 !important;
  margin-top: 20px !important;
  font-weight: 500;
}

.ar-drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15);
  z-index: 1500;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: transform;
  touch-action: none;
}

.drawer-handle {
  position: relative;
  padding: 12px 20px 8px;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.drawer-handle:active {
  cursor: grabbing;
}

.handle-bar {
  width: 40px;
  height: 4px;
  background: #d9d9d9;
  border-radius: 2px;
}

.drawer-content {
  height: 300px;
  max-height: calc(350px - 5px);
  padding: 0 20px 20px;
  overflow-y: auto;
  padding-bottom:40px;
}

.product-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.product-info {
  flex: 1;
}

.product-info h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.current-price {
  font-size: 24px;
  font-weight: 700;
  color: #1890ff;
}

.discount {
  background: #ff4d4f;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.cart-controller-sec {
  width: 100px;
  display: flex;
  justify-content: space-around;
}

.cart-button {
  display: flex;
  justify-content: center;
  align-items: center;
}

.cart-button:active {
  transform: scale(0.95);
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-details h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-section p {
  font-size: 15px;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.5;
}

.variants-section {
  padding-top: 12px;
  border-top: 1px solid #e8e8e8;
}

.variants-section h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.variant-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.variant-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
  transform: translateY(-2px);
}

.variant-card.variant-selected {
  border-color: #1890ff;
  background: rgba(24, 144, 255, 0.08);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.25);
}

.variant-image-wrapper {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.variant-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.variant-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
  background: #f5f5f5;
}

.variant-info {
  width: 100%;
}

.variant-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.variant-price {
  font-size: 14px;
  font-weight: 700;
  color: #1890ff;
  margin: 0 0 6px 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 8px;
}

.exit-fullscreen-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  z-index: 2000;
  transition: all 0.3s ease;
  animation: pulseIn 0.5s ease;
}

@keyframes pulseIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.exit-fullscreen-button:hover {
  background: rgba(0, 0, 0, 0.85);
  transform: scale(1.05);
}

.exit-fullscreen-button:active {
  transform: scale(0.95);
}

@media (max-width: 480px) {
  .instruction-modal {
    max-height: 90vh;
  }

  .instruction-modal-content {
    padding: 70px 24px 24px;
  }

  .instruction-text h3 {
    font-size: 24px;
  }

  .instruction-text p {
    font-size: 15px;
  }

  .product-info h2 {
    font-size: 18px;
  }

  .current-price {
    font-size: 20px;
  }

  .exit-fullscreen-button {
    width: 48px;
    height: 48px;
    bottom: 20px;
    right: 20px;
  }

  .variants-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
}
</style>