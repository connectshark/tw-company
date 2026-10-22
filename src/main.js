import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import { pinia } from './stores'
import './index.css'

import App from './App.vue'
import { router } from './router'

// index.html 裡的預設 meta 只給不跑 JS 的爬蟲看，移除後改由 unhead 管理，避免重複
document.querySelectorAll('head [data-seo-static]').forEach((el) => el.remove())

createApp(App)
  .use(pinia)
  .use(router)
  .use(createHead())
  .mount('#app')
