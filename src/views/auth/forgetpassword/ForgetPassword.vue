<template>
  <div class="forget-password" style="padding: 10px;">
    <a-row style="background: white; min-width: 350px">
      <a-col span="16" :xs="0" :sm="0" :md="16" :lg="16" class="image-section">
        <div class="background-image">
          <img
            :src="getImageSrc"
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
        <ResetPassword v-if="currentStep === 1" />
        <OtpVerify v-if="currentStep === 2" />
        <UpdatePassword v-if="currentStep === 3" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import OtpVerify from './OtpVerify.vue';
import ResetPassword from './ResetPassword.vue';
import UpdatePassword from './UpdatePassword.vue';

export default {
  name: "ForgetPassword",

  components: {
    ResetPassword,
    OtpVerify,
    UpdatePassword,
  },

  data() {
    return {
      currentStep: 3,
    };
  },

  computed: {
    getImageSrc() {
      switch (this.currentStep) {
        case 1:
          return new URL("@/assets/resetpassword.png", import.meta.url).href;
        case 2:
          return new URL("@/assets/verifyOTPImage.png", import.meta.url).href;
        case 3:
          return new URL("@/assets/updatePassword.png", import.meta.url).href;
        default:
          return new URL("@/assets/resetpassword.png", import.meta.url).href;
      }
    },
  },
};
</script>

<style scoped></style>