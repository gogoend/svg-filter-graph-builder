<template>
  <div class="app-wrap">
    <div
      class="svg-canvas-wrap"
      :style="{
        left: filterLibraryPanelWidth + 'px'
      }"
    >
      <svg-canvas />
    </div>
    <node-library-panel />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SvgCanvas from './components/SvgCanvas/index.vue'
import NodeLibraryPanel from './components/NodeLibraryPanel/index.vue'
import { filterLibraryPanelWidth } from '@/config/ui'

export default defineComponent({
  name: 'AppMain',
  components: { SvgCanvas, NodeLibraryPanel },
  setup() {
    return {
      filterLibraryPanelWidth
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
  .svg-canvas-wrap {
    overflow: auto;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
