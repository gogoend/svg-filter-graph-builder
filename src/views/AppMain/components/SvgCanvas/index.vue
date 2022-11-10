<template>
  <div ref="canvasScrollEl">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 4000 4000"
      xml:space="preserve"
      class="svg-canvas-board"
    >
      <io-node
        :ref="setNodeRefMap"
        v-for="node in nodes"
        :key="node.id"
        :is="node.is"
        :node-id="node.id"
        @port-start="handlePortStart"
        @port-move="handlePortMove"
        @port-connect="handlePortConnect"
        @port-cancel="handlePortCancel"
        @destination-change="handleDestinationChange"
        :relative-paths="
          relativePathMapIndexedByNodeId[node.id] ?? defaultRelativePath
        "
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
        @remove="removePath"
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
          :relativePaths="defaultRelativePath" />
      </g>
    </svg>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, provide, onBeforeUpdate, onMounted, watch, readonly, inject, shallowRef, nextTick } from 'vue'
import IoNode from './components/IoNode/index.vue'
import IoPath from './components/IoPath/index.vue'

import type { Port, Path, Node, RelativePathForNode } from './type'
import { getPortElType } from '@/utils'
import { assertPortCanBeConnected } from '@/utils/link-validator'
import { filterLibraryPanelWidth, HANDLE_LENGTH, POINT_R } from '@/config/ui'
import {
  ALL_LINKED_PATH_ON_CANVAS_SYMBOL,
  ALL_NODES_ON_CANVAS_SYMBOL,
  REMOVE_PATH_SYMBOL,
  RELATIVE_PATH_MAP_INDEXED_BY_NODE_ID_SYMBOL,
  ADD_RELATION_IN_MAP_INDEXED_BY_NODE_ID_SYMBOL,
  ADD_PATH_SYMBOL,
  NODE_REF_MAP_SYMBOL,
  ADD_NODES_SYMBOL
} from '@/store/canvasStuff'
import { DRAGGING_NODE_ICON_SYMBOL, GHOST_NODE_REF_SYMBOL } from '@/store/draggingNode'
import { getLinks, getNodeValueMap, getNodes } from '@/api/graph'
import { uuid } from '@/utils/uuid'
// eslint-disable-next-line vue/prefer-import-from-vue
import { hasOwn } from '@vue/shared'

