<template>
  <div class="dashboard-container">
    <!-- Main Dashboard Content -->
    <a-row class="dashboard-content">
      <!-- Sidebar -->
      <a-col :xs="0" :sm="0" :md="6" :lg="6" class="sidebar-col">
        <div class="sidebar">
          <div class="user-info">
            <div class="user-avatar">
              <!-- {{ business_info }} -->
               <img :src="this.$store.state.root_media_api+business_info.banner_picture" alt="John Doe" />
            </div>
            <h3>{{ business_info?.name || 'John Doe' }}</h3>
            <p class="user-email">{{ business_info?.email || 'johndoe@gmail.com' }}</p>
            
            <!-- <div class="completion-badge">
              <div class="completion-circle">
                <span class="completion-text">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 24 24" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z" fill="currentcolor"/>
</svg> &nbsp;90% completed</span>
              </div>
            </div>  -->
            
            <!-- <div class="package-info">
              <div class="package-header">
                <span class="package-label">Your package</span>
                <router-link to="/pricing" class="upgrade-link">Upgrade</router-link>
              </div>
              <div class="package-card">
                <span class="package-type">Free User</span>
                <div class="package-icon">
                  <img src="../../../assets/dyd-logo.png" alt="" style="width:40px;height:40px">
                  
                </div>
              </div>
            </div> -->
          </div>

          <!-- Navigation Menu -->
          <nav class="dashboard-nav">
            <router-link 
              to="/my-store/analytics" 
              class="nav-item"
              
              :class="{ active: $route.name === 'analytics' }"
            >
              <div class="nav-icon-wrapper">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Analytics</span>
            </router-link>
            
             <router-link 
             class="nav-item"
              to="/my-store/messages" 
              :class="{ active: $route.name === 'messages' }"
             >
             <!-- to="/my-store/my-messages"  -->
             <!-- :class="{ active: $route.name === 'messages' }" -->
             <div class="nav-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.19992 13.4739H14.8001M9.19992 9.52659H12M13.736 18.5186C17.0833 18.2999 19.749 15.6315 19.9682 12.2818C20.0106 11.6266 20.0106 10.9476 19.9682 10.2924C19.749 6.94346 17.0833 4.27665 13.736 4.05639C12.5799 3.9812 11.4201 3.9812 10.2639 4.05639C6.91666 4.27586 4.25099 6.94346 4.03178 10.2932C3.98941 10.9557 3.98941 11.6201 4.03178 12.2826C4.11179 13.5023 4.6582 14.6321 5.30222 15.5857C5.67583 16.2528 5.42942 17.0857 5.03981 17.8144C4.7598 18.3394 4.619 18.6015 4.7318 18.791C4.84381 18.9804 5.09581 18.9868 5.59903 18.9986C6.59505 19.0223 7.26627 18.7444 7.79908 18.3568C8.10069 18.1365 8.25189 18.0268 8.3559 18.0141C8.4599 18.0015 8.6655 18.0852 9.07512 18.251C9.44313 18.401 9.87114 18.4933 10.2631 18.5194C11.4032 18.5936 12.5944 18.5936 13.7368 18.5194" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

              </div>
              <span class="nav-text">Messages</span>
            </router-link>
            <router-link 
              to="/my-store/customers" 
              class="nav-item"
              :class="{ active: $route.name === 'customers' }"
            >
              <div class="nav-icon-wrapper">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Customers</span>
            </router-link>
            
            <router-link 
              to="/my-store/manage-products" 
              class="nav-item"
              :class="{ active: $route.name === 'manage_products' }"
            >
              <div class="nav-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.4926 8.52734H19.3665C19.9323 8.52734 20.2151 8.52734 20.4222 8.61865C21.3383 9.02254 20.9287 10.0402 20.7746 10.7715C20.7469 10.9028 20.6568 11.0147 20.5306 11.0746C20.007 11.3231 19.6401 11.7944 19.5439 12.3424L19.0073 15.3979C18.7713 16.7422 18.6906 18.6634 17.5125 19.6104C16.6481 20.2984 15.4027 20.2984 12.9119 20.2984H10.9787C8.48788 20.2984 7.24249 20.2984 6.37813 19.6104C5.20004 18.6633 5.11933 16.7422 4.88325 15.3979L4.34668 12.3424C4.25043 11.7944 3.88368 11.3231 3.36003 11.0746C3.23376 11.0147 3.14372 10.9028 3.11603 10.7715C2.96192 10.0402 2.55234 9.02254 3.46842 8.61865C3.67552 8.52734 3.95837 8.52734 4.52406 8.52734H7.8707" stroke="currentColor" stroke-linecap="round"/>
