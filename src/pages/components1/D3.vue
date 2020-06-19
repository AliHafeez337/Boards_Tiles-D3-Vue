
<template>
  <div id="d3">
    <h1>d3 component</h1>
  </div>
</template>
 
<script>
  import * as d3 from "d3";
  import {event as d3Event, select, selectAll} from "d3-selection";

  export default {
    data() {
      return {
        data: [
          { "x": 20, "color" : "green" },
          { "x": 220, "color" : "purple"},
          { "x": 420, "color" : "red"}
        ],
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

        //Draw the Rectangle
        var rectangle = svgContainer.selectAll("rect")
                                  .data(this.data)
                                  .enter()
                                  .append("rect");

        rectangle
          .attr("x", function (d) { return d.x; })
          .attr("y", function (d) { return 20 })
          .attr("width", 50)
          .attr("height", 100)
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
                  // console.log('drag end')
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
                        rectangle.attr("transform", transform).attr("stroke-width", 5 / transform.k);
                      });

        svgContainer.call(zoom).call(zoom.transform, d3.zoomIdentity);

      }
    }
  }
</script>