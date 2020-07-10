import { config } from './../../CONFIG';

export const setSearch = ({ commit, getters }, data) => {
  commit('SET_SECTIONS', getters.getSections1)
  commit('SET_TILES', getters.getTiles1)
  commit('SET_LABELS', getters.getLabels1)

  var search = null
  getters.getTiles1.forEach(tile => {
    var name = tile.name
    if (tile.name[0] === 'H' || tile.name[0] === 'M' || tile.name[0] === 'L'){
      name = tile.name.substring(1)
    }
    if (name === data){
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
  commit('SET_SECTIONNAME', getters.getSectionName1)
  commit('SET_TILES', getters.getTiles1)
  commit('SET_LABELS', getters.getLabels1)
};

export const setBoard = ({ commit }, name) => {
  commit('SET_BOARD', name)
};

export const AddBoard = ({ commit, getters }, board) => {
  var boards = [...getters.getBoards]
  boards.push(board)
  commit('SET_BOARDS', boards)
};

export const setBoards = ({ commit }, data) => {
  commit('SET_BOARDS', data)
};

export const resetBoard = ({ commit, getters }, data) => {
  commit('SET_SECTIONS', [])
  commit('SET_SECTIONNAME', [])
  commit('SET_SECTIONS1', [])
  commit('SET_SECTIONNAME1', [])
  commit('SET_TILES', [])
  commit('SET_TILES1', [])
  commit('SET_LABELS', [])
  commit('SET_LABELS1', [])
}

export const setSections = ({ commit }, sections) => {
  // get from the database
  setTimeout(() => {
    commit('SET_SECTIONS', sections)
    commit('SET_SECTIONS1', sections)
  }, 1000)
};

export const setSectionName = ({ commit }, sectionName) => {
  // get from the database
  setTimeout(() => {
    commit('SET_SECTIONNAME', sectionName)
    commit('SET_SECTIONNAME1', sectionName)
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
  var sectionName = [...getters.getSectionName1]
  var a = { 
    'id': `${section.id}-n`, 
    'name': section.name, 
    'width': section.width, 
    'height': section.height, 
    "x": section.x, 
    'y': section.y, 
    'color': section.color 
  }
  setTimeout(() => {
    sections.push(section)
    sectionName.push(a)
    commit('SET_SECTIONNAME', sectionName)
    commit('SET_SECTIONNAME1', sectionName)
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

export const changeSectionName = ({ commit, getters }, data) => {
  var sections = getters.getSectionName1.map(section => {
    if (section.id === data.id) {
      section.x = data.x;
      section.y = data.y;
      section.width = data.width;
      section.height = data.height;
      section.color = data.color;
    }
    return section
  })
  console.log(getters.getSectionName1, sections)
  setTimeout(() => {
    commit('SET_SECTIONNAME1', sections)
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
      tile.event_name = data.event_name;
      tile.event_due = data.event_due;
    }
    return tile
  })
  setTimeout(() => {
    commit('SET_TILES1', tiles)
  }, 1000)

  console.log(getters.getTiles1)
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
  var sectionName = getters.getSectionName1.filter(sectionName => {
    if (!(sectionName.id === id + '-n'))
      return sectionName
  })
  setTimeout(() => {
    commit('SET_SECTIONS1', sections)
    commit('SET_SECTIONNAME1', sectionName)
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

export const arrangeTiles = ({ commit, getters }, id) => {
  var tiles = [...getters.getTiles1]
  var sections = [...getters.getSections1]

  var sectionDetails = {}, sectionDetails1 = {}
  const forSection = id

  // See each tile, in what section does it lie

  tiles.forEach(tile => {

    // console.log(tile)
    let tileX = tile.x, 
      tileY = tile.y,
      tileW = config.tile_width,
      tileH = config.tile_height;
          
    let c1x = +tileX, c1y = +tileY,
      c2x = +tileX + +tileW, c2y = +tileY,
      c3x = +tileX + +tileW, c3y = +tileY + +tileH,
      c4x = +tileX, c4y =  +tileY + +tileH;

    var x, y, w, h;
    // console.log(c1x, c1y, c2x, c2y, c3x, c3y, c4x, c4y)

    sections.forEach((section, index1) => {
      if (section.id === forSection){

        x = +section.x, y = +section.y;
        w = +section.width, h = +section.height;
        // console.log(x, y, x + w, y + h)
        
        if (
          (c1x > x && c1x < (+x + +w) && c1y > y && c1y < (+y + +h)) ||
          (c2x > x && c2x < (+x + +w) && c2y > y && c2y < (+y + +h)) ||
          (c3x > x && c3x < (+x + +w) && c3y > y && c3y < (+y + +h)) ||
          (c4x > x && c4x < (+x + +w) && c4y > y && c4y < (+y + +h))
        ){
          // console.log(`Some point of ${tile.name} is inside the ${section.name}`);

          // store each tile in array of each section

          if (sectionDetails[index1] === undefined){
            sectionDetails[index1] = [tile]
          } else {
            sectionDetails[index1].push(tile)
          }
        }
      }
    })
  })
  console.log('Tiles in each section', sectionDetails)

  // see which tile is first in the section, if the tile has any tile (trailer) in front of it

  // if tile is a truck
  // from the mid of that tile, mark a line to right, see if a trailer is on that line, put both together
  // if tile is a trailer
  // from the mid of that tile, mark a line to left, see if a truck is on that line, join both together
  // if section ends then both are separate

  var truck = [], trailer = [], truckDetailed = [], trailerDetailed = []
  for(let detailedSection in sectionDetails){
    for (let i = 0; i < sectionDetails[detailedSection].length; i++){
      // Only the truck will look for the trailer..
      
      if (sectionDetails[detailedSection][i].name[0] === 'H' || sectionDetails[detailedSection][i].name [0] === 'M' || sectionDetails[detailedSection][i].name[0] ==='L'){
        continue
      }

      let midHeight = ((+sectionDetails[detailedSection][i].y + +config.tile_height) - +sectionDetails[detailedSection][i].y) / 2 
      midHeight = +midHeight + +sectionDetails[detailedSection][i].y
      // console.log(sectionDetails[detailedSection][i].y, 'midHeight', midHeight)

      for (let j = 0; j < sectionDetails[detailedSection].length; j++){
        // Only get see for the trailer
        if (!(sectionDetails[detailedSection][j].name[0] === 'H' || sectionDetails[detailedSection][j].name [0] === 'M' || sectionDetails[detailedSection][j].name[0] ==='L')){
          continue
        }
        if (sectionDetails[detailedSection][j].id === sectionDetails[detailedSection][i].id){
          continue
        }
        // console.log(sectionDetails[detailedSection][j].name, sectionDetails[detailedSection][j].y, +sectionDetails[detailedSection][j].y + +config.tile_height)
        let thisHeight = (+sectionDetails[detailedSection][j].y + +config.tile_height)
        if (sectionDetails[detailedSection][j].y < midHeight && thisHeight > midHeight){
          // console.log(sectionDetails[detailedSection][j].name, 'is in line with', sectionDetails[detailedSection][i].name, 'because', sectionDetails[detailedSection][j].name, "'s starting y", sectionDetails[detailedSection][j].y, 'is less than', midHeight, 'and its ending y (y + height) ', thisHeight , 'is greater than', midHeight)
          if (!(truck.includes(sectionDetails[detailedSection][i].id) || trailer.includes(sectionDetails[detailedSection][i].id))){
            
            if (sectionDetails[detailedSection][i].name[0] === 'H' || sectionDetails[detailedSection][i].name[0] === 'M' || sectionDetails[detailedSection][i].name[0] === 'L'){
              trailer.push(sectionDetails[detailedSection][i].id)
              truck.push(sectionDetails[detailedSection][j].id)
              trailerDetailed.push(sectionDetails[detailedSection][i])
              truckDetailed.push(sectionDetails[detailedSection][j])
            } else {
              trailer.push(sectionDetails[detailedSection][j].id)
              truck.push(sectionDetails[detailedSection][i].id)
              trailerDetailed.push(sectionDetails[detailedSection][j])
              truckDetailed.push(sectionDetails[detailedSection][i])
            }
          }
        }
      }
    }
  }
  console.log(truck, trailer, truckDetailed, trailerDetailed) // who are joined
  
  var sectionDetails2 = {}, sectionDetails3 = {}, sectionDetails4  = {} // Trucks, Both(unsorted) and Trailers
  
  for(let detailedSection in sectionDetails){
    sectionDetails[detailedSection].forEach(tile => {
      if (truck.includes(tile.id) || trailer.includes(tile.id)){
        if (truck.includes(tile.id)){
          if (sectionDetails3[detailedSection] === undefined){
            sectionDetails3[detailedSection] = [tile]
          } else {
            sectionDetails3[detailedSection].push(tile)
          }
        }
      } else {
        if (tile.name[0] === 'H' || tile.name[0] === 'M' || tile.name[0] === 'L'){
          if (sectionDetails4[detailedSection] === undefined){
            sectionDetails4[detailedSection] = [tile]
          } else {
            sectionDetails4[detailedSection].push(tile)
          }
        } else {
          if (sectionDetails2[detailedSection] === undefined){
            sectionDetails2[detailedSection] = [tile]
          } else {
            sectionDetails2[detailedSection].push(tile)
          }
        }
      }
    })
  }
  console.log('lonely trucks', sectionDetails2, 'lonely trailers', sectionDetails4, 'trucks with trailer', sectionDetails3)

  // loop through each array of section to sort (y-axis wise sorting) them (who are both trucks and trailer joined)
  
  for(let detailedSection in sectionDetails3){
    let sorted = sectionDetails3[detailedSection].sort((a, b) => {
      // console.log('a', a.name, a.y, 'b', b.name, b.y)
      if (parseInt(a.y) > parseInt(b.y)) {
        // console.log('b')
        return 1
      } else {
        // console.log('a')
        return -1
      }
    })
    // console.log(sorted)
    sectionDetails1[detailedSection] = sorted
  }
  console.log('After sorting each section', sectionDetails1)

  // arrange it

  // trucks and trailers both
  var tiles1 = [], rows = {}, row;
  for(let detailedSection in sectionDetails1){
    row = 0;
    // console.log(sectionDetails1[detailedSection])
    for (let i = 0; i < sectionDetails1[detailedSection].length; i++){
      // i will represent a row
      // console.log(sectionDetails1[detailedSection][i])

      let idOfTruck = sectionDetails1[detailedSection][i].id
      let truck1Index = truck.indexOf(idOfTruck)
      let trailer1Details = trailerDetailed[truck1Index]

      if (i > 0){
        sectionDetails1[detailedSection][i].y = +sections[detailedSection].y + +config.y_appart_from_section + (+i * (+config.tile_height + +config.y_gap_between_tiles))
        sectionDetails1[detailedSection][i].x = +sections[detailedSection].x + +config.x_appart_from_section

        trailer1Details.y = +sections[detailedSection].y + +config.y_appart_from_section + (+i * (+config.tile_height + +config.y_gap_between_tiles))
        trailer1Details.x = +sections[detailedSection].x + +config.x_appart_from_section + +config.tile_width + +config.x_gap_between_tiles
      } else {
        sectionDetails1[detailedSection][i].y = +sections[detailedSection].y + +config.y_appart_from_section
        sectionDetails1[detailedSection][i].x = +sections[detailedSection].x + +config.x_appart_from_section

        trailer1Details.y = +sections[detailedSection].y + +config.y_appart_from_section
        trailer1Details.x = +sections[detailedSection].x + +config.x_appart_from_section + +config.tile_width + +config.x_gap_between_tiles
      }
      tiles1.push(sectionDetails1[detailedSection][i])
      tiles1.push(trailer1Details)
      // console.log(sectionDetails1[detailedSection][i])
      row++
    }
    if (rows[detailedSection] === undefined){
      rows[detailedSection] = row
    } else {
      rows[detailedSection] = row
    }
  }
  console.log('rows ', rows)
  
  // IMPORTANT: The gap you'll see sometimes between the lonely trucks and the lonely trailer in a section is because when it is time to move to the next row and also the next loop isn't going to run so it will just update the row and the next line (row) would be empty...

  // trucks only
  var times;
  for(let detailedSection in sectionDetails2){
    times = 0;
    if (rows[detailedSection] === undefined){
      rows[detailedSection] = 0
    }
    row = rows[detailedSection]
    // console.log('rows', row, 'times', times)
    // console.log(sectionDetails2[detailedSection])
    for (let j = 0; j < sectionDetails2[detailedSection].length; j++){
      
      // console.log('subject', sectionDetails2[detailedSection][j])
      if (row > 0){
        sectionDetails2[detailedSection][j].y = +sections[detailedSection].y + config.y_appart_from_section + (+row * (+config.tile_height + +config.y_gap_between_tiles))
        sectionDetails2[detailedSection][j].x = +sections[detailedSection].x + config.x_appart_from_section + (+times * (+config.tile_width + +config.x_gap_between_tiles))
      } else {
        sectionDetails2[detailedSection][j].y = +sections[detailedSection].y + +config.y_appart_from_section
        sectionDetails2[detailedSection][j].x = +sections[detailedSection].x + config.x_appart_from_section + (+times * (+config.tile_width + +config.x_gap_between_tiles))
      }
      tiles1.push(sectionDetails2[detailedSection][j])
      // console.log(sectionDetails2[detailedSection][j])
      
      times++
      if (times === sections[detailedSection].max_trucks){
        times = 0;
        rows[detailedSection]++
        row++
      }
    }
    rows[detailedSection]++
  }
  console.log('rows ', rows)
  
  // IMPORTANT: The gap you'll see sometimes between the lonely trucks and the lonely trailer in a section is because when it is time to move to the next row and also the next loop isn't going to run so it will just update the row and the next line (row) would be empty...

  // trailers only
  var times;
  for(let detailedSection in sectionDetails4){
    times = 0;
    if (rows[detailedSection] === undefined){
      rows[detailedSection] = 0
    }
    row = rows[detailedSection]
    // console.log('rows', row)
    // console.log(sectionDetails2[detailedSection])
    for (let j = 0; j < sectionDetails4[detailedSection].length; j++){

      // console.log('subject', sectionDetails4[detailedSection][j])
      if (row > 0){
        sectionDetails4[detailedSection][j].y = +sections[detailedSection].y + config.y_appart_from_section + (+row * (+config.tile_height + +config.y_gap_between_tiles))
        sectionDetails4[detailedSection][j].x = +sections[detailedSection].x + config.x_appart_from_section + (+times * (+config.tile_width + +config.x_gap_between_tiles))
      } else {
        sectionDetails4[detailedSection][j].y = +sections[detailedSection].y + +config.y_appart_from_section
        sectionDetails4[detailedSection][j].x = +sections[detailedSection].x + config.x_appart_from_section + (+times * (+config.tile_width + +config.x_gap_between_tiles))
      }
      tiles1.push(sectionDetails4[detailedSection][j])
      // console.log(sectionDetails2[detailedSection][j])
      
      times++
      if (times === sections[detailedSection].max_trailers){
        times = 0;
        rows[detailedSection]++
        row++
      }
    }
    rows[detailedSection]++
  }
  console.log('rows ', rows)

  // Push extra tiles (tiles which are out of concern and we don't want to arrange them) into the tiles array without changing

  tiles.forEach(tile => {

    // Remember there would be just 1 element inside the sectionDetails because we are arranging just 1 section

    for(let detailedSection in sectionDetails){
      if (!sectionDetails[detailedSection].includes(tile)){
        tiles1.push(tile)
      }
    }
  })

  console.log('Final result', tiles1)

  commit('SET_TILES', tiles1)
  commit('SET_TILES1', tiles1)
  // setTimeout(() => console.log(this.$store.getters.getTiles), 1000)
};

export const sortTiles = ({ commit, getters }, id) => {

  var tiles = [...getters.getTiles1]
  var sections = [...getters.getSections1]

  var sectionDetails = {}
  const forSection = id

  // See each tile, in what section does it lie

  tiles.forEach(tile => {

    // console.log(tile)
    let tileX = tile.x, 
      tileY = tile.y,
      tileW = config.tile_width,
      tileH = config.tile_height;
          
    let c1x = +tileX, c1y = +tileY,
      c2x = +tileX + +tileW, c2y = +tileY,
      c3x = +tileX + +tileW, c3y = +tileY + +tileH,
      c4x = +tileX, c4y =  +tileY + +tileH;

    var x, y, w, h;
    // console.log(c1x, c1y, c2x, c2y, c3x, c3y, c4x, c4y)

    sections.forEach((section, index1) => {
      if (section.id === forSection){

        x = +section.x, y = +section.y;
        w = +section.width, h = +section.height;
        // console.log(x, y, x + w, y + h)
        
        if (
          (c1x > x && c1x < (+x + +w) && c1y > y && c1y < (+y + +h)) ||
          (c2x > x && c2x < (+x + +w) && c2y > y && c2y < (+y + +h)) ||
          (c3x > x && c3x < (+x + +w) && c3y > y && c3y < (+y + +h)) ||
          (c4x > x && c4x < (+x + +w) && c4y > y && c4y < (+y + +h))
        ){
          // console.log(`Some point of ${tile.name} is inside the ${section.name}`);

          // store each tile in array of each section

          if (sectionDetails[index1] === undefined){
            sectionDetails[index1] = [tile]
          } else {
            sectionDetails[index1].push(tile)
          }
        }
      }
    })
  })
  console.log('Tiles in each section', sectionDetails)

  // see which tile is first in the section, if the tile has any tile (trailer) in front of it

  // if tile is a truck
  // from the mid of that tile, mark a line to right, see if a trailer is on that line, put both together
  // if tile is a trailer
  // from the mid of that tile, mark a line to left, see if a truck is on that line, join both together
  // if section ends then both are separate

  var truck = [], trailer = [], truckDetailed = [], trailerDetailed = []
  for(let detailedSection in sectionDetails){
    for (let i = 0; i < sectionDetails[detailedSection].length; i++){
      // Only the truck will look for the trailer..
      
      if (sectionDetails[detailedSection][i].name[0] === 'H' || sectionDetails[detailedSection][i].name [0] === 'M' || sectionDetails[detailedSection][i].name[0] ==='L'){
        continue
      }

      let midHeight = ((+sectionDetails[detailedSection][i].y + +config.tile_height) - +sectionDetails[detailedSection][i].y) / 2 
      midHeight = +midHeight + +sectionDetails[detailedSection][i].y
      // console.log(sectionDetails[detailedSection][i].y, 'midHeight', midHeight)

      for (let j = 0; j < sectionDetails[detailedSection].length; j++){
        // Only get see for the trailer
        if (!(sectionDetails[detailedSection][j].name[0] === 'H' || sectionDetails[detailedSection][j].name [0] === 'M' || sectionDetails[detailedSection][j].name[0] ==='L')){
          continue
        }
        if (sectionDetails[detailedSection][j].id === sectionDetails[detailedSection][i].id){
          continue
        }
        // console.log(sectionDetails[detailedSection][j].name, sectionDetails[detailedSection][j].y, +sectionDetails[detailedSection][j].y + +config.tile_height)
        let thisHeight = (+sectionDetails[detailedSection][j].y + +config.tile_height)
        if (sectionDetails[detailedSection][j].y < midHeight && thisHeight > midHeight){
          console.log(sectionDetails[detailedSection][j].name, 'is in line with', sectionDetails[detailedSection][i].name, 'because', sectionDetails[detailedSection][j].name, "'s starting y", sectionDetails[detailedSection][j].y, 'is less than', midHeight, 'and its ending y (y + height) ', thisHeight , 'is greater than', midHeight)
          if (!(truck.includes(sectionDetails[detailedSection][i].id) || trailer.includes(sectionDetails[detailedSection][i].id))){
            
            if (sectionDetails[detailedSection][i].name[0] === 'H' || sectionDetails[detailedSection][i].name[0] === 'M' || sectionDetails[detailedSection][i].name[0] === 'L'){
              trailer.push(sectionDetails[detailedSection][i].id)
              truck.push(sectionDetails[detailedSection][j].id)
              trailerDetailed.push(sectionDetails[detailedSection][i])
              truckDetailed.push(sectionDetails[detailedSection][j])
            } else {
              trailer.push(sectionDetails[detailedSection][j].id)
              truck.push(sectionDetails[detailedSection][i].id)
              trailerDetailed.push(sectionDetails[detailedSection][j])
              truckDetailed.push(sectionDetails[detailedSection][i])
            }
          }
        }
      }
    }
  }
  console.log(truck, trailer, truckDetailed, trailerDetailed) // who are joined

  var sectionDetails2 = {}, sectionDetails3 = {}, sectionDetails4  = {} // Trucks, Both(unsorted) and Trailers

  for(let detailedSection in sectionDetails){
    sectionDetails[detailedSection].forEach(tile => {
      if (truck.includes(tile.id) || trailer.includes(tile.id)){
        if (truck.includes(tile.id)){
          if (sectionDetails3[detailedSection] === undefined){
            sectionDetails3[detailedSection] = [tile]
          } else {
            sectionDetails3[detailedSection].push(tile)
          }
        }
      } else {
        if (tile.name[0] === 'H' || tile.name[0] === 'M' || tile.name[0] === 'L'){
          if (sectionDetails4[detailedSection] === undefined){
            sectionDetails4[detailedSection] = [tile]
          } else {
            sectionDetails4[detailedSection].push(tile)
          }
        } else {
          if (sectionDetails2[detailedSection] === undefined){
            sectionDetails2[detailedSection] = [tile]
          } else {
            sectionDetails2[detailedSection].push(tile)
          }
        }
      }
    })
  }
  console.log('lonely trucks', sectionDetails2, 'lonely trailers', sectionDetails4, 'trucks with trailer', sectionDetails3)

  // loop through each array of section to sort (y-axis wise sorting) them (who are both trucks and trailer joined)

  var sectionDetails1 = {};

  // Sorting trucks with trailers
  for(let detailedSection in sectionDetails3){
    let sorted = sectionDetails3[detailedSection].sort((a, b) => {

      let aName = a.name.replace ( /[^\d.]/g, '' ), bName = b.name.replace ( /[^\d.]/g, '' );
      // console.log('a', a.name, aName, 'b', b.name, bName)

      if (parseInt(aName) > parseInt(bName)) {
        // console.log('b')
        return 1
      } else {
        // console.log('a')
        return -1
      }
    })
    // console.log(sorted)
    sectionDetails1[detailedSection] = sorted.reverse()
  }
  console.log('After sorting trucks-trailer in section', sectionDetails1)

  var sectionDetails5 = {}, sectionDetails6 = {}

  // Sorting trucks
  for(let detailedSection in sectionDetails2){
    let sorted = sectionDetails2[detailedSection].sort((a, b) => {

      let aName = a.name.replace ( /[^\d.]/g, '' ), bName = b.name.replace ( /[^\d.]/g, '' );
      // console.log('a', a.name, aName, 'b', b.name, bName)

      if (parseInt(aName) > parseInt(bName)) {
        // console.log('b')
        return 1
      } else {
        // console.log('a')
        return -1
      }
    })
    // console.log(sorted)
    sectionDetails5[detailedSection] = sorted.reverse()
  }
  console.log('After sorting trucks in section', sectionDetails5)

  // Sorting trailers
  for(let detailedSection in sectionDetails4){
    let sorted = sectionDetails4[detailedSection].sort((a, b) => {

      let aName = a.name.replace ( /[^\d.]/g, '' ), bName = b.name.replace ( /[^\d.]/g, '' );
      // console.log('a', a.name, aName, 'b', b.name, bName)

      if (parseInt(aName) > parseInt(bName)) {
        // console.log('b')
        return 1
      } else {
        if (a.name[0] === 'H' && b.name[0] === 'L'){
          // console.log('b')
          return 1
        } else if (a.name[0] === 'H' && b.name[0] === 'M'){
          // console.log('b')
          return 1
        } else if (a.name[0] === 'H' && b.name[0] === 'H'){
          // console.log('b')
          return 1
        } else if (a.name[0] === 'M' && b.name[0] === 'L'){
          // console.log('b')
          return 1
        } else if (a.name[0] === 'M' && b.name[0] === 'M'){
          // console.log('b')
          return 1
        } else if (a.name[0] === 'M' && b.name[0] === 'H'){
          // console.log('a')
          return -1
        } else if (a.name[0] === 'L' && b.name[0] === 'L'){
          // console.log('b')
          return 1
        } else if (a.name[0] === 'L' && b.name[0] === 'M'){
          // console.log('a')
          return -1
        } else if (a.name[0] === 'L' && b.name[0] === 'H'){
          // console.log('a')
          return -1
        } else {
          // console.log('a')
          return -1
        }
      }
    })
    // console.log(sorted)
    sectionDetails6[detailedSection] = sorted.reverse()
  }
  console.log('After sorting trailers in section', sectionDetails6)

  console.log('After sorting in this section', 'trucks are', sectionDetails5, 'trailers are', sectionDetails6, 'tucks-trailers are', sectionDetails1)

  // arrange them

  // trucks and trailers both
  var tiles1 = [], rows = {}, row;
  for(let detailedSection in sectionDetails1){
    row = 0;
    // console.log(sectionDetails1[detailedSection])
    for (let i = 0; i < sectionDetails1[detailedSection].length; i++){
      // i will represent a row
      // console.log(sectionDetails1[detailedSection][i])

      let idOfTruck = sectionDetails1[detailedSection][i].id
      let truck1Index = truck.indexOf(idOfTruck)
      let trailer1Details = trailerDetailed[truck1Index]

      if (i > 0){
        sectionDetails1[detailedSection][i].y = +sections[detailedSection].y + +config.y_appart_from_section + (+i * (+config.tile_height + +config.y_gap_between_tiles))
        sectionDetails1[detailedSection][i].x = +sections[detailedSection].x + +config.x_appart_from_section

        trailer1Details.y = +sections[detailedSection].y + +config.y_appart_from_section + (+i * (+config.tile_height + +config.y_gap_between_tiles))
        trailer1Details.x = +sections[detailedSection].x + +config.x_appart_from_section + +config.tile_width + +config.x_gap_between_tiles
      } else {
        sectionDetails1[detailedSection][i].y = +sections[detailedSection].y + +config.y_appart_from_section
        sectionDetails1[detailedSection][i].x = +sections[detailedSection].x + +config.x_appart_from_section

        trailer1Details.y = +sections[detailedSection].y + +config.y_appart_from_section
        trailer1Details.x = +sections[detailedSection].x + +config.x_appart_from_section + +config.tile_width + +config.x_gap_between_tiles
      }
      tiles1.push(sectionDetails1[detailedSection][i])
      tiles1.push(trailer1Details)
      // console.log(sectionDetails1[detailedSection][i])
      row++
    }
    if (rows[detailedSection] === undefined){
      rows[detailedSection] = row
    } else {
      rows[detailedSection] = row
    }
  }
  console.log('rows ', rows)

  // IMPORTANT: The gap you'll see sometimes between the lonely trucks and the lonely trailer in a section is because when it is time to move to the next row and also the next loop isn't going to run so it will just update the row and the next line (row) would be empty...

  // trucks only
  var times;
  for(let detailedSection in sectionDetails5){
    times = 0;
    if (rows[detailedSection] === undefined){
      rows[detailedSection] = 0
    }
    row = rows[detailedSection]
    // console.log('rows', row, 'times', times)
    // console.log(sectionDetails5[detailedSection])
    for (let j = 0; j < sectionDetails5[detailedSection].length; j++){
      
      // console.log('subject', sectionDetails5[detailedSection][j])
      if (row > 0){
        sectionDetails5[detailedSection][j].y = +sections[detailedSection].y + config.y_appart_from_section + (+row * (+config.tile_height + +config.y_gap_between_tiles))
        sectionDetails5[detailedSection][j].x = +sections[detailedSection].x + config.x_appart_from_section + (+times * (+config.tile_width + +config.x_gap_between_tiles))
      } else {
        sectionDetails5[detailedSection][j].y = +sections[detailedSection].y + +config.y_appart_from_section
        sectionDetails5[detailedSection][j].x = +sections[detailedSection].x + config.x_appart_from_section + (+times * (+config.tile_width + +config.x_gap_between_tiles))
      }
      tiles1.push(sectionDetails5[detailedSection][j])
      // console.log(sectionDetails5[detailedSection][j])
      
      times++
      if (times === sections[detailedSection].max_trucks){
        times = 0;
        rows[detailedSection]++
        row++
      }
    }
    rows[detailedSection]++
  }
  console.log('rows ', rows)

  // IMPORTANT: The gap you'll see sometimes between the lonely trucks and the lonely trailer in a section is because when it is time to move to the next row and also the next loop isn't going to run so it will just update the row and the next line (row) would be empty...

  // trailers only
  var times;
  for(let detailedSection in sectionDetails6){
    times = 0;
    if (rows[detailedSection] === undefined){
      rows[detailedSection] = 0
    }
    row = rows[detailedSection]
    // console.log('rows', row)
    // console.log(sectionDetails6[detailedSection])
    for (let j = 0; j < sectionDetails6[detailedSection].length; j++){

      // console.log('subject', sectionDetails6[detailedSection][j])
      if (row > 0){
        sectionDetails6[detailedSection][j].y = +sections[detailedSection].y + config.y_appart_from_section + (+row * (+config.tile_height + +config.y_gap_between_tiles))
        sectionDetails6[detailedSection][j].x = +sections[detailedSection].x + config.x_appart_from_section + (+times * (+config.tile_width + +config.x_gap_between_tiles))
      } else {
        sectionDetails6[detailedSection][j].y = +sections[detailedSection].y + +config.y_appart_from_section
        sectionDetails6[detailedSection][j].x = +sections[detailedSection].x + config.x_appart_from_section + (+times * (+config.tile_width + +config.x_gap_between_tiles))
      }
      tiles1.push(sectionDetails6[detailedSection][j])
      // console.log(sectionDetails6[detailedSection][j])
      
      times++
      if (times === sections[detailedSection].max_trailers){
        times = 0;
        rows[detailedSection]++
        row++
      }
    }
    rows[detailedSection]++
  }
  console.log('rows ', rows)

  // Push extra tiles (tiles which are out of concern and we don't want to arrange them) into the tiles array without changing

  // console.log('sectionDetails', sectionDetails)
  tiles.forEach(tile => {

    // Remember there would be just 1 element inside the sectionDetails because we are arranging just 1 section

    for(let detailedSection in sectionDetails){
      if (!sectionDetails[detailedSection].includes(tile)){
        tiles1.push(tile)
      }
    }
  })

  console.log('Final result', tiles1)

  commit('SET_TILES', tiles1)
  commit('SET_TILES1', tiles1)
}