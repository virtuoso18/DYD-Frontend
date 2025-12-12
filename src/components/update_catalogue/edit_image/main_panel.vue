<template>
    
    <!-- Updated child component -->
    <add_new_product_mockup
      :open_AddToProduct="open_AddToProduct"
      :product_mockup_images="product_mockup_images" 
      :selected_product_mockups_group="selected_product_mockups_group"
      @update:open_AddToProduct="open_AddToProduct = $event"
      @apply-mockup="handleApplyMockup"
    />
   
<div class="share-section">
    <div class="collapse-controller-sec">
      <!-- collapse controller sec -->
      <div
        class="right-socialShare-contrl-icon"
        style="padding: none; outline: none; margin: none"
        :class="{ show: isCollapsed }"
        @click="toggleSocialShare"
      >
        <img
          v-if="isCollapsed"
          src="../../../assets/icons/rightMove.svg"
          alt="rightMove"
          class="w-5 h-5 cursor-pointer"
        />
        <img
          v-if="!isCollapsed"
          src="../../../assets/icons/crossRedFill.svg"
          alt="cross"
          class="w-5 h-5 cursor-pointer"
        />
      </div>
    </div>
    <div
      class="share-options-sec socialShares-sec"
      :class="{ collapsed: isCollapsed }"
    >
      <!-- Left: Share section -->
      <div style="display: flex; align-items: center; gap: 8px">
        <span style="font-size: 16px; color: #444">Share on social:</span>
        <img
          src="../../../assets/icons/whatsapp.svg"
          alt="Whatsapp"
          class="w-5 h-5"
        />
        <img
          src="../../../assets/icons/facebook.svg"
          alt="Facebook"
          class="w-5 h-5"
        />
        <img
          src="../../../assets/icons/instagram.svg"
          alt="Instagram"
          class="w-5 h-5"
        />
      </div>
      <!-- Middle: Buttons -->
      <div style="display: flex; align-items: center; gap: 12px">
        <a-button
          style="
            border: none;
            background: #F9F9F9;
            padding: 5px 12px;
            border-radius: 6px;
            cursor: pointer;
            color: #2A5AFC;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 16px;
          "
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 14.5V4.5M12 14.5C11.2998 14.5 9.99153 12.5057 9.5 12M12 14.5C12.7002 14.5 14.0085 12.5057 14.5 12"
              stroke="#3B63FB"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M20 16.5C20 18.982 19.482 19.5 17 19.5H7C4.518 19.5 4 18.982 4 16.5"
              stroke="#3B63FB"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Download 
        </a-button>
      </div>
    </div>
  </div>



<div class="main-panel" :style="{ minHeight: panelHeight }">
            <div class="image-grid" :class="gridClass">

      <div 
        v-for="(image, index) in images"  
        :key="index"
        class="image-container"
        :class="getImageClass(index)"
      >
        <a-image :src="this.$store.state.root_media_api+image" :alt="`Generated image ${index + 1}`" />
        <!-- <a-image :src="this.$store.state.root_media_api+'/'+image" :alt="`Generated image ${index + 1}`" /> -->
      </div>
    </div>
    
    <div style="display:flex;justify-content:space-between" v-if="selected_product_mockups_group">
       <a-button type="primary" @click="addToProduct()">
          <a-space>
              <svg width="20" height="20" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.4987 5.83398V11.1673M11.1654 8.50065H5.83203" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.16797 8.49935C2.16797 5.51379 2.16797 4.02101 3.09546 3.09351C4.02296 2.16602 5.51574 2.16602 8.5013 2.16602C11.4868 2.16602 12.9796 2.16602 13.9072 3.09351C14.8346 4.02101 14.8346 5.51379 14.8346 8.49935C14.8346 11.4849 14.8346 12.9777 13.9072 13.9052C12.9796 14.8327 11.4868 14.8327 8.5013 14.8327C5.51574 14.8327 4.02296 14.8327 3.09546 13.9052C2.16797 12.9777 2.16797 11.4849 2.16797 8.49935Z" stroke="white"/>
</svg>

             Add To Product
            </a-space>
            </a-button>

        <a-button type="text" @click="regenerateImages">
          <a-space>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 3.5C12.2 2.2 10.2 1.5 8 1.5C4.1 1.5 1 4.6 1 8.5C1 12.4 4.1 15.5 8 15.5C11.4 15.5 14.2 13.1 14.9 9.9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                  <path d="M11 1.5L13.5 3.5L11.5 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Regenerate
            </a-space>
            </a-button>
    </div>
    
    <!-- Demo controls for testing different image counts -->
    <!-- <div class="demo-controls">
      <button @click="setImageCount(1)" class="demo-btn">1 Image</button>
      <button @click="setImageCount(2)" class="demo-btn">2 Images</button>
      <button @click="setImageCount(3)" class="demo-btn">3 Images</button>
      <button @click="setImageCount(4)" class="demo-btn">4 Images</button>
    </div> -->
  </div>
