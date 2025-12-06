<template>
  <div class="w-full bg-white px-4  flex items-center justify-center min-h-screen">
    <div class="max-w-7xl ">
      
      <!-- Heading -->
      <div class="text-center pb-12 md:mb-16" data-aos="fade-up">
        <h2
  style="
    font-family: 'Proza Libre', sans-serif !important;
    font-weight: 700;
    font-style: normal;
    font-size: 48px;
    line-height: 44px;
    letter-spacing: -0.02em;
    color: #111827;
    margin-bottom: 16px;
  "
>
  Trusted by Top Influencers &<br>
  1M+ Interior Designers
</h2>

      </div>

      <!-- Content Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-20 items-center">
        
        <!-- Left Side - Image -->
        <div class="order-2 lg:order-1" data-aos="fade-right" data-aos-delay="200">
          <div class="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300 group">
            <img 
              src="/furnitureretail.jpg" 
              alt="Interior Design Kitchen" 
              class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            
            <!-- Overlay on hover -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <!-- Refresh Icon -->
            <div class="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors duration-200 cursor-pointer">
              <svg 
                class="w-5 h-5 text-gray-700" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Right Side - Text Content -->
        <div class="order-1 lg:order-2" data-aos="fade-left" data-aos-delay="300">
          <div class="space-y-6">
            <p class="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
              Trusted by top influencers and over <span class="font-semibold text-gray-900">1 million interior designers worldwide</span>, 
              our platform empowers creative professionals with the tools, insights, and 
              inspiration they need to bring their ideas to life.
            </p>
            
            <p class="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
              By connecting a global community of design experts, we help shape trends, 
              streamline workflows, and deliver results that set new standards in interior design.
            </p>

            <!-- Optional: Stats or CTA -->
            <!-- <div class="flex flex-wrap gap-4 pt-4">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm text-gray-600">1M+ Designers</span>
              </div>
              
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm text-gray-600">Top Influencers</span>
              </div>
              
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm text-gray-600">Global Community</span>
              </div>
            </div> -->
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrustedSection',
}
</script>

<style scoped>
/* Custom shadow for enhanced hover effect */
.hover\:shadow-3xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>
