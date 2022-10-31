import { NodeInStore } from '@/schema/IoNode'
import { Ref, ref, InjectionKey, provide } from 'vue'

export const ALL_NODES_ON_CANVAS_SYMBOL: InjectionKey<Ref<NodeInStore[]>> = Symbol('Canvas上的所有节点')
export const ADD_NODES_SYMBOL: InjectionKey<(node: NodeInStore) => void> = Symbol('添加节点函数')
export const REMOVE_NODES_SYMBOL: InjectionKey<(nodeId: string) => void> = Symbol('移除节点函数')

export default function canvasStuff() {
  const nodes = ref<NodeInStore[]>([])
  nodes.value = [
    {
      is: 'feTurbulence',
      id: '91914e37-f574-52cd-9157-bdc30073796a',
      position: [80, 30]
    },
    {
      is: 'feDisplacementMap',
      id: '45c3ab87-518c-5e30-89e6-910f9fa6f1dd',
      position: [720, 640]
    }
  ]
  provide(ALL_NODES_ON_CANVAS_SYMBOL, nodes)

  const addNode = (node: NodeInStore) => {
    nodes.value.push(node)
  }
  provide(ADD_NODES_SYMBOL, addNode)

  const removeNode = (nodeId: string) => {
    for (let i = 0; i < nodes.value.length;) {
      if (nodeId === nodes.value[i].id) {
        nodes.value.splice(i, 1)
        return
      }
      i++
    }
  }
  provide(REMOVE_NODES_SYMBOL, removeNode)
}

