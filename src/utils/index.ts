export function getPortElType(el: SVGCircleElement) {
  return el.dataset.portType
}

export function isPortEl(el: HTMLElement) {
  return ['in', 'out'].includes(el.dataset.portType as string)
}
