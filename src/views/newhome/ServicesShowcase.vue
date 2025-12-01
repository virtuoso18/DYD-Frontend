<template>
  <div class="flex items-center justify-center">
    <div class="max-w-[1200px] mx-auto px-4 md:px-6 py-16">
      
      <!-- Header -->
      <h1
        class="text-center text-black mb-12"
        style="
          font-family: 'Proza Libre';
          font-weight: 700;
          font-style: normal;
          font-size: 48px;
          line-height: 52px;
          letter-spacing: -0.02em;
        "
      >Our Services</h1>

      <!-- Virtual Staging Section -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
        
        <!-- Image with Before/After Slider -->
        <div class="lg:col-span-6 order-2 lg:order-1">
          <div 
            ref="virtualStagingContainer"
            class="relative w-full h-[350px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg cursor-col-resize"
            @mousedown="startDrag('virtualStaging', $event)"
            @touchstart="startDrag('virtualStaging', $event)"
          >
            <!-- Before Image -->
            <img 
              :src="virtualStagingImages[0]" 
              alt="Before Virtual Staging"
              class="absolute inset-0 w-full h-full object-cover select-none"
              draggable="false"
            />
            
            <!-- After Image (Clipped) -->
            <div 
              class="absolute inset-0 overflow-hidden"
              :style="{ clipPath: `inset(0 ${100 - virtualStagingSliderPosition}% 0 0)` }"
            >
              <img 
                :src="virtualStagingImages[1]" 
                alt="After Virtual Staging"
                class="absolute inset-0 w-full h-full object-cover select-none"
                draggable="false"
              />
            </div>

            <!-- Slider Handle -->
            <div 
              class="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 cursor-col-resize"
              :style="{ left: virtualStagingSliderPosition + '%' }"
            >
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
                <svg class="w-4 h-4 text-gray-600 absolute left-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" />
                </svg>
                <svg class="w-4 h-4 text-gray-600 absolute right-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <!-- Navigation Arrows -->
            <div class="absolute top-4 left-4 z-20">
              <button 
                @click="prevVirtualStagingImage"
                class="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
              >
                <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            
            <div class="absolute top-4 right-4 z-20">
              <button 
                @click="nextVirtualStagingImage"
                class="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
              >
                <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Before/After Labels -->
            
          </div>
        </div>

        <!-- Content -->
        <div class="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Virtual Staging</h2>
          
          <p class="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
            With the help of virtual staging, you can create realistic, digital previews of spaces, 
            providing a cost-effective solution for real estate and design.
          </p>

          <button
            class="w-fit bg-blue-600 !text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            @click="tryVirtualStaging"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.28387 8.51768L7.85167 7.08548C7.65647 6.89028 7.55887 6.79268 7.45353 6.74048C7.2532 6.64119 7.018 
              6.64119 6.8176 6.74048C6.71233 6.79268 6.61471 6.89028 6.41949 7.08548C6.22425 7.28075 6.12664 7.37835 
              6.07446 7.48361C5.97518 7.68401 5.97518 7.91921 6.07446 8.11955C6.12664 8.22488 6.22425 8.32248 6.41949 
              8.51768L7.85167 9.94988M9.28387 8.51768L13.5805 12.8143C13.7757 13.0095 13.8733 13.1071 13.9255 13.2125C14.0248 
              13.4128 14.0248 13.648 13.9255 13.8484C13.8733 13.9537 13.7757 14.0513 13.5805 14.2465C13.3853 14.4417 
              13.2877 14.5393 13.1824 14.5915C12.982 14.6908 12.7468 14.6908 12.5465 14.5915C12.4411 14.5393 12.3435 
              14.4417 12.1483 14.2465L7.85167 9.94988M9.28387 8.51768L7.85167 9.94988"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Try Virtual Staging
          </button>
        </div>
      </div>

      <!-- 3D Rendering Section -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Content -->
        <div class="lg:col-span-6 flex flex-col justify-center">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">3D Rendering</h2>
          
          <p class="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
            We are helping you create stunning 3D renderings of furniture by transforming 3D models 
            into realistic, detailed images using advanced software.
          </p>

          <button
            class="w-fit bg-blue-600 !text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            @click="try3DRendering"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.28387 8.51768L7.85167 7.08548C7.65647 6.89028 7.55887 6.79268 7.45353 6.74048C7.2532 6.64119 
              7.018 6.64119 6.8176 6.74048C6.71233 6.79268 6.61471 6.89028 6.41949 7.08548C6.22425 7.28075 6.12664 
              7.37835 6.07446 7.48361C5.97518 7.68401 5.97518 7.91921 6.07446 8.11955C6.12664 8.22488 6.22425 8.32248 
              6.41949 8.51768L7.85167 9.94988M9.28387 8.51768L13.5805 12.8143C13.7757 13.0095 13.8733 13.1071 
              13.9255 13.2125C14.0248 13.4128 14.0248 13.648 13.9255 13.8484C13.8733 13.9537 13.7757 14.0513 
              13.5805 14.2465C13.3853 14.4417 13.2877 14.5393 13.1824 14.5915C12.982 14.6908 12.7468 14.6908 
              12.5465 14.5915C12.4411 14.5393 12.3435 14.4417 12.1483 14.2465L7.85167 9.94988M9.28387 8.51768L7.85167 9.94988"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Try 3D Rendering
          </button>
        </div>

        <!-- Image with Before/After Slider -->
        <div class="lg:col-span-6">
          <div 
            ref="rendering3DContainer"
            class="relative w-full h-[350px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg cursor-col-resize"
            @mousedown="startDrag('rendering3D', $event)"
            @touchstart="startDrag('rendering3D', $event)"
          >
            <!-- Before Image -->
            <img 
              :src="rendering3DImages[0]" 
              alt="Before 3D Rendering"
              class="absolute inset-0 w-full h-full object-cover select-none"
              draggable="false"
            />
            
            <!-- After Image (Clipped) -->
            <div 
              class="absolute inset-0 overflow-hidden"
              :style="{ clipPath: `inset(0 ${100 - rendering3DSliderPosition}% 0 0)` }"
            >
              <img 
                :src="rendering3DImages[1]" 
                alt="After 3D Rendering"
                class="absolute inset-0 w-full h-full object-cover select-none"
                draggable="false"
              />
            </div>

            <!-- Slider Handle -->
            <div 
              class="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 cursor-col-resize"
              :style="{ left: rendering3DSliderPosition + '%' }"
            >
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
                <svg class="w-4 h-4 text-gray-600 absolute left-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" />
                </svg>
                <svg class="w-4 h-4 text-gray-600 absolute right-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <!-- Navigation Arrows -->
            <div class="absolute top-4 left-4 z-20">
              <button 
                @click="prevRendering3DImage"
                class="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
              >
                <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            
            <div class="absolute top-4 right-4 z-20">
              <button 
                @click="nextRendering3DImage"
                class="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
              >
                <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Before/After Labels -->
            <div class="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-semibold">
              Before
            </div>
            <div class="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-semibold">
              After
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "ServicesShowcase",
  
  data() {
    return {
      virtualStagingSliderPosition: 50,
      rendering3DSliderPosition: 50,
      isDragging: null,
      
      // Current displayed images
      virtualStagingImages: [
        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80'
      ],
      
      rendering3DImages: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80'
      ],
      
      // Image sets for navigation
      virtualStagingImageSet: [
        ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80'],
        ['https://images.unsplash.com/photo-1618219878480-432e9b0e8b26?w=800&q=80', 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80'],
        ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80']
      ],
      
      rendering3DImageSet: [
        ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80'],
        ['https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80', 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=800&q=80'],
        ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', 'https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=800&q=80']
      ],
      
      virtualStagingImageIndex: 0,
      rendering3DImageIndex: 0
    }
  },

  methods: {
    startDrag(slider, event) {
      this.isDragging = slider
      this.handleDrag(slider, event)
      
      if (event.type === 'mousedown') {
        document.addEventListener('mousemove', this.onDrag)
        document.addEventListener('mouseup', this.stopDrag)
      } else {
        document.addEventListener('touchmove', this.onDrag)
        document.addEventListener('touchend', this.stopDrag)
      }
    },

    onDrag(event) {
      if (!this.isDragging) return
      this.handleDrag(this.isDragging, event)
    },

    handleDrag(slider, event) {
      const container = slider === 'virtualStaging' 
        ? this.$refs.virtualStagingContainer 
        : this.$refs.rendering3DContainer
      
      if (!container) return

      const rect = container.getBoundingClientRect()
      const x = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX
      const position = ((x - rect.left) / rect.width) * 100
      
      const clampedPosition = Math.max(0, Math.min(100, position))
      
      if (slider === 'virtualStaging') {
        this.virtualStagingSliderPosition = clampedPosition
      } else {
        this.rendering3DSliderPosition = clampedPosition
      }
    },

    stopDrag() {
      this.isDragging = null
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
      document.removeEventListener('touchmove', this.onDrag)
      document.removeEventListener('touchend', this.stopDrag)
    },

    // Virtual Staging Navigation
    nextVirtualStagingImage() {
      this.virtualStagingImageIndex = (this.virtualStagingImageIndex + 1) % this.virtualStagingImageSet.length
      this.virtualStagingImages = this.virtualStagingImageSet[this.virtualStagingImageIndex]
      this.virtualStagingSliderPosition = 50
    },

    prevVirtualStagingImage() {
      this.virtualStagingImageIndex = this.virtualStagingImageIndex === 0 
        ? this.virtualStagingImageSet.length - 1 
        : this.virtualStagingImageIndex - 1
      this.virtualStagingImages = this.virtualStagingImageSet[this.virtualStagingImageIndex]
      this.virtualStagingSliderPosition = 50
    },

    // 3D Rendering Navigation
    nextRendering3DImage() {
      this.rendering3DImageIndex = (this.rendering3DImageIndex + 1) % this.rendering3DImageSet.length
      this.rendering3DImages = this.rendering3DImageSet[this.rendering3DImageIndex]
      this.rendering3DSliderPosition = 50
    },

    prevRendering3DImage() {
      this.rendering3DImageIndex = this.rendering3DImageIndex === 0 
        ? this.rendering3DImageSet.length - 1 
        : this.rendering3DImageIndex - 1
      this.rendering3DImages = this.rendering3DImageSet[this.rendering3DImageIndex]
      this.rendering3DSliderPosition = 50
    },

    tryVirtualStaging() {
      console.log('Try Virtual Staging clicked')
    },

    try3DRendering() {
      console.log('Try 3D Rendering clicked')
    }
  },

  beforeUnmount() {
    this.stopDrag()
  }
}
</script>

<style scoped>
.select-none {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.cursor-col-resize {
  cursor: col-resize;
}
</style>
