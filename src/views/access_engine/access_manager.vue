<template>
  <div>
    <!-- Loading State -->
    <div
      v-if="!access_recieved || isLoading"
      class="spinner-sec w-full h-[80vh] flex justify-center items-center"
    >
      <a-spin tip="Loading..."> </a-spin>
    </div>

    <!-- Main Dashboard -->
    <div class="dashboard-container" v-else>
      <a-row class="dashboard-content">
        <!-- Sidebar -->
        <a-col :xs="0" :sm="0" :md="6" :lg="6" class="sidebar-col">
          <div class="sidebar">
            <div class="user-info">
              <div class="business-logo">
                <img
                  v-if="employee_owner_business_data?.banner_picture"
                  :src="
                    this.$store.state.root_media_api +
                    employee_owner_business_data?.banner_picture
                  "
                  alt="Business Logo"
                  @error="handleImageError"
                />
                <div v-else class="logo-placeholder">
                  <span>No Image</span>
                </div>
              </div>
              <h3>{{ employee_owner_business_data?.name || 'Business Name' }}</h3>
              <p class="business-id">
                ID: {{ employee_owner_business_data?.email || 'N/A' }}
              </p>
            </div>

            <!-- Navigation Menu -->
            <nav class="dashboard-nav">
              <!-- Overview -->
              <router-link
                :to="{
                  name: 'business-overview',
                  query: {
                    access_id: this.$route.query.access_id,
                    brand: employee_owner_business_data?.slug,
                  },
                }"
                class="nav-item"
                :class="{ active: $route.name === 'business-overview' }"
              >
                <div class="nav-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <rect
                      x="14"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                  </svg>
                </div>
                <span class="nav-text">Overview</span>
              </router-link>

              <!-- Manage Products -->
              <router-link
                v-if="access_recieved?.product?.read"
                :to="{
                  name: 'manage-products',
                  query: {
                    access_id: this.$route.query.access_id,
                    brand: employee_owner_business_data.slug,
                  },
                }"
                class="nav-item"
                :class="{ active: $route.name === 'manage-products' }"
              >
                <div class="nav-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M3.27002 6.96L12 12.01L20.73 6.96"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12 22.08V12"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <span class="nav-text">Manage Products</span>
              </router-link>

              <!-- Manage Site -->
              <router-link
                v-if="access_recieved?.business?.read"
                :to="{
                  name: 'manage-site',
                  query: {
                    access_id: this.$route.query.access_id,
                    brand: employee_owner_business_data.slug,
                  },
                }"
                class="nav-item"
                :class="{ active: $route.name === 'manage-site' }"
              >
                <div class="nav-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <path
                      d="M2 12H22"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <span class="nav-text">Manage Site</span>
              </router-link>

              <router-link
                v-if="access_recieved?.business_customers?.read"
                :to="{
                  name: 'manage-customers',
                  query: {
                    access_id: this.$route.query.access_id,
                    brand: employee_owner_business_data.slug,
                  },
                }"
                class="nav-item"
                :class="{ active: $route.name === 'manage-customers' }"
              >
                <div class="nav-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <path
                      d="M2 12H22"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <span class="nav-text">Manage Customers</span>
              </router-link>

              <router-link
                v-if="access_recieved?.generate_banner?.read"
                :to="{
                  name: 'manage-generate-banner',
                  query: {
                    access_id: this.$route.query.access_id,
                    brand: employee_owner_business_data.slug,
                  },
                }"
                class="nav-item"
                :class="{ active: $route.name === 'manage-generate-banner' }"
              >
                <div class="nav-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <path
                      d="M2 12H22"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <span class="nav-text">Generate Banner</span>
              </router-link>

              <router-link
                v-if="access_recieved?.customer_messages?.read"
                :to="{
                  name: 'manage-customer-messages',
                  query: { access_id: this.$route.query.access_id },
                }"
                class="nav-item"
                :class="{ active: $route.name === 'manage-customer-messages' }"
              >
                <div class="nav-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <path
                      d="M2 12H22"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <span class="nav-text">Customer Messages</span>
              </router-link>

              <router-link
                v-if="access_recieved?.community?.read"
                :to="{
                  name: 'manage-community-post',
                  query: {
                    access_id: this.$route.query.access_id,
                    brand: employee_owner_business_data.slug,
                  },
                }"
                class="nav-item"
                :class="{ active: $route.name === 'manage-community-post' }"
              >
                <div class="nav-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <span class="nav-text">Manage Community</span>
              </router-link>

              <router-link
                v-if="access_recieved?.user_room_request?.read"
                :to="{
                  name: 'manage-customer-requests',
                  query: {
                    access_id: this.$route.query.access_id,
                    brand: employee_owner_business_data.slug,
                  },
                }"
                class="nav-item"
                :class="{ active: $route.name === 'manage-customer-requests' }"
              >
                <div class="nav-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <circle
                      cx="8.5"
                      cy="7"
                      r="4"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <path
                      d="M20 8V14"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M23 11H17"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <span class="nav-text">Customer Requests</span>
              </router-link>
            </nav>
          </div>
        </a-col>

        <!-- Content Area -->
        <a-col :xs="24" :sm="24" :md="18" :lg="18" class="content-area">
          <div class="content-wrapper">
            <router-view :key="$route.fullPath" :access_recieved="access_recieved"  />
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "access_manager",

  data() {
    return {
      business_id: "",
      access_recieved: null,
      employee_owner_business_data: null,
      isLoading: true,
    };
  },

  mounted() {
    console.log("✅ Component mounted");
    console.log("📍 Route query:", this.$route.query);
    this.initializeData();
  },

  watch: {
    "$route.query.access_id": {
      handler(newVal) {
        console.log("👀 Watch triggered, access_id:", newVal);
        if (newVal) {
          this.initializeData();
        }
      },
    },
  },

  methods: {
    async initializeData() {
      console.log("🚀 Starting data initialization");
      this.isLoading = true;
      this.business_id = this.$route.query.access_id;

      if (!this.business_id) {
        console.error("❌ No access_id in route query");
        this.$message?.error("Missing access_id in URL");
        this.isLoading = false;
        return;
      }

      try {
        console.log("📡 Fetching staff access...");
        await this.fetchStaffAccess_granted();

        console.log("📡 Fetching business data...");
        await this.checkUserhaveAnyBusinessAccess();

        console.log("✅ All data loaded successfully");
      } catch (error) {
        console.error("❌ Error during initialization:", error);
        this.$message?.error("Failed to load dashboard");
      } finally {
        this.isLoading = false;
      }
    },

    async checkUserhaveAnyBusinessAccess() {
      const accessId = this.$route.query.access_id;
      const token = localStorage.getItem("token");
      const apiUrl = `${this.$store.state.root_api}access-engine/api/check-employee-user/?access-id=${accessId}`;

      console.log("📍 API URL:", apiUrl);
      console.log("🔑 Token exists:", !!token);

      if (!token) {
        console.error("❌ No token in localStorage");
        throw new Error("Authentication token not found");
      }

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("📊 Response status:", response.status);

        if (!response.ok) {
          console.error("❌ HTTP Error:", response.status, response.statusText);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("📦 Business data received:", data);

        if (data.success && data.data) {
          this.employee_owner_business_data = data.data;
          console.log("✅ Business data set");
        } else {
          console.error("❌ Response success=false or no data:", data);
          throw new Error(data.message || "Failed to fetch business data");
        }
      } catch (error) {
        console.error("❌ Error fetching business data:", error.message);
        this.$message?.error(`Business data error: ${error.message}`);
        throw error;
      }
    },

    async fetchStaffAccess_granted() {
      const accessId = this.$route.query.access_id;
      const token = localStorage.getItem("token");
      const apiUrl = `${this.$store.state.root_api}access-engine/api/staff-access-recieved/?access-id=${accessId}`;

      console.log("📍 API URL:", apiUrl);
      console.log("🔑 Token exists:", !!token);

      if (!token) {
        console.error("❌ No token in localStorage");
        throw new Error("Authentication token not found");
      }

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("📊 Response status:", response.status);

        if (!response.ok) {
          console.error("❌ HTTP Error:", response.status, response.statusText);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("📦 Access data received:", data);

        if (data.error) {
          console.error("❌ API returned error:", data.error);
          throw new Error(data.error);
        }

        if (data.staff_user?.access_received) {
          this.access_recieved = data.staff_user.access_received;
          console.log("✅ Access permissions set:", this.access_recieved);
        } else {
          console.error("❌ No access data in response", data);
          throw new Error("No access data received");
        }
      } catch (error) {
        console.error("❌ Error fetching staff access:", error.message);
        this.$message?.error(`Access error: ${error.message}`);
        throw error;
      }
    },

    handleImageError() {
      console.warn("⚠️ Failed to load business image");
    },
  },
};
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
  color: #999;
  font-size: 12px;
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

.spinner-sec {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  width: 100%;
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