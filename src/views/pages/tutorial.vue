<template>
  <div>
    <!-- Banner Section -->
    <div class="relative h-[80vh] w-full">
      <img
        src="../../assets/turorialHome.jpg"
        alt="Contact Banner"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <h1
        class="absolute inset-0 flex items-center justify-center text-center text-black font-bold md:font-bold text-3xl sm:text-4xl md:text-[70px] leading-tight"
        style="font-family: 'Proza Libre'; letter-spacing: -0.02em"
      >
        Tutorial Center
      </h1>
    </div>

    <!-- Stats Cards Section -->
    <!-- Tutorial Cards Section -->
    <!-- Tutorial Cards Section -->
    <div
      class="w-full py-10 flex flex-wrap justify-center gap-10 overflow-x-auto md:overflow-visible px-[20px] sm:px-16"
    >
      <!-- Card 1 -->
      <div class="flex flex-col items-center sm:items-start flex-shrink-0 w-full sm:w-[354px]">
        <img
          src="../../assets/tutorial1.png"
          alt="Tutorial 1"
          class="w-full sm:w-[354px] sm:h-[230px] object-cover rounded-xl"
        />
        <h2 class="mt-4 text-xl font-semibold text-black text-center">
          Learn with Experts
        </h2>
        <p
          class="text-gray-600 text-[16px] leading-[24px] font-normal text-start mt-1"
        >
          Korem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulput
          ate libero et velit interdum, ac aliquet odio mattis. Class aptent
          taciti sociosqu ad litora torquent per conubia nostra, per inceptos .
        </p>
      </div>

      <!-- Card 2 -->
      <div class="flex flex-col items-start flex-shrink-0  w-full sm:w-[354px]">
        <img
          src="../../assets/tutorial2.png"
          alt="Tutorial 2"
          class="w-full sm:w-[354px] h-[230px] object-cover rounded-xl"
        />
        <h2 class="mt-4 text-xl font-semibold text-black text-center">
          Global Network
        </h2>
        <p
          class="text-gray-600 text-[16px] leading-[24px] font-normal text-start mt-1"
        >
          Korem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulput
          ate libero et velit interdum, ac aliquet odio mattis. Class aptent
          taciti sociosqu ad litora torquent per conubia nostra, per inceptos .
        </p>
      </div>

      <!-- Card 3 -->
      <div class="flex flex-col items-start flex-shrink-0 w-full sm:w-[354px]">
        <img
          src="../../assets/tutorial3.png"
          alt="Tutorial 3"
          class="w-full sm:w-[354px] h-[230px] object-cover rounded-xl"
        />
        <h2 class="mt-4 text-xl font-semibold text-black text-center">
          Innovative Tools
        </h2>
        <p
          class="text-gray-600 text-[16px] leading-[24px] font-normal text-start mt-1"
        >
          Korem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulput
          ate libero et velit interdum, ac aliquet odio mattis. Class aptent
          taciti sociosqu ad litora torquent per conubia nostra, per inceptos .
        </p>
      </div>

      <!-- Card 4 -->
      <div class="flex flex-col items-start flex-shrink-0  w-full sm:w-[354px]">
        <img
          src="../../assets/tutorial4.png"
          alt="Tutorial 4"
          class="w-full sm:w-[354px] h-[230px] object-cover rounded-xl"
        />
        <h2 class="mt-4 text-xl font-semibold text-black text-center">
          Trusted Partners
        </h2>
        <p
          class="text-gray-600 text-[16px] leading-[24px] font-normal text-start mt-1"
        >
          Korem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulput
          ate libero et velit interdum, ac aliquet odio mattis. Class aptent
          taciti sociosqu ad litora torquent per conubia nostra, per inceptos .
        </p>
      </div>

      <!-- Card 5 -->
      <div class="flex flex-col items-start flex-shrink-0 w-full sm:w-[354px]">
        <img
          src="../../assets/tutorial5.png"
          alt="Tutorial 5"
          class="w-full sm:w-[354px] h-[230px] object-cover rounded-xl"
        />
        <h2 class="mt-4 text-xl font-semibold text-black text-center">
          24/7 Support
        </h2>
        <p
          class="text-gray-600 text-[16px] leading-[24px] font-normal text-center mt-1"
        >
          We’re here whenever you need us
        </p>
      </div>
    </div>

    <h3
      class="text-center mb-4 text-black"
      style="
        font-family: 'Proza Libre';
        font-weight: 700;
        font-style: bold;
        font-size: 48px;
        line-height: 52px;
        letter-spacing: -0.02em;
      "
    ></h3>
  </div>
</template>

<script>
export default {
  name: "tutorial",
};
</script>
