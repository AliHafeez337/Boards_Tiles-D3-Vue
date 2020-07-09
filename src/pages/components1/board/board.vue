
<template>
  <div id="board">
    <!-- Navbar Warning -->
    <!-- style="position: static;" -->
    <navbar type="warning" menu-classes="ml-auto" v-if="ifBoard">
      <div class="navbar-translate">
        <span style="color: white; text-align: center;">
          Please select a board first...
        </span>
      </div>
    </navbar>
    <!-- End Navbar Warning -->

    <!-- Modal Tile -->
    <modal :show="modalTile" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Tile basic info</h4>
      <div class="datepicker-container">
        <fginput
          placeholder="Tile Name"
          v-model="tile.name"
        />
        <fginput
          placeholder="Tile Event Name"
          v-model="tile.event_name"
        />
        <fginput>
          <el-date-picker
            type="date"
            popper-class="date-picker date-picker-primary"
            placeholder="Date Time Picker"
            v-model="tile.event_due"
          >
          </el-date-picker>
        </fginput>
      </div>
      <template slot="footer">
        <nbutton type="success" @click="AddTile()" :disabled="isDisabled()"
          >Add Tile</nbutton
        >
        <nbutton type="danger" @click="closeButton()"
          >Close</nbutton
        >
      </template>
    </modal>

    <!-- Modal Section -->
    <modal :show="modalSection" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Section basic info</h4>
      <div class="datepicker-container">
        <fginput
          placeholder="Section Name"
          v-model="section.name"
        />
        <fginput
          placeholder="Max lonely trucks in a row"
          v-model="section.max_trucks"
        />
        <fginput
          placeholder="Max lonely trailers in a row"
          v-model="section.max_trailers"
        />
      </div>
      <template slot="footer">
        <nbutton type="success" @click="AddSection()" :disabled="isDisabled1()"
          >Add Section</nbutton
        >
        <nbutton type="danger" @click="closeButton()"
          >Close</nbutton
        >
      </template>
    </modal>

    <!-- Modal Board -->
    <modal :show="modalBoard" headerClasses="justify-content-center">
      <template slot="header">
        <h4 class="title title-up">Boards</h4>
        <nbutton v-if="!addBoard" type="success" @click="newBoard()"
          >New Board</nbutton
        >
      </template>
      <div class="datepicker-container" v-if="addBoard">
        <fginput
          placeholder="Enter the new board name."
          v-model="tempBoardName"
        />
      </div>
      <div class="datepicker-container" v-else>
        <ol id="example-1">
          <li v-for="(board, index) in boards" :key="index">
            <a
              href="javascript:void(0)"
              @click="setBoard(board)"
              class="dropdown-item"
            >
              {{ board }}
            </a>
          </li>
        </ol>
      </div>
      <template slot="footer">
        <nbutton v-if="addBoard" type="success" @click="addNewBoard()" :disabled="!tempBoardName"
          >Add Board</nbutton
        >
        <nbutton v-if="addBoard" type="danger" @click="cancelNewBoard()"
          >Cancel</nbutton
        >
        <nbutton v-if="!addBoard" type="danger" @click="closeButton()"
          >Close</nbutton
        >
      </template>
    </modal>

    <!-- Modal Color -->
    <modal :show="modalColor" headerClasses="justify-content-center">
      <template slot="header">
        <h4 class="title title-up">Select Color</h4>
      </template>
      <div class="datepicker-container" :style="{ background: color }">
        <div :style="{ width: '40%', 'margin-left': 'auto', 'margin-right': 'auto' }">
          <color-picker
            theme="dark"
            :color="color"
            :sucker-hide="false"
            @changeColor="changeColor"
          />
        </div>
      </div>
      <template slot="footer">
        <nbutton type="success" @click="addColor()"
          >Add Color</nbutton
        >
        <nbutton type="danger" @click="closeButton()"
          >Close</nbutton
        >
      </template>
    </modal>

    <input type="color" id="color" hidden/>
    
    <!-- Modal Detils -->
    <modal :show="modalDetails" headerClasses="justify-content-center">
      <template slot="header">
        <h4 class="title title-up">Tile Details</h4>
      </template>
      <div class="datepicker-container">
        <strong>Tile name:</strong>&nbsp;
        <span>{{tileDetails.name}}</span>
        <br />
        <strong>Event name:</strong>&nbsp;
        <span>{{tileDetails.event_name}}</span>
        <br />
        <strong>Event due date:</strong>&nbsp;
        <span>{{this.due}}</span>
        <br />
        <strong>Back-loaded left title:</strong>&nbsp;
        <span>{{tileDetails.backLTitle}}</span>
        <br />
        <strong>Back-loaded right title:</strong>&nbsp;
        <span>{{tileDetails.backRTitle}}</span>
        <br />
        <br />
      </div>
      <template slot="footer">
        <nbutton type="danger" @click="closeButton()"
          >Close</nbutton
        >
      </template>
    </modal>

    <D3 
      :sections="sections" 
      :tiles="tiles"
      :labels="labels"
      :search="search"
      :key="d3"
    />
  </div>
