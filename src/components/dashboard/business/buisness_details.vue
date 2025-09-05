<template>
  <div class="business-details-container">
    <a-row class="main-content">
      <a-col :xs="24" :sm="24" :md="24" :lg="24" class="content-area">
        <div class="content-wrapper">
          <!-- Header with Furniture Image -->
          <div class="header-banner" :style="'background: url('+this.$store.state.root_api+buisness_info.business_picture+') center/cover no-repeat;'">
            <div class="profile-section">
              <div class="profile-avatar">
                <img   :src="businessInfo.avatar"  alt="Business Avatar" />
                <div class="camera-overlay" @click="handleAvatarUpload">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path opacity="0.5" d="M9.77778 21H14.2222C17.3433 21 18.9038 21 20.0248 20.2646C20.51 19.9462 20.9267 19.5371 21.251 19.0607C22 17.9601 22 16.4279 22 13.3636C22 10.2994 22 8.76721 21.251 7.6666C20.9267 7.19014 20.51 6.78104 20.0248 6.46268C19.3044 5.99013 18.4027 5.82123 17.022 5.76086C16.3631 5.76086 15.7959 5.27068 15.6667 4.63636C15.4728 3.68489 14.6219 3 13.6337 3H10.3663C9.37805 3 8.52715 3.68489 8.33333 4.63636C8.20412 5.27068 7.63685 5.76086 6.978 5.76086C5.59733 5.82123 4.69555 5.99013 3.97524 6.46268C3.48995 6.78104 3.07328 7.19014 2.74902 7.6666C2 8.76721 2 10.2994 2 13.3636C2 16.4279 2 17.9601 2.74902 19.0607C3.07328 19.5371 3.48995 19.9462 3.97524 20.2646C5.09624 21 6.65675 21 9.77778 21Z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M14.5197 10.6799L14.2397 10.4C13.0026 9.16288 10.9969 9.16288 9.75984 10.4C8.52276 11.637 8.52276 13.6427 9.75984 14.8798C10.9969 16.1169 13.0026 16.1169 14.2397 14.8798C14.7665 14.353 15.069 13.6868 15.1471 13M14.5197 10.6799L13 11M14.5197 10.6799V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
 <!-- {{ user }} -->
    <!-- <br> -->
