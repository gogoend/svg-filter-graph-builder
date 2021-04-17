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
    <circle
      class="draggable start node"
      style="fill: #ff7f00"
      cx="800"
      cy="300"
      r="50"
    />
    <circle
      class="draggable end node"
      style="fill: #00f9f9"
      cx="1000"
      cy="400"
      r="50"
    />
    <path
      id="path"
      style="
        pointer-events: none;
        fill: none;
        stroke: #69b84a;
        stroke-width: 5;
        stroke-miterlimit: 10;
      "
      d="
      M
      850,300
      C
      1000,300,
      800,400,
      950,400
    "
    />
  </svg>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SvgCanvas",
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.draggable {
  cursor: grab;
}
</style>
