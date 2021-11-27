import { Path } from '@/views/AppMain/components/SvgCanvas/type'
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

export const getTopoOrder = (paths: Path[]) => {
  const inDegree: Map<unknown, number> = new Map()
  const graph: Map<unknown, unknown[]> = new Map()

  paths.forEach(path => {
    const [fromVm, toVm] = [path.from.vm, path.to.vm]

    if (!inDegree.has(fromVm)) {
      inDegree.set(fromVm, 0)
      graph.set(fromVm, [])
    }
    if (!inDegree.has(toVm)) {
      inDegree.set(toVm, 0)
      graph.set(toVm, [])
    }
    inDegree.set(toVm, (inDegree.get(toVm) as number) + 1)
    ;(graph.get(fromVm) as unknown[]).push(toVm)
  })

  const queue: unknown[] = []; const result:unknown[] = []
  for (const key of inDegree) {
    if (key[1] === 0) {
      queue.push(key[0])
    }
  }
  while (queue.length) {
    const cur = queue.shift()
    result.push(cur)

    const toEnQueue = graph.get(cur) as unknown[]

    toEnQueue.forEach(item => {
      inDegree.set(item, (inDegree.get(item) as number) - 1)
      if (inDegree.get(item) === 0) {
        queue.push(item)
      }
    })
  }
  return result
}

