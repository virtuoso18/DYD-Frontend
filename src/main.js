import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// ANT DESIGN GLOBAL SETUP
import Antd from 'ant-design-vue'
// use css from antjs
import 'ant-design-vue/dist/reset.css'

import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import he from './locales/he.json'

const i18n = createI18n({
  legacy: false,          // composition API style
  locale: 'en',           // default language
  fallbackLocale: 'en',
  messages: { en, he },
})

const app = createApp(App)

// ⚠️ FIX: Add .use(i18n) here!
app.use(router).use(Antd).use(store).use(i18n)

app.mount('#app')




// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'

// const app = createApp(App)

// app.use(router)

// app.mount('#app')