<!-- {{profile}} -->
<!-- <br>
{{ this.$store.state.root_api+buisness_info.business_picture }}
{{buisness_info}} -->
          <!-- Business Details Form -->
          <div class="business-details-section" style="margin-top:100px;">
            <div class="section-header">
              <h2>Business Detail</h2>
              <a-button 
                type="text" 
                class="edit-button" 
                @click="toggleEditMode"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89783 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Edit
              </a-button>
            </div>

            <a-form layout="vertical" class="business-form">
              <a-row :gutter="[24, 24]">
                <!-- Name Field -->
                <a-col :xs="24" :sm="24" :md="24" :lg="24">
                  <a-form-item label="Name">
                    <a-input 
                      v-model:value="businessInfo.name"
                      :disabled="!isEditMode"
                      placeholder="Business name"
                      class="form-input"
                    />
                  </a-form-item>
                </a-col>

                <!-- Email Field -->
                <a-col :xs="24" :sm="24" :md="24" :lg="24">
                  <a-form-item label="Email">
                    <a-input 
                      v-model:value="businessInfo.email"
                      :disabled="!isEditMode"
                      placeholder="john@example.com"
                      class="form-input"
                    />
                  </a-form-item>
                </a-col>

                <!-- Phone Number Field -->
                <a-col :xs="24" :sm="24" :md="24" :lg="24">
                  <a-form-item label="Phone Number">
                    <a-input 
                      v-model:value="businessInfo.phone"
                      :disabled="!isEditMode"
                      placeholder="+91 9876543210"
                      class="form-input"
                    />
                  </a-form-item>
                </a-col>

                <!-- Description Field -->
                <a-col :xs="24" :sm="24" :md="24" :lg="24">
                  <a-form-item label="Description">
                    <a-textarea 
                      v-model:value="businessInfo.description"
                      :disabled="!isEditMode"
                      :rows="4"
                      placeholder="Tell us about your business..."
                      class="form-textarea"
                    />
                  </a-form-item>
                </a-col>

                <!-- What Do We Offer Field -->
                <a-col :xs="24" :sm="24" :md="24" :lg="24">
                  <a-form-item label="What Do We Offer?">

                    <a-textarea 
                      v-model:value="businessInfo.services"
                      :disabled="!isEditMode"
                    :rows="12" 
                      placeholder="List your services and offerings..."
                      class="form-textarea"
                    />
                  </a-form-item>
                </a-col>

                <!-- Social Handles -->
                <a-col :xs="24" :sm="24" :md="24" :lg="24">
                  <a-form-item label="Social Handles">
                    <div class="social-handles">
                      <div class="social-input-group">
                        <div class="social-icon whatsapp">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63"/>
                          </svg>
                        </div>
                        <a-input 
                          v-model:value="businessInfo.whatsapp"
                          :disabled="!isEditMode"
                          placeholder="https://wa.me/..."
                          class="social-input"
                        />
                      </div>
                      <div class="social-input-group">
                        <div class="social-icon instagram">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </div>
                        <a-input 
                          v-model:value="businessInfo.instagram"
                          :disabled="!isEditMode"
                          placeholder="https://instagram.com/..."
                          class="social-input"
                        />
                      </div>
                      <div class="social-input-group">
                        <div class="social-icon facebook">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </div>
                        <a-input 
                          v-model:value="businessInfo.facebook"
                          :disabled="!isEditMode"
                          placeholder="https://facebook.com/..."
                          class="social-input"
                        />
                      </div>
                      <a-button type="link" class="add-social-btn" v-if="isEditMode">Add</a-button>
                    </div>
                  </a-form-item>
                </a-col>

                <!-- Website Link -->
                <a-col :xs="24" :sm="24" :md="12" :lg="12">
                  <a-form-item label="Website Link">
                    <a-input 
                      v-model:value="businessInfo.website"
                      :disabled="!isEditMode"
                      placeholder="https://..."
                      class="form-input"
                    />
                  </a-form-item>
                </a-col>

                <!-- Cart Link -->
                <a-col :xs="24" :sm="24" :md="12" :lg="12">
                  <a-form-item label="Cart Link">
                    <a-input 
                      v-model:value="businessInfo.cartLink"
                      :disabled="!isEditMode"
                      placeholder="https://..."
                      class="form-input"
                    />
                  </a-form-item>
                </a-col>
              </a-row>

              <!-- Save Button (only show when editing) -->
              <div v-if="isEditMode" class="form-actions">
                <a-button type="primary" @click="saveChanges" class="save-btn">
                  Save Changes
                </a-button>
                <a-button @click="cancelEdit" class="cancel-btn">
                  Cancel
                </a-button>
              </div>
            </a-form>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'BusinessDetails',
  props: {
    user: {
      type: Object,
      required: true
    },
    profile: {
      type: Object,
      required: true
    },
    buisness_info: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isEditMode: false,
      businessInfo: {
        name: this.buisness_info.name ||  "",
        email: this.buisness_info.email,
        phone: this.buisness_info.phone_number,
        avatar: this.$store.state.root_api+this.buisness_info.banner_picture,
        description:  this.buisness_info.description,
        services:  this.buisness_info.services,
        whatsapp: 'https://wa.me/'+this.buisness_info.whatsapp_number,
        instagram: 'https://instagram.com/'+this.buisness_info.instagram_url,
        facebook: 'https://facebook.com/'+this.buisness_info.facebook_url,
        website: 'https://'+this.buisness_info.website_url,
        cartLink: 'https://'
      },
      originalBusinessInfo: {}
    }
  },
  methods: {
    toggleEditMode() {
      if (!this.isEditMode) {
        // Store original data before editing
        this.originalBusinessInfo = { ...this.businessInfo };
      }
      this.isEditMode = !this.isEditMode;
    },
    saveChanges() {
      // Here you would typically make an API call to save the data
      this.isEditMode = false;
      this.$message.success('Business details updated successfully!');
    },
    cancelEdit() {
      // Restore original data
      this.businessInfo = { ...this.originalBusinessInfo };
      this.isEditMode = false;
    },
    handleAvatarUpload() {
      // Handle avatar upload functionality
      console.log('Avatar upload clicked');
      // You can implement file upload logic here
    }
  }
}
</script>

