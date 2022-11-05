<template>
  <DemoSteps>
    <DemoStepItem
      v-for="i in stepArr"
      :key="i"
    >
      {{ i }} <button @click="stepArr = stepArr.filter(it => it !== i)">删除</button>
    </DemoStepItem>
  </DemoSteps>
</template>

<script lang="ts">
import DemoSteps from './components/Steps.vue'
import DemoStepItem from './components/StepItem.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
    DemoSteps,
    DemoStepItem
  },
  setup() {
    return {
      stepArr: ref([
        0, 1, 2, 3, 4, 5, 6
      ])
    }
  }
})
</script>

<style>
</style>
