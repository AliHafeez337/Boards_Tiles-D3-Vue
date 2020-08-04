<template>
  <navbar
    :transparent="false"
    :type=type
    menu-classes="ml-auto"
    position="fixed"
  >
    <template slot-scope="{ toggle, isToggled }">
      <router-link v-popover:popover1 class="navbar-brand" to="/">
        Home
      </router-link>
      <el-popover
        ref="popover1"
        popper-class="popover"
        placement="bottom"
        width="200"
        trigger="hover"
      >
        <div class="popover-body">
          Go to the main page.
        </div>
      </el-popover>
    </template>
    <template slot="navbar-menu">
      <div>
        <fginput>
          <el-date-picker
            type="date"
            popper-class="date-picker date-picker-primary"
            placeholder="Logs from date"
            v-model="from"
          >
          </el-date-picker>
        </fginput>
      </div>
      &nbsp;
      <div>
        <fginput>
          <el-date-picker
            type="date"
            popper-class="date-picker date-picker-primary"
            placeholder="to date and"
            v-model="to"
          >
          </el-date-picker>
        </fginput>
      </div>
      <div>
        <li class="nav-item">
          <a
            class="nav-link btn btn-neutral"
            href="javascript:void(0)"
            @click="search()"
          >
            <i class="now-ui-icons ui-1_check"></i>
            &nbsp;
            <p style="font-size: 12px">Search</p>
          </a>
        </li>
      </div>

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
import { DatePicker } from 'element-ui';
import fginput from '../components/Inputs/formGroupInput-duplicate';

import { config } from '../CONFIG';
import Services from './../services'

export default {
  name: 'users-navbar',
  components: {
    DropDown,
    Navbar,
    NavbarToggleButton,
    NavLink,
    [Popover.name]: Popover,
    [DatePicker.name]: DatePicker,
    fginput
  },
  props: {
    transparent: Boolean,
    colorOnScroll: Number
  },
  data() {
    return {
      type: 'white', //['white', 'default', 'primary', 'danger', 'success', 'warning', 'info']
      profile: this.$store.getters.getProfile,
      service: new Services(),
      from: '',
      to: ''
    }
  },
  methods: {
    logout() {
      this.service.logout()
        .then(res => {
          sessionStorage.removeItem('token')
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
    search() {
      // console.log(this.from.getTime(), this.to.getTime())
      this.service.searchLogs(this.from.getTime(), this.to.getTime())
        .then(data => this.$store.dispatch('setLogs', data))
        .catch(err => console.log(err))
    }
  }
};
</script>

<style scoped></style>
