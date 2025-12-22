<template>
  <div class="dashboard-container" v-if="access_recieved"> 
    <!-- Main Dashboard Content -->
     <!-- {{ employee_owner_business_data }} -->

    <a-row class="dashboard-content">
      <!-- Sidebar -->
      <a-col :xs="0" :sm="0" :md="6" :lg="6" class="sidebar-col">
        <div class="sidebar">
          <div class="user-info">
            <div class="business-logo">
              <img :src="this.$store.state.root_media_api+employee_owner_business_data?.banner_picture" alt="Business Logo" />
              <!-- <div class="logo-placeholder">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div> -->
            </div>
            <h3>{{ employee_owner_business_data?.name }}</h3>
            <p class="business-id">ID: {{ employee_owner_business_data?.email }}</p>
          </div>

          <!-- Navigation Menu -->
          <nav class="dashboard-nav">
            <!-- Overview -->
            <router-link 
              :to="{ name: 'business-overview',   query: { access_id: this.$route.query.access_id, brand: employee_owner_business_data.slug }}" 
              class="nav-item"
              :class="{ active: $route.name === 'business-overview' }"
            >
              <div class="nav-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span class="nav-text">Overview</span>
            </router-link>

            <!-- Manage Products -->
            <!-- :to="{ name: 'manage-products',  query: { brand: employee_owner_business_data.slug } }"  -->
            <router-link 
              v-if="access_recieved.product.read"
              :to="{ name: 'manage-products',query: { access_id: this.$route.query.access_id, brand: employee_owner_business_data.slug }}" 
              class="nav-item"
              :class="{ active: $route.name === 'manage-products' }"
            >
              <div class="nav-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3.27002 6.96L12 12.01L20.73 6.96" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 22.08V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Manage Products</span>
            </router-link>

            <!-- Manage Site -->
            <!-- :to="{ name: 'manage-site',  query: { brand: employee_owner_business_data.slug }}"  -->
            <router-link 
              v-if="access_recieved.business.read"
              :to="{ name: 'manage-site',  query: { access_id: this.$route.query.access_id, brand: employee_owner_business_data.slug }}" 
              class="nav-item"
              :class="{ active: $route.name === 'manage-site' }"
            >
              <div class="nav-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M2 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Manage Site</span>
            </router-link>


            <router-link 
              v-if="access_recieved.business_customers.read"
              :to="{ name: 'manage-customers',  query: { access_id: this.$route.query.access_id, brand: employee_owner_business_data.slug }}" 
              class="nav-item"
              :class="{ active: $route.name === 'manage-customers' }"
            >
              <div class="nav-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M2 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">manage-customers</span>
            </router-link>

            <router-link 
              v-if="access_recieved.generate_banner.read"
              :to="{ name: 'manage-generate-banner',  query: { access_id: this.$route.query.access_id , brand: employee_owner_business_data.slug }}" 
              class="nav-item"
              :class="{ active: $route.name === 'manage-generate-banner' }"
            >
              <div class="nav-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M2 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">manage-generate-banner</span>
            </router-link>

            <router-link 
              v-if="access_recieved.customer_messages.read"
              :to="{ name: 'manage-customer-messages',  query: { access_id: this.$route.query.access_id }}" 
              class="nav-item"
              :class="{ active: $route.name === 'manage-customer-messages' }"
            >
              <div class="nav-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M2 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">manage-customer-messages</span>
            </router-link>
            <!-- Manage Community Posts -->
            <!-- :to="{ name: 'manage-community-post',   query: { brand: employee_owner_business_data.slug } }"  -->
            <router-link 
            v-if="access_recieved.community.read"
            :to="{ name: 'manage-community-post',   query: { access_id: this.$route.query.access_id, brand: employee_owner_business_data.slug }}"  
              class="nav-item"
              :class="{ active: $route.name === 'manage-community-post' }"
            >
              <div class="nav-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Manage Community</span>
            </router-link>

            <!-- Manage Customer Requests -->
             
            <!-- :to="{ name: 'manage-customer-requests', query: { brand: employee_owner_business_data.slug }}"  -->
            <router-link 
              v-if="access_recieved.user_room_request.read"
              :to="{ name: 'manage-customer-requests',    query: { access_id: this.$route.query.access_id, brand: employee_owner_business_data.slug }}"  
              class="nav-item"
              :class="{ active: $route.name === 'manage-customer-requests' }"
            >
              <div class="nav-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                  <path d="M20 8V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M23 11H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Customer Requests</span>
            </router-link>

            <!-- <div class="nav-item" @click="this.$router.push('/manage-access/manage-business-analytics')">
              <div class="nav-icon-wrapper">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.81818 16C1.31818 16 0.890303 15.8261 0.534545 15.4782C0.178788 15.1304 0.000606061 14.7117 0 14.2222V1.77778C0 1.28889 0.178182 0.870518 0.534545 0.522666C0.890909 0.174815 1.31879 0.000592592 1.81818 0H7.27273C7.5303 0 7.74636 0.0853334 7.92091 0.256C8.09545 0.426666 8.18242 0.637629 8.18182 0.888888C8.18121 1.14015 8.09394 1.35141 7.92 1.52267C7.74606 1.69392 7.5303 1.77896 7.27273 1.77778H1.81818V14.2222H7.27273C7.5303 14.2222 7.74636 14.3075 7.92091 14.4782C8.09545 14.6489 8.18242 14.8598 8.18182 15.1111C8.18121 15.3624 8.09394 15.5736 7.92 15.7449C7.74606 15.9161 7.5303 16.0012 7.27273 16H1.81818ZM12.8864 8.88888H6.36364C6.10606 8.88888 5.8903 8.80355 5.71636 8.63288C5.54242 8.46222 5.45515 8.25125 5.45455 7.99999C5.45394 7.74873 5.54121 7.53777 5.71636 7.36711C5.89152 7.19644 6.10727 7.11111 6.36364 7.11111H12.8864L11.1818 5.44444C11.0152 5.28148 10.9318 5.08148 10.9318 4.84444C10.9318 4.6074 11.0152 4.4 11.1818 4.22222C11.3485 4.04444 11.5606 3.9517 11.8182 3.944C12.0758 3.93629 12.2955 4.02163 12.4773 4.2L15.7273 7.37777C15.9091 7.55555 16 7.76296 16 7.99999C16 8.23703 15.9091 8.44444 15.7273 8.62222L12.4773 11.8C12.2955 11.9778 12.0797 12.0631 11.83 12.056C11.5803 12.0489 11.3642 11.9561 11.1818 11.7778C11.0152 11.6 10.9358 11.389 10.9436 11.1449C10.9515 10.9007 11.0385 10.6969 11.2045 10.5333L12.8864 8.88888Z" fill="currentColor"/>
