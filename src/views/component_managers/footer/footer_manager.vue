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
      hideFooterUrls: ['/login', '/signup', '/forgot-password'],
    }
  },
  computed: {
    hideFooterCompletely() {
      const path = this.$route.path
      
      // Check exact matches
      if (this.hideFooterUrls.includes(path)) {
        return true
      }
      
      // Check if path starts with /ar-product/ (handles any product_id)
      if (path.startsWith('/ar-product/') ||path.startsWith('/update-catalogue/')  ) {
        return true
      }
      
      return false
    }
  },
  watch: {
    '$route.path'() {
      // triggers computed re-eval automatically
    }
  }
}
</script>