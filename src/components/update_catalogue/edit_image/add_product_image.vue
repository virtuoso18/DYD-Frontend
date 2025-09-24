<!-- Child Component: add_product_image.vue -->
<template>
  <a-modal 
    v-model:open="modalVisible" 
    centered
    title="Add To Product" 
    @ok="handleOk"
    @cancel="handleCancel"
    width="1000px"
    :footer="null"
  >
    <div>
      <a-row :gutter="16">
        <!-- Left Column - Mockup Images -->
        <a-col :sm="24" :xs="24" :md="14" :lg="14">
          <div class="mockup-section">
            <h4>Select Mockup Image</h4>
            <div class="image-grid" :class="gridClass">
              <div 
                v-for="(image, index) in mockupImages"  
                :key="index"
                class="image-container"
                :class="[
  getImageClass(index),
  { 'selected': selectedMockupIndices.includes(index) }  // Changed this line
]"
                @click="selectMockup(index, image)"
              >
                <img 
                  :src="this.$store.state.root_media_api + image" 
                  :alt="`Mockup ${index + 1}`" 
                />
                <div v-if="selectedMockupIndices.includes(index)" class="selection-overlay">  <!-- Changed this line -->
  <CheckCircleOutlined style="font-size:18px;" />
</div>
              </div>
            </div>
            
            <!-- Input Image Preview -->
            <div class="input-image-preview">
              <h5>Input Image:</h5>
              <img 
                :src="$store.state.root_media_api + selected_product_mockups_group.input_image" 
                style="width:100%; max-width:70px; border:1px solid rgba(0,0,0,0.2); border-radius:10px" 
                alt="Original"
              >
            </div>
          </div>
        </a-col>

        <!-- Right Column - Product Search & Selection -->
      
        <a-col :sm="24" :xs="24" :md="10" :lg="10">
  <div class="product-section">
    <h4>Select Product</h4>
    <a-input 
      v-model:value="searchProductTitle" 
      placeholder="Search product titles you own (max 10 results)"
      @input="searchProducts"
      style="margin-bottom: 16px;"
      :loading="isLoadingProducts"
    >
      <template #suffix>
        <a-spin v-if="isLoadingProducts" size="small" />
      </template>
    </a-input>
    
    <!-- Product List -->
    <div class="product-list">
      <!-- Loading State -->
      <div v-if="isLoadingProducts" class="loading-products">
        <a-spin size="large" />
        <p>Loading products...</p>
      </div>
      
      <!-- Product Items -->
      
      <div 
  v-for="product in filteredProducts" 
  :key="product.id"
  class="product-item"
  :class="[
    { 'selected': selectedProduct?.id === product.id },
    `product-type-${product.product_type}`
  ]"
  @click="selectProduct(product)"
>
  <img 
    v-if="product.image" 
    :src="this.$store.state.root_media_api+product.image" 
    alt="Product"
    class="product-thumbnail"
  />
  <div v-else class="product-thumbnail-placeholder">
    <!-- Different icons for different product types -->
    <HomeOutlined v-if="product.product_type === 'furniture'" />
    <BulbOutlined v-else-if="product.product_type === 'lighting'" />
    <BorderOuterOutlined v-else-if="product.product_type === 'wall_texture'" />
    <AppstoreOutlined v-else-if="product.product_type === 'floor_texture'" />
    <PictureOutlined v-else />
  </div>
  
  <div class="product-info">
    <div class="product-title">{{ product.title }}</div>
    <div class="product-category">
      <span class="category-name">{{ product.category }}</span>
      <span class="product-type-badge" :class="`badge-${product.product_type}`">
        {{ getProductTypeLabel(product.product_type) }}
      </span>
    </div>
    <!-- <div v-if="product.texture_style" class="product-style">
      Style: {{ product.texture_style }}
    </div> -->
    <div v-if="product.light_type" class="product-style">
      Type: {{ product.light_type }}
    </div>
    <!-- <div v-if="product.price > 0" class="product-price">
      ${{ product.price.toFixed(2) }}
    </div> -->
    <!-- <div v-if="product.description" class="product-description">
      {{ product.description }}
    </div> -->
  </div>
  
  <div v-if="selectedProduct?.id === product.id" class="product-check">
    <CheckCircleOutlined />
  </div>
