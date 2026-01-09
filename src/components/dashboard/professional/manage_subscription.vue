<template>
  <div>
    <div className="block md:hidden ">
        <h2
  class="m-0 pl-4 flex items-center gap-2 text-[#262626] text-[clamp(18px,4vw,24px)] font-semibold"
>
  <!-- <svg
    width="18"
    height="18"
    viewBox="0 0 6 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.75 9.75L0.75 5.25L4.75 0.75"
      stroke="#1A1A1A"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg> -->

  Manage Subscription
</h2>

      </div>
  </div>
  <div class="p-4 bg-white min-h-[100vh] md:min-h-[136vh] xl:min-h-[170vh] 2xl:min-h-[150vh] !my-3 !mr-2 shadow-sm   rounded-[20px] ">
    
    <div class="max-w-[1200px]  mx-auto">


      <!-- Header -->

      
      <div class="hidden md:flex flex-col md:flex-row md:justify-between md:items-center  mb-6 gap-3">
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

        <div class="md:hidden w-full h-full  text-white">
  <!-- White Header Section -->
   <div className="bg-[#3B63FB] rounded-t-3xl ">

     <div class="bg-white border border-[#3B63FB] border-4 rounded-[20px]  px-6 py-4 flex justify-between items-start">
       <div class="text-left">
    <h3
  class="m-0 mb-1 font-[Poppins] font-medium text-[24px] leading-[32px] tracking-[-0.02em] text-center text-[#1a1a1a]"
>
  Basic
</h3>
        <p
  class="!font-[Poppins] !font-normal !text-[10px] !leading-[20px] !tracking-[0] !text-right !text-[#8c8c8c] uppercase m-0"
>
  BILLED YEARLY
</p>

       </div>
       <a-button
  type="link"
  class="!p-0 !text-[#3B63FB] !font-[Poppins] !font-medium !text-[14px] !leading-[20px] !tracking-[0] !no-underline flex items-center gap-[6px] align-middle"
>
  <span class="flex items-center">View all plans</span>
  <span className="px-2 translate-y-1">

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </span>
</a-button>

     </div>
   </div>

  <!-- Blue Price Section -->
  <div class="bg-[#3B63FB] rounded-b-[20px] px-6 py-1 flex justify-between items-center">
  <!-- Left side -->
  <div class="text-left">
    <h1 class="text-[clamp(36px,9vw,48px)] text-white m-0 font-bold leading-none">
      $45
    </h1>
    <p class="text-white/90 m-0 text-sm mt-1">
      1,000 credits / month
    </p>
  </div>

  <!-- Right side -->
  <div class="flex items-center">
    <a-button 
      size="large" 
      class="!bg-white !text-black !font-[500]  !border-none rounded-lg font-semibold px-6 h-10"
    >
      Upgrade to Pro
    </a-button>
  </div>
</div>

</div>

<!-- Cancel Subscription (Mobile Only - Below Card) -->
<div class="md:hidden text-center py-2 mt-4">
  <a-button
  type="link"
  @click="handleCancelSubscription"
  class="!p-0 !text-[#E33827] !font-[Poppins] !font-medium !text-[12px] !leading-[20px] !tracking-[0] !no-underline flex items-center justify-center gap-[6px] mx-auto"
>
  <span className="text-[12px] pr-2  leading-none">✕</span>
  <span>Cancel Subscription</span>
</a-button>

</div>


        <div class="bg-[#3B63FB] hidden md:flex rounded-[20px] w-full min-h-[160px] p-2 flex items-center shadow-[0_4px_16px_rgba(79,124,255,0.3)]">
          <!-- Mobile Layout -->
          

          <!-- Desktop Layout -->
          <div class="relative w-full  h-full flex items-stretch">
  <!-- Left White Block -->
  <div class="bg-white w-[70%] rounded-[15px]  p-5 flex flex-col justify-center min-h-[114px]">
    <h3 class=" text-[clamp(24px,3vw,32px)] font-semibold text-[#262626] font-[Poppins]">
      Basic
    </h3>
    <p class="m-0  text-[#8c8c8c] text-xs uppercase  font-[Poppins]">
      BILLED YEARLY
    </p>
    <a-button 
  type="link" 
  class="!p-0 !text-[#3B63FB] !font-[Poppins] font-medium translate-x-[-40%] flex items-center gap-1"
