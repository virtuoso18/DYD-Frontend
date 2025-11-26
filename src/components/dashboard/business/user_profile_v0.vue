<template>
  <div class=" md:p-4 rounded-md  min-h-screen bg-[#f8f9fa]">
    <!-- Main Dashboard Content -->
    <div class="bg-[#f8f9fa] min-h-screen">
      
      <!-- Content Area -->
      <div class="shadow-md">
        <div class=" min-h-[93vh]  overflow-hidden">
          
          <!-- Wavy Background Header -->
       <div
            class="relative h-[200px] bg-cover shadow-emerald-600 rounded-lg bg-no-repeat header-avatar"
          >

          <img :src="this.$store.state.root_media_api+profile.profile_picture" alt="Profile Picture" />
                <!-- <a-button  v-if="isEditing" type="primary" shape="circle" class="camera-icon" @click="handleCameraClick"> -->
            <!-- Background Edit Button -->
            <button 
              v-if="isEditing"
              @click="handleBackgroundClick"
              class="absolute top-5 left-5 w-10 h-10 rounded-full bg-[#3b82f6] text-white flex items-center justify-center hover:bg-[#2563eb] transition-colors shadow-md"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4C3.47 4 2.96 4.21 2.59 4.59C2.21 4.96 2 5.47 2 6V20C2 20.53 2.21 21.04 2.59 21.41C2.96 21.79 3.47 22 4 22H18C18.53 22 19.04 21.79 19.41 21.41C19.79 21.04 20 20.53 20 20V13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.5 2.5C18.9 2.1 19.44 1.88 20 1.88C20.56 1.88 21.1 2.1 21.5 2.5C21.9 2.9 22.12 3.44 22.12 4C22.12 4.56 21.9 5.1 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <!-- Profile Avatar -->
                 <div class="absolute left-1/2 md:left-1/8 transform -translate-x-1/2 md:translate-x-0 bottom-0 translate-y-1/2 flex justify-center items-center z-20">
                  <div class="relative w-[100px] h-[100px]">
                      <img 
                            :src="this.$store.state.root_media_api + profile.profile_picture" 
                             alt="Profile Picture"
                                  class="w-full h-full rounded-full border-4 border-white object-cover shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                                />

  <!-- SVG half outside bottom -->
  <div class="absolute left-1/2 -bottom-4 transform -translate-x-1/2">
    <svg width="48" height="48" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="37.8889" height="37.8889" rx="18.9444" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M16.3641 29.3333H21.5241C25.148 29.3333 26.9605 29.3333 28.2621 28.4849C28.8238 28.1191 29.3076 27.6469 29.6856 27.0951C30.5553 25.8253 30.5553 24.0558 30.5553 20.5189C30.5553 16.9821 30.5553 15.2125 29.6856 13.9428C29.3076 13.391 28.8238 12.9188 28.2621 12.553C27.4261 12.007 26.3787 11.8119 24.7752 11.7427C24.0101 11.7427 23.3517 11.1771 23.2019 10.4441C23.0875 9.90715 22.7901 9.42599 22.36 9.08191C21.9299 8.73782 21.3934 8.55191 20.8414 8.5556H17.0469C15.8997 8.5556 14.9116 9.3463 14.6863 10.4441C14.5366 11.1771 13.8782 11.7427 13.113 11.7427C11.5107 11.8119 10.4634 12.0082 9.6262 12.553C9.06485 12.9189 8.58152 13.3911 8.20384 13.9428C7.33301 15.2125 7.33301 16.981 7.33301 20.5189C7.33301 24.0569 7.33301 25.8242 8.20268 27.0951C8.57888 27.6446 9.0619 28.1167 9.6262 28.4849C10.9278 29.3333 12.7403 29.3333 16.3641 29.3333ZM18.9441 15.7966C16.2724 15.7966 14.1058 17.9102 14.1058 20.5178C14.1058 23.1254 16.2736 25.2424 18.9441 25.2424C21.6147 25.2424 23.7825 23.1277 23.7825 20.5201C23.7825 17.9125 21.6147 15.7966 18.9441 15.7966ZM18.9441 17.6851C17.3418 17.6851 16.0414 18.9537 16.0414 20.5189C16.0414 22.083 17.3418 23.3516 18.9441 23.3516C20.5465 23.3516 21.8469 22.083 21.8469 20.5189C21.8469 18.9548 20.5465 17.6851 18.9441 17.6851ZM24.4269 16.7409C24.4269 16.2191 24.86 15.7966 25.3953 15.7966H26.6841C27.2182 15.7966 27.6525 16.2191 27.6525 16.7409C27.65 16.9935 27.5468 17.2349 27.3654 17.412C27.1841 17.589 26.9394 17.6873 26.6853 17.6851H25.3953C25.2693 17.6863 25.1444 17.6629 25.0275 17.6161C24.9107 17.5693 24.8043 17.5001 24.7144 17.4124C24.6244 17.3247 24.5528 17.2203 24.5035 17.105C24.4541 16.9898 24.4281 16.8661 24.4269 16.7409Z" fill="#333333"/>
    </svg>
  </div>
