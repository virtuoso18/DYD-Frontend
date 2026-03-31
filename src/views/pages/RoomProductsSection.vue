<template>
  <a-collapse
    v-model:activeKey="activeKey"
    :bordered="false"
    class="room-products-collapse"
    expand-icon-position="end"
  >
    <a-collapse-panel key="products" class="room-products-panel">
      <!-- Custom Header -->
      <template #header>
        <div class="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-500">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <span class="text-sm font-semibold text-gray-700">Products Used</span>
          <span
            v-if="!productsLoading && roomProducts.length > 0"
            class="ml-1 text-xs font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full"
          >
            {{ roomProducts.length }}
          </span>
        </div>
      </template>

      <!-- Loading State -->
      <div v-if="productsLoading" class="flex items-center gap-2 py-4 px-1">
        <div class="loading-spinner"></div>
        <span class="text-sm text-gray-400">Loading products...</span>
      </div>

      <!-- Empty State -->
      <p v-else-if="roomProducts.length === 0" class="text-sm text-gray-400 px-1 py-2">
        No products found for this room.
      </p>

      <!-- Desktop: 3-column grid | Mobile: horizontal scroll row -->
      <div v-else>

        <!-- Mobile: horizontal scroll (hidden on md+) -->
        <div class="flex md:hidden gap-2 mt-1 overflow-x-auto pb-2 products-scroll-row">
          <div
            v-for="product in roomProducts"
            :key="'mob-' + product.product_id"
            class="relative flex flex-col items-center gap-1.5 p-2 rounded-xl border border-gray-100
                   hover:border-indigo-200 hover:shadow-sm transition-all bg-white text-center
                   flex-shrink-0 w-24 cursor-pointer"
            @click="goto_product_Route(product)"
          >
            <!-- Quantity badge -->
            <span
              v-if="product.quantity > 1"
              class="absolute top-1.5 right-1.5 text-[10px] font-bold bg-indigo-500 text-white
                     px-1.5 py-0.5 rounded-full leading-none"
            >
              ×{{ product.quantity }}
            </span>

            <!-- Favorite indicator -->
            <svg
              v-if="product.is_favorited"
              class="absolute top-1.5 left-1.5"
              width="12" height="12" viewBox="0 0 16 16"
              fill="#EF4444" xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6.94307 13.3105C5.06222 11.904 1.33594 8.68856 1.33594 5.79499C1.33594 3.88245 2.73944 2.33203 4.66927 2.33203C5.66927 2.33203 6.66927 2.66536 8.0026 3.9987C9.33594 2.66536 10.3359 2.33203 11.3359 2.33203C13.2657 2.33203 14.6693 3.88245 14.6693 5.79499C14.6693 8.68856 10.943 11.904 9.06214 13.3105C8.4292 13.7838 7.576 13.7838 6.94307 13.3105Z"
                stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

            <!-- Product Image -->
            <img
              :src="resolvedImageUrl(product.product_image)"
              :alt="product.product_title"
              class="w-14 h-14 rounded-lg object-cover bg-gray-100 flex-shrink-0"
              @error="onImgError"
            />

            <!-- Info -->
            <div class="w-full min-w-0">
              <p class="text-xs font-medium text-gray-900 truncate leading-snug">
                {{ product.product_title }}
              </p>
              <!-- Price (left) | Color circles (right) -->
              <div class="flex items-center justify-between mt-1 gap-0.5">
                <p class="text-xs font-semibold text-indigo-600 flex-shrink-0">${{ product.product_price }}</p>
                <div class="flex items-center gap-0.5 flex-wrap justify-end">
                  <span
                    v-for="(color, i) in parseColors(product.product_colors).slice(0,2)"
                    :key="i"
                    class="w-2.5 h-2.5 rounded-full border border-gray-200 flex-shrink-0"
                    :style="{ backgroundColor: color }"
                    :title="color"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop: 3-column grid (hidden on mobile) -->
        <div class="hidden md:grid grid-cols-3 gap-2 mt-1 ">
           
          <router-link :to="goto_product_Route(product)"


            v-for="product in roomProducts"
            :key="'desk-' + product.product_id"
            class="relative flex flex-col items-center gap-1.5 p-2 rounded-xl border border-gray-100
                   hover:border-indigo-200 transition-all bg-gray-50! text-center cursor-pointer"
                   >
                   <!-- @click="goto_product_Route(product)" -->
            <!-- Quantity badge -->
            <span
              v-if="product.quantity > 1"
              class="absolute top-1.5 right-1.5 text-[10px] font-bold bg-indigo-500 text-white
                     px-1.5 py-0.5 rounded-full leading-none"
            >
              ×{{ product.quantity }}
            </span>

            <!-- Favorite indicator -->
            <svg
              v-if="product.is_favorited"
              class="absolute top-1.5 left-1.5"
              width="12" height="12" viewBox="0 0 16 16"
              fill="#EF4444" xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6.94307 13.3105C5.06222 11.904 1.33594 8.68856 1.33594 5.79499C1.33594 3.88245 2.73944 2.33203 4.66927 2.33203C5.66927 2.33203 6.66927 2.66536 8.0026 3.9987C9.33594 2.66536 10.3359 2.33203 11.3359 2.33203C13.2657 2.33203 14.6693 3.88245 14.6693 5.79499C14.6693 8.68856 10.943 11.904 9.06214 13.3105C8.4292 13.7838 7.576 13.7838 6.94307 13.3105Z"
                stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

            <!-- Product Image -->
            <img
              :src="resolvedImageUrl(product.product_image)"
              :alt="product.product_title"
              class="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0"
              @error="onImgError"
            />

            <!-- Info -->
            <div class="w-full min-w-0">
              <p class="text-xs font-medium text-gray-900 truncate leading-snug">
                {{ product.product_title }}
              </p>
              <!-- Price (left) | Color circles (right) -->
              <div class="flex items-center justify-between mt-1 gap-0.5">
                <p class="text-xs font-semibold text-indigo-600 flex-shrink-0">${{ product.product_price }}</p>
                <div class="flex items-center gap-0.5 flex-wrap justify-end">
                  <span
