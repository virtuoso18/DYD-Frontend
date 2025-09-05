<!-- signin.vue -->
<template>
  <div class="signin-container">
    <div class="form-section">
      <div class="welcome-text">
        <h3>Hello,</h3>
        <h1>Welcome to DYD</h1>
        <h3>Login to your account</h3>
      </div>

      <div class="form-container">
        <div class="input-group">
          <label>Email</label>
          <a-input 
            v-model:value="email"
            placeholder="Input Email address" 
            size="large"
            class="custom-input"
          />
        </div>

        <div class="input-group">
          <label>Password</label>
          <a-input 
            v-model:value="password"
            placeholder="Password Here" 
            size="large"
            class="custom-input"
            type="password"
          />
        </div>
        <!-- <div class="input-group">
          <label>Referral Code</label>
          <a-input 
            v-model:value="referralCode"
            placeholder="Code" 
            size="large"
            class="custom-input"
          />
        </div> -->

        <a-button type="primary" size="large" class="continue-btn" block @click="Submit_Login">
          Continue
        </a-button>

        <div class="divider">
          <span>OR</span>
        </div>

        <a-button size="large" class="google-btn" block>
          <img src="data:image/png;base64,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" alt="Google" style="width: 20px; height: 20px; margin-right: 8px;">
          Login With Google
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { notification } from "ant-design-vue";

export default {
  name: "signin",
  data() {
    return {
      email: '',
      referralCode: '',
      password: '',
      loading: false
    }
  },
  methods: {
    async Submit_Login() {
      this.loading = true;

      try {
        const response = await fetch(this.$store.state.root_api + "Auth/api/login/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          notification.error({
            message: "Login Failed",
            description: data.message || "Invalid email or password."
          });
          return;
        }

        if (data.token) {
          // Save token & user details
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("profile", JSON.stringify(data.profile));
          if (data.user.is_business){
            localStorage.setItem("business_profile", JSON.stringify(data.business_profile));
          }


          notification.success({
            message: "Login Successful",
            description: "Welcome back, " + (data.user?.full_name || data.user?.email) + "!",
            placement:'bottomRight'
          });

          // Redirect to dashboard
          this.$router.push({ name: "dashboard" });
        }
      } catch (error) {
        console.error("Login error:", error);
        notification.error({
          message: "Server Error",
          description: "Something went wrong. Please try again."
        });
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>



<style scoped>
.signin-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;
  padding: 40px;
  box-sizing: border-box;
}

.logo-section {
  margin-bottom: 60px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 50px;
  height: 50px;
  background: #3B63FB;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  color: #3B63FB;
}

.brand-name {
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 2px;
}

.tagline {
  font-size: 10px;
  letter-spacing: 3px;
  margin-top: 2px;
}

.form-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.welcome-text {
  margin-bottom: 40px;
}

.welcome-text h3:first-child {
  color: #666;
  font-size: 18px;
  font-weight: 400;
  margin: 0 0 8px 0;
}

.welcome-text h1 {
  color: #1a1a1a;
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.welcome-text h3:last-child {
  color: #666;
  font-size: 16px;
  font-weight: 400;
  margin: 0;
}

.form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
}

.custom-input:focus {
  border-color: #3B63FB;
  box-shadow: 0 0 0 2px rgba(91, 115, 232, 0.1);
}

.continue-btn {
  background: #3B63FB;
  border: none;
  border-radius: 8px;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 8px;
}

.continue-btn:hover {
  background: #3B63FB;
}

.divider {
  text-align: center;
  position: relative;
  margin: 8px 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e9ecef;
}

.divider span {
  background: white;
  padding: 0 16px;
  color: #666;
  font-size: 14px;
}

.google-btn {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #333;
}

.google-btn:hover {
  border-color: #d0d7de;
}
</style>
