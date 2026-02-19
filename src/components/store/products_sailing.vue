<template>
  <div class="sm:!main">
    
    <!-- ✅ FULL-SCREEN MODAL OVERLAY (shows product page with blur + modal) -->
     <a-modal
      v-model:open="showAccessModal"
      title=""
      centered
      width="100%"
      :footer="null"
      :maskClosable="true"
      :closable="true"
      @cancel="closeModalAndNavigateBack"
      wrapClassName="product-access-fullscreen-modal"
      :bodyStyle="{ padding: 0, height: '100vh' }"
    >
      <!-- Background: Product Page Preview -->
      <div class="blurred-product-page">
        
        <!-- ✅ LOADING SKELETON (shows immediately) -->
        <div v-if="!iframeLoaded" class="product-page-skeleton">
          <div class="skeleton-header">
            <div class="skeleton-back-btn"></div>
            <div class="skeleton-title"></div>
          </div>
          <div class="skeleton-content">
            <div class="skeleton-image"></div>
            <div class="skeleton-info">
              <div class="skeleton-line"></div>
              <div class="skeleton-line short"></div>
              <div class="skeleton-line"></div>
            </div>
          </div>
        </div>

        <!-- ✅ ACTUAL IFRAME (hidden until loaded) -->
        <iframe 
          v-show="iframeLoaded"
          v-if="productPageUrl"
          :src="productPageUrl" 
          class="product-iframe"
          @load="onIframeLoad"
        ></iframe>
      </div>

      <!-- Upgrade Modal (On Top) -->
      <div class="upgrade-modal-overlay">
        <div class="upgrade-modal-content">
          <!-- Icon -->
          <div class="modal-icon">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="#FBBF24"
                stroke="#FBBF24"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <!-- Heading -->
          <h2 class="modal-heading">Upgrade to Access AR Products</h2>

          <!-- Message -->
          <p class="modal-message">
            This product includes <strong>AR (Augmented Reality)</strong> features. 
            Upgrade to <strong>Standard</strong> or <strong>Premium</strong> to access full product details.
          </p>

          <!-- Buttons -->
          <a-space direction="vertical" style="width: 100%">
            <a-button
              type="primary"
              block
              size="large"
              class="upgrade-button"
              @click="handleUpgrade"
            >
              Upgrade Plan
            </a-button>
            <a-button
              block
              size="large"
              class="back-button"
              @click="closeModalAndNavigateBack"
            >
              Go Back
            </a-button>
          </a-space>
        </div>
      </div>
    </a-modal>

    <!-- Product List -->
    <div class="products-list">
      <a-row>
        <a-col
          v-for="product in products"
          :key="product.product_id"
          class="product-responsive p-1 sm:p-2"
          style="text-align: start"
        >
          <div class="product">
            <div
              class="product-image-container relative"
              style="overflow: hidden"
              @click="handleProductClick(product)"
            >
              <!-- Skeleton -->
              <div
                v-if="!imageLoadedMap[product.id]"
                class="product-skeleton"
              ></div>

              <!-- Preload image -->
              <img
                :src="this.$store.state.root_media_api + product.product_image"
                style="position: absolute; width: 0; height: 0; opacity: 0"
                @load="onProductImageLoad(product.id)"
                alt=""
              />

              <!-- Visible image -->
              <img
                v-show="imageLoadedMap[product.id]"
                :src="this.$store.state.root_media_api + product.product_image"
                :alt="product.product_title"
                class="product-image"
              />

              <!-- Category Badge -->
              <div class="category-badge">{{ product.category_name }}</div>

              <!-- AR Badge -->
              <div class="ar-badge">AR</div>
            </div>

            <a-row>
              <a-col :span="24" style="padding-top: 10px">
                <b class="truncate block">{{
                  truncateText(
                    product.product_title || "No title available",
                    22,
                  )
                }}</b>
              </a-col>

              <a-col :span="16"> Colors </a-col>

              <a-col
                span="8"
                style="display: flex; justify-content: end; gap: 4px"
              >
                <div
                  v-for="(c, i) in product.product_colors.slice(0, 2)"
                  :key="i"
                  style="width: 20px; height: 20px; border-radius: 20px"
                  :style="{ background: c.color || c.color_hex }"
                ></div>
              </a-col>

              <a-col span="12"> Price </a-col>

              <a-col span="12" style="text-align: end">
                <b>${{ product.product_price }}</b>
              </a-col>

              <a-col span="16">
                <a-button
                  @click="handleProductClick(product)"
                  class="w-full !text-[10px] sm:!text-[12px]"
                  style="font-family: var(--font-family-main)"
                >
                  Product Details
                </a-button>
              </a-col>

              <a-col span="1"></a-col>
              <a-col span="4" class="flex items-center">
                <a-button
                  @click="
                    toggleFavorite(product.product_id, product.type, product)
                  "
                  class="!flex !items-center !justify-center"
                >
                  <template v-if="product.is_favorited">
                    <HeartFilled style="color: red" class="!m-0" />
                  </template>
                  <template v-else>
                    <HeartOutlined class="!m-0" />
                  </template>
                </a-button>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>


