<template>
  <div 
    class="rounded-xl bg-white shadow-lg   hover:shadow-md transition cursor-pointer"
    :style="{ width: width, height: height }"
  >

    <!-- Image + tags -->
<div
  class="relative rounded-xl overflow-hidden"
  :style="{ width: imageWidth, height: imageHeight }"
>
  <!-- Skeleton -->
  <div
    v-if="!imageLoadedMap[image]"
    class="hero-skeleton"
  ></div>

  <!-- Preload image -->
  <img
    :src="image"
    style="position:absolute;width:0;height:0;opacity:0;"
    @load="onImageLoad(image)"
    alt=""
  />

  <!-- Visible image -->
  <img
    v-show="imageLoadedMap[image]"
    :src="image"
    class="w-full h-full object-cover"
  />

      <!-- Tags -->
      <div class="absolute top-3 left-3 flex gap-1 sm:gap-2">
        <span 
          v-for="(tag, index) in tags"
          :key="index"
          class="bg-black/60 text-white px-1 sm:px-2 py-1 text-[7px] sm:text-xs rounded-md"
        >
          {{ tag }}
        </span>
      </div>

      <!-- View Count -->
      <div 
  v-if="views !== null && views !== undefined"
  class="absolute top-3 right-3 flex items-center  text-white px-1 sm:px-2 py-1 sm:text-sm text-[10px] rounded-md"
>
  <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_9924_32849)">
<path d="M6.5 10C6.5 10 8.5 6.5 12 6.5C15.5 6.5 17.5 10 17.5 10C17.5 10 15.5 13.5 12 13.5C8.5 13.5 6.5 10 6.5 10Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" shape-rendering="crispEdges"/>
<path d="M12 11.3125C12.8284 11.3125 13.5 10.7249 13.5 10C13.5 9.27513 12.8284 8.6875 12 8.6875C11.1716 8.6875 10.5 9.27513 10.5 10C10.5 10.7249 11.1716 11.3125 12 11.3125Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" shape-rendering="crispEdges"/>
</g>
<defs>
<filter id="filter0_d_9924_32849" x="0" y="0" width="24" height="20" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="3"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.85 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_9924_32849"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_9924_32849" result="shape"/>
</filter>
</defs>
</svg>

  {{ views }}
</div>

    </div>

    <!-- Bottom Person + Likes + Comments -->
    <div class="px-3 py-2 flex items-center justify-between">

      <!-- Avatar + Name -->
      <div class="flex items-center gap-2">
        <img style="border:1px solid rgba(0,0,0,0.1)"
          :src="avatar" 
          class="w-8 h-8 rounded-full border"
        />
<span class="!font-poppins font-normal text-[7px] sm:text-[14px] leading-[20px] tracking-normal text-center text-gray-600">
  {{ name }}
</span>
      </div>

      <!-- Likes & Comments -->
      <div class="flex items-center gap-1 sm:gap-4 text-gray-700 text-[8px] sm:text-sm">

        <!-- Comments -->
        <div 
  v-if="comments !== null && comments !== undefined" 
  class="flex items-center gap-1"
>
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.33203 3.99967C1.33203 3.29243 1.61298 2.61415 2.11308 2.11406C2.61318 1.61396 3.29145 1.33301 3.9987 1.33301H11.9987C12.7059 1.33301 13.3842 1.61396 13.8843 2.11406C14.3844 2.61415 14.6654 3.29243 14.6654 3.99967V9.33301C14.6654 10.0403 14.3844 10.7185 13.8843 11.2186C13.3842 11.7187 12.7059 11.9997 11.9987 11.9997H8.8667L5.0347 14.5543C4.9343 14.6211 4.81767 14.6595 4.69722 14.6652C4.57677 14.671 4.45701 14.644 4.3507 14.5871C4.24439 14.5301 4.1555 14.4455 4.09352 14.342C4.03153 14.2386 3.99876 14.1203 3.9987 13.9997V11.9997C3.29145 11.9997 2.61318 11.7187 2.11308 11.2186C1.61298 10.7185 1.33203 10.0403 1.33203 9.33301V3.99967ZM3.9987 2.66634C3.64508 2.66634 3.30594 2.80682 3.05589 3.05687C2.80584 3.30691 2.66536 3.64605 2.66536 3.99967V9.33301C2.66536 9.68663 2.80584 10.0258 3.05589 10.2758C3.30594 10.5259 3.64508 10.6663 3.9987 10.6663H4.66536C4.84218 10.6663 5.01174 10.7366 5.13677 10.8616C5.26179 10.9866 5.33203 11.1562 5.33203 11.333V12.7543L8.29603 10.7783C8.40541 10.7054 8.5339 10.6664 8.66536 10.6663H11.9987C12.3523 10.6663 12.6915 10.5259 12.9415 10.2758C13.1916 10.0258 13.332 9.68663 13.332 9.33301V3.99967C13.332 3.64605 13.1916 3.30691 12.9415 3.05687C12.6915 2.80682 12.3523 2.66634 11.9987 2.66634H3.9987Z" fill="black"/>
</svg>

  {{ formatNumber(comments) }}
</div>

        <!-- Likes -->
<div 
  v-if="likes !== null && likes !== undefined" 
  class="flex items-center gap-1 cursor-pointer"
  @click="toggleLike"
>
  <!-- Filled heart when liked -->
  <svg 
    v-if="is_liked" 
    width="16" 
    height="16" 
    fill="red" 
    class="transition-colors duration-200"
  >
    <path d="M8 14s6-4.35 6-8.5A3.5 3.5 0 0 0 8 4a3.5 3.5 0 0 0-6 1.5C2 9.65 8 14 8 14z" />
  </svg>
  
  <!-- Outlined heart when not liked -->
  <svg 
    v-else 
    width="16" 
    height="16" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="1.5"
    class="transition-colors duration-200"
  >
    <path d="M8 14s6-4.35 6-8.5A3.5 3.5 0 0 0 8 4a3.5 3.5 0 0 0-6 1.5C2 9.65 8 14 8 14z" />
  </svg>
  
  <span>{{ likes }}</span>
</div>


      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "DesignCard",

  data() {
  return {
    imageLoadedMap: {},
  }
},


  props: {
    image: String,
    avatar: String,
    tags: Array,
    views: Number,
    name: String,
    likes: Number,
    comments: Number,
    is_liked: Boolean,
    width: { type: String, default: "100%" },
    height: { type: String, default: "280px" },
    imageWidth: { type: String, default: "328px" },
  imageHeight: { type: String, default: "218px" }
  },

  methods: {
    formatNumber(num) {
      if (num >= 1000) return (num / 1000).toFixed(1) + "k";
      return num;
    },

     onImageLoad(key) {
    this.imageLoadedMap[key] = false
    setTimeout(() => {
      this.imageLoadedMap[key] = true
    }, 8000)
  },
  
  }

}
</script>

<style scoped>

.hero-skeleton {
  width: 100%;
  height: 100%;
  min-height: 240px;
  max-height: 240px;
  min-width: 240px;
  max-width: 340px;
  border-radius: 8px;

  background: linear-gradient(
    110deg,
    #e5e7eb 8%,
    #f9fafb 18%,
    #e5e7eb 33%
  );
  background-size: 200% 100%;
  animation: hero-shimmer 1.6s infinite linear;
}

@keyframes hero-shimmer {
  to {
    background-position-x: -200%;
  }
}

</style>
