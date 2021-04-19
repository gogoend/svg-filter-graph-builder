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
    <path class="ghost-line" />
    <io-node
      is="convolveMatrix"
      node-id="1"
      @port-start="handlePortStart"
      @port-move="handlePortMove"
      @port-connect="handlePortConnect"
      @port-cancel="handlePortCancel"
    />
    <io-node
      is="turbulence"
      node-id="2"
      @port-start="handlePortStart"
      @port-move="handlePortMove"
      @port-connect="handlePortConnect"
      @port-cancel="handlePortCancel"
    />
  </svg>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import IoNode from '@/components/IoNode/index.vue'

export default defineComponent({
  name: 'SvgCanvas',
  components: {
    IoNode
  },
  setup() {
    const linkedPath = ref([])

    const handlePortStart = (ev: MouseEvent) => {
      console.log(ev)
    }
    const handlePortMove = (ev: MouseEvent) => {
      console.log(ev)
    }
    const handlePortConnect = () => ({})
    const handlePortCancel = () => ({})

    return {
      linkedPath,
      handlePortStart,
      handlePortMove,
      handlePortConnect,
      handlePortCancel
    }
  }
})
</script>

<style lang="scss" scoped>
.draggable {
  cursor: grab;
}
</style>
