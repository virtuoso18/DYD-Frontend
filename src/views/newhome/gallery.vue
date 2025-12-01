<template>
  <div class="w-full bg-white py-12 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Title -->
      <h2 
        class="text-center mb-12"
        style="
          font-family: 'Proza Libre', sans-serif;
          font-weight: 700;
          font-size: 48px;
          line-height: 52px;
          letter-spacing: -0.02em;
          color: #000;
        "
      >
        Gallery
      </h2>

      <!-- Video Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:pl-30 gap-8 px-4 lg:px-0">
        <div 
          v-for="(video, index) in videos" 
          :key="index"
          class="relative rounded-3xl overflow-hidden shadow-lg cursor-pointer bg-gray-900"
          style="width: 274px; height: 426px;"
          @click="openVideo(index)"
        >
          <!-- Auto-playing Video -->
          <video 
            :ref="'video' + index"
            class="w-full h-full object-cover"
            autoplay
            muted
            loop
            playsinline
          >
            <source :src="video" type="video/mp4">
            <source :src="video" type="video/webm">
            <source :src="video" type="video/x-matroska">
          </video>
        </div>
      </div>

      <!-- Fullscreen Video Modal -->
      <transition name="fade">
        <div 
          v-if="showModal" 
          class="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          @click="closeModal"
        >
          <!-- Close Button -->
          <button 
            class="absolute top-6 right-6 text-white text-5xl hover:text-gray-400 transition-colors z-10"
            @click="closeModal"
          >
            ×
          </button>

          <!-- Previous Button -->
          <button 
            v-if="currentVideoIndex > 0"
            class="absolute left-6 top-1/2 -translate-y-1/2 text-white text-6xl hover:text-gray-400 transition-colors z-10"
            @click.stop="previousVideo"
          >
            ‹
          </button>

          <!-- Video Player -->
          <div class="relative max-w-5xl w-full" @click.stop>
            <video 
              :key="currentVideoIndex"
              class="w-full rounded-2xl shadow-2xl"
              controls
              autoplay
            >
              <source :src="videos[currentVideoIndex]" type="video/mp4">
              <source :src="videos[currentVideoIndex]" type="video/webm">
              <source :src="videos[currentVideoIndex]" type="video/x-matroska">
              Your browser does not support the video tag.
            </video>
          </div>

          <!-- Next Button -->
          <button 
            v-if="currentVideoIndex < videos.length - 1"
            class="absolute right-6 top-1/2 -translate-y-1/2 text-white text-6xl hover:text-gray-400 transition-colors z-10"
            @click.stop="nextVideo"
          >
            ›
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoGallery',
  
  data() {
    return {
      showModal: false,
      currentVideoIndex: 0,
      videos: []
    }
  },

  mounted() {
    // Load videos from public folder
   this.videos = [
  new URL('@/assets/aivirtual1.mkv', import.meta.url).href,
  new URL('@/assets/aivirtual2.mkv', import.meta.url).href,
  new URL('@/assets/aivirtual3.mkv', import.meta.url).href,
  new URL('@/assets/aivirtual4.mkv', import.meta.url).href,
]

    // Ensure videos start playing
    this.$nextTick(() => {
      for (let i = 0; i < this.videos.length; i++) {
        const videoElement = this.$refs['video' + i]
        if (videoElement && videoElement[0]) {
          // Force play in case autoplay doesn't work
          videoElement[0].play().catch(err => {
            console.log('Autoplay prevented:', err)
          })
        }
      }
    })
  },

  methods: {
    openVideo(index) {
      this.currentVideoIndex = index
      this.showModal = true
      document.body.style.overflow = 'hidden'
    },

    closeModal() {
      this.showModal = false
      document.body.style.overflow = ''
    },

    nextVideo() {
      if (this.currentVideoIndex < this.videos.length - 1) {
        this.currentVideoIndex++
      }
    },

    previousVideo() {
      if (this.currentVideoIndex > 0) {
        this.currentVideoIndex--
      }
    }
  },

  beforeUnmount() {
    document.body.style.overflow = ''
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
