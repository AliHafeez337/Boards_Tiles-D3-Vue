<template>
  <navbar
    position="fixed"
    type="white"
    :transparent="transparent"
    :color-on-scroll="colorOnScroll"
    menu-classes="ml-auto"
  >
    <template slot-scope="{ toggle, isToggled }">
      <router-link v-popover:popover1 class="navbar-brand" to="/">
        Now Ui Kit
      </router-link>
      <el-popover
        ref="popover1"
        popper-class="popover"
        placement="bottom"
        width="200"
        trigger="hover"
      >
        <div class="popover-body">
          Designed by Invision. Coded by Creative Tim
        </div>
      </el-popover>
    </template>
    <template slot="navbar-menu">
        <!-- addon-right-icon="now-ui-icons users_single-02" -->
      <fginput
        v-if="ifBoard"
        placeholder="Search the tile"
        v-model="search"
      >
      </fginput>
      <drop-down
        tag="li"
        title="Examples"
        icon="now-ui-icons design_image"
        class="nav-item"
      >
        <nav-link to="/landing">
          <i class="now-ui-icons education_paper"></i> Landing
        </nav-link>
        <nav-link to="/login">
          <i class="now-ui-icons users_circle-08"></i> Login
        </nav-link>
        <nav-link to="/profile">
          <i class="now-ui-icons users_single-02"></i> Profile
        </nav-link>
      </drop-down>
      <drop-down
        tag="li"
        title="Boards"
        icon="now-ui-icons design_app"
        class="nav-item"
      >
        <!-- <nav-link to="/">
          <i class="now-ui-icons business_chart-pie-36"></i> All components
        </nav-link> -->
        <a
          href="javascript:void(0)"
          @click="getBoard('board1')"
          class="dropdown-item"
        >
          Board 1
        </a>
      </drop-down>
      <drop-down
        v-if="ifBoard"
        tag="li"
        title="New"
        icon="now-ui-icons ui-1_simple-add"
        class="nav-item"
      >
        <a
          href="javascript:void(0)"
          @click="pushSection()"
          class="dropdown-item"
        >
          Section
        </a>
        <a
          href="javascript:void(0)"
          @click="pushTile()"
          class="dropdown-item"
        >
          Tile
        </a>
      </drop-down>
      <li class="nav-item">
        <a
          class="nav-link btn btn-neutral"
          href="javascript:void(0)"
          @click="arrange()"
        >
          <i class="now-ui-icons ui-1_check"></i>
          &nbsp;
          <p>Arrange</p>
        </a>
      </li>

      <li class="nav-item">
        <a
          class="nav-link"
          rel="tooltip"
          title="Follow us on Twitter"
          data-placement="bottom"
          href="https://twitter.com/CreativeTim"
          target="_blank"
        >
          <i class="fab fa-twitter"></i>
          <p class="d-lg-none d-xl-none">Twitter</p>
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          rel="tooltip"
          title="Like us on Facebook"
          data-placement="bottom"
          href="https://www.facebook.com/CreativeTim"
          target="_blank"
        >
          <i class="fab fa-facebook-square"></i>
          <p class="d-lg-none d-xl-none">Facebook</p>
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          rel="tooltip"
          title="Follow us on Instagram"
          data-placement="bottom"
          href="https://www.instagram.com/CreativeTimOfficial"
          target="_blank"
        >
          <i class="fab fa-instagram"></i>
          <p class="d-lg-none d-xl-none">Instagram</p>
        </a>
      </li>
    </template>
  </navbar>
</template>

<script>
import { DropDown, NavbarToggleButton, Navbar, NavLink } from '@/components';
import { Popover } from 'element-ui';
import fginput from '../components/Inputs/formGroupInput-duplicate';

import { config } from '../CONFIG';

