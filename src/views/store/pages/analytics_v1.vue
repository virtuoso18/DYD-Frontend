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
          <div class="stat-label">Total Credits Consumed</div>
          <div class="stat-value">{{ creditStats ? Math.abs(creditStats.total_consumed) : '...' }}</div>
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
      <div class="chart-header">
        <h3>Daily Credit Consumption</h3>
        <div class="chart-filters">
          <a-date-picker
            v-model:value="creditChartDateRange[0]"
            placeholder="Start Date"
            style="width: 150px; margin-right: 8px;"
            @change="fetchDailyCreditConsumption"
          />
          <a-date-picker
            v-model:value="creditChartDateRange[1]"
            placeholder="End Date"
            style="width: 150px;"
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
          <div class="chart-header">
            <h3>Favorite product</h3>
            <div class="date-range">1 June - 1 July, 2025</div>
          </div>
          
          <!-- Chart -->
          <div class="chart-container">
            <canvas ref="chartCanvas" style="max-height: 300px;"></canvas>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- Credit Transactions Table -->
    <a-row :gutter="[16, 16]" class="mb-6">
      <a-col :span="24">
        <div class="table-card">
          <div class="table-header">
            <h3>Credit Transactions</h3>
          </div>
          <!-- Date Range Filter for Credit Transactions -->
          <div style="margin-bottom: 16px; display: flex; gap: 16px; flex-wrap: wrap;">
            <a-date-picker
              v-model:value="dateRange[0]"
              placeholder="Start Date"
              style="width: 200px"
              @change="fetchCreditTransactions"
            />
            <a-date-picker
              v-model:value="dateRange[1]"
              placeholder="End Date"
              style="width: 200px"
              @change="fetchCreditTransactions"
            />
            <a-select
              v-model:value="filterStatus"
              placeholder="Filter by Status"
              @change="fetchCreditTransactions"
              style="width: 200px"
              allow-clear
            >
              <a-select-option value="">All Status</a-select-option>
              <a-select-option value="pending">Pending</a-select-option>
              <a-select-option value="success">Success</a-select-option>
              <a-select-option value="failed">Failed</a-select-option>
            </a-select>
          </div>
          <!-- {{ creditTransactions }} -->
          <a-table 
            :columns="creditTableColumns" 
            :data-source="creditTransactions" 
            row-key="id" 
            :pagination="false"
            :scroll="{ x: 1000 }"
            :loading="creditLoading"
            style="background: white; border-radius: 8px; overflow: hidden;"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'serial'">
                <span style="font-weight: 600; color: #666;">{{ index + 1 }}</span>
              </template>

              <template v-if="column.key === 'consumed_by_email'">
                <span>{{ record.consumed_by_email }}</span>
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

              <template v-if="column.key === 'room_name'">
                <span>{{ record.room_name || '-' }}</span>
              </template>

              <template v-if="column.key === 'created_at'">
                <span>{{ formatDate(record.created_at) }}</span>
              </template>

              <template v-if="column.key === 'description'">
                <span style="font-size: 12px;">{{ record.description || '-' }}</span>
              </template>
              <template v-if="column.key === 'chat_with_customer'">
                <button
                  style="background: #4f46e5; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;"
                  @click="startChatWithCustomer(record)"
                >
                  Chat
                </button>
              </template>
            </template>
          </a-table>
        </div>
      </a-col>
    </a-row>

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
                  <img 
                    :src="getImageUrl(record.image)"
                    style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;"
                  >
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

Chart.register(...registerables)

