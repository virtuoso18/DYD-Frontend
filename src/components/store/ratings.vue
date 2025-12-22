<template>
  <Teleport to="body">
    <transition name="modal">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs p-4"
        style="background-color: rgba(0, 0, 0, 0.5);"
        @click="closeModal"
      >
        <!-- Desktop Modal -->
        <div 
          class="hidden md:flex bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex-col"
          @click.stop
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">Rate This Business</h2>
            <button 
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 transition"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="px-6 py-8 flex flex-col items-center">
            <h3 class="text-2xl font-bold text-gray-900 mb-2 text-center">
              Rate your experience
            </h3>
            <p class="text-gray-600 mb-6 text-center">How was your experience with this business?</p>

            <!-- Star Rating -->
            <div class="flex gap-2 mb-8">
              <button
                v-for="star in 5"
                :key="star"
                @click="setRating(star)"
                @mouseenter="hoverRating = star"
                @mouseleave="hoverRating = 0"
                class="transition-transform hover:scale-110 focus:outline-none"
              >
                <svg 
                  class="w-14 h-14"
                  :fill="star <= (hoverRating || selectedRating) ? '#FFC107' : '#E5E7EB'"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </button>
            </div>

            <!-- Rating Text -->
            <p class="text-gray-700 font-medium mb-6">
              {{ getRatingText() }}
            </p>

            <!-- Comment Box -->
            <textarea
              v-model="review"
              placeholder="Share your thoughts about this business... (optional)"
              class="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
              :disabled="submitting"
            ></textarea>
            <p class="text-xs text-gray-400 self-start mt-1">{{ review.length }} / 500</p>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex gap-4">
            <button
              @click="closeModal"
              class="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
              :disabled="submitting"
            >
              Skip
            </button>
            <button
              @click="submitRating"
              :disabled="selectedRating === 0 || submitting"
              class="flex-1 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg font-medium transition"
              style="color:white"
            >
              {{ submitting ? 'Submitting...' : 'Submit Rating' }}
            </button>
          </div>
        </div>

        <!-- Mobile Modal -->
        <div 
          class="md:hidden bg-white rounded-t-3xl w-full max-h-[95vh] flex flex-col absolute bottom-0 left-0 right-0"
          @click.stop
        >
          <!-- Handle -->
          <div class="flex justify-center py-3 border-b border-gray-200">
            <div class="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <!-- Header -->
          <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Rate This Business</h2>
            <button 
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto px-4 py-6">
            <div class="flex flex-col items-center">
              <h3 class="text-xl font-bold text-gray-900 mb-2 text-center">
                Rate your experience
              </h3>
              <p class="text-gray-600 mb-6 text-center">How was your experience with this business?</p>

              <!-- Star Rating -->
              <div class="flex gap-1 mb-6">
                <button
                  v-for="star in 5"
                  :key="star"
                  @click="setRating(star)"
                  class="transition-transform active:scale-95 focus:outline-none"
                >
                  <svg 
                    class="w-12 h-12"
                    :fill="star <= selectedRating ? '#FFC107' : '#E5E7EB'"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </button>
              </div>

              <!-- Rating Text -->
              <p class="text-gray-700 font-medium mb-4 text-center">
                {{ getRatingText() }}
              </p>

              <!-- Comment Box -->
              <textarea
                v-model="review"
                placeholder="Share your thoughts about this business... (optional)"
                class="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="4"
                :disabled="submitting"
              ></textarea>
              <p class="text-xs text-gray-400 self-start mt-1">{{ review.length }} / 500</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="border-t border-gray-200 px-4 py-3 bg-white flex gap-3">
            <button
              @click="closeModal"
              class="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
              :disabled="submitting"
            >
              Skip
            </button>
            <button
              @click="submitRating"
              :disabled="selectedRating === 0 || submitting"
              class="flex-1 px-4 py-3 text-white bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg font-medium transition"
            >
              {{ submitting ? 'Submitting...' : 'Submit Rating' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
export default {
  name: "BusinessRatingModal",
  
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    businessSlug: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      selectedRating: 0,
      hoverRating: 0,
      review: '',
      submitting: false
    }
  },

  watch: {
    isOpen(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        this.resetForm();
      }
    },
    review(newVal) {
      if (newVal.length > 500) {
        this.review = newVal.slice(0, 500);
      }
    }
  },

  methods: {
    closeModal() {
      this.$emit('close');
    },

    setRating(rating) {
      this.selectedRating = rating;
    },

    getRatingText() {
      const rating = this.hoverRating || this.selectedRating;
      switch(rating) {
        case 1: return 'Poor';
        case 2: return 'Fair';
        case 3: return 'Good';
        case 4: return 'Very Good';
        case 5: return 'Excellent';
        default: return 'Select a rating';
      }
    },

    resetForm() {
      this.selectedRating = 0;
      this.hoverRating = 0;
      this.review = '';
    },

    async submitRating() {
      if (this.selectedRating === 0) return;

      try {
        this.submitting = true;

        // Construct the API URL based on your business rating endpoint
        const apiUrl = `${this.$store.state.root_api}room/api/ratings/create/`;

        const response = await fetch(
          apiUrl,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              business_slug:this.businessSlug || '',
              room_id:this.$route.params.id,
              rating: this.selectedRating,
              review: this.review.trim()
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          this.$message?.success("Thank you for your rating!");
          this.$emit('ratingSubmitted', {
            rating: this.selectedRating,
            review: this.review,
            data: data.data
          });
          this.closeModal();
        } else {
          // Handle different error responses
          let errorMessage = "Failed to submit rating";
          
          if (data.message) {
            errorMessage = data.message;
          } else if (data.detail) {
            errorMessage = data.detail;
          } else if (Array.isArray(data.rating)) {
            errorMessage = data.rating.join(', ');
          }
          
          this.$message?.error(errorMessage);
        }
      } catch (error) {
        console.error("Failed to submit rating:", error);
        this.$message?.error("Failed to submit rating. Please try again.");
      } finally {
        this.submitting = false;
      }
    }
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .hidden.md\:flex,
.modal-leave-to .hidden.md\:flex {
  transform: scale(0.95);
}

.modal-enter-from .md\:hidden,
.modal-leave-to .md\:hidden {
  transform: translateY(100%);
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

button svg {
  transition: fill 0.2s ease;
}
</style>