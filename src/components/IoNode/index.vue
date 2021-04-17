<template>
  <g class="io-node">
    <rect
      x="11.9"
      class="fill-333"
      width="265.1"
      height="377" />
    <g class="head">
      <circle
        class="port"
        cx="275.1"
        cy="18.4"
        r="10" />
      <text
        transform="matrix(1 0 0 1 28.1733 28.3989)"
        class="fill-fff module-name">feConvolveMatrix</text>
    </g>
    <g>
      <circle
        class="port"
        cx="10"
        cy="60.3"
        r="10"
      />
      <text
        transform="matrix(1 0 0 1 28.1733 70.6196)"
        class="fill-fff port-name">in</text>
    </g>
    <g>
      <circle
        class="port"
        cx="10"
        cy="92.8"
        r="10"/>
      <text
        transform="matrix(1 0 0 1 28.1733 103.1572)"
        class="fill-fff port-name">order</text>
    </g>
    <g>
      <circle
        class="port"
        cx="10"
        cy="125.4"
        r="10"/>
      <text
        transform="matrix(1 0 0 1 28.1733 135.6953)"
        class="fill-fff port-name">kernelMatrix</text>
    </g>
    <g>
      <circle
        class="port"
        cx="10"
        cy="157.9"
        r="10"/>
      <text
        transform="matrix(1 0 0 1 28.1733 168.2329)"
        class="fill-fff port-name">divisor</text>
    </g>
    <g>
      <circle
        class="port"
        cx="10"
        cy="190.4"
        r="10"/>
      <text
        transform="matrix(1 0 0 1 28.1733 200.77)"
        class="fill-fff port-name">bias</text>
    </g>
    <g>
      <circle
        class="port"
        cx="10"
        cy="223"
        r="10"/>
      <text
        transform="matrix(1 0 0 1 28.1733 233.3086)"
        class="fill-fff port-name">targetX</text>
    </g>
    <g>
      <circle
        class="port"
        cx="10"
        cy="255.3"
        r="10"/>
      <text
        transform="matrix(1 0 0 1 28.1733 265.6787)"
        class="fill-fff port-name">targetY</text>
    </g>
    <g>
      <circle
        class="port"
        cx="10"
        cy="287.7"
        r="10"/>
      <text
        transform="matrix(1 0 0 1 28.1733 298.0464)"
        class="fill-fff port-name">edgeMode</text>
    </g>
    <g>
      <circle
        class="port"
        cx="10"
        cy="320.1"
        r="10"/>
      <text
        transform="matrix(1 0 0 1 28.1733 330.4165)"
        class="fill-fff port-name">kernelUnitLength</text>
    </g>
    <g>
      <circle
        class="port"
        cx="10"
        cy="352.4"
        r="10"/>
      <text
        transform="matrix(1 0 0 1 28.1733 362.7852)"
        class="fill-fff port-name">preserveAlpha</text>
    </g>
  </g>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IoNode',
  setup() {
    return {}
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
