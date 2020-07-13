<template>
  <div>
    <div class="page-header clear-filter" filter-color="orange">
      <parallax
        class="page-header-image"
        style="background-image:url('img/header.jpg')"
      >
      </parallax>
      <div class="container">
        <div class="content-center brand">
          <img class="n-logo" src="img/now-logo.png" alt="" />
          <h1 class="h1-seo">Dynamic Board by Ali Hafeez.</h1>
          <h3>A heavy implementation of D3.JavaScript where tiles represent the trucks and the trailers (containing last 3 digits as numbers) both attached and separate and sections represents the locations.</h3>
        </div>
        <h6 class="category category-absolute">
          Designed by
          <a href="http://invisionapp.com/" target="_blank">
            <img src="img/invision-white-slim.png" class="invision-logo" /> </a
          >. Coded by
          <a href="https://www.creative-tim.com" target="_blank">
            <img
              src="img/creative-tim-white-slim2.png"
              class="creative-tim-logo"
            /> </a
          >.
        </h6>
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
import { Parallax } from '@/components';
import SignupForm from './components/SignupForm';
import ExamplesSection from './components/ExamplesSection';
import board from './components1/board/board';

export default {
  name: 'index',
  bodyClass: 'index-page',
  components: {
    Parallax,
    SignupForm,
    ExamplesSection,
    board
  }
};
</script>
<style></style>
