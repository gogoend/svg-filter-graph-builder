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
      class="ghost-line"
      :d="ghostPathD"
    />
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

// 圆形半径
const POINT_R = 10
// 曲线手柄长度
const HANDLE_LENGTH = 150
// function mcPaser(path: string) {
//   path = path + ''
//   path = path.replace(/\s/g, '')
//   path = path.replace(/[a-z]/i, '')
//   path = path.replace(/[a-z]/ig, ',')
//   return path
// }

export default defineComponent({
  name: 'SvgCanvas',
  components: {
    IoNode
  },
  setup() {
    const linkedPath = ref([])

    const ghostPathDArguments = ref([850, 300, 1000, 300, 800, 400, 950, 400])
    const ghostPathD = computed(() => {
      const dArgs = ghostPathDArguments.value
      return `
M ${dArgs[0]}, ${dArgs[1]}
C ${dArgs[2]}, ${dArgs[3]}, ${dArgs[4]}, ${dArgs[5]}, ${dArgs[6]}, ${dArgs[7]}`
    })

    const handlePortStart = ({ ev, originEl, vm }: {ev:MouseEvent, originEl: HTMLElement, vm: any}) => {
      console.log(ev.target, originEl, vm)

      ghostPathDArguments.value = [
        ev.pageX + POINT_R,
        ev.pageY,
        ev.pageX + HANDLE_LENGTH,
        ev.pageY,
        ev.pageX - HANDLE_LENGTH,
        ev.pageY,
        ev.pageX - POINT_R,
        ev.pageY
      ]
    }
    const handlePortMove = ({ ev, originEl, vm }: {ev:MouseEvent, originEl: HTMLElement, vm: any}) => {
      console.log(ev.target, originEl, vm)
      if (originEl.classList.contains('in')) {
        ghostPathDArguments.value[0] = ev.pageX + POINT_R
        ghostPathDArguments.value[1] = ev.pageY
        ghostPathDArguments.value[2] = ev.pageX + HANDLE_LENGTH
        ghostPathDArguments.value[3] = ev.pageY
      }
      if (originEl.classList.contains('out')) {
        ghostPathDArguments.value[4] = ev.pageX - HANDLE_LENGTH
        ghostPathDArguments.value[5] = ev.pageY
        ghostPathDArguments.value[6] = ev.pageX - POINT_R
        ghostPathDArguments.value[7] = ev.pageY
      }
    }
    const handlePortConnect = () => ({})
    const handlePortCancel = () => {
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
.ghost-line {
  fill: none;
  stroke: #69b84a;
  stroke-width: 4px;
}
</style>
