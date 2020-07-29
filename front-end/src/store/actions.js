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
  },
  setModalDetails: ({ commit }, data) => {
    commit('SET_MODALDETAILS', data)
  },
  setTile: ({ commit }, data) => {
    commit('SET_TILE', data)
  },
  setProfile: ({ commit }, data) => {
    commit('SET_PROFILE', data)
  },
  setToken: ({ commit }, data) => {
    commit('SET_TOKEN', data)
  },
  setModalProfile: ({ commit }, data) => {
    commit('SET_MODALPROFILE', data)
  },
  setModalUser: ({ commit }, data) => {
    commit('SET_MODALUSER', data)
  },
  setModalImport: ({ commit }, data) => {
    commit('SET_MODALIMPORT', data)
  },
  setLogs: ({ commit }, data) => {
    commit('SET_LOGS', data)
  },
  setRecenter: ({ commit }, data) => {
    commit('SET_RECENTER', data)
  }
}

export default actions;