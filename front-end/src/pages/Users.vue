<template>
  <div>
    <div class="main" id="usersSection">
      <div class="section section-images">
        <div class="col-md-12 col-lg-12">

          <ViewProfile />

          <!-- Modal New User -->
          <modal :show="modalUser" headerClasses="justify-content-center">
            <h4 slot="header" class="title title-up">Add a new user</h4>
            <div class="datepicker-container">
              <strong>Usertype:</strong>&nbsp;
              <span>{{newUser.usertype}}</span>
              <drop-down
                tag="li"
                title="Change"
                icon=""
                class="nav-item"
              >
                <a
                  href="javascript:void(0)"
                  @click="changenewtype('admin')"
                  class="dropdown-item"
                >
                  Admin
                </a>
                <a
                  href="javascript:void(0)"
                  @click="changenewtype('user')"
                  class="dropdown-item"
                >
                  User
                </a>
                <a
                  href="javascript:void(0)"
                  @click="changenewtype('fleet')"
                  class="dropdown-item"
                >
                  Fleet
                </a>
                <a
                  href="javascript:void(0)"
                  @click="changenewtype('watcher')"
                  class="dropdown-item"
                >
                  Watcher
                </a>
              </drop-down>
              <strong>Name:</strong>&nbsp;
              <fginput
                placeholder="Name"
                v-model="newUser.name"
              />
              <br />
              <strong>Email:</strong>&nbsp;
              <fginput
                placeholder="Email"
                v-model="newUser.email"
              />
              <br />
              <strong>Password:</strong>&nbsp;
              <small>Password length should be at least 6 characters.</small>&nbsp;
              <fginput
                placeholder="Password"
                v-model="newUser.password"
              />
              <br />
              <strong>Repeat Password:</strong>&nbsp;
              <small>Password length should be at least 6 characters.</small>&nbsp;
              <fginput
                placeholder="Password"
                v-model="newUser.password2"
              />
              <br />
              <br />
            </div>
            <template slot="footer">
              <nbutton type="success" @click="addUser()" :disabled="isDisabled1()"
                >Add user</nbutton
              >
              <nbutton type="danger" @click="closeButton()"
                >Close</nbutton
              >
            </template>
          </modal>

          <!-- Modal User -->
          <modal :show="userEdit" headerClasses="justify-content-center">
            <h4 slot="header" class="title title-up">User profile</h4>
            <div class="datepicker-container">
              <strong>Usertype:</strong>&nbsp;
              <span>{{user.usertype}}</span>
              <drop-down
                tag="li"
                title="Change"
                icon=""
                class="nav-item"
              >
                <a
                  href="javascript:void(0)"
                  @click="changetype('admin')"
                  class="dropdown-item"
                >
                  Admin
                </a>
                <a
                  href="javascript:void(0)"
                  @click="changetype('user')"
                  class="dropdown-item"
                >
                  User
                </a>
                <a
                  href="javascript:void(0)"
                  @click="changetype('fleet')"
                  class="dropdown-item"
                >
                  Fleet
                </a>
                <a
                  href="javascript:void(0)"
                  @click="changetype('watcher')"
                  class="dropdown-item"
                >
                  Watcher
                </a>
              </drop-down>
              <strong>Name:</strong>&nbsp;
              <fginput
                placeholder="Name"
                v-model="user.name"
              />
              <br />
              <strong>Email:</strong>&nbsp;
              <fginput
                placeholder="Email"
                v-model="user.email"
              />
              <br />
              <strong>Password:</strong>&nbsp;
              <small>Password length should be at least 6 characters.</small>&nbsp;
              <fginput
                placeholder="Password"
                v-model="password"
              />
              <br />
              <strong>Repeat Password:</strong>&nbsp;
              <small>Password length should be at least 6 characters.</small>&nbsp;
              <fginput
                placeholder="Password"
                v-model="password2"
              />
              <br />
              <strong>Created At:</strong>&nbsp;
              <span>{{user.createdAt}}</span>
              <br />
              <br />
            </div>
            <template slot="footer">
              <nbutton type="success" @click="UpdateUser()" :disabled="isDisabled()"
                >Update user</nbutton
              >
              <nbutton type="danger" @click="closeButton()"
                >Close</nbutton
              >
            </template>
          </modal>

          <table style="width:100%">
            <tr v-for="(user, index) in users" :key="index">
              <th>{{ index + 1 }}</th>
              <th>{{ user.usertype }}</th>
              <th>{{ user.name }}</th>
              <th>{{ user.email }}</th>
              <th>{{ user.createdAt }}</th>
              <th class="editUser" @click="editUser(user)">Edit</th>
              <th class="deleteUser" @click="deleteUser(user._id)">Delete</th>
            </tr>
          </table>

        </div>
      </div>
    </div>
  </div>
