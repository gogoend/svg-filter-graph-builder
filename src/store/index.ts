import canvasStuff from './canvasStuff'
import draggingNode from './draggingNode'
import focusState from './focusState'
import io from './io'
import vmStore from './vmStore'

export default function setupStore() {
  [canvasStuff, draggingNode, focusState, vmStore, io].forEach(fn => fn())
}
