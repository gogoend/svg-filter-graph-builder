<template>
  <g
    class="io-node"
    @mousedown="handleNodeMousedown"
    :transform="`translate(${position[0]}, ${position[1]})`"
    ref="ioNodeEl"
  >
    <foreignObject class="io-node__inner">
      <div
        class="io-node__body"
        xmlns="http://www.w3.org/1999/xhtml">
        <img
          class="io-node__filter-thumb"
          :src="filterThumbUrl"
        />
        <div
          class="io-node__head"
        >
          <em
            class="port out"
            data-port-type="out"
            r="10"
            cx="250"
            data-fe-attr="result"
            :ref="setFeAttrEls"
            @mouseenter="handlePortMouseenter"
          />
          <span
            transform="matrix(1 0 0 1 0 8)"
            class="fill-fff module-name">{{is}}</span>
        </div>
        <div
          class="io-node__li"
          v-for="(item, key) in fe[is]"
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
            <input />
          </label>
        </div>
      </div>
    </foreignObject>
  </g>
</template>
<script lang="ts">
import { computed, defineComponent, getCurrentInstance, inject, nextTick, onBeforeUpdate, PropType, Ref, ref, unref } from 'vue'
import mouseEventHelper from '@/utils/mouse-event-helper'

import * as fe from './fe-definition-config'

import type { Port, RelativePathForNode } from '@/views/AppMain/components/SvgCanvas/type'
import { isPortEl } from '@/utils'

export default defineComponent({
  name: 'IoNode',
  props: {
    is: {
      type: String,
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
    const vm = ref(getCurrentInstance())
    const fromPort = inject<Ref<Port<any>>>('fromPort')
    const toPort = inject<Ref<Port<any>>>('toPort')

    const ioNodeEl = ref<SVGGElement>()
    const position = ref([0, 0])
    const clickedRelativePosition = ref([0, 0])

    const feAttrEls = ref<SVGCircleElement[]>([])
    const setFeAttrEls = (el?: SVGCircleElement) => {
      el && feAttrEls.value.push(el)
    }
    onBeforeUpdate(() => { feAttrEls.value = [] })

    const handleNodeMousedown = function(ev: MouseEvent) {
      mouseEventHelper(ev, {
        start(ev, { originEl }) {
          if (isPortEl(originEl)) {
            emit('port-start', { ev, originEl, vm })
          } else {
            const currentPostion = (ioNodeEl.value?.getBoundingClientRect() as DOMRect)
            // clickedRelativePosition.value = [ev.pageX - currentPostion?.left, ev.pageY - currentPostion?.top]
            clickedRelativePosition.value = [ev.pageX - currentPostion?.left, ev.pageY - currentPostion?.top]
          }
        },
        move(ev, { originEl }) {
          if (isPortEl(originEl)) {
            emit('port-move', { ev, originEl, vm })
          } else {
            position.value = [ev.pageX - clickedRelativePosition.value[0], ev.pageY - clickedRelativePosition.value[1]] // clickedRelativePosition.value.concat()
            nextTick(() => {
              const currentPostion = (ioNodeEl.value?.getBoundingClientRect() as DOMRect)
              clickedRelativePosition.value = [ev.pageX - currentPostion?.left, ev.pageY - currentPostion?.top]
              emit('node-move', props.relativePaths)
            })
          }
        },
        up(ev, { originEl }) {
          if (isPortEl(originEl)) {
            if (
              isPortEl(ev.target as HTMLElement) &&
              fromPort?.value &&
              toPort?.value
            ) {
              emit('port-connect', { ev, originEl, vm })
            } else {
              emit('port-cancel', { ev, originEl, vm })
            }
          }
          clickedRelativePosition.value = [0, 0]
        }
      })
    }

    const handlePortMouseout = function(ev: Event) {
      if (!fromPort?.value) { return }
      emit('destination-change', { ev, vm: null, originEl: null })
      ev.target?.removeEventListener('mouseout', handlePortMouseout)
    }
    const handlePortMouseenter = function(ev: Event) {
      if (!fromPort?.value) { return }
      emit('destination-change', { ev, vm, originEl: ev.target })
      ev.target?.addEventListener('mouseout', handlePortMouseout)
    }

    // 计算属性，表示当前节点下的所有的后代节点
    const allDescendants = computed<any[]>(() => {
      const allDescendants = new Set()
      const innerLoop = (vm: any) => {
        allDescendants.add(vm)

        vm.props.relativePaths.in.forEach((item: any) => {
          innerLoop(item.from.vm)
        })
        // [0].from.vm.setupState.allDescendants[0]
      }
      innerLoop(unref(vm))
      // props.relativePaths.in[0].from.vm.props.relativePaths.in[0].from.vm.props.relativePaths.in[0]
      return [...allDescendants]
    })

    const filterThumbUrl = computed<string>(() => {
      const prefix = 'data:image/svg+xml,'
      const template = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="SVGFilterBuilder" width="27" height="34" viewBox="-21 -32 112 182">
<defs><filter id="filter">
${allDescendants.value.map(item => {
    return `<${item.props.is} id="${item.props.nodeId}"></${item.props.is}>`
  })}
</filter></defs>
<g style="filter: url(#filter)">
<text y="130" fill="#31d0c6" font-family="cursive" font-size="140px">A</text>
</g>
</svg>
`
      return prefix + encodeURIComponent(template)
    })

    return {
      fromPort,

      ioNodeEl,
      position,

      setFeAttrEls,

      handleNodeMousedown,
      handlePortMouseenter,
      fe,
      allDescendants,

      filterThumbUrl
    }
  }
})
</script>

<style lang="scss" scoped>
.fill-333 {
  fill: #333333;
}
.fill-fff {
  fill: #ffffff;
}
.io-node {
  user-select: none;
  cursor: move;
  color: #fff;
  &__inner {
    overflow: visible;
  }
  &__body {
    width: 250px;
    background-color: #333333;
    padding: 0.5em 0;
    position: relative;
  }
  .module-name {
    font-size: 24px;
  }
  &__filter-thumb {
    position: absolute;
    height: 40px;
    width: 40px;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
    background-color: #f0f0f0;
  }
  .port {
    background-color: #333333;
    border: 4px solid;
    width: 0.75em;
    height: 0.75em;
    border-radius: 50%;
    flex: 0 0 auto;
    cursor: grab;
    &.disabled {
      cursor: no-drop;
    }
  }
  &__head {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    .port {
      border-color: #00f9f9;
      transform: translate(50%, 0);
    }
  }
  &__li {
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 2em;
    .port {
      border-color: #ff7f00;
      transform: translate(-50%, 0);
    }
    label.io-node__port-text{
      display: flex;
      flex: 1;
      justify-content: space-between;
      .port-name {
        font-size: 20px;
      }
      input {
        width: 30px;
        flex: 0 1 auto;
      }
    }
  }
}

</style>
