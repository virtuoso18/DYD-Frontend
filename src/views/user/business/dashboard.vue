<template>
  <div class="dashboard-container">
    <!-- Main Dashboard Content -->
    <a-row class="dashboard-content">
      <!-- Sidebar -->
      <a-col :xs="menu_view_mobile ? 0:24" :sm="menu_view_mobile ? 0:24" :md="6" :lg="6" class="sidebar-col" >
        <div class="sidebar">
          <div class="user-info">
            <div class="user-avatar">
              <img :src="this.$store.state.root_media_api+profile.profile_picture" alt="John Doe" />
            </div>
            <h3>{{ user?.full_name || 'John Doe' }}</h3>
            <p class="user-email">{{ user?.email || 'johndoe@gmail.com' }}</p>
            
            <div class="completion-badge">
              <div class="completion-circle">
                <span class="completion-text">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 24 24" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z" fill="currentcolor"/>
                  </svg> &nbsp;90% completed
                </span>
              </div>
            </div> 
            
            <div class="package-info">
              <div class="package-header">
                <span class="package-label">Your package</span>
                <router-link to="/pricing" class="upgrade-link">Upgrade</router-link>
              </div>
              <div class="package-card">
                <span class="package-type">Business</span>
                <div class="package-icon">
                  <img src="../../../assets/dyd-logo.png" alt="" style="width:40px;height:40px">
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Menu -->
          <nav class="dashboard-nav">
            <router-link 
              to="/business-dashboard/my-profile" 
              class="nav-item"
              :class="{ active: $route.name === 'business_my_profile' }"
            >
              <div class="nav-icon-wrapper">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Profile</span>
            </router-link>
            
            <router-link 
              to="/business-dashboard/business-details" 
              class="nav-item"
              :class="{ active: $route.name === 'business_business_details' }"
            >
              <div class="nav-icon-wrapper">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M5 21V7L13 2L21 7V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 9V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M17 9V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Business Detail</span>
            </router-link>
            
            <router-link 
              to="/business-dashboard/my-designs" 
              class="nav-item"
              :class="{ active: $route.name === 'business_my_designs' }"
            >
              <div class="nav-icon-wrapper">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">My Designs</span>
            </router-link>
            
            <router-link 
              to="/business-dashboard/my-products" 
              class="nav-item"
              :class="{ active: $route.name === 'business_my_products' }"
            >
              <div class="nav-icon-wrapper">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">My Products</span>
            </router-link>
            
            <router-link 
              to="/business-dashboard/comunity" 
              class="nav-item"
              :class="{ active: $route.name === 'business_dashboard_community' }"
            >
              <div class="nav-icon-wrapper">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M23 21V19C23 18.1332 22.7361 17.2873 22.2458 16.5707C21.7555 15.8542 21.0617 15.3022 20.2656 14.9876" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 18.9078 6.11683 18.7176 6.95054C18.5274 7.78425 18.0661 8.53291 17.4128 9.06582C16.7595 9.59872 15.9551 9.88681 15.13 9.88681C14.3049 9.88681 13.5005 9.59872 12.8472 9.06582C12.1939 8.53291 11.7326 7.78425 11.5424 6.95054C11.3522 6.11683 11.5478 5.25392 12.0924 4.55232C12.637 3.85071 13.3996 3.35031 14.26 3.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Community</span>
            </router-link>
            
            <router-link 
              to="/business-dashboard/generate-banner" 
              class="nav-item"
              :class="{ active: $route.name === 'business_generate_banner' }"
            >
              <div class="nav-icon-wrapper">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Generate a Banner</span>
            </router-link>
            
            <router-link 
              to="/business-dashboard/manage-subscription" 
              class="nav-item"
              :class="{ active: $route.name === 'business_manage_subscription' }"
            >
              <div class="nav-icon-wrapper">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <polygon points="12,2 15.09,8.26 22,9 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9 8.91,8.26" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Manage Subscription</span>
            </router-link>
            
            <router-link 
              to="/business-dashboard/my-transactions" 
              class="nav-item"
              :class="{ active: $route.name === 'my_transactions' }"
            >
              <div class="nav-icon-wrapper">
               <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 7H1L6.5 1M1 11H17L11.5 17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


              </div>
              <span class="nav-text">Transactions</span>
            </router-link>
              
            <div class="nav-item" @click="logout_user">
              <div class="nav-icon-wrapper">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.81818 16C1.31818 16 0.890303 15.8261 0.534545 15.4782C0.178788 15.1304 0.000606061 14.7117 0 14.2222V1.77778C0 1.28889 0.178182 0.870518 0.534545 0.522666C0.890909 0.174815 1.31879 0.000592592 1.81818 0H7.27273C7.5303 0 7.74636 0.0853334 7.92091 0.256C8.09545 0.426666 8.18242 0.637629 8.18182 0.888888C8.18121 1.14015 8.09394 1.35141 7.92 1.52267C7.74606 1.69392 7.5303 1.77896 7.27273 1.77778H1.81818V14.2222H7.27273C7.5303 14.2222 7.74636 14.3075 7.92091 14.4782C8.09545 14.6489 8.18242 14.8598 8.18182 15.1111C8.18121 15.3624 8.09394 15.5736 7.92 15.7449C7.74606 15.9161 7.5303 16.0012 7.27273 16H1.81818ZM12.8864 8.88888H6.36364C6.10606 8.88888 5.8903 8.80355 5.71636 8.63288C5.54242 8.46222 5.45515 8.25125 5.45455 7.99999C5.45394 7.74873 5.54121 7.53777 5.71636 7.36711C5.89152 7.19644 6.10727 7.11111 6.36364 7.11111H12.8864L11.1818 5.44444C11.0152 5.28148 10.9318 5.08148 10.9318 4.84444C10.9318 4.6074 11.0152 4.4 11.1818 4.22222C11.3485 4.04444 11.5606 3.9517 11.8182 3.944C12.0758 3.93629 12.2955 4.02163 12.4773 4.2L15.7273 7.37777C15.9091 7.55555 16 7.76296 16 7.99999C16 8.23703 15.9091 8.44444 15.7273 8.62222L12.4773 11.8C12.2955 11.9778 12.0797 12.0631 11.83 12.056C11.5803 12.0489 11.3642 11.9561 11.1818 11.7778C11.0152 11.6 10.9358 11.389 10.9436 11.1449C10.9515 10.9007 11.0385 10.6969 11.2045 10.5333L12.8864 8.88888Z" fill="#E33827"/>
