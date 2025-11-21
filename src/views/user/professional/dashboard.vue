<template>
  <div class="dashboard-container">
    <!-- Main Dashboard Content -->
    <a-row class="dashboard-content">
      <!-- Sidebar -->
      <a-col :xs="0" :sm="0" :md="6" :lg="6" class="sidebar-col">
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
</svg> &nbsp;90% completed</span>
              </div>
            </div> 
            
            <div class="package-info">
              <div class="package-header">
                <span class="package-label">Your package</span>
                <router-link to="/pricing" class="upgrade-link">Upgrade</router-link>
              </div>
              <div class="package-card">
                <span class="package-type">professional</span>
                <div class="package-icon">
                  <img src="../../../assets/dyd-logo.png" alt="" style="width:40px;height:40px">
                  <!-- <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  </svg> -->
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Menu -->
          <nav class="dashboard-nav">
            <router-link 
              to="/professional-dashboard/my-profile" 
              class="nav-item"
              
              :class="{ active: $route.name === 'professional_my_profile' }"
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
              to="/professional-dashboard/access-requests" 
              class="nav-item"
              :class="{ active: $route.name === 'professional_my_requests' }"
            >
              <div class="nav-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 12.2C4 8.80588 4 7.10883 5.05441 6.05441C6.10883 5 7.80588 5 11.2 5C14.5941 5 16.2912 5 17.3456 6.05441C18.4 7.10883 18.4 8.80588 18.4 12.2C18.4 15.5941 18.4 17.2912 17.3456 18.3456C16.2912 19.4 14.5941 19.4 11.2 19.4C7.80588 19.4 6.10883 19.4 5.05441 18.3456C4 17.2912 4 15.5941 4 12.2Z" stroke="currentColor"/>
<path d="M6.69922 19.3992C9.77777 15.123 13.2374 9.45193 18.3992 13.7052" stroke="currentColor"/>
<path d="M14.999 7.5C15.2639 7.50009 15.5185 7.60474 15.7061 7.79199C15.8936 7.97927 15.9989 8.23387 15.999 8.49902V9.58008C16.8103 9.6975 18.002 9.98053 19.0713 10.6807C20.3948 11.5473 21.5 13.0336 21.5 15.4912H21.499C21.5013 15.7003 21.4386 15.9049 21.3184 16.0762C21.1959 16.2505 21.0211 16.3812 20.8193 16.4492L20.8145 16.4512C20.6164 16.5157 20.4028 16.5166 20.2041 16.4541C20.0167 16.3951 19.852 16.2812 19.7285 16.1289V16.1299C19.2563 15.5906 18.6721 15.1605 18.0166 14.8691C17.3815 14.5869 16.6937 14.4425 15.999 14.4434V15.4932C15.9982 15.6897 15.9394 15.8817 15.8301 16.0449C15.7207 16.2082 15.5651 16.3355 15.3838 16.4111C15.2025 16.4867 15.0025 16.5077 14.8096 16.4707C14.6169 16.4336 14.4391 16.3404 14.2988 16.2031L14.2949 16.1992L10.7969 12.7041C10.7032 12.6113 10.628 12.5016 10.5771 12.3799C10.5263 12.258 10.5 12.1271 10.5 11.9951C10.5 11.8631 10.5263 11.7322 10.5771 11.6104C10.628 11.4886 10.7022 11.378 10.7959 11.2852H10.7969L14.2949 7.79102L14.2969 7.79004C14.4832 7.60549 14.7349 7.5011 14.9971 7.5H14.999Z" fill="white" stroke="currentColor"/>
</svg>

              </div>
              <span class="nav-text">Requests</span>
            </router-link>
            <router-link 
  to="/professional-dashboard/my-likes" 
  class="nav-item flex items-center justify-between"
  :class="{ active: $route.name === 'professional_my_likes' }"
  @click="menu_view_mobile = true"
>

  <!-- LEFT SIDE: ICON + TEXT -->
  <div class="flex items-center gap-3">
    <div class="nav-icon-wrapper">
      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.90304 15.1577C5.7611 13.556 1.51758 9.89416 1.51758 6.59893C1.51758 4.42091 3.11591 2.65527 5.31361 2.65527C6.45242 2.65527 7.59123 3.03488 9.10965 4.55329C10.6281 3.03488 11.7669 2.65527 12.9057 2.65527C15.1034 2.65527 16.7017 4.42091 16.7017 6.59893C16.7017 9.89416 12.4582 13.556 10.3163 15.1577C9.59546 15.6966 8.62383 15.6966 7.90304 15.1577Z" stroke="currentcolor" stroke-width="1.13881" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

    </div>

    <span class="nav-text">My Likes</span>
  </div>

  <!-- RIGHT SIDE: ARROW -->
  <img src="/openfile.svg" alt="arrow" class="w-4 h-4 md:hidden block" />

