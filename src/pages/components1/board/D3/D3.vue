
<template>
  <div id="d3">
  </div>
</template>
 
<script>
  import * as d3 from "d3";
  import {event as d3Event, select, selectAll} from "d3-selection";

  export default {
    props: ['sections', 'tiles'],
    data() {
      return {
        height: window.innerWidth,
        width: window.innerWidth
      }
    },
    mounted() {
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

        var section = svgContainer.selectAll('.section')
                  .data(this.sections)
                  .enter()
                  .append('rect')
                  .attr('class', 'section')
                  .attr('id', function(d) { return d.x + d.y });
        
        section
          .attr("width", function (d) {
              return d.width + 12;
          })
          .attr("height", function (d) {
              return d.height + 12;
          })
          .attr("x", function (d) {
              return d.x - 6;
          })
          .attr("y", function (d) {
              return d.y - 6;
          })
          .attr("rx", 6)
          .attr("ry", 6)
          .style("fill", '#999')
          .style("opacity", 0.5)
          .on("click", function() {
            console.log(this.attributes)
          })
          .call(d3.drag()
            .on('start', function started() {
                var rect = d3.select(this).classed("dragging", true);
                
                var c = d3.select(this)
                
                d3.event.on("drag", dragged).on("end", ended);

                function dragged(d) {
                  var coords = d3.mouse(this);
                  var e = { x: coords[0], y: coords[1] }

                  var x = Number(this.attributes.x.value);
                  var y = Number(this.attributes.y.value);
                  var w = Number(this.attributes.width.value);
                  var h = Number(this.attributes.height.value);

                  var c1 = { x: x, y: y };
                  var c2 = { x: x + w, y: y };
                  var c3 = { x: x + w, y: y + h };
                  var c4 = { x: x, y: y + h };

                  // figure out which corner this is closest to
                  var d = [];
                  var m1 = distance(e, c1);
                  var m2 = distance(e, c2);
                  var m3 = distance(e, c3);
                  var m4 = distance(e, c4);
                  var min = Math.min(m1, m2, m3, m4)

                  // console.log(min, m1, m2, m3, m4)
                  if (min === m3) {
                    c
                      .attr('width', function () { return w + (e.x - c3.x); })
                      .attr('height', function () { return h + (e.y - c3.y); });
                  } else {
                    rect.raise().attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
                  }
                }

                function ended() {
                  console.log('section drag ends at:', this.attributes.x, this.attributes.y)
                  rect.classed("dragging", false);
                }
            })
          );

        var tile = svgContainer.selectAll('.tile')
                  .data(this.tiles)
                  .enter()
                  .append('rect')
                  .attr('class', 'tile')
                  .attr('id', function(d) { return d.x + d.y });

        tile
          .attr("width", function (d) {
              return d.width;
          })
          .attr("height", function (d) {
              return d.height;
          })
          .attr("x", function (d) {
              return d.x;
          })
          .attr("y", function (d) {
              return d.y;
          })
          .attr("rx", 6)
          .attr("ry", 6)
          .style("fill", function(d) { return d.color; })
          .call(
            d3.drag()
              .on("start", function started() {
                var rect = d3.select(this).classed("dragging", true);

                d3.event.on("drag", dragged).on("end", ended);

                function dragged(d) {
                  // console.log('dragged', d3.event.x, d3.event.y)
                  rect.raise().attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
                }

                function ended() {
                  console.log('tile drag ends at:', this.attributes.x, this.attributes.y)
                  rect.classed("dragging", false);
                }
              })
          );
             
        const k = this.height / this.width

        const x = d3.scaleLinear()
                    .domain([-4.5, 4.5])
                    .range([0, window.innerWidth])

        const y = d3.scaleLinear()
                    .domain([-4.5 * k, 4.5 * k])
                    .range([window.innerHeight, 0])


        const zoom = d3
                      .zoom()
                      .scaleExtent([0.5, 32])
                      .on("zoom", () => {
                        const transform = d3.event.transform;
                        const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
                        const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
                        section.attr("transform", transform).attr("stroke-width", 5 / transform.k);
                        tile.attr("transform", transform).attr("stroke-width", 5 / transform.k);
                      });

        svgContainer.call(zoom).call(zoom.transform, d3.zoomIdentity);

      }
    }
  }
</script>