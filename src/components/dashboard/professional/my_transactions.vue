<template>
  <div className="md:pt-3 ">

    <div class=" bg-white min-h-screen p-3 !rounded-2xl  border-black/10 mt-4">
      <div class="max-w-6xl mx-auto">
        <!-- Header Section -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 class="text-2xl font-semibold text-gray-900">
            Transactions
          </h2>
          <div class="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search"
              v-model="searchQuery"
              class="w-full px-4 py-2 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
  
        <!-- Table (Desktop and Mobile) -->
        <div class="overflow-x-auto bg-white rounded-xl">
          <table class="w-full text-left text-xs md:text-sm min-w-max">
            <!-- Table Header -->
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-1 font-semibold text-gray-900  md:w-32 cursor-pointer hover:bg-gray-100" @click="sortBy('id')">
                  <div class="flex items-center gap-1">
                    ID
                    <span v-if="sortField === 'id'" class="text-blue-600">
                      {{ sortOrder === 'asc' ? '↑' : '↓' }}
                    </span>
                  </div>
                </th>
                <th class="px-6 py-4 font-semibold text-gray-900 md:w-40 cursor-pointer hover:bg-gray-100" @click="sortBy('date')">
                  <div class="flex items-center gap-1">
                    Date
                    <span v-if="sortField === 'date'" class="text-blue-600">
                      {{ sortOrder === 'asc' ? '↑' : '↓' }}
                    </span>
                  </div>
                </th>
                <th class="px-4 py-4 font-semibold text-gray-900 md:w-44">Payment Method</th>
                <th class="px-2 py-4 font-semibold text-gray-900 text-right md:w-32 cursor-pointer hover:bg-gray-100" @click="sortBy('amount')">
                  <div class="flex items-center justify-end gap-1">
                    Amount
                    <span v-if="sortField === 'amount'" class="text-blue-600">
                      {{ sortOrder === 'asc' ? '↑' : '↓' }}
                    </span>
                  </div>
                </th>
                <th class="px-6 py-4 font-semibold text-gray-900 w-32 cursor-pointer hover:bg-gray-100" @click="sortBy('status')">
                  <div class="flex items-center gap-1">
                    Status
                    <span v-if="sortField === 'status'" class="text-blue-600">
                      {{ sortOrder === 'asc' ? '↑' : '↓' }}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
  
            <!-- Table Body -->
            <tbody class="divide-y divide-gray-200">
              <tr 
                v-for="transaction in sortedAndFilteredTransactions"
                :key="transaction.key"
                class="hover:bg-gray-50 transition-colors"
              >
                <!-- ID -->
                <td class="px-2 md:px-6 py-2">
                  <span class="font-medium text-gray-900">
                    {{ transaction.id.slice(-8) }}
                  </span>
                </td>
  
                <!-- Date -->
                <td class=" px-2 md:px-6 py-4">
                  <span class="text-gray-600">
                    {{ formatDate(transaction.date) }}
                  </span>
                </td>
  
                <!-- Payment Method -->
                <td class="px-2 md:px-6 py-4">
                  <div class="flex items-center gap-2">
                    <img 
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' rx='2' fill='%231A1F71'/%3E%3Cpath d='M8.5 4.5h7v7h-7z' fill='%23fff'/%3E%3C/svg%3E" 
                      alt="Visa"
                      class="w-6 h-4"
                    />
                    <span class="text-gray-600">Debit Card</span>
                  </div>
                </td>
  
                <!-- Amount -->
                <td class="px-2 md:px-6 py-2 md:py-4 ">
                  <span class="font-semibold text-blue-600 md:text-base">
                    ${{ transaction.amount }}
                  </span>
                </td>
  
                <!-- Status -->
                <td class="px-2 md:px-6 py-4">
                  <span class="font-medium text-green-600">
                    {{ transaction.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
  
          <!-- Loading State -->
          <div v-if="loading && sortedAndFilteredTransactions.length === 0" class="flex items-center justify-center py-12">
            <p class="text-gray-500">Loading transactions...</p>
          </div>
        </div>
  
        <!-- Empty State -->
        <div v-if="sortedAndFilteredTransactions.length === 0 && !loading" class="text-center py-12">
          <p class="text-gray-500">No transactions found</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransactionsTable',
  data() {
    return {
      searchQuery: '',
      loading: false,
      sortField: 'date',
      sortOrder: 'desc',
      tableData:[],
      
    }
  },
  computed: {
    filteredTransactions() {
      if (!this.searchQuery) return this.tableData
      return this.tableData.filter(transaction =>
        transaction.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        transaction.date.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    },
    sortedAndFilteredTransactions() {
      const sorted = [...this.filteredTransactions].sort((a, b) => {
        let aVal = a[this.sortField]
        let bVal = b[this.sortField]

        // Handle date comparison
        if (this.sortField === 'date') {
          aVal = new Date(aVal).getTime()
          bVal = new Date(bVal).getTime()
        }

        // Handle numeric comparison
        if (this.sortField === 'amount' || this.sortField === 'id') {
          aVal = parseInt(aVal)
          bVal = parseInt(bVal)
        }

        if (aVal < bVal) return this.sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return this.sortOrder === 'asc' ? 1 : -1
        return 0
      })

      return sorted
    }
  },
  mounted() {
    this.fetch_my_transactions()
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    sortBy(field) {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortOrder = 'asc'
      }
    },
    async fetch_my_transactions() {
      try {
        this.loading = true
        const token = localStorage.getItem('token')

        const response = await fetch(
          `${this.$store.state.root_api}subscription/api/get-my-transactions-history/`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        const result = await response.json()

        if (result && Array.isArray(result)) {
          this.tableData = result
        }
      } catch (error) {
        console.error('Error loading transactions:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
