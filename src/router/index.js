// import { createRouter, createWebHistory } from 'vue-router'

// // Lazy load all components using dynamic imports
// const home = () => import('@/views/home/HomeView.vue')
// const NewHome = () => import('@/views/newhome/Home.vue')
// const authentication = () => import('@/views/auth/authenticaition.vue')
// const pricing = () => import('@/views/pages/pricing.vue')
// const make_payment = () => import('@/views/pages/make_payment.vue')
// const comunity = () => import('@/views/pages/comunity.vue')
// const contactus = () => import('@/views/pages/contactus.vue')
// const dashboard_manager = () => import('@/views/user/dashboard.vue')

// // Catalogue
// const start_new_catalogue = () => import('@/views/catalogue/start_new_catalogue.vue')
// const update_catelogue = () => import('@/views/catalogue/update_catelogue.vue')
// const render_catelogue = () => import('@/views/catalogue/render_catelogue.vue')

// // My Store
// const my_store = () => import('@/views/store/store_manager.vue')
// const analytics = () => import('@/views/store/pages/analytics.vue')
// const customers = () => import('@/views/store/pages/customers.vue')
// const manage_products = () => import('@/views/store/pages/manage_products.vue')
// const manage_sites = () => import('@/views/store/pages/manage_sites.vue')
// const messages = () => import('@/views/store/pages/messages.vue')
// const requests = () => import('@/views/store/pages/requests.vue')
// const settings = () => import('@/views/store/pages/settings.vue')

// // Business Dashboard Components
// const user_profile = () => import('@/components/dashboard/business/user_profile.vue')
// const buisness_details = () => import('@/components/dashboard/business/buisness_details.vue')
// const my_designs = () => import('@/components/dashboard/business/my_designs.vue')
// const my_products = () => import('@/components/dashboard/business/my_products.vue')
// const community_dashboard = () => import('@/components/dashboard/business/comunity.vue')
// const generate_banner = () => import('@/components/dashboard/business/generate_banner.vue')
// const manage_subscription = () => import('@/components/dashboard/business/manage_subscription.vue')
// const my_transactions = () => import('@/components/dashboard/business/my_transactions.vue')
// const my_likes = () => import('@/components/dashboard/business/my_likes.vue')

// // Product Components
// const add_furniture = () => import('@/components/dashboard/business/my_products/add_new_product/add_furniture.vue')
// const add_light = () => import('@/components/dashboard/business/my_products/add_new_product/add_light_ceiling_3d.vue')

// // Professional Dashboard Components
// const profesional_buisness_details = () => import('@/components/dashboard/professional/buisness_details.vue')
// const profesional_user_profile = () => import('@/components/dashboard/professional/user_profile.vue')
// const profesional_my_requests = () => import('@/components/dashboard/professional/my_requests.vue')
// const profesional_my_likes = () => import('@/components/dashboard/professional/my_likes.vue')
// const profesional_transactions = () => import('@/components/dashboard/professional/my_transactions.vue')
// const profesional_manage_subscription = () => import('@/components/dashboard/professional/manage_subscription.vue')
// const professional_settings = () => import('@/components/dashboard/professional/settings.vue')

// // Normal User Dashboard Components
// const normal_user_profile = () => import('@/components/dashboard/user/user_profile.vue')
// const normal_my_designs = () => import('@/components/dashboard/user/my_designs.vue')
// const normal_my_requests = () => import('@/components/dashboard/user/my_requests.vue')
// const normal_my_messages = () => import('@/components/messages/user_messages.vue')
// const normal_my_transactions = () => import('@/components/dashboard/user/my_transactions.vue')
// const normal_manage_my_subscription = () => import('@/components/dashboard/user/manage_subscription.vue')
// const normal_my_settings = () => import('@/components/dashboard/user/my_settings.vue')

// // Store Components
// const manage_access = () => import('@/components/store/manage_access.vue')
// const buisness_page = () => import('@/views/store/vendor_store.vue')
// const buisness_product = () => import('@/views/store/buisness_product.vue')
// const ar_product = () => import('@/views/store/AR.vue')

