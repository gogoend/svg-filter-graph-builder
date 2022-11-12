<template>
  <g
    class="io-node"
    :class="{
      'io-node--focused': isFocused
    }"
    @mousedown.stop="handleNodeMousedown"
    :transform="`translate(${position[0]}, ${position[1]})`"
    ref="ioNodeEl"
  >
    <foreignObject class="io-node__inner">
      <div
        class="io-node__body"
        xmlns="http://www.w3.org/1999/xhtml"
        @click.exact.stop="handleNodeBodyClick"
      >
        <img
          v-if="false"
          class="io-node__filter-thumb"
          :src="filterThumbUrl"
        />
        <div
          class="io-node__head"
        >
          <em
            class="port out"
            data-port-type="out"
            :style="{
              width: `${2 * POINT_R}px`,
              height: `${ 2 * POINT_R }px`,
              borderWidth: `${ POINT_BORDER_W }px`
            }"
            data-fe-attr="result"
            :ref="setFeAttrEls"
            @mouseenter="handlePortMouseenter"
          />
          <span
            transform="matrix(1 0 0 1 0 8)"
            class="fill-fff module-name">{{is}}</span>
        </div>
        <template v-if="['normal', undefined].includes(fe[is].type)">
          <normal-node
            :is="is"
            :node-id="nodeId"
            :relativePaths="relativePaths"
            ref="nodeConfigRef"
          />
        </template>
        <template v-else-if="['merge'].includes(fe[is].type)">
          <merge-node
            :is="is"
            :node-id="nodeId"
            :relativePaths="relativePaths"
            ref="nodeConfigRef"
          />
        </template>
        <template v-else-if="['source'].includes(fe[is].type)">
          <source-node
            :is="is"
            :node-id="nodeId"
            :relativePaths="relativePaths"
            ref="nodeConfigRef"
          />
        </template>
        <template v-else-if="['string-literal'].includes(fe[is].type)">
          <string-literal-node
            :is="is"
            :node-id="nodeId"
            :relativePaths="relativePaths"
            ref="nodeConfigRef"
          />
        </template>
        <template v-else-if="['matrix-in-fe-color-matrix'].includes(fe[is].type)">
          <matrix-in-fe-color-matrix-node
            :is="is"
            :node-id="nodeId"
            :relativePaths="relativePaths"
            ref="nodeConfigRef"
          />
        </template>
        <template v-else-if="['component-transfer-root'].includes(fe[is].type)">
          <component-transfer-root-node
            :is="is"
            :node-id="nodeId"
            :relativePaths="relativePaths"
            ref="nodeConfigRef"
          />
        </template>
        <template v-else-if="['component-transfer-child'].includes(fe[is].type)">
          <component-transfer-child-node
            :is="is"
            :node-id="nodeId"
            :relativePaths="relativePaths"
            ref="nodeConfigRef"
          />
        </template>
      </div>
    </foreignObject>
  </g>
</template>
<script lang="ts">
import { computed, defineComponent, getCurrentInstance, inject, nextTick, onBeforeUpdate, PropType, provide, Ref, ref, ShallowRef, shallowRef, unref } from 'vue'
import mouseEventHelper from '@/utils/mouse-event-helper'

import fe from './fe-definition-config'

import { OverwrittenIoNodeType, Path, Port, RelativePathForNode, SVG_CANVAS_RECT_SYMBOL } from '@/views/AppMain/components/SvgCanvas/type'
import { getTopoOrder, isPortEl } from '@/utils'

import NormalNode from './components/NormalNode.vue'
import MergeNode from './components/MergeNode.vue'
import SourceNode from './components/SourceNode.vue'
import StringLiteralNode from './components/StringLiteralNode.vue'
import MatrixInFeColorMatrixNode from './components/MatrixInFeColorMatrixNode.vue'
import ComponentTransferRootNode from './components/ComponentTransferRootNode.vue'
import ComponentTransferChildNode from './components/ComponentTransferChildNode.vue'

import { filterLibraryPanelWidth, POINT_BORDER_W, POINT_R } from '@/config/ui'
import { FOCUSING_NODE_SYMBOL } from '@/store/focusState'

