<!-- EarnPhotos.vue -->
<template>
  <div class="w-full">
    <!-- Hero Section -->
    <section class="relative h-[400px] md:h-[500px] bg-gray-100 overflow-hidden">
      <img 
        src="../../assets/earn1.svg" 
        alt="Earn Photos Hero" 
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 flex items-center justify-center px-4">
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 text-center leading-tight tracking-tight" 
            style="font-family: 'Proza Libre';">
          Earn Photos
        </h1>
      </div>
    </section>

    <!-- Main Title -->
    <section class="py-16 px-16 bg-white">
      <div class="max-w-8xl px-auto text-center">
        <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-16 leading-tight tracking-tight" 
            style="font-family: 'Proza Libre'; letter-spacing: -0.02em;">
          Earn Photos Now!
        </h2>

        <!-- Step 01 - Read the Feature Article -->
        <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20">
          <div class="order-2 md:order-1">
            <img 
              src="../../assets/earn2.svg" 
              alt="Read Feature Article" 
              class="w-full h-auto rounded-2xl shadow-xl"
            />
          </div>
          <div class="order-1 md:order-2 text-left">
            <div class="text-8xl md:text-9xl font-bold text-gray-200 mb-4" style="font-family: 'Proza Libre';">
             <img src="/01 (1).svg" alt="01" />
            </div>
            <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Read the Feature Article
            </h3>
            <p class="text-gray-600 text-base md:text-lg leading-relaxed">
              With the help of virtual staging, you can create realistic, digital previews of spaces, 
              providing a cost-effective solution for real estate and design.
            </p>
          </div>
        </div>

        <!-- Step 02 - Share or Repost -->
        <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20">
          <div class="order-1 text-left">
            <div class="text-8xl md:text-9xl font-bold text-gray-200 mb-4" style="font-family: 'Proza Libre';">
              <img src="/02.svg" alt="01" />
            </div>
            <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Share or Repost on any of<br />these platforms
            </h3>
            <p class="text-gray-600 text-base md:text-lg leading-relaxed">
              With the help of virtual staging, you can create realistic, digital previews of spaces, 
              providing a cost-effective solution for real estate and design.
            </p>
          </div>
          <div class="order-2">
            <img 
              src="../../assets/earn3.svg" 
              alt="Share or Repost" 
              class="w-full h-auto rounded-2xl shadow-xl"
            />
          </div>
        </div>

        <!-- Step 03 - Capture Your Share -->
        <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20">
          <div class="order-2 md:order-1">
            <img 
              src="../../assets/earn4.png" 
              alt="Capture Your Share" 
              class="w-full h-auto rounded-2xl shadow-xl"
            />
          </div>
          <div class="order-1 md:order-2 text-left">
            <div class="text-8xl md:text-9xl font-bold text-gray-200 mb-4" style="font-family: 'Proza Libre';">
              <img src="/03.svg" alt="01" />
            </div>
            <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Capture Your Share
            </h3>
            <p class="text-gray-600 text-base md:text-lg leading-relaxed">
              With the help of virtual staging, you can create realistic, digital previews of spaces, 
              providing a cost-effective solution for real estate and design.
            </p>
          </div>
        </div>

        <!-- Step 04 - Read the Feature Article -->
        <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20">
          <div class="order-1 text-left">
            <div class="text-8xl md:text-9xl font-bold text-gray-200 mb-4" style="font-family: 'Proza Libre';">
              <img src="/04.svg" alt="01" />
            </div>
            <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Read the Feature Article
            </h3>
            <p class="text-gray-600 text-base md:text-lg leading-relaxed">
              With the help of virtual staging, you can create realistic, digital previews of spaces, 
              providing a cost-effective solution for real estate and design.
            </p>
          </div>
          <div class="order-2">
            <img 
              src="../../assets/earn5.png" 
              alt="Read Feature Article" 
              class="w-full h-auto rounded-2xl shadow-xl"
            />
          </div>
        </div>

        <!-- Step 05 - Claim Your Reward -->
        <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20">
          <div class="order-2 md:order-1">
            <img 
              src="../../assets/earn6.png" 
              alt="Claim Your Reward" 
              class="w-full h-auto rounded-2xl shadow-xl"
            />
          </div>
          <div class="order-1 md:order-2 text-left">
            <div class="text-8xl md:text-9xl font-bold text-gray-200 mb-4" style="font-family: 'Proza Libre';">
              <img src="/05.svg" alt="01" />
            </div>
            <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Claim Your Reward
            </h3>
            <p class="text-gray-600 text-base md:text-lg leading-relaxed">
              With the help of virtual staging, you can create realistic, digital previews of spaces, 
              providing a cost-effective solution for real estate and design.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "EarnPhotos"
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Proza+Libre:wght@400;600;700;800&display=swap');

/* Smooth transitions */
img {
  transition: transform 0.3s ease-in-out;
}

img:hover {
  transform: scale(1.02);
}
</style>