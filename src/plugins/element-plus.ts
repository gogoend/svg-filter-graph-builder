import 'element-plus/es/components/icon/style/index'

import { ElIcon } from 'element-plus/es/components/icon/index'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { App } from 'vue'

export default {
  install(app: App) {
    app.component('ElIcon', ElIcon)
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  }
}
