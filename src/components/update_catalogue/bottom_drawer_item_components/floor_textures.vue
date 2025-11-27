<template>
<div class="main">
   <a-row>
      <a-col :span="4">
        
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
      </a-col>
      <a-col :span="20">
        <!-- {{ seeAll_Floor }} -->
        
    <div class="products-list">
        <a-row >
            <a-col v-for="product in products" :key="product.id" 
                   class="product-responsive" style="padding:5px;">
                <div class="product">
                   <div class="product-image-container">
                      <img 
                        :src="getProductImage(product)" 
                        :alt="product.title"
                        class="product-image"
                      />
                      <!-- Category Badge -->
                      <div class="category-badge">{{ getProductType(product) }}</div>
                      <!-- AR Badge -->
                      <div class="ar-badge">AR</div>
                    </div>

                    <a-row>
                        <a-col span="24">
                            <b>{{ product.title }}</b>
                        </a-col>
                        
                        <a-col span="18">
                            Colors
                        </a-col>
                        
                        <a-col span="6" style="display: flex; justify-content: end; gap: 6px;">
                            <div 
                                v-for="color in product.colors_available" 
                                :key="color.id"
                                style="width:20px; height:20px; border-radius:20px; border: 1px solid #ddd;" 
                                :style="{ backgroundColor: color.color_hex }"
                                :title="color.title"
                            ></div>
                        </a-col>

                        <a-col span="12">
                            Price per Sq.m
                        </a-col>
                        
                        <a-col span="12" style="text-align: right;">
                            ₹{{ formatPrice(product.sale_price_per_sqm) }}
                        </a-col>

                        <a-col v-if="product.size_width && product.size_height" span="12">
                            Size: {{ product.size_width }}x{{ product.size_height }}cm
                        </a-col>

                        <a-col v-if="product.columns && product.rows" span="12" style="text-align: right;">
                            Grid: {{ product.columns }}x{{ product.rows }}
                        </a-col>

                        <a-col span="17">
                            <a-button block @click="handleProductDetail(product)">Product Details</a-button>
                        </a-col>
                        
                        <a-col span="1"></a-col>
                        <a-col span="4">
                            <a-button 
                                :type="isWishlisted(product.id) ? 'primary' : 'default'"
                                @click="toggleWishlist(product)"
                            >
                                <HeartOutlined />
                            </a-button>
                        </a-col>
                    </a-row>
                </div>

            </a-col>
        </a-row>
    </div>
    </a-col>
    </a-row>
    
</div>
</template>




<script>
import { HeartOutlined } from '@ant-design/icons-vue'

export default {
  name: 'MyProducts',
  components:{
    HeartOutlined
  },
  props :{
    products: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      wishlisted: new Set()
    }
  },
  methods: {
    /**
     * Get the proper image URL from product
     */
    getProductImage(product) {
      if (product.texture_image) {
        // If it's a relative path, prepend the API URL
        if (product.texture_image.startsWith('/')) {
          return `${this.$store.state.root_media_api}${product.texture_image}`
        }
        return product.texture_image
      }
      // Fallback placeholder image
      return 'https://via.placeholder.com/300x300?text=No+Image'
    },

    /**
     * Determine product type from the object structure
     */
    getProductType(product) {
      // Check if it has floor-specific fields
      if (product.size_height) {
        return 'Floor'
      }
      // Check if it has wall-specific fields
      if (product.texture_wall_id) {
        return 'Wall'
      }
      // Check if it's a 3D product (furniture)
      if (product.model_3d_url) {
        return 'Furniture'
      }
      // Check if it's a light
      if (product.light_type) {
        return 'Light'
      }
      return 'Product'
    },

    /**
     * Format price with proper decimal places
     */
    formatPrice(price) {
      if (!price) return '0'
      return parseInt(price).toLocaleString('en-IN')
    },

    /**
     * Check if product is wishlisted
     */
    isWishlisted(productId) {
      return this.wishlisted.has(productId)
    },

    /**
     * Toggle wishlist status
     */
    toggleWishlist(product) {
      if (this.wishlisted.has(product.id)) {
        this.wishlisted.delete(product.id)
        this.$message.success('Removed from wishlist')
      } else {
        this.wishlisted.add(product.id)
        this.$message.success('Added to wishlist')
      }
    },

    handleProductDetail(product) {
      console.log('Product detail clicked:', product)
      this.$emit('product-selected', product)
    }
  }
}
</script>


<style scoped>
.main{
    padding:10px;
    border-radius:20px;
    background: white;
    border:2px solid rgba(128, 128, 128, 0.16);
    margin-bottom:10px;
}

.head-section{
    display:flex;
    justify-content: space-between;
}

.product{
    padding:10px;
    margin-bottom:10px;
    border-radius:10px;
    background:#f3f2f4;
}

.products-list{
    padding-bottom:20px;
}

.product-image-container {
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s ease;
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

@media (min-width: 576px) { .product-responsive { width: 50%; flex: 0 0 50%; } }
@media (min-width: 768px) { .product-responsive { width: 33.333%; flex: 0 0 33.333%; } }
@media (min-width: 992px) { .product-responsive { width: 25%; flex: 0 0 25%; } }
@media (min-width: 1200px) { .product-responsive { width: 20%; flex: 0 0 20%; } }
</style>