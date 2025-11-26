<template>
  <div class="dashboard-container">
  

    <!-- Mobile Header -->
    <div class="mobile-header" v-if="menu_view_mobile">
    <!-- <div class="mobile-header" v-if="isMobile"> -->
      <button class="back-button" @click="goBack" v-if="menu_view_mobile">
       <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.75 9.75L0.75 5.25L4.75 0.75" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

      </button>
      <h2 class="mobile-header-title">{{ menu_view_mobile ? currentPageTitle : 'Menu' }}</h2>
      <button class="menu-button" @click="toggleMobileMenu" v-if="!menu_view_mobile">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- Mobile Drawer Menu -->
    <transition name="drawer">
      <div class="mobile-drawer" v-if="mobileMenuOpen && isMobile" @click.self="closeMobileMenu">
        <div class="drawer-content">
          <div class="drawer-header">
            <button class="close-button" @click="closeMobileMenu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="user-info-mobile">
            <div class="user-avatar">
              <img :src="this.$store.state.root_media_api + profile.profile_picture" alt="User Avatar" />
            </div>
            <h3>{{ user?.full_name || 'John Doe' }}</h3>
            <p class="user-email">{{ user?.email || 'johndoe@gmail.com' }}</p>
          </div>

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
        </div>
      </div>
    </transition>

    <!-- Main Dashboard Content -->
    <a-row class="dashboard-content">
      
      <!-- Sidebar - Shows on mobile menu view or desktop -->
      <a-col :xs="!menu_view_mobile ? 24 : 0" :sm="!menu_view_mobile ? 24 : 0" :md="6" :lg="6" class="sidebar-col">
        <div class="sidebar">
            <!-- <div class="!font-[Poppins] !font-semibold !text-[24px] leading-[32px] tracking-[0]">
  profile
</div> -->
          <div class="user-info">
            <div class="user-avatar">
              <img :src="this.$store.state.root_media_api + profile.profile_picture" alt="John Doe" />
            </div>
<h3 class="font-[Poppins] font-medium text-[18px] leading-[28px] tracking-[0] text-center">
  {{ user?.full_name || 'John Doe' }}
</h3>
<p class="font-[Poppins] font-normal text-[14px] leading-[20px] tracking-[0] text-center">
  {{ user?.email || 'johndoe@gmail.com' }}
</p>
            
           <div class="your-parent-component">
    
    <!-- Completion Badge (Clickable) -->
    <div 
      class="completion-badge"
      @click="showCompletionModal = true"
    >
      <div class="completion-circle">
        <span class="completion-text">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="22px" 
            height="22px" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <path 
              fill-rule="evenodd" 
              clip-rule="evenodd" 
              d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z" 
              fill="currentcolor"
            />
          </svg>
          &nbsp;{{ completionPercentage }}% completed
        </span>
      </div>
    </div>

    <!-- Profile Completion Modal -->
    <ProfileCompletionModal 
      :isOpen="showCompletionModal"
      :initialSteps="profileSteps"
      @close="showCompletionModal = false"
      @complete="handleProfileComplete"
    />

  </div>
            
            <div class="package-info">
              <div class="package-header">
<span class="package-label font-[Poppins] font-medium text-[16px] leading-[24px] tracking-[0] text-[#262626]">
  Your package
</span>                <router-link to="/pricing" class="upgrade-link">Upgrade</router-link>
              </div>
              <div class="package-card">
<span class="package-type font-[Poppins] font-semibold text-[16px] leading-[24px] tracking-[0] text-[#3B63FB]">
  Business
</span>                <div class="package-icon">
                  <img src="../../../assets/dyd-logo.png" alt="" style="width:40px;height:40px">
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Menu -->
          <nav class="dashboard-nav">
            <router-link 
  to="/business-dashboard/my-profile"
  class="nav-item flex items-center justify-between"
  :class="{ active: $route.name === 'business_my_profile' }"
  @click="menu_view_mobile = true"
>

  <!-- LEFT SIDE -->
  <div class="flex items-center gap-3">
    <div class="nav-icon-wrapper">
                 <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.75 18.25C0.75 16.9239 1.27678 15.6521 2.21447 14.7145C3.15215 13.7768 4.42392 13.25 5.75 13.25H15.75C17.0761 13.25 18.3479 13.7768 19.2855 14.7145C20.2232 15.6521 20.75 16.9239 20.75 18.25C20.75 18.913 20.4866 19.5489 20.0178 20.0178C19.5489 20.4866 18.913 20.75 18.25 20.75H3.25C2.58696 20.75 1.95107 20.4866 1.48223 20.0178C1.01339 19.5489 0.75 18.913 0.75 18.25Z" stroke="currentcolor" stroke-width="1.5" stroke-linejoin="round"/>
