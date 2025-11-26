<template>
    <div className="flex items-center justify-center ">

    <div class="max-w-[1200px] mx-auto px-4 md:px-6">
      
      <!-- Header -->
         <h1
  class="text-center pt-12 text-black"
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
          <div class="relative w-full h-[350px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg">
            <!-- Before/After Image Slider Container -->
            <div class="absolute inset-0">
              <!-- Before Image (Left side) -->
              <div 
                class="absolute top-0 left-0 h-full overflow-hidden"
                :style="{ width: sliderPosition + '%' }"
              >
                <img 
                  src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?cs=srgb&dl=pexels-jvdm-1457842.jpg&fm=jpg" 
                  alt="Before Virtual Staging"
                  class="w-full h-full object-cover"
                  style="width: calc(100% * 100 / var(--slider-position, 50));"
                />
              </div>

              <!-- After Image (Right side) -->
              <img 
                src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?cs=srgb&dl=pexels-jvdm-1457842.jpg&fm=jpg" 
                alt="After Virtual Staging"
                class="absolute top-0 left-0 w-full h-full object-cover"
              />

              <!-- Slider Handle -->
              <div 
                class="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 shadow-lg"
                :style="{ left: sliderPosition + '%' }"
                @mousedown="startDragging"
                @touchstart="startDragging"
              >
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <div class="flex gap-1">
                    <svg width="8" height="16" viewBox="0 0 8 16" fill="none">
                      <path d="M3 1L1 8L3 15" stroke="#374151" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <svg width="8" height="16" viewBox="0 0 8 16" fill="none">
                      <path d="M5 1L7 8L5 15" stroke="#374151" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Placeholder if no images -->
            <div class="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
              <span class="text-lg">Before/After Image Slider</span>
            </div>
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

        <!-- Image -->
        <div class="lg:col-span-6">
          <div class="relative w-full h-[350px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg bg-gray-200">
            <img 
              src="/furnitureretail.svg" 
              alt="3D Rendering Example"
              class="w-full h-full object-cover"
            />
            <!-- Placeholder -->
            <div class="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
              <span class="text-lg">3D Rendering Image</span>
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
      sliderPosition: 50, // Start at 50% (middle)
      isDragging: false
    }
  },

  methods: {
    startDragging(event) {
      this.isDragging = true;
      event.preventDefault();
      
      document.addEventListener('mousemove', this.onDrag);
      document.addEventListener('mouseup', this.stopDragging);
      document.addEventListener('touchmove', this.onDrag);
      document.addEventListener('touchend', this.stopDragging);
    },

    onDrag(event) {
      if (!this.isDragging) return;

      const container = event.target.closest('.relative');
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = event.type.includes('mouse') 
        ? event.clientX 
        : event.touches[0].clientX;
      
      let position = ((x - rect.left) / rect.width) * 100;
      position = Math.max(0, Math.min(100, position)); // Clamp between 0 and 100
      
      this.sliderPosition = position;
    },

    stopDragging() {
      this.isDragging = false;
      document.removeEventListener('mousemove', this.onDrag);
      document.removeEventListener('mouseup', this.stopDragging);
      document.removeEventListener('touchmove', this.onDrag);
      document.removeEventListener('touchend', this.stopDragging);
    },

    tryVirtualStaging() {
      console.log('Try Virtual Staging clicked');
      // Add your navigation or action here
    },

    try3DRendering() {
      console.log('Try 3D Rendering clicked');
      // Add your navigation or action here
    }
  },

  beforeUnmount() {
    // Clean up event listeners
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.stopDragging);
    document.removeEventListener('touchmove', this.onDrag);
    document.removeEventListener('touchend', this.stopDragging);
  }
}
</script>

<style scoped>
/* Prevent text selection while dragging */
.cursor-ew-resize {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>
