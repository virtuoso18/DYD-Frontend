
<template>
  <a-row>
    <a-col :sm="0" :xs="0" :md="24" :lg="24">
        <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo and Brand -->
      <div class="navbar-brand">
        <div class="logo" @click="this.$router.push('/')">
          <img src="../../assets/dyd-logo.png" style="width:40px;height:40px" alt="">
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="navbar-nav">
        <router-link to="/" class="nav-link">DYD Business</router-link>
        
        <router-link to="/comunity"   v-if="(user.user_type ==='Professional') || (user.user_type ==='Business')" class="nav-link">Community</router-link>
        <router-link to="/pricing" v-if="(user.user_type ==='Professional') || (user.user_type ==='Business')" class="nav-link">Pricing</router-link>
        <router-link to="/contact-us" class="nav-link">Contact us</router-link>
        <router-link to="/ai-catalog"  v-if="user.user_type ==='Professional'" class="nav-link">AI Catalog</router-link>
      </div>

      <!-- Right Side Actions -->
      <div class="navbar-actions">
        <a-select
  v-model:value="language_selected"
  @change="handleChange"
  style="width: 80px;"
>
  <a-select-option value="en">EN</a-select-option>
  <a-select-option value="he">HB</a-select-option>
</a-select>

            <div class="btn-input_credits" v-if="(user.user_type ==='Professional') || (user.user_type ==='Business')">
              <div class="credits-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 17 17" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.49935 1.41699C4.58722 1.41699 1.41602 4.5882 1.41602 8.50033C1.41602 12.4124 4.58722 15.5837 8.49935 15.5837C12.4115 15.5837 15.5827 12.4124 15.5827 8.50033C15.5827 4.5882 12.4115 1.41699 8.49935 1.41699ZM8.49935 2.12533C8.49935 3.81608 7.8277 5.43759 6.63215 6.63313C5.43661 7.82868 3.8151 8.50033 2.12435 8.50033C3.8151 8.50033 5.43661 9.17198 6.63215 10.3675C7.8277 11.5631 8.49935 13.1846 8.49935 14.8753C8.49935 13.1846 9.171 11.5631 10.3665 10.3675C11.5621 9.17198 13.1836 8.50033 14.8743 8.50033C13.1836 8.50033 11.5621 7.82868 10.3665 6.63313C9.171 5.43759 8.49935 3.81608 8.49935 2.12533Z" fill="currentColor"/>
                </svg>
                <span class="credits-number">{{liveCredits}}</span>
              </div>
              <a-button type="primary" size="small" @click="this.$router.push('/pricing')">Buy</a-button>
            </div>
   <a-button type="primary" @click="this.$router.push({name:'my-store'})" v-if="user.user_type ==='Business' ">
            <div style="display:flex;gap:5px">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 17" fill="none">
<path d="M1.97754 7.49756V10.8321C1.97754 12.7184 1.97754 13.6616 2.56333 14.2476C3.14911 14.8336 4.09192 14.8336 5.97754 14.8336H9.97754C11.8631 14.8336 12.8059 14.8336 13.3917 14.2476C13.9775 13.6616 13.9775 12.7184 13.9775 10.8321V7.49756" stroke="white" stroke-linecap="round"/>
<path d="M4.64453 12.4946H7.3112" stroke="white" stroke-linecap="round"/>
<path d="M6.73554 6.11184C6.54755 6.79077 5.86386 7.96195 4.56485 8.13169C3.41789 8.28155 2.54798 7.78089 2.32578 7.57156C2.08079 7.40182 1.52245 6.85866 1.38571 6.51919C1.24897 6.17973 1.4085 5.44421 1.52245 5.14435L1.97796 3.82543C2.08916 3.49415 2.34947 2.71062 2.61635 2.4456C2.88323 2.18058 3.42355 2.16905 3.64594 2.16905H8.31627C9.51841 2.18603 12.1469 2.15833 12.6665 2.16905C13.1861 2.17977 13.4984 2.61533 13.5895 2.80203C14.3648 4.67991 14.6663 5.75539 14.6663 6.21367C14.5651 6.70255 14.1463 7.62436 12.6665 8.02982C11.1285 8.45122 10.2566 7.63162 9.98307 7.31695M6.10315 7.31695C6.31965 7.58282 6.99881 8.11809 7.98327 8.13169C8.96781 8.14522 9.81787 7.45836 10.1198 7.11326C10.2053 7.01142 10.3899 6.7093 10.5813 6.11184" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
<span>My Store</span>
            </div>