export default {
  name: 'main-navbar',
  components: {
    DropDown,
    Navbar,
    NavbarToggleButton,
    NavLink,
    [Popover.name]: Popover,
    fginput
  },
  props: {
    transparent: Boolean,
    colorOnScroll: Number
  },
  data() {
    return {
      search: '',
      pickers: {
        datePicker: ''
      }
    }
  },
  watch: {
    search: function (val) {
      // this.$store.dispatch('copyBoard')
      this.$store.dispatch('setSearch', val)
    }
  },
  computed: {
    ifBoard() {
      if (this.$store.getters.getBoard){
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    scrollToElement() {
      let element_id = document.getElementById("downloadSection");
      if (element_id) {
        element_id.scrollIntoView({ block: "end", behavior: "smooth" });
      }
    },
    getBoard(board) {
      this.scrollToElement();
      if (board === 'board1'){
        var sections =  [
          { 'id': 'aqxn9u0yv3', 'name': '0ABC', 'width': config.section_width, 'height': config.section_height, "x": 20, 'y': 20, 'color': config.new_section_color },
          { 'id': 'a0nyn15mj3', 'name': '1BCD', 'width': config.section_width, 'height': config.section_height, "x": 250, 'y': 20, 'color': config.new_section_color },
          { 'id': 'ayquazchds', 'name': '2CDE', 'width': config.section_width, 'height': config.section_height, "x": 520, 'y': 20, 'color': config.new_section_color }
        ], tiles = [
          { 'id': 'azkbug6kyx', 'name': 'A1PSL', "x": 30, 'y': 50, "color" : "brown", 'backLeft': false, 'backLTitle': '', 'backRight': false, 'backRTitle': '', 'event_name': 'Event', 'event_due': 1593537002 }, // due in next 3 days
          { 'id': 'atrnrt7tmm', 'name': 'B02PSL', "x": 260, 'y': 50, "color" : "purple", 'backLeft': false, 'backLTitle': '', 'backRight': true, 'backRTitle': 'ccc', 'event_name': 'Event', 'event_due': 1593882602 }, // due in next 7 days
          { 'id': 'atrnrt7tmp', 'name': 'B03PSL', "x": 260, 'y': 150, "color" : "purple", 'backLeft': false, 'backLTitle': '', 'backRight': false, 'backRTitle': '', 'event_name': 'Event', 'event_due': 1593882602 }, // due in next 7 days
          { 'id': 'atrnrt7tmn', 'name': 'HB02', "x": 350, 'y': 50, "color" : "purple", 'backLeft': false, 'backLTitle': '', 'backRight': false, 'backRTitle': '', 'event_name': 'Event', 'event_due': 1593882602 }, // due in next 7 days
          { 'id': 'atrnrt7tmo', 'name': 'MB02', "x": 350, 'y': 100, "color" : "purple", 'backLeft': false, 'backLTitle': '', 'backRight': false, 'backRTitle': '', 'event_name': 'Event', 'event_due': 1593882602 }, // due in next 7 days
          { 'id': 'ak693b4ofl', 'name': 'C10PSL', "x": 530, 'y': 50, "color" : "#DA70D6", 'backLeft': false, 'backLTitle': '', 'backRight': false, 'backRTitle': '', 'event_name': 'Event', 'event_due': null }, // 1595869802 = due in next 30 days
          { 'id': 'ak693b4ofm', 'name': 'MC10', "x": 625, 'y': 50, "color" : "#DA70D6", 'backLeft': false, 'backLTitle': '', 'backRight': false, 'backRTitle': '', 'event_name': 'Event', 'event_due': null } // 1595869802 = due in next 30 days
        ], labels = [
          // { 'tile': 'atrnrt7tmm', "color" : "orange" },
          // { 'tile': 'azkbug6kyx', "color" : "red" },
          // { 'tile': 'atrnrt7tmm', "color" : "red" },
          // { 'tile': 'ak693b4ofl', "color" : "green" },
          // { 'tile': 'atrnrt7tmm', "color" : "red" }
        ]
        this.$store.dispatch('setBoard', board)
        this.$store.dispatch('setSections', sections)
        this.$store.dispatch('setTiles', tiles)
        this.$store.dispatch('setLabels', labels)
      }
    },
    pushSection() {
      this.scrollToElement();
      if (this.$store.getters.getBoard){
        this.$store.dispatch('setModalSection', true)
      }
    },
    pushTile() {
      this.scrollToElement();
      if (this.$store.getters.getBoard){
        this.$store.dispatch('setModalTile', true)
      }
    },
    arrange() {
      // this.$store.dispatch('arrangeTiles')
      
      var tiles = [...this.$store.getters.getTiles1]
      var sections = [...this.$store.getters.getSections1]
      var sectionDetails = {}, sectionDetails1 = {}

      // See each tile, in what section does it lie

      tiles.forEach(tile => {

        console.log(tile)
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
          x = +section.x, y = +section.y;
          w = +section.width, h = +section.height;
          // console.log(x, y, x + w, y + h)
          
          if (
            (c1x > x && c1x < (+x + +w) && c1y > y && c1y < (+y + +h)) ||
            (c2x > x && c2x < (+x + +w) && c2y > y && c2y < (+y + +h)) ||
            (c3x > x && c3x < (+x + +w) && c3y > y && c3y < (+y + +h)) ||
            (c4x > x && c4x < (+x + +w) && c4y > y && c4y < (+y + +h))
          ){
            console.log(`Some point of ${tile.name} is inside the ${section.name}`);

            // store each tile in array of each section

            if (sectionDetails[index1] === undefined){
              sectionDetails[index1] = [tile]
            } else {
              sectionDetails[index1].push(tile)
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
      console.log(sectionDetails2, sectionDetails4, sectionDetails3)

      // loop through each array of section to sort (y-axis wise sorting) them (who are both trucks and trailer joined)
      
      // Don't know why, practically while testing, I was not needing to sort them, they were always already sorted... but I think I need to sort them...
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
      
      var times = 0, times1 = 0
      for(let detailedSection in sectionDetails2){
        if (rows[detailedSection] === undefined){
          rows[detailedSection] = 0
        }
        row = rows[detailedSection] +times1
        console.log('rows', row)
        // console.log(sectionDetails2[detailedSection])
        for (let j = 0; j < sectionDetails2[detailedSection].length; j++){
          
          console.log('subject', sectionDetails2[detailedSection][j])
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
          if (times === config.no_of_tiles_in_a_row){
            times = 0;
            rows[detailedSection]++
            times1++
            row++
          }
        }
        rows[detailedSection]++
        times1++
      }
      console.log('rows ', rows)
      console.log('Final result', tiles1)
      this.$store.dispatch('setTiles', tiles1)
      // setTimeout(() => console.log(this.$store.getters.getTiles), 1000)
    }
  }
};
</script>

<style scoped></style>
