<template>
  <div class="min-h-screen !bg-gray-50">
    <!-- Mobile & Desktop Layout -->
    <div class="max-w-[1400px] !mx-auto !p-4 md:!p-6">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] !gap-6">
        
        <!-- LEFT SECTION - Image Preview -->
        <div class="space-y-4">
          <!-- Back Button & Before/After Toggle -->
          <div class="flex items-center justify-between !mb-4">
            <button 
              @click="$router.go(-1)"
              class="flex items-center !gap-2 !text-gray-700 hover:!text-gray-900 !font-medium"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Back
            </button>

            <!-- Before/After Toggle -->
           
          </div>

          <!-- Main Image -->
          <div class="!bg-white !rounded-2xl overflow-hidden !shadow-sm">
            <img 
              :src="activeView === 'before' ? beforeImage : afterImage" 
              alt="Room Design"
              class="w-full h-auto max-h-[500px] md:max-h-[600px] object-cover"
            />
          </div>

          <!-- Thumbnail Carousel + Regenerate -->
          <div class="sm:flex sm:items-center sm:justify-between !gap-4">
            <!-- Thumbnails -->
            <div class="flex !gap-3 overflow-x-auto !mt-3 flex-1">
              <div 
                v-for="(thumb, index) in thumbnails" 
                :key="index"
                @click="selectThumbnail(index)"
                :class="[
                  'min-w-[80px] w-[80px] h-[80px] md:min-w-[100px] md:w-[100px] md:h-[100px] !rounded-lg overflow-hidden cursor-pointer !border-2 transition-all',
                  selectedThumb === index ? '!border-blue-600' : '!border-gray-200'
                ]"
              >
                <img :src="thumb" alt="Thumbnail" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- Regenerate Button -->
            <button 
              @click="regenerateImages"
              class="flex items-center justify-center w-full sm:justify-start sm:w-auto !text-center !mt-6 sm:!mt-0 !gap-2 !bg-blue-600 hover:!bg-blue-700 !text-white !px-5 !py-3 !rounded-lg !font-medium !text-sm whitespace-nowrap transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M13.5 3.5C12.2 2.2 10.2 1.5 8 1.5C4.1 1.5 1 4.6 1 8.5C1 12.4 4.1 15.5 8 15.5C11.4 15.5 14.2 13.1 14.9 9.9"
                  stroke="currentColor"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
                <path
                  d="M11 1.5L13.5 3.5L11.5 6"
                  stroke="currentColor"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Regenerate
            </button>
          </div>
        </div>

        <!-- RIGHT SECTION - Details & Actions -->
        <div class="space-y-4">
          <!-- Congratulations Card -->
          <div class="!bg-white !p-6 ">
            <h2 class="!text-xl md:!text-2xl text-center !font-semibold !text-gray-900 !mb-1">
              Congratulation!
            </h2>
            <p class="!text-gray-600 text-center !text-sm md:!text-base">
              Your photo already set.
            </p>
          </div>

          <!-- Share Project Card -->
          <div class="!bg-[#F2F2F2] rounded-xl  !p-6 ">
            <div class="flex !gap-4">
              <img 
                :src="afterImage" 
                alt="Project Preview" 
                class="w-20 h-20 !rounded-lg object-cover flex-shrink-0"
              />
              <div>
                <h3 class="!font-semibold !text-gray-900 !mb-1">
                  Share your project
                </h3>
                <p class="!text-sm !text-gray-600">
                  Tell your community about the project you created
                </p>
              </div>
            </div>
          </div>
