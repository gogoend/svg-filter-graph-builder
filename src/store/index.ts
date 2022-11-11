import canvasStuff from './canvasStuff'
import draggingNode from './draggingNode'
import focusState from './focusState'
import vmStore from './vmStore'

export default function setupStore() {
  [canvasStuff, draggingNode, focusState, vmStore].forEach(fn => fn())
}
