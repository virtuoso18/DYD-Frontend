<template>
  <div class=" md:!p-3 !bg-white !rounded-xl !border-2 !border-gray-200/20">
    <div class="products-list !pb-5 md:!pb-6">
      <!-- Responsive Grid - 2 mobile, 4 tablet, 5 desktop -->
      <div class="grid-container ">
        <div 
          v-for="product in products"
          :key="product.product_id"
          class="product-card-wrapper"
        >
          <div class="!p-3 md:!p-4 !bg-gray-50/50 !rounded-lg !mb-2 !shadow-sm hover:!shadow-md transition-all">
            <!-- Product Image -->
            <div
              class="product-image-container !relative !overflow-hidden !h-[160px] md:!h-[180px] !w-full !rounded-lg !cursor-pointer !mx-auto"
              @click="goto_product_Route(product)"
            >
              <!-- Skeleton -->
              <div
                v-if="!imageLoadedMap[product.id]"
                class="!absolute !inset-0 !w-full !h-full !rounded-lg !bg-gradient-to-r !from-gray-200/50 !to-gray-100/50 !animate-pulse"
              ></div>

              <!-- Preload -->
              <img
                :src="$store.state.root_media_api + product.product_image"
                style="position:absolute;width:0;height:0;opacity:0;"
                @load="onProductImageLoad(product.id)"
                alt=""
              />

              <!-- Visible Image -->
              <img
                v-show="imageLoadedMap[product.id]"
                :src="$store.state.root_media_api + product.product_image"
                :alt="product.product_title"
                class="!w-full !h-full !object-cover !rounded-lg !transition-transform hover:!scale-105"
              />

              <!-- Category Badge -->
              <div class="category-badge">
                {{ product.category_name }}
              </div>

              <!-- AR Badge -->
              <div class="ar-badge">AR</div>
            </div>

            <!-- Product Info -->
            <div class="!mt-3 !space-y-2">
              <!-- Title -->
              <div class="!text-left">
                <h3 class="!font-semibold truncate whitespace-nowrap !text-sm md:!text-base !text-gray-900 !line-clamp-2">
                  {{ truncateText(product.product_title || 'No title available', 22) }}
                </h3>
              </div>

              <!-- Colors Row -->
              <div class="!flex !items-center !justify-between !w-full">
                <span class="!text-xs !text-gray-600 !font-medium">Colors</span>
                <div class="!flex !gap-1">
                  <div
                    v-for="(c, i) in product.product_colors.slice(0,2)"
                    :key="i"
                    class="!w-5 !h-5 !rounded-full !border-2 !border-gray-300 !shadow-sm hover:!shadow-md !transition-all !cursor-pointer"
                    :style="{ background: c.color || c.color_hex }"
                  ></div>
                </div>
              </div>

              <!-- Price Row -->
              <div class="!flex !items-center !justify-between !w-full">
                <span class="!text-xs !text-gray-600 !font-medium">Price</span>
                <span class="!text-lg !font-bold !text-gray-900">${{ product.product_price }}</span>
              </div>

              <!-- Buttons Row -->
              <div class="!flex !items-center !gap-2 !w-full !mt-3">
                <!-- Details Button -->
                <a-button 
                  block 
                  @click="goto_product_Route(product)"
                  class="!flex-1 !h-10 !text-xs !rounded-lg !font-medium !shadow-sm hover:!shadow-md !transition-all"
                >
                  Product Details
                </a-button>
                
                <!-- Like Button -->
                <a-button 
                  @click="toggleFavorite(product.product_id, product.type, product)" 
                  class="!w-12 !h-10 !p-[6px] !rounded-lg !flex !items-center !justify-center !shadow-sm hover:!shadow-md !transition-all"
                >
                  <template v-if="product.is_favorited">
                    <HeartFilled class="!text-lg !text-red-500" />
                  </template>
                  <template v-else>
                    <HeartOutlined class="!text-lg" />
                  </template>
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { HeartOutlined, HeartFilled } from '@ant-design/icons-vue'

