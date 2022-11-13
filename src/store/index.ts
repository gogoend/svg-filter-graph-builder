import canvasStuff from './canvasStuff'
import draggingNode from './draggingNode'
import focusState from './focusState'
import vmStore from './vmStore'
import projectInfoState from './projectInfoState'

export default function setupStore() {
  [canvasStuff, draggingNode, focusState, vmStore, projectInfoState].forEach(fn => fn())
}
