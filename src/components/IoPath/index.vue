<template>
  <path
    class="linked-path"
    :d="pathD" />
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
  setup(props, { emit }) {
    const pathD = computed(() => {
      const dArgs = props.pathDArguments
      return `
M ${dArgs[0]}, ${dArgs[1]}
C ${dArgs[2]}, ${dArgs[3]}, ${dArgs[4]}, ${dArgs[5]}, ${dArgs[6]}, ${dArgs[7]}`
    })
    return {
      pathD
    }
  }
})
</script>

<style lang="scss" scoped>
.linked-path {
  fill: none;
  stroke: #69b84a;
  stroke-width: 4px;
}
</style>