// // Access Engine
// const access_manager = () => import('@/views/access_engine/access_manager.vue')
// const access_overview = () => import('@/views/access_engine/access_overview.vue')
// const access_manage_products = () => import('@/views/access_engine/product/access_manage_products.vue')
// const access_manage_site = () => import('@/views/access_engine/business_site/access_manage_site.vue')
// const access_manage_community_post = () => import('@/views/access_engine/community_post/access_manage_community_post.vue')
// const access_manage_customer_requests = () => import('@/views/access_engine/customer_request/access_manage_customer_requests.vue')
// const access_create_furniture_product_3d_model_add_product = () => import('@/views/access_engine/product/my_products/add_new_product/add_furniture.vue')
// const access_create_light_product_3d_model_add_light = () => import('@/views/access_engine/product/my_products/add_new_product/add_light_ceiling_3d.vue')
// const access_manage_customer = () => import('@/views/access_engine/customers/business_customers.vue')
// const access_manage_generate_banner = () => import('@/views/access_engine/generate_banner/generate_banner.vue')
// const access_manage_customer_messages = () => import('@/views/access_engine/messages/message_customer.vue')

// // Admin
// const Generate_Banner_Admin = () => import('@/views/Platform_Admin_Access_Only/generate_banner_catalog.vue')

// // Other Pages
// const notifications = () => import('@/views/user/notifications.vue')
// const cart = () => import('@/views/user/cart.vue')
// const ai_catalog = () => import('@/views/pages/ai_catalog.vue')
// const business_ai_catalog = () => import('@/views/pages/business_ai_catalog.vue')
// const ForgetPassword = () => import('@/views/auth/forgetpassword/ForgetPassword.vue')
// const Sechdulemeeting = () => import('@/views/pages/sechdulemeeting.vue')
// const Mlspartnership = () => import('@/views/pages/mlspartnership.vue')
// const Partner = () => import('@/views/pages/partner.vue')
// const Tutorial = () => import('@/views/pages/tutorial.vue')
// const Api = () => import('@/views/pages/api.vue')
// const Earnphoto = () => import('@/views/pages/earnphoto.vue')
// const blogs = () => import('@/views/pages/blogs.vue')
// const affiliateprogram = () => import('@/views/pages/AffiliateProgram.vue')

// // Industry Pages
// const InteriorMaterialSupplier = () => import('@/views/pages/interiorMaterialSupplier.vue')
// const DesignCompany = () => import('@/views/pages/DesignCompany.vue')
// const Furnitureretail = () => import('@/views/pages/furnitureretail.vue')
// const RealEstateBrokrage = () => import('@/views/pages/realEstateBrokrage.vue')
// const HomeOwner = () => import('@/views/pages/HomeOwner.vue')
// const Interiordesigner = () => import('@/views/pages/interiordesigner.vue')
// const Realestateagent = () => import('@/views/pages/realestateagent.vue')
// const Aivirtualtour = () => import('@/views/pages/aivirtualtour.vue')

import { createRouter, createWebHistory ,createMemoryHistory} from 'vue-router'

const isEmbedded = typeof window !== 'undefined' && !document.getElementById('app')

import home from '@/views/home/HomeView.vue'
import NewHome from '@/views/newhome/Home.vue'

import authentication from '@/views/auth/authenticaition.vue'
import pricing from '@/views/pages/pricing.vue'
import make_payment from '@/views/pages/make_payment.vue'
import make_payment_upgrade_plan from '@/views/pages/make_payment_upgrade_plan.vue'
import comunity from '@/views/pages/comunity.vue'
import comunity_tagged_posts from '@/views/pages/comunity_tagged_posts.vue'
import contactus from '@/views/pages/contactus.vue'
import dashboard_manager from '@/views/user/dashboard.vue'
 
import start_new_catalogue from '@/views/catalogue/start_new_catalogue.vue'
import update_catelogue from '@/views/catalogue/update_catelogue.vue'
import render_catelogue from '@/views/catalogue/render_catelogue.vue'
// =========   =========  =========  =========  =========  =========  =========  =========  
// api update catalogue
// =========   =========  =========  =========  =========  =========  =========  =========  

