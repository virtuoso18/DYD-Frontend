<!-- BasicNavbar.vue -->
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
        <a href="#" class="nav-link">DYD Business</a>
        <a href="#" class="nav-link">Community</a>
        <a href="#" class="nav-link">Pricing</a>
        <a href="#" class="nav-link">Contact us</a>
      </div>

      <!-- Right Side Actions -->
      <div class="navbar-actions">
        <a-select ref="select" v-model:value="language_selected" @focus="focus" @change="handleChange">
          <a-select-option value="jack">EN</a-select-option>
          <a-select-option value="lucy">HB</a-select-option>
        </a-select>

            <div class="btn-input_credits">
              <div class="credits-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 17 17" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.49935 1.41699C4.58722 1.41699 1.41602 4.5882 1.41602 8.50033C1.41602 12.4124 4.58722 15.5837 8.49935 15.5837C12.4115 15.5837 15.5827 12.4124 15.5827 8.50033C15.5827 4.5882 12.4115 1.41699 8.49935 1.41699ZM8.49935 2.12533C8.49935 3.81608 7.8277 5.43759 6.63215 6.63313C5.43661 7.82868 3.8151 8.50033 2.12435 8.50033C3.8151 8.50033 5.43661 9.17198 6.63215 10.3675C7.8277 11.5631 8.49935 13.1846 8.49935 14.8753C8.49935 13.1846 9.171 11.5631 10.3665 10.3675C11.5621 9.17198 13.1836 8.50033 14.8743 8.50033C13.1836 8.50033 11.5621 7.82868 10.3665 6.63313C9.171 5.43759 8.49935 3.81608 8.49935 2.12533Z" fill="currentColor"/>
                </svg>
                <span class="credits-number">1500</span>
              </div>
              <a-button type="primary" size="small">Buy</a-button>
            </div>
          

        <div class="icon-actions">
          <!-- <button class="icon-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" viewBox="0 0 23 22" fill="none">
              <path
                d="M1 1H4.63636L7.07273 13.7524C7.15586 14.1909 7.38355 14.5847 7.71595 14.865C8.04835 15.1454 8.46427 15.2943 8.89091 15.2857H17.7273C18.1539 15.2943 18.5698 15.1454 18.9022 14.865C19.2346 14.5847 19.4623 14.1909 19.5455 13.7524L21 5.7619H5.54545M9.18182 20.0476C9.18182 20.5736 8.7748 21 8.27273 21C7.77065 21 7.36364 20.5736 7.36364 20.0476C7.36364 19.5216 7.77065 19.0952 8.27273 19.0952C8.7748 19.0952 9.18182 19.5216 9.18182 20.0476ZM19.1818 20.0476C19.1818 20.5736 18.7748 21 18.2727 21C17.7707 21 17.3636 20.5736 17.3636 20.0476C17.3636 19.5216 17.7707 19.0952 18.2727 19.0952C18.7748 19.0952 19.1818 19.5216 19.1818 20.0476Z"
                stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="20" cy="6" r="2.5" fill="#3B63FB" stroke="white" />
            </svg>
          </button> -->
          <a-button type="primary" @click="this.$router.push({name:'my-store'})">
            <div style="display:flex;gap:5px">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 17" fill="none">
<path d="M1.97754 7.49756V10.8321C1.97754 12.7184 1.97754 13.6616 2.56333 14.2476C3.14911 14.8336 4.09192 14.8336 5.97754 14.8336H9.97754C11.8631 14.8336 12.8059 14.8336 13.3917 14.2476C13.9775 13.6616 13.9775 12.7184 13.9775 10.8321V7.49756" stroke="white" stroke-linecap="round"/>
<path d="M4.64453 12.4946H7.3112" stroke="white" stroke-linecap="round"/>
<path d="M6.73554 6.11184C6.54755 6.79077 5.86386 7.96195 4.56485 8.13169C3.41789 8.28155 2.54798 7.78089 2.32578 7.57156C2.08079 7.40182 1.52245 6.85866 1.38571 6.51919C1.24897 6.17973 1.4085 5.44421 1.52245 5.14435L1.97796 3.82543C2.08916 3.49415 2.34947 2.71062 2.61635 2.4456C2.88323 2.18058 3.42355 2.16905 3.64594 2.16905H8.31627C9.51841 2.18603 12.1469 2.15833 12.6665 2.16905C13.1861 2.17977 13.4984 2.61533 13.5895 2.80203C14.3648 4.67991 14.6663 5.75539 14.6663 6.21367C14.5651 6.70255 14.1463 7.62436 12.6665 8.02982C11.1285 8.45122 10.2566 7.63162 9.98307 7.31695M6.10315 7.31695C6.31965 7.58282 6.99881 8.11809 7.98327 8.13169C8.96781 8.14522 9.81787 7.45836 10.1198 7.11326C10.2053 7.01142 10.3899 6.7093 10.5813 6.11184" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
<span>My Store</span>
            </div>