<script>
import { HeartOutlined, HeartFilled } from "@ant-design/icons-vue";

export default {
  name: "buisnes_products_sailing",
  components: {
    HeartOutlined,
    HeartFilled,
  },
  props: {
    products: Object,
  },
  data() {
    return {
      imageLoadedMap: {},
      business_available_actions: null,
      iframeLoaded: false,
      showAccessModal: false, // ✅ Modal state
      productPageUrl: null, // ✅ Store product page URL
      pendingProduct: null, // ✅ Store clicked product
    };
  },
  
  computed: {
    canAccessARProducts() {
      return this.hasFeature('ar_available_for_products');
    }
  },
  
  mounted() {
    this.loadBrandPurchasedPlanDetails();
  },
  
  methods: {
    // ✅ HELPER METHOD
    hasFeature(featureName) {
      if (!this.business_available_actions) {
        return false;
      }
      return this.business_available_actions[featureName] === true;
    },
    
    // ✅ API CALL TO GET BUSINESS PLAN
    async loadBrandPurchasedPlanDetails() {
      try {
        const brandSlug = this.$route.query.brand || 
                         (this.products && this.products[0]?.business_slug);
        
        if (!brandSlug) {
          console.warn('No brand slug found');
          return;
        }
        
        const url = `${this.$store.state.root_api}subscription/api/get-business-plan-details/${brandSlug}/`;
        
        console.log('Fetching plan details from:', url);

        const token = localStorage.getItem('token');
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Plan details received:', result);

        debugger
        
        if (result.business_available_actions) {
          this.business_available_actions = result.business_available_actions;
          localStorage.setItem(
            'business_available_actions', 
            JSON.stringify(result.business_available_actions)
          );
        }

      } catch (error) {
        console.error('Error loading plan details:', error);
        this.business_available_actions = {
          ar_available_for_products: false  

          //just add true here to open 
        };
      }
    },
    
    // ✅ BUILD PRODUCT PAGE URL
    buildProductPageUrl(product) {
      let produuct_type = "product";
      if (product.type == "light") {
        produuct_type = "product";
      } else if (product.type == "floor_texture") {
        produuct_type = "floor";
      } else if (product.type == "wall_texture") {
        produuct_type = "wall";
      } else {
        produuct_type = product.type;
      }
      
      // Build the full URL for iframe
      const baseUrl = window.location.origin;
      const route = this.$router.resolve({
        name: "buisness_product",
        params: {
          buisness_name: product.business_slug,
          product_type: produuct_type,
          product_id: product.product_id,
        },
      });
      
      return baseUrl + route.href;
    },
    
    // ✅ HANDLE PRODUCT CLICK
    async handleProductClick(product) {
      this.pendingProduct = product;
      
      // Check if AR feature is available
      if (!this.hasFeature('ar_available_for_products')) {

         this.iframeLoaded = false;
        // Build product page URL for iframe
        this.productPageUrl = this.buildProductPageUrl(product);
        
        // Show modal with blurred product page
        this.showAccessModal = true;
        this.$message.warning('Upgrade your plan to access AR Product Details');
        return;
      }
      
      // If access granted, navigate normally
      this.goto_product_Route(product);
    },
    
    // ✅ NORMAL NAVIGATION
    goto_product_Route(product) {
      let produuct_type = "product";
      if (product.type == "light") {
        produuct_type = "product";
      } else if (product.type == "floor_texture") {
        produuct_type = "floor";
      } else if (product.type == "wall_texture") {
        produuct_type = "wall";
      } else {
        produuct_type = product.type;
      }
      
      this.$router.push({
        name: "buisness_product",
        params: {
          buisness_name: product.business_slug,
          product_type: produuct_type,
          product_id: product.product_id,
        },
      });
    },
    
    // ✅ CLOSE MODAL AND RESET
    closeModalAndNavigateBack() {
      this.showAccessModal = false;
      this.productPageUrl = null;
      this.pendingProduct = null;
       this.iframeLoaded = false;
    },
    
    // ✅ HANDLE UPGRADE
    handleUpgrade() {
      this.showAccessModal = false;
      this.$message.success('Redirecting to upgrade page...');
      // TODO: Navigate to pricing page
      // this.$router.push('/pricing');
    },
    
    // ✅ IFRAME LOADED
     onIframeLoad() {
      console.log('Product page loaded in iframe');
      // Add small delay for smooth transition
      setTimeout(() => {
        this.iframeLoaded = true; // ✅ UPDATE THIS
      },);
    },
    
    truncateText(text, charLimit = 18) {
      if (!text) return "";
      if (text.length <= charLimit) return text;
      return text.slice(0, charLimit) + "...";
    },

    onProductImageLoad(id) {
      this.imageLoadedMap[id] = false;
      setTimeout(() => {
        this.imageLoadedMap[id] = true;
      }, 1000);
    },

    handleAddProduct() {
      console.log("Add product clicked");
    },

    handleProductDetail(product) {
      console.log("Product detail clicked:", product);
      this.$router.push(
        "/" +
          this.$route.params.buisness_name +
          "/" +
          product.product_type +
          "/" +
          product.product_id,
      );
    },

    async toggleFavorite(product_id, product_type, product) {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          this.$message.warning("Please login to add favorites");
          return;
        }

        const response = await fetch(
          `${this.$store.state.root_api}likes/favorites/toggle/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
              id: product_id,
              type: product_type,
            }),
          },
        );

        const data = await response.json();
        product.is_favorited = data.favorited;

        const message = data.favorited
          ? "Added to favorites"
          : "Removed from favorites";
        this.$message.success(message);
      } catch (error) {
        console.error("Favorite toggle failed", error);
        this.$message.error("Failed to update favorite");
      }
    },
  },
};
</script>



<style scoped>
.main {
  border-radius: 20px;
}

.head-section {
  display: flex;
  justify-content: space-between;
}

.product {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: #f3f2f4;
}

.products-list {
  padding-bottom: 20px;
}

.product-image-container {
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.product-skeleton {
  width: 100%;
  height: 100%;
  min-height: 180px;
  max-height: 180px;
  border-radius: 12px;
  background: linear-gradient(110deg, #e5e7eb 8%, #f9fafb 18%, #e5e7eb 33%);
  background-size: 200% 100%;
  animation: product-shimmer 1.6s infinite linear;
}

@keyframes product-shimmer {
  to {
    background-position-x: -200%;
  }
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.product-image-container:hover .product-image {
  transform: scale(1.05);
}

.category-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ar-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #e5e7eb;
  color: #374151;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.product-responsive {
  width: 50%;
  flex: 0 0 50%;
}

@media (min-width: 576px) {
  .product-responsive {
    width: 50%;
    flex: 0 0 50%;
  }
}

@media (min-width: 768px) {
  .product-responsive {
    width: 33.333%;
    flex: 0 0 33.333%;
  }
}

@media (min-width: 992px) {
  .product-responsive {
    width: 25%;
    flex: 0 0 25%;
  }
}

@media (min-width: 1200px) {
  .product-responsive {
    width: 20%;
    flex: 0 0 20%;
  }
}

/* ✅ FULLSCREEN MODAL STYLES */
.blurred-product-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  filter: blur(8px);
  pointer-events: none;
  overflow: hidden;
}

.product-iframe {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: none;
}

.loading-skeleton {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f5f5f5;
}

.upgrade-modal-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  width: 90%;
  max-width: 420px;
}

.product-page-skeleton {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
  padding: 20px;
  filter: blur(8px);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.skeleton-back-btn {
  width: 40px;
  height: 40px;
  background: linear-gradient(110deg, #e5e7eb 8%, #f9fafb 18%, #e5e7eb 33%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

.skeleton-title {
  flex: 1;
  height: 30px;
  background: linear-gradient(110deg, #e5e7eb 8%, #f9fafb 18%, #e5e7eb 33%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

.skeleton-content {
  display: flex;
  gap: 30px;
  padding: 20px;
}

.skeleton-image {
  width: 50%;
  height: 400px;
  background: linear-gradient(110deg, #e5e7eb 8%, #f9fafb 18%, #e5e7eb 33%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 12px;
}

.skeleton-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skeleton-line {
  height: 20px;
  background: linear-gradient(110deg, #e5e7eb 8%, #f9fafb 18%, #e5e7eb 33%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

.skeleton-line.short {
  width: 60%;
}

@keyframes shimmer {
  0% {
    background-position: 0% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Blurred Background */
.blurred-product-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  filter: blur(8px);
  pointer-events: none;
  overflow: hidden;
}

.product-iframe {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: none;
  background: #f5f5f5;
}

.upgrade-modal-content {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.modal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin: 0 auto 20px auto;
  border-radius: 50%;
  background: rgba(251, 191, 36, 0.15);
}

.modal-heading {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1f2937;
}

.modal-message {
  font-size: 15px;
  line-height: 1.6;
  color: #4b5563;
  margin-bottom: 28px;
}

.upgrade-button {
  height: 48px !important;
  font-size: 16px !important;
  border-radius: 8px !important;
}

.back-button {
  height: 48px !important;
  font-size: 16px !important;
  border-radius: 8px !important;
}
</style>

<style>
/* ✅ GLOBAL MODAL STYLES (outside scoped) */
.product-access-fullscreen-modal .ant-modal {
  max-width: 100vw !important;
  top: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
}

.product-access-fullscreen-modal .ant-modal-content {
  border-radius: 0 !important;
  box-shadow: none !important;
  height: 100vh;
}

.product-access-fullscreen-modal .ant-modal-body {
  height: 100vh;
  padding: 0 !important;
}

.product-access-fullscreen-modal .ant-modal-mask {
  background-color: rgba(0, 0, 0, 0.85) !important;
}

.product-access-fullscreen-modal .ant-modal-close {
  color: white !important;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  top: 20px;
  right: 20px;
}
</style>