<path d="M10.75 8.25C12.8211 8.25 14.5 6.57107 14.5 4.5C14.5 2.42893 12.8211 0.75 10.75 0.75C8.67893 0.75 7 2.42893 7 4.5C7 6.57107 8.67893 8.25 10.75 8.25Z" stroke="currentcolor" stroke-width="1.5"/>
</svg>
    </div>

    <span class="nav-text">Profile</span>
  </div>

  <!-- RIGHT SIDE ARROW -->
  <img src="/openfile.svg" alt="arrow" class="w-4 h-4 md:hidden block" />
  
</router-link>

            
            <router-link 
  to="/business-dashboard/business-details" 
  class="nav-item flex items-center justify-between"
  :class="{ active: $route.name === 'business_business_details' }"
  @click="menu_view_mobile = true"
>

  <!-- LEFT SIDE -->
  <div class="flex items-center gap-3">
    <div class="nav-icon-wrapper">
      <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5 21V7L13 2L21 7V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 9V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M17 9V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <span class="nav-text">Business Detail</span>
  </div>

  <!-- RIGHT SIDE ARROW -->
  <img src="/openfile.svg" alt="arrow" class="w-4 h-4 md:hidden block" />

</router-link>

            
            <router-link 
  to="/business-dashboard/my-designs" 
  class="nav-item flex items-center justify-between"
  :class="{ active: $route.name === 'business_my_designs' }"
  @click="menu_view_mobile = true"
>

  <!-- LEFT SIDE: ICON + TEXT -->
  <div class="flex items-center gap-3">
    <div class="nav-icon-wrapper">
      <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" 
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" 
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <span class="nav-text">My Designs</span>
  </div>

  <!-- RIGHT SIDE: ARROW -->
  <img src="/openfile.svg" alt="arrow" class="w-4 h-4 md:hidden block" />

</router-link>

             
            <router-link 
  to="/business-dashboard/my-likes" 
  class="nav-item flex items-center justify-between"
  :class="{ active: $route.name === 'business_my_likes' }"
  @click="menu_view_mobile = true"
>

  <!-- LEFT SIDE: ICON + TEXT -->
  <div class="flex items-center gap-3">
    <div class="nav-icon-wrapper">
      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.90304 15.1577C5.7611 13.556 1.51758 9.89416 1.51758 6.59893C1.51758 4.42091 3.11591 2.65527 5.31361 2.65527C6.45242 2.65527 7.59123 3.03488 9.10965 4.55329C10.6281 3.03488 11.7669 2.65527 12.9057 2.65527C15.1034 2.65527 16.7017 4.42091 16.7017 6.59893C16.7017 9.89416 12.4582 13.556 10.3163 15.1577C9.59546 15.6966 8.62383 15.6966 7.90304 15.1577Z" stroke="currentcolor" stroke-width="1.13881" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

    </div>

    <span class="nav-text">My Likes</span>
  </div>

  <!-- RIGHT SIDE: ARROW -->
  <img src="/openfile.svg" alt="arrow" class="w-4 h-4 md:hidden block" />

</router-link>

            <router-link 
  to="/business-dashboard/my-products" 
  class="nav-item flex items-center justify-between"
  :class="{ active: $route.name === 'business_my_products' }"
  @click="menu_view_mobile = true"
>

  <!-- LEFT SIDE -->
  <div class="flex items-center gap-3">
    <div class="nav-icon-wrapper">
      <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="3.27,6.96 12,12.01 20.73,6.96" 
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="12" y1="22.08" x2="12" y2="12" 
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <span class="nav-text">My Products</span>
  </div>

  <!-- RIGHT SIDE ARROW -->
  <img src="/openfile.svg" alt="arrow" class="w-4 h-4 md:hidden block" />

</router-link>

            
           <router-link 
  to="/business-dashboard/comunity" 
  class="nav-item flex items-center justify-between"
  :class="{ active: $route.name === 'business_dashboard_community' }"
  @click="menu_view_mobile = true"
