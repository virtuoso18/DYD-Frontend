<template>
  <div v-if="Business_User_Looking_Another_business_user_mini_site">
      <!-- Blur Overlay when modal is active -->
    <div 
      
      class="plan-block-overlay"
    >
      <!-- Modal -->
      <div class="plan-block-modal">
        <div class="modal-content">
         <div class="mb-5 flex justify-center">
  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ff4d4f" stroke-width="2">
    <g>
      <circle cx="6" cy="12" r="3" fill="none" class="animate-pulse" style="animation-delay: 0s;"/>
      <circle cx="12" cy="12" r="3" fill="none" class="animate-pulse" style="animation-delay: 0.5s;"/>
      <circle cx="18" cy="12" r="3" fill="none" class="animate-pulse" style="animation-delay: 1s;"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke-dasharray="4 4" class="opacity-50"/>
    </g>
  </svg>
</div>
          <h2>Another Business Product</h2>
          <p>The business users is not allowed to explore the another business products.</p>
          <!-- <p>Please upgrade to a premium plan to view this content.</p> -->
          
          <div class="modal-actions" >
            <!-- <a-button type="primary" size="large" @click="goToPricing">
              Upgrade Plan
            </a-button> -->
            <a-button  type="primary" size="large" @click="goBack">
              Go Back
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
    <div v-else>
    <!-- ✅ Loading state — while plan is being fetched -->
    <div
      v-if="!planLoaded"
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 60vh;
      "
    >
      <a-spin size="large" tip="Loading..." />
    </div>

    <!-- ✅ BASIC PLAN — show upgrade wall -->
    <div
      v-else-if="planLoaded && isBasicPlan"
      style="
        max-width: 480px;
        margin: 80px auto;
        text-align: center;
        padding: 48px 32px;
        background: white;
        border-radius: 20px;
        border: 1px solid #e9ecef;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      "
    >
      <!-- Icon -->
      <div
        style="position: relative; display: inline-block; margin-bottom: 24px"
      >
        <div
          style="
            position: absolute;
            inset: 0;
            background: #ef4444;
            filter: blur(24px);
            opacity: 0.2;
            border-radius: 50%;
          "
        ></div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="72"
          height="72"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ef4444"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="position: relative"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>

      <div v-if="is_expired_or_un_active_business_plan">
          <h2>Non Active Business</h2>
          <p>This business is not belongs to any purchase plan, so this does not have any AR feature for this product available.</p>
            
          </div>
          <div v-else>
              
      <!-- Title -->
      <h2
        style="
          font-size: 26px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 12px;
        "
      >
        Feature Locked 🔒
      </h2>

      <!-- Description -->
      <p
        style="
          font-size: 15px;
          color: #6b7280;
          margin-bottom: 8px;
          line-height: 1.6;
        "
      >
        Business User Owning The Product Is On Basic Plan 
        That doesn't include access to
        <span style="font-weight: 600; color: #111827">Product Details</span>.
      </p>

      <p style="font-size: 13px; color: #9ca3af; margin-bottom: 32px">
        Upgrade to Standard or Premium to unlock full product details and more!
      </p>

     <div style="display: flex; flex-direction: column; gap: 12px">
        <button
  v-if="user && user.user_type === 'Business'"
  @click="$router.push('/pricing')"
  style="
    width: 100%;
    height: 44px;
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    color: white;
    font-weight: 600;
    font-size: 15px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
  "
  @mouseenter="$event.target.style.transform = 'translateY(-2px)'"
  @mouseleave="$event.target.style.transform = 'translateY(0)'"
>
  ⚡ Upgrade Now
