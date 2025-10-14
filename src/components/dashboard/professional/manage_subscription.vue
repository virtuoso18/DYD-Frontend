<template>
  <div style="padding: 16px; background: #ffffff; min-height: 90vh; margin-top: 0px; border: 2px solid rgba(0,0,0,0.1); border-radius: 20px;margin-top:15px">
    <div style="max-width: 1200px; margin: 0 auto;">
      <!-- Header -->
      <a-row justify="space-between" align="middle" style="margin-bottom: 24px;">
        <a-col :xs="24" :sm="16" :md="18" :lg="20">
          <h2 style="margin: 0; color: #262626; font-size: clamp(18px, 4vw, 24px); font-weight: 600;">
            Manage Subscription
          </h2>
        </a-col>
        <a-col :xs="24" :sm="8" :md="6" :lg="4" style="text-align: right;">
          <a-button 
            type="text" 
            style="color: #ff4d4f; padding: 4px 8px; font-size: clamp(12px, 2.5vw, 14px);"
            block
            @click="handleCancelSubscription"
          >
            ✕ Cancel Subscription
          </a-button>
        </a-col>
      </a-row>

      <!-- Subscription Card -->
      <a-row style="margin-bottom: 24px;">
        <a-col span="24">
          <div style="background-color: #3B63FB; border-radius: 20px; width: 100%; min-height: 160px; padding: 8px; display: flex; align-items: center; box-shadow: 0 4px 16px rgba(79, 124, 255, 0.3);" class="subscription-card">
            <!-- Mobile Layout -->
            <div class="mobile-subscription" style="display: none; width: 100%; height: 100%; padding: 20px; text-align: center; color: white;">
              <h3 style="margin: 0 0 8px 0; font-size: clamp(24px, 6vw, 32px); font-weight: 600; color: white;">
                Basic
              </h3>
              <p style="margin: 0 0 16px 0; color: rgba(255,255,255,0.8); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                BILLED YEARLY
              </p>
              <h1 style="font-size: clamp(32px, 8vw, 45px); color: white; margin: 0 0 8px 0; font-weight: 700;">
                $45
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 0 0 16px 0; font-size: 14px;">
                1,000 credits / month
              </p>
              <a-button size="large" style="background: white; color: #3B63FB; border: none; border-radius: 8px; font-weight: 600; padding: 0 16px; height: 36px; margin-bottom: 12px;" block>
                Upgrade to Pro
              </a-button>
              <a-button type="link" style="padding: 0; color: white; font-weight: 500; text-decoration: underline;">
                View all plans →
              </a-button>
            </div>

            <!-- Desktop Layout -->
            <div class="desktop-subscription" style="display: flex; width: 100%; height: 100%;">
              <div style="background: white; width: 65%; height: 100%; border-radius: 15px; padding: 24px; display: flex; flex-direction: column; justify-content: center; min-height: 144px;">
                <h3 style="margin: 0 0 8px 0; font-size: clamp(24px, 3vw, 32px); font-weight: 600; color: #262626;">
                  Basic
                </h3>
                <p style="margin: 0 0 16px 0; color: #8c8c8c; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                  BILLED YEARLY
                </p>
                <a-button type="link" style="padding: 0; color: #1890ff; font-weight: 500;">
                  View all plans →
                </a-button>
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; text-align: center; padding: 16px;">
                <h1 style="font-size: clamp(32px, 4vw, 45px); color: white; margin: 0 0 8px 0; font-weight: 700;">
                  $45
                </h1>
                <p style="color: rgba(255,255,255,0.9); margin: 0 0 16px 0; font-size: clamp(12px, 2.5vw, 14px);">
                  1,000 credits / month
                </p>
                <a-button size="large" style="background: white; color: #3B63FB; border: none; border-radius: 8px; font-weight: 600; padding: 0 16px; height: 36px;">
                  Upgrade to Pro
                </a-button>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>

      <!-- Credits Section -->
      <a-row style="margin-bottom: 32px;">
        <a-col span="24">
          <div style="background: white; border-radius: 12px; padding: 16px; border: 2px solid rgba(79, 124, 255, 0.1);">
            <a-row justify="space-between" align="middle" :gutter="[16, 16]">
              <a-col :xs="24" :sm="24" :md="16" :lg="16">
                <div style="display: flex; align-items: flex-start; gap: 12px; flex-direction: row;" class="credits-info">
                  <div style="width: 48px; height: 48px; background: #1890ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: 600; flex-shrink: 0;">
                    ✦
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <h4 style="margin: 0 0 8px 0; font-size: clamp(16px, 3vw, 18px); font-weight: 600; color: #262626;">
                      Your remaining credits
                    </h4>
                    <p style="margin: 0; color: #8c8c8c; font-size: clamp(12px, 2.5vw, 14px); line-height: 1.4;">
                      This will not affect your monthly subscription plan and will only be used after your monthly quota is exhausted.
                    </p>
                  </div>
                </div>
              </a-col>
              
              <a-col :xs="24" :sm="24" :md="8" :lg="8" style="text-align: center;">
                <div style="margin-bottom: 16px;">
                  <span style="font-size: clamp(24px, 6vw, 32px); font-weight: 700; color: #1890ff;">
                    1,000
                  </span>
                </div>
                <a-button 
                  type="primary" 
                  size="large" 
                  style="border-radius: 8px; font-weight: 600; width: 100%; max-width: 200px;"
                  @click="handleBuyCredits"
                >
                  Buy more Credits
                </a-button>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>

      <!-- History Section -->
      <a-row>
        <a-col span="24">
          <div style="background: white; border-radius: 12px; padding: 16px; border: 2px solid rgba(79, 124, 255, 0.1);">
            <h3 style="margin: 0 0 24px 0; font-size: clamp(18px, 3.5vw, 20px); font-weight: 600; color: #262626;">
              History
            </h3>
            
            <!-- Tabs -->
            <a-tabs v-model:activeKey="activeTab" style="margin-bottom: 0;">
              <a-tab-pane key="subscription" tab="Subscription" >

