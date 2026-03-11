<template>
  <!-- ═══════════════════════════════════════════════════
       DESKTOP TOUR — Ant Design a-tour
  ════════════════════════════════════════════════════ -->
  <a-tour
    v-if="!isMobile"
    v-model:current="currentStep"
    :open="open"
    :steps="currentTourSteps"
    :arrow="true"
    placement="bottom"
    @close="closeTour"
    @finish="closeTour"
  />

  <!-- ═══════════════════════════════════════════════════
       MOBILE TOUR — Custom Full-Screen Modal
  ════════════════════════════════════════════════════ -->
  <Teleport to="body">
    <transition name="mobile-tour-fade">
      <div v-if="isMobile && open" class="mobile-tour-backdrop" @click.self="closeTour">
        <div class="mobile-tour-card">

          <!-- Header -->
          <div class="mt-header">
            <div class="mt-mode-badge">{{ currentModeLabel }}</div>
            <button class="mt-close" @click="closeTour">✕</button>
          </div>

          <!-- Step Pills -->
          <div class="mt-steps-pills">
            <span
              v-for="(_, i) in currentTourSteps"
              :key="i"
              class="mt-pill"
              :class="{ active: i === currentStep }"
              @click="currentStep = i"
            />
          </div>

          <!-- Image -->
          <div class="mt-image-wrap">
            <transition name="mt-slide" mode="out-in">
              <img
                :key="currentStep"
                :src="currentTourSteps[currentStep]?.cover?.props?.src || currentTourSteps[currentStep]?.coverSrc"
                :alt="currentTourSteps[currentStep]?.title"
                class="mt-image"
              />
            </transition>
          </div>

          <!-- Step info -->
          <div class="mt-body">
            <div class="mt-step-num">Step {{ currentStep + 1 }} / {{ currentTourSteps.length }}</div>
            <div class="mt-title">{{ currentTourSteps[currentStep]?.title }}</div>
            <div class="mt-desc">{{ currentTourSteps[currentStep]?.description }}</div>
          </div>

          <!-- Navigation -->
          <div class="mt-nav">
            <button class="mt-btn mt-btn-ghost" @click="prevStep" :disabled="currentStep === 0">
              ← Back
            </button>
            <button
              v-if="currentStep < currentTourSteps.length - 1"
              class="mt-btn mt-btn-primary"
              @click="nextStep"
            >
              Next →
            </button>
            <button
              v-else
              class="mt-btn mt-btn-finish"
              @click="closeTour"
            >
              Got it ✓
            </button>
          </div>

        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
import { createVNode, ref } from 'vue';

// ─── Placeholder image helper ────────────────────────────────────────────────
const IMG = {
  click_select:    'https://placehold.co/560x280/f0f4ff/2563eb?text=1.+Click+on+any+object',
  click_remove:    'https://placehold.co/560x280/fff0f0/dc2626?text=2.+Click+Remove+button',
  click_done:      'https://placehold.co/560x280/f0fdf4/16a34a?text=3.+Object+Removed+%E2%9C%93',

  circle_draw:     'https://placehold.co/560x280/faf5ff/7c3aed?text=1.+Draw+circle+around+object',
  circle_selected: 'https://placehold.co/560x280/f0f4ff/2563eb?text=2.+Object+gets+selected',
  circle_remove:   'https://placehold.co/560x280/fff0f0/dc2626?text=3.+Click+Remove',
  circle_done:     'https://placehold.co/560x280/f0fdf4/16a34a?text=4.+Object+Removed+%E2%9C%93',

  mask_draw:       'https://placehold.co/560x280/fff7ed/ea580c?text=1.+Paint+over+the+object',
  mask_remove:     'https://placehold.co/560x280/fff0f0/dc2626?text=2.+Click+Remove',
  mask_done:       'https://placehold.co/560x280/f0fdf4/16a34a?text=3.+Object+Removed+%E2%9C%93',

  sam2_click:      'https://placehold.co/560x280/ecfeff/0891b2?text=1.+Click+to+place+points',
  sam2_detect:     'https://placehold.co/560x280/faf5ff/7c3aed?text=2.+Click+Detect',
  sam2_selected:   'https://placehold.co/560x280/f0f4ff/2563eb?text=3.+Object+selected',
  sam2_remove:     'https://placehold.co/560x280/fff0f0/dc2626?text=4.+Click+Remove',
  sam2_done:       'https://placehold.co/560x280/f0fdf4/16a34a?text=5.+Object+Removed+%E2%9C%93',

  sam3_type:       'https://placehold.co/560x280/fffbeb/d97706?text=1.+Type+object+name+(sofa%2C+bed...)',
  sam3_run:        'https://placehold.co/560x280/fdf2f8/db2777?text=2.+Click+Run',
  sam3_selected:   'https://placehold.co/560x280/f0f4ff/2563eb?text=3.+Object+selected',
  sam3_remove:     'https://placehold.co/560x280/fff0f0/dc2626?text=4.+Click+Remove',
  sam3_done:       'https://placehold.co/560x280/f0fdf4/16a34a?text=5.+Object+Removed+%E2%9C%93',
};