</button>


        <button
          @click="$router.go(-1)"
          style="
            width: 100%;
            height: 44px;
            background: #f3f4f6;
            color: #374151;
            font-weight: 600;
            font-size: 14px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
          "
        >
          Go Back
        </button>
      </div>
    
    </div>


      <!-- Actions -->
     

      <!-- Feature list -->
      <div
        style="
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        "
      >
        <p style="font-size: 12px; color: #9ca3af; margin-bottom: 12px">
          Included in Standard & Premium:
        </p>
        <div
          style="
            display: flex;
            flex-direction: column;
            gap: 8px;
            text-align: left;
          "
        >
          <div
            v-for="feature in [
              'Full Product Details',
              'Furniture & Light Products',
              'Floor & Wall Textures',
              'Pagination & Search',
            ]"
            :key="feature"
            style="
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 13px;
              color: #374151;
            "
          >
            <svg
              style="flex-shrink: 0; color: #10b981"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
            {{ feature }}
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ STANDARD / PREMIUM — show full template -->
    <div v-else style="max-width: 1200px; margin: auto">
      <show_floorTexture_product
        :selectedTexture="selectedProduct"
        v-if="selectedProduct !== null && product_type === 'floor'"
      />
      <show_wallTexture_product
        :selectedTexture="selectedProduct"
        v-if="selectedProduct !== null && product_type === 'wall'"
      />
      <show_furniture_product
        :selectedProduct="selectedProduct"
        v-if="
          selectedProduct !== null &&
          product_type === 'product' &&
          selectedProduct.is_ceiling_light_product === false
        "
      />
      <show_Light_product_3D
        :selectedProduct="selectedProduct"
        v-if="
          selectedProduct &&
          product_type === 'product' &&
          selectedProduct.is_ceiling_light_product === true &&
          selectedProduct.light_type == 'hanging'
        "
        @back_product_list="backToList"
      />
      <show_Light_product_sunk
        :selectedProduct="selectedProduct"
        v-if="
          selectedProduct &&
          product_type === 'product' &&
          selectedProduct.is_ceiling_light_product === true &&
          selectedProduct.light_type == 'sunk'
        "
        @back_product_list="backToList"
      />
      <show_Light_product_unsunk
        :selectedProduct="selectedProduct"
        v-if="
          selectedProduct &&
          product_type === 'product' &&
          selectedProduct.is_ceiling_light_product === true &&
          selectedProduct.light_type == 'unsunk'
        "
        @back_product_list="backToList"
      />

      <br />

      <div
        style="
          padding: 10px;
          background-color: white;
          border-radius: 10px;
          border: 2px solid rgba(128, 128, 128, 0.16);
        "
      >
        <h3>View more Products</h3>
        <div style="text-align: center; padding: 0px">
          <div v-if="loading" style="padding: 40px">
            <a-spin size="large" />
          </div>
          <buisnes_products_sailing v-else :products="our_products" />
          <div
            v-if="!loading && totalProducts > 0"
            style="margin-top: 20px; padding: 20px; text-align: center"
          >
            <a-pagination
              v-model:current="currentPage"
              v-model:pageSize="pageSize"
              :total="totalProducts"
              :show-size-changer="true"
              :show-total="(total) => `Total ${total} products`"
              :page-size-options="['10', '20', '30', '50', '100']"
              @change="handlePageChange"
              @showSizeChange="handlePageSizeChange"
            />
          </div>
          <div
            v-if="!loading && our_products.length === 0"
            style="padding: 40px"
          >
            <a-empty description="No products found" />
          </div>
        </div>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
// show existing
import show_floorTexture_product from "@/components/general_user/product_details/floor_texture.vue";
import show_wallTexture_product from "@/components/general_user/product_details/wall_texture.vue";
import show_furniture_product from "@/components/general_user/product_details/furniture_product.vue";

// different Light Products Details Component
import show_Light_product_sunk from "@/components/general_user/product_details/light_product_sunk.vue";
import show_Light_product_unsunk from "@/components/general_user/product_details/light_product_ununk.vue";
import show_Light_product_3D from "@/components/general_user/product_details/light_product_3d.vue";

import buisnes_products_sailing from "@/components/general_user/buisness_page/products_sailing.vue";