<path d="M13.7625 12.1484H10.1406" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.96484 11.2437L10.134 4M14.6613 4L16.925 8.52734" stroke="currentColor" stroke-linecap="round"/>
</svg>

              </div>
              <span class="nav-text">Manage Products</span>
            </router-link>
            
            <router-link 
              to="/my-store/manage-sites" 
              class="nav-item"
              :class="{ active: $route.name === 'manage_sites' }"
            >
              <div class="nav-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 11.5C4 13.7543 4.89553 15.9163 6.48959 17.5104C8.08365 19.1045 10.2457 20 12.5 20C14.7543 20 16.9163 19.1045 18.5104 17.5104C20.1045 15.9163 21 13.7543 21 11.5C21 9.24566 20.1045 7.08365 18.5104 5.48959C16.9163 3.89553 14.7543 3 12.5 3C10.2457 3 8.08365 3.89553 6.48959 5.48959C4.89553 7.08365 4 9.24566 4 11.5Z" stroke="currentcolor" stroke-linejoin="round"/>
<path d="M8.85742 11.5C8.85742 9.24566 9.24122 7.08365 9.92439 5.48959C10.6076 3.89553 11.5341 3 12.5003 3C13.4664 3 14.393 3.89553 15.0762 5.48959C15.7593 7.08365 16.1431 9.24566 16.1431 11.5C16.1431 13.7543 15.7593 15.9163 15.0762 17.5104C14.393 19.1045 13.4664 20 12.5003 20C11.5341 20 10.6076 19.1045 9.92439 17.5104C9.24122 15.9163 8.85742 13.7543 8.85742 11.5Z" stroke="currentcolor" stroke-linejoin="round"/>
<path d="M4.60742 14.3327H20.3931M4.60742 8.66602H20.3931" stroke="currentcolor" stroke-linecap="round"/>
</svg>

              </div>
              <span class="nav-text">Manage Sites</span>
            </router-link>
<!--             
            <router-link 
              to="/my-store/messages" 
              class="nav-item"
              :class="{ active: $route.name === 'messages' }"
            >
              <div class="nav-icon-wrapper">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-text">Messages</span>
            </router-link> -->
            
            <router-link 
              to="/my-store/requests" 
              class="nav-item"
              :class="{ active: $route.name === 'requests' }"
            >
              <div class="nav-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.5196 8.0718C18.3888 9.88748 17.0419 11.2862 15.5731 11.2862C14.1043 11.2862 12.7552 9.88792 12.6266 8.0718C12.4927 6.18291 13.8039 4.85742 15.5731 4.85742C17.3424 4.85742 18.6536 6.21728 18.5196 8.0718Z" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.5712 14.1426C12.6617 14.1426 9.86385 15.5877 9.16294 18.4021C9.07008 18.7744 9.30357 19.1427 9.68617 19.1427H21.4566C21.8392 19.1427 22.0713 18.7744 21.9798 18.4021C21.2789 15.5426 18.4811 14.1426 15.5712 14.1426Z" stroke="currentcolor" stroke-miterlimit="10"/>