>
  <span>View all plans</span>
  <span className="translate-y-2">

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </span>
</a-button>
  </div>

  <!-- Right Blue Section -->
  <div class="absolute right-0 top-0 bottom-0 bg-[#3B63FB] rounded-r-[15px] px-6 py-5 flex flex-col justify-center items-center text-center w-[30%]">
    <h1 class="text-[clamp(32px,4vw,45px)] text-white m-0 mb-2 font-bold font-[Poppins] leading-[36px]">
      $45
    </h1>
    <p class="text-white/90 m-0 mb-4 text-[clamp(12px,2.5vw,14px)] font-[Poppins] leading-[20px]">
      1,000 credits / month
    </p>
    <button 
      class="bg-white text-[#3B63FB] font-semibold rounded-lg px-4 h-9 w-full transition-all duration-500 ease-out hover:scale-105"
    >
      Upgrade to Pro
    </button>
  </div>
</div>

        </div>
        
        <!-- Cancel Subscription (Mobile Only - Below Card) -->
        <!-- <div class=" md:hidden text-center mt-3">
          <a-button 
            type="link" 
            class="p-0 !text-[#ff4d4f] text-sm font-medium"
            @click="handleCancelSubscription"
          >
            ✕ Cancel Subscription
          </a-button>
        </div> -->
      </div>

      <!-- Credits Section -->
      <div class="pt-8">
        <div class="bg-white rounded-xl p-4 border-2 border-[rgba(79,124,255,0.1)]">
          <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div class="flex items-start gap-3 flex-row">
              <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
  <svg
    width="33"
    height="33"
    viewBox="0 0 33 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M16.5 0C7.38705 0 0 7.38705 0 16.5C0 25.6129 7.38705 33 16.5 33C25.6129 33 33 25.6129 33 16.5C33 7.38705 25.6129 0 16.5 0ZM16.5 1.65C16.5 5.58846 14.9355 9.36562 12.1505 12.1505C9.36562 14.9355 5.58846 16.5 1.65 16.5C5.58846 16.5 9.36562 18.0645 12.1505 20.8495C14.9355 23.6344 16.5 27.4115 16.5 31.35C16.5 27.4115 18.0645 23.6344 20.8495 20.8495C23.6344 18.0645 27.4115 16.5 31.35 16.5C27.4115 16.5 23.6344 14.9355 20.8495 12.1505C18.0645 9.36562 16.5 5.58846 16.5 1.65Z"
      fill="#3B63FB"
    />
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
  <!-- Left side -->
  <div>
    <span class="!font-[Poppins] md:pr-6 !font-bold !text-[28px] !leading-[36px] !tracking-[-0.02em] text-[#1890ff]">
      1,000
    </span>
  </div>

  <!-- Right side -->
  <button
    @click="handleBuyCredits"
    class="!font-[Poppins] !font-normal bg-[#3B63FB] !text-white rounded-lg px-6 py-2.5 transition-all duration-[800ms] ease-out hover:bg-[#3b63fb] active:scale-95"
  >
    Buy more Credits
  </button>
