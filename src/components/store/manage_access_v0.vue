<template>
  <div class="" style="margin-top:10px;border-radius:15px; background-color: white;border:1px solid rgba(0,0,0,0.1);padding:14px;height:90vh;">
    <!-- Header -->
    <div class="access-header">
      <a-row type="flex" justify="space-between" align="middle">
        <a-col>
          <h2>
            <a-icon type="left" @click="goBack" style="cursor: pointer; margin-right: 16px;" />
            Manage Access
          </h2>
        </a-col>
        <a-col>
          <a-button type="primary" @click="showAddAccessModal">
            <a-icon type="plus" />Add New Access
          </a-button>
        </a-col>
      </a-row>
      <!-- <a-input-search
        placeholder="Search by name or email"
        @change="onSearch"
        style="margin-top: 16px;"
        allow-clear
      /> -->
    </div>

    <!-- Access List Table -->
       <a-tabs v-model:activeKey="activeTab">
    <a-tab-pane key="granted" tab="Granted">
  <a-table
      :columns="columns"
      :data-source="filteredAccessList"
      :loading="loadingAccess"
      :pagination="pagination"
      @change="handleTableChange"
      row-key="id"
      :scroll="{ x: 1000 }"
      class="access-table"
    >
      <!-- User Column -->
      <span slot="user" slot-scope="text, record">
        <a-row type="flex" align="middle">
          <a-col>
            <a-avatar
              :src="record.user.profile_picture || ''"
              :size="40"
              icon="user"
            />
          </a-col>
          <a-col style="margin-left: 12px;">
            <div>{{ record.user.full_name }}</div>
            <div style="color: #999; font-size: 12px;">{{ record.user.email }}</div>
          </a-col>
        </a-row>
      </span>

      <!-- Resource Type Column -->
      <span slot="resourceType" slot-scope="text, record">
        <a-tag :color="getResourceColor(record.resource_type)">
          {{ record.resource_type_display }}
        </a-tag>
      </span>

      <!-- Permissions Column -->
      <span slot="permissions" slot-scope="permissions">
        <a-tag v-for="perm in permissions" :key="perm" color="blue" style="margin: 2px;">
          {{ perm }}
        </a-tag>
      </span>

      <!-- Status Column -->
      <span slot="status" slot-scope="text, record">
        <a-badge
          :status="record.is_active ? 'processing' : 'error'"
          :text="record.is_active ? 'Active' : 'Revoked'"
        />
      </span>

      <!-- Actions Column -->
      <span slot="actions" slot-scope="text, record">
        <a-row type="flex">
          <a-col style="margin-right: 8px;">
            <a-button
              type="primary"
              size="small"
              @click="editAccess(record)"
              icon="edit"
            />
          </a-col>
          <a-col>
            <a-popconfirm
              title="Are you sure you want to revoke access?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="revokeAccess(record.id)"
              v-if="record.is_active"
            >
              <a-button type="danger" size="small" icon="delete" />
            </a-popconfirm>
            <a-button
              type="default"
              size="small"
              disabled
              icon="delete"
              v-else
            />
          </a-col>
        </a-row>
      </span>
    </a-table>

    </a-tab-pane>
    <a-tab-pane key="sent-requests" tab="Sent Requests" force-render>
      
     <!-- {{sent_requests}} -->
  <a-table
  :columns="columns_sent_requests"
  :data-source="sent_requests"
  :loading="loadingAccess"
  :pagination="pagination"
  row-key="id"
  :scroll="{ x: 1200 }"
  class="access-table"
>
  <template #bodyCell="{ column, record }">
    <!-- Requested To Column -->
    <template v-if="column.key === 'user'">
      <a-row>
        <a-col>
          <a-avatar :size="40" :src="this.$store.state.root_media_api+ record.requested_to.avatar" style="border:1px solid rgba(0,0,0,0.2)" />
        </a-col>
        <a-col style="margin-left: 12px;">
          <div>{{ record.requested_to.full_name }}</div>
          <div style="color: #999; font-size: 12px;">
            {{ record.requested_to.email }}
          </div>
        </a-col>
      </a-row>
    </template>

    <!-- Resource Type Column -->
    <template v-if="column.key === 'resourceType'">
      <a-tag :color="getResourceColor(record.resource_type)">
        {{ record.resource_type_display }}
      </a-tag>
    </template>

    <!-- Permissions Column -->
    <template v-if="column.key === 'permissions'">
      <a-tag
        v-for="perm in record.requested_permissions"
        :key="perm"
        color="blue"
        style="margin: 2px;"
      >
        {{ perm }}
      </a-tag>
    </template>

    <!-- Status Column -->
    <template v-if="column.key === 'status'">
      <a-badge
        :status="
          record.status === 'pending'
            ? 'processing'
            : record.status === 'approved'
            ? 'success'
            : 'error'
        "
        :text="record.status.charAt(0).toUpperCase() + record.status.slice(1)"
      />
      <a-tag v-if="record.is_expired" color="red" style="margin-left: 8px;">
        Expired
      </a-tag>
    </template>

    <!-- Created At Column -->
    <template v-if="column.key === 'created_at'">
      <span>{{ formatDate(record.created_at) }}</span>
    </template>
  </template>