</svg>

              </div>
              <span class="nav-text" style="font-size: medium;color:orangered;font-weight:600">Logout</span>
              
            </div>
          </nav>
        </div>
      </a-col>
      
      <!-- Content Area -->
      <a-col :xs="menu_view_mobile ? 0:24" :sm="menu_view_mobile ? 0:24" :md="18" :lg="18" class="content-area">
        <!-- This router-view will render the active child route component -->
        <a-col :xs="24" :sm="24" :md="0" :lg="0" >
          <a-button @click="menu_view_mobile=true">Back</a-button>
        </a-col> 
        <router-view :user="user" :profile="profile" :buisness_info="business_info" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { notification } from "ant-design-vue";

export default {
  name: 'DashboardManager_business_user',
  
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user') || '{}'),
      profile: JSON.parse(localStorage.getItem('profile') || '{}'),
      business_info: JSON.parse(localStorage.getItem('business_profile') || '{}'),
      menu_view_mobile:true,
    }
  },
  methods:{
    
    logout_user() {
    this.$store.dispatch('logout')
    localStorage.removeItem('profile')
    localStorage.removeItem('business_profile')
    this.$router.push('/login') // optional redirect

    notification.success({
               message: "Logout Successful",
               placement:'bottomRight'
             });
  }

  },
  computed: {
    currentRouteName() {
      return this.$route.name
    }
  },
  
  created() {
    // Debug: Log current route information
    console.log('Current route:', this.$route)
    console.log('Current route name:', this.$route.name)
    console.log('Current route path:', this.$route.path)
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

.sidebar-col {
  padding: 10px;
}

.sidebar {
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e9ecef;
  
  /* Make it sticky */
  position: sticky;
  top: 10px;
  max-height: calc(100vh - 20px);
  overflow-y: auto;
  
  /* Smooth scrolling */
  scroll-behavior: smooth;
}

.user-info {
  text-align: center;
  margin-bottom: 30px;
  flex-shrink: 0;
}

.user-avatar {
  width: 100px;
  height: 100px;
  margin: auto;
  position: relative;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e9ecef;
}

.user-info h3 {
  margin: 15px 0 4px;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.user-email {
  margin: 0 0 16px;
  color: #6b7280;
  font-size: 14px;
}

.completion-badge {
  position: relative;
  margin: 10px 0;
}

.completion-circle {
  display: inline-block;
  color: #3b82f6;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
}

.completion-text {
  display: flex;
  font-size: 14px;
  font-weight: 600;
}

.package-info {
  margin-bottom: 20px;
  flex-shrink: 0;
}

.package-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.package-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.upgrade-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
}

.upgrade-link:hover {
  color: #1d4ed8;
}

.package-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.package-type {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 15px;
}

.package-icon {
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  white-space: nowrap;
}

.nav-item:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.nav-item.active {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.nav-item.active:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  color: white;
}

.nav-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.content-area {
  padding: 0;
}

/* Custom scrollbar for sidebar */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Firefox scrollbar */
.sidebar {
  scrollbar-color: #888 #f1f1f1;
  scrollbar-width: thin;
}

/* For smaller screens, adjust sticky behavior */
@media (max-width: 1200px) {
  .sidebar {
    max-height: calc(100vh - 20px);
  }
}
</style>