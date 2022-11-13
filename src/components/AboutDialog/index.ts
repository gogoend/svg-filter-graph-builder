import AboutContent from './AboutContent.vue'

import LuDialog from 'lu2/theme/edge/js/common/ui/Dialog'
import { App, createApp } from 'vue'

export function showAboutDialog() {
  let app: App<Element> | null = null

  new LuDialog({
    title: 'About',
    content: `<div class="about-dialog-dialog" />`,
    width: '480px',
    buttons: [{
      value: 'Close'
    }],
    async onShow() {
      const el = this.querySelector('.about-dialog-dialog')! as HTMLDivElement
      app = createApp(AboutContent)
      app.mount(el)
    },
    onRemove() {
      app!.unmount()
      app = null
    }
  })
}