</a-table>


 </a-tab-pane>
  </a-tabs>
  
    <!-- Add/Edit Access Modal -->
    <a-modal
      :title="editingAccess ? 'Edit Access' : 'Add New Access'"
      :visible="accessModalVisible"
      @ok="handleSaveAccess"
      @cancel="handleCancelModal"
      width="600px"
      :confirmLoading="savingAccess"
    >
      <a-form layout="vertical">
        <!-- Search & Select User (Add Mode Only) -->
        <a-form-item label="Select User" v-if="!editingAccess">
          <a-select
            v-model="formData.user_email"
            placeholder="Type email to search (min 3 characters)..."
            show-search
            :show-arrow="false"
            :filter-option="false"
            @search="handleUserSearch"
            @change="onUserSelect"
            style="height:60px;"
            :loading="searchingUser"
            :not-found-content="searchingUser ? 'Searching...' : (searchedUsers.length === 0 ? 'Type to search users' : 'No users found')"
          >
            <a-select-option
              v-for="user in searchedUsers"
              :key="user.email"
              :value="user.email"
              
            >
              <a-row type="flex" align="middle">
                <a-avatar :src="this.$store.state.root_media_api+ user.profile_picture" :size="24" icon="user" style="margin-right: 8px;" />
                <div>
                  <div>{{ user.full_name }}</div>
                  <div style="color: #999; font-size: 12px;">{{ user.email }}</div>
                </div>
              </a-row>
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- User Info Display (Edit Mode) -->
        <a-form-item v-if="editingAccess" label="User">
          <a-row type="flex" align="middle">
            <a-avatar
              :src="editingAccess.user.profile_picture"
              :size="40"
              icon="user"
            />
            <a-col style="margin-left: 12px;">
              <div>{{ editingAccess.user.full_name }}</div>
              <div style="color: #999; font-size: 12px;">{{ editingAccess.user.email }}</div>
            </a-col>
          </a-row>
        </a-form-item>

        <!-- Resource Type -->
        <a-form-item label="Resource Type" :required="true">
          <a-select
            v-model="formData.resource_type"
            placeholder="Select resource type"
            @change="onResourceTypeChange"
            :disabled="editingAccess !== null"
          >
            <a-select-option value="business_site">Business Site</a-select-option>
            <a-select-option value="product">Product</a-select-option>
            <a-select-option value="community_post">Community Post</a-select-option>
            <a-select-option value="user_room_request">User Room Request</a-select-option>
          </a-select>
        </a-form-item>

        <!-- Permissions -->
        <a-form-item label="Permissions" :required="true">
          <a-alert 
            v-if="!formData.resource_type" 
            message="Please select a resource type first" 
            type="info" 
            show-icon 
            style="margin-bottom: 12px;"
          />
          <div v-else>
            <a-row>
              <a-col 
                :span="24" 
                v-for="perm in availablePermissions"
                :key="perm.value"
                style="margin-bottom: 8px;"
              >
                <a-checkbox 
                  :checked="formData.permissions.includes(perm.value)"
                  @change="e => handlePermissionChange(perm.value, e.target.checked)"
                >
                  {{ perm.label }}
                </a-checkbox>
              </a-col>
            </a-row>
            
            <!-- Debug info (remove in production) -->
            <div style="margin-top: 8px; padding: 8px; background: #f0f0f0; border-radius: 4px; font-size: 12px;">
              <strong>Selected:</strong> {{ formData.permissions.length > 0 ? formData.permissions.join(', ') : 'None' }}
            </div>
          </div>
        </a-form-item>

        <!-- Request Message -->
        <a-form-item label="Message (Optional)">
          <a-textarea
            v-model:value="formData.request_message"
            placeholder="Add a message explaining why access is needed"
            :rows="3"
          />
        </a-form-item>

        <!-- Expiry Date -->
        <!-- <a-form-item label="Expiry Date (Optional)">
          <a-date-picker
            v-model:value="formData.expires_at"
            placeholder="Select expiry date"
            format="YYYY-MM-DD"
            style="width: 100%;"
          />
        </a-form-item> -->
      </a-form>
    </a-modal>

    <!-- Revoke Reason Modal -->
    <a-modal
      title="Revoke Access"
      :visible="revokeModalVisible"
      @ok="handleConfirmRevoke"
      @cancel="revokeModalVisible = false"
      :confirmLoading="revokingAccess"
    >
      <a-form layout="vertical">
        <a-form-item label="Reason for Revocation">
          <a-textarea
            v-model="revokeReason"
            placeholder="Enter reason for revoking access"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Audit Log Modal -->
    <a-modal
      title="Access Audit Log"
      :visible="auditModalVisible"
      @cancel="auditModalVisible = false"
      width="700px"
      :footer="null"
    >
      <a-timeline>
        <a-timeline-item
          v-for="log in auditLogs"
          :key="log.id"
          :color="getAuditLogColor(log.action)"
        >
          <div>
            <strong>{{ log.action_display }}</strong>
            <div style="color: #999; font-size: 12px;">
              by {{ log.performed_by?.full_name || 'System' }} at {{ formatDate(log.timestamp) }}
            </div>
            <div v-if="log.details" style="margin-top: 8px; padding: 8px; background: #f5f5f5; border-radius: 4px;">
              <div v-for="(value, key) in log.details" :key="key">
                <strong>{{ key }}:</strong> {{ Array.isArray(value) ? value.join(', ') : value }}
              </div>
            </div>
          </div>
        </a-timeline-item>
      </a-timeline>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'manage_access',
  
  data() {
    return {
      loadingAccess: false,
      savingAccess: false,
      revokingAccess: false,
      searchingUser: false,
      accessList: [],
      sent_requests:[],
      activeTab:'granted',
      searchText: '',
      accessModalVisible: false,
      revokeModalVisible: false,
      auditModalVisible: false,
      editingAccess: null,
      revokeReason: '',
      selectedPermissionId: null,
      searchedUsers: [],
      availablePermissions: [],
      searchDebounce: null,
      
      // Form data
      formData: {
        user_email: '',
        resource_type: '',
        permissions: [],
        request_message: '',
        expires_at: null
      },
      
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: total => `Total ${total} items`
      },
      
      columns: [
        {
          title: 'User',
          dataIndex: 'user',
          key: 'user',
          scopedSlots: { customRender: 'user' },
          width: 250
        },
        {
          title: 'Email',
          dataIndex: 'user.email',
          key: 'email',
          width: 180
        },
        {
          title: 'Resource Type',
          dataIndex: 'resource_type',
          key: 'resourceType',
          scopedSlots: { customRender: 'resourceType' },
          width: 150
        },
        {
          title: 'Permissions',
          dataIndex: 'permissions',
          key: 'permissions',
          scopedSlots: { customRender: 'permissions' },
          width: 200
        },
        {
          title: 'Status',
          dataIndex: 'is_active',
          key: 'status',
          scopedSlots: { customRender: 'status' },
          width: 100
        },
        {
          title: 'Granted At',
          dataIndex: 'granted_at',
          key: 'granted_at',
          width: 150,
          customRender: (text) => this.formatDate(text)
        },
        {
          title: 'Actions',
          key: 'actions',
          scopedSlots: { customRender: 'actions' },
          width: 120,
          fixed: 'right'
        }
      ],
      
       columns_sent_requests: [
     {
    title: 'Requested To',
    dataIndex: 'requested_to', // ✅ Corrected
    key: 'user',
    scopedSlots: { customRender: 'user' },
    width: 250,
  },
  {
    title: 'Resource Type',
    dataIndex: 'resource_type',
    key: 'resourceType',
    scopedSlots: { customRender: 'resourceType' },
    width: 150
  },
  {
    title: 'Permissions',
    dataIndex: 'requested_permissions',
    key: 'permissions',
    scopedSlots: { customRender: 'permissions' },
    width: 200
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' },
    width: 120
  },
  {
    title: 'Created At',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 150,
    // customRender: (text) => this.formatDate(text)
  }
],
      auditLogs: [],
      
      permissionOptions: {
        business_site: [
          { value: 'read', label: 'Read' },
          { value: 'update', label: 'Update' }
        ],
        product: [
          { value: 'create', label: 'Create' },
          { value: 'read', label: 'Read' },
          { value: 'update', label: 'Update' },
          { value: 'delete', label: 'Delete' }
        ],
        community_post: [
          { value: 'create', label: 'Create' },
          { value: 'read', label: 'Read' },
          { value: 'update', label: 'Update' },
          { value: 'delete', label: 'Delete' }
        ],
        user_room_request: [
          { value: 'read', label: 'Read All Requests' },
          { value: 'update', label: 'Update Request' },
          { value: 'reject', label: 'Reject Request' },
          { value: 'process', label: 'Process & Complete Request' }
        ]
      }
    };
  },

  mounted() {
    this.fetchGrantedAccess();
    this.fetchSentAccessRequests();
  },
  computed: {
    filteredAccessList() {
      if (!this.searchText) return this.accessList;
      return this.accessList.filter(access =>
        access.user.full_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        access.user.email.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  },

  methods: {
    async fetchGrantedAccess() {
      this.loadingAccess = true;
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/granted/?status=all`,
          {
            method: 'GET',
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
          }
        );

        const data = await response.json();
        if (!data.error) {
          this.accessList = data.permissions || [];
          this.pagination.total = data.count || 0;
        } else {
          this.$message.error(data.message || 'Failed to load access');
        }
      } catch (error) {
        console.error('Error fetching access:', error);
        this.$message.error('Error loading access');
      } finally {
        this.loadingAccess = false;
      }
    },

     async fetchSentAccessRequests() {
      this.loadingAccess = true;
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/sent-requests/`,
          {
            method: 'GET',
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
          }
        );

        const data = await response.json();
        if (!data.error) {
          this.sent_requests = data.requests || [];
        } else {
          this.$message.error(data.message || 'Failed to load the sent requests');
        }
      } catch (error) {
        console.error('Error fetching load the sent requests:', error);
        this.$message.error('Error loading load the sent requests');
      } finally {
        this.loadingAccess = false;
      }
    },

    handleUserSearch(searchValue) {
      clearTimeout(this.searchDebounce);
      
      if (!searchValue || searchValue.length < 3) {
        this.searchedUsers = [];
        return;
      }

      this.searchDebounce = setTimeout(() => {
        this.searchUser(searchValue);
      }, 500);
    },

    async searchUser(searchText) {
      if (!searchText || searchText.trim().length < 3) {
        return;
      }

      this.searchingUser = true;
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/search-user/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: searchText.trim() })
          }
        );

        const data = await response.json();
        if (!data.error && data.user) {
          this.searchedUsers = [data.user];
        } else {
          this.searchedUsers = [];
          if (response.status === 404) {
            this.$message.warning('No user found with this email');
          }
        }
      } catch (error) {
        console.error('Error searching user:', error);
        this.$message.error('Error searching for user');
        this.searchedUsers = [];
      } finally {
        this.searchingUser = false;
      }
    },

    onUserSelect(value) {
      this.formData.user_email = value;
    },

    onResourceTypeChange(value) {
      console.log('Resource type changed to:', value);
      this.formData.resource_type = value;
      this.availablePermissions = this.permissionOptions[value] || [];
      this.formData.permissions = [];
      
      // Force Vue to update
      this.$forceUpdate();
    },

    handlePermissionChange(permValue, checked) {
      console.log('Permission change:', permValue, checked);
      
      if (checked) {
        // Add permission if not already present
        if (!this.formData.permissions.includes(permValue)) {
          this.formData.permissions.push(permValue);
        }
      } else {
        // Remove permission
        const index = this.formData.permissions.indexOf(permValue);
        if (index > -1) {
          this.formData.permissions.splice(index, 1);
        }
      }
      
      console.log('Current permissions:', this.formData.permissions);
      
      // Force reactivity update
      this.formData = { ...this.formData };
    },

    onSearch(e) {
      this.searchText = e.target.value;
    },

    showAddAccessModal() {
      this.editingAccess = null;
      this.accessModalVisible = true;
      this.searchedUsers = [];
      this.availablePermissions = [];
      this.resetFormData();
    },

    resetFormData() {
      this.formData = {
        user_email: '',
        resource_type: '',
        permissions: [],
        request_message: '',
        expires_at: null
      };
    },

    editAccess(record) {
      this.editingAccess = record;
      this.accessModalVisible = true;
      
      // Set form data in next tick to ensure modal is rendered
      this.$nextTick(() => {
        this.formData.resource_type = record.resource_type;
        this.availablePermissions = this.permissionOptions[record.resource_type] || [];
        this.formData.permissions = [...record.permissions];
        this.formData.request_message = record.granted_reason || '';
        
        console.log('Edit mode - loaded permissions:', this.formData.permissions);
      });
    },

    handleTableChange(pagination, filters, sorter) {
      this.pagination = pagination;
      this.fetchGrantedAccess();
    },

    validateForm() {
      console.log('=== VALIDATION ===');
      console.log('Form Data:', JSON.stringify(this.formData, null, 2));
      
      if (!this.editingAccess && !this.formData.user_email) {
        this.$message.error('Please select a user');
        return false;
      }
      
      if (!this.formData.resource_type) {
        this.$message.error('Please select a resource type');
        return false;
      }
      
      if (!Array.isArray(this.formData.permissions) || this.formData.permissions.length === 0) {
        this.$message.error('Please select at least one permission');
        return false;
      }
      
      console.log('✓ Validation passed');
      return true;
    },

    async handleSaveAccess() {
      if (!this.validateForm()) {
        return;
      }

      this.savingAccess = true;
      try {
        if (this.editingAccess) {
          // Update permissions
          const originalPerms = this.editingAccess.permissions;
          const newPerms = this.formData.permissions;
          
          const addPermissions = newPerms.filter(p => !originalPerms.includes(p));
          const removePermissions = originalPerms.filter(p => !newPerms.includes(p));

          console.log('Updating permissions:', { addPermissions, removePermissions });

          const response = await fetch(
            `${this.$store.state.root_api}access-engine/api/update-permissions/`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                permission_id: this.editingAccess.id,
                add_permissions: addPermissions,
                remove_permissions: removePermissions
              })
            }
          );

          const data = await response.json();
          if (!data.error) {
            this.$message.success('Permissions updated successfully');
            this.handleCancelModal();
            this.fetchGrantedAccess();
          } else {
            this.$message.error(data.message);
          }
        } else {
          // Create new access request
          console.log('Creating access request:', {
            user_email: this.formData.user_email,
            resource_type: this.formData.resource_type,
            requested_permissions: this.formData.permissions
          });

          const response = await fetch(
            `${this.$store.state.root_api}access-engine/api/create-request/`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                user_email: this.formData.user_email,
                resource_type: this.formData.resource_type,
                requested_permissions: this.formData.permissions,
                request_message: this.formData.request_message || ''
              })
            }
          );

          const data = await response.json();
          if (!data.error) {
            this.$message.success('Access request sent successfully');
            this.handleCancelModal();
            this.fetchGrantedAccess();
          } else {
            this.$message.error(data.message);
          }
        }
      } catch (error) {
        console.error('Error saving access:', error);
        this.$message.error('Error saving access');
      } finally {
        this.savingAccess = false;
      }
    },

    async revokeAccess(permissionId) {
      this.selectedPermissionId = permissionId;
      this.revokeModalVisible = true;
    },

    async handleConfirmRevoke() {
      if (!this.revokeReason.trim()) {
        this.$message.error('Please provide a reason for revocation');
        return;
      }

      this.revokingAccess = true;
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/revoke/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              permission_id: this.selectedPermissionId,
              reason: this.revokeReason
            })
          }
        );

        const data = await response.json();
        if (!data.error) {
          this.$message.success('Access revoked successfully');
          this.revokeModalVisible = false;
          this.revokeReason = '';
          this.fetchGrantedAccess();
        } else {
          this.$message.error(data.message);
        }
      } catch (error) {
        console.error('Error revoking access:', error);
        this.$message.error('Error revoking access');
      } finally {
        this.revokingAccess = false;
      }
    },

    async viewAuditLog(permissionId) {
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/audit-log/${permissionId}/`,
          {
            method: 'GET',
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
          }
        );

        const data = await response.json();
        if (!data.error) {
          this.auditLogs = data.logs || [];
          this.auditModalVisible = true;
        } else {
          this.$message.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching audit log:', error);
        this.$message.error('Error loading audit log');
      }
    },

    handleCancelModal() {
      this.accessModalVisible = false;
      this.editingAccess = null;
      this.searchedUsers = [];
      this.availablePermissions = [];
      this.resetFormData();
    },

    getResourceColor(resourceType) {
      const colors = {
        business_site: 'blue',
        product: 'green',
        community_post: 'orange',
        user_room_request: 'purple'
      };
      return colors[resourceType] || 'default';
    },

    getAuditLogColor(action) {
      const colors = {
        granted: 'green',
        revoked: 'red',
        modified: 'orange',
        reactivated: 'cyan'
      };
      return colors[action] || 'blue';
    },

    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    goBack() {
      this.$router.go(-1);
    }
  },

};
</script>

<style scoped>

</style>