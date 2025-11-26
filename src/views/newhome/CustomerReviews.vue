<template>
  <div class="py-20 bg-[#F2F2F2] relative">
    <div class="max-w-full px-4 relative">

      <!-- Heading -->
      <h1
        class="text-center mb-10"
        style="
          font-family: 'Proza Libre';
          font-weight: 700;
          font-size: 48px;
          line-height: 52px;
          letter-spacing: -0.02em;
        "
      >
        See What Customers Love About Us
      </h1>

      <!-- Container with gradient mask wrapper -->
      <div class="relative">
        
        <!-- Scroll wrapper with gradient masks -->
        <div
          ref="scrollContainer"
          class="overflow-x-auto scrollbar-hide scroll-smooth relative fade-edges"
        >
          <div class="flex gap-6 snap-x snap-mandatory pb-6 px-1">

            <!-- Card -->
            <div
              v-for="(review, index) in reviews"
              :key="index"
              class="min-w-[250px] max-w-[260px]  rounded-xl p-5 snap-center  hover:shadow-md transition-shadow"
            >
              <div class="flex items-center mb-4">
                <img
                  :src="review.avatar"
                  class="w-10 h-10 rounded-full mr-3 object-cover"
                  alt=""
                />
                <div>
                  <h3 class="font-semibold text-gray-900 text-base">
                    {{ review.name }}
                  </h3>
                  <p class="text-xs text-gray-600">{{ review.role }}</p>
                </div>
              </div>

              <p class="text-sm text-gray-700 leading-relaxed">
                "{{ review.text }}"
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "CustomerReviews",
  data() {
    return {
      reviews: [
        {
          name: "Amy Lang",
          role: "Home Stager",
          text: "Even those who are not design-savvy can easily create realistic spaces.",
          avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
        },
        {
          name: "Troy Sinclair",
          role: "Real Estate Photographer",
          text: "It has taken our real estate marketing to the next level!",
          avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
        },
        {
          name: "John Doe",
          role: "Interior Designer",
          text: "This tool made staging homes so easy and realistic.",
          avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
        },
        {
          name: "John Doe",
          role: "Interior Designer",
          text: "This tool made staging homes so easy and realistic.",
          avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
        },
        {
          name: "John Doe",
          role: "Interior Designer",
          text: "This tool made staging homes so easy and realistic.",
          avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
        },
        {
          name: "Sarah Lee",
          role: "Realtor",
          text: "My listings now stand out. Clients are impressed.",
          avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
        },
        {
          name: "David Kim",
          role: "Architect",
          text: "An incredible platform for showcasing spaces realistically.",
          avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
        }
      ]
    };
  },

  methods: {
    scrollLeft() {
      this.$refs.scrollContainer.scrollBy({
        left: -300,
        behavior: "smooth"
      });
    },
    scrollRight() {
      this.$refs.scrollContainer.scrollBy({
        left: 300,
        behavior: "smooth"
      });
    }
  }
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Fade edges effect using CSS mask */
.fade-edges {
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 35%,
    black 40%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 35%,
    black 50%,
    transparent 100%
  );
}
</style>
