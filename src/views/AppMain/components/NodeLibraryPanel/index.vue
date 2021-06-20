<template>
  <div class="node-library-panel">
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
import { computed, defineComponent, nextTick } from 'vue'
import mouseEventHelper from '@/utils/mouse-event-helper'
import { useStore } from 'vuex'
import { uuid } from '@/utils/uuid'

import fe from '@/views/AppMain/components/SvgCanvas/components/IoNode/fe-definition-config'

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
    const store = useStore()

    const ghostNodeRef = computed(() => store.state.ghostNodeRef)
    const handleIconMousedown = function(ev: MouseEvent, icon: any) {
      mouseEventHelper(ev, {
        start(ev, { originEl }) {
          store.commit('SET_DRAGGING_NODE_ICON', icon.title)
          nextTick(() => ghostNodeRef.value.$emit('update:position', [ev.clientX - 80, ev.clientY]))
        },
        move(ev, { originEl }) {
          console.log(ghostNodeRef.value)
          ghostNodeRef.value.$emit('update:position', [ev.clientX - 80, ev.clientY])
          void 0
        },
        up(ev, { originEl }) {
          store.commit('ADD_NODE', {
            is: icon.title,
            id: uuid(),
            position: [ev.clientX - 80, ev.clientY]
          })
          store.commit('SET_DRAGGING_NODE_ICON', null)
          void 0
        }
      })
    }
    return {
      handleIconMousedown,
      menuGroup
    }
  }
})
</script>
<style lang="scss" scoped>
.node-library-panel {
  position: fixed;
  height: 100vh;
  top: 0;
  width: 80px;
  overflow: hidden;
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
