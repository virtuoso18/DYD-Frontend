<template>
  <!-- ── Desktop: a-modal ── -->
  <a-modal
    v-if="!isMobile"
    :open="visible"
    :footer="null"
    :width="960"
    :destroy-on-close="true"
    centered
    @cancel="$emit('close')"
  >
    <template #title>
      <a-space>
        <HomeOutlined />
        <span style="font-weight:600; font-size:16px;">Room Details</span>
      </a-space>
    </template>

    <!-- shared body -->
    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :md="12">
        <div style="border-radius:18px; overflow:hidden; border:1px solid #f0f0f0;">
          <a-image
            :src="mediaBase + room.image"
            :alt="room.name || 'Room image'"
            width="100%"
            style="height:auto; object-fit:cover; display:block;"
          />
        </div>
<br>
        <div style="margin-top:14px; display:flex; flex-wrap:wrap; gap:8px;">
          <a-tag v-if="room.category" color="blue">
            <template #icon><AppstoreOutlined /></template>
            {{ room.category }}
          </a-tag>
          <a-tag v-if="room.type" color="purple">{{ room.type }}</a-tag>
          <a-tag v-if="room.is_favorited" color="gold">
            <template #icon><StarFilled /></template>
            Favorited
          </a-tag>
          <a-tag v-if="finalResults && finalResults.room_type" color="green">
            🏠 {{ finalResults.room_type }}
          </a-tag>
          <a-tag v-if="finalResults && finalResults.room_design_type" color="magenta">
            <template #icon><FormatPainterOutlined /></template>
            {{ finalResults.room_design_type }}
          </a-tag>
        </div>

        <a-divider style="margin:16px 0;" />

        <a-space>
          <CalendarOutlined style="color:#8c8c8c;" />
          <span style="color:#8c8c8c; font-size:13px;">Added</span>
          <span style="font-weight:600; font-size:13px;">{{ formatDateShort(room.added_at) }}</span>
        </a-space>
      </a-col>

      <a-col :xs="24" :md="12">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid #f0f0f0;">
          <span style="font-size:15px; font-weight:600;">Products Used</span>
          <a-tag v-if="finalResults && finalResults.products_used" style="margin:0;">
            {{ finalResults.products_used.length }}
          </a-tag>
        </div>

        <div v-if="loading" style="display:flex; flex-direction:column; align-items:center; padding:60px 0; gap:12px;">
          <a-spin size="large" />
          <span style="color:#8c8c8c; font-size:13px;">Loading products...</span>
        </div>

        <div
          v-else-if="finalResults && finalResults.products_used && finalResults.products_used.length"
          style="max-height:550px; overflow-y:auto;"
        >
          <BusinessProductsSailing :products="finalResults.products_used" />
        </div>

        <a-empty
          v-else-if="finalResults && (!finalResults.products_used || !finalResults.products_used.length)"
          description="No products found for this room"
          style="padding:48px 0;"
        />

        <a-alert v-if="error" type="error" :message="error" show-icon style="margin-top:12px;" />
      </a-col>
    </a-row>
  </a-modal>

  <!-- ── Mobile: a-drawer from bottom ── -->
  <a-drawer
    v-else
    :open="visible"
    placement="bottom"
    :height="'92vh'"
    
    :closable="true"
    :destroy-on-close="true"
    @close="$emit('close')"
  >
    <template #title>
      <a-space>
        <HomeOutlined />
        <span style="font-weight:600; font-size:16px;">Room Details</span>
      </a-space>
    </template>

    <!-- same body repeated for drawer -->
    <a-row :gutter="[16, 16]" >
      <a-col :span="24" style="padding:0px;">
        <div style="border-radius:18px; overflow:hidden; border:1px solid #f0f0f0;">
          <a-image
            :src="mediaBase + room.image"
            :alt="room.name || 'Room image'"
            width="100%"
            style="height:auto; object-fit:cover; display:block;"
          />
        </div>
