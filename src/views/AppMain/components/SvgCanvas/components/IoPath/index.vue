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
      :style="{ strokeWidth: `${PATH_STROKE_W}px` }"
      :d="pathD"
      @click="handlePathClick"
      ref="pathRef"
    />
    <foreignObject
      v-if="focused"
      :transform="`translate(
        ${p[0]},
        ${p[1]}
      )`"
      style="overflow: visible;"
    >
      <div
        class="linked-path__toolbox"
        xmlns="http://www.w3.org/1999/xhtml"
      >
        <button
          class="linked-path__toolbox-button"
          is="ui-button"
          @click="$emit('remove', pathId)"
          title="Remove Link"
          data-type="danger"
        >
          <el-icon><Delete /></el-icon>
        </button>
      </div>
    </foreignObject>
    <!-- <circle
        r="10"
        title="移除连线"
        class="remove"
      /> -->
  </g>
</template>

<script lang="ts">
import { PATH_STROKE_W } from '@/config/ui'
import { computed, defineComponent, PropType, ref } from 'vue'

import { OverwrittenIoNodeType } from '../../type'

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
      type: Object as PropType<OverwrittenIoNodeType>,
      required: true
    },
    to: {
      type: Object as PropType<OverwrittenIoNodeType>,
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
      PATH_STROKE_W,

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
  &__toolbox {
    cursor: pointer;
    width: fit-content;
    transform: translate(-50%, -50%);
    display: flex;
    // TODO: 为何即使设置padding:0、line-height:1，按钮高度还是14px而非16px？
    &-button[is=ui-button] {
      padding: 4px;
      min-width: unset;
      border: 0;
      line-height: 1;
      ::v-deep(.el-icon) {
        display: flex;
      }
      & + .linked-path__toolbox-button[is=ui-button] {
        margin-left: 0.5em
      }
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
