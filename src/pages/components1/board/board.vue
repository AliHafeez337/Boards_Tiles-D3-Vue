
<template>
  <div id="board">
    <input type="color" id="color" hidden/>
    <D3 
      :sections="sections" 
      :tiles="tiles"
      :key="d3"
    />
  </div>
</template>
 
<script>
  import D3 from './D3/D3';

  export default {
    data() {
      return {
        d3: 0
      }
    },
    computed: {
      sections() {
        return this.$store.getters.getSections;
      },
      tiles() {
        return this.$store.getters.getTiles;
      }
    },
    watch: {
      sections: function (val) {
        console.log('SECTIONS', val)
        this.d3 += 1
      },
      tiles: function (val) {
        console.log('TILES', val)
        this.d3 += 1
      }
    },
    components: {
      D3
    }
  }
</script>

<style scoped>
#board {
  border: 1ch solid grey;
}
</style>