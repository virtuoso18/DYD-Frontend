<template>
  <div>
    <div class="block md:hidden">
      <h2 class="m-0 pl-4 flex items-center gap-2 text-[#262626] text-[clamp(18px,4vw,24px)] font-semibold">
        Manage Subscription
      </h2>
    </div>
  </div>

  <div class="p-4 bg-white min-h-[100vh] md:min-h-[136vh] xl:min-h-[170vh] 2xl:min-h-[150vh] !my-3 !mr-2 shadow-sm rounded-[20px]">
    <div class="max-w-[1200px] mx-auto">

      <!-- Header -->
      <div class="hidden md:flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <h2 class="m-0 text-[#262626] text-[clamp(18px,4vw,24px)] font-semibold">
          Manage Subscription
        </h2>
        <a-button
          type="text"
          class="!p-0 !text-[#E33827] !font-[Poppins] !font-medium !text-[12px] !leading-[20px] !tracking-[0] !no-underline flex items-center justify-center gap-[6px] mx-auto"
          @click="handleCancelSubscription"
        >
          ✕ Cancel Subscription
        </a-button>
      </div>

      <!-- Subscription Card -->
      <div class="mb-6">

        <!-- Mobile Card -->
        <div v-if="currentPlan !== null" class="md:hidden w-full h-full text-white">
          <div class="bg-[#3B63FB] rounded-t-3xl">
            <div class="bg-white border border-[#3B63FB] border-4 rounded-[20px] px-6 py-4 flex justify-between items-start">
              <div class="text-left">
                <h3 class="m-0 mb-1 font-[Poppins] font-medium text-[24px] leading-[32px] tracking-[-0.02em] text-center text-[#1a1a1a] uppercase">
                  {{ currentSubscription?.plan_name }}
                </h3>
                <p class="!font-[Poppins] !font-normal !text-[10px] !leading-[20px] !tracking-[0] !text-right !text-[#8c8c8c] uppercase m-0">
                  BILLED MONTHLY
                </p>
              </div>
              <a-button type="link" @click="$router.push('/pricing')"
                class="!p-0 !text-[#3B63FB] !font-[Poppins] !font-medium !text-[14px] !leading-[20px] !tracking-[0] !no-underline flex items-center gap-[6px] align-middle">
                <span class="flex items-center">View all plans</span>
                <span class="px-2 translate-y-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </a-button>
            </div>
          </div>
          <div class="bg-[#3B63FB] rounded-b-[20px] px-6 py-1 flex justify-between items-center">
            <div class="text-left">
              <h1 class="text-[clamp(36px,9vw,48px)] text-white m-0 font-bold leading-none">
                ${{ currentSubscription?.monthly_charges }}
              </h1>
              <p class="text-white/90 m-0 text-sm mt-1">{{ currentSubscription?.plan_credits }} credits / month</p>
            </div>
            <div class="flex items-center">
              <template v-if="currentPlan === 'basic'">
                <a-button size="large" @click="handleUpgrade('standard')"
                  class="!bg-white !text-black !font-[500] !border-none rounded-lg font-semibold px-4 h-10 text-xs">
                  Upgrade to Standard
                </a-button>
              </template>
              <template v-else-if="currentPlan === 'standard'">
                <a-button size="large" @click="handleUpgrade('premium')"
                  class="!bg-white !text-black !font-[500] !border-none rounded-lg font-semibold px-4 h-10 text-xs">
                  Upgrade to Premium
                </a-button>
              </template>
              <template v-else-if="currentPlan === 'premium'">
                <span class="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">✓ Top Plan</span>
              </template>
            </div>
          </div>
        </div>

        <!-- Cancel Subscription (Mobile Only) -->
        <div class="md:hidden text-center py-2 mt-4">
          <a-button type="link" @click="handleCancelSubscription"
            class="!p-0 !text-[#E33827] !font-[Poppins] !font-medium !text-[12px] !leading-[20px] !tracking-[0] !no-underline flex items-center justify-center gap-[6px] mx-auto">
            <span class="text-[12px] pr-2 leading-none">✕</span>
            <span>Cancel Subscription</span>
          </a-button>
        </div>

        <!-- Desktop Subscription Card -->
        <div v-if="currentPlan !== null" class="bg-[#3B63FB] hidden md:flex rounded-[20px] w-full min-h-[160px] p-2 items-center shadow-[0_4px_16px_rgba(79,124,255,0.3)]">
          <div class="relative w-full h-full flex items-stretch">
            <div class="bg-white w-[75%] rounded-[15px] p-5 flex flex-col justify-center min-h-[114px]">
              <h3 class="text-[clamp(24px,3vw,32px)] font-semibold text-[#262626] font-[Poppins] uppercase">
                {{ currentSubscription?.plan_name }}
              </h3>
              <p class="m-0 text-[#8c8c8c] text-xs uppercase font-[Poppins]">BILLED MONTHLY</p>
              <a-button
                type="link"
                class="!p-0 !text-[#3B63FB] !font-[Poppins] font-medium translate-x-[-40%] flex items-center gap-1"
                @click="$router.push('/pricing')"
              >
                <span>View all plans</span>
                <span class="translate-y-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </a-button>
            </div>
            <div class="absolute right-0 top-0 bottom-0 bg-[#3B63FB] rounded-r-[15px] px-4 py-5 flex flex-col justify-center items-center text-center w-[25%]">
              <h1 class="text-[clamp(32px,4vw,45px)] text-white m-0 mb-2 font-bold font-[Poppins] leading-[36px]">
                ${{ currentSubscription?.monthly_charges }}
              </h1>
              <p class="text-white/90 m-0 mb-4 text-[clamp(12px,2.5vw,14px)] font-[Poppins] leading-[20px]">
                {{ currentSubscription?.plan_credits }} credits / month
              </p>
              <template v-if="currentPlan === 'basic'">
                <div class="flex flex-row gap-2 w-full">
                  <button @click="handleUpgrade('standard')"
                    class="bg-white !text-gray-700 whitespace-nowrap !font-[Poppins] font-semibold rounded-lg !px-3 h-9 w-full transition-all duration-500 ease-out hover:scale-105 !text-[11px]">Upgrade to Standard</button>
                  <button @click="handleUpgrade('premium')"
                    class="bg-white !text-gray-700 whitespace-nowrap !font-[Poppins] font-semibold rounded-lg !px-3 h-9 w-full transition-all duration-500 ease-out hover:scale-105 !text-[11px]">Upgrade to Premium</button>
                </div>
              </template>
              <template v-else-if="currentPlan === 'standard'">
                <button @click="handleUpgrade('premium')"
                  class="bg-white !text-gray-700 font-semibold rounded-lg px-4 h-9 w-full transition-all duration-500 ease-out hover:scale-105 text-sm">Upgrade to Premium</button>
              </template>
              <template v-else-if="currentPlan === 'premium'">
                <span class="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">✓ Top Plan</span>
              </template>
            </div>
          </div>
        </div>

        <!-- No Plan: Show Available Plans -->
        <div v-else class="mt-10">
          <h3 class="m-0 mb-6 text-[clamp(18px,3.5vw,20px)] font-semibold text-[#262626]">Available Plans</h3>

          <div v-if="pricingData" class="pricing-cards">

            <!-- Basic Card -->
            <div class="pricing-card basic-card">
              <div class="plan-status-badge current-badge" v-if="currentPlan === 'basic'">✦ Current Plan</div>
              <div class="card-header">
                <h3 class="plan-name">Basic</h3>
                <p class="plan-subtitle">Basic Plan</p>
              </div>
              <div class="price-section">
                <span class="currency">$</span>
                <span class="price">{{ pricingData.basic.monthly_charges }}</span>
                <p class="billing-period">{{ pricingData.basic.plan_credits }} credits / month</p>
              </div>
              <button v-if="currentPlan === 'basic'" class="get-started-btn basic-btn btn-disabled" disabled>Active Plan</button>
              <button v-else-if="planRank(currentPlan) > planRank('basic')" class="get-started-btn basic-btn btn-disabled" disabled>Not Available</button>
              <button v-else class="get-started-btn basic-btn" @click="$router.push('/make-payment/basic')">Get Started</button>
              <div class="features-list">
                <div v-for="(feature, index) in pricingData.basic.description_list" :key="index" class="feature-item">
                  <span class="checkmark">✓</span>
                  <span>{{ feature }}</span>
                </div>
              </div>
            </div>

            <!-- Standard Card -->
            <div class="pricing-card standard-card">
              <div class="plan-status-badge current-badge-standard" v-if="currentPlan === 'standard'">✦ Current Plan</div>
              <div class="card-header">
                <h3 class="plan-name">Standard</h3>
                <p class="plan-subtitle">MOST POPULAR</p>
              </div>
              <div class="price-section">
                <span class="currency">$</span>
                <span class="price">{{ pricingData.standard.monthly_charges }}</span>
                <p class="billing-period">{{ pricingData.standard.plan_credits }} credits / month</p>
              </div>
              <button v-if="currentPlan === 'standard'" class="get-started-btn standard-btn btn-disabled" disabled>Active Plan</button>
              <button v-else-if="planRank(currentPlan) > planRank('standard')" class="get-started-btn standard-btn btn-disabled" disabled>Not Available</button>
              <button v-else-if="planRank(currentPlan) > 0 && planRank(currentPlan) < planRank('standard')" class="get-started-btn standard-btn" @click="$router.push('/make-payment-upgrade/standard')">Upgrade to Standard</button>
              <button v-else class="get-started-btn standard-btn" @click="$router.push('/make-payment/standard')">Get Started</button>
              <div class="features-list">
                <div v-for="(feature, index) in pricingData.standard.description_list" :key="index" class="feature-item">
                  <span class="checkmark">✓</span>
                  <span>{{ feature }}</span>
                </div>
              </div>
            </div>

            <!-- Premium Card -->
            <div class="pricing-card premium-card">
              <div class="plan-status-badge current-badge" v-if="currentPlan === 'premium'">✦ Current Plan</div>
              <div class="card-header">
                <h3 class="plan-name">Premium</h3>
                <p class="plan-subtitle">For Organization</p>
              </div>
              <div class="price-section">
                <span class="currency">$</span>
                <span class="price">{{ pricingData.premium.monthly_charges }}</span>
                <p class="billing-period">{{ pricingData.premium.plan_credits }} Customizable credit / month</p>
              </div>
              <button v-if="currentPlan === 'premium'" class="get-started-btn premium-btn btn-disabled" disabled>Active Plan</button>
              <button v-else-if="planRank(currentPlan) > 0 && planRank(currentPlan) < planRank('premium')" class="get-started-btn premium-btn" @click="$router.push('/make-payment-upgrade/premium')">Upgrade to Premium</button>
              <button v-else class="get-started-btn premium-btn" @click="$router.push('/make-payment/premium')">Get Started</button>
              <div class="features-list">
                <div v-for="(feature, index) in pricingData.premium.description_list" :key="index" class="feature-item">
                  <span class="checkmark">✓</span>
                  <span>{{ feature }}</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Loading state for cards -->
          <div v-else class="flex justify-center items-center py-12">
            <a-spin tip="Loading plans..." />
          </div>
        </div>

      </div>

      <!-- Credits Section -->
      <div class="pt-8">
        <CreditTopupModal
          :root-api="$store.state.root_api"
          :remaining-credits="liveCredits"
          @purchased="handleCreditsPurchased"
        />

        <!-- Free Credits Section -->
        <!-- <div class="bg-white !my-2 rounded-xl p-4 border-2 border-[rgba(79,124,255,0.1)]">
          <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div class="flex items-start gap-3 flex-row">
              <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M16.5 0C7.38705 0 0 7.38705 0 16.5C0 25.6129 7.38705 33 16.5 33C25.6129 33 33 25.6129 33 16.5C33 7.38705 25.6129 0 16.5 0ZM16.5 1.65C16.5 5.58846 14.9355 9.36562 12.1505 12.1505C9.36562 14.9355 5.58846 16.5 1.65 16.5C5.58846 16.5 9.36562 18.0645 12.1505 20.8495C14.9355 23.6344 16.5 27.4115 16.5 31.35C16.5 27.4115 18.0645 23.6344 20.8495 20.8495C23.6344 18.0645 27.4115 16.5 31.35 16.5C27.4115 16.5 23.6344 14.9355 20.8495 12.1505C18.0645 9.36562 16.5 5.58846 16.5 1.65Z" fill="#3B63FB" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="m-0 mb-2 !font-[Poppins] !font-medium !text-[16px] !leading-[24px] !tracking-[0] text-[#262626]">Get Free Credits</h4>
                <p class="m-0 !font-[Poppins] !font-normal !text-[10px] md:w-80 !leading-[16px] !tracking-[0] text-[#8c8c8c]">
                  Claim your free credits bonus now and start using premium features instantly!
                </p>
              </div>
            </div>
            <div class="flex items-center px-4 justify-between text-center md:text-right">
              <button @click="handleBuyFreeCredits" :disabled="freeCreditsLoading || !isEligibleForFreeCredits"
                class="!font-[Poppins] !font-normal bg-[#3B63FB] !text-white rounded-lg px-6 py-2.5 transition-all duration-[800ms] ease-out hover:bg-[#3b63fb] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                <span v-if="!freeCreditsLoading">Get Free Credits</span>
                <span v-else class="flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              </button>
            </div>
          </div>
        </div> -->
      </div>

      <!-- History Section -->
      <div>
        <div class="bg-white rounded-xl p-4 border-[rgba(79,124,255,0.1)]">
          <h3 class="m-0 mb-6 text-[clamp(18px,3.5vw,20px)] font-semibold text-[#262626]">History</h3>

          <div>
            <!-- Custom Tabs -->
            <div class="border-b border-[#f0f0f0]">
              <div class="flex gap-8">
                <button
                  @click="activeTab = 'subscription'"
                  :class="[
                    'pb-3 px-1 text-sm font-medium !text-gray-700 border-b-2 transition-colors',
                    activeTab === 'subscription'
                      ? 'border-[#3B63FB] text-[#3B63FB]'
                      : 'border-transparent text-[#8c8c8c] hover:text-[#262626]'
                  ]"
                >
                  Subscription
                </button>
                <button
                  @click="activeTab = 'credits'"
                  :class="[
                    'pb-3 px-1 text-sm font-medium !text-gray-700 border-b-2 transition-colors',
                    activeTab === 'credits'
                      ? 'border-[#3B63FB] text-[#3B63FB]'
                      : 'border-transparent text-[#8c8c8c] hover:text-[#262626]'
                  ]"
                >
                  Credits
                </button>
                <button
                  @click="activeTab = 'credits_used'"
                  :class="[
                    'pb-3 px-1 text-sm font-medium !text-gray-700 border-b-2 transition-colors',
                    activeTab === 'credits_used'
                      ? 'border-[#3B63FB] text-[#3B63FB]'
                      : 'border-transparent text-[#8c8c8c] hover:text-[#262626]'
                  ]"
                >
                  Credits Used
                </button>
              </div>
            </div>

            <!-- Tab Content -->
            <div class="mt-6">

              <!-- Subscription Tab -->
              <div v-show="activeTab === 'subscription'">
                <div v-if="loading" class="spinner-sec w-full h-[80vh] flex justify-center items-center">
                  <a-spin tip="Loading..."></a-spin>
                </div>
                <div v-else>
                  <!-- Desktop Table -->
                  <div class="hidden md:block overflow-x-auto">
                    <table class="w-full text-sm border-collapse">
                      <thead>
                        <tr class="border-b border-[#f0f0f0]">
                          <th class="text-left py-3 px-4 font-medium text-[#8c8c8c] text-xs">Plan</th>
                          <th class="text-left py-3 px-4 font-medium text-[#8c8c8c] text-xs">Date</th>
                          <th class="text-left py-3 px-4 font-medium text-[#8c8c8c] text-xs">Expire Date</th>
                          <th class="text-left py-3 px-4 font-medium text-[#8c8c8c] text-xs">Payment method</th>
                          <th class="text-left py-3 px-4 font-medium text-[#8c8c8c] text-xs">Billed</th>
                          <th class="text-left py-3 px-4 font-medium text-[#8c8c8c] text-xs">Price</th>
                          <th class="text-left py-3 px-4 font-medium text-[#8c8c8c] text-xs">Action</th>
                          <th class="text-left py-3 px-4 font-medium text-[#8c8c8c] text-xs">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="record in tableData_subscriptions" :key="record.key"
                          class="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors">
                          <td class="py-4 px-4 font-medium text-[#262626]">{{ record.plan }}</td>
                          <td class="py-4 px-4 font-medium text-[#262626]">{{ formatDate(record.date) }}</td>
                          <td class="py-4 px-4 font-medium text-[#262626]">{{ formatDate(record.expireDate) }}</td>
                          <td class="py-4 px-4">
                            <div class="flex items-center gap-2">
                              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' rx='2' fill='%231A1F71'/%3E%3Cpath d='M8.5 4.5h7v7h-7z' fill='%23fff'/%3E%3C/svg%3E" alt="Visa" class="w-5 h-[14px]" />
                              <span class="text-[#8c8c8c] text-sm">Debit Card</span>
                            </div>
                          </td>
                          <td class="py-4 px-4 text-[#262626]">{{ record.billed }}</td>
                          <td class="py-4 px-4 text-[#1890ff] font-semibold">${{ record.price }}</td>
                          <td class="py-4 px-4">
                            <button @click="downloadInvoice(record.innovice)" class="text-[#1890ff] text-sm hover:underline">Download invoice</button>
                          </td>
                          <td class="py-4 px-4 text-[#52c41a] font-medium">{{ record.status }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!-- Mobile Cards -->
                  <div class="block md:hidden space-y-3 pt-4 px-2">
                    <div v-for="record in tableData_subscriptions" :key="record.key"
                      class="bg-white rounded-lg !my-2 border border-[#f0f0f0] p-3 shadow-sm">
                      <div class="flex justify-between items-start mb-3">
                        <div>
                          <div class="text-xs text-[#8c8c8c] mb-1">Plan</div>
                          <div class="font-semibold text-[#262626] text-sm">{{ record.plan }}</div>
                        </div>
                        <span class="text-xs font-medium text-[#52c41a] bg-[#f6ffed] px-2 py-1 rounded">{{ record.status }}</span>
                      </div>
                      <div class="grid grid-cols-2 gap-3 mb-3 pb-3 py-2 border-b border-[#f0f0f0]">
                        <div>
                          <div class="text-xs text-[#8c8c8c] mb-1">Start Date</div>
                          <div class="text-xs font-medium text-[#262626]">{{ formatDateShort(record.date) }}</div>
                        </div>
                        <div>
                          <div class="text-xs text-[#8c8c8c] mb-1">Expire Date</div>
                          <div class="text-xs font-medium text-[#262626]">{{ formatDateShort(record.expireDate) }}</div>
                        </div>
                      </div>
                      <div class="flex justify-between py-2 items-center mb-3">
                        <div class="flex items-center gap-2">
                          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' rx='2' fill='%231A1F71'/%3E%3Cpath d='M8.5 4.5h7v7h-7z' fill='%23fff'/%3E%3C/svg%3E" alt="Visa" class="w-5 h-3" />
                          <span class="text-xs text-[#8c8c8c]">{{ record.billed }}</span>
                        </div>
                        <div class="text-lg font-bold text-[#1890ff]">${{ record.price }}</div>
                      </div>
                      <button @click="downloadInvoice(record.innovice)"
                        class="w-full py-1 !font-family-poppins !text-[10px] text-[#1890ff] border border-[#1890ff] rounded hover:bg-[#e6f7ff] transition-colors">
                        Download Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Credits Tab -->
              <div v-show="activeTab === 'credits'">
                <div v-if="loading" class="spinner-sec w-full h-[80vh] flex justify-center items-center">
                  <a-spin tip="Loading..."></a-spin>
                </div>
                <div v-else>
                  <!-- Desktop Table -->
                  <div class="hidden md:block overflow-x-auto">
                    <table class="w-full text-sm border-collapse">
                      <thead>
                        <tr class="border-b border-[#f0f0f0]">
                          <th class="text-left py-3 px-4 font-medium text-[#8c8c8c] text-xs">Purchase date</th>
                          <th class="text-left py-3 px-4 font-medium text-[#8c8c8c] text-xs">Purchase Credits</th>
                          <th class="text-left py-3 px-4 font-medium text-[#8c8c8c] text-xs">Price</th>
                          <th class="text-left py-3 px-4 font-medium text-[#8c8c8c] text-xs">Action</th>
                          <th class="text-left py-3 px-4 font-medium text-[#8c8c8c] text-xs">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="record in tableData_credits" :key="record.key"
                          class="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors">
                          <td class="py-4 px-4 font-medium text-[#262626]">{{ formatDate(record.purchase_date) }}</td>
                          <td class="py-4 px-4 font-medium text-[#262626] text-center">{{ record.purchased_credits }}</td>
                          <td class="py-4 px-4 text-[#1890ff] font-semibold">${{ record.price }}</td>
                          <td class="py-4 px-4">
                            <button @click="downloadInvoice(record.innovice)" class="text-[#1890ff] text-sm hover:underline">Download invoice</button>
                          </td>
                          <td class="py-4 px-4 text-[#52c41a] font-medium">{{ record.status }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!-- Mobile Table -->
                  <div class="block md:hidden overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead class="border-b border-[#f0f0f0]">
                        <tr>
                          <th class="text-left py-3 px-2 font-medium text-[#8c8c8c] text-xs">Plan</th>
                          <th class="text-left py-3 px-2 font-medium text-[#8c8c8c] text-xs">Date</th>
                          <th class="text-left py-3 px-2 font-medium text-[#8c8c8c] text-xs">Expire Date</th>
                          <th class="text-left py-3 px-2 font-medium text-[#8c8c8c] text-xs">Payment method</th>
                          <th class="text-left py-3 px-2 font-medium text-[#8c8c8c] text-xs">Billed</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="record in tableData_credits" :key="record.key" class="border-b border-[#f0f0f0]">
                          <td class="py-3 px-2 font-medium text-[#262626]">{{ record.plan }}</td>
                          <td class="py-3 px-2 text-[#262626] whitespace-nowrap">{{ formatDateShort(record.date) }}</td>
                          <td class="py-3 px-2 text-[#262626] whitespace-nowrap">-</td>
                          <td class="py-3 px-2">
                            <div class="flex items-center gap-1">
                              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' rx='2' fill='%231A1F71'/%3E%3Cpath d='M8.5 4.5h7v7h-7z' fill='%23fff'/%3E%3C/svg%3E" alt="Visa" class="w-4 h-3" />
                              <span class="text-[#595959] text-xs">Debit Card</span>
                            </div>
                          </td>
                          <td class="py-3 px-2 text-[#262626]">{{ record.billed || 'Yearly' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Credits Used Tab -->
              <div v-show="activeTab === 'credits_used'">
                <!-- Desktop Table -->
                <div class="hidden md:block overflow-x-auto">
                  <table class="w-full text-sm border-collapse">
                    <thead>
                      <tr class="border-b border-[#f0f0f0]">
                        <th class="text-left py-3 px-4 font-medium text-[#8c8c8c] text-xs">Date</th>
                        <th class="text-left py-3 px-4 font-medium text-[#8c8c8c] text-xs">Type</th>
                        <th class="text-left py-3 px-4 font-medium text-[#8c8c8c] text-xs">Credits Used</th>
                        <th class="text-left py-3 px-4 font-medium text-[#8c8c8c] text-xs">Status</th>
                        <th class="text-left py-3 px-4 font-medium text-[#8c8c8c] text-xs">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="transaction in creditsConsumptions" :key="transaction.id"
                        class="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors">
                        <td class="py-4 px-4 font-medium text-[#262626]">{{ formatDate(transaction.created_at) }}</td>
                        <td class="py-4 px-4 text-[#262626]">
                          <span :class="[
                            'px-3 py-1 rounded-full text-xs font-medium',
                            transaction.type === 'consume' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          ]">
                            {{ transaction.type === 'consume' ? 'Consumed' : 'Deposited' }}
                          </span>
                        </td>
                        <td class="py-4 px-4 font-semibold"
                          :class="transaction.credits_changed < 0 ? 'text-red-600' : 'text-green-600'">
                          {{ transaction.credits_changed }}
                        </td>
                        <td class="py-4 px-4">
                          <span :class="[
                            'px-3 py-1 rounded-full text-xs font-medium',
                            transaction.status === 'success' ? 'bg-green-100 text-green-700'
                              : transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          ]">
                            {{ transaction.status }}
                          </span>
                        </td>
                        <td class="py-4 px-4 text-[#8c8c8c] text-sm max-w-xs truncate">
                          {{ transaction.description || '-' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Mobile Cards -->
                <div class="block md:hidden">
                  <div class="space-y-3">
                    <div v-for="transaction in creditsConsumptions" :key="transaction.id"
                      class="bg-[#fafafa] rounded-lg p-3 border border-[#f0f0f0]">
                      <div class="flex justify-between items-start mb-2">
                        <span class="font-medium text-[#262626]">{{ formatDateShort(transaction.created_at) }}</span>
                        <span :class="[
                          'px-2 py-1 rounded text-xs font-medium',
                          transaction.status === 'success' ? 'bg-green-100 text-green-700'
                            : transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        ]">
                          {{ transaction.status }}
                        </span>
                      </div>
                      <div class="flex justify-between mb-2">
                        <span class="text-[#8c8c8c] text-xs">Type:</span>
                        <span class="text-[#262626]">{{ transaction.type === 'consume' ? 'Consumed' : 'Deposited' }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-[#8c8c8c] text-xs">Credits:</span>
                        <span :class="transaction.credits_changed < 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'">
                          {{ transaction.credits_changed }}
                        </span>
                      </div>
                      <div v-if="transaction.description" class="text-[#8c8c8c] text-xs mt-2">
                        {{ transaction.description }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Pagination -->
                <div class="mt-6 flex justify-center">
                  <a-pagination
                    v-model:current="paginationConfig.current"
                    :page-size="paginationConfig.pageSize"
                    :total="paginationConfig.total"
                    :show-total="paginationConfig.showTotal"
                    :show-quick-jumper="paginationConfig.showQuickJumper"
                    @change="handlePaginationChange"
                  />
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="flex justify-center items-center py-8">
                  <a-spin size="large" />
                </div>

                <!-- Error State -->
                <div v-if="error && !loading" class="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                  <p class="text-red-700 text-sm">{{ error }}</p>
                </div>

                <!-- Empty State -->
                <div v-if="creditsConsumptions.length === 0 && !loading && !error" class="text-center py-8">
                  <p class="text-[#8c8c8c]">No credit transactions found</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { notification } from "ant-design-vue";
import CreditTopupModal from '@/components/dashboard/business/CreditTopUpModal.vue';

export default {
  name: 'ManageSubscription',
  components: { CreditTopupModal },
  data() {
    return {
      // Current plan state
      currentPlan: null,
      currentSubscription: null,
      pricingData: null,

      // UI state
      activeTab: 'subscription',
      loading: false,
      error: null,

      // Free credits
      freeCreditsLoading: false,
      isEligibleForFreeCredits: false,
      freeCreditsMessage: "",

      // Live credits
      liveCredits: 0,

      // History tables
      tableData_subscriptions: [],
      tableData_credits: [],

      // Credits used
      creditsConsumptions: [],
      paginationConfig: {
        current: 1,
        pageSize: 15,
        total: 0,
        showSizeChanger: false,
        showQuickJumper: true,
        showTotal: (total) => `Total ${total} transactions`
      },

      // Table column definitions
      columns: [
        { title: 'Plan', dataIndex: 'plan', key: 'plan', width: 100 },
        { title: 'Date', dataIndex: 'date', key: 'date', width: 120 },
        { title: 'Expire Date', dataIndex: 'expireDate', key: 'expireDate', width: 120 },
        { title: 'Payment method', dataIndex: 'payment', key: 'payment', width: 150 },
        { title: 'Billed', dataIndex: 'billed', key: 'billed', width: 100 },
        { title: 'Price', dataIndex: 'price', key: 'price', width: 80 },
        { title: 'Action', dataIndex: 'action', key: 'action', width: 120 },
        { title: 'Status', dataIndex: 'status', key: 'status', width: 100 }
      ],
      columns_credits_table: [
        { title: 'Purchase date', dataIndex: 'purchase_date', key: 'purchase_date', width: 100 },
        { title: 'Purchase Credits', dataIndex: 'purchased_credits', key: 'purchased_credits', width: 120 },
        { title: 'Price', dataIndex: 'price', key: 'price', width: 80 },
        { title: 'Action', dataIndex: 'action', key: 'action', width: 120 },
        { title: 'Status', dataIndex: 'status', key: 'status', width: 100 }
      ],
    };
  },

  mounted() {
    this.fetchCurrentSubscription();
    this.fetchPricingPlans();
    this.fetch_my_subscriptions();
    this.fetch_my_credits();
    this.fetch_my_credits_consumptions(1);
    this.fetch_current_credits_of_user();
    this.checkFreeCreditsEligibility();
  },

  methods: {
    // ── Plan helpers ───────────────────────────────────────────────────
    planRank(planName) {
      const ranks = { basic: 1, standard: 2, premium: 3 };
      return ranks[planName] || 0;
    },

    handleUpgrade(plan) {
      this.$router.push("/make-payment-upgrade/" + plan);
    },

    // ── Fetch pricing plans ────────────────────────────────────────────
    async fetchPricingPlans() {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Token ${token}` } : {};
        const response = await fetch(
          `${this.$store.state.root_api}subscription/api/get-all-plans/`,
          { method: "GET", headers }
        );
        const result = await response.json();
        if (result.success) {
          this.pricingData = result.data;
        }
      } catch (error) {
        console.error("Error loading pricing plans:", error);
      }
    },

    // ── Fetch current subscription ─────────────────────────────────────
    async fetchCurrentSubscription() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}subscription/api/current-subscription-plan/`,
          {
            method: "GET",
            headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
          }
        );
        const result = await response.json();
        if (response.ok && result.has_active_subscription) {
          this.currentSubscription = result.subscription;
          this.currentPlan = result.subscription.plan_name.toLowerCase();
        } else {
          this.currentPlan = null;
          this.currentSubscription = null;
        }
      } catch (error) {
        console.error("Error fetching current subscription:", error);
        this.currentPlan = null;
      }
    },

    // ── Fetch current credits count ────────────────────────────────────
    async fetch_current_credits_of_user() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}subscription/api/get-my-credits-count/`,
          {
            method: "GET",
            headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
          }
        );
        const result = await response.json();
        if (result.success) {
          this.liveCredits = result.credits_count;
        }
      } catch (error) {
        console.error("Error loading credits:", error);
      }
    },

    // ── Handle credits purchased ───────────────────────────────────────
    async handleCreditsPurchased() {
      await this.fetch_current_credits_of_user();
      await this.fetch_my_credits();
      notification.success({
        message: "Success",
        description: "Credits purchased successfully!",
        placement: "bottomRight",
        duration: 3,
      });
    },

    // ── Fetch subscription history ─────────────────────────────────────
    async fetch_my_subscriptions() {
      try {
        this.loading = true;
        this.error = null;
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}subscription/api/get-my-subscriptions-history/`,
          {
            method: 'GET',
            headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' }
          }
        );
        const result = await response.json();
        if (result) this.tableData_subscriptions = result;
      } catch (error) {
        console.error('Error loading subscription history:', error);
        this.error = 'Failed to load subscription history';
      } finally {
        this.loading = false;
      }
    },

    // ── Fetch credits history ──────────────────────────────────────────
    async fetch_my_credits() {
      try {
        this.loading = true;
        this.error = null;
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}subscription/api/get-my-credits-history/`,
          {
            method: 'GET',
            headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' }
          }
        );
        const result = await response.json();
        if (result) this.tableData_credits = result;
      } catch (error) {
        console.error('Error loading credits history:', error);
        this.error = 'Failed to load credits history';
      } finally {
        this.loading = false;
      }
    },

    // ── Fetch credits consumptions (paginated) ─────────────────────────
    async fetch_my_credits_consumptions(page = 1) {
      try {
        this.loading = true;
        this.error = null;
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}subscription/api/profesional-user-credits-consumption/?page=${page}`,
          {
            method: 'GET',
            headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' }
          }
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        if (result.results) {
          this.creditsConsumptions = result.results.transactions || [];
          this.paginationConfig.total = result.count || 0;
          this.paginationConfig.current = page;
        } else {
          this.error = result.message || 'Failed to load credits consumption';
        }
      } catch (error) {
        console.error('Error loading credits consumptions:', error);
        this.error = 'Failed to load credits consumption data';
      } finally {
        this.loading = false;
      }
    },

    handlePaginationChange(page) {
      this.paginationConfig.current = page;
      this.fetch_my_credits_consumptions(page);
    },

    // ── Free credits ───────────────────────────────────────────────────
    async handleBuyFreeCredits() {
      try {
        this.freeCreditsLoading = true;
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}subscription/api/free-credits-data/`,
          {
            method: "POST",
            headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
          }
        );
        const result = await response.json();
        if (response.ok) {
          notification.success({
            message: "Free Credits Claimed 🎉",
            description: result.message || "Free credits claimed successfully!",
            placement: "bottomRight",
            duration: 3,
          });
          await this.fetch_current_credits_of_user();
          await this.fetch_my_credits();
        } else {
          notification.error({
            message: "ERROR",
            description: result.message || "Free credits cannot be claimed",
            placement: "bottomRight",
            duration: 3,
          });
        }
      } catch (error) {
        console.error("Error claiming free credits:", error);
      } finally {
        this.freeCreditsLoading = false;
      }
    },

    async checkFreeCreditsEligibility() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}subscription/api/check-free-credits-eligibility/`,
          {
            method: "GET",
            headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
          }
        );
        const result = await response.json();
        if (response.ok && result.success) {
          this.isEligibleForFreeCredits = result.is_eligible;
          this.freeCreditsMessage = result.message;
        } else {
          this.isEligibleForFreeCredits = false;
        }
      } catch (error) {
        console.error("Error checking free credits eligibility:", error);
        this.isEligibleForFreeCredits = false;
      }
    },

    // ── Utilities ──────────────────────────────────────────────────────
    downloadInvoice(invoicePath) {
      const url = this.$store.state.root_media_api + invoicePath;
      const link = document.createElement("a");
      link.href = url;
      link.download = url.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
      });
    },

    formatDateShort(dateStr) {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric"
      });
    },

    handleBuyCredits() {
      console.log('Buy credits clicked');
    },

    handleCancelSubscription() {
      console.log('Cancel subscription clicked');
    },
  }
};
</script>

