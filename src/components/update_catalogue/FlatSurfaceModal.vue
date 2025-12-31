<template>
  <Transition name="fade">
    <div
      v-if="isVisible"
      @click="closeModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <!-- Modal Content -->
      <div
        @click.stop
        class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 relative"
      >
        <!-- Back Button -->
        <button
          @click="closeModal"
          class="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-medium"
        >
          <svg
            width="6"
            height="11"
            viewBox="0 0 6 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 10L1 5.5L5 1"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Back
        </button>

        <!-- Icon/Illustration -->
        <div class="mt-16 mb-6 flex justify-center">
          <div class="w-48 h-48 bg-blue-50 rounded-3xl flex items-center justify-center overflow-hidden relative">
            <!-- Scanning Animation Background -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="scan-line"></div>
            </div>
            
            <!-- Wall Scanning Illustration -->
            <div class="relative z-10">
              <!-- Wall Structure -->
              <div class="relative">
                <!-- Main Wall -->
                <div class="w-32 h-24 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg relative overflow-hidden border-2 border-gray-300">
                  <!-- Wall Texture Lines -->
                  <div class="absolute inset-0">
                    <div class="absolute top-0 left-0 right-0 h-px bg-gray-300 opacity-30"></div>
                    <div class="absolute top-6 left-0 right-0 h-px bg-gray-300 opacity-30"></div>
                    <div class="absolute top-12 left-0 right-0 h-px bg-gray-300 opacity-30"></div>
                    <div class="absolute top-18 left-0 right-0 h-px bg-gray-300 opacity-30"></div>
                  </div>
                  
                  <!-- Scanning Grid Overlay -->
                  <svg class="absolute inset-0 w-full h-full" viewBox="0 0 128 96" fill="none">
                    <!-- Vertical scan lines -->
                    <line x1="32" y1="0" x2="32" y2="96" stroke="#6B7CF9" stroke-width="0.5" opacity="0.3" class="scan-grid-v"/>
                    <line x1="64" y1="0" x2="64" y2="96" stroke="#6B7CF9" stroke-width="0.5" opacity="0.5" class="scan-grid-v" style="animation-delay: 0.2s;"/>
                    <line x1="96" y1="0" x2="96" y2="96" stroke="#6B7CF9" stroke-width="0.5" opacity="0.3" class="scan-grid-v" style="animation-delay: 0.4s;"/>
                    
                    <!-- Horizontal scan lines -->
                    <line x1="0" y1="24" x2="128" y2="24" stroke="#6B7CF9" stroke-width="0.5" opacity="0.3" class="scan-grid-h"/>
                    <line x1="0" y1="48" x2="128" y2="48" stroke="#6B7CF9" stroke-width="0.5" opacity="0.5" class="scan-grid-h" style="animation-delay: 0.3s;"/>
                    <line x1="0" y1="72" x2="128" y2="72" stroke="#6B7CF9" stroke-width="0.5" opacity="0.3" class="scan-grid-h" style="animation-delay: 0.6s;"/>
                    
                    <!-- Detection corner points -->
                    <circle cx="16" cy="16" r="3" fill="#6B7CF9" class="corner-point"/>
                    <circle cx="112" cy="16" r="3" fill="#6B7CF9" class="corner-point" style="animation-delay: 0.2s;"/>
                    <circle cx="16" cy="80" r="3" fill="#6B7CF9" class="corner-point" style="animation-delay: 0.4s;"/>
                    <circle cx="112" cy="80" r="3" fill="#6B7CF9" class="corner-point" style="animation-delay: 0.6s;"/>
                  </svg>
                  
                  <!-- Paint Roller/Brush Icon -->
                  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" class="paint-tool">
                      <!-- Paint Roller -->
                      <rect x="8" y="12" width="24" height="10" rx="2" fill="#6B7CF9" opacity="0.8"/>
                      <rect x="18" y="22" width="4" height="12" fill="#6B7CF9" opacity="0.6"/>
                      <circle cx="20" cy="36" r="2" fill="#6B7CF9"/>
                      
                      <!-- Paint drips -->
                      <circle cx="12" cy="24" r="1.5" fill="#6B7CF9" opacity="0.5" class="drip" style="animation-delay: 0s;"/>
                      <circle cx="20" cy="26" r="1.5" fill="#6B7CF9" opacity="0.5" class="drip" style="animation-delay: 0.3s;"/>
                      <circle cx="28" cy="24" r="1.5" fill="#6B7CF9" opacity="0.5" class="drip" style="animation-delay: 0.6s;"/>
                    </svg>
                  </div>
                </div>
                
                <!-- Scanning Beam from Top -->
                <div class="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
                    <!-- Scan beam cone -->
                    <path d="M40 0 L10 35 L70 35 Z" fill="#6B7CF9" opacity="0.2" class="scan-cone"/>
                    <path d="M40 0 L15 35 L65 35 Z" fill="#6B7CF9" opacity="0.15" class="scan-cone" style="animation-delay: 0.3s;"/>
                    
                    <!-- Scan rays -->
                    <line x1="40" y1="0" x2="20" y2="35" stroke="#6B7CF9" stroke-width="1" opacity="0.4" class="scan-ray"/>
                    <line x1="40" y1="0" x2="40" y2="35" stroke="#6B7CF9" stroke-width="1.5" opacity="0.6" class="scan-ray"/>
                    <line x1="40" y1="0" x2="60" y2="35" stroke="#6B7CF9" stroke-width="1" opacity="0.4" class="scan-ray"/>
                  </svg>
                </div>
                
                <!-- Measurement Lines -->
                <div class="absolute -left-6 top-0 bottom-0 flex items-center">
                  <svg width="20" height="96" viewBox="0 0 20 96" fill="none">
                    <line x1="15" y1="4" x2="15" y2="92" stroke="#6B7CF9" stroke-width="1" opacity="0.5" class="measure-line"/>
                    <line x1="12" y1="4" x2="18" y2="4" stroke="#6B7CF9" stroke-width="1" opacity="0.5"/>
                    <line x1="12" y1="92" x2="18" y2="92" stroke="#6B7CF9" stroke-width="1" opacity="0.5"/>
                  </svg>
                </div>
                
                <div class="absolute -right-6 top-0 bottom-0 flex items-center">
                  <svg width="20" height="96" viewBox="0 0 20 96" fill="none">
                    <line x1="5" y1="4" x2="5" y2="92" stroke="#6B7CF9" stroke-width="1" opacity="0.5" class="measure-line"/>
                    <line x1="2" y1="4" x2="8" y2="4" stroke="#6B7CF9" stroke-width="1" opacity="0.5"/>
                    <line x1="2" y1="92" x2="8" y2="92" stroke="#6B7CF9" stroke-width="1" opacity="0.5"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Title -->
        <h2 class="text-xl font-bold text-center text-gray-900 mb-3">
          Rescale Room Layout
        </h2>

        <!-- Description -->
        <p class="text-center text-gray-600 text-sm leading-relaxed mb-8 px-4">
          We will detect your walls again and realign the room for better accuracy. Do you want to continue?
        </p>

        <!-- Continue Button -->
        <button
          @click="handleContinue"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'FlatSurfaceModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'continue'],
  methods: {
    closeModal() {
      this.$emit('close')
    },
    handleContinue() {
      this.$emit('continue')
      this.closeModal()
    }
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  },
  beforeUnmount() {
    document.body.style.overflow = ''
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scanning line animation */
.scan-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #6B7CF9, transparent);
  animation: scanVertical 2.5s ease-in-out infinite;
  opacity: 0.7;
}

