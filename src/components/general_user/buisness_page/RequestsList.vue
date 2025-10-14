<template>
  <div class="requests-container">
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