<template>
  <div
    class="io-node__li"
    v-for="(item, index) in feAttrValue"
    :key="index"
  >
    <em
      class="port in"
      :style="{
        width: `${2 * POINT_R}px`,
        height: `${ 2 * POINT_R }px`,
        borderWidth: `${ POINT_BORDER_W }px`
      }"
      data-port-type="in"
      r="10"
      :data-fe-attr="index"
      :ref="setFeAttrEls"
      @mouseenter="handlePortMouseenter"
    />
    <label class="io-node__port-text">
      <span class="port-name">in</span>
    </label>
  </div>

</template>
<script lang="ts">
import { computed, defineComponent, h, PropType, ref, unref, VNode, getCurrentInstance } from 'vue'
import useIoNode from '../hooks/useIoNode'

import fe from '../fe-definition-config'

import type { RelativePathForNode } from '@/views/AppMain/components/SvgCanvas/type'
import { Dictionary } from '@/utils/type'
import { POINT_BORDER_W, POINT_R } from '@/config/ui'
import { Path } from '@/views/AppMain/components/SvgCanvas/type'
import gogoendLog from '@/plugins/log'

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
    //     gogoendLog.debug(item.from.vm.nodeId)
    //     return item.from.vm.nodeId
    //   })
    // })

    const feAttrValue = ref<string[]>([''])

    const mergedFeAttrValue = computed<Dictionary<string | number>>(() => ({
      result: props.nodeId
    }))

    const parentVm = getCurrentInstance()!.parent?.proxy
    const afterPathConnected = () => {
      gogoendLog.debug(toPort?.value, fromPort?.value)

      const { attr } = [toPort?.value, fromPort?.value].find(it => it?.vm === parentVm)!
      const index = Number(attr)

      feAttrValue.value[index] = fromPort!.value.vm.nodeId
      if (!feAttrValue.value[index + 1]) {
        feAttrValue.value[index + 1] = ''
      }
    }
    const afterPathRemoved = (removedPath: Path) => {
      const { attr } = removedPath.to
      feAttrValue.value[Number(attr)] = ''
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
      POINT_R,
      POINT_BORDER_W,

      fromPort,

      ioNodeEl,

      setFeAttrEls,
      feAttrValue,
      mergedFeAttrValue,
      afterPathConnected,
      afterPathRemoved,

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
