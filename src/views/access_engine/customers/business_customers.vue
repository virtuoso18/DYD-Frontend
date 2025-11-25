
<template>
<!-- {{ access_recieved }} -->
    <div class="main">
        <div v-if="view === 'list'" class="customers-page">
             <h3>Business Customers</h3>

            <!-- Loading State -->
            <a-spin v-if="loading" size="large" class="loading-spinner" />

            <!-- Customers Table -->
              <a-table :columns="columns" :data-source="customers" :loading="loading" bordered>
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
          :access_recieved="access_recieved.user_room_request"
          @record-clicked="recordClicked"
          @refresh="refreshRequests"
          />
          <!-- :access_recieved= -->
        </div>
        <div  v-if="view === 'selected_request'" class="customers-page">
            <selectedRequest :selected_request="selected_request" @back-button-clicked="backButtonClicked"/>

        </div>

    </div>
</template>
<script>
import RequestsList from '@/views/access_engine/customers/components/RequestsList.vue'
import selectedRequest from '@/views/access_engine/customers/components/selectedRequest_details.vue'

export default {
    name:'customers',
    components: {
      RequestsList,
      selectedRequest
    },
    props:{
        access_recieved:Object,
        business:Object
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
                    this.$store.state.root_api + 'access-engine/api/business-customers/all-customers/?access-id='+this.$route.query['access_id'],
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
                console.log("------------------==================-------------------------")
                console.log(data)
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
                    this.$store.state.root_api + 'access-engine/api/business-customers/all-customers/?access-id='+this.$route.query['access_id'],
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
/* .main{
    margin-top:15px;
    border:1px solid rgba(0,0,0,0.1);
    height:100%;
    padding:10px;
    background-color: white;
    border-radius:15px;
} */
</style>