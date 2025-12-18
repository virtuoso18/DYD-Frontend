<template>
  <div class="dashboard-container">
    <!-- Mobile Header -->
    <div class="mobile-header" v-if="menu_view_mobile">
      <!-- <div class="mobile-header" v-if="isMobile"> -->
      <button class="back-button" @click="goBack" v-if="menu_view_mobile">
        <svg
          width="6"
          height="11"
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
        </svg>
      </button>
      <h2 class="mobile-header-title">
        {{ menu_view_mobile ? currentPageTitle : "Menu" }}
      </h2>
      <button
        class="menu-button"
        @click="toggleMobileMenu"
        v-if="!menu_view_mobile"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <line
            x1="3"
            y1="6"
            x2="21"
            y2="6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="3"
            y1="12"
            x2="21"
            y2="12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="3"
            y1="18"
            x2="21"
            y2="18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile Drawer Menu -->
    <transition name="drawer">
      <div
        class="mobile-drawer"
        v-if="mobileMenuOpen && isMobile"
        @click.self="closeMobileMenu"
      >
        <div class="drawer-content">
          <div class="drawer-header">
            <button class="close-button" @click="closeMobileMenu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>

          <div class="user-info-mobile">
            <div class="user-avatar">
              <img
                :src="
                  this.$store.state.root_media_api + profile.profile_picture
                "
                alt="User Avatar"
              />
            </div>
            <h3>{{ user?.full_name || "John Doe" }}</h3>
            <p class="user-email">{{ user?.email || "johndoe@gmail.com" }}</p>
          </div>

          <nav class="dashboard-nav-mobile">
            <router-link
              to="/business-dashboard/my-profile"
              class="nav-item-mobile"
              :class="{ active: $route.name === 'business_my_profile' }"
              @click="closeMobileMenu"
            >
              <svg
                class="nav-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>Profile</span>
            </router-link>

            <router-link
              to="/business-dashboard/business-details"
              class="nav-item-mobile"
              :class="{ active: $route.name === 'business_business_details' }"
              @click="closeMobileMenu"
            >
              <svg
                class="nav-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3 21H21"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5 21V7L13 2L21 7V21"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9 9V21"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M17 9V21"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>Business Detail</span>
            </router-link>

            <router-link
              to="/business-dashboard/my-designs"
              class="nav-item-mobile"
              :class="{ active: $route.name === 'business_my_designs' }"
              @click="closeMobileMenu"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.10156 14.8786C4.21739 16.0562 4.47917 16.8488 5.07078 17.4404C6.13193 18.5016 7.8398 18.5016 11.2556 18.5016C14.6713 18.5016 16.3793 18.5016 17.4404 17.4404C18.5016 16.3793 18.5016 14.6713 18.5016 11.2556C18.5016 7.8398 18.5016 6.13193 17.4404 5.07078C16.8488 4.47917 16.0562 4.21739 14.8786 4.10156"
                  stroke="currentColor"
                />
                <path
                  d="M0.5 7.7C0.5 4.30588 0.5 2.60883 1.55441 1.55441C2.60883 0.5 4.30588 0.5 7.7 0.5C11.0941 0.5 12.7912 0.5 13.8456 1.55441C14.9 2.60883 14.9 4.30588 14.9 7.7C14.9 11.0941 14.9 12.7912 13.8456 13.8456C12.7912 14.9 11.0941 14.9 7.7 14.9C4.30588 14.9 2.60883 14.9 1.55441 13.8456C0.5 12.7912 0.5 11.0941 0.5 7.7Z"
                  stroke="currentColor"
                />
                <path
                  d="M3.19922 14.8992C6.27777 10.623 9.73745 4.95193 14.8992 9.20524"
                  stroke="currentColor"
                />
              </svg>

              <span>My Designs</span>
            </router-link>

            <router-link
              to="/business-dashboard/my-products"
              class="nav-item-mobile"
              :class="{ active: $route.name === 'business_my_products' }"
              @click="closeMobileMenu"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.5 5L9.5 0.5L0.5 5V14L9.5 18.5L18.5 14V5Z"
                  stroke="currentColor"
                  stroke-linejoin="round"
                />
                <path
                  d="M0.5 5L9.5 9.5M9.5 9.5V18.5M9.5 9.5L18.5 5M14 2.75L5 7.25"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span>My Products</span>
            </router-link>

            <router-link
              to="/business-dashboard/comunity"
              class="nav-item-mobile"
              :class="{
                active: $route.name === 'business_dashboard_community',
              }"
              @click="closeMobileMenu"
            >
              <svg
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 1.25C9.46957 1.25 8.96086 1.46071 8.58579 1.83578C8.21071 2.21086 8 2.71956 8 3.24999C8 3.78043 8.21071 4.28913 8.58579 4.66421C8.96086 5.03928 9.46957 5.24999 10 5.24999C10.5304 5.24999 11.0391 5.03928 11.4142 4.66421C11.7893 4.28913 12 3.78043 12 3.24999C12 2.71956 11.7893 2.21086 11.4142 1.83578C11.0391 1.46071 10.5304 1.25 10 1.25ZM6.75 3.24999C6.75 2.38804 7.09241 1.56139 7.7019 0.951901C8.3114 0.342409 9.13805 0 10 0C10.862 0 11.6886 0.342409 12.2981 0.951901C12.9076 1.56139 13.25 2.38804 13.25 3.24999C13.25 4.11195 12.9076 4.9386 12.2981 5.54809C11.6886 6.15758 10.862 6.49999 10 6.49999C9.13805 6.49999 8.3114 6.15758 7.7019 5.54809C7.09241 4.9386 6.75 4.11195 6.75 3.24999ZM2.75 3.24999C2.35218 3.24999 1.97064 3.40803 1.68934 3.68933C1.40804 3.97064 1.25 4.35217 1.25 4.74999C1.25 5.14782 1.40804 5.52935 1.68934 5.81065C1.97064 6.09196 2.35218 6.24999 2.75 6.24999C3.14782 6.24999 3.52936 6.09196 3.81066 5.81065C4.09196 5.52935 4.25 5.14782 4.25 4.74999C4.25 4.35217 4.09196 3.97064 3.81066 3.68933C3.52936 3.40803 3.14782 3.24999 2.75 3.24999ZM0 4.74999C0 4.02065 0.289731 3.32118 0.805456 2.80545C1.32118 2.28973 2.02065 2 2.75 2C3.47935 2 4.17882 2.28973 4.69454 2.80545C5.21027 3.32118 5.5 4.02065 5.5 4.74999C5.5 5.47934 5.21027 6.17881 4.69454 6.69453C4.17882 7.21026 3.47935 7.49999 2.75 7.49999C2.02065 7.49999 1.32118 7.21026 0.805456 6.69453C0.289731 6.17881 0 5.47934 0 4.74999ZM15.75 4.74999C15.75 4.35217 15.908 3.97064 16.1893 3.68933C16.4706 3.40803 16.8522 3.24999 17.25 3.24999C17.6478 3.24999 18.0294 3.40803 18.3107 3.68933C18.592 3.97064 18.75 4.35217 18.75 4.74999C18.75 5.14782 18.592 5.52935 18.3107 5.81065C18.0294 6.09196 17.6478 6.24999 17.25 6.24999C16.8522 6.24999 16.4706 6.09196 16.1893 5.81065C15.908 5.52935 15.75 5.14782 15.75 4.74999ZM17.25 2C16.5207 2 15.8212 2.28973 15.3055 2.80545C14.7897 3.32118 14.5 4.02065 14.5 4.74999C14.5 5.47934 14.7897 6.17881 15.3055 6.69453C15.8212 7.21026 16.5207 7.49999 17.25 7.49999C17.9793 7.49999 18.6788 7.21026 19.1945 6.69453C19.7103 6.17881 20 5.47934 20 4.74999C20 4.02065 19.7103 3.32118 19.1945 2.80545C18.6788 2.28973 17.9793 2 17.25 2ZM5.5 9.62498C5.5 9.19401 5.67121 8.78068 5.97595 8.47594C6.2807 8.17119 6.69402 7.99999 7.125 7.99999H12.875C13.306 7.99999 13.7193 8.17119 14.024 8.47594C14.3288 8.78068 14.5 9.19401 14.5 9.62498V13.5C14.5 14.6935 14.0259 15.838 13.182 16.682C12.3381 17.5259 11.1935 18 10 18C8.80653 18 7.66193 17.5259 6.81802 16.682C5.97411 15.838 5.5 14.6935 5.5 13.5V9.62498ZM7.125 9.24998C7.02554 9.24998 6.93016 9.28949 6.85983 9.35982C6.78951 9.43015 6.75 9.52553 6.75 9.62498V13.5C6.75 14.3619 7.09241 15.1886 7.7019 15.7981C8.3114 16.4076 9.13805 16.75 10 16.75C10.862 16.75 11.6886 16.4076 12.2981 15.7981C12.9076 15.1886 13.25 14.3619 13.25 13.5V9.62498C13.25 9.52553 13.2105 9.43015 13.1402 9.35982C13.0698 9.28949 12.9745 9.24998 12.875 9.24998H7.125ZM4.576 8.99499C4.52567 9.19699 4.50033 9.40699 4.5 9.62498V10.309L1.53 11.105C1.43403 11.1308 1.35221 11.1936 1.30252 11.2796C1.25283 11.3657 1.23934 11.468 1.265 11.564L2.009 14.341C2.21174 15.0981 2.68126 15.7564 3.33104 16.1947C3.98082 16.6329 4.76709 16.8216 5.545 16.726C5.8299 17.1194 6.16565 17.4733 6.5435 17.7785C6.46783 17.8035 6.39117 17.8261 6.3135 17.8465C5.74268 17.9995 5.14729 18.0386 4.56135 17.9616C3.97541 17.8845 3.41039 17.6928 2.89854 17.3974C2.3867 17.1019 1.93806 16.7086 1.57825 16.2398C1.21844 15.7709 0.954496 15.2358 0.8015 14.665L0.0569999 11.888C0.0018077 11.6818 -0.0122402 11.4668 0.0156581 11.2553C0.0435565 11.0437 0.112855 10.8397 0.219596 10.6549C0.326338 10.4701 0.468432 10.3082 0.637766 10.1783C0.807099 10.0484 1.00036 9.95317 1.2065 9.89798L4.576 8.99499ZM13.456 17.7785C13.532 17.8035 13.6088 17.8261 13.6865 17.8465C14.2573 17.9994 14.8527 18.0385 15.4386 17.9614C16.0245 17.8842 16.5895 17.6925 17.1013 17.397C17.6131 17.1015 18.0617 16.7081 18.4214 16.2393C18.7812 15.7704 19.0451 15.2353 19.198 14.6645L19.942 11.8875C20.0535 11.4712 19.9951 11.0277 19.7796 10.6545C19.5641 10.2814 19.2092 10.009 18.793 9.89748L15.424 8.99449C15.4743 9.19682 15.4997 9.40682 15.5 9.62449V10.3095L18.4695 11.1045C18.5171 11.1172 18.5618 11.1393 18.6009 11.1693C18.64 11.1993 18.6728 11.2368 18.6974 11.2795C18.722 11.3222 18.738 11.3694 18.7443 11.4183C18.7507 11.4672 18.7474 11.5169 18.7345 11.5645L17.9905 14.341C17.7878 15.098 17.3183 15.7562 16.6687 16.1945C16.019 16.6327 15.2328 16.8215 14.455 16.726C14.1701 17.1194 13.8338 17.4733 13.456 17.7785Z"
                  fill="currentColor"
                />
              </svg>

              <span>Community</span>
            </router-link>

            <router-link
              to="/business-dashboard/generate-banner"
              class="nav-item-mobile"
              :class="{ active: $route.name === 'business_generate_banner' }"
              @click="closeMobileMenu"
            >
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.5385 0.5H2.46154C1.37821 0.5 0.5 1.37821 0.5 2.46154V12.9231C0.5 14.0064 1.37821 14.8846 2.46154 14.8846H15.5385C16.6218 14.8846 17.5 14.0064 17.5 12.9231V2.46154C17.5 1.37821 16.6218 0.5 15.5385 0.5Z"
                  stroke="currentColor"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.2686 5.73257C12.9908 5.73257 13.5763 5.1471 13.5763 4.42488C13.5763 3.70266 12.9908 3.11719 12.2686 3.11719C11.5464 3.11719 10.9609 3.70266 10.9609 4.42488C10.9609 5.1471 11.5464 5.73257 12.2686 5.73257Z"
                  stroke="currentColor"
                  stroke-miterlimit="10"
                />
                <path
                  d="M10.9615 10.9519L7.25668 7.254C7.02093 7.01831 6.70406 6.88154 6.37084 6.87167C6.03762 6.86179 5.71321 6.97955 5.46392 7.20088L0.5 11.6143M7.69231 14.8836L12.7326 9.84324C12.9632 9.61227 13.2717 9.47582 13.5976 9.4607C13.9236 9.44558 14.2434 9.55287 14.4944 9.7615L17.5 12.2682"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span>Generate a Banner</span>
            </router-link>

            <router-link
              to="/business-dashboard/manage-subscription"
              class="nav-item-mobile"
              :class="{
                active: $route.name === 'business_manage_subscription',
              }"
              @click="closeMobileMenu"
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

              <span>Manage Subscription</span>
            </router-link>

            <router-link
              to="/business-dashboard/my-transactions"
              class="nav-item-mobile"
              :class="{ active: $route.name === 'my_transactions' }"
              @click="closeMobileMenu"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5 6.5H0.5L6 0.5M0.5 10.5H16.5L11 16.5"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span>Transactions</span>
            </router-link>

            <div class="divider"></div>

            <div class="nav-item-mobile logout" @click="logoutAndClose">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.81818 16C1.31818 16 0.890303 15.8261 0.534545 15.4782C0.178788 15.1304 0.000606061 14.7117 0 14.2222V1.77778C0 1.28889 0.178182 0.870518 0.534545 0.522666C0.890909 0.174815 1.31879 0.000592592 1.81818 0H7.27273C7.5303 0 7.74636 0.0853334 7.92091 0.256C8.09545 0.426666 8.18242 0.637629 8.18182 0.888888C8.18121 1.14015 8.09394 1.35141 7.92 1.52267C7.74606 1.69392 7.5303 1.77896 7.27273 1.77778H1.81818V14.2222H7.27273C7.5303 14.2222 7.74636 14.3075 7.92091 14.4782C8.09545 14.6489 8.18242 14.8598 8.18182 15.1111C8.18121 15.3624 8.09394 15.5736 7.92 15.7449C7.74606 15.9161 7.5303 16.0012 7.27273 16H1.81818ZM12.8864 8.88888H6.36364C6.10606 8.88888 5.8903 8.80355 5.71636 8.63288C5.54242 8.46222 5.45515 8.25125 5.45455 7.99999C5.45394 7.74873 5.54121 7.53777 5.71636 7.36711C5.89152 7.19644 6.10727 7.11111 6.36364 7.11111H12.8864L11.1818 5.44444C11.0152 5.28148 10.9318 5.08148 10.9318 4.84444C10.9318 4.6074 11.0152 4.4 11.1818 4.22222C11.3485 4.04444 11.5606 3.9517 11.8182 3.944C12.0758 3.93629 12.2955 4.02163 12.4773 4.2L15.7273 7.37777C15.9091 7.55555 16 7.76296 16 7.99999C16 8.23703 15.9091 8.44444 15.7273 8.62222L12.4773 11.8C12.2955 11.9778 12.0797 12.0631 11.83 12.056C11.5803 12.0489 11.3642 11.9561 11.1818 11.7778C11.0152 11.6 10.9358 11.389 10.9436 11.1449C10.9515 10.9007 11.0385 10.6969 11.2045 10.5333L12.8864 8.88888Z"
                  fill="currentColor"
                />
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
      <a-col
        :xs="!menu_view_mobile ? 24 : 0"
        :sm="!menu_view_mobile ? 24 : 0"
        :md="6"
        :lg="6"
        class="sidebar-col"
        v-if="!this.$route.query.p"
      >
        <div class="sidebar">
          <!-- <div class="!font-[Poppins] !font-semibold !text-[24px] leading-[32px] tracking-[0]">
  profile
