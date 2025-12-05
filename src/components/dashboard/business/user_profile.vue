<template>
<div class="main sm:py-3 min-h-[100vh] md:min-h-[136vh] xl:min-h-[170vh] 2xl:min-h-[150vh]">    
    <!-- Main Dashboard Content -->
    <a-row class="dashboard-content ">
      <!-- Content Area -->
      <a-col :xs="24" :sm="24" :md="24" :lg="24" class="content-area">
        <div class="sm:content-wrapper">
          <!-- Wavy Background Header -->
          <div class="wavy-header sm:rounded-t-3xl" :style="'background: url('+this.$store.state.root_media_api+profile.background_picture+') center/cover no-repeat;'">
            <!-- Background Edit Button -->
           <button 
  v-if="isEditing"
  @click="handleBackgroundClick"
  class="absolute top-5 left-5 bg-blue-600 hover:bg-blue-700 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-md transition"
>
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path 
      d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89783 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</button>

            
            <!-- Profile Avatar in Header -->
            <div class="header-profile">
              <div class="header-avatar">
                <img :src="this.$store.state.root_media_api+profile.profile_picture" alt="Profile Picture" />
                <button
  v-if="isEditing"
  @click="handleCameraClick"
  class="camera-icon bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-md transition"
>
  <!-- SVG -->
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path opacity="0.5" d="M9.77778 21H14.2222C17.3433 21 18.9038 21 20.0248 20.2646C20.51 19.9462 20.9267 19.5371 21.251 19.0607C22 17.9601 22 16.4279 22 13.3636C22 10.2994 22 8.76721 21.251 7.6666C20.9267 7.19014 20.51 6.78104 20.0248 6.46268C19.3044 5.99013 18.4027 5.82123 17.022 5.76086C16.3631 5.76086 15.7959 5.27068 15.6667 4.63636C15.4728 3.68489 14.6219 3 13.6337 3H10.3663C9.37805 3 8.52715 3.68489 8.33333 4.63636C8.20412 5.27068 7.63685 5.76086 6.978 5.76086C5.59733 5.82123 4.69555 5.99013 3.97524 6.46268C3.48995 6.78104 3.07328 7.19014 2.74902 7.6666C2 8.76721 2 10.2994 2 13.3636C2 16.4279 2 17.9601 2.74902 19.0607C3.07328 19.5371 3.48995 19.9462 3.97524 20.2646C5.09624 21 6.65675 21 9.77778 21Z" 
      stroke="currentColor" stroke-width="2.5"/>
    <path d="M14.5197 10.6799L14.2397 10.4C13.0026 9.16288 10.9969 9.16288 9.75984 10.4C8.52276 11.637 8.52276 13.6427 9.75984 14.8798C10.9969 16.1169 13.0026 16.1169 14.2397 14.8798C14.7665 14.353 15.069 13.6868 15.1471 13M14.5197 10.6799L13 11M14.5197 10.6799V9" 
      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>

              </div>
            </div>
          </div>
          
          <!-- Personal Information Section -->
          <div class="personal-info-section ">
            <div class="section-header">
              <h2>Personal Information</h2>
              <button class="edit-btn" @click="toggleEdit" :disabled="loading">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89783 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ loading ? 'Updating...' : (isEditing ? 'Save' : 'Edit') }}
              </button>
            </div>
            
            <div class="form-section">
              <!-- Name Form Group -->
              <div class="form-group">
                <label>Name</label>
                <div class="input-wrapper">
                  <!-- Show full name when not editing -->
                  <input 
                    v-if="!isEditing"
                    type="text" 
                    :value="user_info.full_name" 
                    readonly
                  />
                  <!-- Show separate first_name and last_name when editing -->
                  <div v-else class="name-fields">
                    <input 
                      type="text" 
                      v-model="user_info.first_name" 
                      placeholder="First Name"
                      class="editable"
                    />
                    <input 
                      type="text" 
                      v-model="user_info.last_name" 
                      placeholder="Last Name"
                      class="editable"
                    />
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label>About</label>
                <div class="input-wrapper">
                  <textarea 
                    v-model="profile.about" 
                    :readonly="!isEditing"
                    :class="{ 'editable': isEditing }"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Hidden file inputs -->
          <input 
            ref="profilePictureInput" 
            type="file" 
            accept="image/*" 
            style="display: none" 
            @change="handleProfilePictureChange"
          />
          <input 
            ref="backgroundPictureInput" 
            type="file" 
            accept="image/*" 
            style="display: none" 
            @change="handleBackgroundPictureChange"
          />
          
          <!-- This router-view will render the active child route component -->
          <router-view />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { notification } from 'ant-design-vue';