<!-- Desktop Table -->
            <div style="overflow-x: auto; display: block;" class="desktop-table">
              <a-table 
                :columns="columns" 
                :data-source="tableData_subscriptions" 
                :pagination="false"
                :show-header="true"
                size="middle"
                :scroll="{ x: 800 }"
              >
                <!-- Custom columns -->
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'plan'">
                    <span style="font-weight: 500; color: #262626;">{{ record.plan }}</span>
                  </template>
                  <template v-if="column.key === 'date'">
                    <span style="font-weight: 500; color: #262626;">{{ formatDate(record.date)  }}</span>
                  </template>
                   <template v-if="column.key === 'expireDate'">
                    <span style="font-weight: 500; color: #262626;">{{ formatDate(record.expireDate)  }}</span>
                  </template>
                  <template v-if="column.key === 'payment'">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' rx='2' fill='%231A1F71'/%3E%3Cpath d='M8.5 4.5h7v7h-7z' fill='%23fff'/%3E%3C/svg%3E" alt="Visa" style="width: 20px; height: 14px;" />
                      <span style="color: #8c8c8c; font-size: 14px;">Debit Card</span>
                    </div>
                  </template>
                  
                  <template v-if="column.key === 'price'">
                    <span style="color: #1890ff; font-weight: 600;">${{ record.price }}</span>
                  </template>
                  
                  <template v-if="column.key === 'action'">
                    <a-button 
                      type="link" 
                      style="padding: 0; color: #1890ff; font-size: 14px;" 
                      @click="downloadInvoice(record.innovice)">
                      Download invoice
                    </a-button>

                  </template>
                  
                  <template v-if="column.key === 'status'">
                    <span style="color: #52c41a; font-weight: 500;">{{ record.status }}</span>
                  </template>
                </template>
              </a-table>
            </div>

            <!-- Mobile Cards -->
            <div style="display: none; padding: 0;" class="mobile-cards">
              <div 
                v-for="record in tableData_subscriptions" 
                :key="record.key"
                style="background: #fafafa; border-radius: 12px; padding: 16px; margin-bottom: 16px; border: 1px solid #f0f0f0;"
              >
                <a-row justify="space-between" align="top" style="margin-bottom: 12px;">
                  <a-col span="12">
                    <div style="font-weight: 600; color: #262626; font-size: 16px;">
                      {{ record.plan }}
                    </div>
                    <div style="color: #8c8c8c; font-size: 12px; margin-top: 4px;">
                      {{ formatDate(record.date) }}
                    </div>
                    <div style="color: #8c8c8c; font-size: 12px; margin-top: 2px;">
                      Exp: {{ formatDate(record.expireDate) }}
                    </div>
                  </a-col>
                  <a-col span="12" style="text-align: right;">
                    <div style="color: #1890ff; font-weight: 600; font-size: 18px;">
                      ${{ record.price }}
                    </div>
                    <div style="color: #52c41a; font-weight: 500; margin-top: 4px; font-size: 14px;">
                      {{ record.status }}
                    </div>
                  </a-col>
                  <a-col>
                    <a-button 
  type="link" 
  style="padding: 0; color: #1890ff; font-size: 14px;" 
  @click="downloadInvoice(record.innovice)">
   Download invoice
