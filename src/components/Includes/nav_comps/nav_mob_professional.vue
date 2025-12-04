<!-- <template>

     <nav class="dashboard-nav">
            <router-link 
              to="/professional-dashboard/my-profile" 
              class="nav-item"
              :class="{ active: $route.name === 'professional_my_profile' }"
              @click.native="handleMobileNavClick"
            >
              <div class="nav-icon-wrapper">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  ircle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Profile</span>
            </router-link>
            
            <router-link 
              to="/professional-dashboard/my-likes" 
              class="nav-item"
              :class="{ active: $route.name === 'professional_my_likes' }"
              @click.native="handleMobileNavClick"
            >
              <div class="nav-icon-wrapper">
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.90304 15.1577C5.7611 13.556 1.51758 9.89416 1.51758 6.59893C1.51758 4.42091 3.11591 2.65527 5.31361 2.65527C6.45242 2.65527 7.59123 3.03488 9.10965 4.55329C10.6281 3.03488 11.7669 2.65527 12.9057 2.65527C15.1034 2.65527 16.7017 4.42091 16.7017 6.59893C16.7017 9.89416 12.4582 13.556 10.3163 15.1577C9.59546 15.6966 8.62383 15.6966 7.90304 15.1577Z" stroke="currentcolor" stroke-width="1.13881" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">My Likes</span>
            </router-link>
            
            <router-link 
              to="/professional-dashboard/my-messages" 
              class="nav-item"
              :class="{ active: $route.name === 'professional_messages' }"
              @click.native="handleMobileNavClick"
            >
              <div class="nav-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.19992 13.4739H14.8001M9.19992 9.52659H12M13.736 18.5186C17.0833 18.2999 19.749 15.6315 19.9682 12.2818C20.0106 11.6266 20.0106 10.9476 19.9682 10.2924C19.749 6.94346 17.0833 4.27665 13.736 4.05639C12.5799 3.9812 11.4201 3.9812 10.2639 4.05639C6.91666 4.27586 4.25099 6.94346 4.03178 10.2932C3.98941 10.9557 3.98941 11.6201 4.03178 12.2826C4.11179 13.5023 4.6582 14.6321 5.30222 15.5857C5.67583 16.2528 5.42942 17.0857 5.03981 17.8144C4.7598 18.3394 4.619 18.6015 4.7318 18.791C4.84381 18.9804 5.09581 18.9868 5.59903 18.9986C6.59505 19.0223 7.26627 18.7444 7.79908 18.3568C8.10069 18.1365 8.25189 18.0268 8.3559 18.0141C8.4599 18.0015 8.6655 18.0852 9.07512 18.251C9.44313 18.401 9.87114 18.4933 10.2631 18.5194C11.4032 18.5936 12.5944 18.5936 13.7368 18.5194" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Messages</span>
            </router-link>
            
            <router-link 
              to="/professional-dashboard/manage-subscription" 
              class="nav-item"
              :class="{ active: $route.name === 'professional_manage_subscription' }"
              @click.native="handleMobileNavClick"
            >
              <div class="nav-icon-wrapper">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <polygon points="12,2 15.09,8.26 22,9 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9 8.91,8.26" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Manage Subscription</span>
            </router-link>
            
            <router-link 
              to="/professional-dashboard/business-details" 
              class="nav-item"
              :class="{ active: $route.name === 'profesional_buisness_details' }"
              @click.native="handleMobileNavClick"
            >
              <div class="nav-icon-wrapper">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 21H21M5 21V7L13 2L21 7V21M9 9V21M15 9V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Business Details</span>
            </router-link>
            
            <router-link 
              to="/professional-dashboard/my-transactions" 
              class="nav-item"
              :class="{ active: $route.name === 'professional_transactions' }"
              @click.native="handleMobileNavClick"
            >
              <div class="nav-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 10H4L9.5 4M4 14H20L14.5 20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Transactions</span>
            </router-link>
            
             <router-link 
              to="/professional-dashboard/my-requests" 
              class="nav-item"
              :class="{ active: $route.name === 'user_my_requests' }"
            >
              <div class="nav-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 12.2C4 8.80588 4 7.10883 5.05441 6.05441C6.10883 5 7.80588 5 11.2 5C14.5941 5 16.2912 5 17.3456 6.05441C18.4 7.10883 18.4 8.80588 18.4 12.2C18.4 15.5941 18.4 17.2912 17.3456 18.3456C16.2912 19.4 14.5941 19.4 11.2 19.4C7.80588 19.4 6.10883 19.4 5.05441 18.3456C4 17.2912 4 15.5941 4 12.2Z" stroke="currentColor"/>
