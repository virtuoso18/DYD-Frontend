<!-- signup.vue -->
<template>
  <div class="signup-container">
    <!-- Back Button -->
    <div v-if="shouldShowBackButton" class="back-button" @click="goBack" style=" margin-top:10px; ">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M19 12H5m0 0l7 7m-7-7l7-7" stroke="currentColor" stroke-width="2"/>
      </svg>
    </div>

    <!-- Step 1: Personalization Selection -->
    <div v-if="currentStep === 1" class="step-content">
      <div class="step-header">
        <h2>Your Personalization</h2>
        <p>Select what your personalization</p>
      </div>

      <div class="personalization-options">
        <div 
          class="option-card" 
          :class="{ active: selectedType === 'business' }"
          @click="selectPersonalization('business')"
        >
          <h3>Business</h3>
          <p>Design your Office</p>
        </div>

        <div 
          class="option-card" 
          :class="{ active: selectedType === 'professional', selected: selectedType === 'professional' }"
          @click="selectPersonalization('professional')"
        >
          <h3>Professional</h3>
          <p>Interior Designer or Architecture</p>
        </div>

        <div 
          class="option-card" 
          :class="{ active: selectedType === 'user', selected: selectedType === 'user' }"
          @click="selectPersonalization('user')"
        >
          <h3>User</h3>
          <p>Create your own profile</p>
        </div>
      </div>

      <a-button 
        type="primary" 
        size="large" 
        class="continue-btn" 
        block
        :disabled="!selectedType"
        @click="nextStep"
      >
        Continue
      </a-button>
    </div>

    <!-- Step 2: Personal Info -->
    <div v-if="currentStep === 2" class="step-content">
      <div class="step-header">
        <h2>Personal Info</h2>
      </div>

      <div class="form-container">
        <div class="input-row">
          <div class="input-group">
            <label>Name</label>
            <a-input 
              v-model:value="personalInfo.firstName"
              placeholder="First Name"
              size="large"
              class="custom-input"
            />
          </div>
          <div class="input-group">
            <label>Last Name</label>
            <a-input 
              v-model:value="personalInfo.lastName"
              placeholder="Last Name"
              size="large"
              class="custom-input"
            />
          </div>
        </div>

        <div class="input-group">
          <label>Email</label>
          <a-input 
            v-model:value="personalInfo.email"
            placeholder="Email"
            size="large"
            class="custom-input"
          />
        </div>

        <div class="input-group">
          <label>Password</label>
          <a-input-password 
            v-model:value="personalInfo.password"
            placeholder="Password"
            size="large"
            class="custom-input"
          />
          <div v-if="personalInfo.password && !isPasswordValid" class="password-feedback password-error">
            {{ passwordErrorMessage }}
          </div>
        </div>

        <div class="input-group">
          <label>Confirm Password</label>
          <a-input-password 
            v-model:value="personalInfo.confirmPassword"
            placeholder="Confirm Password"
            size="large"
            class="custom-input"
          />
          <div v-if="personalInfo.confirmPassword && personalInfo.password !== personalInfo.confirmPassword" class="password-feedback password-error">
            Passwords do not match
          </div>
        </div>

        <div class="checkbox-group">
          <a-checkbox v-model:checked="agreedToTerms">
            I agree with design.com Terms and Privacy Policy and allow design.com to contact me by email
          </a-checkbox>
        </div>

        <a-button 
          type="primary" 
          size="large" 
          class="continue-btn" 
          block
          :loading="loading"
          :disabled="!isPersonalInfoValid || loading"
          @click="nextStep"
        >
          {{ loading ? 'Processing...' : 'Continue' }}
        </a-button>
      </div>
    </div>

    <!-- Step 3: Business Profile (if business selected) -->
    <div v-if="currentStep === 3 && selectedType === 'business'" class="step-content">
      <div class="step-header">
        <h2>Complete Business Profile</h2>
      </div>

      <div class="form-container">
        <div class="upload-section">
          <div class="upload-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#ccc">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H19V9Z"/>
            </svg>
          </div>
        </div>

        <div class="input-group">
          <label>Business Name</label>
          <a-input 
            v-model:value="businessInfo.businessName"
            placeholder="Business Name"
            size="large"
            class="custom-input"
          />
        </div>

        <div class="input-group">
          <label>Business Email</label>
          <a-input 
            v-model:value="businessInfo.email"
            placeholder="Business Email"
            size="large"
            class="custom-input"
          />
          <div v-if="businessInfo.email && !validateEmail(businessInfo.email)" class="password-feedback password-error">
            Please enter a valid email address
          </div>
        </div>

        <div class="input-group">
          <label>Phone Number</label>
          <a-input 
            v-model:value="businessInfo.phone"
            placeholder="+91 Enter phone number"
            size="large"
            class="custom-input"
          />
          <div v-if="businessInfo.phone && !validatePhone(businessInfo.phone)" class="password-feedback password-error">
            Please enter a valid phone number
          </div>
        </div>

        <div class="input-group">
          <label>License</label>
          <a-input 
            v-model:value="businessInfo.license"
            placeholder="License (Optional)"
            size="large"
            class="custom-input"
          />
        </div>

        <div class="input-group">
          <label>Category</label>
          <div class="category-tags">
            <span class="tag" :class="{ active: businessInfo.categories.includes('Architecture') }" @click="toggleCategory('Architecture')">Architecture</span>
            <span class="tag" :class="{ active: businessInfo.categories.includes('Interior Design') }" @click="toggleCategory('Interior Design')">Interior Design</span>
            <span class="tag" :class="{ active: businessInfo.categories.includes('Kitchen Design') }" @click="toggleCategory('Kitchen Design')">Kitchen Design</span>
          </div>
        </div>

        <a-button 
          type="primary" 
          size="large" 
          class="continue-btn" 
          block
          :loading="loading"
          :disabled="!isBusinessInfoValid || loading"
          @click="completeSignup"
        >
          {{ loading ? 'Creating Account...' : 'Submit' }}
        </a-button>
      </div>
    </div>

    <!-- Step 3: Final Approval (if professional selected) -->
    <div v-if="currentStep === 3 && selectedType === 'professional'" class="step-content">
      <div class="step-header">
        <h2>Final Approval</h2>
      </div>

      <div class="form-container">
        <div class="approval-options">
          <div class="checkbox-group">
            <a-checkbox v-model:checked="finalApproval.contactApproval">
              I declare that I can be contacted through design or anywhere, I am very aware with design policies and policies.
            </a-checkbox>
          </div>

          <div class="checkbox-group">
            <a-checkbox v-model:checked="finalApproval.accountApproval">
              I am aware that I am providing a new account or you want it to be shared (sharing is optional at anyplace to my portfolio).
            </a-checkbox>
          </div>
        </div>

        <a-button 
          type="primary" 
          size="large" 
          class="continue-btn" 
          block
          :loading="loading"
          :disabled="!isFinalApprovalValid || loading"
          @click="completeSignup"
        >
          {{ loading ? 'Creating Account...' : 'Continue' }}
        </a-button>
      </div>
    </div>

    <!-- Success Step -->
    <div v-if="currentStep === 4" class="step-content success-content">
      <div class="success-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="#52c41a">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.41,10.09L6,11.5L11,16.5Z"/>
        </svg>
      </div>
      <h2>Account Created Successfully!</h2>
      <p>Welcome to DYD! Your account has been created.</p>
      <p>We have mailed you the activation link of this your account, please activate your account to login & proceeed further.</p>
      
      <a-button 
        type="primary" 
        size="large" 
        class="continue-btn" 
        block
        @click="goToLogin"
      >
        Go to Login
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "signup",
  data() {
    return {
      currentStep: 1,
      selectedType: null,
      loading: false,
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      businessInfo: {
        businessName: '',
        email: '',
        phone: '',
        license: '',
        categories: []
      },
      finalApproval: {
        contactApproval: false,
        accountApproval: false
      },
      agreedToTerms: false
    }
  },
  computed: {
    isPasswordValid() {
      const validation = this.validatePassword(this.personalInfo.password);
      return validation.valid;
    },
    passwordErrorMessage() {
      const validation = this.validatePassword(this.personalInfo.password);
      return validation.message;
    },
    isPersonalInfoValid() {
      return this.personalInfo.firstName.trim() && 
             this.personalInfo.lastName.trim() && 
             this.personalInfo.email.trim() && 
             this.validateEmail(this.personalInfo.email) &&
             this.personalInfo.password && 
             this.personalInfo.confirmPassword && 
             this.personalInfo.password === this.personalInfo.confirmPassword &&
             this.isPasswordValid &&
             this.agreedToTerms;
    },
    isBusinessInfoValid() {
      return this.businessInfo.businessName.trim() && 
             this.businessInfo.email.trim() && 
             this.validateEmail(this.businessInfo.email) &&
             this.businessInfo.phone.trim(); // &&
            //  this.validatePhone(this.businessInfo.phone);
    },
    isFinalApprovalValid() {
      return this.finalApproval.contactApproval && this.finalApproval.accountApproval;
    },
    shouldShowBackButton() {
      return this.currentStep > 1 && this.currentStep !== 4;
    }
  },
  methods: {
    selectPersonalization(type) {
      this.selectedType = type;
    },
    nextStep() {
      // For user type, skip to account creation after personal info
      if (this.selectedType === 'user') {
        if (this.currentStep === 1) {
          this.currentStep = 2;
        } else if (this.currentStep === 2) {
          this.completeSignup();
        }
      } 
      // For business and professional, go to step 3
      else if (this.selectedType === 'business' || this.selectedType === 'professional') {
        if (this.currentStep === 1) {
          this.currentStep = 2;
        } else if (this.currentStep === 2) {
          this.currentStep = 3;
        }
      }
    },
    goBack() {
      if (this.currentStep > 1) {
        this.currentStep--;
        
        if (this.currentStep === 1) {
          this.selectedType = null;
        }
      }
    },
    toggleCategory(category) {
      const index = this.businessInfo.categories.indexOf(category);
      if (index > -1) {
        this.businessInfo.categories.splice(index, 1);
      } else {
        this.businessInfo.categories.push(category);
      }
    },
    async completeSignup() {
      await this.registerUser();
    },
    
    async registerUser() {
      this.loading = true;

      try {
        const requestData = this.prepareRegistrationData();

        const response = await fetch(this.$store.state.root_api + "Auth/api/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestData)
        });

        const data = await response.json();

        if (!response.ok) {
          this.$notification.error({
            message: "Registration Failed",
            description: data.message || "Registration failed. Please try again.",
            placement: 'bottomRight'
          });
          return;
        }

        if (!data.error) {
          this.$notification.success({
            message: "Registration Successful",
            description: data.message || "Account created successfully. Please check your email to activate.",
            placement: 'bottomRight'
          });

          this.currentStep = 4;
        } else {
          this.$notification.error({
            message: "Registration Failed",
            description: data.message || "Registration failed. Please try again.",
            placement: 'bottomRight'
          });
        }
      } catch (error) {
        console.error("Registration error:", error);
        this.$notification.error({
          message: "Server Error",
          description: "Something went wrong. Please try again.",
          placement: 'bottomRight'
        });
      } finally {
        this.loading = false;
      }
    },

    prepareRegistrationData() {
      const baseData = {
        firstName: this.personalInfo.firstName.trim(),
        lastName: this.personalInfo.lastName.trim(),
        email: this.personalInfo.email.trim(),
        password: this.personalInfo.password,
        userType: this.selectedType,
        username: this.personalInfo.email.split("@")[0],
      };

      if (this.selectedType === 'business') {
        return {
          ...baseData,
          businessName: this.businessInfo.businessName.trim(),
          businessEmail: this.businessInfo.email.trim(),
          phoneNumber: this.businessInfo.phone.trim(),
          businessDescription: '',
          businessCategory: this.businessInfo.categories.join(', '),
          servicesOffered: '',
        };
      } else if (this.selectedType === 'professional') {
        return {
          ...baseData,
          termsAgreed: this.finalApproval.contactApproval && this.finalApproval.accountApproval,
          professionalDescription: '',
        };
      } else {
        return baseData;
      }
    },
    
    goToLogin() {
      this.$emit('switch-to-login');
    },
    
    validateEmail(email) {
      if (!email) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.trim());
    },
    
    validatePassword(password) {
      // if (!password || password.length < 8) {
      //   return { valid: false, message: "Password must be at least 8 characters long." };
      // }
      
      // if (/^\d+$/.test(password)) {
      //   return { valid: false, message: "Password cannot be entirely numeric." };
      // }
      
      // const commonPasswords = ['password', '12345678', 'qwerty123', 'password123', '123456789'];
      // if (commonPasswords.includes(password.toLowerCase())) {
      //   return { valid: false, message: "Password is too common." };
      // }
      
      // const firstName = this.personalInfo.firstName.toLowerCase();
      // const lastName = this.personalInfo.lastName.toLowerCase();
      // const email = this.personalInfo.email.toLowerCase().split('@')[0];
      
      // if (firstName && password.toLowerCase().includes(firstName) || 
      //     lastName && password.toLowerCase().includes(lastName) || 
      //     email && password.toLowerCase().includes(email)) {
      //   return { valid: false, message: "Password cannot be too similar to your personal information." };
      // }
      
      return { valid: true, message: "" };
    },
    
    validatePhone(phone) {
      if (!phone) return false;
      const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
      return phoneRegex.test(phone.replace(/\s+/g, ''));
    }
  }
}
</script>

