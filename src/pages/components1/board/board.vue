
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
    <input type="color" id="color" hidden/>
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

  export default {
    components: {
      D3,
      modal,
      nbutton,
      fginput,
      [DatePicker.name]: DatePicker,
      Navbar,
      DropDown
    },
    data() {
      return {
        d3: 0,
        tile: {
          name: '',
          event_name: '',
          event_due: ''
        },
        section: {
          name: ''
        }
      }
    },
    computed: {
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
      ID() {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1) + Math.random().toString(36).substr(2, 9);
      },
      isDisabled: function() {
        if (this.tile.name && this.tile.event_name){
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
          'color': config.new_section_color
        })
        this.$store.dispatch('setModalSection', false)
        this.section = {
          name: ''
        }
      },
      closeButton: function(){
        console.log('close clicked')
        this.$store.dispatch('setModalTile', false)
        this.$store.dispatch('setModalSection', false)
      }
    }
  }
</script>

<style scoped>
#board {
  border: 1ch solid grey;
}
</style>