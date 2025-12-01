<template>
  <div class="main">
    <a-row>
      <a-col :span="4">
        <!-- Price Filter -->
        <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Price per Sq.m</h4>
          <a-slider 
            :min="0" 
            :max="500000" 
            v-model:value="filters.priceRange" 
            range 
            @change="handlePriceChange"
          />
          <p style="margin-top: 8px; font-size: 12px; color: #666;">
            ${{ filters.priceRange[0].toLocaleString('en-IN') }} - ${{ filters.priceRange[1].toLocaleString('en-IN') }}
          </p>
        </div>

        <!-- Texture Style Filter -->
        <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Style</h4>
          <div style="max-height: 200px; overflow-y: auto; padding-right: 8px;">
            <a-checkbox 
              v-model:checked="filters.styles.modern"
              @change="applyFilters"
              style="display: flex; margin-bottom: 8px;"
            >Modern</a-checkbox>
            <a-checkbox 
              v-model:checked="filters.styles.scandinavian"
              @change="applyFilters"
              style="display: flex; margin-bottom: 8px;"
            >Scandinavian</a-checkbox>
            <a-checkbox 
              v-model:checked="filters.styles.classic"
              @change="applyFilters"
              style="display: flex; margin-bottom: 8px;"
            >Classic</a-checkbox>
            <a-checkbox 
              v-model:checked="filters.styles.minimalist"
              @change="applyFilters"
              style="display: flex; margin-bottom: 8px;"
            >Minimalist</a-checkbox>
            <a-checkbox 
              v-model:checked="filters.styles.industrial"
              @change="applyFilters"
              style="display: flex; margin-bottom: 8px;"
            >Industrial</a-checkbox>
            <a-checkbox 
              v-model:checked="filters.styles.rustic"
              @change="applyFilters"
              style="display: flex; margin-bottom: 8px;"
            >Rustic</a-checkbox>
            <a-checkbox 
              v-model:checked="filters.styles.boho"
              @change="applyFilters"
              style="display: flex; margin-bottom: 8px;"
            >Boho</a-checkbox>
            <a-checkbox 
              v-model:checked="filters.styles.other"
              @change="applyFilters"
              style="display: flex; margin-bottom: 8px;"
            >Other</a-checkbox>
          </div>
        </div>

        <!-- Colors Filter -->
        <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Colors</h4>
          <div v-if="loadingColors" style="text-align: center; padding: 10px;">
            <a-spin size="small" />
          </div>
          <div v-else style="display: flex; gap: 8px; flex-wrap: wrap;">
            <div 
              v-for="color in availableColors" 
              :key="color.id"
              @click="toggleColorFilter(color.color_hex)"
              :style="{
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                background: color.color_hex, 
                border: filters.selectedColors.includes(color.color_hex) ? '3px solid #1890ff' : '2px solid #ddd',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }"
              :title="color.title || 'Color'"
            >
              <div 
                v-if="filters.selectedColors.includes(color.color_hex)"
                style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 16px; font-weight: bold; text-shadow: 0 0 3px rgba(0,0,0,0.5);"
              >✓</div>
            </div>
            <div v-if="availableColors.length === 0" style="color: #999; font-size: 12px; width: 100%; text-align: center;">
              No colors available
            </div>
          </div>
        </div>

        <!-- Clear Button -->
        <a-button block type="primary" @click="clearFilters">Clear Filters</a-button>
      </a-col>
      
      <a-col :span="20">
        <!-- Results Header -->
        <div v-if="!loading" style="padding: 0 10px 15px; display: flex; justify-content: space-between; align-items: center;">
          <div style="color: #666; font-size: 14px;">
            Showing {{ products.length }} of {{ pagination.total_count }} floor textures
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span style="color: #666; font-size: 12px;">Page Size:</span>
            <a-select 
              v-model:value="pagination.page_size" 
              @change="handlePageSizeChange"
              style="width: 80px;"
            >
              <a-select-option :value="12">12</a-select-option>
              <a-select-option :value="20">20</a-select-option>
              <a-select-option :value="40">40</a-select-option>
              <a-select-option :value="60">60</a-select-option>
            </a-select>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" style="text-align: center; padding: 40px;">
          <a-spin size="large" />
        </div>

        <!-- Products List -->
        <div v-else class="products-list">
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
                  <div class="category-badge">Floor</div>
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
                      v-for="color in product.colors_available.slice(0, 3)" 
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
                    ${{ formatPrice(product.sale_price_per_sqm) }}
                  </a-col>

                  <a-col span="24" style="font-size: 11px; color: #666; margin-bottom: 4px;">
                    Size: {{ product.size_width }}x{{ product.size_height }}cm | Grid: {{ product.columns }}x{{ product.rows }}
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

          <!-- No Results -->
          <div v-if="products.length === 0" style="text-align: center; padding: 40px; color: #999;">
            <p>No products found matching your filters.</p>
          </div>

          <!-- Pagination -->
          <div v-if="pagination.total_pages > 1" style="display: flex; justify-content: center; margin-top: 30px;">
            <a-pagination
              v-model:current="pagination.current_page"
              :total="pagination.total_count"
              :page-size="pagination.page_size"
              :show-size-changer="false"
              :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
              @change="handlePageChange"
            />
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { HeartOutlined } from '@ant-design/icons-vue'

