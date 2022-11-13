<template>
  <div class="filter-def">
    <svg>
      <defs>
        <filter
          :id="filterElId"
        >
          <component
            v-for="(render, index) in renderOfOrderedAllDescendants"
            :key="index"
            :is="render"
          />
        </filter>
      </defs>
    </svg>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import { FOCUSING_NODE_SYMBOL } from '@/store/focusState'

export default defineComponent({
  name: 'FeDef',
  props: {
    filterElId: {
      type: String
    }
  },
  setup() {
    const [focusingNode] = inject(FOCUSING_NODE_SYMBOL)!
    const renderOfOrderedAllDescendants = computed(
      () => (focusingNode.value as any)?.renderOfOrderedAllDescendants ?? (() => null)
    )

    return {
      focusingNode,
      renderOfOrderedAllDescendants
    }
  }
})
</script>
<style lang="scss" scoped>
.filter-def {
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>
