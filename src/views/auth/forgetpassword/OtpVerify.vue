<template>
  <div class="otpverify-header-section">
    <!-- Header -->
    <div style="display: flex; align-items: baseline;">
      <div class="back-button" style="margin-top:10px;">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5m0 0l7 7m-7-7l7-7" stroke="currentColor" stroke-width="2" />
        </svg>
      </div>
      <h1 style="margin: 0; padding: 0;">OTP Verification</h1>
    </div>

    <p class="section_desc">
      Check your inbox for the OTP and enter it to verify your account.
    </p>

    <!-- OTP Inputs -->
    <div class="form-container">
      <div class="otp-container">
        <h3>Enter 6-digit OTP</h3>

        <div class="otp-inputs">
          <input
            v-for="(digit, index) in otp"
            :key="index"
            type="text"
            maxlength="1"
            class="otp-box"
            v-model="otp[index]"
            @input="handleInput($event, index)"
            @keydown.backspace="handleBackspace($event, index)"
            ref="otpInputs"
          />
        </div>

        <a-button
          type="primary"
          size="large"
          class="continue-btn"
          block
          @click="verifyOtp"
        >
          Verify OTP
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OtpVerify",
  data() {
    return {
      otp: ["", "", "", "", "", ""],
    };
  },
  methods: {
    handleInput(e, index) {
      const value = e.target.value.replace(/[^0-9]/g, ""); // only allow numbers
      this.otp[index] = value;
      if (value && index < 5) {
        this.$refs.otpInputs[index + 1].focus();
      }
    },
    handleBackspace(e, index) {
      if (!this.otp[index] && index > 0) {
        this.$refs.otpInputs[index - 1].focus();
      }
    },
    verifyOtp() {
      const otpValue = this.otp.join("");
      if (otpValue.length === 6) {
        alert(`Your entered OTP: ${otpValue}`);
        // TODO: handle OTP verification (API call or emit event)
      } else {
        alert("Please enter all 6 digits.");
      }
    },
  },
};
</script>

<style scoped>
.otpverify-header-section {
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  overflow-y: auto;
  margin: 10px;
  padding: 10px 20px;
}

.back-button {
  top: 20px;
  left: 20px;
  cursor: pointer;
  color: #666;
  z-index: 10;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.back-button:hover {
  color: #333;
  background: rgba(0, 0, 0, 0.05);
}

.section_desc {
  font-weight: 400;
  line-height: 24px;
}

.form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.otp-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.otp-inputs {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.otp-box {
  width: 40px;
  height: 35px;
  text-align: center;
  font-size: 22px;
  border: 1.5px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: 0.2s ease-in-out;
}

.otp-box:focus {
  border-color: #1677ff;
  box-shadow: 0 0 5px rgba(22, 119, 255, 0.4);
}

@media (max-width: 768px) {
  .otpverify-header-section {
    padding: 16px;
  }
}
</style>