</a-button>
          <button class="icon-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 11V16M12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 10.8181 3.23279 9.64778 3.68508 8.55585C4.13738 7.46392 4.80031 6.47177 5.63604 5.63604C6.47177 4.80031 7.46392 4.13738 8.55585 3.68508C9.64778 3.23279 10.8181 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12C21 14.3869 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.3869 21 12 21ZM12.05 8V8.1H11.95V8H12.05Z"
                stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button class="icon-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M1.53001 13.77C1.31701 15.164 2.26801 16.131 3.43201 16.613C7.89501 18.463 14.105 18.463 18.568 16.613C19.732 16.131 20.683 15.163 20.47 13.77C20.34 12.913 19.693 12.2 19.214 11.503C18.587 10.579 18.525 9.572 18.524 8.5C18.525 4.358 15.157 1 11 1C6.843 1 3.47501 4.358 3.47501 8.5C3.47501 9.572 3.41301 10.58 2.78501 11.503C2.30701 12.2 1.66101 12.913 1.53001 13.77Z"
                stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M7 18C7.458 19.725 9.076 21 11 21C12.925 21 14.541 19.725 15 18" stroke="#333333"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
        <div class="user-avatar" @click="this.$router.push({name:'dashboard'})">
          <img :src="this.$store.state.root_api+profile.profile_picture"
            alt="User" />
        </div>
      </div>
    </div>
  </nav>
    </a-col>
    <a-col :sm="24" :xs="24" :md="0" :lg="0">
<a-drawer
    :placement="'left'"
    :closable="true"
    :open="openMobileDrawer"
    :width="'80%'"
    @close="showDrawer"
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
  <a-button type="primary" @click="this.$router.push({name:'my-store'})">
            <div style="display:flex;gap:5px">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 17" fill="none">
<path d="M1.97754 7.49756V10.8321C1.97754 12.7184 1.97754 13.6616 2.56333 14.2476C3.14911 14.8336 4.09192 14.8336 5.97754 14.8336H9.97754C11.8631 14.8336 12.8059 14.8336 13.3917 14.2476C13.9775 13.6616 13.9775 12.7184 13.9775 10.8321V7.49756" stroke="white" stroke-linecap="round"/>
<path d="M4.64453 12.4946H7.3112" stroke="white" stroke-linecap="round"/>
<path d="M6.73554 6.11184C6.54755 6.79077 5.86386 7.96195 4.56485 8.13169C3.41789 8.28155 2.54798 7.78089 2.32578 7.57156C2.08079 7.40182 1.52245 6.85866 1.38571 6.51919C1.24897 6.17973 1.4085 5.44421 1.52245 5.14435L1.97796 3.82543C2.08916 3.49415 2.34947 2.71062 2.61635 2.4456C2.88323 2.18058 3.42355 2.16905 3.64594 2.16905H8.31627C9.51841 2.18603 12.1469 2.15833 12.6665 2.16905C13.1861 2.17977 13.4984 2.61533 13.5895 2.80203C14.3648 4.67991 14.6663 5.75539 14.6663 6.21367C14.5651 6.70255 14.1463 7.62436 12.6665 8.02982C11.1285 8.45122 10.2566 7.63162 9.98307 7.31695M6.10315 7.31695C6.31965 7.58282 6.99881 8.11809 7.98327 8.13169C8.96781 8.14522 9.81787 7.45836 10.1198 7.11326C10.2053 7.01142 10.3899 6.7093 10.5813 6.11184" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
<span>My Store</span>
            </div>