<br>
        <div style="margin-top:12px; display:flex; flex-wrap:wrap; gap:8px;">
          <a-tag v-if="room.category" color="blue">
            <template #icon><AppstoreOutlined /></template>
            {{ room.category }}
          </a-tag>
          <a-tag v-if="room.type" color="purple">{{ room.type }}</a-tag>
          <a-tag v-if="room.is_favorited" color="gold">
            <template #icon><StarFilled /></template>
            Favorited
          </a-tag>
          <a-tag v-if="finalResults && finalResults.room_type" color="green">
            🏠 {{ finalResults.room_type }}
          </a-tag>
          <a-tag v-if="finalResults && finalResults.room_design_type" color="magenta">
            <template #icon><FormatPainterOutlined /></template>
            {{ finalResults.room_design_type }}
          </a-tag>
        </div>

        <a-divider style="margin:12px 0;" />

        <a-space>
          <CalendarOutlined style="color:#8c8c8c;" />
          <span style="color:#8c8c8c; font-size:13px;">Added</span>
          <span style="font-weight:600; font-size:13px;">{{ formatDateShort(room.added_at) }}</span>
        </a-space>
      </a-col>

      <a-col :span="24"style="padding:0px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; padding-bottom:10px; border-bottom:1px solid #f0f0f0;">
          <span style="font-size:15px; font-weight:600;">Products Used</span>
          <a-tag v-if="finalResults && finalResults.products_used" style="margin:0;">
            {{ finalResults.products_used.length }}
          </a-tag>
        </div>

        <div v-if="loading" style="display:flex; flex-direction:column; align-items:center; padding:48px 0; gap:12px;">
          <a-spin size="large" />
          <span style="color:#8c8c8c; font-size:13px;">Loading products...</span>
        </div>

        <div
          v-else-if="finalResults && finalResults.products_used && finalResults.products_used.length"
        >
          <BusinessProductsSailing :products="finalResults.products_used" />
        </div>

        <a-empty
          v-else-if="finalResults && (!finalResults.products_used || !finalResults.products_used.length)"
          description="No products found for this room"
          style="padding:40px 0;"
        />

        <a-alert v-if="error" type="error" :message="error" show-icon style="margin-top:12px;" />
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script>
import {
  HomeOutlined,
  AppstoreOutlined,
  StarFilled,
  FormatPainterOutlined,
  CalendarOutlined
} from '@ant-design/icons-vue'
import BusinessProductsSailing from '@/components/general_user/buisness_page/liked_products_sailing.vue'

export default {
  name: 'RoomDetailsModal',

  components: {
    HomeOutlined,
    AppstoreOutlined,
    StarFilled,
    FormatPainterOutlined,
    CalendarOutlined,
    BusinessProductsSailing
  },

  props: {
    visible:   { type: Boolean, default: false },
    room:      { type: Object,  default: () => ({}) },
    mediaBase: { type: String,  required: true }
  },

  emits: ['close'],

  data() {
    return {
      loading:      false,
      error:        null,
      finalResults: null,
      isMobile:     false
    }
  },

  mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
    if (this.visible) this.fetchFinalResults()
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },

  watch: {
    visible(val, old) {
      if (val && !old) {
        this.finalResults = null
        this.error        = null
        this.$nextTick(() => this.fetchFinalResults())
      }
    }
  },

  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth < 768
    },

    formatDateShort(iso) {
      if (!iso) return 'N/A'
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      })
    },

    async fetchFinalResults() {
      const roomId = this.room?.id
      if (!roomId) return

      this.loading = true
      this.error   = null

      try {
        const url = `${this.$store.state.root_api}engine/render-final-result/${roomId}`
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('token')}`
          }
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        const data = await res.json()
        this.finalResults = {
          products_used:    data.products_used    || [],
          room_type:        data.room_type        || '',
          room_design_type: data.room_design_type || ''
        }
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>