</div>

            </div>
          </div>
          
          <!-- Personal Information Section -->
          <div class="pt-[60px] px-10 pb-10">
            <!-- Section Header -->
            <div class="flex flex-row justify-between md:items-center gap-4 py-6">
<h2 class="m-0 text-[16px] leading-[24px] font-[500] font-[Poppins] text-[#1a1a1a] tracking-[0]">
  Personal Information
</h2>
<h3>

  <button 
    @click="toggleEdit"
    :disabled="loading"
    class="flex items-center gap-2 bg-none border-none !text-[#3b82f6] !font-medium cursor-pointer px-4.5 py-2.5 rounded-2xl transition-all hover:bg-[#eff6ff] hover:text-[#2563eb] disabled:opacity-50 text-sm"
  >
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.44444 11.5556H2.47361L9.53333 4.49583L8.50417 3.46667L1.44444 10.5264V11.5556ZM0.722222 13C0.517593 13 0.346185 12.9307 0.208 12.792C0.0698149 12.6533 0.000481481 12.4819 0 12.2778V10.5264C0 10.3338 0.0361112 10.1501 0.108333 9.97533C0.180556 9.80056 0.28287 9.6472 0.415278 9.51528L9.53333 0.415278C9.67778 0.28287 9.83739 0.180556 10.0122 0.108333C10.1869 0.0361112 10.3704 0 10.5625 0C10.7546 0 10.9412 0.0361112 11.1222 0.108333C11.3033 0.180556 11.4597 0.288889 11.5917 0.433333L12.5847 1.44444C12.7292 1.57685 12.8344 1.73333 12.9003 1.91389C12.9663 2.09444 12.9995 2.275 13 2.45556C13 2.64815 12.9668 2.83183 12.9003 3.00661C12.8339 3.18139 12.7287 3.34076 12.5847 3.48472L3.48472 12.5847C3.35231 12.7171 3.19872 12.8194 3.02394 12.8917C2.84917 12.9639 2.66572 13 2.47361 13H0.722222ZM9.00972 3.99028L8.50417 3.46667L9.53333 4.49583L9.00972 3.99028Z" fill="#3B63FB"/>
</svg>

    {{ loading ? 'Updating...' : (isEditing ? 'Save' : 'Edit') }}
  </button>
</h3>
            </div>
            
            <!-- Form Section -->
            <div class="flex flex-col gap-7">
              <!-- Name Form Group -->
              <div class="flex flex-col gap-2.5">
<label class="font-medium text-[#374151] text-[12px] leading-[20px] font-poppins mb-0.5">
  Name
