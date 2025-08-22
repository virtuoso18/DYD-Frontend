<template>
  <div class="dashboard-container">
    <!-- Main Dashboard Content -->
    <a-row class="dashboard-content">
      <!-- Content Area -->
      <a-col :xs="24" :sm="24" :md="24" :lg="24" class="content-area">
        <div class="content-wrapper">
          <!-- Wavy Background Header -->
          <div class="wavy-header">
  <!-- Profile Avatar in Header -->
  <div class="header-profile">
    <div class="header-avatar">
      <img src="https://static.vecteezy.com/system/resources/previews/036/744/532/non_2x/user-profile-icon-symbol-template-free-vector.jpg" alt="John Doe" />
      <div class="camera-icon" @click="handleCameraClick">
        <!-- SVG -->
         <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
<path opacity="0.5" d="M9.77778 21H14.2222C17.3433 21 18.9038 21 20.0248 20.2646C20.51 19.9462 20.9267 19.5371 21.251 19.0607C22 17.9601 22 16.4279 22 13.3636C22 10.2994 22 8.76721 21.251 7.6666C20.9267 7.19014 20.51 6.78104 20.0248 6.46268C19.3044 5.99013 18.4027 5.82123 17.022 5.76086C16.3631 5.76086 15.7959 5.27068 15.6667 4.63636C15.4728 3.68489 14.6219 3 13.6337 3H10.3663C9.37805 3 8.52715 3.68489 8.33333 4.63636C8.20412 5.27068 7.63685 5.76086 6.978 5.76086C5.59733 5.82123 4.69555 5.99013 3.97524 6.46268C3.48995 6.78104 3.07328 7.19014 2.74902 7.6666C2 8.76721 2 10.2994 2 13.3636C2 16.4279 2 17.9601 2.74902 19.0607C3.07328 19.5371 3.48995 19.9462 3.97524 20.2646C5.09624 21 6.65675 21 9.77778 21Z" stroke="#1C274C" stroke-width="1.5"/>
<path d="M14.5197 10.6799L14.2397 10.4C13.0026 9.16288 10.9969 9.16288 9.75984 10.4C8.52276 11.637 8.52276 13.6427 9.75984 14.8798C10.9969 16.1169 13.0026 16.1169 14.2397 14.8798C14.7665 14.353 15.069 13.6868 15.1471 13M14.5197 10.6799L13 11M14.5197 10.6799V9" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

      </div>
    </div>
  </div>
</div>

          
          <!-- Personal Information Section -->
          <div class="personal-info-section">
            <div class="section-header">
              <h2>Personal Information</h2>
              <button class="edit-btn" @click="toggleEdit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89783 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ isEditing ? 'Save' : 'Edit' }}
              </button>
            </div>
            
            <div class="form-section">
              <div class="form-group">
                <label>Name</label>
                <div class="input-wrapper">
                  <input 
                    type="text" 
                    v-model="userInfo.name" 
                    :readonly="!isEditing"
                    :class="{ 'editable': isEditing }"
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label>About</label>
                <div class="input-wrapper">
                  <textarea 
                    v-model="userInfo.about" 
                    :readonly="!isEditing"
                    :class="{ 'editable': isEditing }"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          <!-- This router-view will render the active child route component -->
          <router-view />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'DashboardManager',
  data() {
    return {
      isEditing: false,
      userInfo: {
        name: 'John Doe',
        about: 'Welcome to John, your go-to lighting store specializing in advanced lighting solutions for homes and businesses. With 14 years of experience in the industry, we offer a wide range of unique and stylish lighting fixtures, along with professional consultation services to bring your design vision to life.'
      }
    }
  },
  computed: {
    currentRouteName() {
      return this.$route.name
    }
  },
  methods: {
    toggleEdit() {
      this.isEditing = !this.isEditing
    },
    handleCameraClick() {
      // Handle camera/avatar upload functionality
      console.log('Camera clicked - implement file upload')
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.dashboard-content {
  background: #f8f9fa;
  min-height: 100vh;
}

.content-area {
  padding: 10px;
}

.content-wrapper {
  background: white;
  min-height: 93vh;

  border-radius: 24px;
  /* margin: 20px; */
  /* box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); */
  border: 1px solid #e9ecef;
  overflow: hidden;
}
.wavy-header {
  position: relative;
  height: 200px;
  background: url("../../../assets/pricing-banner.png") center/cover no-repeat;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}

.header-profile {
  position: absolute;
  bottom: -40px;
  left: 40px;
  z-index: 20; /* ensure it always floats above */
}

.header-avatar {
  position: relative;
  width: 100px;
  height: 100px;
}

.header-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #fff;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}


.wave-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.header-profile {
  position: absolute;
  bottom: -40px;
  left: 40px;
  z-index: 10;
}

.header-avatar {
  position: relative;
  width: 150px;
  height: 150px;
}

.header-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.camera-icon {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: #eaf2ff;
  border: 2px solid white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.camera-icon:hover {
  background: #9ac4fe;
  transform: scale(1.1);
}

.personal-info-section {
  padding: 60px 40px 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.section-header h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #3b82f6;
  font-weight: 500;
  cursor: pointer;
  padding: 10px 18px;
  border-radius: 12px;
  transition: all 0.2s ease;
  font-size: 14px;
}

.edit-btn:hover {
  background: #eff6ff;
  color: #2563eb;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 15px;
  margin-bottom: 2px;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input,
.input-wrapper textarea {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 15px;
  background: #f9fafb;
  color: #6b7280;
  resize: none;
  box-sizing: border-box;
  transition: all 0.3s ease;
  line-height: 1.5;
}

.input-wrapper textarea {
  min-height: 120px;
}

.input-wrapper input.editable,
.input-wrapper textarea.editable {
  background: white;
  border-color: #3b82f6;
  color: #1f2937;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-wrapper input:focus,
.input-wrapper textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: white;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content-wrapper {
    margin: 10px;
    border-radius: 20px;
  }
  
  .personal-info-section {
    padding: 60px 24px 24px;
  }
  
  .header-profile {
    left: 24px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .section-header h2 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .personal-info-section {
    padding: 60px 16px 20px;
  }
  
  .header-profile {
    left: 16px;
  }
  
  .header-avatar {
    width: 70px;
    height: 70px;
  }
  
  .camera-icon {
    width: 24px;
    height: 24px;
  }
  
  .camera-icon svg {
    width: 12px;
    height: 12px;
  }
}
</style>