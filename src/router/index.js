import { createRouter, createWebHistory } from 'vue-router'
import home from '@/views/home/HomeView.vue'
import authentication from '@/views/auth/authenticaition.vue'
import pricing from '@/views/pages/pricing.vue'
import comunity from '@/views/pages/comunity.vue'
import contactus from '@/views/pages/contactus.vue'
import dashboard_manager from '@/views/user/dashboard.vue'
 
import start_new_catalogue from '@/views/catalogue/start_new_catalogue.vue'
import update_catelogue from '@/views/catalogue/update_catelogue.vue'

// my_store
import my_store from '@/views/store/store_manager.vue'
import analytics from '@/views/store/pages/analytics.vue'
import customers from '@/views/store/pages/customers.vue'
import manage_products from '@/views/store/pages/manage_products.vue'
import manage_sites from '@/views/store/pages/manage_sites.vue'
import messages from '@/views/store/pages/messages.vue'
import requests from '@/views/store/pages/requests.vue'
import settings from '@/views/store/pages/settings.vue'


// Import individual dashboard components
import user_profile from '@/components/dashboard/business/user_profile.vue'
import buisness_details from '@/components/dashboard/business/buisness_details.vue'
import my_designs from '@/components/dashboard/business/my_designs.vue'
import my_products from '@/components/dashboard/business/my_products.vue'
import community_dashboard from '@/components/dashboard/business/comunity.vue'
import generate_banner from '@/components/dashboard/business/generate_banner.vue'
import manage_subscription from '@/components/dashboard/business/manage_subscription.vue'

import add_furniture from '@/components/dashboard/business/my_products/add_new_product/add_furniture.vue'
import add_light from '@/components/dashboard/business/my_products/add_new_product/add_light_ceiling_3d.vue'
// Import individual dashboard components for professional users
import profesional_user_profile from '@/components/dashboard/professional/user_profile.vue'
import profesional_my_designs from '@/components/dashboard/professional/my_designs.vue'
import profesional_my_products from '@/components/dashboard/professional/my_products.vue'
import profesional_community_dashboard from '@/components/dashboard/professional/comunity.vue'
import profesional_generate_banner from '@/components/dashboard/professional/generate_banner.vue'
import profesional_manage_subscription from '@/components/dashboard/professional/manage_subscription.vue'

// Import individual dashboard components for professional users
import normal_user_profile from '@/components/dashboard/user/user_profile.vue'
import normal_my_designs from '@/components/dashboard/user/my_designs.vue'
import normal_my_products from '@/components/dashboard/user/my_products.vue'
import normal_community_dashboard from '@/components/dashboard/user/comunity.vue'
import normal_generate_banner from '@/components/dashboard/user/generate_banner.vue'
import normal_manage_subscription from '@/components/dashboard/user/manage_subscription.vue'

import buisness_page from '@/views/store/vendor_store.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: pricing,
    },
    {
      path: '/comunity',
      name: 'comunity',
      component: comunity,
    },
    {
      path: '/contact-us',
      name: 'contactus',
      component: contactus,
    },
    {
      path: '/start-new-catalogue',
      name: 'new_catelogue',
      component: start_new_catalogue,
    },
     {
      path: '/:buisness_name',
      name: 'buisness_name',
      component: buisness_page,
    },
    
    {
      path: '/update-catalogue/:id?',
      name: 'update_catelogue',
      component: update_catelogue,
    },
    
    {
      path: '/dashboard',
      name: 'dashboard',
      component: dashboard_manager,
    },
    
        {
          path: '/my-products/add-new-furniture',
          name: 'business_my_products_add_new_furniture',
          component: add_furniture,
        },
        
        {
          path: '/my-products/add-new-light',
          name: 'business_my_products_add_new_light',
          component: add_light,
        },
     // Business User Dashboard Routes
    {
      path: '/business-dashboard',
      component: dashboard_manager,
      children: [
        {
          path: '',
          redirect: '/business-dashboard/my-profile',
        },
        {
          path: 'my-profile',
          name: 'business_my_profile',
          component: user_profile,
        },
        {
          path: 'business-details',
          name: 'business_business_details',
          component: buisness_details,
        },
        {
          path: 'my-designs',
          name: 'business_my_designs',
          component: my_designs,
        },
        {
          path: 'my-products',
          name: 'business_my_products',
          component: my_products,
        },
        {
          path: 'comunity',
          name: 'business_dashboard_community',
          component: community_dashboard,
        },
        {
          path: 'generate-banner',
          name: 'business_generate_banner',
          component: generate_banner,
        },
        {
          path: 'manage-subscription',
          name: 'business_manage_subscription',
          component: manage_subscription,
        },
      ]
    },

    // Professional User Dashboard Routes
    {
      path: '/professional-dashboard',
      component: dashboard_manager,
      children: [
        {
          path: '',
          redirect: '/professional-dashboard/my-profile',
        },
        {
          path: 'my-profile',
          name: 'professional_my_profile',
          component: profesional_user_profile,
        },
        {
          path: 'my-designs',
          name: 'professional_my_designs',
          component: profesional_my_designs,
        },
        {
          path: 'my-products',
          name: 'professional_my_products',
          component: profesional_my_products,
        },
        {
          path: 'comunity',
          name: 'professional_dashboard_community',
          component: profesional_community_dashboard,
        },
        {
          path: 'generate-banner',
          name: 'professional_generate_banner',
          component: profesional_generate_banner,
        },
        {
          path: 'manage-subscription',
          name: 'professional_manage_subscription',
          component: profesional_manage_subscription,
        },
      ]
    },
    {
      path:'/my-store',
      component: my_store,
      children: [
        {
          path: '',
          name:'my-store',
          redirect: '/my-store/analytics',
        },
        {
          path: 'analytics',
          name:'analytics',
          component: analytics,
        },
        {
          path: 'customers',
          name:'customers',
          component: customers,
        },
        {
          path: 'manage-products',
          name:'manage_products',
          component: manage_products,
        },
        {
          path: 'manage-sites',
          name:'manage_sites',
          component: manage_sites,
        },
        {
          path: 'messages',
          name:'messages',
          component: messages,
        },
        {
          path: 'requests',
          name:'requests',
          component: requests,
        },
        {
          path: 'settings',
          name:'settings',
          component: settings,
        }
      ]
    },
    // Regular User Dashboard Routes
    {
      path: '/user-dashboard',
      component: dashboard_manager,
      children: [
        {
          path: '',
          redirect: '/user-dashboard/my-profile',
        },
        {
          path: 'my-profile',
          name: 'user_my_profile',
          component: normal_user_profile,
        },
        {
          path: 'my-designs',
          name: 'user_my_designs',
          component: normal_my_designs,
        },
        {
          path: 'my-products',
          name: 'user_my_products',
          component: normal_my_products,
        },
        {
          path: 'comunity',
          name: 'user_dashboard_community',
          component: normal_community_dashboard,
        },
        {
          path: 'generate-banner',
          name: 'user_generate_banner',
          component: normal_generate_banner,
        },
        {
          path: 'manage-subscription',
          name: 'user_manage_subscription',
          component: normal_manage_subscription,
        },
      ]
    },

    {
      path: '/login',
      name: 'login',
      component: authentication,
    },
    {
      path: '/signup',
      name: 'signup',
      component: authentication,
    },
  ],
})

export default router