const actions = {
  setModalTile: ({ commit }, data) => {
    commit('SET_MODALTILE', data)
  },
  setModalSection: ({ commit }, data) => {
    commit('SET_MODALSECTION', data)
  },
  setModalBoard: ({ commit }, data) => {
    commit('SET_MODALBOARD', data)
  }
}

export default actions;