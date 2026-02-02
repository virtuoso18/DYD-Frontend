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
        <div
          class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.5 14.5C0.5 13.4391 0.921427 12.4217 1.67157 11.6716C2.42172 10.9214 3.43913 10.5 4.5 10.5H12.5C13.5609 10.5 14.5783 10.9214 15.3284 11.6716C16.0786 12.4217 16.5 13.4391 16.5 14.5C16.5 15.0304 16.2893 15.5391 15.9142 15.9142C15.5391 16.2893 15.0304 16.5 14.5 16.5H2.5C1.96957 16.5 1.46086 16.2893 1.08579 15.9142C0.710714 15.5391 0.5 15.0304 0.5 14.5Z"
              stroke="currentColor"
              stroke-linejoin="round"
            />
            <path
              d="M8.5 6.5C10.1569 6.5 11.5 5.15685 11.5 3.5C11.5 1.84315 10.1569 0.5 8.5 0.5C6.84315 0.5 5.5 1.84315 5.5 3.5C5.5 5.15685 6.84315 6.5 8.5 6.5Z"
              stroke="currentColor"
            />
          </svg>
        </div>
        <span class="flex-1 text-sm !font-family-poppins">Profile</span>
        <svg
          class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 18l6-6-6-6"
          />
        </svg>
      </router-link>

      <!-- My Likes -->
      <router-link
        to="/professional-dashboard/my-likes"
        class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
        :class="{ 'nav-active': $route.name === 'professional_my_likes' }"
        @click="closeMobileMenu"
      >
        <div
          class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 19 19"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M7.90304 15.1577C5.7611 13.556 1.51758 9.89416 1.51758 6.59893C1.51758 4.42091 3.11591 2.65527 5.31361 2.65527C6.45242 2.65527 7.59123 3.03488 9.10965 4.55329C10.6281 3.03488 11.7669 2.65527 12.9057 2.65527C15.1034 2.65527 16.7017 4.42091 16.7017 6.59893C16.7017 9.89416 12.4582 13.556 10.3163 15.1577C9.59546 15.6966 8.62383 15.6966 7.90304 15.1577Z"
              stroke-width="1.13881"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <span class="flex-1 text-sm !font-family-poppins">My Likes</span>
        <svg
          class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 18l6-6-6-6"
          />
        </svg>
      </router-link>

      <!-- my request  -->
      <router-link
        to="/professional-dashboard/my-requests"
        class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
        :class="{ 'nav-active': $route.name === 'professional_my_requests' }"
        @click="closeMobileMenu"
      >
        <div
          class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 12.2C4 8.80588 4 7.10883 5.05441 6.05441C6.10883 5 7.80588 5 11.2 5C14.5941 5 16.2912 5 17.3456 6.05441C18.4 7.10883 18.4 8.80588 18.4 12.2C18.4 15.5941 18.4 17.2912 17.3456 18.3456C16.2912 19.4 14.5941 19.4 11.2 19.4C7.80588 19.4 6.10883 19.4 5.05441 18.3456C4 17.2912 4 15.5941 4 12.2Z"
              stroke="currentColor"
            />
            <path
              d="M6.69922 19.3992C9.77777 15.123 13.2374 9.45193 18.3992 13.7052"
              stroke="currentColor"
            />
            <path
              d="M14.999 7.5C15.2639 7.50009 15.5185 7.60474 15.7061 7.79199C15.8936 7.97927 15.9989 8.23387 15.999 8.49902V9.58008C16.8103 9.6975 18.002 9.98053 19.0713 10.6807C20.3948 11.5473 21.5 13.0336 21.5 15.4912H21.499C21.5013 15.7003 21.4386 15.9049 21.3184 16.0762C21.1959 16.2505 21.0211 16.3812 20.8193 16.4492L20.8145 16.4512C20.6164 16.5157 20.4028 16.5166 20.2041 16.4541C20.0167 16.3951 19.852 16.2812 19.7285 16.1289V16.1299C19.2563 15.5906 18.6721 15.1605 18.0166 14.8691C17.3815 14.5869 16.6937 14.4425 15.999 14.4434V15.4932C15.9982 15.6897 15.9394 15.8817 15.8301 16.0449C15.7207 16.2082 15.5651 16.3355 15.3838 16.4111C15.2025 16.4867 15.0025 16.5077 14.8096 16.4707C14.6169 16.4336 14.4391 16.3404 14.2988 16.2031L14.2949 16.1992L10.7969 12.7041C10.7032 12.6113 10.628 12.5016 10.5771 12.3799C10.5263 12.258 10.5 12.1271 10.5 11.9951C10.5 11.8631 10.5263 11.7322 10.5771 11.6104C10.628 11.4886 10.7022 11.378 10.7959 11.2852H10.7969L14.2949 7.79102L14.2969 7.79004C14.4832 7.60549 14.7349 7.5011 14.9971 7.5H14.999Z"
              fill="white"
              stroke="currentColor"
            />
          </svg>
        </div>
        <span class="flex-1 text-sm !font-family-poppins">Requests</span>
        <svg
          class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 18l6-6-6-6"
          />
        </svg>
      </router-link>

      <!-- Messages -->
      <router-link
        to="/professional-dashboard/my-messages"
        class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
        :class="{ 'nav-active': $route.name === 'professional_messages' }"
        @click="closeMobileMenu"
      >
        <div
          class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M9.19992 13.4739H14.8001M9.19992 9.52659H12M13.736 18.5186C17.0833 18.2999 19.749 15.6315 19.9682 12.2818C20.0106 11.6266 20.0106 10.9476 19.9682 10.2924C19.749 6.94346 17.0833 4.27665 13.736 4.05639C12.5799 3.9812 11.4201 3.9812 10.2639 4.05639C6.91666 4.27586 4.25099 6.94346 4.03178 10.2932C3.98941 10.9557 3.98941 11.6201 4.03178 12.2826C4.11179 13.5023 4.6582 14.6321 5.30222 15.5857C5.67583 16.2528 5.42942 17.0857 5.03981 17.8144C4.7598 18.3394 4.619 18.6015 4.7318 18.791C4.84381 18.9804 5.09581 18.9868 5.59903 18.9986C6.59505 19.0223 7.26627 18.7444 7.79908 18.3568C8.10069 18.1365 8.25189 18.0268 8.3559 18.0141C8.4599 18.0015 8.6655 18.0852 9.07512 18.251C9.44313 18.401 9.87114 18.4933 10.2631 18.5194C11.4032 18.5936 12.5944 18.5936 13.7368 18.5194"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <span class="flex-1 text-sm !font-family-poppins">Messages</span>
        <svg
          class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 18l6-6-6-6"
          />
        </svg>
      </router-link>

      <!-- Manage Subscription -->
      <router-link
        to="/professional-dashboard/manage-subscription"
        class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
        :class="{
          'nav-active': $route.name === 'professional_manage_subscription',
        }"
        @click="closeMobileMenu"
      >
        <div
          class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100"
        >
          <svg
            width="20"
            height="17"
            viewBox="0 0 20 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.44 5.445H14.06M5.44 5.445H0.5M5.44 5.445L9.09 15.496M5.44 5.445L7.84 1.512L8.39 0.5M14.06 5.445H19M14.06 5.445L10.41 15.496M14.06 5.445L11.66 1.512L11.094 0.5M0.5 5.445C0.5 5.865 0.579 6.285 0.736 6.681C0.948 7.216 1.378 7.709 2.236 8.694L5.703 12.67C7.1 14.272 7.798 15.074 8.626 15.368C8.77867 15.422 8.93333 15.4647 9.09 15.496M0.5 5.445C0.5 5.025 0.579 4.605 0.736 4.208C0.948 3.673 1.378 3.181 2.236 2.195C2.703 1.661 2.936 1.394 3.206 1.187C3.60742 0.881067 4.0726 0.669496 4.567 0.568C4.901 0.5 5.255 0.5 5.964 0.5H8.39M9.09 15.496C9.52578 15.5822 9.97422 15.5822 10.41 15.496M8.39 0.5H11.094M19 5.445C19 5.865 18.921 6.285 18.764 6.681C18.552 7.216 18.122 7.709 17.264 8.694L13.797 12.67C12.4 14.272 11.702 15.074 10.874 15.368C10.7226 15.4216 10.5675 15.4643 10.41 15.496M19 5.445C19 5.025 18.921 4.605 18.764 4.208C18.552 3.673 18.122 3.181 17.264 2.195C16.797 1.661 16.564 1.394 16.294 1.187C15.8926 0.881067 15.4274 0.669496 14.933 0.568C14.599 0.5 14.245 0.5 13.536 0.5H11.094"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <span class="flex-1 text-sm !font-family-poppins"
          >Manage Subscription</span
        >
        <svg
          class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 18l6-6-6-6"
          />
        </svg>
      </router-link>
      <!-- my design  -->
      <router-link
        to="/professional-dashboard/my-designes"
        class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
        :class="{ 'nav-active': $route.name === 'professional_designes' }"
        @click="closeMobileMenu"
      >
        <div
          class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100"
        >
           <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.59961 17.3767C6.71544 18.5542 6.97721 19.3468 7.56883 19.9384C8.62997 20.9996 10.3378 20.9996 13.7536 20.9996C17.1694 20.9996 18.8773 20.9996 19.9384 19.9384C20.9996 18.8773 20.9996 17.1694 20.9996 13.7536C20.9996 10.3378 20.9996 8.62997 19.9384 7.56883C19.3468 6.97721 18.5542 6.71544 17.3767 6.59961"
                      stroke="currentColor"
                    />
                    <path
                      d="M3 10.2C3 6.80588 3 5.10883 4.05441 4.05441C5.10883 3 6.80588 3 10.2 3C13.5941 3 15.2912 3 16.3456 4.05441C17.4 5.10883 17.4 6.80588 17.4 10.2C17.4 13.5941 17.4 15.2912 16.3456 16.3456C15.2912 17.4 13.5941 17.4 10.2 17.4C6.80588 17.4 5.10883 17.4 4.05441 16.3456C3 15.2912 3 13.5941 3 10.2Z"
                      stroke="currentColor"
                    />
                    <path
                      d="M5.69922 17.3992C8.77777 13.123 12.2374 7.45193 17.3992 11.7052"
                      stroke="currentColor"
                    />
                  </svg>
        </div>
        <span class="flex-1 text-sm !font-family-poppins">My Designs</span>
        <svg
          class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 18l6-6-6-6"
          />
        </svg>
      </router-link>

        <!-- community  -->
      <router-link
         to="/professional-dashboard/my-community-posts"
        class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
        :class="{ 'nav-active': $route.name === 'profesional_my_community_posts' }"
        @click="closeMobileMenu"
      >
        <div
          class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100"
        >
          <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4.25C11.4696 4.25 10.9609 4.46071 10.5858 4.83578C10.2107 5.21086 10 5.71956 10 6.24999C10 6.78043 10.2107 7.28913 10.5858 7.66421C10.9609 8.03928 11.4696 8.24999 12 8.24999C12.5304 8.24999 13.0391 8.03928 13.4142 7.66421C13.7893 7.28913 14 6.78043 14 6.24999C14 5.71956 13.7893 5.21086 13.4142 4.83578C13.0391 4.46071 12.5304 4.25 12 4.25ZM8.75 6.24999C8.75 5.38804 9.09241 4.56139 9.7019 3.9519C10.3114 3.34241 11.138 3 12 3C12.862 3 13.6886 3.34241 14.2981 3.9519C14.9076 4.56139 15.25 5.38804 15.25 6.24999C15.25 7.11195 14.9076 7.9386 14.2981 8.54809C13.6886 9.15758 12.862 9.49999 12 9.49999C11.138 9.49999 10.3114 9.15758 9.7019 8.54809C9.09241 7.9386 8.75 7.11195 8.75 6.24999ZM4.75 6.24999C4.35218 6.24999 3.97064 6.40803 3.68934 6.68933C3.40804 6.97064 3.25 7.35217 3.25 7.74999C3.25 8.14782 3.40804 8.52935 3.68934 8.81065C3.97064 9.09196 4.35218 9.24999 4.75 9.24999C5.14782 9.24999 5.52936 9.09196 5.81066 8.81065C6.09196 8.52935 6.25 8.14782 6.25 7.74999C6.25 7.35217 6.09196 6.97064 5.81066 6.68933C5.52936 6.40803 5.14782 6.24999 4.75 6.24999ZM2 7.74999C2 7.02065 2.28973 6.32118 2.80546 5.80545C3.32118 5.28973 4.02065 5 4.75 5C5.47935 5 6.17882 5.28973 6.69454 5.80545C7.21027 6.32118 7.5 7.02065 7.5 7.74999C7.5 8.47934 7.21027 9.17881 6.69454 9.69453C6.17882 10.2103 5.47935 10.5 4.75 10.5C4.02065 10.5 3.32118 10.2103 2.80546 9.69453C2.28973 9.17881 2 8.47934 2 7.74999ZM17.75 7.74999C17.75 7.35217 17.908 6.97064 18.1893 6.68933C18.4706 6.40803 18.8522 6.24999 19.25 6.24999C19.6478 6.24999 20.0294 6.40803 20.3107 6.68933C20.592 6.97064 20.75 7.35217 20.75 7.74999C20.75 8.14782 20.592 8.52935 20.3107 8.81065C20.0294 9.09196 19.6478 9.24999 19.25 9.24999C18.8522 9.24999 18.4706 9.09196 18.1893 8.81065C17.908 8.52935 17.75 8.14782 17.75 7.74999ZM19.25 5C18.5207 5 17.8212 5.28973 17.3055 5.80545C16.7897 6.32118 16.5 7.02065 16.5 7.74999C16.5 8.47934 16.7897 9.17881 17.3055 9.69453C17.8212 10.2103 18.5207 10.5 19.25 10.5C19.9793 10.5 20.6788 10.2103 21.1945 9.69453C21.7103 9.17881 22 8.47934 22 7.74999C22 7.02065 21.7103 6.32118 21.1945 5.80545C20.6788 5.28973 19.9793 5 19.25 5ZM7.5 12.625C7.5 12.194 7.67121 11.7807 7.97595 11.4759C8.2807 11.1712 8.69402 11 9.125 11H14.875C15.306 11 15.7193 11.1712 16.024 11.4759C16.3288 11.7807 16.5 12.194 16.5 12.625V16.5C16.5 17.6935 16.0259 18.838 15.182 19.682C14.3381 20.5259 13.1935 21 12 21C10.8065 21 9.66193 20.5259 8.81802 19.682C7.97411 18.838 7.5 17.6935 7.5 16.5V12.625ZM9.125 12.25C9.02554 12.25 8.93016 12.2895 8.85983 12.3598C8.78951 12.4301 8.75 12.5255 8.75 12.625V16.5C8.75 17.3619 9.09241 18.1886 9.7019 18.7981C10.3114 19.4076 11.138 19.75 12 19.75C12.862 19.75 13.6886 19.4076 14.2981 18.7981C14.9076 18.1886 15.25 17.3619 15.25 16.5V12.625C15.25 12.5255 15.2105 12.4301 15.1402 12.3598C15.0698 12.2895 14.9745 12.25 14.875 12.25H9.125ZM6.576 11.995C6.52567 12.197 6.50033 12.407 6.5 12.625V13.309L3.53 14.105C3.43403 14.1308 3.35221 14.1936 3.30252 14.2796C3.25283 14.3657 3.23934 14.468 3.265 14.564L4.009 17.341C4.21174 18.0981 4.68126 18.7564 5.33104 19.1947C5.98082 19.6329 6.76709 19.8216 7.545 19.726C7.8299 20.1194 8.16565 20.4733 8.5435 20.7785C8.46783 20.8035 8.39117 20.8261 8.3135 20.8465C7.74268 20.9995 7.14729 21.0386 6.56135 20.9616C5.97541 20.8845 5.41039 20.6928 4.89854 20.3974C4.3867 20.1019 3.93806 19.7086 3.57825 19.2398C3.21844 18.7709 2.9545 18.2358 2.8015 17.665L2.057 14.888C2.00181 14.6818 1.98776 14.4668 2.01566 14.2553C2.04356 14.0437 2.11285 13.8397 2.2196 13.6549C2.32634 13.4701 2.46843 13.3082 2.63777 13.1783C2.8071 13.0484 3.00036 12.9532 3.2065 12.898L6.576 11.995ZM15.456 20.7785C15.532 20.8035 15.6088 20.8261 15.6865 20.8465C16.2573 20.9994 16.8527 21.0385 17.4386 20.9614C18.0245 20.8842 18.5895 20.6925 19.1013 20.397C19.6131 20.1015 20.0617 19.7081 20.4214 19.2393C20.7812 18.7704 21.0451 18.2353 21.198 17.6645L21.942 14.8875C22.0535 14.4712 21.9951 14.0277 21.7796 13.6545C21.5641 13.2814 21.2092 13.009 20.793 12.8975L17.424 11.9945C17.4743 12.1968 17.4997 12.4068 17.5 12.6245V13.3095L20.4695 14.1045C20.5171 14.1172 20.5618 14.1393 20.6009 14.1693C20.64 14.1993 20.6728 14.2368 20.6974 14.2795C20.722 14.3222 20.738 14.3694 20.7443 14.4183C20.7507 14.4672 20.7474 14.5169 20.7345 14.5645L19.9905 17.341C19.7878 18.098 19.3183 18.7562 18.6687 19.1945C18.019 19.6327 17.2328 19.8215 16.455 19.726C16.1701 20.1194 15.8338 20.4733 15.456 20.7785Z"
                      fill="currentColor"
                    />
                  </svg>
        </div>
        <span class="flex-1 text-sm !font-family-poppins">Comunity</span>
        <svg
          class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 18l6-6-6-6"
          />
        </svg>
      </router-link>

      <!-- Business Details -->
      <router-link
        to="/professional-dashboard/business-details"
        class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
        :class="{
          'nav-active': $route.name === 'profesional_buisness_details',
        }"
        @click="closeMobileMenu"
      >
        <div
          class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M3 21H21M5 21V7L13 2L21 7V21M9 9V21M15 9V21"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <span class="flex-1 text-sm !font-family-poppins"
          >Business Details</span
        >
        <svg
          class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 18l6-6-6-6"
          />
        </svg>
      </router-link>

      <!-- Transactions -->
      <router-link
        to="/professional-dashboard/my-transactions"
        class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
        :class="{ 'nav-active': $route.name === 'professional_transactions' }"
        @click="closeMobileMenu"
      >
        <div
          class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M20 10H4L9.5 4M4 14H20L14.5 20"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <span class="flex-1 text-sm !font-family-poppins">Transactions</span>
        <svg
          class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 18l6-6-6-6"
          />
        </svg>
      </router-link>

      <!-- Settings -->
      <router-link
        to="/professional-dashboard/settings"
        class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
        :class="{ 'nav-active': $route.name === 'professional_settings' }"
        @click="closeMobileMenu"
      >
        <div
          class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M12.5 14.0909C13.9309 14.0909 15.0909 12.9309 15.0909 11.5C15.0909 10.0691 13.9309 8.90909 12.5 8.90909C11.0691 8.90909 9.90909 10.0691 9.90909 11.5C9.90909 12.9309 11.0691 14.0909 12.5 14.0909Z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M18.8909 14.0909C18.7759 14.3514 18.7417 14.6403 18.7925 14.9205C18.8432 15.2007 18.9768 15.4592 19.1759 15.6627L19.2277 15.7145C19.3883 15.875 19.5157 16.0655 19.6026 16.2751C19.6896 16.4848 19.7343 16.7096 19.7343 16.9366C19.7343 17.1636 19.6896 17.3883 19.6026 17.598C19.5157 17.8077 19.3883 17.9982 19.2277 18.1586C19.0673 18.3192 18.8768 18.4466 18.6671 18.5336C18.4574 18.6205 18.2327 18.6652 18.0057 18.6652C17.7787 18.6652 17.5539 18.6205 17.3442 18.5336C17.1346 18.4466 16.9441 18.3192 16.7836 18.1586L16.7318 18.1068C16.5283 17.9077 16.2698 17.7742 15.9896 17.7234C15.7094 17.6726 15.4205 17.7069 15.16 17.8218C14.9046 17.9313 14.6867 18.1131 14.5333 18.3448C14.3798 18.5765 14.2975 18.848 14.2964 19.1259V19.2727C14.2964 19.7308 14.1144 20.1702 13.7905 20.4941C13.4665 20.818 13.0272 21 12.5691 21C12.111 21 11.6717 20.818 11.3477 20.4941C11.0238 20.1702 10.8418 19.7308 10.8418 19.2727V19.195C10.8351 18.9091 10.7426 18.6319 10.5763 18.3993C10.4099 18.1668 10.1775 17.9896 9.90909 17.8909C9.6486 17.7759 9.35965 17.7417 9.07949 17.7925C8.79933 17.8432 8.54081 17.9768 8.33727 18.1759L8.28545 18.2277C8.12504 18.3883 7.93454 18.5157 7.72485 18.6026C7.51516 18.6896 7.2904 18.7343 7.06341 18.7343C6.83642 18.7343 6.61165 18.6896 6.40197 18.6026C6.19228 18.5157 6.00178 18.3883 5.84136 18.2277C5.68077 18.0673 5.55337 17.8768 5.46644 17.6671C5.37952 17.4574 5.33478 17.2327 5.33478 17.0057C5.33478 16.7787 5.37952 16.5539 5.46644 16.3442C5.55337 16.1346 5.68077 15.9441 5.84136 15.7836L5.89318 15.7318C6.09228 15.5283 6.22584 15.2698 6.27664 14.9896C6.32744 14.7094 6.29314 14.4205 6.17818 14.16C6.0687 13.9046 5.88693 13.6867 5.65522 13.5333C5.42351 13.3798 5.152 13.2975 4.87409 13.2964H4.72727C4.26917 13.2964 3.82983 13.1144 3.50591 12.7905C3.18198 12.4665 3 12.0272 3 11.5691C3 11.111 3.18198 10.6717 3.50591 10.3477C3.82983 10.0238 4.26917 9.84182 4.72727 9.84182H4.805C5.09086 9.83513 5.3681 9.7426 5.60067 9.57626C5.83324 9.40992 6.01039 9.17745 6.10909 8.90909C6.22405 8.6486 6.25835 8.35965 6.20755 8.07949C6.15675 7.79933 6.02319 7.54081 5.82409 7.33727L5.77227 7.28545C5.61168 7.12504 5.48428 6.93454 5.39735 6.72485C5.31043 6.51516 5.26569 6.2904 5.26569 6.06341C5.26569 5.83642 5.31043 5.61165 5.39735 5.40197C5.48428 5.19228 5.61168 5.00178 5.77227 4.84136C5.93269 4.68077 6.12319 4.55337 6.33288 4.46644C6.54256 4.37952 6.76733 4.33478 6.99432 4.33478C7.22131 4.33478 7.44607 4.37952 7.65576 4.46644C7.86545 4.55337 8.05595 4.68077 8.21636 4.84136L8.26818 4.89318C8.47172 5.09228 8.73024 5.22584 9.0104 5.27664C9.29056 5.32744 9.57951 5.29314 9.84 5.17818H9.90909C10.1645 5.0687 10.3824 4.88693 10.5358 4.65522C10.6893 4.42351 10.7716 4.152 10.7727 3.87409V3.72727C10.7727 3.26917 10.9547 2.82983 11.2786 2.50591C11.6026 2.18198 12.0419 2 12.5 2C12.9581 2 13.3974 2.18198 13.7214 2.50591C14.0453 2.82983 14.2273 3.26917 14.2273 3.72727V3.805C14.2284 4.08291 14.3107 4.35442 14.4642 4.58613C14.6176 4.81783 14.8355 4.99961 15.0909 5.10909C15.3514 5.22405 15.6403 5.25835 15.9205 5.20755C16.2007 5.15675 16.4592 5.02319 16.6627 4.82409L16.7145 4.77227C16.875 4.61168 17.0655 4.48428 17.2751 4.39735C17.4848 4.31043 17.7096 4.26569 17.9366 4.26569C18.1636 4.26569 18.3883 4.31043 18.598 4.39735C18.8077 4.48428 18.9982 4.61168 19.1586 4.77227C19.3192 4.93269 19.4466 5.12319 19.5336 5.33288C19.6205 5.54256 19.6652 5.76733 19.6652 5.99432C19.6652 6.22131 19.6205 6.44607 19.5336 6.65576C19.4466 6.86545 19.3192 7.05595 19.1586 7.21636L19.1068 7.26818C18.9077 7.47172 18.7742 7.73024 18.7234 8.0104C18.6726 8.29056 18.7069 8.57951 18.8218 8.84V8.90909C18.9313 9.16453 19.1131 9.38238 19.3448 9.53583C19.5765 9.68927 19.848 9.77162 20.1259 9.77273H20.2727C20.7308 9.77273 21.1702 9.95471 21.4941 10.2786C21.818 10.6026 22 11.0419 22 11.5C22 11.9581 21.818 12.3974 21.4941 12.7214C21.1702 13.0453 20.7308 13.2273 20.2727 13.2273H20.195C19.9171 13.2284 19.6456 13.3107 19.4139 13.4642C19.1822 13.6176 19.0004 13.8355 18.8909 14.0909Z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <span class="flex-1 text-sm !font-family-poppins">Settings</span>
        <svg
          class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 18l6-6-6-6"
          />
        </svg>
      </router-link>

      <!-- Divider -->
      <div class="h-px bg-gray-200 my-4"></div>

      <!-- Logout -->
      <button
        @click="logout_user"
        class="flex items-center gap-4 px-2 py-2 rounded-xl !text-red-600 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-red-50 w-full text-left"
      >
        <div
          class="flex-shrink-0 w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center transition-all duration-200 group-hover:bg-red-100"
        >
          <svg class="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M1.81818 16C1.31818 16 0.890303 15.8261 0.534545 15.4782C0.178788 15.1304 0.000606061 14.7117 0 14.2222V1.77778C0 1.28889 0.178182 0.870518 0.534545 0.522666C0.890909 0.174815 1.31879 0.000592592 1.81818 0H7.27273C7.5303 0 7.74636 0.0853334 7.92091 0.256C8.09545 0.426666 8.18242 0.637629 8.18182 0.888888C8.18121 1.14015 8.09394 1.35141 7.92 1.52267C7.74606 1.69392 7.5303 1.77896 7.27273 1.77778H1.81818V14.2222H7.27273C7.5303 14.2222 7.74636 14.3075 7.92091 14.4782C8.09545 14.6489 8.18242 14.8598 8.18182 15.1111C8.18121 15.3624 8.09394 15.5736 7.92 15.7449C7.74606 15.9161 7.5303 16.0012 7.27273 16H1.81818ZM12.8864 8.88888H6.36364C6.10606 8.88888 5.8903 8.80355 5.71636 8.63288C5.54242 8.46222 5.45515 8.25125 5.45455 7.99999C5.45394 7.74873 5.54121 7.53777 5.71636 7.36711C5.89152 7.19644 6.10727 7.11111 6.36364 7.11111H12.8864L11.1818 5.44444C11.0152 5.28148 10.9318 5.08148 10.9318 4.84444C10.9318 4.6074 11.0152 4.4 11.1818 4.22222C11.3485 4.04444 11.5606 3.9517 11.8182 3.944C12.0758 3.93629 12.2955 4.02163 12.4773 4.2L15.7273 7.37777C15.9091 7.55555 16 7.76296 16 7.99999C16 8.23703 15.9091 8.44444 15.7273 8.62222L12.4773 11.8C12.2955 11.9778 12.0797 12.0631 11.83 12.056C11.5803 12.0489 11.3642 11.9561 11.1818 11.7778C11.0152 11.6 10.9358 11.389 10.9436 11.1449C10.9515 10.9007 11.0385 10.6969 11.2045 10.5333L12.8864 8.88888Z"
            />
          </svg>
        </div>
        <span class="flex-1 text-sm !font-family-poppins">Logout</span>
        <svg
          class="w-5 h-5 opacity-0 transform -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 18l6-6-6-6"
          />
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
      default: false,
    },
  },

  methods: {
    closeMobileMenu() {
      this.$emit("close");
    },

    logout_user() {
      this.$store.dispatch("logout");
      localStorage.removeItem("profile");
      localStorage.removeItem("business_profile");
      this.$router.push("/login");

      notification.success({
        message: "Logout Successful",
        placement: "bottomRight",
      });
    }
  },
};
</script>

<style scoped>
/* Active nav state */
.nav-active {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.nav-active::before {
  content: "";
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
