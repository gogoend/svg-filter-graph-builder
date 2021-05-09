<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 1920 1080"
    style="enable-background: new 0 0 1920 1080; width: 1920px; height: 1080px"
    xml:space="preserve"
  >
    <filter-def
      :linked-paths="linkedPaths"
      :nodes="nodeRefs"
    />
    <io-node
      :ref="setNodeRefs"
      v-for="node in nodes"
      :key="node.id"
      :is="node.is"
      :node-id="node.id"
      @port-start="handlePortStart"
      @port-move="handlePortMove"
      @port-connect="handlePortConnect"
      @port-cancel="handlePortCancel"
      @destination-change="handleDestinationChange"
      :relative-paths="getRelativePathIdOfNode(node.id)"
      @node-move="handleNodeMove"
    />
    <io-path
      v-for="path in linkedPaths"
      :key="path.id"
      :path-id="path.id"
      :path-d-arguments="path.pathDArguments"
      :from="path.from"
      :to="path.to"
    ></io-path>
    <path
      class="ghost-path"
      :d="ghostPathD"
    />
  </svg>
</template>
<script lang="ts">
import { computed, defineComponent, ref, provide, onBeforeUpdate } from 'vue'
import IoNode from './components/IoNode/index.vue'
import IoPath from './components/IoPath/index.vue'
import FilterDef from './components/FilterDef/index.vue'

import type { Port, Path, Node, RelativePathForNode } from './type'
import { getPortElType } from '@/utils'
import { uuid } from '@/utils/uuid'

// 圆形半径
const POINT_R = 10
// 曲线手柄长度
const HANDLE_LENGTH = 150

//
let id = 0

function checkLoop(path: Path) {
  const { to, from } = path
  let hasLoop = false
  const innerLoop = (from: Port<any>) => {
    if (to.vm === from.vm) {
      hasLoop = true
      return
    }
    for (let i = 0; i < from.vm.props.relativePaths.in.length; i++) {
      if (hasLoop) break
      const item = from.vm.props.relativePaths.in[i]
      innerLoop(item.from)
    }
  }
  innerLoop(from)
  return hasLoop
}

function portCanBeConnected(path: Path) {
  // 在当前port元素上点击后即松开
  if (path.from.vm === path.to.vm) {
    return false
  }
  // 尝试连接类型（in、out）相同的元素
  if (path.from.el?.dataset.portType === path.to.el?.dataset.portType) {
    return false
  }
  // 发生了重复连接
  // TODO
  // 连接产生了环
  if (checkLoop(path)) {
    return false
  }
  console.log(
    path.to.vm.props.relativePaths.in[0]
      ?.from.vm.props.relativePaths.in[0]
      ?.from.vm.props.relativePaths.in
  )

  return true
}

