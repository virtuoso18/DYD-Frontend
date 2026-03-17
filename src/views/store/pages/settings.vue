<template>
     <a-modal v-model:open="show_info_disable_floor_wall_furniture_light_products" title="what is this ? "  centered>
        <template #footer></template>
      <p>
Toggling the <strong>Product Contains</strong> option on or off will affect the simulation screen. 
When enabled, the simulation screen will display the tab menu for the corresponding product type; 
when disabled, the tab menu will be hidden. Please disable this option for products that you do not 
officially sell on DYD.
</p>
      
    </a-modal>
    <!-- Change Password Modal -->
    <a-modal 
        :open="change_password_modal" 
        title="Change Your Password"
        @ok="changePassword"
        @cancel="closePasswordModal"
        :confirmLoading="passwordLoading"
    >
        <div style="display: flex; flex-direction: column; gap: 15px;">
            <div>
                <label for="current-password" style="display: block; margin-bottom: 5px; font-weight: 500;">Current Password</label>
                <a-input
                    id="current-password"
                    v-model:value="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                />
            </div>
            <div>
                <label for="new-password" style="display: block; margin-bottom: 5px; font-weight: 500;">New Password</label>
                <a-input
                    id="new-password"
                    v-model:value="newPassword"
                    type="password"
                    placeholder="Enter new password"
                />
            </div>
            <div>
                <label for="confirm-password" style="display: block; margin-bottom: 5px; font-weight: 500;">Confirm New Password</label>
                <a-input
                    id="confirm-password"
                    v-model:value="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                />
            </div>
        </div>
    </a-modal>
    
    <!-- Main Settings Container -->
    <div style="background-color: white; border-radius: 15px; border: 1px solid rgba(0,0,0,0.1); margin-top: 15px; min-height: 90vh; padding: 20px;">
        <h2
  className="!text-gray-700 p-2"
  :style="{
    fontFamily: 'Poppins',
    fontWeight: 500,
    fontStyle: 'normal',
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0%'
  }"
>
Settings</h2>

        <!-- Watermark Management Section -->
        <div style="border: 1px solid rgba(0,0,0,0.2); padding: 15px; border-radius: 7px; margin-bottom: 20px;">
            <h4 class="!text-gray-700" >Manage Watermark</h4>
            <a-row>
                <a-col :span="20">
                    <p>To display your brand watermark on product images, turn on the toggle</p>
                </a-col>
                <a-col :span="4" style="display: flex; justify-content: center; align-items: center;">
                    <a-switch 
                        :checked="watermark" 
                        @change="toggleWatermark"
                        :loading="watermarkLoading"
                    />
                </a-col>
            </a-row>
        </div>

        <!-- Password Management Section -->
        <div style="border: 1px solid rgba(0,0,0,0.2); padding: 15px; border-radius: 7px;">
            <a-row>
                <a-col :span="18">
                    <h4 class="!text-gray-700" >Manage Password</h4>
                    <p>Set a new password to keep your account safe.</p>
                </a-col>
                <a-col :xs="32" :sm="6" style="display: flex; justify-content: center; align-items: center;">
                    <a-button 
                        type="primary" 
                        @click="openPasswordModal"
                    >
                        Change Password
                    </a-button>
                </a-col>
            </a-row>
        </div>
<br>
       <!-- <div style="border: 1px solid rgba(0,0,0,0.2); padding: 15px; border-radius: 7px;">
  <a-row>
    <a-col :span="18">
      <h4 class="!text-gray-700">Daily Visualization Limit</h4>
      
      <p>
        Set the maximum number of visualizations a general user can perform per day 
        after accessing your AI catalog via the shared link. This helps you control 
        usage and manage system resources efficiently.
      </p>
    </a-col>

    <a-col 
      :xs="24" 
      :sm="6" 
      style="display: flex; justify-content: center; align-items: center; gap:10px"
    >
      <a-input placeholder="Enter limit"></a-input>
      
      <a-button 
        type="primary" 
        @click="openPasswordModal"
      >
        Save
      </a-button>
    </a-col>
  </a-row>
</div>
<br> -->
        <!-- Scene Elements Control -->
<div style="border: 1px solid rgba(0,0,0,0.2); padding: 15px; border-radius: 7px; margin-bottom: 20px;">
  <div style="display: flex;justify-content: space-between;">
    <h4 class="!text-gray-700">Products Saling</h4>
    <a-button type="default" shape="circle" size="small" @click="show_info_disable_floor_wall_furniture_light_products=true">i</a-button>
  </div>

  <!-- Floor -->
  <a-row style="margin-bottom:10px;">
    <a-col :span="20">
      <p>Floor Products</p>
    </a-col>
    <a-col :span="4" style="display:flex;justify-content:center;align-items:center;">
      <a-switch v-model:checked="scene.floor" @change="updateBusinessSailingProducts"/>
    </a-col>
  </a-row>

  <!-- Furniture -->
  <a-row style="margin-bottom:10px;">
    <a-col :span="20">
      <p>Furniture Products</p>
    </a-col>
    <a-col :span="4" style="display:flex;justify-content:center;align-items:center;">
      <a-switch v-model:checked="scene.furniture" @change="updateBusinessSailingProducts"/>
    </a-col>
  </a-row>

  <!-- Walls -->
  <a-row style="margin-bottom:10px;">
    <a-col :span="20">
      <p>Walls Products</p>
    </a-col>
    <a-col :span="4" style="display:flex;justify-content:center;align-items:center;">
      <a-switch v-model:checked="scene.walls" @change="updateBusinessSailingProducts"/>
    </a-col>
  </a-row>

  <!-- Lights -->
  <a-row>
    <a-col :span="20">
      <p>Lights Products</p>
    </a-col>
    <a-col :span="4" style="display:flex;justify-content:center;align-items:center;">
      <a-switch v-model:checked="scene.lights" @change="updateBusinessSailingProducts"/>
    </a-col>
  </a-row>

