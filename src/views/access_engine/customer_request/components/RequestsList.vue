<template>
{{ brand }}<br>
{{ access_recieved }}
  <div v-if="!access_recieved?.read" class="access-denied">
    <a-result
      status="403"
      title="Access Denied"
      sub-title="You don't have permission to view this content"
    />
  </div>

  <div v-else class="requests-container">
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
        :custom-row="onRowClick"
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
                v-if="canProcess(record)"
                type="primary"
                size="small"
                @click.stop="processPhoto(record)"
                :loading="processingIds.includes(record.id)"
              >
                Process Photo
              </a-button>
              
              <a-button 
                v-if="canRegenerate(record)"
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
                v-if="canReject(record)"
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
                v-if="canProcess(request)"
                type="primary"
                size="small"
                @click.stop="processPhoto(request)"
                :loading="processingIds.includes(request.id)"
                block
              >
                Process Photo
              </a-button>
              
              <a-button 
                v-if="canRegenerate(request)"
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
                v-if="canReject(request)"
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

    <!-- Enhanced Reject Modal -->
    <a-modal 
      v-model:open="rejectModalVisible"
      title=""
      :footer="null"
      :closable="!rejecting"
      width="500px"
      @cancel="closeRejectModal"
    >
      <template #title>
        <div class="modal-header">
          <div class="modal-title-content">
            <h3>Reject Request</h3>
            <p class="modal-subtitle">{{ selectedRequest?.id?.toString().slice(-4) }}</p>
          </div>
        </div>
      </template>

      <div class="reject-modal-content">
        <!-- Request Info Card -->
        <div class="info-card">
          <div class="info-row">
            <span class="info-label">Request ID:</span>
            <span class="info-value">{{ selectedRequest?.id?.toString().slice(-4) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">{{ selectedRequest?.email }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Status:</span>
            <a-tag :color="getStatusColor(selectedRequest?.status)">
              {{ selectedRequest?.status }}
            </a-tag>
          </div>
        </div>

        <!-- Rejection Reason Form -->
        <a-form layout="vertical">
          <a-form-item 
            label="Reason for rejection"
            :validate-status="reasonError ? 'error' : ''"
            :help="reasonError"
          >
            <a-textarea 
              v-model:value="rejectReason"
              placeholder="Explain why you're rejecting this request..."
              :rows="5"
              :maxlength="500"
              show-count
              :disabled="rejecting"
            />
          </a-form-item>
        </a-form>

        <!-- Action Buttons -->
        <div class="modal-actions">
          <a-button 
            @click="closeRejectModal"
            :disabled="rejecting"
            block
          >
            Cancel
          </a-button>
          <a-button 
            type="primary"
            danger
            @click="handleReject"
            :loading="rejecting"
            :disabled="!rejectReason.trim()"
            block
          >
            Confirm Rejection
          </a-button>
        </div>

        <!-- Warning Message -->
        <div class="warning-box">
          <a-alert
            message="This action cannot be undone"
            type="warning"
            show-icon
            :closable="false"
          />
        </div>
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
    access_recieved: {
      type: Object,
      default: () => ({ read: true, reject: false, process: false, update: false })
    },
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
      processingIds: [],
      regeneratingIds: [],
      rejectingIds: [],
      
      rejectModalVisible: false,
      selectedRequest: null,
      rejectReason: '',
      rejecting: false,
      reasonError: '',
      brand:this.$route.query.brand,
      
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
          title: 'Requester',
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
          width: 280,
          fixed: 'right'
        }
      ]
    }
  },
  methods: {
    // Access Control Methods
    canProcess(record) {
      return this.access_recieved?.process && record.status === 'Pending'
    },

    canRegenerate(record) {
      return this.access_recieved?.process && record.status === 'Completed'
    },

    canReject(record) {
      return (
        this.access_recieved?.reject && 
        record.status !== 'Rejected' && 
        record.status !== 'Completed'
      )
    },

    hasAccess(permission) {
      return this.access_recieved?.[permission] === true
    },

    // UI Methods
    onRowClick(record) {
      return {
        onClick: () => {
          console.log("Clicked row ID:", record.id)
          this.$emit('record-clicked', { id: record.id, record })
        },
        style: {
          cursor: "pointer"
        }
      }
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
        'Completed': 'green',
        'Rejected': 'red',
        'Processing': 'blue'
      }
      return colors[status] || 'default'
    },
    
    truncateText(text, maxLength = 100) {
      if (!text) return 'No message provided'
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    },

    // Modal Methods
    openRejectModal(request) {
      if (!this.hasAccess('reject')) {
        message.error('You do not have permission to reject requests')
        return
      }
      
      this.selectedRequest = request
      this.rejectModalVisible = true
      this.rejectReason = ''
      this.reasonError = ''
    },

    closeRejectModal() {
      if (this.rejecting) return
      
      this.rejectModalVisible = false
      this.selectedRequest = null
      this.rejectReason = ''
      this.reasonError = ''
    },

    // Action Methods
    async processPhoto(request) {
      if (!this.hasAccess('process')) {
        message.error('You do not have permission to process requests')
        return
      }

      try {
        this.processingIds.push(request.id)
        const response = await fetch(`${this.$store.state.root_api}engine/new-room-client-requested/?brand=${this.brand}`, {
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
          const responseData = await response.json()
          this.$emit('upload-success', responseData)
          this.$router.push({ name: 'update_catelogue', params: { id: responseData.room_id } ,
        query: {
    brand: this.brand,
    client_request: 'true',
    business_staff:'true'
    
  }})
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

    async handleReject() {
      if (!this.rejectReason.trim()) {
        this.reasonError = 'Rejection reason is required'
        return
      }

      if (!this.hasAccess('reject')) {
        message.error('You do not have permission to reject requests')
        return
      }

      try {
        this.rejecting = true
        this.rejectingIds.push(this.selectedRequest.id)
        
        const token = localStorage.getItem('token')
        const response = await fetch(`${this.$store.state.root_api}access-engine/api/business-customer-requests/reject-room-requests-recieved/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            request_id: this.selectedRequest.id,
            reject_reason: this.rejectReason.trim()
          })
        })

        if (response.ok) {
          this.rejecting = false
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
  width: 100%;
}

.access-denied {
  padding: 60px 20px;
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
  border-radius: 8px;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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

/* Enhanced Modal Styles */
.modal-header {
  padding: 8px 0;
}

.modal-title-content h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.modal-subtitle {
  margin: 4px 0 0;
  color: #999;
  font-size: 14px;
}

.reject-modal-content {
  padding: 8px 0;
}

.info-card {
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
}

.info-row:not(:last-child) {
  border-bottom: 1px solid #e8e8e8;
}

.info-label {
  font-weight: 500;
  color: #666;
}

.info-value {
  color: #262626;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin: 24px 0;
}

.modal-actions button {
  flex: 1;
}


.warning-box {
  margin-top: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .requests-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }

  .modal-actions {
    flex-direction: column;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .info-row .info-label {
    margin-bottom: 4px;
  }
}
</style>