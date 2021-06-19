import { uuid } from '@/utils/uuid'
import { createStore } from 'vuex'

const store = createStore({
  state: {
    draggingNodeIcon: null,
    ghostNodeRef: null,
    nodes: [
      {
        is: 'feConvolveMatrix',
        id: uuid(),
        position: [10, 50]
      },
      {
        is: 'feTurbulence',
        id: uuid(),
        position: [80, 30]
      },
      {
        is: 'feImage',
        id: uuid(),
        position: [300, 420]
      },
      {
        is: 'feOffset',
        id: uuid(),
        position: [80, 300]
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
