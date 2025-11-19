<template>
  <div v-if="!hideNavbarCompletely">
    <navbar_1 v-if="!userAuthenticated"/>
    <navbar_2 v-else/>
  </div>
</template>

<script>
import navbar_1 from '@/components/Includes/navbar_4.vue'
import navbar_2 from '@/components/Includes/navbar_7.vue'

export default {
  name: "navbar_manager",
  components: { navbar_1, navbar_2 },
  data() {
    return {
      hideNavUrls: ['/login', '/signup','/forgot-password','/product-ar-view']
    }
  },
  beforeCreate() {
    this.$store.commit('initializeStore')
  },
  computed: {
    userAuthenticated() {
      // Check both store AND localStorage to be safe
      const hasToken = !!this.$store.state.token
      const hasLocalToken = !!localStorage.getItem('token')
      return hasToken || hasLocalToken
    },
    hideNavbarCompletely() {
      return this.hideNavUrls.includes(this.$route.path)
    }
  },
  watch: {
    '$route.path'() {
      // After route change (like after login redirect), update store
      this.$store.commit('initializeStore')
    }
  }
}
</script>