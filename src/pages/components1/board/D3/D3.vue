
<template>
  <div id="d3">
  </div>
</template>
 
<script>
  import * as d3 from "d3";
  import {event as d3Event, select, selectAll} from "d3-selection";

  import { config } from '../../../../CONFIG';

  export default {
    props: ['sections', 'tiles', 'labels'],
    data() {
      return {
        height: window.innerWidth,
        width: window.innerWidth
      }
    },
    mounted() {
      d3.select("svg").remove();
      this.renderD3();
    },
    methods: {
      renderD3() {
        //Make an SVG Container
        var chartDiv = d3.select("#d3")
        var svgContainer = chartDiv
                            .append("svg:svg")
                            .attr("width", window.innerWidth)
                            .attr("height", window.innerHeight);

        var distance = function (p1, p2) {
          return Math.pow(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2), 0.5);
        };

        var getColor = function () {
          return new Promise(resolve => {
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
              resolve(colorInput.value);
            })
          });
        }

        var removeLabel = (t, d) => {
          const id = d3.select(t).attr('id');
          const start = parseInt(id.substring(id.indexOf('-') + 1));
          var rects = d3.select('#' + d.id + '-p').selectAll('rect');
          var rect;

          d3.select(t).remove()
          for(let i = start + 1; i < rects._groups[0].length; i++){
            rect = d3.select(rects._groups[0][i]);
            rect.attr('x', rect.attr('x') - (config.label_width + config.gap_between_labels));
            rect.attr('id', d => d.id + '-' + (i - 1).toString())
          }
        }

        var sectionGroup = svgContainer.selectAll('.section')
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
              .then(color => d3.select(this).style("fill", color))
          })
          .call(d3.drag()
            .on('start', function started(dd) {
                var rect = d3.select(this).classed("dragging", true);
                var text = d3.select('#' + rect.attr('id') + '-t').classed("dragging", true);
                var circle = d3.select('#' + rect.attr('id') + '-x').classed("dragging", true);
                console.log(d3.select('#' + rect.attr('id') + '-p')._groups[0][0].parentNode.firstChild)
                var t = d3.select('#' + rect.attr('id') + '-p')._groups[0][0]
                var firstChild = t.parentNode.firstChild;
                var changeC = false;
                
                d3.event.on("drag", dragged).on("end", ended);

                function dragged(d) {
                  var coords = d3.mouse(this);
                  var e = { x: coords[0], y: coords[1] }

                  var x = Number(rect.attr('x'));
                  var y = Number(rect.attr('y'));
                  var w = Number(rect.attr('width'));
                  var h = Number(rect.attr('height'));

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
                    rect
                      .attr('width', function () { return w + (e.x - c3.x); })
                      .attr('height', function () { return h + (e.y - c3.y); });
                  } else if (min === m2) {
                    changeC = true;
                  } else {
                    rect.raise().attr("x", d.x = e.x).attr("y", d.y = e.y);
                  }
                  text
                    .raise()
                    .attr("x", (+x + +config.section_text_x))
                    .attr("y", (+y + +config.section_text_y));
                  circle
                    .raise()
                    .attr("cx", (+x + +config.section_x_x))
                    .attr("cy", (+y + +config.section_x_y));
                }

                function ended() {
                  if (changeC){
                    console.log(changeC, rect)
                    getColor()
                      .then(color => rect.style("fill", color))
                  }
                  console.log('section drag ends at:', rect.attr('x'), rect.attr('y'));
                  console.log(text.attr('x'), text.attr('y'));
                  console.log(circle.attr('cx'), circle.attr('cy'));
                  rect.classed("dragging", false);

                  // IMPORTANT: Send the selected(the one you are dragging) on the back (according to z-axis) after you ended the drag other wise, the section will remain on top...
                  if (firstChild) { 
                    t.parentNode.insertBefore(t, firstChild); 
                  }
                }
            })
          );
        
        var sectionX = sectionGroup
                          .append('circle')
                          .attr('class', d => 'sectionX ' + d.x.toString() + '-' + d.y.toString())
                          .attr('id', d => d.id + '-x');

        sectionX
          .attr("cx", d => d.x + config.section_x_x)
          .attr("cy", d => d.y + config.section_x_y)
          .attr("r", config.section_x_radius)
          .style("opacity", config.section_x_opacity)
          .style("fill", config.section_x_color)
          .on("click", function(d) {
            console.log('Section X clicked');
            var rect = d3.select('#' + d.id).classed("dragging", true);
            var text = d3.select('#' + d.id + '-t').classed("dragging", true);
            var circle = d3.select('#' + d.id + '-x').classed("dragging", true);
            
            rect.remove();
            text.remove();
            circle.remove();
          });

        var sectionText = sectionGroup
                    .append('text')
                    .attr('class', d => 'sectionText ' + d.x.toString() + '-' + d.y.toString())
                    .attr('id', d => d.id + '-t');

        sectionText
          .attr("x", d => d.x + config.section_text_x)
          .attr("y", d => d.y + config.section_text_y)
          .text(d => d.name)
          .attr("font-family", config.section_text_font)
          .attr("font-size", config.section_text_size + 'px')
          .attr("fill", config.section_text_color);

        var tileGroup = svgContainer.selectAll('.tile')
                  .data(this.tiles)
                  .enter()
                  .append('g')
                  .attr('class', d => 'g ' + d.x.toString() + '-' + d.y.toString())
                  .attr('id', d => d.id + '-p');

        var tile = tileGroup
                    .append('rect')
                    .attr('class', d => 'tile ' + d.x.toString() + '-' + d.y.toString())
                    .attr('id', d => d.id);

        tile
          .attr("width", d => d.width)
          .attr("height", d => d.height)
          .attr("x", d => d.x)
          .attr("y", d => d.y)
          .attr("rx", config.tile_edges_round)
          .attr("ry", config.tile_edges_round)
          .style("opacity", config.tile_opacity)
          .style("fill", d => d.color)
          .on("click", function(d) {
            console.log('TILE CLICKED')
            
            var coords = d3.mouse(this);
            var e = { x: coords[0], y: coords[1] }
            var rect = d3.select(this)
            var parent = d3.select('#' + d.id + '-p');

            var x = Number(rect.attr('x'));
            var y = Number(rect.attr('y'));
            var w = Number(rect.attr('width'));
            var h = Number(rect.attr('height'));

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
            if (min === m1 || min === m4){
              getColor()
                .then(color => rect.style("fill", color))
            } else if (min === m2 || min === m3) {
              getColor()
                .then(color => {
                  var number = parent.selectAll('rect')._groups[0].length

                  var thisLabel = parent
                                    .append('rect')
                                    .attr('class', d => 'label ' + ((x + 2) + (number * d.width)) + '-' + (y + 2))
                                    .attr('id', d => d.id + '-' + number)

                  thisLabel
                    .attr("width", d => config.label_width)
                    .attr("height", d => config.label_height)
                    .attr("x", d => (x + 2) + (number * (config.label_width + 5)))
                    .attr("y", (y + 2))
                    .attr("rx", config.labels_edges_round)
                    .attr("ry", config.labels_edges_round)
                    .style("opacity", config.label_opacity)
                    .style("fill", color)
                    .on("click", function(d){
                      removeLabel(this, d);
                    });
                })
            }
          })
          .call(
            d3.drag()
              .on("start", function started(d) {
                var rectsGroup = d3.select('#' + d.id + '-p').selectAll('rect').classed("dragging", true);
                var text = d3.select('#' + d.id + '-t').classed("dragging", true);
                var circle = d3.select('#' + d.id + '-x').classed("dragging", true);

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
                  rects.forEach((rect, index) => {

                    if (index > 0){
                      rect
                        .raise()
                        .attr("x", (+x + +config.padding_on_labels) + (+index * +(+config.label_width + +config.gap_between_labels)))
                        .attr("y", (+y + +config.padding_on_labels));
                    } else {
                      rect
                        .raise()
                        // .attr("x", d3.event.x)
                        // .attr("y", d3.event.y);
                        .attr("x", coords[0])
                        .attr("y", coords[1]);
                    }
                  }) 
                  text
                    .raise()
                    .attr("x", (+x + +config.tile_text_x))
                    .attr("y", (+y + +config.tile_text_y));
                  circle
                    .raise()
                    .attr("cx", (+x + +config.tile_x_x))
                    .attr("cy", (+y + +config.tile_x_y));
                }

                function ended() {
                  console.log('Tile group drag ends at:')
                  var x, y;
                  rects.forEach((rect, index) => {
                    x = (rect.attr('x')).toString()
                    y = (rect.attr('y')).toString();
                    console.log(x, y)
                  }) 
                  console.log(text.attr('x'), text.attr('y'))
                  console.log(circle.attr('cx'), circle.attr('cy'))
                  
                  rectsGroup.classed("dragging", false);
                }
              })
          );
        
        var tileX = tileGroup
                          .append('circle')
                          .attr('class', d => 'tileX ' + d.x.toString() + '-' + d.y.toString())
                          .attr('id', d => d.id + '-x');

        tileX
          .attr("cx", d => d.x + config.tile_x_x)
          .attr("cy", d => d.y + config.tile_x_y)
          .attr("r", config.tile_x_radius)
          .style("opacity", config.tile_x_opacity)
          .style("fill", config.tile_x_color)
          .on("click", function(d) {
            console.log('Tile X clicked');
            var rectsGroup = d3.select('#' + d.id + '-p').selectAll('rect').classed("dragging", true);
            var text = d3.select('#' + d.id + '-t').classed("dragging", true);
            var circle = d3.select('#' + d.id + '-x').classed("dragging", true);

            text.remove()
            circle.remove()

            var selection;
            rectsGroup._groups[0].forEach((rect, index) => {
              if (index > 0){
                selection = d3.select('#' + d.id + '-' + index.toString())
              } else {
                selection = d3.select('#' + d.id)
              }
              selection.remove()
            })
          })

        var tileText = tileGroup
                    .append('text')
                    .attr('class', d => 'tileText ' + d.x.toString() + '-' + d.y.toString())
                    .attr('id', d => d.id + '-t');

        tileText
          .attr("x", d => d.x + config.tile_text_x)
          .attr("y", d => d.y + config.tile_text_y)
          .text(d => d.name)
          .attr("font-family", config.tile_text_font)
          .attr("font-size", config.tile_text_size + 'px')
          .attr("fill", config.tile_text_color);

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
                            .attr('class', d => 'label ' + ((x + 2) + (number * d.width)) + '-' + (y + 2))
                            .attr('id', label.tile + '-' + number)
          thisLabel
            .attr("width", label.width)
            .attr("height", label.height)
            .attr("x", (x + 2) + (number * (label.width + 5)))
            .attr("y", (y + 2))
            .attr("rx", config.labels_edges_round)
            .attr("ry", config.labels_edges_round)
            .style("opacity", config.label_opacity)
            .style("fill", label.color)
            .on("click", function(d){
              removeLabel(this, d);
            });
        })
             
        const k = this.height / this.width

        const x = d3.scaleLinear()
                    .domain([-4.5, 4.5])
                    .range([0, window.innerWidth])

        const y = d3.scaleLinear()
                    .domain([-4.5 * k, 4.5 * k])
                    .range([window.innerHeight, 0])


        const zoom = d3
                      .zoom()
                      .scaleExtent([0.3, 32])
                      .on("zoom", () => {
                        const transform = d3.event.transform;
                        const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
                        const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
                        sectionGroup.attr("transform", transform).attr("stroke-width", 5 / transform.k);
                        tileGroup.attr("transform", transform).attr("stroke-width", 5 / transform.k);
                      });

        svgContainer.call(zoom).call(zoom.transform, d3.zoomIdentity);

      }
    }
  }
</script>