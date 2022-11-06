
import { Ref, ref, InjectionKey, provide } from 'vue'
import { OverwrittenIoNodeType } from '@/views/AppMain/components/SvgCanvas/type'

export const FOCUSING_NODE_SYMBOL: InjectionKey<
  [Ref<OverwrittenIoNodeType | null>, (node: OverwrittenIoNodeType) => void]
> = Symbol('被聚焦的节点')

export default function draggingNode() {
  const focusingNode = ref<OverwrittenIoNodeType | null>(null)
  const setFocusingNode = (node: OverwrittenIoNodeType | null) => { focusingNode.value = node }

  provide(FOCUSING_NODE_SYMBOL, [
    focusingNode,
    setFocusingNode
  ])
}