<path d="M6.69922 19.3992C9.77777 15.123 13.2374 9.45193 18.3992 13.7052" stroke="currentColor"/>
<path d="M14.999 7.5C15.2639 7.50009 15.5185 7.60474 15.7061 7.79199C15.8936 7.97927 15.9989 8.23387 15.999 8.49902V9.58008C16.8103 9.6975 18.002 9.98053 19.0713 10.6807C20.3948 11.5473 21.5 13.0336 21.5 15.4912H21.499C21.5013 15.7003 21.4386 15.9049 21.3184 16.0762C21.1959 16.2505 21.0211 16.3812 20.8193 16.4492L20.8145 16.4512C20.6164 16.5157 20.4028 16.5166 20.2041 16.4541C20.0167 16.3951 19.852 16.2812 19.7285 16.1289V16.1299C19.2563 15.5906 18.6721 15.1605 18.0166 14.8691C17.3815 14.5869 16.6937 14.4425 15.999 14.4434V15.4932C15.9982 15.6897 15.9394 15.8817 15.8301 16.0449C15.7207 16.2082 15.5651 16.3355 15.3838 16.4111C15.2025 16.4867 15.0025 16.5077 14.8096 16.4707C14.6169 16.4336 14.4391 16.3404 14.2988 16.2031L14.2949 16.1992L10.7969 12.7041C10.7032 12.6113 10.628 12.5016 10.5771 12.3799C10.5263 12.258 10.5 12.1271 10.5 11.9951C10.5 11.8631 10.5263 11.7322 10.5771 11.6104C10.628 11.4886 10.7022 11.378 10.7959 11.2852H10.7969L14.2949 7.79102L14.2969 7.79004C14.4832 7.60549 14.7349 7.5011 14.9971 7.5H14.999Z" fill="white" stroke="currentColor"/>
</svg>

              </div>
              <span class="nav-text">Requests</span>
            </router-link>
            
            <router-link 
              to="/professional-dashboard/settings" 
              class="nav-item"
              :class="{ active: $route.name === 'professional_settings' }"
              @click.native="handleMobileNavClick"
            >
              <div class="nav-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 14.0909C13.9309 14.0909 15.0909 12.9309 15.0909 11.5C15.0909 10.0691 13.9309 8.90909 12.5 8.90909C11.0691 8.90909 9.90909 10.0691 9.90909 11.5C9.90909 12.9309 11.0691 14.0909 12.5 14.0909Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.8909 14.0909C18.7759 14.3514 18.7417 14.6403 18.7925 14.9205C18.8432 15.2007 18.9768 15.4592 19.1759 15.6627L19.2277 15.7145C19.3883 15.875 19.5157 16.0655 19.6026 16.2751C19.6896 16.4848 19.7343 16.7096 19.7343 16.9366C19.7343 17.1636 19.6896 17.3883 19.6026 17.598C19.5157 17.8077 19.3883 17.9982 19.2277 18.1586C19.0673 18.3192 18.8768 18.4466 18.6671 18.5336C18.4574 18.6205 18.2327 18.6652 18.0057 18.6652C17.7787 18.6652 17.5539 18.6205 17.3442 18.5336C17.1346 18.4466 16.9441 18.3192 16.7836 18.1586L16.7318 18.1068C16.5283 17.9077 16.2698 17.7742 15.9896 17.7234C15.7094 17.6726 15.4205 17.7069 15.16 17.8218C14.9046 17.9313 14.6867 18.1131 14.5333 18.3448C14.3798 18.5765 14.2975 18.848 14.2964 19.1259V19.2727C14.2964 19.7308 14.1144 20.1702 13.7905 20.4941C13.4665 20.818 13.0272 21 12.5691 21C12.111 21 11.6717 20.818 11.3477 20.4941C11.0238 20.1702 10.8418 19.7308 10.8418 19.2727V19.195C10.8351 18.9091 10.7426 18.6319 10.5763 18.3993C10.4099 18.1668 10.1775 17.9896 9.90909 17.8909C9.6486 17.7759 9.35965 17.7417 9.07949 17.7925C8.79933 17.8432 8.54081 17.9768 8.33727 18.1759L8.28545 18.2277C8.12504 18.3883 7.93454 18.5157 7.72485 18.6026C7.51516 18.6896 7.2904 18.7343 7.06341 18.7343C6.83642 18.7343 6.61165 18.6896 6.40197 18.6026C6.19228 18.5157 6.00178 18.3883 5.84136 18.2277C5.68077 18.0673 5.55337 17.8768 5.46644 17.6671C5.37952 17.4574 5.33478 17.2327 5.33478 17.0057C5.33478 16.7787 5.37952 16.5539 5.46644 16.3442C5.55337 16.1346 5.68077 15.9441 5.84136 15.7836L5.89318 15.7318C6.09228 15.5283 6.22584 15.2698 6.27664 14.9896C6.32744 14.7094 6.29314 14.4205 6.17818 14.16C6.0687 13.9046 5.88693 13.6867 5.65522 13.5333C5.42351 13.3798 5.152 13.2975 4.87409 13.2964H4.72727C4.26917 13.2964 3.82983 13.1144 3.50591 12.7905C3.18198 12.4665 3 12.0272 3 11.5691C3 11.111 3.18198 10.6717 3.50591 10.3477C3.82983 10.0238 4.26917 9.84182 4.72727 9.84182H4.805C5.09086 9.83513 5.3681 9.7426 5.60067 9.57626C5.83324 9.40992 6.01039 9.17745 6.10909 8.90909C6.22405 8.6486 6.25835 8.35965 6.20755 8.07949C6.15675 7.79933 6.02319 7.54081 5.82409 7.33727L5.77227 7.28545C5.61168 7.12504 5.48428 6.93454 5.39735 6.72485C5.31043 6.51516 5.26569 6.2904 5.26569 6.06341C5.26569 5.83642 5.31043 5.61165 5.39735 5.40197C5.48428 5.19228 5.61168 5.00178 5.77227 4.84136C5.93269 4.68077 6.12319 4.55337 6.33288 4.46644C6.54256 4.37952 6.76733 4.33478 6.99432 4.33478C7.22131 4.33478 7.44607 4.37952 7.65576 4.46644C7.86545 4.55337 8.05595 4.68077 8.21636 4.84136L8.26818 4.89318C8.47172 5.09228 8.73024 5.22584 9.0104 5.27664C9.29056 5.32744 9.57951 5.29314 9.84 5.17818H9.90909C10.1645 5.0687 10.3824 4.88693 10.5358 4.65522C10.6893 4.42351 10.7716 4.152 10.7727 3.87409V3.72727C10.7727 3.26917 10.9547 2.82983 11.2786 2.50591C11.6026 2.18198 12.0419 2 12.5 2C12.9581 2 13.3974 2.18198 13.7214 2.50591C14.0453 2.82983 14.2273 3.26917 14.2273 3.72727V3.805C14.2284 4.08291 14.3107 4.35442 14.4642 4.58613C14.6176 4.81783 14.8355 4.99961 15.0909 5.10909C15.3514 5.22405 15.6403 5.25835 15.9205 5.20755C16.2007 5.15675 16.4592 5.02319 16.6627 4.82409L16.7145 4.77227C16.875 4.61168 17.0655 4.48428 17.2751 4.39735C17.4848 4.31043 17.7096 4.26569 17.9366 4.26569C18.1636 4.26569 18.3883 4.31043 18.598 4.39735C18.8077 4.48428 18.9982 4.61168 19.1586 4.77227C19.3192 4.93269 19.4466 5.12319 19.5336 5.33288C19.6205 5.54256 19.6652 5.76733 19.6652 5.99432C19.6652 6.22131 19.6205 6.44607 19.5336 6.65576C19.4466 6.86545 19.3192 7.05595 19.1586 7.21636L19.1068 7.26818C18.9077 7.47172 18.7742 7.73024 18.7234 8.0104C18.6726 8.29056 18.7069 8.57951 18.8218 8.84V8.90909C18.9313 9.16453 19.1131 9.38238 19.3448 9.53583C19.5765 9.68927 19.848 9.77162 20.1259 9.77273H20.2727C20.7308 9.77273 21.1702 9.95471 21.4941 10.2786C21.818 10.6026 22 11.0419 22 11.5C22 11.9581 21.818 12.3974 21.4941 12.7214C21.1702 13.0453 20.7308 13.2273 20.2727 13.2273H20.195C19.9171 13.2284 19.6456 13.3107 19.4139 13.4642C19.1822 13.6176 19.0004 13.8355 18.8909 14.0909Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Settings</span>
            </router-link>

            <div class="nav-item" @click="logout_user">
              <div class="nav-icon-wrapper">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.81818 16C1.31818 16 0.890303 15.8261 0.534545 15.4782C0.178788 15.1304 0.000606061 14.7117 0 14.2222V1.77778C0 1.28889 0.178182 0.870518 0.534545 0.522666C0.890909 0.174815 1.31879 0.000592592 1.81818 0H7.27273C7.5303 0 7.74636 0.0853334 7.92091 0.256C8.09545 0.426666 8.18242 0.637629 8.18182 0.888888C8.18121 1.14015 8.09394 1.35141 7.92 1.52267C7.74606 1.69392 7.5303 1.77896 7.27273 1.77778H1.81818V14.2222H7.27273C7.5303 14.2222 7.74636 14.3075 7.92091 14.4782C8.09545 14.6489 8.18242 14.8598 8.18182 15.1111C8.18121 15.3624 8.09394 15.5736 7.92 15.7449C7.74606 15.9161 7.5303 16.0012 7.27273 16H1.81818ZM12.8864 8.88888H6.36364C6.10606 8.88888 5.8903 8.80355 5.71636 8.63288C5.54242 8.46222 5.45515 8.25125 5.45455 7.99999C5.45394 7.74873 5.54121 7.53777 5.71636 7.36711C5.89152 7.19644 6.10727 7.11111 6.36364 7.11111H12.8864L11.1818 5.44444C11.0152 5.28148 10.9318 5.08148 10.9318 4.84444C10.9318 4.6074 11.0152 4.4 11.1818 4.22222C11.3485 4.04444 11.5606 3.9517 11.8182 3.944C12.0758 3.93629 12.2955 4.02163 12.4773 4.2L15.7273 7.37777C15.9091 7.55555 16 7.76296 16 7.99999C16 8.23703 15.9091 8.44444 15.7273 8.62222L12.4773 11.8C12.2955 11.9778 12.0797 12.0631 11.83 12.056C11.5803 12.0489 11.3642 11.9561 11.1818 11.7778C11.0152 11.6 10.9358 11.389 10.9436 11.1449C10.9515 10.9007 11.0385 10.6969 11.2045 10.5333L12.8864 8.88888Z" fill="currentColor"/>
                </svg>
              </div>
              <span class="nav-text" style="font-size: medium;color:orangered;font-weight:600">Logout</span>
            </div>
             </nav>

