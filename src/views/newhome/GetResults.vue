<template>
  <div>
    <div class="text-center">
      <h1 class="text-[42px] font-bold mb-5 mx-auto">
        Get listing-ready results in seconds
      </h1>
      <p class="text-base text-gray-500">
        Turn your property photos into stunning visuals in three simple
      </p>
      <p class="text-base text-gray-500">
        steps to attract buyers and enhance your listings.
      </p>
    </div>

    <div class="bg-white max-w-[1200px] mx-0 py-10 px-3 relative">
      <!-- Steps Wrapper -->
      <div class="relative flex flex-wrap items-start">
        
        <!-- Step 1 Text -->
        <div class="w-1/2 p-5 flex flex-col justify-center items-center relative z-10">
          <div class="relative">
            <h2 class="text-[32px] font-semibold mb-2 mt-20 text-black">Upload</h2>
            <p class="text-gray-500 leading-tight">We support both furnished</p>
            <p class="text-gray-500 leading-tight">and unfurnished photos.</p>
          </div>
        </div>

        <!-- Step 1 Image -->
        <div class="w-1/2 p-5 flex justify-center items-center">
          <div class="w-[415px] h-[275px] rounded-xl bg-black rounded-[26px] flex items-center justify-center relative">
            <span class="text-[125px] font-light text-gray-300 absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
              <img src="/01 (1).svg" alt="01" />
            </span>
            <img src="/upload-04.svg" alt="Upload" />
            <span class="text-gray-400 text-sm">Drag and drop</span>
            <div 
              class="absolute top-16 left-80 w-[274px] h-[213px] rounded-2xl translate-y-6 overflow-visible"
              style="background-image: url('/thirdcardbg.svg')"
            ></div>
          </div>
        </div>

        <!-- SVG Line 1 -->
        <div class="absolute left-1/2 translate-x-[8%] top-20 w-[260px] h-80 flex justify-center z-0">
          <img src="/firstline.svg" alt="line" class="w-full h-full object-contain" />
        </div>

        <!-- Step 2 Image -->
        <div class="w-1/2 p-5 flex justify-center items-center translate-x-80 mt-[120px]">
          <div 
            class="w-[415px] h-[275px] rounded-xl flex items-center justify-center relative"
            style="background-image: url('/thirdcardbg.svg')"
          >
            <span class="text-[125px] text-gray-600 absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
              <img src="/02.svg" alt="02" />
            </span>
            <div class="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 bg-[#4F6EF7] text-white py-2.5 px-4 rounded-md flex gap-2 items-center text-sm font-semibold z-10">
              <span><img src="/addingfurniture.svg" alt="Adding" /></span> Adding furniture..
            </div>
          </div>
        </div>

        <!-- Step 2 Text -->
        <div class="w-1/2 p-5 flex flex-col justify-center items-center translate-x-10 mt-20">
          <div class="relative">
            <div class="translate-x-40">
              <h2 class="text-[32px] font-medium mb-2 mt-20 text-black">AI Finished</h2>
              <p class="text-gray-500 leading-tight">Our AI redesigns your space</p>
              <p class="text-gray-500 leading-tight">in 15 seconds.</p>
            </div>
          </div>
        </div>

        <!-- SVG Line 2 -->
        <div class="absolute left-1/2 top-[760px] translate-x-[10%] -translate-y-3/4 w-[260px] h-80 flex justify-center z-0">
          <img src="/secondline.svg" alt="line" class="w-full h-full object-contain" />
        </div>

        <!-- Step 3 Text -->
        <div class="w-1/2 p-5 flex flex-col justify-center items-center mt-[120px]">
          <div class="relative">
            <h2 class="text-[32px] font-medium mb-2 mt-20 text-black">Download & Share</h2>
            <p class="text-gray-500 leading-tight">Download the staged photo</p>
            <p class="text-gray-500 leading-tight">and share it anywhere.</p>
          </div>
        </div>

        <!-- Step 3 Image -->
        <div class="w-1/2 p-5 flex justify-center items-center mt-36">
          <div 
            class="w-[415px] h-[274px] rounded-xl flex items-center justify-center relative"
            style="background-image: url('/thirdcardbg.svg')"
          >
            <span class="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 text-[110px] font-medium text-gray-600 leading-none">
              <img src="/03.svg" alt="03" />
            </span>
            <div class="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 flex gap-2.5">
              <button class="bg-transparent border-none cursor-pointer p-0 flex items-center justify-center">
                <img src="/download.svg" alt="Download" />
              </button>
              <button class="bg-transparent border-none cursor-pointer p-0 flex items-center justify-center">
                <img src="/share.svg" alt="Share" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GetResults'
}
</script>
