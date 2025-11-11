<template>
  <a-row class="max-w-[1200px] mx-auto px-2.5">
    <!-- Virtual Staging -->
    <a-col :sm="24" :xs="24" :md="9" :lg="9" class="flex justify-center items-start flex-col">
      <h1>Virtual Staging</h1>
      <p class="m-0">With the help of virtual staging, you can create realistic,</p>
      <p class="m-0">digital previews of spaces, providing a cost-effective solution</p>
      <p class="m-0">for real estate and design.</p>
      <br />
      <a-button type="primary" class="flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.28387 8.51768L7.85167 7.08548C7.65647 6.89028 7.55887 6.79268 7.45353 6.74048C7.2532 6.64119 7.018 6.64119 6.8176 6.74048C6.71233 6.79268 6.61471 6.89028 6.41949 7.08548C6.22425 7.28075 6.12664 7.37835 6.07446 7.48361C5.97518 7.68401 5.97518 7.91921 6.07446 8.11955C6.12664 8.22488 6.22425 8.32248 6.41949 8.51768L7.85167 9.94988M9.28387 8.51768L13.5805 12.8143C13.7757 13.0095 13.8733 13.1071 13.9255 13.2125C14.0248 13.4128 14.0248 13.648 13.9255 13.8484C13.8733 13.9537 13.7757 14.0513 13.5805 14.2465C13.3853 14.4417 13.2877 14.5393 13.1824 14.5915C12.982 14.6908 12.7468 14.6908 12.5465 14.5915C12.4411 14.5393 12.3435 14.4417 12.1483 14.2465L7.85167 9.94988M9.28387 8.51768L7.85167 9.94988" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Try Virtual Staging
      </a-button>
    </a-col>
    <a-col :sm="24" :xs="24" :md="15" :lg="15">
      <div class="w-full h-[300px] rounded-lg bg-[#f2f2f2]">
        img_here
      </div>
    </a-col>

    <!-- 3D Rendering -->
    <a-col :sm="24" :xs="24" :md="15" :lg="15" class="mt-5">
      <div class="w-full h-[300px] rounded-lg bg-[#f2f2f2]">
        img_here
      </div>
    </a-col>
    <a-col :sm="24" :xs="24" :md="9" :lg="9" class="flex justify-center items-start flex-col mt-5 pl-5">
      <h1>3D Rendering</h1>
      <p class="m-0">We are helping you create stunning 3D renderings of</p>
      <p class="m-0">furniture by transforming 3D models into realistic,</p>
      <p class="m-0">detailed images using advanced software.</p>
      <br />
      <a-button type="primary" class="flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.28387 8.51768L7.85167 7.08548C7.65647 6.89028 7.55887 6.79268 7.45353 6.74048C7.2532 6.64119 7.018 6.64119 6.8176 6.74048C6.71233 6.79268 6.61471 6.89028 6.41949 7.08548C6.22425 7.28075 6.12664 7.37835 6.07446 7.48361C5.97518 7.68401 5.97518 7.91921 6.07446 8.11955C6.12664 8.22488 6.22425 8.32248 6.41949 8.51768L7.85167 9.94988M9.28387 8.51768L13.5805 12.8143C13.7757 13.0095 13.8733 13.1071 13.9255 13.2125C14.0248 13.4128 14.0248 13.648 13.9255 13.8484C13.8733 13.9537 13.7757 14.0513 13.5805 14.2465C13.3853 14.4417 13.2877 14.5393 13.1824 14.5915C12.982 14.6908 12.7468 14.6908 12.5465 14.5915C12.4411 14.5393 12.3435 14.4417 12.1483 14.2465L7.85167 9.94988M9.28387 8.51768L7.85167 9.94988" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Try 3D Rendering
      </a-button>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'ServicesShowcase'
}
</script>