</a-button>
<!-- <a-button type="primary" @click="this.$router.push({name:'manage-access'})" v-if="user.user_type ==='Professional' ">
            <div style="display:flex;gap:5px">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 17" fill="none">
<path d="M1.97754 7.49756V10.8321C1.97754 12.7184 1.97754 13.6616 2.56333 14.2476C3.14911 14.8336 4.09192 14.8336 5.97754 14.8336H9.97754C11.8631 14.8336 12.8059 14.8336 13.3917 14.2476C13.9775 13.6616 13.9775 12.7184 13.9775 10.8321V7.49756" stroke="white" stroke-linecap="round"/>
<path d="M4.64453 12.4946H7.3112" stroke="white" stroke-linecap="round"/>
<path d="M6.73554 6.11184C6.54755 6.79077 5.86386 7.96195 4.56485 8.13169C3.41789 8.28155 2.54798 7.78089 2.32578 7.57156C2.08079 7.40182 1.52245 6.85866 1.38571 6.51919C1.24897 6.17973 1.4085 5.44421 1.52245 5.14435L1.97796 3.82543C2.08916 3.49415 2.34947 2.71062 2.61635 2.4456C2.88323 2.18058 3.42355 2.16905 3.64594 2.16905H8.31627C9.51841 2.18603 12.1469 2.15833 12.6665 2.16905C13.1861 2.17977 13.4984 2.61533 13.5895 2.80203C14.3648 4.67991 14.6663 5.75539 14.6663 6.21367C14.5651 6.70255 14.1463 7.62436 12.6665 8.02982C11.1285 8.45122 10.2566 7.63162 9.98307 7.31695M6.10315 7.31695C6.31965 7.58282 6.99881 8.11809 7.98327 8.13169C8.96781 8.14522 9.81787 7.45836 10.1198 7.11326C10.2053 7.01142 10.3899 6.7093 10.5813 6.11184" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
<span>My Access</span>
            </div>
</a-button> -->

        <div class="icon-actions">
          <router-link :to="'/cart'">

            <button class="icon-btn">
              <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1H4.63636L7.07273 13.7524C7.15586 14.1909 7.38355 14.5847 7.71595 14.865C8.04835 15.1454 8.46427 15.2943 8.89091 15.2857H17.7273C18.1539 15.2943 18.5698 15.1454 18.9022 14.865C19.2346 14.5847 19.4623 14.1909 19.5455 13.7524L21 5.7619H5.54545M9.18182 20.0476C9.18182 20.5736 8.7748 21 8.27273 21C7.77065 21 7.36364 20.5736 7.36364 20.0476C7.36364 19.5216 7.77065 19.0952 8.27273 19.0952C8.7748 19.0952 9.18182 19.5216 9.18182 20.0476ZM19.1818 20.0476C19.1818 20.5736 18.7748 21 18.2727 21C17.7707 21 17.3636 20.5736 17.3636 20.0476C17.3636 19.5216 17.7707 19.0952 18.2727 19.0952C18.7748 19.0952 19.1818 19.5216 19.1818 20.0476Z" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="20" cy="6" r="2.5" fill="#3B63FB" stroke="white"/>
              </svg>
            </button>
          </router-link>
          <!-- Notifications Bell Icon with Counter -->
          <div class="notification-bell" @click="openNotificationsPanel">
            <button class="icon-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M1.53001 13.77C1.31701 15.164 2.26801 16.131 3.43201 16.613C7.89501 18.463 14.105 18.463 18.568 16.613C19.732 16.131 20.683 15.163 20.47 13.77C20.34 12.913 19.693 12.2 19.214 11.503C18.587 10.579 18.525 9.572 18.524 8.5C18.525 4.358 15.157 1 11 1C6.843 1 3.47501 4.358 3.47501 8.5C3.47501 9.572 3.41301 10.58 2.78501 11.503C2.30701 12.2 1.66101 12.913 1.53001 13.77Z"
                  stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7 18C7.458 19.725 9.076 21 11 21C12.925 21 14.541 19.725 15 18" stroke="#333333"
                  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <!-- Red Badge for Unread Notifications -->
            <span v-if="unreadNotificationsCount > 0" class="notification-badge">
              {{ unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount }}
            </span>
          </div>

          <!-- Other icon buttons -->
          <button class="icon-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 11V16M12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 10.8181 3.23279 9.64778 3.68508 8.55585C4.13738 7.46392 4.80031 6.47177 5.63604 5.63604C6.47177 4.80031 7.46392 4.13738 8.55585 3.68508C9.64778 3.23279 10.8181 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12C21 14.3869 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.3869 21 12 21ZM12.05 8V8.1H11.95V8H12.05Z"
                stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

       <div class="user-avatar" @click="this.$router.push({name:'dashboard'})">
  <!-- Hidden image to detect load -->
  <img
    :src="this.$store.state.root_media_api + profile.profile_picture"
    @load="onHeaderAvatarLoad"
    class="hidden"
    alt=""
  />
  
  <!-- Skeleton -->
  <div v-if="!headerAvatarLoaded" class="header-avatar-skeleton"></div>
  
  <!-- Actual Image -->
  <img
    :src="this.$store.state.root_media_api + profile.profile_picture"
    :class="['header-avatar-img', headerAvatarLoaded ? 'avatar-visible' : 'avatar-hidden']"
    alt="User"
  />
