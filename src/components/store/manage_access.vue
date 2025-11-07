<template>
  <a-modal
    v-model:open="openAssignTaskModal"
    centered
    title="Assign New Task"
    @ok="handleOk"
  >
  
      <a-form layout="vertical" @submit.prevent="handleAssignTask">
        <!-- Assignment Type Selection -->
        <a-form-item label="Task Assignment Type" v-if="!selectedStaff">
          <a-radio-group v-model:value="taskForm.assignment_type" button-style="solid" size="large" @change="onAssignmentTypeChange">
            <a-radio-button value="internal_staff">
              <a-icon type="team" /> Internal Staff
            </a-radio-button>
            <a-radio-button value="platform_professional">
              <a-icon type="global" /> Platform Professional
            </a-radio-button>
          </a-radio-group>
        </a-form-item>

        <!-- Staff Selection -->
        <a-form-item label="Assign To" required v-if="!selectedStaff">
          <a-select
            v-model:value="taskForm.assigned_to_email"
            placeholder="Select staff member"
            :loading="loadingUsers"
            show-search
            :filter-option="false"
            @search="handleStaffSearch"
            size="large"
          >
            <a-select-option
              v-for="user in availableUsers"
              :key="user.email"
              :value="user.email"
            >
              <a-row type="flex" align="middle">
                <a-avatar
                  :src="$store.state.root_media_api + user.profile_picture"
                  :size="28"
                  icon="user"
                />
                <div style="margin-left: 10px;">
                  <div>{{ user.full_name }}</div>
                  <div style="font-size: 12px; color: #999;">{{ user.email }}</div>
                </div>
              </a-row>
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Task Details -->
        <a-form-item label="Task Title" required>
          <a-input
            v-model:value="taskForm.title"
            placeholder="Enter task title"
            size="large"
          />
        </a-form-item>

        <a-form-item label="Task Description" required>
          <a-textarea
            v-model:value="taskForm.description"
            placeholder="Describe what needs to be done..."
            :rows="5"
            size="large"
          />
        </a-form-item>


        <a-row :gutter="16" v-if="taskForm.assignment_type === 'platform_professional'">
  <a-col :span="12">
    <a-form-item label="Priority" required>
      <a-select v-model:value="taskForm.priority" size="large">
        <a-select-option value="low">
          <a-tag color="green">Low</a-tag>
        </a-select-option>
        <a-select-option value="medium">
          <a-tag color="blue">Medium</a-tag>
        </a-select-option>
        <a-select-option value="high">
          <a-tag color="orange">High</a-tag>
        </a-select-option>
        <a-select-option value="urgent">
          <a-tag color="red">Urgent</a-tag>
        </a-select-option>
      </a-select>
    </a-form-item>
  </a-col>
  <a-col :span="12">
    <a-form-item label="Estimated Hours">
      <a-input-number
        v-model:value="taskForm.estimated_hours"
        :min="0"
        :step="0.5"
        style="width: 100%;"
        size="large"
        placeholder="e.g., 5.5"
      />
    </a-form-item>
  </a-col>
</a-row>

<!-- Priority for internal staff (without estimated hours) -->
<a-form-item label="Priority" required v-if="taskForm.assignment_type === 'internal_staff'">
  <a-select v-model:value="taskForm.priority" size="large">
    <a-select-option value="low">
      <a-tag color="green">Low</a-tag>
    </a-select-option>
    <a-select-option value="medium">
      <a-tag color="blue">Medium</a-tag>
    </a-select-option>
    <a-select-option value="high">
      <a-tag color="orange">High</a-tag>
    </a-select-option>
    <a-select-option value="urgent">
      <a-tag color="red">Urgent</a-tag>
    </a-select-option>
  </a-select>
</a-form-item>

<a-form-item label="Due Date" v-if="taskForm.assignment_type === 'platform_professional'">
  <a-date-picker
    v-model:value="taskForm.due_date"
    show-time
    format="YYYY-MM-DD HH:mm"
    style="width: 100%;"
    size="large"
    :disabled-date="disabledDate"
  />
