import { createStore } from 'vuex'

const store = createStore({
  state: {
    draggingNodeIcon: null
  },
  mutations: {
    SET_DRAGGING_NODE_ICON (state, payload) {
      state.draggingNodeIcon = payload || null
    }
  }
})

export default store