@keyframes scanVertical {
  0%, 100% {
    transform: translateY(-100px);
    opacity: 0;
  }
  50% {
    transform: translateY(100px);
    opacity: 0.9;
  }
}

/* Scan cone pulsing */
.scan-cone {
  animation: conePulse 2s ease-in-out infinite;
}

@keyframes conePulse {
  0%, 100% {
    opacity: 0.15;
  }
  50% {
    opacity: 0.35;
  }
}

/* Scan rays animation */
.scan-ray {
  animation: rayPulse 1.5s ease-in-out infinite;
}

@keyframes rayPulse {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.7;
  }
}

/* Grid scanning animation */
.scan-grid-v,
.scan-grid-h {
  animation: gridPulse 2s ease-in-out infinite;
}

@keyframes gridPulse {
  0%, 100% {
    opacity: 0.2;
    stroke-dasharray: 4, 4;
  }
  50% {
    opacity: 0.6;
    stroke-dasharray: 8, 2;
  }
}

/* Corner detection points */
.corner-point {
  animation: pointBlink 1.5s ease-in-out infinite;
}

@keyframes pointBlink {
  0%, 100% {
    opacity: 0.4;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.3);
  }
}

/* Paint tool animation */
.paint-tool {
  animation: toolFloat 2s ease-in-out infinite;
}

@keyframes toolFloat {
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-5px) rotate(5deg);
  }
}

/* Paint drips */
.drip {
  animation: dripFall 2s ease-in-out infinite;
}

@keyframes dripFall {
  0%, 100% {
    opacity: 0;
    transform: translateY(0);
  }
  50% {
    opacity: 0.7;
    transform: translateY(6px);
  }
}

/* Measurement line animation */
.measure-line {
  animation: measurePulse 2s ease-in-out infinite;
}

@keyframes measurePulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
v