<template>
  <app-main />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import setupStore from './store'
import AppMain from './views/AppMain/index.vue'

export default defineComponent({
  name: 'App',
  components: {
    AppMain
  },
  setup() {
    setupStore()
  }
})
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
</style>
