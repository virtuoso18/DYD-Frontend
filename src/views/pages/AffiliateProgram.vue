<!-- AffiliateProgram.vue -->
<template>
  <div class="w-full">
    <!-- Hero Section -->
    <section class="relative h-[400px] md:h-[500px] bg-gray-100 overflow-hidden">
      <img 
        src="../../assets/API1.jpg" 
        alt="Affiliate Program Hero" 
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 flex items-center justify-center px-4">
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-center leading-tight tracking-tight" 
            style="font-family: 'Proza Libre';">
          Join Our Affiliate Program
        </h1>
      </div>
    </section>

    <!-- 4 Steps Section -->
    <section class="py-16 px-4 bg-white">
      <div class="max-w-8xl mx-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Step 1 -->
          <div class="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow">
            <div class="text-5xl font-bold text-blue-600 mb-4" style="font-family: 'Proza Libre';">
              1
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Sign up</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              Sign up with our fast and easy registration—just takes a minute!
            </p>
          </div>

          <!-- Step 2 -->
          <div class="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow">
            <div class="text-5xl font-bold text-blue-600 mb-4" style="font-family: 'Proza Libre';">
              2
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Get Your Unique Link</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              Receive a personalized tracking link for effortless referrals.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow">
            <div class="text-5xl font-bold text-blue-600 mb-4" style="font-family: 'Proza Libre';">
              3
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Start Promoting</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              Share your private DYD AI through your preferred channels.
            </p>
          </div>

          <!-- Step 4 -->
          <div class="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow">
            <div class="text-5xl font-bold text-blue-600 mb-4" style="font-family: 'Proza Libre';">
              4
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Earn Rewards</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              Earn commissions on every sale made through your link.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Target Audiences Section -->
<section class="relative w-full min-h-screen flex flex-col justify-center items-center px-4 text-center">
  <div class="max-w-7xl">
        <h2
      class="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight"
      style="font-family: 'Proza Libre'; letter-spacing: -0.02em;"
    >
      Our Target Audiences
    </h2>
        <p
      class="text-gray-600 text-base md:text-lg mb-12 max-w-7xl mx-auto leading-relaxed"
    >
      At DYD, we believe AI tools should be accessible, rewarding, and shared.
      That's why our affiliate program welcomes anyone who shares our passion.
    </p>

        <div class="grid md:grid-cols-2 gap-6">
  <!-- Left Side: Real Estate Agent (Full Height) -->
  <div class="relative h-[300px] md:h-[820px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all">
    <img 
      src="../../assets/realeastate.png" 
      alt="Real Estate Agent" 
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
    <div class="absolute bottom-6 left-6 text-white">
      <h3 class="text-2xl font-bold">Real Estate Agent</h3>
    </div>
  </div>

  <!-- Right Side: Two Stacked Images -->
  <div class="flex flex-col gap-6">
    <!-- Interior Designer -->
    <div class="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all">
      <img 
        src="../../assets/interior.png" 
        alt="Interior Designer" 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      <div class="absolute bottom-6 left-6 text-white">
        <h3 class="text-2xl font-bold">Interior Designer</h3>
      </div>
    </div>

    <!-- Home Owner -->
    <div class="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all">
      <img 
        src="../../assets/homeowner.png" 
        alt="Home Owner" 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      <div class="absolute bottom-6 left-6 text-white">
        <h3 class="text-2xl font-bold">Home Owner</h3>
      </div>
    </div>
  </div>
