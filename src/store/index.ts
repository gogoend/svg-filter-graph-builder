import { uuid } from '@/utils/uuid'
import { createStore } from 'vuex'

const store = createStore({
  state: {
    draggingNodeIcon: null,
    ghostNodeRef: null,
    nodes: [
      {
        is: 'feTurbulence',
        id: uuid(),
        position: [80, 30]
      },
      {
        is: 'feDisplacementMap',
        id: uuid(),
        position: [720, 640]
      }
    ]
  },
  mutations: {
    SET_DRAGGING_NODE_ICON(state, payload) {
      state.draggingNodeIcon = payload || null
    },
    SET_GHOST_NODE_REF(state, payload) {
      state.ghostNodeRef = payload || null
    },
    ADD_NODE(state, payload) {
      state.nodes.push(payload)
    }
  }
})

export default store
