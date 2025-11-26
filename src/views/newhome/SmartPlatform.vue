<template>
  <div className="flex items-center justify-center ">

    <a-row class="px-2.5 bg-[#f2f2f2]">
      <a-col :span="24" class="max-w-[1200px] md:pl-64 mx-auto p-5">
        <div>
          <br /><br /><br />
          <div
  style="
    font-family: 'Proza Libre', sans-serif !important;
    font-weight: 900;
    font-style: normal;
    font-size: 44px;
    line-height: 52px;
    letter-spacing: -0.02em;
    color: #000000;
    margin: 0;
    padding: 0;
  "
>
  The Smart Platform for Virtual Staging
</div>
          <div
  style="
    font-family: 'Proza Libre', sans-serif !important;
    font-weight: 900;
    font-style: normal;
    font-size: 44px;
    line-height: 52px;
    letter-spacing: -0.02em;
    color: #000000;
    margin: 0;
    padding: 0;
  "
>
  and Realistic Home Design
</div>
          <div
  style="
    font-family: 'Proza Libre', sans-serif !important;
    font-weight: 900;
    font-style: normal;
    font-size: 44px;
    line-height: 52px;
    letter-spacing: -0.02em;
    color: #000000;
    margin: 0;
    padding: 0;
  "
>
  Visualizations
</div>
          <div
  style="
    font-family: 'Poppins', sans-serif !important;
    font-weight: 400;
    font-style: normal;
    font-size: 20px;
    line-height: 28px;
    letter-spacing: -0.02em;
    color: #6b7280;
  "
>
  DYD is an advanced AI platform for business owners, store owners,
  <br />interior designers, and architects, offering interactive,
  <br />personalized virtual staging visualizations to showcase products effectively.
</div>

        </div>
      </a-col>
  
      <a-col :span="24" class="max-w-[1200px] mx-auto">
        <a-row>
          <!-- Upload Section -->
          <a-col :sm="24" :xs="24" :md="12" :lg="12" class ="md:pl-64">
            <br />
            <div class="rounded-[20px] bg-white border-[3px] border-dashed border-gray-500 h-[350px] w-full flex flex-col justify-center items-center text-lg">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5333 4.70117V15.147M12.5333 4.70117C11.8019 4.70117 10.4353 6.78438 9.92188 7.31262M12.5333 4.70117C13.2647 4.70117 14.6314 6.78438 15.1448 7.31262" stroke="black" stroke-width="1.88285" stroke-linecap="square" stroke-linejoin="round"/>
                <path d="M20.8929 17.2363C20.8929 19.829 20.3519 20.3701 17.7592 20.3701H7.31342C4.72078 20.3701 4.17969 19.829 4.17969 17.2363" stroke="black" stroke-width="1.88285" stroke-linecap="square" stroke-linejoin="round"/>
              </svg>
              <br />
              Drag & drop Image
              <br /><br />
              <a-button type="primary">Upload Image</a-button>
            </div>
          </a-col>
  
          <!-- Example Images Section -->
          <a-col :sm="24" :xs="24" :md="12" :lg="12">
            <div class="rounded-[20px] h-[400px] max-w-[450px] w-[90%] mx-auto flex flex-col justify-center items-center text-lg p-5">
              <p>or use an example image</p>
              <a-space class="overflow-x-auto max-w-[340px] scrollbar-hide">
                <a-button>Living Room</a-button>
                <a-button>Kitchen</a-button>
                <a-button>Bedroom</a-button>
                <a-button>Dining Room</a-button>
                <a-button>Outdoor</a-button>
              </a-space>
              <br />
              <div class="flex gap-2.5 overflow-hidden w-full">
                <img src="../../assets/home_main_banner.jpg" class="rounded-lg w-[150px] h-[100px]" alt="" />
                <img src="../../assets/home_main_banner.jpg" class="rounded-lg w-[150px] h-[100px]" alt="" />
                <img src="../../assets/home_main_banner.jpg" class="rounded-lg w-[150px] h-[100px]" alt="" />
                <img src="../../assets/home_main_banner.jpg" class="rounded-lg w-[150px] h-[100px]" alt="" />
              </div>
              <br />
              <a-button type="primary" block>Try For Free</a-button>
              <h6>No Credit Required</h6>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'SmartPlatform'
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
