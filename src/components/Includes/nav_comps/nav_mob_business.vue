<template>

  <div class="pb-2">
          <button 
            @click="navigateToStore"
            class="w-full bg-gradient-to-r !font-family-poppins from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 !text-white font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-3 transition-all duration-300  transform hover:-translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 17" fill="none">
              <path d="M1.97754 7.49756V10.8321C1.97754 12.7184 1.97754 13.6616 2.56333 14.2476C3.14911 14.8336 4.09192 14.8336 5.97754 14.8336H9.97754C11.8631 14.8336 12.8059 14.8336 13.3917 14.2476C13.9775 13.6616 13.9775 12.7184 13.9775 10.8321V7.49756" stroke="white" stroke-linecap="round"/>
              <path d="M4.64453 12.4946H7.3112" stroke="white" stroke-linecap="round"/>
              <path d="M6.73554 6.11184C6.54755 6.79077 5.86386 7.96195 4.56485 8.13169C3.41789 8.28155 2.54798 7.78089 2.32578 7.57156C2.08079 7.40182 1.52245 6.85866 1.38571 6.51919C1.24897 6.17973 1.4085 5.44421 1.52245 5.14435L1.97796 3.82543C2.08916 3.49415 2.34947 2.71062 2.61635 2.4456C2.88323 2.18058 3.42355 2.16905 3.64594 2.16905H8.31627C9.51841 2.18603 12.1469 2.15833 12.6665 2.16905C13.1861 2.17977 13.4984 2.61533 13.5895 2.80203C14.3648 4.67991 14.6663 5.75539 14.6663 6.21367C14.5651 6.70255 14.1463 7.62436 12.6665 8.02982C11.1285 8.45122 10.2566 7.63162 9.98307 7.31695M6.10315 7.31695C6.31965 7.58282 6.99881 8.11809 7.98327 8.13169C8.96781 8.14522 9.81787 7.45836 10.1198 7.11326C10.2053 7.01142 10.3899 6.7093 10.5813 6.11184" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>My Store</span>
          </button>
        </div>
 <nav class="px-1 pb-6 space-y-1">
          <!-- Profile -->
          <router-link 
            to="/business-dashboard/my-profile?p=true" 
            class="flex items-center !font-family-poppins gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
            :class="{ 'nav-active': $route.name === 'business_my_profile' }" 
            @click="closeMobileMenu"
          >
            <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.5196 8.0718C18.3888 9.88748 17.0419 11.2862 15.5731 11.2862C14.1043 11.2862 12.7552 9.88792 12.6266 8.0718C12.4927 6.18291 13.8039 4.85742 15.5731 4.85742C17.3424 4.85742 18.6536 6.21728 18.5196 8.0718Z" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.5731 14.1426C12.6637 14.1426 9.8658 15.5877 9.16489 18.4021C9.07203 18.7744 9.30552 19.1427 9.68812 19.1427H21.4585C21.8411 19.1427 22.0733 18.7744 21.9818 18.4021C21.2809 15.5426 18.483 14.1426 15.5731 14.1426Z" stroke="#4D4D4D" stroke-miterlimit="10"/>
