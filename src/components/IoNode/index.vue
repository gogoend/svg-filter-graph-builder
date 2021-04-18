<template>
  <g
    class="io-node"
    @mousedown="handleNodeMousedown"
    :transform="`translate(${position[0]}, ${position[1]})`"
    ref="ioNodeEl"
  >
    <rect
      x="11.9"
      class="fill-333"
      width="265"
      :height="12+35*(Object.keys(convolveMatrixOptions).length+1)" />
    <g
      class="head"
      transform="matrix(1 0 0 1 28 24)">
      <circle
        class="port"
        r="10"
        cx="250"
      />
      <text
        transform="matrix(1 0 0 1 0 8)"
        class="fill-fff module-name">feConvolveMatrix</text>
    </g>
    <g
      v-for="(item, key, index) in convolveMatrixOptions"
      :key="key"
      :transform="`matrix(1 0 0 1 10 ${60 + 35 * index})`">
      <circle
        class="port"
        r="10"
      />
      <text
        transform="matrix(1 0 0 1 16 8)"
        class="fill-fff port-name">{{ key }}</text>
    </g>

  </g>
</template>
<script lang="ts">
import { defineComponent, nextTick, ref } from 'vue'
import mouseEventHelper from '@/utils/mouse-event-helper'

export default defineComponent({
  name: 'IoNode',
  setup() {
    const ioNodeEl = ref<SVGGElement>()
    const position = ref([0, 0])
    const clickedRelativePosition = ref([0, 0])

    const handleNodeMousedown = function(ev: MouseEvent) {
      mouseEventHelper(ev, {
        start(ev) {
          const currentPostion = (ioNodeEl.value?.getBoundingClientRect() as DOMRect)
          // clickedRelativePosition.value = [ev.pageX - currentPostion?.left, ev.pageY - currentPostion?.top]
          clickedRelativePosition.value = [ev.pageX - currentPostion?.left, ev.pageY - currentPostion?.top]

          console.log(clickedRelativePosition.value)
        },
        move(ev, { originEl }) {
          if (originEl.classList.contains('port')) {
            void 0
          } else {
          // const currentPostion = (ioNodeEl.value?.getBoundingClientRect() as DOMRect)
          //   console.log(
          //     `${ev.clientX - (currentPostion?.left || 0)} ${ev.clientY - (currentPostion?.top || 0)}\n`,
          //     `${position.value[0]} ${position.value[1]}`
          //   )
          // clickedRelativePosition.value = [ev.pageX - clickedRelativePosition.value[0], ev.pageY - clickedRelativePosition.value[1]]

            position.value = [ev.pageX - clickedRelativePosition.value[0], ev.pageY - clickedRelativePosition.value[1]] // clickedRelativePosition.value.concat()
            nextTick(() => {
              const currentPostion = (ioNodeEl.value?.getBoundingClientRect() as DOMRect)
              clickedRelativePosition.value = [ev.pageX - currentPostion?.left, ev.pageY - currentPostion?.top]

            // clickedRelativePosition.value = [ev.pageX - currentPostion?.left, ev.pageY - currentPostion?.top]
            })
          //   // position.value = [ev.clientX - position.value[0], ev.clientY - position.value[1]]
          //   // position.value = [ev.clientX - 100, ev.clientY - 100]
          }
        },
        up() {
          clickedRelativePosition.value = [0, 0]
        }

      })
    }

    const convolveMatrixOptions = {
      in: {},
      order: {},
      kernelMatrix: {},
      divisor: {},
      bias: {},
      targetX: {},
      targetY: {},
      edgeMode: {},
      kernelUnitLength: {},
      preserveAlpha: {}
    }
    return {
      ioNodeEl,
      position,
      handleNodeMousedown,
      convolveMatrixOptions
    }
  }
})
</script>

<style lang="scss" scoped>
.io-node {
  user-select: none;
  cursor: move;
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