</a-form-item>
        <!-- <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Priority" required>
              <a-select v-model:value="taskForm.priority" size="large">
                <a-select-option value="low">
                  <a-tag color="green">Low</a-tag>
                </a-select-option>
                <a-select-option value="medium">
                  <a-tag color="blue">Medium</a-tag>
                </a-select-option>
                <a-select-option value="high">
                  <a-tag color="orange">High</a-tag>
                </a-select-option>
                <a-select-option value="urgent">
                  <a-tag color="red">Urgent</a-tag>
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Estimated Hours">
              <a-input-number
                v-model:value="taskForm.estimated_hours"
                :min="0"
                :step="0.5"
                style="width: 100%;"
                size="large"
                placeholder="e.g., 5.5"
              />
            </a-form-item>
          </a-col>
        </a-row> -->

        <!-- <a-form-item label="Due Date">
          <a-date-picker
            v-model:value="taskForm.due_date"
            show-time
            format="YYYY-MM-DD HH:mm"
            style="width: 100%;"
            size="large"
            :disabled-date="disabledDate"
          />
        </a-form-item> -->

        <!-- Form Actions -->
        <a-form-item style="margin-bottom: 0; margin-top: 24px;">
          <a-row type="flex" justify="end" :gutter="8">
            <a-col>
              <a-button @click="closeAssignTaskModal" size="large">
                Cancel
              </a-button>
            </a-col>
            <a-col>
              <a-button
                type="primary"
                html-type="submit"
                :loading="savingData"
                size="large"
              >
                <a-icon type="check" /> Assign Task
              </a-button>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
  </a-modal>
  
  
 <!-- Phone Modal -->
  <a-modal
  v-if="this.staff_details"
    v-model:open="open_Phone_employee_modal"
    centered
    title="Call Employee"
    :footer="null"
    width="400px"
  >
    <div style="text-align: center; padding: 20px;">
      <p style="font-size: 16px; margin-bottom: 30px;">
        <strong>Phone:</strong> {{ selectedEmployee?.phone }}
      </p>
      <div style="display: flex; gap: 10px; justify-content: center;">
        <a-button
          type="primary"
          size="large"
          @click="makeCall"
          style="flex: 1;"
        >
          📞 Call
        </a-button>
        <a-button
          type="default"
          size="large"
          @click="openWhatsApp"
          style="flex: 1;"
        >
          💬 WhatsApp
        </a-button>
      </div>
    </div>
  </a-modal>

  <!-- Mail Modal -->
  <a-modal
  v-if="this.staff_details"

    v-model:open="open_Mail_employee_modal"
    centered
    title="Send Email"
    width="500px"
    @ok="sendEmail"
    okText="Send"
    cancelText="Cancel"
  >
    <a-form layout="vertical">
      <a-form-item label="To">
        <a-input
          v-model:value="staff_details.email"
          :value="selectedEmployee?.email"
          disabled
        />
      </a-form-item>
      <a-form-item label="Subject" required>
        <a-input
          v-model:value="mailForm.subject"
          placeholder="Enter email subject"
        />
      </a-form-item>
      <a-form-item label="Message" required>
        <a-textarea
          v-model:value="mailForm.message"
          placeholder="Enter email contents"
          :rows="6"
        />
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- Edit Employee Modal -->
  <a-modal
    v-if="this.staff_details"
    v-model:open="open_Edit_employee_modal"
    centered
    title="Edit Employee"
    width="600px"
    @ok="saveEmployeeChanges"
    okText="Save"
    cancelText="Cancel"
  >
    <a-form layout="vertical">
      <!-- Avatar Upload Section -->
      <a-form-item label="Avatar">
        <div style="display: flex; align-items: center; gap: 20px;">
          <div>
            <img
              v-if="editEmployeeForm.avatar"
              :src="editEmployeeForm.avatar"
              alt="Employee Avatar"
              style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #d9d9d9;"
            />
            <div
              v-else
              style="width: 80px; height: 80px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border: 2px solid #d9d9d9;"
            >
              <span style="color: #999;">No Image</span>
            </div>
          </div>
          <div style="flex: 1;">
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              style="display: none;"
              @change="handleAvatarUpload"
            />
            <a-button
              type="primary"
              @click="$refs.avatarInput.click()"
              style="width: 100%; margin-bottom: 8px;"
            >
              Upload Image
            </a-button>
            <a-button
              v-if="editEmployeeForm.avatar"
              danger
              @click="removeAvatar"
              style="width: 100%;"
            >
              Remove Image
            </a-button>
          </div>
        </div>
      </a-form-item>

      <!-- Name Field -->
      <a-form-item label="Name" required>
        <a-input
          v-model:value="editEmployeeForm.name"
          placeholder="Enter employee name"
        />
      </a-form-item>


      <!-- Phone Field -->
      <a-form-item label="Phone">
        <a-input
          v-model:value="editEmployeeForm.phone"
          placeholder="Enter phone number"
        />
      </a-form-item>

    </a-form>
  </a-modal>
  <!-- Delete Employee Modal -->
  <a-modal
  v-if="this.staff_details"

    v-model:open="open_Delete_employee_modal"
    centered
    title="Delete Employee"
    width="450px"
    :footer="null"
    :closable="true"
  >
    <div style="padding: 20px;">
      <a-alert
        message="Warning"
        type="warning"
        show-icon
        description="Once you delete this employee, you will not be able to manage this user further from the user profile. This action cannot be undone."
        style="margin-bottom: 20px;"
      />
      <p style="margin-bottom: 15px;">
        <strong>Type "CONFIRM" to delete this employee:</strong>
      </p>
      <a-input
        v-model:value="deleteConfirmation"
        placeholder="Type CONFIRM here"
        size="large"
        style="margin-bottom: 20px;"
      />
      <div style="display: flex; gap: 10px;">
        <a-button
          @click="open_Delete_employee_modal = false"
          style="flex: 1;"
        >
          Cancel
        </a-button>
        <a-button
          type="primary"
          danger
          @click="confirmDeleteEmployee"
          :disabled="deleteConfirmation !== 'CONFIRM'"
          style="flex: 1;"
        >
          Delete
        </a-button>
      </div>
    </div>
  </a-modal>

<a-modal
  v-model:open="openCreateNewtaskModal"
  centered
  title="Create New Task"
  @ok="handleCreateTask"
  okText="Create Task"
  cancelText="Cancel"
