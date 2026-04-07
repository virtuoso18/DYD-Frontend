<template>
  <div>
    <!-- Trigger Section -->
    <div class="bg-white rounded-xl p-4 border-2 border-[rgba(79,124,255,0.1)]">
      <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div class="flex items-start gap-3 flex-row">
          <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
            <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M16.5 0C7.38705 0 0 7.38705 0 16.5C0 25.6129 7.38705 33 16.5 33C25.6129 33 33 25.6129 33 16.5C33 7.38705 25.6129 0 16.5 0ZM16.5 1.65C16.5 5.58846 14.9355 9.36562 12.1505 12.1505C9.36562 14.9355 5.58846 16.5 1.65 16.5C5.58846 16.5 9.36562 18.0645 12.1505 20.8495C14.9355 23.6344 16.5 27.4115 16.5 31.35C16.5 27.4115 18.0645 23.6344 20.8495 20.8495C23.6344 18.0645 27.4115 16.5 31.35 16.5C27.4115 16.5 23.6344 14.9355 20.8495 12.1505C18.0645 9.36562 16.5 5.58846 16.5 1.65Z"
                fill="#3B63FB" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="m-0 mb-2 !font-[Poppins] !font-medium !text-[16px] !leading-[24px] !tracking-[0] text-[#262626]">
              {{ t('credits.remainingCredits') }}
            </h4>
            <p class="m-0 !font-[Poppins] !font-normal !text-[10px] md:w-80 !leading-[16px] !tracking-[0] text-[#8c8c8c]">
              {{ t('credits.quotaDescription') }}
            </p>
          </div>
        </div>
        <div class="flex items-center px-4 justify-between text-center md:text-right">
          <div>
            <span class="!font-[Poppins] md:pr-6 !font-bold !text-[28px] !leading-[36px] !tracking-[-0.02em] text-[#1890ff]">
              {{ remainingCredits.toLocaleString() }}
            </span>
          </div>
          <button
            @click="openModal"
            class="!font-[Poppins] !font-normal bg-[#3B63FB] !text-white rounded-lg px-6 py-2.5 transition-all duration-[800ms] ease-out hover:bg-[#2a50e0] active:scale-95"
          >
            {{ t('credits.buyMoreCredits') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Ant Design Modal with Table -->
    <a-modal
      v-model:visible="isOpen"
      :title="t('credits.modalTitle')"
      width="900px"
      :footer="null"
      @cancel="closeModal"
    >
      <a-table
        :columns="creditTopupColumns"
        :data-source="plans"
        :pagination="{ pageSize: 10 }"
        :loading="loading"
        rowKey="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'credits_count'">
            {{ Number(record.credits_count).toLocaleString() }}
          </template>
          <template v-if="column.key === 'price'">
            ${{ record.price }}
          </template>
          <template v-if="column.key === 'rate'">
            ${{ (record.price / record.credits_count).toFixed(4) }}
          </template>
          <template v-if="column.key === 'action'">
            <a-button
              type="primary"
              :loading="buyingId === record.id"
              @click="handleBuy(record)"
              style="width: 100%"
            >
              {{ t('credits.buyNow') }}
            </a-button>
          </template>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'CreditTopupModal',

  props: {
    rootApi: {
      type: String,
      required: true,
    },
    remainingCredits: {
      type: Number,
      default: 0,
    },
  },

  emits: ['purchased'],

  setup() {
    const { t } = useI18n();
    return { t };
  },

  data() {
    return {
      isOpen: false,
      loading: false,
      error: false,
      plans: [],
      buyingId: null,
    };
  },

  computed: {
    creditTopupColumns() {
      return [
        {
          title: this.t('credits.columns.credits'),
          dataIndex: 'credits_count',
          key: 'credits_count',
          align: 'center',
        },
        {
          title: this.t('credits.columns.price'),
          dataIndex: 'price',
          key: 'price',
          align: 'center',
        },
        {
          title: this.t('credits.columns.action'),
          key: 'action',
          align: 'center',
        },
      ];
    },
  },

  methods: {
    openModal() {
      this.isOpen = true;
      if (!this.plans.length) {
        this.fetchPlans();
      }
    },

    closeModal() {
      this.isOpen = false;
      this.buyingId = null;
    },

    async fetchPlans() {
      try {
        this.loading = true;
        this.error = false;
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Token ${token}` } : {};
        const response = await fetch(
          `${this.rootApi}subscription/credit-topup-plans/`,
          { method: 'GET', headers }
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        this.plans = Array.isArray(result) ? result : [];
      } catch (err) {
        console.error('Error fetching top-up plans:', err);
        this.error = true;
      } finally {
        this.loading = false;
      }
    },

    handleBuy(plan) {
      this.buyingId = plan.id;
      setTimeout(() => {
        this.closeModal();
        this.$router.push(`/make-payment-credit-topup/${plan.id}`);
      }, 300);
    },
  },
};
</script>