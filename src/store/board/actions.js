export const setSections = ({ commit }, sections) => {
  // get from the database
  setTimeout(() => {
    commit('SET_SECTIONS', sections)
  }, 1000)
};

export const setTiles = ({ commit }, tiles) => {
  // get from the database
  setTimeout(() => {
    commit('SET_TILES', tiles)
  }, 1000)
};

export const setLabels = ({ commit }, labels) => {
  // get from the database
  setTimeout(() => {
    commit('SET_LABELS', labels)
  }, 1000)
};

export const pushSection = ({ commit, getters }, section) => {
  var sections = [...getters.getSections]
  setTimeout(() => {
    sections.push(section)
    commit('SET_SECTIONS', sections)
  }, 1000)
  // save into the database
};

export const pushTile = ({ commit, getters }, tile) => {
  var tiles = [...getters.getTiles]
  setTimeout(() => {
    tiles.push(tile)
    commit('SET_TILES', tiles)
  }, 1000)
  // save into the database
};