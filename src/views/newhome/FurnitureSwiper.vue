<template>
  <div
    :style="{
      backgroundImage: `url(${swiper_bg})`,
      backgroundPosition: 'center 90%',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }"
    class="h-[700px] w-full flex justify-end items-end"
  >
    <div class="text-center w-full pt-[100px]">
      <div class="font-black text-[26px] md:text-4xl lg:text-[44px] leading-tight">
        Swap the furniture to
      </div>
      <div class="font-black text-[26px] md:text-4xl lg:text-[44px] leading-tight">
        match your vision
      </div>

      <swiper
        class="mt-12"
        :modules="modules"
        :slides-per-view="1"
        :space-between="50"
        navigation
        :autoplay="true"
        :pagination="{ clickable: true }"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
      >
        <swiper-slide>
          <div class="w-full">
            <img src="../../assets/ch_1_home_page.png" class="max-w-[450px] w-full object-contain" alt="" />
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="w-full">
            <img src="../../assets/ch_2_home_page.png" class="max-w-[350px] w-full object-contain" alt="" />
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="w-full">
            <img src="../../assets/ch_3_home_page.png" class="max-w-[400px] w-full object-contain" alt="" />
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import swiper_bg from '@/assets/bg-swiper.jpg'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default {
  name: 'FurnitureSwiper',
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      swiper_bg,
      modules: [Navigation, Pagination, Autoplay]
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
