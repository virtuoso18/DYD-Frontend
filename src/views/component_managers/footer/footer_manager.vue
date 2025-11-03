<template>
  <div v-if="!hideFooterCompletely">
    <footer_component/>
  </div>
</template>

<script>
import footer_component from '@/components/Includes/footer.vue'

export default {
  name: "navbar_manager",
  components:{footer_component},
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
