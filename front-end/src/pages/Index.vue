<template>
  <div>
    <ViewProfile />
    <div class="main" id="downloadSection">
      <div class="section section-images">
        <board />
      </div>
    </div>
  </div>
</template>
<script>
import board from './components/board/board';
import ViewProfile from './ViewProfile';

export default {
  name: 'index',
  bodyClass: 'index-page',
  components: {
    board,
    ViewProfile
  }
};
</script>
<style></style>
