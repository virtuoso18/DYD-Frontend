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
        :data-source="requests" 
        :customRow="onRowClick"
        :pagination="false"
        :scroll="{ x: 1000 }"
        
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'id'">
            {{ record.id.toString().slice(-4) }}
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
                :src="$store.state.root_media_api + record.image_url" 
                alt="Room"
              />
              <div v-else class="no-image">No Image</div>
              <div class="request-text">
                {{ truncateText(record.message, 50) }}
              </div>
            </div>
          </template>
          
          <template v-else-if="column.key === 'generated_room'">
            <!-- {{record}} -->
            <div class="generated-room">
              <img 
                v-if="record.generated_image" 
                :src="this.$store.state.root_media_api+record.generated_image" 
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
            >
              {{ record.status }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'actions'">
            <div class="action-buttons">
              <a-button 
                v-if="record.status === 'Pending'"
                type="primary"
                size="small"
                @click.stop="processPhoto(record)"
                :loading="processingIds.includes(record.id)"
              >
                Process Photo
              </a-button>
              
              <a-button 
                v-if="record.status === 'Completed'"
                type="primary"
                size="small"
                @click.stop="processPhoto(record)"
                :loading="regeneratingIds.includes(record.id)"
              >
                <template #icon>
                  <ReloadOutlined />
                </template>
                Regenerate
              </a-button>
              
              
              <a-button 
                v-if="(record.status !== 'Rejected' ) && (record.status !== 'Completed' )"
                danger
                size="small"
                @click.stop="openRejectModal(record)"
                :loading="rejectingIds.includes(record.id)"
              >
                Reject
              </a-button>
            </div>
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
                :src="$store.state.root_media_api + request.image_url" 
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
              <span class="request-id">ID: {{ request.id.toString().slice(-4) }}</span>
              <a-tag :color="getStatusColor(request.status)">
                {{ request.status }}
              </a-tag>
            </div>
            
            <div class="request-email">{{ request.email }}</div>
            <div class="request-message">{{ truncateText(request.message, 80) }}</div>
            <div class="request-date">{{ formatDate(request.created_at) }}</div>
            
            <div class="card-actions">
              <a-button 
                v-if="request.status === 'Pending'"
                type="primary"
                size="small"
                @click.stop="processPhoto(request)"
                :loading="processingIds.includes(request.id)"
                block
              >
                Process Photo
              </a-button>
              
              <a-button 
                v-if="request.status === 'Completed'"
                type="primary"
                size="small"
                @click.stop="processPhoto(request)"
                :loading="regeneratingIds.includes(request.id)"
                block
              >
                <template #icon>
                  <ReloadOutlined />
                </template>
                Regenerate
              </a-button>
              
              <a-button 
                v-if="(record.status !== 'Rejected' ) && (record.status !== 'Completed' )"
                danger
                size="small"
                @click.stop="openRejectModal(request)"
                :loading="rejectingIds.includes(request.id)"
                block
                style="margin-top: 8px;"
              >
                Reject
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <a-modal
      v-model:open="rejectModalVisible"
      title="Reject Request"
      :confirm-loading="rejecting"
      @ok="handleReject"
      @cancel="closeRejectModal"
      :ok-button-props="{ disabled: !canReject }"
    >
      <div class="reject-form">
        <p><strong>Request ID:</strong> {{ selectedRequest?.id?.toString().slice(-4) }}</p>
        <p><strong>Email:</strong> {{ selectedRequest?.email }}</p>
        
        <a-form layout="vertical">
          <!-- <a-form-item 
            label="Type 'CONFIRM' to proceed with rejection:"
            :validate-status="confirmationError ? 'error' : ''"
            :help="confirmationError"
          >
            <a-input 
              v-model:value="confirmationText"
              placeholder="Type CONFIRM"
              @input="validateConfirmation"
            />
          </a-form-item> -->
          
          <a-form-item 
            label="Reason for rejection:"
            :validate-status="reasonError ? 'error' : ''"
            :help="reasonError"
          >
            <a-textarea 
              v-model:value="rejectReason"
              placeholder="Please provide a reason for rejection..."
              :rows="4"
              :maxlength="500"
              show-count
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

export default {
  name: 'RequestsList',
  components: {
    ReloadOutlined
  },
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
      // Loading states for different actions
      processingIds: [],
      regeneratingIds: [],
      rejectingIds: [],
      
      // Reject modal state
      rejectModalVisible: false,
      selectedRequest: null,
      confirmationText: '',
      rejectReason: '',
      rejecting: false,
      confirmationError: '',
      reasonError: '',
      
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: 80,
          sorter: (a, b) => a.id - b.id
        },
        {
          title: 'Request Date',
          key: 'date',
          width: 120,
          sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at)
        },
        {
          title: 'Requested Email',
          key: 'requester',
          width: 150
        },
        {
          title: 'Room Photo',
          key: 'room_photo',
          width: 300
        },
        {
          title: 'Generated Room',
          key: 'generated_room',
          width: 200
        },
        {
          title: 'Status',
          key: 'status',
          width: 100
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 200,
          fixed: 'right'
        }
      ]
    }
  },
  computed: {
    canReject() {
      return this.confirmationText.toUpperCase() === 'CONFIRM' && 
             this.rejectReason.trim().length > 0
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
    },


   
    async processPhoto(request) {
      try {
        this.processingIds.push(request.id)
        const response = await fetch(`${this.$store.state.root_api}engine/new-room-client-requested/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`

          },
          body: JSON.stringify({
            client_request_id: request.id,
          })
        })

        if (response.ok) {
          message.success('Photo processing started successfully')
          const responseData = await response.json();
          // Emit event to parent component if needed
          this.$emit('upload-success', responseData);
          this.$router.push({ name: 'update_catelogue', params: { id: responseData.room_id } });

        } else {
          throw new Error('Failed to process photo')
        }
      } catch (error) {
        console.error('Error processing photo:', error)
        message.error('Failed to process photo')
      } finally {
        this.processingIds = this.processingIds.filter(id => id !== request.id)
      }
    },

    async regenerate(request) {
      try {
        this.regeneratingIds.push(request.id)
        
        const response = await fetch(`${this.$store.state.root_api}room_request/business-owner-room-requests-api/regenerate/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            request_id: request.id
          })
        })

        if (response.ok) {
          message.success('Regeneration started successfully')
          this.$emit('refresh')
        } else {
          throw new Error('Failed to regenerate')
        }
      } catch (error) {
        console.error('Error regenerating:', error)
        message.error('Failed to regenerate room')
      } finally {
        this.regeneratingIds = this.regeneratingIds.filter(id => id !== request.id)
      }
    },

    openRejectModal(request) {
      this.selectedRequest = request
      this.rejectModalVisible = true
      this.confirmationText = ''
      this.rejectReason = ''
      this.confirmationError = ''
      this.reasonError = ''
    },

    closeRejectModal() {
      this.rejectModalVisible = false
      this.selectedRequest = null
      this.confirmationText = ''
      this.rejectReason = ''
      this.confirmationError = ''
      this.reasonError = ''
    },

    validateConfirmation() {
      if (this.confirmationText && this.confirmationText.toUpperCase() !== 'CONFIRM') {
        this.confirmationError = 'Please type "CONFIRM" exactly'
      } else {
        this.confirmationError = ''
      }
    },

    async handleReject() {
      // Validation
      // if (this.confirmationText.toUpperCase() !== 'CONFIRM') {
      //   this.confirmationError = 'Please type "CONFIRM" exactly'
      //   return
      // }

      if (!this.rejectReason.trim()) {
        this.reasonError = 'Rejection reason is required'
        return
      }

      try {
        this.rejecting = true
        this.rejectingIds.push(this.selectedRequest.id)

        const response = await fetch(`${this.$store.state.root_api}room_request/business-owner-room-requests-api/reject-room-requests-recieved/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            request_id: this.selectedRequest.id,
            reject_reason: this.rejectReason.trim()
          })
        })

        if (response.ok) {
          message.success('Request rejected successfully')
          this.closeRejectModal()
          this.$emit('refresh')
        } else {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to reject request')
        }
      } catch (error) {
        console.error('Error rejecting request:', error)
        message.error(error.message || 'Failed to reject request')
      } finally {
        this.rejecting = false
        this.rejectingIds = this.rejectingIds.filter(id => id !== this.selectedRequest?.id)
      }
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

.generated-room img {
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

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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
  margin-bottom: 16px;
}

.card-actions {
  margin-top: 16px;
}

/* Modal Styles */
.reject-form {
  margin-top: 16px;
}

.reject-form p {
  margin-bottom: 8px;
  color: #666;
}

/* Responsive */
@media (max-width: 768px) {
  .requests-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>