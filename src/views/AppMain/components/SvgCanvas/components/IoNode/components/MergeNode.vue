<template>
  <div
    class="io-node__li"
    v-for="(item, index) in feAttrValue"
    :key="`in-${index}`">
    <em
      class="port in"
      data-port-type="in"
      r="10"
      :data-fe-attr="`in-${index}`"
      :ref="setFeAttrEls"
      @mouseenter="handlePortMouseenter"
    />
    <label class="io-node__port-text">
      <span class="port-name">in</span>
    </label>
  </div>

</template>
<script lang="ts">
import { defineComponent, h, PropType, ref, unref, VNode } from 'vue'
import useIoNode from '../hooks/useIoNode'

import fe from '../fe-definition-config'

import type { RelativePathForNode } from '@/views/AppMain/components/SvgCanvas/type'

export default defineComponent({
  name: 'MergeNode',
  props: {
    is: {
      type: String as PropType<keyof typeof fe>,
      required: true
    },
    nodeId: {
      type: String,
      required: true
    },
    relativePaths: {
      type: Object as PropType<RelativePathForNode>,
      required: true
    }
  },
  setup(props) {
    const {
      toPort,
      fromPort,
      ioNodeEl,
      setFeAttrEls,
      allDescendants,
      handlePortMouseenter,
      filterThumbUrl
    } = useIoNode()

    // const feAttrValue = computed<string[]>(() => {
    //   return props.relativePaths.in.map(item => {
    //     console.log(item.from.vm.props.nodeId)
    //     return item.from.vm.props.nodeId
    //   })
    // })

    const feAttrValue = ref<string[]>([''])

    const afterConnected = () => {
      console.log(toPort, fromPort)
      feAttrValue.value[feAttrValue.value.length - 1] = fromPort?.value.vm.props.nodeId
      feAttrValue.value.push('')
    }

    const getVNodeFragment = (): VNode => {
      const { is, nodeId } = props
      return h(is, {
        result: nodeId
      }, unref(feAttrValue).filter(filter => !!filter).map((result:string) => {
        return h('feMergeNode', { in: result })
      }))
    }

    return {
      fromPort,

      ioNodeEl,

      setFeAttrEls,
      feAttrValue,
      afterConnected,

      handlePortMouseenter,
      allDescendants,

      filterThumbUrl,
      getVNodeFragment
    }
  }
})
</script>

<style lang="scss" scoped>
  @import url('../styles/public.scss');
</style>
