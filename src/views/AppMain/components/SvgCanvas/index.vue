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
      v-for="path in linkedPath"
      :key="path.id"
      :path-id="path.id"
      :path-d-arguments="path.pathDArguments"
    ></io-path>
    <io-node
      is="convolveMatrix"
      node-id="1"
      @port-start="handlePortStart"
      @port-move="handlePortMove"
      @port-connect="handlePortConnect"
      @port-cancel="handlePortCancel"
    />
    <io-node
      is="turbulence"
      node-id="2"
      @port-start="handlePortStart"
      @port-move="handlePortMove"
      @port-connect="handlePortConnect"
      @port-cancel="handlePortCancel"
    />
  </svg>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import IoNode from '@/components/IoNode/index.vue'
import IoPath from '@/components/IoPath/index.vue'

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
    const linkedPath = ref<{
      pathDArguments: number[],
      id: string
    }[]>([])

    const ghostPathDArguments = ref([0, 0, 0, 0, 0, 0, 0, 0])
    const ghostPathD = computed(() => {
      const dArgs = ghostPathDArguments.value
      return `
M ${dArgs[0]}, ${dArgs[1]}
C ${dArgs[2]}, ${dArgs[3]}, ${dArgs[4]}, ${dArgs[5]}, ${dArgs[6]}, ${dArgs[7]}`
    })

    // const sourceVm = ref<InstanceType<typeof IoNode>>()
    // const destnationVm = ref<InstanceType<typeof IoNode>>()

    const handlePortStart = ({ ev, originEl, vm }: {ev:MouseEvent, originEl: SVGCircleElement, vm: any}) => {
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
    const handlePortMove = ({ ev, originEl, vm }: {ev:MouseEvent, originEl: SVGCircleElement, vm: any}) => {
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
    const handlePortConnect = ({ ev, originEl, vm }: {ev:MouseEvent, originEl: SVGCircleElement, vm: any}) => {
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
      linkedPath.value.push({
        pathDArguments,
        id: '' + id++
      })

      ghostPathDArguments.value.fill(0)
    }
    const handlePortCancel = () => {
      ghostPathDArguments.value.fill(0)
      console.log('canceled')
    }

    return {
      ghostPathD,
      linkedPath,
      handlePortStart,
      handlePortMove,
      handlePortConnect,
      handlePortCancel
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
