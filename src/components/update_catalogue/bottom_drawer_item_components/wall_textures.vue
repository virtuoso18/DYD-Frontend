<template>
  <div class="main">

   <a-row>
    <a-col :span="4">
  <!-- Price Filter -->
  <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
    <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Price</h4>
    <a-slider :min="0" :max="500" :default-value="[0, 500]" range />
    <p style="margin-top: 8px; font-size: 12px; color: #666;">₹0 - ₹500</p>
  </div>

  <!-- Texture Style Filter -->
  <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
    <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Style</h4>
    <a-checkbox>Modern</a-checkbox><br/>
    <a-checkbox>Classic</a-checkbox><br/>
    <a-checkbox>Minimal</a-checkbox>
  </div>

  <!-- Colors Filter -->
  <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
    <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Colors</h4>
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      <div style="width: 30px; height: 30px; border-radius: 50%; background: #FFA500; border: 2px solid #ddd; cursor: pointer;"></div>
      <div style="width: 30px; height: 30px; border-radius: 50%; background: #DEB887; border: 2px solid #ddd; cursor: pointer;"></div>
      <div style="width: 30px; height: 30px; border-radius: 50%; background: #A52A2A; border: 2px solid #ddd; cursor: pointer;"></div>
      <div style="width: 30px; height: 30px; border-radius: 50%; background: #FF0000; border: 2px solid #ddd; cursor: pointer;"></div>
      <div style="width: 30px; height: 30px; border-radius: 50%; background: #98FB98; border: 2px solid #ddd; cursor: pointer;"></div>
      <div style="width: 30px; height: 30px; border-radius: 50%; background: #DDA0DD; border: 2px solid #ddd; cursor: pointer;"></div>
    </div>
  </div>

  <!-- Size Filter -->
  <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
    <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Size</h4>
    <a-radio-group>
      <a-radio value="small">Small (10x10)</a-radio><br/>
      <a-radio value="medium">Medium (20x20)</a-radio><br/>
      <a-radio value="large">Large (30x30)</a-radio>
    </a-radio-group>
  </div>

  <!-- Clear Button -->
  <a-button block type="primary">Clear Filters</a-button>
</a-col>
      <a-col :span="20">
          <div class="products-list">
      <a-row>
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
              <div class="category-badge">{{ product.texture_style || 'Wall' }}</div>
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
              
              <a-col span="6" style="display: flex; justify-content: end; gap: 4px;">
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
                ₹{{ getPrice(product) }}
              </a-col>

              <a-col span="24" style="font-size: 11px; color: #666; margin-bottom: 4px;">
                Size: {{ product.size_width }}x{{ product.size_height }}cm
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
  name: 'WallProducts',
  components: {
    HeartOutlined
  },
  props: {
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
     * Get formatted price
     */
    getPrice(product) {
      const price = product.sale_price_per_sqm || product.price_per_sqm || 0
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

    /**
     * Handle product detail click
     */
    handleProductDetail(product) {
      console.log('Product detail clicked:', product)
      this.$emit('product-selected', product)
    }
  }
}
</script>

<style scoped>
.main {
  padding: 10px;
  border-radius: 20px;
  background: white;
  border: 2px solid rgba(128, 128, 128, 0.16);
  margin-top: 10px;
  margin-bottom: 10px;
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
</style>