</a-button>
                  </a-col>
                </a-row>
                
                <a-row align="middle" style="margin-bottom: 12px;">
                  <a-col span="12">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' rx='2' fill='%231A1F71'/%3E%3Cpath d='M8.5 4.5h7v7h-7z' fill='%23fff'/%3E%3C/svg%3E" alt="Visa" style="width: 20px; height: 14px;" />
                      <span style="color: #595959; font-size: 12px;">Debit Card</span>
                    </div>
                  </a-col>
                  <a-col span="12" style="text-align: right;">
                    <span style="color: #8c8c8c; font-size: 12px;">{{ record.billed }}</span>
                  </a-col>
                </a-row>

                <a-row>
                  <a-col span="24">
                    <a-button 
  type="link" 
  style="padding: 0; color: #1890ff; font-size: 14px;" 
  @click="downloadInvoice(record.innovice)">
   Download invoice
</a-button>
                  </a-col>
                </a-row>
              </div>
            </div>

              </a-tab-pane>
              <a-tab-pane key="credits" tab="Credits" >

                <!-- Desktop Table -->
            <div style="overflow-x: auto; display: block;" class="desktop-table">
              <a-table 
                :columns="columns_credits_table" 
                :data-source="tableData_credits" 
                :pagination="false"
                :show-header="true"
                size="middle"
                :scroll="{ x: 800 }"
              >
                <!-- Custom columns -->
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'plan'">
                    <span style="font-weight: 500; color: #262626;">{{ record.plan }}</span>
                  </template>
                  
                  <template v-if="column.key === 'payment'">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' rx='2' fill='%231A1F71'/%3E%3Cpath d='M8.5 4.5h7v7h-7z' fill='%23fff'/%3E%3C/svg%3E" alt="Visa" style="width: 20px; height: 14px;" />
                      <span style="color: #8c8c8c; font-size: 14px;">Debit Card</span>
                    </div>
                  </template>
                  <template v-if="column.key === 'purchase_date'">
                    <span style="font-weight: 500; color: #262626;">{{ formatDate(record.date)  }}</span>
                  </template>
                   <template v-if="column.key === 'purchased_credits'">
                    <span style="font-weight: 500; color: #262626;text-align:center;width:100%">{{record.purchased_credits }}</span>
                  </template>
                  <template v-if="column.key === 'price'">
                    <span style="color: #1890ff; font-weight: 600;">${{ record.price }}</span>
                  </template>
                  
                  <template v-if="column.key === 'action'">
                    <a-button 
  type="link" 
  style="padding: 0; color: #1890ff; font-size: 14px;" 
  @click="downloadInvoice(record.innovice)">
   Download invoice