<style scoped>
.signup-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* background: #f5f7fa; */
  /* padding: 20px; */
  box-sizing: border-box;
  position: relative;
  overflow-y: auto;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  cursor: pointer;
  color: #666;
  z-index: 10;
  padding: 8px;
  /* border-radius: 50%; */
  transition: all 0.3s ease;
}

.back-button:hover {
  color: #333;
  background: rgba(0,0,0,0.05);
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* max-width: 500px; */
  /* margin: 0 auto; */
  width: 100%;
  background: white;
  border-radius: 24px;
  padding: 40px 20px 10px 10px;
  /* padding: 40px 30px; */
  /* box-shadow: 0 2px 20px rgba(0,0,0,0.08); */
}

.professional-upload .step-content {
  max-width: 500px;
}

.step-header {
  margin-bottom: 32px;
  margin-left:60px;
  /* margin-top:5px; */
  text-align: left;
}

.step-header h2 {
  color: #1a1a1a;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.step-header p {
  color: #6b7280;
  font-size: 15px;
  margin: 0;
  line-height: 1.5;
}

.personalization-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.option-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 20px;
  height:94px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  position: relative;
}

.option-card:hover {
  border-color: #3B63FB;
  background: #f8faff;
}

.option-card.active,
.option-card.selected {
  border-color: #3B63FB;
  background: #3B63FB;
  color: white;
}