const MIMG = {
  click_select:    'https://placehold.co/360x220/f0f4ff/2563eb?text=1.+Tap+any+object',
  click_remove:    'https://placehold.co/360x220/fff0f0/dc2626?text=2.+Tap+Remove',
  click_done:      'https://placehold.co/360x220/f0fdf4/16a34a?text=3.+Done+%E2%9C%93',

  circle_draw:     'https://placehold.co/360x220/faf5ff/7c3aed?text=1.+Draw+circle',
  circle_selected: 'https://placehold.co/360x220/f0f4ff/2563eb?text=2.+Object+selected',
  circle_remove:   'https://placehold.co/360x220/fff0f0/dc2626?text=3.+Tap+Remove',
  circle_done:     'https://placehold.co/360x220/f0fdf4/16a34a?text=4.+Done+%E2%9C%93',

  mask_draw:       'https://placehold.co/360x220/fff7ed/ea580c?text=1.+Paint+over+object',
  mask_remove:     'https://placehold.co/360x220/fff0f0/dc2626?text=2.+Tap+Remove',
  mask_done:       'https://placehold.co/360x220/f0fdf4/16a34a?text=3.+Done+%E2%9C%93',

  sam2_click:      'https://placehold.co/360x220/ecfeff/0891b2?text=1.+Tap+to+place+points',
  sam2_detect:     'https://placehold.co/360x220/faf5ff/7c3aed?text=2.+Tap+Detect',
  sam2_selected:   'https://placehold.co/360x220/f0f4ff/2563eb?text=3.+Object+selected',
  sam2_remove:     'https://placehold.co/360x220/fff0f0/dc2626?text=4.+Tap+Remove',
  sam2_done:       'https://placehold.co/360x220/f0fdf4/16a34a?text=5.+Done+%E2%9C%93',

  sam3_type:       'https://placehold.co/360x220/fffbeb/d97706?text=1.+Type+object+name',
  sam3_run:        'https://placehold.co/360x220/fdf2f8/db2777?text=2.+Tap+Run',
  sam3_selected:   'https://placehold.co/360x220/f0f4ff/2563eb?text=3.+Object+selected',
  sam3_remove:     'https://placehold.co/360x220/fff0f0/dc2626?text=4.+Tap+Remove',
  sam3_done:       'https://placehold.co/360x220/f0fdf4/16a34a?text=5.+Done+%E2%9C%93',
};

function makeStep(title, desc, desktopSrc, mobileSrc, targetRef = null) {
  return {
    title,
    description: desc,
    coverSrc: mobileSrc,
    cover: createVNode('img', {
      alt: title,
      src: desktopSrc,
      style: 'width:100%;border-radius:8px;display:block;',
    }),
    target: targetRef,
  };
}