</a-button>

                  </template>

                  <template v-if="column.key === 'status'">
                    <span style="color: #52c41a; font-weight: 500;">{{ record.status }}</span>
                  </template>
                </template>
              </a-table>
            </div>

            <!-- Mobile Cards -->
            <div style="display: none; padding: 0;" class="mobile-cards">
              <div 
                v-for="record in tableData_credits" 
                :key="record.key"
                style="background: #fafafa; border-radius: 12px; padding: 16px; margin-bottom: 16px; border: 1px solid #f0f0f0;"
              >
                <a-row justify="space-between" align="top" style="margin-bottom: 12px;">
                  <a-col span="12">
                    <div style="font-weight: 600; color: #262626; font-size: 16px;">
                      {{ record.plan }}
                    </div>
                    <div style="color: #8c8c8c; font-size: 12px; margin-top: 4px;">
                      {{ formatDate(record.date) }}
                    </div>

                  </a-col>
                  <a-col span="12" style="text-align: right;">
                    <div style="color: #1890ff; font-weight: 600; font-size: 18px;">
                      ${{ record.price }}
                    </div>
                    <div style="color: #52c41a; font-weight: 500; margin-top: 4px; font-size: 14px;">
                      {{ record.status }}
                    </div>
                  </a-col>
                </a-row>
                
                <a-row align="middle" style="margin-bottom: 12px;">
                  <a-col span="12">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' rx='2' fill='%231A1F71'/%3E%3Cpath d='M8.5 4.5h7v7h-7z' fill='%23fff'/%3E%3C/svg%3E" alt="Visa" style="width: 20px; height: 14px;" />
                      <span style="color: #595959; font-size: 12px;">Debit Card</span>
                    </div>
                  </a-col>
                  <a-col span="12" style="text-align: right;">
                    <span style="color: #8c8c8c; font-size: 12px;">{{ record.billed }}</span>
                  </a-col>
                </a-row>

                <a-row>
                  <a-col span="24">
                    
                    <a-button 
  type="link" 
  style="padding: 0; color: #1890ff; font-size: 14px;" 
  @click="downloadInvoice(record.innovice)">
   Download invoice
