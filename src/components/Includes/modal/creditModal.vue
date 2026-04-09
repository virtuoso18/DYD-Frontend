<template>
  <div>
    <!-- :title="t('getCreditModal.title')" -->
    <a-modal
      :visible="isShowModal"
      @cancel="$emit('close-modal')"
      :footer="null"
      centered
      :width="354"
      :locale="modalLocale"
    >
      <div class="redeem-modal-content">
        <div class="star-sec h-[80px] !pt-6 relative">
          <svg
            width="50"
            height="50"
            viewBox="0 0 50 50"
            fill="none"
            class="absolute left-[44%]"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M25 0C11.1925 0 0 11.1925 0 25C0 38.8075 11.1925 50 25 50C38.8075 50 50 38.8075 50 25C50 11.1925 38.8075 0 25 0ZM25 2.5C25 8.46737 22.6295 14.1903 18.4099 18.4099C14.1903 22.6295 8.46737 25 2.5 25C8.46737 25 14.1903 27.3705 18.4099 31.5901C22.6295 35.8097 25 41.5326 25 47.5C25 41.5326 27.3705 35.8097 31.5901 31.5901C35.8097 27.3705 41.5326 25 47.5 25C41.5326 25 35.8097 22.6295 31.5901 18.4099C27.3705 14.1903 25 8.46737 25 2.5Z"
              fill="#3B63FB"
            />
          </svg>

          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            class="absolute left-[62%]"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9 0C4.0293 0 0 4.0293 0 9C0 13.9707 4.0293 18 9 18C13.9707 18 18 13.9707 18 9C18 4.0293 13.9707 0 9 0ZM9 0.9C9 3.04825 8.14661 5.10852 6.62756 6.62756C5.10852 8.14661 3.04825 9 0.9 9C3.04825 9 5.10852 9.85339 6.62756 11.3724C8.14661 12.8915 9 14.9517 9 17.1C9 14.9517 9.85339 12.8915 11.3724 11.3724C12.8915 9.85339 14.9517 9 17.1 9C14.9517 9 12.8915 8.14661 11.3724 6.62756C9.85339 5.10852 9 3.04825 9 0.9Z"
              fill="#3B63FB"
            />
          </svg>
        </div>

        <div class="relative" :dir="currentDirection">
          <h2 class="!text-center text-[20px] font-semibold">
            {{ t('getCreditModal.heading') }}
          </h2>
          <p class="!text-center leading-[20px] text-[15px] !mb-12">
            {{ t('getCreditModal.description') }}
          </p>
        </div>

        <div class="!flex justify-center">
          <a-button
            :loading="freeCreditCrediting"
            type="primary"
            @click="handleBuyFreeCredits"
            class="w-full"
          >
            {{ t('getCreditModal.claimButton') }}
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: "GetCreditModal",

  props: {
    isShowModal: {
      type: Boolean,
      required: true,
    },
    handleBuyFreeCredits: {
      type: Function,
      required: true,
    },
    freeCreditCrediting: {
      type: Boolean,
      required: true,
    },
    successCredit: {
      type: Boolean,
      required: true,
    },
  },

  setup() {
    const { t, locale } = useI18n();
    
    // Set RTL direction for Hebrew
    const currentDirection = locale.value === 'he' ? 'rtl' : 'ltr';
    
    // Modal locale for Ant Design components
    const modalLocale = {
      okText: t('common.ok'),
      cancelText: t('common.cancel'),
      justOkText: t('common.ok'),
    };
    
    return { 
      t, 
      currentDirection,
      modalLocale
    };
  },

  watch: {
    // Watch for locale changes to update direction
    '$i18n.locale': {
      handler(newLocale) {
        this.currentDirection = newLocale === 'he' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', this.currentDirection);
      },
      immediate: true
    }
  },

  mounted() {
    // Set direction on mount
    document.documentElement.setAttribute('dir', this.currentDirection);
  },

  methods: {
    showModal() {
      this.$emit("update:isShowModal", true);
    },

    handleOk() {
      this.$emit("update:isShowModal", false);
    },
  },
};
</script>

<style scoped>
:deep(.ant-modal-content) {
  padding: 0 !important;
}

:deep(.ant-modal) {
  padding: 0 !important;
}

/* RTL Support */
[dir="rtl"] .star-sec svg:first-child {
  left: auto;
  right: 44%;
}

[dir="rtl"] .star-sec svg:last-child {
  left: auto;
  right: 62%;
}

[dir="rtl"] .redeem-modal-content {
  direction: rtl;
}

.redeem-modal-content {
  padding: 10px;
}
</style>