v-for="(color, i) in parseColors(product.product_colors).slice(0, 2)"                    :key="i"
                    class="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0"
                    :style="{ backgroundColor: color }"
                    :title="color"
                  ></span>
                </div>
              </div>
            </div>
          </router-link>
        </div>

      </div>
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
export default {
  name: 'RoomProductsSection',

  props: {
    /** The room ID used to fetch products */
    roomId: {
      type: [Number, String],
      required: true,
    },
  },

  data() {
    return {
      roomProducts: [],
      productsLoading: false,
      /** Keep the panel open by default; set to [] to start collapsed */
      activeKey: ['products'],
    };
  },

  watch: {
    roomId: {
      immediate: true,
      handler(id) {
        if (id) this.loadRoomProducts();
      },
    },
  },

  methods: {
    async loadRoomProducts() {
      this.productsLoading = true;
      this.roomProducts = [];
      try {
        const response = await fetch(
          `${this.$store.state.root_api}community/api/room-product-frequency/?room_id=${this.roomId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Token ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          this.roomProducts = data.data;
        }
      } catch (error) {
        console.error('RoomProductsSection: Failed to load products:', error);
      } finally {
        this.productsLoading = false;
      }
    },

    /**
     * Parses product_colors into an array of hex color strings.
     * Handles:
     *   - Array of objects: [{ color: "#fff" }, ...]  ← API format
     *   - JSON string of the above
     *   - Plain hex array: ["#fff", "#000"]
     *   - Comma-separated string: "#fff, #000"
     */
    parseColors(raw) {
      if (!raw) return [];

      // If it's a string, try parsing it as JSON first
      let data = raw;
      if (typeof raw === 'string') {
        try {
          data = JSON.parse(raw);
        } catch (_) {
          // Not JSON — treat as comma-separated plain string
          return raw.split(',').map(c => c.trim()).filter(Boolean);
        }
      }

      if (Array.isArray(data)) {
        // Array of { color: "#hex" } objects
        if (data.length && typeof data[0] === 'object' && data[0] !== null) {
          return data.map(item => item.color).filter(Boolean);
        }
        // Plain string array
        return data.filter(Boolean);
      }

      return [];
    },

    /**
     * Called when a product card is clicked.
     * Add navigation / modal logic here once ready.
     */
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
      document.body.style.overflow = '';
    //   this.$router.push({
    //     name: 'buisness_product',
    //     params: {
    //       buisness_name: product.business_slug,
    //       product_type: product_type,
    //       product_id: product.product_id
    //     }
    //   })
      return "/"+product.business_slug+'/'+product_type+'/'+product.product_id
    },

    resolvedImageUrl(imagePath) {
      if (!imagePath) return 'https://placehold.co/64x64?text=N/A';
      if (imagePath.startsWith('http')) return imagePath;
      return `${this.$store.state.root_media_api}${imagePath}`;
    },

    onImgError(e) {
      e.target.src = 'https://placehold.co/64x64?text=N/A';
    },
  },
};
</script>

<style scoped>
/* Strip default Ant Design collapse chrome so it blends with the modal */
.room-products-collapse {
  background: transparent;
}

.room-products-collapse :deep(.ant-collapse-item) {
  border: none !important;
  background: transparent;
}

.room-products-collapse :deep(.ant-collapse-header) {
  padding: 10px 0 !important;
  background: transparent;
}

.room-products-collapse :deep(.ant-collapse-content) {
  border-top: none !important;
  background: transparent;
}

.room-products-collapse :deep(.ant-collapse-content-box) {
  padding: 0 !important;
}

/* Mobile horizontal scroll row — hide scrollbar but keep it functional */
.products-scroll-row {
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;        /* Firefox */
}
.products-scroll-row::-webkit-scrollbar {
  display: none;                /* Chrome / Safari */
}
.products-scroll-row > * {
  scroll-snap-align: start;
}

/* Tiny loading spinner reused from parent */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>