>
  <!-- LEFT: Icon + Text -->
  <div class="flex items-center gap-2">
    <div class="nav-icon-wrapper">
      <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" 
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="9" cy="7" r="4" 
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M23 21V19C23 18.1332 22.7361 17.2873 22.2458 16.5707C21.7555 15.8542 21.0617 15.3022 20.2656 14.9876" 
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <span class="nav-text">Community</span>
  </div>

  <!-- RIGHT: openfile.svg -->
  <img 
    src="/openfile.svg" 
    alt="Open File" 
    class="w-4 h-4 md:hidden block"
  />
</router-link>

            
           <router-link 
  to="/business-dashboard/generate-banner" 
  class="nav-item flex items-center justify-between"
  :class="{ active: $route.name === 'business_generate_banner' }"
  @click="menu_view_mobile = true"
>
  <!-- LEFT: Icon + Text -->
  <div class="flex items-center gap-2">
    <div class="nav-icon-wrapper">
      <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <span class="nav-text">Generate a Banner</span>
  </div>

  <!-- RIGHT: /openfile.svg -->
  <img 
    src="/openfile.svg" 
    alt="Open File"
    class="w-4 h-4 md:hidden block"
  />
</router-link>

            
            <router-link 
  to="/business-dashboard/manage-subscription" 
  class="nav-item"
  :class="{ active: $route.name === 'business_manage_subscription' }"
  @click="menu_view_mobile = true"
>
  <div class="flex items-center w-full justify-between">
    
    <!-- Left: Icon + Text -->
    <div class="flex items-center gap-3">
      <div class="nav-icon-wrapper">
        <svg width="25" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.925 6.93125H17.7M6.925 6.93125H0.75M6.925 6.93125L11.4875 19.495M6.925 6.93125L9.925 2.015L10.6125 0.75M17.7 6.93125H23.875M17.7 6.93125L13.1375 19.495M17.7 6.93125L14.7 2.015L13.9925 0.75M0.75 6.93125C0.75 7.45625 0.84875 7.98125 1.045 8.47625C1.31 9.145 1.8475 9.76125 2.92 10.9925L7.25375 15.9625C9 17.965 9.8725 18.9675 10.9075 19.335C11.0983 19.4025 11.2917 19.4558 11.4875 19.495M0.75 6.93125C0.75 6.40625 0.84875 5.88125 1.045 5.385C1.31 4.71625 1.8475 4.10125 2.92 2.86875C3.50375 2.20125 3.795 1.8675 4.1325 1.60875C4.63427 1.22633 5.21575 0.96187 5.83375 0.835C6.25125 0.75 6.69375 0.75 7.58 0.75H10.6125M11.4875 19.495C12.0322 19.6028 12.5928 19.6028 13.1375 19.495M10.6125 0.75H13.9925M23.875 6.93125C23.875 7.45625 23.7762 7.98125 23.58 8.47625C23.315 9.145 22.7775 9.76125 21.705 10.9925L17.3713 15.9625C15.625 17.965 14.7525 18.9675 13.7175 19.335C13.5282 19.402 13.3344 19.4554 13.1375 19.495M23.875 6.93125C23.875 6.40625 23.7762 5.88125 23.58 5.385C23.315 4.71625 22.7775 4.10125 21.705 2.86875C21.1212 2.20125 20.83 1.8675 20.4925 1.60875C19.9907 1.22633 19.4092 0.96187 18.7913 0.835C18.3738 0.75 17.9313 0.75 17.045 0.75H13.9925" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <span class="nav-text">Manage Subscription</span>
    </div>

    <!-- Right: openfile.svg -->
    <img 
      src="/openfile.svg" 
      alt="openfile" 
      class="w-4 h-4 md:hidden block"
    />

  </div>
</router-link>

          <router-link 
  to="/business-dashboard/my-transactions" 
  class="nav-item flex items-center justify-between"
  :class="{ active: $route.name === 'my_transactions' }"
  @click="menu_view_mobile = true"
>
  <!-- LEFT : Icon + Text -->
  <div class="flex items-center gap-2">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7H1L6.5 1M1 11H17L11.5 17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="nav-text">Transactions</span>
  </div>

  <!-- RIGHT : openfile.svg -->
  <img 
    src="/openfile.svg" 
    alt="Open"
    class="w-4 h-4 md:hidden block"
  />
