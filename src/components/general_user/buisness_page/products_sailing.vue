<template>
  <div class="md:!p-3 !bg-white !rounded-xl !border-2 !border-gray-200/20">
    <div class="!pb-5 md:!pb-6">
      <!-- Responsive Grid -->
      <div class="grid grid-cols-2 px-1.25 gap-1.25 md:grid-cols-3 md:px-2 md:gap-2 lg:grid-cols-4 lg:px-2.5 lg:gap-2.5 xl:grid-cols-5 xl:px-3 xl:gap-3 w-full">
        <div 
          v-for="product in products"
          :key="product.product_id"
          class="p-1.25"
        >
          <div class="p-2.5 mb-2.5 rounded-xl bg-gray-100">
            <!-- Product Image -->
            <div
              class="relative overflow-hidden cursor-pointer w-full h-[170px]"
              @click="goto_product_Route(product)"
            >
              <!-- ✨ FIXED: Skeleton with proper class -->
              <div
                v-if="!imageLoadedMap[product.product_id]"
                class="product-image-skeleton"
              ></div>

              <!-- Preload -->
              <img
                :src="$store.state.root_media_api + product.product_image"
                class="absolute w-0 h-0 opacity-0"
                @load="onProductImageLoad(product.product_id)"
                alt=""
              />

              <!-- Visible Image -->
              <img
                v-show="imageLoadedMap[product.product_id]"
                :src="$store.state.root_media_api + product.product_image"
                :alt="product.product_title"
                class="w-full h-full object-cover rounded-[10px] transition-transform duration-300 ease-in-out"
              />

              <!-- Category Badge -->
              <div 
                v-show="imageLoadedMap[product.product_id]"
                class="absolute top-3 left-3 bg-black/75 text-white px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider z-10"
              >
                {{ product.category_name }}
              </div>

              <!-- AR Badge -->
              <div 
                v-show="imageLoadedMap[product.product_id]"
                class="absolute top-3 right-3 bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-[10px] font-bold tracking-wider"
              >
                AR
              </div>
            </div>

            <!-- Product Info -->
            <div class="space-y-1.5">
              <!-- Title -->
              <div class="w-full">
                <b class="block w-full truncate font-medium text-sm text-start" :title="product.product_title">
                  {{ product.product_title || 'No title available' }}
                </b>
              </div>

              <!-- Colors Row -->
              <div class="flex items-center justify-between">
                <span class="font-['Poppins'] text-[13px] font-normal text-gray-700">Colors</span>
                <div class="flex -space-x-1">
                  <div
                    v-for="(c, i) in product.product_colors.slice(0, 2)"
                    :key="i"
                    class="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                    :style="{ backgroundColor: c.color || c.color_hex }"
                  ></div>
                </div>
              </div>

              <!-- Price Row -->
              <div class="flex items-center justify-between">
                <span class="font-['Poppins'] text-[13px] font-normal text-gray-700">Price</span>
                <span class="font-bold text-base">${{ product.product_price }}</span>
              </div>

              <!-- Buttons Row -->
              <div class="flex items-center gap-1.5 w-full">
                <!-- Details Button -->
                <div class="flex-1">
                  <a-button 
                    block 
                    @click="goto_product_Route(product)"
                    class="!px-2 !py-1 !text-[12px] h-7 flex items-center whitespace-nowrap"
                  >
                    Product Details
                  </a-button>
                </div>
                
                <!-- Like Button -->
                <div class="flex-shrink-0">
                  <a-button 
                    @click="toggleFavorite(product.product_id, product.type, product)" 
                    class="flex items-center justify-center h-7 !px-2 leading-none"
                  >
                    <template v-if="product.is_favorited">
                      <HeartFilled class="!text-red-500 text-[16px] -translate-y-0.5 leading-none" />
                    </template>
                    <template v-else>
                      <HeartOutlined class="text-[16px] leading-none text-gray-600" />
                    </template>
                  </a-button>
                </div>
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
      let product_type = product.type
      if(product.type === 'light'){
        product_type = 'product'
      }
      if(product.type === 'floor_texture'){
        product_type = 'floor'
      }        
      if(product.type === 'wall_texture'){
        product_type = 'wall'
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
    },

    onProductImageLoad(id) {
      this.imageLoadedMap[id] = false;
      setTimeout(() => {
        this.imageLoadedMap[id] = true;
      }, 2000); // 2 second shimmer
    },
    
    handleProductDetail(product) {
      console.log('Product detail clicked:', product);
      this.$router.push(
        '/' + this.$route.params.buisness_name + '/' + 
        product.product_type + '/' + product.product_id
      );
    },
    
    async toggleFavorite(product_id, product_type, product) {
      try {
        const token = localStorage.getItem('token');
        
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
        product.is_favorited = data.favorited;
        
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

<style scoped>

/* ✨ ADDED: Product Image Skeleton */
.product-image-skeleton {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: linear-gradient(110deg, #e5e7eb 8%, #f9fafb 18%, #e5e7eb 33%);
  background-size: 200% 100%;
  animation: product-shimmer 1.6s infinite linear;
}

@keyframes product-shimmer {
  to {
    background-position-x: -200%;
  }
}

/* Shimmer Effect for Images */
.shimmer-effect {
  background: linear-gradient(
    110deg,
    #e5e7eb 8%,
    #f9fafb 18%,
    #e5e7eb 33%
  ) !important;
  background-size: 200% 100% !important;
  animation: shimmer 8s infinite linear !important;
  border-radius: 8px !important;
}

/* Skeleton Card Container */
.skeleton-card {
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  height: 120px;
}

.grid .skeleton-card {
  width: 100%;
  aspect-ratio: 95/100;
  height: auto;
}

.list .skeleton-card {
  width: 100%;
  height: 120px;
}

/* Shimmer Skeleton for Loading State */
.shimmer-skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    110deg,
    #e5e7eb 8%,
    #f9fafb 18%,
    #e5e7eb 33%
  );
  background-size: 200% 100%;
  animation: shimmer 8s infinite linear;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position-x: 0%; }
  100% { background-position-x: -200%; }
}

.furniture-image {
  border-radius: 8px !important;
}

.see-all-link {
  color: #1890ff;
  text-decoration: none;
}
</style>
