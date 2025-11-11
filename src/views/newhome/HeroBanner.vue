<template>
  <a-row>
    <a-col :span="24">
      <div
        :style="{
          backgroundImage: `url(${bannerImage})`,
          backgroundPosition: 'center 60%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }"
        class="h-[800px] w-full flex justify-center items-center"
      >
        <div class="text-center">
          <div class="rounded-lg font-black pt-5 mb-6 p-12">
<div class="font-[--font-family-proza] font-bold text-[44px] leading-[52px] tracking-[-0.02em] text-center text-gray-900 my-2">
  {{ t('line1') }}
</div>
<div class="font-[--font-family-proza] font-extrabold text-[44px] leading-[52px] tracking-[-0.02em] text-center text-gray-900 my-2">
  {{ t('line2') }}
</div>
          </div>

   <div
  class="relative w-[210px] h-16 text-[28px] rounded-xl opacity-100 translate-x-40 text-white pt-2 bg-[#3B63FB] mt-8"
>
  <span class="absolute left-[-10px] bottom-[-10px] text-[23px]">✦</span>
  <span class="absolute top-0 right-[-5px] text-[15px]">✦</span>
  <span class="absolute top-[15px] right-[5px] text-[30px]">✦</span>
  Join Us
</div>

          <br />

          <div class="text-base font-medium pb-12 text-gray-900 underline translate-y-[260px]">
            Click Try Demo
          </div>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import bannerImage from '@/assets/home_main_banner.jpg'
import { useI18n } from 'vue-i18n'

export default {
  name: 'HeroBanner',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      bannerImage
    }
  }
}
</script>
