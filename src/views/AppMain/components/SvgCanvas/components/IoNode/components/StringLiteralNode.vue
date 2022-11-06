<template>
  <input v-model.lazy="feAttrValue.value" />
</template>
<script lang="ts">
import { computed, defineComponent, h, PropType, readonly, ref, unref, VNode } from 'vue'
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

    const feAttrValue = ref<Dictionary<string | number>>({
      value: ''
    })

    const mergedFeAttrValue = computed<Dictionary<string | number>>(() => {
      return {
        result: unref(feAttrValue).value
      }
    })

    // FIXME: 此处节点应该只用于缩略图预览，不应出现在最终结果中
    const getVNodeFragment = (): VNode => {
      return h('feOffset', {})
    }

    return {
      POINT_R,
      POINT_BORDER_W,

      fromPort,

      ioNodeEl,

      setFeAttrEls,
      mergedFeAttrValue,

      handlePortMouseenter,

      filterThumbUrl,
      getVNodeFragment,

      feAttrValue
    }
  }
})
</script>

<style lang="scss" scoped>
  @import url('../styles/public.scss');
</style>
