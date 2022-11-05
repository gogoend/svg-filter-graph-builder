<template>
  <div class="step">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide } from 'vue'
import { STEP_LIST_SYMBOL } from '../types'
import DemoStepItem from './StepItem.vue'

export default defineComponent({
  name: 'DemoSteps',
  props: {
  },
  setup() {
    const stepChildVms = ref<Array<InstanceType<typeof DemoStepItem>>>([])
    provide(STEP_LIST_SYMBOL, stepChildVms)
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
