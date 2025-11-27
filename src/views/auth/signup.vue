<!-- signup.vue -->
<template>
  <div class="signup-container">
    <!-- Back Button -->
    <div v-if="shouldShowBackButton" class="back-button" @click="goBack" style="margin-top:10px;">
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
              :class="{ 'input-error': errors.firstName }"
            />
            <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
          </div>
          <div class="input-group">
            <label>Last Name</label>
            <a-input 
              v-model:value="personalInfo.lastName"
              placeholder="Last Name"
              size="large"
              class="custom-input"
              :class="{ 'input-error': errors.lastName }"
            />
            <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
          </div>
        </div>

        <div class="input-group">
          <label>Email</label>
          <a-input 
            v-model:value="personalInfo.email"
            placeholder="Email"
            size="large"
            class="custom-input"
            :class="{ 'input-error': errors.email }"
            @blur="validateField('email')"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="input-group">
          <label>Password</label>
          <a-input-password 
            v-model:value="personalInfo.password"
            placeholder="Password"
            size="large"
            class="custom-input"
            :class="{ 'input-error': errors.password }"
            @blur="validateField('password')"
          />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          <div v-if="personalInfo.password && !isPasswordValid && !errors.password" class="password-feedback password-error">
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
            :class="{ 'input-error': errors.confirmPassword }"
            @blur="validateField('confirmPassword')"
          />
          <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
          <div v-if="personalInfo.confirmPassword && personalInfo.password !== personalInfo.confirmPassword && !errors.confirmPassword" class="password-feedback password-error">
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
            :class="{ 'input-error': errors.businessName }"
            @blur="validateField('businessName')"
          />
          <span v-if="errors.businessName" class="error-message">{{ errors.businessName }}</span>
        </div>

        <div class="input-group">
          <label>Business Email</label>
          <a-input 
            v-model:value="businessInfo.email"
            placeholder="Business Email"
            size="large"
            class="custom-input"
            :class="{ 'input-error': errors.businessEmail }"
            @blur="validateField('businessEmail')"
          />
          <span v-if="errors.businessEmail" class="error-message">{{ errors.businessEmail }}</span>
          <div v-if="businessInfo.email && !validateEmail(businessInfo.email) && !errors.businessEmail" class="password-feedback password-error">
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
            :class="{ 'input-error': errors.businessPhone }"
            @blur="validateField('businessPhone')"
          />
          <span v-if="errors.businessPhone" class="error-message">{{ errors.businessPhone }}</span>
          <div v-if="businessInfo.phone && !validatePhone(businessInfo.phone) && !errors.businessPhone" class="password-feedback password-error">
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
          @click="submitRegistration"
        >
          {{ loading ? 'Creating Account...' : 'Submit' }}
        </a-button>
      </div>
    </div>

    <!-- Step 3: Final Approval (if professional selected) -->
    <div v-if="currentStep === 3 && selectedType === 'professional'" class="step-content">
      <!-- <div class="step-header">
        <h2>Final Approval</h2>
      </div> -->

      <div class="step-header">
        <h2 style="margin-bottom:0">Complete Business Details</h2>
      </div>

      <div class="form-container">
        <!-- <div class="upload-section">
          <div class="upload-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#ccc">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H19V9Z"/>
            </svg>
          </div>
        </div> -->

        <div class="input-group">
          <label>Business Name</label>
          <a-input 
            v-model:value="businessInfo.businessName"
            placeholder="Business Name"
            size="large"
            class="custom-input"
            :class="{ 'input-error': errors.businessName }"
            @blur="validateField('businessName')"
          />
          <span v-if="errors.businessName" class="error-message">{{ errors.businessName }}</span>
        </div>

        <div class="input-group">
          <label>Business Email</label>
          <a-input 
            v-model:value="businessInfo.email"
            placeholder="Business Email"
            size="large"
            class="custom-input"
            :class="{ 'input-error': errors.businessEmail }"
            @blur="validateField('businessEmail')"
          />
          <span v-if="errors.businessEmail" class="error-message">{{ errors.businessEmail }}</span>
          <div v-if="businessInfo.email && !validateEmail(businessInfo.email) && !errors.businessEmail" class="password-feedback password-error">
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
            :class="{ 'input-error': errors.businessPhone }"
            @blur="validateField('businessPhone')"
          />
          <span v-if="errors.businessPhone" class="error-message">{{ errors.businessPhone }}</span>
          <div v-if="businessInfo.phone && !validatePhone(businessInfo.phone) && !errors.businessPhone" class="password-feedback password-error">
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

        
      </div>
   <br>
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
          @click="submitRegistration"
        >
          {{ loading ? 'Creating Account...' : 'Continue' }}
        </a-button>

        <!-- <a-button 
          type="primary" 
          size="large" 
          class="continue-btn" 
          block
          :loading="loading"
          :disabled="!isBusinessInfoValid || loading"
          @click="submitRegistration"
        >
          {{ loading ? 'Creating Account...' : 'Submit' }}
        </a-button> -->
      </div>
    </div>

    <!-- Step 4: OTP Verification -->
    <div v-if="currentStep === 4" class="step-content">
      <div class="step-header">
        <h2>Verify Your Email</h2>
        <p>We've sent a 6-digit code to {{ personalInfo.email }}</p>
      </div>

      <div class="form-container">
        <div class="otp-section">
          <div class="otp-inputs">
            <input
              v-for="(digit, index) in otp"
              :key="index"
              :ref="el => { if (el) otpInputs[index] = el }"
              v-model="otp[index]"
              type="text"
              maxlength="1"
              class="otp-input"
              :class="{ 'input-error': otpError }"
              @input="handleOtpInput($event, index)"
              @keydown="handleOtpKeydown($event, index)"
              @paste="handleOtpPaste($event)"
            />
          </div>
          <span v-if="otpError" class="error-message text-center">{{ otpError }}</span>
          
          <div class="otp-timer" v-if="otpTimer > 0">
            <p>Code expires in {{ formatTime(otpTimer) }}</p>
          </div>

          <div class="resend-section" v-if="canResendOtp">
            <p>Didn't receive the code?</p>
            <a-button 
              type="link" 
              :loading="resendingOtp"
              @click="resendOtp"
              class="resend-link"
            >
              {{ resendingOtp ? 'Sending...' : 'Resend Code' }}
            </a-button>
          </div>
        </div>

        <a-button 
          type="primary" 
          size="large" 
          class="continue-btn" 
          block
          :loading="verifyingOtp"
          :disabled="!isOtpComplete || verifyingOtp"
          @click="verifyOtp"
        >
          {{ verifyingOtp ? 'Verifying...' : 'Verify & Continue' }}
        </a-button>
      </div>
    </div>

    <!-- Success Step -->
    <div v-if="currentStep === 5" class="step-content success-content">
      <div class="success-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="#52c41a">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.41,10.09L6,11.5L11,16.5Z"/>
        </svg>
      </div>
      <h2>Account Created Successfully!</h2>
      <p>Welcome to DYD! Your account has been verified and activated.</p>
      <p>You can now login and start exploring the platform.</p>
      
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
      verifyingOtp: false,
      resendingOtp: false,
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
      agreedToTerms: false,
      otp: ['', '', '', '', '', ''],
      otpInputs: [],
      otpError: '',
      otpTimer: 600, // 10 minutes in seconds
      otpTimerInterval: null,
      canResendOtp: false,
      errors: {}
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
             this.businessInfo.phone.trim();
    },
    isFinalApprovalValid() {
      return this.finalApproval.contactApproval && this.finalApproval.accountApproval;
    },
    shouldShowBackButton() {
      return this.currentStep > 1 && this.currentStep !== 4 && this.currentStep !== 5;
    },
    isOtpComplete() {
      return this.otp.every(digit => digit !== '');
    }
  },
  methods: {
    selectPersonalization(type) {
      this.selectedType = type;
    },
    
    nextStep() {
      // Clear previous errors
      this.errors = {};
      
      // Validate current step
      if (this.currentStep === 2) {
        if (!this.validatePersonalInfo()) {
          return;
        }
      }
      
      // For user type, go directly to registration
      if (this.selectedType === 'user') {
        if (this.currentStep === 1) {
          this.currentStep = 2;
        } else if (this.currentStep === 2) {
          this.submitRegistration();
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
        this.errors = {};
        
        if (this.currentStep === 1) {
          this.selectedType = null;
        }
      }
    },
    
    validateField(field) {
      this.errors = { ...this.errors };
      
      switch(field) {
        case 'firstName':
          if (!this.personalInfo.firstName.trim()) {
            this.errors.firstName = 'First name is required';
          } else {
            delete this.errors.firstName;
          }
          break;
        case 'lastName':
          if (!this.personalInfo.lastName.trim()) {
            this.errors.lastName = 'Last name is required';
          } else {
            delete this.errors.lastName;
          }
          break;
        case 'email':
          if (!this.personalInfo.email.trim()) {
            this.errors.email = 'Email is required';
          } else if (!this.validateEmail(this.personalInfo.email)) {
            this.errors.email = 'Please enter a valid email address';
          } else {
            delete this.errors.email;
          }
          break;
        case 'password':
          if (!this.personalInfo.password) {
            this.errors.password = 'Password is required';
          } else {
            delete this.errors.password;
          }
          break;
        case 'confirmPassword':
          if (!this.personalInfo.confirmPassword) {
            this.errors.confirmPassword = 'Please confirm your password';
          } else if (this.personalInfo.password !== this.personalInfo.confirmPassword) {
            this.errors.confirmPassword = 'Passwords do not match';
          } else {
            delete this.errors.confirmPassword;
          }
          break;
        case 'businessName':
          if (!this.businessInfo.businessName.trim()) {
            this.errors.businessName = 'Business name is required';
          } else {
            delete this.errors.businessName;
          }
          break;
        case 'businessEmail':
          if (!this.businessInfo.email.trim()) {
            this.errors.businessEmail = 'Business email is required';
          } else if (!this.validateEmail(this.businessInfo.email)) {
            this.errors.businessEmail = 'Please enter a valid business email';
          } else {
            delete this.errors.businessEmail;
          }
          break;
        case 'businessPhone':
          if (!this.businessInfo.phone.trim()) {
            this.errors.businessPhone = 'Phone number is required';
          } else {
            delete this.errors.businessPhone;
          }
          break;
      }
    },
    
    validatePersonalInfo() {
      let isValid = true;
      this.errors = {};
      
      if (!this.personalInfo.firstName.trim()) {
        this.errors.firstName = 'First name is required';
        isValid = false;
      }
      if (!this.personalInfo.lastName.trim()) {
        this.errors.lastName = 'Last name is required';
        isValid = false;
      }
      if (!this.personalInfo.email.trim()) {
        this.errors.email = 'Email is required';
        isValid = false;
      } else if (!this.validateEmail(this.personalInfo.email)) {
        this.errors.email = 'Please enter a valid email';
        isValid = false;
      }
      if (!this.personalInfo.password) {
        this.errors.password = 'Password is required';
        isValid = false;
      }
      if (!this.personalInfo.confirmPassword) {
        this.errors.confirmPassword = 'Please confirm your password';
        isValid = false;
      } else if (this.personalInfo.password !== this.personalInfo.confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
      
      return isValid;
    },
    
    validateBusinessInfo() {
      let isValid = true;
      this.errors = {};
      
      if (!this.businessInfo.businessName.trim()) {
        this.errors.businessName = 'Business name is required';
        isValid = false;
      }
      if (!this.businessInfo.email.trim()) {
        this.errors.businessEmail = 'Business email is required';
        isValid = false;
      } else if (!this.validateEmail(this.businessInfo.email)) {
        this.errors.businessEmail = 'Please enter a valid business email';
        isValid = false;
      }
      if (!this.businessInfo.phone.trim()) {
        this.errors.businessPhone = 'Phone number is required';
        isValid = false;
      }
      
      return isValid;
    },
    
    toggleCategory(category) {
      const index = this.businessInfo.categories.indexOf(category);
      if (index > -1) {
        this.businessInfo.categories.splice(index, 1);
      } else {
        this.businessInfo.categories.push(category);
      }
    },
    
    async submitRegistration() {
      // Validate based on user type
      if (this.selectedType === 'business' && !this.validateBusinessInfo()) {
        return;
      }
      
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
            placement: 'bottomLeft'
          });
          return;
        }

        if (!data.error) {
          this.$notification.success({
            message: "OTP Sent Successfully",
            description: data.message || "Please check your email and enter the OTP to verify your account.",
            placement: 'bottomLeft',
            duration: 5
          });

          // Move to OTP verification step
          this.currentStep = 4;
          this.startOtpTimer();
        } else {
          this.$notification.error({
            message: "Registration Failed",
            description: data.message || "Registration failed. Please try again.",
            placement: 'bottomLeft'
          });
        }
      } catch (error) {
        console.error("Registration error:", error);
        this.$notification.error({
          message: "Server Error",
          description: "Something went wrong. Please try again.",
          placement: 'bottomLeft'
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
          businessName: this.businessInfo.businessName.trim(),
          businessEmail: this.businessInfo.email.trim(),
          phoneNumber: this.businessInfo.phone.trim(),
          businessDescription: '',
          businessCategory: this.businessInfo.categories.join(', '),
          servicesOffered: '',
          termsAgreed: this.finalApproval.contactApproval && this.finalApproval.accountApproval,
          professionalDescription: '',
        };
      } else {
        return baseData;
      }
    },
    
    handleOtpInput(event, index) {
      const value = event.target.value;
      
      // Only allow numbers
      if (!/^\d*$/.test(value)) {
        this.otp[index] = '';
        return;
      }
      
      this.otp[index] = value;
      this.otpError = '';
      
      // Auto-focus next input
      if (value && index < 5) {
        this.otpInputs[index + 1].focus();
      }
    },
    
    handleOtpKeydown(event, index) {
      // Handle backspace
      if (event.key === 'Backspace' && !this.otp[index] && index > 0) {
        this.otpInputs[index - 1].focus();
      }
      
      // Handle arrow keys
      if (event.key === 'ArrowLeft' && index > 0) {
        this.otpInputs[index - 1].focus();
      }
      if (event.key === 'ArrowRight' && index < 5) {
        this.otpInputs[index + 1].focus();
      }
    },
    
    handleOtpPaste(event) {
      event.preventDefault();
      const pastedData = event.clipboardData.getData('text').trim();
      
      if (!/^\d{6}$/.test(pastedData)) {
        this.otpError = 'Please paste a valid 6-digit OTP';
        return;
      }
      
      // Fill all inputs with pasted digits
      for (let i = 0; i < 6; i++) {
        this.otp[i] = pastedData[i];
      }
      
      // Focus last input
      this.otpInputs[5].focus();
      this.otpError = '';
    },
    
    async verifyOtp() {
      this.verifyingOtp = true;
      this.otpError = '';

      try {
        const otpCode = this.otp.join('');
        
        const response = await fetch(this.$store.state.root_api + "Auth/api/verify-otp/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: this.personalInfo.email,
            otp: otpCode
          })
        });

        const data = await response.json();

        if (!response.ok) {
          this.otpError = data.message || "Invalid OTP. Please try again.";
          this.$notification.error({
            message: "Verification Failed",
            description: data.message || "Invalid OTP. Please try again.",
            placement: 'bottomLeft'
          });
          
          // Clear OTP inputs on error
          this.otp = ['', '', '', '', '', ''];
          this.otpInputs[0].focus();
          return;
        }

        if (!data.error) {
          this.stopOtpTimer();
          
          this.$notification.success({
            message: "Account Verified Successfully",
            description: data.message || "Your account has been created and verified!",
            placement: 'bottomLeft',
            duration: 4
          });

          // Move to success step
          this.currentStep = 5;
        } else {
          this.otpError = data.message || "Verification failed. Please try again.";
          this.$notification.error({
            message: "Verification Failed",
            description: data.message || "Verification failed. Please try again.",
            placement: 'bottomLeft'
          });
          
          // Clear OTP inputs
          this.otp = ['', '', '', '', '', ''];
          this.otpInputs[0].focus();
        }
      } catch (error) {
        console.error("OTP verification error:", error);
        this.otpError = "Something went wrong. Please try again.";
        this.$notification.error({
          message: "Server Error",
          description: "Something went wrong. Please try again.",
          placement: 'bottomLeft'
        });
      } finally {
        this.verifyingOtp = false;
      }
    },
    
    async resendOtp() {
      this.resendingOtp = true;

      try {
        const response = await fetch(this.$store.state.root_api + "Auth/api/resend-otp/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: this.personalInfo.email
          })
        });

        const data = await response.json();

        if (!response.ok) {
          this.$notification.error({
            message: "Resend Failed",
            description: data.message || "Failed to resend OTP. Please try again.",
            placement: 'bottomLeft'
          });
          return;
        }

        if (!data.error) {
          this.$notification.success({
            message: "OTP Sent",
            description: data.message || "A new OTP has been sent to your email.",
            placement: 'bottomLeft',
            duration: 4
          });

          // Reset OTP inputs and timer
          this.otp = ['', '', '', '', '', ''];
          this.otpError = '';
          this.otpInputs[0].focus();
          this.stopOtpTimer();
          this.otpTimer = 600;
          this.canResendOtp = false;
          this.startOtpTimer();
        } else {
          this.$notification.error({
            message: "Resend Failed",
            description: data.message || "Failed to resend OTP. Please try again.",
            placement: 'bottomLeft'
          });
        }
      } catch (error) {
        console.error("Resend OTP error:", error);
        this.$notification.error({
          message: "Server Error",
          description: "Something went wrong. Please try again.",
          placement: 'bottomLeft'
        });
      } finally {
        this.resendingOtp = false;
      }
    },
    
    startOtpTimer() {
      this.canResendOtp = false;
      this.otpTimerInterval = setInterval(() => {
        this.otpTimer--;
        
        // Enable resend after 2 minutes
        if (this.otpTimer === 480) {
          this.canResendOtp = true;
        }
        
        if (this.otpTimer <= 0) {
          this.stopOtpTimer();
          this.canResendOtp = true;
          this.$notification.warning({
            message: "OTP Expired",
            description: "Your OTP has expired. Please request a new one.",
            placement: 'bottomLeft',
            duration: 5
          });
        }
      }, 1000);
    },
    
    stopOtpTimer() {
      if (this.otpTimerInterval) {
        clearInterval(this.otpTimerInterval);
        this.otpTimerInterval = null;
      }
    },
    
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    goToLogin() {
      this.$emit('switch-to-login');
      this.$router.push('/login')
    },
    
    validateEmail(email) {
      if (!email) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.trim());
    },
    
    validatePassword(password) {
      // Commented out for easier testing, uncomment in production
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
  },
  
  beforeUnmount() {
    this.stopOtpTimer();
  }
}
</script>

