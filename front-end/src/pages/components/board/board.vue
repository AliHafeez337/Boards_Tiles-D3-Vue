
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
    
    <!-- Navbar Warning -->
    <!-- style="position: static;" -->
    <navbar type="danger" menu-classes="ml-auto" v-if="iferr">
      <div class="navbar-translate">
        <span style="color: white; text-align: center;">
          {{this.errmsg}}
        </span>
      </div>
    </navbar>
    <!-- End Navbar Warning -->

    <!-- Modal Tile -->
    <modal :show="modalTile" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Tile basic info</h4>
      <div class="datepicker-container">
        <small>A trailer must has last 3 digits as integers otherwise it would be treated as a truck.</small>
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
        <nbutton v-if="!addBoard && (profile.usertype === 'admin' || profile.usertype === 'user')" type="success" @click="newBoard()"
          >New Board</nbutton
        >
      </template>
      <div class="datepicker-container" v-if="addBoard">
        <span>Board name must be unique.</span>
        <br />
        <br />
        <fginput
          placeholder="Enter the new board name."
          v-model="tempBoardName"
        />
      </div>
      <div class="datepicker-container" v-else>


          <table style="width:100%">
            <tr v-for="(board, index) in boards" :key="index">
              <td>
                {{ index + 1 }}
              </td>
              <td>
                <a
                  href="javascript:void(0)"
                  @click="setBoard(board)"
                  class="dropdown-item"
                >
                  {{ board.name }}
                </a>
              </td>
              <td style="color: red; cursor: pointer" @click="deleteBoard(board._id)">
                Delete
              </td>
            </tr>
          </table>

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
    <!-- <modal :show="modalColor" headerClasses="justify-content-center">
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
    </modal> -->

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
        <span>{{tileDetails.due1}}</span>
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
      :sectionName="sectionName" 
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
  import fginput from '../../../components/Inputs/formGroupInput-duplicate';
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
        profile: this.$store.getters.getProfile
      }
    },
    created() {
      this.$store.dispatch('setBoards')
    },
    computed: {
      boards() {
        return this.$store.getters.getBoards
      },
      ifBoard() {
        if (this.$store.getters.getBoard.name){
          return false
        } else {
          return true
        }
      },
      iferr() {
       if (this.$store.getters.getErr){
         return true
       } else {
         return false
       }
      },
      errmsg() {
        return this.$store.getters.getErrmsg
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
          a.due1 = new Date(a.event_due * 1000);
        }
        return a;
      },
      sections() {
        return this.$store.getters.getSections;
      },
      sectionName() {
        return this.$store.getters.getSectionName;
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
      sectionName: function (val) {
        console.log('SECTIONS_NAMES', val)
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
        this.$store.commit('SET_ERR', { bool: false, errmsg: "" })
        this.scrollToElement();
        this.$store.dispatch('setBoard', board)
        this.$store.dispatch('setSections', board._id)
        this.$store.dispatch('setSectionName', board._id)
        this.$store.dispatch('setTiles', board._id)
        this.$store.dispatch('setLabels', board._id)
      },
      deleteBoard(id) {
        console.log(id)
        if (confirm("Do you really want to delete this board and all the data associated with it?")){
          this.$store.dispatch('deleteBoard', id)
        }
      },
      ID() {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1) + new Date().getTime();
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