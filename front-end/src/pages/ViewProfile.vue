<template>
  <div>

    <!-- Modal Profile -->
    <modal :show="modalProfile" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Profile</h4>
      <div class="datepicker-container">
        <strong>Name:</strong>&nbsp;
        <fginput
          placeholder="Name"
          v-model="name"
        />
        <br />
        <strong>Email:</strong>&nbsp;
        <fginput
          placeholder="Email"
          v-model="emaill"
        />
        <br />
        <strong>Password:</strong>&nbsp;
        <fginput
          placeholder="Password"
          v-model="password"
        />
        <br />
        <strong>Password:</strong>&nbsp;
        <fginput
          placeholder="Password"
          v-model="password2"
        />
        <br />
        <strong>Created At:</strong>&nbsp;
        <span>{{createdAt}}</span>
        <br />
        <br />
      </div>
      <template slot="footer">
        <nbutton type="success" @click="UpdateProfile()" :disabled="isDisabled2()"
          >Update profile</nbutton
        >
        <nbutton type="danger" @click="closeButton()"
          >Close</nbutton
        >
      </template>
    </modal>
  </div>
</template>

<script>

import Services from './../services';
import validator from 'validator';
import modal from '../components/Modal-duplicate';
import nbutton from '../components/Button-duplicate';
import fginput from '../components/Inputs/formGroupInput-duplicate';

export default {
  name: 'profile',
  bodyClass: 'index-page',
  components: {
    modal,
    nbutton,
    fginput
  },
  data() {
    return {
      name: '',
      emaill: '',
      createdAt: '',
      password: '',
      password2: '',
      service: new Services()
    }
  },
  created() {
    if (!this.$store.getters.getToken){
      this.$router.push("/login")
    } else if (!this.$store.getters.getProfile.name){
      // console.log("Profile doesn't exist.")
      
      var service = new Services();
      service.profile()
        .then(me => {
          this.$store.dispatch('setProfile', me)
        })
        .catch(err => {
          this.$router.push("/login")
        })
    }
    
    // console.log(this.$store.getters.getProfile)
    this.name = this.$store.getters.getProfile.name
    this.emaill = this.$store.getters.getProfile.email
    this.createdAt = this.$store.getters.getProfile.createdAt
  },
  computed: {
    modalProfile() {
      return this.$store.getters.getModalProfile;
    }
  },
  watch: {
    modalProfile: function(val){
      this.name = this.$store.getters.getProfile.name
      this.emaill = this.$store.getters.getProfile.email
      this.createdAt = this.$store.getters.getProfile.createdAt
    }
  },
  methods: {
    isDisabled2: function() {
      if ((!this.emaill) || (!validator.isEmail(this.emaill)) || (this.password !== this.password2)){
        return true
      } else {
        return false
      }
    },
    UpdateProfile: function() {
      console.log("Update profile clicked")
      this.service.update(this.name, this.emaill, this.password, this.password2)
        .then(data => {
          // console.log(data)
          this.name = data.doc.name
          this.emaill = data.doc.email
          this.createdAt = data.doc.createdAt
          this.$store.dispatch('setProfile', data.doc)
        })
        .catch(err =>{
          console.log(err)
        })
    },
    closeButton: function(){
      console.log('close clicked')
      this.$store.dispatch('setModalProfile', false)
    }
  }
};
</script>
<style></style>
