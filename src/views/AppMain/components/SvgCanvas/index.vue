<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 1920 1080"
    xml:space="preserve"
    class="svg-canvas"
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
      v-model:position="node.position"
    />
    <io-path
      v-for="path in linkedPaths"
      :key="path.id"
      :path-id="path.id"
      :path-d-arguments="path.pathDArguments"
      :from="path.from"
      :to="path.to"
    ></io-path>
    <g class="ghost">
      <path
        class="ghost-path"
        :d="ghostPathD"
      />
      <io-node
        v-if="ghostNodeType"
        ref="ghostNodeRef"
        style="opacity: 0.5"
        :is="ghostNodeType"
        nodeId="0"
        v-model:position="ghostNodePosition"
        :relativePaths="{
          in: [],
          out: []
        }" />
    </g>
  </svg>
</template>
<script lang="ts">
import { computed, defineComponent, ref, provide, onBeforeUpdate, onMounted, watch } from 'vue'
import IoNode from './components/IoNode/index.vue'
import IoPath from './components/IoPath/index.vue'
import FilterDef from './components/FilterDef/index.vue'

import type { Port, Path, Node, RelativePathForNode } from './type'
import { getPortElType } from '@/utils'
import { portCanBeConnected } from '@/utils/link-validator'
import { uuid } from '@/utils/uuid'
import { useStore } from 'vuex'

// 圆形半径
const POINT_R = 10
// 曲线手柄长度
const HANDLE_LENGTH = 150

//
let id = 0

export default defineComponent({
  name: 'SvgCanvas',
  components: {
    IoNode,
    IoPath,
    FilterDef
  },
  setup() {
    const store = useStore()
    const canvasScrollEl = ref(document.documentElement)
    provide('canvasScrollEl', canvasScrollEl)

    const linkedPaths = ref<Path[]>([])
    const nodes = ref<Node[]>([
      {
        is: 'feConvolveMatrix',
        id: uuid(),
        position: [10, 50]
      },
      {
        is: 'feTurbulence',
        id: uuid(),
        position: [80, 30]
      },
      {
        is: 'feImage',
        id: uuid(),
        position: [300, 420]
      },
      {
        is: 'feOffset',
        id: uuid(),
        position: [80, 300]
      },
      {
        is: 'feDisplacementMap',
        id: uuid(),
        position: [720, 640]
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
        ].map((p, i) => i % 2 === 0 ? p + canvasScrollEl.value.scrollLeft - 80 : p + canvasScrollEl.value.scrollTop)
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
        ].map((p, i) => i % 2 === 0 ? p + canvasScrollEl.value.scrollLeft - 80 : p + canvasScrollEl.value.scrollTop)
      }
    }
    const handlePortMove = ({ ev, originEl }: {ev:MouseEvent, originEl: SVGCircleElement, vm: InstanceType<typeof IoNode>}) => {
      if (getPortElType(originEl) === 'in') {
        ghostPathDArguments.value = [
          ev.pageX, ev.pageY, ev.pageX + HANDLE_LENGTH, ev.pageY,
          ...ghostPathDArguments.value.slice(4)
        ].map((p, i) => {
          if (i <= 3) {
            if (i % 2 === 0) {
              return p - 80
            } else {
              return p
            }
          } else {
            return p
          }
        })
      }
      if (getPortElType(originEl) === 'out') {
        ghostPathDArguments.value = [
          ...ghostPathDArguments.value.slice(0, 4),
          ev.pageX - HANDLE_LENGTH, ev.pageY, ev.pageX, ev.pageY
        ].map((p, i) => {
          if (i >= 4) {
            if (i % 2 === 0) {
              return p - 80
            } else {
              return p
            }
          } else {
            return p
          }
        })
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
        ].map((p, i) => {
          if (i <= 3) {
            if (i % 2 === 0) {
              return p + canvasScrollEl.value.scrollLeft - 80
            } else {
              return p + canvasScrollEl.value.scrollTop
            }
          } else {
            return p
          }
        })
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
        ].map((p, i) => {
          if (i >= 4) {
            if (i % 2 === 0) {
              return p + canvasScrollEl.value.scrollLeft - 80
            } else {
              return p + canvasScrollEl.value.scrollTop
            }
          } else {
            return p
          }
        })
        linkedPath = {
          pathDArguments,
          id: '' + id++,
          from: fromPort.value as Port<InstanceType<typeof IoNode>>,
          to: toPort.value as Port<InstanceType<typeof IoNode>>
        }
      }

      if (portCanBeConnected(linkedPath)) {
        linkedPaths.value.push(linkedPath)
        ;(toPort.value?.vm as any)?.setupState?.afterConnected?.()
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
        ].map((p, i) => {
          if (i <= 3) {
            if (i % 2 === 0) {
              return p + canvasScrollEl.value.scrollLeft - 80
            } else {
              return p + canvasScrollEl.value.scrollTop
            }
          } else {
            return p
          }
        })
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
        ].map((p, i) => {
          if (i >= 4) {
            if (i % 2 === 0) {
              return p + canvasScrollEl.value.scrollLeft - 80
            } else {
              return p + canvasScrollEl.value.scrollTop
            }
          } else {
            return p
          }
        })
      })
    }

    // ghostNode
    const ghostNodeRef = ref<InstanceType<typeof IoNode>>()
    watch(ghostNodeRef, val => {
      store.commit('SET_GHOST_NODE_REF', ghostNodeRef)
    })
    const ghostNodeType = computed(() => {
      return store.state.draggingNodeIcon
    })
    const ghostNodePosition = ref([0, 0])

    return {
      ghostPathD,
      ghostNodeRef,
      ghostNodeType,
      ghostNodePosition,

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
.svg-canvas {
  enable-background: new 0 0 1920 1080;
  width: 1920px;
  height: 1080px;
  margin-left: 80px;
  .draggable {
    cursor: grab;
  }
  .ghost-path {
    fill: none;
    stroke: rgba(105, 184, 74, 0.459);
    stroke-width: 4px;
    pointer-events: none;
  }
}
</style>
