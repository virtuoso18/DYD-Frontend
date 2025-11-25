<template>
  <div class="w-full bg-gray-100 py-16 px-4">
    <div class="max-w-8xl px-12">
      <!-- Main Title -->
  <h3
  class="text-center pt-12 text-black"
  style="
    font-family: 'Proza Libre';
    font-weight: 700;
    font-style: bold;
    font-size: 48px;
    line-height: 52px;
    letter-spacing: -0.02em;
  "
>
  Ignite Home Design Inspiration with AI
</h3>


      <!-- Two Cards Container -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Card 1 -->
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col h-full">
          <!-- Image Slider Section -->
          <div 
            ref="card1Container"
            class="relative bg-gray-200 overflow-hidden cursor-col-resize" 
            style="height: 400px;"
            @mousedown="startDrag('card1', $event)"
            @touchstart="startDrag('card1', $event)"
          >
            <!-- Before Image -->
            <img 
              :src="card1Images[0]" 
              alt="Before" 
              class="absolute inset-0 w-full h-full object-cover select-none"
              draggable="false"
            />
            
            <!-- After Image (Clipped) -->
            <div 
              class="absolute inset-0 overflow-hidden"
              :style="{ clipPath: `inset(0 ${100 - card1SliderPosition}% 0 0)` }"
            >
              <img 
                :src="card1Images[1]" 
                alt="After" 
                class="absolute inset-0 w-full h-full object-cover select-none"
                draggable="false"
              />
            </div>

            <!-- Slider Handle -->
            <div 
              class="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 cursor-col-resize"
              :style="{ left: card1SliderPosition + '%' }"
            >
              <!-- Handle Circle -->
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
                <!-- Left Arrow -->
                <svg class="w-4 h-4 text-gray-600 absolute left-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" />
                </svg>
                <!-- Right Arrow -->
                <svg class="w-4 h-4 text-gray-600 absolute right-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <!-- Navigation Arrows -->
            <div class="absolute top-4 left-4 z-20">
              <button 
                @click="prevCard1Image"
                class="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
              >
                <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            
            <div class="absolute top-4 right-4 z-20">
              <button 
                @click="nextCard1Image"
                class="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
              >
                <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-8 flex-grow">
            <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              Boost Sales with Instant Visualizations
            </h3>
            <p class="text-gray-600 text-base leading-relaxed">
              Enhance your profitability with Collov AI's rapid visualization tools. Visualize multiple redesign options in under a minute.
            </p>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col h-full">
          <!-- Image Slider Section -->
          <div 
            ref="card2Container"
            class="relative bg-gray-200 overflow-hidden cursor-col-resize" 
            style="height: 400px;"
            @mousedown="startDrag('card2', $event)"
            @touchstart="startDrag('card2', $event)"
          >
            <!-- Before Image -->
            <img 
              :src="card2Images[0]" 
              alt="Before" 
              class="absolute inset-0 w-full h-full object-cover select-none"
              draggable="false"
            />
            
            <!-- After Image (Clipped) -->
            <div 
              class="absolute inset-0 overflow-hidden"
              :style="{ clipPath: `inset(0 ${100 - card2SliderPosition}% 0 0)` }"
            >
              <img 
                :src="card2Images[1]" 
                alt="After" 
                class="absolute inset-0 w-full h-full object-cover select-none"
                draggable="false"
              />
            </div>

            <!-- Slider Handle -->
            <div 
              class="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 cursor-col-resize"
              :style="{ left: card2SliderPosition + '%' }"
            >
              <!-- Handle Circle -->
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
                @click="prevCard2Image"
                class="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
              >
                <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            
            <div class="absolute top-4 right-4 z-20">
              <button 
                @click="nextCard2Image"
                class="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
              >
                <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-8 flex-grow">
            <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              Transform Interiors with One-Click Swaps
            </h3>
            <p class="text-gray-600 text-base leading-relaxed">
              Revitalize any room effortlessly with Collov's advanced AI technology. Instantly swap and reposition furniture to suit client preferences.
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIHomeDesignSection',
  
  data() {
    return {
      card1SliderPosition: 50,
      card2SliderPosition: 50,
      isDragging: null,
      
      card1Images: [
        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80'
      ],
      
      card2Images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80'
      ],
      
      card1ImageSet: [
        ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80'],
        ['https://images.unsplash.com/photo-1618219878480-432e9b0e8b26?w=800&q=80', 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80']
      ],
      
      card2ImageSet: [
        ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80'],
        ['https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80', 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=800&q=80']
      ],
      
      card1ImageIndex: 0,
      card2ImageIndex: 0
    }
  },

  methods: {
    startDrag(card, event) {
      this.isDragging = card
      this.handleDrag(card, event)
      
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

    handleDrag(card, event) {
      const container = card === 'card1' ? this.$refs.card1Container : this.$refs.card2Container
      if (!container) return

      const rect = container.getBoundingClientRect()
      const x = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX
      const position = ((x - rect.left) / rect.width) * 100
      
      const clampedPosition = Math.max(0, Math.min(100, position))
      
      if (card === 'card1') {
        this.card1SliderPosition = clampedPosition
      } else {
        this.card2SliderPosition = clampedPosition
      }
    },

    stopDrag() {
      this.isDragging = null
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
      document.removeEventListener('touchmove', this.onDrag)
      document.removeEventListener('touchend', this.stopDrag)
    },

    nextCard1Image() {
      this.card1ImageIndex = (this.card1ImageIndex + 1) % this.card1ImageSet.length
      this.card1Images = this.card1ImageSet[this.card1ImageIndex]
      this.card1SliderPosition = 50
    },

    prevCard1Image() {
      this.card1ImageIndex = this.card1ImageIndex === 0 
        ? this.card1ImageSet.length - 1 
        : this.card1ImageIndex - 1
      this.card1Images = this.card1ImageSet[this.card1ImageIndex]
      this.card1SliderPosition = 50
    },

    nextCard2Image() {
      this.card2ImageIndex = (this.card2ImageIndex + 1) % this.card2ImageSet.length
      this.card2Images = this.card2ImageSet[this.card2ImageIndex]
      this.card2SliderPosition = 50
    },

    prevCard2Image() {
      this.card2ImageIndex = this.card2ImageIndex === 0 
        ? this.card2ImageSet.length - 1 
        : this.card2ImageIndex - 1
      this.card2Images = this.card2ImageSet[this.card2ImageIndex]
      this.card2SliderPosition = 50
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
</style>