</router-link>
            
            <router-link 
              to="/professional-dashboard/my-messages" 
              class="nav-item"
              :class="{ active: $route.name === 'professional_messages' }"
            >
              <div class="nav-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.19992 13.4739H14.8001M9.19992 9.52659H12M13.736 18.5186C17.0833 18.2999 19.749 15.6315 19.9682 12.2818C20.0106 11.6266 20.0106 10.9476 19.9682 10.2924C19.749 6.94346 17.0833 4.27665 13.736 4.05639C12.5799 3.9812 11.4201 3.9812 10.2639 4.05639C6.91666 4.27586 4.25099 6.94346 4.03178 10.2932C3.98941 10.9557 3.98941 11.6201 4.03178 12.2826C4.11179 13.5023 4.6582 14.6321 5.30222 15.5857C5.67583 16.2528 5.42942 17.0857 5.03981 17.8144C4.7598 18.3394 4.619 18.6015 4.7318 18.791C4.84381 18.9804 5.09581 18.9868 5.59903 18.9986C6.59505 19.0223 7.26627 18.7444 7.79908 18.3568C8.10069 18.1365 8.25189 18.0268 8.3559 18.0141C8.4599 18.0015 8.6655 18.0852 9.07512 18.251C9.44313 18.401 9.87114 18.4933 10.2631 18.5194C11.4032 18.5936 12.5944 18.5936 13.7368 18.5194" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              </div>
              <span class="nav-text">Messages</span>
            </router-link>
            <router-link 
              to="/professional-dashboard/manage-subscription" 
              class="nav-item"
              :class="{ active: $route.name === 'professional_manage_subscription' }"
            >
              <div class="nav-icon-wrapper">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <polygon points="12,2 15.09,8.26 22,9 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9 8.91,8.26" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Manage Subscription</span>
            </router-link>
             
            <router-link 
              to="/professional-dashboard/my-transactions" 
              class="nav-item"
              :class="{ active: $route.name === 'professional_transactions' }"
            >
              <div class="nav-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 10H4L9.5 4M4 14H20L14.5 20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              </div>
              <span class="nav-text">Transactions</span>
            </router-link>

              <div class="nav-item" @click="logout_user">
                <div class="nav-icon-wrapper">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1.81818 16C1.31818 16 0.890303 15.8261 0.534545 15.4782C0.178788 15.1304 0.000606061 14.7117 0 14.2222V1.77778C0 1.28889 0.178182 0.870518 0.534545 0.522666C0.890909 0.174815 1.31879 0.000592592 1.81818 0H7.27273C7.5303 0 7.74636 0.0853334 7.92091 0.256C8.09545 0.426666 8.18242 0.637629 8.18182 0.888888C8.18121 1.14015 8.09394 1.35141 7.92 1.52267C7.74606 1.69392 7.5303 1.77896 7.27273 1.77778H1.81818V14.2222H7.27273C7.5303 14.2222 7.74636 14.3075 7.92091 14.4782C8.09545 14.6489 8.18242 14.8598 8.18182 15.1111C8.18121 15.3624 8.09394 15.5736 7.92 15.7449C7.74606 15.9161 7.5303 16.0012 7.27273 16H1.81818ZM12.8864 8.88888H6.36364C6.10606 8.88888 5.8903 8.80355 5.71636 8.63288C5.54242 8.46222 5.45515 8.25125 5.45455 7.99999C5.45394 7.74873 5.54121 7.53777 5.71636 7.36711C5.89152 7.19644 6.10727 7.11111 6.36364 7.11111H12.8864L11.1818 5.44444C11.0152 5.28148 10.9318 5.08148 10.9318 4.84444C10.9318 4.6074 11.0152 4.4 11.1818 4.22222C11.3485 4.04444 11.5606 3.9517 11.8182 3.944C12.0758 3.93629 12.2955 4.02163 12.4773 4.2L15.7273 7.37777C15.9091 7.55555 16 7.76296 16 7.99999C16 8.23703 15.9091 8.44444 15.7273 8.62222L12.4773 11.8C12.2955 11.9778 12.0797 12.0631 11.83 12.056C11.5803 12.0489 11.3642 11.9561 11.1818 11.7778C11.0152 11.6 10.9358 11.389 10.9436 11.1449C10.9515 10.9007 11.0385 10.6969 11.2045 10.5333L12.8864 8.88888Z" fill="currentColor"/>
  </svg>

                </div>
                <span class="nav-text" style="font-size: medium;color:orangered;font-weight:600">Logout</span>
                
              </div>
          </nav>
        </div>
      </a-col>
      
      <!-- Content Area -->
      <a-col :xs="24" :sm="24" :md="18" :lg="18" class="content-area">
        
          <!-- This router-view will render the active child route component -->
          <router-view :user="user" :profile="profile"/>
        
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'DashboardManager_professional_user',
  
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user') ),
      profile: JSON.parse(localStorage.getItem('profile') )
      
      // Any dashboard-level data can go here
    }
  },
  computed: {
    currentRouteName() {
      return this.$route.name
    },
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
  /* box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); */
  border: 1px solid #e9ecef;
}

.user-info {
  text-align: center;
  margin-bottom: 30px;
}

.user-avatar {
  width: 100px;
  height: 100px;
  margin:  auto ;
  position: relative;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e9ecef;
}

.user-info h3 {
  margin: 0 0 4px;
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
  position:absolute;
  top: 10px;
  right:10px
}

.completion-circle {
  display: inline-block;
  /* background: linear-gradient(135deg, #3b82f6, #1d4ed8); */
  color: #3b82f6;
  padding: 8px 16px;
  /* border-radius: 20px; */
  font-size: 14px;
  font-weight: 600;
}
.completion-text{
  display: flex;
  font-size: 14px;
  font-weight: 600;
}

.package-info {
  margin-bottom: 20px;
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
  padding: 5px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.package-type {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 15px;
}

.package-icon {
  color: #6b7280;
}

.dashboard-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
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
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.content-area {
  padding: 0;
}

.content-wrapper {
  background: white;
  border-radius: 20px;
  margin: 20px;
  margin-left: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.wavy-header {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%);
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
  width: 80px;
  height: 80px;
}

.header-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.camera-icon {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: #374151;
  border: 2px solid white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
}

.personal-info-section {
  padding: 60px 40px 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

</style>  