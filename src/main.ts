import '@/plugins/lu2'
import '@/plugins/db'
import ElIconPlugin from '@/plugins/element-plus'

import { createApp } from 'vue'
import App from './App.vue'

import { EventDoer } from './utils/event-doer'

const app = createApp(App)

// FIXME: proxy.$eventHub拿不到？？？
app.config.globalProperties.$eventHub = new EventDoer()

app.use(ElIconPlugin)
app.mount('#app')