export default defineComponent({
  name: 'SvgCanvas',
  components: {
    IoNode,
    IoPath
  },
  setup() {
    const canvasScrollEl = shallowRef<HTMLDivElement>()
    provide('canvasScrollEl', canvasScrollEl)

    const linkedPaths = inject(ALL_LINKED_PATH_ON_CANVAS_SYMBOL)!
    const addPath = inject(ADD_PATH_SYMBOL)!
    const removePath = inject(REMOVE_PATH_SYMBOL)!

    const nodes = inject(ALL_NODES_ON_CANVAS_SYMBOL)!

    const relativePathMapIndexedByNodeId = inject(RELATIVE_PATH_MAP_INDEXED_BY_NODE_ID_SYMBOL)!
    const addRelationInMapIndexedByNodeId = inject(ADD_RELATION_IN_MAP_INDEXED_BY_NODE_ID_SYMBOL)!

    const nodeRefMap = inject(NODE_REF_MAP_SYMBOL)!
    const setNodeRefMap = (ref?: InstanceType<typeof IoNode>) => {
      if (ref) {
        nodeRefMap.value[ref.nodeId] = ref
      }
    }
    onBeforeUpdate(() => { nodeRefMap.value = {} })

    /**
     * 鬼影路径参数
     */
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

    /**
     * 处理鼠标点击起始/终止端口
     * 点击后，将开始从端口发出鬼影路径
     */
    const handlePortStart = (
      {
        originEl,
        vm
      }:
      {
        ev:MouseEvent,
        originEl: SVGCircleElement,
        vm: InstanceType<typeof IoNode>
      }
    ) => {
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
          coord[1] + POINT_R,
          coord[0] + HANDLE_LENGTH + POINT_R,
          coord[1] + POINT_R,

          coord[0] - HANDLE_LENGTH + POINT_R,
          coord[1] + POINT_R,
          coord[0],
          coord[1] + POINT_R
        ].map((p, i) => i % 2 === 0 ? p + canvasScrollEl.value!.scrollLeft - filterLibraryPanelWidth : p + canvasScrollEl.value!.scrollTop)
      }
      if (getPortElType(el) === 'out') {
        ghostPathDArguments.value = [
          coord[0] + 2 * POINT_R,
          coord[1] + POINT_R,
          coord[0] + HANDLE_LENGTH + POINT_R,
          coord[1] + POINT_R,

          coord[0] - HANDLE_LENGTH + POINT_R,
          coord[1],
          coord[0],
          coord[1]
        ].map((p, i) => i % 2 === 0 ? p + canvasScrollEl.value!.scrollLeft - filterLibraryPanelWidth : p + canvasScrollEl.value!.scrollTop)
      }
    }

    /**
     * 处理从端口发出路径后，鼠标移动时的一些逻辑
     * 用于更新鬼影路径的逻辑
     */
    const handlePortMove = (
      {
        ev,
        originEl
      }:
      {
        ev:MouseEvent,
        originEl: SVGCircleElement,
        vm: InstanceType<typeof IoNode>
      }
    ) => {
      if (getPortElType(originEl) === 'in') {
        ghostPathDArguments.value = [
          ev.pageX, ev.pageY, ev.pageX + HANDLE_LENGTH, ev.pageY,
          ...ghostPathDArguments.value.slice(4)
        ].map((p, i) => {
          if (i <= 3) {
            if (i % 2 === 0) {
              return p + canvasScrollEl.value!.scrollLeft - filterLibraryPanelWidth
            } else {
              return p + canvasScrollEl.value!.scrollTop
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
              return p + canvasScrollEl.value!.scrollLeft - filterLibraryPanelWidth
            } else {
              return p + canvasScrollEl.value!.scrollTop
            }
          } else {
            return p
          }
        })
      }
    }

    /**
     * 处理从端口发出路径后，连接到另一端口的逻辑
     */
    const handlePortConnect = (
      {
        ev,
        originEl
      }:
      {
        ev: MouseEvent,
        originEl: SVGCircleElement,
        vm: InstanceType<typeof IoPath>
      }
    ) => {
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
          coord[0] + HANDLE_LENGTH + POINT_R,
          coord[1] + POINT_R,
          ...ghostPathDArguments.value.slice(4)
        ].map((p, i) => {
          if (i <= 3) {
            if (i % 2 === 0) {
              return p + canvasScrollEl.value!.scrollLeft - filterLibraryPanelWidth
            } else {
              return p + canvasScrollEl.value!.scrollTop
            }
          } else {
            return p
          }
        })
        // 在存储路径时需要将to和from交换，因为连接的出发点是从输入接口，输入接口被存储为了fromPort
        linkedPath = {
          pathDArguments,
          id: uuid(),
          to: fromPort.value as Port<InstanceType<typeof IoNode>>,
          from: toPort.value as Port<InstanceType<typeof IoNode>>
        }
      }
      // 从输出接口出发，连到输入接口的逻辑 - 正向连接
      if (getPortElType(originEl) === 'out') {
        pathDArguments = [
          ...ghostPathDArguments.value.slice(0, 4),
          coord[0] - HANDLE_LENGTH + POINT_R,
          coord[1] + POINT_R,
          coord[0],
          coord[1] + POINT_R
        ].map((p, i) => {
          if (i >= 4) {
            if (i % 2 === 0) {
              return p + canvasScrollEl.value!.scrollLeft - filterLibraryPanelWidth
            } else {
              return p + canvasScrollEl.value!.scrollTop
            }
          } else {
            return p
          }
        })
        linkedPath = {
          pathDArguments,
          id: uuid(),
          from: fromPort.value as Port<InstanceType<typeof IoNode>>,
          to: toPort.value as Port<InstanceType<typeof IoNode>>
        }
      }

      try {
        assertPortCanBeConnected(linkedPath)
        addPath(linkedPath)

        // 处理开始端口为out端口
        if (getPortElType(originEl) === 'out') {
          addRelationInMapIndexedByNodeId(
            linkedPath,
            fromPort,
            toPort
          )
          toPort.value?.vm?.afterPathConnected?.()
        } else {
          // 处理开始端口为in端口
          addRelationInMapIndexedByNodeId(
            linkedPath,
            toPort,
            fromPort
          )
          fromPort.value?.vm?.afterPathConnected?.()
        }
      } catch (err) {
        console.error(err)
      }
      fromPort.value = null
      toPort.value = null
      ghostPathDArguments.value.fill(0)
    }

    /**
     * 用于处理连线取消的逻辑
     */
    const handlePortCancel = () => {
      console.log('canceled')
      fromPort.value = null
      toPort.value = null
      ghostPathDArguments.value.fill(0)
    }

    /**
     * 处理路径末端移动过程中，要连接的端口发生改变后的逻辑
     */
    const handleDestinationChange = ({ vm, originEl, ev }: {vm: InstanceType<typeof IoNode> | null, originEl: SVGCircleElement, ev: MouseEvent}) => {
      toPort.value = {
        vm: vm as InstanceType<typeof IoNode>,
        attr: (ev.target as SVGCircleElement)?.dataset?.feAttr ?? '',
        el: originEl
      }
    }

    /**
     * 处理节点移动
     */
    const handleNodeMove = (paths: RelativePathForNode) => {
      paths.out.forEach(item => {
        const coord = [
          item.from.el?.getBoundingClientRect().x ?? 0,
          item.from.el?.getBoundingClientRect().y ?? 0
        ]
        item.pathDArguments = [
          coord[0] + 2 * POINT_R,
          coord[1] + POINT_R,
          coord[0] + HANDLE_LENGTH + POINT_R,
          coord[1] + POINT_R,
          ...item.pathDArguments.slice(4)
        ].map((p, i) => {
          if (i <= 3) {
            if (i % 2 === 0) {
              return p + canvasScrollEl.value!.scrollLeft - filterLibraryPanelWidth
            } else {
              return p + canvasScrollEl.value!.scrollTop
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
          coord[0] - HANDLE_LENGTH + POINT_R,
          coord[1] + POINT_R,
          coord[0],
          coord[1] + POINT_R
        ].map((p, i) => {
          if (i >= 4) {
            if (i % 2 === 0) {
              return p + canvasScrollEl.value!.scrollLeft - filterLibraryPanelWidth
            } else {
              return p + canvasScrollEl.value!.scrollTop
            }
          } else {
            return p
          }
        })
      })
    }

    /**
     * 鬼影节点参数
     */
    const ghostNodeRef = inject(GHOST_NODE_REF_SYMBOL)!

    const ghostNodeType = inject(DRAGGING_NODE_ICON_SYMBOL)!
    const ghostNodePosition = ref([0, 0])

    const defaultRelativePath = readonly({
      in: [],
      out: []
    })

    const addNodes = inject(ADD_NODES_SYMBOL)!

    const loadCanvasFromSerializedStatus = async() => {
      const [nodes, nodeFormValues, links] = await Promise.all(
        [
          getNodes(),
          getNodeValueMap(),
          getLinks()
        ]
      )
      Object.values(nodes)
        .forEach(it => {
          addNodes(it)
        })
      // 等待节点都挂载后，再回填表单
      await nextTick()
      Object.entries(nodeFormValues).forEach(([nodeId, nodeFormValue], index) => {
        Object.keys(nodeFormValue).forEach((key: keyof typeof nodeFormValue) => {
          // FIXME: 修正类型
          if (
            [
              hasOwn(nodeRefMap.value[nodeId].nodeConfigRef.feAttrValue, key as any), // 仅回填节点定义中包含的字段
              nodes[nodeId].is === 'feMerge' // 如果是feMerge节点，则全部回填 // TODO: 此处应该枚举出所有类似的元素
            ].includes(true)
          ) {
            (nodeRefMap.value[nodeId].nodeConfigRef.feAttrValue as any)[key] = nodeFormValue[key]
          }
        })
      })
      // 等待节点都正确后，再创建连接
      await nextTick()
      Object.values(links)
        .map(it => {
          const newIt = window.structuredClone(it) as unknown as Path // 强转类型

          newIt.from.vm = nodeRefMap.value[it.from.vmId]
          newIt.from.el = newIt.from.vm.$el.querySelector(`[data-fe-attr="${it.from.attr}"]`)!
          const fromPortCoord = [
            newIt.from.el!.getBoundingClientRect().x,
            newIt.from.el!.getBoundingClientRect().y
          ]

          newIt.to.vm = nodeRefMap.value[it.to.vmId]
          newIt.to.el = newIt.to.vm.$el.querySelector(`[data-fe-attr="${it.to.attr}"]`)
          const toPortCoord = [
            newIt.to.el!.getBoundingClientRect().x,
            newIt.to.el!.getBoundingClientRect().y
          ]

          newIt.pathDArguments = [
            fromPortCoord[0] + 2 * POINT_R,
            fromPortCoord[1] + POINT_R,
            fromPortCoord[0] + HANDLE_LENGTH + POINT_R,
            fromPortCoord[1] + POINT_R,

            toPortCoord[0] - HANDLE_LENGTH + POINT_R,
            toPortCoord[1] + POINT_R,
            toPortCoord[0],
            toPortCoord[1] + POINT_R
          ].map((p, i) => i % 2 === 0 ? p + canvasScrollEl.value!.scrollLeft - filterLibraryPanelWidth : p + canvasScrollEl.value!.scrollTop)

          return newIt
        })
        .forEach(it => {
          try {
            assertPortCanBeConnected(it)
            addPath(it)
            addRelationInMapIndexedByNodeId(
              it,
              it.from,
              it.to
            )
            toPort.value = it.to
            fromPort.value = it.from
            it.to.vm?.afterPathConnected?.()
          } catch (err) {
            console.error(err)
          }
          fromPort.value = null
          toPort.value = null
        })
    }

    onMounted(() => {
      loadCanvasFromSerializedStatus()
    })

    return {
      canvasScrollEl,
      filterLibraryPanelWidth,

      ghostPathD,
      ghostNodeRef,
      ghostNodeType,
      ghostNodePosition,

      nodes,
      setNodeRefMap,

      linkedPaths,

      handlePortStart,
      handlePortMove,
      handlePortConnect,
      handlePortCancel,
      handleDestinationChange,
      handleNodeMove,

      fromPort,
      toPort,

      defaultRelativePath,
      relativePathMapIndexedByNodeId,
      removePath
    }
  }
})
</script>

<style lang="scss" scoped>
.svg-canvas-board {
  enable-background: new 0 0 4000 4000;
  width: 4000px;
  height: 4000px;
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
