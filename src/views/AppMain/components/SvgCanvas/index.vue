<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 1920 1080"
    style="enable-background: new 0 0 1920 1080; width: 1920px; height: 1080px"
    xml:space="preserve"
  >
    <path
      class="ghost-path"
      :d="ghostPathD"
    />
    <io-path
      v-for="path in linkedPaths"
      :key="path.id"
      :path-id="path.id"
      :path-d-arguments="path.pathDArguments"
      :from="path.from"
      :to="path.to"
    ></io-path>
    <io-node
      is="convolveMatrix"
      node-id="1"
      @port-start="handlePortStart"
      @port-move="handlePortMove"
      @port-connect="handlePortConnect"
      @port-cancel="handlePortCancel"
      @destination-change="handleDestinationChange"
      :relativePathId="getRelativePathIdOfNode(1)"
    />
    <io-node
      is="turbulence"
      node-id="2"
      @port-start="handlePortStart"
      @port-move="handlePortMove"
      @port-connect="handlePortConnect"
      @port-cancel="handlePortCancel"
      @destination-change="handleDestinationChange"
      :relativePathId="getRelativePathIdOfNode(2)"
    />
  </svg>
</template>
<script lang="ts">
import { computed, defineComponent, ref, provide, Component } from 'vue'
import IoNode from '@/components/IoNode/index.vue'
import IoPath from '@/components/IoPath/index.vue'

interface Port<T> {
  vm: T;
  attr: string;
}

interface Path {
  pathDArguments: number[],
  id: string,
  from: Port<InstanceType<typeof IoNode>>,
  to: Port<InstanceType<typeof IoNode>>
}
// 圆形半径
const POINT_R = 10
// 曲线手柄长度
const HANDLE_LENGTH = 150

//
let id = 0

export default defineComponent({
  name: 'SvgCanvas',
  components: {
    IoNode,
    IoPath
  },
  setup() {
    const linkedPaths = ref<Path[]>([])

    const ghostPathDArguments = ref([0, 0, 0, 0, 0, 0, 0, 0])
    const ghostPathD = computed(() => {
      const dArgs = ghostPathDArguments.value
      return `
M ${dArgs[0]}, ${dArgs[1]}
C ${dArgs[2]}, ${dArgs[3]}, ${dArgs[4]}, ${dArgs[5]}, ${dArgs[6]}, ${dArgs[7]}`
    })

    const fromPort = ref<Port<InstanceType<typeof IoNode>>|null>(null)
    const toPort = ref<Port<InstanceType<typeof IoNode>>|null>(null)
    provide('fromPort', fromPort)
    provide('toPort', toPort)
    // const destnationVm = ref<InstanceType<typeof IoNode>>()

    const handlePortStart = ({ ev, originEl, vm }: {ev:MouseEvent, originEl: SVGCircleElement, vm: InstanceType<typeof IoNode>}) => {
      fromPort.value = {
        vm,
        attr: originEl.dataset?.feAttr ?? ''
      }
      const el = originEl
      const coord = [
        el.getBoundingClientRect().x,
        el.getBoundingClientRect().y
      ]

      if (el.classList.contains('in')) {
        ghostPathDArguments.value = [
          coord[0],
          coord[1],
          coord[0] + HANDLE_LENGTH,
          coord[1],

          coord[0] - HANDLE_LENGTH,
          coord[1],
          coord[0],
          coord[1] + POINT_R
        ]
      }
      if (el.classList.contains('out')) {
        ghostPathDArguments.value = [
          coord[0] + 2 * POINT_R,
          coord[1] + POINT_R,
          coord[0] + HANDLE_LENGTH,
          coord[1],

          coord[0] - HANDLE_LENGTH,
          coord[1],
          coord[0],
          coord[1]
        ]
      }
    }
    const handlePortMove = ({ ev, originEl, vm }: {ev:MouseEvent, originEl: SVGCircleElement, vm: InstanceType<typeof IoNode>}) => {
      if (originEl.classList.contains('in')) {
        ghostPathDArguments.value = [
          ev.pageX, ev.pageY, ev.pageX + HANDLE_LENGTH, ev.pageY,
          ...ghostPathDArguments.value.slice(4)
        ]
      }
      if (originEl.classList.contains('out')) {
        ghostPathDArguments.value = [
          ...ghostPathDArguments.value.slice(0, 4),
          ev.pageX - HANDLE_LENGTH, ev.pageY, ev.pageX, ev.pageY
        ]
      }
    }
    const handlePortConnect = ({ ev, originEl, vm }: {ev:MouseEvent, originEl: SVGCircleElement, vm: InstanceType<typeof IoPath>}) => {
      const el = ev.target as SVGGElement
      const coord = [
        el.getBoundingClientRect().x,
        el.getBoundingClientRect().y
      ]
      let pathDArguments: number[] = []

      if (originEl.classList.contains('in')) {
        pathDArguments = [
          coord[0] + 2 * POINT_R,
          coord[1] + POINT_R,
          coord[0] + HANDLE_LENGTH,
          coord[1],
          ...ghostPathDArguments.value.slice(4)
        ]
      }
      if (originEl.classList.contains('out')) {
        pathDArguments = [
          ...ghostPathDArguments.value.slice(0, 4),
          coord[0] - HANDLE_LENGTH,
          coord[1],
          coord[0],
          coord[1] + POINT_R
        ]
      }
      const linkedPath = {
        pathDArguments,
        id: '' + id++,
        from: fromPort.value as Port<InstanceType<typeof IoNode>>,
        to: toPort.value as Port<InstanceType<typeof IoNode>>
      }
      linkedPaths.value.push(linkedPath)

      console.log(fromPort.value?.vm, toPort.value?.vm)
      fromPort.value = null
      toPort.value = null
      ghostPathDArguments.value.fill(0)
    }
    const handlePortCancel = () => {
      console.log('canceled')
      fromPort.value = null
      toPort.value = null
      ghostPathDArguments.value.fill(0)
    }
    const handleDestinationChange = ({ vm, ev }: {vm: InstanceType<typeof IoNode> | null, ev: MouseEvent}) => {
      console.log(vm)
      toPort.value = {
        vm: vm as InstanceType<typeof IoNode>,
        attr: (ev.target as SVGCircleElement)?.dataset?.feAttr ?? ''
      }
    }

    return {
      ghostPathD,
      linkedPaths,
      handlePortStart,
      handlePortMove,
      handlePortConnect,
      handlePortCancel,
      handleDestinationChange,

      fromPort,
      toPort,

      getRelativePathIdOfNode(nodeId: string) {
        nodeId = String(nodeId)
        return linkedPaths.value.filter(path => ((path.from.vm as any).props.nodeId === nodeId || (path.to.vm as any).props.nodeId === nodeId))
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.draggable {
  cursor: grab;
}
.ghost-path {
  fill: none;
  stroke: #69b84a;
  stroke-width: 4px;
}
</style>
