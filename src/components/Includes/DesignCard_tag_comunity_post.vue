<template>
  <div
    class="rounded-xl bg-white shadow-lg hover:shadow-md transition cursor-pointer
           w-full h-full flex flex-col"
  >
    <!-- Image + tags -->
   <div class="relative rounded-xl overflow-hidden w-full aspect-[4/3] sm:aspect-[4/3]">
  <!-- IMAGE SKELETON OVERLAY -->
  <div
    v-if="image && !imageLoadedMap"
    class="image-skeleton absolute inset-0 w-full h-full z-10"
  ></div>

  <!-- YOUR ORIGINAL IMG -->
  <img 
    :src="image" 
    :class="{ 'image-loaded': imageLoadedMap }"
    @load="onImageLoad"
    class="w-full h-full object-cover" 
  />

  <!-- Tags (show skeleton placeholders) -->
  <div class="absolute top-3 left-3 flex gap-1 sm:gap-2">
    <div
      v-if="!imageLoadedMap"
      v-for="n in 2"
      :key="n"
      class="tag-skeleton bg-gray-400/50 w-12 h-5 sm:w-16 sm:h-6 rounded-md"
    ></div>
    <span
      v-else
      v-for="(tag, index) in tags"
      :key="index"
      class="bg-black/60 text-white px-1 sm:px-2 py-1 text-[7px] sm:text-xs rounded-md"
    >
      {{ tag }}
    </span>
  </div>

  <!-- View Count (show skeleton placeholder) -->
  <div
    v-if="!imageLoadedMap || (views !== null && views !== undefined)"
    class="absolute top-3 right-3 flex items-center text-white px-1 sm:px-2 py-1 sm:text-sm text-[10px] rounded-md"
  >
    <!-- Skeleton eye icon area -->
    <div v-if="!imageLoadedMap" class="w-6 h-5 bg-gray-400/50 rounded mr-1"></div>
    <svg v-else width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- your SVG unchanged -->
    </svg>
    <span v-if="imageLoadedMap">{{ views }}</span>
    <span v-else class="w-6 h-4 bg-gray-400/50 rounded ml-1"></span>
  </div>
</div>


    <!-- Bottom Person + Likes + Comments -->
    <div class="px-3 py-2 flex items-center justify-between">
      <!-- Avatar + Name -->
      <div class="flex items-center gap-2">
        <img
          style="border:1px solid rgba(0,0,0,0.1)"
          :src="avatar"
          class="w-8 h-8 rounded-full border"
        />
        <span
          class="!font-poppins font-normal text-[7px] sm:text-[14px] leading-[20px] tracking-normal text-center text-gray-600"
        >
          {{ name }}
        </span>
      </div>

      <!-- Likes & Comments -->
      <div class="flex items-center gap-1 sm:gap-4 text-gray-700 text-[8px] sm:text-sm">
        <!-- Comments -->
        <div v-if="comments !== null && comments !== undefined" class="flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.33203 3.99967C1.33203 3.29243 1.61298 2.61415 2.11308 2.11406C2.61318 1.61396 3.29145 1.33301 3.9987 1.33301H11.9987C12.7059 1.33301 13.3842 1.61396 13.8843 2.11406C14.3844 2.61415 14.6654 3.29243 14.6654 3.99967V9.33301C14.6654 10.0403 14.3844 10.7185 13.8843 11.2186C13.3842 11.7187 12.7059 11.9997 11.9987 11.9997H8.8667L5.0347 14.5543C4.9343 14.6211 4.81767 14.6595 4.69722 14.6652C4.57677 14.671 4.45701 14.644 4.3507 14.5871C4.24439 14.5301 4.1555 14.4455 4.09352 14.342C4.03153 14.2386 3.99876 14.1203 3.9987 13.9997V11.9997C3.29145 11.9997 2.61318 11.7187 2.11308 11.2186C1.61298 10.7185 1.33203 10.0403 1.33203 9.33301V3.99967ZM3.9987 2.66634C3.64508 2.66634 3.30594 2.80682 3.05589 3.05687C2.80584 3.30691 2.66536 3.64605 2.66536 3.99967V9.33301C2.66536 9.68663 2.80584 10.0258 3.05589 10.2758C3.30594 10.5259 3.64508 10.6663 3.9987 10.6663H4.66536C4.84218 10.6663 5.01174 10.7366 5.13677 10.8616C5.26179 10.9866 5.33203 11.1562 5.33203 11.333V12.7543L8.29603 10.7783C8.40541 10.7054 8.5339 10.6664 8.66536 10.6663H11.9987C12.3523 10.6663 12.6915 10.5259 12.9415 10.2758C13.1916 10.0258 13.332 9.68663 13.332 9.33301V3.99967C13.332 3.64605 13.1916 3.30691 12.9415 3.05687C12.6915 2.80682 12.3523 2.66634 11.9987 2.66634H3.9987Z"
              fill="black"
            />
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

  data() {
    return {
      imageLoadedMap: false // ⬅️ ADD THIS
    }
  },

  methods: {
    formatNumber(num) {
      if (num >= 1000) return (num / 1000).toFixed(1) + "k";
      return num;
    },

   onImageLoad() {
  setTimeout(() => {
    this.imageLoadedMap = true;
  }, 1000);
},
  
  }

}
</script>

<style scoped>

.image-skeleton {
  background: linear-gradient(
    110deg,
    #f0f0f0 8%,
    #e0e0e0 18%,
    #f0f0f0 33%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.6s infinite linear;
}

@keyframes skeleton-shimmer {
  to {
    background-position-x: -200%;
  }
}

.image-loaded {
  z-index: 5;
}

.tag-skeleton,
.view-skeleton {
  animation: pulse 1.5s infinite;
}

</style>