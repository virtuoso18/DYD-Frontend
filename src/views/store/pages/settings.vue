<template>
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
        <h2>Settings</h2>

        <!-- Watermark Management Section -->
        <div style="border: 1px solid rgba(0,0,0,0.2); padding: 15px; border-radius: 7px; margin-bottom: 20px;">
            <h4>Manage Watermark</h4>
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
                    <h4>Manage Password</h4>
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

            change_password_modal: false,
            passwordLoading: false,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        };
    },
    mounted() {
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