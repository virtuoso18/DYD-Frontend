<template>
  <div>
    <div class="page-header" style="margin-bottom: 20px;">
      <a-row type="flex" justify="space-between" align="middle">
        <a-col>
          <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: #1a202c;">
            <FileTextOutlined style="margin-right: 10px;" />
            My Tasks
          </h2>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #718096;">
            View and manage your assigned tasks
          </p>
        </a-col>
        <a-col>
          <a-button type="primary" @click="fetchUserTasks" :loading="loading">
            <RedoOutlined />
            Refresh
          </a-button>
        </a-col>
      </a-row>
    </div>

    <!-- Tabs for Task Filtering -->
    <a-tabs v-model:activeKey="activeTab" style="margin-bottom: 20px;" @change="onTabChange">
      <a-tab-pane key="all">
        <template #tab>
          <span>
            All Tasks ({{ pagination.total_count }})
          </span>
        </template>
      </a-tab-pane>
      
      <a-tab-pane key="pending">
        <template #tab>
          <span>
            Pending ({{ pendingCount }})
          </span>
        </template>
      </a-tab-pane>
      
      <a-tab-pane key="accepted">
        <template #tab>
          <span>
            Accepted ({{ userTasks.filter(t => t.status === 'Accepted').length }})
          </span>
        </template>
      </a-tab-pane>
      
      <a-tab-pane key="inprogress">
        <template #tab>
          <span>
            In Progress ({{ userTasks.filter(t => t.status === 'InProgress').length }})
          </span>
        </template>
      </a-tab-pane>
      
      <a-tab-pane key="completed">
        <template #tab>
          <span>
            Completed ({{ completedCount }})
          </span>
        </template>
      </a-tab-pane>
      
      <a-tab-pane key="rejected">
        <template #tab>
          <span>
            Rejected ({{ rejectedCount }})
          </span>
        </template>
      </a-tab-pane>
    </a-tabs>

    <!-- Tasks List -->
    <div v-if="loading" style="text-align: center; padding: 40px;">
      <a-spin size="large" />
      <p style="margin-top: 16px; color: #718096;">Loading tasks...</p>
    </div>

    <div v-else-if="filteredTasks.length === 0" style="text-align: center; padding: 60px 20px; background: white; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
      <InboxOutlined style="font-size: 64px; color: #d1d5db; margin-bottom: 16px;" />
      <h3 style="color: #374151; margin-bottom: 8px;">No tasks found</h3>
      <p style="color: #6b7280;">There are no tasks in this category.</p>
    </div>

    <div v-else>
      <!-- Task Cards with Status Buttons -->
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" v-for="task in filteredTasks" :key="task.id">
          <a-card 
            :bordered="false" 
            style="border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: all 0.3s;"
            :bodyStyle="{ padding: '20px' }"
          >
            <a-row type="flex" justify="space-between" align="top">
              <a-col :xs="24" :md="16">
                <div>
                  <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #1a202c;">
                    {{ task.title || task.name || 'Untitled Task' }}
                  </h3>
                  <p style="margin: 0 0 12px 0; color: #718096; font-size: 14px;">
                    {{ task.description || 'No description provided' }}
                  </p>
                  <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
                    <a-tag :color="getStatusColor(task.status)" style="margin: 0;">
                      {{ getStatusLabel(task.status) }}
                    </a-tag>
                    <span v-if="task.due_date" style="color: #718096; font-size: 13px;">
                      <CalendarOutlined style="margin-right: 4px;" />
                      Due: {{ formatDate(task.due_date) }}
                    </span>
                    <span v-if="task.priority" style="color: #718096; font-size: 13px;">
                      <FlagOutlined style="margin-right: 4px;" />
                      {{ task.priority }}
                    </span>
                  </div>
                </div>
              </a-col>
              
              <a-col :xs="24" :md="8" style="margin-top: 16px;">
                <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end;">
                  <a-button
                    v-if="task.status === 'ToDo'"
                    type="primary"
                    size="small"
                    @click="updateTaskStatus(task, 'Accepted')"
                    :loading="task.updating"
                    style="background: #10b981; border-color: #10b981;"
                  >
                    <CheckCircleOutlined />
                    Accept
                  </a-button>

                  <a-button
                    v-if="task.status === 'ToDo'"
                    type="primary"
                    size="small"
                    danger
                    @click="openRejectModal(task)"
                    :loading="task.updating"
                  >
                    <CloseCircleOutlined />
                    Reject
                  </a-button>

                  <a-button
                    v-if="task.status === 'Accepted'"
                    type="primary"
                    size="small"
                    @click="updateTaskStatus(task, 'InProgress')"
                    :loading="task.updating"
                    style="background: #3b82f6; border-color: #3b82f6;"
                  >
                    <PlayCircleOutlined />
                    Start Progress
                  </a-button>

                  <a-button
                    v-if="task.status === 'InProgress'"
                    type="primary"
                    size="small"
                    @click="updateTaskStatus(task, 'Completed')"
                    :loading="task.updating"
                    style="background: #8b5cf6; border-color: #8b5cf6;"
                  >
                    <CheckOutlined />
                    Complete
                  </a-button>
                </div>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
      </a-row>

      <!-- Pagination Controls -->
      <div style="margin-top: 30px; display: flex; justify-content: center;">
        <a-pagination
          v-model:current="pagination.page"
          :pageSize="pagination.page_size"
          :total="pagination.total_count"
          :show-total="(total) => `Total ${total} tasks`"
          @change="onPageChange"
          show-quick-jumper
          show-size-changer
          :pageSizeOptions="['10', '20', '50', '100']"
        />
      </div>
    </div>

    <!-- Reject Task Modal -->
    <a-modal
      v-model:visible="rejectModalVisible"
      title="Reject Task"
      :footer="null"
      :maskClosable="false"
      @cancel="closeRejectModal"
    >
      <div style="margin-bottom: 16px;">
        <p style="margin-bottom: 8px; color: #374151; font-weight: 500;">
          Please provide a reason for rejecting this task:
        </p>
        <a-textarea
          v-model:value="rejectComment"
          placeholder="Enter your reason for rejecting this task..."
          :rows="4"
          :maxLength="500"
          showCount
        />
      </div>
      
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px;">
        <a-button @click="closeRejectModal" :disabled="submittingComment">
          Cancel
        </a-button>
        <a-button
          type="primary"
          danger
          @click="submitRejection"
          :loading="submittingComment"
          :disabled="!rejectComment || rejectComment.trim() === ''"
        >
          <CloseCircleOutlined />
          Reject Task
        </a-button>
      </div>
    </a-modal>

    <!-- Comments Modal -->
    <a-modal
      v-model:visible="commentsModalVisible"
      :title="`Comments for: ${selectedTask?.title || selectedTask?.name || 'Task'}`"
      width="700px"
      :footer="null"
      @cancel="closeCommentsModal"
    >
      <div v-if="loadingComments" style="text-align: center; padding: 40px;">
        <a-spin size="large" />
        <p style="margin-top: 16px; color: #718096;">Loading comments...</p>
      </div>

      <div v-else-if="taskComments.length === 0" style="text-align: center; padding: 40px;">
        <CommentOutlined style="font-size: 48px; color: #d1d5db; margin-bottom: 16px;" />
        <p style="color: #6b7280;">No comments yet for this task.</p>
      </div>

      <div v-else style="max-height: 500px; overflow-y: auto;">
        <div 
          v-for="comment in taskComments" 
          :key="comment.id"
          style="
            padding: 16px;
            margin-bottom: 12px;
            background: #f9fafb;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
          "
        >
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <UserOutlined style="color: #3b82f6;" />
              <span style="font-weight: 600; color: #1a202c;">{{ comment.author }}</span>
            </div>
            <span style="font-size: 12px; color: #9ca3af;">
              {{ formatDateTime(comment.created_at) }}
            </span>
          </div>
          
          <p style="margin: 0 0 8px 0; color: #374151; white-space: pre-wrap;">
            {{ comment.comment_text }}
          </p>

          <div v-if="comment.file" style="margin-top: 8px;">
            <a 
              :href="comment.file" 
              target="_blank"
              style="
                display: inline-flex;
                align-items: center;
                gap: 6px;
                color: #3b82f6;
                text-decoration: none;
                font-size: 13px;
              "
            >
              <PaperClipOutlined />
              View Attachment
            </a>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { 
  RedoOutlined, 
  FileTextOutlined, 
  CalendarOutlined, 
  FlagOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
  CheckOutlined,
  InboxOutlined,
  CommentOutlined,
  UserOutlined,
  PaperClipOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'access_overview',
  components: {
    RedoOutlined,
    FileTextOutlined,
    CalendarOutlined,
    FlagOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    PlayCircleOutlined,
    CheckOutlined,
    InboxOutlined,
    CommentOutlined,
    UserOutlined,
    PaperClipOutlined
  },
  data() {
    return {
      userTasks: [],
      loading: false,
      rejectModalVisible: false,
      rejectComment: '',
      selectedTask: null,
      submittingComment: false,
      commentsModalVisible: false,
      taskComments: [],
      loadingComments: false,
      activeTab: 'all',
      pagination: {
        page: 1,
        page_size: 20,
        total_count: 0,
        total_pages: 0,
        has_next: false,
        has_previous: false
      }
    };
  },
  props: {
    access_recieved: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    pendingCount() {
      return this.userTasks.filter(task => 
        task.status === 'ToDo'
      ).length;
    },
    inProgressCount() {
      return this.userTasks.filter(task => 
        task.status === 'InProgress' || task.status === 'Accepted'
      ).length;
    },
    completedCount() {
      return this.userTasks.filter(task => task.status === 'Completed').length;
    },
    rejectedCount() {
      return this.userTasks.filter(task => task.status === 'Rejected').length;
    },
    filteredTasks() {
      if (this.activeTab === 'all') {
        return this.userTasks;
      } else if (this.activeTab === 'pending') {
        return this.userTasks.filter(task => task.status === 'ToDo');
      } else if (this.activeTab === 'accepted') {
        return this.userTasks.filter(task => task.status === 'Accepted');
      } else if (this.activeTab === 'inprogress') {
        return this.userTasks.filter(task => task.status === 'InProgress');
      } else if (this.activeTab === 'completed') {
        return this.userTasks.filter(task => task.status === 'Completed');
      } else if (this.activeTab === 'rejected') {
        return this.userTasks.filter(task => task.status === 'Rejected');
      }
      return this.userTasks;
    }
  },
  methods: {
    async fetchUserTasks(page = 1, pageSize = 20) {
      this.loading = true;
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/tasks/user-tasks/?page=${page}&page_size=${pageSize}`,
          {
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`
            }
          }
        );

        const data = await response.json();
        console.log('API Response:', data);

        if (response.ok) {
          // Handle paginated response
          this.userTasks = Array.isArray(data.results) ? data.results : [];
          
          // Update pagination info
          if (data.pagination) {
            this.pagination = {
              page: data.pagination.page,
              page_size: data.pagination.page_size,
              total_count: data.pagination.total_count,
              total_pages: data.pagination.total_pages,
              has_next: data.pagination.has_next,
              has_previous: data.pagination.has_previous
            };
          }

          // Add updating flag to each task
          this.userTasks = this.userTasks.map(task => ({
            ...task,
            updating: false
          }));
          console.log('User Tasks:', this.userTasks);
          
          // if (this.userTasks.length > 0) {
          //   this.$message.success(`Loaded ${this.userTasks.length} task(s)`);
          // }
        } else {
          this.$message.error(data.message || 'Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching user tasks:', error);
        this.$message.error('An error occurred while fetching tasks');
      } finally {
        this.loading = false;
      }
    },

    onPageChange(page, pageSize) {
      this.pagination.page = page;
      this.pagination.page_size = pageSize;
      this.fetchUserTasks(page, pageSize);
    },

    onTabChange() {
      // Reset to first page when changing tabs
      this.pagination.page = 1;
      this.fetchUserTasks(1, this.pagination.page_size);
    },

    async updateTaskStatus(task, newStatus) {
      task.updating = true;

      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/tasks/update/`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              id: task.id,
              status: newStatus 
            })
          }
        );

        const data = await response.json();

        if (response.ok) {
          task.status = newStatus;
          task.updating = false;
          this.$message.success(`Task status updated to ${this.getStatusLabel(newStatus)}`);
        } else {
          task.updating = false;
          this.$message.error(data.message || 'Failed to update task status');
        }
      } catch (error) {
        console.error('Error updating task status:', error);
        task.updating = false;
        this.$message.error('An error occurred while updating task status');
      }
    },

    openRejectModal(task) {
      this.selectedTask = task;
      this.rejectComment = '';
      this.rejectModalVisible = true;
    },

    closeRejectModal() {
      this.rejectModalVisible = false;
      this.rejectComment = '';
      this.selectedTask = null;
    },

    async submitRejection() {
      if (!this.rejectComment || this.rejectComment.trim() === '') {
        this.$message.warning('Please provide a reason for rejection');
        return;
      }

      this.submittingComment = true;

      try {
        const commentResponse = await fetch(
          `${this.$store.state.root_api}access-engine/api/task-comments/create/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              task: this.selectedTask.id,
              comment_text: this.rejectComment.trim()
            })
          }
        );

        const commentData = await commentResponse.json();

        if (commentResponse.ok) {
          await this.updateTaskStatus(this.selectedTask, 'Rejected');
          this.closeRejectModal();
          this.$message.success('Task rejected with comment');
          
          if (this.commentsModalVisible && this.selectedTask) {
            await this.fetchTaskComments(this.selectedTask.id);
          }
        } else {
          this.$message.error(commentData.error || 'Failed to add comment');
        }
      } catch (error) {
        console.error('Error submitting rejection:', error);
        this.$message.error('An error occurred while submitting rejection');
      } finally {
        this.submittingComment = false;
      }
    },

    async openCommentsModal(task) {
      this.selectedTask = task;
      this.commentsModalVisible = true;
      await this.fetchTaskComments(task.id);
    },

    closeCommentsModal() {
      this.commentsModalVisible = false;
      this.taskComments = [];
      this.selectedTask = null;
    },

    async fetchTaskComments(taskId) {
      this.loadingComments = true;
      try {
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/task-comments/list/?task=${taskId}`,
          {
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`
            }
          }
        );

        const data = await response.json();

        if (response.ok) {
          this.taskComments = data;
        } else {
          if (response.status === 404) {
            this.taskComments = [];
          } else {
            this.$message.error(data.error || 'Failed to fetch comments');
          }
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        this.$message.error('An error occurred while fetching comments');
      } finally {
        this.loadingComments = false;
      }
    },

    getStatusColor(status) {
      const colors = {
        'ToDo': 'orange',
        'Accepted': 'blue',
        'InProgress': 'cyan',
        'Completed': 'green',
        'Rejected': 'red'
      };
      return colors[status] || 'default';
    },

    getStatusLabel(status) {
      const labels = {
        'ToDo': 'To Do',
        'Accepted': 'Accepted',
        'InProgress': 'In Progress',
        'Completed': 'Completed',
        'Rejected': 'Rejected'
      };
      return labels[status] || status;
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    },

    formatDateTime(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  mounted() {
    this.fetchUserTasks(1, 20);
  }
};
</script>

<style scoped>
.page-header {
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .page-header h2 {
    font-size: 20px;
  }
}

.ant-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.ant-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12) !important;
}
</style>