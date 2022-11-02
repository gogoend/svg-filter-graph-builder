import { vnode2dom, getTopoOrder } from '@/utils'
import { Dictionary } from '@/utils/type'
import { computed, inject, onBeforeUpdate, Ref, ref, h } from 'vue'
import { Path, Port } from '../../../type'

export default () => {
  const fromPort = inject<Ref<Port<any>>>('fromPort')
  const toPort = inject<Ref<Port<any>>>('toPort')

  const ioNodeEl = ref<SVGGElement>()

  const feAttrEls = ref<SVGCircleElement[]>([])
  const setFeAttrEls = (el?: SVGCircleElement) => {
    el && feAttrEls.value.push(el)
  }
  onBeforeUpdate(() => { feAttrEls.value = [] })
  // 计算属性，表示当前节点下的所有的后代节点
  const allDescendants = inject<Ref<any[]>>('allDescendants')
  const orderedAllDescendants = inject<Ref<any[]>>('orderedAllDescendants')

  const handlePortMouseenter = inject<Ref<any>>('handlePortMouseenter')
  const filterThumbUrl = computed<string>(() => {
    const prefix = 'data:image/svg+xml,'
    const vnode = h('filter', { id: 'filter' }, (orderedAllDescendants?.value ?? []).map((item, index) => item.getVNodeFragment(item, index)))
    const template =
`
<svg xmlns="http://www.w3.org/2000/svg" id="SVGFilter" width="40" height="40" viewBox="0 0 256 256">
<defs>${vnode2dom(vnode).outerHTML}</defs>
<g filter="url(#filter)">
  <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="0" y1="64" x2="64" y2="64">
    <stop offset="0" style="stop-color:#EE7E77" /><stop offset="0.5" style="stop-color:#E7334C" /><stop offset="1" style="stop-color:#DA0439" />
  </linearGradient>
  <rect style="fill:url(#SVGID_1_);" width="64" height="128" />
  <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="64" y1="64" x2="128" y2="64">
    <stop offset="0" style="stop-color:#F29847" /><stop offset="0.5" style="stop-color:#EE7300" /><stop offset="1" style="stop-color:#D45E12" />
  </linearGradient>
  <rect x="64" style="fill:url(#SVGID_2_);" width="64" height="128" />
  <linearGradient id="SVGID_3_" gradientUnits="userSpaceOnUse" x1="128" y1="64" x2="192" y2="64">
    <stop offset="0" style="stop-color:#FFF9AC" /><stop offset="0.5" style="stop-color:#FFF000" /><stop offset="1" style="stop-color:#FFDC00" />
  </linearGradient>
  <rect x="128" style="fill:url(#SVGID_3_);" width="64" height="128" />
  <linearGradient id="SVGID_4_" gradientUnits="userSpaceOnUse" x1="192" y1="64" x2="256" y2="64">
    <stop offset="0" style="stop-color:#66BC81" /><stop offset="0.5" style="stop-color:#009944" /><stop offset="1" style="stop-color:#008A43" />
  </linearGradient>
  <rect x="192" style="fill:url(#SVGID_4_);" width="64" height="128" />
  <linearGradient id="SVGID_5_" gradientUnits="userSpaceOnUse" x1="0" y1="192" x2="64" y2="192">
    <stop offset="0" style="stop-color:#3EAFCD" /><stop offset="0.5" style="stop-color:#0091B8" /><stop offset="1" style="stop-color:#00767F" />
  </linearGradient>
  <rect y="128" style="fill:url(#SVGID_5_);" width="64" height="128" />
  <linearGradient id="SVGID_6_" gradientUnits="userSpaceOnUse" x1="64" y1="192" x2="128" y2="192">
    <stop offset="0" style="stop-color:#584C9D" /><stop offset="0.5" style="stop-color:#1D2088" /><stop offset="1" style="stop-color:#39396C" />
  </linearGradient>
  <rect x="64" y="128" style="fill:url(#SVGID_6_);" width="64" height="128" />
  <linearGradient id="SVGID_7_" gradientUnits="userSpaceOnUse" x1="128" y1="192" x2="192" y2="192">
    <stop offset="0" style="stop-color:#B87FB5" /><stop offset="0.5" style="stop-color:#8E2E8C" /><stop offset="1" style="stop-color:#731485" />
  </linearGradient>
  <rect x="128" y="128" style="fill:url(#SVGID_7_);" width="64" height="128" />
  <linearGradient id="SVGID_8_" gradientUnits="userSpaceOnUse" x1="192" y1="192" x2="256" y2="192">
    <stop offset="0" style="stop-color:#EB70A6" /><stop offset="0.5" style="stop-color:#E4007F" /><stop offset="1" style="stop-color:#CE0080" />
  </linearGradient>
  <rect x="192" y="128" style="fill:url(#SVGID_8_);" width="64" height="128" />
</g>
</svg>
`
    return prefix + encodeURIComponent(template)
  })

  return {
    fromPort,
    toPort,
    ioNodeEl,
    feAttrEls,
    setFeAttrEls,
    allDescendants,
    handlePortMouseenter,
    filterThumbUrl
  }
}
