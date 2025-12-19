<template>

    <div class="main !my-3 hidden md:block">
        <div v-if="view === 'list'" class="customers-page">
<h3 className="!text-gray-700 p-2"
  style="
    font-family: Poppins;
    font-weight: 500;
    font-style: normal;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0;
  "
>
  Customers
</h3>


            <!-- Loading State -->
            <a-spin v-if="loading" size="large" class="loading-spinner" />

            <!-- Customers Table -->
              <a-table :columns="columns" :data-source="customers" :loading="loading" bordered :pagination="false">
                <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'customer_name'">
                    <div style="display: flex; align-items: center; gap: 12px;" @click="fetchCustomerRequests(record)">

                        <a-avatar 
                        :src="this.$store.state.root_media_api+record.profile_picture" 
                        :size="40"
                    >
                        {{ getInitials(text) }}
                    </a-avatar>
                    <span>{{ text }}</span>
                    </div>
                </template>

                <template v-else-if="column.dataIndex === 'email'">
                    <a>{{ text }}</a>
                </template>

                <template v-else-if="column.dataIndex === 'Joined_date'">
                    {{ formatDate(text) }}
                </template>
                </template>
                
                <!-- <template #title>Customer List</template> -->
                <!-- <template #footer>Total Customers: {{ customers.length }}</template> -->
  </a-table>
        </div>

        <div v-if="view === 'details'" class="customers-page">
<!-- {{ customer_requests}} -->
  <div style="display:flex;justify-content: space-between;padding-top:15px;padding-bottom:15px;">

<a-button 
  type="text" 
  size="large"
  @click="backButtonClickedUser_list" 
  style="border-radius: 8px; display: flex; align-items: center; gap: 12px; padding: 8px 12px; color: #666; font-weight: 500; transition: all 0.3s;"
  @mouseenter="$event.currentTarget.style.backgroundColor='#f5f5f5'" 
  @mouseleave="$event.currentTarget.style.backgroundColor='transparent'">
  
  <!-- Back Arrow Icon -->
  <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 10L1 5.5L5 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  
  <!-- User Info Container -->
  <div style="display: flex; align-items: center; gap: 12px;">
    <!-- Avatar -->
    <a-avatar 
      :src="$store.state.root_media_api + selected_user.profile_picture" 
      :size="40">
      {{ getInitials(selected_user.customer_name) }}
    </a-avatar>
    
    <!-- User Details -->
    <div style="text-align: left; line-height: 1.3;">
      <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #262626;">
        {{ selected_user.customer_name }}
      </h3>
      <p style="margin: 0; font-size: 12px; color: #8c8c8c;">
        {{ selected_user.email }}
      </p>
    </div>
  </div>
</a-button>

<div>
    <h3 style="margin:0">Joined Date</h3>
   <p>{{ formatDate(selected_user.Joined_date) }}</p> 

</div>

</div>

  <a-row>
        <a-col :span="12" style="display: flex;gap:5px;;">
             
                
        </a-col>
        <a-col :span="12"></a-col>
    </a-row>
  
<RequestsList 
          :requests="customer_requests" 
          :loading="loading"
          :view-mode="viewMode" 
          @record-clicked="recordClicked"
          @refresh="refreshRequests"
        />
        </div>
        <div  v-if="view === 'selected_request'" class="customers-page">
            <selectedRequest :selected_request="selected_request" @back-button-clicked="backButtonClicked"/>

        </div>

    </div>

<div
  class=" md:hidden "
  style="
    border: 1px solid rgba(0, 0, 0, 0.1);
    height: auto;
    padding: 2px;
    background-color: white;
  "