const IoNode: {
  new(): OverwrittenIoNodeType
} = defineComponent({
  components: { NormalNode, MergeNode, SourceNode, StringLiteralNode, MatrixInFeColorMatrixNode, ComponentTransferRootNode, ComponentTransferChildNode },
  name: 'IoNode',
  props: {
    is: {
      type: String as PropType<keyof typeof fe>,
      required: true
    },
    nodeId: {
      type: String,
      required: true
    },
    relativePaths: {
      type: Object as PropType<RelativePathForNode>,
      required: true
    },
    position: {
      type: Array as PropType<number[]>,
      required: true
    }
  },
  setup(props, { emit }) {
    const vm = getCurrentInstance()!.proxy as unknown as OverwrittenIoNodeType

    const svgCanvasRect = inject(SVG_CANVAS_RECT_SYMBOL)!

    const fromPort = inject<Ref<Port<typeof vm>>>('fromPort')
    const toPort = inject<Ref<Port<typeof vm>>>('toPort')

    const ioNodeEl = ref<SVGGElement>()

    const clickedRelativePosition = ref([0, 0])

    const feAttrEls = ref<SVGCircleElement[]>([])
    const setFeAttrEls = (el?: SVGCircleElement) => {
      el && feAttrEls.value.push(el)
    }
    onBeforeUpdate(() => { feAttrEls.value = [] })

    const nodeConfigRef = ref<InstanceType<typeof NormalNode> | InstanceType<typeof MergeNode>>()

    const filterThumbUrl = computed<string>(() => {
      return nodeConfigRef.value?.filterThumbUrl ?? ''
    })

    /**
     * feAttrValue 供下层（各类型Node）组件递归组件树时使用，直接在本层级获得feAttrValue而无需进入到下层组件
     * 去掉此变量会使得 filterThumb 一片空白，且生成的滤镜标签中无任何属性
     */
    const mergedFeAttrValue = computed(() => {
      return nodeConfigRef.value?.mergedFeAttrValue ?? {}
    })
    /**
     * getVNodeFragment 供下层（各类型Node）组件递归组件树时使用，用于获得滤镜VNode
     */
    const getVNodeFragment = computed(() => {
      return nodeConfigRef.value?.getVNodeFragment
    })

    const afterPathConnected = computed(() => {
      return nodeConfigRef.value?.afterPathConnected ?? (() => void 0)
    })
    const afterPathRemoved = computed(() => {
      return nodeConfigRef.value?.afterPathRemoved ?? (() => void 0)
    })

    const canvasScrollEl = inject('canvasScrollEl') as Ref<HTMLElement>
    const handleNodeMousedown = function(ev: MouseEvent) {
      mouseEventHelper(ev, {
        start(ev, { originEl }) {
          // 如果鼠标事件的出发点是端口
          if (isPortEl(originEl)) {
            // 就认为连线开始了
            emit('port-start', { ev, originEl, vm })
          } else {
            // 否则认为是节点移动，此时保存鼠标事件起始点的位置
            const currentPosition = (ioNodeEl.value?.getBoundingClientRect() as DOMRect)
            // clickedRelativePosition.value = [ev.pageX - currentPosition?.left, ev.pageY - currentPosition?.top]
            clickedRelativePosition.value = [
              ev.pageX - currentPosition?.left - canvasScrollEl.value.scrollLeft,
              ev.pageY - currentPosition?.top - canvasScrollEl.value.scrollTop
            ]
          }
        },
        move(ev, { originEl }) {
          // 如果鼠标事件的出发点是端口
          if (isPortEl(originEl)) {
            // 就认为目前处于连线改变阶段 - 连线的控制点坐标应当会随之改变
            emit('port-move', { ev, originEl, vm })
          } else {
            // 否则认为是节点移动，此时更新节点的位置
            const newPosition = [
              ev.pageX - clickedRelativePosition.value[0] - svgCanvasRect.value.left,
              ev.pageY - clickedRelativePosition.value[1] - svgCanvasRect.value.top
            ] // clickedRelativePosition.value.concat()
            emit('update:position', newPosition)
            nextTick(() => {
              const currentPosition = (ioNodeEl.value?.getBoundingClientRect() as DOMRect)
              clickedRelativePosition.value = [
                ev.pageX - currentPosition?.left - canvasScrollEl.value.scrollLeft,
                ev.pageY - currentPosition?.top - canvasScrollEl.value.scrollTop
              ]
              emit('node-move', props.relativePaths)
            })
          }
        },
        up(ev, { originEl }) {
          // 如果鼠标事件的出发点是端口
          if (isPortEl(originEl)) {
            // 而且如果鼠标事件的终止点也是端口
            if (
              isPortEl(ev.target as HTMLElement) &&
              fromPort?.value &&
              toPort?.value
            ) {
              // 则认为两个端口应该进行连线
              // console.log(toPort.value.vm.refs.ioNodeEl.querySelector(`[data-fe-attr=${toPort.value.attr}]`))
              emit('port-connect', { ev, originEl, vm })
            } else {
              // 否则如果鼠标事件的终止点不是端口，则认为连线过程已经取消
              emit('port-cancel', { ev, originEl, vm })
            }
          }
          // 重置鼠标事件起始点位置
          clickedRelativePosition.value = [0, 0]
        }
      })
    }

    const handlePortMouseout = function(ev: Event) {
      if (!fromPort?.value) { return }
      emit('destination-change', { ev, vm: null, originEl: null })
      ev.target?.removeEventListener('mouseout', handlePortMouseout)
    }
    const handlePortMouseenter = function(ev: Event) {
      if (!fromPort?.value) { return }
      emit('destination-change', { ev, vm, originEl: ev.target })
      ev.target?.addEventListener('mouseout', handlePortMouseout)
    }
    provide('handlePortMouseenter', handlePortMouseenter)

    // 计算属性，表示当前节点下的所有的后代节点
    const allDescendants = computed<OverwrittenIoNodeType[]>(() => {
      const allDescendants = new Set<OverwrittenIoNodeType>()
      const innerLoop = (vm: OverwrittenIoNodeType) => {
        allDescendants.add(vm)

        vm.relativePaths.in.forEach((item) => {
          innerLoop(item.from.vm)
        })
        // [0].from.vm.allDescendants[0]
      }
      innerLoop(vm)
      // props.relativePaths.in[0].from.vm.relativePaths.in[0].from.vm.relativePaths.in[0]
      return [...allDescendants]
    })
    provide('allDescendants', allDescendants)

    const orderedAllDescendants = computed<OverwrittenIoNodeType[]>(() => {
      const allInPaths: Path[] = []
      allDescendants?.value.forEach(item => {
        allInPaths.push(...item.relativePaths.in)
      })

      if (allInPaths.length) {
        return getTopoOrder(allInPaths)
      } else {
        return [vm]
      }
    })
    provide('orderedAllDescendants', orderedAllDescendants)

    const [focusingNode, setFocusingNode] = inject(FOCUSING_NODE_SYMBOL)!
    const handleNodeBodyClick = () => {
      setFocusingNode(vm)
    }
    const isFocused = computed(() => focusingNode.value === vm)

    return {
      POINT_R,
      POINT_BORDER_W,

      fromPort,

      ioNodeEl,

      setFeAttrEls,

      handleNodeMousedown,
      handlePortMouseenter,
      fe,
      allDescendants,
      afterPathConnected,
      afterPathRemoved,

      nodeConfigRef,
      filterThumbUrl,
      mergedFeAttrValue,
      getVNodeFragment,
      orderedAllDescendants,

      focusingNode,
      handleNodeBodyClick,
      isFocused
    }
  }
})

