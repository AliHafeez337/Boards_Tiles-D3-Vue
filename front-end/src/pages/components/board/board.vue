
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
            placeholder="Event due time"
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
        <div v-if="profile.usertype === 'fleet'">
          <span>{{tileDetails.name}}</span>
          <br />
        </div>
        <fginput
          v-else
          placeholder="Name"
          v-model="tileDetails.name"
        />
        <strong>Event name:</strong>&nbsp;
        <fginput
          placeholder="Title"
          v-model="tileDetails.event_name"
        />
        <strong>Event due date:</strong>&nbsp;
        <fginput>
          <el-date-picker
            type="date"
            popper-class="date-picker date-picker-primary"
            placeholder="Event due time"
            v-model="due2"
          >
          </el-date-picker>
        </fginput>
        <strong>Back-loaded left title:</strong>&nbsp;
        <fginput
          placeholder="Title"
          v-model="tileDetails.backLTitle"
        />
        <strong>Back-loaded right title:</strong>&nbsp;
        <fginput
          placeholder="Title"
          v-model="tileDetails.backRTitle"
        />
        <div v-for="(key1, index) in tempKeys" :key="index">
          <strong>{{key1}}</strong>&nbsp;
          <div class="row">
            <div class="col-9">
              <fginput
                placeholder="Title"
                v-model="tileDetails[key1]"
              />
            </div>
            <div class="col-3">
              <span
                style="color: red; cursor: pointer;"
                @click="removeField(key1, 1)"
              >Remove</span>
            </div>
          </div>
        </div>

        <div v-for="(key1, index) in extraF" :key="index + keyIncrement">
          <strong>{{key1}}</strong>&nbsp;
          <div class="row">
            <div class="col-9">
              <fginput
                placeholder="Title"
                v-model="extraFileds[key1]"
              />
            </div>
            <div class="col-3">
              <span
                style="color: red; cursor: pointer;"
                @click="removeField(key1, 2)"
              >Remove</span>
            </div>
          </div>
        </div>

        <strong>Or add a new property...</strong>
        <div class="row">
          <div class="col-6">
            <fginput
              placeholder="Key"
              v-model="addKey"
            />
          </div>
          <div class="col-6">
            <fginput
              placeholder="Value"
              v-model="addValue"
            />
          </div>
        </div>
        <nbutton type="primary" @click="addField()"
          >Add</nbutton
        >

        <br />
      </div>
      <template slot="footer">
        <nbutton type="success" @click="updateTileDetails()"
          >Update details</nbutton
        >
        <nbutton type="danger" @click="closeButton()"
          >Close</nbutton
        >
      </template>
    </modal>

    <!-- Modal Import -->
    <modal :show="modalImport" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Import tile/s & property/ies</h4>
      <div class="datepicker-container">
        <span style="color: red;" v-if="errMSG">{{errMSG}}</span>
        <br />
        <input id="upload" type=file  name="files[]">
      </div>
      <template slot="footer">
        <nbutton type="success" @click="submitFile()" :disabled="isDisabled2"
          >Upload</nbutton
        >
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
      :center="recenter"
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
  import XLSX from 'xlsx'

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
        profile: this.$store.getters.getProfile,
        due2: null,
        addKey: '',
        addValue: '',
        tempKeys: null,
        extraFileds: {},
        keyIncrement: 0,
        errMSG: '',
        file_contents: null
      }
    },
    created() {
      console.log("Board refreshed...")
      this.$store.dispatch('setBoards')
    },
    mounted() {
      document.getElementById('upload').addEventListener('change', this.handleFileSelect, false);
    },
    computed: {
      recenter() {
        return this.$store.getters.getRecenter
      },
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
        return this.$store.getters.getTile
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
      },
      extraF: {
        // getter
        get: function () {
          return Object.keys(this.extraFileds)
        },
        // setter
        set: function (newValue) {
          this.extraFileds = newValue
        }
      },
      modalImport(){
        return this.$store.getters.getModalImport;
      },
      isDisabled2() {
        return !this.file_contents || !(this.errMSG === '')
      }
    },
    watch: {
      modalDetails: function (val) {
        this.extraF = []
      }, 
      recenter: function (val) {
        console.log('RECENTER', val)
        this.$store.dispatch('setRecenter', false)
        this.d3 += 1
      }, 
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
      },
      tileDetails: function (val) {
        if (val.event_due){
          this.due2 = new Date(val.event_due * 1000);
        }

        this.tempKeys = Object.keys(val).filter(key1 => {
          this.keyIncrement++
          if (!(key1 === 'name' || key1 === 'backLTitle' || key1 === 'backLeft' || key1 === 'backRTitle' || key1 === 'backRight' || key1 === 'back_title' || key1 === 'board' || key1 === 'color' || key1 === 'createdAt' || key1 === 'due1' || key1 === 'event_due' || key1 === 'event_name' || key1 === 'id' || key1 === 'x' || key1 === 'y' || key1 === '__v' || key1 === '_id')){
            return key1
          }
        })
        // console.log(this.tempKeys)
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
        document.title = board.name

        this.$store.commit('SET_SECTIONS', [])
        this.$store.commit('SET_SECTIONS1', [])
        this.$store.commit('SET_SECTIONNAME', [])
        this.$store.commit('SET_SECTIONNAME1', [])
        this.$store.commit('SET_TILES', [])
        this.$store.commit('SET_TILES1', [])
        this.$store.commit('SET_LABELS', [])
        this.$store.commit('SET_LABELS1', [])
        this.$store.commit('SET_ERR', { bool: false, errmsg: "" })
        
        this.scrollToElement();
        this.$store.dispatch('setBoard', board)
        this.$store.dispatch('setSections', board._id)
        this.$store.dispatch('setSectionName', board._id)
        this.$store.dispatch('setTiles', board._id)
        this.$store.dispatch('setLabels', board._id)
      },
      deleteBoard(id) {
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
        this.$store.dispatch('setModalImport', false)
      },
      updateTileDetails() {
        // console.log(this.tileDetails, this.due2.getTime() / 1000)
        var doc = {...this.tileDetails}

        if (this.due2){
          doc.event_due = this.due2.getTime() / 1000
        }
        if (doc.backLTitle){
          doc.backLeft = true
        } else {
          doc.backLeft = false
        }
        if (doc.backRTitle){
          doc.backRight = true
        } else {
          doc.backRight = false
        }
        
        this.$store.dispatch('changeTile', doc)

        this.d3++
        // this.$store.dispatch('copyBoard')
      },
      addField(){
        if (this.addKey){
        // if (this.addKey && this.addValue){
          this.tileDetails[this.addKey] = this.addValue
          this.tempKeys[this.addKey] = this.addValue
          this.extraFileds[this.addKey] = this.addValue
          this.extraFileds = {...this.extraFileds}

          Object.keys(this.extraFileds).forEach(key => {
            if (this.tileDetails[key]){
              this.tileDetails[key] = this.extraFileds[key]
            }
          })

          // console.log(this.tileDetails, this.tempKeys, this.extraFileds)

          this.addKey = ''
          this.addValue = ''
        }
      },
      removeField(field, no) {
        if (no === 1){
          delete this.tileDetails[field]
          this.tempKeys = this.tempKeys.filter(key => key !== field)

        } else if (no === 2){
          delete this.tileDetails[field]
          this.tempKeys = this.tempKeys.filter(key => key !== field)

          delete this.extraFileds[field]
          // The below setter is not simple like the above
          this.extraF = this.extraF.filter(key => key !== field)
        }
        // console.log(field, no, this.tileDetails, this.tempKeys, this.extraFileds, this.extraF)
          
        this.$store.dispatch('removeTileField', { tile: this.tileDetails, field })
      },
      ExcelToJSON: function() {

        this.parseExcel = function(file, thisComponent) {
          var reader = new FileReader();

          reader.onload = function(e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
              type: 'binary'
            });
            workbook.SheetNames.forEach(function(sheetName) {
              // Here is your object
              var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
              var json_object = JSON.stringify(XL_row_object);
              // console.log(JSON.parse(json_object));

              var name = false, _id = false, id = false, createdAt = false,  __v = false, x = false, y = false, color = false

              var json_object2 = []

              JSON.parse(json_object).forEach(data => {
                var obj = {...data}

                Object.keys(data).forEach(key => {
                  if (key.toLowerCase() === 'name'){
                    name = true
                  }
                  if (key.toLowerCase() === '_id'){
                    _id = true
                  }
                  if (key.toLowerCase() === 'id'){
                    id = true
                  }
                  if (key.toLowerCase() === 'createdat'){
                    createdAt = true
                  }
                  if (key.toLowerCase() === '__v'){
                    __v = true
                  }
                  if (key.toLowerCase() === 'x'){
                    x = true
                  }
                  if (key.toLowerCase() === 'y'){
                    y = true
                  }
                  if (key.toLowerCase() === 'color'){
                    color = true
                  }
                  if (key === 'backLTitle'){
                    obj.backLeft = true
                  }
                  if (key === 'backRTitle'){
                    obj.backRight = true
                  }
                  if (key === 'event_due' && data.event_due){
                    // console.log(data[key], 
                    // new Date(Math.round((data.event_due - 25569)*86400*1000)),
                    // new Date(Math.round((data.event_due - 25569)*86400*1000)).getTime()
                    // )
                    if (new Date(Math.round((data.event_due - 25569)*86400*1000))) {
                      // console.log(new Date(Math.round((data.event_due - 25569)*86400*1000)).getTime() / 1000)
                      obj.event_due = new Date(Math.round((data.event_due - 25569)*86400*1000)).getTime() / 1000
                    }
                  }
                })
                json_object2.push(obj)

              })
              console.log('File contents after parsing...', json_object2);

              if (!name){
                thisComponent.errMSG = "name is required..."
              } else if (_id) {
                thisComponent.errMSG = "_id is not allowed..."
              } else if (id) { 
                thisComponent.errMSG = "id is not allowed..."
              } else if (createdAt) {
                thisComponent.errMSG = "createdAt is not allowed..."
              } else if (x) {
                thisComponent.errMSG = "x is not allowed..."
              } else if (y) {
                thisComponent.errMSG = "y is not allowed..."
              } else if (color) {
                thisComponent.errMSG = "color is not allowed..."
              } else if (__v) {
                thisComponent.errMSG = "__v is not allowed..."
              } else {
                thisComponent.errMSG = ""

                thisComponent.file_contents = json_object2
              }

            })
          };

          reader.onerror = function(ex) {
            console.log(ex);
          };

          reader.readAsBinaryString(file);
        };
      },
      handleFileSelect(evt) {
        var files = evt.target.files; // FileList object
        var xl2json = new this.ExcelToJSON();
        xl2json.parseExcel(files[0], this);
      },
      submitFile(){
        this.$store.dispatch('changeTilesByFile', this.file_contents)
      }
    }
  }
</script>

<style scoped>
#board {
  border: 1ch solid grey;
}
</style>