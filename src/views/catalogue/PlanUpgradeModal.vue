<template>
  <!-- Modal Overlay -->
  <div
    v-if="visible"
    class="fixed inset-0 z-1001 flex items-center justify-center bg-black/50 backdrop-blur-sm"
  >
    <!-- Modal Box -->
    <div
      class="!w-[420px] !min-h-[520px] bg-white rounded-2xl shadow-2xl relative animate-fadeIn"
    >
      <div class="!text-center !p-6">

        <!-- Icon -->
        <div
          class="flex items-center justify-center !w-[60px] !h-[60px] !mx-auto !mb-2 rounded-full bg-yellow-400/20"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="#FBBF24"
              stroke="#FBBF24"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <!-- Heading -->
        <h2 class="!text-[22px] !font-semibold mb-3 !text-gray-800">
          Upgrade Your Plan
        </h2>

        <!-- Current Plan Badge -->
        <div class="inline-block bg-gray-100 !px-3 !py-1 rounded-full !mb-4">
          <span class="!text-[13px] !font-medium !text-gray-500">
            Current Plan:
            <span class="!text-[#3B63FB] !font-semibold">
              {{ currentPlan }}
            </span>
          </span>
        </div>

        <!-- Message -->
        <p
          class="!text-[15px] !leading-relaxed !text-gray-600 !mb-7"
        >
          You are on the <strong>{{ currentPlan }}</strong> plan.
          To access <strong>This</strong> features,
          please upgrade to <strong>Standard</strong> or
          <strong>Premium</strong>.
        </p>

        <!-- Plan Options -->
        <div class="flex gap-3 !mb-6">
          <div
            v-for="plan in plans"
            :key="plan.name"
            @click="selectedPlan = plan.name"
            :class="[
              'flex-1 rounded-xl border-2 cursor-pointer transition-all duration-300 !p-4',
              selectedPlan === plan.name
                ? 'border-[#3B63FB] bg-[#3B63FB]/5 shadow-md'
                : 'border-gray-200 hover:border-[#3B63FB] hover:-translate-y-1'
            ]"
          >
            <div class="!text-[16px] !font-semibold !text-gray-800 !mb-2">
              {{ plan.name }}
            </div>

            <div class="!text-[20px] !font-bold !text-[#3B63FB] !mb-3">
              {{ plan.price }}
            </div>

            <div class="!text-left space-y-1">
              <div
                v-for="feature in plan.features"
                :key="feature"
                class="!text-[13px] !text-gray-500"
              >
                ✓ {{ feature }}
              </div>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col gap-3">
          <button
            @click="upgradePlan"
            class="!h-[48px] !text-[16px] rounded-xl !bg-[#3B63FB] !text-white font-semibold shadow-lg hover:shadow-xl hover:bg-[#2f52e0] transition-all"
          >
            Upgrade to {{ selectedPlan }}
          </button>

          <button
            @click="closeModal"
            class="!h-[48px] !text-[16px] rounded-xl border border-gray-300 !text-gray-700 font-medium hover:bg-gray-100 transition-all"
          >
            Maybe Later
          </button>
        </div>

      </div>

      <!-- Close Button -->
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
      >
        ✕
      </button>
    </div>
  </div>
</template>


<script>
export default {
  name: 'PlanUpgradeModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentPlan: 'Basic',
      selectedPlan: 'Standard',
      plans: [
        {
          name: 'Standard',
          price: '$29/mo',
          features: ['Home Design', '50 Renders', 'HD Quality'],
        },
        {
          name: 'Premium',
          price: '$79/mo',
          features: ['Home Design', 'Unlimited Renders', '4K Quality', 'Priority Support'],
        },
      ],
    };
  },
  mounted() {
    // Get current plan from localStorage
    const userPlan = localStorage.getItem('userPlan') || 'Basic';
    this.currentPlan = userPlan.charAt(0).toUpperCase() + userPlan.slice(1);
  },
  methods: {
    upgradePlan() {
      // Store selected plan temporarily
      localStorage.setItem('selectedUpgradePlan', this.selectedPlan.toLowerCase());
      
      // Emit upgrade event (you can handle payment flow here)
      this.$emit('upgrade', this.selectedPlan.toLowerCase());
      
      // For now, just update localStorage (remove this when backend is ready)
      localStorage.setItem('userPlan', this.selectedPlan.toLowerCase());
      
      this.$message.success(`Plan upgraded to ${this.selectedPlan}!`);
      this.closeModal();
    },
    closeModal() {
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style scoped>
.plan-card {
  flex: 1;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.plan-card:hover {
  border-color: #3b63fb;
  transform: translateY(-2px);
}

.plan-card.selected {
  border-color: #3b63fb;
  background: rgba(59, 99, 251, 0.05);
}

.plan-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.plan-price {
  font-size: 20px;
  font-weight: 700;
  color: #3b63fb;
  margin-bottom: 12px;
}

.plan-features {
  text-align: left;
}

.feature {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
}
</style>
