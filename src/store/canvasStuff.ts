import { NodeInStore } from '@/schema/IoNode'
import { Path } from '@/views/AppMain/components/SvgCanvas/type'
import { Ref, ref, InjectionKey, provide } from 'vue'

export const ALL_NODES_ON_CANVAS_SYMBOL: InjectionKey<Ref<NodeInStore[]>> = Symbol('Canvas上的所有节点')
export const ADD_NODES_SYMBOL: InjectionKey<(node: NodeInStore) => void> = Symbol('添加节点函数')
export const REMOVE_NODES_SYMBOL: InjectionKey<(nodeId: string) => void> = Symbol('移除节点函数')

export const ALL_LINKED_PATH_ON_CANVAS_SYMBOL: InjectionKey<Ref<Path[]>> = Symbol('Canvas上的所有连线')

export const RELATIVE_PATH_MAP_INDEXED_BY_NODE_ID_SYMBOL: InjectionKey<Ref<Record<string, any>>> = Symbol('节点对应所有出、入连线的映射关系')
export const REMOVE_PATH_SYMBOL: InjectionKey<(pathId: string) => void> = Symbol('删除连线函数')

export const ADD_RELATION_IN_MAP_INDEXED_BY_NODE_ID_SYMBOL: InjectionKey<(
  linkedPath: any,
  fromPort: any,
  toPort: any
) => void> = Symbol('向 节点id->出、入连线 的映射中添加连线关系')

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

  const linkedPaths = ref<Path[]>([])
  provide(ALL_LINKED_PATH_ON_CANVAS_SYMBOL, linkedPaths)

  const relativePathMapIndexedByNodeId = ref<Record<string, any>>({})
  provide(RELATIVE_PATH_MAP_INDEXED_BY_NODE_ID_SYMBOL, relativePathMapIndexedByNodeId)

  const removePath = (pathId: string) => {
    const targetIndex = linkedPaths.value.findIndex(path => path.id === pathId)
    linkedPaths.value.splice(targetIndex, 1)

    Object.values(relativePathMapIndexedByNodeId.value).forEach(
      it => {
        for (let i = 0; i < it.in.length;) {
          if (it.in[i].id === pathId) {
            it.in.splice(i, 1)
            continue
          }
          i++
        }
        for (let i = 0; i < it.out.length;) {
          if (it.out[i].id === pathId) {
            it.out.splice(i, 1)
            continue
          }
          i++
        }
      }
    )
  }
  provide(REMOVE_PATH_SYMBOL, removePath)

  const addRelationInMapIndexedByNodeId = (
    linkedPath: any,
    fromPort: any,
    toPort: any
  ) => {
    if (!relativePathMapIndexedByNodeId.value[fromPort.value!.vm.proxy!.$props!.nodeId]) {
      relativePathMapIndexedByNodeId.value[fromPort.value!.vm.proxy!.$props!.nodeId] = {
        in: [],
        out: []
      }
    }
    relativePathMapIndexedByNodeId.value[fromPort.value!.vm.proxy!.$props!.nodeId].out.push(linkedPath)

    if (!relativePathMapIndexedByNodeId.value[toPort.value!.vm.proxy!.$props!.nodeId]) {
      relativePathMapIndexedByNodeId.value[toPort.value!.vm.proxy!.$props!.nodeId] = {
        in: [],
        out: []
      }
    }
    relativePathMapIndexedByNodeId.value[toPort.value?.vm.proxy?.$props?.nodeId].in.push(linkedPath)
  }
  provide(ADD_RELATION_IN_MAP_INDEXED_BY_NODE_ID_SYMBOL, addRelationInMapIndexedByNodeId)
}

