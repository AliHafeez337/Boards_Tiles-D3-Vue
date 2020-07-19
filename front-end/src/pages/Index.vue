<template>
  <div>
    <ViewProfile />
    <div class="section">
      <div class="container text-center">
        <div class="row justify-content-md-center">
          <div class="col-md-12 col-lg-8">
            <h2 class="title">How to use a board.</h2>
            <h5 class="description">
              First-of-all, select a board from the navbar. You'll get option to add a section(location) and tile(truck or trailer). If a tile has its last three digists of name as numbers, it will be considered trailer otherwise truck. If a trailer is placed in front of a truck, it will be considered attached to that truck.
            </h5>
          </div>
        </div>
      </div>
    </div>
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
