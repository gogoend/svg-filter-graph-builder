<template>
  <div
    class="svg-canvas__overlay-tip"
    v-if="Object.keys(nodes).length === 0"
  >
    <h1 :style="{
      fontSize: '2em'
    }">🥴 Embarrassed! No nodes here.</h1>
    <p :style="{
      fontSize: '1.5em'
    }">
      👈
      <br />
      To add a node,
      please <strong>drag</strong> a node definition from the left panel,
      <br />
      then drop it HERE.
    </p>
    {{ currentProject }}
    <div
      v-if="!currentProject"
      :style="{
        fontSize: '1.5em'
      }"
    >
      Are your new here? you can
      <a
        href="javascript:;"
        @click.prevent="tryToOpenSampleProject(samples[0].id)"
        data-type="primary"
      >open the sample project</a>
      and see how does the app work.
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ALL_NODES_ON_CANVAS_SYMBOL } from '@/store/canvasStuff'
import { CURRENT_PROJECT_SYMBOL, TRY_TO_OPEN_SAMPLE_PROJECT_SYMBOL } from '@/store/projectInfoState'
import { inject } from 'vue'
import samples from '@/config/samples'

const currentProject = inject(CURRENT_PROJECT_SYMBOL)!
const nodes = inject(ALL_NODES_ON_CANVAS_SYMBOL)!
const tryToOpenSampleProject = inject(TRY_TO_OPEN_SAMPLE_PROJECT_SYMBOL)!
</script>

<style lang="scss" scoped>
.svg-canvas__overlay-tip {
  box-sizing: border-box;
  padding: 32px;
}
</style>
