<template>
  <navbar
    :transparent="false"
    :type=type
    menu-classes="ml-auto"
    position="fixed"
  >
    <template v-if="Admin()" slot-scope="{ toggle, isToggled }">
      <router-link v-popover:popover1 class="navbar-brand" to="/users">
        Users
      </router-link>
      <el-popover
        ref="popover1"
        popper-class="popover"
        placement="bottom"
        width="200"
        trigger="hover"
      >
        <div class="popover-body">
          Go to the users page.
        </div>
      </el-popover>
    </template>
    <template slot="navbar-menu">
      <li class="nav-item" v-if="Saving">
        <a
          class="nav-link btn btn-neutral"
          href="javascript:void(0)"
          style="cursor: progress;"
        >
          <i class="now-ui-icons arrows-1_cloud-upload-94"></i>
          &nbsp;
          <p style="font-size: 15px">Saving progress...</p>
        </a>
      </li>
      <fginput
        v-if="ifBoard"
        placeholder="Search the tile"
        v-model="search"
      >
      </fginput>
      <drop-down
        v-if="ifBoardAndUser"
        tag="li"
        title="New"
        icon="now-ui-icons ui-1_simple-add"
        class="nav-item"
      >
        <a
          href="javascript:void(0)"
          @click="pushSection()"
          class="dropdown-item"
          v-if="profile.usertype === 'admin'"
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
          @click="boards()"
        >
          <i class="now-ui-icons ui-1_check"></i>
          &nbsp;
          <p style="font-size: 12px">Boards</p>
        </a>
      </li>

      <drop-down
        tag="li"
        title=""
        icon="now-ui-icons sport_user-run"
        class="nav-item"
      >
        <a
          href="javascript:void(0)"
          @click="me()"
          class="dropdown-item"
        >
          Profile
        </a>
        <a
          href="javascript:void(0)"
          @click="logout()"
          class="dropdown-item"
        >
          Logout
        </a>
      </drop-down>

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
import Services from './../services'

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
      type: 'white', //['white', 'default', 'primary', 'danger', 'success', 'warning', 'info']
      search: '',
      pickers: {
        datePicker: ''
      },
      profile: this.$store.getters.getProfile,
      service: new Services()
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
    },
    ifBoardAndUser() {
      if (this.$store.getters.getBoard && (this.$store.getters.getProfile.usertype === 'admin' || this.$store.getters.getProfile.usertype === 'user')){
        return true
      } else {
        return false
      }
    },
    Saving() {
      if (this.$store.getters.getSaving){
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
    Admin() {
      if (this.$store.getters.getProfile && this.$store.getters.getProfile.usertype === 'admin')
        return true
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
    boards() {
      this.$store.dispatch('setModalBoard', true)
    },
    logout() {
      this.service.logout()
        .then(res => {
          localStorage.removeItem('token')
          this.$store.dispatch('setProfile',  {})
          this.$store.dispatch('setToken',  '')
          this.$router.push("/login")
        })
        .catch(err => {
          console.log(err)
        })
    },
    me() {
      this.$store.dispatch('setModalProfile',  true)
    },
    newUser() {
      this.$store.dispatch('setModalUser',  true)
    }
  }
};
</script>

<style scoped></style>
