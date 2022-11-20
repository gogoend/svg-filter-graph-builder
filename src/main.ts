import '@/plugins/lu2'
import '@/plugins/db'
import '@/plugins/error-handler'
import ElIconPlugin from '@/plugins/element-plus'

import { createApp } from 'vue'
import App from './App.vue'

import { EventDoer } from './utils/event-doer'
import gogoendLog from './plugins/log'

import './registerServiceWorker'
import runtimeConfig from '../public/runtime-config.json'

import pingping from './directives/pingping'

fetch('./runtime-config.json')
  .then(res => {
    return res.json()
  })
  .then(res => {
    window.__sfgb_runtime_config__ = res as typeof runtimeConfig
  })
  .then(() => {
    const app = createApp(App)

    // FIXME: proxy.$eventHub拿不到？？？
    app.config.globalProperties.$eventHub = new EventDoer()

    app.use(ElIconPlugin)
    app.directive('pingping', pingping)

    app.mount('#app')

    app.config.warnHandler = (...args) => gogoendLog.warn('[Vue]', args[0], args[2])
    app.config.errorHandler = (...args) => gogoendLog.error('[Vue]', args[0], args[2])
  })
