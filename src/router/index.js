import { createRouter, createWebHistory } from 'vue-router'
import home from '@/views/home/HomeView.vue'
import authentication from '@/views/auth/authenticaition.vue'
import pricing from '@/views/pages/pricing.vue'
import comunity from '@/views/pages/comunity.vue'
import contactus from '@/views/pages/contactus.vue'
import dashboard_manager from '@/views/user/dashboard.vue'
 
import start_new_catalogue from '@/views/catalogue/start_new_catalogue.vue'
import update_catelogue from '@/views/catalogue/update_catelogue.vue'
// Import individual dashboard components
import user_profile from '@/components/dashboard/business/user_profile.vue'
import buisness_details from '@/components/dashboard/business/buisness_details.vue'
import my_designs from '@/components/dashboard/business/my_designs.vue'
import my_products from '@/components/dashboard/business/my_products.vue'
import community_dashboard from '@/components/dashboard/business/comunity.vue'
import generate_banner from '@/components/dashboard/business/generate_banner.vue'
import manage_subscription from '@/components/dashboard/business/manage_subscription.vue'

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
      path: '/update-catalogue/:id?',
      name: 'update_catelogue',
      component: update_catelogue,
    },
    
    {
      path: '/dashboard',
      component: dashboard_manager,
      children: [
        {
          path: '',
          name: 'dashboard',
          redirect: '/dashboard/my-profile',
        },
        {
          path: 'my-profile',
          name: 'my_profile',
          component: user_profile,
        },
        {
          path: 'business-details',
          name: 'business_details',
          component: buisness_details,
        },
        {
          path: 'my-designs',
          name: 'my_designs',
          component: my_designs,
        },
        {
          path: 'my-products',
          name: 'my_products',
          component: my_products,
        },
        {
          path: 'comunity',
          name: 'dashboard_community',
          component: community_dashboard,
        },
        {
          path: 'generate-banner',
          name: 'generate_banner',
          component: generate_banner,
        },
        {
          path: 'manage-subscription',
          name: 'manage_subscription',
          component: manage_subscription,
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