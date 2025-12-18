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
          <div class="stat-label">Total Simulations</div>
          <div class="stat-value">0</div>
        </div>
      </a-col>
      <a-col :xs="12" :sm="12" :md="6">
        <div class="stat-card balance-credits">
          <div class="stat-label">Balance Credits</div>
          <div class="stat-value">{{ analyticsData ? formatNumber(analyticsData.credits) : '...' }}</div>
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

    <!-- Products Table - Updated to match your list view -->
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <div class="table-card">
          <div class="table-header">
            <h3>Top simulation products</h3>
          </div>
          <!-- {{productsData}} -->
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
    </a-row>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'

// Register Chart.js components
Chart.register(...registerables)

export default {
  name: 'Analytics',
  data() {
    return {
      chart: null,
      loading: false,
      analyticsData: null,
      chartData: [
        5, 8, 6, 12,60
      ],
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
      productsData: []
    }
  },
  mounted() {
    this.fetchAnalytics()
    this.fetchTopProducts()
    this.initChart()
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy()
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
          // this.$message.success('Analytics data loaded successfully')
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
          // Transform API data to table format matching your list view
          this.productsData = data.data.map((item, index) => {
            // Ensure colors is always an array
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
          // this.$message.success('Top products loaded successfully')
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
        month: 'long', 
        day: 'numeric' 
      })
    },

    getImageUrl(imagePath) {
      if (!imagePath) return this.getDefaultImage('product')
      // If it's already a full URL, return it
      if (imagePath.startsWith('http')) return imagePath
      // If it's a relative path, prepend the API base URL
      if (imagePath.startsWith('/media/')) {
        return `${this.$store.state.root_media_api}${imagePath}`
      }
      return `${this.$store.state.root_media_api}${imagePath}`
    },

    getDefaultImage(type) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzRGNDZFNSIvPgo8cGF0aCBkPSJNMTIgMTZIMjhWMjRIMTJWMTZaIiBmaWxsPSIjN0MzQUVEIi8+CjxwYXRoIGQ9Ik0xNiAxMkgyNFYyOEgxNlYxMloiIGZpbGw9IiM2MzY2RjEiLz4KPC9zdmc+'
    },

    initChart() {
      const ctx = this.$refs.chartCanvas.getContext('2d')
      
      // Create gradient
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

/* Stat Cards */
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

/* Chart Card */
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

/* Table Card */
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

/* Responsive Adjustments */
@media (max-width: 768px) {
  .analytics-dashboard {
    padding: 16px;
  }
  
  .stat-value {
    font-size: 24px;
  }
}
</style>