export default {
  name: "products_details",
  components: {
    buisnes_products_sailing,
    show_floorTexture_product,
    show_wallTexture_product,
    show_furniture_product,
    show_Light_product_sunk,
    show_Light_product_unsunk,
    show_Light_product_3D,
  },
  data() {
    return {
        selectedProduct: null,
       user: JSON.parse(localStorage.getItem('user')),
       anonyomusUser:localStorage.getItem('token'),
      product_id: this.$route.params.product_id,
      product_type: this.$route.params.product_type,
      buisness_name: this.$route.params.buisness_name,
      our_products: [],

      showPlanBlockModal: false,
      is_expired_or_un_active_business_plan:false,
      Business_User_Looking_Another_business_user_mini_site:false,

      // Pagination
      currentPage: 1,
      pageSize: 10,
      totalProducts: 0,
      loading: false,
      error: null,

      // ✅ Plan
      currentPlanName: undefined,
      business_available_actions: undefined,
      planLoading: false,
      planLoaded: false,
    };
  },

  computed: {
    // ✅ Reactive plan check
    isBasicPlan() {
      if (!this.currentPlanName) return false;
      return this.currentPlanName.toLowerCase() === "basic";
    },
  },

  async mounted() {
    if (localStorage.getItem('token') && ((JSON.parse(localStorage.getItem("user")).user_type ==="Business") && (JSON.parse(localStorage.getItem("business_profile")).slug !== this.$route.params.buisness_name))){
      this.Business_User_Looking_Another_business_user_mini_site=true
    }
    else{

      // ✅ Step 1 — load plan FIRST before anything renders
      await this.loadBrandPurchasedPlanDetails();
      
      // ✅ Step 2 — only load product data if not basic
      if (!this.isBasicPlan) {
        this.fetchProductDetails();
        this.loadBusinessProducts();
      }
    }
  },

  methods: {
    // ✅ Plan loader
    async loadBrandPurchasedPlanDetails() {
      if (this.planLoading || this.planLoaded) return;
      this.planLoading = true;
      try {
        const brandSlug = this.buisness_name; // ✅ already in route params
        if (!brandSlug) {
          this.currentPlanName = null;
          return;
        }
        const url = `${this.$store.state.root_api}subscription/api/get-business-plan-details/${brandSlug}/`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (result.success && result.data) {
          this.currentPlanName = result.data.plan_name;
          this.business_available_actions = result.data;
                  this.is_expired_or_un_active_business_plan=result.is_expired
          
          console.log("✅ Plan loaded:", this.currentPlanName);
        } else {
          this.currentPlanName = null;
        }
      } catch (error) {
        console.error("Plan load failed:", error);
        this.currentPlanName = null;
      } finally {
        this.planLoading = false;
        this.planLoaded = true;
      }
    },

    async loadBusinessProducts(page = 1, page_size = null) {
      try {
        this.loading = true;
        this.error = null;

        const token = localStorage.getItem("token");

        // Build URL with pagination parameters
        const params = new URLSearchParams({
          page: page,
          page_size: page_size || this.pageSize,
        });

        const url = `${this.$store.state.root_api}Auth/api/business/products-sold/${this.buisness_name}?${params}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        console.log("Pagination Response:", result);

        if (result.results && result.results.success) {
          this.our_products = result.results.data;
          this.totalProducts = result.count || 0;
        } else {
          this.error = result.message || "Business not found";
          this.our_products = [];
          this.totalProducts = 0;
        }
      } catch (error) {
        console.error("Error loading business data:", error);
        this.error = "Failed to load business information";
        this.our_products = [];
        this.totalProducts = 0;
      } finally {
        this.loading = false;
      }
    },

    handlePageChange(page, pageSize) {
      console.log("Page changed to:", page);
      this.currentPage = page;
      this.loadBusinessProducts(page, pageSize);

      // Optional: Scroll to top of products section
      this.scrollToProducts();
    },

    handlePageSizeChange(current, size) {
      console.log("Page size changed to:", size);
      this.pageSize = size;
      this.currentPage = 1; // Reset to first page when changing page size
      this.loadBusinessProducts(1, size);

      // Optional: Scroll to top of products section
      this.scrollToProducts();
    },

    scrollToProducts() {
      // Smooth scroll to products section
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    async fetchProductDetails() {
      try {
        let url_product_details = `${this.$store.state.root_api}product/api/light-details/${this.product_id}/`;

        if (this.product_type === "wall") {
          url_product_details = `${this.$store.state.root_api}product/api/wall-details/${this.product_id}/`;
        }
        if (this.product_type === "floor") {
          url_product_details = `${this.$store.state.root_api}product/api/floor-details/${this.product_id}/`;
        }
        if (this.product_type === "product") {
          url_product_details = `${this.$store.state.root_api}product/api/product-details/${this.product_id}/`;
        }

        const token = localStorage.getItem("token");
        const response = await fetch(`${url_product_details}`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const result = await response.json();
        console.log(result);

        if (result.success) {
          const data = result.data;
          this.selectedProduct = data;
        }
      } catch (error) {
        console.error("Error loading business profile:", error);
      }
    },
  },
};
</script>

<style scoped>
/* Optional: Add custom styling for pagination */
.ant-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}




.post-card {
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0px;
  border-radius: 12px;
  background: white;
  /* transition: all 0.3s ease; */
  height: 100%;
  display: flex;
  flex-direction: column;
}

.post-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  /* transform: translateY(-2px); */
}

/* Fixed tags overlay positioning */
.tags-overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 70%;
  z-index: 2;
}

.view-count-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  z-index: 2;
}

/* ✅ ADD THESE STYLES */
.plan-block-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(252, 250, 250, 0.436);
  backdrop-filter: blur(10px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.plan-block-modal {
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rotate-prohibited {
  animation: slowSpin 4s linear infinite;
}

@keyframes slowSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.plan-block-modal h2 {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 16px;
}

.plan-block-modal p {
  font-size: 16px;
  color: #595959;
  line-height: 1.6;
  margin-bottom: 12px;
}

.plan-block-modal p strong {
  color: #ff4d4f;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.modal-actions .ant-btn {
  min-width: 140px;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
}

.content-blurred {
  filter: blur(8px);
  pointer-events: none;
  user-select: none;
}

@media (max-width: 768px) {
  .plan-block-modal {
    padding: 30px 20px;
  }
  
  .plan-block-modal h2 {
    font-size: 22px;
  }
  
  .plan-block-modal p {
    font-size: 14px;
  }
  
  .modal-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .modal-actions .ant-btn {
    width: 100%;
  }
}


.pinned-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: #1890ff;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 2;
}

.post-stats {
  display: flex;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 16px;
  transition: background-color 0.2s ease;
  font-size: 14px;
  color: #666;
}

.stat-item:hover {
  background-color: #f5f5f5;
}

.stat-item.large {
  padding: 8px 16px;
  font-size: 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  margin: 0 8px 8px 0;
}

.stat-item.large:hover {
  background-color: #e9ecef;
}

.stat-item span {
  font-size: 13px;
  font-weight: 500;
}

.stat-item.large span {
  font-size: 14px;
  font-weight: 600;
}
</style>