>
  <a-form layout="vertical" @submit.prevent="handleCreateTask">
    <!-- Task Title -->
    <a-form-item label="Task Title" required>
      <a-input
        v-model:value="newTaskForm.title"
        placeholder="Enter task title"
        size="large"
      />
    </a-form-item>

    <!-- Task Description -->
    <a-form-item label="Task Description" required>
      <a-textarea
        v-model:value="newTaskForm.description"
        placeholder="Describe what needs to be done..."
        :rows="5"
        size="large"
      />
    </a-form-item>

    <!-- Priority -->
    <a-form-item label="Priority" required>
      <a-select v-model:value="newTaskForm.priority" size="large">
        <a-select-option value="low">
          <a-tag color="green">Low</a-tag>
        </a-select-option>
        <a-select-option value="medium">
          <a-tag color="blue">Medium</a-tag>
        </a-select-option>
        <a-select-option value="high">
          <a-tag color="orange">High</a-tag>
        </a-select-option>
        <a-select-option value="urgent">
          <a-tag color="red">Urgent</a-tag>
        </a-select-option>
      </a-select>
    </a-form-item>

    <!-- Due Date -->
    <a-form-item label="Due Date">
      <a-date-picker
        v-model:value="newTaskForm.due_date"
        show-time
        format="YYYY-MM-DD HH:mm"
        style="width: 100%;"
        size="large"
      />
    </a-form-item>
  </a-form>
</a-modal>

  <div
    style="margin-top:10px;border-radius:15px;background-color:white;
           border:1px solid rgba(0,0,0,0.1);padding:14px;height:90vh;"
  >

  <div v-if="view=='all_staff_view'">
    <!-- Header -->
    <div class="page-header">
      <a-row type="flex" justify="space-between" align="middle">
        <a-col>
          <h2>
            <a-icon type="left" class="back-icon" />
            Staff & Task Management
          </h2>
        </a-col>
        <a-col>
          <a-button type="primary" size="large" @click="showAssignTaskModal">
            <a-icon type="plus" />
            Assign New Task
          </a-button>
        </a-col>
      </a-row>
    </div>

    <!-- Tabs -->
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="all-staff" tab="All Staff">
        <!-- Staff Table -->
      <a-table
  :columns="columns"
  :data-source="all_staff"
  row-key="id"
  :pagination="{ pageSize: 10 }"
  :customRow="customRow"
>
  <template #bodyCell="{ column, record }">
    <!-- Avatar + Name column -->
    <template v-if="column.dataIndex === 'name'">
      <div style="display:flex;align-items:center;gap:8px;">
        <img
          :src="this.$store.state.root_media_api + record.avatar"
          alt="avatar"
          style="width:40px;height:40px;border-radius:50%;object-fit:cover;"
        />
        <span>{{ record.name }}</span>
      </div>
    </template>

    <!-- Email column -->
    <template v-else-if="column.dataIndex === 'email'">
      <span>{{ record.email }}</span>
    </template>

    <!-- Permissions column -->
    <template v-else-if="column.dataIndex === 'access_permissions'">
      <template v-if="Array.isArray(record.access_permissions) && record.access_permissions.length">
        <a-space>
          <a-tag v-for="(perm, idx) in record.access_permissions" :key="idx">{{ perm }}</a-tag>
        </a-space>
      </template>
      <template v-else>
        <a-tag>Staff</a-tag>
      </template>
    </template>

    <!-- Action column -->
    <template v-else-if="column.dataIndex === 'actions'">
      <div style="display:flex;gap:6px;justify-content:center;">
        <a-button type="primary" shape="circle" @click.stop="onEdit(record)">
          <EditOutlined />
        </a-button>
        <a-button type="primary" danger shape="circle" @click.stop="onDelete(record)">
          <DeleteOutlined />
        </a-button>
      </div>
    </template>
  </template>
</a-table>

      </a-tab-pane>

      <a-tab-pane key="all-tasks" tab="All Tasks">
        <task_List />
      </a-tab-pane>
    </a-tabs>
    </div>


    <div v-if="view=='staff_details_view'">
      
