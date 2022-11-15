<template>
  <div
    class="stuff-config-panel"
  >
    <div class="stuff-config-panel__title-bar">
      <template v-if="focusingNode">
        👀 Editing - {{ focusingNode?.is }}
      </template>
      <template v-else>
        👈 Click a node, then configure it !
      </template>
    </div>
    <div class="stuff-config-panel__main">
      <div v-if="focusingNode">
        <form
          v-if="
            formFieldConfig
              &&
              Object.values(formFieldConfig.ports).some(it => [undefined, true].includes(it.showInConfigPanel))
          "
          @submit.prevent
        >
          <form-item
            v-for="(port, key) in formFieldConfig.ports"
            :key="key"
            :schema="port"
            :field-id="key"
            :style="{ marginBottom: '16px' }"
          ></form-item>
        </form>
        <div v-else>
          <h3>Opus! 🫢</h3>
          No field can be edit here.<br />
          Just look around the canvas, and create links between the available ports.
        </div>

      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, inject, unref, computed, watch } from 'vue'
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
        return null
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
  display: flex;
  flex-direction: column;

  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  user-select: none;
  &__title-bar {
    display: flex;
    align-items: center;
    background-color: #e8e8e8;
    padding-left: 0.5em;
    height: 28px;
    flex: 0 0 auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__main {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 10px 20px;
  }
}
</style>
