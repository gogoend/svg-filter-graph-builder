<template>
  <div class="app-wrap">
    <top-menu-bar
      class="top-menu-bar"
      :style="{
        height: `${topMenuBarHeight}px`
      }"
    />
    <div
      class="workbench-wrap"
      :style="{
        top: `${topMenuBarHeight}px`
      }"
    >
      <svg-canvas
        class="svg-canvas"
        :style="{
          left: filterLibraryPanelWidth + 'px',
          width: `calc(100% - ${stuffConfigPanelWidth}px - ${filterLibraryPanelWidth}px)`
        }"
        @vnode-mounted="(vnode) => {
          setSvgCanvasVm(vnode.component.proxy)
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
      <output-preview-panel
        class="output-preview-panel"
        :style="{
          width: '640px',
          height: '384px',
          bottom: '0px',
          right: '0px',
        }"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject } from 'vue'
import SvgCanvas from './components/SvgCanvas/index.vue'
import NodeLibraryPanel from './components/NodeLibraryPanel/index.vue'
import StuffConfigPanel from './components/StuffConfigPanel/index.vue'
import OutputPreviewPanel from './components/OutputPreviewPanel/index.vue'
import TopMenuBar from './components/TopMenuBar.vue'
import { filterLibraryPanelWidth, stuffConfigPanelWidth } from '@/config/ui'
import { topMenuBarHeight } from '../../config/ui'
import { SET_SVG_CANVAS_VM_SYMBOL } from '@/store/vmStore'

export default defineComponent({
  name: 'AppMain',
  components: {
    TopMenuBar,
    SvgCanvas,
    NodeLibraryPanel,
    StuffConfigPanel,
    OutputPreviewPanel
  },
  setup() {
    const setSvgCanvasVm = inject(SET_SVG_CANVAS_VM_SYMBOL)!
    return {
      setSvgCanvasVm,

      filterLibraryPanelWidth,
      stuffConfigPanelWidth,
      topMenuBarHeight
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
  .top-menu-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
  .workbench-wrap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
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
    .output-preview-panel {
      position: fixed;
    }
  }
}
</style>
