<template>
  <div class="pb-2">
    <button
      @click="navigateToStore"
      class="w-full bg-gradient-to-r !font-family-poppins from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 !text-white font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-0.5"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 16 17"
        fill="none"
      >
        <path
          d="M1.97754 7.49756V10.8321C1.97754 12.7184 1.97754 13.6616 2.56333 14.2476C3.14911 14.8336 4.09192 14.8336 5.97754 14.8336H9.97754C11.8631 14.8336 12.8059 14.8336 13.3917 14.2476C13.9775 13.6616 13.9775 12.7184 13.9775 10.8321V7.49756"
          stroke="white"
          stroke-linecap="round"
        />
        <path
          d="M4.64453 12.4946H7.3112"
          stroke="white"
          stroke-linecap="round"
        />
        <path
          d="M6.73554 6.11184C6.54755 6.79077 5.86386 7.96195 4.56485 8.13169C3.41789 8.28155 2.54798 7.78089 2.32578 7.57156C2.08079 7.40182 1.52245 6.85866 1.38571 6.51919C1.24897 6.17973 1.4085 5.44421 1.52245 5.14435L1.97796 3.82543C2.08916 3.49415 2.34947 2.71062 2.61635 2.4456C2.88323 2.18058 3.42355 2.16905 3.64594 2.16905H8.31627C9.51841 2.18603 12.1469 2.15833 12.6665 2.16905C13.1861 2.17977 13.4984 2.61533 13.5895 2.80203C14.3648 4.67991 14.6663 5.75539 14.6663 6.21367C14.5651 6.70255 14.1463 7.62436 12.6665 8.02982C11.1285 8.45122 10.2566 7.63162 9.98307 7.31695M6.10315 7.31695C6.31965 7.58282 6.99881 8.11809 7.98327 8.13169C8.96781 8.14522 9.81787 7.45836 10.1198 7.11326C10.2053 7.01142 10.3899 6.7093 10.5813 6.11184"
          stroke="white"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
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

    <!-- Business Detail -->
    <router-link
      to="/business-dashboard/business-details?p=true"
      class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
      :class="{ 'nav-active': $route.name === 'business_business_details' }"
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
            d="M3 21H21"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5 21V7L13 2L21 7V21"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9 9V21"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17 9V21"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <span class="flex-1 text-sm !font-family-poppins">Business Detail</span>
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

    <!-- My Designs -->
    <router-link
      to="/business-dashboard/my-designs?p=true"
      class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
      :class="{ 'nav-active': $route.name === 'business_my_designs' }"
      @click="closeMobileMenu"
    >
      <div
        class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100"
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

    <!-- my likes  -->
    <router-link
      to="/business-dashboard/my-likes"
      class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
      :class="{ 'nav-active': $route.name === 'business_my_likes' }"
      @click="closeMobileMenu"
    >
      <div
        class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100"
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

    <!-- My Products -->
    <router-link
      to="/business-dashboard/my-products?p=true"
      class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
      :class="{ 'nav-active': $route.name === 'business_my_products' }"
      @click="closeMobileMenu"
    >
      <div
        class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100"
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
      </div>
      <span class="flex-1 text-sm !font-family-poppins">My Products</span>
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

    <!-- Community -->
    <router-link
      to="/business-dashboard/comunity?p=true"
      class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
      :class="{ 'nav-active': $route.name === 'business_dashboard_community' }"
      @click="closeMobileMenu"
    >
      <div
        class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100"
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
      </div>
      <span class="flex-1 text-sm !font-family-poppins">Community</span>
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

    <!-- Generate Banner -->
    <router-link
      to="/business-dashboard/generate-banner?p=true"
      class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
      :class="{ 'nav-active': $route.name === 'business_generate_banner' }"
      @click="closeMobileMenu"
    >
      <div
        class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100"
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
      </div>
      <span class="flex-1 text-sm !font-family-poppins">Generate Banner</span>
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
      to="/business-dashboard/manage-subscription?p=true"
      class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
      :class="{ 'nav-active': $route.name === 'business_manage_subscription' }"
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

    <!-- Transactions -->
    <router-link
      to="/business-dashboard/my-transactions?p=true"
      class="flex items-center gap-4 px-2 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 relative overflow-hidden group hover:bg-gray-50 hover:text-blue-600"
      :class="{ 'nav-active': $route.name === 'my_transactions' }"
      @click="closeMobileMenu"
    >
      <div
        class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100"
      >
        <svg
          class="w-5 h-5"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M17 7H1L6.5 1M1 11H17L11.5 17"
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

    <!-- Divider -->
    <div class="h-px bg-gray-200 my-4"></div>

    <!-- Logout -->
    <button
      @click="logoutAndClose"
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
</template>
<script>
export default {
  name: "business_user_nav_drawar_menu",

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

    navigateToStore() {
      this.$router.push({ name: "my-store" });
      this.closeMobileMenu();
    },

    logoutAndClose() {
      console.log("Logging out...");
      this.closeMobileMenu();
      // Add your logout logic
    },
  },
};
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
