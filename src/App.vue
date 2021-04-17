<template>
  <app-main />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppMain from './views/AppMain/index.vue';

export default defineComponent({
  name: 'App',
  components: {
    AppMain
  }
});
</script>

<style lang="scss">

</style>
