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
      hideNavUrls: ['/login', '/signup'],
      userAuthenticated :false
    }
  },
  beforeCreate() {
    this.$store.commit('initializeStore')
  },
  mounted() {
    if (this.$store.state.token) {
      this.userAuthenticated = true
    }
  },
  computed: {
    hideNavbarCompletely() {
      // hide if current route is in the list
      return this.hideNavUrls.includes(this.$route.path)
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