</label>
                <div class="relative">
                  <!-- Show full name when not editing -->
                  <input 
                    v-if="!isEditing"
                    type="text" 
                    :value="user_info.full_name" 
                    readonly
                    class="w-full px-4.5 py-3.5 border border-[#d1d5db] rounded-2xl text-sm bg-[#f9fafb] text-[#6b7280] resize-none transition-all"
                  />
                  <!-- Show separate first_name and last_name when editing -->
                  <div v-else class="flex gap-3 w-full">
                    <input 
                      type="text" 
                      v-model="user_info.first_name" 
                      placeholder="First Name"
                      class="flex-1 min-w-0 px-4.5 py-3.5 border border-[#3b82f6] rounded-2xl text-sm bg-white text-[#1f2937] resize-none transition-all shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:outline-none focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                    />
                    <input 
                      type="text" 
                      v-model="user_info.last_name" 
                      placeholder="Last Name"
                      class="flex-1 min-w-0 px-4.5 py-3.5 border border-[#3b82f6] rounded-2xl text-sm bg-white text-[#1f2937] resize-none transition-all shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:outline-none focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                    />
                  </div>
                </div>
              </div>
              
              <!-- About Form Group -->
              <div class="flex flex-col gap-2.5">
                <label class="font-semibold text-[#374151] text-sm mb-0.5">About</label>
                <div class="relative">
                  <textarea 
                    v-model="profile.about" 
                    :readonly="!isEditing"
                    :class="{
                      'border-[#3b82f6] bg-white text-[#1f2937] shadow-[0_0_0_3px_rgba(59,130,246,0.1)]': isEditing,
                      'border-[#d1d5db] bg-[#f9fafb] text-[#6b7280]': !isEditing
                    }"
                    class="w-full px-4.5 py-3.5 border rounded-2xl text-sm resize-none transition-all min-h-[120px] focus:outline-none focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:bg-white leading-[1.5]"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          <!-- This router-view will render the active child route component -->
          <router-view />
        </div>
      </div>
    </div>
    
    <!-- Hidden file inputs -->
    <input 
      ref="profilePictureInput" 
      type="file" 
      accept="image/*" 
      class="hidden" 
      @change="handleProfilePictureChange"
    />
    <input 
      ref="backgroundPictureInput" 
      type="file" 
      accept="image/*" 
      class="hidden" 
      @change="handleBackgroundPictureChange"
    />
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
      user_info: { ...this.user },
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
        await this.updateProfile();
      } else {
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
        const formData = new FormData();
        
        if (this.user_info.first_name) {
          formData.append('first_name', this.user_info.first_name);
        }
        if (this.user_info.last_name) {
          formData.append('last_name', this.user_info.last_name);
        }
        if (this.profile.about) {
          formData.append('about', this.profile.about);
        }
        
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
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("profile", JSON.stringify(data.profile));
          
          if (data.user.is_business && data.business_profile) {
            localStorage.setItem("business_profile", JSON.stringify(data.business_profile));
          }

          this.user_info = { ...data.user };
          
          this.$emit('profile-updated', {
            user: data.user,
            profile: data.profile,
            business_profile: data.business_profile || null
          });

          this.user_info.full_name = data.user.full_name;

          notification.success({
            message: "Profile Updated",
            description: "Your profile has been successfully updated!",
            placement: 'bottomRight'
          });

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
      this.$refs.profilePictureInput.click();
    },

    handleBackgroundClick() {
      this.$refs.backgroundPictureInput.click();
    },

    handleProfilePictureChange(event) {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          notification.error({
            message: "File Too Large",
            description: "Profile picture must be less than 5MB."
          });
          return;
        }

        if (!file.type.startsWith('image/')) {
          notification.error({
            message: "Invalid File Type",
            description: "Please select an image file."
          });
          return;
        }

        this.selectedProfilePicture = file;
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const imgElement = document.querySelector('.header-avatar img');
          if (imgElement) {
            imgElement.src = e.target.result;
          }
        };
        reader.readAsDataURL(file);
      }
    },

    handleBackgroundPictureChange(event) {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          notification.error({
            message: "File Too Large",
            description: "Background picture must be less than 10MB."
          });
          return;
        }

        if (!file.type.startsWith('image/')) {
          notification.error({
            message: "Invalid File Type",
            description: "Please select an image file."
          });
          return;
        }

        this.selectedBackgroundPicture = file;
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const headerElement = document.querySelector('[style*="background-image"]').parentElement;
          if (headerElement) {
            headerElement.style.backgroundImage = `url(${e.target.result})`;
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }
}
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 768px) {

  
  .pt-\[60px\] {
    padding-top: 60px;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .bottom-\[-40px\] {
    left: 1.5rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .pt-\[60px\] {
    padding-top: 60px;
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .bottom-\[-40px\] {
    left: 1rem;
  }
  
  .w-\[100px\] {
    width: 70px;
  }
  
  .h-\[100px\] {
    height: 70px;
  }
}
</style>
