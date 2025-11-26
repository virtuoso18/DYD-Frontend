<template>
    <div style="border-radius:15px;background-color:white;border:1px solid rgba(0,0,0,0.1);height:100vh;padding:10px;margin-top:10px">

<div style="padding: 20px;">
      <div class="page-header">
        <a-row type="flex" justify="space-between" align="middle">
          <a-col>
            <h2>Professional Dashboard</h2>
            <p style="color: #999; margin-top: 5px;">Manage business access requests and view your assigned tasks</p>
          </a-col>
        </a-row>
      </div>

      <a-tabs v-model:activeKey="activeTab" style="margin-top: 20px;">
        
       
        <!-- Accepted Businesses Tab -->
        <a-tab-pane key="accepted-businesses" tab="Accepted Businesses" :tab-key="'accepted'">
          <a-spin :spinning="loadingAccepted">
            <a-empty 
              v-if="acceptedBusinesses.length === 0" 
              description="No accepted access yet" 
              style="margin: 50px 0;"
            />
            
            <a-row :gutter="16" v-else>
              <a-col 
                v-for="business in acceptedBusinesses" 
                :key="business.id" 
                :xs="24" 
                :sm="12" 
                :md="8"
              >
                <a-card hoverable style="margin-bottom: 16px;">
                  <div style="text-align: center; margin-bottom: 16px;display:flex;justify-content:center;align-items:center;flex-direction: column;">
                    <img :src="this.$store.state.root_media_api+business.business.banner_picture" style="border-radius:100%;width:100px;height:100px;border:1px solid rgba(0,0,0,0.2)" alt="">
                    <h3 style="margin: 0 0 8px 0;">{{ business.business.business_name }}</h3>
                    <p style="margin: 0; color: #999; font-size: 12px;">{{ business.business.owner_email }}</p>
                  </div>
                  

                  <!-- <div style="margin-bottom: 16px;">
                    <p><strong>Owner:</strong> {{ business.business.owner_name }}</p>
                    <p><strong>Accepted:</strong> {{ new Date(business.created_at).toLocaleDateString() }}</p>
                    <p v-if="business.task_count > 0" style="color: #1890ff;">
                      <a-icon type="check-circle" /> {{ business.task_count }} task(s) assigned
                    </p>
                  </div> -->

                  <!-- <a-divider style="margin: 12px 0;" /> -->

                  <div style="display: flex; gap: 8px;">
                    <!-- <a-button 
                      type="default" 
                      style="flex: 1;"
                    >
                      View Tasks
                    </a-button>
                    <a-button 
                      type="default" 
                      danger
                      @click="handleRevokeAccess(business.id)"
                      style="flex: 1;"
                    >
                      Revoke
                    </a-button> -->
                    
                    <!-- :to="{ name: 'access-business', params: { business } }"  -->
<router-link 
              
              :to="{ name: 'business-overview', query: { access_id: business.id }  }" 

              style="display:flex;justify-content: center;width:100%;"

>

              <a-button block type="primary"> Access Business</a-button>
            </router-link>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </a-spin>
        </a-tab-pane>
 <!-- Pending Requests Tab -->
        <a-tab-pane key="pending-requests" tab="Pending Requests" :tab-key="'pending'">
          <a-spin :spinning="loadingPending">
            <a-empty 
              v-if="pendingRequests.length === 0" 
              description="No pending access requests" 
              style="margin: 50px 0;"
            />
            
            <a-row :gutter="16" v-else>
              <a-col 
                v-for="request in pendingRequests" 
                :key="request.id" 
                :xs="24" 
                :sm="12" 
                :md="8"
              >
                <a-card hoverable style="margin-bottom: 16px; border-left: 4px solid #ff7a45;">
                  <div style="text-align: center; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0;">
                    <h3 style="margin: 0 0 8px 0;">{{ request.business.business_name }}</h3>
                    <p style="margin: 0; color: #999; font-size: 12px;">{{ request.business.owner_email }}</p>
                  </div>

                  <div style="margin-bottom: 16px;">
                    <p><strong>Owner:</strong> {{ request.business.owner_name }}</p>
                    <p><strong>Requested:</strong> {{ new Date(request.created_at).toLocaleDateString() }}</p>
                  </div>

                  <a-divider style="margin: 12px 0;" />

                  <div style="display: flex; gap: 8px;">
                    <a-button 
                      type="primary" 
                      style="flex: 1;"
                      @click="openAcceptModal(request)"
                    >
                      Accept
                    </a-button>
                    <a-button 
                      type="default" 
                      danger
                      style="flex: 1;"
                      @click="handleRejectRequest(request.id)"
                    >
                      Reject
                    </a-button>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </a-spin>
        </a-tab-pane>

      </a-tabs>

      <!-- Accept Confirmation Modal -->
      <a-modal
        v-model:open="showAcceptModal"
        centered
        title="Accept Access Request"
        width="500px"
        @ok="handleAcceptRequest"
        okText="Accept"
        cancelText="Cancel"
        :confirmLoading="processingAccess"
      >
        <div v-if="selectedRequest">
          <p style="margin-bottom: 16px;">
            <strong>{{ selectedRequest.business.business_name }}</strong> is requesting access for you to work as a professional.
          </p>
          
          <a-form-item label="Response Message (Optional)">
            <a-textarea
              v-model:value="acceptanceMessage"
              placeholder="Add any message or notes..."
              :rows="3"
            />
          </a-form-item>

          <a-alert
            message="After accepting, you will be able to view tasks and work details from this business."
            type="info"
            show-icon
            style="margin-top: 12px;"
          />
        </div>
      </a-modal>
    </div>