<!-- Header -->
    <div class="page-header">
      <a-row type="flex" justify="space-between" align="middle">
        <a-col>
          <a-button @click="backToManageAccess">
            
            <LeftOutlined />
          </a-button>
        </a-col>
        <a-col>
          <a-space>
            <a-button type="primary" @click="showStaffDetails(this.staff_details.email)"><RedoOutlined />Refresh</a-button>
            <a-button type="primary" @click="showCreateNewtaskModal(this.staff_details.email)"><RedoOutlined />Create New Task</a-button>
          </a-space>
        </a-col>
        <a-col :span="24">
        <!-- {{ staff_details }} -->
          <a-row>
            <a-col :sm="24" :xs="24" :md="16" :lg="18">
              
        <!-- Tabs -->
            <a-tabs v-model:activeKey="userTab">
              <a-tab-pane key="overview" tab="Access Permissions">
                
    <!-- Header -->
    <div style="margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="padding: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; box-shadow: 0 2px 8px rgba(102,126,234,0.3);">
          <svg style="width: 22px; height: 22px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <div>
          <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #1a202c;">Permission Management</h1>
          <p style="margin: 2px 0 0 0; font-size: 12px; color: #718096;">Configure access control settings</p>
        </div>
      </div>
      
      <!-- Quick Actions (Compact) -->
      <div style="display: flex; gap: 8px;">
        <button @click="grantAllPermissions" style="display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: #10b981; color: white; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.12); transition: all 0.2s;" onmouseover="this.style.background='#059669'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 3px 8px rgba(0,0,0,0.15)'" onmouseout="this.style.background='#10b981'; this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.12)'">
          <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Grant All
        </button>
        <button @click="revokeAllPermissions" style="display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: #ef4444; color: white; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.12); transition: all 0.2s;" onmouseover="this.style.background='#dc2626'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 3px 8px rgba(0,0,0,0.15)'" onmouseout="this.style.background='#ef4444'; this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.12)'">
          <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Revoke All
        </button>
      </div>
    </div>

                <a-row>
                  <a-col :span="12" style="padding:5px;">
                    <!-- Business Site Card -->
                    <div style="background: white; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); margin-bottom: 12px; overflow: hidden; transition: box-shadow 0.2s;" onmouseover="this.style.boxShadow='0 3px 10px rgba(0,0,0,0.12)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.08)'">
                      <div style="background: linear-gradient(90deg, #eff6ff 0%, #e0e7ff 100%); padding: 12px 16px; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; gap: 10px;">
                        <div style="padding: 6px; background: white; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                          <svg style="width: 16px; height: 16px; color: #3b82f6;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        </div>
                        <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #1f2937;">Business Site</h3>
                      </div>
                      <div style="padding: 12px 16px; display: flex; gap: 12px; flex-wrap: wrap;">
                        <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 6px; background: #f9fafb; flex: 1; min-width: 150px; transition: background 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                          <a-switch 
                            v-model:checked="business_site_read" 
                            size="small"
                            @change="(checked) => handlePermissionChange('business', 'read', checked)"
                          />
                          <label style="font-size: 13px; font-weight: 500; color: #374151; cursor: pointer; flex: 1;">Read Access</label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 6px; background: #f9fafb; flex: 1; min-width: 150px; transition: background 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                          <a-switch 
                            v-model:checked="business_site_update" 
                            size="small"
                            @change="(checked) => handlePermissionChange('business', 'update', checked)"
                          />
                          <label style="font-size: 13px; font-weight: 500; color: #374151; cursor: pointer; flex: 1;">Update Access</label>
                        </div>
                      </div>
                    </div>
                  </a-col>

                  <a-col :span="12" style="padding:5px;">
                    <!-- Product Management Card -->
                    <div style="background: white; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); margin-bottom: 12px; overflow: hidden; transition: box-shadow 0.2s;" onmouseover="this.style.boxShadow='0 3px 10px rgba(0,0,0,0.12)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.08)'">
                      <div style="background: linear-gradient(90deg, #fae8ff 0%, #fce7f3 100%); padding: 12px 16px; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; gap: 10px;">
                        <div style="padding: 6px; background: white; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                          <svg style="width: 16px; height: 16px; color: #a855f7;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                          </svg>
                        </div>
                        <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #1f2937;">Product Management</h3>
                      </div>
                      <div style="padding: 12px 16px; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px;">
                        <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 6px; background: #f9fafb; transition: background 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                          <a-switch 
                            v-model:checked="product_management_read" 
                            size="small"
                            @change="(checked) => handlePermissionChange('product', 'read', checked)"
                          />
                          <label style="font-size: 13px; font-weight: 500; color: #374151; cursor: pointer;">Read</label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 6px; background: #f9fafb; transition: background 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                          <a-switch 
                            v-model:checked="product_management_create" 
                            size="small"
                            @change="(checked) => handlePermissionChange('product', 'create', checked)"
                          />
                          <label style="font-size: 13px; font-weight: 500; color: #374151; cursor: pointer;">Create</label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 6px; background: #f9fafb; transition: background 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                          <a-switch 
                            v-model:checked="product_management_update" 
                            size="small"
                            @change="(checked) => handlePermissionChange('product', 'update', checked)"
                          />
                          <label style="font-size: 13px; font-weight: 500; color: #374151; cursor: pointer;">Update</label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 6px; background: #f9fafb; transition: background 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                          <a-switch 
                            v-model:checked="product_management_delete" 
                            size="small"
                            @change="(checked) => handlePermissionChange('product', 'delete', checked)"
                          />
                          <label style="font-size: 13px; font-weight: 500; color: #374151; cursor: pointer;">Delete</label>
                        </div>
                      </div>
                    </div>
                  </a-col>

                  <a-col :span="12" style="padding:5px;">
                    <!-- Community Post Card -->
                    <div style="background: white; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); margin-bottom: 12px; overflow: hidden; transition: box-shadow 0.2s;" onmouseover="this.style.boxShadow='0 3px 10px rgba(0,0,0,0.12)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.08)'">
                      <div style="background: linear-gradient(90deg, #d1fae5 0%, #a7f3d0 100%); padding: 12px 16px; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; gap: 10px;">
                        <div style="padding: 6px; background: white; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                          <svg style="width: 16px; height: 16px; color: #10b981;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                          </svg>
                        </div>
                        <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #1f2937;">Community Post</h3>
                      </div>
                      <div style="padding: 12px 16px; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px;">
                        <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 6px; background: #f9fafb; transition: background 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                          <a-switch 
                            v-model:checked="community_post_create" 
                            size="small"
                            @change="(checked) => handlePermissionChange('community', 'create', checked)"
                          />
                          <label style="font-size: 13px; font-weight: 500; color: #374151; cursor: pointer;">Create</label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 6px; background: #f9fafb; transition: background 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                          <a-switch 
                            v-model:checked="community_post_read" 
                            size="small"
                            @change="(checked) => handlePermissionChange('community', 'read', checked)"
                          />
                          <label style="font-size: 13px; font-weight: 500; color: #374151; cursor: pointer;">Read</label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 6px; background: #f9fafb; transition: background 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                          <a-switch 
                            v-model:checked="community_post_post_update" 
                            size="small"
                            @change="(checked) => handlePermissionChange('community', 'update', checked)"
                          />
                          <label style="font-size: 13px; font-weight: 500; color: #374151; cursor: pointer;">Update</label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 6px; background: #f9fafb; transition: background 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                          <a-switch 
                            v-model:checked="community_post_delete" 
                            size="small"
                            @change="(checked) => handlePermissionChange('community', 'delete', checked)"
                          />
                          <label style="font-size: 13px; font-weight: 500; color: #374151; cursor: pointer;">Delete</label>
                        </div>
                      </div>
                    </div>
                  </a-col>

                  <a-col :span="12" style="padding:5px;">
                    <!-- Manage User Create Request Card -->
                    <div style="background: white; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); margin-bottom: 12px; overflow: hidden; transition: box-shadow 0.2s;" onmouseover="this.style.boxShadow='0 3px 10px rgba(0,0,0,0.12)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.08)'">
                      <div style="background: linear-gradient(90deg, #fed7aa 0%, #fde68a 100%); padding: 12px 16px; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; gap: 10px;">
                        <div style="padding: 6px; background: white; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                          <svg style="width: 16px; height: 16px; color: #f59e0b;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                          </svg>
                        </div>
                        <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #1f2937;">User Request Management</h3>
                      </div>
                      <div style="padding: 12px 16px; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px;">
                        <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 6px; background: #f9fafb; transition: background 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                          <a-switch 
                            v-model:checked="manage_user_request_read" 
                            size="small"
                            @change="(checked) => handlePermissionChange('user_room_request', 'read', checked)"
                          />
                          <label style="font-size: 13px; font-weight: 500; color: #374151; cursor: pointer;">Read</label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 6px; background: #f9fafb; transition: background 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                          <a-switch 
                            v-model:checked="manage_user_request_update" 
                            size="small"
                            @change="(checked) => handlePermissionChange('user_room_request', 'update', checked)"
                          />
                          <label style="font-size: 13px; font-weight: 500; color: #374151; cursor: pointer;">Update</label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 6px; background: #f9fafb; transition: background 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                          <a-switch 
                            v-model:checked="manage_user_request_reject" 
                            size="small"
                            @change="(checked) => handlePermissionChange('user_room_request', 'reject', checked)"
                          />
                          <label style="font-size: 13px; font-weight: 500; color: #374151; cursor: pointer;">Reject</label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 6px; background: #f9fafb; transition: background 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#f9fafb'">
                          <a-switch 
                            v-model:checked="manage_user_request_process" 
                            size="small"
                            @change="(checked) => handlePermissionChange('user_room_request', 'process', checked)"
                          />
                          <label style="font-size: 13px; font-weight: 500; color: #374151; cursor: pointer;">Process</label>
                        </div>
                      </div>
                    </div>
                  </a-col>
                </a-row>

                <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px; align-items: center;">
                  <!-- Unsaved Changes Indicator -->
                  <span v-if="hasUnsavedChanges" style="color: #f59e0b; font-size: 13px; font-weight: 500; margin-right: auto;">
                    <svg style="width: 14px; height: 14px; display: inline; vertical-align: middle;" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    Unsaved changes
                  </span>
                  
                  <button 
                    @click="cancelPermissionChanges" 
                    style="padding: 8px 18px; background: #e5e7eb; color: #374151; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;" 
                    onmouseover="this.style.background='#d1d5db'; this.style.transform='translateY(-1px)'" 
                    onmouseout="this.style.background='#e5e7eb'; this.style.transform='translateY(0)'">
                    Cancel
                  </button>
                  
                  <button 
                    @click="savePermissionChanges" 
                    :disabled="!hasUnsavedChanges"
                    :style="{
                      padding: '8px 18px',
                      background: hasUnsavedChanges ? '#3b82f6' : '#94a3b8',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: hasUnsavedChanges ? 'pointer' : 'not-allowed',
                      boxShadow: hasUnsavedChanges ? '0 1px 3px rgba(59,130,246,0.3)' : 'none',
                      transition: 'all 0.2s'
                    }"
                    @mouseover="hasUnsavedChanges && ($event.target.style.background='#2563eb')"
                    @mouseout="hasUnsavedChanges && ($event.target.style.background='#3b82f6')">
                    Save Changes
                  </button>
                </div>

              </a-tab-pane>
              <a-tab-pane key="tasks" tab="Tasks Assigned">
                <task_List :tasks="staff_details.tasks"/>
              </a-tab-pane>
              <a-tab-pane key="access-logs" tab="Access Logs">
                    <div 
                      v-for="log in staff_details.access_logs" 
                      :key="log.id"
                      style="width: 100%; padding: 15px; border: 1px solid #ccc; border-radius: 12px; margin-bottom: 12px; background-color: #f9f9f9; box-shadow: 0 2px 5px rgba(0,0,0,0.1); font-family: Arial, sans-serif;"
                    >
                      <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">
                        Action: <span style="color: green;">{{ log.action }}</span>
                      </div>
