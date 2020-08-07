<template>
  <div id="app">
    <router-view name="header" />
    <div class="wrapper">
      <router-view />
    </div>
    <router-view name="footer" />
  </div>
</template>

<script>
import Services from './services'
import { back_end_url } from '../VARIABLES'
import io from 'socket.io-client';
// var io = require('socket.io-client');

var socket = io.connect(back_end_url, { resource: '/api/socket.io' });

export default {
  created() {
    // console.log('Vue root component created.')

    Services.getCredits()
      .then(data => console.log(data))
      .catch(err => console.log(err))
      
    if (!this.$store.getters.getToken){
      this.$router.push("/login")
    } else if (!this.$store.getters.getProfile.name){
      console.log("Profile doesn't exist.")
      
      var service = new Services();
      service.profile()
        .then(me => {
          this.$store.dispatch('setProfile', me)
        })
        .catch(err => {
          console.log(err)
          this.$router.push("/login")
        })
    }

    socket.on("message", obj => {
      console.log('MESSAGE RECEIVED', obj)

      if (this.$store.getters.getProfile.usertype)
      var messages = this.$store.getters.getMessages
      messages.push(obj)
      this.$store.dispatch('setMessages', messages)
    })
    socket.on("messageOfUpdate", obj => {
      console.log('UPDATE MESSAGE RECEIVED', obj)

      if ((obj.by.email !== this.$store.getters.getProfile.email && obj.board._id === this.$store.getters.getBoard._id)){
        var messages = this.$store.getters.getMessages
        messages.push(obj)
        this.$store.dispatch('setMessages', messages)

        if (this.$store.getters.getProfile.usertype === 'watcher'){
          this.$store.commit('SET_SECTIONS', [])
          this.$store.commit('SET_SECTIONS1', [])
          this.$store.commit('SET_SECTIONNAME', [])
          this.$store.commit('SET_SECTIONNAME1', [])
          this.$store.commit('SET_TILES', [])
          this.$store.commit('SET_TILES1', [])
          this.$store.commit('SET_LABELS', [])
          this.$store.commit('SET_LABELS1', [])
          this.$store.commit('SET_ERR', { bool: false, errmsg: "" })
          
          let board = this.$store.getters.getBoard;

          this.$store.dispatch('setBoard', board)
          this.$store.dispatch('setSections', board._id)
          this.$store.dispatch('setSectionName', board._id)
          this.$store.dispatch('setTiles', board._id)
          this.$store.dispatch('setLabels', board._id)
        }

      }
    })
  }
};
</script>