<style scoped>
/* ── Pricing Cards ──────────────────────────────────────────────────── */
.pricing-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.pricing-card {
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
}

.pricing-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.basic-card,
.premium-card {
  background: #f8f9ff;
}

.standard-card {
  background: linear-gradient(135deg, #201b85 0%, #0d00ff 100%);
  color: white;
  transform: scale(1.05);
  box-shadow: 0 8px 30px rgba(45, 45, 45, 0.3);
}

.plan-status-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.current-badge {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.current-badge-standard {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.btn-disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
  pointer-events: none;
}

.card-header {
  text-align: center;
  margin-bottom: 24px;
  margin-top: 10px;
}

.plan-name {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
}

.basic-card .plan-name,
.premium-card .plan-name {
  color: #1f2937;
}

.standard-card .plan-name {
  color: white;
}

.plan-subtitle {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.basic-card .plan-subtitle,
.premium-card .plan-subtitle {
  color: #6b7280;
}

.standard-card .plan-subtitle {
  color: rgba(255, 255, 255, 0.8);
}

.price-section {
  text-align: center;
  margin-bottom: 24px;
}

.currency {
  font-size: 24px;
  font-weight: 600;
  vertical-align: top;
  margin-right: 2px;
}

.basic-card .currency,
.premium-card .currency {
  color: #1f2937;
}

.standard-card .currency {
  color: white;
}

.price {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
}

.basic-card .price,
.premium-card .price {
  color: #1f2937;
}

.standard-card .price {
  color: white;
}

.billing-period {
  font-size: 14px;
  margin-top: 8px;
  color: #6b7280;
}

.standard-card .billing-period {
  color: rgba(255, 255, 255, 0.7);
}

.get-started-btn {
  width: 100%;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
  transition: all 0.2s ease;
}

.basic-btn,
.premium-btn {
  background: #4f46e5;
  color: white;
}

.basic-btn:hover:not(:disabled),
.premium-btn:hover:not(:disabled) {
  background: #4338ca;
}

.standard-btn {
  background: white;
  color: #2d2d2d;
}

.standard-btn:hover:not(:disabled) {
  background: #f0f0f0;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #374151;
}

.standard-card .feature-item {
  color: rgba(255, 255, 255, 0.9);
}

.checkmark {
  color: #10b981;
  margin-right: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.standard-card .checkmark {
  color: #34d399;
}

@media (max-width: 768px) {
  .pricing-cards {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .standard-card {
    transform: none;
  }
}

@media (max-width: 480px) {
  .pricing-card {
    padding: 24px 20px;
  }

  .price {
    font-size: 36px;
  }
}
</style>