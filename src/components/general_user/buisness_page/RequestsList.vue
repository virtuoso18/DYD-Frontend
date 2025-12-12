<template>
  <div class="hidden sm:block requests-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <a-spin size="large" />
    </div> 
    
    <!-- Empty State -->
    <div v-else-if="!requests || requests.length === 0" class="empty-state">
      <a-empty description="No requests found" />
    </div>
    
    <!-- List View -->
    <div v-else-if="viewMode === 'list'" class="list-view">
      <a-table 
        :columns="columns" 
        :customRow="onRowClick"

        :data-source="requests" 
        :pagination="false"
        :scroll="{ x: 800 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'id'">
            {{ record.id.slice(-0,4) }}
          </template>
          
          <template v-else-if="column.key === 'date'">
            {{ formatDate(record.created_at) }}
          </template>
          
          <template v-else-if="column.key === 'requester'">
            {{ record.email }}
          </template>
          
          <template v-else-if="column.key === 'room_photo'">
            <div class="room-photo">
              <img 
                v-if="record.image_url" 
                :src="this.$store.state.root_media_api + record.image_url" 
                alt="Room"
              />
              <div v-else class="no-image">No Image</div>
              <div class="request-text">
                {{ truncateText(record.message, 50) }}
              </div>
            </div>
          </template>
          
          <template v-else-if="column.key === 'generated_room'">
            <div class="generated-room">
              <a-image
              style="width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e8e8e8;"
                v-if="record.generated_image" 
                :src="this.$store.state.root_media_api +record.generated_image" 
                alt="Generated"
              />
              <div v-else class="pending-generation">-</div>
              <div v-if="record.generated_image" class="generation-date">
                {{ formatDate(record.updated_at) }}
              </div>
            </div>
          </template>
          
          <template v-else-if="column.key === 'status'">
            <a-tag 
              :color="getStatusColor(record.status)"
              v-if="record.status === 'Completed'"
            >
              View
            </a-tag>
            <a-tag 
              :color="getStatusColor(record.status)"
              v-else
            >
              {{ record.status }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </div>
    
    <!-- Grid View -->
    <div v-else class="grid-view">
      <div class="requests-grid">
        <div 
          v-for="request in requests" 
          :key="request.id"
          class="request-card"
        >
          <div class="card-images">
            <div class="original-image">
              <img 
                v-if="request.image_url" 
                :src="$store.state.root_api + request.image_url" 
                alt="Original"
              />
              <div v-else class="no-image">No Image</div>
            </div>
            <div class="generated-image">
              <img 
                v-if="request.generated_image" 
                :src="this.$store.state.root_media_api+request.generated_image" 
                alt="Generated"
              />
              <div v-else class="pending">Pending</div>
            </div>
          </div>
          
          <div class="card-content">
            <div class="card-header">
              <span class="request-id">ID: {{ request.id.slice(-0,4) }}</span>
              <a-tag :color="getStatusColor(request.status)">
                {{ request.status }}
              </a-tag>
            </div>
            
            <div class="request-email">{{ request.email }}</div>
            <div class="request-message">{{ truncateText(request.message, 80) }}</div>
            <div class="request-date">{{ formatDate(request.created_at) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
 <div class="sm:hidden  py-4">
  <!-- Loading State -->
  <div v-if="loading" class="flex justify-center items-center py-16">
    <a-spin size="large" />
  </div> 
  
  <!-- Empty State -->
  <div v-else-if="!requests || requests.length === 0" class="py-16">
    <a-empty description="No requests found" />
  </div>
  
  <!-- Mobile Cards View -->
  <div v-else class="space-y-1 !gap-4 ">
    <div 
      v-for="request in requests" 
      :key="request.id"
      class="bg-white rounded-xl border   border-gray-200 !mb-4 overflow-hidden "
      @click="onRowClick(request)"
    >
      <!-- Header: ID and Date -->
      <div class="flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <span class="label-text text-sm font-semibold text-gray-900">Request ID:</span>
          <span class="text-[16px] font-extrabold text-black">{{ request.id.slice(-4) }}</span>
        </div>
        <span class="label-text text-xs text-gray-500">{{ formatDate(request.created_at) }}</span>
      </div>

      <!-- Room Photo Section -->
      <div class="px-4 py-3 border-b border-gray-100">
  <div class="flex items-start justify-between gap-3">
    <!-- Left: Room photo label -->
    <p class="label-text text-sm font-medium text-gray-700">Room photo:</p>
    
    <!-- Right: Image and Description wrapper -->
    <div class="flex-shrink-0 w-[245px]">
      <!-- Image -->
      <img 
        v-if="request.image_url" 
        :src="this.$store.state.root_media_api + request.image_url" 
        alt="Room"
        class="w-full h-[160px] rounded-lg !mb-2 object-cover border border-gray-200"
      />
      <div v-else class="w-full h-[160px] rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
        <span class="text-xs text-gray-400">No Image</span>
      </div>
      
      <!-- Description below image - same width -->
      <p class="text-[12px]  font-family-poppins tracking-tight text-gray-600 mt-3 line-clamp-3 text-left">
        {{ request.message || 'Please create my space with you best sofa and chair...' }}
      </p>
    </div>
  </div>
</div>


      <!-- Generated Room Section -->
      <div class="px-4 py-3 border-b border-gray-100">
        <div class="flex items-start gap-3">
          <!-- Left: Text and Date -->
          <div class="flex-1 min-w-0">
            <p class="label-text text-sm font-medium text-gray-700 mb-2">Generate room:</p>
            <p class="label-text !text-[10px] text-gray-500">
              {{ request.generated_image ? formatDate(request.updated_at) : 'Processing...' }}
            </p>
          </div>
          
          <!-- Right: Generated Image -->
          <div class="flex-shrink-0">
            <a-image
              v-if="request.generated_image" 
              :src="this.$store.state.root_media_api + request.generated_image" 
              alt="Generated"
              class="w-[45px] h-[60px]  rounded-lg object-cover border border-gray-200"
              style="width:245px"
            />
            <div v-else class="w-[45px] h-[60px] rounded-lg bg-gray-50 flex items-center justify-center border border-dashed border-gray-300">
              <span class="!text-[9px] label-text text-gray-400">Pending</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Requested To Section -->
      <div class="px-4 py-2 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <span class="text-xs label-text text-gray-500">Requested to &nbsp;:</span>
          <div class="flex items-center gap-1">
            <img 
              src="/alumawhite.png"
              alt="User"
              class=" w-10"
            />
            <span class="text-xs label-text font-medium text-gray-900">
              {{ request.requested_to_name || 'Aluma' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Status Section -->
      <div class="px-4 py-3 bg-gray-50">
        <a-tag 
          :color="getStatusColor(request.status)"
          class="!m-0 !rounded-full !w-full !text-center !font-family-poppins  !py-1"
        >
          {{ request.status }}
        </a-tag>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'RequestsList',
  props: {
    requests: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    viewMode: {
      type: String,
      default: 'list'
    }
  },
  data() {
    return {
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: 80,
          sorter: (a, b) => a.id - b.id
        },
        {
          title: 'Request date',
          key: 'date',
          width: 120,
          sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at)
        },
        {
          title: 'Request to',
          key: 'requester',
          width: 150
        },
        {
          title: 'Room photo',
          key: 'room_photo',
          width: 300
        },
        {
          title: 'Generated room',
          key: 'generated_room',
          width: 200
        },
        {
          title: 'Status',
          key: 'status',
          width: 120
        }
      ]
    }
  },
  methods: {
     onRowClick(record) {
      return {
        onClick: () => {
          console.log("Clicked row ID:", record.id);
          this.$emit('record-clicked',{'id':record.id,'record':record})
          // if you want to emit or do something else, you can:
          // this.$emit("row-selected", record.id)
        },
         style: {
          cursor: "pointer",   // 👈 makes the cursor change
        }
      };
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    },
    
    getStatusColor(status) {
      const colors = {
        'Pending': 'orange',
        'Completed': 'blue',
        'Rejected': 'red'
      }
      return colors[status] || 'default'
    },
    
    truncateText(text, maxLength = 100) {
      if (!text) return 'No message provided'
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }
  }
}
</script>

<style scoped>
.requests-container {
  padding: 16px 0;
}

.loading-container {
  text-align: center;
  padding: 60px 0;
}

.empty-state {
  padding: 60px 0;
  text-align: center;
}

/* List View Styles */
.list-view {
  background: white;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.room-photo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.room-photo img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.label-text {
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
  color: #4D4D4D;
}

.no-image {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 12px;
  color: #999;
}

.request-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
}

.generated-room {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.generated-room-image {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.pending-generation {
  width: 80px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 14px;
  color: #999;
}

.generation-date {
  font-size: 12px;
  color: #666;
}

/* Grid View Styles */
.requests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.request-card {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;
}

.request-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-images {
  display: flex;
  height: 200px;
}

.original-image, .generated-image {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.original-image {
  border-right: 1px solid #e8e8e8;
}

.card-images img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-images .no-image,
.card-images .pending {
  color: #999;
  font-size: 14px;
}

.card-content {
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.request-id {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.request-email {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #262626;
}

.request-message {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 12px;
}

.request-date {
  font-size: 12px;
  color: #999;
}

/* Responsive */
@media (max-width: 768px) {
  .requests-grid {
    grid-template-columns: 1fr;
  }
}
</style>