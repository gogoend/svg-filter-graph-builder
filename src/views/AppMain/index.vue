<template>
  <div class="app-wrap">
    <svg-canvas />
    <node-library-panel />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SvgCanvas from './components/SvgCanvas/index.vue'
import NodeLibraryPanel from './components/NodeLibraryPanel/index.vue'

export default defineComponent({
  components: { SvgCanvas, NodeLibraryPanel },
  setup() {
    return {}
  }
})
</script>

<style lang="scss" scoped>
</style>
