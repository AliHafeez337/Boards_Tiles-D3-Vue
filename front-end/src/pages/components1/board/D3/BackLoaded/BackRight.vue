<template>
  <div>
    <modal :show="this.BackLoadedR" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Right BackLoaded title</h4>
      <div class="datepicker-container">
        <fginput
          placeholder="Tile Name"
          v-model="this.back_title"
        />
      </div>
      <template slot="footer">
        <nbutton type="success" @click="AddBackLoadedR()" :disabled="isDisabled()"
          >Add BackLoaded</nbutton
        >
        <nbutton type="danger" @click="this.BackLoadedR = false"
          >Close</nbutton
        >
      </template>
    </modal>
  </div>
</template>

<script>
export default {
  name: 'backLRight'
}
</script>

<style>

</style>