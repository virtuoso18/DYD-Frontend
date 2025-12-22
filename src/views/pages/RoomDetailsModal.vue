<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-[1001] flex items-center justify-center bg-black/50 p-4"
        @click="$emit('close')"
      >
        <div
          class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[100vh] overflow-y-auto"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900">Room Details</h2>
            <button 
              @click="$emit('close')" 
              class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
          </div>

          <!-- Content Grid -->
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Image -->
            <div>
              <img
                :src="mediaBase + room.image"
                :alt="room.name || 'Room image'"
                class="w-full h-48 md:h-56 object-cover rounded-xl shadow-md"
              />
            </div>

            <!-- Details -->
            <div class="space-y-4">
              <!-- Category Badge -->
              <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {{ room.category || 'Room' }}
              </div>

              <!-- Key Info Grid -->
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-500 block">Type</span>
                  <span class="font-medium text-gray-900">{{ room.type || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-gray-500 block">Favorited</span>
                  <span class="font-medium {{ room.is_favorited ? 'text-green-600' : 'text-gray-400' }}">
                    {{ room.is_favorited ? 'Yes' : 'No' }}
                  </span>
                </div>
                <div>
                  <span class="text-gray-500 block">Added</span>
                  <span class="font-medium text-gray-900">{{ formatDateShort(room.added_at) }}</span>
                </div>
                <div>
                  <span class="text-gray-500 block">ID</span>
                  <span class="font-mono text-xs text-gray-500">{{ room.id?.slice(0,8) || 'N/A' }}...</span>
                </div>
              </div>

              <!-- Name -->
              <div class="pt-2 border-t border-gray-100">
                <span class="text-gray-500 text-sm block mb-1">Name</span>
                <span class="font-semibold text-lg text-gray-900 block">{{ room.name || 'Unnamed Room' }}</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <a-button 
              size="large" 
              block 
              @click="$emit('close')"
              class="bg-gray-900 hover:bg-gray-800 text-white border-none"
            >
              Close
            </a-button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
export default {
  name: 'RoomDetailsModal',
  props: {
    visible: { type: Boolean, default: false },
    room: { type: Object, default: () => ({}) },
    mediaBase: { type: String, required: true }
  },
  methods: {
    formatDateShort(iso) {
      if (!iso) return 'N/A'
      return new Date(iso).toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
      })
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
