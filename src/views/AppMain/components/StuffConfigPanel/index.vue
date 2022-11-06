<template>
  <div
    class="stuff-config-panel"
    :style="{width: stuffConfigPanelWidth+'px'}"
  >
    {{ formForUserFill }}
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, inject, unref, computed } from 'vue'
import { stuffConfigPanelWidth } from '@/config/ui'
import { uuid } from '@/utils/uuid'

import fe from '@/views/AppMain/components/SvgCanvas/components/IoNode/fe-definition-config'
import { FOCUSING_NODE_SYMBOL } from '@/store/focusState'

export default defineComponent({
  name: 'StuffConfigPanel',
  setup(props, { emit }) {
    const [focusingNode] = inject(FOCUSING_NODE_SYMBOL)!
    const formForUserFill = computed(() => {
      return unref(focusingNode)?.nodeConfigRef.mergedFeAttrValue ?? {}
    })

    return {
      formForUserFill,
      focusingNode,
      stuffConfigPanelWidth
    }
  }
})
</script>
<style lang="scss" scoped>
.stuff-config-panel {
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  user-select: none;
}
</style>
