import { createRouter, createWebHistory } from 'vue-router'
import home from '@/views/home/HomeView.vue'
import authentication from '@/views/auth/authenticaition.vue'
import pricing from '@/views/pages/pricing.vue'
import make_payment from '@/views/pages/make_payment.vue'
import comunity from '@/views/pages/comunity.vue'
import contactus from '@/views/pages/contactus.vue'
import dashboard_manager from '@/views/user/dashboard.vue'
 
import start_new_catalogue from '@/views/catalogue/start_new_catalogue.vue'
import update_catelogue from '@/views/catalogue/update_catelogue.vue'
import render_catelogue from '@/views/catalogue/render_catelogue.vue'
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
import my_transactions from '@/components/dashboard/business/my_transactions.vue'
// import store_messages from '@/components/messages/store_messages.vue'

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
import normal_my_requests from '@/components/dashboard/user/my_requests.vue'
import normal_my_messages from '@/components/messages/user_messages.vue'
import normal_my_transactions from '@/components/dashboard/user/my_transactions.vue'
import normal_manage_my_subscription from '@/components/dashboard/user/manage_subscription.vue'
import normal_my_settings from '@/components/dashboard/user/my_settings.vue'

import manage_access from '@/components/store/manage_access.vue'
import buisness_page from '@/views/store/vendor_store.vue'
import buisness_product from '@/views/store/buisness_product.vue'

import access_manager from '@/views/access_engine/access_manager.vue'
import access_overview from '@/views/access_engine/access_overview.vue'
import access_manage_products from '@/views/access_engine/product/access_manage_products.vue'
import access_manage_site from '@/views/access_engine/business_site/access_manage_site.vue'
import access_manage_community_post from '@/views/access_engine/community_post/access_manage_community_post.vue'
import access_manage_customer_requests from '@/views/access_engine/customer_request/access_manage_customer_requests.vue'
import access_create_furniture_product_3d_model_add_product from '@/views/access_engine/product/my_products/add_new_product/add_furniture.vue'
import access_create_light_product_3d_model_add_light from  '@/views/access_engine/product/my_products/add_new_product/add_light_ceiling_3d.vue'

import Generate_Banner_Admin from '@/views/Platform_Admin_Access_Only/generate_banner_catalog.vue'

import notifications from '@/views/user/notifications.vue'
import cart from '@/views/user/cart.vue'
import ai_catalog from '@/views/pages/ai_catalog.vue'

import ForgetPassword from '@/views/auth/forgetpassword/ForgetPassword.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    
    // =========================================== 
    // Temporary urlsa for testing 
    
    {
      path: '/admin-generate-banner',
      name: 'admin_generate_banner',
      component: Generate_Banner_Admin,
    },
    
    // =========================================== 

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
      path: '/notifications',
      name: 'notifications',
      component: notifications,
    },
    {
      path: '/cart',
      name: 'cart',
      component: cart,
    },
    {
      path: '/ai-catalog',
      name: 'ai_catalog',
      component: ai_catalog,
    },

    {
      path: '/make-payment/:plan_type',
      name: 'make_payment',
      component: make_payment,
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
      path: '/:buisness_name/:product_type/:product_id',
      name: 'buisness_product',
      component: buisness_product,
    },
    
    {
      path: '/update-catalogue/:id?',
      name: 'update_catelogue',
      component: update_catelogue,
    },
    {
      path: '/update-catalogue/render-results/:id?',
      name: 'render_catelogue',
      component: render_catelogue,
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
        {
          path: 'my-transactions',
          name: 'my_transactions',
          component: my_transactions,
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
        
        // {
        //   path: 'messages',
        //   name:'messages',
        //   component: store_messages,
        // },
        {
          path: 'manage-products',
          name:'manage_products',
          component: manage_products,
        },
        {
          path: 'manage-access',
          name: 'manage_access',
          component: manage_access,
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
          path: 'my-requests',
          name: 'user_my_requests',
          component: normal_my_requests,
        },
        {
          path: 'my-messages',
          name: 'user_my_messages',
          component: normal_my_messages,
        },
        {
          path: 'my-transactions',
          name: 'user_my_transactions',
          component: normal_my_transactions,
        },
        {
          path: 'manage-subscription',
          name: 'user_manage_subscription',
          component: normal_manage_my_subscription,
        },
        {
          path: 'my-settings',
          name: 'user_settings',
          component: normal_my_settings,
        },
      ]
    },

    
// ==========================================
// Access Management Engine 
// ==========================================

    // ============================================================================================================================
    // Synchronised APIS FOR diduction of credits to create 3d model by business granted access  credits available
    // ============================================================================================================================
        
    //    Refferance-API
    //    {
    //       path: '/my-products/add-new-furniture',
    //       name: 'business_my_products_add_new_furniture',
    //       component: add_furniture,
    //     }, 
        {
          path: '/access-business/create-furniture-product-3d-model-add-product',
          name: 'create-furniture-product-3d-model-add-product',
          component: access_create_furniture_product_3d_model_add_product, // Create a new component for overview content
        },
    //    Referance-API
    //    {
    //      path: '/my-products/add-new-light',
    //      name: 'business_my_products_add_new_light',
    //      component: add_light,
    //    },
        {
          path: '/access-business/create-light-product-3d-model-add-light',
          name: 'create-light-product-3d-model-add-light',
          component: access_create_light_product_3d_model_add_light, // Create a new component for overview content
        },
    // ============================================================================================================================
    // Synchronised APIS FOR diduction of credits to create 3d model by business granted access  credits available
    // ============================================================================================================================
    

// ==========================================
// Access Management Engine 
// ==========================================
{
  path: '/access-business',
  component: access_manager, // This acts as the layout
  children: [
    {
      path: '',
      redirect:'/access-business/overview'
    },
    {
      path: 'overview',
      name: 'business-overview',
      component: access_overview, // Create a new component for overview content
    },
    
    
    {
      path: 'manage-products',
      name: 'manage-products',
      component: access_manage_products,
    },
    {
      path: 'manage-site',
      name: 'manage-site',
      component: access_manage_site,
    },
    {
      path: 'manage-community-post',
      name: 'manage-community-post',
      component: access_manage_community_post,
    },
    {
      path: 'manage-customer-requests',
      name: 'manage-customer-requests',
      component: access_manage_customer_requests,
    },
  ],
},
// {
//   path: '/access-business/:business_id',
//   component: access_manager, // This acts as the layout
//   children: [
//     {
//       path: '',
//       redirect: to => {
//         const { business_id } = to.params;
//         return `/access-business/${business_id}/overview`;
//       },
//     },
//     {
//       path: 'overview',
//       name: 'business-overview',
//       component: access_overview, // Create a new component for overview content
//     },
//     {
//       path: 'manage-products',
//       name: 'manage-products',
//       component: access_manage_products,
//     },
//     {
//       path: 'manage-site',
//       name: 'manage-site',
//       component: access_manage_site,
//     },
//     {
//       path: 'manage-community-post',
//       name: 'manage-community-post',
//       component: access_manage_community_post,
//     },
//     {
//       path: 'manage-customer-requests',
//       name: 'manage-customer-requests',
//       component: access_manage_customer_requests,
//     },
//   ],
// },

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
     {
      path: '/forget-password',
      name: 'forget_password',
      component: ForgetPassword,
    },
  ],
})

export default router