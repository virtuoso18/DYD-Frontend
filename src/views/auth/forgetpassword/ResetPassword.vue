<template>
  <div class="reset-password-header-section">
    <div class="" style="display: flex; align-items: baseline;">
<div  class="back-button" style="margin-top:10px;">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M19 12H5m0 0l7 7m-7-7l7-7" stroke="currentColor" stroke-width="2"/>
      </svg>
    </div>
    <h1 style="margin: 0px; padding: 0px;">Reset Your Password</h1>
    </div>
    <p class="section_desc">Enter your email, and we'll send OTP to reset your password.</p>
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

        <a-button type="primary" size="large" class="continue-btn" block>
          Send OTP
        </a-button>
      </div>
  </div>
</template>
<script>

export default {
  name: "ResetPassword",
  data(){
    return {

      computed:{

      }
    }
  }
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
.header_text {
  font-size: 30px;
  font-weight: 600;
  color: #1a1a1a;
  font-style: SemiBold;
  font-family: Proza Libre;
  letter-spacing: 1%;
  

;
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

.section_desc{
  /* font-size: 24px; */
  font-weight: 400;
  line-height: 24px;
}

.form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 768px) {
  .reset-password-header-section  {
    padding: 16px;
  }
}
</style>
