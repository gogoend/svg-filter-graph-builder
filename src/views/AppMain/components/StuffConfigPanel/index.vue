<template>
  <div
    class="stuff-config-panel"
    :style="{width: stuffConfigPanelWidth+'px'}"
  >
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, inject } from 'vue'
import { stuffConfigPanelWidth } from '@/config/ui'
import { uuid } from '@/utils/uuid'

import fe from '@/views/AppMain/components/SvgCanvas/components/IoNode/fe-definition-config'

export default defineComponent({
  name: 'StuffConfigPanel',
  setup(props, { emit }) {
    return {
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