// =========   =========  =========  =========  =========  =========  =========  =========  
// api update catalogue
// =========   =========  =========  =========  =========  =========  =========  =========  
 
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
import my_likes from '@/components/dashboard/business/my_likes.vue'
// import store_messages from '@/components/messages/store_messages.vue'

import add_furniture from '@/components/dashboard/business/my_products/add_new_product/add_furniture.vue'
import add_light from '@/components/dashboard/business/my_products/add_new_product/add_light_ceiling_3d.vue'

import profesional_buisness_details from '@/components/dashboard/professional/buisness_details.vue'
import profesional_my_designes from '@/components/dashboard/professional/my_designs.vue'
import profesional_my_community_posts from '@/components/dashboard/professional/comunity.vue'


// Import individual dashboard components for professional users
import profesional_user_profile from '@/components/dashboard/professional/user_profile.vue'
import profesional_my_requests from '@/components/dashboard/professional/my_requests.vue'
import profesional_my_likes from '@/components/dashboard/professional/my_likes.vue'
import profesional_transactions from '@/components/dashboard/professional/my_transactions.vue'
import profesional_manage_subscription from '@/components/dashboard/professional/manage_subscription.vue'
import professional_settings from '@/components/dashboard/professional/settings.vue'

// Import individual dashboard components for professional users
import normal_user_profile from '@/components/dashboard/user/user_profile.vue'
import normal_my_designs from '@/components/dashboard/user/my_designs.vue'
import normal_my_requests from '@/components/dashboard/user/my_requests.vue'
import normal_my_likes from '@/components/dashboard/user/my_likes.vue'
import normal_my_messages from '@/components/messages/user_messages.vue'
import normal_my_transactions from '@/components/dashboard/user/my_transactions.vue'
import normal_manage_my_subscription from '@/components/dashboard/user/manage_subscription.vue'
import normal_my_settings from '@/components/dashboard/user/my_settings.vue'

import manage_access from '@/components/store/manage_access.vue'
import buisness_page from '@/views/store/vendor_store.vue'
import buisness_product from '@/views/store/buisness_product.vue'
import ar_product from '@/views/store/AR.vue'
import access_manager from '@/views/access_engine/access_manager.vue'
import access_overview from '@/views/access_engine/access_overview.vue'
import access_manage_products from '@/views/access_engine/product/access_manage_products.vue'
import access_manage_site from '@/views/access_engine/business_site/access_manage_site.vue'
import access_manage_community_post from '@/views/access_engine/community_post/access_manage_community_post.vue'
import access_manage_customer_requests from '@/views/access_engine/customer_request/access_manage_customer_requests.vue'
import access_create_furniture_product_3d_model_add_product from '@/views/access_engine/product/my_products/add_new_product/add_furniture.vue'
import access_create_light_product_3d_model_add_light from  '@/views/access_engine/product/my_products/add_new_product/add_light_ceiling_3d.vue'

import access_manage_customer from '@/views/access_engine/customers/business_customers.vue'
import access_manage_generate_banner from '@/views/access_engine/generate_banner/generate_banner.vue'
import access_manage_customer_messages from '@/views/access_engine/messages/message_customer.vue'

import Generate_Banner_Admin from '@/views/Platform_Admin_Access_Only/generate_banner_catalog.vue'

import notifications from '@/views/user/notifications.vue'
import cart from '@/views/user/cart.vue'
import ai_catalog from '@/views/pages/ai_catalog.vue'
import business_ai_catalog from '@/views/pages/business_ai_catalog.vue'

import ForgetPassword from '@/views/auth/forgetpassword/ForgetPassword.vue';
import Sechdulemeeting from '@/views/pages/sechdulemeeting.vue'
import Mlspartnership from '@/views/pages/mlspartnership.vue'
import Partner from '@/views/pages/partner.vue'
import Tutorial from '@/views/pages/tutorial.vue'
import Api from '@/views/pages/api.vue'
import Earnphoto from '@/views/pages/earnphoto.vue'
import blogs from '@/views/pages/blogs.vue'
import affiliateprogram from '@/views/pages/AffiliateProgram.vue'


