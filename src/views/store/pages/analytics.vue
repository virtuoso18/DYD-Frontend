<template>
  <div class="analytics-dashboard">
    <!-- Top Stats Cards -->
    <a-row :gutter="[16, 16]" class="mb-6">
      <a-col :xs="12" :sm="12" :md="6">
        <div class="stat-card total-products">
          <div class="stat-label">Total Products</div>
          <div class="stat-value">{{ analyticsData ? analyticsData.total_products : '...' }}</div>
        </div>
      </a-col>
      <a-col :xs="12" :sm="12" :md="6">
        <div class="stat-card total-clicks">
          <div class="stat-label">Total Clicks</div>
          <div class="stat-value">{{ analyticsData ? formatNumber(analyticsData.total_clicks) : '...' }}</div>
        </div>
      </a-col>
      <a-col :xs="12" :sm="12" :md="6">
        <div class="stat-card total-simulations">
          <div class="whitespace-nowrap stat-label">Total Credits Consumed</div>
          <div class="stat-value">{{ analyticsData ? Math.abs(analyticsData.credits) : '...' }}</div>
        </div>
      </a-col>
      <a-col :xs="12" :sm="12" :md="6">
        <div class="stat-card balance-credits">
          <div class="stat-label">Balance Credits</div>
          <div class="stat-value">{{ analyticsData ? formatNumber(analyticsData.credits) : '...' }}</div>
        </div>
      </a-col>
    </a-row>

    <!-- Daily Credit Consumption Chart -->
    <a-row :gutter="[16, 16]" class="mb-6">
      <a-col :span="24">
        <div class="chart-card">
         <div
  class="!flex !flex-col md:!flex-row !justify-between !items-start md:!items-center !mb-5 !gap-3"
>
  <!-- Title -->
  <h3 class="!text-base !font-semibold !text-[#1A1A1A]">
    Daily Credit Consumption
  </h3>

  <!-- Filters -->
  <div
    class="!flex !flex-col sm:!flex-row !gap-2 !items-stretch sm:!items-center w-full sm:w-auto"
  >
    <a-date-picker
      v-model:value="creditChartDateRange[0]"
      placeholder="Start Date"
      class="!w-full sm:!w-[150px]"
      @change="fetchDailyCreditConsumption"
    />

    <a-date-picker
      v-model:value="creditChartDateRange[1]"
      placeholder="End Date"
      class="!w-full sm:!w-[150px]"
      @change="fetchDailyCreditConsumption"
    />
  </div>
