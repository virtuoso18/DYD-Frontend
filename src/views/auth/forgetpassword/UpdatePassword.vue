<template>
  <div class="update-password-header-section">
    <!-- Header -->
    <div style="display: flex; align-items: baseline;">
      <div class="back-button" style="margin-top:10px;">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5m0 0l7 7m-7-7l7-7" stroke="currentColor" stroke-width="2" />
        </svg>
      </div>
      <h1 style="margin: 0; padding: 0;">Create New Password</h1>
    </div>

    <p class="section_desc">
      Your new password must be different from the previous one.
    </p>

    <!-- Form -->
    <div class="form-container">
      <div class="input-group">
        <label>Type New Password</label>
        <a-input-password
          v-model:value="newPassword"
          placeholder="Enter new password"
          size="large"
          class="custom-input"
        />
      </div>

      <div class="input-group">
        <label>Re-type New Password</label>
        <a-input-password
          v-model:value="confirmPassword"
          placeholder="Confirm new password"
          size="large"
          class="custom-input"
        />
      </div>

      <a-button
        type="primary"
        size="large"
        class="continue-btn"
        block
        @click="updatePassword"
      >
        Update Password
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "UpdatePassword",
  data() {
    return {
      newPassword: "",
      confirmPassword: "",
    };
  },
  methods: {
    updatePassword() {
      if (!this.newPassword || !this.confirmPassword) {
        this.$message.error("Please fill in both fields.");
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.$message.error("Passwords do not match!");
        return;
      }

      // 🔥 Perform API call or emit event here
      this.$message.success("Password updated successfully!");
    },
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

.section_desc {
  font-weight: 400;
  line-height: 24px;
}

.form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 20px;
}

.input-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
}

.custom-input {
  border-radius: 6px;
}

@media (max-width: 768px) {
  .update-password-header-section {
    padding: 16px;
  }
}
</style>