export default defineComponent({
  name: 'SvgCanvas',
  components: {
    IoNode,
    IoPath,
    FilterDef
  },
  setup() {
    const linkedPaths = ref<Path[]>([])
    const nodes = ref<Node[]>([
      {
        is: 'feConvolveMatrix',
        id: uuid()
      },
      {
        is: 'feTurbulence',
        id: uuid()
      },
      {
        is: 'feDropShadow',
        id: uuid()
      }
    ])
    const nodeRefs = ref<InstanceType<typeof IoNode>[]>([])
    const setNodeRefs = (ref?: InstanceType<typeof IoNode>) => {
      if (ref) { nodeRefs.value.push(ref as any) }
    }
    onBeforeUpdate(() => { nodeRefs.value = [] })

    const ghostPathDArguments = ref([0, 0, 0, 0, 0, 0, 0, 0])
    const ghostPathD = computed(() => {
      const dArgs = ghostPathDArguments.value
      return `
M ${dArgs[0]}, ${dArgs[1]}
C ${dArgs[2]}, ${dArgs[3]}, ${dArgs[4]}, ${dArgs[5]}, ${dArgs[6]}, ${dArgs[7]}`
    })

    const fromPort = ref<Port<InstanceType<typeof IoNode>>|null>(null)
    const toPort = ref<Port<InstanceType<typeof IoNode>>|null>(null)
    provide('fromPort', fromPort)
    provide('toPort', toPort)
    // const destnationVm = ref<InstanceType<typeof IoNode>>()

    const handlePortStart = ({ originEl, vm }: {ev:MouseEvent, originEl: SVGCircleElement, vm: InstanceType<typeof IoNode>}) => {
      const el = originEl
      fromPort.value = {
        vm,
        attr: originEl.dataset?.feAttr ?? '',
        el: originEl
      }
      const coord = [
        el.getBoundingClientRect().x,
        el.getBoundingClientRect().y
      ]

      if (getPortElType(el) === 'in') {
        ghostPathDArguments.value = [
          coord[0],
          coord[1],
          coord[0] + HANDLE_LENGTH,
          coord[1],

          coord[0] - HANDLE_LENGTH,
          coord[1],
          coord[0],
          coord[1] + POINT_R
        ]
      }
      if (getPortElType(el) === 'out') {
        ghostPathDArguments.value = [
          coord[0] + 2 * POINT_R,
          coord[1] + POINT_R,
          coord[0] + HANDLE_LENGTH,
          coord[1],

          coord[0] - HANDLE_LENGTH,
          coord[1],
          coord[0],
          coord[1]
        ]
      }
    }
    const handlePortMove = ({ ev, originEl }: {ev:MouseEvent, originEl: SVGCircleElement, vm: InstanceType<typeof IoNode>}) => {
      if (getPortElType(originEl) === 'in') {
        ghostPathDArguments.value = [
          ev.pageX, ev.pageY, ev.pageX + HANDLE_LENGTH, ev.pageY,
          ...ghostPathDArguments.value.slice(4)
        ]
      }
      if (getPortElType(originEl) === 'out') {
        ghostPathDArguments.value = [
          ...ghostPathDArguments.value.slice(0, 4),
          ev.pageX - HANDLE_LENGTH, ev.pageY, ev.pageX, ev.pageY
        ]
      }
    }
    const handlePortConnect = ({ ev, originEl }: {ev:MouseEvent, originEl: SVGCircleElement, vm: InstanceType<typeof IoPath>}) => {
      const el = ev.target as SVGGElement
      const coord = [
        el.getBoundingClientRect().x,
        el.getBoundingClientRect().y
      ]
      let pathDArguments: number[] = []

      let linkedPath!: Path
      // 从输入接口出发，连到输出接口的逻辑 - 反向连接
      if (getPortElType(originEl) === 'in') {
        pathDArguments = [
          coord[0] + 2 * POINT_R,
          coord[1] + POINT_R,
          coord[0] + HANDLE_LENGTH,
          coord[1],
          ...ghostPathDArguments.value.slice(4)
        ]
        // 在存储路径时需要将to和from交换，因为连接的出发点是从输入接口，输入接口被存储为了fromPort
        linkedPath = {
          pathDArguments,
          id: '' + id++,
          to: fromPort.value as Port<InstanceType<typeof IoNode>>,
          from: toPort.value as Port<InstanceType<typeof IoNode>>
        }
      }
      // 从输出接口出发，连到输入接口的逻辑 - 正向连接
      if (getPortElType(originEl) === 'out') {
        pathDArguments = [
          ...ghostPathDArguments.value.slice(0, 4),
          coord[0] - HANDLE_LENGTH,
          coord[1],
          coord[0],
          coord[1] + POINT_R
        ]
        linkedPath = {
          pathDArguments,
          id: '' + id++,
          from: fromPort.value as Port<InstanceType<typeof IoNode>>,
          to: toPort.value as Port<InstanceType<typeof IoNode>>
        }
      }

      if (portCanBeConnected(linkedPath)) {
        linkedPaths.value.push(linkedPath)
      }

      fromPort.value = null
      toPort.value = null
      ghostPathDArguments.value.fill(0)
    }
    const handlePortCancel = () => {
      console.log('canceled')
      fromPort.value = null
      toPort.value = null
      ghostPathDArguments.value.fill(0)
    }
    const handleDestinationChange = ({ vm, originEl, ev }: {vm: InstanceType<typeof IoNode> | null, originEl: SVGCircleElement, ev: MouseEvent}) => {
      toPort.value = {
        vm: vm as InstanceType<typeof IoNode>,
        attr: (ev.target as SVGCircleElement)?.dataset?.feAttr ?? '',
        el: originEl
      }
    }
    const handleNodeMove = (paths: RelativePathForNode) => {
      paths.out.forEach(item => {
        const coord = [
          item.from.el?.getBoundingClientRect().x ?? 0,
          item.from.el?.getBoundingClientRect().y ?? 0
        ]
        item.pathDArguments = [
          coord[0] + 2 * POINT_R,
          coord[1] + POINT_R,
          coord[0] + HANDLE_LENGTH,
          coord[1],
          ...item.pathDArguments.slice(4)
        ]
      })
      paths.in.forEach(item => {
        const coord = [
          item.to.el?.getBoundingClientRect().x ?? 0,
          item.to.el?.getBoundingClientRect().y ?? 0
        ]
        item.pathDArguments = [
          ...item.pathDArguments.slice(0, 4),
          coord[0] - HANDLE_LENGTH,
          coord[1],
          coord[0],
          coord[1] + POINT_R
        ]
      })
    }

    return {
      ghostPathD,
      nodes,
      nodeRefs,
      setNodeRefs,
      linkedPaths,
      handlePortStart,
      handlePortMove,
      handlePortConnect,
      handlePortCancel,
      handleDestinationChange,
      handleNodeMove,

      fromPort,
      toPort,

      getRelativePathIdOfNode(nodeId: string): RelativePathForNode {
        nodeId = String(nodeId)
        return {
          in: linkedPaths.value.filter(path => path.to?.vm.props.nodeId === nodeId),
          out: linkedPaths.value.filter(path => path.from?.vm.props.nodeId === nodeId)
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.draggable {
  cursor: grab;
}
.ghost-path {
  fill: none;
  stroke: rgba(105, 184, 74, 0.459);
  stroke-width: 4px;
  pointer-events: none;
}
</style>