.option-card.active h3,
.option-card.selected h3 {
  color: white;
}

.option-card.active p,
.option-card.selected p {
  color: rgba(255,255,255,0.8);
}

.option-card h3 {
    font-family:Poppins;
  color: #1a1a1a;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.option-card p {
  color: #6b7280;
  font-weight: 400;
  font-size: 16px;
  margin: 0;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  color: #374151;
  font-size: 14px;
  font-weight: 500;
}

.custom-input {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.custom-input:focus,
.custom-input:hover {
  border-color: #3B63FB;
  background: white;
  box-shadow: 0 0 0 3px rgba(64, 150, 255, 0.1);
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
  margin: 8px 0;
}

.continue-btn {
  background: #3B63FB;
  border: none;
  border-radius: 12px;
  height: 48px;
  font-size: 15px;
  font-weight: 600;
  margin-top: auto;
  box-shadow: 0 2px 8px rgba(64, 150, 255, 0.2);
  transition: all 0.2s ease;
}

.continue-btn:hover:not(:disabled) {
  background: #1677ff;
  box-shadow: 0 4px 12px rgba(64, 150, 255, 0.3);
  transform: translateY(-1px);
}

.continue-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.upload-container {
  margin-bottom: 24px;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 16px;
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafbfc;
}

.upload-area:hover {
  border-color: #3B63FB;
  background: #f8faff;
}

.upload-area svg {
  margin-bottom: 12px;
}

.upload-area p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

.uploaded-file {
  border: 2px solid #52c41a;
  border-radius: 16px;
  padding: 20px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.certificate-preview {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.certificate-image {
  max-width: 100%;
  max-height: 280px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.certificate-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.certificate-svg {
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}

.file-actions {
  position: absolute;
  top: 8px;
  right: 8px;
}

.delete-btn {
  background: white;
  border: 1px solid #ff4d4f;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.2);
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background: #ff4d4f;
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

.delete-btn:hover svg {
  stroke: white;
}

.category-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 16px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  background: white;
}

.tag:hover {
  border-color: #3B63FB;
  color: #3B63FB;
}

.tag.active {
  background: #3B63FB;
  color: white;
  border-color: #3B63FB;
}

.approval-options {
  margin-bottom: 32px;
}

.success-content {
  text-align: center;
  justify-content: center;
}

.success-icon {
  margin-bottom: 20px;
}

.success-content h2 {
  color: #1a1a1a;
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.success-content p {
  color: #6b7280;
  font-size: 15px;
  margin: 0 0 32px 0;
}

@media (max-width: 768px) {
  .signup-container {
    padding: 16px;
  }
  
  .step-content {
    padding: 32px 24px;
    border-radius: 20px;
  }
  
  .input-row {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .step-header h2 {
    font-size: 22px;
  }
  
  .upload-area {
    padding: 24px 16px;
  }
}
</style>