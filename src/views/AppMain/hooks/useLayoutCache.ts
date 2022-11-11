import { shallowRef, onBeforeUnmount, onMounted, ComponentPublicInstance } from 'vue'
export default function useLayoutCache(vm: ComponentPublicInstance) {
  const elRect = shallowRef<null | DOMRectReadOnly>(null)

  let ro: null | ResizeObserver = new ResizeObserver(([entry], observer) => {
    // Do something to each entry
    // and possibly something to the observer itself
    elRect.value = entry.target.getBoundingClientRect()
    console.log(elRect.value)
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
