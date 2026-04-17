<template>
  <a-modal
    v-model:open="show_info_disable_floor_wall_furniture_light_products"
    :title="t('settings.productContains.infoTitle')"
    centered
  >
    <template #footer></template>
    <p>{{ t('settings.productContains.infoMessage') }}</p>
  </a-modal>

  <!-- Change Password Modal -->
  <a-modal
    :open="change_password_modal"
    :title="t('settings.password.modalTitle')"
    @ok="changePassword"
    @cancel="closePasswordModal"
    :confirmLoading="passwordLoading"
  >
    <div style="display: flex; flex-direction: column; gap: 15px;">
      <div>
        <label for="current-password" style="display: block; margin-bottom: 5px; font-weight: 500;">
          {{ t('settings.password.currentPassword') }}
        </label>
        <a-input
          id="current-password"
          v-model:value="currentPassword"
          type="password"
          :placeholder="t('settings.password.currentPasswordPlaceholder')"
        />
      </div>
      <div>
        <label for="new-password" style="display: block; margin-bottom: 5px; font-weight: 500;">
          {{ t('settings.password.newPassword') }}
        </label>
        <a-input
          id="new-password"
          v-model:value="newPassword"
          type="password"
          :placeholder="t('settings.password.newPasswordPlaceholder')"
        />
      </div>
      <div>
        <label for="confirm-password" style="display: block; margin-bottom: 5px; font-weight: 500;">
          {{ t('settings.password.confirmPassword') }}
        </label>
        <a-input
          id="confirm-password"
          v-model:value="confirmPassword"
          type="password"
          :placeholder="t('settings.password.confirmPasswordPlaceholder')"
        />
      </div>
    </div>
  </a-modal>

  <div style="background-color: white; border-radius: 15px; border: 1px solid rgba(0,0,0,0.1); margin-top: 15px; min-height: 90vh; padding: 20px;">
    <h2
      class="!text-gray-700 p-2"
      :style="{ fontFamily: 'Poppins', fontWeight: 500, fontStyle: 'normal', fontSize: '16px', lineHeight: '24px', letterSpacing: '0%' }"
    >
      {{ t('settings.title') }}
    </h2>

    <!-- Watermark Section -->
    <div style="border: 1px solid rgba(0,0,0,0.2); padding: 15px; border-radius: 7px; margin-bottom: 20px;">
      <h4 class="!text-gray-700">{{ t('settings.watermark.title') }}</h4>
      <a-row>
        <a-col :span="20">
          <p>{{ t('settings.watermark.description') }}</p>
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

    <!-- Password Section -->
    <div style="border: 1px solid rgba(0,0,0,0.2); padding: 15px; border-radius: 7px;">
      <a-row>
        <a-col :span="18">
          <h4 class="!text-gray-700">{{ t('settings.password.title') }}</h4>
          <p>{{ t('settings.password.description') }}</p>
        </a-col>
        <a-col :xs="32" :sm="6" style="display: flex; justify-content: center; align-items: center;">
          <a-button type="primary" @click="openPasswordModal">
            {{ t('settings.password.changeButton') }}
          </a-button>
        </a-col>
      </a-row>
    </div>

    <br />

    <!-- Products Selling Section -->
    <div style="border: 1px solid rgba(0,0,0,0.2); padding: 15px; border-radius: 7px; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between;">
        <h4 class="!text-gray-700">{{ t('settings.productContains.title') }}</h4>
        <a-button
          type="default"
          shape="circle"
          size="small"
          @click="show_info_disable_floor_wall_furniture_light_products = true"
        >i</a-button>
      </div>

      <!-- Floor -->
      <a-row style="margin-bottom: 10px;">
        <a-col :span="20">
          <p>{{ t('settings.productContains.floor') }}</p>
        </a-col>
        <a-col :span="4" style="display: flex; justify-content: center; align-items: center;">
          <a-switch v-model:checked="scene.floor" @change="updateBusinessSailingProducts" />
        </a-col>
      </a-row>

      <!-- Furniture -->
      <a-row style="margin-bottom: 10px;">
        <a-col :span="20">
          <p>{{ t('settings.productContains.furniture') }}</p>
        </a-col>
        <a-col :span="4" style="display: flex; justify-content: center; align-items: center;">
          <a-switch v-model:checked="scene.furniture" @change="updateBusinessSailingProducts" />
        </a-col>
      </a-row>

      <!-- Walls -->
      <a-row style="margin-bottom: 10px;">
        <a-col :span="20">
          <p>{{ t('settings.productContains.walls') }}</p>
        </a-col>
        <a-col :span="4" style="display: flex; justify-content: center; align-items: center;">
          <a-switch v-model:checked="scene.walls" @change="updateBusinessSailingProducts" />
        </a-col>
      </a-row>

      <!-- Lights -->
      <a-row>
        <a-col :span="20">
          <p>{{ t('settings.productContains.lights') }}</p>
        </a-col>
        <a-col :span="4" style="display: flex; justify-content: center; align-items: center;">
          <a-switch v-model:checked="scene.lights" @change="updateBusinessSailingProducts" />
        </a-col>
      </a-row>
    </div>

    <AccessTokens/>
  </div>
  
