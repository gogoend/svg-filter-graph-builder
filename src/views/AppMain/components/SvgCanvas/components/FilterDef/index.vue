<template>
  <defs>
    <filter
      v-for="node in nodes"
      :key="node.id"
      :id="node.id"
    >
      <component :is="node.is" />
    </filter>
  </defs>
</template>
<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { Node, Path } from '../../type'

export default defineComponent({
  name: 'FeDef',
  props: {
    linkedPaths: {
      type: Array as PropType<Path[]>,
      required: true
    },
    nodes: {
      type: Array as PropType<Node[]>,
      required: true
    }
  },
  setup(props, { emit }) {
    const nodeGropWithLinks = computed(
      () => {
        const {
          linkedPaths, nodes
        } = props
        console.log(nodes)
        return {
          nodes, linkedPaths
        }
      }
    )
    console.log(nodeGropWithLinks)
    return {
      nodeGropWithLinks
    }
  }
})
</script>
