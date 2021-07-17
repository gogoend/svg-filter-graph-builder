<template>
  <g
    class="linked-path"
    :class="{ 'linked-path__focused': focused }"
    @focus="focused = true"
    @blur="focused = false"
  >
    <path
      class="linked-path-path"
      :class="{ 'linked-path__focused-path': focused }"
      :d="pathD"
      @click="handlePathClick"
      ref="pathRef"
    />
    <g
      class="linked-path-tools"
      v-if="focused">
      <circle
        r="10"
        :cx="p[0]"
        :cy="p[1]"
        title="移除连线"
        class="remove"
        @click="$emit('remove', pathId)"
      />
    </g>
  </g>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'

import IoNode from '../IoNode/index.vue'

export default defineComponent({
  name: 'IoPath',
  props: {
    pathDArguments: {
      type: Array as PropType<number[]>,
      required: true
    },
    pathId: {
      type: String,
      required: true
    },
    from: {
      type: Object as PropType<InstanceType<typeof IoNode>>,
      required: true
    },
    to: {
      type: Object as PropType<InstanceType<typeof IoNode>>,
      required: true
    }
  },
  setup(props) {
    const pathD = computed(() => {
      const dArgs = props.pathDArguments
      return `
M ${dArgs[0]}, ${dArgs[1]}
C ${dArgs[2]}, ${dArgs[3]}, ${dArgs[4]}, ${dArgs[5]}, ${dArgs[6]}, ${dArgs[7]}`
    })
    const pathRef = ref<SVGPathElement|null>(null)

    const focused = ref(false)
    const p = computed(() => {
      void pathD.value
      void focused.value
      const { x, y } = pathRef.value?.getPointAtLength(pathRef.value?.getTotalLength() / 2) || { x: 0, y: 0 }
      return [x, y]
    })

    const handlePathClick = (ev: MouseEvent) => {
      console.log(ev)
    }

    const handlePathBlur = (ev: Event) => {
      console.log(ev)
    }
    return {
      focused,
      pathRef,
      pathD,
      p,
      handlePathClick,
      handlePathBlur
    }
  }
})
</script>

<style lang="scss" scoped>
@keyframes focus-dash-move {
  0% {
    stroke-dashoffset: 0px;
  }
  100% {
    stroke-dashoffset: -16px;
  }
}
@keyframes focus-flash {
  0% {
    stroke: #69b84a;
  }
  100% {
    stroke: #09ff00;
  }
}
.linked-path {
  &-path {
    fill: none;
    stroke: #69b84a;
    stroke-width: 4px;
    cursor: move;
    will-change: stroke-dashoffset, stroke;
  }
  &-tools {
    cursor: pointer;
    .remove {
      fill: #dd3322
    }
  }
}
.linked-path__focused {
  outline: none;
  &-path {
    stroke-dasharray: 8px;
    animation: focus-dash-move 0.5s linear infinite, focus-flash 1s linear infinite alternate;
  }
}
</style>