<!--                       
                      <div style="margin-bottom: 5px;">
                        Performed By: <span style="color: #555;">{{ log.performed_by }}</span>
                      </div> -->

                      <div style="margin-bottom: 5px;">
                        Message: <span style="color: #333;">{{ log.details.message }}</span>
                      </div>

                      <div style="margin-bottom: 5px; font-size: 12px; color: #888;">
                        Timestamp: {{ new Date(log.timestamp).toLocaleString() }}
                      </div>

                      <div style="font-size: 12px; color: #888;">
                        User Agent: {{ log.user_agent }}
                      </div>
                    </div>
              </a-tab-pane>
            </a-tabs>
          </a-col>
            <a-col :sm="24" :xs="24" :md="8" :lg="6" style="padding:10px;" v-if="staff_details">
              <!-- Desktop Layout -->
              <div style="background:#3B63F6;padding:10px;border-radius:15px;min-height:200px">
                  <div style="background:white;padding:10px;border-radius:15px;min-height:200px;display:flex;justify-content:center;align-items: center;">
                    <div style="display:flex;justify-content:center;align-items: center;flex-direction: column;">

                      <img style="border:1px solid rgba(0,0,0,0.1);border-radius:100%;width:100px;height:100px" :src="this.$store.state.root_media_api+staff_details.avatar" alt="">
                      <p>{{staff_details.email}}</p>
                    </div>  
                  </div>
                  <div style="color:white">
                  <br>
                    <h4>Name: <span>{{staff_details.name}}</span></h4>
                    <h4 v-if="staff_details.phone_number">Phone: <span>{{staff_details.phone_number}}</span></h4>
                    <h4 v-if="staff_details.date_joined">Created At: <span>{{staff_details.date_joined}} </span></h4>
                  <br>
                   <div style="display:flex;gap:6px;justify-content:center;">
                    <a-button type="default" shape="circle" @click.stop="show_Phone_employee_modal()">
                      <PhoneOutlined />
                    </a-button>
                    <a-button type="default" shape="circle" @click.stop="show_Mail_employee_modal()">
                      <MailOutlined />
                    </a-button>
                    <a-button type="default" shape="circle" @click.stop="show_Edit_employee_modal()">
                      <EditOutlined />
                    </a-button>
                    <a-button type="primary" danger shape="circle" @click.stop="show_Delete_employee_modal()">
                      <DeleteOutlined />
                    </a-button>
                  </div>
                  </div>
              </div>
            </a-col>
          </a-row>
          <br>
            

        </a-col>
      </a-row>
    </div>
    </div>

  </div>
