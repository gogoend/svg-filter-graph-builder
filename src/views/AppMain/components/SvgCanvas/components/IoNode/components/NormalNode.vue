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
import { defineComponent, inject, onBeforeUpdate, PropType, Ref, ref } from 'vue'

import fe from '../fe-definition-config'

import type { Port, RelativePathForNode } from '@/views/AppMain/components/SvgCanvas/type'
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
  setup(props, { emit }) {
    const fromPort = inject<Ref<Port<any>>>('fromPort')
    const toPort = inject<Ref<Port<any>>>('toPort')

    const ioNodeEl = ref<SVGGElement>()

    const feAttrEls = ref<SVGCircleElement[]>([])
    const setFeAttrEls = (el?: SVGCircleElement) => {
      el && feAttrEls.value.push(el)
    }
    onBeforeUpdate(() => { feAttrEls.value = [] })
    const feAttrValue = ref<Dictionary<string|number>>({})

    // 计算属性，表示当前节点下的所有的后代节点
    const allDescendants = inject<any[]>('allDescendants')

    const handlePortMouseenter = inject<any>('handlePortMouseenter')

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
      allDescendants
    }
  }
})
</script>

<style lang="scss" scoped>
.io-node {
  &__li {
    display: flex;
    align-items: center;
    flex-direction: row;
    line-height: 1.75em;
    .port {
      border-color: #ff7f00;
      transform: translate(-50%, 0);
    }
    label.io-node__port-text{
      display: flex;
      flex: 1;
      justify-content: space-between;
      align-items: center;
      .port-name {
        font-size: 1.25em;
      }
      input {
        width: 30px;
        flex: 0 1 auto;
      }
    }
  }
}

</style>
