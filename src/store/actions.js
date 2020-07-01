const actions = {
  setModalTile: ({ commit }, data) => {
    commit('SET_MODALTILE', data)
  },
  setModalSection: ({ commit }, data) => {
    commit('SET_MODALSECTION', data)
  }
}

export default actions;