</template>

<script>
import { EditOutlined,DeleteOutlined ,LeftOutlined,  PhoneOutlined,MailOutlined} from '@ant-design/icons-vue';

import task_List from '@/components/store/tasks_assigned_list.vue'
export default {
  name: 'manage_access',
  data() {
    return {
      openAssignTaskModal: false,
      openCreateNewtaskModal: false,
      
      open_Phone_employee_modal:false,
      open_Mail_employee_modal:false,
      open_Edit_employee_modal:false,
      open_Delete_employee_modal:false,

      view:'all_staff_view',
      userTab:'overview',
      activeTab: 'all-staff',
      all_staff: [],
      staff_details:null,
      hasUnsavedChanges: false,

      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: 'Access Permisions',
          dataIndex: 'access_permissions',
          key: 'access_permissions',
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
          align: 'center',
        },
      ],


      
      mailForm: {
        to: '',
        subject: '',
        message: ''
      },
      
      editEmployeeForm: {
        name: '',
        email: '',
        phone: '',
        avatar: '',
        date_joined: '',
        last_login: ''
      },
      
      deleteConfirmation: '',
      // permissions
      business_site_read: false,
      business_site_update: false,
      
      product_management_create: false,
      product_management_update: false,
      product_management_read: false,
      product_management_delete: false,
      
      community_post_create: false,
      community_post_post_update: false,
      community_post_read: false,
      community_post_delete: false,
      
      manage_user_request_read: false,
      manage_user_request_update: false,
      manage_user_request_reject: false,
      manage_user_request_process: false,
    };
  },
