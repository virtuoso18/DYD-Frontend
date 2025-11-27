<template>
  <div class="dashboard-container min-h-screen block md:hidden bg-gray-100">
    <div class="flex flex-col lg:flex-row min-h-screen">
      <!-- Sidebar (Shows only in mobile unless showContentMobile is true) -->
      <aside v-if="showSidebar" class="sidebar w-full lg:w-1/4 bg-white rounded-2xl p-6 border border-gray-200 shadow h-full lg:sticky lg:top-8">
        <!-- User Info -->
       <div class="user-info flex flex-col items-center text-center mb-8">

  <!-- Avatar Circle -->
  <div class="user-avatar flex justify-center items-center mb-2 w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100">
    <img :src="this.$store.state.root_media_api+business_info.banner_picture" alt="Avatar" class="w-full h-full object-cover" />
  </div>

  <!-- Name + Email -->
  <h3 class="text-lg font-semibold mt-2">
    {{ business_info?.name || "John Doe" }}
  </h3>

  <p class="user-email text-gray-500 text-sm mb-3">
    {{ business_info?.email || "johndoe@gmail.com" }}
  </p>

</div>

        <!-- Sidebar Navigation -->
       <nav class="dashboard-nav flex flex-col gap-2">
  <button
    v-for="item in navItems"
    :key="item.name"
    @click="navigateTo(item.route)"
    class="nav-item flex items-center justify-between gap-2 px-4 py-3 rounded-lg font-medium max-w-full whitespace-nowrap md:bg-gradient-to-r shadow-sm from-[#3B63FB] to-[#5E7BFF] md:!text-white"
  >
    <!-- Left side -->
    <div class="flex items-center gap-2">
      <span v-html="item.icon" class="w-6 h-6 flex-shrink-0"></span>
<span class="font-medium text-[14px] leading-[20px] tracking-normal font-[Poppins]">
        {{ item.label }}</span>
    </div>

    <!-- Right Arrow Icon -->
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="flex-shrink-0"
    >
      <path d="M6 4l6 6-6 6" />
    </svg>
  </button>
</nav>

      </aside>

      <!-- Content Area -->
      <main v-if="showContentMobile" class="content-area flex-1 relative bg-gray-100 p-4 min-h-[80vh]">
        <button
          v-if="isMobile"
          @click="backToSidebar"
          class="absolute top-2 left-2 bg-white px-3 py-1 rounded flex items-center text-blue-600 font-semibold shadow z-20"
        >
          <!-- Back Icon SVG -->
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-2">
            <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back
        </button>
        <!-- router-view or fallback message -->
        <router-view v-if="business_info.is_email_verified" :user="user" :profile="profile" :business_info="business_info" />
        <div v-else class="bg-white rounded-xl p-8 mt-8 flex flex-col items-center text-center border border-blue-100">
          <img src="../../assets/emailverify.jpg" class="mb-4 max-w-[120px]" alt="">
          <div class="mb-2">Your Business email is not verified yet, please verify to access store features.</div>
          <router-link to="/business-dashboard/business-details">
            <button class="bg-blue-600 text-white px-4 py-2 rounded mt-2">Verify now</button>
          </router-link>
        </div>
      </main>
      <!-- On desktop, sidebar+main show side by side; mobile only one shows at a time -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

// Replace with your icons (SVG strings)
const navItems = [
  {
    name: "analytics",
    label: "Analytics",
    route: "/my-store/analytics",
    icon: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4" /><path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"/></svg>`
  },
  {
    name: "messages",
    label: "Messages",
    route: "/my-store/messages",
    icon: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4" /><path d="M9.19992 13.4739H14.8001"/><path d="M9.19992 9.52659H12"/></svg>`
  },
  {
    name: "customers",
    label: "Customers",
    route: "/my-store/customers",
    icon: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/></svg>`
  },
  {
    name: "manage_products",
    label: "Manage Products",
    route: "/my-store/manage-products",
icon: `
    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M6 8h12l1 12H5L6 8z"/>
      <path d="M9 8a3 3 0 0 1 6 0"/>
    </svg>
  `  },
  {
    name: "requests",
    label: "Requests",
    route: "/my-store/requests",
icon: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="4" width="18" height="16" rx="2" ry="2"/>
    <path d="M3 8h18"/>
    <path d="M8 12h8"/>
  </svg>`  },
  {
    name: "settings",
    label: "Settings",
    route: "/my-store/settings",
    icon: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M12 4v8H20"/></svg>`
  },
  {
    name: "manage_access",
    label: "Manage Access",
    route: "/my-store/manage-access",
    icon: `
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="10" width="18" height="10" rx="2" />
        <path d="M7 10V7a5 5 0 0 1 10 0v3"/>
        <circle cx="12" cy="15" r="2"/>
      </svg>
    `
  }
];

const router = useRouter();
const route = useRoute();
// Replace these with your store logic if needed
const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const profile = ref(JSON.parse(localStorage.getItem("profile") || "{}"));
const business_info = ref(JSON.parse(localStorage.getItem("business_profile") || '{}'));

// Responsive state
const isMobile = ref(false);
const showSidebar = ref(true); // true: show sidebar menu; false: show main content
const showContentMobile = ref(false);

function updateResponsive() {
  isMobile.value = window.innerWidth < 1024;
  // On desktop, both content and sidebar always show
  if (!isMobile.value) {
    showSidebar.value = true;
    showContentMobile.value = true;
  } else {
    if (showContentMobile.value) {
      showSidebar.value = false;
    } else {
      showSidebar.value = true;
      showContentMobile.value = false;
    }
  }
}

onMounted(() => {
  updateResponsive();
  window.addEventListener("resize", updateResponsive);
});

// Only on mobile: handle sidebar/content switching
function navigateTo(routePath) {
  if (isMobile.value) {
    showSidebar.value = false;
    showContentMobile.value = true;
  }
  router.push(routePath);
}
function backToSidebar() {
  if (isMobile.value) {
    showContentMobile.value = false;
    showSidebar.value = true;
    router.replace("/my-store"); // Update with your main dashboard route
  }
}
</script>

<style scoped>
.sidebar {
  min-height: 100vh;
}
.user-avatar img {
  border-radius: 100%;
  border: 2px solid #e5e7eb;
}
.nav-item {
  outline: none;
}
.nav-item:focus,
.nav-item:hover {
  background-color: #eff6ff;
  color: #1d4ed8;
}
.nav-item.active {
  background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff !important;
}
</style>
