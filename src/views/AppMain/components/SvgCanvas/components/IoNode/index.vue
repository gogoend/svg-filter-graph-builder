<template>
  <g
    class="io-node"
    @mousedown="handleNodeMousedown"
    :transform="`translate(${position[0]}, ${position[1]})`"
    ref="ioNodeEl"
  >
    <foreignObject class="io-node__inner">
      <div
        class="io-node__body"
        xmlns="http://www.w3.org/1999/xhtml">
        <img
          class="io-node__filter-thumb"
          :src="filterThumbUrl"
        />
        <div
          class="io-node__head"
        >
          <em
            class="port out"
            data-port-type="out"
            r="10"
            cx="250"
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
      </div>
    </foreignObject>
  </g>
</template>
<script lang="ts">
import { computed, defineComponent, getCurrentInstance, inject, nextTick, onBeforeUpdate, PropType, provide, Ref, ref, unref } from 'vue'
import mouseEventHelper from '@/utils/mouse-event-helper'

import fe from './fe-definition-config'

import type { Port, RelativePathForNode } from '@/views/AppMain/components/SvgCanvas/type'
import { isPortEl } from '@/utils'
import NormalNode from './components/NormalNode.vue'
import MergeNode from './components/MergeNode.vue'
import { Dictionary } from '@/utils/type'

export default defineComponent({
  components: { NormalNode, MergeNode },
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
    }
  },
  setup(props, { emit }) {
    const vm = ref(getCurrentInstance())
    const fromPort = inject<Ref<Port<any>>>('fromPort')
    const toPort = inject<Ref<Port<any>>>('toPort')

    const ioNodeEl = ref<SVGGElement>()
    const position = ref([0, 0])
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
    const mergedFeAttrValue = computed<Dictionary<unknown> | unknown[]>(() => {
      return (nodeConfigRef.value as any).mergedFeAttrValue
    })
    /**
     * getVNodeFragment 供下层（各类型Node）组件递归组件树时使用，用于获得滤镜VNode
     */
    const getVNodeFragment = computed(() => {
      return nodeConfigRef.value?.getVNodeFragment
    })

    const afterConnected = computed(() => {
      return (nodeConfigRef.value as any)?.afterConnected ?? (() => void 0)
    })

    const canvasScrollEl = inject('canvasScrollEl') as Ref<HTMLElement>
    const handleNodeMousedown = function(ev: MouseEvent) {
      mouseEventHelper(ev, {
        start(ev, { originEl }) {
          if (isPortEl(originEl)) {
            emit('port-start', { ev, originEl, vm })
          } else {
            const currentPostion = (ioNodeEl.value?.getBoundingClientRect() as DOMRect)
            // clickedRelativePosition.value = [ev.pageX - currentPostion?.left, ev.pageY - currentPostion?.top]
            clickedRelativePosition.value = [
              ev.pageX - currentPostion?.left - canvasScrollEl.value.scrollLeft,
              ev.pageY - currentPostion?.top - canvasScrollEl.value.scrollTop
            ]
          }
        },
        move(ev, { originEl }) {
          if (isPortEl(originEl)) {
            emit('port-move', { ev, originEl, vm })
          } else {
            position.value = [
              ev.pageX - clickedRelativePosition.value[0],
              ev.pageY - clickedRelativePosition.value[1]
            ] // clickedRelativePosition.value.concat()
            nextTick(() => {
              const currentPostion = (ioNodeEl.value?.getBoundingClientRect() as DOMRect)
              clickedRelativePosition.value = [
                ev.pageX - currentPostion?.left - canvasScrollEl.value.scrollLeft,
                ev.pageY - currentPostion?.top - canvasScrollEl.value.scrollTop
              ]
              emit('node-move', props.relativePaths)
            })
          }
        },
        up(ev, { originEl }) {
          if (isPortEl(originEl)) {
            if (
              isPortEl(ev.target as HTMLElement) &&
              fromPort?.value &&
              toPort?.value
            ) {
              // console.log(toPort.value.vm.refs.ioNodeEl.querySelector(`[data-fe-attr=${toPort.value.attr}]`))
              emit('port-connect', { ev, originEl, vm })
            } else {
              emit('port-cancel', { ev, originEl, vm })
            }
          }
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
    const allDescendants = computed<any[]>(() => {
      const allDescendants = new Set()
      const innerLoop = (vm: any) => {
        allDescendants.add(vm)

        vm.props.relativePaths.in.forEach((item: any) => {
          innerLoop(item.from.vm)
        })
        // [0].from.vm.setupState.allDescendants[0]
      }
      innerLoop(unref(vm))
      // props.relativePaths.in[0].from.vm.props.relativePaths.in[0].from.vm.props.relativePaths.in[0]
      return [...allDescendants]
    })
    provide('allDescendants', allDescendants)

    return {
      fromPort,

      ioNodeEl,
      position,

      setFeAttrEls,

      handleNodeMousedown,
      handlePortMouseenter,
      fe,
      allDescendants,
      afterConnected,

      nodeConfigRef,
      filterThumbUrl,
      mergedFeAttrValue,
      getVNodeFragment
    }
  }
})
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
    width: 15em;
    background-color: #333333;
    padding: 0.5em 0;
    position: relative;
    font-size: 12px;
  }
  .module-name {
    font-size: 1.25em;
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
    background-color: #333333;
    border: 4px solid;
    width: 0.75em;
    height: 0.75em;
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
  :deep(&__li) {
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
        font-size: 1.25em;
      }
      input {
        width: 30px;
        flex: 0 1 auto;
      }
    }
  }
}

</style>
