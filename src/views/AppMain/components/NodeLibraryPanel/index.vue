<template>
  <div class="node-library-panel">
    <ul class="menu-list">
      <li draggable>feImage</li>
      <li draggable>feMerge</li>
      <li draggable>feColorMatrix</li>
      <li draggable>feTurbulence</li>
    </ul>
    <ul class="menu-list">
      <li draggable>feDisplacementMap</li>
      <li draggable>feConvolveMatrix</li>
    </ul>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'NodeLibraryPanel',
  setup(props, { emit }) {
    return {

    }
  }
})
</script>
<style lang="scss" scoped>
.node-library-panel {
  ul.menu-list {
    li {
    }
  }
}
</style>