</a-button>

                  
                  </a-col>
                </a-row>
              </div>
            </div>
              </a-tab-pane>
            </a-tabs>

            
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResponsiveManageSubscription',
  data() {
    return {
      activeTab: 'subscription',
      columns: [
        {
          title: 'Plan',
          dataIndex: 'plan',
          key: 'plan',
          width: 100,
        },
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
          width: 120,
        },
        {
          title: 'Expire Date',
          dataIndex: 'expireDate',
          key: 'expireDate',
          width: 120,
        },
        {
          title: 'Payment method',
          dataIndex: 'payment',
          key: 'payment',
          width: 150,
        },
        {
          title: 'Billed',
          dataIndex: 'billed',
          key: 'billed',
          width: 100,
        },
        {
          title: 'Price',
          dataIndex: 'price',
          key: 'price',
          width: 80,
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
          width: 120,
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          width: 100,
        },
      ],
        columns_credits_table: [
        {
          title: 'Purchase date',
          dataIndex: 'purchase_date',
          key: 'purchase_date',
          width: 100,
        },
        {
          title: 'Purchase Credits',
          dataIndex: 'purchased_credits',
          key: 'purchased_credits',
          width: 120,
        },
        {
          title: 'Price',
          dataIndex: 'price',
          key: 'price',
          width: 80,
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
          width: 120,
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          width: 100,
        },
      ],
      tableData: [
        {
          key: '1',
          plan: 'Basic',
          date: 'June 10, 2025',
          expireDate: 'Aug 10, 2025',
          payment: 'visa',
          billed: 'Yearly',
          price: 45,
          action: 'view',
          status: 'Successful',
        },
        {
          key: '2',
          plan: 'Basic',
          date: 'June 10, 2025',
          expireDate: 'Aug 10, 2025',
          payment: 'visa',
          billed: 'Yearly',
          price: 45,
          action: 'view',
          status: 'Successful',
        },
        {
          key: '3',
          plan: 'Pro',
          date: 'May 15, 2025',
          expireDate: 'July 15, 2025',
          payment: 'visa',
          billed: 'Monthly',
          price: 89,
          action: 'view',
          status: 'Successful',
        },
      ],
      tableData_subscriptions:[],
      tableData_credits:[],
    }
  },
  mounted() {
    this.fetch_my_subscriptions()
    this.fetch_my_credits()
    
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
     downloadInvoice(invoicePath) {
    const url = this.$store.state.root_media_api + invoicePath;
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop(); // file name from url
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
    formatDate(dateStr) {
    const date = new Date(dateStr); 
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  },
    async fetch_my_subscriptions(){
       try {
                this.loading = true;
                this.error = null;

            const token = localStorage.getItem('token');
                
            const response = await fetch(`${this.$store.state.root_api}subscription/api/get-my-subscriptions-history/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                    });
                  const result = await response.json();
                  // console.log(result)
                if (result) {
                    this.tableData_subscriptions = result;
                } else {
                    this.error = result.message || 'Business not found';
                }
              } catch (error) {
                console.error('Error loading business data:', error);
                if (error.response?.status === 404) {
                    this.error = 'Business not found';
                } else {
                    this.error = 'Failed to load business information';
                }
            } finally {
                this.loading = false;
            }
    },
    
    async fetch_my_credits(){
       try {
                this.loading = true;
                this.error = null;

            const token = localStorage.getItem('token');
                
            const response = await fetch(`${this.$store.state.root_api}subscription/api/get-my-credits-history/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                    });
                  const result = await response.json();
                  // console.log(result)
                if (result) {
                    this.tableData_credits = result;
                } else {
                    this.error = result.message || 'Business not found';
                }
              } catch (error) {
                console.error('Error loading business data:', error);
                if (error.response?.status === 404) {
                    this.error = 'Business not found';
                } else {
                    this.error = 'Failed to load business information';
                }
            } finally {
                this.loading = false;
            }
    },
    handleResize() {
      const isMobile = window.innerWidth <= 768;
      
      // Handle table responsiveness
      const desktopTable = document.querySelector('.desktop-table');
      const mobileCards = document.querySelector('.mobile-cards');
      
      if (isMobile) {
        if (desktopTable) desktopTable.style.display = 'none';
        if (mobileCards) mobileCards.style.display = 'block';
      } else {
        if (desktopTable) desktopTable.style.display = 'block';
        if (mobileCards) mobileCards.style.display = 'none';
      }

      // Handle subscription card responsiveness
      const mobileSubscription = document.querySelector('.mobile-subscription');
      const desktopSubscription = document.querySelector('.desktop-subscription');
      
      if (isMobile) {
        if (mobileSubscription) mobileSubscription.style.display = 'block';
        if (desktopSubscription) desktopSubscription.style.display = 'none';
      } else {
        if (mobileSubscription) mobileSubscription.style.display = 'none';
        if (desktopSubscription) desktopSubscription.style.display = 'flex';
      }
    },
    handleUpgrade() {
      console.log('Upgrade clicked');
    },
    handleBuyCredits() {
      console.log('Buy credits clicked');
    },
    handleCancelSubscription() {
      console.log('Cancel subscription clicked');
    }
  }
}
</script>

<style scoped>
/* Mobile First Responsive Design */
@media (max-width: 768px) {
  .desktop-table {
    display: none !important;
  }
  .mobile-cards {
    display: block !important;
  }
  .mobile-subscription {
    display: block !important;
  }
  .desktop-subscription {
    display: none !important;
  }
  
  .credits-info {
    flex-direction: column !important;
    align-items: center !important;
    text-align: center;
  }
  
  .subscription-card {
    min-height: 200px !important;
  }
}

@media (min-width: 769px) {
  .desktop-table {
    display: block !important;
  }
  .mobile-cards {
    display: none !important;
  }
  .mobile-subscription {
    display: none !important;
  }
  .desktop-subscription {
    display: flex !important;
  }
}

/* Tablet adjustments */
@media (max-width: 992px) and (min-width: 769px) {
  .desktop-subscription > div:first-child {
    width: 60% !important;
    padding: 20px !important;
  }
}

/* Small mobile devices */
@media (max-width: 480px) {
  .subscription-card {
    border-radius: 15px !important;
    padding: 6px !important;
  }
  
  .mobile-subscription {
    padding: 16px !important;
  }
}

/* Ensure proper text scaling */
@supports (font-size: clamp(1rem, 4vw, 1.5rem)) {
  .subscription-card h1,
  .subscription-card h3 {
    line-height: 1.2;
  }
}
</style>