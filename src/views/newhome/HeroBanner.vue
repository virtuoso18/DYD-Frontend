<template>
  <a-row>
    <a-col :span="24">
      <div
        :style="{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: 'center 60%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }"
        class="h-[800px] w-full flex justify-center items-center"
      >
        <div class="text-center">

          <!-- Heading Text -->
          <div class="rounded-lg font-black pt-5 mb-6 p-12">
            <div
  class="font-[--font-family-proza] font-bold text-center text-gray-900 my-2
         text-[28px] sm:text-[36px] md:text-[44px] leading-[1.2] tracking-[-0.02em]"
>
  {{ heading1 }}
</div>


            <div class="font-[--font-family-proza] !font-extrabold text-[44px] leading-[52px] tracking-[-0.02em] text-center text-gray-900 my-2">
              {{ heading2 }}
            </div>
          </div>

          <!-- Button -->
          <div
            class="relative w-[210px] h-16 text-[28px] rounded-xl opacity-100 translate-x-24 sm:translate-x-60 text-white pt-2 bg-[#3B63FB] mt-8"
          >
            <span class="absolute left-[-10px] bottom-[-10px] text-[23px]">✦</span>
            <span class="absolute top-0 right-[-5px] text-[15px]">✦</span>
            <span class="absolute top-[15px] right-[5px] text-[30px]">✦</span>

            {{ buttonText }}
          </div>

          <br />

          <!-- Bottom Text -->
          <div class="text-base font-medium pb-12 text-gray-900 underline translate-y-[260px]">
            {{ bottomText }}
          </div>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'HeroBanner',

  props: {
    bgImage: {
      type: String,
      required: true
    },
    heading1: {
      type: String,
      default: 'Default Heading 1'
    },
    heading2: {
      type: String,
      default: 'Default Heading 2'
    },
    buttonText: {
      type: String,
      default: 'Join Us'
    },
    bottomText: {
      type: String,
      default: 'Click Try Demo'
    }
  }
}
</script>