</template>

<script>
import add_new_product_mockup from '@/components/update_catalogue/edit_image/add_product_image.vue'
export default {
  name: "AdaptiveImageGrid",
  components:{
    add_new_product_mockup 
  },
  props:{
    product_mockup_images: {
      type: Object,
      default: () => ({})
    },
    selected_product_mockups_group: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isCollapsed: false,

      closeShareMenu: true,
      allImages:[],
      images: [],

      // add to product modal
      open_AddToProduct:false,
    }
  },
  watch: {
    product_mockup_images: {
      handler(newVal) {
        if (newVal && newVal.images) {
          this.updateImages();
        }
      },
      immediate: true,
      deep: true
    }
  },
computed: {
  
      panelHeight() {
        return this.closeShareMenu ? 'calc(90vh - 50px)' : '90vh';
      },
    gridClass() {
      const count = this.images.length;
      return `grid-${count}`;
    }
  },
  methods: {
    toggleSocialShare() {
      this.isCollapsed = !this.isCollapsed;
    },
    addToProduct(){
      this.open_AddToProduct=true
  },
  
    handleApplyMockup(result) {
      console.log('Apply mockup:', result);
      // Handle the result from child component
      // result contains: mockup_image, product, mockup_group
      // Example: Send to API or update state
      this.applyMockupToProduct(result);
    },
    
    async applyMockupToProduct(data) {
  console.log('Applying mockup with data:', data);
  
  try {
    // Validate required data
    if (!data.product || !data.product.id) {
      throw new Error('Product information is missing');
    }
    
    if (!data.mockup_group || !data.mockup_group.id) {
      throw new Error('Mockup group information is missing');
    }
    
    if (!data.mockup_indices || !Array.isArray(data.mockup_indices) || data.mockup_indices.length === 0) {
      throw new Error('No mockup indices selected');
    }
    
    // Prepare the payload to match your backend expectations
    const payload = {
      product: {
        id: data.product.id,
        title: data.product.title,
        category: data.product.category,
        product_type: data.product.product_type,
        image: data.product.image,
        price: data.product.price,
        is_active: data.product.is_active,
        description: data.product.description
      },
      mockup_group: {
        id: data.mockup_group.id,
        date: data.mockup_group.date,
        input_image: data.mockup_group.input_image,
        images: data.mockup_group.images
      },
      mockup_indices: data.mockup_indices,
      mockup_images: data.mockup_images || []
    };
    
    console.log('Sending payload:', payload);
    
    // Make API call using fetch
    const response = await fetch(
      `${this.$store.state.root_api}engine/apply-new-mockups-to-product/`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}` // Adjust based on your auth setup
        },
        body: JSON.stringify(payload)
      }
    );
    
    // Check if response is ok
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const responseData = await response.json();
    console.log('Response:', responseData);
    
    // Handle success response
    if (responseData && responseData.created_images) {
      this.$message.success(`Mockup applied successfully! Created ${responseData.total_created} new product images.`);
      
      // Optionally emit event or update local state
      this.$emit('mockup-applied', {
        productId: data.product.id,
        createdImages: responseData.created_images
      });
      
      return responseData;
    } else {
      this.$message.success('Mockup applied to product successfully!');
      return responseData;
    }
    
  } catch (error) {
    console.error('Error applying mockup:', error);
    
    // Handle different types of errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      // Network error
      this.$message.error('Network error: Please check your connection');
    } else {
      // Server error or validation error
      this.$message.error(error.message || 'Failed to apply mockup to product');
    }
    
    throw error; // Re-throw for caller to handle if needed
  }
},

    
    updateImages() {
  if (this.product_mockup_images && this.product_mockup_images.images) {
    const imageUrls = Object.values(this.product_mockup_images.image_paths || {})
      .filter(url => url !== null && url !== undefined && url !== ""); // filter invalid
    this.allImages = imageUrls;
    this.images = imageUrls;
  } else {
    this.allImages = [];
    this.images = [];
  }
},

    setImageCount(count) {
      this.images = this.allImages.slice(0, count);
    },
    getImageClass(index) {
      const count = this.images.length;
      // Special classes for 3-image layout
      if (count === 3) {
        return index === 0 ? 'large-image' : 'small-image';
      }
      return '';
    },
    regenerateImages() {
      // Simulate regeneration by shuffling images
      const shuffled = [...this.allImages].sort(() => Math.random() - 0.5);
      this.images = shuffled.slice(0, this.images.length);
    }
  },
  mounted() {
    // Initialize images when component is mounted
    this.updateImages();
  }
}
</script>

<style scoped>
/* Fade transition for image grid */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Loading overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  z-index: 100;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e9ecef;
  border-top: 3px solid #2a5afc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay p {
  color: #6c757d;
  font-size: 14px;
  margin: 0;
}

.main-panel {
  flex: 1;
  padding: 24px;
  margin-top:30px;
  display: flex;
  flex-direction: column;
  transition: min-height 0.3s ease;
  position: relative; /* For loading overlay */
}

.panel-expanded {
  min-height: 90vh; /* Full height when share menu is hidden */
}

.panel-collapsed {
  min-height: calc(100vh - 50px); /* Reduced height when share menu is visible */
}
.image-grid {
  display: grid;
  /* gap: 8px; */
  flex: 1;
  margin-bottom: 32px;
  width: 100%;
  max-width: 900px;
  /* max-height: 300px;   restrict grid height */
  overflow-y: auto;    /* allow scrolling if content exceeds 700px */
  margin-left: auto;
  margin-right: auto;
}

/* Single image - centered, aspect ratio maintained */
.grid-1 {
  grid-template-columns: 1fr;
  max-width: 450px;

  justify-content: center;
}

/* Two images - side by side */
.grid-2 {
  grid-template-columns: 1fr 1fr;
}

/* Three images - one large on left, two stacked on right */
.grid-3 {
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr;
  min-height: 400px;
}

/* Four images - 2x2 grid */
.grid-4 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  max-height: 450px;

}

.image-container {
  position: relative;
  background: #ffffff;
  /* border-radius: 12px; */
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 200px;
  cursor: pointer;
}

.image-container:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* Target Ant Design Vue image component structure */
.image-container :deep(.ant-image) {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
}

.image-container :deep(.ant-image-img) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  display: block !important;
}

.image-container :deep(.ant-image img) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  display: block !important;
}

/* Fallback for any img tags */
.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Special classes for 3-image layout */
.grid-3 .large-image {
  grid-row: 1 / 3;
  min-height: 400px;
}

.grid-3 .small-image {
  min-height: 190px;
}

.regenerate-section {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  border-top: 1px solid #e9ecef;
}

.regenerate-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 24px;
  color: #495057;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.regenerate-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.regenerate-btn:active {
  transform: translateY(0px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.regenerate-btn svg {
  color: #6c757d;
  transition: transform 0.3s ease;
}

.regenerate-btn:hover svg {
  transform: rotate(180deg);
}

/* Demo controls - remove in production */
.demo-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.demo-btn {
  padding: 8px 16px;
  background: #e9ecef;
  border: none;
  border-radius: 6px;
  color: #495057;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.demo-btn:hover {
  background: #dee2e6;
}

/* Responsive design */
@media (max-width: 768px) {
  .main-panel {
    padding: 16px;
  }
  
  .image-grid {
    gap: 12px;
    max-width: 100%;
    margin-bottom: 24px;
  }
  
  .grid-2,
  .grid-3,
  .grid-4 {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  
  .grid-3 .large-image {
    grid-row: auto;
    min-height: 200px;
  }
  
  .grid-3 .small-image {
    min-height: 200px;
  }
  
  .image-container {
    min-height: 200px;
  }
  
  .demo-controls {
    flex-wrap: wrap;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .main-panel {
    padding: 12px;
  }
  
  .image-grid {
    gap: 8px;
  }
  
  .image-container {
    min-height: 180px;
    border-radius: 8px;
  }
}

/* Loading animation */
.image-container.loading {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Smooth entrance animation */
.image-container {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.image-container:nth-child(1) { animation-delay: 0.1s; }
.image-container:nth-child(2) { animation-delay: 0.2s; }
.image-container:nth-child(3) { animation-delay: 0.3s; }
.image-container:nth-child(4) { animation-delay: 0.4s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}







.share-section {
  display: flex;
  padding: 5px 20px;
  position: absolute;
  z-index: 9;
  width: 100%;
}
.collapse-controller-sec {
  width: 5%;
  display: flex;
  align-items: center;
  justify-content: start;
}
.share-options-sec {
  width: 95%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  height: 40px;
}
.right-socialShare-contrl-icon {
  cursor: pointer;
  font-size: 20px;
  transition: transform 0.3s ease;
  opacity: 1;
  display: flex;
  align-items: center;
}
.right-socialShare-contrl-icon.show {
  transform: scale(1);
}
.socialShares-sec {
  transform-origin: left;
  transition: transform 0.4s ease;
}
.socialShares-sec.collapsed {
  transform: scale(0);
}
</style>