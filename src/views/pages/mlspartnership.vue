<template>
  <div>
    <!-- Banner Section -->
    <div class="relative">
      <img
        src="../../assets/mlspartner.jpg"
        alt="Contact Banner"
        class="w-full h-[590px] object-cover block"
      />
      <div class="absolute inset-0 flex items-center justify-center">
        <h1
          class="text-center pb-12 text-black"
          style="
            font-family: 'Proza Libre';
            font-weight: 700;
            font-style: bold;
            font-size: 44px;
            line-height: 52px;
            letter-spacing: -0.02em;
          "
        >
          MLS Partnership
        </h1>
      </div>
    </div>

    <!-- Contact Info + Form -->
    <div class="relative bg-white py-8 sm:py-16 px-5 gap-10">
      <!-- Left Side: Contact Details -->
      <div class="space-y-6 mx-auto px-auto">
        <h3
          class="text-center mb-4 text-gray-800 mls-partner-headline"
          style="
            font-family: 'Proza Libre';
            font-weight: 700;
            font-style: bold;
            font-size: 48px;
            line-height: 52px;
            letter-spacing: -0.02em;
          "
        >
          Unlock Instant AI Virtual Staging for Your MLS Members
        </h3>

        <!-- Email -->
        <!-- Paragraph 1 -->
        <div
          class="mx-auto px-0 sm:px-28 text-gray-600 text-left font-[Poppins] font-normal text-[20px] leading-[28px] tracking-[-0.02em]"
        >
          Porem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
          fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
          elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
          lectus. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
          egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.
          Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
          lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in
          elementum tellus.
          <br /><br />
          Porem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. dignissimrna. Curabitur
          vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia.
          Aliquam in elementum tellus.
        </div>

        <!-- Heading -->
        <div
          class="mx-auto px-0 sm:px-28 py-6 text-gray-900 text-left font-[Poppins] font-semibold text-[22px] leading-[28px] tracking-[-0.02em] mt-6"
        >
          Porem ipsum dolor sit amet, consectetur
        </div>

        <!-- Paragraph 2 -->
        <div
          class="mx-auto px-0 sm:px-28 text-gray-600 text-left font-[Poppins] font-normal text-[20px] leading-[28px] tracking-[-0.02em] mt-4"
        >
          Porem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
          fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
          elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
          lectus. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
          egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.
          Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
          lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in
          elementum tellus.
          <br /><br />
          Porem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. dignissimrna. Curabitur
          vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia.
          Aliquam in elementum tellus.
        </div>
      </div>
      <!-- <img
        src="../../assets/mlsbanner.jpg"
        alt="Contact Banner"
        class="w-full h-[446px] px-28 translate-y-7 object-cover rounded-lg"
      /> -->
      <div class="sm:px-28">
        <div
          class="relative my-8 h-[446px] rounded-lg overflow-hidden bg-[#f6f6f4]"
        >
          <img
            src="../../assets/mlsPartnerBanner.jpg"
            alt="Partner banner"
            class="absolute inset-0 w-full h-full object-cover object-right"
          />
          <div class="relative z-10 h-full flex items-center">
            <div class="px-6 sm:px-12 max-w-[720px]">
              <h3 class="text-[12px] tracking-[0.2em] text-gray-900 mb-4">
                GET STARTED TODAY
              </h3>

              <p
                class="text-[22px] sm:text-[36px] !font-bold leading-tight text-black mb-8"
              >
                Let’s connect and explore how we can bring value your
                organization.
              </p>

              <a-button type="primary" class="!h-[44px] !px-6">
                Partner with us today
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "mlspartnership",
};
</script>

<style scoped>
@media screen and (max-width: 768px) {
  .mls-partner-headline {
    font-size: 30px !important;
    line-height: 36px !important;
    /* padding-left: 20px !important;
      padding-right: 20px !important; */
  }
}
</style>
