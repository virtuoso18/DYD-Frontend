<template>
  <div style="padding: 24px; background: #fafafa; min-height: 100vh;">
    <h1 style="margin-bottom: 24px; font-size: 28px; font-weight: 600;">Notifications</h1>
    
    <a-tabs v-model:activeKey="activeTab" style="background: white; padding: 20px; border-radius: 8px;">
      <!-- All Notifications Tab -->
      <a-tab-pane key="all" tab="All Notifications">
        <div v-if="paginatedAllNotifications.length === 0" style="text-align: center; padding: 40px; color: #999;">
          <p style="font-size: 16px;">No notifications yet</p>
        </div>
        <div v-else style="display: flex; flex-direction: column; gap: 12px;">
          <div 
            v-for="notif in paginatedAllNotifications" 
            :key="notif.id"
            style="padding: 16px; border-left: 4px solid #1890ff; background: #f5f7fa; border-radius: 4px; cursor: pointer;"
            @mouseenter="$event.target.style.background = '#e6f7ff'"
            @mouseleave="$event.target.style.background = '#f5f7fa'"
          >
            <div style="display: flex; justify-content: space-between; align-items: start; gap: 12px;">
              <div style="flex: 1;">
                <h4 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #222;">{{ notif.title }}</h4>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #666; line-height: 1.5;">{{ notif.description }}</p>
                <div style="display: flex; gap: 12px; align-items: center; font-size: 12px; color: #999;">
                  <span style="background: #e6f7ff; color: #1890ff; padding: 2px 8px; border-radius: 3px;">{{ notif.priority }}</span>
                  <span>{{ formatDate(notif.created_at) }}</span>
                  <span style="background: #fff7e6; color: #fa8c16; padding: 2px 8px; border-radius: 3px;">{{ notif.notification_type }}</span>
                </div>
              </div>
              <a-button 
                v-if="notif.action_url" 
                type="primary" 
                size="small"
                @click="navigateToAction(notif.action_url)"
              >
                Proceed
              </a-button>
            </div>
          </div>
          <div v-if="hasMoreNotifications" style="display: flex; justify-content: center; margin-top: 20px;">
            <a-button type="default" @click="loadMore" :loading="isLoadingMore">
              Show More ({{ paginationInfo.total_count - displayedNotifications.length }} remaining)
            </a-button>
          </div>
        </div>
      </a-tab-pane>

      <!-- Action Required Tab -->
      <a-tab-pane key="action-required" tab="Action Required">
        <div v-if="actionRequiredNotifications.length === 0" style="text-align: center; padding: 40px; color: #999;">
          <p style="font-size: 16px;">No action required!</p>
        </div>
        <div v-else style="display: flex; flex-direction: column; gap: 12px;">
          <div 
            v-for="notif in actionRequiredNotifications" 
            :key="notif.id"
            style="padding: 16px; border-left: 4px solid #ff7875; background: #fff1f0; border-radius: 4px;"
            @mouseenter="$event.target.style.background = '#ffccc7'"
            @mouseleave="$event.target.style.background = '#fff1f0'"
          >
            <div style="display: flex; justify-content: space-between; align-items: start; gap: 12px;">
              <div style="flex: 1;">
                <h4 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #222;">{{ notif.title }}</h4>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #666; line-height: 1.5;">{{ notif.description }}</p>
                <div style="display: flex; gap: 12px; align-items: center; font-size: 12px; color: #999;">
                  <span style="background: #e6f7ff; color: #1890ff; padding: 2px 8px; border-radius: 3px;">{{ notif.priority }}</span>
                  <span>{{ formatDate(notif.created_at) }}</span>
                  <span style="background: #fff7e6; color: #fa8c16; padding: 2px 8px; border-radius: 3px;">{{ notif.notification_type }}</span>
                </div>
              </div>
              <a-button 
                type="primary" 
                size="small"
                @click="navigateToAction(notif.action_url)"
              >
                See Results
              </a-button>
            </div>
          </div>
        </div>
      </a-tab-pane>

      <!-- Filter by Priority Tab -->
      <a-tab-pane key="priority" tab="By Priority">
        <div style="margin-bottom: 20px;">
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <a-button
              @click="selectedPriority = 'all'"
              :type="selectedPriority === 'all' ? 'primary' : 'default'"
            >
              All ({{ all_notifications.length }})
            </a-button>
            <a-button
              v-for="priority in ['high', 'medium', 'low']"
              :key="priority"
              @click="selectedPriority = priority"
              :type="selectedPriority === priority ? 'primary' : 'default'"
            >
              {{ priority.charAt(0).toUpperCase() + priority.slice(1) }} ({{ getPriorityCount(priority) }})
            </a-button>
          </div>
        </div>
        <div v-if="filteredNotificationsByPriority.length === 0" style="text-align: center; padding: 40px; color: #999;">
          <p>No notifications found</p>
        </div>
        <div v-else style="display: flex; flex-direction: column; gap: 12px;">
          <div 
            v-for="notif in filteredNotificationsByPriority" 
            :key="notif.id"
            style="padding: 16px; border-left: 4px solid #52c41a; background: #f6ffed; border-radius: 4px;"
          >
            <div style="display: flex; justify-content: space-between; align-items: start; gap: 12px;">
              <div style="flex: 1;">
                <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600;">{{ notif.title }}</h4>
                <p style="margin: 0 0 4px 0; font-size: 13px; color: #666;">{{ notif.description }}</p>
                <p style="margin: 0; font-size: 12px; color: #999;">{{ formatDate(notif.created_at) }}</p>
              </div>
              <a-button 
                v-if="notif.action_url" 
                type="primary" 
                size="small"
                @click="navigateToAction(notif.action_url)"
              >
                Proceed
              </a-button>
            </div>
          </div>
        </div>
      </a-tab-pane>

      <!-- Filter by Source Tab -->
      <a-tab-pane key="source" tab="By Source">
        <div style="margin-bottom: 20px;">
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <a-button
              @click="selectedSource = 'all'"
              :type="selectedSource === 'all' ? 'primary' : 'default'"
            >
              All ({{ all_notifications.length }})
            </a-button>
            <a-button
              v-for="source in ['broadcast', '1_to_1', 'system_to_1', 'admin_to_1']"
              :key="source"
              @click="selectedSource = source"
              :type="selectedSource === source ? 'primary' : 'default'"
            >
              {{ getSourceLabel(source) }} ({{ getSourceCount(source) }})
            </a-button>
          </div>
        </div>
        <div v-if="filteredNotificationsBySource.length === 0" style="text-align: center; padding: 40px; color: #999;">
          <p>No notifications found</p>
        </div>
        <div v-else style="display: flex; flex-direction: column; gap: 12px;">
          <div 
            v-for="notif in filteredNotificationsBySource" 
            :key="notif.id"
            style="padding: 16px; border-left: 4px solid #1890ff; background: #f0f5ff; border-radius: 4px;"
          >
            <div style="display: flex; justify-content: space-between; align-items: start; gap: 12px;">
              <div style="flex: 1;">
                <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600;">{{ notif.title }}</h4>
                <p style="margin: 0 0 4px 0; font-size: 13px; color: #666;">{{ notif.description }}</p>
                <p style="margin: 0; font-size: 12px; color: #999;">From: {{ notif.from_user || 'System' }} • {{ formatDate(notif.created_at) }}</p>
              </div>
              <a-button 
                v-if="notif.action_url" 
                type="primary" 
                size="small"
                @click="navigateToAction(notif.action_url)"
              >
                Proceed
              </a-button>
            </div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
