
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
    props: ['sections', 'tiles', 'labels', 'search'],
    data() {
      return {
        zoomChanged: 0,
        height: window.innerWidth,
        width: window.innerWidth,
        justOnce: false,
      }
    },
    mounted() {
      d3.select("svg").remove();
      this.renderD3();
    },
    methods: {
      renderD3() {
        console.log("D3 Loading...")
        
        var thisComponent = this

        const sectionMenuItems = [
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
              getColor()
                .then(color => changeColor(rect, color))
            }
          },
          {
            title: 'Remove section',
            action: (d, _this) => {
              console.log('Section X clicked');

              if (confirm("Do you really want to delete this section?")) {
                var rect = d3.select('#' + d.id);
                var text = d3.select('#' + d.id + '-t');
                
                rect.remove();
                text.remove();

                this.$store.dispatch('removeSection', d.id)
              }
            }
          }
        ];

        const tileMenuItems = [
          {
            title: 'Change event name',
            action: (d, _this) => {
              console.log('Event name clicked')
            }
          },
          {
            title: 'Change event due date',
            action: (d, _this) => {
              console.log('Event due date clicked')
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
                  backRight: d.backRight
                })
              } else {
                store.dispatch('changeTile', { 
                  id: d.id,
                  x: d.x,
                  y: d.y,
                  backLeft: true,
                  backRight: d.backRight
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
                  backRTitle: back_title
                })
              } else {
                store.dispatch('changeTile', { 
                  id: d.id,
                  x: d.x,
                  y: d.y,
                  backLeft: d.backLeft,
                  backRight: true
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
            action: (d, _this) => {
              console.log('Tile color button clicked');

              var rect = d3.select('#' + d.id)
              getColor()
                .then(color => changeColor(rect, color))
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
                backRTitle: ''
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
        
        var changeColor = (selection, color) => {
          const id = selection.attr('id'), type = selection.attr('class').split(" ")[0];
          // console.log(id, type)
          selection.style("fill", color);

          if (type === 'tile'){
            this.$store.dispatch('changeTileColor', { id, color });
          } else if (type === 'section'){
            this.$store.dispatch('changeSectionColor', { id, color });
          }
        }

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

        const store = this.$store;
        
        //Make an SVG Container
        var chartDiv = d3.select("#d3")

        var svgContainer = chartDiv
                            .append("svg:svg")
                            .attr("width", window.innerWidth)
                            .attr("height", window.innerHeight)
                            .attr("id", "svg");

        filter(svgContainer)

        const sectionDrag = (dd, _this) => {

          var rect = d3.select('#' + dd.id).classed("dragging", true);
          var text = d3.select('#' + dd.id + '-t').classed("dragging", true);
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

          function dragged(d) {
            var coords = d3.mouse(_this);
            var e = { x: coords[0], y: coords[1] }

            x = Number(rect.attr('x'));
            y = Number(rect.attr('y'));
            w = Number(rect.attr('width'));
            h = Number(rect.attr('height'));

            var c1 = { x: x, y: y };
            var c2 = { x: x + w, y: y };
            var c3 = { x: x + w, y: y + h };
            var c4 = { x: x, y: y + h };

            // // figure out which corner this is closest to
            var d = [];
            var m1 = distance(e, c1);
            var m2 = distance(e, c2);
            var m3 = distance(e, c3);
            var m4 = distance(e, c4);
            var min = Math.min(m1, m2, m3, m4)

            // console.log(min, m1, m2, m3, m4)
            if (min === m3) {
              let newWidth = w + (e.x - c3.x), newHeight = h + (e.y - c3.y);
              rect
                .attr('width', newWidth)
                .attr('height', newHeight);
            } else {
              rect.raise().attr("x", d.x = e.x).attr("y", d.y = e.y);
              text
                .raise()
                .attr("x", (+x + +config.section_text_x))
                .attr("y", (+y + +config.section_text_y));
            }
          }

          function ended() {
            console.log('section drag ends at:', rect.attr('x'), rect.attr('y'));
            // console.log(text.attr('x'), text.attr('y'));

            rect.classed("dragging", false);

            var diffX = x - orignialX, diffY = y - originalY
            var tiles = [], tile = {}
            
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
            store.dispatch('changeSection', { 
              id: rect.attr('id'),
              width: rect.attr('width'),
              height: rect.attr('height'),
              x: rect.attr('x'),
              y: rect.attr('y'),
              tiles
            })

            // IMPORTANT: Send the selected(the one you are dragging) on the back (according to z-axis) after you ended the drag other wise, the section will remain on top...
            if (firstChild) { 
              t.parentNode.insertBefore(t, firstChild); 
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
          .on("click", function() {
            console.log('SECTION CLICKED')
            getColor()
              .then(color => changeColor(d3.select(this), color))
          })
          .on('contextmenu', function (d) {
            var coords = d3.mouse(this);
            createContextMenu(d, coords[0], coords[1], sectionMenuItems, '.contextGroup');
          })
          .call(d3.drag()
            .on('start', function started(dd) {
              sectionDrag(dd, this)
            })
          );

        var sectionText = sectionGroup
                            .append('text')
                            .attr('class', d => 'sectionText ' + d.x.toString() + '-' + d.y.toString())
                            .attr('id', d => d.id + '-t');

        sectionText
          .attr("x", d => +d.x + +config.section_text_x)
          .attr("y", d => +d.y + +config.section_text_y)
          .text(d => d.name)
          .attr("font-family", config.section_text_font)
          .attr("font-size", config.section_text_size + 'px')
          .attr("fill", config.section_text_color)
          .call(d3.drag()
            .on('start', function started(dd) {
              sectionDrag(dd, this)
            })
          );

        const tileDrag = d => {
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
            })
            
            rectsGroup.classed("dragging", false);
          }
        }

        var tileGroup = svgContainer
                          .selectAll('.tile')
                          .data(this.tiles)
                          .enter()
                          .append('g')
                          .attr('class', d => 'g gTile ' + d.x.toString() + '-' + d.y.toString())
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
            createContextMenu(d, coords[0], coords[1], tileMenuItems, '.contextGroup');
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
              createContextMenu(d, coords[0], coords[1], tileMenuItems, '.contextGroup');
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
            createContextMenu(d, coords[0], coords[1], tileMenuItems, '.contextGroup');
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


        const zoom = d3
                      .zoom()
                      .scaleExtent([config.max_zoom_out, config.max_zoom_in])
                      .on("zoom", () => {
                        const transform = d3.event.transform;
                        this.zoomChanged++
                        // console.log(this.zoomChanged, transform.k)
                        if (this.zoomChanged === 1){
                          transform.k = config.default_zoom_level
                        }
                        
                        const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
                        const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);

                        sectionGroup.attr("transform", transform).attr("stroke-width", 5 / transform.k);
                        tileGroup.attr("transform", transform).attr("stroke-width", 5 / transform.k);
                        tooltip.attr("transform", transform).attr("stroke-width", 5 / transform.k);
                        contextGroup.attr("transform", transform).attr("stroke-width", 5 / transform.k);
                        
                        var oldZoom = null;
                        if (!this.justOnce){
                          oldZoom = this.$store.getters.getZoom;
                          this.justOnce = true
                        }

                        if (this.search){
                          sectionGroup.attr("transform", "translate(" + this.search.x + "," + this.search.y + ") scale(" + this.search.k + ")");
                          tileGroup.attr("transform", "translate(" + this.search.x + "," + this.search.y + ") scale(" + this.search.k + ")");
                          tooltip.attr("transform", "translate(" + this.search.x + "," + this.search.y + ") scale(" + this.search.k + ")");
                          contextGroup.attr("transform", "translate(" + this.search.x + "," + this.search.y + ") scale(" + this.search.k + ")");
                        
                        } else if (oldZoom && oldZoom.x && oldZoom.y && oldZoom.k){
                          sectionGroup.attr("transform", "translate(" + oldZoom.x + "," + oldZoom.y + ") scale(" + oldZoom.k + ")");
                          tileGroup.attr("transform", "translate(" + oldZoom.x + "," + oldZoom.y + ") scale(" + oldZoom.k + ")");
                          tooltip.attr("transform", "translate(" + oldZoom.x + "," + oldZoom.y + ") scale(" + oldZoom.k + ")");
                          contextGroup.attr("transform", "translate(" + oldZoom.x + "," + oldZoom.y + ") scale(" + oldZoom.k + ")");
                        
                          store.dispatch('changeZoom', { 
                            zoom: oldZoom
                          })
                        } else {
                          store.dispatch('changeZoom', { 
                            zoom: d3.event.transform
                          })
                        }
                      });

        svgContainer.call(zoom).call(zoom.transform, d3.zoomIdentity);

      }
    }
  }
</script>