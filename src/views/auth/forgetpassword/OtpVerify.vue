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
      <h1 style="margin: 0; padding: 0;">{{ t('otpVerify.title') }}</h1>
    </div>

    <p class="section_desc">
      {{ t('otpVerify.description') }}
    </p>

    <div class="form-container">
      <div class="otp-container">
        <h3>{{ t('otpVerify.enter6Digit') }}</h3>

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
          {{ t('otpVerify.verifyOtp') }}
        </a-button>

        <div style="text-align: center; margin-top: 16px;">
          <span class="resend-text">{{ t('otpVerify.didntReceive') }}</span>
          <a-button
            type="link"
            @click="resendOtp"
            :loading="resendLoading"
            :disabled="resendLoading || countdown > 0"
          >
            {{ countdown > 0 ? t('otpVerify.resendIn', { seconds: countdown }) : t('otpVerify.resendOtp') }}
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { notification } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'OtpVerify',
  setup() {
    const { t, locale } = useI18n();
    return { t, locale };
  },
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
    this.email = sessionStorage.getItem('passwordResetEmail') || '';

    const handleEmailVerified = (event) => {
      this.email = event.detail;
      sessionStorage.setItem('passwordResetEmail', this.email);
    };

    window.addEventListener('passwordReset:emailVerified', handleEmailVerified);
    this._emailVerifiedHandler = handleEmailVerified;

    this.$nextTick(() => {
      this.$refs.otpInput0?.[0]?.focus();
    });
  },
  methods: {
    getOtpValue() {
      return this.otp.join('');
    },

    handleInput(e, index) {
      const value = e.target.value.replace(/[^0-9]/g, '');
      const singleDigit = value.slice(-1);

      this.otp[index] = singleDigit;
      this.errorMessage = '';

      if (singleDigit && index < 5) {
        this.$nextTick(() => {
          this.$refs[`otpInput${index + 1}`]?.[0]?.focus();
        });
      }

      if (this.getOtpValue().length === 6) {
        this.$nextTick(() => {
          this.verifyOtp();
        });
      }
    },

    handleBackspace(e, index) {
      if (!this.otp[index] && index > 0) {
        this.$nextTick(() => {
          this.$refs[`otpInput${index - 1}`]?.[0]?.focus();
        });
      } else if (this.otp[index]) {
        this.otp[index] = '';
      }
    },

    async verifyOtp() {
      const otpValue = this.getOtpValue();

      if (!this.email || this.email.trim() === '') {
        this.errorMessage = this.t('otpVerify.errors.emailMissing');
        notification.error({
          message: this.t('otpVerify.notifications.error'),
          description: this.t('otpVerify.notifications.emailMissing'),
          placement: 'bottomRight',
        });
        return;
      }

      if (otpValue.length !== 6) {
        this.errorMessage = this.t('otpVerify.errors.enter6Digits');
        notification.error({
          message: this.t('otpVerify.notifications.invalidOtp'),
          description: this.t('otpVerify.errors.enter6Digits'),
          placement: 'bottomRight',
        });
        return;
      }

      this.loading = true;
      this.errorMessage = '';

      try {
        const response = await fetch(
          this.$store.state.root_api + 'Auth/api/verify-password-reset-otp/',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: this.email, otp: otpValue }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          this.errorMessage = data.message || this.t('otpVerify.errors.invalidExpiredOtp');
          notification.error({
            message: this.t('otpVerify.notifications.invalidOtp'),
            description: data.message || this.t('otpVerify.errors.invalidExpiredOtp'),
            placement: 'bottomRight',
          });
          return;
        }

        notification.success({
          message: this.t('otpVerify.notifications.success'),
          description: this.t('otpVerify.notifications.otpVerified'),
          placement: 'bottomRight',
        });

        sessionStorage.setItem('passwordResetOTP', otpValue);
        window.dispatchEvent(
          new CustomEvent('passwordReset:otpVerified', {
            detail: { email: this.email, otp: otpValue },
          })
        );

        this.onStepChange(3);
      } catch (error) {
        console.error('OTP verification error:', error);
        this.errorMessage = this.t('otpVerify.errors.somethingWentWrong');
        notification.error({
          message: this.t('otpVerify.notifications.serverError'),
          description: this.t('otpVerify.notifications.somethingWentWrong'),
          placement: 'bottomRight',
        });
      } finally {
        this.loading = false;
      }
    },

    async resendOtp() {
      if (!this.email) {
        notification.error({
          message: this.t('otpVerify.notifications.error'),
          description: this.t('otpVerify.errors.emailRequired'),
          placement: 'bottomRight',
        });
        return;
      }

      this.resendLoading = true;
      this.errorMessage = '';

      try {
        const response = await fetch(
          this.$store.state.root_api + 'Auth/api/resend-password-reset-otp/',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: this.email }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          notification.error({
            message: this.t('otpVerify.notifications.error'),
            description: data.message || this.t('otpVerify.notifications.failedResend'),
            placement: 'bottomRight',
          });
          return;
        }

        this.otp = ['', '', '', '', '', ''];
        this.$nextTick(() => {
          this.$refs.otpInput0?.[0]?.focus();
        });

        this.countdown = 60;
        if (this.resendInterval) clearInterval(this.resendInterval);

        this.resendInterval = setInterval(() => {
          this.countdown--;
          if (this.countdown === 0) {
            clearInterval(this.resendInterval);
            this.resendInterval = null;
          }
        }, 1000);

        notification.success({
          message: this.t('otpVerify.notifications.success'),
          description: this.t('otpVerify.notifications.otpResent'),
          placement: 'bottomRight',
        });
      } catch (error) {
        console.error('Resend OTP error:', error);
        notification.error({
          message: this.t('otpVerify.notifications.serverError'),
          description: this.t('otpVerify.notifications.somethingWentWrong'),
          placement: 'bottomRight',
        });
      } finally {
        this.resendLoading = false;
      }
    },

    goBack() {
      this.onStepChange(1);
      this.otp = ['', '', '', '', '', ''];
      this.errorMessage = '';
      if (this.resendInterval) clearInterval(this.resendInterval);
    },
  },
  beforeUnmount() {
    window.removeEventListener('passwordReset:emailVerified', this._emailVerifiedHandler);
    if (this.resendInterval) clearInterval(this.resendInterval);
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