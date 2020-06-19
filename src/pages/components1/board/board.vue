
<template>
  <div id="d3">
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
        this.d3 += 1
      },
      tiles: function (val) {
        this.d3 += 1
      }
    },
    components: {
      D3
    }
  }
</script>