</template>
<script>
export default {
    name:"profesional_user_nav_drawar_menu"
} 
</script> -->



<template>
  <div>
    <nav class="px-1 pb-6 space-y-1">
      <!-- Profile -->
      <router-link 
        to="/professional-dashboard/my-profile" 
        class="flex items-center !font-family-poppins gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
        :class="{ 'nav-active': $route.name === 'professional_my_profile' }" 
        @click="closeMobileMenu"
      >
        <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.5 14.5C0.5 13.4391 0.921427 12.4217 1.67157 11.6716C2.42172 10.9214 3.43913 10.5 4.5 10.5H12.5C13.5609 10.5 14.5783 10.9214 15.3284 11.6716C16.0786 12.4217 16.5 13.4391 16.5 14.5C16.5 15.0304 16.2893 15.5391 15.9142 15.9142C15.5391 16.2893 15.0304 16.5 14.5 16.5H2.5C1.96957 16.5 1.46086 16.2893 1.08579 15.9142C0.710714 15.5391 0.5 15.0304 0.5 14.5Z" stroke="white" stroke-linejoin="round"/>
<path d="M8.5 6.5C10.1569 6.5 11.5 5.15685 11.5 3.5C11.5 1.84315 10.1569 0.5 8.5 0.5C6.84315 0.5 5.5 1.84315 5.5 3.5C5.5 5.15685 6.84315 6.5 8.5 6.5Z" stroke="white"/>
</svg>

        </div>
        <span class="flex-1 text-sm !font-family-poppins">Profile</span>
        <svg class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18l6-6-6-6"/>
        </svg>
      </router-link>

      <!-- My Likes -->
      <router-link 
        to="/professional-dashboard/my-likes" 
        class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
        :class="{ 'nav-active': $route.name === 'professional_my_likes' }" 
        @click="closeMobileMenu"
      >
        <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100">
          <svg class="w-5 h-5" viewBox="0 0 19 19" fill="none" stroke="currentColor">
            <path d="M7.90304 15.1577C5.7611 13.556 1.51758 9.89416 1.51758 6.59893C1.51758 4.42091 3.11591 2.65527 5.31361 2.65527C6.45242 2.65527 7.59123 3.03488 9.10965 4.55329C10.6281 3.03488 11.7669 2.65527 12.9057 2.65527C15.1034 2.65527 16.7017 4.42091 16.7017 6.59893C16.7017 9.89416 12.4582 13.556 10.3163 15.1577C9.59546 15.6966 8.62383 15.6966 7.90304 15.1577Z" stroke-width="1.13881" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="flex-1 text-sm !font-family-poppins">My Likes</span>
        <svg class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18l6-6-6-6"/>
        </svg>
      </router-link>

      <!-- Messages -->
      <router-link 
        to="/professional-dashboard/my-messages" 
        class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
        :class="{ 'nav-active': $route.name === 'professional_messages' }" 
        @click="closeMobileMenu"
      >
        <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9.19992 13.4739H14.8001M9.19992 9.52659H12M13.736 18.5186C17.0833 18.2999 19.749 15.6315 19.9682 12.2818C20.0106 11.6266 20.0106 10.9476 19.9682 10.2924C19.749 6.94346 17.0833 4.27665 13.736 4.05639C12.5799 3.9812 11.4201 3.9812 10.2639 4.05639C6.91666 4.27586 4.25099 6.94346 4.03178 10.2932C3.98941 10.9557 3.98941 11.6201 4.03178 12.2826C4.11179 13.5023 4.6582 14.6321 5.30222 15.5857C5.67583 16.2528 5.42942 17.0857 5.03981 17.8144C4.7598 18.3394 4.619 18.6015 4.7318 18.791C4.84381 18.9804 5.09581 18.9868 5.59903 18.9986C6.59505 19.0223 7.26627 18.7444 7.79908 18.3568C8.10069 18.1365 8.25189 18.0268 8.3559 18.0141C8.4599 18.0015 8.6655 18.0852 9.07512 18.251C9.44313 18.401 9.87114 18.4933 10.2631 18.5194C11.4032 18.5936 12.5944 18.5936 13.7368 18.5194" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="flex-1 text-sm !font-family-poppins">Messages</span>
        <svg class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18l6-6-6-6"/>
        </svg>
      </router-link>

      <!-- Manage Subscription -->
      <router-link 
        to="/professional-dashboard/manage-subscription" 
        class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
        :class="{ 'nav-active': $route.name === 'professional_manage_subscription' }" 
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

      <!-- Business Details -->
      <router-link 
        to="/professional-dashboard/business-details" 
        class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
        :class="{ 'nav-active': $route.name === 'profesional_buisness_details' }" 
        @click="closeMobileMenu"
      >
        <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 21H21M5 21V7L13 2L21 7V21M9 9V21M15 9V21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="flex-1 text-sm !font-family-poppins">Business Details</span>
        <svg class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18l6-6-6-6"/>
        </svg>
      </router-link>

      <!-- Transactions -->
      <router-link 
        to="/professional-dashboard/my-transactions" 
        class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
        :class="{ 'nav-active': $route.name === 'professional_transactions' }" 
        @click="closeMobileMenu"
      >
        <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 10H4L9.5 4M4 14H20L14.5 20" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="flex-1 text-sm !font-family-poppins">Transactions</span>
        <svg class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18l6-6-6-6"/>
        </svg>
      </router-link>

      <!-- My Requests -->
      <router-link 
        to="/professional-dashboard/my-requests" 
        class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
        :class="{ 'nav-active': $route.name === 'user_my_requests' }" 
        @click="closeMobileMenu"
      >
        <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4 12.2C4 8.80588 4 7.10883 5.05441 6.05441C6.10883 5 7.80588 5 11.2 5C14.5941 5 16.2912 5 17.3456 6.05441C18.4 7.10883 18.4 8.80588 18.4 12.2C18.4 15.5941 18.4 17.2912 17.3456 18.3456C16.2912 19.4 14.5941 19.4 11.2 19.4C7.80588 19.4 6.10883 19.4 5.05441 18.3456C4 17.2912 4 15.5941 4 12.2Z"/>
            <path d="M6.69922 19.3992C9.77777 15.123 13.2374 9.45193 18.3992 13.7052"/>
          </svg>
        </div>
        <span class="flex-1 text-sm !font-family-poppins">Requests</span>
        <svg class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18l6-6-6-6"/>
        </svg>
      </router-link>

      <!-- Settings -->
      <router-link 
        to="/professional-dashboard/settings" 
        class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
        :class="{ 'nav-active': $route.name === 'professional_settings' }" 
        @click="closeMobileMenu"
      >
        <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12.5 14.0909C13.9309 14.0909 15.0909 12.9309 15.0909 11.5C15.0909 10.0691 13.9309 8.90909 12.5 8.90909C11.0691 8.90909 9.90909 10.0691 9.90909 11.5C9.90909 12.9309 11.0691 14.0909 12.5 14.0909Z" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.8909 14.0909C18.7759 14.3514 18.7417 14.6403 18.7925 14.9205C18.8432 15.2007 18.9768 15.4592 19.1759 15.6627L19.2277 15.7145C19.3883 15.875 19.5157 16.0655 19.6026 16.2751C19.6896 16.4848 19.7343 16.7096 19.7343 16.9366C19.7343 17.1636 19.6896 17.3883 19.6026 17.598C19.5157 17.8077 19.3883 17.9982 19.2277 18.1586C19.0673 18.3192 18.8768 18.4466 18.6671 18.5336C18.4574 18.6205 18.2327 18.6652 18.0057 18.6652C17.7787 18.6652 17.5539 18.6205 17.3442 18.5336C17.1346 18.4466 16.9441 18.3192 16.7836 18.1586L16.7318 18.1068C16.5283 17.9077 16.2698 17.7742 15.9896 17.7234C15.7094 17.6726 15.4205 17.7069 15.16 17.8218C14.9046 17.9313 14.6867 18.1131 14.5333 18.3448C14.3798 18.5765 14.2975 18.848 14.2964 19.1259V19.2727C14.2964 19.7308 14.1144 20.1702 13.7905 20.4941C13.4665 20.818 13.0272 21 12.5691 21C12.111 21 11.6717 20.818 11.3477 20.4941C11.0238 20.1702 10.8418 19.7308 10.8418 19.2727V19.195C10.8351 18.9091 10.7426 18.6319 10.5763 18.3993C10.4099 18.1668 10.1775 17.9896 9.90909 17.8909C9.6486 17.7759 9.35965 17.7417 9.07949 17.7925C8.79933 17.8432 8.54081 17.9768 8.33727 18.1759L8.28545 18.2277C8.12504 18.3883 7.93454 18.5157 7.72485 18.6026C7.51516 18.6896 7.2904 18.7343 7.06341 18.7343C6.83642 18.7343 6.61165 18.6896 6.40197 18.6026C6.19228 18.5157 6.00178 18.3883 5.84136 18.2277C5.68077 18.0673 5.55337 17.8768 5.46644 17.6671C5.37952 17.4574 5.33478 17.2327 5.33478 17.0057C5.33478 16.7787 5.37952 16.5539 5.46644 16.3442C5.55337 16.1346 5.68077 15.9441 5.84136 15.7836L5.89318 15.7318C6.09228 15.5283 6.22584 15.2698 6.27664 14.9896C6.32744 14.7094 6.29314 14.4205 6.17818 14.16C6.0687 13.9046 5.88693 13.6867 5.65522 13.5333C5.42351 13.3798 5.152 13.2975 4.87409 13.2964H4.72727C4.26917 13.2964 3.82983 13.1144 3.50591 12.7905C3.18198 12.4665 3 12.0272 3 11.5691C3 11.111 3.18198 10.6717 3.50591 10.3477C3.82983 10.0238 4.26917 9.84182 4.72727 9.84182H4.805C5.09086 9.83513 5.3681 9.7426 5.60067 9.57626C5.83324 9.40992 6.01039 9.17745 6.10909 8.90909C6.22405 8.6486 6.25835 8.35965 6.20755 8.07949C6.15675 7.79933 6.02319 7.54081 5.82409 7.33727L5.77227 7.28545C5.61168 7.12504 5.48428 6.93454 5.39735 6.72485C5.31043 6.51516 5.26569 6.2904 5.26569 6.06341C5.26569 5.83642 5.31043 5.61165 5.39735 5.40197C5.48428 5.19228 5.61168 5.00178 5.77227 4.84136C5.93269 4.68077 6.12319 4.55337 6.33288 4.46644C6.54256 4.37952 6.76733 4.33478 6.99432 4.33478C7.22131 4.33478 7.44607 4.37952 7.65576 4.46644C7.86545 4.55337 8.05595 4.68077 8.21636 4.84136L8.26818 4.89318C8.47172 5.09228 8.73024 5.22584 9.0104 5.27664C9.29056 5.32744 9.57951 5.29314 9.84 5.17818H9.90909C10.1645 5.0687 10.3824 4.88693 10.5358 4.65522C10.6893 4.42351 10.7716 4.152 10.7727 3.87409V3.72727C10.7727 3.26917 10.9547 2.82983 11.2786 2.50591C11.6026 2.18198 12.0419 2 12.5 2C12.9581 2 13.3974 2.18198 13.7214 2.50591C14.0453 2.82983 14.2273 3.26917 14.2273 3.72727V3.805C14.2284 4.08291 14.3107 4.35442 14.4642 4.58613C14.6176 4.81783 14.8355 4.99961 15.0909 5.10909C15.3514 5.22405 15.6403 5.25835 15.9205 5.20755C16.2007 5.15675 16.4592 5.02319 16.6627 4.82409L16.7145 4.77227C16.875 4.61168 17.0655 4.48428 17.2751 4.39735C17.4848 4.31043 17.7096 4.26569 17.9366 4.26569C18.1636 4.26569 18.3883 4.31043 18.598 4.39735C18.8077 4.48428 18.9982 4.61168 19.1586 4.77227C19.3192 4.93269 19.4466 5.12319 19.5336 5.33288C19.6205 5.54256 19.6652 5.76733 19.6652 5.99432C19.6652 6.22131 19.6205 6.44607 19.5336 6.65576C19.4466 6.86545 19.3192 7.05595 19.1586 7.21636L19.1068 7.26818C18.9077 7.47172 18.7742 7.73024 18.7234 8.0104C18.6726 8.29056 18.7069 8.57951 18.8218 8.84V8.90909C18.9313 9.16453 19.1131 9.38238 19.3448 9.53583C19.5765 9.68927 19.848 9.77162 20.1259 9.77273H20.2727C20.7308 9.77273 21.1702 9.95471 21.4941 10.2786C21.818 10.6026 22 11.0419 22 11.5C22 11.9581 21.818 12.3974 21.4941 12.7214C21.1702 13.0453 20.7308 13.2273 20.2727 13.2273H20.195C19.9171 13.2284 19.6456 13.3107 19.4139 13.4642C19.1822 13.6176 19.0004 13.8355 18.8909 14.0909Z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="flex-1 text-sm !font-family-poppins">Settings</span>
        <svg class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18l6-6-6-6"/>
        </svg>
      </router-link>

      <!-- Divider -->
      <div class="h-px bg-gray-200 my-4"></div>

      <!-- Logout -->
      <button 
        @click="logout_user"
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
  </div>
</template>

<script>
export default {
  name: "profesional_user_nav_drawar_menu",
  
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

    logout_user() {
      console.log('Logging out...')
      this.closeMobileMenu()
      // Add your logout logic here
    }
  }
}
</script>

<style scoped>
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
