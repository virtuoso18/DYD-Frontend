import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// ANT DESIGN GLOBAL SETUP
import Antd from 'ant-design-vue'
// use css from antjs
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)

app.use(router).use(Antd).use(store)

app.mount('#app')




// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'

// const app = createApp(App)

// app.use(router)

// app.mount('#app')
