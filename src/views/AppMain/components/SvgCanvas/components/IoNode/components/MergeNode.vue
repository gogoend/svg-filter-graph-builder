<template>
  <div
    class="io-node__li">
    <em
      class="port in"
      data-port-type="in"
      r="10"
      data-fe-attr="in"
      ref="feAttrElPlaceholder"
      @mouseenter="handlePortMouseenter"
    />
    <label class="io-node__port-text">
      <span class="port-name">in-placeholder</span>
    </label>
  </div>
  <div
    class="io-node__li"
    v-for="(item, index) in feAttrValue"
    :key="'in-'+index">
    <em
      class="port in"
      data-port-type="in"
      r="10"
      :data-fe-attr="key"
      :ref="setFeAttrEls"
      @mouseenter="handlePortMouseenter"
    />
    <label class="io-node__port-text">
      <span class="port-name">in</span>
      <input v-model="feAttrValue[key]" />
    </label>
  </div>

</template>
<script lang="ts">
import { computed, defineComponent, h, PropType, ref } from 'vue'
import useIoNode from '../hooks/useIoNode'

import fe from '../fe-definition-config'

import type { RelativePathForNode } from '@/views/AppMain/components/SvgCanvas/type'
import { SVGFilterConfig } from '../type'
import { Dictionary } from '@/utils/type'
import { vnode2dom } from '@/utils'

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
      fromPort,
      ioNodeEl,
      setFeAttrEls,
      allDescendants,
      handlePortMouseenter
    } = useIoNode()

    const feAttrValue = ref<string[]>([])
    const filterThumbUrl = computed<string>(() => {
      const allDescs = allDescendants?.value ?? []
      const prefix = 'data:image/svg+xml,'
      const vnode = h('filter', { id: 'filter' }, [...allDescs].reverse().map((item, index) => {
        const is: keyof typeof fe = item.props.is
        let { feAttrValue } = item.setupState

        switch (fe[is].type) {
          case 'merge': {
            return h(is, {
              result: item.props.nodeId
            }, feAttrValue.map((result:string) => {
              return h('feMergeNode', { in: result })
            }))
          }
          case 'normal':
          default: {
            const nodeAttrs: Dictionary<string> = {}
            feAttrValue = feAttrValue || {}
            Object.keys(feAttrValue || {}).forEach(key => {
              if (feAttrValue[key] !== undefined) {
                nodeAttrs[key] = feAttrValue[key] || ''
              }
              nodeAttrs.in = [...allDescs].reverse()[index - 1]?.props.nodeId ?? ''
              nodeAttrs.result = item.props.nodeId
            })
            return h(is, nodeAttrs)
          }
        }
      }))

      const template =
`<svg xmlns="http://www.w3.org/2000/svg" id="SVGFilter" width="40" height="40" viewBox="-21 -32 112 182"><defs>${vnode2dom(vnode).outerHTML}</defs><g style="filter: url(#filter)"><text y="130" fill="#31d0c6" font-family="cursive" font-size="140px">A</text></g></svg>`
      return prefix + encodeURIComponent(template)
    })

    return {
      fromPort,

      ioNodeEl,

      setFeAttrEls,
      feAttrValue,

      handlePortMouseenter,
      fe,
      allDescendants,

      filterThumbUrl
    }
  }
})
</script>

<style lang="scss" scoped>
  @import url('../styles/public.scss');
</style>
