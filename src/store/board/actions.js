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

export const pushLabel = ({ commit, getters }, label) => {
  var labels = [...getters.getLabels]
  setTimeout(() => {
    labels.push(label)
    commit('SET_LABELS', labels)
  }, 1000)
  // save into the database
};

export const changeSectionColor = ({ commit, getters }, data) => {
  var sections = getters.getSections.map(section => {
    section.id === data.id ? section.color = data.color : null
    return section
  })
  setTimeout(() => {
    commit('SET_SECTIONS', sections)
  }, 1000)
  // save into the database
};

export const changeTileColor = ({ commit, getters }, data) => {
  var tiles = getters.getTiles.map(tile => {
    tile.id === data.id ? tile.color = data.color : null
    return tile
  })
  setTimeout(() => {
    commit('SET_TILES', tiles)
  }, 1000)
  // save into the database
};

export const changeSectionAxis = ({ commit, getters }, data) => {
  var sections = getters.getSections.map(section => {
    if (section.id === data.id) {
      section.x = data.x;
      section.y = data.y;
    }
    return section
  })
  setTimeout(() => {
    commit('SET_SECTIONS', sections)
  }, 1000)
  // save into the database
};

export const changeTileAxis = ({ commit, getters }, data) => {
  var tiles = getters.getTiles.map(tile => {
    if (tile.id === data.id) {
      tile.x = data.x;
      tile.y = data.y;
    }
    return tile
  })
  setTimeout(() => {
    commit('SET_TILES', tiles)
  }, 1000)
  // save into the database
};

export const removeLabel = ({ commit, getters }, data) => {
  var index = 0
  var labels = getters.getLabels.filter(label => {
    if (label.tile === data.tile)
      index++
    if (!(index === data.start))
      return label
  })
  setTimeout(() => {
    commit('SET_LABELS', labels)
  }, 1000)
  // save into the database
};