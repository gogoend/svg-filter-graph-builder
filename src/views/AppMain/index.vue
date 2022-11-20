<template>
  <div class="app-wrap">
    <ping-ping />
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
        }"
        @vnode-mounted="handleOutputPreviewPanelMounted"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject, onMounted, VNodeProps } from 'vue'
import SvgCanvas from './components/SvgCanvas/index.vue'
import NodeLibraryPanel from './components/NodeLibraryPanel/index.vue'
import StuffConfigPanel from './components/StuffConfigPanel/index.vue'
import OutputPreviewPanel from './components/OutputPreviewPanel/index.vue'
import TopMenuBar from './components/TopMenuBar.vue'
import PingPing from './components/PingPing.vue'
import { filterLibraryPanelWidth, stuffConfigPanelWidth } from '@/config/ui'
import { topMenuBarHeight } from '../../config/ui'
import { SET_SVG_CANVAS_VM_SYMBOL } from '@/store/vmStore'
import log from '@/plugins/log'

export default defineComponent({
  name: 'AppMain',
  components: {
    TopMenuBar,
    SvgCanvas,
    NodeLibraryPanel,
    StuffConfigPanel,
    OutputPreviewPanel,
    PingPing
  },
  setup() {
    const setSvgCanvasVm = inject(SET_SVG_CANVAS_VM_SYMBOL)!

    /**
     * 用于初始化OutputPreviewPanel的位置。之后如有可能，建议从 IndexedDB 用户偏好设置存储的值中获取。
     */
    const handleOutputPreviewPanelMounted: VNodeProps['onVnodeMounted'] = ({ el }) => {
      const outputPreviewPanelRect = (el! as HTMLElement).getBoundingClientRect()

      el!.style.left = `${window.innerWidth - outputPreviewPanelRect.width}px`
      el!.style.top = `${window.innerHeight - outputPreviewPanelRect.height}px`
    }

    onMounted(() => {
      log.log('[Hello] 用户界面已加载', [window.__sfgb_runtime_config__, navigator.userAgent])
    })

    return {
      setSvgCanvasVm,
      handleOutputPreviewPanelMounted,

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