</router-link>


              
            <div class="nav-item" @click="logout_user">
             <div className="w-full h-[46px] bg-[#FEE3E0] rounded-[8px] flex items-center justify-center gap-2 cursor-pointer hover:bg-[#fcbeb8] transition">
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.81818 16C1.31818 16 0.890303 15.8261 0.534545 15.4782C0.178788 15.1304 0.000606061 14.7117 0 14.2222V1.77778C0 1.28889 0.178182 0.870518 0.534545 0.522666C0.890909 0.174815 1.31879 0.000592592 1.81818 0H7.27273C7.5303 0 7.74636 0.0853334 7.92091 0.256C8.09545 0.426666 8.18242 0.637629 8.18182 0.888888C8.18121 1.14015 8.09394 1.35141 7.92 1.52267C7.74606 1.69392 7.5303 1.77896 7.27273 1.77778H1.81818V14.2222H7.27273C7.5303 14.2222 7.74636 14.3075 7.92091 14.4782C8.09545 14.6489 8.18242 14.8598 8.18182 15.1111C8.18121 15.3624 8.09394 15.5736 7.92 15.7449C7.74606 15.9161 7.5303 16.0012 7.27273 16H1.81818ZM12.8864 8.88888H6.36364C6.10606 8.88888 5.8903 8.80355 5.71636 8.63288C5.54242 8.46222 5.45515 8.25125 5.45455 7.99999C5.45394 7.74873 5.54121 7.53777 5.71636 7.36711C5.89152 7.19644 6.10727 7.11111 6.36364 7.11111H12.8864L11.1818 5.44444C11.0152 5.28148 10.9318 5.08148 10.9318 4.84444C10.9318 4.6074 11.0152 4.4 11.1818 4.22222C11.3485 4.04444 11.5606 3.9517 11.8182 3.944C12.0758 3.93629 12.2955 4.02163 12.4773 4.2L15.7273 7.37777C15.9091 7.55555 16 7.76296 16 7.99999C16 8.23703 15.9091 8.44444 15.7273 8.62222L12.4773 11.8C12.2955 11.9778 12.0797 12.0631 11.83 12.056C11.5803 12.0489 11.3642 11.9561 11.1818 11.7778C11.0152 11.6 10.9358 11.389 10.9436 11.1449C10.9515 10.9007 11.0385 10.6969 11.2045 10.5333L12.8864 8.88888Z"
      fill="#E33827"
    />
  </svg>
  <span class="text-[16px] font-[600] text-[orangered] font-[Poppins]">
    Logout
  </span>
</div>
            </div>
          </nav>
        </div>
      </a-col>
      
      <!-- Content Area -->
      <a-col :xs="menu_view_mobile ? 24 : 0" :sm="menu_view_mobile ? 24 : 0" :md="18" :lg="18" class="content-area">
        <router-view :user="user" :profile="profile" :buisness_info="business_info" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { notification } from "ant-design-vue";
import ProfileCompletionModal from "./ProfileCompletionModal.vue";