<style scoped>
.signup-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
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
  width: 100%;
  background: white;
  border-radius: 24px;
  padding: 40px 20px 10px 10px;
}

.professional-upload .step-content {
  max-width: 500px;
}

.step-header {
  margin-bottom: 16px;
  margin-left:60px;
  text-align: left;
}

.step-header h2 {
  color: #1a1a1a;
  font-size: 20px;
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
  gap: 10px;
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

.custom-input.input-error {
  border-color: #ff4d4f;
  background: #fff2f0;
}

.custom-input.input-error:focus {
  box-shadow: 0 0 0 3px rgba(255, 77, 79, 0.1);
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.error-message.text-center {
  text-align: center;
  margin-top: 12px;
}

.password-feedback {
  font-size: 12px;
  margin-top: 4px;
}

.password-error {
  color: #ff4d4f;
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

.upload-section {
  margin-bottom: 20px;
}

.upload-placeholder {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  background: #fafbfc;
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

/* OTP Section Styles */
.otp-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
}

.otp-inputs {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.otp-input {
  width: 50px;
  height: 56px;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #f9fafb;
  transition: all 0.2s ease;
  outline: none;
}

.otp-input:focus {
  border-color: #3B63FB;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 99, 251, 0.1);
}

.otp-input.input-error {
  border-color: #ff4d4f;
  background: #fff2f0;
}

.otp-timer {
  text-align: center;
  padding: 12px 20px;
  background: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #bae6fd;
}

.otp-timer p {
  margin: 0;
  color: #0369a1;
  font-size: 14px;
  font-weight: 500;
}

.resend-section {
  text-align: center;
  margin-top: 10px;
}

.resend-section p {
  margin: 0 0 8px 0;
  color: #6b7280;
  font-size: 14px;
}

.resend-link {
  color: #3B63FB;
  font-weight: 600;
  padding: 0;
  height: auto;
}

.resend-link:hover {
  color: #1677ff;
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
  
  .step-header {
    margin-left: 0;
  }
  
  .step-header h2 {
    font-size: 22px;
  }
  
  .otp-input {
    width: 45px;
    height: 50px;
    font-size: 20px;
  }
  
  .otp-inputs {
    gap: 8px;
  }
}
</style>