<template>
  <div class="analytics-dashboard">
    <!-- Top Stats Cards -->
    <a-row :gutter="[16, 16]" class="mb-6">
      <a-col :xs="24" :sm="12" :md="6">
        <div class="stat-card total-products">
          <div class="stat-label">Total Products</div>
          <div class="stat-value">4,520</div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div class="stat-card total-clicks">
          <div class="stat-label">Total Clicks</div>
          <div class="stat-value">658,463</div>
          <div class="stat-change positive">
            <a-icon type="arrow-up" /> 5.7%
          </div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div class="stat-card total-simulations">
          <div class="stat-label">Total Simulations</div>
          <div class="stat-value">4,529,896</div>
          <div class="stat-change negative">
            <a-icon type="arrow-down" /> 8.2%
          </div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div class="stat-card balance-credits">
          <div class="stat-label">Balance Credits</div>
          <div class="stat-value">6,000</div>
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
          
          <!-- Filters -->
          <div class="chart-filters">
            <a-button size="small" class="filter-btn">
              <a-icon type="filter" /> Filter by
            </a-button>
            <a-button size="small" class="filter-btn">Color</a-button>
            <a-button size="small" class="filter-btn">Simulation</a-button>
            <a-button size="small" class="filter-btn active">Favorite product</a-button>
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
          title: 'Create date',
          dataIndex: 'createDate',
          key: 'createDate',
          width: 120
        },
        {
          title: 'Size',
          dataIndex: 'size',
          key: 'size',
          width: 120
        },
        {
          title: 'Color',
          key: 'color',
          scopedSlots: { customRender: 'color' },
          width: 80,
          align: 'center'
        },
        {
          title: 'Price',
          key: 'price',
          scopedSlots: { customRender: 'price' },
          width: 80,
          align: 'right'
        },
        {
          title: 'AR/VR',
          key: 'ar-vr',
          scopedSlots: { customRender: 'ar-vr' },
          width: 120,
          align: 'center'
        }
      ],
      productsData: [
        {
          key: '1',
          id: 1,
          name: 'Decaly Coral',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...',
          category: 'Chair',
          type: 'Modern',
          createDate: 'June 10, 2025',
          size: '24 in W x 24 in D x 30 in H',
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0Y4RkFGQyIvPgo8cGF0aCBkPSJNMTIgMTZIMjhWMjRIMTJWMTZaIiBmaWxsPSIjRTJFOEYwIi8+CjxwYXRoIGQ9Ik0xNiAxMkgyNFYyOEgxNlYxMloiIGZpbGw9IiNDQkQzRTAiLz4KPC9zdmc+',
          colors: ['#10b981', '#f59e0b', '#ef4444'],
          price: 660
        },
        {
          key: '2',
          id: 2,
          name: 'Ocean Blue',
          description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
          category: 'Table',
          type: 'Contemporary',
          createDate: 'May 15, 2025',
          size: '60 in W x 30 in D x 29 in H',
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0Y4RkFGQyIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSI4IiBmaWxsPSIjMzMzNEVBIi8+Cjwvc3ZnPg==',
          colors: ['#10b981', '#f59e0b', '#ef4444'],
          price: 1200
        },
        {
          key: '3',
          id: 3,
          name: 'Sunset Orange',
          description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...',
          category: 'Sofa',
          type: 'Transitional',
          createDate: 'August 22, 2025',
          size: '78 in W x 34 in D x 32 in H',
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0Y4RkFGQyIvPgo8ZWxsaXBzZSBjeD0iMjAiIGN5PSIyMCIgcng9IjEyIiByeT0iNiIgZmlsbD0iI0Y5NzMxNiIvPgo8L3N2Zz4=',
          colors: ['#10b981', '#f59e0b', '#ef4444'],
          price: 850
        }
      ]
    }
  },
  mounted() {
    this.initChart()
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy()
    }
  },
  methods: {
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