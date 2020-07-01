import { config } from './../../CONFIG';

export const setSearch = ({ commit, getters }, data) => {
  commit('SET_SECTIONS', getters.getSections1)
  commit('SET_TILES', getters.getTiles1)
  commit('SET_LABELS', getters.getLabels1)

  var search = null
  getters.getTiles1.forEach(tile => {
    if (tile.name === data){
      search = {
        word: tile.name,
        k: 1,
        x: -Math.abs(+tile.x) + (window.innerWidth / 2) - (config.section_width / 2),
        y: -Math.abs(+tile.y) + (window.innerHeight / 2) - (config.section_height / 2)
      }
    }
  })
  if (!search){
    search = null
  }
  commit('SET_SEARCH', search)
};

// Actaully we don't need copyBoard (to copy from the duplicate data to the original data)
// why ?, see in pushSection and pushTile, we are already coppying, sort of...
export const copyBoard = ({ commit, getters }) => {
  commit('SET_SECTIONS', getters.getSections1)
  commit('SET_TILES', getters.getTiles1)
  commit('SET_LABELS', getters.getLabels1)
};

export const setSections = ({ commit }, sections) => {
  // get from the database
  setTimeout(() => {
    commit('SET_SECTIONS', sections)
    commit('SET_SECTIONS1', sections)
  }, 1000)
};

export const setTiles = ({ commit }, tiles) => {
  // get from the database
  setTimeout(() => {
    commit('SET_TILES', tiles)
    commit('SET_TILES1', tiles)
  }, 1000)
};

export const setLabels = ({ commit }, labels) => {
  // get from the database
  setTimeout(() => {
    commit('SET_LABELS', labels)
    commit('SET_LABELS1', labels)
  }, 1000)
};

export const pushSection = ({ commit, getters }, section) => {
  // console.log(getters.getSections, getters.getSections1)
  var sections = [...getters.getSections1]
  setTimeout(() => {
    sections.push(section)
    commit('SET_SECTIONS', sections)
    commit('SET_SECTIONS1', sections)
    commit('SET_LABELS', getters.getLabels1)
  }, 1000)
  // save into the database
};

export const pushTile = ({ commit, getters }, tile) => {
  console.log(tile, getters.getTiles, getters.getTiles1)
  var tiles = [...getters.getTiles1]
  setTimeout(() => {
    tiles.push(tile)
    commit('SET_TILES', tiles)
    commit('SET_TILES1', tiles)
    commit('SET_LABELS', getters.getLabels1)
  }, 1000)
  // save into the database
};

export const pushLabel = ({ commit, getters }, label) => {
  var labels = [...getters.getLabels1]
  setTimeout(() => {
    labels.push(label)
    commit('SET_LABELS1', labels)
  }, 1000)
  // save into the database
};

export const changeSectionColor = ({ commit, getters }, data) => {
  var sections = getters.getSections1.map(section => {
    section.id === data.id ? section.color = data.color : null
    return section
  })
  setTimeout(() => {
    commit('SET_SECTIONS1', sections)
  }, 1000)
  // save into the database
};

export const changeTileColor = ({ commit, getters }, data) => {
  var tiles = getters.getTiles1.map(tile => {
    tile.id === data.id ? tile.color = data.color : null
    return tile
  })
  setTimeout(() => {
    commit('SET_TILES1', tiles)
  }, 1000)
  // save into the database
};

export const changeSection = ({ commit, getters }, data) => {
  var sections = getters.getSections1.map(section => {
    if (section.id === data.id) {
      section.x = data.x;
      section.y = data.y;
      section.width = data.width;
      section.height = data.height;
    }
    return section
  })
  var tiles = getters.getTiles1.map(tile => {
    if (data.tiles.length){
      data.tiles.forEach(_tile => {
        if (tile.id === _tile.id){
          tile.x = _tile.x;
          tile.y = _tile.y;
        }
      })
    }
    return tile
  })
  console.log(getters.getSections1, sections)
  setTimeout(() => {
    commit('SET_SECTIONS1', sections)
    commit('SET_TILES1', tiles)
  }, 1000)
  // save into the database
};

export const changeTile = ({ commit, getters }, data) => {
  var tiles = getters.getTiles1.map(tile => {
    if (tile.id === data.id) {
      tile.x = data.x;
      tile.y = data.y;
      tile.backLeft = data.backLeft;
      tile.backRight = data.backRight;
    }
    return tile
  })
  setTimeout(() => {
    commit('SET_TILES1', tiles)
  }, 1000)
  // save into the database
};

export const removeLabel = ({ commit, getters }, data) => {
  var index = 0
  var labels = getters.getLabels1.filter(label => {
    if (label.tile === data.tile)
      index++
    if (!(index === data.start))
      return label
  })
  setTimeout(() => {
    commit('SET_LABELS1', labels)
  }, 1000)
  // save into the database
};

export const removeTile = ({ commit, getters }, id) => {
  var deleted = 0
  var tiles = getters.getTiles1.filter(tile => {
    if (tile.id === id){
      deleted = tile
    } else {
      return tile
    }
  })
  var labels = getters.getLabels1.filter(label => {
    if (!(label.tile === deleted.id))
      return label
  })
  setTimeout(() => {
    commit('SET_TILES1', tiles)
    commit('SET_LABELS1', labels)
  }, 1000)
  // save into the database
};

export const removeSection = ({ commit, getters }, id) => {
  var sections = getters.getSections1.filter(section => {
    if (!(section.id === id))
      return section
  })
  setTimeout(() => {
    commit('SET_SECTIONS1', sections)
  }, 1000)
  // save into the database
};

export const changeZoom = ({ commit }, data) => {
  const zoom = {
    k: data.zoom.k,
    x: data.zoom.x,
    y: data.zoom.y
  }
  setTimeout(() => {
    commit('SET_ZOOM', zoom)
  }, 1000)
};