<path d="M9.49749 8.87184C9.39303 10.3219 8.3046 11.4639 7.13135 11.4639C5.95811 11.4639 4.8679 10.3223 4.76521 8.87184C4.65851 7.36331 5.71792 6.28516 7.13135 6.28516C8.54479 6.28516 9.60419 7.39099 9.49749 8.87184Z" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.76852 14.2319C8.96269 13.8627 8.07517 13.7207 7.13451 13.7207C4.81302 13.7207 2.57635 14.8748 2.01606 17.1226C1.9424 17.4199 2.12901 17.7141 2.43438 17.7141H7.44702" stroke="#4D4D4D" stroke-miterlimit="10" stroke-linecap="round"/>
</svg>

            </div>
            <span class="flex-1 text-sm !font-family-poppins">Profile</span>
            <svg class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18l6-6-6-6"/>
            </svg>
          </router-link>

          <!-- Business Detail -->
          <router-link 
            to="/business-dashboard/business-details?p=true"
            class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
            :class="{ 'nav-active': $route.name === 'business_business_details' }" 
            @click="closeMobileMenu"
          >
            <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 21H21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5 21V7L13 2L21 7V21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 9V21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17 9V21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="flex-1 text-sm !font-family-poppins">Business Detail</span>
            <svg class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18l6-6-6-6"/>
            </svg>
          </router-link>

          <!-- My Designs -->
          <router-link 
            to="/business-dashboard/my-designs?p=true"
            class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
            :class="{ 'nav-active': $route.name === 'business_my_designs' }" 
            @click="closeMobileMenu"
          >
            <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="flex-1 text-sm !font-family-poppins">My Designs</span>
            <svg class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18l6-6-6-6"/>
            </svg>
          </router-link>

          <!-- My Products -->
          <router-link 
            to="/business-dashboard/my-products?p=true" 
            class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
            :class="{ 'nav-active': $route.name === 'business_my_products' }" 
            @click="closeMobileMenu"
          >
            <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="12" y1="22.08" x2="12" y2="12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="flex-1 text-sm !font-family-poppins">My Products</span>
            <svg class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18l6-6-6-6"/>
            </svg>
          </router-link>

          <!-- Community -->
          <router-link 
            to="/business-dashboard/comunity?p=true"
            class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
            :class="{ 'nav-active': $route.name === 'business_dashboard_community' }" 
            @click="closeMobileMenu"
          >
            <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                ircle cx="9" cy="7" r="4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 21V19C23 18.1332 22.7361 17.2873 22.2458 16.5707C21.7555 15.8542 21.0617 15.3022 20.2656 14.9876" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 18.9078 6.11683 18.7176 6.95054C18.5274 7.78425 18.0661 8.53291 17.4128 9.06582C16.7595 9.59872 15.9551 9.88681 15.13 9.88681C14.3049 9.88681 13.5005 9.59872 12.8472 9.06582C12.1939 8.53291 11.7326 7.78425 11.5424 6.95054C11.3522 6.11683 11.5478 5.25392 12.0924 4.55232C12.637 3.85071 13.3996 3.35031 14.26 3.13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="flex-1 text-sm !font-family-poppins">Community</span>
            <svg class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18l6-6-6-6"/>
            </svg>
          </router-link>

          <!-- Generate Banner -->
          <router-link 
            to="/business-dashboard/generate-banner?p=true" 
            class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
            :class="{ 'nav-active': $route.name === 'business_generate_banner' }" 
            @click="closeMobileMenu"
          >
            <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="8" y1="21" x2="16" y2="21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="12" y1="17" x2="12" y2="21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="flex-1 text-sm !font-family-poppins">Generate Banner</span>
            <svg class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18l6-6-6-6"/>
            </svg>
          </router-link>

          <!-- Manage Subscription -->
          <router-link 
            to="/business-dashboard/manage-subscription?p=true" 
            class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
            :class="{ 'nav-active': $route.name === 'business_manage_subscription' }" 
            @click="closeMobileMenu"
          >
            <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="12,2 15.09,8.26 22,9 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9 8.91,8.26" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="flex-1 text-sm !font-family-poppins">Manage Subscription</span>
            <svg class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18l6-6-6-6"/>
            </svg>
          </router-link>

          <!-- Transactions -->
          <router-link 
            to="/business-dashboard/my-transactions?p=true" 
            class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
            :class="{ 'nav-active': $route.name === 'my_transactions' }" 
            @click="closeMobileMenu"
          >
            <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100">
              <svg class="w-5 h-5" viewBox="0 0 18 18" fill="none" stroke="currentColor">
                <path d="M17 7H1L6.5 1M1 11H17L11.5 17" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="flex-1 text-sm !font-family-poppins">Transactions</span>
            <svg class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18l6-6-6-6"/>
            </svg>
          </router-link>

          <!-- Divider -->
          <div class="h-px bg-gray-200 my-4"></div>

          <!-- Logout -->
          <button 
            @click="logoutAndClose"
            class="flex items-center gap-4 px-2 py-2 rounded-xl !text-red-600 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-red-50 w-full text-left"
          >
            <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center transition-all duration-200 group-hover:bg-red-100">
              <svg class="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1.81818 16C1.31818 16 0.890303 15.8261 0.534545 15.4782C0.178788 15.1304 0.000606061 14.7117 0 14.2222V1.77778C0 1.28889 0.178182 0.870518 0.534545 0.522666C0.890909 0.174815 1.31879 0.000592592 1.81818 0H7.27273C7.5303 0 7.74636 0.0853334 7.92091 0.256C8.09545 0.426666 8.18242 0.637629 8.18182 0.888888C8.18121 1.14015 8.09394 1.35141 7.92 1.52267C7.74606 1.69392 7.5303 1.77896 7.27273 1.77778H1.81818V14.2222H7.27273C7.5303 14.2222 7.74636 14.3075 7.92091 14.4782C8.09545 14.6489 8.18242 14.8598 8.18182 15.1111C8.18121 15.3624 8.09394 15.5736 7.92 15.7449C7.74606 15.9161 7.5303 16.0012 7.27273 16H1.81818ZM12.8864 8.88888H6.36364C6.10606 8.88888 5.8903 8.80355 5.71636 8.63288C5.54242 8.46222 5.45515 8.25125 5.45455 7.99999C5.45394 7.74873 5.54121 7.53777 5.71636 7.36711C5.89152 7.19644 6.10727 7.11111 6.36364 7.11111H12.8864L11.1818 5.44444C11.0152 5.28148 10.9318 5.08148 10.9318 4.84444C10.9318 4.6074 11.0152 4.4 11.1818 4.22222C11.3485 4.04444 11.5606 3.9517 11.8182 3.944C12.0758 3.93629 12.2955 4.02163 12.4773 4.2L15.7273 7.37777C15.9091 7.55555 16 7.76296 16 7.99999C16 8.23703 15.9091 8.44444 15.7273 8.62222L12.4773 11.8C12.2955 11.9778 12.0797 12.0631 11.83 12.056C11.5803 12.0489 11.3642 11.9561 11.1818 11.7778C11.0152 11.6 10.9358 11.389 10.9436 11.1449C10.9515 10.9007 11.0385 10.6969 11.2045 10.5333L12.8864 8.88888Z"/>
              </svg>
            </div>
            <span class="flex-1 text-sm !font-family-poppins">Logout</span>
            <svg class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </nav>
</template>
<script>
export default {
  name: "business_user_nav_drawar_menu",
  
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    closeMobileMenu() {
      this.$emit('close')
    },

    navigateToStore() {
      this.$router.push({ name: 'my-store' })
      this.closeMobileMenu()
    },

    logoutAndClose() {
      console.log('Logging out...')
      this.closeMobileMenu()
      // Add your logout logic
    }
  }
}
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Active nav state */
.nav-active {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.nav-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #2563eb;
  border-radius: 0 4px 4px 0;
}

.nav-active .flex-shrink-0 {
  background-color: #dbeafe !important;
}

.nav-active svg:last-child {
  opacity: 1;
  transform: translateX(0);
}

/* Scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>