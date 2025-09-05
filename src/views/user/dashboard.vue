<template>
  <div class="dashboard-manager">
    <!-- Show loading while checking user type and redirecting -->
    <div v-if="isLoading" class="loading-container">
      <a-spin size="large" />
      <p>Redirecting to your dashboard...</p>
    </div>
    
    <!-- Only show dashboard content if we're on the correct path -->
    <div v-else-if="shouldShowDashboard">
      <!-- Dynamic component based on current route -->
      <component 
        :is="currentDashboardComponent" 
        :user="user"
        :profile="profile"
        :business_info="business_info"
      />
      
      <!-- Floating action button for creating new catalogue -->
      <router-link :to="'/start-new-catalogue'">
        <a-float-button>
          <template #icon>
            <FormatPainterOutlined />
          </template>
        </a-float-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import business_user_dashboard from '@/views/user/business/dashboard.vue'
import professional_user_dashboard from '@/views/user/professional/dashboard.vue'
import user_dashboard from '@/views/user/user/dashboard.vue'
import { FormatPainterOutlined } from '@ant-design/icons-vue'

export default {
  name: 'DashboardManager',
  
  components: {
    business_user_dashboard,
    professional_user_dashboard,
    user_dashboard,
    FormatPainterOutlined
  },
  
  data() {
    return {
      user: null,
      profile: null,
      business_info: null,
      isLoading: true,
      userType: null
    }
  },
  
  computed: {
    currentDashboardComponent() {
      // Determine component based on current route
      const path = this.$route.path
      
      if (path.includes('/business-dashboard')) {
        return 'business_user_dashboard'
      } else if (path.includes('/professional-dashboard')) {
        return 'professional_user_dashboard'
      } else {
        return 'user_dashboard'
      }
    },
    
    shouldShowDashboard() {
      // Only show dashboard if we're on a specific dashboard path (not the generic /dashboard)
      const path = this.$route.path
      return path !== '/dashboard' && (
        path.includes('/business-dashboard') || 
        path.includes('/professional-dashboard') ||
        path.includes('/user-dashboard')
      )
    }
  },
  
  async mounted() {
    await this.initializeAndRedirect()
  },
  
  methods: {
    async initializeAndRedirect() {
      try {
        // Load user data
        await this.loadUserData()
        
        // If we're on the generic /dashboard route, redirect to specific dashboard
        if (this.$route.path === '/dashboard') {
          await this.redirectToSpecificDashboard()
        } else {
          // We're already on a specific dashboard, just stop loading
          this.isLoading = false
        }
        
      } catch (error) {
        console.error('Error initializing dashboard:', error)
        // If there's an error, redirect to login
        this.$router.push('/login')
      }
    },
    
    loadUserData() {
      try {
        const userData = localStorage.getItem('user')
        const profileData = localStorage.getItem('profile')
        const businessData = localStorage.getItem('business_profile')
        
        if (!userData) {
          throw new Error('No user data found')
        }
        
        this.user = JSON.parse(userData)
        
        if (profileData) {
          this.profile = JSON.parse(profileData)
        }
        
        if (businessData) {
          this.business_info = JSON.parse(businessData)
        }
        
        // Determine user type from the user object
        this.determineUserType()
        
      } catch (error) {
        console.error('Error loading user data:', error)
        throw error
      }
    },
    
    determineUserType() {
      if (!this.user) {
        this.userType = 'user'
        return
      }
      
      // Check user flags in priority order
      if (this.user.is_business) {
        this.userType = 'business'
      } else if (this.user.is_professional) {
        this.userType = 'professional'
      } else if (this.user.is_user) {
        this.userType = 'user'
      } else {
        // Fallback: check for other possible fields
        if (this.user.userType) {
          this.userType = this.user.userType.toLowerCase()
        } else if (this.user.role) {
          this.userType = this.user.role.toLowerCase()
        } else {
          // Default fallback
          this.userType = 'user'
        }
      }
    },
    
    async redirectToSpecificDashboard() {
      let redirectPath = '/dashboard' // fallback
      
      // Determine redirect path based on user type
      if (this.userType === 'business') {
        redirectPath = '/business-dashboard/my-profile'
      } else if (this.userType === 'professional') {
        redirectPath = '/professional-dashboard/my-profile'
      } else {
        redirectPath = '/user-dashboard/my-profile'
      }
      
      // Perform the redirect
      try {
        await this.$router.replace(redirectPath)
        this.isLoading = false
      } catch (routerError) {
        console.error('Error redirecting:', routerError)
        this.isLoading = false
      }
    },
    
    async fetchUserType() {
      // This method can be used for API calls if needed
      try {
        // Example API call (uncomment when you have the endpoint):
        // const response = await this.$http.get(`/api/users/${this.user.id}/type`)
        // this.userType = response.data.userType.toLowerCase()
        
        // For now, just use the local determination
        this.determineUserType()
      } catch (error) {
        console.error('Error fetching user type:', error)
        // Fall back to local determination
        this.determineUserType()
      }
    }
  },
  
  watch: {
    // Watch for route changes
    '$route'() {
      // If user navigates back to generic /dashboard, redirect again
      if (this.$route.path === '/dashboard' && this.user) {
        this.isLoading = true
        this.redirectToSpecificDashboard()
      }
    }
  }
}
</script>

<style scoped>
.dashboard-manager {
  min-height: 100vh;
  background: #f8f9fa;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px;
}

.loading-container p {
  color: #6b7280;
  font-size: 16px;
  margin: 0;
}
</style>