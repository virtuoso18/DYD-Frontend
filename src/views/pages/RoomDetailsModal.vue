<template>
  <Teleport to="body">
    <transition name="slide-up">
      <div
        v-if="visible"
        class="modal-overlay"
        @click="$emit('close')"
      >
        <div
          class="modal-container"
          @click.stop
        >
          <!-- Header -->
          <div class="modal-header">
            <!-- Mobile drag indicator -->
            <div class="drag-indicator"></div>
            <h2 class="modal-title">Room Details</h2>
            <button 
              @click="$emit('close')" 
              class="close-btn"
            >
              ✕
            </button>
          </div>

          <!-- Content -->
          <div class="modal-content">
            <!-- Desktop: 2 Column Layout | Mobile: Stacked -->
            <div class="content-grid">
              <!-- LEFT SIDE: Image + Info -->
              <div class="left-section">
                <!-- Image -->
                <div class="image-wrapper">
                  <a-image
                    :src="mediaBase + room.image"
                    :alt="room.name || 'Room image'"
                    class="room-image"
                  />
                </div>

                <!-- Tags below image -->
                <div class="tags-section">
                  <span class="tag tag-category">{{ room.category || 'Room' }}</span>
                  <span class="tag tag-type">{{ room.type || 'N/A' }}</span>
                  <span v-if="room.is_favorited" class="tag tag-favorite">⭐ Favorited</span>
                </div>

                <!-- Room Type & Design Type (from API) -->
                <div v-if="!loading && finalResults" class="api-tags">
                  <span v-if="finalResults.room_type" class="tag tag-room-type">
                    🏠 {{ finalResults.room_type }}
                  </span>
                  <span v-if="finalResults.room_design_type" class="tag tag-design">
                    🎨 {{ finalResults.room_design_type }}
                  </span>
                </div>

                <!-- Info Section -->
                <div class="info-section">
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="info-label">Added</span>
                      <span class="info-value">{{ formatDateShort(room.added_at) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- RIGHT SIDE: Products Used -->
              <div class="right-section">
                <div class="products-header">
                  <h3 class="products-title">
                    Products Used 
                    <span v-if="finalResults && finalResults.products_used" class="products-count">
                      ({{ finalResults.products_used.length }})
                    </span>
                  </h3>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="loading-state">
                  <div class="spinner"></div>
                  <span>Loading products...</span>
                </div>

                <!-- Products Grid -->
                <div v-else-if="finalResults && finalResults.products_used && finalResults.products_used.length > 0" class="products-wrapper">
                  <BusinessProductsSailing :products="finalResults.products_used" />

                   <!-- <a-col v-for="product in finalResults.products_used" :key="product.id"
                class="product-responsive" style="padding:5px;">
                <div class="product">
    
                    <div class="product-image-container" @click="goto_product_Route(product)">
                        <img 
                            :src="$store.state.root_media_api + product.image" 
                            :alt="product.name"
                            class="product-image"
                        />
                        <div class="category-badge">{{ product.category }}</div>
                    </div>
    
                    <a-row>
                        <a-col span="24">
                            <b
                              class="block w-full truncate"
                              :title="product.name"
                            >
                              {{ product.name || "No name available" }}
                            </b>
                          </a-col>

                          <a-col
                            span="16"
                            style="
                              font-family: 'Poppins', sans-serif;
                              font-size: 13px;
                              font-weight: 400;
                            "
                          >
                            Color
                          </a-col>

                          <a-col
                            span="8"
                            style="display: flex; justify-content: end"
                          >
                            <div
                              v-for="(color, index) in product.product_colors.slice(
                                0,
                                2
                              )"
                              :key="index"
                              style="
                                width: 20px;
                                height: 20px;
                                border-radius: 20px;
                                margin-left: 2px;
                              "
                              :style="'background:' + color.color"
                            ></div>
                          </a-col>

                          <a-col
                            span="12"
                            style="
                              font-family: 'Poppins', sans-serif;
                              font-size: 13px;
                              font-weight: 400;
                            "
                          >
                            Price
                          </a-col>

                          <a-col
                            span="12"
                            style="
                              display: flex;
                              justify-content: end;
                              font-weight: 700;
                            "
                          >
                            ${{ product.product_price }}
                          </a-col>
    
                        <a-col span="18">
                            <a-button block @click="goto_product_Route(product)">Product Details</a-button>
                        </a-col>
    
    
                        <a-col span="6" style="display: flex;justify-content: end;">
                        <a-button @click="toggleFavorite(product)" style="display: flex;justify-content: center;align-items: center;">
                            <template v-if="product.is_favorited">
                            <HeartFilled style="color: red" />
                            </template>
                            <template v-else>
                            <HeartOutlined />
                            </template>
                        </a-button>
                        </a-col>
    
            </a-row>
    
        </div>
    </a-col> -->
    
                </div>

                <!-- Empty State -->
                <div v-else-if="finalResults && (!finalResults.products_used || finalResults.products_used.length === 0)" class="empty-state">
                  <span class="empty-icon">📦</span>
                  <span class="empty-text">No products used</span>
                </div>

                <!-- Error State -->
                <div v-if="error" class="error-state">
                  <span class="error-icon">⚠️</span>
                  <span class="error-text">{{ error }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
import BusinessProductsSailing from '@/components/general_user/buisness_page/liked_products_sailing.vue'

export default {
  name: 'RoomDetailsModal',
  components: {
    BusinessProductsSailing
  },
  props: {
    visible: { type: Boolean, default: false },
    room: { type: Object, default: () => ({}) },
    mediaBase: { type: String, required: true }
  },
  data() {
    return {
      loading: false,
      error: null,
      finalResults: null
    }
  },
  mounted() {
    // If modal is already visible on mount, fetch immediately
    if (this.visible) {
      console.log('🚀 Component mounted with visible=true, fetching...');
      this.fetchFinalResults();
    }
  },
  watch: {
    // Watch for visibility changes
    visible: {
      handler(newValue, oldValue) {
        console.log('👁️ Visible changed from', oldValue, 'to', newValue);
        
        if (newValue && !oldValue) {
          // Modal just opened
          console.log('🚀 Modal opened - fetching products');
          this.finalResults = null;
          this.error = null;
          
          // Use nextTick to ensure DOM is ready
          this.$nextTick(() => {
            this.fetchFinalResults();
          });
        }
      },
      immediate: true // This ensures it runs on component creation
    }
  },
  methods: {
    formatDateShort(iso) {
      if (!iso) return 'N/A'
      return new Date(iso).toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
      })
    },
    async fetchFinalResults() {
      console.log("📡 START fetchFinalResults");
      console.log("📌 Room object:", this.room);
      console.log("📌 Room ID:", this.room?.id);
      
      this.loading = true;
      this.error = null;
      
      try {
        const roomId = this.room.id;
        
        if (!roomId) {
          throw new Error("Room ID is undefined");
        }
        
        const url = `${this.$store.state.root_api}engine/render-final-result/${roomId}`;
        console.log("🔗 Fetching URL:", url);
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });

        console.log("📊 Response Status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Response Error:", errorText);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log("✅ FULL Response Data:", JSON.stringify(responseData, null, 2));

        if (responseData) {
          this.finalResults = {
            products_used: responseData.products_used || [],
            room_type: responseData.room_type || '',
            room_design_type: responseData.room_design_type || ''
          };
          
          console.log("🎉 Final Results Set!");
          console.log("📦 Products Array:", this.finalResults.products_used);
          console.log("📦 Products Count:", this.finalResults.products_used.length);
          console.log("📦 First Product:", this.finalResults.products_used[0]);
        } else {
          console.warn("⚠️ Response data is empty");
        }
      } catch (error) {
        console.error("❌ ERROR in fetchFinalResults:", error);
        console.error("❌ Error stack:", error.stack);
        this.error = error.message;
      } finally {
        this.loading = false;
        console.log("✅ Fetch complete. Loading:", this.loading);
        console.log("✅ Has Results:", !!this.finalResults);
        console.log("✅ Products Count:", this.finalResults?.products_used?.length || 0);
      }
    }
  }
}
</script>


