<template>
  <template
    v-for="(item, key) in fe[is].ports"
    :key="key"
  >
    <div
      class="io-node__li"
      v-if="item.showOnNode !== false"
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
        :data-fe-attr="key"
        :ref="setFeAttrEls"
        @mouseenter="handlePortMouseenter"
      />
      <label class="io-node__port-text">
        <span class="port-name">{{ key }}</span>
        <!-- <input v-model="feAttrValue[key]" /> -->
      </label>
    </div>
  </template>
</template>
<script lang="ts">
import { computed, defineComponent, h, inject, PropType, ref, VNode } from 'vue'
import useIoNode from '../hooks/useIoNode'

import fe from '../fe-definition-config'

import type { OverwrittenIoNodeType, RelativePathForNode } from '@/views/AppMain/components/SvgCanvas/type'
import { SVGFilterConfig } from '../type'
import { Dictionary } from '@/utils/type'
import { noop } from '@/utils'
import { POINT_BORDER_W, POINT_R } from '@/config/ui'

import { NODE_REF_MAP_SYMBOL } from '@/store/canvasStuff'
import gogoendLog from '@/plugins/log'

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
      toPort,
      ioNodeEl,
      setFeAttrEls,
      allDescendants,
      handlePortMouseenter,
      filterThumbUrl
    } = useIoNode()

    const feAttrValue = ref<Dictionary<string | number>>({})

    const foreignPortValue = computed<Dictionary<string | number>>(() => {
      const newValueMap: Dictionary<string | number> = {}

      props.relativePaths.in.forEach(p => {
        newValueMap[p.to.attr] = p.from.vm.mergedFeAttrValue[p.from.attr]
      })
      return newValueMap
    })

    const mergedFeAttrValue = computed<Dictionary<string | number>>(() => ({
      in: foreignPortValue.value.in,
      result: props.nodeId
    }))

    const nodeRefMap = inject(NODE_REF_MAP_SYMBOL)!
    const getVNodeFragment = (item: OverwrittenIoNodeType): VNode => {
      const is = item.is
      const { mergedFeAttrValue } = item

      const nodeAttrs: Dictionary<string | number> = {}
      Object.keys(mergedFeAttrValue || {}).forEach(key => {
        if (mergedFeAttrValue[key] !== undefined) {
          nodeAttrs[key] = mergedFeAttrValue[key] || ''
        }
        if (nodeAttrs.in === nodeAttrs.result) {
          delete nodeAttrs.in
        }
        if (
          Object.prototype.hasOwnProperty.call(fe[is].ports, 'in') && !nodeAttrs.in
        ) {
          nodeAttrs.in = 'SourceGraphic'
        }
        if (
          Object.prototype.hasOwnProperty.call(fe[is].ports, 'in2') && !nodeAttrs.in2
        ) {
          nodeAttrs.in2 = 'SourceGraphic'
        }
      })
      const tag = (fe[is] as any).tag ?? is

      const childVNodeAttrMap = {
        R: { type: 'identity' },
        G: { type: 'identity' },
        B: { type: 'identity' },
        A: { type: 'identity' }
      }

      Object.keys(childVNodeAttrMap).forEach(key => {
        if (foreignPortValue.value[key]) {
          Object.assign(
            (childVNodeAttrMap as any)[key],
            nodeRefMap.value[
              foreignPortValue.value[key]
            ].mergedFeAttrValue
          )
        }
      })

      return h(
        tag,
        nodeAttrs,
        Object.entries(childVNodeAttrMap).map(([key, value]) => {
          return h(
            `feFunc${key}`,
            value
          )
        })
      )
    }

    // 填充默认值
    gogoendLog.debug(fe[props.is])
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
      POINT_R,
      POINT_BORDER_W,

      fromPort,

      ioNodeEl,

      setFeAttrEls,
      feAttrValue,
      foreignPortValue,
      mergedFeAttrValue,
      afterPathConnected: noop,
      afterPathRemoved: noop,

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
