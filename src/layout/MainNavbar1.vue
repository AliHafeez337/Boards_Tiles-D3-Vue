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
          @click="scrollToElement('board1')"
          class="dropdown-item"
        >
          Board 1
        </a>
      </drop-down>
      <drop-down
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
          @click="scrollToElement('board1')"
        >
          <i class="now-ui-icons ui-1_check"></i>
          &nbsp;
          <p>SAVE</p>
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
export default {
  name: 'main-navbar',
  props: {
    transparent: Boolean,
    colorOnScroll: Number
  },
  components: {
    DropDown,
    Navbar,
    NavbarToggleButton,
    NavLink,
    [Popover.name]: Popover
  },
  methods: {
    scrollToElement(board) {
      this.getBoard(board);
      let element_id = document.getElementById("downloadSection");
      if (element_id) {
        element_id.scrollIntoView({ block: "end", behavior: "smooth" });
      }
    },
    getBoard(board) {
      if (board === 'board1'){
        var sections =  [
          { "x": 20, 'y': 20, 'width': 180, 'height': 500 },
          { "x": 250, 'y': 20, 'width': 180, 'height': 500 },
          { "x": 520, 'y': 20, 'width': 180, 'height': 500 }
        ], tiles = [
          { 'id': 'zkbug6kyx', "x": 20, 'y': 20, 'width': 80, 'height': 30, "color" : "green" },
          { 'id': 'trnrt7tmm', "x": 250, 'y': 20, 'width': 80, 'height': 30, "color" : "purple" },
          { 'id': 'k693b4ofl', "x": 520, 'y': 20, 'width': 80, 'height': 30, "color" : "red" }
        ], labels = [
          { 'id': '', 'tile': 'trnrt7tmm', 'width': 15, 'height': 7, "color" : "orange" },
          { 'id': '', 'tile': 'trnrt7tmm', 'width': 15, 'height': 7, "color" : "red" }
        ]
        this.$store.dispatch('setSections', sections)
        this.$store.dispatch('setTiles', tiles)
        this.$store.dispatch('setLabels', labels)
      }
    },
    ID() {
      return Math.random().toString(36).substr(2, 9);
    },
    pushSection() {
      var section = { "x": 0, 'y': 0, 'width': 50, 'height': 100 }
      this.$store.dispatch('pushSection', section)
    },
    pushTile() {
      var tile = { 'id': 'veq3ik29w', "x": 0, 'y': 0, 'width': 50, 'height': 20, "color" : "yellow" }
      this.$store.dispatch('pushTile', tile)
    }
  }
};
</script>

<style scoped></style>
