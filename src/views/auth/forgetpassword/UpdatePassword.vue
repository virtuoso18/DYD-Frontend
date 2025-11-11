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
      <h1 style="margin: 0; padding: 0;">Create New Password</h1>
    </div>

    <p class="section_desc">
      Your new password must be different from the previous one.
    </p>

    <div class="form-container">
      <div class="input-group">
        <label>Type New Password</label>
        <a-input-password
          v-model:value="newPassword"
          placeholder="Enter new password (min 8 characters)"
          size="large"
          class="custom-input"
        />
        <span class="password-hint">{{ passwordStrength }}</span>
      </div>

      <div class="input-group">
        <label>Re-type New Password</label>
        <a-input-password
          v-model:value="confirmPassword"
          placeholder="Confirm new password"
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
        Update Password
      </a-button>
    </div>
  </div>
</template>

<script>
import { notification } from 'ant-design-vue';

export default {
  name: 'UpdatePassword',
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
      if (this.newPassword.length < 8)
        return '❌ Too short (min 8 characters)';
      if (this.newPassword.length < 12) return '⚠️ Weak';
      return '✅ Strong';
    },
  },
  mounted() {
    // ✅ FIXED: Get email and OTP from sessionStorage
    this.email = sessionStorage.getItem('passwordResetEmail') || '';
    this.otp = sessionStorage.getItem('passwordResetOTP') || '';
    
    console.log('📧 Email from sessionStorage:', this.email);
    console.log('🔐 OTP from sessionStorage:', this.otp);

    // Fallback: Listen for event
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
      // Validation
      if (!this.newPassword || !this.confirmPassword) {
        notification.error({
          message: 'Validation Error',
          description: 'Please fill in both password fields.',
          placement: 'bottomRight',
        });
        return;
      }

      if (this.newPassword.length < 8) {
        notification.error({
          message: 'Weak Password',
          description: 'Password must be at least 8 characters long.',
          placement: 'bottomRight',
        });
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        notification.error({
          message: 'Passwords Mismatch',
          description: 'Passwords do not match!',
          placement: 'bottomRight',
        });
        return;
      }

      // ✅ FIXED: Validate email and OTP exist
      if (!this.email || !this.otp) {
        notification.error({
          message: 'Error',
          description: 'Session expired. Please restart the process.',
          placement: 'bottomRight',
        });
        return;
      }

      this.loading = true;

      try {
        console.log('📤 Sending password reset with:', {
          email: this.email,
          otp: this.otp,
        });

        const response = await fetch(
          this.$store.state.root_api +
            'Auth/api/reset-password-with-otp/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
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
            message: 'Reset Failed',
            description: data.message || 'Failed to reset password',
            placement: 'bottomRight',
          });
          return;
        }

        notification.success({
          message: 'Success!',
          description:
            'Password reset successfully! Redirecting to login...',
          placement: 'bottomRight',
        });

        // ✅ Clear sessionStorage on success
        sessionStorage.removeItem('passwordResetEmail');
        sessionStorage.removeItem('passwordResetOTP');
        
        this.$router.push({ name: 'login' });

        // Redirect to signin after 2 seconds
        // setTimeout(() => {
          
        // }, 2000);
      } catch (error) {
        console.error('Password reset error:', error);
        notification.error({
          message: 'Server Error',
          description: 'Something went wrong. Please try again.',
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