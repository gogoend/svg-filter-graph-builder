<template>
  <g
    class="io-node"
    @mousedown="handleNodeMousedown"
    :transform="`translate(${position[0]}, ${position[1]})`"
    ref="ioNodeEl"
  >
    <rect
      x="11.9"
      class="io-node__bg fill-333"
      width="265"
      :height="12+35*(Object.keys(fe[is] || {}).length+1)" />
    <g
      class="head"
      transform="matrix(1 0 0 1 28 24)">
      <circle
        class="port out"
        data-port-type="out"
        r="10"
        cx="250"
        data-fe-attr="result"
        :ref="setFeAttrEls"
        @mouseenter="handlePortMouseenter"
      />
      <text
        transform="matrix(1 0 0 1 0 8)"
        class="fill-fff module-name">fe{{
          `${is.substr(0, 1).toUpperCase()}${is.substring(1)}`
        }}</text>
    </g>
    <g
      v-for="(item, key, index) in fe[is]"
      :key="key"
      :transform="`matrix(1 0 0 1 10 ${60 + 35 * index})`">
      <circle
        class="port in"
        data-port-type="in"
        r="10"
        :data-fe-attr="key"
        :ref="setFeAttrEls"
        @mouseenter="handlePortMouseenter"
      />
      <text
        transform="matrix(1 0 0 1 16 8)"
        class="fill-fff port-name">{{ key }}</text>
    </g>

  </g>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance, inject, nextTick, onBeforeUpdate, PropType, Ref, ref } from 'vue'
import mouseEventHelper from '@/utils/mouse-event-helper'

import * as fe from './fe-definition'

import type { Port, RelativePathForNode } from '@/views/AppMain/components/SvgCanvas/type'
import { isPortEl } from '@/utils'

export default defineComponent({
  name: 'IoNode',
  props: {
    is: {
      type: String,
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

    const handleNodeMousedown = function(ev: MouseEvent) {
      mouseEventHelper(ev, {
        start(ev, { originEl }) {
          if (isPortEl(originEl)) {
            emit('port-start', { ev, originEl, vm })
          } else {
            const currentPostion = (ioNodeEl.value?.getBoundingClientRect() as DOMRect)
            // clickedRelativePosition.value = [ev.pageX - currentPostion?.left, ev.pageY - currentPostion?.top]
            clickedRelativePosition.value = [ev.pageX - currentPostion?.left, ev.pageY - currentPostion?.top]

            console.log(clickedRelativePosition.value)
          }
        },
        move(ev, { originEl }) {
          if (isPortEl(originEl)) {
            emit('port-move', { ev, originEl, vm })
          } else {
            position.value = [ev.pageX - clickedRelativePosition.value[0], ev.pageY - clickedRelativePosition.value[1]] // clickedRelativePosition.value.concat()
            nextTick(() => {
              const currentPostion = (ioNodeEl.value?.getBoundingClientRect() as DOMRect)
              clickedRelativePosition.value = [ev.pageX - currentPostion?.left, ev.pageY - currentPostion?.top]
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

    return {
      fromPort,

      ioNodeEl,
      position,

      setFeAttrEls,

      handleNodeMousedown,
      handlePortMouseenter,
      fe
    }
  }
})
</script>

<style lang="scss" scoped>
.io-node {
  user-select: none;
  cursor: move;
  &__bg {
    stroke: #a0a0a0;
    stroke-width: 4px;
  }
  .fill-333 {
    fill: #333333;
  }
  .fill-fff {
    fill: #ffffff;
  }
  .module-name {
    font-size: 24px;
  }
  .port-name {
    font-size: 20px;
  }
  .port {
    fill: #333333;
    stroke-width: 4;
    cursor: grab;
    &.disabled {
      cursor: no-drop;
    }
  }
  .head {
    .port {
      stroke: #00f9f9;
    }
  }
  :not(.head) {
    .port {
      stroke: #ff7f00;
    }
  }
}

</style>
