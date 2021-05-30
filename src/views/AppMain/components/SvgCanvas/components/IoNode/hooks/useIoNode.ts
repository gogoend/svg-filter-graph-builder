import { vnode2dom } from '@/utils'
import { Dictionary } from '@/utils/type'
import { computed, inject, onBeforeUpdate, Ref, ref, h } from 'vue'
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
  const filterThumbUrl = computed<string>(() => {
    const allDescs = allDescendants?.value ?? []
    const prefix = 'data:image/svg+xml,'
    const vnode = h('filter', { id: 'filter' }, [...allDescs].reverse().map((item, index) => item.setupState.getVNodeFragment(item, index)))
    const template =
`<svg xmlns="http://www.w3.org/2000/svg" id="SVGFilter" width="40" height="40" viewBox="-21 -32 112 182"><defs>${vnode2dom(vnode).outerHTML}</defs><g style="filter: url(#filter)"><text y="130" fill="#31d0c6" font-family="cursive" font-size="140px">A</text></g></svg>`
    return prefix + encodeURIComponent(template)
  })

  return {
    fromPort,
    toPort,
    ioNodeEl,
    feAttrEls,
    setFeAttrEls,
    allDescendants,
    handlePortMouseenter,
    filterThumbUrl
  }
}
