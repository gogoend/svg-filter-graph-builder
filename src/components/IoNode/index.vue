<template>
  <g class="io-node">
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
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IoNode',
  setup() {
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
