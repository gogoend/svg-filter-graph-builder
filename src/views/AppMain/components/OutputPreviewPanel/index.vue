<template>
  <div
    class="output-preview-panel"
  >
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
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import FilterDef from './components/FilterDef.vue'

export default defineComponent({
  name: 'OutputPreviewPanel',
  components: { FilterDef },
  setup() {
    const sourceImageSrc = ref('/demo/assets/rinkysplash.jpg')
    return {
      sourceImageSrc
    }
  }
})
</script>
<style lang="scss" scoped>
.output-preview-panel {
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  position: relative;
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
}
</style>