</template>

<script>
import { useI18n } from 'vue-i18n';
import { message, notification } from 'ant-design-vue';
import AccessTokens from '@/views/store/pages/accessTokens.vue';
export default {
  name: 'settings',

  setup() {
    const { t, locale } = useI18n();
    return { t, locale };
  },

  components: {
     AccessTokens,
    },

  data() {
    return {
      watermark: false,
      watermarkLoading: false,
      show_info_disable_floor_wall_furniture_light_products: false,
      change_password_modal: false,
      passwordLoading: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      BusinessProfile: JSON.parse(localStorage.getItem('business_profile')),
      scene: {
        floor: true,
        furniture: true,
        walls: true,
        lights: true,
      },
    };
  },

  mounted() {
    this.scene = {
      floor: this.BusinessProfile.is_saling_floor,
      furniture: this.BusinessProfile.is_saling_furniture,
      walls: this.BusinessProfile.is_saling_wall,
      lights: this.BusinessProfile.is_saling_light,
    };
    this.fetchWatermarkStatus();
  },

  methods: {
    getAuthToken() {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
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
              Authorization: `Token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ scene: this.scene }),
          },
        );

        if (!response.ok) throw new Error('Failed request');

        const result = await response.json();

        if (result.success) {
          this.scene = result.scene;
          this.BusinessProfile.is_saling_floor = result.scene.floor;
          this.BusinessProfile.is_saling_furniture = result.scene.furniture;
          this.BusinessProfile.is_saling_wall = result.scene.walls;
          this.BusinessProfile.is_saling_light = result.scene.lights;
          localStorage.setItem('business_profile', JSON.stringify(this.BusinessProfile));
          message.success(result.message);
        } else {
          message.error(this.t('settings.messages.updateFailed'));
        }
      } catch (error) {
        console.error(error);
        message.error(this.t('settings.messages.serverError'));
      }
    },

    async fetchWatermarkStatus() {
      try {
        const token = this.getAuthToken();
        const response = await fetch(
          this.$store.state.root_api + 'Auth/api/show-watermark-toggle/',
          {
            method: 'GET',
            headers: {
              Authorization: `Token ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!data.error) this.watermark = data.show_watermark;
      } catch (error) {
        console.error('Error fetching watermark status:', error);
        message.error(this.t('settings.messages.fetchWatermarkFailed'));
      }
    },

    async toggleWatermark(checked) {
      this.watermarkLoading = true;
      try {
        const token = this.getAuthToken();
        const response = await fetch(
          this.$store.state.root_api + 'Auth/api/show-watermark-toggle/',
          {
            method: 'POST',
            headers: {
              Authorization: `Token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ show_watermark: checked }),
          },
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!data.error) {
          this.watermark = checked;
          message.success(data.message || this.t('settings.messages.watermarkUpdated'));
        } else {
          message.error(data.message || this.t('settings.messages.watermarkFailed'));
          this.watermark = !checked;
        }
      } catch (error) {
        console.error('Error toggling watermark:', error);
        message.error(this.t('settings.messages.watermarkFailed'));
        this.watermark = !checked;
      } finally {
        this.watermarkLoading = false;
      }
    },

    openPasswordModal() {
      this.change_password_modal = true;
      this.resetPasswordForm();
    },

    closePasswordModal() {
      this.change_password_modal = false;
      this.resetPasswordForm();
    },

    resetPasswordForm() {
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    },

    async changePassword() {
      if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
        message.error(this.t('settings.messages.allFieldsRequired'));
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        message.error(this.t('settings.messages.passwordsMismatch'));
        return;
      }
      if (this.newPassword.length < 8) {
        message.error(this.t('settings.messages.passwordTooShort'));
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
              Authorization: `Token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              currentPassword: this.currentPassword,
              newPassword: this.newPassword,
              confirmPassword: this.confirmPassword,
            }),
          },
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!data.error) {
          message.success(data.message || this.t('settings.messages.passwordChanged'));
          this.closePasswordModal();
          this.$store.dispatch('logout');
          localStorage.removeItem('profile');
          localStorage.removeItem('business_profile');
          this.$router.push('/login');
          notification.success({
            message: this.t('settings.messages.passwordChangedNotification'),
            placement: 'bottomRight',
          });
        } else {
          message.error(data.message || this.t('settings.messages.passwordChangeFailed'));
        }
      } catch (error) {
        console.error('Error changing password:', error);
        message.error(this.t('settings.messages.passwordChangeFailed'));
      } finally {
        this.passwordLoading = false;
      }
    },
  },
};
</script>

<style scoped>
label { font-weight: 500; color: rgba(0, 0, 0, 0.85); }
p { color: rgba(0, 0, 0, 0.65); margin-bottom: 10px; }
h4 { margin-bottom: 10px; }
</style>