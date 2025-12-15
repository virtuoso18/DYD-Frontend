<template>
  <div class="main" v-if="page_view === 'list_all_requests'">
    <div className="hidden sm:block">

      <div class="header ">
       <h2
  className="!text-gray-700 p-2"
  :style="{
    fontFamily: 'Poppins',
    fontWeight: 500,
    fontStyle: 'normal',
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0%'
  }"
>
 Request
</h2>
        <div class=" ">
          <div class="">
        <a-input 
          v-model:value="searchQuery"
          placeholder="Search Product"
          @input="handleSearch"
        >
          <template #suffix>
            <search-outlined />
          </template>
        </a-input>
      </div>
        </div>
      </div>
    </div>

    <div className="sm:hidden">
      <div class=" !py-2 bg-white rounded-2xl ">

  <!-- HEADER -->
  <div class="header flex justify-between items-center">
    
    <!-- TITLE -->
    <h2 class="m-0 font-semibold !text-[18px] pr-2">
      Requests
    </h2>

    <!-- VIEW CONTROLS -->
    <div class=" flex border border-[#d9d9d9] rounded-md overflow-hidden">

      <!-- Search Box -->
      <div class="border-r border-[#d9d9d9]">
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Search Product"
            class="px-3 py-2 pl-9 w-30  border-none focus:ring-0 outline-none !text-[14px]"
          />
          <!-- Search icon -->
          <svg
            class="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      

    </div>
  </div>

</div>


    </div>
    <div className="pt-4">

      <a-tabs v-model:activeKey="activeKey" @change="handleTabChange">
        <a-tab-pane key="all" tab="All Request">
          <RequestsList 
            :requests="filteredRequests" 
            :loading="loading"
            :view-mode="viewMode"
            @record-clicked="recordClicked"
            @refresh="refreshRequests"
          />
        </a-tab-pane>
        <a-tab-pane key="Pending" tab="Pending">
          <RequestsList 
            :requests="filteredRequests" 
            :loading="loading"
            :view-mode="viewMode"
            @record-clicked="recordClicked"
            @refresh="refreshRequests"
          />
        </a-tab-pane>
        <a-tab-pane key="Completed" tab="Completed">
          <RequestsList 
            :requests="filteredRequests" 
            :loading="loading"
            :view-mode="viewMode"
            @record-clicked="recordClicked"
            @refresh="refreshRequests"
          />
        </a-tab-pane>
        <a-tab-pane key="Rejected" tab="Rejected">
          <RequestsList 
            :requests="filteredRequests" 
            :loading="loading"
            :view-mode="viewMode"
            @record-clicked="recordClicked"
            @refresh="refreshRequests"
          />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
  <div v-if="page_view==='request_details'">
<selectedRequest :selected_request="selected_request" @back-button-clicked="backButtonClicked"/>
  </div>
</template>

<script>
import { SearchOutlined } from '@ant-design/icons-vue'
import RequestsList from '@/components/dashboard/business/store/RequestsList.vue'
import selectedRequest from '@/components/dashboard/business/store/selectedRequest_details.vue'

export default {
  name: 'my_requests',
  components: {
    SearchOutlined,
    RequestsList,
    selectedRequest
  },
  data() {
    return {
      page_view:'list_all_requests',
      selected_request:null,

      activeKey: 'all',
      viewMode: 'list', // 'grid' or 'list'
      searchQuery: '',
      requests: [],
      loading: false
    }
  },
  computed: {
    
    filteredRequests() {
      let filtered = this.requests
      
      // Filter by tab
      if (this.activeKey !== 'all') {
        filtered = filtered.filter(request => request.status === this.activeKey)
      }
      
      // Filter by search
      if (this.searchQuery) {
        filtered = filtered.filter(request => 
          request.email?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          request.message?.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }
      
      return filtered
    }
  },
  
  mounted() {
    this.fetchRoomRequests()
  },
  
  methods: {
    backButtonClicked(){
       this.page_view='list_all_requests'
      this.selected_request=null
    },
    recordClicked(e){
      console.log(e)
      this.page_view='request_details'
      this.selected_request=e['record']
    },
    setViewMode(mode) {
      this.viewMode = mode
      console.log('View mode changed to:', mode)
    },
    
    handleTabChange(key) {
      this.activeKey = key
    },
    
    handleSearch() {
      // Search is handled in computed property
    },
    
    async refreshRequests() {
      await this.fetchRoomRequests()
    },
    
    async fetchRoomRequests() {
      this.loading = true
    
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${this.$store.state.root_api}room_request/business-owner-room-requests-api/room-requests-recieved/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Token ${token}` })
          }
        })
        
        const result = await response.json()
        
        if (response.ok && result.success) {
          this.requests = result.data || []
        } else {
          this.$message.error(result.message || 'Failed to fetch requests')
        }
        
      } catch (error) {
        this.$message.error('Failed to load requests')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.main {
  padding: 20px;
  background-color: white;
  border-radius: 20px;
  margin-top: 15px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-bottom: 20px; */
}

.header h2 {
  margin: 0;
  font-size: 24px; /* default for desktop */
  font-weight: 600;
}

/* Apply when screen is BELOW sm (max-width: 639px) */
@media (max-width: 639px) {
  .header h2 {
    font-size: 16px !important;
  }
}


.view-controls {
  display: flex;
  gap: 0;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}

.view-controls .ant-btn {
  border-radius: 0;
  border: none;
  box-shadow: none;
}

.view-controls .ant-btn:not(:last-child) {
  border-right: 1px solid #d9d9d9;
}

.view-controls .ant-btn.active {
  background-color: #1890ff;
  color: white;
}

.search-bar {
  margin-bottom: 20px;
  max-width: 300px;
  margin-left: auto;
}

.search-bar .ant-input {
  border-radius: 8px;
}
</style>