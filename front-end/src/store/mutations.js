const mutations = {
  SET_MODALTILE: (state, data) => { state.modalTile = data },
  SET_MODALSECTION: (state, data) => { state.modalSection = data },
  SET_MODALBOARD: (state, data) => { state.modalBoard = data },
  SET_MODALCOLOR: (state, data) => { state.modalColor = data },
  SET_COLOR: (state, data) => { state.color = data },
  SET_MODALDETAILS: (state, data) => { state.modalDetails = data },
  SET_TILE: (state, data) => { state.tile = data },
  SET_PROFILE: (state, data) => { state.profile = data },
  SET_TOKEN: (state, data) => { state.token = data },
  SET_MODALPROFILE: (state, data) => { state.modalProfile = data },
  SET_MODALUSER: (state, data) => { state.modalUser = data },
  SET_MODALIMPORT: (state, data) => { state.modalImport = data }
}

export default mutations;