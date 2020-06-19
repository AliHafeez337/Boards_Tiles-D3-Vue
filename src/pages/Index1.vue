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
          <h1 class="h1-seo">Now UI Kit.</h1>
          <h3>A beautiful Bootstrap 4 UI kit. Yours free.</h3>
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
    <div class="section">
      <div class="container text-center">
        <div class="row justify-content-md-center">
          <div class="col-md-12 col-lg-8">
            <h2 class="title">Completed with examples</h2>
            <h5 class="description">
              The kit comes with three pre-built pages to help you get started
              faster. You can change the text and images and you're good to go.
              More importantly, looking at them will give you a picture of what
              you can built with this powerful Bootstrap 4 ui kit.
            </h5>
          </div>
        </div>
      </div>
    </div>
    <div class="main" id="downloadSection">
      <div class="section section-images">
        <board />
        <!-- <div class="container">
          <div class="row">
            <div class="col-md-12">
            </div>
          </div>
        </div> -->
      </div>
    </div>
    <signup-form></signup-form>
    <examples-section></examples-section>
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
