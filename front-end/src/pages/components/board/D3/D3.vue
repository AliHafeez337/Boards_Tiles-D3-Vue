
<template>
  <div>
    <div id="d3">
    </div>
  </div>
</template>
 
<script>
  import * as d3 from "d3";
  import { event as d3Event, select, selectAll } from "d3-selection";
  import { config } from '../../../../CONFIG';
  import { 
    createContextMenu, 
    filter,
    distance,
    getColor,
    mouseover,
    mousemove,
    mousemoveBackLeft,
    mousemoveBackRight,
    mouseleave } from './externalD3';
  import backLLeft from './BackLoaded/BackLeft';
  import backLRight from './BackLoaded/BackRight';
  
  export default {
    components: {
      backLLeft,
      backLRight
    },
    props: ['sections', 'sectionName', 'tiles', 'labels', 'search'],
    data() {
      return {
        zoomChanged: 0,
        height: window.innerWidth,
        width: window.innerWidth,
        justOnce: false,
        usertype: ''
      }
    },
    created() {
      this.profile = this.$store.getters.getProfile
      if (this.profile.usertype){
        this.usertype = this.profile.usertype
      }
    },
    // computed: {
    //   getColorPallet() {
    //     if (this.$store.getters.getColor){
    //       return this.$store.getters.getColor
    //     }
    //   },
    // },
    // watch: {
    //   getColorPallet: function (val) {
    //     console.log(val)
    //   }
    // },
    mounted() {
      d3.select("svg").remove();
      this.renderD3();
    },
    methods: {
      renderD3() {
        console.log("D3 Loading...")
        
        var thisComponent = this

        var sectionMenuItems = [], tileMenuItems = []
        if (this.usertype === 'fleet'){
          sectionMenuItems = [
            {
              title: 'Arrange tiles',
              action: (d, _this) => {
                console.log('Section tiles arranging clicked');
                
                var rect = d3.select('#' + d.id);
                this.$store.dispatch('arrangeTiles', rect.attr('id'))
              }
            },
            {
              title: 'Sort tiles',
              action: (d, _this) => {
                console.log('Section tiles sorting clicked');
                
                var rect = d3.select('#' + d.id);

                this.$store.dispatch('sortTiles', rect.attr('id'))
              }
            },
            {
              title: 'Change color',
              action: (d, _this) => {
                console.log('Section change color clicked');
                
                var rect = d3.select('#' + d.id);
                // var frame = d3.select('#' + d.id + '-f');
                var frame = d3.select('#' + d.id + '-n');

                // either getColor() or colorPallet(), both work...

                // getColor()
                // // colorPallet()
                //   .then(color => {
                //     changeColor(d, _this, rect, color)
                //     changeColor(d, _this, frame, color)
                //   })

                setColor(d, [rect, frame])
              }
            }
          ];
          
          tileMenuItems = [
            {
              title: 'Event name',
              action: (d, _this) => {
                console.log('Event name clicked')

                var eName = prompt("Please enter the Event title.");
                if (eName){
                  d.event_name = eName

                  store.dispatch('changeTile', { 
                    id: d.id,
                    x: d.x,
                    y: d.y,
                    backLeft: d.backLeft,
                    backRight: d.backRight,
                    event_name: d.event_name,
                    event_due: d.event_due
                  })
                }
              }
            },
            {
              title: 'Event due date',
              action: (d, _this) => {
                console.log('Event due date clicked')

                var eDate = prompt("Please enter the Event due date in format DD-MM-YYYY, '-' are also not necessary, just 8 digits are necessary.");
                if (eDate){
                  const e = eDate.replace ( /[^\d.]/g, '' )
                  // console.log(e)
                  
                  if (e.length !== 8){
                    return
                  }
                  var newDate = e[2] + e[3] + '-' + e[0] + e[1] + '-' + e[4] + e[5] + e[6] + e[7]
                  console.log(newDate)
                  
                  var timestamp = Date.parse(newDate);
                  if (isNaN(timestamp) == false) {
                    var dd = new Date(timestamp);
                    // console.log(dd.getTime() / 1000)
                    
                    d.event_due = dd.getTime() / 1000
                    
                    var tile = d3.select('#' + d.id + '-w');
                    const time = Date.now(), due = +d.event_due * +1000
                    
                    // 259200000 are 3 days and 604800 are 1 week
                    // get times from https://www.epochconverter.com/timestamp-list
                    if (due - time < 604800000){
                      tile.style("opacity", 1)
                    } else {
                      tile.style("opacity", 0)
                    }
                    
                    if (due - time < 259200000){
                      tile.style("fill", config.tile_3_days_warning_color)
                    } else if (d.event_due && due - time < 604800000){
                      tile.style("fill", config.tile_7_days_warning_color)
                    } else {
                      tile.style("fill", d.color)
                    }

                    store.dispatch('changeTile', { 
                      id: d.id,
                      x: d.x,
                      y: d.y,
                      backLeft: d.backLeft,
                      backRight: d.backRight,
                      event_name: d.event_name,
                      event_due: dd.getTime() / 1000
                    })
                  }
                }
              }
            },
            {
              title: 'Remove event',
              action: (d, _this) => {
                console.log("Removing event clicked.")

                d.event_name = '', d.event_due = ''
                store.dispatch('changeTile', { 
                  id: d.id,
                  x: d.x,
                  y: d.y,
                  backLeft: d.backLeft,
                  backRight: d.backRight,
                  event_name: '',
                  event_due: null
                })
              }
            },
            {
              title: 'Back Loaded Left',
              action: (d, _this) => {
                console.log('Tile back loaded left clicked');
                
                d3.select('#' + d.id + '-bl').style('opacity', 1);
                
                // this.BackLoadedL = true
                var back_title = prompt("Please enter the left BackLoaded title.");
                if (back_title) {
                  d.backLTitle = back_title
                  
                  store.dispatch('changeTile', { 
                    id: d.id,
                    x: d.x,
                    y: d.y,
                    backLeft: true,
                    back_title: back_title,
                    backRight: d.backRight,
                    event_name: d.event_name,
                    event_due: d.event_due
                  })
                } else {
                  store.dispatch('changeTile', { 
                    id: d.id,
                    x: d.x,
                    y: d.y,
                    backLeft: true,
                    backRight: d.backRight,
                    event_name: d.event_name,
                    event_due: d.event_due
                  })
                }
              }
            },
            {
              title: 'Back Loaded Right',
              action: (d, _this) => {
                console.log('Tile back loaded right clicked');
                
                d3.select('#' + d.id + '-br').style('opacity', 1);

                // this.BackLoadedR = true
                var back_title = prompt("Please enter the right BackLoaded title.");
                if (back_title) {
                  d.backRTitle = back_title

                  store.dispatch('changeTile', { 
                    id: d.id,
                    x: d.x,
                    y: d.y,
                    backLeft: d.backLeft,
                    backRight: true,
                    backRTitle: back_title,
                    event_name: d.event_name,
                    event_due: d.event_due
                  })
                } else {
                  store.dispatch('changeTile', { 
                    id: d.id,
                    x: d.x,
                    y: d.y,
                    backLeft: d.backLeft,
                    backRight: true,
                    event_name: d.event_name,
                    event_due: d.event_due
                  })
                }
              }
            },
            {
              title: 'Add label',
              action: (d, _this) => {
                console.log('Tile add label clicked');
                
                const id = d.id
                var rect = d3.select('#' + id)
                var parent = d3.select('#' + d.id + '-p');

                var x = Number(rect.attr('x'));
                var y = Number(rect.attr('y'));

                getColor()
                // colorPallet()
                  .then(color => {
                    var number = parent.selectAll('rect')._groups[0].length

                    var thisLabel = parent
                                      .append('rect')
                                      .attr('class', d => 'label ' + ((x + 2) + (number * d.width)) + '-' + (y + 2))
                                      .attr('id', d => d.id + '-' + (number - 3))

                    // Number - 3 (3 represents that there are 3 rects before the labels)
                    thisLabel
                      .attr("width", d => config.label_width)
                      .attr("height", d => config.label_height)
                      .attr("x", d => (+x + +2) + +(((number - 3) * (config.label_width + config.gap_between_labels)) + config.lebel_padding_from_left) - +config.label_width)
                      .attr("y", (+y + +2))
                      .attr("rx", config.labels_edges_round)
                      .attr("ry", config.labels_edges_round)
                      .style("opacity", config.label_opacity)
                      .style("fill", color)
                      // .on("click", function(d){
                      //   removeLabel(this, d);
                      // })
                      .on('contextmenu', function (d) {
                        var coords = d3.mouse(this);
                        createContextMenu(d, coords[0], coords[1], labelMenu, '.contextGroup', this);
                      })
                      .call(
                        d3.drag()
                          .on("start", function started(d) {
                            tileDrag(d)
                          })
                      );

                    store.dispatch('pushLabel', {
                      tile: id,
                      color: color
                    })
                  })
              }
            },
            {
              title: 'Change color',
              action: async (d, _this) => {
                console.log('Tile color button clicked');

                var rect = await d3.select('#' + d.id)
                
                // getColor()
                // // colorPallet()
                //   .then(color => changeColor(d, _this, rect, color))
                  
                setColor(d, [rect])
              }
            },
            {
              title: 'Asset information',
              action: (d, _this) => {
                this.$store.dispatch('setModalDetails', true)
                this.$store.dispatch('setTile', d)
              }
            }
          ];
        } else {
          sectionMenuItems = [
            {
              title: 'Arrange tiles',
              action: (d, _this) => {
                console.log('Section tiles arranging clicked');
                
                var rect = d3.select('#' + d.id);
                this.$store.dispatch('arrangeTiles', rect.attr('id'))
              }
            },
            {
              title: 'Sort tiles',
              action: (d, _this) => {
                console.log('Section tiles sorting clicked');
                
                var rect = d3.select('#' + d.id);

                this.$store.dispatch('sortTiles', rect.attr('id'))
              }
            },
            {
              title: 'Change color',
              action: (d, _this) => {
                console.log('Section change color clicked');
                
                var rect = d3.select('#' + d.id);
                // var frame = d3.select('#' + d.id + '-f');
                var frame = d3.select('#' + d.id + '-n');

                // either getColor() or colorPallet(), both work...

                // getColor()
                // // colorPallet()
                //   .then(color => {
                //     changeColor(d, _this, rect, color)
                //     changeColor(d, _this, frame, color)
                //   })

                setColor(d, [rect, frame])
              }
            },
            {
              title: 'Remove section',
              action: (d, _this) => {
                console.log('Section X clicked');

                if (confirm("Do you really want to delete this section?")) {
                  var rect = d3.select('#' + d.id);
                  var text = d3.select('#' + d.id + '-n-t');
                  var frame = d3.select('#' + d.id + '-n');
                  
                  rect.remove();
                  text.remove();
                  frame.remove();

                  this.$store.dispatch('removeSection', d.id)
                }
              }
            }
          ];

          tileMenuItems = [
            {
              title: 'Event name',
              action: (d, _this) => {
                console.log('Event name clicked')

                var eName = prompt("Please enter the Event title.");
                if (eName){
                  d.event_name = eName

                  store.dispatch('changeTile', { 
                    id: d.id,
                    x: d.x,
                    y: d.y,
                    backLeft: d.backLeft,
                    backRight: d.backRight,
                    event_name: d.event_name,
                    event_due: d.event_due
                  })
                }
              }
            },
            {
              title: 'Event due date',
              action: (d, _this) => {
                console.log('Event due date clicked')

                var eDate = prompt("Please enter the Event due date in format DD-MM-YYYY, '-' are also not necessary, just 8 digits are necessary.");
                if (eDate){
                  const e = eDate.replace ( /[^\d.]/g, '' )
                  // console.log(e)
                  
                  if (e.length !== 8){
                    return
                  }
                  var newDate = e[2] + e[3] + '-' + e[0] + e[1] + '-' + e[4] + e[5] + e[6] + e[7]
                  console.log(newDate)
                  
                  var timestamp = Date.parse(newDate);
                  if (isNaN(timestamp) == false) {
                    var dd = new Date(timestamp);
                    // console.log(dd.getTime() / 1000)
                    
                    d.event_due = dd.getTime() / 1000
                    
                    var tile = d3.select('#' + d.id + '-w');
                    const time = Date.now(), due = +d.event_due * +1000
                    
                    // 259200000 are 3 days and 604800 are 1 week
                    // get times from https://www.epochconverter.com/timestamp-list
                    if (due - time < 604800000){
                      tile.style("opacity", 1)
                    } else {
                      tile.style("opacity", 0)
                    }
                    
                    if (due - time < 259200000){
                      tile.style("fill", config.tile_3_days_warning_color)
                    } else if (d.event_due && due - time < 604800000){
                      tile.style("fill", config.tile_7_days_warning_color)
                    } else {
                      tile.style("fill", d.color)
                    }

                    store.dispatch('changeTile', { 
                      id: d.id,
                      x: d.x,
                      y: d.y,
                      backLeft: d.backLeft,
                      backRight: d.backRight,
                      event_name: d.event_name,
                      event_due: dd.getTime() / 1000
                    })
                  }
                }
              }
            },
            {
              title: 'Remove event',
              action: (d, _this) => {
                console.log("Removing event clicked.")

                d.event_name = '', d.event_due = ''
                store.dispatch('changeTile', { 
                  id: d.id,
                  x: d.x,
                  y: d.y,
                  backLeft: d.backLeft,
                  backRight: d.backRight,
                  event_name: '',
                  event_due: null
                })
              }
            },
            {
              title: 'Back Loaded Left',
              action: (d, _this) => {
                console.log('Tile back loaded left clicked');
                
                d3.select('#' + d.id + '-bl').style('opacity', 1);
                
                // this.BackLoadedL = true
                var back_title = prompt("Please enter the left BackLoaded title.");
                if (back_title) {
                  d.backLTitle = back_title
                  
                  store.dispatch('changeTile', { 
                    id: d.id,
                    x: d.x,
                    y: d.y,
                    backLeft: true,
                    back_title: back_title,
                    backRight: d.backRight,
                    event_name: d.event_name,
                    event_due: d.event_due
                  })
                } else {
                  store.dispatch('changeTile', { 
                    id: d.id,
                    x: d.x,
                    y: d.y,
                    backLeft: true,
                    backRight: d.backRight,
                    event_name: d.event_name,
                    event_due: d.event_due
                  })
                }
              }
            },
            {
              title: 'Back Loaded Right',
              action: (d, _this) => {
                console.log('Tile back loaded right clicked');
                
                d3.select('#' + d.id + '-br').style('opacity', 1);

                // this.BackLoadedR = true
                var back_title = prompt("Please enter the right BackLoaded title.");
                if (back_title) {
                  d.backRTitle = back_title

                  store.dispatch('changeTile', { 
                    id: d.id,
                    x: d.x,
                    y: d.y,
                    backLeft: d.backLeft,
                    backRight: true,
                    backRTitle: back_title,
                    event_name: d.event_name,
                    event_due: d.event_due
                  })
                } else {
                  store.dispatch('changeTile', { 
                    id: d.id,
                    x: d.x,
                    y: d.y,
                    backLeft: d.backLeft,
                    backRight: true,
                    event_name: d.event_name,
                    event_due: d.event_due
                  })
                }
              }
            },
            {
              title: 'Add label',
              action: (d, _this) => {
                console.log('Tile add label clicked');
                
                const id = d.id
                var rect = d3.select('#' + id)
                var parent = d3.select('#' + d.id + '-p');

                var x = Number(rect.attr('x'));
                var y = Number(rect.attr('y'));

                getColor()
                // colorPallet()
                  .then(color => {
                    var number = parent.selectAll('rect')._groups[0].length

                    var thisLabel = parent
                                      .append('rect')
                                      .attr('class', d => 'label ' + ((x + 2) + (number * d.width)) + '-' + (y + 2))
                                      .attr('id', d => d.id + '-' + (number - 3))

                    // Number - 3 (3 represents that there are 3 rects before the labels)
                    thisLabel
                      .attr("width", d => config.label_width)
                      .attr("height", d => config.label_height)
                      .attr("x", d => (+x + +2) + +(((number - 3) * (config.label_width + config.gap_between_labels)) + config.lebel_padding_from_left) - +config.label_width)
                      .attr("y", (+y + +2))
                      .attr("rx", config.labels_edges_round)
                      .attr("ry", config.labels_edges_round)
                      .style("opacity", config.label_opacity)
                      .style("fill", color)
                      // .on("click", function(d){
                      //   removeLabel(this, d);
                      // })
                      .on('contextmenu', function (d) {
                        var coords = d3.mouse(this);
                        createContextMenu(d, coords[0], coords[1], labelMenu, '.contextGroup', this);
                      })
                      .call(
                        d3.drag()
                          .on("start", function started(d) {
                            tileDrag(d)
                          })
                      );

                    store.dispatch('pushLabel', {
                      tile: id,
                      color: color
                    })
                  })
              }
            },
            {
              title: 'Change color',
              action: async (d, _this) => {
                console.log('Tile color button clicked');

                var rect = await d3.select('#' + d.id)
                
                // getColor()
                // // colorPallet()
                //   .then(color => changeColor(d, _this, rect, color))
                  
                setColor(d, [rect])
              }
            },
            {
              title: 'Asset information',
              action: (d, _this) => {
                this.$store.dispatch('setModalDetails', true)
                this.$store.dispatch('setTile', d)
              }
            },
            {
              title: 'Remove tile',
              action: (d, _this) => {
                console.log('Tile X clicked');

                if (confirm("Do you really want to delete this tile?")) {
                  var rectsGroup = d3.select('#' + d.id + '-p').selectAll('rect').classed("dragging", true);
                  var text = d3.select('#' + d.id + '-t');
                  var backLeft = d3.select('#' + d.id + '-bl');
                  var backRight = d3.select('#' + d.id + '-br');
                  var warning = d3.select('#' + d.id + '-w');

                  text.remove();
                  backLeft.remove();
                  backRight.remove();
                  warning.remove();

                  var selection;
                  rectsGroup._groups[0].forEach((rect, index) => {
                    if (index > 0){
                      selection = d3.select('#' + d.id + '-' + index.toString())
                    } else {
                      selection = d3.select('#' + d.id)
                    }
                    selection.remove()
                  })

                  this.$store.dispatch('removeTile', d.id)
                }
              }
            }
          ];
        }

        const backLoadedLeft = [
          {
            title: 'Remove back-loaded',
            action: (d, _this) => {
              console.log('Remove back loaded clicked');
              
              d3.select('#' + d.id + '-bl').style('opacity', 0);
              d.backLTitle = ''

              store.dispatch('changeTile', { 
                id: d.id,
                x: d.x,
                y: d.y,
                backLeft: false,
                backLTitle: '',
                backRight: d.backRight,
                event_name: d.event_name,
                event_due: d.event_due
              })
            }
          },
        ]

        const backLoadedRight = [
          {
            title: 'Remove back-loaded',
            action: (d, _this) => {
              console.log('Remove back loaded clicked');
              
              d3.select('#' + d.id + '-br').style('opacity', 0);
              d.backRTitle = ''
              
              store.dispatch('changeTile', { 
                id: d.id,
                x: d.x,
                y: d.y,
                backLeft: d.backLeft,
                backRight: false,
                backRTitle: '',
                event_name: d.event_name,
                event_due: d.event_due
              })
            }
          },
        ]

        const labelMenu = [
          {
            title: 'Remove label',
            action: (d, _this) => {
              console.log('Remove label clicked');
              
              removeLabel(_this, d);
            }
          },
        ]

        const store = this.$store;

        // var colorPallet = () => {
        //   return new Promise(resolve => {
        //     store.dispatch('setColor', '')
        //     store.dispatch('setModalColor', true)
        //     var colorInterval = setInterval(function() {
        //       if (store.getters.getColor){
        //         clearInterval(colorInterval)
        //         const c = store.getters.getColor
        //         console.log(c)
        //         store.dispatch('setColor', '')
        //         resolve(c)
        //       }
        //     }, 250)
        //   })
        // }

        var setColor = function (d, selections) {
          // IMPORTANT: Remove the old input color element with old event listeneres and place a new one with no event listener
          // coppied from: https://stackoverflow.com/questions/9251837/how-to-remove-all-listeners-in-an-element
          var old_element = document.querySelector('#color');
          var new_element = old_element.cloneNode(true);
          old_element.parentNode.replaceChild(new_element, old_element);

          // Now select the new element
          var colorInput = document.querySelector('#color');
          // Click the new element
          colorInput.click();
          // Add event listener, whenever user clicks 'ok', this function fires
          colorInput.addEventListener('input', () => {
            var color = colorInput.value;

            selections.forEach(selection => {
              const id = selection.attr('id'), type = selection.attr('class').split(" ")[0];
              // console.log(id, type)
              selection.style("fill", color);

              if (type === 'tile'){
                store.dispatch('changeTileColor', { _id: d._id, color });
              } else if (type === 'section'){
                store.dispatch('changeSectionColor', { _id: d._id, color });
              } else if (type === 'sectionTextFrame'){
                store.dispatch('changeSectionName', {
                  id: id,
                  width: selection.attr('width'),
                  height: selection.attr('height'),
                  x: selection.attr('x'),
                  y: selection.attr('y'),
                  color: color 
                })
              }
            })
          })
        }
        
        // var changeColor = (d, _this, selection, color) => {
        //   const id = selection.attr('id'), type = selection.attr('class').split(" ")[0];
        //   // console.log(id, type)
        //   selection.style("fill", color);

        //   if (type === 'tile'){
        //     this.$store.dispatch('changeTileColor', { _id: d._id, color });
        //   } else if (type === 'section'){
        //     this.$store.dispatch('changeSectionColor', { _id: d._id, color });
        //   } else if (type === 'sectionTextFrame'){
        //     store.dispatch('changeSectionName', {
        //       id: id,
        //       width: selection.attr('width'),
        //       height: selection.attr('height'),
        //       x: selection.attr('x'),
        //       y: selection.attr('y'),
        //       color: color 
        //     })
        //   }
        // }

        var removeLabel = (t, d) => {
          var label = d3.select(t);
          const id = label.attr('id');
          const color = label.style('fill');
          const tile = id.substring(0, id.indexOf('-'));
          const start = parseInt(id.substring(id.indexOf('-') + 1));
          var rects = d3.select('#' + d.id + '-p').selectAll('rect');
          var rect;

          label.remove()
          
          this.$store.dispatch('removeLabel', {
            id,
            tile,
            start,
            color
          })

          // start + 3, 3 represents the number of rectangles before the labels
          for(let i = start + 3; i < rects._groups[0].length; i++){
            rect = d3.select(rects._groups[0][i]);
            rect.attr('x', rect.attr('x') - (config.label_width + config.gap_between_labels));
            rect.attr('id', d => d.id + '-' + (i - 1).toString())
          }
        }
        
        //Make an SVG Container
        var chartDiv = d3.select("#d3")

        var svgContainer = chartDiv
                            .append("svg:svg")
                            .attr("width", window.innerWidth)
                            .attr("height", window.innerHeight)
                            .attr("id", "svg");

        filter(svgContainer)

        const sectionDrag = (dd, _this) => {
          var changed = false

          if (this.usertype === 'admin' || this.usertype === 'user'){
            changed = true

            var rect = d3.select('#' + dd.id).classed("dragging", true);
            // var frame = d3.select('#' + dd.id + '-f').classed("dragging", true);
            // var text = d3.select('#' + dd.id + '-t').classed("dragging", true);
            var frame1 = d3.select('#' + dd.id + '-n').classed("dragging", true);
            var text1 = d3.select('#' + dd.id + '-n-t').classed("dragging", true);
            var t = d3.select('#' + dd.id + '-p')._groups[0][0]
            var firstChild = t.parentNode.firstChild;

            var x = Number(rect.attr('x'));
            var y = Number(rect.attr('y'));
            var w = Number(rect.attr('width'));
            var h = Number(rect.attr('height'));

            var orignialX = x, originalY = y;
            
            var groups = []
            d3.selectAll('.gTile')._groups[0].forEach(group => {

              let g = d3.select(group);
              let id = g.attr('id');
              let tile = d3.select('#' + id.substring(0, id.indexOf('-')))

              let tileX = tile.attr('x'), 
                tileY = tile.attr('y'),
                tileW = tile.attr('width'),
                tileH = tile.attr('height');
                
              let c1x = +tileX, c1y = tileY,
                c2x = +tileX + +tileW, c2y = +tileY,
                c3x = +tileX + +tileW, c3y = +tileY + +tileH,
                c4x = +tileX, c4y =  +tileY + +tileH;

              if (
                (c1x > x && c1x < (+x + +w) && c1y > y && c1y < (+y + +h)) ||
                (c2x > x && c2x < (+x + +w) && c2y > y && c2y < (+y + +h)) ||
                (c3x > x && c3x < (+x + +w) && c3y > y && c3y < (+y + +h)) ||
                (c4x > x && c4x < (+x + +w) && c4y > y && c4y < (+y + +h))
              ){
                console.log(`Some point of ${id} is inside the section`);
                tile.style("opacity", 0.2)
                groups.push(g)
              }

            })
            
            d3.event.on("drag", dragged).on("end", ended);

            x = Number(rect.attr('x'));
            y = Number(rect.attr('y'));
            w = Number(rect.attr('width'));
            h = Number(rect.attr('height'));

            const oneSixthX = w / 3.5, oneSixthY = h / 4.5
            const coords = d3.mouse(_this);
            
            console.log('Ending point', (+x + +w), (+y + +h), 'Division point', (+x + +w) - oneSixthX, (+y + +h) - oneSixthY, 'Starting point', x, y, 'Clicked point', coords[0], coords[1])

            function dragged(d) {
              var coords1 = d3.mouse(_this);

              if (coords[0] > (+x + +w) - oneSixthX && coords[1] > (+y + +h) - oneSixthY){
                // console.log('changing dimensions', this.usertype)
                
                let newWidth = w + (coords1[0] - (+x + +w)), newHeight = h + (coords1[1] - (+y + +h));
                d.width = newWidth, d.height = newHeight
                rect
                  .attr('width', newWidth)
                  .attr('height', newHeight);
                // frame
                //   .attr("x", d => {
                //     return  +d.x + (+newWidth / 2) - (+d.name.length * 5 / 2) - 10
                //   })
                // text
                //   .attr("x", d => {
                //     return  +d.x + (+newWidth / 2) - (+d.name.length * 5 / 2)
                //   })
              } else {
                // console.log('changing location')

                if (thisComponent.usertype === 'admin'){

                  d.x = coords1[0], d.y = coords1[1]
                  rect.raise().attr("x", d.x = coords1[0]).attr("y", d.y = coords1[1]);
                  // frame
                  //   .raise()
                  //   .attr("x", d => {
                  //     return  +d.x + (+w / 2) - (+d.name.length * 5 / 2) - 10
                  //   })
                  //   .attr("y", (+d.y + +config.section_text_y) - 15);
                  // text
                  //   .raise()
                  //   .attr("x", d => {
                  //     return  +coords1[0] + (+w / 2) - (+d.name.length * 5 / 2)
                  //   })
                  //   .attr("y", (+d.y + +config.section_text_y));
                } else {
                  changed = false
                }
              }
            }

            function ended(d) {
              console.log('section drag ends at:', rect.attr('x'), rect.attr('y'));
              // console.log(text.attr('x'), text.attr('y'));

              rect.classed("dragging", false);

              x = Number(rect.attr('x'));
              y = Number(rect.attr('y'));

              var diffX = x - orignialX, diffY = y - originalY
              var tiles = [], tile = {}
              console.log(diffX, diffY)

              frame1.attr('x', +frame1.attr('x') + +diffX)
              frame1.attr('y', +frame1.attr('y') + +diffY)

              text1.attr('x', +text1.attr('x') + +diffX)
              text1.attr('y', +text1.attr('y') + +diffY)
              
              groups.forEach(group => {
                let rects = group.selectAll('rect'), texts = group.selectAll('text')
                // console.log(group, rects, texts)
                rects._groups[0].forEach(rect => {
                  let _rect = d3.select(rect);
                  let _rectX = _rect.attr('x'), _rectY = _rect.attr('y')
                  
                  if (diffX >= 0){
                    _rect.attr('x', +_rectX + +diffX)
                    _rect.attr('y', +_rectY + +diffY)
                  } else {
                    _rect.attr('x', +diffX + +_rectX)
                    _rect.attr('y', +diffY + +_rectY)
                  }
                })

                texts._groups[0].forEach(text => {
                  let _text = d3.select(text);
                  let _textX = _text.attr('x'), _textY = _text.attr('y')
                  
                  if (diffX >= 0){
                    _text.attr('x', +_textX + +diffX)
                    _text.attr('y', +_textY + +diffY)
                  } else {
                    _text.attr('x', +diffX + +_textX)
                    _text.attr('y', +diffY + +_textY)
                  }
                })

                var mainRect = d3.select(rects._groups[0][0])
                mainRect.style("opacity", 1)
                tile = {
                  id: mainRect.attr('id'),
                  x: mainRect.attr('x'),
                  y: mainRect.attr('y')
                }
                tiles.push(tile)
              })

              // console.log(
              //   rect.attr('id'),
              //   rect.attr('width'),
              //   rect.attr('height'),
              //   rect.attr('x'),
              //   rect.attr('y')
              // )

              if (changed){
                store.dispatch('changeSectionName', {
                  id: frame1.attr('id'),
                  width: rect.attr('width'),
                  height: rect.attr('height'),
                  x: frame1.attr('x'),
                  y: frame1.attr('y'),
                  color: dd.color
                })

                store.dispatch('changeSection', {
                  _id: d._id,
                  width: rect.attr('width'),
                  height: rect.attr('height'),
                  x: rect.attr('x'),
                  y: rect.attr('y'),
                  tiles
                })
              }

              // IMPORTANT: Send the selected(the one you are dragging) on the back (according to z-axis) after you ended the drag other wise, the section will remain on top...
              if (firstChild) { 
                t.parentNode.insertBefore(t, firstChild); 
              }
            }

          }
        }

        var sectionGroup = svgContainer
                            .selectAll('.section')
                            .data(this.sections)
                            .enter()
                            .append('g')
                            .attr('class', d => 'g ' + d.x.toString() + '-' + d.y.toString())
                            .attr('id', d => d.id + '-p');

        var section = sectionGroup
                        .append('rect')
                        .attr('class', d => 'section ' + d.x.toString() + '-' + d.y.toString())
                        .attr('id', d => d.id);
        
        section
          .attr("width", d => d.width)
          .attr("height", d => d.height)
          .attr("x", d => d.x)
          .attr("y", d => d.y)
          .attr("rx", config.section_edges_round)
          .attr("ry", config.section_edges_round)
          .style("fill", d => d.color)
          .style("opacity", config.section_opacity)
          .on('contextmenu', function (d) {
            var coords = d3.mouse(this);
            createContextMenu(d, coords[0], coords[1], sectionMenuItems, '.contextGroup');
          })
          .call(d3.drag()
            .on('start', function started(dd) {
              sectionDrag(dd, this)
            })
          );

        // var frame = sectionGroup
        //             .append('rect')
        //             .attr('class', d => 'sectionTextFrame ' + d.x.toString() + '-' + d.y.toString())
        //             .attr('id', d => d.id + '-f');

        // frame
        //   .attr("width", d => (+d.name.length * 10) + (10 * 2))
        //   .attr("height", +config.section_text_size + 5)
        //   .attr("x", d => {
        //     return  +d.x + (+d.width / 2) - (+d.name.length * 5 / 2) - 10
        //   })
        //   .attr("y", d => +d.y + +config.section_text_y - 15)
        //   .attr("rx", config.tile_edges_round)
        //   .attr("ry", config.tile_edges_round)
        //   .style("opacity", config.tile_opacity)
        //   .style("fill", d => d.color)
        //   .attr("stroke-width", 2)
        //   .style("filter", "url(#drop-shadow)")
        //   .call(
        //     d3.drag()
        //     .on('start', function started(dd) {
        //       sectionDrag(dd, this)
        //     })
        //   );
        
        // var sectionText = sectionGroup
        //                     .append('text')
        //                     .attr('class', d => 'sectionText ' + d.x.toString() + '-' + d.y.toString())
        //                     .attr('id', d => d.id + '-t');

        // sectionText
        //   .attr("x", d => {
        //     return  +d.x + (+d.width / 2) - (+d.name.length * 5 / 2)
        //   })
        //   .attr("y", d => +d.y + +config.section_text_y)
        //   .text(d => d.name)
        //   .attr("font-family", config.section_text_font)
        //   .attr("font-size", config.section_text_size + 'px')
        //   .attr("fill", config.section_text_color)
        //   .call(d3.drag()
        //     .on('start', function started(dd) {
        //       sectionDrag(dd, this)
        //     })
        //   );


        const sectionNameDrag = (dd, _this) => {
          if (this.usertype === 'admin'){

            var rect = d3.select('#' + dd.id).classed("dragging", true);
            var text = d3.select('#' + dd.id + '-t').classed("dragging", true);

            // console.log(rect, text)
            d3.event.on("drag", dragged).on("end", ended);

            function dragged(d) {
              var coords = d3.mouse(_this);

              rect
                .attr('x', coords[0])
                .attr('y', coords[1])
              text
                .attr('x', +coords[0] + (+((+d.name.length * 5)) / 2))
                .attr('y', +coords[1] + +config.section_text_y - 4)
            }

            function ended(d) {
              console.log('sectionName drag ends at:', rect.attr('x'), rect.attr('y'));

              rect.classed("dragging", false);

              store.dispatch('changeSectionName', {
                id: d.id,
                width: rect.attr('width'),
                height: rect.attr('height'),
                x: rect.attr('x'),
                y: rect.attr('y'),
                color: dd.color 
              })
            }
          }
        }


        var sectionNameGroup = svgContainer
                            .selectAll('.sectionName')
                            .data(this.sectionName)
                            .enter()
                            .append('g')
                            .attr('class', d => 'g SectionName ' + d.x.toString() + '-' + d.y.toString())
                            .attr('id', d => d.id + '-p');

        var frame = sectionNameGroup
                      .append('rect')
                      .attr('class', d => 'sectionTextFrame ' + d.x.toString() + '-' + d.y.toString())
                      .attr('id', d => d.id);

        frame
          .attr("width", d => (+d.name.length * config.a_letter_width) + (5 * 2))
          .attr("height", +config.section_text_size + 5)
          .attr("x", d => d.x)
          .attr("y", d => d.y)
          .attr("rx", config.tile_edges_round)
          .attr("ry", config.tile_edges_round)
          .style("opacity", config.tile_opacity)
          .style("fill", d => d.color)
          .attr("stroke-width", 2)
          .style("filter", "url(#drop-shadow)")
          .call(
            d3.drag()
            .on('start', function started(dd) {
              sectionNameDrag(dd, this)
            })
          );

        var sectionText = sectionNameGroup
                            .append('text')
                            .attr('class', d => 'sectionText ' + d.x.toString() + '-' + d.y.toString())
                            .attr('id', d => d.id + '-t');

        sectionText
          .attr("x", d => {
            // return  +d.x + (+((+d.name.length * 10) + (10 * 2)) / 2) - (+d.name.length * 5 / 2)
            return  +d.x + (+((+d.name.length * 5)) / 2)
          })
          .attr("y", d => +d.y + +config.section_text_y - 4)
          .text(d => d.name)
          .attr("font-family", config.section_text_font)
          .attr("font-size", config.section_text_size + 'px')
          .attr("fill", config.section_text_color)
          .call(d3.drag()
            .on('start', function started(dd) {
              sectionNameDrag(dd, this)
            })
          );

        const tileDrag = d => {
          if (this.usertype === 'admin' || this.usertype === 'user'){

            var rectsGroup = d3.select('#' + d.id + '-p').selectAll('rect').classed("dragging", true);
            var backL = d3.select('#' + d.id + '-bl').classed("dragging", true);
            var backR = d3.select('#' + d.id + '-br').classed("dragging", true);
            var warning = d3.select('#' + d.id + '-w').classed("dragging", true);
            var text = d3.select('#' + d.id + '-t').classed("dragging", true);

            var rects = [], selection;
            rectsGroup._groups[0].forEach((rect, index) => {

              if (index > 0){
                selection = d3.select('#' + d.id + '-' + index.toString())
              } else {
                selection = d3.select('#' + d.id)
              }
              rects.push(selection)
            })

            d3.event.on("drag", dragged).on("end", ended);

            var dd = d;
            function dragged(d) {
              var bigBrother, x, y, coords = d3.mouse(this);

              bigBrother = d3.select('#' + dd.id)
              x = (bigBrother.attr('x')).toString()
              y = (bigBrother.attr('y')).toString();

              //   console.log(rects[0])
              // rects[0]
              //   .attr("x", coords[0])
              //   .attr("y", coords[1]);
              rects.forEach((rect, index) => {

                if (index > 0){
                  rect
                    .raise()
                    .attr("x", (+x + +config.padding_on_labels) + (((index) * (config.label_width + config.gap_between_labels)) + config.lebel_padding_from_left) - +config.label_width)
                    .attr("y", (+y + +config.padding_on_labels));
                } else {
                  rect
                    // .raise()
                    // .attr("x", d3.event.x)
                    // .attr("y", d3.event.y);
                    .attr("x", coords[0])
                    .attr("y", coords[1]);
                }
              }) 
              backL
                .raise()
                .attr("x", (+x + +config.back_left_padding_from_x))
                .attr("y", (+y + +config.back_left_padding_from_y));
              backR
                .raise()
                .attr("x", (+x + (+config.tile_width - +config.back_right_padding_from_right_x)))
                .attr("y", (+y + +config.back_right_padding_from_y));
              warning
                .raise()
                .attr("x", +x + +config.tile_warning_x)
                .attr("y", +y + +config.tile_warning_y);
              text
                .raise()
                .attr("x", (+x + +config.tile_text_x))
                .attr("y", (+y + +config.tile_text_y));
            }

            function ended() {
              console.log('Tile group drag ends at:')
              console.log(rects[0].attr('x'), rects[0].attr('y'));
              // var x, y;
              // rects.forEach((rect, index) => {
              //   x = (rect.attr('x')).toString()
              //   y = (rect.attr('y')).toString();
              //   console.log(x, y)
              // }) 
              // console.log(text.attr('x'), text.attr('y'))
              
              store.dispatch('changeTile', { 
                id: d.id,
                x: rects[0].attr('x'),
                y: rects[0].attr('y'),
                backLeft: d.backLeft,
                backRight: d.backRight,
                event_name: d.event_name,
                event_due: d.event_due
              })
              
              rectsGroup.classed("dragging", false);
            }
          }
        }

        var tileGroup = svgContainer
                          .selectAll('.tile')
                          .data(this.tiles)
                          .enter()
                          .append('g')
                          .attr('class', d => {
                            if (d.x && d.y){
                              return 'g gTile ' + d.x.toString() + '-' + d.y.toString()
                            } 
                            // else {
                            //   this.$store.commit('SET_ERR', { bool: true, errmsg: `Didn't receieve x and y values of tile ${d.name} from the API, please reselect the board... Don't worry, the data is saved...` })
                            // }
                          })
                          .attr('id', d => d.id + '-p');

        var tile = tileGroup
                    .append('rect')
                    .attr('class', d => 'tile ' + d.x.toString() + '-' + d.y.toString())
                    .attr('id', d => d.id);

        tile
          .attr("width", config.tile_width)
          .attr("height", config.tile_height)
          .attr("x", d => d.x)
          .attr("y", d => d.y)
          .attr("rx", config.tile_edges_round)
          .attr("ry", config.tile_edges_round)
          .style("opacity", config.tile_opacity)
          .style("fill", d => d.color)
          .attr("stroke-width", 2)
          .style("filter", "url(#drop-shadow)")
          .on("click", function(d) {
            console.log('TILE CLICKED')
          })
          .on('contextmenu', function (d) {
            var coords = d3.mouse(this);
            createContextMenu(d, coords[0], coords[1], tileMenuItems, '.contextGroup', this);
          })
          .call(
            d3.drag()
              .on("start", function started(d) {
                tileDrag(d)
              })
          )
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave);

        var tileWarning = tileGroup
                            .append('rect')
                            .attr('class', d => 'tileWarning ' + d.x.toString() + '-' + d.y.toString())
                            .attr('id', d => d.id + '-w');

        tileWarning
          .attr("width", config.tile_warning_width)
          .attr("height", config.tile_warning_height)
          .attr("x", d => +d.x + +config.tile_warning_x)
          .attr("y", d => +d.y + +config.tile_warning_y)
          .attr("rx", config.tile_warning_rounded_edge_x)
          .attr("ry", config.tile_warning_rounded_edge_y)
          .style("opacity", d => {
            const time = Date.now(), due = +d.event_due * +1000
            // console.log(time, d.event_due)
            // console.log((+d.event_due * +1000) - time)

            // 259200000 are 3 days and 604800 are 1 week
            // get times from https://www.epochconverter.com/timestamp-list
            if (d.event_due && due - time < 604800000){
              return 1
            } else {
              return 0
            }
          })
          .style("fill", d => {
            const time = Date.now(), due = +d.event_due * +1000
            
            if (d.event_due && due - time < 259200000){
              return config.tile_3_days_warning_color
            } else if (d.event_due && due - time < 604800000){
              return config.tile_7_days_warning_color
            } else {
              return d.color
            }
          })
          .on("click", function(d) {
            console.log('Tile warning CLICKED')
          })
          .on('contextmenu', function (d) {
            if (d.backLeft){
              var coords = d3.mouse(this);
              createContextMenu(d, coords[0], coords[1], tileMenuItems, '.contextGroup', this);
            }
          })
          .call(
            d3.drag()
              .on("start", function started(d) {
                tileDrag(d)
              })
          )
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave);

        var tileBackLeft = tileGroup
                            .append('rect')
                            .attr('class', d => 'back backLeft ' + d.x.toString() + '-' + d.y.toString())
                            .attr('id', d => d.id + '-bl');

        tileBackLeft
          .attr("width", config.back_left_width)
          .attr("height", config.back_left_height)
          .attr("x", d => +d.x + +config.back_left_padding_from_x)
          .attr("y", d => +d.y + +config.back_left_padding_from_y)
          .attr("rx", config.back_left_rounded_edges_y)
          .attr("ry", config.back_left_rounded_edges_y)
          .attr("stroke-width", config.back_left_stroke_width)
          .attr("stroke", config.back_left_stroke_color)
          .style("opacity", d => d.backLeft ? 1 : 0)
          .style("fill", config.back_left_color)
          .on("click", function(d) {
            console.log('Back Loaded Left CLICKED')
          })
          .on('contextmenu', function (d) {
            if (d.backLeft){
              var coords = d3.mouse(this);
              createContextMenu(d, coords[0], coords[1], backLoadedLeft, '.contextGroup');
            }
          })
          .call(
            d3.drag()
              .on("start", function started(d) {
                tileDrag(d)
              })
          )
          .on("mouseover", mouseover)
          .on("mousemove", mousemoveBackLeft)
          .on("mouseleave", mouseleave);

        var tileBackRight = tileGroup
                              .append('rect')
                              .attr('class', d => 'back backRight ' + d.x.toString() + '-' + d.y.toString())
                              .attr('id', d => d.id + '-br');

        tileBackRight
          .attr("width", config.back_right_width)
          .attr("height", config.back_right_height)
          .attr("x", d => +d.x + (+config.tile_width - +config.back_right_padding_from_right_x))
          .attr("y", d => +d.y + +config.back_right_padding_from_y)
          .attr("rx", config.back_right_rounded_edges_x)
          .attr("ry", config.back_right_rounded_edges_y)
          .attr("stroke-width", config.back_right_stroke_width)
          .attr("stroke", config.back_right_stroke_color)
          .style("opacity", d => d.backRight ? 1 : 0)
          .style("fill", d => config.back_right_color)
          .on("click", function(d) {
            console.log('Back Loaded Right CLICKED')
          })
          .on('contextmenu', function (d) {
            if (d.backRight){
              var coords = d3.mouse(this);
              createContextMenu(d, coords[0], coords[1], backLoadedRight, '.contextGroup');
            }
          })
          .call(
            d3.drag()
              .on("start", function started(d) {
                tileDrag(d)
              })
          )
          .on("mouseover", mouseover)
          .on("mousemove", mousemoveBackRight)
          .on("mouseleave", mouseleave);

        var tileText = tileGroup
                    .append('text')
                    .attr('class', d => 'tileText ' + d.x.toString() + '-' + d.y.toString())
                    .attr('id', d => d.id + '-t');

        tileText
          .attr("x", d => +d.x + +config.tile_text_x)
          .attr("y", d => +d.y + +config.tile_text_y)
          .text(d => d.name)
          .attr("font-family", config.tile_text_font)
          .attr("font-size", config.tile_text_size + 'px')
          .attr("fill", config.tile_text_color)
          .on('contextmenu', function (d) {
            var coords = d3.mouse(this);
            createContextMenu(d, coords[0], coords[1], tileMenuItems, '.contextGroup', this);
          })
          .call(
            d3.drag()
              .on("start", function started(d) {
                tileDrag(d)
              })
          )
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave);

        var a = [], b = []

        // console.log(this.labels)
        this.labels.forEach((label, index) => {

          var number = 1, c = a.indexOf(label.tile)
          if (c > -1){
            number = b[c] + 1
            b[c] = number
          } else {
            a.push(label.tile)
            b.push(1)
          }
          // console.log(number, a, b)

          var tile = d3.select('#' + label.tile)

          if (tile._groups[0][0]){
            var x = tile._groups[0][0].x.animVal.value;
            var y = tile._groups[0][0].y.animVal.value;

            var parent = d3.select('#' + label.tile + '-p')

            var thisLabel = parent
                              .append('rect')
                              .attr('class', d => 'label ' + ((x + 2) + (number * config.tile_width)) + '-' + (y + 2))
                              .attr('id', label.tile + '-' + number)
            thisLabel
              .attr("width", config.label_width)
              .attr("height", config.label_height)
              .attr("x", (x + 2) + ((number * (config.label_width + config.gap_between_labels)) + config.lebel_padding_from_left) - +config.label_width)
              .attr("y", (y + 2))
              .attr("rx", config.labels_edges_round)
              .attr("ry", config.labels_edges_round)
              .style("opacity", config.label_opacity)
              .style("fill", label.color)
              // .on("click", function(d){
              //   removeLabel(this, d);
              // })
              .on('contextmenu', function (d) {
                var coords = d3.mouse(this);
                createContextMenu(d, coords[0], coords[1], labelMenu, '.contextGroup', this);
              })
              .call(
                d3.drag()
                  .on("start", function started(d) {
                    tileDrag(d)
                  })
              );
          }
        })

        var tooltip = svgContainer
                        .append("text")
                        .style("opacity", 0)
                        .attr("class", "tooltip");

        var contextGroup = svgContainer
                            .append('g')
                            .attr('class', 'contextGroup')

        const k = this.height / this.width

        const x = d3.scaleLinear()
                    .domain([-4.5, 4.5])
                    .range([0, window.innerWidth])

        const y = d3.scaleLinear()
                    .domain([-4.5 * k, 4.5 * k])
                    .range([window.innerHeight, 0])


        // Board size: right 5000, left -200, top -170 bottom -2200
        const zoom = d3
                      .zoom()
                      .scaleExtent([config.max_zoom_out, config.max_zoom_in])
                      .translateExtent([[-200,-170],[4800,2200]])
                      .on("zoom", () => {
                        const transform = d3.event.transform;
                        this.zoomChanged++
                        // console.log(this.zoomChanged, transform.k, transform.x, transform.y)
                        if (this.zoomChanged === 1){
                          transform.k = config.default_zoom_level
                        }
                        
                        var oldZoom = null;
                        if (!this.justOnce){
                          oldZoom = this.$store.getters.getZoom;
                          this.justOnce = true
                        }

                        if (this.search){
                          if (this.zoomChanged === 1){
                            transform.k = this.search.k
                            transform.x = this.search.x
                            transform.y = this.search.y
                            // sectionGroup.attr("transform", "translate(" + this.search.x + "," + this.search.y + ") scale(" + this.search.k + ")");
                            // sectionNameGroup.attr("transform", "translate(" + this.search.x + "," + this.search.y + ") scale(" + this.search.k + ")");
                            // tileGroup.attr("transform", "translate(" + this.search.x + "," + this.search.y + ") scale(" + this.search.k + ")");
                            // tooltip.attr("transform", "translate(" + this.search.x + "," + this.search.y + ") scale(" + this.search.k + ")");
                            // contextGroup.attr("transform", "translate(" + this.search.x + "," + this.search.y + ") scale(" + this.search.k + ")");
                          }
                        
                        } else if (oldZoom && oldZoom.x && oldZoom.y && oldZoom.k){
                            transform.k = oldZoom.k
                            transform.x = oldZoom.x
                            transform.y = oldZoom.y
                          // sectionGroup.attr("transform", "translate(" + oldZoom.x + "," + oldZoom.y + ") scale(" + oldZoom.k + ")");
                          // sectionNameGroup.attr("transform", "translate(" + oldZoom.x + "," + oldZoom.y + ") scale(" + oldZoom.k + ")");
                          // tileGroup.attr("transform", "translate(" + oldZoom.x + "," + oldZoom.y + ") scale(" + oldZoom.k + ")");
                          // tooltip.attr("transform", "translate(" + oldZoom.x + "," + oldZoom.y + ") scale(" + oldZoom.k + ")");
                          // contextGroup.attr("transform", "translate(" + oldZoom.x + "," + oldZoom.y + ") scale(" + oldZoom.k + ")");
                        
                          store.dispatch('changeZoom', { 
                            zoom: oldZoom
                          })
                        } else {
                          store.dispatch('changeZoom', { 
                            zoom: d3.event.transform
                          })
                        }
                        
                        const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
                        const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);

                        sectionGroup.attr("transform", transform).attr("stroke-width", 5 / transform.k);
                        sectionNameGroup.attr("transform", transform).attr("stroke-width", 5 / transform.k);
                        tileGroup.attr("transform", transform).attr("stroke-width", 5 / transform.k);
                        tooltip.attr("transform", transform).attr("stroke-width", 5 / transform.k);
                        contextGroup.attr("transform", transform).attr("stroke-width", 5 / transform.k);
                        
                      });

        svgContainer.call(zoom).call(zoom.transform, d3.zoomIdentity);

      }
    }
  }
</script>