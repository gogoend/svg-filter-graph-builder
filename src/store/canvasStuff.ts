import { NodeInStore } from '@/schema/IoNode'
import { Path } from '@/views/AppMain/components/SvgCanvas/type'
import { Ref, ref, InjectionKey, provide, onMounted, unref } from 'vue'
import IoNode from '@/views/AppMain/components/SvgCanvas/components/IoNode/index.vue'

export const ALL_NODES_ON_CANVAS_SYMBOL: InjectionKey<Ref<Record<NodeInStore['id'], NodeInStore>>> = Symbol('Canvas上的所有节点')
export const ADD_NODES_SYMBOL: InjectionKey<(node: NodeInStore) => void> = Symbol('添加节点函数')
export const REMOVE_NODES_SYMBOL: InjectionKey<(nodeId: string) => void> = Symbol('移除节点函数')

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

export default function canvasStuff() {
  const nodes = ref<Record<NodeInStore['id'], NodeInStore>>({})
  nodes.value = {
    '91914e37-f574-52cd-9157-bdc30073796a': { is: 'feTurbulence', id: '91914e37-f574-52cd-9157-bdc30073796a', position: [569, 462] },
    '45c3ab87-518c-5e30-89e6-910f9fa6f1dd': { is: 'feDisplacementMap', id: '45c3ab87-518c-5e30-89e6-910f9fa6f1dd', position: [671, 111] },
    'C63FCDE9-79FB-4243-90E1-D44258C8902D': { is: 'feOffset', id: 'C63FCDE9-79FB-4243-90E1-D44258C8902D', position: [1, 179] },
    '4DEDA0C9-30A4-42FC-987F-A0F968C47631': { is: 'feTile', id: '4DEDA0C9-30A4-42FC-987F-A0F968C47631', position: [86, 587] },
    '98538604-3FD4-4215-8ED9-A4B6882A9AE7': { is: 'feTurbulence', id: '98538604-3FD4-4215-8ED9-A4B6882A9AE7', position: [288, 264] },
    '3566D34B-971F-4167-8DD4-BA6A4C4A302B': { is: 'feMerge', id: '3566D34B-971F-4167-8DD4-BA6A4C4A302B', position: [273, 32] }
  }
  provide(ALL_NODES_ON_CANVAS_SYMBOL, nodes)

  const addNode = (node: NodeInStore) => {
    nodes.value[node.id] = node
  }
  provide(ADD_NODES_SYMBOL, addNode)

  const removeNode = (nodeId: string) => {
    delete nodes.value[nodeId]
  }
  provide(REMOVE_NODES_SYMBOL, removeNode)

  const nodeRefMap = ref<Record<string, InstanceType<typeof IoNode>>>({})
  provide(NODE_REF_MAP_SYMBOL, nodeRefMap)

  const linkedPathsForSerialize = ref<Record<string, any>>({})
  provide('tempLinkedPathsForSerialize', linkedPathsForSerialize)

  const linkedPaths = ref<Path[]>([])
  provide(ALL_LINKED_PATH_ON_CANVAS_SYMBOL, linkedPaths)

  const relativePathMapIndexedByNodeId = ref<Record<string, any>>({})
  provide(RELATIVE_PATH_MAP_INDEXED_BY_NODE_ID_SYMBOL, relativePathMapIndexedByNodeId)

  const addPath = (path: Path) => {
    linkedPaths.value.push(path)
    linkedPathsForSerialize.value[path.id] = {
      id: path.id,
      from: {
        vm: path.from.vm.proxy.nodeId,
        attr: path.from.attr
      },
      to: {
        vm: path.to.vm.proxy.nodeId,
        attr: path.to.attr
      }
    }
  }
  provide(ADD_PATH_SYMBOL, addPath)

  const removePath = (pathId: string) => {
    const targetIndex = linkedPaths.value.findIndex(path => path.id === pathId)
    linkedPaths.value.splice(targetIndex, 1)

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
  }
  provide(REMOVE_PATH_SYMBOL, removePath)

  const addRelationInMapIndexedByNodeId = (
    linkedPath: any,
    fromPort: any,
    toPort: any
  ) => {
    if (!relativePathMapIndexedByNodeId.value[unref(fromPort)!.vm.proxy!.$props!.nodeId]) {
      relativePathMapIndexedByNodeId.value[unref(fromPort)!.vm.proxy!.$props!.nodeId] = {
        in: [],
        out: []
      }
    }
    relativePathMapIndexedByNodeId.value[unref(fromPort)!.vm.proxy!.$props!.nodeId].out.push(linkedPath)

    if (!relativePathMapIndexedByNodeId.value[unref(toPort)!.vm.proxy!.$props!.nodeId]) {
      relativePathMapIndexedByNodeId.value[unref(toPort)!.vm.proxy!.$props!.nodeId] = {
        in: [],
        out: []
      }
    }
    relativePathMapIndexedByNodeId.value[unref(toPort).vm.proxy?.$props?.nodeId].in.push(linkedPath)
  }
  provide(ADD_RELATION_IN_MAP_INDEXED_BY_NODE_ID_SYMBOL, addRelationInMapIndexedByNodeId)

  const loadCanvasFromSerializedStatus = () => {
    const l = {
      '0': {
        id: '0',
        from: {
          vm: '3566D34B-971F-4167-8DD4-BA6A4C4A302B',
          attr: 'result'
        },
        to: {
          vm: '45c3ab87-518c-5e30-89e6-910f9fa6f1dd',
          attr: 'in'
        }
      }
    }
    Object.values(l).forEach(it => {
      it = window.structuredClone(it)

      it.from.vm = nodeRefMap.value[it.from.vm]
      it.from.el = it.from.vm.proxy.$el.querySelector(`[data-fe-attr="${it.from.attr}"]`)

      it.to.vm = nodeRefMap.value[it.to.vm]
      it.to.el = it.to.vm.proxy.$el.querySelector(`[data-fe-attr="${it.to.attr}"]`)

      // FIXME: 根据真实节点进行计算
      it.pathDArguments = [0, 0, 0, 0, 0, 0, 0, 0]

      addPath(it)
      addRelationInMapIndexedByNodeId(
        it,
        it.from,
        it.to
      )
    })
  }

  onMounted(() => {
    loadCanvasFromSerializedStatus()
  })
}

