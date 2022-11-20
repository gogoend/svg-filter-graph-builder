import gogoendLog from '@/plugins/log'
import { provide, shallowRef, InjectionKey, ShallowRef } from 'vue'

export const SHOW_PWA_INSTALL_DIALOG_SYMBOL: InjectionKey<() => void> = Symbol('安装PWA')
export const PWA_BEFORE_INSTALL_WAITEE_SYMBOL: InjectionKey<ShallowRef<null | any>> = Symbol('PWA等待安装事件对象')

export default function pwa() {
  const pwaBeforeInstallWaitee = shallowRef<null | any>(null)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    console.log(e)
    gogoendLog.log('[pwa 安装程序] 用户未在本机安装pwa')
    pwaBeforeInstallWaitee.value = e
  })

  provide(
    PWA_BEFORE_INSTALL_WAITEE_SYMBOL,
    pwaBeforeInstallWaitee
  )

  async function showPwaInstallDialog() {
    if (pwaBeforeInstallWaitee.value) {
      pwaBeforeInstallWaitee.value.prompt()
      const userChoice = await pwaBeforeInstallWaitee.value.userChoice
      gogoendLog.log('[pwa 安装程序] 安装结果：', userChoice)
      if (userChoice.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt')
        pwaBeforeInstallWaitee.value = null
      }
    }
  }

  provide(
    SHOW_PWA_INSTALL_DIALOG_SYMBOL,
    showPwaInstallDialog
  )
}
