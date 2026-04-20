<template>
  <a-row :gutter="[16, 16]" class="mb-6">
    <a-col :span="24">
      <div class="table-card">
        <div class="table-header">
          <h3>Room Contacts</h3>
        </div>

        <!-- Search Filter -->
        <div style="margin-bottom: 16px; display: flex; gap: 16px; flex-wrap: wrap;">
          <a-input-search
            v-model:value="searchQuery"
            placeholder="Search by name or email..."
            style="width: 280px"
            allow-clear
            @search="onSearch"
            @change="onSearchChange"
          />
        </div>

        <!-- Room Contacts Table -->
        <a-table
          :columns="columns"
          :data-source="contactsData"
          row-key="id"
          :pagination="pagination"
          :scroll="{ x: 700 }"
          :loading="isLoading"
          style="background: white; border-radius: 8px; overflow: hidden;"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record, index }">

            <template v-if="column.key === 'serial'">
              <span style="font-weight: 600; color: #666;">
                {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
              </span>
            </template>

            <template v-if="column.key === 'full_name'">
              <span style="font-weight: 500; color: #111827;">{{ record.full_name }}</span>
            </template>

            <template v-if="column.key === 'room_id'">
              <a-tag color="default" style="font-family: monospace; font-size: 12px;">
                #{{ record.room_id }}
              </a-tag>
            </template>

            
            <template v-if="column.key === 'created_at'">
              <span style="color: #4b5563; font-size: 13px;">{{ formatDate(record.created_at) }}</span>
            </template>

          </template>
        </a-table>

      </div>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'RoomContactList',

  data() {
    return {
      contactsData: [],
      isLoading: false,
      searchQuery: '',
      searchDebounceTimer: null,

      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} records`,
      },

      columns: [
        { title: '#',               key: 'serial',         width: 60  },
        { title: 'Full Name',       key: 'full_name',      width: 180 },
        { title: 'Email',           key: 'email',          dataIndex: 'email',          width: 220 },
        { title: 'Contact Number',  key: 'contact_number', dataIndex: 'contact_number', width: 160 },
        { title: 'Room',            key: 'room_id',        width: 100 },
   
        { title: 'Created At',      key: 'created_at',     dataIndex: 'created_at'      },
      ],
    }
  },

  mounted() {
    this.fetchContacts()
  },

  methods: {
    onSearch() {
      this.pagination.current = 1
      this.fetchContacts()
    },

    onSearchChange() {
      clearTimeout(this.searchDebounceTimer)
      this.searchDebounceTimer = setTimeout(() => {
        this.pagination.current = 1
        this.fetchContacts()
      }, 400)
    },

    async fetchContacts() {
      this.isLoading = true
      try {
        const params = new URLSearchParams()
        params.append('limit', this.pagination.pageSize)
        params.append('offset', (this.pagination.current - 1) * this.pagination.pageSize)

        if (this.searchQuery?.trim()) {
          params.append('search', this.searchQuery.trim())
        }

        const response = await fetch(
          `${this.$store.state.root_api}Auth/api/room-contacts/?${params}`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem('token')}`,
            },
          }
        )

        const json = await response.json()

        this.contactsData = json.results?.data || json.data || []
        this.pagination.total = json.count || 0
      } catch (error) {
        console.error('Error fetching room contacts:', error)
        this.contactsData = []
      } finally {
        this.isLoading = false
      }
    },

    onTableChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.fetchContacts()
    },

    formatDate(dateStr) {
      if (!dateStr) return '-'
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
  },
}
</script>