export default {
  name: 'DashboardManager_business_user',

  components: {
    ProfileCompletionModal
  },
  
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user') || '{}'),
      profile: JSON.parse(localStorage.getItem('profile') || '{}'),
      business_info: JSON.parse(localStorage.getItem('business_profile') || '{}'),
      menu_view_mobile: false,
      mobileMenuOpen: false,
      isMobile: false,
      
      // Profile Completion Modal
      showCompletionModal: false,
      profileSteps: [
        {
          id: 1,
          title: 'Personal details',
          description: 'Please fill in your personal details accurately to ensure a smooth process.',
          completed: false
        },
        {
          id: 2,
          title: 'Business details',
          description: 'Please fill in your Business details accurately.',
          completed: false
        },
        {
          id: 3,
          title: 'Add at least 3 products',
          description: 'Please add at least three products to proceed with the process.',
          completed: false
        },
        {
          id: 4,
          title: 'Create a AI Catalog',
          description: 'Create your personalized AI catalog by selecting and organizing products that meet your needs.',
          completed: false
        }
      ]
    }
  },

  computed: {
    currentRouteName() {
      return this.$route.name
    },
    
    currentPageTitle() {
      const titles = {
        'business_my_profile': 'Profile',
        'business_business_details': 'Business Detail',
        'business_my_designs': 'My Designs',
        'business_my_products': 'My Products',
        'business_dashboard_community': 'Community',
        'business_generate_banner': 'Generate Banner',
        'business_manage_subscription': 'Manage Subscription',
        'my_transactions': 'Transactions',
      };
      return titles[this.$route.name] || 'Dashboard';
    },

    completionPercentage() {
      const completed = this.profileSteps.filter(step => step.completed).length;
      return Math.round((completed / this.profileSteps.length) * 100);
    },

    isProfileComplete() {
      return this.profileSteps.every(step => step.completed);
    }
  },
  
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },

    closeMobileMenu() {
      this.mobileMenuOpen = false;
    },

    goBack() {
      this.menu_view_mobile = false;
    },

    checkScreenSize() {
      this.isMobile = window.innerWidth < 768;
    },

    logoutAndClose() {
      this.closeMobileMenu();
      this.logout_user();
    },

    logout_user() {
      this.$store.dispatch('logout')
      localStorage.removeItem('profile')
      localStorage.removeItem('business_profile')
      this.$router.push('/login')

      notification.success({
        message: "Logout Successful",
        placement: 'bottomRight'
      });
    },

    // Profile Completion Methods
    openCompletionModal() {
      this.showCompletionModal = true;
    },

    closeCompletionModal() {
      this.showCompletionModal = false;
    },

    handleProfileComplete() {
      this.showCompletionModal = false;
      
      notification.success({
        message: "Profile Completed!",
        description: "Your profile setup is now complete. You can start using all features.",
        placement: 'bottomRight'
      });

      // Optional: Reload profile data or redirect
      this.fetchProfileStatus();
    },

    async fetchProfileStatus() {
      try {
        // Check personal details completion
        const hasPersonalDetails = this.profile && 
          this.profile.full_name && 
          this.profile.email && 
          this.profile.phone;
        
        // Check business details completion
        const hasBusinessDetails = this.business_info && 
          this.business_info.business_name && 
          this.business_info.business_type;

        // Update step 1 (Personal details)
        this.profileSteps[0].completed = hasPersonalDetails;

        // Update step 2 (Business details)
        this.profileSteps[1].completed = hasBusinessDetails;

        // Fetch products count from API
        const response = await fetch(`${this.$store.state.root_api}products/count`, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Update step 3 (Add at least 3 products)
          this.profileSteps[2].completed = data.count >= 3;
        }

        // Check if AI catalog exists
        const catalogResponse = await fetch(`${this.$store.state.root_api}catalog/check`, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        });
        
        if (catalogResponse.ok) {
          const catalogData = await catalogResponse.json();
          // Update step 4 (Create AI Catalog)
          this.profileSteps[3].completed = catalogData.exists;
        }

      } catch (error) {
        console.error('Failed to fetch profile status:', error);
      }
    },

    updateStepCompletion(stepId, completed) {
      const step = this.profileSteps.find(s => s.id === stepId);
      if (step) {
        step.completed = completed;
      }
    }
  },

  async mounted() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
    
    // Fetch profile completion status on mount
    await this.fetchProfileStatus();

    // Optional: Show modal automatically if profile is incomplete
    if (!this.isProfileComplete && this.completionPercentage < 100) {
      // Show modal after a short delay
      setTimeout(() => {
        this.showCompletionModal = false;
      }, 2000);
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
  
  created() {
    // Debug: Log current route information
    console.log('Current route:', this.$route)
    console.log('Current route name:', this.$route.name)
    console.log('Current route path:', this.$route.path)
  }
}
</script>

<style scoped>

/* Completion Badge Styles */
.completion-badge {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.completion-badge:hover {
  transform: translateY(-2px);
}

.completion-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  padding: 10px 20px;
  transition: all 0.3s ease;
}

.completion-badge:hover .completion-circle {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  transform: scale(1.05);
}

.completion-text {
  display: flex;
  align-items: center;
  color: blue;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.completion-text svg {
  flex-shrink: 0;
}

/* Responsive styles */
@media (max-width: 640px) {
  .completion-circle {
    padding: 8px 16px;
  }

  .completion-text {
    font-size: 12px;
  }

  .completion-text svg {
    width: 18px;
    height: 18px;
  }
}

.dashboard-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.dashboard-content {
  background: #f8f9fa;
  min-height: 100vh;
}

/* Mobile Header */
.mobile-header {
  display: none;
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 12px 16px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-button,
.menu-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  transition: all 0.2s ease;
}

.back-button:hover,
.menu-button:hover {
  color: #1f2937;
}

.mobile-header-title {
  flex: 1;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
}

/* Mobile Drawer */
.mobile-drawer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  animation: fadeIn 0.3s ease;
  overflow: hidden;
}

.drawer-content {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: white;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease;
}

/* Drawer scrollbar styling */
.drawer-content::-webkit-scrollbar {
  width: 4px;
}

.drawer-content::-webkit-scrollbar-track {
  background: transparent;
}

.drawer-content::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 4px;
}

