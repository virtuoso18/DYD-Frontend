<template>
  <Teleport to="body">
    <transition name="modal">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-500 flex items-center justify-center backdrop-blur-sm p-4"
        style="background-color: rgba(0, 0, 0, 0.4);"
        @click="closeModal"
      >
        <div 
          class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 transform transition-all"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h2
  style="
    font-family: 'Poppins';
    font-weight: 500;
    font-style: normal;
    font-size: 18px;
    line-height: 28px;
    letter-spacing: 0;
    color: #1a1a1a;
  "
>
  Complete Your profile
</h2>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span
  style="
    font-family: 'Poppins';
    font-weight: 500;
    font-style: normal;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0;
    text-align: center;
    color: #2563eb; /* same as text-blue-600 */
  "
>
  {{ completionPercentage }}% completed
</span>
            </div>
          </div>

          <!-- Progress Steps -->
          <div class="mb-8">
            <div 
              v-for="(step, index) in steps" 
              :key="index"
              class="relative"
            >
              <div class="flex items-start gap-4 last:mb-0" :class="index < steps.length - 1 ? 'mb-2' : ''">
                <!-- Step Icon/Indicator Column -->
                <div class="flex flex-col items-center flex-shrink-0">
                  <!-- Completed: Blue SVG Checkmark -->
                  <div v-if="step.completed" class="flex items-center justify-center">
                    <svg 
                      width="28" 
                      height="28" 
                      viewBox="0 0 28 28" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      class="transition-all duration-300"
                    >
                      <path 
                        d="M25.6654 12.9262V13.9995C25.6639 16.5153 24.8493 18.9633 23.3429 20.9783C21.8366 22.9933 19.7192 24.4674 17.3066 25.1807C14.894 25.8941 12.3155 25.8084 9.95558 24.9365C7.59566 24.0647 5.58079 22.4533 4.21149 20.3428C2.84218 18.2322 2.19179 15.7356 2.35732 13.2252C2.52285 10.7148 3.49544 8.32523 5.13002 6.41277C6.76461 4.50031 8.97361 3.16746 11.4276 2.61302C13.8816 2.05858 16.449 2.31224 18.747 3.33618M25.6654 4.66618L13.9987 16.3445L10.4987 12.8445" 
                        stroke="#3B63FB" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  
                  <!-- Incomplete: 10x10 Grey Dot -->
                  <div 
                    v-else
                    class="flex items-center justify-center"
                    style="width: 28px; height: 28px;"
                  >
                    <div class="w-[10px] h-[10px] rounded-full bg-gray-400 transition-all duration-300"></div>
                  </div>

                  <!-- Connecting Line with spacing (not touching icons) -->
                  <div 
                    v-if="index < steps.length - 1"
                    class="my-3"
                  >
                    <div 
                      class="w-[2px] h-[56px] transition-all duration-300"
                      :class="step.completed ? 'bg-blue-600' : 'bg-gray-300'"
                    ></div>
                  </div>
                </div>
                

                <!-- Step Content -->
                <div class="flex-1 pt-0.5">
                 <h3
  :class="step.completed ? 'text-gray-900' : 'text-gray-700'"
  style="
    font-family: 'Poppins';
    font-weight: 500;
    font-style: normal;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0;
    margin-bottom: 4px; /* equal to mb-1 */
    transition: color 0.2s ease;
  "
>
  {{ step.title }}
</h3>

                  <p class="text-sm text-gray-600 leading-relaxed">
                    {{ step.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Button -->
          <button 
  @click="completeProcess"
  class="w-full bg-blue-600 hover:bg-blue-700 !text-white !font-poppins !font-regular !text-[14px] leading-[20px] py-3 px-6 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg text-center"
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
  name: "ProfileCompletionModal",
  
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
          completed: true
        },
        {
          id: 2,
          title: 'Business details',
          description: 'Please fill in your Business details accurately.',
          completed: true
        },
        {
          id: 3,
          title: 'Add at least 3 products',
          description: 'Please add at least three products to proceed with the process.',
          completed: false
        },
        {
          id: 4,
          title: 'Create a AI Catalog',
          description: 'Create your personalized AI catalog by selecting and organizing products that meet your needs.',
          completed: false
        }
      ]
    }
  },

  computed: {
    completionPercentage() {
      const completed = this.steps.filter(step => step.completed).length;
      return Math.round((completed / this.steps.length) * 100);
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

    completeProcess() {
      this.$emit('complete');
    },

    updateStepStatus(stepId, completed) {
      const step = this.steps.find(s => s.id === stepId);
      if (step) {
        step.completed = completed;
      }
    },

    completeStep(stepId) {
      this.updateStepStatus(stepId, true);
    },

    incompleteStep(stepId) {
      this.updateStepStatus(stepId, false);
    }
  }
}
</script>

<style scoped>
/* Modal fade animation */
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

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
