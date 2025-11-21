<template>
  
  <div class="dashboard-container">
    <!-- Main Dashboard Content -->
    <a-row class="dashboard-content">
      <!-- {{ profile }} -->
      <!-- {{ user }} -->
      <!-- Sidebar -->
      <a-col :xs="0" :sm="0" :md="6" :lg="6" class="sidebar-col">
        <div class="sidebar">
          <div class="user-info">
            <div class="user-avatar">
              <!-- {{ business_info }} -->
               <img :src="this.$store.state.root_media_api+profile.profile_picture" alt="John Doe" />
            </div>
            <h3>{{ user?.full_name || 'John Doe' }}</h3>
            <p class="user-email">{{ user?.email || 'johndoe@gmail.com' }}</p>
            
          
          </div>

          <!-- Navigation Menu -->
          <nav class="dashboard-nav">
            <router-link 
              to="/manage-access/manage-business-analytics" 
              class="nav-item"
              
              :class="{ active: $route.name === 'manage_business_analytics' }"
            >
              <div class="nav-icon-wrapper">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Analytics</span>
            </router-link>
            
             <router-link 
             class="nav-item"
              to="/manage-access/manage-business-access" 
              :class="{ active: $route.name === 'manage_business_access' }"
             >
             <!-- to="/my-store/my-messages"  -->
             <!-- :class="{ active: $route.name === 'messages' }" -->
             <div class="nav-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.19992 13.4739H14.8001M9.19992 9.52659H12M13.736 18.5186C17.0833 18.2999 19.749 15.6315 19.9682 12.2818C20.0106 11.6266 20.0106 10.9476 19.9682 10.2924C19.749 6.94346 17.0833 4.27665 13.736 4.05639C12.5799 3.9812 11.4201 3.9812 10.2639 4.05639C6.91666 4.27586 4.25099 6.94346 4.03178 10.2932C3.98941 10.9557 3.98941 11.6201 4.03178 12.2826C4.11179 13.5023 4.6582 14.6321 5.30222 15.5857C5.67583 16.2528 5.42942 17.0857 5.03981 17.8144C4.7598 18.3394 4.619 18.6015 4.7318 18.791C4.84381 18.9804 5.09581 18.9868 5.59903 18.9986C6.59505 19.0223 7.26627 18.7444 7.79908 18.3568C8.10069 18.1365 8.25189 18.0268 8.3559 18.0141C8.4599 18.0015 8.6655 18.0852 9.07512 18.251C9.44313 18.401 9.87114 18.4933 10.2631 18.5194C11.4032 18.5936 12.5944 18.5936 13.7368 18.5194" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

              </div>
              <span class="nav-text">All Business</span>
            </router-link>
            
             <router-link 
             class="nav-item"
              to="/manage-access/manage-business-tasks" 
              :class="{ active: $route.name === 'manage_access_all_tasks' }"
             >
             <!-- to="/my-store/my-messages"  -->
             <!-- :class="{ active: $route.name === 'messages' }" -->
             <div class="nav-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.19992 13.4739H14.8001M9.19992 9.52659H12M13.736 18.5186C17.0833 18.2999 19.749 15.6315 19.9682 12.2818C20.0106 11.6266 20.0106 10.9476 19.9682 10.2924C19.749 6.94346 17.0833 4.27665 13.736 4.05639C12.5799 3.9812 11.4201 3.9812 10.2639 4.05639C6.91666 4.27586 4.25099 6.94346 4.03178 10.2932C3.98941 10.9557 3.98941 11.6201 4.03178 12.2826C4.11179 13.5023 4.6582 14.6321 5.30222 15.5857C5.67583 16.2528 5.42942 17.0857 5.03981 17.8144C4.7598 18.3394 4.619 18.6015 4.7318 18.791C4.84381 18.9804 5.09581 18.9868 5.59903 18.9986C6.59505 19.0223 7.26627 18.7444 7.79908 18.3568C8.10069 18.1365 8.25189 18.0268 8.3559 18.0141C8.4599 18.0015 8.6655 18.0852 9.07512 18.251C9.44313 18.401 9.87114 18.4933 10.2631 18.5194C11.4032 18.5936 12.5944 18.5936 13.7368 18.5194" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

              </div>
              <span class="nav-text">All Tasks</span>
            </router-link>
            
            
          </nav>
        </div>
      </a-col>
      
      <!-- Content Area -->
      <a-col :xs="24" :sm="24" :md="18" :lg="18" class="content-area">
        <!-- This router-view will render the active child route component -->
        <router-view  :user="user" :profile="profile" :business_info="business_info" />
        <!-- <router-view v-if="business_info.is_email_verified" :user="user" :profile="profile" :business_info="business_info" /> 
         <div v-else style="margin-top:10px;background: white;border-radius:15px;height:90vh;padding:10px;border:1px solid rgba(0,0,0,0.1);display: flex;justify-content: center;align-items: center;" >
          <div style="text-align:center">
            <img src="../../assets/emailverify.jpg" style="max-width:200px;max-height:400px" alt=""><br>
            Your Business email Is not verified yet please verify to access the store features. <br><br>

          <router-link to="/business-dashboard/business-details">
            <a-button type="primary">
              Verify now 
            </a-button>
          </router-link>
          </div>
        </div> -->
        
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'store_manager',
  
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user') ),
      profile: JSON.parse(localStorage.getItem('profile') ),
      business_info: JSON.parse(localStorage.getItem('business_profile') || '{}'),

    }
  },
  computed: {
    currentRouteName() {
      return this.$route.name
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
  padding: 20px;
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
  flex-shrink: 0;
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
  width: 100%;
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
</style>