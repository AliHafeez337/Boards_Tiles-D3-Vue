<template>
  <!-- <div class="page-header clear-filter" filter-color="orange"> -->
  <div 
    class="page-header clear-filter"
    style="background-image: url('img/login.jpg'); background-repeat: no-repeat; background-size: 100% 100%;"
    >
          <!-- <div
            class="page-header-image"
            style="background-image: url('img/login.jpg')"
          ></div> -->
          <div class="content">
            <div class="container">
              <div class="col-md-5 ml-auto mr-auto">
                <card type="login" plain>
                  <!-- <div slot="header" class="logo-container">
                    <img v-lazy="'img/now-logo.png'" alt="" />
                  </div> -->

                  <h2>{{siteName}}</h2>
                  <br />

                  <h5 v-show="this.showErr" style="color: red">Unauthorized</h5>
                  <fg-input
                    class="no-border input-lg"
                    addon-left-icon="now-ui-icons users_circle-08"
                    placeholder="Email..."
                    v-model="obj.email"
                  >
                  </fg-input>

                  <fg-input
                    class="no-border input-lg"
                    addon-left-icon="now-ui-icons text_caps-small"
                    placeholder="Password..."
                    v-model="obj.password"
                  >
                  </fg-input>
                  
                  <p v-if="isDisabled" style="color: white">Please write a valid email and a password of at least 6 characters.</p>
                  <div class="card-footer text-center">
                    <a
                      class="btn btn-primary btn-round btn-lg btn-block"
                      @click="Login()" 
                      >Login</a
                    >
                  </div>

                  <template slot="raw-content">
                    <!-- <div class="card-footer text-center">
                      <a
                        href="#pablo"
                        class="btn btn-primary btn-round btn-lg btn-block"
                        >Login</a
                      >
                    </div> -->
                    <!-- <div class="pull-left">
                      <h6>
                        <a href="#pablo" class="link footer-link">Create Account</a>
                      </h6>
                    </div>
                    <div class="pull-right">
                      <h6>
                        <a href="#pablo" class="link footer-link">Need Help?</a>
                      </h6>
                    </div> -->
                  </template>
                </card>
              </div>
            </div>
          </div>
          <!-- <main-footer></main-footer> -->
  </div>
</template>
<script>

import { Card, Button, FormGroupInput } from '@/components';
import MainFooter from '@/layout/MainFooter';
import validator from 'validator';
import Services from './../services';
import { site_name } from './../../VARIABLES'

export default {
  name: 'login-page',
  bodyClass: 'login-page',
  created() {
    // console.log(site_name)
    if (this.$store.getters.getToken){
      this.$router.push("/")
    }
  },
  components: {
    Card,
    MainFooter,
    [Button.name]: Button,
    [FormGroupInput.name]: FormGroupInput
  },
  data() {
    return {
      obj: {
        email: '',
        password: ''
      },
      showErr: false,
      siteName: site_name
    }
  },
  computed: {
    isDisabled() {
      if (validator.isEmail(this.obj.email) && this.obj.password && this.obj.password.length >= 6){
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    Login: function() {
      if (validator.isEmail(this.obj.email) && this.obj.password && this.obj.password.length >= 6){
        console.log('login button clicked', this.obj)

        var service = new Services();
        service.login(this.obj.email, this.obj.password)
          .then(res => {
            // console.log(res)
            this.showErr = false
            sessionStorage.setItem('token', res.token)
            // localStorage.setItem('token', res.token)
            this.$store.dispatch('setProfile', res.user)
            this.$store.dispatch('setToken', res.token)
            this.$router.push("/")
          })
          .catch(err => {
            console.log(err)
            this.showErr = true
          })
      }
    }
  }
};
</script>
<style scoped>
</style>
