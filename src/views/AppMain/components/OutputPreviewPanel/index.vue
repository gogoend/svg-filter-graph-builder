<template>
  <div
    class="output-preview-panel"
    :ref="outputPreviewPanelRootEl"
  >
    <div class="output-preview-panel__menu-bar">
      <div
        class="output-preview-panel__drag-move-handler"
        v-move
      >
        <el-icon
          :size="24"
          color="#fff"><Rank /></el-icon>
      </div>
      <span class="output-preview-panel__menu-bar-text">Preview</span>
    </div>
    <div class="output-preview-panel__content">
      <filter-def
        filter-el-id="previewingFilter"
      />
      <div
        :style="{
          filter: `url(#previewingFilter)`
        }"
        class="output-preview-panel__image-wrap"
      >
        <img :src="sourceImageSrc" />
      </div>
      <div class="output-preview-panel__tools">
        <!--  -->
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import FilterDef from './components/FilterDef.vue'
import mouseEventHelper from '@/utils/mouse-event-helper'

export default defineComponent({
  name: 'OutputPreviewPanel',
  components: { FilterDef },
  directives: {
    move: {
      mounted(el) {
        el.__vDragMainElToBeDragged__ = document.querySelector('.output-preview-panel')
        const mouseStartHandler = (ev: MouseEvent) => mouseEventHelper(
          ev,
          {
            start(ev) {
              // 鼠标按下，记下此时坐标相对于当前元素的坐标
              // TODO: 或许应当是鼠标相对要被拖动的元素的坐标。此处当前元素恰好在要被拖动的元素的左上方
              /**
               * -------------------------
               * |       ^               |
               * |       |               |
               * |<------*               |
               * |        (x, y)         |
               * |                       |
               * -------------------------
               */
              const currentPosition = (el.getBoundingClientRect() as DOMRect)
              el.__vDragClickedRelativePosition__ = [
                ev.pageX - currentPosition?.left,
                ev.pageY - currentPosition?.top
              ]
            },
            move(ev) {
              // 鼠标移动，使用屏幕坐标减去按下时保存的相对坐标，再移动，即可得到正确的位置
              // 此时相对坐标不要重新算，因为鼠标移动距离与mousemove的触发时机没有关系
              const newPosition = [
                ev.pageX - el.__vDragClickedRelativePosition__[0],
                ev.pageY - el.__vDragClickedRelativePosition__[1]
              ]
              el.__vDragMainElToBeDragged__.style.left = newPosition[0] + 'px'
              el.__vDragMainElToBeDragged__.style.top = newPosition[1] + 'px'
            },
            up() {
              delete el.__vDragClickedRelativePosition__
            }
          }
        )
        el.addEventListener(
          'mousedown',
          mouseStartHandler
        )
        el.__vDragDispose__ = () => {
          delete el.__vDragDispose__
          delete el.__vDragMainElToBeDragged__
          el.removeEventListener(
            'mousedown',
            mouseStartHandler
          )
        }
      },
      unmounted(el) {
        el.__vDragDispose__()
      }
    }
  },
  setup() {
    const sourceImageSrc = ref('./demo/assets/rinkysplash.jpg')

    const outputPreviewPanelRootEl = ref()

    return {
      sourceImageSrc,
      outputPreviewPanelRootEl
    }
  }
})
</script>
<style lang="scss" scoped>
.output-preview-panel {
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 1;
  &__menu-bar {
    display: flex;
    width: 100%;
    height: 24px;
    background-color: #fbfbfb;
    z-index: 1;
  }
  &__menu-bar-text {
    line-height: 24px;
    margin-left: 0.5em;
  }
  &__drag-move-handler {
    background-color: #202020;
    width: 24px;
    height: 24px;
    cursor: move;
  }
  &__content {
    flex: 1 1 auto;
    position: relative;
  }
  &__image-wrap {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__tools {
    position: relative;
  }
}
</style>
