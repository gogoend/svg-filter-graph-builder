import { Dictionary } from '@/utils/type'
import { inject, onBeforeUpdate, Ref, ref } from 'vue'
import { Port } from '../../../type'

export default () => {
  const fromPort = inject<Ref<Port<any>>>('fromPort')
  const toPort = inject<Ref<Port<any>>>('toPort')

  const ioNodeEl = ref<SVGGElement>()

  const feAttrEls = ref<SVGCircleElement[]>([])
  const setFeAttrEls = (el?: SVGCircleElement) => {
    el && feAttrEls.value.push(el)
  }
  onBeforeUpdate(() => { feAttrEls.value = [] })
  
  // 计算属性，表示当前节点下的所有的后代节点
  const allDescendants = inject<Ref<any[]>>('allDescendants')

  const handlePortMouseenter = inject<Ref<any>>('handlePortMouseenter')

  return {
    fromPort,
    toPort,
    ioNodeEl,
    feAttrEls,
    setFeAttrEls,
    allDescendants,
    handlePortMouseenter
  }
}
