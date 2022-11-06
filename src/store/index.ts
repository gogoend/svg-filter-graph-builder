import canvasStuff from './canvasStuff'
import draggingNode from './draggingNode'
import focusState from './focusState'

export default function setupStore() {
  [canvasStuff, draggingNode, focusState].forEach(fn => fn())
}