</div> -->
          <div class="user-info">
            <div class="user-avatar">
              <img
                :src="
                  this.$store.state.root_media_api + profile.profile_picture
                "
                alt="John Doe"
              />
            </div>
            <h3
              class="font-[Poppins] font-medium text-[18px] leading-[28px] tracking-[0] text-center"
            >
              {{ user?.full_name || "John Doe" }}
            </h3>
            <p
              class="font-[Poppins] font-normal text-[14px] leading-[20px] tracking-[0] text-center"
            >
              {{ user?.email || "johndoe@gmail.com" }}
            </p>

            <div class="your-parent-component">
              <!-- Completion Badge (Clickable) -->
              <div class="completion-badge" @click="openCompletionModal">
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
                <span
                  class="package-label font-[Poppins] font-medium text-[16px] leading-[24px] tracking-[0] text-[#262626]"
                >
                  Your package
                </span>
                <router-link to="/pricing" class="upgrade-link"
                  >Upgrade</router-link
                >
              </div>
              <div class="package-card">
                <span
                  class="package-type font-[Poppins] font-semibold text-[16px] leading-[24px] tracking-[0] text-[#3B63FB]"
                >
                  Business
                </span>
                <div class="package-icon">
                  <img
                    src="../../../assets/dyd-logo.png"
                    alt=""
                    style="width: 40px; height: 40px"
                  />
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

                <span class="nav-text">Profile</span>
              </div>

              <!-- RIGHT SIDE ARROW -->
              <img
                src="/openfile.svg"
                alt="arrow"
                class="w-4 h-4 md:hidden block"
              />
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
                  <svg
                    class="nav-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M3 21H21"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5 21V7L13 2L21 7V21"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9 9V21"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M17 9V21"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>

                <span class="nav-text">Business Detail</span>
              </div>

              <!-- RIGHT SIDE ARROW -->
              <img
                src="/openfile.svg"
                alt="arrow"
                class="w-4 h-4 md:hidden block"
              />
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
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.10156 14.8786C4.21739 16.0562 4.47917 16.8488 5.07078 17.4404C6.13193 18.5016 7.8398 18.5016 11.2556 18.5016C14.6713 18.5016 16.3793 18.5016 17.4404 17.4404C18.5016 16.3793 18.5016 14.6713 18.5016 11.2556C18.5016 7.8398 18.5016 6.13193 17.4404 5.07078C16.8488 4.47917 16.0562 4.21739 14.8786 4.10156"
                      stroke="currentColor"
                    />
                    <path
                      d="M0.5 7.7C0.5 4.30588 0.5 2.60883 1.55441 1.55441C2.60883 0.5 4.30588 0.5 7.7 0.5C11.0941 0.5 12.7912 0.5 13.8456 1.55441C14.9 2.60883 14.9 4.30588 14.9 7.7C14.9 11.0941 14.9 12.7912 13.8456 13.8456C12.7912 14.9 11.0941 14.9 7.7 14.9C4.30588 14.9 2.60883 14.9 1.55441 13.8456C0.5 12.7912 0.5 11.0941 0.5 7.7Z"
                      stroke="currentColor"
                    />
                    <path
                      d="M3.19922 14.8992C6.27777 10.623 9.73745 4.95193 14.8992 9.20524"
                      stroke="currentColor"
                    />
                  </svg>
                </div>

                <span class="nav-text">My Designs</span>
              </div>

              <!-- RIGHT SIDE: ARROW -->
              <img
                src="/openfile.svg"
                alt="arrow"
                class="w-4 h-4 md:hidden block"
              />
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
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.90304 15.1577C5.7611 13.556 1.51758 9.89416 1.51758 6.59893C1.51758 4.42091 3.11591 2.65527 5.31361 2.65527C6.45242 2.65527 7.59123 3.03488 9.10965 4.55329C10.6281 3.03488 11.7669 2.65527 12.9057 2.65527C15.1034 2.65527 16.7017 4.42091 16.7017 6.59893C16.7017 9.89416 12.4582 13.556 10.3163 15.1577C9.59546 15.6966 8.62383 15.6966 7.90304 15.1577Z"
                      stroke="currentcolor"
                      stroke-width="1.13881"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>

                <span class="nav-text">My Likes</span>
              </div>

              <!-- RIGHT SIDE: ARROW -->
              <img
                src="/openfile.svg"
                alt="arrow"
                class="w-4 h-4 md:hidden block"
              />
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
                  <svg
                    class="nav-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <polyline
                      points="3.27,6.96 12,12.01 20.73,6.96"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <line
                      x1="12"
                      y1="22.08"
                      x2="12"
                      y2="12"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>

                <span class="nav-text">My Products</span>
              </div>

              <!-- RIGHT SIDE ARROW -->
              <img
                src="/openfile.svg"
                alt="arrow"
                class="w-4 h-4 md:hidden block"
              />
            </router-link>

            <router-link
              to="/business-dashboard/comunity"
              class="nav-item flex items-center justify-between"
              :class="{
                active: $route.name === 'business_dashboard_community',
              }"
              @click="menu_view_mobile = true"
            >
              <!-- LEFT: Icon + Text -->
              <div class="flex items-center gap-2">
                <div class="nav-icon-wrapper">
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
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.5385 0.5H2.46154C1.37821 0.5 0.5 1.37821 0.5 2.46154V12.9231C0.5 14.0064 1.37821 14.8846 2.46154 14.8846H15.5385C16.6218 14.8846 17.5 14.0064 17.5 12.9231V2.46154C17.5 1.37821 16.6218 0.5 15.5385 0.5Z"
                      stroke="currentColor"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.2686 5.73257C12.9908 5.73257 13.5763 5.1471 13.5763 4.42488C13.5763 3.70266 12.9908 3.11719 12.2686 3.11719C11.5464 3.11719 10.9609 3.70266 10.9609 4.42488C10.9609 5.1471 11.5464 5.73257 12.2686 5.73257Z"
                      stroke="currentColor"
                      stroke-miterlimit="10"
                    />
                    <path
                      d="M10.9615 10.9519L7.25668 7.254C7.02093 7.01831 6.70406 6.88154 6.37084 6.87167C6.03762 6.86179 5.71321 6.97955 5.46392 7.20088L0.5 11.6143M7.69231 14.8836L12.7326 9.84324C12.9632 9.61227 13.2717 9.47582 13.5976 9.4607C13.9236 9.44558 14.2434 9.55287 14.4944 9.7615L17.5 12.2682"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
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
              :class="{
                active: $route.name === 'business_manage_subscription',
              }"
              @click="menu_view_mobile = true"
            >
              <div class="flex items-center w-full justify-between">
                <!-- Left: Icon + Text -->
                <div class="flex items-center gap-3">
                  <div class="nav-icon-wrapper">
                    <svg
                      width="25"
                      height="21"
                      viewBox="0 0 25 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.925 6.93125H17.7M6.925 6.93125H0.75M6.925 6.93125L11.4875 19.495M6.925 6.93125L9.925 2.015L10.6125 0.75M17.7 6.93125H23.875M17.7 6.93125L13.1375 19.495M17.7 6.93125L14.7 2.015L13.9925 0.75M0.75 6.93125C0.75 7.45625 0.84875 7.98125 1.045 8.47625C1.31 9.145 1.8475 9.76125 2.92 10.9925L7.25375 15.9625C9 17.965 9.8725 18.9675 10.9075 19.335C11.0983 19.4025 11.2917 19.4558 11.4875 19.495M0.75 6.93125C0.75 6.40625 0.84875 5.88125 1.045 5.385C1.31 4.71625 1.8475 4.10125 2.92 2.86875C3.50375 2.20125 3.795 1.8675 4.1325 1.60875C4.63427 1.22633 5.21575 0.96187 5.83375 0.835C6.25125 0.75 6.69375 0.75 7.58 0.75H10.6125M11.4875 19.495C12.0322 19.6028 12.5928 19.6028 13.1375 19.495M10.6125 0.75H13.9925M23.875 6.93125C23.875 7.45625 23.7762 7.98125 23.58 8.47625C23.315 9.145 22.7775 9.76125 21.705 10.9925L17.3713 15.9625C15.625 17.965 14.7525 18.9675 13.7175 19.335C13.5282 19.402 13.3344 19.4554 13.1375 19.495M23.875 6.93125C23.875 6.40625 23.7762 5.88125 23.58 5.385C23.315 4.71625 22.7775 4.10125 21.705 2.86875C21.1212 2.20125 20.83 1.8675 20.4925 1.60875C19.9907 1.22633 19.4092 0.96187 18.7913 0.835C18.3738 0.75 17.9313 0.75 17.045 0.75H13.9925"
                        stroke="currentcolor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
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
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 7H1L6.5 1M1 11H17L11.5 17"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
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
              <div
                className="w-full h-[46px] bg-[#FEE3E0] rounded-[8px] flex items-center justify-center gap-2 cursor-pointer hover:bg-[#fcbeb8] transition"
              >
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
                <span
                  class="text-[16px] font-[600] text-[orangered] font-[Poppins]"
                >
                  Logout
                </span>
              </div>
            </div>
          </nav>
        </div>
      </a-col>

      <!-- Content Area -->
      <a-col
        :xs="menu_view_mobile ? 24 : !this.$route.query.p ? 0 : 24"
        :sm="menu_view_mobile ? 24 : !this.$route.query.p ? 0 : 24"
        :md="18"
        :lg="18"
        class="content-area"
      >
        <router-view
          :user="user"
          :profile="profile"
          :buisness_info="business_info"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { notification } from "ant-design-vue";