components:{EditOutlined,DeleteOutlined ,LeftOutlined,  PhoneOutlined,MailOutlined,task_List},
  methods: {
    show_Phone_employee_modal(){this.open_Phone_employee_modal= !this.open_Phone_employee_modal},
    show_Mail_employee_modal(){this.open_Mail_employee_modal= !this.open_Mail_employee_modal},
    show_Edit_employee_modal(){this.open_Edit_employee_modal= !this.open_Edit_employee_modal},
    show_Delete_employee_modal(){this.open_Delete_employee_modal= !this.open_Delete_employee_modal},

    // Phone Modal Methods
    makeCall() {
      const phone = this.selectedEmployee?.phone;
      if (phone) {
        window.location.href = `tel:${phone}`;
      }
    },
    
    openWhatsApp() {
      const phone = this.selectedEmployee?.phone;
      if (phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
      }
    },
    
    // Mail Modal Methods
    sendEmail() {
      if (!this.mailForm.subject.trim() || !this.mailForm.message.trim()) {
        this.$message.error('Subject and message are required');
        return;
      }
      
      // Send email logic here
      console.log('Email sent:', this.mailForm);
      this.$message.success('Email sent successfully');
      this.open_Mail_employee_modal = false;
      this.resetMailForm();
    },
    
    // Edit Employee Methods
    openEditModal(employee) {
      this.selectedEmployee = employee;
      this.editEmployeeForm = {
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        avatar: employee.avatar || '',
        date_joined: employee.date_joined || '',
        last_login: employee.last_login || ''
      };
      this.open_Edit_employee_modal = true;
    },
    
  handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.$message.error('Image size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        this.$message.error('Please upload a valid image file');
        return;
      }

      // Convert to base64 or file URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.editEmployeeForm.avatar = e.target.result;
        this.$message.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  },

  removeAvatar() {
    this.editEmployeeForm.avatar = '';
    this.$message.info('Image removed');
  },

  saveEmployeeChanges() {
    if (!this.editEmployeeForm.name.trim() || !this.editEmployeeForm.email.trim()) {
      this.$message.error('Name and email are required');
      return;
    }

    // Send to backend
    console.log('Employee updated:', this.editEmployeeForm);
    this.$message.success('Employee updated successfully');
    this.open_Edit_employee_modal = false;
  },
    
    // Delete Employee Methods
    openDeleteModal(employee) {
      this.selectedEmployee = employee;
      this.deleteConfirmation = '';
      this.open_Delete_employee_modal = true;
    },
    
    confirmDeleteEmployee() {
      if (this.deleteConfirmation !== 'CONFIRM') {
        this.$message.error('Please type CONFIRM to delete');
        return;
      }
      
      // Delete employee logic here
      console.log('Employee deleted:', this.selectedEmployee);
      this.$message.success('Employee deleted successfully');
      this.open_Delete_employee_modal = false;
      this.deleteConfirmation = '';
    },
    
    // Utility Methods
    resetMailForm() {
      this.mailForm = {
        to: '',
        subject: '',
        message: ''
      };
    },
    
    // Call these methods from parent to open modals
    openPhoneModal(employee) {
      this.selectedEmployee = employee;
      this.open_Phone_employee_modal = true;
    },
    
    openMailModal(employee) {
      this.selectedEmployee = employee;
      this.mailForm.to = employee.email;
      this.open_Mail_employee_modal = true;
    },


    showAssignTaskModal() {
      this.openAssignTaskModal = !this.openAssignTaskModal;
    },

      showCreateNewtaskModal(email){
        this.openCreateNewtaskModal=true
      },


    async fetchAllStaff() {
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/all-staff-users/`,
          {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
          }
        );

        const data = await response.json();
        if (!data.error) {
          this.all_staff = data.staff_users;
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    },
    

    /**
     * fetch the staff here 
     */
    
    async fetchStaff(email){
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/staff-access-given/${email}`,
          {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
          }
        );

        const data = await response.json();
        if (!data.error) {
          this.staff_details = data.staff_user;

          // Reset unsaved changes flag when loading fresh data
          this.hasUnsavedChanges = false;

          // Set the toggles on/off
          this.business_site_read = this.staff_details.access_received.business.read;
          this.business_site_update = this.staff_details.access_received.business.update;

          this.product_management_create = this.staff_details.access_received.product.create;
          this.product_management_update = this.staff_details.access_received.product.update;
          this.product_management_read = this.staff_details.access_received.product.read;
          this.product_management_delete = this.staff_details.access_received.product.delete;
          
          this.community_post_create = this.staff_details.access_received.community.create;
          this.community_post_post_update = this.staff_details.access_received.community.update;
          this.community_post_read = this.staff_details.access_received.community.read;
          this.community_post_delete = this.staff_details.access_received.community.delete;
          
          this.manage_user_request_read = this.staff_details.access_received.user_room_request.read;
          this.manage_user_request_update = this.staff_details.access_received.user_room_request.update;
          this.manage_user_request_reject = this.staff_details.access_received.user_room_request.reject;
          this.manage_user_request_process = this.staff_details.access_received.user_room_request.process;
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    },

    /**
     * Handle individual permission change - marks form as having unsaved changes
     */
    handlePermissionChange(category, permission, value) {
      console.log(`Permission ${category}.${permission} changed to ${value}`);
      this.hasUnsavedChanges = true;
    },

    /**
     * Save all permission changes
     */
    async savePermissionChanges() {
      if (!this.staff_details) {
        this.$message.error('No staff member selected');
        return;
      }

      try {
        const permissions = {
          business: {
            read: this.business_site_read,
            update: this.business_site_update
          },
          product: {
            create: this.product_management_create,
            read: this.product_management_read,
            update: this.product_management_update,
            delete: this.product_management_delete
          },
          community: {
            create: this.community_post_create,
            read: this.community_post_read,
            update: this.community_post_post_update,
            delete: this.community_post_delete
          },
          user_room_request: {
            read: this.manage_user_request_read,
            update: this.manage_user_request_update,
            reject: this.manage_user_request_reject,
            process: this.manage_user_request_process
          }
        };

        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/update-staff-permissions/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              staff_email: this.staff_details.email,
              permissions: permissions
            })
          }
        );

        const data = await response.json();

        if (!data.error) {
          this.$message.success('Permissions updated successfully');
          
          // Reset unsaved changes flag
          this.hasUnsavedChanges = false;
          
          // Show detailed results in console
          if (data.results.granted.length > 0) {
            console.log('Granted:', data.results.granted);
          }
          if (data.results.revoked.length > 0) {
            console.log('Revoked:', data.results.revoked);
          }
          
          // Refresh staff details
          await this.fetchStaff(this.staff_details.email);
        } else {
          this.$message.error(data.message || 'Failed to update permissions');
        }
      } catch (error) {
        console.error('Error updating permissions:', error);
        this.$message.error('An error occurred while updating permissions');
      }
    },

    /**
     * Grant all permissions to staff member
     */
    async grantAllPermissions() {
      if (!this.staff_details) {
        this.$message.error('No staff member selected');
        return;
      }

      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/bulk-update-permissions/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              staff_email: this.staff_details.email,
              action: 'grant_all'
            })
          }
        );

        const data = await response.json();

        if (!data.error) {
          this.$message.success('All permissions granted successfully');
          
          // Update local state
          this.business_site_read = true;
          this.business_site_update = true;
          
          this.product_management_create = true;
          this.product_management_read = true;
          this.product_management_update = true;
          this.product_management_delete = true;
          
          this.community_post_create = true;
          this.community_post_read = true;
          this.community_post_post_update = true;
          this.community_post_delete = true;
          
          this.manage_user_request_read = true;
          this.manage_user_request_update = true;
          this.manage_user_request_reject = true;
          this.manage_user_request_process = true;

          // Reset unsaved changes flag
          this.hasUnsavedChanges = false;
          
          // Refresh staff details
          await this.fetchStaff(this.staff_details.email);
        } else {
          this.$message.error(data.message || 'Failed to grant permissions');
        }
      } catch (error) {
        console.error('Error granting permissions:', error);
        this.$message.error('An error occurred while granting permissions');
      }
    },

    /**
     * Revoke all permissions from staff member
     */
    async revokeAllPermissions() {
      if (!this.staff_details) {
        this.$message.error('No staff member selected');
        return;
      }

      // Show confirmation using Ant Design Modal
      this.$confirm({
        title: 'Revoke All Permissions?',
        content: `Are you sure you want to revoke all permissions from ${this.staff_details.name}? This action will remove all their access rights.`,
        okText: 'Yes, Revoke All',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
          try {
            const response = await fetch(
              `${this.$store.state.root_api}access-engine/api/bulk-update-permissions/`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Token ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  staff_email: this.staff_details.email,
                  action: 'revoke_all'
                })
              }
            );

            const data = await response.json();

            if (!data.error) {
              this.$message.success('All permissions revoked successfully');
              
              // Update local state
              this.business_site_read = false;
              this.business_site_update = false;
              
              this.product_management_create = false;
              this.product_management_read = false;
              this.product_management_update = false;
              this.product_management_delete = false;
              
              this.community_post_create = false;
              this.community_post_read = false;
              this.community_post_post_update = false;
              this.community_post_delete = false;
              
              this.manage_user_request_read = false;
              this.manage_user_request_update = false;
              this.manage_user_request_reject = false;
              this.manage_user_request_process = false;

              // Reset unsaved changes flag
              this.hasUnsavedChanges = false;
              
              // Refresh staff details
              await this.fetchStaff(this.staff_details.email);
            } else {
              this.$message.error(data.message || 'Failed to revoke permissions');
            }
          } catch (error) {
            console.error('Error revoking permissions:', error);
            this.$message.error('An error occurred while revoking permissions');
          }
        }
      });
    },

    /**
     * Cancel changes and revert to original permissions
     */
    cancelPermissionChanges() {
      if (!this.staff_details) return;
      
      // Revert to original values from staff_details
      this.business_site_read = this.staff_details.access_received.business.read;
      this.business_site_update = this.staff_details.access_received.business.update;

      this.product_management_create = this.staff_details.access_received.product.create;
      this.product_management_update = this.staff_details.access_received.product.update;
      this.product_management_read = this.staff_details.access_received.product.read;
      this.product_management_delete = this.staff_details.access_received.product.delete;
      
      this.community_post_create = this.staff_details.access_received.community.create;
      this.community_post_post_update = this.staff_details.access_received.community.update;
      this.community_post_read = this.staff_details.access_received.community.read;
      this.community_post_delete = this.staff_details.access_received.community.delete;
      
      this.manage_user_request_read = this.staff_details.access_received.user_room_request.read;
      this.manage_user_request_update = this.staff_details.access_received.user_room_request.update;
      this.manage_user_request_reject = this.staff_details.access_received.user_room_request.reject;
      this.manage_user_request_process = this.staff_details.access_received.user_room_request.process;
      
      // Reset unsaved changes flag
      this.hasUnsavedChanges = false;
      
      this.$message.info('Changes cancelled');
    },

    customRow(record) {
      return {
        onClick: () => this.showStaffDetails(record.email),
        style: { cursor: 'pointer' }
      };
    },

    onEdit(record) {
      console.log('edit', record);
    },

    onDelete(record) {
      console.log('delete', record);
    },

    showStaffDetails(email) {
      console.log(email);
      this.fetchStaff(email);
      this.view = "staff_details_view";
    },

    backToManageAccess() {
      this.view = "all_staff_view";
      this.hasUnsavedChanges = false;
    }
  },

  mounted() {
    this.fetchAllStaff();
  }
};
</script>
