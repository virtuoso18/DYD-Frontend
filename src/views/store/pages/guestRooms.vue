<template>
  <a-row :gutter="[16, 16]" class="mb-6">
    <a-col :span="24">
      <div class="table-card">
        <div class="table-header">
          <h3>{{ t('guest_rooms.title') }}</h3>
        </div>

        <!-- Search Filter -->
        <div style="margin-bottom: 16px; display: flex; gap: 16px; flex-wrap: wrap;">
          <a-input-search
            v-model:value="searchQuery"
            :placeholder="t('guest_rooms.filters.search')"
            style="width: 280px"
            allow-clear
            @search="onSearch"
            @change="onSearchChange"
          />
        </div>

        <!-- Guest Rooms Table -->
        <a-table
          :columns="roomColumns"
          :data-source="roomsData"
          row-key="id"
          :pagination="roomsPagination"
          :scroll="{ x: 700 }"
          :loading="roomsLoading"
          style="background: white; border-radius: 8px; overflow: hidden;"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record, index }">

            <template v-if="column.key === 'serial'">
              <span style="font-weight: 600; color: #666;">
                {{ (roomsPagination.current - 1) * roomsPagination.pageSize + index + 1 }}
              </span>
            </template>

            <template v-if="column.key === 'image'">
              <img
                :src="getImageUrl(record.image)"
                width="56"
                height="56"
                style="border-radius: 8px; object-fit: cover; border: 1px solid #e5e7eb;"
                @error="onImgError"
              />
            </template>

            <template v-if="column.key === 'room_id'">
              <a-tag color="default" style="font-family: monospace; font-size: 12px;">
                #{{ record.id }}
              </a-tag>
            </template>

            <!-- <template v-if="column.key === 'used_products'">
              <a-tag color="blue" style="font-weight: 600;">
                {{ record.used_products }}
              </a-tag>
            </template>

            <template v-if="column.key === 'status'">
              <a-badge
                :status="record.is_active ? 'success' : 'error'"
                :text="record.is_active ? t('guest_rooms.status.active') : t('guest_rooms.status.inactive')"
              />
            </template> -->

            <template v-if="column.key === 'created_at'">
              <span style="color: #4b5563; font-size: 13px;">{{ formatDate(record.created_at) }}</span>
            </template>

            <template v-if="column.key === 'updated_at'">
              <span style="color: #9ca3af; font-size: 13px;">{{ formatDate(record.updated_at) }}</span>
            </template>

          </template>
        </a-table>

      </div>
    </a-col>
  </a-row>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'GuestCreatedRooms',

  setup() {
    const { t, locale } = useI18n()
    return { t, locale }
  },

  data() {
    return {
      // ── Rooms List ──────────────────────────────────────────────────────────
      roomsData: [],
      roomsLoading: false,
      searchQuery: '',
      searchDebounceTimer: null,

      roomsPagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) =>
          `${this.t('guest_rooms.pagination.total')} ${total} ${this.t('guest_rooms.pagination.records')}`,
      },

      roomColumns: [],
    }
  },

  mounted() {
    this.buildColumns()
    this.fetchRooms()
  },

  watch: {
    locale: {
      handler() {
        this.buildColumns()
        this.roomsPagination.showTotal = (total) =>
          `${this.t('guest_rooms.pagination.total')} ${total} ${this.t('guest_rooms.pagination.records')}`
      },
      deep: true,
    },
  },

  methods: {
    // ── Column builder (called on mount + locale change) ───────────────────
    buildColumns() {
      this.roomColumns = [
        { title: '#',                                           key: 'serial',        width: 60 },
        { title: this.t('guest_rooms.table.image'),            key: 'image',         width: 90 },
        { title: this.t('guest_rooms.table.room_id'),          key: 'room_id',       width: 100 },
        // { title: this.t('guest_rooms.table.used_products'),    key: 'used_products', dataIndex: 'used_products', width: 140 },
        // { title: this.t('guest_rooms.table.status'),           key: 'status',        width: 120 },
        { title: this.t('guest_rooms.table.created_at'),       key: 'created_at',    dataIndex: 'created_at' },
        { title: this.t('guest_rooms.table.updated_at'),       key: 'updated_at',    dataIndex: 'updated_at' },
      ]
    },

    // ── Image helpers ───────────────────────────────────────────────────────
    getImageUrl(imagePath) {
      if (!imagePath) return 'https://placehold.co/56x56?text=N/A'
      // If already absolute URL, return as-is; otherwise prepend media root
      if (imagePath.startsWith('http')) return imagePath
      return `${this.$store.state.root_media_api}${imagePath}`
    },

    onImgError(e) {
      e.target.src = 'https://placehold.co/56x56?text=N/A'
    },

    // ── Search ─────────────────────────────────────────────────────────────
    onSearch() {
      this.roomsPagination.current = 1
      this.fetchRooms()
    },

    onSearchChange() {
      // Debounce so we don't hammer the API on every keystroke
      clearTimeout(this.searchDebounceTimer)
      this.searchDebounceTimer = setTimeout(() => {
        this.roomsPagination.current = 1
        this.fetchRooms()
      }, 400)
    },

    // ── Fetch Rooms ─────────────────────────────────────────────────────────
    async fetchRooms() {
      this.roomsLoading = true
      try {
        const params = new URLSearchParams()
        params.append('limit', this.roomsPagination.pageSize)
        params.append('offset', (this.roomsPagination.current - 1) * this.roomsPagination.pageSize)

        if (this.searchQuery?.trim()) {
          params.append('search', this.searchQuery.trim())
        }

        const response = await fetch(
          `${this.$store.state.root_api}Auth/api/guest-created-rooms/?${params}`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem('token')}`,
            },
          }
        )

        const json = await response.json()

        // API wraps payload: { count, results: { success, data, message } }
        this.roomsData = json.results?.data || json.data || []
        this.roomsPagination.total = json.count || 0
      } catch (error) {
        console.error('Error fetching guest created rooms:', error)
        this.roomsData = []
      } finally {
        this.roomsLoading = false
      }
    },

    // ── Table pagination / sort change ──────────────────────────────────────
    onTableChange(pagination) {
      this.roomsPagination.current = pagination.current
      this.roomsPagination.pageSize = pagination.pageSize
      this.fetchRooms()
    },

    // ── Date formatter ──────────────────────────────────────────────────────
    formatDate(dateStr) {
      if (!dateStr) return '-'
      const d = new Date(dateStr)
      return d.toLocaleDateString('he-IL', {
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