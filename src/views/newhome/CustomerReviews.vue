<template>
  <div class="bg-[#f2f2f2]">
    <div class="max-w-[1300px] mx-auto">
      <div class="py-10 px-2.5 text-center overflow-hidden relative">
        <h1 class="text-[28px] font-bold mb-10">See What Customers Love About Us</h1>

        <swiper
          class="mt-5 pb-12 overflow-visible cursor-pointer"
          :modules="modules"
          :slides-per-view="slidesPerView"
          :space-between="30"
          :centered-slides="true"
          :initial-slide="2"
          navigation
          :pagination="{ clickable: true }"
          @swiper="onSwiper"
          @slideChange="onSlideChange"
        >
          <swiper-slide v-for="(review, index) in reviews" :key="index">
            <div class="p-5 rounded-xl text-left w-full max-w-[280px] mx-auto">
              <div class="flex items-center mb-4">
                <img 
                  :src="review.avatar" 
                  alt="" 
                  class="w-10 h-10 rounded-full object-cover mr-2.5" 
                />
                <div>
                  <h3 class="m-0 text-base font-semibold text-gray-900">{{ review.name }}</h3>
                  <p class="m-0 text-[13px] text-gray-600">{{ review.role }}</p>
                </div>
              </div>
              <p class="text-sm leading-relaxed text-gray-700 m-0">"{{ review.text }}"</p>
            </div>
          </swiper-slide>
        </swiper>

        <!-- Fade overlays -->
        <div class="absolute top-0 left-0 w-[200px] h-full bg-gradient-to-r from-[#f3f3f3] to-transparent z-[5] pointer-events-none"></div>
        <div class="absolute top-0 right-0 w-[200px] h-full bg-gradient-to-l from-[#f3f3f3] to-transparent z-[5] pointer-events-none"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default {
  name: 'CustomerReviews',
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      slidesPerView: window.innerWidth <= 768 ? 1 : 4,
      modules: [Navigation, Pagination, Autoplay],
      reviews: [
        {
          name: "Amy Lang",
          role: "Home Stager",
          text: "Even those who are not design-savvy can easily create realistic and inviting virtually staged spaces that attract potential buyers regularly.",
          avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
        },
        {
          name: "Troy Sinclair",
          role: "Real Estate Photographer",
          text: "It has taken our real estate marketing to the next level! Our buyers love the virtual staging.",
          avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
        },
        {
          name: "John Doe",
          role: "Interior Designer",
          text: "This tool made it so easy to stage homes and present them to clients with realistic visuals.",
          avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
        },
        {
          name: "Sarah Lee",
          role: "Realtor",
          text: "My listings now stand out. Clients are impressed with how professional everything looks.",
          avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
        },
        {
          name: "David Kim",
          role: "Architect",
          text: "An incredible platform for showcasing designs and spaces realistically.",
          avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
        }
      ]
    }
  },
  methods: {
    onSwiper(swiper) {
      console.log(swiper)
    },
    onSlideChange() {
      console.log('slide change')
    }
  }
}
</script>
