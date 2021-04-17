<template>
  <div class="app-wrap">
    <svg-canvas />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import SvgCanvas from './components/SvgCanvas/index.vue'

export default defineComponent({
  components: { SvgCanvas },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
</style>
