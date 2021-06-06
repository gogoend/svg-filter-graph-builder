<template>
  <div
    class="io-node__li"
    v-for="(item, key) in fe[is].ports"
    :key="key">
    <em
      class="port in"
      data-port-type="in"
      r="10"
      :data-fe-attr="key"
      :ref="setFeAttrEls"
      @mouseenter="handlePortMouseenter"
    />
    <label class="io-node__port-text">
      <span class="port-name">{{ key }}</span>
      <input v-model="feAttrValue[key]" />
    </label>
  </div>

</template>
<script lang="ts">
import { defineComponent, h, PropType, ref, VNode } from 'vue'
import useIoNode from '../hooks/useIoNode'

import fe from '../fe-definition-config'

import type { RelativePathForNode } from '@/views/AppMain/components/SvgCanvas/type'
import { SVGFilterConfig } from '../type'
import { Dictionary } from '@/utils/type'

export default defineComponent({
  name: 'NormalNode',
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
      fromPort,
      ioNodeEl,
      setFeAttrEls,
      allDescendants,
      handlePortMouseenter,
      filterThumbUrl
    } = useIoNode()

    const feAttrValue = ref<Dictionary<string | number>>({})

    const getVNodeFragment = (item: any, index: number): VNode => {
      const { is, nodeId } = item.props
      const { feAttrValue } = item.setupState
      const allDescs = allDescendants?.value ?? []

      const nodeAttrs: Dictionary<string> = {}
      Object.keys(feAttrValue || {}).forEach(key => {
        if (feAttrValue[key] !== undefined) {
          nodeAttrs[key] = feAttrValue[key] || ''
        }
        nodeAttrs.in = [...allDescs].reverse()[index - 1]?.props.nodeId ?? ''
        nodeAttrs.result = item.props.nodeId
        if (nodeAttrs.in === nodeAttrs.result) {
          delete nodeAttrs.in
        }
      })
      return h(is, nodeAttrs)
    }

    // 填充默认值
    console.log(fe[props.is])
    if (['normal', undefined].includes(fe[props.is].type)) {
      const { ports } = fe[props.is] as SVGFilterConfig.NormalNode
      Object.keys(ports).forEach(key => {
        if (
          (['number', 'range'] as unknown[]).includes(ports[key].type)
        ) {
          feAttrValue.value[key] = ports[key].defaultValue ?? 0
        } else {
          feAttrValue.value[key] = ports[key].defaultValue ?? ''
        }
      })
    }
    return {
      fromPort,

      ioNodeEl,

      setFeAttrEls,
      feAttrValue,

      handlePortMouseenter,
      fe,
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
