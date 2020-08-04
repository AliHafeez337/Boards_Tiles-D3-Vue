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

export default {
  created() {
    console.log('Vue root component created.')

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
  }
};
</script>