const TOURS = {
  clickonobject: {
    label: 'Click to Select',
    steps: (refs) => [
      makeStep(
        'Click on any object',
        'Hover over the room image — objects will highlight in orange. Click directly on the item you want to select.',
        IMG.click_select, MIMG.click_select,
        refs.pillClick,
      ),
      makeStep(
        'Click the Remove button',
        'After selecting (object turns red), press the red Remove button in the bottom toolbar.',
        IMG.click_remove, MIMG.click_remove,
        refs.pillClick,
      ),
      makeStep(
        'Object removed ✓',
        'The selected object is erased from the room and the background is filled in automatically.',
        IMG.click_done, MIMG.click_done,
        refs.pillClick,
      ),
    ],
  },

  drawcircle: {
    label: 'Draw Circle',
    steps: (refs) => [
      makeStep(
        'Draw a circle around the object',
        'Click and drag to draw a freehand loop around the furniture you want to select.',
        IMG.circle_draw, MIMG.circle_draw,
        refs.pillCircle,
      ),
      makeStep(
        'Object gets selected',
        'Any objects inside your drawn loop are automatically detected and highlighted in red.',
        IMG.circle_selected, MIMG.circle_selected,
        refs.pillCircle,
      ),
      makeStep(
        'Click the Remove button',
        'Press the red Remove button in the bottom toolbar to erase the selected objects.',
        IMG.circle_remove, MIMG.circle_remove,
        refs.pillCircle,
      ),
      makeStep(
        'Object removed ✓',
        'The selected objects are cleanly removed from the room.',
        IMG.circle_done, MIMG.circle_done,
        refs.pillCircle,
      ),
    ],
  },

  draw: {
    label: 'Draw Mask',
    steps: (refs) => [
      makeStep(
        'Paint over the object',
        'Click and drag your mouse (or finger) directly over the area you want to erase. Use the brush size slider to control coverage.',
        IMG.mask_draw, MIMG.mask_draw,
        refs.pillMask,
      ),
      makeStep(
        'Click the Remove button',
        'Once you\'ve painted the area, press the red Remove button to process the removal.',
        IMG.mask_remove, MIMG.mask_remove,
        refs.pillMask,
      ),
      makeStep(
        'Object removed ✓',
        'The painted region is removed and the background is restored using AI inpainting.',
        IMG.mask_done, MIMG.mask_done,
        refs.pillMask,
      ),
    ],
  },

  sam2: {
    label: 'SAM 2 — AI Segmentation',
    steps: (refs) => [
      makeStep(
        'Click to place anchor points',
        'Click directly on the object you want to segment. Each click places a precision point. Add 2–4 points across the surface for best results.',
        IMG.sam2_click, MIMG.sam2_click,
        refs.pillSAM2,
      ),
      makeStep(
        'Click Detect',
        'Press the "Detect" button in the context bar. The AI will analyse your points and generate a precise object mask.',
        IMG.sam2_detect, MIMG.sam2_detect,
        refs.pillSAM2,
      ),
      makeStep(
        'Object gets selected',
        'The detected object is highlighted in red, showing the exact area that will be removed.',
        IMG.sam2_selected, MIMG.sam2_selected,
        refs.pillSAM2,
      ),
      makeStep(
        'Click the Remove button',
        'Press the red Remove button in the bottom toolbar.',
        IMG.sam2_remove, MIMG.sam2_remove,
        refs.pillSAM2,
      ),
      makeStep(
        'Object removed ✓',
        'The AI-segmented object is removed with pixel-perfect precision.',
        IMG.sam2_done, MIMG.sam2_done,
        refs.pillSAM2,
      ),
    ],
  },

  sam3: {
    label: 'SAM 3 — Text Detection',
    steps: (refs) => [
      makeStep(
        'Type the object name',
        'In the text input, type the name of the object you want to find — e.g. "sofa", "bed", "lamp". Separate multiple items with commas.',
        IMG.sam3_type, MIMG.sam3_type,
        refs.pillSAM3,
      ),
      makeStep(
        'Click Run',
        'Press the "Run" button. The AI will scan the image and locate all matching objects.',
        IMG.sam3_run, MIMG.sam3_run,
        refs.pillSAM3,
      ),
      makeStep(
        'Object gets selected',
        'Detected objects are highlighted in red. Review the selection before removing.',
        IMG.sam3_selected, MIMG.sam3_selected,
        refs.pillSAM3,
      ),
      makeStep(
        'Click the Remove button',
        'Press the red Remove button in the bottom toolbar.',
        IMG.sam3_remove, MIMG.sam3_remove,
        refs.pillSAM3,
      ),
      makeStep(
        'Object removed ✓',
        'All matched objects are removed from the room image.',
        IMG.sam3_done, MIMG.sam3_done,
        refs.pillSAM3,
      ),
    ],
  },
};

export default {
  name: 'ToolbarTour',

  props: {
    selectedOption: {
      type: String,
      default: 'clickonobject',
    },
    tourRefs: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: ['close'],

  data() {
    return {
      open: false,
      currentStep: 0,
      isMobile: false,
    };
  },

  computed: {
    currentTourConfig() {
      return TOURS[this.selectedOption] || TOURS.clickonobject;
    },
    currentTourSteps() {
      return this.currentTourConfig.steps(this.tourRefs);
    },
    currentModeLabel() {
      return this.currentTourConfig.label;
    },
  },

  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  },

  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth < 768;
    },

    openTour() {
      this.currentStep = 0;
      this.open = true;
    },

    closeTour() {
      this.open = false;
      this.$emit('close');
    },

    nextStep() {
      if (this.currentStep < this.currentTourSteps.length - 1) {
        this.currentStep++;
      }
    },

    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
  },
};
</script>

<style scoped>
/* ══════════════════════════════════════════
   MOBILE TOUR MODAL — White Theme
══════════════════════════════════════════ */
.mobile-tour-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
}

.mobile-tour-card {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  border: 1px solid #e2e8f0;
  border-bottom: none;
  box-shadow: 0 -8px 40px rgba(15, 23, 42, 0.12);
  padding: 20px 20px 36px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 92vh;
  overflow-y: auto;
}

