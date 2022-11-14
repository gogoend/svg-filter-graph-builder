<template>
  <div
    class="output-preview-panel"
  >
    <div class="output-preview-panel__menu-bar">
      <div class="output-preview-panel__drag-move-handler">
        <el-icon :size="24" color="#fff"><Rank /></el-icon>
      </div>
      <span class="output-preview-panel__menu-bar-text">Preview</span>
    </div>
    <div class="output-preview-panel__content">
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
        <!--  -->
      </div>
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
    const sourceImageSrc = ref('./demo/assets/rinkysplash.jpg')

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
  display: flex;
  flex-direction: column;
  &__menu-bar {
    display: flex;
    width: 100%;
    height: 24px;
    background-color: #fbfbfb;
    z-index: 1;
  }
  &__menu-bar-text {
    line-height: 24px;
    margin-left: 0.5em;
  }
  &__drag-move-handler {
    background-color: #202020;
    width: 24px;
    height: 24px;
    cursor: move;
  }
  &__content {
    flex: 1 1 auto;
    position: relative;
  }
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
