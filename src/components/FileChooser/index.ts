import FileList from './FileList.vue'

import LuDialog from 'lu2/theme/edge/js/common/ui/Dialog'
import { App, createApp, nextTick } from 'vue'

export function getSelectFileWaitee() {
  let app: App<Element> | null = null

  let resolvePromise: (...args: any[]) => void
  let rejectPromise: (err?: unknown) => void
  const waitee = new Promise<string>((resolve, reject) => {
    resolvePromise = resolve
    rejectPromise = reject
  })

  new LuDialog({
    title: 'Choose a file',
    content: `<div class="file-chooser-dialog" />`,
    async onShow() {
      const el = this.querySelector('.file-chooser-dialog')! as HTMLDivElement
      app = createApp(
        FileList, {
          handleConfirm: (selectedFileIdentifier: string) => {
            resolvePromise(selectedFileIdentifier)
            this.hide()
          },
          handleCancel: () => {
            rejectPromise(new Error('[File Chooser] 用户没有选择文件'))
            this.hide()
          }
        }
      )
      app.mount(
        el
      )
      await nextTick()
      const footerElOfLuDialog = this.querySelector('.ui-dialog-footer') as HTMLElement
      const footerTemplateInFileVm = this.querySelector('.file-list__footer-template') as HTMLElement

      while (footerTemplateInFileVm.children.length) {
        footerElOfLuDialog.appendChild(footerTemplateInFileVm.children[0])
      }
    },
    onHide() {
      app!.unmount()
      app = null
      this.remove()
    }
  })

  return waitee
}