/* Header */
.mt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mt-mode-badge {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #2563eb;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 4px 12px;
  border-radius: 100px;
  text-transform: uppercase;
}

.mt-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #94a3b8;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.mt-close:hover {
  background: #f1f5f9;
  color: #475569;
  border-color: #cbd5e1;
}

/* Step pills */
.mt-steps-pills {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.mt-pill {
  height: 4px;
  border-radius: 2px;
  background: #e2e8f0;
  flex: 1;
  max-width: 48px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mt-pill.active {
  background: #2563eb;
  box-shadow: 0 0 8px rgba(37, 99, 235, 0.35);
}

/* Image */
.mt-image-wrap {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mt-image {
  width: 100%;
  display: block;
  border-radius: 12px;
}

/* Body */
.mt-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mt-step-num {
  font-size: 11px;
  color: #94a3b8;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-weight: 600;
}

.mt-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}

.mt-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
}

/* Navigation */
.mt-nav {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.mt-btn {
  flex: 1;
  padding: 12px 16px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.02em;
}

.mt-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.mt-btn-ghost {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.mt-btn-ghost:hover:not(:disabled) {
  background: #e2e8f0;
  color: #334155;
  border-color: #cbd5e1;
}

.mt-btn-primary {
  background: linear-gradient(135deg, #2563eb, #0040c9);
  color: #fff;
  box-shadow: 0 2px 12px rgba(37, 99, 235, 0.25);
}

.mt-btn-primary:hover {
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.35);
  transform: translateY(-1px);
}

.mt-btn-finish {
  background: linear-gradient(135deg, #16a34a, #15803d);
  color: #fff;
  box-shadow: 0 2px 12px rgba(22, 163, 74, 0.2);
}

.mt-btn-finish:hover {
  box-shadow: 0 4px 20px rgba(22, 163, 74, 0.32);
  transform: translateY(-1px);
}

/* ── Transitions ── */
.mobile-tour-fade-enter-active,
.mobile-tour-fade-leave-active {
  transition: opacity 0.25s ease;
}
.mobile-tour-fade-enter-from,
.mobile-tour-fade-leave-to {
  opacity: 0;
}
.mobile-tour-fade-enter-active .mobile-tour-card,
.mobile-tour-fade-leave-active .mobile-tour-card {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.mobile-tour-fade-enter-from .mobile-tour-card,
.mobile-tour-fade-leave-to .mobile-tour-card {
  transform: translateY(100%);
}

.mt-slide-enter-active,
.mt-slide-leave-active {
  transition: all 0.2s ease;
}
.mt-slide-enter-from {
  opacity: 0;
  transform: translateX(16px);
}
.mt-slide-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}

/* ── Desktop a-tour overrides — White Theme ── */
:global(.ant-tour-inner) {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 40px rgba(15, 23, 42, 0.12) !important;
}
:global(.ant-tour-title) {
  color: #0f172a !important;
  font-weight: 700 !important;
  font-size: 16px !important;
}
:global(.ant-tour-description) {
  color: #64748b !important;
  font-size: 13px !important;
  line-height: 1.6 !important;
}
:global(.ant-tour-next-btn),
:global(.ant-tour-finish-btn) {
  background: linear-gradient(135deg, #2563eb, #7c3aed) !important;
  border: none !important;
  box-shadow: 0 2px 10px rgba(37, 99, 235, 0.25) !important;
  border-radius: 8px !important;
  color: #fff !important;
}
:global(.ant-tour-prev-btn) {
  border-color: #e2e8f0 !important;
  color: #64748b !important;
  background: #f8fafc !important;
  border-radius: 8px !important;
}
:global(.ant-tour-prev-btn:hover) {
  border-color: #cbd5e1 !important;
  color: #334155 !important;
  background: #f1f5f9 !important;
}
:global(.ant-tour-indicators span) {
  background: #e2e8f0 !important;
  width: 8px !important;
  height: 8px !important;
  border-radius: 50% !important;
  display: inline-block !important;
  transition: background 0.3s ease, transform 0.3s ease !important;
}
:global(.ant-tour-indicators span.active),
:global(.ant-tour-indicators .ant-tour-indicator-active),
:global(.ant-tour-indicators span[class*="active"]) {
  background: #2563eb !important;
  transform: scale(1.35) !important;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18) !important;
}
:global(.ant-tour-close) {
  color: #94a3b8 !important;
}
:global(.ant-tour-close:hover) {
  color: #475569 !important;
}
:global(.ant-tour-arrow::before) {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
}

</style>