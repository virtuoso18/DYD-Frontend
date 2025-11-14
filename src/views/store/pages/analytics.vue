<template>
  <div class="analytics-dashboard">
    <!-- Top Stats Cards -->
    <a-row :gutter="[16, 16]" class="mb-6">
      <a-col :xs="24" :sm="12" :md="6">
        <div class="stat-card total-products">
          <div class="stat-label">Total Products</div>
          <div class="stat-value">{{ analyticsData ? analyticsData.total_products : '...' }}</div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div class="stat-card total-clicks">
          <div class="stat-label">Total Clicks</div>
          <div class="stat-value">{{ analyticsData ? formatNumber(analyticsData.total_clicks) : '...' }}</div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div class="stat-card total-simulations">
          <div class="stat-label">Total Simulations</div>
          <div class="stat-value">0</div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
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

    <!-- Products Table -->
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <div class="table-card">
          <div class="table-header">
            <h3>Top simulation products</h3>
            <a-button type="link" class="view-all-btn">
              View all <a-icon type="right" />
            </a-button>
          </div>
          
          <a-table 
            :dataSource="productsData" 
            :columns="tableColumns" 
            :pagination="false"
            :loading="loading"
            size="middle"
            :scroll="{ x: 800 }"
          >
            <template slot="product" slot-scope="record">
              <div class="product-info">
                <img :src="record.image" :alt="record.name" class="product-image" />
                <div class="product-details">
                  <div class="product-name">{{ record.name }}</div>
                  <div class="product-description">{{ record.description }}</div>
                </div>
              </div>
            </template>
            
            <template slot="color" slot-scope="colors">
              <div class="color-dots">
                <span 
                  v-for="color in colors" 
                  :key="color"
                  class="color-dot" 
                  :style="{ backgroundColor: color }"
                ></span>
              </div>
            </template>
            
            <template slot="price" slot-scope="price">
              <span class="price">${{ price }}</span>
            </template>
            
            <template slot="usageCount" slot-scope="count">
              <span class="usage-count">{{ count }}</span>
            </template>
            
            <template slot="ar-vr" slot-scope="record">
              <div class="ar-vr-buttons">
                <a-button size="small" class="ar-btn">AR</a-button>
                <a-button size="small" class="vr-btn" type="primary">
                  <a-icon type="eye" />
                </a-button>
                <a-button size="small" class="share-btn" type="danger">
                  <a-icon type="share-alt" />
                </a-button>
              </div>
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
        5, 8, 6, 12, 10, 8, 14, 16, 18, 25, 28, 32, 35, 38, 42, 45, 43, 40, 35, 32, 28, 25, 22, 20, 18, 16, 18, 20, 25, 28, 22
      ],
      tableColumns: [
        {
          title: '#',
          dataIndex: 'id',
          key: 'id',
          width: 50,
          align: 'center'
        },
        {
          title: 'Product',
          key: 'product',
          scopedSlots: { customRender: 'product' },
          width: 300
        },
        {
          title: 'Category',
          dataIndex: 'category',
          key: 'category',
          width: 100
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
          width: 120
        },
        {
          title: 'Usage Count',
          key: 'usageCount',
          dataIndex: 'usageCount',
          scopedSlots: { customRender: 'usageCount' },
          width: 100,
          align: 'center'
        },
        {
          title: 'Color',
          key: 'color',
          scopedSlots: { customRender: 'color' },
          width: 80,
          align: 'center'
        },
        {
          title: 'AR/VR',
          key: 'ar-vr',
          scopedSlots: { customRender: 'ar-vr' },
          width: 120,
          align: 'center'
        }
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
          this.$message.success('Analytics data loaded successfully')
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
          // Transform API data to table format
          this.productsData = data.data.map((item, index) => ({
            key: item.id,
            id: index + 1,
            name: item.name,
            description: item.brand ? `Brand: ${item.brand}` : `Type: ${item.type}`,
            category: this.getItemCategory(item.type),
            type: item.style || item.brand || '-',
            createDate: '-',
            size: '-',
            image: this.getDefaultImage(item.type),
            colors: ['#10b981', '#f59e0b', '#ef4444'],
            price: 0,
            usageCount: item.count
          }))
          
          this.$message.success('Top products loaded successfully')
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

    getItemCategory(type) {
      const categoryMap = {
        'product': 'Product',
        'texturewall': 'Wall Texture',
        'texturefloor': 'Floor Texture'
      }
      return categoryMap[type] || type
    },

    getDefaultImage(type) {
      // Return different placeholder images based on type
      const imageMap = {
        'product': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzRGNDZFNSIvPgo8cGF0aCBkPSJNMTIgMTZIMjhWMjRIMTJWMTZaIiBmaWxsPSIjN0MzQUVEIi8+CjxwYXRoIGQ9Ik0xNiAxMkgyNFYyOEgxNlYxMloiIGZpbGw9IiM2MzY2RjEiLz4KPC9zdmc+',
        'texturewall': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzEwYjk4MSIvPgo8cmVjdCB4PSI4IiB5PSIxMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjIwIiBmaWxsPSIjMzRkMzk5Ii8+Cjwvc3ZnPg==',
        'texturefloor': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI2Y1OWUwYiIvPgo8cmVjdCB4PSI4IiB5PSI4IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmYmJmMjQiLz4KPHJlY3QgeD0iMjIiIHk9IjgiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZiYmYyNCIvPgo8cmVjdCB4PSI4IiB5PSIyMiIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmJiZjI0Ii8+CjxyZWN0IHg9IjIyIiB5PSIyMiIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmJiZjI0Ii8+Cjwvc3ZnPg=='
      }
      return imageMap[type] || imageMap['product']
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
          labels: Array.from({length: 31}, (_, i) => i + 1),
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
                  return 'Day ' + context[0].label
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

.stat-change {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

.stat-change.positive {
  background-color: #dcfce7;
  color: #16a34a;
}

.stat-change.negative {
  background-color: #fef2f2;
  color: #dc2626;
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

.chart-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-btn {
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 12px;
}

.filter-btn.active {
  background-color: #4f46e5;
  color: white;
  border-color: #4f46e5;
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

.view-all-btn {
  color: #4f46e5;
  padding: 0;
}

/* Product Info */
.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  background-color: #f1f5f9;
}

.product-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.product-description {
  font-size: 12px;
  color: #64748b;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Color Dots */
.color-dots {
  display: flex;
  gap: 4px;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
}

/* Price */
.price {
  font-weight: 600;
  color: #1e293b;
}

/* Usage Count */
.usage-count {
  font-weight: 600;
  color: #4f46e5;
  font-size: 16px;
}

/* AR/VR Buttons */
.ar-vr-buttons {
  display: flex;
  gap: 4px;
}

.ar-btn, .vr-btn, .share-btn {
  min-width: 32px;
  height: 28px;
  border-radius: 4px;
  font-size: 11px;
}

.ar-btn {
  background-color: #f1f5f9;
  border-color: #e2e8f0;
  color: #64748b;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .analytics-dashboard {
    padding: 16px;
  }
  
  .chart-filters {
    justify-content: flex-start;
  }
  
  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .stat-value {
    font-size: 24px;
  }
}

@media (max-width: 576px) {
  .product-description {
    max-width: 150px;
  }
  
  .ar-vr-buttons {
    flex-direction: column;
    gap: 2px;
  }
}
</style>