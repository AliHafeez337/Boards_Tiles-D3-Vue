
<template>
  <div id="d3">
    <h1>d3 component</h1>
    <D3 :sections="sections" :tiles="tiles"/>
  </div>
</template>
 
<script>
  import D3 from './D3/D3';

  export default {
    data() {
      return {
        sections: [
          { "x": 20, 'y': 20, 'width': 50, 'height': 100, "color" : "green" },
          { "x": 220, 'y': 20, 'width': 50, 'height': 100, "color" : "purple"},
          { "x": 420, 'y': 20, 'width': 50, 'height': 100, "color" : "red"}
        ],
        tiles: [
          { "x": 20, 'y': 20, 'width': 50, 'height': 20, "color" : "green" },
          { "x": 220, 'y': 20, 'width': 50, 'height': 20, "color" : "purple"},
          { "x": 420, 'y': 20, 'width': 50, 'height': 20, "color" : "red"}
        ]
      }
    },
    components: {
      D3
    },
    methods: {
    }
  }
</script>