<style scoped>
* {
    font-family: Poppins;
}
.business-details-container {
  min-height: 100vh;
  
  /* background: #f5f5f5; */
  border:1px soild rgba(128, 128, 128, 0.997);
  padding: 20px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.content-wrapper {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  /* box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); */
}

.header-banner {
  height: 200px;
  background: linear-gradient(135deg, #f0f4f8 0%, #e8f0fe 100%);
  /* background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 200"><path d="M0,100 C300,20 600,180 900,60 C1050,10 1150,80 1200,40 L1200,0 L0,0 Z" fill="rgba(255,255,255,0.1)"/></svg>'); */
  background-color: red;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background-color: red; */
  /* background-image: url('../../../assets/pricing-banner.png'); */
background-size: cover;
  /* background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="50" opacity="0.1">🛋️</text></svg>') center/contain no-repeat; */
  pointer-events: none;
}

.profile-section {
  position: absolute;
  bottom: -50px;
  left: 40px;
}

.profile-avatar {
  position: relative;
  width: 100px;
  height: 100px;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.camera-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  background: #1890ff;
  border: 3px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.camera-overlay svg {
  color: white;
}

.camera-overlay:hover {
  background: #40a9ff;
  transform: scale(1.1);
}

.business-details-section {
  /* padding: 70px 40px 40px; */
  width:800px;
  margin:auto
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
  color: #1f2937;
}

.edit-button {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1890ff;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.edit-button:hover {
  background: #f0f9ff;
  color: #0969da;
}

.business-form {
  max-width: 100%;
}


.form-input,
.form-textarea {
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

.form-input:focus,
.form-textarea:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.form-input:disabled,
.form-textarea:disabled {
  background: #fafafa;
  color: #666;
}

.social-handles {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.social-input-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.social-icon.whatsapp {
  background: #25d366;
}

.social-icon.instagram {
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
}

.social-icon.facebook {
  background: #1877f2;
}

.social-input {
  flex: 1;
  border-radius: 8px;
}

.add-social-btn {
  color: #1890ff;
  padding: 0;
  height: auto;
  font-weight: 500;
}

.form-actions {
  margin-top: 32px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.save-btn {
  background: #1890ff;
  border-color: #1890ff;
  border-radius: 8px;
  height: 40px;
  padding: 0 24px;
  font-weight: 500;
}

.cancel-btn {
  border-radius: 8px;
  height: 40px;
  padding: 0 24px;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .business-details-container {
    padding: 10px;
  }
  
  .business-details-section {
    padding: 70px 24px 24px;
  }
  
  .profile-section {
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
  
  .form-actions {
    justify-content: stretch;
  }
  
  .save-btn,
  .cancel-btn {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .business-details-section {
    padding: 70px 16px 20px;
  }
  
  .profile-section {
    left: 16px;
  }
  
  .profile-avatar {
    width: 80px;
    height: 80px;
  }
  
  .camera-overlay {
    width: 28px;
    height: 28px;
  }
  
  .social-input-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .social-icon {
    width: 100%;
    height: 40px;
    border-radius: 8px 8px 0 0;
  }
  
  .social-input {
    border-radius: 0 0 8px 8px;
    border-top: none;
  }
}

/* Ant Design overrides */
:deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: #374151;
}

:deep(.ant-input:disabled) {
  background: #fafafa;
  color: #666;
}

:deep(.ant-input:focus) {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}
</style>