export default {
  name: 'Notifications',
  data() {
    return {
      all_notifications: [],
      activeTab: 'all',
      loading: false,
      selectedPriority: 'all',
      selectedSource: 'all',
      displayedNotifications: [],
      itemsPerPage: 20,
      currentPage: 1,
      paginationInfo: {
        page: 1,
        page_size: 20,
        total_count: 0,
        total_pages: 1,
        has_next: false,
        has_previous: false
      },
      isLoadingMore: false
    };
  },
  computed: {
    actionRequiredNotifications() {
      return (this.all_notifications || []).filter(n => n.action_url && n.action_url.trim() !== '');
    },
    filteredNotificationsByPriority() {
      if (this.selectedPriority === 'all') return this.all_notifications || [];
      return (this.all_notifications || []).filter(n => n.priority === this.selectedPriority);
    },
    filteredNotificationsBySource() {
      if (this.selectedSource === 'all') return this.all_notifications || [];
      return (this.all_notifications || []).filter(n => n.notification_type === this.selectedSource);
    },
    paginatedAllNotifications() {
      return this.displayedNotifications;
    },
    hasMoreNotifications() {
      return this.paginationInfo.has_next;
    }
  },
  mounted() {
    this.fetchAllNotifications();
  },
  methods: {
    async fetchAllNotifications() {
      this.loading = true;
      this.paginationInfo.page = 1;
      await this.fetchNotificationsPage(1);
    },
    
    async fetchNotificationsPage(pageNum) {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = `${this.$store.state.root_api}notifications/api/user-notifications/?page=${pageNum}&page_size=20`;
        
        console.log('🔄 Fetching from:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('📊 Response Status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('📬 Response Data:', data);

        // Handle both 'notifications' and 'data' keys
        const notifications = data.notifications || data.data || [];
        
        if (Array.isArray(notifications)) {
          // For first page, replace; for subsequent pages, append
          if (pageNum === 1) {
            this.displayedNotifications = notifications;
            this.all_notifications = notifications;
          } else {
            this.displayedNotifications = [...this.displayedNotifications, ...notifications];
            this.all_notifications = [...this.all_notifications, ...notifications];
          }
          
          // Update pagination info
          if (data.pagination) {
            this.paginationInfo = {
              page: data.pagination.page,
              page_size: data.pagination.page_size,
              total_count: data.pagination.total_count,
              total_pages: data.pagination.total_pages,
              has_next: data.pagination.has_next,
              has_previous: data.pagination.has_previous
            };
          }
          
          console.log(`✅ Loaded ${notifications.length} notifications`);
          console.log(`📊 Marked ${data.marked_as_seen_count || 0} as seen`);
          console.log(`📄 Page ${data.pagination?.page || 1} of ${data.pagination?.total_pages || 1}`);
        } else {
          throw new Error('Invalid response format. Expected notifications array');
        }
      } catch (error) {
        console.error('❌ Error loading notifications:', error);
        this.$message.error(`Failed to load notifications: ${error.message}`);
      } finally {
        this.loading = false;
        this.isLoadingMore = false;
      }
    },
    
    async loadMore() {
      this.isLoadingMore = true;
      const nextPage = this.paginationInfo.page + 1;
      await this.fetchNotificationsPage(nextPage);
    },
    getPriorityCount(priority) {
      return this.all_notifications.filter(n => n.priority === priority).length;
    },
    getSourceCount(source) {
      return this.all_notifications.filter(n => n.notification_type === source).length;
    },
    getSourceLabel(source) {
      const labels = {
        'broadcast': '📢 Broadcasts',
        '1_to_1': '💬 Direct',
        'system_to_1': '⚙️ System',
        'admin_to_1': '👨‍💼 Admin'
      };
      return labels[source] || source;
    },
    navigateToAction(url) {
      if (url) {
        window.location.href = url;
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    }
  }
};
</script>