<template>
  <a-row :gutter="[16, 16]" class="mb-6">
    <a-col :span="24">
      <div class="table-card">
        <div class="table-header">
          <h3>Leads Summary</h3>
        </div>

        <!-- Plan Loading State -->
        <div v-if="planLoading" style="display: flex; justify-content: center; padding: 48px;">
          <a-spin size="large" />
        </div>

        <!-- Non-Premium: Upgrade Banner -->
        <div
          v-else-if="!isPremiumPlan"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 48px 24px;
            background: #f9f9ff;
            border: 2px dashed #c7d2fe;
            border-radius: 12px;
            text-align: center;
          "
        >
          <LockOutlined style="font-size: 40px; color: #4f46e5; margin-bottom: 16px;" />
          <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">
            Premium Feature
          </h3>
          <p style="color: #6b7280; max-width: 400px; margin-bottom: 0;">
            Leads Summary is available exclusively on the <strong>Premium</strong> plan.
            Upgrade your plan to unlock detailed lead tracking and analytics.
          </p>
        </div>

        <!-- Premium: Filters + Table -->
        <template v-else>
          <!-- Filters -->
          <div style="margin-bottom: 16px; display: flex; gap: 16px; flex-wrap: wrap;">
            <a-date-picker
              v-model:value="leadsDateRange[0]"
              placeholder="Start Date"
              style="width: 200px"
              @change="onDateFilterChange"
            />
            <a-date-picker
              v-model:value="leadsDateRange[1]"
              placeholder="End Date"
              style="width: 200px"
              @change="onDateFilterChange"
            />
          </div>

          <!-- Leads Summary Table -->
          <a-table
            :columns="leadsColumns"
            :data-source="leadsData"
            row-key="id"
            :pagination="leadsPagination"
            :scroll="{ x: 800 }"
            :loading="leadsLoading"
            style="background: white; border-radius: 8px; overflow: hidden;"
            @change="onLeadsTableChange"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'serial'">
                <span style="font-weight: 600; color: #666;">
                  {{ (leadsPagination.current - 1) * leadsPagination.pageSize + index + 1 }}
                </span>
              </template>

              <template v-if="column.key === 'date'">
                <span>{{ formatDate(record.date) }}</span>
              </template>

              <template v-if="column.key === 'total_leads'">
                <span style="font-weight: 600; color: #4f46e5;">{{ record.total_leads }}</span>
              </template>

              <template v-if="column.key === 'product_leads'">
                <a-tag color="blue">{{ record.product_leads }}</a-tag>
              </template>

              <template v-if="column.key === 'wall_leads'">
                <a-tag color="purple">{{ record.wall_leads }}</a-tag>
              </template>

              <template v-if="column.key === 'floor_leads'">
                <a-tag color="orange">{{ record.floor_leads }}</a-tag>
              </template>

              <template v-if="column.key === 'actions'">
                <a-button
                  type="primary"
                  size="small"
                  style="display: flex; justify-content: center; align-items: center; gap: 4px;"
                  @click="viewLeadDetails(record.id, record.date)"
                >
                  <OrderedListOutlined />
                  View Details
                </a-button>
              </template>
            </template>
          </a-table>
        </template>

      </div>
    </a-col>
  </a-row>

  <!-- Lead Detail Drawer -->
  <a-drawer
    v-model:open="drawerVisible"
    placement="bottom"
    :closable="true"
    :height="'85vh'"
    :body-style="{ padding: '24px' }"
  >
    <template #title>
      <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 600; align-items: center;">
        Lead Details — {{ selectedLeadDate }}
      </div>
    </template>

    <div v-if="leadDetailLoading" style="display: flex; justify-content: center; padding: 48px;">
      <a-spin size="large" />
    </div>

    <template v-else-if="leadDetail">
      <!-- Summary Stats -->
      <div class="user-transaction-summary" style="margin-bottom: 20px;">
        <div class="summary-item">
          <span class="summary-label">Total Leads:</span>
          <span class="summary-value">{{ leadDetail.total_leads }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Products:</span>
          <span class="summary-value">{{ leadDetail.products?.length || 0 }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Wall Textures:</span>
          <span class="summary-value">{{ leadDetail.wall_textures?.length || 0 }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Floor Textures:</span>
          <span class="summary-value">{{ leadDetail.floor_textures?.length || 0 }}</span>
        </div>
      </div>

      <!-- Tabs for Products / Wall / Floor -->
      <a-tabs v-model:activeKey="activeDetailTab">

        <!-- Products Tab -->
        <a-tab-pane key="products" tab="Products">
          <a-table
            :columns="productDetailColumns"
            :data-source="leadDetail.products"
            row-key="product_id"
            :pagination="false"
            :scroll="{ x: 1000 }"
            style="background: white; border-radius: 8px; overflow: hidden;"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'serial'">
                <span style="font-weight: 600; color: #666;">{{ index + 1 }}</span>
              </template>

              <template v-if="column.key === 'image'">
                <img
                  :src="getImageUrl(record.image)"
                  width="48"
                  height="48"
                  style="border-radius: 6px; object-fit: cover;"
                  @error="onImgError"
                />
              </template>

              <template v-if="column.key === 'product_name'">
                <span style="font-weight: 500; color: #1f2937;">{{ record.product_name }}</span>
              </template>

              <template v-if="column.key === 'usage_count'">
                <a-tag color="blue">{{ record.usage_count }}</a-tag>
              </template>

              <template v-if="column.key === 'users'">
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                  <a-tag
                    v-for="user in record.users"
                    :key="user.user_id"
                    color="geekblue"
                    style="cursor: default;"
                  >
                    {{ user.name || user.email }}
                  </a-tag>
                </div>
              </template>

              <template v-if="column.key === 'emails'">
                <div style="display: flex; flex-direction: column; gap: 2px;">
                  <span
                    v-for="user in record.users"
                    :key="user.user_id"
                    style="font-size: 12px; color: #4f46e5;"
                  >
                    {{ user.email }}
                  </span>
                </div>
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <!-- Wall Textures Tab -->
        <a-tab-pane key="wall_textures" tab="Wall Textures">
          <a-table
            :columns="textureDetailColumns"
            :data-source="leadDetail.wall_textures"
            row-key="wall_id"
            :pagination="false"
            :scroll="{ x: 1000 }"
            style="background: white; border-radius: 8px; overflow: hidden;"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'serial'">
                <span style="font-weight: 600; color: #666;">{{ index + 1 }}</span>
              </template>

              <template v-if="column.key === 'image'">
                <img
                  :src="getImageUrl(record.image)"
                  width="48"
                  height="48"
                  style="border-radius: 6px; object-fit: cover;"
                  @error="onImgError"
                />
              </template>

              <template v-if="column.key === 'name'">
                <span style="font-weight: 500; color: #1f2937;">{{ record.wall_name }}</span>
              </template>

              <template v-if="column.key === 'usage_count'">
                <a-tag color="purple">{{ record.usage_count }}</a-tag>
              </template>

              <template v-if="column.key === 'users'">
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                  <a-tag
                    v-for="user in record.users"
                    :key="user.user_id"
                    color="purple"
                    style="cursor: default;"
                  >
                    {{ user.name || user.email }}
                  </a-tag>
                </div>
              </template>

              <template v-if="column.key === 'emails'">
                <div style="display: flex; flex-direction: column; gap: 2px;">
                  <span
                    v-for="user in record.users"
                    :key="user.user_id"
                    style="font-size: 12px; color: #4f46e5;"
                  >
                    {{ user.email }}
                  </span>
                </div>
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <!-- Floor Textures Tab -->
        <a-tab-pane key="floor_textures" tab="Floor Textures">
          <a-table
            :columns="textureDetailColumns"
            :data-source="leadDetail.floor_textures"
            row-key="floor_id"
            :pagination="false"
            :scroll="{ x: 1000 }"
            style="background: white; border-radius: 8px; overflow: hidden;"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'serial'">
                <span style="font-weight: 600; color: #666;">{{ index + 1 }}</span>
              </template>

              <template v-if="column.key === 'image'">
                <img
                  :src="getImageUrl(record.image)"
                  width="48"
                  height="48"
                  style="border-radius: 6px; object-fit: cover;"
                  @error="onImgError"
                />
              </template>

              <template v-if="column.key === 'name'">
                <span style="font-weight: 500; color: #1f2937;">{{ record.floor_name }}</span>
              </template>

              <template v-if="column.key === 'usage_count'">
                <a-tag color="orange">{{ record.usage_count }}</a-tag>
              </template>

              <template v-if="column.key === 'users'">
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                  <a-tag
                    v-for="user in record.users"
                    :key="user.user_id"
                    color="orange"
                    style="cursor: default;"
                  >
                    {{ user.name || user.email }}
                  </a-tag>
                </div>
              </template>

              <template v-if="column.key === 'emails'">
                <div style="display: flex; flex-direction: column; gap: 2px;">
                  <span
                    v-for="user in record.users"
                    :key="user.user_id"
                    style="font-size: 12px; color: #4f46e5;"
                  >
                    {{ user.email }}
                  </span>
                </div>
              </template>
            </template>
          </a-table>
        </a-tab-pane>

      </a-tabs>
    </template>
  </a-drawer>
</template>

<script>
import { OrderedListOutlined, LockOutlined } from '@ant-design/icons-vue'

export default {
  name: 'LeadsComponent',

  components: {
    OrderedListOutlined,
    LockOutlined,
  },

  data() {
    return {
      // ── Plan ────────────────────────────────────────────────────────────────
      planLoading: false,
      isPremiumPlan: false,

      // ── Leads List ──────────────────────────────────────────────────────────
      leadsData: [],
      leadsLoading: false,
      leadsDateRange: [null, null],
      leadsPagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} records`,
      },
      leadsColumns: [
        { title: '#',             key: 'serial',        width: 60 },
        { title: 'Date',          key: 'date',          dataIndex: 'date' },
        { title: 'Total Leads',   key: 'total_leads',   dataIndex: 'total_leads' },
        { title: 'Product Leads', key: 'product_leads', dataIndex: 'product_leads' },
        { title: 'Wall Leads',    key: 'wall_leads',    dataIndex: 'wall_leads' },
        { title: 'Floor Leads',   key: 'floor_leads',   dataIndex: 'floor_leads' },
        { title: 'Actions',       key: 'actions',       width: 140 },
      ],

      // ── Drawer / Detail ─────────────────────────────────────────────────────
      drawerVisible: false,
      leadDetailLoading: false,
      leadDetail: null,
      selectedLeadDate: '',
      activeDetailTab: 'products',

      // ── Detail Table Columns ────────────────────────────────────────────────
      productDetailColumns: [
        { title: '#',           key: 'serial',       width: 60 },
        { title: 'Image',       key: 'image',        width: 80 },
        { title: 'Product',     key: 'product_name', dataIndex: 'product_name' },
        { title: 'Usage Count', key: 'usage_count',  dataIndex: 'usage_count', width: 130 },
        { title: 'Users',       key: 'users',        dataIndex: 'users' },
        { title: 'Emails',      key: 'emails',       dataIndex: 'users', width: 220 },
      ],
      textureDetailColumns: [
        { title: '#',           key: 'serial',      width: 60 },
        { title: 'Image',       key: 'image',       width: 80 },
        { title: 'Name',        key: 'name' },
        { title: 'Usage Count', key: 'usage_count', dataIndex: 'usage_count', width: 130 },
        { title: 'Users',       key: 'users',       dataIndex: 'users' },
        { title: 'Emails',      key: 'emails',      dataIndex: 'users', width: 220 },
      ],
    }
  },

  mounted() {
    this.fetchActivePlan()
  },

  methods: {
    // ── Image helpers ───────────────────────────────────────────────────────
    getImageUrl(imagePath) {
      if (!imagePath) return 'https://placehold.co/48x48?text=N/A'
      return `${this.$store.state.root_media_api}${imagePath}`
    },

    onImgError(e) {
      e.target.src = 'https://placehold.co/48x48?text=N/A'
    },

    // ── Fetch Active Plan & gate leads ─────────────────────────────────────
    async fetchActivePlan() {
      this.planLoading = true
      try {
        const response = await fetch(
          `${this.$store.state.root_api}subscription/api/current-subscription-plan/`,  
          {
            headers: {
              Authorization: `Token ${localStorage.getItem('token')}`,
            },
          }
        )
        const data = await response.json()

        // API returns: data.has_active_subscription + data.subscription.user_type
        const userType = data.subscription?.user_type || ''
        this.isPremiumPlan = data.has_active_subscription && data.subscription.plan_name.toLowerCase() === 'premium'
        
        if (this.isPremiumPlan) {
          this.fetchLeadsList()
        }
      } catch (error) {
        console.error('Error fetching active plan:', error)
        this.isPremiumPlan = false
      } finally {
        this.planLoading = false
      }
    },

    // ── Called when either date picker changes ──────────────────────────────
    onDateFilterChange() {
      this.leadsPagination.current = 1
      this.fetchLeadsList()
    },

    // ── Fetch Leads List ────────────────────────────────────────────────────
    async fetchLeadsList() {
      this.leadsLoading = true
      try {
        const params = new URLSearchParams()
        params.append('limit', this.leadsPagination.pageSize)
        params.append('offset', (this.leadsPagination.current - 1) * this.leadsPagination.pageSize)

        if (this.leadsDateRange[0]) {
          params.append('start_date', this.leadsDateRange[0].format('YYYY-MM-DD'))
        }
        if (this.leadsDateRange[1]) {
          params.append('end_date', this.leadsDateRange[1].format('YYYY-MM-DD'))
        }

        const response = await fetch(
          `${this.$store.state.root_api}renderer/leads/?${params}`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem('token')}`,
            },
          }
        )

        const data = await response.json()
        this.leadsData = data.results?.leads || data.leads || []
        this.leadsPagination.total = data.count || 0
      } catch (error) {
        console.error('Error fetching leads list:', error)
      } finally {
        this.leadsLoading = false
      }
    },

    // ── Fetch Lead Detail ───────────────────────────────────────────────────
    async viewLeadDetails(leadId, leadDate) {
      this.drawerVisible = true
      this.leadDetail = null
      this.leadDetailLoading = true
      this.selectedLeadDate = this.formatDate(leadDate)
      this.activeDetailTab = 'products'

      try {
        const response = await fetch(
          `${this.$store.state.root_api}renderer/leads/detail/${leadId}/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem('token')}`,
            },
          }
        )

        const data = await response.json()
        this.leadDetail = data.results || data
      } catch (error) {
        console.error('Error fetching lead details:', error)
      } finally {
        this.leadDetailLoading = false
      }
    },

    // ── Table Change (pagination) ───────────────────────────────────────────
    onLeadsTableChange(pagination) {
      this.leadsPagination.current = pagination.current
      this.leadsPagination.pageSize = pagination.pageSize
      this.fetchLeadsList()
    },

    // ── Helpers ─────────────────────────────────────────────────────────────
    formatDate(dateStr) {
      if (!dateStr) return '-'
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    },
  },
}
</script>