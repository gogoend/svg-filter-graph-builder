import { VNode } from 'vue'
import { Dictionary } from './type'

export function getPortElType(el: SVGCircleElement) {
  return el.dataset.portType
}

export function isPortEl(el: HTMLElement) {
  return ['in', 'out'].includes(el.dataset.portType as string)
}

export function vnode2dom(vnode: VNode): HTMLElement {
  const {
    props, type: tag
  }: {
    props: Dictionary<any> | null,
    type: any
  } = vnode

  let children: any = vnode.children

  const rootEl = document.createElementNS('http://www.w3.org/2000/svg', tag)
  props && Object.keys(props).forEach(key => {
    ['number', 'string'].includes(typeof props?.[key]) && String(props?.[key]).length && rootEl.setAttribute(key, props?.[key])
  })

  if (typeof children === 'object' && children !== null) {
    if (!Array.isArray(children)) {
      children = [children]
    }
  } else {
    children = []
  }

  (children || []).forEach((child: VNode) => {
    rootEl.append(vnode2dom(child))
  })
  return rootEl
}

export const getTopoOrder = (descs: any[]) => {
  debugger
  return descs.concat().reverse()
}

