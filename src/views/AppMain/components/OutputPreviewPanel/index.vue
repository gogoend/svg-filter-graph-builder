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
    <div class="output-preview-panel__tools">
      <button @click="saveFilter">保存滤镜</button>
    </div>
  </div>
</template>
<script lang="ts">
import { SAVE_FILTER_SYMBOL } from '@/store/canvasStuff'
import { defineComponent, inject, ref } from 'vue'
import FilterDef from './components/FilterDef.vue'

export default defineComponent({
  name: 'OutputPreviewPanel',
  components: { FilterDef },
  setup() {
    const sourceImageSrc = ref('./demo/assets/rinkysplash.jpg')
    const saveFilter = inject(SAVE_FILTER_SYMBOL)!

    return {
      sourceImageSrc,
      saveFilter
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
  &__tools {
    position: relative;
  }
}
</style>
