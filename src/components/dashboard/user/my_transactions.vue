<template>
  <div style="padding: 24px; background: white; min-height: 100vh;border-radius:20px;border: 2px solid rgba(0,0,0,0.1); margin-top:15px;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <!-- Header Section -->
      <a-row justify="space-between" align="middle" style="margin-bottom: 24px;">
        <a-col :xs="24" :sm="12" :md="12" :lg="8">
          <h2 style="margin: 0; color: #262626; font-size: 24px; font-weight: 600;">
            Transactions
          </h2>
        </a-col>
        <a-col :xs="24" :sm="12" :md="8" :lg="6" style="text-align: right;">
          <a-input-search 
            placeholder="Search" 
            style="border-radius: 20px; background: #f0f0f0;"
            :bordered="false"
            size="large"
          />
        </a-col>
      </a-row>

      <!-- Table Section -->
      <a-row>
        <a-col span="24">
          <div style="background: white; border-radius: 12px; ; overflow: hidden;">
            <!-- Desktop Table -->
            <div style="display: block;" class="desktop-table">
              <a-table 
                :columns="columns" 
                :data-source="tableData" 
                :pagination="{ pageSize: 10, showSizeChanger: false, showQuickJumper: false }"
                :show-header="true"
                size="large"
                style="border-radius: 12px;"
              >
                <!-- Custom columns -->
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'id'">
                    <span style="font-weight: 500; color: #262626;">{{ record.id }}</span>
                  </template>
                  
                  <template v-if="column.key === 'date'">
                    <span style="color: #595959;">{{ record.date }}</span>
                  </template>
                  
                  <template v-if="column.key === 'payment'">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' rx='2' fill='%231A1F71'/%3E%3Cpath d='M8.5 4.5h7v7h-7z' fill='%23fff'/%3E%3C/svg%3E" alt="Visa" style="width: 24px; height: 16px;" />
                      <span style="color: #595959;">Debit Card</span>
                    </div>
                  </template>
                  
                  <template v-if="column.key === 'amount'">
                    <span style="color: #1890ff; font-weight: 600; font-size: 16px;">${{ record.amount }}</span>
                  </template>
                  
                  <template v-if="column.key === 'status'">
                    <span style="color: #52c41a; font-weight: 500;">{{ record.status }}</span>
                  </template>
                </template>
              </a-table>
            </div>

            <!-- Mobile Cards -->
            <div style="display: none; padding: 16px;" class="mobile-cards">
              <div 
                v-for="record in tableData" 
                :key="record.key"
                style="background: #fafafa; border-radius: 12px; padding: 16px; margin-bottom: 16px; border: 1px solid #f0f0f0;"
              >
                <a-row justify="space-between" align="top" style="margin-bottom: 12px;">
                  <a-col span="12">
                    <div style="font-weight: 600; color: #262626; font-size: 16px;">
                      ID: {{ record.id }}
                    </div>
                    <div style="color: #8c8c8c; font-size: 14px; margin-top: 4px;">
                      {{ record.date }}
                    </div>
                  </a-col>
                  <a-col span="12" style="text-align: right;">
                    <div style="color: #1890ff; font-weight: 600; font-size: 18px;">
                      ${{ record.amount }}
                    </div>
                    <div style="color: #52c41a; font-weight: 500; margin-top: 4px;">
                      {{ record.status }}
                    </div>
                  </a-col>
                </a-row>
                
                <a-row align="middle">
                  <a-col span="24">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' rx='2' fill='%231A1F71'/%3E%3Cpath d='M8.5 4.5h7v7h-7z' fill='%23fff'/%3E%3C/svg%3E" alt="Visa" style="width: 24px; height: 16px;" />
                      <span style="color: #595959; font-size: 14px;">Debit Card</span>
                    </div>
                  </a-col>
                </a-row>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransactionsTable',
  data() {
    return {
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: '15%',
          sorter: true,
        },
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
          width: '20%',
          sorter: true,
        },
        {
          title: 'Payment method',
          dataIndex: 'payment',
          key: 'payment',
          width: '25%',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
          width: '15%',
          align: 'right',
          sorter: true,
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          width: '15%',
          sorter: true,
        },
      ],
      tableData: [
        {
          key: '1',
          id: '16355498',
          date: 'June 10, 2025',
          payment: 'visa',
          amount: 45,
          status: 'Successful',
        },
        {
          key: '2',
          id: '16355498',
          date: 'June 10, 2025',
          payment: 'visa',
          amount: 45,
          status: 'Successful',
        },
        {
          key: '3',
          id: '16355498',
          date: 'June 10, 2025',
          payment: 'visa',
          amount: 45,
          status: 'Successful',
        },
        {
          key: '4',
          id: '16355498',
          date: 'June 10, 2025',
          payment: 'visa',
          amount: 45,
          status: 'Successful',
        },
        {
          key: '5',
          id: '16355498',
          date: 'June 10, 2025',
          payment: 'visa',
          amount: 45,
          status: 'Successful',
        },
        {
          key: '6',
          id: '16355498',
          date: 'June 10, 2025',
          payment: 'visa',
          amount: 45,
          status: 'Successful',
        },
        {
          key: '7',
          id: '16355498',
          date: 'June 10, 2025',
          payment: 'visa',
          amount: 45,
          status: 'Successful',
        },
      ]
    }
  },
  mounted() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      const isMobile = window.innerWidth <= 768;
      const desktopTable = document.querySelector('.desktop-table');
      const mobileCards = document.querySelector('.mobile-cards');
      
      if (isMobile) {
        if (desktopTable) desktopTable.style.display = 'none';
        if (mobileCards) mobileCards.style.display = 'block';
      } else {
        if (desktopTable) desktopTable.style.display = 'block';
        if (mobileCards) mobileCards.style.display = 'none';
      }
    }
  }
}
</script>

<style scoped>
@media (max-width: 768px) {
  .desktop-table {
    display: none !important;
  }
  .mobile-cards {
    display: block !important;
  }
}

@media (min-width: 769px) {
  .desktop-table {
    display: block !important;
  }
  .mobile-cards {
    display: none !important;
  }
}
</style>