</svg>

              </div>
              <span class="nav-text" style="font-size: medium;color:orangered;font-weight:600">EXIT Business</span>
              
            </div> -->


          </nav>
        </div>
        
          
      </a-col>

      <!-- Content Area -->
      <a-col :xs="24" :sm="24" :md="18" :lg="18" class="content-area">
        <div class="content-wrapper">
          <!-- Child routes render here -->
          <router-view :key="$route.fullPath" :access_recieved="access_recieved"  />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'access_manager',
  
  data() {
    return {
      business_id: '',
      businessName: 'Loading...',
      businessLogo: '',
      access_recieved: null,
      employee_owner_business_data:null
    }
  },
  mounted(){
    this.fetchStaffAccess_granted()
    this.checkUserhaveAnyBusinessAccess()
  },
  created() {
    this.business_id = this.$route.params.business_id;
    
    this.fetchBusinessData();
  },
  
  watch: {
    '$route.params.business_id': {
      handler(newId) {
        if (newId) {
          this.business_id = newId;
          this.fetchBusinessData();
        }
      }
    }
  },
  
  methods: {
     async checkUserhaveAnyBusinessAccess(){
       try {
        const response = await fetch(`${this.$store.state.root_api}access-engine/api/check-employee-user/?access-id=${this.$route.query['access_id']}`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.success) {
          this.employee_owner_business_data=data.data
          console.log(this.employee_owner_business_data)
        }
      } catch (error) {
        console.error('Failed to check the business access :', error);
        this.$message?.error('Failed to check the business access for the user here');
      }

    },

    fetchBusinessData() {
      console.log('Fetching data for business:', this.business_id);
      
      // TODO: Replace with actual API call
      // Example:
      // this.$axios.get(`/api/business/${this.business_id}/access`)
      //   .then(response => {
      //     this.businessName = response.data.name;
      //     this.businessLogo = response.data.logo;
      //     this.access_recieved = response.data.permissions;
      //   })
      //   .catch(error => {
      //     console.error('Error fetching business data:', error);
      //   });
      
      // Temporary mock data
      this.businessName = `Business #${this.business_id}`;
    },
    
    async fetchStaffAccess_granted(){
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/staff-access-recieved/?access-id=${this.$route.query['access_id']}`,
          {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
          }
        );

        const data = await response.json();
        console.log(data)
        if (!data.error) {
          console.log("====================================")
          console.log(data)
          this.access_recieved=data.staff_user.access_received
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    },


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
  height: calc(100vh - 20px);
  overflow-y: auto;
}

.user-info {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.business-logo {
  width: 100px;
  height: 100px;
  margin: 0 auto 16px;
  position: relative;
}

.business-logo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e9ecef;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #f8f9fa;
  border: 3px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info h3 {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.business-id {
  margin: 0;
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
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
  cursor: pointer;
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

.nav-text {
  flex: 1;
  text-align: left;
}

.content-area {
  padding: 10px;
  padding-left: 0;
}

.content-wrapper {
  background: white;
  border-radius: 20px;
  border: 1px solid #e9ecef;
  min-height: calc(100vh - 20px);
  padding: 10px;
  overflow-y: auto;
}

/* Scrollbar styling */
.sidebar::-webkit-scrollbar,
.content-wrapper::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track,
.content-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.sidebar::-webkit-scrollbar-thumb,
.content-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.sidebar::-webkit-scrollbar-thumb:hover,
.content-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar-col {
    display: none;
  }
  
  .content-area {
    padding: 10px;
  }
}
</style>