<path d="M9.49945 8.87184C9.39498 10.3219 8.30656 11.4639 7.13331 11.4639C5.96006 11.4639 4.86985 10.3223 4.76717 8.87184C4.66047 7.36331 5.71987 6.28516 7.13331 6.28516C8.54674 6.28516 9.60615 7.39099 9.49945 8.87184Z" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.76852 14.2319C8.96269 13.8627 8.07517 13.7207 7.13451 13.7207C4.81302 13.7207 2.57635 14.8748 2.01606 17.1226C1.9424 17.4199 2.12901 17.7141 2.43438 17.7141H7.44702" stroke="currentcolor" stroke-miterlimit="10" stroke-linecap="round"/>
</svg>

              </div>
              <span class="nav-text">Requests</span>
            </router-link>
                        <router-link 
              to="/my-store/settings" 
              class="nav-item"
              :class="{ active: $route.name === 'settings' }"
            >
              <div class="nav-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.5 14.0909C13.9309 14.0909 15.0909 12.9309 15.0909 11.5C15.0909 10.0691 13.9309 8.90909 12.5 8.90909C11.0691 8.90909 9.90909 10.0691 9.90909 11.5C9.90909 12.9309 11.0691 14.0909 12.5 14.0909Z" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.8909 14.0909C18.7759 14.3514 18.7417 14.6403 18.7925 14.9205C18.8432 15.2007 18.9768 15.4592 19.1759 15.6627L19.2277 15.7145C19.3883 15.875 19.5157 16.0655 19.6026 16.2751C19.6896 16.4848 19.7343 16.7096 19.7343 16.9366C19.7343 17.1636 19.6896 17.3883 19.6026 17.598C19.5157 17.8077 19.3883 17.9982 19.2277 18.1586C19.0673 18.3192 18.8768 18.4466 18.6671 18.5336C18.4574 18.6205 18.2327 18.6652 18.0057 18.6652C17.7787 18.6652 17.5539 18.6205 17.3442 18.5336C17.1346 18.4466 16.9441 18.3192 16.7836 18.1586L16.7318 18.1068C16.5283 17.9077 16.2698 17.7742 15.9896 17.7234C15.7094 17.6726 15.4205 17.7069 15.16 17.8218C14.9046 17.9313 14.6867 18.1131 14.5333 18.3448C14.3798 18.5765 14.2975 18.848 14.2964 19.1259V19.2727C14.2964 19.7308 14.1144 20.1702 13.7905 20.4941C13.4665 20.818 13.0272 21 12.5691 21C12.111 21 11.6717 20.818 11.3477 20.4941C11.0238 20.1702 10.8418 19.7308 10.8418 19.2727V19.195C10.8351 18.9091 10.7426 18.6319 10.5763 18.3993C10.4099 18.1668 10.1775 17.9896 9.90909 17.8909C9.6486 17.7759 9.35965 17.7417 9.07949 17.7925C8.79933 17.8432 8.54081 17.9768 8.33727 18.1759L8.28545 18.2277C8.12504 18.3883 7.93454 18.5157 7.72485 18.6026C7.51516 18.6896 7.2904 18.7343 7.06341 18.7343C6.83642 18.7343 6.61165 18.6896 6.40197 18.6026C6.19228 18.5157 6.00178 18.3883 5.84136 18.2277C5.68077 18.0673 5.55337 17.8768 5.46644 17.6671C5.37952 17.4574 5.33478 17.2327 5.33478 17.0057C5.33478 16.7787 5.37952 16.5539 5.46644 16.3442C5.55337 16.1346 5.68077 15.9441 5.84136 15.7836L5.89318 15.7318C6.09228 15.5283 6.22584 15.2698 6.27664 14.9896C6.32744 14.7094 6.29314 14.4205 6.17818 14.16C6.0687 13.9046 5.88693 13.6867 5.65522 13.5333C5.42351 13.3798 5.152 13.2975 4.87409 13.2964H4.72727C4.26917 13.2964 3.82983 13.1144 3.50591 12.7905C3.18198 12.4665 3 12.0272 3 11.5691C3 11.111 3.18198 10.6717 3.50591 10.3477C3.82983 10.0238 4.26917 9.84182 4.72727 9.84182H4.805C5.09086 9.83513 5.3681 9.7426 5.60067 9.57626C5.83324 9.40992 6.01039 9.17745 6.10909 8.90909C6.22405 8.6486 6.25835 8.35965 6.20755 8.07949C6.15675 7.79933 6.02319 7.54081 5.82409 7.33727L5.77227 7.28545C5.61168 7.12504 5.48428 6.93454 5.39735 6.72485C5.31043 6.51516 5.26569 6.2904 5.26569 6.06341C5.26569 5.83642 5.31043 5.61165 5.39735 5.40197C5.48428 5.19228 5.61168 5.00178 5.77227 4.84136C5.93269 4.68077 6.12319 4.55337 6.33288 4.46644C6.54256 4.37952 6.76733 4.33478 6.99432 4.33478C7.22131 4.33478 7.44607 4.37952 7.65576 4.46644C7.86545 4.55337 8.05595 4.68077 8.21636 4.84136L8.26818 4.89318C8.47172 5.09228 8.73024 5.22584 9.0104 5.27664C9.29056 5.32744 9.57951 5.29314 9.84 5.17818H9.90909C10.1645 5.0687 10.3824 4.88693 10.5358 4.65522C10.6893 4.42351 10.7716 4.152 10.7727 3.87409V3.72727C10.7727 3.26917 10.9547 2.82983 11.2786 2.50591C11.6026 2.18198 12.0419 2 12.5 2C12.9581 2 13.3974 2.18198 13.7214 2.50591C14.0453 2.82983 14.2273 3.26917 14.2273 3.72727V3.805C14.2284 4.08291 14.3107 4.35442 14.4642 4.58613C14.6176 4.81783 14.8355 4.99961 15.0909 5.10909C15.3514 5.22405 15.6403 5.25835 15.9205 5.20755C16.2007 5.15675 16.4592 5.02319 16.6627 4.82409L16.7145 4.77227C16.875 4.61168 17.0655 4.48428 17.2751 4.39735C17.4848 4.31043 17.7096 4.26569 17.9366 4.26569C18.1636 4.26569 18.3883 4.31043 18.598 4.39735C18.8077 4.48428 18.9982 4.61168 19.1586 4.77227C19.3192 4.93269 19.4466 5.12319 19.5336 5.33288C19.6205 5.54256 19.6652 5.76733 19.6652 5.99432C19.6652 6.22131 19.6205 6.44607 19.5336 6.65576C19.4466 6.86545 19.3192 7.05595 19.1586 7.21636L19.1068 7.26818C18.9077 7.47172 18.7742 7.73024 18.7234 8.0104C18.6726 8.29056 18.7069 8.57951 18.8218 8.84V8.90909C18.9313 9.16453 19.1131 9.38238 19.3448 9.53583C19.5765 9.68927 19.848 9.77162 20.1259 9.77273H20.2727C20.7308 9.77273 21.1702 9.95471 21.4941 10.2786C21.818 10.6026 22 11.0419 22 11.5C22 11.9581 21.818 12.3974 21.4941 12.7214C21.1702 13.0453 20.7308 13.2273 20.2727 13.2273H20.195C19.9171 13.2284 19.6456 13.3107 19.4139 13.4642C19.1822 13.6176 19.0004 13.8355 18.8909 14.0909Z" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              </div>
              <span class="nav-text">settings</span>
            </router-link>

                <router-link 
              to="/my-store/manage-access" 
              class="nav-item"
              :class="{ active: $route.name === 'manage-access' }"
            >
              <div class="nav-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.5 14.0909C13.9309 14.0909 15.0909 12.9309 15.0909 11.5C15.0909 10.0691 13.9309 8.90909 12.5 8.90909C11.0691 8.90909 9.90909 10.0691 9.90909 11.5C9.90909 12.9309 11.0691 14.0909 12.5 14.0909Z" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.8909 14.0909C18.7759 14.3514 18.7417 14.6403 18.7925 14.9205C18.8432 15.2007 18.9768 15.4592 19.1759 15.6627L19.2277 15.7145C19.3883 15.875 19.5157 16.0655 19.6026 16.2751C19.6896 16.4848 19.7343 16.7096 19.7343 16.9366C19.7343 17.1636 19.6896 17.3883 19.6026 17.598C19.5157 17.8077 19.3883 17.9982 19.2277 18.1586C19.0673 18.3192 18.8768 18.4466 18.6671 18.5336C18.4574 18.6205 18.2327 18.6652 18.0057 18.6652C17.7787 18.6652 17.5539 18.6205 17.3442 18.5336C17.1346 18.4466 16.9441 18.3192 16.7836 18.1586L16.7318 18.1068C16.5283 17.9077 16.2698 17.7742 15.9896 17.7234C15.7094 17.6726 15.4205 17.7069 15.16 17.8218C14.9046 17.9313 14.6867 18.1131 14.5333 18.3448C14.3798 18.5765 14.2975 18.848 14.2964 19.1259V19.2727C14.2964 19.7308 14.1144 20.1702 13.7905 20.4941C13.4665 20.818 13.0272 21 12.5691 21C12.111 21 11.6717 20.818 11.3477 20.4941C11.0238 20.1702 10.8418 19.7308 10.8418 19.2727V19.195C10.8351 18.9091 10.7426 18.6319 10.5763 18.3993C10.4099 18.1668 10.1775 17.9896 9.90909 17.8909C9.6486 17.7759 9.35965 17.7417 9.07949 17.7925C8.79933 17.8432 8.54081 17.9768 8.33727 18.1759L8.28545 18.2277C8.12504 18.3883 7.93454 18.5157 7.72485 18.6026C7.51516 18.6896 7.2904 18.7343 7.06341 18.7343C6.83642 18.7343 6.61165 18.6896 6.40197 18.6026C6.19228 18.5157 6.00178 18.3883 5.84136 18.2277C5.68077 18.0673 5.55337 17.8768 5.46644 17.6671C5.37952 17.4574 5.33478 17.2327 5.33478 17.0057C5.33478 16.7787 5.37952 16.5539 5.46644 16.3442C5.55337 16.1346 5.68077 15.9441 5.84136 15.7836L5.89318 15.7318C6.09228 15.5283 6.22584 15.2698 6.27664 14.9896C6.32744 14.7094 6.29314 14.4205 6.17818 14.16C6.0687 13.9046 5.88693 13.6867 5.65522 13.5333C5.42351 13.3798 5.152 13.2975 4.87409 13.2964H4.72727C4.26917 13.2964 3.82983 13.1144 3.50591 12.7905C3.18198 12.4665 3 12.0272 3 11.5691C3 11.111 3.18198 10.6717 3.50591 10.3477C3.82983 10.0238 4.26917 9.84182 4.72727 9.84182H4.805C5.09086 9.83513 5.3681 9.7426 5.60067 9.57626C5.83324 9.40992 6.01039 9.17745 6.10909 8.90909C6.22405 8.6486 6.25835 8.35965 6.20755 8.07949C6.15675 7.79933 6.02319 7.54081 5.82409 7.33727L5.77227 7.28545C5.61168 7.12504 5.48428 6.93454 5.39735 6.72485C5.31043 6.51516 5.26569 6.2904 5.26569 6.06341C5.26569 5.83642 5.31043 5.61165 5.39735 5.40197C5.48428 5.19228 5.61168 5.00178 5.77227 4.84136C5.93269 4.68077 6.12319 4.55337 6.33288 4.46644C6.54256 4.37952 6.76733 4.33478 6.99432 4.33478C7.22131 4.33478 7.44607 4.37952 7.65576 4.46644C7.86545 4.55337 8.05595 4.68077 8.21636 4.84136L8.26818 4.89318C8.47172 5.09228 8.73024 5.22584 9.0104 5.27664C9.29056 5.32744 9.57951 5.29314 9.84 5.17818H9.90909C10.1645 5.0687 10.3824 4.88693 10.5358 4.65522C10.6893 4.42351 10.7716 4.152 10.7727 3.87409V3.72727C10.7727 3.26917 10.9547 2.82983 11.2786 2.50591C11.6026 2.18198 12.0419 2 12.5 2C12.9581 2 13.3974 2.18198 13.7214 2.50591C14.0453 2.82983 14.2273 3.26917 14.2273 3.72727V3.805C14.2284 4.08291 14.3107 4.35442 14.4642 4.58613C14.6176 4.81783 14.8355 4.99961 15.0909 5.10909C15.3514 5.22405 15.6403 5.25835 15.9205 5.20755C16.2007 5.15675 16.4592 5.02319 16.6627 4.82409L16.7145 4.77227C16.875 4.61168 17.0655 4.48428 17.2751 4.39735C17.4848 4.31043 17.7096 4.26569 17.9366 4.26569C18.1636 4.26569 18.3883 4.31043 18.598 4.39735C18.8077 4.48428 18.9982 4.61168 19.1586 4.77227C19.3192 4.93269 19.4466 5.12319 19.5336 5.33288C19.6205 5.54256 19.6652 5.76733 19.6652 5.99432C19.6652 6.22131 19.6205 6.44607 19.5336 6.65576C19.4466 6.86545 19.3192 7.05595 19.1586 7.21636L19.1068 7.26818C18.9077 7.47172 18.7742 7.73024 18.7234 8.0104C18.6726 8.29056 18.7069 8.57951 18.8218 8.84V8.90909C18.9313 9.16453 19.1131 9.38238 19.3448 9.53583C19.5765 9.68927 19.848 9.77162 20.1259 9.77273H20.2727C20.7308 9.77273 21.1702 9.95471 21.4941 10.2786C21.818 10.6026 22 11.0419 22 11.5C22 11.9581 21.818 12.3974 21.4941 12.7214C21.1702 13.0453 20.7308 13.2273 20.2727 13.2273H20.195C19.9171 13.2284 19.6456 13.3107 19.4139 13.4642C19.1822 13.6176 19.0004 13.8355 18.8909 14.0909Z" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              </div>
              <span class="nav-text">Manage-Access</span>
            </router-link>
          </nav>
        </div>
      </a-col>
      
      <!-- Content Area -->
      <a-col :xs="24" :sm="24" :md="18" :lg="18" class="content-area">
        
          <!-- This router-view will render the active child route component -->
          <router-view :user="user" :profile="profile" :business_info="business_info" />
        
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'store_manager',
  
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user') ),
      profile: JSON.parse(localStorage.getItem('profile') ),
      business_info: JSON.parse(localStorage.getItem('business_profile') || '{}'),

    }
  },
  computed: {
    currentRouteName() {
      return this.$route.name
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.dashboard-content {
  background: #f8f9fa;
  min-height: 100vh;
}

.sidebar-col {
  padding: 10px;
}

.sidebar {
  background: white;
  border-radius: 20px;
  padding: 2px;
  /* box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); */
  border: 1px solid #e9ecef;
}

.user-info {
  text-align: center;
  margin-bottom: 30px;
}

.user-avatar {
  width: 100px;
  height: 100px;
  margin:  auto ;
  position: relative;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e9ecef;
}

.user-info h3 {
  margin: 0 0 4px;
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
  position:absolute;
  top: 10px;
  right:10px
}

.completion-circle {
  display: inline-block;
  /* background: linear-gradient(135deg, #3b82f6, #1d4ed8); */
  color: #3b82f6;
  padding: 8px 16px;
  /* border-radius: 20px; */
  font-size: 14px;
  font-weight: 600;
}
.completion-text{
  display: flex;
  font-size: 14px;
  font-weight: 600;
}

.package-info {
  margin-bottom: 20px;
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
}

.upgrade-link:hover {
  color: #1d4ed8;
}

.package-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 5px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.package-type {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 15px;
}

.package-icon {
  color: #6b7280;
}

.dashboard-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.nav-item.active {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
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
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.content-area {
  width:100%
}

.content-wrapper {
  background: white;
  border-radius: 20px;
  margin: 20px;
  margin-left: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.wavy-header {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%);
}

.wave-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.header-profile {
  position: absolute;
  bottom: -40px;
  left: 40px;
  z-index: 10;
}

.header-avatar {
  position: relative;
  width: 80px;
  height: 80px;
}

.header-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.camera-icon {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: #374151;
  border: 2px solid white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
}

.personal-info-section {
  padding: 60px 40px 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

</style>  