.drawer-content::-webkit-scrollbar-thumb:hover {
  background: #999;
}

/* Firefox scrollbar for drawer */
.drawer-content {
  scrollbar-color: #ddd transparent;
  scrollbar-width: thin;
}

.drawer-header {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s ease;
}

.close-button:hover {
  color: #1f2937;
}

.user-info-mobile {
  text-align: center;
  padding: 24px 16px;
  border-bottom: 1px solid #e9ecef;
}

.user-info-mobile .user-avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 12px;
}

.user-info-mobile h3 {
  margin: 12px 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.user-info-mobile .user-email {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
}

.dashboard-nav-mobile {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 8px;
}

.nav-item-mobile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.nav-item-mobile:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.nav-item-mobile.active {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.nav-item-mobile.logout {
  color: #e33827;
  font-weight: 600;
  margin-top: 12px;
  background: #fee2e2;
}

.nav-item-mobile.logout:hover {
  background: #fecaca;
}

.divider {
  height: 1px;
  background: #e9ecef;
  margin: 8px 0;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s ease;
}

.drawer-enter,
.drawer-leave-to {
  opacity: 0;
}

/* Desktop Sidebar */
.sidebar-col {
  padding: 10px;
}

.sidebar {
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e9ecef;
  position: sticky;
  top: 10px;
  /* max-height: calc(100vh - 20px); */
  overflow-y: auto;
  scroll-behavior: smooth;
}

.user-info {
  text-align: center;
  margin-bottom: 30px;
  flex-shrink: 0;
}

.user-avatar {
  width: 100px;
  height: 100px;
  margin: auto;
  position: relative;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e9ecef;
}

.user-info h3 {
  margin: 15px 0 4px;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.user-email {
  margin: 0 0 16px;
  color: #6b7280;
  font-size: 14px;
}

.completion-badge {
  position: relative;
  margin: 10px 0;
}

.completion-circle {
  display: inline-block;
  color: #3b82f6;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
}

.completion-text {
  display: flex;
  font-size: 14px;
  font-weight: 600;
}

.package-info {
  margin-bottom: 20px;
  flex-shrink: 0;
}

.package-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.package-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.upgrade-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upgrade-link:hover {
  color: #1d4ed8;
}

.package-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.package-type {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 15px;
}

.package-icon {
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-text {
  font-family: 'Poppins', sans-serif;
  font-weight: 500; /* Medium */
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0;
  color: #333333; /* Adjust color as per your theme */
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  transition: color 0.3s ease;
}

.nav-text:hover {
  color: #000000; /* Hover color (blue tone from your earlier style) */
}

.nav-item {
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  white-space: nowrap;
}

@media (min-width: 768px) {
  .nav-item:hover {
    background-color: #f3f4f6;
    color: #374151;
  }

  .nav-item.active {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
  }
}

.nav-item.active:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  color: white;
}

.nav-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.content-area {
  padding: 0;
}

/* Custom scrollbar for desktop sidebar */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Firefox scrollbar for desktop sidebar */
.sidebar {
  scrollbar-color: #888 #f1f1f1;
  scrollbar-width: thin;
}

/* Mobile view adjustments */
@media (max-width: 768px) {
  .mobile-header {
    display: flex;
  }

  .sidebar-col {
    padding: 0;
  }

  .sidebar {
    /* Remove sticky positioning on mobile */
    position: static;
    border-radius: 0;
    top: auto;
    left: auto;
    bottom: auto;
    width: 100%;
    max-height: none;
    z-index: 10;
    /* Hide sidebar scrollbar on mobile */
    scrollbar-width: none;
  }

  /* Chrome, Safari and Opera */
  .sidebar::-webkit-scrollbar {
    display: none;
  }

  .content-area {
    padding: 16px;
  }
}

@media (max-width: 1200px) {
  .sidebar {
    max-height: calc(100vh - 20px);
  }
}



























.nav-text {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0;
  color: #333333;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  transition: color 0.3s ease;
}

.nav-item {
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  white-space: nowrap;
}

@media (min-width: 768px) {
  .nav-item:hover {
    background-color: #f3f4f6;
    color: #374151;
  }

  .nav-item.active {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
  }

  /* FIX: Ensure text color is white when active */
  .nav-item.active .nav-text {
    color: white;
  }
}

.nav-item.active:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  color: white;
}

/* FIX: Ensure all text is white on active hover */
.nav-item.active:hover .nav-text {
  color: white;
}
</style>