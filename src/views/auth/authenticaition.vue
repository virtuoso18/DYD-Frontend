<!-- authentication_page.vue -->
<template>
  <div class="">
    <a-row style="background: white; min-width: 350px;">
      <a-col span="16" :xs="0" :sm="0" :md="16" :lg="16" class="image-section">
        <div class="background-image">
          <img
            src="../../assets/signin.jpg"
            style="
              width: 100%;
              height: 98vh;
              object-fit: fill;
              border-radius: 20px;
            "
            alt=""
          />
        </div>
      </a-col>
      <a-col span="8" :xs="24" :sm="24" :md="8" class="form-section">
        <!-- {{this.$route.fullPath == '/signin'}} -->
        <signin v-if ="this.$route.path== '/login'"/>
        <signup v-if ="this.$route.path == '/signup'"/>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import signin from '@/views/auth/signin.vue'
import signup from '@/views/auth/signup.vue'

export default {
  name: "authentication_page",
  components: {
    signin,
    signup,
  }
}
</script>


<style scoped>
.background-image{
    padding:10px;
}
</style>