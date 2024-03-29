<template>
  <div
    class="node-library-panel"
  >
    <div
      v-for="(group, index) in menuGroup"
      :key="index">
      <h4>{{ menuGroup.title }}</h4>
      <ul class="menu-list">
        <li
          v-for="(icon, index) in group.children"
          :key="index"
          @mousedown="(ev) => handleIconMousedown(ev, icon)"
          v-pingping="{remark: `[node-library-panel] ${icon.title} 节点开始拖拽`}"
        >
          {{ icon.title }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, inject, computed } from 'vue'
import mouseEventHelper from '@/utils/mouse-event-helper'
import { uuid } from '@/utils/uuid'

import fe from '@/views/AppMain/components/SvgCanvas/components/IoNode/fe-definition-config'
import { filterLibraryPanelWidth } from '@/config/ui'

import { DRAGGING_NODE_ICON_SYMBOL, GHOST_NODE_REF_SYMBOL } from '@/store/draggingNode'
import { ADD_NODE_SYMBOL } from '@/store/canvasStuff'
import { SVG_CANVAS_VM_SYMBOL } from '@/store/vmStore'
import gogoendLog from '@/plugins/log'
import log from '@/plugins/log'

const menuGroup = [
  {
    title: '组1',
    children: Object.keys(fe).map(item => ({
      title: item
    }))
  }
]

export default defineComponent({
  name: 'NodeLibraryPanel',
  setup(props, { emit }) {
    const svgCanvasVm = inject(SVG_CANVAS_VM_SYMBOL)!
    const svgCanvasRect = computed(() => {
      return svgCanvasVm.value.svgCanvasRect
    })

    const ghostNodeRef = inject(GHOST_NODE_REF_SYMBOL)!
    const draggingNodeIcon = inject(DRAGGING_NODE_ICON_SYMBOL)!
    const addNode = inject(ADD_NODE_SYMBOL)!

    const handleIconMousedown = function(ev: MouseEvent, icon: any) {
      mouseEventHelper(ev, {
        start(ev, { originEl }) {
          draggingNodeIcon.value = icon.title
          nextTick(
            () => ghostNodeRef.value!.$emit(
              'update:position',
              [ev.clientX + svgCanvasVm.value.$el.scrollLeft - svgCanvasRect.value.left, ev.clientY + svgCanvasVm.value.$el.scrollTop - svgCanvasRect.value.top]
            )
          )
        },
        move(ev, { originEl }) {
          gogoendLog.debug(ghostNodeRef.value)
          ghostNodeRef.value!.$emit(
            'update:position',
            [ev.clientX + svgCanvasVm.value.$el.scrollLeft - svgCanvasRect.value.left, ev.clientY + svgCanvasVm.value.$el.scrollTop - svgCanvasRect.value.top]
          )
          void 0
        },
        up(ev, { originEl }) {
          const svgCanvasVmElRect = (svgCanvasVm.value?.$el as HTMLElement).getBoundingClientRect()
          // TODO: 如何判断一个点有没有在矩形范围内？
          if (
            ev.clientX > svgCanvasVmElRect.x &&
            ev.clientX < svgCanvasVmElRect.x + svgCanvasVmElRect.width &&
            ev.clientY > svgCanvasVmElRect.y &&
            ev.clientY < svgCanvasVmElRect.y + svgCanvasVmElRect.height
          ) {
            addNode({
              is: icon.title,
              id: uuid(),
              position: [ev.clientX + svgCanvasVm.value.$el.scrollLeft - svgCanvasRect.value.left, ev.clientY + svgCanvasVm.value.$el.scrollTop - svgCanvasRect.value.top]
            })
            log.log(`[node-library-panel] ${icon.title} 节点已被放置到canvas上`)
          } else {
            log.log(`[node-library-panel] ${icon.title} 节点的创建过程已取消`)
          }
          draggingNodeIcon.value = null
          void 0
        }
      })
    }
    return {
      handleIconMousedown,
      menuGroup,
      filterLibraryPanelWidth
    }
  }
})
</script>
<style lang="scss" scoped>
.node-library-panel {
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  user-select: none;
  ul.menu-list {
    padding-inline-start: 0;
    li {
    }
  }
}
</style>
