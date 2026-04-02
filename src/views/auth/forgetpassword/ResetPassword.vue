<template>
  <div class="reset-password-header-section">
    <div style="display: flex; align-items: baseline;">
      <h1 style="margin: 0; padding: 0;">{{ t('resetPassword.forgotPassword') }}</h1>
    </div>

    <p class="section_desc">
      {{ t('resetPassword.description') }}
    </p>

    <div class="form-container">
      <div class="input-group">
        <label>{{ t('resetPassword.emailAddress') }}</label>
        <a-input
          v-model:value="email"
          :placeholder="t('resetPassword.emailPlaceholder')"
          type="email"
          size="large"
          class="custom-input"
          @keyup.enter="sendOtp"
        />
        <span v-if="emailError" class="error-message">{{ emailError }}</span>
      </div>

      <a-button
        type="primary"
        size="large"
        class="continue-btn"
        block
        @click="sendOtp"
        :loading="loading"
        :disabled="!email || loading"
      >
        {{ t('resetPassword.sendOtp') }}
      </a-button>

      <p style="text-align: center; font-size: 14px; color: #666; margin-top: 16px;">
        {{ t('resetPassword.rememberPassword') }}
        <router-link to="/login" style="color: #3b63fb; text-decoration: none;">
          {{ t('resetPassword.login') }}
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { notification } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'ResetPassword',
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
      email: '',
      loading: false,
      emailError: '',
    };
  },
  methods: {
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    async sendOtp() {
      this.emailError = '';

      if (!this.email) {
        this.emailError = this.t('resetPassword.errors.emailRequired');
        notification.error({
          message: this.t('resetPassword.notifications.validationError'),
          description: this.t('resetPassword.notifications.pleaseEnterEmail'),
          placement: 'bottomRight',
        });
        return;
      }

      if (!this.validateEmail(this.email)) {
        this.emailError = this.t('resetPassword.errors.validEmail');
        notification.error({
          message: this.t('resetPassword.notifications.invalidEmail'),
          description: this.t('resetPassword.notifications.pleaseEnterValidEmail'),
          placement: 'bottomRight',
        });
        return;
      }

      this.loading = true;

      try {
        const response = await fetch(
          this.$store.state.root_api + 'Auth/api/forgot-password-request/',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: this.email }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          this.emailError = data.message || this.t('resetPassword.errors.failedToSendOtp');
          notification.error({
            message: this.t('resetPassword.notifications.error'),
            description: data.message || this.t('resetPassword.errors.failedToSendOtp'),
            placement: 'bottomRight',
          });
          return;
        }

        notification.success({
          message: this.t('resetPassword.notifications.success'),
          description: this.t('resetPassword.notifications.otpSent'),
          placement: 'bottomRight',
        });

        sessionStorage.setItem('passwordResetEmail', this.email);
        window.dispatchEvent(
          new CustomEvent('passwordReset:emailVerified', { detail: this.email })
        );

        this.onStepChange(2);
      } catch (error) {
        console.error('Password reset request error:', error);
        this.emailError = this.t('resetPassword.errors.somethingWentWrong');
        notification.error({
          message: this.t('resetPassword.notifications.serverError'),
          description: this.t('resetPassword.notifications.somethingWentWrong'),
          placement: 'bottomRight',
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.reset-password-header-section {
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  overflow-y: auto;
  margin: 10px;
  padding: 10px 20px;
}

h1 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
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

.error-message {
  color: #e74c3c;
  font-size: 12px;
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
  .reset-password-header-section {
    padding: 16px;
  }

  h1 {
    font-size: 24px;
  }
}
</style>