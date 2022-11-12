
import { Ref, ref, InjectionKey, provide, getCurrentInstance, onMounted, nextTick } from 'vue'
import { OverwrittenIoNodeType } from '@/views/AppMain/components/SvgCanvas/type'

export const FOCUSING_NODE_SYMBOL: InjectionKey<
  [Ref<OverwrittenIoNodeType | null>, (node: OverwrittenIoNodeType) => void]
> = Symbol('被聚焦的节点')

export default function draggingNode() {
  const focusingNode = ref<OverwrittenIoNodeType | null>(null)
  const setFocusingNode = (node: OverwrittenIoNodeType | null) => { focusingNode.value = node }

  const { $eventHub: appEventHub } = getCurrentInstance()!.appContext.config.globalProperties

  appEventHub.on(
    'svg-canvas:node-removed',
    (nodeId: string) => {
      // 如果当前选择的节点是已经选中的节点，则将选中节点的值置为null
      if (focusingNode.value?.nodeId === nodeId) {
        setFocusingNode(null)
      }
    }
  )

  provide(FOCUSING_NODE_SYMBOL, [
    focusingNode,
    setFocusingNode
  ])
}
