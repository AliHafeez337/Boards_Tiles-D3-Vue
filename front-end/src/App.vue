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
  },
};
</script>
