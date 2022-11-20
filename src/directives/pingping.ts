import { Directive } from 'vue'
import log from '@/plugins/log'

const pingping: Directive = {
  beforeMount(el, { value }, vnode) {
    const clickHandler = (ev: MouseEvent) => {
      if (value?.remark) {
        log.log(value.remark)
      } else {
        log.log(`[用户界面] 用户按下了CSS类为“${(ev.target as HTMLElement).className}”的${(ev.target as HTMLElement).tagName}元素`)
      }
    }
    //
    el.addEventListener(
      'mousedown',
      clickHandler
    )
    el.__vPingpingDispose__ = () => {
      delete el.__vPingpingDispose__
      el.removeEventListener(
        'mousedown',
        clickHandler
      )
    }
  },
  unmounted(el) {
    el.__vPingpingDispose__()
  }
}

export default pingping
