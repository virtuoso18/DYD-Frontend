// widget/router.js
import { createRouter, createWebHashHistory } from 'vue-router'
import StartNewCatalogue from '@/widget/main.vue'
import UpdateCatalogue from '@/widget/api_update_catalogue.vue'
import finalizeChanges from '@/widget/api_finalize_changes.vue'

const routes = [
  {
    path: '/',
    name: 'api-start-new-catalogue',
    component: StartNewCatalogue,
  },
  {
    path: '/update/:id',
    name: 'api_update_catelogue',
    component: UpdateCatalogue,
  },
  {
    path: '/confirm-order/:id',
    name: 'api_finalize_changes',
    component: finalizeChanges,
  },
]

export function createWidgetRouter() {
  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  })

  // Global navigation guard — always inject stored widget params into every route
  router.beforeEach((to, from, next) => {
    const stored = router._widgetParams || {}
    const merged = {
      brand:        stored.brand        || undefined,
      window_name:  stored.window_name  || undefined,
      product_type: stored.product_type || undefined,
      product_id:   stored.product_id   || undefined,
    }

    // Check if any stored params are missing from the destination query
    const needsParams = Object.entries(merged).some(
      ([key, val]) => val && !to.query[key]
    )

    if (needsParams) {
      next({
        ...to,
        query: {
          ...merged,
          ...to.query, // to.query takes priority (allows overrides)
        },
      })
    } else {
      next()
    }
  })

  return router
}