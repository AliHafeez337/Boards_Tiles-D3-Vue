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
      <li class="nav-item">
        <a
          class="nav-link"
          href="javascript:void(0)"
          @click="scrollToElement('board1')"
        >
          <i class="now-ui-icons arrows-1_cloud-download-93"></i>
          <p>Download</p>
        </a>
      </li>
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
        title="Components"
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
        <a
          href="https://demos.creative-tim.com/vue-now-ui-kit/documentation"
          target="_blank"
          class="dropdown-item"
        >
          <i class="now-ui-icons design_bullet-list-67"></i> Documentation
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
      var sections =  [
        { "x": 20, 'y': 20, 'width': 50, 'height': 100, "color" : "green" },
        { "x": 220, 'y': 20, 'width': 50, 'height': 100, "color" : "purple"},
        { "x": 420, 'y': 20, 'width': 50, 'height': 100, "color" : "red"}
      ], tiles = [
        { "x": 20, 'y': 20, 'width': 50, 'height': 20, "color" : "green" },
        { "x": 220, 'y': 20, 'width': 50, 'height': 20, "color" : "purple"},
        { "x": 420, 'y': 20, 'width': 50, 'height': 20, "color" : "red"}
      ]
      this.$store.dispatch('setSections', sections)
      this.$store.dispatch('setTiles', tiles)
    }
  }
};
</script>

<style scoped></style>