</div>
    </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { notification } from "ant-design-vue";

export default {
    name: 'settings',
    data() {
        return {
            watermark: false,
            watermarkLoading: false,
            show_info_disable_floor_wall_furniture_light_products:false,

            change_password_modal: false,
            passwordLoading: false,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            BusinessProfile:JSON.parse(localStorage.getItem('business_profile')),
            scene: {
                floor: true,
                furniture: true,
                walls: true,
                lights: true
            }
        };
    },
    // watch: {
    //     scene: {
    //         deep: true,
    //         handler() {
    //             this.updateBusinessSailingProducts();
    //         }
    //     }
    // },
    mounted() {
        this.scene = {
                floor: this.BusinessProfile.is_saling_floor,
                furniture: this.BusinessProfile.is_saling_furniture,
                walls: this.BusinessProfile.is_saling_wall,
                lights: this.BusinessProfile.is_saling_light
            }
        this.fetchWatermarkStatus();
    },
    methods: {
        // Get auth token from localStorage
        getAuthToken() {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            return token;
        },
async updateBusinessSailingProducts() {
    try {
        const token = this.getAuthToken();

        const response = await fetch(
            this.$store.state.root_api + 'Auth/api/update-business-sailings-products/',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    scene: this.scene
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed request");
        }

        const result = await response.json();

        if (result.success) {
            
            // update scene state
            this.scene = result.scene;

            // update BusinessProfile values
            this.BusinessProfile.is_saling_floor = result.scene.floor
            this.BusinessProfile.is_saling_furniture = result.scene.furniture
            this.BusinessProfile.is_saling_wall = result.scene.walls
            this.BusinessProfile.is_saling_light = result.scene.lights

            // store updated profile
            localStorage.setItem(
                'business_profile',
                JSON.stringify(this.BusinessProfile)
            )

            message.success(result.message)
        } else {
            message.error("Failed to update settings");
        }

    } catch (error) {
        console.error(error);
        message.error("Server error updating scene settings");
    }
},
        // Fetch current watermark status
        async fetchWatermarkStatus() {
            try {
                const token = this.getAuthToken();
                const response = await fetch(
                    this.$store.state.root_api + 'Auth/api/show-watermark-toggle/',
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (!data.error) {
                    this.watermark = data.show_watermark;
                }
            } catch (error) {
                console.error('Error fetching watermark status:', error);
                message.error('Failed to fetch watermark settings');
            }
        },

        // Toggle watermark on/off
        async toggleWatermark(checked) {
            this.watermarkLoading = true;
            try {
                const token = this.getAuthToken();
                const response = await fetch(
                    this.$store.state.root_api + 'Auth/api/show-watermark-toggle/',
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            show_watermark: checked
                        })
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (!data.error) {
                    this.watermark = checked;
                    message.success(data.message || 'Watermark setting updated');
                } else {
                    message.error(data.message || 'Failed to update watermark');
                    this.watermark = !checked; // Revert on error
                }
            } catch (error) {
                console.error('Error toggling watermark:', error);
                message.error('Failed to update watermark setting');
                this.watermark = !checked; // Revert on error
            } finally {
                this.watermarkLoading = false;
            }
        },

        // Open password change modal
        openPasswordModal() {
            this.change_password_modal = true;
            this.resetPasswordForm();
        },

        // Close password modal
        closePasswordModal() {
            this.change_password_modal = false;
            this.resetPasswordForm();
        },

        // Reset password form fields
        resetPasswordForm() {
            this.currentPassword = '';
            this.newPassword = '';
            this.confirmPassword = '';
        },

        // Change password
        async changePassword() {
            // Validation
            if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
                message.error('All fields are required');
                return;
            }

            if (this.newPassword !== this.confirmPassword) {
                message.error('New passwords do not match');
                return;
            }

            if (this.newPassword.length < 8) {
                message.error('Password must be at least 8 characters long');
                return;
            }

            this.passwordLoading = true;
            try {
                const token = this.getAuthToken();
                const response = await fetch(
                    this.$store.state.root_api + 'Auth/api/change-password/',
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            currentPassword: this.currentPassword,
                            newPassword: this.newPassword,
                            confirmPassword: this.confirmPassword
                        })
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (!data.error) {
                    message.success(data.message || 'Password changed successfully');
                    this.closePasswordModal();
                    
                    this.$store.dispatch('logout')
                    localStorage.removeItem('profile')
                    localStorage.removeItem('business_profile')
                    this.$router.push('/login') // optional redirect

                    notification.success({
                            message: "Password Changed Successful",
                            placement:'bottomRight'
                            });
                    // Redirect to login after a delay
                    // setTimeout(() => {
                    //     this.$router.push('/login');
                    // }, 2000);
                } else {
                    message.error(data.message || 'Failed to change password');
                }
            } catch (error) {
                console.error('Error changing password:', error);
                message.error('Failed to change password');
            } finally {
                this.passwordLoading = false;
            }
        }
    }
};
</script>

<style scoped>
label {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
}

p {
    color: rgba(0, 0, 0, 0.65);
    margin-bottom: 10px;
}

h4 {
    margin-bottom: 10px;
}
</style>