</template>
<script>

import modal from '../components/Modal-duplicate';
import DropDown from '../components/Dropdown';
import nbutton from '../components/Button-duplicate';
import fginput from '../components/Inputs/formGroupInput-duplicate';
import Services from './../services';
import validator from 'validator';
import ViewProfile from './ViewProfile';

export default {
  name: 'users',
  bodyClass: 'users-page',
  components: {
    DropDown,
    modal,
    nbutton,
    fginput,
    ViewProfile
  },
  data() {
    return {
      service: new Services(),
      users: null,
      userEdit: false,
      user: {},
      password: '',
      password2: '',
      newUser: {
        usertype: '',
        name: '',
        email: '',
        password: '',
        password2: ''
      }
    }
  },
  created() {
    if (this.$store.getters.getProfile && this.$store.getters.getProfile.usertype !== 'admin'){
      this.$router.push("/")
    }

    this.service.allUsers()
      .then(data => {
        // console.log(data)
        this.users = data.users
      })
      .catch(err => {
        console.log(err)
      })
  },
  computed: {
    modalUser() {
      return this.$store.getters.getModalUser;
    }
  },
  methods: {
    deleteUser(id){
      if (confirm("Do you really want to delete this user?")) {
        this.service.deleteUser(id)
          .then(data => {
            this.users = this.users.filter(user => user._id !== id)
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    editUser(user){
      this.userEdit = true
      this.user = user
    },
    changetype(type){
      this.user.usertype = type
    },
    closeButton(){
      this.userEdit = false
      this.$store.dispatch('setModalUser', false)
    },
    isDisabled(){
      if (!(this.user.email && validator.isEmail(this.user.email)) || !this.user.name || this.password !== this.password2){
        return true
      }
    },
    UpdateUser(){
      var user = {...this.user}
      if (this.password && this.password2 && this.password.length >= 6 && this.password2.length >= 6){
        user.password = this.password
        user.password2 = this.password2
      }
      this.service.updateUser(user)
        .then(data => {
          console.log(data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    changenewtype(type) {
      this.newUser.usertype = type
    },
    isDisabled1(){
      if (
        !(this.newUser.usertype === 'admin' || 
        this.newUser.usertype === 'user' ||
        this.newUser.usertype === 'fleet' ||
        this.newUser.usertype === 'watcher')
        ||
        this.newUser.name.length < 1
        ||
        !validator.isEmail(this.newUser.email)
        ||
        (this.newUser.password.length < 6 && this.newUser.password2.length < 6)
        ||
        this.newUser.password !== this.newUser.password2
        ){
        return true
      }
    },
    addUser(){
      console.log(this.newUser)
      this.service.newUser(this.newUser)
        .then(data => {
          this.users.push(data.user)
          this.$store.dispatch('setModalUser', false)
          this.newUser.usertype = ''
          this.newUser.name = ''
          this.newUser.email = ''
          this.newUser.password = ''
          this.newUser.password2 = ''
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
};
</script>

<style scoped>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
th, td {
  padding: 15px;
  text-align: left;
}
.deleteUser {
  cursor: pointer;
  color: red;
}
.editUser {
  cursor: pointer;
  color: blue;
}
</style>
