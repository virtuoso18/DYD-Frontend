import { createRouter, createMemoryHistory } from 'vue-router'
import StartNewCatalogue from '@/widget/main.vue'
import UpdateCatalogue from '@/widget/api_update_catalogue.vue'
import finalizeChanges from '@/widget/api_finalize_changes.vue'

const routes = [
  {
    path: '/',
    name: 'api-start-new-catalogue',
    component: StartNewCatalogue,
    props: route => ({
      brand:       route.query.brand       || null,
      windowName:  route.query.window_name || null,
      productType: route.query.product_type|| null,
      productId:   route.query.product_id  || null,
    }),
  },
  {
    path: '/update/:id',
    name: 'api_update_catelogue',
    component: UpdateCatalogue,
    props: route => ({
      roomId:      route.params.id,
      brand:       route.query.brand       || null,
      windowName:  route.query.window_name || null,
      productType: route.query.product_type|| null,
      productId:   route.query.product_id  || null,
    }),
  },
  
  {
    path: '/api-finalize-changes/:id',
    name: 'api_finalize_changes',
    component: finalizeChanges,
    props: route => ({
      id: route.params.id,
      brand:  route.query.brand || null,
    }),
  },

]

export function createWidgetRouter() {
  return createRouter({
    history: createMemoryHistory(),  // ← key: no URL changes on host page
    routes,
  })
}