export default {
  name: 'user_profile',
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
      isEditing: false,
      loading: false,
      user_info: { ...this.user }, // Create a copy to avoid mutating props directly
      selectedProfilePicture: null,
      selectedBackgroundPicture: null
    }
  },
  computed: {
    currentRouteName() {
      return this.$route.name
    }
  },
  methods: {
    async toggleEdit() {
      if (this.isEditing) {
        // When saving, update profile
        await this.updateProfile();
      } else {
        // When starting edit, reset any selected files
        this.selectedProfilePicture = null;
        this.selectedBackgroundPicture = null;
      }
      
      if (!this.loading) {
        this.isEditing = !this.isEditing;
      }
    },

    async updateProfile() {
      this.loading = true;
      
      try {
        // Create FormData for file uploads
        const formData = new FormData();
        
        // Add text fields
        if (this.user_info.first_name) {
          formData.append('first_name', this.user_info.first_name);
        }
        if (this.user_info.last_name) {
          formData.append('last_name', this.user_info.last_name);
        }
        if (this.profile.about) {
          formData.append('about', this.profile.about);
        }
        
        // Add files if selected
        if (this.selectedProfilePicture) {
          formData.append('profile_picture', this.selectedProfilePicture);
        }
        if (this.selectedBackgroundPicture) {
          formData.append('background_picture', this.selectedBackgroundPicture);
        }

        const response = await fetch(this.$store.state.root_api + "Auth/api/edit-profile/", {
          method: "POST",
          headers: {
            "Authorization": `Token ${localStorage.getItem('token')}`
          },
          body: formData
        });

        const data = await response.json();

        if (!response.ok) {
          notification.error({
            message: "Profile Update Failed",
            description: data.message || "Unable to update profile."
          });
          return;
        }

        if (!data.error) {
          // Update localStorage with new data
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("profile", JSON.stringify(data.profile));
          
          if (data.user.is_business && data.business_profile) {
            localStorage.setItem("business_profile", JSON.stringify(data.business_profile));
          }

          // Update local data
          this.user_info = { ...data.user };
          
          // Update profile data in parent component (emit or update props if needed)
          this.$emit('profile-updated', {
            user: data.user,
            profile: data.profile,
            business_profile: data.business_profile || null
          });

          // Update full_name from response
          this.user_info.full_name = data.user.full_name;

          notification.success({
            message: "Profile Updated",
            description: "Your profile has been successfully updated!",
            placement: 'bottomRight'
          });

          // Clear selected files
          this.selectedProfilePicture = null;
          this.selectedBackgroundPicture = null;
        } else {
          notification.error({
            message: "Update Failed",
            description: data.message || "Something went wrong."
          });
        }

      } catch (error) {
        console.error("Profile update error:", error);
        notification.error({
          message: "Server Error",
          description: "Something went wrong. Please try again."
        });
      } finally {
        this.loading = false;
      }
    },

    handleCameraClick() {
      // Trigger profile picture file input
      this.$refs.profilePictureInput.click();
    },

    handleBackgroundClick() {
      // Trigger background picture file input
      this.$refs.backgroundPictureInput.click();
    },

    handleProfilePictureChange(event) {
      const file = event.target.files[0];
      if (file) {
        // Validate file size (optional - e.g., max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          notification.error({
            message: "File Too Large",
            description: "Profile picture must be less than 5MB."
          });
          return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          notification.error({
            message: "Invalid File Type",
            description: "Please select an image file."
          });
          return;
        }

        this.selectedProfilePicture = file;
        
        // Preview the image
        const reader = new FileReader();
        reader.onload = (e) => {
          // Update the profile picture preview
          const imgElement = document.querySelector('.header-avatar img');
          if (imgElement) {
            imgElement.src = e.target.result;
          }
        };
        reader.readAsDataURL(file);

        // notification.success({
        //   message: "Profile Picture Selected",
        //   description: "Click Save to update your profile picture.",
        //   placement: 'bottomRight'
        // });
      }
    },

    handleBackgroundPictureChange(event) {
      const file = event.target.files[0];
      if (file) {
        // Validate file size (optional - e.g., max 10MB for background)
        if (file.size > 10 * 1024 * 1024) {
          notification.error({
            message: "File Too Large",
            description: "Background picture must be less than 10MB."
          });
          return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          notification.error({
            message: "Invalid File Type",
            description: "Please select an image file."
          });
          return;
        }

        this.selectedBackgroundPicture = file;
        
        // Preview the image
        const reader = new FileReader();
        reader.onload = (e) => {
          // Update the background preview
          const headerElement = document.querySelector('.wavy-header');
          if (headerElement) {
            headerElement.style.background = `url(${e.target.result}) center/cover no-repeat`;
          }
        };
        reader.readAsDataURL(file);

        // notification.success({
        //   message: "Background Picture Selected",
        //   description: "Click Save to update your background picture.",
        //   placement: 'bottomRight'
        // });
      }
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


@media (min-width: 768px) {
  .content-wrapper {
    background: white;
    min-height: 93vh;
    border-radius: 24px;
    border: 1px solid #e9ecef;
    overflow: hidden;
  }
}
.wavy-header {
  position: relative;
  height: 200px;
  background: url("../../../assets/pricing-banner.png") center/cover no-repeat;
  
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
  /* background: #eaf2ff; */
  border: 2px solid white;
  border-radius: 50%;
  /* width: 28px;
  height: 28px; */
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

.name-fields {
  display: flex;
  gap: 12px;
  width: 100%;
}

.name-fields input {
  flex: 1;
  min-width: 0; /* Ensures equal width distribution */
}
</style>