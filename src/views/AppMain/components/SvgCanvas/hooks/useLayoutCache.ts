import gogoendLog from '@/plugins/log'
import { shallowRef, onBeforeUnmount, onMounted, nextTick, getCurrentInstance } from 'vue'
export default function useLayoutCache() {
  const elRect = shallowRef<null | DOMRectReadOnly>(null)
  const vm = getCurrentInstance()!.proxy!

  let ro: null | ResizeObserver = new ResizeObserver(([entry], observer) => {
    // Do something to each entry
    // and possibly something to the observer itself

    elRect.value = entry.target.getBoundingClientRect()
    gogoendLog.debug(elRect.value)
  })
  onMounted(() => {
    ro!.observe(vm.$el)
    onBeforeUnmount(() => {
      ro!.disconnect()
    })
    ro = null
  })

  return {
    elRect
  }
}
