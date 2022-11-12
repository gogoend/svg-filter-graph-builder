import { InjectionKey, provide, shallowRef, ShallowRef } from 'vue'
import SvgCanvas from '@/views/AppMain/components/SvgCanvas/index.vue'

export const SVG_CANVAS_VM_SYMBOL: InjectionKey<ShallowRef<InstanceType<typeof SvgCanvas>>> = Symbol('SvgCanvas组件实例')
export const SET_SVG_CANVAS_VM_SYMBOL: InjectionKey<(vm: InstanceType<typeof SvgCanvas>) => void> = Symbol('设置SvgCanvas组件实例')

export default function vmCache() {
  const svgCanvasVm = shallowRef<InstanceType<typeof SvgCanvas>>()
  provide(
    SVG_CANVAS_VM_SYMBOL,
    svgCanvasVm
  )

  const setSvgCanvasVm = (vm: InstanceType<typeof SvgCanvas>) => {
    svgCanvasVm.value = vm
  }
  provide(
    SET_SVG_CANVAS_VM_SYMBOL,
    setSvgCanvasVm
  )
}
