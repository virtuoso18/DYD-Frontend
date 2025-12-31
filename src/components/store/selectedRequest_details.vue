<template>
  <div class="w-full overflow-auto scrollbar-hide">
    <!-- Back Button -->
    <button
      @click="$emit('back-button-clicked', true)"
      class="flex items-center px-3 py-2 mb-5 gap-2 text-sm font-medium text-gray-600 rounded-lg transition-all duration-300 hover:bg-gray-100"
    >
      <svg
        width="6"
        height="11"
        viewBox="0 0 6 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="mr-2"
      >
        <path
          d="M5 10L1 5.5L5 1"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      {{ selected_request.email }}
    </button>

    <!-- Request Info Card -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 bg-gray-100 rounded-lg overflow-hidden">
      <!-- Image Column -->
      <div class="col-span-1">
        <img
          :src="$store.state.root_media_api + selected_request.image_url"
          alt="Request"
          class="w-full max-w-[200px] rounded-lg object-cover"
        />
      </div>

      <!-- Details Column -->
      <div class="col-span-1 md:col-span-3 overflow-hidden">
        <div class="mb-4">
          <div class="flex flex-col md:flex-row md:justify-between gap-2 mb-2">
            <p class="text-sm text-gray-600 break-words">
              <span class="font-bold text-gray-800">Request by:</span>
              {{ selected_request.email }}
            </p>
            <p class="text-sm text-gray-600 whitespace-nowrap">
              <span class="font-bold text-gray-800">Request date:</span>
              {{ formatDate(selected_request.created_at) }}
            </p>
          </div>
          <p class="text-sm text-gray-600 mb-2 break-words">
            <span class="font-bold text-gray-800">Requested to:</span>
            {{ selected_request.requested_to }}
          </p>
        </div>
        <p class="text-gray-800 leading-relaxed break-words">
          {{ selected_request.message }}
        </p>
      </div>
    </div>

    <!-- Generated Design Section (Completed Status) -->
    <div v-if="selected_request.status == 'Completed'" class="mt-8 overflow-hidden">
      <h3 class="text-lg font-semibold mb-1">Generated Design</h3>
      <p class="text-sm text-gray-600 mb-4">
        {{ formatDate(selected_request.created_at) }}
      </p>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Generated Image -->
        <div class="lg:col-span-7 px-0 md:px-12">
          <img
            :src="$store.state.root_media_api + selected_request.generated_image"
            alt="Generated Design"
            class="w-full max-w-full h-auto rounded-xl object-cover"
          />
        </div>

        <!-- Products Used -->
        <div class="lg:col-span-5 overflow-hidden">
          <h3 class="text-base font-semibold mb-4">Products use in Design</h3>

          <!-- Product Card Loop -->
          <div
            v-for="product in products_used"
            :key="product.id"
            class="bg-gray-50 rounded-xl p-4 mb-4 overflow-hidden"
          >
            <div class="grid grid-cols-12 gap-3">
              <!-- Product Image -->
              <div class="col-span-4">
                <div class="relative cursor-pointer overflow-hidden rounded-lg" @click="viewProduct(product)">
                  <img
                    :src="$store.state.root_media_api + product.product_image"
                    :alt="product.product_title"
                    class="w-full h-[120px] object-cover"
                  />
                </div>
              </div>

              <!-- Product Details -->
              <div class="col-span-8 overflow-hidden">
                <!-- Category & AR Badge -->
                <div class="flex justify-between items-center mb-2">
                  <span
                    class="bg-blue-50 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-xl truncate max-w-[120px]"
                  >
                    {{ product.category_name }}
                  </span>
                  <span
                    class="bg-gray-200 text-gray-600 text-[10px] font-semibold px-2 py-1 rounded-full flex-shrink-0"
                  >
                    AR
                  </span>
                </div>

                <!-- Product Title -->
                <h4 class="text-sm font-semibold mb-2 leading-tight line-clamp-2">
                  {{ product.product_title }}
                </h4>

                <!-- Color -->
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs text-gray-600">Color</span>
                  <div class="flex gap-1">
                    <div
                      v-for="(color, index) in product.product_colors.slice(0, 2)"
                      :key="index"
                      class="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                      :style="`background: ${color.color_hex || color.color}`"
                    ></div>
                  </div>
                </div>

                <!-- Price -->
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-600">Price</span>
                  <span class="text-base font-bold text-blue-600 whitespace-nowrap">
                    ${{ product.product_price }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-12 gap-2 mt-3">
              <div class="col-span-10">
                <button
                  @click="viewProduct(product)"
                  class="w-full py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Product Detail
                </button>
              </div>
              <div class="col-span-2 flex justify-center items-center">
                <button
                  class="w-full h-full py-2 px-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending State -->
    <div v-else class="mt-8">
      <div
        class="h-[40vh] flex flex-col justify-center items-center bg-gray-100 rounded-lg px-4"
      >
        <svg
          width="41"
          height="50"
          viewBox="0 0 41 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="mb-4"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M19 12C8.5063 12 0 20.5063 0 31C0 41.4937 8.5063 50 19 50C29.4937 50 38 41.4937 38 31C38 20.5063 29.4937 12 19 12ZM19 13.9C19 18.4352 17.1984 22.7847 13.9915 25.9915C10.7847 29.1984 6.4352 31 1.9 31C6.4352 31 10.7847 32.8016 13.9915 36.0085C17.1984 39.2153 19 43.5648 19 48.1C19 43.5648 20.8016 39.2153 24.0085 36.0085C27.2153 32.8016 31.5648 31 36.1 31C31.5648 31 27.2153 29.1984 24.0085 25.9915C20.8016 22.7847 19 18.4352 19 13.9Z"
            fill="#8C8C8C"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M34.918 0C31.6042 0 28.918 2.6862 28.918 6C28.918 9.3138 31.6042 12 34.918 12C38.2318 12 40.918 9.3138 40.918 6C40.918 2.6862 38.2318 0 34.918 0ZM34.918 0.6C34.918 2.03217 34.349 3.40568 33.3363 4.41838C32.3236 5.43107 30.9501 6 29.518 6C30.9501 6 32.3236 6.56893 33.3363 7.58162C34.349 8.59432 34.918 9.96783 34.918 11.4C34.918 9.96783 35.4869 8.59432 36.4996 7.58162C37.5123 6.56893 38.8858 6 40.318 6C38.8858 6 37.5123 5.43107 36.4996 4.41838C35.4869 3.40568 34.918 2.03217 34.918 0.6Z"
            fill="#CCCCCC"
          />
        </svg>
        <h4 class="text-lg font-semibold text-gray-800 mb-2 text-center">
          Thanks for Staying With Us
        </h4>
        <p class="text-sm text-gray-600 text-center">
          We're crafting your design — it will be ready shortly
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import { HeartOutlined } from '@ant-design/icons-vue'

export default {
  name: "selectedRequest",
  props: {
    selected_request: Object
  },
  components: {
    HeartOutlined
  },
  data() {
    return {
      products_used: []
    }
  },
  mounted() {
    this.loadUsedProducts()
  },
  methods: {
    async loadUsedProducts() {
      try {
        this.loadingProductsUsed = true
        const response = await fetch(
          `${this.$store.state.root_api}room_request/api/get-products-used-in-room-request/${this.selected_request.id}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json"
            }
          }
        )

        const data = await response.json()
        if (data.success) {
          this.products_used = data.data
        }
      } catch (error) {
        console.error("Failed to load products used:", error)
      } finally {
        this.loadingProductsUsed = false
      }
    },

    viewProduct(product) {
      console.log("View product:", product)
    },

    formatDate(dateString) {
      if (!dateString) return ""

      const date = new Date(dateString)
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric"
      }

      return date.toLocaleDateString("en-US", options)
    }
  }
}
</script>

<style scoped>
/* Hide scrollbar (Chrome, Safari, Edge) */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar (Firefox) */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Line clamp for multiline text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