export default {
  name: 'Analytics',
  components:{
    AnalyticsProductCard
  },
  data() {
    return {
      chart: null,
      loading: false,
      creditChart: null,
      dailyCreditData: null,
      creditLoading: false,
      creditChartDateRange: [dayjs().subtract(30, 'day'), dayjs()],
      analyticsData: null,
      creditStats: null,
      creditTransactions: [],
      dateRange: [null, null],
      filterStatus: '',
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
      creditTableColumns: [
        {
          title: '',
          key: 'serial',
          width: 40,
        },
        {
          title: 'Consumed By Email',
          key: 'consumed_by_email',
          width: 150,
        },
        // {
        //   title: 'Business',
        //   key: 'business_name',
        //   width: 150,
        // },
        {
          title: 'Credits',
          key: 'credits_changed',
          width: 100,
        },
        // {
        //   title: 'Type',
        //   key: 'type',
        //   width: 80,
        // },
        {
          title: 'Status',
          key: 'status',
          width: 100,
        },
        // {
        //   title: 'Room',
        //   key: 'room_name',
        //   width: 120,
        // },
        {
          title: 'Date',
          key: 'created_at',
          width: 150,
        },
        {
          title: 'Description',
          key: 'description',
          width: 200,
        },
        {
          title: 'Chat with Customer',
          key: 'chat_with_customer',
          width: 50,
        }
      ],
      productsData: []
    }
  },
  mounted() {
    this.fetchAnalytics()
    this.fetchTopProducts()
    this.fetchCreditTransactions()
    this.fetchDailyCreditConsumption()  
    this.initChart()
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy()
    }
     if (this.creditChart) {  // ADD THESE 3 LINES
      this.creditChart.destroy()
    }
  },
  methods: {
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
    async fetchDailyCreditConsumption() {
  try {
    const params = new URLSearchParams()

    // Add date filters
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
  
  // Destroy existing chart if it exists
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

    async fetchCreditTransactions() {
      this.creditLoading = true
      try {
        const params = new URLSearchParams()

        // Add date filters
        if (this.dateRange[0]) {
          params.append('start_date', this.dateRange[0].toISOString())
        }
        if (this.dateRange[1]) {
          params.append('end_date', this.dateRange[1].toISOString())
        }

        // Add status filter
        if (this.filterStatus) {
          params.append('status', this.filterStatus)
        }

        const response = await fetch(
          `${this.$store.state.root_api}subscription/api/analytics-credit-transactions/?${params}`,
          {
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`
            }
          }
        )

        const data = await response.json()
        console.log('Credit Transactions API Response:', data)

        if (response.ok && data.success) {
          this.creditTransactions = data.data.transactions || []
          
          // Calculate stats
          if (this.creditTransactions.length > 0) {
           
            const totalConsumed = this.creditTransactions
              .filter(tx => tx.type === 'consume' && tx.status === 'success')
              .reduce((sum, tx) => sum + parseFloat(tx.credits_changed), 0)

            this.creditStats = {

              total_consumed: totalConsumed,

            }
          }
        } else {
          this.$message.error(data.message || 'Failed to fetch credit transactions')
        }
      } catch (error) {
        console.error('Error fetching credit transactions:', error)
        this.$message.error('An error occurred while fetching credit transactions')
      } finally {
        this.creditLoading = false
      }
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
    // Get current user from localStorage
    debugger
    const currentUserData = localStorage.getItem('user')
    if (!currentUserData) {
      this.$message.error('User information not found')
      return
    }

    const currentUser = JSON.parse(currentUserData)
    const selectedUserId = creditTransaction.consumed_by_id

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

    // Route based on user type
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

    initChart() {
      const ctx = this.$refs.chartCanvas.getContext('2d')
      
      const gradient = ctx.createLinearGradient(0, 0, 0, 300)
      gradient.addColorStop(0, 'rgba(79, 70, 229, 0.3)')
      gradient.addColorStop(1, 'rgba(79, 70, 229, 0.05)')
      
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({ length: this.chartData.length }, (_, i) => i + 1),
          datasets: [{
            label: 'Favorite Product',
            data: this.chartData,
            borderColor: '#4F46E5',
            backgroundColor: gradient,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#4F46E5',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#4F46E5',
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
                  return 'Day ----- ' + context[0].label
                },
                label: function(context) {
                  return context.parsed.y + 'k'
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
              max: 50,
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
                  return value + 'k'
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
    
    formatNumber(num) {
      if (!num) return '0'
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
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
    justify-content: center;
    align-items: center;
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

.credit-summary {
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
  
  .credit-summary {
    flex-direction: column;
    gap: 12px;
  }
}

</style>