<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click="closeModal"
      >
        <!-- Modal Container - Added no-scrollbar class and removed overflow-y-auto from main div -->
        <div 
          class="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all relative max-h-[90vh] overflow-hidden flex flex-col"
          :class="[
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          ]"
          @click.stop
        >
          <!-- Scrollable Content Wrapper -->
          <div class="overflow-y-auto no-scrollbar p-6 md:p-8">
            <!-- Close Button -->
            <button 
              @click="closeModal"
              class="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Header with Icon -->
            <div class="flex items-center gap-3 mb-6">
              <div class="bg-blue-100 p-2 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">
                {{ title }}
              </h2>
            </div>

            <!-- Subtitle -->
            <p class="text-sm text-gray-600 mb-6">
              {{ subtitle }}
            </p>

            <!-- Image Carousel with Navigation -->
            <div class="relative mb-6">
              <div class="relative rounded-2xl overflow-hidden bg-gray-100 h-[300px]">
                <!-- Main Image -->
                <img 
                  :src="currentTexture.image" 
                  :alt="currentTexture.name"
                  class="w-full h-full object-cover"
                />

                <!-- Navigation Arrows -->
                <button 
                  v-if="textures.length > 1"
                  @click="previousTexture"
                  class="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button 
                  v-if="textures.length > 1"
                  @click="nextTexture"
                  class="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

               
              </div>
            </div>

            <!-- Texture Details -->
            <div class="flex justify-between px-">
              <!-- Composition -->
              <div class="bg-gray-50 rounded-xl p-4">
                <h3 class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  {{ compositionLabel }}
                </h3>
                <p class="text-sm text-gray-600">{{ currentTexture.composition }}</p>
              </div>

              <!-- Origin -->
              <div v-if="currentTexture.origin" class="bg-gray-50 rounded-xl p-4">
                <h3 class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ originLabel }}
                </h3>
                <p class="text-sm text-gray-600">{{ currentTexture.origin }}</p>
              </div>
            </div>

            <!-- Color Swatches -->
            <div v-if="currentTexture.colors && currentTexture.colors.length > 0" class="mb-6">
              <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Available Colors
              </h3>
              <div class="flex flex-wrap gap-3">
                <div 
                  v-for="(color, index) in currentTexture.colors" 
                  :key="index"
                  @click="selectColor(color)"
                  class="relative w-12 h-12 rounded-xl cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg"
                  :class="[
                    selectedColor === color 
                      ? 'ring-4 ring-blue-500 ring-offset-2 scale-105' 
                      : 'hover:scale-110'
                  ]"
                  :style="{ backgroundColor: color.hex || color }"
                >
                  <!-- Checkmark for selected color -->
                  <div 
                    v-if="selectedColor === color"
                    class="absolute inset-0 flex items-center justify-center"
                  >
                    <svg class="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-3">
              <button 
                @click="closeModal"
                class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button 
                @click="applyTexture"
                class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!selectedColor && currentTexture.colors && currentTexture.colors.length > 0"
              >
                <span class="flex items-center text-white justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Apply Texture
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
export default {
  name: "TextureModal",
  
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    textures: {
      type: Array,
      required: true,
      default: () => []
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: 'POLY Fabric Selection'
    },
    subtitle: {
      type: String,
      default: 'Grey fabric, robust and durable'
    },
    compositionLabel: {
      type: String,
      default: 'Composition'
    },
    originLabel: {
      type: String,
      default: 'Origin'
    }
  },

  data() {
    return {
      currentIndex: 0,
      selectedColor: null
    }
  },

  computed: {
    currentTexture() {
      if (this.textures.length === 0) {
        return {
          image: '',
          name: '',
          composition: '',
          origin: '',
          colors: []
        };
      }
      return this.textures[this.currentIndex];
    }
  },

  watch: {
    isOpen(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
        this.currentIndex = this.initialIndex;
        this.selectedColor = null;
      } else {
        document.body.style.overflow = '';
      }
    },

    initialIndex(newVal) {
      if (this.isOpen) {
        this.currentIndex = newVal;
      }
    }
  },

  mounted() {
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
    }
  },

  beforeUnmount() {
    document.body.style.overflow = '';
  },

  methods: {
    closeModal() {
      this.$emit('close');
    },

    nextTexture() {
      this.currentIndex = (this.currentIndex + 1) % this.textures.length;
      this.selectedColor = null;
    },

    previousTexture() {
      this.currentIndex = this.currentIndex === 0 
        ? this.textures.length - 1 
        : this.currentIndex - 1;
      this.selectedColor = null;
    },

    selectColor(color) {
      this.selectedColor = color;
    },

    applyTexture() {
      this.$emit('apply', {
        texture: this.currentTexture,
        color: this.selectedColor,
        index: this.currentIndex
      });
    }
  }
}
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
