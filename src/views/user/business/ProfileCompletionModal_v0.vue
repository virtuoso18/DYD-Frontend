<template>
  <Teleport to="body">
    <transition name="modal">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-1001 flex items-center justify-center backdrop-blur-sm p-4 bg-black/40"
        @click="closeModal"
      >
        <div 
          class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 transform transition-all"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-8">
            <h2 class="font-poppins font-medium text-lg text-gray-900">
              Complete Your profile
            </h2>
            <button
              @click="closeModal"
              class="p-1 hover:bg-gray-100 rounded-full transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"/>
              </svg>
            </button>
          </div>

          <!-- Progress Badge -->
          <div class="flex items-center gap-2 mb-8 pb-6 border-b border-gray-200">
            <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span class="font-poppins font-medium text-sm text-blue-600">
              {{ completionPercentage }}% completed
            </span>
          </div>

          <!-- Progress Steps -->
          <div class="space-y-4 mb-8">
            <div 
              v-for="(step, index) in sortedSteps" 
              :key="step.id"
              class="relative"
            >
              <!-- Step Header (Clickable) -->
              <div 
                class="flex items-start gap-4 cursor-pointer group"
                @click="toggleStep(step.id)"
              >
                <!-- Icon/Indicator -->
                <div class="flex flex-col items-center flex-shrink-0">
                  <!-- Completed: Blue Circle with Checkmark -->
                  <div 
                    v-if="step.completed"
                    class="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        fill="white"
                      />
                    </svg>
                  </div>

                  <!-- Incomplete: Grey Circle with Dot -->
                  <div 
                    v-else
                    class="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0"
                  >
                    <div class="w-2 h-2 rounded-full bg-gray-600"></div>
                  </div>

                  <!-- Connecting Line -->
                  <div 
                    v-if="index < steps.length - 1"
                    class="mt-2"
                  >
                    <div 
                      class="w-0.5 h-16 transition-all duration-300"
                      :class="step.completed ? 'bg-blue-600' : 'bg-gray-300'"
                    ></div>
                  </div>
                </div>

                <!-- Step Content -->
                <div class="flex-1 pt-0.5 pr-2">
                  <div class="flex items-center justify-between gap-2">
                    <h3 
                      class="font-poppins font-medium text-sm transition-colors duration-200"
                      :class="step.completed ? 'text-gray-900' : 'text-gray-700'"
                    >
                      {{ step.title }}
                    </h3>
                    <!-- Dropdown Arrow -->
                    <svg
                      v-if="!step.completed && step.missing_fields && step.missing_fields.length > 0"
                      class="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300"
                      :class="expandedSteps.includes(step.id) ? 'rotate-180' : ''"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  
                  <p class="text-xs text-gray-600 mt-1 leading-relaxed">
                    {{ step.description }}
                  </p>

                  <!-- Completed Badge (Always Visible) -->
                  <div 
                    v-if="step.completed"
                    class="inline-block mt-2"
                  >
                    <span class="px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-medium text-green-700 flex items-center gap-1.5 w-fit">
                      <span class="w-1 h-1 rounded-full bg-green-600"></span>
                      Completed
                    </span>
                  </div>
                </div>
              </div>

              <!-- Expandable Missing Fields Section -->
              <transition name="expand">
                <div 
                  v-if="expandedSteps.includes(step.id) && !step.completed && step.missing_fields && step.missing_fields.length > 0"
                  class="ml-10 mt-3 pt-3 border-t border-gray-200"
                >
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(field, idx) in step.missing_fields"
                      :key="idx"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full text-xs font-medium text-red-700 transition-all hover:bg-red-100"
                    >
                      <span class="w-1 h-1 rounded-full bg-red-600 flex-shrink-0"></span>
                      {{ field }}
                    </span>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <!-- Action Button -->
          <button 
            @click="handleComplete"
class="w-full bg-blue-600 hover:bg-blue-700 !text-white font-poppins font-medium text-sm py-3 px-6 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Complete Process
          </button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
export default {
  name: 'ProfileCompletionModal',

  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    initialSteps: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      steps: [
        {
          id: 1,
          title: 'Personal details',
          description: 'Please fill in your personal details accurately to ensure a smooth process.',
          completed: false,
          missing_fields: ['First Name', 'Last Name', 'Phone Number']
        },
        {
          id: 2,
          title: 'Business details',
          description: 'Please fill in your Business details accurately.',
          completed: false,
          missing_fields: ['Email Verification', 'Business Name']
        },
        {
          id: 3,
          title: 'Add at least 3 products',
          description: 'Please add at least three products to proceed with the process.',
          completed: false,
          missing_fields: ['Add 2 more product(s)']
        },
        {
          id: 4,
          title: 'Generate Your First Simulation',
          description: 'Create your first simulation with products that you have in your business AI catalog.',
          completed: false,
          missing_fields: ['Create Your First Simulation']
        }
      ],
      expandedSteps: [] // Tracks which steps are expanded
    }
  },

  computed: {
    completionPercentage() {
      const completed = this.steps.filter(step => step.completed).length;
      return Math.round((completed / this.steps.length) * 100);
    },

    sortedSteps() {
      // Completed steps first, then incomplete steps
      return [...this.steps].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? -1 : 1;
      });
    }
  },

  watch: {
    isOpen(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },

    initialSteps: {
      immediate: true,
      handler(newSteps) {
        if (newSteps && newSteps.length > 0) {
          this.steps = newSteps;
        }
      }
    }
  },

  methods: {
    closeModal() {
      this.$emit('close');
    },

    handleComplete() {
      this.$emit('complete');
      
    },

    toggleStep(stepId) {
      const step = this.steps.find(s => s.id === stepId);
      if (step.completed) return; // Don't expand completed steps
      
      const position = this.expandedSteps.indexOf(stepId);
      if (position > -1) {
        this.expandedSteps.splice(position, 1);
      } else {
        this.expandedSteps.push(stepId);
      }
    }
  }
}
</script>

<style scoped>
/* Modal Animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  backdrop-filter: blur(4px);
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
  opacity: 0;
}

.modal-enter-to > div,
.modal-leave-from > div {
  transform: scale(1);
  opacity: 1;
}

/* Expand/Collapse Animation */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 200px;
  transform: translateY(0);
}
</style>