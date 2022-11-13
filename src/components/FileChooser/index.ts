import FileList from './FileList.vue'

import LuDialog from 'lu2/theme/edge/js/common/ui/Dialog'
import { App, createApp } from 'vue'

export function getSelectFileWaitee() {
  let app: App<Element> | null = null

  let resolvePromise: (...args: any[]) => void
  let rejectPromise: (err?: unknown) => void
  const waitee = new Promise<string>((resolve, reject) => {
    resolvePromise = resolve
    rejectPromise = reject
  })

  new LuDialog({
    title: '选择文件',
    content: `<div class="file-chooser-dialog" />`,
    onShow() {
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
    },
    onHide() {
      app!.unmount()
      app = null
      this.remove()
    }
  })

  return waitee
}
