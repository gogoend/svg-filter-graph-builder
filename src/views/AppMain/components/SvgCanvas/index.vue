<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 1920 1080"
    style="enable-background: new 0 0 1920 1080; width: 1920px; height: 1080px"
    xml:space="preserve"
  >
    <io-node />
  </svg>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import IoNode from '@/components/IoNode/index.vue'

export default defineComponent({
  name: 'SvgCanvas',
  components: {
    IoNode
  },
  setup() {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.draggable {
  cursor: grab;
}
</style>
