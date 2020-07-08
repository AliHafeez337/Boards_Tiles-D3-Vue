const actions = {
  setModalTile: ({ commit }, data) => {
    commit('SET_MODALTILE', data)
  },
  setModalSection: ({ commit }, data) => {
    commit('SET_MODALSECTION', data)
  },
  setModalBoard: ({ commit }, data) => {
    commit('SET_MODALBOARD', data)
  },
  setModalColor: ({ commit }, data) => {
    commit('SET_MODALCOLOR', data)
  },
  setColor: ({ commit }, data) => {
    commit('SET_COLOR', data)
  }
}

export default actions;