</div>
</template>
<script>
export default {
    name:"profesional_user_all_businesses",
    data() {
    return {
      activeTab: 'accepted-businesses', // "pending-requests"
      
      pendingRequests: [],
      acceptedBusinesses: [],
      
      loadingPending: false,
      loadingAccepted: false,
      processingAccess: false,
      
      showAcceptModal: false,
      selectedRequest: null,
      acceptanceMessage: ''
    };
  },
  
  mounted() {
    this.fetchPendingRequests();
    this.fetchAcceptedBusinesses();
  },

  methods: {
    /**
     * Fetch pending access requests (not yet accepted)
     */
    async fetchPendingRequests() {
      this.loadingPending = true;
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/professional-access/pending-requests/`,
          {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
          }
        );

        const data = await response.json();
        console.log(data)
        if (!data.error) {
          this.pendingRequests = data.data;
          console.log('Pending requests:', this.pendingRequests);
        }
      } catch (error) {
        console.error('Error fetching pending requests:', error);
        this.$message.error('Failed to load pending requests');
      } finally {
        this.loadingPending = false;
      }
    },

    /**
     * Fetch accepted businesses (already accepted requests)
     */
    async fetchAcceptedBusinesses() {
      this.loadingAccepted = true;
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/professional-access/my-businesses/`,
          {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
          }
        );

        const data = await response.json();
        if (!data.error) {
          this.acceptedBusinesses = data.data;
          console.log('Accepted businesses:', this.acceptedBusinesses);
        }
      } catch (error) {
        console.error('Error fetching accepted businesses:', error);
        this.$message.error('Failed to load accepted businesses');
      } finally {
        this.loadingAccepted = false;
      }
    },

    /**
     * Open accept confirmation modal
     */
    openAcceptModal(request) {
      this.selectedRequest = request;
      this.acceptanceMessage = '';
      this.showAcceptModal = true;
    },

    /**
     * Accept access request
     */
    async handleAcceptRequest() {
      if (!this.selectedRequest) return;

      this.processingAccess = true;

      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/professional-access/accept-access/${this.selectedRequest.id}/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              response_message: this.acceptanceMessage
            })
          }
        );

        const data = await response.json();

        if (!data.error) {
          this.$message.success('Access accepted successfully!');
          
          // Close modal
          this.showAcceptModal = false;
          
          // Refresh both lists
          await this.fetchPendingRequests();
          await this.fetchAcceptedBusinesses();
          
          this.selectedRequest = null;
          this.acceptanceMessage = '';
        } else {
          this.$message.error(data.message || 'Failed to accept request');
        }
      } catch (error) {
        console.error('Error accepting request:', error);
        this.$message.error('An error occurred while accepting the request');
      } finally {
        this.processingAccess = false;
      }
    },

    /**
     * Reject access request
     */
    async handleRejectRequest(requestId) {
      this.$confirm({
        title: 'Reject Access Request?',
        content: 'Are you sure you want to reject this access request?',
        okText: 'Yes, Reject',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
          try {
            const response = await fetch(
              `${this.$store.state.root_api}access-engine/api/professional-access/reject-access/${requestId}/`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Token ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                }
              }
            );

            const data = await response.json();

            if (!data.error) {
              this.$message.success('Request rejected successfully');
              await this.fetchPendingRequests();
            } else {
              this.$message.error(data.message || 'Failed to reject request');
            }
          } catch (error) {
            console.error('Error rejecting request:', error);
            this.$message.error('An error occurred while rejecting the request');
          }
        }
      });
    },

    /**
     * Revoke accepted access
     */
    async handleRevokeAccess(accessId) {
      this.$confirm({
        title: 'Revoke Access?',
        content: 'Are you sure you want to revoke access to this business?',
        okText: 'Yes, Revoke',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
          try {
            const response = await fetch(
              `${this.$store.state.root_api}access-engine/api/professional-access/reject-access/${accessId}/`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Token ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                }
              }
            );

            const data = await response.json();

            if (!data.error) {
              this.$message.success('Access revoked successfully');
              await this.fetchAcceptedBusinesses();
            } else {
              this.$message.error(data.message || 'Failed to revoke access');
            }
          } catch (error) {
            console.error('Error revoking access:', error);
            this.$message.error('An error occurred while revoking access');
          }
        }
      });
    }
  },

}
</script>