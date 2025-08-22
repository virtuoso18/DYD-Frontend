<template>
  <div v-if="!hideFooterCompletely">
    <footer/>
  </div>
</template>

<script>
import footer from '@/components/Includes/footer.vue'

export default {
  name: "navbar_manager",
  components: { footer },
  data() {
    return {
      hideFooterUrls: ['/login', '/signup'],
    }
  },
  computed: {
    hideFooterCompletely() {
      // hide if current route is in the list
      return this.hideFooterUrls.includes(this.$route.path)
    }
  },
  watch: {
    // recompute on route change
    '$route.path'() {
      // triggers computed re-eval automatically
    }
  }
}
</script>