</div>

      </div>
    </div>
  </nav>
    </a-col>

    <!-- Mobile View -->
    <a-col :sm="24" :xs="24" :md="0" :lg="0">
<a-drawer
    :placement="'left'"
    :closable="true"
    :open="openMobileDrawer"
    :width="'70%'"
:bodyStyle="{ padding: '8px' }"
    @close="closeMobileDrawer"
  >
  <template #title>
    <div style="display:flex;justify-content :space-between">
      DYD 
      <a-select ref="select" v-model:value="language_selected" @focus="focus" @change="handleChange">
          <a-select-option value="jack">EN</a-select-option>
          <a-select-option value="lucy">HB</a-select-option>
        </a-select>
    </div>
  </template>
  

 <div v-if="user.user_type==='Business'">
          <nav_mob_business @close="closeMobileDrawer" />
        </div>
<div v-if="user.user_type==='Professional'">

<nav_mob_professional @close="closeMobileDrawer" /></div>

<div v-if="user.user_type==='User'">
<nav_mob_user @close="closeMobileDrawer" /></div>

</a-drawer>

        <nav class="navbar">
    <div class="navbar-container" style="padding-left:5px;padding-right:5px">
        <a-button type="text" @click="showDrawer"><MenuOutlined /></a-button>

      <!-- Logo and Brand -->
      <div class="navbar-brand">
        <div class="logo" @click="this.$router.push('/')">
          <img src="../../assets/dyd-logo.png" style="width:40px;height:40px;margin-right:10px" alt="">
        </div>
      </div>

      <!-- Right Side Actions -->
      <div class="navbar-actions">
            <div class="btn-input_credits" style="height:35px;">
              <div class="credits-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 17 17" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.49935 1.41699C4.58722 1.41699 1.41602 4.5882 1.41602 8.50033C1.41602 12.4124 4.58722 15.5837 8.49935 15.5837C12.4115 15.5837 15.5827 12.4124 15.5827 8.50033C15.5827 4.5882 12.4115 1.41699 8.49935 1.41699ZM8.49935 2.12533C8.49935 3.81608 7.8277 5.43759 6.63215 6.63313C5.43661 7.82868 3.8151 8.50033 2.12435 8.50033C3.8151 8.50033 5.43661 9.17198 6.63215 10.3675C7.8277 11.5631 8.49935 13.1846 8.49935 14.8753C8.49935 13.1846 9.171 11.5631 10.3665 10.3675C11.5621 9.17198 13.1836 8.50033 14.8743 8.50033C13.1836 8.50033 11.5621 7.82868 10.3665 6.63313C9.171 5.43759 8.49935 3.81608 8.49935 2.12533Z" fill="currentColor"/>
                </svg>
                <span class="credits-number">{{liveCredits}}</span>
              </div>
              <a-button type="primary" size="small">Buy</a-button>
            </div>

        <div class="icon-actions">
          <!-- Mobile Notifications Bell Icon with Counter -->
          <div class="notification-bell" @click="openNotificationsPanel">
            <button class="icon-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M1.53001 13.77C1.31701 15.164 2.26801 16.131 3.43201 16.613C7.89501 18.463 14.105 18.463 18.568 16.613C19.732 16.131 20.683 15.163 20.47 13.77C20.34 12.913 19.693 12.2 19.214 11.503C18.587 10.579 18.525 9.572 18.524 8.5C18.525 4.358 15.157 1 11 1C6.843 1 3.47501 4.358 3.47501 8.5C3.47501 9.572 3.41301 10.58 2.78501 11.503C2.30701 12.2 1.66101 12.913 1.53001 13.77Z"
                  stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7 18C7.458 19.725 9.076 21 11 21C12.925 21 14.541 19.725 15 18" stroke="#333333"
                  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <!-- Red Badge for Unread Notifications Mobile -->
            <span v-if="unreadNotificationsCount > 0" class="notification-badge">
              {{ unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount }}
            </span>
          </div>
          
          <button class="icon-btn" @click="this.$router.push('/cart')">
            <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1H4.63636L7.07273 13.7524C7.15586 14.1909 7.38355 14.5847 7.71595 14.865C8.04835 15.1454 8.46427 15.2943 8.89091 15.2857H17.7273C18.1539 15.2943 18.5698 15.1454 18.9022 14.865C19.2346 14.5847 19.4623 14.1909 19.5455 13.7524L21 5.7619H5.54545M9.18182 20.0476C9.18182 20.5736 8.7748 21 8.27273 21C7.77065 21 7.36364 20.5736 7.36364 20.0476C7.36364 19.5216 7.77065 19.0952 8.27273 19.0952C8.7748 19.0952 9.18182 19.5216 9.18182 20.0476ZM19.1818 20.0476C19.1818 20.5736 18.7748 21 18.2727 21C17.7707 21 17.3636 20.5736 17.3636 20.0476C17.3636 19.5216 17.7707 19.0952 18.2727 19.0952C18.7748 19.0952 19.1818 19.5216 19.1818 20.0476Z" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="20" cy="6" r="2.5" fill="#3B63FB" stroke="white"/>