</a-button>


    <p>Some contents...</p>
    
    <p>Some contents...</p>
    <p>Some contents...</p>
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
                <span class="credits-number">1500</span>
              </div>
              <a-button type="primary" size="small">Buy</a-button>
            </div>
          

        <div class="icon-actions">
          <!-- <button class="icon-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" viewBox="0 0 23 22" fill="none">
              <path
                d="M1 1H4.63636L7.07273 13.7524C7.15586 14.1909 7.38355 14.5847 7.71595 14.865C8.04835 15.1454 8.46427 15.2943 8.89091 15.2857H17.7273C18.1539 15.2943 18.5698 15.1454 18.9022 14.865C19.2346 14.5847 19.4623 14.1909 19.5455 13.7524L21 5.7619H5.54545M9.18182 20.0476C9.18182 20.5736 8.7748 21 8.27273 21C7.77065 21 7.36364 20.5736 7.36364 20.0476C7.36364 19.5216 7.77065 19.0952 8.27273 19.0952C8.7748 19.0952 9.18182 19.5216 9.18182 20.0476ZM19.1818 20.0476C19.1818 20.5736 18.7748 21 18.2727 21C17.7707 21 17.3636 20.5736 17.3636 20.0476C17.3636 19.5216 17.7707 19.0952 18.2727 19.0952C18.7748 19.0952 19.1818 19.5216 19.1818 20.0476Z"
                stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="20" cy="6" r="2.5" fill="#3B63FB" stroke="white" />
            </svg>
          </button> -->
          
          <button class="icon-btn">
            <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1H4.63636L7.07273 13.7524C7.15586 14.1909 7.38355 14.5847 7.71595 14.865C8.04835 15.1454 8.46427 15.2943 8.89091 15.2857H17.7273C18.1539 15.2943 18.5698 15.1454 18.9022 14.865C19.2346 14.5847 19.4623 14.1909 19.5455 13.7524L21 5.7619H5.54545M9.18182 20.0476C9.18182 20.5736 8.7748 21 8.27273 21C7.77065 21 7.36364 20.5736 7.36364 20.0476C7.36364 19.5216 7.77065 19.0952 8.27273 19.0952C8.7748 19.0952 9.18182 19.5216 9.18182 20.0476ZM19.1818 20.0476C19.1818 20.5736 18.7748 21 18.2727 21C17.7707 21 17.3636 20.5736 17.3636 20.0476C17.3636 19.5216 17.7707 19.0952 18.2727 19.0952C18.7748 19.0952 19.1818 19.5216 19.1818 20.0476Z" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="20" cy="6" r="2.5" fill="#3B63FB" stroke="white"/>
</svg>

          </button>
          <button class="icon-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M1.53001 13.77C1.31701 15.164 2.26801 16.131 3.43201 16.613C7.89501 18.463 14.105 18.463 18.568 16.613C19.732 16.131 20.683 15.163 20.47 13.77C20.34 12.913 19.693 12.2 19.214 11.503C18.587 10.579 18.525 9.572 18.524 8.5C18.525 4.358 15.157 1 11 1C6.843 1 3.47501 4.358 3.47501 8.5C3.47501 9.572 3.41301 10.58 2.78501 11.503C2.30701 12.2 1.66101 12.913 1.53001 13.77Z"
                stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M7 18C7.458 19.725 9.076 21 11 21C12.925 21 14.541 19.725 15 18" stroke="#333333"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
        <div class="user-avatar" @click="this.$router.push({name:'dashboard'})">
          <img :src="this.$store.state.root_api+profile.profile_picture"
            alt="User" />
        </div>
      </div>
    </div>
  </nav>
    </a-col>
  </a-row>

</template>

<script>
import {MenuOutlined } from '@ant-design/icons-vue';
export default {
  name: 'BasicNavbar',
  components:{
    MenuOutlined
  },
  data() {
    return {
      language_selected: 'EN',
      user: JSON.parse(localStorage.getItem('user') ),
      profile: JSON.parse(localStorage.getItem('profile') ),
      business_info: JSON.parse(localStorage.getItem('business_profile') || '{}'),
openMobileDrawer:false

    }
  },
  methods: {
showDrawer(){
  this.openMobileDrawer = !this.openMobileDrawer
},
    handleChange(e) {
      this.language_selected = e
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

.navbar-container {
  /* max-width: 1200px; */
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
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1;
}

.brand-subtitle {
  font-size: 12px;
  color: #6b7280;
  line-height: 1;
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

.language-selector {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.language-selector:hover {
  background-color: #f3f4f6;
}

.btn-primary {
  background: #3B63FB;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-primary:hover {
  background: #2c4fd6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 99, 251, 0.25);
}


.btn-input_credits {
  display: flex;
  gap: 5px;
  background: transparent;
  color: #3B63FB;
  border: 1px solid #2f2f2f2d;
  background: rgba(128, 128, 128, 0.093);
  border-radius: 8px;
  padding: 5px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  height: 40px;
}

.btn-outline {
  background: transparent;
  color: #3B63FB;
  border: 1px solid #3B63FB;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-outline:hover {
  background: #3B63FB;
  color: white;
  transform: translateY(-1px);
}

.btn-icon {
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.btn-icon:hover {
  border-color: #3B63FB;
  color: #3B63FB;
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

.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.user-avatar:hover {
  border-color: #3B63FB;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


/* Credits Section */
.btn-input_credits {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(128, 128, 128, 0.08);
  border: 1px solid rgba(47, 47, 47, 0.1);
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 14px;
  font-weight: 400;
  font-family: 'Poppins', sans-serif;
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

.btn-buy {
  background: #3B63FB;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-buy:hover {
  background: #2c4fd6;
  transform: translateY(-1px);
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

  .btn-primary,
  .btn-outline {
    padding: 6px 12px;
    font-size: 13px;
  }

  .brand-title {
    font-size: 14px;
  }

  .brand-subtitle {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .navbar-actions .btn-outline {
    display: none;
  }

  .icon-actions {
    gap: 4px;
  }

  .language-selector {
    display: none;
  }
}
</style>