</div>

      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 px-4 bg-white">
      <div class="max-w-8xl mx-auto">
        <h2 class="text-3xl md:text-5xl font-bold text-gray-900 text-center mb-12 leading-tight tracking-tight" 
            style="font-family: 'Proza Libre'; letter-spacing: -0.02em;">
          What our affiliates have to say
        </h2>

        <!-- Scrollable Testimonials Container -->
        <div class="relative md:px-28">
          <!-- Left Fade -->
          <div class="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden md:block"></div>
          
          <!-- Right Fade -->
          <div class="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden md:block"></div>

          <!-- Testimonials Scroll Container -->
          <div class="overflow-x-auto pb-4 scrollbar-hide">
            <div class="flex gap-6 min-w-max px-4">
              <!-- Testimonial 1 -->
              <div class="bg-white rounded-xl shadow-lg p-6 w-[350px] flex-shrink-0 hover:shadow-2xl transition-shadow">
                <div class="flex items-center gap-4 mb-4">
                  <img 
                    src="../../assets/api7.jpg" 
                    alt="Amy Lang" 
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 class="font-bold text-gray-900">Amy Lang</h4>
                    <p class="text-sm text-gray-600">Home stager</p>
                  </div>
                </div>
                <p class="text-gray-700 text-sm leading-relaxed">
                  "Even those who are not design-savvy can easily create realistic and inviting virtually staged spaces 
                  that attract potential buyers regularly."
                </p>
              </div>

              <!-- Testimonial 2 -->
              <div class="bg-white rounded-xl shadow-lg p-6 w-[350px] flex-shrink-0 hover:shadow-2xl transition-shadow">
                <div class="flex items-center gap-4 mb-4">
                  <img 
                    src="../../assets/api7.jpg" 
                    alt="Troy Sinclair" 
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 class="font-bold text-gray-900">Troy Sinclair</h4>
                    <p class="text-sm text-gray-600">Real Estate Photographer</p>
                  </div>
                </div>
                <p class="text-gray-700 text-sm leading-relaxed">
                  "Even those who are not design-savvy can easily create realistic and inviting virtually staged spaces 
                  that attract potential buyers regularly. It has taken our real estate..."
                </p>
              </div>

              <!-- Testimonial 3 -->
              <div class="bg-white rounded-xl shadow-lg p-6 w-[350px] flex-shrink-0 hover:shadow-2xl transition-shadow">
                <div class="flex items-center gap-4 mb-4">
                  <img 
                    src="../../assets/api7.jpg" 
                    alt="Sarah Johnson" 
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 class="font-bold text-gray-900">Sarah Johnson</h4>
                    <p class="text-sm text-gray-600">Interior Designer</p>
                  </div>
                </div>
                <p class="text-gray-700 text-sm leading-relaxed">
                  "Even those who are not design-savvy can easily create realistic and inviting virtually staged spaces 
                  that attract potential buyers regularly."
                </p>
              </div>

              <!-- Testimonial 4 -->
              <div class="bg-white rounded-xl shadow-lg p-6 w-[350px] flex-shrink-0 hover:shadow-2xl transition-shadow">
                <div class="flex items-center gap-4 mb-4">
                  <img 
                    src="../../assets/api7.jpg" 
                    alt="Mike Davis" 
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 class="font-bold text-gray-900">Mike Davis</h4>
                    <p class="text-sm text-gray-600">Real Estate Agent</p>
                  </div>
                </div>
                <p class="text-gray-700 text-sm leading-relaxed">
                  "Even those who are not design-savvy can easily create realistic and inviting virtually staged spaces 
                  that attract potential buyers regularly."
                </p>
              </div>

              <!-- Testimonial 5 -->
              <div class="bg-white rounded-xl shadow-lg p-6 w-[350px] flex-shrink-0 hover:shadow-2xl transition-shadow">
                <div class="flex items-center gap-4 mb-4">
                  <img 
                    src="../../assets/api7.jpg" 
                    alt="Emily White" 
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 class="font-bold text-gray-900">Emily White</h4>
                    <p class="text-sm text-gray-600">Property Investor</p>
                  </div>
                </div>
                <p class="text-gray-700 text-sm leading-relaxed">
                  "Even those who are not design-savvy can easily create realistic and inviting virtually staged spaces 
                  that attract potential buyers regularly."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section - Swap Furniture -->
    <section class="relative py-20 px-4 overflow-hidden">
      <img 
        src="../../assets/api8.svg" 
        alt="Swap Furniture Background" 
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-blue-100/30"></div>
      <div class="relative max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-12 leading-tight tracking-tight" 
            style="font-family: 'Proza Libre'; letter-spacing: -0.02em;">
          Swap the furniture to<br />match your vision
        </h2>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:shadow-xl inline-flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1V19M10 19L14 15M10 19L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          View on AR
        </button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "AffiliateProgram"
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Proza+Libre:wght@400;600;700;800&display=swap');

/* Hide scrollbar but keep functionality */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Smooth scroll */
.overflow-x-auto {
  scroll-behavior: smooth;
}

/* Smooth transitions */
img {
  transition: transform 0.3s ease-in-out;
}
</style>