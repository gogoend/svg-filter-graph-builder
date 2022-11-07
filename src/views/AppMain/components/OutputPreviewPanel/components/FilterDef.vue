<template>
  <div class="filter-def">
    <svg>
      <defs>
        <filter
          :id="filterElId"
        >
          <component
            v-for="(desc) in orderedAllDescendants"
            :key="desc.id"
            :is="desc.is"
            :id="desc.nodeId"
            v-bind="desc.mergedFeAttrValue"
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
  setup(props, { emit }) {
    const [focusingNode] = inject(FOCUSING_NODE_SYMBOL)!
    const orderedAllDescendants = computed(() => {
      if (!focusingNode.value) {
        return []
      } else {
        return focusingNode.value!.orderedAllDescendants
      }
    })

    return {
      focusingNode,
      orderedAllDescendants
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