<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
}

/* Desktop: Center modal */
@media (min-width: 768px) {
  .modal-overlay {
    align-items: center;
    padding: 1rem;
  }
}

/* Modal Container */
.modal-container {
  background: white;
  width: 100%;
  max-width: 100%;
  max-height: 90vh;
  border-radius: 24px 24px 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .modal-container {
    max-width: 1200px;
    max-height: 85vh;
    width: 70%;
    border-radius: 16px;
  }
}

/* Header */
.modal-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: white;
  flex-shrink: 0;
}

.drag-indicator {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 4px;
  background: #d1d5db;
  border-radius: 2px;
}

@media (min-width: 768px) {
  .drag-indicator {
    display: none;
  }
  
  .modal-header {
    padding: 1.5rem 2rem;
  }
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Content */
.modal-content {
  overflow-y: auto;
  flex: 1;
  padding: 1.5rem;
}

@media (min-width: 768px) {
  .modal-content {
    padding: 2rem;
  }
}

/* Content Grid - Mobile: Stack | Desktop: 2 columns */
.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .content-grid {
    grid-template-columns: 400px 1fr;
    gap: 3rem;
  }
}

@media (min-width: 1024px) {
  .content-grid {
    grid-template-columns: 450px 1fr;
  }
}

/* Left Section */
.left-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-wrapper {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.room-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

@media (min-width: 768px) {
  .room-image {
    height: 280px;
  }
}

/* Tags */
.tags-section,
.api-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

.tag-category {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #93c5fd;
}

.tag-type {
  background: #f3e8ff;
  color: #6b21a8;
  border: 1px solid #d8b4fe;
}

.tag-favorite {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}

.tag-room-type {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.tag-design {
  background: #fce7f3;
  color: #9f1239;
  border: 1px solid #fbcfe8;
}

/* Info Section */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #111827;
  word-break: break-all;
}

.info-id {
  font-family: 'Courier New', monospace;
  font-size: 0.8125rem;
  color: #6b7280;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Right Section - Products */
.right-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.products-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.products-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.products-count {
  font-size: 0.875rem;
  font-weight: 400;
  color: #6b7280;
}

/* Products Wrapper - Constrain BusinessProductsSailing */
.products-wrapper {
  overflow-y: auto;
  max-height: 600px;
}

/* Mobile: 2x2 Grid for products */
@media (max-width: 767px) {
  .products-wrapper :deep(.products-grid) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .products-wrapper :deep(.product-card) {
    max-width: 100%;
  }
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 3rem 1rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.5;
}

.empty-text {
  color: #6b7280;
  font-size: 0.9375rem;
}

/* Error State */
.error-state {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

.error-icon {
  font-size: 1.25rem;
}

.error-text {
  color: #991b1b;
  font-size: 0.875rem;
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
}

.slide-up-enter-from .modal-container {
  transform: translateY(100%);
}

.slide-up-leave-to .modal-container {
  transform: translateY(100%);
}

@media (min-width: 768px) {
  .slide-up-enter-from .modal-container,
  .slide-up-leave-to .modal-container {
    transform: translateY(0) scale(0.95);
  }
}

/* Scrollbar Styling */
.modal-content::-webkit-scrollbar,
.products-wrapper::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track,
.products-wrapper::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb,
.products-wrapper::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover,
.products-wrapper::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
