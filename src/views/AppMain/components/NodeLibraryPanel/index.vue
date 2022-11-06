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
        >
          {{ icon.title }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, inject } from 'vue'
import mouseEventHelper from '@/utils/mouse-event-helper'
import { uuid } from '@/utils/uuid'

import fe from '@/views/AppMain/components/SvgCanvas/components/IoNode/fe-definition-config'
import { filterLibraryPanelWidth } from '@/config/ui'

import { DRAGGING_NODE_ICON_SYMBOL, GHOST_NODE_REF_SYMBOL } from '@/store/draggingNode'
import { ADD_NODES_SYMBOL } from '@/store/canvasStuff'

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
    const ghostNodeRef = inject(GHOST_NODE_REF_SYMBOL)!
    const draggingNodeIcon = inject(DRAGGING_NODE_ICON_SYMBOL)!
    const addNodes = inject(ADD_NODES_SYMBOL)!

    const handleIconMousedown = function(ev: MouseEvent, icon: any) {
      mouseEventHelper(ev, {
        start(ev, { originEl }) {
          draggingNodeIcon.value = icon.title
          nextTick(() => ghostNodeRef.value!.$emit('update:position', [ev.clientX - filterLibraryPanelWidth, ev.clientY]))
        },
        move(ev, { originEl }) {
          console.log(ghostNodeRef.value)
          ghostNodeRef.value!.$emit('update:position', [ev.clientX - filterLibraryPanelWidth, ev.clientY])
          void 0
        },
        up(ev, { originEl }) {
          addNodes({
            is: icon.title,
            id: uuid(),
            position: [ev.clientX - filterLibraryPanelWidth, ev.clientY]
          })
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
