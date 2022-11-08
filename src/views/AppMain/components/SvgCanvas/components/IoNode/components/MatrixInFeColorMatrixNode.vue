<template>
  <div>
    <input
      v-for="(_, index) in feAttrValue"
      :key="index"
      v-model="feAttrValue[index]"
      class="input"
    />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, h, PropType, readonly, ref, VNode } from 'vue'
import useIoNode from '../hooks/useIoNode'

import fe from '../fe-definition-config'

import type { RelativePathForNode } from '@/views/AppMain/components/SvgCanvas/type'
import { Dictionary } from '@/utils/type'
import { POINT_BORDER_W, POINT_R } from '@/config/ui'

export default defineComponent({
  name: 'SourceNode',
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
  setup(props) {
    const {
      fromPort,
      ioNodeEl,
      setFeAttrEls,
      handlePortMouseenter,
      filterThumbUrl
    } = useIoNode()

    const feAttrValue = ref<number[]>(
      (() => {
        const arr = new Array(20)

        arr.fill(0)
        arr[0] = arr[6] = arr[12] = arr[18] = 1

        return arr
      })()
    )

    const mergedFeAttrValue = computed(
      () => ({
        result: feAttrValue.value.join(' ')
      })
    )

    // FIXME: 此处节点应该只用于缩略图预览，不应出现在最终结果中
    const getVNodeFragment = (): VNode => {
      return h('feOffset', {
        in: 'SourceGraphic'
      })
    }

    return {
      POINT_R,
      POINT_BORDER_W,

      fromPort,

      ioNodeEl,

      setFeAttrEls,

      feAttrValue,
      mergedFeAttrValue,

      handlePortMouseenter,

      filterThumbUrl,
      getVNodeFragment
    }
  }
})
</script>

<style lang="scss" scoped>
  @import url('../styles/public.scss');
  .input {
    width: 20%;
    box-sizing: border-box;
  }
</style>
