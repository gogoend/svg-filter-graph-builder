import canvasStuff from './canvasStuff'
import draggingNode from './draggingNode'
import focusState from './focusState'
import io from './io'
import vmStore from './vmStore'
import projectInfoState from './projectInfoState'

export default function setupStore() {
  [canvasStuff, draggingNode, focusState, vmStore, io, projectInfoState].forEach(fn => fn())
}
