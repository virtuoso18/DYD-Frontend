<template>
  <a-modal
    :open="visible"
    :footer="null"
    :closable="false"
    :mask-closable="true"
    :width="380"
    centered
    class="api-error-modal"
    @cancel="handleClose"
  >
    <div class="flex flex-col items-center text-center px-4 py-6 gap-4">

      <!-- Icon -->
      <div class="w-14 h-14 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <!-- Message from backend -->
      <p class="text-gray-700 text-sm leading-relaxed">{{ message }}</p>

      <!-- Dismiss -->
      <button
        class="w-full h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium cursor-pointer border border-gray-200 transition-colors"
        @click="handleClose"
      >
        Dismiss
      </button>

    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'ApiErrorModal',
  props: {
    visible: { type: Boolean, default: false },
    message: { type: String, default: 'Something went wrong. Please try again.' },
  },
  emits: ['update:visible'],
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style scoped>
.api-error-modal :deep(.ant-modal-content) {
  border-radius: 14px;
  padding: 0;
  overflow: hidden;
}
.api-error-modal :deep(.ant-modal-body) {
  padding: 0;
}
</style>