>
  <!-- Mobile View -->
  <div v-if="view === 'list'" class="p-4">
    <!-- Header -->
    <h3 class="text-gray-700 text-lg font-semibold mb-4" style="font-family: Poppins;">
      Customers
    </h3>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <a-spin size="large" />
    </div>

    <!-- Customer Cards -->
    <div v-else class="!space-y-4 ">
      <div
        v-for="customer in customers"
        :key="customer.id"
        @click="fetchCustomerRequests(customer)"
        class="bg-white rounded-xl  shadow-sm border border-gray-200 p-4 active:scale-98 transition-transform cursor-pointer"
      >
        <!-- Row 1: Avatar + Name -->
        <div class="flex items-center gap-3 !mb-2">
          <a-avatar 
            :src="$store.state.root_media_api + customer.profile_picture" 
            :size="48"
            class="flex-shrink-0"
          >
            {{ getInitials(customer.customer_name) }}
          </a-avatar>
          <div class="flex-1  min-w-0">
            <h4 class="text-base font-semibold text-gray-900 truncate">
              {{ customer.customer_name }}
            </h4>
          </div>
          <!-- Arrow Icon -->
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-gray-400 flex-shrink-0">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <!-- Row 2: Email -->
        <div class="flex items-center gap-2 !mb-2 px-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-gray-400 flex-shrink-0">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="text-sm text-gray-600 truncate">{{ customer.email }}</span>
        </div>

        <!-- Row 3: Joined Date -->
        <div class="flex items-center gap-2 mb-3 px-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-gray-400 flex-shrink-0">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="text-sm text-gray-600">Joined {{ formatDate(customer.Joined_date) }}</span>
        </div>

        <!-- Row 4: Stats (if available) -->
        <div v-if="customer.total_simulations !== undefined" class="flex items-center justify-between pt-3 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-blue-500">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-xs text-gray-500">Total Simulations</span>
          </div>
          <span class="text-sm font-semibold text-gray-900">{{ customer.total_simulations || 0 }}</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && customers.length === 0" class="text-center py-12">
        <a-empty description="No customers found" />
      </div>
    </div>
  </div>

  <!-- Mobile Details View -->
  <div v-if="view === 'details'" class="bg-gray-50 min-h-screen">
    <!-- Mobile Header with Back Button -->
    <div class="bg-white border-b border-gray-200 ">
      <div class="p-4">
        <button 
          @click="backButtonClickedUser_list" 
          class="flex items-center gap-3 w-full !mb-3 active:opacity-70 transition-opacity"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-gray-600">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="text-sm font-medium text-gray-600">Back to Customers</span>
        </button>

        <!-- User Card -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
          <div class="flex items-center gap-4 mb-4">
            <a-avatar 
              :src="$store.state.root_media_api + selected_user.profile_picture" 
              :size="64"
              class="border-2 border-white shadow-sm"
            >
              {{ getInitials(selected_user.customer_name) }}
            </a-avatar>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-gray-900 mb-1 truncate">
                {{ selected_user.customer_name }}
              </h3>
              <p class="text-sm text-gray-600 truncate">{{ selected_user.email }}</p>
            </div>
          </div>

          <!-- Joined Date Badge -->
          <div class="bg-white rounded-lg px-4 !my-3 py-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="text-blue-500">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span class="text-xs font-medium text-gray-600">Joined Date</span>
            </div>
            <span class="text-sm font-semibold text-gray-900">
              {{ formatDate(selected_user.Joined_date) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Requests List -->
    <div class="p-4 ">
      <RequestsList 
        :requests="customer_requests" 
        :loading="loading"
        :view-mode="viewMode" 
        @record-clicked="recordClicked"
        @refresh="refreshRequests"
      />
    </div>
  </div>

  <!-- Mobile Selected Request View -->
  <div v-if="view === 'selected_request'" class="bg-gray-50 min-h-screen">
    <selectedRequest 
      :selected_request="selected_request" 
      @back-button-clicked="backButtonClicked"
    />
  </div>
</div>

</template>
<script>
import RequestsList from '@/components/store/RequestsList.vue'
import selectedRequest from '@/components/store/selectedRequest_details.vue'

export default {
    name:'customers',
    components: {
      RequestsList,
      selectedRequest
    },
    data(){return {
        view:'list',
        loading:false,
        error:null,
        customers:[],
        requests:[],
        selected_user:null,
        customer_requests:null,
        selected_request:null,

        columns : [
            {
                title: 'Customer Name',
                dataIndex: 'customer_name',
                key: 'customer_name',
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
            },
  {
    title: 'Joined Date',
    dataIndex: 'Joined_date',
    key: 'Joined_date',
  },
  {
    title: 'Total Simulation',
    dataIndex: 'rooms_count',
    key: 'rooms_count',
    align: 'center',
  },
]
    }},
    mounted(){
        this.fetchCustomers()
    },
    methods:{
        
    backButtonClickedUser_list(){
       this.view='list'
      this.customer_requests=null
    },
    backButtonClicked(){
       this.view='details'
      this.selected_request=null
    },
    recordClicked(e){
      console.log(e)
      this.view='selected_request'
      this.selected_request=e['record']
    },
        
// Get initials from name for fallback avatar
getInitials  (name)  {
  if (!name || name === 'Anonymous User') return 'AU';
  const names = name.split(' ');
  if (names.length >= 2) {
    return names[0][0] + names[names.length - 1][0];
  }
  return name.substring(0, 2).toUpperCase();
},

        formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
},
        async fetchCustomers() {
            this.loading = true;
            this.error = null;

            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(
                    this.$store.state.root_api + 'room_request/api/all-customers/',
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                this.customers = data.customers ;

            } catch (err) {
                console.error('Error fetching customers:', err);
                this.error = err.message || 'Failed to load customers';
                this.$message.error(this.error);
            } finally {
                this.loading = false;
            }
        },

        async fetchCustomerRequests(record){
            this.loadingRequests = true;

            try {
                const token = localStorage.getItem('token');
                
                const response = await fetch(
                    this.$store.state.root_api + 'room_request/api/all-customers/',
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: record.email
                        })
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                this.selected_user=record

                const data = await response.json();
                console.log(data)
                this.view='details'
                this.customer_requests= data.requests_data

            } catch (err) {
                console.error('Error fetching requests:', err);
                this.$message.error('Failed to load customer requests');
            } finally {
                this.loadingRequests = false;
            }
        },

        // async fetchCustomerRequests(customer) {
        //     this.loadingRequests = true;

        //     try {
        //         const token = localStorage.getItem('token');
                
        //         const response = await fetch(
        //             this.$store.state.root_api + 'room_request/api/all-customers/',
        //             {
        //                 method: 'POST',
        //                 headers: {
        //                     'Authorization': `Token ${token}`,
        //                     'Content-Type': 'application/json'
        //                 },
        //                 body: JSON.stringify({
        //                     customer_identifier: email
        //                 })
        //             }
        //         );

        //         if (!response.ok) {
        //             throw new Error(`HTTP error! status: ${response.status}`);
        //         }

        //         const data = await response.json();
        //         this.requests = data.requests || [];

        //     } catch (err) {
        //         console.error('Error fetching requests:', err);
        //         this.$message.error('Failed to load customer requests');
        //     } finally {
        //         this.loadingRequests = false;
        //     }
        // },
    }
}
</script>
<style scoped>
.main{
    
    border:1px solid rgba(0,0,0,0.1);
    height:100vh;
    padding:10px;
    background-color: white;
    border-radius:15px;
}
</style>