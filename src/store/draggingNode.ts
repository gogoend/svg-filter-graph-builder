
import { Ref, ref, InjectionKey, provide } from 'vue'
import IoNode from '@/views/AppMain/components/SvgCanvas/components/IoNode/index.vue'

export const DRAGGING_NODE_ICON_SYMBOL: InjectionKey<Ref<any>> = Symbol('正在拖拽的项目')
export const GHOST_NODE_REF_SYMBOL: InjectionKey<Ref<any>> = Symbol('鬼影节点引用')

export default function draggingNode() {
  const draggingNodeIcon = ref<string | null>(null)
  provide(DRAGGING_NODE_ICON_SYMBOL, draggingNodeIcon)

  const ghostNodeRef = ref<InstanceType<typeof IoNode> | null>(null)
  provide(GHOST_NODE_REF_SYMBOL, ghostNodeRef)
}
