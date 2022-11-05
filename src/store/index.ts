import canvasStuff from './canvasStuff'
import draggingNode from './draggingNode'

export default function setupStore() {
  [canvasStuff, draggingNode].forEach(fn => fn())
}
