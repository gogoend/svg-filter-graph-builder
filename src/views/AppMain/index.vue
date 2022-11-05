<template>
  <div class="app-wrap">
    <svg-canvas
      class="svg-canvas"
      :style="{
        left: filterLibraryPanelWidth + 'px',
        width: `calc(100% - ${stuffConfigPanelWidth}px - ${filterLibraryPanelWidth}px)`
      }"
    />
    <node-library-panel
      class="node-library-panel"
      :style="{
        left: 0,
        right: `calc(100% - ${filterLibraryPanelWidth}px)`
      }"
    />
    <stuff-config-panel
      class="stuff-config-panel"
      :style="{
        right: 0,
        left: `calc(100% - ${stuffConfigPanelWidth}px)`
      }"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SvgCanvas from './components/SvgCanvas/index.vue'
import NodeLibraryPanel from './components/NodeLibraryPanel/index.vue'
import StuffConfigPanel from './components/StuffConfigPanel/index.vue'
import { filterLibraryPanelWidth, stuffConfigPanelWidth } from '@/config/ui'

export default defineComponent({
  name: 'AppMain',
  components: {
    SvgCanvas,
    NodeLibraryPanel,
    StuffConfigPanel
  },
  setup() {
    return {
      filterLibraryPanelWidth,
      stuffConfigPanelWidth
    }
  }
})
</script>

<style lang="scss" scoped>
.app-wrap {
  overflow: hidden;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .svg-canvas {
    overflow: auto;
    position: absolute;
    top: 0;
    bottom: 0;
  }
  .node-library-panel {
    position: absolute;
    top: 0;
    bottom: 0;
    overflow: auto;
  }
  .stuff-config-panel {
    position: absolute;
    top: 0;
    bottom: 0;
    overflow: auto;
  }
}
</style>