export default {
  name: 'buisnes_products_sailing',
  components: {
    HeartOutlined,
    HeartFilled
  },
  props: {
    products: Object
  },
  data() {
  return {
    imageLoadedMap: {},
  };
},
   watch: {
  '$route.params.product_id'(newVal, oldVal) {
    if (newVal !== oldVal) {
      window.location.reload()
    }
  },
  },

  methods: {
      goto_product_Route(product){
        let product_type= product.type
        if(product.type==='light'){
          product_type='product'
        }
        if(product.type==='floor_texture'){
          product_type='floor'
        }        
        if(product.type==='wall_texture'){
          product_type='wall'
        }
      this.$router.push({
      name: 'buisness_product',
      params: {
        buisness_name: this.$route.params.buisness_name,
        product_type: product_type,
        product_id: product.product_id
      }
    })
  
    },
    truncateText(text, charLimit = 18) {
      if (!text) return '';
      if (text.length <= charLimit) return text;
      return text.slice(0, charLimit) + '...';
    },
    
    handleAddProduct() {
      console.log('Add product clicked');
      // Handle add product functionality
    },

     onProductImageLoad(id) {
    this.imageLoadedMap[id] = false;
    setTimeout(() => {
      this.imageLoadedMap[id] = true;
    }, 2000);
  },
    
    handleProductDetail(product) {
      console.log('Product detail clicked:', product);
      // Navigate to product detail page
      this.$router.push(
        '/' + this.$route.params.buisness_name + '/' + 
        product.product_type + '/' + product.product_id
      );
    },
    
    async toggleFavorite(product_id, product_type, product) {
      try {
        const token = localStorage.getItem('token');
        
        // Check if user is authenticated
        if (!token) {
          this.$message.warning('Please login to add favorites');
          return;
        }
        
        const response = await fetch(
          `${this.$store.state.root_api}likes/favorites/toggle/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Token ${token}`,
            },
            body: JSON.stringify({
              id: product_id,
              type: product_type,
            }),
          }
        );
        
        const data = await response.json();

        // Update the product's favorite status
        product.is_favorited = data.favorited;
        
        // Show success message
        const message = data.favorited ? 'Added to favorites' : 'Removed from favorites';
        this.$message.success(message);

      } catch (error) {
        console.error("Favorite toggle failed", error);
        this.$message.error('Failed to update favorite');
      }
    }
  }
}
</script>


<!-- <style scoped>
.product-image-container {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
  overflow: hidden;
  height: 160px;
  width: 100%;
}

@media (min-width: 768px) {
  .product-image-container {
    height: 180px;
  }
}

.category-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 20;
}

.ar-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(229, 231, 235, 0.8);
  color: #374151;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  z-index: 20;
}

/* Fixed Mobile Grid - Stays inside parent */
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  width: 100%;
  max-width: 100%;
  padding: 0 4px;  /* Tiny padding for edge spacing */
  box-sizing: border-box;
}

.product-card-wrapper {
  width: 100%;
  max-width: 100%;
}

/* Tablet: 4 columns */
@media (min-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 0 8px;
  }
}

/* Desktop: 5 columns */
@media (min-width: 1200px) {
  .grid-container {
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    padding: 0 12px;
  }
}

/* Skeleton Animation */
.product-skeleton {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: linear-gradient(
    110deg,
    #e5e7eb 8%,
    #f9fafb 18%,
    #e5e7eb 33%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite linear;
  z-index: 10;
}

@keyframes shimmer {
  to {
    background-position-x: -200%;
  }
}
</style> -->

<style scoped>
.product-image-container {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
  overflow: hidden;
  height: 160px;
  width: 100%;
}

@media (min-width: 768px) {
  .product-image-container {
    height: 180px;
  }
}

/* MOBILE: Exactly 2 cards */
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
  padding: 0 4px;
  box-sizing: border-box;
  justify-items: center;
}

.product-card-wrapper {
  width: 100%;
  max-width: 170px; /* Mobile & below md */
}

@media (min-width: 768px) {
  .product-card-wrapper {
    max-width: 200px; /* md and above */
  }
}


/* Tablet: 4 cards */
@media (min-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(4, minmax(170px, 1fr));
    gap: 12px;
    padding: 0 8px;
  }
}

/* Desktop: 5 cards */
@media (min-width: 1200px) {
  .grid-container {
    grid-template-columns: repeat(5, minmax(170px, 1fr));
    gap: 1px;
    padding: 0 12px;
  }
}

.category-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 20;
}

.ar-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(229, 231, 235, 0.8);
  color: #374151;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  z-index: 20;
}

.product-skeleton {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: linear-gradient(
    110deg,
    #e5e7eb 8%,
    #f9fafb 18%,
    #e5e7eb 33%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite linear;
  z-index: 10;
}

@keyframes shimmer {
  to {
    background-position-x: -200%;
  }
}
</style>

