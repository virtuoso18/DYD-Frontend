<template>
  <a-row class="px-2.5">
    <a-col :span="24" class="text-2xl font-bold mx-auto w-full text-center">
      <div class="font-black text-[26px] md:text-4xl lg:text-[44px] leading-tight">
        Unlock the potential of
      </div>
      <div class="font-black text-[26px] md:text-4xl lg:text-[44px] leading-tight">
        <span class="bg-[#3B63FB] text-white rounded-lg px-2.5 font-bold relative">
          DYD
          <span class="text-[#3B63FB] absolute bottom-[15px] left-[-20px] text-xl">✦</span>
          <span class="text-black absolute bottom-[-20px] left-[-15px] text-[35px]">✦</span>
        </span>
        for your needs.
      </div>
      <br />

      <div class="relative">
        <img 
          src="../../assets/home_main_banner.jpg" 
          class="max-w-[900px] w-full rounded-[20px] max-h-[600px]" 
          alt="" 
        />
        <a-button 
          type="primary" 
          class="absolute bottom-[30px] left-1/2 -translate-x-1/2 w-[309px] bg-[#3B63FB] border-[#3B63FB] flex items-center justify-center gap-2"
        >
          Process photo 
          <img src="/ai-generative.svg" alt="Share" />
        </a-button>
      </div>
      <br />
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'UnlockPotential'
}
</script>
