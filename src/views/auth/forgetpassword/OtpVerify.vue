<!-- OtpVerify.vue - Step 2: Verify OTP - Vue 3 Fixed -->
<template>
  <div class="otpverify-header-section">
    <div style="display: flex; align-items: baseline;">
      <div class="back-button" style="margin-top: 10px;" @click="goBack">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 12H5m0 0l7 7m-7-7l7-7"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      </div>
      <h1 style="margin: 0; padding: 0;">OTP Verification</h1>
    </div>

    <p class="section_desc">
      Check your inbox for the OTP and enter it to verify your account.
    </p>

    <div class="form-container">
      <div class="otp-container">
        <h3>Enter 6-digit OTP</h3>

        <div class="otp-inputs">
          <input
            v-for="index in 6"
            :key="index"
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="otp-box"
            :value="otp[index - 1]"
            @input="handleInput($event, index - 1)"
            @keydown.backspace="handleBackspace($event, index - 1)"
            :ref="`otpInput${index - 1}`"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <a-button
          type="primary"
          size="large"
          class="continue-btn"
          block
          @click="verifyOtp"
          :loading="loading"
          :disabled="getOtpValue().length !== 6 || loading"
        >
          Verify OTP
        </a-button>

        <div style="text-align: center; margin-top: 16px;">
          <span class="resend-text">Didn't receive OTP? </span>
          <a-button
            type="link"
            @click="resendOtp"
            :loading="resendLoading"
            :disabled="resendLoading || countdown > 0"
          >
            {{ countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP' }}
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { notification } from 'ant-design-vue';

export default {
  name: 'OtpVerify',
  props: {
    onStepChange: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      otp: ['', '', '', '', '', ''],
      loading: false,
      resendLoading: false,
      countdown: 0,
      email: '',
      errorMessage: '',
      resendInterval: null,
    };
  },
  mounted() {
    // ✅ Vue 3: Use window event listener instead of $root.$on
    window.addEventListener('passwordReset:emailVerified', this.handleEmailVerified);

    // Focus on first OTP input
    this.$nextTick(() => {
      this.$refs.otpInput0?.[0]?.focus();
    });
  },
  methods: {
    // ✅ Handle email verified event
    handleEmailVerified(event) {
      this.email = event.detail;
      console.log('📧 Email received for OTP:', this.email);
    },

    getOtpValue() {
      return this.otp.join('');
    },

    handleInput(e, index) {
      const value = e.target.value.replace(/[^0-9]/g, '');

      // Only take the last digit if multiple are pasted
      const singleDigit = value.slice(-1);

      // ✅ Vue 3: Direct assignment instead of $set
      this.otp[index] = singleDigit;

      // Clear error message when user types
      this.errorMessage = '';

      // Auto-focus to next input if digit is entered
      if (singleDigit && index < 5) {
        this.$nextTick(() => {
          this.$refs[`otpInput${index + 1}`]?.[0]?.focus();
        });
      }

      // Auto-submit when all 6 digits are entered
      if (this.getOtpValue().length === 6) {
        this.$nextTick(() => {
          this.verifyOtp();
        });
      }
    },

    handleBackspace(e, index) {
      // If current field is empty and user presses backspace, go to previous field
      if (!this.otp[index] && index > 0) {
        this.$nextTick(() => {
          this.$refs[`otpInput${index - 1}`]?.[0]?.focus();
        });
      } else if (this.otp[index]) {
        // ✅ Vue 3: Direct assignment instead of $set
        this.otp[index] = '';
      }
    },

    async verifyOtp() {
      const otpValue = this.getOtpValue();

      if (otpValue.length !== 6) {
        this.errorMessage = 'Please enter all 6 digits';
        notification.error({
          message: 'Invalid OTP',
          description: 'Please enter all 6 digits.',
          placement: 'topRight',
        });
        return;
      }

      this.loading = true;
      this.errorMessage = '';

      try {
        // ✅ CORRECTED: Removed /api/ from URL path
        const response = await fetch(
          this.$store.state.root_api + 'Auth/api/verify-password-reset-otp/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: this.email,
              otp: otpValue,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          this.errorMessage = data.message || 'Invalid or expired OTP';
          notification.error({
            message: 'OTP Verification Failed',
            description: data.message || 'Invalid or expired OTP',
            placement: 'topRight',
          });
          return;
        }

        notification.success({
          message: 'Success',
          description: 'OTP verified successfully!',
          placement: 'topRight',
        });

        // ✅ Vue 3: Emit custom event instead of $root.$emit
        window.dispatchEvent(
          new CustomEvent('passwordReset:otpVerified', {
            detail: {
              email: this.email,
              otp: otpValue,
            },
          })
        );

        // Move to password reset step using parent callback
        this.onStepChange(3);
      } catch (error) {
        console.error('❌ OTP verification error:', error);
        this.errorMessage = 'Something went wrong. Please try again.';
        notification.error({
          message: 'Server Error',
          description: 'Something went wrong. Please try again.',
          placement: 'topRight',
        });
      } finally {
        this.loading = false;
      }
    },

    async resendOtp() {
      if (!this.email) {
        notification.error({
          message: 'Error',
          description: 'Email is required',
          placement: 'topRight',
        });
        return;
      }

      this.resendLoading = true;
      this.errorMessage = '';

      try {
        // ✅ CORRECTED: Removed /api/ from URL path
        const response = await fetch(
          this.$store.state.root_api + 'Auth/api/resend-password-reset-otp/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: this.email,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          notification.error({
            message: 'Error',
            description: data.message || 'Failed to resend OTP',
            placement: 'topRight',
          });
          return;
        }

        // Reset OTP inputs
        this.otp = ['', '', '', '', '', ''];

        this.$nextTick(() => {
          this.$refs.otpInput0?.[0]?.focus();
        });

        // Start countdown
        this.countdown = 60;
        if (this.resendInterval) {
          clearInterval(this.resendInterval);
        }

        this.resendInterval = setInterval(() => {
          this.countdown--;
          if (this.countdown === 0) {
            clearInterval(this.resendInterval);
            this.resendInterval = null;
          }
        }, 1000);

        notification.success({
          message: 'Success',
          description: 'New OTP sent to your email',
          placement: 'topRight',
        });
      } catch (error) {
        console.error('❌ Resend OTP error:', error);
        notification.error({
          message: 'Server Error',
          description: 'Something went wrong. Please try again.',
          placement: 'topRight',
        });
      } finally {
        this.resendLoading = false;
      }
    },

    goBack() {
      this.onStepChange(1);
      this.otp = ['', '', '', '', '', ''];
      this.errorMessage = '';

      if (this.resendInterval) {
        clearInterval(this.resendInterval);
      }
    },
  },
  beforeUnmount() {
    // ✅ Vue 3: Remove event listener
    window.removeEventListener('passwordReset:emailVerified', this.handleEmailVerified);

    if (this.resendInterval) {
      clearInterval(this.resendInterval);
    }
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

h1 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-left: 16px;
}

.section_desc {
  font-weight: 400;
  line-height: 24px;
  color: #666;
  margin: 16px 0;
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
  font-weight: 600;
  background-color: #f9f9f9;
}

.otp-box:hover {
  border-color: #999;
}

.otp-box:focus {
  border-color: #3b63fb;
  box-shadow: 0 0 5px rgba(59, 99, 251, 0.4);
  background-color: #fff;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
  margin: -10px 0 10px 0;
}

.continue-btn {
  background: #3b63fb;
  border: none;
  border-radius: 8px;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
}

.continue-btn:hover:not(:disabled) {
  background: #2a4fcf;
}

.continue-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.resend-text {
  color: #666;
  font-size: 14px;
}

@media (max-width: 768px) {
  .otpverify-header-section {
    padding: 16px;
  }

  .otp-box {
    width: 35px;
    height: 32px;
    font-size: 18px;
  }
}
</style>