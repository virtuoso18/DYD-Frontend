<template>
  <div>
    <!-- Trigger Section (matches manage_subscription credits card style) -->
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
              Your remaining credits
            </h4>
            <p class="m-0 !font-[Poppins] !font-normal !text-[10px] md:w-80 !leading-[16px] !tracking-[0] text-[#8c8c8c]">
              This will not affect your monthly subscription plan and will only be used after your monthly quota is exhausted.
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
            Buy more Credits
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Overlay -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isOpen" class="credit-modal-overlay" @click.self="closeModal">
          <Transition name="modal-slide">
            <div v-if="isOpen" class="credit-modal-container">

              <!-- Modal Header -->
              <div class="credit-modal-header">
                <div class="header-left">
                  <div class="header-icon">
                    <svg width="22" height="22" viewBox="0 0 33 33" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M16.5 0C7.38705 0 0 7.38705 0 16.5C0 25.6129 7.38705 33 16.5 33C25.6129 33 33 25.6129 33 16.5C33 7.38705 25.6129 0 16.5 0ZM16.5 1.65C16.5 5.58846 14.9355 9.36562 12.1505 12.1505C9.36562 14.9355 5.58846 16.5 1.65 16.5C5.58846 16.5 9.36562 18.0645 12.1505 20.8495C14.9355 23.6344 16.5 27.4115 16.5 31.35C16.5 27.4115 18.0645 23.6344 20.8495 20.8495C23.6344 18.0645 27.4115 16.5 31.35 16.5C27.4115 16.5 23.6344 14.9355 20.8495 12.1505C18.0645 9.36562 16.5 5.58846 16.5 1.65Z"
                        fill="#fff" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="modal-title">Credit Top-up Plans</h2>
                    <p class="modal-subtitle">Choose a plan to top up your credits instantly</p>
                  </div>
                </div>
                <button class="modal-close-btn" @click="closeModal" aria-label="Close">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Modal Body -->
              <div class="credit-modal-body">

                <!-- Loading State -->
                <div v-if="loading" class="loading-state">
                  <div class="spinner"></div>
                  <p>Loading plans...</p>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="error-state">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff4d4f" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                  </svg>
                  <p>Failed to load plans. Please try again.</p>
                  <button class="retry-btn" @click="fetchPlans">Retry</button>
                </div>

                <!-- Plans Grid -->
                <div v-else-if="plans.length" class="plans-grid">
                  <div
                    v-for="(plan, index) in plans"
                    :key="plan.id"
                    class="plan-card"
                    :class="{ 'plan-card--featured': isFeatured(index) }"
                    @click="selectPlan(plan)"
                    :style="isFeatured(index) ? '' : ''"
                  >
                    <!-- Featured Badge -->
                    <div v-if="isFeatured(index)" class="featured-badge">Best Value</div>

                    <!-- Credits Display -->
                    <div class="plan-credits-wrap">
                      <div class="plan-star-icon">
                        <svg width="16" height="16" viewBox="0 0 33 33" fill="none">
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M16.5 0C7.38705 0 0 7.38705 0 16.5C0 25.6129 7.38705 33 16.5 33C25.6129 33 33 25.6129 33 16.5C33 7.38705 25.6129 0 16.5 0ZM16.5 1.65C16.5 5.58846 14.9355 9.36562 12.1505 12.1505C9.36562 14.9355 5.58846 16.5 1.65 16.5C5.58846 16.5 9.36562 18.0645 12.1505 20.8495C14.9355 23.6344 16.5 27.4115 16.5 31.35C16.5 27.4115 18.0645 23.6344 20.8495 20.8495C23.6344 18.0645 27.4115 16.5 31.35 16.5C27.4115 16.5 23.6344 14.9355 20.8495 12.1505C18.0645 9.36562 16.5 5.58846 16.5 1.65Z"
                            :fill="isFeatured(index) ? '#fff' : '#3B63FB'" />
                        </svg>
                      </div>
                      <span class="plan-credits-count">{{ Number(plan.credits_count).toLocaleString() }}</span>
                      <span class="plan-credits-label">credits</span>
                    </div>

                    <!-- Price -->
                    <div class="plan-price-wrap">
                      <span class="plan-currency">$</span>
                      <span class="plan-price">{{ plan.price }}</span>
                    </div>

                    <!-- Per credit rate -->
                    <p class="plan-rate">
                      ${{ (plan.price / plan.credits_count).toFixed(4) }} per credit
                    </p>

                    <!-- CTA Button -->
                    <button
                      class="plan-buy-btn"
                      :class="{ 'plan-buy-btn--featured': isFeatured(index) }"
                      @click.stop="handleBuy(plan)"
                      :disabled="buyingId === plan.id"
                    >
                      <span v-if="buyingId === plan.id" class="btn-spinner"></span>
                      <span v-else>Buy Now</span>
                    </button>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="empty-state">
                  <p>No top-up plans available at the moment.</p>
                </div>

              </div>

              <!-- Modal Footer -->
              <div class="credit-modal-footer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8c8c8c" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Secure payment · Credits are added instantly after purchase</span>
              </div>

            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script>