</svg>
          </button>
        </div>
       <div class="user-avatar" @click="this.$router.push({name:'dashboard'})">
  <!-- Hidden image to detect load -->
  <img
    :src="this.$store.state.root_media_api + profile.profile_picture"
    @load="onHeaderAvatarLoad"
    class="hidden"
    alt=""
  />
  
  <!-- Skeleton -->
  <div v-if="!headerAvatarLoaded" class="header-avatar-skeleton"></div>
  
  <!-- Actual Image -->
  <img
    :src="this.$store.state.root_media_api + profile.profile_picture"
    :class="['header-avatar-img', headerAvatarLoaded ? 'avatar-visible' : 'avatar-hidden']"
    alt="User"
  />
</div>

      </div>
    </div>
  </nav>
    </a-col>
  </a-row>

<!-- BasicNavbar.vue - Complete Updated Script Section -->
</template>


<script>
import { MenuOutlined } from '@ant-design/icons-vue';
import { notification } from 'ant-design-vue'; // ✅ Import at top level
import { useI18n } from 'vue-i18n'

import nav_mob_business from '@/components/Includes/nav_comps/nav_mob_business.vue'
import nav_mob_professional from '@/components/Includes/nav_comps/nav_mob_professional.vue'
import nav_mob_user from '@/components/Includes/nav_comps/nav_mob_user.vue'

