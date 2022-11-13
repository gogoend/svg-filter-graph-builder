import { NodeInStore } from '@/schema/IoNode'
import { Path } from '@/views/AppMain/components/SvgCanvas/type'
import { Ref, ref, InjectionKey, provide, unref, computed, inject, getCurrentInstance, ComputedRef } from 'vue'
import IoNode from '@/views/AppMain/components/SvgCanvas/components/IoNode/index.vue'

export const ALL_NODES_ON_CANVAS_SYMBOL: InjectionKey<Ref<Record<NodeInStore['id'], NodeInStore>>> = Symbol('Canvas上的所有节点')
export const ADD_NODE_SYMBOL: InjectionKey<(node: NodeInStore) => void> = Symbol('添加节点函数')
export const REMOVE_NODE_SYMBOL: InjectionKey<(nodeId: string) => void> = Symbol('移除节点函数')

export const ALL_LINKED_PATH_ON_CANVAS_SYMBOL: InjectionKey<Ref<Path[]>> = Symbol('Canvas上的所有连线')

export const RELATIVE_PATH_MAP_INDEXED_BY_NODE_ID_SYMBOL: InjectionKey<Ref<Record<string, any>>> = Symbol('节点对应所有出、入连线的映射关系')
export const REMOVE_PATH_SYMBOL: InjectionKey<(pathId: string) => void> = Symbol('删除连线函数')
export const ADD_PATH_SYMBOL: InjectionKey<(path: Path) => void> = Symbol('添加连线函数')

export const ADD_RELATION_IN_MAP_INDEXED_BY_NODE_ID_SYMBOL: InjectionKey<(
  linkedPath: any,
  fromPort: any,
  toPort: any
) => void> = Symbol('向 节点id->出、入连线 的映射中添加连线关系')

export const NODE_REF_MAP_SYMBOL: InjectionKey<Ref<Record<string, InstanceType<typeof IoNode>>>> = Symbol('Node组件映射')
export const NODE_FORM_VALUE_TYPE_SYMBOL: InjectionKey<ComputedRef<Record<string, Record<string, string>>>> = Symbol('各节点表单内容')
export const LINKED_PATHS_FOR_SERIALIZE_SYMBOL: InjectionKey<Record<string, any>> = Symbol('序列化的连线')

export default function canvasStuff() {
  const { $eventHub: appEventHub } = getCurrentInstance()!.appContext.config.globalProperties

  const nodes = ref<Record<NodeInStore['id'], NodeInStore>>({})
  provide(ALL_NODES_ON_CANVAS_SYMBOL, nodes)

  const addNode = (node: NodeInStore) => {
    nodes.value[node.id] = node
  }
  provide(ADD_NODE_SYMBOL, addNode)

  // 解除所有与当前节点相关的链接
  const unlinkNode = (nodeId: string) => {
    const idOfPathsWillBeRemoved = [
      ...(relativePathMapIndexedByNodeId.value[nodeId]?.in?.map(it => it.id) ?? []),
      ...(relativePathMapIndexedByNodeId.value[nodeId]?.out?.map(it => it.id) ?? [])
    ]

    idOfPathsWillBeRemoved.forEach(pathId => {
      removePath(pathId)
    })

    delete relativePathMapIndexedByNodeId.value[nodeId]
  }
  const removeNode = (nodeId: string) => {
    unlinkNode(nodeId)
    delete nodes.value[nodeId]
    appEventHub.emit(
      'svg-canvas:node-removed',
      nodeId
    )
  }
  provide(REMOVE_NODE_SYMBOL, removeNode)

  const nodeRefMap = ref<Record<string, InstanceType<typeof IoNode>>>({})
  provide(NODE_REF_MAP_SYMBOL, nodeRefMap)

  const nodeFormValueMap = computed(() => {
    const nodeFormValueMap: Record<string, Record<string, string>> = {}

    Object.entries(nodeRefMap.value).forEach(
      ([nodeId, nodeRef]) => {
        nodeFormValueMap[nodeId] = nodeRef.nodeConfigRef.feAttrValue as Record<number| string, string>
      }
    )

    return nodeFormValueMap
  })
  provide(NODE_FORM_VALUE_TYPE_SYMBOL, nodeFormValueMap)

  const linkedPathsForSerialize = ref<Record<string, any>>({})
  provide(LINKED_PATHS_FOR_SERIALIZE_SYMBOL, linkedPathsForSerialize)

  const linkedPaths = ref<Path[]>([])
  provide(ALL_LINKED_PATH_ON_CANVAS_SYMBOL, linkedPaths)

  const relativePathMapIndexedByNodeId = ref<Record<string, {
    in: Path[],
    out: Path[]
  }>>({})
  provide(RELATIVE_PATH_MAP_INDEXED_BY_NODE_ID_SYMBOL, relativePathMapIndexedByNodeId)

  const addPath = (path: Path) => {
    linkedPaths.value.push(path)
    linkedPathsForSerialize.value[path.id] = {
      id: path.id,
      from: {
        vmId: path.from.vm.nodeId,
        attr: path.from.attr
      },
      to: {
        vmId: path.to.vm.nodeId,
        attr: path.to.attr
      }
    }
  }
  provide(ADD_PATH_SYMBOL, addPath)

  const removePath = (pathId: string) => {
    const targetIndex = linkedPaths.value.findIndex(path => path.id === pathId)
    const [targetPath] = linkedPaths.value.splice(targetIndex, 1)

    delete linkedPathsForSerialize.value[pathId]

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
    targetPath.to.vm.afterPathRemoved?.(targetPath)
  }
  provide(REMOVE_PATH_SYMBOL, removePath)

  const addRelationInMapIndexedByNodeId = (
    linkedPath: any,
    fromPort: any,
    toPort: any
  ) => {
    if (!relativePathMapIndexedByNodeId.value[unref(fromPort)!.vm.nodeId]) {
      relativePathMapIndexedByNodeId.value[unref(fromPort)!.vm.nodeId] = {
        in: [],
        out: []
      }
    }
    relativePathMapIndexedByNodeId.value[unref(fromPort)!.vm.nodeId].out.push(linkedPath)

    if (!relativePathMapIndexedByNodeId.value[unref(toPort)!.vm.nodeId]) {
      relativePathMapIndexedByNodeId.value[unref(toPort)!.vm.nodeId] = {
        in: [],
        out: []
      }
    }
    relativePathMapIndexedByNodeId.value[unref(toPort).vm.nodeId].in.push(linkedPath)
  }
  provide(ADD_RELATION_IN_MAP_INDEXED_BY_NODE_ID_SYMBOL, addRelationInMapIndexedByNodeId)
}

