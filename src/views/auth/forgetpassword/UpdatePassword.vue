<!-- UpdatePassword.vue - Step 3: Update Password - FIXED v2 -->
<template>
  <div class="update-password-header-section">
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
      <h1 style="margin: 0; padding: 0;">{{ t('updatePassword.title') }}</h1>
    </div>

    <p class="section_desc">
      {{ t('updatePassword.description') }}
    </p>

    <div class="form-container">
      <div class="input-group">
        <label>{{ t('updatePassword.newPasswordLabel') }}</label>
        <a-input-password
          v-model:value="newPassword"
          :placeholder="t('updatePassword.newPasswordPlaceholder')"
          size="large"
          class="custom-input"
        />
        <span class="password-hint">{{ passwordStrength }}</span>
      </div>

      <div class="input-group">
        <label>{{ t('updatePassword.confirmPasswordLabel') }}</label>
        <a-input-password
          v-model:value="confirmPassword"
          :placeholder="t('updatePassword.confirmPasswordPlaceholder')"
          size="large"
          class="custom-input"
          @keyup.enter="updatePassword"
        />
      </div>

      <a-button
        type="primary"
        size="large"
        class="continue-btn"
        block
        @click="updatePassword"
        :loading="loading"
        :disabled="!newPassword || !confirmPassword || loading"
      >
        {{ t('updatePassword.updateButton') }}
      </a-button>
    </div>
  </div>
</template>

<script>
import { notification } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'UpdatePassword',
  setup() {
    const { t } = useI18n();
    return { t };
  },
  props: {
    onStepChange: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      loading: false,
      email: '',
      otp: '',
    };
  },
  computed: {
    passwordStrength() {
      if (!this.newPassword) return '';
      if (this.newPassword.length < 8) return this.t('updatePassword.strength.tooShort');
      if (this.newPassword.length < 12) return this.t('updatePassword.strength.weak');
      return this.t('updatePassword.strength.strong');
    },
  },
  mounted() {
    this.email = sessionStorage.getItem('passwordResetEmail') || '';
    this.otp = sessionStorage.getItem('passwordResetOTP') || '';

    const handleOtpVerified = (event) => {
      this.email = event.detail.email;
      this.otp = event.detail.otp;
      sessionStorage.setItem('passwordResetEmail', this.email);
      sessionStorage.setItem('passwordResetOTP', this.otp);
    };

    window.addEventListener('passwordReset:otpVerified', handleOtpVerified);
    this._otpVerifiedHandler = handleOtpVerified;
  },
  methods: {
    async updatePassword() {
      if (!this.newPassword || !this.confirmPassword) {
        notification.error({
          message: this.t('updatePassword.notifications.validationError'),
          description: this.t('updatePassword.notifications.fillBothFields'),
          placement: 'bottomRight',
        });
        return;
      }

      if (this.newPassword.length < 8) {
        notification.error({
          message: this.t('updatePassword.notifications.weakPassword'),
          description: this.t('updatePassword.notifications.minChars'),
          placement: 'bottomRight',
        });
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        notification.error({
          message: this.t('updatePassword.notifications.passwordsMismatch'),
          description: this.t('updatePassword.notifications.doNotMatch'),
          placement: 'bottomRight',
        });
        return;
      }

      if (!this.email || !this.otp) {
        notification.error({
          message: this.t('updatePassword.notifications.sessionExpired'),
          description: this.t('updatePassword.notifications.sessionExpiredDesc'),
          placement: 'bottomRight',
        });
        return;
      }

      this.loading = true;

      try {
        const response = await fetch(
          this.$store.state.root_api + 'Auth/api/reset-password-with-otp/',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: this.email,
              otp: this.otp,
              new_password: this.newPassword,
              confirm_password: this.confirmPassword,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          notification.error({
            message: this.t('updatePassword.notifications.resetFailed'),
            description: data.message || this.t('updatePassword.notifications.failedToReset'),
            placement: 'bottomRight',
          });
          return;
        }

        notification.success({
          message: this.t('updatePassword.notifications.success'),
          description: this.t('updatePassword.notifications.passwordReset'),
          placement: 'bottomRight',
        });

        sessionStorage.removeItem('passwordResetEmail');
        sessionStorage.removeItem('passwordResetOTP');

        this.$router.push({ name: 'login' });
      } catch (error) {
        console.error('Password reset error:', error);
        notification.error({
          message: this.t('updatePassword.notifications.serverError'),
          description: this.t('updatePassword.notifications.somethingWentWrong'),
          placement: 'bottomRight',
        });
      } finally {
        this.loading = false;
      }
    },

    goBack() {
      this.onStepChange(2);
    },
  },
  beforeUnmount() {
    window.removeEventListener('passwordReset:otpVerified', this._otpVerifiedHandler);
  },
};
</script>

<style scoped>
.update-password-header-section {
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
  margin-top: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.custom-input {
  border-radius: 6px;
}

.password-hint {
  font-size: 12px;
  margin-top: 4px;
  color: #666;
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

@media (max-width: 768px) {
  .update-password-header-section {
    padding: 16px;
  }

  h1 {
    font-size: 24px;
  }
}
</style>