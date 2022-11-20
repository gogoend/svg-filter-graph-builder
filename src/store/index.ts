import canvasStuff from './canvasStuff'
import draggingNode from './draggingNode'
import focusState from './focusState'
import vmStore from './vmStore'
import projectInfoState from './projectInfoState'
import pwa from './pwa'

export default function setupStore() {
  [pwa, canvasStuff, draggingNode, focusState, vmStore, projectInfoState].forEach(fn => fn())
}