export default {
  name: 'BasicNavbar',
  components: {
    MenuOutlined,
    nav_mob_business,
    nav_mob_professional,
    nav_mob_user
  },
  setup() {
  const { t, locale } = useI18n() // get translator & locale controller
  return { t, locale }
},
  data() {
    return {
      language_selected: 'EN',
      user: JSON.parse(localStorage.getItem('user')),
      profile: JSON.parse(localStorage.getItem('profile')),
      business_info: JSON.parse(localStorage.getItem('business_profile') || '{}'),
      openMobileDrawer: false,
      smallAvatarLoaded: false,
     headerAvatarLoaded:false,
      // Credits tracking
      liveCredits: 0,

      // Notifications tracking
      unreadNotificationsCount: 0,
      notifications: [],

      // WebSocket connections
      creditsWs: null,
      notificationsWs: null,
      token: null,

      // Reconnection settings
      reconnectInterval: null,
      reconnectAttempts: 0,
      maxReconnectAttempts: 5
    }
  },
  mounted() {
    this.fetch_current_credits_of_user()
    this.fetch_unread_notifications_count()
    
    this.token = localStorage.getItem('token');
    
    if (this.token) {
      this.connectCreditsWebSocket();
      this.connectNotificationsWebSocket();
    } else {
      console.error("No token found. User must be authenticated.");
    }

    const savedLang = localStorage.getItem('preferred_language');
if (savedLang) {
  this.language_selected = savedLang;
  this.locale = savedLang;
  document.dir = savedLang === 'he' ? 'rtl' : 'ltr';
}
  },
  
  beforeUnmount() {
    this.closeWebSockets();
    
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
    }
  },
  
  methods: {

     // ============ DRAWER METHODS ============
    showDrawer() {
      this.openMobileDrawer = !this.openMobileDrawer
    },

    closeMobileDrawer() {
      // window.location.href = window.location.pathname + "?p=true";
      this.openMobileDrawer = false
      console.log('✅ Mobile drawer closed')
    },

     onHeaderAvatarLoad() {
    this.headerAvatarLoaded = false;
    setTimeout(() => {
      this.headerAvatarLoaded = true;
    }, 1000); // 1 second skeleton
  },


    // ============ CREDITS METHODS ============
    async fetch_current_credits_of_user(){
       try {
            const token = localStorage.getItem('token');
                
            const response = await fetch(`${this.$store.state.root_api}subscription/api/get-my-credits-count/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            if (result.success) {
                this.liveCredits = result.credits_count;
            }
       } catch (error) {
            console.error('Error loading credits:', error);
       }
    },

    connectCreditsWebSocket() {
      if (this.creditsWs) {
        this.creditsWs.close();
      }

      if (!this.token) {
        console.error("Cannot connect: No token available");
        return;
      }

      const wsUrl = `${this.$store.state.websockets_address}/ws/credits/?token=${this.token}`;
      this.creditsWs = new WebSocket(wsUrl);

      this.creditsWs.onopen = () => {
        console.log("✅ Credits WebSocket connected");
      };

      this.creditsWs.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.action === 'credit_update') {
          this.liveCredits = data.credits_count;
        } else if (data.credits_count !== undefined) {
          this.liveCredits = data.credits_count;
        }
      };

      this.creditsWs.onerror = (error) => {
        console.error("Credits WebSocket error:", error);
      };

      this.creditsWs.onclose = () => {
        console.log("Credits WebSocket disconnected");
      };
    },

    // ============ NOTIFICATIONS METHODS ============
    async fetch_unread_notifications_count() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}notifications/api/get-unread-notifications-count/`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        const result = await response.json();
        if (result.success) {
          this.unreadNotificationsCount = result.unread_count;
          console.log(`📬 Initial unread count: ${result.unread_count}`);
        }
      } catch (error) {
        console.error('Error loading unread notifications count:', error);
      }
    },

    connectNotificationsWebSocket() {
      if (this.notificationsWs) {
        this.notificationsWs.close();
      }

      if (!this.token) {
        console.error("Cannot connect: No token available");
        return;
      }

      const userId = this.user?.id;
      if (!userId) {
        console.error("User ID not found");
        return;
      }

      const wsUrl = `${this.$store.state.websockets_address}/ws/notifications/${userId}/?token=${this.token}`;
      this.notificationsWs = new WebSocket(wsUrl);

      this.notificationsWs.onopen = () => {
        console.log("✅ Notifications WebSocket connected");
        this.reconnectAttempts = 0;
      };

      this.notificationsWs.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          console.log("📬 WebSocket message received:", data);
          
          // ✅ HANDLE NEW NOTIFICATION
          if (data.action === 'notification_received') {
            const notificationData = data.notification;
            const unreadCount = data.unread_count;
            
            console.log("📨 New Notification:", notificationData);
            console.log("📊 Unread Count:", unreadCount);
            
            // Add notification to list
            this.notifications.unshift(notificationData);
            
            // Update unread count
            this.unreadNotificationsCount = unreadCount;
            
            // ✅ Show Ant Design notification popup
            this.showAntNotification(notificationData);
          }
          
          // ✅ HANDLE UNREAD COUNT UPDATE (from API marking as seen)
          else if (data.action === 'unread_count_updated') {
            const newUnreadCount = data.unread_count;
            
            console.log("🔄 Unread count updated via API:", newUnreadCount);
            
            // Update the badge count in real-time
            this.unreadNotificationsCount = newUnreadCount;
            
            // Show success message
            if (newUnreadCount === 0) {
              console.log("✅ All notifications marked as seen!");
              notification.success({
                message: 'All Notifications Seen',
                description: 'You have marked all notifications as seen',
                duration: 2,
                placement: 'bottomRight'
              });
            }
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.notificationsWs.onerror = (error) => {
        console.error("Notifications WebSocket error:", error);
      };

      this.notificationsWs.onclose = () => {
        console.log("Notifications WebSocket disconnected");
        this.attemptReconnectNotifications();
      };
    },

    // ✅ FIXED: Show Ant Design notification popup
    showAntNotification(notificationData) {
      // Map notification type to Ant Design type
      const typeMap = {
        'success': 'success',
        'info': 'info',
        'warning': 'warning',
        'error': 'error',
        'danger': 'error',
        'default': 'info'
      };

      const notificationType = typeMap[notificationData.type] || typeMap['default'];

      console.log(`🔔 Showing ${notificationType} notification:`, notificationData.title);
      
      // ✅ Use imported notification directly
      notification[notificationType]({
        message: notificationData.title || 'New Notification',
        description: notificationData.description || '',
        duration: 4.5,
        top: '24px',
        style: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        },
        placement: 'bottomRight'
      });
    },

    attemptReconnectNotifications() {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("Max reconnection attempts reached for notifications");
        return;
      }

      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      console.log(`Attempting to reconnect notifications in ${delay}ms`);
      
      this.reconnectInterval = setTimeout(() => {
        if (this.token) {
          this.connectNotificationsWebSocket();
        }
      }, delay);
    },

    openNotificationsPanel() {
      this.$router.push('/notifications')
    },

    closeWebSockets() {
      if (this.creditsWs) {
        this.creditsWs.close();
        this.creditsWs = null;
      }
      if (this.notificationsWs) {
        this.notificationsWs.close();
        this.notificationsWs = null;
      }
    },

    showDrawer(){
      this.openMobileDrawer = !this.openMobileDrawer
    },
    
    handleChange(value) {
  this.language_selected = value;
  this.locale = value; // ✅ switch Vue i18n language

  // ✅ Optional: switch layout direction
  document.dir = value === 'he' ? 'rtl' : 'ltr';

  // ✅ Save preference to localStorage
  localStorage.setItem('preferred_language', value);

  console.log(`🌐 Language changed to: ${value}`);
}
  }
}
</script>