<div className="!bg-[#F2F2F2] !mt-4 rounded-xl">

    <!-- Detail Staging Card -->
    <div class=" !p-6 ">
      <h3 class="!font-bold !text-gray-900 !mb-4">Detail Staging</h3>
      
      <div class="space-y-3">
        <div>
          <p class="!text-sm !text-gray-500 !mb-1">Room type</p>
          <p class="!font-medium !text-gray-900">{{ roomType }}</p>
        </div>
        
        <div>
          <p class="!text-sm !text-gray-500 !mb-1">Style</p>
          <p class="!font-medium !text-gray-900">{{ style }}</p>
        </div>
      </div>
    </div>

    <!-- Product Card -->
    <div class=" !p-6 ">
      <h3 class="!font-bold !text-gray-900 !mb-4">Product</h3>
      
      <div class="flex !gap-4 !mb-4">
        <img 
          :src="product.image" 
          alt="Product" 
          class="w-16 h-16 object-cover !rounded-lg flex-shrink-0"
        />
        <div class="flex-1">
          <h4 class="!font-semibold !text-gray-900 !mb-1">
            {{ product.name }}
          </h4>
          <a 
            href="#" 
            class="!text-sm !text-blue-600 hover:!text-blue-700 !font-medium"
          >
            Product Detail
          </a>
        </div>
      </div>

      


      <button 
        
        class="w-full flex items-center justify-center !gap-2 !bg-white !border !border-blue-600 !text-blue-600 hover:!bg-blue-50 !px-4 !py-3 !rounded-lg !font-medium transition-all"
      >
        <!-- <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 11V6L4 11H9ZM9 11V16L14 11H9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 16L4 21M9 16L14 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg> -->
        See all catalog products
      </button>

    <a
  @click="addToCart"
  class="
    flex items-center justify-center gap-2
    !text-sm !mt-4
    !text-blue-600 hover:!text-blue-700
    !font-medium
    !mb-4
    cursor-pointer
  "
>
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.75 0.75H3.38636L5.15273 9.57523C5.213 9.87867 5.37808 10.1512 5.61906 10.3452C5.86005 10.5392 6.1616 10.6423 6.47091 10.6364H12.8773C13.1866 10.6423 13.4881 10.5392 13.7291 10.3452C13.9701 10.1512 14.1352 9.87867 14.1955 9.57523L15.25 4.04545H4.04545M6.68182 13.9318C6.68182 14.2958 6.38673 14.5909 6.02273 14.5909C5.65872 14.5909 5.36364 14.2958 5.36364 13.9318C5.36364 13.5678 5.65872 13.2727 6.02273 13.2727C6.38673 13.2727 6.68182 13.5678 6.68182 13.9318ZM13.9318 13.9318C13.9318 14.2958 13.6367 14.5909 13.2727 14.5909C12.9087 14.5909 12.6136 14.2958 12.6136 13.9318C12.6136 13.5678 12.9087 13.2727 13.2727 13.2727C13.6367 13.2727 13.9318 13.5678 13.9318 13.9318Z"
      stroke="#3B63FB"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <span>Add to cart</span>
</a>

    </div>
</div>

          <!-- Save to My Design Button -->
          <button 
            @click="saveToMyDesign"
            class="w-full !mt-3 !bg-blue-600 hover:!bg-blue-700 !text-white !px-6 !py-4 !rounded-lg  !text-base transition-all !shadow-sm"
          >
            Save to My Design
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeDesignApplyChanges',
  data() {
    return {
      activeView: 'after',
      selectedThumb: 0,
      beforeImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop',
      thumbnails: [
        'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=100&h=100&fit=crop',
      ],
      roomType: 'Dinning Room',
      style: 'Modern',
      product: {
        name: 'Decaly Coral',
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=80&h=80&fit=crop',
      }
    };
  },
  methods: {
    selectThumbnail(index) {
      this.selectedThumb = index;
      this.afterImage = this.thumbnails[index].replace('w=100&h=100', 'w=800&h=600');
    },
    
    regenerateImages() {
      this.$message.info('Regenerating images...');
    },
    
    addToCart() {
      this.$message.success('Product added to cart!');
    },
    
    saveToMyDesign() {
      this.$message.success('Design saved successfully!');
    }
  }
};
</script>

<style scoped>
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}

.overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
