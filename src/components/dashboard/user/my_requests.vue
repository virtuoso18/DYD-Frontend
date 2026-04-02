<template>

  <div className="sm:!py-3 !pt-14  -translate-y-15 md:translate-y-0">

    <div 
      class="
    
             sm:main 
             min-h-[100vh] 
             md:min-h-[100vh] 
             md:border border-gray-200 
             
             sm:rounded-[15px] 
             p-4 
             
             bg-white
             border-gray-200 
             xl:min-h-[100vh] 
             2xl:min-h-[100vh]"
      v-if="page_view === 'list_all_requests'"
    >
    
    
        <div class="header pt-4 md:pt-0">
<h3
  className="pr-2 sm:pr-0"
   style="
            font-family: Poppins, sans-serif;
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;
            letter-spacing: 0;
          "
        
>
  Requests
</h3>
          <div class="">
            <!-- <div class="">
          <a-input 
            v-model:value="searchQuery"
            placeholder="Search Product"
            @input="handleSearch"
          >
            <template #suffix>
              <search-outlined />
            </template>
          </a-input>
        </div>&nbsp; -->
            <!-- <a-button 
              :type="viewMode === 'grid' ? 'primary' : 'default'"
              @click="setViewMode('grid')"
              :class="{ active: viewMode === 'grid' }"
              style="
    font-family: Poppins;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0;
    text-align: center;
  "
            >
              Grid
            </a-button>
            <a-button 
              :type="viewMode === 'list' ? 'primary' : 'default'"
              @click="setViewMode('list')"
              :class="{ active: viewMode === 'list' }"
              style="
    font-family: Poppins;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0;
    text-align: center;
  "
            >
              List
            </a-button> -->
          </div>
        </div>
    
        
    
        <a-tabs v-model:activeKey="activeKey" @change="handleTabChange">
          <a-tab-pane key="all" 
          tab="All Request"
          >
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
import RequestsList from '@/components/general_user/buisness_page/RequestsList.vue'
import selectedRequest from '@/components/general_user/buisness_page/selectedRequest_details.vue'

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
        const response = await fetch(`${this.$store.state.root_api}room_request/api/room-request/`, {
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
  font-size: 24px;
  font-weight: 600;
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