</template>
 
<script>
  import D3 from './D3/D3';
  import modal from '../../../components/Modal-duplicate';
  import nbutton from '../../../components/Button-duplicate';
  import fginput from '../../../components/Inputs/formGroupInput-duplicate';;
  import { DatePicker } from 'element-ui';
  import { config } from '../../../CONFIG';
  import { Navbar, DropDown } from '@/components';
  import colorPicker from '@caohenghu/vue-colorpicker'

  export default {
    components: {
      D3,
      modal,
      nbutton,
      fginput,
      [DatePicker.name]: DatePicker,
      Navbar,
      DropDown,
      colorPicker
    },
    data() {
      return {
        d3: 0,
        tempBoardName: '',
        addBoard: false,
        tile: {
          name: '',
          event_name: '',
          event_due: ''
        },
        section: {
          name: '',
          max_trucks: 2,
          max_trailers: 2
        },
        color: '#59c7f9',
        due: ''
      }
    },
    computed: {
      boards() {
        return this.$store.getters.getBoards
      },
      ifBoard() {
       if (this.$store.getters.getBoard){
         return false
       } else {
         return true
       }
      },
      modalTile() {
        return this.$store.getters.getModalTile;
      },
      modalSection(){
        return this.$store.getters.getModalSection;
      },
      modalBoard() {
        return this.$store.getters.getModalBoard;
      },
      modalColor() {
        return this.$store.getters.getModalColor;
      },
      modalDetails() {
        return this.$store.getters.getModalDetails;
      },
      tileDetails() {
        var a = this.$store.getters.getTile
        if (a.event_due){
          this.due = new Date(a.event_due * 1000);
        }
        return a;
      },
      sections() {
        return this.$store.getters.getSections;
      },
      tiles() {
        return this.$store.getters.getTiles;
      },
      labels() {
        return this.$store.getters.getLabels;
      },
      search() {
        return this.$store.getters.getSearch;
      }
    },
    watch: {
      sections: function (val) {
        console.log('SECTIONS', val)
        this.d3 += 1
      },
      tiles: function (val) {
        console.log('TILES', val)
        this.d3 += 1
      },
      labels: function (val) {
        console.log('LABELS', val)
        this.d3 += 1
      },
      search: function (val) {
        console.log('SEARCH', val)
        this.d3 += 1
      }
    },
    methods: {
      changeColor(color) {
        this.color = color.hex
      },
      addColor() {
        this.$store.dispatch('setColor', this.color)
        this.closeButton()
      },
      scrollToElement() {
        let element_id = document.getElementById("downloadSection");
        if (element_id) {
          element_id.scrollIntoView({ block: "end", behavior: "smooth" });
        }
      },
      newBoard() {
        this.addBoard = true
      },
      addNewBoard() {
        this.$store.dispatch('AddBoard', this.tempBoardName)
        this.tempBoardName = ''
        this.addBoard = false
      },
      cancelNewBoard() {
        this.tempBoardName = ''
        this.addBoard = false
      },
      setBoard(board) {
        this.scrollToElement();
        if (board === 'board1'){
          var sections =  [
            { 'id': 'aqxn9u0yv3', 'name': '0ABC', 'max_trucks': 1, 'max_trailers': 1, 'width': config.section_width, 'height': config.section_height, "x": 20, 'y': 20, 'color': config.new_section_color },
            { 'id': 'a0nyn15mj3', 'name': '1BCD', 'max_trucks': 1, 'max_trailers': 2, 'width': config.section_width, 'height': config.section_height, "x": 250, 'y': 20, 'color': config.new_section_color },
            { 'id': 'ayquazchds', 'name': '2CDE', 'max_trucks': 2, 'max_trailers': 1, 'width': config.section_width, 'height': config.section_height, "x": 520, 'y': 20, 'color': config.new_section_color }
          ], tiles = [
            { 'id': 'atrnrt7tmm', 'name': 'B02PSL', "x": 260, 'y': 50, "color" : "purple", 'backLeft': false, 'backLTitle': '', 'backRight': true, 'backRTitle': 'ccc', 'event_name': 'Event', 'event_due': 1593882602 }, // due in next 7 days
            { 'id': 'atrnrt7tmp', 'name': 'B03PSL', "x": 260, 'y': 150, "color" : "purple", 'backLeft': false, 'backLTitle': '', 'backRight': false, 'backRTitle': '', 'event_name': 'Event', 'event_due': 1593882602 }, // due in next 7 days
            { 'id': 'azkbug6kyx', 'name': 'A1PSL', "x": 30, 'y': 50, "color" : "brown", 'backLeft': false, 'backLTitle': '', 'backRight': false, 'backRTitle': '', 'event_name': 'Event', 'event_due': 1593537002 }, // due in next 3 days
            { 'id': 'atrnrt7tmn', 'name': 'HB02', "x": 350, 'y': 50, "color" : "purple", 'backLeft': false, 'backLTitle': '', 'backRight': false, 'backRTitle': '', 'event_name': 'Event', 'event_due': 1593882602 }, // due in next 7 days
            { 'id': 'atrnrt7tmo', 'name': 'MB02', "x": 350, 'y': 100, "color" : "purple", 'backLeft': false, 'backLTitle': '', 'backRight': false, 'backRTitle': '', 'event_name': 'Event', 'event_due': 1593882602 }, // due in next 7 days
            { 'id': 'ak693b4ofl', 'name': 'C10PSL', "x": 530, 'y': 50, "color" : "#DA70D6", 'backLeft': false, 'backLTitle': '', 'backRight': false, 'backRTitle': '', 'event_name': 'Event', 'event_due': null }, // 1595869802 = due in next 30 days
            { 'id': 'ak693b4ofm', 'name': 'MC10', "x": 625, 'y': 50, "color" : "#DA70D6", 'backLeft': false, 'backLTitle': '', 'backRight': false, 'backRTitle': '', 'event_name': 'Event', 'event_due': null } // 1595869802 = due in next 30 days
          ], labels = [
            { 'tile': 'atrnrt7tmm', "color" : "orange" },
            { 'tile': 'azkbug6kyx', "color" : "red" },
            { 'tile': 'atrnrt7tmm', "color" : "red" },
            { 'tile': 'ak693b4ofl', "color" : "green" },
            { 'tile': 'atrnrt7tmm', "color" : "red" }
          ]
          this.$store.dispatch('setBoard', board)
          this.$store.dispatch('setSections', sections)
          this.$store.dispatch('setTiles', tiles)
          this.$store.dispatch('setLabels', labels)
          this.closeButton()
        } else {
          this.$store.dispatch('setBoard', board)
          this.$store.dispatch('resetBoard', [])
          this.closeButton()
        }
      },
      AddBoard() {
        // this.$store.dispatch('AddBoard', board)
      },
      ID() {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1) + Math.random().toString(36).substr(2, 9);
      },
      isDisabled: function() {
        if (this.tile.name){
          return false
        } else {
          return true
        }
      },
      isDisabled1: function() {
        if (this.section.name){
          return false
        } else {
          return true
        }
      },
      AddTile: function() {
        if (this.tile.event_due){
          this.tile.event_due = this.tile.event_due.getTime() /  1000
        } else {
          this.tile.event_due = null
        }
        // console.log(this.tile)
        this.$store.dispatch('pushTile', { 
          'id': this.ID(), 
          'name': this.tile.name,
          'event_name': this.tile.event_name,
          'event_due': this.tile.event_due,
          'x': config.new_tile_x_axis, 
          'y': config.new_tile_y_axis, 
          'color' : config.new_tile_color
        })
        this.$store.dispatch('setModalTile', false)
        this.tile = {
          name: '',
          event_name: '',
          event_due: ''
        }
      },
      AddSection: function() {
        // console.log(this.section)
        this.$store.dispatch('pushSection', { 
          'id': this.ID(),
          'name': this.section.name,
          'x': config.new_section_x_axis, 
          'y': config.new_section_y_axis, 
          'width': config.section_width, 
          'height': config.section_height,
          'color': config.new_section_color,
          'max_trucks': +this.section.max_trucks,
          'max_trailers': +this.section.max_trailers
        })
        this.$store.dispatch('setModalSection', false)
        this.section = {
          name: '',
          max_trucks: 2,
          max_trailers: 2
        }
      },
      closeButton: function(){
        console.log('close clicked')
        this.$store.dispatch('setModalTile', false)
        this.$store.dispatch('setModalSection', false)
        this.$store.dispatch('setModalBoard', false)
        this.$store.dispatch('setModalColor', false)
        this.$store.dispatch('setModalDetails', false)
        this.$store.dispatch('setTile', {})
      }
    }
  }
</script>

<style scoped>
#board {
  border: 1ch solid grey;
}
</style>