export default {
  name: 'CreditTopupModal',

  props: {
    /**
     * API base URL — pass this.$store.state.root_api
     */
    rootApi: {
      type: String,
      required: true,
    },
    /**
     * Remaining credits to display in the trigger card
     */
    remainingCredits: {
      type: Number,
      default: 0,
    },
  },

  emits: ['purchased'],

  data() {
    return {
      isOpen: false,
      loading: false,
      error: false,
      plans: [],
      buyingId: null,
    };
  },

  methods: {
    openModal() {
      this.isOpen = true;
      document.body.style.overflow = 'hidden';
      if (!this.plans.length) {
        this.fetchPlans();
      }
    },

    closeModal() {
      this.isOpen = false;
      document.body.style.overflow = '';
      this.buyingId = null;
    },

    isFeatured(index) {
      // Mark the middle plan (or second plan) as featured
      return index === Math.floor(this.plans.length / 2);
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

    selectPlan(plan) {
      // Optional: highlight selected plan
    },

    handleBuy(plan) {
      this.buyingId = plan.id;
      // Small delay for UX feedback before navigating
      setTimeout(() => {
        this.closeModal();
        this.$router.push(`/make-payment-credit-topup/${plan.id}`);
        this.$emit('purchased', plan);
      }, 300);
    },
  },
};
</script>

<style scoped>
/* ─── Modal Overlay ──────────────────────────────────────────────────── */
.credit-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 20, 50, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.credit-modal-container {
  background: #fff;
  border-radius: 24px;
  width: 100%;
  max-width: 860px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(59, 99, 251, 0.18), 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* ─── Header ─────────────────────────────────────────────────────────── */
.credit-modal-header {
  background: linear-gradient(135deg, #201b85 0%, #3B63FB 100%);
  padding: 24px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-title {
  margin: 0 0 2px;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  line-height: 1.3;
}

.modal-subtitle {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
}

.modal-close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: background 0.2s;
  flex-shrink: 0;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.28);
}

/* ─── Body ───────────────────────────────────────────────────────────── */
.credit-modal-body {
  padding: 28px;
  overflow-y: auto;
  flex: 1;
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  gap: 16px;
  color: #8c8c8c;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e5e7eb;
  border-top-color: #3B63FB;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px;
  color: #8c8c8c;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  text-align: center;
}

.retry-btn {
  padding: 8px 24px;
  background: #3B63FB;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover { background: #2a50e0; }

/* Empty */
.empty-state {
  text-align: center;
  padding: 48px;
  color: #8c8c8c;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
}

/* ─── Plans Grid ─────────────────────────────────────────────────────── */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.plan-card {
  position: relative;
  background: #f8f9ff;
  border: 2px solid rgba(59, 99, 251, 0.1);
  border-radius: 20px;
  padding: 28px 20px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(59, 99, 251, 0.14);
  border-color: rgba(59, 99, 251, 0.3);
}

.plan-card--featured {
  background: linear-gradient(145deg, #201b85 0%, #3B63FB 100%);
  border-color: transparent;
  transform: scale(1.04);
  box-shadow: 0 16px 40px rgba(59, 99, 251, 0.32);
}

.plan-card--featured:hover {
  transform: scale(1.04) translateY(-4px);
  box-shadow: 0 20px 48px rgba(59, 99, 251, 0.38);
}

/* Featured badge */
.featured-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #fbbf24;
  color: #78350f;
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 20px;
  white-space: nowrap;
  letter-spacing: 0.3px;
}

/* Credits display */
.plan-credits-wrap {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 8px;
}

.plan-star-icon {
  display: flex;
  align-items: center;
  margin-bottom: 2px;
}

.plan-credits-count {
  font-family: 'Poppins', sans-serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  color: #1f2937;
}

.plan-card--featured .plan-credits-count {
  color: #fff;
}

.plan-credits-label {
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}

.plan-card--featured .plan-credits-label {
  color: rgba(255, 255, 255, 0.75);
}

/* Price */
.plan-price-wrap {
  display: flex;
  align-items: flex-start;
  gap: 2px;
  margin-top: 4px;
}

.plan-currency {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #3B63FB;
  margin-top: 4px;
}

.plan-card--featured .plan-currency {
  color: rgba(255, 255, 255, 0.85);
}

.plan-price {
  font-family: 'Poppins', sans-serif;
  font-size: 40px;
  font-weight: 700;
  line-height: 1;
  color: #3B63FB;
}

.plan-card--featured .plan-price {
  color: #fff;
}

/* Per credit rate */
.plan-rate {
  margin: 2px 0 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  color: #9ca3af;
}

.plan-card--featured .plan-rate {
  color: rgba(255, 255, 255, 0.6);
}

/* Buy Button */
.plan-buy-btn {
  width: 100%;
  padding: 11px 20px;
  border-radius: 10px;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: #3B63FB;
  color: #fff;
  transition: background 0.2s, transform 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: auto;
}

.plan-buy-btn:hover:not(:disabled) {
  background: #2a50e0;
  transform: translateY(-1px);
}

.plan-buy-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.plan-buy-btn--featured {
  background: #fff;
  color: #201b85;
}

.plan-buy-btn--featured:hover:not(:disabled) {
  background: #f0f2ff;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

.plan-buy-btn--featured .btn-spinner {
  border-color: rgba(32, 27, 133, 0.25);
  border-top-color: #201b85;
}

/* ─── Footer ─────────────────────────────────────────────────────────── */
.credit-modal-footer {
  padding: 14px 28px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  color: #8c8c8c;
  flex-shrink: 0;
}

/* ─── Transitions ────────────────────────────────────────────────────── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.36, 0.64, 1);
}
.modal-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.modal-slide-enter-from {
  opacity: 0;
  transform: scale(0.92) translateY(16px);
}
.modal-slide-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}

/* ─── Responsive ─────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .credit-modal-body {
    padding: 20px 16px;
  }

  .plans-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .plan-card--featured {
    transform: none;
  }

  .plan-card--featured:hover {
    transform: translateY(-4px);
  }

  .credit-modal-header {
    padding: 20px;
  }

  .modal-title {
    font-size: 17px;
  }
}
</style>