</div>

          </div>
        </div>
      </div>

      <!-- History Section -->
      <div>
        <div class="bg-white rounded-xl p-4  border-[rgba(79,124,255,0.1)]">
          <h3 class="m-0 mb-6 text-[clamp(18px,3.5vw,20px)] font-semibold text-[#262626]">
            History
          </h3>
          
          <!-- Tabs -->
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
              <tr
                v-for="record in tableData_subscriptions"
                :key="record.key"
                class="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors"
              >
                <td class="py-4 px-4 font-medium text-[#262626]">{{ record.plan }}</td>
                <td class="py-4 px-4 font-medium text-[#262626]">{{ formatDate(record.date) }}</td>
                <td class="py-4 px-4 font-medium text-[#262626]">{{ formatDate(record.expireDate) }}</td>
                <td class="py-4 px-4">
                  <div class="flex items-center gap-2">
                    <img
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' rx='2' fill='%231A1F71'/%3E%3Cpath d='M8.5 4.5h7v7h-7z' fill='%23fff'/%3E%3C/svg%3E"
                      alt="Visa"
                      class="w-5 h-[14px]"
                    />
                    <span class="text-[#8c8c8c] text-sm">Debit Card</span>
                  </div>
                </td>
                <td class="py-4 px-4 text-[#262626]">{{ record.billed }}</td>
                <td class="py-4 px-4 text-[#1890ff] font-semibold">${{ record.price }}</td>
                <td class="py-4 px-4">
                  <button
                    @click="downloadInvoice(record.innovice)"
                    class="text-[#1890ff] text-sm hover:underline"
                  >
                    Download invoice
                  </button>
                </td>
                <td class="py-4 px-4 text-[#52c41a] font-medium">{{ record.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Table View -->
        <div class="block md:hidden">
          <div class="overflow-x-auto">
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
                <tr
                  v-for="record in tableData_subscriptions"
                  :key="record.key"
                  class="border-b border-[#f0f0f0]"
                >
                  <td class="py-3 px-2 font-medium text-[#262626]">{{ record.plan }}</td>
                  <td class="py-3 px-2 text-[#262626] whitespace-nowrap">
                    {{ formatDateShort(record.date) }}
                  </td>
                  <td class="py-3 px-2 text-[#262626] whitespace-nowrap">
                    {{ formatDateShort(record.expireDate) }}
                  </td>
                  <td class="py-3 px-2">
                    <div class="flex items-center gap-1">
                      <img
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' rx='2' fill='%231A1F71'/%3E%3Cpath d='M8.5 4.5h7v7h-7z' fill='%23fff'/%3E%3C/svg%3E"
                        alt="Visa"
                        class="w-4 h-3"
                      />
                      <span class="text-[#595959] text-xs">Debit Card</span>
                    </div>
                  </td>
                  <td class="py-3 px-2 text-[#262626]">{{ record.billed }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Credits Tab -->
      <div v-show="activeTab === 'credits'">
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
              <tr
                v-for="record in tableData_credits"
                :key="record.key"
                class="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors"
              >
                <td class="py-4 px-4 font-medium text-[#262626]">{{ formatDate(record.purchase_date) }}</td>
                <td class="py-4 px-4 font-medium text-[#262626] text-center">
                  {{ record.purchased_credits }}
                </td>
                <td class="py-4 px-4 text-[#1890ff] font-semibold">${{ record.price }}</td>
                <td class="py-4 px-4">
                  <button
                    @click="downloadInvoice(record.innovice)"
                    class="text-[#1890ff] text-sm hover:underline"
                  >
                    Download invoice
                  </button>
                </td>
                <td class="py-4 px-4 text-[#52c41a] font-medium">{{ record.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Table View -->
        <div class="block md:hidden">
          <div class="overflow-x-auto">
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
                <tr
                  v-for="record in tableData_credits"
                  :key="record.key"
                  class="border-b border-[#f0f0f0]"
                >
                  <td class="py-3 px-2 font-medium text-[#262626]">{{ record.plan }}</td>
                  <td class="py-3 px-2 text-[#262626] whitespace-nowrap">
                    {{ formatDateShort(record.date) }}
                  </td>
                  <td class="py-3 px-2 text-[#262626] whitespace-nowrap">-</td>
                  <td class="py-3 px-2">
                    <div class="flex items-center gap-1">
                      <img
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' rx='2' fill='%231A1F71'/%3E%3Cpath d='M8.5 4.5h7v7h-7z' fill='%23fff'/%3E%3C/svg%3E"
                        alt="Visa"
                        class="w-4 h-3"
                      />
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
        <div v-show="activeTab === 'credits_used'">
          


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
          <!-- <th class="text-left py-3 px-4 font-medium text-[#8c8c8c] text-xs">Room</th> -->
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="transaction in creditsConsumptions"
          :key="transaction.id"
          class="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors"
        >
          <td class="py-4 px-4 font-medium text-[#262626]">
            {{ formatDate(transaction.created_at) }}
          </td>
          <td class="py-4 px-4 text-[#262626]">
            <span 
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                transaction.type === 'consume' 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-green-100 text-green-700'
              ]"
            >
              {{ transaction.type === 'consume' ? 'Consumed' : 'Deposited' }}
            </span>
          </td>
          <td class="py-4 px-4 font-semibold" :class="transaction.credits_changed < 0 ? 'text-red-600' : 'text-green-600'">
            {{ transaction.credits_changed }}
          </td>
          <td class="py-4 px-4">
            <span 
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                transaction.status === 'success' 
                  ? 'bg-green-100 text-green-700'
                  : transaction.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              ]"
            >
              {{ transaction.status }}
            </span>
          </td>
          <td class="py-4 px-4 text-[#8c8c8c] text-sm max-w-xs truncate">
            {{ transaction.description || '-' }}
          </td>
          <!-- <td class="py-4 px-4 text-[#262626]">
            {{ transaction.room || '-' }}
          </td> -->
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Mobile Table View -->
  <div class="block md:hidden">
    <div class="space-y-3">
      <div
        v-for="transaction in creditsConsumptions"
        :key="transaction.id"
        class="bg-[#fafafa] rounded-lg p-3 border border-[#f0f0f0]"
      >
        <div class="flex justify-between items-start mb-2">
          <span class="font-medium text-[#262626]">
            {{ formatDateShort(transaction.created_at) }}
          </span>
          <span 
            :class="[
              'px-2 py-1 rounded text-xs font-medium',
              transaction.status === 'success' 
                ? 'bg-green-100 text-green-700'
                : transaction.status === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            ]"
          >
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
      class="ant-pagination-custom"
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
  </div>
</template>

<script>
export default {
  name: 'ManageSubscription',
  data() {
    return {
      activeTab: 'subscription',
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
      tableData_subscriptions: [],
      tableData_credits: [],


      // ... existing data ...
    creditsConsumptions: [],
    paginationConfig: {
      current: 1,
      pageSize: 15,
      total: 0,
      showSizeChanger: false,
      showQuickJumper: true,
      showTotal: (total) => `Total ${total} transactions`
    },
    loading: false,
    error: null
    };
  },
  mounted() {
    this.fetch_my_subscriptions();
    this.fetch_my_credits();
      this.fetch_my_credits_consumptions(1);

  },
  methods: {
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
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    },
    formatDateShort(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    },
// REPLACE the fetch_my_credits_consumptions method with this:
async fetch_my_credits_consumptions(page = 1) {
  try {
    this.loading = true;
    this.error = null;
    const token = localStorage.getItem('token');
    
    const response = await fetch(
      `${this.$store.state.root_api}subscription/api/profesional-user-credits-consumption/?page=${page}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Extract data from paginated response
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

// ADD this handler method:
handlePaginationChange(page) {
  this.paginationConfig.current = page;
  this.fetch_my_credits_consumptions(page);
}
,

    async fetch_my_subscriptions() {
      try {
        this.loading = true;
        this.error = null;
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${this.$store.state.root_api}subscription/api/get-my-subscriptions-history/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const result = await response.json();
        if (result) {
          this.tableData_subscriptions = result;
        } else {
          this.error = result.message || 'Business not found';
        }
      } catch (error) {
        console.error('Error loading business data:', error);
        if (error.response?.status === 404) {
          this.error = 'Business not found';
        } else {
          this.error = 'Failed to load business information';
        }
      } finally {
        this.loading = false;
      }
    },
    async fetch_my_credits() {
      try {
        this.loading = true;
        this.error = null;
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${this.$store.state.root_api}subscription/api/get-my-credits-history/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const result = await response.json();
        if (result) {
          this.tableData_credits = result;
        } else {
          this.error = result.message || 'Business not found';
        }
      } catch (error) {
        console.error('Error loading business data:', error);
        if (error.response?.status === 404) {
          this.error = 'Business not found';
        } else {
          this.error = 'Failed to load business information';
        }
      } finally {
        this.loading = false;
      }
    },
    handleBuyCredits() {
      console.log('Buy credits clicked');
    },
    handleCancelSubscription() {
      console.log('Cancel subscription clicked');
    }
  }
};
</script>