</div>

          
          <!-- Daily Credit Stats Summary -->
          <div v-if="dailyCreditData" class="credit-summary">
            <div class="summary-item">
              <span class="summary-label">Total Consumed:</span>
              <span class="summary-value">{{ dailyCreditData.summary.total_consumed }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Avg Daily:</span>
              <span class="summary-value">{{ dailyCreditData.summary.average_daily }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Active Days:</span>
              <span class="summary-value">{{ dailyCreditData.summary.days_with_consumption }}</span>
            </div>
          </div>
          
          <!-- Chart -->
          <div class="chart-container">
            <canvas ref="creditChartCanvas" style="max-height: 300px;"></canvas>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- Chart Section -->
    <a-row :gutter="[16, 16]" class="mb-6">
  <a-col :span="24">
    <div class="chart-card">
     <div
  class="!flex !flex-col md:!flex-row !justify-between !items-start md:!items-center !mb-5 !gap-3"
>
  <!-- Title -->
  <h3 class="!text-base !font-semibold !text-[#1A1A1A]">
    Favorite product
  </h3>

  <!-- Filters -->
  <div
    class="!flex !flex-col sm:!flex-row !gap-2 !items-stretch sm:!items-center w-full sm:w-auto"
  >
    <a-date-picker
      v-model:value="favoriteChartDateRange[0]"
      placeholder="Start Date"
      class="!w-full sm:!w-[150px]"
      @change="fetchFavoriteChartData"
    />

    <a-date-picker
      v-model:value="favoriteChartDateRange[1]"
      placeholder="End Date"
      class="!w-full sm:!w-[150px]"
      @change="fetchFavoriteChartData"
    />
  </div>
</div>

      
      <!-- Chart -->
      <div class="chart-container">
        <canvas ref="favoriteChartCanvas" style="max-height: 300px;"></canvas>
      </div>
    </div>
  </a-col>
</a-row>


    <!-- User-wise Credit Summary Table -->
    <a-row :gutter="[16, 16]" class="mb-6">
      <a-col :span="24">
        <div class="table-card">
          <div class="table-header">
            <h3>User-wise Credit Consumption Summary</h3>
          </div>
          <!-- Filters for User Summary -->
          <div style="margin-bottom: 16px; display: flex; gap: 16px; flex-wrap: wrap;">
            <a-date-picker
              v-model:value="summaryDateRange[0]"
              placeholder="Start Date"
              style="width: 200px"
              @change="fetchUsersCreditSummary"
            />
            <a-date-picker
              v-model:value="summaryDateRange[1]"
              placeholder="End Date"
              style="width: 200px"
              @change="fetchUsersCreditSummary"
            />
            <a-select
              v-model:value="summarySortBy"
              placeholder="Sort By"
              @change="fetchUsersCreditSummary"
              style="width: 200px"
            >
              <a-select-option value="credits_desc">Credits (High to Low)</a-select-option>
              <a-select-option value="credits_asc">Credits (Low to High)</a-select-option>
              <a-select-option value="user_name">User Name (A-Z)</a-select-option>
            </a-select>
          </div>
          <a-table 
            :columns="userSummaryColumns" 
            :data-source="usersSummaryData" 
            row-key="user_id" 
            :pagination="summaryPagination"
            :scroll="{ x: 800 }"
            :loading="summaryLoading"
            style="background: white; border-radius: 8px; overflow: hidden;"
            @change="onUserSummaryTableChange"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'serial'">
                <span style="font-weight: 600; color: #666;">{{ index + 1 }}</span>
              </template>

              <template v-if="column.key === 'user_name'">
                <span style="cursor: pointer; color: #4f46e5; font-weight: 500;">
                  {{ record.user_name || record.user_email }}
                </span>
              </template>

              <template v-if="column.key === 'user_email'">
                <span>{{ record.user_email }}</span>
              </template>

              <template v-if="column.key === 'total_credits_consumed'">
              <span
                :style="{
                  color: record.total_credits_consumed > 0 ? '#10b981' : '#ef4444',
                  fontWeight: '600'
                }"
              >
                {{ record.total_credits_consumed > 0 ? '+' : '' }}{{ record.total_credits_consumed }}
              </span>
            </template>

              <template v-if="column.key === 'transaction_count'">
                <span style="font-weight: 600; color: #4f46e5;">
                  {{ record.transaction_count }}
                </span>
              </template>

              <template v-if="column.key === 'actions'">
                <a-button
                type="primary"
                size="small"
                  style="display: flex;justify-content: center;align-items: center;"
                  @click="viewUserTransactions(record.user_id)"
                >
                 <OrderedListOutlined />View Details
                </a-button>
              </template>
            </template>
          </a-table>
        </div>
      </a-col>
    </a-row>

    <!-- Individual User Transaction Details Table -->
   

    <a-drawer
      v-model:open="drawerVisible"
      :placement="'bottom'"
      :closable="true"
      :height="'85vh'"
      :body-style="{ padding: '24px' }"
    >
    <template #title>
      <div style="display: flex;justify-content: space-between;font-size:16px;font-weight:600;align-items: center;">

        {{ `Credit Transactions - ${selectedUserEmail}` }}
        
        <a-button v-if="current_user.id!=selectedUserForDetails"
        type="primary"
        style="display:flex;justify-content:center;align-items:center;"
        @click="startChatWithCustomer(selectedUserForDetails)"
        >
        Chat
      <MessageOutlined /> 
      </a-button>
    </div>
    </template>
   <!-- Date Range Filter for User Transactions -->
    <div style="margin-bottom: 16px; display: flex; gap: 16px; flex-wrap: wrap;">
              <a-date-picker
                v-model:value="transactionDateRange[0]"
                placeholder="Start Date"
                style="width: 200px"
                @change="fetchUserTransactionDetails"
              />
              <a-date-picker
                v-model:value="transactionDateRange[1]"
                placeholder="End Date"
                style="width: 200px"
                @change="fetchUserTransactionDetails"
              />
              <a-select
                v-model:value="transactionFilterStatus"
                placeholder="Filter by Status"
                @change="fetchUserTransactionDetails"
                style="width: 200px"
                allow-clear
              >
                <a-select-option value="">All Status</a-select-option>
                <a-select-option value="pending">Pending</a-select-option>
                <a-select-option value="success">Success</a-select-option>
                <a-select-option value="failed">Failed</a-select-option>
              </a-select>

              <a-select
                v-model:value="transactionFilterType"
                placeholder="Filter by Status"
                @change="fetchUserTransactionDetails"
                style="width: 200px"
                allow-clear
              >
                <a-select-option value="">All </a-select-option>
                <a-select-option value="deposit">deposit</a-select-option>
                <a-select-option value="consume">consume</a-select-option>
                
              </a-select>
              
              
            </div>

  <!-- User Summary Stats -->
      <div v-if="userTransactionsSummary" class="user-transaction-summary">
                <div class="summary-item">
                  <span class="summary-label">Total Credits Consumed:</span>
                  <span class="summary-value">{{ userTransactionsSummary.total_credits_consumed }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Total Transactions:</span>
                  <span class="summary-value">{{ userTransactionsSummary.total_transactions }}</span>
                </div>
              </div>

  <!-- Transaction Table -->
    <a-table 
              :columns="creditTableColumns" 
              :data-source="userTransactionsList" 
              row-key="id" 
              :pagination="transactionPagination"
              :scroll="{ x: 1200 }"
              :loading="transactionDetailsLoading"
              @change="onTransactionTableChange"
              style="background: white; border-radius: 8px; overflow: hidden;"
            >
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'serial'">
                  <span style="font-weight: 600; color: #666;">{{ (transactionPagination.current - 1) * transactionPagination.pageSize + index + 1 }}</span>
                </template>

                <template v-if="column.key === 'user_email'">
                  <span>{{ record.user_email }}</span>
                </template>

                <template v-if="column.key === 'credits_changed'">
                  <span :style="{ color: record.credits_changed > 0 ? '#10b981' : '#ef4444', fontWeight: '600' }">
                    {{ record.credits_changed > 0 ? '+' : '' }}{{ record.credits_changed }}
                  </span>
                </template>

                <template v-if="column.key === 'type'">
                  <a-tag :color="record.type === 'deposit' ? 'blue' : 'orange'">
                    {{ record.type }}
                  </a-tag>
                </template>

                <template v-if="column.key === 'status'">
                  <a-tag 
                    :color="record.status === 'success' ? 'green' : record.status === 'pending' ? 'orange' : 'red'"
                  >
                    {{ record.status }}
                  </a-tag>
                </template>

                <template v-if="column.key === 'business_name'">
                  <span>{{ record.business_name || '-' }}</span>
                </template>

                <template v-if="column.key === 'created_at'">
                  <span>{{ formatDate(record.created_at) }}</span>
                </template>

                <template v-if="column.key === 'description'">
                  <span style="font-size: 12px;">{{ record.description || '-' }}</span>
                </template>

                <!-- <template v-if="column.key === 'chat_with_customer'">
                  <button
                    style="background: #4f46e5; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;"
                    @click="startChatWithCustomer(record)"
                  >
                    Chat
                  </button>
                </template> -->
              </template>
            </a-table>
</a-drawer>

<leadsDetails></leadsDetails>

<br>
    <!-- Products Table -->
    <a-row :gutter="[16, 16]">
      <a-col :xs="0" :sm="0" :md="0" :lg="24">
        <div class="table-card">
          <div class="table-header">
            <h3>Top simulation products</h3>
          </div>
          <a-table 
            :columns="tableColumns" 
            :data-source="productsData" 
            row-key="id" 
            :pagination="false"
            :scroll="{ x: 800 }"
            :loading="loading"
            style="background: white; border-radius: 8px; overflow: hidden; cursor:pointer"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'serial'">
                <span style="font-weight: 600; color: #666;">{{ index + 1 }}</span>
              </template>

              <template v-if="column.key === 'product'">
               <div style="display: flex; gap: 12px; align-items: center; cursor: pointer;">
  <!-- IMAGE CONTAINER with SKELETON -->
  <div style="position: relative; width: 60px; height: 60px; overflow: hidden; border-radius: 8px; flex-shrink: 0;">
    <!-- SKELETON -->
    <div
      v-if="!imageLoadedMap[record.id]"
      class="thumbnail-skeleton"
    ></div>

    <!-- PRELOAD (INVISIBLE) -->
    <img
      :src="getImageUrl(record.image)"
      style="position:absolute;width:0;height:0;opacity:0;"
      @load="onThumbnailLoad(record.id)"
      alt=""
    />

    <!-- REAL IMAGE -->
    <img
      v-show="imageLoadedMap[record.id]"
      :src="getImageUrl(record.image)"
      style="width: 100%; height: 100%; border-radius: 8px; object-fit: cover;"
      alt=""
    />
  </div>

  <!-- TEXT (UNCHANGED) -->
  <div>
    <div style="font-weight: 600; color: #333; margin-bottom: 4px;">
      {{ truncateText(record.name || 'No title available', 13) }}
    </div>
    <div style="font-size: 12px; color: #666; margin-top: 2px;">
      {{ truncateText(record.description || 'No description available', 19) }}
    </div>
  </div>
</div>

              </template>

              <template v-if="column.key === 'category'">
                <span>{{ record.category || '-' }}</span>
              </template>

              <template v-if="column.key === 'type'">
                <span>{{ record.type || '-' }}</span>
              </template>

              <template v-if="column.key === 'createDate'">
                <span>{{ formatDate(record.createDate) }}</span>
              </template>

              <template v-if="column.key === 'dimensions'">
                <span style="font-size: 12px;">{{ record.dimensions || '-' }}</span>
              </template>

              <template v-if="column.key === 'colors'">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <div
                    v-for="(color, colorIndex) in (record.colors || []).slice(0, 3)"
                    :key="colorIndex"
                    :style="{ 
                      width: '16px', 
                      height: '16px', 
                      borderRadius: '50%', 
                      backgroundColor: color 
                    }"
                  ></div>
                  <span v-if="record.colors && record.colors.length > 3">...</span>
                </div>
              </template>

              <template v-if="column.key === 'price'">
                <span style="font-weight: 600; color: #333;">
                  ${{ record.price || '0.00' }}
                </span>
              </template>

              <template v-if="column.key === 'usageCount'">
                <span style="font-weight: 600; color: #4F46E5;">
                  {{ record.usageCount || 0 }}
                </span>
              </template>

              <template v-if="column.key === 'actions'">
                <div style="display: flex; gap: 5px;">
                  <button
                    style="background: #f1f5f9; border: 1px solid #cbd5e1; color: #64748b; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;"
                  >AR</button>
                </div>
              </template>
            </template>
          </a-table>
        </div>
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="0">
        <div class="table-card">
          <div class="table-header">
            <h3>Top simulation products</h3>
          </div>
          <div class="product-listed-sec">
            <AnalyticsProductCard
              v-for="product in productsData"
              :key="product.id"
              :product="product"
            />
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import AnalyticsProductCard from '@/components/store/AnalyticsProductCard.vue'
import dayjs from 'dayjs'
import {MessageOutlined,OrderedListOutlined} from '@ant-design/icons-vue'
import leadsDetails from './leadsDetails.vue'
Chart.register(...registerables)

export default {
  name: 'Analytics',
  components:{
    AnalyticsProductCard,
    MessageOutlined,OrderedListOutlined,
    leadsDetails
  },
  data() {
    return {
      current_user:JSON.parse(localStorage.getItem('user')),
      chart: null,
       imageLoadedMap: {},
      loading: false,
      creditChart: null,
      dailyCreditData: null,
      creditLoading: false,
      creditChartDateRange: [dayjs().subtract(30, 'day'), dayjs()],
      analyticsData: null,
      creditStats: 0,
      creditTransactions: [],
      dateRange: [null, null],
      filterStatus: '',
      
      // NEW: User Summary Data
      usersSummaryData: [],
      summaryLoading: false,
      summaryDateRange: [dayjs().subtract(30, 'day'), dayjs()],
      summarySortBy: 'credits_desc',
      summaryPagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20', '50'],
        showTotal: (total) => `Total ${total} users`,
      },
      
      // NEW: User Transaction Details
      selectedUserForDetails: null,
      selectedUserEmail: '',
      userTransactionsList: [],
      userTransactionsSummary: null,
      transactionDetailsLoading: false,
      transactionDateRange: [dayjs().subtract(30, 'day'), dayjs()],
      transactionFilterStatus: '',
      transactionFilterType:'',
      transactionPagination: {
        current: 1,
        pageSize: 20,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total) => `Total ${total} items`,
      },
      
      chartFilter: {
        type: '',
        status: ''
      },
      chartData: [5, 8, 6, 12, 60],
      chartLabels: [],
      tableColumns: [
        {
          title: '',
          key: 'serial',
          width: 40,
        },
        {
          title: 'Product',
          key: 'product',
          width: 200,
        },
        {
          title: 'Category',
          key: 'category',
          width: 70,
        },
        {
          title: 'Type',
          key: 'type',
          width: 70,
        },
        {
          title: 'Create date',
          key: 'createDate',
          width: 120,
        },
        {
          title: 'Size',
          key: 'dimensions',
          width: 100,
        },
        {
          title: 'Color',
          key: 'colors',
          width: 80,
        },
        {
          title: 'Price',
          key: 'price',
          width: 40,
        },
        {
          title: 'Usage',
          key: 'usageCount',
          width: 60,
        },
        {
          title: 'AR/VR',
          key: 'actions',
          width: 80,
        },
      ],
      
      // User Summary Table Columns
      userSummaryColumns: [
        {
          title: '',
          key: 'serial',
          width: 40,
        },
        {
          title: 'User Name',
          key: 'user_name',
          width: 150,
        },
        {
          title: 'Email',
          key: 'user_email',
          width: 200,
        },
        {
          title: 'Total Credits Consumed',
          key: 'total_credits_consumed',
          width: 180,
        },
        {
          title: 'Transaction Count',
          key: 'transaction_count',
          width: 150,
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 120,
        },
      ],
      
      // Credit Transactions Table Columns
      creditTableColumns: [
        {
          title: '',
          key: 'serial',
          width: 40,
        },
        {
          title: 'User Email',
          key: 'user_email',
          width: 150,
        },
        {
          title: 'Business',
          key: 'business_name',
          width: 150,
        },
        {
          title: 'Credits',
          key: 'credits_changed',
          width: 100,
        },
        {
          title: 'Type',
          key: 'type',
          width: 80,
        },
        {
          title: 'Status',
          key: 'status',
          width: 100,
        },
        {
          title: 'Date',
          key: 'created_at',
          width: 150,
        },
        {
          title: 'Description',
          key: 'description',
          width: 200,
        }
        // {
        //   title: 'Chat',
        //   key: 'chat_with_customer',
        //   width: 80,
        // }
      ],
      productsData: [],
      drawerVisible: false,

      // Favorite Chart Data
      favoriteChartData: [],
      favoriteChartDateRange: [dayjs().subtract(30, 'day'), dayjs()],
      favoriteChart: null,
      currentBusinessSlug: '',
    }
  },
  mounted() {
    this.fetchAnalytics()
    this.fetchTopProducts()
    this.fetchUsersCreditSummary()
    this.fetchDailyCreditConsumption()  
    // this.initChart()
    this.fetchFavoriteChartData()
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy()
    }
     if (this.creditChart) {
      this.creditChart.destroy()
    }
  },
  methods: {
    async viewUserTransactions(userId) {
  this.selectedUserForDetails = userId
  
  const user = this.usersSummaryData.find(u => u.user_id === userId)
  this.selectedUserEmail = user ? user.user_email : userId
  
  this.transactionPagination.current = 1
  
  // Add these two lines:
  this.drawerVisible = true
  await this.fetchUserTransactionDetails(user)
},

 onThumbnailLoad(id) {
    this.imageLoadedMap[id] = false;
    setTimeout(() => {
      this.imageLoadedMap[id] = true;
    }, 1000); // 1s shimmer
  },


    truncateText(text, charLimit = 13) {
      if (!text) return ''
      if (text.length <= charLimit) return text
      return text.slice(0, charLimit) + '...'
    },

    async fetchAnalytics() {
      this.loading = true
      try {
        const response = await fetch(
          `${this.$store.state.root_api}Auth/api/business-analytics/`,
          {
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`
            }
          }
        )

        const data = await response.json()
        console.log('Analytics API Response:', data)

        if (response.ok && data.success) {
          this.analyticsData = data.data
        } else {
          this.$message.error(data.message || 'Failed to fetch analytics')
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
        this.$message.error('An error occurred while fetching analytics')
      } finally {
        this.loading = false
      }
    },

    // NEW: Fetch User-wise Credit Summary
    async fetchUsersCreditSummary() {
      this.summaryLoading = true
      try {
        const params = new URLSearchParams()

        if (this.summaryDateRange[0]) {
          params.append('start_date', this.summaryDateRange[0].toISOString())
        }
        if (this.summaryDateRange[1]) {
          params.append('end_date', this.summaryDateRange[1].toISOString())
        }
        if (this.summarySortBy) {
          params.append('sort_by', this.summarySortBy)
        }
        
        // Add pagination params
        params.append('page', this.summaryPagination.current)
        params.append('page_size', this.summaryPagination.pageSize)

        const response = await fetch(
          `${this.$store.state.root_api}subscription/api/users-summary/?${params}`,
          {
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`
            }
          }
        )

        const data = await response.json()
        console.log('Users Credit Summary API Response:', data)

        if (response.ok && data.success) {
          this.usersSummaryData = data.data.summary || []
          
          // Update pagination data from response
          if (data.data.pagination) {
            this.summaryPagination.total = data.data.pagination.total_items
            this.summaryPagination.current = data.data.pagination.page
            this.summaryPagination.pageSize = data.data.pagination.page_size
          }
          
          // Calculate total consumed
          const totalConsumed = this.usersSummaryData.reduce((sum, user) => {
            return sum + (user.total_credits_consumed || 0)
          }, 0)

          
        } else {
          this.$message.error(data.message || 'Failed to fetch user summary')
        }
      } catch (error) {
        console.error('Error fetching user summary:', error)
        this.$message.error('An error occurred while fetching user summary')
      } finally {
        this.summaryLoading = false
      }
    },

    // NEW: Handle user summary table pagination change
    onUserSummaryTableChange(pagination) {
      this.summaryPagination = pagination
      this.fetchUsersCreditSummary()
    },

    // // NEW: View User Transactions
    // async viewUserTransactions(userId) {
    //   this.selectedUserForDetails = userId
      
    //   // Find user email from summary
    //   const user = this.usersSummaryData.find(u => u.user_id === userId)
    //   this.selectedUserEmail = user ? user.user_email : userId
      
    //   // Reset pagination
    //   this.transactionPagination.current = 1
      
    //   // Fetch transaction details
    //   await this.fetchUserTransactionDetails()
    // },

    // NEW: Fetch Individual User Transaction Details
    async fetchUserTransactionDetails(user=null) {
      this.transactionDetailsLoading = true
      try {
        const params = new URLSearchParams()

        if (this.transactionDateRange[0]) {
          params.append('start_date', this.transactionDateRange[0].toISOString())
        }
        if (this.transactionDateRange[1]) {
          params.append('end_date', this.transactionDateRange[1].toISOString())
        }
        if (this.transactionFilterStatus) {
          params.append('status', this.transactionFilterStatus)
        }
        // if (this.transactionFilterType) {
        //   params.append('type', this.transactionFilterType)
        // }

        params.append('page', this.transactionPagination.current)
        params.append('page_size', this.transactionPagination.pageSize)

        const response = await fetch(
          `${this.$store.state.root_api}subscription/api/${this.selectedUserForDetails}/transactions/?${params}`,
          {
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`
            }
          }
        )

        const data = await response.json()
        console.log('User Transaction Details API Response:', data)

        if (response.ok && data.success) {
          this.userTransactionsList = data.data.transactions || []
          this.userTransactionsSummary = data.data.summary || {}
          
          // Update pagination
          this.transactionPagination.total = data.data.pagination.total_items || 0
          this.transactionPagination.current = data.data.pagination.page
          this.transactionPagination.pageSize = data.data.pagination.page_size
        } else {
          this.$message.error(data.message || 'Failed to fetch transaction details')
        }
      } catch (error) {
        console.error('Error fetching transaction details:', error)
        this.$message.error('An error occurred while fetching transaction details')
      } finally {
        this.transactionDetailsLoading = false
      }
    },

    // Handle table pagination change
    onTransactionTableChange(pagination) {
      this.transactionPagination = pagination
      this.fetchUserTransactionDetails()
    },

    async fetchDailyCreditConsumption() {
      try {
        const params = new URLSearchParams()

        if (this.creditChartDateRange[0]) {
          params.append('start_date', this.creditChartDateRange[0].toISOString())
        }
        if (this.creditChartDateRange[1]) {
          params.append('end_date', this.creditChartDateRange[1].toISOString())
        }

        const response = await fetch(
          `${this.$store.state.root_api}subscription/api/analytics-daily-credit-transactions/?${params}`,
          {
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`
            }
          }
        )

        const data = await response.json()
        console.log('Daily Credit Consumption API Response:', data)

        if (response.ok && data.success) {
          this.dailyCreditData = data.data
          this.updateCreditChart()
        } else {
          this.$message.error(data.message || 'Failed to fetch daily credit consumption')
        }
      } catch (error) {
        console.error('Error fetching daily credit consumption:', error)
        this.$message.error('An error occurred while fetching daily credit consumption')
      }
    },

    updateCreditChart() {
      if (!this.dailyCreditData) return

      const ctx = this.$refs.creditChartCanvas.getContext('2d')
      
      if (this.creditChart) {
        this.creditChart.destroy()
      }

      const gradient = ctx.createLinearGradient(0, 0, 0, 300)
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)')
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0.05)')
      
      this.creditChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.dailyCreditData.chart_labels,
          datasets: [{
            label: 'Credits Consumed',
            data: this.dailyCreditData.chart_data,
            borderColor: '#ef4444',
            backgroundColor: gradient,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#ef4444',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#ef4444',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: '#1e293b',
              titleColor: '#ffffff',
              bodyColor: '#ffffff',
              borderColor: '#1e293b',
              borderWidth: 1,
              cornerRadius: 6,
              displayColors: false,
              callbacks: {
                title: function(context) {
                  return context[0].label
                },
                label: function(context) {
                  return 'Credits: ' + context.parsed.y.toFixed(2)
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: true,
                color: '#f1f5f9',
                drawBorder: false,
                lineWidth: 1,
                drawTicks: false
              },
              ticks: {
                color: '#94a3b8',
                font: {
                  size: 12
                },
                maxRotation: 45,
                minRotation: 0
              },
              border: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                display: true,
                color: '#f1f5f9',
                drawBorder: false,
                lineWidth: 1,
                drawTicks: false
              },
              ticks: {
                color: '#94a3b8',
                font: {
                  size: 12
                },
                callback: function(value) {
                  return value.toFixed(0)
                }
              },
              border: {
                display: false
              }
            }
          },
          elements: {
            point: {
              hoverRadius: 6
            }
          }
        }
      })
    },

    async fetchTopProducts() {
      this.loading = true
      try {
        const response = await fetch(
          `${this.$store.state.root_api}Auth/api/business-top-products/`,
          {
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`
            }
          }
        )

        const data = await response.json()
        console.log('Top Products API Response:', data)

        if (response.ok && data.success) {
          this.productsData = data.data.map((item, index) => {
            let colors = item.colors || []
            if (typeof colors === 'string') {
              try {
                colors = JSON.parse(colors)
              } catch (e) {
                colors = [colors]
              }
            }
            
            return {
              key: item.id || `product-${index}`,
              id: item.id || index + 1,
              name: item.name || 'Unnamed Product',
              description: item.description || 'N/A',
              category: item.category || '-',
              type: item.furniture_type || item.light_type || '-',
              createDate: item.created_date || item.created_at,
              dimensions: item.dimensions || item.diamenstions || '-',
              image: item.image || item.primary_image,
              colors: colors,
              price: item.price || 0,
              priceUnit: item.price_unit || null,
              usageCount: item.count || 0
            }
          })
          
          console.log('Final productsData:', this.productsData)
        } else {
          this.$message.error(data.message || 'Failed to fetch top products')
        }
      } catch (error) {
        console.error('Error fetching top products:', error)
        this.$message.error('An error occurred while fetching top products')
      } finally {
        this.loading = false    
      }
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    getImageUrl(imagePath) {
      if (!imagePath) return this.getDefaultImage('product')
      if (imagePath.startsWith('http')) return imagePath
      if (imagePath.startsWith('/media/')) {
        return `${this.$store.state.root_media_api}${imagePath}`
      }
      return `${this.$store.state.root_media_api}${imagePath}`
    },

    getDefaultImage(type) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzRGNDZFNSIvPgo8cGF0aCBkPSJNMTIgMTZIMjhWMjRIMTJWMTZaIiBmaWxsPSIjN0MzQUVEIi8+CjxwYXRoIGQ9Ik0xNiAxMkgyNFYyOEgxNlYxMloiIGZpbGw9IiM2MzY2RjEiLz4KPC9zdmc+'
    },

    async startChatWithCustomer(creditTransaction) {
      try {
        const currentUserData = localStorage.getItem('user')
        if (!currentUserData) {
          this.$message.error('User information not found')
          return
        }

        const currentUser = JSON.parse(currentUserData)
        const selectedUserId = this.selectedUserForDetails

        if (!selectedUserId) {
          this.$message.error('Cannot initiate chat: User ID not found')
          return
        }

        const payload = JSON.stringify({
          type: 'DM',
          members: [currentUser.id, parseInt(selectedUserId)],
          name: `${currentUser.first_name} & Customer`,
        })

        const response = await fetch(`${this.$store.state.root_api}chat/chats`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + localStorage.getItem('token'),
          },
          body: payload,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        const chatRoomId = data.room_id || data.id

        if (currentUser.user_type === 'User') {
          this.$router.push({
            path: '/user-dashboard/my-messages',
            query: { chatId: chatRoomId }
          })
        } else if (currentUser.user_type === 'Business' || currentUser.user_type === 'Professional') {
          this.$router.push({
            path: '/my-store/messages',
            query: { chatId: chatRoomId }
          })
        }
      } catch (error) {
        console.error('Error creating chat room:', error)
        this.$message.error('Failed to start conversation. Please try again.')
      }
    },

    // initChart() {
    //   const ctx = this.$refs.chartCanvas.getContext('2d')
      
    //   const gradient = ctx.createLinearGradient(0, 0, 0, 300)
    //   gradient.addColorStop(0, 'rgba(79, 70, 229, 0.3)')
    //   gradient.addColorStop(1, 'rgba(79, 70, 229, 0.05)')
      
    //   this.chart = new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //       labels: Array.from({ length: this.chartData.length }, (_, i) => i + 1),
    //       datasets: [{
    //         label: 'Favorite Product',
    //         data: this.chartData,
    //         borderColor: '#4F46E5',
    //         backgroundColor: gradient,
    //         borderWidth: 2,
    //         fill: true,
    //         tension: 0.4,
    //         pointBackgroundColor: '#4F46E5',
    //         pointBorderColor: '#ffffff',
    //         pointBorderWidth: 2,
    //         pointRadius: 4,
    //         pointHoverRadius: 6,
    //         pointHoverBackgroundColor: '#4F46E5',
    //         pointHoverBorderColor: '#ffffff',
    //         pointHoverBorderWidth: 2
    //       }]
    //     },
    //     options: {
    //       responsive: true,
    //       maintainAspectRatio: false,
    //       interaction: {
    //         intersect: false,
    //         mode: 'index'
    //       },
    //       plugins: {
    //         legend: {
    //           display: false
    //         },
    //         tooltip: {
    //           backgroundColor: '#1e293b',
    //           titleColor: '#ffffff',
    //           bodyColor: '#ffffff',
    //           borderColor: '#1e293b',
    //           borderWidth: 1,
    //           cornerRadius: 6,
    //           displayColors: false,
    //           callbacks: {
    //             title: function(context) {
    //               return 'Day ----- ' + context[0].label
    //             },
    //             label: function(context) {
    //               return context.parsed.y + 'k'
    //             }
    //           }
    //         }
    //       },
    //       scales: {
    //         x: {
    //           grid: {
    //             display: true,
    //             color: '#f1f5f9',
    //             drawBorder: false,
    //             lineWidth: 1,
    //             drawTicks: false
    //           },
    //           ticks: {
    //             color: '#94a3b8',
    //             font: {
    //               size: 12
    //             },
    //             maxTicksLimit: 10
    //           },
    //           border: {
    //             display: false
    //           }
    //         },
    //         y: {
    //           beginAtZero: true,
    //           max: 50,
    //           grid: {
    //             display: true,
    //             color: '#f1f5f9',
    //             drawBorder: false,
    //             lineWidth: 1,
    //             drawTicks: false
    //           },
    //           ticks: {
    //             color: '#94a3b8',
    //             font: {
    //               size: 12
    //             },
    //             stepSize: 10,
    //             callback: function(value) {
    //               return value + 'k'
    //             }
    //           },
    //           border: {
    //             display: false
    //           }
    //         }
    //       },
    //       elements: {
    //         point: {
    //           hoverRadius: 6
    //         }
    //       }
    //     }
    //   })
    // },
    
    formatNumber(num) {
      if (!num) return '0'
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },

    
  async fetchFavoriteChartData() {
    try {
      // 
      const params = new URLSearchParams()

      if (this.favoriteChartDateRange[0]) {
        params.append('start_date', this.favoriteChartDateRange[0].toISOString())
      }
      if (this.favoriteChartDateRange[1]) {
        params.append('end_date', this.favoriteChartDateRange[1].toISOString())
      }

      // Get business slug from analytics data if available
      // const businessSlug = 'infinity-computer-labs'

      // if (!businessSlug) {
      //   console.warn('Business slug not found')
      //   return
      // }

      // params.append('business_slug', businessSlug)

      const response = await fetch(
        `${this.$store.state.root_api}Auth/api/favorites/business-chart/?${params}`,
        {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        }
      )

      const data = await response.json()
      console.log('Favorite Chart API Response:', data)

      if (response.ok && data) {
        this.favoriteChartData = data.chartData || []
        this.updateFavoriteChart()
      } else {
        this.$message.error(data.error || 'Failed to fetch favorite chart data')
      }
    } catch (error) {
      console.error('Error fetching favorite chart data:', error)
      this.$message.error('An error occurred while fetching favorite chart data')
    }
  },


  updateFavoriteChart() {
  if (!this.$refs.favoriteChartCanvas) return

  const ctx = this.$refs.favoriteChartCanvas.getContext('2d')
  
  if (this.favoriteChart) {
    this.favoriteChart.destroy()
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, 300)
  // gradient.addColorStop(0, 'rgba(79, 70, 229, 0.3)')
  // gradient.addColorStop(1, 'rgba(79, 70, 229, 0.05)')
  gradient.addColorStop(0, 'rgba(59, 99, 251, 0.3)')
gradient.addColorStop(1, 'rgba(59, 99, 251, 0.05)')

  
  // Generate dates starting from today or a specific date
  const dates = []
  if (this.favoriteChartDateRange[0] && this.favoriteChartDateRange[1]) {
    const startDate = new Date(this.favoriteChartDateRange[0])
    for (let i = 0; i < this.favoriteChartData.length; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      dates.push(date)
    }
  } else {
    // Fallback to today if no date range selected
    for (let i = 0; i < this.favoriteChartData.length; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (this.favoriteChartData.length - 1 - i))
      dates.push(date)
    }
  }
  
  this.favoriteChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: this.favoriteChartData.length }, (_, i) => i + 1),
      datasets: [{
        label: 'Favorite Product',
        data: this.favoriteChartData,
        borderColor: '#3b63fb',
        backgroundColor: gradient,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b63fb',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#3b63fb',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#3b63fb',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#3b63fb',
          borderWidth: 1,
          cornerRadius: 6,
          displayColors: false,
          callbacks: {
            title: function(context) {
              const dayNum = context[0].label
              const date = dates[context[0].dataIndex]
              const formattedDate = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })
              return `Day ${dayNum} - ${formattedDate}`
            },
            label: function(context) {
              return context.parsed.y + ' favorites'
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: true,
            color: '#f1f5f9',
            drawBorder: false,
            lineWidth: 1,
            drawTicks: false
          },
          ticks: {
            color: '#94a3b8',
            font: {
              size: 12
            },
            maxTicksLimit: 10
          },
          border: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: '#f1f5f9',
            drawBorder: false,
            lineWidth: 1,
            drawTicks: false
          },
          ticks: {
            color: '#94a3b8',
            font: {
              size: 12
            },
            stepSize: 10,
            callback: function(value) {
              return value
            }
          },
          border: {
            display: false
          }
        }
      },
      elements: {
        point: {
          hoverRadius: 6
        }
      }
    }
  })
}
  }
}
</script>

<style scoped>
.analytics-dashboard {
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
}

.mb-6 {
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.stat-card.total-products {
  background: #3b63fb;
  color: white;
}

.stat-card.total-products .stat-label,
.stat-card.total-products .stat-value {
  color: white;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
  font-weight: 500;
}

@media (max-width:400px){
  .stat-label {
     font-size: 12px;
  }
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.thumbnail-skeleton {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(
    110deg,
    #e5e7eb 8%,
    #f9fafb 18%,
    #e5e7eb 33%
  );
  background-size: 200% 100%;
  animation: thumbnail-shimmer 1.6s infinite linear;
}

@keyframes thumbnail-shimmer {
  to {
    background-position-x: -200%;
  }
}


.chart-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.date-range {
  color: #64748b;
  font-size: 14px;
}

.chart-container {
  margin-top: 20px;
  height: 300px;
}

.table-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

@media (max-width: 768px) {
  .analytics-dashboard {
    padding: 16px;
  }
  
  .stat-value {
    font-size: 24px;
  }
}

.product-listed-sec {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

@media screen and (max-width: 570px) {
  .product-listed-sec {
    gap: 5px;
     justify-content: flex-start; /* ✅ KEY FIX */
    align-items: flex-start;
    min-width: 370px;
  }
  .table-card {
    padding: 0;
    background: none;
    box-shadow: none;
  }
}

.chart-filters {
  display: flex;
  gap: 8px;
  align-items: center;
}

.credit-summary,
.user-transaction-summary {
  display: flex;
  gap: 24px;
  margin: 16px 0;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.summary-value {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

@media (max-width: 768px) {
  .chart-filters {
    flex-direction: column;
    width: 100%;
  }
  
  .chart-filters .a-date-picker {
    width: 100% !important;
  }
  
  .credit-summary,
  .user-transaction-summary {
    flex-direction: column;
    gap: 12px;
  }
}
</style>