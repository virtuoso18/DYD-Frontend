import './assets/main.css'
import 'ant-design-vue/dist/reset.css'

import { createApp } from 'vue'
import WidgetShell from './WidgetShell.vue'
import store from './store'
import Antd from 'ant-design-vue'
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import he from './locales/he.json'
import { createWidgetRouter } from './widget/router'   // ← add this

function mountWidget(mountPoint, options = {}) {
  const i18n = createI18n({
    legacy: false,
    locale: options.locale || 'en',
    fallbackLocale: 'en',
    messages: { en, he },
  })

  const router = createWidgetRouter()  // ← fresh router per widget instance

  const app = createApp(WidgetShell, {
    mode:        options.mode        || 'floating',
    buttonLabel: options.buttonLabel || '🪄 Open',
    drawerTitle: options.drawerTitle || 'My App',
    brand:       options.brand       || null,
    windowName:  options.windowName  || null,
    productType: options.productType || null,
    productId:   options.productId   || null,
  })
    if (options.token) {
    localStorage.setItem('token', options.token)
  }
  app.use(store).use(Antd).use(i18n).use(router)  // ← register router
  app.mount(mountPoint)
  return { app, unmount: () => app.unmount() }
}

function autoInit() {
  // ── Check for inline anchor divs first ──────────────────
  // Client places: <div data-my-widget></div> anywhere on page
  const inlineDivs = document.querySelectorAll('[data-my-widget]')

//   if (inlineDivs.length > 0) {
//     // Inline mode — render button inside each matching div
//     inlineDivs.forEach((el) => {
//       const options = {
//         mode: 'inline',
//         locale: el.dataset.locale || 'en',
//         buttonLabel: el.dataset.label || '🪄 Open',
//         drawerTitle: el.dataset.title || 'My App',
//         drawerHeight: el.dataset.height || '85vh',
//       }
//       mountWidget(el, options)
//     })
//   } else {
//     // Floating mode — auto-mount to body, no div needed
//     const mountPoint = document.createElement('div')
//     mountPoint.id = 'my-widget-root'
//     document.body.appendChild(mountPoint)
//     mountWidget(mountPoint, { mode: 'floating' })
//   }
if (inlineDivs.length > 0) {
  inlineDivs.forEach((el) => {
    const options = {
      mode: 'inline',
      locale: el.dataset.locale || 'en',
      buttonLabel: el.dataset.label || '🪄 Open',
      token: el.dataset.token || 'TOKEN_HERE',
      drawerTitle: el.dataset.title || 'My App',
      drawerHeight: el.dataset.height || '85vh',
      // 👇 Pick up all the query params from data attributes
      brand: el.dataset.brand || null,
      windowName: el.dataset.windowName || null,
      productType: el.dataset.productType || null,
      productId: el.dataset.productId || null,
    }

    mountWidget(el, options)
  })
} else {
  // Floating mode — read from script tag's own data attributes as fallback
  const script = document.currentScript || document.querySelector('script[data-brand]')
  mountWidget(mountPoint, {
    mode: 'floating',
    brand: script?.dataset.brand || null,
    windowName: script?.dataset.windowName || null,
    productType: script?.dataset.productType || null,
    productId: script?.dataset.productId || null,
  })
}
}

// ── Auto-initialize ──────────────────────────────────────
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit)
  } else {
    autoInit()
  }

  // Expose manual API too, just in case
  window.MyWidget = { init: mountWidget }
}

export default { init: mountWidget }