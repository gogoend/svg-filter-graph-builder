<template>
  <div
    class="menu-bar"
  >
    <div
      :style="{
        textAlign: 'left'
      }"
    ></div>
    <div
      :style="{
        textAlign: 'center'
      }">SVG 滤镜编排工具</div>
    <div
      :style="{
        textAlign: 'right'
      }"
    >
      <a
        target="_blank"
        href="https://github.com/gogoend/svg-filter-graph-builder"
      >GitHub</a>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits({})
</script>
<style lang="scss" scoped>
.menu-bar {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background-color: #eee;
}
</style>
