<template>
  <div>    
    <modal headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Left BackLoaded title</h4>
      <div class="datepicker-container">
        <!-- <fginput
          placeholder="Tile Name"
          v-model="this.back_title"
        /> -->
      </div>
      <template slot="footer">
         <!-- @click="AddBackLoadedL()" :disabled="isDisabled()" -->
        <nbutton type="success"
          >Add BackLoaded</nbutton
        >
        <nbutton type="danger" @click="() => this.$emit('closeLeft')"
          >Close</nbutton
        >
      </template>
    </modal>
  </div>
</template>

<script>
  import modal from './../../../../../components/Modal-duplicate';
  import nbutton from './../../../../../components/Button-duplicate';
  import fginput from './../../../../../components/Inputs/formGroupInput-duplicate';
export default {
  name: 'backLLeft',
  components: {
    modal,
    nbutton,
    fginput
  },
  created() {
    console.log('created')
  }
}
</script>

<style>

</style>