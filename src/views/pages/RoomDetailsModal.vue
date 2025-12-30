<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-[1001] flex items-center justify-center bg-black/50 p-4"
        @click="$emit('close')"
      >
        <div
          class="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[100vh] overflow-y-auto"
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
          <div class="p-6 space-y-6">
            <!-- Room Info Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <span class="font-medium" :class="room.is_favorited ? 'text-green-600' : 'text-gray-400'">
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

                <!-- Loading State -->
                <div v-if="loading" class="pt-4 text-center">
                  <span class="text-sm text-gray-500">Loading final results...</span>
                </div>

                <!-- Final Results Section -->
                <div v-if="!loading && finalResults" class="pt-4 border-t border-gray-100 space-y-3">
                  <div>
                    <span class="text-gray-500 text-sm block mb-1">Room Type</span>
                    <span class="font-medium text-gray-900">{{ finalResults.room_type || 'N/A' }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500 text-sm block mb-1">Design Type</span>
                    <span class="font-medium text-gray-900">{{ finalResults.room_design_type || 'N/A' }}</span>
                  </div>
                </div>

                <!-- Error State -->
                <div v-if="error" class="pt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <span class="text-sm text-red-700">{{ error }}</span>
                </div>
              </div>
            </div>

            <!-- Products Used Section -->
            <div v-if="!loading && finalResults && finalResults.products_used && finalResults.products_used.length > 0" class="border-t border-gray-100 pt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Products Used ({{ finalResults.products_used.length }})</h3>
              <BusinessProductsSailing :products="finalResults.products_used" />
            </div>

            <!-- Empty State -->
            <div v-if="!loading && finalResults && (!finalResults.products_used || finalResults.products_used.length === 0)" class="text-center py-8">
              <span class="text-gray-500">No products used in this room</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3">
            <button 
              v-if="!loading && !finalResults"
              @click="fetchFinalResults"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Show products
            </button>
            <!-- <button 
              @click="$emit('close')"
              class="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Close
            </button> -->
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
import BusinessProductsSailing from '@/components/general_user/buisness_page/products_sailing.vue'

export default {
  name: 'RoomDetailsModal',
  components: {
    BusinessProductsSailing
  },
  props: {
    visible: { type: Boolean, default: false },
    room: { type: Object, default: () => ({}) },
    mediaBase: { type: String, required: true }
  },
  data() {
    return {
      loading: false,
      error: null,
      finalResults: null
    }
  },
  methods: {
    formatDateShort(iso) {
      if (!iso) return 'N/A'
      return new Date(iso).toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
      })
    },
    async fetchFinalResults() {
      console.log("📡 Fetching final results...");
      this.loading = true;
      this.error = null;
      try {
        const roomId = this.room.id;
        console.log("🔗 Room ID:", roomId);
        
        if (!roomId) {
          throw new Error("Room ID is undefined");
        }
        
        const url = `${this.$store.state.root_api}engine/render-final-result/${roomId}`;
        console.log("🔗 Full URL:", url);
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });

        console.log("📊 Response Status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log("✅ Response Data:", responseData);

        if (responseData) {
          this.finalResults = {
            products_used: responseData.products_used || [],
            room_type: responseData.room_type || '',
            room_design_type: responseData.room_design_type || ''
          };
          console.log("🎉 Final Results Stored:", this.finalResults);
          console.log("📦 Products Count:", this.finalResults.products_used.length);
        }
      } catch (error) {
        console.warn("⚠️ Could not fetch final results:", error.message);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
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