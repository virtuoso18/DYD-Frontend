<template>

  <div
  style="
    font-family: 'Proza Libre', sans-serif !important;
    font-weight: 700;
    font-style: normal;
    font-size: 48px;
    line-height: 52px;
    letter-spacing: -0.02em;
    text-align: center;
    color: #000;
  "
>
  Your AI, Your Catalog
</div>

<div
  style="
    font-family: 'Poppins', sans-serif !important;
    font-weight: 400;
    font-style: normal;
    font-size: 20px;
    line-height: 28px;
    letter-spacing: -0.02em;
    text-align: center;
    color: #6b7280;
  "
>
  Effortlessly integrate an AI visualizer into your website and showcase
  your catalog like never before
</div>


  <div class="w-full max-w-8xl  px-12  py-12">
    <!-- Carousel Container -->
    <div class="relative">
      <!-- Cards Container with Overflow -->
      <div class="overflow-x-auto">
        <div 
          class="flex transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <!-- Card 1 -->
          <div class="w-full flex-shrink-0 px-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-3xl shadow-lg overflow-hidden min-h-[400px]">
              <!-- Left Side - Image -->
              
              
              <!-- Right Side - Content -->
              <div class="flex flex-col justify-center p-8 md:p-12">
                <h2 class="text-5xl md:text-6xl font-bold text-blue-500 mb-6">01</h2>
                <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  One-Click Furniture Replacement
                </h3>
                <p class="text-gray-600 text-base md:text-lg leading-relaxed">
                  Effortlessly swap out your furniture and refresh your space in just 10 seconds with our advanced AI technology.
                </p>
              </div>
               <div class="relative h-full">
                <img 
                  src="/cardswapper.jpg" 
                  alt="Living Room" 
                  class="w-full h-full object-cover"
                />
              </div>
              
            </div>
          </div>

          <!-- Card 2 -->
          <div class="w-full flex-shrink-0 px-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-3xl shadow-lg overflow-hidden min-h-[400px]">
              <!-- Left Side - Content -->
              
              
              <!-- Right Side - Image -->
              <div class="relative h-full order-1 md:order-2">
                <img 
                  src="/cardswapper.jpg" 
                  alt="Modern Furniture" 
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex flex-col justify-center p-8 md:p-12 order-2 md:order-1">
                <h2 class="text-5xl md:text-6xl font-bold text-blue-500 mb-6">02</h2>
                <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  One-Click Furniture Replacement
                </h3>
                <p class="text-gray-600 text-base md:text-lg leading-relaxed">
                  Effortlessly swap out your furniture and refresh your space in just 10 seconds with our advanced AI technology.
                </p>
              </div>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="w-full flex-shrink-0 px-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-3xl shadow-lg overflow-hidden min-h-[400px]">
              <!-- Left Side - Image -->
             
              
              <!-- Right Side - Content -->
              <div class="flex flex-col justify-center p-8 md:p-12">
                <h2 class="text-5xl md:text-6xl font-bold text-blue-500 mb-6">03</h2>
                <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  One-Click Furniture Replacement
                </h3>
                <p class="text-gray-600 text-base md:text-lg leading-relaxed">
                  Effortlessly swap out your furniture and refresh your space in just 10 seconds with our advanced AI technology.
                </p>
              </div>
               <div class="relative h-full">
                <img 
                  src="/cardswapper.jpg" 
                  alt="Minimalist Room" 
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-center gap-4 pt-8">
        <!-- Previous Button -->
        <button
          @click="prevSlide"
          :disabled="currentIndex === 0"
          :class="[
            'w-12 h-12 rounded-sm flex items-center justify-center transition-all duration-300',
            currentIndex === 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
          ]"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
        </button>

        <!-- Next Button -->
        <button
          @click="nextSlide"
          :disabled="currentIndex === totalSlides - 1"
          :class="[
            'w-12 h-12 rounded-sm flex items-center justify-center transition-all duration-300',
            currentIndex === totalSlides - 1 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
          ]"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </button>
      </div>

      <!-- Dot Indicators (Optional) -->
      <!-- <div class="flex justify-center gap-2 pt-6">
        <button
          v-for="(slide, index) in totalSlides"
          :key="index"
          @click="goToSlide(index)"
          :class="[
            'w-2.5 h-2.5 rounded-full transition-all duration-300',
            currentIndex === index 
              ? 'bg-blue-500 w-8' 
              : 'bg-gray-300 hover:bg-gray-400'
          ]"
        ></button>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'FurnitureCarousel',
  
  data() {
    return {
      currentIndex: 0,
      totalSlides: 3
    }
  },

  methods: {
    nextSlide() {
      if (this.currentIndex < this.totalSlides - 1) {
        this.currentIndex++
      }
    },

    prevSlide() {
      if (this.currentIndex > 0) {
        this.currentIndex--
      }
    },

    goToSlide(index) {
      this.currentIndex = index
    }
  },

  mounted() {
    // Optional: Auto-play functionality
    // this.autoPlay()
  },

  beforeUnmount() {
    // Clear interval if auto-play is enabled
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval)
    }
  },

  methods: {
    nextSlide() {
      if (this.currentIndex < this.totalSlides - 1) {
        this.currentIndex++
      }
    },

    prevSlide() {
      if (this.currentIndex > 0) {
        this.currentIndex--
      }
    },

    goToSlide(index) {
      this.currentIndex = index
    },

    // Optional: Auto-play method
    autoPlay() {
      this.autoPlayInterval = setInterval(() => {
        if (this.currentIndex < this.totalSlides - 1) {
          this.currentIndex++
        } else {
          this.currentIndex = 0
        }
      }, 5000) // Change slide every 5 seconds
    }
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
.transition-transform {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
