<template>
  <div class="staff-task-container">
    <!-- Header -->
    <div class="page-header">
      <a-row type="flex" justify="space-between" align="middle">
        <a-col>
          <h2>
            <a-icon type="left" @click="goBack" class="back-icon" />
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

    <!-- Stats Cards -->
    <a-row :gutter="16" style="margin-bottom: 24px;">
      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="stat-card">
          <a-statistic
            title="Total Tasks"
            :value="taskStats.total_tasks"
            prefix-icon="file-text"
          >
            <template #prefix>
              <a-icon type="file-text" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="stat-card">
          <a-statistic
            title="Ongoing Tasks"
            :value="taskStats.ongoing_tasks"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <a-icon type="sync" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="stat-card">
          <a-statistic
            title="Completed"
            :value="taskStats.completed_tasks"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix>
              <a-icon type="check-circle" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="stat-card">
          <a-statistic
            title="Internal Staff"
            :value="internalStaffCount"
            :value-style="{ color: '#722ed1' }"
          >
            <template #prefix>
              <a-icon type="team" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- Main Tabs -->
    <a-card :bordered="false" class="main-card">
      <a-tabs v-model:activeKey="activeTab" @change="onTabChange">
        
        <!-- All Tasks Tab -->
        <a-tab-pane key="all-tasks" tab="All Tasks">
          <div class="filters-section">
            <a-row type="flex" justify="space-between" align="middle">
              <a-col>
                <a-radio-group v-model:value="taskStatusFilter" @change="filterTasks" button-style="solid">
                  <a-radio-button value="all">All</a-radio-button>
                  <a-radio-button value="new">New</a-radio-button>
                  <a-radio-button value="ongoing">Ongoing</a-radio-button>
                  <a-radio-button value="completed">Completed</a-radio-button>
                  <a-radio-button value="verified">Verified</a-radio-button>
                </a-radio-group>
              </a-col>
              <a-col>
                <a-input-search
                  placeholder="Search tasks..."
                  style="width: 250px;"
                  @search="searchTasks"
                />
              </a-col>
            </a-row>
          </div>

          <a-table
            :columns="allTasksColumns"
            :data-source="filteredTasks"
            :loading="loadingData"
            :pagination="pagination"
            row-key="id"
            :scroll="{ x: 1300 }"
          >
            <template #bodyCell="{ column, record }">
              <!-- Assigned To -->
              <template v-if="column.key === 'assigned_to'">
                <a-row type="flex" align="middle">
                  <a-avatar
                    :src="$store.state.root_media_api + (record.assigned_to.profile_picture || '')"
                    :size="36"
                    icon="user"
                  />
                  <div style="margin-left: 10px;">
                    <div class="staff-name">{{ record.assigned_to.full_name }}</div>
                    <a-tag :color="record.assignment_type === 'internal_staff' ? 'green' : 'orange'" size="small">
                      {{ record.assignment_type === 'internal_staff' ? 'Internal' : 'External' }}
                    </a-tag>
                  </div>
                </a-row>
              </template>

              <!-- Task -->
              <template v-if="column.key === 'task'">
                <div class="task-info">
                  <div class="task-title">{{ record.title }}</div>
                  <div class="task-description">
                    {{ truncateText(record.description, 60) }}
                  </div>
                </div>
              </template>

              <!-- Status -->
              <template v-if="column.key === 'status'">
                <a-badge
                  :status="getStatusBadge(record.status)"
                  :text="record.status_display"
                />
              </template>

              <!-- Priority -->
              <template v-if="column.key === 'priority'">
                <a-tag :color="getPriorityColor(record.priority)">
                  {{ record.priority_display }}
                </a-tag>
              </template>

              <!-- Progress -->
              <template v-if="column.key === 'progress'">
                <a-progress
                  :percent="getTaskProgress(record.status)"
                  :status="getProgressStatus(record.status)"
                  :stroke-width="6"
                  size="small"
                />
              </template>

              <!-- Due Date -->
              <template v-if="column.key === 'due_date'">
                <span :class="{'overdue': isOverdue(record.due_date, record.status)}">
                  {{ formatDate(record.due_date) }}
                </span>
              </template>

              <!-- Actions -->
              <template v-if="column.key === 'actions'">
                <a-space>
                  <a-button
                    type="link"
                    size="small"
                    @click="viewTaskDetails(record)"
                  >
                    <a-icon type="eye" /> View
                  </a-button>
                  <a-dropdown v-if="record.status !== 'verified' && record.status !== 'cancelled'">
                    <a-button size="small">
                      Actions <a-icon type="down" />
                    </a-button>
                    <template #overlay>
                      <a-menu>
                        <a-menu-item v-if="record.status === 'completed'" @click="verifyTask(record)">
                          <a-icon type="check-circle" /> Verify Completion
                        </a-menu-item>
                        <a-menu-item @click="sendReminder(record)">
                          <a-icon type="bell" /> Send Reminder
                        </a-menu-item>
                        <a-menu-divider />
                        <a-menu-item @click="confirmCancelTask(record)">
                          <a-icon type="close-circle" style="color: red;" /> Cancel Task
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <!-- Internal Staff Tab -->
        <a-tab-pane key="internal-staff" tab="Internal Staff">
          <div style="margin-bottom: 16px;">
            <a-button type="dashed" @click="showAddStaffModal" icon="plus">
              Add Internal Staff
            </a-button>
          </div>

          <a-table
            :columns="internalStaffColumns"
            :data-source="internalStaffList"
            :loading="loadingData"
            :pagination="{ pageSize: 10 }"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <!-- User -->
              <template v-if="column.key === 'user'">
                <a-row type="flex" align="middle">
                  <a-avatar
                    :src="$store.state.root_media_api + record.user.profile_picture"
                    :size="40"
                    icon="user"
                  />
                  <div style="margin-left: 12px;">
                    <div class="staff-name">{{ record.user.full_name }}</div>
                    <div class="staff-email">{{ record.user.email }}</div>
                  </div>
                </a-row>
              </template>

              <!-- Permissions -->
              <template v-if="column.key === 'permissions'">
                <a-tag
                  v-for="perm in record.permissions"
                  :key="perm"
                  color="blue"
                  style="margin: 2px;"
                >
                  {{ perm.toUpperCase() }}
                </a-tag>
              </template>

              <!-- Active Tasks -->
              <template v-if="column.key === 'active_tasks'">
                <a-badge
                  :count="getStaffActiveTasks(record.user.email)"
                  :number-style="{ backgroundColor: '#52c41a' }"
                />
              </template>

              <!-- Actions -->
              <template v-if="column.key === 'actions'">
                <a-space>
                  <a-button
                    type="primary"
                    size="small"
                    @click="assignTaskToStaff(record)"
                  >
                    <a-icon type="plus" /> Assign Task
                  </a-button>
                  <a-button
                    size="small"
                    @click="viewStaffTasks(record)"
                  >
                    <a-icon type="file-text" /> View Tasks
                  </a-button>
                  <a-button
                    size="small"
                    @click="editStaffPermissions(record)"
                  >
                    <a-icon type="edit" /> Edit
                  </a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <!-- External Staff Tab -->
        <a-tab-pane key="external-staff" tab="External Staff">
          <div style="margin-bottom: 16px;">
            <a-button type="dashed" @click="showRequestAccessModal" icon="user-add">
              Request Access from Professional
            </a-button>
          </div>

          <a-table
            :columns="externalStaffColumns"
            :data-source="externalStaffList"
            :loading="loadingData"
            :pagination="{ pageSize: 10 }"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <!-- User -->
              <template v-if="column.key === 'user'">
                <a-row type="flex" align="middle">
                  <a-avatar
                    :src="$store.state.root_media_api + record.user.profile_picture"
                    :size="40"
                    icon="user"
                  />
                  <div style="margin-left: 12px;">
                    <div class="staff-name">{{ record.user.full_name }}</div>
                    <div class="staff-email">{{ record.user.email }}</div>
                  </div>
                </a-row>
              </template>

              <!-- Status -->
              <template v-if="column.key === 'status'">
                <a-badge
                  :status="record.is_active ? 'success' : 'default'"
                  :text="record.is_active ? 'Active' : 'Revoked'"
                />
              </template>

              <!-- Active Tasks -->
              <template v-if="column.key === 'active_tasks'">
                <a-badge
                  :count="getStaffActiveTasks(record.user.email)"
                  :number-style="{ backgroundColor: '#1890ff' }"
                />
              </template>

              <!-- Actions -->
              <template v-if="column.key === 'actions'">
                <a-space>
                  <a-button
                    v-if="record.is_active"
                    type="primary"
                    size="small"
                    @click="assignTaskToStaff(record)"
                  >
                    <a-icon type="plus" /> Assign Task
                  </a-button>
                  <a-button
                    size="small"
                    @click="viewStaffTasks(record)"
                  >
                    <a-icon type="file-text" /> View Tasks
                  </a-button>
                  <a-popconfirm
                    v-if="record.is_active"
                    title="Revoke access for this professional?"
                    @confirm="revokeAccess(record.id)"
                  >
                    <a-button type="danger" size="small">
                      <a-icon type="stop" /> Revoke
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <!-- Pending Requests Tab -->
        <a-tab-pane key="pending-requests" tab="Pending Requests">
          <a-table
            :columns="pendingRequestsColumns"
            :data-source="pendingRequestsList"
            :loading="loadingData"
            :pagination="{ pageSize: 10 }"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <!-- User -->
              <template v-if="column.key === 'user'">
                <a-row type="flex" align="middle">
                  <a-avatar
                    :src="$store.state.root_media_api + record.requested_to.avatar"
                    :size="40"
                    icon="user"
                  />
                  <div style="margin-left: 12px;">
                    <div class="staff-name">{{ record.requested_to.full_name }}</div>
                    <div class="staff-email">{{ record.requested_to.email }}</div>
                  </div>
                </a-row>
              </template>

              <!-- Status -->
              <template v-if="column.key === 'status'">
                <a-tag :color="getRequestStatusColor(record.status)">
                  {{ record.status.toUpperCase() }}
                </a-tag>
                <a-tag v-if="record.is_expired" color="red">EXPIRED</a-tag>
              </template>

              <!-- Expires At -->
              <template v-if="column.key === 'expires_at'">
                <span :class="{'text-danger': isExpiringSoon(record.expires_at)}">
                  {{ formatDate(record.expires_at) }}
                </span>
              </template>

              <!-- Actions -->
              <template v-if="column.key === 'actions'">
                <a-space>
                  <a-button
                    size="small"
                    @click="viewRequestDetails(record)"
                  >
                    View Details
                  </a-button>
                  <a-popconfirm
                    v-if="record.status === 'pending'"
                    title="Cancel this request?"
                    @confirm="cancelRequest(record.id)"
                  >
                    <a-button type="danger" size="small">Cancel</a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- Assign Task Modal -->
    <a-modal
      :visible="assignTaskModalVisible"
      :title="selectedStaff ? `Assign Task to ${selectedStaff.user.full_name}` : 'Assign New Task'"
      @cancel="closeAssignTaskModal"
      width="800px"
      :footer="null"
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

    <!-- Task Details Modal -->
    <a-modal
      :visible="taskDetailsModalVisible"
      title="Task Details"
      @cancel="taskDetailsModalVisible = false"
      width="1000px"
      :footer="null"
    >
      <div v-if="selectedTask">
        <a-descriptions bordered :column="2" size="middle">
          <a-descriptions-item label="Title" :span="2">
            <strong>{{ selectedTask.title }}</strong>
          </a-descriptions-item>
          <a-descriptions-item label="Description" :span="2">
            {{ selectedTask.description }}
          </a-descriptions-item>
          <a-descriptions-item label="Assigned To">
            <a-row type="flex" align="middle">
              <a-avatar
                :src="$store.state.root_media_api + selectedTask.assigned_to.profile_picture"
                :size="24"
              />
              <span style="margin-left: 8px;">{{ selectedTask.assigned_to.full_name }}</span>
            </a-row>
          </a-descriptions-item>
          <a-descriptions-item label="Status">
            <a-badge
              :status="getStatusBadge(selectedTask.status)"
              :text="selectedTask.status_display"
            />
          </a-descriptions-item>
          <a-descriptions-item label="Priority">
            <a-tag :color="getPriorityColor(selectedTask.priority)">
              {{ selectedTask.priority_display }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Progress">
            <a-progress
              :percent="getTaskProgress(selectedTask.status)"
              :status="getProgressStatus(selectedTask.status)"
            />
          </a-descriptions-item>
          <a-descriptions-item label="Created At">
            {{ formatDate(selectedTask.created_at) }}
          </a-descriptions-item>
          <a-descriptions-item label="Due Date">
            <span :class="{'text-danger': isOverdue(selectedTask.due_date, selectedTask.status)}">
              {{ formatDate(selectedTask.due_date) }}
            </span>
          </a-descriptions-item>
        </a-descriptions>

        <!-- Timeline -->
        <div style="margin-top: 24px;">
          <h4>Task Timeline</h4>
          <a-timeline>
            <a-timeline-item v-if="selectedTask.created_at" color="blue">
              <strong>Task Created</strong>
              <br />
              {{ formatDate(selectedTask.created_at) }}
            </a-timeline-item>
            <a-timeline-item v-if="selectedTask.accepted_at" color="green">
              <strong>Task Accepted</strong>
              <br />
              {{ formatDate(selectedTask.accepted_at) }}
            </a-timeline-item>
            <a-timeline-item v-if="selectedTask.started_at" color="blue">
              <strong>Task Started</strong>
              <br />
              {{ formatDate(selectedTask.started_at) }}
            </a-timeline-item>
            <a-timeline-item v-if="selectedTask.completed_at" color="green">
              <strong>Task Completed</strong>
              <br />
              {{ formatDate(selectedTask.completed_at) }}
              <p v-if="selectedTask.completion_notes">
                <em>Notes: {{ selectedTask.completion_notes }}</em>
              </p>
            </a-timeline-item>
            <a-timeline-item v-if="selectedTask.verified_at" color="green">
              <strong>Task Verified</strong>
              <br />
              {{ formatDate(selectedTask.verified_at) }}
            </a-timeline-item>
          </a-timeline>
        </div>

        <!-- Comments Section -->
        <div style="margin-top: 24px;">
          <h4>Comments ({{ (selectedTask.comments || []).length }})</h4>
          <a-list
            v-if="selectedTask.comments && selectedTask.comments.length"
            :data-source="selectedTask.comments"
            item-layout="horizontal"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-comment
                  :author="item.author.full_name"
                  :datetime="formatDate(item.created_at)"
                >
                  <template #content>
                    <p>{{ item.comment }}</p>
                  </template>
                </a-comment>
              </a-list-item>
            </template>
          </a-list>
          <a-empty v-else description="No comments yet" />
        </div>

        <!-- Attachments -->
        <div style="margin-top: 24px;">
          <h4>Attachments ({{ (selectedTask.attachments || []).length }})</h4>
          <a-list
            v-if="selectedTask.attachments && selectedTask.attachments.length"
            :data-source="selectedTask.attachments"
            :grid="{ gutter: 16, xs: 1, sm: 2, md: 3 }"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-card size="small">
                  <a :href="item.file_url" target="_blank">
                    <a-icon type="paper-clip" /> {{ item.file_name }}
                  </a>
                  <div style="font-size: 12px; color: #999; margin-top: 4px;">
                    {{ formatFileSize(item.file_size) }}
                  </div>
                </a-card>
              </a-list-item>
            </template>
          </a-list>
          <a-empty v-else description="No attachments" />
        </div>
      </div>
    </a-modal>

    <!-- Add Internal Staff Modal -->
    <a-modal
      title="Add Internal Staff"
      :visible="addStaffModalVisible"
      @cancel="addStaffModalVisible = false"
      @ok="handleAddStaff"
      :confirmLoading="savingData"
      width="600px"
    >
      <a-alert
        message="Internal staff must have email addresses with your business domain"
        type="info"
        show-icon
        style="margin-bottom: 16px;"
      />

      <a-form layout="vertical">
        <a-form-item label="Staff Email" required>
          <a-input
            v-model:value="staffForm.user_email"
            placeholder="staff@yourdomain.com"
            size="large"
          />
          <div style="margin-top: 8px; font-size: 12px; color: #999;">
            Must end with @{{ getBusinessDomain() }}
          </div>
        </a-form-item>

        <a-form-item label="Permissions" required>
          <a-checkbox-group v-model:value="staffForm.permissions">
            <a-row>
              <a-col :span="12" style="margin-bottom: 8px;">
                <a-checkbox value="read">Read</a-checkbox>
              </a-col>
              <a-col :span="12" style="margin-bottom: 8px;">
                <a-checkbox value="update">Update</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Request Access Modal -->
    <a-modal
      title="Request Access from Professional"
      :visible="requestAccessModalVisible"
      @cancel="requestAccessModalVisible = false"
      @ok="handleRequestAccess"
      :confirmLoading="savingData"
      width="700px"
    >
      <a-form layout="vertical">
        <a-form-item label="Search Professional by Email" required>
          <a-input
            v-model:value="accessRequestForm.user_email"
            placeholder="Type email to search..."
            size="large"
          />
        </a-form-item>

        <a-form-item label="Resource Type" required>
          <a-select v-model:value="accessRequestForm.resource_type" size="large">
            <a-select-option value="business_site">Business Site</a-select-option>
            <a-select-option value="product">Product Management</a-select-option>
            <a-select-option value="community_post">Community Posts</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Requested Permissions" required>
          <a-checkbox-group v-model:value="accessRequestForm.requested_permissions">
            <a-row>
              <a-col :span="12" style="margin-bottom: 8px;">
                <a-checkbox value="read">Read</a-checkbox>
              </a-col>
              <a-col :span="12" style="margin-bottom: 8px;">
                <a-checkbox value="create">Create</a-checkbox>
              </a-col>
              <a-col :span="12" style="margin-bottom: 8px;">
                <a-checkbox value="update">Update</a-checkbox>
              </a-col>
              <a-col :span="12" style="margin-bottom: 8px;">
                <a-checkbox value="delete">Delete</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item label="Request Message" required>
          <a-textarea
            v-model:value="accessRequestForm.request_message"
            placeholder="Explain why you need access..."
            :rows="4"
            size="large"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'StaffTaskManagement',
  
  data() {
    return {
      loadingData: false,
      savingData: false,
      loadingUsers: false,
      activeTab: 'all-tasks',
      taskStatusFilter: 'all',
      
      // Data Lists
      allTasksList: [],
      filteredTasks: [],
      internalStaffList: [],
      externalStaffList: [],
      pendingRequestsList: [],
      availableUsers: [],
      
      // Statistics
      taskStats: {
        total_tasks: 0,
        ongoing_tasks: 0,
        completed_tasks: 0,
        new_tasks: 0,
        verified_tasks: 0
      },
      internalStaffCount: 0,
      
      // Modals
      assignTaskModalVisible: false,
      taskDetailsModalVisible: false,
      addStaffModalVisible: false,
      requestAccessModalVisible: false,
      
      // Selected Items
      selectedTask: null,
      selectedStaff: null,
      
      // Forms
      taskForm: {
        assignment_type: 'internal_staff',
        assigned_to_email: '',
        title: '',
        description: '',
        priority: 'medium',
        estimated_hours: null,
        due_date: null
      },
      
      staffForm: {
        user_email: '',
        permissions: ['read']
      },
      
      accessRequestForm: {
        user_email: '',
        resource_type: 'business_site',
        requested_permissions: ['read'],
        request_message: ''
      },
      
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} items`
      },
      
      // Table Columns
      allTasksColumns: [
        {
          title: 'Assigned To',
          key: 'assigned_to',
          width: 220,
          fixed: 'left'
        },
        {
          title: 'Task',
          key: 'task',
          width: 300
        },
        {
          title: 'Priority',
          key: 'priority',
          width: 100
        },
        {
          title: 'Status',
          key: 'status',
          width: 130
        },
        {
          title: 'Progress',
          key: 'progress',
          width: 150
        },
        {
          title: 'Due Date',
          key: 'due_date',
          width: 150
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 180,
          fixed: 'right'
        }
      ],
      
      internalStaffColumns: [
        {
          title: 'Staff Member',
          key: 'user',
          width: 280
        },
        {
          title: 'Permissions',
          key: 'permissions',
          width: 200
        },
        {
          title: 'Active Tasks',
          key: 'active_tasks',
          width: 120
        },
        {
          title: 'Joined',
          dataIndex: 'granted_at',
          key: 'granted_at',
          width: 150,
          customRender: (text) => this.formatDate(text)
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 350,
          fixed: 'right'
        }
      ],
      
      externalStaffColumns: [
        {
          title: 'Professional',
          key: 'user',
          width: 280
        },
        {
          title: 'Resource Type',
          dataIndex: 'resource_type_display',
          key: 'resource_type',
          width: 150
        },
        {
          title: 'Status',
          key: 'status',
          width: 100
        },
        {
          title: 'Active Tasks',
          key: 'active_tasks',
          width: 120
        },
        {
          title: 'Granted',
          dataIndex: 'granted_at',
          key: 'granted_at',
          width: 150,
          customRender: (text) => this.formatDate(text)
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 300,
          fixed: 'right'
        }
      ],
      
      pendingRequestsColumns: [
        {
          title: 'Professional',
          key: 'user',
          width: 280
        },
        {
          title: 'Resource Type',
          dataIndex: 'resource_type_display',
          key: 'resource_type',
          width: 150
        },
        {
          title: 'Status',
          key: 'status',
          width: 130
        },
        {
          title: 'Requested',
          dataIndex: 'created_at',
          key: 'created_at',
          width: 150,
          customRender: (text) => this.formatDate(text)
        },
        {
          title: 'Expires',
          key: 'expires_at',
          width: 150
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 180,
          fixed: 'right'
        }
      ]
    };
  },
  
  mounted() {
    this.loadAllData();
  },
  
  methods: {
    async loadAllData() {
      await Promise.all([
        this.fetchTaskStats(),
        this.fetchAllTasks(),
        this.fetchInternalStaff(),
        this.fetchExternalStaff(),
        this.fetchPendingRequests()
      ]);
    },
    
    // Fetch Task Statistics
    async fetchTaskStats() {
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/tasks/statistics/`,
          {
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
          }
        );
        
        const data = await response.json();
        if (!data.error) {
          this.taskStats = data.statistics;
        }
      } catch (error) {
        console.error('Error fetching task stats:', error);
      }
    },
    
    // Fetch All Tasks
    async fetchAllTasks() {
      this.loadingData = true;
      try {
        const statusParam = this.taskStatusFilter !== 'all' ? `?status=${this.taskStatusFilter}` : '';
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/tasks/business-tasks/${statusParam}`,
          {
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
          }
        );
        
        const data = await response.json();
        if (!data.error) {
          this.allTasksList = data.tasks || [];
          this.filteredTasks = this.allTasksList;
        }
      } catch (error) {
        this.$message.error('Error loading tasks');
      } finally {
        this.loadingData = false;
      }
    },
    
    // Fetch Internal Staff
    async fetchInternalStaff() {
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/granted/?status=active`,
          {
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
          }
        );
        
        const data = await response.json();
        if (!data.error) {
          const businessDomain = this.getBusinessDomain();
          this.internalStaffList = (data.permissions || []).filter(
            p => p.user.email.endsWith(`@${businessDomain}`)
          );
          this.internalStaffCount = this.internalStaffList.length;
        }
      } catch (error) {
        this.$message.error('Error loading internal staff');
      }
    },
    
    // Fetch External Staff (Platform Professionals)
    async fetchExternalStaff() {
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/granted/?status=active`,
          {
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
          }
        );
        
        const data = await response.json();
        if (!data.error) {
          const businessDomain = this.getBusinessDomain();
          this.externalStaffList = (data.permissions || []).filter(
            p => !p.user.email.endsWith(`@${businessDomain}`)
          );
        }
      } catch (error) {
        this.$message.error('Error loading external staff');
      }
    },
    
    // Fetch Pending Requests
    async fetchPendingRequests() {
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/sent-requests/?status=pending`,
          {
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
          }
        );
        
        const data = await response.json();
        if (!data.error) {
          this.pendingRequestsList = data.requests || [];
        }
      } catch (error) {
        this.$message.error('Error loading pending requests');
      }
    },
    
    // Tab Change Handler
    onTabChange(key) {
      this.activeTab = key;
      
      if (key === 'all-tasks') {
        this.fetchAllTasks();
        this.fetchTaskStats();
      } else if (key === 'internal-staff') {
        this.fetchInternalStaff();
      } else if (key === 'external-staff') {
        this.fetchExternalStaff();
      } else if (key === 'pending-requests') {
        this.fetchPendingRequests();
      }
    },
    
    // Filter Tasks
    filterTasks() {
      this.fetchAllTasks();
    },
    
    // Search Tasks
    searchTasks(value) {
      if (!value) {
        this.filteredTasks = this.allTasksList;
        return;
      }
      
      const searchLower = value.toLowerCase();
      this.filteredTasks = this.allTasksList.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.assigned_to.full_name.toLowerCase().includes(searchLower) ||
        task.assigned_to.email.toLowerCase().includes(searchLower)
      );
    },
    
    // Show Assign Task Modal
    showAssignTaskModal() {
      this.selectedStaff = null;
      this.taskForm = {
        assignment_type: 'internal_staff',
        assigned_to_email: '',
        title: '',
        description: '',
        priority: 'medium',
        estimated_hours: null,
        due_date: null
      };
      this.assignTaskModalVisible = true;
      this.loadAvailableUsers('internal_staff');
    },
    
    // Assign Task to Specific Staff
    assignTaskToStaff(staff) {
      this.selectedStaff = staff;
      const isInternal = this.isInternalStaff(staff.user.email);
      
      this.taskForm = {
        assignment_type: isInternal ? 'internal_staff' : 'platform_professional',
        assigned_to_email: staff.user.email,
        title: '',
        description: '',
        priority: 'medium',
        estimated_hours: null,
        due_date: null
      };
      this.assignTaskModalVisible = true;
    },
    
    // Close Assign Task Modal
    closeAssignTaskModal() {
      this.assignTaskModalVisible = false;
      this.selectedStaff = null;
      this.availableUsers = [];
    },
    
    // On Assignment Type Change
    async onAssignmentTypeChange() {
      this.taskForm.assigned_to_email = '';
      await this.loadAvailableUsers(this.taskForm.assignment_type);
    },
    
    // Load Available Users
    async loadAvailableUsers(assignmentType) {
      this.loadingUsers = true;
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/tasks/available-users/?assignment_type=${assignmentType}`,
          {
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
          }
        );
        
        const data = await response.json();
        if (!data.error) {
          this.availableUsers = data.users || [];
        }
      } catch (error) {
        this.$message.error('Error loading available users');
      } finally {
        this.loadingUsers = false;
      }
    },
    
    // Handle Staff Search
    handleStaffSearch(value) {
      if (!value || value.length < 2) return;
      
      const searchLower = value.toLowerCase();
      this.availableUsers = this.availableUsers.filter(user =>
        user.full_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    },
    
    // Handle Assign Task
    async handleAssignTask() {
      // Validation
      if (!this.taskForm.assigned_to_email || !this.taskForm.title || !this.taskForm.description) {
        this.$message.error('Please fill all required fields');
        return;
      }
      
      this.savingData = true;
      try {
        const payload = {
          assignment_type: this.taskForm.assignment_type,
          assigned_to_email: this.taskForm.assigned_to_email,
          title: this.taskForm.title,
          description: this.taskForm.description,
          priority: this.taskForm.priority,
          estimated_hours: this.taskForm.estimated_hours,
          due_date: this.taskForm.due_date ? this.taskForm.due_date.toISOString() : null
        };
        
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/tasks/create/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          }
        );
        
        const data = await response.json();
        if (!data.error) {
          this.$message.success('Task assigned successfully!');
          this.closeAssignTaskModal();
          this.fetchAllTasks();
          this.fetchTaskStats();
        } else {
          this.$message.error(data.message || 'Error assigning task');
        }
      } catch (error) {
        this.$message.error('Error assigning task');
      } finally {
        this.savingData = false;
      }
    },
    
    // View Task Details
    async viewTaskDetails(task) {
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/tasks/details/${task.id}/`,
          {
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
          }
        );
        
        const data = await response.json();
        if (!data.error) {
          this.selectedTask = data.task;
          this.taskDetailsModalVisible = true;
        }
      } catch (error) {
        this.$message.error('Error loading task details');
      }
    },
    
    // Verify Task
    verifyTask(task) {
      this.$confirm({
        title: 'Verify Task Completion',
        content: 'Are you sure you want to verify this task as completed?',
        okText: 'Yes, Verify',
        cancelText: 'Cancel',
        onOk: async () => {
          try {
            const response = await fetch(
              `${this.$store.state.root_api}access-engine/api/tasks/verify/`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Token ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  task_id: task.id,
                  verification_notes: 'Task verified successfully'
                })
              }
            );
            
            const data = await response.json();
            if (!data.error) {
              this.$message.success('Task verified!');
              this.fetchAllTasks();
              this.fetchTaskStats();
            } else {
              this.$message.error(data.message);
            }
          } catch (error) {
            this.$message.error('Error verifying task');
          }
        }
      });
    },
    
    // Send Reminder
    sendReminder(task) {
      this.$message.success(`Reminder sent to ${task.assigned_to.full_name}`);
      // Implement reminder email logic here
    },
    
    // Confirm Cancel Task
    confirmCancelTask(task) {
      this.$confirm({
        title: 'Cancel Task',
        content: 'Are you sure you want to cancel this task?',
        okText: 'Yes, Cancel',
        okType: 'danger',
        cancelText: 'No',
        onOk: async () => {
          await this.cancelTask(task.id);
        }
      });
    },
    
    // Cancel Task
    async cancelTask(taskId) {
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/tasks/cancel/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              task_id: taskId,
              reason: 'Cancelled by business owner'
            })
          }
        );
        
        const data = await response.json();
        if (!data.error) {
          this.$message.success('Task cancelled');
          this.fetchAllTasks();
          this.fetchTaskStats();
        }
      } catch (error) {
        this.$message.error('Error cancelling task');
      }
    },
    
    // Show Add Staff Modal
    showAddStaffModal() {
      this.staffForm = {
        user_email: '',
        permissions: ['read']
      };
      this.addStaffModalVisible = true;
    },
    
    // Handle Add Staff
    async handleAddStaff() {
      if (!this.staffForm.user_email) {
        this.$message.error('Please enter staff email');
        return;
      }
      
      const businessDomain = this.getBusinessDomain();
      if (!this.staffForm.user_email.endsWith(`@${businessDomain}`)) {
        this.$message.error(`Email must end with @${businessDomain}`);
        return;
      }
      
      this.savingData = true;
      try {
        // For internal staff, we auto-approve the access
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/create-request/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user_email: this.staffForm.user_email,
              resource_type: 'business_site',
              requested_permissions: this.staffForm.permissions,
              request_message: 'Internal staff member',
              auto_approve: true
            })
          }
        );
        
        const data = await response.json();
        if (!data.error) {
          this.$message.success('Internal staff added successfully!');
          this.addStaffModalVisible = false;
          this.fetchInternalStaff();
        } else {
          this.$message.error(data.message);
        }
      } catch (error) {
        this.$message.error('Error adding staff');
      } finally {
        this.savingData = false;
      }
    },
    
    // Edit Staff Permissions
    editStaffPermissions(staff) {
      this.$message.info('Edit permissions feature coming soon');
      // Implement edit permissions modal
    },
    
    // View Staff Tasks
    viewStaffTasks(staff) {
      this.taskStatusFilter = 'all';
      const staffEmail = staff.user.email;
      this.filteredTasks = this.allTasksList.filter(
        task => task.assigned_to.email === staffEmail
      );
      this.activeTab = 'all-tasks';
      this.$message.success(`Showing tasks for ${staff.user.full_name}`);
    },
    
    // Show Request Access Modal
    showRequestAccessModal() {
      this.accessRequestForm = {
        user_email: '',
        resource_type: 'business_site',
        requested_permissions: ['read'],
        request_message: ''
      };
      this.requestAccessModalVisible = true;
    },
    
    // Handle Request Access
    async handleRequestAccess() {
      if (!this.accessRequestForm.user_email || !this.accessRequestForm.request_message) {
        this.$message.error('Please fill all required fields');
        return;
      }
      
      this.savingData = true;
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/create-request/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.accessRequestForm)
          }
        );
        
        const data = await response.json();
        if (!data.error) {
          this.$message.success('Access request sent!');
          this.requestAccessModalVisible = false;
          this.fetchPendingRequests();
        } else {
          this.$message.error(data.message);
        }
      } catch (error) {
        this.$message.error('Error sending request');
      } finally {
        this.savingData = false;
      }
    },
    
    // Revoke Access
    async revokeAccess(permissionId) {
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
              permission_id: permissionId,
              reason: 'Access revoked by business'
            })
          }
        );
        
        const data = await response.json();
        if (!data.error) {
          this.$message.success('Access revoked');
          this.fetchExternalStaff();
        }
      } catch (error) {
        this.$message.error('Error revoking access');
      }
    },
    
    // Cancel Request
    async cancelRequest(requestId) {
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/cancel-request/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ request_id: requestId })
          }
        );
        
        const data = await response.json();
        if (!data.error) {
          this.$message.success('Request cancelled');
          this.fetchPendingRequests();
        }
      } catch (error) {
        this.$message.error('Error cancelling request');
      }
    },
    
    // View Request Details
    viewRequestDetails(request) {
      this.$info({
        title: 'Request Details',
        content: `Request sent to: ${request.requested_to.full_name}\nResource: ${request.resource_type_display}\nStatus: ${request.status}\nMessage: ${request.request_message}`,
        width: 500
      });
    },
    
    // Helper Methods
    getBusinessDomain() {
      const email = localStorage.getItem('user_email') || '';
      return email.split('@')[1] || '';
    },
    
    isInternalStaff(email) {
      const businessDomain = this.getBusinessDomain();
      return email.endsWith(`@${businessDomain}`);
    },
    
    getStaffActiveTasks(email) {
      return this.allTasksList.filter(
        task => task.assigned_to.email === email &&
                ['new', 'pending', 'ongoing'].includes(task.status)
      ).length;
    },
    
    getStatusBadge(status) {
      const badges = {
        new: 'processing',
        pending: 'warning',
        ongoing: 'processing',
        completed: 'success',
        verified: 'success',
        rejected: 'error',
        cancelled: 'default',
        expired: 'error'
      };
      return badges[status] || 'default';
    },
    
    getPriorityColor(priority) {
      const colors = {
        low: 'green',
        medium: 'blue',
        high: 'orange',
        urgent: 'red'
      };
      return colors[priority] || 'blue';
    },
    
    getTaskProgress(status) {
      const progress = {
        new: 10,
        pending: 30,
        ongoing: 60,
        completed: 90,
        verified: 100,
        rejected: 0,
        cancelled: 0
      };
      return progress[status] || 0;
    },
    
    getProgressStatus(status) {
      if (['rejected', 'cancelled'].includes(status)) return 'exception';
      if (status === 'verified') return 'success';
      return 'active';
    },
    
    getRequestStatusColor(status) {
      const colors = {
        pending: 'orange',
        approved: 'green',
        rejected: 'red',
        cancelled: 'default',
        expired: 'red'
      };
      return colors[status] || 'default';
    },
    
    isOverdue(dueDate, status) {
      if (!dueDate || ['completed', 'verified', 'cancelled'].includes(status)) {
        return false;
      }
      return new Date(dueDate) < new Date();
    },
    
    isExpiringSoon(expiresAt) {
      const hoursLeft = (new Date(expiresAt) - new Date()) / (1000 * 60 * 60);
      return hoursLeft < 6 && hoursLeft > 0;
    },
    
    disabledDate(current) {
      return current && current < new Date().setHours(0, 0, 0, 0);
    },
    
    truncateText(text, length) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
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
    
    formatFileSize(bytes) {
      if (!bytes) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },
    
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.staff-task-container {
  margin-top: 10px;
  border-radius: 15px;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 24px;
  min-height: 90vh;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.back-icon {
  cursor: pointer;
  margin-right: 16px;
  font-size: 20px;
}

.stat-card {
  border-radius: 8px;
  transition: all 0.3s;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.main-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filters-section {
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.staff-name {
  font-weight: 500;
  font-size: 14px;
  color: #262626;
}

.staff-email {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 2px;
}

.task-info {
  max-width: 280px;
}

.task-title {
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 4px;
  color: #262626;
}

.task-description {
  font-size: 12px;
  color: #8c8c8c;
  line-height: 1.4;
}

.overdue {
  color: #ff4d4f;
  font-weight: 500;
}

.text-danger {
  color: #ff4d4f;
}

/* Responsive Design */
@media (max-width: 768px) {
  .staff-task-container {
    padding: 16px;
  }
  
  .page-header h2 {
    font-size: 20px;
  }
  
  .filters-section {
    padding: 12px;
  }
  
  .ant-table {
    font-size: 12px;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Ant Design Overrides */
.ant-tabs-tab {
  font-size: 15px;
  font-weight: 500;
}

.ant-table-thead > tr > th {
  background: #fafafa;
  font-weight: 600;
}

.ant-badge-status-text {
  font-size: 13px;
}

.ant-tag {
  border-radius: 4px;
  font-weight: 500;
}

.ant-progress-text {
  font-size: 12px;
}

/* Modal Styles */
.ant-modal-header {
  border-radius: 12px 12px 0 0;
}

.ant-modal-body {
  max-height: 70vh;
  overflow-y: auto;
}

.ant-modal-footer {
  border-top: 1px solid #f0f0f0;
}

/* Empty State */
.ant-empty {
  padding: 40px 0;
}

/* Loading State */
.ant-spin {
  margin: 40px 0;
}

/* Form Styles */
.ant-form-item-label > label {
  font-weight: 500;
}

.ant-select-selection,
.ant-input,
.ant-input-number,
.ant-picker {
  border-radius: 6px;
}

/* Button Styles */
.ant-btn {
  border-radius: 6px;
  font-weight: 500;
}

.ant-btn-primary {
  box-shadow: 0 2px 4px rgba(24, 144, 255, 0.2);
}

.ant-btn-primary:hover {
  box-shadow: 0 4px 8px rgba(24, 144, 255, 0.3);
}

/* Card Hover Effects */
.ant-card {
  transition: all 0.3s;
}

.ant-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Descriptions */
.ant-descriptions-bordered .ant-descriptions-item-label {
  background: #fafafa;
  font-weight: 600;
}

/* Timeline */
.ant-timeline-item-content {
  margin-left: 18px;
}

/* Alert */
.ant-alert {
  border-radius: 6px;
}

/* Avatar */
.ant-avatar {
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Popconfirm */
.ant-popover-message-title {
  padding-left: 22px;
}
</style>