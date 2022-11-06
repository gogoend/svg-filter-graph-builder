<template>
  <div
    class="stuff-config-panel"
    :style="{width: stuffConfigPanelWidth+'px'}"
  >
    <form is="ui-form">
      <form-item
        v-for="(port, key) in formFieldConfig.ports"
        :key="key"
        :schema="port"
        :field-id="key"
      ></form-item>
    </form>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, inject, unref, computed } from 'vue'
import { stuffConfigPanelWidth } from '@/config/ui'
import { uuid } from '@/utils/uuid'

import fe from '@/views/AppMain/components/SvgCanvas/components/IoNode/fe-definition-config'
import { FOCUSING_NODE_SYMBOL } from '@/store/focusState'

import FormItem from './components/FormItem.vue'

export default defineComponent({
  name: 'StuffConfigPanel',
  components: { FormItem },
  setup(props, { emit }) {
    const [focusingNode] = inject(FOCUSING_NODE_SYMBOL)!

    const formFieldConfig = computed(() => {
      if (
        unref(focusingNode) && unref(focusingNode)?.is
      ) {
        return fe[unref(focusingNode)!.is]
      } else {
        return {}
      }
    })

    return {
      stuffConfigPanelWidth,

      focusingNode,
      formFieldConfig
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