export default {
  name: 'FloorTextures',
  components: {
    HeartOutlined
  },
  data() {
    return {
      products: [],
      wishlisted: new Set(),
      loading: false,
      loadingColors: false,
      availableColors: [],
      pagination: {
        current_page: 1,
        page_size: 20,
        total_count: 0,
        total_pages: 1
      },
      filters: {
        priceRange: [0, 500000],
        selectedColors: [],
        styles: {
          modern: false,
          scandinavian: false,
          classic: false,
          minimalist: false,
          industrial: false,
          rustic: false,
          boho: false,
          other: false
        }
      },
      filterTimeout: null
    }
  },
  mounted() {
    this.loadAvailableColors()
    this.loadProducts()
  },
  methods: {
    /**
     * Load available colors from all products
     */
    async loadAvailableColors() {
      try {
        this.loadingColors = true
        
        // Fetch all floors to get colors (paginate to get all)
        const url = `${this.$store.state.root_api}room/api/floors/?page=1&page_size=1000`
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
        
        const data = await response.json()
        
        if (data.success && data.data) {
          // Extract unique colors from all products using hex codes
          const colorMap = new Map()
          
          data.data.forEach(product => {
            if (product.colors_available && Array.isArray(product.colors_available)) {
              product.colors_available.forEach(color => {
                if (color.color_hex && !colorMap.has(color.color_hex)) {
                  colorMap.set(color.color_hex, {
                    id: color.id || color.color_hex,
                    title: color.title || 'Color',
                    color_hex: color.color_hex
                  })
                }
              })
            }
          })
          
          this.availableColors = Array.from(colorMap.values())
          console.log('Colors loaded:', this.availableColors.length)
        }
      } catch (error) {
        console.error('Failed to load colors:', error)
      } finally {
        this.loadingColors = false
      }
    },

    /**
     * Toggle color filter selection
     */
    toggleColorFilter(hexCode) {
      const index = this.filters.selectedColors.indexOf(hexCode)
      if (index > -1) {
        this.filters.selectedColors.splice(index, 1)
      } else {
        this.filters.selectedColors.push(hexCode)
      }
      this.applyFilters()
    },

    /**
     * Load products with filters and pagination
     */
    async loadProducts() {
      try {
        this.loading = true
        
        const params = new URLSearchParams()
        
        // Add pagination parameters
        params.append('page', this.pagination.current_page)
        params.append('page_size', this.pagination.page_size)
        
        // Add price range
        params.append('price_per_sqm_min', this.filters.priceRange[0])
        params.append('price_per_sqm_max', this.filters.priceRange[1])
        
        // Add texture styles
        const selectedStyles = []
        if (this.filters.styles.modern) selectedStyles.push('Modern')
        if (this.filters.styles.scandinavian) selectedStyles.push('Scandinavian')
        if (this.filters.styles.classic) selectedStyles.push('Classic')
        if (this.filters.styles.minimalist) selectedStyles.push('Minimalist')
        if (this.filters.styles.industrial) selectedStyles.push('Industrial')
        if (this.filters.styles.rustic) selectedStyles.push('Rustic')
        if (this.filters.styles.boho) selectedStyles.push('Boho')
        if (this.filters.styles.other) selectedStyles.push('Other')
        
        if (selectedStyles.length > 0) {
          params.append('texture_style', selectedStyles.join(','))
        }
        
        // Add selected colors
        if (this.filters.selectedColors.length > 0) {
          const hexCodes = this.filters.selectedColors.join(',')
          params.append('color_hex', hexCodes)
        }
        
        const url = `${this.$store.state.root_api}room/api/floors/?${params.toString()}`
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
        
        const data = await response.json()
        
        if (data.success) {
          this.products = data.data || []
          
          // Update pagination info from response
          this.pagination.current_page = data.page || 1
          this.pagination.page_size = data.page_size || 20
          this.pagination.total_count = data.total_count || 0
          this.pagination.total_pages = data.total_pages || 1
          
          window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          this.$message.error(data.message || 'Failed to load products')
        }
      } catch (error) {
        console.error('Failed to load products:', error)
        this.$message.error('Error loading products')
      } finally {
        this.loading = false
      }
    },

    /**
     * Handle page change
     */
    handlePageChange(page) {
      this.pagination.current_page = page
      this.loadProducts()
    },

    /**
     * Handle page size change
     */
    handlePageSizeChange(pageSize) {
      this.pagination.page_size = pageSize
      this.pagination.current_page = 1
      this.loadProducts()
    },

    /**
     * Handle price range change with debounce
     */
    handlePriceChange() {
      clearTimeout(this.filterTimeout)
      this.filterTimeout = setTimeout(() => {
        this.applyFilters()
      }, 500)
    },

    /**
     * Apply all filters (reset to page 1)
     */
    applyFilters() {
      this.pagination.current_page = 1
      this.loadProducts()
    },

    /**
     * Clear all filters
     */
    clearFilters() {
      this.filters = {
        priceRange: [0, 500000],
        selectedColors: [],
        styles: {
          modern: false,
          scandinavian: false,
          classic: false,
          minimalist: false,
          industrial: false,
          rustic: false,
          boho: false,
          other: false
        }
      }
      this.pagination.current_page = 1
      this.loadProducts()
    },

    /**
     * Get the proper image URL from product
     */
    getProductImage(product) {
      if (product.texture_image) {
        if (product.texture_image.startsWith('/')) {
          return `${this.$store.state.root_media_api}${product.texture_image}`
        }
        return product.texture_image
      }
      return 'https://via.placeholder.com/300x300?text=No+Image'
    },

    /**
     * Format price
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

    /**
     * Handle product detail click
     */
    handleProductDetail(product) {
      this.$router.push({
        name: 'buisness_product',
        params: {
          buisness_name: product.business_slug,
          product_type: 'floor',
          product_id: product.id
        }
      })
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
  margin-bottom: 10px;
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