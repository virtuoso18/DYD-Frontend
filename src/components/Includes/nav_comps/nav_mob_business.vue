<template>

  <a-button type="primary" @click="this.$router.push({name:'my-store'})">
            <div style="display:flex;gap:5px">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 17" fill="none">
<path d="M1.97754 7.49756V10.8321C1.97754 12.7184 1.97754 13.6616 2.56333 14.2476C3.14911 14.8336 4.09192 14.8336 5.97754 14.8336H9.97754C11.8631 14.8336 12.8059 14.8336 13.3917 14.2476C13.9775 13.6616 13.9775 12.7184 13.9775 10.8321V7.49756" stroke="white" stroke-linecap="round"/>
<path d="M4.64453 12.4946H7.3112" stroke="white" stroke-linecap="round"/>
<path d="M6.73554 6.11184C6.54755 6.79077 5.86386 7.96195 4.56485 8.13169C3.41789 8.28155 2.54798 7.78089 2.32578 7.57156C2.08079 7.40182 1.52245 6.85866 1.38571 6.51919C1.24897 6.17973 1.4085 5.44421 1.52245 5.14435L1.97796 3.82543C2.08916 3.49415 2.34947 2.71062 2.61635 2.4456C2.88323 2.18058 3.42355 2.16905 3.64594 2.16905H8.31627C9.51841 2.18603 12.1469 2.15833 12.6665 2.16905C13.1861 2.17977 13.4984 2.61533 13.5895 2.80203C14.3648 4.67991 14.6663 5.75539 14.6663 6.21367C14.5651 6.70255 14.1463 7.62436 12.6665 8.02982C11.1285 8.45122 10.2566 7.63162 9.98307 7.31695M6.10315 7.31695C6.31965 7.58282 6.99881 8.11809 7.98327 8.13169C8.96781 8.14522 9.81787 7.45836 10.1198 7.11326C10.2053 7.01142 10.3899 6.7093 10.5813 6.11184" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
<span>My Store</span>
            </div>
</a-button>
<nav class="dashboard-nav-mobile">
            <router-link to="/business-dashboard/my-profile" class="nav-item-mobile" :class="{ active: $route.name === 'business_my_profile' }" @click="closeMobileMenu">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Profile</span>
            </router-link>

            <router-link to="/business-dashboard/business-details" class="nav-item-mobile" :class="{ active: $route.name === 'business_business_details' }" @click="closeMobileMenu">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5 21V7L13 2L21 7V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 9V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17 9V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Business Detail</span>
            </router-link>

            <router-link to="/business-dashboard/my-designs" class="nav-item-mobile" :class="{ active: $route.name === 'business_my_designs' }" @click="closeMobileMenu">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>My Designs</span>
            </router-link>

            <router-link to="/business-dashboard/my-products" class="nav-item-mobile" :class="{ active: $route.name === 'business_my_products' }" @click="closeMobileMenu">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>My Products</span>
            </router-link>

            <router-link to="/business-dashboard/comunity" class="nav-item-mobile" :class="{ active: $route.name === 'business_dashboard_community' }" @click="closeMobileMenu">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 21V19C23 18.1332 22.7361 17.2873 22.2458 16.5707C21.7555 15.8542 21.0617 15.3022 20.2656 14.9876" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 18.9078 6.11683 18.7176 6.95054C18.5274 7.78425 18.0661 8.53291 17.4128 9.06582C16.7595 9.59872 15.9551 9.88681 15.13 9.88681C14.3049 9.88681 13.5005 9.59872 12.8472 9.06582C12.1939 8.53291 11.7326 7.78425 11.5424 6.95054C11.3522 6.11683 11.5478 5.25392 12.0924 4.55232C12.637 3.85071 13.3996 3.35031 14.26 3.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Community</span>
            </router-link>

            <router-link to="/business-dashboard/generate-banner" class="nav-item-mobile" :class="{ active: $route.name === 'business_generate_banner' }" @click="closeMobileMenu">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Generate a Banner</span>
            </router-link>

            <router-link to="/business-dashboard/manage-subscription" class="nav-item-mobile" :class="{ active: $route.name === 'business_manage_subscription' }" @click="closeMobileMenu">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <polygon points="12,2 15.09,8.26 22,9 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9 8.91,8.26" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Manage Subscription</span>
            </router-link>

            <router-link to="/business-dashboard/my-transactions" class="nav-item-mobile" :class="{ active: $route.name === 'my_transactions' }" @click="closeMobileMenu">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17 7H1L6.5 1M1 11H17L11.5 17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Transactions</span>
            </router-link>

            <div class="divider"></div>

            <div class="nav-item-mobile logout" @click="logoutAndClose">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1.81818 16C1.31818 16 0.890303 15.8261 0.534545 15.4782C0.178788 15.1304 0.000606061 14.7117 0 14.2222V1.77778C0 1.28889 0.178182 0.870518 0.534545 0.522666C0.890909 0.174815 1.31879 0.000592592 1.81818 0H7.27273C7.5303 0 7.74636 0.0853334 7.92091 0.256C8.09545 0.426666 8.18242 0.637629 8.18182 0.888888C8.18121 1.14015 8.09394 1.35141 7.92 1.52267C7.74606 1.69392 7.5303 1.77896 7.27273 1.77778H1.81818V14.2222H7.27273C7.5303 14.2222 7.74636 14.3075 7.92091 14.4782C8.09545 14.6489 8.18242 14.8598 8.18182 15.1111C8.18121 15.3624 8.09394 15.5736 7.92 15.7449C7.74606 15.9161 7.5303 16.0012 7.27273 16H1.81818ZM12.8864 8.88888H6.36364C6.10606 8.88888 5.8903 8.80355 5.71636 8.63288C5.54242 8.46222 5.45515 8.25125 5.45455 7.99999C5.45394 7.74873 5.54121 7.53777 5.71636 7.36711C5.89152 7.19644 6.10727 7.11111 6.36364 7.11111H12.8864L11.1818 5.44444C11.0152 5.28148 10.9318 5.08148 10.9318 4.84444C10.9318 4.6074 11.0152 4.4 11.1818 4.22222C11.3485 4.04444 11.5606 3.9517 11.8182 3.944C12.0758 3.93629 12.2955 4.02163 12.4773 4.2L15.7273 7.37777C15.9091 7.55555 16 7.76296 16 7.99999C16 8.23703 15.9091 8.44444 15.7273 8.62222L12.4773 11.8C12.2955 11.9778 12.0797 12.0631 11.83 12.056C11.5803 12.0489 11.3642 11.9561 11.1818 11.7778C11.0152 11.6 10.9358 11.389 10.9436 11.1449C10.9515 10.9007 11.0385 10.6969 11.2045 10.5333L12.8864 8.88888Z" fill="currentColor"/>
              </svg>
              <span>Logout</span>
            </div>
          </nav>
</template>
<script>
export default {
    name:"business_user_nav_drawar_menu"
} 
</script>