<style scoped>
/* Global Navbar Styles */
.navbar {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

:deep(.ant-drawer-body) {
  padding: 0 !important;
}
.navbar-container {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 24px;
  height: 64px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 42px;
  height: 42px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-left: 20px;
  margin-right: auto;
}

.nav-link {
  color: #4b5563;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
  white-space: nowrap;
}

.nav-link:hover {
  color: #3B63FB;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-input_credits {
  display: flex;
  gap: 5px;
  background: rgba(128, 128, 128, 0.093);
  border: 1px solid #2f2f2f2d;
  border-radius: 8px;
  padding: 5px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  height: 40px;
}

.credits-content {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #3B63FB;
}

.credits-number {
  font-size: 16px;
  font-weight: 500;
}

.icon-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  border-radius: 6px;
}

.icon-btn:hover {
  background: #f3f4f6;
  color: #3B63FB;
}

/* Notification Bell with Badge */
.notification-bell {
  position: relative;
  display: inline-block;
}
.notification-badge {
  position: absolute;
  top: -1px;
  right: -0px;
  background: #EF4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  border: 0px;
  /* box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
  animation: badgePulse 2s infinite; */
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.header-avatar-skeleton {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(
    110deg,
    #e0e7ff 8%,
    #f8fafc 18%,
    #e0e7ff 33%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite linear;
  position: absolute;
  top: 0;
  left: 0;
}

.header-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.avatar-visible {
  opacity: 1;
}

.avatar-hidden {
  opacity: 0;
}

@keyframes shimmer {
  to {
    background-position-x: -200%;
  }
}

.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: border-color 0.2s ease;
    position: relative;  /* ⬅️ ADD THIS */

}

.user-avatar:hover {
  border-color: #3B63FB;
}



/* Responsive Design */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 16px;
    height: 56px;
  }

  .navbar-nav {
    display: none;
  }

  .navbar-actions {
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .navbar-actions {
    gap: 4px;
  }
}
</style>