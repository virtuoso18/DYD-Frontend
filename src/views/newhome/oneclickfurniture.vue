<template>
  <div class="w-full bg-gray-100 py-16 px-4">
    <div class="max-w-8xl px-8">
      
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1
  class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
  style="
    font-family: 'Proza Libre';
    font-weight: 700;
    font-style: bold;
    font-size: 48px;
    line-height: 52px;
    letter-spacing: -0.02em;
    text-align: center;
  "
>
  Don't Just Sell, Inspire
</h1>

        <p class="text-base md:text-lg text-gray-600 max-w-6xl mx-auto leading-relaxed">
          Effortlessly integrate an AI visualizer into your website and showcase your catalog like never before
        </p>
      </div>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        
        <!-- Card 1 -->
        <div 
          class="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
          @click="handleCardClick(1)"
        >
          <!-- Image Container -->
          <div class="relative overflow-hidden bg-gray-200" style="height: 300px;">
            <img 
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80" 
              alt="Minimalist Interior" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            <!-- Badge (Optional) -->
            <div class="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              AI Powered
            </div>
          </div>
          
          <!-- Content Section -->
          <div class="p-6 md:p-8">
            <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
              One-Click Furniture Replacement
            </h3>
            <p class="text-sm md:text-base text-gray-600 leading-relaxed mb-4">
              Effortlessly swap out your furniture and refresh your space in just 10 seconds with our advanced AI technology.
            </p>
            
            <!-- Optional CTA -->
            <div class="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
              <span class="text-sm">Learn More</span>
              <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 2 -->
        <div 
          class="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
          @click="handleCardClick(2)"
        >
          <!-- Image Container -->
          <div class="relative overflow-hidden bg-gray-200" style="height: 300px;">
            <img 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80" 
              alt="Colorful Interior" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            <!-- Badge (Optional) -->
            <div class="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              New Feature
            </div>
          </div>
          
          <!-- Content Section -->
          <div class="p-6 md:p-8">
            <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
              One-Click Furniture Replacement
            </h3>
            <p class="text-sm md:text-base text-gray-600 leading-relaxed mb-4">
              Effortlessly swap out your furniture and refresh your space in just 10 seconds with our advanced AI technology.
            </p>
            
            <!-- Optional CTA -->
            <div class="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
              <span class="text-sm">Learn More</span>
              <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InspireSection',
  
  methods: {
    handleCardClick(cardId) {
      console.log(`Card ${cardId} clicked`)
      // Add your navigation or modal logic here
      // this.$router.push('/feature-details')
      // this.$emit('open-modal', cardId)
    }
  }
}
</script>

<style scoped>
/* Enhanced hover effects */
.group:hover {
  transform: translateY(-4px);
}

/* Smooth scale animation */
@keyframes scaleUp {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}

/* Custom scrollbar if needed */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