</div>
      
      <!-- No products found -->
      <div v-if="!isLoadingProducts && searchProductTitle && filteredProducts.length === 0" class="no-products">
        No products found matching "{{ searchProductTitle }}"
      </div>
      
      <!-- Empty state -->
      <div v-if="!isLoadingProducts && !searchProductTitle && filteredProducts.length === 0" class="empty-products">
        <a-empty description="Start typing to search your products"></a-empty>

      </div>
      
      <!-- Max results notice -->
      <div v-if="filteredProducts.length === 10 && searchProductTitle" class="max-results-notice">
        <small>Showing maximum 10 results. Refine your search for more specific results.</small>
      </div>
    </div>
  </div>
</a-col>

      </a-row>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <a-button @click="handleCancel">Cancel</a-button>
        <a-button 
          type="primary" 
          @click="handleOk"
          :disabled="selectedMockupImages.length === 0 || !selectedProduct" 
        >
          Apply {{ selectionCount }} Mockup(s) to Product  <!-- Optional enhancement -->
        </a-button>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { CheckCircleOutlined,PictureOutlined,HomeOutlined,BulbOutlined,BorderOuterOutlined,AppstoreOutlined } from '@ant-design/icons-vue';

export default {
  name: 'AddProductMockupModal',
  components: {
  CheckCircleOutlined,
  PictureOutlined,
  HomeOutlined,
  BulbOutlined,
  BorderOuterOutlined,
  AppstoreOutlined
},
  props: {
    open_AddToProduct: {
      type: Boolean,
      default: false
    },
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
      searchProductTitle: '',
      selectedMockupIndices: [],      // Changed to array for multiple selection
      selectedMockupImages: [],       // Changed to array for multiple selection
      selectedProduct: null,
     
    allProducts: [],           // This will now be loaded from API
    isLoadingProducts: false,  // Loading state
    searchTimeout: null    

    // Sample products - replace with your actual products data
   
    }
  },
  computed: {
     modalVisible: {
    get() {
      return this.open_AddToProduct;
    },
    set(value) {
      this.$emit('update:open_AddToProduct', value);
    }
  },
     mockupImages() {
    return this.selected_product_mockups_group?.images || [];
  },
    gridClass() {
    const count = this.mockupImages.length;
    return `grid-${count}`;
  },
   filteredProducts() {
    // Since we're now fetching filtered results from API,
    // we can just return allProducts directly
    return this.allProducts;
  },

      selectionCount() {
    return this.selectedMockupImages.length;
  }
  },
  methods: {
     // Get display label for product type
  getProductTypeLabel(productType) {
    const labels = {
      'furniture': 'Furniture',
      'lighting': 'Lighting',
      'wall_texture': 'Wall',
      'floor_texture': 'Floor'
    };
    return labels[productType] || productType;
  },

  // Get icon for product type (if you want to use it elsewhere)
  getProductTypeIcon(productType) {
    const icons = {
      'furniture': 'HomeOutlined',
      'lighting': 'BulbOutlined', 
      'wall_texture': 'BorderOuterOutlined',
      'floor_texture': 'AppstoreOutlined'
    };
    return icons[productType] || 'PictureOutlined';
  },
  // Fetch products from API
  async fetchProducts(searchTerm = '') {
    this.isLoadingProducts = true;
    try {
      const token = localStorage.getItem('token'); // Adjust based on your auth setup
      const apiUrl = searchTerm 
        ? `${this.$store.state.root_api}engine/get-my-products/?q=${encodeURIComponent(searchTerm)}`
        : `${this.$store.state.root_api}engine/get-my-products/?search=${encodeURIComponent(searchTerm)}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (data.success) {
        this.allProducts = data.data || [];
      } else {
        console.error('Failed to fetch products:', data.message);
        this.allProducts = [];
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      this.allProducts = [];
    } finally {
      this.isLoadingProducts = false;
    }
  },
    selectMockup(index, image) {
    const imageIndex = this.selectedMockupIndices.indexOf(index);
    
    if (imageIndex === -1) {
      this.selectedMockupIndices.push(index);
      this.selectedMockupImages.push(image);
    } else {
      this.selectedMockupIndices.splice(imageIndex, 1);
      this.selectedMockupImages.splice(imageIndex, 1);
    }
  },
    selectProduct(product) {
      this.selectedProduct = product;
    },
    
    
  // Updated search method with debouncing
  searchProducts() {
    // Clear previous timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Set new timeout for debounced search
    this.searchTimeout = setTimeout(() => {
      this.fetchProducts(this.searchProductTitle);
    }, 300); // 300ms delay
  },

  // Load products when modal opens
  async loadInitialProducts() {
    if (this.allProducts.length === 0) {
      await this.fetchProducts();
    }
  },
     handleOk() {
    if (this.selectedMockupImages.length > 0 && this.selectedProduct) {
      const result = {
        mockup_images: this.selectedMockupImages,
        mockup_indices: this.selectedMockupIndices,
        product: this.selectedProduct,
        mockup_group: this.selected_product_mockups_group
      };
      
      this.$emit('apply-mockup', result);
      this.handleCancel();
    }
  },
    
  handleCancel() {
    this.selectedMockupIndices = [];
    this.selectedMockupImages = [];
    this.selectedProduct = null;
    this.searchProductTitle = '';
    
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    this.$emit('update:open_AddToProduct', false);
  },
    getImageClass(index) {
      const count = this.mockupImages.length;
      if (count === 3) {
        return index === 0 ? 'large-image' : 'small-image';
      }
      return '';
    }
  },
  watch: {
    open_AddToProduct(newVal) {
    if (newVal) {
      // Load products when modal opens
      this.loadInitialProducts();
    } else {
      // Reset when modal closes
      this.selectedMockupIndices = [];
      this.selectedMockupImages = [];
      this.selectedProduct = null;
      this.searchProductTitle = '';
      
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
    }
  }
  }
}
</script>

<style scoped>
.mockup-section, .product-section {
  padding: 0 8px;
}

.image-grid {
  display: grid;
  gap: 1px;
  margin-bottom: 16px;
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
}

.grid-1 { grid-template-columns: 1fr; }
.grid-2 { grid-template-columns: 1fr 1fr; }
.grid-3 { 
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr;
}
.grid-4 { 
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.image-container {
  position: relative;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  min-height: 120px;
  cursor: pointer;
  border: 2px solid transparent;
}

.image-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border-color: #1890ff;
}

.image-container.selected {
  border-color: #1890ff;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.3);
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.selection-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #1890ff;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.input-image-preview {
  margin-top: 16px;
  text-align: start;
}

.product-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.product-item:hover {
  background-color: #f5f5f5;
}

.product-item.selected {
  background-color: #e6f7ff;
  border-color: #1890ff;
}

.product-thumbnail {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 12px;
}

.product-info {
  flex: 1;
}

.product-title {
  font-weight: 500;
  margin-bottom: 2px;
}

.product-category {
  font-size: 12px;
  color: #666;
}

.product-check {
  color: #1890ff;
  font-size: 16px;
}

.no-products {
  padding: 20px;
  text-align: center;
  color: #666;
  font-style: italic;
}

.modal-footer {
  border-top: 1px solid #f0f0f0;
  text-align: right;
}

.modal-footer .ant-btn {
  margin-left: 8px;
}

/* Responsive grid adjustments */
@media (max-width: 768px) {
  .image-grid {
    max-height: 250px;
  }
  
  .grid-3, .grid-4 {
    grid-template-columns: 1fr 1fr;
  }
}
.empty-products{height:100%;padding:20px;display: flex;justify-content: center;align-items: center;flex-direction: column;
}
</style>