import ProfileCompletionModal from "./ProfileCompletionModal.vue";

export default {
  name: "DashboardManager_business_user",

  components: {
    ProfileCompletionModal,
  },

  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      profile: JSON.parse(localStorage.getItem("profile") || "{}"),
      business_info: JSON.parse(
        localStorage.getItem("business_profile") || "{}"
      ),
      menu_view_mobile: false,
      mobileMenuOpen: false,
      isMobile: false,

      // Profile Completion Modal
      showCompletionModal: false,
      profileSteps: [
        {
          id: 1,
          title: "Personal details",
          description:
            "Please fill in your personal details accurately to ensure a smooth process.",
          completed: false,
          missing_fields: [], // Add this
        },
        {
          id: 2,
          title: "Business details",
          description: "Please fill in your Business details accurately.",
          completed: false,
          missing_fields: [], // Add this
        },
        {
          id: 3,
          title: "Add at least 3 products",
          description:
            "Please add at least three products to proceed with the process.",
          completed: false,
          missing_fields: [], // Add this
          metadata: {
            products_added: 0,
            products_required: 3,
          },
        },
        {
          id: 4,
          title: "Generate Your First Simulation",
          description:
            "Create your first simulation with products that you have in your business AI catalog.",
          completed: false,
          missing_fields: [], // Add this
        },
      ],
    };
  },

  computed: {
    currentRouteName() {
      return this.$route.name;
    },

    currentPageTitle() {
      const titles = {
        business_my_profile: "Profile",
        business_business_details: "Business Detail",
        business_my_designs: "My Designs",
        business_my_products: "My Products",
        business_dashboard_community: "Community",
        business_generate_banner: "Generate Banner",
        business_manage_subscription: "Manage Subscription",
        my_transactions: "Transactions",
      };
      return titles[this.$route.name] || "Dashboard";
    },

    completionPercentage() {
      const completed = this.profileSteps.filter(
        (step) => step.completed
      ).length;
      return Math.round((completed / this.profileSteps.length) * 100);
    },

    isProfileComplete() {
      return this.profileSteps.every((step) => step.completed);
    },
  },

  methods: {
    async fetchOnboardingProgress() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}Auth/api/onboarding-progress/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Onboarding Progress:", data);

          // Update profileSteps with API response including missing_fields
          if (data.success && data.data.steps) {
            data.data.steps.forEach((apiStep) => {
              const localStep = this.profileSteps.find(
                (s) => s.id === apiStep.step
              );
              if (localStep) {
                localStep.completed = apiStep.is_completed;
                // Add missing fields from API response
                localStep.missing_fields = apiStep.missing_fields || [];
                // Add metadata if present (for step 3)
                if (apiStep.metadata) {
                  localStep.metadata = apiStep.metadata;
                }
              }
            });
          }

          // Update completion percentage
          const completed = this.profileSteps.filter(
            (step) => step.completed
          ).length;
          const completionPercent = Math.round(
            (completed / this.profileSteps.length) * 100
          );
          console.log(`Profile Completion: ${completionPercent}%`);

          return data;
        } else {
          console.error(
            "Failed to fetch onboarding progress:",
            response.status
          );
          notification.error({
            message: "Failed to load progress",
            description: "Unable to fetch your onboarding progress",
            placement: "bottomRight",
          });
        }
      } catch (error) {
        console.error("Error fetching onboarding progress:", error);
        notification.error({
          message: "Error",
          description: "An error occurred while fetching your progress",
          placement: "bottomRight",
        });
      }
    },

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
      this.$store.dispatch("logout");
      localStorage.removeItem("profile");
      localStorage.removeItem("business_profile");
      this.$router.push("/login");

      notification.success({
        message: "Logout Successful",
        placement: "bottomRight",
      });
    },

    // Profile Completion Methods
    openCompletionModal() {
      this.fetchOnboardingProgress();
      this.showCompletionModal = true;
    },

    closeCompletionModal() {
      this.showCompletionModal = false;
    },

    handleProfileComplete() {
      this.showCompletionModal = false;

      // notification.success({
      //   message: "Profile Completed!",
      //   description: "Your profile setup is now complete. You can start using all features.",
      //   placement: 'bottomRight'
      // });

      // Optional: Reload profile data or redirect
      this.fetchProfileStatus();
    },

    async fetchProfileStatus() {
      try {
        // Check personal details completion
        const hasPersonalDetails =
          this.profile &&
          this.profile.full_name &&
          this.profile.email &&
          this.profile.phone;

        // Check business details completion
        const hasBusinessDetails =
          this.business_info &&
          this.business_info.business_name &&
          this.business_info.business_type;

        // Update step 1 (Personal details)
        this.profileSteps[0].completed = hasPersonalDetails;

        // Update step 2 (Business details)
        this.profileSteps[1].completed = hasBusinessDetails;

        // Fetch products count from API
        const response = await fetch(
          `${this.$store.state.root_api}products/count`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Update step 3 (Add at least 3 products)
          this.profileSteps[2].completed = data.count >= 3;
        }

        // Check if AI catalog exists
        const catalogResponse = await fetch(
          `${this.$store.state.root_api}catalog/check`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );

        if (catalogResponse.ok) {
          const catalogData = await catalogResponse.json();
          // Update step 4 (Create AI Catalog)
          this.profileSteps[3].completed = catalogData.exists;
        }
      } catch (error) {
        console.error("Failed to fetch profile status:", error);
      }
    },

    updateStepCompletion(stepId, completed) {
      const step = this.profileSteps.find((s) => s.id === stepId);
      if (step) {
        step.completed = completed;
      }
    },
  },

  async mounted() {
    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize);

    // Fetch profile completion status on mount
    await this.fetchOnboardingProgress();

    // Optional: Show modal automatically if profile is incomplete
    if (!this.isProfileComplete && this.completionPercentage < 100) {
      // Show modal after a short delay
      setTimeout(() => {
        this.showCompletionModal = false;
      }, 2000);
    }
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.checkScreenSize);
  },

  created() {
    // Debug: Log current route information
    console.log("Current route:", this.$route);
    console.log("Current route name:", this.$route.name);
    console.log("Current route path:", this.$route.path);
  },
};
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
  /* background: linear-gradient(135deg, #3b82f6, #1d4ed8); */
  background-color: #3B63FB;
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
  /* overflow-y: auto; */
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
  font-family: "Poppins", sans-serif;
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
  border-radius: 12px;
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@media (min-width: 768px) {
  .nav-item:hover {
    background-color: #f3f4f6;
    color: #374151;
  }

  .nav-item.active {
    /* background: linear-gradient(135deg, #3b82f6, #1d4ed8); */
    background-color: #3b63fb;
    color: white;
  }
}

.nav-item.active:hover {
  /* background: linear-gradient(135deg, #1d4ed8, #1e40af); */
  background-color: #738ef8;
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
}

@media (max-width: 1200px) {
  /* .sidebar {
    max-height: calc(100vh - 20px);
  } */
}

.nav-text {
  font-family: "Poppins", sans-serif;
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
    /* background: linear-gradient(135deg, #3b82f6, #1d4ed8); */
    background-color: #3b63fb;
    color: white;
  }

  /* FIX: Ensure text color is white when active */
  .nav-item.active .nav-text {
    color: white;
  }
}

.nav-item.active:hover {
  /* background: linear-gradient(135deg, #1d4ed8, #1e40af); */
  background-color: #6884f2;
  color: white;
}

/* FIX: Ensure all text is white on active hover */
.nav-item.active:hover .nav-text {
  color: white;
}
</style>