export default IoNode
</script>

<style lang="scss" scoped>
.fill-333 {
  fill: #333333;
}
.fill-fff {
  fill: #ffffff;
}
.io-node {
  user-select: none;
  cursor: move;
  color: #fff;
  &__inner {
    overflow: visible;
  }
  &__body {
    width: fit-content;
    min-width: 10em;
    background-color: #333333;
    padding: 0.5em 0;
    position: relative;
    font-size: 12px;
  }
  .module-name {
  }
  &__filter-thumb {
    position: absolute;
    height: 40px;
    width: 40px;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
    background-color: #f0f0f0;
  }
  :deep(.port) {
    display: block;
    box-sizing: border-box;
    background-color: #333333;
    border-style: solid;
    border-radius: 50%;
    flex: 0 0 auto;
    cursor: grab;
    &.disabled {
      cursor: no-drop;
    }
  }
  &__head {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    .port {
      border-color: #00f9f9;
      transform: translate(50%, 0);
    }
  }
  :deep(.io-node__li) {
    display: flex;
    align-items: center;
    flex-direction: row;
    line-height: 1.75em;
    .port {
      border-color: #ff7f00;
      transform: translate(-50%, 0);
    }
    label.io-node__port-text{
      display: flex;
      flex: 1;
      justify-content: space-between;
      align-items: center;
      .port-name {
      }
      input {
        width: 6em;
        flex: 0 1 auto;
      }
    }
  }
}

.io-node.io-node--focused {
  .io-node__body {
    box-shadow: 0 0 8px #00f9f9;
  }
}

</style>
