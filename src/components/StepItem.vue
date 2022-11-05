<template>
  <div class="step-item">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import { STEP_LIST_SYMBOL } from '../types'

export default defineComponent({
  name: 'DemoStepItem',
  props: {
  },
  setup() {
    const vm = getCurrentInstance()?.proxy
    const stepChildVms = inject(STEP_LIST_SYMBOL)!
    onMounted(() => {
      stepChildVms.value.push(vm)
      onBeforeUnmount(() => {
        stepChildVms.value = stepChildVms.value.filter(it => it !== vm)
      })
    })

    return {
      stepChildVms
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
