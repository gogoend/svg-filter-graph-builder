import { createStore } from 'vuex'

const store = createStore({
  state: {
    draggingNodeIcon: null,
    ghostNodeRef: null
  },
  mutations: {
    SET_DRAGGING_NODE_ICON(state, payload) {
      state.draggingNodeIcon = payload || null
    },
    SET_GHOST_NODE_REF(state, payload) {
      state.ghostNodeRef = payload || null
    }
  }
})

export default store
