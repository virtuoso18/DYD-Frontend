<!-- ForgetPassword.vue - Parent Component -->
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
        <!-- Step 1: Email Verification -->
        <ResetPassword 
          v-if="currentStep === 1" 
          :onStepChange="changeStep"
        />

        <!-- Step 2: OTP Verification -->
        <OtpVerify 
          v-if="currentStep === 2" 
          :onStepChange="changeStep"
        />

        <!-- Step 3: Update Password -->
        <UpdatePassword 
          v-if="currentStep === 3" 
          :onStepChange="changeStep"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import OtpVerify from './OtpVerify.vue';
import ResetPassword from './ResetPassword.vue';
import UpdatePassword from './UpdatePassword.vue';

export default {
  name: 'ForgetPassword',

  components: {
    ResetPassword,
    OtpVerify,
    UpdatePassword,
  },

  data() {
    return {
      currentStep: 1, // ✅ Starts at Step 1: Email Verification
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

  methods: {
    // ✅ Centralized step management
    changeStep(step) {
      console.log(`📍 Changing step from ${this.currentStep} to ${step}`);
      this.currentStep = step;
    },
  },
};
</script>

<style scoped>
.forget-password {
  width: 100%;
  height: 100vh;
}

.image-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.background-image {
  width: 100%;
}

.form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

@media (max-width: 768px) {
  .form-section {
    padding: 10px;
  }
}
</style>