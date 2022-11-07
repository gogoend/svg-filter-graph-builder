<template>
  <div
    class="output-preview-panel"
  >
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, inject, unref, computed } from 'vue'

export default defineComponent({
  name: 'OutputPreviewPanel',
  components: { },
  setup(props, { emit }) {
    return {
    }
  }
})
</script>
<style lang="scss" scoped>
.output-preview-panel {
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
}
</style>