import InteriorMaterialSupplier from '@/views/pages/interiorMaterialSupplier.vue'
import DesignCompany from '@/views/pages/DesignCompany.vue'
import Furnitureretail from '@/views/pages/furnitureretail.vue'
import RealEstateBrokrage from '@/views/pages/realEstateBrokrage.vue'
import HomeOwner from '@/views/pages/HomeOwner.vue'
import Interiordesigner from '@/views/pages/interiordesigner.vue'
import Realestateagent from '@/views/pages/realestateagent.vue'
import Aivirtualtour from '@/views/pages/aivirtualtour.vue'

import make_payment_credittopup from '@/views/pages/make_payment_credittopup.vue'
import terms_and_conditions from '@/views/pages/tnc/terms_and_conditions.vue'
import Privacy_policy from '@/views/pages/tnc/privacy_policy.vue'
import Accessibility_statement from '@/views/pages/tnc/accessibility_statement.vue'
import Service_charter from '@/views/pages/tnc/service_charter.vue'
import Software_license_agreement from '@/views/pages/tnc/software_license_agreement.vue'
import Home_design_apply from '@/components/update_catalogue/home_design/home_design_apply.vue'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: isEmbedded ? createMemoryHistory() : createWebHistory(import.meta.env.BASE_URL),

  routes: [
    
    // =========================================== 
    // Temporary urlsa for testing 
    
    {
      path: '/admin-generate-banner',
      name: 'admin_generate_banner',
      component: Generate_Banner_Admin,
       meta: { requiresAuth: true }
    },
    
    // =========================================== 
{
      path: '/aivirtualtour',
      name: 'aivirtualtour',
      component: Aivirtualtour,
       meta: { requiresAuth: true }
    },
    {
      path: '/',
      name: 'home',
      component: home,
    },

     {
      path: '/new-home',
      name: 'New home',
      component: NewHome,
    },
    
     {
      path: '/explore-business-cataloges/:business_slug',
      name: 'explore_business_catalogue',
      component: business_ai_catalog,
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
       meta: { requiresAuth: true }
    },
    {
      path: '/terms-and-conditions',
      name: 'terms_and_conditions',
      component: terms_and_conditions,
    },

     {
      path: '/home-design-apply-changes/:id',
      name: 'home_design_apply',
      component: Home_design_apply,
       
    },
    {
  path: '/privacy-policy',
  name: 'privacy_policy',
  component: Privacy_policy,
},
{
  path: '/accessibility-statement',
  name: 'accessibility_statement',
  component: Accessibility_statement,
},
{
  path: '/service-charter',
  name: 'service_charter',
  component: Service_charter,
},
{
  path: '/software-license-agreement',
  name: 'software_license_agreement',
  component: Software_license_agreement,
},
    {
      path: '/ai-catalog',
      name: 'ai_catalog',
      component: ai_catalog,
      meta: { requiresAuth: true }
    },

    {
      path: '/make-payment/:plan_type',
      name: 'make_payment',
      component: make_payment,
      meta: { requiresAuth: true }
    },
    {
      path: '/make-payment-credit-topup/:uuid',
      name: 'make_payment_credittopup',
      component: make_payment_credittopup,
    },
    {
      path: '/make-payment-upgrade/:plan_type',
      name: 'make_payment-upgrade-plan',
      component: make_payment_upgrade_plan,
       meta: { requiresAuth: true }
    },
    {
      path: '/comunity',
      name: 'comunity',
      component: comunity,
    },
    
    {
      path: '/comunity-posts/:tag',
      name: 'comunity_tagged_posts',
      component: comunity_tagged_posts,
    },
    {
      path: '/contact-us',
      name: 'contactus',
      component: contactus,
    },

    {
      path: '/blogs',
      name: 'blogs',
      component: blogs,
    },

     {
      path: '/sechdulemeeting',
      name: 'sechdule meeting',
      component: Sechdulemeeting,
    },

     {
      path: '/affiliateprogram',
      name: 'affiliateprogram',
      component: affiliateprogram,
    },

     {
      path: '/mlspartnership',
      name: 'mlspartnership',
      component: Mlspartnership,
    },

      {
      path: '/partner',
      name: 'partner',
      component: Partner,
     },

      {
      path: '/tutorial',
      name: 'tutorial',
      component: Tutorial,
    },

      {
      path: '/api',
      name: 'api',
      component: Api,
    },

     {
      path: '/earnphoto',
      name: 'earnphoto',
      component: Earnphoto,
    },
    
     {
      path: '/blogs',
      name: 'blogs',
      component: blogs,
    },
    {
      path: '/affiliateprogram',
      name: 'affiliateprogram',
      component: affiliateprogram,
    },

    {
      path: '/interiorMaterialSupplier',
      name: 'interiorMaterialSupplier',
      component: InteriorMaterialSupplier,
    },
    {
      path: '/designcompany',
      name: 'designcompany',
      component: DesignCompany,
    },
     {
      path: '/furnitureretail',
      name: 'furnitureretail',
      component: Furnitureretail,
    },
     {
      path: '/realestatebrokrage',
      name: 'realestatebrokrage',
      component: RealEstateBrokrage,
    },
     {
      path: '/homeowner',
      name: 'homeowner',
      component: HomeOwner,
    },
      {
      path: '/interiordesigner',
      name: 'interiordesigner',
      component: Interiordesigner,
    },
    
    
// =================================================== UI Pages ========================================


    {
      path: '/start-new-catalogue',
      name: 'new_catelogue',
      component: start_new_catalogue,
       meta: { requiresAuth: true }
    },
     {
      path: '/:buisness_name',
      name: 'buisness_name',
      component: buisness_page,
      //  meta: { requiresAuth: true }
    },
     {
      path: '/:buisness_name/:product_type/:product_id',
      name: 'buisness_product',
      component: buisness_product,
      //  meta: { requiresAuth: true }
    },
    
    {
      path: '/ar-product/:product_id',
      name: 'ar_product',
      component: ar_product,
    },

    {
      path: '/update-catalogue/:id?',
      name: 'update_catelogue',
      component: update_catelogue,
       meta: { requiresAuth: true }
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
       meta: { requiresAuth: true }
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
          path: 'my-likes',
          name: 'business_my_likes',
          component: my_likes,
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
          path: 'my-requests',
          name: 'professional_my_requests',
          component: profesional_my_requests,
        },
        {
          path: 'my-likes',
          name: 'professional_my_likes',
          component: profesional_my_likes,
        },
        {
          path: 'business-details',
          name: 'profesional_buisness_details',
          component: profesional_buisness_details,
        },
        {
          path: 'my-designes',
          name: 'professional_designes',
          component: profesional_my_designes,
        },
        
        {
          path: 'my-community-posts',
          name: 'profesional_my_community_posts',
          component: profesional_my_community_posts,
        },
        {
          path: 'my-messages',
          name: 'professional_messages',
          component: normal_my_messages,
        },
        {
          path: 'my-transactions',
          name: 'professional_transactions',
          component: profesional_transactions,
        },
        {
          path: 'manage-subscription',
          name: 'professional_manage_subscription',
          component: profesional_manage_subscription,
        },
        
        {
          path: 'settings',
          name:'professional_settings',
          component: professional_settings,
        }
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
          path: 'my-likes',
          name: 'user_my_likes',
          component: normal_my_likes,
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
    
    {
      path: 'manage-customers',
      name: 'manage-customers',
      component: access_manage_customer,
    },
    
    {
      path: 'manage-generate-banner',
      name: 'manage-generate-banner',
      component: access_manage_generate_banner,
    },
    
    {
      path: 'manage-customer-messages',
      name: 'manage-customer-messages',
      component: access_manage_customer_messages,
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
      path: '/forgot-password',
      name: 'forget_password',
      component: ForgetPassword,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem("token");

  const requiresAuth = to.matched.some(
    (route) => route.meta.requiresAuth
  );

  //  User NOT logged in & route requires auth
  if (requiresAuth && !isLoggedIn) {
    next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
    return;
  }

  //  User logged in trying to visit login/signup
  if (
    isLoggedIn &&
    (to.path === "/login" || to.path === "/signup")
  ) {
    next("/dashboard");
    return;
  }

  // Allow navigation
  next();
});


export default router