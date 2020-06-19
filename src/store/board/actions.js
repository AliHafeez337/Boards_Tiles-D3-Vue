export const setSections = ({ commit }, sections) => {
  setTimeout(() => {
    commit('SET_SECTIONS', sections)
  }, 1000)
};
export const setTiles = ({ commit }, tiles) => {
  setTimeout(() => {
    commit('SET_TILES', tiles)
  }, 1000)
};